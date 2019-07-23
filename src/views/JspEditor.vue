<template>
  <div class="wrapper">
    <div class="edit-area">
      <FlowChartEditor v-model="chartData" />
    </div>
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
  position: relative;
  height: 600px;

.edit-area
  position: absolute;
  height: 100%;
  left: 0;
  right: 100px;
  border: 1px solid #ccc;

</style>
