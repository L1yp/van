import axios, { AxiosRequestConfig } from "axios";

export function request<T>(config: AxiosRequestConfig): Promise<T> {
  return new Promise((resolve, reject) => {
    axios.request(config).then(response => {
      if (response.data.code === 200) {
        resolve(response.data.data);
      } else {
        reject(new Error(response.data.message));
      }
    }).catch(err => reject(err));
  })
}