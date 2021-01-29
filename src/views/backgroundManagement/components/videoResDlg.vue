<template>
  <div>
    <ResDialog
      :title="title"
      :drawType="0"
      :bVideoPoint="true"
      :isShow.sync="isShow"
      @mapResAddOrModify="mapResAddOrModify"
      @submitResForm="submitResForm"
    >
      <div slot="content" class="videoContent mapResForm">
        <div class="pTitle" style="margin-top:6px;">
          <span></span>
          <span>视频资源信息</span>
        </div>
        <el-form
          ref="formCtrl"
          :model="resForm"
          :inline="true"
          label-width="90px"
          style="margin-top: 8px"
          :rules="formRules"
        >
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
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备名称 :" prop="name">
            <el-input
              v-model="resForm.name"
              :placeholder="placeholder"
              :readonly="disabled"
              :class="{ active: !disabled }"
            ></el-input>
          </el-form-item>
          <el-form-item label="设备编号 :" prop="devCode">
            <el-input
              v-model="resForm.devCode"
              :placeholder="placeholder"
              :readonly="disabled"
              :class="{ active: !disabled }"
            ></el-input>
          </el-form-item>
          <el-form-item label="设备地址 :" prop="address">
            <el-input
              v-model="resForm.address"
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
          <el-form-item label="是否启用 :" prop="enable">
            <el-select
              v-model="resForm.enable"
              :popper-append-to-body="false"
              :placeholder="placeholder2"
              :class="{ active: !disabled }"
              :disabled="disabled"
            >
              <el-option
                v-for="item in enableOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备品牌 :">
            <el-input
              v-model="resForm.brand"
              :placeholder="placeholder"
              :readonly="disabled"
              :class="{ active: !disabled }"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户 :" v-show="resForm.type === 'GDJK'">
            <el-input
              v-model="resForm.userName"
              :placeholder="placeholder"
              :readonly="disabled"
              :class="{ active: !disabled }"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码 :" v-show="resForm.type === 'GDJK'">
            <el-input
              v-model="resForm.userPwd"
              :placeholder="placeholder"
              :readonly="disabled"
              :class="{ active: !disabled }"
            ></el-input>
          </el-form-item>
          <el-form-item label="经度 :">
            <el-input
              v-model="resForm.longitude"
              :placeholder="placeholder"
              :readonly="disabled"
              :class="{ active: !disabled }"
              @change="updateLonOrLat(true)"
            ></el-input>
          </el-form-item>
          <el-form-item label="纬度 :">
            <el-input
              v-model="resForm.latitude"
              :placeholder="placeholder"
              :readonly="disabled"
              :class="{ active: !disabled }"
              @change="updateLonOrLat(true)"
            ></el-input>
          </el-form-item>
          <el-form-item label="高度 :" v-show="resForm.type === 'GDJK'">
            <el-input
              v-model="resForm.height"
              :placeholder="placeholder"
              :readonly="disabled"
              :class="{ active: !disabled }"
            ></el-input>
          </el-form-item>
          <el-form-item label="底座方向角 :" v-show="resForm.type === 'GDJK'">
            <el-input
              v-model="resForm.baseOrientation"
              :placeholder="placeholder"
              :readonly="disabled"
              :class="{ active: !disabled }"
            ></el-input>
          </el-form-item>
          <el-form-item label="质保日期 :">
            <el-date-picker
              v-model="resForm.warrantyDate"
              type="date"
              style="width: 150px"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="排序 :">
            <el-input
              v-model="resForm.sort"
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
          <el-form-item label="备注 :" class="note">
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
      title: '新增视频资源',
      isShow: true,
      showPopover: false,
      organs: [],
      areas: [],
      resTypes: [
        {
          value: 'WRJ',
          label: '无人机'
        },
        {
          value: 'GDJK',
          label: '高点监控'
        }
      ],
      enableOptions: [
        {
          value: 'true',
          label: '启用'
        },
        {
          value: 'false',
          label: '不启用'
        }
      ],
      chooseIcon: require('../../../assets/images/backgroundManagement/chooseIcon.png'),
      icons: [],
      formRules: {
        name: [{ required: true, message: '请输入资源名称' }],
        type: [{ required: true, message: '请选择资源类型' }],
        devCode: [{ required: true, message: '请输入设备码' }],
        address: [{ required: true, message: '请输入设备地址' }],
        organ: [{ required: true, message: '请选择所属机构' }],
        enable: [{ required: true, message: '请选择是否启用' }],
        icon: [{ required: true, message: '请选择图标' }]
      },
      resForm: {
        type: '',
        name: '11111',
        devCode: '',
        address: '',
        organ: '',
        area: '',
        enable: '',
        brand: '',
        userName: '',
        userPwd: '',
        longitude: '',
        latitude: '',
        height: '',
        baseOrientation: '',
        warrantyDate: '',
        sort: '',
        icon: '',
        note: ''
      },
      pointData: null
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
    },
    updateLonOrLat (bIsLon) {
      if (this.pointData === null) {
        return
      }
    },
    /**
     * 保存资源信息
     */
    submitResForm () {
      this.$refs.formCtrl.validate((valid) => {
        if (!valid) return
        console.log('videoResDlg commit ...')
      })
    },
    /**
     * 新增或修改图形回调处理
     */
    mapResAddOrModify (data) {
      this.pointData = data
      this.resForm.longitude = data.coordinates[0].toFixed(7)
      this.resForm.latitude = data.coordinates[1].toFixed(7)
    }
  }
}
</script>

<style lang="scss" scoped>
.videoContent {
  height: 540px;
}
</style>
