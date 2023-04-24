<template>

  <div v-loading="loading" style="background-color: var(--el-bg-color); padding: 10px; height: 100%; box-sizing: border-box;">
    <div style="background-color: var(--toolbar-bg-color); box-sizing: border-box; padding: 6px;">
      <el-button @click="handleCancel">取消</el-button>
      <el-button @click="handleConfirm" type="primary" plain>确定</el-button>
    </div>
    <div style="width: 100%; max-width: 800px; height: calc(100% - 32px - 12px)">
      <el-scrollbar always>
        <el-divider content-position="left">基本信息</el-divider>
        <el-form :model="formData" label-width="80px" :label-position="formLabelPosition" ref="formRef" :rules="rules" status-icon>

          <el-form-item label="标识" prop="mkey">
            <el-input v-model="formData.mkey" />
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="formData.name" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" :rows="2" v-model="formData.remark" />
          </el-form-item>

        </el-form>
      </el-scrollbar>
    </div>

  </div>


</template>
<script lang="ts" setup>
import { ElForm, ElFormItem, ElInput, ElButton, ElDivider, FormRules, ElScrollbar } from "element-plus";
import { ref } from "vue";
import { useEntityApi } from "@/service/modeling/entity";
import { formLabelPosition } from "@/store/layout";

interface Emits {
  (e: 'close'): void
  (e: 'success'): void
}

const emits = defineEmits<Emits>()

const loading = ref<boolean>(false)

const { addEntity } = useEntityApi(loading)

const formData = ref<ModelingEntityAddParam>({
  mkey: '',
  name: '',
  remark: '',
})

function handleCancel() {
  emits('close')
}

async function handleConfirm() {
  try {
    await formRef.value.validate()
  } catch (e) {
    console.error(e);
    return
  }

  const result = await addEntity(formData.value)
  if (result) {
    emits('close')
    emits('success')
  }
}

const rules: FormRules = {
  mkey: {
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


const formRef = ref<InstanceType<typeof ElForm>>()

</script>