<template>
  <div class="container">
    <div class="op-line">
      <el-button size="default" plain style="vertical-align: middle;" type="primary" @click="addPermission">
        <SVGIcon style="width: 1em; height: 1em" name="Plus"/><span style="margin-left: 4px;">新增</span>
      </el-button>
      <el-popconfirm
        title="确定删除?"
        confirmButtonText="确定"
        cancelButtonText="取消"
        @confirm="batchDeletePermission"
      >
        <template #reference>
          <el-button size="default" plain style="vertical-align: middle;" type="danger" :disabled="selectedPermissionRows.length === 0">
            <SVGIcon style="width: 1em; height: 1em" name="Delete"/><span style="margin-left: 4px;">删除</span>
          </el-button>
        </template>
      </el-popconfirm>
      <el-button size="default" plain style="vertical-align: middle" type="warning" @click="exportPermissionTable">
        <SVGIcon style="width: 1em; height: 1em" name="Download"/><span style="margin-left: 4px;">导出</span>
      </el-button>
    </div>

    <div class="data-table">
      <el-table
        ref="permissionTableRef"
        v-loading="permissionTableLoading"
        :data="permissionTableData"
        :height="permissionTableHeight" stripe
        @selection-change="handlePermissionSelectChange"
        :row-style="{cursor: 'pointer'}"
        highlight-current-row
        current-row-key="id"
        row-key="id"
        @row-click="handlePermissionRowClick"
      >
        <el-table-column type="selection" width="50"/>
        <el-table-column label="_" prop="id" width="50"/>
        <el-table-column label="标识" prop="ident" width="150" align="center"/>
        <el-table-column label="界面" prop="owner_menu_id" width="150">
          <template #default="scope">
            <el-tag v-text="readParentChainPath(scope.row.owner_menu_id)"></el-tag>
          </template>
        </el-table-column>>
        <el-table-column fixed="right" label="操作" width="126">
          <template #default="scope">
            <el-tooltip
              effect="dark"
              content="新增"
              placement="top"
            >
              <el-button size="small" plain style="vertical-align: middle" text @click.stop="addPermission(scope.row)">
                <SVGIcon style="width: 1em; height: 1em" name="Plus"/>
              </el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="编辑"
              placement="top"
            >
              <el-button size="small" plain style="vertical-align: middle" text @click.stop="updatePermission(scope.row)">
                <SVGIcon style="width: 1em; height: 1em" name="Edit"/>
              </el-button>
            </el-tooltip>
            <el-popconfirm
              title="确定删除?"
              confirmButtonText="确定"
              cancelButtonText="取消"
              @confirm.stop="deletePermission(scope.row)"
            >
              <template #reference>
                <el-button size="small" plain style="vertical-align: middle" text @click.stop>
                  <SVGIcon style="width: 1em; height: 1em" name="Delete"/>
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <el-dialog v-model="dialogVisible" :title="dialogTitle" :draggable="true" :append-to-body="true" custom-class="user-ext-dialog" width="400px">
    <el-form ref="permissionFormRef" :model="permissionFormData" status-icon size="default">
      <el-row>
        <el-col :span="24">
          <el-form-item label="标识" prop="ident" required>
            <el-input v-model="permissionFormData.ident"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="24">
          <el-form-item label="界面" prop="owner_menu_id" required>
            <el-cascader
              v-model="selectedMenuIds"
              :options="menuOptions"
              :props="{value: 'id', label: 'title', checkStrictly: true}"
              placeholder="菜单界面" style="width: 100%">
            </el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="default" @click="dialogVisible = false">取消</el-button>
        <el-button size="default" type="primary" @click="handlePermissionDialogConfirm">确定</el-button>
      </span>
    </template>

  </el-dialog>


</template>

<script lang="ts" setup>
import {ref, computed, onMounted, inject,} from "vue"
import SVGIcon from "@/components/common/SVGIcon.vue"
import {
  ElTable, ElButton, ElTableColumn, ElPopconfirm, ElDialog, ElTooltip,
  ElForm, ElFormItem, ElRow, ElCol, ElInput, ElMessage, ElCascader, ElTag
} from "element-plus"
import {mainHeightKey, themeKey} from "@/config/app.keys"
import * as PermissionApi from "@/api/sys/permission"
import * as MenuApi from "@/api/sys/menu"

const permissionTableLoading = ref<boolean>(false)
const permissionTableRef = ref<InstanceType<typeof ElTable>>()
const permissionTableData = ref<PermissionView[]>([])
const permissionFormRef = ref<InstanceType<typeof ElForm>>()

const mainHeight = inject(mainHeightKey)
const theme = inject(themeKey)

const permissionTableWidth = "546px";

const permissionTableHeight = computed(() => {
  return `calc(${mainHeight.value} - ${theme.value.mainPadding * 2 + 42 + 20}px)`
})

const selectedPermissionRows = ref([])

function handlePermissionSelectChange(selectedRows) {
  selectedPermissionRows.value = selectedRows;
}

function handlePermissionRowClick(row: any) {
  // TODO: improvement typing when refactor table
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  permissionTableRef.value.toggleRowSelection(row)
}

const dialogVisible = ref(false)
const dialogTitle = ref("")
const permissionFormData = ref<PermissionView>({
  id: 0,
  ident: "",
  owner_menu_id: 0,
})
const menuOptions = ref<MenuConfig[]>([])
const flatMenuOptions = []
const menuMap = new Map()
const selectedMenuIds = ref([])

