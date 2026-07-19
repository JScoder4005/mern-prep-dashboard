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
      <ThemeToggle />
    </header>
  );
}
