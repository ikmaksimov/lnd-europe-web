/** Motion intensity for a block. See docs/BLOCK-SPEC.md §8. */
export type AnimationLevel = 'none' | 'subtle' | 'rich';

/**
 * Props every block shares. Blocks extend this so the catalog can render any of
 * them uniformly (always passing `animationLevel`). See docs/BLOCK-SPEC.md §8.
 *
 * Lives in `@/lib/animations` — one of the few imports a block is allowed to
 * keep when copied into a client project (BLOCK-SPEC §1).
 */
export interface BlockBaseProps {
  /** Motion intensity. Defaults to the block's meta.json level. */
  animationLevel?: AnimationLevel;
}
