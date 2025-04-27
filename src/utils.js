/**
 * Compares objects for equality.
 *
 * First compares objects by strict equality. If two objects are not equivalent
 * with strict equality, the function will then try calling `.equals` on `left`.
 * Roughly equivalent to:
 * ```javascript
 * left === right || (typeof left.equals === "function" && left.equals(right))
 * ```
 *
 * @param {unknown} left
 * @param {unknown} right
 * @returns {boolean}
 */
export function equals(left, right) {
    return left === right
        || (typeof left.equals === "function" && left.equals(right));
}
