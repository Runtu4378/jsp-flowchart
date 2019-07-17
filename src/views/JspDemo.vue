<template>
  <div class="wrapper">
    <h1>jspDemo</h1>
    <FlowChart
      :chartData="chartData"
    />
  </div>
</template>

<script>
import FlowChart from '../components/FlowChart'

export default {
  components: {
    FlowChart
  },
  data () {
    return {
      chartData: {
        nodes: [
          {
            id: 'start_001',
            type: 'Start',
            text: 'start node'
          },
          {
            id: 'task_001',
            type: 'Task',
            text: 'task 001',
            x: 80,
            y: 100
          }
        ],
        edges: [
          {
            id: 1,
            source: {
              node: 'start_001',
              endpoint: 'start_001_source_TopCenter'
            },
            target: {
              node: 'task_001',
              endpoint: 'task_001_target_TopCenter'
            }
          }
        ]
      }
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style>
.wrapper {
  height: 500px;
  width: 100%;
}
</style>
