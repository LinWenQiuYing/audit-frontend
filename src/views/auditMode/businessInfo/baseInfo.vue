<template>
  <div class="base-info">
    <div class="business-table-item">
      <div class="sub-title">特征列表</div>
      <a-button class="business-table-btn" @click="handleChangebtn(1)">
        <!-- {{ foldValue1 ? "收起" : "展开" }} -->
        <a-icon :type="foldValue1 ? 'up' : 'down'" />
      </a-button>
      <feature-table :dataList="dataList" :foldValue="foldValue1" :type="1" />
    </div>
    <div class="business-table-item">
      <div class="sub-title">企业信息</div>
      <a-button class="business-table-btn" @click="handleChangebtn(2)">
        <!-- {{ foldValue2 ? "收起" : "展开" }} -->
        <a-icon :type="foldValue2 ? 'up' : 'down'" />
      </a-button>
      <div :class="foldValue2 ? 'business-details' : 'business-details fold'">
        <div
          :class="
            item.label === '主营业务' ? 'details-item main' : 'details-item'
          "
          v-for="item in detailsData"
          :key="item.label"
        >
          <div class="details-item-label">
            <span class="label-text">{{ item.label }}</span>
            <a-tooltip placement="right" overlayClassName="item-title-tooltip">
              <template slot="title">
                <span>数据来源：{{ item.dataSource }}</span>
              </template>
              <a-icon type="info-circle" />
            </a-tooltip>
          </div>
          <span class="details-item-value">{{ item.value }}</span>
        </div>
      </div>
    </div>
    <div class="business-table-item">
      <div class="sub-title">基本情况分析</div>
      <a-button class="business-table-btn" @click="handleChangebtn(3)">
        <!-- {{ foldValue3 ? "收起" : "展开" }} -->
        <a-icon :type="foldValue3 ? 'up' : 'down'" />
      </a-button>
      <div
        :class="
          foldValue3
            ? 'business-table-item-content'
            : 'business-table-item-content fold'
        "
      >
        <data-graphs ref="dataGraphs" :list="graphList" />
      </div>
    </div>
    <div class="business-table-item">
      <DetailTable
        tableTitle="主要成员"
        :foldValue="foldValue4"
        :columns="columns"
        :infoData="infoData"
        :pagination="false"
        tableClass="features-table2 member-table"
        :loading="tableLoading"
        :infoQuery="infoQuery"
        @handleChangebtn="handleChangebtn(4)"
      >
        <div slot="searchOption">
          <div class="searchOption">
            <div class="business-options member-options">
              <div class="business-options-item"></div>
              <div class="business-options-item"></div>
              <div class="business-options-item">
                <span class="data-source"
                  >数据来源：上海市场监督管理局、上海人社局</span
                >
              </div>
            </div>
          </div>
        </div>
        <!-- <div slot="searchOption">
          <div class="business-options">
            <div class="business-options-item">
              <label class="item-label">年度选择：</label>
              <div class="item-content">
                <a-range-picker
                  :placeholder="['开始年份', '截止年份']"
                  class="item-content-input"
                  format="YYYY"
                  valueFormat="YYYY"
                  :value="startStopTime"
                  :mode="['year', 'year']"
                  @panelChange="onPanelChange"
                  @change="onChange"
                >
                  <template slot="suffixIcon">
                    <a-icon type="calendar" />
                  </template>
                </a-range-picker>
              </div>
            </div>
            <div class="business-options-item">
              <label class="item-label">姓名：</label>
              <div class="item-content">
                <a-input
                  type="text"
                  allow-clear
                  placeholder="请输入"
                  class="item-content-input"
                  v-model="inputValue"
                />
              </div>
            </div>
            <div class="business-options-item">
              <div class="item-buttons">
                <a-button class="button-left" @click="reset">重置</a-button>
                <a-button
                  type="primary"
                  class="button-right"
                  icon="search"
                  @click="handleSearch"
                  >查询</a-button
                >
              </div>
            </div>
          </div>
        </div> -->
      </DetailTable>
    </div>
  </div>
