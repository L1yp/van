import { ElementLike } from "diagram-js/lib/model/Types";
import ElementRegistry from 'diagram-js/lib/core/ElementRegistry'
import { Root, Shape } from "bpmn-js/lib/model/Types";

export class BpmnLintError {
  public element: ElementLike | null
  public message: string

  constructor(element: ElementLike | null, message: string) {
    this.element = element
    this.message = message
  }



}



abstract class BpmnLintBase {

  protected registry: ElementRegistry
  protected root: Shape

  protected constructor(registry: ElementRegistry, root: Shape) {
    this.registry = registry
    this.root = root
  }

  public abstract validate(): boolean

  protected error: BpmnLintError | undefined

  public getError(): BpmnLintError | undefined {
    return this.error
  }

}

/**
 * 用户任务 未填名称
 */
class NoLabelUserTaskValidator extends BpmnLintBase {

  public constructor(registry: ElementRegistry, root: Shape) {
    super(registry, root)
  }

  validate(): boolean {
    const userTasks = this.registry.filter(it => it.type === 'bpmn:UserTask')
    const noLabelUserTask = userTasks.find(it => !it.label && !it.businessObject.name)
    if (noLabelUserTask) {
      this.error = new BpmnLintError(noLabelUserTask, '请双击节点输入节点名称')
      return false;
    }
    for (const userTask of userTasks) {
      for (const out of userTask.outgoing) {
        if (!out.businessObject.name) {
          this.error = new BpmnLintError(out, '用户出口必须填写标签')
          return false;
        }
      }
    }
    return true
  }
}

/**
 * 禁止一个userTask有多个非条件出口，多个出口必须是 条件流且名称必填
 */
class WorkflowOutcomeValidator extends BpmnLintBase {

  public constructor(registry: ElementRegistry, root: Shape) {
    super(registry, root)
  }

  validate(): boolean {
    const userTasks = this.registry.filter(it => it.type === 'bpmn:UserTask').filter(it => it.outgoing?.length > 1)
    for (const userTask of userTasks) {
      for (let connection of userTask.outgoing) {
        if (!connection?.businessObject?.conditionExpression) {
          this.error = new BpmnLintError(connection, '请调整为条件流')
          return false
        }
        if (!connection.label && !connection.businessObject.name) {
          this.error = new BpmnLintError(connection, '条件流必须填写名称')
          return false
        }
      }
    }

    return true
  }

}

/**
 * 网关必须存在出口
 */
class GatewayOutgoingValidator extends BpmnLintBase {

  public constructor(registry: ElementRegistry, root: Shape) {
    super(registry, root)
  }

  validate(): boolean {
    const gateways = this.registry.filter(it => it.type === 'bpmn:ExclusiveGateway')
    const gateway = gateways.find(it => !it.outgoing?.length)
    if (gateway) {
      this.error = new BpmnLintError(gateway, '网关无出口')
      return false
    }
    return true
  }

}

/**
 * 多实例任务校验
 */
class MultiUserTaskValidator extends BpmnLintBase {
  public constructor(registry: ElementRegistry, root: Shape) {
    super(registry, root)
  }

  validate(): boolean {
    const userTasks = this.registry.filter(it => it.type === 'bpmn:UserTask').filter(it => !!it.businessObject.loopCharacteristics)
    if (userTasks?.length) {
      console.log('multi userTask valid')
      for (const userTask of userTasks) {
        if (userTask.outgoing?.length < 2) {
          this.error = new BpmnLintError(userTask, '会签节点必须出口必须大于1')
          return false
        }
      }
    }
    return true
  }



}

/**
 * 表单校验
 */
class FormValidator extends BpmnLintBase {
  public constructor(registry: ElementRegistry, root: Shape) {
    super(registry, root)
  }

  validate(): boolean {
    const startEvents = this.registry.filter(it => it.type === 'bpmn:StartEvent')
    console.log('startEvents', startEvents)
    if (startEvents?.length === 1) {
      const startEvent = startEvents[0]
      if (!startEvent.businessObject.formKey) {
        this.error = new BpmnLintError(startEvent, '启动节点未配置表单')
        return false
      }
    } else if (startEvents.every(it => it.parent === this.root)) {
      this.error = new BpmnLintError(null, '必须存在有且一个启动节点')
      return false
    }

    const userTasks = this.registry.filter(it => it.type === 'bpmn:UserTask')
    if (userTasks?.length) {
      console.log('multi userTask valid')
      for (const userTask of userTasks) {
        if (!userTask.businessObject.formKey) {
          this.error = new BpmnLintError(userTask, '此节点未配置表单')
          return false
        }
      }
    }
    return true
  }



}

export function validate(registry: ElementRegistry, root: Shape): BpmnLintError | undefined {
  const validators = [
    new NoLabelUserTaskValidator(registry, root),
    new WorkflowOutcomeValidator(registry, root),
    new GatewayOutgoingValidator(registry, root),
    new MultiUserTaskValidator(registry, root),
    new FormValidator(registry, root),
  ]
  for (let validator of validators) {
    if (!validator.validate()) {
      return validator.getError()
    }
  }
}
