declare module 'bpmn-js' {

  interface PkgTypePropertyNS {
    localName: string
    name: string
    prefix: string
  }

  interface PkgTypeProperty {
    isAttr?: boolean
    isId?: boolean
    isReadOnly?: boolean
    isReference?: boolean
    isVirtual?: boolean
    isMany?: boolean
    name: string
    ns: PkgTypePropertyNS
    type: string
    subsettedProperty?: string
    inherited?: boolean
  }

  interface PkgType {
    isAbstract: boolean
    name: string
    properties: PkgTypeProperty[]
    superClass: string[]
  }

  interface Pkg {
    associations: any[] // FIXME
    name: string
    prefix: string
    types: PkgType[]
    uri: string
    xml: {
      tagAlias: string
    }
  }

  interface DescriptorType {
    extends: any[] // FIXME
    isAbstract: boolean
    meta: Record<string, any> // FIXME
    name: string
    ns: PkgTypePropertyNS
    properties: PkgTypeProperty[] // FIXME
    propertiesByName: Record<string, PkgTypeProperty>
    superClass: string[]
    $pkg: Pkg
  }

  interface Descriptor {
    allTypes: DescriptorType[]
    allTypesByName: Record<string, DescriptorType>
    idProperty: PkgTypeProperty
    name: string
    ns: PkgTypePropertyNS
    properties: PkgTypeProperty[]
    propertiesByName: Record<string, PkgTypeProperty>
    $pkg: Pkg
  }

  interface Properties {
    define: (target: any, name: string, options: any) => void
    defineDescriptor: (target: any, descriptor: Descriptor) => void
    defineModel: (target: any, model: BpmnModdle) => void
    get: (target: any, name: string) => any
    set: (target: any, name: string, value: any) => void
  }


  interface Ids {
    _seed: any
    assigned: (id: string) => boolean
    claim: (id: string, element: string) => void
    unclaim: (id: string) => void
    clear: () => void
    next: (element: any) => string // return id
    nextPrefixed: (prefix: string, element: any) => string // return id
  }

  interface Factory {
    model: BpmnModdle
    properties: Properties
    ids: Ids
  }

  interface ParseResult{}
  interface ParseError{}
  interface SerializationResult{}

  class Moddle {
    create(descriptor: string, attrs: Record<string, any>): object
    createAny(name2: string, nsUri: string, properties: Record<string, any>): object
    getElementDescriptor(element: string): object
    fromXML(xml: string, typeName: string, options: Record<string, any>): Promise<ParseResult | ParseError>
    toXML(element: string, options: object): Promise<SerializationResult | Error>
  }

  class BpmnModdle extends Moddle {
    factory: Factory
    ids: any
    properties: any
    registry: any
    typeCache: any

  }

  interface ModdleElement {
    $type: string
    id: string
    name: string
    planeElement: ModdleElement[]
    $attrs: Record<string, string>
    $parent: ModdleElement
    bpmnElement: ModdleElement
    $descriptor: Descriptor
    $model: BpmnModdle
    conditionExpression?: FormalExpression
  }


  class Base {
    businessObject: ModdleElement
    label: {
      get: () => Label
      set: (label: Label) => void
    }
    labels: Label[]
    parent: Shape
    incoming: Connection[]
    outgoing: Connection[]
    type: string
    id: string
    name: string
  }

  class Shape extends Base {
    children: Base[]
    collapsed: boolean
    di: ModdleElement
    width: number
    height: number
    x: number
    y: number
    hidden: any
    isFrame: boolean
    host: {
      get: () => Shape
      set: (shape: Shape) => void
    }
    attachers: Shape[]
  }

  class Root extends Shape {

  }

  class Label {
    labelTarget: Base
  }

  class Point {
    x: number
    y: number
    original?: Point
  }

  class Connection extends Base {
    source: Base
    target: Base
    waypoints: Point[]
  }

  interface FormalExpression extends ModdleElement {
    body: string
  }


  class ElementRegistry {
    _elements: any
    _eventBus: any
    add(element: Base, gfx: SVGElement, secondaryGfx: SVGElement): void
    filter(fn: ElementRegistryFilterFunction): Base[]
    find(fn: ElementRegistryFilterFunction): Base
    forEach(fn: ElementRegistryForeachFunction): void
    get(filter: string | SVGElement): Base
    getAll(): Base[]
    getGraphics(filter: string | Base, secondary: boolean): SVGElement
    remove(element: Base): void
    updateGraphics(element: Base, gfx: SVGElement, secondary: boolean): void
    updateId(element: Base, newId: string): void
    _validateId(id: string): void
  }

