<template>
  <div class="container" v-loading="loading">
    <div class="component-list">
      <el-tabs type="border-card" v-model="candidateActiveTab" style="width: 100%; height: 100%;">
        <el-tab-pane label="组件" name="component" style="width: 100%; height: 100%;">
          <candidate-component-page
            :display-components="DisplayComponents"
            :input-components="InputComponents"
            :layout-components="LayoutComponents"
          >
          </candidate-component-page>
        </el-tab-pane>
        <el-tab-pane label="字段" name="field" style="width: 100%; height: 100%;">
          <ModelingFieldPage v-bind="$props" />
        </el-tab-pane>
      </el-tabs>

    </div>
    <div class="form-wrapper">
      <div class="form-designer-toolbar">
        <div style="display: flex; align-items: center; padding-left: 10px; width: 400px">
          <span style="width: 100px; align-self: center; font-weight: bold">页面名称</span>
          <el-input :disabled="props.module === 'ENTITY' || !!props.name" v-model="pageName" />
          <el-button text type="primary" :icon="saveIcon" @click="handleClickSave">保存</el-button>
        </div>
        <div>
          <el-button text type="primary" :icon="Delete" @click="handleClickClear">清空</el-button>
          <el-button text type="primary" :icon="View" @click="handleClickPreview">预览</el-button>
          <el-button text type="primary" :icon="View" @click="handleClickViewJSON">查看JSON</el-button>
        </div>

      </div>
      <div style="height: calc(100% - 40px);">
        <el-scrollbar always>
          <el-form
            :size="formScheme.size"
            :label-width="formScheme.labelWidth"
            :label-position="labelPosition"
            :style="formScheme.style"
            style="padding: 10px; box-sizing: border-box; height: 100%;"
            @click.stop="vFormActiveElement = null"
          >
            <!-- 若(nested-drag-item).height + padding*2 > designerContainerHeight 则会出现滚动条  -->
            <nested-drag-item
              :style="{width: '100%', minHeight: `calc(${designerContainerHeight} - 20px - 69px)`}"
              :children="formScheme.children"
              group="component"
            >
            </nested-drag-item>
          </el-form>
        </el-scrollbar>
      </div>

    </div>
    <div class="property-panel-container">
      <form-property-panel></form-property-panel>
    </div>


    <JsonEditor v-model:visible="editorInfo.visible" :code="editorInfo.code"></JsonEditor>

    <v-dialog
      v-model="dialogInfo.visible"
      draggable
      title="预览表单"
      :fixed-body-height="false"
      use-body-scrolling
      width="600px"
      @cancel="dialogInfo.visible = false"
      @confirm="dialogInfo.visible = false"
    >
      <div style="display: flex; align-items: center; gap: 6px;">
        <el-radio-group v-model="formScheme.mode">
          <el-radio-button label="design">设计</el-radio-button>
          <el-radio-button label="edit">编辑</el-radio-button>
          <el-radio-button label="read">预览</el-radio-button>
        </el-radio-group>
        <el-button @click="handleClickValidateForm">校验表单</el-button>
      </div>

      <div style="margin-top: 16px"></div>

      <v-form-render ref="formRenderRef" :scheme="formScheme" :form-data="dialogInfo.formData"></v-form-render>
      <div style="margin-top: 6px; margin-bottom: 6px">
        <el-scrollbar always>
          <pre> {{ JSON.stringify(dialogInfo.formData) }} </pre>
        </el-scrollbar>

      </div>
    </v-dialog>
  </div>


</template>

<script lang="ts" setup>
import { computed, inject, ref, provide, onBeforeMount } from "vue";
import { ElForm, ElScrollbar, ElTabs, ElTabPane, ElButton, ElRadioGroup, ElRadioButton, ElInput } from "element-plus"
import NestedDragItem from "@/components/form/designer/NestedDragItem.vue";
import FormPropertyPanel from "@/components/form/designer/FormPropertyPanel.vue"
import CandidateComponentPage from "@/components/form/designer/candidate/CandidateComponentPage.vue";
import ModelingFieldPage from "@/components/form/designer/candidate/ModelingFieldPage.vue";
import { useIcon } from "@/components/common/util";
import JsonEditor from "@/components/common/JsonEditor.vue";
import { InputComponents, LayoutComponents, DisplayComponents } from "@/components/form/designer/data"
import VDialog from "@/components/dialog/VDialog.vue";
import VFormRender from "@/components/form/designer/VFormRender.vue";
import { formModeKey, vFormActiveElementKey, vFormSchemeKey } from "@/components/form/state.key";
import { useModelingPageApi } from "@/service/modeling/page";
import { Delete, View } from "@element-plus/icons-vue";
import { getDeviceType } from "@/utils/common";
import { useLayoutStore } from "@/store/layout";
import { useThemeStore } from "@/store/theme";

const saveIcon = useIcon('Save')

interface Props {
  module: ModelingModule
  mkey: string
  name: string
}

const props = defineProps<Props>()

const loading = ref(false)
const { pageInfo, findPage, bindPage } = useModelingPageApi(loading)


const pageName = ref(props.name || '')

const candidateActiveTab = ref<string>('component')

const layoutStore = useLayoutStore()
const themeStore = useThemeStore()

// 30=padding 40=toolbar
const containerHeight = computed<string>(() => `calc(${layoutStore.mainHeight} - ${themeStore.mainPadding * 2}px)`)

const designerContainerHeight = computed<string>(() => `calc(${containerHeight.value} - 40px)`)

const vFormActiveElement = ref<ComponentConfig | null>(null)
provide(vFormActiveElementKey, vFormActiveElement)

const mode = computed<FormFieldMode>(() => 'design')
provide(formModeKey, mode)

const formScheme = ref<VFormScheme>({
  labelPosition: 'auto',
  labelWidth: '120px',
  size: 'default',
  mode: 'design',
  style: '',
  children: []
})
provide(vFormSchemeKey, formScheme)

const deviceType = getDeviceType()
const labelPosition = computed(() => {
  if (formScheme.value.labelPosition === 'auto') {
    return deviceType.value === 'h5' ? 'top' : 'right'
  }
  return formScheme.value.labelPosition
})


onBeforeMount(async () => {
  await findPage({ ...props })
  if (pageInfo.value?.name) {
    pageName.value = pageInfo.value.name
  }
  if (pageInfo.value?.page_scheme) {
    formScheme.value = pageInfo.value.page_scheme
  }
})


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

async function handleClickSave() {
  const param: ModelingPageBindParam = {
    name: pageName.value,
    module: props.module,
    mkey: props.mkey,
    page_scheme: formScheme.value,
  }
  bindPage(param)
}

const formRenderRef = ref<InstanceType<typeof VFormRender>>()
async function handleClickValidateForm() {
  try {
    await formRenderRef.value.formRef.validate()
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
  width: 100%;
  height: 100%;
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

:deep(.el-tabs--border-card>.el-tabs__content) {
  box-sizing: border-box;
  height: calc(100% - 39px);
}

.property-panel-container {
  width: 400px;
  height: 100%;
  background-color: #FFFFFF;
}

:deep(.ghost) {
  content: '';
  font-size: 0;
  width: 100%;
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
  background-color: var(--el-fill-color-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-designer-toolbar :deep(.el-button + .el-button) {
  margin-left: 0;
}
</style>
