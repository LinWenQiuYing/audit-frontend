<template>
  <div :class="[listClass, 'common-list']">
    <div :class="[isTitle ? 'common-list-header' : '']">
      <slot name="tableTitle"></slot>
    </div>

    <div class="common-list-bottom">
      <div class="bottom-search">
        <slot name="searchOptions"></slot>
      </div>
      <div class="bottom-btns">
        <slot name="tableBtns"></slot>
      </div>
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :rowKey="rowKey"
        :pagination="pagination"
        :loading="loading"
        :class="[className, 'bottom-table']"
        :scroll="scroll"
        :customRow="customRow"
        :bordered="bordered"
        :rowSelection="rowSelection"
        v-on="$listeners"
      >
        <!-- :rowSelection="rowSelection" -->
        <template
          v-for="column in columns"
          :slot="column.scopedSlots ? column.scopedSlots.customRender : ''"
          slot-scope="text, record"
        >
          <slot
            :name="column.scopedSlots ? column.scopedSlots.customRender : ''"
            v-bind="record"
          ></slot>
        </template>
      </a-table>
    </div>
    <slot name="otherPart"></slot>
  </div>
</template>
<script>
import { Table } from "ant-design-vue";

export default {
  name: "CommonList",
  props: {
    // 表格的类名
    className: {
      type: String,
      default: () => "",
    },
    listClass: {
      type: String,
      default: () => "",
    },
    columns: {
      type: Array,
      default: () => [],
    },
    dataSource: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: () => false,
    },
    isTitle: {
      type: Boolean,
      default: () => false,
    },
    bordered: {
      type: Boolean,
      default: () => false,
    },
    rowKey: {
      type: [String, Function],
      default: () => (record) => record.key,
    },
    rowSelection: {
      type: Object,
      default: () => null,
    },
    pagination: {
      type: Object,
      default: () => ({
        size: "small",
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ["5", "10", "15", "20"],
      }),
    },
    scroll: {
      // 如果表格高度有最大值并且有fixed的列，请动态计算表格主体高度赋值于y
      type: Object,
      default: () => ({ x: "max-content", y: "calc(100% - 44px)" }),
    },
    customRow: {
      type: Function,
      default: () => {
        // 这里返回你的默认箭头函数逻辑
        return (row) => {
          console.log(row);
        };
      },
    },
  },
  mounted() {
    console.log("22222222", this.$props);
  },
  data() {
    return {};
  },
  components: {
    ATable: Table,
  },
  computed: {
    // scroll() {
    //   return { x: "max-content", y: `calc(100vh - ${this.scrollHeight}px)` };
    // },
  },
  methods: {},
};
</script>

<style lang="less">
.common-list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  &-header {
    line-height: 32px;
    margin-bottom: 20px;

    .table-header {
      min-height: 32px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      &-title {
        font-size: 20px;
        font-weight: 600;
      }

      &-btn {
        width: 60px;
        height: 32px;
        font-size: 14px;
        color: #3c485c;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 6px;
        border: 1px solid #d6dbe3;
        background: #fff;
      }
    }
  }

  &-bottom {
    height: 300px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .bottom-search {
    display: flex;
    flex-wrap: wrap;
    gap: 16px 40px;
    margin-bottom: 20px;

    &-item {
      width: calc((100% - 120px) / 4); // 默认一行四个，可添加覆盖样式
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

      .item-value {
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

  .bottom-btns {
    .ant-btn {
      margin-bottom: 20px;
      margin-right: 10px;
    }
  }

  .bottom-table {
    height: 235px;
    flex: 1;
  }
}
</style>
