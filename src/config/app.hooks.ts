import { inject } from "vue";
import { bpmnModelerKey, bpmnSelectedElemKey, menuOptionsKey, userInfoKey, userMapKey } from "@/config/app.keys";

export function useMenuOptions() {
  return inject(menuOptionsKey)!
}

export function useUserInfo() {
  return inject(userInfoKey)!
}

export function useUserMap() {
  return inject(userMapKey)!
}

export function useBpmnSelectedElem() {
  return inject(bpmnSelectedElemKey)!
}

export function useBpmnModeler() {
  return inject(bpmnModelerKey)!
}

