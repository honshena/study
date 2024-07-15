/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
//Thenable类型是一个对象,具有then方法,then方法参数有resolve和reject
//返回一个R类型的值
export type Thenable<T, R> = {
  //type mixed = any
  then(resolve: (T) => mixed, reject: (mixed) => mixed): R,
};
//LazyComponent是一个对象
//_ctor是Thenable对象
export type LazyComponent<T> = {
  $$typeof: Symbol | number,
  _ctor: () => Thenable<{ default: T }, mixed>,
  _status: 0 | 1 | 2,
  _result: any,
};

type ResolvedLazyComponent<T> = {
  $$typeof: Symbol | number,
  _ctor: () => Thenable<{ default: T }, mixed>,
  _status: 1,
  _result: any,
};

export const Pending = 0;
export const Resolved = 1;
export const Rejected = 2;

export function refineResolvedLazyComponent<T>(
  lazyComponent: LazyComponent<T>,
): ResolvedLazyComponent<T> | null {
  return lazyComponent._status === Resolved ? lazyComponent._result : null;
}
