<template>
  <div>
    <div class="title">用户权限 / 功能权限</div>
    <div class="base-div">
      <el-tree
        :data="data"
        show-checkbox
        node-key="id"
        default-expand-all
        :props="defaultProps"
        :render-content="renderContent"
        class="permission-tree"
      ></el-tree>
    </div>
  </div>
</template>

<script>
export default {
  mounted () {
    this.changeTreeClass()
  },
  data () {
    return {
      data: [
        {
          id: 1,
          label: '一级',
          children: [
            {
              id: 4,
              label: '二级',
              children: [
                { id: 10, label: '三级' },
                { id: 11, label: '三级' },
                { id: 12, label: '三级' },
                {
                  id: 9,
                  label: '三级',
                  children: [
                    { id: 11, label: '四级', tag: true },
                    { id: 12, label: '四级', tag: true },
                    { id: 13, label: '四级', tag: true }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: '一级',
          children: [
            { id: 5, label: '二级' },
            { id: 6, label: '二级' }
          ]
        },
        {
          id: 3,
          label: '一级',
          children: [
            { id: 7, label: '二级' },
            { id: 8, label: '二级' }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    renderContent (h, { node, data }) {
      let className = ''
      if (data.tag && data.tag) {
        className = 'especially'
      }
      return <div class={className}>{data.label}</div>
    },

    changeTreeClass () {
      // 找到之前做标记的class
      var classDomList = document.getElementsByClassName('especially')
      // console.log(classDomList)
      // 改变这几个样式
      for (var i = 0; i < classDomList.length; i++) {
        classDomList[i].parentNode.style.cssText = 'float: left'
        classDomList[i].parentNode.className =
          'el-tree-node__content option-wrapper'
        classDomList[i].parentNode.parentNode.parentNode.style.marginLeft =
          '70px'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  height: 54px;
  font-size: 16px;
  line-height: 54px;
  margin-left: 30px;
  margin-right: 30px;
}

.base-div {
  height: 674px;
  background-color: #183157;
  margin-left: 30px;
  margin-right: 30px;
  padding: 70px 120px;
  .permission-tree {
    background: transparent;
    color: #fff;
    font-size: 16px;
    overflow: auto;
    /deep/.el-tree-node {
      .el-tree-node__content {
        height: 30px;
        background-color: transparent;
      }
      .el-tree-node__label {
        font-size: 16px;
      }
      /* 鼠标移入某行时的背景色 */
      .el-tree-node__content:hover,
      .el-tree-node:focus > .el-tree-node__content {
        color: #fff;
        background-color: transparent !important;
      }
      /* 复选框样式 */
      .el-checkbox__inner {
        background-color: transparent;
        border-color: #c5f3ff;
        border-radius: 0px;
      }
    }
  }
}
</style>
