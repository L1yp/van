<template>
  <div style="border: 1px solid #E3E3E3; height: 298px">
    <el-scrollbar height="298px" always>
      <el-tree
        ref="treeRef"
        :props="{ label: 'name', children: 'children' }"
        :data="props.options"
        node-key="id"
        check-strictly show-checkbox default-expand-all check-on-click-node
        :expand-on-click-node="false"
        :default-checked-keys="props.modelValue"
        @check-change="handleCheckChange"
      />
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { ElCheckbox, ElScrollbar, ElCheckboxGroup, ElTree } from "element-plus";
import {computed, ref} from "vue";
import { OptionConditionModel } from ".";

interface Props {
  options: ModelingOptionValueView[]
  modelValue: string[]
}
interface Emits {
  (e: 'update:modelValue', val: string[]): void
}
const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const treeRef = ref<InstanceType<typeof ElTree>>()
function handleCheckChange() {
  const keys = treeRef.value.getCheckedKeys(false) as string[]
  emits('update:modelValue', keys)
}

</script>