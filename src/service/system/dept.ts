import { ref, Ref } from "vue";
import { ElMessage } from "element-plus";
import * as DeptApi from "@/api/sys/dept";
import {toTree} from "@/utils/common";

export function useDeptInfo(loading?: Ref<boolean>) {

  const tableData = ref<DeptView[]>([])

  async function loadDept() {
    try {
      const data = await DeptApi.findDept()
      tableData.value = toTree(data, 'id', 'pid')
    } catch (e) {
      ElMessage.error((e as Error)?.message || '加载失败')
    }
  }

  return {
    tableData, loadDept
  }

}