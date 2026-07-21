import { Coffee, Github } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 px-6 py-6">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
        <span>Built by JScoder4005</span>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/JScoder4005"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-foreground"
          >
            <Github className="size-4" />
            GitHub
          </a>
          <a
            href="https://www.buymeacoffee.com/jscoder4005"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1.5 font-medium text-amber-950 transition-colors hover:bg-amber-300"
          >
            <Coffee className="size-4" />
            Buy me a coffee
          </a>
        </div>
      </div>
    </footer>
  );
}