  type ElementRegistryFilterFunction = (it: Base, gfx: SVGElement) => boolean
  type ElementRegistryForeachFunction = (it: Base, gfx: SVGElement) => void

  class BpmnFactory {
    _model: BpmnModdle
    create(type, attrs): any
    createDiBounds(bounds): any
    createDiEdge(semantic, attrs): any
    createDiLabel(): any
    createDiPlane(semantic, attrs): any
    createDiShape(semantic, attrs): any
    createDiWaypoint(point: Point): any
    createDiWaypoints(points: Point[]): any
    _ensureId(element: any): void
    _needsId(element: any): void
  }

}

declare module 'bpmn-js/lib/BaseViewer' {

  import Diagram from 'diagram-js/lib/Diagram'

  class BaseViewer extends Diagram {
    /**
     * A base viewer for BPMN 2.0 diagrams.
     *
     * Have a look at {@link Viewer}, {@link NavigatedViewer} or {@link Modeler} for
     * bundles that include actual features.
     *
     * @param {Object} [options] configuration options to pass to the viewer
     * @param {DOMElement} [options.container] the container to render the viewer in, defaults to body.
     * @param {string|number} [options.width] the width of the viewer
     * @param {string|number} [options.height] the height of the viewer
     * @param {Object} [options.moddleExtensions] extension packages to provide
     * @param {Array<didi.Module>} [options.modules] a list of modules to override the default modules
     * @param {Array<didi.Module>} [options.additionalModules] a list of modules to use with the default modules
     */
    constructor(options: BaseViewOptions)

    /**
     * The importXML result.
     *
     * @typedef {Object} ImportXMLResult
     *
     * @property {Array<string>} warnings
     */

    /**
     * The importXML error.
     *
     * @typedef {Error} ImportXMLError
     *
     * @property {Array<string>} warnings
     */

    /**
     * Parse and render a BPMN 2.0 diagram.
     *
     * Once finished the viewer reports back the result to the
     * provided callback function with (err, warnings).
     *
     * ## Life-Cycle Events
     *
     * During import the viewer will fire life-cycle events:
     *
     *   * import.parse.start (about to read model from xml)
     *   * import.parse.complete (model read; may have worked or not)
     *   * import.render.start (graphical import start)
     *   * import.render.complete (graphical import finished)
     *   * import.done (everything done)
     *
     * You can use these events to hook into the life-cycle.
     *
     * @param {string} xml the BPMN 2.0 xml
     * @param {ModdleElement<BPMNDiagram>|string} [bpmnDiagram] BPMN diagram or id of diagram to render (if not provided, the first one will be rendered)
     *
     * Returns {Promise<ImportXMLResult, ImportXMLError>}
     */
    importXML(xml: string, bpmnDiagram?: string | any): Promise<ImportXMLResult | ImportXMLError>

    /**
     * Import parsed definitions and render a BPMN 2.0 diagram.
     *
     * Once finished the viewer reports back the result to the
     * provided callback function with (err, warnings).
     *
     * ## Life-Cycle Events
     *
     * During import the viewer will fire life-cycle events:
     *
     *   * import.render.start (graphical import start)
     *   * import.render.complete (graphical import finished)
     *
     * You can use these events to hook into the life-cycle.
     *
     * @param {ModdleElement<Definitions>} definitions parsed BPMN 2.0 definitions
     * @param {ModdleElement<BPMNDiagram>|string} [bpmnDiagram] BPMN diagram or id of diagram to render (if not provided, the first one will be rendered)
     *
     * Returns {Promise<ImportDefinitionsResult, ImportDefinitionsError>}
     */
    importDefinitions(definitions, bpmnDiagram): Promise<ImportDefinitionsResult | ImportDefinitionsError>

    /**
     * Open diagram of previously imported XML.
     *
     * Once finished the viewer reports back the result to the
     * provided callback function with (err, warnings).
     *
     * ## Life-Cycle Events
     *
     * During switch the viewer will fire life-cycle events:
     *
     *   * import.render.start (graphical import start)
     *   * import.render.complete (graphical import finished)
     *
     * You can use these events to hook into the life-cycle.
     *
     * @param {string|ModdleElement<BPMNDiagram>} [bpmnDiagramOrId] id or the diagram to open
     *
     * Returns {Promise<OpenResult, OpenError>}
     */
    open(bpmnDiagramOrId: string | any): Promise<OpenResult | OpenError>

