import {createRouter, createWebHistory, RouteLocation, RouteRecordRaw,} from 'vue-router'
import {read} from "@/utils/storage"
import {Component, App, toRaw} from "vue";
import {findTreeItemById} from "@/utils/common";
import { getFileNameFromPath } from "@/utils/common/file";
import { useKeepAliveStore } from "@/store/keep-alive";

const Layout: Component = () => import("../layouts/TopLeft.vue");

/**
 * glob: () => import('xxx')
 * globEager: import * as glob_xxx from 'xxx'
 *    vue文件导出的是default, 因此要传给vue-router：glob_xxx.default
 */
const viewModules = import.meta.glob("../views/**/*.vue")

const moduleRoutes = import.meta.glob("./modules/**/*.ts", { eager: true })
console.log('moduleRoutes', moduleRoutes);

const staticModuleRoutes: RouteRecordRaw[] = []
const keys = Object.keys(moduleRoutes)
for (const key of keys) {
  // @ts-ignore
  if (moduleRoutes?.[key].default) {
    // @ts-ignore
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

const layoutRoute: RouteRecordRaw = {
  path: '/home',
  name: 'main',
  component: Layout,
  children: staticModuleRoutes,
};

const redirectRoute: RouteRecordRaw = { path: "/", redirect: "/home" };

const loginRouteRecord: RouteRecordRaw = {
  path: "/app/login",
  name: "login",
  component: routeToView("/app/login"),
};

const staticRoutes: RouteRecordRaw[] = [loginRouteRecord];

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
  const routes = router.getRoutes();
  const keepAliveNames = routes.filter(it => !!it.meta.keepAlive).map(it => it.meta.componentName)
  const store = useKeepAliveStore()
  store.init(keepAliveNames)

  console.log('after install routes', routes);
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

      let icon = parentNode?.icon || undefined

      const child: RouteRecordRaw = {
        path: menuOption.path,
        name: menuOption.name,
        component: routeToView(menuOption.component),
        redirect: "",
        children: [],
        // props: route => ({ ...route.query }),
        meta: {
          icon,
          title: menuOption.name,
          componentName: getFileNameFromPath(menuOption.component)!,
          keepAlive: true,
          closeable: menuOption.closeable,
          menuOption: menuOption,
        }
      }
      child.props = route => ({ ...route.query })
      layoutRoute.children?.push(child)


    } else {
      transMenuToRoute(menuOption.children || [])
    }
  }
}

export interface RouteMetaRecord extends MenuView {

}
