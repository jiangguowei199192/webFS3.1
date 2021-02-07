<template>
  <div class="listForm">
    <div class="pTitle" v-show="list.length > 0">
      <span></span>
      <span>标识点信息 </span>
    </div>
    <template v-for="(item, index) in list">
      <div :key="index">
        <span
          class="del"
          @click.stop="deleteMarker(item)"
          v-show="!disabled"
        ></span>
        <el-form
          :model="item"
          :inline="true"
          label-width="90px"
          :rules="formRules"
          ref="markerForm"
        >
          <el-form-item label="名称 :" prop="pointName">
            <el-input
              v-model="item.pointName"
              :placeholder="placeholder"
              :disabled="disabled"
              :class="{ active: !disabled }"
            ></el-input>
          </el-form-item>
          <el-form-item label="地址 :">
            <el-input
              v-model="item.pointAddr"
              :placeholder="placeholder"
              :disabled="disabled"
              :class="{ active: !disabled }"
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
          <el-form-item label="所属辖区 :">
            <el-select
              v-show="!disabled"
              v-model="item.belongArea"
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
            <el-input
              v-show="disabled"
              v-model="item.belongAreaName"
              :placeholder="placeholder"
              :disabled="true"
              class="disabled"
            ></el-input>
          </el-form-item>
          <el-form-item label="经度 :" prop="longitude">
            <el-input
              v-model="item.longitude"
              :placeholder="placeholder"
              :disabled="disabled"
              :class="{ active: !disabled }"
            ></el-input>
          </el-form-item>
          <el-form-item label="纬度 :" prop="latitude">
            <el-input
              v-model="item.latitude"
              :placeholder="placeholder"
              :disabled="disabled"
              :class="{ active: !disabled }"
            ></el-input>
          </el-form-item>
          <el-form-item label="图标 :" style="line-height: 40px" prop="iconUrl">
            <div class="iconTool">
              <el-avatar
                :size="30"
                :src="item.iconUrl"
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
              v-model="item.pointSort"
              :placeholder="placeholder"
              :disabled="disabled"
              :class="{ active: !disabled }"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注 :">
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
</template>

<script>
import { isNotNull, lonValidate, latValidate } from '@/utils/formRules'
import { copyData } from '@/utils/public'
export default {
  props: {
    // 是否禁止编辑
    disabled: {
      type: Boolean,
      default: false
    },
    // 所属辖区
    areas: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 所属机构
    organs: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      placeholder: '请输入',
      placeholder2: '请选择',
      icons: [],
      chooseIcon: require('../../../assets/images/backgroundManagement/chooseIcon.png'),
      showPopover: false,
      point: {
        id: '',
        pointName: '',
        pointAddr: '',
        belongOrg: '',
        belongArea: '',
        pointRemark: '',
        pointSort: '',
        longitude: '',
        latitude: '',
        iconUrl: 'https://cube.elemecdn.com/3/7c/1epng.png'
      },
      list: [],
      organsProps: {
        expandTrigger: 'hover',
        children: 'children',
        label: 'deptName',
        value: 'deptCode',
        emitPath: false
      },
      formRules: {
        pointName: [{ required: true, message: '请输入资源名称' }],
        belongOrg: [{ required: true, message: '请选择所属机构' }],
        iconUrl: [{ required: true, message: '请选择图标' }],
        longitude: isNotNull('请输入经度').concat(lonValidate()),
        latitude: isNotNull('请输入纬度').concat(latValidate())
      }
    }
  },
  watch: {
    disabled (val) {
      this.placeholder = val ? '' : '请输入'
      this.placeholder2 = val ? '' : '请选择'
    }
  },
  methods: {
    /**
     *  标记点添加或修改
     */
    addOrModifyPoint (data) {
      const a = this.list.find((c) => c.id === data.drawId)
      const lon = data.coordinates[0].toFixed(7)
      const lat = data.coordinates[1].toFixed(7)
      if (a !== undefined) {
        a.lon = lon
        a.lat = lat
        return
      }
      var point = JSON.parse(JSON.stringify(this.point))
      point.id = data.drawId
      point.longitude = lon
      point.latitude = lat
      this.list.push(point)
    },
    /**
     *  添加标记点
     */
    addPoints (addDTOS, isUpdate = false) {
      addDTOS.forEach((c) => {
        var pt = JSON.parse(JSON.stringify(this.point))
        copyData(c, pt)
        if (!isUpdate) {
          pt.deptName = c.deptName
          pt.belongAreaName = c.belongAreaName
        }
        this.list.push(pt)
      })
    },
    /**
     *  删除标记点
     */
    deleteMarker (item) {
      this.$confirm('确定要删除此标识点吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showClose: false
      })
        .then(() => {
          const index = this.list.indexOf(item)
          if (index !== -1) {
            this.$emit('removeFeature', item.id)
            this.list.splice(index, 1)
          }
        })
        .catch(() => {})
    },
    /**
     *  表单验证
     */
    formValid () {
      const vList = []
      let i = 0
      for (; i < this.list.length; i++) {
        this.$refs.markerForm[i].validate((valid) => {
          vList.push(valid)
        })
      }
      const result = vList.every((v) => v === true)
      return result
    },
    /**
     *  重置数据
     */
    resetData () {
      this.list = []
    }
  }
}
</script>

<style lang="scss" scoped>
.iconTool {
  margin-bottom: 11px;
}
</style>
