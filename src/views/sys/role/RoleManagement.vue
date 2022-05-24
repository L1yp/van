<template>

  <div class="op-line">
    <el-input style="width: 200px;" size="default" placeholder="菜单名称" v-model="roleTitleKey"></el-input>
    <el-button size="default" plain style="vertical-align: middle; margin-left: 12px;" type="primary" @click="addRole">
      <SVGIcon style="width: 1em; height: 1em" name="Plus"/><span style="margin-left: 4px;">新增</span>
    </el-button>

    <el-popconfirm
        title="确定删除?"
        confirmButtonText="确定"
        cancelButtonText="取消"
        @confirm="batchDeleteRole"
    >
      <template #reference>
        <el-button size="default" plain style="vertical-align: middle;" type="danger" :disabled="selectedRoles.length === 0">
          <SVGIcon style="width: 1em; height: 1em" name="Delete"/><span style="margin-left: 4px;">删除</span>
        </el-button>
      </template>
    </el-popconfirm>
    <el-button size="default" plain style="vertical-align: middle;" type="warning" @click="addRole">
      <SVGIcon style="width: 1em; height: 1em" name="Delete"/><span style="margin-left: 4px;">导出</span>
    </el-button>
  </div>

  <div class="data-table">
    <el-table
        v-loading="loading"
        v-permission="111"
        row-key="id"
        :data="filterTableData"
        :height="dataTableHeight"
        style="width: 100%"
        table-layout="auto"
        :stripe="true"
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" header-align="center" />
      <el-table-column prop="id" label="#" width="50" />

      <el-table-column prop="name" label="名称" width="150" :show-overflow-tooltip="true" />
      <el-table-column prop="order_no" label="排序" width="80" />
      <el-table-column prop="status" label="状态" width="80">
        <template v-slot="scope">
          <el-tag :type="scope.row.status === 0 ? '' : 'danger'" v-text="scope.row.status === 0 ? '正常' : '禁用'"></el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button plain style="vertical-align: middle;" text @click="addRole(scope.row)">
            <SVGIcon style="width: 1em; height: 1em" name="Plus"/><span style="margin-left: 4px;">新增</span>
          </el-button>
          <el-button plain style="vertical-align: middle;" text @click="editRole(scope.row)">
            <SVGIcon style="width: 1em; height: 1em" name="Edit"/><span style="margin-left: 4px;">编辑</span>
          </el-button>
          <el-popconfirm
              title="确定删除?"
              confirmButtonText="确定"
              cancelButtonText="取消"
              @confirm="delRole(scope.row)"
          >
            <template #reference>
              <el-button plain style="vertical-align: middle;" text>
                <SVGIcon style="width: 1em; height: 1em" name="Delete"/><span style="margin-left: 4px;">删除</span>
              </el-button>
            </template>
          </el-popconfirm>
          <el-button plain style="vertical-align: middle;" text @click="relateMenu(scope.row)">
            <SVGIcon style="width: 1em; height: 1em" name="Menu"/><span style="margin-left: 4px;">关联菜单</span>
          </el-button>
          <el-button plain style="vertical-align: middle;" text @click="relatePermission(scope.row)">
            <SVGIcon style="width: 1em; height: 1em" name="Menu"/><span style="margin-left: 4px;">关联权限</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>

  <role-menu-table
    :title="roleMenuDialogTitle"
    v-model:visible="menuDialogVisible"
    :role-id="curRoleId"
    :menu-options="menuOptions"
    :bound-menus="boundMenus"
    @confirm="confirmMenuDialog"
    @cancel="menuDialogVisible = false"
  />

  <role-permission-table
    :title="rolePermissionDialogTitle"
    v-model:visible="permissionDialogVisible"
    v-model:permissionIds="boundPermissionIds"
    :role-id="curRoleId"
    :permission-data="permissionTreeData"
    @confirm="confirmPermissionDialog"
    @cancel="permissionDialogVisible = false"
  />

  <el-dialog v-model="dialogFormVisible" :title="dialogTitle" width="500px" draggable custom-class="user-ext-dialog">
    <el-form :model="dialogFormData" size="default">
      <el-row>
        <el-col :span="24">
          <el-form-item v-if="dialogTitle === '编辑角色'" label="角色ID" :label-width="80">
            <el-input disabled v-model="dialogFormData.id">111</el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="角色名称" :label-width="80">
            <el-input v-model="dialogFormData.name" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色排序" :label-width="80">
            <el-input v-model="dialogFormData.orderNo" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="default" @click="dialogFormVisible = false">取消</el-button>
        <el-button size="default" type="primary" @click="confirmDialog">确定</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script lang="ts" setup>
import {computed, onMounted, ref, inject, Ref} from "vue"
import {
  ElTable, ElTableColumn, ElForm, ElTag,
  ElFormItem, ElInput, ElRow, ElButton,
  ElCol, ElDialog, ElMessage, ElPopconfirm,
} from "element-plus"
import * as RoleApi from "@/api/sys/role"
import SVGIcon from "@/components/common/SVGIcon.vue";
import RoleMenuTable from "./dialog/RoleMenuBind.vue"
import RolePermissionTable from "./dialog/RolePermissionBind.vue"
import {buildPermissionTree} from "./index"
import * as MenuApi from "@/api/sys/menu";
import * as PermissionApi from "@/api/sys/permission";
import * as UserApi from "@/api/sys/user";
import {installLayoutContentRoute} from "@/router"
import {mainHeightKey, menuOptionsKey, themeKey} from "@/config/app.keys";

