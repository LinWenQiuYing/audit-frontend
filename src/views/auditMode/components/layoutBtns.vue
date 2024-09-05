<template>
  <div class="layout-btns">
    <div class="layout-btns-item">
      <a-button
        type="primary"
        :class="businessPortraitsShow ? 'layout-btn active' : 'layout-btn'"
        @click="handleSkip('businessPortraits')"
      >
        <div class="layout-btn-img">
          <icon-svg
            :color="businessPortraitsShow ? '#30F2CB' : '#fff'"
            icon-class="企业"
          />
        </div>
        <span class="layout-btn-text">企业画像</span>
      </a-button>
    </div>
    <div class="layout-btns-item">
      <a-button
        type="primary"
        :class="transactionChainShow ? 'layout-btn active' : 'layout-btn'"
        @click="handleSkip('transactionChain')"
      >
        <div class="layout-btn-img">
          <icon-svg
            :color="transactionChainShow ? '#30F2CB' : '#fff'"
            icon-class="上下游"
          />
        </div>
        <span class="layout-btn-text">上下游交易</span>
      </a-button>
    </div>
    <div class="layout-btns-item">
      <a-button
        type="primary"
        :class="purchaseSalesCategoryShow ? 'layout-btn active' : 'layout-btn'"
        @click="handleSkip('purchaseSalesCategory')"
      >
        <div class="layout-btn-img">
          <icon-svg
            :color="purchaseSalesCategoryShow ? '#30F2CB' : '#fff'"
            icon-class="品类"
          />
        </div>
        <span class="layout-btn-text">购销品类</span>
      </a-button>
    </div>
    <div class="layout-btns-item">
      <a-button
        type="primary"
        :class="groupStructureShow ? 'layout-btn active' : 'layout-btn'"
        @click="handleSkip('groupStructure')"
      >
        <div class="layout-btn-img">
          <icon-svg
            :color="groupStructureShow ? '#30F2CB' : '#fff'"
            icon-class="架构"
          />
        </div>
        <span class="layout-btn-text">集团架构</span>
      </a-button>
    </div>
    <div class="layout-btns-item">
      <a-button
        type="primary"
        class="layout-btn"
        @click="handleSkip('relationGraph')"
      >
        <div class="layout-btn-img">
          <icon-svg color="#fff" icon-class="关系" />
        </div>
        <span class="layout-btn-text">关联关系</span>
      </a-button>
    </div>
    <div class="layout-btns-item">
      <a-button
        type="primary"
        :class="stockGraphShow ? 'layout-btn active' : 'layout-btn'"
        @click="handleSkip('stockGraph')"
      >
        <div class="layout-btn-img">
          <!-- todo  修改图标 -->
          <icon-svg
            :color="stockGraphShow ? '#30F2CB' : '#fff'"
            icon-class="架构"
          />
        </div>
        <span class="layout-btn-text">股权穿透</span>
      </a-button>
    </div>
    <div class="layout-btns-item">
      <a-button
        type="primary"
        class="layout-btn-disable"
        @click="handleSkip('auditResultApply')"
      >
        <div class="layout-btn-img">
          <icon-svg
            :color="auditResultApplyShow ? '#30F2CB' : '#fff'"
            icon-class="统计"
          />
        </div>
        <span class="layout-btn-text">审计结果运用</span>
      </a-button>
    </div>
  </div>
</template>
<script>
import { Button } from "ant-design-vue";
import { mapMutations, mapState } from "vuex";

