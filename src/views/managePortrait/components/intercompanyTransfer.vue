<!-- 异常分析：关联单位间转账 -->
<template>
  <div class="intercompany-transfer">
    <div class="manage-right">
      <div class="manage-right-header">
        关联单位间转账（当前单位：{{ curTreeItem.title }})
      </div>
      <div class="manage-right-box">
        <!-- 1.总体情况 -->
        <div class="table-top">
          <div class="sub-title">总体情况</div>
        </div>
        <a-table
          :columns="columns1"
          :data-source="tableData1"
          :pagination="pagination1"
          :scroll="{ x: 'max-content', y: 500 }"
          :loading="tableLoading1"
          :bordered="true"
        >
          <span
            slot="dwmc"
            slot-scope="text, record, index"
            :class="
              table1Index1 === index
                ? 'custom-cell-a selected'
                : 'custom-cell-a'
            "
            @click="handleClickUnitName1(text, index)"
          >
            {{ text }}
          </span>
          <span
            slot="skrmc"
            slot-scope="text, record, index"
            :class="
              table1Index2 === index
                ? 'custom-cell-a selected'
                : 'custom-cell-a'
            "
            @click="handleClickSkrName1(record.dwmc, text, index)"
          >
            {{ text }}
          </span>
          <span slot="zxje" slot-scope="text, record" style="cursor: default">
            <a-tooltip placement="right">
              <template slot="title">
                <div>收款人类别：{{ record.skrlb }}</div>
                <div>执行金额：{{ text }}元</div>
              </template>
              <a-progress
                :percent="(Number(text) / Number(maxMoney)) * 100"
                :show-info="false"
                style="width: 180px"
              />

              执行金额：{{ Number(record.zxje).toLocaleString() }}元；
            </a-tooltip>
          </span>
        </a-table>
        <!-- 2.项目情况 -->
        <div class="table-top">
          <div class="sub-title">项目情况</div>
        </div>
        <a-table
          :columns="columns2"
          :data-source="tableData2"
          :pagination="pagination2"
          :scroll="{ x: 'max-content', y: 500 }"
          :loading="tableLoading2"
          :bordered="true"
        >
          <template slot="graphTrend" slot-scope="text, record, index">
            <div
              style="width: 100%; height: 100px"
              :ref="'chart' + index"
            ></div>
          </template>
          <span
            slot="dwmc"
            slot-scope="text, record, index"
            :class="
              table2Index1 === index
                ? 'custom-cell-a selected'
                : 'custom-cell-a'
            "
            @click="handleClickUnitName2(text, index)"
          >
            {{ text }}
          </span>
          <span
            slot="skrmc"
            slot-scope="text, record, index"
            :class="
              table2Index2 === index
                ? 'custom-cell-a selected'
                : 'custom-cell-a'
            "
            @click="handleClickSkrName2(record.dwmc, text, index)"
          >
            {{ text }}
          </span>
          <span
            slot="xmmc"
            slot-scope="text, record, index"
            :class="
              table2Index3 === index
                ? 'custom-cell-a selected'
                : 'custom-cell-a'
            "
            @click="handleClickProject(record.dwmc, record.skrmc, text, index)"
          >
            {{ text }}
          </span>
          <span slot="zxzje" slot-scope="text">
            {{ Number(text).toLocaleString() }}元
          </span>
        </a-table>
        <!-- 3.支付明细 -->
        <div class="table-top">
          <div class="sub-title">支付明细</div>
        </div>
        <a-table
          :columns="columns3"
          :data-source="tableData3"
          :pagination="pagination3"
          :scroll="{ x: 'max-content', y: 500 }"
          :loading="tableLoading3"
          :bordered="true"
        >
          <span slot="zfje" slot-scope="text">
            {{ Number(text).toLocaleString() }}元
          </span>
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
        <div class="item-label">资金性质：</div>
        <a-checkbox
          :indeterminate="indeterminate"
          :checked="checkAll"
          @change="onCheckAllChange"
          >全部</a-checkbox
        >
        <a-checkbox-group
          v-model="fundType"
          :options="fundTypeOptions"
          @change="onChange"
          class="item-input"
        />
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
  lineColor1,
  lineColor10,
  lineColor11,
  lineColor2,
  lineColor3,
  lineColor4,
  lineColor5,
  lineColor6,
  lineColor7,
  lineColor8,
  lineColor9,
} from "@/assets/theme/model.js";
import { getFundsTypeOption } from "@/shared/newApi/manage/manage.js";
import {
  getTransferTableDataOne,
  getTransferTableDataThree,
  getTransferTableDataTwo,
} from "@/shared/newApi/manage/transfer.js";
import {
  Button,
  Checkbox,
  Progress,
  Select,
  Table,
  Tooltip,
} from "ant-design-vue";
import { cloneDeep, isEqual } from "lodash";
import { mapState } from "vuex";

