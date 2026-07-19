# React — Nested Comments (Recursive UI)

## Q
Render a nested comment thread (Reddit-style): unlimited depth, reply, delete. Recursion in components.

## A
A `Comment` component renders itself for each child → recursion. Tree data `{ id, text, replies: [] }`.

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

## How
`Comment` renders `node.replies.map(Comment)` → self-similar tree. Add/delete recurse the tree, rebuilding nodes immutably (spread) so React detects change.

## Why interviewers ask
Recursion in JSX, immutable nested-tree updates (hardest part), key management, component reuse.

## Gotchas
- Immutable update at every level (`{...n, replies: recurse(n.replies)}`).
- Stable keys.
- Deep trees → consider flattening (id → parentId map) for perf + easy updates.

## Related
[[Recursion-Backtracking]] · [[Deep-Shallow-Copy]] · [[Trees]]
