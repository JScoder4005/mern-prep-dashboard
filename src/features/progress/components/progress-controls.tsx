"use client";

import { Bookmark, Check, RotateCcw } from "lucide-react";
import { useProgress } from "@/features/progress/hooks/use-progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProgressControlsProps {
  slug: string;
}

/** Per-note actions on the detail page. Client island; reads/writes localStorage. */
export function ProgressControls({ slug }: ProgressControlsProps) {
  const { progress, ready, setStatus, toggleBookmark } = useProgress();
  const entry = ready ? progress[slug] : undefined;
  const status = entry?.status ?? "unread";
  const bookmarked = entry?.bookmarked ?? false;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant={status === "done" ? "default" : "outline"}
        size="sm"
        onClick={() => setStatus(slug, status === "done" ? "unread" : "done")}
      >
        <Check className="size-4" />
        {status === "done" ? "Done" : "Mark done"}
      </Button>

      <Button
        variant={status === "revise" ? "default" : "outline"}
        size="sm"
        onClick={() => setStatus(slug, status === "revise" ? "unread" : "revise")}
      >
        <RotateCcw className="size-4" />
        {status === "revise" ? "Revising" : "Revise"}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => toggleBookmark(slug)}
        aria-pressed={bookmarked}
      >
        <Bookmark className={cn("size-4", bookmarked && "fill-primary text-primary")} />
        {bookmarked ? "Saved" : "Bookmark"}
      </Button>
    </div>
  );
}
