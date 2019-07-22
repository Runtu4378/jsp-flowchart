import './jsp.lib.js'
/* globals jsPlumb */
import './lib/jquery/jquery.min.js'
/* globals $ */
import './lib/Math.uuid.js'

import nodeMeta from './nodeMeta'
import './viewer.scss'

export default class JspViewer {
  /** 容器id */
  id = null
  /** jsp实例 */
  jsp = null
  /** 默认配置 */
  defaultOption = {
    // default drag options
    DragOptions: {
      cursor: 'pointer',
      zIndex: 2000
    },
    // the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
    // case it returns the 'labelText' member that we set on each connection in the 'init' method below.
    ConnectionOverlays: [
      ['Arrow', {
        location: 1,
        visible: true,
        width: 11,
        length: 11,
        id: 'ARROW',
        events: {
          click: () => {
            this.handleArrowClick()
          }
        }
      }],
      ['Label', {
        location: 0.5,
        id: 'label',
        cssClass: 'aLabel',
        events: {
          tap: () => {
            this.handleLabelClick()
          }
        }
      }]
    ],
    Container: this.id
  }
  // 样式
  basicType = {
    connector: 'Flowchart'
  }
  connectorPaintStyle = {
    strokeWidth: 2,
    stroke: '#61B7CF',
    joinstyle: 'round',
    outlineStroke: 'white',
    outlineWidth: 2
  }
  // and this is the hover style.
  connectorHoverStyle = {
    strokeWidth: 3,
    stroke: '#216477',
    outlineWidth: 5,
    outlineStroke: 'white'
  }
  endpointHoverStyle = {
    fill: '#0075FF',
    stroke: '#0075FF'
  }
  // the definition of source endpoints (the small blue ones)
  sourceEndpoint = {
    endpoint: 'Dot',
    paintStyle: {
      // stroke: '#7AB02C',
      stroke: '#0075FF',
      fill: '#fff',
      radius: 4,
      strokeWidth: 1
    },
    isSource: true,
    connector: ['Flowchart', {
      stub: [16, 16],
      gap: 10,
      cornerRadius: 5,
      alwaysRespectStubs: true
    }],
    connectorStyle: this.connectorPaintStyle,
    hoverPaintStyle: this.endpointHoverStyle,
    connectorHoverStyle: this.connectorHoverStyle,
    dragOptions: {
      hoverClass: 'hover',
      activeClass: 'active'
    }
  }
  // the definition of target endpoints (will appear when the user drags a connection)
  targetEndpoint = {
    endpoint: 'Dot',
    paintStyle: {
      // fill: '#7AB02C',
      fill: 'transparent',
      radius: 4
    },
    maxConnections: -1,
    dropOptions: {
      hoverClass: 'hover',
      activeClass: 'active'
    },
    isTarget: true
  }

  /// 额外配置-start
  dragSetting = {
    node: true
  }
  logEnabled = true
  /// 额外配置-end

  // 节点类型表
  nodeMeta = nodeMeta

  /** 节点表 */
  nodes = new Map()
  /** 连接表 */
  connections = new Map()

  constructor (id, options, data) {
    this.id = id
    if ('dragSetting' in options) {
      this.dragSetting = window.jsPlumbUtil.merge(this.dragSetting, options.dragSetting)
    }
    // 初始化实例
    this.initInstance(this.id)
    // 初始化事件
    this.jsp.registerConnectionType('basic', this.basicType)
    this.jsp.bind('connection', (connInfo, originalEvent) => {
      this.initConnectLabel(connInfo.connection)
      this.updateConnectionData(connInfo)
    })
    this.jsp.bind('connectionDetached', (connInfo, originalEvent) => {
      this.detachConnection(connInfo.connection)
      this.removeConnectionData(connInfo.connection)
    })
    if (data) {
      // 挂载数据
      this.mountData(data)
    }
  }

  /** 初始化实例 */
  async initInstance () {
    await new Promise(resolve => {
      jsPlumb.ready((params) => {
        this.jsp = jsPlumb.getInstance(this.defaultOption)
        // console.log('jsp init fini')
        resolve()
      })
    })
  }

  /** 挂载节点和连接 */
  mountData (data) {
    const { nodes = [], edges = [] } = data
    const realNodes = window.jsPlumbUtil.clone(nodes)
    const realEdges = window.jsPlumbUtil.clone(edges)
    // 生成节点
    this.mountNodes(realNodes)
    // 生成连接
    this.mountConnections(realEdges)
  }

