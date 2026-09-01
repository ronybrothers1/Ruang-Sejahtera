export function safeInternalRedirect(value: string | undefined | null, fallback = '/akun') {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return fallback;
  return value;
}
