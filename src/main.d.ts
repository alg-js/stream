/**
 * Every day I pray for <https://tc39.es/proposal-type-annotations/>
 */

/**
 * A function that returns a truthy or falsy value
 */
type Predicate<T> = (e: T, i?: number) => boolean;
type Mapping<T, R> = (e: T, i?: number) => R;
type Consumer<T> = (e: T, i?: number) => void;
type Reducer<T> = (acc: T, e: T, i?: number) => T;
type Folder<T, R> = (acc: R, e: T, i?: number) => R;

/**
 * Infinitely iterates numbers with the given start and step values
 */
export function count(
  start: number,
  stop: number,
): Iterator<number, never, void>;

/**
 * Repeatedly yields elements from given iterator indefinitely.
 */
export function cycle<T>(
  iterable: Iterable<T>,
): Iterator<T>;

/**
 * Drops the given number of items from the iterable.
 * Yields all elements thenceforth.
 */
export function drop<T>(
  iterable: Iterable<T>,
  limit: number,
): Iterator<T>;

/**
 * Drops elements from the given iterable while the predicate is true.
 * Yields all elements thenceforth.
 */
export function dropWhile<T>(
  iterable: Iterable<T>,
  predicate: Predicate<T>,
): Iterator<T>;

/**
 * Returns 2-tuples of the form `[idx, value]`. Where `idx` is the index of the
 * current element starting at the given start value and `value` is the current
 * element
 */
export function enumerate<T>(
  iterable: Iterable<T>,
  start: number,
): Iterator<[number, T]>;

/**
 * Filters the iterable using the given predicate
 */
export function filter<T>(
  iterable: Iterable<T>,
  predicate: Predicate<T>,
): Iterable<T>;

/**
 * Maps the given iterable into a nested iterables and flattens the result.
 */
export function flatMap<T, R>(
  iterable: Iterable<T>,
  mapping: Mapping<T, Iterable<R>>,
): Iterable<R>;

/**
 * Applies the given consumer with each item and yields each value.
 */
export function peek<T>(
  iterable: Iterable<T>,
  consumer: Consumer<T>,
): Iterable<T>;

/**
 * Maps the given iterable with the given mapping function.
 */
export function map<T, R>(
  iterable: Iterable<T>,
  mapping: Mapping<T, R>,
): Iterable<R>;

/**
 * Indefinitely yields the given object.
 */
export function repeat<T>(
  object: T,
): Iterator<T>;

/**
 * Yields the given object the given number of times.
 */
export function repeat<T>(
  object: T,
  times: number,
): Iterator<T>;

/**
 * Takes and yields the first `limit` items from the iterable
 */
export function take<T>(
  iterable: Iterable<T>,
  limit: number,
): Iterator<T>;

/**
 * Yields values from the given iterable while the predicate is satisfied.
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
 * @throws {Error} if the given size is 0
 */
export function windowed<T>(
  iterable: Iterable<T>,
  size: number,
): Iterator<ArrayLike<T>>;

/**
 * Zips the given iterables. Stops once the shortest iterable has been consumed.
 */
export function zip<T>(
  ...iterables: Iterable<T>[]
): Iterator<ArrayLike<T>>;
