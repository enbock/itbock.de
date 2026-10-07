---
description: This file describes the instructions for the command .di, which is used to implement Dependency Injection.
applyTo: '**/*'
---

# Command .di

## Target

Implement Dependency Injection in the dependency injection container or service locator of the project.

## Steps

* Find the dependency injection container or service locator of the project (maybe user has given the file in context)
* Identify missing or wrong injections by compiler errors
* Correct by compiler messaged injections
* After all actions, check with !tests that all modifications are tested

## Rules

* Adopt the style of the current container or service locator
* newer write comments
* Rename new imported (or used) classes via alias with his domain name, like
  `use Infrastructure\Product\ProductClient\Ajax as ProductClientAjax;` to avoid potential further conflicts
* Aware, that each class is only created once in the container or service locator
* DO not write tests for container nor service locator files
