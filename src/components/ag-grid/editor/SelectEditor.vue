<template>
  <div class="ag-cell-edit-wrapper">
    <el-select v-bind="params?.componentProps" v-model="selectedValue" :popper-class="AG_EDITOR_SELECT">
      <el-option
        v-for="option in params?.options"
        :key="option[params?.valueField || 'value']"
        :label="option[params?.labelField || 'label']"
        :value="option[params?.valueField || 'value']"
        :disabled="option[params?.disabledField || 'disabled'] === (params?.disabledValue === undefined ? true : params?.disabledValue)"
      />
    </el-select>
  </div>

</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref } from 'vue'
import { ElSelect, ElOption } from "element-plus";
import { CellEditorParams, AG_EDITOR_SELECT } from "@/components/ag-grid/editor/index";


interface SelectCellEditorParam extends CellEditorParams {
  options: any[]
  labelField: string
  valueField: string
  disabledField: string
  disabledValue: string | number | boolean
}

export default defineComponent({
  components: {
    ElSelect, ElOption,
  },
  props: {
    params: Object as PropType<SelectCellEditorParam>,
  },
  methods: {
    /**
     * the final value to send to the grid, on completion of editing
     */
    getValue() {
      return this.selectedValue
    },
    // 开始编辑之前 是否需要取消编辑
    /**
     * Gets called once before editing starts, to give editor a chance to cancel the editing before it even starts.
     */
    isCancelBeforeStart() {
      return false
    },
    /**
     * Gets called once when editing is finished (eg if Enter is pressed). If you return true, then the result of the edit will be ignored.
     */
    isCancelAfterEnd() {
      return false
    }
  },
  setup(props, ctx) {
    const selectedValue = ref<string>('')
    onMounted(() => {
      selectedValue.value = props.params?.value
    })


    return {
      selectedValue, AG_EDITOR_SELECT,
    }
  },

})
</script>