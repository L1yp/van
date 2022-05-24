<template>
  <el-scrollbar :style="{maxHeight: theme.tagBarHeight + 'px'}">
    <Draggable
        :list="tags"
        :disabled="false"
        item-key="title"
        class="tag-list"
        ghost-class="ghost"
        :move="checkMove"
        @start="dragging = true"
        @end="dragging = false"
    >
      <template #item="{ element }">
        <Tag @closeTag="closeTag(element)" :close="element.close" :class="[element.active ? 'active' : '']"  @clickTag="router.push(element.path)">
          <template #icon>
            <el-icon size="0.8em"><SVGIcon :name="element.icon"></SVGIcon></el-icon>
          </template>
          <template #text>
            <span style="margin-left: 0.5em;" v-text="element.title"></span>
          </template>
        </Tag>
      </template>
    </Draggable>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import {
  ElScrollbar, ElIcon, ElDivider
} from "element-plus";
import {computed, inject, onMounted, reactive, Ref, ref, unref, watch} from "vue"
import {Tag, TagInfo} from "./"
import {useRoute, useRouter} from "vue-router";
import Draggable from "vuedraggable";
import {read, write} from "@/utils/storage"
import SVGIcon from "@/components/common/SVGIcon.vue";
import {RouteMetaRecord} from "@/router";
import {themeKey} from "@/config/app.keys";
import {useTitle} from "@vueuse/core";

const theme = inject<Ref<ThemeConfig>>(themeKey)

const title = useTitle()
const route = useRoute();
const router = useRouter();

const dragging = ref(false);
const tags = reactive<TagInfo[]>([]);

const checkMove = (e: any, originalEvent: DragEvent) => {
  console.log("Future index: " + e.draggedContext.futureIndex);
};

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
      router.push(tags[tags.length - 1].path);
    } else {
      tags[delIdx].active = true;
      router.push(tags[delIdx].path);
    }
  } else {
    write("tags", tags);
  }
}


watch(() => unref(route).fullPath, (newPath, oldPath)=>{
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
      isNewTab = false;
    } else {
      tag.active = false;
    }
  }

  if (isNewTab) {
    const meta: RouteMetaRecord = route.meta as RouteMetaRecord;
    tags.push({
      path: newPath,
      title: meta.title,
      active: true,
      close: meta.close,
      icon: meta.icon,
    });
  }
  const meta: RouteMetaRecord = route.meta as RouteMetaRecord;
  title.value = meta.title

  write("tags", tags);

}, {immediate: true});

const tagBarHeight = computed(() => `${theme.value.tagBarHeight}px`)

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