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
        <draggable
          style="width: 100%; height: 100%"
          :list="formComponentList"
          :group="{name: 'component', pull: false, put: true }"
          item-key="id"
        >
          <template #item="{element}">
            <template v-if="element.component === 'el-row'">
              <component
                :is="element.component"
                v-bind="element.attrs"
              >

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

          </template>
        </draggable>
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

function genId(): string {
  return Math.random().toString().replaceAll("0.", "");
}

function transCloneComponent(original: CandidateComponentConfig) {
  const newItem: ComponentConfig = {
    id: genId(),
    component: original.component,
    label: original.label,
    labelWidth: original.labelWidth,
    attrs: original.attrs
  }
  return newItem;
}

export default defineComponent({
  components: {
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
        labelWidth: "120px"
      },
      {
        id: genId(),
        component: 'el-input',
        label: "单行文本框",
        labelWidth: "120px"
      },
      {
        id: genId(),
        component: 'el-row',
        label: "行容器",
        attrs: {
          style: {
            height: '100px'
          }
        }
      },
    ])

    const formComponentList = ref<ComponentConfig[]>([
      {
        id: "3",
        label: "类型",
        labelWidth: "120px",
        component: 'el-select'
      },
    ])


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
