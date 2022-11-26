<template>
  <v-dialog
    v-model="visible"
    :title="props.mode === 'create' ? '创建部门' : '更新部门'"
    :width="deviceType === 'h5' ? '360px' : '720px'"
    draggable
    :disable-footer="loading"
    @cancel="visible = false"
    @confirm="handleConfirm"
    @open="handleOpen"
  >
    <DeptCreateForm ref="createFormRef" v-if="props.mode === 'create'"  :form-data="createFormData" :loading="loading" />
    <DeptUpdateForm ref="updateFormRef" v-if="props.mode === 'update'" :form-data="updateFormData" :loading="loading" />
  </v-dialog>
</template>
<script lang="ts" setup>
import { useDeptInfo } from "@/service/system/dept";
import { computed, ref, toRaw } from "vue";
import DeptCreateForm from "./form/DeptCreateForm.vue";
import DeptUpdateForm from "./form/DeptUpdateForm.vue";
import VDialog from '@/components/dialog/VDialog.vue'
import { ElMessage } from "element-plus";
import { getDeviceType } from "@/utils/common";

const deviceType = getDeviceType()

type DialogMode = 'create' | 'update'
interface Props {
  modelValue: boolean
  mode: DialogMode
  initData?: DeptView
}

interface Emits {
  (e: 'update:modelValue', v: boolean): void
  (e: 'confirm'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()


const visible = computed({
  get: () => props.modelValue,
  set: v => emits('update:modelValue', v)
})

const loading = ref<boolean>(false)

const createFormData = ref<DeptAddParam>({
  title: '',
  simple_name: '',
  description: '',
  ident: '',
  order_no: 0,
  pid: '',
  owner: '',
  assistant: '',
  status: 0,
})

const updateFormData = ref<DeptUpdateParam>({
  id: '',
  title: '',
  simple_name: '',
  description: '',
  ident: '',
  order_no: 0,
  pid: '',
  owner: '',
  assistant: '',
  status: 0,
})

const { updateDept, addDept } = useDeptInfo()

const createFormRef = ref<InstanceType<typeof DeptCreateForm>>()
const updateFormRef = ref<InstanceType<typeof DeptUpdateForm>>()

function handleConfirm() {
  let promise: Promise<void> = null
  if (props.mode === 'create') {
    promise = createFormRef.value.validateForm().then(_ => addDept(createFormData.value))
  } else {
    promise = updateFormRef.value.validateForm().then(_ => updateDept(updateFormData.value))
  }
  promise
  .then(_ => emits('confirm'))
  .then(_ => visible.value = false)
  
  .catch(e => ElMessage.error((e as Error)?.message || '请检查表单项'))
  
}

function handleOpen() {
  if (props.mode === 'update') {
    Object.assign(updateFormData.value, props.initData)
    
    console.log('update form', toRaw(updateFormData.value));
    
  } else {
    createFormData.value = {
      title: '',
      simple_name: '',
      description: '',
      ident: '',
      order_no: 0,
      pid: '',
      owner: '',
      assistant: '',
      status: 0,
    }
  }
}

</script>

<style scoped></style>