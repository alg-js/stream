# @alg/stream

[![JSR](https://jsr.io/badges/@alg/stream)](https://jsr.io/@alg/stream)
[![API](https://img.shields.io/badge/API-blue?logo=readme&logoColor=white)](https://jsr.io/@alg/stream/doc)
[![License](https://img.shields.io/badge/MIT-green?label=license)](https://github.com/alg/stream/blob/main/LICENSE)

Lazy functions for Iterables.

## Install

```
deno add jsr:@alg/stream
```

## Example

```javascript
import * as Stream from "@alg/stream";

let value = ["foo", "bar", "baz", "foobar"];
value = Stream.takeWhile(value, (e) => e.length <= 3);
value = Stream.map(value, (e) => e.toUpperCase());
value = Stream.take(value, 2);
console.log(...value);  // FOO BAR
```
