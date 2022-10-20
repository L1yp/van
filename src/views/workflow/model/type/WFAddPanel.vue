<template>

  <div v-loading="loading">
    <div>
      <el-button @click="handleCancel">取消</el-button>
      <el-button @click="handleConfirm" type="primary" plain>确定</el-button>
    </div>
    <el-form :model="formData" style="margin-top: 10px">
      <el-divider content-position="left">基本信息</el-divider>
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name"/>
      </el-form-item>
      <el-form-item label="备注" prop="name">
        <el-input v-model="formData.remark"/>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio-button :label="0">正常</el-radio-button>
          <el-radio-button :label="1">禁用</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-divider content-position="left">编码规则</el-divider>
      <el-form-item label="类型">
        <el-radio-group v-model="(formData.code_gen_rule as CodeGenRule).type" :disabled="mode === 'view'">
          <el-radio-button label="fixed">固定</el-radio-button>
          <el-radio-button label="class">Java类</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <template v-if="(formData.code_gen_rule as CodeGenRule).type === 'fixed'">
        <el-form-item label="编码规则" :prop="['code_gen_rule', 'content']">
          <el-input v-model="((formData.code_gen_rule as CodeGenRule).content as CodeGenByFixed).prefix" style="width: 150px" />
          <el-select v-model="((formData.code_gen_rule as CodeGenRule).content as CodeGenByFixed).delimiter" style="width: 100px">
            <el-option label="" value="" />
            <el-option label="-" value="-" />
            <el-option label="_" value="_" />
          </el-select>
          <el-input v-model="((formData.code_gen_rule as CodeGenRule).content as CodeGenByFixed).dateFormat" style="width: 150px" />
          <el-select v-model="((formData.code_gen_rule as CodeGenRule).content as CodeGenByFixed).joiner" style="width: 100px">
            <el-option label="请选择" value="" />
            <el-option label="-" value="-" />
            <el-option label="_" value="_" />
          </el-select>
          <el-input v-model="((formData.code_gen_rule as CodeGenRule).content as CodeGenByFixed).numFormat" style="width: 150px" />
        </el-form-item>
      </template>
      <template v-else-if="(formData.code_gen_rule as CodeGenRule).type === 'class'">
        <el-form-item label="类名" :prop="['code_gen_rule', 'content']">
          <template #label>
            <form-item-tooltip
              title="类名"
              content="Java类的全限定类名：必须继承com.l1yp.workflow.base.IGenCode"
            />
          </template>
          <el-input v-model="((formData.code_gen_rule as CodeGenRule).content as CodeGenByClass).className" />
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

const loading = ref<boolean>(false)

const { updateDefById } = useWorkflowApi(loading)


const formData = ref<WorkflowTypeDefAddParam>({
  name: '',
  remark: '',
  code_gen_rule: {
    type: 'class',
    content: {
      className: ''
    },
  },
  status: '',
})

const mode = ref<'view' | 'edit'>('view')

function handleCancel() {

}

async function handleConfirm() {
  await updateDefById(formData.value)
  await findDefById(props.src.id)
  formData.value = workflowDef.value
  formData.value.code_gen_rule = JSON.parse(formData.value.code_gen_rule as string)
  mode.value = 'view'
}

</script>