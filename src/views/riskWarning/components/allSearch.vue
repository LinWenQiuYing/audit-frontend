<template>
  <div class="all-search-layout">
    <div class="search-options">
      <div class="search-options-item">
        <span class="item-label">线索企业：</span>
        <!-- <a-select
          show-search
          :value="searchValue1"
          placeholder="线索企业"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          :not-found-content="null"
          @search="handleSearch1"
          @change="handleChange1"
          class="item-input"
        >
          <a-select-option v-for="d in options1" :key="d.value">
            {{ d.text }}
          </a-select-option>
        </a-select> -->
        <!-- todo：缺少接口 -->
        <a-input
          allow-clear
          placeholder="线索企业"
          class="item-input"
          v-model="searchValue1"
        />
      </div>
      <div class="search-options-item">
        <span class="item-label">线索企业所属集团：</span>
        <!-- <a-select
          show-search
          :value="searchValue2"
          placeholder="线索企业所属集团"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          :not-found-content="null"
          @search="handleSearch2"
          @change="handleChange2"
          class="item-input"
        >
          <a-select-option v-for="d in options2" :key="d.value">
            {{ d.text }}
          </a-select-option>
        </a-select> -->
        <!-- todo：缺少接口 -->
        <a-input
          allow-clear
          placeholder="线索企业所属集团"
          class="item-input"
          v-model="searchValue2"
        />
      </div>
      <div class="search-options-item actions">
        <a-button type="primary" @click="onSearch('init')" class="actions-btn">
          查询
        </a-button>
        <a-button @click="onReset" class="actions-btn"> 重置 </a-button>
      </div>
    </div>
    <div class="condition-count">
      <div class="condition-count-item">
        <div class="item-left">
          <icon-svg icon-class="icon_count1" class="icon-count1" />
        </div>
        <div class="item-right">
          <div class="count-num">
            {{ totalNum }}
          </div>
          <span>线索总数</span>
        </div>
      </div>
      <div class="condition-count-item">
        <div class="item-left">
          <icon-svg icon-class="icon_count2" class="icon-count2" />
        </div>
        <div class="item-right">
          <div class="count-num">
            {{ graphTotalNum }}
          </div>
          <span>图模型线索总数</span>
        </div>
      </div>
      <div class="condition-count-item">
        <div class="item-left">
          <icon-svg icon-class="icon_count3" class="icon-count3" />
        </div>
        <div class="item-right">
          <div class="count-num">
            {{ ruleTotalNum }}
          </div>
          <span>规则线索总数</span>
        </div>
      </div>
    </div>
    <div class="risk-table">
      <a-table
        :columns="columns1"
        :data-source="dataSource1"
        :scroll="{ x: 'max-content', y: 'calc(100vh - 380px)' }"
        :bordered="true"
        :pagination="pagination1"
        :loading="tableLoading1"
        class="risk-table-left"
      >
        <template slot="riskNumber" slot-scope="text, record">
          <a
            href="javascript:void(0);"
            @click="handleDetail('graph', record)"
            >{{ text }}</a
          >
        </template>
      </a-table>
      <a-table
        :columns="columns2"
        :data-source="dataSource2"
        :scroll="{ x: 'max-content', y: 'calc(100vh - 380px)' }"
        :bordered="true"
        :pagination="pagination2"
        :loading="tableLoading2"
        class="risk-table-right"
      >
        <template slot="riskNumber" slot-scope="text, record">
          <a href="javascript:void(0);" @click="handleDetail('rule', record)">{{
            text
          }}</a>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import { debounce } from "lodash";
import { Button, Input } from "ant-design-vue";
import {
  allSearchGraphRisk,
  allSearchGraphRule,
} from "@/shared/api/riskWarning.js";

