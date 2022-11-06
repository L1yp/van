<template>
  <template v-if="column.field.type === 'text' ">
    <el-input v-model="column.condition" style="width: 100%" />
  </template>
  <template v-else-if="column.field.type === 'date' ">
    <date-range-picker
      type="datetimerange"
      v-model="column.condition"
    />
  </template>
  <template v-else-if="column.field.type === 'user' ">
    <UserSelectorInput v-model="column.condition" :var-options="varUserOptions" />
  </template>
</template>

<script lang="ts" setup>
import { ElInput, ElDatePicker } from "element-plus";
import {computed} from "vue";
import UserSelectorInput from "@/components/common/selector/user/UserSelectorInput.vue";
import DateRangePicker from "./DateRangePicker.vue";

interface Props {
  column: ModelingViewColumnParam
}

const props = defineProps<Props>()

const varUserOptions: UserView[] = [
  {
    id: 'SELF',
    username: '本人',
    nickname: '本人',
    dept_id: 1,
  },
]
</script>

<style scoped>

</style>