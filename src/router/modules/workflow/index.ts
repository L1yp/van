import { RouteRecordRaw } from "vue-router";


const routes: RouteRecordRaw[] = [
  {
    path: '/workflow/instance/:instanceId',
    component: () => import('@/views/workflow/instance/WorkflowInstanceTabsPage.vue'),
    redirect: '',
    props: true,
    meta: {
      closeable: true,
      icon: 'Apple',
      order_no: 1,
      type: 'PAGE',
      name: '流程实例',
      id: '100'
    }
  }
]

export default routes