<template>
  <draggable
    :list="children || []"
    :group="{name: 'component'}"
    item-key="id"
    handle="div.drag-form-item"
    ghostClass="ghost"
  >
    <template #item="{ element }">
      <div class="drag-form-item">

        <template v-if="'el-row' === element.component">
          <el-row
            v-bind="element.attrs"
            @click.stop="handleClickElement(element)"
            :class="vFormActiveElement === element ? ['drag-selected'] : []"
          >
            <el-col
              v-bind="item.attrs"
              v-for="item in element.children"
              :key="item.id"
              @click.stop="handleClickElement(item)"
              :class="vFormActiveElement === item ? ['drag-selected'] : []"
            >
              <nested-drag-item style="width: 100%; height: 100%; " :children="item.children"></nested-drag-item>
            </el-col>
          </el-row>
        </template>

        <template v-else-if="'el-select' === element.component">
          <el-form-item
            :prop="element.id"
            v-bind="element.formItemAttrs"
            @click.stop="handleClickElement(element)"
            :class="vFormActiveElement === element ? ['drag-selected'] : undefined"
          >
            <el-select :key="element.key" v-bind="element.attrs" v-model="formData[element.id]">
              <template v-if="element.options?.type === 'fixed'">
                <el-option
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                  v-for="item in element.options?.value"
                >
                </el-option>
              </template>
              <template v-if="element.options?.type === 'url'">

              </template>
            </el-select>
          </el-form-item>
        </template>

        <template v-else>
          <el-form-item
            :prop="element.id"
            v-bind="element.formItemAttrs"
            @click.stop="handleClickElement(element)"
            :class="vFormActiveElement === element ? ['drag-selected'] : []"
          >
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
import {defineComponent, inject, nextTick, ref} from "vue";
import { ElForm, ElFormItem, ElInput, ElSelect, ElRow, ElCol, ElCheckboxGroup, ElCheckbox, ElOption } from "element-plus"
import SVGIcon from "@/components/common/SVGIcon.vue";
import emitter from "@/event/mitt";
import UserSelectorInput from "@/components/common/selector/user/UserSelectorInput.vue";
import DeptSelectorInput from "@/components/common/selector/dept/DeptSelectorInput.vue";
import TextInput from "../components/input/TextInput.vue"
import TextAreaInput from "../components/input/TextAreaInput.vue"
import { vFormActiveElementKey } from "@/config/app.keys";

export default defineComponent({
  name: "NestedDragItem",
  components: {
    Draggable, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElRow, ElCol, SVGIcon, ElCheckboxGroup, ElCheckbox,
    UserSelectorInput, DeptSelectorInput, TextInput, TextAreaInput,
  },
  props: {
    children: Array
  },
  setup(props, { emit }) {

    emitter.on('selectMultipleChanged', (event) => {
      console.log('selectedMultipleChanged', event, formData.value[event.prop])
      vFormActiveElement.value.attrs.multiple = event.multiple
      if (event.multiple) {
        formData.value[event.prop] = []
      } else {
        formData.value[event.prop] = undefined
      }
    })

    const vFormActiveElement = inject(vFormActiveElementKey)
    const formData = ref({})

    function handleClickElement(elem) {
      // console.log(elem)
      vFormActiveElement.value = elem
    }

    return {
      vFormActiveElement, handleClickElement, formData
    }
  }
})
</script>

<style scoped>

:deep(.el-row) {
  padding: 10px
}

:deep(.el-row) {
  border: 1px dashed gray;
}

:deep(.el-col) {
  border: 1px dashed gray;
}

.drag-form-item {
  position: relative;
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

.drag-selected {
  outline: 2px solid #409EFF;
}

</style>