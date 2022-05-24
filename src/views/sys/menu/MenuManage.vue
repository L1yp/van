<template>
  <div class="op-line">
    <el-input style="width: 200px;" size="default" placeholder="菜单名称" v-model="menuTitleKey"></el-input>
    <el-button size="default" plain style="vertical-align: middle; margin-left: 12px;" type="info" @click="expendMenu">
      <SVGIcon style="width: 1em; height: 1em" name="Expand" /><span style="margin-left: 4px;">展开</span>
    </el-button>
    <el-button size="default" plain style="vertical-align: middle;" type="info" @click="shrinkMenu">
      <SVGIcon style="width: 1em; height: 1em" name="Shrink" /><span style="margin-left: 4px;">收缩</span>
    </el-button>
    <el-button size="default" plain style="vertical-align: middle;" type="primary" @click="addMenu">
      <SVGIcon style="width: 1em; height: 1em" name="Plus"/><span style="margin-left: 4px;">新增</span>
    </el-button
    >
    <el-popconfirm
        title="确定删除?"
        confirmButtonText="确定"
        cancelButtonText="取消"
        @confirm="batchDeleteMenu"
    >
      <template #reference>
        <el-button size="default" plain style="vertical-align: middle;" type="danger" :disabled="selectedMenus.length === 0">
          <SVGIcon style="width: 1em; height: 1em" name="Delete"/><span style="margin-left: 4px;">删除</span>
        </el-button>
      </template>
    </el-popconfirm>
    <el-button size="default" plain style="vertical-align: middle" type="warning" @click="exportMenu">
      <SVGIcon style="width: 1em; height: 1em" name="Delete"/><span style="margin-left: 4px;">导出</span>
    </el-button
    >
  </div>

  <div class="data-table">
    <el-table
        v-loading="loading"
        ref="tableRef"
        :height="dataTableHeight"
        :data="filterMenuList"
        style="width: 100%"
        row-key="id"
        :stripe="true"
        :tree-props="{ children: 'children'}"
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" header-align="center" width="60"/>
      <el-table-column
          prop="title"
          align="left"
          header-align="left"
          label="标题"
          width="150"
      />
      <el-table-column
          prop="id"
          align="center"
          header-align="center"
          label="#"
          width="50"
      />
      <el-table-column
          prop="icon"
          align="center"
          header-align="center"
          label="图标"
          width="60"
      >
        <template #default="scope">
          <el-icon>
            <SVGIcon :name="scope.row.icon"/>
          </el-icon>
        </template>
      </el-table-column>

      <el-table-column
          prop="name"
          align="left"
          header-align="left"
          label="路由名称"
          width="200"
      />
      <el-table-column
          prop="route"
          align="left"
          header-align="left"
          label="路由"
          width="300"
      />
      <el-table-column
          prop="close"
          align="center"
          header-align="center"
          label="允许关闭"
          width="80"
      >
        <template #default="scope">
          <dict-tag ident="yesno" :val="scope.row.close"></dict-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="hidden"
          align="center"
          header-align="center"
          label="隐藏"
          width="80"
      >
        <template #default="scope">
          <dict-tag ident="yesno" :val="scope.row.hidden"></dict-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button plain style="vertical-align: middle;" text @click="addMenu(scope.row)">
            <SVGIcon style="width: 1em; height: 1em" name="Plus"/><span style="margin-left: 4px;">新增</span>
          </el-button>
          <el-button plain style="vertical-align: middle;" text @click="addSubMenu(scope.row)">
            <SVGIcon style="width: 1em; height: 1em" name="Plus"/><span style="margin-left: 4px;">子菜单</span>
          </el-button>
          <el-button plain style="vertical-align: middle;" text @click="editMenu(scope.row)">
            <SVGIcon style="width: 1em; height: 1em" name="Edit"/><span style="margin-left: 4px;">编辑</span>
          </el-button>
          <el-popconfirm
              title="确定删除?"
              confirmButtonText="确定"
              cancelButtonText="取消"
              @confirm="delMenu(scope.row)"
          >
            <template #reference>
              <el-button plain style="vertical-align: middle;" text>
                <SVGIcon style="width: 1em; height: 1em" name="Delete"/><span style="margin-left: 4px;">删除</span>
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog v-model="dialogFormVisible" :title="dialogTitle" width="300px" :draggable="true" custom-class="user-ext-dialog">
    <el-form :model="dialogFormData" :label-width="80">
      <el-form-item v-if="dialogTitle === '编辑菜单'" label="菜单ID" >
        <el-input disabled v-model="dialogFormData.id"></el-input>
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="dialogFormData.title"></el-input>
      </el-form-item>
      <el-form-item label="路由名称">
        <el-input v-model="dialogFormData.name"></el-input>
      </el-form-item>
      <el-form-item label="路由">
        <el-input v-model="dialogFormData.route"></el-input>
      </el-form-item>
      <el-form-item label="图标">
        <el-input type="text" v-model="dialogFormData.icon">
          <template #suffix>
            <el-icon class="el-input__icon">
              <SVGIcon :name="dialogFormData.icon"></SVGIcon>
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="允许关闭">
        <dict-input ident="yesno" v-model="dialogFormData.close" :multiple="false"></dict-input>
      </el-form-item>
      <el-form-item label="隐藏">
        <dict-input ident="yesno" v-model="dialogFormData.hidden" :multiple="false"></dict-input>
      </el-form-item>
      <el-form-item label="父ID">
        <el-input type="number" :disabled="dialogTitle === '新增子菜单'" v-model="dialogFormData.pid"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmDialog">确定</el-button>
      </span>
    </template>
  </el-dialog>


