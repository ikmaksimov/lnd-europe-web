/**
 * editSchema — a typed, machine-readable description of a block's editable
 * content (Page Editor foundation, Stage 0).
 *
 * `meta.json.contentSlots` is human prose ("main heading, 4–8 words"): good for
 * the catalog, useless for generating inputs. An `EditSchema` instead declares
 * each editable prop with a `kind` a form can render, so the future Properties
 * panel is generated, not hand-written per block.
 *
 * A block's schema is co-located as `<block>.edit.ts` in its own variant folder,
 * so it travels with the block when copied into a client project (BLOCK-SPEC) —
 * the same schema drives the Studio Page Editor (exports code) and a future
 * client-side CMS (persists edits).
 *
 * This module is the vocabulary only. It does not read or write block props, and
 * nothing here runs at render time.
 */

export type EditFieldKind =
  | 'text' // single-line string
  | 'textarea' // multi-line string
  | 'boolean' // a flag
  | 'select' // a string from a fixed option list
  | 'image' // { src, alt }
  | 'link' // { href } or { label, href }
  | 'group' // a fixed object of nested fields
  | 'array'; // an ordered list whose items follow a nested field set

interface EditFieldBase {
  /** Prop key on the block. Inside a group/array item it is relative to the parent. */
  key: string;
  /** Human label for the Properties panel. */
  label: string;
}

export type EditField =
  | (EditFieldBase & { kind: 'text' | 'textarea' | 'boolean' | 'image' })
  | (EditFieldBase & { kind: 'select'; options: string[] })
  | (EditFieldBase & { kind: 'link'; withLabel?: boolean })
  | (EditFieldBase & { kind: 'group'; fields: EditField[] })
  | (EditFieldBase & { kind: 'array'; itemLabel?: string; fields: EditField[] });

export interface EditSchema {
  /** Fields in the order the Properties panel should show them. */
  fields: EditField[];
}
