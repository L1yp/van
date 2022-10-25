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

    </el-collapse>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import { ElScrollbar, ElCollapse, ElCollapseItem } from 'element-plus'
import Draggable from "vuedraggable";
import { transCloneComponent } from "../util/common"
import SVGIcon from "@/components/common/SVGIcon.vue";
import {computed, inject, ref} from "vue";
import {vFormActiveElementKey} from "@/components/form/state.key";

interface Props {
  height: string
  inputComponents: CandidateComponentConfig[]
  layoutComponents: CandidateComponentConfig[]
}

const props = defineProps<Props>()
const collapseScrollHeight = computed<string>(() => `calc(${props.height} - 15px)`)

const openedItems = ref<string[]>(['input', 'output', 'layout'])

const vFormSelectedItem = inject(vFormActiveElementKey)

</script>

<style scoped>
.component-list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.component-item {
  width: 119px;
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