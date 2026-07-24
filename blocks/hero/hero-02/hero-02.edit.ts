import type { EditSchema } from '@/lib/edit-schema';

/** Editable content of hero-02. Keys match Hero02Props (each reassurance item's
 *  `icon` ReactNode is not editable content, so it is omitted). */
export const editSchema: EditSchema = {
  fields: [
    { key: 'eyebrow', label: 'Eyebrow', kind: 'text' },
    { key: 'badge', label: 'Badge', kind: 'text' },
    { key: 'title', label: 'Title', kind: 'text' },
    { key: 'subtitle', label: 'Subtitle', kind: 'textarea' },
    { key: 'primaryCta', label: 'Primary CTA', kind: 'link', withLabel: true },
    { key: 'secondaryCta', label: 'Secondary CTA', kind: 'link', withLabel: true },
    { key: 'background', label: 'Background image', kind: 'image' },
    { key: 'overlay', label: 'Legibility scrim', kind: 'boolean' },
    { key: 'headingLevel', label: 'Heading level', kind: 'select', options: ['h1', 'h2'] },
    {
      key: 'items',
      label: 'Reassurance strip',
      kind: 'array',
      itemLabel: 'Item',
      fields: [{ key: 'label', label: 'Label', kind: 'text' }],
    },
  ],
};
