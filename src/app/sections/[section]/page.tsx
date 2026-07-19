import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getSections } from "@/lib/content/notes";

// Next 16: params is a Promise and must be awaited.
type SectionPageProps = { params: Promise<{ section: string }> };

// Prerender every section at build time (SSG).
export function generateStaticParams() {
  return getSections().map((s) => ({ section: s.slug }));
}

export async function generateMetadata({ params }: SectionPageProps): Promise<Metadata> {
  const { section } = await params;
  const found = getSections().find((s) => s.slug === section);
  return { title: found ? `${found.title} — PrepDeck` : "PrepDeck" };
}

export default async function SectionPage({ params }: SectionPageProps) {
  const { section } = await params;
  const found = getSections().find((s) => s.slug === section);
  if (!found) notFound();

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
        <nav className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="size-4" />
          <span className="text-foreground">{found.title}</span>
        </nav>

        <h1 className="text-3xl font-bold tracking-tight">{found.title}</h1>
        <p className="mt-1 text-muted-foreground">{found.notes.length} notes</p>

        <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {found.notes.map((note) => (
            <li key={note.slug}>
              <Link href={note.href}>
                <Card className="transition-colors hover:border-primary/50 hover:bg-accent/40">
                  <CardHeader>
                    <CardTitle className="text-base">{note.title}</CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
