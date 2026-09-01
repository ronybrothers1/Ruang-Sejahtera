export function hasAllowedFormContentType(request: Request) {
  const contentType = request.headers.get('content-type')?.toLowerCase() || '';
  return contentType.startsWith('application/x-www-form-urlencoded') || contentType.startsWith('multipart/form-data');
}

export function isDeclaredBodyWithinLimit(request: Request, maxBytes: number) {
  const raw = request.headers.get('content-length');
  if (!raw) return true;
  const length = Number(raw);
  return Number.isFinite(length) && length >= 0 && length <= maxBytes;
}

export class RequestBodyTooLargeError extends Error {
  constructor() {
    super('REQUEST_BODY_TOO_LARGE');
    this.name = 'RequestBodyTooLargeError';
  }
}

/**
 * Reads a form request with a hard byte limit, including requests that omit or
 * spoof Content-Length. Keeping the limit here prevents individual route
 * handlers from accidentally parsing an unbounded body first.
 */
export async function readFormDataWithinLimit(request: Request, maxBytes: number) {
  if (!isDeclaredBodyWithinLimit(request, maxBytes)) throw new RequestBodyTooLargeError();

  const contentType = request.headers.get('content-type') || '';
  const reader = request.body?.getReader();
  if (!reader) return new FormData();

  const chunks: Uint8Array[] = [];
  let receivedBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      receivedBytes += value.byteLength;
      if (receivedBytes > maxBytes) {
        await reader.cancel();
        throw new RequestBodyTooLargeError();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(receivedBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return new Response(body, { headers: { 'content-type': contentType } }).formData();
}
