<template>
  <div class="fireAlarm">
    <videoMain :showLeft="showLeft" :isShowRight="isShowRight" @hideLeftNav="closeLeftNav">
      <!-- 左侧部分 -->
      <div slot="left">
        <div class="leftContainer">
          <div class="tab">
            <div :class="{active:isOnline}" @click.stop="changeOnlineOrAll(true)">在线</div>
            <div :class="{active:!isOnline}" @click.stop="changeOnlineOrAll(false)">全部</div>
          </div>
          <!-- 默认展示在线设备 -->
          <template v-if="isOnline">
            <div class="onlineList webFsScroll">
              <div
                class="list"
                v-for="(item,index) in onlineArray"
                :key="index"
                :class="{selected:selectedIndex==index,unman:item.deviceTypeCode==='WRJ'}"
                @click.stop="selectOnlineDeviceItem(item,index)"
              >
                <p>
                  <span class="area">{{item.label}}</span>
                </p>
                <div class="btns">
                  <el-button
                    v-for="(list,index2) in item.children"
                    :key="index2"
                    class="visible"
                    :title="list.label"
                  >{{list.label&&list.label.length>3?list.label.slice(0,3)+'..':list.label?list.label:'-'}}</el-button>
                </div>
              </div>
            </div>
          </template>
          <!-- 全部部分 -->
          <template v-else>
            <div class="search">
              <el-input
                type="text"
                v-model.trim="filterDevice"
                placeholder="请输入设备名称"
                suffix-icon="el-icon-search"
              ></el-input>
            </div>
            <tree-data
              :treeData="treeData"
              ref="tree"
              :isLiveTree="false"
              @clickAnDeviceItem="clickAnDeviceItem"
            ></tree-data>
          </template>
          <div
            v-if="(isOnline&&onlineArray.length===0)||!isOnline&&treeData.length===0"
            class="empty"
          >暂无数据</div>
        </div>
      </div>
      <div slot="center">
        <div class="video">
          <div class="fireAlarmBox">
            <div class="title" @click.stop="$router.go(-1)">
              <img src="@/assets/images/back.png" />监控报警
            </div>
            <div class="container">
              <gMap
                ref="gduMap"
                handleType="devMap"
                :bShowSimpleSearchTools="true"
                :bShowBasic="true"
                :bShowMeasure="false"
                :bAutoLocate="false"
              ></gMap>
              <div class="todayFire">
                <div class="title">今日火情警报[{{fireConfirmedNum + '/' + fireTotalNum}}]</div>
                <div class="info webFsScroll">
                  <div
                    class="list"
                    v-for="(item,index) in fireWarningArray"
                    :key="index"
                    :class="{unConfirmedItem:!item.bConfirmed,confirmedItem:item.bConfirmed}"
                    @click.stop="selectFireWarningHandler(item,index)"
                  >
                    <div class="address">
                      <div>{{item.alarmTime}}</div>
                      <div class="devNameBox" @click.stop="gotoDeviceDetail(item)">
                        <img class="devIcon" src="../../assets/images/high_point.png" />
                        <div
                          class="devName divEllipsis"
                          :title="item.deviceName"
                        >{{item.deviceName}}</div>
                      </div>
                      <div
                        class="alarmAddr divEllipsis"
                        :title="item.alarmAddress"
                      >{{item.alarmAddress}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </videoMain>
    <span
      ref="copyText"
      v-clipboard:copy="copyCoordinate"
      v-clipboard:success="onCopyOK"
      v-clipboard:error="onCopyErr"
      style="display:none;"
    />
    <el-dialog
      custom-class="el-dialog-custom"
      :visible.sync="imgDialogVisible"
      :show-close="false"
      type="primary"
      @click.native="closeImgDialog"
      center
    >
      <img class="dialogImg" :src="imgSrc" />
    </el-dialog>
  </div>
</template>
<script>
import VideoMain from './components/main'
import TreeData from './components/tree'
import videoMixin from './mixins/videoMixin'
import fireMixin from '../../utils/fireMixin'
export default {
  name: 'fireAlarm',
  components: {
    VideoMain,
    TreeData
  },
  data () {
    return {
      isShowRight: false,
      bShowMarkersInMap: true, // 在地图中加载显示设备、火情标记
      bRealTimeFireWarning: true, // 实时更新火情警报个数
      jumpFireId: '' // 火情id
    }
  },
  mixins: [videoMixin, fireMixin],
  methods: {
    // 在线或所有设备切换
    changeOnlineOrAll (isOnline) {
      if (Number(this.isOnline) === Number(isOnline)) return
      this.isOnline = isOnline
      // 如果选择在线设备
      if (this.isOnline) {
        const divs = document.querySelectorAll('.el-tree-node')
        for (let i = 0; i < divs.length; i++) {
          divs[i].classList.remove('is-current')
        }
      } else {
        this.selectedIndex = 200 // 激活在线设备 初始值200，不激活
        this.onlineArray.forEach(item => {
          item.children.forEach(list => {
            list.isSelected = false
          })
        })
      }
    },
    // 定位地图中设备位置
    showDeviceDetailInfo (item) {
      this.$refs.gduMap.map2D.devCameraLayerManager.resetSelectedFeature()
      this.$refs.gduMap.map2D.devDroneLayerManager.resetSelectedFeature()
      this.$refs.gduMap.map2D.devFireWarningLayerManager.resetSelectedFeature()
      if (item.deviceTypeCode === 'GDJK') {
        this.$refs.gduMap.showLayer('high', true)
        this.$refs.gduMap.map2D.devCameraLayerManager.selectFeatureByID(item)
      } else if (item.deviceTypeCode === 'WRJ') {
        this.$refs.gduMap.showLayer('drone', true)
        this.$refs.gduMap.map2D.devDroneLayerManager.selectFeatureByID(item)
      }
      this.$refs.gduMap.map2D.setZoom(16)
      this.$refs.gduMap.map2D.zoomToCenter(
        item.deviceLongitude,
        item.deviceLatitude
      )
    },
    // 点击在线设备中红外光或可见光
    selectOnlineDeviceItem (item, index) {
      this.showDeviceDetailInfo(item)
      this.selectedIndex = index
    },
    // 点击全部设备列表中设备项
    clickAnDeviceItem (curDeviceInfo) {
      this.showDeviceDetailInfo(curDeviceInfo)
    }
  },
  watch: {
    $route: {
      deep: true,
      immediate: true,
      handler () {
        this.jumpFireId = this.$route.query.id
      }
    }
  }
}
</script>
<style lang="less" scoped>
.fireAlarm {
  box-sizing: border-box;
  padding: 20px;
  padding-top: 0px;
  .leftContainer {
    box-sizing: border-box;
    padding: 27px 0 0 28px;
    font-size: 18px;
    font-family: Source Han Sans CN;
    font-weight: bold;

    div.tab {
      display: flex;
      cursor: pointer;
      height: 34px;
      line-height: 34px;
      width: 230px;
      color: #23cefd;
      background: #1a3e68;
      // text-align: center;
      div {
        width: 104px;
        box-sizing: border-box;
      }
      div:nth-child(1) {
        padding-left: 30px;
      }
      div:nth-child(2) {
        padding-left: 20px;
      }
      div.active {
        width: 126px !important;
        color: #fff;
      }
      div:nth-child(1).active {
        background: url(../../assets/images/left.png) no-repeat;
      }
      div:nth-child(2).active {
        padding-left: 42px;
        background: url(../../assets/images/right.png) no-repeat;
      }
    }
    div.search {
      width: 230px;
      margin-top: 20px;
      background: #10203b;
      /deep/ .el-input__inner {
        background: #10203b;
        border: 1px solid #1eb0fc;
        color: #1eb0fc;
      }

      ::-webkit-input-placeholder {
        /* WebKit, Blink, Edge */
        color: #1eb0fc;
      }
    }
    div.onlineList {
      max-height: 800px;
      overflow-y: auto;
      margin-right: 8px;
    }
    div.list {
      cursor: pointer;
      margin-top: 20px;
      padding-left: 10px;
      padding-top: 10px;
      height: 72px;
      background: url(../../assets/images/list-unselected.png) no-repeat;
      width: 230px;
      box-sizing: border-box;
      p {
        margin-bottom: 8px;
        color: #1eb0fc;
        i {
          display: inline-block;
          width: 17px;
          height: 10px;
          background: url(../../assets/images/live.png) no-repeat;
          margin-left: 12px;
        }
      }
      div.btns {
        button {
          font-size: 12px;
          font-weight: bold;
          box-sizing: border-box;
          width: 74px;
          height: 22px;
          line-height: 22px;
          border: 1px solid rgba(30, 176, 252, 1);
          padding: 0;
          background: #10243f;
          color: #1eb0fc;
          text-align: right;
          padding-right: 8px;
          vertical-align: middle;
        }
        button.visible {
          background: url(../../assets/images/visible.png) no-repeat 4px center;
        }
        button.visibleSelected {
          background: url(../../assets/images/visible_selected.png) no-repeat
            4px center;
        }
      }
    }
    div.selected {
      background: url(../../assets/images/list-selected.png) no-repeat;
    }
    div.list.unman {
      background: url(../../assets/images/unman_unselected.png) no-repeat;
    }
    div.list.unman.selected {
      background: url(../../assets/images/unman_selected.png) no-repeat;
    }
    div.empty {
      position: relative;
      min-height: 60px;
      text-align: center;
      width: 100%;
      height: 100%;
      color: #909399;
      line-height: 60px;
      font-size: 14px;
    }
  }
  .video {
    box-sizing: border-box;
    padding: 21px 0px 21px 21px;
    // position: relative;
    .fireAlarmBox {
      // display: flex;
      // justify-content: space-between;
      margin-right: 24px;
      > .title {
        width: 128px;
        height: 36px;
        border: 1px solid rgba(57, 164, 221, 1);
        text-align: center;
        // width: 202px;
        // height: 45px;
        // background: url(../../assets/images/device/info-title.png) no-repeat;
        line-height: 36px;
        // padding-left: 30px;
        margin-bottom: 20px;
        cursor: pointer;
        img {
          margin-right: 10px;
          vertical-align: middle;
        }
      }
      .container {
        position: relative;
        height: 785px;
        .todayFire {
          position: absolute;
          top: 100px;
          left: 10px;
          box-sizing: border-box;
          width: 392px;
          height: 557px;
          padding: 15px;
          background: url(../../assets/images/fire-box.png) no-repeat;

          .title {
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(30, 176, 252, 1);
            margin-bottom: 15px;
          }
          .info {
            overflow-x: hidden;
            overflow-y: auto;
            max-height: 460px;
            > div.list {
              position: relative;
              width: 350px;
              height: 92px;
              margin-bottom: 18px;
              cursor: pointer;
              div.address {
                padding: 20px 0 17px 27px;
                .devNameBox {
                  position: absolute;
                  top: 14px;
                  left: 190px;
                  width: 104px;
                  height: 24px;
                  background-color: #1eb0fc;
                  border: 1px solid rgba(30, 176, 252, 1);
                  border-radius: 4px;
                  .devIcon {
                    position: absolute;
                    top: 6px;
                    left: 4px;
                    width: 16px;
                    height: 11px;
                  }
                  .devName {
                    position: absolute;
                    top: 1px;
                    left: 25px;
                    width: 80px;
                    color: #fefefe;
                  }
                }
                .alarmAddr {
                  height: 43px;
                  line-height: 43px;
                  width: 300px;
                }
              }
            }
            .unConfirmedItem {
              background: url(../../assets/images/fire-wait-confirm.png)
                no-repeat;
            }
            .confirmedItem {
              background: url(../../assets/images/fire-confirm.png) no-repeat;
            }
          }
        }
      }
    }
  }
  .dialogImg {
    width: 100%;
    height: 100%;
  }
}
</style>
