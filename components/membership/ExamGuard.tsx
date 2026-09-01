'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

function formatRemaining(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':');
}

export function ExamGuard({
  deadline,
  formId,
  children,
}: {
  deadline: string | null;
  formId: string;
  children: ReactNode;
}) {
  const [remaining, setRemaining] = useState(() => deadline ? new Date(deadline).getTime() - Date.now() : null);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (!deadline) return;
    let submitted = false;
    let previousSeconds = Math.ceil((new Date(deadline).getTime() - Date.now()) / 1000);
    const milestones = [600, 300, 60, 10];
    const tick = () => {
      const value = new Date(deadline).getTime() - Date.now();
      setRemaining(value);
      const seconds = Math.max(0, Math.ceil(value / 1000));
      const milestone = milestones.find((item) => previousSeconds > item && seconds <= item);
      if (milestone) setAnnouncement(`Sisa waktu ${formatRemaining(milestone * 1000)}.`);
      previousSeconds = seconds;

      if (value <= 0 && !submitted) {
        submitted = true;
        const form = document.getElementById(formId) as HTMLFormElement | null;
        form?.submit();
      }
    };

    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [deadline, formId]);

  return (
    <div className="exam-guard">
      {deadline && remaining !== null ? (
        <div
          className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-brand-red"
          role="timer"
          aria-label={`Waktu tersisa ${formatRemaining(remaining)}`}
        >
          Waktu tersisa: {formatRemaining(remaining)}
        </div>
      ) : (
        <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm font-bold text-blue-900" role="status">
          Akomodasi aktif: tes ini tidak memiliki batas waktu.
        </div>
      )}
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
      {children}
    </div>
  );
}
