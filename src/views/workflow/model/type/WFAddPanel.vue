<template>

  <div v-loading="loading" style="background-color: #FFFFFF; padding: 20px;">
    <div>
      <el-button @click="handleCancel">取消</el-button>
      <el-button @click="handleConfirm" type="primary" plain>确定</el-button>
    </div>
    <el-form :model="formData" style="margin-top: 10px" label-width="70px">
      <el-divider content-position="left">基本信息</el-divider>
      <el-form-item label="标识" prop="key">
        <el-input v-model="formData.key" />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="备注" prop="name">
        <el-input type="textarea" :rows="2" v-model="formData.remark" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio-button :label="0">正常</el-radio-button>
          <el-radio-button :label="1">禁用</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-divider content-position="left">编码规则</el-divider>
      <el-form-item label="类型">
        <el-radio-group v-model="formData.code_gen_rule.type">
          <el-radio-button label="fixed">固定</el-radio-button>
          <el-radio-button label="class">Java类</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <template v-if="formData.code_gen_rule.type === 'fixed'">
        <el-form-item label="编码规则" :prop="['code_gen_rule', 'content']">
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
          <el-input v-model="(formData.code_gen_rule as ClassGenRule).class_name" />
        </el-form-item>
      </template>
    </el-form>
  </div>


</template>
<script lang="ts" setup>
import { ElForm, ElFormItem, ElInput, ElRadioGroup, ElRadioButton, ElSelect, ElOption, ElButton, ElDivider } from "element-plus";
import { ref } from "vue";
import FormItemTooltip from "@/components/form/FormItemTooltip.vue";
import { useWorkflowApi } from "@/service/workflow";

interface Emits {
  (e: 'close'): void
}

const emits = defineEmits<Emits>()

const loading = ref<boolean>(false)

const { addDef } = useWorkflowApi(loading)




const formData = ref<WorkflowTypeDefAddParam>({
  key: '',
  name: '',
  remark: '',
  code_gen_rule: {
    type: 'class',
  },
  status: '',
})

function handleCancel() {
  emits('close')
}

async function handleConfirm() {
  const result = addDef(formData.value)
  if (result) {
    emits('close')
  }
}

</script>