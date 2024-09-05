<template>
  <a-table
    :class="border ? 'border-table table-component' : 'table-component'"
    v-bind="$props"
    v-on="$listeners"
    :border="border"
    :size="size"
    :scroll="scroll"
    :rowKey="rowKey"
  >
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
</template>
<script>
import props from "./tableProps.js";

export default {
  name: "TableComponent",
  mixins: [props],
  props: {
    // 表格的类名
    border: {
      type: Boolean,
      default: () => false,
    },
    size: {
      type: String,
      default: () => "small",
    },
    scroll: {
      // 如果表格高度有最大值并且有fixed的列，请动态计算表格主体高度赋值于y
      type: Object,
      default: () => ({ x: "max-content", y: "calc(100% - 49px)" }),
    },
    rowKey: {
      type: [String, Function],
      default: () => (record) => record.key,
    },
  },
  mounted() {},
  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang="less">
.table-component {
  height: 100%;

  .ant-spin-nested-loading {
    height: 100%;

    .ant-spin-container {
      height: 100%;

      .ant-table {
        border: none;
        border-radius: 0;
        height: calc(100% - 56px);

        .ant-table-content {
          height: 100%;

          .ant-table-scroll {
            height: 100%;
          }

          .ant-table-header {
            // width: calc(100% + 5px);

            .ant-table-fixed {
              border-radius: 0;

              .ant-table-thead {
                background-color: @tableHeaderBackgroundColor !important;

                .ant-table-row-cell-break-word {
                  font-weight: 600;
                  padding: 13px 20px;
                  color: @primaryTextColor;
                }
              }
            }
          }

          .ant-table-tbody {
            .ant-table-row {
              .ant-table-row-cell-break-word {
                padding: 13px 20px;
                color: @primaryTextColor;

                .no-action {
                  color: @secondaryTextColor;
                  user-select: none;
                  cursor: not-allowed;
                }

                a {
                  color: @activeFontColor;
                  margin-right: 24px;

                  &:last-child {
                    margin-right: 0;
                  }
                }

                .color-type {
                  &.red {
                    .ant-badge-status-text {
                      color: @red;
                    }
                  }

                  &.green {
                    .ant-badge-status-text {
                      color: @green;
                    }
                  }

                  &.orange {
                    .ant-badge-status-text {
                      color: @orange;
                    }
                  }

                  &.grey {
                    .ant-badge-status-text {
                      color: @disabledColor;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

.border-table {
  .ant-table {
    .ant-table-content {
      border-right: 0 !important;

      .ant-table-header {
        border-radius: 0 !important;

        .ant-table-row-cell-break-word,
        .ant-table-selection-column {
          border-top: 1px solid @borderColor !important;
          border-right: 1px solid @borderColor !important;
          border-bottom: 1px solid @borderColor !important;
          border-radius: 0 !important;
        }
      }

      .ant-table-fixed {
        border-left: 1px solid @borderColor !important;
      }
      .ant-table-fixed,
      .ant-table-body-outer {
        .ant-table-row-cell-break-word,
        .ant-table-selection-column {
          border-right: 1px solid @borderColor !important;
          border-bottom: 1px solid @borderColor !important;
          color: @primaryTextColor !important;
        }
      }
    }
  }
}
</style>
