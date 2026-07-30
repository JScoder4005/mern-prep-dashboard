# React — Pagination

## Q
Build pagination: page numbers, prev/next, disabled edges, page window (1 … 4 5 6 … 20). Client-side and server-side.

## Answer
Track a single `page` and derive everything from it: total pages from the item count (client) or a server `total`, and the visible items by slicing local data or fetching that page. The reusable piece is the **pager** — prev/next buttons disabled at the edges plus a windowed page list with ellipses (`1 … 4 5 6 … 20`) so long ranges stay compact. Client-side (slice loaded data) suits small sets; server-side (`?page=&limit=`) is for large data, and cursor-based paging beats offset at scale.

## Code
Client-side (slice local data):
```jsx
import { useState, useMemo } from "react";

function Paginated({ items, pageSize = 10 }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(items.length / pageSize);

  const pageItems = useMemo(
    () => items.slice((page - 1) * pageSize, page * pageSize),
    [items, page, pageSize]
  );

  return (
    <>
      <ul>{pageItems.map((it) => <li key={it.id}>{it.name}</li>)}</ul>
      <Pager page={page} totalPages={totalPages} onChange={setPage} />
    </>
  );
}
```

Reusable pager with window + ellipsis:
```jsx
function Pager({ page, totalPages, onChange }) {
  const pages = getPageRange(page, totalPages, 1); // 1 sibling each side
  return (
    <div style={{ display: "flex", gap: 4 }}>
      <button disabled={page === 1} onClick={() => onChange(page - 1)}>Prev</button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`e${i}`}>…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            style={{ fontWeight: p === page ? "bold" : "normal" }}
          >{p}</button>
        )
      )}
      <button disabled={page === totalPages} onClick={() => onChange(page + 1)}>Next</button>
    </div>
  );
}

// build [1, '...', 4,5,6, '...', 20]
function getPageRange(current, total, siblings = 1) {
  const range = [];
  const left = Math.max(2, current - siblings);
  const right = Math.min(total - 1, current + siblings);
  range.push(1);
  if (left > 2) range.push("...");
  for (let i = left; i <= right; i++) range.push(i);
  if (right < total - 1) range.push("...");
  if (total > 1) range.push(total);
  return range;
}
```

Server-side (fetch per page):
```jsx
function ServerPaginated() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ items: [], total: 0 });

  useEffect(() => {
    fetch(`/api/items?page=${page}&limit=10`)
      .then((r) => r.json())
      .then(setData);
  }, [page]);

  const totalPages = Math.ceil(data.total / 10);
  return <Pager page={page} totalPages={totalPages} onChange={setPage} />;
}
```

## How it works
`slice((page-1)*size, page*size)` extracts the current window from local data, memoized so it only recomputes when `items`/`page`/`pageSize` change. `getPageRange` always shows the first and last page, a band of `siblings` around the current page, and inserts `"..."` only when there's an actual gap — that keeps the control a fixed width no matter how many pages exist. The server variant swaps the slice for a `fetch` keyed on `page` and reads `total` from the response to compute `totalPages`.

## Gotchas
- **Offset pagination (`skip/limit`) drifts on live data** — inserting/deleting rows while paging causes skipped or repeated items, and deep `skip` is slow because the DB still scans the skipped rows. Cursor pagination (`?after=lastId`) is stable and O(1)-ish — see [[Indexing]].
- Disable Prev at page 1 and Next at `totalPages`, and guard `totalPages` when `items` is empty (`Math.ceil(0/size) = 0`) so you don't render a lone broken page.
- Give ellipsis placeholders **stable non-numeric keys** (not the index alone across renders) and never let them be clickable.

## Follow-ups
- **"Offset vs cursor pagination?"** Offset is simple and jumpable (go to page 20) but slow/unstable at scale; cursor is fast and consistent but only supports next/prev, not arbitrary jumps.
- **"Pagination vs infinite scroll?"** Pagination gives addressable pages and a sense of bounds (good for search/tables); infinite scroll suits feeds — see [[Infinite-Scroll]].
- **"Keep page state in the URL?"** Store `page` in the query string so refresh/back/share preserve position.

## Related
[[Infinite-Scroll]] · [[Indexing]] · [[React-Coding-Questions]]
