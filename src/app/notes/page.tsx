import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { NotesBrowser } from "@/features/notes/components/notes-browser";
import { getAllNoteMeta, getSections } from "@/lib/content/notes";
import { getSearchDocs } from "@/lib/content/search";

export const metadata: Metadata = { title: "Browse — PrepDeck" };

// Server Component: loads all data at build time and hands it to the client
// browser. The heavy note bodies stay out — only lightweight meta + search docs.
export default function NotesPage() {
  const notes = getAllNoteMeta();
  const docs = getSearchDocs();
  const sections = getSections().map((s) => ({ slug: s.slug, title: s.title }));

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        <h1 className="mb-6 text-3xl font-bold tracking-tight">Browse notes</h1>
        <NotesBrowser notes={notes} docs={docs} sections={sections} />
      </main>
    </div>
  );
}
