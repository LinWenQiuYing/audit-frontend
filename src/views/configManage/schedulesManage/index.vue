<template>
  <div class="template-manage">
    <MainContent title="调度管理">
      <template slot="content">
        <List
          v-if="!isDetailsShow"
          ref="templateList"
          @getCategoryOptions="getCategoryOptions"
          @detailsChanged="detailsChanged"
          @detailsTypeChanged="detailsTypeChanged"
          @isDetailsShowChanged="isDetailsShowChanged"
        />
        <Details
          v-if="isDetailsShow"
          :details="details"
          :categoryOptions="categoryOptions"
          :detailsType="detailsType"
          @detailsChanged="detailsChanged"
          @detailsTypeChanged="detailsTypeChanged"
          @isDetailsShowChanged="isDetailsShowChanged"
        />
      </template>
    </MainContent>
  </div>
</template>
<script>
import MainContent from "@/components/mainContent";
import Details from "./details.vue";
import List from "./list.vue";

export default {
  name: "GraphsManage",
  data() {
    return {
      details: {},
      isDetailsShow: false,
      detailsType: "check",
      addModelShow: false,
      modelDetails: {},
      isSkiped: false, // 是否是模板跳转过来的
      categoryOptions: [],
    };
  },
  components: {
    Details,
    List,
    MainContent,
  },
  methods: {
    detailsChanged(value) {
      this.details = value;
    },
    isDetailsShowChanged(value, isSearch) {
      this.isDetailsShow = value;
      if (isSearch) {
        this.$nextTick(() => {
          this.$refs.templateList.onSearch("init");
        });
      }
    },
    getCategoryOptions(value) {
      this.categoryOptions = value;
    },
    detailsTypeChanged(value) {
      this.detailsType = value;
      this.isSkiped = true;
    },
    handleReturn() {
      this.isDetailsShowChanged(false);
      this.$nextTick(() => {
        this.$refs.templateList.onSearch("init");
      });
    },
    isSkipedChanged(value) {
      this.isSkiped = value;
    },
  },
};
</script>
<style lang="less">
.template-manage {
  width: 100%;
  height: 100%;
  border-radius: 5px;

  &-success {
    text-align: center;
    padding: 100px 0 24px;
    height: 100%;
    background: #fff;

    .success-img {
      width: 70px;
      height: 70px;
      margin: 0 auto;
      margin-bottom: 30px;
    }

    .title {
      font-size: 20px;
      font-weight: 600;
      line-height: 28px;
      margin-bottom: 5px;
      color: @primaryTextColor;
    }

    .subtitle {
      width: 425px;
      margin: 0 auto;
      font-size: 14px;
      line-height: 22px;
      margin-bottom: 24px;
      color: @secondaryTextColor;
    }

    .success-btns {
      .ant-btn {
        &:first-child {
          margin-right: 10px;
        }
      }
    }
  }
}

.check-drawer {
  .ant-drawer-wrapper-body {
    .ant-drawer-header {
      .ant-drawer-title {
        font-weight: 600;
      }
    }

    .ant-drawer-body {
      .check-drawer-item {
        display: flex;
        margin-bottom: 16px;
        justify-content: space-between;

        &-label {
          width: 75px;
        }

        &-content {
          color: #949dad;
          width: calc(100% - 80px);

          .desc-content {
            height: 190px;
            padding: 12px;
            border: 1px solid #e6e6e6;
            border-radius: 5px;
          }

          .rules-item {
            color: @activeFontColor;
            margin-bottom: 10px;

            &.no-apply {
              color: #949dad;
            }
          }
        }
      }
    }
  }
}
</style>
