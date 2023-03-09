<template>
  <template v-if="props.params.node.data.field.type === 'text' ">
    <el-input v-model="props.params.node.data.condition" v-bind="props.params.componentProps" style="width: 100%" />
  </template>
  <template v-else-if="props.params.node.data.field.type === 'date' ">
    <date-range-picker
      type="datetimerange"
      v-model="props.params.node.data.condition"
      v-bind="props.params.componentProps"
    />
  </template>
  <template v-else-if="props.params.node.data.field.type === 'user' ">
    <UserSelectorInput v-model="props.params.node.data.condition" :var-options="varUserOptions"  v-bind="props.params.componentProps" />
  </template>
  <template v-else-if="props.params.node.data.field.type === 'dept' ">
    <DeptSelectorInput v-model="props.params.node.data.condition" :var-options="varDeptOptions"  v-bind="props.params.componentProps" />
  </template>
  <template v-else-if="props.params.node.data.field.type === 'dept' ">
    <DeptSelectorInput v-model="props.params.node.data.condition" :var-options="varDeptOptions"  v-bind="props.params.componentProps" />
  </template>
  <template v-else-if="props.params.node.data.field.type === 'option' ">
    <el-tree-select
      :props="{ label: 'name', children: 'children' }"
      node-key="id"
      filterable clearable
      fit-input-width
      check-strictly
      default-expand-all
      :data="props.params.node.data.field.scheme.options || []"
      style="width: 100%"
      v-model="props.params.node.data.condition"
      v-bind="props.params.componentProps"
    />
  </template>
</template>

<script lang="ts" setup>
import { ElInput, ElTreeSelect } from 'element-plus'
import { ICellRendererParams } from "ag-grid-community";
import DateRangePicker from "@/views/modeling/view/condition/DateRangePicker.vue";
import UserSelectorInput from "@/components/common/selector/user/UserSelectorInput.vue";
import DeptSelectorInput from "@/components/common/selector/dept/DeptSelectorInput.vue";
import { varUserOptions, varDeptOptions } from "@/views/modeling/filter";

interface CellRendererParams extends ICellRendererParams {
  componentProps: Record<string, any>
}

interface Props {
  params: CellRendererParams
}

const props = defineProps<Props>()

</script>

<style scoped>
.user-selector-input {
  display: flex;
  align-items: center;
  width: 100%;
}



.el-input.el-input--small {
  height: var(--el-input-height);
}

</style>