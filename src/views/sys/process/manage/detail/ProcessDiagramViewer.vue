<template>
  <div class="viewer-container">
    <div :style="diagramViewFullScreen ? {display: 'none'} : undefined">
      <el-table
        v-loading="tableLoading"
        :height="tableHeight"
        :data="tableData"
        stripe
        current-row-key="id"
      >
        <el-table-column type="index" label="_"></el-table-column>
        <el-table-column prop="state" label="节点"></el-table-column>
        <el-table-column prop="operation_user" label="操作人"></el-table-column>
        <el-table-column prop="operation" label="操作"></el-table-column>
        <el-table-column prop="start_time" label="开始时间"></el-table-column>
        <el-table-column prop="end_time" label="提交时间"></el-table-column>
        <el-table-column prop="duration" label="时长"></el-table-column>
      </el-table>
    </div>
    <div class="diagram-view">
      <div class="tool-bar">
        <el-button-group>
          <el-button @click="handleZoomShrink" :disabled="disabledShrink" title="缩小">
            <s-v-g-icon name="Subtract" style="width: 1em; height: 1em"/>
          </el-button>
          <el-button  @click="handleZoomReset">{{ ((scale || 1) * 100).toFixed(2) + '%' }}</el-button>
          <el-button  @click="handleZoomExpand" title="放大">
            <s-v-g-icon name="Plus" style="width: 1em; height: 1em"/>
          </el-button>
          <el-button  @click="handleFullScreen" title="全屏">
            <s-v-g-icon :name="diagramViewFullScreen ? 'FullScreenMinimize' : 'FullScreenMaximize'" style="width: 1em; height: 1em"/>
          </el-button>
        </el-button-group>
      </div>
      <div ref="canvasRef" :style="{width: '100%', height: viewerHeight}"></div>
    </div>
  </div>
  <el-popover
    :virtual-ref="hoverElem"
    trigger="hover"
    virtual-triggering
    placement="top"
    width="300px"
  >
    <el-descriptions size="small" :column="2" border>
      <template v-for="item in assigneeInfo">
        <el-descriptions-item label="用户" label-align="left">
          <span v-if="!item.user_info">待认领</span>
          <user-viewer v-if="!!item.user_info" :data="item.user_info"></user-viewer>
        </el-descriptions-item>
        <el-descriptions-item label="操作" label-align="left">
          <el-tag v-text="item?.state"></el-tag>
        </el-descriptions-item>
      </template>
    </el-descriptions>
  </el-popover>
</template>

<script lang="ts" setup>
import {ref, computed, shallowRef, onMounted, inject, onUpdated, toRaw, watch,} from "vue"
import { ElTable, ElTableColumn, ElPopover, ElScrollbar, ElDescriptions, ElDescriptionsItem, ElTag, ElButtonGroup, ElButton } from "element-plus"
import BpmnViewer from 'bpmn-js/lib/NavigatedViewer'
import ImportModule from 'bpmn-js/lib/import/index'
import DrawModule from 'bpmn-js/lib/draw/index'
import {asideWidthKey, mainHeightKey, processInstanceDetailInfoKey, themeKey} from "@/config/app.keys";
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'diagram-js-minimap/assets/diagram-js-minimap.css'
import * as ProcessModelApi from "@/api/sys/process";
import {toReadableDuration} from "@/utils/common";
import { ElementRegistry } from "bpmn-js"
import UserViewer from "@/components/common/viewer/user/UserViewer.vue";
import {useIcon} from "@/components/common/util";
import {InternalEvent} from "diagram-js/lib/core/EventBus";
import SVGIcon from "@/components/common/SVGIcon.vue";
import MiniMapModule from 'diagram-js-minimap/dist/index'

const canvasRef = shallowRef<HTMLDivElement>()
const viewer = shallowRef<BpmnViewer>()
const histories = shallowRef<HistoricActivityInstanceView[]>([])
const processInfo = inject(processInstanceDetailInfoKey)

interface TableModel {
  state: string
  operation: string // flow label
  operation_user: string // task assignee or creator
  start_time: string
  end_time: string
  duration: string
}

interface AssigneeInfo {
  user_info: UserView
  state: string
}