  /** 挂载节点数据 */
  mountNodes (nodes) {
    for (let i = 0; i < nodes.length; i += 1) {
      const node = nodes[i]
      this.mountNode(node)
    }
  }
  /** 挂载单个节点 */
  mountNode (node) {
    const { type } = node
    if (!this.nodeMeta.has(type)) {
      throw new Error(`unknown type of node: ${type}`)
    } else {
      const nodeDetail = this.nodeMeta.get(type)
      const renderTxt = nodeDetail.render(node)
      const container = this.getDom(this.id)
      // 挂载实际dom
      container.append(renderTxt)
      // 设置拖拽
      if (
        this.dragSetting.node &&
        nodeDetail.draggable
      ) {
        this.setDraggable(node.id)
      }
      // 设置锚点
      this.setEndPoint(node)
    }
  }
  /** 设置节点的锚点 */
  setEndPoint (node) {
    const nodeDetail = this.nodeMeta.get(node.type)
    const { endpoint = [] } = nodeDetail
    for (let i = 0; i < endpoint.length; i += 1) {
      this.jsp.addEndpoint(
        node.id,
        this.targetEndpoint,
        {
          anchor: endpoint[i],
          uuid: `${node.id}_target_${endpoint[i]}`
        }
      )
      this.jsp.addEndpoint(
        node.id,
        this.sourceEndpoint,
        {
          anchor: endpoint[i],
          uuid: `${node.id}_source_${endpoint[i]}`
        }
      )
    }
  }

  /** 生成连接 */
  mountConnections (connections) {
    for (let i = 0; i < connections.length; i += 1) {
      this.mountConnection(connections[i])
    }
  }
  mountConnection (connection) {
    const { source, target } = connection
    return this.jsp.connect({
      uuids: [source.endpoint, target.endpoint],
      data: {
        uuid: connection.id,
        ...connection.data
      }
    })
  }
  /** 初始化连接标签 */
  initConnectLabel (connection) {
    // console.log(connection)
    // console.log(connection.getData())
    const data = connection.getData()
    let label = data.label
    if (!label) {
      label = connection.sourceId.substring(4) + '-' + connection.targetId.substring(4)
    }
    connection.getOverlay('label').setLabel(label)
  }
  /** 更新连接表 */
  updateConnectionData (connInfo) {
    const { connection, sourceId, sourceEndpoint, targetId, targetEndpoint } = connInfo
    // console.log(connInfo)
    const data = connection.getData()
    let cDataSet = { data: {} }
    let uuid
    /** 该条数据的data是否来自外部data */
    const ifFromData = !!data.uuid
    if (ifFromData) {
      // 已存在数据，使用现有uuid
      uuid = data.uuid
    } else {
      // 新连接，初始化uuid
      uuid = Math.uuid(16)
    }
    if (this.connections.has(uuid)) {
      // 已存在数据，更新数据
      cDataSet = { ...this.connections.get(uuid) }
    } else {
      // 未存在数据，初始化之
      cDataSet.id = uuid
      cDataSet.source = {
        node: sourceId,
        endpoint: sourceEndpoint._jsPlumb.uuid
      }
      cDataSet.target = {
        node: targetId,
        endpoint: targetEndpoint._jsPlumb.uuid
      }
    }
    cDataSet.data.uuid = uuid
    cDataSet.data.label = connection.getOverlay('label').getLabel()
    // console.log('cDataSet: ', cDataSet)
    this.connections.set(uuid, cDataSet)
    // 手动同步节点的data
    connection.setData(cDataSet.data)
  }
  /** 移除保存的连接表 */
  removeConnectionData = function (connection) {
    const data = connection.getData()
    const uuid = data.uuid
    // console.log('delete id: ', uuid)
    this.connections.delete(uuid)
    // console.log(this.connections)
  }.bind(this)

  /// 事件-start
  /** 连接箭头点击事件 */
  handleArrowClick () {
    console.log('arrow click')
  }
  /** 连接标签点击事件 */
  handleLabelClick () {
    console.log('label click')
  }
  handleDataUpdate () {
    //
  }
  /** 删除链接处理函数 */
  detachConnection (connection) {
    console.log(connection)
  }
  /// 事件-end

  // jsp函数
  /** 设置位置 */
  setPosition = function (nodeid, x, y) {
    var node = this.getDom(nodeid)
    node.css('left', x)
    node.css('top', y)
    this.updatePosition(nodeid, x, y)
  }
  updatePosition = function (key, vx, vy) {
    var result = this.nodes.get(key)
    result.x = vx
    result.y = vy
    this.nodes.set(key, result)
    return result
  }
  /** 设置拖拽 */
  setDraggable (selector) {
    const that = this
    const option = {
      drag: function () {
        console.log('....draging....')
      },
      stop: function (event, ui) {
        console.log('....stop....')
        const id = event.el.id
        const x = event.pos[0]
        const y = event.pos[1]
        that.setPosition(id, x, y)
        // var node = helper.container.getNode(id)
        // TODO update node here
      },
      containment: 'parent'
    }
    that.jsp.draggable(that.getDom(selector), option)
  }

  // 工具函数
  /* 获取对象dom节点 */
  getDom (id) {
    return $(`#${id}`)
  }
}
