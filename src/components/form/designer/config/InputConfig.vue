<template>
  <el-form
    v-if="vFormSelectElem?.attrs"
    :model="vFormSelectElem?.attrs"
    label-position="left"
    label-width="120px"
    style="padding: 5px;"
  >
    <el-form-item prop="type" label="类型" required>
      <template #label>
        <div style="display: flex; align-items: center">
          <div>
            <span>类型</span>
          </div>
          <div style="display: flex; align-items: center; margin-left: 6px;">
            <s-v-g-icon name="InfoFilled" style="width: 16px; height: 16px"></s-v-g-icon>
          </div>
        </div>
      </template>
      <el-select v-model="vFormSelectElem.attrs.type">
        <el-option label="文本" value="text"></el-option>
        <el-option label="数字" value="number"></el-option>
        <el-option label="密码" value="password"></el-option>
        <el-option label="电话" value="tel"></el-option>
        <el-option label="日期" value="date"></el-option>
        <el-option label="时间" value="time"></el-option>
        <el-option label="邮件" value="email"></el-option>
        <el-option label="链接" value="url"></el-option>
        <el-option label="周" value="week"></el-option>
        <el-option label="月份" value="month"></el-option>
        <el-option label="图片" value="image"></el-option>
        <el-option label="隐藏" value="hidden"></el-option>
        <el-option label="文件" value="file"></el-option>
        <el-option label="颜色" value="color"></el-option>
        <el-option label="本地时间" value="datetime-local"></el-option>
        <el-option label="多选框" value="checkbox"></el-option>
        <el-option label="单选框" value="radio"></el-option>
        <el-option label="范围" value="range"></el-option>
        <el-option label="重置" value="reset"></el-option>
        <el-option label="搜索" value="search"></el-option>
        <el-option label="提交" value="submit"></el-option>
        <el-option label="按钮" value="button"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item prop="maxlength" label="最大输入长度">
      <el-input-number v-model="vFormSelectElem.attrs.maxlength"></el-input-number>
    </el-form-item>

    <el-form-item prop="maxlength" label="最小输入长度">
      <el-input-number v-model="vFormSelectElem.attrs.minlength"></el-input-number>
    </el-form-item>

    <el-form-item prop="showWordLimit" label="展示字数统计">
      <el-radio-group v-model="vFormSelectElem.attrs.showWordLimit">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item prop="placeholder" label="占位文本">
      <el-input-number v-model="vFormSelectElem.attrs.placeholder"></el-input-number>
    </el-form-item>
    <el-form-item prop="clearable" label="是否可清空">
      <el-radio-group v-model="vFormSelectElem.attrs.clearable">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="showPassword" label="切换密码图标">
      <el-radio-group v-model="vFormSelectElem.attrs.size">
        <el-radio-button :label="true">展示</el-radio-button>
        <el-radio-button :label="false">隐藏</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="disabled" label="是否禁用">
      <el-radio-group v-model="vFormSelectElem.attrs.disabled">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="size" label="大小">
      <el-radio-group v-model="vFormSelectElem.attrs.disabled">
        <el-radio-button label="large">大</el-radio-button>
        <el-radio-button label="default">默认</el-radio-button>
        <el-radio-button label="small">小</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="prefixIcon" label="前缀图标">
      <el-input type="text" v-model="vFormSelectElem.attrs.prefixIcon"></el-input>
    </el-form-item>

    <el-form-item prop="suffixIcon" label="后缀图标">
      <el-input type="text" v-model="vFormSelectElem.attrs.suffixIcon"></el-input>
    </el-form-item>

    <el-form-item prop="rows" label="行数">
      <el-input-number v-model="vFormSelectElem.attrs.rows"></el-input-number>
    </el-form-item>

    <el-form-item prop="autoresize" label="高度自适应">
      <el-radio-group v-model="vFormSelectElem.attrs.autoresize">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="name" label="name(原生)">
      <el-input type="text" v-model="vFormSelectElem.attrs.name"></el-input>
    </el-form-item>

    <el-form-item prop="readonly" label="是否只读(原生)">
      <el-radio-group v-model="vFormSelectElem.attrs.readonly">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="max" label="最大值(原生)">
      <el-input-number v-model="vFormSelectElem.attrs.max"></el-input-number>
    </el-form-item>

    <el-form-item prop="min" label="最小值(原生)">
      <el-input-number v-model="vFormSelectElem.attrs.min"></el-input-number>
    </el-form-item>

    <el-form-item prop="step" label="步数(原生)">
      <el-input-number v-model="vFormSelectElem.attrs.step"></el-input-number>
    </el-form-item>

    <el-form-item prop="resize" label="缩放">
      <el-select v-model="vFormSelectElem.attrs.resize">
        <el-option label="无" value="none"></el-option>
        <el-option label="横向" value="horizontal"></el-option>
        <el-option label="纵向" value="vertical"></el-option>
        <el-option label="横向&纵向" value="both"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item prop="autofocus" label="自动获取焦点">
      <el-radio-group v-model="vFormSelectElem.attrs.autofocus">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="form" label="form(原生)">
      <el-input-number v-model="vFormSelectElem.attrs.form"></el-input-number>
    </el-form-item>

    <el-form-item prop="tabindex" label="tabindex">
      <el-input type="text" v-model="vFormSelectElem.attrs.tabindex"></el-input>
    </el-form-item>

    <el-form-item prop="validateEvent" label="输入触发校验">
      <el-radio-group v-model="vFormSelectElem.attrs.validateEvent">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="inputStyle" label="输入框样式">
      <el-input type="textarea" v-model="vFormSelectElem.attrs.inputStyle"></el-input>
    </el-form-item>

  </el-form>
</template>

<script lang="ts" setup>
import {
  ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElRadioGroup, ElRadioButton, ElInputNumber
} from 'element-plus'
import {inject} from "vue";
import {vFormActiveElementKey} from "@/config/app.keys";
import SVGIcon from "@/components/common/SVGIcon.vue";

const vFormSelectElem = inject(vFormActiveElementKey)

</script>

<style scoped>

</style>