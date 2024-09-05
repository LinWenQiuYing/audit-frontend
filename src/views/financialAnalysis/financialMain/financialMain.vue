<template>
  <div class="financial-main">
    <div class="layout-btns">
      <div class="layout-btns-item">
        <a-button
          type="primary"
          :class="electronicBookShow ? 'layout-btn active' : 'layout-btn'"
          @click="handleSkip('电子帐簿信息')"
        >
          <span class="layout-btn-text">电子帐簿信息</span>
        </a-button>
      </div>
      <div class="layout-btns-item">
        <a-button
          type="primary"
          :class="generalDetailsShow ? 'layout-btn active' : 'layout-btn'"
          @click="handleSkip('总账明细账')"
        >
          <span class="layout-btn-text">总账明细账</span>
        </a-button>
      </div>
      <div class="layout-btns-item">
        <a-button
          type="primary"
          :class="comparativeAnalysisShow ? 'layout-btn active' : 'layout-btn'"
          @click="handleSkip('对比分析')"
        >
          <span class="layout-btn-text">对比分析</span>
        </a-button>
      </div>
      <div class="layout-btns-item">
        <a-button
          type="primary"
          :class="comprehensiveQueryShow ? 'layout-btn active' : 'layout-btn'"
          @click="handleSkip('综合查询')"
        >
          <span class="layout-btn-text">综合查询</span>
        </a-button>
      </div>
    </div>
    <ElectronicBookShow v-if="electronicBookShow"></ElectronicBookShow>
    <GeneralDetails v-if="generalDetailsShow"></GeneralDetails>
    <ComparativeAnalysis v-if="comparativeAnalysisShow"></ComparativeAnalysis>
    <ComprehensiveQuery v-if="comprehensiveQueryShow"></ComprehensiveQuery>
  </div>
</template>
<script>
import { Button } from "ant-design-vue";
import ComparativeAnalysis from "./comparativeAnalysis";
import ComprehensiveQuery from "./comprehensiveQuery/comprehensiveQuery.vue";
import ElectronicBookShow from "./electronicBook";
import GeneralDetails from "./generalDetails/generalDetails.vue";
export default {
  name: "FinancialMain",
  data() {
    return {
      electronicBookShow: true, //电子账簿
      generalDetailsShow: false, //总账明细
      comparativeAnalysisShow: false, //对比分析
      comprehensiveQueryShow: false, //综合查询
    };
  },
  computed: {
    // ...mapState("auditOptions", ["paramsObj"]),
  },
  components: {
    AButton: Button,
    ElectronicBookShow,
    GeneralDetails,
    ComparativeAnalysis,
    ComprehensiveQuery,
  },
  methods: {
    handleSkip(type) {
      switch (type) {
        case "电子帐簿信息":
          this.electronicBookShow = true;
          this.generalDetailsShow = false;
          this.comparativeAnalysisShow = false;
          this.comprehensiveQueryShow = false;
          break;
        case "总账明细账":
          this.electronicBookShow = false;
          this.generalDetailsShow = true;
          this.comparativeAnalysisShow = false;
          this.comprehensiveQueryShow = false;
          break;
        case "对比分析":
          this.electronicBookShow = false;
          this.generalDetailsShow = false;
          this.comparativeAnalysisShow = true;
          this.comprehensiveQueryShow = false;
          break;
        case "综合查询":
          this.electronicBookShow = false;
          this.generalDetailsShow = false;
          this.comparativeAnalysisShow = false;
          this.comprehensiveQueryShow = true;
          break;
        default:
          break;
      }
    },
  },
};
</script>
<style lang="less">
.financial-main {
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 186px);
  background: #ffffff;
  padding: 20px;
  // position: relative;

  .layout-btns {
    width: 100%;
    // padding: 24px;
    display: flex;
    background: #fff;
    position: relative;
    align-items: center;
    transition: all 0.3s;
    margin-bottom: 20px;

    &-item {
      margin-right: 14px;

      .layout-btn {
        border: none;
        border-radius: 2px !important;
        background: linear-gradient(
          to right,
          rgba(1, 110, 255, 0.6),
          rgba(1, 110, 255)
        );
        color: #fff;
        padding: 0 14px;
        display: flex;
        align-items: center;

        &-img {
          height: 20px;
          width: 28px;
          padding-right: 8px;
          display: flex;
        }

        &-text {
          font-size: 16px;
        }

        &.active {
          color: @cyan;
        }
      }
      .layout-btn-disable {
        border: none;
        border-radius: 2px !important;
        background: linear-gradient(
          to right,
          rgba(119, 136, 153, 0.6),
          rgba(211, 211, 211)
        ) !important;
        cursor: not-allowed;
        color: #fff;
        padding: 0 14px;
        display: flex;
        align-items: center;

        &-img {
          height: 20px;
          width: 28px;
          padding-right: 8px;
          display: flex;
        }

        &-text {
          font-size: 16px;
        }
      }
    }
  }

  @media screen and (max-width: 1356px) {
    .layout-btns {
      &-item {
        margin-right: 8px;

        .layout-btn {
          padding: 0 8px;
        }
      }
    }
  }
}
</style>
