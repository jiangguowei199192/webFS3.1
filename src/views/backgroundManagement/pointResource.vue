<template>
  <div class="mapResBox">
    <div class="title">地图数据 / {{ subTitle }}</div>
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
          <span>4</span>
          <span>项</span>
          <span>清空</span>
        </div>
        <div class="right">
          <span>添加</span>
          <span>批量删除</span>
        </div>
      </div>
      <PageTable
        :checkBox="true"
        :refresh="tableInfo.refresh"
        :fieldList="tableInfo.fieldList"
        :handle="tableInfo.handle"
        :data.sync="tableInfo.data"
        :tableHeight="600"
        :query="query"
        :api="getListApi"
      ></PageTable>
    </div>
  </div>
</template>

<script>
import PageTable from './components/pageTable.vue'
import { settingApi } from '@/api/setting'
export default {
  props: {
    // 子标题
    subTitle: {
      default: '点资源设置',
      type: String
    }
  },
  data () {
    return {
      searchIcon: require('../../assets/images/backgroundManagement/searchIcon.png'),
      resetIcon: require('../../assets/images/backgroundManagement/resetIcon.png'),
      resList: [],
      res: '',
      organList: [],
      organ: '',
      searchStr: '',
      // 表格相关
      tableInfo: {
        refresh: 1,
        data: [
          {
            name: '江汉路',
            addr: '武汉市江汉区江汉路',
            type: '医院',
            org: false,
            sort: 1
          }
        ],
        fieldList: [
          { label: '设备类型', value: 'deviceTypeCode' },
          { label: '设备名称', value: 'deviceName' },
          { label: '设备编码', value: 'deviceCode' },
          { label: '启用', value: 'deviceStatus', type: 'switch' },
          { label: '在线状态', value: 'onlineStatus' }
        ],
        handle: {
          label: '操作',
          width: '130',
          btList: [
            {
              label: '修改'
            },
            {
              label: '查看'
            }
          ]
        }
      },
      query: {
        deviceCode: '',
        deviceName: ''
      }
    }
  },
  components: {
    PageTable
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
    getListApi (params) {
      return this.$axios.post(settingApi.queryDevicePage, params)
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
    box-sizing: border-box;
    padding: 12px 15px;
    height: 814px;
    background: #183157;
    margin-top: 16px;
    .toolBox {
      display: flex;
      align-items: center;
      margin-top: 18px;
      .txt1 {
        margin-right: 17px;
        margin-left: 12px;
      }
      .txt2 {
        margin-right: 17px;
        margin-left: 17px;
      }
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
