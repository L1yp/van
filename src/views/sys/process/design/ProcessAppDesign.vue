<template>
  <div class="container" ref="container">
    <div id="canvas" ref="canvas"></div>
    <div class="property-panel-container">
      <property-panel
        v-show="!collapsed"
        :selected-elem="selectedElem"
        class="property-panel"
        :height="panelHeight"
        ref="panelRef"
      >
      </property-panel>

      <div class="collapse-property-panel" @click.stop="handleCollapsePanel">
        <s-v-g-icon style="width: 1em; height: 1em" :name="collapseIconName"></s-v-g-icon>
      </div>
    </div>
    <div class="toolbar" ref="toolbarRef">
      <el-button-group>
        <el-button type="primary" @click="handleViewBPMNXML" title="预览XML">
          <s-v-g-icon name="View" style="width: 1em; height: 1em"/>
        </el-button>
        <el-button type="primary" @click="reqFullscreen" title="全屏">
          <s-v-g-icon :name="isFullscreen ? 'FullScreenMinimize' : 'FullScreenMaximize'" style="width: 1em; height: 1em"/>
        </el-button>
        <el-button type="primary" @click="handleZoomShrink" title="缩小" :disabled="scale <= 10">
          <s-v-g-icon name="Subtract" style="width: 1em; height: 1em"/>
        </el-button>
        <el-button type="primary" @click="handleZoomExpand">
          {{ scale + '%' }}
        </el-button>
        <el-button type="primary" @click="handleZoomExpand" title="放大">
          <s-v-g-icon name="Plus" style="width: 1em; height: 1em"/>
        </el-button>
        <el-button type="primary" @click="handleCheckBPMN" title="校验">
          <s-v-g-icon name="Check" style="width: 1em; height: 1em"/>
        </el-button>
        <el-button type="primary" @click="handleOpenFile" title="打开BPMN文件">
          <s-v-g-icon name="FolderOpened" style="width: 1em; height: 1em"/>
        </el-button>
        <el-button type="primary" @click="handleUpdateBpmnXML" title="保存">
          <s-v-g-icon name="Save" style="width: 1em; height: 1em"/>
        </el-button>
      </el-button-group>
      <input type="file" accept="application/xml" ref="fileInputRef" style="display: none" @change="handleFileChange">
    </div>
  </div>
  <XmlEditor ref="editorRef" v-model:visible="previewVisible" :code="previewCode">
    <template #footer>
      <div class="dialog-footer">
        <el-button size="default" type="primary" @click="handleSaveXml">保存</el-button>
      </div>
    </template>
  </XmlEditor>
</template>

<script lang="ts" setup>
import BpmnModeler from "bpmn-js/lib/Modeler"
import {useRoute} from "vue-router";
import {computed, inject, onBeforeMount, onMounted, provide, readonly, ref, ShallowRef, shallowRef} from "vue";
import flowable_descriptor from "@/assets/flowable/descriptor.json"
import {ElMessage, ElScrollbar, ElButtonGroup, ElButton} from "element-plus";
import {
  asideWidthKey,
  bpmnModelerKey,
  bpmnSelectedElemKey,
  mainHeightKey,
  updatePropertyKey,
  processModelFieldKey,
  processNodePageListKey
} from "@/config/app.keys";
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import PropertyPanel from "@/components/bpmn/PropertyPanel.vue";
import SVGIcon from "@/components/common/SVGIcon.vue"
import XmlEditor from "@/components/common/XmlEditor.vue"
import * as ProcessModelApi from "@/api/sys/process/"
import initXml from "@/assets/bpmn/init.bpmn20.xml?raw"
import {Connection, ElementRegistry, FormalExpression} from "bpmn-js";
import {SaveXMLResult} from "bpmn-js/lib/BaseViewer";
import FlowableExtensionModdle from "@/assets/flowable/extension";
import { useFullscreen } from '@vueuse/core'

const container = ref<HTMLElement | null>(null)

const { isFullscreen, enter, exit, toggle } = useFullscreen(container)
function reqFullscreen() {
  toggle()
}


const route = useRoute()
const bpmnId = Number(route.params.bpmnId)
const processKey = route.query.processKey as string
const mainHeight = inject(mainHeightKey)
const asideWidth = inject(asideWidthKey)
const loading = ref(false)

const containerHeight = computed(() => {
  return isFullscreen.value ? '100vh' : `calc(${mainHeight.value} - 40px)`
})

const panelHeight = computed(() => {
  return isFullscreen.value ? '100vh' : `calc(${containerHeight.value} - 40px - 40px)`
})

const containerWidth = computed(() => {
  return `calc(100vw - ${asideWidth.value} - 40px)`
})

