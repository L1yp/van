<template>
  <el-scrollbar height="calc(100vh - 64px - 40px - 54px)" always>
    <div class="container-wrap">
      <div class="field-candidate">
        <el-table
          stripe border
          v-loading="tableInfo.tableLoading"
          :data="leftData"
          height="calc(100vh - 64px - 40px - 54px)"
        >
          <el-table-column label="_" prop="id" width="50" align="center" header-align="center" :resizable="false"></el-table-column>
          <el-table-column label="字段" prop="label" width="120"></el-table-column>
          <el-table-column width="40" align="center" header-align="center" :resizable="false">
            <template #header>
            <span class="icon-btn" @click.stop="transferAll()">
              <s-v-g-icon name="Plus" style="width: 1em; height: 1em"></s-v-g-icon>
            </span>
            </template>
            <template #default="{ row }">
            <span class="icon-btn" @click.stop="transfer(row)">
              <s-v-g-icon name="Plus" style="width: 1em; height: 1em"></s-v-g-icon>
            </span>
            </template>
          </el-table-column>

        </el-table>
      </div>

      <div style="margin-left: 10px">
        <el-table v-if="refreshTable"
                  ref="tableRef"
                  stripe border
                  current-row-key="id"
                  :data="rightData"
                  height="calc(100vh - 64px - 40px - 54px)"
                  class="drag-table"
        >
          <el-table-column width="40" align="center" header-align="center" :resizable="false">
            <template #default>
            <span style="cursor: move" class="drag-trigger">
              <s-v-g-icon name="Drag" style="width: 1em; height: 1em"></s-v-g-icon>
            </span>
            </template>
          </el-table-column>
          <el-table-column label="_" prop="field_id" width="50" align="center" header-align="center" :resizable="false"></el-table-column>
          <el-table-column label="字段" prop="field_label" width="120"></el-table-column>
          <el-table-column label="宽度" prop="span" width="112" :resizable="false">
            <template #default="scope">
              <el-input-number style="width: 86px" size="small" @change="handleInputChange" v-model="scope.row.span" :min="0" :max="24"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="120" header-align="center" :resizable="false">
            <template #default="scope">
              <el-radio-group v-model="scope.row.writeable" size="small" @change="val => handleWriteableChange(scope.row, val)">
                <el-radio-button :label="1">可写</el-radio-button>
                <el-radio-button :label="0">只读</el-radio-button>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column width="40" align="center" header-align="center" :resizable="false">
            <template #header>
            <span class="icon-btn" @click.stop="removeAll">
              <s-v-g-icon name="Subtract" style="width: 1em; height: 1em"></s-v-g-icon>
            </span>
            </template>
            <template #default="{ row }">
            <span class="icon-btn" @click.stop="remove(row)">
              <s-v-g-icon name="Subtract" style="width: 1em; height: 1em"></s-v-g-icon>
            </span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div style="margin-left: 10px; width: 560px">
        <v-form-pro
          :form-attr="{labelWidth: 120}"
          :scheme="formSchemes"
          v-model="pageModel"
        ></v-form-pro>
      </div>
    </div>
  </el-scrollbar>

</template>

<script lang="ts" setup>
import {
  computed,
  nextTick,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  toRaw, watch,
} from "vue";
import SVGIcon from "@/components/common/SVGIcon.vue";
import {
  ElTable, ElTableColumn, ElRadioGroup, ElRadioButton, ElInputNumber,
  ElScrollbar
} from "element-plus"
import Sortable, { SortableEvent } from "sortablejs"
import VForm from "@/components/form/VForm.vue";
import VFormPro from "@/components/form/VFormPro.vue";
import processInfo from "@/mocks/process_info.json"
import userInfo from "@/mocks/user-info.json"
import dictValue from "@/mocks/dict-value.json"
import {FormScheme} from "@/components/form/types";

interface TableInfo {
  tableLoading: boolean;
  tableData: ProcessFieldDefinition[]
}
interface ComponentInfo {
  name: string
  attrs?: Record<string, any>
}
interface Emits {
  (e: 'update:modelValue', arg: PageFieldScheme[]): void
}
interface Props {
  processKey: string
  pageId: number
  fields: ProcessFieldDefinition[]
  ident: string // radio.name的唯一标识
  modelValue: PageFieldScheme[]
}

const tableInfo = ref<TableInfo>({
  tableLoading: false,
  tableData: [],
})

const props = defineProps<Props>()
const emits = defineEmits<Emits>()
const leftData = computed<ProcessFieldDefinition[]>(() => {
  const data = tableInfo.value.tableData
  const rightIds = rightData.value.map(it => it.field_id)
  // console.log("computed data", data)
  // console.log("rightIds", rightIds)
  const filterData = data.filter(it => !rightIds.includes(it.id))
  // console.log("filterData", filterData)
  return filterData
})
const tableRef = ref<InstanceType<typeof ElTable>>()
const rightData = ref<PageFieldScheme[]>(props.modelValue || [])

