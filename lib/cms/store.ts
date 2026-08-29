import type { CmsCollection, CmsRecord } from '@/lib/cms/types';

export type CmsMutation = {
  collection: CmsCollection;
  action: 'create' | 'transition' | 'delete';
  records: CmsRecord[];
};

export interface CmsWriteAdapter {
  persist(mutation: CmsMutation): Promise<void>;
}

export function getCmsWriteStatus() {
  return {
    configured: false,
    mode: 'disabled' as const,
    reason: 'Backend tulis CMS belum dikonfigurasi. Data publik tetap dibaca dari content/cms/*.json.',
  };
}

export async function persistCmsMutation(mutation: CmsMutation): Promise<never> {
  void mutation;
  throw new Error('CMS_WRITE_BACKEND_UNAVAILABLE');
}
