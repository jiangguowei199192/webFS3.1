<!--
 * @Descripttion: 出来混迟早是要还的
 * @version: v_3.0
 * @Author: liangkaiLee
 * @Date: 2021-01-22 13:56:08
 * @LastEditors: liangkaiLee
 * @LastEditTime: 2021-01-22 14:38:10
-->
<template>
  <div class="dictDetBox">
    <div class="mainBox">
      <div>{{ subTitle }}</div>
      <div class="toolBox">
        <el-input
          class="search"
          v-model="searchStr"
          placeholder="请输入子类名称进行搜索"
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
  </div>
</template>

<script>
import PageTable from './pageTable.vue'

export default {
  name: 'dictPage',

  components: {
    PageTable
  },

  props: {
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

  mounted () {
    this.getList()
  },

  methods: {
    //  获取列表
    getList () {
      this.tableInfo.refresh = Math.random()
    },

    //  清空选中
    clearSelection () {
      this.$refs.pageTable.clearSelection()
    },

    //  添加资源
    addRes () {
      this.$refs.pointDlg.addRes()
    }
  }
}
</script>

<style lang="scss" scoped>
.dictDetBox {
  margin-left: 30px;
  .mainBox {
    box-sizing: border-box;
    padding: 12px 15px;
    height: 814px;
    background: #183157;
    .toolBox {
      display: flex;
      align-items: center;
      margin-top: 18px;
      .select,
      .search {
        width: 150px;
        height: 34px;
        /deep/.el-input__inner {
          background: rgba(9, 84, 109, 0.3);
          border-radius: 0px;
          border: 1px solid #1eb0fc;
        }
      }
      .search {
        width: 450px;
        margin-left: 10px;
        margin-right: 10px;
        /deep/.el-input__inner {
          color: #ffffff;
        }
      }
      .btn {
        box-sizing: border-box;
        width: 80px;
        height: 34px;
        background: linear-gradient(120deg, #086384, #0b779e);
        display: flex;
        align-items: center;
        cursor: pointer;
        span {
          color: #c5f3ff;
        }
        img {
          margin-right: 6px;
          margin-left: 9px;
        }
      }
      .resetBtn {
        margin-left: 10px;
      }
    }
    .tablTool {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      margin-left: 41px;
      margin-bottom: 13px;
      .left {
        span:nth-child(2) {
          color: #1d9fe5;
        }
        span:nth-child(4) {
          margin-left: 30px;
          color: #1d9fe5;
          border-bottom: solid 1px #1d9fe5;
          cursor: pointer;
        }
      }
      .right {
        margin-left: 15px;
        span {
          text-align: center;
          display: inline-block;
          width: 54px;
          height: 30px;
          background: #1eb0fc;
          cursor: pointer;
          line-height: 30px;
        }
        span:nth-child(2) {
          width: 96px;
          margin-left: 12px;
          background: #ff0000;
        }
      }
    }
  }
}
</style>
