<template>
  <div class="root-container">
    <div class="toolbar">
      <el-button-group>
        <el-button :icon="View" title="预览JSON" />
        <el-button :icon="FolderOpened" title="导入BPMN文件" />
        <el-button :icon="SaveIcon" title="保存" />
        <el-button :icon="Check" title="校验" />
      </el-button-group>
    </div>
    <div style="width: 100%; height: calc(100% - 40px);">
      <div style="width: 100%; height: 100%;" ref="diagramRef"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useVerApi } from "@/service/workflow/ver";
import { ElButtonGroup, ElButton, ElMessage } from "element-plus";
import { View, FolderOpened, Check } from "@element-plus/icons-vue";
import { onMounted, ref, shallowRef } from "vue";
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

const SaveIcon = useIcon('Save')

interface Props {
  verId: string
}

const props = defineProps<Props>()

const loading = ref(false)
const { workflowVer, findVer } = useVerApi(loading)

const diagramRef = ref<HTMLDivElement>()

onMounted(initDiagram)

const scale = ref<number>(1)
const bpmnModeler = shallowRef()
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

  findVer(props.verId).then(() => importXML(workflowVer.value.xml))

}

async function importXML(xml: string) {
  try {
    const result = await bpmnModeler.value.importXML(xml);
    const { warnings } = result;
    const canvas = bpmnModeler.value.get('canvas')
    canvas.zoom("fit-viewport", true);
    canvas.zoom(Math.ceil(scale.value / 100));

    console.log("elementRegistry", bpmnModeler.value.get("elementRegistry"))
    console.log("elem all", bpmnModeler.value.get("elementRegistry").getAll())
  } catch (e) {
    console.log(e.message, e.warnings);
    ElMessage.error("导入失败: " + e.message)
  }
  
}

</script>

<style scoped>
div {
  box-sizing: border-box;
}

.root-container {
  width: 100%; 
  height: 100%;
  border: 1px solid #E3E3E3;
}

.toolbar {
  width: 100%; 
  height: 40px; 
  padding: 4px;
  background-color: white;
}

</style>