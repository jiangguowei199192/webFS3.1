<template>
  <el-dialog
    :visible="isShow"
    v-if="isShow"
    :close-on-click-modal="false"
    @close="$emit('close')"
    width="1083px"
    class="role-auth-dlg"
  >
    <div class="add-people-header">
      <div class="header-icon"></div>
      <div class="header-text">角色授权</div>
    </div>

    <el-tree
      :data="data"
      show-checkbox
      node-key="id"
      default-expand-all
      :props="defaultProps"
      :render-content="renderContent"
      class="permission-tree"
    ></el-tree>

    <div class="confirm-tool">
      <div class="confirm-btn" @click="confirmClick">确定</div>
        <div class="cancel-btn" @click="cancelClick">取消</div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      required: true
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.changeTreeClass()
    })
  },
  data () {
    return {
      data: [
        {
          id: '1',
          label: '一级菜单',
          children: [
            {
              id: '11',
              label: '二级菜单',
              children: [
                { id: '111', label: '三级菜单' },
                {
                  id: '112',
                  label: '三级菜单',
                  children: [
                    { id: '1111', label: '四级菜单', tag: true },
                    { id: '1112', label: '四级菜单', tag: true },
                    { id: '1113', label: '四级菜单', tag: true }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: '2',
          label: '一级菜单',
          children: [
            { id: '21', label: '二级菜单' },
            { id: '22', label: '二级菜单' }
          ]
        },
        {
          id: 3,
          label: '一级菜单',
          children: [
            { id: '31', label: '二级菜单' },
            { id: '32', label: '二级菜单' }
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
    confirmClick () {
      this.$emit('confirmClick')
    },

    cancelClick () {
      this.$emit('cancelClick')
    },

    renderContent (h, { node, data }) {
      let className = ''
      if (data.tag && data.tag) {
        className = 'especially1'
      }
      return <div class={className}>{data.label}</div>
    },

    changeTreeClass () {
      // 找到之前做标记的class
      var classDomList = document.getElementsByClassName('especially1')
      console.log(classDomList)
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
.role-auth-dlg.el-dialog__wrapper {
  /deep/.el-dialog {
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 0px 20px;
      width: 100%;
      height: 690px;
      border: 1px solid #1eb0fc;
      background-color: #121e3a;
      .add-people-header {
        height: 40px;
        border-bottom: 1px solid #1eb0fc;
        .header-icon {
          display: inline-block;
          width: 22px;
          height: 16px;
          background-image: url("../../../assets/images/fire_title.png");
          margin-top: 15px;
        }
        .header-text {
          display: inline-block;
          vertical-align: top;
          margin-top: 13px;
          margin-left: 10px;
          font-size: 14px;
          color: #fff;
        }
      }
    }

    .permission-tree {
      background: transparent;
      color: #fff;
      font-size: 16px;
      overflow: auto;
      height: 540px;
      margin-left: 80px;
      margin-right: 80px;
      margin-top: 40px;
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

    .confirm-tool {
      height: 50px;
      margin-top: 20px;
      .confirm-btn {
        width: 70px;
        height: 24px;
        background-color: #00cff9;
        float: right;
        margin-right: 19px;
        border-radius: 4px;
        color: white;
        font-size: 12px;
        text-align: center;
        line-height: 24px;
        cursor: pointer;
      }
      .cancel-btn {
        width: 70px;
        height: 24px;
        background-color: transparent;
        float: right;
        margin-right: 10px;
        color: #00cff9;
        font-size: 12px;
        text-align: center;
        line-height: 24px;
        border: 1px solid #00cff9;
        border-radius: 4px;
        cursor: pointer;
      }
    }
  }
}
</style>
