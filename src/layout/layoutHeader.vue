<template>
  <div :class="[{ 'headerbar ': true }]">
    <div
      :class="[
        { 'header-bg': true },
        { 'header-bg-100': $route.name !== 'home' },
      ]"
    >
      <div class="header-bg-xie"></div>
    </div>
    <div class="headerbar-c">
      <a class="logo" @click="goPortal()">
        <img src="@/assets/images/img/logo2.svg" alt="" class="logo-img" />
      </a>
      <headerMenu class="header-menu" :menu="navMenu" />
      <div class="user">
        <template>
          <div class="avatar" @click="goUser()">
            <img
              class="peopleIcon"
              src="@/assets/images/img/peopleImg.png"
              alt=""
            />
          </div>
          <!-- <span class="username" @click="goUser()">{{
            `${
              userInfo ? "欢迎您，" + (userInfo.userRealName || "张小明") : ""
            }`
          }}</span> -->
          <span class="username" @click="goUser()">{{
            `${userInfo && userInfo.userName ? userInfo.userName : "test"}`
          }}</span>
          <span v-if="userInfo" class="exit" @click="logout">
            <icon-svg icon-class="icon_signOut" class="exit-img" />
            退出
          </span>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { userLogout } from "@/shared/api/login.js";
import { querySource } from "@/shared/api/rightsManage.js";
import { LocalStorage } from "@/utils/common.js";
import { mapMutations, mapState } from "vuex";
import headerMenu from "./headerMenu";

export default {
  name: "LayoutHeader",
  components: {
    headerMenu,
  },
  data: () => {
    return {
      navMenu: [],
    };
  },
  computed: {
    ...mapState("rightsOptions", ["userInfo"]),
  },
  created() {
    // 有调用时说明是新的页面，要从头开始显示
    window.scrollTo(0, 0);
  },
  methods: {
    ...mapMutations("rightsOptions", {
      setUserInfo: "setUserInfo",
      setUserRights: "setUserRights",
    }),
    async initNavMenu() {
      const res = await querySource();
      console.log("res", res);
      let navMenu = [];
      if (res.message === "成功" && res.data && res.data.length) {
        navMenu = this.getMenuList(res.data);
        console.log("navMenu", navMenu);
      } else if (res.message === "成功" && (!res.data || !res.data.length)) {
        this.$message.info("暂无顶部菜单资源");
      } else if (res.status === 500) {
        // 登录过期 重定向登录页
        //gj todo  注释  一期如下
        //window.location.href = "http://10.83.70.241:8081/#/login";
        //gj todo  注释  三期普元提供如下
        window.location.href = "http://10.83.242.185:8081/#/login";
      } else {
        this.$message.error(res.message);
      }
      this.navMenu = navMenu;
      //       this.navMenu = [
      //         {
      //           id: "0",
      //           title: "首页",
      //           href: "http://10.83.70.241:8081/#/portal/main/index",
      //           img: "home",
      //         },
      //         {
      //           id: "01",
      //           title: "数字画像",
      //           img: "portrait",
      //         },
      //         {
      //           id: "02",
      //           title: "动态图谱",
      //           //           href: `https://10.83.70.195/i3mjsnq/clus-21-sophon-infra-3-0-1-04d31a3d/gateway/user/api/users/password-free/login?token=Bearer
      //           // eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6ImhpdmUiLCJyb2xlcyI6IltcIlNPUEhPTl9BRE1JTlwiXSIsInNjb3BlIjoiZXh0ZXJuYWwiLCJleHAiOjQ4MTQ5MTg3MzMsImlhdCI6MTY2MTMxODczM30.7JO6iYTWnKNwsYaygy5gusvzVflHOedb0Z4vDoAsymZlL_JfFj9Z549g8seopMliYPEEmUGwsIoM2Y5KowQdHA&redirect=https://10.83.70.195/i3mjsnq/clus-21-sophon-infra-3-0-1-04d31a3d/kg/graph_list/personalBlueprint/ca0f95a6-f9b6-44ef-ade0-f352a54d5984&refer=https://10.83.70.195/i3mjsnq/clus-21-sophon-infra-3-0-1-04d31a3d /error.html`,
      //           href: `https://10.83.70.195/i3mjsnq/clus-21-sophon-infra-3-0-1-04d31a3d/gateway/user/api/users/password-free/login?token=Bearer
      // eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6ImhpdmUiLCJyb2xlcyI6IltcIlNPUEhPTl9BRE1JTlwiXSIsInNjb3BlIjoiZXh0ZXJuYWwiLCJleHAiOjQ4MTQ5MTg3MzMsImlhdCI6MTY2MTMxODczM30.7JO6iYTWnKNwsYaygy5gusvzVflHOedb0Z4vDoAsymZlL_JfFj9Z549g8seopMliYPEEmUGwsIoM2Y5KowQdHA&redirect=https://10.83.70.195/i3mjsnq/clus-21-sophon-infra-3-0-1-04d31a3d/kg/graph_list/personalBlueprint/6f97ee9d-f92e-4ee7-b604-105995f9975a&refer=https://10.83.70.195/i3mjsnq/clus-21-sophon-infra-3-0-1-04d31a3d/error.html`,
      //           img: "atlas",
      //         },
      //         {
      //           id: "1",
      //           title: "资产管理",
      //           href: "http://10.83.70.241:8081/#/portal/resources-browse/index",
      //           img: "assets",
      //         },
      //         {
      //           id: "03",
      //           title: "资源查询",
      //           href: "http://10.83.70.241:8081/#/portal/resources-search/index",
      //           img: "resources",
      //         },
      //         {
      //           id: "04",
      //           title: "审计工具箱",
      //           // href: "shenji",
      //           img: "tool",
      //           children: [
      //             {
      //               id: "041",
      //               title: "特征标签库",
      //               // href: "/portal/label/index",
      //             },
      //           ],
      //         },
      //       ];
    },
    getMenuList(list) {
      const result = [];
      list
        .filter((item) => !item.hidden)
        .map((item) => {
          let href_str = "";
          let urlJson = JSON.parse(item.urlJson);

          if (urlJson.isOut) {
            href_str = urlJson.params[0].name;
          } else {
            // href_str = `http://10.83.70.241:8081/#${item.linkAction}`;
            //todo
            href_str = `http://10.83.242.185:8081/#${item.linkAction}`;
          }
          result.push({
            id: href_str,
            title: item.menuName,
            href: href_str,
            img: item.imagePath,
            children: item.childrenMenuTreeNodeList
              ? this.getMenuList(item.childrenMenuTreeNodeList)
              : [],
          });
        });

      return result;
    },
    logout() {
      userLogout(this.userInfo.token);
      LocalStorage.removeItem("userInfo");
      LocalStorage.removeItem("userRights");
      this.setUserInfo({});
      // 重置用户权限
      this.setUserRights({
        riskOverview: true,
        entityInsight: true,
        enterpriseInsight: true,
        personInsight: true,
        employeeInsight: true,
        riskWarning: true,
        riskWarningInfo: true,
        riskWarningStatistics: true,
        affairGraph: true,
        configManage: true,
        rulesManage: true,
        modelsManage: true,
        conditionsManage: true,
        rostersManage: true,
        rightsManage: true,
        organizationManage: true,
        root_mn_sm_user_query: true,
        root_mn_sm_roles_query: true,
        root_mn_sm_resource_query: true,
        pierceLogin: true,
        auditMode: true,
        businessPortraits: true,
        groupPortrait: true,
      });
      // this.$router.replace("/login");
      //gj todo  注释  一期如下
      //window.location.href = "http://10.83.70.241:8081/#/login";
      //gj todo  注释  三期普元提供如下
      window.location.href = "http://10.83.242.185:8081/#/login";
    },
    goUser() {
      // 跳转个人中心默认跳转到我的报告页
      // this.$router.push("/portal/my-report/index");
    },
    goPortal() {
      // window.location.href = "http://10.83.70.241:8081/#/portal/main/index";
      //todo
      window.location.href = "http://10.83.242.185:8081/#/portal/main";
    },
  },
};
</script>