    /**
     * The saveXML result.
     *
     * @typedef {Object} SaveXMLResult
     *
     * @property {string} xml
     */

    /**
     * Export the currently displayed BPMN 2.0 diagram as
     * a BPMN 2.0 XML document.
     *
     * ## Life-Cycle Events
     *
     * During XML saving the viewer will fire life-cycle events:
     *
     *   * saveXML.start (before serialization)
     *   * saveXML.serialized (after xml generation)
     *   * saveXML.done (everything done)
     *
     * You can use these events to hook into the life-cycle.
     *
     * @param {Object} [options] export options
     * @param {boolean} [options.format=false] output formatted XML
     * @param {boolean} [options.preamble=true] output preamble
     *
     * Returns {Promise<SaveXMLResult, Error>}
     */
    saveXML(options: SaveXMLOptions): Promise<SaveXMLResult | Error>


    /**
     * The saveSVG result.
     *
     * @typedef {Object} SaveSVGResult
     *
     * @property {string} svg
     */

    /**
     * Export the currently displayed BPMN 2.0 diagram as
     * an SVG image.
     *
     * ## Life-Cycle Events
     *
     * During SVG saving the viewer will fire life-cycle events:
     *
     *   * saveSVG.start (before serialization)
     *   * saveSVG.done (everything done)
     *
     * You can use these events to hook into the life-cycle.
     *
     * @param {Object} [options]
     *
     * Returns {Promise<SaveSVGResult, Error>}
     */
    saveSVG(options?): Promise<SaveSVGResult | Error>

    get(type: string): any

    getModules(): any[]

    /**
     * Remove all drawn elements from the viewer.
     *
     * After calling this method the viewer can still
     * be reused for opening another diagram.
     *
     * @method BaseViewer#clear
     */
    clear(): void

    /**
     * Destroy the viewer instance and remove all its
     * remainders from the document tree.
     */
    destroy(): void


    /**
     * Register an event listener
     *
     * Remove a previously added listener via {@link #off(event, callback)}.
     *
     * @param {string} event
     * @param {Function} callback
     * @param {Object} target
     */
    on(event: string, callback: Function, target?: object): any


    /**
     * Register an event listener
     *
     * Remove a previously added listener via {@link #off(event, callback)}.
     *
     * @param {string} event
     * @param {number} [priority]
     * @param {Function} callback
     * @param {Object} target
     */
    on(event: string, priority: number, callback: Function, target?: object): any

    /**
     * De-register an event listener
     *
     * @param {string} event
     * @param {Function} callback
     */
    off(event: string, callback: Function)

    attachTo(parentNode): void

    getDefinitions(): any[]

    detach(): void

  }

  export default BaseViewer

  class SaveSVGResult {
    svg: string
  }

  interface SaveXMLOptions {
    /**
     * output formatted XML
     */
    format?: boolean

    /**
     * output preamble
     */
    preamble?: boolean
  }

  class SaveXMLResult {
    xml: string
  }


  class OpenResult  {
    warnings: string[]
  }

  class OpenError extends Error {
    warnings: string[]
  }

  class ImportDefinitionsResult {
    warnings: string[]
  }

  class ImportDefinitionsError extends Error {
    warnings: string[]
  }

  class ImportXMLResult {
    warnings: string[]
  }

  class ImportXMLError extends Error {
    warnings: string[]
  }


  type BaseViewOptions = {
    container: HTMLElement
    width: string | number
    height: string | number
    moddleExtensions: object
    modules: any[]
    additionalModules: any[]
  }

}

declare module 'bpmn-js/lib/Viewer' {
  import BaseViewer from "bpmn-js/lib/BaseViewer";

  class Viewer extends BaseViewer {

  }

  export default Viewer
}


declare module 'bpmn-js/lib/NavigatedViewer' {
  import Viewer from "bpmn-js/lib/Viewer";

  class NavigatedViewer extends Viewer {

  }

  export default NavigatedViewer
}

declare module 'bpmn-js/lib/BaseModeler' {

  import BaseViewer from "bpmn-js/lib/BaseViewer";

  class BaseModeler extends BaseViewer {

  }

  export default BaseModeler
}

declare module 'bpmn-js/lib/Modeler' {

  import BaseModeler from "bpmn-js/lib/BaseModeler";

