import type { EditSchema } from '@/lib/edit-schema';

/** Editable content of features-06. Item point icons are ReactNode code slots
 * and deliberately omitted from serialized PageDoc content. */
export const editSchema: EditSchema = {
  fields: [
    { key: 'heading', label: 'Heading', kind: 'text' },
    { key: 'subheading', label: 'Subheading', kind: 'textarea' },
    {
      key: 'items',
      label: 'Showcase cards',
      kind: 'array',
      itemLabel: 'Card',
      fields: [
        { key: 'badge', label: 'Badge', kind: 'text' },
        { key: 'eyebrow', label: 'Heading lead-in', kind: 'text' },
        { key: 'title', label: 'Title', kind: 'text' },
        { key: 'description', label: 'Description', kind: 'textarea' },
        { key: 'image', label: 'Image', kind: 'image' },
        {
          key: 'points',
          label: 'Sub-features',
          kind: 'array',
          itemLabel: 'Point',
          fields: [
            { key: 'title', label: 'Title', kind: 'text' },
            { key: 'description', label: 'Description', kind: 'textarea' },
          ],
        },
      ],
    },
  ],
};
