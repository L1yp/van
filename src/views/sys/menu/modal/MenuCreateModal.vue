<template>
  <VDialog
    v-model="visible"
    :title="props.mode === 'create' ? '创建菜单' : '更新菜单'"
    width="800px"
    @cancel="visible = false"
    @confirm="handleConfirm"
    @open="handleOpen"
  >

  <el-form :model="formData" label-width="100px" scroll-to-error>
    <ElRow>
      <ElFormItem label="类型" prop="type">
        <ElRadioGroup v-model="formData.type" :disabled="props.mode === 'update'">
          <ElRadioButton label="FOLDER">文件夹</ElRadioButton>
          <ElRadioButton label="TAB">页面容器</ElRadioButton>
          <ElRadioButton label="PAGE">页面</ElRadioButton>
          <ElRadioButton label="PROCESS">流程</ElRadioButton>
          <ElRadioButton label="ENTITY">实体</ElRadioButton>
          <ElRadioButton label="BUTTON">按钮</ElRadioButton>
        </ElRadioGroup>
      </ElFormItem>
    </ElRow>
    <component :is="configComponents[formData.type]" :form-data="formData" :menu-tree="props.menuTree" />
  </el-form>


  </VDialog>

</template>

<script lang="ts" setup>
import VDialog from '@/components/dialog/VDialog.vue';
import { computed, markRaw, ref } from 'vue';
import {
  ElForm, ElFormItem, ElRadioGroup, ElRadioButton, ElRow, ElCol,
} from "element-plus";
import FolderForm from './form/FolderForm.vue'
import TabsForm from './form/TabsForm.vue'
import PageForm from './form/PageForm.vue'
import ProcessForm from './form/ProcessForm.vue'
import ButtonForm from './form/ButtonForm.vue'

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

const formData = ref<MenuAddParam | MenuUpdateParam>({
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
  PROCESS: markRaw(ProcessForm),
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
  else if (['PROCESS', 'ENTITY'].includes(type)) {
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