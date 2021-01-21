import Vue from 'vue'
import VueRouter from 'vue-router'
import globalApi from '../utils/globalApi'

Vue.use(VueRouter)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
document.title = globalApi.configJson.projectTitle || globalApi.projectTitle
const routes = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/home'),
    children: [
      // 实时视频
      {
        path: '/videoSystem',
        name: 'videoSystem',
        component: () => import('../views/videoSystem/realVideo')
      },
      // 火情火警
      {
        path: '/fireAlarm',
        name: 'fireAlarm',
        component: () => import('../views/videoSystem/fireAlarm')
      },
      // 设备地图
      {
        path: '/deviceMap',
        name: 'deviceMap',
        component: () => import('../views/videoSystem/deviceMap')
      },
      // 回放
      {
        path: '/playback',
        name: 'playbackSystem',
        component: () => import('../views/videoSystem/playback')
      },
      // 实时拼图
      {
        path: '/pintu',
        name: 'pinTu',
        component: () => import('../views/videoSystem/pinTu')
      },
      // 三维部署
      {
        path: '/deploy3D',
        name: 'deploy3D',
        component: () => import('../views/decisionSystem/deploy3D')
      },
      {
        path: '/decisionSystem',
        name: 'decisionSystem',
        component: () => import('../views/decisionSystem'),
        meta: { keepAlive: true }
      },
      {
        path: '/PlanSetting',
        name: 'PlanSetting',
        component: () => import('../views/decisionSystem/PlanSetting')
      },
      {
        path: '/fightDeploy',
        name: 'fightDeploy',
        component: () => import('../views/decisionSystem/fightDeploy')
      },
      // 战评
      {
        path: '/battleReview',
        name: 'battleReview',
        component: () => import('../views/evaluationSystem/battleReviewList')
      },
      {
        path: '/addBattleReview',
        name: 'addBattleReview',
        component: () => import('../views/evaluationSystem/addBattleReview')
      },
      {
        path: '/fireBattle',
        name: 'fireBattle',
        component: () => import('../views/evaluationSystem/fireBattle')
      },
      {
        path: '/evaluationSystem',
        name: 'evaluationSystem',
        component: () => import('../views/evaluationSystem')
      },
      {
        path: '/digitalIndividual',
        name: 'digitalIndividual',
        component: () => import('../views/digitalIndividual')
      },
      {
        path: '/digitalEquipment',
        name: 'digitalEquipment',
        component: () => import('../views/digitalEquipment')
      },
      {
        path: '/systemSettings',
        name: 'systemSettings',
        component: () => import('../views/systemSettings'),
        children: [
          {
            path: '/systemSettings/organizationManagement',
            name: 'organizationManagement',
            component: () => import('../views/systemSettings/organizationManagement')
          },
          {
            path: '/systemSettings/userManagement',
            name: 'userManagement',
            component: () => import('../views/systemSettings/userManagement')
          },
          {
            path: '/systemSettings/rolePermissionManagement',
            name: 'rolePermissionManagement',
            component: () => import('../views/systemSettings/rolePermissionManagement')
          },
          {
            path: '/systemSettings/fireMap',
            name: 'fireMap',
            component: () => import('../views/systemSettings/fireMap')
          },
          {
            path: '/systemSettings/firePolice',
            name: 'firePolice',
            component: () => import('../views/systemSettings/firePolice')
          },
          {
            path: '/systemSettings/videoAccessManagement',
            name: 'videoAccessManagement',
            component: () => import('../views/systemSettings/videoAccessManagement')
          }
        ]
      },
      {
        path: '/backgroundManagement',
        name: 'backgroundManagement',
        component: () => import('../views/backgroundManagement'),
        children: [
          {
            path: '/backgroundManagement/institutionManagement',
            name: 'institutionManagement',
            component: () => import('../views/backgroundManagement/institutionManagement')
          },
          {
            path: '/backgroundManagement/userManagement',
            name: 'userManagement',
            component: () => import('../views/backgroundManagement/userManagement')
          },
          {
            path: '/backgroundManagement/roleManagement',
            name: 'roleManagement',
            component: () => import('../views/backgroundManagement/roleManagement')
          },
          {
            path: '/backgroundManagement/functionPermission',
            name: 'functionPermission',
            component: () => import('../views/backgroundManagement/functionPermission')
          },
          {
            path: '/backgroundManagement/dataPermission',
            name: 'dataPermission',
            component: () => import('../views/backgroundManagement/dataPermission')
          },
          {
            path: '/backgroundManagement/dataDictionary',
            name: 'dataDictionary',
            component: () => import('../views/backgroundManagement/dataDictionary')
          },
          {
            path: '/backgroundManagement/pointResource',
            name: 'pointResource',
            component: () => import('../views/backgroundManagement/pointResource')
          },
          {
            path: '/backgroundManagement/lineResource',
            name: 'lineResource',
            component: () => import('../views/backgroundManagement/lineResource')
          },
          {
            path: '/backgroundManagement/surfaceResource',
            name: 'surfaceResource',
            component: () => import('../views/backgroundManagement/surfaceResource')
          },
          {
            path: '/backgroundManagement/videoData',
            name: 'videoData',
            component: () => import('../views/backgroundManagement/videoData')
          },
          {
            path: '/backgroundManagement/iconLibrary',
            name: 'iconLibrary',
            component: () => import('../views/backgroundManagement/iconLibrary')
          }
        ]
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: '/webFs/',
  routes,
  // 记录滚动条的坐标
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token')
  const notNeedToLogin = ['login', 'register', 'forgetPass']
  if (notNeedToLogin.indexOf(to.name) > -1) {
    next()
  } else {
    if (!token || !to.name) {
      next({ name: 'login' })
      return
    }
    next()
  }
})

export default router
