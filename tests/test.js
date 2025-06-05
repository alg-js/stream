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

import {assertEquals, assertThrows} from "jsr:@std/assert@1";
import * as Stream from "../src/main.js";
import {alph, assertIterEquals, bang, num, toObjects, unwrap} from "./utils.js";


Deno.test({
    name: "Chain will yield an empty iterable, when given empty iterables",
    fn: () => {
        assertIterEquals(Stream.chain([]), []);
        assertIterEquals(Stream.chain([], []), []);
        assertIterEquals(Stream.chain([], [], []), []);
    },
});

Deno.test({
    name: "Chain will yield an iterable",
    fn: () => assertIterEquals(Stream.chain(alph(3)), alph(3)),
});

Deno.test({
    name: "Chain will yield an iterable padded with empty iterables",
    fn: () => {
        assertIterEquals(Stream.chain([], alph(3)), alph(3));
        assertIterEquals(Stream.chain(alph(3), []), alph(3));
        assertIterEquals(Stream.chain([], alph(3), []), alph(3));
    },
});

Deno.test({
    name: "Chain will chain multiple iterables",
    fn: () => assertIterEquals(
        Stream.chain(alph(3), num(3), ["foo", "bar", "baz"]),
        [...alph(3), ...num(3), "foo", "bar", "baz"],
    ),
});

Deno.test({
    name: "Chain is lazy",
    fn: () => {
        const it1 = alph(3);
        const it2 = num(3);
        Stream.chain(it1, it2).next();
        assertEquals(it1.next().value, "b");
        Stream.chain(it1, it2).next();
        Stream.chain(it1, it2).next();
        assertEquals(it2.next().value, 1);
    },
});

Deno.test({
    name: "Chunk yields nothing for empty iterables",
    fn: () => assertIterEquals(Stream.chunk([], 1), []),
});

Deno.test({
    name: "Chunk yields a single chunk",
    fn: () => assertIterEquals(Stream.chunk(alph(3), 3), [["a", "b", "c"]]),
});

Deno.test({
    name: "Chunk yields multiple chunks",
    fn: () => {
        assertIterEquals(
            Stream.chunk(alph(6), 3),
            [["a", "b", "c"], ["d", "e", "f"]],
        );
        assertIterEquals(
            Stream.chunk(alph(6), 3, {strategy: "keepEnd"}),
            [["a", "b", "c"], ["d", "e", "f"]],
        );
        assertIterEquals(
            Stream.chunk(alph(6), 3, {strategy: "strict"}),
            [["a", "b", "c"], ["d", "e", "f"]],
        );
    },
});

Deno.test({
    name: "Chunk discards leftovers",
    fn: () => {
        assertIterEquals(
            Stream.chunk(alph(8), 3),
            [["a", "b", "c"], ["d", "e", "f"]],
        );
        assertIterEquals(
            Stream.chunk(alph(8), 3, {strategy: "dropEnd"}),
            [["a", "b", "c"], ["d", "e", "f"]],
        );
    },
});

Deno.test({
    name: "Chunk keeps leftovers with `keepEnd`",
    fn: () => {
        assertIterEquals(
            Stream.chunk(alph(10), 3, {strategy: "keepEnd"}),
            [["a", "b", "c"], ["d", "e", "f"], ["g", "h", "i"], ["j"]],
        );
        assertIterEquals(
            Stream.chunk(alph(8), 3, {strategy: "keepEnd"}),
            [["a", "b", "c"], ["d", "e", "f"], ["g", "h"]],
        );
    },
});

Deno.test({
    name: "Chunk throws with `strict`",
    fn: () => {
        const it = Stream.chunk(alph(10), 3, {strategy: "strict"});
        assertEquals(it.next().value, ["a", "b", "c"]);
        assertEquals(it.next().value, ["d", "e", "f"]);
        assertEquals(it.next().value, ["g", "h", "i"]);
        assertThrows(() => it.next());

        const it1 = Stream.chunk(alph(8), 3, {strategy: "strict"});
        assertEquals(it1.next().value, ["a", "b", "c"]);
        assertEquals(it1.next().value, ["d", "e", "f"]);
        assertThrows(() => it1.next());
    },
});

Deno.test({
    name: "Chunk throws on <= 0 chunk size",
    fn: () => {
        assertThrows(() => Stream.chunk([], 0));
        assertThrows(() => Stream.chunk([], -1));
    },
});

