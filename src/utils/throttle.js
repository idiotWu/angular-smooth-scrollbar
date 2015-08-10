/**
 * @module
 * @export {Function} throttle
 */

// throttle timers reset delay
const RESET_DELAY = 100;

/**
 * Call fn if it isn't be called in a period
 *
 * @param {Function} fn
 *
 * @return {Function}
 */
export let throttle = (fn, delay = RESET_DELAY) => {
    if (typeof fn !== 'function') return;

    let timer;

    return (...args) => {
        if (!timer) {
            setTimeout(() => fn(...args));
        }

        clearTimeout(timer);

        timer = setTimeout(() => {
            timer = undefined;
        }, delay);
    };
};