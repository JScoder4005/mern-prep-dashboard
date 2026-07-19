# React — Infinite Scroll

## Q
Build infinite scroll: load more when user nears the bottom. Use IntersectionObserver.

## A
Put a sentinel element after the list. `IntersectionObserver` fires when it enters the viewport → fetch next page. Cleaner than scroll-event math + throttling.

## Code
IntersectionObserver hook:
```jsx
import { useEffect, useRef, useState, useCallback } from "react";

function useInfiniteScroll(callback, hasMore) {
  const sentinel = useRef(null);
  useEffect(() => {
    if (!hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) callback(); },
      { rootMargin: "200px" }   // prefetch before fully visible
    );
    const el = sentinel.current;
    if (el) observer.observe(el);
    return () => el && observer.unobserve(el); // cleanup
  }, [callback, hasMore]);
  return sentinel;
}

function Feed() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (loading) return;                 // guard double-fire
    setLoading(true);
    const res = await fetch(`/api/feed?page=${page}&limit=20`).then((r) => r.json());
    setItems((prev) => [...prev, ...res.items]);
    setHasMore(res.items.length === 20); // last page => fewer items
    setPage((p) => p + 1);
    setLoading(false);
  }, [page, loading]);

  const sentinel = useInfiniteScroll(loadMore, hasMore);

  return (
    <div>
      {items.map((it) => <div key={it.id}>{it.name}</div>)}
      {hasMore && <div ref={sentinel} style={{ height: 1 }} />}
      {loading && <p>Loading…</p>}
    </div>
  );
}
```

## How
Observer watches the sentinel div. When it scrolls into view (with 200px margin = prefetch), callback loads next page and appends.

## Why IntersectionObserver over scroll event
- No manual `scrollTop + clientHeight >= scrollHeight` math.
- No throttle/debounce needed — browser batches it, off main thread.
- Fewer re-renders.

## Gotchas
- Guard against double-fire (`loading` flag).
- Stop when `hasMore` false.
- Cleanup observer on unmount.
- For huge lists also virtualize (react-window) to cap DOM nodes.

## Scenario
Social feeds, search results, product listings, chat history (reverse scroll).

## Related
[[Pagination]] · [[Performance-Optimization]] · [[Debounce-Throttle]]
