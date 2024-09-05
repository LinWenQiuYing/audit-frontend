export const managePortrait = {
  namespaced: true,
  state: {
    //初始展开的节点
    defaultKey: [],
    treeData: [
      // {
      //   title: "0-0",
      //   key: "0-0",
      //   slots: {
      //     icon: "city",
      //   },
      //   disabled: true,
      //   children: [
      //     {
      //       title: "0-0-0",
      //       key: "0-0-0",
      //       slots: {
      //         icon: "manage",
      //       },
      //       children: [
      //         {
      //           title: "0-0-0-0",
      //           key: "0-0-0-0",
      //           slots: {
      //             icon: "budget",
      //           },
      //         },
      //         {
      //           title: "0-0-0-1",
      //           key: "0-0-0-1",
      //           slots: {
      //             icon: "budget",
      //           },
      //         },
      //         {
      //           title: "0-0-0-2",
      //           key: "0-0-0-2",
      //           slots: {
      //             icon: "budget",
      //           },
      //         },
      //       ],
      //     },
      //     {
      //       title: "0-0-1",
      //       key: "0-0-1",
      //       slots: {
      //         icon: "manage",
      //       },
      //       children: [
      //         {
      //           title: "0-0-1-0",
      //           key: "0-0-1-0",
      //           slots: {
      //             icon: "budget",
      //           },
      //         },
      //         {
      //           title: "0-0-1-1",
      //           key: "0-0-1-1",
      //           slots: {
      //             icon: "budget",
      //           },
      //         },
      //         {
      //           title: "0-0-1-2",
      //           key: "0-0-1-2",
      //           slots: {
      //             icon: "budget",
      //           },
      //         },
      //       ],
      //     },
      //   ],
      // },
    ],
    curTreeItem: {}, // 选中树节点数据
    curTreeItemFather: {}, //选中树节点的最近一级父节点数据
    // 参数配置
    configParams: {
      curYear: "2023",
      fundType: [],
      ratioNumber: 0.25,
      highExecutionRate: 0.98,
      lowExecutionRate: 0.7,
      highProjectExpenditure: undefined,
      highProjectRevenue: undefined,
    },
  },
  mutations: {
    setDefaultKey(state, value) {
      state.defaultKey = value;
    },
    setTreeData(state, value) {
      state.treeData = value;
    },
    setCurTreeItem(state, value) {
      state.curTreeItem = value;
    },
    setCurTreeItemFather(state, value) {
      state.curTreeItemFather = value;
    },
    setConfigParams(state, value) {
      state.configParams = value;
    },
  },
  actions: {},
  getters: {},
};
