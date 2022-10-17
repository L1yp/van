<template>
  <el-scrollbar :height="collapseScrollHeight" always>
    <el-collapse v-model="openedItems">
      <el-collapse-item name="layout" title="布局">
        <draggable
          style="width: 100%; height: 100%;"
          :list="props.layoutComponents"
          :group="{ name: 'component', pull: 'clone', put: false}"
          handle="div.component-item"
          item-key="id"
          :sort="false"
          :clone="transCloneComponent"
        >
          <template #item="{ element }">
            <div class="component-item">
              <div style="display: flex; justify-content: flex-start; padding: 3px">
                <div  style="display: flex; align-items: center; " v-if="element.icon">
                  <s-v-g-icon :name="element.icon" style="width: 16px; height: 16px"></s-v-g-icon>
                </div>
                <div style="font-size: 16px" v-text="element.title"></div>
              </div>
            </div>
          </template>
        </draggable>
      </el-collapse-item>
      <el-collapse-item name="input" title="输入">
        <draggable
          style="width: 100%; height: 100%;"
          class="component-list"
          :list="props.inputComponents"
          :group="{ name: 'component', pull: 'clone', put: false}"
          handle="div.component-item"
          item-key="id"
          :sort="false"
          :clone="transCloneComponent"
        >
          <template #item="{ element }">
            <div class="component-item">
              <div style="display: flex; justify-content: flex-start; padding: 3px">
                <div  style="display: flex; align-items: center; " v-if="element.icon">
                  <s-v-g-icon :name="element.icon" style="width: 16px; height: 16px"></s-v-g-icon>
                </div>
                <div style="font-size: 16px" v-text="element.title"></div>
              </div>
            </div>
          </template>
        </draggable>
      </el-collapse-item>
      <el-collapse-item name="output" title="输出">
        <draggable
          style="width: 100%; height: 100%;"
          :list="props.outputComponents"
          :group="{ name: 'component', pull: 'clone', put: false}"
          handle="div.component-item"
          item-key="id"
          :sort="false"
          :clone="transCloneComponent"
        >
          <template #item="{ element }">
            <div class="component-item">
              <span>
                <span v-text="element.title"></span>
                <span v-if="element.icon">
                  <s-v-g-icon :name="element.icon" style="width: 1em; height: 1em"></s-v-g-icon>
                </span>
              </span>
            </div>
          </template>
        </draggable>
      </el-collapse-item>

    </el-collapse>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import { ElScrollbar, ElCollapse, ElCollapseItem } from 'element-plus'
import Draggable from "vuedraggable";
import { CandidateComponentConfig } from "@/components/form/types";
import { genId, transCloneComponent } from "../util/common"
import SVGIcon from "@/components/common/SVGIcon.vue";
import {computed, inject, ref} from "vue";
import {vFormActiveElementKey} from "@/config/app.keys";

interface Props {
  height: string
  inputComponents: CandidateComponentConfig[]
  outputComponents: CandidateComponentConfig[]
  layoutComponents: CandidateComponentConfig[]
}

const props = defineProps<Props>()
const collapseScrollHeight = computed<string>(() => `calc(${props.height} - 15px)`)

const openedItems = ref<string[]>(['input', 'output', 'layout'])

const vFormSelectedItem = inject(vFormActiveElementKey)

function handleCloneHook(original: CandidateComponentConfig) {
  const newItem = transCloneComponent(original)
  vFormSelectedItem.value = newItem
  return newItem
}

</script>

<style scoped>
.component-list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.component-item {
  width: 135px;
  background-color: #f6f8f9;
  cursor: move;
  border-radius: 8px;
}

.component-item:hover {
  outline: 1px solid #409eff;
}

:deep(.el-collapse-item__content) {
  padding: 10px;
}
</style>