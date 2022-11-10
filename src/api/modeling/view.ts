import { request } from '../request'

export function searchModelingView(params: ModelingViewSearchParam) {
  return request<ModelingViewDetailInfo[]>({
    url: `/modeling/view/search`,
    method: 'GET',
    params
  })
}


export function findModelingView(params: ModelingViewFindParam) {
  return request<ModelingViewSimpleInfo[]>({
    url: `/modeling/view/find`,
    method: 'GET',
    params
  })
}

export function addModelingView(data: ModelingViewAddParam) {
  return request<void>({
    url: `/modeling/view/add`,
    method: 'POST',
    data,
  })
}

export function updateModelingView(data: ModelingViewUpdateParam) {
  return request<void>({
    url: `/modeling/view/update`,
    method: 'POST',
    data,
  })
}


export function deleteModelingView(id: string) {
  return request<void>({
    url: `/modeling/view/${id}`,
    method: 'DELETE',
  })
}



export function findModelingPage(data: ModelingInstancePageFindParam) {
  return request<PageData<Record<string, any>[]>>({
    url: `/modeling/view/page`,
    method: 'POST',
    data,
  })
}