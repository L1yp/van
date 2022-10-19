import { ref, Ref } from "vue";
import { ElMessage } from "element-plus";
import { pageWorkflowDef } from "@/api/workflow";


export function useWorkflowApi(loading?: Ref<boolean>) {
  const pageData = ref<PageData<WorkflowTypeDefView, Record<string, UserView>>>({
    page_idx: 1,
    page_size: 20,
    data: [],
    total: 0,
    additional: {},
  })

  async function loadPage(params: WorkflowTypeDefPageParam) {
    try {
      loading && (loading.value = true)
      const data = await pageWorkflowDef(params)
      data.data.forEach(row => {
        row.children.forEach(it => it.name = `${row.name} V${it.ver}`)
      })
      pageData.value = data
    } catch (e) {
      console.error(e)
      ElMessage.error((e as Error)?.message || '加载失败')
    } finally {
      loading && (loading.value = false)
    }
  }



  return {
    pageData, loadPage,
  }
}