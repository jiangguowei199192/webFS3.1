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
          <span class="people-search-text">查询</span>
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
        class="manageTable"
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
            <div class="table-btn" @click="editUserClick(scope.row)">修改</div>
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
      @close="showAddUser = false"
      @confirmClick="addUserConfirmClick"
      @cancelClick="addUserCancelClick"
    ></AddUserDialog>

    <AddUserDialog
      :isShow.sync="showEditUser"
      title="修改用户"
      @close="showEditUser = false"
      @confirmClick="editUserConfirmClick"
      @cancelClick="editUserCancelClick"
    ></AddUserDialog>

    <DeleteDialog
      :isShow.sync="showDeleteUser"
      @close="showDeleteUser = false"
      @confirmClick="deleteUserConfirmClick"
      @cancelClick="showDeleteUser = false"
    ></DeleteDialog>

    <UserInfoDialog
      :isShow.sync="showUserInfo"
      @close="showUserInfo = false"
      @confirmClick="showUserInfo = false"
    ></UserInfoDialog>

    <ResetPasswordDialog
      :isShow.sync="showResetPassword"
      @close="showResetPassword = false"
      @confirmClick="resetPasswordConfirmClick"
      @cancelClick="showResetPassword = false"
    ></ResetPasswordDialog>
  </div>
</template>

<script>
import AddUserDialog from './components/addUserDialog.vue'
import DeleteDialog from './components/deleteDialog.vue'
import UserInfoDialog from './components/userInfoDialog.vue'
import ResetPasswordDialog from './components/resetPasswordDialog.vue'

export default {
  components: {
    AddUserDialog,
    DeleteDialog,
    UserInfoDialog,
    ResetPasswordDialog
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
            { deptName: '孝感市应急管理局', deptCode: '1-15' },
            { deptName: '孝感市应急管理局', deptCode: '1-16' },
            { deptName: '孝感市应急管理局', deptCode: '1-17' },
            { deptName: '孝感市应急管理局', deptCode: '1-18' },
            { deptName: '孝感市应急管理局', deptCode: '1-19' },
            { deptName: '孝感市应急管理局', deptCode: '1-20' },
            { deptName: '孝感市应急管理局', deptCode: '1-21' },
            { deptName: '孝感市应急管理局', deptCode: '1-22' }
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
        { username: 'syh', account: 'songyunhui', phone: '13687909090', roleCount: 3, bindPeople: '宋运辉', num: 2, enable: true },
        { username: 'syh', account: 'songyunhui', phone: '13687909090', roleCount: 3, bindPeople: '宋运辉', num: 2, enable: true },
        { username: 'syh', account: 'songyunhui', phone: '13687909090', roleCount: 3, bindPeople: '宋运辉', num: 2, enable: true },
        { username: 'syh', account: 'songyunhui', phone: '13687909090', roleCount: 3, bindPeople: '宋运辉', num: 2, enable: true },
        { username: 'syh', account: 'songyunhui', phone: '13687909090', roleCount: 3, bindPeople: '宋运辉', num: 2, enable: true },
        { username: 'syh', account: 'songyunhui', phone: '13687909090', roleCount: 3, bindPeople: '宋运辉', num: 2, enable: true },
        { username: 'syh', account: 'songyunhui', phone: '13687909090', roleCount: 3, bindPeople: '宋运辉', num: 2, enable: true },
        { username: 'syh', account: 'songyunhui', phone: '13687909090', roleCount: 3, bindPeople: '宋运辉', num: 2, enable: true },
        { username: 'syh', account: 'songyunhui', phone: '13687909090', roleCount: 3, bindPeople: '宋运辉', num: 2, enable: true },
        { username: 'syh', account: 'songyunhui', phone: '13687909090', roleCount: 3, bindPeople: '宋运辉', num: 2, enable: true },
        { username: 'syh', account: 'songyunhui', phone: '13687909090', roleCount: 3, bindPeople: '宋运辉', num: 2, enable: true },
        { username: 'syh', account: 'songyunhui', phone: '13687909090', roleCount: 3, bindPeople: '宋运辉', num: 2, enable: true },
        { username: 'syh', account: 'songyunhui', phone: '13687909090', roleCount: 3, bindPeople: '宋运辉', num: 2, enable: true },
        { username: 'syh', account: 'songyunhui', phone: '13687909090', roleCount: 3, bindPeople: '宋运辉', num: 2, enable: true },
        { username: 'syh', account: 'songyunhui', phone: '13687909090', roleCount: 3, bindPeople: '宋运辉', num: 2, enable: true },
        { username: 'syh', account: 'songyunhui', phone: '13687909090', roleCount: 3, bindPeople: '宋运辉', num: 2, enable: true },
        { username: 'syh', account: 'songyunhui', phone: '13687909090', roleCount: 3, bindPeople: '宋运辉', num: 2, enable: true },
        { username: 'syh', account: 'songyunhui', phone: '13687909090', roleCount: 3, bindPeople: '宋运辉', num: 2, enable: true },
        { username: 'syh', account: 'songyunhui', phone: '13687909090', roleCount: 3, bindPeople: '宋运辉', num: 2, enable: true },
        { username: 'syh', account: 'songyunhui', phone: '13687909090', roleCount: 3, bindPeople: '宋运辉', num: 2, enable: true }
      ],
      pageTotal: 100,
      pageSize: 0,
      currentPage: 1,
      showAddUser: false,
      showDeleteUser: false,
      showEditUser: false,
      showUserInfo: false,
      showResetPassword: false
    }
  },
  created () {
    this.selectedDept = this.deptTree[0]
  },
  methods: {
    // 搜索机构时触发
    institutionSearchChange () {},

    // 搜索用户时触发
    userUserClick () {},

    // 重置搜索项时触发
    userResetClick () {},

    // 多选时触发
    handleSelectionChange () {},

    // 查看人员时触发
    seeUserClick (row) {
      this.showUserInfo = true
    },

    // 重置密码时触发
    resetPasswordClick (row) {
      this.showResetPassword = true
    },

    // 重置密码确认时触发
    resetPasswordConfirmClick () {
      this.showResetPassword = false
    },

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
    height: 696px;
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

.right-div {
  min-width: 800px;
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
