<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="" class="img-logo" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="primary" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏菜单 -->
      <el-aside :width="isCollpse?'64px':'240px'">
        <el-menu
          
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened="true"
          :collapse="isCollpse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>

            <el-menu-item
              :index="'/'+ subMenu.path"
              v-for="subMenu in item.children"
              :key="subMenu.id"
              @click="saveNavState('/'+ subMenu.path)"
            >
              <i class="el-icon-s-grid"></i>
              <span>{{ subMenu.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      iconObj: {
        125: "iconfont icon-user",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
      isCollpse:false,
      activePath:''
    };
  },
  created() {
    this.getMenuList();
    this.activePath=window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取菜单数据
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
    },
    // 折叠菜单
    toggleCollapse(){
        this.isCollpse = !this.isCollpse
    },
    // 保存连接激活状态
    saveNavState(activePath){
        window.sessionStorage.setItem('activePath',activePath)
    }
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.img-logo {
  // display:inline-block;
  height: 50px;
  widows: 50px;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    > span {
      padding-left: 15px;
    }
  }
}
.el-aside {
  background-color: #373d41;
  border-right: 0;
}
.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button{
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    columns: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>
