<template>
  <div class="tag-item" @click="emits('clickTag')">
    <div>
      <slot name="icon"></slot>
      <slot name="text"></slot>
    </div>
    <div class="close-icon" v-if="props.closeable" @click.stop="emits('closeTag')">
      <Close/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Close } from "@element-plus/icons-vue";
import { computed, inject, Ref } from "vue";
import { useThemeStore } from "@/store/theme";



interface Props {
  closeable?: boolean
}

interface Emits {
  (e: 'closeTag'): void
  (e: 'clickTag'): void
}

const props = withDefaults(defineProps<Props>(), {
  closeable: false
})

const emits = defineEmits<Emits>()
const themeStore = useThemeStore()
const tagItemHeight = computed(() => `${themeStore.tagBarHeight - 1}px`)


</script>

<style scoped>
* {
  box-sizing: border-box;
}

.close-icon {
  box-sizing: border-box;
  display: flex;
  margin-left: 3px;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  padding: 2px;
}



.tag-item:hover .close-icon:hover {
  background-color: var(--tag-item-text-color);
  color: var(--tag-item-bg-color);
}

.tag-item.active .close-icon:hover {
  background-color: var(--tag-item-active-text-color);
  color: var(--tag-item-bg-color);
}

.tag-item:focus-visible {
  outline: none;
}

.tag-item {
  position: relative;
  display: flex;
  align-items: center;
  padding: 6px 14px;
  height: v-bind(tagItemHeight);
  max-height: v-bind(tagItemHeight);
  font-size: 12px;
  background-color: var(--tag-item-bg-color);
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  cursor: pointer;
  user-select: none;
  z-index: 2;
}


.tag-item:hover{
  background-color: var(--tag-item-bg-hover-color);
  z-index: 3;
}

.tag-item.active {
  color: var(--tag-item-active-text-color);
  background-color: var(--tag-item-bg-active-color);
  z-index: 4;
}



.tag-item:hover::before,
.tag-item.active::before {
  left: -100%;
  border-radius: 0 0 10px 0;
  opacity: 1;
}

.tag-item:hover::after,
.tag-item.active::after {
  right: -100%;
  border-radius: 0 0 0 10px;
  opacity: 1;
}

.tag-item.active::before,
.tag-item.active:hover::before
{
  box-shadow: 14px 0.25em 0 -3px var(--tag-item-bg-active-color);
}

.tag-item.active::after,
.tag-item.active:hover::after
{
  box-shadow: -14px 0.25em 0 -3px var(--tag-item-bg-active-color);
}

.tag-item:hover::before {
  box-shadow: 14px 0.25em 0 -3px var(--tag-item-bg-hover-color);
}

.tag-item:hover::after {
  box-shadow: -14px 0.25em 0 -3px var(--tag-item-bg-hover-color);
}


.tag-item::before,
.tag-item::after {
  visibility: visible;
  content: " ";
  pointer-events: none;
  position: absolute;
  display: block;
  height: 80%;
  width: 100%;
  bottom: 0;
  z-index: -1;
}

.tag-item:not(:hover, .active) {
  box-shadow: -8px 0 0 -7px var(--tag-item-gap-color);
}

</style>
