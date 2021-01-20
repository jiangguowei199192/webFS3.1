<template>
  <div>
    <el-dialog
      :visible.sync="isShow"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="480px"
      class="add-people-dlg"
    >
      <div class="add-people-header">
        <div class="header-icon"></div>
        <div class="header-text">{{ title }}</div>
      </div>
      <el-form
        ref="adduserRef"
        :model="addUserForm"
        :rules="addUserRules"
        :inline="true"
        label-width="80px"
        class="add-people-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input
            v-model="addUserForm.account"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="addUserForm.phone" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="用户层级" prop="dept">
          <el-cascader
            v-model="addUserForm.dept"
            :options="deptTree"
            :props="{
              expandTrigger: 'hover',
              label: 'deptName',
              value: 'deptCode',
            }"
            :show-all-levels="false"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="关联角色" prop="roles">
          <el-select
            v-model="addUserForm.roles"
            :popper-append-to-body="false"
            placeholder="请选择"
            multiple
            class="role-sel"
          >
            <el-option
              v-for="item in roleTypes"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户状态" prop="status">
          <el-select
            v-model="addUserForm.status"
            :popper-append-to-body="false"
            placeholder="请选择"
          >
            <el-option
              v-for="item in userStatusTypes"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="到期时间" prop="dueToTime">
          <el-date-picker
            v-model="addUserForm.dueToTime"
            type="date"
            placeholder="请选择"
            style="width: 150px"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="排序" prop="num">
          <el-input v-model="addUserForm.num" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="绑定人员" prop="people">
          <el-select
            v-model="addUserForm.people"
            :popper-append-to-body="false"
            placeholder="请选择"
          >
            <el-option
              v-for="item in bindPeopleTypes"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="confirm-tool">
        <div class="confirm-btn" @click="confirmClick">确定</div>
        <div class="cancel-btn" @click="cancelClick">取消</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },
  data () {
    return {
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
      addUserForm: {
        username: '',
        account: '',
        phone: '',
        dept: '',
        roles: '',
        status: '',
        dueToTime: '',
        num: '',
        people: ''
      },
      addUserRules: {
        username: [{ required: true, message: '请输入' }],
        account: [{ required: true, message: '请输入' }],
        status: [{ required: true, message: '请选择' }]
      },
      roleTypes: [
        { id: 1, label: '角色1' },
        { id: 2, label: '角色2' },
        { id: 3, label: '角色3' }
      ],
      userStatusTypes: [
        { id: 1, label: '有效' },
        { id: 2, label: '无效' }
      ],
      bindPeopleTypes: [
        { id: 1, label: '宋运辉' },
        { id: 2, label: '雷东宝' },
        { id: 3, label: '二傻子' }
      ]
    }
  },
  methods: {
    confirmClick () {
      this.$emit('confirmClick')
    },

    cancelClick () {
      this.$emit('cancelClick')
    }
  }
}
</script>

<style lang="scss" scoped>
.add-people-dlg.el-dialog__wrapper {
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
    .add-people-form {
      margin-top: 35px;
      .el-input__inner {
        background-color: rgba($color: #09546d, $alpha: 0.3);
        border-color: #1eb0fc;
        border-radius: 0;
        width: 150px;
        height: 24px;
        color: #fff;
        font-size: 12px;
      }
      .role-sel {
        .el-input__inner {
          width: 390px;
        }
      }
      .el-form-item {
        margin-top: -20px;
      }
      .el-form-item__label {
        color: #fff;
        font-size: 12px;
      }
      .el-form-item__error {
        margin-top: -10px;
      }
    }
    .note {
      margin-top: 20px;
      font-size: 12px;
      color: rgba($color: #fff, $alpha: 0.6);
    }
    .confirm-tool {
      height: 50px;
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
