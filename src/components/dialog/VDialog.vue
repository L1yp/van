<template>
  <el-dialog
    v-model="visible"
    :fullscreen="fullScreen"
    :show-close="false"
    :draggable="draggable"
    :class="!!fixedBodyHeight ? null : 'flex-body'"
    v-bind="$attrs"
  >
    <template #header>
      <slot name="header">
        <div style="height: 24px; display: flex; justify-content: center; align-content: center; box-sizing: border-box; font-weight: bold; color: rgb(118 131 164); position: relative">
          <div v-text="props.title"></div>
          <div style="display: flex; flex-direction: row; justify-content: center; position: absolute; right: 0">
            <div v-if="props.showFullScreen" @click.stop="requestFullScreen" style="width: 24px; height: 24px; " class="full-screen btn">
              <svg v-if="fullScreen" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none"><path d="M8.5 3.75a.75.75 0 0 0-1.5 0v2.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 0 0 1.5h2.5A2.25 2.25 0 0 0 8.5 6.25v-2.5zm0 16.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 0-.75-.75h-2.5a.75.75 0 0 1 0-1.5h2.5a2.25 2.25 0 0 1 2.25 2.25v2.5zM16.25 3a.75.75 0 0 0-.75.75v2.5a2.25 2.25 0 0 0 2.25 2.25h2.5a.75.75 0 0 0 0-1.5h-2.5a.75.75 0 0 1-.75-.75v-2.5a.75.75 0 0 0-.75-.75zm-.75 17.25a.75.75 0 0 0 1.5 0v-2.5a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 0 0-1.5h-2.5a2.25 2.25 0 0 0-2.25 2.25v2.5z" fill="currentColor"/></g></svg>
              <svg v-if="!fullScreen" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20"><g fill="none"><path d="M3 5a2 2 0 0 1 2-2h2a.5.5 0 0 1 0 1H5a1 1 0 0 0-1 1v2a.5.5 0 0 1-1 0V5zm9.5-1.5A.5.5 0 0 1 13 3h2a2 2 0 0 1 2 2v2a.5.5 0 0 1-1 0V5a1 1 0 0 0-1-1h-2a.5.5 0 0 1-.5-.5zm-9 9a.5.5 0 0 1 .5.5v2a1 1 0 0 0 1 1h2a.5.5 0 0 1 0 1H5a2 2 0 0 1-2-2v-2a.5.5 0 0 1 .5-.5zm13 0a.5.5 0 0 1 .5.5v2a2 2 0 0 1-2 2h-2a.5.5 0 0 1 0-1h2a1 1 0 0 0 1-1v-2a.5.5 0 0 1 .5-.5z" fill="currentColor"/></g></svg>
            </div>
            <div @click.stop="handleCloseClick" style="width: 24px; height: 24px; " class="close btn">
              <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"></path></svg>
            </div>
          </div>
        </div>
      </slot>
    </template>
    <template v-if="useBodyScrolling">
      <el-scrollbar :max-height="bodyHeight" always>
        <slot name="default"></slot>
      </el-scrollbar>
    </template>
    <template v-else>
      <slot name="default"></slot>
    </template>

    <template #footer>
      <slot name="footer">
        <div style="display: flex; justify-content: center">
          <el-button :disabled="props.disableFooter" type="primary" @click="handleConfirm()" v-text="confirmText"></el-button>
          <el-button :disabled="props.disableFooter" @click="handleCancel()" v-text="cancelText"></el-button>
        </div>
      </slot>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { ElDialog, ElButton, ElScrollbar } from "element-plus"

interface Props {
  /**
   * 标题
   */
  title: string
  /**
   * 显隐
   */
  modelValue: boolean
  /**
   * 全屏
   */
  fullScreen?: boolean
  /**
   * 展示全屏按钮
   */
  showFullScreen?: boolean
  confirmText?: string
  cancelText?: string
  disableFooter?: boolean
  /**
   * 使用el-scrollbar包裹对话框body
   */
  useBodyScrolling?: boolean
  /**
   * 固定对话框body高度
   */
  fixedBodyHeight?: boolean

  draggable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: '确定',
  cancelText: '取消',
  disableFooter: false,
  useBodyScrolling: true,
  fixedBodyHeight: false,
  draggable: true,
})

if (props.showFullScreen && props.fullScreen === undefined) {
  console.warn("启用全屏选项请提供全屏控制变量")
}

interface Emits {
  (e: 'update:modelValue', val: boolean): void,
  (e: 'update:fullScreen', val: boolean): void,
  (e: 'confirm'): void,
  (e: 'cancel'): void,
}
const emits = defineEmits<Emits>()

const visible = computed<boolean>({
  get: () => { return props.modelValue },
  set: v => emits('update:modelValue', v)
})

const fullScreen = computed<boolean>({
  get: () => { return props.fullScreen || false },
  set: v => emits('update:fullScreen', v)
})

// const fullScreen = ref<boolean>(false)
function requestFullScreen() {
  fullScreen.value = !fullScreen.value
  // if (props.fullScreen !== undefined) {
  //   emits('update:fullScreen', fullScreen.value)
  // }
}


const bodyHeight = computed(() => {
  if (props.fullScreen) {
    // footerHeight=52,headerHeight=44,padding=32
    return `calc(100vh - 52px - 44px - 32px)`
  } else {
    return `calc(70vh - 52px - 44px - 32px)`
  }
})


function handleConfirm() {
  emits("confirm")
}

function handleCancel() {
  emits("cancel")
}


function handleCloseClick() {
  visible.value = false
}

</script>

<style>

.el-dialog__footer {
  padding: 10px;
  /*border-top: 1px solid var(--el-border-color);*/
  /*border-bottom: 1px solid var(--el-border-color);*/
  box-sizing: border-box;
  background-color: #f5f7fa;
}

.el-dialog {
  box-sizing: border-box;
  margin: 15vh auto;
}

.el-dialog.is-fullscreen {
  box-sizing: border-box;
  margin: auto;
}

.el-dialog .el-dialog__header {
  padding: 10px 20px;
  /*border-bottom: 1px solid var(--el-border-color);*/
  margin-right: 0;
  box-sizing: border-box;
  background-color: #f5f7fa;
}

.el-dialog--center .el-dialog__body,
.el-dialog__body {
  padding: 16px 20px;
  box-sizing: border-box;
}

.el-dialog.is-fullscreen .el-dialog__body {
  height: calc(100vh - 44px - 52px);
  max-height: calc(100vh - 44px - 52px);
}

.el-dialog .el-dialog__body {
  height: calc(70vh - 44px - 52px);
}

.el-dialog.flex-body .el-dialog__body {
  height: initial;
  max-height: calc(70vh - 44px - 52px);
}
/*
1. flexBody: 弹性高度，


 */
</style>

<style scoped>
div.btn {
  cursor: pointer;
}

div.btn + div.btn {
  cursor: pointer;
  margin-left: 10px;
}

div.btn:hover {
  color: var(--el-color-primary)
}
</style>


