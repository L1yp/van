<template>
  <div class="container-wrapper">
    <div class="container">
      <div class="tit">登录</div>
      <input v-model="username" type="text" placeholder="帐号">
      <input v-model="password" type="password" placeholder="密码">
      <button @click="login">登录</button>
      <span>没有帐号？<a href="#">去注册</a></span>
    </div>
    <div class="square">
      <ul>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
    <div class="circle">
      <ul>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {inject, Ref, ref} from "vue";
import * as UserApi from "@/api/sys/user";
import SparkMD5 from "spark-md5";
import {installLayoutContentRoute} from "@/router"
import {useRoute, useRouter} from "vue-router";
import {read, write} from "@/utils/storage";
import {useTitle} from "@vueuse/core";
import {toTree} from "@/utils/common";
import { useMenuOptions, useUserInfo } from "@/config/app.hooks";

const title = useTitle()
title.value = '用户登录'
const router = useRouter();
const route = useRoute();

const username = ref("admin");
const password = ref("123456");

const menuOptions = useMenuOptions()
const userInfo = useUserInfo()

async function login() {
  const md5pass = SparkMD5.hash(password.value);
  try {
    const data: LoginResult = await UserApi.login(username.value, md5pass);

    data.menus = toTree(data.menus, 'id', 'pid', 'order_no')
    menuOptions!.value = data.menus
    userInfo!.value = data.user_info


    console.log("menus", data.menus)
    console.log("before routes", router.getRoutes())
    installLayoutContentRoute(data.menus);
    console.log("after routes", router.getRoutes())
    write("isLogin", "1");
    console.log("route.query", route.query)
    if (route.query?.redirect) {
      const redirect = route.query?.redirect as string
      await router.replace(redirect);
    } else {
      await router.replace("/");
    }

  } catch (e) {
    console.log("user login error", e);
  }
}

</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

.container {
  position: relative;
  z-index: 1;
  background-color: #FFFFFF;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 350px;
  height: 500px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.container .tit {
  font-size: 26px;
  margin: 65px auto 70px auto;
}

.container input {
  width: 280px;
  height: 30px;
  text-indent: 8px;
  border: none;
  outline: none;
  border-bottom: 1px solid #ddd;
  margin: 12px auto;
  transition: border-bottom 0.5s;
}

.container input:focus {
  border-bottom: 2px solid #785fc4;
}

.container button {
  width: 280px;
  height: 40px;
  margin: 35px auto 40px auto;
  border: none;
  background: linear-gradient(-200deg, #fac0e7, #aac2ee);
  color: #FFFFFF;
  font-weight: bold;
  letter-spacing: 8px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.5s;
}

.container button:hover {
  background: linear-gradient(-200deg, #aac2ee, #fac0e7);
  background-position-x: -280px;
}

.container span {
  font-size: 14px;
}

.container a {
  color: plum;
  /*text-decoration: none;*/
}

ul li {
  position: absolute;
  border: 1px solid #FFFFFF;
  background-color: #FFFFFF;
  width: 30px;
  height: 30px;
  list-style: none;
}

.square li {
  top: 40vh;
  left: 60vw;
  animation: square 10s linear infinite;
  opacity: 0;
}

.square li:nth-child(2) {
  top: 80vh;
  left: 10vw;
  animation-delay: 2s;
}

.square li:nth-child(3) {
  top: 80vh;
  left: 85vw;
  animation-delay: 4s;
}

.square li:nth-child(4) {
  top: 10vh;
  left: 70vw;
  animation-delay: 6s;
}

.square li:nth-child(5) {
  top: 10vh;
  left: 10vw;
  animation-delay: 8s;
}


.circle li {
  bottom: 0;
  left: 15vw;
  animation: circle 10s linear infinite;
}

.circle li:nth-child(2) {
  left: 35vw;
  animation-delay: 2s;
}

.circle li:nth-child(3) {
  left: 55vw;
  animation-delay: 6s;
}

.circle li:nth-child(4) {
  left: 75vw;
  animation-delay: 4s;
}

.circle li:nth-child(5) {
  left: 90vw;
  animation-delay: 8s;
}


@keyframes square {
  0% {
    transform: scale(0) rotateY(0deg);
    opacity: 1;
  }
  100% {
    transform: scale(5) rotateY(1000deg);
    opacity: 0;
  }
}

@keyframes circle {
  0% {
    transform: scale(0) rotateY(0deg);
    opacity: 1;
    bottom: 0;
    border-radius: 0;
  }
  100% {
    transform: scale(5) rotateY(1000deg);
    opacity: 0;
    bottom: 90vh;
    border-radius: 50%;
  }


}


.container-wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(200deg, #e3c5eb, #a9c1ed);
}

</style>


