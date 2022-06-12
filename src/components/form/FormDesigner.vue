<template>
  <div class="container">
    <div class="component-list">
      <draggable
        style="width: 100%; height: 100%"
        :list="componentList"
        :group="{ name: 'component', pull: 'clone', put: false}"
        handle="div.component-item"
        item-key="id"
        :sort="false"
        :clone="transCloneComponent"
      >
        <template #item="{element}">
          <div class="component-item">{{ element.name }}</div>
        </template>
      </draggable>
    </div>
    <div class="form-wrapper">
      <draggable
        style="width: 100%; height: 100%"
        :list="formComponentList"
        :group="{name: 'component', pull: false, put: true }"
        handle="div.drag-form-item"
        item-key="id"
      >
        <template #item="{element}">
          <div class="drag-form-item">{{ element.name }}</div>
        </template>
      </draggable>
    </div>
    <div class="property-panel"></div>
  </div>
</template>

<script lang="ts" setup>
import {computed, inject, ref} from "vue";
import {mainHeightKey, mainWidthKey, themeKey} from "@/config/app.keys";
import Draggable from "vuedraggable"
import { ElButton } from "element-plus"

interface ComponentInfo {
  id: number
  name: string
}

const mainWidth = inject(mainWidthKey)
const mainHeight = inject(mainHeightKey)
const theme = inject(themeKey)
const containerWidth = computed<string>(() => `calc(${mainWidth.value} - ${theme.value.mainPadding * 2}px)`)
const containerHeight = computed<string>(() => `calc(${mainHeight.value} - ${theme.value.mainPadding * 2}px)`)

const componentList = ref<ComponentInfo[]>([
  {
    id: 1,
    name: '按钮'
  },
  {
    id: 2,
    name: '输入框'
  },
])

const formComponentList = ref<ComponentInfo[]>([
  {
    id: 3,
    name: '按钮4'
  },
  {
    id: 4,
    name: '输入框3'
  },
])

function transCloneComponent(original) {
  console.log('original',original)
  return original;
}

</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: v-bind(containerWidth);
  height: v-bind(containerHeight);
}

.component-list {
  width: 300px;
  height: 100%;
  background-color: #FFFFFF;
}

.form-wrapper {
  flex: 1;
  height: 100%;

}

.property-panel {
  width: 300px;
  height: 100%;
  background-color: #FFFFFF;
}


</style>