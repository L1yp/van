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

  interface BpmnModdle {
    factory: Factory
    ids: any
    properties: any
    registry: any
    typeCache: any
  }

  interface ModdleElement {
    $type: string
    id: string
    planeElement: ModdleElement[]
    $attrs: Record<string, any>
    $parent: ModdleElement
    bpmnElement: ModdleElement
    $descriptor: Descriptor
    $model: BpmnModdle
  }

  interface Base {}

  interface Shape {

  }


}