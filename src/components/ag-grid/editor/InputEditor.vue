<template>
  <div class="ag-cell-edit-wrapper">
    <el-input v-bind="params?.componentProps" v-model="text" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref } from 'vue'
import { ElInput } from "element-plus";
import { CellEditorParams } from "@/components/ag-grid/editor/index";


export default defineComponent({
  components: {
    ElInput,
  },
  props: {
    params: Object as PropType<CellEditorParams>,
  },
  methods: {
    /**
     * the final value to send to the grid, on completion of editing
     */
    getValue() {
      return this.text
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
    const text = ref<string>('')
    onMounted(() => {
      text.value = props.params?.value
    })
    return {
      text
    }
  },

})
</script>