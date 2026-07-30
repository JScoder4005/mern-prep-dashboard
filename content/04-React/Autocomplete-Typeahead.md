# React — Autocomplete / Typeahead

## Q
Build an autocomplete: debounced API search, dropdown suggestions, keyboard nav (up/down/enter/esc), click select, loading state.

## Answer
This is one of the richest single-component questions because it stacks four hard things: **debounce** the input so you don't fetch on every keystroke, **cancel stale requests** so out-of-order responses can't show wrong results, render a dropdown, and make it **keyboard accessible** (up/down to move the highlight, Enter to select, Escape to close). The debounce + `AbortController` cleanup living together in one `useEffect` keyed on `query` is the elegant core — every keystroke tears down the previous pending timer and request.

## Code
```jsx
import { useState, useEffect, useRef } from "react";

function Autocomplete({ fetchSuggestions }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);   // highlighted index
  const [loading, setLoading] = useState(false);

  // debounce + cancel stale
  useEffect(() => {
    if (!query) { setResults([]); return; }
    const controller = new AbortController();
    const id = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await fetchSuggestions(query, controller.signal);
        setResults(data);
        setOpen(true);
        setActive(-1);
      } catch (e) {
        if (e.name !== "AbortError") console.error(e);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => { clearTimeout(id); controller.abort(); }; // cancel prev
  }, [query, fetchSuggestions]);

  const select = (item) => {
    setQuery(item.label);
    setOpen(false);
  };

  const onKeyDown = (e) => {
    if (!open) return;
    if (e.key === "ArrowDown") setActive((i) => Math.min(i + 1, results.length - 1));
    else if (e.key === "ArrowUp") setActive((i) => Math.max(i - 1, 0));
    else if (e.key === "Enter" && active >= 0) select(results[active]);
    else if (e.key === "Escape") setOpen(false);
  };

  return (
    <div style={{ position: "relative", width: 300 }}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Search…"
      />
      {loading && <span> ⏳</span>}
      {open && results.length > 0 && (
        <ul style={{ position: "absolute", width: "100%", listStyle: "none", margin: 0, padding: 0, border: "1px solid #ccc", background: "#fff" }}>
          {results.map((item, i) => (
            <li
              key={item.id}
              onMouseDown={() => select(item)}  // mouseDown before input blur
              style={{ padding: 8, background: i === active ? "#eef" : "#fff" }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## How it works
The effect runs on every `query` change: it starts a 300ms `setTimeout`, and its cleanup both `clearTimeout`s the pending timer and `abort()`s the in-flight request. So fast typing keeps resetting the debounce, and a settled request whose query is already stale gets aborted before it can call `setResults`. Keyboard handling moves an `active` index over the results; the highlighted row is styled and selected on Enter.

## Gotchas
- **Race conditions are the real test.** Without `AbortController` (or a request-id guard), a slow response for "reac" can land *after* "react" and overwrite the correct list. Cancel on every change.
- **`onMouseDown`, not `onClick`, to select** — clicking a suggestion blurs the input first, and a blur handler that closes the dropdown would unmount the item before `click` fires. `mousedown` runs before blur.
- Reset `active` to -1 whenever new results arrive, or the highlight points at a stale row.
- Close on Escape *and* outside click (a `mousedown` listener on `document`), and debounce is UX vs cost — 200–300ms is typical.

## Follow-ups
- **"Debounce vs throttle here?"** Debounce — you want to fire once after typing pauses, not at a steady rate. See [[Debounce-Throttle]].
- **"How else can you kill stale responses without AbortController?"** Track a monotonically increasing request id (or the query string) and ignore any response that isn't the latest.
- **"Accessibility?"** Use the ARIA combobox pattern: `role="combobox"`/`listbox`/`option`, `aria-activedescendant` for the highlighted item, and `aria-expanded`.

## Related
[[Debounce-Throttle]] · [[React-Coding-Questions]] · [[Async-Promises]]