const pageModel = ref({})
const scheme = ref<PageFieldScheme[]>(props.modelValue || [])
const formSchemes = computed<FormScheme[][]>(() => {
  if (!scheme.value || scheme.value.length === 0) {
    return []
  }
  const pageScheme: PageFieldScheme[] = scheme.value
  let spans = 0
  let container: FormScheme[] = []
  const rows: FormScheme[][] = []
  for (let elem of pageScheme) {
    if (spans + elem.span > 24) {
      rows.push(container)
      container = []
      spans = 0
    }
    const component = getComponent(elem)
    container.push({
      name: elem.field.name,
      label: elem.field.label,
      component: component.name,
      span: elem.span,
      writeable: elem.writeable === 1,
      componentAttrs: component.attrs
    })
    spans = spans + elem.span
  }

  if (container && container.length > 0) {
    rows.push(container)
  }
  return rows
})

watch(scheme.value, () => {
  if (!scheme.value) {
    return
  }
  pageModel.value = {}
  for (let elem of scheme.value) {
    const name = elem.field.name
    if ([1,2].includes(elem.field.component_type)) {
      pageModel.value[name] = ''
    } else if (elem.field.component_type === 3) {
      pageModel.value[name] = elem.writeable === 1 ? dictValue.id : dictValue
    } else if (elem.field.component_type === 4) {
      pageModel.value[name] = [elem.writeable === 1 ? dictValue.id : dictValue]
    } else if (elem.field.component_type === 5) {
      pageModel.value[name] = 0
    } else if (elem.field.component_type === 6) {
      pageModel.value[name] = userInfo
    } else if (elem.field.component_type === 7) {
      pageModel.value[name] = [userInfo]
    } else {
      // TODO 8 9 10 11
    }

  }
  console.log('pageModel', pageModel.value)
}, { immediate: true, deep: true })

/**
 * 可写 / 可读 状态变化 需要同步修改 scheme
 */
function handleWriteableChange(row: PageFieldScheme, val: number) {
  for (let i = 0; i < scheme.value.length; i++) {
    if (scheme.value[i].field_id === row.field_id) {
      scheme.value[i].writeable = val
      return
    }
  }
}

/**
 * 通过字段配置生成VFormPro的scheme
 */
function getComponent(scheme: PageFieldScheme): ComponentInfo {
  const componentType = scheme.field.component_type
  const writeable = scheme.writeable
  const name = scheme.field.name
  if (componentType === 1) {
    return writeable === 1 ? {name: 'el-input'} : { name: 'el-input', attrs: { disabled: true} };
  }
  else if (componentType === 2) {
    return writeable === 1 ? {name: 'el-input', attrs: {type: 'textarea'}} : { name: 'el-input', attrs: { disabled: true} };
  }
  else if (componentType === 3) {
    const val = processInfo[name] as DictValue
    if (writeable === 1) {
      return {
        name: 'dict-input',
        attrs: {
          multiple: false,
          scope: scheme.field.dict_scope,
          ident: scheme.field.dict_ident,
          valType: 'id'
        },
      }
    }
    else {
      return {
        name: 'dict-tag',
        attrs: {
          multiple: false,
          valType: 'raw',
          val
        },
      }
    }

  }
  else if (componentType === 4) {
    const val = processInfo[name] as DictValue[]
    if (writeable === 1) {
      return {
        name: 'dict-input',
        attrs: {
          multiple: true,
          scope: scheme.field.dict_scope,
          ident: scheme.field.dict_ident,
          valType: 'id'
        }
      }
    }
    else {
      return {
        name: 'dict-tag',
        attrs: {
          multiple: true,
          valType: 'raw',
          val
        }
      }
    }
  }
  else if (componentType === 5) {
    return writeable === 1 ? {name: 'el-input-number'} : null;
  }
  else if (componentType === 6) {
    return writeable === 1 ?
      {
        name: 'user-selector-input',
        attrs: {
          multiple: false,
        }
      } : {
        name: 'user-viewer',
        attrs: {
          data: pageModel.value[name]
        }
      };
  } else if (componentType === 7) {
    return writeable === 1 ?
      {
        name: 'user-selector-input',
        attrs: {
          multiple: true,
        }
      }  : {
        name: 'user-viewer',
        attrs: {
          data: pageModel.value[name]
        }
      }
  }
  return null
}


