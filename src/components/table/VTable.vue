<template>
  <div>
    <table>
      <colgroup>
        <template v-for="column in columns">
          <col v-if="column.slot.props?.field" :name="column.slot.props?.field" :span="column.colspan" :width="column.slot.props?.width">
        </template>
      </colgroup>
      <thead>
        <tr
          v-for="headerRow in headerDefinition"
        >
          <template v-for="headerCol in headerRow">
            <td
              :name="headerCol.slot.props?.field"
              :rowspan="headerCol.rowspan"
              :colspan="headerCol.colspan"
            >
              <template v-if="headerCol.slot.children && Object.hasOwn(headerCol.slot.children as object, 'header')">
                <component :is="headerCol.slot.children['header']"></component>
              </template>
              <template v-else>
                {{ headerCol.slot.props?.title }}
              </template>
            </td>

          </template>


        </tr>

      </thead>
    </table>
  </div>
  <div style="width: 380px">
    <el-scrollbar max-height="200px" always>
      <table>
        <template v-for="column in columns">
          <col :name="column.slot.props?.field" :span="column.colspan" :width="column.slot.props?.width">
        </template>
        <tbody>
          <template v-for="row in props.rows">
            <tr>
              <template v-for="column in columns">
                <td>
                  <template v-if="column.slot.children">
                    <component :is="column.slot" :row="row" :column="row[column.slot.props?.field]"></component>
                  </template>
                  <template v-else>
                    <span v-text="row[column.slot.props?.field]"></span>
                  </template>
                </td>
                
              </template>
            </tr>
          </template>
        </tbody>
      </table>
    </el-scrollbar>

  </div>
</template>

<script lang="ts" setup>
  import { ElScrollbar } from 'element-plus'
import { Slots, useSlots, VNode } from 'vue';


interface Props {
  rows: any[]
}

interface ColumnType {
  slot: VNode
  colspan?: number
  rowspan?: number
  children?: ColumnType[]
}

const props = defineProps<Props>()
const slots: Slots = useSlots()

const defSlots: VNode[] = slots.default()
console.log('defSlots', defSlots);


const result = []
getColumns(defSlots, result)
console.log('result', result);

const headerDefinition: ColumnType[][] = []

let currentChildren = [...result]

while (true) {
  const nextChildren = []
  const elems = []
  for (const item of currentChildren) {
    if (item.children?.length) {
      nextChildren.push(...item.children)
    }
    elems.push(item)
  }

  headerDefinition.push(elems)
  if (!nextChildren?.length) {
    break
  }

  currentChildren = [...nextChildren]
}
console.log('columns', headerDefinition);

// 最大深度
const maxLevel = headerDefinition.length

function setColspan(root: ColumnType): number {
  const children: ColumnType[] = root.children
  if (!children) {
    root.colspan = 1
    return
  }
  let count = 0
  for (const child of children) {
    if (child.children?.length) {
      const span = setColspan(child)
      child.colspan = span
      count += span
    } else {
      count ++
    }
  }
  root.colspan = count
  return count
}

function setRowspan(root: ColumnType, currentLevel: number) {
  const children: ColumnType[] = root.children
  if (!children) {
    root.rowspan = maxLevel - currentLevel + 1
    return
  }

  for (const child of children) {
    if (child.children?.length) {
      child.rowspan = 1
      setRowspan(child, currentLevel + 1)
    } else {
      child.rowspan = maxLevel - currentLevel + 1
    }
  }
}

for (const item of result) {
  setRowspan(item, 1)
  setColspan(item)
}

function getRealColumns(children: ColumnType[], container: ColumnType[]) {

  for (const child of children) {
    if (child.children?.length) {
      getRealColumns(child.children, container)
    } else {
      container.push(child)
    }
  }
}



const columns = []
getRealColumns(result, columns)
console.log('columns', columns);


function getColumns(slots: VNode[], container: ColumnType[]) {

  for (const slot of slots) {
    if (slot.type['name'] === "VColumnGroup") {
      const children = []
      container.push({slot, rowspan: 1, colspan: 1, children})
      getColumns(slot.children['default'](), children)
    } else if (slot.type['name'] === 'VColumn') {
      container.push({
        slot, rowspan: 1, colspan: 1
      })
    }
  }
}


</script>

<style scoped>
  table {
    border-collapse: collapse;
  }
  td {
    border: 1px solid #E3E3E3;
  }
</style>