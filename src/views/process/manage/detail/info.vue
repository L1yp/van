<template>
  <div class="container">
    <el-tabs v-model="activeName" @tab-change="handleTabChange" style="background-color: #FFFFFF">
      <el-tab-pane label="基本信息" name="basic">
        <div style="width: 851px; ">
          <el-scrollbar always>
            <div style="display: flex">
              <el-button @click="router.go(-1)">返回</el-button>
              <el-button v-for="outcome in processInfo?.outcomes" v-text="outcome.name" @click="handleComplete(outcome)"></el-button>
            </div>
          </el-scrollbar>
          <v-form-pro
            :form-attr="{labelWidth: processInfo?.page_info?.process_model_node_page.label_width}"
            :scheme="scheme"
            v-model="pageModel"
          ></v-form-pro>
        </div>

      </el-tab-pane>
      <el-tab-pane label="流程视图" name="diagram">
        <ProcessDiagramViewer ref="diagramViewer"></ProcessDiagramViewer>
      </el-tab-pane>
      <el-tab-pane label="附件列表" name="attachment">

      </el-tab-pane>
    </el-tabs>
  </div>

  <v-dialog
    v-model="completeVisible"
    :title="outcome?.name"
    :width="outcome?.page?.process_model_node_page?.page_width"
    draggable
    @confirm="handleConfirmComplete"
    @cancel="completeVisible = false"
  >
    <v-form-pro
      :form-attr="{ labelWidth: outcome?.page?.process_model_node_page?.label_width }"
      :scheme="completeScheme"
      v-model="completePageModel">
    </v-form-pro>
  </v-dialog>

</template>

<script lang="ts" setup>
import {useRoute, useRouter} from "vue-router"
import {computed, inject, onBeforeMount, onMounted, provide, reactive, Ref, ref, toRaw, unref, watch,} from "vue"
import {asideWidthKey, mainHeightKey, processInstanceDetailInfoKey, themeKey, userInfoKey } from "@/config/app.keys";
import {ElTabs, ElTabPane, ElButton, ElScrollbar, ElMessage} from "element-plus"
import * as ProcessApi from "@/api/sys/process"
import { getDeviceType } from "@/utils/common";
import ProcessDiagramViewer from "@/views/process/manage/detail/diagram.vue";
import VDialog from "@/components/dialog/VDialog.vue";
import VFormPro from "@/components/form/VFormPro.vue";
import {FormScheme} from "@/components/form/types";

const route = useRoute()
const router = useRouter()
const key = route.query.key as string
const id = route.query.id as string

const device = getDeviceType()
console.log(device, "device")
const mainHeight = inject(mainHeightKey);
const theme = inject(themeKey);
const containerHeight = computed(() => {
  return `calc(${mainHeight.value} - ${theme.value.mainPadding * 2}px)`
})

const activeName = ref<string>("basic")

const diagramViewer = ref<InstanceType<typeof ProcessDiagramViewer>>()
function handleTabChange(name: string) {
  if (name === 'diagram') {
    diagramViewer.value.initViewer()
  }
}

onBeforeMount(async () => {
  await loadData()
})

const processInfo = ref<ProcessInstanceInfoView>()
provide(processInstanceDetailInfoKey, processInfo)

async function loadData() {
  try {
    const data = await ProcessApi.processInstanceInfoByProcessKeyAndId(key, parseInt(id))
    data.outcomes.sort((a, b) => a.order - b.order)
    processInfo.value = data
  } catch (e) {
    console.error(e)
  }
}


const completeVisible = ref<boolean>(false) // 表单对话框
const completeFormScheme = ref<PageFieldScheme[]>()
const completePageModel = ref<Record<string, any>>({

})
const outcome = ref<ProcessOutcomeView>()
async function handleComplete(item: ProcessOutcomeView) {
  outcome.value = item
  if ((!item?.page || // 没配页面
      !item?.page?.process_model_node_page) && // 没配页面
    (!item.page || item?.page?.process_model_node_page?.comment === 0) // 无需评论
  ) {
    await doComplete()
  } else {
    if (item.page.process_model_node_page) {
      completeFormScheme.value = item.page.process_model_page_scheme_view[device]
      buildFormModel(completeFormScheme.value, completePageModel)
      completeVisible.value = true
    }
  }
}

async function doComplete() {
  // complete
  const param: ProcessTaskCompleteParam = {
    process_key: key,
    process_instance_id: processInfo.value.process_instance_id,
    device,
    outcome: outcome.value.name,
    comment: undefined,
    params: completeVisible.value ? rebuildFormModel(completePageModel) : null
  }
  try {
    await ProcessApi.completeTask(param)
    ElMessage.success(`${outcome.value.name}成功`)
    router.go(0)
  } catch (e) {
    console.error(e)
    ElMessage.error(e?.message || `${outcome.value.name}失败`)
  } finally {
    if (completeVisible.value) {
      completeVisible.value = false
    }
  }
}

function handleConfirmComplete() {
  doComplete()
}

const pageModel = ref<Record<string, any>>({

})

watch(() => processInfo.value, () => {
  if (!processInfo.value) {
    return
  }
  const pageScheme: PageFieldScheme[] = processInfo.value?.page_info?.process_model_page_scheme_view[device]
  buildFormModel(pageScheme, pageModel)
})

