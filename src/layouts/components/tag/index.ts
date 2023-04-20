import TagBar from "./TagBar.vue"
import Tag from "./TagItem.vue"
import { Component } from "vue";

export interface TagInfo {
  path: string
  fullPath: string
  title: string
  active: boolean
  close: boolean
  icon?: string | Component
}

export {Tag, TagBar}