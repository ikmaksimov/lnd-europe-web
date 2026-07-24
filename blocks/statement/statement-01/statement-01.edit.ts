import type { EditSchema } from '@/lib/edit-schema';

/** Editable content of statement-01. Keys match Statement01Props. */
export const editSchema: EditSchema = {
  fields: [
    { key: 'eyebrow', label: 'Eyebrow', kind: 'text' },
    { key: 'text', label: 'Statement', kind: 'textarea' },
  ],
};
