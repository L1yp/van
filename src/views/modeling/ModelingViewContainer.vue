<template>
  <div style="width: 100%; height: 100%; position: relative" v-loading="loading">
    <div style="display: flex; justify-content: space-between; padding: 4px 0;">
      <div>
        <el-button @click="handleAddInstance" :disabled="!startForm">新建</el-button>
        <el-button>导出</el-button>
      </div>
      <div>
        <el-button :icon="Setting" text plain circle :disabled="!activeView" @click="handleConfigView" />
        <el-select v-model="activeViewId" @change="loadData" style="width: 150px">
          <el-option
            v-for="item in viewSimpleInfoList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>

      </div>
    </div>
    <div style="width: 100%; height: calc(100% - 41px);">
      <div style="width: 100%; height: calc(100% - 28px);">
        <ag-grid-vue
          :id="mkey + '-view-grid'"
          :grid-options="gridOptions"
          style="width: 100%; height: 100%"
          :class="store.dark ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
        />
      </div>
      <el-pagination
        small
        layout="prev,pager,next,total,sizes"
        :page-sizes="[20,50,100,200]"
        :total="pageData.total"
        v-model:current-page="param.page_idx"
        v-model:page-size="param.page_size"
        @size-change="reloadTableData"
        @current-change="reloadTableData"
        style="padding: 2px 0"
      />
    </div>
    <MaskWindow v-model="addPanelVisible" :teleport-to="teleportTo">
      <div style="width: 100%; height: 100%; background-color: var(--el-bg-color);">
        <div style="box-sizing: border-box; padding: 6px;  background-color: var(--toolbar-bg-color);">
          <el-button @click="addPanelVisible = false">取消</el-button>
          <el-button @click="handleConfirmAdd" type="primary" plain>确定</el-button>
        </div>
        <div style="width: 100%; height: calc(100% - 32px - 1px - 12px - 10px); margin-top: 10px">
          <el-scrollbar always>
            <v-form-render ref="addFormRenderRef" :scheme="startForm" :form-data="formData" />
          </el-scrollbar>
        </div>
      </div>
    </MaskWindow>
    <MaskWindow v-model="viewPanelVisible" :teleport-to="teleportTo">
      <div style="width: 100%; height: 100%; background-color: var(--el-bg-color);">
        <div style="width: 100%; padding: 6px;  background-color: var(--toolbar-bg-color); ">
          <el-button v-if="viewerMode" @click="viewerMode = false" :disabled="!updatePageInfo?.page_scheme">编辑</el-button>
          <el-button v-if="!viewerMode" @click="handleCancelUpdate">取消</el-button>
          <el-button v-if="!viewerMode" @click="handleConfirmUpdate">确定</el-button>
        </div>
        <div style="width: 100%; height: calc(100% - 32px - 1px - 12px - 10px); margin-top: 10px">
          <el-scrollbar always>
            <v-form-render v-if="viewerMode" :scheme="viewPageInfo.page_scheme" :form-data="instanceInfo || {}" />
            <v-form-render v-if="!viewerMode" ref="updateFormRenderRef" :scheme="updatePageInfo.page_scheme" :form-data="instanceInfo || {}" />
          </el-scrollbar>
        </div>
      </div>

    </MaskWindow>
    <MaskWindow v-model="viewConfigVisible" :teleport-to="teleportTo">
      <ModelingViewUpdatePanel :src="activeView" :fields="modelingFields" @close="viewConfigVisible = false" @success="initPage" />
    </MaskWindow>
    <MaskWindow v-model="instanceVisible" :teleport-to="teleportTo">
      <WorkflowInstanceTabsPage :mkey="props.mkey" :instance-id="instanceId" />
    </MaskWindow>

    <dropdown-menu
      ref="menuRef"
      v-click-outside="handleClickMenuOutside"
      @item-click="handleMenuClick"
      :x="position.x"
      :y="position.y"
      :options="items"
    />

  </div>
</template>

