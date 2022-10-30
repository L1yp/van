export interface UserConditionModel {
  users: string[]
  dptId: string
  containerChildren: boolean
}

export interface DeptConditionModel {
  dptId: string
  containerChildren: boolean
}

export interface OptionConditionModel {
  selected: string[]
}

export interface StrConditionModel {
  value: string
}

export interface NumberConditionModel {
  value: string
}

export interface DateConditionModel {
  type: string
  range: Array<string>
}

export const varDptOptions: DeptView[] = [
  {
    id: 'SELF_DPT',
    title: '本人部门',
  }
]

export const varOptions: UserView[] = [
  {
    id: 'SELF',
    nickname: '本人',
    username: '本人',
    dept_id: 0,
  },
  {
    id: 'SELF_DPT',
    nickname: '本部门',
    username: '本部门',
    dept_id: 0,
  },
  {
    id: 'CHILD_DPT',
    nickname: '下级部门',
    username: '下级部门',
    dept_id: 0,
  },
]