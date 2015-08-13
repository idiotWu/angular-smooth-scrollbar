/**
 * @module
 * @export {Class} SmoothScrollbar
 * @dependencies [ DEFAULT_OPTIONS, motionBuilder, throttle, findChild ]
 */

import { motionBuilder, throttle, findChild } from './utils/index';
import { DEFAULT_OPTIONS } from './options';

/**
 * @constructor
 * Create scrollbar instance
 *
 * @param {jQuery} $elem: jQuery wrapped element
 * @param {Object} options: options, include four propertier:
 *          {Number} [speed]: scrolling speed, default is 1
 *          {Number} [stepLength]: scroll length per delta/keydown, default is 50
 *          {Number} [easingDuration]: swipe easing duration, default is 1000(ms)
 *          {String} [easingCurve]: easing timing function, defalut is easeOutQuad
 */
export class SmoothScrollbar {
    constructor($elem, { speed, stepLength, easingDuration, easingCurve }) {
        let $ = angular.element;
        let element = $elem[0];

        let $trackX = $(findChild(element, 'scrollbar-track-x'));
        let trackY = $(findChild(element, 'scrollbar-track-y'));

        Object.defineProperties(this, {
            $target: {
                value: {
                    container: $elem,
                    content: $(findChild(element, 'scroll-content')),
                    xAxis: {
                        track: $trackX,
                        thumb: $(findChild($trackX[0], 'scrollbar-thumb-x'))
                    },
                    yAxis: {
                        track: trackY,
                        thumb: $(findChild(trackY[0], 'scrollbar-thumb-y'))
                    }
                }
            },
            offset: {
                value: {
                    x: 0,
                    y: 0
                },
                writable: true
            },
            __listeners: {
                value: [],
                writable: true
            },
            __motionBuilder: {
                value: motionBuilder(easingCurve)
            },
            __updateThrottle: {
                value: throttle(::this.update)
            },
            __scrollAnimation: {
                writable: true
            },
            __lastScrollTime: {
                writable: true
            },
            __resetScrollTime: {
               value: throttle(() => { this.__lastScrollTime = undefined; })
            }
        });

        this.__initScrollbar({
            speed: parseFloat(speed) || DEFAULT_OPTIONS.SPEED,
            stepLength: parseFloat(stepLength) || DEFAULT_OPTIONS.STEP_LENGTH,
            easingDuration: parseFloat(easingDuration) || DEFAULT_OPTIONS.EASING_DURATION
        });

        let hideTrackDelay;

        this.showTrack = (direction = 'both') => {
            clearTimeout(hideTrackDelay);
            direction = direction.toLowerCase();

            if (direction === 'both') {
                $trackX.addClass('show');
                trackY.addClass('show');
            }

            if (direction === 'x') {
                $trackX.addClass('show');
            }

            if (direction === 'y') {
                trackY.addClass('show');
            }
        };
        this.hideTrack = () => {
            hideTrackDelay = setTimeout(() => {
                $trackX.removeClass('show');
                trackY.removeClass('show');
            }, 1e3);
        };
    }
}