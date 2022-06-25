import {CandidateComponentConfig, ComponentConfig, SelectConfig} from "@/components/form/types";

export function genId(): string {
  return Math.random().toString().replaceAll("0.", "");
}

export function transCloneComponent(original: CandidateComponentConfig) {
  const newItem: ComponentConfig = {
    id: genId(),
    component: original.component,
    category: original.category,
    formItemAttrs: original.formItemAttrs ? JSON.parse(JSON.stringify(original.formItemAttrs)) : undefined,
    attrs: original.attrs ? JSON.parse(JSON.stringify(original.attrs)) : undefined,
    children: JSON.parse(JSON.stringify(original.children || [])),
    key: 1,
  }

  if (original.component === 'el-select') {
    (newItem as SelectConfig).options = JSON.parse(JSON.stringify(original.options))
    console.log("newItem", newItem)
    return newItem;
  }

  console.log("newItem", newItem)
  return newItem;
}