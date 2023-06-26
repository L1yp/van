import { ref, Ref, toRaw } from "vue";
import { ElMessage } from "element-plus";
import * as WorkflowApi from "@/api/workflow";


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
      const data = await WorkflowApi.pageWorkflowDef(params)
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

  async function loadPageWithoutVer(params: WorkflowTypeDefPageParam) {
    try {
      loading && (loading.value = true)
      pageData.value = await WorkflowApi.pageWorkflowDefWithoutVer(params)
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
      workflowDef.value = await WorkflowApi.findById(id)
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

      await WorkflowApi.updateWorkflowDef(data)
      ElMessage.success('更新成功')
    } catch (e) {
      console.error(e)
      ElMessage.error((e as Error)?.message || '更新失败')
    } finally {
      loading && (loading.value = false)
    }
  }


  async function addDef(param: WorkflowTypeDefAddParam) {
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

      await WorkflowApi.addWorkflowDef(data)
      ElMessage.success('创建成功')
      return true
    } catch (e) {
      console.error(e)
      ElMessage.error((e as Error)?.message || '创建失败')
      return false
    } finally {
      loading && (loading.value = false)
    }
  }


  async function copyVer(id: string) {
    try {
      loading && (loading.value = true)
      await WorkflowApi.copyVer({ id })
      ElMessage.success('复制成功')
      return true
    } catch (e) {
      console.error(e)
      ElMessage.error((e as Error)?.message || '复制失败')
      return false
    } finally {
      loading && (loading.value = false)
    }
  }

  async function activeVer(id: string, remark: string) {
    try {
      loading && (loading.value = true)
      await WorkflowApi.activeVer({ id, remark })
      ElMessage.success('启用成功')
      return true
    } catch (e) {
      console.error(e)
      ElMessage.error((e as Error)?.message || '启用失败')
      return false
    } finally {
      loading && (loading.value = false)
    }
  }


  async function pendingVer(id: string) {
    try {
      loading && (loading.value = true)
      await WorkflowApi.pendingVer({ id })
      ElMessage.success('停用成功')
      return true
    } catch (e) {
      console.error(e)
      ElMessage.error((e as Error)?.message || '停用失败')
      return false
    } finally {
      loading && (loading.value = false)
    }
  }


  return {
    pageData, loadPage, loadPageWithoutVer, workflowDef, findDefById, updateDefById, addDef,
    copyVer, activeVer, pendingVer,
  }
}


export function useWorkflowInstanceApi(loading?: Ref<boolean>) {

  const startInstanceResult = ref<WorkflowInstanceCreateResult>()
  const startFormScheme = ref<ModelingPageView>()

  async function startInstance(data: WorkflowInstanceStartParam) {
    try {
      loading && (loading.value = true)
      startInstanceResult.value = await WorkflowApi.startInstance(data)
      ElMessage.success('启动流程成功')
      return true
    } catch (e) {
      console.error(e);
      ElMessage.error((e as Error)?.message || '启动失败')
      return false
    } finally {
      loading && (loading.value = false)
    }
  }

  async function getStartForm(mkey: string) {
    try {
      loading && (loading.value = true)
      startFormScheme.value = await WorkflowApi.getStartForm(mkey)
    } catch (e) {
      console.error(e);
      ElMessage.error((e as Error)?.message || '启动失败')
    } finally {
      loading && (loading.value = false)
    }
  }

  const instanceDetails = ref<WorkflowInstanceDetailsResult>()

  async function getInstanceInfo(params: WorkflowInstanceQueryParam) {
    try {
      loading && (loading.value = true)
      instanceDetails.value = await WorkflowApi.getInstanceInfo(params)
    } catch (e) {
      console.error(e);
      ElMessage.error((e as Error)?.message || '启动失败')
    } finally {
      loading && (loading.value = false)
    }
  }

  return {
    startInstanceResult, startInstance,
    startFormScheme, getStartForm,
    instanceDetails, getInstanceInfo,
  }

}

export function useWorkflowTaskApi(loading?: Ref<boolean>) {

  async function completeTask(data: WorkflowTaskCompleteParam) {
    try {
      loading && (loading.value = true)
      await WorkflowApi.completeTask(data)
      ElMessage.success('提交成功')
    } catch(e) {
      ElMessage.error((e as Error)?.message || '提交失败')
    } finally {
      loading && (loading.value = false)
    }
  }

  const todoTaskPage = ref<PageData<WorkflowTaskView, { user: UserView[] }>>({
    page_idx: 1,
    page_size: 20,
    total: 0,
    data: [],
    additional: { user: [] },
  })

  async function listTodoTask(param: WorkflowTaskFindParam) {
    try {
      loading && (loading.value = true)
      todoTaskPage.value = await WorkflowApi.listTodoTask(param)
    } catch (e) {
      console.error(e)
      ElMessage.error((e as Error)?.message || '查询待办失败')
    } finally {
      loading && (loading.value = false)
    }
  }


  const doneTaskPage = ref<PageData<WorkflowTaskView, { user: UserView[] }>>({
    page_idx: 1,
    page_size: 20,
    total: 0,
    data: [],
    additional: { user: [] },
  })

  async function listDoneTask(param: WorkflowTaskFindParam) {
    try {
      loading && (loading.value = true)
      doneTaskPage.value = await WorkflowApi.listDoneTask(param)
    } catch (e) {
      console.error(e)
      ElMessage.error((e as Error)?.message || '查询待办失败')
    } finally {
      loading && (loading.value = false)
    }
  }


  return {
    completeTask,
    todoTaskPage, listTodoTask,
    doneTaskPage, listDoneTask,
  }

}
