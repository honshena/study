/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { LazyComponent, Thenable } from 'shared/ReactLazyComponent';

import { REACT_LAZY_TYPE } from 'shared/ReactSymbols';
import warning from 'shared/warning';
//作用: 懒加载组件
//  参数: ctor(function)传入一个函数,返回具有.then方法的promise
//  返回: LazyComponent懒加载组件
//todo: Thenable和LazyComponent??
export function lazy<T, R>(ctor: () => Thenable<T, R>): LazyComponent<T> {
  let lazyType = {
    $$typeof: REACT_LAZY_TYPE,
    _ctor: ctor, //lazy加载组件的方法
    // React uses these fields to store the result.
    _status: -1, //记录当前Thenable对象的状态
    _result: null, //懒加载的组件
  };

  if (__DEV__) {
    // In production, this would just set it on the object.
    let defaultProps;
    let propTypes;
    Object.defineProperties(lazyType, {
      defaultProps: {
        configurable: true,
        get() {
          return defaultProps;
        },
        set(newDefaultProps) {
          warning(
            false,
            'React.lazy(...): It is not supported to assign `defaultProps` to ' +
            'a lazy component import. Either specify them where the component ' +
            'is defined, or create a wrapping component around it.',
          );
          defaultProps = newDefaultProps;
          // Match production behavior more closely:
          Object.defineProperty(lazyType, 'defaultProps', {
            enumerable: true,
          });
        },
      },
      propTypes: {
        configurable: true,
        get() {
          return propTypes;
        },
        set(newPropTypes) {
          warning(
            false,
            'React.lazy(...): It is not supported to assign `propTypes` to ' +
            'a lazy component import. Either specify them where the component ' +
            'is defined, or create a wrapping component around it.',
          );
          propTypes = newPropTypes;
          // Match production behavior more closely:
          Object.defineProperty(lazyType, 'propTypes', {
            enumerable: true,
          });
        },
      },
    });
  }

  return lazyType;
}
