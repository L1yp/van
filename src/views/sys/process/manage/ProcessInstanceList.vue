<template>
  <div class="dict-info-container">
    <div class="op-line">
      <el-button size="default" plain style="vertical-align: middle;" type="primary" @click="createProcess">
        <SVGIcon style="width: 1em; height: 1em" name="Plus"/><span style="margin-left: 4px;">新增</span>
      </el-button>
      <el-button size="default" plain style="vertical-align: middle" type="warning" @click="exportProcessTable">
        <SVGIcon style="width: 1em; height: 1em" name="Download"/><span style="margin-left: 4px;">导出</span>
      </el-button>
    </div>

    <div class="data-table">
      <el-table
        ref="dictInfoTableRef"
        v-loading="dictInfoTableLoading"
        :data="dictInfoTableData"
        :height="dictTableHeight" stripe
        :row-style="{cursor: 'pointer'}"
        highlight-current-row
        current-row-key="id"
        row-key="id"
      >
        <el-table-column label="#" prop="id" width="50"/>
        <el-table-column label="编号" prop="code" width="150" show-overflow-tooltip/>
        <el-table-column label="标题" prop="name" width="150" show-overflow-tooltip/>
        <el-table-column label="责任人" width="150" align="center">
          <template #default="scope">
            <user-viewer :data="scope.row.assignee"></user-viewer>
          </template>
        </el-table-column>
        <el-table-column label="创建人" width="150" align="center">
          <template #default="scope">
            <user-viewer :data="scope.row.creator"></user-viewer>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="scope">
            <el-button size="small" plain style="vertical-align: middle" text @click.stop="viewProcess(scope.row)">
              <s-v-g-icon style="width: 1em; height: 1em" name="View"/><span style="margin-left: 6px">详情</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>

  <v-dialog
    v-model="visible"
    @confirm="handleConfirmCreateProcess"
    @cancel="visible = false"
    title="发起流程"
  >
    <v-form-pro :formAttr="{ labelWidth: startPageInfo?.process_model_node_page?.label_width }"
                :scheme="scheme"
                v-model="formModel">
    </v-form-pro>
  </v-dialog>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router"
import {computed, inject, onBeforeMount, onBeforeUnmount, onMounted, Ref, ref, toRaw,} from "vue"
import { asideWidthKey, mainHeightKey, themeKey, } from "@/config/app.keys";
import {
  ElTable, ElTableColumn, ElButton, ElMessage,
} from "element-plus"
import * as ProcessApi from "@/api/sys/process"
import SVGIcon from "@/components/common/SVGIcon.vue"
import VDialog from "@/components/dialog/VDialog.vue";
import {getDeviceType} from "@/utils/common";
import VFormPro from "@/components/form/VFormPro.vue";
import {FormScheme} from "@/components/form/types";
import UserViewer from "@/components/common/viewer/user/UserViewer.vue";


const route = useRoute()
const router = useRouter()
const key = route.params.key as string

const mainHeight = inject(mainHeightKey);
const theme = inject(themeKey);
const asideWidth = inject(asideWidthKey)
const dictInfoTableRef = ref<InstanceType<typeof ElTable>>()
const dictInfoTableLoading = ref(true)
const dictInfoTableData = ref<ProcessInstanceView[]>([])


const dictInfoTableWidth = computed(() => {
  const padding = 20;
  const tableWidth = 850;
  return (padding + tableWidth) + "px";
})
const dictTableHeight = computed(() => {
  return `calc(${mainHeight.value} - ${theme.value.mainPadding * 2 + 42 + 20}px)`
})

const startPageInfo = ref<ProcessPageInfo>(null)
async function loadTableData() {
  let param = key as string
  dictInfoTableLoading.value = true
  try {
    dictInfoTableData.value = await ProcessApi.processInstanceByProcessKey(param)
  } catch (e) {
    console.log(e)
    ElMessage.error(e?.message || '加载数据失败')
  } finally {
    dictInfoTableLoading.value = false
  }
}

async function loadStartForm() {
  dictInfoTableLoading.value = true
  try {
    startPageInfo.value = await ProcessApi.getStartFormPage(key)
  } catch (e) {
    console.log(e)
    ElMessage.error(e?.message || '加载数据失败')
  } finally {
    dictInfoTableLoading.value = false
  }
}

onBeforeMount(() => {
  loadTableData()
  loadStartForm()
})

function viewProcess(row: ProcessInstanceView) {
  router.push({
    name: "processInstanceInfo",
    query: {
      id: row.id,
      key: key
    }
  })
}

const visible = ref<boolean>(false)
const device = getDeviceType()
const formModel = ref<Record<string, any>>({})
function createProcess() {
  if (!startPageInfo.value) {
    ElMessage.error('无启动表单，请先配置')
    return
  }
  visible.value = true
}

const scheme = computed<FormScheme[][]>(() => {
  if (!startPageInfo.value) {
    return []
  }
  const pageScheme: PageFieldScheme[] = startPageInfo.value.process_model_page_scheme_view[device]
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

async function handleConfirmCreateProcess() {
  try {
    const model = rebuildFormModel(formModel)
    await ProcessApi.createProcess(key, model)
    await loadTableData()
    ElMessage.success("创建成功")
  } catch (e) {
    console.error(e)
    ElMessage.error(e?.message || '创建失败')
  } finally {
    visible.value = false
  }
}


function rebuildFormModel(formModel: Ref<Record<string, any>>): Record<string, any> {
  const data = {}
  Object.assign(data, toRaw(formModel.value))
  const keys = Object.keys(data)
  const fieldMap = new Map<string, number>(startPageInfo.value.fields.map(it => [it.name, it.component_type]))
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
    } else if (componentType === 10) {
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
    return writeable === 1 ? {name: 'el-input'} : {name: 'el-input', attrs: { disabled: true }};
  }
  else if (componentType === 2) {
    return writeable === 1 ? {name: 'el-input', attrs: {type: 'textarea'}} : {name: 'el-input', attrs: {type: 'textarea', disabled: true}};
  }
  else if (componentType === 3) {
    // const val = processInfo.value[name] as DictValue // TODO: 后期通过默认取值策略返回默认值
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
          // val
        },
      }
    }

  }
  else if (componentType === 4) {
    // const val = processInfo.value[name] as DictValue[] // TODO: 后期通过默认取值策略返回默认值
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
          // val
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
        }
      } : {
        name: 'user-viewer',
        attrs: {
          // data: pageModel.value[name] // TODO: 后期通过默认取值策略返回默认值
        }
      };
  }
  else if (componentType === 7) {
    return writeable === 1 ?
      {
        name: 'user-selector-input',
        attrs: {
          multiple: true,
        }
      }  : {
        name: 'user-viewer',
        attrs: {
          // data: pageModel.value[name] // TODO: 后期通过默认取值策略返回默认值
        }
      }
  }
  return null
}

interface ComponentInfo {
  name: string
  attrs?: Record<string, any>
}

function exportProcessTable() {}




</script>

<style scoped>


.dict-info-container {
  box-sizing: border-box;
  width: v-bind(dictInfoTableWidth);
  background-color: #FFFFFF;
  padding: 10px;
  transition: .3s;
}

.dict-info-container:hover {
  box-shadow: 0 0 12px rgba(0, 0, 0, .12);
}


.op-line {
  box-sizing: border-box;
  height: 32px;
}

.data-table {
  box-sizing: border-box;
  margin-top: 10px;
}

:deep(.el-form-item.is-success .el-input__validateIcon) {
  color: green;
}
</style>