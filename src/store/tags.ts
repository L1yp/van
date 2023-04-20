import { defineStore } from "pinia";
import { TagInfo } from "@/layouts/components/tag";

export const useTagsStore = defineStore('tags', {
  state: () => ({
    tags: [] as TagInfo[],
    activeTag: null as TagInfo | null,
  }),



})