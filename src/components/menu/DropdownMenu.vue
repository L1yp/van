<template>

  <div ref="menuRef" class="menu-wrapper" :style="{ 'z-index': zIndex }" v-show="visible">
    <el-scrollbar>
      <ul class="el-dropdown-menu" role="menu" style="outline: none;">
        <li
          v-for="option in options"
          :key="option.command"
          class="el-dropdown-menu__item"
          :class="option.disabled ? 'is-disabled' : undefined"
          role="menuitem"
          @click="!option.disabled && handleItemClick($event, option)"
        >
          <el-icon v-if="!!option.icon">
            <component :is="option.icon as string" />
          </el-icon>
          {{ option.text }}
        </li>
      </ul>
    </el-scrollbar>
  </div>

</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, shallowRef } from "vue";
import { MenuOption } from "@/components/menu/index";
import { ElIcon, ElScrollbar } from 'element-plus'
import { computePosition, flip, offset, shift, useFloating } from "@floating-ui/vue";


export default defineComponent({
  components: {
    ElScrollbar, ElIcon,
  },
  props: {
    options: {
      type: Array as PropType<MenuOption[]>,
      required: true,
    },
    zIndex: {
      type: Number as PropType<number>,
      required: false,
      default: 3000,
    },
    x: {
      type: Number as PropType<number>,
      required: true,
    },
    y: {
      type: Number as PropType<number>,
      required: true,
    },
    hideOnClick: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: true,
    }
  },
  emits: {
    itemClick: (item: MenuOption, ev: PointerEvent) => true,
  },
  setup(props, { expose, emit }) {
    const menuRef = shallowRef<HTMLDivElement>()
    const visible = ref(false)
    const referenceElem = computed(() => {
      return {
        getBoundingClientRect() {
          return {
            width: 0,
            height: 0,
            x: props.x,
            y: props.y,
            left: props.x,
            right: props.x,
            top: props.y,
            bottom: props.y
          }
        },
      }
    })
    useFloating(referenceElem, menuRef)

    function show() {
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

    function hide() {
      visible.value = false
    }

    expose({
      show, hide,
    })

    function handleItemClick(ev: PointerEvent, option: MenuOption) {
      emit('itemClick', option, ev)
      if (props.hideOnClick) {
        visible.value = false
      }
    }



    return {
      menuRef, visible, show, hide, handleItemClick,
    }
  },
})

</script>

<style scoped>
.menu-wrapper {
  --el-dropdown-menu-box-shadow: var(--el-box-shadow-light);
  --el-dropdown-menuItem-hover-fill: var(--el-color-primary-light-9);
  --el-dropdown-menuItem-hover-color: var(--el-color-primary);
  --el-dropdown-menu-index: 10;

  position: fixed;
  box-shadow: var(--el-dropdown-menu-box-shadow);
  border: 1px solid var(--el-border-color-light);
}

.el-dropdown-menu__item:not(.is-disabled):hover {
  background-color: var(--el-dropdown-menuItem-hover-fill);
  color: var(--el-dropdown-menuItem-hover-color);
}
</style>