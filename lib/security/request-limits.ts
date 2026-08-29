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
