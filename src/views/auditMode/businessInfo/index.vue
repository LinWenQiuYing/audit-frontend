<template>
  <div class="business-portraits-box">
    <layout-btns v-if="childPartShow" />
    <div class="business-portraits-child" v-if="childPartShow">
      <transaction-chain v-if="transactionChainShow" />
      <purchase-sales-category v-if="purchaseSalesCategoryShow" />
      <group-structure v-if="groupStructureShow" />
      <group-portrait v-if="groupPortraitShow" />
      <audit-results-apply v-if="auditResultApplyShow" />
      <stock-graph v-if="stockGraphShow" />
    </div>
    <div class="business-portraits-content" v-if="businessPortraitsShow">
      <div class="business-info">
        <!-- <layout-btns /> -->
        <div class="sub-title">企业速览</div>
        <div class="business-info-graph">
          <a-tooltip placement="top">
            <template slot="title">
              <span>启信宝标签</span>
            </template>
            <img
              class="business-info-graph-icon"
              src="@/assets/images/img/icon-qixinbao.png"
              alt="启信宝"
              @click="handleCheckTags"
            />
          </a-tooltip>
          <business-info-content />
        </div>
        <div class="business-info-btns">
          <!-- <a-button
            type="primary"
            class="business-info-btn"
            @click="handleSkip('auditResultApply')"
          >
            审计结果运用
          </a-button> -->
          <a-button
            type="primary"
            class="business-info-btn"
            @click="handleSkip('groupPortrait')"
          >
            集团/子集团画像
          </a-button>
        </div>
      </div>
      <div class="business-graph">
        <div class="sub-title">智能动态图谱</div>
        <div class="business-graph-content">
          <div
            class="business-graph-content-item"
            @click="handleSkip('groupStructure')"
          >
            <img src="@/assets/images/img/集团架构.svg" alt="" />
          </div>
          <div
            class="business-graph-content-item"
            @click="handleSkip('transactionChain')"
          >
            <img src="@/assets/images/img/上下游交易.svg" alt="" />
          </div>
          <div
            class="business-graph-content-item"
            @click="handleSkip('purchaseSalesCategory')"
          >
            <img src="@/assets/images/img/购销品类.svg" alt="" />
          </div>
          <div
            class="business-graph-content-item"
            @click="handleSkip('relationGraph')"
          >
            <img src="@/assets/images/img/关联关系.svg" alt="" />
          </div>
        </div>
      </div>
      <div class="business-table">
        <div class="option-tabs">
          <div
            :class="
              pane.title === '舆情信息'
                ? 'option-tab option-tab-disable'
                : selected === pane.key
                ? 'option-tab selected'
                : 'option-tab'
            "
            v-for="pane in panes"
            :key="pane.key"
            :value="pane.key"
            @click="changeSelected(pane.key)"
          >
            <a-icon :type="pane.icon" />
            <span class="option-tab-text">{{ pane.title }}</span>
          </div>
        </div>
        <base-info v-if="selected === 0" />
        <history-evolution v-if="selected === 1" />
        <financial-situation v-if="selected === 2" />
        <operate-condition v-if="selected === 3" />
        <negative-events v-if="selected === 4" />
        <technological-innovation v-if="selected === 5" />
        <administrative-licensing v-if="selected === 6" />
        <public-info v-if="selected === 7" />
      </div>
      <div
        class="business-tools"
        :style="{ display: scrollTop > clientHeight ? 'flex' : 'none' }"
      >
        <icon-svg
          icon-class="business_info"
          title="企业基本信息"
          @click="showBusinessInfo"
        />
        <icon-svg icon-class="toTop" title="回到顶部" @click="scrollToTop" />
      </div>
    </div>
    <drag-modal
      :visible="businessInfoShow"
      @cancel="onCancel"
      :mask="false"
      :footer="null"
      title="企业基本信息"
      :bodyStyle="{
        height: '400px',
        width: '100%',
        overflow: 'auto',
      }"
      :destroyOnClose="true"
      :width="637.56"
      class="business-info-modal"
      :ratio="1.5557"
    >
      <business-info-content />
    </drag-modal>
    <drag-modal
      :visible="isTagShow"
      :destroyOnClose="true"
      @cancel="onTagModalCancel"
      :footer="null"
      :mask="false"
      centered
      :bodyStyle="{
        height: '720px',
        width: '100%',
        overflow: 'auto',
      }"
      :dialogStyle="{ top: '160px', left: '530px', width: '792px' }"
    >
      <template slot="title">
        <div class="qixinbao-modal-title">
          <img
            class="qixinbao-modal-title-icon"
            src="@/assets/images/img/icon-qixinbao.png"
            alt="启信宝"
          />
          <span class="qixinbao-modal-title-text">启信宝标签</span>
        </div>
      </template>
      <div class="qixinbao-modal-content">
        <a-table
          :columns="columns"
          :data-source="tableData"
          :pagination="false"
          class="qixinbao-modal-table"
          @change="handleTableChange"
          :loading="tableLoading"
          :rowKey="(record) => record.index"
          :scroll="{ x: 'max-content', y: '450px' }"
          bordered
        >
          <div slot="titleSlot" class="title-slot" slot-scope="sort">
            <!-- {{ sort }} -->
            <span class="title-slot-title">标签类型</span>
            <a-icon
              :type="
                sort.sortColumn &&
                sort.sortColumn.key === 'tagType' &&
                sort.sortOrder === 'descend'
                  ? 'sort-descending'
                  : 'sort-ascending'
              "
              :style="{
                color:
                  sort.sortColumn &&
                  sort.sortColumn.key === 'tagType' &&
                  sort.sortOrder
                    ? '#016eff'
                    : 'rgba(0, 0, 0, 0.45)',
              }"
            />
          </div>
        </a-table>
      </div>
    </drag-modal>
  </div>
