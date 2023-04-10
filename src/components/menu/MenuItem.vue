<template>
  <div class="menu-item" v-if="!item.hidden">
    <div v-if="!!item.icon" style="display: flex; align-items: center">
      <SVGIcon :name="item.icon" style="width: 20px; height: 20px;" />
    </div>
    <div style="margin-left: 6px; display: flex; justify-content: space-between; width: calc(100% - 26px);">
      <div v-text="item.text"></div>
      <div style="width: 100px"></div>
      <div v-text="item.keyboard"></div>
    </div>
  </div>

</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from 'vue';
import { MenuType } from './'
import SVGIcon from "@/components/common/SVGIcon.vue";

export default defineComponent({
  components: { SVGIcon },
  props: {
    item: {
      type: Object as PropType<MenuType>,
      required: true,
    },
  },
  setup(props, ctx) {
    console.log('menu item props', props);
  },
})
</script>

<style scoped>
.menu-item {
  box-sizing: border-box;
  padding: 6px 16px;
  border-bottom: 1px solid var(--el-border-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 100%;
}

.menu-item:hover {
  background-color: var(--el-menu-hover-bg-color);
}
</style>