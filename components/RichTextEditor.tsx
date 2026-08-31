'use client';

import { useRef, useState } from 'react';

const tools = [
  { command: 'formatBlock', value: 'p', label: 'Paragraf', text: 'P' },
  { command: 'formatBlock', value: 'h2', label: 'Judul tingkat 2', text: 'H2' },
  { command: 'formatBlock', value: 'h3', label: 'Judul tingkat 3', text: 'H3' },
  { command: 'bold', label: 'Tebal', text: 'B' },
  { command: 'italic', label: 'Miring', text: 'I' },
  { command: 'insertUnorderedList', label: 'Daftar berpoin', text: '•' },
  { command: 'insertOrderedList', label: 'Daftar bernomor', text: '1.' },
] as const;

export function RichTextEditor({ name, defaultValue, required = true }: { name: string; defaultValue?: string; required?: boolean }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(defaultValue || '');

  function syncValue() {
    setValue(editorRef.current?.innerHTML || '');
  }

  function execute(command: string, commandValue?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    syncValue();
  }

  function addLink() {
    const url = window.prompt('Masukkan URL https://');
    if (!url) return;
    if (!/^https?:\/\//i.test(url.trim())) return;
    execute('createLink', url.trim());
  }

  return (
    <div className="rich-text-editor">
      <div className="rich-text-toolbar" role="toolbar" aria-label="Format isi konten">
        {tools.map((tool) => (
          <button key={tool.label} type="button" aria-label={tool.label} title={tool.label} onMouseDown={(event) => event.preventDefault()} onClick={() => execute(tool.command, 'value' in tool ? tool.value : undefined)}>{tool.text}</button>
        ))}
        <button type="button" aria-label="Tambah tautan" title="Tambah tautan" onMouseDown={(event) => event.preventDefault()} onClick={addLink}>Link</button>
      </div>
      <div
        ref={editorRef}
        className="rich-text-surface"
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label="Isi konten"
        onInput={syncValue}
        dangerouslySetInnerHTML={{ __html: defaultValue || '' }}
      />
      <textarea name={name} value={value} onChange={() => undefined} required={required} hidden aria-hidden="true" tabIndex={-1} />
      <p className="mt-2 text-xs font-normal text-neutral-500">Gunakan H2 untuk subjudul utama dan H3 untuk subjudul turunannya.</p>
    </div>
  );
}
