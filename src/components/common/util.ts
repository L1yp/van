import {h} from "vue";
import SVGIcon from "@/components/common/SVGIcon.vue";
/**
 * 返回图片组件实例
 * @param name
 * @param attrs
 */
export function useIcon(name: string, attrs?: Record<string, any>) {
  return h(SVGIcon, {
    name,
    ...attrs
  })
}
