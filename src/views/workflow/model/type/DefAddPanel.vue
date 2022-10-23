<template>

  <div v-loading="loading" style="background-color: #FFFFFF; padding: 10px; height: 100%; box-sizing: border-box;">
    <div style="background-color: #F5F7FA; box-sizing: border-box; padding: 6px;">
      <el-button @click="handleCancel">取消</el-button>
      <el-button @click="handleConfirm" type="primary" plain>确定</el-button>
    </div>
    <div style="width: 100%; max-width: 800px; height: calc(100% - 32px - 12px)">
      <el-scrollbar always>
        <el-divider content-position="left">基本信息</el-divider>
        <el-form :model="formData" label-width="80px" ref="formRef" :rules="rules" status-icon>
          
          <el-form-item label="标识" prop="key">
            <el-input v-model="formData.key" />
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="formData.name" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" :rows="2" v-model="formData.remark" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="formData.status">
              <el-radio-button :label="0">正常</el-radio-button>
              <el-radio-button :label="1">禁用</el-radio-button>
            </el-radio-group>
          </el-form-item>
          
        </el-form>
        <el-divider content-position="left">编码规则</el-divider>
        <el-form :model="formData.code_gen_rule" label-width="80px" ref="formRuleRef" :rules="codeRules" status-icon>
          <el-form-item label="类型">
            <el-radio-group v-model="formData.code_gen_rule.type">
              <el-radio-button label="fixed">固定</el-radio-button>
              <el-radio-button label="class">Java类</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <template v-if="formData.code_gen_rule.type === 'fixed'">
            <el-form-item label="前缀" prop="prefix">
              <el-input v-model="(formData.code_gen_rule as FixedGenRule).prefix" style="width: 150px" />
            </el-form-item>
            <el-form-item label="连接符" prop="delimiter">
              <el-select v-model="(formData.code_gen_rule as FixedGenRule).delimiter" placeholder="无" clearable style="width: 150px">
                <el-option label="-" value="-" />
                <el-option label="_" value="_" />
              </el-select>
            </el-form-item>
            <el-form-item label="日期" prop="date_format">
              <el-select v-model="(formData.code_gen_rule as FixedGenRule).date_format" style="width: 150px">
                <el-option label="yyyyMMdd" value="yyyyMMdd" />
                <el-option label="yyyyMM" value="yyyyMM" />
                <el-option label="yyyy" value="yyyy" />
                <el-option label="yy" value="yy" />
              </el-select>
            </el-form-item>
            <el-form-item label="连接符" prop="joiner">
              <el-select v-model="(formData.code_gen_rule as FixedGenRule).joiner" placeholder="无" clearable style="width: 150px">
                <el-option label="-" value="-" />
                <el-option label="_" value="_" />
              </el-select>
            </el-form-item>
            <el-form-item label="编号位数" prop="num_format">
              <el-select v-model="(formData.code_gen_rule as FixedGenRule).num_format" style="width: 150px">
                <el-option label="#" :value="1" />
                <el-option label="##" :value="2" />
                <el-option label="###" :value="3" />
                <el-option label="####" :value="4" />
                <el-option label="#####" :value="5" />
                <el-option label="######" :value="6" />
              </el-select>
            </el-form-item>
          </template>
          <template v-else-if="formData.code_gen_rule.type === 'class'">
            <el-form-item label="类名" prop="class_name">
              <template #label>
                <form-item-tooltip
                  title="类名"
                  content="Java类的全限定类名：必须继承com.l1yp.workflow.base.IGenCode"
                />
              </template>
              <el-input v-model="(formData.code_gen_rule as ClassGenRule).class_name" style="width: 150px" />
            </el-form-item>
          </template>
        </el-form>
      </el-scrollbar>
    </div>

  </div>


</template>
<script lang="ts" setup>
import { ElForm, ElFormItem, ElInput, ElRadioGroup, ElRadioButton, ElSelect, ElOption, ElButton, ElDivider, FormRules, ElScrollbar } from "element-plus";
import { ref } from "vue";
import FormItemTooltip from "@/components/form/FormItemTooltip.vue";
import { useWorkflowApi } from "@/service/workflow";

interface Emits {
  (e: 'close'): void
  (e: 'success'): void
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
  status: 1,
})

function handleCancel() {
  emits('close')
}

async function handleConfirm() {
  try {
    await formRef.value.validate()
    await formRuleRef.value.validate()
  } catch (e) {
    console.error(e);
    return
  }

  const result = await addDef(formData.value)
  if (result) {
    emits('close')
    emits('success')
  }
}

const rules: FormRules = {
  key: {
    trigger: 'blur',
    required: true,
    pattern: /^[a-zA-Z_]+\w?$/,
    message: '必须以字母或下划线开头'
  },
  name: {
    trigger: 'blur',
    required: true,
    message: '名称长度有误',
  },

}

const codeRules: FormRules = {
  prefix: {
    trigger: 'blur',
    required: true,
    message: '前缀不能为空'
  },
  date_format: {
    trigger: 'blur',
    required: true,
    message: '日期格式不能为空'
  },
  num_format: {
    trigger: 'blur',
    required: true,
    message: '编号数不能为空'
  },
  class_name: {
    trigger: 'blur',
    required: true,
    message: '类名不能为空'
  }
}

const formRef = ref<InstanceType<typeof ElForm>>()
const formRuleRef = ref<InstanceType<typeof ElForm>>()

</script>