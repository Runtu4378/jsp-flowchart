<template>
  <div class="wrapper">
    <FlowChart v-model="chartData" :edit="true" />
  </div>
</template>

<script>
import FlowChart from '../components/FlowChart'
import baseData from './baseData'

export default {
  components: {
    FlowChart
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