function buildFormModel(pageScheme: PageFieldScheme[], formModel: Ref<Record<string, any>>) {
  for (let elem of pageScheme) {
    const name = elem.field.name
    if (elem.writeable === 1) {
      if (elem.field.component_type === 3) {
        if (elem.writeable === 1) {
          formModel.value[name] = (processInfo.value[name] as DictValue)?.id
        } else {
          formModel.value[name] = (processInfo.value[name] as DictValue)
        }
      } else if (elem.field.component_type === 4) {
        if (elem.writeable === 1) {
          formModel.value[name] = (processInfo.value[name] as DictValue[])?.map(it => it.id) as number[]
        } else {
          formModel.value[name] = (processInfo.value[name] as DictValue[])
        }
      } else {
        formModel.value[name] = processInfo.value[name]
      }
    } else {
      formModel.value[name] = processInfo.value[name]
    }

  }
}

const scheme = computed<FormScheme[][]>(() => {
  if (!processInfo.value) {
    return []
  }
  const pageScheme: PageFieldScheme[] = processInfo.value?.page_info?.process_model_page_scheme_view[device]
  let spans = 0
  let container: FormScheme[] = []
  const rows: FormScheme[][] = []
  for (let elem of pageScheme) {
    if (spans + elem.span > 24) {
      rows.push(container)
      container = []
      spans = 0
    }
    const component = getComponent(elem)
    container.push({
      name: elem.field.name,
      label: elem.field.label,
      component: component.name,
      span: elem.span,
      writeable: elem.writeable === 1,
      componentAttrs: component.attrs
    })
    spans = spans + elem.span
  }

  if (container && container.length > 0) {
    rows.push(container)
  }
  return rows
})

const completeScheme = computed<FormScheme[][]>(() => {
  if (!processInfo.value) {
    return []
  }
  const pageScheme: PageFieldScheme[] = completeFormScheme.value
  let spans = 0
  let container: FormScheme[] = []
  const rows: FormScheme[][] = []
  for (let elem of pageScheme) {
    if (spans + elem.span > 24) {
      rows.push(container)
      container = []
      spans = 0
    }
    const component = getComponent(elem)
    container.push({
      name: elem.field.name,
      label: elem.field.label,
      component: component.name,
      span: elem.span,
      writeable: elem.writeable === 1,
      componentAttrs: component.attrs
    })
    spans = spans + elem.span
  }

  if (container && container.length > 0) {
    rows.push(container)
  }
  return rows
})

function rebuildFormModel(formModel: Ref<Record<string, any>>) {
  const data = {}
  Object.assign(data, toRaw(formModel.value))
  const keys = Object.keys(data)
  const fieldMap = new Map<string, number>(processInfo.value.field_definition.map(it => [it.name, it.component_type]))
  for (const key of keys) {
    const componentType = fieldMap.get(key)
    if (componentType === 6) {
      const user = data[key] as UserView
      data[key] = user.id
    } else if (componentType === 7) {
      const users = data[key] as UserView[]
      data[key] = users.map(it => it.id)
    } else if (componentType === 9) {
      const dept = data[key] as DeptView
      data[key] = dept.id
    } else if (componentType === 100) {
      const depts = data[key] as DeptView[]
      data[key] = depts.map(it => it.id)
    } else {
      // TODO: other types
    }
  }

  return data

}

function getComponent(scheme: PageFieldScheme): ComponentInfo {
  const componentType = scheme.field.component_type
  const writeable = scheme.writeable
  const name = scheme.field.name
  if (componentType === 1) {
    return writeable === 1 ? {name: 'el-input'} : {name: 'el-input', attrs: { disabled: true, modelValue: processInfo.value[name] }};
  }
  else if (componentType === 2) {
    return writeable === 1 ? {name: 'el-input', attrs: {type: 'textarea'}} : {name: 'el-input', attrs: {type: 'textarea', disabled: true, modelValue: processInfo.value[name]}};
  }
  else if (componentType === 3) {
    const val = processInfo.value[name] as DictValue
    if (writeable === 1) {
      return {
        name: 'dict-input',
        attrs: {
          multiple: false,
          scope: scheme.field.dict_scope,
          ident: scheme.field.dict_ident,
          valType: 'id'
        },
      }
    }
    else {
      return {
        name: 'dict-tag',
        attrs: {
          multiple: false,
          valType: 'raw',
          val
        },
      }
    }

  }
  else if (componentType === 4) {
    const val = processInfo.value[name] as DictValue[]
    if (writeable === 1) {
      return {
        name: 'dict-input',
        attrs: {
          multiple: true,
          scope: scheme.field.dict_scope,
          ident: scheme.field.dict_ident,
          valType: 'id'
        }
      }
    }
    else {
      return {
        name: 'dict-tag',
        attrs: {
          multiple: true,
          valType: 'raw',
          val
        }
      }
    }
  }
  else if (componentType === 5) {
    return writeable === 1 ? {name: 'el-input-number', attrs: { modelValue: processInfo.value[name] }} : {name: 'el-input', attrs: { disabled: true, modelValue: processInfo.value[name] }};
  }
  else if (componentType === 6) {
    return writeable === 1 ?
      {
        name: 'user-selector-input',
        attrs: {
          multiple: false,
        }
      } : {
        name: 'user-viewer',
        attrs: {
          data: pageModel.value[name]
        }
      };
  } else if (componentType === 7) {
    return writeable === 1 ?
      {
        name: 'user-selector-input',
        attrs: {
          multiple: true,
        }
      }  : {
        name: 'user-viewer',
        attrs: {
          data: pageModel.value[name]
        }
      }
  }
  return null
}

interface ComponentInfo {
  name: string
  attrs?: Record<string, any>
}

</script>

<style scoped>
.container {
  height: v-bind(containerHeight);
  background-color: #FFFFFF;
  padding: 0 10px;
}

</style>