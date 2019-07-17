import '../../extra/jsplumb-2.10.2/dist/js/jsplumb.min.js'
/* globals jsPlumb */
import './jquery/jquery.min.js'
/* globals $ */
import './Math.uuid'

const nodesMap = new Map([
  ['Start', {
    render: (props) => {
      const {
        left = 0,
        top = 0,
        w = 400,
        h = 300,
        text = 'start'
      } = props
      return `
      <div style="left:${left}px;top:${top}px;width:${w}px;height:${h}px;" class="flowchart-object flowchart-start">
        <div style="position:relative">
          <svg:svg width="${w}" height="${h}">
            <svg:ellipse cx="${w / 2}" cy="${h / 2}" rx="${w / 2}" ry="${h / 2}"></svg:ellipse>
            <svg:text text-anchor="middle" x="${w / 2}" y="${h / 2}" dominant-baseline="central">${text}</svg:text>
          </svg:svg>
        </div>
        <jtk-source port-type="start" filter="svg *" filter-negate="true"></jtk-source>
      </div>
      `
    }
  }]
])

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
      fill: '#7AB02C', radius: 7
    },
    hoverPaintStyle: this.endpointHoverStyle,
    maxConnections: -1,
    dropOptions: { hoverClass: 'hover', activeClass: 'active' },
    isTarget: true,
    overlays: [
      ['Label', {
        location: [0.5, -0.5],
        label: 'Drop',
        cssClass: 'endpointTargetLabel',
        visible:false
      }]
    ]
  }

  // 节点类型表
  nodesMap = nodesMap

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

  init = function (connection) {
    connection.getOverlay('label')
      .setLabel(connection.sourceId.substring(15) + '-' + connection.targetId.substring(15))
  }

  /** 挂载节点和连接 */
  mountData (data) {
    const { nodes = [], edges = [] } = data
    this.mountNodes(nodes)
  }

  /** 挂载节点 */
  mountNodes (nodes) {
    for (let i = 0; i < nodes.length; i += 1) {
      const node = nodes[i]
      this.mountNode(node)
    }
  }
  mountNode (node) {
    const { type } = node
    if (!this.nodesMap.has(type)) {
      throw new Error(`unknown type of node: ${type}`)
    } else {
      const nodeDetail = this.nodesMap.get(type)
      const renderTxt = nodeDetail.render(node)
      const container = this.getDom(this.id)
      container.append(renderTxt)
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

  // 工具函数
  /* 获取对象dom节点 */
  getDom (id) {
    return $(`#${id}`)
  }
}
