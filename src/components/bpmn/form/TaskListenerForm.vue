<template>
  <el-scrollbar height="400px" always>
    <el-form ref="formRef" :model="listener" label-width="100px" style="margin-top: 6px">
      <el-form-item prop="event" label="事件" required>
        <el-radio-group v-model="listener.event">
          <el-radio-button label="assignment">指派</el-radio-button>
          <el-radio-button label="create">创建</el-radio-button>
          <el-radio-button label="complete">完成</el-radio-button>
          <el-radio-button label="delete">删除</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="type" label="类型" required>
        <el-radio-group v-model="listener.type">
          <el-radio-button label="class">Java类</el-radio-button>
          <el-radio-button label="expression">表达式</el-radio-button>
          <el-radio-button label="delegateExpression" disabled>委托表达式</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="value" label="值" required>
        <el-input v-model="listener.value" />
      </el-form-item>
      <div v-if="listener.type === 'class'" style="width: 100%; height: 200px">
        <ListenerFieldInject ref="fieldRef" v-bind="$props" />
      </div>
    </el-form>
  </el-scrollbar>

</template>

<script lang="ts" setup>
import { ElScrollbar, ElForm, ElFormItem, ElRadioGroup, ElRadioButton, ElInput } from 'element-plus'
import { ref } from "vue";
import ListenerFieldInject from "@/components/bpmn/form/ListenerFieldInject.vue";

interface Props {
  listener: TaskListenerObject
}

const props = defineProps<Props>()

const formRef = ref<InstanceType<typeof ElForm>>()
const fieldRef = ref<InstanceType<typeof ListenerFieldInject>>()

async function validate() {
  await fieldRef.value?.validate()
  await formRef.value?.validate()
}

defineExpose({
  validate
})

// https://l1yp.com/docs/flowable/bpmn/#executionListeners
</script>

<style scoped>

:deep(.listener-field-table.vxe-table--render-default .vxe-header--column:not(.col--ellipsis)) {
  padding: 0;
}

</style>