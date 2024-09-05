<template>
  <div class="comprehensive-query">
    <div class="comprehensive-query-wrapper">
      <a-tabs
        class="comprehensive-query-wrapper-tabs"
        default-active-key="1"
        tab-position="left"
        :active-key="activeKey"
        @change="onKeychange"
      >
        <a-tab-pane :key="1" tab="会计期间定义">
          <AccountPeriod></AccountPeriod>
        </a-tab-pane>
        <a-tab-pane :key="2" tab="会计科目表">
          <ChartAccounts></ChartAccounts>
        </a-tab-pane>
        <a-tab-pane :key="3" tab="科目年初数表">
          <OpeningChart></OpeningChart>
        </a-tab-pane>
        <a-tab-pane :key="4" tab="科目余额表">
          <AccountBalance></AccountBalance>
        </a-tab-pane>
        <a-tab-pane :key="5" tab="记账凭证表">
          <AccountVoucher></AccountVoucher>
        </a-tab-pane>
        <a-tab-pane :key="6" tab="辅助信息表">
          <AuxiliaryInfo></AuxiliaryInfo>
        </a-tab-pane>
        <a-tab-pane :key="7" tab="辅助类型表">
          <AuxiliaryType></AuxiliaryType>
        </a-tab-pane>
        <a-tab-pane :key="8" tab="辅助年初数表">
          <AuxiliaryBegin></AuxiliaryBegin>
        </a-tab-pane>
        <a-tab-pane :key="9" tab="辅助余额表">
          <AuxiliaryBalance></AuxiliaryBalance>
        </a-tab-pane>
        <a-tab-pane :key="10" tab="凭证辅助明细表">
          <VoucherAuxiliary></VoucherAuxiliary>
        </a-tab-pane>
        <a-tab-pane :key="11" tab="预算单位表">
          <BudgetUnit></BudgetUnit>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script>
import { Tabs } from "ant-design-vue";
import AccountBalance from "./components/accountBalance.vue";
import AccountPeriod from "./components/accountPeriod.vue";
import AccountVoucher from "./components/accountVoucher.vue";
import AuxiliaryBegin from "./components/auxiliaryBegin.vue";
import AuxiliaryInfo from "./components/auxiliaryInfo.vue";
import AuxiliaryType from "./components/auxiliaryType.vue";
import ChartAccounts from "./components/chartAccounts.vue";
import OpeningChart from "./components/openingChart.vue";
import AuxiliaryBalance from "./components/auxiliaryBalance.vue";
import VoucherAuxiliary from "./components/voucherAuxiliary.vue";
import BudgetUnit from "./components/budgetUnit.vue";
const { TabPane } = Tabs;
export default {
  name: "ComprehensiveQuery",
  data() {
    return {
      //左侧tab数据
      activeKey: 1,
    };
  },
  computed: {
    // ...mapState("auditOptions", ["paramsObj"]),
  },
  components: {
    AccountPeriod,
    ChartAccounts,
    OpeningChart,
    AccountBalance,
    AccountVoucher,
    AuxiliaryInfo,
    AuxiliaryType,
    AuxiliaryBegin,
    AuxiliaryBalance,
    VoucherAuxiliary,
    BudgetUnit,
    ATabs: Tabs,
    ATabPane: TabPane,
  },
  methods: {
    onKeychange(activeKey) {
      this.activeKey = activeKey;
    },
  },
};
</script>

<style lang="less">
.comprehensive-query {
  width: 100%;
  height: calc(100% - 52px);

  &-wrapper {
    width: 100%;
    height: 100%;

    &-tabs {
      height: 100%;
      margin-right: 0px;
    }
  }

  .account-period,
  .chart-accounts,
  .opening-chart,
  .account-balance,
  .account-voucher,
  .auxiliary-info,
  .auxiliary-type,
  .auxiliary-begin,
  .auxiliary-balance,
  .voucher-auxiliary,
  .budget-unit {
    .common-list-header {
      display: none;
    }
  }
}

.ant-tabs .ant-tabs-left-content {
  padding-left: 0px; //tab右侧内容自带的padding清空
  border-left: 1px solid #e8e8e8;
}
</style>
