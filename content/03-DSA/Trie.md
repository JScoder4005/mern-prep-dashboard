# DSA — Trie (Prefix Tree)

## Q
What is a Trie? Implement insert/search/startsWith. Use case?

## A
Trie = tree where each node = a character; paths spell words. O(L) insert/search (L = word length), independent of dictionary size. Great for prefix queries.

## Code
```js
class TrieNode {
  constructor() {
    this.children = {};   // char -> TrieNode
    this.isEnd = false;   // marks end of a word
  }
}

class Trie {
  constructor() { this.root = new TrieNode(); }

  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children[ch]) node.children[ch] = new TrieNode();
      node = node.children[ch];
    }
    node.isEnd = true;
  }

  search(word) {
    const node = this._find(word);
    return node !== null && node.isEnd;
  }

  startsWith(prefix) {
    return this._find(prefix) !== null;
  }

  _find(str) {
    let node = this.root;
    for (const ch of str) {
      if (!node.children[ch]) return null;
      node = node.children[ch];
    }
    return node;
  }

  // all words with prefix (autocomplete)
  autocomplete(prefix) {
    const node = this._find(prefix);
    const res = [];
    const dfs = (n, path) => {
      if (n.isEnd) res.push(prefix + path);
      for (const ch in n.children) dfs(n.children[ch], path + ch);
    };
    if (node) dfs(node, "");
    return res;
  }
}

const t = new Trie();
t.insert("cat"); t.insert("car"); t.insert("card");
console.log(t.search("cat"));      // true  (a stored word)
console.log(t.search("ca"));       // false (prefix, not a word)
console.log(t.startsWith("ca"));   // true
console.log(t.autocomplete("ca")); // ["cat","car","card"]
```

## How it works
Each character of a word walks one level deeper, creating child nodes as needed; the final node is flagged `isEnd`. `search` requires the full path **and** `isEnd` (so "ca" fails), while `startsWith` only needs the path to exist. Autocomplete finds the prefix node once, then DFS-collects every `isEnd` beneath it. Because you only ever follow the characters you're given, every operation is O(L) in the word length — completely independent of how many words the trie holds.

## Why use it
- Prefix search is O(L), not O(N×L) scanning every word in a dictionary.
- Shared prefixes are stored once → space-efficient for large word sets.

## Gotchas
- `isEnd` is essential — without it you can't tell a complete word ("car") from a mere prefix ("ca"), so `search` and `startsWith` would collapse into the same thing.
- A trie can be memory-heavy for sparse, long keys (one node per char). A ternary search tree or a compressed/radix trie trades some speed for space.

## Where / Scenario
Autocomplete/typeahead (see [[Autocomplete-Typeahead]]), spell check, IP routing tables, word games, search suggestions, contact search.

## Related
[[Trees]] · [[Hashing]] · [[Autocomplete-Typeahead]]
