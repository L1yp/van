<template>
  <div class="container">
    <div class="op-line">
      <el-button size="default" plain style="vertical-align: middle;" type="primary" @click="addRow">
        <SVGIcon style="width: 1em; height: 1em" name="Plus"/><span style="margin-left: 4px;">新增</span>
      </el-button>
      <el-button size="default" plain style="vertical-align: middle;" type="primary" @click.stop="configStartForm()">
        <SVGIcon style="width: 1em; height: 1em" name="config"/><span style="margin-left: 4px;">配置启动表单</span>
      </el-button>
      <el-popconfirm
        title="确定删除?"
        confirmButtonText="确定"
        cancelButtonText="取消"
        @confirm="deleteRows"
      >
        <template #reference>
          <el-button size="default" plain style="vertical-align: middle;" type="danger" :disabled="selectedRows.length === 0">
            <SVGIcon style="width: 1em; height: 1em" name="Delete"/><span style="margin-left: 4px;">删除</span>
          </el-button>
        </template>
      </el-popconfirm>
      <el-button size="default" plain style="vertical-align: middle" type="warning" @click="exportTableData">
        <SVGIcon style="width: 1em; height: 1em" name="Download"/><span style="margin-left: 4px;">导出</span>
      </el-button>
    </div>

    <div class="data-table">
      <el-table
        ref="tableRef"
        v-loading="tableInfo.tableLoading"
        :data="tableInfo.tableData"
        :height="tableHeight" stripe
        @selection-change="handleSelectChange"
        @current-change="handleCurrentChange"
        :row-style="{cursor: 'pointer'}"
        highlight-current-row
        current-row-key="id"
        row-key="id"
        @row-click="handleRowClick"
      >
        <el-table-column type="selection" width="50"/>
        <el-table-column label="_" prop="id" width="80"/>
        <el-table-column label="名称" prop="name" width="200" align="center"/>
        <el-table-column label="备注" prop="remark" width="300" align="center"/>
        <el-table-column fixed="right" label="操作">
          <template #default="scope">
            <el-tooltip
              effect="dark"
              content="新增"
              placement="top"
            >
              <el-button size="small" plain style="vertical-align: middle" text @click.stop="addRow(scope.row)">
                <SVGIcon style="width: 1em; height: 1em" name="Plus"/>
              </el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="配置页面字段"
              placement="top"
            >
              <el-button size="small" plain style="vertical-align: middle" text @click.stop="configPageScheme(scope.row)">
                <SVGIcon style="width: 1em; height: 1em" name="Edit"/>
              </el-button>
            </el-tooltip>
            <el-popconfirm
              title="确定删除?"
              confirmButtonText="确定"
              cancelButtonText="取消"
              @confirm.stop="deleteRow(scope.row)"
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

  <v-dialog
    draggable
    v-model="dialogInfo.visible"
    :title="dialogInfo.title"
    @confirm="handleDialogConfirm"
    @cancel="dialogInfo.visible = false"
  >
    <el-form :model="dialogInfo.formData" ref="formRef" label-width="120px">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="流程标识" prop="processKey">
            <el-input v-model="dialogInfo.formData.process_key" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="页面名称" prop="name">
            <el-input v-model="dialogInfo.formData.name" placeholder="请输入名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="dialogInfo.formData.remark"
              placeholder="请输入备注"
              type="textarea"
              :rows="3"
            >

            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </v-dialog>

  <v-dialog
    :full-screen="true"
    :show-full-screen="false"
    v-model="dialogInfo.schemeVisible"
    :title="dialogInfo.schemeTitle"
    @confirm="handleDialogSchemeConfirm"
    @cancel="dialogInfo.schemeVisible = false"
  >
    <el-tabs tab-position="left">
      <el-tab-pane label="H5">
        <PageSchemeDefinition v-model="dialogInfo.schemeFormData.h5" ident="h5" :page-id="dialogInfo.schemeFormData.process_model_page_id" :process-key="processKey" :fields="processFields"></PageSchemeDefinition>
      </el-tab-pane>
      <el-tab-pane label="Pad">
        <PageSchemeDefinition v-model="dialogInfo.schemeFormData.pad" ident="pad" :page-id="dialogInfo.schemeFormData.process_model_page_id" :process-key="processKey" :fields="processFields"></PageSchemeDefinition>
      </el-tab-pane>
      <el-tab-pane label="PC">
        <PageSchemeDefinition v-model="dialogInfo.schemeFormData.pc" ident="pc" :page-id="dialogInfo.schemeFormData.process_model_page_id" :process-key="processKey" :fields="processFields"></PageSchemeDefinition>
      </el-tab-pane>
    </el-tabs>

  </v-dialog>

  <v-dialog
    v-model="startDialogInfo.visible"
    draggable
    :title="startDialogInfo.title"
    @confirm="confirmBindStartForm"
    @cancel="startDialogInfo.visible = false"
  >
    <v-form-pro
      :formAttr="{labelWidth: '120px'}"
      :scheme="startDialogInfo.scheme"
      v-model="startDialogInfo.formData"
    ></v-form-pro>

  </v-dialog>

