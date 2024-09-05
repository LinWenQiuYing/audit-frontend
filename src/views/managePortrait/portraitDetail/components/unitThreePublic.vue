<template>
  <div class="unit-three-public">
    <div class="sub-title">三公支出数据概览</div>
    <div class="unit-three-public-data">
      <div class="unit-three-public-data-item">
        <div
          v-for="(item, index) in threePublicData"
          :key="index"
          class="unit-three-public-unit"
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
    <!-- 支出分析表格 -->
    <div class="sub-title">三公支出分析（按类型）</div>
    <a-table
      :columns="tableData1.columns1"
      :data-source="tableData1.dataSource1"
      :scroll="{ x: 'max-content', y: 'calc(100vh - 380px)' }"
      :bordered="true"
      :pagination="false"
      class="type-unit-table"
    >
      <span slot="firstYear" slot-scope="text, record" style="display: flex">
        <a-progress
          :percent="calculatePercent(record.firstYear, maxColumnData[0], 1)"
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
            }}元</span
          >
        </div>
      </span>
      <span slot="secondYear" slot-scope="text, record" style="display: flex">
        <a-progress
          :percent="calculatePercent(record.secondYear, maxColumnData[1], 1)"
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
            }}元</span
          >
        </div>
      </span>
      <span slot="thirdYear" slot-scope="text, record" style="display: flex">
        <a-progress
          :percent="calculatePercent(record.thirdYear, maxColumnData[2], 1)"
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
            }}元</span
          >
        </div>
      </span>
      <span slot="forthYear" slot-scope="text, record" style="display: flex">
        <a-progress
          :percent="calculatePercent(record.forthYear, maxColumnData[3], 1)"
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
            }}元</span
          >
        </div>
      </span>
      <span slot="fifthYear" slot-scope="text, record" style="display: flex">
        <a-progress
          :percent="calculatePercent(record.fifthYear, maxColumnData[4], 1)"
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
            }}元</span
          >
        </div>
      </span>
    </a-table>
    <!-- 三公支出分布（按预算单位） -->
    <div class="budget-units">
      <div class="sub-title">三公支出分布（按预算单位）</div>
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
      bordered
      :columns="columns2"
      :data-source="tableDataTwo"
      :loading="tableLoading"
      :pagination="false"
      class="budget-units-table"
      :scroll="{ x: 'max-content', y: 600 }"
    >
      <!-- :scroll="{ x: 'max-content', y: 'calc(100vh - 318px)' }" -->
      <!-- <template slot="budgetName" slot-scope="text">
        <a style="cursor: pointer">{{ text }}</a>
      </template> -->
      <span slot="data" slot-scope="text, record" style="display: flex">
        <!-- <div style="width: 100%; display: flex; justify-content: space-between">
          <div>{{ text.split("+")[1] * 1 }}%</div>
          <div>{{ text.split("+")[0] }}元</div>
        </div> -->
        <a-progress
          :percent="calculatePercent(text, record.maxNum, 0)"
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
            }}元</span
          >
        </div>
      </span>
      <template slot="graphTrend" slot-scope="text, record">
        <div
          style="width: 100%; height: 100px"
          :ref="'chart' + record.id"
        ></div>
      </template>
    </a-table>
    <!-- 人均三公费用对比两个图 -->
    <div class="sub-title">人均三公费用对比</div>
    <div class="average-money">
      <div class="average-money-box" style="width: calc(55% - 10px)">
        <div class="content-top">
          <div class="top-item">
            <div class="top-item-label">维度：</div>
            <a-select
              class="top-item-select"
              v-model="choosedRange"
              @change="handleSubjectChangeOne"
            >
              <!--  @change="handleSubjectChangeOne" -->
              <a-select-option
                v-for="item in rangeOptions"
                :key="item.label"
                :title="item.label"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </div>
          <div class="top-item">
            <div class="top-item-label">费用较高值：</div>
            <a-input-number
              placeholder="请输入"
              :min="0"
              v-model="highNumber"
            />
          </div>
          <div class="top-item">
            <div class="top-item-label">费用较低值：</div>
            <a-input-number placeholder="请输入" :min="0" v-model="lowNumber" />
          </div>
        </div>
        <div class="content-graph" ref="graph1"></div>
      </div>

      <!-- 右边的折线图 -->
      <div class="average-money-box" style="width: calc(45% - 10px)">
        <div class="wrapper-top">
          <div class="wrapper-top-title">近五年人均费用趋势</div>
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
        <div class="wrapper-split"></div>
        <div class="wrapper-content">
          <div class="wrapper-content-graph" ref="graph2"></div>
        </div>
      </div>
    </div>
    <!-- <div class="graph-top">
                <div class="top-item">
                  <div class="top-item-label">维度：</div>
                  <a-select
                    class="top-item-select"
                    v-model="choosedRange"
                    @change="handleSubjectChangeOne"
                  >
                    <a-select-option
                      v-for="item in rangeOptions"
                      :key="item.label"
                      :title="item.value"
                      :value="item.value"
                    >
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </div>
                <div class="top-item">
                  <div class="top-item-label">费用较高值：</div>
                  <a-input-number
                    placeholder="请输入"
                    :min="0"
                    v-model="highNumber"
                    class="top-item-input"
                    style="width: 70px; margin-right: 8px"
                  />
                </div>
                <div class="top-item">
                  <div class="top-item-label">费用较低值：</div>
                  <a-input-number
                    placeholder="请输入"
                    :min="0"
                    v-model="lowNumber"
                    class="top-item-input"
                    style="width: 70px; margin-right: 8px"
                  />
                </div>
              </div> -->
    <!-- 预算单位筛选 -->
    <FilterModal
      filterTitle="预算单位筛选配置"
      :filterShow="filterShow1"
      :paramsOption="paramsOption1"
      :tableData="filterTableData1"
      @addTable3="addTable1"
      @delTable3="delTable1"
      @onFilterCancel="onFilterCancel1"
      @onFilterConfirm="onFilterConfirm1"
    ></FilterModal>
    <!-- 预算单位排序按钮 -->
    <!-- <SortModal
      sortTitle="预算单位排序配置"
      :sortShow="sortShow1"
      @onSortCancel="onSortCancel1"
      @onSortConfirm="onSortConfirm1"
      :sortOptions="sortOptions1"
    ></SortModal> -->
  </div>
