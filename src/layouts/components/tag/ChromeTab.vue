<template>
  <div class="tag-item" @click.stop.prevent="handleClick">
    <div v-text="props.title"></div>
  </div>
</template>

<script lang="ts" setup>
import {genId} from "@/components/form/designer/util/common";

interface Props {
  title: string
}

const props = defineProps<Props>()

const id = genId()

function handleClick(e: PointerEvent) {
  console.log('click e', e)
  const div = e.target as HTMLDivElement
  div.classList.toggle('active')
}

</script>

<style scoped>
.tag-item {
  position: relative;
  display: flex;
  align-items: center;
  padding: 6px 20px;
  background-color: #e7eaec;
  color: #585c5f;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  cursor: pointer;
  z-index: 2;
}


.tag-item:hover{
  background-color: #f0f3f5;
  z-index: 3;
}

.tag-item.active {
  background-color: #ffffff;
  z-index: 4;
}


.tag-item:hover {
  background-color: #f0f3f5;
  z-index: 3;
}

.tag-item.active {
  background-color: #ffffff;
  z-index: 4;
}



.tag-item:hover::before,
.tag-item.active::before {
  left: -100%;
  border-radius: 0 0 10px 0;
  opacity: 1;
}

.tag-item:hover::after,
.tag-item.active::after {
  right: -100%;
  border-radius: 0 0 0 10px;
  opacity: 1;
}

.tag-item.active::before,
.tag-item.active:hover::before
{
  box-shadow: 14px 0.25em 0 -4px #ffffff;
}

.tag-item.active::after,
.tag-item.active:hover::after
{
  box-shadow: -14px 0.25em 0 -4px #ffffff;
}

.tag-item:hover::before {
  box-shadow: 14px 0.25em 0 -4px #f0f3f5;
}

.tag-item:hover::after {
  box-shadow: -14px 0.25em 0 -4px #f0f3f5;
}


.tag-item::before,
.tag-item::after {
  visibility: visible;
  content: " ";
  pointer-events: none;
  position: absolute;
  display: block;
  height: 80%;
  width: 100%;
  bottom: 0;
  z-index: -1;
}

.tag-item:not(:hover, .active, :first-child) {
  box-shadow: -8px 0 0 -7px rgb(0 0 0 / 25%);
}

</style>
