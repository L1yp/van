<template>
  <table style="box-sizing: border-box; height: 32px; border: 0; border-collapse: collapse; border-spacing: 0;">
    <colgroup>
      <col :style="{width: roleWidth.selection + 'px'}">
      <col :style="{width: roleWidth.id + 'px'}">
      <col :style="{width: roleWidth.name + 'px'}">
      <col :style="{width: roleWidth.order_no + 'px'}">
      <col :style="{width: roleWidth.status + 'px'}">
    </colgroup>
    <thead>
      <th>&nbsp;</th>
      <th>&nbsp;</th>
      <th><el-input size="default" placeholder="菜单名称" v-model="roleTitleKey"></el-input></th>
      <th>&nbsp;</th>
      <th>&nbsp;</th>
    </thead>
  </table>
  <div class="data-table">

    <el-table
        ref="tableRef"
        v-loading="loading"
        row-key="id"
        :data="filterTableData"
        :height="props.tableHeight"
        :style="{width: tableWidth + 'px'}"
        table-layout="auto"
        :stripe="true"
        border
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
        :row-style="{cursor: 'pointer'}"
        @header-dragend="handleHeaderDragend"
    >
      <el-table-column type="selection" align="center" header-align="center" :width="roleWidth.selection" />
      <el-table-column prop="id" label="#" :width="roleWidth.id" align="center" header-align="center" />

      <el-table-column prop="name" label="名称" :width="roleWidth.name" :show-overflow-tooltip="true"/>
      <el-table-column prop="order_no" label="排序" :width="roleWidth.order_no" align="center" header-align="center" />
      <el-table-column prop="status" label="状态" :width="roleWidth.status" align="center" header-align="center">
        <template v-slot="scope">
          <el-tag :type="scope.row.status === 0 ? '' : 'danger'" v-text="scope.row.status === 0 ? '正常' : '禁用'"></el-tag>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref} from "vue"
import {
  ElTable, ElTableColumn, ElInput, ElTag, ElMessage,
} from "element-plus"
import * as RoleApi from "@/api/sys/role"

const tableRef = ref<InstanceType<typeof ElTable>>(null);
const loading = ref<boolean>(true);
const props = defineProps({
  tableHeight: {
    type: String,
    /* 32px: searchBar */
    /* 10px: marginTop */
    default: "calc(100%)"
  }
});

const roles = ref([]);

const roleTitleKey = ref("");

const filterTableData = computed(() => {
  if (roleTitleKey.value) {
    return roles.value.filter(it => it.name.indexOf(roleTitleKey.value) > -1);
  }
  return roles.value;
});

function handleRowClick(row, column, event) {
  // selectedRoles
  let selected = false;
  for (const role of selectedRoles.value) {
    if (role == row) {
      selected = true;
      break;
    }
  }
  tableRef.value.toggleRowSelection(row, !selected);
}

function searchRoleList() {
  loading.value = true;
  RoleApi.findRole().then(data => {
    roles.value = data;
  }).catch((e) => {
    ElMessage.error("新增失败：" + e.message);
  }).finally(() => loading.value = false);
}




const selectedRoles = ref([]);
function handleSelectionChange(roles) {
  selectedRoles.value = roles;
}

const tableWidth = computed(() => {
  return roleWidth.value.selection + roleWidth.value.id + roleWidth.value.name + roleWidth.value.order_no + roleWidth.value.status;
});


const roleWidth = ref({
  selection: 48,
  name: 250,
  id: 60,
  order_no: 50,
  status: 60

});

function handleHeaderDragend(newWidth, oldWidth, column, event) {
  console.log(newWidth, oldWidth, column, event);
  roleWidth.value[column.property] = newWidth;
}

onMounted(() => {
  searchRoleList();
});

</script>

<style scoped>

.data-table {
  box-sizing: border-box;
  margin-top: 10px;
  height: calc(100% - 32px - 10px);
}

.el-table tr {
  cursor: pointer;
}

</style>