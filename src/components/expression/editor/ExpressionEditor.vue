<template>
  <div style="height: 500px"></div>
  <div style="box-sizing: border-box; background-color: #FFFFFF">

    <div class="editor-toolbar">
      <div class="toolbar-item">
        <el-popover
          v-model:visible="popoverVisible"
          placement="top-start"
          width="500px"
        >
          <template #reference>
            <span @click.stop="popoverVisible = true">
              <s-v-g-icon style="width: 24px; height: 24px" name="Plus"/>
            </span>
          </template>
          <div style="height: 300px">
            <field-expression-panel
              :fields="fieldDefinitions"
              @confirm="popoverVisible = false"
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
    <div ref="editorRef"></div>
  </div>
</template>

<script lang="ts" setup>
import {onBeforeMount, onMounted, ref, shallowRef} from "vue";
import {
  createEditor,
  Editor,
} from "@textbus/editor";
import {ExpressionBlock, expressionBlockLoader} from "@/components/expression/editor/components/ExpressionBlock"
import SVGIcon from "@/components/common/SVGIcon.vue";
import { ElPopover, ElInput, ElButton } from 'element-plus'
import {Commander} from "@textbus/core";
import { loadProcessFieldDefinition } from '@/api/sys/process'
import FieldExpressionPanel from "@/components/expression/components/FieldExpressionPanel.vue";

const popoverVisible = ref<boolean>(false)
const fieldDefinitions = ref<ProcessFieldDefinition[]>([])
onBeforeMount(async () => fieldDefinitions.value = await loadProcessFieldDefinition('holiday'))

const editorRef = shallowRef<HTMLDivElement>()

const options = {
  // 编辑时的文档样式
  editingStyleSheets: [
    `[style*=color]:not([style*=background-color]) a {color: inherit;}`,
    `a {text-decoration: underline; color: #449fdb; cursor: text;}`,
    `[textbus-editable=off] > * {user-select: text; cursor: default;}`
  ],
  // 文档样式
  styleSheets: [
    `p {margin: 0; padding: 0;vertical-align: middle;}`
  ],
  componentLoaders: [
    expressionBlockLoader,
  ],
  formatLoaders: [],
  plugins: [],
}

const editor = shallowRef<Editor>()

onMounted(() => {
  console.log('onMounted')

  editor.value = createEditor(options)
  editor.value.onReady.subscribe(() => {
    console.log('editor is ready')
    editor.value.focus()
  })
  editor.value.mount(editorRef.value)
})

function handleAddBlockStart() {
  const expression = ExpressionBlock.createInstance(editor.value.injector, {
    slots: [],
    state: {
      content: '('
    }
  })
  const commander = editor.value.injector.get(Commander);
  commander.insert(expression)
}

function handleAddBlockEnd() {
  const expression = ExpressionBlock.createInstance(editor.value.injector, {
    slots: [],
    state: {
      content: ')'
    }
  })
  const commander = editor.value.injector.get(Commander);
  commander.insert(expression)
}

function handleAddOr() {
  const expression = ExpressionBlock.createInstance(editor.value.injector, {
    slots: [],
    state: {
      content: '或'
    }
  })
  const commander = editor.value.injector.get(Commander);
  commander.insert(expression)
}

function handleAddAnd() {
  const expression = ExpressionBlock.createInstance(editor.value.injector, {
    slots: [],
    state: {
      content: '且'
    }
  })
  const commander = editor.value.injector.get(Commander);
  commander.insert(expression)
}

const expression = ref<string>('')

function handleAddBlock() {
  const expressionInstance = ExpressionBlock.createInstance(editor.value.injector, {
    slots: [],
    state: {
      content: expression.value
    }
  })
  const commander = editor.value.injector.get(Commander);
  commander.insert(expressionInstance)
}

</script>

<style>
.textbus-container {
  height: 200px;
}

span.expression-block {
  background-color: #F5F5F5;
  padding: 6px;
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
  /*padding: 5px 10px 5px 10px;*/
  width: 100%;
  box-sizing: border-box;
  height: 34px;
  background-color: #ffffff;
  border: 1px solid rgb(227, 227, 227);
  /*border-bottom: none;*/
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