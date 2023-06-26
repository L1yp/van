<template>
  <div style="width: 100%; height: 100%; display: flex; flex-direction: column; ">
    <ag-grid-vue
      v-click-outside="handleClickGridOutside"
      ref="gridRef"
      :grid-options="gridOptions"
      style="width: 100%; height: 100%"
      :class="store.dark ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
    />
  </div>

</template>

<script lang="ts" setup>
import { onUnmounted, ref, shallowRef, } from "vue"
import { AgGridVue } from "ag-grid-vue3";
import { GridApi, GridOptions, GridReadyEvent, RowEditingStoppedEvent } from "ag-grid-community";
import InputEditor from "@/components/ag-grid/editor/InputEditor.vue";
import { useThemeStore } from "@/store/theme";
import SelectEditor from "@/components/ag-grid/editor/SelectEditor.vue";
import { AG_EDITOR_SELECT } from "@/components/ag-grid/editor";


const store = useThemeStore()

const gridRef = ref<InstanceType<typeof AgGridVue>>()
const gridApi = shallowRef<GridApi>()
const gridOptions: GridOptions = {
  rowHeight: 32,
  headerHeight: 36,
  editType: 'fullRow',
  // stopEditingWhenCellsLoseFocus: true,
  columnDefs: [
    {
      field: 'name',
      editable: true,
      cellEditor: InputEditor,
      cellEditorParams: {
      }
    },
    {
      field: 'sex',
      editable: true,
      cellEditor: SelectEditor,
      // cellEditorPopup: true,
      valueFormatter: params => {
        console.log('sex format', params)
        return ['隐藏', '男', '女'][params.value]
      },
      cellEditorParams: {
        options: [
          { label: '隐藏', value: 0 },
          { label: '男', value: 1 },
          { label: '女', value: 2 },
        ],
        componentProps: {
          style: {
            width: '100%',
            height: '100%'
          }
        }
      },
    },
    {
      field: 'age',
    },
  ],
  rowData: [
    { name: 'Lyp1', sex: 1, age:  160 },
    { name: 'Lyp2', sex: 2, age: 161 },
    { name: 'Lyp3', sex: 0, age: 162 },
    { name: 'Lyp4', sex: 1, age: 163 },
    { name: 'Lyp5', sex: 2, age: 164 },
    { name: 'Lyp6', sex: 1, age: 165 },
  ],
  onGridReady(event: GridReadyEvent<any>) {
    gridApi.value = event.api
    bindClickEvent()
  },

}

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

</script>

<style scoped>
:deep(.ag-cell-inline-editing) {
  height: unset;
}
</style>