const panelWidth = computed(() => collapsed.value ? "40px" : "400px")

const collapsed = ref(false)
const collapseIconName = computed(() => collapsed.value ? "double-left" : "double-right")
const panelRef = ref<InstanceType<typeof PropertyPanel>>()

function handleCollapsePanel() {
  collapsed.value = !collapsed.value
}

const canvas = shallowRef<HTMLDivElement>()
const scale = ref<number>(100)
const bpmnModeler = shallowRef<BpmnModeler>()
const boundPages = ref<ProcessModelNodePageView[]>([])
const selectedElem = shallowRef()
const processModelFields = shallowRef()

provide(bpmnSelectedElemKey, selectedElem)
provide(bpmnModelerKey, bpmnModeler)
provide(updatePropertyKey, updateProperty)
provide(processModelFieldKey, processModelFields)
provide(processNodePageListKey, boundPages)

async function init() {
  bpmnModeler.value = new BpmnModeler({
    container: canvas.value,
    keyboard: {
      bindTo: window
    },
    additionalModules: [
      {
        // 禁用滚轮滚动
        zoomScroll: ["value", ""],

      },
      FlowableExtensionModdle
    ],
    moddleExtensions: {
      flowable: flowable_descriptor
    },
  })

  // 选中元素变更
  bpmnModeler.value.on("selection.changed", e => {
    const selectionArray = e.newSelection
    selectedElem.value = selectionArray[0]
  })

  // 元素变更
  bpmnModeler.value.on("element.changed",  e => {
    console.info("element.change", e)
    const { element } = e
    if (element.type === 'bpmn:SequenceFlow') {
      panelRef.value.recalculateShowConditionSeqFlow()
      if (!!element.businessObject?.conditionExpression) {
        // 显示条件配置
      }
    }
    selectedElem.value = element
  })

  bpmnModeler.value.on("element.click", e => {
    const { element } = e
    const { type } = element
    console.info("element.click", type, element)
    selectedElem.value = element
  })

  try {
    const bpmn = await ProcessModelApi.findProcessModelBPMN(bpmnId);
    boundPages.value = await ProcessModelApi.listProcessPageByBpmnId(bpmnId);
    await createNewDiagram(bpmn.content)
  } catch (e) {
    console.log(e)
    await createNewDiagram("")
  }

}

function updateProperty(element, properties) {
  const modeling = bpmnModeler.value.get("modeling")
  console.log(modeling)
  modeling.updateProperties(element, properties)
}

async function createNewDiagram(xml: string) {
  // 将字符串转换成图显示出来
  try {
    if (!xml) {
      xml = initXml
    }
    const result = await bpmnModeler.value.importXML(xml);
    const { warnings } = result;
    console.log(warnings);
    const canvas = bpmnModeler.value.get('canvas')
    canvas.zoom("fit-viewport", true);
    canvas.zoom(Math.ceil(scale.value / 100));

    console.log("elementRegistry", bpmnModeler.value.get("elementRegistry"))
    console.log("elem all", bpmnModeler.value.get("elementRegistry").getAll())
    selectedElem.value = bpmnModeler.value.get("elementRegistry").find(it => it.type === "bpmn:Process")
    ElMessage.success("导入成功")
  } catch (err) {
    console.log(err.message, err.warnings);
    ElMessage.error("导入失败: " + err.message)
  }
}

onBeforeMount(async () => {
  try {
    const fields: ProcessFieldDefinition[] = await ProcessModelApi.loadProcessFieldDefinition(processKey)
    processModelFields.value = fields
  } catch (e) {
    console.error("err read fields", e)
  }

})

onMounted(() =>{
  init()
})

const editorRef = ref<InstanceType<typeof XmlEditor>>()
const previewVisible = ref<boolean>(false)
const previewCode = ref("")
async function handleViewBPMNXML() {
  const { xml } = await bpmnModeler.value.saveXML({ format: true }) as SaveXMLResult
  // console.log("export xml", xml)
  previewCode.value = xml
  previewVisible.value = true

}

function handleCheckBPMN() {
  checkBPMN()
}

