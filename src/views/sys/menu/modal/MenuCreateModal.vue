<template>
  <VDialog
    v-model="visible"
    :title="props.mode === 'create' ? '创建菜单' : '更新菜单'"
    @cancel="visible = false"
    @confirm="handleConfirm"
    @open="handleOpen"
    width="720px"
    :full-screen="deviceType === 'h5'"
    :fixed-body-height="deviceType === 'h5'"
    use-body-scrolling
  >
    <el-form :model="formData" label-width="100px" :label-position="formLabelPosition" scroll-to-error>
    <ElRow>
      <ElCol :span="24">
        <ElFormItem label="类型" prop="type" v-if="deviceType === 'pc'">
          <ElRadioGroup v-model="formData.type" :disabled="props.mode === 'update'">
            <ElRadioButton
              v-for="option in menuTypeOptions"
              :key="option.value"
              :value="option.value"
              :label="option.value"
            >
              {{option.label}}
            </ElRadioButton>
          </ElRadioGroup>
        </ElFormItem>
        <ElFormItem label="类型" prop="type" v-else>
          <el-select v-model="formData.type" :disabled="props.mode === 'update'" style="width: 100%;">
            <el-option v-for="option in menuTypeOptions" :key="option.value" :value="option.value" :label="option.label" />
          </el-select>
        </ElFormItem>
      </ElCol>
    </ElRow>
    <component :is="configComponents[formData.type]" :form-data="formData" :menu-tree="props.menuTree" />
  </el-form>
  </VDialog>

</template>

<script lang="ts" setup>
import VDialog from '@/components/dialog/VDialog.vue';
import { computed, markRaw, ref } from 'vue';
import {
  ElForm, ElFormItem, ElRadioGroup, ElRadioButton, ElRow, ElCol, ElSelect, ElOption,
} from "element-plus";
import FolderForm from './form/FolderForm.vue'
import TabsForm from './form/TabsForm.vue'
import PageForm from './form/PageForm.vue'
import ProcessForm from './form/ProcessForm.vue'
import ButtonForm from './form/ButtonForm.vue'
import { getDeviceType } from '@/utils/common';
import { formLabelPosition } from "@/store/layout";

const deviceType = getDeviceType()

const menuTypeOptions = [
  { label: '文件夹', value: 'FOLDER' },
  { label: '页面容器', value: 'TAB' },
  { label: '页面', value: 'PAGE' },
  { label: '流程', value: 'WORKFLOW' },
  { label: '实体', value: 'ENTITY' },
  { label: '按钮', value: 'BUTTON' },
]

interface Props {
  modelValue: boolean
  mode: 'create' | 'update'
  menuTree: MenuView[]
  initData?: MenuView
}

interface Emits {
  (e: 'update:modelValue', v: boolean): void
  (e: 'confirm', v: MenuAddParam | MenuUpdateParam): void
}
const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const visible = computed<boolean>({
  get: () => props.modelValue,
  set: v => emits('update:modelValue', v)
})

const formData = ref<any>({

  name: '',
  pid: '',
  type: 'PAGE',
  path: '',
  component: '',
  icon: '',
  order_no: 0,
  closeable: true,
  state: 0,
  remark: ''
})

const configComponents = {
  FOLDER: markRaw(FolderForm),
  TAB: markRaw(TabsForm),
  PAGE: markRaw(PageForm),
  WORKFLOW: markRaw(ProcessForm),
  ENTITY: markRaw(ProcessForm),
  BUTTON: markRaw(ButtonForm),
}

function handleConfirm() {
  normalizeFormData()
  emits('confirm', formData.value)
}

function normalizeFormData() {
  const type = formData.value.type
  if (type === 'FOLDER') {
    formData.value.closeable = null
    formData.value.component = null
    formData.value.path = null
  }
  else if (type === 'PAGE') {
    formData.value.closeable = null
  }
  else if (['WORKFLOW', 'ENTITY'].includes(type)) {
    formData.value.closeable = null
  }
  else if (type === 'BUTTON') {
    formData.value.closeable = null
    formData.value.path = null
    formData.value.icon = null
  }
}

function handleOpen() {
  formData.value = {
    name: '',
    pid: '',
    type: 'PAGE',
    path: '',
    component: '',
    icon: '',
    order_no: 0,
    closeable: true,
    state: 0,
    remark: ''
  }
  if (props.initData) {
    Object.assign(formData.value, props.initData)
  }
}

</script>

<style scoped>

</style>