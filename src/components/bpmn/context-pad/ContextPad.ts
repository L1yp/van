export default class CustomContextPad {
  constructor(config, contextPad, create, elementFactory, injector, translate) {
    this.create = create
    this.elementFactory = elementFactory
    this.translate = translate
    if (config.autoPlace !== false) {
      this.autoPlace = injector.get('autoPlace', false)
    }
    contextPad.registerProvider(this)
    console.log('init pad');
  }


  getContextPadEntrier(element) {
    console.log('getContextPadEntrier', element);
  }

}

CustomContextPad.$inject = [
  'config',
  'contextPad',
  'create',
  'elementFactory',
  'injector',
  'translate'
]