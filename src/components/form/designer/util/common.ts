import {CandidateComponentConfig, ComponentConfig, SelectConfig} from "@/components/form/types";

export function genId(): string {
  return Math.random().toString().replaceAll("0.", "");
}

export function transCloneComponent(original: CandidateComponentConfig) {
  const newItem: ComponentConfig = {
    id: 'field_' + genId().substring(0, 6),
    component: original.component,
    category: original.category,
    formItemAttrs: original.formItemAttrs ? JSON.parse(JSON.stringify(original.formItemAttrs)) : undefined,
    attrs: original.attrs ? JSON.parse(JSON.stringify(original.attrs)) : undefined,
    children: JSON.parse(JSON.stringify(original.children || [])),
    key: 1,
  }

  newItem.attrs.id = newItem.id

  return newItem;
}