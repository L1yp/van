<template>
  <div style="width: 100%; height: 100%;">
    <ag-grid-vue
      :grid-options="gridOptions"
      style="width: 100%; height: 100%"
      :class="store.dark ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
    />
    <dropdown-menu
      ref="menuRef"
      v-click-outside="handleClickMenuOutside"
      :y="y"
      :x="x"
      :options="menuOptions"
      @item-click="handleMenuClick"
    />
  </div>
</template>

<script lang="ts" setup>
import { AgGridVue } from "ag-grid-vue3";
import { markRaw, reactive, ref, shallowRef, watch } from "vue";
import { CellContextMenuEvent, ColumnApi, GridApi, GridOptions, GridReadyEvent } from "ag-grid-community";
import { MenuOption } from "@/components/menu";
import { Edit, Delete } from '@element-plus/icons-vue'
import DropdownMenu from "@/components/menu/DropdownMenu.vue";
import { useThemeStore } from "@/store/theme";

interface Props {
  loading: boolean
  data: ModelingFieldDefView[]
}

interface Emits {
  (e: 'edit', row: ModelingFieldDefView): void
  (e: 'delete', row: ModelingFieldDefView): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()
const store = useThemeStore()

const gridApi = shallowRef<GridApi<ModelingFieldDefView>>()
const columnApi = shallowRef<ColumnApi>()

watch(() => props.data, () => {
  gridApi.value?.setRowData(props.data)
})

const gridOptions: GridOptions<ModelingFieldDefView> = {
  rowHeight: 32,
  headerHeight: 32,
  preventDefaultOnContextMenu: true,
  columnDefs: [
    { headerName: '#', width: 50, valueGetter: params => String((params.node?.rowIndex || 0) + 1) },
    { field: 'field', headerName: '字段', width: 150, resizable: true },
    { field: 'label', headerName: '名称', width: 150, resizable: true },
    { field: 'type', headerName: '类型', width: 150, resizable: true },
    { field: 'remark', headerName: '说明',  },
  ],
  onGridReady(event: GridReadyEvent<ModelingFieldDefView>) {
    gridApi.value = event.api
    columnApi.value = event.columnApi

    event.api.setRowData(props.data)
  },
  onCellContextMenu(event: CellContextMenuEvent<ModelingFieldDefView>) {
    console.log('event', event)
    contextmenuRow.value = event.data
    const ev = event.event as PointerEvent
    x.value = ev.clientX
    y.value = ev.clientY
    menuRef.value?.show()
  },
  rowData: [],
}

const contextmenuRow = ref<ModelingFieldDefView>()
const menuRef = ref<InstanceType<typeof DropdownMenu>>()
const x = ref(0)
const y = ref(0)
const menuOptions = reactive<MenuOption[]>([
  { icon: markRaw(Edit), text: '编辑', command: 'edit' },
  { icon: markRaw(Delete), text: '删除', command: 'delete' },
])



function handleMenuClick(item: MenuOption, ev: PointerEvent) {
  if (item.command === 'edit') {
    emits('edit', contextmenuRow.value!)
  }
  else if (item.command === 'delete') {
    emits('delete', contextmenuRow.value!)
  }
}

function handleClickMenuOutside() {
  menuRef.value?.hide()
}

</script>

<style scoped>

</style>