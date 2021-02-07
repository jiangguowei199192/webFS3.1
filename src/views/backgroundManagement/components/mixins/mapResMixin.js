
import { settingApi } from '@/api/setting'
import { backApi } from '@/api/back'
const mapResMixin = {
  data () {
    return {
      areas: [], // 辖区类型
      resTypes: [], // 资源类型
      organs: [], // 所属机构
      organsProps: {
        expandTrigger: 'hover',
        children: 'children',
        label: 'deptName',
        value: 'deptCode',
        emitPath: false
      }
    }
  },
  methods: {
    /**
     * 获取资源类型
     */
    getResources (typeCode) {
      this.$axios
        .get(settingApi.queryByTypeCode, {
          params: { typeCode: typeCode }
        })
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            this.resTypes = res.data.data
          }
        })
        .catch((err) => {
          console.log('settingApi.queryByTypeCode Err : ' + err)
        })
    },
    /**
     * 获取机构树
     */
    getOrgans () {
      this.$axios
        .post(backApi.getDeptTree)
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            this.organs = this.handleDeptTree(res.data.data)
          }
        })
        .catch((err) => {
          console.log('backApi.getDeptTree Err : ' + err)
        })
    },
    // children为" "时置为null
    handleDeptTree (tree) {
      tree.forEach((item) => {
        if (item.children) {
          if (item.children.length <= 0) {
            item.children = null
          } else {
            this.handleDeptTree(item.children)
          }
        }
      })
      return tree
    },
    /**
     * 获取辖区资源类型
     */
    getAreaResources () {
      this.$axios
        .get(settingApi.queryByTypeCode, {
          params: { typeCode: 'area_resources' }
        })
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            this.areas = res.data.data
          }
        })
        .catch((err) => {
          console.log('settingApi.queryByTypeCode Err : ' + err)
        })
    }
  }
}

export default mapResMixin