Deno.test({
    name: "Chunk is lazy",
    fn: () => {
        const it = alph(5);
        const stream = Stream.chunk(it, 2);
        assertEquals(stream.next().value, ["a", "b"]);
        assertEquals(it.next().value, "c");
    },
});

Deno.test({
    name: "Cycle will cycle iterators",
    fn: () => assertIterEquals(Stream.cycle(alph(3)), "abcabcabc", 9),
});

Deno.test({
    name: "Cycle yields nothing when cycling an empty iterable",
    fn: () => assertIterEquals(Stream.cycle([]), []),
});

Deno.test({
    name: "Dedup yields nothing when cycling an empty iterable",
    fn: () => assertIterEquals(Stream.dedup([]), []),
});

Deno.test({
    name: "Dedup yields an iterable if it has no duplicates",
    fn: () => assertIterEquals(Stream.dedup([1, 2, 3, 2, 1]), [1, 2, 3, 2, 1]),
});

Deno.test({
    name: "Dedup removes duplicates",
    fn: () => assertIterEquals(
        Stream.dedup([1, 2, 2, 3, 3, 3, 4]),
        [1, 2, 3, 4],
    ),
});

Deno.test({
    name: "Dedup compares objects",
    fn: () => assertIterEquals(
        unwrap(Stream.dedup(
            toObjects([1, 2, 2, 3, 3, 3, 4]),
            {eq: (l, r) => l.equals(r)},
        )),
        [1, 2, 3, 4],
    ),
});

Deno.test({
    name: "Dedup is lazy",
    fn: () => {
        const it = [1, 1, 1, 1, 2, 3][Symbol.iterator]();
        const stream = Stream.dedup(it);
        assertEquals(stream.next().value, 1);
        assertEquals(it.next().value, 1);
        assertEquals(stream.next().value, 2);
        assertEquals(it.next().value, 3);
    },
});

Deno.test({
    name: "Drop drop nothing on empty iterators",
    fn: () => assertIterEquals(Stream.drop([], 3), []),
});

Deno.test({
    name: "Drop drop nothing when limit is 0",
    fn: () => assertIterEquals(Stream.drop(alph(3), 0), "abc"),
});

Deno.test({
    name: "Drop drop the specified number of items",
    fn: () => assertIterEquals(Stream.drop(alph(3), 2), "c"),
});

Deno.test({
    name: "Drop will drop the entire iterable with limit === length",
    fn: () => assertIterEquals(Stream.drop(alph(3), 3), []),
});

Deno.test({
    name: "Drop will drop the entire iterable with limit > length",
    fn: () => assertIterEquals(Stream.drop(alph(3), 4), ""),
});

Deno.test({
    name: "Drop is lazy",
    fn: () => {
        const it = alph(3);
        Stream.drop(it, 1).next();
        assertIterEquals(it, "c");
    },
});

Deno.test({
    name: "Drop throws on < 0 limit",
    fn: () => {
        assertThrows(() => Stream.drop([], -2));
        assertThrows(() => Stream.drop([], -1));
    },
});

Deno.test({
    name: "DropWhile yields nothing for empty iterables",
    fn: () => assertIterEquals(Stream.dropWhile([], (_) => true), []),
});

Deno.test({
    name: "DropWhile yields nothing with tautologies",
    fn: () => assertIterEquals(Stream.dropWhile(alph(3), (_) => true), []),
});

Deno.test({
    name: "DropWhile yields everything with contradictions",
    fn: () => assertIterEquals(Stream.dropWhile(alph(3), (_) => false), "abc"),
});

Deno.test({
    name: "DropWhile drops values based on the given predicate",
    fn: () => assertIterEquals(
        Stream.dropWhile(alph(3), (e) => e === "a"),
        "bc",
    ),
});

Deno.test({
    name: "DropWhile is lazy",
    fn: () => {
        const it = alph(3);
        Stream.dropWhile(it, (e) => e === "a").next();
        assertIterEquals(it, "c");
    },
});

Deno.test({
    name: "DropWhile predicates take an index",
    fn: () => assertIterEquals(
        Stream.dropWhile(alph(4), (_, i) => i <= 1),
        "cd",
    ),
});

