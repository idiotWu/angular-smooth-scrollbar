/**
 * @module
 * @export {Class} SmoothScrollbar
 * @dependencies [ DEFAULT_OPTIONS, motionBuilder, debounce, findChild ]
 */

import { motionBuilder, debounce, findChild, setStyle } from './utils/index';
import { DEFAULT_OPTIONS } from './options';

let sbList = [];
let updateChild = () => {
    sbList.forEach((sb) => sb.__updateChildren());
};

/**
 * @constructor
 * Create scrollbar instance
 *
 * @param {Element} elem: target element
 * @param {Object} options: options, include four propertier:
 *          {Number} [speed]: scrolling speed, default is 1
 *          {Number} [stepLength]: scroll length per delta/keydown, default is 50
 *          {Number} [easingDuration]: swipe easing duration, default is 1000(ms)
 *          {String} [easingCurve]: easing timing function, defalut is cubic-bezier(0.1, 0.57, 0.1, 1)
 */
export class SmoothScrollbar {
    constructor(elem, { speed, stepLength, easingDuration, easingCurve }) {
        elem.setAttribute('tabindex', '1');
        setStyle(elem, { outline: 'none' });

        let trackX = findChild(elem, 'scrollbar-track-x');
        let trackY = findChild(elem, 'scrollbar-track-y');

        Object.defineProperties(this, {
            __target: {
                value: {
                    container: elem,
                    content: findChild(elem, 'scroll-content'),
                    xAxis: {
                        track: trackX,
                        thumb: findChild(trackX, 'scrollbar-thumb-x')
                    },
                    yAxis: {
                        track: trackY,
                        thumb: findChild(trackY, 'scrollbar-thumb-y')
                    }
                }
            },
            __listeners: {
                value: [],
                writable: true
            },
            __handlers: {
                value: [],
                writable: true
            },
            __motionBuilder: {
                value: motionBuilder(easingCurve)
            },
            __updateThrottle: {
                value: debounce(::this.update)
            },
            __scrollAnimation: {
                writable: true
            }
        });

        this.offset = {
            x: 0,
            y: 0
        };

        this.limit = {
            x: Infinity,
            y: Infinity
        };

        this.size = this.getSize();

        this.showTrack = (direction = 'both') => {
            direction = direction.toLowerCase();
            elem.classList.add('scrolling');

            if (direction === 'both') {
                trackX.classList.add('show');
                trackY.classList.add('show');
            }

            if (direction === 'x') {
                trackX.classList.add('show');
            }

            if (direction === 'y') {
                trackY.classList.add('show');
            }
        };

        this.hideTrack = debounce(() => {
            elem.classList.remove('scrolling');
            trackX.classList.remove('show');
            trackY.classList.remove('show');
        }, 300, false);

        this.__initScrollbar({
            speed: parseFloat(speed) || DEFAULT_OPTIONS.SPEED,
            stepLength: parseFloat(stepLength) || DEFAULT_OPTIONS.STEP_LENGTH,
            easingDuration: parseFloat(easingDuration) || DEFAULT_OPTIONS.EASING_DURATION
        });

        sbList.push(this);
        updateChild();
    }
}