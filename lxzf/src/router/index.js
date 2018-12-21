import Vue from 'vue'
import Router from 'vue-router'
import feesReedit from '@/components/feesReedit'
import feesHistoryReedit from '@/components/feesHistoryReedit'
import feesApply from '@/components/feesApply'
import feesApplyApproval from '@/components/feesApplyApproval'
// 留学项目维护
import feesList from '@/components/projectMaintenance/feesList' //留学项目维护-费用清单
import projectMaintenance from '@/components/projectMaintenance/projectMaintenance' //留学项目维护


Vue.use(Router)

export default new Router({
  routes: [{ //资费编辑
      path: '/',
      name: 'feesReedit',
      component: feesReedit

    }, { //历史资费调整
      path: '/feesHistoryReedit',
      name: 'feesHistoryReedit',
      component: feesHistoryReedit
    }, { //资费申请
      path: '/feesApply',
      name: 'feesApply',
      component: feesApply
    }, { //申请审批
      path: '/feesApplyApproval',
      name: 'feesApplyApproval',
      component: feesApplyApproval

    }, { //留学项目维护-费用清单
      path: '/feesList',
      name: 'feesList',
      component: feesList
    },
    { //留学项目维护
      path: '/projectMaintenance',
      name: 'projectMaintenance',
      component: projectMaintenance
    }
  ]
})
