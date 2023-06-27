<template>
  <ag-grid-vue
    ref="gridRef"
    style="width: 100%; height: 100%"
    class="ag-grid-wrapper"
    :class="themeStore.AGGridClass"
    :grid-options="gridOptions"
    v-click-outside="handleClickGridOutside"
  />
</template>
<script lang="ts" setup>
import { Plus, Delete } from '@element-plus/icons-vue'
import { shallowRef, onUnmounted } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import { useThemeStore } from "@/store/theme";
import {
  ColumnApi,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellRendererParams, RowNode
} from "ag-grid-community";
import GridActionCell from "@/components/ag-grid/cell/components/GridActionCell.vue";
import SelectEditor from "@/components/ag-grid/editor/SelectEditor.vue";
import InputEditor from "@/components/ag-grid/editor/InputEditor.vue";
import { AG_EDITOR_SELECT } from "@/components/ag-grid/editor";

interface Props {
  listener: TaskListenerObject
}

const props = defineProps<Props>()
const fieldTypeOptions = [
  {
    label: '字符串',
    value: 'string'
  },
  {
    label: '表达式',
    value: 'expression'
  },

]

const themeStore = useThemeStore()
const gridApi = shallowRef<GridApi<ListenerField>>()
const columnApi = shallowRef<ColumnApi>()
const gridOptions: GridOptions<ListenerField> = {
  rowData: [],
  rowHeight: 36,
  headerHeight: 36,
  editType: 'fullRow',
  columnDefs: [
    { headerName: '#', width: 50, valueGetter: params => String((params.node?.rowIndex || 0) + 1) },
    { field: 'name', headerName: '字段名', width: 150, resizable: true, editable: true, cellEditor: InputEditor, },
    {
      field: 'type',
      headerName: '类型',
      width: 150,
      resizable: true,
      editable: true,
      cellEditor: SelectEditor,
      cellEditorParams: {
        options: fieldTypeOptions,
        componentProps: {
          style: {
            width: '100%',
            height: '100%'
          }
        }
      }
    },
    { field: 'value', headerName: '值', width: 150, resizable: true, editable: true, cellEditor: InputEditor, },
    {
      headerName: '操作',
      width: 32,
      cellRenderer: GridActionCell,
      wrapHeaderText: true,
      headerClass: 'action-header',
      cellClass: 'action-cell',
      headerComponent: GridActionCell,
      headerComponentParams: {
        actions: [
          {
            id: '1',
            props: {
              link: true,
              type: 'danger',
              icon: Plus,
              style: 'width: 20px; height: 20px; border: none;',
            },
            clickHandler(params: ICellRendererParams<ListenerField>, ev: MouseEvent) {
              if (!gridApi.value) {
                return
              }

              const newRow: ListenerField = {
                name: '',
                type: 'string',
                value: ''
              }

              params.api.applyTransaction({
                add: [
                  newRow
                ]
              });

              props.listener.fields?.push(newRow)

              const rowCount = params.api.getModel().getRowCount();
              params.api.startEditingCell({
                rowIndex: rowCount - 1,
                colKey: 'name'
              })

            }
          }
        ]
      },
      cellRendererParams: {
        actions: [
          {
            id: '1',
            props: {
              link: true,
              type: 'danger',
              icon: Delete,
              style: 'width: 20px; height: 20px; border: none;',
            },
            clickHandler(params: ICellRendererParams, ev: MouseEvent) {
              console.log('click delete handler', params)
              params.api.applyTransaction({
                remove: [ params.data ]
              })

              const idx = props.listener.fields?.indexOf(params.data) || -1
              idx !== -1 && props.listener.fields?.splice(idx, 1)
            }
          }
        ]
      }
    },
  ],
  onGridReady(event: GridReadyEvent<ListenerField>) {
    gridApi.value = event.api
    columnApi.value = event.columnApi

    bindClickEvent()

    event.api.setRowData(props.listener.fields || [])
  },
  onFirstDataRendered(event: FirstDataRenderedEvent<ListenerField>) {
    event.api.sizeColumnsToFit()
  },
}

