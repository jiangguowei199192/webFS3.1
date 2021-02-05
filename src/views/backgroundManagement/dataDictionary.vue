<template>
  <div style="margin: auto 30px">
    <!-- 头部面包屑 -->
    <div class="head-title">系统设置 / 数据字典</div>
    <div style="display: flex">
      <!-- 左侧字典树 -->
      <div class="left-tree">
        <div class="tree-title">数据字典树</div>
        <el-input
          class="dict-search-input"
          suffix-icon="el-icon-search"
          v-model="dictSearch"
          placeholder="请输入搜索关键字"
        ></el-input>
        <el-tree
          class="dict-tree"
          ref="dictTreeRef"
          :data="dictTree"
          :props="dictTreeProps"
          default-expand-all
          node-key="id"
          :expand-on-click-node="false"
          @node-click="dictTreeClick"
          :filter-node-method="dictSearchChange"
        ></el-tree>
        <el-button
          class="add-dict-btn"
          @click.prevent="addDictClick('addParent')"
          >十 新增字典</el-button
        >
      </div>
      <!-- 右侧字典详情表 -->
      <DictPage
        class="right-table"
        :tableInfo="tableInfo"
        :subTitle="subTitle"
        :query="query"
        :api="getChildDictList"
      ></DictPage>
    </div>

    <!-- 新增字典弹窗 -->
    <AddDictDialog
      ref="addDictRef"
      :isShow.sync="showAddDict"
      title="新增字典"
      :deptTree="dictTree"
      @close="showAddDict = false"
      @confirmClick="submitAddDict"
      @cancelClick="cancelAddDict"
    ></AddDictDialog>
  </div>
</template>

<script>
import DictPage from './components/dictPage.vue'
import AddDictDialog from './components/addDictDialog.vue'
import { dataDictApi } from '@/api/dataDict'

export default {
  components: {
    DictPage,
    AddDictDialog
  },

  data () {
    return {
      dictEditIcon: require('../../assets/images/backgroundManagement/deptEdit.png'),
      dictSeeIcon: require('../../assets/images/backgroundManagement/deptSee.png'),
      dictDeleteIcon: require('../../assets/images/backgroundManagement/deptDelete.png'),
      dictSearch: '',
      dictTree: [],
      dictTreeProps: {
        children: 'children',
        label: 'typeName',
        value: 'typeCode'
      },
      selectedDict: '',
      showAddDict: false,

      subTitle: '字典项',
      // 表格项
      tableInfo: {
        refresh: 0,
        data: [],
        fieldList: [
          { label: '子类名称', value: 'typeName' },
          { label: '图标', value: 'icon', type: 'icon' },
          { label: '子类编码', value: 'typeCode' },
          { label: '状态', value: 'status', type: 'switch' },
          { label: '排序', value: 'orderNum' }
        ],
        handle: {
          label: '操作',
          width: '130',
          btList: [{ label: '修改' }, { label: '查看' }]
        }
      },
      pageData: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      query: {}
    }
  },

  watch: {
    dictSearch (val) {
      this.$refs.dictTreeRef.filter(val)
    }
  },

  mounted () {
    this.getDictTree()
  },

  methods: {
    // 单击字典树
    dictTreeClick (node) {
      // console.log(node)
      this.selectedDict = node
      this.tableInfo.refresh = Math.random()
      this.dictSearch = ''
    },

    // children为''时置为null
    handleDeptTree (data) {
      data.forEach(item => {
        if (item.children) {
          if (item.children.length <= 0) {
            item.children = null
          } else {
            this.handleDeptTree(item.children)
          }
        }
      })
      return data
    },

    // 获取字典树
    getDictTree () {
      this.$axios
        .get(dataDictApi.queryParentDict)
        .then(res => {
          // console.log('查询字典树接口返回: ', res)
          if (res && res.data && res.data.code === 0) {
            this.dictTree = this.handleDeptTree(res.data.data)
            if (this.dictTree.length > 0) {
              this.selectedDict = this.dictTree[0]
              this.tableInfo.refresh = Math.random()
            }
          }
        })
        .catch(err => {
          console.log('接口错误: ' + err)
        })
    },

    // 获取子级字典列表
    getChildDictList () {
      // console.log('selectedDict:', this.selectedDict)
      const queryParams = {
        parentId: parseInt(this.selectedDict ? this.selectedDict.id : 0),
        currentPage: parseInt(this.pageData.currentPage),
        pageSize: parseInt(this.pageData.pageSize),
        typeName: ''
      }
      // console.log('queryParams:', queryParams)
      return this.$axios.post(dataDictApi.queryChildDict, queryParams)
    },

    // 搜索字典树
    dictSearchChange (value, data) {
      if (!value) return true
      return data.typeName.indexOf(value) !== -1
    },

    // 点击新增按钮
    addDictClick (type) {
      this.showAddDict = true
      console.log('handelType:', type)
      this.$emit('handelType')
    },

    // 新增字典提交
    submitAddDict (data) {
      // console.log('data:', data)
    },

    // 取消新增
    cancelAddDict () {
      this.showAddDict = false
    }
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
      background: rgba(9, 84, 109, 0.3);
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
      .el-tree-node.is-current > .el-tree-node__content {
        background-color: rgba(11, 119, 158, 0.66);
        color: rgb(255, 246, 125);
      }
      .el-tree-node__content:hover {
        color: #fff;
        background-color: rgba(11, 119, 158, 0.66);
      }
      .el-tree-node__expand-icon.is-leaf::before {
        display: none;
      }
    }
  }
  .add-dict-btn {
    margin: 20px auto 0 62px;
    text-align: center;
    width: 150px;
    height: 38px;
    background-color: #39a4dd;
    color: #fff;
    border: none;
    font-size: 16px;
  }
}

.right-table {
  margin-top: 0;
  flex-grow: 100;
}
</style>