export default {
  name: "LayoutBtns",
  data() {
    return {};
  },
  components: {
    AButton: Button,
  },
  computed: {
    ...mapState("auditOptions", [
      "childPartShow",
      "businessPortraitsShow",
      "transactionChainShow",
      "purchaseSalesCategoryShow",
      "groupStructureShow",
      "auditResultApplyShow",
      "groupPortraitShow",
      "stockGraphShow",
    ]),
  },
  methods: {
    ...mapMutations("auditOptions", {
      setChildPartShow: "setChildPartShow",
      setBusinessPortraitsShow: "setBusinessPortraitsShow",
      setTransactionChainShow: "setTransactionChainShow",
      setPurchaseSalesCategoryShow: "setPurchaseSalesCategoryShow",
      setGroupStructureShow: "setGroupStructureShow",
      setGroupPortraitShow: "setGroupPortraitShow",
      setStockGraphShow: "setStockGraphShow",
      setAuditResultApplyShow: "setAuditResultApplyShow",
    }),
    handleSkip(type) {
      if (type === "businessPortraits") {
        // 企业画像
        this.setBusinessPortraitsShow(true);
        this.setChildPartShow(false);
        this.setTransactionChainShow(false);
        this.setPurchaseSalesCategoryShow(false);
        this.setGroupStructureShow(false);
        this.setGroupPortraitShow(false);
        this.setAuditResultApplyShow(false);
      } else if (type === "relationGraph") {
        window.open(
          //           `https://10.83.70.195/i3mjsnq/clus-21-sophon-infra-3-0-1-04d31a3d/gateway/user/api/users/password-free/login?token=Bearer
          // eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6ImhpdmUiLCJyb2xlcyI6IltcIlNPUEhPTl9BRE1JTlwiXSIsInNjb3BlIjoiZXh0ZXJuYWwiLCJleHAiOjQ4MTQ5MTg3MzMsImlhdCI6MTY2MTMxODczM30.7JO6iYTWnKNwsYaygy5gusvzVflHOedb0Z4vDoAsymZlL_JfFj9Z549g8seopMliYPEEmUGwsIoM2Y5KowQdHA&redirect=https://10.83.70.195/i3mjsnq/clus-21-sophon-infra-3-0-1-04d31a3d/kg/graph_analysis/personalBlueprint/ca0f95a6-f9b6-44ef-ade0-f352a54d5984/9c99fc18-e3b3-4c5c-a0f6-57417da3d0b9/graph_case/14aaf4d2-5cab-4b73-b1fa-2b3350fbd15e&refer=https://10.83.70.195/i3mjsnq/clus-21-sophon-infra-3-0-1-04d31a3d/error.html`
          `https://10.83.71.73/sjzt/clus-12-sophon-infra-3-0-1-61b7babj/gateway/user/api/users/password-free/login?token=Bearer
%20eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6ImhpdmUiLCJyb2xlcyI6IltcIlNPUEhPTl9BRE1JTlwiXSIsInNjb3BlIjoiZXh0ZXJuYWwiLCJleHAiOjQ4NjQ3MDQ4MzQsImlhdCI6MTcxMTEwNDgzNH0.lgpQ1lZOj3gr423DWVdgbkpgcz6Q_zqcWUlcVj5d9ZGcpsJbrTcdKqkIBL0VtPt5VtRrENjSiOK3mIoNW5H5Zg&redirect=https://10.83.71.73/sjzt/clus-12-sophon-infra-3-0-1-61b7babj/intro/kg/graph_analysis/personalBlueprint/ca0f95a6-f9b6-44ef-ade0-f352a54d5984/9c99fc18-e3b3-4c5c-a0f6-57417da3d0b9/graph_case/14aaf4d2-5cab-4b73-b1fa-2b3350fbd15e`
        );
      } else {
        this.setChildPartShow(true);
        switch (type) {
          case "transactionChain":
            this.setTransactionChainShow(true);
            this.setBusinessPortraitsShow(false);
            this.setPurchaseSalesCategoryShow(false);
            this.setGroupStructureShow(false);
            this.setGroupPortraitShow(false);
            this.setAuditResultApplyShow(false);
            this.setStockGraphShow(false);
            break;
          case "purchaseSalesCategory":
            this.setPurchaseSalesCategoryShow(true);
            this.setBusinessPortraitsShow(false);
            this.setTransactionChainShow(false);
            this.setGroupStructureShow(false);
            this.setGroupPortraitShow(false);
            this.setAuditResultApplyShow(false);
            this.setStockGraphShow(false);
            break;
          case "groupStructure":
            this.setGroupStructureShow(true);
            this.setTransactionChainShow(false);
            this.setPurchaseSalesCategoryShow(false);
            this.setGroupPortraitShow(false);
            this.setBusinessPortraitsShow(false);
            this.setAuditResultApplyShow(false);
            this.setStockGraphShow(false);
            break;
          case "groupPortrait":
            this.setGroupPortraitShow(true);
            this.setTransactionChainShow(false);
            this.setPurchaseSalesCategoryShow(false);
            this.setGroupStructureShow(false);
            this.setBusinessPortraitsShow(false);
            this.setAuditResultApplyShow(false);
            this.setStockGraphShow(false);
            break;
          case "auditResultApply":
            // this.setAuditResultApplyShow(false);
            // this.setTransactionChainShow(false);
            // this.setPurchaseSalesCategoryShow(false);
            // this.setGroupStructureShow(false);
            // this.setBusinessPortraitsShow(false);
            // this.setGroupPortraitShow(false);
            break;
          case "stockGraph":
            this.setGroupPortraitShow(false);
            this.setTransactionChainShow(false);
            this.setPurchaseSalesCategoryShow(false);
            this.setGroupStructureShow(false);
            this.setBusinessPortraitsShow(false);
            this.setAuditResultApplyShow(false);
            this.setStockGraphShow(true);
            break;
          default:
            break;
        }
      }
    },
  },
};
</script>
<style lang="less" scoped>
.layout-btns {
  width: 100%;
  height: 80px;
  padding: 24px;
  display: flex;
  background: #fff;
  position: relative;
  align-items: center;
  transition: all 0.3s;

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
</style>
