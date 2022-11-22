<template>
  <el-form 
    ref="formRef"
    :model="props.formData" 
    :size="props.scheme.size" 
    :label-width="props.scheme.labelWidth"
    :label-position="props.scheme.labelPosition"
    v-bind="$attrs"
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
import { ElForm } from 'element-plus'
import { computed, provide, ref } from "vue";
import VFormNestedItem from "@/components/form/designer/VFormNestedItem.vue";
import { formModeKey } from "@/components/form/state.key";


interface Props {
  scheme: VFormScheme
  formData: object
}

const props = defineProps<Props>()

const mode = computed<FormFieldMode>(() => props.scheme.mode)
provide(formModeKey, mode)

const formRef = ref<InstanceType<typeof ElForm>>()

defineExpose({
  validate() {
    return formRef.value.validate()
  },
})

</script>

<style scoped>

</style>