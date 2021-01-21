<template>
  <el-dialog
    :visible="isShow"
    :close-on-click-modal="false"
    @close="$emit('close')"
    width="540px"
    class="people-info-dlg"
  >
    <div class="add-people-header">
      <div class="header-icon"></div>
      <div class="header-text">查看用户信息</div>
    </div>
    <el-form
      :model="peopleInfoForm"
      :inline="true"
      label-width="80px"
      class="add-people-form"
    >
      <el-form-item label="用户名:" prop="username">
        <div class="subtext1">{{ peopleInfoForm.username }}</div>
      </el-form-item>
      <el-form-item label="账号:" prop="account">
        <div class="subtext1">{{ peopleInfoForm.account }}</div>
      </el-form-item>
      <el-form-item label="联系方式:" prop="phone">
        <div class="subtext1">{{ peopleInfoForm.phone }}</div>
      </el-form-item>
      <el-form-item label="用户层级:" prop="dept">
        <div class="subtext1">{{ peopleInfoForm.dept }}</div>
      </el-form-item>
      <el-form-item label="关联角色:" prop="roles">
        <div class="subtext1">{{ peopleInfoForm.roles }}</div>
      </el-form-item>
      <el-form-item label="用户状态:" prop="status">
        <div class="subtext1">{{ peopleInfoForm.status }}</div>
      </el-form-item>
      <el-form-item label="到期时间:" prop="dueToTime">
        <div class="subtext1">{{ peopleInfoForm.dueToTime }}</div>
      </el-form-item>
      <el-form-item label="排序:" prop="num">
        <div class="subtext1">{{ peopleInfoForm.num }}</div>
      </el-form-item>
      <el-form-item label="绑定人员:" prop="people">
        <div class="subtext1">{{ peopleInfoForm.people }}</div>
      </el-form-item>
    </el-form>
    <div class="note">
      <div>
        <span>创建时间：11111111111111</span>
        <span style="display: inline-block; margin-left: 20px"
          >创建人：2222</span
        >
      </div>
      <div style="margin-top: 10px">
        <span>最后修改时间：3333333333333333</span>
        <span style="display: inline-block; margin-left: 20px"
          >最后修改人：4444</span
        >
      </div>
    </div>
    <div class="confirm-tool">
      <div class="confirm-btn" @click="confirmClick">关闭</div>
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
      peopleInfoForm: {
        username: 'syh',
        account: 'songyunhui',
        phone: '12322222222',
        dept: '东海化工',
        roles: '角色1、角色2、角色3',
        status: '有效',
        dueToTime: '2099-12-31',
        num: '02',
        people: '宋运辉'
      }
    }
  },
  methods: {
    confirmClick () {
      this.$emit('confirmClick')
    }
  }
}
</script>

<style lang="scss" scoped>
.people-info-dlg.el-dialog__wrapper {
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
      border-bottom: 1px solid rgba($color: #1eb0fc, $alpha: 0.6);
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
      margin-top: 20px;
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
