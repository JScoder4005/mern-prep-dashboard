# React — Autocomplete / Typeahead

## Q
Build an autocomplete: debounced API search, dropdown suggestions, keyboard nav (up/down/enter/esc), click select, loading state.

## A
Debounce input → fetch suggestions → render dropdown → handle keyboard highlight + selection. Cancel stale requests.

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

## How
`setTimeout` 300ms debounces. `AbortController` cancels in-flight request when query changes → no out-of-order results. Keyboard moves `active`; Enter selects.

## Why interviewers ask
Combines debounce + async + race handling + keyboard a11y — one of the richest single components. See [[Debounce-Throttle]].

## Gotchas
- **Cancel stale requests** (AbortController) → avoid showing old results.
- `onMouseDown` not `onClick` (fires before input `blur` closes dropdown).
- Reset `active` on new results.
- Close on Escape / outside click.

## Related
[[Debounce-Throttle]] · [[React-Coding-Questions]] · [[Async-Promises]]
