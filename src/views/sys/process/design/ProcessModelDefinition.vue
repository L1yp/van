<template>
  <div class="dict-info-container">
    <div class="op-line">
      <el-button size="default" plain style="vertical-align: middle;" type="primary" @click="addItem">
        <SVGIcon style="width: 1em; height: 1em" name="Plus"/><span style="margin-left: 4px;">新增</span>
      </el-button>
      <el-button size="default" plain style="vertical-align: middle" type="warning" @click="exportDictInfoTable">
        <SVGIcon style="width: 1em; height: 1em" name="Download"/><span style="margin-left: 4px;">导出</span>
      </el-button>
    </div>

    <div class="data-table">
      <el-table
        ref="tableRef"
        v-loading="tableLoading"
        :data="tableData"
        :height="tableHeight" stripe
        :row-style="{cursor: 'pointer'}"
        @row-click="handleRowClick"
        highlight-current-row
        current-row-key="id"
        row-key="rk"
        :tree-props="{ children: 'children'}"
      >
        <el-table-column type="selection" width="50"/>
        <el-table-column label="名称" prop="title" width="300"/>
        <el-table-column label="状态" prop="state" width="100" align="center">
          <template #default="scope">
            <dict-tag ident="publish" :val="scope.row.state" ></dict-tag>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" prop="update_time" width="200"/>
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="scope">
            <template v-if="scope.row.children && scope.row.children.length > 0">
              <el-button size="small" plain style="vertical-align: middle" text @click.stop="fieldConfig(scope.row)">
                <s-v-g-icon style="width: 1em; height: 1em" name="TextField"/><span style="margin-left: 6px">字段</span>
              </el-button>
              <el-button size="small" plain style="vertical-align: middle" text @click.stop="formConfig(scope.row)">
                <SVGIcon style="width: 1em; height: 1em" name="Form"/><span style="margin-left: 6px">表单</span>
              </el-button>
              <el-button size="small" plain style="vertical-align: middle" text @click.stop="tableViewConfig(scope.row)">
                <SVGIcon style="width: 1em; height: 1em" name="View"/><span style="margin-left: 6px">视图</span>
              </el-button>
            </template>
            <template v-else>
              <el-button size="small" plain style="vertical-align: middle" text @click.stop="startProcess(scope.row)">
                <SVGIcon style="width: 1em; height: 1em" name="Plus"/><span style="margin-left: 6px">创建</span>
              </el-button>
              <el-button size="small" plain style="vertical-align: middle" text @click.stop="designProcess(scope.row)">
                <SVGIcon style="width: 1em; height: 1em" name="Edit"/><span style="margin-left: 6px">设计</span>
              </el-button>
              <el-button size="small" plain style="vertical-align: middle" text @click.stop="viewList(scope.row)">
                <SVGIcon style="width: 1em; height: 1em" name="View"/><span style="margin-left: 6px">列表</span>
              </el-button>
            </template>



          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>

  <el-dialog v-model="dialogVisible" :title="dialogTitle" :draggable="true" :append-to-body="true" :fullscreen="fullScreen" custom-class="user-ext-dialog">
    <template #header>
      <div style="display: flex; justify-content: space-between; align-content: center">
        <div v-text="dialogTitle"></div>
        <div style="margin-right: 12px; margin-top: 2px">
          <span @click.stop="requestFullScreen" class="full-screen-btn">
            <s-v-g-icon style="width: 1em; height: 1em" :name="fullScreen ? 'FullScreenMinimize' : 'FullScreenMaximize'"/>
          </span>
        </div>
      </div>
    </template>
    <el-form ref="dictValueFormRef" :model="dialogFormData" status-icon label-width="80px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="标识" prop="process_key" required>
            <el-input v-model="dialogFormData.process_key"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标题" prop="title" required>
            <el-input v-model="dialogFormData.title"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="编码前缀" prop="code_prefix" required>
            <el-input v-model="dialogFormData.code_prefix"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="连接符" prop="code_joiner">
            <el-input v-model="dialogFormData.code_joiner"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="code_time_pattern">
            <el-input v-model="dialogFormData.code_time_pattern"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="code_joiner2">
            <el-input v-model="dialogFormData.code_joiner2"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="编码后缀" prop="code_suffix" required>
            <el-input v-model="dialogFormData.code_suffix"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="default" @click="dialogVisible = false">取消</el-button>
        <el-button size="default" type="primary" @click="handleProcessCreateDialogConfirm">确定</el-button>
      </span>
    </template>
  </el-dialog>


