<template>
  <div class="operate-condition">
    <div class="business-table-item">
      <div class="sub-title">特征列表</div>
      <a-button class="business-table-btn" @click="handleChangebtn(1)">
        <!-- {{ foldValue1 ? "收起" : "展开" }} -->
        <a-icon :type="foldValue1 ? 'up' : 'down'" />
      </a-button>
      <feature-table :dataList="dataList" :foldValue="foldValue1" :type="2" />
    </div>
    <div class="business-table-item">
      <div class="sub-title">经营状况分析</div>
      <a-button class="business-table-btn" @click="handleChangebtn(2)">
        <!-- {{ foldValue2 ? "收起" : "展开" }} -->
        <a-icon :type="foldValue2 ? 'up' : 'down'" />
      </a-button>
      <div
        :class="
          foldValue2 ? 'business-table-content' : 'business-table-content fold'
        "
      >
        <data-graphs ref="dataGraphs" :list="graphList" />
      </div>
    </div>
    <div class="business-table-item">
      <DetailTable
        tableTitle="经营状况指标明细"
        :foldValue="foldValue3"
        :columns="columns"
        :infoData="infoData"
        :pagination="pagination"
        :loading="tableLoading"
        :infoQuery="infoQuery"
        @handleChangebtn="handleChangebtn(3)"
        tableClass="features-table2"
      >
        <div slot="searchOption">
          <div class="business-options">
            <!-- <div class="business-options-item">
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
            </div> -->
            <div class="business-options-item">
              <label class="item-label">指标分类：</label>
              <div class="item-content">
                <a-select
                  allow-clear
                  :options="indexTypeOptions"
                  class="item-content-input"
                  placeholder="请选择"
                  v-model="indexType"
                />
              </div>
            </div>
            <div class="business-options-item">
              <label class="item-label">绩效评价：</label>
              <div class="item-content">
                <a-select
                  allow-clear
                  :options="perforAppraisalOptions"
                  class="item-content-input"
                  placeholder="请选择"
                  v-model="perforAppraisal"
                />
              </div>
            </div>
            <div class="business-options-item">
              <label class="item-label">指标名称：</label>
              <div class="item-content">
                <a-input
                  type="text"
                  allow-clear
                  class="item-content-input"
                  v-model="searchInput"
                  placeholder="关键词"
                />
              </div>
            </div>
          </div>
          <div class="business-options">
            <div class="business-options-item title-slot">
              <span class="title-slot-title">年度指标值</span>
              <span class="title-slot-brackets">(</span>
              <span class="title-slot-img"
                ><icon-svg color="#13C213" icon-class="灯泡"
              /></span>
              <span class="title-slot-text">优秀、良好</span>
              <span class="title-slot-img"
                ><icon-svg color="rgba(0, 0, 0, 0.25)" icon-class="灯泡"
              /></span>
              <span class="title-slot-text">平均</span>
              <span class="title-slot-img"
                ><icon-svg color="#F28518" icon-class="灯泡"
              /></span>
              <span class="title-slot-text">较低</span>
              <span class="title-slot-img"
                ><icon-svg color="#FF4053" icon-class="灯泡"
              /></span>
              <span class="title-slot-text">较差</span>
              <span class="title-slot-brackets">)</span>
            </div>
            <div class="business-options-item"></div>
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
        </div>
      </DetailTable>
    </div>
  </div>
