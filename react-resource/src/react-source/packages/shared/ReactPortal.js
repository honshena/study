/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import {REACT_PORTAL_TYPE} from 'shared/ReactSymbols';

import type {ReactNodeList, ReactPortal} from 'shared/ReactTypes';
// 创建portal
export function createPortal(
  children: ReactNodeList,
  containerInfo: any,
  // TODO: figure out the API for cross-renderer implementation.
  implementation: any,
  key: ?string = null,
): ReactPortal {
  return {
    // This tag allow us to uniquely identify this as a React Portal
    $$typeof: REACT_PORTAL_TYPE, // 注意$$typeof
    key: key == null ? null : '' + key,
    children,
    containerInfo, // 要渲染到具体的dom节点
    implementation,
  };
}
