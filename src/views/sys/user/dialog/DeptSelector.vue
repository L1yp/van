<template>
  <v-dialog
    @opened="handleOpenDialog"
    @closed="emits('update:visible', false)"
    :width="props.multiple ? (tableWidth + 40) : ((tableWidth - widthArr[0]) + 40)"
    v-model="visible"
    :title="props.title"
    :draggable="true"
    :append-to-body="true"
    @confirm="confirmDeptDialog"
    @cancel="emits('cancel')"
  >
    <div style="width: 100%">
      <div :style="{width: props.multiple ? tableWidth : (tableWidth - widthArr[0])} ">
        <el-table
          ref="deptTableRef"
          :height="deptTableHeight"
          :data="props.deptData"
          style="width: 100%"
          row-key="id"
          :highlight-current-row="true"
          :default-expand-all="true"
          flexible
          :row-class-name="handleRowClassName"
          @row-click="handleDeptRowClick"
          @selection-change="handleDeptSelectedChange"
          @current-change="handleDeptCurrentChange"
        >
          <el-table-column v-if="props.multiple" :selectable="handleRowSelectable" type="selection" align="center" header-align="center" :width="widthArr[0]"/>
          <el-table-column prop="simple_name" align="left" header-align="left" label="简称" :width="widthArr[1]"/>
          <el-table-column prop="id" align="center" header-align="center" label="#" :width="widthArr[2]"/>
          <el-table-column prop="ident" align="center" header-align="center" label="编号" :width="widthArr[3]"/>
          <el-table-column prop="owner" align="center" header-align="center" label="领导" :width="widthArr[4]"/>
        </el-table>
      </div>
      <div style="box-sizing: border-box; margin-top: 10px; border: 1px #e3e3e3 solid; padding: 0 5px" :style="{height: `${selectedBoxHeight + 5 + 1}px`}">
        <el-scrollbar :height="`${selectedBoxHeight + 1}px`" always>
          <template v-if="props.multiple">
            <el-tag v-for="item in selectedDepartments" closable @close="handleCloseDept(item)">{{item.simple_name}}</el-tag>
          </template>
          <template v-else-if="currentRow">
            <el-tag closable @close="handleCancelDept">{{currentRow?.simple_name}}</el-tag>
          </template>
        </el-scrollbar>
      </div>

    </div>

  </v-dialog>

</template>

<script lang="ts" setup>
import {ref, computed, watch, } from "vue"
import {
  ElDialog, ElTable, ElTableColumn, ElTag, ElButton, ElScrollbar
} from "element-plus"
import VDialog from "@/components/dialog/VDialog.vue";

interface Props {
  title: string;
  deptData: DeptView[];
  boundPartTimeDeptIds?: number[];
  boundPrimaryDeptId?: number;
  visible: boolean;
  multiple: boolean;
}

interface Emits {
  (e: 'confirm', selected: number | number[]);
  (e: 'cancel');
  (e: 'update:visible', val: boolean);
}


const emits = defineEmits<Emits>();
const props = defineProps<Props>();

const deptTableRef = ref(null);
const visible = ref<boolean>(props.visible)

watch(() => props.visible, val => visible.value = val)

const widthArr = [60, 260, 100, 100, 100]
const tableWidth = widthArr.reduce((sum, row) => sum + row, 0)

const selectedBoxHeight = 58;
/* 部门关联操作开始  */
const deptTableHeight = computed(() => {
  const marginY = 30; // vh
  const headerHeight = 55; // px
  const footerHeight = 55; // px
  const bodyMarginY = 60; // px

  const offsetHeight = document.body.offsetHeight;
  const calcHeight = 0.7 * offsetHeight - headerHeight - footerHeight - (selectedBoxHeight - 10) - bodyMarginY;
  // calc(100vh - 15vh - 15vh - 55px - 55px - 50px - 60px)
  const size = getTreeSize(props.deptData);
  const tableHeight = size * 32 + 32;
  if (calcHeight > tableHeight) {
    return tableHeight;
  } else {
    return `calc(100vh - ${marginY}vh - ${headerHeight}px - ${footerHeight}px - ${selectedBoxHeight + 10}px - ${bodyMarginY}px)`;
  }
});

