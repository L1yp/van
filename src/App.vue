<script setup>
import { ElConfigProvider } from "element-plus";
import { RouterView } from "vue-router";
import zhCn from "element-plus/es/locale/lang/zh-cn";

</script>

<template>
  <el-config-provider :locale="zhCn">
    <router-view />
  </el-config-provider>
</template>