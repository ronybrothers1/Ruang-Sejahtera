import { NextResponse } from 'next/server';
import { getCurrentUserSession } from '@/lib/auth/admin-session';
import { createProgramApplication } from '@/lib/program-applications';
import { programs } from '@/lib/content';
import { hasAllowedFormContentType, isDeclaredBodyWithinLimit } from '@/lib/security/request-limits';
import { isSameOriginRequest } from '@/lib/security/same-origin';

export const dynamic = 'force-dynamic';

const MAX_IMAGE_BYTES = 2_000_000;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
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
  if (!isDeclaredBodyWithinLimit(request, 3_500_000)) return NextResponse.json({ error: 'Payload terlalu besar.' }, { status: 413 });

  const session = await getCurrentUserSession();
  if (!session || session.role !== 'member' || !session.identityProviderId) return NextResponse.json({ error: 'Akun anggota diperlukan.' }, { status: 403 });

  const form = await request.formData();
  const programSlug = String(form.get('programSlug') || '').trim();
  if (!programs.some((program) => program.slug === programSlug)) return redirectWith(request, 'error=program');
  if (String(form.get('photoConsent') || '') !== 'yes') return redirectWith(request, 'error=consent', programSlug);

  const photo = form.get('existingPhoto');
  if (!(photo instanceof File) || photo.size === 0) return redirectWith(request, 'error=photo', programSlug);
  if (!ALLOWED_IMAGE_TYPES.has(photo.type) || photo.size > MAX_IMAGE_BYTES) return redirectWith(request, 'error=photo-format', programSlug);
  const photoAlt = value(form, 'existingPhotoAlt', 160);
  const bytes = Buffer.from(await photo.arrayBuffer());
  const details = Object.fromEntries(detailFields
    .map((key) => [key, String(form.get(key) || '').trim()])
    .filter(([, item]) => item.length > 0)) as Record<string, string>;

  try {
    await createProgramApplication({
      applicantUserId: session.id,
      programSlug,
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
      existingPhotoUrl: `data:${photo.type};base64,${bytes.toString('base64')}`,
      existingPhotoAlt: photoAlt,
    });
    return redirectWith(request, 'submitted=1');
  } catch (error) {
    if (error instanceof Error && error.message === 'APPLICATION_ALREADY_EXISTS') return redirectWith(request, 'error=exists', programSlug);
    if (error instanceof Error && error.message === 'APPLICATION_FIELD_INVALID') return redirectWith(request, 'error=field', programSlug);
    return redirectWith(request, 'error=save', programSlug);
  }
}
