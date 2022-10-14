import { ref, Ref } from "vue";
import { ElMessage } from "element-plus";
import * as DeptApi from "@/api/sys/dept";
import {toTree} from "@/utils/common";

export function useDeptInfo(loading?: Ref<boolean>) {

  const tableData = ref<DeptView[]>([])
  const userMap = new Map<string, UserView>()

  async function loadDept() {
    try {
      loading && (loading.value = true)
      const data = await DeptApi.findDept()
      data.forEach(it => {
        it.owner_info && userMap.set(it.owner, it.owner_info)
        it.assistant_info && userMap.set(it.assistant, it.assistant_info)
      })
      tableData.value = toTree(data, 'id', 'pid')
    } catch (e) {
      ElMessage.error((e as Error)?.message || '加载失败')
    } finally {
      loading && (loading.value = false)
    }
  }

  async function updateDept(param: DeptUpdateParam) {
    try {
      loading && (loading.value = true)
      await DeptApi.updateDept(param)
      await loadDept()
      ElMessage.success('更新部门成功')
    } catch (e) {
      ElMessage.error((e as Error)?.message || '更新失败')
    } finally {
      loading && (loading.value = false)
    }
  }

  async function addDept(param: DeptAddParam) {
    try {
      loading && (loading.value = true)
      await DeptApi.addDept(param)
      await loadDept()
      ElMessage.success('创建部门成功')
    } catch (e) {
      ElMessage.error((e as Error)?.message || '创建失败')
    } finally {
      loading && (loading.value = false)
    }
  }

  async function deleteDept(id: string) {
    try {
      loading && (loading.value = true)
      await DeptApi.delDept(id)
      await loadDept()
      ElMessage.success('删除部门成功')
    } catch (e) {
      ElMessage.error((e as Error)?.message || '删除失败')
    } finally {
      loading && (loading.value = false)
    }
  }
  return {
    userMap, tableData, loadDept, updateDept, addDept, deleteDept
  }

}