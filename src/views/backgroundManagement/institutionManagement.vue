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
      <el-tree
        :data="deptTree"
        :props="deptTreeProps"
        default-expand-all
        @node-click="deptTreeClick"
        :expand-on-click-node="false"
        node-key="deptCode"
        :current-node-key="selectedDept.deptCode"
        v-if="selectedDept.deptCode"
        class="dept-tree"
      >
        <!-- <span
          class="custom-tree-node"
          slot-scope="{ node, data }"
          style="width: 100%"
        >
          <span class="nodeTitleSty" :title="node.label">{{ node.label }}</span>
          <div class="dept-btn" v-show="data.showSetting"></div>
        </span> -->
      </el-tree>
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
          <span class="people-search-text">搜索</span>
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
        <div class="clean-btn">清空</div>
        <div class="delete-btn" @click="deletePeopleClick">批量删除</div>
        <div class="add-btn" @click="addPeopleClick">添加</div>
      </div>
      <el-table
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

    <el-dialog
      :visible.sync="showAddPeople"
      :close-on-click-modal="clickfalse"
      width="480px"
      class="add-people-dlg"
    >
      <div class="add-people-header">
        <div class="header-icon"></div>
        <div class="header-text">{{ addPeopleTitle }}</div>
      </div>
      <el-form
        ref="addPeopleRef"
        :model="addPeopleForm"
        :rules="addPeopleRules"
        :inline="true"
        label-width="80px"
        class="add-people-form"
      >
        <el-form-item label="姓名" prop="name">
          <el-input
            v-model="addPeopleForm.name"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="six">
          <el-select
            v-model="addPeopleForm.six"
            :popper-append-to-body="false"
            placeholder="请选择"
          >
            <el-option
              v-for="item in sixTypes"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="身份证号" prop="idcard">
          <el-input
            v-model="addPeopleForm.idcard"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input
            v-model="addPeopleForm.phone"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属机构" prop="dept">
          <el-cascader
            v-model="addPeopleForm.dept"
            :options="deptTree"
            :props="{
              expandTrigger: 'hover',
              label: 'deptName',
              value: 'deptCode',
            }"
            :show-all-levels="false"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="办公电话" prop="telphone">
          <el-input
            v-model="addPeopleForm.telphone"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="num">
          <el-input v-model="addPeopleForm.num" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input
            v-model="addPeopleForm.note"
            placeholder="请输入"
            type="textarea"
            resize="none"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="confirm-tool">
        <div class="confirm-btn" @click="addPeopleConfirmClick">确定</div>
        <div class="cancel-btn" @click="addPeopleCancelClick">取消</div>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="showDeleteTip"
      append-to-body
      :close-on-click-modal="false"
      width="328px"
      class="delete-tip-dial"
    >
      <div>
        <div style="margin-top: 47px; height: 14px">
          <div class="warning-img"></div>
          <div class="title1">您确认删除这些数据吗？</div>
        </div>
        <div class="title2">
          <span style="color: #ff0000">删除后无法撤销，</span>
          <span style="color: #ffffff">您还要继续吗？</span>
        </div>
        <div style="margin-top: 21px">
          <div class="confirm-btn" @click="deleteTipConfirmClick">确定</div>
          <div class="cancel-btn" @click="deleteTipCancelClick">取消</div>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="showPeopleInfo"
      :close-on-click-modal="clickfalse"
      width="540px"
      class="add-people-dlg"
    >
      <div class="add-people-header">
        <div class="header-icon"></div>
        <div class="header-text">查看人员信息</div>
      </div>
      <el-form
        :model="peopleInfoForm"
        :inline="true"
        label-width="80px"
        class="add-people-form"
      >
        <el-form-item label="姓名:" prop="name">
          <div class="subtext1">{{ peopleInfoForm.name }}</div>
        </el-form-item>
        <el-form-item label="性别:" prop="six">
          <div class="subtext1">{{ peopleInfoForm.six }}</div>
        </el-form-item>
        <el-form-item label="身份证号:" prop="idcard">
          <div class="subtext1">{{ peopleInfoForm.idcard }}</div>
        </el-form-item>
        <el-form-item label="联系方式:" prop="phone">
          <div class="subtext1">{{ peopleInfoForm.phone }}</div>
        </el-form-item>
        <el-form-item label="所属机构:" prop="dept">
          <div class="subtext1">{{ peopleInfoForm.dept }}</div>
        </el-form-item>
        <el-form-item label="办公电话:" prop="telphone">
          <div class="subtext1">{{ peopleInfoForm.telphone }}</div>
        </el-form-item>
        <el-form-item label="排序:" prop="num">
          <div class="subtext1">{{ peopleInfoForm.num }}</div>
        </el-form-item>
        <el-form-item label="备注:" prop="note">
          <div class="subtext1">{{ peopleInfoForm.note }}</div>
        </el-form-item>
      </el-form>
      <div class="confirm-tool">
        <div class="confirm-btn" @click="seePeopleConfirmClick">确定</div>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="showAddDept"
      :close-on-click-modal="clickfalse"
      width="1080px"
      class="add-dept-dlg"
    >
      <div class="add-dept-header">
        <div class="header-icon"></div>
        <div class="header-text">{{ addDeptTitle }}</div>
      </div>
      <gMap
        ref="gduMap"
        handleType="devMap"
        :bShowSimpleSearchTools="false"
        :bShowBasic="false"
        :bShowMeasure="false"
        :bAutoLocate="false"
      ></gMap>
      <div class="confirm-tool">
        <div class="confirm-btn" @click="addDeptConfirmClick">确定</div>
        <div class="cancel-btn" @click="addDeptCancelClick">取消</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      peopleSearchIcon: require('../../assets/images/backgroundManagement/searchIcon.png'),
      peopleResetIcon: require('../../assets/images/backgroundManagement/resetIcon.png'),
      clickfalse: false,

      institutionSearch: '',
      deptTree: [
        {
          deptName: '湖北省应急管理厅',
          deptCode: '1',
          showSetting: true,
          children: [
            {
              deptName: '孝感市应急管理局',
              deptCode: '1-1',
              showSetting: false
            },
            {
              deptName: '武汉市应急管理局',
              deptCode: '1-2',
              showSetting: false,
              children: [
                {
                  deptName: '江夏区应急管理所',
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
      addPeopleTitle: '新增人员',
      addPeopleForm: {
        name: '',
        six: '',
        idcard: '',
        phone: '',
        dept: '',
        telphone: '',
        num: '',
        note: ''
      },
      addPeopleRules: {
        name: [{ required: true, message: '请输入' }],
        dept: [{ required: true, message: '请选择' }]
      },
      sixTypes: [
        {
          id: 1,
          label: '男'
        },
        {
          id: 2,
          label: '女'
        }
      ],
      showDeleteTip: false,
      showPeopleInfo: false,
      peopleInfoForm: {
        name: '宋运辉',
        six: '男',
        idcard: '000000000000000000',
        phone: '00000000000',
        dept: '东海化工',
        telphone: '02700000000',
        num: '02',
        note: '东海化工常务副厂长'
      },
      showAddDept: true,
      addDeptTitle: '新增机构'
    }
  },
  created () {
    this.selectedDept = this.deptTree[0]
  },
  methods: {
    // 搜索机构时触发
    institutionSearchChange () {},

    // 点击机构时触发
    deptTreeClick (item) {
      if (item === this.selectedDept) {
        // console.log('选择的机构与上一次相同')
        return
      }
      this.selectedDept.showSetting = false
      item.showSetting = true
      this.selectedDept = item
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

    // 修改时触发
    editPeopleClick () {
      this.showAddPeople = true
    },

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

    // 删除人员时触发
    deletePeopleClick () {
      this.showDeleteTip = true
    },

    // 删除人员确定时触发
    deleteTipConfirmClick () {
      this.showDeleteTip = false
    },

    // 删除人员取消时触发
    deleteTipCancelClick () {
      this.showDeleteTip = false
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
      }
      .el-tree-node__content:hover,
      .el-tree-node:focus > .el-tree-node__content {
        color: #fff;
        background-color: transparent !important;
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
    .clean-btn {
      width: 32px;
      height: 20px;
      margin-top: 18px;
      margin-left: 30px;
      display: inline-block;
      color: #1d9fe5;
      font-size: 16px;
      border-bottom: solid 1px #1d9fe5;
      cursor: pointer;
    }
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
.el-table {
  color: #c5f3ff;
  font-size: 16px;
  background: transparent;
  border: none;
  /* 表格表头样式 */
  /deep/.el-table__header-wrapper th {
    color: #c5f3ff;
    font-size: 16px;
    height: 40px;
    padding: 0;
    background-color: rgba($color: #0b779e, $alpha: 0.66);
  }
  /* 表格每行高度*/
  /deep/.el-table__body td {
    height: 38px;
    padding: 0;
  }
  /* 每行的背景颜色 */
  /deep/.el-table__body td {
    background-color: transparent;
  }
  /* 所有单元格颜色、无边框 */
  /deep/td,
  /deep/tr,
  /deep/th {
    border: none;
    background-color: transparent;
  }
  /* 复选框样式 */
  /deep/.el-checkbox__inner {
    background-color: transparent;
    border-color: #c5f3ff;
    border-radius: 0px;
  }
  // /deep/.el-checkbox__input.is-checked {
  //   // background-color: #00cff9;
  //   border-radius: 2px;
  // }
  /*鼠标移入某行时的背景色*/
  /deep/tbody tr:hover > td {
    background-color: transparent;
  }
}
/* 去除表格底部线条 */
.el-table::before {
  height: 0px;
}
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

.add-people-dlg.el-dialog__wrapper {
  /deep/.el-dialog {
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 0px 20px;
      width: 100%;
      border: 1px solid #1eb0fc;
      background-color: #121e3a;
      .add-people-header {
        height: 40px;
        border-bottom: 1px solid #1eb0fc;
        .header-icon {
          display: inline-block;
          width: 22px;
          height: 16px;
          background-image: url("../../assets/images/fire_title.png");
          margin-top: 15px;
        }
        .header-text {
          display: inline-block;
          vertical-align: top;
          margin-top: 13px;
          margin-left: 10px;
          font-size: 14px;
          color: #fff;
        }
      }
    }
    .add-people-form {
      margin-top: 35px;
      .el-input__inner {
        background-color: rgba($color: #09546d, $alpha: 0.3);
        border-color: #1eb0fc;
        border-radius: 0;
        width: 150px;
        height: 24px;
        color: #fff;
        font-size: 12px;
      }
      .el-form-item {
        margin-top: -20px;
      }
      .el-form-item__label {
        color: #fff;
        font-size: 12px;
      }
      .el-form-item__error {
        margin-top: -10px;
      }
      .el-textarea__inner {
        background-color: rgba($color: #09546d, $alpha: 0.3);
        border-color: #1eb0fc;
        border-radius: 0;
        width: 390px;
        height: 78px;
        color: #fff;
        font-size: 12px;
        margin-top: 8px;
      }
      .subtext1 {
        color: #fff;
        font-size: 12px;
        width: 180px;
      }
    }
    .confirm-tool {
      height: 50px;
      .confirm-btn {
        float: right;
        width: 66px;
        height: 30px;
        background-color: #1eb0fc;
        border-radius: 4px;
        color: #fff;
        font-size: 14px;
        text-align: center;
        line-height: 30px;
        cursor: pointer;
      }
      .cancel-btn {
        float: right;
        width: 66px;
        height: 30px;
        background-color: transparent;
        border: 1px solid #1eb0fc;
        border-radius: 4px;
        color: #fff;
        font-size: 14px;
        text-align: center;
        line-height: 30px;
        margin-right: 20px;
        cursor: pointer;
      }
    }
  }
}

.delete-tip-dial.el-dialog__wrapper {
  /deep/.el-dialog {
    background-color: transparent;
    box-shadow: none;
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      display: inline-block;
      padding: 0;
      width: 100%;
      height: 155px;
      border: 1px solid #1eb0fc;
      background-color: #121e3a;
      .warning-img {
        background-image: url("../../assets/images/backgroundManagement/warning.png");
        width: 15px;
        height: 14px;
        display: inline-block;
        vertical-align: top;
        margin-left: 42px;
      }
      .title1 {
        color: #ffffff;
        font-size: 14px;
        height: 14px;
        line-height: 14px;
        display: inline-block;
        vertical-align: top;
        margin-left: 13px;
      }
      .title2 {
        margin-left: 70px;
        height: 14px;
        font-size: 14px;
        line-height: 14px;
        margin-top: 11px;
      }
      .confirm-btn {
        width: 70px;
        height: 24px;
        background-color: #00cff9;
        float: right;
        margin-right: 19px;
        border-radius: 4px;
        color: white;
        font-size: 12px;
        text-align: center;
        line-height: 24px;
        cursor: pointer;
      }
      .cancel-btn {
        width: 70px;
        height: 24px;
        background-color: transparent;
        float: right;
        margin-right: 10px;
        color: #00cff9;
        font-size: 12px;
        text-align: center;
        line-height: 24px;
        border: 1px solid #00cff9;
        border-radius: 4px;
        cursor: pointer;
      }
    }
  }
}

.add-dept-dlg.el-dialog__wrapper {
  /deep/.el-dialog {
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 0px 20px;
      width: 100%;
      border: 1px solid #1eb0fc;
      background-color: #121e3a;
      .add-dept-header {
        height: 40px;
        .header-icon {
          display: inline-block;
          width: 22px;
          height: 16px;
          background-image: url("../../assets/images/fire_title.png");
          margin-top: 15px;
        }
        .header-text {
          display: inline-block;
          vertical-align: top;
          margin-top: 13px;
          margin-left: 10px;
          font-size: 14px;
          color: #fff;
        }
      }
    }
    .confirm-tool {
      height: 50px;
      margin-top: 20px;
      .confirm-btn {
        float: right;
        width: 66px;
        height: 30px;
        background-color: #1eb0fc;
        border-radius: 4px;
        color: #fff;
        font-size: 14px;
        text-align: center;
        line-height: 30px;
        cursor: pointer;
      }
      .cancel-btn {
        float: right;
        width: 66px;
        height: 30px;
        background-color: transparent;
        border: 1px solid #1eb0fc;
        border-radius: 4px;
        color: #fff;
        font-size: 14px;
        text-align: center;
        line-height: 30px;
        margin-right: 20px;
        cursor: pointer;
      }
    }
  }
}
</style>
