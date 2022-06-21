<template>
  <div class="container">
    <div class="component-list">
      <el-tabs v-model="candidateActiveTab">
        <el-tab-pane label="组件" name="component">
          <candidate-component-page
            :height="designerContainerHeight"
            :input-components="InputComponents"
            :output-components="OutputComponents"
            :layout-components="LayoutComponents"
          >
          </candidate-component-page>
        </el-tab-pane>
        <el-tab-pane label="字段" name="field">

        </el-tab-pane>
      </el-tabs>

    </div>
    <div class="form-wrapper">
      <div class="form-designer-toolbar">
        <el-button text type="primary" :icon="viewIcon" @click="handleClickViewJSON">查看JSON</el-button>
      </div>
      <el-scrollbar style="height: calc(100% - 40px)" :height="designerContainerHeight" always>
        <el-form style="padding: 10px">
          <!-- 若(nested-drag-item).height + padding*2 > designerContainerHeight 则会出现滚动条  -->
          <nested-drag-item
            :style="{width: '100%', minHeight: `calc(${designerContainerHeight} - 20px)`}"
            :children="formComponentList"
            group="component"
          >
          </nested-drag-item>
        </el-form>
      </el-scrollbar>

    </div>
    <div class="property-panel-container">
      <form-property-panel :height="formPropertyPanelHeight"></form-property-panel>
    </div>
  </div>

  <JsonEditor v-model:visible="editorInfo.visible" :code="editorInfo.code"></JsonEditor>


</template>

<script lang="ts" setup>
import {computed, inject, ref, provide} from "vue";
import {mainHeightKey, mainWidthKey, themeKey, vFormActiveElementKey} from "@/config/app.keys";
import { ElForm, ElScrollbar, ElTabs, ElTabPane, ElButton } from "element-plus"
import {CandidateComponentConfig, ComponentConfig} from "@/components/form/types";
import NestedDragItem from "@/components/form/designer/NestedDragItem.vue";
import FormPropertyPanel from "@/components/form/designer/FormPropertyPanel.vue"
import CandidateComponentPage from "@/components/form/designer/candidate/CandidateComponentPage.vue";
import { genId, transCloneComponent } from '@/components/form/designer/util/common'
import {useIcon} from "@/components/common/util";
import JsonEditor from "@/components/common/JsonEditor.vue";
import { InputComponents, OutputComponents, LayoutComponents } from "@/components/form/designer/data"

const viewIcon = useIcon('View')

const candidateActiveTab = ref<string>('component')

const mainWidth = inject(mainWidthKey)
const mainHeight = inject(mainHeightKey)
const theme = inject(themeKey)
const containerWidth = computed<string>(() => `calc(${mainWidth.value} - ${theme.value.mainPadding * 2}px)`)

// 30=padding 40=toolbar
const containerHeight = computed<string>(() => `calc(${mainHeight.value} - ${theme.value.mainPadding * 2}px)`)

const designerContainerHeight = computed<string>(() => `calc(${containerHeight.value} - 40px)`)

const formPropertyPanelHeight = computed<string>(() => `calc(${containerHeight.value} - 55px)`)

const vFormActiveElement = ref<ComponentConfig>(null)
provide(vFormActiveElementKey, vFormActiveElement)



const formComponentList = ref<ComponentConfig[]>([])

interface JSONEditorInfo {
  visible: boolean
  code: string
}
const editorInfo = ref<JSONEditorInfo>({
  visible: false,
  code: ''
})

function handleClickViewJSON() {
  editorInfo.value.code = JSON.stringify(formComponentList.value, null, 4)
  editorInfo.value.visible = true
}
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
  height: v-bind(containerHeight);
}

.property-panel-container {
  width: 400px;
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
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
