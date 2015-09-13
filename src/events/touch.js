/**
 * @module
 * @prototype {Function} __touchHandlers
 * @dependencies [ SmoothScrollbar, #scrollTo, #setPosition, getOriginalEvent, getPosition, getTouchID, pickInRange ]
 */

import '../apis/scroll_to';
import '../apis/set_position';
import { SmoothScrollbar } from '../smooth_scrollbar';
import { getOriginalEvent, getPosition, getTouchID, pickInRange } from '../utils/index';

export { SmoothScrollbar };

/**
 * @method
 * @internal
 * Touch event handlers builder,
 * include `touchstart`, `touchmove` and `touchend`
 *
 * @param {Object} option
 *
 * @return {Object}: a set of event handlers
 */
let __touchHandlers = function({ easingDuration }) {
    let lastTouchTime, lastTouchID;
    let moveVelocity = {}, lastTouchPos = {}, touchRecords = {};

    let updateRecords = (evt) => {
        let touchList = getOriginalEvent(evt).touches;

        Object.keys(touchList).forEach((key) => {
            // record all touches that will be restored
            if (key === 'length') return;

            let touch = touchList[key];

            touchRecords[touch.identifier] = getPosition(touch);
        });
    };

    let startHandler = (evt) => {
        cancelAnimationFrame(this.scrollAnimation);
        updateRecords(evt);

        lastTouchID = getTouchID(evt);
        lastTouchPos = getPosition(evt);
        lastTouchTime = (new Date()).getTime();
        moveVelocity.x = moveVelocity.y = 0;
    };

    let moveHandler = (evt) => {
        updateRecords(evt);

        let touchID = getTouchID(evt);
        let { offset, limit } = this;

        if (lastTouchID === undefined) {
            // reset last touch info from records
            lastTouchID = touchID;

            // don't need error handler
            lastTouchPos = touchRecords[touchID];
            lastTouchTime = (new Date()).getTime();
        } else if (touchID !== lastTouchID) {
            // prevent multi-touch bouncing
            return;
        }

        if (!lastTouchPos) return;

        let duration = (new Date()).getTime() - lastTouchTime;
        let { x: lastX, y: lastY } = lastTouchPos;
        let { x: curX, y: curY } = lastTouchPos = getPosition(evt);

        duration = duration || 1; // fix Infinity error

        moveVelocity.x = (lastX - curX) / duration;
        moveVelocity.y = (lastY - curY) / duration;

        let destX = pickInRange(lastX - curX + offset.x, 0, limit.x);
        let destY = pickInRange(lastY - curY + offset.y, 0, limit.y);

        if (Math.abs(destX - offset.x) < 1 && Math.abs(destY - offset.y) < 1) {
            return this.__updateThrottle();
        }

        evt.preventDefault();
        evt.stopPropagation();

        // don't need easing too
        this.setPosition(destX, destY);
    };

    let endHandler = (evt) => {
        // release current touch
        delete touchRecords[lastTouchID];
        lastTouchID = undefined;

        let { x, y } = moveVelocity;
        let threshold = 10 / 1e3; // 10 px/s

        if (Math.abs(x) > threshold ||
            Math.abs(y) > threshold) {
            this.scrollTo(
                x * easingDuration + this.offset.x,
                y * easingDuration + this.offset.y,
                easingDuration
            );
        }

        moveVelocity.x = moveVelocity.y = 0;
    };

    return {
        start: startHandler,
        move: moveHandler,
        end: endHandler
    };
};

Object.defineProperty(SmoothScrollbar.prototype, '__touchHandlers', {
    value: __touchHandlers,
    writable: true,
    configurable: true
});
