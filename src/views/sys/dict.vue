<template>
  <div class="dict-container">
    <div class="dict-info-container">
      <div class="op-line">
        <el-button size="default" plain style="vertical-align: middle;" type="primary" @click="addDictInfo">
          <SVGIcon style="width: 1em; height: 1em" name="Plus"/><span style="margin-left: 4px;">新增</span>
        </el-button>
        <el-popconfirm
          title="确定删除?"
          confirmButtonText="确定"
          cancelButtonText="取消"
          @confirm="batchDeleteDictInfo"
        >
          <template #reference>
            <el-button size="default" plain style="vertical-align: middle;" type="danger" :disabled="selectedDictInfoRows.length === 0">
              <SVGIcon style="width: 1em; height: 1em" name="Delete"/><span style="margin-left: 4px;">删除</span>
            </el-button>
          </template>
        </el-popconfirm>
        <el-button size="default" plain style="vertical-align: middle" type="warning" @click="exportDictInfoTable">
          <SVGIcon style="width: 1em; height: 1em" name="Download"/><span style="margin-left: 4px;">导出</span>
        </el-button>
      </div>

      <div class="data-table">
        <el-table
          ref="dictInfoTableRef"
          v-loading="dictInfoTableLoading"
          :data="dictInfoTableData"
          :height="dictTableHeight" stripe
          @selection-change="handleDictInfoSelectChange"
          @current-change="handleDictInfoCurrentChange"
          :row-style="{cursor: 'pointer'}"
          highlight-current-row
          current-row-key="id"
          row-key="id"
          @row-click="handleDictInfoRowClick"
        >
          <el-table-column type="selection" width="50"/>
          <el-table-column label="_" prop="id" width="50"/>
          <el-table-column label="名称" prop="name" width="100" align="center"/>
          <el-table-column label="范围" prop="scope" width="100" align="center"/>
          <el-table-column label="标识" prop="ident" width="150" align="center"/>
          <el-table-column label="类型" prop="status" width="80" align="center">
            <template #default="scope">
              <dict-tag ident="dict_type" :val="scope.row.type"></dict-tag>
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="status" width="100" align="center">
            <template #default="scope">
              <dict-tag ident="common_status" :val="scope.row.status"></dict-tag>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" width="150"/>
          <el-table-column fixed="right" label="操作" width="130">
            <template #default="scope">
              <el-tooltip
                effect="dark"
                content="新增"
                placement="top"
              >
                <el-button size="small" plain style="vertical-align: middle" text @click.stop="addDictInfo(scope.row)">
                  <SVGIcon style="width: 1em; height: 1em" name="Plus"/>
                </el-button>
              </el-tooltip>
              <el-tooltip
                effect="dark"
                content="编辑"
                placement="top"
              >
                <el-button size="small" plain style="vertical-align: middle" text @click.stop="updateDictInfo(scope.row)">
                  <SVGIcon style="width: 1em; height: 1em" name="Edit"/>
                </el-button>
              </el-tooltip>
              <el-popconfirm
                title="确定删除?"
                confirmButtonText="确定"
                cancelButtonText="取消"
                @confirm.stop="deleteDictInfo(scope.row)"
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

    </div> <!-- 字典列表 -->

    <div class="dict-value-container">
      <div class="op-line">
        <el-button size="default" plain style="vertical-align: middle;" type="primary" @click="addDictValue">
          <SVGIcon style="width: 1em; height: 1em" name="Plus"/><span style="margin-left: 4px;">新增</span>
        </el-button>
        <el-popconfirm
          title="确定删除?"
          confirmButtonText="确定"
          cancelButtonText="取消"
          @confirm="batchDeleteDictValue"
        >
          <template #reference>
            <el-button size="default" plain style="vertical-align: middle;" type="danger" :disabled="selectedDictValueRows.length === 0">
              <SVGIcon style="width: 1em; height: 1em" name="Delete"/><span style="margin-left: 4px;">删除</span>
            </el-button>
          </template>
        </el-popconfirm>
        <el-button size="default" plain style="vertical-align: middle" type="warning" @click="exportDictValueTable">
          <SVGIcon style="width: 1em; height: 1em" name="Download"/><span style="margin-left: 4px;">导出</span>
        </el-button>
      </div>

      <div class="data-table">
        <el-table
          ref="dictValueTableRef"
          v-loading="dictValueTableLoading"
          :data="dictValueTableData"
          :height="dictTableHeight" stripe
          @selection-change="handleDictValueSelectChange"
          :row-style="{cursor: 'pointer'}"
          highlight-current-row
          current-row-key="id"
          row-key="id"
          @row-click="handleDictValueRowClick"
        >
          <el-table-column type="selection" width="50"/>
          <el-table-column label="键" prop="label" width="200"/>
          <el-table-column label="值" prop="val" width="80" align="center"/>
          <el-table-column label="序" prop="order_no" width="50" align="center"/>
          <el-table-column label="状态" prop="status" width="100" align="center">
            <template #default="scope">
              <dict-tag ident="common_status" :val="scope.row.status"></dict-tag>
            </template>
          </el-table-column>

          <el-table-column label="备注" prop="remark" width="150"/>
          <el-table-column fixed="right" label="操作" width="130">
            <template #default="scope">
              <el-tooltip
                effect="dark"
                content="新增"
                placement="top"
              >
                <el-button size="small" plain style="vertical-align: middle" text @click.stop="addDictValue(scope.row)">
                  <SVGIcon style="width: 1em; height: 1em" name="Plus"/>
                </el-button>
              </el-tooltip>
              <el-tooltip
                effect="dark"
                content="编辑"
                placement="top"
              >
                <el-button size="small" plain style="vertical-align: middle" text @click.stop="updateDictValue(scope.row)">
                  <SVGIcon style="width: 1em; height: 1em" name="Edit"/>
                </el-button>
              </el-tooltip>
              <el-popconfirm
                title="确定删除?"
                confirmButtonText="确定"
                cancelButtonText="取消"
                @confirm.stop="deleteDictValue(scope.row)"
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

    </div> <!-- 字典值列表 -->
  </div>

  <el-dialog v-model="dictInfoDialogVisible" :title="dictInfoDialogTitle" :draggable="true" :append-to-body="true" custom-class="user-ext-dialog" width="680px">
    <el-form ref="dictInfoFormRef" :model="dictInfoFormData" :rules="dictInfoFormRules" status-icon size="default" label-width="60px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="名称" prop="name" required>
            <el-input v-model="dictInfoFormData.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标识" prop="ident" required>
            <el-input v-model="dictInfoFormData.ident" :disabled="dictInfoDialogTitle.startsWith('更新')"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="类型" prop="type" required>
            <dict-input ident="dict_type" v-model="dictInfoFormData.type"></dict-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status" required>
            <dict-input ident="common_status" v-model="dictInfoFormData.status"></dict-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="dictInfoFormData.remark" type="textarea" resize="vertical" :rows="5"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="default" @click="dictInfoDialogVisible = false">取消</el-button>
        <el-button size="default" type="primary" @click="handleDictInfoDialogConfirm">确定</el-button>
      </span>
    </template>

  </el-dialog>

  <el-dialog v-model="dictValueDialogVisible" :title="dictValueDialogTitle" :draggable="true" :append-to-body="true" custom-class="user-ext-dialog" width="680px">
    <el-form ref="dictValueFormRef" :model="dictValueFormData" :rules="dictValueFormRules" status-icon size="default" label-width="60px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="键" prop="label" required>
            <el-input v-model="dictValueFormData.label"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="值" prop="val" required>
            <el-input-number v-model="dictValueFormData.val" style="width: 100%"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="状态" prop="status" required>
            <el-radio-group v-model="dictValueFormData.status">
              <el-radio :label="0">启用</el-radio>
              <el-radio :label="1">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序" prop="order_no" required>
            <el-input-number v-model="dictValueFormData.order_no" style="width: 100%"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col v-if="currentDictInfo.type === 2" :span="24">
          <el-form-item label="父项" prop="pid">
            <el-cascader
              v-model="dictValuePid"
              :options="dictValueTableData"
              :props="{value: 'id', checkStrictly: true}"
              placeholder="父项">
            </el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="dictValueFormData.remark" type="textarea" resize="vertical" :rows="5"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="default" @click="dictValueDialogVisible = false">取消</el-button>
        <el-button size="default" type="primary" @click="handleDictValueDialogConfirm">确定</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script lang="ts" setup>
