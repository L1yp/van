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
          :clone="dragFieldToDesigner"
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
          :clone="dragFieldToDesigner"
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
          :clone="dragFieldToDesigner"
        >
          <template #item="{ element }">
            <div class="component-item">
              <div style="display: flex; justify-content: flex-start; padding: 3px">
                <div style="display: flex; justify-content: flex-start; padding: 3px">
                  <div style="font-size: 16px" v-text="element.label"></div>
                </div>
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

function dragFieldToDesigner(field: ModelingFieldDefView): ComponentConfig {
  console.log('field', field);
  const item: ComponentConfig = {
    id: field.field,
    component: '',
    category: 'form-item',
    formItemAttrs: {},
    attrs: {},
    key: 1,
    ...toComponentConfig(field)
  }
  return item
}

function toComponentConfig(field: ModelingFieldDefView): Partial<ComponentConfig> {
  const scheme = field.scheme
  const config: Partial<ComponentConfig> = { formItemAttrs: {}, attrs: {} }
  config.formItemAttrs.label = field.label
  config.attrs.style = `width: 100%`
  if (scheme.type === 'date') {
    config.component = 'date-picker'
    config.attrs.dateType = scheme.dateType
    config.attrs.format = scheme.format
    config.attrs.valueFormat = scheme.valueFormat
  }
  else if (scheme.type === 'daterange') {
    config.component = 'date-range-picker'
    config.attrs.dateRangeType = scheme.dateRangeType
    config.attrs.format = scheme.format
    config.attrs.valueFormat = scheme.valueFormat
  }
  else if (scheme.type === 'dept') {
    config.component = 'dept-select'
    config.attrs.multiple = scheme.multiple
  }
  else if (scheme.type === 'user') {
    config.component = 'user-select'
    config.attrs.multiple = scheme.multiple
  }
  else if (scheme.type === 'text') {
    config.component = 'text-input'
    config.attrs.defaultValue = scheme.defaultValue
  }
  else if (scheme.type === 'number') {
    config.component = 'number-input'
    config.attrs.defaultValue = scheme.defaultValue
    config.attrs.min = scheme.min
    config.attrs.max = scheme.max
    config.attrs.formatter = scheme.formatter
    config.attrs.parser = scheme.parser
  }
  else if (scheme.type === 'option') {
    if (scheme.multiple) {
      config.component = 'multi-select'
      config.attrs.options = []
      if (scheme.optionComponent === 'checkbox') {
          config.attrs.expand = true
          config.attrs.buttonOption = false
      } else if (scheme.optionComponent === 'checkbox-button') {
        config.attrs.expand = true
        config.attrs.buttonOption = true
      } else {
        config.attrs.expand = false
        config.attrs.buttonOption = false
      }
      config.attrs.optionTypeId = scheme.optionTypeId
      config.attrs.defaultValue = scheme.optionDefaultValue
      config.attrs.fitInputWidth = true
      config.attrs.clearable = true
      config.attrs.filterable = true
    } else {
      config.component = 'single-select'
      config.attrs.options = []
      if (scheme.optionComponent) {
        if (scheme.optionComponent === 'radio') {
          config.attrs.expand = true
          config.attrs.buttonOption = false
        } else if (scheme.optionComponent === 'radio-button') {
          config.attrs.expand = true
          config.attrs.buttonOption = true
        } else {
          config.attrs.expand = false
          config.attrs.buttonOption = false
        }
      }
      config.attrs.optionTypeId = scheme.optionTypeId
      config.attrs.defaultValue = scheme.optionDefaultValue?.[0]
      config.attrs.fitInputWidth = true
      config.attrs.clearable = true
      config.attrs.filterable = true
    }

  }
  return config
}

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
}

.component-item:hover {
  outline: 1px solid var(--el-border-color);
}

:deep(.el-collapse-item__content) {
  padding: 10px;
}
</style>