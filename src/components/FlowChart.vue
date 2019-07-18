<template>
  <div class="cm-flowchart" :class="classes">
    <div ref="canvas" class="cm-flowchart-canvas"></div>
  </div>
</template>

<script>
import Viewer from '../jsp/viewer'

let idx = 0

export default {
  props: {
    value: {
      type: Object
    },
    edit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      id: null,
      jsp: null
    }
  },
  computed: {
    classes () {
      const arr = []
      if (this.edit) {
        arr.push('cm-flowchart-mode-edit')
      } else {
        arr.push('cm-flowchart-mode-view')
      }
      return arr
    }
  },
  mounted () {
    this.initId()
    this.jsp = new Viewer(this.id, {}, this.value)
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
$perfix: "cm-flowchart";

.#{$perfix}
  position: relative;
  width: 100%;
  height: 100%;

  &.#{$perfix}-mode-edit
    background: #ccc;
    .#{$perfix}-canvas
      width: 95%;
      height: 95%;
      left: 2.5%;
      top: 2.5%;
      background: #fff;

  &-canvas
    position: relative;
    width: 100%;
    height: 100%;

</style>
