<template>
  <el-tabs type="border-card" class="wf-instance-tabs">
    <el-tab-pane label="基本信息">
      <WorkflowInstanceTaskForm v-loading="loading" :form-data="detailInfo?.instance_info || null" :scheme="detailInfo?.page_info?.page_scheme || null" />
    </el-tab-pane>
    <el-tab-pane label="操作记录">
      操作记录
    </el-tab-pane>
    <el-tab-pane label="流转记录">
      流转记录
    </el-tab-pane>
    <el-tab-pane label="流程图">
      流程图
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { ElTabs, ElTabPane } from "element-plus";
import { useWorkflowInstanceApi } from "@/service/workflow";
import { inject, onBeforeMount, ref } from "vue";
import WorkflowInstanceTaskForm from "./WorkflowInstanceTaskForm.vue";
import { userMapKey } from "@/config/app.keys";


interface Props {
  mkey: string
  instanceId: string
}

const props = defineProps<Props>()
console.log('instance page, instanceId', props.instanceId);

const userMap = inject(userMapKey)

const loading = ref(false)
const { instanceDetails, getInstanceInfo } = useWorkflowInstanceApi(loading)

const detailInfo = ref<WorkflowInstanceDetailsResult>()


onBeforeMount(async() => {
  await getInstanceInfo({ ...props })
  if (instanceDetails.value.user_map) {
    const keys = Object.keys(instanceDetails.value.user_map)
    for (const userId of keys) {
      userMap.set(userId, instanceDetails.value.user_map[userId])
    }
  }

  detailInfo.value = instanceDetails.value
})

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

</style>