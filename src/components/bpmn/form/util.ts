import BpmnModeler from "bpmn-js/lib/Modeler";

export class BpmnUtil {
  private bpmnModeler: BpmnModeler;

  constructor(bpmnModeler: BpmnModeler) {
    this.bpmnModeler = bpmnModeler;
  }

  public updateProperty(element: any, properties: Record<string, string>) {
    const modeling = this.bpmnModeler.get("modeling")
    modeling.updateProperties(element, properties)
  }


  public static hasAttrIgnorePrefix(attrs: Record<string, string>, suffix: string) {
    const keys = Object.keys(attrs)
    for (let key of keys) {
      if (key.endsWith(suffix)) {
        return true
      }
    }
    return false
  }

  public static getAttrIgnorePrefix(attrs: Record<string, string>, suffix: string) {
    const keys = Object.keys(attrs)
    for (let key of keys) {
      if (key.endsWith(suffix)) {
        return attrs[key]
      }
    }
    return null
  }

}

