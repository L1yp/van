import axios from "axios";
import {request} from "@/api/request";

/**
 * 获取菜单列表
 * @return {Promise<Object>}
 */
export function findMenu(): Promise<MenuConfig[]> {
  return request<MenuConfig[]>({
    method: 'get',
    url: `/menu/find`,
  })
}

/**
 * 添加菜单
 * @param {String} title 菜单标题
 * @param {String} name 路由名称
 * @param {String} route 路由
 * @param {String} icon 图标名
 * @param {Number} close 是否可关闭
 * @param {Number} hidden 是否隐藏
 * @param {Number} pid 父节点ID
 * @return {Promise<Object>}
 */
export function addMenu(title: string, name: string, route: string, icon: string,
                        close: number, hidden: number, pid: number): Promise<void> {
  const data = {title, name, route, icon, close, hidden, pid};
  return request<void>({
    method: 'post',
    url: `/menu/add`,
    data
  })
}


/**
 * 添加菜单
 * @param {Number} id 菜单ID
 * @param {String} title 菜单标题
 * @param {String} name 路由名称
 * @param {String} route 路由
 * @param {String} icon 图标名
 * @param {Number} close 是否可关闭
 * @param {Number} hidden 是否隐藏
 * @param {Number} pid 父节点ID
 * @return {Promise<Object>}
 */
export function updateMenu(id: number, title: string, name: string, route: string, icon: string,
                        close: number, hidden: number, pid: number): Promise<void> {
  const data = {id, title, name, route, icon, close, hidden, pid};
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
export function delMenu(id: number): Promise<void> {
  return request<void>({
    method: 'delete',
    url: `/menu/${id}`,
  })
}

