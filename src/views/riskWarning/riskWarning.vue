<template>
  <div class="risk-warning">
    <!-- <router-view></router-view> -->
    <MainContent>
      <template slot="title">
        <span class="header-title" @click="handleClickRisk">风险线索</span>
      </template>
      <template slot="content">
        <a-tabs
          v-model="activeKey"
          class="risk-warning-tabs"
          @change="onChange"
        >
          <a-tab-pane key="1" tab="图模型线索">
            <RiskGraphList
              v-if="isRiskListShow && activeKey === '1'"
              @detailChange="detailChange"
              @isRiskListShowChange="isRiskListShowChange"
            />
            <RiskGraphDetails
              v-else-if="!isRiskListShow && activeKey === '1'"
              :details="details"
              :riskInfo="riskInfo"
              @isRiskListShowChange="isRiskListShowChange"
            />
          </a-tab-pane>
          <a-tab-pane key="2" tab="规则线索">
            <RiskRule :riskInfo="riskInfo" v-if="activeKey === '2'" />
          </a-tab-pane>
          <a-tab-pane key="3" tab="全量搜索">
            <AllSearch
              @checkRiskDetail="checkRiskDetail"
              v-if="activeKey === '3'"
            />
          </a-tab-pane>
        </a-tabs>
      </template>
      <template slot="titleChildRoute" v-if="breadcrumb">
        &nbsp;/&nbsp;<span class="header-breadcrumb">{{ breadcrumb }}</span>
      </template>
    </MainContent>
  </div>
</template>
<script>
import { Tabs } from "ant-design-vue";
import MainContent from "@/components/mainContent";
import AllSearch from "./components/allSearch.vue";
import RiskRule from "./components/riskRule.vue";
import RiskGraphList from "./components/riskGraphList.vue";
import RiskGraphDetails from "./components/riskGraphDetails.vue";

export default {
  name: "RiskWarning",
  data() {
    return {
      activeKey: "1",
      isRiskListShow: true,
      details: {},
      riskInfo: {},
    };
  },
  components: {
    ATabs: Tabs,
    ATabPane: Tabs.TabPane,
    AllSearch,
    MainContent,
    RiskRule,
    RiskGraphList,
    RiskGraphDetails,
  },
  computed: {
    breadcrumb() {
      if (this.activeKey == "1") {
        if (!this.isRiskListShow) {
          return "线索列表";
        } else {
          return null;
        }
      } else {
        return null;
      }
    },
  },
  methods: {
    onChange() {
      if (this.activeKey == "1") {
        this.isRiskListShow = true;
      }
    },
    isRiskListShowChange(value) {
      this.isRiskListShow = value;
    },
    handleClickRisk() {
      this.isRiskListShow = true;
    },
    detailChange(record) {
      this.details = record;
    },
    checkRiskDetail(type, record) {
      if (type == "graph") {
        this.activeKey = "1";
        this.isRiskListShow = false;
      } else {
        this.activeKey = "2";
      }
      this.riskInfo = record;
    },
  },
};
</script>
<style lang="less">
.risk-warning {
  width: 100%;
  height: 100%;
  border-radius: 5px;

  .header-title {
    cursor: pointer;
  }

  .header-breadcrumb {
    margin-left: 20px;
    font-size: 18px;
  }

  &-tabs {
    height: 100%;

    .ant-tabs-content {
      height: calc(100% - 60px);
    }
  }
}
</style>