import {computed, inject, onMounted, reactive, ref, unref,} from "vue"
import {
  ElTable, ElTableColumn, ElButton, ElPopconfirm, ElTooltip, ElDialog, ElForm, ElFormItem,
  ElRadioGroup, ElRadio, ElMessage, ElInputNumber, ElInput, ElRow, ElCol, ElSelect, ElOption,
  ElCascader,
} from "element-plus"
import * as DictApi from "@/api/sys/dict/dict"
import SVGIcon from "@/components/common/SVGIcon.vue"
import {asideWidthKey, mainHeightKey, themeKey} from "@/config/app.keys"
import DictTag from "@/components/dict/DictTag.vue"
import DictInput from "@/components/dict/DictInput.vue";

const mainHeight = inject(mainHeightKey);
const theme = inject(themeKey);
const asideWidth = inject(asideWidthKey)

const dictInfoTableRef = ref<InstanceType<typeof ElTable>>()
const dictValueTableRef = ref<InstanceType<typeof ElTable>>()

const dictInfoTableLoading = ref(true)
const dictValueTableLoading = ref(false)
const dictInfoTableData = ref<DictInfo[]>([])
const dictValueTableData = ref<DictValue[]>([])
const dictValueTableFlatData = ref<DictValue[]>([])

const dictInfoTableWidth = computed(() => {
  const padding = 20;
  const tableWidth = 910;
  return (padding + tableWidth) + "px";
})