export default {
  name: "IntercompanyTransfer",
  data() {
    return {
      //颜色
      lineColor: [
        lineColor1,
        lineColor2,
        lineColor3,
        lineColor4,
        lineColor5,
        lineColor6,
        lineColor7,
        lineColor8,
        lineColor9,
        lineColor10,
        lineColor11,
      ],

      columns1: [
        {
          title: "单位名称",
          dataIndex: "dwmc",
          key: "dwmc",
          width: 300,
          scopedSlots: { customRender: "dwmc" },
        },
        {
          title: "收款人名称",
          dataIndex: "skrmc",
          key: "skrmc",
          width: 300,
          scopedSlots: { customRender: "skrmc" },
        },
        {
          title: "执行金额",
          dataIndex: "zxje",
          key: "zxje",
          width: 392,
          scopedSlots: { customRender: "zxje" },
        },
      ],
      tableLoading1: false,
      tableData1: [
        // {
        //   dwmc: "单位1",
        //   skrmc: "xxxx单位",
        //   skrlb: "test1",
        //   zxje: 1000,
        // },
        // {
        //   dwmc: "单位2",
        //   skrmc: "xxx学校",
        //   skrlb: "test2",
        //   zxje: 100,
        // },
      ],
      pagination1: {
        size: "small",
        total: 0,
        current: 1,
        pageSize: 20,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ["20", "50", "100"],
        showTotal: (total) => {
          return `共${total}条记录`;
        },
        onChange: (page, pageSize) => {
          this.pagination1.current = page;
          this.pagination1.pageSize = pageSize;
          this.getTableData1("repeat");
        },
        onShowSizeChange: (current, size) => {
          this.pagination1.current = current;
          this.pagination1.pageSize = size;
          this.getTableData1("repeat");
        },
      },
      maxMoney: 1,

      columns2: [
        {
          title: "单位名称",
          dataIndex: "dwmc",
          key: "dwmc",
          width: 200,
          scopedSlots: { customRender: "dwmc" },
        },
        {
          title: "收款人名称",
          dataIndex: "skrmc",
          key: "skrmc",
          width: 200,
          scopedSlots: { customRender: "skrmc" },
        },
        {
          title: "项目名称",
          dataIndex: "xmmc",
          key: "xmmc",
          width: 150,
          scopedSlots: { customRender: "xmmc" },
        },
        {
          title: "项目执行总金额",
          dataIndex: "zxzje",
          key: "zxzje",
          width: 150,
          scopedSlots: { customRender: "zxzje" },
        },
        {
          title: "当年执行情况",
          dataIndex: "zxqk",
          key: "zxqk",
          width: 529,
          scopedSlots: { customRender: "graphTrend" },
        },
      ],
      tableLoading2: false,
      tableData2: [
        // {
        //   dwmc: "单位1",
        //   skrmc: "xxxx学校",
        //   xmmc: "项目一",
        //   zxzje: 1000,
        //   zxqk: {
        //     // 当年执行情况
        //     xAxis: [
        //       "1月",
        //       "2月",
        //       "3月",
        //       "4月",
        //       "5月",
        //       "6月",
        //       "7月",
        //       "8月",
        //       "9月",
        //       "10月",
        //       "11月",
        //       "12月",
        //     ],
        //     seriesData: [
        //       {
        //         name: "变化趋势",
        //         money: [8, 10, 7, 5, 9, 6, 8, 10, 7, 5, 9, 6], // 支出金额
        //       },
        //     ],
        //   },
        // },
        // {
        //   dwmc: "单位2",
        //   skrmc: "xxxx学校",
        //   xmmc: "项目二",
        //   zxzje: 2000,
        //   zxqk: {
        //     // 当年执行情况
        //     xAxis: [
        //       "1月",
        //       "2月",
        //       "3月",
        //       "4月",
        //       "5月",
        //       "6月",
        //       "7月",
        //       "8月",
        //       "9月",
        //       "10月",
        //       "11月",
        //       "12月",
        //     ],
        //     seriesData: [
        //       {
        //         name: "变化趋势",
        //         money: [8, 10, 7, 5, 9, 6, 8, 10, 7, 5, 9, 6], // 支出金额
        //         rate: [8, 10, 7, 5, 9, 6, 8, 10, 7, 5, 9, 6], // 比率
        //       },
        //     ],
        //   },
        // },
        // {
        //   dwmc: "单位3",
        //   skrmc: "xxxx学校",
        //   xmmc: "项目三",
        //   zxzje: 3000,
        //   zxqk: {
        //     // 当年执行情况
        //     xAxis: [
        //       "1月",
        //       "2月",
        //       "3月",
        //       "4月",
        //       "5月",
        //       "6月",
        //       "7月",
        //       "8月",
        //       "9月",
        //       "10月",
        //       "11月",
        //       "12月",
        //     ],
        //     seriesData: [
        //       {
        //         name: "变化趋势",
        //         money: [8, 10, 7, 5, 9, 6, 8, 10, 7, 5, 9, 6], // 支出金额
        //         rate: [8, 10, 7, 5, 9, 6, 8, 10, 7, 5, 9, 6], // 比率
        //       },
        //     ],
        //   },
        // },
      ],
      pagination2: {
        size: "small",
        total: 0,
        current: 1,
        pageSize: 20,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ["20", "50", "100"],
        showTotal: (total) => {
          return `共${total}条记录`;
        },
        onChange: (page, pageSize) => {
          this.pagination2.current = page;
          this.pagination2.pageSize = pageSize;
          this.getTableData2("repeat");
        },
        onShowSizeChange: (current, size) => {
          this.pagination2.current = current;
          this.pagination2.pageSize = size;
          this.getTableData2("repeat");
        },
      },

      columns3: [
        {
          title: "单位名称",
          dataIndex: "dwmc",
          key: "dwmc",
          width: 200,
        },
        {
          title: "收款人名称",
          dataIndex: "skrmc",
          key: "skrmc",
          width: 189,
        },
        {
          title: "支付日期",
          dataIndex: "zfrq",
          key: "zfrq",
          width: 180,
        },
        {
          title: "摘要",
          dataIndex: "desc",
          key: "desc",
          width: 180,
        },
        {
          title: "经济科目名称",
          dataIndex: "subject",
          key: "subject",
          width: 180,
        },
        {
          title: "项目名称",
          dataIndex: "xmmc",
          key: "xmmc",
          width: 150,
        },
        {
          title: "支付金额",
          dataIndex: "zfje",
          key: "zfje",
          width: 150,
          scopedSlots: { customRender: "zfje" },
        },
      ],
      tableLoading3: false,
      tableData3: [
        // {
        //   dwmc: "单位1",
        //   skrmc: "xxxx学校",
        //   xmmc: "项目一",
        //   zfje: 1000,
        //   zfrq: "2020-01-01",
        //   desc: "支出",
        //   subject: "xxxx科目",
        // },
        // {
        //   dwmc: "单位2",
        //   skrmc: "xxxx学校",
        //   xmmc: "项目一",
        //   zfje: 1000,
        //   zfrq: "2020-01-01",
        //   desc: "支出",
        //   subject: "xxxx科目",
        // },
        // {
        //   dwmc: "单位3",
        //   skrmc: "xxxx学校",
        //   xmmc: "项目一",
        //   zfje: 1000,
        //   zfrq: "2020-01-01",
        //   desc: "支出",
        //   subject: "xxxx科目",
        // },
      ],
      pagination3: {
        size: "small",
        total: 0,
        current: 1,
        pageSize: 20,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ["20", "50", "100"],
        showTotal: (total) => {
          return `共${total}条记录`;
        },
        onChange: (page, pageSize) => {
          this.pagination3.current = page;
          this.pagination3.pageSize = pageSize;
          this.getTableData3("repeat");
        },
        onShowSizeChange: (current, size) => {
          this.pagination3.current = current;
          this.pagination3.pageSize = size;
          this.getTableData3("repeat");
        },
      },

      //页面右上角弹框
      //年份选项
      yearOptions: [
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
      //资金性质
      fundType: [],
      indeterminate: false,
      checkAll: true,

      // 关联单位间转账参数配置
      configParams: {
        curYear: "2023",
        fundType: [],
      },

      table1Name1: undefined,
      table1Name2: undefined,

      table2Name1: undefined,
      table2Name2: undefined,
      table2Name3: undefined,

      table1Index1: undefined,
      table1Index2: undefined,

      table2Index1: undefined,
      table2Index2: undefined,
      table2Index3: undefined,

      fundTypeOptions: [],
    };
  },
  computed: {
    ...mapState("managePortrait", ["curTreeItem"]),
    newConfigParams() {
      return cloneDeep(this.configParams);
    },
  },
  components: {
    AButton: Button,
    ACheckbox: Checkbox,
    ACheckboxGroup: Checkbox.Group,
    ASelect: Select,
    ATable: Table,
    ATooltip: Tooltip,
    AProgress: Progress,
  },
  watch: {
    curTreeItem: {
      async handler(newVal, oldVal) {
        console.log("5656555", newVal, oldVal);
        if (newVal.key) {
          this.getAllData();
        }
      },
      deep: true,
    },
    newConfigParams: {
      async handler(newVal, oldVal) {
        if (
          newVal.curYear !== oldVal.curYear ||
          !isEqual(newVal.fundType, oldVal.fundType)
        ) {
          await this.getAllData();
        }
      },
      deep: true,
    },
  },
  async mounted() {
    await this.getFundsTypeOption(); //一上来先获取资金性质下拉框
    this.getAllData();
  },
  methods: {
    async getAllData() {
      if (!this.curTreeItem.key) return;
      await this.getTableData1("init");
      await this.getTableData3("init");
      await this.getTableData2("init");
    },

    //初始查询
    async getFundsTypeOption() {
      const json = {
        // year: this.configParams.curYear,
        year: null, //和sql沟通完之后认为这个资金类型与年份无关
      };
      const res = await getFundsTypeOption(json);
      if (res.message === "成功") {
        this.fundTypeOptions = res.data;
        this.fundType = res.data.map((item) => item.value);
        this.configParams.fundType = res.data.map((item) => item.value);
      } else {
        this.$message.error(res.message);
      }
    },
    handleClickUnitName1(text, index) {
      this.table1Index1 = index;
      this.table1Index2 = undefined;
      this.table1Name1 = text;
      this.table1Name2 = undefined;
      this.getTableData2("init");
    },
    handleClickSkrName1(dwmc, text, index) {
      this.table1Index1 = index;
      this.table1Index2 = index;
      console.log(dwmc, text);
      this.table1Name1 = dwmc;
      this.table1Name2 = text;
      this.getTableData2("init");
    },
    handleClickUnitName2(dwmc, index) {
      this.table2Index1 = index;
      this.table2Index2 = undefined;
      this.table2Index3 = undefined;
      console.log(dwmc);
      this.table2Name1 = dwmc;
      this.table2Name2 = undefined;
      this.table2Name3 = undefined;
      this.getTableData3("init");
    },
    handleClickSkrName2(dwmc, skrmc, index) {
      this.table2Index1 = index;
      this.table2Index2 = index;
      this.table2Index3 = undefined;
      this.table2Name1 = dwmc;
      this.table2Name2 = skrmc;
      this.table2Name3 = undefined;
      this.getTableData3("init");
    },
    handleClickProject(dwmc, skrmc, xmmc, index) {
      this.table2Index1 = index;
      this.table2Index2 = index;
      this.table2Index3 = index;
      this.table2Name1 = dwmc;
      this.table2Name2 = skrmc;
      this.table2Name3 = xmmc;
      this.getTableData3("init");
    },
    async getTableData1(type) {
      if (!this.curTreeItem.key) return;
      if (type === "init") {
        this.$set(this.pagination1, "current", 1);
      }
      const json = {
        year: this.configParams.curYear,
        dept_code: this.curTreeItem.key,
        fund_nature_code: this.configParams.fundType,
        pageSize: this.pagination1.pageSize, //页面大小
        pageOffset: (this.pagination1.current - 1) * this.pagination1.pageSize, //页面页码
      };
      this.tableLoading1 = true;
      const res = await getTransferTableDataOne(json);
      if (res.message === "成功") {
        this.tableData1 = res.data;
        this.tableLoading1 = false;
        if (res.data.length) {
          const arr = res.data.map((item) => item.zxje);
          this.maxMoney = Math.max(...arr);
        }
      } else {
        this.$message.error(res.msg);
      }
    },
    // 项目情况
    async getTableData2(type) {
      if (!this.curTreeItem.key || !this.table1Name1) return;
      if (type === "init") {
        this.$set(this.pagination2, "current", 1);
      }
      const json = {
        year: this.configParams.curYear,
        dept_code: this.curTreeItem.key,
        pageSize: this.pagination2.pageSize, //页面大小
        pageOffset: (this.pagination2.current - 1) * this.pagination2.pageSize, //页面页码
        fund_nature_code: this.configParams.fundType,
        unit_name: this.table1Name1,
        payee_name: this.table1Name2,
      };
      this.tableLoading2 = true;
      const res = await getTransferTableDataTwo(json);
      if (res.message === "成功") {
        this.tableData2 = res.data;
        this.tableLoading2 = false;
        this.getTrendEcharts();
      } else {
        this.$message.error(res.msg);
      }
    },
    // 支付明细
    async getTableData3(type) {
      if (!this.curTreeItem.key || !this.table2Name1) return;
      if (type === "init") {
        this.$set(this.pagination3, "current", 1);
      }
      const json = {
        year: this.configParams.curYear,
        dept_code: this.curTreeItem.key,
        fund_nature_code: this.configParams.fundType,
        pageSize: this.pagination3.pageSize, //页面大小
        pageOffset: (this.pagination3.current - 1) * this.pagination3.pageSize, //页面页码
        unit_name: this.table2Name1,
        payee_name: this.table2Name2,
        pro_name: this.table2Name3,
      };
      this.tableLoading3 = true;
      const res = await getTransferTableDataThree(json);
      if (res.message === "成功") {
        this.tableData3 = res.data;
        this.tableLoading3 = false;
      } else {
        this.$message.error(res.msg);
      }
    },
    handleParamsReset() {
      //年份
      this.curYear = "2023";
      //资金性质
      this.fundType = this.fundTypeOptions.map((item) => item.value);

      this.checkAll = true;
      this.indeterminate = false;

      this.configParams.curYear = "2023";
      this.configParams.fundType = this.fundTypeOptions.map(
        (item) => item.value
      );
    },
    handleParamsConfig() {
      this.configParams.curYear = this.curYear;
      this.configParams.fundType = this.fundType;
    },
    // 表格中绘制折线图
    getTrendEcharts() {
      setTimeout(() => {
        console.log("表格中绘制折线图", this.tableData2);
        this.tableData2.forEach((item, index) => {
          console.log("🚀 ~ this.tableData2.forEach ~ item:", item);
          let oldChart = this.$echarts.getInstanceByDom(
            this.$refs["chart" + index]
          );
          if (oldChart) {
            oldChart.dispose();
          }
          let myChart = this.$echarts.init(this.$refs["chart" + index]);
          console.log("🚀 ~ this.tableData2.forEach ~ myChart:", myChart);
          const option = {
            grid: {
              top: 20,
              left: 0,
              bottom: 30,
              right: 0,
            },
            tooltip: {
              trigger: "axis",
              triggerOn: "mousemove", // 设置触发方式为悬停
              formatter: function (params) {
                return `<div class="ratio-tooltip-box" style="pointer-events:auto">
                          <div>月份：${params[0].name}</div>
                          <div>金额：${params[0].data}元</div>
                        </div>`;
              },
              confine: true,
              // position: function (point, params) {
              //   return params[0].dataIndex == 4
              //     ? [point[0] - 110, point[1] + 5]
              //     : [point[0] + 5, point[1] + 5];
              // },
            },
            xAxis: [
              {
                type: "category",
                data: item.zxqk.xAxis,
                axisPointer: {
                  type: "shadow",
                },
              },
            ],
            yAxis: {
              type: "value",
              show: false, // 不显示y轴线
              minInterval: 1,
              axisLabel: {
                formatter: "{value}",
              },
              splitLine: {
                lineStyle: {
                  type: "dashed",
                },
              },
            },
            series: [],
          };
          for (let i = 0; i < item.zxqk.seriesData.length; i++) {
            option.series.push({
              type: "line",
              // stack: "Total",
              name: item.zxqk.seriesData[i].name,
              data: item.zxqk.seriesData[i].money,
              color: this.lineColor[i],
              label: {
                show: true,
                formatter: (params) => Number(params.value).toLocaleString(),
              },
            });
          }
          myChart.setOption(option);
          window.addEventListener("resize", () => {
            myChart.resize();
          });
        });
      }, 1000);
    },

    onChange(checkedList) {
      this.indeterminate =
        !!checkedList.length &&
        checkedList.length < this.fundTypeOptions.length;
      this.checkAll = checkedList.length === this.fundTypeOptions.length;
    },
    onCheckAllChange(e) {
      Object.assign(this, {
        fundType: e.target.checked
          ? this.fundTypeOptions.map((item) => item.value)
          : [],
        indeterminate: false,
        checkAll: e.target.checked,
      });
    },
  },
};
</script>
<style lang="less">
.intercompany-transfer {
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

      .top-action {
        display: flex;

        &-btn {
          width: 84px;
          height: 32px;
          margin-left: 10px;
          border-radius: 6px;
          padding: 6px 16px;
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #3c485c;

          &-icon {
            width: 16px;
            height: 16px;
            display: flex;
            margin-right: 8px;
          }
        }
      }
    }

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
