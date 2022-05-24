<template>
  <div class="table-container">
    <div class="op-line">
      <el-button size="default" plain style="vertical-align: middle;" type="primary" @click.stop="addItem">
        <SVGIcon style="width: 1em; height: 1em" name="Plus"/><span style="margin-left: 4px;">新增</span>
      </el-button>
      <el-button size="default" plain style="vertical-align: middle" type="success" @click.stop="syncTable">
        <SVGIcon style="width: 1em; height: 1em" name="Sync"/><span style="margin-left: 6px">同步</span>
      </el-button>
      <el-button size="default" plain style="vertical-align: middle" type="warning" @click.stop="exportTable">
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
        row-key="id"
        @row-click="handleRowClick"
        highlight-current-row
        current-row-key="id"
      >
        <el-table-column type="selection" width="50"/>
        <el-table-column label="字段" prop="name" width="200"/>
        <el-table-column label="标签" prop="label" width="200" align="center"/>
        <el-table-column label="类型" prop="component_type" width="100">
          <template #default="scope">
            <dict-tag scope="global" ident="component_type" :val="scope.row.component_type"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="description" width="300" align="center"/>
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="scope">
            <el-button size="small" plain style="vertical-align: middle" text @click.stop="addItem(scope.row)">
              <SVGIcon style="width: 1em; height: 1em" name="Plus"/><span style="margin-left: 6px">新增</span>
            </el-button>
            <el-button size="small" plain style="vertical-align: middle" text @click.stop="editItem(scope.row)">
              <SVGIcon style="width: 1em; height: 1em" name="Edit"/><span style="margin-left: 6px">编辑</span>
            </el-button>

          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <el-dialog v-model="dialogVisible" :title="dialogTitle" :draggable="true" custom-class="user-ext-dialog" width="600px">
    <el-form ref="dialogFormRef" :model="dialogFormData" status-icon size="default" label-width="100px">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="名称" prop="name" required>
            <el-input v-model="dialogFormData.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="序号" prop="order_no" required>
            <el-input-number v-model="dialogFormData.order_no"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="标签" prop="label" required>
            <el-input v-model="dialogFormData.label"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="类型" prop="component_type" required>
            <dict-input
              scope="global"
              ident="component_type"
              :type="1"
              :multiple="false"
              placeholder="控件类型"
              v-model="dialogFormData.component_type"
              check-strictly
            >
            </dict-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" v-show="[3,4].includes(dialogFormData.component_type)">
        <el-col :span="12">
          <el-form-item label="字典范围" prop="dict_scope">
            <el-input v-model="dialogFormData.dict_scope"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="字典标识" prop="dict_ident">
            <el-input v-model="dialogFormData.dict_ident"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="数据库类型" prop="db_field_type" required>
            <el-input v-model="dialogFormData.db_field_type"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="默认值" prop="db_default_value" required>
            <el-input v-model="dialogFormData.db_default_value"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="描述" prop="description">
            <el-input type="textarea" v-model="dialogFormData.description"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="default" @click="dialogVisible = false">取消</el-button>
        <el-button size="default" type="primary" @click="handleDialogConfirm">确定</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script lang="ts" setup>
import {ref, watch, computed, onMounted, inject} from "vue"
import {useRoute, useRouter} from "vue-router"
import {
  ElTable, ElTableColumn, ElButton, ElDialog, ElForm, ElFormItem,
  ElInput, ElInputNumber, ElRow, ElCol, ElSelect, ElOption, ElMessage,
} from "element-plus"
import SVGIcon from "@/components/common/SVGIcon.vue"
import {mainHeightKey, themeKey} from "@/config/app.keys";
import * as ProcessApi from "@/api/sys/process";
import DictInput from "@/components/dict/DictInput.vue"
import DictTag from "@/components/dict/DictTag.vue"

const route = useRoute()
const processKey = route.params.processKey as string


const mainHeight = inject(mainHeightKey);
const theme = inject(themeKey);
const tableRef = ref<InstanceType<typeof ElTable>>()
const tableLoading = ref(true)
const tableData = ref<ProcessFieldDefinition[]>([])

const tableWidth = computed(() => {
  const padding = 20;
  const tableWidth = 1050;
  return (padding + tableWidth) + "px";
})

const tableHeight = computed(() => {
  return `calc(${mainHeight.value} - ${theme.value.mainPadding * 2 + 42 + 20}px)`
})


const dialogVisible = ref(false)
const dialogTitle = ref("")
const dialogFormData = ref<AddProcessFieldDefinitionParam | UpdateProcessFieldDefinitionParam>({
  process_key: processKey,
  name: "",
  order_no: 1,
  label: "",
  component_type: 1,
  db_field_type: "varchar(64)",
})

async function handleDialogConfirm() {
  const command = dialogTitle.value.substring(0, 2)
  try {
    if (command === "新增") {
      await ProcessApi.createProcessFieldDefinition(dialogFormData.value as AddProcessFieldDefinitionParam)
    } else if (command === "编辑") {
      await ProcessApi.updateProcessFieldDefinition(dialogFormData.value as UpdateProcessFieldDefinitionParam)
    }
    ElMessage.success(`${command}成功`)
  } catch (e) {
    ElMessage.error(`${command}失败，错误信息: ${e}`)
  } finally {
    await loadTableData()
    dialogVisible.value = false
  }

}

onMounted(() => {
  loadTableData()
})

async function loadTableData() {
  tableLoading.value = true
  tableData.value = await ProcessApi.loadProcessFieldDefinition(processKey)
  tableLoading.value = false
}

function handleRowClick(row, column, event) {
  tableRef.value.toggleRowExpansion(row, undefined)
}

function addItem(row: ProcessFieldDefinition) {
  dialogTitle.value = "新增字段"
  if (row && !(row instanceof Event)) {
    Object.assign(dialogFormData.value, row)
    console.log(dialogFormData.value)
  } else {
    dialogFormData.value = {
      process_key: processKey,
      name: "",
      order_no: 1,
      label: "",
      component_type: 1,
      db_field_type: "varchar(64)",
    } as AddProcessFieldDefinitionParam
  }

  dialogVisible.value = true

}

function editItem(row) {
  dialogTitle.value = "编辑字段"
  Object.assign(dialogFormData.value, row)
  dialogVisible.value = true
}

function syncTable(row) { }

function exportTable() {}

</script>


<style scoped>
.table-container {
  box-sizing: border-box;
  width: v-bind(tableWidth);
  background-color: #FFFFFF;
  padding: 10px;
  transition: .3s;
}

.table-container:hover {
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

:deep(.el-input-number) {
  width: 100%;
}
</style>