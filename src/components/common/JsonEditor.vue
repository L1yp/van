<template>
  <el-dialog v-model="dialogVisible" @opened="handleDialogOpened" @closed="handleDialogClosed" :draggable="true" :append-to-body="true" :fullscreen="fullScreen" :show-close="false" class="user-ext-dialog">
    <template #header>
      <div style="display: flex; justify-content: space-between; align-content: center; height: 23px; box-sizing: border-box">
        <div style="font-size: 1.2em">预览</div>
        <div style="display: flex; flex-direction: row; justify-content: center">
          <div @click.stop="requestFullScreen" class="full-screen btn">
            <s-v-g-icon style="width: 20px; height: 20px" :name="fullScreen ? 'FullScreenMinimize' : 'FullScreenMaximize'"/>
          </div>
          <div @click.stop="handleDialogClosed" class="close btn">
            <s-v-g-icon style="width: 20px; height: 20px" name="close"/>
          </div>
        </div>
      </div>
    </template>
    <el-scrollbar :max-height="scrollHeight" always>
      <div ref="editorRef"></div>
    </el-scrollbar>
    <template #footer>
      <slot name="footer">
      </slot>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import {basicSetup, EditorView} from "codemirror"
import {EditorState, Compartment} from "@codemirror/state"
import { json } from "@codemirror/lang-json"
import {computed, ref, shallowRef, toRaw, watch, defineComponent, PropType} from "vue";
import {ElDialog, ElScrollbar, ElButton} from "element-plus"
import SVGIcon from "@/components/common/SVGIcon.vue"


export default defineComponent({
  props: {
    visible: Boolean as PropType<boolean>,
    code: String as PropType<string>,
  },
  emits: ["update:visible"],
  components: {
    ElDialog, ElScrollbar, ElButton, SVGIcon
  },
  setup(props, ctx) {

    const {emit: emits} = ctx

    let language = new Compartment, tabSize = new Compartment
    const editorRef = shallowRef<HTMLDivElement>()
    const state = shallowRef<EditorState>(null)
    const view = shallowRef<EditorView>(null)


    const dialogVisible = ref(props.visible)
    watch(() => props.visible, () => dialogVisible.value = props.visible)

    const fullScreen = ref<boolean>(false)
    function requestFullScreen() {
      fullScreen.value = !fullScreen.value
    }
    const scrollHeight = computed(() => {
      if (fullScreen.value) {
        return "calc(100vh - 54px - 64px - 40px)"
      } else {
        return "calc(100vh - 54px - 64px - 30vh - 40px)"
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
          language.of(json()),
          tabSize.of(EditorState.tabSize.of(4))
        ]
      })
      view.value = new EditorView({
        state: toRaw(state.value),
        parent: editorRef.value
      })

    }

    function handleDialogClosed() {
      dialogVisible.value = false
      emits("update:visible", false)
    }

    return {
      props, state, view,
      editorRef, dialogVisible, fullScreen, requestFullScreen, scrollHeight,
      handleDialogOpened, handleDialogClosed
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