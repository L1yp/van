import { ComponentLoader } from "@textbus/browser";
import {
  ComponentInitData,
  ContentType,
  defineComponent,
  Slot,
  useSlots,
  VElement
} from "@textbus/core";

/**
 * 自定义root component
 */

export const ExpressionRoot = defineComponent({
  type: ContentType.InlineComponent,
  name: "ExpressionRoot",
  setup(data: ComponentInitData<void>) {
    const slots = useSlots((data === null || data === void 0 ? void 0 : data.slots) || [new Slot([
      ContentType.Text,
      ContentType.InlineComponent
    ])]);
    if (!slots.length) {
      slots.push(new Slot([
        ContentType.Text,
        ContentType.InlineComponent
      ]));
    }
    return {
      render(isOutputMode, slotRender) {
        // @ts-ignore
        return slotRender(slots.get(0), () => {
          return VElement.createElement("span", null);
        });
      }
    }
  }
})

export const expressionRootLoader: ComponentLoader =  {
  match(element) {
    return element.tagName === 'SPAN';
  },
  read(element, injector, slotParser) {
    const slot = slotParser(new Slot([
      ContentType.InlineComponent
    ]), element);
    return ExpressionRoot.createInstance(injector, {
      slots: [slot]
    });
  }
}