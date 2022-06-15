<template>

  <div style="display: flex; align-items: flex-start">
    <div class="dept-aside">
      <el-scrollbar :height="deptTreeHeight" style="background-color: #fff">
        <el-tree style="height: 100%; overflow: auto" :default-expand-all="true" v-loading="treeLoading" :data="deptTreeData" :props="deptTreeProps" @node-click="handleTreeNodeClick" />
      </el-scrollbar>
    </div>
    <div class="main-content">
      <div class="op-line">
        <el-input
          style="width: 200px"
          placeholder="昵称"
          v-model="nickKey"
        ></el-input>

        <el-button type="primary" style="vertical-align: middle; margin-left: 12px;">
          <SVGIcon style="width: 1em; height: 1em" name="Search"/><span style="margin-left: 4px;">搜索</span>
        </el-button>

        <el-button style="vertical-align: middle; " type="primary" @click="addUser">
          <SVGIcon style="width: 1em; height: 1em" name="Plus"/><span style="margin-left: 4px;">新增</span>
        </el-button>
        <el-popconfirm
          title="确定删除?"
          confirmButtonText="确定"
          cancelButtonText="取消"
          @confirm="batchDeleteUser"
        >
          <template #reference>
            <el-button plain style="vertical-align: middle" type="danger" :disabled="selectedUsers.length === 0">
              <SVGIcon style="width: 1em; height: 1em" name="Delete"/><span style="margin-left: 4px;">删除</span>
            </el-button>
          </template>
        </el-popconfirm>
        <el-button plain style="vertical-align: middle" type="warning" @click="exportUser">
          <SVGIcon style="width: 1em; height: 1em" name="Download"/><span style="margin-left: 4px;">导出</span>

        </el-button>
      </div>

      <div class="data-table">
        <el-table
          v-loading="loading"
          ref="tableRef"
          :height="dataTableHeight"
          :data="userData"
          style="width: 100%"
          row-key="id"
          stripe
          @selection-change="handleSelectionChange"
          :row-style="{cursor: 'pointer'}"
          @row-click="handleRowClick"
        >
          <el-table-column type="selection" align="center" header-align="center"/>
          <el-table-column prop="id" label="#"
                           align="center"
                           header-align="center"
                           width="50"
          />
          <el-table-column prop="avatar" label="头像" width="80" align="left" header-align="left">
            <template #default="scope">
              <el-avatar
                style="vertical-align: middle"
                shape="circle"
                :size="24"
                fit="cover"
                :src="scope.row.avatar"
              >
              </el-avatar>
            </template>
          </el-table-column>
          <el-table-column prop="username" label="用户名(工号)"
                           align="left"
                           header-align="left"
                           width="120"
          />
          <el-table-column prop="nickname" label="昵称" width="100"/>
          <el-table-column prop="phone" label="手机" width="120"/>
          <el-table-column prop="email" label="邮箱" width="150"/>
          <el-table-column prop="status" label="状态"
                           align="center"
                           header-align="center"
                           width="80"
          >
            <template #default="scope">
              <el-tag :type="scope.row.status === 0 ? '' : 'danger'" v-text="scope.row.status === 0 ? '正常' : '禁用'"></el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button plain style="vertical-align: middle" text @click.stop="addUser(scope.row)">
                <SVGIcon style="width: 1em; height: 1em" name="Plus"/><span style="margin-left: 4px;">新增</span>
              </el-button>
              <el-button plain style="vertical-align: middle" text @click.stop="editUser(scope.row)">
                <SVGIcon style="width: 1em; height: 1em" name="Edit"/><span style="margin-left: 4px;">编辑</span>
              </el-button>
              <el-button plain style="vertical-align: middle" text @click.stop="relateRole(scope.row)">
                <SVGIcon style="width: 1em; height: 1em" name="relation"/><span style="margin-left: 4px;">角色</span>
              </el-button>
              <el-button plain style="vertical-align: middle" text @click.stop="relatePrimaryDept(scope.row)">
                <SVGIcon style="width: 1em; height: 1em" name="relation"/><span style="margin-left: 4px;">主部门</span>
              </el-button>
              <el-button plain style="vertical-align: middle" text @click.stop="relateDept(scope.row)">
                <SVGIcon style="width: 1em; height: 1em" name="relation"/><span style="margin-left: 4px;">兼职部门</span>
              </el-button>
              <el-popconfirm
                title="确定删除?"
                confirmButtonText="确定"
                cancelButtonText="取消"
                @confirm.stop="delUser(scope.row)"
              >
                <template #reference>
                  <el-button plain style="vertical-align: middle" text @click.stop>
                    <SVGIcon style="width: 1em; height: 1em" name="Delete"/><span style="margin-left: 4px;">删除</span>
                  </el-button>
                </template>
              </el-popconfirm>

            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>

  <v-dialog
    v-model="dialogFormVisible"
    :title="dialogTitle"
    draggable
    append-to-body
    @confirm="confirmDialog"
    @cancel="dialogFormVisible = false"
  >
    <el-form :model="dialogFormData" :label-width="80">
      <el-form-item v-if="dialogTitle === '编辑用户'" label="用户ID">
        <el-input disabled v-model="dialogFormData.id"></el-input>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="dialogFormData.username"></el-input>
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="dialogFormData.nickname"></el-input>
      </el-form-item>
      <el-form-item label="手机">
        <el-input v-model="dialogFormData.phone"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input type="text" v-model="dialogFormData.email"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="dialogFormData.status"></el-switch>
      </el-form-item>
    </el-form>
  </v-dialog>

  <role-selector
    v-model:visible="roleDialogVisible"
    :bound-role-ids="boundRoleIds"
    :role-data="roleUserData"
    @confirm="confirmRoleDialog"
    @cancel="roleDialogVisible = false"
  ></role-selector>

  <dept-selector
    title="选择主部门(红色：兼职部门)"
    :dept-data="partTimeDeptData"
    v-model:visible="primaryDeptDialogVisible"
    :bound-primary-dept-id="boundPrimaryDeptId"
    :bound-part-time-dept-ids="boundPartTimeDeptIds"
    @cancel="primaryDeptDialogVisible = false"
    @confirm="confirmPrimaryDeptDialog"
    :multiple="false"
  ></dept-selector>

  <dept-selector
    title="选择兼职部门(红色：主部门)"
    :dept-data="partTimeDeptData"
    v-model:visible="partTimeDeptDialogVisible"
    :bound-primary-dept-id="boundPrimaryDeptId"
    :bound-part-time-dept-ids="boundPartTimeDeptIds"
    @cancel="partTimeDeptDialogVisible = false"
    @confirm="confirmDeptDialog"
    :multiple="true"
  ></dept-selector>

