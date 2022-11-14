<template>
  <el-scrollbar always>
    <el-collapse v-model="expand">
      <el-collapse-item name="base-setting">
        <template #title>
          <div class="collapse-title"><s-v-g-icon style="width: 1em; height: 1em" name="Setting" /><span style="margin-left: 6px">基本设置</span></div>
        </template>
        <BasicSetting></BasicSetting>
      </el-collapse-item>
      <el-collapse-item name="task-listener" v-show="bpmnSelectedElem?.type?.endsWith('Task')">
        <template #title>
          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%">
            <div class="collapse-title"><s-v-g-icon style="width: 1em; height: 1em" name="TaskListening" /><span style="margin-left: 6px">任务监听</span></div>
            <div @click.stop="addTaskListener" style="margin-right: 10px" class="event-add-btn">
              <s-v-g-icon style="width: 1.2em; height: 1.2em; " name="Plus" /></div>
          </div>
        </template>
        <TaskListener></TaskListener>
      </el-collapse-item>
      <el-collapse-item name="execution-listener">
        <template #title>
          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%">
            <div class="collapse-title"><s-v-g-icon style="width: 1em; height: 1em" name="Notification" /><span style="margin-left: 6px">执行监听</span></div>
            <div @click.stop="addExecutionListener" style="margin-right: 10px" class="event-add-btn"><s-v-g-icon style="width: 1.2em; height: 1.2em; " name="Plus" /></div>
          </div>

        </template>
        <ExecutionListener></ExecutionListener>
      </el-collapse-item>
      <el-collapse-item name="flow-condition" v-show="showConditionSeqFlow">
        <template #title>
          <div class="collapse-title">
            <s-v-g-icon style="width: 1em; height: 1em" name="Branch" />
            <span style="margin-left: 6px">流转条件</span>
          </div>
        </template>
        <SeqFlowConfig></SeqFlowConfig>
      </el-collapse-item>
      <el-collapse-item name="owner" v-show="['bpmn:UserTask'].includes(bpmnSelectedElem?.type)">
        <template #title>
          <div class="collapse-title">
            <s-v-g-icon style="width: 1em; height: 1em" name="User" /><span style="margin-left: 6px">审核者</span>
          </div>
        </template>
        <approver-config></approver-config>
      </el-collapse-item>
    </el-collapse>
    <v-dialog
      v-model="executionDialogInfo.visible"
      :title="executionDialogInfo.title"
      append-to-body
      draggable
      @cancel="executionDialogInfo.visible = false"
    >
      <el-form :model="executionDialogInfo.formData" label-width="120px">
        <el-form-item label="事件类型" prop="event" required style="width: 100%">
          <el-select v-model="executionDialogInfo.formData.event" style="width: 100%">
            <el-option label="开始" value="start"></el-option>
            <el-option label="结束" value="end"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="监听器类型" prop="type" required style="width: 100%">
          <el-select v-model="executionDialogInfo.formData.type" style="width: 100%">
            <el-option label="Java类" value="class"></el-option>
            <el-option label="表达式" value="expression"></el-option>
            <el-option label="代理表达式" value="delegateExpression"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="!!valLabel" :label="valLabel" prop="type" required>
          <el-input
            class="val-input"
            v-model="executionDialogInfo.formData.value"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <el-descriptions
        :column="3"
        border
        style="margin-top: 10px"
      >
        <template #title>
          <div style="display: flex; align-items: center">
            <s-v-g-icon style="width: 16px; height: 16px" name="TextField"></s-v-g-icon>
            <span style="margin-left: 6px">字段注入</span>
          </div>
        </template>
        <template #extra>
          <el-button :icon="plusIcon" circle @click="addField"></el-button>
        </template>

        <template v-for="item in executionDialogInfo.formData.fields">
          <el-descriptions-item label="名称" v-text="item.name"></el-descriptions-item>
          <el-descriptions-item label="类型" v-text="item.type"></el-descriptions-item>
          <el-descriptions-item label="值" v-text="item.value"></el-descriptions-item>
        </template>
      </el-descriptions>
    </v-dialog>
    <v-dialog
      v-model="fieldDialogInfo.visible"
      :title="fieldDialogInfo.title"
      append-to-body
      draggable
      @cancel="fieldDialogInfo.visible = false"
    >
      <el-form :model="fieldDialogInfo.formData" label-width="120px">
        <el-form-item label="字段名称" prop="name" required style="width: 100%">
          <el-input
            class="val-input"
            v-model="fieldDialogInfo.formData.name"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="字段类型" prop="type" required style="width: 100%">
          <el-select v-model="fieldDialogInfo.formData.type" style="width: 100%">
            <el-option label="字符串" value="string"></el-option>
            <el-option label="表达式" value="expression"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="值" prop="type" required>
          <el-input
            class="val-input"
            v-model="fieldDialogInfo.formData.value"
          >
          </el-input>
        </el-form-item>
      </el-form>
    </v-dialog>
  </el-scrollbar>


