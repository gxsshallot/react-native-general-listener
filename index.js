import { DeviceEventEmitter } from 'react-native';

const rootNode = {};

export function register(type, func, seperator = '-') {
    const eventName = convertTypeToEventName(type, seperator);
    const listenerObj = DeviceEventEmitter.addListener(eventName, func);
    if (rootNode[eventName]) {
        rootNode[eventName].push(listenerObj);
    } else {
        rootNode[eventName] = [listenerObj];
    }
    return listenerObj;
}

export function unregister(type, listenerObj = undefined, seperator = '-') {
    const eventName = convertTypeToEventName(type, seperator);
    if (listenerObj) {
        rootNode[eventName] = rootNode[eventName].filter(item => item !== listenerObj);
        listenerObj.remove();
    } else {
        rootNode[eventName].forEach(obj => obj.remove());
        delete rootNode[eventName];
    }
}

export function trigger(type, state, seperator = '-') {
    const eventName = convertTypeToEventName(type, seperator);
    DeviceEventEmitter.emit(eventName, state);
}

function convertTypeToEventName(type, seperator) {
    if (Array.isArray(type)) {
        return type.join(seperator);
    } else if (typeof type === 'string') {
        return type;
    } else {
        return JSON.stringify(type);
    }
}