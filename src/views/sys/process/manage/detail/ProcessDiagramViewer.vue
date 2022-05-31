<template>
  <div class="viewer-container">
    <div>
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
    <el-scrollbar :height="viewerHeight" always>
      <div ref="canvasRef" style="width: 100%; height: 1000px"></div>
    </el-scrollbar>
  </div>
  <el-popover
    :virtual-ref="hoverElem"
    trigger="hover"
    title="责任人"
    virtual-triggering
    placement="top"
  >
    <span v-text="assigneeInfo"></span>
  </el-popover>
</template>

<script lang="ts" setup>
import {ref, computed, shallowRef, onMounted, inject, onUpdated, toRaw, watch,} from "vue"
import { ElTable, ElTableColumn, ElPopover, ElScrollbar } from "element-plus"
import BpmnViewer from 'bpmn-js/lib/Viewer'
import {asideWidthKey, mainHeightKey, processInstanceDetailInfoKey, themeKey} from "@/config/app.keys";
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import * as ProcessModelApi from "@/api/sys/process";
import { dayjs } from "element-plus";
import {toReadableDuration} from "@/utils/common";
import bpmnXml from "@/assets/bpmn/budget-change.bpmn20.xml?raw"

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

const tableLoading = ref<boolean>(false)
const tableData = computed<TableModel[]>(() => {
  if (!viewer.value) {
    return []
  }
  const registry = viewer.value.get("elementRegistry")
  const data = histories.value?.filter(it => ['sequenceFlow'].includes(it.activity_type))
    .sort((a, b) => dayjs(a.end_time).toDate().getTime() - dayjs(b.end_time).toDate().getTime())
  const historyData = histories.value?.sort((a, b) =>
    dayjs(a.end_time).toDate().getTime() - dayjs(b.end_time).toDate().getTime())
  const elems: TableModel[] = []
  const usedTaskSet = new Set<string>()
  for (let item of data) {
    const elem = registry.find(it => it.id === item.activity_id)
    if (!elem) {
      console.warn("cannot find element", item)
      continue
    }
    const source = elem.source
    const target = elem.target
    const tableItem: TableModel = {
      state: '',
      operation: '',
      operation_user: '',
      start_time: '',
      end_time: '',
      duration: '0秒'
    }
    if (source.type === 'bpmn:StartEvent') {
      tableItem.state = source.businessObject?.name
      tableItem.operation = elem.businessObject?.name // label
      tableItem.operation_user = processInfo.value?.creator?.label
      let startElem = historyData.filter(it => !usedTaskSet.has(it.id)).find(it => it.activity_id === source.id)// 查询任务节点的历史条目
      usedTaskSet.add(startElem.id)

      tableItem.start_time = startElem?.start_time || item.start_time
      tableItem.end_time = item.end_time
      const duration = dayjs(tableItem.end_time).diff(tableItem.start_time, 'second')

      tableItem.duration = toReadableDuration(duration)
    }
    else if (source.type === 'bpmn:UserTask'){
      //TODO:  会签 分组处理
      tableItem.state = source.businessObject?.name // source label
      tableItem.operation = elem.businessObject?.name // label
      let taskItem = historyData.filter(it => !usedTaskSet.has(it.id)).find(it => it.activity_id === source.id)// 查询任务节点的历史条目
      usedTaskSet.add(taskItem.id)

      tableItem.operation_user = taskItem?.assignee?.label || item.assignee?.label
      tableItem.start_time = taskItem.start_time
      tableItem.end_time = item.end_time
      const duration = dayjs(tableItem.end_time).diff(tableItem.start_time, 'second')
      tableItem.duration = toReadableDuration(duration)
    }
    else {
      continue
    }

    elems.push(tableItem)
  }

  return elems
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
    })

    await initViewerDiagram(bpmn.content)

  } catch (e) {
    console.error(e)
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

  const registry = viewer.value.get('elementRegistry')

  const flows = registry.filter(it => it.type === 'bpmn:SequenceFlow' && it.businessObject?.conditionExpression)
    .forEach(it => canvas.addMarker(it.id, 'conditional-flow'))



  console.log('flows', flows)
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

const assigneeInfo = computed<string>(() => {
  if (processInfo.value?.current_node_key === hoverElem.value?.id) {
    return processInfo.value?.assignees?.map(it => it.label).join(', ')
  } else {
    const elemId = hoverElem.value?.getAttribute('data-element-id')
    if (elemId === null) {
      return ''
    }
    const history = histories.value?.find(it => it.activity_id === elemId)
    if (!history) return ''
    return history?.assignee?.label
  }
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
const contentWidth = computed(() => {
  return `calc(100vw - ${asideWidth.value} - ${theme.value.mainPadding * 2}px - 100px)`
})

const tableHeight = 300
const viewerHeight = computed(() => {
  return `calc(${contentHeight.value} - ${tableHeight}px)`
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