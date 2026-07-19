# DSA — Graphs

## Q
Graph representations? BFS/DFS, topological sort, number of islands, Dijkstra shortest path.

## A
Graph = nodes + edges. Represent as **adjacency list** (`Map`/object) usually. BFS = shortest path (unweighted), DFS = explore/cycle/components, topo sort = ordering DAG, Dijkstra = weighted shortest path.

## Code
Build adjacency list:
```js
function buildGraph(edges) {
  const g = {};
  for (const [u, v] of edges) {
    (g[u] ||= []).push(v);
    (g[v] ||= []).push(u); // omit for directed
  }
  return g;
}
```

BFS (shortest path, unweighted):
```js
function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start], order = [];
  while (queue.length) {
    const node = queue.shift();
    order.push(node);
    for (const nb of graph[node] || []) {
      if (!visited.has(nb)) { visited.add(nb); queue.push(nb); }
    }
  }
  return order;
}
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
```

Number of islands (grid DFS):
```js
function numIslands(grid) {
  let count = 0;
  const sink = (r, c) => {
    if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] === "0") return;
    grid[r][c] = "0";                 // mark visited
    sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1);
  };
  for (let r = 0; r < grid.length; r++)
    for (let c = 0; c < grid[0].length; c++)
      if (grid[r][c] === "1") { count++; sink(r, c); }
  return count;
}
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
  return order.length === n ? order : []; // empty => cycle
}
```

Dijkstra (weighted shortest path, needs min-heap):
```js
function dijkstra(graph, start, n) {
  const dist = new Array(n).fill(Infinity);
  dist[start] = 0;
  const heap = new MinHeap(); // [dist, node] — see Heap note
  heap.push([0, start]);
  while (heap.size()) {
    const [d, node] = heap.pop();
    if (d > dist[node]) continue;
    for (const [nb, w] of graph[node] || []) {
      if (d + w < dist[nb]) { dist[nb] = d + w; heap.push([dist[nb], nb]); }
    }
  }
  return dist;
}
```

## When which
| Need | Algo |
|---|---|
| Shortest path (unweighted) | BFS |
| Explore / components / cycle | DFS |
| Order with dependencies (DAG) | Topological sort |
| Shortest path (weighted +) | Dijkstra (min-heap) |
| Connectivity / union | Union-Find (DSU) |

## Why
Model relationships: networks, maps, dependencies, social graphs.

## Where / Scenario
Course schedule (topo), maps/routing (Dijkstra), friend suggestions (BFS), islands/flood fill, build systems, deadlock detection.

## Related
[[Trees]] · [[Heap-Priority-Queue]] · [[Stack-Queue]]
