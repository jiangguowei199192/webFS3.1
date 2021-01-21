<template>
  <div>
    <div class="title">用户权限 / 用户管理</div>
    <div class="left-div">
      <div class="left-title">组织机构树</div>
      <el-input
        class="institution-search-input"
        suffix-icon="el-icon-search"
        v-model="institutionSearch"
        placeholder=""
        @change="institutionSearchChange"
      ></el-input>
      <el-tree
        :data="deptTree"
        :props="deptTreeProps"
        default-expand-all
        @node-click="deptTreeClick"
        node-key="deptCode"
        :current-node-key="selectedDept.deptCode"
        v-if="selectedDept.deptCode"
        class="dept-tree"
      ></el-tree>
    </div>
    <div class="right-div">
      <div class="right-title">用户列表</div>
      <div class="search-tool">
        <el-input
          class="people-search-input"
          v-model="userSearch"
          placeholder="请输入人员姓名/身份证号进行搜索"
        ></el-input>
        <div class="people-search-btn" @click="userUserClick">
          <img :src="userSearchIcon" class="people-search-icon" />
          <span class="people-search-text">搜索</span>
        </div>
        <div class="people-reset-btn" @click="userResetClick">
          <img :src="peopleResetIcon" class="people-reset-icon" />
          <span class="people-reset-text">重置</span>
        </div>
      </div>
      <div class="operate-table-tool">
        <span class="selected-count"
          >已选<span style="color: #1eb0fc">0</span>项</span
        >
        <!-- <div class="clean-btn">清空</div> -->
        <div class="delete-btn" @click="deleteUserClick">批量删除</div>
        <div class="add-btn" @click="addUserClick">添加</div>
      </div>
      <el-table
        :data="userList"
        empty-text="暂无数据"
        height="630"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column
          label="用户名"
          prop="username"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="账号"
          prop="account"
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
          label="关联角色数"
          prop="roleCount"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="绑定人员"
          prop="bindPeople"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="排序"
          prop="num"
          align="center"
        ></el-table-column>
        <el-table-column label="账号状态" prop="" align="center">
          <template slot-scope="scope">
            <div>
              <el-switch
                v-model="scope.row.enable"
                active-color="#1EB0FC"
                inactive-color="#aeaeae"
              ></el-switch>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <div class="table-btn" @click="editUserClick(scope.row)">
              修改
            </div>
            <div
              class="table-btn table-btn-see"
              @click="seeUserClick(scope.row)"
            >
              查看
            </div>
            <div
              class="table-btn table-btn-edit-password"
              @click="resetPasswordClick(scope.row)"
            >
              重置密码
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center">
        <el-pagination
          class="tablePagination"
          popper-class="pageSelect"
          :total="pageTotal"
          :page-size="pageSize"
          :current-page.sync="currentPage"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="currentPageChange"
        ></el-pagination>
      </div>
    </div>

    <AddUserDialog
      :isShow.sync="showAddUser"
      title="新增用户"
      @close="showAddUser=false"
      @confirmClick="addUserConfirmClick"
      @cancelClick="addUserCancelClick"
    ></AddUserDialog>

    <AddUserDialog
      :isShow.sync="showEditUser"
      title="修改用户"
      @close="showEditUser=false"
      @confirmClick="editUserConfirmClick"
      @cancelClick="editUserCancelClick"
    ></AddUserDialog>

    <DeleteDialog
      :isShow.sync="showDeleteUser"
      @close="showDeleteUser=false"
      @confirmClick="deleteUserConfirmClick"
      @cancelClick="deleteUserCancelClick"
    ></DeleteDialog>
  </div>
</template>

<script>
import AddUserDialog from './components/addUserDialog.vue'
import DeleteDialog from './components/deleteDialog.vue'

