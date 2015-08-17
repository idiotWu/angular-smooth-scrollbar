/**
 * @module
 * @prototype {Function} __keyboardHandler
 * @dependencies [ SmoothScrollbar, #scrollTo, getOriginalEvent, pickInRange ]
 */

import '../apis/scroll_to';
import { getOriginalEvent, pickInRange } from '../utils/index';
import { SmoothScrollbar } from '../smooth_scrollbar';

export { SmoothScrollbar };

// key maps [deltaX, deltaY]
const KEYMAPS = {
    37: [-1, 0], // left
    38: [0, -1], // up
    39: [1, 0], // right
    40: [0, 1] // down
};

/**
 * @method
 * @internal
 * Keypress event handler builder
 *
 * @param {Object} option
 *
 * @return {Function}: event handler
 */
let __keyboardHandler = function({ speed, stepLength }) {
    let isFocused;
    let { container } = this.target;

    container.addEventListener('mousedown', (evt) => {
        evt.stopPropagation();
        isFocused = true;
    });
    document.addEventListener('mousedown', () => isFocused = false);

    return (evt) => {
        if (!isFocused) return;

        evt = getOriginalEvent(evt);

        let keyCode = evt.keyCode || evt.which;

        if (!KEYMAPS.hasOwnProperty(keyCode)) return;

        let { offset, limit } = this;
        let [x, y] = KEYMAPS[keyCode];

        let destX = pickInRange(x * speed * stepLength + offset.x, 0, limit.x);
        let destY = pickInRange(y * speed * stepLength + offset.y, 0, limit.y);

        // if has scrolled to edge
        if (Math.abs(destX - offset.x) < 1 && Math.abs(destY - offset.y) < 1) {
            return this.__updateThrottle();
        }

        evt.preventDefault();
        evt.stopPropagation();

        this.scrollTo(destX, destY, 600 / speed);
    };
};

Object.defineProperty(SmoothScrollbar.prototype, '__keyboardHandler', {
    value: __keyboardHandler,
    writable: true,
    configurable: true
});
