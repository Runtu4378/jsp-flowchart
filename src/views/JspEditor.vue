<template>
  <div class="wrapper">
    <div id="jsp_editor" class="cm-flowchart-editor"></div>
  </div>
</template>

<script>
import Editor from '../components/libs/editor'

export default {
  data () {
    return {}
  },
  mounted () {
    this.editor = new Editor({
      id: 'jsp_editor'
    })
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
