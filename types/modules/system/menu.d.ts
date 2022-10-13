declare interface MenuView extends Tree {
  id: string
  name: string
  pid: string
  type: 'FOLDER' | 'PAGE'
  path: string
  component: string
  icon: string
  orderNo: number
  hidden: boolean
  closeable: boolean
  state: 1 | 0
  remark: string
}