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
t.insert("cat"); t.insert("car");
t.search("cat");        // true
t.startsWith("ca");     // true
t.autocomplete("ca");   // ["cat", "car"]
```

## How
Each char walks one level down. `isEnd` distinguishes "car" (word) from "ca" (prefix only). Autocomplete = find prefix node then DFS collect.

## Why
- Prefix search O(L), not O(N×L) scanning all words.
- Shares common prefixes → space efficient for large dictionaries.

## Where / Scenario
Autocomplete/typeahead (see [[Autocomplete-Typeahead]]), spell check, IP routing, word games, search suggestions, contact search.

## Related
[[Trees]] · [[Hashing]] · [[Autocomplete-Typeahead]]
