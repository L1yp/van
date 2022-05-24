<template>
  <div class="form-container">
    <el-row v-for="(row, idx) in rowFields" :key="idx" :gutter="10">
      <el-col v-for="col in row" :span="col.span">
        <el-form-item :label="col.field.label" label-width="120px">
          <template v-if="getComponent(col, props.processInfo)">
            <component
              :is="getComponent(col, props.processInfo).name"
              v-bind="getComponent(col, props.processInfo).attrs"
            >
            </component>
          </template>
          <template v-else>
            <div v-text="getFieldValue(props.processInfo, col)"></div>
          </template>
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
import {ElRow, ElCol, ElInput, ElSelect, ElFormItem } from "element-plus"
import {computed, defineComponent, PropType, watch} from "vue"
import DictTag from "@/components/dict/DictTag.vue";
import DictInput from "@/components/dict/DictInput.vue";
import UserSelectorInput from "@/components/common/selector/user/UserSelectorInput.vue"

interface ComponentInfo {
  name: string
  attrs?: Record<string, any>
}

function getComponent(scheme: PageFieldScheme, processInfo: ProcessInstanceInfoView): ComponentInfo {
  const componentType = scheme.field.component_type
  const writeable = scheme.writeable
  scheme.value = processInfo[scheme.field.name]
  if (componentType === 1) {
    return writeable === 1 ? {name: 'el-input'} : null;
  }
  else if (componentType === 2) {
    return writeable === 1 ? {name: 'el-input', attrs: {type: 'textarea'}} : null;
  }
  else if (componentType === 3) {
    const val = scheme.value as DictValue
    if (writeable === 1) {
      return {
        name: 'dict-input',
        attrs: {
          multiple: false,
          scope: val.scope,
          ident: val.ident,
          modelValue: val.val,
          'onUpdate:modelValue': v => val.val = v
        },
      }
    } else {
      return {
        name: 'dict-tag',
        attrs: {
          scope: val.scope,
          ident: val.ident,
          val: val.val
        },
      }
    }

  }
  else if (componentType === 4) {
    const val = scheme.value as DictValue
    if (writeable === 1) {
      return {
        name: 'dict-input',
        attrs: {
          multiple: true,
          scope: val.scope,
          ident: val.ident,
          modelValue: val.val,
          'onUpdate:modelValue': v => val.val = v
        }
      }
    } else {
      return {
        name: 'dict-tag',
        attrs: {
          scope: val.scope,
          ident: val.ident,
          val: val.val
        }
      }
    }
  }
  else if (componentType === 5) {
    return writeable === 1 ? {name: 'el-input-number'} : null;
  }
  else if (componentType === 6) {
    return writeable === 1 ?
      {
        name: 'user-selector-input',
        attrs: {
          multiple: false,
          modelValue: scheme.value,
          'onUpdate:modelValue': (v: UserView) => {
            scheme.value.avatar = v.avatar
            scheme.value.email = v.email
            scheme.value.id = v.id
            scheme.value.label = v.label
            scheme.value.nickname = v.nickname
            scheme.value.phone = v.phone
            scheme.value.status = v.status
            scheme.value.username = v.username

            // FIXME: reactive 覆盖性赋值 无法修改
            console.log('update model-value attrs', scheme, v)
          }
        }
      } : null;
  } else if (componentType === 7) {
    return writeable === 1 ?
      {
        name: 'user-selector-input',
        attrs: {
          multiple: true,
          modelValue: scheme.value,
          'onUpdate:modelValue': v => scheme.value = v
        }
      } : null;
  }
  return null
}

function getFieldValue(processInfo: ProcessInstanceInfoView, scheme: PageFieldScheme) {
  const data = processInfo
  if (!data) return ""
  if ([1,2,5].includes(scheme.field.component_type)) {
    return data[scheme.field.name];
  } else if (scheme.field.component_type === 3) {
    const val = data[scheme.field.name] as DictValue
    return val.label
  } else if (scheme.field.component_type === 4) {
    const val = data[scheme.field.name] as DictValue[]
    return val.map(it => it.label).join(", ")
  } else if (scheme.field.component_type === 6) {
    const val = data[scheme.field.name] as UserView
    return val.label
  } else if (scheme.field.component_type === 7) {
    const val = data[scheme.field.name] as UserView[]
    return val.map(it => it.label).join(", ")
  }

  return null
}

export default defineComponent({
  props: {
    processInfo: Object as PropType<ProcessInstanceInfoView>,
    scheme: Array as PropType<PageFieldScheme[]>
  },
  components: {
    ElRow, ElCol, DictTag, DictInput, ElInput, ElSelect, UserSelectorInput, ElFormItem
  },
  setup(props, {}){
    const rowFields = computed<PageFieldScheme[][]>(() => {
      let spans = 0
      let container = []
      const rows = []
      for (let elem of props.scheme) {
        if (spans + elem.span > 24) {
          rows.push(container)
          container = []
          spans = 0
        }
        container.push(elem)
        spans = spans + elem.span
      }

      if (container && container.length > 0) {
        rows.push(container)
      }
      return rows
    })

    return {
      props, rowFields, getComponent, getFieldValue
    }
  },
})
</script>

<style scoped>
.form-container {
  background-color: #FFFFFF;
}

.el-col {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 10px;
}

:deep(.el-form-item__label) {
  border-top: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-form-item__content) {
  border-top: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
}

</style>