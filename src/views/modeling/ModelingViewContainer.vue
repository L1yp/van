<template>
  <div style="width: 100%; height: 100%;" v-loading="loading">
    <div style="display: flex; justify-content: space-between; padding: 4px 0;">
      <div>
        <el-button @click="handleAddInstance" :disabled="!startForm">新建</el-button>
        <el-button>导出</el-button>
      </div>
      <div>
        <el-button :icon="Setting" text plain circle :disabled="!activeView" @click="handleConfigView" />
        <el-select v-model="activeViewId" @change="loadData">
          <el-option
            v-for="item in viewSimpleInfoList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>

      </div>
    </div>
    <div style="width: 100%; height: calc(100% - 41px);" v-if="activeView">
      <vxe-table
        ref="xTable"
        height="100%"
        :loading="loading"
        :key="refreshTableKey"
        stripe
        :data="pageData.data"
        :sort-config="sortConfig"
        @sort-change="handleSortChange"
        @cell-dblclick="handleCellDblClick"
        style="width: 100%"
      >
        <vxe-colgroup>
          <vxe-column type="seq" title="#" width="50" />
        </vxe-colgroup>
        <template v-for="column in (activeView?.columns || [])">
          <vxe-colgroup>
            <template v-if="column.filterable" #header>
              <template v-if="column.field.type === 'option'">
                <el-tree-select
                  v-model="param.condition_map[column.field.field]"
                  :props="{ label: 'name', children: 'children'}"
                  node-key="id"
                  filterable clearable fit-input-width check-strictly default-expand-all
                  :data="column.field.scheme.options || []"
                  @change="reloadTableData"
                />
              </template>
              <template v-if="column.field.type === 'text'">
                <el-input v-model="param.condition_map[column.field.field]" style="width: calc(100% - 4px);" @change="reloadTableData" />
              </template>
              <template v-if="column.field.type === 'user'">
                <user-selector-input v-model="param.condition_map[column.field.field]" :var-options="varUserOptions"  @change="reloadTableData" style="width: calc(100% - 4px);" />
              </template>
              <template v-if="column.field.type === 'date'">
                <template v-if="column.field.scheme.dateType === 'date'">
                  <date-range-picker
                    type="daterange"
                    v-model="param.condition_map[column.field.field]"
                    @change="reloadTableData"
                    style="width: calc(100% - 24px)"
                  />
                </template>
                <template v-if="column.field.scheme.dateType === 'datetime'">
                  <date-range-picker
                    type="datetimerange"
                    v-model="param.condition_map[column.field.field]"
                    @change="reloadTableData"
                    style="width: calc(100% - 24px)"
                  />
                </template>
                <template v-if="column.field.scheme.dateType === 'month'">
                  <date-range-picker
                    type="monthrange"
                    v-model="param.condition_map[column.field.field]"
                    @change="reloadTableData"
                    style="width: calc(100% - 24px)"
                  />
                </template>
              </template>
            </template>
            <vxe-column :width="column.width || undefined" :field="column.field.field" :title="column.field.label" :resizable="column.resizable" :sortable="column.sortable" :formatter="formatColumnValue" />
          </vxe-colgroup>
        </template>
      </vxe-table>
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
          <el-button v-if="!viewerMode" @click="viewerMode = true">取消</el-button>
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
  </div>
</template>

<script lang="ts" setup>
import { ElButton, ElSelect, ElOption, ElMessage, ElInput, ElTreeSelect, ElScrollbar } from 'element-plus'
import {computed, inject, nextTick, onMounted, ref, toRaw} from 'vue';
import { Setting } from "@element-plus/icons-vue";
import UserSelectorInput from "@/components/common/selector/user/UserSelectorInput.vue";
import DateRangePicker from "@/views/modeling/view/condition/DateRangePicker.vue";
import { VxeTablePropTypes, VxeTableDefines } from "vxe-table";
import { useModelingOptionApi } from '@/service/modeling/option';
import { useModelingPageApi } from '@/service/modeling/page';
import { useViewApi } from '@/service/modeling/view';
import { useEntityInstanceApi } from '@/service/modeling/entity';
import MaskWindow from "@/components/dialog/MaskWindow.vue";
import VFormRender from "@/components/form/designer/VFormRender.vue";
import {userMapKey} from "@/config/app.keys";
import {useModelingFieldApi} from "@/service/modeling/field";
import ModelingViewUpdatePanel from '@/views/modeling/view/ModelingViewUpdatePanel.vue'
import { useWorkflowInstanceApi } from '@/service/workflow';
import { useRouter } from 'vue-router';

interface Props {
  module: ModelingModule
  mkey: string
}

const props = defineProps<Props>()

const router = useRouter()
const teleportTo = computed(() => `#modeling-panel-${props.mkey}`)

const loading = ref(false)

const { instanceInfo, getInstance, createInstance, updateInstance, deleteInstance } = useEntityInstanceApi(loading)
const { startFormScheme, startInstanceResult, startInstance, getStartForm } = useWorkflowInstanceApi(loading)
const { pageInfo, findPage } = useModelingPageApi(loading)
const { pageInfo: viewPageInfo, findPage: getViewPage } = useModelingPageApi(loading)
const { pageInfo: updatePageInfo, findPage: getUpdatePage } = useModelingPageApi(loading)

const { findView, viewSimpleInfoList } = useViewApi(loading)

const startForm = computed(() => props.module === 'ENTITY' ? pageInfo.value?.page_scheme : startFormScheme.value?.page_scheme)


onMounted(initPage)

