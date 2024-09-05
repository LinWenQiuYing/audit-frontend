export const blockAnalysis = {
  namespaced: true,
  state: {
    choosedBlockName: [], //选中板块名称
    choosedBlockId: [], //选中板块Id
    spendingShow: true, // 支出情况
    threePublicShow: false, // 三公费用
    noTaxShow: false, // 税收入
    assertsShow: false, // 资产情况
    blockChoosedYear: 2023, //选中年份

    // classifyCounts: {
    //   riskInfo: 0,
    //   condition: 0,
    //   rule: 0,
    // },
  },
  mutations: {
    setChoosedBlockName(state, value) {
      state.choosedBlockName = value;
    },
    setChoosedBlockId(state, value) {
      state.choosedBlockId = value;
    },
    setSpendingShow(state, value) {
      state.spendingShow = value;
    },
    setThreePublicShow(state, value) {
      state.threePublicShow = value;
    },
    setNoTaxShow(state, value) {
      state.noTaxShow = value;
    },
    setAssertsShow(state, value) {
      state.assertsShow = value;
    },

    setBlockChoosedYear(state, value) {
      state.blockChoosedYear = value;
    },
  },
  actions: {},
  getters: {},
};
