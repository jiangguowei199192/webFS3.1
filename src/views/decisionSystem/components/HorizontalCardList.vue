<template>
<!-- 横向卡片列表 -->
  <div class="container webFsScroll">
    <div class="item" v-for="(item, index) in items" :key="index" @click="didClickedImage(index)">
      <img :src="item.image" style="width: 100%; height: 100%;">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data () {
    return {

    }
  },
  methods: {
    didClickedImage (index) {
      this.$emit('didClickedImage', index)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 85px;
  overflow-x: auto;
  white-space: nowrap;
}
.item {
  display: inline-block;
  width: 90px;
  height: 53px;
  margin-right: 10px;
  margin-top: 10px;
}

</style>
