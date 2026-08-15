import type { EditSchema } from '@/lib/edit-schema';
export const editSchema: EditSchema = {
  fields: [
    { key: 'text', label: 'Consent text', kind: 'textarea' },
    { key: 'policy', label: 'Privacy link', kind: 'link', withLabel: true },
    {
      key: 'labels',
      label: 'Labels',
      kind: 'group',
      fields: [
        { key: 'accept', label: 'Accept', kind: 'text' },
        { key: 'decline', label: 'Decline', kind: 'text' },
        { key: 'preferences', label: 'Preferences', kind: 'text' },
        { key: 'acceptOptional', label: 'Accept optional', kind: 'text' },
        { key: 'rejectOptional', label: 'Reject optional', kind: 'text' },
        { key: 'saveChoices', label: 'Save choices', kind: 'text' },
        { key: 'returnToSummary', label: 'Return to summary', kind: 'text' },
        { key: 'alwaysActive', label: 'Always active', kind: 'text' },
      ],
    },
  ],
};
