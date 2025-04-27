# @alg/stream

[![JSR](https://jsr.io/badges/@alg/stream)](https://jsr.io/@alg/stream)
[![License](https://img.shields.io/badge/MIT-green?label=license)](https://github.com/alg/stream/blob/main/LICENSE)

Lazy functions for Iterables.

## Install

```
deno add jsr:@alg/stream
```

## Example

```javascript
import * as Stream from "@alg/stream";

let data = ["foo", "bar", "baz", "foobar"];

data = Stream.takeWhile(data, (e) => e.length <= 3);
data = Stream.map(data, (e) => e.toUpperCase());
data = Stream.take(data, 2);

console.log(...data);  // FOO BAR
```
