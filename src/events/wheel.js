/**
 * @module
 * @prototype {Function} __wheelHandler
 * @dependencies [ SmoothScrollbar, #scrollTo, getDelta, throttle, pickInRange ]
 */

import '../apis/scroll_to';
import { SmoothScrollbar } from '../smooth_scrollbar';
import { getDelta, throttle, pickInRange } from '../utils/index';

export { SmoothScrollbar };

/**
 * @method
 * @internal
 * Wheel event handler builder
 *
 * @param {Object} option
 *
 * @return {Function}: event handler
 */
let __wheelHandler = function({ speed, stepLength }) {
    let lastScrollTime;

    let resetDelay = throttle(() => { lastScrollTime = undefined; });

    return (evt) => {
        resetDelay();

        let { offset, limit } = this;
        let { x, y } = getDelta(evt);
        let now = (new Date()).getTime();
        let duration = lastScrollTime ? (now - lastScrollTime) : 0;
        lastScrollTime = now;

        let destX = pickInRange(x * speed * stepLength + offset.x, 0, limit.x);
        let destY = pickInRange(y * speed * stepLength + offset.y, 0, limit.y);

        if ((Math.abs(destX - offset.x) < 1 && destY === offset.y) ||
            (Math.abs(destY - offset.y) < 1 && destX === offset.x)) return;

        evt.preventDefault();
        evt.stopPropagation();

        this.scrollTo(destX, destY, duration * 10 / speed);
    };
};

Object.defineProperty(SmoothScrollbar.prototype, '__wheelHandler', {
    value: __wheelHandler,
    writable: true,
    configurable: true
});
