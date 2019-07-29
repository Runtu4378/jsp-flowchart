<template>
  <div class="wrapper">
    <div id="joj_graph" class="graph"></div>
    <div id="joj_graph_small" class="graph"></div>
  </div>
</template>

<script>
import * as joint from 'jointjs'
import * as g from 'jointjs/dist/geometry.js'
import 'jointjs/dist/joint.css'

export default {
  data () {
    return {}
  },

  mounted () {
    this.defineELe()
    this.initJoj()
  },

  methods: {
    defineELe () {
      joint.shapes.jojele = {}
      joint.shapes.jojele.Rect = joint.dia.Element.define('jojele.Rect', {
        attrs: {
          body: {
            refWidth: '100%',
            refHeight: '100%',
            strokeWidth: 2,
            stroke: '#000000',
            fill: '#FFFFFF'
          },
          label: {
            textVerticalAnchor: 'middle',
            textAnchor: 'middle',
            refX: '50%',
            refY: '50%',
            fontSize: 14,
            fill: '#333333'
          }
        }
      }, {
        markup: [{
          tagName: 'rect',
          selector: 'body'
        }, {
          tagName: 'text',
          selector: 'label'
        }]
      })
    },
    initJoj () {
      const graph = new joint.dia.Graph()
      const paper = new joint.dia.Paper({
        el: document.getElementById('joj_graph'),
        model: graph,
        width: '100%',
        height: '100%',
        gridSize: 20,
        drawGrid: 'dot'
      })
      paper.on('blank:pointerdblclick', function () {
        // resetAll(this)

        // info.attr('body/visibility', 'hidden')
        // info.attr('label/visibility', 'hidden')

        this.drawBackground({
          color: 'orange'
        })
      })
      const paperSmall = new joint.dia.Paper({
        el: document.getElementById('joj_graph_small'),
        model: graph,
        width: 150,
        height: 25,
        gridSize: 1,
        interactive: false
      })
      paperSmall.scale(0.25)

      const rect1 = new joint.shapes.standard.Rectangle()
      rect1.position(100, 30)
      rect1.resize(100, 40)
      rect1.attr({
        body: {
          fill: 'blue'
        },
        label: {
          text: 'rect1',
          fill: 'white'
        }
      })
      // rect.addTo(graph)
      graph.addCell(rect1)

      const rect2 = rect1.clone()
      rect2.translate(300, 0)
      rect2.attr({
        body: {
          fill: '#2C3E50',
          rx: 5,
          ry: 5,
          strokeWidth: 2
        },
        label: {
          text: 'rect2',
          fill: '#3498DB'
        }
      })
      rect2.addTo(graph)

      const link1 = new joint.shapes.standard.Link()
      link1.source(rect1)
      link1.target(rect2)
      link1.attr({
        line: {
          stroke: 'blue',
          strokeWidth: 1,
          sourceMarker: {
            type: 'path',
            stroke: 'black',
            fill: 'red',
            d: 'M 10 -5 0 0 10 5 Z'
          },
          targetMarker: {
            type: 'path',
            stroke: 'black',
            fill: 'yellow',
            d: 'M 10 -5 0 0 10 5 Z'
          }
        }
      })
      link1.addTo(graph)

      const rect3 = new joint.shapes.standard.Rectangle()
      rect3.position(100, 130)
      rect3.resize(100, 40)
      rect3.attr({
        body: {
          fill: '#E74C3C',
          rx: 20,
          ry: 20,
          strokeWidth: 0
        },
        label: {
          text: 'rect3',
          fill: '#ECF0F1'
          // fontSize: 11,
          // fontVariant: 'small-caps'
        }
      })
      rect3.addTo(graph)

      const rect4 = new joint.shapes.standard.Rectangle()
      rect4.position(400, 280)
      rect4.resize(100, 40)
      rect4.attr({
        body: {
          fill: '#8E44AD',
          strokeWidth: 0
        },
        label: {
          text: 'rect4',
          fill: 'white',
          fontSize: 13
        }
      })
      rect4.addTo(graph)

      const link2 = new joint.shapes.standard.Link()
      link2.source(rect3)
      link2.target(rect4)
      // link2.vertices([
      //   new g.Point(250, 100),
      //   new g.Point(300, 150),
      //   new g.Point(350, 200)
      // ])
      // link2.router('orthogonal')
      link2.router('metro', {
        startDirections: ['left', 'right'],
        endDirections: ['left', 'right']
      })
      // link2.router('manhattan', {
      //   // maximumLoops: 2,
      //   startDirections: ['left', 'right'],
      //   endDirections: ['left', 'right']
      // })
      link2.connector('rounded')
      link2.attr({
        line: {
          stroke: 'gray',
          strokeWidth: 4,
          strokeDasharray: '4 2',
          // sourceMarker: {
          //   'type': 'image',
          //   'xlink:href': 'http://cdn3.iconfinder.com/data/icons/49handdrawing/24x24/left.png',
          //   'width': 24,
          //   'height': 24,
          //   'y': -12
          // },
          // targetMarker: {
          //   'type': 'image',
          //   'xlink:href': 'http://cdn3.iconfinder.com/data/icons/49handdrawing/24x24/left.png',
          //   'width': 24,
          //   'height': 24,
          //   'y': -12
          // }
        }
      })
      link2.addTo(graph)

      const link4 = new joint.shapes.standard.Link()
      link4.source(rect3)
      link4.target(rect4)
      // link4.connector('jumpover', { size: 10 })
      link4.connector('smooth')
      // link4.connector('rounded', { radius: 10 })
      link4.addTo(graph)

      const rect5 = new joint.shapes.standard.Rectangle()
      rect5.position(100, 330)
      rect5.resize(100, 40)
      rect5.attr({
        body: {
          fill: '#2ECC71',
          strokeDasharray: '10,2'
        },
        label: {
          text: 'rect5',
          fill: 'black',
          fontSize: 13
        }
      })
      rect5.addTo(graph)

      var rect6 = new joint.shapes.standard.Rectangle()
      rect6.position(400, 330)
      rect6.resize(100, 40)
      rect6.attr({
        body: {
          fill: '#F39C12',
          rx: 20,
          ry: 20,
          strokeDasharray: '1,1'
        },
        label: {
          text: 'rect6',
          fill: 'gray',
          fontSize: 18,
          fontWeight: 'bold',
          fontVariant: 'small-caps',
          textShadow: '1px 1px 1px black'
        }
      })
      rect6.addTo(graph)

      const link3 = new joint.shapes.standard.Link()
      link3.source(rect5)
      link3.target(rect6)
      link3.attr({
        line: {
          stroke: '#3498DB',
          strokeWidth: 3,
          strokeDasharray: '5 5',
          strokeDashoffset: 7.5,
          sourceMarker: {
            'type': 'path',
            'stroke': 'none',
            'fill': '#3498DB',
            'd': `M 20 -10 0 0 20 10 Z 
M 40 -10 20 0 40 10 Z`
          },
          targetMarker: {
            'type': 'path',
            'stroke': 'none',
            'fill': '#3498DB',
            'd': `M 7.5 -10 2.5 -10 2.5 10 7.5 10 Z 
M 17.5 -10 12.5 -10 12.5 10 17.5 10 Z 
M 40 -10 20 0 40 10 Z`
          }
        }
      })
      link3.addTo(graph)

      const rect7 = new joint.shapes.jojele.Rect()
      rect7.position(400, 330)
      rect7.resize(100, 40)
      rect7.addTo(graph)

      console.log(joint.shapes)

      const jsonData = graph.toJSON()
      console.log(jsonData)
    }
  }
}
</script>

<style lang="sass" scoped>
.wrapper
  position: relative;
  width: 100%;
  height: 600px;

  .graph
    position: relative;
  #joj_graph_small
    position: absolute;
    right: 10px;
    bottom: 10px;
    border: 1px solid #ccc;
</style>
