import {createApp, onBeforeUnmount, ref} from 'vue'
import App from './App.vue'
import {isReady, setupRouter} from './router'
import 'virtual:svg-icons-register'
import 'element-plus/dist/index.css';
import {ElLoading} from 'element-plus';
import {setupAxios} from "./config/axios.http"
import * as UserApi from "@/api/sys/user"
import {findAllDictValue, findDictInfoList} from "@/api/sys/dict/dict"
import {remove} from "./utils/storage"
import {dictInfosKey, dictValuesKey, menuOptionsKey, permissionKey, userInfoKey} from "./config/app.keys"
import {permission} from "@/directives/permission"

async function startup() {
  try {
    const app = createApp(App)

    setupAxios();
    app.use(ElLoading);

    const dictInfoRef = ref<DictInfo[]>([])
    app.provide(dictInfosKey, dictInfoRef)
    dictInfoRef.value = await findDictInfoList()

    const dictValues = await findAllDictValue()
    const dictValuesRef = ref(dictValues)
    app.provide(dictValuesKey, dictValuesRef)

    const permissions = ref<Set<string>>(new Set<string>())
    try {
      const permissionsList = await UserApi.permission()
      permissions.value = new Set<string>(permissionsList)
    } catch (e) {
      console.error(e)
    } finally {
      app.provide(permissionKey, permissions)
    }

    const menuOptions = ref<MenuConfig[]>([])
    const userInfo = ref<UserInfo>()

    try {
      const data = await UserApi.menu();
      menuOptions.value = data.menus
      userInfo.value = data.user_info
      console.log("menu list", data);
    } catch (e) {
      remove("isLogin")
      remove("tags")
      e instanceof Error && console.error(e.message)
    } finally {
      app.provide(menuOptionsKey, menuOptions)
      app.provide(userInfoKey, userInfo)
    }

    console.log("startup setup router before");
    setupRouter(app, menuOptions.value);
    console.log("startup setup router after");

    await isReady();
    console.log("router is ready now");

    app.directive("permission", permission)

    app.mount('#app')
  } catch (e) {
    console.log(e);
  }

}

startup();

