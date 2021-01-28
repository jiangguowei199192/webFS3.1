<template>
  <el-dialog
    :visible="isShow"
    :close-on-click-modal="false"
    @close="$emit('close')"
    width="1105px"
    class="permission-dlg"
  >
    <div class="add-people-header">
      <div class="header-icon"></div>
      <div class="header-text">数据授权</div>
    </div>

    <el-tabs v-model="activeTab" class="permission-tab">
      <el-tab-pane label="部门" name="apartment">
        <div class="tab-div1">
          <div class="range-div">
            <div class="range-title">权限范围</div>
            <el-radio-group
              v-model="rangeRadio"
              class="range-radio"
              @change="radioGroupChange"
            >
              <el-radio :label="1">本级</el-radio>
              <el-radio :label="2">本级及其上级</el-radio>
              <el-radio :label="3">本级及其下级</el-radio>
              <el-radio :label="4">自定义</el-radio>
            </el-radio-group>
          </div>
          <div class="dept-div" v-show="showRangeDept">
            <div class="dept-title">机构列表</div>
            <el-input
              class="dept-search-input"
              suffix-icon="el-icon-search"
              v-model="rangeDeptSearch"
              placeholder="请输入机构进行搜索"
              @change="rangeDeptSearchChange"
            ></el-input>
            <el-tree
              :data="deptTree"
              :props="deptTreeProps"
              default-expand-all
              node-key="deptCode"
              :current-node-key="selectedDept.deptCode"
              class="dept-tree"
            ></el-tree>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="用户" name="user">
        <div class="tab-div2">
          <div class="dept-div"></div>
          <div class="user-div"></div>
          <div class="selected-user-div"></div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <div class="confirm-tool">
      <div class="confirm-btn" @click="$emit('confirmClick')">确定</div>
      <div class="cancel-btn" @click="$emit('cancelClick')">取消</div>
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
  data () {
    return {
      activeTab: 'apartment',
      rangeRadio: 1,
      showRangeDept: false,
      rangeDeptSearch: '',
      deptTree: [
        {
          deptName: '湖北省应急管理厅',
          deptCode: '1',
          children: [
            { deptName: '孝感市应急管理局', deptCode: '1-1' },
            {
              deptName: '武汉市应急管理局',
              deptCode: '1-2',
              children: [
                {
                  deptName: '江夏区应急管理所',
                  deptCode: '1-2-1'
                }
              ]
            },
            { deptName: '孝感市应急管理局', deptCode: '1-3' },
            { deptName: '孝感市应急管理局', deptCode: '1-4' },
            { deptName: '孝感市应急管理局', deptCode: '1-5' },
            { deptName: '孝感市应急管理局', deptCode: '1-6' },
            { deptName: '孝感市应急管理局', deptCode: '1-7' },
            { deptName: '孝感市应急管理局', deptCode: '1-8' },
            { deptName: '孝感市应急管理局', deptCode: '1-9' },
            { deptName: '孝感市应急管理局', deptCode: '1-10' },
            { deptName: '孝感市应急管理局', deptCode: '1-11' },
            { deptName: '孝感市应急管理局', deptCode: '1-12' }
          ]
        }
      ],
      deptTreeProps: {
        children: 'children',
        label: 'deptName',
        value: 'deptCode'
      },
      selectedDept: ''
    }
  },
  methods: {
    radioGroupChange (label) {
      if (label === 4) {
        this.showRangeDept = true
      } else {
        this.showRangeDept = false
      }
    },

    rangeDeptSearchChange () {}
  }
}
</script>

