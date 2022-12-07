import {createRouter, createWebHistory, } from 'vue-router'
import {read} from "@/utils/storage"
import {Component, App, toRaw} from "vue";
import {findTreeItemById} from "@/utils/common";

const Layout: Component = () => import("../layouts/TopLeft.vue");

/**
 * glob: () => import('xxx')
 * globEager: import * as glob_xxx from 'xxx'
 *    vue文件导出的是default, 因此要传给vue-router：glob_xxx.default
 */
const viewModules = import.meta.glob("../views/**/*.vue")

const moduleRoutes = import.meta.globEager("./modules/**/*.ts")
console.log('moduleRoutes', moduleRoutes);

const staticModuleRoutes = []
const keys = Object.keys(moduleRoutes)
for (const key of keys) {
  if (moduleRoutes?.[key].default) {
    Array.prototype.push.apply(staticModuleRoutes, moduleRoutes?.[key].default)
  }
}

console.log('staticModuleRoutes', staticModuleRoutes)

/**
 * 路由映射视图文件
 * @param route
 */
export function routeToView(route: string) {
  if (!viewModules[`../views${route}.vue`]) {
    console.log('err', route)
  }
  // return viewModules[`../views${route}.vue`].default // if globEager
  return viewModules[`../views${route}.vue`] // if glob
}

const layoutRoute  = {
  path: '/home',
  name: 'main',
  component: Layout,
  children: staticModuleRoutes,
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
}

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
export function setupRouter(app: App, menuOptions: MenuView[]) {
  installLayoutContentRoute(menuOptions)
  app.use(router)
}

/**
 * 动态导入路由
 */
export function installLayoutContentRoute(menuOptions: MenuView[]) {
  if (!menuOptions || menuOptions.length === 0) {
    return;
  }
  transMenuToRoute(menuOptions);
  const redirectHandle = router.addRoute(redirectRoute);
  removeRouteHandles.push(redirectHandle);
  const layoutHandle = router.addRoute(layoutRoute);
  removeRouteHandles.push(layoutHandle);
  console.log('after install routes', router.getRoutes());


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

function transMenuToRoute(options: MenuView[]) {
  for (let menuOption of options) {
    if (['PAGE', 'TAB'].includes(menuOption.type)) {
      let parentNode: MenuView | undefined = menuOption
      // 找不到图标就找上层 直到根节点为止
      while(parentNode && !parentNode.icon) {
        parentNode = findTreeItemById(options, 'id', parentNode.pid)
      }

      let icon = parentNode?.icon || null

      const child = {
        path: menuOption.path,
        name: menuOption.name,
        component: routeToView(menuOption.component),
        redirect: "",
        props: route => ({ ...route.query }),
        meta: {
          ...toRaw(menuOption),
          icon,
        }
      }
      layoutRoute.children?.push(child)


    } else {
      transMenuToRoute(menuOption.children || [])
    }
  }
}

export interface RouteMetaRecord extends MenuView {

}
