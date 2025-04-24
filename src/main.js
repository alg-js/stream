/* @ts-self-types="./main.d.ts" */

/**
 * @template T
 * @param {Iterable<T>} iterable
 * @returns {Iterator<T>}
 */
function iter(iterable) {
    return iterable[Symbol.iterator]();
}

export function* count(start = 0, step = 1) {
    let i = start;
    while (true) {
        yield i;
        i += step;
    }
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

export function drop(iterable, limit) {
    return iter(iterable).drop(limit);
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

export function* enumerate(iterable, start = 0) {
    for (const e of iterable) {
        yield [start, e];
        start += 1;
    }
}

export function filter(iterable, predicate) {
    return iter(iterable).filter(predicate);
}

export function flatMap(iterable, mapping) {
    return iter(iterable).flatMap(mapping);
}

export function* peek(iterable, consumer) {
    let i = 0;
    for (const e of iterable) {
        consumer(e, i);
        yield e;
        i += 1;
    }
}

export function map(iterable, mapping) {
    return iter(iterable).map(mapping);
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

export function take(iterable, limit) {
    return iter(iterable).take(limit);
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

export function* windowed(iterable, size) {
    if (size === 0) {
        throw new Error("Cannot yield sliding windows of size 0");
    }
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
