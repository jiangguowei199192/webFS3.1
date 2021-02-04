<!--
 * @Descripttion: 出来混迟早是要还的
 * @version: v_2.0
 * @Author: liangkaiLee
 * @Date: 2021-01-26 09:16:43
 * @LastEditors: liangkaiLee
 * @LastEditTime: 2021-02-01 12:36:28
-->
<template>
  <el-dialog
    :visible.sync="isShow"
    :close-on-click-modal="false"
    @close="$emit('close')"
    width="480px"
    class="add-dict-dlg dialog-wrap"
  >
    <div class="add-dict-header">
      <div class="header-icon"></div>
      <div class="header-text">{{ title }}</div>
    </div>
    <el-form
      ref="addDictForm"
      :model="addDictForm"
      :rules="addDictRules"
      :inline="true"
      label-width="80px"
      class="add-dict-form"
    >
      <el-form-item label="类型名称 :" prop="name">
        <el-input
          v-model="addDictForm.name"
          :placeholder="placeholder"
          :readonly="disabled"
          :class="{ active: !disabled }"
        ></el-input>
      </el-form-item>
      <el-form-item label="类型码 :" prop="code">
        <el-input
          v-model="addDictForm.code"
          :placeholder="placeholder"
          :readonly="disabled"
          :class="{ active: !disabled }"
        ></el-input>
      </el-form-item>
      <el-form-item label="状态 :" prop="status">
        <el-input
          v-model="addDictForm.status"
          :placeholder="placeholder"
          :readonly="disabled"
          :class="{ active: !disabled }"
        ></el-input>
      </el-form-item>
      <el-form-item label="排序 :" prop="order">
        <el-input
          v-model="addDictForm.order"
          :placeholder="placeholder"
          :readonly="disabled"
          :class="{ active: !disabled }"
        ></el-input>
      </el-form-item>
      <el-form-item label="图标 :" prop="icon">
        <div class="iconTool">
          <el-avatar
            :size="30"
            :src="addDictForm.icon"
            style="margin-top: 5px"
          ></el-avatar>
          <el-popover
            placement="right"
            trigger="click"
            popper-class="iconPopover"
            v-model="showPopover"
            v-if="!disabled"
          >
            <div class="iconBox">
              <span class="close" @click.stop="showPopover = false"></span>
              <span
                class="icon"
                v-for="(item, index) in icons"
                :key="index"
                :style="{
                  background: 'url(' + serverUrl + item.path + ') no-repeat'
                }"
              ></span>
            </div>
            <div class="chooseBox" slot="reference">
              <el-image class="btn" :src="chooseIcon"></el-image>
              选择图标
            </div>
          </el-popover>
        </div>
      </el-form-item>
      <el-form-item label="备注 :" prop="note">
        <el-input
          v-model="addDictForm.note"
          placeholder="请输入"
          type="textarea"
          resize="none"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="handelBtns">
      <span @click.stop="cancelClick('addDictForm')">取消</span>
      <span @click.stop="confirmClick('addDictForm')">确定</span>
    </div>
  </el-dialog>
</template>

<script>
import { dataDictApi } from '@/api/dataDict'

export default {
  props: {
    isShow: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      placeholder: '请输入',
      showPopover: false,
      icons: [],
      chooseIcon: require('../../../assets/images/backgroundManagement/chooseIcon.png'),
      addDictForm: {
        name: '',
        code: '',
        status: '',
        order: '',
        icon:
          'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
        note: ''
      },
      addDictRules: {
        name: [{ required: true, message: '请输入类型名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入类型码', trigger: 'blur' }],
        status: [{ required: true, message: '请输入状态', trigger: 'blur' }]
      }
    }
  },
  methods: {
    confirmClick (formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) return
        const params = {
          typeName: this.addDictForm.name,
          typeCode: this.addDictForm.code,
          status: parseInt(this.addDictForm.status),
          orderNum: parseInt(this.addDictForm.order),
          parentId: parseInt(0),
          icon: this.addDictForm.icon,
          remark: this.addDictForm.note
        }
        this.$axios
          .post(dataDictApi.addDict, params)
          .then(res => {
            console.log('新增数据字典接口返回: ', res)
            if (res && res.data && res.data.code === 0) {
              this.$notify.success({
                title: '提示',
                message: '新增成功!',
                duration: 3 * 1000
              })
              setTimeout(() => {
                this.dialogVisible = false
              }, 300)
              this.addDictForm = {}
              return
            }
            this.$notify.warning({
              title: '提示',
              message: '新增失败!',
              duration: 3 * 1000
            })
          })
          .catch(err => {
            console.log('接口错误: ' + err)
          })
      })
      // this.$emit('confirmClick')
    },

    cancelClick (formName) {
      this.$refs[formName].resetFields()

      this.$emit('update:isShow', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.add-dict-dlg.el-dialog__wrapper {
  background-color: rgba($color: #000, $alpha: 0.5);
  /deep/.el-dialog {
    .add-dict-form {
      margin-top: 30px;
      .el-input__inner {
        background-color: rgba($color: #09546d, $alpha: 0.3);
        border-color: #1eb0fc;
        border-radius: 0;
        width: 390px;
        height: 28px;
        color: #fff;
        font-size: 12px;
      }
      .el-form-item {
        display: block;
        margin: -15px 0 25px 0;
      }
      .el-form-item__label {
        color: #fff;
        font-size: 12px;
      }
      .el-form-item__error {
        margin-top: -5px;
      }
      .el-textarea__inner {
        background-color: rgba($color: #09546d, $alpha: 0.3);
        border-color: #1eb0fc;
        border-radius: 0;
        width: 390px;
        height: 85px;
        color: #fff;
        font-size: 12px;
        margin-top: 8px;
      }
    }
    .handelBtns {
      margin-right: 0;
    }
  }
}
</style>
