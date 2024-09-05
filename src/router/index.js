import Vue from "vue";
import VueRouter from "vue-router";

import layout from "@/layout/layout";
import assertsAnalysis from "@/views/assertsAnalysis";
import assertsMain from "@/views/assertsAnalysis/assertsMain/assertsMain";
import cardDetail from "@/views/assertsAnalysis/components/cardDetail";
import disposalDetail from "@/views/assertsAnalysis/components/disposalDetail";
import auditMode from "@/views/auditMode/auditMode";
import businessPortraits from "@/views/auditMode/businessPortraits";
import conditionsManage from "@/views/auditMode/components/conditionManage";
import blockAnalysis from "@/views/blockAnalysis/blockAnalysis";
import businessBlock from "@/views/blockAnalysis/businessBlock";
import assertsDetail from "@/views/blockAnalysis/components/assertsDetail.vue";
import noTaxDetail from "@/views/blockAnalysis/components/noTaxDetail.vue";
import payDetail from "@/views/blockAnalysis/components/payDetail.vue";
import projectDetail from "@/views/blockAnalysis/components/projectDetail.vue";
import budgetAssert from "@/views/budgetPortrait/budgetAssert/budgetAssert.vue";
import budgetDetail from "@/views/budgetPortrait/budgetDetail/index.vue";
import budgetPortrait from "@/views/budgetPortrait/budgetPortrait";
import budgetProject from "@/views/budgetPortrait/budgetProject/budgetProject.vue";
import budgetPublic from "@/views/budgetPortrait/budgetPublic/budgetPublic.vue";
import budgetTax from "@/views/budgetPortrait/budgetTax/budgetTax.vue";
import configManage from "@/views/configManage";
import modelsManage from "@/views/configManage/modelsManage";
import schedulesManage from "@/views/configManage/schedulesManage";
import templatesManage from "@/views/configManage/templatesManage";
import rulesManage from "@/views/configManage/warningRules";
import financialMain from "@/views/financialAnalysis/financialMain/financialMain.vue";
import financialAnalysis from "@/views/financialAnalysis/index.vue";
import blueprintManage from "@/views/graphsStructure/blueprintManage";
import graphsManage from "@/views/graphsStructure/graphsManage";
import budgetExecution from "@/views/managePortrait/components/budgetExecution.vue";
import economicStructure from "@/views/managePortrait/components/economicStructure.vue";
import expenditureBalance from "@/views/managePortrait/components/expenditureBalance.vue";
import intercompanyTransfer from "@/views/managePortrait/components/intercompanyTransfer.vue";
import publicFunds from "@/views/managePortrait/components/publicFunds.vue";
import managePortrait from "@/views/managePortrait/managePortrait";
import portraitDetail from "@/views/managePortrait/portraitDetail/index.vue";
import riskPermission from "@/views/riskWarning/riskPermission.vue";
import riskWarning from "@/views/riskWarning/riskWarning.vue";
// import riskWarningInfo from "@/views/riskWarning/riskWarningInfo"; // 一期线索
import structureAnalysis from "@/views/structureAnalysis";

const pierceLogin = () =>
  import(/* webpackChunkName: "login" */ "@/views/pierceLogin/pierceLogin");

Vue.use(VueRouter);

// 重复点菜单报错问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

