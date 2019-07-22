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
  .toolbar
    width: 40px;
    height: 90%;
    position: absolute;
    left: 10px;
    top: 5%;
    border: 1px solid #ccc;
    border-radius: 3px;
    .split
      height: 1px;
      margin: 4px;
      background: #ccc;

</style>
