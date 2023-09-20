
export type DateType = 'datetime' | 'duration' | 'cycle'

export interface IsoDatePickerProps {
  type: DateType
  modelValue: string
}

export type IsoDatePickerEmits = {
  'update:modelValue': [val: string]
}

export interface IsoTimeDurationProps {
  modelValue: string
  visible: boolean
}

export type IsoTimeDurationEmits = {
  'update:modelValue': [val: string]
  'update:visible': [val: boolean]
}


export function parseISO8601Duration(durationStr: string) {
  const durationRegex = /^P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/;
  const matches = durationStr.match(durationRegex);

  if (!matches) {
    throw new Error("Invalid ISO 8601 duration format");
  }

  const years = parseInt(matches[1] || '0', 10);
  const months = parseInt(matches[2] || '0', 10);
  const days = parseInt(matches[3] || '0', 10);
  const hours = parseInt(matches[4] || '0', 10);
  const minutes = parseInt(matches[5] || '0', 10);
  const seconds = parseInt(matches[6] || '0', 10);

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds
  };
}

export interface IsoCycle {
  round?: number
  startDate: string | null
  period: string
  endDate: string | null
}
export function parseISO8601RepeatingInterval(intervalStr: string): IsoCycle {
  const arr = intervalStr.split('/')
  if (arr?.length < 2 || arr?.length > 4) {
    throw new Error('输入数据有误')
  }

  const result: IsoCycle = {
    endDate: null,
    startDate: null,
    period: ''
  }
  if (arr[0].startsWith('R')) {
    const str = arr[0].substring(1)
    result.round = str?.length ? parseInt(str) : undefined
  }

  if (arr[1]?.startsWith('P')) {
    result.period = arr[1]
  } else {
    result.startDate = arr[1]
  }

  if (arr?.length === 3) {
    // 中间是间隔, 现在是结束
    if (result.period) {
      result.endDate = arr[2]
    } else {
      result.period = arr[2]
    }
  }

  if (arr?.length === 4) {
    result.endDate = arr[3]
  }

  if (!result.period) {
    throw new Error('未填周期间隔')
  }

  return result
}

