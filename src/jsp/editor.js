import './lib/jquery/jquery.min.js'
/* globals $ */
import './lib/jquery/jquery-ui.min.js'

import Viewer from './viewer.js'
import nodeMeta from './nodeMeta'

export default class Editor {
  /** 挂载dom的id */
  id = null
  /** viewer实例 */
  viewer = null
  /** jsp实例 */
  jsp = null

  // 节点类型表
  nodeMeta = nodeMeta

  /** 节点表 */
  nodes = new Map()
  /** 连接表 */
  connections = new Map()

  constructor ({
    id,
    value
  }) {
    this.id = id
    // 生成画布实例
    this.initInstance(id)
    // 挂载工具栏
    this.mountToolbar()
    // 挂载节点生成事件
    this.initDragEvent()
    // console.log('const fini')
    this.updateData(value)
  }

  /** 初始化viewer实例 */
  initInstance (id) {
    this.viewer = new Viewer(id, {}, {})
    this.jsp = this.viewer.jsp
    // console.log('init finish')
  }

  /** 挂载工具栏 */
  mountToolbar () {
    const container = $(`#${this.id}`)
    const renderStr = []
    for (let key of nodeMeta.keys()) {
      renderStr.push(`
      <div class="node-item darg-data" node-type="${key}">${key}</div>
      `)
    }
    container.append(`
    <div class="toolbar">${renderStr.join('<div class="split"></div>')}</div>
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

  /** 更新数据 */
  updateData (data) {
    const { nodes = [], connections = [] } = data
    const realNodes = window.jsPlumbUtil.clone(nodes)
    const realConnections = window.jsPlumbUtil.clone(connections)
    // 生成节点
    this.mountNodes(realNodes)
    // 生成连接
    this.mountConnections(realConnections)
  }
  /** 挂载节点 */
  mountNodes (nodes) {
    for (let i = 0; i < nodes.length; i += 1) {
      const node = nodes[i]
      this.mountNode(node)
    }
  }
  mountNode (node) {
    // 初始化id
    if (!node.id) {
      const uuid = Math.uuid(16)
      node.id = uuid
      this.nodes.set(uuid, node)
    } else {
      this.nodes.set(node.id, node)
    }
    this.viewer.mountNode(node)
  }

  /** 挂载连接 */
  mountConnections (connections) {
    for (let i = 0; i < connections.length; i += 1) {
      this.mountConnection(connections[i])
    }
  }
  mountConnection (connection) {
    // 连接实际使用的id是自行生成的，需要形成一个映射关系
    if (!connection.id) {
      connection.id = Math.uuid(16)
    }
    const renderRes = this.viewer.mountConnection(connection)
    if (renderRes) {
      connection.cid = renderRes.id
      this.connections.set(connection.id, connection)
    }
  }
}
