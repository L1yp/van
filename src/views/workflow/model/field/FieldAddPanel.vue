<template>
  <div v-loading="loading" style="background-color: #FFF; width: 100%; height: 100%;">
    <div style="box-sizing: border-box; padding: 6px;background-color: rgb(151 173 139 / 24%); ">
      <el-button @click="handleCancel">取消</el-button>
      <el-button @click="handleConfirm" type="primary" plain>确定</el-button>
    </div>
    <div style="width: calc(100% - 12px); height: calc(100% - 32px - 12px); padding: 6px;">
      <el-scrollbar always>
        <el-form ref="formRef" :model="formData" label-width="100px" status-icon style="width: 100%">
          <el-form-item prop="field" label="字段" required :rules="{ pattern: /^[a-zA-Z_]+\w?$/, message: '必须以字母或下划线开头' }">
            <el-input v-model="formData.field" />
          </el-form-item>
          <el-form-item prop="label" label="标签" required>
            <el-input v-model="formData.label" />
          </el-form-item>
          <el-form-item prop="remark" label="说明">
            <el-input v-model="formData.remark" />
          </el-form-item>
          <el-form-item prop="width" label="宽度" required>
            <el-input-number v-model="formData.width" :min="1" :controls="false" style="width: 100%" />
          </el-form-item>
          <el-form-item prop="type" label="类型" required>
            <el-select v-model="formData.type" @change="v => formData.scheme.type = v" style="width: 100%">
              <el-option label="数字" value="number" />
              <el-option label="文本" value="text" />
              <el-option label="选项" value="option" />
              <el-option label="用户" value="user" />
              <el-option label="部门" value="dept" />
            </el-select>
          </el-form-item>
          <component :form-data="formData" :is="schemeConfigComponentMap[formData.type]"/>
          
        </el-form>
      </el-scrollbar>
    </div>
    
  </div>
</template>

<script lang="ts" setup>
import { ElForm, ElFormItem, ElButton, ElInput, ElInputNumber, ElSelect, ElOption, ElScrollbar } from "element-plus";
import { inject, markRaw, ref } from "vue";
import { workflowDefKey } from "../keys";
import NumberSchemeConfig from "./form/NumberSchemeConfig.vue";
import TextSchemeConfig from "./form/TextSchemeConfig.vue";
import OptionSchemeConfig from "./form/OptionSchemeConfig.vue";
import UserSchemeConfig from "./form/UserSchemeConfig.vue";
import DeptSchemeConfig from "./form/DeptSchemeConfig.vue";
import { useWorkflowFieldApi } from "@/service/workflow/field";

interface Props {
  scope: FieldScope
}

const props = withDefaults(defineProps<Props>(), {
  scope: 'PRIVATE',
})

interface Emits {
  (e: 'close'): void
  (e: 'success'): void
}

const emits = defineEmits<Emits>()

const workflowDef = inject(workflowDefKey)

const formData = ref<WorkflowFieldAddParam>({
  wf_key: workflowDef.value?.key,
  field: '',
  label: '',
  remark: '',
  width: 16,
  type: 'number',
  scope: props.scope,
  scheme: {
    type: 'number',
  }
})

const schemeConfigComponentMap = {
  number: markRaw(NumberSchemeConfig),
  text: markRaw(TextSchemeConfig),
  option: markRaw(OptionSchemeConfig),
  user: markRaw(UserSchemeConfig),
  dept: markRaw(DeptSchemeConfig),
}


function handleCancel() {
  emits('close')
}

const loading = ref(false)
const { addField } = useWorkflowFieldApi(loading)

const formRef = ref<InstanceType<typeof ElForm>>()
async function handleConfirm() {
  try {
    await formRef.value.validate()
  } catch (e) {
    console.error(e);
    return
  }

  formData.value.scope = props.scope
  const result = await addField(formData.value)
  if (result) {
    emits('close')
    emits('success')
  }
}
</script>

<style scoped>
:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
</style>