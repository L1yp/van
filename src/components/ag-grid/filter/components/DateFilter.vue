<template>
  <template v-if="props.params.dateType === 'date'">
    <date-range-picker
      v-bind="props.params.componentProps"
      type="daterange"
      @change="handleValueChange"
     />
  </template>
  <template v-if="props.params.dateType === 'datetime'">
    <date-range-picker
      v-bind="props.params.componentProps"
      type="datetimerange"
      v-model="selected"
      @change="handleValueChange"
    />
  </template>
  <template v-if="props.params.dateType === 'month'">
    <date-range-picker
      v-bind="props.params.componentProps"
      v-model="selected"
      type="monthrange"
      @change="handleValueChange"
    />
  </template>
</template>

<script lang="ts" setup>
import { IHeaderGroupParams } from "ag-grid-community";
import {ref} from "vue";
import DateRangePicker from "@/views/modeling/view/condition/DateRangePicker.vue";

interface HeaderFilterComponentParam extends IHeaderGroupParams {
  dateType: 'date' | 'datetime' | 'month'
  initValue: [Date, Date]
  onChange: (v: string) => void
  componentProps: Record<string, any>
}

interface Props {
  params: HeaderFilterComponentParam
}

const props = defineProps<Props>()

const selected = ref<[Date, Date]>(props.params.initValue)
function handleValueChange(v: string) {
  props.params.onChange(v)
}

</script>