</template>

<script lang="ts" setup>
import {computed, ComputedRef, inject, onBeforeMount, onMounted, Ref, ref} from "vue";
import {
  ElAvatar, ElButton, ElForm, ElFormItem, ElInput, ElMessage, ElPopconfirm,
  ElScrollbar, ElSwitch, ElTable, ElTableColumn, ElTag, ElTree
} from "element-plus";
import * as UserApi from "@/api/sys/user";
import * as DeptApi from "@/api/sys/dept";
import * as RoleApi from "@/api/sys/role";
import SVGIcon from "@/components/common/SVGIcon.vue"
import RoleSelector from "./dialog/RoleSelector.vue"
import DeptSelector from "./dialog/DeptSelector.vue"
import {mainHeightKey, mainWidthKey, themeKey} from "@/config/app.keys";
import VDialog from "@/components/dialog/VDialog.vue";

const deptTreeProps = {
  label: 'simple_name',
  children: 'children'
};

const deptTreeData = ref<DeptView[]>([]);

function handleTreeNodeClick(data, node, ev) {
  console.log("click node");
}

const treeLoading = ref<boolean>(true);
const loading = ref<boolean>(true);
const tableRef = ref<InstanceType<typeof ElTable>>(null);


const theme = inject<Ref<ThemeConfig>>(themeKey)
const mainWidth = inject<ComputedRef<string>>(mainWidthKey)
const mainHeight = inject<ComputedRef<string>>(mainHeightKey)

const deptTreeWidth = '300px'
const dataTableWidth = computed<string>(() => `calc(${mainWidth.value} - ${theme.value.mainPadding * 2 + 10}px - ${deptTreeWidth})`)
/**
 * 32: op-line
 * 10: marginTop
 */
const dataTableHeight = computed<string>(() => `calc(${mainHeight.value} - ${theme.value.mainPadding * 2 + 32 + 10}px)`);
const deptTreeHeight = computed<string>(() => `calc(${mainHeight.value} - ${theme.value.mainPadding * 2}px)`);

const userData = ref<UserView[]>([]);

const nickKey = ref<string>("");
const dialogFormVisible = ref<boolean>(false);
const dialogFormData = ref({
  id: 0,
  username: '',
  nickname: '',
  password: '',
  phone: '',
  email: '',
  avatar: '',
});
const dialogTitle = ref<string>("");

async function confirmDialog() {
  const command = dialogTitle.value.substring(0, 2)
  try {
    if (dialogTitle.value === "新增用户") {
      const param: UserAddParam = {
        username: dialogFormData.value.username,
        password: dialogFormData.value.password,
        nickname: dialogFormData.value.nickname,
        phone: dialogFormData.value.phone,
        email: dialogFormData.value.email,
        avatar: dialogFormData.value.avatar,
      };
      await UserApi.addUser(param);
      ElMessage({
        message: "新增成功",
        type: "success"
      });
    } else if (dialogTitle.value === "编辑用户") {
      const param: UserUpdateParam = {
        id: dialogFormData.value.id,
        password: dialogFormData.value.password,
        nickname: dialogFormData.value.nickname,
        phone: dialogFormData.value.phone,
        email: dialogFormData.value.email,
        avatar: dialogFormData.value.avatar,
      };
      await UserApi.updateUser(param);
      ElMessage({
        message: "编辑成功",
        type: "success"
      });
    }
  } catch (e) {
    console.log(e)
    ElMessage({
      message: `${command}失败`,
      type: "error"
    });
  } finally {
    dialogFormVisible.value = false;
  }

}

