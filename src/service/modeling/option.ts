import { ref, Ref } from "vue";
import * as OptionApi from "@/api/modeling/option";
import { ElMessage } from "element-plus";
import { toTree } from "@/utils/common";

export function useModelingOptionApi(loading?: Ref<boolean>) {

  const modelingOptionTypes = ref<ModelingOptionTypeView[]>([])
  const modelingOptionValues = ref<ModelingOptionValueView[]>([])


  async function findModelingOptionTypes(params: ModelingOptionTypeFindParam) {
    try {
      loading && (loading.value = true)
      modelingOptionTypes.value = await OptionApi.getOptionTypes(params)
    } catch (e) {
      console.error(e);
      ElMessage.error((e as Error)?.message || '查询失败')
    } finally {
      loading && (loading.value = false)
    }
  }


  async function findModelingOptionValues(params: ModelingOptionValueFindParam) {
    try {
      loading && (loading.value = true)
      const data = await OptionApi.getOptionValues(params)
      const treeData = toTree(data, 'id', 'pid')
      modelingOptionValues.value = treeData
    } catch (e) {
      console.error(e);
      ElMessage.error((e as Error)?.message || '查询失败')
    } finally {
      loading && (loading.value = false)
    }
  }


  async function addOptionType(data: ModelingOptionTypeAddParam) {
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


  async function addOptionValue(data: ModelingOptionValueAddParam) {
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

  async function updateOptionType(data: ModelingOptionTypeUpdateParam) {
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

  async function updateOptionValue(data: ModelingOptionValueUpdateParam) {
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
    modelingOptionTypes, modelingOptionValues,
    findModelingOptionTypes, findModelingOptionValues,
    addOptionType, addOptionValue, updateOptionType, updateOptionValue, deleteOptionType, deleteOptionValue, resetOptionValue,
  }

}

