<template>
  <el-dialog
    @opened="handleOpenDialog"
    @close="handleCloseDialog"
    class="user-ext-dialog"
    width="320px" v-model="visible"
    :title="props.title"
    :append-to-body="true"
    draggable
  >
    <div style="width: 100%">
      <el-table
        ref="permissionTableRef"
        :height="deptTableHeight"
        :data="props.permissionData"
        style="width: 100%"
        row-key="id"
        :highlight-current-row="true"
        :default-expand-all="true"
        :row-class-name="handleRowClassName"
        @row-click="handleMenuRowClick"
        @selection-change="handleMenuSelectedChange"
        @current-change="handleCurrentChange"
        stripe
      >
        <el-table-column :selectable="handleRowSelectable" type="selection" width="60"/>
        <el-table-column prop="title" align="left" header-align="left" label="简称" width="220" />
      </el-table>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="emits('cancel')">取消</el-button>
        <el-button type="primary" @click="confirmDeptDialog">确定</el-button>
      </span>
    </template>

  </el-dialog>

</template>

<script lang="ts" setup>
import {ref, computed, watch, Ref,} from "vue"
import {
  ElDialog, ElTable, ElTableColumn, ElButton
} from "element-plus"

interface Emits {
  (e: 'confirm', roleId: number, permissionIds: number[]): void;
  (e: 'update:visible', visible: boolean): void;
  (e: 'update:permissionIds', permissionIds: number[]): void;
  (e: 'cancel', visible: boolean): void;
}

interface Props {
  title: string;
  roleId: number;
  permissionIds: number[];
  permissionData: PermissionTree[];
  visible: boolean;
}

const emits = defineEmits<Emits>();
const props = defineProps<Props>();

const visible = ref(props.visible);

watch(() => props.visible, val => {
  visible.value = val;
})

const permissionTableRef = ref<InstanceType<typeof ElTable>>();


/* 部门关联操作开始  */
const deptTableHeight = computed(() => {
  const marginY = 30; // vh
  const headerHeight = 55; // px
  const footerHeight = 55; // px
  const bodyMarginY = 60; // px
  const offsetHeight = document.body.offsetHeight;
  const calcHeight = 0.7 * offsetHeight - headerHeight - footerHeight - bodyMarginY;
  // calc(100vh - 15vh - 15vh - 55px - 55px - 60px)
  const size = getTreeSize(props.permissionData);
  const tableHeight = size * 32 + 32;
  if (calcHeight > tableHeight) {
    return tableHeight;
  } else {
    return `calc(100vh - ${marginY}vh - ${headerHeight}px - ${footerHeight}px - ${bodyMarginY}px)`;
  }
});

function getTreeSize(treeData: PermissionTree[]): number {
  if (!treeData) return 0;
  let count = 0;
  for (let item of treeData) {
    count ++;
    if (item.children && item.children.length > 0) {
      const size = getTreeSize(item.children);
      count = count + size;
    }
  }
  return count;
}

function handleRowClassName(data: any): string {
  const { row, rowIndex } = data;
  if (row.children && row.children.length > 0 || !row.id.startsWith("permission")) {
    return "permission-disabled-row";
  }
  return "";
}

function handleMenuRowClick(row: MenuConfig, column: string, event: any) {
  if (row.children && row.children.length > 0) {
    return;
  }
  // TODO: improvement typing when refactor table
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  permissionTableRef.value?.toggleRowSelection(row, undefined);
}

const selectedPermissions: Ref<PermissionTree[]> = ref<PermissionTree[]>([]);
function handleMenuSelectedChange(permissions: PermissionTree[]) {
  selectedPermissions.value = permissions;
  const permissionIds: number[] = permissions.map(it => it.id).map(it => {
    const idx = it.indexOf("-")
    if (idx < 0) {
      console.error("invalid id: " + it)
      return null
    }
    return parseInt(it.substring(idx + 1, it.length))
  })
  emits("update:permissionIds", permissionIds)

}

function handleCurrentChange(newRow: MenuConfig, oldRow: MenuConfig) {
  if (newRow?.children && newRow?.children?.length > 0) {
    permissionTableRef.value?.setCurrentRow(oldRow);
  }
}

function confirmDeptDialog() {
  const permissionIds: number[] = selectedPermissions.value.map(it => it.id).map(it => {
    const idx = it.indexOf("-")
    if (idx < 0) {
      console.error("invalid id: " + it)
      return null
    }
    return parseInt(it.substring(idx + 1, it.length))
  })
  emits("confirm", props.roleId, permissionIds);
  emits("update:visible", false)

}

function findTreeItem(tree: PermissionTree[], id: number): PermissionTree | undefined {
  for (let row of tree) {
    if (row.children && row.children.length > 0) {
      const ret = findTreeItem(row.children, id);
      if (ret) return ret;
    }
    if (`permission-${id}` === row.id) {
      return row;
    }
  }
  return undefined;
}

function handleCloseDialog() {
  emits("update:visible", false)
}

function handleOpenDialog() {
  console.log("handleOpenDialog", props);
  if (!props?.permissionIds || props.permissionIds.length === 0) {
    permissionTableRef.value?.clearSelection();
    // selectedDepartments.value = []; // 若 设置了 destroy-on-close, 则 调用 clearSelection 不会触发 select-change
  } else {
    for (let permission of props.permissionIds) {
      const item = findTreeItem(props.permissionData, permission);
      if (item) {
        permissionTableRef.value?.toggleRowSelection(item, true);
      } else {
        permissionTableRef.value?.toggleRowSelection(item, false);
      }
    }
  }
}


function handleRowSelectable(row: any, rowIndex: number) {
  return !(row.children && row.children.length > 0) && row.id.startsWith("permission");
}

</script>

<style scoped>
.el-tag + .el-tag {
  margin-left: 5px;
}

.el-tag {
  margin-top: 5px;
}

:deep(.el-table .el-table__header th.el-table-column--selection label>span) {
  display: none;
}

:deep(.el-table--enable-row-hover .el-table__body tr) {
  cursor: pointer;
}

:deep(.el-table--enable-row-hover .el-table__body tr.permission-disabled-row) {
  cursor: not-allowed;
}
:deep(.el-table--enable-row-hover .el-table__body tr.permission-disabled-row td.el-table-column--selection label span) {
  display: none;
}



:deep(.el-table--enable-row-hover .el-table__body tr.current-row:hover>td.el-table__cell) {
  background-color: var(--el-color-primary-light-3);
}


:deep(.el-table--enable-row-hover .el-table__body tr.current-row>td.el-table__cell) {
  background-color: var(--el-color-primary-light-5);
}

</style>