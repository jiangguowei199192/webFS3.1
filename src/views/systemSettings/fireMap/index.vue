<template>
  <div>
    <button type="button" class="back-sty" @click="back">
      <img :src="backImg" />
      火情地图
    </button>
    <div class="rightBox">
      <div class="selArea">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="datePickerStyle"
        >
        </el-date-picker>
      </div>
      <div class="mapArea">
        <gMap
          ref="gduMap"
          handleType="devMap"
          :bShowSimpleSearchTools="true"
          :bShowBasic="true"
          :bShowMeasure="false"
          :bAutoLocate="false"
        ></gMap>
      </div>
    </div>
    <span
      ref="copyText"
      v-clipboard:copy="copyCoordinate"
      v-clipboard:success="onCopyOK"
      v-clipboard:error="onCopyErr"
      style="display: none"
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
import videoMixin from '../../videoSystem/mixins/videoMixin'
import fireMixin from '../../../utils/fireMixin'
export default {
  data () {
    return {
      backImg: require('../../../assets/images/Setting/setting-back.png'),
      bShowMarkersInMap: true, // 在地图中加载显示设备、火情标记
      dateRange: ''
    }
  },
  mixins: [videoMixin, fireMixin],
  mounted () {
    this.bAutoMove = false
  },
  watch: {
    dateRange (newValue, oldValue) {
      if (newValue == null) {
        this.fireWarningArray = []
        this.markFireWarnings()
      } else {
        const tmpBegin = newValue[0].getTime()
        const tmpEnd = newValue[1].getTime() + 24 * 60 * 60 * 1000
        this.getDurationFireAlarmInfos(tmpBegin, tmpEnd)
      }
    }
  },
  methods: {
    back () {
      this.$router.push({ path: '/systemSettings' })
    }
  }
}
</script>

<style lang="scss" scoped>
.back-sty {
  width: 120px;
  height: 40px;
  border: solid 1px #39a4dd;
  font-size: 18px;
  color: #ffffff;
  background-color: transparent;
  outline: none;
  display: block;
  cursor: pointer;
  margin-top: 30px;
  margin-left: 30px;
}

.rightBox {
  width: 1040px;
  height: 682px;
  border: solid 2px #39a4dd;
  border-radius: 10px;
  margin: 50px auto 0 auto;
  .selArea {
    height: 60px;
    line-height: 60px;
    padding-left: 15px;
    .datePickerStyle {
      background-color: transparent;
      border-color: #39a4dd;
    }
    /deep/.el-date-editor .el-range-input {
      color: white;
      background: transparent;
      font-size: 12px;
    }
    /deep/.el-range-separator {
      color: white;
      font-size: 12px;
      line-height: 27px;
    }
    /deep/ .el-input__prefix,
    /deep/ .el-input__icon {
      line-height: 27px;
    }
  }
  .mapArea {
    margin: 0px 15px;
    height: 610px;
  }
}
.dialogImg {
  width: 100%;
  height: 100%;
}
</style>
