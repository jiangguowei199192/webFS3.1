<template>
  <div class="videoResBox">
    <div class="title">设备数据 / {{ subTitle }}</div>
    <div class="mainBox">
      <div>{{ subTitle }}</div>
      <div>
        <div class="toolBox">
          <span class="txt1">视频类型:</span>
          <el-select
            v-model="queryParams.videoType"
            placeholder="请选择"
            clearable class="select commSelect"
            @change="queryParamsChange"
          >
            <el-option
              v-for="(item, index) in videoTypeList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <span class="txt2">所属机构:</span>
          <el-cascader
            v-model="queryParams.deptCode"
            placeholder="请选择"
            :options="deptTree"
            :props="deptTreeProps"
            :show-all-levels="false"
            @change="queryParamsChange"
          ></el-cascader>
          <span class="txt2">在线状态:</span>
          <el-select
            v-model="queryParams.onlineStatus"
            placeholder="请选择"
            clearable
            class="select commSelect"
            @change="queryParamsChange"
          >
            <el-option
              v-for="(item, index) in statusList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="toolBox">
          <span class="txt1">起始时间:</span>
          <el-date-picker
            v-model="queryParams.dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="datePickerStyle"
            @change="queryParamsChange"
          ></el-date-picker>
          <span class="txt2">搜索内容:</span>
          <el-input
            class="search inputSearch"
            v-model="queryParams.searchStr"
            placeholder="请输入资源名称/地址进行搜索"
          ></el-input>
          <div class="btn" style="margin-left:40px;"
            @click.stop="searchVideoDatas"
          >
            <img :src="searchIcon" />
            <span>搜索</span>
          </div>
          <div class="btn resetBtn" style="margin-left:48px;"
            @click.stop="resetSearchParams"
          >
            <img :src="resetIcon" />
            <span>重置</span>
          </div>
        </div>
      </div>
      <div class="tablTool">
        <div class="left">
          <span>已选</span>
          <span>{{ checkedList.length }}</span>
          <span>项</span>
          <span @click.stop="clearSelection">清空</span>
        </div>
        <div class="right">
          <span @click.stop="showResDlg('new')">添加</span>
          <span @click.stop="deleteDevices">批量删除</span>
        </div>
      </div>
      <PageTable
        ref="pageTable"
        :checkBox="true"
        :refresh="tableInfo.refresh"
        :fieldList="tableInfo.fieldList"
        :handle="tableInfo.handle"
        :data.sync="tableInfo.data"
        :tableHeight="560"
        :query="query"
        :api="api"
        :checkedList.sync="checkedList"
        @handleClick="handleClick"
        @switchClick="switchClick"
      ></PageTable>
    </div>
    <component ref="dlg" :is="dlgView"></component>
  </div>
</template>

