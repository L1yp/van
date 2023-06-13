<template>
  <div style="display: flex; justify-content: flex-start; align-items: center;">
    <el-button circle @click="layoutStore.asideOpened = !layoutStore.asideOpened" style="width: 40px; height: 40px;">
      <SVGIcon style="width: 16px; height: 16px;" name="AsideCollapse" v-if="layoutStore.asideOpened"/>
      <SVGIcon style="width: 16px; height: 16px;" name="AsideOpen" v-if="!layoutStore.asideOpened"/>
    </el-button>
  </div>

  <div style="display: flex; justify-content: flex-end; align-items: center; gap: 10px;">
    <el-dropdown class="header-github__icon" :hide-on-click="false" @command="handleCommand">
      <span class="el-dropdown-link">
        <el-avatar
          shape="circle"
          :size="40"
          fit="cover"
          src="/images/github-icon.png"
          alt="Github"
        >
        </el-avatar>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="github-van">前端</el-dropdown-item>
          <el-dropdown-item command="github-van-app">后端</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-button :icon="themeStore.dark ? DarkIcon : LightIcon" @click.stop="themeStore.dark = !themeStore.dark" circle style="width: 40px; height: 40px"/>
    <el-dropdown :hide-on-click="false" @command="handleCommand">
      <span class="el-dropdown-link">
        <el-avatar
          shape="circle"
          :size="40"
          fit="cover"
          :src="userInfo.avatar"
          alt="avatar"
        >
        </el-avatar>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="profile">个人信息</el-dropdown-item>
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <div class="header-profile__nick" style="" v-text="userInfo.nickname"></div>
  </div>
</template>

<script lang="ts" setup>
import { ElAvatar, ElButton, ElDropdown, ElDropdownItem, ElDropdownMenu } from "element-plus"
import { useRouter} from "vue-router";
import { uninstallLayoutContentRoute } from "@/router";
import SVGIcon from "@/components/common/SVGIcon.vue";
import { remove } from "@/utils/storage"
import { useUserInfo } from "@/config/app.hooks";
import { useIcon } from "@/components/common/util";
import { useLayoutStore } from "@/store/layout";
import { useThemeStore } from "@/store/theme";
import { useKeepAliveStore } from "@/store/keep-alive";

const themeStore = useThemeStore()

const DarkIcon = useIcon('Dark')
const LightIcon = useIcon('Light')

const router = useRouter();

const layoutStore = useLayoutStore()


const userInfo = useUserInfo()
console.log("userInfo", userInfo)

const keepAliveStore = useKeepAliveStore()


function handleCommand(command: string) {
  if (command === "profile") {
    router.push({path: "/user/profile"});
  }
  else if (command === "logout") {
    keepAliveStore.keepAliveNames = []
    uninstallLayoutContentRoute();
    remove("isLogin");
    remove("tags");
    router.replace({
      path: "/app/login"
    });
  }
  else if (command === 'github-van') {
    window.open('https://github.com/L1yp/van')
  }
  else if (command === 'github-van-app') {
    window.open('https://github.com/L1yp/van-app')

  }
}

</script>

<style scoped>

.header-profile__nick {
  margin-left: 5px;
}

@media screen and (max-width: 450px) {
  .header-profile__nick {
    margin-left: 0;
    display: none;
  }

  .header-github__icon {
    display: none;
  }
}

</style>