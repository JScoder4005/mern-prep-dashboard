# React — Pagination

## Q
Build pagination: page numbers, prev/next, disabled edges, page window (1 … 4 5 6 … 20). Client-side and server-side.

## A
Track `currentPage`. Slice data (client) or fetch page (server). Compute total pages + a windowed page list.

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

## How
`slice((page-1)*size, page*size)` = current window. `getPageRange` inserts ellipsis when gap between edges and current window.

## Why / Scenario
- Client-side: small datasets already loaded.
- Server-side: large data — send `page`+`limit`, DB does `skip/limit` (or cursor-based for scale).
- **Cursor pagination** (`?after=id`) beats offset for large/real-time data (no skip cost, stable).

## Related
[[Infinite-Scroll]] · [[Indexing]] · [[React-Coding-Questions]]
