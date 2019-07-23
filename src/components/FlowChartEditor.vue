<template>
  <div :class="classes">
    <div ref="canvas" class="cm-flowchart-canvas"></div>
    <div class="cm-flowchart-edit-area">
      <!-- <Spin v-if="!edit" fix /> -->
      <Form ref="edit-form" class="form">
        <FormItem label="标题">
          <Input type="text" v-model="formData.label" placeholder="节点标题" />
        </FormItem>
        <FormItem class="btn-area">
          <Button type="primary" @click="handleSaveTitle">保存</Button>
          <Button type="error" @click="deleteNode">删除</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
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
      id: null,
      edit: null,
      formData: {
        label: ''
      }
    }
  },
  computed: {
    classes () {
      const arr = ['cm-flowchart']
      if (this.edit) {
        arr.push('cm-flowchart-edit')
      }
      return arr
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
      // this.$Modal.info({
      //   title: meta.label
      // })
      this.edit = node
      this.formData = {
        label: node.text
      }
    },
    handleSaveTitle () {
      const nowNode = cloneDeep(this.edit)
      nowNode.text = this.formData.label
      this.editor.viewer.updateNode(nowNode)
      this.edit = null
    },
    deleteNode () {
      this.editor.deleteNode(this.edit.id, true)
      this.edit = null
    }
  }
}
</script>

<style lang="sass">
$perfix: "cm-flowchart";
$border-color: #ccc;
$edit-width: 320px;

.#{$perfix}
  position: relative;
  width: 100%;
  height: 100%;
  &.#{$perfix}-edit
    .#{$perfix}-canvas
      right: $edit-width;
    .#{$perfix}-edit-area
      width: $edit-width;

  &-canvas
    position: absolute;
    height: 100%;
    left: 0;
    right: 0;
    border: 1px solid $border-color;
  &-edit-area
    position: absolute;
    height: 100%;
    width: 0;
    right: 0;
    top: 0;
    overflow: hidden;
    border: 1px solid $border-color;
    border-left-width: 0;
    .form
      padding: 10px 16px;

      .btn-area
        button
          margin-right: 10px;
          &:alst-child
            margin-right: 0;

</style>
