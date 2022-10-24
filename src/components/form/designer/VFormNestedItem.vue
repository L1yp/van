<template>
  <template v-if="item.category === 'form-item'">
    <el-form-item :key="item.id" v-bind="item.formItemAttrs">
      <template v-if="item.component === 'el-select'">
        <el-select v-model="formData[item.id]" v-bind="item.attrs">
          <el-option label="Option1" value="1" key="1"></el-option>
          <el-option label="Option" value="2" key="2"></el-option>
        </el-select>
      </template>


      <template v-else>
        <component :is="item.component" v-bind="item.attrs" v-model:value="formData[item.id]"></component>
      </template>
    </el-form-item>
  </template>

  <template v-if="item.category === 'layout'">
    <template v-if="item.component === 'el-row'">
      <el-row v-bind="item.attrs">
        <el-col
          v-bind="col.attrs"
          v-for="col in item.children"
          :key="col.id"
        >
          <v-form-nested-item
            v-for="child in col.children"
            :key="child.id"
            :item="child"
            :form-data="formData"
            >

          </v-form-nested-item>
        </el-col>
      </el-row>
    </template>
  </template>

</template>

<script lang="ts">
import { ElFormItem, ElSelect, ElOption, ElInput, ElRow, ElCol } from 'element-plus'
import { defineComponent, inject, PropType } from "vue";
import UserSelectorInput from "@/components/common/selector/user/UserSelectorInput.vue";
import DeptSelectorInput from "@/components/common/selector/dept/DeptSelectorInput.vue";
import NumberInput from '@/components/form/components/input/NumberInput.vue'
import TextInput from '@/components/form/components/input/TextInput.vue'
import TextAreaInput from '@/components/form/components/input/TextAreaInput.vue'
import SingleSelect from "../components/select/SingleSelect.vue"
import MultiSelect from "../components/select/MultiSelect.vue"
import UserSelect from "../components/select/UserSelect.vue"
import DeptSelect from "../components/select/DeptSelect.vue"
import DatePicker from "../components/date/DatePicker.vue"
import DateRangePicker from "../components/date/DateRangePicker.vue"

export default defineComponent({
  name: 'VFormNestedItem',
  components: {
    ElFormItem, ElSelect, ElOption, ElInput, ElRow, ElCol, NumberInput, UserSelectorInput, DeptSelectorInput, TextInput, TextAreaInput,
    SingleSelect, MultiSelect, UserSelect, DeptSelect, DatePicker, DateRangePicker,
  },
  props: {
    item: {
      type: Object as PropType<ComponentConfig>,
      required: true
    },
    formData: {
      type: Object,
      required: true,
    }
  },
  setup(props, ctx) {

  },
})


</script>

<style scoped>

</style>