export default {
  name: "AllSearch",
  data() {
    return {
      searchValue1: undefined,
      searchValue2: undefined,
      options1: [],
      options2: [],

      columns1: [
        {
          title: "图谱名称",
          dataIndex: "graphName",
          key: "graphName",
          width: 160,
        },
        {
          title: "模型名称",
          dataIndex: "modelName",
          key: "modelName",
          width: 200,
        },
        {
          title: "调度策略",
          dataIndex: "ruleName",
          key: "ruleName",
          width: 270,
        },
        {
          title: "对应线索条数",
          dataIndex: "riskNumber",
          key: "riskNumber",
          width: 130,
          scopedSlots: { customRender: "riskNumber" },
        },
        {
          title: "模型分类",
          dataIndex: "modelCategory",
          key: "modelCategory",
          width: 200,
        },
      ],
      columns2: [
        {
          title: "规则名称",
          dataIndex: "ruleName",
          key: "ruleName",
          width: 200,
        },
        {
          title: "规则分类",
          dataIndex: "ruleCategory",
          key: "ruleCategory",
          width: 200,
        },
        {
          title: "对应线索条数",
          dataIndex: "riskNumber",
          key: "riskNumber",
          width: 130,
          scopedSlots: { customRender: "riskNumber" },
        },
      ],
      dataSource1: [],
      dataSource2: [],
      tableLoading1: false,
      tableLoading2: false,
      pagination1: {
        size: "small",
        total: 0,
        current: 1,
        pageSize: 15,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ["5", "10", "15", "20"],
        showTotal: (total, current) => {
          return `共${total}条记录，当前第${Math.ceil(
            current[0] / this.pagination1.pageSize
          )}页`;
        },
        onChange: (page, pageSize) => {
          this.pagination1.current = page;
          this.pagination1.pageSize = pageSize;
          this.searchGraphRisk("repeat");
        },
        onShowSizeChange: (current, size) => {
          this.pagination1.current = 1;
          this.pagination1.pageSize = size;
          this.searchGraphRisk("repeat");
        },
      },
      pagination2: {
        size: "small",
        total: 0,
        current: 1,
        pageSize: 15,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ["5", "10", "15", "20"],
        showTotal: (total, current) => {
          return `共${total}条记录，当前第${Math.ceil(
            current[0] / this.pagination2.pageSize
          )}页`;
        },
        onChange: (page, pageSize) => {
          this.pagination2.current = page;
          this.pagination2.pageSize = pageSize;
          this.searchRuleRisk("repeat");
        },
        onShowSizeChange: (current, size) => {
          this.pagination2.current = 1;
          this.pagination2.pageSize = size;
          this.searchRuleRisk("repeat");
        },
      },
    };
  },
  computed: {
    totalNum() {
      return (
        this.dataSource1.reduce(
          (sum, item) => sum + parseInt(item.riskNumber),
          0
        ) +
          this.dataSource2.reduce(
            (sum, item) => sum + parseInt(item.riskNumber),
            0
          ) || "--"
      );
    },
    graphTotalNum() {
      return (
        this.dataSource1.reduce(
          (sum, item) => sum + parseInt(item.riskNumber),
          0
        ) || "--"
      );
    },
    ruleTotalNum() {
      return (
        this.dataSource2.reduce(
          (sum, item) => sum + parseInt(item.riskNumber),
          0
        ) || "--"
      );
    },
  },
  components: {
    AButton: Button,
    AInput: Input,
  },
  mounted() {
    this.onSearch("init");
  },
  methods: {
    handleSearch1: debounce(async function (value) {}, 800),
    handleSearch2: debounce(async function (value) {}, 800),
    handleChange1(value) {},
    handleChange2(value) {},
    handleDetail(type, record) {
      this.$emit("checkRiskDetail", type, record);
    },
    onSearch(type) {
      this.searchGraphRisk(type);
      this.searchRuleRisk(type);
    },
    async searchGraphRisk(type) {
      if (type === "init") {
        this.pagination1.current = 1;
      }
      const json = {
        company: this.searchValue1,
        companyGroup: this.searchValue2,
        pageNo: this.pagination1.current,
        pageSize: this.pagination1.pageSize,
      };
      try {
        this.tableLoading1 = true;
        const res = await allSearchGraphRisk(json);
        if (res.message === "成功") {
          this.dataSource1 = res.data.dateList.map((item) => ({
            ...item,
            modelName: item.modelName,
            modelCategory: item.categoryName,
            ruleName: item.ruleName,
            graphName: item.graphChName,
            riskNumber: item.riskNum,
          }));
        } else {
          this.$message.error(res.message);
        }
        this.pagination1.total = parseInt(res.data.total);
      } catch (error) {
        this.$message.destroy();
        this.$message.error("获取图模型线索统计信息失败");
      } finally {
        this.tableLoading1 = false;
      }
    },
    async searchRuleRisk(type) {
      if (type === "init") {
        this.pagination2.current = 1;
      }
      const json = {
        company: this.searchValue1,
        companyGroup: this.searchValue2,
        pageNo: this.pagination2.current,
        pageSize: this.pagination2.pageSize,
      };
      try {
        this.tableLoading2 = true;
        const res = await allSearchGraphRule(json);
        if (res.message === "成功") {
          this.dataSource2 = res.data.dateList.map((item) => ({
            ...item,
            ruleCategory: item.categoryName,
            riskNumber: item.riskNum,
          }));
        } else {
          this.$message.error(res.message);
        }
        this.pagination2.total = parseInt(res.data.total);
      } catch (error) {
        this.$message.destroy();
        this.$message.error("获取图模型线索统计信息失败");
      } finally {
        this.tableLoading2 = false;
      }
    },
    onReset() {
      this.searchValue1 = undefined;
      this.searchValue2 = undefined;
      this.onSearch("init");
    },
  },
};
</script>