export const baseRoutes = [
  {
    path: "/",
    name: "layout",
    component: layout,
    redirect: "audit-mode",
    children: [
      {
        path: "audit-mode",
        name: "auditMode",
        component: auditMode,
        redirect: "/audit-mode/business-portraits",
        children: [
          {
            path: "business-portraits",
            name: "businessPortraits",
            component: businessPortraits,
            meta: {
              keepAlive: true,
            },
          },
        ],
      },
      {
        path: "risk-warning",
        name: "riskWarning",
        component: riskWarning,
        // redirect: "/risk-warning/info",
        // children: [
        //   {
        //     path: "info",
        //     name: "riskWarningInfo",
        //     component: riskWarningInfo,
        //     meta: {
        //       keepAlive: true,
        //     },
        //   },
        // ],
      },
      {
        path: "risk-permission",
        name: "riskPermission",
        component: riskPermission,
      },
      {
        path: "config-manage",
        name: "configManage",
        component: configManage,
        redirect: "/config-manage/rules",
        children: [
          {
            path: "rules",
            name: "rulesManage",
            component: rulesManage,
            meta: {
              keepAlive: true,
            },
          },
          {
            path: "conditions",
            name: "conditionsManage",
            component: conditionsManage,
            meta: {
              keepAlive: true,
            },
          },
        ],
      },
      {
        path: "block-analysis",
        name: "blockAnalysis",
        component: blockAnalysis,
        redirect: "/block-analysis/business-block",
        children: [
          {
            path: "business-block",
            name: "businessBlock",
            component: businessBlock,
            // meta: {
            //   keepAlive: true,
            // },
          },
          {
            path: "pay-detail",
            name: "payDetail",
            component: payDetail,
            // meta: {
            //   keepAlive: true,
            // },
          },
          {
            path: "no-tax-detail",
            name: "noTaxDetail",
            component: noTaxDetail,
            // meta: {
            //   keepAlive: true,
            // },
          },
          {
            path: "asserts-detail",
            name: "assertsDetail",
            component: assertsDetail,
            // meta: {
            //   keepAlive: true,
            // },
          },
          {
            path: "project-detail",
            name: "projectDetail",
            component: projectDetail,
            // meta: {
            //   keepAlive: true,
            // },
          },
        ],
      },
      {
        path: "asserts-analysis",
        name: "assertsAnalysis",
        component: assertsAnalysis,
        redirect: "/asserts-analysis/asserts-main",
        children: [
          {
            path: "asserts-main",
            name: "assertsMain",
            component: assertsMain,
            // meta: {
            //   keepAlive: true,
            // },
          },
          {
            path: "card-detail",
            name: "cardDetail",
            component: cardDetail,
            // meta: {
            //   keepAlive: true,
            // },
          },
          {
            path: "disposal-detail",
            name: "disposalDetail",
            component: disposalDetail,
            // meta: {
            //   keepAlive: true,
            // },
          },
        ],
      },
      {
        path: "financial-analysis",
        name: "financialAnalysis",
        component: financialAnalysis,
        redirect: "/financial-analysis/financial-main",
        children: [
          {
            path: "financial-main",
            name: "financialMain",
            component: financialMain,
            // meta: {
            //   keepAlive: true,
            // },
          },
          // {
          //   path: "card-detail",
          //   name: "cardDetail",
          //   component: cardDetail,
          //   meta: {
          //     keepAlive: true,
          //   },
          // },
          // {
          //   path: "disposal-detail",
          //   name: "disposalDetail",
          //   component: disposalDetail,
          //   meta: {
          //     keepAlive: true,
          //   },
          // },
        ],
      },
      {
        path: "manage-portrait",
        name: "managePortrait",
        component: managePortrait,
        redirect: "/manage-portrait/portrait-detail",
        children: [
          {
            path: "portrait-detail",
            name: "portraitDetail",
            component: portraitDetail,
            // meta: {
            //   keepAlive: true,
            // },
          },
          // 异常分析
          {
            path: "budget-execution",
            name: "budgetExecution",
            component: budgetExecution,
            // meta: {
            //   keepAlive: true,
            // },
          },
          {
            path: "expenditure-balance",
            name: "expenditureBalance",
            component: expenditureBalance,
            // meta: {
            //   keepAlive: true,
            // },
          },
          {
            path: "intercompany-transfer",
            name: "intercompanyTransfer",
            component: intercompanyTransfer,
            // meta: {
            //   keepAlive: true,
            // },
          },
          {
            path: "public-funds",
            name: "publicFunds",
            component: publicFunds,
            // meta: {
            //   keepAlive: true,
            // },
          },
          {
            path: "economic-structure",
            name: "economicStructure",
            component: economicStructure,
            // meta: {
            //   keepAlive: true,
            // },
          },
        ],
      },
      {
        path: "budget-portrait",
        name: "budgetPortrait",
        component: budgetPortrait,
        redirect: "/budget-portrait/budget-detail",
        children: [
          {
            path: "budget-detail",
            name: "budgetDetail",
            component: budgetDetail,
            // meta: {
            //   keepAlive: true,
            // },
          },
          {
            path: "budget-project",
            name: "budgetProject",
            component: budgetProject,
            // meta: {
            //   keepAlive: true,
            // },
          },
          {
            path: "budget-tax",
            name: "budgetTax",
            component: budgetTax,
            // meta: {
            //   keepAlive: true,
            // },
          },
          {
            path: "budget-public",
            name: "budgetPublic",
            component: budgetPublic,
            // meta: {
            //   keepAlive: true,
            // },
          },
          {
            path: "budget-assert",
            name: "budgetAssert",
            component: budgetAssert,
            // meta: {
            //   keepAlive: true,
            // },
          },
        ],
      },
      {
        path: "structure-analysis",
        name: "structureAnalysis",
        component: structureAnalysis,
      },
      {
        path: "graph",
        name: "graphsManage",
        component: graphsManage,
        // meta: {
        //   keepAlive: true,
        // },
      },
      {
        path: "blueprint",
        name: "blueprintManage",
        component: blueprintManage,
        // meta: {
        //   keepAlive: true,
        // },
      },
      {
        path: "template",
        name: "templatesManage",
        component: templatesManage,
        // meta: {
        //   keepAlive: true,
        // },
      },
      {
        path: "model",
        name: "modelsManage",
        component: modelsManage,
        // meta: {
        //   keepAlive: true,
        // },
      },
      {
        path: "schedule",
        name: "schedulesManage",
        component: schedulesManage,
        // meta: {
        //   keepAlive: true,
        // },
      },
    ],
  },
  {
    path: "/login",
    name: "pierceLogin",
    component: pierceLogin,
  },
  {
    path: "*",
    redirect: "/",
  },
];

