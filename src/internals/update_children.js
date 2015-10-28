/**
 * @module
 * @prototype
 * @dependencies [ SmoothScrollbar ]
 */

import { SmoothScrollbar } from '../smooth_scrollbar';

export { SmoothScrollbar };

function __updateChildren() {
    Object.defineProperty(this, '__children', {
        value: [...this.target.content.querySelectorAll('[scrollbar]')],
        writable: true
    });
};

Object.defineProperty(SmoothScrollbar.prototype, '__updateChildren', {
    value: __updateChildren,
    writable: true,
    configurable: true
});
