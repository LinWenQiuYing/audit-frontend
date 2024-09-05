<template>
  <div class="unit-no-tax">
    <div class="sub-title">非税收入数据概览</div>
    <div class="unit-no-tax-data">
      <div class="unit-no-tax-data-item">
        <div
          v-for="(item, index) in noTaxOverviewData"
          :key="index"
          class="unit-no-tax-unit"
        >
          <div class="unit-top">{{ item.typeName }}</div>
          <div class="unit-middle">{{ Number(item.num).toLocaleString() }}</div>
          <div class="unit-bottom">
            <span class="unit-bottom-title">同比 {{ item.percentage }}</span>
            <div class="unit-bottom-icon">
              <icon-svg
                icon-class="icon-up"
                color="#E31430"
                v-if="item.status === 1"
              />
              <icon-svg
                icon-class="icon-down"
                color="#1BB46D"
                v-else-if="item.status === 0"
              />
              <icon-svg icon-class="icon-down" color="#97A3B7" v-else />
            </div>
          </div>
          <div class="unit-icon">
            <icon-svg :icon-class="`${item.icon}`"></icon-svg>
          </div>
        </div>
      </div>
    </div>
    <!-- 非税收入分布表格 -->
    <div class="type-unit">
      <div class="sub-title">非税收入分布（按类型）</div>
      <div class="top-action">
        <!-- <a-button class="top-action-btn" @click="sortOne()">
          <div class="top-action-btn-icon">
            <icon-svg icon-class="排序"></icon-svg>
          </div>
          排序
        </a-button> -->
        <a-button class="top-action-btn" @click="filterOne()">
          <div class="top-action-btn-icon">
            <icon-svg icon-class="筛选"></icon-svg>
          </div>
          筛选
        </a-button>
        <!-- <a-button class="top-action-btn" @click="lookMoreTwo()">
          查看更多
        </a-button> -->
        <a-tooltip placement="topLeft" overlayClassName="wrapper-title-tooltip">
          <template slot="title">
            <span>111111</span>
          </template>
          <div class="tooltip-icon">
            <icon-svg icon-class="icon-warning" color="#1776FF"></icon-svg>
          </div>
        </a-tooltip>
      </div>
    </div>
    <a-table
      :columns="tableData1.columns1"
      :data-source="tableData1.dataSource1"
      :scroll="{ x: 'max-content', y: 600 }"
      :bordered="true"
      :pagination="false"
      class="type-unit-table"
    >
      <span slot="firstYear" slot-scope="text, record" style="display: flex">
        <a-progress
          :percent="record.firstYear.split('+')[0] * 1"
          size="small"
          :show-info="false"
          style="width: 50px"
        />
        <div style="margin-left: 8px">
          <span
            >{{
              record.firstYear.split("+")[0].includes("--")
                ? "--"
                : record.firstYear.split("+")[0] * 1
            }}%</span
          >,&nbsp;&nbsp;
          <span
            >{{
              record.firstYear.split("+")[1].includes("--")
                ? "--"
                : Number(record.firstYear.split("+")[1]).toLocaleString()
            }}万元</span
          >
        </div>
      </span>
      <span slot="secondYear" slot-scope="text, record" style="display: flex">
        <a-progress
          :percent="record.secondYear.split('+')[0] * 1"
          size="small"
          :show-info="false"
          style="width: 50px"
        />
        <div style="margin-left: 8px">
          <span
            >{{
              record.secondYear.split("+")[0].includes("--")
                ? "--"
                : record.secondYear.split("+")[0] * 1
            }}%</span
          >,&nbsp;&nbsp;
          <span
            >{{
              record.secondYear.split("+")[1].includes("--")
                ? "--"
                : Number(record.secondYear.split("+")[1]).toLocaleString()
            }}万元</span
          >
        </div>
      </span>
      <span slot="thirdYear" slot-scope="text, record" style="display: flex">
        <a-progress
          :percent="record.thirdYear.split('+')[0] * 1"
          size="small"
          :show-info="false"
          style="width: 50px"
        />
        <div style="margin-left: 8px">
          <span
            >{{
              record.thirdYear.split("+")[0].includes("--")
                ? "--"
                : record.thirdYear.split("+")[0] * 1
            }}%</span
          >,&nbsp;&nbsp;
          <span
            >{{
              record.thirdYear.split("+")[1].includes("--")
                ? "--"
                : Number(record.thirdYear.split("+")[1]).toLocaleString()
            }}万元</span
          >
        </div>
      </span>
      <span slot="forthYear" slot-scope="text, record" style="display: flex">
        <a-progress
          :percent="record.forthYear.split('+')[0] * 1"
          size="small"
          :show-info="false"
          style="width: 50px"
        />
        <div style="margin-left: 8px">
          <span
            >{{
              record.forthYear.split("+")[0].includes("--")
                ? "--"
                : record.forthYear.split("+")[0] * 1
            }}%</span
          >,&nbsp;&nbsp;
          <span
            >{{
              record.forthYear.split("+")[1].includes("--")
                ? "--"
                : Number(record.forthYear.split("+")[1]).toLocaleString()
            }}万元</span
          >
        </div>
      </span>
      <span slot="fifthYear" slot-scope="text, record" style="display: flex">
        <a-progress
          :percent="record.fifthYear.split('+')[0] * 1"
          size="small"
          :show-info="false"
          style="width: 50px"
        />
        <div style="margin-left: 8px">
          <span
            >{{
              record.fifthYear.split("+")[0].includes("--")
                ? "--"
                : record.fifthYear.split("+")[0] * 1
            }}%</span
          >,&nbsp;&nbsp;
          <span
            >{{
              record.fifthYear.split("+")[1].includes("--")
                ? "--"
                : Number(record.fifthYear.split("+")[1]).toLocaleString()
            }}万元</span
          >
        </div>
      </span>
    </a-table>

    <!-- 非税收入分布（按预算单位） -->
    <div class="type-unit">
      <div class="sub-title">非税收入分布（按预算单位）</div>
      <div class="top-action">
        <!-- <a-button class="top-action-btn" @click="sortTwo()">
          <div class="top-action-btn-icon">
            <icon-svg icon-class="排序"></icon-svg>
          </div>
          排序
        </a-button> -->
        <a-button class="top-action-btn" @click="filterTwo()">
          <div class="top-action-btn-icon">
            <icon-svg icon-class="筛选"></icon-svg>
          </div>
          筛选
        </a-button>
        <!-- <a-button class="top-action-btn" @click="lookMoreTwo()">
          查看更多
        </a-button> -->
        <a-tooltip placement="topLeft" overlayClassName="wrapper-title-tooltip">
          <template slot="title">
            <span>111111</span>
          </template>
          <div class="tooltip-icon">
            <icon-svg icon-class="icon-warning" color="#1776FF"></icon-svg>
          </div>
        </a-tooltip>
      </div>
    </div>
    <a-table
      bordered
      :columns="columns2"
      :data-source="tableDataTwo"
      :loading="tableLoading2"
      :pagination="false"
      class="type-unit-table"
      :scroll="{ x: 'max-content', y: 600 }"
    >
      <!-- :scroll="{ x: 'max-content', y: 'calc(100vh - 318px)' }" -->
      <!-- <template slot="budgetName" slot-scope="text">
        <a style="cursor: pointer">{{ text }}</a>
      </template> -->
      <div slot="graphTrendTitle" class="slot-table-header">
        <span>近五年趋势</span>
        <a-radio-group
          v-model="trendType"
          @change="handleTableTwoChange"
          style="margin-left: 214px"
        >
          <a-radio value="收入金额">收入金额</a-radio>
          <a-radio value="项目数量">项目数量</a-radio>
        </a-radio-group>
      </div>
      <span slot="num" slot-scope="text" style="display: flex">
        <!-- <div style="width: 100%; display: flex; justify-content: space-between">
          <div>{{ text.split("+")[1] * 1 }}%</div>
          <div>{{ text.split("+")[0] }}万元</div>
        </div> -->
        <a-progress
          :percent="text.split('+')[1] * 1"
          size="small"
          :show-info="false"
          style="width: 50px"
        />
        <div style="margin-left: 8px">
          <span
            >{{
              text.split("+")[1].includes("--") ? "--" : text.split("+")[1] * 1
            }}%</span
          >,&nbsp;&nbsp;
          <span
            >{{
              text.split("+")[0].includes("--")
                ? "--"
                : Number(text.split("+")[0]).toLocaleString()
            }}个</span
          >
        </div>
      </span>
      <span slot="money" slot-scope="text" style="display: flex">
        <!-- <div style="width: 100%; display: flex; justify-content: space-between">
          <div>{{ text.split("+")[1] * 1 }}%</div>
          <div>{{ text.split("+")[0] }}万元</div>
        </div> -->
        <a-progress
          :percent="text.split('+')[1] * 1"
          size="small"
          :show-info="false"
          style="width: 50px"
        />
        <div style="margin-left: 8px">
          <span
            >{{
              text.split("+")[1].includes("--") ? "--" : text.split("+")[1] * 1
            }}%</span
          >,&nbsp;&nbsp;
          <span
            >{{
              text.split("+")[0].includes("--")
                ? "--"
                : Number(text.split("+")[0]).toLocaleString()
            }}万元</span
          >
        </div>
      </span>
      <template slot="graphTrend" slot-scope="text, record">
        <div
          style="width: 100%; height: 100px"
          :ref="'chart2' + record.id"
        ></div>
      </template>
    </a-table>

    <!-- 三公支出分布（按项目） -->
    <div class="type-unit">
      <div class="sub-title">非税收入分布（按项目）</div>
      <div class="top-action">
        <a-button class="top-action-btn" @click="sortThree()">
          <div class="top-action-btn-icon">
            <icon-svg icon-class="排序"></icon-svg>
          </div>
          排序
        </a-button>
        <a-button class="top-action-btn" @click="filterThree()">
          <div class="top-action-btn-icon">
            <icon-svg icon-class="筛选"></icon-svg>
          </div>
          筛选
        </a-button>
        <!-- <a-button class="top-action-btn" @click="lookMoreTwo()">
          查看更多
        </a-button> -->
        <a-tooltip placement="topLeft" overlayClassName="wrapper-title-tooltip">
          <template slot="title">
            <span>111111</span>
          </template>
          <div class="tooltip-icon">
            <icon-svg icon-class="icon-warning" color="#1776FF"></icon-svg>
          </div>
        </a-tooltip>
      </div>
    </div>
    <a-table
      bordered
      :columns="columns3"
      :data-source="tableDataThree"
      :loading="tableLoading3"
      :pagination="false"
      class="type-unit-table"
      :scroll="{ x: 'max-content', y: 600 }"
    >
      <!-- :scroll="{ x: 'max-content', y: 'calc(100vh - 318px)' }" -->
      <!-- <template slot="budgetName" slot-scope="text">
        <a style="cursor: pointer">{{ text }}</a>
      </template> -->
      <span slot="data" slot-scope="text" style="display: flex">
        <!-- <div style="width: 100%; display: flex; justify-content: space-between">
          <div>{{ text.split("+")[1] * 1 }}%</div>
          <div>{{ text.split("+")[0] }}万元</div>
        </div> -->
        <a-progress
          :percent="text.split('+')[1] * 1"
          size="small"
          :show-info="false"
          style="width: 50px"
        />
        <div style="margin-left: 8px">
          <span
            :style="{
              color:
                parseFloat(text) >= parseFloat(configParams.highProjectRevenue)
                  ? '#ff4053'
                  : '',
            }"
          >
            <span
              >{{
                text.split("+")[1].includes("--")
                  ? "--"
                  : text.split("+")[1] * 1
              }}%</span
            >,&nbsp;&nbsp;
            <span
              >{{
                text.split("+")[0].includes("--")
                  ? "--"
                  : Number(text.split("+")[0]).toLocaleString()
              }}万元</span
            >
          </span>
        </div>
      </span>
      <template slot="graphTrend" slot-scope="text, record">
        <div
          style="width: 100%; height: 100px"
          :ref="'chart3' + record.id"
        ></div>
      </template>
    </a-table>

    <!-- 非税收入分布（按类型） 筛选 -->
    <FilterModal
      filterTitle="非税收入类型（按类型）筛选配置"
      :filterShow="filterShow1"
      :paramsOption="paramsOption1"
      :tableData="filterTableData1"
      @addTable3="addTable1"
      @delTable3="delTable1"
      @onFilterCancel="onFilterCancel1"
      @onFilterConfirm="onFilterConfirm1"
    ></FilterModal>

    <!-- 非税收入分布（按预算单位）筛选配 -->
    <FilterModal
      filterTitle="非税收入分布（按预算单位）筛选配置"
      :filterShow="filterShow2"
      :paramsOption="paramsOption2"
      :tableData="filterTableData2"
      @addTable3="addTable2"
      @delTable3="delTable2"
      @onFilterCancel="onFilterCancel2"
      @onFilterConfirm="onFilterConfirm2"
    ></FilterModal>

    <!-- 非税收入分布（按项目）筛选配 -->
    <FilterModal
      filterTitle="非税收入分布（按项目）筛选配置"
      :filterShow="filterShow3"
      :paramsOption="paramsOption3"
      :tableData="filterTableData3"
      @addTable3="addTable3"
      @delTable3="delTable3"
      @onFilterCancel="onFilterCancel3"
      @onFilterConfirm="onFilterConfirm3"
    ></FilterModal>
    <!-- 非税收入分布（按项目）排序排序按钮 -->
    <SortModal
      v-if="sortOptions3.length"
      sortTitle="非税收入分布（按项目）排序配置"
      :sortShow="sortShow3"
      @onSortCancel="onSortCancel3"
      @onSortConfirm="onSortConfirm3"
      :sortOptions="sortOptions3"
      firstSortName="当年非税收入金额"
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
import FilterModal from "@/components/filterModal.vue";
import SortModal from "@/components/sortModal.vue";
import {
  getManageTaxOverview,
  getManageTaxTableOne,
  getManageTaxTableOneFilter,
  getManageTaxTableThree,
  getManageTaxTableThreeFilter,
  getManageTaxTableThreeSort,
  getManageTaxTableTwo,
  getManageTaxTableTwoFilter,
} from "@/shared/newApi/manage/tax.js";
import { Button, Progress, Radio, Tooltip } from "ant-design-vue";
import { mapState } from "vuex";

