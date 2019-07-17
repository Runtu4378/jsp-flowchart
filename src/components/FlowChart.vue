<template>
  <div class="cm-flowchart">
    <div ref="canvas" class="cm-flowchart-canvas"></div>
  </div>
</template>

<script>
import Viewer from './libs/viewer'

let idx = 0

export default {
  props: {
    chartData: {
      type: Object
    }
  },
  data () {
    return {
      id: null,
      jsp: null
    }
  },
  mounted () {
    this.initId()
    this.jsp = new Viewer(this.id, {}, this.chartData)
  },
  methods: {
    initId () {
      const id = `cm_flowchart_${idx}`
      this.id = id
      this.$refs['canvas'].setAttribute('id', id)
    }
  }
}
</script>

<style lang="sass">
.cm-flowchart
  position: relative;
  width: 100%;
  height: 100%;

  &-canvas
    position: relative;
    width: 100%;
    height: 100%;

  .flowchart-object
    position: absolute;
    background: #fff;
    &.flowchart-start
      border: 4px solid #ccc;
      border-radius: 50%;
    &.flowchart-task
      border: 1px solid #ccc;
      border-radius: 2px;
</style>
