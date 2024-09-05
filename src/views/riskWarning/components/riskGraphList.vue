<template>
  <div class="risk-warning-graph-list">
    <TreeList
      treeTitle="图模型线索分类"
      @selectedKeyChange="selectedKeyChange"
      @getCategoryAllOptions="getCategoryAllOptions"
    />
    <CommonList
      isTitle
      listClass="risk-warning-graph-list-right"
      className="risk-table"
      :columns="columns"
      :dataSource="tableValue"
      :pagination="pagination"
      :loading="tableLoading"
      :scroll="{ x: 'max-content', y: 'calc(100vh - 409px)' }"
      bordered
      :rowKey="(record, index) => index"
      @change="handleTableChange"
    >
      <!-- 大标题 -->
      <div slot="tableTitle" class="table-header">
        <div class="table-header-title">线索概览列表</div>
      </div>
      <template slot="searchOptions">
        <div class="bottom-search-item">
          <span class="item-label">模型名称：</span>
          <a-select
            class="item-value"
            v-model="modelName"
            placeholder="模型名称"
            :options="modelOptions"
          />
        </div>
        <div class="bottom-search-item">
          <span class="item-label">模型分类：</span>
          <a-select
            class="item-value"
            v-model="modelCategory"
            placeholder="模型分类"
          >
            <a-select-option
              :value="item.value"
              v-for="item in categoryAllOptions"
              :key="item.value"
              >{{ item.label }}</a-select-option
            >
          </a-select>
        </div>

        <div class="bottom-search-item">
          <span class="item-label">选择日期：</span>
          <a-range-picker
            v-model="startStopTime"
            format="YYYY-MM-DD"
            valueFormat="YYYY-MM-DD"
            class="item-value"
            :placeholder="['开始日期', '截止日期']"
          >
            <template slot="suffixIcon">
              <a-icon type="calendar" />
            </template>
          </a-range-picker>
        </div>
        <div class="bottom-search-item actions">
          <a-button
            type="primary"
            @click="onSearch('init')"
            class="actions-btn"
          >
            查询
          </a-button>
          <a-button @click="onReset" class="actions-btn"> 重置 </a-button>
        </div>
      </template>
      <template slot="ruleName" slot-scope="record">
        <router-link :to="`/schedule?name=${record.ruleName}`">{{
          record.ruleName
        }}</router-link>
      </template>
      <template slot="graphName" slot-scope="record">
        <div>{{ record.graphName }}</div>
        <div>{{ record.graphVersion }}</div>
      </template>
      <div slot="actions" slot-scope="record" class="slot-actions">
        <a
          href="javascript:void(0);"
          :class="record.riskNumber ? '' : 'disabled'"
          @click="handleDetail(record)"
          >查看线索详情</a
        >
      </div>
    </CommonList>
  </div>
</template>
<script>
import { queryRiskOverviewByPage } from "@/shared/api/riskWarning.js";
import { queryRuleModelList } from "@/shared/api/configManage.js";
import CommonList from "@/components/commonList";
import { Button, DatePicker, Icon } from "ant-design-vue";
import TreeList from "@/views/configManage/components/treeList.vue";
import dayjs from "dayjs";

