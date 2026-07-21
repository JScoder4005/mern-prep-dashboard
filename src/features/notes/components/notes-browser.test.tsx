import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { NotesBrowser } from "@/features/notes/components/notes-browser";
import type { NoteMeta } from "@/types/note";
import type { SearchDoc } from "@/types/search";

const notes: NoteMeta[] = [
  {
    slug: "closures",
    title: "Closures",
    sectionSlug: "javascript",
    sectionTitle: "JavaScript",
    href: "/notes/javascript/closures",
  },
  {
    slug: "modal",
    title: "Modal",
    sectionSlug: "react",
    sectionTitle: "React",
    href: "/notes/react/modal",
  },
];

const docs: SearchDoc[] = notes.map((n) => ({
  slug: n.slug,
  title: n.title,
  sectionTitle: n.sectionTitle,
  href: n.href,
  text: n.title,
}));

const sections = [
  { slug: "javascript", title: "JavaScript" },
  { slug: "react", title: "React" },
];

describe("NotesBrowser", () => {
  beforeEach(() => window.localStorage.clear());

  it("shows all notes initially", () => {
    render(<NotesBrowser notes={notes} docs={docs} sections={sections} />);
    expect(screen.getByText("Closures")).toBeInTheDocument();
    expect(screen.getByText("Modal")).toBeInTheDocument();
  });

  it("filters by search query", async () => {
    const user = userEvent.setup();
    render(<NotesBrowser notes={notes} docs={docs} sections={sections} />);

    await user.type(screen.getByPlaceholderText(/search/i), "closure");

    expect(screen.getByText("Closures")).toBeInTheDocument();
    expect(screen.queryByText("Modal")).not.toBeInTheDocument();
  });

  it("filters by section pill", async () => {
    const user = userEvent.setup();
    render(<NotesBrowser notes={notes} docs={docs} sections={sections} />);

    await user.click(screen.getByRole("button", { name: "React" }));

    expect(screen.getByText("Modal")).toBeInTheDocument();
    expect(screen.queryByText("Closures")).not.toBeInTheDocument();
  });
});
