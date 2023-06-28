<template>
  <div style="width: 100%; height: 100%;">
    <div style="height: 32px; display: flex">
      <el-button :icon="Plus" type="primary" @click="handleAdd">新增</el-button>
      <el-scrollbar style="margin-left: 10px" wrap-style="display: flex; align-items: center">
        <div style="white-space: nowrap; color: red; font-weight: bold; ">双击进入配置(双击流程版本设计流程图，右键操作流程版本)</div>
      </el-scrollbar>
    </div>
    <div style="width: 100%; height: calc(100% - 32px - 10px - 36px); margin-top: 10px;">
      <el-table
        v-loading="loading"
        ref="tableRef"
        :data="pageData.data"
        height="100%"
        border stripe scrollbar-always-on
        row-key="id"
        :tree-props="{ children: 'children' }"
        :row-style="{ cursor: 'pointer' }"
        @cell-click="handleCellClick"
        @row-dblclick="handleRowDbClick"
        @cell-contextmenu="handleContextMenu"
        size="small"
      >
        <el-table-column>
          <el-table-column type="index" label="#" width="50" align="center" header-align="center" />
        </el-table-column>

        <el-table-column>
          <template #header>
            <el-input v-model="param.name" @change="loadPage(param)" />
          </template>
          <el-table-column prop="name" label="名称" width="300"/>
        </el-table-column>
        <el-table-column>
          <template #header>
            <el-input v-model="param.remark" @change="loadPage(param)" />
          </template>
          <el-table-column prop="remark" label="备注" :resizable="false" min-width="200" show-overflow-tooltip />
        </el-table-column>
        <el-table-column>
          <el-table-column prop="status" label="状态" :resizable="false" width="80" align="center" header-align="center">
            <template #default="scope">
              <el-tag>{{ scope.row.status === 0 ? '停用' : '启用' }}</el-tag>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column>
          <template #header>
            <UserSelectorInput v-model="param.updateBy" placeholder="" multiple @change="loadPage(param)" />
          </template>
          <el-table-column prop="update_by" label="更新人" width="200" :resizable="false" :formatter="formatUser" align="center" header-align="center" />
        </el-table-column>
        <el-table-column>
          <template #header>
            <UserSelectorInput v-model="param.createBy" placeholder="" multiple @change="loadPage(param)" />
          </template>
          <el-table-column prop="create_by" label="创建人" width="200" :resizable="false" :formatter="formatUser" align="center" header-align="center" />
        </el-table-column>

        <el-table-column>
          <el-table-column prop="update_time" label="更新时间" width="160" :resizable="false" align="center" header-align="center" />
        </el-table-column>
        <el-table-column>
          <el-table-column prop="create_time" label="创建时间" width="160" :resizable="false" align="center" header-align="center" />
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-pagination
        :total="pageData.total"
        v-model:current-page="param.pageIdx"
        v-model:page-size="param.pageSize"
        :page-sizes="[50]"
        layout="prev, pager, next"
        @current-change="loadPage(param)"
        style="padding-left: 0; height: 36px"
      />
    </div>

    <MaskWindow v-model="typeMaskVisible">
      <WorkflowTypeConfigTabs />
    </MaskWindow>
    <MaskWindow v-model="verMaskVisible">
      <WorkflowVerDesigner :ver-id="srcRow!.id" />
    </MaskWindow>
    <MaskWindow v-model="addPanelVisible">
      <DefAddPanel @success="loadPage(param)" @close="addPanelVisible = false" />
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
import { useWorkflowApi } from "@/service/workflow";
import { markRaw, onBeforeMount, provide, reactive, ref } from "vue";
import {
  ElTable,
  ElTableColumn,
  ElInput,
  ElButton,
  ElPagination,
  ElScrollbar,
  TableInstance,
  ElTag,
  ElMessageBox,
} from "element-plus";
import { CopyDocument, Delete, Edit, Plus, Setting, User, VideoPause, VideoPlay } from "@element-plus/icons-vue";
import WorkflowTypeConfigTabs from "@/views/workflow/model/WorkflowTypeConfigTabs.vue";
import WorkflowVerDesigner from "@/views/workflow/bpmn/designer.vue";
import UserSelectorInput from '@/components/common/selector/user/UserSelectorInput.vue'
import DefAddPanel from "./type/DefAddPanel.vue";
import { workflowDefKey } from "./keys";
import MaskWindow from "@/components/dialog/MaskWindow.vue";
import { useFieldStore } from "@/store/field-config";
import DropdownMenu from "@/components/menu/DropdownMenu.vue";
import { MenuOption, Point } from "@/components/menu";

