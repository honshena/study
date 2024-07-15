/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {REACT_FORWARD_REF_TYPE, REACT_MEMO_TYPE} from 'shared/ReactSymbols';

import warningWithoutStack from 'shared/warningWithoutStack';

//转发ref引用
//返回: 一个forwardRef对象
//参数:
//  render: 函数组件(props,ref)=>{return <></>}
export default function forwardRef<Props, ElementType: React$ElementType>(
  render: (props: Props, ref: React$Ref<ElementType>) => React$Node,
) {
  //如果开发者传入memo包裹的函数组件则报错并提醒开发者使用memo(forwardRef(...))
  //如果开发者传入的不是组件则报错
  //如果传入的组件有defaultProps或propTypes属性则报错,判断传的是类组件就报错
  //如果传入的参数是1个则报错
  if (__DEV__) {
    if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
      warningWithoutStack(
        false,
        'forwardRef requires a render function but received a `memo` ' +
          'component. Instead of forwardRef(memo(...)), use ' +
          'memo(forwardRef(...)).',
      );
    } else if (typeof render !== 'function') {
      warningWithoutStack(
        false,
        'forwardRef requires a render function but was given %s.',
        render === null ? 'null' : typeof render,
      );
    } else {
      warningWithoutStack(
        // Do not warn for 0 arguments because it could be due to usage of the 'arguments' object
        render.length === 0 || render.length === 2,
        'forwardRef render functions accept exactly two parameters: props and ref. %s',
        render.length === 1
          ? 'Did you forget to use the ref parameter?'
          : 'Any additional parameter will be undefined.',
      );
    }

    if (render != null) {
      warningWithoutStack(
        render.defaultProps == null && render.propTypes == null,
        'forwardRef render functions do not support propTypes or defaultProps. ' +
          'Did you accidentally pass a React component?',
      );
    }
  }

  //返回一个forwardRef对象
  return {
    $$typeof: REACT_FORWARD_REF_TYPE,
    render, //函数组件(props,ref)=>{组件}
  };
}
