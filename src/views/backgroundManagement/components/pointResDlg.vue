<template>
  <div>
    <ResDialog
      :title="title"
      :drawType="0"
      :isShow.sync="isShow"
      @mapResAddOrModify="mapResAddOrModify"
      @submitResForm="submitResForm"
      ref="resDlg"
      :isRead="disabled"
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
              :disabled="disabled"
              :class="{ active: !disabled }"
            ></el-input>
          </el-form-item>
          <el-form-item label="资源地址 :" prop="resourcesAddr">
            <el-input
              v-model="resForm.resourcesAddr"
              :placeholder="placeholder"
              :disabled="disabled"
              :class="{ active: !disabled }"
            ></el-input>
          </el-form-item>
          <el-form-item label="资源类型 :" prop="resourcesType">
            <el-select
              v-show="!disabled"
              v-model="resForm.resourcesType"
              :popper-append-to-body="false"
              :placeholder="placeholder2"
              :class="{ active: !disabled }"
            >
              <el-option
                v-for="item in resTypes"
                :key="item.typeCode"
                :label="item.typeName"
                :value="item.typeCode"
              ></el-option>
            </el-select>
            <el-input
              v-show="disabled"
              v-model="resourcesTypeName"
              :placeholder="placeholder"
              :disabled="true"
              class="disabled"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系电话 :" prop="contactTel">
            <el-input
              v-model="resForm.contactTel"
              :placeholder="placeholder"
              :disabled="disabled"
              :class="{ active: !disabled }"
            ></el-input>
          </el-form-item>
          <el-form-item label="所属机构 :" prop="belongOrg">
            <el-cascader
              v-show="!disabled"
              v-model="resForm.belongOrg"
              :placeholder="placeholder2"
              :options="organs"
              :props="organsProps"
              :show-all-levels="false"
              :class="{ active: !disabled }"
            ></el-cascader>
            <el-input
              v-show="disabled"
              v-model="deptName"
              :placeholder="placeholder"
              :disabled="true"
              class="disabled"
            ></el-input>
          </el-form-item>
          <el-form-item label="所属辖区 :" prop="belongArea">
            <el-select
              v-show="!disabled"
              v-model="resForm.belongArea"
              :popper-append-to-body="false"
              :placeholder="placeholder2"
              :class="{ active: !disabled }"
            >
              <el-option
                v-for="item in areas"
                :key="item.typeCode"
                :label="item.typeName"
                :value="item.typeCode"
              ></el-option>
            </el-select>
            <el-input
              v-show="disabled"
              v-model="belongAreaName"
              :placeholder="placeholder"
              :disabled="true"
              class="disabled"
            ></el-input>
          </el-form-item>
          <el-form-item label="经度 :" prop="resourcesLongitude">
            <el-input
              v-model="resForm.resourcesLongitude"
              :placeholder="placeholder"
              :disabled="disabled"
              :class="{ active: !disabled }"
              @change="lanChange()"
            ></el-input>
          </el-form-item>
          <el-form-item label="纬度 :" prop="resourcesLatitude">
            <el-input
              v-model="resForm.resourcesLatitude"
              :placeholder="placeholder"
              :disabled="disabled"
              :class="{ active: !disabled }"
              @change="lanChange()"
            ></el-input>
          </el-form-item>
          <el-form-item label="管理人员 :" prop="resourcesManager">
            <el-input
              v-model="resForm.resourcesManager"
              :placeholder="placeholder"
              :disabled="disabled"
              :class="{ active: !disabled }"
            ></el-input>
          </el-form-item>
          <el-form-item label="人员电话 :" prop="managerTel">
            <el-input
              v-model="resForm.managerTel"
              :placeholder="placeholder"
              :disabled="disabled"
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
          <el-form-item label="排序 :" prop="resourcesSort">
            <el-input
              v-model="resForm.resourcesSort"
              :placeholder="placeholder"
              :disabled="disabled"
              :class="{ active: !disabled }"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注 :" prop="resourcesRemark">
            <el-input
              v-model="resForm.resourcesRemark"
              :placeholder="placeholder"
              type="textarea"
              resize="none"
              :disabled="disabled"
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
              <span
                class="del"
                @click.stop="deleteArea(item)"
                v-show="!disabled"
              ></span>
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
                    :disabled="disabled"
                    :class="{ active: !disabled }"
                  ></el-input>
                </el-form-item>
                <el-form-item label="类型 :">
                  <el-select
                    v-show="!disabled"
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
                  <el-input
                    v-show="disabled"
                    v-model="item.pointTypeName"
                    :placeholder="placeholder"
                    :disabled="true"
                    class="disabled"
                  ></el-input>
                </el-form-item>
                <el-form-item label="所属机构 :" prop="belongOrg">
                  <el-cascader
                    v-show="!disabled"
                    v-model="item.belongOrg"
                    :placeholder="placeholder2"
                    :options="organs"
                    :props="organsProps"
                    :show-all-levels="false"
                    :class="{ active: !disabled }"
                  ></el-cascader>
                  <el-input
                    v-show="disabled"
                    v-model="item.deptName"
                    :placeholder="placeholder"
                    :disabled="true"
                    class="disabled"
                  ></el-input>
                </el-form-item>
                <el-form-item label="线宽 :" prop="lineWidth">
                  <el-input-number
                    v-if="!disabled"
                    v-model="item.lineWidth"
                    :min="1"
                    :max="10"
                    :step="1"
                    step-strictly
                    @change="lineWidthChange(item)"
                  ></el-input-number>
                  <el-input
                    v-show="disabled"
                    v-model="item.lineWidth"
                    :placeholder="placeholder"
                    :disabled="true"
                    class="disabled"
                  ></el-input>
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
                    :disabled="disabled"
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
import { copyData, arrToStr } from '@/utils/public'

