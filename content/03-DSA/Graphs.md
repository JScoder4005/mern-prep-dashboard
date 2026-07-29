# DSA — Graphs

## Q
Graph representations? BFS/DFS, topological sort, number of islands, and Dijkstra's shortest path.

## Answer
A graph is nodes plus edges; the default representation is an **adjacency list** (a `Map`/object of node → neighbors) because most graphs are sparse. Pick the traversal by the question: **BFS** for shortest path on an *unweighted* graph and level-by-level exploration; **DFS** for connectivity, cycle detection, and components; **topological sort** to order a DAG under dependencies; **Dijkstra** (BFS + a min-heap) for shortest path with non-negative *weights*. The one universal rule: track `visited` or you'll loop forever on cycles.

## How it works
BFS fans out in rings using a queue, so the first time it reaches a node is via the fewest edges. DFS dives down one path via recursion/stack and backtracks. Topological sort (Kahn's) repeatedly removes nodes with in-degree 0; if any remain, there's a cycle. Dijkstra greedily settles the closest unfinished node using a priority queue, relaxing its edges — correct only because non-negative weights mean a settled distance can never later improve.

## Code
Build an adjacency list from an edge list:
```js
function buildGraph(edges) {
  const g = {};
  for (const [u, v] of edges) {
    (g[u] ||= []).push(v);
    (g[v] ||= []).push(u); // drop this line for a directed graph
  }
  return g;
}
console.log(buildGraph([["A", "B"], ["A", "C"], ["B", "D"]]));
// { A: ["B","C"], B: ["A","D"], C: ["A"], D: ["B"] }
```

BFS (shortest-path order, unweighted):
```js
function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start], order = [];
  while (queue.length) {
    const node = queue.shift();
    order.push(node);
    for (const nb of graph[node] || []) {
      if (!visited.has(nb)) { visited.add(nb); queue.push(nb); } // mark on enqueue
    }
  }
  return order;
}
const g = { A: ["B", "C"], B: ["A", "D"], C: ["A", "D"], D: ["B", "C"] };
console.log(bfs(g, "A")); // ["A","B","C","D"]
```

DFS (recursive):
```js
function dfs(graph, node, visited = new Set()) {
  visited.add(node);
  for (const nb of graph[node] || []) {
    if (!visited.has(nb)) dfs(graph, nb, visited);
  }
  return visited;
}
const g = { A: ["B", "C"], B: ["A", "D"], C: ["A", "D"], D: ["B", "C"] };
console.log([...dfs(g, "A")]); // ["A","B","D","C"]
```

Number of islands (grid DFS flood-fill):
```js
function numIslands(grid) {
  let count = 0;
  const sink = (r, c) => {
    if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] === "0") return;
    grid[r][c] = "0";                 // mark visited by sinking
    sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1);
  };
  for (let r = 0; r < grid.length; r++)
    for (let c = 0; c < grid[0].length; c++)
      if (grid[r][c] === "1") { count++; sink(r, c); }
  return count;
}
console.log(numIslands([
  ["1", "1", "0"],
  ["0", "1", "0"],
  ["0", "0", "1"],
])); // 2
```

Topological sort (Kahn's, cycle-safe):
```js
function topoSort(graph, n) {
  const indeg = new Array(n).fill(0);
  for (const u in graph) for (const v of graph[u]) indeg[v]++;
  const queue = [];
  for (let i = 0; i < n; i++) if (indeg[i] === 0) queue.push(i);
  const order = [];
  while (queue.length) {
    const node = queue.shift();
    order.push(node);
    for (const nb of graph[node] || []) if (--indeg[nb] === 0) queue.push(nb);
  }
  return order.length === n ? order : []; // short result ⇒ a cycle exists
}
// 0 → {1,2}, 1 → 3, 2 → 3   (prereqs before 3)
console.log(topoSort({ 0: [1, 2], 1: [3], 2: [3], 3: [] }, 4)); // [0,1,2,3]
```

Dijkstra (weighted shortest path, min-heap keyed on distance):
```js
class MinHeap {                        // ordered by element[0] = distance
  constructor() { this.h = []; }
  size() { return this.h.length; }
  push(v) { this.h.push(v); let i = this.h.length - 1;
    while (i > 0) { const p = (i - 1) >> 1; if (this.h[p][0] <= this.h[i][0]) break;
      [this.h[p], this.h[i]] = [this.h[i], this.h[p]]; i = p; } }
  pop() { const top = this.h[0], last = this.h.pop();
    if (this.h.length) { this.h[0] = last; let i = 0, n = this.h.length;
      while (true) { let s = i, l = 2*i+1, r = 2*i+2;
        if (l < n && this.h[l][0] < this.h[s][0]) s = l;
        if (r < n && this.h[r][0] < this.h[s][0]) s = r;
        if (s === i) break; [this.h[s], this.h[i]] = [this.h[i], this.h[s]]; i = s; } }
    return top; }
}
function dijkstra(graph, start, n) {
  const dist = new Array(n).fill(Infinity);
  dist[start] = 0;
  const heap = new MinHeap();
  heap.push([0, start]);               // [distance, node]
  while (heap.size()) {
    const [d, node] = heap.pop();
    if (d > dist[node]) continue;      // stale entry — already improved
    for (const [nb, w] of graph[node] || []) {
      if (d + w < dist[nb]) { dist[nb] = d + w; heap.push([dist[nb], nb]); }
    }
  }
  return dist;
}
// weighted edges: [neighbor, weight]
const wg = { 0: [[1, 4], [2, 1]], 1: [[3, 1]], 2: [[1, 2], [3, 5]], 3: [[4, 3]], 4: [] };
console.log(dijkstra(wg, 0, 5)); // [0,3,1,4,7]
```

## When which
| Need | Algorithm |
|---|---|
| Shortest path (unweighted) | BFS |
| Explore / components / cycle | DFS |
| Order with dependencies (DAG) | Topological sort (Kahn's / DFS) |
| Shortest path (weighted, non-negative) | Dijkstra (min-heap) |
| Shortest path (negative edges) | Bellman-Ford |
| Connectivity / union | Union-Find (DSU) |

## Gotchas
- **Mark visited when you enqueue, not when you dequeue** — otherwise the same node gets queued multiple times before it's processed.
- Dijkstra breaks on **negative edges** (a settled node can later get cheaper) — use Bellman-Ford there.
- Topo sort returning fewer than `n` nodes is your cycle detector — a DAG is required.

## Follow-ups
- **"BFS vs Dijkstra?"** BFS is Dijkstra with all weights = 1; the heap collapses to a plain queue.
- **"Detect a cycle in a directed graph?"** DFS with three colors (white/gray/black) — a back-edge to a gray (in-progress) node is a cycle.

## Related
[[Trees]] · [[Heap-Priority-Queue]] · [[Stack-Queue]]
