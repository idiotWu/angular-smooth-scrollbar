/**
* @module
* @export {Function} fromChildSB
* @dependencies [ getOriginalEvent ]
*/

import { getOriginalEvent } from './get_original_event';

/**
 * judge if event is from child scrollbar
 *
 * @param {Object} evt: event object
 * @param {Array} children: child scrollbar list
 *
 * @return {Boolean}
 */
export let fromChildSB = (evt, children) => {
    evt = getOriginalEvent(evt);

    if (!evt.target) return false;

    return children.some((sb) => sb.contains(evt.target));
};