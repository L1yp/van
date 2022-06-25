<template>
  <el-select
    :key="selectKey"
    v-model="selectedElems"
    remote
    filterable
    clearable
    collapse-tags
    collapse-tags-tooltip
    fit-input-width
    :multiple="multiple"
    @dblclick="handleDblClick"
    :remote-method="handleSearch"
    :loading="loading"
    tag-type="success"
    :placeholder="placeholder"
    value-key="id"
    v-bind="$attrs"
    @change="updateModelValue"
    ref="selectRef"
  >
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.label"
      :value="item"
    />
  </el-select>

  <user-selector-modal
    ref="userSelectorRef"
    :multiple="multiple"
    :modelValue="selectedElems"
    @update:modelValue="updateModelValue"
  >

  </user-selector-modal>

</template>

<script lang="ts">
import {ref, watch, defineComponent, nextTick} from "vue";
import * as UserApi from "@/api/sys/user";
import UserSelectorModal from "@/components/common/selector/user/UserSelectorModal.vue";
import { ElSelect, ElOption } from "element-plus"
import { UserSelectorInputProps, UserSelectorInputEmits } from './util'
import {primitiveArrayEquals} from "@/utils/common";


export default defineComponent({
  props: UserSelectorInputProps,
  emits: UserSelectorInputEmits,
  components: {
    UserSelectorModal, ElSelect, ElOption,
  },
  setup(props, {emit: emits}) {
    const selectRef = ref<InstanceType<typeof ElSelect>>()
    const selectKey = ref<number>(Math.random())
    function updateModelValue(val: UserView | UserView[]) {
      console.log("updateModelValue", val, selectRef.value)
      if (!val) {
        console.log("val", val)
        selectedElems.value = val
        emits('update:modelValue', val)
        return
      }
      let result;
      if (props.multiple) {
        selectedElems.value = val as UserView[]
        if (props.valueKey && typeof props.valueKey === 'string') {
          result = (val as UserView[]).map(it => it[props.valueKey as string]) // BUG  as string
        } else {
          result = val
        }
      } else {
        selectedElems.value = val as UserView
        if (props.valueKey && typeof props.valueKey === 'string') {
          result = val[props.valueKey]
          console.log("result is ", result)
        } else {
          result = val
        }
      }

      emits('update:modelValue', result)
      nextTick(() => selectRef.value?.blur())
    }

    const loading = ref(false)
    const selectedElems = ref<UserView | UserView[]>(props.multiple ? [] : null)
    const options = ref<UserView[]>([])

    watch(() => props.modelValue, () => {
      if (props.modelValue) {
        if (props.valueKey && typeof props.valueKey === 'string') {
          if (props.multiple) {
            if (!Array.isArray(props.modelValue)) {
              console.warn("[SelectorInput] multiple is true, but modelValue is not Array")
            }
            const views: UserView[] = []
            const userKeys = props.modelValue as any[]
            const currentKeys = (selectedElems.value as UserView[]).map(it => it[props.valueKey as string])

            if (primitiveArrayEquals(userKeys, currentKeys)) {
              options.value = selectedElems.value as UserView[]
            } else {
              if (props.readViewFn && typeof props.readViewFn === 'function') {
                for (let userKey of userKeys) {
                  const userView = props.readViewFn(userKey);
                  views.push(userView)
                }
                selectedElems.value = views
                options.value = views
              } else {
                console.error("[user-selector-input] please provide read-view-fn")
              }
            }

          } else {
            if (selectedElems.value && selectedElems.value[props.valueKey] === props.modelValue) {
              options.value = [selectedElems.value as UserView]
            } else {
              if (props.readViewFn && typeof props.readViewFn === 'function') {
                selectedElems.value = props.readViewFn(props.modelValue as any);
                options.value = [selectedElems.value as UserView]
              } else {
                console.error("please provide read-view-fn")
              }

            }
          }
        } else {
          selectedElems.value = props.modelValue as UserView[]
          if (props.multiple) {
            options.value = props.modelValue as UserView[]
          } else {
            options.value = [props.modelValue as UserView]
          }
        }

      } else {
        selectedElems.value = props.multiple ? [] : null
      }
    }, {immediate: true})
    watch(() => props.multiple, () => {
      selectedElems.value = props.multiple ? [] : undefined
      selectKey.value++
    })

    async function handleSearch(keyword: string) {
      if (!keyword) {
        options.value = [];
        return;
      }
      const params: UserQueryParam = {
        username: keyword,
        nickname: keyword,
        phone: keyword,
        email: keyword,
        pageIdx: 1,
        pageSize: 500
      }
      loading.value = true
      try {
        const data = await UserApi.pageUserList(params)
        // 无论搜索结果如何 都需要把 已选择的用户列出
        if (props.multiple) {
          const elems = selectedElems.value as UserView[]
          const idSet = new Set<number>(elems.map(it => it.id))
          const result = data.filter(it => !idSet.has(it.id))
          options.value = [...elems, ...result]
        }
        else {
          const elem = selectedElems.value as UserView
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

    const userSelectorRef = ref<InstanceType<typeof UserSelectorModal>>()

    function handleDblClick() {
      userSelectorRef.value.open()
    }


    return {
      updateModelValue, loading, selectedElems, options, handleSearch,
      userSelectorRef, handleDblClick, selectRef, selectKey
    }

  },
})






</script>

<style scoped>

</style>