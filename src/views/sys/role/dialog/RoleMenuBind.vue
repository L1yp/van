<template>
  <el-dialog
    @opened="handleOpenDialog"
    @close="handleCloseDialog"
    custom-class="user-ext-dialog"
    width="320px" v-model="visible"
    :title="props.title"
    :append-to-body="true"
    draggable
  >
    <div style="width: 100%">
      <el-table
        ref="menuTableRef"
        :height="deptTableHeight"
        :data="props.menuOptions"
        style="width: 100%"
        row-key="id"
        :highlight-current-row="true"
        :default-expand-all="true"
        :row-class-name="handleRowClassName"
        @row-click="handleMenuRowClick"
        @selection-change="handleMenuSelectedChange"
        @current-change="handleCurrentChange"

      >
        <el-table-column :selectable="handleRowSelectable" type="selection" width="60" align="center" header-align="center"/>
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
import {ref, computed, toRef, watch, Ref,} from "vue"
import {
  ElDialog, ElTable, ElTableColumn, ElButton
} from "element-plus"
import {read} from "@/utils/storage"
import * as MenuApi from "@/api/sys/menu"

interface Emits {
  (e: 'confirm', roleId: number, menuIds: number[]): void;
  (e: 'update:visible', visible: boolean): void;
  (e: 'cancel'): void;
}

interface Props {
  title: string;
  roleId: number;
  boundMenus: number[];
  menuOptions: MenuConfig[];
  visible: boolean;
}

const emits = defineEmits<Emits>();
const props = defineProps<Props>();

const visible = ref(props.visible);

watch(() => props.visible, val => {
  visible.value = val;
})

const menuTableRef = ref<InstanceType<typeof ElTable>>();


/* 部门关联操作开始  */
const deptTableHeight = computed(() => {
  const marginY = 30; // vh
  const headerHeight = 55; // px
  const footerHeight = 55; // px
  const bodyMarginY = 60; // px
  const offsetHeight = document.body.offsetHeight;
  const calcHeight = 0.7 * offsetHeight - headerHeight - footerHeight - bodyMarginY;
  // calc(100vh - 15vh - 15vh - 55px - 55px - 60px)
  const size = getTreeSize(props.menuOptions);
  const tableHeight = size * 40 + 40;
  if (calcHeight > tableHeight) {
    return tableHeight;
  } else {
    return `calc(100vh - ${marginY}vh - ${headerHeight}px - ${footerHeight}px - ${bodyMarginY}px)`;
  }
});

function getTreeSize(treeData: MenuConfig[]): number {
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
  if (row.children && row.children.length > 0) {
    return "menu-disabled-row";
  }
  return "";
}

function handleMenuRowClick(row: MenuConfig, column: string, event: any) {
  if (row.children && row.children.length > 0) {
    return;
  }
  // TODO: improvement typing when refactor table
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  menuTableRef.value?.toggleRowSelection(row, undefined);
}

const selectedMenus: Ref<MenuConfig[]> = ref<MenuConfig[]>([]);
function handleMenuSelectedChange(menus: MenuConfig[]) {
  selectedMenus.value = menus;
}

function handleCurrentChange(newRow: MenuConfig, oldRow: MenuConfig) {
  if (newRow?.children && newRow?.children?.length > 0) {
    menuTableRef.value?.setCurrentRow(oldRow);
  }
}

function confirmDeptDialog() {
  emits("confirm", props.roleId, selectedMenus.value.map(it => it.id));
  emits("update:visible", false)

}

function findTreeItem(tree: MenuConfig[], id: number): MenuConfig | undefined {
  for (let row of tree) {
    if (row.children && row.children.length > 0) {
      const ret = findTreeItem(row.children, id);
      if (ret) return ret;
    }
    if (id === row.id) {
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
  if (!props?.boundMenus || props.boundMenus.length === 0) {
    menuTableRef.value?.clearSelection();
    // selectedDepartments.value = []; // 若 设置了 destroy-on-close, 则 调用 clearSelection 不会触发 select-change
  } else {
    for (let boundMenu of props.boundMenus) {
      const item = findTreeItem(props.menuOptions, boundMenu);
      if (item) {
        menuTableRef.value?.toggleRowSelection(item, true);
      } else {
        menuTableRef.value?.toggleRowSelection(item, false);
      }
    }
  }
}


function handleRowSelectable(row: any, rowIndex: number) {
  return !(row.children && row.children.length > 0);
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

:deep(.el-table--enable-row-hover .el-table__body tr.menu-disabled-row) {
  cursor: not-allowed;
}
:deep(.el-table--enable-row-hover .el-table__body tr.menu-disabled-row td.el-table-column--selection label span) {
  display: none;
}



:deep(.el-table--enable-row-hover .el-table__body tr.current-row:hover>td.el-table__cell) {
  background-color: var(--el-color-primary-light-3);
}


:deep(.el-table--enable-row-hover .el-table__body tr.current-row>td.el-table__cell) {
  background-color: var(--el-color-primary-light-5);
}

</style>