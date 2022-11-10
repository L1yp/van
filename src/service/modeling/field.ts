import { ref, Ref } from "vue";
import * as FieldApi from "@/api/modeling/field";
import { ElMessage } from "element-plus";

export function useModelingFieldApi(loading?: Ref<boolean>) {

  const modelingFields = ref<ModelingFieldDefView[]>([])
  const defaultEntityFields = ref<ModelingFieldDefView[]>([])
  const defaultWorkflowFields = ref<ModelingFieldDefView[]>([])
  const globalFields = ref<ModelingFieldDefView[]>([])

  async function findModelingFields(module: ModelingModule, key: string) {
    try {
      loading && (loading.value = true)
      modelingFields.value = await FieldApi.getModelingFields(module, key)
    } catch (e) {
      console.error(e);
      ElMessage.error((e as Error)?.message || '查询失败')
    } finally {
      loading && (loading.value = false)
    }
  }


  async function findDefaultEntityFields() {
    try {
      loading && (loading.value = true)
      defaultEntityFields.value = await FieldApi.getScopeFields('ENTITY_DEFAULT')
    } catch (e) {
      console.error(e);
      ElMessage.error((e as Error)?.message || '查询失败')
    } finally {
      loading && (loading.value = false)
    }
  }

  async function findDefaultWorkflowFields() {
    try {
      loading && (loading.value = true)
      defaultWorkflowFields.value = await FieldApi.getScopeFields('WORKFLOW_DEFAULT')
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


  async function addField(data: ModelingFieldAddParam) {
    try {
      loading && (loading.value = true)
      await FieldApi.addModelingField(data)
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


  async function updateField(data: ModelingFieldUpdateParam) {
    try {
      loading && (loading.value = true)
      await FieldApi.updateModelingField(data)
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


  async function refField(data: ModelingFieldRefParam) {
    try {
      loading && (loading.value = true)
      await FieldApi.refModelingField(data)
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


  async function unrefField(data: ModelingFieldRefParam) {
    try {
      loading && (loading.value = true)
      await FieldApi.unrefModelingField(data)
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
      await FieldApi.deleteModelingField(id)
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
    modelingFields, findModelingFields,
    defaultEntityFields, findDefaultEntityFields,
    defaultWorkflowFields, findDefaultWorkflowFields,
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