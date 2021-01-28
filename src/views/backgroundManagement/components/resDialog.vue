<template>
  <el-dialog :visible="isShow" width="1080px" class="resDlg">
    <div>
      <gMap
        ref="gduMap"
        handleType="devMap"
        :bShowAllTools="false"
        :baseMapIndex="2"
        class="map"
      ></gMap>
      <div class="title">
        <span></span>
        <span>{{ title }}</span>
      </div>
      <div class="toolBox">
        <div v-for="(item, index) in toolItems"
          :key="index"
          class="toolBtn"
          :class="[item.className,{toolBtnSelect: item.isSelect}]"
          @click="clickToolItem(item)">
        </div>
      </div>
      <transition name="hideContent">
        <div class="contentBox" v-show="!unfold">
          <div
            class="unfold"
            v-show="!unfold"
            @click.stop="unfold = true"
          ></div>
          <div class="content">
            <slot name="content"></slot>
          </div>
        </div>
      </transition>
      <transition name="showUnfoldBtn">
        <div class="fold" v-show="unfold" @click.stop="unfold = false"></div>
      </transition>
    </div>
    <div class="handelBtns">
      <span @click.stop="cancel">取消</span>
      <span>保存</span>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      required: true
    },
    title: {
      type: String
    },
    drawType: {
      type: Number,
      default: 0
    },
    bVideoPoint: {
      type: Boolean,
      required: false
    }
  },
  data () {
    return {
      // 折叠
      unfold: false,
      toolItems: [
        {
          name: 'zoomIn',
          className: 'zoomIn',
          isSelect: false
        },
        {
          name: 'zoomOut',
          className: 'zoomOut',
          isSelect: false
        }
      ],
      pointItem: {
        name: 'point',
        className: 'point',
        isSelect: false
      },
      lineItem: {
        name: 'line',
        className: 'line',
        isSelect: false
      },
      areaItem: {
        name: 'area',
        className: 'area',
        isSelect: false
      },
      bHasInitDrawHelper: false
    }
  },
  created () {
    if (this.drawType === 0) {
      this.toolItems.push(this.pointItem)
      if (!this.bVideoPoint) {
        this.toolItems.push(this.areaItem)
      }
    } else if (this.drawType === 1) {
      this.toolItems.push(this.lineItem)
      this.toolItems.push(this.pointItem)
    } else if (this.drawType === 2) {
      this.toolItems.push(this.areaItem)
      this.toolItems.push(this.pointItem)
    } else {
      console.log('Unsupported draw type!')
    }
  },
  methods: {
    /**
     *  取消
     */
    cancel () {
      this.$emit('update:isShow', false)
    },
    /**
     * 功能按钮
     */
    clickToolItem (item) {
      if (item.name === 'point' || item.name === 'line' || item.name === 'area') {
        this.toolItems.forEach(t => {
          if (item !== t) {
            t.isSelect = false
          }
        })

        this.initCoustomDrawHelper()
        if (item.isSelect) {
          item.isSelect = false
          this.$refs.gduMap.map2D.customDrawHelper.stop()
        } else {
          item.isSelect = true
          if (item.name === 'point') {
            this.$refs.gduMap.map2D.customDrawHelper.drawType = 0
          } else if (item.name === 'line') {
            this.$refs.gduMap.map2D.customDrawHelper.drawType = 1
          } else if (item.name === 'area') {
            this.$refs.gduMap.map2D.customDrawHelper.drawType = 2
          }
        }
      } else if (item.name === 'zoomIn') {
        this.$refs.gduMap.map2D.zoomIn()
      } else if (item.name === 'zoomOut') {
        this.$refs.gduMap.map2D.zoomOut()
      }
    },
    initCoustomDrawHelper () {
      if (this.bHasInitDrawHelper) {
        return
      }
      this.bHasInitDrawHelper = true
      const drawHelper = this.$refs.gduMap.map2D.customDrawHelper
      // 0:不能修改；1:仅能修改当前类型；2:可修改所有类型。
      drawHelper.modifyFlag = 2
      // true:多边形或线段可以添加顶点;false:多边形或线段不可以添加顶点。
      drawHelper.bCanAddVertex = true
      // true，显示线段长度；false，不显示线段长度。
      drawHelper.bShowLineText = true
      // true，显示面积；false，不显示面积。
      drawHelper.bShowAreaText = false
      // 设置长度、面积显示的背景色及文字颜色
      // drawHelper.setTextStyle('rgba(128,0,88,1)','rgba(33,128,66,0.6)')
      // true,显示"单击继续,双击结束!"提示；false,不显示。
      drawHelper.bShowDrawToolTip = true
      // 限定绘图类型及该类型图案个数
      drawHelper.limitedType = this.drawType
      drawHelper.limitedCount = 1
      // 设置是否自动删除一个图案，继而可以继续绘图。
      drawHelper.bAutoRemove = true
      // 注册新绘图或修改图案回调事件
      drawHelper.addOrMoveEvent.addEventListener(
        this.addOrModifyEventCB.bind(this)
      )
    },
    /**
     *  地图操作回调
     */
    addOrModifyEventCB (data) {
      console.log('addOrModifyEventCB:', data)
      this.$emit('mapResAddOrModify', data)
    },
    /**
     *  删除绘制元素
     */
    removeFeatureByID (id) {
      this.$refs.gduMap.map2D.customDrawHelper.removeFeatureByID(id)
    },
    /**
     *  修改绘制元素
     */
    addOrUpdateFeature (data) {
      this.$refs.gduMap.map2D.customDrawHelper.addOrUpdateFeature(data)
    }
  }
}
</script>

