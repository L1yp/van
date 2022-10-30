declare interface MenuView extends Tree {
  id: string
  name: string
  pid: string
  type: 'FOLDER' | 'PAGE' | 'ENTITY' | 'PROCESS' | 'BUTTON'
  path: string
  component: string
  icon: string
  order_no: number
  hidden: boolean
  closeable: boolean
  state: 1 | 0
  remark: string
}