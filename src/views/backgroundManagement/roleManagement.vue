<template>
  <div>
    <div class="title">用户权限 / 角色管理</div>
    <div class="base-div">
      <div class="right-title">角色列表</div>
      <div class="search-tool">
        <div class="role-status-text" style="margin-left:10px;">角色状态</div>
        <el-select v-model="roleStatusSearch" class="role-status-select">
          <el-option
            v-for="item in roleStatusOptions"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          ></el-option>
        </el-select>

        <div class="role-status-text" style="margin-left:20px;">是否授权</div>
        <el-select v-model="authorizationSearch" class="role-status-select">
          <el-option
            v-for="item in authorizationOptions"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          ></el-option>
        </el-select>

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
        <div class="add-btn" @click="addRoleClick">添加</div>
      </div>
      <el-table
        class="manageTable"
        :data="roleList"
        empty-text="暂无数据"
        height="630"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column
          label="角色名称"
          prop="roleName"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="关联用户数"
          prop="userCount"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="角色状态"
          prop="status"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="是否授权"
          prop="authorization"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="排序"
          prop="num"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="210">
          <template slot-scope="scope">
            <div class="table-btn" @click="editRoleClick(scope.row)">修改</div>
            <div
              class="table-btn"
              style="margin-left: 10px;width: 76px;"
              @click="authorizationClick(scope.row)"
            >
              角色授权
            </div>
            <div
              class="table-btn"
              style="margin-left: 10px;"
              @click="seeRoleClick(scope.row)"
            >
              查看
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

    <AddRoleDialog
      :isShow.sync="showAddRole"
      title="新增角色"
      @close="showAddRole = false"
      @confirmClick="addRoleConfirmClick"
      @cancelClick="showAddRole = false"
    ></AddRoleDialog>

    <AddRoleDialog
      :isShow.sync="showEditRole"
      title="修改角色"
      @close="showEditRole = false"
      @confirmClick="editRoleConfirmClick"
      @cancelClick="showEditRole = false"
    ></AddRoleDialog>

    <DeleteDialog
      :isShow.sync="showDeleteRole"
      @close="showDeleteRole = false"
      @confirmClick="deleteUserConfirmClick"
      @cancelClick="showDeleteRole = false"
    ></DeleteDialog>

    <RoleInfoDialog
      :isShow.sync="showRoleInfo"
      @close="showRoleInfo = false"
      @confirmClick="showRoleInfo = false"
    ></RoleInfoDialog>

    <RoleAuthDialog
      :isShow="showAuthorization"
      @close="showAuthorization = false"
      @confirmClick="showAuthorization = false"
      @cancelClick="showAuthorization = false"
    ></RoleAuthDialog>
  </div>
</template>

<script>
import AddRoleDialog from './components/addRoleDialog.vue'
import DeleteDialog from './components/deleteDialog.vue'
import RoleInfoDialog from './components/roleInfoDialog.vue'
import RoleAuthDialog from './components/roleAuthorizationDialog.vue'

export default {
  components: {
    AddRoleDialog,
    DeleteDialog,
    RoleInfoDialog,
    RoleAuthDialog
  },
  data () {
    return {
      userSearchIcon: require('../../assets/images/backgroundManagement/searchIcon.png'),
      peopleResetIcon: require('../../assets/images/backgroundManagement/resetIcon.png'),

      roleStatusSearch: '',
      roleStatusOptions: [
        { id: 1, label: '全部' },
        { id: 2, label: '在用' },
        { id: 3, label: '停用' }
      ],
      authorizationSearch: '',
      authorizationOptions: [
        { id: 1, label: '全部' },
        { id: 2, label: '已授权' },
        { id: 3, label: '未授权' }
      ],
      userSearch: '',
      roleList: [
        { roleName: '角色1', userCount: 10, status: '在用', authorization: '已授权', num: 2 },
        { roleName: '角色1', userCount: 10, status: '在用', authorization: '已授权', num: 2 },
        { roleName: '角色1', userCount: 10, status: '在用', authorization: '已授权', num: 2 },
        { roleName: '角色1', userCount: 10, status: '在用', authorization: '已授权', num: 2 },
        { roleName: '角色1', userCount: 10, status: '在用', authorization: '已授权', num: 2 }
      ],
      pageTotal: 100,
      pageSize: 0,
      currentPage: 1,
      showAddRole: false,
      showDeleteRole: false,
      showEditRole: false,
      showAuthorization: false,
      showRoleInfo: false
    }
  },
  methods: {
    // 搜索用户时触发
    userUserClick () {},

    // 重置搜索项时触发
    userResetClick () {},

    // 多选时触发
    handleSelectionChange () {},

    // 角色授权时触发
    authorizationClick (row) {
      this.showAuthorization = true
    },

    // 查看角色时触发
    seeRoleClick (row) {
      this.showRoleInfo = true
    },

    // 切换分页时触发
    currentPageChange () {},

    // 添加角色时触发
    addRoleClick () {
      this.showAddRole = true
    },

    // 添加角色确认时触发
    addRoleConfirmClick () {
      this.showAddRole = false
    },

    // 删除角色时触发
    deleteUserClick () {
      this.showDeleteRole = true
    },

    // 删除角色确认时触发
    deleteUserConfirmClick () {
      this.showDeleteRole = false
    },

    // 修改角色时触发
    editRoleClick (row) {
      this.showEditRole = true
    },

    // 修改角色确认时触发
    editRoleConfirmClick () {
      this.showEditRole = false
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
  height: 814px;
  background-color: #183157;
  margin-left: 30px;
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
    .role-status-text {
      color: #fff;
      display: inline-block;
      font-size: 16px;
    }
    .role-status-select {
      width: 150px;
      margin-left: 17px;
      vertical-align: top;
      /deep/.el-input__inner {
        background: #09546d;
        border-color: #1eb0fc;
        border-radius: 0;
        color: white;
      }
    }
    .people-search-input {
      width: 450px;
      vertical-align: top;
      margin-left: 10px;
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

</style>
