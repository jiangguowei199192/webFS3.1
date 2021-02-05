<template>
  <div>
    <MapResSetting
      :dlgView="dlgView"
      :resourcesDataType="resourcesDataType"
      :subTitle="subTitle"
    ></MapResSetting>
  </div>
</template>

<script>
import MapResSetting from './components/mapResSetting.vue'
export default {
  data () {
    return {
      dlgView: 'LineResDlg',
      subTitle: '面资源设置',
      resourcesDataType: '1'
    }
  },
  components: {
    MapResSetting
  },
  mounted () {},
  methods: {}
}
</script>

<style lang="scss" scoped>
</style>
