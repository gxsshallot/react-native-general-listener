# react-native-general-listener

[![Build Status](https://travis-ci.org/gaoxiaosong/react-native-general-listener.svg?branch=master)](https://travis-ci.org/gaoxiaosong/react-native-general-listener)

[Chinese README](/README-zh_CN.md)

## Install

Install by Yarn:

```shell
yarn add react-native-general-listener
```

Install by NPM:

```shell
npm install --save react-native-general-listener
```

## Usage

Import the module in file:

```javascript
import Listener from 'react-native-general-listener';
```

Then you can register, unregister or trigger an event type.

### Event Type Structure

An event type can be a string, an array of string, or an object.

* a string: Use the string as event name directly, it is not supported to trigger parent or child event.
* an array of string: We will use seperator to connect these strings to generate event name. And you can register with listen to its child event, or trigger its parent event.
* an object: Use the json string of object as event name. We do not recommend this usage.

### Register

We have two register function:

* register
* registerWithSubEvent

They both have three parameters:

* type: Event type.
* func: Event callback, will be called when the event is triggered.
* seperator: A seperator for event type to generate event name, default is `defaultSeperator`. We recommend to modify seperator globally, not specially.

Example:

```javascript
this.loginListener1 = Listener.register('LoginEvent', this.loginFn);
this.loginListener2 = Listener.register(['TestApp', 'Login', userId], this.loginFn);
```

The only difference between `register` and `registerWithSubEvent` is: the second one register event type with all child event types, is only valid when an array style event type.

The function will return an object to used when `unregister` event type.

### Unregister

You can unregister one event listener or all of an event type.

The function `unregister` has three parameters:

* type: Event type.
* listenerObj: Listener object which is the returned value of `register` or `registerWithSubEvent`. If it is `undefined`, we will remove all event listeners of the event type.
* seperator: A seperator for event type to generate event name, default is `defaultSeperator`. We recommend to modify seperator globally, not specially.

Example:

```javascript
Listener.unregister('LoginEvent', this.loginListener1);
Listener.unregister('LoginEvent');
Listener.unregister(['TestApp', 'Login', userId], this.loginListener);
Listener.unregister(['TestApp', 'Login', userId]);
```

### Trigger

You can trigger event with an event type and an event param.

The function `trigger` has three parameters:

* type: Event type.
* state: Event param. It can be an object, a number, a boolean or any other data type.
* seperator: A seperator for event type to generate event name, default is `defaultSeperator`. We recommend to modify seperator globally, not specially.

When trigger an event with an array of string event type `[str0, str1, ... strn]`, we will find its parent event types to see if they use `registerWithSubEvent` function:

```javascript
const upperType = [str0, str1, ..., strn];
while ( /* upperType is not empty */ ) {
    // Convert upperType to upperName
    if ( /* upperName is registered with registerWithSubEvent function */ ) {
        // Trigger upper event with state
    }
    // Pop the last element of upperType
}
```

### Global Constant

There are two constant in the module:

* defaultSeperator: Default seperator, used as connector of event type to generate event name. Default is `'$'`。
* innerEventType: Inner event type key, when event is triggered, the event type will be set into event param if event param is an object. This key is `'_##_inner_##_event_##_type_##_'` to avoid key duplication in event param.

You can modify the `defaultSeperator` globally:

```javascript
Listener.defaultSeperator = '#';
```