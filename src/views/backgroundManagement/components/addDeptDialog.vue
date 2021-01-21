<template>
  <el-dialog
    :visible="isShow"
    :close-on-click-modal="false"
    @close="$emit('close')"
    width="1080px"
    class="add-dept-dlg"
  >
    <div class="add-dept-div">
      <gMap
        ref="gduMap"
        handleType="devMap"
        :bShowAllTools="false"
        :baseMapIndex="2"
        class="map-tool"
      ></gMap>
      <div class="add-dept-header">
        <div class="header-icon"></div>
        <div class="header-text">新增机构</div>
      </div>
      <transition name="showUnfoldBtn">
        <div
          class="unfold-btn"
          @click="unfoldClick"
          v-show="showUnfoldBtn"
        ></div>
      </transition>
      <transition name="hideCourseList">
        <div class="add-dept-base" v-show="showDeptContent">
          <div class="fold-tool">
            <div class="fold-btn" @click="foldClick"></div>
          </div>
          <div class="add-dept-content">
            <div class="content-header">
              <div class="icon"></div>
              <div class="text">机构信息</div>
            </div>
            <el-form
              ref="addDeptRef"
              :model="addDeptForm"
              :rules="addDeptRules"
              :inline="true"
              label-width="80px"
              class="add-dept-form"
            >
              <el-form-item label="机构名称" prop="deptName">
                <el-input
                  v-model="addDeptForm.deptName"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              <el-form-item label="机构地址" prop="address">
                <el-input
                  v-model="addDeptForm.address"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              <el-form-item label="上级机构" prop="fatherDept">
                <el-cascader
                  v-model="addDeptForm.fatherDept"
                  :options="deptTree"
                  :props="{
                    expandTrigger: 'hover',
                    label: 'deptName',
                    value: 'deptCode',
                  }"
                  :show-all-levels="false"
                ></el-cascader>
              </el-form-item>
              <el-form-item label="机构电话">
                <el-input
                  v-model="addDeptForm.phone"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              <el-form-item label="机构编码">
                <el-input
                  v-model="addDeptForm.deptCode"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              <el-form-item label="机构简称">
                <el-input
                  v-model="addDeptForm.shortName"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              <el-form-item label="经度">
                <el-input
                  v-model="addDeptForm.longitude"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              <el-form-item label="纬度">
                <el-input
                  v-model="addDeptForm.latitude"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              <el-form-item label="机构状态">
                <el-select
                  v-model="addDeptForm.status"
                  :popper-append-to-body="false"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in deptStatusTypes"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="排序">
                <el-input
                  v-model="addDeptForm.num"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              <el-form-item label="图标">
                <div class="icon-tool">
                  <el-avatar :size="30" :src="deptIconUrl"></el-avatar>
                  <el-popover
                    placement="top"
                    trigger="click"
                    popper-class="iconPopover"
                    v-model="showPopover"
                  >
                    <div class="iconBox">
                      <span
                        class="close"
                        @click.stop="showPopover = false"
                      ></span>
                      <span
                        @click.stop="selectIcon(item)"
                        class="icon"
                        v-for="(item, index) in icons"
                        :key="index"
                        :style="{
                          background:
                            'url(' + serverUrl + item.path + ') no-repeat',
                        }"
                      ></span>
                    </div>
                    <div class="choose-icon-btn" slot="reference">
                      <el-image class="btn-icon" :src="chooseIcon"></el-image>
                      选择图标
                    </div>
                  </el-popover>
                </div>
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="addDeptForm.note"
                  placeholder="请输入"
                  type="textarea"
                  resize="none"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </transition>
      <div class="confirm-tool">
        <div class="confirm-btn" @click="confirmClick">确定</div>
        <div class="cancel-btn" @click="cancelClick">取消</div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import globalApi from '@/utils/globalApi'

