<template>
  <div v-loading="loading" style="background-color: #FFFFFF; padding: 20px; height: 100%; box-sizing: border-box;">
    <div style="background-color: #F5F7FA; box-sizing: border-box; padding: 6px;">
      <el-button :icon="Plus" plain type="primary" @click="handleAddField">新增</el-button>
      <el-button :icon="Link" @click="handleRefField">引用</el-button>
    </div>
    <div>
      <el-table
        border stripe


      >

      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject, ref } from 'vue';
import { workflowDefKey } from '../keys';
import { ElButton, ElTable, ElTableColumn } from "element-plus";
import { Plus, Link } from "@element-plus/icons-vue";

const src = inject(workflowDefKey)

const loading = ref<boolean>(false)


function handleAddField() {

}

function handleRefField() {

}
</script>

<style scoped>

</style>