import * as ViewApi from "@/api/modeling/view";
import {ref, Ref} from "vue";
import {ElMessage} from "element-plus";


export function useViewApi(loading?: Ref<boolean>) {

  const viewSimpleInfoList = ref<ModelingViewSimpleInfo[]>([])
  const viewDetailInfoList = ref<ModelingViewDetailInfo[]>([])

  async function findView(param: ModelingViewFindParam) {
    try {
      loading && (loading.value = true)
      viewSimpleInfoList.value = await ViewApi.findModelingView(param)
    } catch (e) {
      console.error(e)
      ElMessage.error((e as Error)?.message || '查询失败')
    } finally {
      loading && (loading.value = false)
    }
  }

  async function searchView(param: ModelingViewSearchParam) {
    try {
      loading && (loading.value = true)
      viewDetailInfoList.value = await ViewApi.searchModelingView(param)
    } catch (e) {
      console.error(e)
      ElMessage.error((e as Error)?.message || '搜索失败')
    } finally {
      loading && (loading.value = false)
    }
  }

  async function addView(param: ModelingViewAddParam) {
    try {
      loading && (loading.value = true)
      await ViewApi.addModelingView(param)
      ElMessage.success('创建成功')
      return true
    } catch (e) {
      console.error(e)
      ElMessage.error((e as Error)?.message || '新增失败')
      return false
    } finally {
      loading && (loading.value = false)
    }
  }

  async function updateView(param: ModelingViewUpdateParam) {
    try {
      loading && (loading.value = true)
      await ViewApi.updateModelingView(param)
      ElMessage.success('更新成功')
      return true
    } catch (e) {
      console.error(e)
      ElMessage.error((e as Error)?.message || '更新失败')
      return false
    } finally {
      loading && (loading.value = false)
    }
  }

  async function deleteView(id: string) {
    try {
      loading && (loading.value = true)
      await ViewApi.deleteModelingView(id)
      ElMessage.success('删除成功')
      return true
    } catch (e) {
      console.error(e)
      ElMessage.error((e as Error)?.message || '删除失败')
      return false
    } finally {
      loading && (loading.value = false)
    }
  }

  const pageData = ref<PageData<Record<string, any>, {
    userMap: Record<string, UserView>,
    deptMap: Record<string, DeptView>
    optionMap: Record<string, ModelingOptionValueView>
  }>>({
    total: 0,
    data: []
  })

  async function pageModeling(param: ModelingInstancePageFindParam) {
    try {
      loading && (loading.value = true)
      pageData.value = await ViewApi.findModelingPage(param)
    } catch (e) {
      console.error(e)
    } finally {
      loading && (loading.value = false)
    }
  }

  return {
    viewSimpleInfoList, viewDetailInfoList, findView, searchView, addView, updateView, deleteView,
    pageData, pageModeling,
  }

}