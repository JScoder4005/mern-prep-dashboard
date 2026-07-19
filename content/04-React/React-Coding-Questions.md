# React Coding Questions

> Machine-coding round favorites. Practice building each live in ~15-20 min.

---

## 1. Debounced Search Input

### Q
Build a search box that calls the API only after the user stops typing 300ms.

```jsx
import { useState, useEffect } from "react";

function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);   // cleanup cancels previous timer
  }, [value, delay]);
  return debounced;
}

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery) return;
    let active = true;
    fetch(`/api/search?q=${debouncedQuery}`)
      .then((r) => r.json())
      .then((data) => active && setResults(data));
    return () => { active = false; };  // prevent race / stale set
  }, [debouncedQuery]);

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul>{results.map((r) => <li key={r.id}>{r.name}</li>)}</ul>
    </>
  );
}
```
**Why cleanup:** cancels stale timer + ignores out-of-order responses. See [[Debounce-Throttle]].

---

## 2. Counter with useReducer

```jsx
import { useReducer } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "inc": return { count: state.count + 1 };
    case "dec": return { count: state.count - 1 };
    case "reset": return { count: 0 };
    default: return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return (
    <>
      <button onClick={() => dispatch({ type: "dec" })}>-</button>
      <span>{state.count}</span>
      <button onClick={() => dispatch({ type: "inc" })}>+</button>
    </>
  );
}
```
**Where:** complex state transitions, multiple related fields.

---

## 3. Fetch with loading / error (custom hook)

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(url)
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then((d) => active && setData(d))
      .catch((e) => active && setError(e))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [url]);

  return { data, loading, error };
}
```

---

## 4. Todo List (add / toggle / delete)

```jsx
function Todos() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  const add = () => {
    if (!text.trim()) return;
    setTodos((t) => [...t, { id: Date.now(), text, done: false }]); // immutable
    setText("");
  };
  const toggle = (id) =>
    setTodos((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  const remove = (id) => setTodos((t) => t.filter((x) => x.id !== id));

  return (
    <>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={add}>Add</button>
      <ul>
        {todos.map((t) => (
          <li key={t.id}>
            <span
              style={{ textDecoration: t.done ? "line-through" : "none" }}
              onClick={() => toggle(t.id)}
            >{t.text}</span>
            <button onClick={() => remove(t.id)}>x</button>
          </li>
        ))}
      </ul>
    </>
  );
}
```
**Key points:** immutable updates (`map`/`filter`/spread), stable `key`, functional `setState`. See [[Deep-Shallow-Copy]].

---

## 5. Accordion / Toggle (controlled)

```jsx
function Accordion({ items }) {
  const [open, setOpen] = useState(null);
  return items.map((item, i) => (
    <div key={item.id}>
      <button onClick={() => setOpen(open === i ? null : i)}>{item.title}</button>
      {open === i && <p>{item.body}</p>}
    </div>
  ));
}
```

---

## 6. useLocalStorage hook

```jsx
function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initial; // lazy init
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}
```
**Note:** lazy initializer runs once (function form of `useState`).

---

## 7. Prevent re-render (memo + useCallback)

```jsx
const Child = React.memo(({ onClick }) => {
  console.log("child render");
  return <button onClick={onClick}>click</button>;
});

function Parent() {
  const [count, setCount] = useState(0);
  // without useCallback, new fn each render -> memo useless
  const handle = useCallback(() => console.log("clicked"), []);
  return (
    <>
      <button onClick={() => setCount((c) => c + 1)}>{count}</button>
      <Child onClick={handle} />
    </>
  );
}
```
**Why:** stable reference prevents memoized child re-render. See [[Performance-Optimization]].

## Related
[[Hooks]] · [[Performance-Optimization]] · [[Debounce-Throttle]]