  class Modeler extends BaseModeler {

    /**
     * A modeler for BPMN 2.0 diagrams.
     *
     *
     * ## Extending the Modeler
     *
     * In order to extend the viewer pass extension modules to bootstrap via the
     * `additionalModules` option. An extension module is an object that exposes
     * named services.
     *
     * The following example depicts the integration of a simple
     * logging component that integrates with interaction events:
     *
     *
     * ```javascript
     *
     * // logging component
     * function InteractionLogger(eventBus) {
     *   eventBus.on('element.hover', function(event) {
     *     console.log()
     *   })
     * }
     *
     * InteractionLogger.$inject = [ 'eventBus' ]; // minification save
     *
     * // extension module
     * var extensionModule = {
     *   __init__: [ 'interactionLogger' ],
     *   interactionLogger: [ 'type', InteractionLogger ]
     * };
     *
     * // extend the viewer
     * var bpmnModeler = new Modeler({ additionalModules: [ extensionModule ] });
     * bpmnModeler.importXML(...);
     * ```
     *
     *
     * ## Customizing / Replacing Components
     *
     * You can replace individual diagram components by redefining them in override modules.
     * This works for all components, including those defined in the core.
     *
     * Pass in override modules via the `options.additionalModules` flag like this:
     *
     * ```javascript
     * function CustomContextPadProvider(contextPad) {
     *
     *   contextPad.registerProvider(this);
     *
     *   this.getContextPadEntries = function(element) {
     *     // no entries, effectively disable the context pad
     *     return {};
     *   };
     * }
     *
     * CustomContextPadProvider.$inject = [ 'contextPad' ];
     *
     * var overrideModule = {
     *   contextPadProvider: [ 'type', CustomContextPadProvider ]
     * };
     *
     * var bpmnModeler = new Modeler({ additionalModules: [ overrideModule ]});
     * ```
     *
     * @param {Object} [options] configuration options to pass to the viewer
     * @param {DOMElement} [options.container] the container to render the viewer in, defaults to body.
     * @param {string|number} [options.width] the width of the viewer
     * @param {string|number} [options.height] the height of the viewer
     * @param {Object} [options.moddleExtensions] extension packages to provide
     * @param {Array<didi.Module>} [options.modules] a list of modules to override the default modules
     * @param {Array<didi.Module>} [options.additionalModules] a list of modules to use with the default modules
     */
    constructor(options: ModelerOptions)

    /**
     * The createDiagram result.
     *
     * @typedef {Object} CreateDiagramResult
     *
     * @property {Array<string>} warnings
     */

    /**
     * The createDiagram error.
     *
     * @typedef {Error} CreateDiagramError
     *
     * @property {Array<string>} warnings
     */

    /**
     * Create a new diagram to start modeling.
     *
     * Returns {Promise<CreateDiagramResult, CreateDiagramError>}
     */
    createDiagram(): Promise<CreateDiagramResult | CreateDiagramError>


  }

  class CreateDiagramResult {
    warnings: string[]
  }

  class CreateDiagramError {
    warnings: string[]
  }

  type ModelerOptions = {
    keyboard?: object
    container?: HTMLElement
    width?: string | number
    height?: string | number
    moddleExtensions?: object
    modules?: any[]
    additionalModules?: any[]
  }

  export default Modeler
}

declare module 'diagram-js/lib/core/EventBus' {

  class EventBus {

    _listeners: object