</template>
<script>
import DataGraphs from "../components/dataGraphs";
import DetailTable from "../components/detailTable";
import FeatureTable from "../components/featureTable";
import { Button, DatePicker, Icon, Input } from "ant-design-vue";
import { scrollToBottom } from "@/utils/common.js";
import {
  ecoTable,
  ecoDetailsTab,
  ecoDetailsQuery,
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
import { mapState } from "vuex";
import { handleAddEchartsBackground } from "@/utils/echarts.js";
import { find } from "lodash";

const { RangePicker } = DatePicker;

export default {
  name: "operateCondition",
  data() {
    return {
      foldValue1: true,
      foldValue2: true,
      foldValue3: true,
      columns: [
        {
          title: "序号",
          dataIndex: "index",
          key: "index",
          width: 65,
        },
        {
          title: "指标分类",
          dataIndex: "indexType",
          key: "indexType",
          width: 120,
        },
        {
          title: "指标名称",
          dataIndex: "indexName",
          key: "indexName",
          width: 120,
        },
        {
          title: "指标来源",
          dataIndex: "indexSource",
          key: "indexSource",
          width: 120,
        },
        {
          title: "2017年",
          dataIndex: "year2017",
          key: "2017",
          width: 400,
          children: [
            {
              title: "指标值",
              dataIndex: "indexValue1",
              key: "indexValue1",
              width: 100,
            },
            {
              title: "同比增长",
              dataIndex: "upRatio1",
              key: "upRatio1",
              width: 100,
            },
            {
              title: "行业平均",
              dataIndex: "industryAverage1",
              key: "industryAverage1",
              width: 100,
            },
            {
              title: "评价结果",
              dataIndex: "result1",
              key: "result1",
              width: 100,
              scopedSlots: { customRender: "result1" },
            },
          ],
        },
        {
          title: "2018年",
          dataIndex: "year2018",
          key: "year2018",
          width: 400,
          children: [
            {
              title: "指标值",
              dataIndex: "indexValue2",
              key: "indexValue2",
              width: 100,
            },
            {
              title: "同比增长",
              dataIndex: "upRatio2",
              key: "upRatio2",
              width: 100,
            },
            {
              title: "行业平均",
              dataIndex: "industryAverage2",
              key: "industryAverage2",
              width: 100,
            },
            {
              title: "评价结果",
              dataIndex: "result2",
              key: "result2",
              width: 100,
              scopedSlots: { customRender: "result2" },
            },
          ],
        },
        {
          title: "2019年",
          dataIndex: "year2019",
          key: "year2019",
          width: 400,
          children: [
            {
              title: "指标值",
              dataIndex: "indexValue3",
              key: "indexValue3",
              width: 100,
            },
            {
              title: "同比增长",
              dataIndex: "upRatio3",
              key: "upRatio3",
              width: 100,
            },
            {
              title: "行业平均",
              dataIndex: "industryAverage3",
              key: "industryAverage3",
              width: 100,
            },
            {
              title: "评价结果",
              dataIndex: "result3",
              key: "result3",
              width: 100,
              scopedSlots: { customRender: "result3" },
            },
          ],
        },
        {
          title: "2020年",
          dataIndex: "year2020",
          key: "year2020",
          width: 400,
          children: [
            {
              title: "指标值",
              dataIndex: "indexValue4",
              key: "indexValue4",
              width: 100,
            },
            {
              title: "同比增长",
              dataIndex: "upRatio4",
              key: "upRatio4",
              width: 100,
            },
            {
              title: "行业平均",
              dataIndex: "industryAverage4",
              key: "industryAverage4",
              width: 100,
            },
            {
              title: "评价结果",
              dataIndex: "result4",
              key: "result4",
              width: 100,
              scopedSlots: { customRender: "result4" },
            },
          ],
        },
        {
          title: "2021年",
          dataIndex: "year2021",
          key: "year2021",
          width: 400,
          children: [
            {
              title: "指标值",
              dataIndex: "indexValue5",
              key: "indexValue5",
              width: 100,
            },
            {
              title: "同比增长",
              dataIndex: "upRatio5",
              key: "upRatio5",
              width: 100,
            },
            {
              title: "行业平均",
              dataIndex: "industryAverage5",
              key: "industryAverage5",
              width: 100,
            },
            {
              title: "评价结果",
              dataIndex: "result5",
              key: "result5",
              width: 100,
              scopedSlots: { customRender: "result5" },
            },
          ],
        },
      ],
      infoData: [
        // {
        //   index: 1,
        //   indexSource: "企业绩效评价标准",
        //   indexType: "习近平同东帝汶总统互致贺电  再生生保系统",
        //   indexName: "腾讯控股有限公司",
        //   year2017: "85",
        //   year2018: "65",
        //   year2019: "45",
        //   year2020: "25",
        //   year2021: "5",
        // },
        // {
        //   index: 2,
        //   indexSource: "企业绩效评价标准",
        //   indexType: "习近平同东帝汶总统互致贺电  再生生保系统",
        //   indexName: "腾讯控股有限公司",
        //   year2017: "85",
        //   year2018: "65",
        //   year2019: "45",
        //   year2020: "25",
        //   year2021: "5",
        // },
        // {
        //   index: 3,
        //   indexSource: "企业绩效评价标准",
        //   indexType: "习近平同东帝汶总统互致贺电  再生生保系统",
        //   indexName: "腾讯控股有限公司",
        //   year2017: "85",
        //   year2018: "65",
        //   year2019: "45",
        //   year2020: "25",
        //   year2021: "5",
        // },
        // {
        //   index: 4,
        //   indexSource: "企业绩效评价标准",
        //   indexType: "习近平同东帝汶总统互致贺电  再生生保系统",
        //   indexName: "腾讯控股有限公司",
        //   year2017: "85",
        //   year2018: "65",
        //   year2019: "45",
        //   year2020: "25",
        //   year2021: "5",
        // },
        // {
        //   index: 5,
        //   indexSource: "企业绩效评价标准",
        //   indexType: "习近平同东帝汶总统互致贺电  再生生保系统",
        //   indexName: "腾讯控股有限公司",
        //   year2017: "85",
        //   year2018: "65",
        //   year2019: "45",
        //   year2020: "25",
        //   year2021: "5",
        // },
        // {
        //   index: 6,
        //   indexSource: "企业绩效评价标准",
        //   indexType: "习近平同东帝汶总统互致贺电  再生生保系统",
        //   indexName: "腾讯控股有限公司",
        //   year2017: "85",
        //   year2018: "65",
        //   year2019: "45",
        //   year2020: "25",
        //   year2021: "5",
        // },
      ],
      dataList: [],
      pagination: {
        size: "small",
        total: 0,
        current: 1,
        pageSize: 20,
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
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = 1;
          this.pagination.pageSize = size;
        },
      },
      tableLoading: false,
      infoQuery: undefined,
      startStopTime: [],
      isOpen: false,
      graphList: [
        {
          title: "运营效率",
          ref: "graph1",
          width: "calc((100% - 48px) / 3)",
          paddingTop: "381px",
          // dataSource: "上海市税务局",
          dataSource: "暂无数据",
          formula: "营业收入、营业利润均取自《企业所得税申报附表-利润表》",
        },
        {
          title: "营收增长",
          ref: "graph2",
          width: "calc((100% - 48px) / 3)",
          paddingTop: "381px",
          // dataSource: "上海市税务局",
          dataSource: "暂无数据",
          formula: "营业收入、营业利润均取自《企业所得税申报附表-利润表》",
        },
        {
          title: "资产增长",
          ref: "graph3",
          width: "calc((100% - 48px) / 3)",
          paddingTop: "381px",
          // dataSource: "上海市税务局",
          dataSource: "暂无数据",
          formula: "营业收入、营业利润均取自《企业所得税申报附表-利润表》",
        },
        {
          title: "资金风险",
          ref: "graph4",
          width: "calc((100% - 48px) / 3 * 2 + 24px)",
          paddingTop: "392px",
          // dataSource: "上海市税务局",
          dataSource: "暂无数据",
          formula: "营业收入、营业利润均取自《企业所得税申报附表-利润表》",
        },
        {
          title: "应收账款账龄分析（2020）",
          ref: "graph5",
          width: "calc((100% - 48px) / 3)",
          paddingTop: "392px",
          // dataSource: "上海市税务局",
          dataSource: "暂无数据",
          formula: "营业收入、营业利润均取自《企业所得税申报附表-利润表》",
        },
      ],
      myChart1: null,
      myChart2: null,
      myChart3: null,
      myChart4: null,
      myChart5: null,
      searchInput: undefined,
      indexTypeOptions: [
        {
          value: "",
          label: "全部",
        },
      ],
      indexType: "",
      perforAppraisalOptions: [
        {
          value: "",
          label: "全部",
        },
      ],
      perforAppraisal: "",
      graphData: {
        xAxis: [],
      },
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
    DataGraphs,
    DetailTable,
    FeatureTable,
  },
  computed: {
    ...mapState("auditOptions", ["paramsObj"]),
  },
  mounted() {
    this.ecoTable();
    this.ecoDetailsTab();
    this.ecoDetailsQuery("init");
    const f = () => {
      this.myChart1.resize();
      this.myChart2.resize();
      this.myChart3.resize();
      this.myChart4.resize();
      this.myChart5.resize();
    };
    window.addEventListener("resize", f);
  },
  beforeDestroy() {
    this.myChart1.clear();
    this.myChart2.clear();
    this.myChart3.clear();
    this.myChart4.clear();
    this.myChart5.clear();
    const f = () => {
      this.myChart1.resize();
      this.myChart2.resize();
      this.myChart3.resize();
      this.myChart4.resize();
      this.myChart5.resize();
    };
    window.removeEventListener("resize", f);
  },
  methods: {
    reset() {
      this.startStopTime = [];
      this.searchInput = undefined;
      this.indexType = "";
      this.perforAppraisal = "";
      this.handleSearch();
    },
    handleSearch() {
      console.log("handleSearch");
      this.ecoDetailsQuery("init");
    },
    init() {
      this.myChart1 = this.$echarts.init(this.$refs.dataGraphs.$refs.graph1[0]);
      this.myChart2 = this.$echarts.init(this.$refs.dataGraphs.$refs.graph2[0]);
      this.myChart3 = this.$echarts.init(this.$refs.dataGraphs.$refs.graph3[0]);
      this.myChart4 = this.$echarts.init(this.$refs.dataGraphs.$refs.graph4[0]);
      this.myChart5 = this.$echarts.init(this.$refs.dataGraphs.$refs.graph5[0]);
      // 右下左上
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
            let htmls = params.map((item, index) => {
              date = item.axisValueLabel;
              let value = item.data || 0;
              value = value + "%";
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
          y: 50,
          x2: 10,
          y2: 50,
          containLabel: true,
        },
        dataZoom: [
          {
            type: "inside",
          },
          {
            type: "slider",
          },
        ],
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
            // name: "件",
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
            name: "总资产周转率",
            type: "line",
            data: this.graphData.allAssetstTurnover,
            color: this.lineColor[0],
            label: {
              position: "top",
              show: true,
              formatter: "{c}%",
            },
          },
          {
            name: "应收账款周转率",
            type: "line",
            data: this.graphData.receivableTurnover,
            color: this.lineColor[1],
            label: {
              position: "top",
              show: true,
              formatter: "{c}%",
            },
          },
          // {
          //   name: "流动账款周转率",
          //   type: "line",
          //   data: this.graphData.flowTurnover,
          //   color: this.lineColor[2],
          //   label: {
          //     position: "top",
          //     show: true,
          //     formatter: "{c}%",
          //   },
          // },
        ],
      };
      this.myChart1.setOption(option1);
      handleAddEchartsBackground(this.myChart1, option1, this.graphData.xAxis);

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
            let htmls = params.map((item, index) => {
              date = item.axisValueLabel;
              let value = item.data || 0;
              value = value + "%";
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
          y: 50,
          x2: 10,
          y2: 50,
          containLabel: true,
        },
        dataZoom: [
          {
            type: "inside",
          },
          {
            type: "slider",
          },
        ],
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
            // name: "件",
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
            name: "营业收入增长率",
            type: "line",
            data: this.graphData.incomeRatio,
            color: this.lineColor[0],
            label: {
              position: "top",
              show: true,
              formatter: "{c}%",
            },
          },
          {
            name: "营业利润增长率",
            type: "line",
            data: this.graphData.profitRatio,
            color: this.lineColor[1],
            label: {
              position: "top",
              show: true,
              formatter: "{c}%",
            },
            markLine: {
              lineStyle: {
                type: "dashed",
                color: "#4D729F",
              },
              symbol: "circle",
              data: [{ yAxis: 0 }],
            },
          },
        ],
      };
      this.myChart2.setOption(option2);
      handleAddEchartsBackground(this.myChart2, option2, this.graphData.xAxis);

      const option3 = {
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
            let htmls = params.map((item, index) => {
              date = item.axisValueLabel;
              let value = item.data || 0;
              value = value + "%";
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
          y: 50,
          x2: 10,
          y2: 50,
          containLabel: true,
        },
        dataZoom: [
          {
            type: "inside",
          },
          {
            type: "slider",
          },
        ],
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
            // name: "件",
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
            name: "总资产率",
            type: "line",
            data: this.graphData.allAssetsRatio,
            color: this.lineColor[0],
            label: {
              position: "top",
              show: true,
              formatter: "{c}%",
            },
          },
          {
            name: "资本保值增值率",
            type: "line",
            data: this.graphData.assetsHedgingRatio,
            color: this.lineColor[1],
            label: {
              position: "top",
              show: true,
              formatter: "{c}%",
            },
          },
        ],
      };
      this.myChart3.setOption(option3);
      handleAddEchartsBackground(this.myChart3, option3, this.graphData.xAxis);

      const option4 = {
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
            let htmls = params.map((item, index) => {
              date = item.axisValueLabel;
              let value = item.data || 0;
              if (
                item.seriesName === "应收账款准备覆盖率" ||
                item.seriesName === "其他应收账款准备覆盖率"
              ) {
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
          y2: 50,
          containLabel: true,
        },
        dataZoom: [
          {
            type: "inside",
          },
          {
            type: "slider",
          },
        ],
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
            name: "单位：万元",
            minInterval: 1,
            splitLine: {
              lineStyle: {
                type: "dashed",
              },
            },
            splitArea: { show: false },
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
            name: "应收账款坏账准备",
            type: "bar",
            barWidth: "15%",
            stack: "money",
            data: this.graphData.badDebtReady,
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: "#18C7F2" },
                { offset: 0.6, color: "#A3E9FA" },
                { offset: 1, color: "#18C7F2" },
              ]),
            },
          },
          {
            name: "应收账款账面余额",
            type: "bar",
            stack: "money",
            barWidth: "15%",
            data: this.graphData.accountbalance,
            itemStyle: {
              color: "#CCE2FF",
            },
          },
          {
            name: "其他应收账款坏账准备",
            type: "bar",
            barWidth: "15%",
            stack: "other",
            data: this.graphData.otherBadDebtReady,
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: "#30F2CB" },
                { offset: 0.6, color: "#ACFAEA" },
                { offset: 1, color: "#30F2CB" },
              ]),
            },
          },
          {
            name: "其他应收账款账面余额",
            type: "bar",
            stack: "other",
            barWidth: "15%",
            data: this.graphData.otherAccountbalance,
            itemStyle: {
              color: "#D1FCD1",
            },
          },
          {
            name: "应收帐款准备覆盖率",
            type: "line",
            color: this.lineColor[0],
            yAxisIndex: 1,
            label: {
              position: "top",
              show: true,
              formatter: "{c}%",
            },
            data: this.graphData.badDebtReadyRatio,
          },
          {
            name: "其他应收账款准备覆盖率",
            type: "line",
            color: this.lineColor[1],
            yAxisIndex: 1,
            label: {
              position: "top",
              show: true,
              formatter: "{c}%",
            },
            data: this.graphData.otherBadDebtReadyRatio,
          },
        ],
      };
      this.myChart4.setOption(option4);
      handleAddEchartsBackground(this.myChart4, option4, this.graphData.xAxis);

      const option5 = {
        tooltip: {
          trigger: "item",
          formatter: (params) => {
            const value = params.data.num;
            return params.marker + params.data.name + "：" + value;
          },
        },
        series: [
          {
            type: "pie",
            radius: "50%",
            data: this.graphData.pieData,
            color: [
              this.lineColor[0],
              this.lineColor[1],
              this.lineColor[2],
              this.lineColor[3],
            ],
            label: {
              formatter: "{b}",
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      this.myChart5.setOption(option5);
    },
    onPanelChange(value) {
      this.startStopTime = value;
    },
    onChange(date) {
      this.startStopTime = date;
    },
    onOpenChange(status) {
      this.isOpen = status;
    },
    handleChangebtn(num) {
      switch (num) {
        case 1:
          this.foldValue1 = !this.foldValue1;
          if (this.foldValue1 && !this.foldValue2 && !this.foldValue3) {
            setTimeout(() => {
              scrollToBottom(this, "audit-mode", 30);
            }, 200);
          }
          break;
        case 2:
          this.foldValue2 = !this.foldValue2;
          if (this.foldValue2 && !this.foldValue3) {
            setTimeout(() => {
              scrollToBottom(this, "audit-mode", 30);
            }, 200);
          }
          break;
        case 3:
          this.foldValue3 = !this.foldValue3;
          if (this.foldValue3) {
            setTimeout(() => {
              scrollToBottom(this, "audit-mode", 20);
            }, 300);
          }
          break;

        default:
          break;
      }
    },
    async ecoTable() {
      const json = {
        corpName: this.paramsObj.corpName,
      };
      const res = await ecoTable(json);
      if (res.message === "成功" && res.data) {
        const graphData = {
          xAxis: [],

          allAssetstTurnover: [],
          receivableTurnover: [],

          incomeRatio: [],
          profitRatio: [],

          allAssetsRatio: [],
          assetsHedgingRatio: [],

          badDebtReady: [],
          accountbalance: [],
          otherBadDebtReady: [],
          otherAccountbalance: [],
          badDebtReadyRatio: [],
          otherBadDebtReadyRatio: [],

          pieData: [],
        };
        for (let i in res.data) {
          const value = res.data[i];
          graphData.xAxis.push(i);
          if (value.length) {
            graphData.allAssetstTurnover.push(
              value[0].zzczhzl ? Number(value[0].zzczhzl).toFixed(2) : null
            );
            graphData.receivableTurnover.push(
              value[0].yszkzzl ? Number(value[0].yszkzzl).toFixed(2) : null
            );

            graphData.incomeRatio.push(
              value[0].yysrzzl ? Number(value[0].yysrzzl).toFixed(2) : null
            );
            graphData.profitRatio.push(
              value[0].yylrzzl ? Number(value[0].yylrzzl).toFixed(2) : null
            );

            graphData.allAssetsRatio.push(
              value[0].zzczhzl ? Number(value[0].zzczhzl).toFixed(2) : null
            );
            graphData.assetsHedgingRatio.push(
              value[0].zbbzzzl ? Number(value[0].zbbzzzl).toFixed(2) : null
            );

            graphData.badDebtReady.push(
              value[0].yszkhjhzzb
                ? Number(value[0].yszkhjhzzb).toFixed(2)
                : null
            );
            graphData.accountbalance.push(
              value[0].yszkhjzmye
                ? Number(value[0].yszkhjzmye).toFixed(2)
                : null
            );
            graphData.otherBadDebtReady.push(
              value[0].qtyszkhjhzzb
                ? Number(value[0].qtyszkhjhzzb).toFixed(2)
                : null
            );
            graphData.otherAccountbalance.push(
              value[0].qtyszkhjzmye
                ? Number(value[0].qtyszkhjzmye).toFixed(2)
                : null
            );
            graphData.badDebtReadyRatio.push(
              value[0].yszkzbfgl ? Number(value[0].yszkzbfgl).toFixed(2) : null
            );
            graphData.otherBadDebtReadyRatio.push(
              value[0].qtyskzbfgl
                ? Number(value[0].qtyskzbfgl).toFixed(2)
                : null
            );
          } else {
            graphData.allAssetstTurnover.push(null);
            graphData.receivableTurnover.push(null);

            graphData.incomeRatio.push(null);
            graphData.profitRatio.push(null);

            graphData.allAssetsRatio.push(null);
            graphData.assetsHedgingRatio.push(null);

            graphData.badDebtReady.push(null);
            graphData.accountbalance.push(null);
            graphData.otherBadDebtReady.push(null);
            graphData.otherAccountbalance.push(null);
            graphData.badDebtReadyRatio.push(null);
            graphData.otherBadDebtReadyRatio.push(null);
          }
        }
        const targetYear = "2020";

        const targetValue = res.data[targetYear]; // 取2020年的数据
        if (targetValue.length) {
          graphData.pieData.push({
            value: targetValue[0].yszk1nynh1nhzzb ? 1 : null,
            num: targetValue[0].yszk1nynh1nhzzb || null,
            name: "1年内（含1年）",
          });
          graphData.pieData.push({
            value: targetValue[0].yszk12nh2nhzzb ? 1 : null,
            num: targetValue[0].yszk12nh2nhzzb || null,
            name: "1-2年",
          });
          graphData.pieData.push({
            value: targetValue[0].yszk23nh3nhzzb ? 1 : null,
            num: targetValue[0].yszk23nh3nhzzb || null,
            name: "2-3年",
          });
          graphData.pieData.push({
            value: targetValue[0].yszk3nysnmhzzb ? 1 : null,
            num: targetValue[0].yszk3nysnmhzzb || null,
            name: "3年以上",
          });
        } else {
          graphData.pieData.push({
            value: null,
            num: 0,
            name: "1年内（含1年）",
          });
          graphData.pieData.push({
            value: null,
            num: 0,
            name: "1-2年",
          });
          graphData.pieData.push({
            value: null,
            num: 0,
            name: "2-3年",
          });
          graphData.pieData.push({
            value: null,
            num: 0,
            name: "3年以上",
          });
        }

        this.graphData = graphData;
        this.init();
      } else if (res.message === "成功" && !res.data) {
        this.$message.info("暂无资产负债概览数据");
      } else {
        this.$message.error(res.message);
      }
    },
    async ecoDetailsTab() {
      const json = {
        corpName: this.paramsObj.corpName,
      };
      const res = await ecoDetailsTab(json);
      console.log("res", res);
      let perforAppraisalOptions = [];
      let indexTypeOptions = [];
      if (res.message === "成功" && res.data) {
        perforAppraisalOptions = res.data.evaResult.map((v) => ({
          label: v,
          value: v,
        }));

        indexTypeOptions = res.data.quotaType.map((v) => ({
          label: v,
          value: v,
        }));
      } else if (res.message === "成功" && !res.data) {
        this.$message.info("暂无指标分类和绩效评价筛选项数据");
      } else {
        this.$message.error(res.message);
      }
      this.perforAppraisalOptions = [
        {
          label: "全部",
          value: null,
        },
        ...perforAppraisalOptions,
      ];
      this.indexTypeOptions = [
        {
          label: "全部",
          value: null,
        },
        ...indexTypeOptions,
      ];
    },
    async ecoDetailsQuery(type) {
      if (type === "init") {
        this.$set(this.pagination, "current", 1);
      }
      const json = {
        corpName: this.paramsObj.corpName,
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
        startYear:
          (this.startStopTime.length && this.startStopTime[0].format("YYYY")) ||
          "2017",
        endYear:
          (this.startStopTime.length && this.startStopTime[1].format("YYYY")) ||
          "2021",
        quotaType: this.indexType === "" ? null : this.indexType,
        quotaName: this.searchInput,
        evaResult: this.perforAppraisal === "" ? null : this.perforAppraisal,
      };
      this.infoQuery = json;
      const res = await ecoDetailsQuery(json);
      console.log("res", res);
      // this.pagination.total = res.data.totalCount;
      const infoData = [];
      // 暂时存储序号
      let indexNum = 0;
      if (res.message === "成功" && res.data.length) {
        res.data.map((item, index) => {
          if (item.quotaType === "营运能力" || item.quotaType === "发展能力") {
            const target1 = find(item.details, (v) => v.nf === "2017");
            const target2 = find(item.details, (v) => v.nf === "2018");
            const target3 = find(item.details, (v) => v.nf === "2019");
            const target4 = find(item.details, (v) => v.nf === "2020");
            const target5 = find(item.details, (v) => v.nf === "2021");
            console.log("target", target1, target2, target3, target4, target5);
            const obj = {
              // index:
              //   this.pagination.pageSize * (this.pagination.current - 1) +
              //   index +
              //   1,
              index: indexNum + 1,
              indexSource: item.quotaResource || "--",
              indexType: item.quotaType || "--",
              indexName: item.quotaName || "--",
            };
            indexNum = indexNum + 1;
            if (target1) {
              obj.indexValue1 = target1.quotaValue || "--";
              obj.upRatio1 = target1.growthYear + "%" || "--";
              obj.industryAverage1 = target1.industryAvg || "--";
              obj.result1 = target1.evaResult || "--";
            } else {
              obj.indexValue1 = "--";
              obj.upRatio1 = "--";
              obj.industryAverage1 = "--";
              obj.result1 = "--";
              //shouhairenshiwo
            }
            if (target2) {
              obj.indexValue2 = target2.quotaValue || "--";
              obj.upRatio2 = target2.growthYear + "%" || "--";
              obj.industryAverage2 = target2.industryAvg || "--";
              obj.result2 = target2.evaResult || "--";
            } else {
              obj.indexValue2 = "--";
              obj.upRatio2 = "--";
              obj.industryAverage2 = "--";
              obj.result2 = "--";
            }
            if (target3) {
              obj.indexValue3 = target3.quotaValue || "--";
              obj.upRatio3 = target3.growthYear + "%" || "--";
              obj.industryAverage3 = target3.industryAvg || "--";
              obj.result3 = target3.evaResult || "--";
            } else {
              obj.indexValue3 = "--";
              obj.upRatio3 = "--";
              obj.industryAverage3 = "--";
              obj.result3 = "--";
            }
            if (target4) {
              obj.indexValue4 = target4.quotaValue || "--";
              obj.upRatio4 = target4.growthYear + "%" || "--";
              obj.industryAverage4 = target4.industryAvg || "--";
              obj.result4 = target4.evaResult || "--";
            } else {
              obj.indexValue4 = "--";
              obj.upRatio4 = "--";
              obj.industryAverage4 = "--";
              obj.result4 = "--";
            }
            if (target5) {
              obj.indexValue5 = target5.quotaValue || "--";
              obj.upRatio5 = target5.growthYear + "%" || "--";
              obj.industryAverage5 = target5.industryAvg || "--";
              obj.result5 = target5.evaResult || "--";
            } else {
              obj.indexValue5 = "--";
              obj.upRatio5 = "--";
              obj.industryAverage5 = "--";
              obj.result5 = "--";
            }
            infoData.push(obj);
          }
        });
      } else if (res.message === "成功" && !res.data.length) {
        this.$message.info("暂无经营指标明细信息");
      } else {
        this.$message.error(res.message);
      }
      this.infoData = infoData;
    },
  },
};
</script>
<style lang="less">
.operate-condition {
  .business-table-save {
    top: 48px;
  }
}
.business-options-item {
  .title-slot {
    display: flex;
    align-items: center;

    &-img {
      width: 14px;
      height: 22px;
    }

    &-title,
    &-text {
      white-space: nowrap;
    }

    &-text {
      &:not(:nth-child(10)) {
        margin-right: 24px;
      }
    }
  }
}
</style>