<script lang="ts" setup>
import { ElButton, ElSelect, ElOption, ElMessage, ElScrollbar, ElPagination, ElPopover } from 'element-plus'
import { computed, inject, nextTick, ref, shallowRef, toRaw, onMounted, markRaw } from 'vue';
import { CopyDocument, Setting, View, Edit, Delete, User } from '@element-plus/icons-vue'
import { useViewApi } from '@/service/modeling/view';
import { useEntityInstanceApi } from '@/service/modeling/entity';
import MaskWindow from "@/components/dialog/MaskWindow.vue";
import VFormRender from "@/components/form/designer/VFormRender.vue";
import { userMapKey } from "@/config/app.keys";
import { useModelingFieldApi } from "@/service/modeling/field";
import ModelingViewUpdatePanel from '@/views/modeling/view/ModelingViewUpdatePanel.vue'
import { useWorkflowInstanceApi } from '@/service/workflow';
import { useRoute, useRouter } from 'vue-router';
import WorkflowInstanceTabsPage from "@/views/workflow/instance/WorkflowInstanceTabsPage.vue";
import { AgGridVue } from 'ag-grid-vue3';
import {
  ColumnApi,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ColDef,
  ColGroupDef,
  ValueFormatterParams,
  CellDoubleClickedEvent, CellContextMenuEvent, CellClickedEvent, SortChangedEvent
} from "ag-grid-community";
import * as PageApi from '@/api/modeling/page'
import * as WorkflowApi from "@/api/workflow";
import * as ViewApi from "@/api/modeling/view";
import * as OptionApi from "@/api/modeling/option";

import { toTree } from "@/utils/common";
import { useThemeStore } from "@/store/theme";
import { varUserOptions, varDeptOptions } from "@/views/modeling/filter";
import { MenuOption, MenuType, Point } from "@/components/menu";
import DropdownMenu from "@/components/menu/DropdownMenu.vue";


interface Props {
  module: ModelingModule
  mkey: string
}

const props = defineProps<Props>()

const store = useThemeStore()

const route = useRoute()
const router = useRouter()
const teleportTo = computed(() => {
  if (route.name === 'workflow-instance-list') {
    return undefined
  } else {
    return `#modeling-panel-${props.mkey}`
  }
})

const loading = ref(false)

const { instanceInfo, getInstance, createInstance, updateInstance, deleteInstance } = useEntityInstanceApi()
const { startInstanceResult, startInstance } = useWorkflowInstanceApi()

const pageInfo = ref<ModelingPageView>()
const viewPageInfo = ref<ModelingPageView>()
const updatePageInfo = ref<ModelingPageView>()
const startFormScheme = ref<ModelingPageView>()

const viewSimpleInfoList = ref<ModelingViewSimpleInfo[]>([])

const startForm = computed(() => props.module === 'ENTITY' ? pageInfo.value?.page_scheme : startFormScheme.value?.page_scheme)

const autoSizeColumnKeys = ref<string[]>([])


onMounted(initPage)

const optionFieldValueMap = new Map<string, ModelingOptionValueView[]>()

