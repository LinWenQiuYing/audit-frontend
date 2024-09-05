<template>
  <a-modal
    class="search-result-modal"
    :title="'搜索结果（' + data.length + '个）'"
    :width="600"
    :mask="false"
    :visible="resultModalVisible"
    @cancel="onResultModalCancel"
    :destroyOnClose="true"
    :maskClosable="true"
  >
    <template slot="footer">
      <div class="search-result-modal-footer">
        <div class="footer-right">
          <a-button @click="onResetCheck">
            <a-icon type="redo" :rotate="-90" /> 重置
          </a-button>
          <a-button
            type="primary"
            :disabled="!checkedList.length"
            @click="showResults('replace')"
          >
            覆盖
          </a-button>
          <a-button
            type="primary"
            :disabled="!checkedList.length"
            @click="showResults('addition')"
          >
            新增
          </a-button>
        </div>
      </div>
    </template>
    <table-component
      :columns="columns"
      :data-source="data"
      :row-selection="rowSelection"
      :rowKey="(record) => record.key"
      :pagination="pagination"
    >
      <div slot="content" slot-scope="record" class="table-slot">
        <a-tooltip placement="topLeft">
          <template slot="title">
            <span>
              {{ record.dataType === "路径" ? record.content : record.userId }}
            </span>
          </template>
          <span>
            {{ record.dataType === "路径" ? record.content : record.userId }}
          </span>
        </a-tooltip>
      </div>
      <span slot="dataType" slot-scope="record" class="result-input-text">
        {{ record.dataType }}
      </span>
    </table-component>
  </a-modal>
</template>
<script>
import TableComponent from "@/components/tableComponent";
import { Button, Icon, Tooltip } from "ant-design-vue";

export default {
  name: "SearchResultModal",
  props: ["data", "resultModalVisible"],
  data() {
    return {
      checkedList: [],
      indeterminate: false,
      columns: [
        {
          title: "内容",
          dataIndex: "content",
          key: "content",
          width: 347,
          scopedSlots: { customRender: "content" },
          align: "center",
        },
        {
          title: "标签",
          dataIndex: "dataType",
          key: "dataType",
          width: 100,
          scopedSlots: { customRender: "dataType" },
          align: "center",
        },
      ],
      pagination: {
        size: "small",
        total: 0,
        current: 1,
        pageSize: 15,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ["5", "10", "15", "20"],
        showTotal: (total) => {
          return `共${total}条记录`;
        },
        onChange: (page, pageSize) => {
          this.pagination.current = page;
          this.pagination.pageSize = pageSize;
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = 1;
          this.pagination.pageSize = size;
        },
      },
    };
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.checkedList = selectedRows;
          if (this.checkedList.length === 0) {
            this.indeterminate = false;
          } else if (this.checkedList.length < this.data.length) {
            this.indeterminate = true;
          } else {
            this.indeterminate = false;
          }
        },
      };
    },
  },
  components: {
    AButton: Button,
    AIcon: Icon,
    ATooltip: Tooltip,
    TableComponent,
  },
  methods: {
    onResultModalCancel() {
      this.$emit("resultModalVisibleChanged", false);
    },
    showResults(type) {
      this.$emit("showResults", type, this.checkedList);
    },
    onResetCheck() {
      this.checkedList = [];
      this.indeterminate = false;
    },
  },
};
</script>
<style lang="less">
.search-result-modal {
  .ant-modal {
    top: auto;
    bottom: 0;
    margin: 0;
    left: 915px;
    height: 775px;
    padding-bottom: 0;
    position: absolute;
    box-shadow: 0 4px 12px 0 #dbdfee;
  }

  .ant-modal-content {
    height: 100%;

    .ant-modal-body {
      overflow: auto;
      padding: 20px 24px 0;
      height: calc(100% - 114px);

      .table-slot {
        width: 331px;
        height: 27px;
        overflow: hidden;
        line-height: 27px;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    .ant-modal-footer {
      left: 0;
      right: 0;
      bottom: 0;
      padding: 13px 24px;
      position: absolute;

      .search-result-modal-footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .footer-left {
          .ant-checkbox {
            margin-top: 2px;
          }
        }
      }
    }
  }
}
</style>
