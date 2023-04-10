<template>
  <div style="position: relative; border-bottom: 1px solid var(--el-border-color)">
    <div class="scroll-left-button">
      <ElButton :icon="Icons['ArrowLeft']" style="width: 30px; height: 30px; border: none" @click.stop="handleScrollLeft" title="左滑" />
    </div>
    <div class="scroll-right-button">
      <ElButton :icon="Icons['ArrowRight']" style="width: 30px; height: 30px; border: none" @click.stop="handleScrollRight" title="右滑" />
    </div>
    <div class="tag-list" ref="tagBarRef">
      <el-dropdown
        v-for="element in tags"
        :key="element.path"
        :path="element.path"
        trigger="contextmenu"
        ref="dropdownRefList"
        @command="val => handleContextMenuCommand(val, element)"
      >
        <ChromeTab
          @closeTag="closeTag(element)"
          :closeable="element.close"
          :class="[element.active ? 'active' : '']"
          @clickTag="router.push(element.fullPath)"
        >
          <template v-if="!!element.icon" #icon>
            <el-icon size="0.8em">
              <SVGIcon :name="element.icon"/>
            </el-icon>
          </template>
          <template #text>
            <span style="margin-left: 0.5em;" v-text="element.title"></span>
          </template>
        </ChromeTab>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="refresh" :icon="Icons['Refresh']">刷新</el-dropdown-item>
            <el-dropdown-item command="fullscreen" :icon="useIcon('FullScreenMaximize', { style: { width: '1em', height: '1em' } })">全屏</el-dropdown-item>
            <el-dropdown-item command="closeThis" :icon="Icons['Close']">关闭当前</el-dropdown-item>
            <el-dropdown-item command="closeLeft" :icon="Icons['Close']">关闭左侧</el-dropdown-item>
            <el-dropdown-item command="closeRight" :icon="Icons['Close']">关闭右侧</el-dropdown-item>
            <el-dropdown-item command="closeAll" :icon="Icons['Close']">关闭全部</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>

</template>

<script lang="ts" setup>
import {
  ElScrollbar, ElIcon, ElDropdown, ElDropdownMenu, ElDropdownItem, ElButton,
} from "element-plus";
import {computed, inject, nextTick, onMounted, reactive, Ref, ref, unref, watch} from "vue"
import ChromeTab from "@/layouts/components/tag/ChromeTab.vue";
import {Tag, TagInfo} from "./"
import {useRoute, useRouter} from "vue-router";
import {read, write} from "@/utils/storage"
import SVGIcon from "@/components/common/SVGIcon.vue";
import {useIcon} from "@/components/common/util";
import {RouteMetaRecord} from "@/router";
import {maskContainerKey, pageFullScreenKey, themeKey} from "@/config/app.keys";
import {useTitle} from "@vueuse/core";
import * as Icons from "@element-plus/icons-vue";
import { incMaskZIndex } from "@/components/dialog/mask";

const theme = inject<Ref<ThemeConfig>>(themeKey)

const title = useTitle()
const route = useRoute()
const router = useRouter()

const tags = reactive<TagInfo[]>([])
const activeTag = ref<TagInfo>()

const maskContainer = inject(maskContainerKey)
const tagBarRef = ref<HTMLDivElement>()
function handleScrollLeft() {
  // console.log('scrollLeft', tagBarRef.value.scrollLeft)
  // console.log('scrollWidth', tagBarRef.value.scrollWidth)
  // console.log('clientWidth', tagBarRef.value.clientWidth)
  // console.log('offsetWidth', tagBarRef.value.offsetWidth)
  const scrollLeft = tagBarRef.value.scrollLeft
  if (tagBarRef.value.scrollWidth > tagBarRef.value.clientWidth) {
    const targetLeft = scrollLeft - 100
    tagBarRef.value.scrollTo({
      left: targetLeft < 0 ? 0 : targetLeft,
      behavior: 'smooth'
    })
    // tagBarRef.value.scrollLeft = targetLeft < 0 ? 0 : targetLeft
  }
}

function handleScrollRight() {
  // console.log('scrollLeft', tagBarRef.value.scrollLeft)

  const scrollLeft = tagBarRef.value.scrollLeft
  const scrollWidth = tagBarRef.value.scrollWidth
  const maxLeft = scrollWidth - tagBarRef.value.clientWidth
  if (tagBarRef.value.scrollWidth > tagBarRef.value.clientWidth) {
    const targetLeft = scrollLeft + 100
    // tagBarRef.value.scrollLeft = targetLeft > maxLeft ? maxLeft : targetLeft
    tagBarRef.value.scrollTo({
      left: targetLeft > maxLeft ? maxLeft : targetLeft,
      behavior: 'smooth'
    })
  }
}

function closeTag(tag: TagInfo) {
  const length = tags.length;
  if (length === 1) {
    return;
  }
  console.log("tags", tags);
  let delIdx = -1;
  let isDelActiveTag = false;
  for (let i = 0; i < tags.length; i++) {
    if (tag.path === tags[i].path) {
      isDelActiveTag = tags[i].active;
      tags.splice(i, 1);
      delIdx = i;
      break;
    }
  }

  if (isDelActiveTag) {
    if (delIdx === length - 1) {
      tags[tags.length - 1].active = true;
      activeTag.value = tags[tags.length - 1];
      router.push(tags[tags.length - 1].fullPath);
    } else {
      tags[delIdx].active = true;
      activeTag.value = tags[delIdx];
      router.push(tags[delIdx].fullPath);
    }
  } else {
    write("tags", tags);
  }
}

