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

import type {
  Accumulator,
  Consumer,
  Mapping,
  Predicate,
  Update,
} from "./types.d.ts";

/**
 * Chains two or more iterables together
 *
 * @example
 * ```javascript
 * console.log(...Stream.chain([1, 2, 3], ["a", "b", "c"]));  // 1 2 3 a b c
 * ```
 *
 * @template T
 * @param {...Iterable<T>} iterables one or more iterables
 * @returns {Iterator<T>} The values from the given iterables chained together
 */
export function chain<T>(
  ...iterables: Iterable<T>[]
): Iterator<T>;

/**
 * Splits the given iterable into arrays of the given size. Drops any dangling
 * elements.
 *
 * @example
 * ```javascript
 * console.log(...Stream.chunk([1, 2, 3, 4, 5], 2));  // [1, 2] [3, 4]
 * ```
 *
 * @template T
 * @param {Iterable<T>} iterable An iterable
 * @param {number} size The size of the chunk window
 * @param {Object} options
 * @param {"dropEnd" | "keepEnd" | "strict"} options.strategy
 * @returns {Iterator<T[]>} Chunks of the given size
 */
export function chunk<T>(
  iterable: Iterable<T>,
  size: number,
  options?: { strategy: "dropEnd" | "keepEnd" | "strict" },
): Iterator<T[]>;

/**
 * Repeatedly yields elements from given iterator indefinitely.
 *
 * Note: O(n) auxiliary space — where n is the size of the given iterable.
 *
 * @example
 * ```javascript
 * const beats = Stream.cycle([1, 2, 3, 4]);
 * console.log(...Stream.take(beats, 9));  // 1 2 3 4 1 2 3 4 1
 * ```
 *
 * @template T
 * @param {Iterable<T>} iterable An iterable
 * @returns {Iterator<T>} An infinite iterator if the given
 *  iterable contains at least one item or an empty iterator if the given
 *  iterable is empty
 */
export function cycle<T>(
  iterable: Iterable<T>,
): Iterator<T>;

/**
 * Deduplicates items in the given iterable — that is, replaces any contiguous
 * sequences of the same element with only one occurrence of that element.
 *
 * `options` is an object defining an `eq` function that takes two parameters
 * and determines equality. Uses strict equality by default.
 *
 * @example
 * ```javascript
 * const data = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 3, 3, 3, 2, 2, 1];
 * console.log(...Stream.dedup(data));  // 1 2 3 4 3 2 1
 * ```
 *
 * @template T
 * @param {Iterable<T>} iterable An iterable
 * @param {{eq: (e1: T, e2: T) => boolean}} options
 */
export function dedup<T>(
  iterable: Iterable<T>,
  options?: { eq?: (e1: T, e2: T) => boolean },
): Iterator<T>;

/**
 * Drops the given number of items from the iterable.
 * Yields all elements thenceforth.
 *
 * @example
 * ```javascript
 * const values = ["a", "b", "c", "d", "e", "f", "g"];
 * console.log(...Stream.drop(values, 3));  // d e f g
 * ```
 *
 * @template T
 * @param {Iterable<T>} iterable An iterable
 * @param {number} limit The number of items to drop from the start of the
 *  given iterable
 * @returns {Iterator<T>} An iterator of values after `limit` values have been
 *  dropped
 *  @throws {Error} when limit < 0
 */
export function drop<T>(
  iterable: Iterable<T>,
  limit: number,
): Iterator<T>;

/**
 * Drops elements from the given iterable while the predicate is true.
 * Yields all elements thenceforth.
 *
 * @example
 * ```javascript
 * const values = ["a", "b", "c", "d", "e", "f", "g"];
 * const predicate = (e) => "abc efg".includes(e);
 * console.log(...Stream.dropWhile(values, predicate));  // d e f g
 * ```
 *
 * @template T
 * @param {Iterable<T>} iterable An iterable
 * @param {Predicate<T>} predicate A predicate that takes a value and index
 * @returns {Iterator<T>} An iterator of values from the first value that does
 *  not satisfy the given predicate
 */
export function dropWhile<T>(
  iterable: Iterable<T>,
  predicate: Predicate<T>,
): Iterator<T>;

/**
 * Filters the iterable using the given predicate
 *
 * @example
 * ```javascript
 * const values = ["foo", "bar", "foobar", "baz"]
 * console.log(...Stream.filter(values, (e) => e.length === 3));  // foo bar baz
 * ```
 *
 * @template T
 * @param {Iterable<T>} iterable An iterable
 * @param {Predicate<T>} predicate A predicate that takes a value and index
 * @returns {Iterator<T>} All values that satisfy the given predicate
 */
