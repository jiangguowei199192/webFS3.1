<template>
  <div>
    <ResDialog :title="title" :isShow.sync="isShow">
      <div slot="content" class="slotContent imgScroll">
        <div class="pTitle">
          <span></span>
          <span>点资源信息</span>
        </div>
        <el-form
          ref="pointForm"
          :model="resForm"
          :inline="true"
          label-width="90px"
          class="pointform"
          :rules="formRules"
        >
          <el-form-item label="资源名称 :" prop="name">
            <el-input
              v-model="resForm.name"
              :placeholder="placeholder"
              :readonly="disabled"
              :class="{ active: !disabled }"
            ></el-input>
          </el-form-item>
          <el-form-item label="资源地址 :" prop="addr">
            <el-input
              v-model="resForm.addr"
              :placeholder="placeholder"
              :readonly="disabled"
              :class="{ active: !disabled }"
            ></el-input>
          </el-form-item>
          <el-form-item label="资源类型 :" prop="type">
            <el-select
              v-model="resForm.type"
              :popper-append-to-body="false"
              :placeholder="placeholder2"
              :class="{ active: !disabled }"
              :disabled="disabled"
            >
              <el-option
                v-for="item in resTypes"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系电话 :">
            <el-input
              v-model="resForm.phone"
              :placeholder="placeholder"
              :readonly="disabled"
              :class="{ active: !disabled }"
            ></el-input>
          </el-form-item>
          <el-form-item label="所属机构 :" prop="organ">
            <el-select
              v-model="resForm.organ"
              :popper-append-to-body="false"
              :placeholder="placeholder2"
              :class="{ active: !disabled }"
              :disabled="disabled"
            >
              <el-option
                v-for="item in organs"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属辖区 :">
            <el-select
              v-model="resForm.area"
              :popper-append-to-body="false"
              :placeholder="placeholder2"
              :class="{ active: !disabled }"
              :disabled="disabled"
            >
              <el-option
                v-for="item in areas"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="经度 :" prop="lon">
            <el-input
              v-model="resForm.lon"
              :placeholder="placeholder"
              :readonly="disabled"
              :class="{ active: !disabled }"
            ></el-input>
          </el-form-item>
          <el-form-item label="纬度 :" prop="lat">
            <el-input
              v-model="resForm.lat"
              :placeholder="placeholder"
              :readonly="disabled"
              :class="{ active: !disabled }"
            ></el-input>
          </el-form-item>
          <el-form-item label="管理人员 :">
            <el-input
              v-model="resForm.people"
              :placeholder="placeholder"
              :readonly="disabled"
              :class="{ active: !disabled }"
            ></el-input>
          </el-form-item>
          <el-form-item label="人员电话 :">
            <el-input
              v-model="resForm.mobile"
              :placeholder="placeholder"
              :readonly="disabled"
              :class="{ active: !disabled }"
            ></el-input>
          </el-form-item>
          <el-form-item label="图标 :" style="line-height: 40px" prop="icon">
            <div class="iconTool">
              <el-avatar
                :size="30"
                :src="resForm.icon"
                style="margin-top: 5px"
              ></el-avatar>
              <el-popover
                placement="top"
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
                      background:
                        'url(' + serverUrl + item.path + ') no-repeat',
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
          <el-form-item label="排序 :">
            <el-input
              v-model="resForm.sort"
              :placeholder="placeholder"
              :readonly="disabled"
              :class="{ active: !disabled }"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注 :">
            <el-input
              v-model="resForm.note"
              :placeholder="placeholder"
              type="textarea"
              resize="none"
              :readonly="disabled"
              :class="{ active: !disabled }"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="boundary">
          <div class="pTitle" style="margin-top: 20px">
            <span></span>
            <span>管控范围信息</span>
          </div>
          <template v-for="(item, index) in ctlAreas">
            <el-form
              :key="index"
              :model="item"
              :inline="true"
              label-width="90px"
              :rules="areaRules"
              style="margin-top: 17px; margin-bottom: 20px"
            >
              <el-form-item label="名称 :" prop="name">
                <el-input
                  v-model="item.name"
                  :placeholder="placeholder"
                  :readonly="disabled"
                  :class="{ active: !disabled }"
                ></el-input>
              </el-form-item>
              <el-form-item label="类型 :">
                <el-select
                  v-model="item.type"
                  :popper-append-to-body="false"
                  :placeholder="placeholder2"
                  :class="{ active: !disabled }"
                  :disabled="disabled"
                >
                  <el-option
                    v-for="item in resTypes"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属机构 :" prop="organ">
                <el-select
                  v-model="item.organ"
                  :popper-append-to-body="false"
                  :placeholder="placeholder2"
                  :class="{ active: !disabled }"
                  :disabled="disabled"
                >
                  <el-option
                    v-for="item in organs"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="线宽 :">
                <el-input-number
                  v-if="!disabled"
                  v-model="item.lineWidth"
                  :min="1"
                  :max="10"
                ></el-input-number>
                <span v-else>{{ item.lineWidth }}</span>
              </el-form-item>
              <el-form-item label="线段颜色 :" prop="lineColor">
                <el-color-picker
                  v-model="item.lineColor"
                  show-alpha
                  :disabled="disabled"
                ></el-color-picker>
              </el-form-item>
              <el-form-item label="填充颜色 :" prop="fillColor">
                <el-color-picker
                  v-model="item.fillColor"
                  show-alpha
                  :disabled="disabled"
                ></el-color-picker>
              </el-form-item>
              <el-form-item label="备注 :">
                <el-input
                  v-model="item.note"
                  :placeholder="placeholder"
                  type="textarea"
                  resize="none"
                  :readonly="disabled"
                  :class="{ active: !disabled }"
                ></el-input>
              </el-form-item>
            </el-form>
          </template>
        </div>
      </div>
    </ResDialog>
  </div>