const marginLeft = "10px"

const dictValueTableWidth = computed(() => {
  return `780px`;
})

const dictTableHeight = computed(() => {
  return `calc(${mainHeight.value} - ${theme.value.mainPadding * 2 + 42 + 20}px)`
})



const selectedDictInfoRows = ref<DictInfo[]>([])
const selectedDictValueRows = ref<DictInfo[]>([])

function handleDictInfoSelectChange(selectedRows: any[]) {
  selectedDictInfoRows.value = selectedRows
}
function handleDictValueSelectChange(selectedRows: any[]) {
  selectedDictValueRows.value = selectedRows
}

const currentDictInfo = ref<DictInfo>()

async function handleDictInfoCurrentChange(current: DictInfo, old) {
  currentDictInfo.value = current
  if (current) {
    await loadDictValueTable()
  }
}



function handleDictInfoRowClick(row: any) {
  dictInfoTableRef.value.toggleRowSelection(row, undefined)
}

function handleDictValueRowClick(row: any) {
  dictValueTableRef.value.toggleRowSelection(row, undefined)
}

const dictInfoDialogVisible = ref<boolean>(false)
const dictInfoDialogTitle = ref<string>("新增字典配置")
const dictInfoFormRef = ref<InstanceType<typeof ElForm>>()
const dictInfoFormData = ref<DictInfo>({
  id: 0,
  name: "",
  scope: "global",
  ident: "",
  status: 0,
  type: 1,
  remark: "",
})
const dictInfoFormRules = reactive({
  name: [
    { required: true, message: '请输入字典名称', trigger: 'blur' },
    { type: 'string', min: 1, max: 64, message: '长度不能超过64个字符', trigger: 'blur' },
  ],
  ident: [
    { required: true, message: '请输入字典标识', trigger: 'blur' },
    { min: 1, max: 32, message: '长度不能超过32个字符', trigger: 'blur' },
  ],
})

