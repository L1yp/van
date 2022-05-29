<template>
  <el-select
    v-model="selectedElems"
    remote
    clearable
    filterable
    collapse-tags
    collapse-tags-tooltip
    fit-input-width
    :multiple="multiple"
    @dblclick="handleDblClick"
    :remote-method="handleSearch"
    :loading="loading"
    tag-type="success"
    placeholder="双击选择部门"
    value-key="id"
    v-bind="$attrs"
    @change="handleSelectChanged"
  >
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.simple_name"
      :value="item"
    />
  </el-select>

  <dept-selector-modal
    ref="deptSelectorRef"
    :multiple="multiple"
    :modelValue="selectedElems"
    @update:modelValue="updateModelValue"
  >

  </dept-selector-modal>

</template>

<script lang="ts">
import {ref, watch, defineComponent, toRaw} from "vue";
import * as DeptApi from "@/api/sys/dept";
import { ElSelect, ElOption } from "element-plus"
import DeptSelectorModal from "@/components/common/selector/dept/DeptSelectorModal.vue";
import {DeptSelectorInputEmits, DeptSelectorInputProps} from "@/components/common/selector/dept/util";

export default defineComponent({
  props: DeptSelectorInputProps,
  emits: DeptSelectorInputEmits,
  components: {
    DeptSelectorModal, ElSelect, ElOption
  },
  setup(props, {emit: emits}){

    function updateModelValue(val: DeptView | DeptView[]) {
      console.log("updateModelValue", val)
      if (!val) {
        console.log("val", val)
        selectedElems.value = val
        emits('update:modelValue', val)
        return
      }
      let result;
      if (props.multiple) {
        selectedElems.value = val as DeptView[]
        if (props.valueKey && typeof props.valueKey === 'string') {
          result = (val as DeptView[]).map(it => it[props.valueKey as string])
        } else {
          result = val
        }
      } else {
        selectedElems.value = val as DeptView
        if (props.valueKey && typeof props.valueKey === 'string') {
          result = val[props.valueKey]
          console.log("result is ", result)
        } else {
          result = val
        }
      }

      emits('update:modelValue', result)
    }

    const loading = ref(false)
    const selectedElems = ref<DeptView | DeptView[]>(props.multiple ? [] : null)
    const options = ref<DeptView[]>([])

    watch(() => props.modelValue, () => {
      if (props.modelValue) {
        if (props.valueKey && typeof props.valueKey === 'string' && props.readViewFn && typeof props.readViewFn === 'function') {
          if (props.multiple) {
            if (!Array.isArray(props.modelValue)) {
              console.warn("[DeptSelectorInput] multiple is true, but modelValue is not Array")
            }
            const views: DeptView[] = []
            const userKeys = props.modelValue as any[]
            for (let userKey of userKeys) {
              const userView = props.readViewFn(userKey);
              views.push(userView)
            }
            selectedElems.value = views
            options.value = views

          } else {
            selectedElems.value = props.readViewFn(props.modelValue as any);
            options.value = [selectedElems.value as DeptView]

          }
        } else {
          selectedElems.value = props.modelValue as DeptView[]
          if (props.multiple) {
            options.value = props.modelValue as DeptView[]
          } else {
            options.value = [props.modelValue as DeptView]
          }
        }

      } else {
        selectedElems.value = props.multiple ? [] : null
      }
    }, {immediate: true})

    async function handleSearch(keyword: string) {
      if (!keyword) {
        options.value = [];
        return;
      }

      loading.value = true
      try {
        const data = await DeptApi.searchDept(keyword)
        // 无论搜索结果如何 都需要把 已选择的用户列出
        if (props.multiple) {
          const elems = selectedElems.value as DeptView[]
          const idSet = new Set<number>(elems.map(it => it.id))
          const result = data.filter(it => !idSet.has(it.id))
          options.value = [...toRaw(selectedElems.value  as DeptView[]), ...result]
        }
        else {
          const elem = selectedElems.value as DeptView
          if (elem) {
            const result = data.filter(it => it.id !== elem.id)
            options.value = [elem, ...result]
          } else {
            options.value = data
          }

        }
      } catch (e) {
        console.error(e)
      } finally {
        loading.value = false
      }
    }

    function handleSelectChanged() {
      emits('update:modelValue', selectedElems.value)
    }


    const deptSelectorRef = ref<InstanceType<typeof DeptSelectorModal>>()

    function handleDblClick() {
      deptSelectorRef.value.open()
    }

    return {
      updateModelValue, loading, selectedElems, options, handleSearch, deptSelectorRef, handleDblClick,
      handleSelectChanged
    }
  },
})



</script>

<style scoped>

</style>