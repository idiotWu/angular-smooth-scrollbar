/**
 * @module
 * @prototype {Function} update
 * @dependencies [ SmoothScrollbar, #getSize, #__setThumbPosition, pickInRange ]
 */

import './get_size';
import '../internals/set_thumb_position';
import { pickInRange } from '../utils/index';
import { SmoothScrollbar } from '../smooth_scrollbar';

export { SmoothScrollbar };

/**
 * @method
 * @api
 * Update scrollbars appearance in next animation frame
 */
SmoothScrollbar.prototype.update = function() {
    requestAnimationFrame(() => {
        let size = this.size = this.getSize();
        let newLimit = {
            x: size.content.width - size.container.width,
            y: size.content.height - size.container.height
        };

        if (this.limit &&
            newLimit.x === this.limit.x &&
            newLimit.y === this.limit.y) return;

        this.limit = newLimit;

        // hide scrollbar if content size less than container
        this.$target.xAxis.track.css(
            'display',
            size.content.width <= size.container.width ? 'none' : 'block'
        );
        this.$target.yAxis.track.css(
            'display',
            size.content.height <= size.container.height ? 'none' : 'block'
        );

        // use percentage value for thumb
        this.$target.xAxis.thumb.css(
            'width',
            `${pickInRange(size.container.width / size.content.width, 0, 1) * 100}%`
        );
        this.$target.yAxis.thumb.css(
            'height',
            `${pickInRange(size.container.height / size.content.height, 0, 1) * 100}%`
        );

        this.__setThumbPosition();
    });
};