---
description: This file describes the instructions for the command .implement, which is used to implement missing methods in the infrastructure and its usage.
applyTo: '**/*'
---

# Command .implement

The command implements the Infrastructure and his usage.

## Target

Implement the missing methods in the current open infrastructure file (or the requested logic in a core file) and add
test cases in the congruent test file.
Focus on happy path implementations and tests unless error handling (try/catch) is explicitly implemented.

## Steps

* Check the interface of implementation interfaces for missing or wrong implemented methods
* Identify and implement the missing methods in the current open file by keeping the code style and patterns of the
  current implementation
* consult the `swagger.yaml` for API details if necessary
* Add test cases in the congruent test file by keeping the code style and patterns of the current implementation (use
  rules and steps from .tests command)
* Check if related implementations, i.e. Parsers or encoders, needs also to be implemented
* When implementing UseCase classes, use parallel `Promise.all()` calls for better performance when multiple async
  operations are independent
* Ensure that response objects contain the correct entity types as specified by interfaces
* Follow existing project patterns for API endpoint naming conventions
* Create corresponding parser classes when implementing client methods that need data transformation
* Follow the principle of Reverse Dependency Injection, Clean Code, Clean Architecture, SOLID, SoC, DRY, KISS, YAGNI, 
  and other best practices for software development to ensure maintainable and scalable code.

## Rules

* Constructor injections used the short form with `private` keyword
* DO NOT overwrite existing file, just edit them