async function initPage() {
  if (props.module === 'ENTITY') {
    await findPage({ ...props, name: 'ADD' })
    await getViewPage({ ...props, name: 'VIEW' })
    await getUpdatePage({ ...props, name: 'UPDATE' })
  } else {
    await getStartForm(props.mkey)
    console.log('start form', startFormScheme.value);
    
  }

  await findView({module: props.module, mkey: props.mkey})
  if (viewSimpleInfoList.value?.length) {
    activeViewId.value = viewSimpleInfoList.value[0].id
    for (const it of activeView.value.columns) {
      if (it.field?.type === 'option' && it.filterable) {
        const { modelingOptionValues, findModelingOptionValues } = useModelingOptionApi(loading)
        await findModelingOptionValues({ typeId: it.field.scheme.optionTypeId })
        it.field.scheme.options = modelingOptionValues.value
      }
    }

    await loadData()
  } else {
    ElMessage.error('该实体未配置显示视图')
  }
}

async function loadData() {
  param.value.collation = JSON.parse(JSON.stringify(toRaw(activeView.value.collation)))
  param.value.condition_map = {}
  activeView.value.columns.forEach(it => {
    param.value.condition_map[it.field.field] = it.condition
  })
  sortConfig.value.defaultSort = param.value.collation
  refreshTableKey.value++
  await nextTick()
  reloadTableData()
}

const activeViewId = ref<string>('')
const activeView = computed(() => {
  return viewSimpleInfoList.value.find(it => it.id === activeViewId.value)
})

const varUserOptions: UserView[] = [
  {
    id: 'SELF',
    username: '本人',
    nickname: '本人',
    dept_id: 1,
  },
]

const refreshTableKey = ref(1)

const userMap = inject(userMapKey)


const param = ref<ModelingInstancePageFindParam>({
  module: props.module,
  mkey: props.mkey,
  page_idx: 1,
  page_size: 10,
  condition_map: {},
})
const { pageData, pageModeling } =  useViewApi(loading)
function reloadTableData() {
  pageModeling(param.value)
    .then(_ =>
      pageData.value?.additional?.userMap &&
      Object.keys(pageData.value.additional.userMap).forEach(it => userMap.set(it, pageData.value.additional.userMap[it]))
    )
}

const sortConfig = ref<VxeTablePropTypes.SortConfig>({
  remote: true,
  defaultSort: param.value.collation,
  multiple: true,
  trigger: 'cell',
})

function handleSortChange(params: VxeTableDefines.SortChangeEventParams) {
  param.value.collation = params.sortList.map(it => { return { field: it.field, order: it.order } })
  reloadTableData()
}

type FormatterParam = {
  cellValue: any
  row: object
  column: VxeTableDefines.ColumnInfo
}

function formatColumnValue(params: FormatterParam): string {
  const fieldName = params.column.field
  const columns = activeView.value.columns
  const fieldMap = new Map(columns.map(it => [it.field.field, it.field]))
  const field = fieldMap.get(fieldName)
  if (!params.cellValue) {
    return params.cellValue
  }
  if (field.scheme.type === 'option') {
    return (params.cellValue as string).split(',').map(it => pageData.value.additional?.optionMap?.[it]?.name).join(',') || ''
  }
  else if(field.scheme.type === 'user') {
    return (params.cellValue as string).split(',').map(it => pageData.value.additional?.userMap?.[it].nickname).join(',') || ''
  }
  else if(field.scheme.type === 'dept') {
    return (params.cellValue as string).split(',').map(it => pageData.value.additional?.deptMap?.[it].title).join(',') || ''
  }

  return params.cellValue
}

const formData = ref({})
const addPanelVisible = ref(false)
const viewPanelVisible = ref(false)
const viewerMode = ref(true)
function handleAddInstance() {
  addPanelVisible.value = true
}

function handleCellDblClick(params) {
  if (props.module === 'ENTITY') {
    if (!viewPageInfo.value?.page_scheme) {
      ElMessage.error(`请先配置一个查询页面`)
      return
    }
    const row = params.row
    getInstance({ mkey: props.mkey, id: row.id })
      .then(() => (viewPanelVisible.value = true, viewerMode.value = true))
  } else if (props.module === 'WORKFLOW') {
    router.push(`/workflow/instance/${params.row.process_instance_id}`)
  }

}

const addFormRenderRef = ref<InstanceType<typeof VFormRender>>()

function handleConfirmAdd() {
  let promise = addFormRenderRef.value.validate()
  if (props.module === 'ENTITY') {
    promise.then(() => createInstance({ mkey: props.mkey, data: formData.value }))
      .then(succ => succ && (addPanelVisible.value = false))
      .then(reloadTableData)
  } else {
    promise.then(() => startInstance({ mkey: props.mkey, data: formData.value }))
    .then(succ => succ && (addPanelVisible.value = false))
    .then(reloadTableData)
  }
}

const updateFormRenderRef = ref<InstanceType<typeof VFormRender>>()

function handleConfirmUpdate() {
  updateFormRenderRef.value.validate()
    .then(() => updateInstance({
      mkey: props.mkey,
      id: instanceInfo.value.id,
      data: instanceInfo.value
    }))
    .then(succ => succ && (viewPanelVisible.value = false))
    .then(reloadTableData)
}

const { modelingFields, findModelingFields } = useModelingFieldApi(loading)
const viewConfigVisible = ref(false)
async function handleConfigView() {
  if (!modelingFields.value?.length) {
    await findModelingFields(props.module, props.mkey)
  }
  viewConfigVisible.value = true
}

</script>

<style scoped>
:deep(.vxe-header--column.col--group>.vxe-cell>.vxe-cell--title) {
  width: 100%;
}

:deep(.vxe-table--render-default .col--group.vxe-header--column:not(.col--ellipsis)) {
  padding: 2px 0;
}


:deep(.vxe-header--column.col--group .vxe-cell) {
  padding-left: 2px;
  padding-right: 2px;
}
</style>