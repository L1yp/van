<template>
  <div>
    <div class="op-line">
      <el-input style="width: 200px" size="default" placeholder="菜单名称" v-model="menuTitleKey"></el-input>
      <el-button size="default" plain style="vertical-align: middle; margin-left: 12px" type="info" @click="expendMenu">
        <SVGIcon style="width: 1em; height: 1em" name="Expand" /><span style="margin-left: 4px">展开</span>
      </el-button>
      <el-button size="default" plain style="vertical-align: middle" type="info" @click="shrinkMenu">
        <SVGIcon style="width: 1em; height: 1em" name="Shrink" /><span style="margin-left: 4px" >收缩</span>
      </el-button>
      <el-button size="default" plain style="vertical-align: middle" type="primary" @click="addMenu" :icon="Plus">新增</el-button>
      <el-popconfirm title="确定删除?" confirmButtonText="确定" cancelButtonText="取消" @confirm="batchDeleteMenu">
        <template #reference>
          <el-button size="default" plain style="vertical-align: middle" type="danger" :disabled="selectedMenus.length === 0" :icon="Delete">删除</el-button>
        </template>
      </el-popconfirm>
      <el-button size="default" plain style="vertical-align: middle" type="warning" @click="exportMenu" :icon="Download">导出</el-button>
    </div>

    <div class="data-table">
      <el-table
        v-loading="loading"
        ref="tableRef"
        :height="dataTableHeight"
        :data="filterMenuList"
        style="width: 100%"
        row-key="id"
        stripe border
        :tree-props="{ children: 'children' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" header-align="center" width="60"/>
        <el-table-column prop="name" align="left" header-align="left" label="标题" width="150"/>
        <el-table-column align="center" header-align="center" label="#" type="index" width="50"/>
        <el-table-column prop="icon" align="center" header-align="center" label="图标" width="60">
          <template #default="scope">
            <el-icon>
              <SVGIcon :name="scope.row.icon" />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="type" align="left" header-align="left" label="类型" width="100"/>
        <el-table-column prop="path" align="left" header-align="left" label="路由" width="300"/>
        <el-table-column prop="component" align="left" header-align="left" label="组件" width="300"/>
        <el-table-column prop="closeable" align="center" header-align="center" label="允许关闭" width="120">
          <template #default="scope">
            <el-tag>{{ scope.row.closeable ? '是' : '否' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="state" align="center" header-align="center" label="允许关闭" width="120">
          <template #default="scope">
            <el-tag>{{ scope.row.state === 0 ? '正常' : '禁用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button plain style="vertical-align: middle" text :icon="Edit" @click="editMenu(scope.row)">编辑</el-button>
            <el-popconfirm title="确定删除?" confirmButtonText="确定" cancelButtonText="取消" @confirm="delMenu(scope.row)">
              <template #reference>
                <el-button plain style="vertical-align: middle" text :icon="Delete">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <MenuCreateModal v-model="createModalVisible" :mode="createModalMode" :menu-tree="menuTree" @confirm="handleConfirm" :init-data="createModalInitData"  />
  </div>

</template>

<script lang="ts" setup>
import {
  computed,
  inject,
  nextTick,
  Ref,
  ref,
  onBeforeMount, toRaw,
} from "vue";
import SVGIcon from "@/components/common/SVGIcon.vue";
import {
  ElButton,
  ElIcon,
  ElInput,
  ElMessage,
  ElPopconfirm,
  ElTable,
  ElTableColumn,
  ElTag,
} from "element-plus";
import * as MenuApi from "@/api/sys/menu";
import { filterDataWithTitle } from "@/utils/common";
import { mainHeightKey, themeKey } from "@/config/app.keys";
import { useMenuData } from "@/service/system/menu";
import { Plus, Edit, Delete, Download, } from "@element-plus/icons-vue";
import MenuCreateModal from "./modal/MenuCreateModal.vue";

const loading = ref(true);
const tableRef = ref<InstanceType<typeof ElTable>>()

const mainHeight = inject(mainHeightKey)
const theme = inject(themeKey);

const dataTableHeight = computed<string>(() => {
  /**
   * 32px op height
   * 10px marginTop
   */
  const height = `calc(${mainHeight.value} - ${
    theme.value.mainPadding + theme.value.mainPadding + 32 + 10
  }px)`;
  console.log("height", height);
  return height;
});

const { menuTree, loadMenuTree } = useMenuData(loading)
onBeforeMount(loadMenuTree)

const menuTitleKey = ref("")
const createModalVisible = ref<boolean>(false)
const createModalMode = ref<'create' | 'update'>('create')
const createModalInitData = ref<MenuView>()

const filterMenuList = computed<MenuView[]>(() => {
  if (!menuTitleKey.value) {
    return menuTree.value
  }
  const result: MenuView[] = [];
  filterDataWithTitle(
    result,
    menuTree.value,
    menuTitleKey.value,
    "name",
    undefined
  );
  if (result.length > 0) nextTick(() => expandOrShrinkAll(result, true));
  return result;
});

function addMenu() {
  createModalMode.value = 'create'
  createModalVisible.value = true
}

function editMenu(menu: MenuView) {
  createModalInitData.value = toRaw(menu)
  createModalMode.value = 'update'
  createModalVisible.value = true

}

async function handleConfirm(param: MenuAddParam | MenuUpdateParam) {
  try {
    loading.value = true
    if (createModalMode.value === 'create') {
      await MenuApi.addMenu(param)
    } else {
      await MenuApi.updateMenu(param as MenuUpdateParam)
    }

    await loadMenuTree()
    ElMessage.success('操作成功')
  } catch (e) {
    console.error(e)
    ElMessage.error((e as Error)?.message || '操作成功')
  } finally {
    loading.value = false
    createModalVisible.value = false
  }
}

async function delMenu(row?: MenuView) {
  try {
    await MenuApi.delMenu(row.id)
    await loadMenuTree()
    ElMessage.success("删除成功")
  } catch (e) {
    console.error(e);
    ElMessage.error((e as Error)?.message || "删除失败")
  }
}

function exportMenu() {}

function expendMenu() {
  expandOrShrinkAll(filterMenuList.value, true);
}

function shrinkMenu() {
  expandOrShrinkAll(filterMenuList.value, false);
}

function expandOrShrinkAll(list: MenuView[], expanded: boolean) {
  for (let item of list) {
    if (item.children && item.children.length > 0) {
      tableRef.value?.toggleRowExpansion(item, expanded);
      if (item.children && item.children.length > 0) {
        expandOrShrinkAll(item.children, expanded);
      }
    }
  }
}

const selectedMenus: Ref<MenuView[]> = ref<MenuView[]>([])
function handleSelectionChange(menus: MenuView[]) {
  selectedMenus.value = menus;
}

async function batchDeleteMenu() {
  const selectionRows: MenuView[] = tableRef.value.getSelectionRows();
  const ids: string[] = selectionRows.map((it) => it.id);
  console.log("selected ids", ids);
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

:deep(div.el-table__header-wrapper .el-table-column--selection div.cell) {
  display: none;
}
</style>
