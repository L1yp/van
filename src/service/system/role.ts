import { ElMessage } from 'element-plus';
import * as RoleApi from '@/api/sys/role'
import { ref, Ref } from 'vue';

export function useRole(loading?: Ref<boolean>) {

  const roleData = ref<RoleView[]>([])

  async function loadRole() {
    try {
      loading && (loading.value = true)
      roleData.value = await RoleApi.findRole()
    } catch (e) {
      ElMessage.error((e as Error)?.message || '加载角色失败')
    } finally {
      loading && (loading.value = false)
    }
  }


  return {
    roleData, loadRole
  }
}