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
        current-row-key="title"
        row-key="title"
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
        <el-table-column fixed="right" label="操作" width="300">
          <template #default="scope">
            <template v-if="scope.row.children && scope.row.children.length > 0">
              <el-button size="small" plain style="vertical-align: middle" text @click.stop="fieldConfig(scope.row)">
                <s-v-g-icon style="width: 1em; height: 1em" name="TextField"/><span style="margin-left: 6px">字段</span>
              </el-button>
              <el-button v-if="false" size="small" plain style="vertical-align: middle; margin-left: 0" text @click.stop="startProcess(scope.row)">
                <s-v-g-icon style="width: 1em; height: 1em" name="Plus"/><span style="margin-left: 6px">发起</span>
              </el-button>
              <el-button size="small" plain style="vertical-align: middle; margin-left: 0" text @click.stop="viewProcessList(scope.row)">
                <s-v-g-icon style="width: 1em; height: 1em" name="View"/><span style="margin-left: 6px">视图</span>
              </el-button>
              <el-button size="small" plain style="vertical-align: middle; margin-left: 0" text @click.stop="viewPageList(scope.row)">
                <s-v-g-icon style="width: 1em; height: 1em" name="Page"/><span style="margin-left: 6px">页面</span>
              </el-button>
            </template>
            <template v-else>
              <el-button size="small" plain style="vertical-align: middle" text @click.stop="copyBPMN(scope.row)">
                <SVGIcon style="width: 1em; height: 1em" name="Plus"/><span style="margin-left: 6px">复制</span>
              </el-button>
              <el-button size="small" plain style="vertical-align: middle; margin-left: 0" text @click.stop="designProcess(scope.row)">
                <SVGIcon style="width: 1em; height: 1em" name="Edit"/><span style="margin-left: 6px">设计</span>
              </el-button>
              <el-button v-if="scope.row.state === 0" size="small" plain style="vertical-align: middle; margin-left: 0" text @click.stop="publishBpmn(scope.row)">
                <SVGIcon style="width: 1em; height: 1em" name="Upload"/><span style="margin-left: 6px">发布</span>
              </el-button>
              <el-button v-if="scope.row.state === 1" size="small" plain style="vertical-align: middle; margin-left: 0" text @click.stop="stopBpmn(scope.row)">
                <SVGIcon style="width: 1em; height: 1em" name="Stop"/><span style="margin-left: 6px">停用</span>
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
          <el-form-item label="名称" prop="title" required>
            <el-input v-model="dialogFormData.title"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标识" prop="process_key" required>
            <el-input v-model="dialogFormData.process_key"></el-input>
          </el-form-item>
        </el-col>

      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="编码规则" prop="code_prefix" required>
            <el-input placeholder="前缀" v-model="dialogFormData.code_prefix"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item prop="code_joiner" label-width="0">
            <el-input placeholder="连接符" v-model="dialogFormData.code_joiner"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item prop="code_time_pattern" label-width="0">
            <el-input placeholder="时间格式" v-model="dialogFormData.code_time_pattern"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item prop="code_joiner2" label-width="0">
            <el-input placeholder="连接符" v-model="dialogFormData.code_joiner2"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="code_suffix" required label-width="0">
            <el-input placeholder="后缀" v-model="dialogFormData.code_suffix"></el-input>
          </el-form-item>
        </el-col>
      </el-row>


    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button size="default" @click="dialogVisible = false">取消</el-button>
        <el-button size="default" type="primary" @click="handleProcessCreateDialogConfirm">确定</el-button>
      </div>
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
import {createProcessModelBPMN, publishProcessModelBPMN} from "@/api/sys/process";

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
  try {
    await ProcessApi.createProcessModel(dialogFormData.value)
    await loadProcessModelList()
    ElMessage.success("新增成功")
  } catch (e) {
    console.error(e)
    ElMessage.error("新增失败")
  } finally {
    dialogVisible.value = false
  }
}

async function copyBPMN(row: ProcessModelTreeView) {
  try {
    await ProcessApi.copyProcessModelBPMN(row.id)
    await loadProcessModelList()
    ElMessage.success("复制成功")
  } catch (e) {
    console.error(e)
    ElMessage.error("复制失败")
  }
}

function designProcess(row: ProcessModelTreeView) {
  router.push({
    name: "processAppDesign",
    params: {
      bpmnId: row.id
    },
    query: {
      processKey: row.process_key
    }
  })
}

/**
 * 发布流程
 */
async function publishBpmn(row: ProcessModelTreeView) {
  // 判断其他版本是停用状态
  try {
    await ProcessApi.publishProcessModelBPMN(row.id)
    await loadProcessModelList()
    ElMessage.success("发布成功")
  } catch (e) {
    console.error(e)
    ElMessage.error(e?.message || "发布失败")
  }
}

/**
 * 停用流程
 */
async function stopBpmn(row: ProcessModelTreeView) {
  // 判断其他版本是停用状态
  try {
    await ProcessApi.stopProcessModelBPMN(row.id)
    await loadProcessModelList()
    ElMessage.success("停用成功")
  } catch (e) {
    console.error(e)
    ElMessage.error("停用失败")
  }
}



function fieldConfig(row: ProcessModelTreeView) {
  router.push({name: "processField",
    params: {
      processKey: row.process_key
    }
  })
}

async function startProcess(row: ProcessModelTreeView) {
  try {
    const params = {
      name: "202205预算调整",
      sub_finance: 2,
      sub_high_leader: 3,
      hq_high_leader: 4,
      hq_finance: 5,
      end_monthly: 40
    }
    await ProcessApi.createProcess(row.process_key, params)
    ElMessage.success("创建成功")
  } catch (e) {
    console.error(e)
    ElMessage.error("创建失败")
  }
}

function viewProcessList(row: ProcessModelTreeView) {
  router.push({name: "processInstanceByKey", params: {key: row.process_key}})
}

function viewPageList(row: ProcessModelTreeView) {
  router.push({name: "processModelPage", query: {key: row.process_key}})
}

onMounted(async() => {
  await loadProcessModelList()
})

async function loadProcessModelList() {
  tableLoading.value = true
  try {
    tableData.value = await ProcessApi.listProcessModel()
  } catch (e) {
    console.error(e)
  }
  tableLoading.value = false
}

function handleRowClick(row, column, event) {
  tableRef.value.toggleRowExpansion(row, undefined)
}

const dialogVisible = ref(false)
const dialogFormData = ref<AddProcessModelDefinitionParam>({
  process_key: "",
  code_prefix: "WL",
  code_joiner: "-",
  code_time_pattern: "yyyyMMdd",
  code_joiner2: "-",
  code_suffix: "#####",
});
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