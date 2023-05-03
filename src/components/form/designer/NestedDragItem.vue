<template>
  <draggable
    :list="children || []"
    :group="{name: 'component'}"
    item-key="id"
    handle="div.drag-handle"
    ghostClass="ghost"
  >
    <template #item="{ element }">
      <div class="widget-item" :class="vFormActiveElement === element ? 'active' : ''" @click.stop="handleClickElement(element)">

        <template v-if="'el-row' === element.component">
          <el-row
            v-bind="element.attrs"
            style="min-height: 100px; padding: 6px;"
            class="widget-row-item"
            :class="vFormActiveElement === element ? 'active' : ''"
          >
            <el-col
              v-bind="item.attrs"
              v-for="item in element.children"
              :key="item.id"
              @click.stop="handleClickElement(item)"
              class="widget-col-item"
              :class="vFormActiveElement === item ? 'active' : ''"
              style="min-height: 80px; padding: 6px; "
            >
              <nested-drag-item style="width: 100%; height: 100%; background-color: #fff; " :children="item.children"></nested-drag-item>
              <div v-if="vFormActiveElement === item" class="field-id">
                <span v-text="item.id"></span>
              </div>
              <div v-if="vFormActiveElement === item" class="widget-action">
                <div title="复制" @click.stop="handleCopyElem">
                  <CopyDocument class="widget-action-icon"/>
                </div>
                <div title="删除" @click.stop="handleDeleteElem">
                  <Delete class="widget-action-icon" />
                </div>
              </div>
            </el-col>
          </el-row>
          <div v-if="vFormActiveElement === element" class="drag-handle">
            <s-v-g-icon class="drag-icon" name="Drag"/>
          </div>
          <div v-if="vFormActiveElement === element" class="field-id">
            <span v-text="element.id"></span>
          </div>
          <div v-if="vFormActiveElement === element" class="widget-action">
            <div title="添加栅格列" @click.stop="handleAddCol">
              <Plus class="widget-action-icon" />
            </div>
            <div title="复制" @click.stop="handleCopyElem">
              <CopyDocument class="widget-action-icon"/>
            </div>
            <div title="删除" @click.stop="handleDeleteElem">
              <Delete class="widget-action-icon" />
            </div>
          </div>
        </template>

        <template v-else-if="'table' === element.component">
          <table
            v-bind="element.attrs"
            style="min-height: 100px; padding: 6px; width: 100%"
            class="widget-table"
            :class="vFormActiveElement === element ? 'active' : ''"
          >
            <tr
              v-for="tr in element.children"
              v-bind="tr.attrs"
              :key="tr.id"
              @click.stop="handleClickElement(tr)"
              style="min-height: 100px; width: 100%"
              class="widget-table-tr"
              :class="vFormActiveElement === tr ? 'active' : ''"
            >
              <td
                v-for="td in tr.children"
                :key="td.id"
                @click.stop="handleClickElement(td)"
                v-bind="td.attrs"
                style="min-height: 88px; padding: 6px; min-width: 100px; box-sizing: border-box"
                class="widget-table-td"
                :class="vFormActiveElement === td ? 'active' : ''"
              >
                <nested-drag-item style="width: 100%; height: 100%; min-height: 76px; background-color: #fff; " :children="td.children"></nested-drag-item>
                <div v-if="vFormActiveElement === td" class="field-id">
                  <span v-text="td.id"></span>
                </div>
                <div v-if="vFormActiveElement === td" class="widget-action">
                  <div title="复制" @click.stop="handleCopyElem">
                    <CopyDocument class="widget-action-icon"/>
                  </div>
                  <div title="删除" @click.stop="handleDeleteElem">
                    <Delete class="widget-action-icon" />
                  </div>
                </div>
              </td>
            </tr>
          </table>
          <div v-if="vFormActiveElement === element" class="drag-handle">
            <s-v-g-icon class="drag-icon" name="Drag"/>
          </div>
          <div v-if="vFormActiveElement === element" class="field-id">
            <span v-text="element.id"></span>
          </div>
          <div v-if="vFormActiveElement === element" class="widget-action">
            <div title="添加栅格列" @click.stop="handleAddCol">
              <Plus class="widget-action-icon" />
            </div>
            <div title="复制" @click.stop="handleCopyElem">
              <CopyDocument class="widget-action-icon"/>
            </div>
            <div title="删除" @click.stop="handleDeleteElem">
              <Delete class="widget-action-icon" />
            </div>
          </div>
        </template>

        <template v-else-if="'form-item' === element.category">
          <el-form-item
            :prop="element.id"
            v-bind="element.formItemAttrs"
            :label-width="element.formItemAttrs.hiddenLabel ? '0px' : undefined"
            :label="element.formItemAttrs.hiddenLabel ? '' : element.formItemAttrs.label"
            :rules="getRules(element)"
          >
            <component
              :is="element.component"
              v-bind="element.attrs"
              v-model:value="formData[element.id]"
            >

            </component>
          </el-form-item>

          <div v-if="vFormActiveElement === element" class="drag-handle">
            <s-v-g-icon class="drag-icon" name="Drag"/>
          </div>
          <div v-if="vFormActiveElement === element" class="field-id">
            <span v-text="element.id"></span>
          </div>
          <div v-if="vFormActiveElement === element" class="widget-action">
            <div title="复制" @click.stop="handleCopyElem">
              <CopyDocument class="widget-action-icon"/>
            </div>
            <div @click.stop="handleDeleteElem" title="删除">
              <Delete class="widget-action-icon" />
            </div>

          </div>

        </template>

        <template v-else-if="'display' === element.category">
          <component
            :is="element.component"
            v-bind="element.attrs"
          >
          </component>

          <div v-if="vFormActiveElement === element" class="drag-handle">
            <s-v-g-icon class="drag-icon" name="Drag"/>
          </div>
          <div v-if="vFormActiveElement === element" class="field-id">
            <span v-text="element.id"></span>
          </div>
          <div v-if="vFormActiveElement === element" class="widget-action">
            <div title="复制" @click.stop="handleCopyElem">
              <CopyDocument class="widget-action-icon"/>
            </div>
            <div @click.stop="handleDeleteElem" title="删除">
              <Delete class="widget-action-icon" />
            </div>

          </div>
        </template>

      </div>

    </template>
  </draggable>

