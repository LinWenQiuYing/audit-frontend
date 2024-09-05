import { setTheme } from "@/assets/theme/theme";
import { getParamsObj, getUserInfo, getUserRights } from "@/utils/common.js";
import Vue from "vue";
import Vuex from "vuex";
import { blockAnalysis } from "./blockAnalysis";
import { managePortrait } from "./managePortrait";
import { budgetPortrait } from "./budgetPortrait";

Vue.use(Vuex);
localStorage.setItem("isClear", false);
const isClear = localStorage.getItem("isClear");
if (isClear == "false") {
  setTheme("blueWhite");
  // localStorage.setItem("isClear", true);
}

const rightsOptions = {
  namespaced: true,
  state: {
    userInfo: getUserInfo() || {},
    userRights: getUserRights() || {
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
      graphsManage: true,
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
      rulesConditions: true,
    },
    userBaseRights: {},
    resourceList: [],
    agencys: [],
    users: [],
    theme: localStorage.getItem("theme") || "blueWhite",
  },
  mutations: {
    setAgencys(state, value) {
      state.agencys = value;
    },
    setUsers(state, value) {
      state.users = value;
    },
    setUserInfo(state, value) {
      state.userInfo = value;
    },
    setUserRights(state, value) {
      state.userRights = value;
    },
    setUserBaseRights(state, value) {
      state.userBaseRights = value;
    },
    setResourceList(state, value) {
      state.resourceList = value;
    },
    setTheme(state, value) {
      state.theme = value;
      setTheme(value);
    },
  },
  actions: {},
  getters: {},
};

const graphOptions = {
  namespaced: true,
  state: {
    firstNode: JSON.parse(sessionStorage.getItem("firstNode")) || {},
    searchVertex: JSON.parse(sessionStorage.getItem("searchVertex")) || [],
    branchId: sessionStorage.getItem("branchId") || undefined, // branchId为原业务中的branchId，与kg有关
    graphId: sessionStorage.getItem("graphId") || undefined, // graphId为图的自身id
    searchNames: [], // 图谱探索搜索的对象名称集合
    sentence: undefined,
  },
  mutations: {
    setFirstNode(state, node) {
      state.firstNode = node;
    },
    setSearchVertex(state, nodes) {
      state.searchVertex = nodes;
    },
    setBranchId(state, value) {
      state.branchId = value;
    },
    setGraphId(state, value) {
      state.graphId = value;
    },
    setSearchNames(state, value) {
      state.searchNames = value;
    },
    setSentence(state, value) {
      state.sentence = value;
    },
  },
  actions: {},
  getters: {},
};

const auditOptions = {
  namespaced: true,
  state: {
    childPartShow: false, // 是否显示子组件
    businessPortraitsShow: true, // 企业画像
    transactionChainShow: false, // 上下游交易链
    purchaseSalesCategoryShow: false, // 购销品类
    groupStructureShow: false, // 集团架构
    auditResultApplyShow: false, // 审计结果运用
    groupPortraitShow: false, // 集团画像
    stockGraphShow: false, //股权穿透
    //演示修改 todo gj
    // paramsObj: getParamsObj() || {
    //   corpName: "上海国际港务（集团)股份有限公司",
    //   uniScId: "913100001322075806",
    // },
    paramsObj: getParamsObj() || {},
    classifyCounts: {
      riskInfo: 0,
      condition: 0,
      rule: 0,
      entCount: 0,
    },
  },
  mutations: {
    setChildPartShow(state, value) {
      state.childPartShow = value;
    },
    setBusinessPortraitsShow(state, value) {
      state.businessPortraitsShow = value;
    },
    setTransactionChainShow(state, value) {
      state.transactionChainShow = value;
    },
    setPurchaseSalesCategoryShow(state, value) {
      state.purchaseSalesCategoryShow = value;
    },
    setGroupStructureShow(state, value) {
      state.groupStructureShow = value;
    },
    setGroupPortraitShow(state, value) {
      state.groupPortraitShow = value;
    },
    setStockGraphShow(state, value) {
      state.stockGraphShow = value;
    },
    setAuditResultApplyShow(state, value) {
      state.auditResultApplyShow = value;
    },
    setParamsObj(state, value) {
      state.paramsObj = value;
    },
    setClassifyCounts(state, value) {
      state.classifyCounts = value;
    },
  },
  actions: {},
  getters: {},
};

export default new Vuex.Store({
  modules: {
    rightsOptions,
    graphOptions,
    auditOptions,

    //三期
    blockAnalysis,
    managePortrait,
    budgetPortrait,
  },
});
