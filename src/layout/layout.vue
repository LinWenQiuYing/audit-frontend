<template>
  <a-layout class="pierce-layout">
    <LayoutHeader ref="layoutHeader" />
    <a-layout class="pierce-layout-content">
      <LayoutSider
        :collapsed="collapsed"
        :selectedKeys="selectedKeys"
        :openKeys="openKeys"
        @handleChangeLink="handleChangeLink"
        @handleCollapsedChange="handleCollapsedChange"
        @handleOpenChange="handleOpenChange"
      />
      <a-layout-content v-if="isGetting" class="pierce-layout-content-right">
        <a-spin
          :spinning="isGetting"
          class="layout-content-loading"
          size="large"
          tip="正在加载"
        />
      </a-layout-content>
      <a-layout-content v-else class="pierce-layout-content-right">
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive" :key="$route.fullPath">
            <!-- 这里是会被缓存的视图组件 -->
          </router-view>
        </keep-alive>

        <router-view v-if="!$route.meta.keepAlive">
          <!-- 这里是不被缓存的视图组件 -->
        </router-view>

        <!-- 使用exclude的话会在$router.push方法下失效，不知道原因 -->
        <!-- <keep-alive exclude="GraphAnalysis">
          <router-view></router-view>
        </keep-alive> -->
        <!-- <router-view></router-view> -->
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import { classifyCount } from "@/shared/api/auditManage.js";
import { checkToken, levelQuery } from "@/shared/api/auditMode.js";
import { getResourceList } from "@/shared/api/rightsManage";
import { LocalStorage } from "@/utils/common.js";
import { Layout, Spin } from "ant-design-vue";
import { cloneDeep } from "lodash";
import moment from "moment";
import { mapMutations, mapState } from "vuex";
import LayoutHeader from "./layoutHeader";
import LayoutSider from "./layoutSider";

const { Content } = Layout;

