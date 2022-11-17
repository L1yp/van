import { request } from '../request'

// 查询绑定表单
export function getPage(pageId: string) {
  return request<ModelingPageView>({
    url: `/modeling/page/${pageId}`,
    method: 'GET',
  })
}

// 查询绑定表单
export function findPage(params: ModelingPageFindParam) {
  return request<ModelingPageView>({
    url: `/modeling/page/find`,
    method: 'GET',
    params
  })
}


// 创建表单
export function addPage(data: ModelingPageAddParam) {
  return request<void>({
    url: `/modeling/page/add`,
    method: 'POST',
    data
  })
}

export function addAndBindPage(data: ModelingPageAddAndBindParam) {
  return request<void>({
    url: `/modeling/page/add_and_bind`,
    method: 'POST',
    data
  })
}

// 更新表单
export function updatePage(data: ModelingPageUpdateParam) {
  return request<void>({
    url: `/modeling/page/update`,
    method: 'POST',
    data
  })
}

// 绑定表单
export function bindPage(data: ModelingPageBindParam) {
  return request<ModelingViewDetailInfo[]>({
    url: `/modeling/page/bind`,
    method: 'POST',
    data
  })
}


// 解绑表单
export function unbindPage(data: ModelingPageUnbindParam) {
  return request<ModelingViewDetailInfo[]>({
    url: `/modeling/page/unbind`,
    method: 'POST',
    data
  })
}