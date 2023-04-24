<template>
  <el-tabs type="border-card" class="modeling-tabs" style="height: 100%">
    <el-tab-pane label="基本信息">
      <EntityUpdatePanel @close="emits('close')" />
    </el-tab-pane>
    <el-tab-pane label="字段">
      <FieldPanel/>
      <div id="field-container"></div>
    </el-tab-pane>
    <el-tab-pane label="列表视图">
      <ModelingViewConfig module="ENTITY" :mkey="entityRow.mkey" />
      <div id="modeling-view-config"></div>
    </el-tab-pane>
    <el-tab-pane label="数据源">
      <OptionPanel :mkey="entityRow.mkey" scope="ENTITY_PRIVATE" />
      <div id="option-container"></div>
    </el-tab-pane>
    <el-tab-pane label="实例页面">
      <EntityPageConfig module="ENTITY" :mkey="entityRow.mkey" />
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
import EntityPageConfig from "@/views/modeling/entity/config/EntityPageConfig.vue";
import {useFieldStore} from "@/store/field-config";

interface Emits {
  (e: 'close'): void
}

const emits = defineEmits<Emits>()


const entityRow = inject(modelingEntityKey)

const store = useFieldStore()

</script>

<style scoped>
.el-tabs.modeling-tabs>:deep(.el-tabs__content) {
  /* header = 39px; padding = 15 * 2 = 30px */
  height: calc(100% - 69px);
}

:deep(.el-tab-pane) {
  height: 100%;
}

</style>