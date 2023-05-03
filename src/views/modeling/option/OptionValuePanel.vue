<template>
  <div v-loading="loading" style="width: 100%; height: 100%; background-color: var(--el-bg-color); ">
    <div style="box-sizing: border-box; padding: 6px; background-color: var(--toolbar-bg-color); ">
      <el-button v-if="isView && !isConfig" @click="isView = false">编辑</el-button>
      <el-button v-if="!isView" @click="isView = true">取消</el-button>
      <el-button v-if="!isView" type="primary" plain @click="handleConfirm">确定</el-button>
      <el-button v-if="isView && !isConfig" @click="isConfig = true">配置选项</el-button>
      <el-button v-if="isView && !isConfig" @click="handleDeleteOptionType" type="danger" plain>删除</el-button>

      <el-button v-if="isConfig" @click="isConfig = false">取消</el-button>

    </div>
    <div style="width: 100%; height: calc(100% - 32px - 12px - 1px); box-sizing: border-box; ">
      <el-form v-if="!isConfig" :model="formData" ref="formRef" label-width="80px" style="width: 100%; max-width: 800px; padding-top: 6px">
        <el-form-item prop="name" label="名称" required>
          <el-input v-model="formData.name" v-if="!isView" />
          <div v-if="isView" v-text="formData.name"></div>
        </el-form-item>
        <el-form-item prop="remark" label="说明">
          <el-input v-model="formData.remark" type="textarea" :rows="2" v-if="!isView" />
          <div v-if="isView" v-text="formData.remark"></div>
        </el-form-item>
      </el-form>
      <div v-else id="value-panel-container" style="width: 100%; height: 100%; display: flex; flex-direction: row; overflow-x: scroll">
        <div style="width: 50%; min-width: 300px; height: 100%;">
          <el-table
            v-loading="loading"
            :data="modelingOptionValues"
            height="100%"
            border stripe
            scrollbar-always-on default-expand-all
            row-key="id"
            :tree-props="{ children: 'children' }"
            :row-style="handleRowStyle"
            @row-click="handleRowClick"
          >
            <el-table-column type="index" label="#" width="60" align="center" header-align="center" />
            <el-table-column prop="name" label="名称"/>
            <el-table-column prop="order_no" label="排序" width="60" align="center" header-align="center" />
          </el-table>
        </div>
        <div style="width: 50%; min-width: 300px; height: 100%; display: flex;">
          <div style="display: flex; align-items: center; box-sizing: border-box; padding: 0 10px; border: 1px solid var(--el-border-color);">
            <div>
              <div>
                <el-button @click="handleAdd">新增</el-button>
              </div>
              <div v-if="!!valueFormData.id" style="margin-top: 6px;">
                <el-button @click="handleValueSubmit">更新</el-button>
              </div>
              <div v-if="!!valueFormData.id && !valueFormData.disabled" style="margin-top: 6px;">
                <el-button @click="handleDeleteValue" type="danger" plain>删除</el-button>
              </div>
              <div v-if="!!valueFormData.id && valueFormData.disabled" style="margin-top: 6px;">
                <el-button @click="handleResetValue" type="success" plain>恢复</el-button>
              </div>
            </div>
          </div>
          <div style="flex: 1; border: 1px solid var(--el-border-color);">
            <el-form ref="valueFormRef" :model="valueFormData" label-width="80px">
              <el-form-item prop="id" label="Id">
                <div v-text="(valueFormData as ModelingOptionValueUpdateParam).id"></div>
              </el-form-item>
              <el-form-item prop="name" label="名称" required>
                <el-input v-model="valueFormData.name" />
              </el-form-item>
              <el-form-item prop="order_no" label="序号" required>
                <el-input-number v-model="valueFormData.order_no" :controls="false" style="width: 100%;" />
              </el-form-item>
              <el-form-item prop="pid" label="父级">
                <el-tree-select
                  v-model="valueFormData.pid"
                  filterable clearable fit-input-width
                  :loading="loading"
                  node-key="id"
                  check-strictly
                  default-expand-all
                  :props="{ label: 'name', children: 'children' }"
                  :data="modelingOptionValues"
                  style="width: 100%;"
                />
              </el-form-item>
            </el-form>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { useModelingOptionApi } from "@/service/modeling/option";
