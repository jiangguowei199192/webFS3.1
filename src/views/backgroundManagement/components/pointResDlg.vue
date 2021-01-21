<template>
  <div>
    <ResDialog :title="title" :isShow.sync="isShow">
      <div slot="content"></div>
    </ResDialog>
  </div>
</template>

<script>
import ResDialog from './resDialog.vue'
export default {
  props: {

  },
  data () {
    return {
      title: '新增点资源',
      isShow: false
    }
  },
  components: {
    ResDialog
  },
  methods: {
    /**
     *  添加资源
     */
    addRes () {
      this.isShow = true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
