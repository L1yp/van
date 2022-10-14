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

  async function addRole(name: string, orderNo: number) {
    try {
      loading && (loading.value = true)
      await RoleApi.addRole(name, orderNo)
      roleData.value = await RoleApi.findRole()
      ElMessage.success('新增成功')
    } catch (e) {
      ElMessage.error((e as Error)?.message || '新增失败')
    } finally {
      loading && (loading.value = false)
    }
  }

  async function updateRole(id: string, name: string, orderNo: number) {
    try {
      loading && (loading.value = true)
      await RoleApi.updateRole(id, name, orderNo)
      roleData.value = await RoleApi.findRole()
      ElMessage.success('更新成功')
    } catch (e) {
      ElMessage.error((e as Error)?.message || '更新失败')
    } finally {
      loading && (loading.value = false)
    }
  }

  async function deleteRoleById(id: string) {
    try {
      loading && (loading.value = true)
      await RoleApi.deleteRole(id)
      roleData.value = await RoleApi.findRole()
      ElMessage.success('删除成功')
    } catch (e) {
      ElMessage.error((e as Error)?.message || '删除失败')
    } finally {
      loading && (loading.value = false)
    }
  }

  
  async function deleteRoleByIds(ids: string[]) {
    if (!ids?.length) {
      return
    }
    try {
      loading && (loading.value = true)
      await RoleApi.batchDelRole(ids.join(','))
      roleData.value = await RoleApi.findRole()
      ElMessage.success('删除成功')
    } catch (e) {
      ElMessage.error((e as Error)?.message || '删除失败')
    } finally {
      loading && (loading.value = false)
    }
  }


  return {
    roleData, loadRole, addRole, updateRole, deleteRoleById, deleteRoleByIds,
  }
}