<template>
  <div
    class="collapse-content-wrap"
    :class="collapsed ? 'collapsed' : undefined"
  >
    <transition name="el-fade-in-linear">
      <div style="width: 100%; height: 100%;" v-show="!collapsed">
        <slot></slot>
      </div>
    </transition>

    <div class="toggle-button-box" :class="toggleButtonBoxClass" @click="collapsed = !collapsed">
      <div class="toggle-button__left" :style="toggleBarLeftStyle"></div>
      <div class="toggle-button__right" :style="toggleBarRightStyle"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {computed, StyleValue} from "vue"

interface Props {
  modelValue: boolean
  position: 'left' | 'top' | 'bottom' | 'right'
}

interface Emits {
  (e: 'update:modelValue', v: boolean): void
}

const emits = defineEmits<Emits>()
const props = defineProps<Props>()
const collapsed = computed({
  get() {
    return props.modelValue
  },
  set(v) {
    emits('update:modelValue', v)
  },
})

const toggleButtonBoxClass = computed<string>(() => {
  if (props.position === 'top') {
    // 往上折叠
    return 'bottom-top'
  }
  else if (props.position === 'bottom') {
    // 往下折叠
    return 'top-to-bottom'
  }
  else if (props.position === 'left') {
    // 往左折叠
    return 'right-to-left'
  }
  else if (props.position === 'right') {
    // 往右折叠
    return 'left-to-right'
  }
})

const toggleBarLeftStyle = computed<StyleValue>(() => {
  if (props.position === 'top') {
    // 往上折叠
    return {
      backgroundColor: '#bfbfbf',
      position: 'absolute',
      top: '14px',
      width: '38px',
      height: '4px',
      'border-radius': '2px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      'transform': '0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }
  else if (props.position === 'bottom') {
    // 往下折叠
    return {
      backgroundColor: '#bfbfbf',
      position: 'absolute',
      bottom: '14px',
      width: '38px',
      height: '4px',
      'border-radius': '2px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      'transform': '0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }
  else if (props.position === 'left') {
    // 往左折叠
    return {
      backgroundColor: '#bfbfbf',
      position: 'absolute',
      left: '14px',
      width: '4px',
      height: '38px',
      'border-radius': '2px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      'transform': '0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }
  else if (props.position === 'right') {
    // 往右折叠
    return {
      backgroundColor: '#bfbfbf',
      position: 'absolute',
      right: '14px',
      width: '4px',
      height: '38px',
      'border-radius': '2px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      'transform': '0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }
  return {}
})
const toggleBarRightStyle = computed<StyleValue>(() => {
  if (props.position === 'top') {
    // 往上折叠
    return {
      backgroundColor: '#bfbfbf',
      position: 'absolute',
      top: '14px',
      left: '34px',
      width: '38px',
      height: '4px',
      'border-radius': '2px',
      transition: 'all0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      'transform': '0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }
  else if (props.position === 'bottom') {
    // 往下折叠
    return {
      backgroundColor: '#bfbfbf',
      position: 'absolute',
      bottom: '14px',
      left: '34px',
      width: '38px',
      height: '4px',
      'border-radius': '2px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      'transform': '0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }
  else if (props.position === 'left') {
    // 往左折叠
    return {
      backgroundColor: '#bfbfbf',
      position: 'absolute',
      left: '14px',
      top: '34px',
      width: '4px',
      height: '38px',
      'border-radius': '2px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      'transform': '0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }
  else if (props.position === 'right') {
    // 往右折叠
    return {
      backgroundColor: '#bfbfbf',
      position: 'absolute',
      top: '34px',
      right: '14px',
      width: '4px',
      height: '38px',
      'border-radius': '2px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      'transform': '0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }
  return {}
})

</script>
<style scoped>
.collapse-content-wrap {
  position: relative;
  box-sizing: border-box;
}

.toggle-button-box {
  position: absolute;
  cursor: pointer;
  z-index: 999;
}

.toggle-button-box.bottom-to-top {
  left: calc(50% - 36px);
  bottom: -28px;
  width: 72px;
  height: 32px
}

.toggle-button-box.top-to-bottom {
  left: calc(50% - 36px);
  top: -28px;
  width: 72px;
  height: 32px
}

.toggle-button-box.left-to-right {
  top: calc(50% - 36px);
  left: -28px;
  width: 32px;
  height: 72px
}

.toggle-button-box.right-to-left {
  top: calc(50% - 36px);
  right: -28px;
  width: 32px;
  height: 72px
}

/* 从下往上收缩 */

.toggle-button-box.bottom-to-top:hover .toggle-button__left {
  background-color: #999999;
  transform: rotate(-12deg) scale(1.15) translateX(-2px);
}

.collapse-content-wrap.collapsed .toggle-button-box.bottom-to-top:hover .toggle-button__left {
  background-color: #999999;
  transform: rotate(12deg) scale(1.15) translateX(-2px);
}

.toggle-button-box.bottom-to-top:hover .toggle-button__right {
  background-color: #999999;
  transform: rotate(12deg) scale(1.15) translateX(2px);
}

.collapse-content-wrap.collapsed .toggle-button-box.bottom-to-top:hover .toggle-button__right {
  background-color: #999999;
  transform: rotate(-12deg) scale(1.15) translateX(2px);
}

/* 从上往下收缩 */

.toggle-button-box.top-to-bottom:hover .toggle-button__left {
  background-color: #999999;
  transform: rotate(12deg) scale(1.15) translateX(-2px);
}

.collapse-content-wrap.collapsed .toggle-button-box.top-to-bottom:hover .toggle-button__left {
  background-color: #999999;
  transform: rotate(-12deg) scale(1.15) translateX(-2px);
}

.toggle-button-box.top-to-bottom:hover .toggle-button__right {
  background-color: #999999;
  transform: rotate(-12deg) scale(1.15) translateX(2px);
}

.collapse-content-wrap.collapsed .toggle-button-box.top-to-bottom:hover .toggle-button__right {
  background-color: #999999;
  transform: rotate(12deg) scale(1.15) translateX(2px);
}

/* 从右往左收缩 */

.toggle-button-box.right-to-left:hover .toggle-button__left {
  background-color: #999999;
  transform: rotate(12deg) scale(1.15) translateY(-2px);
}

.collapse-content-wrap.collapsed .toggle-button-box.right-to-left:hover .toggle-button__left {
  background-color: #999999;
  transform: rotate(-12deg) scale(1.15) translateY(-2px);
}

.toggle-button-box.right-to-left:hover .toggle-button__right {
  background-color: #999999;
  transform: rotate(-12deg) scale(1.15) translateY(2px);
}

.collapse-content-wrap.collapsed .toggle-button-box.right-to-left:hover .toggle-button__right {
  background-color: #999999;
  transform: rotate(12deg) scale(1.15) translateY(2px);
}


/* 从左往右收缩 */

.toggle-button-box.left-to-right:hover .toggle-button__left {
  background-color: #999999;
  transform: rotate(-12deg) scale(1.15) translateY(-2px);
}

.collapse-content-wrap.collapsed .toggle-button-box.left-to-right:hover .toggle-button__left {
  background-color: #999999;
  transform: rotate(12deg) scale(1.15) translateY(-2px);
}

.toggle-button-box.left-to-right:hover .toggle-button__right {
  background-color: #999999;
  transform: rotate(12deg) scale(1.15) translateY(2px);
}

.collapse-content-wrap.collapsed .toggle-button-box.left-to-right:hover .toggle-button__right {
  background-color: #999999;
  transform: rotate(-12deg) scale(1.15) translateY(2px);
}

</style>