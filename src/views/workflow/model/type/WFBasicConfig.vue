<template>

  <div v-loading="loading">
    <div>
      <el-button v-if="mode === 'view'" @click="mode = 'edit'">编辑</el-button>
      <el-button v-if="mode === 'edit'" @click="handleCancel">取消</el-button>
      <el-button v-if="mode === 'edit'" @click="handleConfirm" type="primary" plain>确定</el-button>
    </div>
    <el-form :model="formData" style="margin-top: 10px" label-width="70px">
      <el-divider content-position="left">基本信息</el-divider>
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" v-if="mode === 'edit'" />
        <div v-if="mode === 'view'" v-text="formData.name"></div>
      </el-form-item>
      <el-form-item label="备注" prop="name">
        <el-input v-model="formData.remark" v-if="mode === 'edit'" />
        <div v-if="mode === 'view'" v-text="formData.remark"></div>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status" :disabled="mode === 'view'">
          <el-radio-button :label="0">正常</el-radio-button>
          <el-radio-button :label="1">禁用</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-divider content-position="left">编码规则</el-divider>
      <el-form-item label="类型">
        <el-radio-group v-model="formData.code_gen_rule.type" :disabled="mode === 'view'">
          <el-radio-button label="fixed">固定</el-radio-button>
          <el-radio-button label="class">Java类</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <template v-if="formData.code_gen_rule.type === 'fixed'">
        <el-form-item label="编码规则" :prop="['code_gen_rule', 'content']">
          <template v-if="mode === 'view'">
            <div v-text="(formData.code_gen_rule as FixedGenRule).prefix"></div>
            <div v-text="(formData.code_gen_rule as FixedGenRule).delimiter"></div>
            <div v-text="(formData.code_gen_rule as FixedGenRule).date_format"></div>
            <div v-text="(formData.code_gen_rule as FixedGenRule).joiner"></div>
            <div v-text="(formData.code_gen_rule as FixedGenRule).num_format"></div>
          </template>
          <template v-else-if="mode === 'edit'">
            <el-input v-model="(formData.code_gen_rule as FixedGenRule).prefix" style="width: 150px" />
            <el-select v-model="(formData.code_gen_rule as FixedGenRule).delimiter" style="width: 100px">
              <el-option label="" value="" />
              <el-option label="-" value="-" />
              <el-option label="_" value="_" />
            </el-select>
            <el-input v-model="(formData.code_gen_rule as FixedGenRule).date_format" style="width: 150px" />
            <el-select v-model="(formData.code_gen_rule as FixedGenRule).joiner" style="width: 100px">
              <el-option label="请选择" value="" />
              <el-option label="-" value="-" />
              <el-option label="_" value="_" />
            </el-select>
            <el-input v-model="(formData.code_gen_rule as FixedGenRule).num_format" style="width: 150px" />
          </template>
        </el-form-item>
      </template>
      <template v-else-if="formData.code_gen_rule.type === 'class'">
        <el-form-item label="类名" :prop="['code_gen_rule', 'content']">
          <template #label>
            <form-item-tooltip
              title="类名"
              content="Java类的全限定类名：必须继承com.l1yp.workflow.base.IGenCode"
            />
          </template>
          <el-input v-show="mode === 'edit'" v-model="(formData.code_gen_rule as ClassGenRule).class_name" />
          <span v-show="mode === 'view'" v-text="(formData.code_gen_rule as ClassGenRule).class_name"></span>
        </el-form-item>
      </template>
    </el-form>
  </div>


</template>
<script lang="ts" setup>
import { ElForm, ElFormItem, ElInput, ElRadioGroup, ElRadioButton, ElSelect, ElOption, ElButton, ElDivider } from "element-plus";
import { onMounted, ref } from "vue";
import FormItemTooltip from "@/components/form/FormItemTooltip.vue";
import { useWorkflowApi } from "@/service/workflow";

interface Props {
  src: WorkflowTypeDefView
}

const props = defineProps<Props>()

const loading = ref<boolean>(false)

const { workflowDef, findDefById, updateDefById } = useWorkflowApi(loading)

function initFormData() {
  formData.value = {
    id: props.src.id,
    name: props.src.name,
    remark: props.src.remark,
    code_gen_rule: props.src.code_gen_rule,
    status: props.src.status,
  }
}

onMounted(initFormData)


const formData = ref<WorkflowTypeDefUpdateParam>({
  id: '',
  name: '',
  remark: '',
  code_gen_rule: {
    type: 'class',
  },
  status: '',
})

const mode = ref<'view' | 'edit'>('view')

function handleCancel() {
  mode.value = 'view'
  initFormData()
}

async function handleConfirm() {
  await updateDefById(formData.value)
  await findDefById(props.src.id)
  formData.value = workflowDef.value
  mode.value = 'view'
}

</script>