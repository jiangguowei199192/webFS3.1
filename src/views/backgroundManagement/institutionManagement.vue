<template>
  <div>
    <div class="title">基础数据 / 机构管理</div>
    <div class="left-div">
      <div class="left-title">组织机构树</div>
      <el-input
        class="institution-search-input"
        suffix-icon="el-icon-search"
        v-model="institutionSearch"
        placeholder=""
        @change="institutionSearchChange"
      ></el-input>
      <div v-show="showDeptTreeRightMenu">
        <ul id="menu" class="dept-tree-right-menu">
          <li class="menu-item" @click="deptEditClick">
            <div class="menu-div">
              <el-image :src="deptEditIcon" class="item-icon"></el-image>
              <span class="item-span">编辑</span>
            </div>
          </li>
          <li class="menu-item" @click="deptSeeClick">
            <div class="menu-div">
              <el-image :src="deptSeeIcon" class="item-icon"></el-image>
              <span class="item-span">查看</span>
            </div>
          </li>
          <li class="menu-item" @click="deptDeleteClick">
            <div class="menu-div">
              <el-image :src="deptDeleteIcon" class="item-icon"></el-image>
              <span class="item-span">删除</span>
            </div>
          </li>
        </ul>
      </div>
      <el-tree
        :data="deptTree"
        :props="deptTreeProps"
        default-expand-all
        node-key="deptCode"
        :current-node-key="selectedDept.deptCode"
        v-if="selectedDept.deptCode"
        class="dept-tree"
        @node-contextmenu="deptTreeRightCick"
      ></el-tree>
      <div class="add-institution-btn" @click="addDeptClick">╋ 新增机构</div>
    </div>
    <div class="right-div">
      <div class="right-title">人员列表</div>
      <div class="search-tool">
        <el-input
          class="people-search-input"
          v-model="peopleSearch"
          placeholder="请输入人员姓名/身份证号进行搜索"
        ></el-input>
        <div class="people-search-btn" @click="peopleSearchClick">
          <img :src="peopleSearchIcon" class="people-search-icon" />
          <span class="people-search-text">查询</span>
        </div>
        <div class="people-reset-btn" @click="peopleResetClick">
          <img :src="peopleResetIcon" class="people-reset-icon" />
          <span class="people-reset-text">重置</span>
        </div>
      </div>
      <div class="operate-table-tool">
        <span class="selected-count"
          >已选<span style="color: #1eb0fc">0</span>项</span
        >
        <!-- <div class="clean-btn">清空</div> -->
        <div class="delete-btn" @click="deletePeopleClick">批量删除</div>
        <div class="add-btn" @click="addPeopleClick">添加</div>
      </div>
      <el-table
        class="manageTable"
        :data="peopleList"
        empty-text="暂无数据"
        height="630"
        @row-click="clickTableRow"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column
          label="姓名"
          prop="name"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="所属机构"
          prop="institution"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="联系方式"
          prop="phone"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="排序"
          prop="num"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div class="table-btn" @click="editPeopleClick(scope.row)">
              修改
            </div>
            <div
              class="table-btn table-btn-see"
              @click="seePeopleClick(scope.row)"
            >
              查看
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center">
        <el-pagination
          class="tablePagination"
          popper-class="pageSelect"
          :total="pageTotal"
          :page-size="pageSize"
          :current-page.sync="currentPage"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="currentPageChange"
        ></el-pagination>
      </div>
    </div>

    <AddPeopleDialog
      :isShow.sync="showAddPeople"
      title="新增人员"
      :deptTree="deptTree"
      @close="showAddPeople = false"
      @confirmClick="addPeopleConfirmClick"
      @cancelClick="addPeopleCancelClick"
    ></AddPeopleDialog>

    <AddPeopleDialog
      :isShow.sync="showEditPeople"
      title="修改人员"
      :deptTree="deptTree"
      @close="showEditPeople = false"
      @confirmClick="editPeopleConfirmClick"
      @cancelClick="editPeopleCancelClick"
    ></AddPeopleDialog>

    <PeopleInfoDialog
      :isShow.sync="showPeopleInfo"
      @close="showPeopleInfo = false"
      @confirmClick="showPeopleInfo = false"
    ></PeopleInfoDialog>

    <DeleteDialog
      :isShow.sync="showDeleteTip"
      @close="showDeleteTip = false"
      @confirmClick="deleteTipConfirmClick"
      @cancelClick="showDeleteTip = false"
    ></DeleteDialog>

    <AddDeptDialog
      :isShow.sync="showAddDept"
      :deptTree="deptTree"
      @close="showAddDept = false"
      @confirmClick="addDeptConfirmClick"
      @cancelClick="addDeptCancelClick"
    ></AddDeptDialog>
  </div>
