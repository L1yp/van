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

// 查询绑定表单
export function findModulePages(params: ModelingPageModuleFindParam) {
  return request<ModelingPageView[]>({
    url: `/modeling/page/module/find`,
    method: 'GET',
    params
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