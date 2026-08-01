# React — Nested Comments (Recursive UI)

## Q
Render a nested comment thread (Reddit-style): unlimited depth, reply, delete. Recursion in components.

## Answer
Model the thread as a tree — each node is `{ id, text, replies: [] }` — and render it with one `Comment` component that calls itself on `node.replies`. The hard part isn't the recursion, it's updating: add/delete must walk the tree immutably (spread at every level) so React sees a new reference and re-renders. A flat map keyed by id with a `parentId` pointer is the usual production alternative once trees get deep, since it avoids re-walking the whole tree per update.

## Code
```jsx
import { useState } from "react";

function Comment({ node, onReply, onDelete }) {
  const [replying, setReplying] = useState(false);
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim()) return;
    onReply(node.id, text);
    setText(""); setReplying(false);
  };

  return (
    <div style={{ marginLeft: 20, borderLeft: "1px solid #ddd", paddingLeft: 12 }}>
      <p>{node.text}</p>
      <button onClick={() => setReplying((r) => !r)}>Reply</button>
      <button onClick={() => onDelete(node.id)}>Delete</button>
      {replying && (
        <div>
          <input value={text} onChange={(e) => setText(e.target.value)} />
          <button onClick={submit}>Post</button>
        </div>
      )}
      {/* RECURSION: render children as Comment */}
      {node.replies.map((child) => (
        <Comment key={child.id} node={child} onReply={onReply} onDelete={onDelete} />
      ))}
    </div>
  );
}

function Thread() {
  const [comments, setComments] = useState([
    { id: 1, text: "Root comment", replies: [
      { id: 2, text: "A reply", replies: [] },
    ]},
  ]);

  // recursive tree update (immutable)
  const addReply = (parentId, text) => {
    const newNode = { id: Date.now(), text, replies: [] };
    const insert = (nodes) =>
      nodes.map((n) =>
        n.id === parentId
          ? { ...n, replies: [...n.replies, newNode] }
          : { ...n, replies: insert(n.replies) }
      );
    setComments(insert);
  };

  const remove = (id) => {
    const filter = (nodes) =>
      nodes.filter((n) => n.id !== id).map((n) => ({ ...n, replies: filter(n.replies) }));
    setComments(filter);
  };

  return comments.map((c) => (
    <Comment key={c.id} node={c} onReply={addReply} onDelete={remove} />
  ));
}
```

## How it works
`Comment` renders `node.replies.map(Comment)`, so each level draws itself the same way — a self-similar tree with no depth limit. `addReply` and `remove` both define a local recursive helper (`insert`/`filter`) that returns a *new* tree: at the matching node it splices in/out, and at every ancestor above it, it rebuilds with `{ ...n, replies: recurse(n.replies) }` so the changed reference propagates up to the root and React re-renders.

## Gotchas
- **Immutable at every level, not just the target node** — if a parent's `replies` array keeps its old reference, React bails out of re-rendering that branch even though a descendant changed.
- **Stable, unique keys** (`node.id`, not array index) — index keys scramble state (like `replying`) when nodes are added/removed mid-list.
- **Deep or wide trees get slow to recurse on every update.** The production fix is flattening: store `{ id, parentId, text }` in a `Map`, derive children by filtering on `parentId`, and updates touch only the changed node instead of rebuilding a path from root to leaf.

## Follow-ups
- **"How would you avoid re-walking the whole tree on every keystroke?"** Keep reply-draft `text` local to each `Comment` (already is here) so typing only re-renders that node, not the whole `Thread`.
- **"How do you cap or lazy-load very deep threads?"** Track depth and collapse/paginate past a threshold ("show more replies"), or flatten to the `parentId`-map model and page by parent.
- **"What if two users reply concurrently?"** Optimistic local update + reconcile with the server's canonical tree on response; conflicts just mean re-fetching the affected subtree.

## Related
[[Recursion-Backtracking]] · [[Deep-Shallow-Copy]] · [[Trees]]
