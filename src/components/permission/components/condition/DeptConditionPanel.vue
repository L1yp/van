<template>
  <div style="box-sizing: border-box; display: flex;">
    <DeptSelectorInput
      style="width: calc(100% - 84px);"
      v-model="val.dept_id"
      :var-options="varDptOptions"
    />
    <div style="margin-left: 6px;">
      <el-checkbox v-model="val.cascader" label="下级部门"/>
    </div>


  </div>
</template>

<script lang="ts" setup>
import DeptSelectorInput from "@/components/common/selector/dept/DeptSelectorInput.vue";
import { computed } from "vue";
import { ElCheckbox } from "element-plus";
import { DeptConditionModel, varDptOptions } from './'

interface Props {
  modelValue: DeptFieldConditionModel
}

interface Emits {
  (e: 'update:modelValue', val: DeptConditionModel): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const val = computed<DeptFieldConditionModel>({
  get: () => {
    return props.modelValue
  },
  set: v => {
    emits('update:modelValue', v)
  }
})


</script>

<style scoped>


</style>