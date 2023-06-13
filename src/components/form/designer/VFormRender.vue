<template>
  <el-form
    ref="formRef"
    :model="props.formData"
    :size="props.scheme.size"
    :label-width="props.scheme.labelWidth"
    :label-position="labelPosition"
    v-bind="$attrs"
    :show-message="false"
    class="vform-render"
  >
    <v-form-nested-item
      v-for="item in props.scheme.children"
      :item="item"
      :key="item.id"
      :form-data="props.formData"
    ></v-form-nested-item>
  </el-form>
</template>

<script lang="ts" setup>
import { ElForm, FormInstance } from 'element-plus'
import { computed, provide, ref } from "vue";
import VFormNestedItem from "@/components/form/designer/VFormNestedItem.vue";
import { formModeKey } from "@/components/form/state.key";
import { getDeviceType } from '@/utils/common';


interface Props {
  scheme: VFormScheme
  formData: object
}

const props = defineProps<Props>()
console.log('==============',props)

const mode = computed<FormFieldMode>(() => props.scheme.mode)
provide(formModeKey, mode)

const formRef = ref<FormInstance>()

const deviceType = getDeviceType()
const labelPosition = computed(() => {
  if (props.scheme.labelPosition === 'auto') {
    return deviceType.value === 'h5' ? 'top' : 'right'
  }
  return props.scheme.labelPosition
})


defineExpose({
  formRef: formRef,
})

</script>

<style scoped>
.vform-render:not(.el-form--label-top) :deep(.el-select:hover:not(.el-select-disabled) .el-input__wrapper) {
  box-shadow: none !important;
}

.vform-render:not(.el-form--label-top) :deep(.el-select .el-input__wrapper.is-focus) {
  box-shadow: none !important;
}

.vform-render:not(.el-form--label-top) :deep(.el-form-item.is-error .el-input__wrapper) {
  box-shadow: none !important;
}

.vform-render:not(.el-form--label-top) :deep(.el-input__wrapper:hover) {
  box-shadow: none !important;
}

.vform-render:not(.el-form--label-top) :deep(.el-input__wrapper) {
  box-shadow: none !important;
}

.vform-render:not(.el-form--label-top) :deep(.el-select .el-input.is-focus .el-input__wrapper) {
  box-shadow: none !important;
}

.vform-render:not(.el-form--label-top) :deep(.el-form-item--default) {
  margin-bottom: 3px;
}

.vform-render:not(.el-form--label-top) :deep(.el-form-item) {
  border: 1px solid var(--el-border-color);
}

.vform-render:not(.el-form--label-top) :deep(.el-form-item__label) {
  border-right: 1px solid var(--el-border-color);
}

</style>