/* eslint comma-dangle: ["error", "always-multiline"] */

import * as joint from 'jointjs'

import defaults from '../defaults.js'

import {
  StartEndModel,
  StartEndView,
} from './StartEnd.js'

/** 初始化自定义节点类型 */
export default () => {
  joint.shapes[defaults.prefix] = {}
  joint.shapes[defaults.prefix].StartEnd = StartEndModel
  joint.shapes[defaults.prefix].StartEndView = StartEndView
  // initStart()
}
