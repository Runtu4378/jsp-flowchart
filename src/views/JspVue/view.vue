<template>
  <div>
    <h4>view</h4>
    <div>
      <Viewer v-model="fcData" />
    </div>
  </div>
</template>

<script>
import Viewer from '../../components/FlowChart'

export default {
  props: {
    fcData: Object
  },
  components: {
    Viewer
  }
}
</script>
