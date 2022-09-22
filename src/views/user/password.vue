<template>

  <expression-editor/>
</template>

<script lang="ts" setup>
import ExpressionEditor from '@/components/expression/editor/ExpressionEditor.vue'
import { ref } from 'vue'

const columns = ref([
  {
    field: 'id',
    title: '#',
    width: '60',
  },
  {
    field: 'name',
    title: '名称',
    width: '120',
  },
  {
    field: 'age',
    title: '年龄',
    width: '80',
  },
  {
    field: 'avatar',
    title: '头像',
    width: '120',
  },
])

const rows = ref([
  {
    id: 1,
    name: 'Lyp',
    age: 19,
    avatar: 'http://1111'
  },
  {
    id: 2,
    name: 'Lyp',
    age: 19,
    avatar: 'http://222'
  },
  {
    id: 3,
    name: 'Lyp',
    age: 19,
    avatar: 'http://3333'
  },
  {
    id: 4,
    name: 'Lyp',
    age: 19,
    avatar: 'http://4444'
  },
  {
    id: 5,
    name: 'Lyp',
    age: 19,
    avatar: 'http://5555'
  },
  {
    id: 5,
    name: 'Lyp',
    age: 19,
    avatar: 'http://aa'
  },
  {
    id: 5,
    name: 'Lyp',
    age: 19,
    avatar: 'http://aa'
  },
  {
    id: 5,
    name: 'Lyp',
    age: 19,
    avatar: 'http://aa'
  },
  {
    id: 5,
    name: 'Lyp',
    age: 19,
    avatar: 'http://aa'
  },
  {
    id: 5,
    name: 'Lyp',
    age: 19,
    avatar: 'http://aa'
  },
  {
    id: 5,
    name: 'Lyp',
    age: 19,
    avatar: 'http://aa'
  },
])

</script>

<style scoped>

</style>