const tableLoading = ref<boolean>(false)
const tableData = computed<TableModel[]>(() => {
  if (!viewer.value) {
    return []
  }

  const userTasks = histories.value?.filter(it => ['userTask'].includes(it.activity_type))
  const elems: TableModel[] = []

  elems.push({
    state: '开始',
    operation: '发起',
    operation_user: processInfo.value.creator.label,
    start_time: processInfo.value.create_time,
    end_time: processInfo.value.create_time,
    duration: '0秒'
  })

  for (let userTask of userTasks) {
    if (!!userTask.end_time === false) {
      continue
    }
    elems.push({
      state: userTask.activity_name,
      operation: userTask.outcome,
      operation_user: userTask.assignee.label,
      start_time: userTask.start_time,
      end_time: userTask.end_time,
      duration: toReadableDuration(Math.ceil(userTask.duration_in_millis / 1000))
    })
  }
  return elems
})

const scale = ref<number>(1)
const disabledShrink = computed<boolean>(() => {
  if (!!scale.value) {
    return scale.value <= 0.1
  } else {
    return false
  }
})
onMounted(() => initViewer())

async function initViewer() {
  if (viewer.value || !processInfo.value) {
    console.log("histories", histories.value)
    return
  }
  try {
    const bpmn = await ProcessModelApi.findProcessModelBPMN(processInfo.value.process_bpmn_id)
    viewer.value = new BpmnViewer({
      container: canvasRef.value,
      additionalModules: [
        ImportModule, MiniMapModule, DrawModule,
      ],
      minimap: {
        open: true
      }
    })

    viewer.value.on('canvas.viewbox.changed', function (ev: InternalEvent, data: any) {
      console.log('canvas.viewbox.changed', data.viewbox.scale)
      if (data.viewbox.scale) {
        scale.value = data.viewbox.scale
      } else {
        scale.value = 1
      }
    })

    await initViewerDiagram(bpmn.content)

  } catch (e) {
    console.error(e)
  }


}

function handleZoomReset() {
  const canvas = viewer.value.get('canvas')
  scale.value = 1
  canvas.zoom(1);
}

function handleZoomExpand() {
  const canvas = viewer.value.get('canvas')
  scale.value = scale.value + 0.1
  canvas.zoom(scale.value);
}

function handleZoomShrink() {
  const canvas = viewer.value.get('canvas')
  scale.value = scale.value - 0.1
  canvas.zoom(scale.value);
}

const diagramViewFullScreen = ref<boolean>(false)
function handleFullScreen() {
  diagramViewFullScreen.value = !diagramViewFullScreen.value
  if (diagramViewFullScreen.value) {

  } else {

  }
}

async function initViewerDiagram(xml: string) {
  // find str
  const result = await viewer.value.importXML(xml)
  console.log(result)

  const defs = document.querySelector(".djs-container svg defs")
  if (defs) {
    const markerEnd = createMarkerEnd()
    defs.appendChild(markerEnd)
    const conditionalMarker = createMarkerStartCondition()
    defs.appendChild(conditionalMarker)
  }

  const canvas2 = viewer.value.get("canvas");
  console.log('canvas2', canvas2)
  console.log(canvas2.zoom())
  canvas2.zoom("fit-viewport", true);

  tableLoading.value = true
  histories.value = await ProcessModelApi.readProcessHistory(processInfo.value.process_instance_id)
  tableLoading.value = false

  coloring()
  attachEventListener()

}

function createMarkerStartCondition(): SVGMarkerElement {
  const marker: SVGMarkerElement = document.createElementNS("http://www.w3.org/2000/svg", 'marker')
  const markerAttrs = {
    id: 'conditional-flow-marker-red',
    viewBox: '0 0 20 20',
    refX: '-1',
    refY: '10',
    markerWidth: '10',
    markerHeight: '10',
    orient: 'auto',
  }

  const keys = Object.keys(markerAttrs)
  for (let key of keys) {
    marker.setAttribute(key, markerAttrs[key])
  }

  const path: SVGPathElement = document.createElementNS("http://www.w3.org/2000/svg", 'path')
  const pathAttrs = {
    d: 'M 0 10 L 8 6 L 16 10 L 8 14 Z',
    style: 'fill: white; stroke-width: 1px; stroke-linecap: round; stroke-dasharray: 10000, 1; stroke: red;'
  }
  const pathKeys = Object.keys(pathAttrs)
  for (let key of pathKeys) {
    path.setAttribute(key, pathAttrs[key])
  }

  marker.appendChild(path)
  return marker
}

