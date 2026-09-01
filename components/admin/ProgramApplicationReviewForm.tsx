'use client';

import { useState } from 'react';
import type { ApplicationStatus } from '@/lib/program-applications';

export function ProgramApplicationReviewForm({ applicationId, currentStatus, reviewNote }: { applicationId: string; currentStatus: ApplicationStatus; reviewNote: string | null }) {
  const [status, setStatus] = useState<Exclude<ApplicationStatus, 'submitted'>>(
    currentStatus === 'submitted' ? 'under_review' : 'approved',
  );
  const noteRequired = status === 'revision_required' || status === 'rejected';

  return (
    <form action="/api/admin/program-applications" method="post" className="mt-4 grid gap-4 lg:grid-cols-[220px_1fr_auto] lg:items-end">
      <input type="hidden" name="id" value={applicationId} />
      <label className="text-sm font-bold">Status
        <select name="status" value={status} onChange={(event) => setStatus(event.target.value as Exclude<ApplicationStatus, 'submitted'>)} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 bg-white px-4 font-normal">
          <option value="under_review">Sedang direview</option>
          <option value="revision_required">Minta perbaikan</option>
          <option value="approved">Setujui pengajuan</option>
          <option value="rejected">Tolak pengajuan</option>
        </select>
      </label>
      <label className="text-sm font-bold">Catatan reviewer {noteRequired ? <span className="text-brand-red">(wajib)</span> : <span className="font-normal text-neutral-500">(opsional)</span>}
        <input name="reviewNote" required={noteRequired} maxLength={1000} defaultValue={reviewNote || ''} placeholder={noteRequired ? 'Jelaskan bagian yang harus diperbaiki atau alasan penolakan' : 'Tambahkan konteks bila diperlukan'} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" />
      </label>
      <button type="submit" className="button-primary">Simpan keputusan</button>
    </form>
  );
}
