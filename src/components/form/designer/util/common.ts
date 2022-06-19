import { CandidateComponentConfig, ComponentConfig } from "@/components/form/types";

export function genId(): string {
  return Math.random().toString().replaceAll("0.", "");
}

export function transCloneComponent(original: CandidateComponentConfig) {
  const newItem: ComponentConfig = {
    id: genId(),
    component: original.component,
    formItemAttrs: JSON.parse(JSON.stringify(original.formItemAttrs)),
    attrs: original.attrs,
    children: JSON.parse(JSON.stringify(original.children || [])),
  }
  console.log("newItem", newItem)
  return newItem;
}