function addUser(user) {

}

function editUser(user) {

}

const currentRowUid = ref<number>(0);

/* 角色关联操作开始  */
const roleDialogVisible = ref<boolean>(false);
const roleUserData = ref<RoleView[]>([]);
const boundRoleIds = ref<number[]>([]);

async function relateRole(user: UserView) {
  currentRowUid.value = user.id;
  try {
    boundRoleIds.value = await UserApi.findBoundRoles(currentRowUid.value);
    roleDialogVisible.value = true;
  } catch (e) {
    console.log(e)
    ElMessage({
      message: `查询角色绑定信息失败`,
      type: "error"
    });
  }
}

async function confirmRoleDialog(selectedIds: number[]) {
  try {
    await UserApi.bindRole(currentRowUid.value, selectedIds);
    ElMessage({
      message: `绑定成功`,
      type: "success"
    });
  } catch (e) {
    console.log(e)
    ElMessage({
      message: `绑定失败`,
      type: "error"
    })
  } finally {
    roleDialogVisible.value = false
  }
}
/* 角色关联操作结束  */


/* 兼职部门关联操作开始  */
const partTimeDeptDialogVisible = ref<boolean>(false);
const partTimeDeptData = ref<DeptView[]>([]);
const boundPartTimeDeptIds = ref<number[]>([]);


/**
 * 兼职部门绑定
 */
async function relateDept(user: UserView) {
  currentRowUid.value = user.id;
  try {
    boundPartTimeDeptIds.value = await UserApi.findBoundPartTimeDepartments(currentRowUid.value);
    boundPrimaryDeptId.value = await UserApi.findBoundPrimaryDepartments(currentRowUid.value);
    partTimeDeptDialogVisible.value = true;
  } catch (e) {
    console.log(e)
    ElMessage({
      message: '查询绑定信息失败',
      type: 'error'
    })
  }

}

async function confirmDeptDialog(selectedIds: number[]) {
  try {
    await UserApi.bindPartTimeDept(currentRowUid.value, selectedIds);
    ElMessage({
      message: "绑定成功",
      type: "success"
    });
  } catch (e) {
    console.error(e)
    ElMessage({
      message: "绑定失败",
      type: "error"
    });
  } finally {
    partTimeDeptDialogVisible.value = false;
  }

}
/* 部门关联操作结束  */

/* 主部门关联操作开始  */
const primaryDeptDialogVisible = ref<boolean>(false);
const boundPrimaryDeptId = ref<number>(0);

async function relatePrimaryDept(user) {
  currentRowUid.value = user.id;
  try {
    boundPartTimeDeptIds.value = await UserApi.findBoundPartTimeDepartments(currentRowUid.value);
    boundPrimaryDeptId.value = await UserApi.findBoundPrimaryDepartments(currentRowUid.value);
    primaryDeptDialogVisible.value = true;
  } catch (e) {
    console.log(e)
    ElMessage({
      message: '查询绑定信息失败',
      type: 'error'
    })
  }

}

async function confirmPrimaryDeptDialog(selectedId: number) {
  try {
    await UserApi.bindPrimaryDept(currentRowUid.value, selectedId);
    ElMessage({
      message: '绑定成功',
      type: 'success'
    })
  } catch (e) {
    ElMessage({
      message: '绑定失败',
      type: 'error'
    })
  } finally {
    primaryDeptDialogVisible.value = false;
  }
}
/* 部门关联操作结束  */


function delUser() {}

function exportUser() {}

const selectedUsers = ref<UserView[]>([]);

function handleSelectionChange(users: UserView[]) {
  selectedUsers.value = users;
}

function handleRowClick(row, column, event) {
  tableRef.value.toggleRowSelection(row, undefined);
}

function batchDeleteUser() {}

async function reloadTableData() {
  loading.value = true;
  const params: UserQueryParam = {
    pageIdx: 1,
    pageSize: 50
  };
  userData.value = await UserApi.pageUserList(params);
  loading.value = false;
}

async function reloadDeptTreeData() {
  treeLoading.value = true;
  const result = await DeptApi.findDept();
  deptTreeData.value = result;
  partTimeDeptData.value = result;
  treeLoading.value = false;

}

onBeforeMount(async () => {
  roleUserData.value = await RoleApi.findRole();
});

onMounted( () => {
  reloadTableData();
  reloadDeptTreeData();
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
  width: v-bind(dataTableWidth)
}

.dept-aside {
  width: v-bind(deptTreeWidth);
}

.main-content {
  margin-left: 10px;
}



</style>
