"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { NoteCard } from "@/features/notes/components/note-card";
import { useProgress } from "@/features/progress/hooks/use-progress";
import { useSearch } from "@/features/search/hooks/use-search";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { NoteMeta } from "@/types/note";
import type { NoteStatus } from "@/types/progress";
import type { SearchDoc } from "@/types/search";

type StatusFilter = "all" | NoteStatus | "bookmarked";

interface NotesBrowserProps {
  notes: NoteMeta[];
  docs: SearchDoc[];
  sections: Array<{ slug: string; title: string }>;
}

const STATUS_FILTERS: Array<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "revise", label: "Revise" },
  { value: "done", label: "Done" },
  { value: "bookmarked", label: "Bookmarked" },
];

export function NotesBrowser({ notes, docs, sections }: NotesBrowserProps) {
  const [query, setQuery] = useState("");
  const [section, setSection] = useState<string>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const { progress, ready } = useProgress();

  const searchResults = useSearch(docs, query);

  // slug -> NoteMeta, so we can render search hits (which carry only slugs) as cards.
  // useMemo: this map only depends on `notes`, not on every keystroke.
  const bySlug = useMemo(() => {
    const map = new Map<string, NoteMeta>();
    for (const note of notes) map.set(note.slug, note);
    return map;
  }, [notes]);

  // Compose: search order -> section filter -> status filter.
  // useMemo so filtering doesn't re-run unless an input actually changes.
  const visible = useMemo(() => {
    return searchResults
      .map((doc) => bySlug.get(doc.slug))
      .filter((note): note is NoteMeta => Boolean(note))
      .filter((note) => section === "all" || note.sectionSlug === section)
      .filter((note) => {
        const entry = progress[note.slug];
        switch (status) {
          case "all":
            return true;
          case "bookmarked":
            return entry?.bookmarked === true;
          case "unread":
            return !entry || entry.status === "unread";
          default:
            return entry?.status === status;
        }
      });
  }, [searchResults, bySlug, section, status, progress]);

  return (
    <div>
      <div className="relative mb-4">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search 74 notes…"
          className="pl-9"
          autoFocus
        />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <FilterPill active={section === "all"} onClick={() => setSection("all")}>
          All sections
        </FilterPill>
        {sections.map((s) => (
          <FilterPill key={s.slug} active={section === s.slug} onClick={() => setSection(s.slug)}>
            {s.title}
          </FilterPill>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <FilterPill key={f.value} active={status === f.value} onClick={() => setStatus(f.value)}>
            {f.label}
          </FilterPill>
        ))}
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        {visible.length} {visible.length === 1 ? "note" : "notes"}
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((note) => {
          const entry = progress[note.slug];
          return (
            <NoteCard
              key={note.slug}
              note={note}
              // Before hydration `ready` is false — render neutral to avoid mismatch.
              status={ready && entry ? entry.status : "unread"}
              bookmarked={ready && entry ? entry.bookmarked : false}
            />
          );
        })}
      </div>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-sm transition-colors",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
