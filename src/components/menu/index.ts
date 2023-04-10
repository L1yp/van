import { ComponentPublicInstance } from "vue";

export interface Point {
  x: number
  y: number
}

export interface MenuType {

  /**
   * 菜单标识
   */
  id: string

  /**
   * 菜单图标
   */
  icon?: string

  /**
   * 菜单文本
   */
  text: string

  keyboard: string

  hidden: boolean

}