function addDictInfo(row?: DictInfo) {

  dictInfoDialogTitle.value = "新增字典配置"
  if (row && !(row instanceof Event)) {
    Object.assign(dictInfoFormData.value, row)
  }

  dictInfoDialogVisible.value = true;
}

function updateDictInfo(row?: DictInfo) {
  dictInfoDialogTitle.value = "更新字典配置"
  if (row && !(row instanceof Event)) {
    Object.assign(dictInfoFormData.value, row)
  }
  dictInfoDialogVisible.value = true;
}

async function handleDictInfoDialogConfirm() {
  await dictInfoFormRef.value.validate()
  const command = dictInfoDialogTitle.value.substring(0, 2)
  try {
    if (dictInfoDialogTitle.value.startsWith("新增")) {
      dictInfoFormData.value.id = undefined
      await DictApi.addDictInfo(dictInfoFormData.value)
    } else {
      await DictApi.updateDictInfo(dictInfoFormData.value)
    }
    await loadDictInfoTable()
    ElMessage.info(`${command}成功`)
  } catch (e: any) {
    if (e instanceof Error) {
      ElMessage.error(`删除失败,错误信息:${e.message}`)
    } else {
      console.log(`${command}失败`, e)
      ElMessage.error(`${command}失败,错误信息:${e}`)
    }
  } finally {
    dictInfoDialogVisible.value = false
  }
}

async function deleteDictInfo(row?: DictInfo) {
  try {
    if (currentDictInfo.value?.id === row?.id) {
      currentDictInfo.value = null
    }

    await DictApi.deleteDictInfo(row.id)
    await loadDictInfoTable()
    ElMessage.info("删除成功")
  } catch (e: any) {
    if (e instanceof Error) {
      ElMessage.error(`删除失败,错误信息:${e.message}`)
    } else {
      console.log("删除失败", e)
      ElMessage.error(`删除失败,错误信息:${e.message}`)
    }
  }
}

const dictValueDialogVisible = ref<boolean>(false)
const dictValueDialogTitle = ref<string>("新增字典键值")
const dictValueFormRef = ref<InstanceType<typeof ElForm>>()
const dictValueFormData = ref<DictValue>({
  id: 0,
  scope: "global",
  ident: "",
  label: "",
  val: 0,
  order_no: 1,
  status: 1,
  pid: 0,
  meta: "{\"type\":\"success\",\"effect\":\"light\",\"size\":\"default\"}",
  remark: "",
  create_time: 0,
  children: [],
})
const dictValuePid = ref<number[]>([0])
const dictValueFormRules = reactive({

})


function addDictValue(row?: DictValue) {
  if (!currentDictInfo.value) {
    ElMessage.info("请先单击左侧表格选择一个字典信息")
    return;
  }
  dictValueDialogTitle.value = "新增字典键值"
  if (row && !(row instanceof Event)) {
    Object.assign(dictValueFormData.value, row)
    dictValueFormData.value.id = undefined
    dictValuePid.value = readParentIdChain(dictValueTableFlatData.value, row)
  }

  dictValueDialogVisible.value = true;
}


function updateDictValue(row?: DictValue) {
  if (!currentDictInfo.value) {
    ElMessage.info("请先单击左侧表格选择一个字典信息")
    return;
  }
  dictValueDialogTitle.value = "更新字典键值"
  if (row && !(row instanceof Event)) {
    Object.assign(dictValueFormData.value, row)
    dictValuePid.value = readParentIdChain(dictValueTableFlatData.value, row)
  }

  dictValueDialogVisible.value = true;
}

