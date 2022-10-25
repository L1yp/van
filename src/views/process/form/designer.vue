<template>
  <div class="container">
    <div class="component-list">
      <el-tabs type="border-card" v-model="candidateActiveTab">
        <el-tab-pane label="组件" name="component">
          <candidate-component-page
            :height="designerContainerHeight"
            :input-components="InputComponents"
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
        <el-button text type="primary" :icon="deleteIcon" @click="handleClickClear">清空</el-button>
        <el-button text type="primary" :icon="viewIcon" @click="handleClickPreview">预览</el-button>
        <el-button text type="primary" :icon="viewIcon" @click="handleClickViewJSON">查看JSON</el-button>
      </div>
      <el-scrollbar style="height: calc(100% - 40px)" :height="designerContainerHeight" always>
        <el-form
          :size="formScheme.size" 
          :label-width="formScheme.labelWidth"
          :label-position="formScheme.labelPosition"
          :style="formScheme.style"
          style="padding: 10px" 
          @click.stop="vFormActiveElement = null"
        >
          <!-- 若(nested-drag-item).height + padding*2 > designerContainerHeight 则会出现滚动条  -->
          <nested-drag-item
            :style="{width: '100%', minHeight: `calc(${designerContainerHeight} - 20px)`}"
            :children="formScheme.children"
            group="component"
          >
          </nested-drag-item>
        </el-form>
      </el-scrollbar>

    </div>
    <div class="property-panel-container">
      <form-property-panel :height="formPropertyPanelHeight"></form-property-panel>
    </div>

    
    <JsonEditor v-model:visible="editorInfo.visible" :code="editorInfo.code"></JsonEditor>

    <v-dialog
      v-model="dialogInfo.visible"
      draggable
      title="预览表单"
      width="600px"
      @cancel="dialogInfo.visible = false"
      @confirm="dialogInfo.visible = false"
    >
      <div>
        <el-radio-group v-model="formMode">
          <el-radio-button label="design">设计</el-radio-button>
          <el-radio-button label="edit">编辑</el-radio-button>
          <el-radio-button label="read">预览</el-radio-button>
        </el-radio-group>
        <el-button @click="handleClickValidateForm">校验表单</el-button>
      </div>

      <div style="margin-top: 16px"></div>

      <v-form-render ref="formRenderRef" :scheme="formScheme" :mode="formMode" :form-data="dialogInfo.formData"></v-form-render>
      <div style="overflow: auto">
        <pre> {{ JSON.stringify(dialogInfo.formData) }} </pre>
      </div>
    </v-dialog>
  </div>


</template>

<script lang="ts" setup>
import { computed, inject, ref, provide } from "vue";
import { mainHeightKey, mainWidthKey, themeKey } from "@/config/app.keys";
import { ElForm, ElScrollbar, ElTabs, ElTabPane, ElButton, ElRadioGroup, ElRadioButton } from "element-plus"
import NestedDragItem from "@/components/form/designer/NestedDragItem.vue";
import FormPropertyPanel from "@/components/form/designer/FormPropertyPanel.vue"
import CandidateComponentPage from "@/components/form/designer/candidate/CandidateComponentPage.vue";
import { useIcon } from "@/components/common/util";
import JsonEditor from "@/components/common/JsonEditor.vue";
import { InputComponents, LayoutComponents } from "@/components/form/designer/data"
import VDialog from "@/components/dialog/VDialog.vue";
import VFormRender from "@/components/form/designer/VFormRender.vue";
import { formModeKey, vFormActiveElementKey, vFormSchemeKey } from "@/components/form/state.key";

const viewIcon = useIcon('View')
const deleteIcon = useIcon('Delete')

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

const formMode = ref<FormFieldMode>('edit')

const mode = computed<FormFieldMode>(() => 'design')
provide(formModeKey, mode)

const formScheme = ref<VFormScheme>({
  labelPosition: 'left',
  labelWidth: '120px',
  size: 'default',
  style: '',
  children: []
})
provide(vFormSchemeKey, formScheme)

interface JSONEditorInfo {
  visible: boolean
  code: string
}
const editorInfo = ref<JSONEditorInfo>({
  visible: false,
  code: ''
})


const dialogInfo = ref<DialogInfo<object>>({
  visible: false,
  title: '',
  loading: false,
  formData: {}
})

function handleClickClear() {
  formScheme.value.children = []
}


function handleClickPreview() {
  dialogInfo.value.formData = {}
  dialogInfo.value.visible =  true
}

function handleClickViewJSON() {
  editorInfo.value.code = JSON.stringify(formScheme.value, null, 4)
  editorInfo.value.visible = true
}

const formRenderRef = ref<InstanceType<typeof VFormRender>>()
async function handleClickValidateForm() {
  try {
    await formRenderRef.value.validate()
  } catch(e) {
    console.error(e);
  }
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
