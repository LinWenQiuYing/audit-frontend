export const budgetPortrait = {
  namespaced: true,
  state: {
    curTreeItem: {}, //选中树节点数据
    curTreeItemFather: {}, //选中树节点的最近一级父节点数据
  },
  mutations: {
    setCurTreeItem(state, value) {
      state.curTreeItem = value;
    },
    setCurTreeItemFather(state, value) {
      state.curTreeItemFather = value;
    },
  },
  actions: {},
  getters: {},
};
