import { randomUUID } from 'node:crypto';
import { del, get, put } from '@vercel/blob';
import sharp from 'sharp';

export const MAX_IMAGE_BYTES = 2_000_000;
export const MAX_IMAGE_PIXELS = 25_000_000;
export const MAX_IMAGE_DIMENSION = 8_000;

const supportedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

export type ValidatedImage = {
  bytes: Buffer;
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp';
  byteSize: number;
  width: number | null;
  height: number | null;
};

export type StoredImage = {
  objectKey: string;
  externalUrl: string | null;
  mimeType: ValidatedImage['mimeType'];
  byteSize: number;
  width: number | null;
  height: number | null;
  visibility: 'private' | 'public';
};

function pngDimensions(bytes: Buffer) {
  if (bytes.length < 24) return null;
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

function jpegDimensions(bytes: Buffer) {
  let offset = 2;
  while (offset + 9 < bytes.length) {
    if (bytes[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = bytes[offset + 1];
    offset += 2;
    if (marker === 0xd8 || marker === 0xd9) continue;
    if (offset + 2 > bytes.length) return null;
    const segmentLength = bytes.readUInt16BE(offset);
    if (segmentLength < 2 || offset + segmentLength > bytes.length) return null;
    const isStartOfFrame = marker >= 0xc0 && marker <= 0xc3;
    if (isStartOfFrame || (marker >= 0xc5 && marker <= 0xc7) || (marker >= 0xc9 && marker <= 0xcb) || (marker >= 0xcd && marker <= 0xcf)) {
      if (offset + 7 > bytes.length) return null;
      return { width: bytes.readUInt16BE(offset + 5), height: bytes.readUInt16BE(offset + 3) };
    }
    offset += segmentLength;
  }
  return null;
}

function webpDimensions(bytes: Buffer) {
  if (bytes.length < 26) return null;
  const chunk = bytes.toString('ascii', 12, 16);
  if (chunk === 'VP8X' && bytes.length >= 30) {
    return {
      width: 1 + bytes[24] + (bytes[25] << 8) + (bytes[26] << 16),
      height: 1 + bytes[27] + (bytes[28] << 8) + (bytes[29] << 16),
    };
  }
  if (chunk === 'VP8 ' && bytes.length >= 30 && bytes[23] === 0x9d && bytes[24] === 0x01 && bytes[25] === 0x2a) {
    return { width: bytes.readUInt16LE(26) & 0x3fff, height: bytes.readUInt16LE(28) & 0x3fff };
  }
  if (chunk === 'VP8L' && bytes[20] === 0x2f) {
    return {
      width: 1 + (bytes[21] | ((bytes[22] & 0x3f) << 8)),
      height: 1 + ((bytes[22] >> 6) | (bytes[23] << 2) | ((bytes[24] & 0x0f) << 10)),
    };
  }
  return null;
}

function inspectImage(bytes: Buffer, declaredMimeType: string): ValidatedImage['mimeType'] | null {
  const isJpeg = bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const isPng = bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const isWebp = bytes.length >= 12 && bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP';
  const detected = isJpeg ? 'image/jpeg' : isPng ? 'image/png' : isWebp ? 'image/webp' : null;
  if (!detected || declaredMimeType !== detected) return null;
  return detected;
}

export async function validateImageFile(file: File, maxBytes = MAX_IMAGE_BYTES): Promise<ValidatedImage> {
  if (!(file instanceof File) || file.size <= 0 || file.size > maxBytes) throw new Error('IMAGE_FILE_INVALID');
  if (!supportedMimeTypes.has(file.type)) throw new Error('IMAGE_TYPE_INVALID');

  const bytes = Buffer.from(await file.arrayBuffer());
  const mimeType = inspectImage(bytes, file.type);
  if (!mimeType) throw new Error('IMAGE_SIGNATURE_INVALID');

  const sourceDimensions = mimeType === 'image/png'
    ? pngDimensions(bytes)
    : mimeType === 'image/jpeg'
      ? jpegDimensions(bytes)
      : webpDimensions(bytes);
  if (!sourceDimensions) throw new Error('IMAGE_DIMENSIONS_INVALID');
  if (!sourceDimensions.width || !sourceDimensions.height || sourceDimensions.width > MAX_IMAGE_DIMENSION || sourceDimensions.height > MAX_IMAGE_DIMENSION || sourceDimensions.width * sourceDimensions.height > MAX_IMAGE_PIXELS) {
    throw new Error('IMAGE_DIMENSIONS_INVALID');
  }

  try {
    const pipeline = sharp(bytes, { failOn: 'warning', limitInputPixels: MAX_IMAGE_PIXELS }).rotate();
    const sanitizedBytes = mimeType === 'image/jpeg'
      ? await pipeline.jpeg({ quality: 88, mozjpeg: true }).toBuffer()
      : mimeType === 'image/png'
        ? await pipeline.png({ compressionLevel: 9 }).toBuffer()
        : await pipeline.webp({ quality: 88 }).toBuffer();
    if (sanitizedBytes.length <= 0 || sanitizedBytes.length > maxBytes) throw new Error('IMAGE_FILE_INVALID');
    const metadata = await sharp(sanitizedBytes, { limitInputPixels: MAX_IMAGE_PIXELS }).metadata();
    if (!metadata.width || !metadata.height) throw new Error('IMAGE_DIMENSIONS_INVALID');
    return {
      bytes: sanitizedBytes,
      mimeType,
      byteSize: sanitizedBytes.length,
      width: metadata.width,
      height: metadata.height,
    };
  } catch (error) {
    if (error instanceof Error && ['IMAGE_FILE_INVALID', 'IMAGE_DIMENSIONS_INVALID'].includes(error.message)) throw error;
    throw new Error('IMAGE_PROCESSING_FAILED');
  }
}

export function isBlobStorageConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim() || (process.env.BLOB_STORE_ID?.trim() && process.env.VERCEL_OIDC_TOKEN?.trim()));
}

export async function storeValidatedImage(input: {
  image: ValidatedImage;
  ownerId: string;
  visibility: 'private' | 'public';
}) {
  if (!isBlobStorageConfigured()) throw new Error('MEDIA_STORAGE_NOT_CONFIGURED');
  const extension = input.image.mimeType === 'image/jpeg' ? 'jpg' : input.image.mimeType.slice('image/'.length);
  const objectKey = `${input.visibility}/${input.ownerId}/${randomUUID()}.${extension}`;
  const blob = await put(objectKey, input.image.bytes, {
    access: input.visibility,
    addRandomSuffix: false,
    contentType: input.image.mimeType,
    cacheControlMaxAge: input.visibility === 'public' ? 86_400 : 0,
  });
  return {
    objectKey: blob.pathname,
    externalUrl: input.visibility === 'public' ? blob.url : null,
    mimeType: input.image.mimeType,
    byteSize: input.image.byteSize,
    width: input.image.width,
    height: input.image.height,
    visibility: input.visibility,
  } satisfies StoredImage;
}

export async function deleteStoredImage(objectKey: string | null | undefined) {
  if (!objectKey || !isBlobStorageConfigured()) return;
  await del(objectKey);
}

export async function promoteStoredImage(input: StoredImage & { ownerId: string }) {
  if (input.visibility !== 'private') return input;
  if (!isBlobStorageConfigured()) throw new Error('MEDIA_STORAGE_NOT_CONFIGURED');
  const blob = await get(input.objectKey, { access: 'private', useCache: false });
  if (!blob || blob.statusCode !== 200 || !blob.stream) throw new Error('MEDIA_PRIVATE_SOURCE_NOT_FOUND');
  const bytes = Buffer.from(await new Response(blob.stream).arrayBuffer());
  if (bytes.length !== input.byteSize || bytes.length > MAX_IMAGE_BYTES) throw new Error('MEDIA_PRIVATE_SOURCE_INVALID');
  if (inspectImage(bytes, input.mimeType) !== input.mimeType) throw new Error('MEDIA_PRIVATE_SOURCE_INVALID');
  return storeValidatedImage({
    ownerId: input.ownerId,
    visibility: 'public',
    image: {
      bytes,
      mimeType: input.mimeType,
      byteSize: input.byteSize,
      width: input.width,
      height: input.height,
    },
  });
}
