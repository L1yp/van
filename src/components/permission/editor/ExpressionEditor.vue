<template>
  <!-- <div style="height: 300px"></div> -->
  <div style="box-sizing: border-box; background-color: #FFFFFF">
    <div class="editor-toolbar">
      <div class="toolbar-item">
        <el-popover
          :visible="popoverVisible"
          placement="top-start"
          width="700px"
          teleported
          @show="handleInitState"
        >
          <template #reference>
            <span @click.stop="handleOpenAddPanel">
              <el-icon :size="24"><Plus/></el-icon>
            </span>
          </template>
          <div style="height: 300px">
            <field-expression-panel
              ref="addPanelRef"
              :fields="modelingFields"
              v-model:state="addState"
              @confirm="handleConfirm"
              @cancel="popoverVisible = false"
            />
          </div>
        </el-popover>
      </div>
      <div class="toolbar-item" @click="handleAddBlockStart">(</div>
      <div class="toolbar-item" @click="handleAddBlockEnd">)</div>
      <div class="toolbar-item" @click="handleAddOr">或</div>
      <div class="toolbar-item" @click="handleAddAnd">且</div>
    </div>
    <div ref="editorRef" style="height: 160px; border: 1px solid rgb(227, 227, 227); border-top: none;"></div>
  </div>
  <div>
    <pre v-text="exprPreview"></pre>
  </div>

  <el-popover
    width="700px"
    teleported
    :virtual-ref="popoverElem"
    virtual-triggering
    :visible="editPopoverVisible"
    @show="handleRefreshState"
  >
    <div style="height: 300px">
      <field-expression-panel
        :fields="modelingFields"
        v-model:state="editState"
        ref="editPanelRef"
        @confirm="handleUpdateState"
        @cancel="editPopoverVisible = false"
      />
    </div>
  </el-popover>
</template>

<script lang="ts" setup>
import { inject, onBeforeMount, onMounted, provide, ref, shallowRef, toRaw } from "vue";
import {
  Viewer, ViewOptions,
} from '@textbus/browser'

import {
  ExpressionBlock,
  expressionBlockLoader,
  popoverElem,
  editPopoverVisible,
  editState,
  ExpressionBlockState,
  editBlockRef, Content,
} from "@/components/permission/editor/components/ExpressionBlock"

import {
  ExpressionRoot, expressionRootLoader
} from '@/components/permission/editor/components/ExpressionRoot'
import { ElPopover } from 'element-plus'
import {Commander, RootComponentRef, Slot, ExtractComponentInstanceType } from "@textbus/core";
import FieldExpressionPanel from "@/components/permission/components/FieldExpressionPanel.vue";
import {NopCommander} from "@/components/permission/editor/components/NopCommander";
import { computed } from "@vue/reactivity";
import { Plus } from '@element-plus/icons-vue'
import { ElIcon } from 'element-plus'
import { DateConditionModel, DeptConditionModel, NumberConditionModel, OptionConditionModel, StrConditionModel, UserConditionModel, varDptOptions, varOptions } from "../components/condition";
import { useDeptInfo } from "@/service/system/dept";
import { findTreeItemById } from "@/utils/common";
import {useModelingFieldApi} from "@/service/modeling/field";
import {useModelingOptionApi} from "@/service/modeling/option";
import {userMapKey} from "@/config/app.keys";

interface Props {
  module: FieldModule
  mkey: string
}
const props = defineProps<Props>()
const loading = ref(false)
const { tableData, loadDept } = useDeptInfo(loading)
const { modelingFields, findModelingFields } = useModelingFieldApi(loading)
onBeforeMount(loadDept)
onBeforeMount(async () => {
  await loadDept()
  await findModelingFields(props.module, props.mkey)
  const fields = modelingFields.value
  for (let field of fields) {
    if (field.type === 'option') {
      const { modelingOptionValues, findModelingOptionValues } = useModelingOptionApi(loading)
      await findModelingOptionValues({ typeId: field.scheme.optionTypeId })
      field.scheme.options = toRaw(modelingOptionValues.value)
    }
  }
})

const exprPreview = computed<string>(() => {
  return ''
})

const addState = ref<BlockExpressionModel>({
  field: '',
  operator: 'EQ',
  value: null
})
const popoverVisible = ref<boolean>(false)

function handleOpenAddPanel() {
  addState.value = {
    field: '',
    operator: 'EQ',
    value: null
  }
  popoverVisible.value = !popoverVisible.value
}




const editorRef = shallowRef<HTMLDivElement>()

const options: ViewOptions = {
  autoFocus: true,
  componentLoaders: [
    expressionBlockLoader,
  ],
  providers: [
    {
      provide: Commander,
      useClass: NopCommander
    }
  ]
}

const editor = shallowRef<Viewer>()


onMounted(() => {
  editor.value = new Viewer(ExpressionRoot, expressionRootLoader, options)
  editor.value.mount(editorRef.value!)
})

