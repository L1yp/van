import { assign } from "min-dash";

export default class CustomContextPad {

  static $inject: string[]

  create: any
  elementFactory: any
  translate: any
  autoPlace: any
  modeling: any

  constructor(config, contextPad, create, elementFactory, injector, translate, modeling) {
    this.create = create
    this.elementFactory = elementFactory
    this.translate = translate
    if (config.autoPlace !== false) {
      this.autoPlace = injector.get('autoPlace', false)
    }
    this.modeling = modeling
    contextPad.registerProvider(this)
    console.log('init pad');
  }



  public getContextPadEntries(element) {
    console.log('getContextPadEntrier', element);
    const type = element.type
    if (type === 'bpmn:StartEvent') {

      const create = this.create
      const elementFactory = this.elementFactory
      const autoPlace = this.autoPlace

      function appendStart(event, element) {

        const shape = elementFactory.createShape({ type: 'bpmn:UserTask' });
        create.start(event, shape, {
          source: element
        });
      }
  


      var append = autoPlace ? function(event, element) {
        var shape = elementFactory.createShape({ type: 'bpmn:UserTask' });

        autoPlace.append(element, shape);
      } : appendStart;
      return {
        'append.append-user-task': {
          group: 'model',
          title: 'Append UserTask',
          className: 'bpmn-icon-user-task',
          action: {
            click: append,
            dragstart: appendStart,
          }
        },
        // 'append.end-event': undefined,
        // 'append.gateway': undefined,
        // 'append.intermediate-event': undefined,
        // 'append.text-annotation': undefined,
        // replace: undefined,
      }
    }
  }

}

CustomContextPad.$inject = [
  'config',
  'contextPad',
  'create',
  'elementFactory',
  'injector',
  'translate',
  'modeling',
]