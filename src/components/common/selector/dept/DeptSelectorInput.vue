<template>
  <div class="user-selector-input">
    <template v-if="props.preview">
<!--      <span v-text="displayValue"></span>-->
      <div>
        <el-tag v-for="option in selectedOptions" :key="option.id" v-text="option.title" type="success"></el-tag>

      </div>
    </template>
    <template v-else>
      <el-tree-select
        :key="selectKey"
        v-model="selectedElems"
        :disabled="props.disabled"
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
      />
    </template>

  </div>
</template>

<script lang="ts" setup>
import { ElSelect, ElTreeSelect ,ElTag } from "element-plus";
import { computed, onBeforeMount, ref } from "vue";
import DeptSelectorModal from "./DeptSelectorModal.vue";
import {useDeptInfo} from "@/service/system/dept";
import { findTreeItemById } from "@/utils/common";

interface Props {
  multiple?: boolean
  placeholder?: string
  modelValue?: string | string[] | null
  varOptions?: DeptView[]
  disabled?: boolean
  preview?: boolean
}

interface Emits {
  (e: 'update:modelValue', val: string | string[]): void
  (e: 'change', v: string | string[] | null | undefined): void
}

const selectRef = ref<InstanceType<typeof ElSelect>>()
const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  disabled: false,
  placeholder: '输入部门名称搜索或双击弹框选择',
  preview: false,
})
const emits = defineEmits<Emits>()


const selectedElems = computed<string[] | string>({
  get: () => {
    if (props.multiple) {
      return props.modelValue?.length ? props.modelValue : []
    }
    return props.modelValue ? props.modelValue : ''
  },
  set: v => {
    console.log('dept select setter', v)
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

const modalVisible = ref(false)

const selectedOptions = computed<DeptView[]>(() => {
  if (props.multiple && Array.isArray(props.modelValue)) {
    const list: DeptView[] = []
    for (let optionId of props.modelValue) {
      const option = findTreeItemById(tableData.value, 'id', optionId)
      if (!!option) {
        list.push(option)
      }
    }
    return list
  } else {
    const option = findTreeItemById(tableData.value, 'id', props.modelValue as string)
    return !!option ? [option] : []
  }
})


</script>

<style scoped>
span.el-tag + span.el-tag {
  margin-left: 6px;
}
</style>