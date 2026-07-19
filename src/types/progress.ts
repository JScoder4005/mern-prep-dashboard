/**
 * Per-note study progress. Stored client-side in localStorage (Phase 1).
 * Keyed by note slug.
 */

export type NoteStatus = "unread" | "revise" | "done";

export interface NoteProgress {
  status: NoteStatus;
  bookmarked: boolean;
  updatedAt: number; // epoch ms
}

/** slug -> progress. Index access is `NoteProgress | undefined` (noUncheckedIndexedAccess). */
export type ProgressMap = Record<string, NoteProgress>;
