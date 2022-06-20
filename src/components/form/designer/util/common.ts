import { CandidateComponentConfig, ComponentConfig } from "@/components/form/types";

export function genId(): string {
  return Math.random().toString().replaceAll("0.", "");
}

export function transCloneComponent(original: CandidateComponentConfig) {
  const newItem: ComponentConfig = {
    id: genId(),
    component: original.component,
    category: original.category,
    formItemAttrs: original.formItemAttrs ? JSON.parse(JSON.stringify(original.formItemAttrs)) : undefined,
    attrs: original.attrs,
    children: JSON.parse(JSON.stringify(original.children || [])),
  }
  console.log("newItem", newItem)
  return newItem;
}