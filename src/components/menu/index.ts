import { Component } from "vue";

export interface MenuOption {
  text: string
  icon?: string | Component
  command: string
  disabled?: boolean
  [key: string]: any
}

export interface Point {
  x: number
  y: number
}
