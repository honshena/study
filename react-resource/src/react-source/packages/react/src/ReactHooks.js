/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { ReactContext } from 'shared/ReactTypes';
import invariant from 'shared/invariant';
import warning from 'shared/warning';

import ReactCurrentDispatcher from './ReactCurrentDispatcher';
//获取当前的dispatcher实例
//确保在hooks在函数组件的主体内部调用。如果不在函数组件内部调用，会抛出错误。
function resolveDispatcher() {
  //ReactCurrentDispatcher.current是Dispatcher
  const dispatcher = ReactCurrentDispatcher.current;
  //确保在函数组件的主体内部调用。如果不在函数组件内部调用，会抛出错误。
  invariant(
    dispatcher !== null,
    'Hooks can only be called inside the body of a function component. ' +
    '(https://fb.me/react-invalid-hook-call)',
  );
  return dispatcher;
}
//获取context对象的值,在开发模式下，它发出警告，提醒不要传递第二个参数，并且不支持在循环中调用useContext。
//  参数: Context(react context对象) unstable_observedBits:
//  
export function useContext<T>(
  Context: ReactContext<T>,
  unstable_observedBits: number | boolean | void,
) {
  const dispatcher = resolveDispatcher();
  if (__DEV__) {
    warning(
      unstable_observedBits === undefined,
      'useContext() second argument is reserved for future ' +
      'use in React. Passing it is not supported. ' +
      'You passed: %s.%s',
      unstable_observedBits,
      typeof unstable_observedBits === 'number' && Array.isArray(arguments[2])
        ? '\n\nDid you call array.map(useContext)? ' +
        'Calling Hooks inside a loop is not supported. ' +
        'Learn more at https://fb.me/rules-of-hooks'
        : '',
    );

    // TODO: add a more generic warning for invalid values.
    if ((Context: any)._context !== undefined) {
      const realContext = (Context: any)._context;
      // Don't deduplicate because this legitimately causes bugs
      // and nobody should be using this in existing code.
      if (realContext.Consumer === Context) {
        warning(
          false,
          'Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be ' +
          'removed in a future major release. Did you mean to call useContext(Context) instead?',
        );
      } else if (realContext.Provider === Context) {
        warning(
          false,
          'Calling useContext(Context.Provider) is not supported. ' +
          'Did you mean to call useContext(Context) instead?',
        );
      }
    }
  }
  return dispatcher.useContext(Context, unstable_observedBits);
}
//hooks: useState
// 参数: initialState初始值可以是任意类型或返回任意类型的函数
//  如果 initialState 是一个函数，它将在组件渲染时被调用，并返回一个状态值 S。
//  如果 initialState 是一个状态值，它将被用作初始状态值。
//useState 函数返回一个数组，包含两个元素。
//  第一个元素是一个状态变量，可以被用于读取和更新状态值。
//  第二个元素是一个更新状态的函数，用于更新状态值并触发组件重新渲染。
export function useState<S>(initialState: (() => S) | S) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}
//它使用了一个名为useReducer的函数来实现状态管理。
//它接受三个参数：一个 reducer 函数，一个初始参数和一个可选的初始化函数。
//它返回一个使用状态管理器函数的结果。
export function useReducer<S, I, A>(
  reducer: (S, A) => S,
  initialArg: I,
  init?: I => S,
) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useReducer(reducer, initialArg, init);
}
//该函数接受一个初始值，并返回一个包含current属性的对象，该属性的值为指定的初始值。。
export function useRef<T>(initialValue: T): { current: T } {
  const dispatcher = resolveDispatcher();
  return dispatcher.useRef(initialValue);
}
//该函数是一个在React组件中使用的副作用钩子函数
//它将一个函数或无输入参数传递给它，并返回一个效果函数，可以用于在组件卸载时执行清理操作。
export function useEffect(
  create: () => (() => void) | void,
  inputs: Array<mixed> | void | null,
) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useEffect(create, inputs);
}

export function useLayoutEffect(
  create: () => (() => void) | void,
  inputs: Array<mixed> | void | null,
) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useLayoutEffect(create, inputs);
}
//接受一个回调函数和一组监听值改变
//返回一个用于React组件的回调函数。
export function useCallback(
  callback: () => mixed,
  inputs: Array<mixed> | void | null,
) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useCallback(callback, inputs);
}
//参数: 一个创建函数和一组输入值
//返回: 一个React组件的内存对象
export function useMemo(
  create: () => mixed,
  inputs: Array<mixed> | void | null,
) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useMemo(create, inputs);
}
//用于处理React Hooks中的自定义refs。
//它接受三个参数：ref对象或函数，创建实例的函数，和输入参数数组。
export function useImperativeHandle<T>(
  ref: { current: T | null } | ((inst: T | null) => mixed) | null | void,
  create: () => T,
  inputs: Array<mixed> | void | null,
): void {
  const dispatcher = resolveDispatcher();
  return dispatcher.useImperativeHandle(ref, create, inputs);
}

export function useDebugValue(value: any, formatterFn: ?(value: any) => any) {
  if (__DEV__) {
    const dispatcher = resolveDispatcher();
    return dispatcher.useDebugValue(value, formatterFn);
  }
}
