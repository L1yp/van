import { toTree } from '@/utils/common';
import { ElMessage } from 'element-plus';
import * as MenuApi from '@/api/sys/menu'
import { ref, Ref } from 'vue';

export function useMenuData(loading?: Ref<boolean>) {

  const menuTree = ref<MenuView[]>([])

  async function loadMenuTree() {
    try {
      loading && (loading.value = true)
      const data = await MenuApi.findMenu()
      menuTree.value = toTree(data, 'id', 'pid', 'order_no')
    } catch (e) {
      console.error(e);
      ElMessage.error((e as Error)?.message || '加载菜单列表失败')
    } finally {
      loading && (loading.value = false)
    }
  }



  return {
    menuTree, loadMenuTree,
  }
}