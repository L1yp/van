import TagBar from "./TagBar.vue"
import Tag from "./TagItem.vue"

export interface TagInfo {
  path: string;
  title: string;
  active: boolean;
  close: boolean;
  icon: string;
}

export {Tag, TagBar}