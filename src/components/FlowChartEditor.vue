<template>
  <div class="cm-flowchart-editor">
    <div ref="canvas" class="cm-flowchart-canvas"></div>
  </div>
</template>

<script>
import Editor from '../jsp/editor.js'

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
    this.editor = new Editor({
      id: this.id,
      value: this.value
    })
    console.log(this.editor)
    setTimeout(() => {
      console.log(this.editor.id)
    }, 1000)
    this.editor.bind('nodeClick', this.showDatail)
  },
  methods: {
    initId () {
      const id = `cm_flowchart_${idx++}`
      this.id = id
      this.$refs['canvas'].setAttribute('id', id)
    },
    showDatail (node, meta) {
      console.log(node)
      console.log(meta)
      this.$Modal.info({
        title: meta.label
      })
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

  &-canvas
    position: relative;
    width: 100%;
    height: 100%;

</style>
