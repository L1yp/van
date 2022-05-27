import {createRouter, createWebHistory, RouteRecordRaw, RouterOptions, } from 'vue-router'
import {read} from "@/utils/storage"
import * as UserApi from "@/api/sys/user"
import {Component, App} from "vue";

const Layout: Component = () => import("../layouts/TopLeft.vue");
const Home: Component = () => import("@/views/app/Home.vue");
const IconSelector: Component = () => import("@/components/common/selector/icon/IconSelector.vue");

const componentMap = new Map<String, any>();
componentMap.set("dashboard", Home)
componentMap.set("sysManagement", Home)
componentMap.set("userManagement", () => import("@/views/sys/user/UserManage.vue"))
componentMap.set("roleManagement", () => import("@/views/sys/role/RoleManagement.vue"))
componentMap.set("menuManagement", () => import("@/views/sys/menu/MenuManage.vue"))
componentMap.set("deptManagement", () => import("@/views/sys/dept/DeptManage.vue"))
componentMap.set("dictConfig", () => import("@/views/sys/dict/DictInfo.vue"))
// componentMap.set("userRelateRole", () => import("@/views/sys/common/selector/role/index.vue"))
// componentMap.set("roleRelateMenu", () => import("@/views/sys/common/selector/role/index.vue"))
// componentMap.set("userRelateDept", () => import("@/views/sys/common/selector/dept/index.vue"))
componentMap.set("userSetting", Home)
componentMap.set("userProfile", () => import("@/views/user/UserProfile.vue"))
componentMap.set("userPassword", IconSelector)
componentMap.set("login", () => import("@/views/app/Login.vue"))
componentMap.set("permissionManagement", () => import("@/views/sys/permission/Permission.vue"))
componentMap.set("processModel", () => import("@/views/sys/process/design/ProcessModel.vue")) // 流程模型
componentMap.set("processAppDesign", () => import("@/views/sys/process/design/ProcessAppDesign.vue")) // 流程设计详情
componentMap.set("processField", () => import("@/views/sys/process/design/ProcessField.vue")) // 流程字段配置

componentMap.set("processInstanceByKey", () => import("@/views/sys/process/manage/ProcessInstanceList.vue")) // 某个流程的流程列表

componentMap.set("unclaimTask", () => import("@/views/sys/process/manage/UnclaimTask.vue")) // 我待认领的流程
componentMap.set("todoTask", () => import("@/views/sys/process/manage/TodoTask.vue")) // 我的待办
componentMap.set("processHistoryInstance", () => import("@/views/sys/process/manage/MyHistoryProcess.vue")) // 我办理过的流程

componentMap.set("processInstanceInfo", () => import("@/views/sys/process/manage/ProcessInstanceDetail.vue")) // 流程明细
componentMap.set("processModelPage", () => import("@/views/sys/process/page/ProcessModelPageManage.vue")) // 流程页面


const layoutRoute  = {
  path: '/home',
  name: 'main',
  component: Layout,
  children: [],
};

const redirectRoute = { path: "/", redirect: "/home" };

const loginRouteRecord = {
  path: "/login",
  name: "login",
  component: componentMap.get("login"),
};

const staticRoutes: any[] = [loginRouteRecord];

console.log("create router before");

const router = createRouter({
  history: createWebHistory("/"),
  routes: staticRoutes
})

console.log("create router after");

export {
  router
};

export function isReady() {
  return router.isReady();
}

console.log("create router beforeEach before");


// 登录检测
router.beforeEach((to, from) => {
  if (to.name !== "login") {
    const isLogin = read("isLogin");
    if (!isLogin) {
      return {
        name: "login",
        query: {
          redirect: to.fullPath
        }
      };
    }
  }
  return true;
});

console.log("create router beforeEach after");


/**
 * 安装初始路由
 */
export function setupRouter(app: App<Element>, menuOptions: MenuConfig[]) {
  installLayoutContentRoute(menuOptions)
  app.use(router);
}

/**
 * 动态导入路由
 */
export function installLayoutContentRoute(menuOptions: MenuConfig[]) {
  if (!menuOptions || menuOptions.length === 0) {
    return;
  }
  transMenuToRoute(menuOptions);
  const redirectHandle = router.addRoute(redirectRoute);
  removeRouteHandles.push(redirectHandle);
  const layoutHandle = router.addRoute(layoutRoute);
  removeRouteHandles.push(layoutHandle);

}

let removeRouteHandles: Array<Function> = [];

export function uninstallLayoutContentRoute() {
  while (removeRouteHandles && removeRouteHandles.length > 0) {
    const handle = removeRouteHandles.pop();
    if (handle) {
      handle();
    }
  }

}

function transMenuToRoute(options: MenuConfig[]) {
  for (let menuOption of options) {
    if (!menuOption.children || menuOption.children.length === 0) {
      let parentNode: MenuConfig | undefined = menuOption;
      // 找不到图标就找上层 直到根节点为止
      while(parentNode && !parentNode.icon) {
        parentNode = parentNode.parent;
      }
      let icon = parentNode?.icon ?? null;

      const child = {
        path: menuOption.route,
        name: menuOption.name,
        component: componentMap.get(menuOption.name),
        redirect: "",
        meta: {
          title: menuOption.title,
          close: menuOption.close === 1,
          icon: icon,
        }

      };
      layoutRoute.children?.push(child);

    } else {
      if(menuOption.children && menuOption.children.length > 0) {
        for (const child of menuOption.children) {
          child.parent = menuOption;
        }
      }
      transMenuToRoute(menuOption.children);
    }
  }
}

export interface RouteMetaRecord {
  title?: string;
  close?: boolean;
  icon?: string;
}
