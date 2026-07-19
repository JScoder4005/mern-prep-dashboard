import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { getAllNoteParams, getNote, getNoteMeta, getSections } from "@/lib/content/notes";
import type { NoteMeta } from "@/types/note";

// Next 16: both dynamic segments arrive as an awaited Promise.
type NotePageProps = { params: Promise<{ section: string; slug: string }> };

// Prerender every note page at build time.
export function generateStaticParams() {
  return getAllNoteParams();
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { section, slug } = await params;
  const meta = getNoteMeta(section, slug); // cheap — no markdown render
  return { title: meta ? `${meta.title} — PrepDeck` : "PrepDeck" };
}

/** Find previous/next notes within the same section (alphabetical order). */
function getSiblings(sectionSlug: string, slug: string): { prev?: NoteMeta; next?: NoteMeta } {
  const section = getSections().find((s) => s.slug === sectionSlug);
  if (!section) return {};
  const index = section.notes.findIndex((n) => n.slug === slug);
  if (index === -1) return {};
  return {
    prev: section.notes[index - 1],
    next: section.notes[index + 1],
  };
}

export default async function NotePage({ params }: NotePageProps) {
  const { section, slug } = await params;
  const note = await getNote(section, slug);
  if (!note) notFound();

  const { prev, next } = getSiblings(section, slug);

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <nav className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="size-4" />
          <Link href={`/sections/${note.sectionSlug}`} className="hover:text-foreground">
            {note.sectionTitle}
          </Link>
          <ChevronRight className="size-4" />
          <span className="text-foreground">{note.title}</span>
        </nav>

        {/* Rendered markdown. `html` is trusted: it's our own build-time content. */}
        <article
          className="prose prose-neutral max-w-none dark:prose-invert prose-pre:p-0"
          dangerouslySetInnerHTML={{ __html: note.html }}
        />

        {note.backlinks.length > 0 && (
          <section className="mt-12 border-t border-border pt-6">
            <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Linked from</h2>
            <ul className="flex flex-wrap gap-2">
              {note.backlinks.map((b) => (
                <li key={b.slug}>
                  <Link
                    href={b.href}
                    className="rounded-full border border-border px-3 py-1 text-sm hover:border-primary/50 hover:text-primary"
                  >
                    {b.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <nav className="mt-12 flex items-stretch justify-between gap-4 border-t border-border pt-6">
          {prev ? (
            <Link
              href={prev.href}
              className="group flex flex-1 flex-col rounded-lg border border-border p-4 hover:border-primary/50"
            >
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <ArrowLeft className="size-3" /> Previous
              </span>
              <span className="mt-1 font-medium group-hover:text-primary">{prev.title}</span>
            </Link>
          ) : (
            <span className="flex-1" />
          )}
          {next ? (
            <Link
              href={next.href}
              className="group flex flex-1 flex-col items-end rounded-lg border border-border p-4 text-right hover:border-primary/50"
            >
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                Next <ArrowRight className="size-3" />
              </span>
              <span className="mt-1 font-medium group-hover:text-primary">{next.title}</span>
            </Link>
          ) : (
            <span className="flex-1" />
          )}
        </nav>
      </main>
    </div>
  );
}
