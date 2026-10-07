---
description: TypeScript-specific code style
applyTo: '**/*.ts'
---

* **ALWAYS** write types
* For List-types, use `Array<Type>` instead of `Type[]`
* Interfaces can be exported as default directly using `export default interface Name { ... }` — prefer this over the
  declare-then-export pattern when the interface is the file's sole default export.
