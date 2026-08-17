import type { EditSchema } from '@/lib/edit-schema';

/** Editable content of cta-02. Keys match Cta02Props (the badge and CTA `icon`
 *  ReactNodes are not editable content, so they are omitted). */
export const editSchema: EditSchema = {
  fields: [
    { key: 'title', label: 'Title', kind: 'text' },
    { key: 'subtitle', label: 'Subtitle', kind: 'text' },
    { key: 'primaryCta', label: 'Primary CTA', kind: 'link', withLabel: true },
    {
      key: 'actionCorners',
      label: 'Action corners',
      kind: 'select',
      options: ['default', 'sharp'],
    },
    {
      key: 'footnote',
      label: 'Footnote',
      kind: 'group',
      fields: [
        { key: 'marker', label: 'Marker', kind: 'text' },
        { key: 'href', label: 'Link', kind: 'text' },
      ],
    },
    {
      key: 'background',
      label: 'Background',
      kind: 'select',
      options: ['gradient', 'plain'],
    },
    { key: 'fullHeight', label: 'Full height', kind: 'boolean' },
  ],
};
