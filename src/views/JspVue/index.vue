<template>
  <div class="wrapper">
    <div class="edit-area">
      <EditArea />
    </div>
    <div class="view-area">
      <ViewArea />
    </div>
  </div>
</template>

<script>
import ViewArea from './view'
import EditArea from './edit'

export default {
  components: {
    ViewArea,
    EditArea
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
html,
body {
  height: 100%;
  width: 100%;
}
#app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>

<style scoped>
.wrapper {
  flex: 1;
  position: relative;
}
.wrapper .edit-area,
.wrapper .view-area {
  position: absolute;
  width: 50%;
  height: 100%;
  box-sizing: border-box;
}
.wrapper .view-area {
  left: 50%;
  border-left: 1px solid #000;
}
</style>