export function filter<T>(
  iterable: Iterable<T>,
  predicate: Predicate<T>,
): Iterable<T>;

/**
 * Maps the given iterable into a nested iterables and flattens the result.
 *
 * @example
 * ```javascript
 * const database = ["foo", "baz", "bar"];
 * const indices = [0, 2];
 * console.log(...Stream.flatMap(indices, (e) => database[e]));  // f o o b a r
 * ```
 *
 * @template T
 * @template R
 * @param {Iterable<T>} iterable An iterable
 * @param {Mapping<T, Iterable<R>>} mapping A mapping function that maps values
 *  and indices to iterables
 * @returns {Iterator<R>} the results of the mapping function flattened
 */
export function flatMap<T, R>(
  iterable: Iterable<T>,
  mapping: Mapping<T, Iterable<R>>,
): Iterator<R>;

/**
 * Yields a sequence of values starting with the given accumulator.
 * Each successive element is calculated as
 * `accumulator = update(accumulator, index)`
 *
 * @example
 * ```javascript
 * const stream = Stream.iterate(1, (e) => e * 2);
 * console.log(...Stream.take(stream, 5));  // 1 2 4 8 16
 * ```
 *
 * @template T
 * @param {T} accumulator A value that will be accumulated
 * @param {Update<T>} update An update function used to update the
 *  {@link accumulator}
 * @returns {Iterator<T>} An infinite iterator of accumulated values
 */
export function iterate<T>(
  accumulator: T,
  update: Update<T>,
): Iterator<T>;

/**
 * Maps the given iterable with the given mapping function.
 *
 * @example
 * ```javascript
 * const data = ["a", "b", "c"];
 * const duplicate = (e, i) => e.repeat(i + 1);
 * console.log(...Stream.map(data, duplicate));  // a bb ccc
 * ```
 *
 * @template T
 * @template R
 * @param {Iterable<T>} iterable An iterable
 * @param {Mapping<T, R>} mapping A function that maps elements with an
 *  element and index
 * @returns {Iterator<R>} The items from {@link iterable} mapped.
 */
export function map<T, R>(
  iterable: Iterable<T>,
  mapping: Mapping<T, R>,
): Iterator<R>;

/**
 * Applies the given consumer with each item and yields each value.
 *
 * @example
 * ```javascript
 * const data = ["a", "b", "c"];
 * const echo = Stream.peek(data, (e, i) => console.info([e, i]));
 * console.log(...echo);  // [ "a", 0 ] \ [ "b", 1 ] \ [ "c", 2 ] \ a b c
 * ```
 *
 * @template T
 * @param {Iterable<T>} iterable An iterable
 * @param {Consumer<T>} consumer A function that does something with `T` and
 *  has no result/
 * @returns {Iterator<T>} The values of {@link iterable}
 */
export function peek<T>(
  iterable: Iterable<T>,
  consumer: Consumer<T>,
): Iterator<T>;

/**
 * Indefinitely yields the given object.
 *
 * @example
 * ```javascript
 * const foos = Stream.repeat("foo");
 * console.log(...Stream.take(foos, 3));  // foo foo foo
 * ```
 *
 * @template T
 * @param {T} object The object to repeat
 * @returns {Iterator<T>} An infinite iterator containing `object`
 */
export function repeat<T>(
  object: T,
): Iterator<T>;

/**
 * Yields the given object the given number of times.
 *
 * @example
 * ```javascript
 * console.log(...Stream.repeat("foo", 3));  // foo foo foo
 * ```
 *
 * @template T
 * @param {T} object The object to repeat
 * @param {number} times The number of times to repeat the object
 * @returns {Iterator<T>} An iterator containing `object` the given number of
 *  times
 */
export function repeat<T>(
  object: T,
  times: number,
): Iterator<T>;

/**
 * Scans the given iterable, accumulating and yielding a result for each value.
 * The first value of the iterable is yielded and used as the initial
 * accumulator value.
 *
 * @example
 * ```javascript
 * const data = [3, 1, 4, 1, 5];
 * console.log(...Stream.scan(data, (a, e) => a + e));  // 3 4 8 9 14
 * ```
 *
 * @template T
 * @param {Iterable<T>} iterable
 * @param {Accumulator<T, T>} accumulator
 * @returns {Iterator<T>} The scanned results
 */
export function scan<T>(
  iterable: Iterable<T>,
  accumulator: Accumulator<T, T>,
): Iterator<T>;

/**
 * Scans the given iterable, accumulating and yielding a result for each value.
 * Uses and yields `initial` as the initial accumulator value.
 *
 * @example
 * ```javascript
 * const data = [1, 4, 1, 5];
 * console.log(...Stream.scan(data, (a, e) => a + e), 3);  // 3 4 8 9 14
 * ```
 *
 * @template T
 * @template R
 * @param {Iterable<T>} iterable
 * @param {Accumulator<T, R>} accumulator
 * @param {R} initial
 */
