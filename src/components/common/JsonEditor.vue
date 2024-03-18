<template>
  <v-dialog
    v-model="dialogVisible"
    @opened="handleDialogOpened"
    draggable
    append-to-body
    :init-full-screen="false"
    show-full-screen
    hidden-footer
    title="预览"
  >
    <el-scrollbar always>
      <div ref="editorRef"></div>
    </el-scrollbar>
  </v-dialog>
</template>

<script lang="ts" setup>
import { basicSetup, EditorView } from "codemirror"
import { EditorState, Compartment } from "@codemirror/state"
import { json } from "@codemirror/lang-json"
import { computed, shallowRef, toRaw } from "vue";
import { ElScrollbar } from "element-plus"
import VDialog from "@/components/dialog/VDialog.vue";

const props = defineProps<{
  modelValue: boolean
  code: string
}>()
const emits = defineEmits<{
  'update:modelValue': [v: boolean]
}>()
const dialogVisible = computed({
  get: () => props.modelValue,
  set(v) {
    emits('update:modelValue', v)
  }
})

let language = new Compartment, tabSize = new Compartment
const editorRef = shallowRef<HTMLDivElement>()
const state = shallowRef<EditorState | null>(null)
const view = shallowRef<EditorView | null>(null)



function handleDialogOpened() {
  view.value?.destroy()

  state.value = EditorState.create({
    doc: props.code,
    extensions: [
      basicSetup,
      language.of(json()),
      tabSize.of(EditorState.tabSize.of(4))
    ]
  })
  view.value = new EditorView({
    state: toRaw(state.value),
    parent: editorRef.value
  })

}

</script>

<style scoped>
div.btn {
  cursor: pointer;
}

div.btn + div.btn {
  cursor: pointer;
  margin-left: 10px;
}

div.btn:hover {
  color: var(--el-color-primary)
}

.dialog-footer {
  display: flex;
  justify-content: space-around;
}
</style>