const tagBarHeight = computed(() => `${theme.value.tagBarHeight - 1}px`)

const dropdownRefList = ref<InstanceType<typeof ElDropdown>[]>([])
watch(() => route.fullPath, (newPath, oldPath)=>{
  console.log("path", newPath, oldPath, route, dropdownRefList.value)
  if (route.matched[0].name !== "main") {
    // 只把layout main路由的加入多标签
    return;
  }


  const lastMatched = route.matched[route.matched.length - 1]
  const tagUniPath = lastMatched.path

  setTimeout(() => {
    const dropdownRef = dropdownRefList.value?.find(it => it.$attrs.path === tagUniPath)
    const elem = dropdownRef?.$el as HTMLDivElement
    elem.scrollIntoView({
      behavior: 'smooth'
    })
  }, 1000)

  if (tags.length === 0) {
    const array = read<TagInfo[]>("tags");
    if(array) {
      for (let item of array) {
        tags.push(item);
      }
    }
  }
  let isNewTab = true;
  for (let tag of tags) {
    if (tag.path === tagUniPath) {
      tag.active = true;
      activeTag.value = tag;
      isNewTab = false;
    } else {
      tag.active = false;
    }
  }

  if (isNewTab) {
    const meta = route.meta as unknown as RouteMetaRecord
    const tag: TagInfo = {
      path: tagUniPath,
      fullPath: newPath,
      title: meta.name,
      active: true,
      close: meta.closeable,
      icon: meta.icon,
    }
    tags.push(tag);
    activeTag.value = tag;

  }
  const meta: RouteMetaRecord = route.meta as unknown as RouteMetaRecord;
  title.value = meta.name

  write("tags", tags);
  if (maskContainer?.value?.hasChildNodes()) {
    while (maskContainer?.value?.hasChildNodes()) {
      maskContainer?.value?.removeChild(maskContainer?.value?.firstChild)
    }
  }

}, { immediate: true, flush: 'post' });


const setPageScreen = inject(pageFullScreenKey)
function handleContextMenuCommand(command: string, element: TagInfo) {
  if (command === 'fullscreen') {
    if (element.path === activeTag.value.path) {
      setPageScreen()
    } else {
      router.push(element.fullPath).then(setPageScreen)
    }
  }
  else if (command === 'refresh') {
    router.push({  })
    router.push(`/redirect?url=${encodeURIComponent(element.fullPath)}`)
  }
  else if (command === 'closeThis') {
    closeTag(element)
  }
  else if (command === 'closeLeft') {
    const deleteIndices = []
    const idx = tags.findIndex(it => it === element)
    if (idx === -1) {
      console.error('tags.findIndex fail', element)
      return
    }

    for (let i = 0; i < idx; i++) {
      if (tags[i].close) {
        deleteIndices.push(i)
      }
    }

    const len = deleteIndices.length
    for (let i = len - 1; i >= 0; i--) {
      tags.splice(deleteIndices[i], 1)
    }
  }
  else if (command === 'closeRight') {
    const deleteIndices = []
    const idx = tags.findIndex(it => it === element)
    if (idx === -1) {
      console.error('tags.findIndex fail', element)
      return
    }

    for (let i = idx + 1; i < tags.length; i++) {
      if (tags[i].close) {
        deleteIndices.push(i)
      }
    }

    const len = deleteIndices.length
    for (let i = len - 1; i >= 0; i--) {
      tags.splice(deleteIndices[i], 1)
    }
  }
  else if (command === 'closeAll') {
    const deleteIndices = []
    for (let i = 0; i < tags.length; i++) {
      if (tags[i].close) {
        deleteIndices.push(i)
      }
    }

    const len = deleteIndices.length
    for (let i = len - 1; i >= 0; i--) {
      tags.splice(deleteIndices[i], 1)
    }

    if (tags.length > 0) {
      activeTag.value = tags[0]
      activeTag.value.active = true
      router.push(activeTag.value.fullPath)
    }

  }
}

</script>

<style scoped>
div {
  box-sizing: border-box;
}

.scroll-left-button {
  border-right: 1px solid var(--el-border-color);
  left: 0;
}

.scroll-right-button {
  border-left: 1px solid var(--el-border-color);
  right: 0;
}

.scroll-left-button,
.scroll-right-button {
  box-sizing: content-box;
  position: absolute;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--el-bg-color);
  cursor: pointer;
  z-index: 6;
}
.scroll-left-button svg,
.scroll-right-button svg {
  width: 1em;
  height: 1em;
}


.tag-list {
  position: relative;
  box-sizing: border-box;
  margin-left: 30px;
  padding-left: 10px;
  margin-right: 40px;
  height: v-bind(tagBarHeight);
  max-height: v-bind(tagBarHeight);
  background-color: var(--tag-item-bg-color); /*var(--el-bg-color);*/
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  /*border-bottom: 1px solid var(--el-border-color);*/
  overflow-x: hidden;
  white-space: nowrap;
}
</style>
