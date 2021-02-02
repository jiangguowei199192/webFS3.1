<template>
  <div>
    <ResDialog
      ref="resDlgCtrl"
      :title="title"
      :drawType="0"
      :bVideoPoint="true"
      :isShow.sync="isShow"
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
              :class="{ active: !readonly || !disabled }"
              :disabled="readonly || disabled"
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
            ></el-input>
          </el-form-item>
          <el-form-item label="设备编号 :" prop="devCode">
            <el-input
              v-model="resForm.devCode"
              :placeholder="readonly || disabled ? '' : placeholder"
              :disabled="readonly || disabled"
              :class="{ active: !readonly || !disabled}"
            ></el-input>
          </el-form-item>
          <el-form-item label="设备地址 :" prop="address">
            <el-input
              v-model="resForm.address"
              :placeholder="placeholder"
              :disabled="readonly"
              :class="{ active: !readonly }"
            ></el-input>
          </el-form-item>
          <el-form-item label="所属机构 :" prop="organ">
            <el-cascader
              v-model="resForm.organ"
              :placeholder="placeholder2"
              :options="organTree"
              :props="deptTreeProps"
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
                v-for="item in areaList"
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
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="质保日期 :">
            <el-date-picker
              v-model="resForm.warrantyDate"
              type="date"
              style="width: 150px"
              :disabled="readonly"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="H旋转范围 :" v-show="resForm.type === 'GDJK'">
            <el-input
              v-model="resForm.HStart"
              :placeholder="placeholder"
              :disabled="readonly"
              class="rangeInput rangeInputer"
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
            ></el-input>
            <span style="color:white;">°</span>
          </el-form-item>
          <el-form-item label="V旋转范围 :" v-show="resForm.type === 'GDJK'">
            <el-input
              v-model="resForm.VStart"
              :placeholder="placeholder"
              :disabled="readonly"
              class="rangeInput rangeInputer"
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
            ></el-input>
            <span style="color:white;">°</span>
          </el-form-item>
          <el-form-item label="用户 :" v-show="resForm.type === 'GDJK'">
            <el-input
              v-model="resForm.userName"
              :placeholder="placeholder"
              :disabled="readonly"
              :class="{ active: !readonly }"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码 :" v-show="resForm.type === 'GDJK'">
            <el-input
              v-model="resForm.userPwd"
              :placeholder="placeholder"
              :disabled="readonly"
              :class="{ active: !readonly }"
            ></el-input>
          </el-form-item>
          <el-form-item label="经度 :">
            <el-input
              v-model="resForm.longitude"
              :placeholder="placeholder"
              :disabled="readonly"
              :class="{ active: !readonly }"
              @input="updateLonOrLat(true)"
            ></el-input>
          </el-form-item>
          <el-form-item label="纬度 :">
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
            ></el-input>
          </el-form-item>
          <el-form-item label="底座方向角 :" v-show="resForm.type === 'GDJK'">
            <el-input
              v-model="resForm.baseOrientation"
              :placeholder="placeholder"
              :disabled="readonly"
              :class="{ active: !readonly }"
            ></el-input>
          </el-form-item>
          <el-form-item label="排序 :">
            <el-input
              v-model="resForm.sort"
              :placeholder="placeholder"
              :disabled="readonly"
              :class="{ active: !readonly }"
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
                v-if="!readonly"
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
              :disabled="readonly"
              :class="{ active: !readonly }"
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
  },
  data () {
    return {
      disabled: false,
      readonly: false,
      placeholder: '请输入',
      placeholder2: '请选择',
      title: '新增视频资源',
      isShow: false,
      showPopover: false,
      infoTop: 80,
      infoHeight: 445,
      organTree: [
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
        expandTrigger: 'hover',
        children: 'children',
        label: 'deptName',
        value: 'deptCode'
      },
      areaList: [
        {
          label: '洪山区',
          id: '1'
        },
        {
          label: '江夏区',
          id: '2'
        }
      ],
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
      modelList: [
        {
          value: 'mId1',
          label: 'GTX001'
        },
        {
          value: 'mId2',
          label: 'GDU088'
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
      pointData: null
    }
  },
  watch: {
    readonly (val) {
      this.placeholder = val ? '' : '请输入'
      this.placeholder2 = val ? '' : '请选择'
    }
  },
  components: {
    ResDialog
  },
  methods: {
    setFormData (data) {
      if (data) {
        this.resForm.type = data.deviceTypeCode
      } else {
        this.resForm = {
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
        }
      }
    },
    /**
     *  添加资源
     */
    showResDlg (action, data = null) {
      this.isShow = true
      this.$nextTick(() => {
        // 重置数据
        this.$refs.formCtrl.resetFields()
      })
      if (action === 'new') {
        this.$nextTick(() => {
          this.setFormData()
          this.disabled = false
          this.readonly = false
        })
      } else if (action === 'modify') {
        this.$nextTick(() => {
          this.setFormData(data)
          this.disabled = true
          this.readonly = false
        })
      } else if (action === 'readonly') {
        this.$nextTick(() => {
          this.setFormData(data)
          this.disabled = false
          this.readonly = true
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
    }
  }
}
</script>

<style lang="scss" scoped>
.rangeInputer {
  display: inline;
}
</style>
