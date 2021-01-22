<template>
  <div style=" margin: auto 30px;">
    <!-- 头部面包屑 -->
    <div class="head-title">系统设置 / 数据字典</div>
    <!-- 左侧字典树 -->
    <div style=" display: flex;">
      <div class="left-tree">
        <div class="tree-title">数据字典树</div>
        <el-input
          class="dict-search-input"
          suffix-icon="el-icon-search"
          v-model="dictSearch"
          placeholder="请输入搜索条件"
          @change="dictSearchChange"
        ></el-input>
        <!-- 字典树 -->
        <el-tree
          class="dict-tree"
          :data="dictTree"
          :props="dictTreeProps"
          default-expand-all
          node-key="dictCode"
          :current-node-key="selectedDict.dictCode"
        ></el-tree>
        <div class="add-dict-btn" @click="addDictClick">十 新增字典</div>
      </div>
      <!-- 右侧字典详情表 -->
      <DictPage
        class="right-table"
        :tableInfo="tableInfo"
        :subTitle="subTitle"
        :query="query"
      ></DictPage>
    </div>
  </div>
</template>

<script>
import DictPage from './components/dictPage.vue'

export default {
  components: {
    DictPage
  },

  data () {
    return {
      subTitle: '字典项',
      // 表格项
      tableInfo: {
        refresh: 1,
        data: [
          {
            name: '武昌区',
            icon:
              'http://111.47.13.103:40031/cloud-oneMap/combatEvent/1608350408597_1608350408597.png',
            code: 'wuchangqu',
            status: false,
            order: '01'
          },
          {
            name: '汉阳区',
            icon:
              'http://111.47.13.103:40031/cloud-oneMap/combatEvent/1608350408597_1608350408597.png',
            code: 'hanyangqu',
            status: true,
            order: '02'
          },
          {
            name: '青山区',
            icon:
              'http://111.47.13.103:40031/cloud-oneMap/combatEvent/1608350408597_1608350408597.png',
            code: '青山区',
            status: false,
            order: '03'
          }
        ],
        fieldList: [
          { label: '子类名称', value: 'name' },
          { label: '图标', value: 'icon', type: 'image' },
          { label: '子类编码', value: 'code' },
          { label: '状态', value: 'status', type: 'switch' },
          { label: '排序', value: 'order' }
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
      },

      dictEditIcon: require('../../assets/images/backgroundManagement/deptEdit.png'),
      dictSeeIcon: require('../../assets/images/backgroundManagement/deptSee.png'),
      dictDeleteIcon: require('../../assets/images/backgroundManagement/deptDelete.png'),
      dictSearch: '',
      dictTree: [
        {
          dictName: '辖区类型',
          dictCode: '1',
          showSetting: true,
          children: [
            {
              dictName: '省级行政区',
              dictCode: '1-1',
              showSetting: false,
              children: [
                {
                  dictName: '地级行政区',
                  dictCode: '1-1-1',
                  showSetting: false
                }
              ]
            }
          ]
        },
        {
          dictName: '点位类型',
          dictCode: '2',
          showSetting: false,
          children: [
            {
              dictName: '消防线路',
              dictCode: '2-1',
              showSetting: false,
              children: [
                {
                  dictName: '武珞路',
                  dictCode: '2-1-1',
                  showSetting: false
                }
              ]
            }
          ]
        }
      ],
      selectedDict: '',

      dictTreeProps: {
        children: 'children',
        label: 'dictName',
        value: 'dictCode'
      }
    }
  },

  methods: {
    // 搜索字典
    dictSearchChange () {},

    // 新增字典
    addDictClick () {}
  }
}
</script>

<style lang="scss" scoped>
.head-title {
  height: 54px;
  line-height: 54px;
  font-size: 16px;
}
.left-tree {
  width: 280px;
  height: 814px;
  background-color: #183157;
  padding: 0 10px;
  .tree-title {
    color: #fff;
    font-size: 15px;
    height: 42px;
    line-height: 42px;
  }
  .dict-search-input {
    width: 278px;
    margin-top: 4px;
    /deep/.el-input__inner {
      background: #09546d;
      border-color: #1eb0fc;
      color: #fff;
      border-radius: 0;
    }
    /deep/.el-icon-search {
      color: #c5f3ff;
    }
  }
  .dict-tree {
    height: 646px;
    overflow: auto;
    margin-top: 15px;
    background-color: transparent;
    color: #fff;
    /deep/.el-tree-node {
      .el-tree-node__content {
        display: block !important;
        height: 30px;
        line-height: 30px;
        border: 1px solid transparent;
        background-color: transparent;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .el-tree-node__content:hover,
      .el-tree-node:focus > .el-tree-node__content {
        color: #fff;
        background-color: transparent !important;
      }
      // 展开折叠图标
      .el-tree-node__expand-icon.expanded {
        // 动画取消
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
      }
      .el-icon-caret-right:before {
        // 收起
        content: url("../../assets/images/backgroundManagement/deptTreeUnfold.png");
      }
      .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
        // 展开
        content: url("../../assets/images/backgroundManagement/deptTreeFold.png");
      }
      .el-tree-node__expand-icon.is-leaf::before {
        display: none;
      }
    }
  }
  .add-dict-btn {
    margin: 20px auto 0 auto;
    text-align: center;
    width: 150px;
    height: 38px;
    background-color: #39a4dd;
    line-height: 38px;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
  }
}
.right-table {
  margin-top: 0;
  flex-grow: 100;
}
</style>
