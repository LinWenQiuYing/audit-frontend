<template>
  <div class="manage-portrait">
    <MainContent :curTreeItem="curTreeItem">
      <template slot="title">
        <span class="header-title" @click="handleClickManage"
          >主管单位画像</span
        >
      </template>
      <template slot="content">
        <div class="manage-portrait-content">
          <LeftTree parentType="manage" />
          <router-view />
          <a-popover placement="left" overlayClassName="manage-error-popover">
            <template slot="content">
              <a-menu @click="handleMenuClick">
                <a-menu-item key="/manage-portrait/budget-execution"
                  >预算执行率</a-menu-item
                >
                <a-menu-item key="/manage-portrait/expenditure-balance"
                  >支出均衡性</a-menu-item
                >
                <a-menu-item key="/manage-portrait/intercompany-transfer"
                  >关联单位间转账</a-menu-item
                >
                <a-menu-item key="/manage-portrait/public-funds"
                  >疑似三公分析</a-menu-item
                >
                <a-menu-item key="/manage-portrait/economic-structure"
                  >经济科目结构分析</a-menu-item
                >
              </a-menu>
            </template>
            <img
              src="@/assets/images/img/errorAnalysisIcon.svg"
              alt=""
              class="manage-error"
            />
          </a-popover>
        </div>
      </template>
      <template slot="titleChildRoute" v-if="breadcrumb.name">
        &nbsp;/&nbsp;<span class="header-breadcrumb">{{
          breadcrumb.name
        }}</span>
      </template>
    </MainContent>
  </div>
</template>
<script>
import LeftTree from "@/components/leftTree.vue";
import MainContent from "@/components/mainContent";
import { Menu, Popover } from "ant-design-vue";
import { mapMutations, mapState } from "vuex";

export default {
  name: "managePortrait",
  data() {
    return {
      breadcrumb: {},
    };
  },
  computed: {
    ...mapState("blockAnalysis", ["blockChoosedYear"]),
    ...mapState("managePortrait", ["curTreeItem"]),
  },
  components: {
    MainContent,
    LeftTree,
    AMenu: Menu,
    AMenuItem: Menu.Item,
    APopover: Popover,
  },
  watch: {
    $route: {
      handler() {
        this.getBeardcrumb();
      },
      deep: true,
    },
  },
  async mounted() {
    this.getBeardcrumb();
  },
  methods: {
    ...mapMutations("blockAnalysis", {
      setBlockChoosedYear: "setBlockChoosedYear",
    }),
    getBeardcrumb() {
      console.log("this.$route", this.$route);
      const name = this.$route.name;
      switch (name) {
        case "intercompanyTransfer":
          this.breadcrumb = {
            name: "关联单位间转账",
            path: "/manage-portrait/intercompany-transfer",
          };
          break;
        case "expenditureBalance":
          this.breadcrumb = {
            name: "支出均衡性",
            path: "/manage-portrait/expenditure-balance",
          };
          break;
        case "budgetExecution":
          this.breadcrumb = {
            name: "预算执行率",
            path: "/manage-portrait/budget-execution",
          };
          break;
        case "publicFunds":
          this.breadcrumb = {
            name: "疑似三公分析",
            path: "/manage-portrait/public-funds",
          };
          break;
        case "economicStructure":
          this.breadcrumb = {
            name: "经济科目结构分析",
            path: "/manage-portrait/economic-structure",
          };
          break;
        default:
          this.breadcrumb = {};
          break;
      }
    },
    handleMenuClick(e) {
      this.$router.push(e.key);
    },
    handleClickManage() {
      this.$router.push("/manage-portrait/portrait-detail");
    },
  },
};
</script>
<style lang="less">
.manage-portrait {
  width: 100%;
  height: 100%;

  .header-title {
    cursor: pointer;
  }

  .header-breadcrumb {
    margin-left: 20px;
    font-size: 18px;
  }

  .manage-detail {
    min-height: calc(100vh - 186px);
  }

  &-content {
    display: flex;
    background: #fff;
    height: 100%;
    overflow: auto;

    .manage-error {
      position: fixed;
      right: 34px;
      top: 127px;
      z-index: 999;
    }
  }

  .portrait-detail,
  .budget-execution,
  .economic-structure,
  .expend-balance,
  .intercompany-transfer,
  .public-funds {
    margin-left: 300px;
    // margin-left: 320px;
  }
}

.manage-error-popover {
  .ant-menu-vertical {
    border-right: 0 !important;
  }
}
</style>
