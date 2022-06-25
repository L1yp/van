<template>
  <template v-if="dictInfo?.type === 1">
    <template v-if="options.length > 4">
      <el-select
        :modelValue="selectedItems" @update:modelValue="updateModelValue"
        :multiple="props.multiple"
        collapse-tags
        collapse-tags-tooltip
        clearable
        :placeholder="props.placeholder"
      >
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.label"
          :value="valType === 'id' ? item.id : item.val"
        />
      </el-select>
    </template>
    <template v-else>
      <template v-if="props.multiple">
        <el-checkbox-group :modelValue="selectedItems" @update:modelValue="updateModelValue">
          <el-checkbox-button v-for="item in options" :key="item.id" :label="valType === 'id' ? item.id : item.val">
            {{ item.label }}
          </el-checkbox-button>
        </el-checkbox-group>
      </template>
      <template v-else>
        <el-radio-group :modelValue="selectedItems" @update:modelValue="updateModelValue">
          <el-radio-button v-for="item in options" :label="valType === 'id' ? item.id : item.val">{{item.label}}</el-radio-button>
        </el-radio-group>
      </template>

    </template>

  </template>
  <template v-if="dictInfo?.type === 2">
    <el-tree-select
      :data="options"
      :props="defaultProps"
      :modelValue="selectedItems" @update:modelValue="updateModelValue"
      node-key="id"
      :multiple="props.multiple"
      :show-checkbox="props.multiple"
      check-on-click-node
      collapse-tags
      collapse-tags-tooltip
      clearable
      :check-strictly="props.checkStrictly"
    >
    </el-tree-select>
  </template>

</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  inject,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
  shallowRef,
  watch
} from "vue"
import {DictInputProps, DictInputEmits} from "./util";
import {
  ElSelect, ElOption, ElCheckboxGroup, ElCheckboxButton,
  ElRadioGroup, ElRadioButton, ElTreeSelect
} from "element-plus";
import {dictInfosKey, dictValuesKey} from "@/config/app.keys";


export default defineComponent({
  name: "DictInput",
  props: DictInputProps,
  emits: DictInputEmits,
  components: {
    ElSelect, ElOption, ElCheckboxGroup, ElCheckboxButton,
    ElRadioGroup, ElRadioButton, ElTreeSelect
  },
  setup(props, ctx) {
    const { emit: emits } = ctx

    const selectedItems = ref<number | number[]>(props.modelValue as (number | number[]))

    watch(
      () => props.modelValue,
      () => {
      console.log("dict-input watch props.modelValue", props.modelValue)
      selectedItems.value = props.modelValue as (number | number[])
    })

    function updateModelValue(val) {
      console.log("dict-input updateModelValue selectedItems", selectedItems.value, val)
      if (typeof val === "string") {
        console.log("clear emit ''")
        emits("update:modelValue", undefined);
      } else {
        emits("update:modelValue", val);
      }
    }
    const dictInfos = inject(dictInfosKey)
    const dictValues = inject(dictValuesKey)
    const dictInfo = computed<DictInfo>(() => dictInfos.value.find(it => it.ident === props.ident && it.scope === props.scope))
    const options = computed<DictValue[]>(() => {
      const items = dictValues.value.filter(dictValue => dictValue.scope === props.scope && dictValue.ident === props.ident && dictValue.status === 0)
      for (let item of items) {
        item.children = []
        item.value = item.val
      }
      if (dictInfo.value?.type === 1) {
        return items
      } else if (dictInfo.value?.type === 2) {
        const map = new Map<number, DictValue>(items.map(it => [it.id, it]))
        items.forEach(it => {
          if (map.has(it.pid)) {
            const item = map.get(it.pid)
            item.children.push(it)
          }
        })
        return items.filter(it => it.pid === 0)
      }
      return []
    })

    const defaultProps = {
      label: 'label', children: 'children',
    }
    return {
      props,
      selectedItems,
      options,
      updateModelValue,
      defaultProps,
      dictInfo,
    }
  },

})
</script>

<style scoped>

</style>