<template>
  <draggable
    style="width: 100%; height: 100%"
    :list="children || []"
    :group="{name: 'component'}"
    item-key="id"
    handle="div.drag-handle"
  >
    <template #item="{ element }">
      <div class="drag-handle">
        <template v-if="element.component === 'el-row'">
          <el-row v-bind="element.attrs">
            <nested-drag-item :children="element.children"></nested-drag-item>
          </el-row>

        </template>
        <template v-else>
          <el-form-item :prop="element.id" :label="element.label" :label-width="element.labelWidth">
            <component
              :is="element.component"
              v-bind="element.attrs"
            >
            </component>
          </el-form-item>
        </template>
      </div>

    </template>
  </draggable>

</template>

<script lang="ts">
import Draggable from "vuedraggable";
import {defineComponent} from "vue";
import { ElForm, ElFormItem, ElInput, ElSelect, ElRow, ElCol } from "element-plus"

export default defineComponent({
  name: "NestedDragItem",
  components: { Draggable, ElForm, ElFormItem, ElInput, ElSelect, ElRow, ElCol },
  props: {
    children: Array
  },
  setup(props, { emit }) {

    return {

    }
  }
})
</script>

<style scoped>
.drag-handle {
  border: 1px dashed gray;
}

.drag-handle:hover {
  border: 1px dashed blue;
}


</style>