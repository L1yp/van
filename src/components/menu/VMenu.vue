<template>
  <div ref="menuRef" style="position: fixed; background-color: var(--el-bg-color); border: 1px solid var(--el-border-color);" v-show="visible">
    <MenuItem
      v-for="menuItem in items"
      :key="menuItem.id"
      :item="menuItem"
      @click.stop="ev => handleClickMenu(menuItem, ev)"
    />
  </div>

</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref, shallowRef } from "vue";
import MenuItem from "./MenuItem.vue";
import { computePosition, flip, offset, shift, useFloating } from "@floating-ui/vue";
import { Point } from "@/components/menu/index";
import { MenuType } from "@/components/menu/index";

export default defineComponent({
  components: {
    MenuItem,
  },
  emits: {
    menuClick: (item: MenuType, ev: PointerEvent, userData?: any) => true,
  },
  expose: ['showMenu', 'hideMenu'],
  props: {
    items: {
      type: Array as PropType<MenuType[]>,
      required: true,
      default: [],
    },
    position: {
      type: Object as PropType<Point>,
      required: true,
    },
    userData: {
      type: [Object, Array, String, Number] as PropType<any>,
      required: false,
    },
  },
  setup(props, ctx) {

    console.log('props', props);

    const referenceElem = computed(() => {
      return {
        getBoundingClientRect() {
          return {
            width: 0,
            height: 0,
            x: props.position.x,
            y: props.position.y,
            left: props.position.x,
            right: props.position.x,
            top: props.position.y,
            bottom: props.position.y
          }
        },
      }
    })



    const visible = ref(false)

    const menuRef = shallowRef<HTMLDivElement>()

    onMounted(() => {
      useFloating(referenceElem, menuRef)
    })

    function showMenu() {
      computePosition(referenceElem.value, menuRef.value!, {
        placement: "right-start",
        middleware: [offset(), flip(), shift()]
      }).then(({ x, y }) => {
        Object.assign(menuRef.value!.style, {
          top: `${y}px`,
          left: `${x}px`
        });
      });

      visible.value = true
    }

    function hideMenu() {
      visible.value = false
    }

    function handleClickMenu(menuItem: MenuType, ev: PointerEvent) {
      hideMenu()
      ctx.emit('menuClick', menuItem, ev, props.userData)
    }

    return {
      menuRef, visible, showMenu, hideMenu, handleClickMenu,
    }

  },



})
</script>

<style scoped>

</style>