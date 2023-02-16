<template>
  <el-form-item :prop="['scheme', 'multiple']" label="多选">
    <el-radio-group v-model="props.formData.scheme.multiple" :disabled="props.disabled">
      <el-radio-button :label="true">是</el-radio-button>
      <el-radio-button :label="false">否</el-radio-button>
    </el-radio-group>
  </el-form-item>
  <el-form-item :prop="['scheme', 'optionComponent']" label="组件类型" required>
    <el-select v-model="props.formData.scheme.optionComponent" :disabled="props.disabled" style="width: 100%;" @change="handleComponentChange">
      <el-option v-if="!props.formData.scheme.multiple" label="单选框" value="radio" />
      <el-option v-if="!props.formData.scheme.multiple" label="单选按钮" value="radio-button" />
      <el-option v-if="!props.formData.scheme.multiple" label="下拉单选框" value="single-select" />
      <el-option v-if="props.formData.scheme.multiple" label="多选框" value="checkbox" />
      <el-option v-if="props.formData.scheme.multiple" label="多选按钮" value="checkbox-button" />
      <el-option v-if="props.formData.scheme.multiple" label="下拉多选框" value="multi-select" />
    </el-select>
  </el-form-item>
  <el-form-item :prop="['scheme', 'optionTypeId']" label="数据源" required>
    <el-select
      v-model="props.formData.scheme.optionTypeId"
      @change="v => findModelingOptionValues({typeId: v})"
      :disabled="props.disabled"
      style="width: 100%;"
    >
      <el-option
        v-for="type in modelingOptionTypes"
        :key="type.id" :label="type.name"
        :value="type.id"
      />
    </el-select>
  </el-form-item>
  <el-form-item :prop="['scheme', 'optionDefaultValue']" label="默认值">
    <el-tree-select
      :key="defValKey"
      v-model="props.formData.scheme.optionDefaultValue"
      filterable clearable fit-input-width
      :loading="loading"
      node-key="id"
      check-strictly
      default-expand-all
      :disabled="props.disabled"
      multiple
      :multiple-limit="props.formData.scheme.multiple ? 0 : 1"
      :props="{ label: 'name', children: 'children', disabled: 'disabled' }"
      :data="modelingOptionValues"
      style="width: 100%;"
    />
  </el-form-item>
</template>
<script lang="ts" setup>
import { useModelingOptionApi } from "@/service/modeling/option";
import { ElFormItem, ElRadioGroup, ElRadioButton, ElSelect, ElOption, ElTreeSelect } from "element-plus";
import { onBeforeMount, ref } from "vue";
import {useFieldStore} from "@/store/field-config";

interface Props {
  disabled?: boolean
  formData: ModelingFieldAddParam
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const loading = ref(false)
const {
  modelingOptionTypes, findModelingOptionTypes,
  modelingOptionValues, findModelingOptionValues
} = useModelingOptionApi(loading)

const store = useFieldStore()

onBeforeMount(() => findModelingOptionTypes({ scope: store.scope as OptionScope, mkey: store.mkey }))
onBeforeMount(() => props.formData.scheme.optionTypeId && findModelingOptionValues({ typeId: props.formData.scheme.optionTypeId }))

// 切换单选多选时 需要重载 select / tree-select组件， 否则会异常
const defValKey = ref(0)

function handleComponentChange() {
  defValKey.value++;
  props.formData.scheme.optionDefaultValue = []
}

</script>
<style scoped></style>