// 根据用户权限配置路由
// const restRoutes = [];
// const routes = cloneDeep(baseRoutes);

// routes[0].children.map((item) => {
//   if (item.name) {
//     const flag = store.state.rightsOptions.userRights[`${item.name}`];
//     if (flag) {
//       if (item.children && item.children.length) {
//         const carr = [];
//         item.children.map((citem) => {
//           const cflag = store.state.rightsOptions.userRights[`${citem.name}`];
//           if (cflag) {
//             carr.push(citem);
//           }
//         });
//         item.children = carr;
//       }
//       restRoutes.push(item);
//     }
//   } else {
//     const flag = store.state.rightsOptions.userRights["affairGraph"];
//     if (flag) {
//       restRoutes.push(item);
//     }
//   }
// });

// const finalRoutes = [
//   {
//     path: "/",
//     name: "layout",
//     component: layout,
//     redirect:
//       restRoutes[0].children && restRoutes[0].children.length
//         ? restRoutes[0].children[0].path === ""
//           ? `${restRoutes[0].path}`
//           : `${restRoutes[0].path}/${restRoutes[0].children[0].path}`
//         : restRoutes[0].path,
//     children: restRoutes,
//   },
//   {
//     path: "/login",
//     name: "pierceLogin",
//     component: pierceLogin,
//   },
//   {
//     path: "*",
//     redirect: "/",
//   },
// ];

export const router = new VueRouter({
  // mode: "history", //打包是换hash  history无#号
  mode: "hash", // 打包是换hash   hash有#号
  base: process.env.BASE_URL,
  // routes: finalRoutes,
  routes: baseRoutes,
});

// 全局路由守卫
// router.beforeEach((to, from, next) => {
//   // next();
//   if (
//     store.state.rightsOptions.userInfo &&
//     store.state.rightsOptions.userInfo.token
//   ) {
//     if (to.path === "/login") {
//       next({ path: "/" });
//     } else {
//       next();
//     }
//   } else {
//     if (to.path === "/login") {
//       next();
//     } else {
//       message.error("登陆超时，请重新登陆！", 2);
//       next({ path: "/login" });
//     }
//   }
// });
