<template>
  <el-scrollbar always>
    <el-collapse v-model="collapseNames">
      <el-collapse-item name="default" title="默认字段">
        <draggable
          style="width: 100%; height: 100%;"
          class="component-list"
          v-model="defaultFields"
          :group="{ name: 'component', pull: true, put: false}"
          handle="div.component-item"
          item-key="id"
          :sort="false"
          :clone="modelingFieldToComponent"
        >
          <template #item="{ element }">
            <div class="component-item">
              <div style="display: flex; justify-content: flex-start; padding: 3px">
                <div style="font-size: 16px" v-text="element.label"></div>
              </div>
            </div>
          </template>
        </draggable>
      </el-collapse-item>
      <el-collapse-item name="private" title="私有字段">
        <draggable
          style="width: 100%; height: 100%;"
          class="component-list"
          :list="privateFields"
          :group="{ name: 'component', pull: true, put: false}"
          handle="div.component-item"
          item-key="id"
          :sort="false"
          :clone="modelingFieldToComponent"
        >
          <template #item="{ element }">
            <div class="component-item">
              <div style="display: flex; justify-content: flex-start; padding: 3px">
                <div style="font-size: 16px" v-text="element.label"></div>
              </div>
            </div>
          </template>
        </draggable>
      </el-collapse-item>
      <el-collapse-item name="global" title="引用字段">
        <draggable
          style="width: 100%; height: 100%;"
          class="component-list"
          :list="globalFields"
          :group="{ name: 'component', pull: true, put: false}"
          handle="div.component-item"
          item-key="id"
          :sort="false"
          :clone="modelingFieldToComponent"
        >
          <template #item="{ element }">
            <div class="component-item">
              <div style="display: flex; justify-content: flex-start; padding: 3px">
                <div style="font-size: 16px" v-text="element.label"></div>
              </div>
            </div>
          </template>
        </draggable>
      </el-collapse-item>
    </el-collapse>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import { useModelingFieldApi } from "@/service/modeling/field";
import {onBeforeMount, onUnmounted, ref} from "vue";
import { ElScrollbar, ElCollapse, ElCollapseItem } from "element-plus";
import Draggable from "vuedraggable";
import emitter, {FormDesignerFieldDeleteEvent} from "@/event/mitt";
import { modelingFieldToComponent } from "@/components/form/designer/candidate/index";

interface Props {
  module: ModelingModule
  mkey: string
}

const props = defineProps<Props>()

const collapseNames = ref(['default', 'private', 'global'])

const loading = ref(false)
const { modelingFields, findModelingFields } = useModelingFieldApi(loading)

const defaultFields = ref<ModelingFieldDefView[]>([])
const privateFields = ref<ModelingFieldDefView[]>([])
const globalFields = ref<ModelingFieldDefView[]>([])

function removeFieldInDesignerHandler(v: FormDesignerFieldDeleteEvent) {
  const field = modelingFields.value.find(it => it.field === v.field)
  if (!field) {
    return
  }
  if (field.scope === 'GLOBAL') {
    globalFields.value.push(field)
  } else if (field.scope.endsWith('_DEFAULT')) {
    defaultFields.value.push(field)
  } else if (field.scope.endsWith('_PRIVATE')) {
    privateFields.value.push(field)
  }
}

emitter.on('removeFieldInDesigner', removeFieldInDesignerHandler)

onUnmounted(() => emitter.off('removeFieldInDesigner', removeFieldInDesignerHandler))

onBeforeMount(async () => {
  await findModelingFields(props.module, props.mkey)
  defaultFields.value = modelingFields.value.filter(it => it.scope === `${props.module}_DEFAULT`) || []
  privateFields.value = modelingFields.value.filter(it => it.scope === `${props.module}_PRIVATE`) || []
  globalFields.value = modelingFields.value.filter(it => it.scope === `GLOBAL`) || []
})

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
  border-radius: 4px;
  outline: 1px solid #8db2b4;
}

.component-item:hover {
  outline: 2px solid #8db2b4;
}

:deep(.el-collapse-item__content) {
  padding: 10px;
}
</style>