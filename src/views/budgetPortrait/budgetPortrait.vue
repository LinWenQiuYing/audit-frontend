<template>
  <div class="budget-portrait">
    <MainContent
      title="预算单位画像"
      :curTreeItem="curTreeItem"
      :curTreeItemFather="curTreeItemFather"
    >
      <template slot="content">
        <div class="budget-portrait-content">
          <LeftTree parentType="budget" />
          <router-view />
        </div>
      </template>
    </MainContent>
  </div>
</template>
<script>
import LeftTree from "@/components/leftTree.vue";
import MainContent from "@/components/mainContent";
import { mapMutations, mapState } from "vuex";

export default {
  name: "BudgetPortrait",
  data() {
    return {};
  },
  components: {
    MainContent,
    LeftTree,
  },
  computed: {
    ...mapState("blockAnalysis", ["blockChoosedYear"]),
    ...mapState("budgetPortrait", ["curTreeItem", "curTreeItemFather"]),
  },
  mounted() {},
  methods: {
    ...mapMutations("blockAnalysis", {
      setBlockChoosedYear: "setBlockChoosedYear",
    }),
    ...mapMutations("budgetPortrait", {
      setCurTreeItem: "setCurTreeItem",
    }),
  },
};
</script>
<style lang="less">
.budget-portrait {
  width: 100%;
  height: 100%;

  .budget-detail {
    min-height: calc(100vh - 186px);
  }

  &-content {
    display: flex;
    background: #fff;
    height: 100%;
    overflow: auto;
  }

  .budget-detail,
  .budget-assert,
  .budget-tax,
  .budget-public,
  .budget-project {
    // margin-left: 320px;
    margin-left: 300px;
  }
}
</style>
