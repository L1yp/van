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
  <template v-else-if="column.field.type === 'dept' ">
    <DeptSelectorInput v-model="column.condition" :var-options="varDeptOptions" />
  </template>
</template>

<script lang="ts" setup>
import { ElInput, ElDatePicker } from "element-plus";
import {computed} from "vue";
import UserSelectorInput from "@/components/common/selector/user/UserSelectorInput.vue";
import DateRangePicker from "./DateRangePicker.vue";
import DeptSelectorInput from "@/components/common/selector/dept/DeptSelectorInput.vue";

interface Props {
  column: ModelingViewColumnParam
}

const props = defineProps<Props>()


const varDeptOptions: DeptView[] = [
  {
    id: 'SELF_DPT',
    title: '本人部门',
  },
  {
    id: 'CHILD_DPT',
    title: '本人部门的下级部门',
  },
  {
    id: 'SELF_CHILD_DPT',
    title: '本人部门及下级部门',
  },
]


const varUserOptions: UserView[] = [
  {
    id: 'SELF',
    username: '本人',
    nickname: '本人',
    dept_id: 1,
  },
  {
    id: 'SELF_DPT',
    username: '本人部门',
    nickname: '本人部门',
    dept_id: 1,
  },
  {
    id: 'CHILD_DPT',
    username: '下级部门',
    nickname: '下级部门',
    dept_id: 1,
  },
  {
    id: 'SELF_CHILD_DPT',
    username: '本人部门及下级部门',
    nickname: '本人部门及下级部门',
    dept_id: 1,
  },
]
</script>

<style scoped>

</style>