const allowedTags = new Set(['p', 'h2', 'h3', 'strong', 'em', 'ul', 'ol', 'li', 'blockquote', 'br', 'a']);

function escapeAttribute(value: string) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function safeHref(value: string) {
  try {
    const trimmed = value.trim();
    if (!/^(https?:\/\/|mailto:)/i.test(trimmed)) return null;
    const url = new URL(trimmed);
    if (!['https:', 'http:', 'mailto:'].includes(url.protocol)) return null;
    if (url.protocol === 'mailto:') return trimmed;
    return url.href;
  } catch {
    return null;
  }
}

/** Strict allow-list sanitizer for the small HTML subset produced by the editor. */
export function sanitizeRichText(value: string) {
  const withoutDangerousBlocks = value
    .replace(/<\s*(script|style|iframe|object|embed|form|textarea|select|button)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');

  return withoutDangerousBlocks.replace(/<\/?\s*([a-z0-9]+)([^>]*)>/gi, (full, rawTag: string, rawAttributes: string) => {
    const tag = rawTag.toLowerCase();
    if (!allowedTags.has(tag)) return '';
    if (full.startsWith('</')) return `</${tag}>`;
    if (tag === 'br') return '<br />';
    if (tag !== 'a') return `<${tag}>`;
    const hrefMatch = rawAttributes.match(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    const href = safeHref(hrefMatch?.[1] || hrefMatch?.[2] || hrefMatch?.[3] || '');
    return href ? `<a href="${escapeAttribute(href)}" rel="nofollow noopener noreferrer">` : '';
  });
}

export function richTextPlainLength(value: string) {
  return sanitizeRichText(value).replace(/<[^>]*>/g, '').replace(/&(?:amp|lt|gt|quot);/g, 'x').trim().length;
}

export function richTextHtml(value: string) {
  const sanitized = sanitizeRichText(value).trim();
  if (!sanitized) return '';
  if (/<(?:p|h2|h3|ul|ol|blockquote|br)\b/i.test(sanitized)) return sanitized;
  return `<p>${sanitized.replace(/\r?\n/g, '<br />')}</p>`;
}
