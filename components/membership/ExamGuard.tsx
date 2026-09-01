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
  deadline: string;
  formId: string;
  children: ReactNode;
}) {
  const [remaining, setRemaining] = useState(() => new Date(deadline).getTime() - Date.now());

  useEffect(() => {
    let submitted = false;
    const tick = () => {
      const value = new Date(deadline).getTime() - Date.now();
      setRemaining(value);

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
    <div
      className="exam-guard"
      onCopy={(event) => event.preventDefault()}
      onCut={(event) => event.preventDefault()}
      onContextMenu={(event) => event.preventDefault()}
      onDragStart={(event) => event.preventDefault()}
    >
      <div
        className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-brand-red"
        role="timer"
        aria-live="polite"
      >
        Waktu tersisa: {formatRemaining(remaining)}
      </div>
      {children}
    </div>
  );
}
