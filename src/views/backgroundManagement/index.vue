<template>
  <div style="margin-top: -5px; padding: 0 20px 20px 20px">
    <div class="leftBox">
      <div style="height: 800px">
        <SettingLeftItem
          v-for="data in leftMenu"
          :key="data.headerTitle"
          v-bind:itemData="data"
          v-on:leftBoxDidSelectedItem="leftBoxDidSelectedItem"
        ></SettingLeftItem>
      </div>
      <button type="button" class="logoutBtn" @click="logoutClick">
        <img :src="logoutIcon" />
        退出登录
      </button>
    </div>
    <div class="rightBox">
      <div class="rightBoxBase webFsScroll">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import SettingLeftItem from './components/leftMenuItem.vue'
// import { loginApi } from '@/api/login'

export default {
  name: 'backgroundManagement',
  data () {
    return {
      leftMenu: [],
      logoutIcon: require('../../assets/images/Login/logout-Icon.png')
    }
  },
  computed: {},
  created () {
    this.getUserDetail()
  },
  components: {
    SettingLeftItem
  },
  methods: {
    getLeftItemInfo (leftMenu) {
      var info = {}
      switch (leftMenu) {
        case 'institutionManagement':
          info = {
            id: 'institutionManagement',
            title: '机构管理',
            normalImgPath: require('../../assets/images/backgroundManagement/menuInstitutionNormal.png'),
            selectedImgPath: require('../../assets/images/backgroundManagement/menuInstitutionSelected.png'),
            selected: true
          }
          break
        case 'userManagement':
          info = {
            id: 'userManagement',
            title: '用户管理',
            normalImgPath: require('../../assets/images/backgroundManagement/menuUserManagementNormal.png'),
            selectedImgPath: require('../../assets/images/backgroundManagement/menuUserManagementSelected.png'),
            selected: false
          }
          break
        case 'roleManagement':
          info = {
            id: 'roleManagement',
            title: '角色管理',
            normalImgPath: require('../../assets/images/backgroundManagement/menuRoleManagementNormal.png'),
            selectedImgPath: require('../../assets/images/backgroundManagement/menuRoleManagementSelected.png'),
            selected: false
          }
          break
        case 'functionPermission':
          info = {
            id: 'functionPermission',
            title: '功能权限',
            normalImgPath: require('../../assets/images/backgroundManagement/menuPermissionManagementNormal.png'),
            selectedImgPath: require('../../assets/images/backgroundManagement/menuPermissionManagementSelected.png'),
            selected: false
          }
          break
        case 'dataPermission':
          info = {
            id: 'dataPermission',
            title: '数据权限',
            normalImgPath: require('../../assets/images/backgroundManagement/menuDataPermissionNormal.png'),
            selectedImgPath: require('../../assets/images/backgroundManagement/menuDataPermissionSelected.png'),
            selected: false
          }
          break
        case 'dataDictionary':
          info = {
            id: 'dataDictionary',
            title: '数据字典',
            normalImgPath: require('../../assets/images/backgroundManagement/menuDataDictionaryNormal.png'),
            selectedImgPath: require('../../assets/images/backgroundManagement/menuDataDictionarySelected.png'),
            selected: false
          }
          break
        case 'pointResource':
          info = {
            id: 'pointResource',
            title: '点资源设置',
            normalImgPath: require('../../assets/images/backgroundManagement/menuPointResourceNormal.png'),
            selectedImgPath: require('../../assets/images/backgroundManagement/menuPointResourceSelected.png'),
            selected: false
          }
          break
        case 'lineResource':
          info = {
            id: 'lineResource',
            title: '线资源设置',
            normalImgPath: require('../../assets/images/backgroundManagement/menuLineResourceNormal.png'),
            selectedImgPath: require('../../assets/images/backgroundManagement/menuLineResourceSelected.png'),
            selected: false
          }
          break
        case 'surfaceResource':
          info = {
            id: 'surfaceResource',
            title: '面资源设置',
            normalImgPath: require('../../assets/images/backgroundManagement/menuSurfaceResourceNormal.png'),
            selectedImgPath: require('../../assets/images/backgroundManagement/menuSurfaceResourceSelected.png'),
            selected: false
          }
          break
        case 'videoData':
          info = {
            id: 'videoData',
            title: '视频数据',
            normalImgPath: require('../../assets/images/backgroundManagement/menuVideoDataNormal.png'),
            selectedImgPath: require('../../assets/images/backgroundManagement/menuVideoDataSelected.png'),
            selected: false
          }
          break
        case 'iconLibrary':
          info = {
            id: 'iconLibrary',
            title: '图标库',
            normalImgPath: require('../../assets/images/backgroundManagement/menuIconLibraryNormal.png'),
            selectedImgPath: require('../../assets/images/backgroundManagement/menuIconLibrarySelected.png'),
            selected: false
          }
          break
        default:
          break
      }
      return info
    },

    // 获取用户详情
    async getUserDetail () {
      // this.$axios.post(loginApi.getUserDetail).then((res) => {
      //   if (res.data.code === 0) {}
      // })
      // 根据权限显示菜单
      this.leftMenu = [
        {
          headerTitle: '基础数据',
          info: [
            this.getLeftItemInfo('institutionManagement')
          ]
        },
        {
          headerTitle: '用户权限',
          info: [
            this.getLeftItemInfo('userManagement'),
            this.getLeftItemInfo('roleManagement'),
            this.getLeftItemInfo('functionPermission'),
            this.getLeftItemInfo('dataPermission')
          ]
        },
        {
          headerTitle: '系统设置',
          info: [
            this.getLeftItemInfo('dataDictionary')
          ]
        },
        {
          headerTitle: '地图数据',
          info: [
            this.getLeftItemInfo('pointResource'),
            this.getLeftItemInfo('lineResource'),
            this.getLeftItemInfo('surfaceResource')
          ]
        },
        {
          headerTitle: '设备数据',
          info: [
            this.getLeftItemInfo('videoData')
          ]
        },
        {
          headerTitle: '素材中心',
          info: [
            this.getLeftItemInfo('iconLibrary')
          ]
        }
      ]

      this.gotoSubpage('institutionManagement')
    },

    gotoSubpage (id) {
      switch (id) {
        case 'institutionManagement':
          this.$router.push({ path: '/backgroundManagement/institutionManagement' })
          break
        case 'userManagement':
          this.$router.push({ path: '/backgroundManagement/userManagement' })
          break
        case 'roleManagement':
          this.$router.push({ path: '/backgroundManagement/roleManagement' })
          break
        case 'functionPermission':
          this.$router.push({ path: '/backgroundManagement/functionPermission' })
          break
        case 'dataPermission':
          this.$router.push({ path: '/backgroundManagement/dataPermission' })
          break
        case 'dataDictionary':
          this.$router.push({ path: '/backgroundManagement/dataDictionary' })
          break
        case 'pointResource':
          this.$router.push({ path: '/backgroundManagement/pointResource' })
          break
        case 'lineResource':
          this.$router.push({ path: '/backgroundManagement/lineResource' })
          break
        case 'surfaceResource':
          this.$router.push({ path: '/backgroundManagement/surfaceResource' })
          break
        case 'videoData':
          this.$router.push({ path: '/backgroundManagement/videoData' })
          break
        case 'iconLibrary':
          this.$router.push({ path: '/backgroundManagement/iconLibrary' })
          break
        default:
          break
      }
    },

    // 点击左侧菜单栏
    leftBoxDidSelectedItem (id) {
      this.setLeftItemStatus(id)
      this.gotoSubpage(id)
    },

    // 退出登录
    async logoutClick () {
      sessionStorage.clear()
      this.$router.push({ path: '/login' })
    },

    setLeftItemStatus (leftId) {
      for (let i = 0; i < this.leftMenu.length; i++) {
        const group = this.leftMenu[i]
        for (let j = 0; j < group.info.length; j++) {
          const item = group.info[j]
          if (item.id === leftId) {
            item.selected = true
          } else {
            item.selected = false
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.leftBox {
  cursor: default;
  float: left;
  width: 283px;
  height: 899px;
  background: url("../../assets/images/Setting/setting-leftBox.png") no-repeat;
  background-size: 100% 100%;
}
.rightBox {
  cursor: default;
  margin-left: 293px;
  height: 899px;
  background: url("../../assets/images/Setting/setting-rightBox.png") no-repeat;
  background-size: 100% 100%;
  .rightBoxBase {
    height: 879px;
    border: solid 10px transparent;
    overflow: auto;
  }
}
.logoutBtn {
  width: 112px;
  height: 30px;
  border: solid 1px #39a4dd;
  font-size: 18px;
  color: #85cfe8;
  background-color: transparent;
  outline: none;
  display: block;
  margin-left: 30px;
  margin-top: 10px;
  cursor: pointer;
}

/* --- 改变滚动条样式 --- */
/deep/ ::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
/* --- 滚动条里面的滚动块 --- */
/deep/ ::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgb(0, 180, 255);
  background: rgba(0, 180, 255, 0.2);
}
/* --- 滚动条里面轨道 --- */
/deep/ ::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #096090;
}
/deep/ ::-webkit-scrollbar-corner {
  background: #096090;
}
</style>
