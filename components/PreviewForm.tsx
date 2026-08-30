"use client";

import type { FormEvent, ReactNode } from 'react';

type PreviewFormProps = {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  describedBy?: string;
};

/**
 * A deliberately non-submitting form for public preview flows.
 *
 * Keeping the submit guard here ensures keyboard submission cannot leak
 * example contact or donation data to the current route.
 */
export function PreviewForm({ children, className, ariaLabel, describedBy }: PreviewFormProps) {
  const preventPreviewSubmission = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form
      className={className}
      aria-label={ariaLabel}
      aria-describedby={describedBy}
      data-preview-form
      onSubmit={preventPreviewSubmission}
    >
      {children}
    </form>
  );
}
