<template>
  <div class="op-line">
    <el-input style="width: 200px;" size="default" placeholder="部门名称" v-model="deptTitleKey"></el-input>
    <el-button size="default" plain style="vertical-align: middle; margin-left: 12px;" type="info" @click="expand">
      <SVGIcon style="width: 1em; height: 1em" name="Expand" /><span style="margin-left: 4px;">展开</span>
    </el-button>
    <el-button size="default" plain style="vertical-align: middle;" type="info" @click="shrink">
      <SVGIcon style="width: 1em; height: 1em" name="Shrink" /><span style="margin-left: 4px;">收缩</span>
    </el-button>
    <el-button size="default" plain style="vertical-align: middle;" type="primary" @click="addItem">
      <SVGIcon style="width: 1em; height: 1em" name="Plus"/><span style="margin-left: 4px;">新增</span>
    </el-button>
    <el-popconfirm
      title="确定删除?"
      confirmButtonText="确定"
      cancelButtonText="取消"
      @confirm="batchDelete"
    >
      <template #reference>
        <el-button size="default" plain style="vertical-align: middle;" type="danger" :disabled="currentSelectedList.length === 0">
          <SVGIcon style="width: 1em; height: 1em" name="Delete"/><span style="margin-left: 4px;">删除</span>
        </el-button>
      </template>
    </el-popconfirm>
    <el-button size="default" plain style="vertical-align: middle" type="warning" @click="exportTable">
      <SVGIcon style="width: 1em; height: 1em" name="Delete"/><span style="margin-left: 4px;">导出</span>
    </el-button>
  </div>

  <div class="data-table">
    <el-table
      v-loading="loading"
      ref="tableRef"
      :height="dataTableHeight"
      :data="filterDataList"
      style="width: 100%"
      row-key="id"
      :stripe="true"
      :tree-props="{ children: 'children' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" header-align="center" />
      <el-table-column prop="simple_name" align="left" header-align="left" label="简称" width="300" />
      <el-table-column prop="id" align="center" header-align="center" label="#" width="60" />
      <el-table-column prop="ident" align="center" header-align="center" label="编号" width="100" />
      <el-table-column prop="order_no" align="center" header-align="center" label="排序" width="60" />
      <el-table-column prop="owner" align="center" header-align="center" label="领导" width="100">
        <template #default="scope">
          <el-tag>{{scope.row.owner > 0 ? scope.row.owner_info.nickname : '无'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" align="center" header-align="center" label="状态" width="80">
        <template #default="scope">
          <dict-tag ident="common_status" :val="scope.row.status"></dict-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button plain style="vertical-align: middle;" text @click="addItem(scope.row)">
            <SVGIcon style="width: 1em; height: 1em" name="Plus"/><span style="margin-left: 4px;">新增</span>
          </el-button>
          <el-button plain style="vertical-align: middle;" text @click="addSubItem(scope.row)">
            <SVGIcon style="width: 1em; height: 1em" name="Plus"/><span style="margin-left: 4px;">子部门</span>
          </el-button>
          <el-button plain style="vertical-align: middle;" text @click="editItem(scope.row)">
            <SVGIcon style="width: 1em; height: 1em" name="Edit"/><span style="margin-left: 4px;">编辑</span>
          </el-button>
          <el-popconfirm
            title="确定删除?"
            confirmButtonText="确定"
            cancelButtonText="取消"
            @confirm="delItem(scope.row)"
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

  <el-dialog v-model="dialogFormVisible" :title="dialogTitle" width="300px" custom-class="user-ext-dialog" :draggable="true">
    <el-form :model="dialogFormData" size="default" :label-width="60">
      <el-form-item v-if="dialogTitle === '编辑部门'" label="部门ID">
        <el-input disabled v-model="dialogFormData.id"></el-input>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="dialogFormData.title"></el-input>
      </el-form-item>
      <el-form-item label="简称">
        <el-input v-model="dialogFormData.simple_name"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="dialogFormData.description"></el-input>
      </el-form-item>
      <el-form-item label="标识">
        <el-input v-model="dialogFormData.ident"></el-input>
      </el-form-item>
      <el-form-item label="排序">
        <el-input v-model="dialogFormData.order_no"></el-input>
      </el-form-item>

      <el-form-item label="父ID">
        <el-input type="number" v-model="dialogFormData.pid"></el-input>
      </el-form-item>
      <el-form-item label="领导">
        <user-selector-input
          style="width: 100%"
          v-model="dialogFormData.owner"
          value-key="id"
          :read-view-fn="k => dialogFormData.owner_info"
          :multiple="false"
          placeholder="双击选择用户"
        ></user-selector-input>
      </el-form-item>

      <el-form-item label="状态">
        <dict-input ident="common_status" v-model="dialogFormData.status" ></dict-input>
      </el-form-item>
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
import {onMounted, ref, computed, nextTick, inject, Ref, ComputedRef} from "vue";
import SVGIcon from "@/components/common/SVGIcon.vue";
import {
  ElTable,
  ElTableColumn,
  ElInput, ElTag,
  ElButton,
  ElSwitch, ElPopconfirm, ElDialog, ElForm, ElFormItem, ElMessage
} from "element-plus";
import * as DeptApi from "@/api/sys/dept";
import {filterDataWithTitle} from "@/utils/common"
import {mainHeightKey, themeKey} from "@/config/app.keys";
import UserSelectorInput from "@/components/common/selector/user/UserSelectorInput.vue";
import DictInput from "@/components/dict/DictInput.vue";
import DictTag from "@/components/dict/DictTag.vue";

const loading = ref(true);
const tableRef = ref<InstanceType<typeof ElTable> | null>();

const theme = inject<Ref<ThemeConfig>>(themeKey)
const mainHeight = inject<ComputedRef<string>>(mainHeightKey)


const dataTableHeight = computed<string>(() => {
  /**
   * 32px op height
   * 10px marginTop
   */
  return `calc(${mainHeight.value} - ${theme.value.mainPadding + theme.value.mainPadding + 32 + 10}px)`;
});

const tableData = ref([]);

const deptTitleKey = ref("");
const dialogFormVisible = ref(false);

const formInit: AddDeptParam | UpdateDeptParam = {
  id: 0,
  title: "",
  simple_name: "",
  description: "",
  ident: "",
  order_no: 0,
  pid: 0,
  owner: 0,
  status: false,
};

const dialogFormData = ref<AddDeptParam | UpdateDeptParam>();
const dialogTitle = ref<string>("");


const filterDataList = computed<DeptView[]>(() => {
  const result: DeptView[] = [];
  filterDataWithTitle(result, tableData.value, deptTitleKey.value, "simple_name", undefined);
  if (result.length > 0) nextTick(() => expandOrShrinkAll(result, true));
  return result;
});

function addItem(row: DeptView) {
  dialogTitle.value = "新增部门";
  if (row && !(row instanceof Event)) {
    dialogFormData.value = {} as AddDeptParam
    Object.assign(dialogFormData.value, row)
  } else {
    dialogFormData.value = formInit
  }
  dialogFormVisible.value = true;
}

function addSubItem(row: DeptView) {
  dialogTitle.value = "新增子部门";
  if (row && !(row instanceof Event)) {
    dialogFormData.value = {} as AddDeptParam
    Object.assign(dialogFormData.value, row)
  } else {
    dialogFormData.value = formInit;
  }
  dialogFormVisible.value = true;
}

function editItem(row: DeptView) {
  dialogTitle.value = "编辑部门";
  dialogFormData.value = {} as UpdateDeptParam
  Object.assign(dialogFormData.value, row)
  dialogFormVisible.value = true;

}


async function confirmDialog() {
  if (dialogTitle.value === '新增部门' || dialogTitle.value === '新增子部门') {
    await DeptApi.addDept(dialogFormData.value as AddDeptParam);
    await reloadTableData();
    ElMessage.info("新增成功");
  } else if (dialogTitle.value === '编辑部门') {
    await DeptApi.updateDept(dialogFormData.value as UpdateDeptParam);
    await reloadTableData();
    ElMessage.info("编辑成功");
  }
  dialogFormVisible.value = false;
}

function delItem(row) {

}

function exportTable() {

}

function expand() {
  expandOrShrinkAll(filterDataList.value, true);
}

function shrink() {
  expandOrShrinkAll(filterDataList.value, false);
}

function expandOrShrinkAll(list: DeptView[], expanded: boolean) {
  for (let item of list) {
    if (item.children && item.children.length > 0) {
      tableRef.value.toggleRowExpansion(item, expanded);
      if (item.children && item.children.length > 0) {
        expandOrShrinkAll(item.children, expanded);
      }
    }
  }
}

const currentSelectedList = ref([]);

function handleSelectionChange(menus) {
  currentSelectedList.value = menus;
}

function batchDelete() {

}



async function reloadTableData() {
  loading.value = true;
  const result = await DeptApi.findDept();
  tableData.value = result;
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
