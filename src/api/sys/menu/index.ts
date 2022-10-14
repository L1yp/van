import axios from "axios";
import {request} from "@/api/request";

/**
 * 获取菜单列表
 */
export function findMenu() {
  return request<MenuView[]>({
    method: 'get',
    url: `/menu/find`,
  })
}

/**
 * 添加菜单
 */
export function addMenu(data: MenuAddParam): Promise<void> {
  return request<void>({
    method: 'post',
    url: `/menu/add`,
    data
  })
}


/**
 * 更新菜单
 */
export function updateMenu(data: MenuUpdateParam): Promise<void> {
  return request<void>({
    method: 'post',
    url: `/menu/update`,
    data
  })
}


/**
 * 删除菜单
 * @param {Number} id 角色ID
 */
export function delMenu(id: string): Promise<void> {
  return request<void>({
    method: 'delete',
    url: `/menu/${id}`,
  })
}

