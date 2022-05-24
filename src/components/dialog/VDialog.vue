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
    :custom-class="props.customClass"
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
        <div style="display: flex; justify-content: space-between; align-content: center; height: 23px; box-sizing: border-box">
          <div style="font-size: 1.2em" v-text="props.title"></div>
          <div style="display: flex; flex-direction: row; justify-content: center">
            <div v-if="props.showFullScreen" @click.stop="requestFullScreen" class="full-screen btn">
              <s-v-g-icon style="width: 20px; height: 20px" :name="fullScreen ? 'FullScreenMinimize' : 'FullScreenMaximize'"/>
            </div>
            <div @click.stop="handleCloseClick" class="close btn">
              <s-v-g-icon style="width: 20px; height: 20px" name="close"/>
            </div>
          </div>
        </div>
      </slot>
    </template>
    <slot name="default"></slot>
    <template #footer>
      <slot name="footer">
        <div style="display: flex; justify-content: center">
          <el-button type="primary" @click="handleConfirm">确定</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </div>
      </slot>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { ref, defineComponent, onUpdated } from "vue"
import { ElDialog, ElButton } from "element-plus"
import { VDialogProps, VDialogEmits } from "./util"
import SVGIcon from "@/components/common/SVGIcon.vue"

export default defineComponent({
  name: "VDialog",
  components: { ElDialog, SVGIcon, ElButton },
  props: VDialogProps,
  emits: VDialogEmits,
  setup(props, ctx){
    const {emit: emits} = ctx

    const visible = ref<boolean>(props.modelValue as boolean)


    onUpdated(() => {
      visible.value = props.modelValue as boolean
      if (props.fullScreen !== undefined) {
        fullScreen.value = props.fullScreen as boolean
      }
    })

    const fullScreen = ref<boolean>(false)
    function requestFullScreen() {
      fullScreen.value = !fullScreen.value
      if (props.fullScreen !== undefined) {
        emits('update:fullScreen', fullScreen.value)
      }
    }


    function handleConfirm() {
      emits("confirm")
    }

    function handleCancel() {
      emits("cancel")
    }


    function handleCloseClick() {
      visible.value = false
      emits("update:modelValue", false)
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
      emits("update:modelValue", false)
    }

    function handleOpenAutoFocus() {
      emits("open-auto-focus")
    }

    function handleCloseAutoFocus() {
      emits("close-auto-focus")
    }
    return  {
      props,
      fullScreen, visible, requestFullScreen,
      handleCloseClick, handleConfirm, handleCancel,
      handleOpen, handleClose, handleClosed, handleOpened,
      handleOpenAutoFocus, handleCloseAutoFocus
    }
  },
})

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