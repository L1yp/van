<template>
  <div style="border: 1px solid #E3E3E3; height: 300px">
    <el-scrollbar height="300px" always>
      <el-radio-group v-model="val.data_type">
        <div>
          <div class="field-wrapper"><el-radio label="DAY" size="small">今天</el-radio></div>
          <div class="field-wrapper"><el-radio label="WEEK" size="small">本周</el-radio></div>
          <div class="field-wrapper"><el-radio label="MONTH" size="small">本月</el-radio></div>
          <div class="field-wrapper"><el-radio label="QUARTER" size="small">本季度</el-radio></div>
          <div class="field-wrapper"><el-radio label="YEAR" size="small">今年</el-radio></div>
          <div class="field-wrapper">
            <el-radio label="FIXED" size="small">固定</el-radio>
            <date-range-picker
              :disabled="val.data_type !== 'FIXED'"
              style="width: 250px;"
              v-model="val.range"
              type="daterange"
              range-separator="~"
              start-placeholder="Start date"
              end-placeholder="End date"
              size="small"
            />
          </div>
        </div>
      </el-radio-group>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { ElScrollbar, ElRadioGroup, ElRadio, ElDatePicker } from "element-plus";
import { computed } from "vue";
import DateRangePicker from "@/views/modeling/view/condition/DateRangePicker.vue";

interface Props {
  modelValue: DateFieldConditionModel
}

interface Emits {
  (e: 'update:modelValue', val: DateFieldConditionModel): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const val = computed<DateFieldConditionModel>({
  get: () => {
    return props.modelValue
  },
  set: v => {
    emits('update:modelValue', v)
  }
})

</script>

<style scoped>

.field-wrapper {
  box-sizing: border-box;
  width: 100%;
  padding: 6px;
}
</style>