async function initPage() {
  try {
    loading.value = true
    if (props.module === 'ENTITY') {
      pageInfo.value = await PageApi.findPage({ ...props, name: 'ADD' })
      viewPageInfo.value = await PageApi.findPage({ ...props, name: 'VIEW' })
      updatePageInfo.value = await PageApi.findPage({ ...props, name: 'UPDATE' })
    } else {
      startFormScheme.value = await WorkflowApi.getStartForm(props.mkey)
      console.log('start form', startFormScheme.value);
    }

    viewSimpleInfoList.value = await ViewApi.findModelingView({module: props.module, mkey: props.mkey})
    if (viewSimpleInfoList.value?.length) {
      activeViewId.value = viewSimpleInfoList.value[0].id

      param.value.condition_map = {}
      activeView.value.columns.forEach(it => {
        param.value.condition_map[it.field.field] = it.condition
      })

      const columnDef: ColGroupDef[] = []
      for (const it of activeView.value.columns) {
        if (it.field?.type === 'option' && it.filterable) {
          if (optionFieldValueMap.has(it.field.scheme.optionTypeId)) {
            it.field.scheme.options = optionFieldValueMap.get(it.field.scheme.optionTypeId)
          } else {
            const optionValues = await OptionApi.getOptionValues({ typeId: it.field.scheme.optionTypeId })
            it.field.scheme.options = toTree(optionValues, 'id', 'pid')
            optionFieldValueMap.set(it.field.scheme.optionTypeId,  it.field.scheme.options)
          }

        }
        const column: ColGroupDef = {
          children: [
            {
              field: it.field.field,
              headerName: it.field.label,
              width: it.width || undefined,
              minWidth: it.min_width || undefined,
              sortable: it.sortable,
              resizable: it.resizable,
            }
          ]
        }

        if (it.width === 0) {
          (column.children[0] as ColDef).flex = 1
        }

        if (it.filterable) {
          (column.children[0] as ColDef).suppressMovable = true
          if (it.field.type === 'text') {
            column.headerGroupComponent = 'TextFilter'
            const field = it.field.field
            column.headerGroupComponentParams = {
              initValue: param.value.condition_map[field] as string,
              onChange: (v: string) => {
                param.value.condition_map[field] = v
                reloadTableData()
              },
            }
          }
          else if (it.field.type === 'option') {
            column.headerGroupComponent = 'OptionFilter'
            const field = it.field.field
            console.log('header components options', it.field.scheme.options)
            column.headerGroupComponentParams = {
              initValue: param.value.condition_map[field] as string,
              onChange: (v: string) => {
                param.value.condition_map[field] = v
                reloadTableData()
              },
              componentProps: {
                props: {
                  label: 'name',
                  children: 'children'
                },
                nodeKey: 'id',
                filterable: true,
                clearable: true,
                fitInputWidth: true,
                checkStrictly: true,
                defaultExpandAll: true,
                data: it.field.scheme.options || [],
                style: {
                  width: '100%'
                }
              }
            }

          }
          else if (it.field.type === 'user') {
            column.headerGroupComponent = 'UserFilter'
            const field = it.field.field
            column.headerGroupComponentParams = {
              initValue: param.value.condition_map[field] as string,
              onChange: (v: string) => {
                param.value.condition_map[field] = v
                reloadTableData()
              },
              componentProps: {
                varOptions: varUserOptions,
                style: {
                  width: '100%'
                }
              }
            }
          }
          else if (it.field.type === 'dept') {
            column.headerGroupComponent = 'DeptFilter'
            const field = it.field.field
            column.headerGroupComponentParams = {
              initValue: param.value.condition_map[field] as string,
              onChange: (v: string) => {
                param.value.condition_map[field] = v
                reloadTableData()
              },
              componentProps: {
                varOptions: varDeptOptions,
                style: {
                  width: '100%'
                }
              }
            }
          }
          else if (it.field.type === 'date') {
            column.headerGroupComponent = 'DateFilter'
            const field = it.field.field
            column.headerGroupComponentParams = {
              dateType: it.field.scheme.dateType,
              initValue: param.value.condition_map[field] as string,
              onChange: (v: [Date, Date]) => {
                if (v?.length === 2) {
                  param.value.condition_map[field] = v[0].getTime() + ',' + v[1].getTime()
                } else {
                  param.value.condition_map[field] = undefined
                }
                reloadTableData()
              },
            }
          }
      }

        // 格式化
        if (it.field?.type === 'option') {
          (column.children[0] as ColDef).valueFormatter = (params: ValueFormatterParams<any, string>) => {
            return params.value?.split(',').map(it => pageData.value.additional?.optionMap[it]?.name).join(', ')
          }
        }
        else if (it.field?.type === 'user') {
          (column.children[0] as ColDef).valueFormatter = (params: ValueFormatterParams<any, string>) => {
            return params.value?.split(',').map(it => pageData.value.additional?.userMap[it]?.nickname).join(', ')
          }
        }
        else if (it.field?.type === 'dept') {
          (column.children[0] as ColDef).valueFormatter = (params: ValueFormatterParams<any, string>) => {
            return params.value?.split(',').map(it => pageData.value.additional?.deptMap[it]?.title).join(', ')
          }
        }

        if (it.width === -1) {
          autoSizeColumnKeys.value.push(it.field.field)
        }

        columnDef.push(column)
      }

      const orderFields = activeView.value.collation
      for (let i = 0; i < orderFields.length; i++) {
        const it = orderFields[i]
        for (let column of columnDef) {
          const columnItem = column.children[0] as ColDef
          if (columnItem.field === it.field) {
            columnItem.sort = it.order
            columnItem.sortIndex = i
          }
        }
      }

      console.log('column definition', columnDef)

      gridApi.value?.setColumnDefs(columnDef)


      await loadData()
    } else {
      ElMessage.error('该实体未配置显示视图')
    }
  } finally {
    loading.value = false
  }
}

