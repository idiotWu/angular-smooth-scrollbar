/**
 * @module
 * @prototype {Function} destroy
 * @dependencies [ SmoothScrollbar ]
 */

import { SmoothScrollbar } from '../smooth_scrollbar';

export { SmoothScrollbar };

/**
 * @method
 * @api
 * Remove all event listeners
 */
SmoothScrollbar.prototype.destroy = function() {
    this.__listeners.length = 0;

    this.__handlers.forEach(({ evt, elem, handler }) => {
        elem.removeEventListener(evt, handler);
    });
};