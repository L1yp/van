<template>
  <v-dialog
    v-model="visible" 
    title="预览XML"
    @opened="handleDialogOpened" 
    draggable append-to-body
    @cancel="visible = false"
  >
    <div ref="editorRef"></div>
  </v-dialog>
</template>

<script lang="ts">
import {basicSetup, EditorView} from "codemirror"
import {EditorState, Compartment} from "@codemirror/state"
import {xml} from "@codemirror/lang-xml"
import { ref, shallowRef, toRaw, watch, defineComponent, PropType, computed } from "vue";
import VDialog from "@/components/dialog/VDialog.vue";


export default defineComponent({
  props: {
    modelValue: Boolean as PropType<boolean>,
    code: String as PropType<string>,
  },
  emits: ["update:modelValue"],
  components: {
    VDialog
  },
  setup(props, ctx) {

    const {emit: emits} = ctx

    let language = new Compartment, tabSize = new Compartment
    const editorRef = shallowRef<HTMLDivElement>()
    const state = shallowRef<EditorState>(null)
    const view = shallowRef<EditorView>(null)

    const visible = computed({
      get() { return props.modelValue },
      set(v) {
        emits('update:modelValue', v)
      }
    })

    function handleDialogOpened() {
      if(view.value) {
        view.value.destroy()
      }

      state.value = EditorState.create({
        doc: props.code,
        extensions: [
          basicSetup,
          language.of(xml()),
          tabSize.of(EditorState.tabSize.of(4))
        ]
      })
      view.value = new EditorView({
        state: toRaw(state.value),
        parent: editorRef.value
      })

    }


    return {
      props, state, view,
      editorRef, visible, 
      handleDialogOpened
    }
  }
})

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