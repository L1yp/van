<template>
  <div style="height: 500px"></div>
  <div style="box-sizing: border-box; background-color: #FFFFFF">

    <div class="editor-toolbar">
      <div class="toolbar-item">
        <el-popover
          v-model:visible="popoverVisible"
          placement="top-start"
          width="700px"
        >
          <template #reference>
            <span @click.stop="handleOpenAddPanel">
              <s-v-g-icon style="width: 24px; height: 24px" name="Plus"/>
            </span>
          </template>
          <div style="height: 300px">
            <field-expression-panel
              :fields="fieldDefinitions"
              v-model:field-id="addState.fieldId"
              v-model:operator="addState.operator"
              v-model:val="addState.val"
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
    <div ref="editorRef" style="height: 160px; padding: 10px"></div>
  </div>

  <el-popover
    placement="top-start"
    width="700px"
    trigger="click"
    :virtual-ref="popoverElem"
    virtual-triggering
    v-model:visible="editPopoverVisible"
  >
    <div style="height: 300px">
      <field-expression-panel
        :fields="fieldDefinitions"
        v-model:field-id="editState.fieldId"
        v-model:operator="editState.operator"
        v-model:val="editState.val"
        @confirm="handleUpdateState"
        @cancel="editPopoverVisible = false"
      />
    </div>
  </el-popover>
</template>

<script lang="ts" setup>
import {onBeforeMount, onMounted, ref, shallowRef} from "vue";
import {
  createEditor,
  Editor,
  paragraphComponentLoader,
} from "@textbus/editor";

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
  editBlockRef, BlockAttr,
} from "@/components/expression/editor/components/ExpressionBlock"

import {
  ExpressionRoot, expressionRootLoader
} from '@/components/expression/editor/components/ExpressionRoot'

import SVGIcon from "@/components/common/SVGIcon.vue";
import { ElPopover, ElInput, ElButton } from 'element-plus'
import {Commander} from "@textbus/core";
import { loadProcessFieldDefinition } from '@/api/sys/process'
import FieldExpressionPanel from "@/components/expression/components/FieldExpressionPanel.vue";
import {EditorOptions} from "@textbus/editor/bundles/types";
import {NopCommander} from "@/components/expression/editor/components/NopCommander";

const addState = ref<BlockAttr>({
  fieldId: 0,
  operator: '',
  val: ''
})
const popoverVisible = ref<boolean>(false)

function handleOpenAddPanel() {
  addState.value = {
    fieldId: 0,
    operator: '',
    val: ''
  }
  popoverVisible.value = true
}

const fieldDefinitions = ref<ProcessFieldDefinition[]>([])
onBeforeMount(async () => fieldDefinitions.value = await loadProcessFieldDefinition('holiday'))

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
  editor.value.mount(editorRef.value)
})

function handleAddBlockStart() {
  const expression = ExpressionBlock.createInstance(editor.value.injector, {
    slots: [],
    state: {
      text: '(',
      content: {
        type: 'START',
        attrs: undefined
      }
    }
  })
  const commander = editor.value.injector.get(Commander);
  commander.insert(expression)
}

function handleAddBlockEnd() {
  const expression = ExpressionBlock.createInstance(editor.value.injector, {
    slots: [],
    state: {
      text: ')',
      content: {
        type: 'END',
        attrs: undefined
      }
    }
  })
  const commander = editor.value.injector.get(Commander);
  commander.insert(expression)
}

function handleAddOr() {
  const expression = ExpressionBlock.createInstance(editor.value.injector, {
    slots: [],
    state: {
      text: '或',
      content: {
        type: 'OR',
        attrs: undefined
      }
    }
  })
  const commander = editor.value.injector.get(Commander);
  commander.insert(expression)
}

function handleAddAnd() {
  const expression = ExpressionBlock.createInstance(editor.value.injector, {
    slots: [],
    state: {
      text: '且',
      content: {
        type: 'AND',
        attrs: undefined
      }
    }
  })
  const commander = editor.value.injector.get(Commander);
  commander.insert(expression)
}

const state = ref<ExpressionBlockState>()


function handleConfirm(field: ProcessFieldDefinition, operator: string, val: any) {
  const expressionInstance = ExpressionBlock.createInstance(editor.value.injector, {
    slots: [],
    state: {
      text: `${field.label} ${operator} ${val}`,
      content: {
        type: "BLOCK",
        attrs: {
          fieldId: field.id,
          operator: operator,
          val: val,
        }
      }
    }
  })
  const commander = editor.value.injector.get(Commander);
  commander.insert(expressionInstance)
  popoverVisible.value = false
}



function handleUpdateState() {
  const field = fieldDefinitions.value.find(it => it.id === editState.value.fieldId)
  editBlockRef.value.updateState(draft => {
    draft.text = `${field.label} ${editState.value.operator} ${editState.value.val}`
    draft.content.attrs.fieldId = editState.value.fieldId
    draft.content.attrs.operator = editState.value.operator
    draft.content.attrs.val = editState.value.val
  })
  editPopoverVisible.value = false
}

</script>

<style>

span.expression-block {
  background-color: #F5F5F5;
  padding: 6px;
  cursor: pointer;
}

span.expression-block + span.expression-block {
  margin-left: 6px;
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