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
    },
    children: [],
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
    },
    children: [],
  },
  {
    name: 'workflow-ver-design',
    path: '/workflow/ver/design/:verId',
    component: () => import('@/views/workflow/bpmn/designer.vue'),
    redirect: '',
    props: true,
    meta: {
      keepAlive: true,
      closeable: true,
      title: '流程版本设计',
      componentName: 'designer', // 文件名
    },
    children: [],
  }
]

export default routes