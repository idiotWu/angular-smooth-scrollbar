/**
 * @module
 * @prototype {Function} setPosition
 * @dependencies [ SmoothScrollbar, #__updateThrottle, #__setThumbPosition, pickInRange ]
 */

import '../internals/set_thumb_position';
import { pickInRange } from '../utils/index';
import { SmoothScrollbar } from '../smooth_scrollbar';

export { SmoothScrollbar };

/**
 * @method
 * @api
 * Set scrollbar position without transition
 *
 * @param {Number} [x]: scrollbar position in x axis
 * @param {Number} [y]: scrollbar position in y axis
 */
SmoothScrollbar.prototype.setPosition = function(x = this.offset.x, y = this.offset.y) {
    cancelAnimationFrame(this.scrollAnimation);

    let status = {};
    let { offset, limit, $target, __listeners } = this;

    this.__updateThrottle();

    if (Math.abs(x - offset.x) > 1) this.showTrack('x');
    if (Math.abs(y - offset.y) > 1) this.showTrack('y');

    x = pickInRange(x, 0, limit.x);
    y = pickInRange(y, 0, limit.y);

    if (x === offset.x && y === offset.y) return;

    status.direction = {
        x: x === offset.x ? 'none' : (x > offset.x ? 'right' : 'left'),
        y: y === offset.y ? 'none' : (y > offset.y ? 'down' : 'up')
    };
    status.limit = {
        x: limit.x,
        y: limit.y
    };
    status.offset = this.offset = { x, y };

    // reset thumb position after offset update
    this.__setThumbPosition();

    let style = `translate3d(${-x}px, ${-y}px, 0)`;

    $target.content.css({
        '-webkit-transform': style,
        'transform': style
    });

    this.hideTrack();

    // invoke all listeners
    // don't need async calls
    __listeners.forEach((fn) => fn(status));
};