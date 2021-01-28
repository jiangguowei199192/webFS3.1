<template>
  <div class="mapResBox">
    <div class="title">设备数据 / {{ subTitle }}</div>
    <div class="mainBox">
      <div>{{ subTitle }}</div>
      <div class="toolBox">
        <span class="txt1">资源类型:</span>
        <el-select v-model="res" placeholder="请选择" clearable class="select">
          <el-option
            v-for="(item, index) in resList"
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
          class="select"
        >
          <el-option
            v-for="(item, index) in organList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-input
          class="search"
          v-model="searchStr"
          placeholder="请输入资源名称/地址进行搜索"
        ></el-input>
        <div class="btn">
          <img :src="searchIcon" />
          <span>搜索</span>
        </div>
        <div class="btn resetBtn">
          <img :src="resetIcon" />
          <span>重置</span>
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
          <span @click.stop="addRes">添加</span>
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
        :tableHeight="610"
        :query="query"
        :api="api"
        :checkedList.sync="checkedList"
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
      resList: [],
      res: '',
      organList: [],
      organ: '',
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
    addRes () {
      this.$refs.dlg.addRes()
    }
  }
}
</script>

<style lang="scss" scoped>
.mapResBox {
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
        margin-right: 17px;
        margin-left: 12px;
      }
      .txt2 {
        margin-right: 17px;
        margin-left: 17px;
      }
    }
  }
}
</style>
