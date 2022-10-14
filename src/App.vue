<script setup>
import {ElConfigProvider} from "element-plus";
import {RouterView} from "vue-router";
import zhCn from "element-plus/lib/locale/lang/zh-cn";

</script>

<template>
  <el-config-provider :locale="zhCn">
    <router-view />
  </el-config-provider>
</template>

<style>
::-webkit-scrollbar {
  display: block;
  width: 10px;
  height: 10px;
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #e5e6eb content-box;
  border: 2px solid transparent;
  border-radius: 5px;
}

html, body {
  margin: 0;
  padding: 0;
}

body {
  display: flex;
}

#app {
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
}


.el-form-item__label {
  color: #606266;
  font-weight: bold;
}

.el-button.is-plain.is-text + .el-button.is-plain.is-text {
  margin-left: 0;
}

.el-popper.form-item-tooltip code {
  background-color: #f5f7fa;
}
</style>