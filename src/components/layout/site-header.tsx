import { BookOpen } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

// Server Component shell; the ThemeToggle is the only client island inside it.
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border/60 bg-background/80 px-6 py-4 backdrop-blur">
      <Link href="/" className="flex items-center gap-2 font-semibold">
        <BookOpen className="size-5 text-primary" />
        PrepDeck
      </Link>
      <nav className="flex items-center gap-1">
        <Link
          href="/notes"
          className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          Browse
        </Link>
        <Link
          href="/playground"
          className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          Playground
        </Link>
        <Link
          href="/progress"
          className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          Progress
        </Link>
        <ThemeToggle />
      </nav>
    </header>
  );
}