<style scoped lang="less">
.all-search-layout {
  height: 100%;
  width: 100%;
  padding: 20px;
  background: #fff;

  .search-options {
    display: flex;
    flex-wrap: wrap;
    gap: 16px 24px;
    margin-bottom: 20px;

    &-item {
      width: calc((100% - 48px) / 3);
      display: flex;
      align-items: center;
      justify-content: flex-start;

      .ant-select {
        overflow: auto;
      }

      &:last-child {
        justify-content: flex-end;
      }

      .item-label {
        color: @primaryTextColor;
      }

      .item-value-special {
        display: flex !important;
        flex: 1;
        align-items: center; /* 垂直居中 */
        width: 100%; /* 根据需要设置宽度 */

        .ant-select {
          width: 160px;
        }
      }

      .item-input {
        flex: 1;
        width: 100%;

        .ant-select-selection {
          max-height: 32px;
          overflow-y: auto;
        }

        .ant-input {
          padding-right: 30px;
        }
      }

      &.actions {
        display: flex;
        justify-content: flex-end;

        .actions-btn {
          margin-left: 10px;
          display: flex;
          align-items: center;

          &-icon {
            width: 16px;
            height: 16px;
            display: flex;
            margin-right: 8px;
          }
        }
      }
    }
  }

  .condition-count {
    height: 104px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    &-item {
      height: 104px;
      width: calc((100% - 48px) / 3);
      background: url("~@/assets/images/img/condition_bottom.png") no-repeat
        right;
      margin: 0px 0px 0px 24px;
      background-color: #ffffff;
      display: flex;
      align-items: center;

      &:first-child {
        margin: 0;
      }
      .item-left {
        width: 72px;
        height: 72px;
        margin: 24px;
      }
      .item-right {
        .count-num {
          font-family: "DIN Alternate";
          font-style: normal;
          font-weight: 700;
          font-size: 36px;
        }
        span {
          font-size: 16px;
          color: @secondaryTextColor;
        }
      }
    }
  }

  .risk-table {
    display: flex;
    justify-content: space-between;

    .risk-table-left {
      width: 60%;
      margin-right: 16px;
    }

    .risk-table-right {
      width: calc(40% - 16px);
    }
  }
}
</style>
