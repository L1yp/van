<template>
  <template v-if="props.type === 'datetime'">
    <el-date-picker
      type="datetime"
      v-model="val"
      value-format="YYYY-MM-DDTHH:mm:ss"
      v-bind="$attrs"
    />
  </template>
  <template v-if="props.type === 'duration'">
    <el-input v-model="val" disabled>
      <template #prepend>P</template>
      <template #append>
        <el-button :icon="Setting" @click="durationModalVisible = true"></el-button>
      </template>
    </el-input>
    <iso-time-duration-modal v-model:visible="durationModalVisible" v-model="val"/>
  </template>
  <template v-if="props.type === 'cycle'">
    <el-input v-model="val" disabled>
      <template #prepend>R</template>
      <template #append>
        <el-button :icon="Setting" @click="cycleModalVisible = true"></el-button>
      </template>
    </el-input>
    <iso-time-cycle-modal v-model:visible="cycleModalVisible" v-model="val"/>
  </template>
</template>
<script setup lang="ts">
import { IsoDatePickerEmits, IsoDatePickerProps } from "@/components/iso8601/index";
import { ElDatePicker, ElInput, ElButton } from "element-plus";
import { computed, ref } from "vue";
import { Setting } from "@element-plus/icons-vue";
import IsoTimeDurationModal from "@/components/iso8601/IsoTimeDurationModal.vue";
import IsoTimeCycleModal from "@/components/iso8601/IsoTimeCycleModal.vue";

const props = defineProps<IsoDatePickerProps>()
const emits = defineEmits<IsoDatePickerEmits>()

const val = computed({
  get() {
    return props.modelValue
  },
  set(v) {
    emits('update:modelValue', v)
  }
})

const durationModalVisible = ref(false)
const cycleModalVisible = ref(false)

</script>
<style scoped>

</style>