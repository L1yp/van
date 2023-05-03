<template>
  <el-scrollbar always>
    <el-collapse v-model="openedItems">
      <el-collapse-item name="layout" title="布局">
        <draggable
          style="width: 100%; height: 100%;"
          class="component-list"
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
      <el-collapse-item name="display" title="展示">
        <draggable
          style="width: 100%; height: 100%;"
          class="component-list"
          :list="props.displayComponents"
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
import { ref } from "vue";

interface Props {
  displayComponents: CandidateComponentConfig[]
  inputComponents: CandidateComponentConfig[]
  layoutComponents: CandidateComponentConfig[]
}

const props = defineProps<Props>()
const openedItems = ref<string[]>(['input', 'output', 'layout'])

</script>

<style scoped>
.component-list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.component-item {
  width: 119px;
  background-color: var(--el-bg-color);
  cursor: move;
  border-radius: 8px;
  outline: 1px solid #8db2b4;
}

.component-item:hover {
  outline: 2px solid #8db2b4;
}

:deep(.el-collapse-item__content) {
  padding: 10px;
}
</style>