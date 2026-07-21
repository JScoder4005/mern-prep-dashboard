import Link from "next/link";
import { Reveal } from "@/components/layout/reveal";
import { SiteHeader } from "@/components/layout/site-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HeroBackdrop } from "@/features/dashboard/components/hero-backdrop";
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
        <section className="relative mb-16 flex min-h-[280px] flex-col items-center justify-center overflow-hidden text-center">
          <HeroBackdrop />
          {/* Soft radial glow behind the title — reads in both themes. */}
          <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-64 w-[36rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
          <h1 className="bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl">
            Senior MERN Interview Prep
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            {total} deeply-explained notes across {sections.length} sections. Study, search, revise.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section, i) => (
            <Reveal key={section.slug} delay={i * 0.05}>
              <Link href={section.href}>
                <Card className="group relative h-full overflow-hidden border-border/60 bg-gradient-to-br from-card to-muted/40 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
                  {/* Gradient accent line, revealed on hover. */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
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
            </Reveal>
          ))}
        </section>
      </main>
    </div>
  );
}