async function loadData() {
  param.value.collation = JSON.parse(JSON.stringify(toRaw(activeView.value.collation)))
  param.value.condition_map = {}
  activeView.value.columns.forEach(it => {
    param.value.condition_map[it.field.field] = it.condition
  })
  console.log('condition map', param.value.condition_map);

  await nextTick()
  reloadTableData()
}

const activeViewId = ref<string>('')
const activeView = computed(() => {
  return viewSimpleInfoList.value.find(it => it.id === activeViewId.value)!
})


const gridApi = shallowRef<GridApi>()
const columnApi = shallowRef<ColumnApi>()


const gridOptions: GridOptions = {
  onGridReady(event: GridReadyEvent<any>) {
    gridApi.value = event.api
    columnApi.value = event.columnApi
    initPage()
  },
  onCellContextMenu(event: CellContextMenuEvent<any>) {
    // open menu
    console.log('context menu', event)
    const cellDiv = event.eventPath?.[0] as HTMLDivElement
    if (cellDiv && event.data) {
      const pointEvent = event.event as PointerEvent

      contextmenuContext.value = event

      position.value.x = pointEvent.clientX
      position.value.y = pointEvent.clientY

      menuRef.value?.show()
    }

  },
  onCellDoubleClicked(event: CellDoubleClickedEvent<any>) {
    if (!event.data) return;
    if (props.module === 'ENTITY') {
      if (!viewPageInfo.value?.page_scheme) {
        ElMessage.error(`请先配置一个查询页面`)
        return
      }
      const row = event.data
      loading.value = true
      getInstance({ mkey: props.mkey, id: row.id })
        .then(() => (viewPanelVisible.value = true, viewerMode.value = true))
        .finally(() => loading.value = false)
    } else if (props.module === 'WORKFLOW') {
      instanceId.value = event.data.process_instance_id
      instanceVisible.value = true
      // router.push(`/workflow/instance/${props.mkey}/${params.row.process_instance_id}`)
    }
  },
  onSortChanged(event: SortChangedEvent<any>) {
    const states = event.columnApi.getColumnState();
    const orderStates = states.filter(it => !!it.sort).sort((a, b) => a.sortIndex! - b.sortIndex!)
    console.log('orderStates', orderStates)
    param.value.collation = orderStates.map(it => ({ field: it.colId, order: it.sort } as Collation))
    reloadTableData()
  },
  columnDefs: [],
  rowData: [],
  animateRows: true,
  headerHeight: 36,
  rowHeight: 32,
  preventDefaultOnContextMenu: true,
}


const menuRef = ref<InstanceType<typeof DropdownMenu>>()
const contextmenuContext = shallowRef<CellContextMenuEvent<any>>()
const position = ref<Point>({
  x: 0, y: 0
})
const items = ref<MenuOption[]>([
  { icon: markRaw(View), text: '查看详情', command: 'view' },
  { icon: markRaw(CopyDocument), text: '复制', command: 'copy' },
  { icon: markRaw(Edit), text: '编辑', command: 'edit' },
  { icon: markRaw(User), text: '转办', command: 'forward' },
  { icon: markRaw(Delete), text: '删除', command: 'delete' },
  { icon: markRaw(Setting), text: '设置', command: 'setting' },
])