</template>

<script>
import ResDialog from './resDialog.vue'
export default {
  props: {
    // 是否禁止编辑
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      placeholder: '请输入',
      placeholder2: '请选择',
      color1: '',
      color2: '',
      icons: [],
      chooseIcon: require('../../../assets/images/backgroundManagement/chooseIcon.png'),
      title: '新增点资源',
      isShow: false,
      organs: [],
      areas: [],
      resTypes: [],
      showPopover: false,
      ctlAreas: [
        {
          name: '',
          type: '',
          organ: '',
          lineWidth: '',
          note: '',
          lineColor: '',
          fillColor: ''
        }
      ], // 管辖范围
      areaRules: {
        name: [{ required: true, message: '请输入名称' }],
        lineColor: [{ required: true, message: '请选择线段颜色' }],
        organ: [{ required: true, message: '请选择所属机构' }],
        fillColor: [{ required: true, message: '请选择填充颜色' }]
      },
      formRules: {
        name: [{ required: true, message: '请输入资源名称' }],
        addr: [{ required: true, message: '请输入资源地址' }],
        type: [{ required: true, message: '请选择资源类型' }],
        organ: [{ required: true, message: '请选择所属机构' }],
        icon: [{ required: true, message: '请选择图标' }],
        lat: [{ required: true, message: '请输入纬度' }],
        lon: [{ required: true, message: '请输入经度' }]
      },
      resForm: {
        name: '11111',
        addr: '',
        type: '',
        phone: '',
        organ: '',
        area: '',
        lon: '',
        lat: '',
        people: '',
        mobile: '',
        sort: '',
        note: '',
        icon:
          'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
      }
    }
  },
  watch: {
    disabled (val) {
      this.placeholder = val ? '' : '请输入'
      this.placeholder2 = val ? '' : '请选择'
    }
  },
  components: {
    ResDialog
  },
  methods: {
    /**
     *  添加资源
     */
    addRes () {
      this.isShow = true
    }
  }
}
</script>

<style lang="scss" scoped>
.slotContent::-webkit-scrollbar {
  width: 4px;
}
.slotContent::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 4px;
  background: #1eb0fc;
}
.slotContent::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  background: transparent;
}