</template>

<script>
import AddPeopleDialog from './components/addPeopleDialog.vue'
import DeleteDialog from './components/deleteDialog.vue'
import PeopleInfoDialog from './components/peopleInfoDialog.vue'
import AddDeptDialog from './components/addDeptDialog.vue'

export default {
  components: {
    AddPeopleDialog,
    DeleteDialog,
    PeopleInfoDialog,
    AddDeptDialog
  },
  data () {
    return {
      peopleSearchIcon: require('../../assets/images/backgroundManagement/searchIcon.png'),
      peopleResetIcon: require('../../assets/images/backgroundManagement/resetIcon.png'),
      deptEditIcon: require('../../assets/images/backgroundManagement/deptEdit.png'),
      deptSeeIcon: require('../../assets/images/backgroundManagement/deptSee.png'),
      deptDeleteIcon: require('../../assets/images/backgroundManagement/deptDelete.png'),

      institutionSearch: '',
      deptTree: [
        {
          deptName: '东海化工',
          deptCode: '1',
          showSetting: true,
          children: [
            {
              deptName: '东海化工一厂',
              deptCode: '1-1',
              showSetting: false,
              children: [
                {
                  deptName: '东海化工一厂一车间',
                  deptCode: '1-1-1',
                  showSetting: false
                }
              ]
            },
            {
              deptName: '东海化工二厂',
              deptCode: '1-2',
              showSetting: false,
              children: [
                {
                  deptName: '东海化工二厂一车间',
                  deptCode: '1-2-1',
                  showSetting: false
                }
              ]
            }
          ]
        }
      ],
      deptTreeProps: {
        children: 'children',
        label: 'deptName',
        value: 'deptCode'
      },
      selectedDept: '',
      showDeptTreeRightMenu: false,
      peopleSearch: '',
      peopleList: [
        {
          name: '宋运辉',
          institution: '东海化工',
          phone: '13687909090',
          num: 1
        }
      ],
      pageTotal: 100,
      pageSize: 0,
      currentPage: 1,
      showAddPeople: false,
      showEditPeople: false,
      showDeleteTip: false,
      showPeopleInfo: false,
      showAddDept: false
    }
  },
  created () {
    this.selectedDept = this.deptTree[0]
  },
  methods: {
    // 搜索机构时触发
    institutionSearchChange () {},

    // 右击机构时触发
    deptTreeRightCick (event, data, node, obj) {
      this.showDeptTreeRightMenu = false
      this.showDeptTreeRightMenu = true
      const menu = document.querySelector('#menu')
      menu.style.left = event.clientX + 'px'
      menu.style.top = event.clientY + 'px'
      // 给整个document添加监听鼠标事件，点击任何位置执行closeRightMenu方法，及时将菜单关闭
      document.addEventListener('click', this.closeRightMenu)
    },
    closeRightMenu () {
      this.showDeptTreeRightMenu = false
      // 及时关掉鼠标监听事件
      document.removeEventListener('click', this.closeRightMenu)
    },

    // 添加机构时触发
    addDeptClick () {
      this.showAddDept = true
    },

    // 添加机构确定时触发
    addDeptConfirmClick () {
      this.showAddDept = false
    },

    // 添加机构取消时触发
    addDeptCancelClick () {
      this.showAddDept = false
    },

    // 搜索人员时触发
    peopleSearchClick () {},

    // 重置时触发
    peopleResetClick () {},

    // 点击表格某一行时触发
    clickTableRow () {},

    // 多选时触发
    handleSelectionChange () {},

    // 查看时触发
    seePeopleClick () {
      this.showPeopleInfo = true
    },

    // 查看确定时触发
    seePeopleConfirmClick () {
      this.showPeopleInfo = false
    },

    // 切换分页时触发
    currentPageChange () {},

    // 添加人员时触发
    addPeopleClick () {
      this.showAddPeople = true
    },

    // 添加人员确定时触发
    addPeopleConfirmClick () {
      this.showAddPeople = false
    },

    // 添加人员取消时触发
    addPeopleCancelClick () {
      this.showAddPeople = false
    },

    // 编辑人员时触发
    editPeopleClick () {
      this.showEditPeople = true
    },

    // 编辑人员确定时触发
    editPeopleConfirmClick () {
      this.showEditPeople = false
    },

    // 编辑人员取消时触发
    editPeopleCancelClick () {
      this.showEditPeople = false
    },

    // 删除人员时触发
    deletePeopleClick () {
      this.showDeleteTip = true
    },

    // 删除人员确定时触发
    deleteTipConfirmClick () {
      this.showDeleteTip = false
    },

    // 编辑机构
    deptEditClick () {
      console.log('编辑机构')
    },

    // 查看机构
    deptSeeClick () {
      console.log('查看机构')
    },

    // 删除机构
    deptDeleteClick () {
      console.log('删除机构')
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  height: 54px;
  font-size: 16px;
  line-height: 54px;
  margin-left: 30px;
  margin-right: 30px;
}
.left-div {
  float: left;
  width: 280px;
  height: 814px;
  background-color: #183157;
  margin-left: 30px;
  padding: 0 10px;
  .left-title {
    color: #ffffff;
    font-size: 16px;
    height: 42px;
    line-height: 42px;
  }
  .institution-search-input {
    width: 278px;
    margin-top: 4px;
    /deep/.el-input__inner {
      background: #09546d;
      border-color: #1eb0fc;
      border-radius: 0;
      color: white;
    }
    /deep/.el-icon-search {
      color: #c5f3ff;
    }
  }
  .dept-tree {
    height: 646px;
    overflow: auto;
    margin-top: 15px;
    background-color: transparent;
    color: #ffffff;
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
  .add-institution-btn {
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

.dept-btn {
  width: 18px;
  height: 18px;
  display: inline-block;
  vertical-align: middle;
  background: orange;
}
.right-div {
  height: 814px;
  background-color: #183157;
  margin-left: 360px;
  margin-right: 30px;
  padding: 0 14px;
  .right-title {
    color: #ffffff;
    font-size: 16px;
    height: 42px;
    line-height: 42px;
  }
  .search-tool {
    height: 34px;
    margin-top: 4px;
    .people-search-input {
      width: 450px;
      vertical-align: top;
      /deep/.el-input__inner {
        background: #09546d;
        border-color: #1eb0fc;
        border-radius: 0;
        color: white;
      }
    }
    .people-search-btn {
      width: 80px;
      height: 34px;
      display: inline-block;
      margin-left: 10px;
      background: -webkit-linear-gradient(top, #086384, #0b779e);
      font-size: 16px;
      line-height: 34px;
      color: #c5f3ff;
      text-align: center;
      vertical-align: top;
      cursor: pointer;
      .people-search-icon {
        margin-top: 5px;
      }
      .people-search-text {
        display: inline-block;
        vertical-align: top;
        margin-left: 5px;
      }
    }
    .people-reset-btn {
      width: 80px;
      height: 34px;
      display: inline-block;
      margin-left: 10px;
      background: -webkit-linear-gradient(top, #086384, #0b779e);
      font-size: 16px;
      line-height: 34px;
      color: #c5f3ff;
      text-align: center;
      cursor: pointer;
      .people-reset-icon {
        margin-top: 8px;
      }
      .people-reset-text {
        display: inline-block;
        vertical-align: top;
        margin-left: 5px;
      }
    }
  }
  .operate-table-tool {
    height: 53px;
    .selected-count {
      display: inline-block;
      margin-top: 18px;
      margin-left: 10px;
    }
    // .clean-btn {
    //   width: 32px;
    //   height: 20px;
    //   margin-top: 18px;
    //   margin-left: 30px;
    //   display: inline-block;
    //   color: #1d9fe5;
    //   font-size: 16px;
    //   border-bottom: solid 1px #1d9fe5;
    //   cursor: pointer;
    // }
    .delete-btn {
      float: right;
      width: 96px;
      height: 30px;
      margin-top: 10px;
      background-color: #ff0000;
      color: #ffffff;
      text-align: center;
      line-height: 30px;
      font-size: 16px;
      cursor: pointer;
    }
    .add-btn {
      float: right;
      margin-right: 12px;
      margin-top: 10px;
      width: 54px;
      height: 30px;
      background-color: #1eb0fc;
      color: #ffffff;
      text-align: center;
      line-height: 30px;
      font-size: 16px;
      cursor: pointer;
    }
  }
}
// .el-table {
//   color: #c5f3ff;
//   font-size: 16px;
//   background: transparent;
//   border: none;
//   /* 表格表头样式 */
//   /deep/.el-table__header-wrapper th {
//     color: #c5f3ff;
//     font-size: 16px;
//     height: 40px;
//     padding: 0;
//     background-color: rgba($color: #0b779e, $alpha: 0.66);
//   }
//   /* 表格每行高度*/
//   /deep/.el-table__body td {
//     height: 38px;
//     padding: 0;
//   }
//   /* 每行的背景颜色 */
//   /deep/.el-table__body td {
//     background-color: transparent;
//   }
//   /* 所有单元格颜色、无边框 */
//   /deep/td,
//   /deep/tr,
//   /deep/th {
//     border: none;
//     background-color: transparent;
//   }
//   /* 复选框样式 */
//   /deep/.el-checkbox__inner {
//     background-color: transparent;
//     border-color: #c5f3ff;
//     border-radius: 0px;
//   }
//   // /deep/.el-checkbox__input.is-checked {
//   //   // background-color: #00cff9;
//   //   border-radius: 2px;
//   // }
//   /*鼠标移入某行时的背景色*/
//   /deep/tbody tr:hover > td {
//     background-color: transparent;
//   }
// }
// /* 去除表格底部线条 */
// .el-table::before {
//   height: 0px;
// }
.table-btn {
  width: 46px;
  height: 26px;
  background-color: #0b779e;
  color: #fefefe;
  font-size: 14px;
  line-height: 26px;
  display: inline-block;
  cursor: pointer;
}
.table-btn-see {
  margin-left: 18px;
}

.dept-tree-right-menu {
  z-index: 1;
  position: absolute;
  height: 81px;
  width: 80px;
  border-radius: 2px;
  background-color: #183157;
  border: 1px solid #00ccff;
  overflow: hidden;
  .menu-item {
    cursor: pointer;
    text-align: center;
    padding: 0 5px;
    .menu-div {
      border-bottom: 1px solid rgba($color: #00ccff, $alpha: 0.8);
      height: 27px;
      .item-icon {
        width: 14px;
        height: 14px;
        top: 3px;
      }
      .item-span {
        display: inline-block;
        margin-left: 10px;
        font-size: 12px;
        color: #fff;
        line-height: 27px;
      }
    }
  }
}
</style>