function createMarkerEnd(): SVGMarkerElement {
  const marker: SVGMarkerElement = document.createElementNS("http://www.w3.org/2000/svg", 'marker')
  const markerAttrs = {
    id: 'sequenceflow-arrow-normal-red',
    viewBox: '0 0 20 20',
    refX: '11',
    refY: '10',
    markerWidth: '10',
    markerHeight: '10',
    orient: 'auto',
  }

  const keys = Object.keys(markerAttrs)
  for (let key of keys) {
    marker.setAttribute(key, markerAttrs[key])
  }

  const path: SVGPathElement = document.createElementNS("http://www.w3.org/2000/svg", 'path')
  const pathAttrs = {
    d: 'M 1 5 L 11 10 L 1 15 Z',
    style: 'fill: red; stroke-width: 1px; stroke-linecap: round; stroke-dasharray: 10000, 1; stroke: red;'
  }
  const pathKeys = Object.keys(pathAttrs)
  for (let key of pathKeys) {
    path.setAttribute(key, pathAttrs[key])
  }

  marker.appendChild(path)
  return marker
}

function coloring() {
  const data = histories.value
  const canvas = viewer.value.get("canvas")
  for (let item of data) {
    canvas.addMarker(item.activity_id, "highlight-red");
  }

  canvas.addMarker(processInfo.value.current_node_key, 'highlight-current')

  const registry = viewer.value.get('elementRegistry') as ElementRegistry

  registry.filter(it => it.type === 'bpmn:SequenceFlow' && !!it.businessObject?.conditionExpression)
    .forEach(it => canvas.addMarker(it.id, 'conditional-flow'))
}

const hoverElem = shallowRef<HTMLElement>()
function attachEventListener() {
  viewer.value.on('element.hover', function (e) {
    const { element } = e
    if (element.type === 'bpmn:UserTask') {
      if (histories.value.some(it => it.activity_id === element.id)) {
        hoverElem.value = document.querySelector(`g[data-element-id=${element.id}]`)
      } else {
        hoverElem.value = null
      }
    }
  })
}

const assigneeInfo = computed<AssigneeInfo[]>(() => {
  const result: AssigneeInfo[] = []

  const elemId = hoverElem.value?.getAttribute('data-element-id')
  if (elemId === null) {
    return []
  }
  const items = histories.value?.filter(it => it.activity_id === elemId)
  if (!items || items.length === 0) return []

  // activity: 驳回时会存在多条历史记录，因此需要顺序获取
  const activityGroupMap = new Map<string, HistoricActivityInstanceView[]>()
  const length = histories.value.length
  for (let i = 0; i < length; i++) {
    const history = histories.value[i]
    if (!activityGroupMap.has(history.activity_id)) {
      activityGroupMap.set(history.activity_id, [])
    }
    activityGroupMap.get(history.activity_id).push(history)
  }


  return items.map(it => {
    return {
      user_info: it.assignee ,
      state: it.end_time ? it.outcome : '待处理'
    } as AssigneeInfo
  })
})

defineExpose({
  initViewer
})

const mainHeight = inject(mainHeightKey);
const asideWidth = inject(asideWidthKey);
const theme = inject(themeKey);
const contentHeight = computed(() => {
  return `calc(${mainHeight.value} - ${theme.value.mainPadding * 2 + 42 + 30}px)`
})

const tableHeight = 300
const viewerHeight = computed(() => {
  if (diagramViewFullScreen.value) {
    return contentHeight.value
  } else {
    return `calc(${contentHeight.value} - ${tableHeight}px)`
  }
})
</script>

<style scoped>
:deep(.bjs-breadcrumbs) {
  display: none;
}

.viewer-container {
  height: v-bind(contentHeight);
  position: relative;
}

.diagram-view {
  position: relative;
}

.tool-bar {
  position: absolute;
  left: 30px;
  top: 10px;
  z-index: 101;
}

:deep(.highlight-red .djs-visual > :nth-child(1)) {
  stroke: red !important;
}

:deep(.highlight-red.djs-connection path) {
  marker-end: url(#sequenceflow-arrow-normal-red) !important;
}

:deep(.conditional-flow.highlight-red .djs-visual > :nth-child(1)) {
  marker-start: url(#conditional-flow-marker-red) !important;
}

:deep(.highlight-current .djs-outline) {
  stroke: red;
  stroke-width: 1px;
  visibility: visible;
  shape-rendering: geometricPrecision;
  stroke-dasharray: 3,3;
}

:deep(:focus) {
  outline: none;
}

:deep(.bjs-powered-by) {
  /*display: none;*/
}
</style>