<style lang="scss" scoped>
.resDlg {
  /deep/.el-dialog {
    overflow: hidden;
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 0;
      width: 100%;
      height: 690px;
      background: #121e3a;
      box-sizing: border-box;
      border: 1px solid #1eb0fc;
    }
    .map {
      width: 100%;
      height: 617px;
    }
    .title {
      background: -webkit-linear-gradient(
        top,
        rgba($color: #000, $alpha: 0.7),
        rgba($color: #000, $alpha: 0)
      );
      pointer-events: none;
      width: 100%;
      height: 103px;
      position: absolute;
      top: 0px;
      left: 0px;
      padding: 14px 0px 0px 18px;
      span:nth-child(1) {
        display: inline-block;
        width: 21px;
        height: 16px;
        background-image: url("../../../assets/images/fire_title.png");
        margin-right: 10px;
        position: relative;
        top: 2px;
      }
      span:nth-child(2) {
        line-height: 21px;
        color: #fff;
        font-size: 14px;
      }
    }
    .toolBox{
      position: absolute;
      top: 77px;
      left: 15px;
      width: 36px;
      .toolBtn {
        display: block;
        height: 36px;
        width: 36px;
        background-size: 100% 100%;
        margin-bottom: 12px;
        background-color: cadetblue;
        cursor: pointer;
      }
      .toolBtn:active {
        opacity: 0.8;
      }
      .toolBtnSelect {
        opacity: 0.8;
      }
      .zoomIn {
        background-image: url('../../../assets/images/backgroundManagement/zoomIn.png');
      }
      .zoomOut {
        background-image: url('../../../assets/images/backgroundManagement/zoomOut.png');
      }
      .point {
        background-image: url('../../../assets/images/backgroundManagement/pointType.png');
      }
      .line {
        background-image: url('../../../assets/images/backgroundManagement/lineType.png');
      }
      .area {
        background-image: url('../../../assets/images/backgroundManagement/areaType.png');
      }
    }
    .hideContent-enter,
    .hideContent-leave-to {
      transform: translateX(496px);
    }
    .hideContent-enter-active,
    .hideContent-leave-active {
      transition: all 0.3s ease;
    }
    .contentBox {
      display: flex;
      position: absolute;
      top: 97px;
      right: 0px;
      align-items: center;
      .content {
        width: 496px;
        height: 447px;
        background: rgba($color: #121e3a, $alpha: 0.95);
      }
      .unfold {
        width: 14px;
        height: 61px;
        background-image: url("../../../assets/images/backgroundManagement/fold.png");
        cursor: pointer;
      }
    }
    .showUnfoldBtn-enter,
    .showUnfoldBtn-leave-to {
      opacity: 0;
    }
    .showUnfoldBtn-enter-active,
    .showUnfoldBtn-leave-active {
      transition: all 0.2s ease;
    }
    .fold {
      position: absolute;
      width: 14px;
      height: 61px;
      top: 283px;
      right: 0px;
      background-image: url("../../../assets/images/backgroundManagement/unfold.png");
      cursor: pointer;
    }
  }
}
</style>