</template>

<script lang="ts">
import Draggable from "vuedraggable";
import {defineComponent, inject, onUnmounted, PropType, ref, toRaw} from "vue";
import { ElForm, ElFormItem, ElInput, ElSelect, ElRow, ElCol, ElCheckboxGroup, ElCheckbox, ElOption, FormItemRule } from "element-plus"
import SVGIcon from "@/components/common/SVGIcon.vue";
import emitter, {SelectMultipleChangedEvent} from "@/event/mitt";
import UserSelectorInput from "@/components/common/selector/user/UserSelectorInput.vue";
import DeptSelectorInput from "@/components/common/selector/dept/DeptSelectorInput.vue";
import DatePicker from "../components/date/DatePicker.vue"
import DateRangePicker from "../components/date/DateRangePicker.vue"
import TextInput from "../components/input/TextInput.vue"
import NumberInput from "../components/input/NumberInput.vue"
import SingleSelect from "../components/select/SingleSelect.vue"
import MultiSelect from "../components/select/MultiSelect.vue"
import UserSelect from "../components/select/UserSelect.vue"
import DeptSelect from "../components/select/DeptSelect.vue"
import LabelField from "../components/display/LabelField.vue"
import { vFormActiveElementKey } from "@/components/form/state.key";
import { genId } from "@/components/form/designer/util/common";
import { Plus, Delete, CopyDocument } from "@element-plus/icons-vue";
import { findTreeItemParentById } from "@/utils/common";

