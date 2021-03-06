<template>
  <div class="tableBox" :class="className">
    <!-- 显示表格 -->
    <el-table
      ref="table"
      :data="data"
      style="width: 100%"
      :height="tableHeight"
      @selection-change="selectionChange"
      class="manageTable"
    >
      <el-table-column
        v-if="checkBox"
        :key="'selection'"
        type="selection"
        width="55"
      />
      <el-table-column
        v-for="(item, index) in fieldList"
        :key="index"
        :prop="item.value"
        :label="item.label"
        :fixed="item.fixed"
        align="center"
        :width="item.width"
        :min-width="item.minWidth || '100px'"
        :show-overflow-tooltip="true"
      >
        <template v-slot="scope">
          <el-switch
            v-if="item.type === 'switch'"
            v-model="scope.row[item.value]"
            @change="switchClick($event, scope.row)"
          ></el-switch>
          <!-- 图片 -->
          <img
            v-else-if="item.type === 'image' && scope.row[item.value]"
            :src="scope.row[item.value]"
          />
          <span v-else>
            {{ scope.row[item.value] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="handle"
        :key="'handle'"
        :fixed="handle.fixed"
        align="center"
        :label="handle.label"
        :width="handle.width"
      >
        <template v-slot="scope">
          <div class="handerBox">
            <template v-for="(item, index) in handle.btList">
              <!-- 操作按钮 -->
              <span
                class="btn"
                :key="index"
                @click="handleClick(item.event, scope.row)"
                >{{ item.label }}</span
              >
            </template>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <template v-if="pager">
      <el-pagination
        style="text-align: center"
        class="tablePagination"
        popper-class="pageSelect"
        :current-page.sync="listInfo.query.currentPage"
        :page-sizes="listInfo.pageSizes"
        :page-size="listInfo.query.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="listInfo.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </template>
  </div>
</template>

<script>
export default {
  name: 'PageTable',
  props: {
    // 自定义类名
    className: {
      type: String
    },
    // 刷新
    refresh: {
      type: Number,
      default: 0
    },
    // 表格高度
    tableHeight: {
      type: Number
    },
    // 获取数据的接口
    api: {
      type: Function
    },
    // 是否有选择框
    checkBox: {
      type: Boolean,
      default: false
    },
    // 选中列表
    checkedList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 表格字段配置
    fieldList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 操作栏配置
    handle: {
      type: Object
    },
    // 是否分页
    pager: {
      type: Boolean,
      default: true
    },
    // 重置当前页
    initCurpage: {
      type: Number
    },
    // 查询条件
    query: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 列表数据
    data: {
      type: Array
    }
  },
  data () {
    return {
      // 列表相关
      listInfo: {
        tableHeight: 0, // 表格最大高度
        total: 0, // 总条数
        pageSizes: [10, 20, 50, 100], // 分页数量列表
        query: {
          // 查询条件
          currentPage: 1, // 当前页
          pageSize: 10 // 每页条数
        }
      }
    }
  },
  watch: {
    initCurpage () {
      this.listInfo.query.currentPage = 1
    },
    refresh () {
      if (!this.api) return
      this.getList(this.api)
    }
  },

  methods: {
    /**
     *  清空选中
     */
    clearSelection () {
      this.$refs.table.clearSelection()
    },
    /**
     *  派发按钮点击事件
     */
    handleClick (event, data) {
      this.$emit('handleClick', event, data)
    },
    /**
     * 开关控制点击
     */
    switchClick (event, data) {
      this.$emit('switchClick', event, data)
    },
    /**
     *  处理参数
     */
    handleParams () {
      const obj = {}
      for (const key in this.query) {
        if (this.query[key] || this.query[key] === 0) {
          obj[key] = this.query[key]
        }
      }
      // 如果不需要分页，则无分页相关参数
      return this.pager ? { ...this.listInfo.query, ...obj } : obj
    },
    /**
     *  得到数据
     */
    getList (api) {
      // 每次调用接口时都自动绑定最新的数据
      api(this.handleParams())
        .then(res => {
          if (res.data.code === 0) {
            // 使外面可以访问到表格数据
            if (res.data.data.data) {
              const arr = res.data.data.data
              arr.forEach(d => {
                if (d.deviceStatus === 'enabled') {
                  d.deviceStatus = true
                } else if (d.deviceStatus === 'disabled') {
                  d.deviceStatus = false
                }
              })
              const paginator = res.data.data.paginator
              this.$emit('update:data', arr)
              if (this.pager) {
                this.listInfo.total = paginator.totalCount
                this.listInfo.query.currentPage = paginator.page
                this.listInfo.query.pageSize = paginator.limit
              }
            } else if (res.data.data.records) {
              const arr = res.data.data.records
              const paginator = res.data.data
              this.$emit('update:data', arr)
              if (this.pager) {
                this.listInfo.total = paginator.total
                this.listInfo.query.currentPage = paginator.current
                this.listInfo.query.pageSize = paginator.size
              }
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    /**
     *  表格选中变化
     */
    selectionChange (val) {
      this.$emit('update:checkedList', val)
    },
    handleSizeChange (val) {
      const query = this.listInfo.query
      query.pageSize = val
      query.currentPage = 1 // 每页条数切换，重置当前页
      this.getList(this.api)
    },
    handleCurrentChange (val) {
      this.listInfo.query.currentPage = val
      this.getList(this.api)
    }
  }
}
</script>

<style lang="scss" scoped>
.tableBox {
  .handerBox {
    .btn {
      display: inline-block;
      width: 46px;
      height: 26px;
      background: #0b779e;
      cursor: pointer;
      font-size: 14px;
      color: #fefefe;
      line-height: 26px;
    }
    .btn:not(:last-child) {
      margin-right: 18px;
    }
  }
}
</style>
