import { DeviceEventEmitter } from 'react-native';

const rootNode = {};

export let defaultSeperator = '$';

export let innerEventType = '_##_inner_##_event_##_type_##_';

export function register(type, func) {
    return registerEvent(normalEventName(type), func);
}

export function registerWithSubEvent(type, func) {
    return registerEvent(recursiveEventName(type), func);
}

function registerEvent(eventName, func) {
    const listenerObj = DeviceEventEmitter.addListener(eventName, func);
    if (rootNode[eventName]) {
        rootNode[eventName].push(listenerObj);
    } else {
        rootNode[eventName] = [listenerObj];
    }
    return listenerObj;
}

export function unregister(type, listenerObj = undefined) {
    const eventName = normalEventName(type);
    const rEventName = recursiveEventName(type);
    if (listenerObj) {
        if (rootNode[eventName]) {
            rootNode[eventName] = rootNode[eventName].filter(item => item !== listenerObj);
            if (rootNode[eventName].length == 0) {
                delete rootNode[eventName];
            }
        }
        if (rootNode[rEventName]) {
            rootNode[rEventName] = rootNode[rEventName].filter(item => item !== listenerObj);
            if (rootNode[rEventName].length == 0) {
                delete rootNode[rEventName];
            }
        }
        listenerObj.remove();
    } else {
        if (rootNode[eventName]) {
            rootNode[eventName].forEach(obj => obj.remove());
            delete rootNode[eventName];
        }
        if (rootNode[rEventName]) {
            rootNode[rEventName].forEach(obj => obj.remove());
            delete rootNode[rEventName];
        }
    }
}

export function trigger(type, state = undefined) {
    const newState = Object.prototype.isPrototypeOf(state) ? {...state, [innerEventType]: type} : state;
    const eventName = normalEventName(type);
    DeviceEventEmitter.emit(eventName, newState);
    const upperType = Array.isArray(type) ? [...type] : [type];
    while (upperType.length > 0) {
        const upperEventName = recursiveEventName(upperType);
        if (rootNode[upperEventName]) {
            DeviceEventEmitter.emit(upperEventName, newState);
        }
        upperType.pop();
    }
}

function recursiveEventName(type) {
    const globalHeader = ['&#@!$%%$!@#&', '1234567890987654321'];
    const types = Array.isArray(type) ? type : [type];
    return [...globalHeader, ...types].join(defaultSeperator);
}

function normalEventName(type) {
    if (Array.isArray(type)) {
        return type.join(defaultSeperator);
    } else if (typeof type === 'string') {
        return type;
    } else {
        return JSON.stringify(type);
    }
}