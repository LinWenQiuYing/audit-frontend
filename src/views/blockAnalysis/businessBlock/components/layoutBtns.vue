<template>
  <div class="layout-btns">
    <div class="layout-btns-item">
      <a-button
        type="primary"
        :class="spendingShow ? 'layout-btn active' : 'layout-btn'"
        @click="handleSkip('spending')"
      >
        <div class="layout-btn-img">
          <icon-svg
            :color="spendingShow ? '#30F2CB' : '#fff'"
            icon-class="支出情况"
          />
        </div>
        <span class="layout-btn-text">支出情况</span>
      </a-button>
    </div>
    <div class="layout-btns-item">
      <a-button
        type="primary"
        :class="threePublicShow ? 'layout-btn active' : 'layout-btn'"
        @click="handleSkip('threePublic')"
      >
        <div class="layout-btn-img">
          <icon-svg
            :color="threePublicShow ? '#30F2CB' : '#fff'"
            icon-class="三公费用"
          />
        </div>
        <span class="layout-btn-text">三公费用</span>
      </a-button>
    </div>
    <div class="layout-btns-item">
      <a-button
        type="primary"
        :class="noTaxShow ? 'layout-btn active' : 'layout-btn'"
        @click="handleSkip('noTax')"
      >
        <div class="layout-btn-img">
          <icon-svg
            :color="noTaxShow ? '#30F2CB' : '#fff'"
            icon-class="非税收入"
          />
        </div>
        <span class="layout-btn-text">非税收入</span>
      </a-button>
    </div>
    <div class="layout-btns-item">
      <a-button
        type="primary"
        :class="assertsShow ? 'layout-btn active' : 'layout-btn'"
        @click="handleSkip('asserts')"
      >
        <div class="layout-btn-img">
          <icon-svg
            :color="assertsShow ? '#30F2CB' : '#fff'"
            icon-class="资产情况"
          />
        </div>
        <span class="layout-btn-text">资产情况</span>
      </a-button>
    </div>
    <div class="layout-btns-item">
      <a-button
        type="primary"
        :class="auditShow ? 'layout-btn active' : 'layout-btn'"
        @click="handleSkip('audit')"
      >
        <div class="layout-btn-img">
          <icon-svg
            :color="auditShow ? '#30F2CB' : '#fff'"
            icon-class="审计情况"
          />
        </div>
        <span class="layout-btn-text">审计情况</span>
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
    ...mapState("blockAnalysis", [
      "spendingShow",
      "threePublicShow",
      "noTaxShow",
      "assertsShow",
      "auditShow",
    ]),
  },
  methods: {
    ...mapMutations("blockAnalysis", {
      setSpendingShow: "setSpendingShow",
      setThreePublicShow: "setThreePublicShow",
      setNoTaxShow: "setNoTaxShow",
      setAssertsShow: "setAssertsShow",
      setAuditShow: "setAuditShow",
    }),
    handleSkip(type) {
      switch (type) {
        // 支出情况
        case "spending":
          this.setSpendingShow(true);
          this.setThreePublicShow(false);
          this.setNoTaxShow(false);
          this.setAssertsShow(false);
          this.setAuditShow(false);
          break;
        case "threePublic":
          this.setSpendingShow(false);
          this.setThreePublicShow(true);
          this.setNoTaxShow(false);
          this.setAssertsShow(false);
          this.setAuditShow(false);
          break;
        case "noTax":
          this.setSpendingShow(false);
          this.setThreePublicShow(false);
          this.setNoTaxShow(true);
          this.setAssertsShow(false);
          this.setAuditShow(false);
          break;
        case "asserts":
          this.setSpendingShow(false);
          this.setThreePublicShow(false);
          this.setNoTaxShow(false);
          this.setAssertsShow(true);
          this.setAuditShow(false);
          break;
        case "audit":
          this.setSpendingShow(false);
          this.setThreePublicShow(false);
          this.setNoTaxShow(false);
          this.setAssertsShow(false);
          this.setAuditShow(true);
          break;
        default:
          break;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.layout-btns {
  width: 100%;
  height: 72px;
  padding: 20px;
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
        line-height: 32px;
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
