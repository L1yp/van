<template>
  <el-dialog v-model="dialogVisible" @closed="handleDialogClosed" :draggable="true" :append-to-body="true"
             :fullscreen="fullScreen" :show-close="false" class="user-ext-dialog">
    <template #header>
      <div
        style="display: flex; justify-content: space-between; align-content: center; height: 23px; box-sizing: border-box">
        <div style="font-size: 1.2em">预览</div>
        <div style="display: flex; flex-direction: row; justify-content: center">
          <div @click.stop="requestFullScreen" class="full-screen btn">
            <s-v-g-icon style="width: 20px; height: 20px"
                        :name="fullScreen ? 'FullScreenMinimize' : 'FullScreenMaximize'"/>
          </div>
          <div @click.stop="handleDialogClosed" class="close btn">
            <s-v-g-icon style="width: 20px; height: 20px" name="close"/>
          </div>
        </div>
      </div>
    </template>
    <el-scrollbar :max-height="scrollHeight" always>
      <pre><code ref="previewCodeRef" class="language-html" v-html="hlHtml"></code></pre>
    </el-scrollbar>
    <template #footer>
      <div class="dialog-footer">
        <el-button size="default" type="primary" @click="handleCopyCode">复制</el-button>
      </div>
    </template>
  </el-dialog>

</template>

<script lang="ts" setup>
import {ref, computed, watch,} from "vue"
import {ElDialog, ElScrollbar, ElButton} from "element-plus"
import SVGIcon from "@/components/common/SVGIcon.vue"
import HighLightJS from "highlight.js"
import 'highlight.js/styles/github.css';
import Clipboard from "clipboard"

interface Props {
  visible: boolean;
  language: string;
  code: string;
}

interface Emits {
  (e: "update:visible", val: boolean): void;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  language: "xml",
  code: "&nbsp;"
})
const emits = defineEmits<Emits>()
const dialogVisible = ref(props.visible)
watch(() => props.visible, () => dialogVisible.value = props.visible)

const hlHtml = computed(() => {
  const result = HighLightJS.highlight(props.code || "", {language: props.language, ignoreIllegals: true})
  return result.value || '&nbsp;';
})


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


function handleDialogClosed() {
  dialogVisible.value = false
  emits("update:visible", false)
}

const previewCodeRef = ref<HTMLElement>()

function handleCopyCode() {
  dialogVisible.value = false
  Clipboard.copy(props.code, {
    container: previewCodeRef.value
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