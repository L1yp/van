import BpmnModeler from "bpmn-js/lib/Modeler";
import { ShallowRef, unref } from "vue";

export class BpmnUtil {
  private bpmnModeler: ShallowRef<BpmnModeler>;

  constructor(bpmnModeler: ShallowRef<BpmnModeler>) {
    this.bpmnModeler = bpmnModeler;
  }

  public isMultiInstanceUserTask(element: any): boolean {
    const bo = unref(element)?.businessObject
    return !!bo?.loopCharacteristics
  }

  public updateProperty(element: any, properties: Record<string, any>) {
    const modeling = unref(this.bpmnModeler).get("modeling") as any
    modeling.updateProperties(unref(element), properties)
  }

  public updateModelingProperty(element: any, attrInstance: any, properties: Record<string, any>) {
    const modeling = this.bpmnModeler.value.get("modeling") as any
    modeling.updateModdleProperties(unref(element), attrInstance, properties)
  }

  public getProcessKey(): string {
    const registry = unref(this.bpmnModeler).get("elementRegistry") as any
    // @ts-ignore
    const root = registry.find(it => it.type === 'bpmn:Process')
    return root.id
  }

}