.slotContent {
  overflow-y: auto;
  width: 100%;
  height: 100%;
  .pTitle {
    width: 455px;
    height: 34px;
    box-sizing: border-box;
    margin-left: 12px;
    border-bottom: 1px solid #00ccff;
    span:nth-child(1) {
      display: inline-block;
      width: 21px;
      height: 16px;
      background-image: url("../../../assets/images/fire_title.png");
      margin-right: 10px;
      position: relative;
      top: 3px;
    }
    span:nth-child(2) {
      line-height: 34px;
      color: #fff;
      font-size: 14px;
    }
  }
  /deep/.el-form-item__label {
    font-size: 12px;
    color: #fff;
    line-height: 40px;
  }
  /deep/ .el-form-item__content {
    font-size: 12px;
    line-height: 40px;
    padding: 0px 3px 0px 0px;
  }
  /deep/.el-form-item {
    margin-bottom: 0px;
    margin-right: 0px;
  }
  /deep/.el-input__inner {
    background: transparent;
    border-radius: 0px;
    border: none;
    width: 150px;
    height: 24px;
    color: #fff;
    padding: 0px;
  }
  /deep/.el-form-item__error {
    margin-top: -10px;
  }
  /deep/.active .el-input__inner {
    border: 1px solid #209cdf;
    background: rgba(9, 84, 109, 0.3);
    padding: 0px 15px;
  }
  /deep/ .el-textarea__inner {
    background: transparent;
    border-radius: 0px;
    border: none;
    width: 390px;
    height: 78px;
    color: #fff;
    font-size: 12px;
    padding: 0px;
    position: relative;
    top: 10px;
  }
  /deep/ .el-textarea.active .el-textarea__inner {
    border: 1px solid #1eb0fc;
    background: rgba(9, 84, 109, 0.3);
    padding: 5px 15px;
    top: 0px;
  }
  /deep/.el-select .el-input.is-disabled {
    .el-input__inner,
    .el-input__icon {
      cursor: default;
    }
    .el-icon-arrow-up:before {
      content: "";
    }
  }
  .pointform {
    margin-top: 17px;
    .iconTool {
      display: inline-block;
      height: 40px;
      vertical-align: middle;
      margin-bottom: 11px;
      width: 150px;
      .chooseBox {
        display: inline-block;
        width: 86px;
        height: 24px;
        border: 1px solid #1ea7f0;
        color: #fff;
        font-size: 12px;
        line-height: 24px;
        vertical-align: top;
        margin-left: 8px;
        margin-right: 24px;
        margin-top: 8px;
        cursor: pointer;
        .btn {
          width: 12px;
          height: 12px;
          margin-left: 10px;
          margin-top: 6px;
          vertical-align: top;
        }
      }
    }
  }
  .boundary {
    /deep/ .el-input-number {
      width: 96px;
      height: 24px;
      line-height: 24px;
      .el-input-number__decrease,
      .el-input-number__increase {
        top: 1px;
        width: 24px;
        height: auto;
        background: #00a0e9;
        color: #fff;
        font-size: 13px;
      }
      .el-input-number__decrease {
        top: 0;
        left: 0;
        border-right: none;
      }
      .el-input-number__increase {
        right: 0;
        top: 0;
        border-left: none;
      }
      .el-input__inner {
        width: 48px;
        height: 24px;
        border: 1px solid #00a0e9;
        background: transparent;
        margin-left: 24px;
        margin-right: 24px;
        box-sizing: border-box;
        padding: 0px;
      }
    }
    /deep/.el-color-picker {
      height: 24px;
      margin-top: 5px;
      .el-color-picker__trigger {
        width: 150px;
        height: 24px;
        border: 1px solid #1eb0fc;
        border-radius: 0px;
        padding: 0px;
        .el-icon-arrow-down:before {
          display: none;
        }
      }
    }
    /deep/.el-color-picker.is-disabled {
      .el-color-picker__mask,
      .el-icon-close:before {
        display: none;
      }
      .el-color-picker__trigger {
        border: none;
        cursor: default;
      }
    }
  }
}
</style>
