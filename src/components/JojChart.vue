<template>
  <div class="cm-flowchart-joj">
    <div ref="canvas" class="cm-flowchart-joj-canvas"></div>
  </div>
</template>

<script>
import Joj from '../joj'

let idx = 0

export default {
  editor: null, // 编辑器实例

  props: {
    value: {
      type: Object
    }
  },
  data () {
    return {
      id: null
    }
  },

  mounted () {
    this.initId()
    // this.editor = new Joj({
    //   id: this.id,
    //   value: this.value
    // })
    new Joj({
      id: this.id,
      value: this.value
    })
  },

  methods: {
    initId () {
      const id = `cm_flowchart_joj_${idx++}`
      this.id = id
      this.$refs['canvas'].setAttribute('id', id)
    }
  }
}
</script>

<style lang="sass">
.cm-flowchart-joj
  position: absolute;
  width: 100%;
  height: 100%;
  .cm-flowchart-joj-canvas
    position: absolute;
    width: 100%;
    height: 100%;
</style>
