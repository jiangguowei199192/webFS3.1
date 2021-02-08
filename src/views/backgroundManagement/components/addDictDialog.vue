<!--
 * @Descripttion: 出来混迟早是要还的
 * @version: v_2.0
 * @Author: liangkaiLee
 * @Date: 2021-01-26 09:16:43
 * @LastEditors: liangkaiLee
 * @LastEditTime: 2021-02-08 10:44:43
-->
<template>
  <el-dialog
    :visible.sync="isShow"
    :close-on-click-modal="false"
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
          :readonly="isDisabled"
          :disabled="isDisabled"
        ></el-input>
      </el-form-item>
      <el-form-item label="类型码 :" prop="code">
        <el-input
          v-model="addDictForm.code"
          :placeholder="placeholder"
          :readonly="isDisabled"
          :disabled="isDisabled"
        ></el-input>
      </el-form-item>
      <el-form-item label="状态 :" prop="status">
        <el-select
          v-model="addDictForm.status"
          :popper-append-to-body="false"
          placeholder="请选择"
          :disabled="isDisabled"
        >
          <el-option
            v-for="item in statusType"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序 :" prop="order">
        <el-input
          v-model="addDictForm.order"
          :placeholder="placeholder"
          :readonly="isDisabled"
          :disabled="isDisabled"
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
            v-if="!isDisabled"
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
          :readonly="isDisabled"
          :disabled="isDisabled"
        ></el-input>
      </el-form-item>
    </el-form>
    <!-- 操作信息log -->
    <div class="handelNote" v-if="handelType == 'checkParentDict'">
      <div>
        <span>创建时间：{{ addDictForm.createTime }}</span>
        <span>创建人：{{ addDictForm.createUserName }}</span>
      </div>
      <div style="margin-top: 15px">
        <span>最后修改时间：{{ addDictForm.updateTime }}</span>
        <span>最后修改人：{{ addDictForm.updateUserName }}</span>
      </div>
    </div>
    <div v-if="handelType == 'checkParentDict'" class="handelBtns">
      <span
        style="margin-right: 190px;"
        @click.stop="cancelClick('addDictForm')"
        >关闭</span
      >
    </div>
    <div v-else class="handelBtns">
      <span @click.stop="cancelClick('addDictForm')">取消</span>
      <span @click.stop="confirmClick('addDictForm')">确定</span>
    </div>
  </el-dialog>
</template>

<script>
import { isNotNull, numberValidate } from '@/utils/formRules'
import { EventBus } from '@/utils/eventBus.js'

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
    },
    dictInfo: {
      type: Object,
      required: false
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
        icon: '',
        note: '',
        createTime: '',
        createUserName: '',
        updateTime: '',
        updateUserName: ''
      },
      addDictRules: {
        name: isNotNull('请输入类型名称'),
        code: isNotNull('请输入类型码'),
        status: isNotNull('请选择状态'),
        order: numberValidate('输入必须为数字')
      },
      statusType: [
        {
          id: 0,
          label: '0'
        },
        {
          id: 1,
          label: '1'
        }
      ],
      handelType: '',
      isDisabled: false
    }
  },

  watch: {
    dictInfo (info) {
      if (!info) return false
      else {
        this.addDictForm.name = info.typeName
        this.addDictForm.code = info.typeCode
        this.addDictForm.status = info.status
        this.addDictForm.order = info.orderNum
        this.addDictForm.icon = info.icon
        this.addDictForm.note = info.remark
        this.addDictForm.createTime = info.createTime
        this.addDictForm.createUserName = info.createUserName
        this.addDictForm.updateTime = info.updateTime
        this.addDictForm.updateUserName = info.updateUserName
      }
    }
  },

  created () {
    const _this = this
    EventBus.$on('handelType', data => {
      _this.handelType = data
      if (_this.handelType === 'checkParentDict') this.isDisabled = true
    })
  },

  methods: {
    confirmClick (formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return
        }
        this.$emit('confirmClick', this.addDictForm)
      })
    },

    cancelClick (formName) {
      this.$refs[formName].resetFields()
      // this.addDictForm = {}
      this.handelType = ''
      this.isDisabled = false
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
    .handelNote {
      margin-top: 20px;
      font-size: 12px;
      color: rgba($color: #fff, $alpha: 0.7);
      div {
        display: flex;
        justify-content: space-around;
      }
    }
    .handelBtns {
      margin-right: 0;
      span {
        background: #1eb0fc;
        color: #fff;
      }
    }
  }
}
</style>
