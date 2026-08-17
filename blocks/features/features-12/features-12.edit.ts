import type { EditSchema } from '@/lib/edit-schema';

/** Editable content of features-12. Point icons remain code-level ReactNodes. */
export const editSchema: EditSchema = {
  fields: [
    { key: 'heading', label: 'Heading', kind: 'textarea' },
    { key: 'lead', label: 'Lead paragraph', kind: 'textarea' },
    {
      key: 'points',
      label: 'Titled points',
      kind: 'array',
      itemLabel: 'Point',
      fields: [
        { key: 'title', label: 'Title', kind: 'text' },
        { key: 'description', label: 'Description', kind: 'textarea' },
      ],
    },
  ],
};
