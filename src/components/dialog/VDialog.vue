<template>
  <el-dialog
    v-model="visible"
    :fullscreen="fullScreen"
    :show-close="false"
    :width="props.width"
    :top="props.top"
    :modal="props.modal"
    :append-to-body="props.appendToBody"
    :lock-scroll="props.lockScroll"
    :class="props.customClass"
    :open-delay="props.openDelay"
    :close-delay="props.closeDelay"
    :close-on-click-modal="props.closeOnClickModal"
    :close-on-press-escape="props.closeOnPressEscape"
    :before-close="props.beforeClose"
    :draggable="props.draggable"
    :center="props.center"
    :destroy-on-close="props.destroyOnClose"
    @opened="handleOpened"
    @closed="handleClosed"
    @open="handleOpen"
    @close="handleClose"
    @open-auto-focus="handleOpenAutoFocus"
    @close-auto-focus="handleCloseAutoFocus"
  >
    <template #header>
      <slot name="header">
        <div style="display: flex; justify-content: center; align-content: center; height: 23px; box-sizing: border-box; font-weight: bold; color: rgb(118 131 164); position: relative">
          <div style="font-size: 1.2em" v-text="props.title"></div>
          <div style="display: flex; flex-direction: row; justify-content: center; position: absolute; right: 0">
            <div v-if="props.showFullScreen" @click.stop="requestFullScreen" class="full-screen btn">
              <svg v-if="fullScreen" style="width: 20px; height: 20px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none"><path d="M8.5 3.75a.75.75 0 0 0-1.5 0v2.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 0 0 1.5h2.5A2.25 2.25 0 0 0 8.5 6.25v-2.5zm0 16.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 0-.75-.75h-2.5a.75.75 0 0 1 0-1.5h2.5a2.25 2.25 0 0 1 2.25 2.25v2.5zM16.25 3a.75.75 0 0 0-.75.75v2.5a2.25 2.25 0 0 0 2.25 2.25h2.5a.75.75 0 0 0 0-1.5h-2.5a.75.75 0 0 1-.75-.75v-2.5a.75.75 0 0 0-.75-.75zm-.75 17.25a.75.75 0 0 0 1.5 0v-2.5a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 0 0-1.5h-2.5a2.25 2.25 0 0 0-2.25 2.25v2.5z" fill="currentColor"/></g></svg>
              <svg v-if="!fullScreen" style="width: 20px; height: 20px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20"><g fill="none"><path d="M3 5a2 2 0 0 1 2-2h2a.5.5 0 0 1 0 1H5a1 1 0 0 0-1 1v2a.5.5 0 0 1-1 0V5zm9.5-1.5A.5.5 0 0 1 13 3h2a2 2 0 0 1 2 2v2a.5.5 0 0 1-1 0V5a1 1 0 0 0-1-1h-2a.5.5 0 0 1-.5-.5zm-9 9a.5.5 0 0 1 .5.5v2a1 1 0 0 0 1 1h2a.5.5 0 0 1 0 1H5a2 2 0 0 1-2-2v-2a.5.5 0 0 1 .5-.5zm13 0a.5.5 0 0 1 .5.5v2a2 2 0 0 1-2 2h-2a.5.5 0 0 1 0-1h2a1 1 0 0 0 1-1v-2a.5.5 0 0 1 .5-.5z" fill="currentColor"/></g></svg>
            </div>
            <div @click.stop="handleCloseClick" class="close btn">
              <svg style="width: 20px; height: 20px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ba633cb8=""><path fill="currentColor" d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"></path></svg>
            </div>
          </div>
        </div>
      </slot>
    </template>
    <el-scrollbar max-height="calc(100vh - 15vh - 15vh - 44px - 54px - 32px)" always>
      <slot name="default"></slot>
    </el-scrollbar>


    <template #footer>
      <slot name="footer">
        <div style="display: flex; justify-content: center">
          <el-button :disabled="props.disableFooter" type="primary" @click="handleConfirm" v-text="confirmText"></el-button>
          <el-button :disabled="props.disableFooter" @click="handleCancel" v-text="cancelText"></el-button>
        </div>
      </slot>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { ElDialog, ElButton, ElScrollbar } from "element-plus"


interface Props {
  modelValue: boolean
  title: string
  width?: number | string
  top?: string
  modal?: boolean
  appendToBody?: boolean
  lockScroll?: boolean
  customClass?: string
  openDelay?: number
  closeDelay?: number
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  beforeClose?: (done) => void
  draggable?: boolean
  center?: boolean
  destroyOnClose?: boolean
  fullScreen?: boolean
  showFullScreen?: boolean
  confirmText?: string
  cancelText?: string
  disableFooter?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  width: '50%',
  top: '15vh',
  modal: true,
  appendToBody: false,
  lockScroll: true,
  openDelay: 0,
  closeDelay: 0,
  closeOnClickModal: true,
  closeOnPressEscape: true,
  draggable: true,
  center: false,
  destroyOnClose: false,
  showFullScreen: false,
  confirmText: '确定',
  cancelText: '取消',
  disableFooter: false
})

interface Emits {
  (e: 'update:modelValue', val: boolean): void,
  (e: 'update:fullScreen', val: boolean): void,
  (e: 'open'): void,
  (e: 'opened'): void,
  (e: 'close'): void,
  (e: 'closed'): void,
  (e: 'open-auto-focus'): void,
  (e: 'close-auto-focus'): void,
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
// onUpdated(() => {
//   visible.value = props.modelValue as boolean
//   if (props.fullScreen !== undefined) {
//     fullScreen.value = props.fullScreen as boolean
//   }
// })



function handleConfirm() {
  emits("confirm")
}

function handleCancel() {
  emits("cancel")
}


function handleCloseClick() {
  visible.value = false
}


function handleOpen() {
  emits("open")
}

function handleClose() {
  emits("close")
}

function handleOpened() {
  emits("opened")
}

function handleClosed() {
  emits("closed")
}

function handleOpenAutoFocus() {
  emits("open-auto-focus")
}

function handleCloseAutoFocus() {
  emits("close-auto-focus")
}
</script>

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


