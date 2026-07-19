import { Bookmark } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { NoteMeta } from "@/types/note";
import type { NoteStatus } from "@/types/progress";

interface NoteCardProps {
  note: NoteMeta;
  status: NoteStatus;
  bookmarked: boolean;
}

/** Status -> label + dot color. `switch` keeps the mapping exhaustive. */
function statusDot(status: NoteStatus): string {
  switch (status) {
    case "done":
      return "bg-green-500";
    case "revise":
      return "bg-amber-500";
    case "unread":
      return "bg-muted-foreground/30";
    default: {
      // Exhaustiveness: if NoteStatus grows, TS flags this line.
      const _never: never = status;
      return _never;
    }
  }
}

export function NoteCard({ note, status, bookmarked }: NoteCardProps) {
  return (
    <Link href={note.href}>
      <Card className="h-full transition-colors hover:border-primary/50 hover:bg-accent/40">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base leading-snug">{note.title}</CardTitle>
            {bookmarked && <Bookmark className="size-4 shrink-0 fill-primary text-primary" />}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className={cn("size-2 rounded-full", statusDot(status))} />
            {note.sectionTitle}
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
