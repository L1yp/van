<template>
  <div style="width: 100%; height: 100%;">
    <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #E3E3E3; padding: 4px 0;">
      <div>
        <el-button @click="handleAddInstance">新建</el-button>
        <el-button>导出</el-button>
      </div>
      <div>
        <el-button :icon="Setting" text plain circle :disabled="!activeView" @click="handleConfigView" />
        <el-select v-model="activeViewId" @change="refreshTableKey++">
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
    <MaskWindow v-model="addPanelVisible" teleport-to="#modeling-entity-panel">
      <div style="width: 100%; height: 100%; background-color: var(--el-bg-color);">
        <div style="box-sizing: border-box; padding: 6px; border-bottom: 1px solid var(--el-border-color);">
          <el-button @click="addPanelVisible = false">取消</el-button>
          <el-button @click="handleConfirmAdd" type="primary" plain>确定</el-button>
        </div>
        <div style="width: 100%; height: calc(100% - 32px - 1px - 12px - 10px); margin-top: 10px">
          <el-scrollbar always>
            <v-form-render :scheme="pageInfo.page_scheme" :form-data="formData" />
          </el-scrollbar>
        </div>
      </div>
    </MaskWindow>
    <MaskWindow v-model="viewPanelVisible" teleport-to="#modeling-entity-panel">
      <div style="width: 100%; height: 100%; background-color: var(--el-bg-color);">
        <div style="width: 100%; padding: 6px; border-bottom: 1px solid var(--el-border-color);">
          <el-button v-if="viewerMode" @click="viewerMode = false">编辑</el-button>
          <el-button v-if="!viewerMode" @click="viewerMode = true">取消</el-button>
          <el-button v-if="!viewerMode" @click="handleConfirmUpdate">确定</el-button>
        </div>
        <div style="width: 100%; height: calc(100% - 32px - 1px - 12px - 10px); margin-top: 10px">
          <el-scrollbar always>
            <v-form-render v-if="viewerMode" :scheme="viewPageInfo.page_scheme" :form-data="instanceInfo || {}" />
            <v-form-render v-if="!viewerMode" :scheme="updatePageInfo.page_scheme" :form-data="instanceInfo || {}" />
          </el-scrollbar>
        </div>
      </div>

    </MaskWindow>
    <MaskWindow v-model="viewConfigVisible" teleport-to="#modeling-entity-panel">
      <ModelingViewUpdatePanel :src="activeView" :fields="modelingFields" @close="viewConfigVisible = false" @success="initPage" />
    </MaskWindow>
  </div>
</template>

<script lang="ts" setup>
import { ElButton, ElSelect, ElOption, ElMessage, ElInput, ElTreeSelect, ElScrollbar } from 'element-plus'
import {computed, inject, nextTick, onBeforeMount, onMounted, ref, toRaw} from 'vue';
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

interface Props {
  module: ModelingModule
  mkey: string
}

const props = defineProps<Props>()

const loading = ref(false)

const { instanceInfo, getInstance, createInstance, updateInstance, deleteInstance } = useEntityInstanceApi(loading)
const { pageInfo, getPage } = useModelingPageApi(loading)
const { pageInfo: viewPageInfo, getPage: getViewPage } = useModelingPageApi(loading)
const { pageInfo: updatePageInfo, getPage: getUpdatePage } = useModelingPageApi(loading)

const { findView, viewSimpleInfoList } = useViewApi(loading)
onMounted(initPage)

async function initPage() {
  await getPage({ ...props, pageKey: 'ADD' })
  await getViewPage({ ...props, pageKey: 'VIEW' })
  await getUpdatePage({ ...props, pageKey: 'UPDATE' })

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

    param.value.collation = JSON.parse(JSON.stringify(toRaw(activeView.value.collation)))
    param.value.condition_map = {}
    activeView.value.columns.forEach(it => {
      param.value.condition_map[it.field.field] = it.condition
    })
    sortConfig.value.defaultSort = param.value.collation
    refreshTableKey.value++
    await nextTick()
    reloadTableData()
  } else {
    ElMessage.error('该实体未配置显示视图')
  }
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
  pageModeling(param.value).then(_ => Object.keys(pageData.value.additional.userMap).forEach(it => userMap.set(it, pageData.value.additional.userMap[it])))
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
  const row = params.row
  getInstance({ mkey: props.mkey, id: row.id })
    .then(() => (viewPanelVisible.value = true, viewerMode.value = true))
}

function handleConfirmAdd() {
  createInstance({ mkey: props.mkey, data: formData.value })
    .then(succ => succ && (addPanelVisible.value = false))
    .then(reloadTableData)
}

function handleConfirmUpdate() {
  updateInstance({
    mkey: props.mkey,
    id: instanceInfo.value.id,
    data: instanceInfo.value
  }).then(succ => succ && (viewPanelVisible.value = false))
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
:deep(.vxe-header--column.col--group .vxe-cell) {
  padding-left: 2px;
  padding-right: 2px;
}
</style>