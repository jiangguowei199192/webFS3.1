<template>
  <el-dialog
    :visible="isShow"
    :close-on-click-modal="false"
    @close="$emit('close')"
    width="480px"
    class="add-role-dlg"
  >
    <div class="add-people-header">
      <div class="header-icon"></div>
      <div class="header-text">{{ title }}</div>
    </div>

    <el-form
      ref="addRoleRef"
      :model="addRoleFrom"
      :rules="addRoleRules"
      :inline="true"
      label-width="80px"
      class="add-people-form"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="addRoleFrom.roleName"></el-input>
      </el-form-item>

      <el-form-item label="角色状态" prop="status">
        <el-select
          v-model="addRoleFrom.status"
          :popper-append-to-body="false"
        >
          <el-option
            v-for="item in roleStatusOptions"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="排序" prop="num">
        <el-input v-model="addRoleFrom.num"></el-input>
      </el-form-item>

      <el-form-item label="备注" prop="note">
        <el-input
          v-model="addRoleFrom.note"
          type="textarea"
          resize="none"
        ></el-input>
      </el-form-item>
    </el-form>
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
    },
    title: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      addRoleFrom: {
        roleName: '',
        status: '',
        num: '',
        note: ''
      },
      addRoleRules: {
        roleName: [{ required: true, message: '请输入' }],
        status: [{ required: true, message: '请选择' }]
      },
      roleStatusOptions: [
        { id: 1, label: '在用' },
        { id: 2, label: '停用' }
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
.add-role-dlg.el-dialog__wrapper {
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
      .el-textarea__inner {
        background-color: rgba($color: #09546d, $alpha: 0.3);
        border-color: #1eb0fc;
        border-radius: 0;
        width: 390px;
        height: 78px;
        color: #fff;
        font-size: 12px;
        margin-top: 8px;
      }
      .subtext1 {
        color: #fff;
        font-size: 12px;
        width: 180px;
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
