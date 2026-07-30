# React — Infinite Scroll

## Q
Build infinite scroll: load more when user nears the bottom. Use IntersectionObserver.

## Answer
Place an empty **sentinel** element after the list and watch it with an `IntersectionObserver`; when it scrolls into view, fetch the next page and append. This beats the old `scrollTop + clientHeight >= scrollHeight` approach — no scroll-event throttling, the browser does the intersection check off the main thread, and it's far fewer re-renders. Add a `rootMargin` so you prefetch *before* the user hits the bottom, and guard against double-fires while a load is in flight.

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

## How it works
The hook creates an `IntersectionObserver` with `rootMargin: "200px"` (fire when the sentinel is still 200px below the fold) and observes the sentinel ref. When it intersects, it calls the `loadMore` callback. Re-creating the observer when `callback`/`hasMore` change keeps it pointed at the latest closure and stops observing once there's nothing left to load. `loadMore` is `useCallback`-memoized and appends with a functional update so pages accumulate.

## Why IntersectionObserver over a scroll listener
- No manual `scrollTop + clientHeight >= scrollHeight` math and no throttle/debounce.
- The browser batches intersection checks off the main thread → smoother scrolling, fewer renders.

## Gotchas
- **Double-fire guard is essential** — the observer can fire again before the fetch resolves; the `loading` flag (and `hasMore`) prevents stacking duplicate requests and duplicate items.
- **Recreate/re-observe when the callback changes.** A stale `loadMore` closure will fetch the wrong page; that's why `callback` is in the effect deps.
- Unobserve/disconnect on cleanup, and detect the last page (fewer than `limit` items) to flip `hasMore` off.
- Infinite scroll alone doesn't cap DOM size — pair it with **virtualization** (react-window) for very long feeds.

## Follow-ups
- **"Infinite scroll vs pagination?"** Infinite scroll suits feeds/discovery; pagination gives addressable, bounded pages (search, tables). See [[Pagination]].
- **"Downsides of infinite scroll?"** No footer access, lost scroll position on back-nav, and unbounded memory/DOM growth without virtualization.
- **"Reverse (chat) scroll?"** Observe a sentinel at the *top* and preserve scroll position by measuring height before/after prepending older messages.

## Related
[[Pagination]] · [[Performance-Optimization]] · [[Debounce-Throttle]]
