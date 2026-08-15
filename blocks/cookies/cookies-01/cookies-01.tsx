'use client';

import { useEffect, useEffectEvent, useId, useRef, useState } from 'react';
import type { BlockBaseProps } from '@/lib/animations/types';
import {
  createConsentChoices,
  createConsentRecord,
  getConsentConfigurationError,
  isStoredChoice,
  parseStoredConsent,
  type ConsentCategory,
  type ConsentRecord,
} from './cookies-01.storage';

export type { ConsentCategory, ConsentRecord } from './cookies-01.storage';

interface ConsentLabels {
  accept?: string;
  decline?: string;
  preferences?: string;
  acceptOptional?: string;
  rejectOptional?: string;
  saveChoices?: string;
  returnToSummary?: string;
  alwaysActive?: string;
}

export interface Cookies01Props extends BlockBaseProps {
  text?: string;
  policy?: { label: string; href: string };
  labels?: ConsentLabels;
  storageKey?: string;
  onAccept?: () => void;
  onDecline?: () => void;
  onPreferences?: () => void;
  preferencesHref?: string;
  htmlId?: string;
  categories?: readonly ConsentCategory[];
  /** Bump when an existing category's purpose changes. Defaults to `1`. */
  consentVersion?: string;
  onChange?: (consent: ConsentRecord) => void;
}

export const defaults = {
  text: 'We use essential cookies to keep this site working and optional analytics only with your permission.',
  policy: { label: 'Privacy Policy', href: '/privacy' },
  labels: {
    accept: 'Accept',
    decline: 'Decline',
    preferences: 'Preferences',
    acceptOptional: 'Accept optional',
    rejectOptional: 'Reject optional',
    saveChoices: 'Save choices',
    returnToSummary: 'Return to summary',
    alwaysActive: 'Always active',
  },
} as const;

/**
 * cookies-01 — binary consent chrome by default, with opt-in granular purposes.
 * SSR deliberately renders the summary before localStorage is checked. Callback
 * props require a client parent because functions cannot cross a server boundary.
 * The block reports consent but never loads or blocks tags.
 *
 * @example
 * const [consent, setConsent] = useState<ConsentRecord | null>(null); // no tag yet
 * return <>{consent?.categories.analytics ? <AnalyticsTag /> : null}
 *   <Cookies01 categories={categories} onChange={setConsent} /></>;
 */
export function Cookies01(props: Cookies01Props) {
  const autoId = useId();
  const baseId = props.htmlId ?? autoId;

  return props.categories === undefined ? (
    <LegacyCookies01 {...props} titleId={`${baseId}-title`} />
  ) : (
    <GranularCookies01 {...props} categories={props.categories} baseId={baseId} />
  );
}

function LegacyCookies01({
  text = defaults.text,
  policy = defaults.policy,
  labels = defaults.labels,
  storageKey = 'trencadis:consent',
  onAccept,
  onDecline,
  onPreferences,
  preferencesHref,
  titleId,
}: Cookies01Props & { titleId: string }) {
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        setVisible(!isStoredChoice(localStorage.getItem(storageKey)));
      } catch {}
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [storageKey]);

  const choose = (choice: 'accept' | 'decline') => {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ choice, at: new Date().toISOString() })
      );
    } catch {}
    setVisible(false);
    if (choice === 'accept') onAccept?.();
    else onDecline?.();
  };

  if (ready && !visible) return null;

  return (
    <section
      role="region"
      aria-labelledby={titleId}
      className="fixed inset-x-0 bottom-0 z-40 p-3 sm:p-6"
    >
      <div className="bg-surface border-border mx-auto flex max-w-5xl flex-col gap-4 border p-5 shadow-lg sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <p id={titleId} className="text-foreground text-sm leading-relaxed">
            {text}{' '}
            <a
              className="text-foreground hover:text-foreground underline"
              href={policy.href}
            >
              {policy.label}
            </a>
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:flex-nowrap">
          {preferencesHref ? (
            <a
              href={preferencesHref}
              className="text-foreground border-border hover:bg-accent inline-flex min-h-10 items-center justify-center border px-4 py-2 text-sm font-medium"
            >
              {labels.preferences ?? 'Preferences'}
            </a>
          ) : (
            <button
              type="button"
              onClick={() => onPreferences?.()}
              className="text-foreground border-border hover:bg-accent inline-flex min-h-10 items-center justify-center border px-4 py-2 text-sm font-medium"
            >
              {labels.preferences ?? 'Preferences'}
            </button>
          )}
          <button
            type="button"
            onClick={() => choose('decline')}
            className="text-foreground border-border-strong hover:bg-accent inline-flex min-h-10 items-center justify-center border px-4 py-2 text-sm font-medium"
          >
            {labels.decline ?? 'Decline'}
          </button>
          <button
            type="button"
            onClick={() => choose('accept')}
            className="bg-primary text-primary-foreground border-primary inline-flex min-h-10 items-center justify-center border px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
          >
            {labels.accept ?? 'Accept'}
          </button>
        </div>
      </div>
    </section>
  );
}

