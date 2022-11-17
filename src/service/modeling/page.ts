import * as PageApi from '@/api/modeling/page'
import {ref, Ref} from "vue";
import {ElMessage} from "element-plus";


export function useModelingPageApi(loading?: Ref<boolean>) {

  const pageInfo = ref<ModelingPageView>()


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


  async function bindPage(param: ModelingPageBindParam) {
    try {
      loading && (loading.value = true)
      await PageApi.bindPage(param)
      ElMessage.success('绑定成功')
      return true
    } catch (e) {
      console.error(e)
      ElMessage.error((e as Error)?.message || '绑定失败')
      return false
    } finally {
      loading && (loading.value = false)
    }
  }

  async function unbindPage(param: ModelingPageUnbindParam) {
    try {
      loading && (loading.value = true)
      await PageApi.unbindPage(param)
      ElMessage.success('解绑成功')
      return true
    } catch (e) {
      console.error(e)
      ElMessage.error((e as Error)?.message || '解绑失败')
      return false
    } finally {
      loading && (loading.value = false)
    }
  }


  async function addPage(param: ModelingPageAddParam) {
    try {
      loading && (loading.value = true)
      await PageApi.addPage(param)
      ElMessage.success('创建成功')
      return true
    } catch (e) {
      console.error(e)
      ElMessage.error((e as Error)?.message || '绑定失败')
      return false
    } finally {
      loading && (loading.value = false)
    }
  }

  async function addAndBindPage(param: ModelingPageAddAndBindParam) {
    try {
      loading && (loading.value = true)
      await PageApi.addAndBindPage(param)
      ElMessage.success('创建并绑定成功')
      return true
    } catch (e) {
      console.error(e)
      ElMessage.error((e as Error)?.message || '绑定失败')
      return false
    } finally {
      loading && (loading.value = false)
    }
  }


  async function updatePage(param: ModelingPageUpdateParam) {
    try {
      loading && (loading.value = true)
      await PageApi.updatePage(param)
      ElMessage.success('绑定成功')
      return true
    } catch (e) {
      console.error(e)
      ElMessage.error((e as Error)?.message || '绑定失败')
      return false
    } finally {
      loading && (loading.value = false)
    }
  }



  return {
    pageInfo, getPage, findPage, bindPage, unbindPage, addPage, updatePage, addAndBindPage,
  }
}