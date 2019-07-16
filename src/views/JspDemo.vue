<template>
  <div>
    <h1>jspDemo</h1>
    <!-- <div id="container">
      <div class="window jtk-node" id="flowchartWindow4"><strong>4</strong><br/><br/></div>
    </div> -->
    <FlowChart />
  </div>
</template>

<script>
import FlowChart from '../components/FlowChart'
import '../extra/jsplumb-2.10.2/dist/js/jsplumb.js'

// globals jsPlumbToolkit

export default {
  components: {
    FlowChart
  },
  data () {
    return {}
  },
  mounted () {
    // this.showGraph()
  },
  methods: {
    showGraph () {
      jsPlumb.ready(function () {
        const instance = jsPlumb.getInstance({
          DragOptions: { cursor: 'pointer', zIndex: 2000 },
          ConnectionOverlays: [
            [ 'Arrow', {
              location: 1,
              visible:true,
              width:11,
              length:11,
              id:'ARROW',
              events:{
                click:function() { alert('you clicked on the arrow overlay')}
              }
            } ],
            [ 'Label', {
              location: 0.1,
              id: 'label',
              cssClass: 'aLabel',
              events:{
                tap:function() { alert('hey'); }
              }
            }]
          ],
          Container: 'container'
        })
        const connectorPaintStyle = {
          strokeWidth: 2,
          stroke: '#61B7CF',
          joinstyle: 'round',
          outlineStroke: 'white',
          outlineWidth: 2
        }
        const connectorHoverStyle = {
          strokeWidth: 3,
          stroke: '#216477',
          outlineWidth: 5,
          outlineStroke: 'white'
        }
        const endpointHoverStyle = {
          fill: '#216477',
          stroke: '#216477'
        }
        const sourceEndpoint = {
          endpoint: 'Dot',
          paintStyle: {
            stroke: '#7AB02C',
            fill: 'transparent',
            radius: 7,
            strokeWidth: 1
          },
          isSource: true,
          connector: [ 'Flowchart', { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true } ],
          connectorStyle: connectorPaintStyle,
          hoverPaintStyle: endpointHoverStyle,
          connectorHoverStyle: connectorHoverStyle,
          dragOptions: {},
          overlays: [
            [ 'Label', {
              location: [0.5, 1.5],
              label: 'Drag',
              cssClass: 'endpointSourceLabel',
              visible: false
            } ]
          ]
        }
        const targetEndpoint = {
          endpoint: 'Dot',
          paintStyle: { fill: '#7AB02C', radius: 7 },
          hoverPaintStyle: endpointHoverStyle,
          maxConnections: -1,
          dropOptions: { hoverClass: 'hover', activeClass: 'active' },
          isTarget: true,
          overlays: [
            [ 'Label', { location: [0.5, -0.5], label: 'Drop', cssClass: 'endpointTargetLabel', visible: false } ]
          ]
        }
        const _addEndpoints = function (toId, sourceAnchors, targetAnchors) {
          for (var i = 0; i < sourceAnchors.length; i++) {
            var sourceUUID = toId + sourceAnchors[i];
            instance.addEndpoint('flowchart' + toId, sourceEndpoint, {
              anchor: sourceAnchors[i], uuid: sourceUUID
            })
          }
          for (var j = 0; j < targetAnchors.length; j++) {
            var targetUUID = toId + targetAnchors[j]
            instance.addEndpoint('flowchart' + toId, targetEndpoint, { anchor: targetAnchors[j], uuid: targetUUID })
          }
        }
        instance.batch(function () {
          _addEndpoints('Window4', ['TopCenter', 'BottomCenter'], ['LeftMiddle', 'RightMiddle'])
        })
      })
    }
  }
}
</script>