function GranularCookies01({
  text = defaults.text,
  policy = defaults.policy,
  labels = defaults.labels,
  storageKey = 'trencadis:consent',
  onAccept,
  onDecline,
  categories,
  consentVersion = '1',
  onChange,
  baseId,
}: Cookies01Props & {
  categories: readonly ConsentCategory[];
  baseId: string;
}) {
  const titleId = `${baseId}-title`;
  const panelId = `${baseId}-preferences`;
  const panelTitleId = `${baseId}-preferences-title`;
  const configurationError = getConsentConfigurationError(categories);
  const configurationSignature = JSON.stringify({ consentVersion, categories });
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const [view, setView] = useState<'summary' | 'preferences'>('summary');
  const [choices, setChoices] = useState<Record<string, boolean>>(() =>
    createConsentChoices(categories)
  );
  const restoredReportRef = useRef<string | null>(null);
  const configurationErrorRef = useRef<string | null>(null);
  const sessionDecisionRef = useRef<{
    configurationKey: string;
    record: ConsentRecord;
  } | null>(null);

  const restoreConsent = useEffectEvent(() => {
    if (configurationError) {
      const errorKey = `${configurationSignature}:${configurationError}`;
      if (configurationErrorRef.current !== errorKey) {
        console.error(`Cookies01: ${configurationError}.`);
        configurationErrorRef.current = errorKey;
      }
      restoredReportRef.current = null;
      setChoices(createConsentChoices(categories));
      setVisible(true);
      setReady(true);
      return;
    }

    const configurationKey = `${storageKey}:${configurationSignature}`;
    if (sessionDecisionRef.current?.configurationKey === configurationKey) {
      setChoices(sessionDecisionRef.current.record.categories);
      setVisible(false);
      setReady(true);
      return;
    }

    let restored: ConsentRecord | null = null;
    try {
      restored = parseStoredConsent(
        localStorage.getItem(storageKey),
        categories,
        consentVersion
      );
    } catch {}

    if (restored) {
      const reportKey = `${storageKey}:${configurationSignature}:${JSON.stringify(restored)}`;
      setChoices(restored.categories);
      setVisible(false);
      if (restoredReportRef.current !== reportKey) {
        restoredReportRef.current = reportKey;
        onChange?.(restored);
      }
    } else {
      restoredReportRef.current = null;
      setChoices(createConsentChoices(categories));
      setVisible(true);
    }
    setReady(true);
  });

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (active) restoreConsent();
    });

    return () => {
      active = false;
    };
  }, [configurationError, configurationSignature, storageKey]);

  const commit = (
    nextChoices: Readonly<Record<string, boolean>>,
    legacyCallback?: () => void
  ) => {
    if (configurationError) return;
    const record = createConsentRecord(categories, nextChoices, consentVersion);
    const configurationKey = `${storageKey}:${configurationSignature}`;
    const reportKey = `${configurationKey}:${JSON.stringify(record)}`;
    try {
      localStorage.setItem(storageKey, JSON.stringify(record));
    } catch {}
    sessionDecisionRef.current = { configurationKey, record };
    restoredReportRef.current = reportKey;
    setChoices(record.categories);
    setView('summary');
    setVisible(false);
    onChange?.(record);
    legacyCallback?.();
  };

  const rejectOptional = () => commit(createConsentChoices(categories, false), onDecline);
  const acceptOptional = () => commit(createConsentChoices(categories, true), onAccept);

  if (ready && !visible) return null;

  return (
    <section
      role="region"
      aria-labelledby={view === 'preferences' ? panelTitleId : titleId}
      className="fixed inset-x-0 bottom-0 z-40 p-3 sm:p-6"
    >
      <div className="bg-surface border-border mx-auto max-h-[calc(100dvh-1.5rem)] max-w-5xl overflow-y-auto border p-5 shadow-lg sm:max-h-[calc(100dvh-3rem)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <p id={titleId} className="text-foreground text-sm leading-relaxed">
              {text}{' '}
              <a
                className="text-foreground hover:text-foreground underline"
                href={policy.href}
              >
                {policy.label}
              </a>
            </p>
          </div>

          {view === 'summary' ? (
            <div className="grid shrink-0 grid-cols-1 gap-2 sm:grid-cols-3">
              <button
                type="button"
                aria-controls={panelId}
                aria-expanded="false"
                disabled={Boolean(configurationError)}
                onClick={() => setView('preferences')}
                className="text-foreground border-border-strong hover:bg-accent inline-flex min-h-10 items-center justify-center border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              >
                {labels.preferences ?? 'Preferences'}
              </button>
              <button
                type="button"
                disabled={Boolean(configurationError)}
                onClick={rejectOptional}
                className="text-foreground border-border-strong hover:bg-accent inline-flex min-h-10 items-center justify-center border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              >
                {labels.rejectOptional ?? 'Reject optional'}
              </button>
              <button
                type="button"
                disabled={Boolean(configurationError)}
                onClick={acceptOptional}
                className="bg-primary text-primary-foreground border-primary inline-flex min-h-10 items-center justify-center border px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {labels.acceptOptional ?? 'Accept optional'}
              </button>
            </div>
          ) : null}
        </div>

        {view === 'preferences' ? (
          <div id={panelId} className="border-border mt-5 border-t pt-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2
                id={panelTitleId}
                className="font-display text-foreground font-semibold"
              >
                {labels.preferences ?? 'Preferences'}
              </h2>
              <button
                type="button"
                onClick={() => setView('summary')}
                className="text-muted hover:text-foreground rounded-token text-sm underline underline-offset-4 transition-colors"
              >
                {labels.returnToSummary ?? 'Return to summary'}
              </button>
            </div>

            <ul className="border-border mt-4 divide-y border-y">
              {categories.map((category, index) => {
                const inputId = `${baseId}-category-${index}`;
                const descriptionId = `${inputId}-description`;
                return (
                  <li key={category.id} className="flex gap-3 py-4">
                    <input
                      id={inputId}
                      type="checkbox"
                      checked={
                        category.required === true || choices[category.id] === true
                      }
                      disabled={category.required === true}
                      aria-describedby={descriptionId}
                      onChange={(event) =>
                        setChoices((current) => ({
                          ...current,
                          [category.id]: event.target.checked,
                        }))
                      }
                      className="border-border-strong accent-primary mt-1 h-4 w-4 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <label htmlFor={inputId} className="text-foreground font-medium">
                        {category.label}
                      </label>
                      {category.required ? (
                        <span className="text-muted ml-2 text-xs font-medium">
                          {labels.alwaysActive ?? 'Always active'}
                        </span>
                      ) : null}
                      <p
                        id={descriptionId}
                        className="text-muted mt-1 text-sm leading-relaxed [overflow-wrap:anywhere]"
                      >
                        {category.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={rejectOptional}
                className="text-foreground border-border-strong hover:bg-accent inline-flex min-h-10 items-center justify-center border px-4 py-2 text-sm font-medium transition-colors"
              >
                {labels.rejectOptional ?? 'Reject optional'}
              </button>
              <button
                type="button"
                onClick={() => commit(choices)}
                className="bg-primary text-primary-foreground border-primary inline-flex min-h-10 items-center justify-center border px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
              >
                {labels.saveChoices ?? 'Save choices'}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
