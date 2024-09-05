<template>
  <div class="audit-results">
    <div class="option-tabs">
      <div
        :class="modeValue === pane.key ? 'option-tab selected' : 'option-tab'"
        v-for="pane in panes"
        :key="pane.key"
        :value="pane.key"
        @click="changeSelected(pane.key)"
      >
        <div class="option-tab-icon">
          <icon-svg
            :color="modeValue === pane.key ? '#016EFF' : '#8c8c8c'"
            :iconClass="pane.icon"
          />
        </div>
        <span class="option-tab-text">{{ pane.title }}</span>
      </div>
    </div>
    <div class="sub-title">审计结果列表</div>
    <div class="audit-results-conditions">
      <div class="conditions-item" v-if="modeValue === 0">
        <div class="conditions-item-label">企业搜索</div>
        <a-input
          class="conditions-item-input"
          placeholder="企业名称/ID"
          v-model="eName"
        />
      </div>
      <div class="conditions-item">
        <div class="conditions-item-label">规则类型</div>
        <a-select
          :options="ruleTypeOptions"
          class="conditions-item-input"
          placeholder="请选择"
          v-model="ruleType"
        />
      </div>
      <div class="conditions-item">
        <div class="conditions-item-label">规则名称</div>
        <a-input
          class="conditions-item-input"
          placeholder="请输入规则名称"
          v-model="ruleName"
        />
      </div>
      <div class="conditions-item">
        <a-button
          type="primary"
          class="search-button"
          @click="getResultList('init')"
          :loading="searchLoading"
          icon="search"
        >
          查询
        </a-button>
        <a-button class="search-button" @click="resetConditions">
          <a-icon type="redo" :rotate="-90" /> 重置
        </a-button>
      </div>
    </div>
    <table-component
      :columns="columns"
      :data-source="resultData"
      :pagination="pagination"
      class="result-table"
      :rowKey="(record) => record.id"
      :loading="tableLoading"
    >
      <div slot="modeValue" slot-scope="record" class="way-slot">
        <span class="way-slot-item item-config" v-if="record.modeValue === 0"
          >配置化</span
        >
        <span class="way-slot-item item-sql" v-else>SQL</span>
      </div>
      <div slot="actions" slot-scope="record">
        <a @click="checkDetail(record)">查看</a>
        <a @click="deleteResult(record)">删除</a>
      </div>
    </table-component>
    <a-drawer
      title="线索详情"
      placement="right"
      :visible="drawerVisible"
      @close="onDrawerClose"
      width="700"
      class="result-detail-drawer"
    >
      <div class="result-detail-drawer-content">
        <div class="sub-title" v-if="checkData.modeValue === 0">基本信息</div>
        <div class="content-item" v-if="checkData.modeValue === 0">
          <p class="item-info">
            <span class="item-info-label">企业名称</span>
            <span class="item-info-text">{{ checkData.eName }}</span>
          </p>
          <p class="item-info">
            <span class="item-info-label">企业ID</span>
            <span class="item-info-text">{{ checkData.eId }}</span>
          </p>
        </div>
        <div class="sub-title" v-if="checkData.modeValue === 0">命中信息</div>
        <div class="content-item">
          <p class="item-info">
            <span class="item-info-label">规则类型</span>
            <span class="item-info-text">{{ checkData.ruleType }}</span>
          </p>
          <p class="item-info">
            <span class="item-info-label">规则名称</span>
            <span class="item-info-text">{{ checkData.ruleName }}</span>
          </p>
          <p class="item-info" v-if="checkData.modeValue === 0">
            <span class="item-info-label">命中结果</span>
            <span class="item-info-text">{{
              checkData.conditionCount + "中" + checkData.hitCount
            }}</span>
          </p>
        </div>
        <div class="result-content" v-if="checkData.modeValue === 0">
          <condition-group
            :list="rulesGroup"
            :originList="rulesGroup"
            :value="[]"
            :floor="0"
            :isCondition="false"
          />
        </div>
        <div class="result-content" v-else>
          <table-component
            :columns="detailColumns"
            :data-source="resultTableData"
            :pagination="detailPagination"
            class="detail-table"
            :rowKey="(record) => record.id"
            :loading="tableLoading2"
            :scroll="{ x: 'max-content', y: 'calc(100% - 59px)' }"
          >
          </table-component>
        </div>
      </div>
      <a-button type="primary" @click="onDrawerClose"> 确定 </a-button>
    </a-drawer>
  </div>
</template>
<script>
import TableComponent from "@/components/tableComponent";
import {
  delRiskResult,
  queryAbRiskResultByPage,
  riskResultConditionHit,
  riskResultDetail,
} from "@/shared/api/auditManage.js";
import { getCategoryList } from "@/shared/api/configManage.js";
import { getRulesGroup, modalConfirm } from "@/utils/common.js";
import { Button, Icon, Input } from "ant-design-vue";
import moment from "moment";
import ConditionGroup from "./conditionGroup";

