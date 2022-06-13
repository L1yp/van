<template>
  <div class="container">
    <div class="component-list">
      <draggable
        style="width: 100%; height: 100%"
        :list="componentList"
        :group="{ name: 'component', pull: 'clone', put: false}"
        handle="div.component-item"
        item-key="id"
        :sort="false"
        :clone="transCloneComponent"
      >
        <template #item="{element}">
          <div class="component-item">{{ element.label }}</div>
        </template>
      </draggable>
    </div>
    <div class="form-wrapper">
      <el-form style="width: 100%; height: 100%">
        <nested-drag-item :children="formComponentList" group="component"></nested-drag-item>
      </el-form>
    </div>
    <div class="property-panel">

    </div>
  </div>
</template>

<script lang="ts">
import { computed, inject, ref, defineComponent } from "vue";
import {mainHeightKey, mainWidthKey, themeKey} from "@/config/app.keys";
import Draggable from "vuedraggable"
import { ElForm, ElFormItem, ElInput, ElSelect, ElRow, ElCol } from "element-plus"
import {CandidateComponentConfig, ComponentConfig} from "@/components/form/types";
import NestedDragItem from "@/components/form/NestedDragItem.vue";

function genId(): string {
  return Math.random().toString().replaceAll("0.", "");
}

function transCloneComponent(original: CandidateComponentConfig) {
  const newItem: ComponentConfig = {
    id: genId(),
    component: original.component,
    label: original.label,
    labelWidth: original.labelWidth,
    attrs: original.attrs,
    children: []
  }
  console.log("newItem", newItem)
  return newItem;
}

export default defineComponent({
  components: {
    NestedDragItem,
    Draggable, ElForm, ElFormItem, ElInput, ElSelect, ElRow, ElCol
  },
  setup() {
    const mainWidth = inject(mainWidthKey)
    const mainHeight = inject(mainHeightKey)
    const theme = inject(themeKey)
    const containerWidth = computed<string>(() => `calc(${mainWidth.value} - ${theme.value.mainPadding * 2}px)`)
    const containerHeight = computed<string>(() => `calc(${mainHeight.value} - ${theme.value.mainPadding * 2}px)`)

    const componentList = ref<CandidateComponentConfig[]>([
      {
        id: genId(),
        component: 'el-select',
        label: "下拉框",
        labelWidth: "120px",
        attrs: {
          style: {
            width: '100%',
          }
        }
      },
      {
        id: genId(),
        component: 'el-input',
        label: "单行文本框",
        labelWidth: "120px",
        attrs: {
          style: {
            width: '100%',
          }
        }
      },
      {
        id: genId(),
        component: 'el-row',
        label: "行容器",
        attrs: {
          style: {
            height: '100px'
          }
        },
        children: [],
      },
    ])

    const formComponentList = ref<ComponentConfig[]>([])


    return {
      containerWidth, containerHeight, componentList, formComponentList, transCloneComponent
    }

  }
})


</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: v-bind(containerWidth);
  height: v-bind(containerHeight);
}

.component-list {
  width: 300px;
  height: 100%;
  background-color: #FFFFFF;
}

.form-wrapper {
  flex: 1;
  height: 100%;

}

.property-panel {
  width: 300px;
  height: 100%;
  background-color: #FFFFFF;
}


</style>
