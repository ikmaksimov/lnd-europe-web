import type { EditSchema } from '@/lib/edit-schema';

/** Editable scalar content of statement-06. */
export const editSchema: EditSchema = {
  fields: [
    { key: 'eyebrow', label: 'Eyebrow', kind: 'text' },
    { key: 'text', label: 'Statement', kind: 'textarea' },
    { key: 'flipTheme', label: 'Flip to dark theme', kind: 'boolean' },
  ],
};
