import {assertEquals, assertThrows} from "jsr:@std/assert@1";
import * as Stream from "../src/main.js";
import {alph, assertIterEquals, num} from "./utils.js";


Deno.test({
    name: "Count creates a sequence starting at 0 with no args",
    fn: () => assertIterEquals(Stream.count(), [0, 1, 2, 3, 4, 5], 6),
});

Deno.test({
    name: "Count creates a sequence with a start and step value",
    fn: () => assertIterEquals(Stream.count(3, 5), [3, 8, 13, 18, 23, 28], 6),
});

Deno.test({
    name: "Count creates a sequence with a start and negative step value",
    fn: () => assertIterEquals(
        Stream.count(3, -5),
        [3, -2, -7, -12, -17, -22],
        6,
    ),
});

Deno.test({
    name: "Count creates a sequence with a start and 0 step value",
    fn: () => assertIterEquals(Stream.count(3, 0), [3, 3, 3, 3, 3, 3], 6),
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
    name: "For each consumes nothing on empty iterables",
    fn: () => [...Stream.peek([], (_) => {
        throw new Error("Bang!");
    })],
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
    name: "Mapping values in empty iterables yields an empty iterable",
    fn: () => assertIterEquals(Stream.filter([], (_) => {
        throw new Error("Bang!");
    }), []),
});

Deno.test({
    name: "Values can be mapped",
    fn: () => assertIterEquals(Stream.map(num(3), (e) => e * 2), [0, 2, 4]),
});

Deno.test({
    name: "Map functions take an index",
    fn: () => assertIterEquals(
        Stream.map(alph(3), (e, i) => e.repeat(i + 1)),
        ["a", "bb", "ccc"],
    ),
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
    fn: () => assertIterEquals(Stream.takeWhile(alph(3), (e) => e === "a"), ["a"]),
});

Deno.test({
    name: "Take while will take several values",
    fn: () => assertIterEquals(
        Stream.takeWhile(alph(3), (e) => e !== "c"),
        ["a", "b"],
    ),
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
        assertIterEquals(Stream.windowed(alph(1), 1), [["a"]]);
        assertIterEquals(Stream.windowed(alph(2), 1), [["a"], ["b"]]);
        assertIterEquals(Stream.windowed(alph(2), 2), [["a", "b"]]);
        assertIterEquals(Stream.windowed(alph(3), 2), [["a", "b"], ["b", "c"]]);
        assertIterEquals(Stream.windowed(alph(4), 4), [["a", "b", "c", "d"]]);
    },
});

Deno.test({
    name: "Windowed streams with a size greater than the iterable yield nothing",
    fn: () => {
        assertIterEquals(Stream.windowed(alph(0), 1), []);
        assertIterEquals(Stream.windowed(alph(4), 5), []);
    },
});

Deno.test({
    name: "Windowed iterators with a size of 0 throw",
    fn: () => {
        assertThrows(() => Stream.windowed(alph(5), 0).next());
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
    fn: () => assertIterEquals(
        Stream.zip(alph(4), num(3)),
        [["a", 0], ["b", 1], ["c", 2]],
    ),
});