function transfer(row: ProcessFieldDefinition) {
  const data = toRaw(rightData.value)
  const map = new Map<number, PageFieldScheme>(data.map(it => [it.field_id, it]))
  if (sortable.value) {
    const result = sortable.value.toArray()
    if (result && result.length > 0) {
      const items = result.map(it => map.get(parseInt(it)))
      for (let i = 0; i < items.length; i++) {
        items[i].order_no = i + 1
      }
      rightData.value = items
      scheme.value = items
    }
  }

  rightData.value.push({
    process_model_page_id: props.pageId,
    field: row,
    field_id: row.id,
    field_label: row.label,
    field_name: row.name,
    order_no: rightData.value.length,
    span: 24,
    writeable: 0
  })

  emits('update:modelValue', toRaw(rightData.value))

  refreshTable.value = false
  nextTick(() => {
    refreshTable.value = true
    requestAnimationFrame(() => initRowKey())
  })
}

function transferAll() {

  const data = toRaw(rightData.value)
  const map = new Map<number, PageFieldScheme>(data.map(it => [it.field_id, it]))
  if (sortable.value) {
    const result = sortable.value.toArray()
    if (result && result.length > 0) {
      const items = result.map(it => map.get(parseInt(it)))
      for (let i = 0; i < items.length; i++) {
        items[i].order_no = i + 1
      }
      rightData.value = items
      scheme.value = items
    }
  }

  for (let row of tableInfo.value.tableData) {
    rightData.value.push({
      process_model_page_id: props.pageId,
      field: row,
      field_id: row.id,
      field_label: row.label,
      field_name: row.name,
      order_no: rightData.value.length,
      span: 24,
      writeable: 0
    })
  }

  emits('update:modelValue', toRaw(rightData.value))

  refreshTable.value = false
  nextTick(() => {
    refreshTable.value = true
    requestAnimationFrame(() => initRowKey())
  })
}

function remove(row: PageFieldScheme) {
  const data = toRaw(rightData.value)
  const map = new Map<number, PageFieldScheme>(data.map(it => [it.field_id, it]))
  if (sortable.value) {
    const result = sortable.value.toArray()
    const items = result.map(it => map.get(parseInt(it))).filter(it => it.field_id !== row.field_id)
    for (let i = 0; i < items.length; i++) {
      items[i].order_no = i + 1
    }
    rightData.value = items
    scheme.value = items
  } else {
    const items = data.filter(it => it.field_id !== row.field_id)
    for (let i = 0; i < items.length; i++) {
      items[i].order_no = i + 1
    }
    rightData.value = items
    scheme.value = items
  }


  emits('update:modelValue', toRaw(rightData.value))

  refreshTable.value = false

  nextTick(() => {
    refreshTable.value = true
    requestAnimationFrame(() => initRowKey())
  })
}

function removeAll() {
  rightData.value = []
  scheme.value = []
  emits('update:modelValue', [])
  refreshTable.value = false
  nextTick(() => {
    refreshTable.value = true
    requestAnimationFrame(() => initRowKey())
  })
}

onBeforeMount(() => {
  tableInfo.value.tableData = props.fields
})

onMounted(() => {
  requestAnimationFrame(() => initRowKey())
})

onBeforeUnmount(() => {
  if (sortable.value) {
    sortable.value.destroy()
  }
})


const refreshTable = ref<boolean>(true)
const keyColumnIdx = 1
function initRowKey() {
  if (sortable.value) {
    sortable.value.destroy()
    sortable.value = null
  }

  const el = tableRef.value.$el.querySelector("table.el-table__body tbody")
  const rows = el.querySelectorAll("tr.el-table__row")
  if (rows.length > 0) {
    for (let i = 0; i < rows.length; i++) {
      const tds = rows.item(i).querySelectorAll("td")
      const key = tds.item(keyColumnIdx).textContent
      rows.item(i).setAttribute("data-id", key)
      rows.item(i).setAttribute("key", key)
    }
  }
  createSortable()
}

const sortable = shallowRef<Sortable>()
function createSortable() {
  if (rightData.value.length === 0) {
    return;
  }
  const el = tableRef.value.$el.querySelector("table.el-table__body tbody")
  if (!el) return
  sortable.value = Sortable.create(el, {
    sort: true,
    animation: 150,
    handle: 'span.drag-trigger',
    onEnd: handleDragEnd
  })
}

function handleDragEnd(ev: SortableEvent) {
  triggerModelUpdate()
}

function handleInputChange() {
  triggerModelUpdate()
}

function triggerModelUpdate() {
  const data = toRaw(rightData.value)
  if (data.length === 0) {
    emits('update:modelValue', [])
    return
  }
  const map = new Map<number, PageFieldScheme>(data.map(it => [it.field_id, it]))
  const result = sortable.value.toArray()
  const items = result.map(it => map.get(parseInt(it)))
  for (let i = 0; i < items.length; i++) {
    items[i].order_no = i + 1
  }
  scheme.value = items
  console.log("items", items)
  emits('update:modelValue', items)
}
</script>

<style scoped>
.container-wrap {
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  flex-wrap: wrap;
}

span.icon-btn {
  cursor: pointer;
}

span.icon-btn + span.icon-btn {
  margin-left: 5px;
}

span.icon-btn:hover {
}
</style>