</template>

<script lang="ts" setup>
import {computed, inject, onBeforeMount, onMounted, ref, shallowRef} from 'vue'
import { useRoute, useRouter } from "vue-router";
import {
  ElTable, ElTableColumn, ElPopconfirm, ElTooltip, ElButton,
  ElMessage, ElForm, ElFormItem, ElRow, ElCol, ElInput,
  ElTabs, ElTabPane, ElRadioGroup, ElRadioButton
} from 'element-plus'
import SVGIcon from "@/components/common/SVGIcon.vue";
import {asideWidthKey, mainHeightKey, themeKey} from "@/config/app.keys";
import VDialog from "@/components/dialog/VDialog.vue";
import * as ProcessPageApi from "@/api/sys/process/page"
import * as ProcessApi from "@/api/sys/process"
import PageSchemeDefinition from "./scheme/PageSchemeDefinition.vue"
import {FormScheme} from "@/components/form/types";
import VFormPro from "@/components/form/VFormPro.vue";

interface TableInfo {
  tableLoading: boolean;
  tableData: ProcessModelPageView[]
}

const route = useRoute()
const router = useRouter()

const processKey = route.query.key as string

const mainHeight = inject(mainHeightKey)
const theme = inject(themeKey)
const asideWidth = inject(asideWidthKey)
const tableRef = ref<InstanceType<typeof ElTable>>()
const tableInfo = ref<TableInfo>({
  tableLoading: false,
  tableData: [],
})

const tableHeight = computed(() => {
  return `calc(${mainHeight.value} - ${theme.value.mainPadding * 2 + 42 + 20}px)`
})


function handleRowClick() {

}

const selectedRows = shallowRef<ProcessModelPageView[]>([])
function handleSelectChange(rows: ProcessModelPageView[]) {
  selectedRows.value = rows
}

function handleCurrentChange(newRow, oldRow) {

}

const processFields = shallowRef<ProcessFieldDefinition[]>([])
onBeforeMount(async () => {
  await loadStartFormInfo()
  await loadProcessFields()
  await loadTableData()
})

async function loadProcessFields() {
  try {
    processFields.value = await ProcessApi.loadProcessFieldDefinition(processKey)
  } catch (e) {
    ElMessage.error(e?.message || "加载字段列表失败")
  }
}

async function loadTableData() {
  try {
    tableInfo.value.tableLoading = true
    tableInfo.value.tableData = await ProcessPageApi.listProcessPage(processKey)
    startDialogInfo.value.scheme[0][1].componentAttrs.options = tableInfo.value.tableData
  } catch (e) {
    ElMessage.error(e?.message || "加载失败")
  } finally {
    tableInfo.value.tableLoading = false
  }
}

async function loadStartFormInfo() {
  try {
    const data = await ProcessApi.getStartFormPage(processKey)
    startDialogInfo.value.formData.page_width = data.process_model_node_page.page_width
    startDialogInfo.value.formData.label_width = data.process_model_node_page.label_width
    startDialogInfo.value.formData.process_model_page_id = data.process_model_node_page.process_model_page_id
  } catch (e) {
    console.error(e?.message || '加载启动表单失败')
  }

}

function deleteRows() {

}

