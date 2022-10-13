import { ref, Ref } from "vue";
import {ElMessage} from "element-plus";
import * as UserApi from "@/api/sys/user";




export function useUserData(loading?: Ref<boolean>) {

  const pageData = ref<PageData<UserView, UserPageAdditional>>({
    page_idx: 1,
    page_size: 50,
    total: 0,
    data: [],
  })

  async function loadUserPageList(param: UserQueryParam) {
    try {
      loading && (loading.value = true)
      pageData.value = await UserApi.pageUserList(param)
    } catch (e) {
      ElMessage.error((e as Error)?.message || '加载失败')
    } finally {
      loading && (loading.value = false)
    }
  }

  return {
    pageData, loadUserPageList,
  }


}