    /**
     * A general purpose event bus.
     *
     * This component is used to communicate across a diagram instance.
     * Other parts of a diagram can use it to listen to and broadcast events.
     *
     *
     * ## Registering for Events
     *
     * The event bus provides the {@link EventBus#on} and {@link EventBus#once}
     * methods to register for events. {@link EventBus#off} can be used to
     * remove event registrations. Listeners receive an instance of {@link Event}
     * as the first argument. It allows them to hook into the event execution.
     *
     * ```javascript
     *
     * // listen for event
     * eventBus.on('foo', function(event) {
     *
     *   // access event type
     *   event.type; // 'foo'
     *
     *   // stop propagation to other listeners
     *   event.stopPropagation();
     *
     *   // prevent event default
     *   event.preventDefault();
     * });
     *
     * // listen for event with custom payload
     * eventBus.on('bar', function(event, payload) {
     *   console.log(payload);
     * });
     *
     * // listen for event returning value
     * eventBus.on('foobar', function(event) {
     *
     *   // stop event propagation + prevent default
     *   return false;
     *
     *   // stop event propagation + return custom result
     *   return {
     *     complex: 'listening result'
     *   };
     * });
     *
     *
     * // listen with custom priority (default=1000, higher is better)
     * eventBus.on('priorityfoo', 1500, function(event) {
     *   console.log('invoked first!');
     * });
     *
     *
     * // listen for event and pass the context (`this`)
     * eventBus.on('foobar', function(event) {
     *   this.foo();
     * }, this);
     * ```
     *
     *
     * ## Emitting Events
     *
     * Events can be emitted via the event bus using {@link EventBus#fire}.
     *
     * ```javascript
     *
     * // false indicates that the default action
     * // was prevented by listeners
     * if (eventBus.fire('foo') === false) {
     *   console.log('default has been prevented!');
     * };
     *
     *
     * // custom args + return value listener
     * eventBus.on('sum', function(event, a, b) {
     *   return a + b;
     * });
     *
     * // you can pass custom arguments + retrieve result values.
     * var sum = eventBus.fire('sum', 1, 2);
     * console.log(sum); // 3
     * ```
     */
    constructor()


    /**
     * Register an event listener for events with the given name.
     *
     * The callback will be invoked with `event, ...additionalArguments`
     * that have been passed to {@link EventBus#fire}.
     *
     * Returning false from a listener will prevent the events default action
     * (if any is specified). To stop an event from being processed further in
     * other listeners execute {@link Event#stopPropagation}.
     *
     * Returning anything but `undefined` from a listener will stop the listener propagation.
     *
     * @param {string|Array<string>} events
     * @param {Function} callback
     * @param {Object} [that] Pass context (`this`) to the callback
     */
    on(events, callback, that)


    /**
     * Register an event listener for events with the given name.
     *
     * The callback will be invoked with `event, ...additionalArguments`
     * that have been passed to {@link EventBus#fire}.
     *
     * Returning false from a listener will prevent the events default action
     * (if any is specified). To stop an event from being processed further in
     * other listeners execute {@link Event#stopPropagation}.
     *
     * Returning anything but `undefined` from a listener will stop the listener propagation.
     *
     * @param {string|Array<string>} events
     * @param {number} [priority=1000] the priority in which this listener is called, larger is higher
     * @param {Function} callback
     * @param {Object} [that] Pass context (`this`) to the callback
     */
    on(events, priority, callback, that)


    /**
     * Register an event listener that is executed only once.
     *
     * @param {string} event the event name to register for
     * @param {Function} callback the callback to execute
     * @param {Object} [that] Pass context (`this`) to the callback
     */
    once(event, callback, that)


    /**
     * Register an event listener that is executed only once.
     *
     * @param {string} event the event name to register for
     * @param {number} [priority=1000] the priority in which this listener is called, larger is higher
     * @param {Function} callback the callback to execute
     * @param {Object} [that] Pass context (`this`) to the callback
     */
    once(event, priority, callback, that)

    /**
     * Removes event listeners by event and callback.
     *
     * If no callback is given, all listeners for a given event name are being removed.
     *
     * @param {string|Array<string>} events
     * @param {Function} [callback]
     */
    off(events, callback)

    /**
     * Create an EventBus event.
     *
     * @param {Object} data
     *
     * @return {Object} event, recognized by the eventBus
     */
    createEvent(data: object): object

    /**
     * Fires a named event.
     *
     * @example
     *
     * // fire event by name
     * events.fire('foo');
     *
     * // fire event object with nested type
     * var event = { type: 'foo' };
     * events.fire(event);
     *
     * // fire event with explicit type
     * var event = { x: 10, y: 20 };
     * events.fire('element.moved', event);
     *
     * // pass additional arguments to the event
     * events.on('foo', function(event, bar) {
     *   alert(bar);
     * });
     *
     * events.fire({ type: 'foo' }, 'I am bar!');
     *
     * @param {string} [name] the optional event name
     * @param {Object} [event] the event object
     * @param {...Object} additional arguments to be passed to the callback functions
     *
     * @return {boolean} the events return value, if specified or false if the
     *                   default action was prevented by listeners
     */
    fire(name: FireType, event: InternalEvent | any, additional?: object[]): boolean

    handleError(error): boolean
  }

  type FireType = string | {
    type: string
  }

  class InternalEvent {
    stopPropagation(): void
    preventDefault(): void
    init(): void
  }

}
