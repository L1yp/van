import {
  jsx, VElement
} from '@textbus/core'

/**
 * html string to VElement
 * @param {String} html html string
 * @returns {VElement} result
 */
export function transformToVElementLang(html: string): VElement[] {
  const parser = new DOMParser();
  const root = parser.parseFromString(html, "text/html");

  const result: VElement[] = []

  for (const child of Array.from(root.body.children)) {
    const children: VElement[] = []
    const attrs = NamedNodeMapToObject(child.attributes);
    transformToVElement(child, children);
    const elem = VElement.createElement(child.tagName, attrs, children)
    result.push(elem)
  }

  return result;

}

/**
 *
 * @param elem DOM
 */
function transformToVElement(elem: Element | Node, children: Array<VElement | string>) {
  const childs = elem.childNodes;
  childs.forEach(child => {
    if (child.nodeType === 3) {
      // Text
      child.nodeValue && children.push(child.nodeValue);
    } else if (child.nodeType === 1) {
      // Element
      // FIXME: check child type
      const attrs = NamedNodeMapToObject((child as HTMLElement).attributes)
      const nodes: VElement[] = [];
      transformToVElement(child, nodes);
      const velem = VElement.createElement(child.nodeName, attrs, nodes);
      children.push(velem);
    }
  })

}

/**
 * transfer
 * @param {NamedNodeMap} attributes attrs
 * @returns {Object} a
 */
function NamedNodeMapToObject(attributes: NamedNodeMap): object {
  const obj: Record<string, any> = {};
  for (let i = 0; i < attributes.length; i++) {
    const element = attributes[i];
    obj[element.name] = element.value;
  }
  return obj;
}