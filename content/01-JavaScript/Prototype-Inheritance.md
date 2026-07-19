# Prototype & Inheritance

## Q
Explain the prototype chain. Difference between `__proto__` and `prototype`?

## A
Every object has a hidden link `[[Prototype]]` (accessed via `__proto__`) pointing to another object. Property lookup walks this **chain** until found or `null`. `prototype` is a property on **constructor functions** used as the `__proto__` of instances they create.

## Code
```js
function Person(name) { this.name = name; }
Person.prototype.hello = function () { return `Hi ${this.name}`; };

const p = new Person("Varun");
p.hello();                       // found on Person.prototype
p.__proto__ === Person.prototype; // true
Person.prototype.__proto__ === Object.prototype; // true
Object.prototype.__proto__;      // null (chain end)

// Inheritance (ES6 class = syntactic sugar over prototypes)
class Animal {
  constructor(name) { this.name = name; }
  speak() { return `${this.name} makes noise`; }
}
class Dog extends Animal {
  speak() { return `${super.speak()} - woof`; }
}
new Dog("Rex").speak(); // "Rex makes noise - woof"
```

## How
Lookup order: own property → `__proto__` → its `__proto__` → ... → `Object.prototype` → `null`.

## Why
Memory efficient: methods live once on prototype, shared by all instances (not copied per object).

## Where / Scenario
- Understanding `Array.prototype.map` — why arrays have `map`.
- Polyfilling (add method to `Array.prototype`): [[Polyfills]].
- `hasOwnProperty` vs inherited props check.
- `Object.create(null)` for a clean dictionary (no proto pollution).

## Related
[[This-Binding]] · [[Polyfills]]
