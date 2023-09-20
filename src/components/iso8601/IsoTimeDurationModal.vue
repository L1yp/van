<template>
  <v-dialog
    v-model="modalVisible"
    title="时间段配置"
    width="202px"
    :fixed-body-height="false"
    use-body-scrolling
    @cancel="modalVisible = false"
    @confirm="handleConfirm"
    @opened="handleOpened"
  >
    <div style="display: flex; flex-direction: column; ">
      <div class="fragment-item">
        <el-checkbox v-model="yearC">年</el-checkbox>
        <el-input-number v-model="year" controls-position="right" size="small" :min="0" :max="9999" @change="v => handleValueChange('year', v)" />
      </div>
      <div class="fragment-item">
        <el-checkbox v-model="monthC">月</el-checkbox>
        <el-input-number v-model="month" controls-position="right" size="small" :min="0" :max="9999" @change="v => handleValueChange('month', v)" />
      </div>
      <div class="fragment-item">
        <el-checkbox v-model="dayC">日</el-checkbox>
        <el-input-number v-model="day" controls-position="right" size="small" :min="0" :max="9999" @change="v => handleValueChange('day', v)" />
      </div>
      <div class="fragment-item">
        <el-checkbox v-model="hourC">时</el-checkbox>
        <el-input-number v-model="hour" controls-position="right" size="small" :min="0" :max="9999" @change="v => handleValueChange('hour', v)" />
      </div>
      <div class="fragment-item">
        <el-checkbox v-model="minuteC">分</el-checkbox>
        <el-input-number v-model="minute" controls-position="right" size="small" :min="0" :max="9999" @change="v => handleValueChange('minute', v)" />
      </div>
      <div class="fragment-item">
        <el-checkbox v-model="secondC">秒</el-checkbox>
        <el-input-number v-model="second" controls-position="right" size="small" :min="0" :max="9999" @change="v => handleValueChange('second', v)" />
      </div>
    </div>
  </v-dialog>
</template>
<script setup lang="ts">
import VDialog from "@/components/dialog/VDialog.vue";
import { IsoTimeDurationEmits, IsoTimeDurationProps, parseISO8601Duration } from "@/components/iso8601/index";
import { computed, ref } from "vue";
import { ElCheckbox, ElInputNumber } from 'element-plus'

const props = defineProps<IsoTimeDurationProps>()
const emits = defineEmits<IsoTimeDurationEmits>()

const modalVisible = computed({
  get() {
    return props.visible
  },
  set(v) {
    emits('update:visible', v)
  }
})

const year = ref(0)
const month = ref(0)
const day = ref(0)
const hour = ref(0)
const minute = ref(0)
const second = ref(0)


const yearC = ref(false)
const monthC = ref(false)
const dayC = ref(false)
const hourC = ref(false)
const minuteC = ref(false)
const secondC = ref(false)

function handleValueChange(type: string, v?: number) {
  if (type === 'year') {
    yearC.value = !!v
  }
  else if (type === 'month') {
    monthC.value = !!v
  }
  else if (type === 'day') {
    dayC.value = !!v
  }
  else if (type === 'hour') {
    hourC.value = !!v
  }
  else if (type === 'minute') {
    minuteC.value = !!v
  }
  else if (type === 'second') {
    secondC.value = !!v
  }
}

function handleOpened() {
  const val = props.modelValue

  console.log('iso time duration modal val', val)

  const {
    years, months, days, hours, minutes, seconds
  } = parseISO8601Duration('P' + val)

  year.value = years
  month.value = months
  day.value = days
  hour.value = hours
  minute.value = minutes
  second.value = seconds

  yearC.value = !!years
  monthC.value = !!months
  dayC.value = !!days
  hourC.value = !!hours
  minuteC.value = !!minutes
  secondC.value = !!seconds

}


function handleConfirm() {
  const arr: string[] = []
  if (yearC.value && year.value) {
    arr.push(year.value + 'Y')
  }
  if (monthC.value && month.value) {
    arr.push(month.value + 'M')
  }
  if (dayC.value && day.value) {
    arr.push(day.value + 'D')
  }

  if ((hourC.value && hour.value) || (minuteC.value && minute.value) || (secondC.value && second.value)) {
    arr.push('T')

  }

  if (hourC.value && hour.value) {
    arr.push(hour.value + 'H')
  }
  if (minuteC.value && minute.value) {
    arr.push(minute.value + 'M')
  }
  if (secondC.value && second.value) {
    arr.push(second.value + 'S')
  }

  const result = arr.join('')
  console.log('join result', result)
  emits('update:modelValue', result)
  modalVisible.value = false
}
</script>
<style scoped>
.fragment-item {
  display: flex;
  align-items: center;
}

.fragment-item :deep(.el-input-number) {
  margin-left: 6px;
}

</style>