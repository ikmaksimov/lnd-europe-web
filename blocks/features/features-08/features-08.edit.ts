import type { EditSchema } from '@/lib/edit-schema';

export const editSchema: EditSchema = {
  fields: [
    { key: 'eyebrow', label: 'Eyebrow', kind: 'text' },
    { key: 'heading', label: 'Heading', kind: 'textarea' },
    {
      key: 'groups',
      label: 'Capability groups',
      kind: 'array',
      itemLabel: 'Group',
      fields: [
        { key: 'heading', label: 'Group heading', kind: 'textarea' },
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
    },
  ],
};
