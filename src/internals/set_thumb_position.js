/**
 * @module
 * @prototype
 * @dependencies [ SmoothScrollbar, #showTrack, #addTrack ]
 */

import { SmoothScrollbar } from '../smooth_scrollbar';

export { SmoothScrollbar };

/**
 * @method
 * @internal
 * Set thumb position in track
 */
let __setThumbPosition = function() {
    let $target = this.$target;
    let { x, y } = this.offset;

    let styleX = `translate3d(${x / this.size.content.width * this.size.container.width}px, 0, 0)`;
    let styleY = `translate3d(0, ${y / this.size.content.height * this.size.container.height}px, 0)`;

    $target.xAxis.thumb.css({
        '-webkit-transform': styleX,
        'transform': styleX
    });

    $target.yAxis.thumb.css({
        '-webkit-transform': styleY,
        'transform': styleY
    });
};

Object.defineProperty(SmoothScrollbar.prototype, '__setThumbPosition', {
    value: __setThumbPosition,
    writable: true,
    configurable: true
});
