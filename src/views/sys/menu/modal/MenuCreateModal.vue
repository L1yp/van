<template>
  <VDialog
    v-model="visible"
    :title="props.mode === 'create' ? '创建菜单' : '更新菜单'"
  >

  <el-form :model="formData" label-width="100px" scroll-to-error>

    <ElRow>

      <ElCol :span="12">
        <ElFormItem label="名称" prop="name">
          <ElInput v-model="formData.name"></ElInput>
        </ElFormItem>
      </ElCol>
      <ElCol :span="12">
        <ElFormItem label="序号" prop="order_no">
          <ElInputNumber v-model="formData.order_no"></ElInputNumber>
        </ElFormItem>
      </ElCol>
    </ElRow>

    <ElRow>
      <ElFormItem label="类型" prop="type">
        <ElRadioGroup v-model="formData.type">
          <ElRadioButton label="FOLDER">文件夹</ElRadioButton>
          <ElRadioButton label="TAB">页面容器</ElRadioButton>
          <ElRadioButton label="PAGE">页面</ElRadioButton>
          <ElRadioButton label="PROCESS">流程</ElRadioButton>
          <ElRadioButton label="BUTTON">按钮</ElRadioButton>
        </ElRadioGroup>
      </ElFormItem>
    </ElRow>


  </el-form>


  </VDialog>

</template>

<script lang="ts" setup>
import VDialog from '@/components/dialog/VDialog.vue';
import { computed, ref } from 'vue';
import { 
  ElForm, ElFormItem, ElRadioGroup, ElRadioButton, ElInput, ElTreeSelect, ElInputNumber, 
  ElRow, ElCol,
} from "element-plus";

interface Props {
  modelValue: boolean
  mode: 'create' | 'update'
  menuTree: MenuView[]
}

interface Emits {
  (e: 'update:modelValue', v: boolean): void
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
  hidden: false,
  closeable: true,
  state: 0,
  remark: ''
})


</script>

<style scoped>

</style>