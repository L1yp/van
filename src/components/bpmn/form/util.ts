import BpmnModeler from "bpmn-js/lib/Modeler";
import { ShallowRef, unref } from "vue";
import Modeling from "bpmn-js/lib/features/modeling/Modeling";
import ElementRegistry from 'diagram-js/lib/core/ElementRegistry'

export class BpmnUtil {
  private bpmnModeler: ShallowRef<BpmnModeler | undefined>;

  constructor(bpmnModeler: ShallowRef<BpmnModeler | undefined>) {
    this.bpmnModeler = bpmnModeler;
  }

  public isMultiInstanceUserTask(element: any): boolean {
    const bo = unref(element)?.businessObject
    return !!bo?.loopCharacteristics
  }

  public updateProperty(element: any, properties: Record<string, any>) {
    const modeling = unref(this.bpmnModeler)?.get<Modeling>("modeling")
    modeling?.updateProperties(unref(element), properties)
  }

  public updateModelingProperty(element: any, attrInstance: any, properties: Record<string, any>) {
    const modeling = this.bpmnModeler.value?.get<Modeling>("modeling")
    modeling?.updateModdleProperties(unref(element), attrInstance, properties)
  }

  public getProcessKey(): string {
    const registry = unref(this.bpmnModeler)?.get<ElementRegistry>("elementRegistry")
    const root = registry?.find(it => it.type === 'bpmn:Process')
    return root?.id || ''
  }

}

