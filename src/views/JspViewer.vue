<template>
  <div class="wrapper">
    <div class="editor">
      <FlowChart
        v-model="chartData"
        :edit="edit"
      />
    </div>
    <div class="btn-area">
      <button
        @click="changeEdit"
      >{{ edit ? '退出编辑' : '编辑' }}</button>
    </div>
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
      edit: false,
      chartData: { ...baseData }
    }
  },
  mounted () {
  },
  methods: {
    changeEdit () {
      this.edit = !this.edit
    }
  }
}
</script>

<style>
.wrapper {
  height: 500px;
  width: 100%;
}

.editor {
  height: 600px;
}
</style>
