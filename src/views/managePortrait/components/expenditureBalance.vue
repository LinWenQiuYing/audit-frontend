<!-- 异常分析：支出均衡性 -->
<template>
  <div class="expend-balance">
    <div class="manage-right">
      <div class="manage-right-header">
        支出均衡性（当前单位：{{ curTreeItem.title }})
      </div>
      <div class="manage-right-box">
        <!-- 1.支出均衡性 -->
        <div class="sub-title">支出均衡性</div>
        <div class="graph-container">
          <div class="graph-container-wrapper">
            <!-- 框内顶部标题和按钮 -->
            <div class="wrapper-top">
              <!-- 标题 -->
              <div class="wrapper-top-title">按项目类别</div>
            </div>
            <!-- 分割线 -->
            <div class="wrapper-split"></div>
            <!-- 图片内容 -->
            <div class="wrapper-content">
              <div class="wrapper-content-graph" ref="graph1"></div>
            </div>
          </div>
        </div>
        <!-- 2.预算单位 -->
        <div class="sub-title">预算单位</div>
        <a-table
          :columns="columns"
          :data-source="tableData"
          :pagination="false"
          :scroll="{ x: 'max-content', y: 500 }"
          :loading="tableLoading"
          :bordered="true"
          class="inner-table"
        >
          <template slot="graphTrend" slot-scope="text, record, index">
            <div
              style="width: 100%; height: 150px"
              :ref="'chart' + index"
            ></div>
          </template>
          <span
            slot="dwmc"
            slot-scope="text, record"
            :class="
              tableCode === record.code
                ? 'custom-cell-a selected'
                : 'custom-cell-a'
            "
            @click="handleClickUnit(record.code)"
          >
            {{ text }}
          </span>
        </a-table>
        <!-- 3.项目 -->
        <div class="sub-title">项目</div>
        <div class="graph-container">
          <div class="graph-container-wrapper">
            <!-- 框内顶部标题和按钮 -->
            <div class="wrapper-top">
              <!-- 标题 -->
              <div class="wrapper-top-title">支出均衡性</div>
            </div>
            <!-- 分割线 -->
            <div class="wrapper-split"></div>
            <!-- 图片内容 -->
            <div class="wrapper-content">
              <div class="wrapper-content-graph" ref="graph2"></div>
            </div>
          </div>
        </div>
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
      <div class="params-config-item">
        <div class="item-label">均衡性比例</div>
        <a-input-number
          class="item-input"
          placeholder="请输入"
          :min="0"
          :max="1"
          :step="0.1"
          v-model="ratioNumber"
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
import {
  getManageBalanceGraphDataOne,
  getManageBalanceGraphDataTwo,
  getManageBalanceTable,
} from "@/shared/newApi/manage/balance.js";
import { getFundsTypeOption } from "@/shared/newApi/manage/manage.js";
import { Button, Checkbox, InputNumber, Select } from "ant-design-vue";
import { mapState } from "vuex";
import { isNumber } from "@/utils/common.js";
import { cloneDeep, isEqual } from "lodash";

