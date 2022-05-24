declare interface PermissionView {
  id: number;
  ident: string;
  owner_menu_id: number;
  update_by?: string;
  update_time?: number;
}

declare interface PermissionTree {
  id: string; // {} + id
  title: string;
  children?: PermissionTree[]
}