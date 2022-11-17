import * as VerApi from "@/api/workflow";
import { ElMessage } from "element-plus";
import { ref, Ref } from "vue";


export function useVerApi(loading: Ref<boolean>) {
  const workflowVer = ref<WorkflowTypeVerView>()

  async function findVer(id: string) {
    try {
      loading && (loading.value = true)
      workflowVer.value = await VerApi.findVerById(id)
    } catch (e) {
      console.error(e);
      ElMessage.error((e as Error)?.message || '查询失败')
    } finally {
      loading && (loading.value = false)
    }
  }

  async function updateXml(data: WorkflowTypeVerUpdateXmlParam) {
    try {
      loading && (loading.value = true)
      await VerApi.updateXml(data)
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

  async function activeVer(data: WorkflowTypeVerActiveParam) {
    try {
      loading && (loading.value = true)
      await VerApi.activeVer(data)
      return true
    } catch (e) {
      console.error(e);
      ElMessage.error((e as Error)?.message || '激活失败')
      return false
    } finally {
      loading && (loading.value = false)
    }
  }

  async function pendingVer(data: WorkflowTypeVerPendingParam) {
    try {
      loading && (loading.value = true)
      await VerApi.pendingVer(data)
      return true
    } catch (e) {
      console.error(e);
      ElMessage.error((e as Error)?.message || '挂起失败')
      return false
    } finally {
      loading && (loading.value = false)
    }
  }


  return {
    workflowVer, findVer, updateXml, activeVer, pendingVer
  }
}