async function handleDictValueDialogConfirm() {
  dictValueFormData.value.scope = currentDictInfo.value.scope
  dictValueFormData.value.ident = currentDictInfo.value.ident
  if (currentDictInfo.value.type === 2) {
    dictValueFormData.value.pid = dictValuePid.value[dictValuePid.value.length - 1]
  }

  const command = dictValueDialogTitle.value.substring(0, 2)
  try {
    await dictValueFormRef.value.validate()

    if (dictValueDialogTitle.value.startsWith("新增")) {
      dictValueFormData.value.id = undefined
      await DictApi.addDictValue(dictValueFormData.value)
    } else {
      await DictApi.updateDictValue(dictValueFormData.value)
    }

    await loadDictValueTable()
  } catch (e: any) {
    if (e instanceof Error) {
      ElMessage.error(`${command}失败,错误信息:${e.message}`)
    } else {
      console.log(`${command}失败`, e)
      ElMessage.error(`${command}失败`)
    }
  } finally {
    dictValueDialogVisible.value = false
  }
}

async function deleteDictValue(row?: DictInfo) {
  try {
    await DictApi.deleteDictValue(row.id)
    await loadDictValueTable()
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


async function batchDeleteDictInfo() {
  if (selectedDictInfoRows.value && selectedDictInfoRows.value.length > 0) {
    const ids = selectedDictInfoRows.value.map(it => it.id).join()
    try {
      await DictApi.batchDeleteDictInfo(ids)
      await loadDictInfoTable()
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

async function batchDeleteDictValue() {
  if (selectedDictValueRows.value && selectedDictValueRows.value.length > 0) {
    const ids = selectedDictValueRows.value.map(it => it.id).join()
    try {
      await DictApi.batchDeleteDictValue(ids)
      await loadDictValueTable()
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

onMounted(async () => {
  await loadDictInfoTable()
})

async function loadDictInfoTable() {
  dictInfoTableLoading.value = true
  dictInfoTableData.value = await DictApi.findDictInfoList()
  dictInfoTableLoading.value = false
}

async function loadDictValueTable() {
  if (!currentDictInfo.value) {
    dictValueTableLoading.value = false
    return;
  }
  dictValueTableLoading.value = true
  dictValueTableFlatData.value = await DictApi.findDictValueList(currentDictInfo.value.scope, currentDictInfo.value.ident)
  if (currentDictInfo.value.type === 2) {
    dictValueTableData.value = dictValuesToTree(dictValueTableFlatData.value)
  } else {
    dictValueTableData.value = dictValueTableFlatData.value
  }
  dictValueTableLoading.value = false
}

function exportDictInfoTable() {

}

function exportDictValueTable() {

}

function dictValuesToTree(list: DictValue[]) {
  const map = new Map<number, DictValue>(list.map(key => [key.id, key]));

  for (let item of list) {
    if (item.pid === 0) continue;
    const parent = map.get(item.pid)
    if (parent && !parent.children) {
      parent.children = []
    }

    // sort by order_no
    parent.children.push(item)
  }

  return list.filter(it => it.pid === 0)

}

/**
 * 获取当前行父项的路径(不包括当前行)
 * @param list
 * @param row
 */
function readParentIdChain(list: DictValue[], row: DictValue): number[] {

  const map = new Map<number, DictValue>(list.map(key => [key.id, key]));
  const result = []
  let pid = row.pid
  while (pid !== 0) {
    const item = map.get(pid)
    result.push(item.id)
    pid = item.pid
  }

  return result.reverse()
}

</script>
<style scoped>
.dict-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.dict-info-container {
  box-sizing: border-box;
  width: v-bind(dictInfoTableWidth);
  background-color: #FFFFFF;
  padding: 10px;
  transition: .3s;
}

.dict-info-container:hover {
  box-shadow: 0 0 12px rgba(0, 0, 0, .12);
}

.dict-value-container {
  box-sizing: border-box;
  width: v-bind(dictValueTableWidth);
  background-color: #FFFFFF;
  padding: 10px;
  transition: .3s;
  margin-left: v-bind(marginLeft);
}

.dict-value-container:hover {
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