export function scan<T, R>(
  iterable: Iterator<T>,
  accumulator: Accumulator<T, R>,
  initial: R,
): Iterator<R>;

/**
 * Takes and yields the first `limit` items from the iterable
 *
 * @example
 * ```javascript
 * const data = ["foo", "bar", "baz", "foobar"];
 * console.log(...Stream.take(data, 2));  // foo bar
 * ```
 *
 * @template T
 * @param {Iterable<T>} iterable An iterable
 * @param {number} limit The number of items to take
 * @returns {Iterator<T>} An iterator with the first {@link limit} items from
 *  {@link iterable}.
 *  @throws {Error} if limit < 0
 */
export function take<T>(
  iterable: Iterable<T>,
  limit: number,
): Iterator<T>;

/**
 * Yields values from the given iterable while the predicate is satisfied.
 *
 * @example
 * ```javascript
 * const letters = "abcdefg";
 * const predicate = (e) => "abc efg".includes(e);
 * console.log(...Stream.takeWhile(letters, predicate));  // a b c
 * ```
 */
export function takeWhile<T>(
  iterable: Iterable<T>,
  predicate: Predicate<T>,
): Iterator<T>;

/**
 * Yields sliding windows over the iterator.
 * If the given size is larger than the length of the iterator, nothing is
 * yielded.
 *
 * @example
 * ```javascript
 * const letters = "abcde";
 * console.log(...Stream.window(letters, 3));
 * // ["a", "b", "c"] ["b", "c", "d"] ["c", "d", "e"]
 * ```
 * @example
 * ```javascript
 * const letters = "abcde";
 * console.log([...Stream.window(letters, 1000)]);  // []
 * ```
 *
 * @template T
 * @param {Iterable<T>} iterable An Iterable
 * @param {number} size The size of the sliding window
 * @returns {Iterator<ArrayLike<T>>} An iterator of windows
 * @throws {Error} if the given size is 0
 */
export function window<T>(
  iterable: Iterable<T>,
  size: number,
): Iterator<ArrayLike<T>>;

/**
 * Zips the given iterables. Stops once the shortest iterable has been consumed.
 *
 * @example
 * ```javascript
 * const nums = [0, 1, 2, 3, 4];
 * const alph = "abcd";
 * const foos = ["foo", "bar", "baz"];
 *
 * console.log(...Stream.zip(nums, alph, foos));
 * // [0, "a", "foo"] [1, "b", "bar"] [2, "c", "baz"]
 * ```
 */
export function zip(
  ...args: Iterable<unknown>[]
): Iterable<ArrayLike<unknown>>;

/**
 * Zips the given iterables with the given zipping strategy.
 *
 * The strategy can be one of:
 * - `shortest`: stops when the shortest iterable has been consumed
 * - `longest`: continues yielding elements until all iterables have been
 * consumed. A `fillValue` can be provided to be used as the default value for
 * consumed iterables. By default, `fillValue is undefined`
 * - `strict`: throws if any iterables are of uneven length
 *
 * @example shortest
 * ```javascript
 * const nums = [0, 1, 2, 3, 4];
 * const alph = "abcd";
 * const foos = ["foo", "bar", "baz"];
 *
 * console.log(...Stream.zip(nums, alph, foos, {strategy: "shortest"}));
 * // [0, "a", "foo"] [1, "b", "bar"] [2, "c", "baz"]
 * ```
 *
 * @example longest
 * ```javascript
 * const nums = [0, 1, 2, 3];
 * const alph = "abc";
 * const foos = ["foo", "bar"];
 *
 * const zipped = Stream.zip(
 *     nums, alph, foos,
 *     {strategy: "longest", fillValue: "X"},
 * );
 * console.log(...zipped);
 * // [0, "a", "foo"] [1, "b", "bar"] [2, "c", "X"] [3, "X", "X"]
 * ```
 *
 * @example strict
 * ```javascript
 * const nums = [0, 1, 2, 3, 4];
 * const alph = "abcd";
 * const foos = ["foo", "bar", "baz"];
 *
 * const zipped = Stream.zip(nums, alph, foos, {strategy: "strict"});
 * try {
 *     console.log(...zipped);
 * } catch (e) {
 *     // Error: Zipped iterables of unequal length with strategy = strict
 *     console.log(e.toString());
 * }
 * ```
 */
export function zip(
  ...args: [
    ...Iterable<unknown>[],
    {
        strategy: "shortest" | "longest" | "strict",
        fillValue?: unknown,
    },
  ]
): Iterable<ArrayLike<unknown>>;
