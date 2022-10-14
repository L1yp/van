<template>
  <el-form ref="formRef" :model="props.formData" size="default" :label-width="80" v-loading="props.loading">
    <el-row>
      <el-col :span="12">
        <el-form-item label="名称" prop="title" required>
          <el-input v-model="props.formData.title"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="简称" prop="simple_name" required>
          <el-input v-model="props.formData.simple_name"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="标识" prop="ident" required>
          <el-input v-model="props.formData.ident"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="排序" required>
          <el-input-number :controls="false" v-model="props.formData.order_no" style="width: 100%"></el-input-number>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="领导" prop="owner" required>
          <user-selector-input
            v-model="props.formData.owner"
            value-key="id"
            :user-map="userMap"
            placeholder="双击选择用户"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="助理" prop="assistant" required>
          <user-selector-input
            v-model="props.formData.assistant"
            value-key="id"
            :user-map="userMap"
            placeholder="双击选择用户"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="状态" prop="status" required>
          <DictInput v-model="props.formData.status" :ident="STATUS" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="描述" prop="description">
          <el-input v-model="props.formData.description"></el-input>
        </el-form-item>
      </el-col>
      
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-form-item label="上级部门" prop="pid">
          <DeptSelectorInput v-model="props.formData.pid" style="width: 100%" />
        </el-form-item>
      </el-col>

    </el-row>


  </el-form>
</template>

<script lang="ts" setup>
import { ElForm, ElFormItem, ElRow, ElCol, ElInput, ElInputNumber } from "element-plus";
import DeptSelectorInput from "@/components/common/selector/dept/DeptSelectorInput.vue";
import DictInput from "@/components/dict/DictInput.vue";
import { STATUS } from "@/components/dict/dict";
import UserSelectorInput from '@/components/common/selector/user/UserSelectorInput.vue'
import { inject, ref } from "vue";
import { userMapKey } from "@/config/app.keys";

interface Props {
  formData: DeptAddParam
  loading: boolean
}

const props = defineProps<Props>()

const userMap = inject(userMapKey)

const formRef = ref<InstanceType<typeof ElForm>>()
function validateForm() {
  return formRef.value.validate()
}

defineExpose({
  validateForm
})


</script>