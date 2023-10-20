<template>
  <div class="diagram-view" v-loading="loading">
    <div class="tool-bar">
      <el-button-group>
        <el-button @click="handleZoomShrink" :disabled="scale && scale <= 0.1" :icon="Minus" title="缩小"/>
        <el-button  @click="handleZoomReset">{{ ((scale || 1) * 100).toFixed(2) + '%' }}</el-button>
        <el-button  @click="handleZoomExpand" :icon="Plus" title="放大"/>
      </el-button-group>
    </div>
    <div ref="canvasRef" style="width: 100%; height: 100%"></div>
    <el-popover
      :virtual-ref="hoverElem"
      trigger="hover"
      virtual-triggering
      placement="top"
      width="600px"
    >
      <el-descriptions size="small" :column="3" border>
        <template v-for="item in assigneeInfo">
          <el-descriptions-item label="用户" label-align="left">
            <span v-if="!item.user_info">待认领</span>
            <user-viewer v-if="!!item.user_info" :data="item.user_info"></user-viewer>
          </el-descriptions-item>

          <el-descriptions-item label="操作" label-align="left">
            <el-tag v-text="item?.state"></el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="时间" label-align="left">
            <span v-text="item?.time"></span>
          </el-descriptions-item>
        </template>
      </el-descriptions>
    </el-popover>
  </div>
</template>
<script lang="ts" setup>
import BpmnViewer from 'bpmn-js/lib/NavigatedViewer'
import ImportModule from 'bpmn-js/lib/import/index'
import DrawModule from 'bpmn-js/lib/draw/index'
import MiniMapModule from 'diagram-js-minimap/dist/index'
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'diagram-js-minimap/assets/diagram-js-minimap.css'
import { computed, inject, onMounted, ref, shallowRef } from 'vue';
import { InternalEvent } from 'diagram-js/lib/core/EventBus';
import { userMapKey } from '@/config/app.keys';
import { ElButtonGroup, ElButton, ElPopover, ElDescriptions, ElDescriptionsItem, ElTag } from "element-plus";
import UserViewer from '@/components/common/viewer/user/UserViewer.vue'
import { Plus, Minus } from "@element-plus/icons-vue";
import GridLineModule from 'diagram-js-grid-bg'

interface Props {
  xml: string
  activityList: WorkflowActivityInfo[]
}

const props = defineProps<Props>()

// 在不可视的情况下初始化 首屏会异常 需要拖动画布才能显示
// onMounted(initViewer)

const viewer = shallowRef()
const scale = ref(1)
const canvasRef = ref<HTMLDivElement>()
const loading = ref(false)
async function initViewer() {
  if (!props.xml || !props.activityList.length || viewer.value) {
    return
  }
  console.log('initViewer');

  try {
    loading.value = true
    viewer.value = new BpmnViewer({
      container: canvasRef.value,
      additionalModules: [
        ImportModule, MiniMapModule, DrawModule, GridLineModule,
      ],
      minimap: {
        open: false
      },
      textRender: {
        defaultStyle: {
          color: 'red'
        }
      },
    })

    viewer.value.on('canvas.viewbox.changed', function (ev: InternalEvent, data: any) {
      console.log('canvas.viewbox.changed', data.viewbox.scale)
      if (data.viewbox.scale) {
        scale.value = data.viewbox.scale
      } else {
        scale.value = 1
      }
    })

    await initViewerDiagram(props.xml)

  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
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

  coloring()
  attachHoverEventListener()

}

const hoverElem = shallowRef<SVGGElement | null>()
function attachHoverEventListener() {
  viewer.value.on('element.hover', function (e: any) {
    const { element } = e
    if (element.type === 'bpmn:UserTask') {
      props.activityList
      if (props.activityList.some(it => it.activity_id === element.id)) {
        hoverElem.value = document.querySelector<SVGGElement>(`g[data-element-id=${element.id}]`)
      } else {
        hoverElem.value = null
      }
    }
  })
}

interface AssigneeInfo {
  user_info: UserView
  state: string
  time: string
}

const userMap = inject(userMapKey)

const assigneeInfo = computed<AssigneeInfo[]>(() => {

const elemId = hoverElem.value?.getAttribute('data-element-id')
if (elemId === null) {
  return []
}
const items = props.activityList?.filter(it => it.activity_id === elemId)
if (!items || items.length === 0) return []

// activity: 驳回时会存在多条历史记录，因此需要顺序获取
const activityGroupMap = new Map<string, WorkflowActivityInfo[]>()
const length = props.activityList.length
for (let i = 0; i < length; i++) {
  const history = props.activityList[i]
  if (!activityGroupMap.has(history.activity_id)) {
    activityGroupMap.set(history.activity_id, [])
  }
  activityGroupMap.get(history.activity_id).push(history)
}


return items.map(it => {
  return {
    user_info: userMap.get(it.assignee),
    state: it.end_time ? it.outcome : '待处理',
    time: it.end_time
  }
})
})


function coloring() {
  const data = props.activityList
  const canvas = viewer.value.get("canvas")
  for (let item of data) {
    canvas.addMarker(item.activity_id, "highlight-red");
  }

  const currentTaskDefKey = props.activityList.find(it => it.activity_type === 'userTask' && !it.end_time)?.activity_id
  if (currentTaskDefKey) {
    canvas.addMarker(currentTaskDefKey, 'highlight-current')
  }


  const registry = viewer.value.get('elementRegistry') as ElementRegistry

  registry.filter(it => it.type === 'bpmn:SequenceFlow' && !!it.businessObject?.conditionExpression)
    .forEach(it => canvas.addMarker(it.id, 'conditional-flow'))
}

function createMarkerStartCondition(): SVGMarkerElement {
  const marker: SVGMarkerElement = document.createElementNS("http://www.w3.org/2000/svg", 'marker')
  const markerAttrs: Record<string, string> = {
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

defineExpose({
  init: initViewer
})

</script>


<style scoped>
:deep(.bjs-breadcrumbs) {
  display: none;
}

.diagram-view {
  width: 100%;
  height: 100%;
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

:deep(.highlight-red.djs-connection > path) {
  marker-end: url(#sequenceflow-arrow-normal-red) !important;
  stroke-width: 2 !important;
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
