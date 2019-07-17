import '../../extra/jsplumb-2.10.2/dist/js/jsplumb.min.js'
/* globals jsPlumb */
import './jquery/jquery.min.js'
/* globals $ */
import './Math.uuid'

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
          click: function () {
            this.handleArrowClick()
          }
        }
      }],
      ['Label', {
        location: 0.1,
        id: 'label',
        cssClass: 'aLabel',
        events: {
          tap: function () {
            this.handleLabelClick()
          }
        }
      }]
    ],
    Container: this.id
  }
  // 样式
  basicType = {
    connector: 'StateMachine',
    paintStyle: {
      stroke: 'red', strokeWidth: 4
    },
    hoverPaintStyle: { stroke: 'blue' },
    overlays: [
      'Arrow'
    ]
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
    fill: '#216477',
    stroke: '#216477'
  }
  // the definition of source endpoints (the small blue ones)
  sourceEndpoint = {
    endpoint: 'Dot',
    paintStyle: {
      stroke: '#7AB02C',
      fill: 'transparent',
      radius: 7,
      strokeWidth: 1
    },
    isSource: true,
    connector: ['Flowchart', {
      stub: [40, 60],
      gap: 10,
      cornerRadius: 5,
      alwaysRespectStubs: true
    }],
    connectorStyle: this.connectorPaintStyle,
    hoverPaintStyle: this.endpointHoverStyle,
    connectorHoverStyle: this.connectorHoverStyle,
    dragOptions: {},
    overlays: [
      ['Label', {
        location: [0.5, 1.5],
        label: 'Drag',
        cssClass: 'endpointSourceLabel',
        visible: false
      }]
    ]
  }
  // the definition of target endpoints (will appear when the user drags a connection)
  targetEndpoint = {
    endpoint: 'Dot',
    paintStyle: {
      // fill: '#7AB02C',
      fill: 'transparent',
      radius: 7
    },
    // hoverPaintStyle: this.endpointHoverStyle,
    maxConnections: -1,
    dropOptions: {
      hoverClass: 'hover',
      activeClass: 'active'
    },
    isTarget: true,
    overlays: [
      ['Label', {
        location: [0.5, -0.5],
        label: 'Drop',
        cssClass: 'endpointTargetLabel',
        visible: false
      }]
    ]
  }

  // 节点类型表
  nodeMeta = nodeMeta

  /** 节点表 */
  nodes = new Map()

  constructor (id, options, data) {
    this.id = id
    // 初始化实例
    this.initInstance(this.id)
    // 挂载数据
    this.mountData(data)
  }

  /** 初始化实例 */
  async initInstance () {
    const that = this
    await new Promise(resolve => {
      jsPlumb.ready(function (params) {
        that.jsp = jsPlumb.getInstance(that.defaultOption)
      })
      resolve()
    })
  }

  /** 挂载节点和连接 */
  mountData (data) {
    const { nodes = [], edges = [] } = data
    // 生成节点
    this.mountNodes(nodes)
    // 生成连接
    this.mountConnect(edges)
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
      let realNode = node
      // 初始化id
      if (!node.id) {
        const uuid = Math.uuid(16)
        realNode = { id: uuid, ...node }
        this.nodes.set(uuid, realNode)
      } else {
        this.nodes.set(node.id, node)
      }
      const nodeDetail = this.nodeMeta.get(type)
      const renderTxt = nodeDetail.render(realNode)
      const container = this.getDom(this.id)
      // 挂载实际dom
      container.append(renderTxt)
      // 设置拖拽
      if (nodeDetail.draggable) {
        this.setDraggable(realNode.id)
      }
      // 设置锚点
      this.setEndPoint(realNode)
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
  mountConnect (list) {
    for (let i = 0; i < list.length; i += 1) {
      const link = list[i]
      const { source, target } = link
      if (!this.nodes.has(source.node) || !this.nodes.has(target.node)) {
        // 某个节点不存在
        console.warn('some node did not exist')
      } else {
        this.jsp.connect({
          uuids: [source.endpoint, target.endpoint]
        })
      }
    }
  }

  // 事件
  /** 连接箭头点击事件 */
  handleArrowClick () {
    console.log('arrow click')
  }
  /** 连接标签点击事件 */
  handleLabelClick () {
    console.log('label click')
  }

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
        // //todo update node here
      },
      containment: 'parent'
    }
    this.jsp.draggable(this.getDom(selector), option)
  }

  // 工具函数
  /* 获取对象dom节点 */
  getDom (id) {
    return $(`#${id}`)
  }
}