function handleAddBlockStart() {
  const expression = ExpressionBlock.createInstance(editor.value!.injector, {
    slots: [],
    state: {
      text: '(',
      content: {
        type: 'START',
        attrs: undefined
      }
    }
  })
  const commander = editor.value!.injector.get(Commander);
  commander.insert(expression)
}

function handleAddBlockEnd() {
  const expression = ExpressionBlock.createInstance(editor.value!.injector, {
    slots: [],
    state: {
      text: ')',
      content: {
        type: 'END',
        attrs: undefined
      }
    }
  })
  const commander = editor.value!.injector.get(Commander);
  commander.insert(expression)
}

function handleAddOr() {
  const expression = ExpressionBlock.createInstance(editor.value!.injector, {
    slots: [],
    state: {
      text: '或',
      content: {
        type: 'OR',
        attrs: undefined
      }
    }
  })
  const commander = editor.value!.injector.get(Commander);
  commander.insert(expression)
}

function handleAddAnd() {
  const expression = ExpressionBlock.createInstance(editor.value!.injector, {
    slots: [],
    state: {
      text: '且',
      content: {
        type: 'AND',
        attrs: undefined
      }
    }
  })
  const commander = editor.value!.injector.get(Commander);
  commander.insert(expression)
}

function appendExprComponent(state: ExpressionBlockState) {
  const expression = ExpressionBlock.createInstance(editor.value!.injector, {
    slots: [],
    state
  })
  const commander = editor.value!.injector.get(Commander);
  const result = commander.insert(expression)
  console.log('insert result', result);

}

function initEditorState(permission: FlowPermissionModel | null) {
  clearEditorContent()
  if (!permission) {
    return
  }

  popoverElem.value = null
  popoverVisible.value = false

  const elems = permission.content
  for (const key in permission.userMap) {
    userMap.set(key, permission.userMap[key])
  }

  const states: ExpressionBlockState[] = []
  const map = new Map<string, string>([['AND', '且'], ['OR', '或'], ['(', '('], [')', ')']])
  for (const elem of elems) {
    if (elem.type === 'BLOCK') {
      const field = permission.fieldMap[elem.attrs.field_id]
      const text = buildText(field, elem.attrs.operator, elem.attrs.val)
      const state: ExpressionBlockState = {
        text,
        content: toRaw(elem)
      }
      states.push(state)
    } else {
      const state: ExpressionBlockState = {
        text: map.get(elem.type)!,
        content: toRaw(elem)
      }
      states.push(state)
    }
  }
  states.forEach(it => appendExprComponent(it))
}

function readEditorState(): Content[] {
  if(editor.value!.getContents().content === '<br>') {
    return []
  }

  const injector = editor.value!.injector
  const rootComponent = injector.get(RootComponentRef)

  const slots = rootComponent.component.slots?.toArray() || [];
  const slot: Slot = slots[0]
  const states: Content[] = []
  type ExpressionComponentInstnce = ExtractComponentInstanceType<typeof ExpressionBlock>
  for (let i = 0; i < slot.length; i++) {
    const element: ExpressionComponentInstnce = slot.getContentAtIndex(i) as ExpressionComponentInstnce;
    states.push(element.state.content)
  }
  return states
}

function clearEditorContent() {
  // editor.value?.replaceContent('')
  // editor.value?.focus()
  // return
  if(editor.value!.getContents().content === '<br>') {
    return
  }

  const injector = editor.value!.injector
  const commander = injector.get(Commander)
  const rootComponent = injector.get(RootComponentRef)

  const slots = rootComponent.component.slots?.toArray() || [];
  const slot: Slot = slots[0]
  type ExpressionComponentInstnce = ExtractComponentInstanceType<typeof ExpressionBlock>
  for (let i = slot.length - 1; i >= 0; i--) {
    const element: ExpressionComponentInstnce = slot.getContentAtIndex(i) as ExpressionComponentInstnce;
    commander.removeComponent(element)
  }
}

const userMap = inject(userMapKey)

