<template>
  <div class="technological-Innovation">
    <div class="business-table-item">
      <div class="sub-title">特征列表</div>
      <a-button class="business-table-btn" @click="handleChangebtn(1)">
        <!-- {{ foldValue1 ? "收起" : "展开" }} -->
        <a-icon :type="foldValue1 ? 'up' : 'down'" />
      </a-button>
      <feature-table :dataList="dataList" :foldValue="foldValue1" :type="5" />
    </div>
    <div class="business-table-item">
      <div class="sub-title">科技创新情况分析</div>
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
      <div class="sub-title">科技创新明细</div>
      <a-button class="business-table-btn" @click="handleChangebtn(3)">
        <!-- {{ foldValue3 ? "收起" : "展开" }} -->
        <a-icon :type="foldValue3 ? 'up' : 'down'" />
      </a-button>
      <div
        :class="
          foldValue3 ? 'business-table-content' : 'business-table-content fold'
        "
      >
        <!-- <DetailTable
          :foldValue="foldValue3"
          :columns="columns1"
          :infoData="infoData1"
          :pagination="pagination1"
          tableClass="features-table2"
          :loading="tableLoading"
          :infoQuery="infoQuery"
          @handleChangebtn="handleChangebtn(3)"
        >
          <div slot="searchOption" v-show="activeKey === 1">
            <div class="business-options">
              <div class="business-options-item">
                <label class="item-label">专利类型：</label>
                <div class="item-content">
                  <a-select
                    allow-clear
                    :options="patentOptions"
                    class="item-content-input"
                    placeholder="请选择"
                    v-model="patentValue"
                  />
                </div>
              </div>
              <div class="business-options-item">
                <label class="item-label">公开年份：</label>
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
        </DetailTable> -->
        <a-tabs :active-key="activeKey" @change="onKeychange">
          <a-tab-pane :key="1" tab="专利明细">
            <DetailTable
              :foldValue="foldValue3"
              :columns="columns1"
              :infoData="infoData1"
              :pagination="pagination1"
              tableClass="features-table2"
              :loading="tableLoading"
              :infoQuery="infoQuery"
              @handleChangebtn="handleChangebtn(3)"
            >
              <div slot="searchOption" v-show="activeKey === 1">
                <div class="business-options">
                  <div class="business-options-item">
                    <label class="item-label">专利类型：</label>
                    <div class="item-content">
                      <a-select
                        allow-clear
                        :options="patentOptions"
                        class="item-content-input"
                        placeholder="请选择"
                        v-model="patentValue"
                      />
                    </div>
                  </div>
                  <div class="business-options-item">
                    <label class="item-label">公开年份：</label>
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
                    <div class="item-buttons">
                      <a-button class="button-left" @click="reset"
                        >重置</a-button
                      >
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
          </a-tab-pane>
          <a-tab-pane :key="2" tab="商标明细">
            <DetailTable
              :foldValue="foldValue3"
              :columns="columns2"
              :infoData="infoData2"
              :pagination="pagination2"
              tableClass="features-table2"
              :loading="tableLoading"
              @handleChangebtn="handleChangebtn(3)"
            >
              <div slot="searchOption" v-show="activeKey === 2">
                <div class="business-options">
                  <div class="business-options-item">
                    <label class="item-label second-type">注册公告年份：</label>
                    <div class="item-content second-type">
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
                  <div class="business-options-item"></div>
                  <div class="business-options-item">
                    <div class="item-buttons">
                      <a-button class="button-left" @click="reset"
                        >重置</a-button
                      >
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
          </a-tab-pane>
          <!-- <a-tab-pane :key="3" tab="指标明细">
            <DetailTable
              :foldValue="foldValue3"
              :columns="columns3"
              :data-source="infoData3"
              :pagination="pagination3"
              tableClass="features-table3"
              @handleChangebtn="handleChangebtn(3)"
            >
              <div class="business-options" v-show="activeKey === 3">
                <div class="business-options-item">
                  <div class="iitem-label second-type">年度选择：</div>
                  <div class="item-content second-type">
                    <a-range-picker
                      :placeholder="['开始年份', '截止年份']"
                      class="item-content-input"
                      format="YYYY"
                      valueFormat="YYYY"
                      v-model="startStopTime"
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
                  <div class="iitem-label second-type">指标分类：</div>
                  <div class="item-content second-type">
                    <a-select
                      :options="indexTypeOptions"
                      class="item-content-input"
                      v-model="indexType"
                    />
                  </div>
                </div>
                <div class="business-options-item">
                  <div class="iitem-label second-type">绩效评价：</div>
                  <div class="item-content second-type">
                    <a-select
                      :options="perforAppraisalOptions"
                      class="item-content-input"
                      v-model="perforAppraisal"
                    />
                  </div>
                </div>
                <div class="business-options-item">
                  <div class="iitem-label second-type">指标名称：</div>
                  <div class="item-content second-type">
                    <a-input
                      type="text"
                      class="item-content-input"
                      v-model="searchInput"
                      placeholder="关键词"
                    />
                  </div>
                </div>
                <div class="search-option-item"></div>
                <div class="search-option-item">
                  <a-button
                    type="primary"
                    class="item-box-btn"
                    icon="search"
                    @click="handleSearch2"
                    >查询</a-button
                  >
                  <a-button class="item-box-btn" @click="reset2">重置</a-button>
                </div>
              </div>
              <div slot="titleSlot" class="title-slot">
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
              <div class="year-slot" slot="year2017" slot-scope="text">
                <span class="year-slot-img">
                  <icon-svg
                    v-if="text >= 80"
                    color="#13C213"
                    icon-class="灯泡"
                  />
                  <icon-svg
                    v-else-if="text >= 60"
                    color="rgba(0, 0, 0, 0.25)"
                    icon-class="灯泡"
                  />
                  <icon-svg
                    v-else-if="text >= 40"
                    color="#F28518"
                    icon-class="灯泡"
                  />
                  <icon-svg v-else color="#FF4053" icon-class="灯泡" />
                </span>
                <span class="year-slot-text">{{ text }}%</span>
              </div>
              <div class="year-slot" slot="year2018" slot-scope="text">
                <span class="year-slot-img">
                  <icon-svg
                    v-if="text >= 80"
                    color="#13C213"
                    icon-class="灯泡"
                  />
                  <icon-svg
                    v-else-if="text >= 60"
                    color="rgba(0, 0, 0, 0.25)"
                    icon-class="灯泡"
                  />
                  <icon-svg
                    v-else-if="text >= 40"
                    color="#F28518"
                    icon-class="灯泡"
                  />
                  <icon-svg v-else color="#FF4053" icon-class="灯泡" />
                </span>
                <span class="year-slot-text">{{ text }}%</span>
              </div>
              <div class="year-slot" slot="year2019" slot-scope="text">
                <span class="year-slot-img">
                  <icon-svg
                    v-if="text >= 80"
                    color="#13C213"
                    icon-class="灯泡"
                  />
                  <icon-svg
                    v-else-if="text >= 60"
                    color="rgba(0, 0, 0, 0.25)"
                    icon-class="灯泡"
                  />
                  <icon-svg
                    v-else-if="text >= 40"
                    color="#F28518"
                    icon-class="灯泡"
                  />
                  <icon-svg v-else color="#FF4053" icon-class="灯泡" />
                </span>
                <span class="year-slot-text">{{ text }}%</span>
              </div>
              <div class="year-slot" slot="year2020" slot-scope="text">
                <span class="year-slot-img">
                  <icon-svg
                    v-if="text >= 80"
                    color="#13C213"
                    icon-class="灯泡"
                  />
                  <icon-svg
                    v-else-if="text >= 60"
                    color="rgba(0, 0, 0, 0.25)"
                    icon-class="灯泡"
                  />
                  <icon-svg
                    v-else-if="text >= 40"
                    color="#F28518"
                    icon-class="灯泡"
                  />
                  <icon-svg v-else color="#FF4053" icon-class="灯泡" />
                </span>
                <span class="year-slot-text">{{ text }}%</span>
              </div>
              <div class="year-slot" slot="year2021" slot-scope="text">
                <span class="year-slot-img">
                  <icon-svg
                    v-if="text >= 80"
                    color="#13C213"
                    icon-class="灯泡"
                  />
                  <icon-svg
                    v-else-if="text >= 60"
                    color="rgba(0, 0, 0, 0.25)"
                    icon-class="灯泡"
                  />
                  <icon-svg
                    v-else-if="text >= 40"
                    color="#F28518"
                    icon-class="灯泡"
                  />
                  <icon-svg v-else color="#FF4053" icon-class="灯泡" />
                </span>
                <span class="year-slot-text">{{ text }}%</span>
              </div>
            </DetailTable>
          </a-tab-pane> -->
        </a-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import DataGraphs from "../components/dataGraphs";
