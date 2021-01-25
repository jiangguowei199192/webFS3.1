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
    <div class="btns">
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
    }
  },
  data () {
    return {
      // 折叠
      unfold: false
    }
  },
  methods: {
    /**
     *  取消
     */
    cancel () {
      this.$emit('update:isShow', false)
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
    .btns {
      position: absolute;
      bottom: 22px;
      right: 14px;
      span {
        cursor: pointer;
        box-sizing: border-box;
        display: inline-block;
        width: 66px;
        height: 30px;
        background: transparent;
        border: 1px solid #1eb0fc;
        border-radius: 4px;
        font-size: 14px;
        line-height: 30px;
        color: #1eb0fc;
        text-align: center;
      }
      span:active {
        opacity: 0.8;
      }
      span:nth-child(2) {
        margin-left: 20px;
        background: #1eb0fc;
        color: #fff;
      }
    }
    .title {
      background: -webkit-linear-gradient(
        top,
        rgba($color: #000, $alpha: 0.7),
        rgba($color: #000, $alpha: 0)
      );
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
