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
}

