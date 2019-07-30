<template>
  <div class="wrapper">
    <JojChart v-model="chartData"></JojChart>
  </div>
</template>

<script>
import JojChart from '../components/JojChart'
// import baseData from './baseData'

export default {
  components: { JojChart },
  data () {
    return {
      chartData: {
        cells: [
          // {
          //   id: 1,
          //   type: 'standard.Rectangle',
          //   position: {
          //     x: 100,
          //     y: 100
          //   },
          //   size: {
          //     width: 100,
          //     height: 100
          //   }
          // }
        ]
      }
    }
  }
}
</script>

<style scoped>
.wrapper {
  position: relative;
  width: 100%;
  height: 700px;
}
</style>
