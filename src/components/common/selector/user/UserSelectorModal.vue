<template>
  <VDialog
    v-model="visible"
    :title="props.title"
    full-screen
    append-to-body
    @opened="handleOpened"
    @confirm="handleConfirm"
    @cancel="visible = false"
  >
    <div class="user-selector-modal" style="height: 100%">
      <div :style="{ width: '100%' }">
        <el-table
          v-loading="loading"
          ref="tableRef"
          :data="pageData.data"
          :max-height="tableHeight"
          row-key="id"
          stripe border
          :row-style="{cursor: 'pointer'}"
          :highlight-current-row="true"
          @row-click="handleRowClick"
          @row-dblclick="handleRowDbClick"
        >
          <el-table-column width="40" align="center" header-align="center" :resizable="false" v-if="props.multiple">
            <template #header>
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
            <template #default="scope">
              <template v-if="selectedUserIds.has(scope.row.id)">
                <span @click="handleRemoveUser(scope.row)">
                  <el-icon><Minus/></el-icon>
                </span>

              </template>
              <template v-else>
                <span @click="handleAddUser(scope.row)">
                  <el-icon><Plus/></el-icon>
                </span>
              </template>
            </template>
          </el-table-column>
          <el-table-column width="40" align="center" header-align="center" :resizable="false" v-if="!props.multiple">
            <template #default="scope">
              <el-radio class="user-selector" name="user-selector" :label="scope.row.id" v-model="selectedRowId"></el-radio>
            </template>
          </el-table-column>
          <el-table-column>
            <template #header>
              <el-input v-model="formData.username" @change="handleSearch"></el-input>
            </template>
            <el-table-column width="120" label="工号" prop="username" align="left" header-align="left"/>
          </el-table-column>
          <el-table-column>
            <template #header>
              <el-input v-model="formData.nickname" @change="handleSearch"></el-input>
            </template>
            <el-table-column width="120" label="姓名" prop="nickname"/>
          </el-table-column>
          <el-table-column>
            <template #header>
              <DeptSelectorInput v-model="formData.deptId" style="width: 100%" @change="handleSearch" />
            </template>
            <el-table-column label="部门" prop="dept_id">
              <template #default="scope">
                {{ pageData.additional.dept[scope.row.dept_id].title }}
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <el-pagination
          ref="pagerRef"
          small
          layout="prev, pager, next"
          :total="pageData.total"
          :page-size="pageData.page_size"
          v-model:current-page="pageData.page_idx"
          @current-change="handleSearch"
        />
      </div>

      <div class="selected-container">
        <el-scrollbar height="200px" always view-class="selected-tags">
          <el-tag
            v-for="item in localSelectedUser"
            :key="item.id"
            closable @close="handleRemoveUser(item)"
          >
            {{ item.nickname }}
          </el-tag>
        </el-scrollbar>

      </div>
    </div>

  </VDialog>
</template>

<script lang="ts" setup>
import VDialog from '@/components/dialog/VDialog.vue';
import {computed, inject, nextTick, onMounted, ref} from 'vue';
import {
  ElTable, ElTableColumn, ElRadio, ElForm, ElFormItem, ElInput, ElButton, ElScrollbar, ElTag,
  ElIcon, ElPagination,
} from "element-plus";
import { useUserData } from "@/service/system/user";
import { Plus, Minus } from "@element-plus/icons-vue";
import DeptSelectorInput from "../dept/DeptSelectorInput.vue";

interface Props {
  multiple?: boolean
  modelValue: UserView[]
  title?: string
  visible: boolean
}

interface Emits {
  (e: 'update:visible', val: boolean): void
  (e: 'update:modelValue', val: UserView[]): void
  (e: 'confirm'): void
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  title: '请选择用户',
})
const emits = defineEmits<Emits>()


const visible = computed<boolean>({
  get: () => { return props.visible },
  set: v => emits('update:visible', v)
})



const selectedRowId = computed<string>({
  get: () => {
    if (!props.multiple) {
      return localSelectedUser.value?.[0]?.id || ''
    } else return ''
  },
  set: v => {
    if (!props.multiple) {
      localSelectedUser.value = [ pageData.value.data.find(it => it.id === v)! ]
    }
  },
})
const loading = ref<boolean>(false)


function handleRowClick(row: UserView) {
  selectedRowId.value = row.id
}

function handleRowDbClick(row: UserView) {
  selectedRowId.value = row.id
  if (!props.multiple) {
    handleConfirm()
  } else {
    if (!localSelectedUser.value.includes(row)) {
      handleAddUser(row)
    }
  }
}


const localSelectedUser = ref<UserView[]>(props.modelValue || [])
const selectedUserIds = computed<Set<string>>(() => new Set<string>((localSelectedUser.value || []).map(it => it.id)))

const isAllAdd = computed<boolean>(() => pageData.value.data?.filter(it => !selectedUserIds.value.has(it.id))?.length === 0)

const tableRef = ref<InstanceType<typeof ElTable>>()
const pagerRef = ref<InstanceType<typeof ElPagination>>()

const tableHeight = computed<string>(() => {
  const pagerHeight = pagerRef.value?.$el.clientHeight || 28
  const selectedContainerHeight = 200 + 2 + 10 // marginTop
  const padding = 32
  return `calc((calc(100vh - 44px - 54px)) - ${selectedContainerHeight + pagerHeight + padding}px)`
})
onMounted(() => tableHeight.effect.scheduler())


const { pageData, loadUserPageList } = useUserData(loading)
const formData = ref<UserQueryParam>({
  username: '',
  nickname: '',
  phone: '',
  email: '',
  deptId: '',
  pageIdx: pageData.value.page_idx,
  pageSize: pageData.value.page_size,
})

function handleSearch() {
  loadUserPageList(formData.value).then(_ => {
    const selectedUserId = new Set<string>(localSelectedUser.value.map(it => it.id))
    pageData.value.data
      .filter(it => selectedUserId.has(it.id))
      .forEach(it => tableRef.value?.toggleRowSelection(it, true))
  })
}

function handleOpened() {
  localSelectedUser.value = props.modelValue
  handleSearch()
}

function handleConfirm() {
  emits('update:modelValue', localSelectedUser.value)
  // FIXME: emits call is async
  nextTick(() => {
    emits('confirm')
    visible.value = false
  })


}


function handleAddUser(item: UserView) {
  localSelectedUser.value.push(item)
}

function handleRemoveUser(item: UserView) {
  const idx = localSelectedUser.value.map(it => it.id).indexOf(item.id)
  idx !== -1 && localSelectedUser.value.splice(idx, 1)
}

function handleAddAll() {
  pageData.value.data.filter(it => !selectedUserIds.value.has(it.id)).forEach(it => localSelectedUser.value.push(it))
}

function handleRemoveAll() {
  pageData.value.data.filter(it => selectedUserIds.value.has(it.id)).forEach(it => {
    const idx = localSelectedUser.value.map(it => it.id).indexOf(it.id)
    idx !== -1 && localSelectedUser.value.splice(idx, 1)
  })
}
</script>

<style scoped>
.selected-container {
  box-sizing: border-box;
  border: 1px #e3e3e3 solid;
  width: 100%;
  margin-top: 10px;
}

:deep(.selected-tags) {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  padding: 5px;
}

:deep(.el-radio.user-selector span.el-radio__label) {
  display: none;
}

.select-all-user {
  cursor: pointer;
}
</style>