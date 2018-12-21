import Vue from 'vue'
import Router from 'vue-router'
import feesReedit from '@/components/feesReedit'
import feesHistoryReedit from '@/components/feesHistoryReedit'
import feesApply from '@/components/feesApply'
import feesApplyApproval from '@/components/feesApplyApproval'


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

  }]
})
