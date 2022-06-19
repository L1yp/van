<template>
  <div class="container">
    <div class="component-list">
      <el-tabs v-model="candidateActiveTab">
        <el-tab-pane label="组件" name="component">
          <candidate-component-page
            :height="designerContainerHeight"
            :input-components="inputComponents"
            :output-components="outputComponents"
            :layout-components="layoutComponents"
          >
          </candidate-component-page>
        </el-tab-pane>
        <el-tab-pane label="字段" name="field">
          <draggable
            style="width: 100%; height: 100%"
            :list="componentList"
            :group="{ name: 'component', pull: 'clone', put: false}"
            handle="div.component-item"
            item-key="id"
            :sort="false"
            :clone="transCloneComponent"
          >
            <template #item="{ element }">
              <div class="component-item">{{ element.title }}</div>
            </template>
          </draggable>
        </el-tab-pane>
      </el-tabs>

    </div>
    <div class="form-wrapper">
      <div class="form-designer-toolbar">

      </div>
      <el-scrollbar :height="containerHeight" always>
        <el-form style="width: calc(100% - 10px); padding: 5px">
          <nested-drag-item :style="{width: '100%', minHeight: `calc(${containerHeight} - 10px)`}" :children="formComponentList" group="component"></nested-drag-item>
        </el-form>
      </el-scrollbar>

    </div>
    <div class="property-panel-container">
      <form-property-panel :height="designerContainerHeight"></form-property-panel>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, inject, ref, defineComponent, provide} from "vue";
import {mainHeightKey, mainWidthKey, themeKey, vFormActiveElementKey} from "@/config/app.keys";
import Draggable from "vuedraggable"
import { ElForm, ElScrollbar, ElTabs, ElTabPane } from "element-plus"
import {CandidateComponentConfig, ComponentConfig} from "@/components/form/types";
import NestedDragItem from "@/components/form/designer/NestedDragItem.vue";
import FormPropertyPanel from "@/components/form/designer/FormPropertyPanel.vue"
import CandidateComponentPage from "@/components/form/designer/candidate/CandidateComponentPage.vue";
import { genId, transCloneComponent } from '@/components/form/designer/util/common'

const candidateActiveTab = ref<string>('component')


const mainWidth = inject(mainWidthKey)
const mainHeight = inject(mainHeightKey)
const theme = inject(themeKey)
const containerWidth = computed<string>(() => `calc(${mainWidth.value} - ${theme.value.mainPadding * 2}px)`)

// 30=padding 40=toolbar
const containerHeight = computed<string>(() => `calc(${mainHeight.value} - ${theme.value.mainPadding * 2}px)`)

const designerContainerHeight = computed<string>(() => `calc(${containerHeight.value} - 40px)`)

const vFormActiveElement = ref<ComponentConfig>(null)
provide(vFormActiveElementKey, vFormActiveElement)

const inputComponents: CandidateComponentConfig[] = [
  {
    id: genId(),
    icon: 'TextField',
    component: 'el-input',
    title: "单行文本框",
    formItemAttrs: {
      prop: genId(),
      label: "单行文本框",
      labelWidth: "120px",
      required: false,
      error: '',
      showMessage: true,
      inlineMessage: false,
      size: 'default'
    },
    attrs: {
      style: {
        width: '100%',
      }
    }
  },
  {
    id: genId(),
    icon: 'Select',
    component: 'el-select',
    title: "下拉框",
    formItemAttrs: {
      prop: genId(),
      label: "下拉框",
      labelWidth: "120px",
      required: false,
      error: '',
      showMessage: true,
      inlineMessage: false,
      size: 'default'
    },
    attrs: {
      style: {
        width: '100%',
      }
    }
  },
  {
    id: genId(),
    icon: 'Checkbox',
    component: 'el-checkbox-group',
    title: "多选框组",
    formItemAttrs: {
      prop: genId(),
      label: "多选框组",
      labelWidth: "120px",
      required: false,
      error: '',
      showMessage: true,
      inlineMessage: false,
      size: 'default'
    },
    attrs: {
      style: {
        width: '100%',
      }
    },
    children: [
      {
        id: genId(),
        component: 'el-checkbox',
        title: '多选框',
        attrs: {
          label: 'Option1'
        }
      },
      {
        id: genId(),
        component: 'el-checkbox',
        title: '多选框',
        attrs: {
          label: 'Option2'
        }
      },
    ]
  },
]
const outputComponents = []
const layoutComponents = [
  {
    id: genId(),
    component: 'el-row',
    title: "栅格",
    formItemAttrs: {
      label: "栅格",
    },
    attrs: {
      style: {
        minHeight: '120px'
      }
    },
    children: [
      {
        id: genId(),
        component: 'el-col',
        title: "栅格",
        formItemAttrs: {
          label: "栅格",
        },
        attrs: {
          span: 12,
          style: {
            minHeight: '80px'
          }
        },
        children: [],
      },
      {
        id: genId(),
        component: 'el-col',
        title: "栅格",
        formItemAttrs: {
          label: "栅格",
        },
        attrs: {
          span: 12,
          style: {
            minHeight: '80px'
          }
        },
        children: [],
      }
    ],
  }
]


const componentList = ref<CandidateComponentConfig[]>([
  {
    id: genId(),
    component: 'el-select',
    title: "下拉框",
    formItemAttrs: {
      label: "下拉框",
      labelWidth: "120px",
    },
    attrs: {
      style: {
        width: '100%',
      }
    }
  },
  {
    id: genId(),
    component: 'el-input',
    title: "单行文本框",
    formItemAttrs: {
      label: "单行文本框",
      labelWidth: "120px",
    },
    attrs: {
      style: {
        width: '100%',
      }
    }
  },
  {
    id: genId(),
    component: 'el-row',
    title: "行容器",
    formItemAttrs: {
      label: "行容器",
    },
    attrs: {
      style: {
        minHeight: '120px'
      }
    },
    children: [
      {
        id: genId(),
        component: 'el-col',
        title: "栅格",
        formItemAttrs: {
          label: "栅格",
        },
        attrs: {
          span: 12,
          style: {
            minHeight: '80px'
          }
        },
        children: [],
      },
      {
        id: genId(),
        component: 'el-col',
        title: "栅格",
        formItemAttrs: {
          label: "栅格",
        },
        attrs: {
          span: 12,
          style: {
            minHeight: '80px'
          }
        },
        children: [],
      }
    ],
  },
])

const formComponentList = ref<ComponentConfig[]>([])

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
  height: v-bind(containerHeight);
  background-color: #FFFFFF;
}

.form-wrapper {
  flex: 1;
  height: v-bind(designerContainerHeight);
}

.property-panel-container {
  width: 300px;
  height: v-bind(containerHeight);
  background-color: #FFFFFF;
}

:deep(.ghost) {
  content: '';
  font-size: 0;
  height: 3px;
  box-sizing: border-box;
  background-color: #409EFF;
  border: 2px solid #409EFF;
  outline-width: 0;
  padding: 0;
  overflow: hidden;
}

.form-designer-toolbar {
  width: 100%;
  height: 40px;
  background-color: #FFFFFF;
}
</style>
