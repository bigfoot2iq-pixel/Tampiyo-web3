export const CATEGORIES = [
  { id: 0, label: 'Bronze' },
  { id: 1, label: 'Silver' },
  { id: 2, label: 'Gold' },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]['id'];
export type CategoryLabel = (typeof CATEGORIES)[number]['label'];
