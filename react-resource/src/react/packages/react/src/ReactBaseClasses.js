/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import invariant from 'shared/invariant';
import lowPriorityWarning from 'shared/lowPriorityWarning';

import ReactNoopUpdateQueue from './ReactNoopUpdateQueue';

//用于初始化refs引用: 空对象
const emptyObject = {};
if (__DEV__) {
  Object.freeze(emptyObject);
}

/**
 * Base class helpers for the updating state of a component.
 */
//React.Component React的基础组件和普通对象的区别就在于有一个属性isReactComponent
//
function Component(props, context, updater) {
  //组件的props
  this.props = props;
  //组件的context
  this.context = context;
  // If a component has string refs, we will assign a different object later.
  //如果使用string类型的ref需要在后面进行特殊处理
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  //
  this.updater = updater || ReactNoopUpdateQueue;
}
//todo: Component.xxx和Component.prototype.xxx区别?
//function.prototype.xxx 是在构造函数的原型对象上添加属性。到时候function可以当做构造函数，然后产生的实例也可以访问到这个xxx
Component.prototype.isReactComponent = {};

/**
 * Sets a subset of the state. Always use this to mutate
 * state. You should treat `this.state` as immutable.
 *
 * There is no guarantee that `this.state` will be immediately updated, so
 * accessing `this.state` after calling this method may return the old value.
 *
 * There is no guarantee that calls to `setState` will run synchronously,
 * as they may eventually be batched together.  You can provide an optional
 * callback that will be executed when the call to setState is actually
 * completed.
 *
 * When a function is provided to setState, it will be called at some point in
 * the future (not synchronously). It will be called with the up to date
 * component arguments (state, props, context). These values can be different
 * from this.* because your function may be called after receiveProps but before
 * shouldComponentUpdate, and this new state, props, and context will not yet be
 * assigned to this.
 *
 * @param {object|function} partialState Next partial state or function to
 *        produce next partial state to be merged with current state.
 * @param {?function} callback Called after state is updated.
 * @final
 * @protected
 */
//作用: 组件更新state的方法,异步更新
//参数:
//  partialState: 新的状态对象或是方法
//  callback:更新完成后的回调函数
Component.prototype.setState = function(partialState, callback) {
  //如果传入的partialState不是对象或者方法或者null则提醒开发者'setState(...):......'
  // invariant不满足参数1时警告
  invariant(
    typeof partialState === 'object' ||
      typeof partialState === 'function' ||
      partialState == null,
    'setState(...): takes an object of state variables to update or a ' +
      'function which returns an object of state variables.',
  );
  //将更新state放入更新队列
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};

/**
 * Forces an update. This should only be invoked when it is known with
 * certainty that we are **not** in a DOM transaction.
 *
 * You may want to call this when you know that some deeper aspect of the
 * component's state has changed but `setState` was not called.
 *
 * This will not invoke `shouldComponentUpdate`, but it will invoke
 * `componentWillUpdate` and `componentDidUpdate`.
 *
 * @param {?function} callback Called after update is complete.
 * @final
 * @protected
 */
//强制更新
Component.prototype.forceUpdate = function(callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
};

/**
 * Deprecated APIs. These APIs used to exist on classic React classes but since
 * we would like to deprecate them, we're not going to move them over to this
 * modern base class. Instead, we define a getter that warns if it's accessed.
 */
//当开发者使用废弃的api给出警告
if (__DEV__) {
  //废弃的api列表
  const deprecatedAPIs = {
    isMounted: [
      'isMounted',
      'Instead, make sure to clean up subscriptions and pending requests in ' +
        'componentWillUnmount to prevent memory leaks.',
    ],
    replaceState: [
      'replaceState',
      'Refactor your code to use setState instead (see ' +
        'https://github.com/facebook/react/issues/3236).',
    ],
  };
  //将废弃的api挂载到Component的原型上,并当开发者调用时给出警告
  const defineDeprecationWarning = function(methodName, info) {
    Object.defineProperty(Component.prototype, methodName, {
      get: function() {
        lowPriorityWarning(
          false,
          '%s(...) is deprecated in plain JavaScript React classes. %s',
          info[0],
          info[1],
        );
        return undefined;
      },
    });
  };
  for (const fnName in deprecatedAPIs) {
    if (deprecatedAPIs.hasOwnProperty(fnName)) {
      defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
    }
  }
}

function ComponentDummy() {}
ComponentDummy.prototype = Component.prototype;

/**
 * Convenience component with default shallow equality check for sCU.
 */
// PureComponent和一般组件的区别在于原型链上挂了isPureReactComponent
function PureComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  // If a component has string refs, we will assign a different object later.
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}
//note: js继承
//文档: https://juejin.cn/post/6844904161071333384
// https://juejin.cn/post/6844903837623386126
//实现继承让PureComponent继承Component
const pureComponentPrototype = (PureComponent.prototype = new ComponentDummy());
//将子类的constructor指向自己
pureComponentPrototype.constructor = PureComponent;
// Avoid an extra prototype jump for these methods.
//将Component的方法拷贝到ComponentDummy上,可以避免原型上查找两次
//将Component.prototype的属性拷贝到PureComponent.prototype
Object.assign(pureComponentPrototype, Component.prototype);
//添加pureComponent的标识
pureComponentPrototype.isPureReactComponent = true;

export {Component, PureComponent};
