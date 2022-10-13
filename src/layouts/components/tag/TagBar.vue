<template>
  <el-scrollbar :style="{maxHeight: theme.tagBarHeight + 'px'}">
    <div class="tag-list">
      <div
        v-for="element in tags"
        :key="element.path"
        class="tag"
        :class="[element.active ? 'active' : '']"
      >
        <el-dropdown trigger="contextmenu" @command="val => handleContextMenuCommand(val, element)">
          <Tag
            @closeTag="closeTag(element)"
            :close="element.close"
            :class="[element.active ? 'active' : '']"
            @clickTag="router.push(element.path)"
          >
            <template #icon>
              <el-icon size="0.8em"><SVGIcon :name="element.icon"></SVGIcon></el-icon>
            </template>
            <template #text>
              <span style="margin-left: 0.5em;" v-text="element.title"></span>
            </template>
          </Tag>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="fullscreen" :icon="useIcon('FullScreenMaximize', { style: { width: '1em', height: '1em' } })">全屏</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>



    </div>

  </el-scrollbar>
</template>

<script lang="ts" setup>
import {
  ElScrollbar, ElIcon, ElDropdown, ElDropdownMenu, ElDropdownItem
} from "element-plus";
import {computed, inject, nextTick, onMounted, reactive, Ref, ref, unref, watch} from "vue"
import {Tag, TagInfo} from "./"
import {useRoute, useRouter} from "vue-router";
import {read, write} from "@/utils/storage"
import SVGIcon from "@/components/common/SVGIcon.vue";
import {useIcon} from "@/components/common/util";
import {RouteMetaRecord} from "@/router";
import {pageFullScreenKey, themeKey} from "@/config/app.keys";
import {useTitle} from "@vueuse/core";

const theme = inject<Ref<ThemeConfig>>(themeKey)

const title = useTitle()
const route = useRoute();
const router = useRouter();

const tags = reactive<TagInfo[]>([]);
const activeTag = ref<TagInfo>()

onMounted(() => {

});

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
      router.push(tags[tags.length - 1].path);
    } else {
      tags[delIdx].active = true;
      activeTag.value = tags[delIdx];
      router.push(tags[delIdx].path);
    }
  } else {
    write("tags", tags);
  }
}


watch(() => route.fullPath, (newPath, oldPath)=>{
  console.log("path", newPath, oldPath, route);
  if (route.matched[0].name !== "main") {
    // 只把layout main路由的加入多标签
    return;
  }
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
    if (tag.path === newPath) {
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
      path: newPath,
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

}, {immediate: true});

const tagBarHeight = computed(() => `${theme.value.tagBarHeight}px`)

const pageScreen = inject(pageFullScreenKey)
function handleContextMenuCommand(command: string, element: TagInfo) {
  if (command === 'fullscreen') {
    if (element.path === activeTag.value.path) {
      pageScreen.value = true
    } else {
      router.push(element.path).then(() => pageScreen.value = true)
    }
  }
}

</script>

<style scoped>
.tag-list {
  height: v-bind(tagBarHeight);
  max-height: v-bind(tagBarHeight);
  background-color: #FFFFFF;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  border-bottom: 1px solid #e3e3e3;
  box-sizing: border-box;
}
</style>
