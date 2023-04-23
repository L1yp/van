declare type MenuType = 'FOLDER' | 'PAGE' | 'BUTTON' | 'TAB' | 'WORKFLOW'


declare interface MenuView extends Tree {
  id: string
  name: string
  pid: string
  type: 'FOLDER' | 'PAGE' | 'ENTITY' | 'WORKFLOW' | 'BUTTON'
  path: string
  component: string
  icon: string
  order_no: number
  hidden: boolean
  closeable: boolean
  state: 1 | 0
  remark: string
}

interface MenuParamBase {
  name: string
  order_no: string
  pid?: string
  status: number
  remark?: string
}

interface FolderMenuParam extends MenuParamBase {
  icon?: string
}

interface PageMenuParam extends MenuParamBase {
  icon?: string
  path: string
  component: string
  closeable: boolean
}

interface WorkflowMenuParam extends MenuParamBase {
  /**
   * 流程标识
   */
  path: string
  pid: string
}

interface ButtonMenuParam extends MenuParamBase {
  /**
   * 权限标识
   */
  component: string
  pid: string
}


declare type MenuParam<T extends MenuType> = T extends 'FOLDER' ? FolderMenuParam :
  T extends ('TAB' | 'PAGE') ? PageMenuParam :
  T extends 'WORKFLOW' ? WorkflowMenuParam :
  T extends 'BUTTON' ? ButtonMenuParam :
    MenuParamBase



declare type Menu<T extends MenuType> = {
  type: T
} & MenuParam<T>



declare type MenuAddParam = Omit<MenuView, 'id'>
declare type MenuUpdateParam = Partial<Pick<MenuView, 'remark'>> & Omit<MenuView, 'remark'>
