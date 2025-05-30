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

/**
 * A function that returns a truthy or falsy value
 */
export type Predicate<T> = (e: T, i?: number) => boolean;

/**
 * A function that maps the given value
 */
export type Mapping<T, R> = (e: T, i?: number) => R;

/**
 * A function that performs some operation and returns nothing
 */
export type Consumer<T> = (e: T, i?: number) => void;

/**
 * A function that updates the given value
 */
export type Update<T> = (e: T, i?: number) => T;

/**
 * A function that accumulates values
 */
export type Accumulator<T, R> = (acc: R, e: T, i?: number) => R;
