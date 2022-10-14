<template>

  <div class="op-line">
    <el-button plain type="primary" @click="addRole" :icon="Plus">新增</el-button>

    <el-popconfirm
        title="确定删除?"
        confirmButtonText="确定"
        cancelButtonText="取消"
        @confirm="batchDeleteRole"
    >
      <template #reference>
        <el-button size="default" plain :icon="Delete" type="danger" :loading="loading" :disabled="selectedRoles.length === 0">删除</el-button>
      </template>
    </el-popconfirm>
    <el-button size="default" plain :icon="Download" type="warning" @click="addRole">导出</el-button>
  </div>

  <div class="data-table">
    <el-table
      v-loading="loading"
      ref="tableRef"
      row-key="id"
      :data="roleData"
      :height="dataTableHeight"
      style="width: 100%"
      :row-style="{ cursor: 'pointer' }"
      table-layout="auto"
      stripe border
      @row-click="handleRowClick"
      @selection-change="v => selectedRoles = v"
    >
      <el-table-column type="selection" align="center" header-align="center" />
      <el-table-column prop="id" label="#" width="50" :resizable="false" align="center" header-align="center" />

      <el-table-column prop="name" label="名称" width="250" :show-overflow-tooltip="true" />
      <el-table-column prop="order_no" label="排序" width="80" align="center" header-align="center" :resizable="false" />
      <el-table-column prop="status" label="状态" width="80" align="center" header-align="center" :resizable="false">
        <template v-slot="scope">
          <el-tag :type="scope.row.status === 0 ? '' : 'danger'" v-text="scope.row.status === 0 ? '正常' : '禁用'"></el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button plain style="vertical-align: middle;" text @click="updateRole(scope.row)" :icon="Edit">编辑</el-button>
          <el-popconfirm
              title="确定删除?"
              confirmButtonText="确定"
              cancelButtonText="取消"
              @confirm="deleteRole(scope.row)"
          >
            <template #reference>
              <el-button plain style="vertical-align: middle;" text :icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
          <el-button plain style="vertical-align: middle;" text @click.stop="relateMenu(scope.row)" :icon="Link">关联菜单</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>




</template>

<script lang="ts" setup>
import { computed, ref, inject, Ref, onBeforeMount } from "vue"
import {
  ElTable, ElTableColumn, ElTag, ElButton, ElPopconfirm,
} from "element-plus"
import {mainHeightKey, themeKey} from "@/config/app.keys";
import { Plus, Edit, Delete, Download, Link } from "@element-plus/icons-vue";
import { useRole } from "@/service/system/role";


const loading = ref<boolean>(true);

const mainHeight = inject(mainHeightKey)

const theme = inject<Ref<ThemeConfig>>(themeKey)


const dataTableHeight = computed<string>(() => {
  /**
   * 32px op height
   * 10px marginTop
   */
  return `calc(${mainHeight.value} - ${theme.value.mainPadding + theme.value.mainPadding + 32 + 10}px)`;
});

const { roleData, loadRole, deleteRoleByIds, deleteRoleById } = useRole(loading)
onBeforeMount(loadRole)

function addRole() {

}

function updateRole(role: RoleView) {

}

function deleteRole(role: RoleView) {
  deleteRoleById(role.id)
}

function relateMenu(role: RoleView) {

}

const tableRef = ref<InstanceType<typeof ElTable>>()
const selectedRoles = ref<RoleView[]>([])
function batchDeleteRole() {
  deleteRoleByIds(selectedRoles.value.map(it => it.id))
}

function handleRowClick(row) {
  tableRef.value.toggleRowSelection(row, undefined)
}

</script>

<style scoped>
.op-line {
  box-sizing: border-box;
  height: 32px;
}

.data-table {
  box-sizing: border-box;
  margin-top: 10px;
}

</style>