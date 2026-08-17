import type { EditSchema } from '@/lib/edit-schema';

/** Editable content of faq-01. Keys match Faq01Props (FaqItem from faq-data). */
export const editSchema: EditSchema = {
  fields: [
    { key: 'eyebrow', label: 'Eyebrow', kind: 'text' },
    { key: 'heading', label: 'Heading', kind: 'text' },
    {
      key: 'items',
      label: 'Questions',
      kind: 'array',
      itemLabel: 'Question',
      fields: [
        { key: 'question', label: 'Question', kind: 'text' },
        { key: 'answer', label: 'Answer', kind: 'textarea' },
      ],
    },
  ],
};
