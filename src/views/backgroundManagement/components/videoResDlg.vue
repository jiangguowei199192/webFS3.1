<template>
  <div>
    <ResDialog
      ref="resDlgCtrl"
      :title="title"
      :drawType="0"
      :bVideoPoint="true"
      :isShow.sync="isShow"
      :isRead.sync="readonly"
      :infoTop="infoTop"
      :infoHeight="infoHeight"
      @mapResAddOrModify="mapResAddOrModify"
      @submitResForm="submitResForm"
    >
      <div slot="content" class="mapResForm">
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
              :class="{ active: !readonly || !isEdit }"
              :disabled="readonly || isEdit"
              @change="devTypeChange($event)"
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
              :disabled="readonly"
              :class="{ active: !readonly }"
              @input="limitMaxLength($event, 20, resForm, 'name')"
            ></el-input>
          </el-form-item>
          <el-form-item label="设备编号 :" prop="devCode">
            <el-input
              v-model="resForm.devCode"
              :placeholder="readonly || isEdit ? '' : placeholder"
              :disabled="readonly || isEdit"
              :class="{ active: !readonly || !isEdit}"
              @input="limitMaxLength($event, 20, resForm, 'devCode')"
            ></el-input>
          </el-form-item>
          <el-form-item label="设备地址 :" prop="address">
            <el-input
              v-model="resForm.address"
              :placeholder="placeholder"
              :disabled="readonly"
              :class="{ active: !readonly }"
              @input="limitMaxLength($event, 50, resForm, 'address')"
            ></el-input>
          </el-form-item>
          <el-form-item label="所属机构 :" prop="organ">
            <el-cascader
              v-model="resForm.organ"
              :placeholder="placeholder2"
              :options="organs"
              :props="organsProps"
              :show-all-levels="false"
              :disabled="readonly"
              :class="{ active: !readonly }"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="所属辖区 :">
            <el-select
              v-model="resForm.area"
              :popper-append-to-body="false"
              :placeholder="placeholder2"
              :class="{ active: !readonly }"
              :disabled="readonly"
            >
              <el-option
                v-for="item in areas"
                :key="item.typeCode"
                :label="item.typeName"
                :value="item.typeCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否启用 :" prop="enable">
            <el-select
              v-model="resForm.enable"
              :popper-append-to-body="false"
              :placeholder="placeholder2"
              :class="{ active: !readonly }"
              :disabled="readonly"
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
              :disabled="readonly"
              :class="{ active: !readonly }"
              @input="limitMaxLength($event, 20, resForm, 'brand')"
            ></el-input>
          </el-form-item>
          <el-form-item label="设备型号 :">
            <el-select
              v-model="resForm.model"
              :popper-append-to-body="false"
              :placeholder="placeholder2"
              :class="{ active: !readonly }"
              :disabled="readonly"
            >
              <el-option
                v-for="item in modelList"
                :key="item.typeCode"
                :label="item.typeName"
                :value="item.typeCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="质保日期 :">
            <el-date-picker
              v-model="resForm.warrantyDate"
              type="date"
              style="width: 150px"
              :disabled="readonly"
              :editable="false"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="H旋转范围 :" v-show="resForm.type === 'GDJK'">
            <el-input
              v-model="resForm.HStart"
              :placeholder="placeholder"
              :disabled="readonly"
              class="rangeInput rangeInputer"
              @input="limitMaxLength($event, 4, resForm, 'HStart')"
            ></el-input>
            <span style="color:white;">°</span>
            <span style="padding: 0px 7px;color:white;">-</span>
          </el-form-item>
          <el-form-item v-show="resForm.type === 'GDJK'">
            <el-input
              v-model="resForm.HEnd"
              :placeholder="placeholder"
              :disabled="readonly"
              class="rangeInput rangeInputer"
              @input="limitMaxLength($event, 4, resForm, 'HEnd')"
            ></el-input>
            <span style="color:white;">°</span>
          </el-form-item>
          <el-form-item label="V旋转范围 :" v-show="resForm.type === 'GDJK'">
            <el-input
              v-model="resForm.VStart"
              :placeholder="placeholder"
              :disabled="readonly"
              class="rangeInput rangeInputer"
              @input="limitMaxLength($event, 4, resForm, 'VStart')"
            ></el-input>
            <span style="color:white;">°</span>
            <span style="padding: 0px 7px;color:white;">-</span>
          </el-form-item>
          <el-form-item v-show="resForm.type === 'GDJK'">
            <el-input
              v-model="resForm.VEnd"
              :placeholder="placeholder"
              :disabled="readonly"
              class="rangeInput rangeInputer"
              @input="limitMaxLength($event, 4, resForm, 'VEnd')"
            ></el-input>
            <span style="color:white;">°</span>
          </el-form-item>
          <el-form-item label="用户 :" v-show="resForm.type === 'GDJK'">
            <el-input
              v-model="resForm.userName"
              :placeholder="placeholder"
              :disabled="readonly"
              :class="{ active: !readonly }"
              @input="limitMaxLength($event, 20, resForm, 'userName')"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码 :" v-show="resForm.type === 'GDJK'">
            <el-input
              v-model="resForm.userPwd"
              :placeholder="placeholder"
              :disabled="readonly"
              :class="{ active: !readonly }"
              @input="limitMaxLength($event, 20, resForm, 'userPwd')"
            ></el-input>
          </el-form-item>
          <el-form-item label="经度 :" prop="longitude">
            <el-input
              v-model="resForm.longitude"
              :placeholder="placeholder"
              :disabled="readonly"
              :class="{ active: !readonly }"
              @input="updateLonOrLat(true)"
            ></el-input>
          </el-form-item>
          <el-form-item label="纬度 :" prop="latitude">
            <el-input
              v-model="resForm.latitude"
              :placeholder="placeholder"
              :disabled="readonly"
              :class="{ active: !readonly }"
              @input="updateLonOrLat(false)"
            ></el-input>
          </el-form-item>
          <el-form-item label="高度 :" v-show="resForm.type === 'GDJK'">
            <el-input
              v-model="resForm.height"
              :placeholder="placeholder"
              :disabled="readonly"
              :class="{ active: !readonly }"
              @input="limitMaxLength($event, 4, resForm, 'height')"
            ></el-input>
          </el-form-item>
          <el-form-item label="底座方向角 :" v-show="resForm.type === 'GDJK'">
            <el-input
              v-model="resForm.baseOrientation"
              :placeholder="placeholder"
              :disabled="readonly"
              :class="{ active: !readonly }"
              @input="limitMaxLength($event, 4, resForm, 'baseOrientation')"
            ></el-input>
          </el-form-item>
          <el-form-item label="排序 :">
            <el-input
              v-model="resForm.sort"
              :placeholder="placeholder"
              :disabled="readonly"
              :class="{ active: !readonly }"
              @input="limitMaxLength($event, 20, resForm, 'sort')"
            ></el-input>
          </el-form-item>
          <el-form-item label="图标 :" style="line-height: 40px" prop="icon">
            <div class="iconTool">
              <el-avatar
                :size="30"
                :src="avatarUrl"
                style="margin-top: 5px"
                :key="avatarUrl"
              ></el-avatar>
              <el-popover
                placement="top"
                trigger="click"
                popper-class="iconPopover"
                v-model="showPopover"
                v-if="!readonly"
              >
                <div class="iconBox webFsScroll">
                  <!-- <span class="close" @click.stop="showPopover = false"></span> -->
                  <span
                    @click.stop="selectIcon(item)"
                    class="icon"
                    v-for="(item, index) in icons"
                    :key="index"
                    :style="{
                      background:
                        'url(' + serverUrl + item.iconPath + ') no-repeat',
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
              :disabled="readonly"
              :class="{ active: !readonly }"
              @input="limitMaxLength($event, 200, resForm, 'note')"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </ResDialog>
  </div>
