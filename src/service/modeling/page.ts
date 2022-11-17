import * as PageApi from '@/api/modeling/page'
import {ref, Ref} from "vue";
import {ElMessage} from "element-plus";


export function useModelingPageApi(loading?: Ref<boolean>) {

  const pageInfo = ref<ModelingPageView>()
  const pageList = ref<ModelingPageView[]>([])


  async function getPage(pageId: string) {
    try {
      loading && (loading.value = true)
      pageInfo.value = await PageApi.getPage(pageId)
    } catch (e) {
      console.error(e)
      ElMessage.error((e as Error)?.message || '查询失败')
    } finally {
      loading && (loading.value = false)
    }
  }

  async function findPage(param: ModelingPageFindParam) {
    try {
      loading && (loading.value = true)
      pageInfo.value = await PageApi.findPage(param)
    } catch (e) {
      console.error(e)
      ElMessage.error((e as Error)?.message || '查询失败')
    } finally {
      loading && (loading.value = false)
    }
  }


  async function findModulePages(param: ModelingPageModuleFindParam) {
    try {
      loading && (loading.value = true)
      pageList.value = await PageApi.findModulePages(param)
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
    pageInfo, getPage, findPage, bindPage, unbindPage,
    pageList, findModulePages,
  }
}