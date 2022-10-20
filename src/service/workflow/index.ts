import { ref, Ref, toRaw } from "vue";
import { ElMessage } from "element-plus";
import { pageWorkflowDef, findById, updateWorkflowDef } from "@/api/workflow";


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

  const workflowDef = ref<WorkflowTypeDefView>()
  async function findDefById(id: string) {
    try {
      loading && (loading.value = true)
      workflowDef.value = await findById(id)
    } catch (e) {
      console.error(e)
      ElMessage.error((e as Error)?.message || '查询失败')
    } finally {
      loading && (loading.value = false)
    }
  }

  async function updateDefById(param: WorkflowTypeDefUpdateParam) {
    try {
      loading && (loading.value = true)
      const data = toRaw(param)
      if (data.code_gen_rule.type === 'class') {
        const rule = data.code_gen_rule as ClassGenRule
        data.code_gen_rule = {
          type: 'class',
          class_name: rule.class_name,
        } as ClassGenRule
      } else if(data.code_gen_rule.type === 'fixed') {
        const rule = data.code_gen_rule as FixedGenRule
        data.code_gen_rule = {
          type: 'fixed',
          prefix: rule.prefix,
          delimiter: rule.delimiter,
          date_format: rule.date_format,
          joiner: rule.joiner,
          num_format: rule.num_format,
        } as FixedGenRule
      }

      await updateWorkflowDef(data)
      ElMessage.success('更新成功')
    } catch (e) {
      console.error(e)
      ElMessage.error((e as Error)?.message || '查询失败')
    } finally {
      loading && (loading.value = false)
    }
  }



  return {
    pageData, loadPage, workflowDef, findDefById, updateDefById
  }
}
