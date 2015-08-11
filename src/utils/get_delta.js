/**
 * @module
 * @export {Function} getDelta
 * @dependencies [ getOriginalEvent ]
 */

import { getOriginalEvent } from './get_original_event';

const DELTA_SCALE = {
    STANDARD: -120,
    MOZ: 3
};

/**
 * Normalizing wheel delta
 *
 * In IE and Chrome, wheel delta is 120/-120 per native wheel event,
 * negative value for scrolling down
 *
 * But in firefox, wheel delta -3/3, negative value for scrolling up
 *
 * Old Opera and others? I don't care!
 *
 * @param {Object} evt: event object
 */
export let getDelta = (evt) => {
    // get original DOM event
    evt = getOriginalEvent(evt);

    if (evt.wheelDelta) {
        return {
            x: evt.wheelDeltaX / DELTA_SCALE.STANDARD,
            y: evt.wheelDeltaY / DELTA_SCALE.STANDARD
        };
    }

    return {
        x: evt.deltaX / DELTA_SCALE.MOZ,
        y: evt.deltaY / DELTA_SCALE.MOZ
    };
};
