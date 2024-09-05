<template>
  <div class="graph-history">
    <div class="graph-history-header">
      <div class="title-box">
        <span class="title-name">图谱编号：{{ details.id || "--" }}</span>
        <span class="title-name">图谱名称：{{ details.name || "--" }}</span>
        <span class="title-name">图谱描述：{{ details.desc || "--" }}</span>
      </div>
      <a-button @click="handleReturn">返回</a-button>
    </div>
    <div class="sub-title-wrapper">
      <div class="sub-title">更新历史详情</div>
      <a-tooltip placement="topLeft" overlayClassName="wrapper-title-tooltip">
        <template slot="title">
          <span>111111</span>
        </template>
        <div class="tooltip-icon">
          <icon-svg icon-class="icon-warning" color="#1776FF"></icon-svg>
        </div>
      </a-tooltip>
    </div>
    <a-table
      :columns="columns"
      :data-source="tableValue"
      :pagination="pagination"
      class="history-table"
      :loading="tableLoading"
      :rowKey="(record) => record.index"
      :scroll="{ x: 'max-content', y: '450px' }"
      bordered
    >
    </a-table>
  </div>
</template>

<script>
import { Button, Tooltip } from "ant-design-vue";
import { getUpdateHistory } from "@/shared/api/graphsStructure.js";

export default {
  name: "GraphHistory",
  props: ["details"],
  data() {
    return {
      columns: [
        {
          title: "序号",
          dataIndex: "index",
          key: "index",
          width: 70,
        },
        {
          title: "更新时间",
          dataIndex: "updateTime",
          key: "updateTime",
          width: 180,
        },
        {
          title: "源表更新范围",
          dataIndex: "sourceRange",
          key: "sourceRange",
          width: 200,
        },
        {
          title: "图谱更新后版本",
          dataIndex: "newVersion",
          key: "newVersion",
          width: 150,
        },
        {
          title: "更新内容",
          dataIndex: "updateContent",
          key: "updateContent",
          width: 200,
        },
        {
          title: "更新后数据量",
          dataIndex: "dataNumber",
          key: "dataNumber",
          width: 200,
        },
      ],
      tableValue: [],
      tableLoading: false,
      pagination: {
        size: "small",
        total: 0,
        current: 1,
        pageSize: 20,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ["10", "20", "50", "100"],
        showTotal: (total) => {
          return `共${total}条记录`;
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
    };
  },
  components: {
    AButton: Button,
    ATooltip: Tooltip,
  },
  mounted() {
    console.log("details", this.details);
    this.onSearch("init");
  },
  methods: {
    handleReturn() {
      this.$emit("isDetailShowChanged", false);
    },
    async onSearch(type) {
      if (type === "init") {
        this.$set(this.pagination, "current", 1);
      }
      const json = {
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
        graphId: this.details.id,
      };
      this.tableLoading = true;
      try {
        const res = await getUpdateHistory(json);
        this.$set(this.pagination, "total", parseInt(res.data.totalCount));
        const tableValue = [];
        res.data.dateList.map((item, index) => {
          tableValue.push({
            index: index + 1,
            updateTime: item.graphUpdateTime || "--",
            sourceRange: item.sourceTableRange,
            newVersion: item.version,
            updateContent: item.updateContent,
            dataNumber: item.totalData,
          });
        });
        this.tableValue = tableValue;
      } catch (error) {
        this.$message.destroy();
        this.$message.error("获取图谱更新历史失败");
      } finally {
        this.tableLoading = false;
      }
    },
  },
};
</script>

<style scoped lang="less">
.graph-history {
  width: 100%;
  height: 100%;
  padding: 20px;
  background: #fff;
  display: flex;
  flex-direction: column;

  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;

    .title-name {
      margin-right: 20px;
    }
  }

  .sub-title-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
