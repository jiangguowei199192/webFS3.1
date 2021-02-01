<template>
  <div>
    <ResDialog
      :title="title"
      :drawType="2"
      :isShow.sync="isShow"
      @mapResAddOrModify="mapResAddOrModify"
      @submitResForm="submitResForm"
      ref="resDlg"
    >
      <div slot="content" class="lineContent mapResForm">
        <div class="pTitle">
          <span></span>
          <span>面资源信息</span>
        </div>
        <el-form
          :model="resForm"
          :inline="true"
          label-width="90px"
          style="margin-top: 17px"
          :rules="formRules"
          ref="areaForm"
        >
          <el-form-item label="资源名称 :" prop="name">
            <el-input
              v-model="resForm.name"
              :placeholder="placeholder"
              :readonly="disabled"
              :class="{ active: !disabled }"
              class="lineName"
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
          <el-form-item label="线段颜色 :" prop="lineColor">
            <el-color-picker
              v-model="resForm.lineColor"
              show-alpha
              :disabled="disabled"
              @change="lineStyleChange()"
            ></el-color-picker>
          </el-form-item>
          <el-form-item label="线宽 :" prop="lineWidth">
            <el-input-number
              v-if="!disabled"
              v-model="resForm.lineWidth"
              :min="1"
              :max="10"
              step-strictly
              @change="lineWidthChange()"
            ></el-input-number>
            <span v-else>{{ resForm.lineWidth }}</span>
          </el-form-item>
          <el-form-item label="填充颜色 :" prop="fillColor">
            <el-color-picker
              v-model="resForm.fillColor"
              show-alpha
              :disabled="disabled"
            ></el-color-picker>
          </el-form-item>
          <el-form-item label="排序 :">
            <el-input
              v-model="resForm.sort"
              :placeholder="placeholder"
              :readonly="disabled"
              :class="{ active: !disabled }"
            ></el-input>
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
        <div>
          <PointMarkerForm
            ref="markerForm"
            @removeFeature="removeMarker"
          ></PointMarkerForm>
        </div>
      </div>
    </ResDialog>
  </div>
</template>

<script>
import ResDialog from './resDialog.vue'
import PointMarkerForm from './pointMarkerForm.vue'
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
      title: '新增面资源',
      isShow: false,
      organs: [],
      areas: [],
      resTypes: [],
      areaID: '',
      formRules: {
        name: [{ required: true, message: '请输入资源名称' }],
        type: [{ required: true, message: '请选择资源类型' }],
        organ: [{ required: true, message: '请选择所属机构' }],
        lineWidth: [{ required: true, message: '请输入线宽' }],
        lineColor: [{ required: true, message: '请选择线段颜色' }]
      },
      resForm: {
        name: '',
        type: '',
        phone: '',
        organ: '',
        area: '',
        sort: '',
        note: '',
        lineWidth: 2,
        lineColor: 'rgba(0, 204, 255, 1)',
        fillColor: 'rgba(0, 204, 255, 0.4)',
        coordinates: []
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
    ResDialog,
    PointMarkerForm
  },
  methods: {
    /**
     *  添加资源
     */
    addRes () {
      this.isShow = true
      this.$nextTick(() => {
        // 重置数据
        this.$refs.areaForm.resetFields()
        this.$refs.markerForm.resetData()
        this.areaID = ''
      })
    },
    /**
     *  面线段宽度改变
     */
    lineWidthChange () {
      if (!this.resForm.lineWidth) return
      this.resForm.lineWidth = Math.round(this.resForm.lineWidth)
      this.lineStyleChange()
    },
    /**
     *  面填充颜色改变
     */
    fillColorChange () {
      const data = {
        drawId: this.areaID,
        drawType: 2,
        fillStyle: { color: this.resForm.fillColor }
      }
      this.$refs.resDlg.addOrUpdateFeature(data)
    },
    /**
     *  面线段样式改变
     */
    lineStyleChange () {
      const data = {
        drawId: this.areaID,
        drawType: 2,
        strokeStyle: {
          color: this.resForm.lineColor,
          width: this.resForm.lineWidth
        }
      }
      this.$refs.resDlg.addOrUpdateFeature(data)
    },
    /**
     *  地图资源添加或修改
     */
    mapResAddOrModify (data) {
      if (data.drawType === 2) {
        this.areaID = data.drawId
        this.resForm.coordinates = data.coordinates
        // 重新画面资源的时候，需要设置样式
        if (data.bIsAdd) {
          const me = this
          setTimeout(() => {
            const d = {
              drawId: me.areaID,
              drawType: 2,
              strokeStyle: {
                color: me.resForm.lineColor,
                width: me.resForm.lineWidth
              },
              fillStyle: { color: me.resForm.fillColor }
            }
            me.$refs.resDlg.addOrUpdateFeature(d)
          }, 20)
        }
      } else if (data.drawType === 0) {
        this.$refs.markerForm.addOrModifyPoint(data)
      }
    },
    /**
     *  删除标识点
     */
    removeMarker (id) {
      this.$refs.resDlg.removeFeatureByID(id)
    },
    /**
     *  提交点资源数据
     */
    submitResForm () {
      let vSurface = ''
      this.$refs.areaForm.validate((valid) => {
        vSurface = valid
      })
      const vMarker = this.$refs.markerForm.formValid()
      if (vSurface && vMarker) {
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.lineContent {
  .lineName {
    /deep/ .el-input__inner {
      width: 393px;
    }
  }
}
</style>
