<template>
  <div style="width: 100%; height: 100%;">
    <div style="box-sizing: border-box; padding: 6px; background-color: var(--toolbar-bg-color); ">
      <el-button @click="emits('close')">取消</el-button>
      <el-button @click="handleConfirm" plain type="primary">确定</el-button>
    </div>

    <el-form
      ref="formRef"
      :model="formData"
      label-width="80px"
      style="padding: 10px; width: 100%; max-width: 800px; height: calc(100% - 32px - 12px - 1px); box-sizing: border-box; "
    >
      <el-form-item prop="name" label="名称" required>
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item prop="remark" label="说明">
        <el-input v-model="formData.remark" :rows="2" type="textarea" />
      </el-form-item>
    </el-form>

  </div>
</template>

<script lang="ts" setup>
import { useModelingOptionApi } from "@/service/modeling/option";
import { ElForm, ElFormItem, ElButton, ElInput } from "element-plus";
import { ref } from "vue";

interface Props {
  scope: OptionScope
  mkey?: string
  module?: ModelingModule
}

interface Emits {
  (e: 'close'): void
  (e: 'success'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const formData =  ref<ModelingOptionTypeAddParam>({
  mkey: props.mkey,
  name: '',
  remark: '',
  scope: props.scope,
})

const loading = ref(false)

const {
  addOptionType,
} = useModelingOptionApi(loading)

const formRef = ref<InstanceType<typeof ElForm>>()
async function handleConfirm() {
  try {
    await formRef.value.validate()
  } catch (e) {
    console.error(e);
    return
  }

  const result = await addOptionType(formData.value)
  if (result) {
    emits('success')
    emits('close')
  }

}

</script>

<style scoped>

</style>