Deno.test({
    name: "Filtering values in empty iterables yields an empty iterable",
    fn: () => assertIterEquals(Stream.filter([], (_) => true), []),
});

Deno.test({
    name: "Filtering values with contradictions yields an empty iterable",
    fn: () => assertIterEquals(Stream.filter(num(3), (_) => false), []),
});

Deno.test({
    name: "Filtering values with tautologies yields the original iterable",
    fn: () => assertIterEquals(Stream.filter(num(3), (_) => true), [0, 1, 2]),
});

Deno.test({
    name: "Values can be filtered",
    fn: () => assertIterEquals(
        Stream.filter(num(6), (e) => e % 2 === 0),
        [0, 2, 4],
    ),
});

Deno.test({
    name: "Filter is lazy",
    fn: () => {
        const it = alph(3);
        Stream.filter(it, (e) => e !== "a").next();
        assertEquals(it.next().value, "c");
    },
});

Deno.test({
    name: "Filter predicates take an index",
    fn: () => assertIterEquals(
        Stream.filter(alph(6), (_, i) => i % 2 === 0),
        "ace",
    ),
});

Deno.test({
    name: "Flat Mapping values in empty iterables yields an empty iterable",
    fn: () => assertIterEquals(Stream.flatMap([], (_) => alph(3)), []),
});

Deno.test({
    name: "Flat Mapping values to empty iterables yields an empty iterable",
    fn: () => assertIterEquals(Stream.flatMap(alph(3), (_) => []), []),
});

Deno.test({
    name: "Values can be flat mapped",
    fn: () => assertIterEquals(
        Stream.flatMap(num(3), (e) => [e, -e]),
        [0, 0, 1, -1, 2, -2],
    ),
});

Deno.test({
    name: "FlatMap mappings take an index",
    fn: () => assertIterEquals(
        Stream.flatMap(alph(3), (_, i) => [i, -i]),
        [0, 0, 1, -1, 2, -2],
    ),
});

Deno.test({
    name: "Iterate yields values",
    fn: () => assertIterEquals(
        Stream.iterate(0, (e) => e + 1),
        [0, 1, 2, 3, 4, 5],
        6,
    ),
});

Deno.test({
    name: "Iterate function takes indices",
    fn: () => assertIterEquals(
        Stream.iterate(0, (e, i) => e + i),
        [0, 0, 1, 3, 6],
        5,
    ),
});

Deno.test({
    name: "FlatMap is lazy",
    fn: () => {
        const it = alph(2);
        Stream.flatMap(it, (e) => [e, e]).next();
        assertEquals(it.next().value, "b");
    },
});

Deno.test({
    name: "Mapping values in empty iterables yields an empty iterable",
    fn: () => assertIterEquals(Stream.map([], bang), []),
});

Deno.test({
    name: "Values can be mapped",
    fn: () => assertIterEquals(Stream.map(num(3), (e) => e * 2), [0, 2, 4]),
});

Deno.test({
    name: "Map is lazy",
    fn: () => {
        const it = alph(2);
        Stream.map(it, (e) => e.toUpperCase()).next();
        assertEquals(it.next().value, "b");
    },
});

Deno.test({
    name: "Map functions take an index",
    fn: () => assertIterEquals(
        Stream.map(alph(3), (e, i) => e.repeat(i + 1)),
        ["a", "bb", "ccc"],
    ),
});

Deno.test({
    name: "Peek consumes nothing on empty iterables",
    fn: () => [...Stream.peek([], bang)],
});

Deno.test({
    name: "Peek consumes elements",
    fn: () => {
        const result = [];
        assertIterEquals(Stream.peek(alph(3), (e) => result.push(e)), "abc");
        assertIterEquals(result, "abc");
    },
});


Deno.test({
    name: "Peek consumers take an index",
    fn: () => {
        const result = [];
        assertIterEquals(
            Stream.peek(alph(3), (e, i) => result.push([e, i])),
            "abc",
        );
        assertEquals(result, [["a", 0], ["b", 1], ["c", 2]]);
    },
});

Deno.test({
    name: "Peek is lazy",
    fn: () => {
        const it = alph(2);
        const result = [];
        Stream.peek(it, (e) => result.push(e)).next();
        assertEquals(it.next().value, "b");
        assertEquals(result, ["a"]);
    },
});