export default {
  name: "AuditResults",
  data() {
    return {
      eName: undefined,
      ruleType: undefined,
      ruleTypeOptions: [],
      modeValue: 0,
      ruleName: undefined,
      searchLoading: false,
      columns: [],
      resultData: [],
      pagination: {
        size: "small",
        total: 0,
        current: 1,
        pageSize: 15,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ["5", "10", "15", "20"],
        showTotal: (total, current) => {
          return `共${total}条记录，当前第${Math.ceil(
            current[0] / this.pagination.pageSize
          )}页`;
        },
        onChange: (page, pageSize) => {
          this.pagination.current = page;
          this.pagination.pageSize = pageSize;
          this.getResultList("repeat");
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = 1;
          this.pagination.pageSize = size;
          this.getResultList("repeat");
        },
      },
      drawerVisible: false,
      checkData: {},
      panes: [
        {
          title: "企业结果",
          key: 0,
          icon: "房地产",
        },
        {
          title: "其他结果",
          key: 1,
          icon: "appstore",
        },
      ],
      tableLoading: false,
      rulesGroup: [],
      resultTableData: [],
      detailColumns: [],
      detailData: [],
      tableLoading2: false,
      detailPagination: {
        size: "small",
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ["5", "10", "15", "20"],
        showTotal: (total, current) => {
          return `共${total}条记录，当前第${Math.ceil(
            current[0] / this.detailPagination.pageSize
          )}页`;
        },
        onChange: (page, pageSize) => {
          this.detailPagination.current = page;
          this.detailPagination.pageSize = pageSize;
          this.checkDetail(this.checkData, "repeat");
        },
        onShowSizeChange: (current, size) => {
          this.detailPagination.current = 1;
          this.detailPagination.pageSize = size;
          this.checkDetail(this.checkData, "repeat");
        },
      },
    };
  },
  components: {
    AButton: Button,
    AIcon: Icon,
    AInput: Input,
    ConditionGroup,
    TableComponent,
  },
  mounted() {
    this.getResultList("init");
    this.getRuleCategory();
  },
  methods: {
    resetConditions() {
      this.eName = undefined;
      this.ruleType = undefined;
      this.ruleName = undefined;
      this.status = undefined;
      this.getResultList("init");
    },
    async checkDetail(record, type) {
      this.checkData = record;
      if (record.modeValue === 0) {
        // 配置化
        const json = {
          ruleType: 0,
          ruleId: record.ruleId,
          id: record.id,
        };
        const loading = this.$message.loading("正在查询", 0);
        const res = await riskResultConditionHit(json);
        loading();
        if (res.message === "成功") {
          this.checkData.hitCount = res.data.hitCount;
          this.checkData.conditionList = res.data.conditionVos;
          this.checkData.conditionCount = res.data.conditionCount;
          this.rulesGroup = getRulesGroup(res.data.conditionVos);
          this.drawerVisible = true;
        } else {
          this.$message.error(res.message);
        }
      } else {
        // sql
        if (type !== "repeat") {
          this.$set(this.detailPagination, "current", 1);
        }
        const json = {
          ruleType: 1,
          flowId: record.flowId,
          pageNo: this.detailPagination.current,
          pageSize: this.detailPagination.pageSize,
        };
        const loading = this.$message.loading("正在查询", 0);
        this.tableLoading2 = true;
        const res = await riskResultDetail(json);
        loading();
        this.tableLoading2 = false;
        if (res.message === "成功") {
          this.$set(this.detailPagination, "total", res.data.totalCount);
          const columns = [];
          Object.keys(JSON.parse(res.data.dateList[0].fieldResult)).forEach(
            (key) => {
              columns.push({
                title: key,
                dataIndex: key,
                key: key,
                width: 120,
              });
            }
          );
          this.detailColumns = columns;
          const tableValue = [];
          res.data.dateList.map((item) => {
            tableValue.push(JSON.parse(item.fieldResult));
          });
          this.resultTableData = tableValue;
          this.drawerVisible = true;
        } else {
          this.$message.error(res.message);
        }
      }
    },
    async getRuleCategory() {
      const resData = await getCategoryList(1);
      if (!resData) {
        this.$message.error("获取规则分类失败，请重试");
        return false;
      }
      const ruleTypeOptions = [];
      resData.map((item) => {
        ruleTypeOptions.push({
          value: item.id,
          label: item.categoryName,
        });
      });
      this.ruleTypeOptions = ruleTypeOptions;
    },
    deleteResult(record) {
      const _that = this;
      const title = `确定要删除 ${record.flowId} 吗？`;
      const onOk = async () => {
        const loading = _that.$message.loading(`正在删除`, 0);
        const res = await delRiskResult(record.id);
        loading();
        if (res.message === "成功") {
          _that.$message.success(`删除成功`);
          this.getResultList("init");
        } else {
          _that.$message.error(`${res.message}`);
        }
      };
      modalConfirm(title, _that, onOk);
    },
    onDrawerClose() {
      this.drawerVisible = false;
    },
    changeSelected(key) {
      this.modeValue = key;
      this.getResultList("init");
    },
    async getResultList(type) {
      if (type === "init") {
        this.$set(this.pagination, "current", 1);
      }
      this.tableLoading = true;
      const json = {
        customer: this.eName,
        ruleCategory: this.ruleType,
        ruleType: this.modeValue,
        ruleName: this.ruleName,
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
      };
      const res = await queryAbRiskResultByPage(json);
      if (this.modeValue === 0) {
        this.columns = [
          {
            title: "线索/流水号",
            dataIndex: "flowId",
            key: "flowId",
            width: 140,
          },
          {
            title: "企业名称",
            dataIndex: "eName",
            key: "eName",
            width: 200,
          },
          {
            title: "企业ID",
            dataIndex: "eId",
            key: "eId",
            width: 159,
          },
          {
            title: "规则类型",
            dataIndex: "ruleType",
            key: "ruleType",
            width: 120,
          },
          {
            title: "规则名称",
            dataIndex: "ruleName",
            key: "ruleName",
            width: 120,
          },
          {
            title: "生成方式",
            dataIndex: "modeValue",
            key: "modeValue",
            width: 100,
            scopedSlots: { customRender: "modeValue" },
          },
          {
            title: "最新触发时间",
            dataIndex: "lastTime",
            key: "lastTime",
            width: 180,
          },
          {
            title: "操作",
            dataIndex: "actions",
            key: "actions",
            width: 80,
            scopedSlots: { customRender: "actions" },
          },
        ];
      } else {
        this.columns = [
          {
            title: "线索/流水号",
            dataIndex: "flowId",
            key: "flowId",
            width: 140,
          },
          {
            title: "规则类型",
            dataIndex: "ruleType",
            key: "ruleType",
            width: 120,
          },
          {
            title: "规则名称",
            dataIndex: "ruleName",
            key: "ruleName",
            width: 120,
          },
          {
            title: "生成方式",
            dataIndex: "modeValue",
            key: "modeValue",
            width: 100,
            scopedSlots: { customRender: "modeValue" },
          },
          {
            title: "最新触发时间",
            dataIndex: "lastTime",
            key: "lastTime",
            width: 180,
          },
          {
            title: "操作",
            dataIndex: "actions",
            key: "actions",
            width: 80,
            scopedSlots: { customRender: "actions" },
          },
        ];
      }
      this.tableLoading = false;
      if (res.message === "成功") {
        this.$set(this.pagination, "total", res.data.totalCount);
        this.resultData = res.data.dateList.map((item) => {
          return {
            id: item.id,
            flowId: item.flowId,
            eName: item.customer,
            eId: item.custId,
            ruleType: item.categoryName,
            ruleName: item.ruleName,
            ruleId: item.ruleId,
            modeValue: item.ruleType,
            lastTime: moment(item.triggerDate).format("YYYY-MM-DD HH:mm:ss"),
          };
        });
      }
    },
  },
};
</script>
<style lang="less">
.audit-results {
  height: 100%;
  background: #fff;
  border-radius: 5px;
  padding: 24px;

  &-conditions {
    max-width: 1320px;
    display: flex;
    align-items: center;
    margin: 24px 0 8px;

    .conditions-item {
      margin-bottom: 16px;
      width: calc((100% - 120px) / 3);
      display: flex;
      align-items: center;
      margin-right: 40px;

      &-label {
        width: 65px;
        color: @primaryTextColor;
      }

      &-input {
        max-width: 300px;
        width: calc(100% - 65px);
      }

      .search-button {
        margin-right: 24px;
      }
    }
  }

  .result-table {
    height: calc(100% - 168px);

    .way-slot {
      &-item {
        font-size: 12px;
        padding: 2px 10px;
      }

      .item-config {
        color: @orange;
        background: #fce7d1;
        border: 1px solid #f7b674;
      }

      .item-sql {
        color: @blue;
        background: #cce2ff;
        border: 1px solid #67a8ff;
      }
    }
  }
}

.result-detail-drawer {
  .ant-drawer-wrapper-body {
    .ant-drawer-body {
      height: calc(100% - 107px);
      border-bottom: 1px solid #e8e8e8;
      overflow: auto;

      .result-detail-drawer-content {
        height: 100%;

        .content-item {
          margin-bottom: 24px;

          .item-info {
            display: flex;
            margin-bottom: 16px;
            align-items: center;

            &-label {
              width: 65px;
              text-align: right;
              color: @secondaryTextColor;
            }

            &-text {
              margin-left: 16px;
              color: @primaryTextColor;
            }
          }
        }

        .result-content {
          height: calc(100% - 82px);
        }
      }

      .ant-btn {
        position: absolute;
        right: 16px;
        bottom: 10px;
      }
    }
  }
}
</style>
