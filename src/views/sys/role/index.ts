/**
 * 构建 分配权限的树结构
 * @param menuOptions 所有的菜单结构
 * @param permissions 所有的权限列表
 */
export function buildPermissionTree(menuOptions: MenuConfig[], permissions: PermissionView[]): PermissionTree[] {
  const tree = menuOptionsToPermission(menuOptions)
  for (let permission of permissions) {
    const item :PermissionTree = getMenu(tree, permission.owner_menu_id)
    item.children.push({
      id: `permission-${permission.id}`,
      title: permission.ident,
      children: []
    })
  }
  return  tree
}

function menuOptionsToPermission(menuOptions: MenuConfig[]): PermissionTree[] {
  const result: PermissionTree[] = []
  for (let menuOption of menuOptions) {
    let children = []
    if (menuOption.children && menuOption.children.length > 0) {
      children = menuOptionsToPermission(menuOption.children)
    }
    result.push({
      id: `menu-${menuOption.id}`,
      title: menuOption.title,
      children
    })
  }
  return result
}



function getMenu(menuTree: PermissionTree[], menuId: number): PermissionTree {
  for (let menuOption of menuTree) {
    if (menuOption.id === `menu-${menuId}`) {
      return menuOption
    }

    if (menuOption.children && menuOption.children.length > 0) {
      const item = getMenu(menuOption.children, menuId)
      if (item) return item
    }
  }

  return null
}

