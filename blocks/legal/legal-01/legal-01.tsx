import { useId, type ReactNode } from 'react';
import Link from 'next/link';
import type { BlockBaseProps } from '@/lib/animations/types';

export interface LegalTable {
  caption?: ReactNode;
  columns: readonly ReactNode[];
  rows: readonly (readonly ReactNode[])[];
}

export interface LegalSection {
  /** Public fragment id, e.g. `retention` → `/privacy#retention`. */
  id: string;
  title: ReactNode;
  tocLabel?: string;
  paragraphs?: readonly ReactNode[];
  items?: readonly ReactNode[];
  definitions?: readonly { term: ReactNode; description: ReactNode }[];
  tables?: readonly LegalTable[];
}

export interface Legal01Props extends BlockBaseProps {
  title: ReactNode;
  effectiveDate?: string;
  intro?: ReactNode;
  sections: readonly LegalSection[];
  showTableOfContents?: boolean;
  tableOfContentsLabel?: string;
  /** Scopes internal associations only; public section fragment ids stay literal. */
  htmlId?: string;
}

/**
 * legal-01 — a static, server-rendered frame for counsel-provided legal documents.
 * It owns reading geometry and semantics, but deliberately supplies no legal copy.
 */
export function Legal01({
  title,
  effectiveDate,
  intro,
  sections,
  showTableOfContents = false,
  tableOfContentsLabel = 'Contents',
  htmlId,
}: Legal01Props) {
  const autoId = useId();
  const baseId = htmlId ?? autoId;
  const titleId = `${baseId}-title`;
  const contentsLabelId = `${baseId}-contents-label`;

  assertValidSectionIds(sections);

  return (
    <article
      aria-labelledby={titleId}
      className="bg-background text-foreground px-4 py-12 sm:px-6 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-[72ch] min-w-0">
        <header className="border-border border-b pb-8 sm:pb-10">
          <h1
            id={titleId}
            className="font-display text-foreground text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl"
          >
            {title}
          </h1>
          {effectiveDate ? (
            <p className="text-muted mt-4 text-sm leading-6">
              Effective date:{' '}
              <time dateTime={effectiveDate} className="text-foreground">
                {effectiveDate}
              </time>
            </p>
          ) : null}
          {intro ? (
            <div className="text-muted mt-6 text-base leading-7 [overflow-wrap:anywhere]">
              {intro}
            </div>
          ) : null}
        </header>

        {showTableOfContents ? (
          <nav
            aria-labelledby={contentsLabelId}
            className="rounded-token border-border bg-surface mt-8 border p-5 sm:p-6"
          >
            <p
              id={contentsLabelId}
              className="font-display text-foreground font-semibold"
            >
              {tableOfContentsLabel}
            </p>
            <ol className="mt-4 space-y-2 pl-5 text-sm leading-6">
              {sections.map((section) => (
                <li key={section.id}>
                  <Link
                    href={`#${section.id}`}
                    className="text-muted hover:text-foreground rounded-token decoration-border-strong focus-visible:outline-primary [overflow-wrap:anywhere] underline underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
                  >
                    {section.tocLabel ?? section.title}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <div className="mt-10 space-y-12 sm:mt-12 sm:space-y-16">
          {sections.map((section, sectionIndex) => (
            <section key={section.id} aria-labelledby={section.id}>
              <h2
                id={section.id}
                className="font-display text-foreground scroll-mt-8 text-2xl leading-snug font-semibold tracking-tight sm:text-3xl"
              >
                {section.title}
              </h2>

              {section.paragraphs?.length ? (
                <div className="mt-5 space-y-5">
                  {section.paragraphs.map((paragraph, paragraphIndex) => (
                    <p
                      key={paragraphIndex}
                      className="text-foreground text-base leading-7 [overflow-wrap:anywhere]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : null}

              {section.items?.length ? (
                <ul className="marker:text-muted mt-5 list-disc space-y-2 pl-6 text-base leading-7">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="pl-1 [overflow-wrap:anywhere]">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}

              {section.definitions?.length ? (
                <dl className="mt-6 grid sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)]">
                  {section.definitions.map((definition, definitionIndex) => (
                    <Definition
                      key={definitionIndex}
                      term={definition.term}
                      description={definition.description}
                    />
                  ))}
                </dl>
              ) : null}

              {section.tables?.map((table, tableIndex) => (
                <LegalDataTable
                  key={tableIndex}
                  table={table}
                  sectionIndex={sectionIndex}
                  tableIndex={tableIndex}
                  baseId={baseId}
                />
              ))}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}

function Definition({ term, description }: { term: ReactNode; description: ReactNode }) {
  return (
    <>
      <dt className="border-border text-foreground border-b pt-5 font-medium [overflow-wrap:anywhere] first:pt-0 sm:py-4 sm:pr-6 sm:first:pt-4">
        {term}
      </dt>
      <dd className="border-border text-muted border-b pt-1 pb-5 leading-7 [overflow-wrap:anywhere] sm:py-4">
        {description}
      </dd>
    </>
  );
}

function LegalDataTable({
  table,
  sectionIndex,
  tableIndex,
  baseId,
}: {
  table: LegalTable;
  sectionIndex: number;
  tableIndex: number;
  baseId: string;
}) {
  const hasCaption = table.caption !== undefined && table.caption !== null;
  const captionId = `${baseId}-section-${sectionIndex}-table-${tableIndex}-caption`;
  const fallbackLabel = `Table ${tableIndex + 1} in section ${sectionIndex + 1}`;

  return (
    <div
      role="region"
      tabIndex={0}
      aria-labelledby={hasCaption ? captionId : undefined}
      aria-label={hasCaption ? undefined : fallbackLabel}
      className="rounded-token border-border focus-visible:outline-primary mt-8 max-w-full overflow-x-auto border focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      <table className="w-full min-w-[48rem] border-separate border-spacing-0 text-left text-sm leading-6">
        {hasCaption ? (
          <caption
            id={captionId}
            className="bg-surface text-foreground border-border border-b px-4 py-3 text-left font-medium"
          >
            {table.caption}
          </caption>
        ) : null}
        <thead>
          <tr>
            {table.columns.map((column, columnIndex) => (
              <th
                key={columnIndex}
                scope="col"
                className="bg-surface text-foreground border-border min-w-40 border-b px-4 py-3 align-top font-semibold break-words"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="text-foreground border-border min-w-40 border-b px-4 py-3 align-top break-words"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function assertValidSectionIds(sections: readonly LegalSection[]): void {
  const ids = new Set<string>();

  for (const section of sections) {
    if (section.id.trim().length === 0) {
      throw new Error('Legal01 section ids must be non-empty public fragments.');
    }
    if (ids.has(section.id)) {
      throw new Error(`Legal01 section id "${section.id}" is duplicated.`);
    }
    ids.add(section.id);
  }
}

/** Structural catalog fixture only; it is not legal advice or reusable policy copy. */
export function Legal01Catalog() {
  return (
    <Legal01
      title="Document structure preview"
      effectiveDate="2026-01-01"
      intro={
        <p>Structural placeholder only. Replace every line with counsel-provided text.</p>
      }
      showTableOfContents
      sections={[
        {
          id: 'scope',
          title: '1. Example section',
          paragraphs: [
            'This short paragraph demonstrates the document measure and clause rhythm.',
          ],
          items: ['Example list item', 'Another structural list item'],
        },
        {
          id: 'definitions',
          title: '2. Example definitions',
          definitions: [
            { term: 'Defined term', description: 'A structural definition description.' },
            { term: 'Second term', description: 'Another placeholder description.' },
          ],
        },
        {
          id: 'inventory',
          title: '3. Example inventory',
          tables: [
            {
              caption: 'Structural table example',
              columns: ['Item', 'Provider', 'Purpose', 'Duration'],
              rows: [
                ['Example A', 'Provider A', 'Placeholder purpose', 'Session'],
                ['Example B', 'Provider B', 'Placeholder purpose', 'One year'],
              ],
            },
          ],
        },
      ]}
    />
  );
}
