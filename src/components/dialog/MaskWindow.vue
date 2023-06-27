<template>
  <Teleport v-if="visible" :to="toElem">
    <div
      class="mask-root-window"
      :style="rootStyle"
    >
      <template v-if="mode === 'dev'">
        <div class="mask-window-wrapper">
          <slot v-if="showToolbar" name="toolbar">
            <div style="box-sizing: border-box; padding: 6px;  background-color: var(--toolbar-bg-color);">
              <el-button @click="emits('cancel')" v-text="cancelText" ></el-button>
              <el-button @click="emits('confirm')" type="primary" plain v-text="confirmText"></el-button>
            </div>
          </slot>
          <slot></slot>
        </div>
      </template>
      <template v-else>
        <transition name="fade" mode="out-in" appear>
          <div class="mask-window-wrapper">
            <slot v-if="showToolbar" name="toolbar">
              <div style="box-sizing: border-box; padding: 6px;  background-color: var(--toolbar-bg-color);">
                <el-button @click="emits('cancel')" v-text="cancelText" ></el-button>
                <el-button @click="emits('confirm')" type="primary" plain v-text="confirmText"></el-button>
              </div>
            </slot>
            <slot></slot>
          </div>
        </transition>
      </template>

      <div
        title="关闭蒙版"
        class="close-mask"
        :style="{ 'z-index': zIndex + 1 }"
        @click.stop="visible = false"
      >
        <s-v-g-icon class="close-icon" name="close"></s-v-g-icon>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import {computed, onDeactivated, RendererElement} from "vue";
import SVGIcon from "@/components/common/SVGIcon.vue";
import { ElButton } from 'element-plus'
import { useLayoutStore } from "@/store/layout";
import { useThemeStore } from "@/store/theme";

const mode = import.meta.env.MODE

interface Props {
  modelValue: boolean
  teleportTo?: string | HTMLElement | null
  showToolbar?: boolean
  confirmText?: string
  confirmButtonProps?: Record<string, any>
  cancelText?: string
  cancelButtonProps?: Record<string, any>
}

interface Emits {
  (e: 'update:modelValue', v: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  showToolbar: false,
  confirmText: '确定',
  cancelText: '取消',
})
const emits = defineEmits<Emits>()


const layoutStore = useLayoutStore()
const zIndex = layoutStore.incrementZIndex()

const rootStyle = computed(() => {
  const width = layoutStore.mainWidth
  const height = layoutStore.mainHeight
  if (!props.teleportTo) {
    return {
      width,
      height,
      'z-index': zIndex,
    }
  }
  return {
    width: '100%',
    height: '100%',
    'z-index': zIndex,
  }
})

const toElem = computed<string | HTMLElement>(() => {
  const defaultContainer = layoutStore.maskContainerRef!
  if (!props.teleportTo) {
    return defaultContainer
  } else {
    return props.teleportTo
  }
})

const visible = computed({
  get: () => props.modelValue,
  set: v => {
    emits('update:modelValue', v)
  }
})

onDeactivated(() => {
  // 切换时 关闭浮层
  visible.value = false
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.mask-root-window {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.mask-window-wrapper {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: var(--el-main-padding);
  background-color: var(--el-bg-color);
}

.close-mask {
  position: absolute;
  left: -1px;
  top: 0;
  width: 30px;
  height: 30px;
  border-bottom-right-radius: 100%;
  background-color: var(--el-bg-color-overlay);
  cursor: pointer;
  border: 1px solid var(--el-border-color);
}

.close-mask:hover, .close-mask:hover .close-icon {
  background-color: var(--el-bg-color-page);
}

.close-icon {
  position: absolute;
  top: 4px;
  right: 10px;
  width: 16px;
  height: 16px;
}

</style>