import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    name: 'workflow-instance',
    path: '/workflow/instance/:mkey/:instanceId',
    component: () => import('@/views/workflow/instance/WorkflowInstanceTabsPage.vue'),
    redirect: '',
    props: true,
    meta: {
      keepAlive: true,
      closeable: true,
      icon: 'Apple',
      title: '流程实例详情',
      componentName: 'WorkflowInstanceTabsPage',
    }
  },
  {
    name: 'workflow-instance-list',
    path: '/workflow/instance/list/:mkey',
    component: () => import('@/views/modeling/ModelingViewContainer.vue'),
    redirect: '',
    props: route => ({ module: 'WORKFLOW', mkey: route.params.mkey }),
    meta: {
      keepAlive: true,
      closeable: true,
      title: '流程实例列表',
      componentName: 'ModelingViewContainer',
    }
  }
]

export default routes