</template>

<script lang="ts" setup>
import {computed, ComputedRef, inject, nextTick, onMounted, Ref, ref, unref, isRef} from "vue";
import SVGIcon from "@/components/common/SVGIcon.vue";
import {
  ElButton,
  ElDialog,
  ElForm,
  ElFormItem,
  ElIcon,
  ElInput,
  ElMessage,
  ElPopconfirm,
  ElSwitch,
  ElTable,
  ElTableColumn
} from "element-plus";
import * as MenuApi from "@/api/sys/menu";
import {filterDataWithTitle} from "@/utils/common"
import {mainHeightKey, themeKey} from "@/config/app.keys";
import DictInput from "@/components/dict/DictInput.vue";
import DictTag from "@/components/dict/DictTag.vue";

const loading = ref(true);
const tableRef = ref<InstanceType<typeof ElTable>>();

const mainHeight = inject<ComputedRef<string>>(mainHeightKey)
const theme = inject<Ref<ThemeConfig>>(themeKey)


const dataTableHeight = computed<string>(() => {
  /**
   * 32px op height
   * 10px marginTop
   */
  const height = `calc(${mainHeight.value} - ${theme.value.mainPadding + theme.value.mainPadding + 32 + 10}px)`;
  console.log("height", height);
  return height;
});


const menuData = ref<MenuConfig[]>([]);

const menuTitleKey = ref("");
const dialogFormVisible = ref(false);

const emptyView: MenuConfig = {
  id: 0,
  title: "",
  name: "",
  route: "",
  icon: "",
  close: 0,
  hidden: 0,
  pid: 0,
  children: [],
  has_children: false,
  parent: undefined,
};

const dialogFormData = ref<MenuConfig>(emptyView);
const dialogTitle = ref<string>("");


const filterMenuList = computed<MenuConfig[]>(() => {
  const result: MenuConfig[] = [];
  filterDataWithTitle(result, menuData.value, menuTitleKey.value, "title", undefined);
  if (result.length > 0) nextTick(() => expandOrShrinkAll(result, true));
  return result;
});


function addMenu(menu: MenuConfig) {
  dialogTitle.value = "新增菜单";
  if (menu) {
    dialogFormData.value.id = 0;
    dialogFormData.value.title = menu.title;
    dialogFormData.value.name = menu.name;
    dialogFormData.value.route = menu.route;
    dialogFormData.value.icon = menu.icon;
    dialogFormData.value.close = menu.close;
    dialogFormData.value.hidden = menu.hidden;
    dialogFormData.value.pid = menu.pid;
  }
  dialogFormVisible.value = true;
}

