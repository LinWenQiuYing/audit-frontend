<!-- 异常分析：预算执行率 -->
<template>
  <div class="budget-execution">
    <div class="manage-right">
      <div class="manage-right-header">
        预算执行率（当前单位：{{ curTreeItem.title }})
      </div>
      <div class="manage-right-box">
        <!-- 1.下属单位 -->
        <div class="table-top">
          <div class="sub-title">下属单位</div>
        </div>
        <a-table
          :columns="columns1"
          :data-source="tableData1"
          :pagination="false"
          :scroll="{ x: 'max-content', y: 500 }"
          :loading="tableLoading1"
          :bordered="true"
        >
          <span
            slot="xmlx"
            slot-scope="text, record"
            :class="
              tableName2 === text && tableName1 === record.xsdwmc
                ? 'custom-cell-a selected'
                : 'custom-cell-a'
            "
            @click="handleClickProject(record.xsdwmc, text)"
          >
            {{ text }}
          </span>

          <div
            slot="zxlDetail"
            slot-scope="_, record"
            style="display: flex; align-items: center"
          >
            <a-progress
              :percent="Number(record.zxl)"
              size="small"
              :show-info="false"
              style="width: 120px"
            />
            <div style="margin-left: 8px; line-height: 40px">
              预算金额：{{
                Number(record.ysje).toLocaleString()
              }}万元；执行金额：{{
                Number(record.zxje).toLocaleString()
              }}万元；执行率：<span
                :style="{
                  color:
                    parseFloat(record.zxl) >=
                    parseFloat(
                      (configParams.highExecutionRate * 100).toFixed(0)
                    )
                      ? 'red'
                      : parseFloat(record.zxl) <=
                        parseFloat(
                          (configParams.lowExecutionRate * 100).toFixed(0)
                        )
                      ? '#f28518'
                      : '',
                }"
                >{{ record.zxl }}%</span
              >
            </div>
          </div>
        </a-table>
        <!-- 4.项目 -->
        <div class="table-top">
          <div class="sub-title">项目</div>
        </div>
        <a-table
          :columns="columns2"
          :data-source="tableData2"
          :pagination="false"
          :scroll="{ x: 'max-content', y: 500 }"
          :loading="tableLoading2"
          :bordered="true"
        >
          <span slot="xmmc" slot-scope="text, record">
            <a @click="handleClickProjectName" href="javascript:;">{{
              text
            }}</a>
          </span>

          <div
            slot="zxlDetail"
            slot-scope="_, record"
            style="display: flex; align-items: center"
          >
            <a-progress
              :percent="Number(record.zxl)"
              size="small"
              :show-info="false"
              style="width: 120px"
            />
            <div style="margin-left: 8px; line-height: 40px">
              预算金额：{{
                Number(record.ysje).toLocaleString()
              }}万元；执行金额：{{
                Number(record.zxje).toLocaleString()
              }}万元；执行率：<span
                :style="{
                  color:
                    parseFloat(record.zxl) >=
                    parseFloat(
                      (configParams.highExecutionRate * 100).toFixed(0)
                    )
                      ? 'red'
                      : parseFloat(record.zxl) <=
                        parseFloat(
                          (configParams.lowExecutionRate * 100).toFixed(0)
                        )
                      ? '#f28518'
                      : '',
                }"
                >{{ record.zxl }}%</span
              >
            </div>
          </div>
        </a-table>
      </div>
    </div>
    <div class="params-config">
      <div class="params-config-header">参数设置</div>
      <div class="params-config-item">
        <div class="item-label">年份：</div>
        <a-select
          placeholder="请选择"
          v-model="curYear"
          :options="yearOptions"
          class="item-input"
        />
      </div>
      <div class="params-config-item">
        <div class="item-label">项目类型：</div>
        <a-select
          class="item-input"
          v-model="projectType"
          :options="projectOptions"
          placeholder="请选择"
        />
      </div>
      <div class="params-config-item">
        <div class="item-label">执行率偏大值</div>
        <div class="item-set">
          <a-input-number
            class="item-set-input"
            placeholder="请输入"
            :min="0"
            :max="1"
            :step="0.1"
            v-model="highExecutionRate"
          />
          <div class="item-set-color-red"></div>
        </div>
      </div>
      <div class="params-config-item">
        <div class="item-label">执行率偏小值</div>
        <div class="item-set">
          <a-input-number
            class="item-set-input"
            placeholder="请输入"
            :min="0"
            :max="1"
            :step="0.1"
            v-model="lowExecutionRate"
          />
          <div class="item-set-color-orange"></div>
        </div>

        <!-- <a-slider
          v-model="lowExecutionRate"
          :min="0"
          :max="1"
          :step="0.1"
          :tipFormatter="(value) => value * 100 + '%'"
        /> -->
      </div>
      <div class="params-config-btns">
        <a-button style="margin-right: 8px" @click="handleParamsReset"
          >重置</a-button
        >
        <a-button type="primary" @click="handleParamsConfig">确定</a-button>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getExecutionTableDataOne,
  getExecutionTableDataTwo,
  getProjectOptions,
} from "@/shared/newApi/manage/execution.js";
import { Button, InputNumber, Select, Table, Progress } from "ant-design-vue";
import { mapState } from "vuex";
import { cloneDeep } from "lodash";

