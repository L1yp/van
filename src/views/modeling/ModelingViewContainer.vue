<template>
  <div style="width: 100%; height: 100%;">
    <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #E3E3E3; padding: 4px 0;">
      <div>
        <el-button>新建</el-button>
        <el-button>导出</el-button>
      </div>
      <div>
        <el-button :icon="Setting" text plain circle />
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
        style="width: 100%"
      >
        <vxe-colgroup>
          <vxe-column type="seq" title="#" width="50" />
        </vxe-colgroup>
        <template v-for="column in (activeView.columns || [])">
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
  </div>
</template>

<script lang="ts" setup>
import { useViewApi } from '@/service/modeling/view';
import { ElButton, ElSelect, ElOption, ElMessage, ElInput, ElTreeSelect } from 'element-plus'
import { computed, nextTick, onMounted, ref, toRaw } from 'vue';
import { Setting } from "@element-plus/icons-vue";
import UserSelectorInput from "@/components/common/selector/user/UserSelectorInput.vue";
import DateRangePicker from "@/views/modeling/view/condition/DateRangePicker.vue";
import { VxeTablePropTypes, VxeTableDefines } from "vxe-table";
import { useModelingOptionApi } from '@/service/modeling/option';


interface Props {
  module: FieldModule
  mkey: string
}

const props = defineProps<Props>()

const loading = ref(false)
const { findView, viewSimpleInfoList } = useViewApi(loading)
onMounted(async () => {
  await findView({module: props.module, mkey: props.mkey})
  if (viewSimpleInfoList.value?.length) {
    activeViewId.value = viewSimpleInfoList.value[0].id
    for (const it of activeView.value.columns) {
      if (it.field.type === 'option' && it.filterable) {
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
})
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

const param = ref<ModelingPageFindParam>({
  module: props.module,
  mkey: props.mkey,
  page_idx: 1,
  page_size: 10,
  condition_map: {},
})
const { pageData, pageModeling } =  useViewApi(loading)
function reloadTableData() {
  pageModeling(param.value)
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