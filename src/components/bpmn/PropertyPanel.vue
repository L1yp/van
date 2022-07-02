<template>
  <el-scrollbar always>
    <el-collapse v-model="expand" accordion>
      <el-collapse-item name="base-setting">
        <template #title>
          <div><s-v-g-icon style="width: 1em; height: 1em" name="Setting" /><span style="margin-left: 6px">基本设置</span></div>
        </template>
        <BasicSetting></BasicSetting>
      </el-collapse-item>
      <el-collapse-item name="task-listener" v-show="bpmnSelectedElem?.type?.endsWith('Task')">
        <template #title>
          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%">
            <div><s-v-g-icon style="width: 1em; height: 1em" name="TaskListening" /><span style="margin-left: 6px">任务监听</span></div>
            <div @click.stop="" style="margin-right: 10px" class="event-add-btn">
              <s-v-g-icon style="width: 1.2em; height: 1.2em; " name="Plus" /></div>
          </div>
        </template>
        <TaskListener></TaskListener>
      </el-collapse-item>
      <el-collapse-item name="execution-listener">
        <template #title>
          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%">
            <div><s-v-g-icon style="width: 1em; height: 1em" name="Notification" /><span style="margin-left: 6px">执行监听</span></div>
            <div @click.stop="" style="margin-right: 10px" class="event-add-btn"><s-v-g-icon style="width: 1.2em; height: 1.2em; " name="Plus" /></div>
          </div>

        </template>
        <ExecutionListener></ExecutionListener>
      </el-collapse-item>
      <el-collapse-item name="global-listener" v-show="bpmnSelectedElem?.type === 'bpmn:Process'">
        <template #title>
          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%">
            <div><s-v-g-icon style="width: 1em; height: 1em" name="Notification" /><span style="margin-left: 6px">全局监听</span></div>
            <div @click.stop="" style="margin-right: 10px" class="event-add-btn"><s-v-g-icon style="width: 1.2em; height: 1.2em; " name="Plus" /></div>
          </div>
        </template>
        <GlobalListener></GlobalListener>
      </el-collapse-item>
      <el-collapse-item name="flow-condition" v-show="showConditionSeqFlow">
        <template #title>
          <s-v-g-icon style="width: 1em; height: 1em" name="Branch" /><span style="margin-left: 6px">流转条件</span>
        </template>
        <SeqFlowConfig></SeqFlowConfig>
      </el-collapse-item>
      <el-collapse-item name="owner" v-show="['bpmn:UserTask'].includes(bpmnSelectedElem?.type)">
        <template #title>
          <s-v-g-icon style="width: 1em; height: 1em" name="User" /><span style="margin-left: 6px">审核者</span>
        </template>
        <approver-config></approver-config>
      </el-collapse-item>
      <el-collapse-item name="page" v-show="['bpmn:UserTask', 'bpmn:SequenceFlow', 'bpmn:EndEvent', 'bpmn:StartEvent'].includes(bpmnSelectedElem?.type)">
        <template #title>
          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%">
            <div><s-v-g-icon style="width: 1em; height: 1em" name="Page" /><span style="margin-left: 6px">页面配置</span></div>
          </div>
        </template>
        <PageConfig></PageConfig>
      </el-collapse-item>
      <el-collapse-item name="multi-instance"  v-show="['bpmn:UserTask','bpmn:ManualTask'].includes(bpmnSelectedElem?.type)">
        <template #title>
          <s-v-g-icon style="width: 1em; height: 1em" name="Team" /><span style="margin-left: 6px">会签配置</span>
        </template>
        <MultiInstanceConfig></MultiInstanceConfig>
      </el-collapse-item>
    </el-collapse>
  </el-scrollbar>

</template>

<script lang="ts" setup>
import {ElCard, ElCollapse, ElCollapseItem, ElScrollbar} from "element-plus"
import {computed, inject, onMounted, provide, ref, toRaw, getCurrentInstance } from "vue";
import ExecutionListener from "@/components/bpmn/form/ExecutionListener.vue";
import TaskListener from "@/components/bpmn/form/TaskListener.vue";
import GlobalListener from "@/components/bpmn/form/GlobalListener.vue";
import MultiInstanceConfig from "@/components/bpmn/form/MultiInstanceConfig.vue";
import SVGIcon from "@/components/common/SVGIcon.vue";
import {bpmnModelerKey, bpmnSelectedElemKey, propertyPanelOpenedKey} from "@/config/app.keys";
import SeqFlowConfig from "@/components/bpmn/form/SeqFlowConfig.vue";
import BasicSetting from "@/components/bpmn/form/BasicSetting.vue";
import ApproverConfig from "@/components/bpmn/form/ApproverConfig.vue";
import PageConfig from "@/components/bpmn/form/PageConfig.vue";


const expand = ref<string>("base-setting")
function open(key: string) {
  if (expand.value === 'page' && key === 'owner') {
    return
  }
  expand.value = key
}

provide(propertyPanelOpenedKey, expand)


const bpmnSelectedElem = inject(bpmnSelectedElemKey)
const bpmnModeler = inject(bpmnModelerKey)

const showConditionSeqFlow = computed<boolean>(() => {
  const selectedElem = toRaw(bpmnSelectedElem.value)
  if (selectedElem?.type !== 'bpmn:SequenceFlow') {
    return false;
  }
  const bo = selectedElem?.businessObject
  if (bo?.sourceRef?.$type === 'bpmn:ExclusiveGateway') {
    return true;
  }

  return !!bo?.conditionExpression;
})

/**
 * <b>bpmnSelectedElem</b>是ShallowRef浅层响应式
 * 当sequenceFlow变成Condition SequenceFlow不会触发computed重新计算
 * 因此暴漏此方法手动触发
 */
function recalculateShowConditionSeqFlow() {
  showConditionSeqFlow.effect.scheduler()
}


defineExpose({
  recalculateShowConditionSeqFlow
})

</script>

<style scoped>
:deep(.el-input) {
  display: inline-block;
}

:deep(.el-collapse-item__header span) {
  font-weight: bold;
  font-size: 1.1em;
}

:deep(.el-collapse-item__header) {
  position: relative;
  padding-left: 20px;
}

:deep(.el-collapse-item__arrow) {
  margin: unset;
  position: absolute;
  top: calc((49px - 1em)  * 50%);
  left: 0;
}

.event-add-btn {
  cursor: pointer;
}

.event-add-btn:hover {
  color: #409eff;
}

</style>
