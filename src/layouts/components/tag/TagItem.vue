<template>
  <div class="tag" @click="emits('clickTag')">
    <div>
      <slot name="icon"></slot>
      <slot name="text"></slot>
    </div>
    <div v-if="props.close" class="close-tag" @click.stop="emits('closeTag')">
      <SVGIcon name="close"></SVGIcon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SVGIcon from "@/components/common/SVGIcon.vue"

interface Props {
  close?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  close: true
})

interface Emits {
  (e: 'clickTag'): void
  (e: 'closeTag'): void
}

const emits = defineEmits<Emits>();
</script>

<style scoped>
div.tag:not(:first-child) {
  margin-left: -12px;
}
div.tag {
  box-sizing: border-box;
  background-color: var(--el-bg-color);
  border-top: none;
  margin-left: 0;
  height: 29px;
  max-height: 29px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  cursor: pointer;
  border-radius: 4px;
  white-space: nowrap;
  overflow: hidden;
  padding: 0 15px 0 15px;
  font-size: 0.8em;
  user-select: none;
  min-width: max-content;
}

div.tag:hover {
  /* color: #515A6E; */
  -webkit-mask: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANoAAAAkBAMAAAAdqzmBAAAAMFBMVEVHcEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlTPQ5AAAAD3RSTlMAr3DvEM8wgCBA379gj5//tJBPAAAAnUlEQVRIx2NgAAM27fj/tAO/xBsYkIHyf9qCT8iWMf6nNQhAsk2f5rYheY7Dnua2/U+A28ZEe8v+F9Ax2v7/F4DbxkUH2wzgtvHTwbYPo7aN2jZq26hto7aN2jZq25Cy7Qvctnw62PYNbls9HWz7S8/G6//PsI6H4396gAUQy1je08W2jxDbpv6nD4gB2uWp+J9eYPsEhv/0BPS1DQBvoBLVZ3BppgAAAABJRU5ErkJggg==);
  -webkit-mask-size: 100% 100%;
  background-color: var(--tag-item-bg-hover-color);
}


div.tag.active {
  color: #1890ff;
  -webkit-mask: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANoAAAAkBAMAAAAdqzmBAAAAMFBMVEVHcEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlTPQ5AAAAD3RSTlMAr3DvEM8wgCBA379gj5//tJBPAAAAnUlEQVRIx2NgAAM27fj/tAO/xBsYkIHyf9qCT8iWMf6nNQhAsk2f5rYheY7Dnua2/U+A28ZEe8v+F9Ax2v7/F4DbxkUH2wzgtvHTwbYPo7aN2jZq26hto7aN2jZq25Cy7Qvctnw62PYNbls9HWz7S8/G6//PsI6H4396gAUQy1je08W2jxDbpv6nD4gB2uWp+J9eYPsEhv/0BPS1DQBvoBLVZ3BppgAAAABJRU5ErkJggg==);
  -webkit-mask-size: 100% 100%;
  background-color: var(--tag-item-bg-active-color);
}

div.tag div.close-tag svg {
  width: 0;
  height: 18px;
  margin-left: 5px;
  border-radius: 50%;
  /* background-color: #dee1e6; */
  vertical-align: middle;
  /* transition: all .3s ease-in-out; */
}

div.tag.active div.close-tag svg {
  width: 18px;
  /* background-color: #e8f4ff; */
}

div.tag:hover div.close-tag svg {
  width: 18px;
}

div.tag div.close-tag:hover svg {
  color: var(--el-text-color-primary);
} 

div.tag:hover div.close-tag svg:hover {
  background-color: #c0c4cc;
  color: #f7f8f9;
}

div.tag.active:hover div.close-tag svg:hover {
  background-color: #409eff;
  color: #f7f8f9;
}

div.tag div.close-tag:hover svg {
  background-color: #c0c4cc;
  color: #f7f8f9;
}

div.tag.active div.close-tag:hover svg {
  background-color: #409eff;
  color: #f7f8f9;
}

div.tag div.close-tag {
  box-sizing: border-box;
}


</style>