</template>

<script lang="ts" setup>
import {
  ElCollapse, ElCollapseItem, ElScrollbar, ElForm, ElFormItem,
  ElSelect, ElOption, ElButton,
  ElInput, ElDescriptions, ElDescriptionsItem,
} from "element-plus"
import {computed, inject, provide, ref, toRaw} from "vue";
import ExecutionListener from "@/components/bpmn/form/ExecutionListener.vue";
import TaskListener from "@/components/bpmn/form/TaskListener.vue";
import SVGIcon from "@/components/common/SVGIcon.vue";
import {bpmnModelerKey, bpmnSelectedElemKey, propertyPanelOpenedKey} from "@/config/app.keys";
import SeqFlowConfig from "@/components/bpmn/form/SeqFlowConfig.vue";
import BasicSetting from "@/components/bpmn/form/BasicSetting.vue";
import ApproverConfig from "@/components/bpmn/form/ApproverConfig.vue";
import VDialog from "@/components/dialog/VDialog.vue";
import {useIcon} from "@/components/common/util";

const plusIcon = useIcon('Plus')

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

interface DialogInfo<T> {
  visible: boolean
  formData: T
  title?: string
}

interface InjectField {
  name: string
  type: 'string' | 'expression'
  value: string
}

interface ExecutionFormData {
  event: 'start' | 'end'
  type: 'class' | 'expression' | 'delegateExpression'
  value: string
  fields: InjectField[]
}

const valLabelMap = {
  class: 'Java类',
  expression: '表达式',
  delegateExpression: '代理表达式'
}

const fieldDialogInfo = ref<DialogInfo<InjectField>>({
  visible: false,
  title: '',
  formData: {
    name: '',
    type: undefined,
    value: ''
  }
})

const valLabel = computed<string>(() => valLabelMap[executionDialogInfo.value?.formData?.type])
const executionDialogInfo = ref<DialogInfo<ExecutionFormData>>({
  visible: false,
  title: '',
  formData: {
    event: undefined,
    type: undefined,
    value: '',
    fields: []
  }
})

function addField() {
  fieldDialogInfo.value.title = '新增字段'
  fieldDialogInfo.value.visible = true
}

function addExecutionListener() {
  executionDialogInfo.value.title = '新增执行监听器'
  executionDialogInfo.value.visible = true
}

function addTaskListener() {

}

function addGlobalListener() {

}

defineExpose({
  recalculateShowConditionSeqFlow
})

</script>

<style scoped>
:deep(.el-collapse) {
  height: 100%;
  padding: 0 10px;
}

:deep(.el-input) {
  display: inline-block;
}

:deep(.el-collapse-item__header span) {
  font-weight: bold;
  font-size: 1.1em;
}



.event-add-btn {
  cursor: pointer;
}

.event-add-btn:hover {
  color: #409eff;
}

.collapse-title {
  display: flex;
  align-items: center;
}

:deep(.val-input .el-input__wrapper) {
  width: calc(100% - 22px);
}
</style>