export default {
  name: "RiskGraphList",
  data() {
    return {
      modelName: "",
      startStopTime: [],
      modelCategory: "",
      modelOptions: [
        {
          value: "",
          label: "全部",
        },
      ],
      categoryAllOptions: [],
      tableLoading: false,
      columns: [
        {
          title: "图谱名称",
          dataIndex: "graphName",
          key: "graphName",
          width: 160,
          scopedSlots: { customRender: "graphName" },
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
          width: 200,
          scopedSlots: { customRender: "ruleName" },
        },
        {
          title: "对应线索条数",
          dataIndex: "riskNumber",
          key: "riskNumber",
          width: 130,
          sorter: true,
        },
        {
          title: "线索生成时间",
          dataIndex: "createDate",
          key: "createDate",
          width: 180,
        },
        {
          title: "模型描述",
          dataIndex: "modelDesc",
          key: "modelDesc",
          width: 270,
        },
        {
          title: "模型分类",
          dataIndex: "modelCatogory",
          key: "modelCatogory",
          width: 160,
        },
        {
          title: "操作",
          dataIndex: "actions",
          key: "actions",
          width: 140,
          scopedSlots: { customRender: "actions" },
          fixed: "right",
        },
      ],
      tableValue: [],
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
          this.onSearch("repeat");
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = 1;
          this.pagination.pageSize = size;
          this.onSearch("repeat");
        },
      },
      tableOrder: undefined,
    };
  },
  computed: {},
  components: {
    AButton: Button,
    AIcon: Icon,
    ARangePicker: DatePicker.RangePicker,
    CommonList,
    TreeList,
  },
  mounted() {
    this.getModalList();
    this.onSearch("init");
  },
  methods: {
    async getModalList() {
      // 查询模型列表
      try {
        const res = await queryRuleModelList();
        const modelOptions = [
          {
            value: "",
            label: "全部",
          },
        ];
        if (res.message !== "成功" || !res.data) {
          this.$message.error("获取模型下拉数据失败");
        } else {
          res.data.map((item) => {
            modelOptions.push({
              value: item.id,
              label: item.modelName,
              modelType: item.modelType,
            });
          });
          this.modelOptions = modelOptions;
        }
      } catch (error) {
        this.$message.destroy();
        this.$message.error("获取模型下拉数据失败");
      }
    },
    async handleDetail(record) {
      if (!record.riskNumber) return;
      this.$emit("detailChange", record);
      this.$emit("isRiskListShowChange", false);
    },
    async onSearch(type) {
      this.tableLoading = true;
      if (type === "init") {
        this.$set(this.pagination, "current", 1);
      }
      const json = {
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
        modelName: this.modelName || undefined,
        categoryId: this.modelCategory || undefined,
        checkStartTime: this.startStopTime.length
          ? dayjs(this.startStopTime[0])
              .startOf("day")
              .format("YYYY-MM-DD HH:mm:ss")
          : undefined,
        checkEndTime: this.startStopTime.length
          ? dayjs(this.startStopTime[1])
              .endOf("day")
              .format("YYYY-MM-DD HH:mm:ss")
          : undefined,
        orderBy: this.tableOrder,
        // ruleName: this.createType,
      };
      try {
        const res = await queryRiskOverviewByPage(json);
        this.$set(this.pagination, "total", parseInt(res.data.totalCount));
        const tableValue = [];
        res.data.dateList.map((item) => {
          tableValue.push({
            id: item.id,
            modelName: item.modelName,
            ruleName: item.ruleName,
            ruleId: item.ruleId,
            modelDesc: item.modelDesc,
            modelCatogory: item.categoryName,
            graphName: item.graphChName,
            riskNumber: item.riskNum,
            createDate: dayjs(item.execDateTime).format("YYYY-MM-DD HH:mm:ss"),
          });
        });
        this.tableValue = tableValue;
      } catch (error) {
        console.log(error);
        this.$message.destroy();
        this.$message.error("获取线索概览列表失败，请重试");
      } finally {
        this.tableLoading = false;
      }
    },
    handleTableChange(pagination, filters, sorter) {
      console.log("handleTableChange", pagination, filters, sorter);
      // 0正序，1倒序，undefined无序
      this.tableOrder = sorter.order
        ? sorter.order === "ascend"
          ? "0"
          : "1"
        : undefined;
      this.onSearch("init");
    },
    onReset() {
      this.modelName = "";
      this.modelCategory = "";
      this.startStopTime = [];
      this.onSearch("init");
    },
    getCategoryAllOptions(value) {
      console.log("🚀 ~ getCategoryAllOptions ~ getCategoryAllOptions:", value);
      this.categoryAllOptions = value;
    },
    selectedKeyChange(key) {
      this.modelCategory = key;
      this.onSearch("init");
    },
  },
};
</script>
<style lang="less" scoped>
.risk-warning-graph-list {
  height: 100%;
  display: flex;
  padding: 20px;
  background: #fff;

  &-right {
    flex: 1;
    height: 100%;
    border-radius: 5px;
    width: calc(75% - 20px);

    .risk-table {
      .status-cell {
        display: flex;
        align-items: center;

        img {
          margin-right: 8px;
        }
      }

      .way-slot {
        &-item {
          font-size: 12px;
          padding: 2px 10px;
        }
      }

      .item-config {
        color: @cyan;
        background: #e6fffb;
        border: 1px solid #87e8de;
      }

      .item-sql {
        color: @blue;
        background: #e6f7ff;
        border: 1px solid #91d5ff;
      }

      .slot-actions {
        display: flex;

        // a {
        //   width: 16px;
        //   height: 16px;
        //   display: flex;
        //   margin: 0 !important;
        // }

        .ant-divider {
          top: 2px;
        }
      }
    }
  }
}
</style>