Deno.test({
    name: "Repeat will repeat an object indefinitely",
    fn: () => {
        const s = Stream.take(Stream.repeat("a"), 100);
        for (const e of s) {
            assertEquals(e, "a");
        }
    },
});

Deno.test({
    name: "Repeat will repeat an object n times",
    fn: () => assertIterEquals(Stream.repeat("a", 4), ["a", "a", "a", "a"]),
});

Deno.test({
    name: "Repeat will repeat an object 0 times",
    fn: () => assertIterEquals(Stream.repeat("a", 0), []),
});

Deno.test({
    name: "Scan yields nothing on empty iterables",
    fn: () => assertIterEquals(Stream.scan([], bang), []),
});

Deno.test({
    name: "Scan does not yield the initial value when given",
    fn: () => assertIterEquals(Stream.scan([], bang, "a"), []),
});

Deno.test({
    name: "Scan yields the first value of the iterable",
    fn: () => assertIterEquals(Stream.scan(["a"], bang), ["a"]),
});

Deno.test({
    name: "Scan accumulates values",
    fn: () => assertIterEquals(
        Stream.scan(alph(4), (a, e) => a + e),
        ["a", "ab", "abc", "abcd"],
    ),
});

Deno.test({
    name: "Scan accumulator takes an index",
    fn: () => assertIterEquals(
        Stream.scan(alph(4), (a, e, i) => a + e + i),
        ["a", "ab1", "ab1c2", "ab1c2d3"],
    ),
});

Deno.test({
    name: "Scan accumulator index is adjusted for initial values",
    fn: () => assertIterEquals(
        Stream.scan(alph(4), (a, e, i) => a + e + i, "X"),
        ["Xa0", "Xa0b1", "Xa0b1c2", "Xa0b1c2d3"],
    ),
});

Deno.test({
    name: "Scan is lazy",
    fn: () => {
        const it = alph(2);
        const stream = Stream.scan(it, (a, e, i) => a + e + i);
        assertEquals(stream.next().value, "a");
        assertEquals(it.next().value, "b");
    },
});

Deno.test({
    name: "Take will take nothing from an empty iterator",
    fn: () => assertIterEquals(Stream.take([], 1), []),
});

Deno.test({
    name: "Take will take nothing from an iterator with n of 0",
    fn: () => assertIterEquals(Stream.take(alph(3), 0), []),
});

Deno.test({
    name: "Take will take the whole iterator when n is out of bounds",
    fn: () => assertIterEquals(Stream.take(alph(3), 10), ["a", "b", "c"]),
});

Deno.test({
    name: "Take will take one value",
    fn: () => assertIterEquals(Stream.take(alph(3), 1), ["a"]),
});

Deno.test({
    name: "Take will take several values",
    fn: () => assertIterEquals(Stream.take(alph(3), 2), ["a", "b"]),
});

Deno.test({
    name: "take is lazy",
    fn: () => {
        const it = alph(3);
        Stream.take(it, 2).next();
        assertEquals(it.next().value, "b");
    },
});


Deno.test({
    name: "Take throws on < 0 limit",
    fn: () => {
        assertThrows(() => Stream.take([], -2));
        assertThrows(() => Stream.take([], -1));
    },
});

Deno.test({
    name: "Take while will take nothing from an empty iterator",
    fn: () => assertIterEquals(Stream.takeWhile([], (_) => true), []),
});

Deno.test({
    name: "Take while will take nothing from an iterator with a contradiction",
    fn: () => assertIterEquals(Stream.takeWhile(alph(3), (_) => false), []),
});

Deno.test({
    name: "Take while will take the whole iterator with a tautology",
    fn: () => assertIterEquals(
        Stream.takeWhile(alph(3), (_) => true),
        ["a", "b", "c"],
    ),
});

Deno.test({
    name: "Take while will take one value",
    fn: () => assertIterEquals(
        Stream.takeWhile(alph(3), (e) => e === "a"),
        ["a"],
    ),
});

Deno.test({
    name: "Take while will take several values",
    fn: () => assertIterEquals(
        Stream.takeWhile(alph(3), (e) => e !== "c"),
        ["a", "b"],
    ),
});

Deno.test({
    name: "TakeWhile is lazy",
    fn: () => {
        const it = alph(3);
        Stream.takeWhile(it, (e) => e !== "b").next();
        assertEquals(it.next().value, "b");
    },
});