export default {
  props: {
    isShow: {
      type: Boolean,
      required: true
    },
    deptTree: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      chooseIcon: require('../../../assets/images/backgroundManagement/chooseIcon.png'),
      deptIconUrl:
        'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      addDeptForm: {
        deptName: '',
        address: '',
        fatherDept: '',
        phone: '',
        deptCode: '',
        shortName: '',
        longitude: '',
        latitude: '',
        status: '',
        note: ''
      },
      addDeptRules: {
        deptName: [{ required: true, message: '请输入' }],
        address: [{ required: true, message: '请选择' }],
        fatherDept: [{ required: true, message: '请选择' }]
      },
      deptStatusTypes: [
        {
          id: 1,
          label: '再用'
        },
        {
          id: 2,
          label: '已注销'
        }
      ],
      showPopover: false,
      serverUrl: globalApi.headImg,
      icons: [
        {
          path: '/cloud-oneMap/combatEvent/1608349933941_1608349933941.png'
        },
        {
          path: '/cloud-oneMap/combatEvent/1608350408597_1608350408597.png'
        },
        {
          path: '/cloud-oneMap/combatEvent/1608350573010_1608350573010.png'
        },
        {
          path: '/cloud-oneMap/combatEvent/1608350504537_1608350504537.png'
        },
        {
          path: '/cloud-oneMap/combatEvent/1608350546000_1608350546000.png'
        },
        {
          path: '/cloud-oneMap/combatEvent/1608350378214_1608350378214.png'
        },
        {
          path: '/cloud-oneMap/combatEvent/1608350440076_1608350440076.png'
        },
        {
          path: '/cloud-oneMap/combatEvent/1608350478586_1608350478586.png'
        }
      ],
      showDeptContent: true,
      showUnfoldBtn: false
    }
  },
  methods: {
    confirmClick () {
      this.$emit('confirmClick')
    },

    cancelClick () {
      this.$emit('cancelClick')
    },

    // 选择图标
    selectIcon (item) {
      this.showPopover = false
      // this.curIcon = item.path
    },

    // 折叠
    foldClick () {
      this.showDeptContent = false
      this.showUnfoldBtn = true
    },

    // 展开
    unfoldClick () {
      this.showDeptContent = true
      this.showUnfoldBtn = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .add-dept-dlg.el-dialog__wrapper {
  /deep/.el-dialog {
    overflow: hidden;
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 0;
      width: 100%;
    }
    .add-dept-div {
      border: 1px solid #1eb0fc;
      background-color: #121e3a;
    }
    .map-tool {
      width: 100%;
      height: 617px;
    }
    .add-dept-header {
      background: -webkit-linear-gradient(
        top,
        rgba($color: #000, $alpha: 0.7),
        rgba($color: #000, $alpha: 0)
      );
      position: absolute;
      height: 100px;
      width: 100%;
      top: 1px;
      left: 1px;
      .header-icon {
        display: inline-block;
        width: 22px;
        height: 16px;
        background-image: url("../../../assets/images/fire_title.png");
        margin-top: 15px;
        margin-left: 18px;
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
    .unfold-btn {
      position: absolute;
      width: 23px;
      height: 100px;
      top: 272px;
      right: 0px;
      background-image: url("../../../assets/images/backgroundManagement/unfold.png");
      cursor: pointer;
    }
    .add-dept-base {
      position: absolute;
      width: 505px;
      height: 449px;
      top: 97px;
      right: 0px;
      .fold-tool {
        float: left;
        width: 23px;
        height: 100%;
        .fold-btn {
          position: absolute;
          width: 23px;
          height: 100px;
          top: 50%;
          margin-top: -50px;
          background-image: url("../../../assets/images/backgroundManagement/fold.png");
          cursor: pointer;
        }
      }
      .add-dept-content {
        float: right;
        width: 456px;
        height: 447px;
        border: 1px solid #1eb0fc;
        background-color: #121e3a;
        padding: 0 12px;
        .content-header {
          height: 33px;
          border-bottom: 1px solid #1eb0fc;
          .icon {
            display: inline-block;
            width: 22px;
            height: 16px;
            background-image: url("../../../assets/images/fire_title.png");
            margin-top: 10px;
          }
          .text {
            display: inline-block;
            vertical-align: top;
            margin-top: 8px;
            margin-left: 10px;
            font-size: 14px;
            color: #fff;
          }
        }
        .add-dept-form {
          margin-top: 35px;
          .el-input__inner {
            background-color: rgba($color: #09546d, $alpha: 0.3);
            border-color: #1eb0fc;
            border-radius: 0;
            width: 138px;
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
            width: 365px;
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
          .icon-tool {
            display: inline-block;
            height: 30px;
            vertical-align: middle;
            .choose-icon-btn {
              display: inline-block;
              width: 86px;
              height: 24px;
              border: 1px solid #1ea7f0;
              color: #fff;
              font-size: 12px;
              line-height: 24px;
              vertical-align: top;
              margin-left: 8px;
              margin-top: 3px;
              cursor: pointer;
              .btn-icon {
                width: 12px;
                height: 12px;
                margin-left: 10px;
                margin-top: 6px;
                vertical-align: top;
              }
            }
          }
        }
      }
    }
    .confirm-tool {
      height: 50px;
      margin-top: 20px;
      margin-right: 15px;
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

.hideCourseList-enter,
.hideCourseList-leave-to {
  transform: translateX(505px);
}
.hideCourseList-enter-active,
.hideCourseList-leave-active {
  transition: all 0.3s ease;
}

.showUnfoldBtn-enter,
.showUnfoldBtn-leave-to {
  opacity: 0;
}
.showUnfoldBtn-enter-active,
.showUnfoldBtn-leave-active {
  transition: all 0.3s ease;
}
</style>
