<template>
  <div class="videoResBox">
    <div class="title">设备数据 / {{ subTitle }}</div>
    <div class="mainBox">
      <div>{{ subTitle }}</div>
      <div>
        <div class="toolBox">
          <span class="txt1">视频类型:</span>
          <el-select v-model="res" placeholder="请选择" clearable class="select commSelect">
            <el-option
              v-for="(item, index) in videoTypeList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <span class="txt2">所属机构:</span>
          <el-select
            v-model="organ"
            placeholder="请选择"
            clearable
            class="select commSelect"
          >
            <el-option
              v-for="(item, index) in organList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <span class="txt2">在线状态:</span>
          <el-select
            v-model="onlineStatus"
            placeholder="请选择"
            clearable
            class="select commSelect"
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
            v-model="dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="datePickerStyle"
          ></el-date-picker>
          <span class="txt2">搜索内容:</span>
          <el-input
            class="search inputSearch"
            v-model="searchStr"
            placeholder="请输入资源名称/地址进行搜索"
          ></el-input>
          <div class="btn" style="margin-left:40px;">
            <img :src="searchIcon" />
            <span>搜索</span>
          </div>
          <div class="btn resetBtn" style="margin-left:48px;">
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
          <span>批量删除</span>
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
          deviceCode: '',
          deviceName: ''
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
      res: '',
      organList: [],
      organ: '',
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
      onlineStatus: '',
      dateRange: [],
      searchStr: '',
      checkedList: []
    }
  },
  components: {
    PageTable,
    VideoResDlg
  },
  mounted () {
    this.getList()
  },
  methods: {
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
     *  添加资源
     */
    showResDlg (action) {
      this.$refs.dlg.showResDlg(action)
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
      console.log('switchClick.event:', event)
      console.log('switchClick.data:', data)
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
    /deep/ .el-input__prefix,
    /deep/ .el-input__icon {
      line-height: 26px;
    }
    .inputSearch{
      margin-left: 0px;
      width: 360px;
    }
  }
}
</style>
