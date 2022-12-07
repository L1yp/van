import { RouteRecordRaw } from "vue-router";


const routes: RouteRecordRaw[] = [
  {
    name: 'workflow-instance',
    path: '/workflow/instance/:mkey/:instanceId',
    component: () => import('@/views/workflow/instance/WorkflowInstanceTabsPage.vue'),
    redirect: '',
    props: true,
    meta: {
      closeable: true,
      icon: 'Apple',
      order_no: 1,
      type: 'PAGE',
      name: '流程实例详情',
      id: '100'
    }
  },
  {
    name: 'workflow-instance-list',
    path: '/workflow/instance/list/:mkey',
    component: () => import('@/views/modeling/ModelingViewContainer.vue'),
    redirect: '',
    props: route => ({ module: 'WORKFLOW', mkey: route.params.mkey }),
    meta: {
      closeable: true,
      order_no: 1,
      type: 'PAGE',
      name: '流程实例列表',
      id: '101'
    }
  }
]

export default routes