import DetailTable from "../components/detailTable";
import FeatureTable from "../components/featureTable";
import { Button, DatePicker, Icon, Input, Tabs, Tooltip } from "ant-design-vue";
import { scrollToBottom } from "@/utils/common.js";
import { mapState } from "vuex";
import {
  queryPatentAndBrandStatics,
  queryPatentDetail,
  queryBrandDetaill,
  cnTechInnovative,
  queryPatentTab,
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
import { handleAddEchartsBackground } from "@/utils/echarts.js";
import { find } from "lodash";

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

export default {
  name: "technologicalInnovation",
  data() {
    return {
      foldValue1: true,
      foldValue2: true,
      foldValue3: true,
      columns1: [
        {
          title: "序号",
          dataIndex: "index",
          key: "index",
          width: 62,
        },
        {
          title: "专利类型",
          dataIndex: "type",
          key: "type",
          width: 120,
        },
        {
          title: "专利名称",
          dataIndex: "name",
          key: "name",
          width: 150,
        },
        {
          title: "公开日",
          dataIndex: "outDate",
          key: "outDate",
          width: 120,
        },
        {
          title: "申请日",
          dataIndex: "inDate",
          key: "inDate",
          width: 120,
        },
        {
          title: "专利号",
          dataIndex: "number",
          key: "number",
          width: 120,
        },
        {
          title: "公开号",
          dataIndex: "outNumber",
          key: "outNumber",
          width: 120,
        },
        {
          title: "文摘",
          dataIndex: "desc",
          key: "desc",
          width: 300,
          customRender: (text, record, index) => {
            return (
              <a-tooltip placement="left">
                <template slot="title">{text}</template>
                <div class="ellipsis">{text}</div>
              </a-tooltip>
            );
          },
        },
      ],
      columns2: [
        {
          title: "序号",
          dataIndex: "index",
          key: "index",
          width: 62,
        },
        {
          title: "注册号/商标注册号",
          dataIndex: "number",
          key: "number",
          width: 180,
        },
        {
          title: "商标类别",
          dataIndex: "type",
          key: "type",
          width: 160,
        },
        {
          title: "注册公告日期",
          dataIndex: "outDate",
          key: "outDate",
          width: 160,
        },
        {
          title: "商标专用权起始日期",
          dataIndex: "startDate",
          key: "startDate",
          width: 160,
        },
        {
          title: "商标专用权截止日期",
          dataIndex: "endDate",
          key: "endDate",
          width: 160,
        },
        {
          title: "商标共有人信息",
          dataIndex: "person",
          key: "person",
          width: 160,
        },
      ],
      columns3: [
        {
          title: "序号",
          dataIndex: "index",
          key: "index",
          width: 62,
        },
        {
          title: "专利名称",
          dataIndex: "indexName",
          key: "indexName",
          width: 230,
        },
        {
          title: "申请公布号",
          dataIndex: "indexSource",
          key: "indexSource",
          width: 150,
        },
        {
          title: "专利类型",
          dataIndex: "indexType",
          key: "indexType",
          width: 100,
          scopedSlots: { customRender: "indexType" },
        },
        {
          title: "法律状态",
          dataIndex: "indexStatus",
          key: "indexStatus",
          width: 120,
        },
        {
          title: "申请日期",
          dataIndex: "time",
          key: "time",
          width: 125,
        },
        {
          title: "申请公布日期",
          dataIndex: "publishTime",
          key: "publishTime",
          width: 150,
        },
      ],
      infoData1: [],
      infoData2: [],
      infoData3: [
        // {
        //   index: 1,
        //   indexName: "一种用于抑制电网能量倒灌的储能变流器",
        //   indexSource: "CN213547389U",
        //   indexType: "实用新型",
        //   indexStatus: "有效-授权",
        //   time: "2022-01-01",
        //   publishTime: "2022-01-01",
        // },
      ],
      dataList: [],
      pagination1: {
        total: 0,
        current: 1,
        pageSize: 15,
        size: "small",
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ["5", "10", "15", "20"],
        showTotal: (total, current) => {
          return `共${total}条记录，当前第${Math.ceil(
            current[0] / this.pagination1.pageSize
          )}页`;
        },
        onChange: (page, pageSize) => {
          this.pagination1.current = page;
          this.pagination1.pageSize = pageSize;
          this.queryPatentDetail("repeat");
        },
        onShowSizeChange: (current, size) => {
          this.pagination1.current = 1;
          this.pagination1.pageSize = size;
          this.queryPatentDetail("repeat");
        },
      },
      pagination2: {
        total: 0,
        current: 1,
        pageSize: 15,
        size: "small",
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ["5", "10", "15", "20"],
        showTotal: (total, current) => {
          return `共${total}条记录，当前第${Math.ceil(
            current[0] / this.pagination2.pageSize
          )}页`;
        },
        onChange: (page, pageSize) => {
          this.pagination2.current = page;
          this.pagination2.pageSize = pageSize;
          this.queryBrandDetaill("repeat");
        },
        onShowSizeChange: (current, size) => {
          this.pagination2.current = 1;
          this.pagination2.pageSize = size;
          this.queryBrandDetaill("repeat");
        },
      },
      pagination3: {
        total: 0,
        current: 1,
        pageSize: 15,
        size: "small",
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ["5", "10", "15", "20"],
        showTotal: (total, current) => {
          return `共${total}条记录，当前第${Math.ceil(
            current[0] / this.pagination3.pageSize
          )}页`;
        },
        onChange: (page, pageSize) => {
          this.pagination3.current = page;
          this.pagination3.pageSize = pageSize;
        },
        onShowSizeChange: (current, size) => {
          this.pagination3.current = 1;
          this.pagination3.pageSize = size;
        },
      },
      objValue: "0",
      startStopTime: undefined,
      isOpen: false,
      graphList: [
        {
          title: "商标和专利数",
          ref: "graph1",
          width: "calc((100% - 48px) / 3)",
          paddingTop: "381px",
          dataSource: "上海知识产权局",
        },
        {
          title: "科技支出合计",
          ref: "graph2",
          width: "calc((100% - 48px) / 3)",
          paddingTop: "381px",
        },
        {
          title: "技术投入比率",
          ref: "graph3",
          width: "calc((100% - 48px) / 3)",
          paddingTop: "381px",
        },
      ],
      myChart1: null,
      myChart2: null,
      myChart3: null,
      activeKey: 1,
      patentOptions: [],
      patentValue: undefined,
      searchInput: undefined,
      indexTypeOptions: [
        {
          value: "0",
          label: "全部",
        },
      ],
      indexType: "0",
      perforAppraisalOptions: [
        {
          value: "0",
          label: "全部",
        },
      ],
      perforAppraisal: "0",
      graphData: {
        xAxis: [],
      },
      lineGraphData: {},
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
    ATabPane: TabPane,
    ATabs: Tabs,
    DataGraphs,
    DetailTable,
    FeatureTable,
    ATooltip: Tooltip,
  },
  computed: {
    ...mapState("auditOptions", ["paramsObj"]),
  },
  mounted() {
    this.queryPatentAndBrandStatics();
    this.cnTechInnovative();
    this.queryPatentDetail("init");
    this.queryBrandDetaill("init");
    this.queryPatentTab();
    const f = () => {
      this.myChart1.resize();
      this.myChart2.resize();
      this.myChart3.resize();
    };
    window.addEventListener("resize", f);
  },
  beforeDestroy() {
    this.myChart1.clear();
    this.myChart2.clear();
    this.myChart3.clear();
    const f = () => {
      this.myChart1.resize();
      this.myChart2.resize();
      this.myChart3.resize();
    };
    window.removeEventListener("resize", f);
  },
  methods: {
    reset() {
      this.objValue = "0";
      this.startStopTime = undefined;
      this.handleSearch();
    },
    handleSearch() {
      console.log("handleSearch");
      switch (this.activeKey) {
        case 1:
          this.queryPatentDetail("init");
          break;
        case 2:
          this.queryBrandDetaill("init");
          break;
      }
    },
    reset2() {
      this.searchInput = undefined;
      this.indexType = undefined;
      this.perforAppraisal = undefined;
      this.emoType = undefined;
      this.handleSearch2();
    },
    handleSearch2() {
      console.log("handleSearch2");
    },
    init() {
      this.myChart1 = this.$echarts.init(this.$refs.dataGraphs.$refs.graph1[0]);
      this.myChart2 = this.$echarts.init(this.$refs.dataGraphs.$refs.graph2[0]);
      this.myChart3 = this.$echarts.init(this.$refs.dataGraphs.$refs.graph3[0]);
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
              if (item.seriesName === "商标同比增长率") {
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
            name: "单位：件",
            minInterval: 1,
            splitLine: {
              lineStyle: {
                type: "dashed",
              },
            },
          },
          {
            type: "value",
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
            name: "商标",
            type: "bar",
            barWidth: "30%",
            stack: "main",
            data: this.graphData.brandData,
            color: this.lineColor[0],
          },
          {
            name: "专利",
            type: "bar",
            stack: "main",
            barWidth: "30%",
            data: this.graphData.patentData,
            color: this.lineColor[1],
          },
          {
            name: "商标同比增长率",
            type: "line",
            yAxisIndex: 1,
            color: this.lineColor[2],
            data: this.graphData.brandGrowthData,
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
      this.myChart1.setOption(option1);
      handleAddEchartsBackground(this.myChart1, option1, this.graphData.xAxis);

      if (
        this.lineGraphData.buyMoney &&
        this.lineGraphData.studyMoney &&
        this.lineGraphData.otherMoney &&
        !this.lineGraphData.buyMoney.length &&
        !this.lineGraphData.studyMoney.length &&
        !this.lineGraphData.otherMoney.length
      ) {
        if (this.myChart2) this.myChart2.clear();
        this.$set(this.graphList, 1, {
          title: "科技支出合计",
          ref: "graph2",
          width: "calc((100% - 48px) / 3)",
          paddingTop: "381px",
          noData: true,
        });
      } else {
        const option2 = {
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
              name: "单位：元",
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
              name: "研究费用",
              type: "bar",
              stack: "tax",
              barWidth: "30%",
              emphasis: {
                focus: "series",
              },
              data: this.lineGraphData.studyMoney,
              color: this.lineColor[0],
            },
            {
              name: "购买技术设备",
              type: "bar",
              stack: "tax",
              barWidth: "30%",
              emphasis: {
                focus: "series",
              },
              data: this.lineGraphData.buyMoney,
              color: this.lineColor[1],
            },
            {
              name: "其他",
              type: "bar",
              stack: "tax",
              barWidth: "30%",
              emphasis: {
                focus: "series",
              },
              data: this.lineGraphData.otherMoney,
              color: this.lineColor[2],
            },
          ],
        };
        this.myChart2.setOption(option2);
        handleAddEchartsBackground(
          this.myChart2,
          option2,
          this.graphData.xAxis
        );
      }
      if (
        this.lineGraphData.techExpend &&
        this.lineGraphData.techExpend &&
        !this.lineGraphData.techExpend.length &&
        !this.lineGraphData.personExpend.length
      ) {
        if (this.myChart3) this.myChart3.clear();
        this.$set(this.graphList, 2, {
          title: "技术投入比率",
          ref: "graph3",
          width: "calc((100% - 48px) / 3)",
          paddingTop: "381px",
          noData: true,
        });
      } else {
        if (this.myChart3) this.myChart3.clear();
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
              let htmls = params.map((item) => {
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
              name: "科技支出占营业收入",
              type: "line",
              data: this.lineGraphData.techExpend,
              color: this.lineColor[0],
              showSymbol: true,
            },
            // {
            //   name: "在成本中列支的自筹研发费占营业收入",
            //   type: "line",
            //   data: this.graphData.selfExpend,
            //   color: this.lineColor[2],
            //   showSymbol: true,
            // },
            {
              name: "研发人员人工占营业收入",
              type: "line",
              data: this.lineGraphData.personExpend,
              color: this.lineColor[1],
              showSymbol: true,
            },
          ],
        };
        this.myChart3.setOption(option3);
        handleAddEchartsBackground(
          this.myChart3,
          option3,
          this.graphData.xAxis
        );
      }
      console.log("this.graphList", this.graphList);
    },
    onKeychange(activeKey) {
      this.activeKey = activeKey;
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
    handleTableChange(pagination, filters, sorter) {
      console.log("handleTableChange", pagination, filters, sorter);
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
    async queryPatentAndBrandStatics() {
      const json = {
        uniScId: this.paramsObj.uniScId,
        corpName: this.paramsObj.corpName,
      };
      const res = await queryPatentAndBrandStatics(json);
      console.log("res", res);
      if (res.message === "成功" && res.data) {
        const graphData = {
          xAxis: [],
          brandData: [],
          brandGrowthData: [],
          patentData: [],
          // studyMoney: [],
          // buyMoney: [],
          // otherMoney: [],
          // techExpend: [],
          // selfExpend: [],
          // personExpend: [],
        };
        for (let i in res.data) {
          const value = res.data[i];
          graphData.xAxis.push(i);

          if (value.length) {
            const brandTarget = find(value, (v) => v.kjcxlx1 === "商标");
            const patentTarget = find(value, (v) => v.kjcxlx1 === "专利");
            console.log("brandTarget", brandTarget);
            console.log("patentTarget", patentTarget);
            if (brandTarget) {
              graphData.brandData.push(brandTarget.brandNum || 0);
              graphData.brandGrowthData.push(brandTarget.brandGrowthRate || 0);
            } else {
              graphData.brandData.push(0);
              graphData.brandGrowthData.push(0);
            }
            if (patentTarget) {
              graphData.patentData.push(patentTarget.patentNum || 0);
            } else {
              graphData.patentData.push(0);
            }
          } else {
            graphData.brandData.push(0);
            graphData.brandGrowthData.push(0);
            graphData.patentData.push(0);
          }
        }
        this.graphData = graphData;
        this.init();
      } else if (res.data && !res.data) {
        this.$message.info("暂无商标和专利数信息");
        this.$set(this.graphList, 0, {
          title: "商标和专利数",
          ref: "graph1",
          width: "calc((100% - 48px) / 3)",
          paddingTop: "381px",
          dataSource: "上海知识产权局",
          noData: true,
        });
      } else {
        this.$message.error("获取商标和专利数信息失败！");
      }
    },
    async cnTechInnovative() {
      // 科技支出合计和技术投入比率
      const json = {
        corpName: this.paramsObj.corpName,
      };
      const res = await cnTechInnovative(json);
      console.log("res", res);
      if (res.message === "成功" && res.data) {
        const lineGraphData = {
          xAxis: [],
          studyMoney: [],
          buyMoney: [],
          otherMoney: [],
          techExpend: [],
          // selfExpend: [],
          personExpend: [],
        };
        for (let i in res.data) {
          lineGraphData.xAxis.push(i);
          const value = res.data[i];
          if (value.length) {
            lineGraphData.studyMoney.push(value[0].rcxyfjfzc);
            lineGraphData.buyMoney.push(value[0].gmxjshkysbdzc);
            lineGraphData.otherMoney.push(value[0].qtkjzc);
            lineGraphData.techExpend.push(value[0].jftrzyyzsr);
            lineGraphData.personExpend.push(value[0].ryrgzczyyzsr);
          } else {
            lineGraphData.studyMoney.push(null);
            lineGraphData.buyMoney.push(null);
            lineGraphData.otherMoney.push(null);
            lineGraphData.techExpend.push(null);
            lineGraphData.personExpend.push(null);
          }
        }
        this.lineGraphData = lineGraphData;
        console.log("折线图", this.lineGraphData);
        this.init();
      } else if (res.data && !res.data) {
        this.$message.info("暂无商标和专利数信息");
        if (this.myChart2) this.myChart2.clear();
        this.$set(this.graphList, 1, {
          title: "科技支出合计",
          ref: "graph2",
          width: "calc((100% - 48px) / 3)",
          paddingTop: "381px",
          noData: true,
        });
        if (this.myChart3) this.myChart3.clear();
        this.$set(this.graphList, 2, {
          title: "技术投入比率",
          ref: "graph3",
          width: "calc((100% - 48px) / 3)",
          paddingTop: "381px",
          noData: true,
        });
      } else {
        this.$message.error("获取商标和专利数信息失败！");
      }
    },
    async queryPatentDetail(type) {
      // 专利明细
      if (type === "init") {
        this.$set(this.pagination1, "current", 1);
      }
      let json = {};
      if (this.startStopTime && this.startStopTime.length) {
        json = {
          corpName: this.paramsObj.corpName,
          pageNo: this.pagination1.current,
          pageSize: this.pagination1.pageSize,
          startYear: this.startStopTime[0].format("YYYY"),
          endYear: this.startStopTime[1].format("YYYY"),
          type: this.patentValue,
        };
      } else {
        json = {
          corpName: this.paramsObj.corpName,
          pageNo: this.pagination1.current,
          pageSize: this.pagination1.pageSize,
          type: this.patentValue,
        };
      }
      this.infoQuery = json;
      this.tableLoading = true;
      const res = await queryPatentDetail(json);
      this.tableLoading = false;
      console.log("queryPatentDetail", res);
      this.pagination1.total = res.data.totalCount;

      if (
        res.message === "成功" &&
        res.data.dateList &&
        res.data.dateList.length
      ) {
        const dataList = res.data.dateList;
        const infoData = [];
        dataList.map((item, index) => {
          let infoDetail = {
            index:
              (this.pagination1.current - 1) * this.pagination1.pageSize +
              index +
              1,
            type: item.pType || "--",
            name: item.pTypeName || "--",
            outDate: item.pd || "--",
            inDate: item.ad || "--",
            number: item.pnum || "--",
            outNumber: item.pn || "--",
            desc: item.ab || "--",
          };
          infoData.push(infoDetail);
        });

        this.infoData1 = infoData;
        console.log("this.infoData1", this.infoData1);
      } else if (res.data && res.data.dateList && !res.data.dateList.length) {
        this.$message.info("暂无专利明细");
        this.infoData1 = [];
      } else {
        this.$message.error("获取专利明细信息失败！");
      }
    },
    async queryBrandDetaill(type) {
      // 商标明细
      if (type === "init") {
        this.$set(this.pagination2, "current", 1);
      }
      let json = {};
      if (this.startStopTime && this.startStopTime.length) {
        json = {
          corpName: this.paramsObj.corpName,
          pageNo: this.pagination2.current,
          pageSize: this.pagination2.pageSize,
          startYear: this.startStopTime[0].format("YYYY"),
          endYear: this.startStopTime[1].format("YYYY"),
        };
      } else {
        json = {
          corpName: this.paramsObj.corpName,
          pageNo: this.pagination2.current,
          pageSize: this.pagination2.pageSize,
        };
      }
      this.tableLoading = true;
      const res = await queryBrandDetaill(json);
      this.tableLoading = false;
      console.log("queryBrandDetail", res);
      this.pagination2.total = res.data.totalCount;
      if (
        res.message === "成功" &&
        res.data.dateList &&
        res.data.dateList.length
      ) {
        const dataList = res.data.dateList;
        const infoData = [];
        console.log("dataList", dataList);
        dataList.map((item, index) => {
          let infoDetail = {
            index:
              (this.pagination1.current - 1) * this.pagination1.pageSize +
              index +
              1,
            number: item.regNo || item.regNum || "--",
            type: item.intCls || "--",
            outDate: item.regAnncDate || "--",
            startDate: item.propertyBgnDate || "--",
            endDate: item.propertyEndDate || "--",
            person: item.coownerCnName || "--",
          };
          infoData.push(infoDetail);
        });
        this.infoData2 = infoData;
      } else if (res.data && res.data.dateList && !res.data.datelist.length) {
        this.$message.info("暂无商标明细信息");
        this.infoData2 = [];
      } else {
        this.$message.error("获取商标明细信息失败！");
      }
    },
    async queryPatentTab() {
      const json = {
        corpName: this.paramsObj.corpName,
      };
      const res = await queryPatentTab(json);
      console.log("res", res);
      if (res.message === "成功" && res.data) {
        res.data["patentType"].map((v) => {
          if (v) {
            // 过滤null
            const patentOption = {
              value: v,
              label: v,
            };
            this.patentOptions.push(patentOption);
          }
        });
      } else {
        this.$message.error(res.message);
      }
    },
  },
};
</script>
<style lang="less">
.technological-Innovation {
  .business-table {
    &-item {
      .ant-tabs {
        .ant-tabs-bar {
          border: 0;

          .ant-tabs-nav-wrap {
            .ant-tabs-tab {
              padding: 12px 0;
            }
          }
        }
      }

      .business-options {
        &-item {
          .item-label {
            &.second-type {
              width: 115px;
            }
          }

          .item-content {
            &.second-type {
              width: calc(100% - 115px);
            }
          }
        }
      }
    }
  }
}
.ellipsis {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5; /* 自定义的行数 */
  overflow: hidden;
}
</style>
