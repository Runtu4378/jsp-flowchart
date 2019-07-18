<template>
  <div>
    <h4>edit</h4>
    <div>
      <Viewer v-model="fcData" :edit="true" />
    </div>
  </div>
</template>

<script>
import Viewer from '../../components/FlowChart'

export default {
  components: {
    Viewer
  },
  data () {
    return {
      fcData: {
        nodes: [],
        edges: []
      }
    }
  }
}
</script>
