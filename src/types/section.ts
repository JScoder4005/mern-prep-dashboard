import type { NoteMeta } from "@/types/note";

/** A top-level section (folder), e.g. "JavaScript", "DSA". */
export interface Section {
  slug: string; // "javascript"
  title: string; // "JavaScript"
  order: number; // from the NN- folder prefix, for stable ordering
  href: string; // "/sections/javascript"
  notes: NoteMeta[];
}
