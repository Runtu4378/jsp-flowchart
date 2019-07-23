<template>
  <div class="wrapper">
    <FlowChartEditor v-model="chartData" />
    <!-- <FlowChartEditor v-model="chartData2" /> -->
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
      chartData: { ...baseData },
      chartData2: { ...baseData }
    }
  }
}
</script>

<style lang="sass">
.wrapper
  height: 600px;

.cm-flowchart-editor
  position: relative;
  height: 100%;
  width: 100%;

</style>
