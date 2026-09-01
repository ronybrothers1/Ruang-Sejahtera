import { NextResponse } from 'next/server';
import { getCurrentUserSession } from '@/lib/auth/admin-session';
import { createProgramApplication, resubmitProgramApplication } from '@/lib/program-applications';
import { programs } from '@/lib/content';
import { hasAllowedFormContentType, readFormDataWithinLimit, RequestBodyTooLargeError } from '@/lib/security/request-limits';
import { isSameOriginRequest } from '@/lib/security/same-origin';
import { deleteStoredImage, storeValidatedImage, validateImageFile } from '@/lib/security/image-upload';

export const dynamic = 'force-dynamic';

const detailFields = ['familyCount', 'condition', 'needDescription', 'businessType', 'businessDuration', 'currentCondition', 'assistanceNeed', 'houseCondition', 'occupants', 'damageDescription', 'waterSource', 'affectedFamilies', 'crisisDuration', 'schoolLevel', 'studentCount', 'educationNeed'] as const;

function value(form: FormData, key: string, max: number) {
  const result = String(form.get(key) || '').trim();
  if (!result || result.length > max) throw new Error('APPLICATION_FIELD_INVALID');
  return result;
}

function redirectWith(request: Request, query: string, programSlug?: string) {
  const destination = programSlug ? `/akun/pengajuan/${encodeURIComponent(programSlug)}?${query}` : `/akun/pengajuan?${query}`;
  return NextResponse.redirect(new URL(destination, request.url), 303);
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Permintaan ditolak.' }, { status: 403 });
  if (!hasAllowedFormContentType(request)) return NextResponse.json({ error: 'Content-Type tidak didukung.' }, { status: 415 });

  const session = await getCurrentUserSession();
  if (!session || session.role !== 'member' || !session.identityProviderId) return NextResponse.json({ error: 'Akun anggota diperlukan.' }, { status: 403 });

  let form: FormData;
  try {
    form = await readFormDataWithinLimit(request, 3_500_000);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) return NextResponse.json({ error: 'Payload terlalu besar.' }, { status: 413 });
    return NextResponse.json({ error: 'Formulir tidak valid.' }, { status: 400 });
  }
  const programSlug = String(form.get('programSlug') || '').trim();
  const intent = String(form.get('intent') || 'create').trim();
  const applicationId = String(form.get('applicationId') || '').trim();
  if (!programs.some((program) => program.slug === programSlug)) return redirectWith(request, 'error=program');
  if (!['create', 'resubmit'].includes(intent) || (intent === 'resubmit' && !applicationId)) return redirectWith(request, 'error=operation', programSlug);
  if (String(form.get('photoConsent') || '') !== 'yes') return redirectWith(request, 'error=consent', programSlug);

  const photo = form.get('existingPhoto');
  const newPhoto = photo instanceof File && photo.size > 0 ? photo : null;
  const hasNewPhoto = Boolean(newPhoto);
  const isResubmission = intent === 'resubmit' && Boolean(applicationId);
  if (!isResubmission && !hasNewPhoto) return redirectWith(request, 'error=photo', programSlug);
  const photoAlt = value(form, 'existingPhotoAlt', 160);
  const details = Object.fromEntries(detailFields
    .map((key) => [key, String(form.get(key) || '').trim()])
    .filter(([, item]) => item.length > 0)) as Record<string, string>;

  let objectKey: string | null = null;
  try {
    const storedImage = newPhoto
      ? await storeValidatedImage({ image: await validateImageFile(newPhoto), ownerId: session.id, visibility: 'private' })
      : undefined;
    objectKey = storedImage?.objectKey || null;
    const applicationInput = {
      beneficiaryName: value(form, 'beneficiaryName', 160),
      beneficiaryIdentity: value(form, 'beneficiaryIdentity', 120),
      phone: value(form, 'phone', 40),
      address: {
        street: value(form, 'addressStreet', 300),
        village: value(form, 'addressVillage', 120),
        district: value(form, 'addressDistrict', 120),
        regency: value(form, 'addressRegency', 120),
        province: value(form, 'addressProvince', 120),
      },
      details,
      existingPhotoMedia: storedImage,
      existingPhotoAlt: photoAlt,
    };

    if (isResubmission) {
      const result = await resubmitProgramApplication({
        ...applicationInput,
        id: applicationId,
        applicantUserId: session.id,
        programSlug,
      });
      objectKey = null;
      await Promise.allSettled([deleteStoredImage(result.replacedObjectKey)]);
      return redirectWith(request, 'resubmitted=1');
    }

    await createProgramApplication({
      ...applicationInput,
      applicantUserId: session.id,
      programSlug,
    });
    objectKey = null;
    return redirectWith(request, 'submitted=1');
  } catch (error) {
    await deleteStoredImage(objectKey);
    if (error instanceof Error && error.message === 'APPLICATION_ALREADY_EXISTS') return redirectWith(request, 'error=exists', programSlug);
    if (error instanceof Error && ['APPLICATION_NOT_FOUND', 'APPLICATION_RESUBMIT_NOT_ALLOWED', 'APPLICATION_RESUBMIT_CONFLICT'].includes(error.message)) return redirectWith(request, 'error=resubmit', programSlug);
    if (error instanceof Error && error.message === 'APPLICATION_FIELD_INVALID') return redirectWith(request, 'error=field', programSlug);
    if (error instanceof Error && ['IMAGE_FILE_INVALID', 'IMAGE_TYPE_INVALID', 'IMAGE_SIGNATURE_INVALID', 'IMAGE_DIMENSIONS_INVALID'].includes(error.message)) return redirectWith(request, 'error=photo-format', programSlug);
    return redirectWith(request, 'error=save', programSlug);
  }
}
