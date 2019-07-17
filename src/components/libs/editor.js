import './jquery/jquery.min.js'
/* globals $ */
import './jquery/jquery-ui.min.js'

import Viewer from './viewer.js'
import nodeMeta from './nodeMeta'

export default class Editor {
  id = null
  viewer = null

  constructor ({
    id
  }) {
    this.id = id
    // 生成画布实例
    this.viewer = new Viewer(id, {}, {})
    // 挂载工具栏
    this.mountToolbar()
    // 挂载节点生成事件
    this.initDragEvent()
  }

  /** 挂载工具栏 */
  mountToolbar () {
    const container = $(`#${this.id}`)
    let renderStr = ''
    for (let key of nodeMeta.keys()) {
      renderStr += `
      <div class="node-item darg-data" node-type="${key}">${key}</div>
      `
    }
    container.append(`
    <div class="toolbar">${renderStr}</div>
    `)
  }

  /** 挂载节点生成事件 */
  initDragEvent () {
    const that = this
    $('.node-item.darg-data').draggable({
      revert: 'invalid',
      helper: 'clone',
      cursor: 'move',
      opacity: 0.8, // 拖拽时透明
      scope: 'park',
      appendTo: `#${this.id}`
    })
    $(`#${this.id}`).droppable({
      scope: 'park',
      drop: function (event, ui) {
        // debugger
        const type = ui.draggable[0].attributes['node-type'].nodeValue
        console.log(type)
        const left = ui.position.left
        const top = ui.position.top
        that.viewer.mountNode({
          type,
          x: left,
          y: top
        })
      }
    })
  }
}