function handleMenuClick(option: MenuOption, ev: PointerEvent) {
  console.log('menu item clicked', option, ev, contextmenuContext.value);
}

function handleClickMenuOutside() {
  menuRef.value?.hide()
}



const userMap = inject(userMapKey)!


const param = ref<ModelingInstancePageFindParam>({
  module: props.module,
  mkey: props.mkey,
  page_idx: 1,
  page_size: 20,
  condition_map: {},
})
const { pageData, pageModeling } =  useViewApi(loading)
function reloadTableData() {
  pageModeling(param.value)
    .then(_ =>
      pageData.value?.additional?.userMap &&
      Object.keys(pageData.value.additional.userMap).forEach(it => userMap.set(it, pageData.value.additional!.userMap[it]))
    ).then(_ => {
      gridApi.value?.setRowData(pageData.value.data)
      columnApi.value?.autoSizeColumns(autoSizeColumnKeys.value)
  })
}


const formData = ref({})
const addPanelVisible = ref(false)
const viewPanelVisible = ref(false)
const viewerMode = ref(true)
function handleAddInstance() {
  addPanelVisible.value = true
}

const instanceVisible = ref(false)
const instanceId = ref('')

const addFormRenderRef = ref<InstanceType<typeof VFormRender>>()

function handleConfirmAdd() {
  let promise = addFormRenderRef.value.formRef.validate()
  loading.value = true
  if (props.module === 'ENTITY') {
    promise.then(() => createInstance({ mkey: props.mkey, data: formData.value }))
      .then((succ: boolean) => succ && (addPanelVisible.value = false))
      .then(reloadTableData)
      .finally(() => loading.value = false)
  } else {
    promise.then(() => startInstance({ mkey: props.mkey, data: formData.value }))
    .then((succ: boolean) => succ && (addPanelVisible.value = false))
    .then(reloadTableData)
    .finally(() => loading.value = false)
  }
}

const updateFormRenderRef = ref<InstanceType<typeof VFormRender>>()

function handleCancelUpdate() {
  updateFormRenderRef.value.formRef.resetFields()
  viewerMode.value = true
}

function handleConfirmUpdate() {
  loading.value =true
  updateFormRenderRef.value.formRef.validate()
    .then(() => updateInstance({
      mkey: props.mkey,
      id: instanceInfo.value.id,
      data: instanceInfo.value
    }))
    .then((succ: boolean) => succ && (viewPanelVisible.value = false))
    .then(reloadTableData)
    .finally(() => loading.value = false)
}

const { modelingFields, findModelingFields } = useModelingFieldApi(loading)
const viewConfigVisible = ref(false)
async function handleConfigView() {
  if (!modelingFields.value?.length) {
    await findModelingFields(props.module, props.mkey)
    const optionFields = modelingFields.value.filter(it => it.scheme.type === 'option')
    for (const it of optionFields) {
      if (optionFieldValueMap.has(it.scheme.optionTypeId)) {
        it.scheme.options = optionFieldValueMap.get(it.scheme.optionTypeId)
      } else {
        const optionValues = await OptionApi.getOptionValues({ typeId: it.scheme.optionTypeId })
        it.scheme.options = toTree(optionValues, 'id', 'pid')
        optionFieldValueMap.set(it.scheme.optionTypeId, it.scheme.options)
      }
    }
  }
  viewConfigVisible.value = true
}

</script>
<style scoped>
.menu-item {
  padding: 6px 12px;
  border-bottom: 1px solid var(--el-border-color);
  cursor: pointer;
}

.menu-item:hover {
  background-color: var(--el-menu-hover-bg-color);
}

</style>
<style>
.menu-popover.el-popover.el-popper {
  padding: 0;
}
</style>