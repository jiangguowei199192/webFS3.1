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
          <div class="apartment-dept-div" v-show="showRangeDept">
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
              style="height: 422px; margin-top: 10px; margin-left: 16px"
            ></el-tree>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="用户" name="user">
        <div class="tab-div2">
          <div class="user-list-div">
            <div class="user-list-title">用户列表</div>
            <div class="user-dept-div">
              <div class="user-dept-title">机构列表</div>
              <el-tree
                :data="deptTree"
                :props="deptTreeProps"
                default-expand-all
                node-key="deptCode"
                :current-node-key="selectedDept.deptCode"
                class="dept-tree"
                style="margin: 0 0px 0 20px; height: 400px"
              ></el-tree>
            </div>

            <div class="account-div">
              <div class="account-title">账号列表</div>
              <div class="search-tool">
                <div class="account-status-text">账号状态</div>

                <el-select
                  v-model="accountStatusSearch"
                  class="account-status-select"
                >
                  <el-option
                    v-for="item in accountStatusOptions"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  ></el-option>
                </el-select>

                <el-input
                  class="account-search-input"
                  v-model="userSearch"
                  placeholder="请输入用户名/姓名/身份证号进行搜索"
                ></el-input>

                <div class="account-search-btn" @click="accountSearchClick">
                  <i class="el-icon-search"></i>
                  <span class="account-search-text">查询</span>
                </div>

                <div class="account-reset-btn" @click="accountResetClick">
                  <i class="el-icon-refresh"></i>
                  <span class="account-reset-text">重置</span>
                </div>
              </div>

              <el-table
                class="accountTable"
                :data="accountList"
                empty-text="暂无数据"
                height="320"
                @selection-change="handleSelectionChange"
                @select="accountSelect"
                @select-all="accountSelectAll"
              >
                <el-table-column type="selection"></el-table-column>
                <el-table-column
                  label="用户编号"
                  prop="userNum"
                  align="center"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                  label="用户名"
                  prop="username"
                  align="center"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                  label="姓名"
                  prop="name"
                  align="center"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                  label="联系方式"
                  prop="phone"
                  align="center"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                  label="账号状态"
                  prop="enable"
                  align="center"
                ></el-table-column>
              </el-table>

              <div style="text-align: center">
                <el-pagination
                  class="tablePagination"
                  popper-class="pageSelect"
                  :total="pageTotal"
                  :page-size="pageSize"
                  :current-page.sync="currentPage"
                  layout="total, prev, pager, next"
                  @current-change="currentPageChange"
                ></el-pagination>
              </div>
            </div>
          </div>

          <div class="selected-user-div">
            <div class="selected-title">已关联用户</div>
            <div class="selected-box">
              <div
                class="selected-item"
                v-for="item in selectedAccounts"
                :key="item.userNum"
                @click="deleteSelectedAccount(item)"
              >
                <span class="item-text">{{ item.name }}</span>
                <i class="el-icon-close item-delete"></i>
              </div>
            </div>
          </div>
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
            { deptName: '孝感市应急管理局', deptCode: '1-12' },
            { deptName: '孝感市应急管理局', deptCode: '1-13' },
            { deptName: '孝感市应急管理局', deptCode: '1-14' },
            { deptName: '孝感市应急管理局', deptCode: '1-15' }
          ]
        }
      ],
      deptTreeProps: {
        children: 'children',
        label: 'deptName',
        value: 'deptCode'
      },
      selectedDept: '',
      accountStatusSearch: '',
      accountStatusOptions: [
        { id: 1, label: '全部' },
        { id: 2, label: '有效' },
        { id: 3, label: '无效' }
      ],
      userSearch: '',
      accountList: [
        {
          userNum: '00001',
          username: '00001',
          name: '00001',
          phone: '12311223333',
          enable: '有效'
        },
        {
          userNum: '00002',
          username: '00002',
          name: '00002',
          phone: '12311223333',
          enable: '有效'
        },
        {
          userNum: '00003',
          username: '00003',
          name: '00003',
          phone: '12311223333',
          enable: '有效'
        },
        {
          userNum: '00004',
          username: '00004',
          name: '00004',
          phone: '12311223333',
          enable: '有效'
        },
        {
          userNum: '00005',
          username: '00005',
          name: '00005',
          phone: '12311223333',
          enable: '有效'
        },
        {
          userNum: '00006',
          username: '00006',
          name: '00006',
          phone: '12311223333',
          enable: '有效'
        },
        {
          userNum: '00007',
          username: '00007',
          name: '00007',
          phone: '12311223333',
          enable: '有效'
        },
        {
          userNum: '00008',
          username: '00008',
          name: '00008',
          phone: '12311223333',
          enable: '有效'
        },
        {
          userNum: '00009',
          username: '00009',
          name: '00009',
          phone: '12311223333',
          enable: '有效'
        },
        {
          userNum: '00010',
          username: '00010',
          name: '00010',
          phone: '12311223333',
          enable: '有效'
        }
      ],
      pageTotal: 100,
      pageSize: 10,
      currentPage: 1,
      selectedAccounts: []
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

    rangeDeptSearchChange () {},

    accountSearchClick () {},

    accountResetClick () {},

    // 表格选中某一行时触发
    handleSelectionChange (items) {
      // items.forEach((item) => {
      //   if (this.selectedAccounts.indexOf(item) === -1) {
      //     this.selectedAccounts.push(item);
      //   }
      // });
    },
    // 选择单行
    accountSelect (selection, row) {
      if (selection.indexOf(row) === -1) {
        // 取消选中
        console.log('取消选中')
        const index = this.selectedAccounts.indexOf(row)
        if (index > -1) {
          this.selectedAccounts.splice(index, 1)
        }
      } else {
        // 选中
        console.log('选中')
        this.selectedAccounts.push(row)
      }
    },
    // 全选或全不选
    accountSelectAll (selection) {
      if (selection && selection.length) {
        console.log('全选')
        var _this1 = this
        selection.forEach((item) => {
          if (_this1.selectedAccounts.indexOf(item) === -1) {
            _this1.selectedAccounts.push(item)
          }
        })
      } else {
        console.log('全不选')
        var _this2 = this
        this.accountList.forEach((item) => {
          const index = _this2.selectedAccounts.indexOf(item)
          if (index > -1) {
            _this2.selectedAccounts.splice(index, 1)
          }
        })
      }
    },

    currentPageChange () {},

    // 删除已选中用户时触发
    deleteSelectedAccount (item) {
      const index = this.selectedAccounts.indexOf(item)
      if (index > -1) {
        this.selectedAccounts.splice(index, 1)
      }
    }
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
        .apartment-dept-div {
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
        }
      }
      .dept-tree {
        overflow: auto;
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
      .tab-div2 {
        height: 503px;
        .user-list-div {
          float: left;
          width: 870px;
          height: 100%;
          background-color: rgba($color: #183157, $alpha: 0.95);
          .user-list-title {
            width: 100%;
            height: 40px;
            line-height: 40px;
            color: #00ccff;
            font-size: 14px;
            text-align: center;
          }
          .user-dept-div {
            float: left;
            width: 270px;
            height: 440px;
            margin-left: 10px;
            border: 1px solid #1eb0fc;
            .user-dept-title {
              height: 40px;
              line-height: 40px;
              margin-left: 20px;
              font-size: 14px;
              color: #00ccff;
            }
          }
          .account-div {
            float: left;
            width: 566px;
            height: 440px;
            border: 1px solid #1eb0fc;
            margin-left: 10px;
            .account-title {
              height: 40px;
              line-height: 40px;
              margin-left: 15px;
              font-size: 14px;
              color: #00ccff;
            }
            .search-tool {
              height: 24px;
              margin: 0 15px;
              .account-status-text {
                float: left;
                color: #fff;
                display: inline-block;
                font-size: 12px;
                height: 24px;
                line-height: 24px;
              }
              .account-status-select {
                float: left;
                width: 91px;
                height: 24px;
                margin-left: 10px;
                .el-input__inner {
                  background: #09546d;
                  border-color: #1eb0fc;
                  border-radius: 0;
                  color: white;
                  height: 24px;
                  font-size: 12px;
                }
                /* 使箭头居中 */
                .el-input__icon {
                  line-height: 24px;
                }
              }
              .account-search-input {
                float: left;
                width: 233px;
                margin-left: 10px;
                .el-input__inner {
                  background: #09546d;
                  border-color: #1eb0fc;
                  border-radius: 0;
                  color: white;
                  height: 24px;
                  font-size: 12px;
                }
              }
              .account-search-btn {
                float: left;
                width: 56px;
                height: 24px;
                margin-left: 10px;
                background: -webkit-linear-gradient(top, #086384, #0b779e);
                font-size: 12px;
                line-height: 24px;
                color: #c5f3ff;
                text-align: center;
                cursor: pointer;
                .account-search-text {
                  margin-left: 5px;
                }
              }
              .account-reset-btn {
                float: left;
                width: 56px;
                height: 24px;
                margin-left: 10px;
                background: -webkit-linear-gradient(top, #086384, #0b779e);
                font-size: 12px;
                line-height: 24px;
                color: #c5f3ff;
                text-align: center;
                cursor: pointer;
                .account-reset-text {
                  margin-left: 5px;
                }
              }
            }

            /* 删除表格下横线 */
            .accountTable.el-table::before {
              height: 0px;
            }
            .accountTable.el-table {
              color: #c5f3ff;
              font-size: 12px;
              background: transparent;
              border: none;
              margin-top: 10px;
              margin-left: 15px;
              width: 536px;

              /* 表格表头样式 */
              .el-table__header-wrapper th {
                color: #c5f3ff;
                font-size: 12px;
                height: 40px;
                padding: 0;
                background-color: rgba(11, 119, 158, 0.66);
              }

              /* 表格每行高度*/
              .el-table__body td {
                height: 28px;
                padding: 0;
              }

              /* 每行的背景颜色 */
              .el-table__body td {
                background-color: transparent;
              }

              /* 所有单元格颜色、无边框 */
              td,
              tr,
              th {
                border: none;
                background-color: transparent;
              }

              /* 复选框样式 */
              .el-checkbox__inner {
                background-color: transparent;
                border-color: #c5f3ff;
                border-radius: 0px;
              }

              /*鼠标移入某行时的背景色*/
              tbody tr:hover > td {
                background-color: transparent;
              }
            }
          }
        }

        .selected-user-div {
          float: left;
          width: 190px;
          height: 100%;
          background-color: rgba($color: #183157, $alpha: 0.95);
          margin-left: 5px;
          .selected-title {
            height: 40px;
            line-height: 40px;
            color: #00ccff;
            font-size: 14px;
            text-align: center;
          }
          .selected-box {
            height: 440px;
            .selected-item {
              display: inline-block;
              width: 80px;
              height: 25px;
              margin-left: 10px;
              margin-bottom: 10px;
              background-color: #39a4dd;
              border-radius: 2px;
              text-align: center;
              cursor: pointer;
              .item-text {
                display: inline-block;
                max-width: 50px;
                font-size: 12px;
                color: #fff;
                line-height: 25px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              .item-delete {
                color: #fff;
                line-height: 25px;
                float: right;
                margin-right: 7px;
              }
            }
          }
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
