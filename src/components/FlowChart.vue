<template>
  <div>
    <div ref="canvas"></div>
  </div>
</template>

<script>
let idx = 0

export default {
  data () {
    return {}
  },
  mounted () {
    this.initId()
  },
  methods: {
    initId () {
      this.$refs['canvas'].setAttribute('id', `cm_flowchart_${idx}`)
    }
  }
}
</script>
