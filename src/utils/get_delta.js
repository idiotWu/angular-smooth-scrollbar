/**
 * @module
 * @export {Function} getDelta
 * @dependencies [ getOriginalEvent ]
 */

import { getOriginalEvent } from './get_original_event';

const DELTA_SCALE = {
    STANDARD: 40,
    OTHERS: -120
};

/**
 * Normalizing wheel delta
 *
 * @param {Object} evt: event object
 */
export let getDelta = (evt) => {
    // get original DOM event
    evt = getOriginalEvent(evt);

    if ('deltaX' in evt) {
        return {
            x: evt.deltaX / DELTA_SCALE.STANDARD,
            y: evt.deltaY / DELTA_SCALE.STANDARD
        };
    }

    if ('wheelDeltaX' in evt) {
        return {
            x: evt.wheelDeltaX / DELTA_SCALE.OTHERS,
            y: evt.wheelDeltaY / DELTA_SCALE.OTHERS
        };
    }

    // ie with touchpad
    return {
        x: 0,
        y: evt.wheelDelta / DELTA_SCALE.OTHERS
    };
};
