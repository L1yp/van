import axios from "axios";
import {request} from "@/api/request";

/**
 * 获取字典列表
 */
export function findDictInfoList(): Promise<DictInfo[]> {
  return request<DictInfo[]>({
    method: 'get',
    url: `/dict/info/list`,
  })
}

/**
 * 新增字典信息
 */
export function addDictInfo(data: DictInfo): Promise<void> {
  return request<void>({
    method: 'post',
    url: `/dict/info/add`,
    data
  })
}

/**
 * 更新字典信息
 */
export function updateDictInfo(data: DictInfo): Promise<void> {
  return request<void>({
    method: 'post',
    url: `/dict/info/update`,
    data
  })
}

/**
 * 删除字典信息
 */
export function deleteDictInfo(id: number): Promise<void> {
  return request<void>({
    method: 'delete',
    url: `/dict/info/${id}`,
  })
}

/**
 * 删除字典信息
 * @param ids join by COMMA(,)
 */
export function batchDeleteDictInfo(ids: string): Promise<void> {
  return request<void>({
    method: 'delete',
    url: `/dict/info/batch/${encodeURIComponent(ids)}`
  })
}


/**
 * 获取字典值列表
 */
export function findDictValueList(scope: string, ident: string): Promise<DictValue[]> {
  return request<DictValue[]>({
    method: 'get',
    url: `/dict/value/list/${scope}/${ident}`
  })
}

/**
 * 获取全部键值
 */
export function findAllDictValue(): Promise<DictValue[]> {
  return request<DictValue[]>({
    method: 'get',
    url: `/dict/value/list`
  })
}



/**
 * 新增字典值信息
 */
export function addDictValue(data: DictValue): Promise<void> {
  return request<void>({
    method: 'post',
    url: `/dict/value/add`,
    data
  })
}

/**
 * 更新字典值信息
 */
export function updateDictValue(data: DictValue): Promise<void> {
  return request<void>({
    method: 'post',
    url: `/dict/value/update`,
    data
  })
}

/**
 * 删除字典值信息
 */
export function deleteDictValue(id: number): Promise<void> {
  return request<void>({
    method: 'delete',
    url: `/dict/value/${id}`,
  })
}

/**
 * 删除字典信息
 * @param ids join by COMMA(,)
 */
export function batchDeleteDictValue(ids: string): Promise<void> {
  return request<void>({
    method: 'delete',
    url: `/dict/value/batch/${encodeURIComponent(ids)}`,
  })
}