<script>
import PageTable from './pageTable.vue'
import VideoResDlg from './videoResDlg.vue'
import { backApi } from '@/api/back'
import { Notification } from 'element-ui'
import { settingApi } from '@/api/setting'
import { EventBus } from '@/utils/eventBus.js'
export default {
  props: {
    // 对话框组件名称
    dlgView: {
      type: String,
      default: 'VideoResDlg'
    },
    // 子标题
    subTitle: {
      type: String
    },
    // 获取数据的接口
    api: {
      type: Function
    },
    // 查询条件
    query: {
      type: Object,
      default: () => {
        return {
          deviceDept: '',
          deviceNameOrCode: '',
          deviceStatus: '',
          deviceTypeCode: '',
          onlineStatus: '',
          timeStart: '',
          timeEnd: ''
        }
      }
    },
    tableInfo: {
      type: Object,
      default: () => {
        return {
          refresh: 1,
          data: [],
          fieldList: [],
          handle: {}
        }
      }
    }
  },
  data () {
    return {
      selectCount: 0,
      searchIcon: require('../../../assets/images/backgroundManagement/searchIcon.png'),
      resetIcon: require('../../../assets/images/backgroundManagement/resetIcon.png'),
      videoTypeList: [
        {
          value: 'WRJ',
          label: '无人机'
        },
        {
          value: 'GDJK',
          label: '高点监控'
        }
      ],
      deptTree: [],
      deptTreeProps: {
        expandTrigger: 'hover',
        children: 'children',
        label: 'deptName',
        value: 'deptCode',
        emitPath: false,
        checkStrictly: true
      },
      statusList: [
        {
          value: 'online',
          label: '在线'
        },
        {
          value: 'offline',
          label: '离线'
        }
      ],
      checkedList: [],
      queryParams: {
        videoType: '',
        deptCode: '',
        onlineStatus: '',
        deviceStatus: '',
        dateRange: '',
        searchStr: ''
      }
    }
  },
  components: {
    PageTable,
    VideoResDlg
  },
  created () {
    this.getDeptTree()
  },
  mounted () {
    this.getList()
    EventBus.$on('updateDeviceList', this.getList)
  },
  beforeDestroy () {
    EventBus.$off('updateDeviceList', this.getList)
  },
  methods: {
    /**
     * 获取机构树
     */
    async getDeptTree () {
      var _this = this
      this.$axios.post(backApi.getDeptTree).then((res) => {
        if (res && res.data && res.data.code === 0) {
          _this.deptTree = this.handleDeptTree(res.data.data)
        }
      })
    },
    // children为" "时置为null
    handleDeptTree (tree) {
      tree.forEach((item) => {
        if (item.children) {
          if (item.children.length <= 0) {
            item.children = null
          } else {
            this.handleDeptTree(item.children)
          }
        }
      })
      return tree
    },
    /**
     *  获取列表
     */
    getList () {
      this.tableInfo.refresh = Math.random()
    },
    /**
     *  清空选中
     */
    clearSelection () {
      this.$refs.pageTable.clearSelection()
    },
    /**
     * 更新表数据查询条件并查询
     */
    updateTableList (queryParams) {
      this.query.deviceDept = queryParams.deptCode
      this.query.deviceNameOrCode = queryParams.searchStr
      this.query.deviceStatus = queryParams.deviceStatus
      this.query.deviceTypeCode = queryParams.videoType
      this.query.onlineStatus = queryParams.onlineStatus
      if (queryParams.dateRange !== null && queryParams.dateRange !== '') {
        this.query.timeStart = queryParams.dateRange[0].getTime()
        this.query.timeEnd = queryParams.dateRange[1].getTime()
      } else {
        this.query.timeStart = ''
        this.query.timeEnd = ''
      }
      this.getList()
    },
    /**
     * 搜索视频设备
     */
    searchVideoDatas () {
      this.updateTableList(this.queryParams)
    },
    /**
     * 搜索条件改变时查询表数据
     */
    queryParamsChange () {
      this.updateTableList(this.queryParams)
    },
    /**
     * 重置搜索条件
     */
    resetSearchParams () {
      this.queryParams = {
        videoType: '',
        deptCode: '',
        onlineStatus: '',
        deviceStatus: '',
        dateRange: '',
        searchStr: ''
      }
      this.updateTableList(this.queryParams)
    },
    /**
     *  添加资源
     */
    showResDlg (action) {
      this.$refs.dlg.showResDlg(action)
    },
    /**
     * 删除视频设备
     */
    deleteDevices () {
      if (this.checkedList.length <= 0) {
        Notification({
          title: '提示',
          message: '请选择要删除的视频设备',
          type: 'warning',
          duration: 2 * 1000
        })
        return
      }

      const ids = []
      this.checkedList.forEach((d) => {
        ids.push(d.deviceCode)
      })
      // const tmpConfig1 = { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }
      const tmpConfig2 = { headers: { 'Content-Type': 'multipart/form-data' } }
      const formData = new FormData()
      formData.append('deviceCodeList', ids)
      // this.$axios.post(settingApi.deleteDeviceList, { deviceCodeList: ids}, tmpConfig1)
      this.$axios.post(settingApi.deleteDeviceList, formData, tmpConfig2)
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            Notification({
              title: '提示',
              message: '删除设备成功',
              type: 'success',
              duration: 5 * 1000
            })
            this.getList()
          }
          // Notification({
          //   title: '提示',
          //   message: '删除设备失败',
          //   type: 'warning',
          //   duration: 5 * 1000
          // })
        })
        .catch((err) => {
          Notification({
            title: '提示',
            message: '删除设备异常:' + err,
            type: 'warning',
            duration: 5 * 1000
          })
        })
    },
    /**
     * 点击表单操作按钮
     */
    handleClick (event, data) {
      this.$refs.dlg.showResDlg(event, data)
    },
    /**
     * 点击表单开关操作按钮
     */
    switchClick (event, data) {
      var param = {
        deviceCode: data.deviceCode,
        deviceStatus: event ? 'enabled' : 'disabled'
      }
      this.$axios.post(settingApi.changeDeviceStatus, param).then((res) => {
        if (res && res.data && res.data.code === 0) {
          this.getList()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.videoResBox {
  padding: 20px 31px 0px 20px;
  .title {
    font-size: 16px;
    color: #ffffff;
  }
  .mainBox {
    margin-top: 16px;
    .toolBox {
      margin-top: 18px;
      .txt1 {
        margin-right: 8px;
        margin-left: 12px;
      }
      .txt2 {
        margin-right: 8px;
        margin-left: 48px;
      }
      .txt3 {
        margin-right: 8px;
        margin-left: 48px;
      }
    }
    .commSelect {
      width: 360px;
    }
    .datePickerStyle {
      width: 360px;
      height: 34px;
      background-color: rgba(9, 84, 109, 0.3);
      border-color: #39a4dd;
      border-radius: 0px;
      border: 1px solid #1eb0fc;
      vertical-align:top;
      padding: 3px 5px;
    }
    /deep/.el-input__inner {
      color: #c5f3ff;
    }
    /deep/.el-date-editor .el-range-input {
      color: #c5f3ff;
      background: transparent;
      font-size: 14px;
    }
    /deep/.el-range-separator {
      color: white;
      font-size: 12px;
      line-height: 26px;
    }
    /deep/.el-input__prefix,
    /deep/.el-input__icon {
      line-height: 26px;
    }
    /deep/.el-cascader .el-input .el-input__inner {
      background-color: rgba(9, 84, 109, 0.3);
      border-color: #39a4dd;
      border-radius: 0px;
      width: 360px;
    }
    .inputSearch{
      margin-left: 0px;
      width: 360px;
    }
  }
}
</style>
