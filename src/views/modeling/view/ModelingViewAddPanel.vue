<template>
  <div style="width: 100%; height: 100%">
    <div style="box-sizing: border-box; padding: 6px; background-color: var(--toolbar-bg-color); ">
      <el-button @click="handleCancel">取消</el-button>
      <el-button @click="handleConfirm" type="primary" plain>确定</el-button>
    </div>
    <div id="view-container" style="width: calc(100% - 12px); height: calc(100% - 32px - 12px); padding: 6px;">
      <el-form ref="formRef" :model="formData" label-width="100px" :label-position="formLabelPosition" :rules="formRules" style="width: 100%; height: 100%">
        <div style="height: 270px">
          <el-scrollbar always style="max-width: 500px">
            <ModelingViewBasic :form-data="formData" :fields="props.fields" />
          </el-scrollbar>
        </div>
        <div style="height: calc(100% - 270px); min-height: 500px">
          <ModelingViewColumnConfig :fields="props.fields" :form-data="formData" />
        </div>
      </el-form>
    </div>

  </div>

</template>

<script lang="ts" setup>
import { ref } from "vue";
import ModelingViewBasic from "@/views/modeling/view/ModelingViewBasic.vue";
import { ElForm, FormRules, ElButton, ElScrollbar } from "element-plus";
import { useViewApi } from "@/service/modeling/view";
import ModelingViewColumnConfig from "@/views/modeling/view/ModelingViewColumnConfig.vue";
import { formLabelPosition } from "@/store/layout";

interface Props {
  module: ModelingModule
  mkey: string
  fields: ModelingFieldDefView[]
}

interface Emits {
  (e: 'close'): void
  (e: 'success'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const formData = ref<ModelingViewAddParam>({
  module: props.module,
  mkey: props.mkey,
  name: '',
  sn: 1,
  status: true,
  collation: [],
  columns: [],
})

const formRef = ref<InstanceType<typeof ElForm>>()

const formRules: FormRules = {
  name: [
    {
      type: 'string',
      required: true,
      message: '名称不能为空',
    }
  ],
  sn: [
    {
      type: 'number',
      min: 1,
      message: '序号不能小于1'
    },
    {
      required: true,
      message: '序号不能为空',
    }
  ],
  collation: [
    {
      validator: (rule, value, callback: (error?: string | Error) => void, source, options) => {
        const items = value as Collation[]
        console.log(items)
        return items.every(it => !!it.field && it.field?.trim().length > 0)
      },
      message: '排序规则填写不完整',
    }
  ],
  columns: [
    {
      validator: (rule, value, callback: (error?: string | Error) => void, source, options) => {
        const columns = value as ModelingViewColumnParam[]
        const fields = new Set(columns.map(it => it.field.field))
        const collation = formData.value.collation
        return collation.every(it => fields.has(it.field))
      },
      message: '排序字段必须显示',
    }
  ]
}


const loading = ref(false)

const { addView } = useViewApi(loading)

function handleCancel() {
  emits('close')
}

async function handleConfirm() {
  try {
    await formRef.value.validate()
  } catch (e) {
    console.error(e)
    return
  }

  const result = await addView(formData.value as ModelingViewAddParam)
  if (result) {
    emits('close')
    emits('success')
  }

}

</script>

<style scoped>
#view-container {
  overflow: auto;
}

#view-container::-webkit-scrollbar {
  width: 0;
}
</style>