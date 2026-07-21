import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { TutorChat } from "@/features/tutor/components/tutor-chat";
import { getSearchDocs } from "@/lib/content/search";

export const metadata: Metadata = { title: "AI Tutor — PrepDeck" };

// Server Component: builds the note corpus at build time and hands it to the
// client chat, which does keyword retrieval + calls the user's chosen LLM (BYOK).
export default function TutorPage() {
  const docs = getSearchDocs();

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">AI Tutor</h1>
        <p className="mb-6 text-muted-foreground">
          Ask questions grounded in your notes. Bring your own key (Claude / OpenAI) or run a local
          Ollama — everything stays in your browser.
        </p>
        <TutorChat docs={docs} />
      </main>
    </div>
  );
}
