import * as PermissionApi from "@/api/modeling/permission";
import { ref, Ref } from "vue";
import { ElMessage } from "element-plus";

export function useModelingPermissionApi(loading?: Ref<boolean>) {
  const permissionContent = ref<ModelingPermissionView>()

  async function getPermissionContent(param: ModelingPermissionFindParam) {
    try {
      loading && (loading.value = true)
      permissionContent.value = await PermissionApi.getPermissionContent(param)
    } catch (e) {
      console.error(e)
      ElMessage.error((e as Error)?.message || '查询失败')
    } finally {
      loading && (loading.value = false)
    }
  }


  async function bindPermissionContent(param: ModelingPermissionBindParam) {
    try {
      loading && (loading.value = true)
      await PermissionApi.bindPermission(param)
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
    permissionContent, getPermissionContent, bindPermissionContent
  }

}