import ContextPadProvider, {
  Connect,
  ContextPad,
  ContextPadConfig,
  Create,
  ElementFactory,
  Modeling,
  PopupMenu,
  Rules,
  Injector,
  Translate,
  EventBus,
  ContextPadEntries,
  Element,
} from "bpmn-js/lib/features/context-pad/ContextPadProvider";
import Canvas from "diagram-js/lib/core/Canvas";
import { isAny } from "bpmn-js/lib/features/modeling/util/ModelingUtil";
import { isEventSubProcess, isExpanded } from "bpmn-js/lib/util/DiUtil";
import { getChildLanes } from "bpmn-js/lib/features/modeling/util/LaneUtil";
import { is } from "bpmn-js/lib/util/ModelUtil";
import {
  assign,
  forEach,
  isArray
} from 'min-dash';
import { ContextPadTarget } from "diagram-js/lib/features/context-pad/ContextPad";
import AutoPlace from "bpmn-js/lib/features/auto-place/BpmnAutoPlace";
import { Shape } from "bpmn-js/lib/model/Types";

export default class CustomContextPadProvider extends ContextPadProvider {

  static $inject: string[] = [
    'config.contextPad',
    'injector',
    'eventBus',
    'contextPad',
    'modeling',
    'elementFactory',
    'connect',
    'create',
    'popupMenu',
    'canvas',
    'rules',
    'translate'
  ]

  protected _contextPad: ContextPad;
  protected _modeling: Modeling;
  protected _elementFactory: ElementFactory;
  protected _connect: Connect;
  protected _create;
  protected _popupMenu;
  protected _canvas;
  protected _rules;
  protected _translate;
  protected _autoPlace;

  constructor(config: ContextPadConfig, injector: Injector, eventBus: EventBus, contextPad: ContextPad, modeling: Modeling, elementFactory: ElementFactory, connect: Connect, create: Create, popupMenu: PopupMenu, canvas: Canvas, rules: Rules, translate: Translate) {
    super(config, injector, eventBus, contextPad, modeling, elementFactory, connect, create, popupMenu, canvas, rules, translate)
    this._contextPad = contextPad
    this._modeling = modeling
    this._elementFactory = elementFactory
    this._connect = connect
    this._create = create
    this._popupMenu = popupMenu
    this._canvas = canvas
    this._rules = rules
    this._translate = translate
    if (config?.autoPlace !== false) {
      this._autoPlace = injector.get<AutoPlace>('autoPlace', false);
    }
  }