<style scoped lang="less">
.headerbar {
  height: 74px;
  width: 100%;
  // background: #1f5bf5;
  // background: #ffffff;
  position: absolute;
  z-index: 9;
  min-width: 1440px;

  .header-bg {
    width: 100%;
    height: 100%;
    position: absolute;
    background: url("~@/assets/images/img/menu-bg-3.png") no-repeat;
    background-position: 100% 100%;
    background-size: 100% 100%;
    opacity: 0.8;
  }
  .header-bg-100 {
    opacity: 1;
  }
  // .header-bg::before {
  //   content: "";
  //   position: absolute;
  //   bottom: -3.5px;

  //   width: 386px;
  //   width: 20%;
  //   height: 4px;
  //   box-shadow: 0 -3px 4px #2ae3cf;
  // }
  // .header-bg::after {
  //   content: "";
  //   position: absolute;
  //   bottom: 6px;
  //   left: 386px;
  //   left: 20.3%;

  //   width: calc(1920px - 386px);
  //   width: calc(100% - 20.3%);
  //   height: 2px;
  //   box-shadow: 0 -3px 4px #2ae3cf;
  // }
  // .header-bg-xie {
  //   position: absolute;
  //   bottom: 8px;
  //   // left: 382px;
  //   left: 19.5%;

  //   // width: 10px;
  //   width: 0.7%;
  //   height: 2px;
  //   box-shadow: 0 -4px 4px #2ae3cf;
  //   transform: rotate(135deg);
  // }
  .headerbar-c {
    position: relative;
    padding: 0 30px;
    height: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .logo {
      margin-right: 80px;
      // font-family: Arial-BoldMT;
      font-weight: bold;
      // word-spacing: 3px;
      letter-spacing: 2px;
      font-size: 24px;
      color: #fff;
      // color: #1F5BF5;
      line-height: 60px;
      cursor: pointer;
      display: flex;
      align-items: center;
      width: 284px;
      height: 100%;
      .logo-img {
        width: 100%;
        height: 42px;
      }
    }
    .user {
      line-height: 60px;
      color: #333;
      text-align: right;
      height: 100%;
      padding-bottom: 10px;
      margin-right: 10px;

      .avatar {
        display: inline-block;
        vertical-align: middle;
        height: 18px;
        width: 18px;
        margin-right: 5px;
        border-radius: 50%;
        overflow: hidden;
        cursor: pointer;
        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }

      span {
        display: inline-block;
        vertical-align: middle;
        font-size: 16px;
        transition: all 0.3s;

        &:nth-of-type(2) {
          cursor: pointer;
          &:hover {
            text-decoration: underline;
            font-weight: 500;
          }
        }
      }
      .username {
        margin-right: 20px;
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
        color: #fff;
        font-size: 18px;
      }
      .exit {
        position: relative;
        line-height: 1;
        color: #fff;
        display: flex;
        align-items: center;
        font-size: 18px;
        .exit-img {
          margin-right: 8px;
          width: 18px;
          height: 18px;
        }
      }
    }
  }
}

.user {
  position: relative;
  display: flex;
  align-items: center;
}
.header-menu {
  height: 100%;
  flex: 1;
  position: absolute;
  left: 26.25%;
}
</style>
