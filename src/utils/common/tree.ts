export interface Tree {
  children?: this[]
}

export interface CascaderOption extends Tree {
  label: string
  value: string
}

function groupBy<T>(src: T[], groupField: keyof T): Map<T[keyof T], T[]> {
  return src.reduce((prev, curr) => {
    const k = curr[groupField]
    const v = prev.get(k)
    if (v !== undefined) {
      v.push(curr)
    } else {
      prev.set(curr[groupField], [curr])
    }
    return prev
  }, new Map<T[keyof T], T[]>())
}

function coverMapValue<T>(itemMap: Map<T[keyof T] | null, T[] | Map<T[keyof T], T[]>>, groupField: keyof T) {
  const candidateMapList: Map<T[keyof T], T[] | Map<T[keyof T], T[]>>[] = [ ]
  for (let [key, block] of itemMap.entries()) {
    const groupMap = groupBy(block as T[], groupField)
    itemMap.set(key, groupMap) // 将 数组覆盖为 分组后的map
    candidateMapList.push(groupMap)
  }
  return candidateMapList
}

function getLabelFieldValue<T>(src: T[], groupField: keyof T, labelField: keyof T, groupFieldValue: T[keyof T]) {
  return src.find(it => it[groupField] === groupFieldValue)?.[labelField]
}

export function groupToTree<T>(src: T[], groupFields: Array<keyof T>, labelFields: Array<keyof T>): CascaderOption[] {
  let targetMap = new Map<T[keyof T] | null, T[] | Map<T[keyof T], T[]>>()
  targetMap.set(null, src)

  let candidateMapList: Map<T[keyof T] | null, T[] | Map<T[keyof T], T[]>>[] = [ targetMap ]

  let nextCandidateMapList: Map<T[keyof T], T[] | Map<T[keyof T], T[]>>[] = []

  for (let i = 0; i < groupFields.length; i++) {
    const groupField = groupFields[i]

    nextCandidateMapList = []
    for (let itemMap of candidateMapList) {
      const candidateMapList = coverMapValue(itemMap, groupField)
      candidateMapList.forEach(it => nextCandidateMapList.push(it))
    }

    candidateMapList = nextCandidateMapList
  }

  // top level map
  const cacheMap = targetMap.get(null) as Map<T[keyof T], T[] | Map<T[keyof T], T[]>>
  return MapToTree(src, cacheMap, groupFields, labelFields, 0)

}

function MapToTree<T>(src: T[], cacheMap: Map<T[keyof T], T[] | Map<T[keyof T], T[]>>, groupFields: Array<keyof T>, labelFields: Array<keyof T>, index: number) {
  const result: CascaderOption[] = []
  for (const [value, nestedMap] of cacheMap.entries()) {
    let label = value
    if (groupFields[index] !== labelFields[index]) {
      // 需要转换
      label = getLabelFieldValue(src, groupFields[index], labelFields[index], value)!
    }
    let children: CascaderOption[] = []
    if (nestedMap instanceof Map) {
      children = MapToTree(src, nestedMap, groupFields, labelFields, index + 1);
    } else {
      // for (let item of nestedMap) {
      //   children.push({
      //     label: item[labelFields[index]] as string,
      //     value: item[groupFields[index]] as string,
      //     children: []
      //   })
      // }
    }

    children.sort((a, b) => {
      if (a.label > b.label) {
        return 1
      } else if (a.label === b.label) {
        return 0
      } else return -1
    })

    result.push({
      label: label as string, // 流程ID
      value: value as string,
      children
    })
  }
  return result
}





/**
 * 过滤 该树 包含关键字的节点
 * @param {Array} result 结果集
 * @param {Array} parent 父对象
 * @param {Array} list 待遍历数组
 * @param {Object} key 关键字
 * @param {String[]} props 搜索的字段列表
 * @returns 此树是否包含关键字
 */
export function filterDataWithTitle<T extends Tree>(result: T[], list: T[], key: string, props: Array<keyof T>, parent?: T): boolean {
  if (!key) {
    result = list
    return true
  }
  let hasKey = false; // 是否包含关键字
  for (let item of list) {
    if (item.children?.length) {
      const currentNode = JSON.parse(JSON.stringify(item));
      currentNode.children = [];
      const keyExists = filterDataWithTitle(result, item.children, key, props, currentNode);
      if (keyExists) {
        hasKey = keyExists;
        !!parent ? parent.children?.push(currentNode) : result.push(currentNode)
        continue
      }

      if (searchKey(props, key, item)) {
        hasKey = true
        !!parent ? parent.children?.push(currentNode) : result.push(currentNode)
      }
    }
    else {
      if (searchKey(props, key, item)) {
        hasKey = true
        !!parent ? parent.children?.push(item) : result.push(item)
      }
    }
  }
  return hasKey;
}