interface RoleForm {
  id: number;
  name: string;
  orderNo: number;
}

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

const roles: Ref<RoleView[]> = ref<RoleView[]>([]);

const roleTitleKey: Ref<string> = ref<string>("");

const filterTableData = computed<RoleView[]>(() => {
  if (roleTitleKey.value) {
    return roles.value.filter(it => it.name.indexOf(roleTitleKey.value) > -1);
  }
  return roles.value;
});

const dialogTitle = ref<string>("");

const emptyView = {
  id: 0,
  name: "",
  orderNo: 0
}

const dialogFormData = ref<RoleForm>(emptyView);

const dialogFormVisible = ref<boolean>(false);

function searchRoleList() {
  loading.value = true;
  RoleApi.findRole().then(data => {
    roles.value = data;
  }).catch((e) => {
    ElMessage.error("新增失败：" + e.message);
  }).finally(() => {
    loading.value = false
  });
}


function confirmDialog() {

  if (dialogTitle.value === "新增角色") {
    RoleApi.addRole(dialogFormData.value.name, dialogFormData.value.orderNo).then(data => {
      // reload role list
      searchRoleList();
      ElMessage.success("新增成功");
    }).catch((e) => {
      ElMessage.error("新增失败：" + e.message);
    }).finally(() => dialogFormVisible.value = false);
  } else if (dialogTitle.value === "编辑角色") {
    RoleApi.editRole(dialogFormData.value.id, dialogFormData.value.name, dialogFormData.value.orderNo)
    .then(data => {
      // reload role list
      searchRoleList();
      ElMessage.success("修改成功");
    }).catch((e) => {
      ElMessage.error("修改失败：" + e.message);
    }).finally(() => dialogFormVisible.value = false);
  }
}

function addRole(role) {
  dialogTitle.value = "新增角色";
  if (role) {
    dialogFormData.value.id = 0;
    dialogFormData.value.name = role.name;
    dialogFormData.value.orderNo = role.orderNo;
  }
  dialogFormVisible.value = true;
}

function editRole(role) {
  dialogTitle.value = "编辑角色";
  dialogFormData.value.id = role.id;
  dialogFormData.value.name = role.name;
  dialogFormData.value.orderNo = role.order_no;
  dialogFormVisible.value = true;
}

function delRole(role) {
  RoleApi.delRole(role.id).then(data => {
    searchRoleList();
    ElMessage.success("删除成功");
  }).catch(e => {
    ElMessage.error("删除失败：" + e.message);
  });
}

// const menuOptions = inject("menuOptions");

/* 角色关联操作开始  */
const menuDialogVisible = ref(false); // 由于props传值会把普通类型 消除 响应式 因此需要包装成对象传值
const boundMenus = ref([]);
const menuOptions = ref([]);
const curRoleId = ref(0);
const roleMenuDialogTitle = ref<string>("");
async function relateMenu(role) {
  try {
    // find bound menu ids
    curRoleId.value = role.id;
    menuOptions.value = await MenuApi.findMenu();
    boundMenus.value = await RoleApi.menuBound(role.id);
    roleMenuDialogTitle.value = `【${role.name}】 绑定菜单`
    menuDialogVisible.value = true;
  } catch (e) {
    console.log(e)
  }
}

/* 角色关联操作开始  */
const permissionDialogVisible = ref(false); // 由于props传值会把普通类型 消除 响应式 因此需要包装成对象传值
const boundPermissionIds = ref<number[]>([]);
const permissionTreeData = ref([]);

const rolePermissionDialogTitle = ref<string>("");
async function relatePermission(role) {
  try {
    // find bound menu ids
    curRoleId.value = role.id;
    menuOptions.value = await MenuApi.findMenu();
    const permissions = await PermissionApi.findAll();
    permissionTreeData.value = buildPermissionTree(menuOptions.value, permissions)
    boundPermissionIds.value = await RoleApi.permissionBound(role.id);
    rolePermissionDialogTitle.value = `【${role.name}】 分配权限`
    permissionDialogVisible.value = true;
  } catch (e) {
    console.log(e)
  }

}


const userMenuOptions = inject(menuOptionsKey)

async function confirmMenuDialog(roleId, selectedIds) {
  try {
    await RoleApi.bindMenu(roleId, selectedIds);
    const data = await UserApi.menu()
    userMenuOptions.value = data.menus

    installLayoutContentRoute(data.menus);
    menuDialogVisible.value = false;
    ElMessage.success("绑定成功");
  } catch (e) {
    console.log(e)
    ElMessage.error("绑定失败：" + e.message);
  }

}

async function confirmPermissionDialog(roleId, selectedIds) {
  try {
    await RoleApi.bindPermission(roleId, selectedIds);
    // TODO: reload permissions
    ElMessage.success("绑定成功");
  } catch (e) {
    console.log(e)
    ElMessage.error("绑定失败：" + e.message);
  }
}

const selectedRoles = ref([]);
function handleSelectionChange(roles) {
  selectedRoles.value = roles;
}

function batchDeleteRole() {
  if (selectedRoles.value.length === 0) {
    return;
  }

  const ids = selectedRoles.value.map(it => it.id).join(",");
  RoleApi.batchDelRole(ids).then(data => {
    searchRoleList();
    ElMessage.success("删除成功");
  }).catch(e => {
    ElMessage.error("删除失败：" + e.message);
  });
}

onMounted(() => {
  searchRoleList();
});

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