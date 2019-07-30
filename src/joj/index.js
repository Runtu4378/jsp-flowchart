/* eslint semi: "error" */
/* eslint comma-dangle: ["error", "always-multiline"] */

import * as joint from 'jointjs';
import 'jointjs/dist/joint.css';

import { cloneDeep } from 'lodash';

import defaults from './defaults.js';
import nodeDefines from './nodes';

export default class Joj {
  /** 挂载dom的id */
  id = null
  /** 栅格尺寸 */
  gridSize = defaults.gridSize
  /** joint.graph 实例 */
  graph = null
  /** joint.paper 实例 */
  paper = null

  constructor ({
    id,
    value,
  }) {
    this.id = id;
    this.initInstance(id);
    nodeDefines();
    this.initStartAndEnd();
    this.updateData(value);
    // console.log(joint);
    console.log(this.paper);
    console.log(joint.shapes);
  }

  /** 初始化viewer实例 */
  initInstance (id) {
    console.log(joint.shapes);
    // this.graph = new joint.dia.Graph({
    //   /* attributes of the graph */
    //   cellViewNamespace: joint.shapes,
    // });
    this.graph = new joint.dia.Graph;
    this.paper = new joint.dia.Paper({
      el: document.getElementById(id),
      model: this.graph,
      width: '100%',
      height: '100%',
      gridSize: this.gridSize,
      drawGrid: 'dot',
      cellViewNamespace: joint.shapes,
    }, {
      cellViewNamespace: joint.shapes,
    });
  }

  /** 初始化起点终点 */
  initStartAndEnd () {
    const startNode = new joint.shapes.cmChart.StartEnd({
      attrs: {
        'text.title': {
          text: 'START',
        },
        '.outPorts circle': {
          fill: '#51B252',
        },
      },
    });
    startNode.position(this.gridSize * 2, this.gridSize * 6);
    console.log(startNode);
    // const view = this.paper.findViewByModel(joint.shapes.cmChart.StartEnd);
    // startNode.set({
    //   id: startNode.id,
    //   outPorts: ['out'],
    // });
    startNode.set('outPorts', ['out']);
    // startNode.resize(100, 40);
    this.graph.addCell(startNode);
    // const view = this.paper.findViewByModel(startNode);
    const view = this.paper.findViewByModel(joint.shapes.cmChart.StartEnd);
    console.log(view);
  }

  /** 更新数据 */
  updateData (data) {
    // const { nodes = [], connections = [] } = data
    // const realNodes = cloneDeep(nodes)
    // const realConnections = cloneDeep(connections)
    // // 生成节点
    // this.mountNodes(realNodes)
    // // 生成连接
    // this.mountConnections(realConnections)
    const realData = cloneDeep(data);
    console.log(realData);
    // this.graph.fromJSON(realData)
    // this.graph.fromJSON({ cells: [] })
  }
}
