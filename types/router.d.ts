import 'vue-router';
import { Component } from "vue";

declare module 'vue-router' {
  interface RouteMeta {
    keepAlive?: boolean
    icon?: string | Component
    componentName: string
    title: string
    closeable: boolean
    menuOption?: MenuView
  }
}