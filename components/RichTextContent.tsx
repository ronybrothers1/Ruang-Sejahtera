import { richTextHtml } from '@/lib/security/rich-text';

export function RichTextContent({ value, className = '' }: { value: string; className?: string }) {
  return <div className={`rich-text-content ${className}`} dangerouslySetInnerHTML={{ __html: richTextHtml(value) }} />;
}
