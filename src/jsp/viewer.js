import './jsp.lib.js'
/* globals jsPlumb */
import './lib/jquery/jquery.min.js'
/* globals $ */
import './lib/Math.uuid.js'

import nodeMeta from './nodes'
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
      zIndex: 2000,
      containment: 'parent',
      grid: [10, 10] // 网格对齐
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

  constructor (id, options, data) {
    this.id = id
    if ('dragSetting' in options) {
      this.dragSetting = window.jsPlumbUtil.merge(this.dragSetting, options.dragSetting)
    }
    if ('defaultOption' in options) {
      this.defaultOption = window.jsPlumbUtil.merge(this.defaultOption, options.defaultOption)
    }
    // 初始化实例
    this.initInstance(this.id)
    // 初始化事件
    this.jsp.registerConnectionType('basic', this.basicType)
    this.jsp.bind('connection', (connInfo, originalEvent) => {
      this.initConnectLabel(connInfo.connection)
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
    const { nodes = [], connections = [] } = data
    const realNodes = window.jsPlumbUtil.clone(nodes)
    const realConnections = window.jsPlumbUtil.clone(connections)
    // 生成节点
    this.mountNodes(realNodes)
    // 生成连接
    this.mountConnections(realConnections)
  }
  // 重新渲染
  rerender (data) {
    jsPlumb.empty()
    this.mountData(data)
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
  /** 更新节点内容 */
  updateNode (node) {
    const nowContainer = this.getDom(node.id)
    if (!nowContainer) {
      // 未被挂载，执行挂载
      this.mountNode(node)
    } else {
      const nodeDetail = this.nodeMeta.get(node.type)
      const renderTxt = nodeDetail.render(node)
      nowContainer.replaceWith(renderTxt)
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
    // console.log('connection: ', connection)
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
    that.jsp.draggable(that.getDom(selector))
  }

  // 工具函数
  /* 获取对象dom节点 */
  getDom (id) {
    return $(`#${id}`)
  }
}
