import './lib/jquery/jquery.min.js'
/* globals $ */
import './lib/jquery/jquery-ui.min.js'

import Viewer from './viewer.js'
import nodeMeta from './nodes'

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
    this.initEdit()
    // console.log('const fini')
    this.updateData(value)
    // 挂载事件队列
    window.jsPlumbUtil.EventGenerator.apply(this)
  }

  /** 初始化viewer实例 */
  initInstance (id) {
    this.viewer = new Viewer(id, {
      defaultOption: {
        DragOptions: {
          drag: () => this.handleDragIng(),
          stop: (event) => this.handleDragStop(event)
        }
      }
    })
    this.jsp = this.viewer.jsp
    // console.log('init finish')
    // 挂载viewer实例的节点更新事件
    this.mountViewerEvent()
  }

  /** 挂载viewer事件 */
  mountViewerEvent () {
    // 绑定“连接建立”事件
    this.jsp.bind('connection', (connInfo, originalEvent) => {
      this.updateConnectionData(connInfo)
    })
    // 绑定“连接删除”事件
    this.jsp.bind('connectionDetached', (connInfo, originalEvent) => {
      this.removeConnectionData(connInfo.connection)
    })
    $(`#${this.id}`).on('click', '.flowchart-object', (event) => {
      // console.log(event)
      const target = event.currentTarget
      // console.log(target)
      if (!target) {
        console.warn('can\' locate node')
        return
      }
      const node = this.nodes.get(target.id)
      const nodeMeta = this.nodeMeta.get(node.type)
      this.fire('nodeClick', node, nodeMeta)
    })
  }

  /** 初始化编辑栏和事件 */
  initEdit () {
    // 挂载工具栏
    this.mountToolbar()
    // 挂载节点生成事件
    this.initDragEvent()
  }

  /** 挂载工具栏 */
  mountToolbar () {
    const container = $(`#${this.id}`)
    const renderStr = []
    for (let [key, value] of nodeMeta.entries()) {
      renderStr.push(`
      <div class="jsp-editor-node-item darg-data" node-type="${key}" title="${value.label}"><img src="${value.icon}"/></div>
      `)
    }
    container.append(`
    <div class="jsp-editor-toolbar">${renderStr.join('<div class="split"></div>')}</div>
    `)
  }

  /** 挂载节点生成事件 */
  initDragEvent () {
    const that = this
    $('.jsp-editor-node-item.darg-data').draggable({
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
        // console.log(type)
        const node = {
          type,
          x: ui.position.left,
          y: ui.position.top
        }
        that.mountNode(node)
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
    // console.log(this)
  }
  /** 删除节点 */
  deleteNode (nodeId) {
    const deleteRes = this.nodes.delete(nodeId)
    if (!deleteRes) {
      console.warn(`delete node [${nodeId}] failed`)
    } else {
      // 删除相关的连接
      const idArr = []
      for (let [key, value] of this.connections.entries()) {
        if (
          value.source.node === nodeId ||
          value.target.node === nodeId
        ) {
          idArr.push(key)
        }
      }
      idArr.forEach((id) => {
        this.connections.delete(id)
      })
    }
    this.jsp.remove(nodeId)
    console.log(this)
    // TODO 触发数据更新事件
  }
  /** 更新位置信息（数据） */
  updateNodePosition (uuid, x, y) {
    if (this.nodes.has(uuid)) {
      const node = this.nodes.get(uuid)
      node.x = x
      node.y = y
      this.nodes.set(uuid, node)
    }
    // console.log(this)
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
    this.viewer.mountConnection(connection)
    // 映射关系的绑定在 connection 事件中处理
  }
  /** 被动更新连接数据 */
  updateConnectionData (connInfo) {
    const { connection, sourceId, sourceEndpoint, targetId, targetEndpoint } = connInfo
    const data = connection.getData()
    // console.log('connInfo: ', connInfo)
    // console.log('data: ', data)
    let cDataSet = { data: {} }
    let uuid = data.uuid
    if (this.connections.has(uuid)) {
      // 已存在数据，更新数据
      cDataSet = { ...this.connections.get(uuid) }
    } else {
      // 未存在数据，初始化之
      uuid = Math.uuid(16)
      cDataSet.cid = connection.id // 把自动生成的id设置到cid
      cDataSet.id = uuid
      cDataSet.source = {
        node: sourceId,
        endpoint: sourceEndpoint._jsPlumb.uuid
      }
      cDataSet.target = {
        node: targetId,
        endpoint: targetEndpoint._jsPlumb.uuid
      }
      cDataSet.data.uuid = uuid
    }
    cDataSet.data.label = connection.getOverlay('label').getLabel()
    // console.log('cDataSet: ', cDataSet)
    this.connections.set(uuid, cDataSet)
    // 手动同步节点的data
    connection.setData(cDataSet.data)
    // console.log(this)
  }
  /** 移除保存的连接表 */
  removeConnectionData (connection) {
    const data = connection.getData()
    const uuid = data.uuid
    // console.log('delete id: ', uuid)
    this.connections.delete(uuid)
    // console.log(this.connections)
    // console.log(this)
  }

  /// 事件处理-start
  handleDragIng () {
    console.log('....dragIng....')
    //
  }
  handleDragStop (event, ui) {
    console.log('....dragStop....')
    const { el, finalPos } = event
    const id = el.id
    const [x, y] = finalPos
    this.updateNodePosition(id, x, y)
  }
  /// 事件处理-end

  // 工具函数
  /* 获取对象dom节点 */
  getDom (id) {
    return $(`#${id}`)
  }
}