export default {
  data() {
    return {
      selectedKeys: [],
      openKeys: [],
      openKeysCopy: [],
      collapsed: true,
      nowTime: moment().format("YYYY-MM-DD HH:mm:ss"),
      timer: "",
      themeList: [
        {
          title: "海天",
          value: "blueWhite",
        },
      ],
      isGetting: true, // 是否正在获取url传参
    };
  },
  computed: {
    ...mapState("rightsOptions", ["userInfo", "theme"]),
    ...mapState("auditOptions", ["paramsObj"]),
    userName() {
      return this.userInfo.userName;
    },
  },
  watch: {
    async $route(to, from) {
      const url = to.path.slice(1);
      console.log("路由变化", url);
      const fromUrl = from.path.slice(1);
      let key = "0";
      switch (url) {
        case "risk-warning/info":
          key = "3.1";
          this.openKeys = ["3"];
          this.openKeysCopy = ["3"];
          break;
        case "config-manage/rules":
          key = "5.1";
          this.openKeys = ["5"];
          this.openKeysCopy = ["5"];
          break;
        case "config-manage/models":
          key = "5.2";
          this.openKeys = ["5"];
          this.openKeysCopy = ["5"];
          break;
        case "config-manage/conditions":
          key = "5.5";
          this.openKeys = ["5"];
          this.openKeysCopy = ["5"];
          break;
        case "block-analysis/business-block":
          key = "2";
          this.openKeys = [];
          this.openKeysCopy = [];
          break;
        case "block-analysis/pay-detail":
          key = "2";
          this.openKeys = [];
          this.openKeysCopy = [];
          break;
        case "block-analysis/no-tax-detail":
          key = "2";
          this.openKeys = [];
          this.openKeysCopy = [];
          break;
        case "block-analysis/asserts-detail":
          key = "2";
          this.openKeys = [];
          this.openKeysCopy = [];
          break;
        case "asserts-analysis/asserts-main":
          key = "4";
          this.openKeys = [];
          this.openKeysCopy = [];
          break;
        case "asserts-analysis/card-detail":
          key = "4";
          this.openKeys = [];
          this.openKeysCopy = [];
          break;
        case "asserts-analysis/disposal-detail":
          key = "4";
          this.openKeys = [];
          this.openKeysCopy = [];
          break;
        case "financial-analysis/financial-main":
          key = "13";
          this.openKeys = [];
          this.openKeysCopy = [];
          break;
        case "manage-portrait/portrait-detail":
          key = "6";
          this.openKeys = [];
          this.openKeysCopy = [];
          break;
        case "budget-portrait/budget-detail":
          key = "14";
          this.openKeys = [];
          this.openKeysCopy = [];
          break;
        case "budget-portrait/budget-tax":
          key = "14";
          this.openKeys = [];
          this.openKeysCopy = [];
          break;
        case "structure-analysis":
          key = "8";
          this.openKeys = [];
          this.openKeysCopy = [];
          break;
        case "blueprint":
          key = "9";
          this.openKeys = [];
          this.openKeysCopy = [];
          break;
        case "graph":
          key = "10";
          this.openKeys = [];
          this.openKeysCopy = [];
          break;
        case "/template":
          key = "11";
          this.openKeys = [];
          this.openKeysCopy = [];
          break;
        case "/model":
          key = "12";
          this.openKeys = [];
          this.openKeysCopy = [];
          break;
        case "/schedule":
          key = "125";
          this.openKeys = [];
          this.openKeysCopy = [];
          break;
        // todo
        // key = "2.1";
        // this.openKeys = ["2"];
        // this.openKeysCopy = ["2"];
        // break;
        case "audit-mode/business-portraits":
          key = "7.1";
          this.openKeys = ["7"];
          this.openKeysCopy = ["7"];

          if (to.params.corpName) {
            if (this.collapsed) {
              this.openKeys = [];
            } else {
              this.openKeys = this.openKeysCopy;
            }
            // 重置企业画像展示的组件
            this.setChildPartShow(false);
            this.setTransactionChainShow(false);
            this.setPurchaseSalesCategoryShow(false);
            this.setGroupStructureShow(false);
            this.setGroupPortraitShow(false);
            this.setAuditResultApplyShow(false);
            this.setBusinessPortraitsShow(true);

            const paramsObj = cloneDeep(this.paramsObj);
            console.log("paramsObj", paramsObj);
            paramsObj.corpName = to.params.corpName;
            paramsObj.uniScId = null; // 重置uniScId
            this.isGetting = true;
            await this.getEntTopAndLevel(paramsObj);
            console.log("this.paramsObj", this.paramsObj);
          }
          //gj todo  注释  一期如下
          // if (!this.paramsObj.corpName) {
          //   window.location.href = `http://10.83.70.241:8081/#/portal/main`;
          // }
          //gj todo  注释  三期普元提供如下 测试需注释不然直接跳转了
          if (!this.paramsObj.corpName) {
            window.location.href = `http://10.83.242.185:8081/#/portal/main`;
          }

          break;

        default:
          break;
      }

      this.handleUpdataTabs(key, fromUrl);
    },
    collapsed(newValue) {
      if (newValue) {
        this.openKeys = [];
      } else {
        this.openKeys = this.openKeysCopy;
      }
    },
  },
  created() {
    // 放在beforeDestroy中不管用，无奈，放在这里
    this.$bus.$off("clearKeepAlive");
  },
  async mounted() {
    // 注册监听全局的clearKeepAlive方法,可在其他组件中触发此方法
    this.$bus.$on("clearKeepAlive", this.clearKeepAlive);
    // await this.getResourceList();
    await this.getUrlParams();
    this.$refs.layoutHeader.initNavMenu();
    this.classifyCount();
    this.timer = setInterval(() => {
      this.nowTime = moment().format("YYYY-MM-DD HH:mm:ss");
    }, 1000);
    setTimeout(() => {
      if (this.collapsed) {
        switch (this.$route.path) {
          case "/risk-warning/info":
            this.selectedKeys = ["3.1"];
            this.openKeysCopy = ["3"];
            break;
          case "/config-manage/rules":
            this.selectedKeys = ["5.1"];
            this.openKeysCopy = ["5"];
            break;
          case "/config-manage/models":
            this.selectedKeys = ["5.2"];
            this.openKeysCopy = ["5"];
            break;
          case "/config-manage/conditions":
            this.selectedKeys = ["5.5"];
            this.openKeysCopy = ["5"];
            break;
          case "/block-analysisk":
            this.selectedKeys = ["2"];
            this.openKeysCopy = [];
            break;
          case "/asserts-analysis":
            this.selectedKeys = ["4"];
            this.openKeysCopy = [];
            break;
          case "/financial-analysis":
            this.selectedKeys = ["13"];
            this.openKeysCopy = [];
            break;
          case "/manage-portrait/portrait-detail":
            this.selectedKeys = ["6"];
            this.openKeysCopy = [];
            break;
          case "/budget-portrait/budget-detail":
            this.selectedKeys = ["14"];
            this.openKeysCopy = [];
            break;
          case "/budget-portrait/budget-tax":
            this.selectedKeys = ["14"];
            this.openKeysCopy = [];
            break;
          case "/structure-analysis":
            this.selectedKeys = ["8"];
            this.openKeysCopy = [];
            break;
          case "/blueprint":
            this.selectedKeys = ["9"];
            this.openKeysCopy = [];
            break;
          case "/graph":
            this.selectedKeys = ["10"];
            this.openKeysCopy = [];
            break;
          case "/template":
            this.selectedKeys = ["11"];
            this.openKeysCopy = [];
            break;
          case "/model":
            this.selectedKeys = ["12"];
            this.openKeysCopy = [];
            break;
          case "/schedule":
            this.selectedKeys = ["15"];
            this.openKeysCopy = [];
            break;
          // case "/block-analysis/business-block":
          //   this.selectedKeys = ["2.1"];
          //   this.openKeysCopy = ["2"];
          //   break;

          default:
            this.selectedKeys = ["7.1"];
            this.openKeysCopy = ["7"];
            break;
        }
      } else {
        switch (this.$route.path) {
          case "/risk-warning/info":
            this.selectedKeys = ["3.1"];
            this.openKeys = ["3"];
            this.openKeysCopy = ["3"];
            break;
          case "/config-manage/rules":
            this.selectedKeys = ["5.1"];
            this.openKeys = ["5"];
            this.openKeysCopy = ["5"];
            break;
          case "/config-manage/models":
            this.selectedKeys = ["5.2"];
            this.openKeys = ["5"];
            this.openKeysCopy = ["5"];
            break;
          case "/config-manage/conditions":
            this.selectedKeys = ["5.5"];
            this.openKeys = ["5"];
            this.openKeysCopy = ["5"];
            break;
          case "/block-analysis":
            this.selectedKeys = ["2"];
            this.openKeys = [];
            this.openKeysCopy = [];
            break;
          case "/asserts-analysis":
            this.selectedKeys = ["4"];
            this.openKeys = [];
            this.openKeysCopy = [];
            break;
          case "/financial-analysis":
            this.selectedKeys = ["13"];
            this.openKeys = [];
            this.openKeysCopy = [];
            break;
          case "/manage-portrait/portrait-detail":
            this.selectedKeys = ["6"];
            this.openKeys = [];
            this.openKeysCopy = [];
            break;
          case "/budget-portrait/budget-detail":
            this.selectedKeys = ["14"];
            this.openKeys = [];
            this.openKeysCopy = [];
            break;
          case "/budget-portrait/budget-tax":
            this.selectedKeys = ["14"];
            this.openKeys = [];
            this.openKeysCopy = [];
            break;
          case "/structure-analysis":
            this.selectedKeys = ["8"];
            this.openKeys = [];
            this.openKeysCopy = [];
            break;
          case "/blueprint":
            this.selectedKeys = ["9"];
            this.openKeys = [];
            this.openKeysCopy = [];
            break;
          case "/graph":
            this.selectedKeys = ["10"];
            this.openKeys = [];
            this.openKeysCopy = [];
            break;
          case "/template":
            this.selectedKeys = ["11"];
            this.openKeys = [];
            this.openKeysCopy = [];
            break;
          case "/model":
            this.selectedKeys = ["12"];
            this.openKeys = [];
            this.openKeysCopy = [];
            break;
          case "/schedule":
            this.selectedKeys = ["15"];
            this.openKeys = [];
            this.openKeysCopy = [];
            break;
          //todo
          // case "/block-analysis/business-block":
          //   this.selectedKeys = ["2.1"];
          //   this.openKeys = ["2"];
          //   this.openKeysCopy = ["2"];
          //   break;

          default:
            this.selectedKeys = ["7.1"];
            this.openKeys = ["7"];
            this.openKeysCopy = ["7"];
            break;
        }
      }
    }, 300);
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },
  components: {
    ALayout: Layout,
    ALayoutContent: Content,
    ASpin: Spin,
    LayoutHeader,
    LayoutSider,
  },
  methods: {
    ...mapMutations("rightsOptions", {
      setUserBaseRights: "setUserBaseRights",
      setResourceList: "setResourceList",
      setTheme: "setTheme",
      setUserInfo: "setUserInfo",
    }),
    ...mapMutations("auditOptions", {
      setParamsObj: "setParamsObj",
      setClassifyCounts: "setClassifyCounts",
      setChildPartShow: "setChildPartShow",
      setBusinessPortraitsShow: "setBusinessPortraitsShow",
      setTransactionChainShow: "setTransactionChainShow",
      setPurchaseSalesCategoryShow: "setPurchaseSalesCategoryShow",
      setGroupStructureShow: "setGroupStructureShow",
      setGroupPortraitShow: "setGroupPortraitShow",
      setAuditResultApplyShow: "setAuditResultApplyShow",
    }),
    onEdit(targetKey, action) {
      this[action](targetKey);
    },
    handleChangeLink(url, key) {
      console.log("🚀 ~ handleChangeLink ~ handleChangeLink:", url, key);
      if (this.$route.path === `/${url}`) {
        // 跳转路由与当前路由相同
        return;
      } else {
        this.selectedKeys = [key];
        // if (key === "7.1") {
        //   const paramsObj = JSON.parse(sessionStorage.getItem("paramsObj"));
        //   console.log("paramsObj", paramsObj);
        //   if (paramsObj) {
        //     this.$router.replace(
        //       `/${url}?token=${paramsObj.token}&uniScId=${paramsObj.uniScId}&corpName=${paramsObj.corpName}`
        //     );
        //   } else {
        //     window.open(`http://10.83.70.241:8081/#/portal/main`);
        //   }
        // } else {
        this.$router.replace(`/${url}`);
        // }
      }
    },
    handleOpenChange(openKeys) {
      this.openKeys = openKeys.slice(-1);
      this.openKeysCopy = this.openKeys;
    },
    handleUpdataTabs(key, fromUrl) {
      if (fromUrl === "") {
        return;
      }
      this.selectedKeys = [key];
    },
    async getResourceList() {
      const listData = await getResourceList({
        resCode: "",
        resName: "",
        menuName: "",
      });
      if (!listData) {
        this.$message.error("获取资源列表失败，请重新尝试");
      } else {
        let userRights = new Object();
        const list = listData.map((item) => {
          let children = null;
          userRights[item.resCode] = false;
          if (item.childResources) {
            const result = this.getChildResources(
              item.childResources,
              userRights
            );
            children = result.children;
            userRights = result.userRights;
          }
          return {
            key: item.id,
            isLeaf: false,
            title: item.resName,
            children,
            resName: item.resName,
            resCode: item.resCode,
          };
        });
        userRights.conditionsManage = true;
        userRights.auditMode = true;
        userRights.businessPortraits = true;
        userRights.rulesConditions = true;
        this.setResourceList(list);
        this.setUserBaseRights(userRights);
      }
    },
    getChildResources(list, userRights) {
      const arr = list.map((ele) => {
        let children = null;
        userRights[ele.resCode] = false;
        if (ele.childResources) {
          const result = this.getChildResources(ele.childResources, userRights);
          children = result.children;
          userRights = result.userRights;
        }
        return {
          key: ele.id,
          isLeaf:
            ele.childResources && ele.childResources.length ? false : true,
          title: ele.resName,
          children,
          resName: ele.resName,
          resCode: ele.resCode,
        };
      });
      return {
        children: arr,
        userRights: userRights,
      };
    },
    handleChangeTheme(value) {
      this.setTheme(value);
    },
    clearKeepAlive(fullUrl) {
      // 根据fullUrl清除keepAlive
      const target =
        this.$children[0].$children[0].$children[1].$children[0].$children[1]
          .$children[0];
      target.$children.forEach((item) => {
        if (
          item.$vnode.key == `/${fullUrl}` ||
          item.$vnode.data.key == `/${fullUrl}`
        ) {
          this.myDestory(item);
        }
      });
    },
    // 封装清除某个组件的keepAlive状态,并销毁
    myDestory(keepAliveComponent) {
      // 你可以根据自己的业务更改此处的判断逻辑，酌情决定是否摧毁本层缓存。
      if (
        keepAliveComponent.$vnode &&
        keepAliveComponent.$vnode.data.keepAlive
      ) {
        if (
          keepAliveComponent.$vnode.parent &&
          keepAliveComponent.$vnode.parent.componentInstance &&
          keepAliveComponent.$vnode.parent.componentInstance.cache
        ) {
          if (keepAliveComponent.$vnode.componentOptions) {
            let key =
              keepAliveComponent.$vnode.key == null
                ? keepAliveComponent.$vnode.componentOptions.Ctor.cid +
                  (keepAliveComponent.$vnode.componentOptions.tag
                    ? `::${keepAliveComponent.$vnode.componentOptions.tag}`
                    : "")
                : keepAliveComponent.$vnode.key;
            let cache =
              keepAliveComponent.$vnode.parent.componentInstance.cache;
            let keys = keepAliveComponent.$vnode.parent.componentInstance.keys;
            if (cache[key]) {
              if (keys.length) {
                let index = keys.indexOf(key);
                if (index > -1) {
                  keys.splice(index, 1);
                }
              }
              delete cache[key];
            }
          }
        }
      }
      keepAliveComponent.$destroy();
    },
    async getUrlParams() {
      console.log("getUrlParams---start");
      // 获取url的参数
      this.isGetting = true;
      // console.log("window.location.hash", window.location.hash.split("?")[1]);
      // 1.先从url获取参数；2.没有的话就从route的params里取；3.再没有就从paramsObj里获取
      // let params = decodeURIComponent(location.search); //search获得地址中的参数，内容为'?token=xxx&uniScId=xxx&corpName=xxx&companyName=xxx&topCompanyName=xxx&topCompanyId=xxx'
      //二期项目  采用的如下的方式   todo
      // let params = decodeURIComponent(location.search); //search获得地址中的参数，内容为'?token=xxx&uniScId=xxx&corpName=xxx&companyName=xxx&topCompanyName=xxx&topCompanyId=xxx'
      //三期项目，跳按照上述来写获取不到params，故修改为如下
      let params = window.location.hash.split("?")[1];

      console.log("params", params);
      if (!params && this.$route.params.token) {
        const token = this.$route.params.token;
        const corpName = this.$route.params.corpName;
        // 如果url后缀不存在 && route的params里有传参，重新拼出params
        params = `?token=${token}&corpName=${corpName}`;
        console.log("params1", params);
      } else if (!params && this.paramsObj.token) {
        params = `?token=${this.paramsObj.token}&corpName=${this.paramsObj.corpName}`;
        console.log("params2", params);
      }
      const result = params.match(/[^\?&]*=[^&]*/g); //match是字符串中符合的字段一个一个取出来，result中的值为['token=xxx','uniScId=xxx', ...]
      const paramsObj = {
        params,
      };
      console.log("result", result);
      if (result && result.length) {
        // 理论上至少存在token，所以如果长度为0，表示连token都没有
        result.map((item) => {
          const tokenIndex = item.match(/token=/);
          const uniScIdIndex = item.match(/uniScId=/);
          const corpNameIndex = item.match(/corpName=/);
          if (tokenIndex) {
            paramsObj["token"] = item.slice(6);
          }
          if (uniScIdIndex) {
            paramsObj["uniScId"] = item.slice(8);
          }
          if (corpNameIndex) {
            paramsObj["corpName"] = item.slice(9);
          }
          // const temp = item.split("=");
          // paramsObj[temp[0]] = temp[1];
        });
        // 先进行token验证
        const json = {
          token: paramsObj.token,
        };
        const res = await checkToken(json);
        if (res.message === "成功") {
          const userInfo = {
            token: paramsObj.token,
            roles: [res.data.userRole],
            userId: res.data.userld,
            userRealName: res.data.loginName,
            userName: res.data.userName,
          };
          LocalStorage.setItem({
            name: "userInfo",
            value: JSON.stringify(userInfo),
            expires: 0, // 三天 259200000
          });
          this.setUserInfo(userInfo);
          if (paramsObj.corpName || paramsObj.uniScId) {
            // 有企业信息
            this.getEntTopAndLevel(paramsObj);
          } else {
            this.isGetting = false;
            this.setParamsObj({});
          }
        } else {
          this.isGetting = false;
          this.$message.error(res.message);
          //gj todo  注释  一期如下
          //window.location.href = "http://10.83.70.241:8081/#/login";
          //gj todo  注释  三期普元提供如下
          window.location.href = "http://10.83.242.185:8081/#/login";
        }
      } else {
        // url里没有传参 && route里也没有传参——也就是说连token也没有
        console.log("no-token");
        this.isGetting = false;
        setTimeout(() => {
          this.$message.destroy();
          this.$message.error("缺少token信息！");
          //gj todo  注释  一期如下
          // setTimeout(() => {
          //   window.location.href = "http://10.83.70.241:8081/#/login";
          // }, 500);
          //gj todo  注释  三期普元提供如下 测试需注释不然直接跳转了
          setTimeout(() => {
            window.location.href = "http://10.83.242.185:8081/#/login";
          }, 500);
        }, 1000);
      }
    },
    async getEntTopAndLevel(paramsObj) {
      const json = {
        corpName: paramsObj.corpName,
        uniScId: paramsObj.uniScId,
      };
      const res = await levelQuery(json);
      if (res.message === "成功" && res.data) {
        paramsObj.corpName = res.data.corpName;
        paramsObj.uniScId = res.data.uniScid;
        paramsObj.topEnt = res.data.topEnt;
        paramsObj.level = res.data.level;
        sessionStorage.setItem("paramsObj", JSON.stringify(paramsObj));
        this.setParamsObj(paramsObj);
        console.log("bingo----setParamsObj1");
      } else {
        this.$message.error("获取企业信息失败！");
        sessionStorage.removeItem("paramsObj");
        this.setParamsObj({});
        console.log("bingo----setParamsObj2");
      }
      this.isGetting = false;
    },
    handleCollapsedChange(collapsed) {
      this.collapsed = collapsed;
    },
    async classifyCount() {
      const res = await classifyCount();
      const classifyCounts = {
        riskInfo: 0,
        condition: 0,
        rule: 0,
        entCount: 0,
      };
      if (res.message === "成功" && res.data) {
        classifyCounts.riskInfo = res.data.riskMonthCount.toLocaleString();
        classifyCounts.condition =
          res.data.conditionMonthCount.toLocaleString();
        classifyCounts.rule = res.data.ruleMonthCount.toLocaleString();
        classifyCounts.entCount = res.data.riskEntCount.toLocaleString();
      } else if (res.message === "成功" && !res.data) {
        this.$message.info("暂无月度统计数据");
      } else {
        this.$message.error(res.message);
      }
      this.setClassifyCounts(classifyCounts);
    },
  },
};
</script>
<style lang="less">
// 悬浮提示框样式
.ant-tooltip {
  max-width: 600px;
}

