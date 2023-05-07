<template>
  <div class="user-selector-input">
    <el-select
      :key="selectKey"
      v-model="selectedElems"
      remote
      filterable
      clearable
      collapse-tags
      collapse-tags-tooltip
      fit-input-width
      multiple
      :multiple-limit="props.multiple ? 0 : 1"
      @dblclick="handleDblClick"
      :remote-method="handleSearch"
      :loading="loading"
      tag-type="success"
      :placeholder="props.placeholder"
      value-key="id"
      :disabled="props.disabled"
      ref="selectRef"
      style="width: 100%"
    >
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.nickname"
        :value="item"
      />
    </el-select>
    <user-selector-modal
      v-model:visible="modalVisible"
      v-model="selectedElems"
      :multiple="props.multiple"
      @confirm="handleConfirm"
    />
  </div>
</template>

<script lang="ts" setup>
import { ElSelect, ElOption, ElMessage } from "element-plus";
import { computed, inject, ref, toRaw, watch } from "vue";
import UserSelectorModal from "./UserSelectorModal.vue";
import { useUserData } from "@/service/system/user";
import { useUserMap } from "@/config/app.hooks";

interface Props {
  multiple?: boolean
  placeholder?: string
  modelValue?: string | string[] | null
  varOptions?: UserView[] // 变量选项: 本人, 本部门, 下级部门
  disabled?: boolean
}

interface Emits {
  (e: 'update:modelValue', val: string | string[]): void
  (e: 'change', val: string | string[]): void
}

const selectRef = ref<InstanceType<typeof ElSelect>>()
const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  multiple: false,
  placeholder: '输入用户搜索或双击弹框',
})
const emits = defineEmits<Emits>()

const userMap = useUserMap()

const selectedElems = computed<UserView[]>({
  get: () => {
    if (!props.modelValue || !props.modelValue) {
      return []
    }
    if (props.multiple) {
      if(!(props.modelValue as string[]).every(it => userMap.has(it))) {
        console.warn('cannot find userInfo struct in userMap')
      }
      return (props.modelValue as string[]).map(it => userMap?.get(it)!)

    } else {
      if (props.modelValue && !userMap.has(props.modelValue as string)) {
        console.warn('cannot find userInfo struct in userMap')
      }
      return props.modelValue ? [userMap.get(props.modelValue as string)!] : []
    }

  },
  set: v => {
    v.forEach(it => userMap?.set(it.id, it))
    if (props.multiple) {
      emits('update:modelValue', v?.length ? v.map(it => it.id) : [])
      emits('change', v?.length ? v.map(it => it.id) : [])
    } else {
      emits('update:modelValue', v?.length ? v[0].id : '')
      emits('change', v?.length ? v[0].id : '')
    }

  }
})

const options = ref<UserView[]>([])

watch(() => [selectedElems.value, options.value], () => {
  //console.log('watch selectedElems and options', (selectedElems.value), (options.value));

  if (!options.value.length && props.varOptions?.length) {
    options.value = [...props.varOptions]
    return
  }

  // 选项列表
  const optionIdMap = new Set<string>(options.value.map(it => it.id))
  // 已选列表
  const selectedElemMap = new Map<string, UserView>(selectedElems.value.map(it => [it.id, it]))

  // 已选列表中存在一部分选项 不存在与选项列表中
  if (!selectedElems.value.map(it => it.id).every(it => optionIdMap.has(it))) {
    //
    const candidateElems = selectedElems.value.map(it => it.id) // 转成id 列表
      .filter(it => !optionIdMap.has(it)) // 过滤出 选项列表中不存在的选项id
      .map(it => selectedElemMap.get(it)!) // 把不存在的选项id 转成选项列表

    options.value = [...options.value, ...candidateElems]
  }

}, { immediate: true })

const selectKey = ref<number>(Math.random())
const loading = ref<boolean>(false)

function handleDblClick() {
  !props.disabled && (modalVisible.value = true)
}

const { tableData, searchUserList } = useUserData(loading)
async function handleSearch(keyword: string) {
  if (!keyword) {
    return
  }
  try {
    await searchUserList(keyword)
    const varOps = props.varOptions || []
    const varUserIds = new Set<string>(varOps.map(it => it.id))
    const selectedUserIds = new Set<string>(toRaw(selectedElems.value).map(it => it.id))
    options.value = [
      ...varOps,
      ...toRaw(selectedElems.value).filter(it => !varUserIds.has(it.id)),
      ...toRaw(tableData.value).filter(it => !selectedUserIds.has(it.id))
    ]
    // nextTick(() => selectRef.value?.focus())
  } catch (e) {
    ElMessage.error((e as Error)?.message || '搜索失败')
  }
}

function handleConfirm() {
  const varOps = props.varOptions || []
  const varUserIds = new Set<string>(varOps.map(it => it.id))
  console.log('selectedElems', toRaw(selectedElems.value));

  options.value = [
    ...varOps,
    ...selectedElems.value.filter(it => !varUserIds.has(it.id)),
  ]
}

const modalVisible = ref<boolean>(false)

</script>