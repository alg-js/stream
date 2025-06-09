# @alg/stream

[![JSR](https://jsr.io/badges/@alg/stream)](https://jsr.io/@alg/stream)
[![License](https://img.shields.io/badge/Apache--2.0-green?label=license)](https://codeberg.org/algjs/stream/src/branch/main/LICENSE)

Lazy functions for Iterables.

See [@alg/enum](https://jsr.io/@alg/enum) for eagerly evaluated functions.

## Install

```
deno add jsr:@alg/stream
```

<details>
<summary>Other Install Options</summary>

```bash
npx jsr add @alg/stream
```
```bash
bunx jsr add @alg/stream
```
```bash
pnpm i jsr:@alg/stream
```
```bash
yarn add jsr:@alg/stream
```
```bash
vlt install jsr:@alg/stream
```

</details>

## Example

```javascript
import * as Stream from "@alg/stream";

let data = ["foo", "bar", "baz", "foobar"];

data = Stream.takeWhile(data, (e) => e.length <= 3);
data = Stream.map(data, (e) => e.toUpperCase());
data = Stream.take(data, 2);

console.log(...data);  // FOO BAR
```