function addSubMenu(menu: MenuConfig) {
  dialogTitle.value = "新增子菜单";
  if (menu) {
    dialogFormData.value.id = 0;
    dialogFormData.value.title = menu.title;
    dialogFormData.value.name = menu.name;
    dialogFormData.value.route = menu.route;
    dialogFormData.value.close = menu.close;
    dialogFormData.value.icon = menu.icon;
    dialogFormData.value.hidden = menu.hidden;
    dialogFormData.value.pid = menu.id;
  } else {
    dialogFormData.value = emptyView;
  }
  dialogFormVisible.value = true;
}

function editMenu(menu: MenuConfig) {
  dialogTitle.value = "编辑菜单";
  dialogFormData.value.id = menu.id;
  dialogFormData.value.title = menu.title;
  dialogFormData.value.name = menu.name;
  dialogFormData.value.route = menu.route;
  dialogFormData.value.icon = menu.icon;
  dialogFormData.value.close = menu.close;
  dialogFormData.value.hidden = menu.hidden;
  dialogFormData.value.pid = menu.pid;
  dialogFormVisible.value = true;

}


async function confirmDialog() {
  try {
    if (dialogTitle.value === '新增菜单' || dialogTitle.value === '新增子菜单') {
      const result = await MenuApi.addMenu(dialogFormData.value.title, dialogFormData.value.name, dialogFormData.value.route,
        dialogFormData.value.icon, dialogFormData.value.close,
        dialogFormData.value.hidden, Math.trunc(dialogFormData.value.pid));
      ElMessage.success("新增成功");
      await reloadTableData();
    } else if (dialogTitle.value === '编辑菜单') {
      const result = await MenuApi.updateMenu(dialogFormData.value.id, dialogFormData.value.title, dialogFormData.value.name,
        dialogFormData.value.route, dialogFormData.value.icon, dialogFormData.value.close,
        dialogFormData.value.hidden, dialogFormData.value.pid);
      ElMessage.success("编辑成功");
      await reloadTableData();
    }
  } catch (e) {
    console.error(e)
    ElMessage.error(`${dialogTitle.value.substring(0, 2)}失败`)
  } finally {
    dialogFormVisible.value = false;
  }

}

async function delMenu(row?: MenuConfig) {
  try {
    await MenuApi.delMenu(row.id)
    await reloadTableData()
    ElMessage.success("删除成功")
  } catch (e) {
    console.error(e)
    ElMessage.error("删除失败")
  }
}

function exportMenu() {

}

function expendMenu() {
  expandOrShrinkAll(filterMenuList.value, true);
}

function shrinkMenu() {
  expandOrShrinkAll(filterMenuList.value, false);
}

function expandOrShrinkAll(list: MenuConfig[], expanded: boolean) {
  for (let item of list) {
    if (item.children && item.children.length > 0) {
      tableRef.value?.toggleRowExpansion(item, expanded);
      if (item.children && item.children.length > 0) {
        expandOrShrinkAll(item.children, expanded);
      }
    }
  }
}

const selectedMenus: Ref<MenuConfig[]> = ref<MenuConfig[]>([]);

function handleSelectionChange(menus: MenuConfig[]) {
  selectedMenus.value = menus;
}

async function batchDeleteMenu() {
  const selectionRows: MenuConfig[] = tableRef.value.getSelectionRows();
  const ids: number[] = selectionRows.map(it => it.id)
  console.log("selected ids", ids)
  // try {
  //   // await MenuApi.batchDeleteMenu()
  //   ElMessage.success("删除成功")
  // } catch (e) {
  //   console.error(e)
  //   ElMessage.error("删除失败")
  // }
}



async function reloadTableData() {
  loading.value = true;
  menuData.value = await MenuApi.findMenu();
  loading.value = false;
}

onMounted(() => {
  reloadTableData();
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

:deep(div.el-table__header-wrapper .el-table_1_column_1 div.cell) {
  display: none;
}

</style>