</template>
<script>
// import { mapState } from "vuex";
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
// import SortModal from "@/components/sortModal.vue";
import {
  getManagePublicGraphOne,
  getManagePublicGraphTwo,
  getManagePublicOverview,
  getManagePublicTableOne,
  getManagePublicTableTwo,
  getManagePublicTableTwoFilter,
} from "@/shared/newApi/manage/public.js";
import { Button, InputNumber, Progress, Tooltip } from "ant-design-vue";
import { mapState } from "vuex";
import { calculateMaxValues } from "../../util.js";

export default {
  name: "unitThreePublic",
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

      // SHOW_PARENT,

      //概览数据
      threePublicData: [
        // {
        //   id: 1,
        //   typeName: "三公支出总金额（元）",
        //   num: 17774,
        //   percentage: "8%",
        //   status: 0, //0:down  1:up
        //   icon: "三公支出总金额",
        // },
        // {
        //   id: 2,
        //   typeName: "公务车费用（元）",
        //   num: 17774,
        //   percentage: "8%",
        //   status: 1, //0:down  1:up
        //   icon: "公务车费用",
        // },
        // {
        //   id: 3,
        //   typeName: "公务接待费用（元）",
        //   num: 17774,
        //   percentage: "8%",
        //   status: 0, //0:down  1:up
        //   icon: "公务接待费用",
        // },
        // {
        //   id: 4,
        //   typeName: "因公出国费用（元）",
        //   num: 17774,
        //   percentage: "8%",
        //   status: 0, //0:down  1:up
        //   icon: "因公出国费用",
        // },
      ],

      // 支出分析（按类型）
      tableData1: {
        //表格数据
        // columns1: [
        //   {
        //     title: "三公支出类型",
        //     dataIndex: "threePublicType",
        //     key: "threePublicType",
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
        dataSource1: [
          // {
          //   threePublicType: "公务车费用", // 三公支出类型
          //   firstYear: "--+--", // 第一年占比
          //   secondYear: "0.45+885", // 第二年
          //   thirdYear: "0.45+885", // 第三年
          //   forthYear: "0.45+885", // 第四年
          //   fifthYear: "0.45+885", // 第五年
          // },
          // {
          //   threePublicType: "公务接待费用", // 三公支出类型
          //   firstYear: "0.40+785", // 第一年
          //   secondYear: "0.40+785", // 第二年
          //   thirdYear: "0.40+785", // 第三年
          //   forthYear: "0.40+785", // 第四年
          //   fifthYear: "0.40+785", // 第五年
          // },
          // {
          //   threePublicType: "因公出国费用", // 三公支出类型
          //   firstYear: "0.15+185", // 第一年
          //   secondYear: "0.15+185", // 第二年
          //   thirdYear: "0.15+185", // 第三年
          //   forthYear: "0.15+185", // 第四年
          //   fifthYear: "0.15+185", // 第五年
          // },
        ],
      },
      maxColumnData: [], //每列的最大值

      //三公支出分布（按预算单位）
      //排序
      // sortShow1: false,
      //排序选项
      // sortOptions1: [
      //   {
      //     label: "字段1",
      //     value: "字段1",
      //   },
      //   {
      //     label: "字段2",
      //     value: "字段2",
      //   },
      //   {
      //     label: "字段3",
      //     value: "字段3",
      //   },
      //   {
      //     label: "字段4",
      //     value: "字段4",
      //   },
      //   {
      //     label: "字段5",
      //     value: "字段5",
      //   },
      //   {
      //     label: "字段6",
      //     value: "字段6",
      //   },
      //   {
      //     label: "字段7",
      //     value: "字段7",
      //   },
      //   {
      //     label: "字段8",
      //     value: "字段8",
      //   },
      // ],
      //筛选
      filterShow1: false,
      //筛选选项
      filterConfirmArrOne: "",
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
        // {
        //   id: "2",
        //   name: "字段二",
        //   compare: "不等于",
        //   value: "1234",
        // },
        // {
        //   id: "3",
        //   name: "字段三",
        //   compare: "包含",
        //   value: "1234",
        // },
        // {
        //   id: "4",
        //   name: "字段四",
        //   compare: "不包含",
        //   value: "1234",
        // },
        // {
        //   id: "1",
        //   name: "字段一",
        //   compare: "等于",
        //   value: "1234",
        // },
        // {
        //   id: "2",
        //   name: "字段二",
        //   compare: "不等于",
        //   value: "1234",
        // },
        // {
        //   id: "3",
        //   name: "字段三",
        //   compare: "包含",
        //   value: "1234",
        // },
        // {
        //   id: "4",
        //   name: "字段四",
        //   compare: "不包含",
        //   value: "1234",
        // },
      ],

      //三公支出分布表格数据
      //表格内部图:预算单位近五年趋势
      columns2: [
        {
          title: "预算单位",
          dataIndex: "budgetName",
          key: "budgetName",
          width: 330,
          scopedSlots: { customRender: "budgetName" },
          //第一列合并三行
          customRender: (text, record, index) => {
            const obj = {
              children: text,
              attrs: {},
            };
            if (index % 3 === 0) {
              obj.attrs.rowSpan = 3;
            } else {
              obj.attrs.rowSpan = 0;
            }
            return obj;
          },
        },
        {
          title: "三公支出类型",
          dataIndex: "type",
          key: "type",
          scopedSlots: { customRender: "type" },
          width: 200,
        },
        {
          title: "当年数据",
          dataIndex: "data",
          key: "data",
          scopedSlots: { customRender: "data" },
          width: 250,
        },
        {
          title: "近五年趋势",
          dataIndex: "graphTrend",
          key: "graphTrend",
          width: 450,
          scopedSlots: { customRender: "graphTrend" },
        },
      ],
      trendGraphData: {
        legend: ["变化趋势"],
        xAxis: ["2020", "2021", "2022", "2023", "2024"],
        seriesData: [
          {
            name: "变化趋势",
            data: [8, 10, 7, 5, 9],
            rate: [8, 10, 7, 5, 9],
          },
        ],
      },
      tableDataTwo: [],
      tableLoading: false,

      //三公费用横向柱状图
      //维度
      choosedRange: "全部",
      rangeOptions: [
        {
          label: "全部",
          value: "全部",
        },
        {
          label: "公务用车费用",
          value: "公务车",
        },
        {
          label: "公务接待费用",
          value: "公务接待",
        },
        {
          label: "因公出国（境）费用",
          value: "因公出国",
        },
      ],
      highNumber: null,
      lowNumber: null,

      //三公费用横向柱状图
      myChart1: null,
      graphData1: {
        // yAxis: [
        //   "预算单位一",
        //   "预算单位二",
        //   "预算单位三",
        //   "预算单位四",
        //   "预算单位五",
        //   "预算单位六",
        //   "预算单位七",
        //   "预算单位八",
        //   "预算单位九",
        //   "预算单位十",
        //   "预算单位十一",
        //   "预算单位十二",
        //   "预算单位十三",
        //   "预算单位十四",
        //   "预算单位十五",
        // ],
        // //单独信息
        // data: [
        //   {
        //     name: "预算单位1",
        //     assertsType: "公务车费用",
        //     count: 1, //在职人数
        //     total: 153, //费用总额
        //     average: 150, //人均费用
        //   },
        //   {
        //     name: "预算单位2",
        //     assertsType: "公务车费用",
        //     count: 2, //在职人数
        //     total: 153, //费用总额
        //     average: 150, //人均费用
        //   },
        //   {
        //     name: "预算单位3",
        //     assertsType: "公务车费用",
        //     count: 3, //在职人数
        //     total: 153, //费用总额
        //     average: 150, //人均费用
        //   },
        //   {
        //     name: "预算单位4",
        //     assertsType: "公务车费用",
        //     count: 4, //在职人数
        //     total: 153, //费用总额
        //     average: 150, //人均费用
        //   },
        //   {
        //     name: "预算单位5",
        //     assertsType: "公务车费用",
        //     count: 5, //在职人数
        //     total: 153, //费用总额
        //     average: 150, //人均费用
        //   },
        //   {
        //     name: "预算单位6",
        //     assertsType: "公务车费用",
        //     count: 6, //在职人数
        //     total: 153, //费用总额
        //     average: 150, //人均费用
        //   },
        //   {
        //     name: "预算单位7",
        //     assertsType: "公务车费用",
        //     count: 7, //在职人数
        //     total: 153, //费用总额
        //     average: 150, //人均费用
        //   },
        //   {
        //     name: "预算单位8",
        //     assertsType: "公务车费用",
        //     count: 8, //在职人数
        //     total: 153, //费用总额
        //     average: 150, //人均费用
        //   },
        //   {
        //     name: "预算单位9",
        //     assertsType: "公务车费用",
        //     count: 9, //在职人数
        //     total: 153, //费用总额
        //     average: 150, //人均费用
        //   },
        //   {
        //     name: "预算单位10",
        //     assertsType: "公务车费用",
        //     count: 10, //在职人数
        //     total: 153, //费用总额
        //     average: 150, //人均费用
        //   },
        //   {
        //     name: "预算单位11",
        //     assertsType: "公务车费用",
        //     count: 11, //在职人数
        //     total: 153, //费用总额
        //     average: 150, //人均费用
        //   },
        //   {
        //     name: "预算单位12",
        //     assertsType: "公务车费用",
        //     count: 12, //在职人数
        //     total: 153, //费用总额
        //     average: 150, //人均费用
        //   },
        //   {
        //     name: "预算单位13",
        //     assertsType: "公务车费用",
        //     count: 13, //在职人数
        //     total: 153, //费用总额
        //     average: 150, //人均费用
        //   },
        //   {
        //     name: "预算单位14",
        //     assertsType: "公务车费用",
        //     count: 14, //在职人数
        //     total: 153, //费用总额
        //     average: 150, //人均费用
        //   },
        //   {
        //     name: "预算单位15",
        //     assertsType: "公务车费用",
        //     count: 15, //在职人数
        //     total: 153, //费用总额
        //     average: 150, //人均费用
        //   },
        // ],
        // seriesData: [
        //   9, 12, 34, 56, 76, 82, 89, 99, 101, 110, 120, 122, 140, 150, 160,
        // ],
        // averageValue: 12.33,
      },

      //人均三公费用右边折线图
      myChart2: null,
      graphData2: {
        // legend: ["主管单位三", "预算单位十五"],
        // xAxis: ["2020", "2021", "2022", "2023", "2024"],
        // yAxis: {
        //   name: "人均费用/元",
        // },
        // seriesData: [
        //   {
        //     name: "主管单位三",
        //     type: "manage",
        //     assertsType: "公务车费用",
        //     count: [15, 30, 35, 30, 60], //在职人数
        //     total: [153, 30, 35, 30, 60], //费用总额
        //     data: [150, 300, 350, 300, 600], //人均费用
        //   },
        //   {
        //     name: "预算单位十五",
        //     type: "budget",
        //     assertsType: "公务车费用",
        //     count: [25, 20, 15, 30, 10],
        //     total: [25, 20, 15, 30, 10],
        //     data: [250, 200, 150, 300, 100],
        //   },
        // ],
      },
    };
  },
  computed: {
    ...mapState("blockAnalysis", ["blockChoosedYear"]),
    ...mapState("managePortrait", ["curTreeItem", "configParams"]),
  },
  watch: {
    highNumber() {
      if (this.lowNumber && this.highNumber <= this.lowNumber) {
        this.highNumber = this.lowNumber + 1;
      }
      this.initEchartsOne();
    },
    lowNumber() {
      if (this.highNumber && this.highNumber <= this.lowNumber) {
        this.lowNumber = this.highNumber - 1;
      }
      this.initEchartsOne();
    },
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

  components: {
    FilterModal,
    AInputNumber: InputNumber,
    ATooltip: Tooltip,
    // AInput: Input,
    AButton: Button,
    AProgress: Progress,
  },
  mounted() {
    window.goBudgetPortrait = this.goBudgetPortrait;
    if (!this.curTreeItem.key) return;
    this.getAllData();
  },
  beforeDestroy() {
    this.myChart1.dispose();
    this.myChart2.dispose();

    const f = () => {
      this.myChart1.resize();
      this.myChart2.resize();
    };
    window.removeEventListener("resize", f);
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
      this.getManagePublicOverview(); //获取概览情况
      this.getManagePublicTableOne(); //获取三公支出分析（按类型）表格
      this.getManagePublicTableTwoFilter(); //三公支出分布（按预算单位）筛选
      this.initAllCharts();
      this.initTable(); //三公支出分布（按预算单位））表格
    },

    //计算三公支出(按类型) 的百分比按照当年的最大值进行计算
    // 计算预算单位当年数据  以3个一组的最大值作为展示横向柱状图的分母
    calculatePercent(text, maxNum, position) {
      if (text.split("+")[position].includes("--") || maxNum === 0) {
        return 0;
      }
      let numberPart = text.split("+")[position].trim(); // Get the first part and trim any whitespace
      let numberValue = parseFloat(numberPart); // Convert to number

      if (!isNaN(numberValue)) {
        return (numberValue / maxNum) * 100;
      } else {
        return 0;
      }
    },

    //加载所有图
    initAllCharts() {
      this.initEchartsOne();
      // this.initEchartsTwo();
      const f = () => {
        this.myChart1.resize();
        // this.myChart2.resize();
      };
      window.addEventListener("resize", f);
    },

    //获取三公概览情况
    async getManagePublicOverview() {
      const json = {
        year: this.configParams.curYear,
        deptCode: this.curTreeItem.key,
      };
      const res = await getManagePublicOverview(json);
      if (res.message === "成功") {
        console.log("message成功 获取三公概览情况", res.data);
        this.threePublicData = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //获取三公支出分析（按类型）表格
    async getManagePublicTableOne() {
      const json = {
        year: this.configParams.curYear,
        deptCode: this.curTreeItem.key,
      };
      const res = await getManagePublicTableOne(json);
      if (res.message === "成功") {
        console.log("message成功 获取三公支出分析（按类型）表格", res.data);
        this.tableData1 = res.data;
        this.maxColumnData = calculateMaxValues(this.tableData1.dataSource1);
        console.log("三公支出分析按类型最大值的数组", this.maxColumnData);
      } else {
        this.$message.error(res.message);
      }
    },

    //三公支出分布（按预算单位））表格
    async getManagePublicTableTwo() {
      const json = {
        year: this.configParams.curYear,
        deptCode: this.curTreeItem.key,
        filterCondition: this.filterConfirmArrOne,
      };
      const res = await getManagePublicTableTwo(json);
      if (res.message === "成功") {
        console.log("message成功 获取三公支出分析（按类型）表格", res.data);
        let data = res.data;
        data.forEach((item) => {
          item.graphTrend.money.type = "line";
          item.graphTrend.money.color = this.lineColor[0];
          item.graphTrend.money.label = {
            show: true, // 显示标签
            position: "top", // 标签位置：top, inside, bottom
            formatter: function (params) {
              return Number(params.data).toLocaleString() + "元";
              // return params.value.toLocaleString() + "元";
            },
          };
        });
        this.tableDataTwo = data;
      } else {
        this.$message.error(res.message);
      }
    },

    //三公支出分布（按预算单位）筛选
    async getManagePublicTableTwoFilter() {
      const res = await getManagePublicTableTwoFilter();
      if (res.message === "成功") {
        console.log("message成功 三公支出分布（按预算单位）筛选", res.data);
        this.paramsOption1 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //人均三公费用对比  横向柱状图
    async getManagePublicGraphOne() {
      const json = {
        year: this.configParams.curYear,
        deptCode: this.curTreeItem.key,
        sgType: this.choosedRange, //三公类型
      };
      const res = await getManagePublicGraphOne(json);
      if (res.message === "成功") {
        console.log("message成功 人均三公费用对比  横向柱状图", res.data);
        this.graphData1 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //人均三公费用对比  折线图
    async getManagePublicGraphTwo(clickDataName, assertsType) {
      const json = {
        year: this.configParams.curYear,
        deptCode: this.curTreeItem.key,
        sgType: assertsType, //三公类型
        unitName: clickDataName, //当前点中的预算单位名称
      };
      const res = await getManagePublicGraphTwo(json);
      if (res.message === "成功") {
        console.log("message成功 人均三公费用对比  折线图", res.data);
        this.graphData2 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //三公支出分布（按预算单位）筛选
    filterOne() {
      this.filterShow1 = true;
    },
    onFilterCancel1() {
      this.filterShow1 = false;
    },
    onFilterConfirm1(filterConfirmArrOne) {
      this.filterConfirmArrOne = filterConfirmArrOne;
      this.initTable();
      this.onFilterCancel1();
    },
    addTable1(json) {
      this.filterTableData1 = [...this.filterTableData1, json];
    },
    delTable1(arr) {
      this.filterTableData1 = arr;
    },

    //三公支出分布按预算单位表格
    getTrendEcharts() {
      setTimeout(() => {
        this.tableDataTwo.forEach((item) => {
          let oldChart = this.$echarts.getInstanceByDom(
            this.$refs["chart" + item.id]
          );
          if (oldChart) {
            oldChart.dispose();
          }
          let myChart = this.$echarts.init(this.$refs["chart" + item.id]);
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
              // trigger: "axis",
              // triggerOn: "click",
              triggerOn: "mousemove", // 设置触发方式为悬停
              borderColor: "transparent",
              formatter: function (params) {
                console.log("params1", params);
                let money = Number(params.data).toLocaleString();
                let total = Number(
                  item.graphTrend.money.total[params.dataIndex]
                ).toLocaleString();
                let rate = item.graphTrend.money.rate[params.dataIndex];

                return `<div class="ratio-tooltip-box" style="pointer-events:auto">
                        <a onClick="goBudgetPortrait('${item.budgetName}')">预算单位名称：${item.budgetName}</a>
                        <div>年份：${params.name}年</div>
                        <div>三公费用类型：${item.type}</div>
                        <div>年度公务车费用：${money}元</div>
                        <div>年度三公支出总额：${total}元</div>
                        <div>占比：${rate}%</div>
                      </div>`;
              },
              // position: function (point) {
              //   return [point[0] - 5, point[1] - 5];
              // },
              confine: true,
            },
            // legend: { data: this.trendGraphData.legend },
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
            //     //   label: {
            //     //     show: true,
            //     //   },
            //     // },
            //     // axisLine: {
            //     //   //坐标轴轴线相关设置。数学上的x轴
            //     //   // show: false,
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
            // 加箭头
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

            // yAxis: {
            //   type: "value",
            //   //不显示y轴线
            //   show: false,
            //   // name: this.trendGraphData.yAxis.name,
            //   minInterval: 1,
            //   axisLabel: {
            //     formatter: "{value}",
            //   },
            //   splitLine: {
            //     lineStyle: {
            //       type: "dashed",
            //     },
            //   },
            // },
            series: [item.graphTrend.money],
          };
          myChart.setOption(option);
          window.addEventListener("resize", () => {
            myChart.resize();
          });
        });
      }, 1000);
    },
    async initTable() {
      await this.getManagePublicTableTwo();
      // this.tableDataTwo = [
      //   {
      //     id: "1",
      //     budgetName: "预算单位一",
      //     type: "公务车费用",
      //     data: "12345+78",
      //     graphTrend: {
      //       money: {
      //         type: "line", //后续数据处理添加
      //         data: [1, 2, 3, 4, 5], //年度费用
      //         total: [1, 2, 3, 4, 5], //年度三公支出总额
      //         rate: [10, 20, 30, 40, 50],
      //         // todo  后续遍历的时候加上
      //         label: {
      //           show: true,
      //           formatter: (params) =>
      //             Number(params.data).toLocaleString() + "元",
      //         },
      //       },
      //     },
      //   },
      //   {
      //     id: "2",
      //     budgetName: "预算单位一",
      //     type: "公务接待费用",
      //     data: "1234+8",
      //     graphTrend: {
      //       money: {
      //         type: "line", //后续数据处理添加
      //         data: [10, 20, 30, 40, 50],
      //         total: [1, 2, 3, 4, 5], //年度三公支出总额
      //         rate: [102, 202, 302, 402, 520],
      //       },
      //     },
      //   },
      //   {
      //     id: "3",
      //     budgetName: "预算单位一",
      //     type: "因公出国（境）费用",
      //     data: "1234+88",
      //     graphTrend: {
      //       money: {
      //         type: "line", //后续数据处理添加
      //         data: [10, 20, 30, 40, 50],
      //         total: [1, 2, 3, 4, 5], //年度三公支出总额
      //         rate: [102, 202, 302, 402, 520],
      //       },
      //     },
      //   },
      // ];
      this.getTrendEcharts();
    },

    async initEchartsOne() {
      //联动需要先clear
      if (this.myChart1) {
        this.myChart1.dispose();
      }
      this.myChart1 = this.$echarts.init(this.$refs.graph1);
      await this.getManagePublicGraphOne();
      const _that = this;
      const option1 = {
        tooltip: {
          enterable: true,
          //trigger: "axis",
          // triggerOn: "click",
          triggerOn: "mousemove", // 设置触发方式为悬停
          borderColor: "transparent",
          //jump
          //2.提供图表穿透功能：用户点击图形上的某一分类后，系统跳转进入【资产卡片明细表】，并自动附带筛选条件【主管单位】【资产类型】【时间范围】。
          formatter: function (params) {
            if (params.componentType === "markLine") return;
            return `<div class="ratio-tooltip-box" style="pointer-events:auto">

                <a onClick="goBudgetPortrait('${
                  _that.graphData1.data[params.dataIndex].name
                }')">预算单位名称：${
              _that.graphData1.data[params.dataIndex].name
            }</a>
                <div>在职人数：${
                  _that.graphData1.data[params.dataIndex].count
                }人</div>
                <div>费用类型：${
                  _that.graphData1.data[params.dataIndex].assertsType
                }</div>
                 <div>费用总额：${Number(
                   _that.graphData1.data[params.dataIndex].total
                 ).toLocaleString()}元</div>
                <div >人均费用：${Number(params.data).toLocaleString()}元</div>
            </div>`;
            // const paramsYear = getYearStartEnd(params.name);
          },
          // position: function (point) {
          //   return [point[0] + 5, point[1] - 100];
          // },
          confine: true,
        },
        grid: {
          x: 15,
          y: 40,
          x2: 35,
          y2: 10,
          containLabel: true,
        },
        xAxis: {
          show: true,
          type: "value",
          splitLine: {
            show: false,
          },
          axisLine: {
            //x轴坐标轴
            show: false,
          },
          axisLabel: {
            show: false,
          },
          axisTick: {
            //x轴刻度线
            show: false,
          },
        },
        yAxis: {
          type: "category",
          data: this.graphData1.yAxis,
          // show:false,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
            alignWithLabel: true,
          },
          splitArea: { show: false },
        },
        series: [
          {
            data: this.graphData1.seriesData, //假数据
            type: "bar",
            showBackground: true,
            backgroundStyle: {
              color: "rgba(180, 180, 180, 0.2)",
              borderRadius: [10, 10, 10, 10], // 圆角设置
            },
            barWidth: 18, //柱图宽度
            itemStyle: {
              normal: {
                // 第一个值表示顶部的左上角，第二个值表示顶部右上角
                // 第三个值表示底部左下角，第四个值表示底部右下角
                barBorderRadius: [10, 10, 10, 10],
                label: {
                  show: true, //是否展示
                  position: "right", //在上方显示
                  textStyle: {
                    //数值样式，显示的文字大小和颜色
                    fontSize: "12",
                    color: "#0A1F44",
                  },
                  formatter: (params) => {
                    const data = params.data;
                    return Number(data).toLocaleString() + "元";
                  },
                },
                color: function (params) {
                  if (_that.highNumber || _that.lowNumber) {
                    if (_that.highNumber && params.data >= _that.highNumber) {
                      // return _that.lineColor[1]; //红
                      return "#fc3f61"; //红
                    } else if (
                      _that.lowNumber &&
                      params.data <= _that.lowNumber
                    ) {
                      return _that.lineColor[1]; // 绿色
                    } else {
                    }
                  } else {
                    return _that.lineColor[0]; // 蓝
                  }
                }, //蓝色
              },
            },
            markLine: {
              label: {
                show: true,
                position: "end",
                formatter: (params) => {
                  return (
                    "主管单位平均值：" +
                    Number(params.value).toLocaleString() +
                    "元"
                  );
                },
                color: "#FE9E17",
              },
              lineStyle: {
                color: "#FE9E17",
                width: 2,
                type: "dashed",
              },
              data: [{ xAxis: _that.graphData1.averageValue }],
              // data: [
              //   {
              //     type: "average",
              //     name: "平均值",
              //   },
              // ],
            },
          },
        ],
        dataZoom: [
          {
            // 设置滚动条的隐藏与显示
            show: _that.graphData1.yAxis.length > 9 ? true : false,
            // 设置滚动条类型
            type: "slider",
            // 设置背景颜色
            backgroundColor: "#fff",
            // 设置选中范围的填充颜色
            fillerColor: "#F1F2F5",
            // 设置边框颜色
            borderColor: "#F1F2F5",
            // 是否显示detail，即拖拽时候显示详细数值信息
            showDetail: false,
            // 数据窗口范围的起始数值
            startValue: _that.graphData1.yAxis.length - 1,
            // 数据窗口范围的结束数值（一页显示多少条数据，从0开始）
            endValue: _that.graphData1.yAxis.length - 9,
            // empty：当前数据窗口外的数据，被设置为空。
            // 即不会影响其他轴的数据范围
            filterMode: "empty",
            // 设置滚动条宽度，相对于盒子宽度
            width: 2,
            // 设置滚动条高度
            height: "100%",
            // bottom: 4,
            // 设置滚动条显示位置
            // left: 20,
            // right: -20, //右边的距离  todo
            // 是否锁定选择区域（或叫做数据窗口）的大小
            zoomLoxk: true, //todo
            // 控制手柄的尺寸
            // handleSize: 0,
            // dataZoom-slider组件离容器下侧的距离
            // xAxisIndex: [0],
            // 控制哪个轴，如果是number表示控制一个轴，
            // 如果是Array表示控制多个轴。此处控制第二根轴
            yAxisIndex: [0, 1],
            // start: 50,
            // end: 50,
            // zoomLock: true, //锁定区域禁止缩放(鼠标滚动会缩放,所以禁止)
            brushSelect: false, //刷选功能
            borderRadius: 3,
            showDataShadow: false, //是否显示数据阴影 默认auto
            // filterMode: "filter",
          },
          {
            // 没有下面这块的话，只能拖动滚动条，
            // 鼠标滚轮在区域内不能控制外部滚动条
            type: "inside",
            yAxisIndex: [0, 1],
            // 滚轮是否触发缩放
            zoomOnMouseWheel: false,
            // 鼠标滚轮触发滚动
            moveOnMouseMove: true,
            moveOnMouseWheel: true,
          },
        ],
      };

      this.myChart1.setOption(option1, true);
      this.graph1SelectedSite =
        this.graphData1.yAxis[this.graphData1.yAxis.length - 1];
      this.graph1Selected(this.graph1SelectedSite, option1);
      this.initEchartsTwo(
        this.graph1SelectedSite,
        this.graphData1.data[this.graphData1.yAxis.length - 1].assertsType
      );
      this.myChart1.on("click", (params) => {
        // const _that = this;
        this.graph1SelectedSite = params.name;
        const clickDataName = params.name;
        this.graph1Selected(clickDataName, option1);
        // console.log(
        //   "4243443443",
        //   _that.graphData1.data[params.dataIndex].assertsType
        // );
        //更新子图  主图子图联动
        this.initEchartsTwo(
          clickDataName,
          _that.graphData1.data[params.dataIndex].assertsType
        );
      });
    },

    // graph1选中效果
    graph1Selected(clickDataName, newOption) {
      newOption.yAxis.axisLabel = {
        // formatter: "{value}",
        formatter: (value) => {
          if (value === clickDataName) {
            return "{special|" + value + "}";
          }
          return value;
        },
        rich: {
          special: {
            color: "red",
            fontWeight: "bold",
            fontSize: 16, // 设置字体大小
          },
        },
        color: function (params) {
          if (params == clickDataName) {
            return "red";
          }
        }, //点击变色
      };
      this.myChart1.setOption(newOption, true);
    },

    //维度选择变换
    handleSubjectChangeOne() {
      this.initEchartsOne();
    },

    //人均三公费用对比的折线趋势图
    async initEchartsTwo(clickDataName, assertsType) {
      //联动需要先clear
      if (this.myChart2) {
        this.myChart2.dispose();
      }
      this.myChart2 = this.$echarts.init(this.$refs.graph2);
      await this.getManagePublicGraphTwo(clickDataName, assertsType);
      const _that = this;
      //整体支出均衡性
      const option2 = {
        tooltip: {
          enterable: true,
          //trigger: "axis",
          // triggerOn: "click",
          triggerOn: "mousemove", // 设置触发方式为悬停
          borderColor: "transparent",
          //jump
          //2.提供图表穿透功能：用户点击图形上的某一分类后，系统跳转进入【资产卡片明细表】，并自动附带筛选条件【主管单位】【资产类型】【时间范围】。
          formatter: function (params) {
            if (params.seriesName.length === 0) {
              return ""; // 没有数据时，不显示 tooltip
            }

            if (
              _that.graphData2.seriesData[params.seriesIndex].type === "manage"
            ) {
              return `<div class="ratio-tooltip-box" style="pointer-events:auto">
                <div>年份：${params.name}</div>
                <div>主管单位名称：${
                  _that.graphData2.seriesData[params.seriesIndex].name
                }</div>
                <div>在职人数：${
                  _that.graphData2.seriesData[params.seriesIndex].count[
                    params.dataIndex
                  ]
                }人</div>
                <div>费用类型：${
                  _that.graphData2.seriesData[params.seriesIndex].assertsType
                }</div>
                 <div>费用总额：${Number(
                   _that.graphData2.seriesData[params.seriesIndex].total[
                     params.dataIndex
                   ]
                 ).toLocaleString()}元</div>
                <div >人均费用：${Number(params.data).toLocaleString()}元</div>
            </div>`;
            } else {
              return `<div class="ratio-tooltip-box" style="pointer-events:auto">
                <div>年份：${params.name}</div>
                <a onClick="goBudgetPortrait('${
                  _that.graphData2.seriesData[params.seriesIndex].name
                }')">预算单位名称：${
                _that.graphData2.seriesData[params.seriesIndex].name
              }</a>
                <div>在职人数：${
                  _that.graphData2.seriesData[params.seriesIndex].count[
                    params.dataIndex
                  ]
                }人</div>
                <div>费用类型：${
                  _that.graphData2.seriesData[params.seriesIndex].assertsType
                }</div>
                 <div>费用总额：${Number(
                   _that.graphData2.seriesData[params.seriesIndex].total[
                     params.dataIndex
                   ]
                 ).toLocaleString()}元</div>
                <div >人均费用：${Number(params.data).toLocaleString()}元</div>


            </div>`;
            }

            // const paramsYear = getYearStartEnd(params.name);
          },
          // position: function (point) {
          //   return [point[0] - 5, point[1] - 5];
          // },
          confine: true,
        },
        legend: {
          data: this.graphData2.legend,
        },
        grid: {
          x: 20,
          y: 50,
          x2: 0,
          y2: 10,
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.graphData2.xAxis,
            axisLabel: {
              color: "#97A3B7",
            },
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
        yAxis: {
          type: "value",
          name: this.graphData2.yAxis.name,
          minInterval: 1,
          axisLabel: {
            formatter: "{value}",
            color: "#97A3B7",
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
          // stack: "Total",
          name: this.graphData2.seriesData[i].name,
          data: this.graphData2.seriesData[i].data,
          color: this.lineColor[i],
          label: {
            show: true,
            formatter: (params) => Number(params.value).toLocaleString(),
          },
        });
      }
      console.log("options2", option2, this.graphData2.seriesData);
      this.myChart2.setOption(option2, true);
      //图表背景色
      // handleAddEchartsBackground(this.myChart2, option2, this.graphData2.xAxis);
    },
  },
};
</script>
<style lang="less">
.unit-three-public {
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

      .unit-three-public-unit {
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

  //三公支出分析按类型表格
  .type-unit-table {
    margin-bottom: 20px;
  }

  //预算单位表格
  //按钮
  .budget-units {
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

  .budget-units-table {
    margin-bottom: 20px;

    .ant-table-row {
      &:hover {
        td {
          background: transparent !important;
        }
      }
    }
  }

  //人均三公费用对比两个图
  .average-money {
    width: 100%;
    display: flex;
    justify-content: space-between;
    // margin-top: 20px;

    &-box {
      // width: calc(50% - 10px);
      border-radius: 6px;
      border: 1px solid #d6dbe3;
      background: #fff;
      height: 510px;
      padding: 12px 20px 20px 20px;

      .content-top {
        width: 100%;
        height: 32px;
        display: flex;
        align-items: center;

        .top-item {
          display: flex;
          align-items: center;
          margin-right: 15px;

          &-select {
            width: 160px;
          }

          .ant-input-number {
            width: 100px;
          }
        }
      }

      .content-graph {
        height: calc(100% - 32px);
        width: 100%;
      }

      //内部标题
      .wrapper-top {
        height: 22px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;

        &-title {
          color: #1c222b;
          font-weight: 600;
        }

        &-action {
          display: flex;
          align-items: center;
          width: 70px;
          justify-content: space-between;

          .action-choose,
          .action-reset {
            color: #1776ff;
            cursor: pointer;
          }
        }
      }

      //内部分割线
      .wrapper-split {
        width: 100%;
        height: 1px;
        background: #016eff;
        margin-bottom: 20px;
      }

      //图片本身
      .wrapper-content {
        width: 100%;
        height: 427px;
        display: flex;
        justify-content: center;

        &-graph {
          width: 90%;
          height: 100%;
        }

        //图4的选择框
        .wrapper-under {
          width: 100%;
          height: 361px;

          .graph-top {
            width: 100%;
            height: 32px;
            display: flex;
            align-items: center;

            .top-item {
              display: flex;
              align-items: center;
              margin-right: 15px;

              &-select {
                width: 90px;
              }
            }
          }

          .graph-under-content {
            width: 100%;
            height: calc(100% - 32px);

            .content-graph {
              width: 90%;
              height: 100%;
            }
          }
        }
      }
    }
  }
}
</style>