function buildText(field: ModelingFieldDefView, operator: ConditionOperator, val: FieldConditionUnionModel) {
  let text = ''
  // 单行文本、多行文本

  if (['text'].includes(field.type)) {
    const data = val
    text = `<span class="field">${field.label}</span> <span class="operator">${operator}</span> <span class="content">${data.text}</span>`
  }
  // 字典单选 字典多选
  else if (['option'].includes(field.type)) {
    const data = val as OptionFieldConditionModel
    const fieldMap = new Map<string, ModelingOptionValueView>(field.scheme.options.map(it => [it.id, it]))
    const options = data.option_value_id_list.map(it => fieldMap.get(it)!)
    const labels = options.map(it => it.name).join(',')
    text = `<span class="field">${field.label}</span> <span class="operator">${operator}</span> <span class="content">${labels}</span>`
  }
  // 用户
  else if (['user'].includes(field.type)) {
    const data = val as UserFieldConditionModel

    let sUserList = ''
    if (data.user_id_list?.length) {
      sUserList = data.user_id_list.map(it => userMap.get(it)).map(it => it?.nickname).join(',')
    }

    let strDept = ''
    if (data.dept_id) {
      let deptInfo = findTreeItemById(tableData.value, 'id', data.dept_id)
      strDept = (sUserList ? ',' : '') + deptInfo?.title
      if (data.cascader) {
        strDept = strDept + '(含下级)'
      }
    }


    text = `${field.label} ${operator} ${sUserList}${strDept}`

    text = `<span class="field">${field.label}</span><span class="operator">${operator}</span><span class="content"> <span class="user-list">${sUserList}</span><span class="dept">${strDept}</span>`
  }
  // 部门
  else if (['dept'].includes(field.type)) {
    const data = val as DeptFieldConditionModel

    let deptInfo = findTreeItemById([...varDptOptions, ...tableData.value], 'id', data.dept_id)
    let strDept = deptInfo?.title
    if (data.cascader) {
      strDept = strDept + '(含下级)'
    }

    text = `<span class="field">${field.label}</span><span class="operator">${operator}</span><span class="dept">${strDept}</span>`
  }
  // 时间
  else if (['date'].includes(field.type)) {
    const data = val as DateFieldConditionModel
    let str = data.data_type.toString()
    if (data.data_type === 'FIXED') {
      const times = data.range.split(",")
      const startTime = times[0]
      const endTime = times[1]

      str = startTime + "~" + endTime
    }
    text = `${field.label} ${operator} ${str}`

    text = `<span class="field">${field.label}</span> <span class="operator">${operator}</span> <span class="content">${str}</span>`
  }

  return text
}


function handleConfirm(field: ModelingFieldDefView, operator: ConditionOperator, val: FieldConditionUnionModel) {

  const text = buildText(field, operator, val)
  console.log('text', text)
  const expressionInstance = ExpressionBlock.createInstance(editor.value!.injector, {
    slots: [],
    state: {
      text,
      content: {
        type: "BLOCK",
        attrs: {
          field: field.field,
          operator: operator,
          value: val,
        }
      }
    }
  })
  const commander = editor.value!.injector.get(Commander);
  commander.insert(expressionInstance)

  const states = readEditorState()
  console.log('states', states);


  popoverVisible.value = false
}



function handleUpdateState(field: ModelingFieldDefView, operator: ConditionOperator, val: FieldConditionUnionModel) {
  const text = buildText(field, operator, val)
  editBlockRef.value!.updateState(draft => {
    draft.text = text
    draft.content.attrs!.field = field.field
    draft.content.attrs!.operator = operator
    draft.content.attrs!.value = val
  })
  editPopoverVisible.value = false
}

const editPanelRef = shallowRef<InstanceType<typeof FieldExpressionPanel>>()
function handleRefreshState() {
  editPanelRef.value?.setState()
}

const addPanelRef = shallowRef<InstanceType<typeof FieldExpressionPanel>>()
function handleInitState() {
  addPanelRef.value?.purgeState()
}

function closeExpressionModal() {
  popoverElem.value = null
  editPopoverVisible.value = false
  popoverVisible.value = false

}

defineExpose({
  readEditorState, initEditorState, closeExpressionModal
})
</script>

<style>

span.expression-block {
  border-radius: 2px;
  background: -webkit-gradient(linear,left top,left bottom,from(#e0ecf4),to(#EEE));
  padding: 6px;
  cursor: pointer;
  font-size: 12px;
  line-height: 1;
  display: inline-flex;
}

span.expression-block[tpye=BLOCK]::after {
  width: 12px;
  height: 12px;
  margin-left: 6px;
  content: url('data:image/svg+xml;charset=utf8,%3Csvg%20viewBox%3D%220%200%201024%201024%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%3E%3Cpath%20fill%3D%22currentColor%22%20d%3D%22M831.872%20340.864%20512%20652.672%20192.128%20340.864a30.592%2030.592%200%200%200-42.752%200%2029.12%2029.12%200%200%200%200%2041.6L489.664%20714.24a32%2032%200%200%200%2044.672%200l340.288-331.712a29.12%2029.12%200%200%200%200-41.728%2030.592%2030.592%200%200%200-42.752%200z%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E');
}

span.expression-block {
  margin-left: 6px;
  margin-top: 6px;
}

span.expression-block span.field {
  color: #369;
}

span.expression-block span.operator {
  padding: 0 6px;
}
</style>

<style scoped>
div.editor-toolbar {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  height: 34px;
  background-color: #ffffff;
  border: 1px solid rgb(227, 227, 227);

}

div.editor-toolbar div.toolbar-item {
  margin-left: 10px;
}

div.editor-toolbar div.toolbar-item {
  width: 24px;
  height: 24px;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
}

div.editor-toolbar div.toolbar-item:hover {
  background-color: #f1f1f1;
}

</style>