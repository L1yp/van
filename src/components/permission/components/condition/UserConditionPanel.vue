<template>
  <div>
    <UserSelectorInput
      style="width: 100%"
      multiple
      v-model="condition.user_id_list"
      :user-map="userMap"
      :var-options="varOptions"
    />
    <div style="display: flex; margin-top: 10px;">
      <dept-selector-input
        style="width: 50%"
        v-model="condition.dept_id"
        :multiple="false"
        :clearable="false"
      />
      <div style="margin-left: 6px;">
        <el-checkbox v-model="condition.cascader" label="下级部门"/>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import UserSelectorInput from "@/components/common/selector/user/UserSelectorInput.vue";
import DeptSelectorInput from "@/components/common/selector/dept/DeptSelectorInput.vue";
import { computed, inject } from "vue";
import { varOptions } from './'
import { ElCheckbox } from "element-plus";
import { userMapKey } from "@/config/app.keys";

interface Props {
  modelValue: UserFieldConditionModel
}

interface Emits {
  (e: 'update:modelValue', val: UserFieldConditionModel): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const condition = computed<UserFieldConditionModel>({
  get: () => {
    return props.modelValue
  },
  set: v => {
    emits('update:modelValue', v)
  },
})

const userMap = inject(userMapKey)!

</script>

<style scoped>


</style>