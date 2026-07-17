import { BookOpen } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Static section list for now — real counts get wired from the content
// pipeline in task 1.2. Server Component: no client JS shipped for this content.
const SECTIONS = [
  { slug: "javascript", title: "JavaScript", count: 15, blurb: "Event loop, closures, async, polyfills" },
  { slug: "typescript", title: "TypeScript", count: 4, blurb: "Generics, utility types, narrowing" },
  { slug: "dsa", title: "DSA", count: 13, blurb: "Arrays, trees, graphs, DP, heaps" },
  { slug: "react", title: "React", count: 18, blurb: "Hooks, perf, machine-coding components" },
  { slug: "node-express", title: "Node / Express", count: 9, blurb: "Middleware, JWT, streams, caching" },
  { slug: "mongodb", title: "MongoDB", count: 4, blurb: "Indexing, aggregation, schema design" },
  { slug: "docker", title: "Docker", count: 3, blurb: "Images, multi-stage, compose" },
  { slug: "aws", title: "AWS", count: 3, blurb: "Core services, deploy, S3" },
  { slug: "system-design", title: "System Design", count: 4, blurb: "Scaling, rate limiter, chat app" },
  { slug: "behavioral", title: "Behavioral", count: 1, blurb: "STAR stories" },
];

export default function Home() {
  const total = SECTIONS.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border/60 bg-background/80 px-6 py-4 backdrop-blur">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <BookOpen className="size-5 text-primary" />
          PrepDeck
        </Link>
        <ThemeToggle />
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
        <section className="mb-14 text-center">
          <h1 className="bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl">
            Senior MERN Interview Prep
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            {total} deeply-explained notes across {SECTIONS.length} sections. Study, search, revise.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((section) => (
            <Link key={section.slug} href={`/sections/${section.slug}`}>
              <Card className="h-full transition-colors hover:border-primary/50 hover:bg-accent/40">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{section.title}</CardTitle>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {section.count}
                    </span>
                  </div>
                  <CardDescription>{section.blurb}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
