<!--
 * @Descripttion: 出来混迟早是要还的
 * @version: v_3.0
 * @Author: liangkaiLee
 * @Date: 2021-01-26 13:56:08
 * @LastEditors: liangkaiLee
 * @LastEditTime: 2021-02-04 15:40:07
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
          <span @click.stop="addDict">添加</span>
          <span @click.stop="delDict">批量删除</span>
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

      <!-- 添加字典弹窗 -->
      <AddDictDialog
        ref="dictDlg"
        :isShow.sync="showAddDict"
        title="添加字典"
        @close="showAddDict = false"
        @confirmClick="submitAddDict"
        @cancelClick="cancelAddDict"
      ></AddDictDialog>
      <!-- 批量删除弹窗 -->
      <DeleteDialog
        :isShow.sync="showDeleteTip"
        @close="showDeleteTip = false"
        @confirmClick="delTipConfirmClick"
        @cancelClick="showDeleteTip = false"
      ></DeleteDialog>
    </div>
  </div>
</template>

<script>
import PageTable from './pageTable.vue'
import AddDictDialog from './addDictDialog.vue'
import DeleteDialog from './deleteDialog.vue'

export default {
  name: 'dictPage',

  components: {
    PageTable,
    AddDictDialog,
    DeleteDialog
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
        return {}
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
      checkedList: [],
      showAddDict: false,
      showDeleteTip: false
    }
  },

  mounted () {
    // this.getList()
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

    //  点击添加字典
    addDict () {
      this.showAddDict = true
    },

    // 添加字典提交
    submitAddDict () {
      alert('添加成功!')
      this.showAddDict = false
    },

    // 取消添加
    cancelAddDict () {
      this.showAddDict = false
    },

    // 点击批量删除
    delDict () {
      this.showDeleteTip = true
    },

    // 批量删除确定
    delTipConfirmClick () {
      alert('删除成功!')
      this.showDeleteTip = false
    }
  }
}
</script>

<style lang="scss" scoped>
.dictDetBox {
  margin-left: 30px;
  .toolBox {
    margin-top: 13px;
  }
}
</style>
