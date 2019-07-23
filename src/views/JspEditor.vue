<template>
  <div class="wrapper">
    <FlowChartEditor v-model="chartData" />
  </div>
</template>

<script>
import FlowChartEditor from '../components/FlowChartEditor'
import baseData from './baseData'

export default {
  components: {
    FlowChartEditor
  },
  data () {
    return {
      chartData: { ...baseData }
    }
  }
}
</script>

<style lang="sass">
.wrapper
  position: relative;
  height: 600px;

</style>
