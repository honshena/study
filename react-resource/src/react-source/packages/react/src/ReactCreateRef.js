/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @flow
 */

import type { RefObject } from 'shared/ReactTypes';

// an immutable object with a single mutable value
//react中有三种ref使用方式
//  1. string ref='xxxx' string类型的ref将通过this.refs['xxx']方法,xxx将作为this.refs的属性
//  2. 方法 ref={e=>{this.xxx=e}} ref属性传入方法参数为该dom元素本身,可以在此处赋值给其他变量
//  3. React.createRef 变量需要先调用api xxx=React.createRef()然后,ref={this.xxx}进行绑定
//作用: 创建ref引用
//返回: {current: null}

export function createRef(): RefObject {
  const refObject = {
    current: null,
  };
  //note: Object.seal 密封一个对象会阻止其扩展并且使得现有属性不可配置。
  //作用: 可以更改refObject.current的值,但是不能添加其他属性和修改
  //文档: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/seal
  if (__DEV__) {
    Object.seal(refObject);
  }
  //返回{current: null}
  return refObject;
}
