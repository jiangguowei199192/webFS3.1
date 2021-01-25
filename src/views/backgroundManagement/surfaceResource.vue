<template>
  <div>
    <MapResSetting
      :dlgView="dlgView"
      :tableInfo="tableInfo"
      :subTitle="subTitle"
      :query="query"
      :api="getListApi"
    ></MapResSetting>
  </div>
</template>

<script>
import MapResSetting from './components/mapResSetting.vue'
import { settingApi } from '@/api/setting'
export default {
  data () {
    return {
      dlgView: 'SurfaceResDlg',
      subTitle: '面资源设置',
      // 表格相关
      tableInfo: {
        refresh: 1,
        data: [],
        fieldList: [
          { label: '设备类型', value: 'deviceTypeCode' },
          { label: '设备名称', value: 'deviceName' },
          { label: '设备编码', value: 'deviceCode' },
          { label: '启用', value: 'deviceStatus', type: 'switch' },
          { label: '在线状态', value: 'onlineStatus' }
        ],
        handle: {
          label: '操作',
          width: '130',
          btList: [
            {
              label: '修改'
            },
            {
              label: '查看'
            }
          ]
        }
      },
      query: {
        deviceCode: '',
        deviceName: ''
      }
    }
  },
  components: {
    MapResSetting
  },
  mounted () {},
  methods: {
    getListApi (params) {
      return this.$axios.post(settingApi.queryDevicePage, params)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
