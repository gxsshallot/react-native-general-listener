# react-native-general-listener

[![编译状态](https://travis-ci.org/gaoxiaosong/react-native-general-listener.svg?branch=master)](https://travis-ci.org/gaoxiaosong/react-native-general-listener)

## 安装

使用Yarn安装:

```shell
yarn add react-native-general-listener
```

使用NPM安装:

```shell
npm install --save react-native-general-listener
```

## 使用

在文件中引入模块:

```javascript
import Listener from 'react-native-general-listener';
```

然后你可以注册、取消注册或者触发一个事件类型。

### 事件类型的数据结构

事件类型可以是一个字符串、一个字符串数组或者一个对象。

* 一个字符串: 直接用这个字符串作为事件名称, 不支持触发上级/下级事件.
* 一个字符串数组: 会使用数组中的字符串，用分隔符拼接成事件名称. 并且可以注册监听下级事件, 或者触发上级事件.
* 一个对象: 使用对象的JSON字符串表示作为事件名称. 不推荐这种用法.

### 注册

有两个注册方法:

* register
* registerWithSubEvent

这两个方法都是有三个参数:

* type: 事件类型.
* func: 事件回调函数, 当事件被触发时调用.
* seperator: 根据事件类型生成事件名称的分隔符, 默认是`defaultSeperator`. 推荐全局修改分隔符, 不推荐在这里传参数.

例子:

```javascript
this.loginListener1 = Listener.register('LoginEvent', this.loginFn);
this.loginListener2 = Listener.register(['TestApp', 'Login', userId], this.loginFn);
```

`register`方法和`registerWithSubEvent`方法的区别是: 后者是设置监听所有下级事件, 仅当事件类型是字符串数组时生效.

方法返回值是一个句柄对象, 用于`unregister`中取消注册.

### 取消注册

支持取消一个事件类型下的一个或所有事件监听.

`unregister`方法有三个参数:

* type: 事件类型.
* listenerObj: 监听句柄, 是`register`或`registerWithSubEvent`方法的返回值. 如果是`undefined`, 将移除该事件类型的所有监听.
* seperator: 根据事件类型生成事件名称的分隔符, 默认是`defaultSeperator`. 推荐全局修改分隔符, 不推荐在这里传参数.

例子:

```javascript
Listener.unregister('LoginEvent', this.loginListener1);
Listener.unregister('LoginEvent');
Listener.unregister(['TestApp', 'Login', userId], this.loginListener);
Listener.unregister(['TestApp', 'Login', userId]);
```

### 触发

可以使用事件类型和事件参数触发事件。

`trigger`方法有三个参数:

* type: 事件类型.
* state: 事件参数. 可以是一个对象、一个数字、一个布尔值或其他类型数值.
* seperator: 根据事件类型生成事件名称的分隔符, 默认是`defaultSeperator`. 推荐全局修改分隔符, 不推荐在这里传参数.

当使用一个字符串数组`[str0, str1, ... strn]`的事件类型触发事件时, 会对其上级事件类型进行查找, 来看上级事件是否使用`registerWithSubEvent`方法注册监听:

```javascript
const upperType = [str0, str1, ..., strn];
while ( /* upperType非空 */ ) {
    // 将upperType转为upperName
    if ( /* upperName是使用registerWithSubEvent注册的 */ ) {
        // 触发上级事件回调
    }
    // 弹出upperType最后一个元素
}
```

### 全局常量

在模块中，有两个常量:

* defaultSeperator: 默认分隔符, 在使用事件类型生成事件名称的时候作为连接符. 默认是`'$'`。
* innerEventType: 内部事件类型存储键, 当事件被触发且事件参数是对象时, 事件类型会被设置到事件参数中. 这个键的值是`'_##_inner_##_event_##_type_##_'`, 可以避免跟事件参数中的键重复.

你可以全局修改`defaultSeperator`:

```javascript
Listener.defaultSeperator = '#';
```