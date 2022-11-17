<template>
  <div class="root-container" v-loading="loading">
    <div class="toolbar">
      <el-button-group>
        <el-button :icon="View" title="预览JSON" @click="handlePreviewXml" />
        <el-button :icon="FolderOpened" title="导入BPMN文件" />
        <el-button :icon="SaveIcon" title="保存" @click="handleSaveXml" />
        <el-button :icon="Check" title="校验" />
      </el-button-group>
    </div>
    <div style="width: 100%; height: calc(100% - 41px); position: relative">
      <div style="width: 100%; height: 100%;" ref="diagramRef"></div>
      <div style="position: absolute; top: 0; right: 0; height: 100%">
        <Collapsed v-model="propertiesPanelVisible" position="right" style="height: 100%">
          <div style="box-sizing: border-box; width: 400px; height: 100%; border-left: 1px solid var(--el-border-color);">
            <PropertyPanel/>
          </div>
        </Collapsed>
      </div>
    </div>
    <xml-editor v-model="previewVisible" :code="previewCode" />
    <div id="workflow-mask-panel">

    </div>
  </div>
</template>

<script lang="ts" setup>
import { useVerApi } from "@/service/workflow/ver";
import { ElButtonGroup, ElButton, ElMessage } from "element-plus";
import { View, FolderOpened, Check } from "@element-plus/icons-vue";
import {onMounted, provide, ref, shallowRef} from "vue";
import BpmnModeler from "bpmn-js/lib/Modeler"
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'diagram-js-minimap/assets/diagram-js-minimap.css'
import miniMapModule from 'diagram-js-minimap'
import flowableDescriptor from "@/assets/flowable/descriptor.json"
import { useIcon } from "@/components/common/util";
import CustomModdle from '@/components/bpmn/moddle/CustomModdle'
import Collapsed from "@/components/common/Collapsed.vue";
import PropertyPanel from '@/components/bpmn/PropertyPanel.vue'
import {
  bpmnModelerKey,
  bpmnSelectedElemKey,
  modelingFieldKey,
  modelingPageKey,
  workflowVerKey
} from "@/config/app.keys";
import {useModelingFieldApi} from "@/service/modeling/field";
import emitter from "@/event/mitt";
import XmlEditor from "@/components/common/XmlEditor.vue";
import {useModelingPageApi} from "@/service/modeling/page";

const SaveIcon = useIcon('Save')

interface Props {
  verId: string
}

const props = defineProps<Props>()
const propertiesPanelVisible = ref(false)
const loading = ref(false)
const { workflowVer, findVer, updateXml } = useVerApi(loading)
const { modelingFields, findModelingFields } = useModelingFieldApi(loading)
const { pageList, findModulePages } = useModelingPageApi(loading)

provide(workflowVerKey, workflowVer)
provide(modelingFieldKey, modelingFields)
provide(modelingPageKey, pageList)

const diagramRef = ref<HTMLDivElement>()

onMounted(initDiagram)

const scale = ref<number>(1)
const bpmnModeler = shallowRef()
provide(bpmnModelerKey, bpmnModeler)
const bpmnSelectedElem = shallowRef()
provide(bpmnSelectedElemKey, bpmnSelectedElem)

function initDiagram() {
  bpmnModeler.value = new BpmnModeler({
    container: diagramRef.value,
    keyboard: {
      bindTo: window
    },
    additionalModules: [
      {
        // 禁用滚轮滚动
        zoomScroll: ["value", ""],

      },
      miniMapModule,
      CustomModdle,
    ],
    moddleExtensions: {
      flowable: flowableDescriptor
    },
    minimap: {
      open: true
    }
  })

  loading.value = true
  findVer(props.verId)
    .then(() => findModelingFields('WORKFLOW', workflowVer.value.key))
    .then(() => findModulePages({ module: 'WORKFLOW', mkey: workflowVer.value.key }))
    .then(() => importXML(workflowVer.value.xml))
    .finally(() => loading.value = false)

}

async function importXML(xml: string) {
  try {
    const result = await bpmnModeler.value.importXML(xml);
    const { warnings } = result;
    const canvas = bpmnModeler.value.get('canvas')
    canvas.zoom("fit-viewport", true);
    canvas.zoom(Math.ceil(scale.value / 100));

    const registry = bpmnModeler.value.get("elementRegistry")
    bpmnSelectedElem.value = registry.find(it => it.type === 'bpmn:Process')
    bpmnModeler.value.on("selection.changed", e => {
      console.log('element select change', e);
      const selectionArray = e.newSelection
      bpmnSelectedElem.value = selectionArray?.length ? selectionArray[0] : registry.find(it => it.type === 'bpmn:Process')
    })
    bpmnModeler.value.on("element.changed", e => {
      console.log('element change', e);
      emitter.emit('elementChanged', { element: e.element })
    })
  } catch (e) {
    console.log(e.message, e.warnings);
    ElMessage.error("导入失败: " + e.message)
  }

}

const previewCode = ref('')
const previewVisible = ref(false)

async function handlePreviewXml() {
  loading.value = true
  const { xml } = await bpmnModeler.value.saveXML({ format: true })
  // console.log("export xml", xml)
  previewCode.value = xml
  previewVisible.value = true
  loading.value = false
}

async function handleSaveXml() {
  const { xml } = await bpmnModeler.value.saveXML({ format: false })
  await updateXml({
    id: workflowVer.value.id,
    xml: xml
  })
}

</script>

<style scoped>
div {
  box-sizing: border-box;
}

.root-container {
  width: 100%;
  height: 100%;
  border: 1px solid var(--el-border-color);
}

.toolbar {
  box-sizing: border-box;
  width: 100%;
  padding: 4px;
  background-color: white;
  border-bottom: 1px solid var(--el-border-color);
}

:deep(.layer-selectionOutline) {
  display: none;
}

:deep(.djs-minimap) {
  top: initial;
  right: initial;
  left: 20px;
  bottom: 40px;
}

:deep(.bjs-powered-by) {
  right: initial;
  left: 20px;
}
</style>