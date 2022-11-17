<template>
  <div class="field-item">
    <label>页面:&nbsp;</label>
    <el-select v-model="formData.process_model_page_id">
      <el-option
        v-for="item in pageList"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      >
      </el-option>
    </el-select>
  </div>
  <div class="field-item">
    <label>页面宽度:&nbsp;</label>
    <el-input v-model="formData.page_width" placeholder="请输入页面宽度，如: 851px"></el-input>
  </div>
  <div class="field-item">
    <label>标签宽度:&nbsp;</label>
    <el-input v-model="formData.label_width" placeholder="请输入标签宽度，如: 120px"></el-input>
  </div>
  <div class="field-item">
    <label>备注配置:&nbsp;</label>
    <el-select v-model="formData.comment">
      <el-option key="0" label="不需要" :value="0"></el-option>
      <el-option key="1" label="可选" :value="1"></el-option>
      <el-option key="2" label="必填" :value="2"></el-option>
    </el-select>
  </div>
  <el-button @click="handleBingPage" style="width: 100%">保存</el-button>
</template>

<script lang="ts" setup>
import { ref, inject } from "vue"
import { ElRow, ElCol, ElInput, ElMessage, ElButton, ElSelect, ElOption } from "element-plus"
import { bpmnSelectedElemKey, processNodePageListKey } from "@/config/app.keys";

const bpmnSelectedElem = inject(bpmnSelectedElemKey);
const processNodePages = inject(processNodePageListKey);


</script>

<style scoped>

.field-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 40px;
}

.field-item label {
  width: v-bind(labelWidth);
  text-align: right;
}

:deep(.el-input) {
  width: v-bind(inputWidth)
}

:deep(.el-textarea) {
  width: v-bind(inputWidth)
}

:deep(.el-input__wrapper) {
  box-sizing: border-box;
  width: v-bind(inputWidth);
}

</style>