</template>
<script>
import DataGraphs from "../components/dataGraphs";
import DetailTable from "../components/detailTable";
import FeatureTable from "../components/featureTable";
import { Button, DatePicker, Icon, Input, Tooltip } from "ant-design-vue";
import { scrollToBottom } from "@/utils/common.js";
import { handleAddEchartsBackground } from "@/utils/echarts.js";
import {
  queryEntInfo,
  queryEntInfoAnalyse,
  queryMainNember,
} from "@/shared/api/auditMode.js";
import {
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
} from "@/assets/theme/model.js";
import { cloneDeep } from "lodash";
import { mapState } from "vuex";

const { RangePicker } = DatePicker;

export default {
  name: "BaseInfo",
  data() {
    return {
      foldValue1: true,
      foldValue2: true,
      foldValue3: true,
      foldValue4: true,
      columns: [
        {
          title: "序号",
          dataIndex: "index",
          key: "index",
          width: 78,
          align: "center",
        },
        {
          title: "姓名",
          dataIndex: "name",
          key: "name",
          width: 170,
          align: "center",
        },
        {
          title: "职位",
          dataIndex: "position",
          key: "position",
          width: 170,
          align: "center",
        },
        {
          title: "最新社保缴纳单位",
          dataIndex: "company",
          key: "company",
          width: 170,
          align: "center",
        },
        {
          title: "社保缴纳开始日期",
          dataIndex: "startTime",
          key: "startTime",
          width: 170,
          align: "center",
        },
        {
          title: "社保缴纳结束日期",
          dataIndex: "endTime",
          key: "endTime",
          width: 170,
          align: "center",
        },
        {
          title: "学历",
          dataIndex: "education",
          key: "education",
          width: 170,
          align: "center",
        },
      ],
      dataList: [],
      infoData: [],
      detailsData: [
        {
          key: "uniScId",
          label: "统一社会信用代码",
          value: "--",
          dataSource: "上海市场监督管理局",
        },
        {
          key: "organCode",
          label: "组织机构代码",
          value: "--",
          dataSource: "上海市场监督管理局",
        },
        {
          key: "nsrsbh",
          label: "纳税人识别号",
          value: "--",
          dataSource: "上海市场监督管理局",
        },
        {
          key: "businessStatus",
          label: "经营状态",
          value: "--",
          dataSource: "上海市场监督管理局",
        },
        {
          key: "personName",
          label: "法定代表人",
          value: "--",
          dataSource: "上海市场监督管理局",
        },
        {
          key: "etpsTypeName",
          label: "机构类型",
          value: "--",
          dataSource: "上海市场监督管理局",
        },
        {
          key: "regCapital",
          label: "注册资本",
          value: "--",
          dataSource: "上海市场监督管理局",
        },
        {
          key: "corpActconam",
          label: "实缴资本",
          value: "--",
          dataSource: "上海市场监督管理局",
        },
        {
          key: "establishDate",
          label: "成立日期",
          value: "--",
          dataSource: "上海市场监督管理局",
        },
        {
          key: "industryName",
          label: "所属行业",
          value: "--",
          dataSource: "上海市场监督管理局",
        },
        {
          key: "businessAddress",
          label: "主要经营地址",
          value: "--",
          dataSource: "上海市场监督管理局",
        },
        {
          key: "proLoc",
          label: "工商注册地址",
          value: "--",
          dataSource: "上海市场监督管理局",
        },
        {
          key: "dwcbrs",
          label: "参保人数",
          value: "--",
          dataSource: "上海人社局",
        },
        // {
        //   key: "dwcyrs",
        //   label: "从业人数",
        //   value: "--",
        //   dataSource: "上海市场监督管理局",
        // },
        {
          key: "investor",
          label: "控股股东",
          value: "--",
          dataSource: "上海市场监督管理局",
        },
        {
          key: "businessScope",
          label: "主营业务",
          value: "--",
          dataSource: "上海市场监督管理局",
        },
      ],
      myChart1: null,
      myChart2: null,
      myChart3: null,
      graphList: [
        {
          title: "参保人数",
          ref: "graph1",
          width: "calc((100% - 48px) / 3)",
          paddingTop: "331px",
          dataSource: "上海人社局",
          formula: "《单位参保年度统计表》中的“年平均参保人数”",
        },
        {
          title: "纳税总额",
          ref: "graph2",
          width: "calc((100% - 48px) / 3)",
          paddingTop: "331px",
          dataSource: "上海市税务局",
        },
        {
          title: "人均产出与成本分析",
          ref: "graph3",
          width: "calc((100% - 48px) / 3)",
          paddingTop: "331px",
          dataSource: "上海市税务局、上海人社局",
          formula:
            "人均营收=营业收入/年平均参保人数<br/>人均社保缴纳金额取自《单位参保情况年度统计表》<br/>人均利润=营业利润/年平均参保人数",
        },
      ],
      graphData: {
        xAxis: [],
      },
      pagination: {
        size: "small",
        total: 0,
        current: 1,
        pageSize: 5,
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
          this.queryMainNember();
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = 1;
          this.pagination.pageSize = size;
          this.queryMainNember();
        },
      },
      startStopTime: [],
      inputValue: undefined,
      tableLoading: false,
      infoQuery: {},
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
    };
  },
  components: {
    AButton: Button,
    AIcon: Icon,
    AInput: Input,
    ARangePicker: RangePicker,
    ATooltip: Tooltip,
    DataGraphs,
    DetailTable,
    FeatureTable,
  },
  computed: {
    ...mapState("auditOptions", ["paramsObj"]),
  },
  mounted() {
    const f = () => {
      this.myChart1.resize();
      this.myChart2.resize();
      this.myChart3.resize();
    };
    window.addEventListener("resize", f);

    console.log("bingo----baseInfo");
    this.queryEntInfo();
    this.queryEntInfoAnalyse();
    this.queryMainNember();
  },
  methods: {
    init() {
      this.myChart1 = this.$echarts.init(this.$refs.dataGraphs.$refs.graph1[0]);
      const option1 = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
          formatter: (params) => {
            let date = "";
            let htmls = params.map((item) => {
              date = item.axisValueLabel;
              let value = item.data || 0;
              if (item.seriesName === "同比增长") {
                value = value + "%";
              }
              return item.marker + item.seriesName + "：" + value;
            });
            return date + "<br>" + htmls.join("<br>");
          },
        },
        legend: {
          top: 15,
        },
        grid: {
          x: 10,
          y: 70,
          x2: 10,
          y2: 10,
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.graphData.xAxis,
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
          {
            type: "category",
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { show: false },
            splitArea: { show: false },
            splitLine: { show: false },
            axisPointer: { show: false },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "单位：人",
            minInterval: 1,
            splitLine: {
              lineStyle: {
                type: "dashed",
              },
            },
          },
          {
            type: "value",
            // name: "同比增长",
            minInterval: 1,
            axisLabel: {
              formatter: "{value}%",
            },
            splitLine: {
              lineStyle: {
                type: "dashed",
              },
            },
          },
        ],
        series: [
          {
            name: "参保人数",
            type: "bar",
            barWidth: "30%",
            seriesLayoutBy: "row",
            symbol: "none",
            smooth: true,
            data: this.graphData.insuredNumber,
            label: {
              show: true,
              position: "top",
            },
            color: this.lineColor[0],
          },
          {
            name: "同比增长",
            type: "line",
            yAxisIndex: 1,
            data: this.graphData.growth,
            color: this.lineColor[1],
            label: {
              position: "top",
              show: true,
              formatter: "{c}%",
            },
          },
        ],
      };
      this.myChart1.setOption(option1);
      handleAddEchartsBackground(this.myChart1, option1, this.graphData.xAxis);

      this.myChart2 = this.$echarts.init(this.$refs.dataGraphs.$refs.graph2[0]);
      const option2 = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
          formatter: (params) => {
            let date = "";
            let htmls = params.map((item) => {
              date = item.axisValueLabel;
              let value = item.data || 0;
              if (item.seriesName !== "") {
                return item.marker + item.seriesName + "：" + value;
              }
            });
            return date + "<br>" + htmls.join("<br>");
          },
        },
        legend: {
          top: 15,
        },
        grid: {
          x: 10,
          y: 70,
          x2: 10,
          y2: 10,
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.graphData.xAxis,
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
          {
            type: "category",
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { show: false },
            splitArea: { show: false },
            splitLine: { show: false },
            axisPointer: { show: false },
          },
        ],
        yAxis: [
          {
            type: "value",
            // name: "元",
            name: "单位：万元",
            minInterval: 1,
            splitLine: {
              lineStyle: {
                type: "dashed",
              },
            },
          },
        ],
        series: [
          {
            name: "增值税",
            type: "bar",
            stack: "tax",
            barWidth: "30%",
            emphasis: {
              focus: "series",
            },
            data: this.graphData.addedTax,
            color: this.lineColor[0],
          },
          {
            name: "个人所得税",
            type: "bar",
            stack: "tax",
            barWidth: "30%",
            emphasis: {
              focus: "series",
            },
            data: this.graphData.personIncomeTax,
            color: this.lineColor[1],
          },
          {
            name: "企业所得税",
            type: "bar",
            stack: "tax",
            barWidth: "30%",
            emphasis: {
              focus: "series",
            },
            data: this.graphData.entIncomeTax,
            color: this.lineColor[2],
          },
          {
            name: "消费税",
            type: "bar",
            stack: "tax",
            barWidth: "30%",
            emphasis: {
              focus: "series",
            },
            data: this.graphData.consumeTax,
            color: this.lineColor[3],
          },
          {
            name: "其他",
            type: "bar",
            stack: "tax",
            barWidth: "30%",
            emphasis: {
              focus: "series",
            },
            data: this.graphData.other,
            color: this.lineColor[4],
          },
          {
            name: "",
            type: "bar",
            stack: "y", //注意与前面的stack属性不同！！！！
            data: this.graphData.sumData, //为前面对应数据的总和
            label: {
              show: true,
              position: "top",
              color: "#000",
            },
            z: -1,
            barWidth: "30%",
            barGap: "-100%", //与堆叠柱条重合
          },
        ],
      };
      this.myChart2.setOption(option2);
      handleAddEchartsBackground(this.myChart2, option2, this.graphData.xAxis);

      this.myChart3 = this.$echarts.init(this.$refs.dataGraphs.$refs.graph3[0]);
      const option3 = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        legend: {
          top: 15,
        },
        grid: {
          x: 10,
          y: 70,
          x2: 20,
          y2: 10,
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.graphData.xAxis,
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
          {
            type: "category",
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { show: false },
            splitArea: { show: false },
            splitLine: { show: false },
            axisPointer: { show: false },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "单位：元",
            minInterval: 1,
            splitLine: {
              lineStyle: {
                type: "dashed",
              },
            },
          },
          // {
          //   type: "value",
          //   name: "万元",
          //   splitLine: {
          //     lineStyle: {
          //       type: "dashed",
          //     },
          //   },
          // },
        ],
        series: [
          {
            name: "人均销售额",
            type: "line",
            // areaStyle: {
            //   color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //     { offset: 0, color: "rgba(41, 141, 255, 0.3)" },
            //     { offset: 1, color: "rgba(41, 141, 255, 0.05)" },
            //   ]),
            // },
            color: this.lineColor[0],
            emphasis: {
              focus: "series",
            },
            data: this.graphData.perSale,
            label: {
              position: "top",
              show: true,
              formatter: "{c}",
            },
          },
          {
            name: "人均社保缴纳金",
            type: "line",
            // areaStyle: {
            //   color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //     { offset: 0, color: "rgba(230, 215, 37, 0.3)" },
            //     { offset: 1, color: "rgba(230, 215, 37, 0.05)" },
            //   ]),
            // },
            color: this.lineColor[1],
            emphasis: {
              focus: "series",
            },
            data: this.graphData.perSocialSecurity,
            label: {
              position: "top",
              show: true,
              formatter: "{c}",
            },
          },
          {
            name: "人均利润",
            type: "line",
            // areaStyle: {
            //   color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //     { offset: 0, color: "rgba(36, 204, 172, 0.3)" },
            //     { offset: 1, color: "rgba(36, 204, 172, 0.05)" },
            //   ]),
            // },
            color: this.lineColor[2],
            emphasis: {
              focus: "series",
            },
            data: this.graphData.perProfit,
            label: {
              position: "top",
              show: true,
              formatter: "{c}",
            },
          },
        ],
      };
      this.myChart3.setOption(option3);
      handleAddEchartsBackground(this.myChart3, option3, this.graphData.xAxis);
    },
    handleChangebtn(num) {
      switch (num) {
        case 1:
          this.foldValue1 = !this.foldValue1;
          if (
            this.foldValue1 &&
            !this.foldValue2 &&
            !this.foldValue3 &&
            !this.foldValue4
          ) {
            setTimeout(() => {
              scrollToBottom(this, "audit-mode", 30);
            }, 200);
          }
          break;
        case 2:
          this.foldValue2 = !this.foldValue2;
          if (this.foldValue2 && !this.foldValue3 && !this.foldValue4) {
            setTimeout(() => {
              scrollToBottom(this, "audit-mode", 30);
            }, 200);
          }
          break;
        case 3:
          this.foldValue3 = !this.foldValue3;
          if (this.foldValue3 && !this.foldValue4) {
            setTimeout(() => {
              scrollToBottom(this, "audit-mode", 20);
            }, 300);
          }
          break;

        default:
          this.foldValue4 = !this.foldValue4;
          if (this.foldValue4) {
            setTimeout(() => {
              scrollToBottom(this, "audit-mode", 20);
            }, 300);
          }
          break;
      }
    },
    onPanelChange(value) {
      this.startStopTime = value;
    },
    onChange(date) {
      this.startStopTime = date;
    },
    async queryEntInfo() {
      const json = {
        uniScId: this.paramsObj.uniScId,
        corpName: this.paramsObj.corpName,
      };
      const res = await queryEntInfo(json);
      // todo 缺少从业人数
      if (res.message === "成功" && res.data) {
        const detailsData = cloneDeep(this.detailsData);
        detailsData.map((item, index) => {
          if (item.key === "corpActconam" || item.key === "regCapital") {
            if (res.data[item.key] !== null) {
              item.value = res.data[item.key].toFixed(2) + "万元";
            } else {
              item.value = "--";
            }
          } else {
            item.value = res.data[item.key] || "--";
          }
          this.$set(this.detailsData, index, item);
        });
      } else {
        this.$message.error("获取企业信息失败！");
      }
    },
    async queryEntInfoAnalyse() {
      const json = {
        uniScId: this.paramsObj.uniScId,
        corpName: this.paramsObj.corpName,
      };
      const res = await queryEntInfoAnalyse(json);
      if (res.message === "成功" && res.data) {
        const graphData = {
          xAxis: [],
          insuredNumber: [],
          growth: [],
          addedTax: [],
          personIncomeTax: [],
          entIncomeTax: [],
          consumeTax: [],
          perSale: [],
          perSocialSecurity: [],
          perProfit: [],
          other: [],
          sumData: [],
        };
        for (let key in res.data) {
          graphData.xAxis.push(key);
          if (res.data[key].length === 0) {
            graphData.insuredNumber.push(null);
            graphData.growth.push(null);
            graphData.addedTax.push(null);
            graphData.personIncomeTax.push(null);
            graphData.entIncomeTax.push(null);
            graphData.consumeTax.push(null);
            graphData.perSale.push(null);
            graphData.perSocialSecurity.push(null);
            graphData.perProfit.push(null);
            graphData.other.push(null);
            graphData.sumData.push(null);
          } else {
            // graphData.xAxis.push(data[0].cbnf); // 年份取参保年份
            graphData.insuredNumber.push(res.data[key][0].ndCbrs || null);
            graphData.growth.push(res.data[key][0].ndCbrstbzzl || null);
            graphData.addedTax.push(res.data[key][0].ndZzsze || null);
            graphData.personIncomeTax.push(res.data[key][0].ndGrsdsze || null);
            graphData.entIncomeTax.push(res.data[key][0].ndQysdsze || null);
            graphData.consumeTax.push(res.data[key][0].ndXfsneze || null);
            graphData.perSale.push(res.data[key][0].ndRjxse || null);
            graphData.perSocialSecurity.push(
              res.data[key][0].ndRjsbjnje || null
            );
            graphData.perProfit.push(res.data[key][0].ndRjlr || null);
            graphData.other.push(res.data[key][0].ndQt || null);
            graphData.sumData.push(res.data[key][0].ndYjseY || null);
          }
        }

        this.graphData = graphData;
      } else if (res.data && JSON.stringify(res.data) === "{}") {
        this.$message.info("暂无基本情况信息");
      } else {
        this.$message.error("获取基本情况信息失败！");
      }
      this.init();
    },
    async queryMainNember() {
      const json = {
        corpName: this.paramsObj.corpName,
        // name: this.inputValue,
        // startYear: this.startStopTime.length
        //   ? this.startStopTime[0].format("YYYY")
        //   : undefined,
        // endYear: this.startStopTime.length
        //   ? this.startStopTime[1].format("YYYY")
        //   : undefined,
      };
      this.infoQuery = json;
      this.tableLoading = true;
      const res = await queryMainNember(json);
      this.tableLoading = false;
      const infoData = [];
      if (res.message === "成功" && res.data.length) {
        res.data.map((item, index) => {
          infoData.push({
            index: index + 1,
            name: item.xm || "--",
            position: item.zw || "--",
            education: item.xl || "--",
            startTime: item.ksjnsj || "--",
            endTime: item.jsjnsj || "--",
            company: item.zxrzqy || "--",
          });
        });
      } else if (res.message === "成功" && !res.data.length) {
        this.$message.info("暂无主要成员信息！");
      } else {
        this.$message.error(res.message);
      }
      this.infoData = infoData;
    },
    reset() {
      this.startStopTime = [];
      this.inputValue = undefined;
      this.handleSearch();
    },
    handleSearch() {
      this.queryMainNember();
    },
  },
};
</script>
<style lang="less">
.business-table {
  .detail-table {
    // .member-table {
    //   padding-top: 10px;
    // }
    .member-options {
      height: 18px;
    }
    .data-source {
      position: absolute;
      right: 0px;
      color: @secondaryTextColor;
    }
  }
  .details-item-label {
    .label-text {
      margin-right: 5px;
    }
    .anticon {
      color: @disabledColor;
      // padding-left: 8px;
      cursor: pointer;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .item-title-tooltip {
    min-width: 200px;
    .ant-tooltip-content {
      .ant-tooltip-arrow {
        &::before {
          background-color: rgba(0, 0, 0, 0.7);
        }
      }

      .ant-tooltip-inner {
        background-color: rgba(0, 0, 0, 0.7);
      }
    }
  }
}
</style>