</template>

<script lang="ts" setup>
import {computed, inject, onMounted, ref, } from "vue"
import {asideWidthKey, mainHeightKey, themeKey} from "@/config/app.keys";
import {
  ElTable, ElTableColumn, ElButton, ElPopconfirm, ElTooltip, ElDialog, ElForm, ElFormItem,
  ElRadioGroup, ElRadio, ElMessage, ElInputNumber, ElInput, ElRow, ElCol, ElSelect, ElOption,
  ElCascader,
} from "element-plus"
import * as ProcessApi from "@/api/sys/process"
import SVGIcon from "@/components/common/SVGIcon.vue"
import {useRouter} from "vue-router"
import DictTag from "@/components/dict/DictTag.vue";

const router = useRouter()

const mainHeight = inject(mainHeightKey);
const theme = inject(themeKey);
const asideWidth = inject(asideWidthKey)
const tableRef = ref<InstanceType<typeof ElTable>>()
const tableLoading = ref(true)
const tableData = ref<ProcessModelTreeView[]>([])

const tableWidth = computed(() => {
  const padding = 20;
  const tableWidth = 1180;
  return (padding + tableWidth) + "px";
})
const tableHeight = computed(() => {
  return `calc(${mainHeight.value} - ${theme.value.mainPadding * 2 + 42 + 20}px)`
})

async function handleProcessCreateDialogConfirm() {

}

function startProcess(row: ProcessDefinition) {

}

function designProcess(row: ProcessDefinition) {
  router.push({
    name: "processAppDesign",
    params: {
      processDefinitionId: row.id
    }
  })
}

function viewList(row: ProcessDefinition) {
  router.push({name: "processInstanceByKey", params: {key: row.key}})
}


function fieldConfig(row: ProcessDefinition) {
  router.push({name: "processField", params: {processKey: row.key}})
}

function formConfig(row: ProcessDefinition) {

}

function tableViewConfig(row: ProcessDefinition) {

}

onMounted(async() => {
  tableLoading.value = true
  tableData.value = await ProcessApi.listProcessModel()
  tableLoading.value = false

})

function handleRowClick(row, column, event) {
  tableRef.value.toggleRowExpansion(row, undefined)
}

const dialogVisible = ref(false)
const dialogFormData = ref({});
const dialogTitle = ref("")
const fullScreen = ref(false)
function requestFullScreen() {
  fullScreen.value = !fullScreen.value
}

function addItem(row?: any) {
  dialogTitle.value = "新增流程模型"
  dialogVisible.value = true
}
function deleteDictInfo(row?: any) {}
function exportDictInfoTable() {}

</script>

<style scoped>
.dict-info-container {
  box-sizing: border-box;
  width: v-bind(tableWidth);
  background-color: #FFFFFF;
  padding: 10px;
  transition: .3s;
}

.dict-info-container:hover {
  box-shadow: 0 0 12px rgba(0, 0, 0, .12);
}


.op-line {
  box-sizing: border-box;
  height: 32px;
}

.data-table {
  box-sizing: border-box;
  margin-top: 10px;
}

:deep(.el-form-item.is-success .el-input__validateIcon) {
  color: green;
}


span.full-screen-btn {
  margin-right: 32px;
  cursor: pointer;
}

span.full-screen-btn:hover {
  color: var(--el-color-primary)
}

</style>