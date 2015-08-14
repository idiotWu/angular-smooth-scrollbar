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
 * @param {Boolean} runInBegin: if set to `true`, callback will be fired at every period begin, otherwise at end.
 *
 * @return {Function}
 */
export let throttle = (fn, runInBegin = true, delay = RESET_DELAY) => {
    if (typeof fn !== 'function') return;

    let timer;

    return (...args) => {
        if (!timer && runInBegin) {
            setTimeout(() => fn(...args));
        }

        clearTimeout(timer);

        timer = setTimeout(() => {
            timer = undefined;
            if (!runInBegin) fn(...args);
        }, delay);
    };
};