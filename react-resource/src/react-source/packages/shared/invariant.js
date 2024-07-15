/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */
/**
 * 作用:该模块用于提供一个断言函数 invariant(),用于帮助你的程序断言某些应该为 true 的状态条件。
 * 使用方式和 sprintf 类似，只是通配符只支持 %s，如果断言条件不为true，则会抛出一个 Error。 
 */
let validateFormat = () => { };

if (__DEV__) {
  validateFormat = function (format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

/**
 * 判断断言条件表达式是否为true，如果不为true,则抛出 Error
 * @param condition 断言条件表达式
 * @param format 断言条件不为真时抛出的错误的消息的模版，可以包含通配符%s
 * @param a...f 用于组织错误消息的参数
 */
export default function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    let error;
    if (format === undefined) {
      //Error是一个错误对象有name,message等属性
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.',
      );
    } else {
      const args = [a, b, c, d, e, f];
      let argIndex = 0;
      error = new Error(
        //将带有%s替换为ags传入的参数
        format.replace(/%s/g, function () {
          return args[argIndex++];
        }),
      );
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}