interface Props {
  name?: string
}

const props = defineProps<Props>()

const loading = ref<boolean>(false)
const param = ref<WorkflowTypeDefPageParam>({
  pageIdx: 1,
  pageSize: 20,
  name: props.name,
  remark: '',
})

const { pageData, loadPage, copyVer, activeVer, pendingVer } = useWorkflowApi(loading)
onBeforeMount(() => loadPage(param.value))

function formatUser(row: WorkflowTypeDefView, column: any, cellValue: string | number, index: number) {
  return pageData.value.additional?.[cellValue]?.nickname || ''
}

const addPanelVisible = ref(false)
const typeMaskVisible = ref(false)
const verMaskVisible = ref(false)
const srcRow = ref<WorkflowTypeDefView | WorkflowTypeVerView>()
provide(workflowDefKey, srcRow)

const store = useFieldStore()

const handleCellClick: TableCellClickEvent<WorkflowTypeDefView & WorkflowTypeVerView> = (row, column, cell, event) => {
  tableRef.value?.toggleRowExpansion(row, undefined)
}

function handleRowDbClick(row: WorkflowTypeDefView & WorkflowTypeVerView) {
  if (row.children?.length) {
    srcRow.value = row

    store.scope = 'WORKFLOW_PRIVATE'
    store.module = 'WORKFLOW'
    store.mkey = row.key

    typeMaskVisible.value = true
  } else {
    srcRow.value = row
    verMaskVisible.value = true
  }
}


function handleAdd() {
  addPanelVisible.value = true
}

const tableRef = ref<TableInstance>()

const position = reactive<Point>({
  x: 0,
  y: 0,
})
const items = ref<MenuOption[]>([
  { icon: markRaw(CopyDocument), text: '复制', command: 'copy' },
  { icon: markRaw(Edit), text: '编辑', command: 'edit' },
  { icon: markRaw(VideoPlay), text: '发布', command: 'enable' },
  { icon: markRaw(VideoPause), text: '停用', command: 'disable' },
  { icon: markRaw(Delete), text: '删除', command: 'delete' },

])
const contextMenuRow = ref<WorkflowTypeVerView>()
const menuRef = ref<InstanceType<typeof DropdownMenu>>()
const handleContextMenu: TableContextMenuEvent<WorkflowTypeDefView & WorkflowTypeVerView> = (row, column, clickEl, event) => {
  if (!!row.code_gen_rule) {
    return
  }
  contextMenuRow.value = row
  event.preventDefault()
  position.x = event.clientX
  position.y = event.clientY
  console.log('position', position, event)
  menuRef.value?.show()
}

function handleClickMenuOutside() {
  menuRef.value?.hide()

}

async function handleMenuClick(option: MenuOption, ev: PointerEvent) {
  if (!contextMenuRow.value) {
    return
  }
  try {
    let result = false
    if (option.command === 'copy') {
      result = await copyVer(contextMenuRow.value.id)
    }
    else if (option.command === 'enable') {
      let remark = undefined
      try {
        const inputMessage = await ElMessageBox.prompt('请输入部署说明', '部署说明', {
          confirmButtonText: '发布',
          cancelButtonText: '取消',
        })
        console.log('input message', inputMessage)
        remark = inputMessage.value
      } catch (ignored) {
        return
      }
      result = await activeVer(contextMenuRow.value.id, remark)
    }
    else if (option.command === 'disable') {
      result = await pendingVer(contextMenuRow.value.id)
    }
    if (result) {
      await loadPage(param.value)
    }
  } catch (e) {
    console.error((e as Error)?.message || '处理菜单事件发生错误')
  }

}



</script>

<style scoped>
:deep(table.el-table__body tr.el-table__row td:first-child span.el-table__placeholder) {
  display: none;
}

</style>