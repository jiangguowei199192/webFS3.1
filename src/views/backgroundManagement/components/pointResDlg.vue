<template>
  <div>
    <ResDialog
      :title="title"
      :drawType="0"
      :isShow.sync="isShow"
      @mapResAddOrModify="mapResAddOrModify"
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
                    :step="1"
                    step-strictly
                    @blur="lineStyleChange(item)"
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
                    @change="fillColorChange(item)"
                  ></el-color-picker>
                </el-form-item>
                <el-form-item label="备注 :" class="note">
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
            </div>
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
      icons: [],
      chooseIcon: require('../../../assets/images/backgroundManagement/chooseIcon.png'),
      title: '新增点资源',
      isShow: false,
      organs: [],
      areas: [],
      resTypes: [],
      showPopover: false,
      area: {
        id: '',
        name: '',
        type: '',
        organ: '',
        lineWidth: 2,
        note: '',
        lineColor: 'rgba(0, 204, 255, 1)',
        fillColor: 'rgba(0, 204, 255, 0.4)'
      },
      ctlAreas: [], // 管辖范围
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
        name: '',
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
    /**
     *  添加资源
     */
    addRes () {
      this.isShow = true
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
        this.resForm.lon = data.coordinates[0].toFixed(7)
        this.resForm.lat = data.coordinates[1].toFixed(7)
      } else if (data.drawType === 2) {
        var area = JSON.parse(JSON.stringify(this.area))
        area.id = data.drawId
        this.ctlAreas.push(area)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.iconTool {
  margin-bottom: 11px;
}
</style>
