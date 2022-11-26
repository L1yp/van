<template>
  <el-tabs v-loading="loading" v-model="activeTab" @tab-change="changeTab" type="border-card" class="wf-instance-tabs" >
    <el-tab-pane name="basic" label="基本信息">
      <div style="width: 100%; height: 100%; position: relative;">
        <div style="box-sizing: border-box; width: 100%; height: 40px; padding: 4px;">
          <el-button @click="$router.back()" >返回</el-button>
          <el-button v-for="outcome in (detailInfo?.outcomes || [])" :key="outcome.name" @click="handleClickOutcome(outcome)" >{{ outcome.name }}</el-button>
        </div>
        <div style="box-sizing: border-box; width: 100%; height: calc(100% - 32px);">
          <WorkflowInstanceTaskForm v-loading="loading" :form-data="detailInfo?.instance_info || null" :scheme="detailInfo?.page_info?.page_scheme || null" />
        </div>
        <div id="basic-form-panel"></div>
        <MaskWindow v-model="postPanelVisible" teleport-to="#basic-form-panel" show-toolbar @confirm="handleConfirmPost" @cancel="handleCancelPost">
          <el-scrollbar always>
            <VFormRender ref="postFormRef" :scheme="postPageScheme" :form-data="postFormData" style="margin-top: 10px" />
          </el-scrollbar>
          
        </MaskWindow>
      </div>
      
    </el-tab-pane>
    <el-tab-pane name="operation" label="操作记录">
      <WorkflowCommentPage :comment-list="detailInfo?.comment_list || []" />
    </el-tab-pane>
    <el-tab-pane name="flow" label="流转记录">
      <WorkflowActivityPage :activity-list="detailInfo?.activity_list || []" />
    </el-tab-pane>
    <el-tab-pane name="diagram" label="流程图">
      <WorkflowProgressDiagram :key="diagramKey" ref="diagramRef" :activity-list="detailInfo?.activity_list || []" :xml="detailInfo?.xml || ''" />
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { ElTabs, ElTabPane, ElButton, ElScrollbar } from "element-plus";
import { useWorkflowInstanceApi, useWorkflowTaskApi } from "@/service/workflow";
import { inject, nextTick, onBeforeMount, ref } from "vue";
import WorkflowInstanceTaskForm from "./WorkflowInstanceTaskForm.vue";
import WorkflowActivityPage from "./WorkflowActivityPage.vue";
import WorkflowCommentPage from "./WorkflowCommentPage.vue";
import WorkflowProgressDiagram from "./WorkflowProgressDiagram.vue";
import { userMapKey } from "@/config/app.keys";
import MaskWindow from "@/components/dialog/MaskWindow.vue";
import VFormRender from "@/components/form/designer/VFormRender.vue";


interface Props {
  mkey: string
  instanceId: string
}

const props = defineProps<Props>()
console.log('instance page, instanceId', props.instanceId);

const diagramKey = ref(1)
const diagramRef = ref<InstanceType<typeof WorkflowProgressDiagram>>()
const activeTab = ref('basic')
function changeTab(name: string) {
  console.log('tab changed', name);
  
  if (name === 'diagram') {
    diagramRef.value.init()
  }
}

const userMap = inject(userMapKey)

const loading = ref(false)
const { instanceDetails, getInstanceInfo } = useWorkflowInstanceApi(loading)

const detailInfo = ref<WorkflowInstanceDetailsResult>()


onBeforeMount(loadInstanceData)

async function loadInstanceData() {
  await getInstanceInfo({ ...props })
  if (instanceDetails.value.user_map) {
    const keys = Object.keys(instanceDetails.value.user_map)
    for (const userId of keys) {
      userMap.set(userId, instanceDetails.value.user_map[userId])
    }
  }
  detailInfo.value = instanceDetails.value
  diagramKey.value++
  // nextTick(diagramRef.value.init)
}

const { completeTask } = useWorkflowTaskApi(loading)
const postPanelVisible = ref(false)
const postOutcome = ref('')
const postPageScheme = ref<VFormScheme>()
const postFormData = ref<Record<string, any>>({})
const postFormRef = ref<InstanceType<typeof VFormRender>>()
function handleClickOutcome(outcome: WorkflowOutcomeInfo) {
  const data: WorkflowTaskCompleteParam = {
    mkey: props.mkey,
    task_id: detailInfo.value.task_id,
    data: detailInfo.value.instance_info,
    outcome: outcome.name
  }
  if (!outcome.page_info) {
    completeTask(data).then(loadInstanceData)
  } else {
    postOutcome.value = outcome.name
    postFormData.value = detailInfo.value.instance_info
    postPageScheme.value = outcome.page_info.page_scheme
    postPanelVisible.value = true
  }
}

function handleConfirmPost() {
  const comment = postFormData.value.comment
  const data: WorkflowTaskCompleteParam = {
    mkey: props.mkey,
    task_id: detailInfo.value.task_id,
    data: postFormData.value,
    outcome: postOutcome.value,
    comment: comment,
  }
  completeTask(data).then(() => postPanelVisible.value = false).then(loadInstanceData)
}

function handleCancelPost() {
  postFormRef.value.formRef.resetFields()
  postPanelVisible.value = false
}

</script>

<style scoped>
.wf-instance-tabs {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}

.wf-instance-tabs :deep(.el-tabs__content) {
  box-sizing: border-box;
  width: 100%;
  height: calc(100% - 39px);
}

:deep(.el-tab-pane) {
  width: 100%;
  height: 100%;
}

</style>