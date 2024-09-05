<template>
  <div class="unit-spend">
    <!-- 1.整体支出均衡性 -->
    <div class="sub-title">整体支出均衡性</div>
    <div class="graph-container">
      <div class="graph-container-wrapper">
        <!-- 框内顶部标题和按钮 -->
        <div class="wrapper-top">
          <!-- 标题 -->
          <div class="wrapper-top-title">整体支出均衡性</div>
          <!-- 右侧按钮和提示框 -->
          <div class="wrapper-top-action">
            <div class="action-choose" @click="handleChooseBudget">
              请选择展示预算单位
            </div>
            <div class="action-reset" @click="onReset1">重置</div>
            <a-tooltip
              placement="topLeft"
              overlayClassName="wrapper-title-tooltip"
            >
              <template slot="title">
                <span>111111</span>
              </template>
              <div class="tooltip-icon">
                <icon-svg icon-class="icon-warning" color="#1776FF"></icon-svg>
              </div>
            </a-tooltip>
          </div>
        </div>
        <!-- 分割线 -->
        <div class="wrapper-split"></div>
        <!-- 图片内容 -->
        <div class="wrapper-content">
          <div
            class="wrapper-content-graph"
            v-if="!(graphData1.seriesData && graphData1.seriesData.length)"
          >
            <img class="no-data" src="@/assets/images/img/noData.png" alt="" />
          </div>
          <div class="wrapper-content-graph" ref="graph1" v-else></div>
        </div>
      </div>
    </div>
    <!-- 2.资金结构 -->
    <div class="sub-title">资金结构</div>
    <div class="graph-container">
      <!-- 按资金来源小框 -->
      <div class="graph-container-wrapper">
        <!-- 框内顶部标题和按钮 -->
        <div class="wrapper-top">
          <!-- 标题 -->
          <div class="wrapper-top-title">按资金来源</div>
          <a-tooltip
            placement="topLeft"
            overlayClassName="wrapper-title-tooltip"
          >
            <template slot="title">
              <span>111111</span>
            </template>
            <div class="tooltip-icon">
              <icon-svg icon-class="icon-warning" color="#1776FF"></icon-svg>
            </div>
          </a-tooltip>
        </div>
        <!-- 分割线 -->
        <div class="wrapper-split"></div>
        <!-- 图片内容 -->
        <div class="wrapper-content">
          <!-- 左侧圆环 -->
          <div class="wrapper-content-left">
            <div class="wrapper-content-left-graph" ref="graph2"></div>
          </div>
          <!-- 右侧堆叠柱状图 -->
          <div class="wrapper-content-right">
            <div class="wrapper-content-right-graph" ref="graph3"></div>
          </div>
        </div>
      </div>
      <!-- 按科目小框 -->
      <div class="graph-container-wrapper">
        <!-- 框内顶部标题和按钮 -->
        <div class="wrapper-top">
          <!-- 标题 -->
          <div class="wrapper-top-title">
            按科目&nbsp;&nbsp;&nbsp;&nbsp;
            <a-radio-group :options="subjectChose" v-model="subjectType" />
          </div>
          <!-- 右侧按钮 -->
          <div class="wrapper-top-action">
            <div class="action-choose" @click="handleChooseSubject('科目选择')">
              请选择展示科目
            </div>
            <div class="action-reset" @click="onReset2">重置</div>
            <a-tooltip
              placement="topLeft"
              overlayClassName="wrapper-title-tooltip"
            >
              <template slot="title">
                <span>111111</span>
              </template>
              <div class="tooltip-icon">
                <icon-svg icon-class="icon-warning" color="#1776FF"></icon-svg>
              </div>
            </a-tooltip>
          </div>
        </div>
        <!-- 分割线 -->
        <div class="wrapper-split"></div>
        <!-- 图片内容 -->
        <div class="wrapper-content">
          <div class="wrapper-content-left">
            <div class="wrapper-content-left-graph" ref="graph4"></div>
          </div>
          <div class="wrapper-content-right">
            <div class="wrapper-content-right-graph" ref="graph5"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- 3.预算单位 -->
    <div class="table-top">
      <div class="sub-title">预算单位</div>
      <div class="top-action">
        <a-button class="top-action-btn" @click="sortShow1 = true">
          <div class="top-action-btn-icon">
            <icon-svg icon-class="排序"></icon-svg>
          </div>
          排序
        </a-button>
        <a-button class="top-action-btn" @click="filterShow1 = true">
          <div class="top-action-btn-icon">
            <icon-svg icon-class="筛选"></icon-svg>
          </div>
          筛选
        </a-button>
      </div>
    </div>
    <a-table
      :columns="columns1"
      :data-source="dataSource1"
      :pagination="false"
      :scroll="{ x: 'max-content', y: 500 }"
      :loading="tableLoading1"
      :bordered="true"
    >
      <div slot="graphTrendTitle" class="slot-table-header">
        <span>近五年趋势</span>
        <a-radio-group v-model="trendType">
          <a-radio value="money">支出金额</a-radio>
          <a-radio value="excuteRate">执行率</a-radio>
          <a-radio value="projectNumber">项目数量</a-radio>
        </a-radio-group>
      </div>
      <template slot="graphTrend" slot-scope="text, record, index">
        <div
          style="width: 100%; height: 100%; min-height: 100px"
          :ref="'chart' + index"
        ></div>
      </template>
      <span slot="dnzxl" slot-scope="dnzxl">
        <span
          v-if="dnzxl !== '--'"
          :style="{
            color:
              parseFloat(dnzxl) >=
              parseFloat((configParams.highExecutionRate * 100).toFixed(0))
                ? 'red'
                : parseFloat(dnzxl) <=
                  parseFloat((configParams.lowExecutionRate * 100).toFixed(0))
                ? '#f28518'
                : '',
          }"
          >{{ dnzxl }}%</span
        >
        <span v-else>{{ dnzxl }}%</span>
      </span>
    </a-table>
    <!-- 4.项目分析 -->
    <div class="table-top">
      <div class="sub-title">项目分析</div>
      <div class="top-action">
        <a-button class="top-action-btn" @click="sortShow2 = true">
          <div class="top-action-btn-icon">
            <icon-svg icon-class="排序"></icon-svg>
          </div>
          排序
        </a-button>
        <a-button class="top-action-btn" @click="filterShow2 = true">
          <div class="top-action-btn-icon">
            <icon-svg icon-class="筛选"></icon-svg>
          </div>
          筛选
        </a-button>
      </div>
    </div>
    <a-table
      :columns="columns2"
      :data-source="dataSource2"
      :pagination="pagination2"
      :scroll="{ x: 'max-content', y: 500 }"
      :loading="tableLoading2"
      :bordered="true"
    >
      <span slot="xmmc" slot-scope="text">
        <a>{{ text }}</a>
      </span>
      <span slot="zcje" slot-scope="text" style="display: flex">
        <a-progress
          :percent="text !== '--' ? (text / maxZcje) * 100 : 0"
          size="small"
          :show-info="false"
          style="width: 50px"
        />
        <div style="margin-left: 8px">
          <span
            :style="{
              color:
                parseFloat(text) >=
                parseFloat(configParams.highProjectExpenditure)
                  ? 'red'
                  : '',
            }"
          >
            <span>{{ Number(text).toLocaleString() }}万元</span>
          </span>
        </div>
      </span>
      <span slot="ysje" slot-scope="text, record" style="display: flex">
        <a-progress
          :percent="record.ysjeRate !== '--' ? record.ysjeRate : 0"
          size="small"
          :show-info="false"
          style="width: 50px"
        />
        <div style="margin-left: 8px">
          <span>{{ record.ysjeRate }}%</span>,&nbsp;&nbsp;
          <span>{{ Number(text).toLocaleString() }}万元</span>
        </div>
      </span>
      <span slot="zxl" slot-scope="text" style="display: flex">
        <a-progress
          :percent="text !== '--' ? parseFloat(text) : 0"
          size="small"
          :show-info="false"
          style="width: 200px"
        />
        <div style="margin-left: 8px">
          <span
            :style="{
              color:
                parseFloat(text) >=
                parseFloat((configParams.highExecutionRate * 100).toFixed(0))
                  ? 'red'
                  : parseFloat(text) <=
                    parseFloat((configParams.lowExecutionRate * 100).toFixed(0))
                  ? '#f28518'
                  : '',
            }"
            >{{ text }}%</span
          >
        </div>
      </span>
    </a-table>
    <!-- 5.排行榜 -->
    <div class="sub-title">排行榜</div>
    <div class="graph-container">
      <!-- 资金TOP5小框 -->
      <div class="graph-container-wrapper two-child">
        <!-- 框内顶部标题和按钮 -->
        <div class="graph-container-wrapper-item">
          <div class="wrapper-top">
            <!-- 标题 -->
            <div class="wrapper-top-title">资金TOP5</div>
            <a-tooltip
              placement="topLeft"
              overlayClassName="wrapper-title-tooltip"
            >
              <template slot="title">
                <span>111111</span>
              </template>
              <div class="tooltip-icon">
                <icon-svg icon-class="icon-warning" color="#1776FF"></icon-svg>
              </div>
            </a-tooltip>
          </div>
          <!-- 分割线 -->
          <div class="wrapper-split"></div>
          <!-- 图片内容 -->
          <div class="wrapper-content">
            <div class="wrapper-content-graph" v-if="!moneyList.length">
              <img src="@/assets/images/img/noData.png" alt="" />
            </div>
            <div class="wrapper-content-graph" v-else>
              <div class="progress" v-for="item in moneyList" :key="item.name">
                <span class="progress-label" :title="item.name">{{
                  item.name
                }}</span
                ><a-progress
                  :percent="(Number(item.money) / Number(moneyListMax)) * 100"
                  :strokeWidth="16"
                  :showInfo="false"
                />
                <span class="progress-text"
                  >{{ parseFloat(item.money).toLocaleString() }}万元</span
                >
              </div>
            </div>
          </div>
        </div>
        <div class="graph-container-wrapper-item">
          <!-- 框内顶部标题和按钮 -->
          <div class="wrapper-top">
            <!-- 标题 -->
            <div class="wrapper-top-title">资金TOP5趋势</div>
            <!-- 右侧按钮 -->
            <a-tooltip
              placement="topLeft"
              overlayClassName="wrapper-title-tooltip"
            >
              <template slot="title">
                <span>111111</span>
              </template>
              <div class="tooltip-icon">
                <icon-svg icon-class="icon-warning" color="#1776FF"></icon-svg>
              </div>
            </a-tooltip>
          </div>
          <!-- 分割线 -->
          <div class="wrapper-split"></div>
          <!-- 图片内容 -->
          <div class="wrapper-content">
            <div class="wrapper-content-graph" ref="graph6"></div>
          </div>
        </div>
      </div>
      <div class="graph-container-wrapper two-child">
        <div class="graph-container-wrapper-item">
          <!-- 框内顶部标题和按钮 -->
          <div class="wrapper-top">
            <!-- 标题 -->
            <div class="wrapper-top-title">资金增长率TOP5</div>
            <!-- 右侧按钮 -->
            <a-tooltip
              placement="topLeft"
              overlayClassName="wrapper-title-tooltip"
            >
              <template slot="title">
                <span>111111</span>
              </template>
              <div class="tooltip-icon">
                <icon-svg icon-class="icon-warning" color="#1776FF"></icon-svg>
              </div>
            </a-tooltip>
          </div>
          <!-- 分割线 -->
          <div class="wrapper-split"></div>
          <!-- 图片内容 -->
          <div class="wrapper-content">
            <!-- 左侧圆环 -->
            <div class="wrapper-content-graph" v-if="!addList.length">
              <img src="@/assets/images/img/noData.png" alt="" />
            </div>
            <div class="wrapper-content-graph" v-else>
              <div class="progress" v-for="item in addList" :key="item.name">
                <span class="progress-label" :title="item.name">{{
                  item.name
                }}</span
                ><a-progress
                  :percent="(Number(item.value) / Number(addListMax)) * 100"
                  :strokeWidth="16"
                  :showInfo="false"
                />
                <span class="progress-text short">{{ item.value }}%</span>
              </div>
            </div>
          </div>
        </div>
        <div class="graph-container-wrapper-item">
          <!-- 框内顶部标题和按钮 -->
          <div class="wrapper-top">
            <!-- 标题 -->
            <div class="wrapper-top-title">执行率后5名</div>
            <!-- 右侧按钮 -->
            <a-tooltip
              placement="topLeft"
              overlayClassName="wrapper-title-tooltip"
            >
              <template slot="title">
                <span>111111</span>
              </template>
              <div class="tooltip-icon">
                <icon-svg icon-class="icon-warning" color="#1776FF"></icon-svg>
              </div>
            </a-tooltip>
          </div>
          <!-- 分割线 -->
          <div class="wrapper-split"></div>
          <!-- 图片内容 -->
          <div class="wrapper-content">
            <!-- 左侧圆环 -->
            <div class="wrapper-content-graph" v-if="!lastList.length">
              <img src="@/assets/images/img/noData.png" alt="" />
            </div>
            <div class="wrapper-content-graph" v-else>
              <div class="progress" v-for="item in lastList" :key="item.name">
                <span class="progress-label" :title="item.name">{{
                  item.name
                }}</span
                ><a-progress
                  :percent="(Number(item.value) / Number(lastListMax)) * 100"
                  :strokeWidth="16"
                  :showInfo="false"
                />
                <span class="progress-text short">{{ item.value }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 选择预算单位弹框 -->
    <a-modal
      class="budget-modal"
      :title="selectTreeTitle"
      :width="400"
      :visible="budgetShow"
      :closable="false"
      :destroyOnClose="true"
      @cancel="onCancel"
      @ok="onConfirm"
      :mask="false"
      centered
    >
      <div class="budget-modal-content">
        <a-tree-select
          v-model="choosedBudgetUnit"
          class="item-value"
          :tree-data="treeOptions"
          tree-checkable
          :show-checked-strategy="SHOW_PARENT"
          search-placeholder="请选择"
        />
      </div>
    </a-modal>
    <!-- 选择科目弹框 -->
    <a-modal
      class="budget-modal"
      :title="selectTreeTitle"
      :width="400"
      :visible="subjectShow"
      :closable="false"
      :destroyOnClose="true"
      @cancel="onCancel"
      @ok="onConfirm"
      :mask="false"
      centered
    >
      <div class="budget-modal-content">
        <a-tree-select
          v-model="subjectSelected"
          class="item-value"
          :tree-data="treeOptions"
          tree-checkable
          :show-checked-strategy="SHOW_PARENT"
          search-placeholder="请选择"
        />
      </div>
    </a-modal>
    <!-- 预算单位明细筛选 -->
    <FilterModal
      v-if="paramsOption1.length"
      filterTitle="预算单位明细筛选配置"
      :filterShow="filterShow1"
      :paramsOption="paramsOption1"
      :tableData="tableData1"
      @addTable3="addTable1"
      @delTable3="delTable1"
      @onFilterCancel="onFilterCancel1"
      @onFilterConfirm="onFilterConfirm1"
    ></FilterModal>

    <!-- 预算单位明细排序按钮 -->
    <SortModal
      v-if="sortOptions1.length"
      sortTitle="预算单位明细排序配置"
      :sortShow="sortShow1"
      @onSortCancel="onSortCancel1"
      @onSortConfirm="onSortConfirm1"
      :sortOptions="sortOptions1"
      firstSortName="当年执行率"
    ></SortModal>

    <!-- 项目分析明细筛选 -->
    <FilterModal
      v-if="paramsOption2.length"
      filterTitle="项目分析明细筛选配置"
      :filterShow="filterShow2"
      :paramsOption="paramsOption2"
      :tableData="tableData2"
      @onFilterCancel="onFilterCancel2"
      @onFilterConfirm="onFilterConfirm2"
      @addTable3="addTable2"
      @delTable3="delTable2"
    ></FilterModal>

    <!-- 项目分析明细排序按钮 -->
    <SortModal
      v-if="sortOptions2.length"
      sortTitle="项目分析明细排序配置"
      :sortShow="sortShow2"
      @onSortCancel="onSortCancel2"
      @onSortConfirm="onSortConfirm2"
      :sortOptions="sortOptions2"
      firstSortName="支出金额"
    ></SortModal>
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
// import { handleAddEchartsBackground } from "@/utils/echarts.js";
import FilterModal from "@/components/filterModal.vue";
import SortModal from "@/components/sortModal.vue";
import {
  getFinancialSubjectList,
  getFunctionSubjectList,
  getManageSpendGraphDataFive,
  getManageSpendGraphDataFour,
  getManageSpendGraphDataOne,
  getManageSpendGraphDataSix,
  getManageSpendGraphDataThree,
  getManageSpendGraphDataTwo,
  getManageSpendTableOne,
  getManageSpendTableOneFilter,
  getManageSpendTableOneSort,
  getManageSpendTableTwo,
  getManageSpendTableTwoFilter,
  getManageSpendTableTwoSort,
  getManageSpendTableTwoTotal,
  getManageSpendTopListOne,
  getManageSpendTopListThree,
  getManageSpendTopListTwo,
} from "@/shared/newApi/manage/manage.js";
import { findItemInTree, getMax, getYearStartEnd } from "@/utils/common.js";
import {
  Button,
  Progress,
  Radio,
  Select,
  Table,
  Tooltip,
  TreeSelect,
} from "ant-design-vue";

import { cloneDeep, isEqual } from "lodash";

const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const RadioGroup = Radio.Group;
import { mapMutations, mapState } from "vuex";
export default {
  name: "BlockHeader",
  data() {
    return {
      SHOW_PARENT,

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

      selectTreeTitle: "",
      //预算单位弹框
      budgetShow: false,
      //用户选择的预算单位
      choosedBudgetUnit: [],
      choosedBudgetUnitCopy: [],
      budgetOriginOptions: [],

      //科目弹框
      subjectShow: false,
      subjectSelected1: [],
      subjectSelected1Copy: [],
      subjectSelected2: [],
      subjectSelected2Copy: [],
      subjectOriginOptions1: [],
      subjectOriginOptions2: [],

      myChart1: null, //整体支出均衡性
      myChart2: null, //资金来源圆环
      myChart3: null, //资金来源堆叠柱状图
      myChart4: null, //矩形树图
      myChart5: null, //折线图
      myChart6: null, //折线图

      graphData1: {
        // legend: [
        //   "主管单位2",
        //   "预算单位1",
        //   "预算单位2",
        //   "预算单位3",
        //   "预算单位4",
        //   "预算单位5",
        //   "预算单位6",
        //   "预算单位7",
        //   "预算单位8",
        // ],
        // xAxis: [
        //   "一月",
        //   "二月",
        //   "三月",
        //   "四月",
        //   "五月",
        //   "六月",
        //   "七月",
        //   "八月",
        //   "九月",
        //   "十月",
        //   "十一月",
        //   "十二月",
        // ],
        // seriesData: [
        //   {
        //     name: "主管单位2",
        //     type: "manage",
        //     funds: "资金性质1",
        //     data: {
        //       totalMoney: 100,
        //       money: [8, 10, 7, 5, 9, 10, 5, 8, 7, 11, 10, 10],
        //       rate: [8, 10, 7, 5, 9, 10, 5, 8, 7, 11, 10, 10],
        //     },
        //   },
        //   {
        //     name: "预算单位1",
        //     type: "budget",
        //     funds: "某种性质",
        //     from: "主管单位2",
        //     data: {
        //       totalMoney: 100,
        //       money: [9, 8, 5, 10, 11, 7, 9, 6, 10, 10, 6, 9],
        //       rate: [9, 8, 5, 10, 11, 7, 9, 6, 10, 10, 6, 9],
        //     },
        //   },
        //   {
        //     name: "预算单位2",
        //     type: "budget",
        //     funds: "某种性质",
        //     from: "主管单位2",
        //     data: {
        //       totalMoney: 100,
        //       money: [10, 9, 8, 7, 8, 10, 9, 5, 8, 7, 9, 10],
        //       rate: [10, 9, 8, 7, 8, 10, 9, 5, 8, 7, 9, 10],
        //     },
        //   },
        //   {
        //     name: "预算单位3",
        //     type: "budget",
        //     funds: "某种性质",
        //     from: "主管单位2",
        //     data: {
        //       totalMoney: 100,
        //       money: [11, 6, 9, 8, 10, 7, 7, 12, 8, 9, 7, 69],
        //       rate: [11, 6, 9, 8, 10, 7, 7, 12, 8, 9, 7, 6],
        //     },
        //   },
        //   {
        //     name: "预算单位4",
        //     type: "budget",
        //     funds: "某种性质",
        //     from: "主管单位2",
        //     data: {
        //       totalMoney: 100,
        //       money: [8, 9, 10, 7, 6, 8, 10, 9, 10, 7, 9, 7],
        //       rate: [8, 9, 10, 7, 6, 8, 10, 9, 10, 7, 9, 7],
        //     },
        //   },
        //   {
        //     name: "预算单位5",
        //     type: "budget",
        //     funds: "某种性质",
        //     from: "主管单位2",
        //     data: {
        //       totalMoney: 100,
        //       money: [9, 8, 7, 10, 6, 11, 8, 7, 9, 9, 8, 8],
        //       rate: [9, 8, 7, 10, 6, 11, 8, 7, 9, 9, 8, 8],
        //     },
        //   },
        //   {
        //     name: "预算单位6",
        //     type: "budget",
        //     funds: "某种性质",
        //     from: "主管单位2",
        //     data: {
        //       totalMoney: 100,
        //       money: [7, 9, 10, 6, 12, 8, 7, 9, 10, 8, 6, 8],
        //       rate: [7, 9, 10, 6, 12, 8, 7, 9, 10, 8, 6, 8],
        //     },
        //   },
        //   {
        //     name: "预算单位7",
        //     type: "budget",
        //     funds: "某种性质",
        //     from: "主管单位2",
        //     data: {
        //       totalMoney: 100,
        //       money: [8, 10, 7, 9, 11, 6, 8, 10, 6, 7, 9, 9],
        //       rate: [8, 10, 7, 9, 11, 6, 8, 10, 6, 7, 9, 9],
        //     },
        //   },
        //   {
        //     name: "预算单位8",
        //     type: "budget",
        //     funds: "某种性质",
        //     from: "主管单位2",
        //     data: {
        //       totalMoney: 100,
        //       money: [1, 8, 9, 10, 6, 25, 7, 9, 8, 7, 8, 10],
        //       rate: [1, 8, 9, 10, 6, 25, 7, 9, 8, 7, 8, 10],
        //     },
        //   },
        // ],
      },

      // 图2资金来源圆环
      graphData2: {
        // total: 2400,
        // seriesData: [
        //   {
        //     value: 1048,
        //     name: "国有资本经营预算",
        //   },
        //   {
        //     value: 735,
        //     name: "社会保险基金预算",
        //   },
        //   { value: 580, name: "一般公共预算" },
        //   { value: 456, name: "政府性基金预算" },
        // ],
      },

      //图3归一化柱状图
      graphData3: {
        // legend: ["一般公共预算", "社保基金预算", "政府性预算基金"],
        // xAxis: ["2020", "2021", "2022", "2023", "2024"],
        // seriesData: [
        //   {
        //     name: "一般公共预算",
        //     rate: [0.4, 0.2, 0.5, 0.1, 0.3],
        //     money: [100, 200, 500, 100, 300],
        //   },
        //   {
        //     name: "社保基金预算",
        //     rate: [0.4, 0.3, 0.4, 0.6, 0.2],
        //     money: [400, 300, 400, 600, 200],
        //   },
        //   {
        //     name: "政府性预算基金",
        //     rate: [0.2, 0.5, 0.1, 0.3, 0.5],
        //     money: [200, 500, 100, 300, 500],
        //   },
        // ],
      },

      //图4矩形树图
      graphData4: {
        // seriesData: [
        //   //数据
        //   {
        //     name: "功能科目一",
        //     value: 50,
        //     rate: "50%",
        //     children: [
        //       //数据集
        //       { name: "Hello", value: 7, year: 2023, rate: "7%" },
        //       { name: "World", value: 8, year: 2023, rate: "8%" },
        //       { name: "This", value: 15, year: 2023, rate: "15%" },
        //       { name: "is", value: 20, year: 2023, rate: "20%" },
        //     ],
        //   },
        //   {
        //     name: "功能科目二",
        //     value: 30,
        //     year: 2023,
        //     rate: "30%",
        //     children: [
        //       //数据集
        //       {
        //         name: "Hello",
        //         value: 18,
        //         year: 2023,
        //         rate: "18%",
        //         children: [
        //           //数据集
        //           { name: "Hello", value: 8, year: 2023, rate: "8%" },
        //           { name: "World", value: 10, year: 2023, rate: "10%" },
        //         ],
        //       },
        //       { name: "World", value: 5, year: 2023, rate: "5%" },
        //       { name: "This", value: 3, year: 2023, rate: "3%" },
        //       { name: "is", value: 4, year: 2023, rate: "4%" },
        //     ],
        //   },
        //   {
        //     name: "功能科目三",
        //     value: 20,
        //     year: 2023,
        //     rate: "20%",
        //     children: [
        //       //数据集
        //       { name: "Hello", value: 7, year: 2023, rate: "7%" },
        //       { name: "World", value: 13, year: 2023, rate: "13%" },
        //     ],
        //   },
        // ],
      },

      //图5折线图
      graphData5: {
        // legend: ["科目一", "科目二", "科目三", "科目四"],
        // xAxis: ["2019", "2020", "2021", "2022", "2023"],
        // seriesData: [
        //   {
        //     name: "科目一",
        //     data: {
        //       money: [8, 10, 7, 5, 9],
        //       rate: [8, 10, 7, 5, 9],
        //     },
        //   },
        //   {
        //     name: "科目二",
        //     data: {
        //       money: [9, 8, 5, 10, 11],
        //       rate: [9, 8, 5, 10, 11],
        //     },
        //   },
        //   {
        //     name: "科目三",
        //     data: {
        //       money: [10, 9, 8, 7, 8],
        //       rate: [10, 9, 8, 7, 8],
        //     },
        //   },
        //   {
        //     name: "科目四",
        //     data: {
        //       money: [11, 6, 9, 8, 10],
        //       rate: [11, 6, 9, 8, 10],
        //     },
        //   },
        // ],
      },

      //图6折线图
      graphData6: {
        // legend: ["xx公司1", "xx公司2", "xx公司3", "xx公司4", "xx公司5"],
        // xAxis: ["2019", "2020", "2021", "2022", "2023"],
        // seriesData: [
        //   {
        //     name: "xx公司1",
        //     data: [8, 10, 7, 5, 9],
        //   },
        //   {
        //     name: "xx公司2",
        //     data: [9, 8, 5, 10, 11],
        //   },
        //   {
        //     name: "xx公司3",
        //     data: [10, 9, 8, 7, 8],
        //   },
        //   {
        //     name: "xx公司4",
        //     data: [11, 6, 9, 8, 10],
        //   },
        //   {
        //     name: "xx公司5",
        //     data: [11, 21, 9, 24, 10],
        //   },
        // ],
      },

      //选择科目类别单选按钮
      subjectType: 0,
      subjectChose: [
        {
          label: "按经济科目",
          value: 0,
        },
        {
          label: "按功能科目",
          value: 1,
        },
      ],

      moneyList: [
        // {
        //   name: "xxx单位",
        //   value: 20,
        //   money: 1000,
        // },
        // {
        //   name: "xxxx单位",
        //   value: 20,
        //   money: 1000,
        // },
        // {
        //   name: "xxxxx单位",
        //   value: 20,
        //   money: 1000,
        // },
        // {
        //   name: "xxxxxx单位",
        //   value: 20,
        //   money: 1000,
        // },
        // {
        //   name: "xxxxxxx单位",
        //   value: 20,
        //   money: 1000,
        // },
      ],
      moneyListMax: 1, //排行里面的金额最大值
      addList: [
        // {
        //   name: "xxx单位",
        //   value: 20,
        // },
        // {
        //   name: "xxxx单位",
        //   value: 20,
        // },
        // {
        //   name: "xxxxx单位",
        //   value: 20,
        // },
        // {
        //   name: "xxxxxx单位",
        //   value: 20,
        // },
        // {
        //   name: "xxxxxxx单位",
        //   value: 20,
        // },
      ],
      addListMax: 1,

      lastList: [
        // {
        //   name: "xxx单位",
        //   value: 20,
        // },
        // {
        //   name: "xxxx单位",
        //   value: 20,
        // },
        // {
        //   name: "xxxxx单位",
        //   value: 20,
        // },
        // {
        //   name: "xxxxxx单位",
        //   value: 20,
        // },
        // {
        //   name: "xxxxxxx单位",
        //   value: 20,
        // },
      ],
      lastListMax: 1,

      columns1: [
        {
          title: "预算单位",
          dataIndex: "ysdw",
          key: "ysdw",
          width: 150,
        },
        {
          title: "当年项目数量",
          dataIndex: "dnxmsl",
          key: "dnxmsl",
          width: 90,
          align: "center",
        },
        {
          title: "当年支出金额(万元)",
          dataIndex: "dnzcje",
          key: "dnzcje",
          width: 115,
          align: "center",
        },
        {
          title: "当年预算金额(万元)",
          dataIndex: "dnysje",
          key: "dnysje",
          width: 115,
          align: "center",
        },
        {
          title: "当年执行率",
          dataIndex: "dnzxl",
          key: "dnzxl",
          width: 84,
          align: "center",
          scopedSlots: { customRender: "dnzxl" },
        },
        {
          title: "当前人员数量",
          dataIndex: "dnrysl",
          key: "dnrysl",
          width: 90,
          align: "center",
        },
        {
          title: "当年人均支出金额(万元)",
          dataIndex: "dnrjzcje",
          key: "dnrjzcje",
          width: 105,
          align: "center",
        },
        {
          dataIndex: "",
          key: "",
          slots: { title: "graphTrendTitle" },
          width: 480,
          scopedSlots: { customRender: "graphTrend" },
        },
      ],
      tableLoading1: false,
      dataSource1: [
        // {
        //   ysdw: "单位1",
        //   dnxmsl: 10,
        //   dnzcje: 1000,
        //   dnysje: 1000,
        //   dnzxl: 10,
        //   dnrysl: 10,
        //   dnrjzcje: 10,
        //   wnqs: {
        //     // 近五年趋势，包括五年支出金额、执行率、项目数量
        //     xAxis: ["2020", "2021", "2022", "2023", "2024"],
        //     seriesData: [
        //       {
        //         name: "变化趋势",
        //         money: [8, 10, 7, 5, 9], // 支出金额
        //         rate: [8, 10, 7, 5, 9], // 比率
        //         excuteRate: [1, 1, 1, 1, 1], // 执行率
        //         projectNumber: [2, 2, 2, 2, 2], // 项目数量
        //       },
        //     ],
        //   },
        // },
        // {
        //   ysdw: "单位2",
        //   dnxmsl: 10,
        //   dnzcje: 1000,
        //   dnysje: 1000,
        //   dnzxl: 10,
        //   dnrysl: 10,
        //   dnrjzcje: 10,
        //   wnqs: {
        //     // 近五年趋势，包括五年支出金额、执行率、项目数量
        //     xAxis: ["2020", "2021", "2022", "2023", "2024"],
        //     seriesData: [
        //       {
        //         name: "变化趋势",
        //         money: [8, 10, 7, 5, 9], // 支出金额
        //         rate: [8, 10, 7, 5, 9], // 比率
        //         excuteRate: [1, 1, 1, 1, 1], // 执行率
        //         projectNumber: [2, 2, 2, 2, 2], // 项目数量
        //       },
        //     ],
        //   },
        // },
      ],
      columns2: [
        {
          title: "项目类型",
          dataIndex: "xmlx",
          key: "xmlx",
          width: 210,
        },
        {
          title: "预算单位",
          dataIndex: "ysdw",
          key: "ysdw",
          width: 300,
        },
        {
          title: "项目名称",
          dataIndex: "xmmc",
          key: "xmmc",
          width: 200,
          scopedSlots: { customRender: "xmmc" },
        },
        // {
        //   title: "采购方式",
        //   dataIndex: "cgfs",
        //   key: "cgfs",
        //   width: 90,
        // },
        // {
        //   title: "收款人",
        //   dataIndex: "skr",
        //   key: "skr",
        //   width: 160,
        // },
        // {
        //   title: "经济科目",
        //   dataIndex: "jjkm",
        //   key: "jjkm",
        //   width: 160,
        // },
        {
          title: "支出金额(万元)",
          dataIndex: "zcje",
          key: "zcje",
          width: 520,
          scopedSlots: { customRender: "zcje" },
        },
        // {
        //   title: "预算金额(万元)",
        //   dataIndex: "ysje",
        //   key: "ysje",
        //   width: 200,
        //   scopedSlots: { customRender: "ysje" },
        // },
        // {
        //   title: "执行率",
        //   dataIndex: "zxl",
        //   key: "zxl",
        //   width: 319,
        //   scopedSlots: { customRender: "zxl" },
        // },
      ],
      tableLoading2: false,
      dataSource2: [
        // {
        //   xmlx: "test",
        //   ysdw: "单位1",
        //   xmmc: 10,
        //   cgfs: 1000,
        //   skr: 1000,
        //   jjkm: 10,
        //   zcje: 10,
        //   ysje: 10,
        //   ysjeRate: 10,
        //   zxl: 10,
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
          this.getManageSpendTable2("repeat");
        },
        onShowSizeChange: (current, size) => {
          this.pagination2.current = 1;
          this.pagination2.pageSize = size;
          this.getManageSpendTable2("repeat");
        },
      },
      maxZcje: Infinity,

      trendType: "money",

      //预算单位明细排序
      sortShow1: false,
      //排序选项
      sortOptions1: [],
      //预算单位明细筛选
      filterShow1: false,
      paramsOption1: [],
      filterString1: "",
      sortString1: "",
      tableData1: [
        // {
        //   id: "1",
        //   name: "字段一",
        //   compare: "等于",
        //   value: "1234",
        // },
      ],

      //项目分析明细排序
      sortShow2: false,
      //排序选项
      sortOptions2: [],
      //项目分析明细筛选
      filterShow2: false,
      paramsOption2: [],
      filterString2: "",
      sortString2: "",
      tableData2: [
        // {
        //   id: "1",
        //   name: "字段一",
        //   compare: "等于",
        //   value: "1234",
        // },
      ],

      subjectOptions: [],
      functionOptions: [],
    };
  },
  computed: {
    ...mapState("blockAnalysis", ["blockChoosedYear"]),
    ...mapState("managePortrait", [
      "treeData",
      "curTreeItem",
      "configParams",
      "curTreeItemFather",
    ]),
    treeOptions() {
      if (this.selectTreeTitle === "预算单位选择") {
        return this.curTreeItem.children.map((item) => ({
          title: item.title,
          value: item.title,
          key: item.title,
        }));
      } else {
        if (this.subjectType == 0) {
          return this.subjectOptions;
        } else {
          return this.functionOptions;
        }
      }
    },
    subjectSelected: {
      get() {
        if (this.subjectType == 0) {
          return this.subjectSelected1;
        } else {
          return this.subjectSelected2;
        }
      },
      set(val) {
        if (this.subjectType == 0) {
          this.subjectSelected1 = val;
        } else {
          this.subjectSelected2 = val;
        }
      },
    },
    newConfigParams() {
      return cloneDeep(this.configParams);
    },
    yearRange() {
      return getYearStartEnd(this.curYearConfirm);
    },
  },
  components: {
    AButton: Button,
    AProgress: Progress,
    ATable: Table,
    ATooltip: Tooltip,
    ATreeSelect: TreeSelect,
    ARadio: Radio,
    ARadioGroup: RadioGroup,
    ASelect: Select,
    SortModal,
    FilterModal,
  },
  mounted() {
    window.goPayDetail = this.goPayDetail;
    window.goBudgetPortrait = this.goBudgetPortrait;
    this.getAllData("init");

    // 开发环境放开注释
    // this.getTrendEcharts();
    // this.initEcharts1();
    // this.initEcharts2();
    // this.initEcharts3();
    // this.initEcharts4();
    // this.initEcharts5();
    // this.initEcharts6();
  },
  watch: {
    trendType() {
      this.getTrendEcharts(this.trendType);
    },
    subjectType() {
      this.getManageSpendGraphData4();
      this.getManageSpendGraphData5("init");
    },
    newConfigParams: {
      async handler(newVal, oldVal) {
        console.log("bingo!!!!!!", newVal, oldVal);
        if (newVal.curYear !== oldVal.curYear) {
          await this.getAllData();
        } else if (!isEqual(newVal.fundType, oldVal.fundType)) {
          await this.getManageSpendGraphData1();
        }
        if (newVal.ratioNumber !== oldVal.ratioNumber) {
          this.handleRatioChange();
        }
      },
      deep: true,
    },
    curTreeItem: {
      async handler(newVal, oldVal) {
        console.log("主管单位curTreeItem changed", newVal, oldVal);
        if (newVal.key) {
          this.getAllData();
        }
      },
      deep: true,
    },
  },
  methods: {
    ...mapMutations("blockAnalysis", {
      setChoosedBlockName: "setChoosedBlockName",
      setChoosedBlockId: "setChoosedBlockId",
    }),

    //跳转到预算明细页面
    goBudgetPortrait(name) {
      this.$router.push({
        name: "budgetPortrait",
        query: { key: name, type: "title" },
      });
    },

    // 跳转到支出明细
    goPayDetail(timeStart, timeEnd, manage, source, funcSub, finanSub, budget) {
      this.setChoosedBlockId([]);
      this.setChoosedBlockName([]);
      //开始时间+结束时间+主管单位+资金来源+功能科目+经济科目+预算单位
      // const queryParams = this.queryParams;
      const params = {
        time: [timeStart, timeEnd],
        manage: manage,
        budget: budget,
        source: source,
        funcSub: funcSub,
        finanSub: finanSub,
      };
      // this.$router.push({
      //   name: "payDetail",
      //   params: { id: 1 },
      // });
      this.$router.push({
        path: "/block-analysis/pay-detail",
        query: params,
      });
    },

    async getAllData(type) {
      // type: "init"： mounted进来
      if (!this.curTreeItem.key) return;
      await this.getManageSpendGraphData1("init");
      await this.getManageSpendGraphData2();
      await this.getManageSpendGraphData3();
      await this.getManageSpendGraphData4();
      await this.getManageSpendGraphData5("init");
      await this.getManageSpendGraphData6();
      if (type !== "init") {
        await this.getManageSpendTable1();
      }
      await this.getManageSpendTableOneSort();
      await this.getManageSpendTableOneFilter();
      if (type !== "init") {
        await this.getManageSpendTable2();
      }
      this.getManageSpendTable2Total();
      await this.getManageSpendTableTwoSort();
      await this.getManageSpendTableTwoFilter();
      await this.getManageSpendTopListOne();
      await this.getManageSpendTopListTwo();
      await this.getManageSpendTopListThree();
      await this.getFinancialSubjectList();
      await this.getFunctionSubjectList();
      this.getTrendEcharts();
    },
    //均衡性比例修改
    handleRatioChange() {
      console.log(
        "🚀 ~ handleRatioChange ~ handleRatioChange:",
        this.configParams
      );
      // 高亮大于等于均衡值的节点
      this.graphData1.seriesData.map((item1, index1) => {
        item1.data.rate.map((item2, index2) => {
          if (
            item2 !== null &&
            item2 !== undefined &&
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
    addTable1(json) {
      this.tableData1 = [...this.tableData1, json];
    },
    //筛选：增加
    delTable1(arr) {
      this.tableData1 = arr;
    },
    onFilterCancel1() {
      this.filterShow1 = false;
    },
    onFilterConfirm1(filterString) {
      this.filterString1 = filterString;
      this.getManageSpendTable1();
      this.getTrendEcharts();
      this.onFilterCancel1();
    },
    onSortCancel1() {
      this.sortShow1 = false;
    },
    onSortConfirm1(sortString) {
      this.sortString1 = sortString;
      this.getManageSpendTable1();
      this.getTrendEcharts();
      this.onSortCancel1();
    },
    addTable2(json) {
      this.tableData2 = [...this.tableData2, json];
    },
    //筛选：增加
    delTable2(arr) {
      this.tableData2 = arr;
    },
    onFilterCancel2() {
      this.filterShow2 = false;
    },
    onFilterConfirm2(filterString) {
      this.filterString2 = filterString;
      this.getManageSpendTable2();
      this.onFilterCancel2();
    },
    onSortCancel2() {
      this.sortShow2 = false;
    },
    onSortConfirm2(sortString) {
      this.sortString2 = sortString;
      this.getManageSpendTable2();
      this.onSortCancel2();
    },
    //控制图1预算单位弹框内部相关文字
    handleChooseBudget() {
      this.budgetShow = true;
      this.selectTreeTitle = "预算单位选择";
    },
    //控制图4 5科目弹框内部相关文字
    handleChooseSubject() {
      this.subjectShow = true;
      if (this.subjectType === 0) {
        this.selectTreeTitle = "经济科目选择";
      } else {
        this.selectTreeTitle = "功能科目选择";
      }
    },
    onReset1() {
      this.choosedBudgetUnit = this.budgetOriginOptions;
      this.choosedBudgetUnitCopy = this.budgetOriginOptions;
      this.getManageSpendGraphData1();
    },
    onReset2() {
      if (this.subjectType === 0) {
        this.subjectSelected1 = this.subjectOriginOptions1;
        this.subjectSelected1Copy = this.subjectOriginOptions1;
      } else {
        this.subjectSelected2 = this.subjectOriginOptions2;
        this.subjectSelected2Copy = this.subjectOriginOptions2;
      }
      this.getManageSpendGraphData5();
    },

    //预算单位选择弹框
    onCancel() {
      this.budgetShow = false;
      this.subjectShow = false;
      this.choosedBudgetUnit = this.choosedBudgetUnitCopy;
      this.subjectSelected1 = this.subjectSelected1Copy;
      this.subjectSelected2 = this.subjectSelected2Copy;
    },

    onConfirm() {
      this.choosedBudgetUnitCopy = this.choosedBudgetUnit;
      this.subjectSelected1Copy = this.subjectSelected1;
      this.subjectSelected2Copy = this.subjectSelected2;
      if (this.selectTreeTitle === "预算单位选择") {
        this.getManageSpendGraphData1();
      } else {
        this.getManageSpendGraphData5();
      }
      this.onCancel();
    },

    //跳转主管单位？？
    getManageSpend() {
      //
    },

    // 图1整体支出均衡性折线图表展示
    initEcharts1() {
      //联动需要先clear
      if (this.myChart1) {
        this.myChart1.dispose();
      }
      this.myChart1 = this.$echarts.init(this.$refs.graph1);

      const _that = this;
      //整体支出均衡性

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
              <div> 预算单位名称：${
                _that.graphData1.seriesData[params.seriesIndex].name
              }</div>
              <div> 年份：${_that.configParams.curYear}年</div>
              <div> 月份：${params.name}月</div>
              <div>年度支出金额：${Number(
                _that.graphData1.seriesData[params.seriesIndex].data.totalMoney
              ).toLocaleString()}万元</div>
              <a>月度支出金额：${Number(
                _that.graphData1.seriesData[params.seriesIndex].data.money[
                  params.dataIndex
                ]
              ).toLocaleString()}万元</a>
              <div>占比：${Number(params.data).toFixed(2)}%</div>
            </div>`;
          },
        },
        legend: {
          type: "plain",
          data: this.graphData1.legend,
          selected: {},
          padding: [5, 20, 5, 20],
          selector: [
            {
              type: "all",
              title: "全选",
            },
            {
              type: "inverse",
              title: "全不选",
            },
          ],
          selectorLabel: {
            color: "#fff",
            backgroundColor: "#1890ff",
            borderWidth: 0,
            fontSize: 10,
            padding: [4, 6],
          },
          emphasis: {
            selectorLabel: {
              backgroundColor: "#40a9ff",
            },
          },
          textStyle: {
            width: 100,
            overflow: "truncate",
          },
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
        series: this.graphData1.seriesData.map((item, index) => {
          return {
            type: "line",
            // stack: "total",
            name: item.name || item.from,
            data: item.data.rate,
            lineStyle: {
              width: 1.5, // 设置线条的粗细，表示1.5个像素
              opacity: 1,
            },
            color: this.lineColor[index],
            label: {
              show: true,
              position: "top",
              formatter: function (params) {
                const ratio = params.value;
                return Number(ratio).toFixed(2) + "%";
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
              label: {
                show: true,
                color: "red",
              },
              scale: 1.5,
            },
            symbolSize: 10,
          };
        }),
      };
      this.myChart1.setOption(option1);
      this.myChart1.showLoading();

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
        const updatedSeries = _that.myChart1
          .getOption()
          .series.map(function (series, index) {
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
      //图表背景色
      // handleAddEchartsBackground(this.myChart1, option1, this.graphData1.xAxis);
    },

    // 图2圆环展示
    initEcharts2() {
      //联动需要先clear
      if (this.myChart2) {
        this.myChart2.dispose();
      }
      this.myChart2 = this.$echarts.init(this.$refs.graph2);
      const option2 = {
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove",
          enterable: true,
          //triggerOn: "click", // 设置触发方式为点击
          formatter: (params) => {
            const name = params.data.name;
            const value = params.data.value;
            if (params.seriesName.length === 0) {
              return ""; // 没有数据时，不显示 tooltip
            }
            return `<div class="ratio-tooltip-box" style="pointer-events:auto">
              <div>资金性质：${name}</div>
              <div>金额：${value}万元</div>
              <div>占比：${params.percent}%</div>
            </div>`;
          },
        },
        series: [
          {
            type: "pie",
            radius: ["50%", "80%"],
            center: ["50%", "50%"],
            data: this.graphData2.seriesData,
            color: [
              this.lineColor[0],
              this.lineColor[1],
              this.lineColor[2],
              this.lineColor[3],
              this.lineColor[4],
            ],
            label: {
              position: "outer",
              alignTo: "edge",
              margin: 24,
              formatter: "{b}\n{c}万元\n{d}%",
            },
            //伸出的箭头
            labelLine: {
              //以下代码注释为实现：指示线颜色与扇形块颜色一致
              lineStyle: {
                color: "#97A3B7",
              },
              smooth: 0.2,
            },
          },
        ],
        graphic: [
          {
            //环形图中间添加文字
            type: "text", //通过不同top值可以设置上下显示
            left: "center",
            top: 120,
            style: {
              text: this.graphData2.total.toLocaleString(),
              textAlign: "center",
              fill: "#1C222B", //文字的颜色
              fontSize: 20,
              lineHeight: 24,
              fontWeight: 600,
            },
          },
          {
            //环形图中间添加文字
            type: "text", //通过不同top值可以设置上下显示
            left: "center",
            top: 150,
            style: {
              text: "资金总额  (万元)",
              textAlign: "center",
              fill: "##1C222B", //文字的颜色
              fontSize: 12,
              lineHeight: 20,
            },
          },
        ],
      };

      this.myChart2.setOption(option2);
      this.myChart2.on("click", function (params) {
        // todo
        // jump
        // 用户点击总额数字或图形上的某一个分类后，系统跳转进入【支出明细表】，并自动附带筛选条件【主管单位】【资金来源】【资金性质】【时间范围】
      });
    },

    //图3归一堆叠柱状图展示
    initEcharts3() {
      if (this.myChart3) {
        this.myChart3.dispose();
      }
      this.myChart3 = this.$echarts.init(this.$refs.graph3);
      const _that = this;
      const option3 = {
        tooltip: {
          //trigger: "axis",
          enterable: true,
          triggerOn: "mousemove",
          // triggerOn: "click", // 设置触发方式为点击
          formatter: function (params) {
            if (params.seriesName.length === 0) {
              return ""; // 没有数据时，不显示 tooltip
            }

            return `<div class="ratio-tooltip-box" style="pointer-events:auto">
              <div>年份：${_that.graphData3.xAxis[params.dataIndex]}</div>
              <div>资金性质：${params.seriesName}</div>
              <div>支出金额：${
                _that.graphData3.seriesData[params.seriesIndex].money[
                  params.dataIndex
                ]
              }万元</div>
              <div>占比：${params.value}%</div>
            </div>`;
          },
        },
        legend: {
          data: this.graphData3.legend,
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
            data: this.graphData3.xAxis,
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

      // 年度数据
      for (let i = 0; i < this.graphData3.seriesData.length; i++) {
        option3.series.push({
          type: "bar",
          stack: "total",
          barWidth: "35%",
          label: {
            show: true,
            formatter: function (params) {
              return Number(params.value).toFixed(2) + "%";
            },
          },
          name: this.graphData3.seriesData[i].name,
          data: this.graphData3.seriesData[i].rate,
          color: this.lineColor[i],
        });
      }

      this.myChart3.setOption(option3);
      //jump
      // 提供图表穿透功能：用户点击图形上的某一个分类后，系统跳转进入【支出明细表】，并自动附带筛选条件【主管单位】【资金来源】【资金性质】【时间范围】。
      this.myChart3.on("click", (params) => {
        // todo
        // this.$router.push({
        //   name: "payDetail",
        //   params: {
        //     /* optional params */
        //   },
        // });
      });
    },

    //图4矩形树图展示
    initEcharts4() {
      if (this.myChart4) {
        this.myChart4.dispose();
      }
      const _that = this;
      this.myChart4 = this.$echarts.init(this.$refs.graph4);
      const option4 = {
        tooltip: {
          enterable: true,
          formatter: function (params) {
            const paramsYear = getYearStartEnd(_that.configParams.curYear);
            if (_that.subjectType === 0) {
              return `<div class="ratio-tooltip-box" style="pointer-events:auto">
              <div>年份：${_that.configParams.curYear}</div>
              <div>经济科目：${params.data.name}</div>
              <div>占比：${params.data.rate}%</div>
              <a style="cursor:pointer;" onClick="goPayDetail('${paramsYear[0]}','${paramsYear[1]}',null,null,null,'${params.data.name}')">支出金额：${params.data.value}万元</a>
            </div>`;
            } else {
              return `<div class="ratio-tooltip-box" style="pointer-events:auto">
              <div>年份：${_that.configParams.curYear}</div>
              <div>功能科目：${params.data.name}</div>
              <div>占比：${params.data.rate}%</div>
              <a style="cursor:pointer;" onClick="goPayDetail('${paramsYear[0]}','${paramsYear[1]}',null,null,'${params.data.name}')">支出金额：${params.data.value}万元</a>
            </div>`;
            }
          },
        },
        series: [
          {
            name: "全部",
            type: "treemap",
            visibleMin: 300, // 如果某个节点的矩形的面积，小于这个数值（单位：px平方），这个节点就不显示
            width: "100%",
            height: "86%",
            leafDepth: 1,
            roam: false,
            label: {
              formatter: function (params) {
                if (params.data.name.length < 6) {
                  return (
                    params.data.name +
                    "\n\n" +
                    "占比：" +
                    params.data.rate +
                    "%"
                  );
                } else {
                  return (
                    params.data.name.slice(0, 5) +
                    "..." +
                    "\n\n" +
                    "占比：" +
                    params.data.rate +
                    "%"
                  );
                }
              },
            },
            levels: [
              // 第一个层级的配置
              {
                // 设置每个矩形的边框样式
                itemStyle: {
                  borderColor: "#fff", // 边框颜色
                  borderWidth: 1, // 边框宽度
                  gapWidth: 1, // 矩形之间的间隔宽度
                },
                // 设置上方标签的显示方式
                upperLabel: {
                  show: false, // 是否显示上方标签
                },
              },
              // 第二个层级的配置
              {
                // 设置每个矩形的边框样式
                itemStyle: {
                  borderColor: "#fff", // 边框颜色
                  borderWidth: 1, // 边框宽度
                  gapWidth: 1, // 矩形之间的间隔宽度
                },
                // 设置上方标签的显示方式
                upperLabel: {
                  show: false, // 是否显示上方标签
                },
              },
              // 第二个层级的配置
              {
                // 设置每个矩形的边框样式
                itemStyle: {
                  borderColor: "#fff", // 边框颜色
                  borderWidth: 1, // 边框宽度
                  gapWidth: 1, // 矩形之间的间隔宽度
                },
                // 设置上方标签的显示方式
                upperLabel: {
                  show: false, // 是否显示上方标签
                },
              },
              // 第二个层级的配置
              {
                // 设置每个矩形的边框样式
                itemStyle: {
                  borderColor: "#fff", // 边框颜色
                  borderWidth: 1, // 边框宽度
                  gapWidth: 1, // 矩形之间的间隔宽度
                },
                // 设置上方标签的显示方式
                upperLabel: {
                  show: false, // 是否显示上方标签
                },
              },
            ],
            nodeClick: "none", //不移动
            data: _that.graphData4.seriesData,
          },
        ],
      };

      this.myChart4.setOption(option4);
      //jump
      // 提供图表穿透功能：用户点击图形上的某一个分类后，系统跳转进入【支出明细表】，并自动附带筛选条件【主管单位】【资金来源】【资金性质】【时间范围】。
      this.myChart4.on("click", (params) => {
        // todo
        // this.$router.push({
        //   name: "payDetail",
        //   params: {
        //     /* optional params */
        //   },
        // });
      });
    },

    //图5折线图
    initEcharts5() {
      if (this.myChart5) {
        this.myChart5.dispose();
      }
      const _that = this;
      this.myChart5 = this.$echarts.init(this.$refs.graph5);
      const option5 = {
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove",
          enterable: true,
          formatter: function (params) {
            console.log("🚀 ~ initEcharts5 ~ option5.tooltip.params:", params);
            return `<div class="ratio-tooltip-box" style="pointer-events:auto">
              <div>年份：${_that.configParams.curYear}</div>
              <a>${_that.subjectType === 0 ? "经济" : "功能"}科目：${
              _that.graphData5.seriesData[params.seriesIndex].name
            }</a>
              <div>占比：${
                _that.graphData5.seriesData[params.seriesIndex].data.rate[
                  params.dataIndex
                ]
              }%</div>
              <a style="cursor:pointer;">支出金额：${
                _that.graphData5.seriesData[params.seriesIndex].data.money[
                  params.dataIndex
                ]
              }万元</a>
            </div>`;
          },
        },
        legend: {
          data: this.graphData5.legend,
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
            data: this.graphData5.xAxis,
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
          name: "占比",
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
      for (let i = 0; i < this.graphData5.seriesData.length; i++) {
        option5.series.push({
          type: "line",
          // stack: "total",
          name: this.graphData5.seriesData[i].name,
          data: this.graphData5.seriesData[i].data.rate,
          lineStyle: {
            normal: {
              width: 1.5,
            },
          },
          color: this.lineColor[i],
        });
      }

      this.myChart5.setOption(option5);
      //jump
      // 提供图表穿透功能：用户点击图形上的某一个分类后，系统跳转进入【支出明细表】，并自动附带筛选条件【主管单位】【资金来源】【资金性质】【时间范围】。
      this.myChart5.on("click", (params) => {
        // todo
        // this.$router.push({
        //   name: "payDetail",
        //   params: {
        //     /* optional params */
        //   },
        // });
      });
    },

    //图6 TOP5趋势折线图
    initEcharts6() {
      if (this.myChart6) {
        this.myChart6.dispose();
      }
      this.myChart6 = this.$echarts.init(this.$refs.graph6);
      const option6 = {
        tooltip: {
          trigger: "axis",
          triggerOn: "mousemove",
          enterable: true,
        },
        legend: {
          data: this.graphData6.legend,
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
            data: this.graphData6.xAxis,
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
          name: "支出金额(万元)",
          minInterval: 1,
          axisLabel: {
            formatter: "{value}万元",
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
      for (let i = 0; i < this.graphData6.seriesData.length; i++) {
        option6.series.push({
          type: "line",
          // stack: "total",
          name: this.graphData6.seriesData[i].name,
          data: this.graphData6.seriesData[i].data,
          lineStyle: {
            normal: {
              width: 1.5,
            },
          },
          color: this.lineColor[i],
        });
      }

      this.myChart6.setOption(option6);
    },

    // 表格中绘制折线图
    getTrendEcharts(type = "money") {
      setTimeout(() => {
        this.dataSource1.forEach((item, index) => {
          let oldChart = this.$echarts.getInstanceByDom(
            this.$refs["chart" + index]
          );
          if (oldChart) {
            oldChart.dispose();
          }
          let myChart = this.$echarts.init(this.$refs["chart" + index]);
          const _that = this;
          const option = {
            grid: {
              top: 40,
              left: 0,
              bottom: 30,
              right: 0,
            },
            tooltip: {
              enterable: true,
              trigger: "axis",
              triggerOn: "mousemove", // 设置触发方式为悬停
              formatter: function (params) {
                const paramsYear = getYearStartEnd(params[0].axisValue);
                return `<div class="ratio-tooltip-box" style="pointer-events:auto">
                <a onClick="goBudgetPortrait('${
                  _that.dataSource1[index].ysdw
                }')">预算单位：${_that.dataSource1[index].ysdw}</a>
                <div>年份：${params[0].axisValue}年</div>
                <div>项目数量：${_that.dataSource1[index].dnxmsl}个</div>
                <a onClick="goPayDetail('${paramsYear[0]}','${
                  paramsYear[1]
                }','${_that.curTreeItem.title}',null,null,null,'${
                  _that.dataSource1[index].ysdw
                }')">支出金额：${Number(
                  _that.dataSource1[index].dnzcje
                ).toLocaleString()}万元</a>
                 <div>预算金额：${Number(
                   _that.dataSource1[index].dnysje
                 ).toLocaleString()} 万元</div>
                <div >执行率：${_that.dataSource1[index].dnzxl}%</div>
              </div>`;
                // let tooltipString =
                // `<div class="ratio-tooltip-box" style="pointer-events:auto">
                //   <div>年份：${params[0].name}</div>`;
                // if (type === "money") {
                //   tooltipString += `<div>金额：${params[0].data}万元</div>
                //     <div>占比：${
                //       item.wnqs.seriesData[params[0].seriesIndex].rate[
                //         params[0].dataIndex
                //       ]
                //     }%</div>`;
                // } else if (type === "excuteRate") {
                //   tooltipString += `<div>执行率：${params[0].data}%</div>`;
                // } else {
                //   tooltipString += `<div>项目数量：${params[0].data}个</div>`;
                // }
                // tooltipString += `</div>`;
                // return tooltipString;
              },
              confine: true,
              // position: function (point, params) {
              //   // console.log("tooltip参数point", point);
              //   // console.log("tooltip参数params", params[0]);
              //   // console.log("tooltip参数dom", dom);
              //   // console.log("tooltip参数rect", rect);
              //   // console.log("tooltip参数size", size);
              //   return params[0].dataIndex == 4
              //     ? [point[0] - 110, point[1] + 5]
              //     : [point[0] + 5, point[1] + 5];
              // },
            },
            xAxis: [
              {
                type: "category",
                data: item.wnqs.xAxis,
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

          for (let i = 0; i < item.wnqs.seriesData.length; i++) {
            option.series.push({
              type: "line",
              // stack: "Total",
              name: item.wnqs.seriesData[i].name,
              data: item.wnqs.seriesData[i][type],
              color: this.lineColor[i],
              label: {
                show: true,
                formatter: (params) => {
                  if (type === "money") {
                    return Number(params.data).toLocaleString() + "万元";
                  } else if (type === "excuteRate") {
                    if (
                      parseFloat(params.data) >=
                      parseFloat(
                        (_that.configParams.highExecutionRate * 100).toFixed(0)
                      )
                    ) {
                      return "{red|" + params.data + "%}";
                    } else if (
                      parseFloat(params.data) <=
                      parseFloat(
                        (_that.configParams.lowExecutionRate * 100).toFixed(0)
                      )
                    ) {
                      return "{green|" + params.data + "%}";
                    } else {
                      return `${params.data}%`;
                    }
                  } else {
                    return Number(params.data).toLocaleString() + "个";
                  }
                },
                rich: {
                  red: {
                    color: "red",
                  },
                  green: {
                    color: "#f28518",
                  },
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

    //获取echarts图：整体支出均衡性数据   折线
    async getManageSpendGraphData1(type) {
      const unitCodes =
        type === "init"
          ? null
          : this.choosedBudgetUnitCopy.map((text) => {
              console.log("🚀 ~ unitCodes ~ text:", text, this.treeData);
              const tree = findItemInTree(this.treeData, text, "title");
              console.log("🚀 ~ unitCodes ~ tree:", tree);

              return tree.key;
            });
      const json = {
        year: this.configParams.curYear,
        dept_code: this.curTreeItem.key,
        unit_code: unitCodes,
        fund_nature_code: this.configParams.fundType,
      };
      const res = await getManageSpendGraphDataOne(json);
      console.log("页面内 获取echarts图：整体支出均衡性数据   折线res", res);
      if (res.message === "成功") {
        console.log(
          "message成功 获取echarts图：整体支出均衡性数据   折线",
          res.data
        );
        this.graphData1 = res.data;

        if (!res.data.seriesData.length) {
          if (this.myChart1) {
            this.myChart1.dispose();
          }
          return;
        }
        if (!this.budgetOriginOptions.length || type === "init") {
          this.budgetOriginOptions = res.data.legend.slice(1);
        }
        this.choosedBudgetUnit = res.data.legend.slice(1);
        this.choosedBudgetUnitCopy = res.data.legend.slice(1);
        this.$nextTick(() => {
          this.initEcharts1();
          this.myChart1.hideLoading();
          this.handleRatioChange();
        });
      } else {
        this.$message.error(res.message);
      }
    },

    //获取echarts图：资金结构（按资金来源）   圆环
    async getManageSpendGraphData2() {
      const json = {
        year: this.configParams.curYear,
        dept_code: this.curTreeItem.key,
      };
      const res = await getManageSpendGraphDataTwo(json);
      console.log("页面内 获取echarts图：资金结构——按资金来源   圆环res", res);
      if (res.message === "成功") {
        console.log(
          "message成功 获取echarts图：资金结构——按资金来源   圆环",
          res.data
        );
        this.graphData2 = res.data;
        this.initEcharts2();
      } else {
        this.$message.error(res.message);
      }
    },

    //获取echarts图：资金结构（按资金来源）   堆叠柱状图
    async getManageSpendGraphData3() {
      const json = {
        year: this.configParams.curYear,
        dept_code: this.curTreeItem.key,
      };
      const res = await getManageSpendGraphDataThree(json);
      console.log(
        "页面内 获取echarts图：资金结构（按资金来源）   堆叠柱状图res",
        res
      );
      if (res.message === "成功") {
        console.log(
          "message成功 获取echarts图：资金结构（按资金来源）   堆叠柱状图",
          res.data
        );
        this.graphData3 = res.data;
        this.initEcharts3();
      } else {
        this.$message.error(res.message);
      }
    },

    //获取echarts图：资金结构——按科目   矩形树图
    async getManageSpendGraphData4() {
      const json = {
        dept_code: this.curTreeItem.key,
        year: this.configParams.curYear,
        flag: this.subjectType,
      };
      const res = await getManageSpendGraphDataFour(json);
      console.log(
        "页面内 获取echarts图：资金结构——按资金来源   矩形树图res",
        res
      );
      if (res.message === "成功") {
        console.log(
          "message成功 获取echarts图：资金结构——按资金来源   矩形树图",
          res.data
        );
        this.graphData4 = res.data;
        this.initEcharts4();
      } else {
        this.$message.error(res.message);
      }
    },

    //获取echarts图：资金结构——按科目   折线图
    async getManageSpendGraphData5(type) {
      const json = {
        flag: this.subjectType,
        dept_code: this.curTreeItem.key,
        subject_name:
          this.subjectType === 0
            ? this.subjectSelected1Copy
            : this.subjectSelected2Copy,
        nums: 8,
      };
      const res = await getManageSpendGraphDataFive(json);
      console.log(
        "页面内 获取echarts图：资金结构——按资金来源   折线图res",
        res
      );
      if (res.message === "成功") {
        console.log(
          "message成功 获取echarts图：资金结构——按资金来源   折线图",
          res.data
        );
        this.graphData5 = res.data;
        if (this.subjectType === 0) {
          this.subjectSelected1 = this.subjectOriginOptions1;
          this.subjectSelected1Copy = this.subjectOriginOptions1;
          if (!this.subjectOriginOptions1 || type === "init") {
            this.subjectOriginOptions1 = res.data.legend;
          }
        } else if (this.subjectType === 1) {
          this.subjectSelected2 = this.subjectOriginOptions2;
          this.subjectSelected2Copy = this.subjectOriginOptions2;
          if (!this.subjectOriginOptions2 || type === "init") {
            this.subjectOriginOptions2 = res.data.legend;
          }
        }
        this.initEcharts5();
      } else {
        this.$message.error(res.message);
      }
    },

    //获取echarts图：资金结构——资金TOP5趋势   折线图
    async getManageSpendGraphData6() {
      const json = {
        year: this.configParams.curYear,
        dept_code: this.curTreeItem.key,
      };
      const res = await getManageSpendGraphDataSix(json);
      console.log(
        "页面内 获取echarts图：资金结构——按资金来源   折线图res",
        res
      );
      if (res.message === "成功") {
        console.log(
          "message成功 获取echarts图：资金结构——按资金来源   折线图",
          res.data
        );
        this.graphData6 = res.data;
        this.initEcharts6();
      } else {
        this.$message.error(res.message);
      }
    },

    //获取预算单位明细表
    async getManageSpendTable1() {
      if (!this.curTreeItem.key) return;
      const json = {
        year: this.configParams.curYear,
        dept_code: this.curTreeItem.key,
        pageSize: 1000,
        pageOffset: 0,
        filterCondition: this.filterString1,
        odName: this.sortString1,
      };
      this.tableLoading1 = true;
      const res = await getManageSpendTableOne(json);
      console.log("页面内 获取预算单位明细表res", res);
      if (res.message === "成功") {
        console.log("message成功 获取预算单位明细表", res.data);
        this.dataSource1 = res.data;
        this.tableLoading1 = false;
      } else {
        this.$message.error(res.message);
      }
    },

    //预算单位明细简表-排序字段
    async getManageSpendTableOneSort() {
      this.sortOptions1 = []; //强制排序组件刷新
      const res = await getManageSpendTableOneSort();
      console.log("页面内 预算单位明细简表-排序字段res", res);
      if (res.message === "成功") {
        console.log("message成功 预算单位明细简表-排序字段", res.data);
        this.sortOptions1 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //预算单位明细简表-筛选字段
    async getManageSpendTableOneFilter() {
      this.paramsOption1 = [];
      const res = await getManageSpendTableOneFilter();
      console.log("页面内 预算单位明细简表-筛选字段res", res);
      if (res.message === "成功") {
        console.log("message成功 预算单位明细简表-筛选字段", res.data);
        this.paramsOption1 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },
    //获取项目分析明细表
    async getManageSpendTable2(type) {
      if (!this.curTreeItem.key) return;
      if (type !== "repeat") {
        this.$set(this.pagination2, "current", 1);
      }
      const json = {
        year: this.configParams.curYear,
        dept_code: this.curTreeItem.key,
        pageSize: this.pagination2.pageSize, //页面大小
        pageOffset: this.pagination2.pageSize * (this.pagination2.current - 1), //页面页码, //页面页码
        filterCondition: this.filterString2,
        odName: this.sortString2,
      };
      try {
        this.tableLoading2 = true;
        const res = await getManageSpendTableTwo(json);
        console.log("页面内 获取项目分析明细表res", res);
        if (res.message === "成功") {
          console.log("message成功 获取项目分析明细表", res.data);
          this.dataSource2 = res.data;
          this.tableLoading2 = false;
          this.maxZcje = getMax(this.dataSource2, "zcje");
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        console.log(error);
        this.tableLoading2 = false;
      } finally {
        this.tableLoading2 = false;
      }
    },
    async getManageSpendTable2Total() {
      try {
        const json = {
          year: this.configParams.curYear,
          dept_code: this.curTreeItem.key,
        };
        const res = await getManageSpendTableTwoTotal(json);
        console.log("页面内 获取项目分析明细表res-total", res);
        if (res.message === "成功") {
          console.log("message成功 获取项目分析明细表-total", res.data);
          this.pagination2.total = res.data[0] ? res.data[0].total : 0;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        console.log(error);
      }
    },

    //预算单位明细简表-排序字段
    async getManageSpendTableTwoSort() {
      this.sortOptions2 = [];
      const res = await getManageSpendTableTwoSort();
      console.log("页面内 预算单位明细简表-排序字段res", res);
      if (res.message === "成功") {
        console.log("message成功 预算单位明细简表-排序字段", res.data);
        this.sortOptions2 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //预算单位明细简表-筛选字段
    async getManageSpendTableTwoFilter() {
      this.paramsOption2 = [];
      const res = await getManageSpendTableTwoFilter();
      console.log("页面内 预算单位明细简表-筛选字段res", res);
      if (res.message === "成功") {
        console.log("message成功 预算单位明细简表-筛选字段", res.data);
        this.paramsOption2 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //排行榜——资金TOP5
    async getManageSpendTopListOne() {
      const json = {
        year: this.configParams.curYear,
        dept_code: this.curTreeItem.key,
      };
      const res = await getManageSpendTopListOne(json);
      console.log("页面内 排行榜——资金TOP5res", res);
      if (res.message === "成功") {
        console.log("message成功 排行榜——资金TOP5", res.data);
        let flag = false; // 是否含有有效数据
        for (let i = 0; i < res.data.length; i++) {
          const element = res.data[i];
          if (element.value || element.value == 0) {
            flag = true;
            break;
          }
        }
        this.moneyList = flag ? res.data : [];
        if (res.data.length) {
          const arr = this.moneyList.map((item) => item.money);
          this.moneyListMax = Math.max(...arr);
        }
      } else {
        this.$message.error(res.message);
      }
    },

    //排行榜——资金增长率TOP5
    async getManageSpendTopListTwo() {
      const json = {
        year: this.configParams.curYear,
        dept_code: this.curTreeItem.key,
      };
      const res = await getManageSpendTopListTwo(json);
      console.log("页面内 排行榜——资金增长率TOP5res", res);
      if (res.message === "成功") {
        console.log("message成功 排行榜——资金增长率TOP5", res.data);
        let flag = false; // 是否含有有效数据
        for (let i = 0; i < res.data.length; i++) {
          const element = res.data[i];
          if (element.value || element.value == 0) {
            flag = true;
            break;
          }
        }
        this.addList = flag ? res.data : [];
        if (res.data.length) {
          const arr = this.addList.map((item) => item.value);
          this.addListMax = Math.max(...arr);
        }
      } else {
        this.$message.error(res.message);
      }
    },

    //排行榜——资金执行率后5
    async getManageSpendTopListThree() {
      const json = {
        year: this.configParams.curYear,
        dept_code: this.curTreeItem.key,
      };
      const res = await getManageSpendTopListThree(json);
      console.log("页面内 排行榜——资金执行率后5res", res);
      if (res.message === "成功") {
        console.log("message成功 排行榜——资金执行率后5", res.data);
        let flag = false; // 是否含有有效数据
        for (let i = 0; i < res.data.length; i++) {
          const element = res.data[i];
          if (element.value || element.value == 0) {
            flag = true;
            break;
          }
        }
        this.lastList = flag ? res.data : [];
        if (res.data.length) {
          const arr = this.lastList.map((item) => item.value);
          this.lastListMax = Math.max(...arr);
        }
      } else {
        this.$message.error(res.message);
      }
    },

    async getFinancialSubjectList() {
      const res = await getFinancialSubjectList();
      if (res.message === "成功") {
        this.subjectOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },
    async getFunctionSubjectList() {
      const res = await getFunctionSubjectList();
      if (res.message === "成功") {
        this.functionOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },
  },
};
</script>
<style lang="less">
.ant-radio-group {
  display: flex;
  align-items: center;

  .ant-radio-wrapper {
    display: flex;
    align-items: center;
  }
}

.unit-spend {
  .ant-table-header-column {
    width: 100%;
  }
}

.slot-table-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.unit-spend {
  width: 100%;

  .graph-container {
    width: 100%;
    margin-bottom: 20px;

    &-wrapper {
      margin-top: 20px;
      width: 100%;
      height: 360px;
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

          .no-data {
            height: 80%;
            margin: 0 auto;
            display: block;
            margin-top: 30px;
          }

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
}

// 弹框
.budget-modal {
  &-content {
    .item-value {
      width: 100%;
    }
  }
}
</style>
