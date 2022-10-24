import { ref, Ref } from "vue";
import * as OptionApi from "@/api/workflow/option";
import { ElMessage } from "element-plus";
import { toTree } from "@/utils/common";

export function useWorkflowOptionApi(loading?: Ref<boolean>) {

  const workflowOptionTypes = ref<WorkflowOptionTypeView[]>([])
  const workflowOptionValues = ref<WorkflowOptionValueView[]>([])


  async function findWorkflowOptionTypes(params: WorkflowOptionTypeFindParam) {
    try {
      loading && (loading.value = true)
      workflowOptionTypes.value = await OptionApi.getOptionTypes(params)
    } catch (e) {
      console.error(e);
      ElMessage.error((e as Error)?.message || '查询失败')
    } finally {
      loading && (loading.value = false)
    }
  }

  
  async function findWorkflowOptionValues(params: WorkflowOptionValueFindParam) {
    try {
      loading && (loading.value = true)
      const data = await OptionApi.getOptionValues(params)
      const treeData = toTree(data, 'id', 'pid')
      workflowOptionValues.value = treeData
    } catch (e) {
      console.error(e);
      ElMessage.error((e as Error)?.message || '查询失败')
    } finally {
      loading && (loading.value = false)
    }
  }

  
  async function addOptionType(data: WorkflowOptionTypeAddParam) {
    try {
      loading && (loading.value = true)
      await OptionApi.addOptionType(data)
      ElMessage.success('新增选项定义成功')
      return true
    } catch (e) {
      console.error(e);
      ElMessage.error((e as Error)?.message || '新增选项定义失败')
      return false
    } finally {
      loading && (loading.value = false)
    }
  }

    
  async function addOptionValue(data: WorkflowOptionValueAddParam) {
    try {
      loading && (loading.value = true)
      await OptionApi.addOptionValue(data)
      ElMessage.success('新增选项值成功')
      return true
    } catch (e) {
      console.error(e);
      ElMessage.error((e as Error)?.message || '新增选项值失败')
      return false
    } finally {
      loading && (loading.value = false)
    }
  }
    
  async function updateOptionType(data: WorkflowOptionTypeUpdateParam) {
    try {
      loading && (loading.value = true)
      await OptionApi.updateOptionType(data)
      ElMessage.success('更新选项定义成功')
      return true
    } catch (e) {
      console.error(e);
      ElMessage.error((e as Error)?.message || '更新选项定义失败')
      return false
    } finally {
      loading && (loading.value = false)
    }
  }
      
  async function deleteOptionType(id: string) {
    try {
      loading && (loading.value = true)
      await OptionApi.deleteOptionType(id)
      ElMessage.success('删除选项定义成功')
      return true
    } catch (e) {
      console.error(e);
      ElMessage.error((e as Error)?.message || '删除选项定义失败')
      return false
    } finally {
      loading && (loading.value = false)
    }
  }

  async function updateOptionValue(data: WorkflowOptionValueUpdateParam) {
    try {
      loading && (loading.value = true)
      await OptionApi.updateOptionValue(data)
      ElMessage.success('更新选项值成功')
      return true
    } catch (e) {
      console.error(e);
      ElMessage.error((e as Error)?.message || '更新选项值失败')
      return false
    } finally {
      loading && (loading.value = false)
    }
  }


      
  async function deleteOptionValue(id: string) {
    try {
      loading && (loading.value = true)
      await OptionApi.deleteOptionValue(id)
      ElMessage.success('删除选项值成功')
      return true
    } catch (e) {
      console.error(e);
      ElMessage.error((e as Error)?.message || '删除选项值失败')
      return false
    } finally {
      loading && (loading.value = false)
    }
  }

      
  async function resetOptionValue(id: string) {
    try {
      loading && (loading.value = true)
      await OptionApi.resetOptionValue(id)
      ElMessage.success('重置选项值成功')
      return true
    } catch (e) {
      console.error(e);
      ElMessage.error((e as Error)?.message || '重置选项值失败')
      return false
    } finally {
      loading && (loading.value = false)
    }
  }


  return {
    workflowOptionTypes, workflowOptionValues,
    findWorkflowOptionTypes, findWorkflowOptionValues,
    addOptionType, addOptionValue, updateOptionType, updateOptionValue, deleteOptionType, deleteOptionValue, resetOptionValue,
  }

}