  public getContextPadEntries(element: Element): ContextPadEntries {

    const contextPad = this._contextPad
    const modeling = this._modeling
    const elementFactory = this._elementFactory
    const connect = this._connect
    const create = this._create
    const popupMenu = this._popupMenu
    const canvas = this._canvas
    const rules = this._rules
    const translate = this._translate
    const autoPlace = this._autoPlace


    const actions = {};

    if (element.type === 'label') {
      return actions;
    }

    const businessObject = element.businessObject;

    function startConnect(event: MouseEvent | TouchEvent, start: Element) {
      connect.start(event, element);
    }

    function removeElement(e: any) {
      modeling.removeElements([ element ]);
    }

    function getReplaceMenuPosition(element: ContextPadTarget) {

      const Y_OFFSET = 5;

      const diagramContainer = canvas.getContainer()
      const pad = contextPad.getPad(element).html as HTMLElement;


      const diagramRect = diagramContainer.getBoundingClientRect()
      const padRect = pad.getBoundingClientRect();

      const top = padRect.top - diagramRect.top;
      const left = padRect.left - diagramRect.left;

      const pos = {
        x: left,
        y: top + padRect.height + Y_OFFSET
      };

      return pos;
    }


    /**
     * Create an append action
     *
     * @param {string} type
     * @param {string} className
     * @param {string} [title]
     * @param {Object} [options]
     *
     * @return {Object} descriptor
     */
    function appendAction(type: string, className: string, title?: string, options?: object) {

      if (typeof title !== 'string') {
        options = title;
        title = translate('Append {type}', { type: type.replace(/^bpmn:/, '') });
      }

      function appendStart(event: any, element: any) {

        const shape = elementFactory.createShape(assign({ type: type }, options));
        create.start(event, shape, {
          source: element
        });
      }


      const append = autoPlace ? function(event: MouseEvent | TouchEvent, element: Element) {
        const shape = elementFactory.createShape(assign({ type: type }, options));

        // @ts-ignore
        autoPlace.append(element, shape);
      } : appendStart;


      return {
        group: 'model',
        className: className,
        title: title,
        action: {
          dragstart: appendStart,
          click: append
        }
      };
    }

    /**
     * Create an append action
     *
     * @param {string} group
     * @param {string} type
     * @param {string} className
     * @param {string} [title]
     * @param {Object} [options]
     *
     * @return {Object} descriptor
     */
    function appendGroupAction(group: string, type: string, className: string, title?: string, options?: object) {

      if (typeof title !== 'string') {
        options = title;
        title = translate('Append {type}', { type: type.replace(/^bpmn:/, '') });
      }

      function appendStart(event: TouchEvent | MouseEvent, element: Element) {

        const shape = elementFactory.createShape(assign({ type: type }, options));
        create.start(event, shape, {
          source: element
        });
      }


      const append = autoPlace ? function(event: TouchEvent | MouseEvent, element: Element) {
        const shape = elementFactory.createShape(assign({ type: type }, options));

        // @ts-ignore
        autoPlace.append(element, shape);
      } : appendStart;


      return {
        group,
        className: className,
        title: title,
        action: {
          dragstart: appendStart,
          click: append
        }
      };
    }


    function splitLaneHandler(count: number) {

      return function(event: TouchEvent | MouseEvent, element: Shape) {

        // actual split
        modeling.splitLane(element, count);

        // refresh context pad after split to
        // get rid of split icons
        contextPad.open(element, true);
      };
    }


    if (isAny(businessObject, [ 'bpmn:Lane', 'bpmn:Participant' ]) && isExpanded(element)) {

      const childLanes = getChildLanes(element as Shape);

      assign(actions, {
        'lane-insert-above': {
          group: 'lane-insert-above',
          className: 'bpmn-icon-lane-insert-above',
          title: translate('Add Lane above'),
          action: {
            click: function(event: TouchEvent | MouseEvent, element: Shape) {
              modeling.addLane(element, 'top');
            }
          }
        }
      });

      if (childLanes.length < 2) {

        if (element.height >= 120) {
          assign(actions, {
            'lane-divide-two': {
              group: 'lane-divide',
              className: 'bpmn-icon-lane-divide-two',
              title: translate('Divide into two Lanes'),
              action: {
                click: splitLaneHandler(2)
              }
            }
          });
        }

        if (element.height >= 180) {
          assign(actions, {
            'lane-divide-three': {
              group: 'lane-divide',
              className: 'bpmn-icon-lane-divide-three',
              title: translate('Divide into three Lanes'),
              action: {
                click: splitLaneHandler(3)
              }
            }
          });
        }
      }

      assign(actions, {
        'lane-insert-below': {
          group: 'lane-insert-below',
          className: 'bpmn-icon-lane-insert-below',
          title: translate('Add Lane below'),
          action: {
            click: function(event: TouchEvent | MouseEvent, element: Shape) {
              modeling.addLane(element, 'bottom');
            }
          }
        }
      });

    }

    if (is(businessObject, 'bpmn:FlowNode')) {

      if (is(businessObject, 'bpmn:EventBasedGateway')) {

        assign(actions, {
          'append.receive-task': appendAction(
            'bpmn:ReceiveTask',
            'bpmn-icon-receive-task',
            translate('Append ReceiveTask')
          ),
          'append.message-intermediate-event': appendAction(
            'bpmn:IntermediateCatchEvent',
            'bpmn-icon-intermediate-event-catch-message',
            translate('Append MessageIntermediateCatchEvent'),
            { eventDefinitionType: 'bpmn:MessageEventDefinition' }
          ),
          'append.timer-intermediate-event': appendAction(
            'bpmn:IntermediateCatchEvent',
            'bpmn-icon-intermediate-event-catch-timer',
            translate('Append TimerIntermediateCatchEvent'),
            { eventDefinitionType: 'bpmn:TimerEventDefinition' }
          ),
          'append.condition-intermediate-event': appendAction(
            'bpmn:IntermediateCatchEvent',
            'bpmn-icon-intermediate-event-catch-condition',
            translate('Append ConditionIntermediateCatchEvent'),
            { eventDefinitionType: 'bpmn:ConditionalEventDefinition' }
          ),
          'append.signal-intermediate-event': appendAction(
            'bpmn:IntermediateCatchEvent',
            'bpmn-icon-intermediate-event-catch-signal',
            translate('Append SignalIntermediateCatchEvent'),
            { eventDefinitionType: 'bpmn:SignalEventDefinition' }
          )
        });
      } else

      if (isEventType(businessObject, 'bpmn:BoundaryEvent', 'bpmn:CompensateEventDefinition')) {

        assign(actions, {
          'append.compensation-activity':
            appendAction(
              'bpmn:Task',
              'bpmn-icon-task',
              translate('Append compensation activity'),
              {
                isForCompensation: true
              }
            )
        });
      } else

      if (!is(businessObject, 'bpmn:EndEvent') &&
        !businessObject.isForCompensation &&
        !isEventType(businessObject, 'bpmn:IntermediateThrowEvent', 'bpmn:LinkEventDefinition') &&
        !isEventSubProcess(businessObject)) {

        assign(actions, {
          'append.end-event': appendAction(
            'bpmn:EndEvent',
            'bpmn-icon-end-event-none',
            translate('Append EndEvent')
          ),
          'append.gateway': appendAction(
            'bpmn:ExclusiveGateway',
            'bpmn-icon-gateway-xor',
            translate('Append Gateway')
          ),
          'append.append-task': appendAction(
            'bpmn:UserTask',
            'bpmn-icon-user-task',
            translate('Append UserTask')
          ),
          // 'append.intermediate-event': appendAction(
          //   'bpmn:IntermediateThrowEvent',
          //   'bpmn-icon-intermediate-event-none',
          //   translate('Append Intermediate/Boundary Event')
          // )
        });
      }
    }

    if (!popupMenu.isEmpty(element, 'bpmn-replace')) {

      // Replace menu entry
      assign(actions, {
        'replace': {
          group: 'edit',
          className: 'bpmn-icon-screw-wrench',
          title: translate('Change type'),
          action: {
            click: function(event: MouseEvent, element: Shape) {

              const position = assign(getReplaceMenuPosition(element), {
                cursor: { x: event.x, y: event.y }
              });

              popupMenu.open(element, 'bpmn-replace', position);
            }
          }
        }
      });
    }

    if (
      isAny(businessObject, [
        'bpmn:FlowNode',
        'bpmn:InteractionNode',
        'bpmn:DataObjectReference',
        'bpmn:DataStoreReference',
      ])
    ) {
      assign(actions, {
        'append.text-annotation': appendGroupAction(
          'connect',
          'bpmn:TextAnnotation',
          'bpmn-icon-text-annotation'
        ),
        'connect': {
          group: 'connect',
          className: 'bpmn-icon-connection-multi',
          title: translate(
            'Connect using ' +
            (businessObject.isForCompensation
              ? ''
              : 'Sequence/MessageFlow or ') +
            'Association'
          ),
          action: {
            click: startConnect,
            dragstart: startConnect,
          },
        },
      });
    }

    if (is(businessObject, 'bpmn:TextAnnotation')) {
      assign(actions, {
        'connect': {
          group: 'connect',
          className: 'bpmn-icon-connection-multi',
          title: translate('Connect using Association'),
          action: {
            click: startConnect,
            dragstart: startConnect,
          },
        },
      });
    }

    if (isAny(businessObject, [ 'bpmn:DataObjectReference', 'bpmn:DataStoreReference' ])) {
      assign(actions, {
        'connect': {
          group: 'connect',
          className: 'bpmn-icon-connection-multi',
          title: translate('Connect using DataInputAssociation'),
          action: {
            click: startConnect,
            dragstart: startConnect
          }
        }
      });
    }

    if (is(businessObject, 'bpmn:Group')) {
      assign(actions, {
        'append.text-annotation': appendAction('bpmn:TextAnnotation', 'bpmn-icon-text-annotation')
      });
    }

    // delete element entry, only show if allowed by rules
    let deleteAllowed = rules.allowed('elements.delete', { elements: [ element ] });

    if (isArray(deleteAllowed)) {

      // was the element returned as a deletion candidate?
      deleteAllowed = deleteAllowed[0] === element;
    }

    if (deleteAllowed) {
      assign(actions, {
        'delete': {
          group: 'edit',
          className: 'bpmn-icon-trash',
          title: translate('Remove'),
          action: {
            click: removeElement
          }
        }
      });
    }

    return actions;
  }

}


/**
 * @param {ModdleElement} businessObject
 * @param {string} type
 * @param {string} eventDefinitionType
 *
 * @return {boolean}
 */
function isEventType(businessObject: any, type: string, eventDefinitionType: string) {

  const isType = businessObject.$instanceOf(type);
  let isDefinition = false;

  const definitions = businessObject.eventDefinitions || [];
  forEach(definitions, function(def: any) {
    if (def.$type === eventDefinitionType) {
      isDefinition = true;
    }
  });

  return isType && isDefinition;
}
