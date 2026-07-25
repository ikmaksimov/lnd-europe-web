import type { EditSchema } from '@/lib/edit-schema';

/** Editable content of features-01. Keys match Features01Props (each Feature's
 *  `icon` ReactNode is not editable content, so it is omitted). */
export const editSchema: EditSchema = {
  fields: [
    { key: 'eyebrow', label: 'Eyebrow', kind: 'text' },
    { key: 'heading', label: 'Heading', kind: 'text' },
    { key: 'subheading', label: 'Subheading', kind: 'textarea' },
    {
      key: 'items',
      label: 'Features',
      kind: 'array',
      itemLabel: 'Feature',
      fields: [
        { key: 'title', label: 'Title', kind: 'text' },
        { key: 'description', label: 'Description', kind: 'textarea' },
      ],
    },
  ],
};