/**
 * 加载菜单选项
 * TODO: 菜单更新后 记得重载
 */
async function loadMenuOption() {
  if (menuOptions.value.length === 0) {
    menuOptions.value = await MenuApi.findMenu()
    const tmp = JSON.parse(JSON.stringify(menuOptions.value))
    while (flatMenuOptions.length > 0) {
      flatMenuOptions.pop()
    }
    treeToList(tmp, flatMenuOptions)
    flatMenuOptions.map(it => [it.id, it]).forEach(([k, v]) => menuMap.set(k, v))
    console.log("menuMap", menuMap)
  }
}

/**
 * 添加权限
 * @param row
 */
async function addPermission(row: PermissionView | Event) {
  await loadMenuOption()
  console.log(menuOptions.value)
  dialogTitle.value = "新增权限标识"
  if (row && !(row instanceof Event)) {
    Object.assign(permissionFormData.value, row)
    permissionFormData.value.id = undefined
    selectedMenuIds.value = readParentIdChain(flatMenuOptions, menuMap.get(row.owner_menu_id))

  }
  dialogVisible.value = true;
}

/**
 * 更新权限
 * @param row
 */
async function updatePermission(row: PermissionView | Event) {
  await loadMenuOption()
  dialogTitle.value = "更新权限标识"
  if (row && !(row instanceof Event)) {
    Object.assign(permissionFormData.value, row)
    selectedMenuIds.value = readParentIdChain(flatMenuOptions, menuMap.get(row.owner_menu_id))
  }
  dialogVisible.value = true;
}

async function handlePermissionDialogConfirm() {
  if (selectedMenuIds.value && selectedMenuIds.value.length === 0) {
    ElMessage.error(`请先选择所属界面`)
    return;
  }

  const command = dialogTitle.value.substring(0, 2)
  try {
    const validRet = await permissionFormRef.value.validate();
    console.log("validRet", validRet)

    if (dialogTitle.value.startsWith("新增")) {
      permissionFormData.value.id = undefined
      permissionFormData.value.owner_menu_id = selectedMenuIds.value[selectedMenuIds.value.length - 1]
      await PermissionApi.addPermission(permissionFormData.value)
    } else {
      await PermissionApi.updatePermission(permissionFormData.value)
    }
    await loadPermissionTableData()
    ElMessage.info(`${command}成功`)
  } catch (e: any) {
    if (e instanceof Error) {
      ElMessage.error(`${command}失败, 错误信息: ${e.message ?? "表单校验失败"}`)
    } else {
      console.log(`${command}失败`, e)
      ElMessage.error(`${command}失败`)
    }
  } finally {
    dialogVisible.value = false
  }
}

async function deletePermission(row) {
  try {
    await PermissionApi.delPermission(row.id)
    await loadPermissionTableData()
    ElMessage.info("删除成功")
  } catch (e: any) {
    if (e instanceof Error) {
      ElMessage.error(`删除失败失败, 错误信息: ${e.message}`)
    } else {
      console.log(`删除失败`, e)
      ElMessage.error(`删除失败`)
    }
  }
}

async function batchDeletePermission() {
  if (selectedPermissionRows.value && selectedPermissionRows.value.length > 0) {
    const ids = selectedPermissionRows.value.map(it => it.id).join()
    try {
      await PermissionApi.batchDelPermission(ids)
      await loadPermissionTableData()
      ElMessage.info("删除成功")
    } catch (e: any) {
      if (e instanceof Error) {
        ElMessage.error(`删除失败,错误信息:${e.message}`)
      } else {
        console.log("删除失败", e)
        ElMessage.error(`删除失败`)
      }
    }
  }
}


async function loadPermissionTableData() {
  permissionTableLoading.value = true
  permissionTableData.value = await PermissionApi.findAll();
  permissionTableLoading.value = false
}

onMounted(async () => {
  await loadMenuOption()
  await loadPermissionTableData()
})



function exportPermissionTable() {

}

/**
 * 菜单树扁平化
 * @param menus
 * @param container
 */
function treeToList(menus: MenuConfig[], container: MenuConfig[]): void {
  for (const menu of menus) {
    container.push(menu)
    if (menu.children && menu.children.length > 0) {
      treeToList(menu.children, container)
    }
  }
}

/**
 * 获取当前行的路径(包括当前行)
 * @param list
 * @param row
 */
function readParentIdChain(list: MenuConfig[], row: MenuConfig): number[] {

  const map = new Map<number, MenuConfig>(list.map(key => [key.id, key]));
  const result = [row.id]
  let pid = row.pid
  while (pid !== 0) {
    const item = map.get(pid)
    result.push(item.id)
    pid = item.pid
  }

  return result.reverse()
}

function readParentChainPath(owner_menu_id: number): string {
  if (!owner_menu_id) return null
  const IdChain = readParentIdChain(flatMenuOptions, menuMap.get(owner_menu_id))
  return IdChain.map(it => menuMap.get(it).title).join(" / ")
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

.container {
  box-sizing: border-box;
  width: v-bind(permissionTableWidth);
  background-color: #FFFFFF;
  padding: 10px;
  transition: .3s;
}

.container:hover {
  box-shadow: 0 0 12px rgba(0, 0, 0, .12);
}

:deep(.el-form-item.is-success .el-input__validateIcon) {
  color: green;
}
</style>