function getTreeSize(treeData) {
  if (!treeData) return;
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


function handleCloseDept(row) {
  const idx = selectedDepartments.value.indexOf(row);
  if(idx > -1) {
    selectedDepartments.value.splice(idx, 1);
    deptTableRef.value.toggleRowSelection(row, false);
  }
}

function handleCancelDept() {
  currentRow.value = null;
  deptTableRef.value.setCurrentRow(undefined);
}


function handleDeptRowClick(row, column, event) {
  if (props.multiple) {
    if (row.id === props.boundPrimaryDeptId) {
      return;
    }
  } else {
    if (props.boundPartTimeDeptIds.indexOf(row.id) >= 0) {
      return;
    }
  }
  deptTableRef.value.toggleRowSelection(row, undefined);
}

const selectedDepartments = ref<DeptView[]>([]);
function handleDeptSelectedChange(departments: DeptView[]) {
  selectedDepartments.value = departments;
}

const currentRow = ref(null);
function handleDeptCurrentChange(newRow: DeptView, oldRow: DeptView) {
  if (newRow == null) return;
  if (props.multiple) {
    if (newRow.id === props.boundPrimaryDeptId) {
      deptTableRef.value.setCurrentRow(oldRow);
      return;

    }
  } else {
    if (props.boundPartTimeDeptIds.indexOf(newRow.id) >= 0) {
      deptTableRef.value.setCurrentRow(oldRow);
      return;
    }
  }

  currentRow.value = newRow;
  console.log(newRow);
}

function confirmDeptDialog() {
  if (props.multiple) {
    emits("confirm", selectedDepartments.value.map(it => it.id));
  } else {
    emits("confirm", currentRow.value.id);
  }
}

function findTreeItem(tree, id) {
  for (let row of tree) {
    if (row.children && row.children.length > 0) {
      const ret = findTreeItem(row.children, id);
      if (ret) return ret;
    }
    if (id === row.id) {
      return row;
    }
  }
  return null;
}


function handleOpenDialog() {
  console.log("handleOpenDialog", props);

  if (props.multiple) {
    if (!props.boundPartTimeDeptIds || props.boundPartTimeDeptIds.length === 0) {
      deptTableRef.value.clearSelection();
      // selectedDepartments.value = []; // 若 设置了 destroy-on-close, 则 调用 clearSelection 不会触发 select-change
    } else {
      for (let boundPartTimeDeptId of props.boundPartTimeDeptIds) {
        const item = findTreeItem(props.deptData, boundPartTimeDeptId);
        if (item) {
          deptTableRef.value.toggleRowSelection(item, true);
        } else {
          deptTableRef.value.toggleRowSelection(item, false);
        }
      }
    }

  } else {
    if (!props.boundPrimaryDeptId || props.boundPrimaryDeptId <= 0) {
      deptTableRef.value.setCurrentRow(undefined);
      // currentRow.value = null; // 若 设置了 destroy-on-close, 则 调用setCurrentRow 不会触发 currentChange
    } else {
      const row = findTreeItem(props.deptData, props.boundPrimaryDeptId);
      if (row) {
        selectedDepartments.value.push(row);
        deptTableRef.value?.setCurrentRow(row);
      }
    }
  }
}



function handleRowClassName({ row, rowIndex }) {
  if (props.multiple) {
    if (row.id === props.boundPrimaryDeptId) {
      return "dept-disabled-row";
    }
  } else {
    if (props.boundPartTimeDeptIds.indexOf(row.id) >= 0) {
      return "dept-disabled-row";
    }
  }
  return "";
}


function handleRowSelectable(row, rowIndex) {
  if (props.multiple) {
    if (row.id === props.boundPrimaryDeptId) {
      return false;
    }
  } else {
    if (props.boundPartTimeDeptIds.indexOf(row.id) >= 0) {
      return false;
    }
  }
  return true;
}

</script>

<style scoped>
.el-tag + .el-tag {
  margin-left: 5px;
}

.el-tag {
  margin-top: 5px;
}

:deep(.el-table__header thead tr .el-checkbox) {
  display: none;
}


:deep(.el-table--enable-row-hover .el-table__body tr) {
  cursor: pointer;
}

:deep(.el-table--enable-row-hover .el-table__body tr.dept-disabled-row) {
  cursor: not-allowed;
  color: red;
}
:deep(.el-table--enable-row-hover .el-table__body tr.dept-disabled-row td.el-table-column--selection label span) {
  display: none;
}


:deep(.el-table--enable-row-hover .el-table__body tr.current-row:hover>td.el-table__cell) {
  background-color: var(--el-color-primary-light-3);
}


:deep(.el-table--enable-row-hover .el-table__body tr.current-row>td.el-table__cell) {
  background-color: var(--el-color-primary-light-5);
}

</style>