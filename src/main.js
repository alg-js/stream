/* Copyright 2025 James Finnie-Ansley
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* @ts-self-types="./main.d.ts" */

/**
 * @template T
 * @param {Iterable<T>} iterable
 * @returns {Iterator<T>}
 */
function iter(iterable) {
    return iterable[Symbol.iterator]();
}

export function* chain(...iters) {
    for (const it of iters) {
        yield* it;
    }
}

export function chunk(iter, size) {
    if (size <= 0) {
        throw new Error("Cannot yield chunks of size <= 0");
    }
    return (function* () {
        let arr = [];
        for (const e of iter) {
            arr.push(e);
            if (arr.length === size) {
                yield arr;
                arr = [];
            }
        }
    })();
}

export function* cycle(iterable) {
    const saved = [];
    for (const e of iterable) {
        yield e;
        saved.push(e);
    }
    if (saved.length !== 0) {
        while (true) {
            for (const e of saved) {
                yield e;
            }
        }
    }
}

export function* dedup(iterable, {eq = (left, right) => left === right} = {}) {
    const it = iter(iterable);
    const first = it.next();
    if (!first.done) {
        yield first.value;
        let last = first.value;
        for (const e of it) {
            if (!eq(e, last)) {
                yield e;
                last = e;
            }
        }
    }
}

export function drop(iterable, limit) {
    if (limit < 0) {
        throw Error("Cannot drop < 0 items");
    } else {
        return iter(iterable).drop(limit);
    }
}

export function* dropWhile(iterable, predicate) {
    const it = iter(iterable);
    let i = 0;
    let e = it.next();
    while (!e.done && predicate(e.value, i)) {
        e = it.next();
        i += 1;
    }
    if (!e.done) {
        yield e.value;
        yield* it;
    }
}

export function filter(iterable, predicate) {
    return iter(iterable).filter(predicate);
}

export function* flatMap(iterable, mapping) {
    let i = 0;
    for (const e of iterable) {
        yield* mapping(e, i);
        i += 1;
    }
}

export function* iterate(accumulator, update) {
    let i = 0;
    while (true) {
        yield accumulator;
        accumulator = update(accumulator, i);
        i += 1;
    }
}

export function map(iterable, mapping) {
    return iter(iterable).map(mapping);
}

export function* peek(iterable, consumer) {
    let i = 0;
    for (const e of iterable) {
        consumer(e, i);
        yield e;
        i += 1;
    }
}

export function* repeat(object, times) {
    if (times === undefined) {
        while (true) {
            yield object;
        }
    } else {
        for (let i = 0; i < times; i++) {
            yield object;
        }
    }
}

export function* scan(iterable, accumulator, initial) {
    let acc, i;
    const it = iter(iterable);
    if (initial !== undefined) {
        acc = initial;
        i = 0;
    } else {
        const first = it.next();
        if (first.done) {
            return;
        }
        acc = first.value;
        i = 1;
        yield acc;
    }
    for (const e of it) {
        acc = accumulator(acc, e, i);
        yield acc;
        i += 1;
    }
}

export function take(iterable, limit) {
    if (limit < 0 ) {
        throw Error("Cannot take < 0 items");
    } else {
        return iter(iterable).take(limit);
    }
}

export function* takeWhile(iterable, predicate) {
    let i = 0;
    for (const e of iterable) {
        if (predicate(e, i)) {
            yield e;
        } else {
            return;
        }
        i += 1;
    }
}

export function window(iterable, size) {
    if (size <= 0) {
        throw new Error("Cannot yield sliding windows of size <= 0");
    }
    return (function* () {
        const it = iter(iterable);
        const arr = [...take(it, size)];
        if (arr.length < size) {
            return;
        }
        yield [...arr];
        let front = 0;
        for (const e of it) {
            arr[front] = e;
            front = (front + 1) % size;
            yield arr.slice(front).concat(arr.slice(0, front));
        }
    })();
}

export function* zip(...iterables) {
    iterables = iterables.map(iter);
    while (true) {
        const result = [];
        for (const iter of iterables) {
            const next = iter.next();
            if (next.done) {
                return;
            }
            result.push(next.value);
        }
        yield result;
    }
}