const RadioGroup = Radio.Group;

export default {
  name: "UnitNoTax",
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

      //概览数据
      noTaxOverviewData: [
        // {
        //   id: 1,
        //   typeName: "非税收入总金额（万元）",
        //   num: 17774,
        //   percentage: "8%",
        //   status: 0, //0:down  1:up
        //   icon: "非税收入总金额",
        // },
        // {
        //   id: 2,
        //   typeName: "非税收入预算单位数量（个）",
        //   num: 17774,
        //   percentage: "8",
        //   status: 1, //0:down  1:up
        //   icon: "非税收入预算单位数量",
        // },
        // {
        //   id: 3,
        //   typeName: "非税收入类型（个）",
        //   num: 17774,
        //   percentage: "8",
        //   status: 0, //0:down  1:up
        //   icon: "非税收入类型",
        // },
        // {
        //   id: 4,
        //   typeName: "非税项目数量（个）",
        //   num: 17774,
        //   percentage: "8",
        //   status: 0, //0:down  1:up
        //   icon: "非税项目数量",
        // },
      ],
      // 支出分析（按类型）
      //表格数据
      tableData1: {
        // columns1: [
        //   {
        //     title: "非税收入类型",
        //     dataIndex: "noTaxType",
        //     key: "noTaxType",
        //     width: 160,
        //   },
        //   {
        //     title: "2019",
        //     dataIndex: "firstYear",
        //     key: "firstYear",
        //     width: 330,
        //     scopedSlots: { customRender: "firstYear" },
        //   },
        //   {
        //     title: "2020",
        //     dataIndex: "secondYear",
        //     key: "secondYear",
        //     width: 330,
        //     scopedSlots: { customRender: "secondYear" },
        //   },
        //   {
        //     title: "2021",
        //     dataIndex: "thirdYear",
        //     key: "thirdYear",
        //     width: 330,
        //     scopedSlots: { customRender: "thirdYear" },
        //   },
        //   {
        //     title: "2022",
        //     dataIndex: "forthYear",
        //     key: "forthYear",
        //     width: 330,
        //     scopedSlots: { customRender: "forthYear" },
        //   },
        //   {
        //     title: "2023",
        //     dataIndex: "fifthYear",
        //     key: "fifthYear",
        //     width: 330,
        //     scopedSlots: { customRender: "fifthYear" },
        //   },
        // ],
        // dataSource1: [
        //   {
        //     noTaxType: "非税收入类型一", // 非税收入类型
        //     firstYear: "0.45+88590", // 第一年占比
        //     secondYear: "0.45+885", // 第二年
        //     thirdYear: "0.45+885", // 第三年
        //     forthYear: "0.45+885", // 第四年
        //     fifthYear: "0.45+885", // 第五年
        //   },
        //   {
        //     noTaxType: "非税收入类型二", // 非税收入类型
        //     firstYear: "0.45+88590", // 第一年占比
        //     secondYear: "0.45+885", // 第二年
        //     thirdYear: "0.45+885", // 第三年
        //     forthYear: "0.45+885", // 第四年
        //     fifthYear: "0.45+885", // 第五年
        //   },
        //   {
        //     noTaxType: "非税收入类型三", // 非税收入类型
        //     firstYear: "0.45+88590", // 第一年占比
        //     secondYear: "0.45+885", // 第二年
        //     thirdYear: "0.45+885", // 第三年
        //     forthYear: "0.45+885", // 第四年
        //     fifthYear: "0.45+885", // 第五年
        //   },
        //   {
        //     noTaxType: "非税收入类型四", // 非税收入类型
        //     firstYear: "0.45+88590", // 第一年占比
        //     secondYear: "0.45+885", // 第二年
        //     thirdYear: "0.45+885", // 第三年
        //     forthYear: "0.45+885", // 第四年
        //     fifthYear: "0.45+885", // 第五年
        //   },
        // ],
      },

      //筛选
      filterShow1: false,
      filterConfirmArrOne: "",
      //筛选选项
      paramsOption1: [
        // {
        //   value: "字段一",
        //   label: "字段一",
        // },
        // {
        //   value: "字段二",
        //   label: "字段二",
        // },
        // {
        //   value: "字段三",
        //   label: "字段三",
        // },
      ],
      filterTableData1: [
        // {
        //   id: "1",
        //   name: "字段一",
        //   compare: "等于",
        //   value: "1234",
        // },
      ],

      //非税收入分布（按预算单位）表格数据
      //表格内部图:近五年趋势
      //
      trendType: "收入金额",
      columns2: [
        {
          title: "预算单位",
          dataIndex: "budgetName",
          key: "budgetName",
          // scopedSlots: { customRender: "type" },
          width: 250,
        },
        {
          title: "非税项目数量",
          dataIndex: "num",
          key: "num",
          width: 240,
          scopedSlots: { customRender: "num" },
        },
        {
          title: "非税项目金额（万元）",
          dataIndex: "money",
          key: "money",
          width: 240,
          scopedSlots: { customRender: "money" },
        },
        {
          // title: "近五年趋势",
          dataIndex: "graphTrend",
          key: "graphTrend",
          slots: { title: "graphTrendTitle" },
          width: 500,
          scopedSlots: { customRender: "graphTrend" },
        },
      ],
      trendGraphDataTwo: {
        legend: ["变化趋势"],
        xAxis: ["2020", "2021", "2022", "2023", "2024"],
      },
      tableDataTwo: [],
      tableLoading2: false,

      //排序
      // sortShow2: false,
      // sortStringTwo: "",
      // //排序选项
      // sortOptions2: [],

      //筛选
      filterShow2: false,
      filterConfirmArrTwo: "",
      //筛选选项
      paramsOption2: [
        // {
        //   value: "字段一",
        //   label: "字段一",
        // },
        // {
        //   value: "字段二",
        //   label: "字段二",
        // },
        // {
        //   value: "字段三",
        //   label: "字段三",
        // },
      ],
      filterTableData2: [
        // {
        //   id: "1",
        //   name: "字段一",
        //   compare: "等于",
        //   value: "1234",
        // },
      ],

      //非税收入分布（按项目）表格数据
      //表格内部图:近五年趋势
      columns3: [
        {
          title: "非税收入类型",
          dataIndex: "noTaxType",
          key: "noTaxType",
          width: 200,
          fixed: "left",
          // scopedSlots: { customRender: "budgetName" },
        },
        {
          title: "预算单位",
          dataIndex: "budgetName",
          key: "budgetName",
          // scopedSlots: { customRender: "type" },
          width: 200,
        },
        {
          title: "项目名称",
          dataIndex: "projectName",
          key: "projectName",
          // scopedSlots: { customRender: "data" },
          width: 200,
        },
        {
          title: "当年非税收入金额",
          dataIndex: "data",
          key: "data",
          scopedSlots: { customRender: "data" },
          width: 220,
        },
        {
          title: "近五年趋势",
          dataIndex: "graphTrend",
          key: "graphTrend",
          width: 410,
          scopedSlots: { customRender: "graphTrend" },
        },
      ],
      trendGraphDataThree: {
        legend: ["变化趋势"],
        xAxis: ["2020", "2021", "2022", "2023", "2024"],
        yAxis: {
          name: "金额/数量",
        },
        seriesData: [
          {
            name: "变化趋势",
            data: [8, 10, 7, 5, 9],
            rate: [8, 10, 7, 5, 9],
          },
        ],
      },
      tableDataThree: [],
      tableLoading3: false,
      //排序
      sortShow3: false,
      sortStringThree: "",
      //排序选项
      sortOptions3: [
        // {
        //   label: "字段1",
        //   value: "字段1",
        // },
        // {
        //   label: "字段2",
        //   value: "字段2",
        // },
        // {
        //   label: "字段3",
        //   value: "字段3",
        // },
        // {
        //   label: "字段4",
        //   value: "字段4",
        // },
        // {
        //   label: "字段5",
        //   value: "字段5",
        // },
        // {
        //   label: "字段6",
        //   value: "字段6",
        // },
        // {
        //   label: "字段7",
        //   value: "字段7",
        // },
        // {
        //   label: "字段8",
        //   value: "字段8",
        // },
      ],

      //筛选
      filterShow3: false,
      filterConfirmArrThree: "",
      //筛选选项
      paramsOption3: [
        // {
        //   value: "字段一",
        //   label: "字段一",
        // },
        // {
        //   value: "字段二",
        //   label: "字段二",
        // },
        // {
        //   value: "字段三",
        //   label: "字段三",
        // },
      ],
      filterTableData3: [
        // {
        //   id: "1",
        //   name: "字段一",
        //   compare: "等于",
        //   value: "1234",
        // },
      ],
    };
  },
  computed: {
    ...mapState("blockAnalysis", ["blockChoosedYear"]),
    ...mapState("managePortrait", ["curTreeItem", "configParams"]),
  },
  components: {
    SortModal,
    FilterModal,
    ATooltip: Tooltip,
    AButton: Button,
    AProgress: Progress,
    ARadio: Radio,
    ARadioGroup: RadioGroup,
  },
  watch: {
    curTreeItem: {
      async handler(newVal, oldVal) {
        console.log("5656555", newVal, oldVal);
        this.getAllData();
      },
      deep: true,
    },
    "configParams.curYear": {
      async handler(newVal, oldVal) {
        console.log("5656555", newVal, oldVal);
        this.getAllData();
      },
      deep: true,
    },
  },
  mounted() {
    window.goBudgetPortrait = this.goBudgetPortrait;
    if (!this.curTreeItem.key) return;
    this.getAllData();
    // this.initTableTwo();
    // this.initTableThree();
    // this.initAllCharts();
  },
  methods: {
    //跳转到预算明细页面
    goBudgetPortrait(name) {
      this.$router.push({
        name: "budgetPortrait",
        query: { key: name, type: "title" },
      });
    },

    async getAllData() {
      if (!this.curTreeItem.key) return;
      this.getManageTaxOverview(); //获取概览情况
      this.getManageTaxTableOneFilter(); //获取非税收入分布（按类型）表格 筛选
      this.getManageTaxTableOne(); //获取三公支出分析（按类型）表格
      this.getManageTaxTableTwoFilter(); //非税收入分布（按预算单位）筛选
      // await this.getManageTaxTableTwoSort();  //又不要排序了
      //因为有默认排序值，故下面表格的获取放置排序确认函数内
      this.initTableTwo(); //获取非税收入分布（按预算单位）表格
      this.getManageTaxTableThreeFilter(); //非税收入分布（按项目）筛选
      await this.getManageTaxTableThreeSort(); //非税收入分布（按项目）排序选项
      //因为有默认排序值，故下面表格的获取放置排序确认函数内
      // this.initTableThree();  //不必打开
    },

    //获取非税概览情况
    async getManageTaxOverview() {
      const json = {
        year: this.configParams.curYear,
        deptCode: this.curTreeItem.key,
      };
      const res = await getManageTaxOverview(json);
      if (res.message === "成功") {
        console.log("message成功 获取非税概览情况", res.data);
        this.noTaxOverviewData = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //获取非税收入分布（按类型）表格
    async getManageTaxTableOne() {
      const json = {
        year: this.configParams.curYear, //年份
        deptCode: this.curTreeItem.key, //主管单位编码
        filterCondition: this.filterConfirmArrOne, //过滤条件
        // odName: "", //排序条件  这个表格没有排序
      };
      const res = await getManageTaxTableOne(json);
      if (res.message === "成功") {
        console.log("message成功 获取非税收入分布（按类型）表格", res.data);
        this.tableData1 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //获取非税收入分布（按类型）表格 筛选
    async getManageTaxTableOneFilter() {
      const res = await getManageTaxTableOneFilter();
      if (res.message === "成功") {
        console.log("message成功 非税收入分布（按类型）表格 筛选", res.data);
        this.paramsOption1 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //获取非税收入分布（按预算单位）表格
    async getManageTaxTableTwo() {
      const json = {
        year: this.configParams.curYear, //年份
        deptCode: this.curTreeItem.key, //主管单位编码
        filterCondition: this.filterConfirmArrTwo, //过滤条件
        // odName: this.sortStringTwo, //排序条件
      };
      const res = await getManageTaxTableTwo(json);
      if (res.message === "成功") {
        console.log("message成功 获取非税收入分布（按预算单位）表格", res.data);
        this.tableDataTwo = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //获取非税收入分布（按类型）表格 排序
    // async getManageTaxTableTwoSort() {
    //   this.sortOptions2 = [];
    //   const res = await getManageTaxTableTwo();
    //   if (res.message === "成功") {
    //     console.log(
    //       "message成功 获取非税收入分布（按类型）表格 排序",
    //       res.data
    //     );
    //     this.sortOptions2 = res.data;
    //   } else {
    //     this.$message.error(res.message);
    //   }
    // },

    //非税收入分布（按预算单位）筛选
    async getManageTaxTableTwoFilter() {
      const res = await getManageTaxTableTwoFilter();
      if (res.message === "成功") {
        console.log("message成功 非税收入分布（按预算单位）筛选", res.data);
        this.paramsOption2 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //获取非税收入分布（按项目）表格
    async getManageTaxTableThree() {
      const json = {
        year: this.configParams.curYear, //年份
        deptCode: this.curTreeItem.key, //主管单位编码
        filterCondition: this.filterConfirmArrThree, //过滤条件
        odName: this.sortStringThree, //排序条件
      };
      const res = await getManageTaxTableThree(json);
      if (res.message === "成功") {
        console.log("message成功 获取非税收入分布（按项目）表格", res.data);
        let data = res.data;
        data.forEach((item) => {
          item.graphTrend.money.type = "line";
          item.graphTrend.money.color = this.lineColor[0];
          //label颜色改变
          item.graphTrend.money.label = {
            show: true,
            formatter: (params) => {
              if (
                params.data >= parseFloat(this.configParams.highProjectRevenue)
              ) {
                return "{red|" + params.value.toLocaleString() + "万元}";
              } else {
                return params.value.toLocaleString() + "万元";
              }
            },
            rich: {
              red: {
                color: "red",
              },
              // green: {
              //   color: "#f28518",
              // },
            },
          };
          // item.graphTrend.money.label = {
          //   show: true, // 显示标签
          //   position: "top", // 标签位置：top, inside, bottom
          //   formatter: function (params) {
          //     return params.value.toLocaleString() + "万元";
          //   },
          // };
        });
        this.tableDataThree = data;
      } else {
        this.$message.error(res.message);
      }
    },

    //非税收入分布（按项目）排序
    async getManageTaxTableThreeSort() {
      this.sortOptions3 = [];
      const json = {
        year: this.configParams.curYear,
        unitCode: this.curTreeItem.key,
      };
      const res = await getManageTaxTableThreeSort(json);
      if (res.message === "成功") {
        console.log("message成功 非税收入分布（按项目）排序", res.data);
        this.sortOptions3 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //非税收入分布（按项目）筛选
    async getManageTaxTableThreeFilter() {
      const json = {
        year: this.configParams.curYear,
        unitCode: this.curTreeItem.key,
      };
      const res = await getManageTaxTableThreeFilter(json);
      if (res.message === "成功") {
        console.log("message成功 非税收入分布（按项目）筛选", res.data);
        this.paramsOption3 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //第一个表格——非税收入类型（按类型）筛选
    filterOne() {
      this.filterShow1 = true;
    },
    onFilterCancel1() {
      this.filterShow1 = false;
    },
    onFilterConfirm1(filterConfirmArrOne) {
      // this.initTableThree();
      this.filterConfirmArrOne = filterConfirmArrOne;
      this.getManageTaxTableOne();
      this.onFilterCancel1();
    },
    addTable1(json) {
      this.filterTableData1 = [...this.filterTableData1, json];
    },
    delTable1(arr) {
      this.filterTableData1 = arr;
    },

    //第二个表格：非税收入分布（按预算单位）
    handleTableTwoChange() {
      this.getTrendEchartsTwo();
    },
    getTrendEchartsTwo() {
      console.log("4243242432", this.tableDataTwo);
      setTimeout(() => {
        this.tableDataTwo.forEach((item) => {
          // if (myChart) {
          //   myChart.dispose();
          // }
          let oldChart = this.$echarts.getInstanceByDom(
            this.$refs["chart2" + item.id]
          );
          if (oldChart) {
            oldChart.dispose();
          }
          let myChart = this.$echarts.init(this.$refs["chart2" + item.id]);
          const _that = this;
          const option = {
            // grid: {
            //   left: "0",
            //   top: "0",
            //   right: "0",
            //   bottom: "0",
            //   containLabel: true,
            // },
            grid: { right: 100 },
            tooltip: {
              enterable: true,
              trigger: "axis",
              // trigger: "axis",
              borderColor: "transparent",
              axisPointer: {
                type: "cross",
                crossStyle: {
                  color: "#999",
                },
              },
              formatter: function (params) {
                // console.log("hfhdfjhshjfs", params);

                if (_that.trendType === "收入金额") {
                  let rateArr = item.graphTrend.money.rate;
                  let data = Number(params[0].data).toLocaleString();
                  let total = Number(
                    item.graphTrend.money.total[params[0].dataIndex]
                  ).toLocaleString();
                  return `<div class="ratio-tooltip-box" style="pointer-events:auto">
                    <a onClick="goBudgetPortrait('${
                      item.budgetName
                    }')">预算单位名称：${item.budgetName}</a>
                    <div>年份：${params[0].name}年</div>
                    <div>年度非税收入金额：${data}万元</div>
                    <div>主管单位年度非税收入金额：${total}万元</div>
                    <div>占比：${rateArr[params[0].dataIndex]}%</div>
                  </div>`;
                } else {
                  let rateArr = item.graphTrend.num.rate;
                  let data = Number(params[0].data).toLocaleString();
                  let total = Number(
                    item.graphTrend.num.total[params[0].dataIndex]
                  ).toLocaleString();
                  return `<div class="ratio-tooltip-box" style="pointer-events:auto">
                    <a onClick="goBudgetPortrait('${
                      item.budgetName
                    }')">预算单位名称：${item.budgetName}</a>
                    <div>年份：${params[0].name}年</div>
                    <div>年度非税项目数量：${data}个</div>
                    <div>主管单位年度非税项目数量：${total}个</div>
                    <div>占比：${rateArr[params[0].dataIndex]}%</div>
                  </div>`;
                }
              },
              // position: function (point) {
              //   return [point[0] - 5, point[1] - 5];
              // },
              confine: true,
            },
            // legend: { data: this.trendGraphDataThree.legend },
            //原先的
            xAxis: [
              {
                type: "category",
                data: [
                  Number(_that.configParams.curYear) - 4,
                  Number(_that.configParams.curYear) - 3,
                  Number(_that.configParams.curYear) - 2,
                  Number(_that.configParams.curYear) - 1,
                  Number(_that.configParams.curYear),
                ],
                axisPointer: {
                  type: "shadow",
                },
              },
            ],
            //加箭头
            // xAxis: [
            //   {
            //     type: "category",
            //     data: [
            //       Number(_that.configParams.curYear) - 4,
            //       Number(_that.configParams.curYear) - 3,
            //       Number(_that.configParams.curYear) - 2,
            //       Number(_that.configParams.curYear) - 1,
            //       Number(_that.configParams.curYear),
            //     ],
            //     //不显示x轴线
            //     // show: false,
            //     axisPointer: {
            //       show: true, // 显示坐标轴指示器
            //       type: "none", // 无需特定指示器，只为了显示箭头
            //     },
            //     axisLine: {
            //       symbol: ["none", "arrow"], // 在末尾显示箭头
            //       symbolSize: [8, 16], // 箭头的大小
            //       lineStyle: {
            //         color: "#333", // 箭头颜色
            //         width: 1, // 箭头线条宽度
            //       },
            //     },
            //     // axisPointer: {
            //     //   type: "shadow",
            //     // },
            //     // axisLine: {
            //     //   //坐标轴轴线相关设置。数学上的x轴
            //     //   show: false,
            //     // },
            //     axisTick: {
            //       // 不展示刻度
            //       show: false,
            //     },
            //   },
            //   {
            //     type: "category",
            //     axisLine: { show: false },
            //     axisTick: { show: false },
            //     axisLabel: { show: false },
            //     splitArea: { show: false },
            //     splitLine: { show: false },
            //     axisPointer: { show: false },
            //   },
            // ],
            //加箭头版本
            // yAxis: {
            //   type: "value",
            //   axisTick: {
            //     // 隐藏刻度
            //     show: false,
            //   },
            //   axisLabel: {
            //     // 隐藏刻度标签
            //     show: false,
            //   },
            //   splitLine: {
            //     show: false, // 隐藏分隔线
            //   },
            //   axisLine: {
            //     show: true,
            //     symbol: ["none", "arrow"],
            //     // lineStyle: {
            //     //   type: "dashed",
            //     //   // ...
            //     // },
            //   },
            // },
            //原先的
            yAxis: {
              type: "value",
              //不显示y轴线
              show: false,
              // name: this.trendGraphDataThree.yAxis.name,
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

          if (this.trendType === "项目数量") {
            option.series.push({
              type: "line",
              data: item.graphTrend.num.data,
              color: this.lineColor[0],
              label: {
                show: true,
                formatter: (params) =>
                  Number(params.data).toLocaleString() + "个",
              },
            });
          } else {
            option.series.push({
              type: "line",
              // stack: "Total",
              // name: this.tableDataTwo[i].graphTrend.money.name,
              data: item.graphTrend.money.data,
              color: this.lineColor[0],
              label: {
                show: true,
                formatter: (params) =>
                  Number(params.data).toLocaleString() + "万元",
              },
            });
          }

          // console.log("bibibibibibi", option.series);
          myChart.setOption(option);
          window.addEventListener("resize", () => {
            myChart.resize();
          });
        });
      }, 1000);
    },
    async initTableTwo() {
      await this.getManageTaxTableTwo();
      // this.tableDataTwo = [
      //   {
      //     id: "11",
      //     budgetName: "预算单位一",
      //     num: "12345+0.78",
      //     money: "12345+0.78",
      //     graphTrend: {
      //       money: {
      //         data: [1, 2, 3, 4, 5],
      //         rate: [10, 20, 30, 40, 50],
      //         total: [1, 2, 3, 4, 5], //主管单位年度非税收入金额
      //       },
      //       num: {
      //         data: [8, 10, 7, 5, 9],
      //         rate: [22, 33, 44, 55, 66],
      //         total: [1, 2, 3, 4, 5], //主管单位年度非税收入项目数量
      //       },
      //     },
      //   },
      //   {
      //     id: "22",
      //     budgetName: "预算单位二",
      //     num: "12345+0.78",
      //     money: "12345+0.78",
      //     graphTrend: {
      //       money: {
      //         data: [1, 2, 3, 4, 5],
      //         rate: [10, 20, 30, 40, 50],
      //         total: [1, 2, 3, 4, 5], //主管单位年度非税收入金额
      //       },
      //       num: {
      //         data: [8, 10, 7, 5, 9],
      //         rate: [22, 33, 44, 55, 66],
      //         total: [1, 2, 3, 4, 5], //主管单位年度非税收入项目数量
      //       },
      //     },
      //   },
      //   {
      //     id: "33",
      //     budgetName: "预算单位三",
      //     num: "12345+0.78",
      //     money: "12345+0.78",
      //     graphTrend: {
      //       money: {
      //         data: [1, 2, 3, 4, 5],
      //         rate: [10, 20, 30, 40, 50],
      //         total: [1, 2, 3, 4, 5], //主管单位年度非税收入金额
      //       },
      //       num: {
      //         data: [8, 10, 7, 5, 9],
      //         rate: [22, 33, 44, 55, 66],
      //         total: [1, 2, 3, 4, 5], //主管单位年度非税收入项目数量
      //       },
      //     },
      //   },
      //   {
      //     id: "44",
      //     budgetName: "预算单位四",
      //     num: "12345+0.78",
      //     money: "12345+0.78",
      //     graphTrend: {
      //       money: {
      //         data: [1, 2, 3, 4, 5],
      //         rate: [10, 20, 30, 40, 50],
      //         total: [1, 2, 3, 4, 5], //主管单位年度非税收入金额
      //       },
      //       num: {
      //         data: [8, 10, 7, 5, 9],
      //         rate: [22, 33, 44, 55, 66],
      //         total: [1, 2, 3, 4, 5], //主管单位年度非税收入项目数量
      //       },
      //     },
      //   },
      // ];
      this.getTrendEchartsTwo();
    },

    //第er个表格——非税收入类型（按预算单位）排序
    // sortTwo() {
    //   this.sortShow2 = true;
    // },
    // onSortCancel2() {
    //   this.sortShow2 = false;
    // },
    // onSortConfirm2(sortStringTwo) {
    //   this.sortStringTwo = sortStringTwo;
    //   this.initTableTwo();
    //   this.onSortCancel2();
    // },

    //第二个表格： 非税收入分布（按预算单位）筛选
    filterTwo() {
      this.filterShow2 = true;
    },
    onFilterCancel2() {
      this.filterShow2 = false;
    },
    onFilterConfirm2(filterConfirmArrTwo) {
      // this.initTableTwo();
      this.filterConfirmArrTwo = filterConfirmArrTwo;
      this.initTableTwo();
      this.onFilterCancel2();
    },
    addTable2(json) {
      this.filterTableData2 = [...this.filterTableData2, json];
    },
    delTable2(arr) {
      this.filterTableData2 = arr;
    },

    //第三个表格：非税收入分布（按项目）
    getTrendEchartsThree() {
      console.log("4243242432", this.tableDataThree);
      setTimeout(() => {
        this.tableDataThree.forEach((item) => {
          let oldChart = this.$echarts.getInstanceByDom(
            this.$refs["chart3" + item.id]
          );
          if (oldChart) {
            oldChart.dispose();
          }
          let myChart = this.$echarts.init(this.$refs["chart3" + item.id]);
          const _that = this;
          const option = {
            // grid: {
            //   left: "0",
            //   top: "0",
            //   right: "0",
            //   bottom: "0",
            //   containLabel: true,
            // },

            grid: { right: 100 },
            tooltip: {
              // trigger: "axis",
              // triggerOn: "click",
              enterable: true,
              triggerOn: "mousemove", // 设置触发方式为悬停
              borderColor: "transparent",
              formatter: function (params) {
                let money = Number(
                  item.graphTrend.money.data[params.dataIndex]
                ).toLocaleString();
                let money2 = Number(
                  item.graphTrend.money.data2[params.dataIndex]
                ).toLocaleString();
                let rate = item.graphTrend.money.rate[params.dataIndex];

                return `<div class="ratio-tooltip-box" style="pointer-events:auto">
                        <a onClick="goBudgetPortrait('${item.budgetName}')">预算单位名称：${item.budgetName}</a>
                        <div>年份：${params.name}年</div>
                        <div>项目名称：${item.projectName}</div>
                        <div>本项目年度非税金额：${money}万元</div>
                        <div>本单位年度非税金额：${money2}万元</div>
                        <div>占比：${rate}%</div>
                      </div>`;
              },
              // position: function (point) {
              //   return [point[0] - 5, point[1] - 5];
              // },
              confine: true,
            },
            // legend: { data: this.trendGraphDataThree.legend },
            //原先的
            xAxis: [
              {
                type: "category",
                data: [
                  Number(_that.configParams.curYear) - 4,
                  Number(_that.configParams.curYear) - 3,
                  Number(_that.configParams.curYear) - 2,
                  Number(_that.configParams.curYear) - 1,
                  Number(_that.configParams.curYear),
                ],
                axisPointer: {
                  type: "shadow",
                },
              },
            ],
            //加箭头
            // xAxis: [
            //   {
            //     type: "category",
            //     data: [
            //       Number(_that.configParams.curYear) - 4,
            //       Number(_that.configParams.curYear) - 3,
            //       Number(_that.configParams.curYear) - 2,
            //       Number(_that.configParams.curYear) - 1,
            //       Number(_that.configParams.curYear),
            //     ],
            //     //不显示x轴线
            //     // show: false,
            //     axisPointer: {
            //       show: true, // 显示坐标轴指示器
            //       type: "none", // 无需特定指示器，只为了显示箭头
            //     },
            //     axisLine: {
            //       symbol: ["none", "arrow"], // 在末尾显示箭头
            //       symbolSize: [8, 16], // 箭头的大小
            //       lineStyle: {
            //         color: "#333", // 箭头颜色
            //         width: 1, // 箭头线条宽度
            //       },
            //     },
            //     // axisPointer: {
            //     //   type: "shadow",
            //     // },
            //     // axisLine: {
            //     //   //坐标轴轴线相关设置。数学上的x轴
            //     //   show: false,
            //     // },
            //     axisTick: {
            //       // 不展示刻度
            //       show: false,
            //     },
            //   },
            //   {
            //     type: "category",
            //     axisLine: { show: false },
            //     axisTick: { show: false },
            //     axisLabel: { show: false },
            //     splitArea: { show: false },
            //     splitLine: { show: false },
            //     axisPointer: { show: false },
            //   },
            // ],
            //y轴只展示箭头
            // yAxis: {
            //   type: "value",
            //   axisTick: {
            //     // 隐藏刻度
            //     show: false,
            //   },
            //   axisLabel: {
            //     // 隐藏刻度标签
            //     show: false,
            //   },
            //   splitLine: {
            //     show: false, // 隐藏分隔线
            //   },
            //   axisLine: {
            //     show: true,
            //     symbol: ["none", "arrow"],
            //     // lineStyle: {
            //     //   type: "dashed",
            //     //   // ...
            //     // },
            //   },
            // },
            //原先的
            yAxis: {
              type: "value",
              //不显示y轴线
              show: false,
              // name: this.trendGraphDataThree.yAxis.name,
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
            series: [item.graphTrend.money],
          };

          myChart.setOption(option);
          window.addEventListener("resize", () => {
            myChart.resize();
          });
        });
      }, 1000);
    },
    async initTableThree() {
      await this.getManageTaxTableThree();
      // this.tableDataThree = [
      //   {
      //     id: "1",
      //     noTaxType: "非税收入类型一",
      //     budgetName: "预算单位一",
      //     projectName: "项目名称一",
      //     data: "12345+0.78",
      //     graphTrend: {
      //       money: {
      //         type: "line", //后续数据处理添加
      //         data: [1, 2, 3, 4, 5], //本项目年度非税收入金额
      //         data2: [1, 2, 3, 4, 5], //本单位年度非税收入金额
      //         rate: [10, 20, 30, 40, 50],
      //         // todo  后续遍历的时候加上
      // label: {
      //   show: true,
      //   formatter: (params) =>
      //     Number(params.data).toLocaleString() + "万元",
      // },
      //       },
      //     },
      //   },
      //   {
      //     id: "2",
      //     noTaxType: "非税收入类型二",
      //     budgetName: "预算单位二",
      //     projectName: "项目名称二",
      //     data: "12345+0.78",
      //     graphTrend: {
      //       money: {
      //         type: "line", //后续数据处理添加
      //         data: [1, 2, 3, 4, 5],
      //         data2: [1, 2, 3, 4, 5], //本单位年度非税收入金额
      //         rate: [10, 20, 30, 40, 50],
      //       },
      //     },
      //   },
      //   {
      //     id: "3",
      //     noTaxType: "非税收入类型三",
      //     budgetName: "预算单位三",
      //     projectName: "项目名称三",
      //     data: "12345+0.78",
      //     graphTrend: {
      //       money: {
      //         type: "line", //后续数据处理添加
      //         data: [1, 2, 3, 4, 5],
      //         data2: [1, 2, 3, 4, 5], //本单位年度非税收入金额
      //         rate: [10, 20, 30, 40, 50],
      //       },
      //     },
      //   },
      //   {
      //     id: "4",
      //     noTaxType: "非税收入类型四",
      //     budgetName: "预算单位四",
      //     projectName: "项目名称四",
      //     data: "12345+0.78",
      //     graphTrend: {
      //       money: {
      //         type: "line", //后续数据处理添加
      //         data: [1, 2, 3, 4, 5],
      //         rate: [10, 20, 30, 40, 50],
      //       },
      //     },
      //   },
      // ];
      this.getTrendEchartsThree();
    },
    //第三个表格——非税收入分布（按项目）筛选
    filterThree() {
      this.filterShow3 = true;
    },
    onFilterCancel3() {
      this.filterShow3 = false;
    },
    onFilterConfirm3(filterConfirmArrThree) {
      this.filterConfirmArrThree = filterConfirmArrThree;
      this.initTableThree();
      this.onFilterCancel3();
    },
    addTable3(json) {
      this.filterTableData3 = [...this.filterTableData3, json];
    },
    delTable3(arr) {
      this.filterTableData3 = arr;
    },
    //第三个表格——非税收入分布（按项目）排序
    sortThree() {
      this.sortShow3 = true;
    },
    onSortCancel3() {
      this.sortShow3 = false;
    },
    onSortConfirm3(sortStringThree) {
      this.sortStringThree = sortStringThree;
      this.initTableThree();
      this.onSortCancel3();
    },
  },
};
</script>
<style lang="less">
.slot-table-header {
  width: 450px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .ant-radio-group {
    display: flex;
    align-items: center;

    .ant-radio-wrapper {
      display: flex;
      align-items: center;
    }
  }
}
.unit-no-tax {
  width: 100%;

  // 概览板块
  &-data {
    width: 100%;
    height: 126px;
    margin-bottom: 20px;

    &-item {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      grid-template-rows: 126px;
      gap: 20px;

      .unit-no-tax-unit {
        //每个小方块
        height: 126px;
        padding: 20px 21px 20px 16px;
        color: #3c485c;
        border-radius: var(--BorderRadius-borderRadius, 6px);
        background: linear-gradient(104deg, #dfeaff 0%, #f4f6ff 100.1%);
        position: relative;

        .unit-top {
          height: 22px;
          line-height: 22px;
        }

        .unit-middle {
          margin: 10px 0;
          font-weight: 500;
          //font-family: "DIN Alternate";
          font-size: 24px;
          height: 24px;
          line-height: 24px;
        }

        .unit-bottom {
          display: flex;

          &-icon {
            width: 12px;
            height: 12px;
            margin-left: 4px;
          }
        }

        .unit-icon {
          width: 64px;
          height: 64px;
          position: absolute;
          right: 21px;
          bottom: 33px;
        }
      }
    }
  }

  //非税收入分布按类型表格
  //按钮
  .type-unit {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 20px;

    //所有排序筛选查看更多按钮
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

      .tooltip-icon {
        margin-top: 7px;
        margin-left: 10px;
      }
    }
  }

  //非税收入分布按类型表格
  .type-unit-table {
    margin-bottom: 20px;
  }
}
</style>
