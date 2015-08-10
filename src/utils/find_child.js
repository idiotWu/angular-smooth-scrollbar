/**
 * @module
 * @export {Function} findChild
 */

/**
 * Find children elements with specific class name
 *
 * @param {Element} parentElem
 * @param {String} className
 *
 * @return {Array}: a list of matched children
 */
export let findChild = (parentElem, className) => {
    let children = parentElem.children;

    if (!children) return null;

    return [...children].filter((elem) => {
        return elem.className.match(className);
    });
};