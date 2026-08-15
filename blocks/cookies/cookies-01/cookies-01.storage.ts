export interface ConsentCategory {
  id: string;
  label: string;
  description: string;
  /** Required categories are displayed as always active and cannot be toggled. */
  required?: boolean;
}

export interface ConsentRecord {
  version: string;
  categories: Record<string, boolean>;
  at: string;
}

/** True only for the current, complete consent record written by this block. */
export function isStoredChoice(value: string | null): boolean {
  if (!value) return false;
  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== 'object') return false;
    const { choice, at } = parsed as { choice?: unknown; at?: unknown };
    return (
      (choice === 'accept' || choice === 'decline') &&
      typeof at === 'string' &&
      !Number.isNaN(Date.parse(at))
    );
  } catch {
    return false;
  }
}

/** A developer-facing reason granular configuration cannot safely record consent. */
export function getConsentConfigurationError(
  categories: readonly ConsentCategory[]
): string | null {
  if (!categories.some((category) => category.required === true)) {
    return 'granular categories must include at least one required category';
  }

  const ids = new Set<string>();
  for (const category of categories) {
    if (category.id.trim().length === 0) {
      return 'granular category ids must be non-empty';
    }
    if (ids.has(category.id)) {
      return `granular category id "${category.id}" is duplicated`;
    }
    ids.add(category.id);
  }
  return null;
}

/** Required decisions are true; every optional purpose starts or resets false. */
export function createConsentChoices(
  categories: readonly ConsentCategory[],
  optionalValue = false
): Record<string, boolean> {
  return Object.fromEntries(
    categories.map((category) => [
      category.id,
      category.required === true ? true : optionalValue,
    ])
  );
}

/** Build a complete current record while enforcing required decisions. */
export function createConsentRecord(
  categories: readonly ConsentCategory[],
  choices: Readonly<Record<string, boolean>>,
  version: string,
  at = new Date().toISOString()
): ConsentRecord {
  return {
    version,
    categories: Object.fromEntries(
      categories.map((category) => [
        category.id,
        category.required === true ? true : choices[category.id] === true,
      ])
    ),
    at,
  };
}

/** Parse only an exact, current granular record; stale/foreign keys re-ask. */
export function parseStoredConsent(
  value: string | null,
  categories: readonly ConsentCategory[],
  version: string
): ConsentRecord | null {
  if (!value || getConsentConfigurationError(categories)) return null;

  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;

    const candidate = parsed as {
      version?: unknown;
      categories?: unknown;
      at?: unknown;
    };
    if (candidate.version !== version) return null;
    if (
      typeof candidate.at !== 'string' ||
      Number.isNaN(Date.parse(candidate.at)) ||
      !candidate.categories ||
      typeof candidate.categories !== 'object' ||
      Array.isArray(candidate.categories)
    ) {
      return null;
    }

    const stored = candidate.categories as Record<string, unknown>;
    const currentIds = new Set(categories.map((category) => category.id));
    const storedIds = Object.keys(stored);
    if (
      storedIds.length !== currentIds.size ||
      storedIds.some((id) => !currentIds.has(id))
    ) {
      return null;
    }

    const decisions: Record<string, boolean> = {};
    for (const category of categories) {
      const decision = stored[category.id];
      if (typeof decision !== 'boolean') return null;
      if (category.required === true && decision !== true) return null;
      decisions[category.id] = decision;
    }

    return { version, categories: decisions, at: candidate.at };
  } catch {
    return null;
  }
}