export type Predicate<T> = (item: T) => boolean

/**
 * 自定义过滤树规则
 * @param result 结果集
 * @param list 源Tree数组
 * @param filterFn 过滤函数
 * @param stopFn 停止向下的函数
 * @param parent 父级
 */
export function filterDataWithCustom<T extends Tree>(result: T[], list: T[], filterFn: Predicate<T>, stopFn?: Predicate<T>, parent?: T): boolean {
  if (!filterFn) {
    return true
  }
  let hasKey = false; // 是否包含关键字
  for (let item of list) {
    if (item.children?.length) {
      const currentNode = JSON.parse(JSON.stringify(item));
      currentNode.children = []
      if (stopFn && stopFn(item)) {
        // 停止继续搜索子节点
        continue
      }
      const keyExists = filterDataWithCustom(result, item.children, filterFn, stopFn, currentNode);
      if (keyExists) {
        hasKey = keyExists;
      }
      // 此项或其子项 包含关键字 则展示
      if (keyExists || filterFn(item)) {
        hasKey = true
        if (parent) {
          parent.children?.push(currentNode);
        } else {
          result.push(currentNode);
        }
      }
    } else {
      if (!filterFn(item)) {
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


function searchKey<T extends Tree>(props: Array<keyof T>, key: string, item: T) {
  // 此项或其子项 包含关键字 则展示
  for (let prop of props) {
    let fieldValue = item[prop]
    if (Object.prototype.toString.call(item[prop]) !== "[object String]") {
      // @ts-ignore
      fieldValue = String(fieldValue)
    }
    if (key && (fieldValue as string).indexOf(key) > -1) {
      return true
    }
  }
}



/**
 * 在树中查询条目
 * @param src 数据源
 * @param keyField 键名
 * @param key 键值
 * @returns 条目
 */
export function findTreeItemById<T extends Tree>(src: T[], keyField: keyof T, key: string): T | undefined {

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

/**
 * 在树中查询条目的父级
 * @param src 数据源
 * @param keyField 键名
 * @param key 键值
 * @returns 条目
 */
export function findTreeItemParentById<T extends Tree>(src: T[], keyField: keyof T, key: string): T[] {

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


/**
 * 在树中查询条目的所有父级(包含当前节点)
 * @param src 数据源
 * @param keyField 键名
 * @param key 键值
 * @returns 条目
 */
export function findTreeItemParentRouteById<T extends Tree>(src: T[], keyField: keyof T, key: string): T[] {

  const result: T[] = []
  DFSSearchTreeNode(src, keyField, key, result)


  return result.reverse()

}

function DFSSearchTreeNode<T extends Tree>(src: T[], keyField: keyof T, key: string, result: T[]): boolean {
  for (const item of src) {
    if (item[keyField] === key) {
      result.push(item)
      return true
    }
    if (item.children?.length) {
      const has = DFSSearchTreeNode(item.children, keyField, key, result)
      if (has) {
        result.push(item)
        return has
      }
    }
  }
  return false
}


export function toTree<T extends Tree>(src: T[], keyField: keyof T, parentField: keyof T): T[] {
  const map = new Map<unknown, T>(src.map(it => [it[keyField], it]))
  src.forEach(it => {
    if (map.has(it[parentField])) {
      const parent = map.get(it[parentField])!
      if (!parent.children) {
        parent.children = []
      }
      parent.children.push(it)
    }
  })
  return src.filter(it => !it[parentField])
}


export function flatternTree<T extends Tree>(src: T[], withoutRoot?: boolean): T[] {
  const result: T[] = []
  getSubTree(result, src, withoutRoot)
  return result
}

export function getSubTree<T extends Tree>(result: T[], src: T[], withoutRoot?: boolean) {
  for (const item of src) {
    if (!withoutRoot) {
      result.push(item)
    }
    if (item.children?.length) {
      _getSubTree(result, item.children)
    }
  }
}

export function _getSubTree<T extends Tree>(result: T[], src: T[]) {
  for (const item of src) {
    result.push(item)
    if (item.children?.length) {
      _getSubTree(result, item.children)
    }
  }
}

export function isArray(arg: any): boolean {
  return Object.prototype.toString.call(arg)== '[object Array]'
}
