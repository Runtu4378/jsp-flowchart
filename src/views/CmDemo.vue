<template>
  <div id="demo_bpmn"></div>
</template>

<script>
import BpmnModeler from '../extra/bpmn-js/lib/Modeler'
import '../extra/bpmn-js/dist/assets/diagram-js.css'
import '../extra/bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import '../extra/bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import '../extra/bpmn-js/dist/assets/bpmn-font/css/bpmn.css'

export default {
  data () {
    return {}
  },
  mounted () {
    var viewer = new BpmnModeler({
      container: '#demo_bpmn'
    })
    // viewer.importXML('/diagram.bpmn', function (err) {
    //   if (!err) {
    //     console.log('success!')
    //     viewer.get('canvas').zoom('fit-viewport')
    //   } else {
    //     console.log('something went wrong:', err)
    //   }
    // })
    viewer.createDiagram()

    // viewer.get('canvas').zoom('fit-viewport')
  }
}
</script>

<style lang="css">
#demo_bpmn {
  height: 800px;
}
</style>
