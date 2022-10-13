<template>
  <div class="user-selector-input">
    <el-tree-select
      :key="selectKey"
      v-model="selectedElems"
      filterable
      clearable
      collapse-tags
      collapse-tags-tooltip
      fit-input-width
      :multiple="props.multiple"
      @dblclick="handleDblClick"
      :loading="loading"
      tag-type="success"
      :placeholder="placeholder"
      node-key="id"
      check-strictly
      default-expand-all
      ref="selectRef"
      style="width: 100%"
      :props="{ label: 'title', children: 'children' }"
      :data="varTableOptions"
    >

    </el-tree-select>
    <dept-selector-modal
      v-model:visible="modalVisible"
      v-model="selectedElems"
      :data="varTableOptions"
      :multiple="props.multiple"
      @confirm="handleConfirm"
    />
  </div>
</template>

<script lang="ts" setup>
import { ElSelect, ElTreeSelect } from "element-plus";
import { computed, onBeforeMount, ref } from "vue";
import DeptSelectorModal from "./DeptSelectorModal.vue";
import {useDeptInfo} from "@/service/system/dept";

interface Props {
  multiple?: boolean
  placeholder?: string
  modelValue: string | string[] | null
  varOptions?: DeptView[]
}

interface Emits {
  (e: 'update:modelValue', val: string | string[]): void
  (e: 'change', v: string | string[])
}

const selectRef = ref<InstanceType<typeof ElSelect>>()
const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  placeholder: '输入部门名称搜索或双击弹框选择',
})
const emits = defineEmits<Emits>()


const selectedElems = computed<string[] | string>({
  get: () => {
    return props.modelValue || ''
  },
  set: v => {
    emits('update:modelValue', v)
    emits('change', v)
  }
})


const selectKey = ref<number>(Math.random())
const loading = ref<boolean>(false)

const { tableData, loadDept } = useDeptInfo(loading)
onBeforeMount(loadDept)

const varTableOptions = computed<DeptView[]>(() => {
  const data = tableData.value
  if (!props.varOptions?.length) {
    return data
  } else {
    return [...props.varOptions, ...tableData.value]
  }
})


function handleDblClick() {
  modalVisible.value = true
}

function handleConfirm() {
  // const varOps = props.varOptions || []
  // const varDeptIds = new Set<string>(varOps.map(it => it.id))
  // options.value = [
  //   ...varOps,
  //   ...toRaw(selectedElems.value).filter(it => !varDeptIds.has(it.id)),
  // ]
}

const modalVisible = ref<boolean>(false)

</script>