function addRow(row?: ProcessModelPageView) {
  dialogInfo.value.title = '新增流程页面'
  dialogInfo.value.formData.process_key = processKey
  if (row) {
    dialogInfo.value.formData.name = row.name
    dialogInfo.value.formData.remark = row.remark
  }
  dialogInfo.value.visible = true
}

async function configStartForm(row: ProcessModelPageView) {
  startDialogInfo.value.visible = true
}

async function confirmBindStartForm() {

  try {
    await ProcessApi.bindStartFormPage(startDialogInfo.value.formData)
    ElMessage.success('配置成功')
    startDialogInfo.value.visible = false
  } catch (e) {
    console.log(e)
    ElMessage.error(e?.message || '配置失败')
  }
}

async function configPageScheme(row: ProcessModelPageView) {
  dialogInfo.value.schemeTitle = `【${row.name}】定义`
  dialogInfo.value.schemeFormData.process_model_page_id = row.id

  try {
    const scheme: ProcessModelPageSchemeView = await ProcessPageApi.listProcessPageScheme(row.id)
    if (scheme) {
      dialogInfo.value.schemeFormData.h5 = scheme.h5
      dialogInfo.value.schemeFormData.pad = scheme.pad
      dialogInfo.value.schemeFormData.pc = scheme.pc
    }
    dialogInfo.value.schemeVisible = true
  } catch (e) {
    console.error(e)
    ElMessage.error(e?.message || '获取配置信息失败')
  }


}

function deleteRow(row) {

}

function exportTableData() {

}

async function handleDialogConfirm() {
  try {
    await ProcessPageApi.createPage(dialogInfo.value.formData)
    await loadTableData()
    ElMessage.success("创建成功")
  } catch (e) {
    console.error(e)
    ElMessage.error(e?.message || "创建失败")
  } finally {
    dialogInfo.value.visible = false
  }


}

async function handleDialogSchemeConfirm(){
  try {
    await ProcessPageApi.createPageScheme(dialogInfo.value.schemeFormData)
    await loadTableData()
    ElMessage.success("保存成功")
  } catch (e) {
    console.error(e)
    ElMessage.error(e?.message || "保存失败")
  } finally {
    dialogInfo.value.schemeVisible = false
  }
}


interface DialogInfo {
  visible: boolean
  title: string
  formData?: AddProcessModelPageParam
  schemeVisible: boolean
  schemeTitle: string
  schemeFormData: AddProcessModelPageSchemeParam
}

const formRef = ref<InstanceType<typeof ElForm>>()
const dialogInfo = ref<DialogInfo>({
  visible: false,
  title: '',
  formData: {
    process_key: '',
    name: '',
    remark: ''
  },
  schemeVisible: false,
  schemeTitle: '',
  schemeFormData: {
    process_model_page_id: 0,
    h5: [],
    pad: [],
    pc: [],
  }
})

interface StartFormDialogInfo {
  visible: boolean
  title: string
  formData: BindProcessStartFormParam
  scheme: FormScheme[][]
}

const startDialogInfo = ref<StartFormDialogInfo>({
  visible: false,
  title: '绑定启动表单',
  formData: {
    page_width: '850px',
    label_width: '120px',
    process_key: processKey,
    process_model_page_id: 0
  },
  scheme: [
    [
      {
        name: 'process_key',
        label: '流程标识',
        span: 12,
        component: 'el-input',
        writeable: true,
        componentAttrs: {
          disabled: true,
        }
      },
      {
        name: 'process_model_page_id',
        label: '页面',
        span: 12,
        component: 'v-select',
        writeable: true,
        componentAttrs: {
          options: tableInfo.value.tableData,
          keyField: 'id',
          labelField: 'name',
          valueField: 'id',
          selectAttrs: {
            clearable: true
          }
        }
      }
    ],
    [
      {
        name: 'page_width',
        label: '页面宽度',
        span: 12,
        component: 'el-input',
        writeable: true,
        componentAttrs: {

        }
      },
      {
        name: 'label_width',
        label: '标签宽度',
        span: 12,
        component: 'el-input',
        writeable: true,
        componentAttrs: {

        }
      },
    ]
  ]
})

</script>

<style scoped>
.container {
  box-sizing: border-box;
  background-color: #FFFFFF;
  padding: 10px;
  transition: .3s;
}

.container:hover {
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

</style>