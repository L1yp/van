import * as PageApi from '@/api/modeling/page'
import {ref, Ref} from "vue";
import {ElMessage} from "element-plus";


export function useModelingPageApi(loading?: Ref<boolean>) {

  const pageInfo = ref<ModelingPageView>()

  async function getPage(param: ModelingPageFindParam) {
    try {
      loading && (loading.value = true)
      pageInfo.value = await PageApi.getPage(param)
    } catch (e) {
      console.error(e)
      ElMessage.error((e as Error)?.message || '查询失败')
    } finally {
      loading && (loading.value = false)
    }
  }


  async function bindPage(param: ModelingPageBindParam) {
    try {
      loading && (loading.value = true)
      await PageApi.bindPage(param)
      ElMessage.success('绑定成功')
    } catch (e) {
      console.error(e)
      ElMessage.error((e as Error)?.message || '绑定失败')
    } finally {
      loading && (loading.value = false)
    }
  }

  async function unbindPage(param: ModelingPageUnbindParam) {
    try {
      loading && (loading.value = true)
      await PageApi.unbindPage(param)
      ElMessage.success('解绑成功')
    } catch (e) {
      console.error(e)
      ElMessage.error((e as Error)?.message || '解绑失败')
    } finally {
      loading && (loading.value = false)
    }
  }






  return {
    pageInfo, getPage, bindPage, unbindPage,
  }
}