import { DeviceEventEmitter } from 'react-native';

const rootNode = {};
const globalNode = {};

/**
 * Default seperator, you can set to modify event name connector globally.
 */
export let defaultSeperator = '$';

/**
 * Inner key for current event type in state param object when event listener callback is emitted.
 */
export const innerEventType = '_##_inner_##_event_##_type_##_';

/**
 * Register a event listener to an event type without listening to its sub event types.
 */
export const register = _register.bind(this, false);

/**
 * Register a event listener to an event type with listening to its sub event types.
 */
export const registerWithSubEvent = _register.bind(this, true);

/**
 * Register a event listener to an event type.
 * @param {boolean} includeSubEvent When a sub event triggered, is this event callback is called.
 * @param {string|array|object} type Event type, can be a string or an array of string used seperator to join or an object with json string used.
 * @param {function} func Event callback, will be called when the event is triggered.
 * @param {string} seperator A seperator to generate event name, default is defaultSeperator.
 * @returns {object} Listener object.
 */
function _register(includeSubEvent, type, func, seperator = undefined) {
    const eventName = convertTypeToEventName(type, seperator);
    const listenerObj = DeviceEventEmitter.addListener(eventName, func);
    if (rootNode[eventName]) {
        rootNode[eventName].push(listenerObj);
    } else {
        rootNode[eventName] = [listenerObj];
    }
    if (includeSubEvent) {
        globalNode[eventName] = true;
    }
    return listenerObj;
}

/**
 * Unregister a event listener of an event type.
 * @param {string|array|object} type Event type, can be a string or an array of string used seperator to join or an object with json string used.
 * @param {object} listenerObj Listener object, if it is undefined, we will remove all event listeners of this event type.
 * @param {string} seperator A seperator to generate event name, default is defaultSeperator.
 */
export function unregister(type, listenerObj = undefined, seperator = undefined) {
    const eventName = convertTypeToEventName(type, seperator);
    if (listenerObj) {
        rootNode[eventName] = rootNode[eventName].filter(item => item !== listenerObj);
        listenerObj.remove();
        if (rootNode[eventName].length == 0) {
            delete rootNode[eventName];
        }
    } else {
        rootNode[eventName].forEach(obj => obj.remove());
        delete rootNode[eventName];
    }
    if (!rootNode[eventName] && globalNode[eventName]) {
        delete globalNode[eventName];
    }
}

/**
 * Trigger an event type with a state param.
 * @param {string|array|object} type Event type, can be a string or an array of string used seperator to join or an object with json string used.
 * @param {object} state The param passed to event callback, we will add the event type in it.
 * @param {string} seperator A seperator to generate event name, default is defaultSeperator.
 */
export function trigger(type, state = undefined, seperator = undefined) {
    const newState = Object.prototype.isPrototypeOf(state) ? {...state, [innerEventType]: type} : state;
    const eventName = convertTypeToEventName(type, seperator);
    DeviceEventEmitter.emit(eventName, newState);
    if (Array.isArray(type)) {
        const upperType = [...type];
        while (upperType.length > 0) {
            upperType.pop();
            const upperEventName = convertTypeToEventName(upperType, seperator);
            if (globalNode[upperEventName]) {
                DeviceEventEmitter.emit(upperEventName, newState);
            }
        }
    }
}

/**
 * Generate event name from an event type.
 * @param {string|array|object} type Event type, can be a string or an array of string used seperator to join or an object with json string used.
 * @param {string} seperator A seperator to generate event name, default is defaultSeperator.
 * @returns {string} Event name.
 */
function convertTypeToEventName(type, seperator) {
    if (Array.isArray(type)) {
        return type.join(seperator || defaultSeperator);
    } else if (typeof type === 'string') {
        return type;
    } else {
        return JSON.stringify(type);
    }
}