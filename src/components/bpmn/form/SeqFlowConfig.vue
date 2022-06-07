<template>
  <div class="container">
    <div class="field-item">
      <label>表达式:&nbsp;</label>
      <el-input style="width: 100%" @change="handleInputChange" v-model="expression"></el-input>
    </div>
    <div class="field-item">
      <label>序号:&nbsp;</label>
      <el-input style="width: 100%" @change="handleOrderNoInputChange" v-model="orderNo"></el-input>
    </div>
  </div>
</template>

<script lang="ts" setup>
// TODO: 设置 连线类型：默认流转 条件流程 无
import {ref, watch, inject, toRaw} from "vue"
import {ElInput} from "element-plus"
import {bpmnModelerKey, bpmnSelectedElemKey, propertyPanelOpenKey} from "@/config/app.keys";

const expression = ref("")
const orderNo = ref<string>('')

const innerWidth = "360px"
const labelWidth = "60px"
const inputWidth = `calc(${innerWidth} - ${labelWidth})`


const bpmnModeler = inject(bpmnModelerKey)
const bpmnSelectedElem = inject(bpmnSelectedElemKey)
const propertyPanelOpen = inject(propertyPanelOpenKey)
watch(bpmnSelectedElem, () => {
  const selectedElem = toRaw(bpmnSelectedElem.value)
  const bo = toRaw(selectedElem?.businessObject)
  if (!bo || !bo?.conditionExpression) {
    expression.value = ""
    return
  }
  expression.value = bo?.conditionExpression?.body

  let hasOrder = false
  if (bo.extensionElements) {
    const items = bo.extensionElements.values
    outer:
      for (let item of items) {
        console.log('extensionElement', item)
        if (item.$type === 'flowable:Properties') {
          const values = item.values
          if (values && values.length > 0) {
            for (let child of values) {
              if (child.$type === 'flowable:Property') {
                if (child.name === 'order') {
                  orderNo.value = child.value
                  hasOrder = true
                  break outer
                }
              }
            }
          }
        }
      }
  }

  if (!hasOrder) {
    orderNo.value = ''
  }

  propertyPanelOpen("flow-condition")
})

function handleInputChange(val: string) {
  const selectedElem = toRaw(bpmnSelectedElem.value)
  const bo = toRaw(selectedElem.businessObject)
  const bpmnFactory = bpmnModeler.value.get("bpmnFactory")
  const expression = bpmnFactory.create('bpmn:FormalExpression');
  expression.body = val

  const modeling = bpmnModeler.value.get("modeling")
  modeling.updateProperties(selectedElem, {
    conditionExpression: expression
  })
}

function handleOrderNoInputChange(val: string) {
  const selectedElem = toRaw(bpmnSelectedElem.value)
  const modeling = bpmnModeler.value.get("modeling")
  const factory = bpmnModeler.value.get("bpmnFactory")
  const moddle = bpmnModeler.value.get("moddle")

  const bo = selectedElem.businessObject
  if (!bo.extensionElements) {
    bo.extensionElements = factory.create("bpmn:ExtensionElements")
  }

  let properties = undefined
  if (!bo.extensionElements?.values) {
    bo.extensionElements.values = []
  }

  const items = bo.extensionElements?.values
  for (let item of items) {
    if (item.$type === 'flowable:Properties') {
      properties = item
      const children = item.values
      if (children && children.length > 0) {
        for (let child of children) {
          if (child.$type === 'flowable:Property') {
            if (child.name === 'order') {
              modeling.updateModdleProperties(selectedElem, child, {
                value: val
              })
              return
            }
          }
        }
      }
    }
  }

  if (!properties) {
    const otherExtensions = items

    const property = moddle.create("flowable:Property", {
      name: 'order',
      value: val
    })
    properties = moddle.create("flowable:Properties", {
      values: [property]
    })

    modeling.updateModdleProperties(selectedElem, bo.extensionElements, {
      values: items.concat(properties)
    })
  } else {
    const property = moddle.create("flowable:Property", {
      name: 'order',
      value: val
    })
    const oldValues = properties.values

    modeling.updateModdleProperties(selectedElem, properties, {
      values: oldValues.concat(property)
    })

  }

  modeling.updateProperties(selectedElem, {
    extensionElements: bo.extensionElements
  })
}


</script>

<style scoped>
* {
  font-size: 14px;
}

.container {
  display: flex;
  flex-direction: column;
}

.field-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 40px;
}


.field-item label {
  width: v-bind(labelWidth);
  text-align: right;
}

:deep(.el-input) {
  width: v-bind(inputWidth)
}

:deep(.el-input__wrapper) {
  box-sizing: border-box;
  width: v-bind(inputWidth);
}

</style>
