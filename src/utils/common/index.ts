import { computed, ComputedRef } from 'vue';
import { useWindowSize } from "@vueuse/core";

type Device = 'pc' | 'h5' | 'pad'

const { width, height } = useWindowSize()

export { width, height }

export function getDeviceType(): ComputedRef<Device> {
  return computed(() => {
    if (width.value < 425) {
      console.log('width device', width.value);
      return 'h5'
    }
    if (width.value < 768) {
      console.log('width device', width.value);
      return 'pad'
    } else {
      console.log('width device', width.value);
      return 'pc'
    }
  })
}



export function toReadableDuration(second: number) {
  const days = parseInt((second / 86400).toString())

  const remain = second % 86400
  const hours = parseInt((remain / 3600).toString())
  const remain2 = remain % 3600
  const minutes = parseInt((remain2 / 60).toString())
  const remain3 = remain2 % 60
  let str = ''
  if (days > 0) {
    str = str + `${days}天`
  }
  if (hours > 0) {
    str = str + `${hours}时`
  }
  if (minutes > 0) {
    str = str + `${minutes}分`
  }
  str = str + `${remain3}秒`
  return str
}

type PrimitiveType = string | number | boolean | BigInt
function primitiveArrayEquals<T extends PrimitiveType>(a: T[], b: T[]): boolean {
  return Array.isArray(a) &&
  Array.isArray(b) &&
  a.length === b.length &&
  a.every((val, index) => val === b[index])
}

/**
 * 一维数组转树形结构
 * @param src 一维数组
 * @param keyField 唯一键名
 * @param parentField 父键名
 * @param orderField 排序键名(仅支持数值类型)
 * @param sortDirection 升序/降序
 */
export function toTree<T extends Tree>(src: T[], keyField: keyof T, parentField: keyof T, orderField?: keyof T, sortDirection?: 'asc' | 'desc'): T[] {
  const map = new Map<T[keyof T], T>(src.map(it => [it[keyField], it]))
  let compareFn: ((a: T, b: T) => number) | undefined = undefined
  if (orderField) {
    compareFn = (a: T, b: T) => sortDirection === 'desc' ? (Number(b[orderField]) - Number(a[orderField])) : (Number(a[orderField]) - Number(b[orderField]))
  }
  src.forEach(it => {
    if (map.has(it[parentField])) {
      const parent = map.get(it[parentField])!
      if (!parent.children) {
        parent.children = []
      }
      parent.children.push(it)
    }
  })
  if (orderField) {
    src.filter(it => it.children?.length).forEach(it => it.children?.sort(compareFn))
  }

  return src.filter(it => !it[parentField]).sort(compareFn)
}

/**
 * 过滤 该树 包含关键字的节点
 * @param {Array} result 结果集
 * @param {Array} parent 父对象
 * @param {Array} list 待遍历数组
 * @param {Object} key 关键字
 * @param {String} prop 字段
 * @returns 此树是否包含关键字
 */
export function filterDataWithTitle<T extends Tree>(result: T[], list: T[], key: string, prop: keyof T, parent?: T): boolean {
  if (!key) {
    return true
  }
  let hasKey = false; // 是否包含关键字
  for (let item of list) {
    if (item.children?.length) {
      const currentNode = JSON.parse(JSON.stringify(item));
      currentNode.children = [];
      const keyExists = filterDataWithTitle(result, item.children, key, prop, currentNode);
      if (keyExists) {
        hasKey = keyExists;
      }
      // 此项或其子项 包含关键字 则展示
      if (keyExists || String(item[prop]).indexOf(key) > -1) {
        hasKey = true
        if (parent) {
          parent.children?.push(currentNode);
        } else {
          result.push(currentNode);
        }
      }
    } else {
      if (key && String(item[prop]).indexOf(key) <= -1) {
        continue;
      }
      hasKey = true;
      if (parent) {
        parent.children?.push(item);
      } else {
        result.push(item);
      }
    }
  }
  return hasKey;
}

/**
 * 在树中查询条目
 * @param src 数据源
 * @param keyField 键名
 * @param key 键值
 * @returns 条目
 */
export function findTreeItemById<T extends Tree>(src: T[], keyField: keyof T, key: T[keyof T]): T | undefined {

  for (const item of src) {
    if (item[keyField] === key) {
      return item
    }
    if (item.children?.length) {
      const result = findTreeItemById(item.children, keyField, key)
      if (result) {
        return result
      }
    }
  }

  return undefined

}

export function getTreeItemPath<T extends Tree>(src: T[], keyField: keyof T, key: T[keyof T]): T[] {
  // 深度遍历
  const result: T[] = []
  DFSTree(src, keyField, key, result)
  return result.reverse()
}

function DFSTree<T extends Tree>(src: T[], keyField: keyof T, key: T[keyof T], result: T[]): boolean {
  for (let item of src) {
    if (item[keyField] === key) {
      result.push(item)
      return true
    }
    if (item.children?.length) {
      const ret = DFSTree(item.children, keyField, key, result)
      if (ret) {
        result.push(item)
        return true
      }
    }
  }
  return false
}

/**
 * 在树中查询条目的父级
 * @param src 数据源
 * @param keyField 键名
 * @param key 键值
 * @returns 父节点数组
 */
 export function findTreeItemParentById<T extends Tree>(src: T[], keyField: keyof T, key: T[keyof T]): T[] {

  for (const item of src) {
    if (item[keyField] === key) {
      return src
    }
    if (item.children?.length) {
      const result = findTreeItemParentById(item.children, keyField, key)
      if (result?.length) {
        return result
      }
    }
  }
  return []
}

export function flattenTree<T extends Tree>(src: T[]): T[] {
  const result: T[] = []
  getSubTree(result, src)
  return result
}

function getSubTree<T extends Tree>(result: T[], src: T[]) {
  for (const item of src) {
    result.push(item)
    if (item.children?.length) {
      getSubTree(result, item.children)
    }
  }
}

export function isArray(arg: any): boolean {
  return Object.prototype.toString.call(arg)== '[object Array]'
}