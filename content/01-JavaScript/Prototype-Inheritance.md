# Prototype & Inheritance

## Q
Explain the prototype chain. What's the difference between `__proto__` and `prototype`?

## Answer
Every object has a hidden link, `[[Prototype]]`, to another object. When you read a property, the engine checks the object itself, then walks this **prototype chain** — link by link — until it finds the property or hits `null`. `prototype` is a property that lives on **constructor functions**: it's the object that becomes the `[[Prototype]]` of every instance the constructor creates. `__proto__` is the (legacy) accessor for an object's own `[[Prototype]]` link — so `instance.__proto__ === Constructor.prototype`. ES6 `class` is syntactic sugar over exactly this mechanism.

## How it works
Lookup order for a property: the object's own properties → its `[[Prototype]]` → that object's `[[Prototype]]` → … → `Object.prototype` → `null`. Methods are stored **once** on the prototype and shared by every instance, rather than copied onto each object — that's why prototypes are memory-efficient. Prefer `Object.getPrototypeOf(obj)` / `Object.setPrototypeOf` over the legacy `__proto__` accessor.

## Code
Constructor, prototype method, and the chain:
```js
function Person(name) { this.name = name; }
Person.prototype.hello = function () { return `Hi ${this.name}`; };
const p = new Person("Varun");
console.log(p.hello());                             // Hi Varun — found on the prototype
console.log(Object.getPrototypeOf(p) === Person.prototype); // true
console.log(Object.getPrototypeOf(Person.prototype) === Object.prototype); // true
console.log(Object.getPrototypeOf(Object.prototype)); // null — end of the chain
```

`class` inheritance is prototypes under the hood:
```js
class Animal {
  constructor(name) { this.name = name; }
  speak() { return `${this.name} makes a noise`; }
}
class Dog extends Animal {
  speak() { return `${super.speak()} — woof`; } // super walks up the chain
}
console.log(new Dog("Rex").speak()); // Rex makes a noise — woof
```

Own vs inherited, and a prototype-free dictionary:
```js
const dict = Object.create(null); // no prototype — a clean map, no inherited keys
dict.a = 1;
console.log(Object.hasOwn(dict, "a"), "toString" in dict); // true false
```

## Gotchas
- `prototype` exists on constructor **functions**, not on instances; instances have `__proto__`/`[[Prototype]]`. Mixing them up is the classic wrong answer.
- Mutating built-in prototypes (`Array.prototype.foo = …`) is global and risky — fine for a controlled polyfill, dangerous otherwise.
- `for...in` walks inherited enumerable keys too — guard with `Object.hasOwn` (or use `Object.keys`).
- `Object.create(null)` objects have **no** `toString`/`hasOwnProperty`, so call `Object.hasOwn(obj, k)` rather than `obj.hasOwnProperty(k)`.

## Follow-ups
- **"Why does an array have `.map`?"** It's inherited from `Array.prototype` via the chain, not stored on each array.
- **"How do you check own vs inherited?"** `Object.hasOwn(obj, key)` (or the older `obj.hasOwnProperty(key)`).
- **"class vs prototype — any real difference?"** `class` adds strict-mode bodies, non-enumerable methods, and `super`, but the underlying model is still prototypes.

## Related
[[This-Binding]] · [[Polyfills]]
