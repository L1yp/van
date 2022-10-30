<template>
  <div style="border: 1px solid #E3E3E3; height: 298px">
    <el-scrollbar height="298px" always>
      <el-checkbox-group v-model="val.option_value_id_list">
        <div>
          <div
            class="field-wrapper"
            v-for="option in props.options"
          >
            <el-checkbox :label="option.id" size="small" :disabled="option.disabled">{{option.name}}</el-checkbox>
          </div>
        </div>
      </el-checkbox-group>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { ElCheckbox, ElScrollbar, ElCheckboxGroup } from "element-plus";
import { computed } from "vue";
import { OptionConditionModel } from ".";

interface Props {
  options: ModelingOptionValueView[]
  modelValue: OptionFieldConditionModel
}

interface Emits {
  (e: 'update:modelValue', val: OptionConditionModel): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const val = computed<OptionFieldConditionModel>({
  get: () => {
    return props.modelValue
  },
  set: v => {
    emits('update:modelValue', v)
  },
})
</script>

<style scoped>
.field-wrapper {
  box-sizing: border-box;
  width: 100%;
  padding: 6px;
}

</style>