function checkBPMN(): boolean {
  const registry = bpmnModeler.value.get("elementRegistry") as ElementRegistry
  const userTasks = registry.filter(it => it.type === 'bpmn:UserTask' && it.outgoing.length > 1)
  console.log('userTasks', userTasks)
  const modeling = bpmnModeler.value.get('modeling');
  let result = true
  for (let userTask of userTasks) {
    const outgoings = userTask.outgoing as Connection[]
    for (let outgoing of outgoings) {
      const name = outgoing?.businessObject?.name
      if (!name) {
        modeling.setColor([ outgoing ], {
          stroke: 'red',
          fill: 'red'
        });
        result = false
      } else {
        modeling.setColor([ outgoing ], {
          stroke: 'black',
          fill: 'black'
        });
      }

      if (!outgoing?.businessObject?.conditionExpression && name) {
        const bpmnFactory = bpmnModeler.value.get("bpmnFactory")
        const expression = bpmnFactory.create('bpmn:FormalExpression') as FormalExpression
        expression.body = '${outcome == "' + name + '"}'
        const modeling = bpmnModeler.value.get("modeling")
        modeling.updateProperties(outgoing, {
          conditionExpression: expression
        })
      }
    }
  }
  return result
}

function handleZoomExpand() {
  const canvas = bpmnModeler.value.get('canvas')
  scale.value = scale.value + 10
  canvas.zoom(scale.value / 100);
}

function handleZoomShrink() {
  const canvas = bpmnModeler.value.get('canvas')
  scale.value = scale.value - 10
  canvas.zoom(scale.value / 100);
}

async function handleUpdateBpmnXML() {
  try {
    const success = checkBPMN()
    if (!success) {
      ElMessage.error('BPMN结构尚未完成, 请在红线上填写标题')
      return
    }
    const { xml } = await bpmnModeler.value.saveXML({ format: false }) as SaveXMLResult
    await ProcessModelApi.persistProcessModelXML(bpmnId, xml)
    ElMessage.success("保存成功")
  } catch (e) {
    console.error(e)
    ElMessage.error(e?.message || '保存失败')
  }
}

async function handleSaveXml() {
  const text = editorRef.value.view.state.doc.toString()
  try {
    await createNewDiagram(text)
    const { xml } = await bpmnModeler.value.saveXML({ format: false }) as SaveXMLResult

    const success = checkBPMN()
    if (!success) {
      ElMessage.error('BPMN结构尚未完成, 请在红线上填写标题')
      return
    }

    previewVisible.value = false
    await ProcessModelApi.persistProcessModelXML(bpmnId, xml)
    ElMessage.success("保存成功")
  } catch (e) {
    console.error(e)
    ElMessage.error(e?.message || '保存失败')
  }finally {

  }
}

const toolbarRef = shallowRef<HTMLDivElement>()
const fileInputRef = shallowRef<HTMLInputElement>()
function handleOpenFile() {
  fileInputRef.value.click()
}

function handleFileChange(ev: InputEvent) {
  loading.value = true
  const target = ev.target as HTMLInputElement
  console.log(target.files);
  const reader = new FileReader();
  reader.onloadend = function (event) {
    if (event.target.readyState !== FileReader.DONE) {
      return;
    }
    const xml = event.target.result as string
    console.log("import xml", xml)
    createNewDiagram(xml)
    loading.value = false
  }
  reader.readAsText(target.files[0])

}

</script>

<style scoped>
div.container{
  position: absolute;
  background-color: #ffffff;
  width: v-bind(containerWidth);
  height: v-bind(containerHeight);
  box-sizing: border-box;
  background-image: linear-gradient(
    90deg,
    rgba(220, 220, 220, 0.5) 6%,
    transparent 0
  ),
  linear-gradient(rgba(192, 192, 192, 0.5) 6%, transparent 0);
  background-size: 12px 12px;
}
#canvas{
  width: 100%;
  height: 100%;
}

.property-panel-container{
  position: absolute;
  right: 0;
  top: 0;
  width: v-bind(panelWidth);
  height: v-bind(containerHeight);
  box-shadow: 0 0 12px rgba(0, 0, 0, .12);
  background-color: #FFFFFF;
}


.property-panel {
  position: absolute;
  right: 0;
  top: 0;
  width: v-bind(panelWidth);
  /*height: v-bind(panelHeight);*/
  box-sizing: border-box;
  padding: 20px;
}
.collapse-property-panel {
  width: v-bind(panelWidth);
  height: 40px;
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px dashed #e3e3e3;
  z-index: 101;
  cursor: pointer;
}

:deep(.bjs-powered-by) {
  left: 15px;
  right: unset;
  width: 200px;
}

.toolbar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
}


:deep(.entry.bpmn-icon-intermediate-event-none) {
  display: none;
}

:deep(.entry.bpmn-icon-subprocess-expanded) {
  display: unset;
}

:deep(.entry.bpmn-icon-group) {
  display: none;
}

:deep(.entry.bpmn-icon-participant) {
  display: none;
}

:deep(.entry.bpmn-icon-data-store) {
  display: none;
}

:deep(.entry.bpmn-icon-data-object) {
  display: none;
}

.dialog-footer {
  display: flex;
  justify-content: space-around;
}
</style>
