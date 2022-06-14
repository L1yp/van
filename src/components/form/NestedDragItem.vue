<template>
  <draggable
    :list="children || []"
    :group="{name: 'component'}"
    item-key="id"
    handle="div.drag-form-item"
  >
    <template #item="{ element }">
      <div class="drag-form-item">

        <template v-if="['el-row', 'el-col'].includes(element.component)">
          <component
            v-bind="element.attrs"
            :is="element.component"
          >
            <nested-drag-item style="width: 100%; min-height: 100px; " :children="element.children"></nested-drag-item>
          </component>
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
import SVGIcon from "@/components/common/SVGIcon.vue";

export default defineComponent({
  name: "NestedDragItem",
  components: { Draggable, ElForm, ElFormItem, ElInput, ElSelect, ElRow, ElCol, SVGIcon },
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
.drag-form-item {
  border: 1px dashed gray;
  position: relative;
}

.drag-form-item:hover {
  border: 1px dashed blue;
}

.drag-form-item + .drag-form-item {
  margin-top: 5px;
}

.drag-handle {
  cursor: move;
  position: absolute;
  top: 0;
  left: 0;
}

</style>