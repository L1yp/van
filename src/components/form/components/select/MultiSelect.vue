<template>
  <template v-if="cMode === 'design'">
    <div>
      <el-select 
        v-model="val" 
        multiple 
        disabled 
        :value-key="props.valueField" 
        v-bind="$attrs"
        v-if="props.expand === false"
      >
        <el-option
          v-for="option in props.options"
          :key="option[props.valueField]"
          :label="option[props.labelField]"
          :value="option[props.valueField]"
          :disabled="option[props.disabledField]"
        >
        </el-option>
      </el-select>
      <el-checkbox-group disabled v-if="props.expand === true" v-model="val" v-bind="$attrs">
        <template v-if="props.buttonOption === true">
          <el-checkbox-button 
            v-for="option in props.options"  
            :label="option[props.valueField]"
            :key="option[props.valueField]"
            :disabled="option[props.disabledField]"
          >{{ option[props.labelField] }}
          </el-checkbox-button>
        </template>
        <template v-else>
          <el-checkbox 
            v-for="option in props.options"  
            :label="option[props.valueField]"
            :key="option[props.valueField]"
            :disabled="option[props.disabledField]"
          >{{ option[props.labelField] }}
          </el-checkbox>
        </template>

      </el-checkbox-group>
    </div>
    
  </template>
  <template v-else-if="cMode === 'edit'">
    <div>
      <el-select 
        v-model="val" 
        multiple
        collapse-tags
        collapse-tags-tooltip
        :value-key="props.valueField" 
        v-if="props.expand === false"
        v-bind="$attrs"
      >
        <el-option
          v-for="option in props.options"
          :key="option[props.valueField]"
          :label="option[props.labelField]"
          :value="option[props.valueField]"
          :disabled="option[props.disabledField]"
        >
        </el-option>
      </el-select>
      <el-checkbox-group v-if="props.expand === true" v-model="val" v-bind="$attrs">
        <template v-if="props.buttonOption === true">
          <el-checkbox-button 
            v-for="option in props.options"  
            :label="option[props.valueField]"
            :key="option[props.valueField]"
            :disabled="option[props.disabledField]"
          >{{ option[props.labelField] }}
          </el-checkbox-button>
        </template>
        <template v-else>
          <el-checkbox 
            v-for="option in props.options"  
            :label="option[props.valueField]"
            :key="option[props.valueField]"
            :disabled="option[props.disabledField]"
          >{{ option[props.labelField] }}
          </el-checkbox>
        </template>
      </el-checkbox-group>
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
import { ElSelect, ElOption, ElCheckboxGroup, ElCheckbox, ElCheckboxButton } from 'element-plus'
import { computed, inject, ref } from "vue";
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
  get: () => {
    if (props.value) {
      const result = props.value?.split(',') || []
      console.log('multi select modelValue get', result);
      return result
    } else {
      return []
    }
  },
  set: v => {
    const value = v?.join(',') || ''
    console.log('multi select modelValue set', value);
    
    emits('update:value', value)
  }
})

const displayValue = computed(() => {
  let vals = []
  if (props.value) {
    vals = props.value.split(',')
  }
  const optionsMap = new Map(props.options.map(it => [it[props.valueField], it]))
  const display = vals.map(it => optionsMap.get(it)?.[props.labelField] || it)?.join(',')

  return display
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