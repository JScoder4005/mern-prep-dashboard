import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { ProgressDashboard } from "@/features/progress/components/progress-dashboard";
import { getAllNoteMeta } from "@/lib/content/notes";

export const metadata: Metadata = { title: "Progress — PrepDeck" };

export default function ProgressPage() {
  const notes = getAllNoteMeta();

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
        <h1 className="mb-8 text-3xl font-bold tracking-tight">Your progress</h1>
        <ProgressDashboard notes={notes} />
      </main>
    </div>
  );
}
