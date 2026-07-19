import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSections } from "@/lib/content/notes";

// Server Component: reads the parsed notes at build time. No client JS shipped
// for this content, and no runtime API call — it's all static.
export default function Home() {
  const sections = getSections();
  const total = sections.reduce((sum, s) => sum + s.notes.length, 0);

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
        <section className="mb-14 text-center">
          <h1 className="bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl">
            Senior MERN Interview Prep
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            {total} deeply-explained notes across {sections.length} sections. Study, search, revise.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <Link key={section.slug} href={section.href}>
              <Card className="h-full transition-colors hover:border-primary/50 hover:bg-accent/40">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{section.title}</CardTitle>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {section.notes.length}
                    </span>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {section.notes
                      .slice(0, 4)
                      .map((n) => n.title)
                      .join(" · ")}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
