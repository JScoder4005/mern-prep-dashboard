import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { Playground } from "@/features/playground/components/playground";

export const metadata: Metadata = { title: "Playground — PrepDeck" };

export default function PlaygroundPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Playground</h1>
        <p className="mb-6 text-muted-foreground">
          Experiment with live React or JavaScript. For quick JS snippets, hit “Run” right inside a note.
        </p>
        <Playground />
      </main>
    </div>
  );
}