.pierce-layout {
  width: 100%;
  height: 100%;

  &-content {
    min-width: 1440px;
    padding-top: 74px;
    position: relative;
    transition: all 0.3s;
    background-color: @mainBackgroundColor;

    &-right {
      transition: all 0.3s;
      padding: 20px;
      background: @mainBackgroundColor;
      min-height: 280px;
      position: relative;
      margin-top: -12px;

      .layout-content-loading {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}

.theme-popover {
  width: 90px;

  .ant-popover-inner-content {
    padding: 12px 6px;

    .theme-popover-item {
      cursor: pointer;
      text-align: center;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;

      &:hover {
        background: #f2f3f5;
      }

      .item-content {
        width: 46px;
        text-align: right;

        .anticon {
          margin-right: 8px;
          font-size: 10px;
        }

        .item-content-text {
          color: #1d2129;
        }
      }
    }
  }
}

.ant-menu-submenu-popup {
  background: #fff !important;

  .ant-menu {
    background: #fff !important;
    box-shadow: none !important;
    margin: 0 4px;

    .ant-menu-item {
      color: @leftMenuColor;
      font-weight: 600;
      padding-left: 40px !important;
      transition: color 0.1s;

      &:hover {
        background-color: @leftMenuBackgroundColor;
        color: @activeFontColor !important;
      }

      &.ant-menu-item-selected {
        background-color: @leftMenuBackgroundColor;
        color: @activeFontColor !important;
      }
    }
  }
}
</style>
