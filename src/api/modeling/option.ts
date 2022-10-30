import { request } from '../request'



export function getOptionTypes(params: ModelingOptionTypeFindParam) {
  return request<ModelingOptionTypeView[]>({
    url: `/modeling/option/type/find`,
    method: 'GET',
    params,
  })
}

export function addOptionType(data: ModelingOptionTypeAddParam) {
  return request<void>({
    url: `/modeling/option/type/add`,
    method: 'POST',
    data,
  })
}

export function updateOptionType(data: ModelingOptionTypeUpdateParam) {
  return request<void>({
    url: `/modeling/option/type/update`,
    method: 'POST',
    data,
  })
}


export function deleteOptionType(id: string) {
  return request<void>({
    url: `/modeling/option/type/${id}`,
    method: 'DELETE',
  })
}


export function getOptionValues(params: ModelingOptionValueFindParam) {
  return request<ModelingOptionValueView[]>({
    url: `/modeling/option/value/find`,
    method: 'GET',
    params,
  })
}

export function addOptionValue(data: ModelingOptionValueAddParam) {
  return request<void>({
    url: `/modeling/option/value/add`,
    method: 'POST',
    data,
  })
}

export function updateOptionValue(data: ModelingOptionValueUpdateParam) {
  return request<void>({
    url: `/modeling/option/value/update`,
    method: 'POST',
    data,
  })
}

// 禁用选项值
export function deleteOptionValue(id: string) {
  return request<void>({
    url: `/modeling/option/value/${id}`,
    method: 'DELETE',
  })
}

export function resetOptionValue(id: string) {
  return request<void>({
    url: `/modeling/option/value/reset/${id}`,
    method: 'PUT',
  })
}
