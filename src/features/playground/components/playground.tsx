"use client";

import { Sandpack } from "@codesandbox/sandpack-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Mode = "react" | "js";

export function Playground() {
  const [mode, setMode] = useState<Mode>("react");
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? "dark" : "light";

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <ModeButton active={mode === "react"} onClick={() => setMode("react")}>
          React
        </ModeButton>
        <ModeButton active={mode === "js"} onClick={() => setMode("js")}>
          JavaScript
        </ModeButton>
      </div>

      {/* key by mode+theme so Sandpack fully remounts on either change. */}
      {mode === "react" ? (
        <Sandpack
          key={`react-${theme}`}
          template="react-ts"
          theme={theme}
          options={{ editorHeight: 480, showConsole: true, showConsoleButton: true }}
        />
      ) : (
        <Sandpack
          key={`js-${theme}`}
          template="vanilla"
          theme={theme}
          options={{ editorHeight: 480, showConsole: true, showConsoleButton: true }}
        />
      )}
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm transition-colors",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