<style lang="scss" scoped>
.permission-dlg.el-dialog__wrapper {
  /deep/.el-dialog {
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 0px 20px;
      width: 100%;
      border: 1px solid #1eb0fc;
      background-color: #121e3a;
      .add-people-header {
        height: 40px;
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
      .permission-tab {
        margin-left: 20px;
        width: 1065px;
        .el-tabs__item {
          width: 100px;
          color: #fff;
          font-size: 14px;
          text-align: center;
          box-sizing: none;
        }
        /* 选中时的字体颜色 */
        .el-tabs__item.is-active {
          color: #00ccff;
        }
        /* 选中的下划线颜色 */
        .el-tabs__active-bar {
          background-color: #00ccff;
        }
        /* 线条颜色 */
        .el-tabs__nav-wrap::after {
          background-color: rgba($color: #1eb0fc, $alpha: 0.5);
        }
        /* 去除边框 */
        .el-tabs__item.is-active.is-focus:not(:active) {
          -webkit-box-shadow: none !important;
          box-shadow: none !important;
        }
      }
      .tab-div1 {
        height: 503px;
        .range-div {
          float: left;
          width: 243px;
          height: 100%;
          background-color: rgba($color: #183157, $alpha: 0.95);
          .range-title {
            height: 36px;
            width: 100%;
            font-size: 14px;
            color: #00ccff;
            text-align: center;
            line-height: 36px;
          }
          .range-radio {
            margin-top: 10px;
            .el-radio {
              display: block;
              height: 27px;
              margin-left: 10px;
            }
            .el-radio__inner {
              background-color: transparent;
              border-color: #fff;
              border-radius: 0px;
            }
            .el-radio__label {
              color: #fff;
            }
          }
        }
        .dept-div {
          float: left;
          width: 311px;
          height: 100%;
          background-color: rgba($color: #183157, $alpha: 0.95);
          margin-left: 5px;
          .dept-title {
            height: 36px;
            width: 100%;
            font-size: 14px;
            color: #00ccff;
            text-align: center;
            line-height: 36px;
          }
          .dept-search-input {
            width: 278px;
            margin-left: 16px;
            .el-input__inner {
              background: #09546d;
              border-color: #1eb0fc;
              border-radius: 0;
              color: white;
            }
            .el-icon-search {
              color: #c5f3ff;
            }
          }
          .dept-tree {
            width: 278px;
            height: 414px;
            overflow: auto;
            margin-top: 10px;
            margin-left: 16px;
            background-color: transparent;
            color: #fff;
            .el-tree-node {
              .el-tree-node__content {
                display: block !important;
                height: 30px;
                line-height: 30px;
                border: 1px solid transparent;
                background-color: transparent;
              }
              .el-tree-node__label {
                font-size: 14px;
              }
              .el-tree-node__content:hover,
              .el-tree-node:focus > .el-tree-node__content {
                color: #fff;
                background-color: transparent !important;
              }

              // 展开折叠图标
              .el-tree-node__expand-icon.expanded {
                // 动画取消
                -webkit-transform: rotate(0deg);
                transform: rotate(0deg);
              }
              .el-icon-caret-right:before {
                // 收起
                content: url("../../../assets/images/backgroundManagement/deptTreeUnfold.png");
              }
              .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
                // 展开
                content: url("../../../assets/images/backgroundManagement/deptTreeFold.png");
              }
              .el-tree-node__expand-icon.is-leaf::before {
                display: none;
              }
            }
          }
        }
      }
      .tab-div2 {
        height: 503px;
        .dept-div {
          display: inline-block;
          width: 311px;
          height: 100%;
          background-color: rgba($color: #183157, $alpha: 0.95);
        }
        .user-div {
          display: inline-block;
          width: 554px;
          height: 100%;
          background-color: rgba($color: #183157, $alpha: 0.95);
          margin-left: 5px;
        }
        .selected-user-div {
          display: inline-block;
          width: 190px;
          height: 100%;
          background-color: rgba($color: #183157, $alpha: 0.95);
          margin-left: 5px;
        }
      }
    }

    .confirm-tool {
      height: 50px;
      margin-top: 17px;
      .confirm-btn {
        float: right;
        width: 66px;
        height: 30px;
        background-color: #1eb0fc;
        border-radius: 4px;
        color: #fff;
        font-size: 14px;
        text-align: center;
        line-height: 30px;
        margin-right: 15px;
        cursor: pointer;
      }
      .cancel-btn {
        float: right;
        width: 66px;
        height: 30px;
        background-color: transparent;
        border: 1px solid #1eb0fc;
        border-radius: 4px;
        color: #fff;
        font-size: 14px;
        text-align: center;
        line-height: 30px;
        margin-right: 20px;
        cursor: pointer;
      }
    }
  }
}
</style>
