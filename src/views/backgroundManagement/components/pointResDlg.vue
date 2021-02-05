<template>
  <div>
    <ResDialog
      :title="title"
      :drawType="0"
      :isShow.sync="isShow"
      @mapResAddOrModify="mapResAddOrModify"
      @submitResForm="submitResForm"
      ref="resDlg"
    >
      <div slot="content" class="pointContent mapResForm">
        <div class="pTitle">
          <span></span>
          <span>点资源信息</span>
        </div>
        <el-form
          ref="pointForm"
          :model="resForm"
          :inline="true"
          label-width="90px"
          style="margin-top: 17px"
          :rules="formRules"
        >
          <el-form-item label="资源名称 :" prop="resourcesName">
            <el-input
              v-model="resForm.resourcesName"
              :placeholder="placeholder"
              :readonly="disabled"
              :class="{ active: !disabled }"
            ></el-input>
          </el-form-item>
          <el-form-item label="资源地址 :" prop="resourcesAddr">
            <el-input
              v-model="resForm.resourcesAddr"
              :placeholder="placeholder"
              :readonly="disabled"
              :class="{ active: !disabled }"
            ></el-input>
          </el-form-item>
          <el-form-item label="资源类型 :" prop="resourcesType">
            <el-select
              v-model="resForm.resourcesType"
              :popper-append-to-body="false"
              :placeholder="placeholder2"
              :class="{ active: !disabled }"
              :disabled="disabled"
            >
              <el-option
                v-for="item in resTypes"
                :key="item.typeCode"
                :label="item.typeName"
                :value="item.typeCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系电话 :">
            <el-input
              v-model="resForm.contactTel"
              :placeholder="placeholder"
              :readonly="disabled"
              :class="{ active: !disabled }"
            ></el-input>
          </el-form-item>
          <el-form-item label="所属机构 :" prop="belongOrg">
            <el-cascader
              v-model="resForm.belongOrg"
              :placeholder="placeholder2"
              :options="organs"
              :props="organsProps"
              :show-all-levels="false"
              :disabled="disabled"
              :class="{ active: !disabled }"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="所属辖区 :">
            <el-select
              v-model="resForm.belongArea"
              :popper-append-to-body="false"
              :placeholder="placeholder2"
              :class="{ active: !disabled }"
              :disabled="disabled"
            >
              <el-option
                v-for="item in areas"
                :key="item.typeCode"
                :label="item.typeName"
                :value="item.typeCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="经度 :" prop="resourcesLongitude">
            <el-input
              v-model="resForm.resourcesLongitude"
              :placeholder="placeholder"
              :readonly="disabled"
              :class="{ active: !disabled }"
              @change="lanChange()"
            ></el-input>
          </el-form-item>
          <el-form-item label="纬度 :" prop="resourcesLatitude">
            <el-input
              v-model="resForm.resourcesLatitude"
              :placeholder="placeholder"
              :readonly="disabled"
              :class="{ active: !disabled }"
              @change="lanChange()"
            ></el-input>
          </el-form-item>
          <el-form-item label="管理人员 :">
            <el-input
              v-model="resForm.resourcesManager"
              :placeholder="placeholder"
              :readonly="disabled"
              :class="{ active: !disabled }"
            ></el-input>
          </el-form-item>
          <el-form-item label="人员电话 :">
            <el-input
              v-model="resForm.managerTel"
              :placeholder="placeholder"
              :readonly="disabled"
              :class="{ active: !disabled }"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="图标 :"
            style="line-height: 40px"
            prop="resourcesIcon"
          >
            <div class="iconTool">
              <el-avatar
                :size="30"
                :src="resForm.resourcesIcon"
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
              v-model="resForm.resourcesSort"
              :placeholder="placeholder"
              :readonly="disabled"
              :class="{ active: !disabled }"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注 :">
            <el-input
              v-model="resForm.resourcesRemark"
              :placeholder="placeholder"
              type="textarea"
              resize="none"
              :readonly="disabled"
              :class="{ active: !disabled }"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="listForm">
          <div class="pTitle" v-show="ctlAreas.length > 0">
            <span></span>
            <span>管控范围信息</span>
          </div>
          <template v-for="item in ctlAreas">
            <div :key="item.id">
              <span class="del" @click.stop="deleteArea(item)"></span>
              <el-form
                :model="item"
                :inline="true"
                label-width="90px"
                :rules="areaRules"
                ref="areaForm"
              >
                <el-form-item label="名称 :" prop="pointName">
                  <el-input
                    v-model="item.pointName"
                    :placeholder="placeholder"
                    :readonly="disabled"
                    :class="{ active: !disabled }"
                  ></el-input>
                </el-form-item>
                <el-form-item label="类型 :">
                  <el-select
                    v-model="item.pointType"
                    :popper-append-to-body="false"
                    :placeholder="placeholder2"
                    :class="{ active: !disabled }"
                    :disabled="disabled"
                  >
                    <el-option
                      v-for="item in controlAreas"
                      :key="item.typeCode"
                      :label="item.typeName"
                      :value="item.typeCode"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="所属机构 :" prop="belongOrg">
                  <el-cascader
                    v-model="item.belongOrg"
                    :placeholder="placeholder2"
                    :options="organs"
                    :props="organsProps"
                    :show-all-levels="false"
                    :disabled="disabled"
                    :class="{ active: !disabled }"
                  ></el-cascader>
                </el-form-item>
                <el-form-item label="线宽 :" prop="lineWidth">
                  <el-input-number
                    v-if="!disabled"
                    v-model="item.lineWidth"
                    :min="1"
                    :max="10"
                    :step="1"
                    step-strictly
                    @change="lineWidthChange()"
                  ></el-input-number>
                  <span v-else>{{ item.lineWidth }}</span>
                </el-form-item>
                <el-form-item label="线段颜色 :" prop="lineColor">
                  <el-color-picker
                    v-model="item.lineColor"
                    show-alpha
                    :disabled="disabled"
                    @change="lineStyleChange(item)"
                  ></el-color-picker>
                </el-form-item>
                <el-form-item label="填充颜色 :" prop="fillColor">
                  <el-color-picker
                    v-model="item.fillColor"
                    show-alpha
                    :disabled="disabled"
                    @change="fillColorChange()"
                  ></el-color-picker>
                </el-form-item>
                <el-form-item label="备注 :" class="note">
                  <el-input
                    v-model="item.pointRemark"
                    :placeholder="placeholder"
                    type="textarea"
                    resize="none"
                    :readonly="disabled"
                    :class="{ active: !disabled }"
                  ></el-input>
                </el-form-item>
              </el-form>
            </div>
          </template>
        </div>
      </div>
    </ResDialog>
  </div>
