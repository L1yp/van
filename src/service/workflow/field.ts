import { ref, Ref } from "vue";
import * as FieldApi from "@/api/workflow/field";
import { ElMessage } from "element-plus";

export function useWorkflowFieldApi(loading?: Ref<boolean>) {

  const workflowFields = ref<WorkflowFieldDefView[]>([])
  const defaultFields = ref<WorkflowFieldDefView[]>([])
  const globalFields = ref<WorkflowFieldDefView[]>([])

  async function findWorkflowFields(wfKey: string) {
    try {
      loading && (loading.value = true)
      workflowFields.value = await FieldApi.getWorkflowFields(wfKey)
    } catch (e) {
      console.error(e);
      ElMessage.error((e as Error)?.message || '查询失败')
    } finally {
      loading && (loading.value = false)
    }
  }


  async function findDefaultFields() {
    try {
      loading && (loading.value = true)
      defaultFields.value = await FieldApi.getScopeFields('DEFAULT')
    } catch (e) {
      console.error(e);
      ElMessage.error((e as Error)?.message || '查询失败')
    } finally {
      loading && (loading.value = false)
    }
  }

  
  async function findGlobalFields() {
    try {
      loading && (loading.value = true)
      globalFields.value = await FieldApi.getScopeFields('GLOBAL')
    } catch (e) {
      console.error(e);
      ElMessage.error((e as Error)?.message || '查询失败')
    } finally {
      loading && (loading.value = false)
    }
  }

  
  async function addField(data: WorkflowFieldAddParam) {
    try {
      loading && (loading.value = true)
      await FieldApi.addWorkflowField(data)
      ElMessage.success('新增字段成功')
      return true
    } catch (e) {
      console.error(e);
      ElMessage.error((e as Error)?.message || '查询失败')
      return false
    } finally {
      loading && (loading.value = false)
    }
  }

    
  async function updateField(data: WorkflowFieldUpdateParam) {
    try {
      loading && (loading.value = true)
      await FieldApi.updateWorkflowField(data)
      ElMessage.success('更新字段成功')
      return true
    } catch (e) {
      console.error(e);
      ElMessage.error((e as Error)?.message || '查询失败')
      return false
    } finally {
      loading && (loading.value = false)
    }
  }

      
  async function refField(data: WorkflowFieldRefParam) {
    try {
      loading && (loading.value = true)
      await FieldApi.refWorkflowField(data)
      ElMessage.success('引用字段成功')
      return true
    } catch (e) {
      console.error(e);
      ElMessage.error((e as Error)?.message || '查询失败')
      return false
    } finally {
      loading && (loading.value = false)
    }
  }

      
  async function unrefField(data: WorkflowFieldRefParam) {
    try {
      loading && (loading.value = true)
      await FieldApi.unrefWorkflowField(data)
      ElMessage.success('解绑字段成功')
      return true
    } catch (e) {
      console.error(e);
      ElMessage.error((e as Error)?.message || '查询失败')
      return false
    } finally {
      loading && (loading.value = false)
    }
  }

  async function deleteField(id: string) {
    try {
      loading && (loading.value = true)
      await FieldApi.deleteWorkflowField(id)
      ElMessage.success('删除字段成功')
      return true
    } catch (e) {
      console.error(e);
      ElMessage.error((e as Error)?.message || '查询失败')
      return false
    } finally {
      loading && (loading.value = false)
    }
  }


  return {
    workflowFields, findWorkflowFields,
    defaultFields, findDefaultFields,
    globalFields, findGlobalFields,
    addField, updateField, refField, unrefField, deleteField, 
  }

}

export function useTableScheme(loading?: Ref<boolean>) {
  const tables = ref<TableScheme[]>([])
  const columns = ref<TableScheme[]>([])


  async function getTables() {
    try {
      loading && (loading.value = true)
      tables.value = await FieldApi.getTables()
    } catch (e) {
      console.error(e);
      ElMessage.error((e as Error)?.message || '查询失败')
    } finally {
      loading && (loading.value = false)
    }
  }

  
  async function getTableColumns(tableName: string) {
    try {
      loading && (loading.value = true)
      columns.value = await FieldApi.getTableColumns(tableName)
    } catch (e) {
      console.error(e);
      ElMessage.error((e as Error)?.message || '查询失败')
    } finally {
      loading && (loading.value = false)
    }
  }


  return {
    tables, columns, getTables, getTableColumns
  }
}