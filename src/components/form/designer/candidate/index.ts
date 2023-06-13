export function modelingFieldToComponent(field: ModelingFieldDefView): ComponentConfig {
  console.log('field', field);
  const item: ComponentConfig = {
    id: field.field,
    component: '',
    category: 'form-item',
    formItemAttrs: {},
    attrs: {},
    key: 1,
  }
  const scheme = field.scheme
  item.formItemAttrs.label = field.label
  item.attrs.style = `width: 100%`
  if (scheme.type === 'date') {
    item.component = 'date-picker'
    item.attrs.dateType = scheme.dateType
    item.attrs.format = scheme.format
    item.attrs.valueFormat = scheme.valueFormat
  }
  else if (scheme.type === 'daterange') {
    item.component = 'date-range-picker'
    item.attrs.dateRangeType = scheme.dateRangeType
    item.attrs.format = scheme.format
    item.attrs.valueFormat = scheme.valueFormat
  }
  else if (scheme.type === 'dept') {
    item.component = 'dept-select'
    item.attrs.multiple = scheme.multiple
  }
  else if (scheme.type === 'user') {
    item.component = 'user-select'
    item.attrs.multiple = scheme.multiple
  }
  else if (scheme.type === 'text') {
    item.component = 'text-input'
    item.attrs.defaultValue = scheme.defaultValue
  }
  else if (scheme.type === 'number') {
    item.component = 'number-input'
    item.attrs.defaultValue = scheme.defaultValue
    item.attrs.min = scheme.min
    item.attrs.max = scheme.max
    item.attrs.formatter = scheme.formatter
    item.attrs.parser = scheme.parser
  }
  else if (scheme.type === 'option') {
    if (scheme.multiple) {
      item.component = 'multi-select'
      item.attrs.options = []
      if (scheme.optionComponent === 'checkbox') {
        item.attrs.expand = true
        item.attrs.buttonOption = false
      } else if (scheme.optionComponent === 'checkbox-button') {
        item.attrs.expand = true
        item.attrs.buttonOption = true
      } else {
        item.attrs.expand = false
        item.attrs.buttonOption = false
      }
      item.attrs.optionTypeId = scheme.optionTypeId
      item.attrs.defaultValue = scheme.optionDefaultValue
      item.attrs.fitInputWidth = true
      item.attrs.clearable = true
      item.attrs.filterable = true
    } else {
      item.component = 'single-select'
      item.attrs.options = []
      if (scheme.optionComponent) {
        if (scheme.optionComponent === 'radio') {
          item.attrs.expand = true
          item.attrs.buttonOption = false
        } else if (scheme.optionComponent === 'radio-button') {
          item.attrs.expand = true
          item.attrs.buttonOption = true
        } else {
          item.attrs.expand = false
          item.attrs.buttonOption = false
        }
      }
      item.attrs.optionTypeId = scheme.optionTypeId
      item.attrs.defaultValue = scheme.optionDefaultValue?.[0]
      item.attrs.fitInputWidth = true
      item.attrs.clearable = true
      item.attrs.filterable = true
    }

  }
  return item
}


