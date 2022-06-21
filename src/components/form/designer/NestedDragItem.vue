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
            v-if="element.refreshState"
            v-bind="element.attrs"
            @click.stop="handleClickElement(element)"
            :class="vFormActiveElement === element ? ['drag-selected'] : []"
          >
            <el-col
              v-if="item.refreshState"
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
        <template v-else-if="'el-checkbox-group' === element.component">
          <el-form-item
            :prop="element.id"
            v-bind="element.formItemAttrs"
            @click.stop="handleClickElement(element)"
            :class="vFormActiveElement === element ? ['drag-selected'] : []"
          >
            <el-checkbox-group v-if="element.refreshState" v-bind="element.attrs" v-model="formData[element.id]">
              <el-checkbox label="Option1"></el-checkbox>
              <el-checkbox label="Option2"></el-checkbox>
              <el-checkbox label="Option3"></el-checkbox>
<!--              <el-checkbox-->
<!--                v-for="item in element.children"-->
<!--                v-bind="item.attrs"-->
<!--              />-->
            </el-checkbox-group>
          </el-form-item>
        </template>
        <template v-else-if="'el-select' === element.component">
          <el-form-item
            :prop="element.id"
            v-bind="element.formItemAttrs"
            @click.stop="handleClickElement(element)"
            :class="vFormActiveElement === element ? ['drag-selected'] : undefined"
          >
            <el-select v-if="element.refreshState" v-bind="element.attrs" v-model="formData[element.id]">
              <template v-if="element.options?.type === 'fixed'">
                <el-option
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                  v-for="item in element.options?.value"
                >
                </el-option>
              </template>
              <template v-if="element.options?.type === 'dict'">
                <el-option
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                  v-for="item in filterDictValue(element.options?.value?.scope, element.options?.value?.ident)"
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
import {defineComponent, inject, ref} from "vue";
import { ElForm, ElFormItem, ElInput, ElSelect, ElRow, ElCol, ElCheckboxGroup, ElCheckbox, ElOption } from "element-plus"
import SVGIcon from "@/components/common/SVGIcon.vue";
import {dictValuesKey, vFormActiveElementKey} from "@/config/app.keys";



export default defineComponent({
  name: "NestedDragItem",
  components: { Draggable, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElRow, ElCol, SVGIcon, ElCheckboxGroup, ElCheckbox },
  props: {
    children: Array
  },
  setup(props, { emit }) {

    const vFormActiveElement = inject(vFormActiveElementKey)
    const formData = ref({})

    function handleClickElement(elem) {
      // console.log(elem)
      vFormActiveElement.value = elem
    }

    const dictValues = inject(dictValuesKey)
    function filterDictValue(scope: string, ident: string) {
      return dictValues.value.filter(it => it.scope === scope && it.ident === ident)
    }

    return {
      vFormActiveElement, handleClickElement, formData, filterDictValue
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