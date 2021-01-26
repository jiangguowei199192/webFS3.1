<template>
  <div>
    <ResDialog :title="title" :drawType="1" :isShow.sync="isShow">
      <div slot="content" class="lineContent mapResForm">
        <div class="pTitle">
          <span></span>
          <span>线资源信息</span>
        </div>
        <el-form
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
          <el-form-item label="起点 :">
            <el-input
              v-model="resForm.start"
              :placeholder="placeholder"
              :readonly="disabled"
              :class="{ active: !disabled }"
            ></el-input>
          </el-form-item>
          <el-form-item label="终点 :">
            <el-input
              v-model="resForm.end"
              :placeholder="placeholder"
              :readonly="disabled"
              :class="{ active: !disabled }"
            ></el-input>
          </el-form-item>
          <el-form-item label="总长度 :">
            <el-input
              v-model="resForm.totalLen"
              :placeholder="placeholder"
              :readonly="disabled"
              :class="{ active: !disabled }"
            ></el-input>
          </el-form-item>
          <el-form-item label="排序 :">
            <el-input
              v-model="resForm.sort"
              :placeholder="placeholder"
              :readonly="disabled"
              :class="{ active: !disabled }"
            ></el-input>
          </el-form-item>
          <el-form-item label="线段颜色 :" prop="lineColor">
            <el-color-picker
              v-model="resForm.lineColor"
              show-alpha
              :disabled="disabled"
            ></el-color-picker>
          </el-form-item>
          <el-form-item label="线宽 :" prop="lineWidth">
            <el-input-number
              v-if="!disabled"
              v-model="resForm.lineWidth"
              :min="1"
              :max="10"
            ></el-input-number>
            <span v-else>{{ resForm.lineWidth }}</span>
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
        <div class="boundary">
          <div class="pTitle">
            <span></span>
            <span>标识点信息 </span>
          </div>
          <PointMarkerForm></PointMarkerForm>
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
      title: '新增线资源',
      isShow: false,
      organs: [],
      areas: [],
      resTypes: [],
      formRules: {
        name: [{ required: true, message: '请输入资源名称' }],
        type: [{ required: true, message: '请选择资源类型' }],
        organ: [{ required: true, message: '请选择所属机构' }],
        lineWidth: [{ required: true, message: '请输入线宽' }],
        lineColor: [{ required: true, message: '请选择线段颜色' }]
      },
      resForm: {
        name: '11111',
        type: '',
        phone: '',
        organ: '',
        area: '',
        start: '',
        end: '',
        totalLen: '',
        sort: '',
        note: '',
        lineWidth: '',
        lineColor: ''
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
