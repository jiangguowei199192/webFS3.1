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
        <!-- <div class="clean-btn">清空</div> -->
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
      class="show-people-dlg"
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
      <div class="note">
        <div>
          <span>创建时间：11111111111111</span>
          <span style="display: inline-block; margin-left: 20px"
            >创建人：2222</span
          >
        </div>
        <div style="margin-top: 10px">
          <span>最后修改时间：3333333333333333</span>
          <span style="display: inline-block; margin-left: 20px"
            >最后修改人：4444</span
          >
        </div>
      </div>
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
      <div class="add-dept-div">
        <gMap
          ref="gduMap"
          handleType="devMap"
          :bShowAllTools="false"
          :baseMapIndex="2"
          class="map-tool"
        ></gMap>
        <div class="add-dept-header">
          <div class="header-icon"></div>
          <div class="header-text">{{ addDeptTitle }}</div>
        </div>
        <transition name="showUnfoldBtn">
          <div
            class="unfold-btn"
            @click="unfoldClick"
            v-show="showUnfoldBtn"
          ></div>
        </transition>
        <transition name="hideCourseList">
          <div class="add-dept-base" v-show="showDeptContent">
            <div class="fold-tool">
              <div class="fold-btn" @click="foldClick"></div>
            </div>
            <div class="add-dept-content">
              <div class="content-header">
                <div class="icon"></div>
                <div class="text">{{ addDeptTitle }}</div>
              </div>
              <el-form
                ref="addDeptRef"
                :model="addDeptForm"
                :rules="addDeptRules"
                :inline="true"
                label-width="80px"
                class="add-dept-form"
              >
                <el-form-item label="机构名称" prop="deptName">
                  <el-input
                    v-model="addDeptForm.deptName"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
                <el-form-item label="机构地址" prop="address">
                  <el-input
                    v-model="addDeptForm.address"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
                <el-form-item label="上级机构" prop="fatherDept">
                  <el-cascader
                    v-model="addDeptForm.fatherDept"
                    :options="deptTree"
                    :props="{
                      expandTrigger: 'hover',
                      label: 'deptName',
                      value: 'deptCode',
                    }"
                    :show-all-levels="false"
                  ></el-cascader>
                </el-form-item>
                <el-form-item label="机构电话">
                  <el-input
                    v-model="addDeptForm.phone"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
                <el-form-item label="机构编码">
                  <el-input
                    v-model="addDeptForm.deptCode"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
                <el-form-item label="机构简称">
                  <el-input
                    v-model="addDeptForm.shortName"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
                <el-form-item label="经度">
                  <el-input
                    v-model="addDeptForm.longitude"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
                <el-form-item label="纬度">
                  <el-input
                    v-model="addDeptForm.latitude"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
                <el-form-item label="机构状态">
                  <el-select
                    v-model="addDeptForm.status"
                    :popper-append-to-body="false"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in deptStatusTypes"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="排序">
                  <el-input
                    v-model="addDeptForm.num"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
                <el-form-item label="图标">
                  <div class="icon-tool">
                    <el-avatar :size="30" :src="deptIconUrl"></el-avatar>
                    <el-popover
                      placement="top"
                      trigger="click"
                      popper-class="iconPopover"
                      v-model="showPopover"
                    >
                      <div class="iconBox">
                        <span
                          class="close"
                          @click.stop="showPopover = false"
                        ></span>
                        <span
                          @click.stop="selectIcon(item)"
                          class="icon"
                          v-for="(item, index) in icons"
                          :key="index"
                          :style="{
                            background:
                              'url(' + serverUrl + item.path + ') no-repeat',
                          }"
                        ></span>
                      </div>
                      <div class="choose-icon-btn" slot="reference">
                        <el-image class="btn-icon" :src="chooseIcon"></el-image>
                        选择图标
                      </div>
                    </el-popover>
                  </div>
                </el-form-item>
                <el-form-item label="备注">
                  <el-input
                    v-model="addDeptForm.note"
                    placeholder="请输入"
                    type="textarea"
                    resize="none"
                  ></el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </transition>
        <div class="confirm-tool">
          <div class="confirm-btn" @click="addDeptConfirmClick">确定</div>
          <div class="cancel-btn" @click="addDeptCancelClick">取消</div>
        </div>
      </div>
    </el-dialog>

    <AddPeopleDialog
      :isShow.sync="showAddPeople"
      title="新增人员"
      :deptTree="deptTree"
      @close="showAddPeople=false"
      @confirmClick="addPeopleConfirmClick"
      @cancelClick="addPeopleCancelClick"
    ></AddPeopleDialog>
  </div>
</template>

<script>
import globalApi from '@/utils/globalApi'
import AddPeopleDialog from './components/addPeopleDialog.vue'

