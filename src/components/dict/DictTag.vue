<template>
  <template v-if="multiple">
    <el-scrollbar>
      <el-tag
        v-for="item in values || 'success'"
        :key="item.id"
        :type="item.metaObj?.type"
        :hit="item.metaObj?.hit"
        :color="item.metaObj?.color"
        :size="item.metaObj?.size"
        :effect="item.metaObj?.effect"
        v-text="item.label"
      ></el-tag>
    </el-scrollbar>
  </template>
  <template v-else>
    <el-tag
      :type="values.metaObj?.type"
      :hit="values.metaObj?.hit"
      :color="values.metaObj?.color"
      :size="values.metaObj?.size"
      :effect="values.metaObj?.effect"
      v-text="values.label"
    ></el-tag>
  </template>

</template>

<script lang="ts">
import {ref, watch, inject, defineComponent, onUpdated} from "vue"
import { ElTag, ElScrollbar } from "element-plus"
import { dictValuesKey } from "@/config/app.keys";
import { DictTagProps } from "./util"


export default defineComponent({
  name: "DictTag",
  props: DictTagProps,
  components: {
    ElTag, ElScrollbar
  },
  setup(props) {
    const dictValues = inject(dictValuesKey)
    const values = ref<DictValue | DictValue[]>([])

    watch(() => props.val, () => updated(), { immediate: true })

    function updated() {
      if (props.valType === 'raw') {
        let local = undefined
        if (props.multiple) {
          const list = props.val as DictValue[]
          local = JSON.parse(JSON.stringify(list)) as DictValue[]
          local.forEach(it => it.metaObj = JSON.parse(it.meta))
        } else {
          const val = props.val as DictValue
          local = JSON.parse(JSON.stringify(val)) as DictValue
          local.metaObj = JSON.parse(local.meta)
        }
        values.value = local
        return
      }


      if (props.multiple) {
        const list = props.val as number[]
        const valSet = new Set<number>(list)
        const result = dictValues.value.filter(dictValue => dictValue.scope === props.scope && dictValue.ident === props.ident)
          .filter(it => props.valType === 'id' ? valSet.has(it.id) : valSet.has(it.val))

        const localDict = JSON.parse(JSON.stringify(result)) as DictValue[]
        localDict.forEach(it => it.metaObj = JSON.parse(it.meta))
        values.value = localDict
      } else {
        let val = props.val as number
        const candidate = dictValues.value.filter(dictValue => dictValue.scope === props.scope && dictValue.ident === props.ident)
          .find(it => props.valType === 'id' ? it.id === val : it.val == val)
        const localDict = JSON.parse(JSON.stringify(candidate)) as DictValue
        localDict.metaObj = JSON.parse(localDict.meta)
        values.value = localDict
      }
    }

    return {
      values
    }
  },
})
</script>

<style scoped>

</style>