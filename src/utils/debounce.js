/**
 * @module
 * @export {Function} debounce
 */

// debounce timers reset delay
const RESET_DELAY = 100;

/**
 * Call fn if it isn't be called in a period
 *
 * @param {Function} fn
 * @param {Object} [options]: options includes three available params:
 *                            [delay]: debounce delay
 *                            [leading]: whether run in beginnig
 *                            [trailing]: whether run in ending
 *
 * @return {Function}
 */
export let debounce = (fn, { delay = RESET_DELAY, leading = true, trailing = true } = {}) => {
    if (typeof fn !== 'function') return;

    let timer;

    return (...args) => {
        if (!timer && leading) {
            setTimeout(() => fn(...args));
        }

        clearTimeout(timer);

        timer = setTimeout(() => {
            timer = undefined;
            if (trailing) fn(...args);
        }, delay);
    };
};