export default {
  name: "ExpenditureBalance",
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
      //资金性质
      fundType: [],
      fundTypeOptions: [],
      indeterminate: false,
      checkAll: true,
      //均衡性比例
      ratioNumber: 0.25,

      // 支出均衡性参数配置
      configParams: {
        curYear: "2023",
        fundType: [],
        ratioNumber: 0.25,
      },

      tableCode: undefined,
      columns: [
        {
          title: "单位名称",
          dataIndex: "dwmc",
          key: "ysdw",
          width: 300,
          scopedSlots: { customRender: "dwmc" },
        },
        {
          title: "当年支出情况",
          dataIndex: "zcqk",
          key: "zcqk",
          scopedSlots: { customRender: "graphTrend" },
        },
      ],
      tableLoading: false,
      tableData: [
        // {
        //   dwmc: "单位1",
        //   zcqk: {
        //     // 当年支出情况
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
      // pagination: {
      //   size: "small",
      //   total: 0,
      //   current: 1,
      //   pageSize: 15,
      //   showSizeChanger: true,
      //   showQuickJumper: true,
      //   pageSizeOptions: ["5", "10", "15", "20"],
      //   showTotal: (total) => {
      //     return `共${total}条记录`;
      //   },
      //   onChange: (page, pageSize) => {
      //     this.pagination.current = page;
      //     this.pagination.pageSize = pageSize;

      //   },
      //   onShowSizeChange: (current, size) => {
      //     this.pagination.current = 1;
      //     this.pagination.pageSize = size;

      //   },
      // },

      myChart1: null, //支出均衡性
      myChart2: null, //项目

      graphData1: {
        // legend: ["公用支出", "人员支出", "项目支出"],
        // xAxis: [
        //   "1月",
        //   "2月",
        //   "3月",
        //   "4月",
        //   "5月",
        //   "6月",
        //   "7月",
        //   "8月",
        //   "9月",
        //   "10月",
        //   "11月",
        //   "12月",
        // ],
        // seriesData: [
        //   {
        //     name: "公用支出",
        //     data: {
        //       money: [9, 8, 5, 10, 11, 7, 9, 6, 10, 10, 6, 9],
        //       rate: [9, 8, 5, 10, 11, 7, 9, 6, 10, 10, 6, 9],
        //     },
        //   },
        //   {
        //     name: "人员支出",
        //     data: {
        //       money: [10, 9, 8, 7, 8, 10, 9, 5, 8, 7, 9, 10],
        //       rate: [10, 9, 8, 7, 8, 10, 9, 5, 8, 7, 9, 10],
        //     },
        //   },
        //   {
        //     name: "项目支出",
        //     data: {
        //       money: [11, 6, 9, 8, 10, 7, 7, 12, 8, 9, 7, 69],
        //       rate: [11, 6, 9, 8, 10, 7, 7, 12, 8, 9, 7, 6],
        //     },
        //   },
        // ],
      },

      graphData2: {
        // legend: ["项目一", "项目二", "项目三"],
        // xAxis: [
        //   "1月",
        //   "2月",
        //   "3月",
        //   "4月",
        //   "5月",
        //   "6月",
        //   "7月",
        //   "8月",
        //   "9月",
        //   "10月",
        //   "11月",
        //   "12月",
        // ],
        // seriesData: [
        //   {
        //     name: "项目一",
        //     data: {
        //       projectCode: "test1",
        //       unitName: "单位xxx",
        //       money: [9, 8, 5, 10, 11, 7, 9, 6, 10, 10, 6, 9],
        //       rate: [9, 8, 5, 10, 11, 7, 9, 6, 10, 10, 6, 9],
        //     },
        //   },
        //   {
        //     name: "项目二",
        //     data: {
        //       projectCode: "test2",
        //       unitName: "单位xxx",
        //       money: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        //       rate: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        //     },
        //   },
        //   {
        //     name: "项目三",
        //     data: {
        //       projectCode: "test3",
        //       unitName: "单位xxx",
        //       money: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24],
        //       rate: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24],
        //     },
        //   },
        // ],
      },
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
    AInputNumber: InputNumber,
    ASelect: Select,
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
        if (newVal.ratioNumber !== oldVal.ratioNumber) {
          this.handleRatioChange();
        }
      },
      deep: true, // 深度监听对象内部属性的变化
    },
  },
  async mounted() {
    await this.getFundsTypeOption();
    this.getAllData();
  },
  methods: {
    async getAllData() {
      if (!this.curTreeItem.key) return;
      await this.getManageBalanceGraphData1();
      await this.getManageBudgetTable();
      await this.getManageBalanceGraphData2();
      this.getTrendEcharts();

      // this.initEcharts1();
      // this.initEcharts2();
      // this.getTrendEcharts();
    },

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

    handleParamsReset() {
      //年份
      this.curYear = "2023";
      //资金性质
      this.fundType = this.fundTypeOptions.map((item) => item.value);
      this.ratioNumber = 0.25;

      this.checkAll = true;
      this.indeterminate = false;

      this.configParams.curYear = "2023";
      this.configParams.fundType = this.fundTypeOptions.map(
        (item) => item.value
      );
      this.configParams.ratioNumber = "0.25";
    },

    async handleParamsConfig() {
      this.configParams.curYear = this.curYear;
      this.configParams.fundType = this.fundType;
      this.configParams.ratioNumber = this.ratioNumber;
    },

    //均衡性比例修改
    handleRatioChange() {
      this.graphData1.seriesData.map((item1, index1) => {
        item1.rate.map((item2, index2) => {
          if (
            isNumber(this.configParams.ratioNumber) &&
            item2 >=
              parseFloat((this.configParams.ratioNumber * 100).toFixed(0))
          ) {
            this.myChart1.dispatchAction({
              type: "highlight",
              seriesIndex: index1,
              dataIndex: index2,
            });
          } else {
            this.myChart1.dispatchAction({
              type: "downplay",
              seriesIndex: index1,
              dataIndex: index2,
            });
          }
        });
      });
    },

    handleClickUnit(code) {
      console.log("handleClickUnit", code);
      this.tableCode = code;
      this.getManageBalanceGraphData2();
    },

    // 图1支出均衡性折线图表展示
    initEcharts1() {
      if (this.myChart1) {
        this.myChart1.dispose();
      }
      this.myChart1 = this.$echarts.init(this.$refs.graph1);

      const _that = this;
      //支出均衡性
      const option1 = {
        tooltip: {
          //trigger: "axis",
          enterable: true,
          trigger: "item",
          triggerOn: "mousemove",
          // triggerOn: "click", // 设置触发方式为点击
          position: function (point) {
            return [point[0] + 5, point[1] + 5];
          },
          //jump
          //月度支出金额带蓝色超链接，用户点击后穿透至支出明细页面
          formatter: function (params) {
            if (params.seriesName.length === 0) {
              return ""; // 没有数据时，不显示 tooltip
            }
            return `<div class="ratio-tooltip-box" style="pointer-events:auto">
              <div>项目类别：${params.seriesName}</div>
              <div>月执行金额：${Number(
                _that.graphData1.seriesData[params.seriesIndex].money[
                  params.dataIndex
                ]
              ).toLocaleString()}元</div>
              <div>月支出占比：${params.data}%</div>
            </div>`;
          },
        },
        legend: {
          // type: "scroll",
          data: this.graphData1.legend,
          // data: [],
        },
        grid: {
          x: 15,
          y: 80,
          x2: 15,
          y2: 10,
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.graphData1.xAxis,
            axisPointer: {
              type: "shadow",
            },
            axisLine: {
              //坐标轴轴线相关设置。数学上的x轴
              show: false,
            },
            axisTick: {
              // 不展示刻度
              show: false,
            },
          },
        ],
        yAxis: {
          type: "value",
          name: "比率",
          minInterval: 1,
          axisLabel: {
            formatter: "{value}%",
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
          min: "dataMin",
          max: "dataMax",
        },
        series: [],
      };

      // 月度
      for (let i = 0; i < this.graphData1.seriesData.length; i++) {
        option1.series.push({
          type: "line",
          // stack: "total",
          name: this.graphData1.seriesData[i].name,
          data: this.graphData1.seriesData[i].rate,
          lineStyle: {
            width: 1.5, // 设置线条的粗细，表示1.5个像素
            opacity: 1,
          },
          color: this.lineColor[i],
          label: {
            show: true,
            position: "top",
            formatter: function (params) {
              // const money = Number(
              //   _that.graphData1.seriesData[params.seriesIndex].money[
              //     params.dataIndex
              //   ]
              // ).toLocaleString();
              const ratio = params.value;
              return (
                // "占比：" +
                ratio + "%"
                //  + "\n" +
                // "支出金额：" +
                // money + "元"
              );
            },
          },
          emphasis: {
            disabled: true,
            itemStyle: {
              color: "red",
              borderColor: "yellow",
              borderWidth: 2,
              borderType: "solid",
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
            scale: 1.5,
          },
          symbolSize: 10,
        });
      }
      this.myChart1.setOption(option1, true);
      this.handleRatioChange();

      // 监听图表区域的点击事件——高亮选中的折线
      _that.myChart1.getZr().on("click", function (params) {
        console.log("🚀 ~ params:", params);
        let seriesindex = null;
        if (
          params.target && // ECPolyline对象
          params.target.parent && // Group对象
          params.target.parent.parent &&
          params.target.parent.parent.__ecComponentInfo &&
          params.target.parent.parent.__ecComponentInfo.mainType === "series"
        ) {
          // 点击了line
          seriesindex = params.target.parent.parent.__ecComponentInfo.index;
        }
        if (
          params.target && // sub对象
          params.target.parent && // Symbol对象
          params.target.parent.parent && // Group对象
          params.target.parent.parent.parent &&
          params.target.parent.parent.parent.__ecComponentInfo &&
          params.target.parent.parent.parent.__ecComponentInfo.mainType ===
            "series"
        ) {
          // 点击了节点
          seriesindex =
            params.target.parent.parent.parent.__ecComponentInfo.index;
        }
        if (
          params.target && // TSpan对象
          params.target.parent && // ZRText对象
          params.target.parent.__hostTarget && // Sub对象
          params.target.parent.__hostTarget.parent &&
          params.target.parent.__hostTarget.parent.parent &&
          params.target.parent.__hostTarget.parent.parent.parent &&
          params.target.parent.__hostTarget.parent.parent.parent
            .__ecComponentInfo &&
          params.target.parent.__hostTarget.parent.parent.parent
            .__ecComponentInfo.mainType === "series"
        ) {
          // 点击了节点的text
          seriesindex =
            params.target.parent.__hostTarget.parent.parent.parent
              .__ecComponentInfo.index;
        }
        console.log("params.target", params.target);
        const updatedSeries = option1.series.map(function (series, index) {
          if (index === seriesindex) {
            return {
              ...series,
              lineStyle: {
                normal: {
                  width: 5,
                  opacity: 1,
                },
              },
            };
          } else {
            return {
              ...series,
              lineStyle: {
                width: 1.5,
                opacity: 0.2,
              },
            };
          }
        });

        _that.myChart1.setOption({
          series: updatedSeries,
        });
      });
    },

    // 图2支出均衡性折线图表展示
    initEcharts2() {
      if (this.myChart2) {
        this.myChart2.dispose();
      }
      this.myChart2 = this.$echarts.init(this.$refs.graph2);

      const _that = this;
      //支出均衡性
      const option2 = {
        tooltip: {
          enterable: true,
          trigger: "item",
          triggerOn: "mousemove",
          position: function (point) {
            return [point[0] + 5, point[1] + 5];
          },
          //jump
          //月度支出金额带蓝色超链接，用户点击后穿透至支出明细页面
          formatter: function (params) {
            if (params.seriesName.length === 0) {
              return ""; // 没有数据时，不显示 tooltip
            }
            return `<div class="ratio-tooltip-box" style="pointer-events:auto">
              <div>项目编号：${
                _that.graphData2.seriesData[params.seriesIndex].data.projectCode
              }</div>
              <div>项目名称：${params.seriesName}</div>
              <div>预算单位：${
                _that.graphData2.seriesData[params.seriesIndex].data.unitName
              }</div>
              <div>支出月份：${params.name}</div>
              <a>支出金额：${Number(
                _that.graphData2.seriesData[params.seriesIndex].data.money[
                  params.dataIndex
                ]
              ).toLocaleString()}元</a>
              <div>支出占比：${params.data}%</div>
            </div>`;
          },
        },
        legend: {
          type: "scroll",
          data: this.graphData2.legend,
        },
        grid: {
          x: 15,
          y: 50,
          x2: 15,
          y2: 10,
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.graphData2.xAxis,
            axisPointer: {
              type: "shadow",
            },
            axisLine: {
              //坐标轴轴线相关设置。数学上的x轴
              show: false,
            },
            axisTick: {
              // 不展示刻度
              show: false,
            },
          },
        ],
        yAxis: {
          type: "value",
          name: "比率",
          minInterval: 1,
          axisLabel: {
            formatter: "{value}%",
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
          min: "dataMin",
          max: "dataMax",
        },
        series: [],
      };

      // 月度
      for (let i = 0; i < this.graphData2.seriesData.length; i++) {
        option2.series.push({
          type: "line",
          // stack: "total",
          name: this.graphData2.seriesData[i].name,
          data: this.graphData2.seriesData[i].data.rate,
          lineStyle: {
            width: 1.5, // 设置线条的粗细，表示1.5个像素
            opacity: 1,
          },
          color: this.lineColor[i],
          label: {
            show: true,
            position: "top",
            formatter: function (params) {
              const ratio = params.value;
              return ratio + "%";
            },
          },
          emphasis: {
            disabled: true,
            itemStyle: {
              color: "red",
              borderColor: "yellow",
              borderWidth: 2,
              borderType: "solid",
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
            scale: 1.5,
          },
          symbolSize: 10,
        });
      }
      this.myChart2.setOption(option2, true);

      // 监听图表区域的点击事件——高亮选中的折线
      _that.myChart2.getZr().on("click", function (params) {
        console.log("🚀 ~ params:", params);
        let seriesindex = null;
        if (
          params.target && // ECPolyline对象
          params.target.parent && // Group对象
          params.target.parent.parent &&
          params.target.parent.parent.__ecComponentInfo &&
          params.target.parent.parent.__ecComponentInfo.mainType === "series"
        ) {
          // 点击了line
          seriesindex = params.target.parent.parent.__ecComponentInfo.index;
        }
        if (
          params.target && // sub对象
          params.target.parent && // Symbol对象
          params.target.parent.parent && // Group对象
          params.target.parent.parent.parent &&
          params.target.parent.parent.parent.__ecComponentInfo &&
          params.target.parent.parent.parent.__ecComponentInfo.mainType ===
            "series"
        ) {
          // 点击了节点
          seriesindex =
            params.target.parent.parent.parent.__ecComponentInfo.index;
        }
        if (
          params.target && // TSpan对象
          params.target.parent && // ZRText对象
          params.target.parent.__hostTarget && // Sub对象
          params.target.parent.__hostTarget.parent &&
          params.target.parent.__hostTarget.parent.parent &&
          params.target.parent.__hostTarget.parent.parent.parent &&
          params.target.parent.__hostTarget.parent.parent.parent
            .__ecComponentInfo &&
          params.target.parent.__hostTarget.parent.parent.parent
            .__ecComponentInfo.mainType === "series"
        ) {
          // 点击了节点的text
          seriesindex =
            params.target.parent.__hostTarget.parent.parent.parent
              .__ecComponentInfo.index;
        }
        console.log("params.target", params.target);
        const updatedSeries = option2.series.map(function (series, index) {
          if (index === seriesindex) {
            return {
              ...series,
              lineStyle: {
                normal: {
                  width: 5,
                  opacity: 1,
                },
              },
            };
          } else {
            return {
              ...series,
              lineStyle: {
                width: 1.5,
                opacity: 0.2,
              },
            };
          }
        });

        _that.myChart2.setOption({
          series: updatedSeries,
        });
      });
    },

    //获取echarts图：支出均衡性数据   折线
    async getManageBalanceGraphData1() {
      const json = {
        year: this.configParams.curYear,
        dept_code: this.curTreeItem.key,
        fund_nature_code: this.configParams.fundType,
      };
      const res = await getManageBalanceGraphDataOne(json);
      console.log("页面内 获取echarts图：支出均衡性数据   折线res", res);
      if (res.message === "成功") {
        console.log(
          "message成功 获取echarts图：支出均衡性数据   折线",
          res.data
        );
        this.graphData1 = res.data;
        this.initEcharts1();
      } else {
        this.$message.error(res.message);
      }
    },

    //获取echarts图：项目支出均衡性数据   折线
    async getManageBalanceGraphData2() {
      if (!this.tableCode) return;
      const json = {
        year: this.configParams.curYear,
        dept_code: this.curTreeItem.key,
        unit_code: this.tableCode,
        fund_nature_code: this.configParams.fundType,
      };
      const res = await getManageBalanceGraphDataTwo(json);
      console.log("页面内 获取echarts图：项目支出均衡性数据   折线res", res);
      if (res.message === "成功") {
        console.log(
          "message成功 获取echarts图：项目支出均衡性数据   折线",
          res.data
        );
        this.graphData2 = res.data;
        this.initEcharts2();
      } else {
        this.$message.error(res.message);
      }
    },

    //获取预算单位明细表
    async getManageBudgetTable() {
      const json = {
        year: this.configParams.curYear,
        dept_code: this.curTreeItem.key,
        fund_nature_code: this.configParams.fundType,
      };
      this.tableLoading = true;
      const res = await getManageBalanceTable(json);
      console.log("页面内 获取预算单位明细表res", res);
      if (res.message === "成功") {
        console.log("message成功 获取预算单位明细表", res.data);
        this.tableData = res.data;
        this.tableLoading = false;
      } else {
        this.$message.error(res.message);
      }
    },

    // 表格中绘制折线图
    getTrendEcharts() {
      setTimeout(() => {
        this.tableData.forEach((item, index) => {
          let oldChart = this.$echarts.getInstanceByDom(
            this.$refs["chart" + index]
          );
          if (oldChart) {
            oldChart.dispose();
          }
          let myChart = this.$echarts.init(this.$refs["chart" + index]);
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
                          <div>金额：${Number(
                            item.zcqk.seriesData[params[0].seriesIndex].money[
                              params[0].dataIndex
                            ]
                          ).toLocaleString()}万元</div>
                          <div>占比：${params[0].data}%</div>
                        </div>`;
              },
              confine: true,
            },
            xAxis: [
              {
                type: "category",
                data: item.zcqk.xAxis,
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
          for (let i = 0; i < item.zcqk.seriesData.length; i++) {
            option.series.push({
              type: "line",
              // stack: "Total",
              name: item.zcqk.seriesData[i].name,
              data: item.zcqk.seriesData[i].rate,
              color: this.lineColor[i],
              label: {
                show: true,
                formatter: function (params) {
                  const value = params.value;
                  return value + "%";
                },
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
.expend-balance {
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

    .graph-container {
      width: 100%;
      margin-top: 20px;

      &-wrapper {
        margin-top: 20px;
        width: 100%;
        height: 540px;
        border-radius: 6px;
        border: 1px solid #d6dbe3;
        background: #fff;
        padding: 12px 20px 20px 20px;

        &.two-child {
          display: flex;
          justify-content: space-between;
          border: 0;
          padding: 0;
          border-radius: 0;
        }

        &-item {
          //一左一右两个图
          height: 100%;
          width: calc(50% - 10px);
          border: 1px solid #d6dbe3;
          border-radius: 6px;
          padding: 12px 20px 20px 20px;
          background: #fff;
        }

        .wrapper-top {
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;

          &-title {
            color: #1c222b;
            font-weight: 600;
            display: flex;
            align-items: center;
          }

          &-action {
            display: flex;
            align-items: center;
            width: 200px;
            justify-content: space-between;

            .action-choose,
            .action-reset {
              color: #1776ff;
              cursor: pointer;
            }
          }
        }

        .wrapper-split {
          width: 100%;
          height: 1px;
          background: #016eff;
          margin-bottom: 20px;
        }

        // 图的部分
        .wrapper-content {
          width: 100%;
          height: calc(100% - 43px);
          display: flex;
          justify-content: center;

          &-graph {
            width: 100%;
            height: 100%;

            .progress {
              display: flex;
              align-items: center;
              margin-bottom: 34px;

              &:first-child {
                margin-top: 14px;
              }

              &-label {
                margin-right: 12px;
                width: 120px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                text-align: right;
              }

              .ant-progress {
                width: calc(100% - 272px);
                flex: 1;
              }

              &-text {
                width: 128px;
                margin-left: 12px;

                &.short {
                  width: 54px;
                }
              }
            }
          }

          // 左侧饼图
          &-left {
            width: calc(50% - 10px);
            height: 100%;
            margin-right: 20px;
            display: flex;
            justify-content: center;

            &-graph {
              width: 100%;
              height: 100%;
            }
          }

          // 右侧堆叠图
          &-right {
            width: calc(50% - 10px);
            height: 100%;
            display: flex;
            justify-content: center;

            &-graph {
              width: 100%;
              height: 100%;
            }
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
