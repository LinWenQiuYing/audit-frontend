<template>
  <div class="asserts-analysis-content">
    <div class="layout-btns">
      <div class="layout-btns-item">
        <a-button
          type="primary"
          :class="overviewShow ? 'layout-btn active' : 'layout-btn'"
          @click="handleSkip('资产总览')"
        >
          <span class="layout-btn-text">资产总览</span>
        </a-button>
      </div>
      <div class="layout-btns-item">
        <a-button
          type="primary"
          :class="cardShow ? 'layout-btn active' : 'layout-btn'"
          @click="handleSkip('资产卡片')"
        >
          <span class="layout-btn-text">资产卡片</span>
        </a-button>
      </div>
      <!-- <div class="layout-btns-item">
        <a-button
          type="primary"
          :class="changeShow ? 'layout-btn active' : 'layout-btn'"
          @click="handleSkip('资产变动')"
        >
          <span class="layout-btn-text">资产变动</span>
        </a-button>
      </div>
      <div class="layout-btns-item">
        <a-button
          type="primary"
          :class="queryShow ? 'layout-btn active' : 'layout-btn'"
          @click="handleSkip('标准表查询')"
        >
          <span class="layout-btn-text">标准表查询</span>
        </a-button>
      </div> -->
    </div>
    <AssertsOverview v-if="overviewShow"></AssertsOverview>
    <AssertsCard v-if="cardShow"></AssertsCard>
    <!-- <AssertsChange v-if="changeShow"></AssertsChange>
    <FormQuery v-if="queryShow"></FormQuery> -->
  </div>
</template>
<script>
import { Button } from "ant-design-vue";
import AssertsCard from "./assertsCard.vue";
// import AssertsChange from "./assertsChange.vue";
import AssertsOverview from "./assertsOverview.vue";
// import FormQuery from "./formQuery.vue";
export default {
  name: "assertsMain",
  data() {
    return {
      overviewShow: true, //资产总览
      cardShow: false, //资产卡片
      changeShow: false, //资产变动
      queryShow: false, //标准表查询
    };
  },
  components: {
    AssertsOverview,
    AssertsCard,
    // AssertsChange,
    // FormQuery,
    AButton: Button,
  },
  methods: {
    handleSkip(type) {
      switch (type) {
        case "资产总览":
          this.overviewShow = true;
          this.cardShow = false;
          this.changeShow = false;
          this.queryShow = false;
          break;
        case "资产卡片":
          this.overviewShow = false;
          this.cardShow = true;
          this.changeShow = false;
          this.queryShow = false;
          break;
        case "资产变动":
          this.overviewShow = false;
          this.cardShow = false;
          this.changeShow = true;
          this.queryShow = false;
          break;
        case "标准表查询":
          this.overviewShow = false;
          this.cardShow = false;
          this.changeShow = false;
          this.queryShow = true;
          break;
        default:
          break;
      }
    },
  },
};
</script>
<style lang="less">
.asserts-analysis {
  &-content {
    width: 100%;
    min-height: 100%;
    // height: 100%;
    padding: 20px;
    background: #ffffff;

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
          // background-image: linear-gradient(
          //   to right,
          //   rgba(1, 110, 255, 0.6),
          //   rgba(1, 110, 255)
          // );
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
}
</style>
