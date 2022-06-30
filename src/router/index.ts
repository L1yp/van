import {createRouter, createWebHistory, } from 'vue-router'
import {read} from "@/utils/storage"
import {Component, App} from "vue";

const Layout: Component = () => import("../layouts/TopLeft.vue");

/**
 * glob: () => import('xxx')
 * globEager: import * as glob_xxx from 'xxx'
 *    vue文件导出的是default, 因此要传给vue-router：glob_xxx.default
 */
const viewModules = import.meta.globEager("../views/**/*.vue")

/**
 * 路由映射视图文件
 * @param route
 */
function routeToView(route: string) {
  return viewModules[`../views${route}.vue`].default // if globEager
  // return viewModules[`../views${route}.vue`] // if glob
}

const layoutRoute  = {
  path: '/home',
  name: 'main',
  component: Layout,
  children: [],
};

const redirectRoute = { path: "/", redirect: "/home" };

const loginRouteRecord = {
  path: "/app/login",
  name: "login",
  component: routeToView("/app/login"),
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
export function setupRouter(app: App, menuOptions: MenuConfig[]) {
  installLayoutContentRoute(menuOptions)
  app.use(router)
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
        component: routeToView(menuOption.route),
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
