import { DeviceEventEmitter } from 'react-native';

const rootNode = {};

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
export function register(type, func, seperator = undefined) {
    const eventName = normalEventName(type, seperator);
    const listenerObj = DeviceEventEmitter.addListener(eventName, func);
    if (rootNode[eventName]) {
        rootNode[eventName].push(listenerObj);
    } else {
        rootNode[eventName] = [listenerObj];
    }
    return listenerObj;
}

/**
 * Register a event listener to an event type with listening to its sub event types.
 */
export function registerWithSubEvent(type, func, seperator = undefined) {
    const eventName = recursiveEventName(type, seperator);
    const listenerObj = DeviceEventEmitter.addListener(eventName, func);
    if (rootNode[eventName]) {
        rootNode[eventName].push(listenerObj);
    } else {
        rootNode[eventName] = [listenerObj];
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
    const eventName = normalEventName(type, seperator);
    const rEventName = recursiveEventName(type, seperator);
    if (listenerObj) {
        rootNode[eventName] = (rootNode[eventName] || []).filter(item => item !== listenerObj);
        rootNode[rEventName] = (rootNode[rEventName] || []).filter(item => item !== listenerObj);
        listenerObj.remove();
        if (rootNode[eventName] && rootNode[eventName].length == 0) {
            delete rootNode[eventName];
        }
        if (rootNode[rEventName] && rootNode[rEventName].length == 0) {
            delete rootNode[rEventName];
        }
    } else {
        rootNode[eventName].forEach(obj => obj.remove());
        rootNode[rEventName].forEach(obj => obj.remove());
        delete rootNode[eventName];
        delete rootNode[rEventName];
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
    const eventName = normalEventName(type, seperator);
    DeviceEventEmitter.emit(eventName, newState);
    if (Array.isArray(type)) {
        const upperType = [...type];
        while (upperType.length > 0) {
            const upperEventName = recursiveEventName(upperType, seperator);
            if (rootNode[upperEventName]) {
                DeviceEventEmitter.emit(upperEventName, newState);
            }
            upperType.pop();
        }
    }
}

/**
 * Generate recursive event name from an event type.
 * @param {string|array|object} type Event type, can be a string or an array of string used seperator to join or an object with json string used.
 * @param {string} seperator A seperator to generate event name, default is defaultSeperator.
 * @returns {string} Event name.
 */
function recursiveEventName(type, seperator) {
    const globalHeader = '&#@!$%%$!@#&' + defaultSeperator + '1234567890987654321';
    if (Array.isArray(type)) {
        return globalHeader + type.join(seperator || defaultSeperator);
    } else if (typeof type === 'string') {
        return globalHeader + type;
    } else {
        return globalHeader + JSON.stringify(type);
    }
}

/**
 * Generate normal event name from an event type.
 * @param {string|array|object} type Event type, can be a string or an array of string used seperator to join or an object with json string used.
 * @param {string} seperator A seperator to generate event name, default is defaultSeperator.
 * @returns {string} Event name.
 */
function normalEventName(type, seperator) {
    if (Array.isArray(type)) {
        return type.join(seperator || defaultSeperator);
    } else if (typeof type === 'string') {
        return type;
    } else {
        return JSON.stringify(type);
    }
}