</template>

<script>
import ResDialog from './resDialog.vue'
import { isNotNull, lonValidate, latValidate } from '@/utils/formRules'
import { mapResApi } from '@/api/mapRes'
import { settingApi } from '@/api/setting'
import mapResMixin from './mixins/mapResMixin'
export default {
  props: {
    // 是否禁止编辑
    disabled: {
      type: Boolean,
      default: false
    }
  },
  mixins: [mapResMixin],
  data () {
    return {
      placeholder: '请输入',
      placeholder2: '请选择',
      icons: [],
      chooseIcon: require('../../../assets/images/backgroundManagement/chooseIcon.png'),
      title: '新增点资源',
      isShow: false,
      areas: [], // 辖区类型
      controlAreas: [], // 管控范围
      showPopover: false,
      area: {
        id: '',
        pointName: '',
        pointType: '',
        belongOrg: '',
        lineWidth: 2,
        pointRemark: '',
        lineColor: 'rgba(0, 204, 255, 1)',
        fillColor: 'rgba(0, 204, 255, 0.4)',
        longitudeLatitudeArray: []
      },
      ctlAreas: [], // 管控范围
      areaRules: {
        pointName: [{ required: true, message: '请输入名称' }],
        lineColor: [{ required: true, message: '请选择线段颜色' }],
        belongOrg: [{ required: true, message: '请选择所属机构' }],
        fillColor: [{ required: true, message: '请选择填充颜色' }],
        lineWidth: [{ required: true, message: '请输入线宽' }]
      },
      formRules: {
        resourcesName: [{ required: true, message: '请输入资源名称' }],
        resourcesAddr: [{ required: true, message: '请输入资源地址' }],
        resourcesType: [{ required: true, message: '请选择资源类型' }],
        belongOrg: [{ required: true, message: '请选择所属机构' }],
        resourcesIcon: [{ required: true, message: '请选择图标' }],
        resourcesLongitude: isNotNull('请输入经度').concat(lonValidate()),
        resourcesLatitude: isNotNull('请输入纬度').concat(latValidate())
      },
      resForm: {
        resourcesName: '',
        resourcesAddr: '',
        resourcesType: '',
        contactTel: '',
        belongOrg: '',
        belongArea: '',
        resourcesLongitude: '',
        resourcesLatitude: '',
        resourcesManager: '',
        resourcesDataType: 0,
        managerTel: '',
        resourcesSort: '',
        resourcesRemark: '',
        resourcesIcon:
          'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
      },
      pointId: ''
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
    lanChange () {
      let latV = true
      let lonV = true
      this.$refs.pointForm.validateField('lat', (valid) => {
        if (valid) latV = false
      })
      this.$refs.pointForm.validateField('lon', (valid) => {
        if (valid) lonV = false
      })
      if (latV && lonV) {
        const data = {
          drawId: this.pointId,
          drawType: 0,
          coordinates: [
            parseFloat(this.resForm.resourcesLongitude),
            parseFloat(this.resForm.resourcesLatitude)
          ]
        }
        this.$refs.resDlg.addOrUpdateFeature(data)
      }
    },
    /**
     *  添加资源
     */
    addRes () {
      this.isShow = true
      this.$nextTick(() => {
        // 重置数据
        this.$refs.pointForm.resetFields()
        this.pointId = ''
        this.ctlAreas = []
      })
      this.getPointResources()
      this.getAreaResources()
      this.getOrgans()
      this.getControlAreas()
    },
    /**
     * 获取辖区资源类型
     */
    getAreaResources () {
      this.$axios
        .get(settingApi.queryByTypeCode, {
          params: { typeCode: 'wuhan_city' }
        })
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            this.areas = res.data.data
          }
        })
        .catch((err) => {
          console.log('settingApi.queryByTypeCode Err : ' + err)
        })
    },
    /**
     * 获取管控范围类型
     */
    getControlAreas () {
      this.$axios
        .get(settingApi.queryByTypeCode, {
          params: { typeCode: 'control_areas' }
        })
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            this.controlAreas = res.data.data
          }
        })
        .catch((err) => {
          console.log('settingApi.queryByTypeCode Err : ' + err)
        })
    },
    /**
     *  管辖区域线段宽度改变
     */
    lineWidthChange (item) {
      if (!item.lineWidth) return
      item.lineWidth = Math.round(item.lineWidth)
      this.lineStyleChange(item)
    },
    /**
     *  管辖区域填充颜色改变
     */
    fillColorChange (item) {
      const data = {
        drawId: item.id,
        drawType: 2,
        fillStyle: { color: item.fillColor }
      }
      this.$refs.resDlg.addOrUpdateFeature(data)
    },
    /**
     *  管辖区域线段样式改变
     */
    lineStyleChange (item) {
      const data = {
        drawId: item.id,
        drawType: 2,
        strokeStyle: {
          color: item.lineColor,
          width: item.lineWidth
        }
      }
      this.$refs.resDlg.addOrUpdateFeature(data)
    },
    /**
     *  删除管辖区域
     */
    deleteArea (item) {
      this.$confirm('确定要删除此管辖区域吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showClose: false
      })
        .then(() => {
          const index = this.ctlAreas.indexOf(item)
          if (index !== -1) {
            this.$refs.resDlg.removeFeatureByID(item.id)
            this.ctlAreas.splice(index, 1)
          }
        })
        .catch(() => {})
    },
    /**
     *  地图资源添加或修改
     */
    mapResAddOrModify (data) {
      if (data.drawType === 0) {
        this.pointId = data.drawId
        this.resForm.resourcesLongitude = data.coordinates[0].toFixed(7)
        this.resForm.resourcesLatitude = data.coordinates[1].toFixed(7)
      } else if (data.drawType === 2) {
        const a = this.ctlAreas.find((c) => c.id === data.drawId)
        if (a !== undefined) {
          a.longitudeLatitudeArray = this.arrToStr(data.coordinates)
          return
        }
        var area = JSON.parse(JSON.stringify(this.area))
        area.id = data.drawId
        area.longitudeLatitudeArray = this.arrToStr(data.coordinates)
        this.ctlAreas.push(area)
        console.log(this.ctlAreas)
      }
    },
    /**
     *  二维数组转字符串
     */
    arrToStr (objarr) {
      var arrLen = objarr.length
      var row = '['
      for (var i = 0; i < arrLen; i++) {
        row += '['
        for (var j = 0; j < objarr[i].length; j++) {
          row += objarr[i][j]
          if (j < objarr[i].length - 1) {
            row += ','
          }
        }
        row += ']'
        if (i < arrLen - 1) {
          row += ','
        }
      }
      row += ']'
      return row
    },
    /**
     *  提交点资源数据
     */
    submitResForm () {
      const vList = []
      this.$refs.pointForm.validate((valid) => {
        vList.push(valid)
      })
      let i = 0
      for (; i < this.ctlAreas.length; i++) {
        this.$refs.areaForm[i].validate((valid) => {
          vList.push(valid)
        })
      }
      const result = vList.every((v) => v === true)
      if (!result) return

      this.resForm.resourcesLongitude = parseFloat(
        this.resForm.resourcesLongitude
      )
      this.resForm.resourcesLatitude = parseFloat(
        this.resForm.resourcesLatitude
      )
      if (this.ctlAreas.length > 0) {
        this.ctlAreas.forEach((c) => {
          delete c.id
        })
        this.resForm.resourcesPointAddDTOS = this.ctlAreas
      }
      this.$axios
        .post(mapResApi.mapResAdd, this.resForm, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            this.isShow = false
            this.$emit('refreshTable')
          }
        })
        .catch((err) => {
          console.log('mapResApi.mapResAdd Err : ' + err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.iconTool {
  margin-bottom: 11px;
}
</style>
