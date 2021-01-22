<template>
  <div>
    <MapResSetting
      :tableInfo="tableInfo"
      :subTitle="subTitle"
      :query="query"
    ></MapResSetting>
  </div>
</template>

<script>
import MapResSetting from './components/mapResSetting.vue'
export default {
  data () {
    return {
      subTitle: '面资源设置',
      // 表格相关
      tableInfo: {
        refresh: 1,
        data: [{
          name: '江汉路',
          start: '姑嫂树路',
          type: '安保线路',
          end: '兴业路',
          icon: 'http://111.47.13.103:40031/cloud-oneMap/combatEvent/1608350408597_1608350408597.png'
        }
        ],
        fieldList: [
          { label: '线路名称', value: 'name' },
          { label: '类型', value: 'type' },
          { label: '起点', value: 'start' },
          { label: '终点', value: 'end' },
          { label: '图标', value: 'icon', type: 'image' }
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
  }
}
</script>

<style lang="scss" scoped>
</style>
