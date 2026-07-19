"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useProgress } from "@/features/progress/hooks/use-progress";
import type { NoteMeta } from "@/types/note";

interface ProgressDashboardProps {
  notes: NoteMeta[];
}

export function ProgressDashboard({ notes }: ProgressDashboardProps) {
  const { progress, ready, stats } = useProgress();
  const total = notes.length;
  const pct = total ? Math.round((stats.done / total) * 100) : 0;

  // Bucket notes by their current status/bookmark for the lists below.
  // useMemo: only recompute when notes or progress change, not every render.
  const { toRevise, bookmarked, completed } = useMemo(() => {
    const toRevise: NoteMeta[] = [];
    const bookmarked: NoteMeta[] = [];
    const completed: NoteMeta[] = [];
    for (const note of notes) {
      const entry = progress[note.slug];
      if (!entry) continue;
      if (entry.status === "revise") toRevise.push(note);
      if (entry.status === "done") completed.push(note);
      if (entry.bookmarked) bookmarked.push(note);
    }
    return { toRevise, bookmarked, completed };
  }, [notes, progress]);

  if (!ready) {
    return <p className="text-muted-foreground">Loading your progress…</p>;
  }

  return (
    <div className="space-y-10">
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Completed" value={`${stats.done}/${total}`} />
        <Stat label="% Done" value={`${pct}%`} />
        <Stat label="To revise" value={stats.revise} />
        <Stat label="Bookmarked" value={stats.bookmarked} />
      </section>

      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
      </div>

      <NoteList title="To revise" notes={toRevise} empty="Nothing marked for revision." />
      <NoteList title="Bookmarked" notes={bookmarked} empty="No bookmarks yet." />
      <NoteList title="Completed" notes={completed} empty="No notes completed yet." />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function NoteList({ title, notes, empty }: { title: string; notes: NoteMeta[]; empty: string }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">
        {title} <span className="text-sm font-normal text-muted-foreground">({notes.length})</span>
      </h2>
      {notes.length === 0 ? (
        <p className="text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {notes.map((note) => (
            <li key={note.slug}>
              <Link
                href={note.href}
                className="rounded-full border border-border px-3 py-1 text-sm hover:border-primary/50 hover:text-primary"
              >
                {note.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
