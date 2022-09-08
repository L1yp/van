import type { CSSProperties, InjectionKey } from 'vue'
import type { ThumbProps } from './thumb'
import { isString } from '@vue/shared'
import { isNumber } from '@vueuse/core'

export const GAP = 4 // top 2 + bottom 2 of bar instance

export const BAR_MAP = {
  vertical: {
    offset: 'offsetHeight',
    scroll: 'scrollTop',
    scrollSize: 'scrollHeight',
    size: 'height',
    key: 'vertical',
    axis: 'Y',
    client: 'clientY',
    direction: 'top',
  },
  horizontal: {
    offset: 'offsetWidth',
    scroll: 'scrollLeft',
    scrollSize: 'scrollWidth',
    size: 'width',
    key: 'horizontal',
    axis: 'X',
    client: 'clientX',
    direction: 'left',
  },
} as const

export function addUnit(value?: string | number, defaultUnit = 'px') {
  if (!value) return ''
  if (isString(value)) {
    return value
  } else if (isNumber(value)) {
    return `${value}${defaultUnit}`
  }
}

export const renderThumbStyle = ({
  move,
  size,
  bar,
}: Pick<ThumbProps, 'move' | 'size'> & {
  bar: typeof BAR_MAP[keyof typeof BAR_MAP]
}): CSSProperties => ({
  [bar.size]: size,
  transform: `translate${bar.axis}(${move}%)`,
})

export interface scrollbarContext {
  scrollbarElement: HTMLDivElement
  wrapElement: HTMLDivElement
}

export const scrollbarContextKey: InjectionKey<scrollbarContext> = Symbol(
  'scrollbarContextKey'
)