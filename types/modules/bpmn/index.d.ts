declare interface Documentation {
  $type: string;
  text: string;
  $attrs: Record<string, string>
  $parent: any;
  di: any;
}

declare interface BusinessObject {
  $type: string;
  documentation: Documentation[];
  id: string;
  name: string;
  $attrs: Record<string, string>;
  $parent: any;
  di: any;
  initiator?: string
}