export default {
  mixins: [mapResMixin],
  data () {
    return {
      disabled: false, // 是否禁止编辑
      placeholder: '请输入',
      placeholder2: '请选择',
      icons: [],
      chooseIcon: require('../../../assets/images/backgroundManagement/chooseIcon.png'),
      title: '新增点资源',
      isShow: false,
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
      resourcesTypeName: '',
      belongAreaName: '',
      deptName: '',
      resForm: {
        resourcesPointAddDTOS: [],
        id: '',
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
      pointId: '',
      isUpdate: false,
      areaIds: [] // 管辖范围的id集合
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
      this.disabled = false
      this.isShow = true
      this.isUpdate = false
      this.$nextTick(() => {
        this.resetData()
      })
      this.getResources('point_resources')
      this.getAreaResources()
      this.getOrgans()
      this.getControlAreas()
    },
    /**
     *  重置数据
     */
    resetData () {
      this.$refs.pointForm.resetFields()
      this.pointId = ''
      this.ctlAreas = []
    },
    /**
     *  修改资源
     */
    updateRes (data) {
      this.disabled = false
      this.isShow = true
      this.isUpdate = true
      this.areaIds = []
      this.getResources('point_resources')
      this.getAreaResources()
      this.getOrgans()
      this.getControlAreas()
      const addDTOS = data.resourcesPointAddDTOS
      this.$nextTick(() => {
        this.resetData()
        // 设置点资源信息
        copyData(data, this.resForm)
        this.resForm.id = data.id
        this.pointId = data.id
        // 设置管辖范围信息
        if (addDTOS && addDTOS.length > 0) {
          addDTOS.forEach((c) => {
            var area = JSON.parse(JSON.stringify(this.area))
            copyData(c, area)
            this.areaIds.push(c.id)
            this.ctlAreas.push(area)
          })
        }
      })
      // 在地图上添加点
      this.addPointAndAreaInMap(addDTOS)
    },
    /**
     *  查看资源
     */
    lookRes (data) {
      this.disabled = true
      this.isShow = true
      const info = this.getUpdateInfo(data)
      this.$refs.resDlg.showInfos(info)
      const addDTOS = data.resourcesPointAddDTOS
      this.$nextTick(() => {
        this.resetData()
        // 设置点资源信息
        copyData(data, this.resForm)
        this.pointId = data.id
        this.belongAreaName = data.belongAreaName
        this.deptName = data.deptName
        this.resourcesTypeName = data.resourcesTypeName
        // 设置管辖范围信息
        if (addDTOS && addDTOS.length > 0) {
          addDTOS.forEach((c) => {
            var area = JSON.parse(JSON.stringify(this.area))
            copyData(c, area)
            area.pointTypeName = c.pointTypeName
            area.deptName = c.deptName
            this.ctlAreas.push(area)
          })
        }
      })
      // 在地图上添加点
      this.addPointAndAreaInMap(addDTOS)
    },
    /**
     *  在地图上添加点和管辖区域
     */
    addPointAndAreaInMap (addDTOS) {
      setTimeout(() => {
        const d = {
          drawId: this.pointId,
          drawType: 0,
          coordinates: [
            this.resForm.resourcesLongitude,
            this.resForm.resourcesLatitude
          ]
        }
        this.$refs.resDlg.addOrUpdateFeature(d)
        if (addDTOS && addDTOS.length > 0) {
          addDTOS.forEach((c) => {
            const area = {
              drawId: c.id,
              drawType: 2,
              fillStyle: { color: c.fillColor },
              strokeStyle: {
                color: c.lineColor,
                width: c.lineWidth
              },
              // eslint-disable-next-line no-eval
              coordinates: eval(c.longitudeLatitudeArray)
            }
            this.$refs.resDlg.addOrUpdateFeature(area)
          })
        }
      }, 100)
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
          a.longitudeLatitudeArray = arrToStr(data.coordinates)
          return
        }
        var area = JSON.parse(JSON.stringify(this.area))
        area.id = data.drawId
        area.longitudeLatitudeArray = arrToStr(data.coordinates)
        this.ctlAreas.push(area)
      }
    },
    /**
     *  添加或修改点资源
     */
    addOrUpdate () {
      let url = mapResApi.pointResUpdate
      if (!this.isUpdate) {
        delete this.resForm.id
        url = mapResApi.pointResAdd
      }
      delete this.resForm.resourcesPointAddDTOS
      delete this.resForm.resourcesPointUpdateDTOS
      if (this.ctlAreas.length > 0) {
        this.ctlAreas.forEach((c) => {
          delete c.id
        })
        if (this.isUpdate) {
          this.resForm.resourcesPointUpdateDTOS = this.ctlAreas
        } else this.resForm.resourcesPointAddDTOS = this.ctlAreas
      }
      this.$axios
        .post(url, this.resForm, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            this.isShow = false
            this.$emit('refreshTable')
          }
        })
        .catch((err) => {
          console.log(url + ' Err : ' + err)
        })
    },
    /**
     *  更新点资源
     */
    updatePointRes () {
      // 删除管控范围
      if (this.areaIds.length > 0) {
        const param = { ids: this.areaIds }
        this.$axios
          .post(mapResApi.batchDelPoint, param, {
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }
          })
          .then((res) => {
            if (res && res.data && res.data.code === 0) {
              this.addOrUpdate()
            }
          })
          .catch((err) => {
            console.log('mapResApi.batchDelPoint Err : ' + err)
          })
      } else this.addOrUpdate()
    },
    /**
     *  提交点资源数据
     */
    submitResForm () {
      if (!this.pointId) {
        this.$notify.closeAll()
        this.$notify.warning({
          title: '警告',
          message: '图上未标注资源，请标注后进行保存'
        })
        return
      }
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
      if (this.isUpdate) {
        this.updatePointRes()
      } else this.addOrUpdate()
    }
  }
}
</script>

<style lang="scss" scoped>
.iconTool {
  margin-bottom: 11px;
}
</style>
