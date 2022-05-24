import axios from "axios";
import {request} from "@/api/request";

/**
 * 创建流程界面
 */
export function createPage(param: AddProcessModelPageParam): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    axios.post(`/process/model/page/create`, param).then(response => {
      if (response.data.code === 200) {
        resolve(response.data.data);
      } else {
        reject(new Error(response.data.message));
      }
    }).catch(err => reject(err));
  });
}

/**
 * 创建流程页面定义
 */
export function createPageScheme(param: AddProcessModelPageSchemeParam) {
  return request({
    method: 'POST',
    url: '/process/model/page/scheme/create',
    data: param
  });
}

/**
 * 流程节点绑定界面
 */
export function bindProcessNodePage(param: BindProcessModelNodePageParam) {
  return request({
    method: 'POST',
    url: '/process/model/page/bind',
    data: param
  });
}
/**
 * 查询流程界面
 */
export function listProcessPage(processKey): Promise<ProcessModelPageView[]> {
  return request<ProcessModelPageView[]>({
    method: 'GET',
    url: '/process/model/page/list',
    params: { processKey }
  });
}

/**
 * 查询流程界面定义
 */
export function listProcessPageScheme(pageId): Promise<ProcessModelPageSchemeView> {
  return request<ProcessModelPageSchemeView>({
    method: 'GET',
    url: `/process/model/page/scheme/${pageId}`,
  });
}