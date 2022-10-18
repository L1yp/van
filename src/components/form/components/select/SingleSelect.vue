<template>
  <template v-if="cMode === 'design'">
    <div>
      <el-select v-model="val" disabled v-bind="$attrs" v-if="props.expand === false">
        <el-option
          v-for="option in props.options"
          :key="option[props.valueField]"
          :label="option[props.labelField]"
          :value="option[props.valueField]"
          :disabled="option[props.disabledField]"
        >
        </el-option>
      </el-select>
      <el-radio-group disabled v-model="val" v-bind="$attrs" v-if="props.expand === true">
        <template v-if="props.buttonOption === false">
          <el-radio
            v-for="option in props.options"
            :key="option[props.valueField]"
            :label="option[props.valueField]"
            :disabled="option[props.disabledField]"
          >{{ option[props.labelField] }}</el-radio>
        </template>
        <template v-else>
          <el-radio-button
            v-for="option in props.options"
            :key="option[props.valueField]"
            :label="option[props.valueField]"
            :disabled="option[props.disabledField]"
          >{{ option[props.labelField] }}</el-radio-button>
        </template>
      </el-radio-group>
    </div>

  </template>
  <template v-else-if="cMode === 'edit'">
    <div>
      <el-select v-model="val" v-bind="$attrs" v-if="props.expand === false">
        <el-option
          v-for="option in props.options"
          :key="option[props.valueField]"
          :label="option[props.labelField]"
          :value="option[props.valueField]"
          :disabled="option[props.disabledField]"
        >
        </el-option>
      </el-select>
      <el-radio-group v-model="val" v-bind="$attrs" v-if="props.expand === true">
        <template v-if="props.buttonOption === false">
          <el-radio
            v-for="option in props.options"
            :key="option[props.valueField]"
            :label="option[props.valueField]"
            :disabled="option[props.disabledField]"
          >{{ option[props.labelField] }}</el-radio>
        </template>
        <template v-else>
          <el-radio-button
            v-for="option in props.options"
            :key="option[props.valueField]"
            :label="option[props.valueField]"
            :disabled="option[props.disabledField]"
          >{{ option[props.labelField] }}</el-radio-button>
        </template>
      </el-radio-group>
    </div>
  </template>
  <template v-else-if="cMode === 'read' ">
    <span v-text="displayValue"></span>
  </template>
  <template v-else-if="cMode === 'hidden' ">
    <span v-show="false" v-text="displayValue"></span>
  </template>
</template>

<script lang="ts" setup>
import { ElSelect, ElOption, ElRadioGroup, ElRadio, ElRadioButton } from 'element-plus'
import { FormFieldMode } from "@/components/form/types";
import { computed, inject } from "vue";
import { formModeKey } from "@/components/form/state.key";

interface Props {
  mode?: FormFieldMode
  value?: string
  expand?: boolean
  buttonOption?: boolean
  options: object[]
  labelField?: string
  valueField?: string
  disabledField?: string
}

interface Emits {
  (e: 'update:value', v: string): void
}

const props = withDefaults(defineProps<Props>(), {
  labelField: 'name',
  valueField: 'id',
  disabledField: 'disabled',
  expand: false,
  buttonOption: false,
})

const emits = defineEmits<Emits>()

const val = computed({
  get: () => props.value,
  set: v => emits('update:value', v)
})

const displayValue = computed(() => {
  return props.options.find(it => it[props.valueField] === props.value)?.[props.labelField] || ''
})

const formMode = inject(formModeKey)
const cMode = computed<FormFieldMode>(() => {
  if (props.mode) {
    return props.mode
  }
  if (formMode?.value) {
    return formMode.value
  }
  return "edit"
})


</script>

<style scoped>

</style>