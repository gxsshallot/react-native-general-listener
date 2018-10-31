type EventType = string | string[] | {};
type FunctionType = (params: {}) => void;
type ListenerObjType = {};

interface ListenerObject {
    defaultSeperator: string;
    innerEventType: string;
    register: (type: EventType, func: FunctionType) => ListenerObjType;
    registerWithSubEvent: (type: EventType, func: FunctionType) => ListenerObjType;
    unregister: (type: EventType, listenerObj?: ListenerObjType) => void;
    trigger: (type: EventType, state?: {}) => void;
}

export default const Listener: ListenerObject;