export const varUserOptions: UserView[] = [
  {
    id: 'SELF',
    username: '本人',
    nickname: '本人',
    dept_id: 1,
  },
  {
    id: 'SELF_DPT',
    username: '本人部门',
    nickname: '本人部门',
    dept_id: 1,
  },
  {
    id: 'CHILD_DPT',
    username: '下级部门',
    nickname: '下级部门',
    dept_id: 1,
  },
  {
    id: 'SELF_CHILD_DPT',
    username: '本人部门及下级部门',
    nickname: '本人部门及下级部门',
    dept_id: 1,
  },
]

export const varDeptOptions: DeptView[] = [
  {
    id: 'SELF_DPT',
    title: '本人部门',
  },
  {
    id: 'CHILD_DPT',
    title: '本人部门的下级部门',
  },
  {
    id: 'SELF_CHILD_DPT',
    title: '本人部门及下级部门',
  },
]
