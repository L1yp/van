<template>
  <div id="column-config-container" style="width: 100%; height: 100%; display: flex; flex-direction: row; gap: 10px; overflow: auto">
    <div style="min-width: 400px; width: 400px; height: 100%">
      <ag-grid-vue
        :grid-options="candidateGridOptions"
        style="width: 100%; height: 100%"
        :class="store.dark ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
      />
    </div>
    <div style="min-width: 1080px; width: calc(100% - 400px); height: 100%">
      <ag-grid-vue
        :grid-options="targetGridOptions"
        style="width: 100%; height: 100%"
        :class="store.dark ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, shallowRef } from "vue";
import {
  ColDef,
  ColumnApi,
  GridApi,
  GridOptions,
  GridReadyEvent,
  RowDragEndEvent, RowDragEvent,
} from "ag-grid-community";
import { AgGridVue } from "ag-grid-vue3";
import { useSystemStore } from "@/store/sys-config";
import { ElScrollbar } from 'element-plus'

interface Props {
  fields: ModelingFieldDefView[]
  formData: ModelingViewAddParam | ModelingViewUpdateParam
}

const props = defineProps<Props>()
const store = useSystemStore()

const candidateColumnDefs: ColDef<ModelingFieldDefView>[] = [
  {
    rowDrag: true,
    maxWidth: 50,
    suppressMenu: true,
    rowDragText: (params, dragItemCount) => {
      return params.rowNode?.data.label;
    },
  },
  {
    field: 'field',
    headerName: '字段',
    width: 120,
    floatingFilter: true,
    filter: 'agTextColumnFilter',
  },
  {
    field: 'label',
    headerName: '标签',
    minWidth: 200,
    flex: 1,
    floatingFilter: true,
    filter: 'agTextColumnFilter',
  }
]
const candidateApi = shallowRef<GridApi<ModelingFieldDefView>>()
const candidateColumnApi = shallowRef<ColumnApi>()
const candidateGridOptions: GridOptions<ModelingFieldDefView> = {
  suppressRowClickSelection: true,
  rowDragManaged: true,
  suppressMoveWhenRowDragging: true,
  headerHeight: 40,
  rowHeight: 40,
  columnDefs: candidateColumnDefs,
  rowData: [],
  getRowId: params => params.data.id,
  onGridReady(event: GridReadyEvent<ModelingFieldDefView>) {
    candidateApi.value = event.api
    candidateColumnApi.value = event.columnApi
    event.api.setRowData(candidateFields.value)
    if (targetApi.value) {
      setDragZone()
    }

  },
  onRowDragEnd(event: RowDragEvent) {
    console.log('onRowDragEnd candidate', event)
    const srcRow = event.node.data
    // from target grid row
    if (typeof srcRow.field === 'object') {
      const fieldIdMap = new Map(props.fields.map(it => [it.id, it]))
      let rowIdx = -1
      event.api.getModel().forEachNode((node, index) => {
        if (srcRow === node.data) {
          rowIdx = index
        }
      })
      if (rowIdx === -1) {
        console.error('find row index fail', event)
        return
      }
      event.api.applyTransaction({
        addIndex: rowIdx,
        remove: [ srcRow ],
        add: [ fieldIdMap.get(srcRow.field_id) ]
      })
      // @ts-ignore
      console.log('candidate grid data', targetApi.value.getModel().rootNode.childrenAfterGroup.map(it => it.data))
      // @ts-ignore
      props.formData.columns = targetApi.value.getModel().rootNode.childrenAfterGroup.map(it => it.data)
    }
  },
}

