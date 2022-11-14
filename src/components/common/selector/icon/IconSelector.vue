<template>

  <el-scrollbar height="150px" style="width: 150px">
    <div class="selector-wrapper">
      <div v-for="icon in iconNames" :key="icon" :title="icon" class="container">
        <SVGIcon :name="icon" style="width: 20px; height: 20px"></SVGIcon>
      </div>
    </div>
  </el-scrollbar>


</template>

<script lang="ts" setup>
import {ref} from "vue"
import {ElScrollbar} from "element-plus"
import SVGIcon from "../../SVGIcon.vue"

const icons: Record<
  string,
  {
    [key: string]: any
  }
  > = import.meta.globEager("../../../../assets/icons/*.svg")

const iconNames: string[] = [];
for (const icon in icons) {
  const iconPath = icon.toString();
  const idx = iconPath.lastIndexOf("/")
  if (idx < 0) continue;
  const commaIdx = iconPath.lastIndexOf(".")
  if (commaIdx < 0) continue;

  const iconName = iconPath.substring(idx + 1, commaIdx)

  iconNames.push(iconName);
}

console.log(iconNames)
</script>

<style scoped>
.selector-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 150px;

  background-color: var(--el-bg-color);


}

.container {
  width: 30px;
  height: 30px;
  padding: 5px;
  box-sizing: border-box;
  cursor: pointer;
}

.container:hover {
  background-color: var(--el-bg-color);
}

</style>