export default {
  components: {
    AddUserDialog,
    DeleteDialog
  },
  data () {
    return {
      userSearchIcon: require('../../assets/images/backgroundManagement/searchIcon.png'),
      peopleResetIcon: require('../../assets/images/backgroundManagement/resetIcon.png'),

      institutionSearch: '',
      deptTree: [
        {
          deptName: '湖北省应急管理厅',
          deptCode: '1',
          showSetting: true,
          children: [
            {
              deptName: '孝感市应急管理局',
              deptCode: '1-1',
              showSetting: false
            },
            {
              deptName: '武汉市应急管理局',
              deptCode: '1-2',
              showSetting: false,
              children: [
                {
                  deptName: '江夏区应急管理所',
                  deptCode: '1-2-1',
                  showSetting: false
                }
              ]
            }
          ]
        }
      ],
      deptTreeProps: {
        children: 'children',
        label: 'deptName',
        value: 'deptCode'
      },
      selectedDept: '',
      userSearch: '',
      userList: [
        {
          username: 'syh',
          account: 'songyunhui',
          phone: '13687909090',
          roleCount: 3,
          bindPeople: '宋运辉',
          num: 2,
          enable: true
        },
        {
          username: 'ldb',
          account: 'leidongbao',
          phone: '13687909090',
          roleCount: 2,
          bindPeople: '雷东宝',
          num: 3,
          enable: false
        }
      ],
      pageTotal: 100,
      pageSize: 0,
      currentPage: 1,
      showAddUser: false,
      showDeleteUser: false,
      showEditUser: false
    }
  },
  created () {
    this.selectedDept = this.deptTree[0]
  },
  methods: {
    // 搜索机构时触发
    institutionSearchChange () {},

    // 点击机构时触发
    deptTreeClick (item) {
      if (item === this.selectedDept) {
        // console.log('选择的机构与上一次相同')
        return
      }
      this.selectedDept.showSetting = false
      item.showSetting = true
      this.selectedDept = item
    },

    // 搜索用户时触发
    userUserClick () {},

    // 重置搜索项时触发
    userResetClick () {},

    // 多选时触发
    handleSelectionChange () {},

    // 查看人员时触发
    seeUserClick () {},

    // 重置密码时触发
    resetPasswordClick () {},

    // 切换分页时触发
    currentPageChange () {},

    // 添加用户时触发
    addUserClick () {
      this.showAddUser = true
    },

    // 添加用户确认时触发
    addUserConfirmClick () {
      this.showAddUser = false
    },

    // 添加用户取消时触发
    addUserCancelClick () {
      this.showAddUser = false
    },

    // 删除用户时触发
    deleteUserClick () {
      this.showDeleteUser = true
    },

    // 删除用户确认时触发
    deleteUserConfirmClick () {
      this.showDeleteUser = false
    },

    // 删除用户取消时触发
    deleteUserCancelClick () {
      this.showDeleteUser = false
    },

    // 修改用户时触发
    editUserClick (row) {
      this.showEditUser = true
    },

    // 修改用户确认时触发
    editUserConfirmClick () {
      this.showEditUser = false
    },

    // 修改用户取消时触发
    editUserCancelClick () {
      this.showEditUser = false
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
.left-div {
  float: left;
  width: 280px;
  height: 814px;
  background-color: #183157;
  margin-left: 30px;
  padding: 0 10px;
  .left-title {
    color: #ffffff;
    font-size: 16px;
    height: 42px;
    line-height: 42px;
  }
  .institution-search-input {
    width: 278px;
    margin-top: 4px;
    /deep/.el-input__inner {
      background: #09546d;
      border-color: #1eb0fc;
      border-radius: 0;
      color: white;
    }
    /deep/.el-icon-search {
      color: #c5f3ff;
    }
  }
  .dept-tree {
    height: 646px;
    overflow: auto;
    margin-top: 15px;
    background-color: transparent;
    color: #ffffff;
    /deep/.el-tree-node {
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
        content: url("../../assets/images/backgroundManagement/deptTreeUnfold.png");
      }
      .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
        // 展开
        content: url("../../assets/images/backgroundManagement/deptTreeFold.png");
      }
      .el-tree-node__expand-icon.is-leaf::before {
        display: none;
      }
    }
  }
}
.dept-btn {
  width: 18px;
  height: 18px;
  display: inline-block;
  vertical-align: middle;
  background: orange;
}
.right-div {
  height: 814px;
  background-color: #183157;
  margin-left: 360px;
  margin-right: 30px;
  padding: 0 14px;
  .right-title {
    color: #ffffff;
    font-size: 16px;
    height: 42px;
    line-height: 42px;
  }
  .search-tool {
    height: 34px;
    margin-top: 4px;
    .people-search-input {
      width: 450px;
      vertical-align: top;
      /deep/.el-input__inner {
        background: #09546d;
        border-color: #1eb0fc;
        border-radius: 0;
        color: white;
      }
    }
    .people-search-btn {
      width: 80px;
      height: 34px;
      display: inline-block;
      margin-left: 10px;
      background: -webkit-linear-gradient(top, #086384, #0b779e);
      font-size: 16px;
      line-height: 34px;
      color: #c5f3ff;
      text-align: center;
      vertical-align: top;
      cursor: pointer;
      .people-search-icon {
        margin-top: 5px;
      }
      .people-search-text {
        display: inline-block;
        vertical-align: top;
        margin-left: 5px;
      }
    }
    .people-reset-btn {
      width: 80px;
      height: 34px;
      display: inline-block;
      margin-left: 10px;
      background: -webkit-linear-gradient(top, #086384, #0b779e);
      font-size: 16px;
      line-height: 34px;
      color: #c5f3ff;
      text-align: center;
      cursor: pointer;
      .people-reset-icon {
        margin-top: 8px;
      }
      .people-reset-text {
        display: inline-block;
        vertical-align: top;
        margin-left: 5px;
      }
    }
  }
  .operate-table-tool {
    height: 53px;
    .selected-count {
      display: inline-block;
      margin-top: 18px;
      margin-left: 10px;
    }
    // .clean-btn {
    //   width: 32px;
    //   height: 20px;
    //   margin-top: 18px;
    //   margin-left: 30px;
    //   display: inline-block;
    //   color: #1d9fe5;
    //   font-size: 16px;
    //   border-bottom: solid 1px #1d9fe5;
    //   cursor: pointer;
    // }
    .delete-btn {
      float: right;
      width: 96px;
      height: 30px;
      margin-top: 10px;
      background-color: #ff0000;
      color: #ffffff;
      text-align: center;
      line-height: 30px;
      font-size: 16px;
      cursor: pointer;
    }
    .add-btn {
      float: right;
      margin-right: 12px;
      margin-top: 10px;
      width: 54px;
      height: 30px;
      background-color: #1eb0fc;
      color: #ffffff;
      text-align: center;
      line-height: 30px;
      font-size: 16px;
      cursor: pointer;
    }
  }
}
.el-table {
  color: #c5f3ff;
  font-size: 16px;
  background: transparent;
  border: none;
  /* 表格表头样式 */
  /deep/.el-table__header-wrapper th {
    color: #c5f3ff;
    font-size: 16px;
    height: 40px;
    padding: 0;
    background-color: rgba($color: #0b779e, $alpha: 0.66);
  }
  /* 表格每行高度*/
  /deep/.el-table__body td {
    height: 38px;
    padding: 0;
  }
  /* 每行的背景颜色 */
  /deep/.el-table__body td {
    background-color: transparent;
  }
  /* 所有单元格颜色、无边框 */
  /deep/td,
  /deep/tr,
  /deep/th {
    border: none;
    background-color: transparent;
  }
  /* 复选框样式 */
  /deep/.el-checkbox__inner {
    background-color: transparent;
    border-color: #c5f3ff;
    border-radius: 0px;
  }
  // /deep/.el-checkbox__input.is-checked {
  //   // background-color: #00cff9;
  //   border-radius: 2px;
  // }
  /*鼠标移入某行时的背景色*/
  /deep/tbody tr:hover > td {
    background-color: transparent;
  }
}
/* 去除表格底部线条 */
.el-table::before {
  height: 0px;
}
.table-btn {
  width: 46px;
  height: 26px;
  background-color: #0b779e;
  color: #fefefe;
  font-size: 14px;
  line-height: 26px;
  display: inline-block;
  cursor: pointer;
}
.table-btn-see {
  margin-left: 10px;
}
.table-btn-edit-password {
  margin-left: 10px;
  width: 67px;
}
</style>