</template>
<script>
import AdministrativeLicensing from "./administrativeLicensing";
import AuditResultsApply from "../auditResultsApply";
import BaseInfo from "./baseInfo";
import BusinessInfoContent from "./businessInfoContent";
import DragModal from "@/components/dragModal";
import FinancialSituation from "./financialSituation";
import GroupPortrait from "../groupPortrait";
import GroupStructure from "../groupStructure";
import StockGraph from "../stockGraph/index.vue";
import HistoryEvolution from "./historyEvolution";
import LayoutBtns from "../components/layoutBtns";
import NegativeEvents from "./negativeEvents";
import OperateCondition from "./operateCondition";
import PublicInfo from "./publicInfo";
import PurchaseSalesCategory from "../purchaseSalesCategory";
import TechnologicalInnovation from "./technologicalInnovation";
import TransactionChain from "../transactionChain";
import { Button, Icon, Tooltip } from "ant-design-vue";
import { scrollToTop } from "@/utils/common.js";
import { throttle } from "lodash";
import { mapState, mapMutations } from "vuex";
import { getTagInfo } from "@/shared/api/auditManage.js";

export default {
  name: "BusinessInfo",
  data() {
    return {
      selected: 0,
      panes: [
        {
          title: "基本情况",
          key: 0,
          icon: "solution",
        },
        {
          title: "历史沿革",
          key: 1,
          icon: "calendar",
        },
        {
          title: "财务状况",
          key: 2,
          icon: "dollar",
        },
        {
          title: "经营情况",
          key: 3,
          icon: "gold",
        },
        {
          title: "负面事件",
          key: 4,
          icon: "exception",
        },
        {
          title: "科技创新",
          key: 5,
          icon: "bulb",
        },
        {
          title: "行政许可",
          key: 6,
          icon: "audit",
        },
        {
          title: "舆情信息",
          key: 7,
          icon: "reconciliation",
        },
      ],
      scrollTop: 0,
      clientHeight: 0,
      businessInfoShow: false,
      isTagShow: false,
      columns: [
        {
          title: "序号",
          dataIndex: "index",
          key: "index",
          width: 70,
        },
        {
          title: "标签名称",
          dataIndex: "tagName",
          key: "tagName",
          width: 240,
        },
        {
          // title: "标签类型",
          dataIndex: "tagType",
          key: "tagType",
          width: 240,
          sorter: true,
          scopedSlots: { title: "titleSlot" },
        },
        {
          title: "数据记录更新时间",
          dataIndex: "updateTime",
          key: "updateTime",
          width: 185,
        },
      ],
      tableData: [],
      tableLoading: false,
      tableOrder: undefined,
    };
  },
  components: {
    AButton: Button,
    AdministrativeLicensing,
    AIcon: Icon,
    ATooltip: Tooltip,
    AuditResultsApply,
    BaseInfo,
    BusinessInfoContent,
    DragModal,
    FinancialSituation,
    GroupPortrait,
    GroupStructure,
    StockGraph,
    HistoryEvolution,
    LayoutBtns,
    NegativeEvents,
    OperateCondition,
    PublicInfo,
    PurchaseSalesCategory,
    TechnologicalInnovation,
    TransactionChain,
  },
  computed: {
    ...mapState("auditOptions", [
      "childPartShow",
      "businessPortraitsShow",
      "transactionChainShow",
      "purchaseSalesCategoryShow",
      "groupStructureShow",
      "groupPortraitShow",
      "stockGraphShow",
      "auditResultApplyShow",
      "paramsObj",
    ]),
  },
  mounted() {
    this.clientHeight = document.getElementById("audit-mode").clientHeight;
    document
      .getElementById("audit-mode")
      .addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    document.getElementById("audit-mode") &&
      document
        .getElementById("audit-mode")
        .removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    ...mapMutations("auditOptions", {
      setChildPartShow: "setChildPartShow",
      setBusinessPortraitsShow: "setBusinessPortraitsShow",
      setTransactionChainShow: "setTransactionChainShow",
      setPurchaseSalesCategoryShow: "setPurchaseSalesCategoryShow",
      setGroupStructureShow: "setGroupStructureShow",
      setGroupPortraitShow: "setGroupPortraitShow",
      setAuditResultApplyShow: "setAuditResultApplyShow",
    }),
    changeSelected(key) {
      if (key === 7) return;
      this.selected = key;
    },
    scrollToTop() {
      scrollToTop(this, "audit-mode", 100);
    },
    handleScroll: throttle(function () {
      this.scrollTop = document.getElementById("audit-mode").scrollTop;
    }, 200),
    handleSkip(type) {
      if (type === "relationGraph") {
        window.open(
          //           `https://10.83.70.195/i3mjsnq/clus-21-sophon-infra-3-0-1-04d31a3d/gateway/user/api/users/password-free/login?token=Bearer
          // eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6ImhpdmUiLCJyb2xlcyI6IltcIlNPUEhPTl9BRE1JTlwiXSIsInNjb3BlIjoiZXh0ZXJuYWwiLCJleHAiOjQ4MTQ5MTg3MzMsImlhdCI6MTY2MTMxODczM30.7JO6iYTWnKNwsYaygy5gusvzVflHOedb0Z4vDoAsymZlL_JfFj9Z549g8seopMliYPEEmUGwsIoM2Y5KowQdHA&redirect=https://10.83.70.195/i3mjsnq/clus-21-sophon-infra-3-0-1-04d31a3d/kg/graph_analysis/personalBlueprint/ca0f95a6-f9b6-44ef-ade0-f352a54d5984/9c99fc18-e3b3-4c5c-a0f6-57417da3d0b9/graph_case/14aaf4d2-5cab-4b73-b1fa-2b3350fbd15e&refer=https://10.83.70.195/i3mjsnq/clus-21-sophon-infra-3-0-1-04d31a3d/error.html`
          `https://10.83.71.73/sjzt/clus-12-sophon-infra-3-0-1-61b7babj/gateway/user/api/users/password-free/login?token=Bearer
%20eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6ImhpdmUiLCJyb2xlcyI6IltcIlNPUEhPTl9BRE1JTlwiXSIsInNjb3BlIjoiZXh0ZXJuYWwiLCJleHAiOjQ4NjQ3MDQ4MzQsImlhdCI6MTcxMTEwNDgzNH0.lgpQ1lZOj3gr423DWVdgbkpgcz6Q_zqcWUlcVj5d9ZGcpsJbrTcdKqkIBL0VtPt5VtRrENjSiOK3mIoNW5H5Zg&redirect=https://10.83.71.73/sjzt/clus-12-sophon-infra-3-0-1-61b7babj/intro/kg/graph_analysis/personalBlueprint/ca0f95a6-f9b6-44ef-ade0-f352a54d5984/9c99fc18-e3b3-4c5c-a0f6-57417da3d0b9/graph_case/14aaf4d2-5cab-4b73-b1fa-2b3350fbd15e`
        );
      } else {
        this.setChildPartShow(true);
        this.setBusinessPortraitsShow(false);
        switch (type) {
          case "transactionChain":
            this.setTransactionChainShow(true);
            break;
          case "purchaseSalesCategory":
            this.setPurchaseSalesCategoryShow(true);
            break;
          case "groupStructure":
            this.setGroupStructureShow(true);
            break;
          case "groupPortrait":
            this.setGroupPortraitShow(true);
            break;
          case "auditResultApply":
            this.setAuditResultApplyShow(true);
            break;

          default:
            break;
        }
      }
    },
    showBusinessInfo() {
      this.businessInfoShow = true;
    },
    onCancel() {
      this.businessInfoShow = false;
    },
    handleCheckTags() {
      this.isTagShow = true;
      this.getTagInfo();
    },
    onTagModalCancel() {
      this.isTagShow = false;
    },
    async getTagInfo() {
      const json = {
        corpName: this.paramsObj.corpName,
        order: this.tableOrder,
      };
      this.tableLoading = true;
      const res = await getTagInfo(json);
      this.tableLoading = false;
      console.log("res", res);
      const tableData = [];
      if (res.message === "成功" && res.data && res.data.length) {
        res.data.map((item, index) => {
          tableData.push({
            index: index + 1,
            tagName: item.tagName,
            tagType: item.typeName,
            updateTime: item.updateTime,
          });
        });
      } else if (res.message === "成功" && (!res.data || !res.data.length)) {
        this.$message.info("暂无启信宝标签信息！");
      } else {
        this.$message.error(res.message);
      }
      this.tableData = tableData;
    },
    handleTableChange(pagination, filters, sorter) {
      console.log("handleTableChange", pagination, filters, sorter);
      // 0正序，1倒序，undefined无序
      this.tableOrder = sorter.order
        ? sorter.order === "ascend"
          ? "0"
          : "1"
        : undefined;
      this.getTagInfo();
    },
  },
};
</script>
<style lang="less">
.business-portraits {
  &-content {
    display: flex;
    flex-wrap: wrap;
  }

  .business-info {
    padding: 24px;
    background: #fff;
    margin-right: 24px;
    position: relative;
    border-radius: 5px;
    margin-bottom: 24px;
    width: calc((100% - 24px) * 0.5716);

    .layout-btns {
      top: 0;
      left: 0;
      position: absolute;
    }

    &-graph {
      position: relative;
      height: calc(100% - 56px);

      &-icon {
        right: 0;
        top: -48px;
        cursor: pointer;
        position: absolute;
      }
    }

    &-btns {
      display: flex;
      position: absolute;
      right: 24px;
      bottom: 24px;

      .business-info-btn {
        border: none;
        background-image: linear-gradient(
          to right,
          rgba(1, 110, 255, 0.6),
          rgba(1, 110, 255)
        );
        color: #fff;
        padding: 0 8px;
        border-radius: 3px;

        &:not(:last-child) {
          margin-right: 16px;
        }
      }
    }
  }

  .business-graph {
    background: #fff;
    padding: 24px;
    width: calc((100% - 24px) * 0.4284);
    margin-bottom: 24px;
    border-radius: 5px;

    &-content {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;

      &-item {
        width: calc((100% - 16px) / 2);

        &:first-child,
        &:nth-child(2) {
          margin-bottom: 16px;
        }

        img {
          width: 100%;
        }
      }
    }
  }

  .business-table {
    background: #fff;
    border-radius: 4px;
    padding: 24px;
    width: 100%;
    border-radius: 5px;

    &-item {
      position: relative;

      &-box {
        position: relative;
      }

      .business-table-content {
        transition: all 0.3s;
        position: relative;
      }

      .business-details {
        width: 100%;
        display: grid;
        border-top: 1px solid @borderColor;
        border-left: 1px solid @borderColor;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: repeat(5, 42px) auto;
        margin-bottom: 36px;
        transition: all 0.2s;

        .details-item {
          display: flex;
          width: 100%;
          align-items: center;
          font-size: 14px;
          color: @primaryTextColor;
          border-right: 1px solid @borderColor;
          border-bottom: 1px solid @borderColor;

          &-label {
            width: 200px;
            text-align: right;
            background: @tableHeaderColor;
            display: inline-block;
            height: 100%;
            line-height: 42px;
            padding-right: 20px;
            border-right: 1px solid @borderColor;
            position: relative;
          }

          &-value {
            width: calc(100% - 200px);
            padding-left: 12px;
          }

          &.main {
            grid-column-start: 1;
            grid-column-end: 4;
            grid-row-start: 6;
            grid-row-end: 7;
            align-items: stretch;

            .details-item-label {
              height: auto;

              .label-text {
                height: auto;
                position: absolute;
                top: 50%;
                right: 20px;
                transform: translateY(-50%);
              }
            }

            .details-item-value {
              line-height: 32px;
              padding: 5px 12px;
            }
          }
        }
        .details-item:nth-of-type(14) {
          /* 列合并 */
          grid-column: 2 / span 2;
        }
      }

      &-content {
        transition: all 0.3s;

        .business-members {
          height: 272px;

          &-title {
            margin-bottom: 12px;
            display: flex;
            align-items: center;

            span {
              color: #666;
              font-weight: 600;
              font-size: 14px;
            }

            .anticon {
              color: #999;
              padding-left: 4px;
            }
          }

          .members-table {
            height: calc(100% - 33px);
          }
        }
      }
    }
  }

  .business-tools {
    z-index: 9;
    width: 40px;
    right: 24px;
    height: 80px;
    padding: 7px;
    bottom: 150px;
    display: flex;
    position: fixed;
    cursor: pointer;
    background: #fff;
    flex-direction: column;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);

    img {
      width: 50px;
      padding: 12px;
      background: #fff;
      cursor: pointer;
      box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.12);
      border-radius: 2px 2px 0px 0px;
    }
  }
}

.business-info-modal {
  .ant-modal-wrap {
    .ant-modal {
      position: absolute;
      top: 64px;
      right: 24px;
      bottom: auto;

      .ant-modal-content {
        resize: both;
        overflow: auto;
      }
    }
  }
}

.qixinbao-modal {
  &-title {
    display: flex;
    align-items: center;
    height: 22px;

    &-icon {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }
  }

  .qixinbao-modal-table {
    .ant-table-row-cell-break-word {
      padding: 10px 16px;
    }

    .ant-table-header {
      background: #e8f2ff;

      .ant-table-thead {
        .ant-table-row-cell-break-word {
          background: #e8f2ff;
        }
      }
    }

    .ant-table-column-title {
      .title-slot {
        &-title {
          margin-right: 8px;
        }
      }
    }
    .ant-table-column-sorter {
      display: none;
    }
  }
}
</style>
