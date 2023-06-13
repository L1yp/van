<template>
  <VDialog
    v-model="visible"
    :title="props.title"
    width="800px"
    append-to-body
    :use-body-scrolling="false"
    fixed-body-height
    @opened="handleOpened"
    @confirm="handleConfirm"
    @cancel="visible = false"
  >
    <div class="dept-selector-modal">
      <div :style="{ width: '100%', height: props.multiple ? 'calc(100% - 110px)' : '100%' }">
        <el-table
          v-loading="loading"
          ref="tableRef"
          :data="treeData"
          height="100%"
          row-key="id"
          stripe border default-expand-all
          :row-style="{cursor: 'pointer'}"
          :highlight-current-row="true"
          :cell-class-name="handleCellClassName"
          @row-click="handleRowClick"
          @row-dblclick="handleRowDbClick"
        >
          <el-table-column>
            <el-table-column type="index" align="center" header-align="center" width="50" :resizable="false">
              <template #header>
                <template v-if="props.multiple">
                  <template v-if="isAllAdd">
                    <span class="select-all-user" @click="handleRemoveAll">
                      <el-icon><Minus/></el-icon>
                    </span>
                  </template>
                  <template v-else>
                    <span class="select-all-user" @click="handleAddAll">
                      <el-icon><Plus/></el-icon>
                    </span>
                  </template>
                </template>
                <template v-else><span>#</span></template>

              </template>
              <template #default="scope">
                <template v-if="props.multiple">
                  <template v-if="selectedIdMap.has(scope.row.id)">
                    <span @click="handleRemoveDept(scope.row)">
                      <el-icon><Minus/></el-icon>
                    </span>

                  </template>
                  <template v-else>
                    <span @click="handleAddDept(scope.row)">
                      <el-icon><Plus/></el-icon>
                    </span>
                  </template>
                </template>
                <template v-else>
                  <el-radio class="dept-selector" name="dept-selector" :label="scope.row.id" v-model="selectedIds"></el-radio>
                </template>

              </template>
            </el-table-column>
          </el-table-column>

          <el-table-column>
            <template #header>
              <el-input v-model="deptKey"></el-input>
            </template>
            <el-table-column label="名称" prop="title" align="left" header-align="left"/>
          </el-table-column>
          <el-table-column label="简称" prop="simple_name" width="200" align="left" header-align="left"/>
          <el-table-column label="编号" prop="ident" width="100" align="left" header-align="left"/>
          <el-table-column label="排序" prop="order_no" width="80" align="center" header-align="center" :resizable="false"/>

        </el-table>
      </div>

      <div class="selected-container" v-if="props.multiple">
        <el-scrollbar always view-class="selected-tags">
          <el-tag
            v-for="item in selectedElems"
            :key="item.id"
            closable @close="handleRemoveDept(item)"
          >
            {{ item.title }}
          </el-tag>
        </el-scrollbar>
      </div>
    </div>

  </VDialog>
</template>

<script lang="ts" setup>
import VDialog from '@/components/dialog/VDialog.vue';
import { computed, ref, toRaw } from 'vue';
import {
  ElTable, ElTableColumn, ElRadio, ElInput, ElScrollbar, ElTag,
  ElIcon,
} from "element-plus";
import { Plus, Minus } from "@element-plus/icons-vue";
import { filterDataWithTitle, findTreeItemById, isArray, flattenTree } from '@/utils/common'
import { CellCls } from "element-plus/es/components/table/src/table/defaults";

interface Props {
  multiple?: boolean
  modelValue: string | string[]
  data: DeptView[]
  title?: string
  visible: boolean
}

interface Emits {
  (e: 'update:visible', val: boolean): void
  (e: 'update:modelValue', val: string | string[]): void
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  title: '请选择部门',
})
const emits = defineEmits<Emits>()


const visible = computed<boolean>({
  get: () => { return props.visible },
  set: v => emits('update:visible', v)
})

const loading = ref<boolean>(false)


function handleCellClassName(params: FunctionParams<CellCls<DeptView>>): string {
  if (params.columnIndex === 0) {
    return 'column-index-no-place-holder'
  }
  return ''

}

function handleRowClick(row: DeptView) {
  if (!props.multiple) {
    selectedIds.value = row.id
  }
}

function handleRowDbClick(row: DeptView) {
  if (!props.multiple) {
    selectedIds.value = row.id
    handleConfirm()
  }

}

const selectedIds = ref<string | string[]>('')

const selectedIdMap = computed<Set<string>>(() => new Set<string>(selectedIds.value))

const selectedElems = computed<DeptView[]>(() => {
  if (typeof selectedIds.value === 'string') {
    return [findTreeItemById<DeptView>(props.data, 'id', selectedIds.value)!]
  } else if (isArray(selectedIds.value)) {
    return selectedIds.value.map(it => findTreeItemById<DeptView>(props.data, 'id', it)!) || []
  } else return []
})

const isAllAdd = computed<boolean>(() => flatDataIds.value.filter(it => !selectedIdMap.value.has(it)).length === 0)

const tableRef = ref<InstanceType<typeof ElTable>>()

const flatData = computed<DeptView[]>(() => flattenTree(props.data))
const flatDataIds = computed(() => flatData.value.map(it => it.id))

const treeData = computed<DeptView[]>(() => {
  const data = toRaw(props.data)
  if (!deptKey.value) {
    return data
  }
  const result: DeptView[] = []
  filterDataWithTitle(result, data, deptKey.value, 'title', undefined)
  return result
})

const deptKey = ref<string>('')

function handleOpened() {
  selectedIds.value = props.modelValue
}

function handleConfirm() {
  emits('update:modelValue', selectedIds.value)
  visible.value = false
}


function handleAddDept(item: DeptView) {
  if (props.multiple) {
    // TODO: add cascader sub tree
    selectedIds.value = [...(selectedIds.value as string[]), item.id] as string[]
  } else {
    selectedIds.value = item.id
  }
}

function handleRemoveDept(item: DeptView) {
  if (props.multiple) {
    const idx = (selectedIds.value as string[]).indexOf(item.id)
    if (idx !== -1) {
      (selectedIds.value as string[]).splice(idx, 1)
      selectedIds.value = [...(selectedIds.value as string)]
    }
  } else {
    selectedIds.value = ''
  }
}

function handleAddAll() {
  if ((props.multiple)) {
    const result = flatData.value.filter(it => !selectedIdMap.value.has(it.id)).map(it => it.id)
    selectedIds.value = [...(selectedIds.value as string[]), ...result] as string[]
  }
}

function handleRemoveAll() {
  if (props.multiple) {
    selectedIds.value = []
  }
}
</script>

<style scoped>
.dept-selector-modal {
  width: 100%;
  height: 100%;
}

.selected-container {
  box-sizing: border-box;
  border: 1px #e3e3e3 solid;
  width: 100%;
  height: 100px;
  margin-top: 10px;
}

:deep(.selected-tags) {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  padding: 5px;
}

:deep(.el-radio.dept-selector span.el-radio__label) {
  display: none;
}

:deep(.column-index-no-place-holder span.el-table__placeholder) {
  display: none;
}

.select-all-user {
  cursor: pointer;
}
</style>