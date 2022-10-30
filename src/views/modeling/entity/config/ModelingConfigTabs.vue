<template>
  <el-tabs type="border-card" style="height: 100%">
    <el-tab-pane label="基本信息">
      <EntityUpdatePanel @close="emits('close')" />
    </el-tab-pane>
    <el-tab-pane label="字段">
      <FieldPanel scope="ENTITY_PRIVATE" module="ENTITY" :mkey="entityRow.mkey" />
      <div id="field-container"></div>
    </el-tab-pane>
    <el-tab-pane label="视图配置">
      <ModelingViewConfig module="ENTITY" :mkey="entityRow.mkey" />
      <div id="entity-view-config"></div>
    </el-tab-pane>
    <el-tab-pane label="数据源">
      <OptionPanel :mkey="entityRow.mkey" scope="ENTITY_PRIVATE" />
    </el-tab-pane>
  </el-tabs>

</template>

<script lang="ts" setup>
import { ElTabs, ElTabPane } from "element-plus";
import EntityUpdatePanel from "@/views/modeling/entity/config/EntityUpdatePanel.vue";
import FieldPanel from "@/views/modeling/field/FieldPanel.vue";
import OptionPanel from "@/views/modeling/option/OptionPanel.vue";
import { inject } from "vue";
import { modelingEntityKey } from "../../keys";
import ModelingViewConfig from "@/views/modeling/view/ModelingViewConfig.vue";

interface Emits {
  (e: 'close'): void
}

const emits = defineEmits<Emits>()


const entityRow = inject(modelingEntityKey)

</script>

<style scoped>
:deep(.el-tabs__content) {
  /* header = 39px; padding = 15 * 2 = 30px */
  height: calc(100% - 69px);
}

:deep(.el-tab-pane) {
  height: 100%;
}

</style>