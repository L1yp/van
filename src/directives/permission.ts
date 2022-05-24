import {InjectionKey, ObjectDirective, Ref} from 'vue';
import type { DirectiveBinding  } from 'vue';
import {permissionKey} from "@/config/app.keys";

export const permission: ObjectDirective = {
  mounted(el: HTMLButtonElement, binding: DirectiveBinding) {
    if (binding.value == undefined) return;
    const { action, effect, instance } = binding.value;
    console.log("permission", binding)
    const provides = binding.instance.$.appContext.provides
    const key = permissionKey as (InjectionKey<PermissionView> | string)
    if (provides && (key as string | symbol) in provides) {
      // TS doesn't allow symbol as index type
      const permissions: Ref<Set<string>> =  provides[key as string]
      if (!permissions.value.has(binding.value)) {
        // disabled
        console.log("disabled " + binding.value)
      }
    } else {
      console.error("cannot get provides or permission does not in provides")
    }

    // if (!hasPermission(action)) {
    //   if (effect == 'disabled') {
    //     el.disabled = true;
    //     el.style['disabled'] = 'disabled';
    //     el.classList.add('n-button--disabled');
    //   } else {
    //     el.remove();
    //   }
    // }
  },
};