async function validate() {
  if (!gridApi.value) {
    return
  }
  const errorList: Array<{field: string, fieldValue: any, message: string}> = []
  gridApi.value.getModel().forEachNode((rowNode: RowNode<ListenerField>, index) => {
    if (!rowNode.data) {
      return
    }

    if (!rowNode.data.name) {
      errorList.push({ field: 'name', fieldValue: rowNode.data.name, message: `第${index + 1}行字段名不能为空` })
      // throw new Error(`第${index + 1}行请输入字段名或删除此行`)
    }
    if (!rowNode.data.value) {
      errorList.push({ field: 'value', fieldValue: rowNode.data.value, message: `第${index + 1}行字段值不能为空` })
      // throw new Error(`第${index + 1}行请输入字段值`)
    }
    if (!rowNode.data.type) {
      errorList.push({ field: 'type', fieldValue: rowNode.data.type, message: `第${index + 1}行类型不能为空` })
      // throw new Error(`第${index + 1}行请选择字段类型`)
    }
    if (!/^[a-zA-Z_$][\w$]*$/.test(rowNode.data.name)) {
      errorList.push({ field: 'name', fieldValue: rowNode.data.name, message: `第${index + 1}行字段名不符合规则: 字母或下划线开头` })
      // throw new Error(`第${index + 1}行字段名不符合规则: 字母或下划线开头`)
    }
  })
  if (errorList?.length) {
    throw { value: errorList }
  }
}

defineExpose({
  validate
})

function handleClickGridOutside(up: MouseEvent, down: MouseEvent) {
  const target = up.target as HTMLElement
  let parentElem = target.parentElement
  while (parentElem) {
    // el-popper is-pure is-light el-select__popper ag-editor-select
    if (parentElem.classList.contains(AG_EDITOR_SELECT) &&
      parentElem.classList.contains('el-popper') && parentElem.classList.contains('el-select__popper')) {
      return
    }
    parentElem = parentElem.parentElement
  }
  gridApi.value?.stopEditing(false)
}

const gridRef = shallowRef<InstanceType<typeof AgGridVue>>()
const bodyContainer = shallowRef<HTMLDivElement>()
const headerContainer = shallowRef<HTMLDivElement>()

function bindClickEvent() {
  bodyContainer.value = gridRef.value?.$el.querySelector("div.ag-center-cols-viewport") as HTMLDivElement
  bodyContainer.value?.addEventListener("mousedown", handleCancelEditing)

  headerContainer.value = gridRef.value?.$el.querySelector("div.ag-header-viewport") as HTMLDivElement
  headerContainer.value?.addEventListener("mousedown", handleCancelEditing)
}

function handleCancelEditing(ev: MouseEvent) {
  if ([headerContainer.value, bodyContainer.value].includes(ev.target as HTMLDivElement)) {
    gridApi.value?.stopEditing(false)
  }
}

onUnmounted(() => {
  headerContainer.value?.removeEventListener('mousedown', handleCancelEditing)
  bodyContainer.value?.removeEventListener('mousedown', handleCancelEditing)
})


</script>
<style scoped>
:deep(.action-header) {
  padding-left: 6px;
  padding-right: 6px;
}

:deep(.action-header .ag-header-cell-comp-wrapper) {
  justify-content: center;
  padding-left: 6px;
  padding-right: 6px;
}

:deep(.action-cell) {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 6px;
  padding-right: 6px;
}

:deep(.ag-cell-inline-editing) {
  height: unset;
}
/*
.ag-grid-wrapper ::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.ag-grid-wrapper ::-webkit-scrollbar-track {
  background: transparent;
}

.ag-grid-wrapper ::-webkit-scrollbar-thumb {
  background: #bfc6d2;
  border-radius: 3px;
}

.ag-grid-wrapper ::-webkit-scrollbar-thumb:hover {
  background: #6e85ad;
  cursor: pointer;
}
*/
</style>