import type { EditSchema } from '@/lib/edit-schema';

/** Editable content of features-05. Keys match Features05Props; each feature
 * `icon` is a ReactNode code slot and is deliberately not PageDoc content. */
export const editSchema: EditSchema = {
  fields: [
    { key: 'eyebrow', label: 'Eyebrow', kind: 'text' },
    { key: 'heading', label: 'Heading', kind: 'text' },
    { key: 'subheading', label: 'Subheading', kind: 'textarea' },
    {
      key: 'items',
      label: 'Capabilities',
      kind: 'array',
      itemLabel: 'Capability',
      fields: [
        { key: 'title', label: 'Title', kind: 'text' },
        { key: 'description', label: 'Description', kind: 'textarea' },
      ],
    },
  ],
};
