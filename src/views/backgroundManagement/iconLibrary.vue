<template>
  <div class="iconLibrary">
    <!-- 用户权限/角色管理 -->
    <div class="breadTitle">素材中心 / 图标库</div>
    <div class="contentBox">
      <div>图标列表</div>
      <div class="selectBox">
        <span>图标状态：</span>
        <el-select
          v-model="status"
          placeholder="请选择"
          style="width:150px;height:34px;margin-right:20px;"
        >
          <el-option label="全部" value="all"></el-option>
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <span>是否引用：</span>
        <el-select
          v-model="isRequired"
          placeholder="请选择"
          style="width:150px;height:34px;margin-right:10px;"
        >
          <el-option label="全部" value="all"></el-option>
          <el-option
            v-for="item in requiedOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-input
          v-model.trim="iconName"
          maxlength="10"
          style="width:450px;height:34px;margin-right:10px;"
          placeholder="请输入图标名称进行搜索"
        ></el-input>
        <div class="btn">
          <img :src="userSerchIcon" alt />
          <span>搜索</span>
        </div>
        <div class="btn">
          <img :src="userResetIcon" alt />
          <span>重置</span>
        </div>
      </div>
      <div class="operate">
        <div class="slectedNum">
          已选
          <span>{{multipleSelection.length}}</span> 项
        </div>
        <div>
          <el-button class="add">添加</el-button>
          <el-button class="delete">批量删除</el-button>
        </div>
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%;"
        max-height="610"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column label="图片" align="center">
          <template slot-scope="scope">{{ scope.row.pic }}</template>
        </el-table-column>
        <el-table-column prop="name" label="名称" align="center"></el-table-column>
        <el-table-column prop="bigness" label="大小" align="center"></el-table-column>
        <el-table-column prop="size" label="尺寸" align="center"></el-table-column>
        <el-table-column prop="date" label="时间" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span
              :style="{color:scope.row.status==='1'?
 '#C5F3FF':'#f00'}"
            >{{scope.row.status==='1'?'正常':'异常'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="isRequired" label="是否引用" align="center">
          <template slot-scope="scope">
            <span
              :style="{color:scope.row.isRequired==='1'?
 '#C5F3FF': '#999'}"
            >{{scope.row.isRequired===1?'已引用':'未引用'}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="tablePagination webFsScroll"
        style="text-align: right;padding-right: 47px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.curPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.totalCount"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      userSerchIcon: require('../../assets/images/backgroundManagement/searchIcon.png'),
      userResetIcon: require('../../assets/images/backgroundManagement/resetIcon.png'),
      statusOptions: [
        {
          value: '0',
          label: '失效'
        },
        {
          value: '1',
          label: '正常'
        }
      ],
      status: 'all',
      requiedOptions: [
        {
          value: '0',
          label: '未引用'
        },
        {
          value: '1',
          label: '已引用'
        }
      ],
      isRequired: 'all',
      iconName: '', // 图标名称
      tableData: [
        {
          pic: '2016-05-03',
          name: '王小虎',
          bigness: '12213321',
          size: '4X4',
          date: 20111111,
          status: '0',
          isRequired: '0'
        },
        {
          pic: '2016-05-03',
          name: '王小虎',
          bigness: '12213321',
          size: '4X4',
          date: 20111111,
          status: '1',
          isRequired: '1'
        },
        {
          pic: '2016-05-03',
          name: '王小虎',
          bigness: '12213321',
          size: '4X4',
          date: 20111111,
          status: '1',
          isRequired: '1'
        }
      ],
      multipleSelection: [], // 保存选择的数据
      pageInfo: {
        curPage: 1,
        pageSize: 10,
        totalCount: 100
      }
    }
  },
  methods: {
    // 表格多选选择方法
    handleSelectionChange (val) {
      console.log(val)
      this.multipleSelection = val
    },
    // 切换每页条数
    handleSizeChange (pageSize) {
      console.log(`每页 ${pageSize} 条`)
      this.pageInfo.pageSize = pageSize
    },
    // 切换当前页
    handleCurrentChange (curPage) {
      console.log(`当前页: ${curPage}`)
      this.pageInfo.curPage = curPage
    }
  }
}
</script>
<style lang="less" scoped>
.iconLibrary {
  box-sizing: border-box;
  padding: 20px 30px;
  font-size: 16px;
  font-family: Source Han Sans CN;

  .breadTitle {
    font-weight: 500;
    color: #ffffff;
  }
  .contentBox {
    box-sizing: border-box;
    margin-top: 16px;
    padding: 12px 14px;
    height: 814px;
    background: #183157;
    position: relative;
    .selectBox {
      margin-left: 10px;
      margin-top: 18px;
      // .customSelect{
      //   width:150px;
      //   height:34px;
      // }
      /deep/ .el-input {
        .el-input__inner {
          background: #09546d;
          border: 1px solid #1eb0fc;
          border-radius: 0;
          color: #fff;
        }
      }
      .btn {
        width: 80px;
        height: 34px;
        line-height: 34px;
        text-align: center;
        display: inline-block;
        vertical-align: middle;
        background: linear-gradient(120deg, #086384, #0b779e);
        cursor: pointer;
        img {
          vertical-align: middle;
          margin-right: 6px;
        }
      }
      .btn + .btn {
        margin-left: 10px;
      }
    }
    .operate {
      display: flex;
      justify-content: space-between;
      box-sizing: border-box;
      padding-left: 30px;
      margin-top: 10px;
      margin-bottom: 13px;
      font-size: 16px;
      font-weight: 400;
      div.slectedNum {
        position: relative;
        top: 6px;
        span {
          color: #1d9fe5;
        }
      }
      > div:nth-child(2) {
        /deep/ .el-button {
          padding: 0;
          color: #fff;
          border: none;
          border-radius: 0;
        }
        .add {
          width: 54px;
          height: 30px;
          background: #1eb0fc;
        }
        .delete {
          width: 96px;
          height: 30px;
          background: #f00;
        }
      }
    }
    // 表格样式
    /deep/ .el-table__header-wrapper table thead th {
      font-size: 16px;
      font-family: Source Han Sans CN;
      font-weight: 500;
      color: #c5f3ff;
      background-color: #0f5f86;
      padding: 0;
      height: 40px;
      line-height: 40px;
    }
    /deep/ .el-table {
      background: #183157;
    }
    /deep/ .el-table__header-wrapper table thead th .cell {
      line-height: 16px;
    }
    /deep/ .el-table__body-wrapper table tr {
      background: #183157;
      font-size: 16px;
      font-family: Source Han Sans CN;
      font-weight: 500;
      color: #c5f3ff;
    }
    /deep/ .el-table__body-wrapper table tr td {
      padding: 0;
      height: 38px;
      line-height: 38px;
    }
    /deep/ .el-table__body-wrapper table tr:hover td {
      background: rgba(15, 95, 134, 0.5);
    }
    /deep/ .el-table td,
    /deep/ .el-table th.is-leaf {
      border-bottom: none;
    }
    .el-table::before {
      left: 0;
      bottom: 0;
      width: 100%;
      height: 0;
    }
    /deep/ .el-checkbox__inner {
      background-color: #183157;
    }
    /deep/ .el-checkbox__input.is-checked .el-checkbox__inner,
    /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner {
      // background-color: #183157;
      border-color: #c5f3ff;
    }
    .tablePagination {
      position: absolute;
      bottom: 20px;
      right: 20px;
    }
  }
}
</style>