import { ElButton, ElForm, ElFormItem, ElInput, ElInputNumber, ElMessage, ElTable, ElTableColumn, ElTreeSelect } from "element-plus";
import { onBeforeMount, ref } from "vue";

interface Props {
  fromType: ModelingOptionTypeView
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const isView = ref(true)

const formData = ref<ModelingOptionTypeUpdateParam>({
  id: props.fromType.id,
  name: props.fromType.name,
  remark: props.fromType.remark,
})

const loading = ref(false)

const {
  updateOptionType,
  modelingOptionValues,
  findModelingOptionValues,
  addOptionValue,
  updateOptionValue, deleteOptionType, deleteOptionValue, resetOptionValue,
} = useModelingOptionApi(loading)

const formRef = ref<InstanceType<typeof ElForm>>()
async function handleConfirm() {
  try {
    await formRef.value.validate()
  } catch (e) {
    console.error(e);
    return
  }

  const result = await updateOptionType(formData.value)
  if (result) {
    isView.value = true
  }

}

const isConfig = ref(false)
const param = ref<ModelingOptionValueFindParam>({
  typeId: props.fromType.id,
})
onBeforeMount(() => findModelingOptionValues(param.value))

const valueFormData = ref<ModelingOptionValueAddParam & ModelingOptionValueUpdateParam>({
  id: null,
  type_id: props.fromType.id,
  name: '',
  pid: null,
  order_no: 1,
  disabled: false,
})

const valueFormRef = ref<InstanceType<typeof ElForm>>()
async function handleAdd() {
  try {
    await valueFormRef.value.validate()
  } catch (e) {
    console.error(e);
    return
  }

  const result = await addOptionValue(valueFormData.value as ModelingOptionValueAddParam)
  if (result) {
    await findModelingOptionValues(param.value)
  }
}

async function handleValueSubmit() {
  if (!(valueFormData.value as ModelingOptionValueUpdateParam).id) {
    ElMessage.error('请先选择一个值')
    return
  }
  try {
    await valueFormRef.value.validate()
  } catch (e) {
    console.error(e);
    return
  }

  const result = await updateOptionValue(valueFormData.value as ModelingOptionValueUpdateParam)
  if (result) {
    await findModelingOptionValues(param.value)
  }

}

async function handleDeleteValue() {
  if (!valueFormData.value.id) {
    ElMessage.error('请选择一个选项')
    return
  }

  const result = await deleteOptionValue(valueFormData.value.id)
  if (result) {
    await findModelingOptionValues(param.value)
  }
}


async function handleResetValue() {
  if (!valueFormData.value.id) {
    ElMessage.error('请选择一个选项')
    return
  }

  const result = await resetOptionValue(valueFormData.value.id)
  if (result) {
    await findModelingOptionValues(param.value)
  }
}


function handleRowClick(row: ModelingOptionValueView) {
  valueFormData.value.id = row.id
  valueFormData.value.name = row.name
  valueFormData.value.pid = row.pid
  valueFormData.value.order_no = row.order_no
  valueFormData.value.disabled = row.disabled
}

async function handleDeleteOptionType() {
  const result = await deleteOptionType(props.fromType.id)
  if (result) {
    emits('close')
  }
}

function handleRowStyle(params) {
  const row: ModelingOptionValueView = params.row
  const style = {
    cursor: 'pointer',
  }
  if (row.disabled) {
    style['color'] = 'red'
  }
  return style
}
</script>

<style scoped>
:deep(.el-input-number .el-input__inner) {
  text-align: left;
}

:deep(table.el-table__body tr.el-table__row td:first-child span.el-table__placeholder) {
  display: none;
}

#value-panel-container::-webkit-scrollbar {
  width: 0;
}

</style>