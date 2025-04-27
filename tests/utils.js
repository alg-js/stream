import {assertEquals} from "jsr:@std/assert@1";

class Foo {
    constructor(value) {
        this.value = value;
    }

    equals(other) {
        return other instanceof Foo && this.value === other.value
    }
}

export function toObjects(values) {
    return values.map((e) => new Foo(e));
}

export function unwrap(values) {
    return values.map((e) => e.value);
}

/**
 * A function that should not be called
 */
export function bang() {
    throw new Error("This should never happen");
}

export function assertIterEquals(iter1, iter2, limit) {
    if (limit === undefined) {
        assertEquals([...iter1], [...iter2]);
    } else {
        iter1 = iter1[Symbol.iterator]();
        iter2 = iter2[Symbol.iterator]();
        for (let i = 0; i < limit; i++) {
            const e1 = iter1.next().value;
            const e2 = iter2.next().value;
            assertEquals(e1, e2);
        }
    }
}

export function alph(n) {
    return "abcdefghijklmnopqrstuvwxyz".slice(0, n)[Symbol.iterator]();
}

export function* num(n) {
    for (let i = 0; i < n; i++) {
        yield i;
    }
}
