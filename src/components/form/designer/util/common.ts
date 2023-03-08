export function genId(): string {
  return Math.random().toString().replaceAll("0.", "");
}

export function transCloneComponent(original: CandidateComponentConfig) {
  let children: ComponentConfig[] = []
  if (original.children?.length) {
    children = original.children.map(it => transCloneComponent(it))
  }
  const newItem: ComponentConfig = {
    id: original.component + '_' + Number(genId()).toString(36),
    component: original.component,
    category: original.category,
    formItemAttrs: original.formItemAttrs ? JSON.parse(JSON.stringify(original.formItemAttrs)) : undefined,
    attrs: original.attrs ? JSON.parse(JSON.stringify(original.attrs)) : undefined,
    children,
    key: 1,
  }

  return newItem;
}