Deno.test({
    name: "TakeWhile predicates take an index",
    fn: () => assertIterEquals(
        Stream.takeWhile(alph(3), (_, i) => i < 2),
        "ab",
    ),
});

Deno.test({
    name: "Iterables can be windowed",
    fn: () => {
        assertIterEquals(Stream.window(alph(1), 1), [["a"]]);
        assertIterEquals(Stream.window(alph(2), 1), [["a"], ["b"]]);
        assertIterEquals(Stream.window(alph(2), 2), [["a", "b"]]);
        assertIterEquals(Stream.window(alph(3), 2), [["a", "b"], ["b", "c"]]);
        assertIterEquals(Stream.window(alph(4), 4), [["a", "b", "c", "d"]]);
    },
});

Deno.test({
    name: "Windowed streams with a size greater than the iterable yield nothing",
    fn: () => {
        assertIterEquals(Stream.window(alph(0), 1), []);
        assertIterEquals(Stream.window(alph(4), 5), []);
    },
});

Deno.test({
    name: "Windowed iterators with a size of <= 0 throw",
    fn: () => {
        assertThrows(() => Stream.window(alph(5), 0));
        assertThrows(() => Stream.window(alph(5), -1));
    },
});

Deno.test({
    name: "Windowed is lazy",
    fn: () => {
        const it = alph(3);
        Stream.window(it, 2).next();
        assertEquals(it.next().value, "c");
    },
});

Deno.test({
    name: "Zip returns an empty iterator when given nothing to zip",
    fn: () => assertIterEquals(Stream.zip([]), []),
});

Deno.test({
    name: "Zip returns an empty iterator when any iterator is empty",
    fn: () => assertIterEquals(Stream.zip(alph(3), num(3), []), []),
});

Deno.test({
    name: "Zip returns single values when zipping a single iterator",
    fn: () => assertIterEquals(Stream.zip(alph(3)), [["a"], ["b"], ["c"]]),
});

Deno.test({
    name: "Zip returns an iterator when zipping a multiple iterators",
    fn: () => assertIterEquals(
        Stream.zip(alph(3), num(3)),
        [["a", 0], ["b", 1], ["c", 2]],
    ),
});

Deno.test({
    name: "Zip stops on the shortest iterator",
    fn: () => {
        assertIterEquals(
            Stream.zip(alph(4), num(3)),
            [["a", 0], ["b", 1], ["c", 2]],
        );
        assertIterEquals(
            Stream.zip(alph(4), num(3), {strategy: "shortest"}),
            [["a", 0], ["b", 1], ["c", 2]],
        );
    },
});

Deno.test({
    name: "Zip stops on the longest iterator with strategy longest",
    fn: () => {
        assertIterEquals(
            Stream.zip(alph(4), num(3), {strategy: "longest"}),
            [["a", 0], ["b", 1], ["c", 2], ["d", undefined]],
        );
        assertIterEquals(
            Stream.zip(alph(4), num(3), {
                strategy: "longest",
                fillValue: "foo",
            }),
            [["a", 0], ["b", 1], ["c", 2], ["d", "foo"]],
        );
    },
});

Deno.test({
    name: "Zip throws on uneven iterators with strategy strict",
    fn: () => {
        const it = Stream.zip(alph(4), num(3), {strategy: "strict"});
        assertEquals(it.next().value, ["a", 0]);
        assertEquals(it.next().value, ["b", 1]);
        assertEquals(it.next().value, ["c", 2]);
        assertThrows(() => it.next());
    },
});

Deno.test({
    name: "Zip yields even iterators with strategy strict",
    fn: () => assertIterEquals(
        Stream.zip(alph(3), num(3), {strategy: "strict"}),
        [["a", 0], ["b", 1], ["c", 2]],
    ),
});

Deno.test({
    name: "Zip throws on unrecognised strategy",
    fn: () => {
        assertThrows(() => Stream.zip(alph(4), num(3), {strategy: "foo"}));
    },
});

Deno.test({
    name: "Zip is lazy",
    fn: () => {
        const it1 = alph(2);
        const it2 = num(2);
        Stream.zip(it1, it2).next();
        assertEquals(it1.next().value, "b");
        assertEquals(it2.next().value, 1);
    },
});