</template>

<script>
import ResDialog from './resDialog.vue'
import {
  isNotNull,
  lonValidate,
  latValidate,
  limitMaxLength
} from '@/utils/formRules'
import { settingApi } from '@/api/setting'
import { Notification } from 'element-ui'
import { EventBus } from '@/utils/eventBus.js'
import mapResMixin from './mixins/mapResMixin'
import globalApi from '@/utils/globalApi'
export default {
  props: {
  },
  data () {
    return {
      serverUrl: globalApi.headImg,
      isEdit: false,
      readonly: false,
      placeholder: '请输入',
      placeholder2: '请选择',
      title: '新增视频资源',
      isShow: false,
      showPopover: false,
      infoTop: 80,
      infoHeight: 445,
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
          value: true,
          label: '启用'
        },
        {
          value: false,
          label: '不启用'
        }
      ],
      chooseIcon: require('../../../assets/images/backgroundManagement/chooseIcon.png'),
      formRules: {
        name: [{ required: true, message: '请输入资源名称' }],
        type: [{ required: true, message: '请选择资源类型' }],
        devCode: [{ required: true, message: '请输入设备码' }],
        address: [{ required: true, message: '请输入设备地址' }],
        organ: [{ required: true, message: '请选择所属机构' }],
        enable: [{ required: true, message: '请选择是否启用' }],
        longitude: isNotNull('请输入经度').concat(lonValidate()),
        latitude: isNotNull('请输入纬度').concat(latValidate()),
        icon: [{ required: true, message: '请选择图标' }]
      },
      resForm: {
        type: 'WRJ',
        name: '',
        devCode: '',
        address: '',
        organ: '',
        area: '',
        enable: '',
        brand: '',
        model: '',
        warrantyDate: '',
        HStart: '',
        HEnd: '',
        VStart: '',
        VEnd: '',
        userName: '',
        userPwd: '',
        longitude: '',
        latitude: '',
        height: '',
        baseOrientation: '',
        sort: '',
        icon: '',
        note: ''
      },
      avatarUrl: '',
      pointData: null
    }
  },
  mixins: [mapResMixin],
  computed: {
    iconUrl () {
      return this.resForm.icon
    }
  },
  watch: {
    readonly (val) {
      this.placeholder = val ? '' : '请输入'
      this.placeholder2 = val ? '' : '请选择'
    },
    iconUrl (val) {
      if (val) {
        this.avatarUrl = this.serverUrl + val
      } else this.avatarUrl = ''
    }
  },
  created () {
    this.organsProps.checkStrictly = true
    this.getOrgans()
    this.getIconList()
    this.getAreaResources()
    this.getDeviceModels()
  },
  components: {
    ResDialog
  },
  methods: {
    limitMaxLength,
    /**
     * 设置表单数据
     */
    setFormData (data) {
      if (data) {
        this.resForm.type = data.deviceTypeCode
        this.resForm.name = data.deviceName
        this.resForm.devCode = data.deviceCode
        this.resForm.address = data.deviceAddress
        this.resForm.organ = data.deviceDept
        this.resForm.area = data.deviceDistrict
        this.resForm.enable = data.deviceStatus
        this.resForm.brand = data.deviceBrand
        this.resForm.model = data.deviceModel
        if (data.deviceExpirationDate !== null &&
          data.deviceExpirationDate !== '' &&
          data.deviceExpirationDate !== undefined) {
          this.resForm.warrantyDate = new Date(data.deviceExpirationDate)
        }
        if (data.deviceRotationRange !== null &&
          data.deviceRotationRange !== '' &&
          data.deviceRotationRange !== undefined) {
          const tmpRange = JSON.parse(data.deviceRotationRange)
          this.resForm.HStart = tmpRange.HStart
          this.resForm.HEnd = tmpRange.HEnd
          this.resForm.VStart = tmpRange.VStart
          this.resForm.VEnd = tmpRange.VEnd
        }
        this.resForm.userName = data.deviceUserName
        this.resForm.userPwd = data.devicePassword
        this.resForm.longitude = data.deviceLongitude
        this.resForm.latitude = data.deviceLatitude
        this.resForm.height = data.deviceHeight
        this.resForm.baseOrientation = data.deviceSeatAz
        this.resForm.sort = data.orderNum
        if (data.iconUrl) {
          this.resForm.icon = this.serverUrl + data.iconUrl
        } else this.resForm.icon = ''
        this.resForm.note = data.remark
      } else {
        this.resForm = {
          type: 'GDJK',
          name: '',
          devCode: '',
          address: '',
          organ: '',
          area: '',
          enable: '',
          brand: '',
          model: '',
          warrantyDate: '',
          HStart: '',
          HEnd: '',
          VStart: '',
          VEnd: '',
          userName: '',
          userPwd: '',
          longitude: '',
          latitude: '',
          height: '',
          baseOrientation: '',
          sort: '',
          icon: '',
          note: ''
        }
      }
    },
    /**
     * 地图中显示设备位置
     */
    showDataInMap (data) {
      const tmpData = {
        drawId: data.deviceCode,
        drawType: 0,
        coordinates: [data.deviceLongitude, data.deviceLatitude]
      }
      setTimeout(() => {
        this.$refs.resDlgCtrl.addOrUpdateFeature(tmpData)
      }, 100)
    },
    /**
     *  添加资源
     */
    showResDlg (action, data = null) {
      this.isShow = true
      this.$nextTick(() => {
        // 重置数据
        this.$refs.formCtrl.resetFields()
        this.setFormData()
      })

      if (action === 'new') {
        this.$nextTick(() => {
          this.isEdit = false
          this.readonly = false
        })
      } else if (action === 'modify') {
        this.$nextTick(() => {
          this.setFormData(data)
          this.isEdit = true
          this.readonly = false
          this.showDataInMap(data)
        })
      } else if (action === 'readonly') {
        this.$nextTick(() => {
          this.setFormData(data)
          this.isEdit = false
          this.readonly = true
          this.showDataInMap(data)
          this.$refs.resDlgCtrl.showInfos(data)
        })
      }
      this.$nextTick(() => {
        this.updateDlgSize(this.resForm.type)
      })
    },
    updateLonOrLat (bIsLon) {
      if (this.pointData === null) {
        return
      }
      if (bIsLon) {
        if (this.resForm.longitude !== '') {
          // eslint-disable-next-line
          const lonreg = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,14})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,14}|180)$/
          if (lonreg.test(this.resForm.longitude)) {
            this.pointData.coordinates[0] = parseFloat(this.resForm.longitude)
            this.$refs.resDlgCtrl.addOrUpdateFeature(this.pointData)
          }
        }
      } else {
        if (this.resForm.latitude !== '') {
          // eslint-disable-next-line
          const latreg = /^(\-|\+)?([0-8]?\d{1}\.\d{0,14}|90\.0{0,14}|[0-8]?\d{1}|90)$/
          if (latreg.test(this.resForm.latitude)) {
            this.pointData.coordinates[1] = parseFloat(this.resForm.latitude)
            this.$refs.resDlgCtrl.addOrUpdateFeature(this.pointData)
          }
        }
      }
    },
    /**
     * 保存资源信息
     */
    submitResForm () {
      this.$refs.formCtrl.validate((valid) => {
        // if (!valid) return

        let tmpApi = ''
        let tmpAction = ''
        let tmpTypeName = ''
        if (this.isEdit === false && this.resForm.type === 'WRJ') {
          tmpApi = settingApi.addWRJ
          tmpAction = '新增'
          tmpTypeName = '无人机'
        } else if (this.isEdit === false && this.resForm.type === 'GDJK') {
          tmpApi = settingApi.addGDJK
          tmpAction = '新增'
          tmpTypeName = '高点监控'
        } else if (this.isEdit === true && this.resForm.type === 'WRJ') {
          tmpApi = settingApi.updateDevice
          tmpAction = '修改'
          tmpTypeName = '无人机'
        } else if (this.isEdit === true && this.resForm.type === 'GDJK') {
          tmpApi = settingApi.updateDevice
          tmpAction = '修改'
          tmpTypeName = '高点监控'
        } else {
          console.log('submitResForm unknown type : ', this.resForm.type)
          return
        }

        let expTime = ''
        if (this.resForm.warrantyDate !== '') {
          expTime = this.resForm.warrantyDate.getTime()
        }
        let tmpDevStatus = 'enabled'
        if (this.resForm.enable === false) {
          tmpDevStatus = 'disabled'
        }
        const tmpDatas = {
          deviceAddress: this.resForm.address, // 地点
          deviceCode: this.resForm.devCode, // 设备编码
          deviceDept: this.resForm.organ,
          deviceName: this.resForm.name,
          deviceStatus: tmpDevStatus,
          iconUrl: this.resForm.icon,
          deviceBrand: this.resForm.brand, // 品牌
          deptDistrictCode: this.resForm.area,
          deviceHeight: this.resForm.height,
          deviceLatitude: this.resForm.latitude,
          deviceLongitude: this.resForm.longitude,
          deviceModel: this.resForm.model,
          expirationDate: expTime, // 质保期
          orderNum: this.resForm.sort,
          remark: this.resForm.note
        }
        if (this.resForm.type === 'GDJK') {
          tmpDatas.deviceUserName = this.resForm.userName
          tmpDatas.devicePassword = this.resForm.userPwd
          const tmpRange = {
            HStart: this.resForm.HStart,
            HEnd: this.resForm.HEnd,
            VStart: this.resForm.VStart,
            VEnd: this.resForm.VEnd
          }
          tmpDatas.deviceRotationRange = JSON.stringify(tmpRange)
          tmpDatas.deviceSeatAz = this.resForm.baseOrientation
        }
        const tmpConfig = {}
        if (this.isEdit === true) {
          tmpDatas.deviceTypeCode = this.resForm.type
          tmpConfig.headers = { 'Content-Type': 'application/json;charset=UTF-8' }
        }
        console.log('submitResForm.params:', tmpDatas)

        this.$axios.post(tmpApi, tmpDatas, tmpConfig)
          .then((res) => {
            if (res && res.data && res.data.code === 0) {
              Notification({
                title: '提示',
                message: tmpAction + tmpTypeName + '设备成功',
                type: 'success',
                duration: 5 * 1000
              })
              EventBus.$emit('updateDeviceList')
              this.isShow = false
            }
            // Notification({
            //   title: '提示',
            //   message: tmpAction + tmpTypeName + '设备失败',
            //   type: 'warning',
            //   duration: 5 * 1000
            // })
          })
          .catch((err) => {
            Notification({
              title: '提示',
              message: tmpAction + tmpTypeName + '设备异常:' + err,
              type: 'warning',
              duration: 5 * 1000
            })
          })
      })
    },
    /**
     * 新增或修改图形回调处理
     */
    mapResAddOrModify (data) {
      this.pointData = data
      this.resForm.longitude = data.coordinates[0].toFixed(7)
      this.resForm.latitude = data.coordinates[1].toFixed(7)
    },
    updateDlgSize (type) {
      if (type === 'WRJ') {
        this.infoTop = 80
        this.infoHeight = 445
      } else if (type === 'GDJK') {
        this.infoTop = 30
        this.infoHeight = 560
      }
    },
    devTypeChange (event) {
      this.updateDlgSize(event)
    },
    /**
     *  选择图标
     */
    selectIcon (item) {
      this.showPopover = false
      this.resForm.icon = item.iconPath
      this.$refs.formCtrl.validateField('icon', (valid) => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.rangeInputer {
  display: inline;
}
</style>
