<template>

  <div style="width: 100%; height: 100%;">
    <div>
      <el-button plain type="primary" @click="handleCreateRole" :icon="Plus">新增</el-button>

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

    <div style="width: 100%; height: calc(100% - 32px - 10px); margin-top: 10px">
      <el-table
        v-loading="loading"
        ref="tableRef"
        row-key="id"
        :data="roleData"
        height="100%"
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
            <el-button plain style="vertical-align: middle;" text @click.stop="handleUpdateRole(scope.row)" :icon="Edit">编辑</el-button>
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
            <el-button plain text @click.stop="openPermissionPanel('ENTITY', scope.row)" :icon="Link">实体权限</el-button>
            <el-button plain text @click.stop="openPermissionPanel('WORKFLOW', scope.row)" :icon="Link">流程权限</el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>

    <RoleCreateModal v-model="roleCreateModalVisible" :mode="roleCreateModalMode" :init-data="updateRoleItem" @confirm="handleCreateModalConfirm" />
    <RoleMenuBindModal v-model="bindModalVisible" :menu-options="menuTree" :select-ids="selectIds" @confirm="handleConfirmBind" />

    <MaskWindow v-model="permissionVisible">
      <PermissionEntity :role-id="selectRole.id" />
    </MaskWindow>

  </div>

</template>

<script lang="ts" setup>
import { ref, onBeforeMount } from "vue"
import {
  ElTable, ElTableColumn, ElTag, ElButton, ElPopconfirm,
} from "element-plus"
import { Plus, Edit, Delete, Download, Link } from "@element-plus/icons-vue";
import { useRole } from "@/service/system/role";
import RoleCreateModal from "@/views/sys/role/modal/RoleCreateModal.vue";
import { useMenuData } from "@/service/system/menu";
import RoleMenuBindModal from "@/views/sys/role/modal/RoleMenuBindModal.vue";
import MaskWindow from "@/components/dialog/MaskWindow.vue";
import PermissionEntity from "@/views/sys/role/permission/PermissionEntity.vue";


const loading = ref<boolean>(true);
const { roleData, loadRole, deleteRoleByIds, deleteRoleById, addRole, updateRole, boundMenu, bindMenu } = useRole(loading)
onBeforeMount(loadRole)

const roleCreateModalVisible = ref<boolean>(false)
const roleCreateModalMode = ref<'create' | 'update'>('create')
const updateRoleItem = ref<RoleView>()
function handleCreateRole() {
  roleCreateModalMode.value = 'create'
  updateRoleItem.value = null
  roleCreateModalVisible.value = true
}

function handleUpdateRole(role: RoleView) {
  roleCreateModalMode.value = 'update'
  updateRoleItem.value = role

  roleCreateModalVisible.value = true
}

function handleCreateModalConfirm(formData: RoleUpdateParam) {
  let promise = null
  if (roleCreateModalMode.value === 'create') {
    promise = addRole(formData)
  } else {
    promise = updateRole(formData)
  }
  promise.then(_ => roleCreateModalVisible.value = false)
}

function deleteRole(role: RoleView) {
  deleteRoleById(role.id)
}

const { menuTree, loadMenuTree } = useMenuData(loading)
onBeforeMount(loadMenuTree)
const menuOptions = ref<MenuView[]>([])
const bindModalVisible = ref<boolean>(false)
const selectRole = ref<RoleView>()
const selectIds = ref<string[]>([])

function relateMenu(role: RoleView) {
  selectRole.value = role

  boundMenu(role.id)
    .then(menuIds => selectIds.value = menuIds)
    .then(_ => bindModalVisible.value = true)
}

function handleConfirmBind(rows: MenuView[]) {
  const menuIds = rows.map(it => it.id)
  bindMenu({
    role_id: selectRole.value.id,
    menu_ids: menuIds
  }).then(_ => bindModalVisible.value = false)
}

const tableRef = ref<InstanceType<typeof ElTable>>()
const selectedRoles = ref<RoleView[]>([])
function batchDeleteRole() {
  deleteRoleByIds(selectedRoles.value.map(it => it.id))
}

function handleRowClick(row) {
  tableRef.value.toggleRowSelection(row, undefined)
}

const permissionVisible = ref(false)
const permModule = ref<FieldModule>()
function openPermissionPanel(module: FieldModule, role: RoleView) {
  selectRole.value = role
  permModule.value = module
  permissionVisible.value = true
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