/**
 * 写缓存
 * @param key 键
 * @param obj 值对象 内部会转为JSON
 */
export function write(key: string, obj: any) {
    if (window.localStorage) {
        const val = JSON.stringify(obj);
        window.localStorage.setItem(key, val);
    } else {
        throw new Error("Cannot support localStorage.");
    }
}


export function read<T>(key: string): T | null {
    if (window.localStorage) {
        const val = window.localStorage.getItem(key);
        if (val) {
          return JSON.parse(val);
        } else {
          return null;
        }
    } else {
        throw new Error("Cannot support localStorage.");
    }
}

/**
 * 删除缓存
 * @param key 键
 */
export function remove(key: string) {
  if (window.localStorage) {
    window.localStorage.removeItem(key);
  } else {
    throw new Error("Cannot support localStorage.");
  }
}