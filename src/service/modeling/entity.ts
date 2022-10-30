import { ref, Ref } from "vue";
import * as EntityApi from "@/api/modeling/entity";
import { ElMessage } from "element-plus";

export function useEntityApi(loading?: Ref<boolean>) {

  const pageData = ref<PageData<ModelingEntityView, Map<string, UserView>>>({
    total: 0,
    data: [],
  })

  const modelView = ref<ModelingEntityView>()

  async function findEntity(id: string) {
    try {
      loading && (loading.value = true)
      modelView.value = await EntityApi.findModelingEntity(id)
    } catch (e) {
      console.error(e);
      ElMessage.error((e as Error)?.message || '查询失败')
    } finally {
      loading && (loading.value = false)
    }
  }

  async function searchEntity(param: Partial<ModelingEntityFindParam>) {
    try {
      loading && (loading.value = true)
      pageData.value = await EntityApi.searchModelingEntity(param)
    } catch (e) {
      console.error(e);
      ElMessage.error((e as Error)?.message || '查询失败')
    } finally {
      loading && (loading.value = false)
    }
  }

  async function addEntity(data: ModelingEntityAddParam) {
    try {
      loading && (loading.value = true)
      await EntityApi.addModelingEntity(data)
      ElMessage.success('创建成功')
      return true
    } catch (e) {
      console.error(e);
      ElMessage.error((e as Error)?.message || '创建失败')
      return false
    } finally {
      loading && (loading.value = false)
    }
  }

  async function updateEntity(data: ModelingEntityUpdateParam) {
    try {
      loading && (loading.value = true)
      await EntityApi.updateModelingEntity(data)
      ElMessage.success('更新成功')
      return true
    } catch (e) {
      console.error(e);
      ElMessage.error((e as Error)?.message || '更新失败')
      return false
    } finally {
      loading && (loading.value = false)
    }
  }

  async function deleteEntity(id: string) {
    try {
      loading && (loading.value = true)
      await EntityApi.deleteModelingEntity(id)
      ElMessage.success('删除成功')
      return true
    } catch (e) {
      console.error(e);
      ElMessage.error((e as Error)?.message || '删除失败')
      return false
    } finally {
      loading && (loading.value = false)
    }
  }


  return {
    pageData, modelView, findEntity, searchEntity, addEntity, updateEntity, deleteEntity
  }
}