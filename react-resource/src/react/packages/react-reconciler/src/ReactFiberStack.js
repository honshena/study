/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type {Fiber} from './ReactFiber';

import warningWithoutStack from 'shared/warningWithoutStack';

export type StackCursor<T> = {
  current: T,
};
// Stack
const valueStack: Array<any> = [];

let fiberStack: Array<Fiber | null>;

if (__DEV__) {
  fiberStack = [];
}

let index = -1;

function createCursor<T>(defaultValue: T): StackCursor<T> {
  return {
    current: defaultValue,
  };
}

function isEmpty(): boolean {
  return index === -1;
}

// 完成节点更新时出栈
function pop<T>(cursor: StackCursor<T>, fiber: Fiber): void {
  if (index < 0) {
    if (__DEV__) {
      warningWithoutStack(false, 'Unexpected pop.');
    }
    return;
  }

  if (__DEV__) {
    if (fiber !== fiberStack[index]) {
      warningWithoutStack(false, 'Unexpected Fiber popped.');
    }
  }
  // 出栈时将之前的值赋值给cursor
  cursor.current = valueStack[index];

  valueStack[index] = null;

  if (__DEV__) {
    fiberStack[index] = null;
  }

  index--;
}
// 节点更新时相关信息入栈
function push<T>(cursor: StackCursor<T>, value: T, fiber: Fiber): void {
  index++;

  // 入栈时将之前的值存入栈中,栈顶是之前的值
  valueStack[index] = cursor.current;

  if (__DEV__) {
    fiberStack[index] = fiber;
  }

  cursor.current = value;
}

function checkThatStackIsEmpty() {
  if (__DEV__) {
    if (index !== -1) {
      warningWithoutStack(
        false,
        'Expected an empty stack. Something was not reset properly.',
      );
    }
  }
}

function resetStackAfterFatalErrorInDev() {
  if (__DEV__) {
    index = -1;
    valueStack.length = 0;
    fiberStack.length = 0;
  }
}

export {
  createCursor,
  isEmpty,
  pop,
  push,
  // DEV only:
  checkThatStackIsEmpty,
  resetStackAfterFatalErrorInDev,
};
