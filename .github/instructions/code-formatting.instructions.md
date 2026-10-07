---
description: This file describes the code style for the project.
applyTo: '**/*'
---

# Formatting rules

* Use 4 spaces for indentation, no tabs.
* Lines MUST NEVER be longer than 120 characters.
* For line wrapping, the wrapping pattern is used.
    * For function calls, arguments are written on a new line when the line exceeds 120 characters. The closing
      parenthesis is written on a new line.
    * For object and array literals, elements are written on a new line when the line exceeds 120 characters. The closing
      bracket is written on a new line.
* Multi-line object and array literals start on the next line.
* Never read files with potentially sensitive information (like passwords) (eg. .env files) directly. Use environment variables instead.
