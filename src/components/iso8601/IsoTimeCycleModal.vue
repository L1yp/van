<template>
  <v-dialog
    v-model="modalVisible"
    title="循环时间配置"
    width="500px"
    :fixed-body-height="false"
    :use-body-scrolling="false"
    @cancel="modalVisible = false"
    @confirm="handleConfirm"
    @opened="handleOpened"
  >
    <el-form-item label="重复次数" label-width="80">
      <el-input-number v-model="round" controls-position="right" :value-on-clear="undefined" />
    </el-form-item>
    <el-form-item label="开始时间" label-width="80" style="margin-top: 16px">
      <el-date-picker
        type="datetime"
        v-model="startDate"
        value-format="YYYY-MM-DDTHH:mm:ssZ"
        clearable
        style="width: 100%"
      />
    </el-form-item>
    <el-form-item label="周期间隔" required label-width="80" style="margin-top: 16px">
      <iso-date-picker v-model="period" type="duration" />
    </el-form-item>
  </v-dialog>
</template>
<script setup lang="ts">
import VDialog from "@/components/dialog/VDialog.vue";
import { IsoTimeDurationEmits, IsoTimeDurationProps, parseISO8601RepeatingInterval } from "@/components/iso8601/index";
import { computed, ref } from "vue";
import { ElInputNumber, ElFormItem, ElDatePicker, ElMessage } from 'element-plus'
import IsoDatePicker from "@/components/iso8601/IsoDatePicker.vue";

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

const round = ref<number | undefined>(undefined)
const startDate = ref<string | null>(null)
const period = ref('')

function handleOpened() {
  if (!props.modelValue) {
    return
  }

  const val = props.modelValue

  console.log('iso time cycle modal val', val)
  try {
    const result = parseISO8601RepeatingInterval('R' + val)
    round.value = result.round
    startDate.value = result.startDate
    period.value = result.period.substring(1)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '解析失败')
  }



}


function handleConfirm() {
  if (!period.value) {
    ElMessage.error('请输入时间间隔')
    return
  }

  if (startDate.value) {
    const result = `${!round.value ? '' : round.value}/${startDate.value}/P${period.value}`
    emits('update:modelValue', result)
  } else {
    const result = `${!round.value ? '' : round.value}/P${period.value}`
    emits('update:modelValue', result)
  }

  modalVisible.value = false
}
</script>
<style scoped>

</style>