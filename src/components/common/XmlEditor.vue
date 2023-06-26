<template>
  <v-dialog
    v-model="visible"
    title="预览XML"
    @opened="handleDialogOpened"
    append-to-body
    :fixed-body-height="true"
    :use-body-scrolling="false"
    @cancel="visible = false"
    @confirm="emits('confirm', view?.state?.doc?.toString())"
  >
    <div ref="editorContainer" style="height: 100%; width: 100%;" class="editor-container">
      <div ref="editorRef"></div>
    </div>
  </v-dialog>
</template>

<script lang="ts" setup>
import { basicSetup, EditorView } from "codemirror"
import { EditorState, Compartment } from "@codemirror/state"
import { xml } from "@codemirror/lang-xml"
import { shallowRef, toRaw, computed } from "vue";
import VDialog from "@/components/dialog/VDialog.vue";

interface Props {
  modelValue: boolean
  code: string
}

const props = defineProps<Props>()
const emits = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'confirm', val: string): void
}>()


let language = new Compartment, tabSize = new Compartment
const editorRef = shallowRef<HTMLDivElement>()
const state = shallowRef<EditorState>()
const view = shallowRef<EditorView>()
const visible = computed({
  get() { return props.modelValue },
  set(v) {
    emits('update:modelValue', v)
  }
})


const editorContainer = shallowRef<HTMLDivElement>()
function handleDialogOpened() {
  if(view.value) {
    view.value.destroy()
  }

  state.value = EditorState.create({
    doc: props.code,
    extensions: [
      EditorView.editable.of(true),
      basicSetup,
      language.of(xml()),
      tabSize.of(EditorState.tabSize.of(4))
    ]
  })
  view.value = new EditorView({
    state: toRaw(state.value),
    parent: editorRef.value
  })

  if (!editorContainer.value) {
    return
  }

  const resizeObserver = new ResizeObserver(entries => {
    if (!view.value) {
      return
    }
    for (const entry of entries) {
      const { height } = entry.contentRect;
      view.value.dom.style.height = `${height}px`;
      view.value.requestMeasure();
    }
  });
  resizeObserver.observe(editorContainer.value)
}
</script>

<style scoped>
.editor-container ::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.editor-container ::-webkit-scrollbar-track {
  background: transparent;
}

.editor-container ::-webkit-scrollbar-thumb {
  background: #bfc6d2;
  border-radius: 3px;
}

.editor-container ::-webkit-scrollbar-thumb:hover {
  background: #6e85ad;
  cursor: pointer;
}
</style>