export default {
  components: {
    AddPeopleDialog
  },
  data () {
    return {
      peopleSearchIcon: require('../../assets/images/backgroundManagement/searchIcon.png'),
      peopleResetIcon: require('../../assets/images/backgroundManagement/resetIcon.png'),
      clickfalse: false,
      chooseIcon: require('../../assets/images/backgroundManagement/chooseIcon.png'),
      deptIconUrl:
        'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
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
      showAddDept: false,
      addDeptTitle: '新增机构',
      addDeptForm: {
        deptName: '',
        address: '',
        fatherDept: '',
        phone: '',
        deptCode: '',
        shortName: '',
        longitude: '',
        latitude: '',
        status: '',
        note: ''
      },
      addDeptRules: {
        deptName: [{ required: true, message: '请输入' }],
        address: [{ required: true, message: '请选择' }],
        fatherDept: [{ required: true, message: '请选择' }]
      },
      deptStatusTypes: [
        {
          id: 1,
          label: '再用'
        },
        {
          id: 2,
          label: '已注销'
        }
      ],
      showPopover: false,
      serverUrl: globalApi.headImg,
      icons: [
        {
          path: '/cloud-oneMap/combatEvent/1608349933941_1608349933941.png'
        },
        {
          path: '/cloud-oneMap/combatEvent/1608350408597_1608350408597.png'
        },
        {
          path: '/cloud-oneMap/combatEvent/1608350573010_1608350573010.png'
        },
        {
          path: '/cloud-oneMap/combatEvent/1608350504537_1608350504537.png'
        },
        {
          path: '/cloud-oneMap/combatEvent/1608350546000_1608350546000.png'
        },
        {
          path: '/cloud-oneMap/combatEvent/1608350378214_1608350378214.png'
        },
        {
          path: '/cloud-oneMap/combatEvent/1608350440076_1608350440076.png'
        },
        {
          path: '/cloud-oneMap/combatEvent/1608350478586_1608350478586.png'
        }
      ],
      showDeptContent: true,
      showUnfoldBtn: false
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
    },

    /**
     *  选择图标
     */
    selectIcon (item) {
      this.showPopover = false
      // this.curIcon = item.path
    },

    // 折叠
    foldClick () {
      this.showDeptContent = false
      this.showUnfoldBtn = true
    },

    // 展开
    unfoldClick () {
      this.showDeptContent = true
      this.showUnfoldBtn = false
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

.show-people-dlg.el-dialog__wrapper {
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
      border-bottom: 1px solid rgba($color: #1eb0fc, $alpha: 0.6);
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
    .note {
      margin-top: 20px;
      font-size: 12px;
      color: rgba($color: #fff, $alpha: 0.6);
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
    overflow: hidden;
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 0;
      width: 100%;
    }
    .add-dept-div {
      border: 1px solid #1eb0fc;
      background-color: #121e3a;
    }
    .map-tool {
      width: 100%;
      height: 617px;
    }
    .add-dept-header {
      background: -webkit-linear-gradient(
        top,
        rgba($color: #000, $alpha: 0.7),
        rgba($color: #000, $alpha: 0)
      );
      position: absolute;
      height: 100px;
      width: 100%;
      top: 1px;
      left: 1px;
      .header-icon {
        display: inline-block;
        width: 22px;
        height: 16px;
        background-image: url("../../assets/images/fire_title.png");
        margin-top: 15px;
        margin-left: 18px;
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
    .unfold-btn {
      position: absolute;
      width: 23px;
      height: 100px;
      top: 272px;
      right: 0px;
      background-image: url("../../assets/images/backgroundManagement/unfold.png");
      cursor: pointer;
    }
    .add-dept-base {
      position: absolute;
      width: 505px;
      height: 449px;
      top: 97px;
      right: 0px;
      .fold-tool {
        float: left;
        width: 23px;
        height: 100%;
        .fold-btn {
          position: absolute;
          width: 23px;
          height: 100px;
          top: 50%;
          margin-top: -50px;
          background-image: url("../../assets/images/backgroundManagement/fold.png");
          cursor: pointer;
        }
      }
      .add-dept-content {
        float: right;
        width: 456px;
        height: 447px;
        border: 1px solid #1eb0fc;
        background-color: #121e3a;
        padding: 0 12px;
        .content-header {
          height: 33px;
          border-bottom: 1px solid #1eb0fc;
          .icon {
            display: inline-block;
            width: 22px;
            height: 16px;
            background-image: url("../../assets/images/fire_title.png");
            margin-top: 10px;
          }
          .text {
            display: inline-block;
            vertical-align: top;
            margin-top: 8px;
            margin-left: 10px;
            font-size: 14px;
            color: #fff;
          }
        }
        .add-dept-form {
          margin-top: 35px;
          .el-input__inner {
            background-color: rgba($color: #09546d, $alpha: 0.3);
            border-color: #1eb0fc;
            border-radius: 0;
            width: 138px;
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
            width: 365px;
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
          .icon-tool {
            display: inline-block;
            height: 30px;
            vertical-align: middle;
            .choose-icon-btn {
              display: inline-block;
              width: 86px;
              height: 24px;
              border: 1px solid #1ea7f0;
              color: #fff;
              font-size: 12px;
              line-height: 24px;
              vertical-align: top;
              margin-left: 8px;
              margin-top: 3px;
              cursor: pointer;
              .btn-icon {
                width: 12px;
                height: 12px;
                margin-left: 10px;
                margin-top: 6px;
                vertical-align: top;
              }
            }
          }
        }
      }
    }
    .confirm-tool {
      height: 50px;
      margin-top: 20px;
      margin-right: 15px;
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

.hideCourseList-enter,
.hideCourseList-leave-to {
  transform: translateX(505px);
}
.hideCourseList-enter-active,
.hideCourseList-leave-active {
  transition: all 0.3s ease;
}

.showUnfoldBtn-enter,
.showUnfoldBtn-leave-to {
  opacity: 0;
}
.showUnfoldBtn-enter-active,
.showUnfoldBtn-leave-active {
  transition: all 0.3s ease;
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