export default defineComponent({
  name: "NestedDragItem",
  components: {
    Draggable, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElRow, ElCol, SVGIcon, ElCheckboxGroup, ElCheckbox,
    UserSelectorInput, DeptSelectorInput, NumberInput, TextInput, SingleSelect, MultiSelect, UserSelect, DeptSelect,
    Plus, Delete, CopyDocument, DatePicker, DateRangePicker, LabelField,
  },
  props: {
    children: Array as PropType<ComponentConfig[]>
  },
  setup(props, { emit }) {

    function selectMultipleChangedHandler(event: SelectMultipleChangedEvent) {
      console.log('selectedMultipleChanged', event, formData.value[event.prop])
      vFormActiveElement.value.attrs.multiple = event.multiple
      if (event.multiple) {
        formData.value[event.prop] = []
      } else {
        formData.value[event.prop] = undefined
      }
    }

    emitter.on('selectMultipleChanged', selectMultipleChangedHandler)

    onUnmounted(() => emitter.off('selectMultipleChanged', selectMultipleChangedHandler))

    const vFormActiveElement = inject(vFormActiveElementKey)

    const formData = ref({})

    function handleClickElement(elem) {
      // console.log(elem)
      vFormActiveElement.value = elem
    }

    function handleAddCol() {
      const colElem: ComponentConfig = {
        id: 'col_' + Number(genId()).toString(36),
        component: 'el-col',
        category: 'layout',
        formItemAttrs: undefined,
        attrs: {
          span: 12,
          offset: 0,
          push: 0,
          pull: 0,
          tag: 'div',
        },
        children: [],
        key: 1,
      }
      vFormActiveElement.value.children.push(colElem)

    }

    function handleDeleteElem() {
      const parent = findTreeItemParentById(props.children, 'id', vFormActiveElement.value.id)
      if (!parent.length) {
        console.log('找不到目标节点');
        return
      }
      /// find in tree idx
      const activeIdx = parent.indexOf(vFormActiveElement.value)
      activeIdx !== -1 && parent.splice(activeIdx, 1)
      emitter.emit('removeFieldInDesigner', { field: vFormActiveElement.value.id })
    }

    function handleCopyElem() {
      const parent = findTreeItemParentById(props.children, 'id', vFormActiveElement.value.id)
      if (!parent.length) {
        console.log('找不到目标节点');
        return
      }

      const activeIdx = parent.indexOf(vFormActiveElement.value)
      const original = toRaw(vFormActiveElement.value)
      const copyElem: ComponentConfig = copyWidgetItem(original)
      parent.splice(activeIdx + 1, 0, copyElem)
    }

    function copyWidgetItem(original: ComponentConfig) {
      let children = []
      if (original.children?.length) {
        children = original.children.map(copyWidgetItem)
      }

      const copyElem: ComponentConfig = {
        id: 'field_' + Number(genId()).toString(36),
        component: original.component,
        category: original.category,
        formItemAttrs: original.formItemAttrs ? JSON.parse(JSON.stringify(original.formItemAttrs)) : undefined,
        attrs: original.attrs ? JSON.parse(JSON.stringify(original.attrs)) : undefined,
        children,
        key: 1,
      }
      return copyElem
    }

    function getRules(element: ComponentConfig) {
      const rules = []
      const requiredMessage = element.formItemAttrs.requiredMessage
      const label = element.formItemAttrs.label
      const field = element.id
      if (element.formItemAttrs.required) {
        const rule: FormItemRule = {
          required: true,
          message: requiredMessage || `${label}(${field})必填`
        }
        rules.push(rule)
      }

      return rules
    }

    return {
      vFormActiveElement, handleClickElement, formData, handleAddCol, handleDeleteElem, handleCopyElem, getRules
    }
  }
})
</script>

<style scoped>
div {
  box-sizing: border-box;
}
.widget-item {
  position: relative;
  background-color: #ecf5ff4d;
  min-height: 50px;
  overflow: hidden;
  border: 1px dashed gray;
}

html.dark .widget-item {
  background-color: #0c151e4d;
}
.widget-item + .widget-item {
  margin-top: 4px;
}

.widget-row-item {
  position: relative;
}

.widget-col-item {
  position: relative;
}

.widget-table-td {
  border: 1px solid var(--el-border-color);
}


.widget-item.active,
.widget-col-item.active,
.widget-row-item.active,
.widget-table.active,
.widget-table-tr.active,
.widget-table-td.active
{
  outline: 2px solid #409EFF;
  border: 1px solid #409EFF;
}

.widget-item:hover,
.widget-col-item:hover,
.widget-table:hover,
.widget-table-tr:hover,
.widget-table-td:hover {
  border: 1px solid #409EFF;
}


.drag-handle {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  padding: 2px;
  color: white;
  background-color: #8db2b4;
  display: flex;
  align-items: center;
  cursor: move;
}

.field-id {
  position: absolute;
  top: 0;
  right: 0;
  height: 20px;
  padding: 2px;
  color: white;
  background-color: #8db2b480;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.drag-icon {
  width: 16px;
  height: 16px;
}

.widget-action {
  position: absolute;
  right: 0;
  bottom: 0;
  background-color: #8db2b4;
  cursor: pointer;
  height: 24px;
  padding: 4px;
  display: flex;
  flex-direction: row;
  gap: 4px;
}

.widget-action-icon {
  width: 16px;
  height: 16px;
  color: white;
}

</style>