export default {
  name: "BudgetExecution",
  data() {
    return {
      columns1: [
        {
          title: "下属单位名称",
          dataIndex: "xsdwmc",
          key: "xsdwmc",
          width: 250,
          customRender: (text, record, rowIndex) => {
            return this.mergeCells("xsdwmc", text, rowIndex, this.tableData1);
          },
        },
        {
          title: "项目类型",
          dataIndex: "xmlx",
          key: "xmlx",
          width: 150,
          scopedSlots: { customRender: "xmlx" },
        },
        {
          title: "执行率",
          dataIndex: "zxlDetail",
          key: "zxlDetail",
          width: 592,
          scopedSlots: { customRender: "zxlDetail" },
        },
      ],
      tableLoading1: false,
      tableData1: [
        // {
        //   xsdwmc: "单位1",
        //   xmlx: "一般公共预算资金",
        //   ysje: 1000,
        //   zxje: 1000,
        //   zxl: 100,
        // },
        // {
        //   xsdwmc: "单位1",
        //   xmlx: "一般公共预算资金",
        //   ysje: 1000,
        //   zxje: 1000,
        //   zxl: 88,
        // },
      ],
      pagination1: {
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
          this.pagination1.current = page;
          this.pagination1.pageSize = pageSize;
        },
        onShowSizeChange: (current, size) => {
          this.pagination1.current = 1;
          this.pagination1.pageSize = size;
        },
      },
      columns2: [
        {
          title: "单位名称",
          dataIndex: "dwmc",
          key: "dwmc",
          width: 200,
          customRender: (text, record, rowIndex) => {
            return this.mergeCells("dwmc", text, rowIndex, this.tableData2);
          },
        },
        {
          title: "项目类型",
          dataIndex: "xmlx",
          key: "xmlx",
          width: 200,
          customRender: (text, record, rowIndex) => {
            return this.mergeCells("xmlx", text, rowIndex, this.tableData2);
          },
        },
        {
          title: "项目名称",
          dataIndex: "xmmc",
          key: "xmmc",
          width: 200,
          scopedSlots: { customRender: "xmmc" },
        },
        {
          title: "执行率",
          dataIndex: "zxlDetail",
          key: "zxlDetail",
          width: 629,
          scopedSlots: { customRender: "zxlDetail" },
        },
      ],
      tableLoading2: false,
      tableData2: [
        // {
        //   dwmc: "单位1",
        //   xmlx: "类型一",
        //   xmmc: "一",
        //   ysje: 1000,
        //   zxje: 1000,
        //   zxl: 100,
        // },
        // {
        //   dwmc: "单位1",
        //   xmlx: "类型一",
        //   xmmc: "二",
        //   ysje: 1000,
        //   zxje: 1000,
        //   zxl: 100,
        // },
        // {
        //   dwmc: "单位2",
        //   xmlx: "类型三",
        //   xmmc: "二",
        //   ysje: 1000,
        //   zxje: 1000,
        //   zxl: 100,
        // },
      ],
      pagination2: {
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
          this.pagination2.current = page;
          this.pagination2.pageSize = pageSize;
        },
        onShowSizeChange: (current, size) => {
          this.pagination2.current = 1;
          this.pagination2.pageSize = size;
        },
      },

      //页面右上角弹框
      //年份选项
      yearOptions: [
        {
          value: "2018",
          label: "2018",
        },
        {
          value: "2019",
          label: "2019",
        },
        {
          value: "2020",
          label: "2020",
        },
        {
          value: "2021",
          label: "2021",
        },
        {
          value: "2022",
          label: "2022",
        },
        {
          value: "2023",
          label: "2023",
        },
      ],

      //年份
      curYear: "2023",
      //项目类型
      projectType: "",
      projectOptions: [
        {
          value: "",
          label: "全部",
        },
      ],
      //执行率偏大值
      highExecutionRate: 0.98,
      //执行率偏小值
      lowExecutionRate: 0.7,

      // 执行率参数配置
      configParams: {
        curYear: "2023",
        projectType: "",
        highExecutionRate: 0.98,
        lowExecutionRate: 0.7,
      },

      tableName1: undefined,
      tableName2: undefined,
    };
  },
  computed: {
    ...mapState("blockAnalysis", ["blockChoosedYear"]),
    ...mapState("managePortrait", ["curTreeItem"]),
    newConfigParams() {
      return cloneDeep(this.configParams);
    },
  },
  components: {
    AButton: Button,
    AInputNumber: InputNumber,
    ASelect: Select,
    ATable: Table,
    AProgress: Progress,
  },
  watch: {
    curTreeItem: {
      async handler(newVal, oldVal) {
        console.log("curTreeItem", newVal, oldVal);
        if (newVal.key) {
          this.getAllData();
        }
      },
      deep: true,
    },
    newConfigParams: {
      async handler(newVal, oldVal) {
        console.log("预算执行", newVal, oldVal);
        if (newVal.curYear !== oldVal.curYear) {
          this.getAllData();
        } else if (newVal.projectType !== oldVal.projectType) {
          await this.getTableData1();
          await this.getTableData2();
        }
      },
      deep: true, // 深度监听对象内部属性的变化
    },
  },
  mounted() {
    this.getAllData();
  },
  methods: {
    mergeCells(dataIndex, text, rowIndex, data) {
      const currentRowData = data[rowIndex];
      let count = 1;

      // Calculate the rowSpan
      for (let i = rowIndex + 1; i < data.length; i++) {
        if (data[i][dataIndex] === currentRowData[dataIndex]) {
          count++;
        } else {
          break;
        }
      }

      if (
        rowIndex > 0 &&
        data[rowIndex - 1][dataIndex] === currentRowData[dataIndex]
      ) {
        return {
          children: text,
          attrs: {
            rowSpan: 0,
          },
        };
      }

      const _that = this;
      return {
        children:
          dataIndex === "xsdwmc"
            ? _that.$createElement(
                "span",
                {
                  class:
                    _that.tableName1 === text
                      ? "custom-cell-a selected"
                      : "custom-cell-a",
                  on: {
                    click: () => _that.handleClickUnit(text),
                  },
                },
                text
              )
            : text,
        attrs: {
          rowSpan: count,
        },
      };
    },
    handleParamsReset() {
      //年份
      this.curYear = "2023";
      //项目类型
      this.projectType = "";
      //执行率偏大值
      this.highExecutionRate = 0.98;
      //执行率偏小值
      this.lowExecutionRate = 0.7;

      this.configParams.curYear = "2023";
      this.configParams.projectType = "";
      this.configParams.highExecutionRate = 0.98;
      this.configParams.lowExecutionRate = 0.7;
    },
    handleParamsConfig() {
      this.configParams.curYear = this.curYear;
      this.configParams.projectType = this.projectType;
      this.configParams.highExecutionRate = this.highExecutionRate;
      this.configParams.lowExecutionRate = this.lowExecutionRate;
      console.log("预算执行点击确认按钮", this.configParams);
    },
    async getTableData1() {
      const json = {
        year: this.configParams.curYear, // 年份
        dept_code: this.curTreeItem.key,
        pro_type_name:
          this.configParams.projectType == ""
            ? null
            : [this.configParams.projectType],
      };
      this.tableLoading1 = true;
      const res = await getExecutionTableDataOne(json);
      if (res.message === "成功") {
        this.tableData1 = res.data;
        this.tableLoading1 = false;
      } else {
        this.$message.error(res.msg);
      }
    },
    async getTableData2() {
      if (!this.tableName1) return;
      const json = {
        year: this.configParams.curYear, // 年份
        dept_code: this.curTreeItem.key,
        unit_name: this.tableName1,
        pro_type_name: this.configParams.projectType || this.tableName2,
      };
      this.tableLoading2 = true;
      const res = await getExecutionTableDataTwo(json);
      if (res.message === "成功") {
        this.tableData2 = res.data;
        this.tableLoading2 = false;
      } else {
        this.$message.error(res.msg);
      }
    },
    handleClickProjectName() {
      // todo 等待页面
    },
    handleClickUnit(text) {
      console.log(text);
      this.tableName1 = text;
      this.tableName2 = undefined;
      this.getTableData2();
    },
    handleClickProject(unit, text) {
      this.tableName1 = unit;
      this.tableName2 = text;
      this.getTableData2();
    },
    async getProjectOptions() {
      const res = await getProjectOptions();
      if (res.message === "成功") {
        this.projectOptions = [
          {
            label: "全部",
            value: "",
          },
          ...res.data,
        ];
      } else {
        this.$message.error(res.msg);
      }
    },
    async getAllData() {
      if (!this.curTreeItem.key) return;
      await this.getProjectOptions();
      await this.getTableData1();
      await this.getTableData2();
    },
  },
};
</script>
<style lang="less">
.budget-execution {
  width: calc(100% - 320px);
  min-height: 100%;
  padding: 20px;
  background: #fff;
  display: flex;

  .manage-right {
    width: calc(100% - 220px);
    margin-right: 220px;

    &-header {
      height: 28px;
      line-height: 28px;
      color: #1c222b;
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 20px;
    }

    .table-top {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    }

    //鼠标移入样式清除
    .ant-table-row {
      &:hover {
        td {
          background: transparent !important;
        }
      }
    }

    .custom-cell-a {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      padding: 9px 11px;
      cursor: pointer;

      &.selected {
        background: #e6f7ff !important;
      }
    }

    &-box {
      padding-bottom: 20px;
    }
  }

  .params-config {
    width: 200px;
    position: fixed;
    right: 40px;
    border: 1px solid #d6dbe3;
    border-radius: 6px;
    padding: 12px 16px;

    &-header {
      color: #3c485c;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 20px;
    }

    &-item {
      width: 100%;
      margin-bottom: 10px;

      .item-label {
        margin-bottom: 4px;
      }

      .item-set {
        width: 100%;
        display: flex;
        align-items: center;

        &-input {
          width: 60%;
        }

        &-color-red,
        &-color-orange {
          width: 24px;
          height: 24px;
          margin-left: 16px;
        }

        &-color-red {
          background-color: red;
        }
        &-color-orange {
          background-color: #f28518;
        }
      }

      .item-input {
        width: 100%;

        .ant-input-number-handler-wrap {
          display: none;
        }

        &.ant-checkbox-group {
          .ant-checkbox-group-item {
            display: flex;

            .ant-checkbox {
              width: 16px;
              height: 16px;
              margin-top: 4px;
            }
          }
        }
      }

      .color-box {
        width: 100%;
        display: flex;
        // justify-content: space-between;

        &-red {
          width: 30px;
          height: 30px;
          margin-left: 30px;
          background-color: red;
        }
      }
    }

    &-btns {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-top: 20px;
    }
  }
}
</style>
