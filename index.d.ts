import { EmitterSubscription } from 'react-native';

export type EventType = string | string[] | {[key: string]: any};
export type FunctionType = (data: any) => void;
export type ListenerObjType = EmitterSubscription;

declare var Listener: {
    defaultSeperator: string;
    innerEventType: string;
    register: (type: EventType, func: FunctionType) => ListenerObjType;
    registerWithSubEvent: (type: EventType, func: FunctionType) => ListenerObjType;
    unregister: (type: EventType, listenerObj?: ListenerObjType) => void;
    trigger: (type: EventType, state?: any) => void;
};

export default Listener;