<template>
  <VDialog
    v-model="visible"
    :title="props.mode === 'create' ? '创建角色' : '更新角色'"
    :width="deviceType === 'h5' ? '360px' : '720px'"
    :full-screen="deviceType === 'h5'"
    :fixed-body-height="deviceType === 'h5'"
    :use-body-scrolling="deviceType !== 'h5'"
    @cancel="visible = false"
    @confirm="handleConfirm"
    @open="handleOpen"
  >
    <el-form :model="formData" label-width="80px" :label-position="formLabelPosition" scroll-to-error>
      <el-form-item prop="name" label="名称" required>
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item prop="order_no" label="序号" required style="margin-bottom: 0">
        <el-input-number v-model="formData.order_no" :controls="false" style="width: 100%" />
      </el-form-item>
    </el-form>

  </VDialog>

</template>

<script lang="ts" setup>
import { ElForm, ElFormItem, ElInput, ElInputNumber } from 'element-plus'
import {computed, ref} from "vue";
import VDialog from "@/components/dialog/VDialog.vue";
import { getDeviceType } from '@/utils/common';
import { formLabelPosition } from "@/store/layout";

const deviceType = getDeviceType()

type ModalMode = 'create' | 'update'
interface Props {
  modelValue: boolean
  mode: ModalMode
  initData?: RoleView
}

interface Emits {
  (e: 'update:modelValue', v: boolean): void
  (e: 'confirm', formData: RoleUpdateParam): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()
const visible = computed({
  get: () => props.modelValue,
  set: v => emits('update:modelValue', v)
})

const formData = ref<RoleUpdateParam>({
  id: '',
  name: '',
  order_no: 1,
})

function handleOpen() {
  if (props.mode === 'create') {
    formData.value = {
      id: '',
      name: '',
      order_no: 1,
    }
  } else {
    Object.assign(formData.value, props.initData)
  }
}

function handleConfirm() {
  emits('confirm', formData.value)
}


</script>

<style scoped>

</style>