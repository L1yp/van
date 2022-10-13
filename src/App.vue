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

.user-ext-dialog {
  box-sizing: border-box;
  margin: 15vh auto;
}

.user-ext-dialog.is-fullscreen {
  box-sizing: border-box;
  margin: auto;
}

.user-ext-dialog.el-dialog .el-dialog__footer {
  padding: 10px;
  border-top: 1px solid #e3e3e3;
  border-bottom: 1px solid #e3e3e3;
  box-sizing: border-box;
}
.user-ext-dialog.el-dialog .el-dialog__header {
  padding: 12px 24px;
  border-bottom: 1px solid #e3e3e3;
  margin-right: 0;
  box-sizing: border-box;
}

.user-ext-dialog.el-dialog .el-dialog__body {
  padding: 20px 20px;
  box-sizing: border-box;
}

.user-ext-dialog.el-dialog .el-row:last-child .el-form-item {
  margin-bottom: 0;
}

.user-ext-dialog.el-dialog .el-form-item.is-success .el-input__validateIcon {
  color: green;
}

.user-ext-dialog.el-dialog .el-form .el-form-item:first-child {
  margin-bottom: 0;
}

.user-ext-dialog.el-dialog .el-form-item + .el-form-item {
  margin-bottom: 0;
  margin-top: 16px;
}

.user-ext-dialog.el-dialog .el-form .el-row:first-child {
  margin-bottom: 0;
}

.user-ext-dialog.el-dialog .el-table--enable-row-hover .el-table__body tr.current-row:hover>td.el-table__cell {
  background-color: var(--el-color-primary-light-3);
}


.user-ext-dialog.el-dialog .el-table--enable-row-hover .el-table__body tr.current-row>td.el-table__cell {
  background-color: var(--el-color-primary-light-5);
}

.user-ext-dialog.el-dialog .el-row + .el-row {
  margin-bottom: 0;
  margin-top: 16px;
}

.el-dialog.is-fullscreen.user-ext-dialog .el-dialog__body {
  height: calc(100vh - 54px - 64px)
}

.el-button.is-plain.is-text + .el-button.is-plain.is-text {
  margin-left: 0;
}

.el-popper.form-item-tooltip code {
  background-color: #f5f7fa;
}
</style>