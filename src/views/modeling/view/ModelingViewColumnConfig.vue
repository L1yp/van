<template>
  <div style="width: 100%; height: 100%; display: flex; flex-direction: row; gap: 10px">
    <div style="height: 100%">
      <el-table
        :data="candidateFields"
        border stripe scrollbar-always-on
        height="100%"
      >
        <el-table-column>
          <template #header>
            <el-input v-model="fieldKey" />
          </template>
          <el-table-column prop="field" label="字段标识" width="120" :resizable="false" show-overflow-tooltip />
        </el-table-column>
        <el-table-column>
          <template #header>
            <el-input v-model="labelKey" />
          </template>
          <el-table-column prop="label" label="字段名称" width="200" :resizable="false" show-overflow-tooltip />
        </el-table-column>
        <el-table-column>
          <el-table-column width="56" :resizable="false">
            <template #header>
              <el-button :icon="Plus" circle text @click="handleAddAll"/>
            </template>
            <template #default="scope">
              <el-button :icon="Plus" circle text @click="handleAddRow(scope.row)" />
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <div style="width: calc(100% - 386px); height: 100%">
      <vxe-table
        ref="tableRef"
        :key="tableKey"
        border stripe align="center" header-align="center"
        height="100%"
        :data="props.formData.columns"
      >
        <vxe-column width="52">
          <el-icon class="drag-handle"><Rank/></el-icon>
        </vxe-column>
        <vxe-column field="field.field" title="字段标识" width="120" align="left" header-align="left" />
        <vxe-column field="field.label" title="字段名称" width="120" align="left" header-align="left" />
        <vxe-column field="width" title="列宽" width="120">
          <template #default="scope">
            <el-input-number v-model="scope.row.width" :controls="false" style="width: 100%" />
          </template>
        </vxe-column>
        <vxe-column field="filterable" title="筛选" width="120">
          <template #default="scope">
            <el-checkbox v-model="scope.row.filterable" />
          </template>
        </vxe-column>
        <vxe-column field="sortable" title="排序" width="120">
          <template #default="scope">
            <el-checkbox v-model="scope.row.sortable" />
          </template>
        </vxe-column>
        <vxe-column field="resizable" title="拖动列宽" width="120">
          <template #default="scope">
            <el-checkbox v-model="scope.row.resizable" />
          </template>
        </vxe-column>
        <vxe-column field="condition" title="初始条件" align="left" header-align="left" >
          <template #default="scope">
            <ViewColumnCondition :column="scope.row" />
          </template>
        </vxe-column>
        <vxe-column width="52">
          <template #header>
            <el-button :icon="Minus" circle text @click="handleRemoveAll" />
          </template>
          <template #default="scope">
            <el-button :icon="Minus" circle text @click="handleRemoveRow(scope.row)" />
          </template>
        </vxe-column>

      </vxe-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, nextTick, onMounted, ref, shallowRef} from "vue";
import { ElTable, ElTableColumn, ElInput, ElButton, ElCheckbox, ElInputNumber, ElIcon } from "element-plus";
import { Plus, Minus, Rank } from "@element-plus/icons-vue";
import {VxeTableInstance} from "vxe-table";
import Sortable, {SortableEvent} from "sortablejs";
import ViewColumnCondition from "@/views/modeling/view/condition/ViewColumnCondition.vue";

interface Props {
  fields: ModelingFieldDefView[]
  formData: ModelingViewAddParam | ModelingViewUpdateParam
}

const props = defineProps<Props>()

const fieldKey = ref('')
const labelKey = ref('')

const candidateFields = computed(() => {
  const selectedFieldIds = new Set(props.formData.columns.map(it => it.field_id))

  let result = props.fields.filter(it => !selectedFieldIds.has(it.id))
  if (!fieldKey.value && !labelKey.value) {
    return result
  }

  if (fieldKey.value) {
    result = result.filter(it => it.field.includes(fieldKey.value))
  }

  if (labelKey.value) {
    result = result.filter(it => it.label.includes(labelKey.value))
  }
  return result
})

const tableKey = ref(1)
const tableRef = ref<VxeTableInstance>()

function addColumn(row: ModelingFieldDefView) {
  const item: ModelingViewColumnParam = {
    field_id: row.id,
    field: row,
    width: 100,
    align: 'left',
    filterable: true,
    sortable: true,
    resizable: true,
    condition: ''
  }
  if (row.type === 'number') {
    item.filterable = false
    item.align = 'right'
  }
  else if (row.type === 'text') {
    item.width = 200
    item.sortable = false
  }
  else if (row.type === 'user') {
    item.width = 200
    item.sortable = false
  }
  else if (row.type === 'dept') {
    item.width = 200
    item.sortable = false
  }
  else if (row.type === 'option') {
    item.width = 200
    item.sortable = false
  }
  else if (row.type === 'date') {
    item.width = 300
  }
  props.formData.columns.push(item)
}

function refreshTable() {
  tableKey.value ++
  nextTick(initSortable)
}

function handleAddRow(row: ModelingFieldDefView) {
  addColumn(row)
  refreshTable()

}

function handleAddAll() {
  candidateFields.value.forEach(addColumn)
  refreshTable()

}

function handleRemoveRow(row: ModelingViewColumnParam) {
  const idx = props.formData.columns.indexOf(row)
  idx !== null && props.formData.columns.splice(idx, 1)
  refreshTable()

}

function handleRemoveAll() {
  props.formData.columns = []
  refreshTable()
}

function handleDragEnd(event: SortableEvent) {
  if (event.oldIndex === event.newIndex) {
    // 未发生移动
    return
  }

  const columns = props.formData.columns

  // if (Math.abs(event.oldIndex - event.newIndex) === 1) {
  //   const srcRow = columns[event.oldIndex]
  //   columns[event.oldIndex] = columns[event.newIndex]
  //   columns[event.newIndex] = srcRow
  //   console.log('result end', columns)
  //   return;
  // }

  if (event.oldIndex > event.newIndex) {
    // 从下往上拖
    const srcRow = columns[event.oldIndex]
    for (let i = event.oldIndex; i > event.newIndex; i--) {
      // 往下移动一行
      columns[i] = columns[i - 1]
    }
    columns[event.newIndex] = srcRow
  } else {
    // 从上往下拖
    const srcRow = columns[event.oldIndex]
    // 从旧位置开始 到 新位置之前 全部上移一行
    for (let i = event.oldIndex; i < event.newIndex; i++) {
      // 往下移动一行
      columns[i] = columns[i + 1]
    }
    columns[event.newIndex] = srcRow
  }

  console.log('result end', columns)

}

const sortable = shallowRef<Sortable>()
function initSortable() {
  if (sortable.value) {
    sortable.value.destroy()
  }
  const tbody = tableRef.value?.$el.querySelector('table.vxe-table--body tbody')
  if (!tbody) {
    console.error('cannot find tbody')
    return
  }

  sortable.value = Sortable.create(tbody, {
    sort: true,
    animation: 150,
    handle: 'i.drag-handle',
    onEnd: handleDragEnd
  })
}

onMounted(initSortable)

</script>

<style scoped>
:deep(.vxe-table--render-default .vxe-body--column:not(.col--ellipsis), .vxe-table--render-default .vxe-footer--column:not(.col--ellipsis), .vxe-table--render-default .vxe-header--column:not(.col--ellipsis)) {
  padding-top: 8px;
  padding-bottom: 8px;
}

.drag-handle {
  cursor: move;
}

</style>