const targetColumnDefs: ColDef<ModelingViewColumnParam>[] = [
  {
    rowDrag: true,
    maxWidth: 50,
    suppressMenu: true,
    rowDragText: (params, dragItemCount) => {
      const row: ModelingViewColumnParam = params.rowNode?.data
      return row.field.label;
    },
  },
  {
    field: 'field.field',
    headerName: '字段',
    width: 120,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
  },
  {
    field: 'field.label',
    headerName: '标签',
    minWidth: 200,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
  },
  {
    field: 'width',
    headerName: '宽度',
    width: 120,
    cellRenderer: 'FieldNumberInput',
    cellStyle: {
      display: 'flex',
      alignItems: 'center'
    }
  },
  {
    field: 'min_width',
    headerName: '最小宽度',
    width: 120,
    cellRenderer: 'FieldNumberInput',
    cellStyle: {
      display: 'flex',
      alignItems: 'center'
    }
  },
  {
    field: 'filterable',
    headerName: '筛选',
    width: 80,
    cellRenderer: 'FieldCheckboxInput',
  },
  {
    field: 'sortable',
    headerName: '排序',
    width: 80,
    cellRenderer: 'FieldCheckboxInput',
  },
  {
    field: 'resizable',
    headerName: '拖动列宽',
    width: 100,
    cellRenderer: 'FieldCheckboxInput',
  },
  {
    field: 'condition',
    headerName: '初始条件',
    minWidth: 200,
    flex: 1,
    cellRenderer: 'FieldConditionInput',
    cellStyle: {
      display: 'flex',
      alignItems: 'center'
    }
  }
]
const targetApi = shallowRef<GridApi<ModelingViewColumnParam>>()
const targetColumnApi = shallowRef<ColumnApi>()
const targetGridOptions: GridOptions<ModelingViewColumnParam> = {
  suppressRowClickSelection: true,
  rowDragManaged: true,
  suppressMoveWhenRowDragging: true,
  headerHeight: 40,
  rowHeight: 40,
  columnDefs: targetColumnDefs,
  rowData: [],
  onGridReady(event: GridReadyEvent<ModelingViewColumnParam>) {
    targetApi.value = event.api
    targetColumnApi.value = event.columnApi
    event.api.setRowData(props.formData.columns)

    if (candidateApi.value) {
      setDragZone()
    }

  },
  onRowDragEnd(event: RowDragEvent) {
    console.log('onRowDragEnd target', event)
    const srcRow = event.node.data
    // from candidate grid row
    if (typeof srcRow.field === 'string') {
      let rowIdx = -1
      event.api.getModel().forEachNode((node, index) => {
        if (srcRow === node.data) {
          rowIdx = index
        }
      })
      if (rowIdx === -1) {
        console.error('find row index fail', event)
        return
      }
      event.api.applyTransaction({
        addIndex: rowIdx,
        remove: [ srcRow ],
        add: [ toColumnConfig(srcRow) ]
      })

      // @ts-ignore
      console.log('target grid data', event.api.getModel().rootNode.childrenAfterGroup.map(it => it.data))

    }
    // @ts-ignore
    props.formData.columns = event.api.getModel().rootNode.childrenAfterGroup.map(it => it.data)

  }
}

function setDragZone() {
  if (!targetApi.value || !candidateApi.value) {
    console.log('not ready')
    return
  }
  const dropZoneParams = candidateApi.value?.getRowDropZoneParams({
    onDragStop(params: RowDragEndEvent<ModelingViewColumnParam>){
      console.log('onDragStop 2', params)
      targetApi.value?.applyTransaction({
        remove: params.nodes.map(it => it.data!)
      })
    },
  })
  targetApi.value?.addRowDropZone(dropZoneParams!)

  const dropZoneParams2 = targetApi.value?.getRowDropZoneParams({
    onDragStop(params: RowDragEndEvent<ModelingFieldDefView>){
      console.log('onDragStop 2', params)
      candidateApi.value?.applyTransaction({
        remove: params.nodes.map(it => it.data!)
      })
    },
  })
  candidateApi.value?.addRowDropZone(dropZoneParams2!)


}

const candidateFields = computed(() => {
  const selectedFieldIds = new Set(props.formData.columns.map(it => it.field_id))
  return props.fields.filter(it => !selectedFieldIds.has(it.id))
})

function toColumnConfig(row: ModelingFieldDefView) {
  const item: ModelingViewColumnParam = {
    field_id: row.id,
    field: row,
    width: 100,
    min_width: 0,
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
    item.min_width = 150
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
  return reactive(item)
}




</script>

<style scoped>
#column-config-container::-webkit-scrollbar {
  width: 0;
}
</style>