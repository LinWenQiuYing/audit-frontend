<template>
  <div class="three-public">
    <!-- 总览 -->
    <div class="sub-title">三公费用概览</div>
    <div class="three-public-data">
      <div class="three-public-data-item">
        <div
          v-for="(item, index) in threePublicData"
          :key="index"
          class="three-public-unit"
        >
          <div class="unit-top">{{ item.typeName }}</div>
          <div class="unit-middle">{{ Number(item.num).toLocaleString() }}</div>
          <div class="unit-bottom">
            <span class="unit-bottom-title"
              >同比 {{ item.status === 2 ? "--%" : item.percentage }}</span
            >
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
              <icon-svg
                icon-class="icon-down"
                color="#666"
                v-else-if="item.status === 2"
              />
            </div>
          </div>
          <div class="unit-icon">
            <icon-svg :icon-class="`${item.icon}`"></icon-svg>
          </div>
        </div>
      </div>
    </div>
    <!-- 三公费用分布情况 -->
    <div class="sub-title">三公费用分布</div>
    <div class="three-public-income">
      <!-- 左侧按类型分布 -->
      <div class="three-public-income-item">
        <!-- 头部文字 -->
        <div class="item-top">
          <div class="item-top-title">三公费用分布（按类型）</div>
          <a-tooltip placement="topLeft" overlayClassName="item-title-tooltip">
            <template slot="title">
              <span>111111</span>
            </template>
            <div class="tooltip-icon">
              <icon-svg icon-class="icon-warning" color="#1776FF"></icon-svg>
            </div>
          </a-tooltip>
        </div>
        <!-- 分割线 -->
        <div class="item-split"></div>
        <!-- 底部图片 -->
        <div class="item-content">
          <div class="item-content-graph" ref="graph1"></div>
        </div>
      </div>
      <!-- 右侧 -->
      <div class="three-public-income-right">
        <div class="income-right-item">
          <div class="item-top">
            <div class="item-top-title">月趋势图</div>
            <div class="item-top-action">
              <div
                class="action-choose"
                @click="handleChooseBudget('月趋势图主管单位选择')"
              >
                选择展示主管单位
              </div>
              <div class="action-reset" @click="resetGraph2()">重置</div>
              <a-tooltip
                placement="topLeft"
                overlayClassName="wrapper-title-tooltip"
              >
                <template slot="title">
                  <span>111111</span>
                </template>
                <div class="tooltip-icon">
                  <icon-svg
                    icon-class="icon-warning"
                    color="#1776FF"
                  ></icon-svg>
                </div>
              </a-tooltip>
            </div>
          </div>
          <div class="item-split"></div>
          <div class="item-content">
            <div
              class="item-content-graph"
              style="width: 90%"
              ref="graph2"
            ></div>
          </div>
        </div>
        <div class="income-right-item">
          <div class="item-top">
            <div class="item-top-title">年趋势图</div>
            <div class="item-top-action">
              <div
                class="action-choose"
                @click="handleChooseBudget('年趋势图主管单位选择')"
              >
                选择展示主管单位
              </div>
              <div class="action-reset" @click="resetGraph3()">重置</div>
              <a-tooltip
                placement="topLeft"
                overlayClassName="wrapper-title-tooltip"
              >
                <template slot="title">
                  <span>111111</span>
                </template>
                <div class="tooltip-icon">
                  <icon-svg
                    icon-class="icon-warning"
                    color="#1776FF"
                  ></icon-svg>
                </div>
              </a-tooltip>
            </div>
          </div>
          <div class="item-split"></div>
          <div class="item-content">
            <div
              class="item-content-graph"
              style="width: 90%"
              ref="graph3"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <div class="sub-title">人均三公费用排行</div>
    <div class="three-public-trend">
      <div class="three-public-trend-left">
        <div class="trend-left-top">
          <div class="top-title">人均三公费用排行榜</div>
          <a-tooltip placement="topLeft" overlayClassName="top-title-tooltip">
            <template slot="title">
              <span>111111</span>
            </template>
            <div class="tooltip-icon">
              <icon-svg icon-class="icon-warning" color="#1776FF"></icon-svg>
            </div>
          </a-tooltip>
        </div>
        <div class="trend-left-split"></div>
        <div class="trend-left-content">
          <div class="content-top">
            <div class="top-item">
              <div class="top-item-label">三公费用类型：</div>
              <a-select
                class="top-item-select"
                v-model="choosedRange"
                @change="handleSubjectChangeOne"
              >
                <a-select-option
                  v-for="item in rangeOptions"
                  :key="item.label"
                  :title="item.label"
                  :value="item.label"
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
              <a-input-number
                placeholder="请输入"
                :min="0"
                v-model="lowNumber"
              />
            </div>
            <div class="top-item">
              <div class="top-item-label">板块平均值：</div>
              <div class="top-item-value">
                <span style="color: #1776ff">{{ graphData4.averageValue }}</span
                >元
              </div>
            </div>
          </div>
          <!-- <div class="content-graph" ref="graph4"></div> -->
          <div class="wrapper-content">
            <div
              class="wrapper-content-img"
              v-if="!graphData4.moneyList.length"
              style="display: flex; align-items: center"
            >
              <img src="@/assets/images/img/noData.png" alt="" />
            </div>
            <div class="wrapper-content-graph" v-else>
              <div
                :class="[
                  item.name == graph4SelectedSite ? 'progress-choosed' : '',
                  'progress',
                ]"
                v-for="item in graphData4.moneyList"
                :key="item.name"
                @click="changeGraph4SelectedSite(item)"
              >
                <span class="progress-label" :title="item.name">{{
                  item.name
                }}</span>

                <a-popover placement="rightBottom">
                  <template slot="content">
                    <a @click="goManagePortrait(item.name)"
                      >主管单位名称：{{ item.name }}
                    </a>
                    <div>在职人数：{{ item.personNum }}人</div>
                    <div>费用类型：{{ choosedRange }}</div>
                    <div>
                      费用总额：{{ Number(item.moneyTotal).toLocaleString() }}元
                    </div>
                    <div>
                      人均费用：{{
                        Number(item.personMoney).toLocaleString()
                      }}元
                    </div>
                  </template>
                  <a-progress
                    :percent="
                      (Number(item.personMoney) /
                        Number(graphData4.moneyListMax)) *
                      100
                    "
                    :strokeWidth="16"
                    :showInfo="false"
                    :class="[
                      item.personMoney >= highNumber
                        ? 'progress-red'
                        : item.personMoney <= lowNumber
                        ? 'progress-green'
                        : '',
                    ]"
                  />
                </a-popover>

                <span class="progress-text"
                  >{{ parseFloat(item.personMoney).toLocaleString() }}元</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="three-public-trend-item">
        <div class="item-top">
          <div class="item-top-title">主管单位人均三公费用年趋势图</div>
          <a-tooltip placement="topLeft" overlayClassName="item-title-tooltip">
            <template slot="title">
              <span>111111</span>
            </template>
            <div class="tooltip-icon">
              <icon-svg icon-class="icon-warning" color="#1776FF"></icon-svg>
            </div>
          </a-tooltip>
        </div>
        <div class="item-split"></div>
        <div class="item-content">
          <div class="item-content-graph" style="width: 90%" ref="graph5"></div>
        </div>
      </div>
    </div>
    <!-- 选择主管单位弹框 -->
    <a-modal
      class="manage-modal"
      :title="manageTitle"
      :width="400"
      :visible="manageShow"
      :closable="false"
      :destroyOnClose="true"
      @cancel="onCancel"
      @ok="onConfirm"
      :mask="false"
      centered
    >
      <div class="manage-modal-content">
        <!-- <a-tree-select
          v-model="choosedManageUnitMonth"
          class="item-value"
          :tree-data="manageUnitTree"
          tree-checkable
          :show-checked-strategy="SHOW_PARENT"
          search-placeholder="请选择"
          v-if="manageTitle === '月趋势图主管单位选择'"
        /> -->
        <a-select
          mode="multiple"
          class="item-value"
          placeholder="请选择"
          v-model="choosedManageUnitMonth"
          v-if="manageTitle === '月趋势图主管单位选择'"
          @change="changeManageUnitMonth"
        >
          <a-select-option
            v-for="item in manageUnitTree"
            :key="item.key"
            :title="item.value"
            :value="item.value"
          >
            {{ item.key }}
          </a-select-option>
        </a-select>

        <!-- <a-tree-select
          v-model="choosedManageUnitYear"
          class="item-value"
          :tree-data="manageUnitTree"
          tree-checkable
          :show-checked-strategy="SHOW_PARENT"
          search-placeholder="请选择"
          v-if="manageTitle === '年趋势图主管单位选择'"
        /> -->
        <a-select
          mode="multiple"
          class="item-value"
          placeholder="请选择"
          v-model="choosedManageUnitYear"
          v-if="manageTitle === '年趋势图主管单位选择'"
          @change="changeManageUnitYear"
        >
          <a-select-option
            v-for="item in manageUnitTree"
            :key="item.key"
            :title="item.value"
            :value="item.value"
          >
            {{ item.key }}
          </a-select-option>
        </a-select>
      </div>
    </a-modal>
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
  changeChoosedRange,
  getPublicChartFive,
  getPublicChartFour,
  getPublicChartOne,
  getPublicChartThree,
  getPublicChartTwo,
  getPublicManageTree,
  getPublicOverviewData,
  getPublicTop8Month,
  getPublicTop8Year,
  setPlateYearTotal,
  setYearTotal,
} from "@/shared/newApi/block/threePublic.js";
// import { handleAddEchartsBackground } from "@/utils/echarts.js";
import {
  InputNumber,
  Popover,
  Progress,
  Select,
  Tooltip,
  TreeSelect,
} from "ant-design-vue";
// import { mapMutations, mapState } from "vuex";
import { adjustFontSize } from "@/utils/echarts.js";
import { mapState } from "vuex";
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
export default {
  name: "NoTax",
  data() {
    return {
      SHOW_PARENT,
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
      //总览
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
      myChart1: null, //三公费用按类型
      graphData1: {
        // total: 10000000,
        // seriesData: [
        //   { value: 200, name: "公务车费用", per: 20 },
        //   { value: 200, name: "公务接待费用", per: 20 },
        //   { value: 600, name: "因公出国费用", per: 60 },
        // ],
      },
      myChart2: null, //月趋势图
      graphData2: {
        // legend: [
        //   "主管单位一主管单位一主管单位一主管单位一",
        //   "主管单位二主管单位一",
        //   "主管单位三主管单位一",
        //   "主管单位四主管单位一",
        //   "主管单位五",
        //   "主管单位六",
        //   "主管单位七",
        //   "主管单位八",
        //   "主管单位九",
        //   "主管单位十",
        //   "主管单位十一",
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
        // yAxis: {
        //   name: "金额",
        // },
        // seriesData: [
        //   {
        //     name: "主管单位一主管单位一主管单位一主管单位一",
        //     data: [8, 10, 7, 5, 9, 10, 5, 8, 7, 11, 10, 10],
        //     rate: [8, 10, 7, 5, 9, 10, 5, 8, 7, 11, 10, 10],
        //   },
        //   {
        //     name: "主管单位二主管单位一",
        //     data: [9, 8, 5, 10, 11, 7, 9, 6, 10, 10, 6, 9],
        //     rate: [9, 8, 5, 10, 11, 7, 9, 6, 10, 10, 6, 9],
        //   },
        //   {
        //     name: "主管单位三主管单位一",
        //     data: [10, 9, 8, 7, 8, 10, 9, 5, 8, 7, 9, 10],
        //     rate: [10, 9, 8, 7, 8, 10, 9, 5, 8, 7, 9, 10],
        //   },
        //   {
        //     name: "主管单位四主管单位一",
        //     data: [11, 6, 9, 8, 10, 7, 7, 12, 8, 9, 7, 6],
        //     rate: [11, 6, 9, 8, 10, 7, 7, 12, 8, 9, 7, 6],
        //   },
        //   {
        //     name: "主管单位五",
        //     data: [7, 9, 8, 9, 10, 7, 10, 8, 6, 10, 7, 9],
        //     rate: [7, 9, 8, 9, 10, 7, 10, 8, 6, 10, 7, 9],
        //   },
        //   {
        //     name: "主管单位六",
        //     data: [9, 7, 10, 7, 6, 9, 10, 8, 8, 9, 7, 10],
        //     rate: [9, 7, 10, 7, 6, 9, 10, 8, 8, 9, 7, 10],
        //   },
        //   {
        //     name: "主管单位七",
        //     data: [8, 10, 9, 7, 7, 9, 6, 10, 8, 7, 9, 10],
        //     rate: [8, 10, 9, 7, 7, 9, 6, 10, 8, 7, 9, 10],
        //   },
        //   {
        //     name: "主管单位八",
        //     data: [10, 10, 7, 9, 6, 9, 8, 8, 7, 7, 9, 10],
        //     rate: [10, 10, 7, 9, 6, 9, 8, 8, 7, 7, 9, 10],
        //   },
        // ],
      },
      myChart3: null, //历年趋势图
      graphData3: {
        // legend: [
        //   "主管单位一",
        //   "主管单位二",
        //   "主管单位三",
        //   "主管单位四",
        //   "主管单位五",
        //   "主管单位六",
        //   "主管单位七",
        //   "主管单位八",
        // ],
        // xAxis: ["2020", "2021", "2022", "2023", "2024"],
        // yAxis: {
        //   name: "金额",
        // },
        // seriesData: [
        //   {
        //     name: "主管单位一",
        //     data: [8, 10, 7, 5, 9],
        //     rate: [8, 10, 7, 5, 9],
        //   },
        //   {
        //     name: "主管单位二",
        //     data: [9, 8, 5, 10, 11],
        //     rate: [9, 8, 5, 10, 11],
        //   },
        //   {
        //     name: "主管单位三",
        //     data: [10, 9, 8, 7, 8],
        //     rate: [10, 9, 8, 7, 8],
        //   },
        //   {
        //     name: "主管单位四",
        //     data: [11, 6, 9, 8, 1],
        //     rate: [11, 6, 9, 8, 1],
        //   },
        //   {
        //     name: "主管单位五",
        //     data: [12, 4, 15, 12, 6],
        //     rate: [12, 4, 15, 12, 6],
        //   },
        //   {
        //     name: "主管单位六",
        //     data: [8, 9, 13, 13, 6],
        //     rate: [8, 9, 13, 13, 6],
        //   },
        //   {
        //     name: "主管单位七",
        //     data: [9, 19, 10, 16, 6],
        //     rate: [9, 19, 40, 16, 6],
        //   },
        //   {
        //     name: "主管单位八",
        //     data: [10, 12, 19, 17, 6],
        //     rate: [10, 12, 19, 17, 6],
        //   },
        // ],
      },
      // myChart4: null, //三公费用横向柱状图
      // graphData4: {
      //   yAxis: [
      //     "主管单位一",
      //     "主管单位二",
      //     "主管单位三",
      //     "主管单位四",
      //     "主管单位五",
      //     "主管单位六",
      //     "主管单位七",
      //     "主管单位八",
      //     "主管单位九",
      //     "主管单位十",
      //     "主管单位十一",
      //     "主管单位十二",
      //     "主管单位十三",
      //     "主管单位十四",
      //     "主管单位十五",
      //   ],
      //   seriesData: [
      //     {
      //       personNum: 100,
      //       moneyTotal: 1000,
      //       value: 9,
      //     },
      //     {
      //       personNum: 100,
      //       moneyTotal: 1000,
      //       value: 12,
      //     },
      //     {
      //       personNum: 100,
      //       moneyTotal: 1000,
      //       value: 34,
      //     },
      //     {
      //       personNum: 100,
      //       moneyTotal: 1000,
      //       value: 56,
      //     },
      //     {
      //       personNum: 100,
      //       moneyTotal: 1000,
      //       value: 76,
      //     },
      //     {
      //       personNum: 100,
      //       moneyTotal: 1000,
      //       value: 82,
      //     },
      //     {
      //       personNum: 100,
      //       moneyTotal: 1000,
      //       value: 89,
      //     },
      //     {
      //       personNum: 100,
      //       moneyTotal: 1000,
      //       value: 99,
      //     },
      //     {
      //       personNum: 100,
      //       moneyTotal: 1000,
      //       value: 101,
      //     },
      //     {
      //       personNum: 100,
      //       moneyTotal: 1000,
      //       value: 110,
      //     },
      //     {
      //       personNum: 100,
      //       moneyTotal: 1000,
      //       value: 120,
      //     },
      //     {
      //       personNum: 100,
      //       moneyTotal: 1000,
      //       value: 140,
      //     },
      //     {
      //       personNum: 100,
      //       moneyTotal: 1000,
      //       value: 150,
      //     },
      //     {
      //       personNum: 100,
      //       moneyTotal: 1000,
      //       value: 160,
      //     },
      //     {
      //       personNum: 100,
      //       moneyTotal: 1000,
      //       value: 170,
      //     },
      //   ],
      //   averageValue: 100,
      // },
      //
      graph4SelectedSite: null, //图四选中的单位名称
      graphData4: {
        moneyList: [
          // {
          //   name: "单位名称叫做数据问题2121得得得", //的单位名称
          //   personNum: 100, //在职
          //   moneyTotal: 10000, //费用总额
          //   personMoney: 12334, //人均费用
          // },
          // {
          //   name: "单位名称叫做数据得得",
          //   personNum: 100,
          //   moneyTotal: 10000,
          //   personMoney: 123,
          // },
          // {
          //   name: "单位名称叫做数",
          //   personNum: 100,
          //   moneyTotal: 10000,
          //   personMoney: 43,
          // },
        ],
        moneyListMax: 1000, //排行里面的金额最大值
        averageValue: 100, //板块平均值
      },

      myChart5: null, //主管单位人均三公费用年趋势图
      graphData5: {
        // legend: ["板块", "主管单位十五"],
        // xAxis: ["2020", "2021", "2022", "2023", "2024"],
        // yAxis: {
        //   name: "人均费用（元）",
        // },
        // seriesData: [
        //   {
        //     name: "板块",
        //     // data: [132, 101, 134, 23, 347],
        //     data: [
        //       {
        //         personNum: 100,
        //         moneyType: "支出",
        //         moneyTotal: 1000,
        //         value: 132,
        //       },
        //       {
        //         personNum: 100,
        //         moneyType: "支出",
        //         moneyTotal: 1000,
        //         value: 101,
        //       },
        //       {
        //         personNum: 100,
        //         moneyType: "支出",
        //         moneyTotal: 1000,
        //         value: 134,
        //       },
        //       {
        //         personNum: 100,
        //         moneyType: "支出",
        //         moneyTotal: 1000,
        //         value: 23,
        //       },
        //       {
        //         personNum: 100,
        //         moneyType: "支出",
        //         moneyTotal: 1000,
        //         value: 347,
        //       },
        //     ],
        //   },
        //   {
        //     name: "主管单位十五",
        //     // data: [22, 182, 234, 31, 345],
        //     data: [
        //       {
        //         personNum: 100,
        //         moneyType: "支出",
        //         moneyTotal: 1000,
        //         value: 22,
        //       },
        //       {
        //         personNum: 100,
        //         moneyType: "支出",
        //         moneyTotal: 1000,
        //         value: 182,
        //       },
        //       {
        //         personNum: 100,
        //         moneyType: "支出",
        //         moneyTotal: 1000,
        //         value: 234,
        //       },
        //       {
        //         personNum: 100,
        //         moneyType: "支出",
        //         moneyTotal: 1000,
        //         value: 31,
        //       },
        //       {
        //         personNum: 100,
        //         moneyType: "支出",
        //         moneyTotal: 1000,
        //         value: 345,
        //       },
        //     ],
        //   },
        // ],
      },

      //主管单位弹框
      manageShow: false,
      manageTitle: "",

      //月趋势用户选择的主管单位
      choosedManageUnitMonth: [],
      choosedManageUnitMonthCopy: [],
      choosedManageUnitMonthTop8: [], //top8  月主管单位
      manageUnitTree: [
        // {
        //   key: "0001——主管单位一",
        //   value: "1",
        // },
        // {
        //   key: "0002——主管单位二",
        //   value: "2",
        // },
        // {
        //   key: "0003——主管单位三",
        //   value: "3",
        // },
        // {
        //   key: "0004——主管单位四",
        //   value: "4",
        // },
        // {
        //   key: "0005——主管单位五",
        //   value: "5",
        // },
        // {
        //   key: "0006——主管单位六",
        //   value: "6",
        // },
        // {
        //   key: "0007——主管单位七",
        //   value: "7",
        // },
        // {
        //   key: "0008——主管单位八",
        //   value: "8",
        // },
        // {
        //   key: "0009——主管单位九",
        //   value: "9",
        // },
      ],
      //年趋势用户选择的主管单位
      choosedManageUnitYear: [],
      choosedManageUnitYearCopy: [],
      choosedManageUnitYearTop8: [], //top8  年主管单位
      //三公费用类型
      choosedRange: "全部",
      rangeOptions: [
        {
          label: "全部",
          value: 1,
        },
        {
          label: "公务用车费用",
          value: 2,
        },
        {
          label: "公务接待费用",
          value: 3,
        },
        {
          label: "因公出国（境）费用",
          value: 4,
        },
      ],
      highNumber: 150,
      lowNumber: 50,
      // 环形图上次点击的层级和name
      lastSelectedIndex: null,
      lastSelectedName: null,
      yearMoney: "", // 年度金额
      plateYearMoney: "", // 板块金额
      activeIdxMonth: -1,
    };
  },
  computed: {
    ...mapState("blockAnalysis", [
      "choosedBlockName",
      "choosedBlockId",
      "blockChoosedYear",
    ]),
  },
  watch: {
    highNumber() {
      if (this.lowNumber && this.highNumber <= this.lowNumber) {
        this.highNumber = this.lowNumber + 1;
      }

      this.initEchartsFour();
    },
    lowNumber() {
      if (this.highNumber && this.highNumber <= this.lowNumber) {
        this.lowNumber = this.highNumber - 1;
      }

      this.initEchartsFour();
    },
    choosedBlockId: {
      async handler(newVal, oldVal) {
        console.log("5656555", newVal, oldVal);
        await this.getPublicOverviewData();
        this.getPublicManageTree();
        this.initAllCharts();
      },
      deep: true,
    },
    blockChoosedYear: {
      async handler(newVal, oldVal) {
        console.log("5656555", newVal, oldVal);
        await this.getPublicOverviewData();
        this.getPublicManageTree();
        this.initAllCharts();
      },
    },
  },
  components: {
    ATooltip: Tooltip,
    AInputNumber: InputNumber,
    ASelect: Select,
    AProgress: Progress,
    APopover: Popover,
    // ATreeSelect: TreeSelect,
  },
  async mounted() {
    window.goManagePortrait = this.goManagePortrait;
    //板块数据
    await this.getPublicOverviewData();
    //获取所有主管单位
    this.getPublicManageTree();
    //月趋势图top8主管单位
    // this.getPublicTop8Month();
    //年趋势图top8主管单位
    // this.getPublicTop8Year();
    this.initAllCharts();
  },
  beforeDestroy() {
    // this.myChart1.dispose();
    // this.myChart2.dispose();
    // this.myChart3.dispose();
    // this.myChart4.dispose();
    // this.myChart5.dispose();

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
    initAllCharts() {
      this.initEchartsOne();
      // this.initEchartsTwo();
      // this.initEchartsThree();
      this.initEchartsFour();
      // this.initEchartsFive();
      const f = () => {
        this.myChart1.resize();
        this.myChart2.resize();
        this.myChart3.resize();
        this.myChart4.resize();
        this.myChart5.resize();
      };
      window.addEventListener("resize", f);
    },

    //跳转到主管画像页面
    goManagePortrait(name) {
      this.$router.push({
        name: "managePortrait",
        query: { key: name, type: "title" },
      });
    },
    //获取总览数据
    async getPublicOverviewData() {
      const json = {
        unitIndustry: this.choosedBlockName,
        year: this.blockChoosedYear,
      };
      const res = await getPublicOverviewData(json);
      if (res.message === "成功") {
        this.threePublicData = res.data.filter(
          (item) => item.typeName.indexOf("疑似") === -1
        );
        this.plateYearMoney = res.data[0].num;
        setPlateYearTotal(this.plateYearMoney);
      } else {
        this.$message(res.message);
      }
    },

    //获取所有主管单位
    async getPublicManageTree() {
      const json = {
        year: this.blockChoosedYear,
        unitIndustry: this.choosedBlockName,
        sgTypeName: this.lastSelectedName,
      };
      const res = await getPublicManageTree(json);
      // console.log("页面内获取所有主管单位res", res);
      if (res.message === "成功") {
        // console.log("message成功页面获取所有主管单位", res.data);
        this.manageUnitTree = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //获取月趋势图的top8主管单位
    async getPublicTop8Month() {
      const json = {
        year: this.blockChoosedYear,
        unitIndustry: this.choosedBlockName,
        sgTypeName: this.lastSelectedName,
      };
      const res = await getPublicTop8Month(json);
      // console.log("页面内 获取月趋势图的top8主管单位 res", res);
      if (res.message === "成功") {
        // console.log("message成功 获取月趋势图的top8主管单位", res.data);
        (this.choosedManageUnitMonth = res.data),
          (this.choosedManageUnitMonthCopy = res.data),
          (this.choosedManageUnitMonthTop8 = res.data); //记录当前top8的主管单位
        this.initEchartsTwo();
      } else {
        this.$message.error(res.message);
      }
    },

    //获取年趋势图的top8主管单位
    async getPublicTop8Year() {
      const json = {
        year: this.blockChoosedYear,
        unitIndustry: this.choosedBlockName,
        sgTypeName: this.lastSelectedName,
      };
      const res = await getPublicTop8Year(json);
      // console.log("页面内 获取年趋势图的top8主管单位 res", res);
      if (res.message === "成功") {
        // console.log("message成功 获取年趋势图的top8主管单位", res.data);
        this.choosedManageUnitYear = res.data;
        this.choosedManageUnitYearCopy = res.data;
        this.choosedManageUnitYearTop8 = res.data; //top8  年主管单位
        this.initEchartsThree();
      } else {
        this.$message.error(res.message);
      }
    },

    //月趋势图重置
    resetGraph2() {
      this.choosedManageUnitMonth = this.choosedManageUnitMonthTop8;
      this.choosedManageUnitMonthCopy = this.choosedManageUnitMonthTop8;
      this.getPublicTop8Month();
    },

    //年趋势图重置
    resetGraph3() {
      this.choosedManageUnitYear = this.choosedManageUnitYearTop8;
      this.choosedManageUnitYearCopy = this.choosedManageUnitYearTop8;
      this.getPublicTop8Year();
    },

    // 三公费用按类型环形图
    async getPublicChartOne() {
      const json = {
        year: this.blockChoosedYear,
        unitIndustry: this.choosedBlockName,
      };
      const res = await getPublicChartOne(json);
      console.log("页面内图一饼图返回的数据res", res);
      if (res.message === "成功") {
        this.graphData1 = res.data;
        const maxIdx = this.graphData1.seriesData.findIndex(
          (item) =>
            item.value ===
            Math.max(...this.graphData1.seriesData.map((item) => item.value))
        );
        let num = 0;
        this.graphData1.seriesData.forEach((item, index) => {
          if (index !== maxIdx) {
            item.itemStyle = {
              color: this.lineColor[num],
              shadowColor: "rgba(0, 0, 0, 0.5)",
              shadowBlur: 0,
            };
            num++;
          } else {
            this.myChart1.dispatchAction({
              type: "highlight",
              seriesIndex: 0,
              dataIndex: maxIdx,
            });
            item.itemStyle = {
              color: "#1feb1f",
              shadowColor: "rgba(0, 0, 0, 0.5)",
              shadowBlur: 20,
            };
          }
        });
        this.lastSelectedName = this.graphData1.seriesData[maxIdx].name;
        this.yearMoney = res.data.seriesData[maxIdx].value;
        setYearTotal(this.yearMoney);
        this.getPublicTop8Month();
        this.getPublicTop8Year();
      } else {
        this.$message(res.message);
      }
    },
    async initEchartsOne() {
      if (this.myChart1) {
        this.myChart1.dispose();
      }
      this.myChart1 = this.$echarts.init(this.$refs.graph1);
      await this.getPublicChartOne();
      const _that = this;
      let maxWidth = 120; // 设置最大宽度
      let initialFontSize = 24; // 初始字体大小
      let adjustedFontSize = adjustFontSize(
        Number(this.graphData1.total).toLocaleString(),
        maxWidth,
        initialFontSize
      );
      const option1 = {
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove",
          enterable: true,
          //triggerOn: "click", // 设置触发方式为点击
          formatter: (params) => {
            const name = params.data.name;
            const value = Number(params.data.value).toLocaleString();
            return name + "：" + value + "元";
          },
        },
        // legend: {
        //   type: "scroll",
        //   orient: "horizontal",
        //   //top: -10,
        //   // bottom: 60,
        //   //data: this.legendData,
        // },
        series: [
          {
            type: "pie",
            radius: ["45%", "65%"],
            center: ["50%", "50%"],
            // roseType: "radius",
            // 避免数据过小 不展示
            minAngle: 1,
            data: this.graphData1.seriesData,
            // color: [this.lineColor[0], this.lineColor[1], this.lineColor[2]],
            label: {
              position: "outer",
              alignTo: "edge",
              margin: 2,
              formatter: (params) => {
                const name = params.data.name;
                const money = Number(params.data.value).toLocaleString();
                const ratio = params.data.per;
                return (
                  name +
                  "\n\n" +
                  // "支出金额：" +
                  money +
                  "元\n\n" +
                  // "占比：" +
                  ratio +
                  "%"
                );
                // return name + "：" + ratio + "%\n" + money + "元";
              },
            },
            //伸出的箭头
            labelLine: {
              //以下代码注释为实现：指示线颜色与扇形块颜色一致
              lineStyle: {
                color: "#97A3B7",
              },
              smooth: 0.2,
              // length: 30,
              // length2: 20,
            },
            animationType: "scale",
            animationEasing: "elasticOut",
            animationDelay: function () {
              return Math.random() * 200;
            },
          },
        ],
        //中间文字
        graphic: [
          {
            //环形图中间添加文字
            type: "text", //通过不同top值可以设置上下显示
            left: "center",
            top: 145,
            style: {
              text: this.graphData1.total.toLocaleString(),
              textAlign: "center",
              fill: "#1C222B", //文字的颜色
              fontSize: adjustedFontSize,
              lineHeight: adjustedFontSize,
              fontWeight: 600,
            },
          },
          {
            //环形图中间添加文字
            type: "text", //通过不同top值可以设置上下显示
            left: "center",
            top: 170,
            style: {
              text: "资金总额  (元)",
              textAlign: "center",
              fill: "##1C222B", //文字的颜色
              fontSize: 12,
              lineHeight: 20,
            },
          },
        ],
      };

      this.myChart1.setOption(option1);
      this.myChart1.on("click", (params) => {
        // 取消选中
        if (this.lastSelectedName === params.data.name) {
          this.lastSelectedIndex = null;
          this.lastSelectedName = null;
          this.yearMoney = _that.graphData1.total;
          setYearTotal(this.yearMoney);
          this.graphData1.seriesData.forEach((series, index) => {
            this.myChart1.dispatchAction({
              type: "downplay",
              seriesIndex: 0,
              dataIndex: index,
            });
            series.itemStyle = {
              color: this.lineColor[index],
              shadowColor: "rgba(0, 0, 0, 0.5)",
              shadowBlur: 0,
            };
          });
        } else {
          this.lastSelectedIndex = params.dataIndex;
          this.lastSelectedName = params.data.name;
          this.yearMoney = params.data.value;
          setYearTotal(this.yearMoney);
          this.myChart1.dispatchAction({
            type: "highlight",
            seriesIndex: params.seriesIndex,
            dataIndex: params.dataIndex,
          });
          let selectedIdx = this.graphData1.seriesData.findIndex(
            (item) => item.name === this.lastSelectedName
          );
          this.graphData1.seriesData[selectedIdx].itemStyle = {
            color: "#1feb1f",
            shadowColor: "rgba(0, 0, 0, 0.5)",
            shadowBlur: 20,
          };
          let dataIndxArr = [];
          this.graphData1.seriesData.forEach((series, index) =>
            dataIndxArr.push(index)
          );
          let colorIdx = 0;
          if (dataIndxArr.length)
            dataIndxArr.forEach((idx) => {
              if (idx !== this.lastSelectedIndex) {
                this.myChart1.dispatchAction({
                  type: "downplay",
                  seriesIndex: params.seriesIndex,
                  dataIndex: idx,
                });
                this.graphData1.seriesData[idx].itemStyle = {
                  color: this.lineColor[colorIdx],
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                  shadowBlur: 0,
                };
                colorIdx++;
              }
            });
        }
        this.myChart1.setOption(option1);
        this.getPublicTop8Month();
        this.getPublicTop8Year();
      });
      this.myChart1.on("mouseover", (params) => {
        if (params.componentType !== "series") return;
        let selectedIdx = this.graphData1.seriesData.findIndex(
          (item) => item.name === params.name
        );
        this.graphData1.seriesData.forEach((item) => {
          item.itemStyle = {
            ...item.itemStyle,
            shadowBlur: 0,
          };
        });
        this.graphData1.seriesData[selectedIdx].itemStyle = {
          ...this.graphData1.seriesData[selectedIdx].itemStyle,
          opacity: 1,
          shadowBlur: 20,
        };
        this.myChart1.setOption(option1);
      });
      this.myChart1.on("mouseout", () => {
        this.graphData1.seriesData.forEach((item) => {
          item.itemStyle = {
            ...item.itemStyle,
            shadowBlur: 0,
          };
        });
        const activeIdx = this.graphData1.seriesData.findIndex(
          (item) => item.name === this.lastSelectedName
        );
        this.graphData1.seriesData[activeIdx].itemStyle = {
          ...this.graphData1.seriesData[activeIdx].itemStyle,
          shadowBlur: 20,
        };
        this.myChart1.setOption(option1);
      });
    },

    // 主管单位月趋势图
    async getPublicChartTwo() {
      const json = {
        year: this.blockChoosedYear,
        unitIndustry: this.choosedBlockName,
        dept_code: this.choosedManageUnitMonth,
        sgTypeName: this.lastSelectedName,
      };
      const res = await getPublicChartTwo(json);
      if (res.message === "成功") {
        this.graphData2 = res.data;
      } else {
        this.$message(res.message);
      }
    },
    async initEchartsTwo() {
      //联动需要先clear
      if (this.myChart2) {
        this.myChart2.dispose();
      }
      this.myChart2 = this.$echarts.init(this.$refs.graph2);
      await this.getPublicChartTwo();
      const _that = this;
      //整体支出均衡性
      const option2 = {
        tooltip: {
          enterable: true,
          //trigger: "axis",
          // triggerOn: "click",
          triggerOn: "mousemove", // 设置触发方式为悬停
          formatter: function (params) {
            if (params.seriesName.length === 0) {
              return ""; // 没有数据时，不显示 tooltip
            }
            return `<div class="ratio-tooltip-box" style="pointer-events:auto">
              <a onClick="goManagePortrait('${
                params.seriesName
              }')">主管单位名称：${params.seriesName}</a>
              <div>年度：${_that.blockChoosedYear}</div>
              <div>月份：${params.name}年</div>
              <div>三公费用类型：${
                _that.lastSelectedName ? _that.lastSelectedName : "全部"
              }</div>
              <div>月度费用：${Number(params.data).toLocaleString()}元</div>
              <div>年度费用：${Number(_that.yearMoney).toLocaleString()}元</div>
              <div>占比：${
                _that.graphData2.seriesData[params.seriesIndex].rate[
                  params.dataIndex
                ]
              }%</div>
            </div>`;
          },
        },
        legend: [
          {
            data: this.graphData2.legend.slice(0, 4),
            // x: "left",
            y: 0,
            formatter: function (name) {
              if (name.length > 8) {
                return name.slice(0, 6) + "...";
              } else {
                return name;
              }
            },
            tooltip: {
              show: true,
              trigger: "item",
            },
          },
          {
            data: this.graphData2.legend.slice(4, 8),
            // x: "left",
            y: 22,
            formatter: function (name) {
              if (name.length > 8) {
                return name.slice(0, 6) + "...";
              } else {
                return name;
              }
            },
            tooltip: {
              show: true,
              trigger: "item",
            },
          },
        ],
        grid: {
          x: 15,
          y: 90,
          x2: 15,
          y2: 10,
          containLabel: true,
        },
        emphasis: {
          focus: "series",
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
            axisLabel: {
              interval: 0,
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
          name: this.graphData2.yAxis.name + "（元）",
          minInterval: 1,
          axisLabel: {
            formatter: "{value}",
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
          splitNumber: 4,
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
            position: "top",
            formatter: function (params) {
              return params.value.toLocaleString();
            },
          },
        });
      }
      this.myChart2.setOption(option2, true);
      //图表背景色
      // handleAddEchartsBackground(this.myChart2, option2, this.graphData2.xAxis);
      // this.myChart2.on("click", function (params) {
      //   if (params.componentSubType === "line") {
      //     const activeIdx = _that.graphData2.seriesData.findIndex(
      //       (item) => item.name === params.seriesName
      //     );
      //     if (_that.activeIdxMonth !== activeIdx) {
      //       if (activeIdx > -1) {
      //         _that.graphData2.seriesData[activeIdx].lineStyle = {
      //           width: 8,
      //           opacity: 1,
      //         };
      //         _that.graphData2.seriesData.forEach((item, index) => {
      //           if (index !== activeIdx) {
      //             item.lineStyle = {
      //               width: 2,
      //               opacity: 0.1,
      //             };
      //           }
      //         });
      //       }
      //       _that.activeIdxMonth = activeIdx;
      //     } else {
      //       _that.graphData2.seriesData.forEach((item) => {
      //         item.lineStyle = {
      //           width: 2,
      //           opacity: 1,
      //         };
      //       });
      //       _that.activeIdxMonth = -1;
      //     }
      //   }
      //   console.log(_that.graphData2);
      //   for (let i = 0; i < _that.graphData2.seriesData.length; i++) {
      //     option2.series.push({
      //       type: "line",
      //       // stack: "Total",
      //       name: _that.graphData2.seriesData[i].name,
      //       data: _that.graphData2.seriesData[i].data,
      //       color: _that.lineColor[i],
      //     });
      //   }
      //   _that.myChart2.setOption(option2, true);
      // });
    },

    // 主管单位年趋势图
    async getPublicChartThree() {
      const json = {
        year: this.blockChoosedYear,
        unitIndustry: this.choosedBlockName,
        dept_code: this.choosedManageUnitYear,
        sgTypeName: this.lastSelectedName,
      };
      const res = await getPublicChartThree(json);
      if (res.message === "成功") {
        this.graphData3 = res.data;
      } else {
        this.$message(res.message);
      }
    },
    async initEchartsThree() {
      //联动需要先clear
      if (this.myChart3) {
        this.myChart3.dispose();
      }
      this.myChart3 = this.$echarts.init(this.$refs.graph3);
      await this.getPublicChartThree();
      const _that = this;
      //整体支出均衡性
      const option3 = {
        tooltip: {
          enterable: true,
          // trigger: "axis",
          // triggerOn: "click",
          triggerOn: "mousemove", // 设置触发方式为悬停
          formatter: function (params) {
            if (params.seriesName.length === 0) {
              return ""; // 没有数据时，不显示 tooltip
            }
            return `<div class="ratio-tooltip-box" style="pointer-events:auto">
              <a onClick="goManagePortrait('${
                params.seriesName
              }')">主管单位名称：${params.seriesName}</a>
              <div>年度：${params.name}</div>
              <div>三公费用类型：${
                _that.lastSelectedName ? _that.lastSelectedName : "全部"
              }</div>
              <div>主管单位年度费用：${Number(
                params.data
              ).toLocaleString()}元</div>
              <div>选定板块年度费用：${Number(
                _that.plateYearMoney
              ).toLocaleString()}元</div>
              <div>占比：${
                _that.graphData3.seriesData[params.seriesIndex].rate[
                  params.dataIndex
                ]
              }%</div>
            </div>`;
          },
        },
        // legend: [
        //   {
        //     data: this.graphData3.legend.slice(0, 4),
        //     y: 0,
        //   },
        //   {
        //     data: this.graphData3.legend.slice(4, 8),
        //     y: 20,
        //   },
        // ],
        legend: [
          {
            data: this.graphData3.legend.slice(0, 4),
            // x: "left",
            y: 0,
            formatter: function (name) {
              if (name.length > 8) {
                return name.slice(0, 6) + "...";
              } else {
                return name;
              }
            },
            tooltip: {
              show: true,
              trigger: "item",
            },
          },
          {
            data: this.graphData3.legend.slice(4, 8),
            // x: "left",
            y: 22,
            formatter: function (name) {
              if (name.length > 8) {
                return name.slice(0, 6) + "...";
              } else {
                return name;
              }
            },
            tooltip: {
              show: true,
              trigger: "item",
            },
          },
        ],
        grid: {
          x: 15,
          y: 90,
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
            axisLabel: {
              interval: 0,
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
          name: this.graphData3.yAxis.name + "（元）",
          minInterval: 1,
          axisLabel: {
            formatter: "{value}",
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
          splitNumber: 4,
          min: "dataMin",
          max: "dataMax",
        },
        series: [],
      };
      // 年
      for (let i = 0; i < this.graphData3.seriesData.length; i++) {
        option3.series.push({
          type: "line",
          // stack: "Total",
          name: this.graphData3.seriesData[i].name,
          data: this.graphData3.seriesData[i].data,
          color: this.lineColor[i],
          label: {
            show: true,
            position: "top",
            formatter: function (params) {
              return params.value.toLocaleString();
            },
          },
        });
      }
      this.myChart3.setOption(option3, true);
      //图表背景色
      // handleAddEchartsBackground(this.myChart3, option3, this.graphData3.xAxis);
    },

    //最新的图4绘制
    async initEchartsFour() {
      const json = {
        year: this.blockChoosedYear,
        unitIndustry: this.choosedBlockName,
        sgTypeName: this.choosedRange === "全部" ? "" : this.choosedRange,
      };
      const res = await getPublicChartFour(json);
      if (res.message === "成功") {
        this.graphData4 = res.data;
        if (this.graphData4.moneyList.length) {
          this.graph4SelectedSite = this.graphData4.moneyList[0].name;
          this.initEchartsFive();
        }
      } else {
        this.$message(res.message);
      }
    },
    changeGraph4SelectedSite(item) {
      this.graph4SelectedSite = item.name;
      //更新子图  主图子图联动
      this.initEchartsFive();
    },

    //横向柱状图
    // async getPublicChartFour() {
    //   const json = {
    //     year: this.blockChoosedYear,
    //     unitIndustry: this.choosedBlockName,
    //     sgTypeName: this.choosedRange === "全部" ? "" : this.choosedRange,
    //   };
    //   const res = await getPublicChartFour(json);
    //   if (res.message === "成功") {
    //     this.graphData4 = res.data;
    //   } else {
    //     this.$message(res.message);
    //   }
    // },
    // async initEchartsFour() {
    //   //联动需要先clear
    //   if (this.myChart4) {
    //     this.myChart4.dispose();
    //   }
    //   this.myChart4 = this.$echarts.init(this.$refs.graph4);
    //   // await this.getPublicChartFour();
    //   const _that = this;
    //   const option4 = {
    //     grid: {
    //       x: 15, //左
    //       y: 40, //上
    //       x2: 70, //右
    //       y2: 10,
    //       containLabel: true,
    //     },
    //     xAxis: {
    //       show: true,
    //       type: "value",
    //       splitLine: {
    //         show: false,
    //       },
    //       axisLine: {
    //         //x轴坐标轴
    //         show: false,
    //       },
    //       axisLabel: {
    //         show: false,
    //       },
    //       axisTick: {
    //         //x轴刻度线
    //         show: false,
    //       },
    //     },
    //     yAxis: {
    //       type: "category",
    //       data: this.graphData4.yAxis,
    //       // show:false,
    //       axisLine: {
    //         show: false,
    //       },
    //       axisTick: {
    //         show: false,
    //         alignWithLabel: true,
    //       },
    //       splitArea: { show: false },
    //     },
    //     series: [
    //       {
    //         data: this.graphData4.seriesData, //假数据
    //         type: "bar",
    //         showBackground: true,
    //         backgroundStyle: {
    //           color: "rgba(180, 180, 180, 0.2)",
    //           borderRadius: [10, 10, 10, 10], // 圆角设置
    //         },
    //         barWidth: 18, //柱图宽度
    //         itemStyle: {
    //           normal: {
    //             // 第一个值表示顶部的左上角，第二个值表示顶部右上角
    //             // 第三个值表示底部左下角，第四个值表示底部右下角
    //             barBorderRadius: [10, 10, 10, 10],
    //             label: {
    //               show: true, //是否展示
    //               position: "right", //在上方显示
    //               textStyle: {
    //                 //数值样式，显示的文字大小和颜色
    //                 fontSize: "12",
    //                 color: "#0A1F44",
    //               },
    //               formatter: (params) => {
    //                 const data = params.value;
    //                 return Number(data).toLocaleString() + "元";
    //               },
    //             },
    //             color: function (params) {
    //               if (_that.highNumber || _that.lowNumber) {
    //                 if (_that.highNumber && params.value >= _that.highNumber) {
    //                   // return _that.lineColor[1]; //红
    //                   return "#fc3f61"; //红
    //                 } else if (
    //                   _that.lowNumber &&
    //                   params.value <= _that.lowNumber
    //                 ) {
    //                   return _that.lineColor[0]; // 蓝
    //                 } else {
    //                   return _that.lineColor[1]; // 绿色
    //                 }
    //               } else {
    //                 return _that.lineColor[1]; // 绿色
    //               }
    //             }, //蓝色
    //           },
    //         },
    //         markLine: {
    //           label: {
    //             show: true,
    //             position: "end",
    //             formatter: (params) => {
    //               return (
    //                 "板块平均值：" +
    //                 Number(params.value).toLocaleString() +
    //                 "元"
    //               );
    //             },
    //             color: "#FE9E17",
    //             silent: true,
    //           },
    //           lineStyle: {
    //             color: "#FE9E17",
    //             width: 2,
    //             type: "dashed",
    //           },
    //           // data: [
    //           //   {
    //           //     type: "average",
    //           //     name: "平均值",
    //           //   },
    //           // ],
    //           data: [{ xAxis: _that.graphData4.averageValue }],
    //         },
    //       },
    //     ],
    //     dataZoom: [
    //       {
    //         // 设置滚动条的隐藏与显示
    //         show: _that.graphData4.yAxis.length > 9 ? true : false,
    //         // 设置滚动条类型
    //         type: "slider",
    //         // 设置背景颜色
    //         backgroundColor: "#fff",
    //         // 设置选中范围的填充颜色
    //         fillerColor: "#F1F2F5",
    //         // 设置边框颜色
    //         borderColor: "#F1F2F5",
    //         // 是否显示detail，即拖拽时候显示详细数值信息
    //         showDetail: false,
    //         // 数据窗口范围的起始数值
    //         startValue: _that.graphData4.yAxis.length - 1,
    //         // 数据窗口范围的结束数值（一页显示多少条数据，从0开始）
    //         endValue: _that.graphData4.yAxis.length - 9,
    //         // empty：当前数据窗口外的数据，被设置为空。
    //         // 即不会影响其他轴的数据范围
    //         filterMode: "empty",
    //         // 设置滚动条宽度，相对于盒子宽度
    //         width: 2,
    //         // 设置滚动条高度
    //         height: "100%",
    //         // bottom: 4,
    //         // 设置滚动条显示位置
    //         // left: 20,
    //         // right: -20, //右边的距离  todo
    //         // 是否锁定选择区域（或叫做数据窗口）的大小
    //         zoomLoxk: true, //todo
    //         // 控制手柄的尺寸
    //         // handleSize: 0,
    //         // dataZoom-slider组件离容器下侧的距离
    //         // xAxisIndex: [0],
    //         // 控制哪个轴，如果是number表示控制一个轴，
    //         // 如果是Array表示控制多个轴。此处控制第二根轴
    //         yAxisIndex: [0, 1],
    //         // start: 50,
    //         // end: 50,
    //         // zoomLock: true, //锁定区域禁止缩放(鼠标滚动会缩放,所以禁止)
    //         brushSelect: false, //刷选功能
    //         borderRadius: 3,
    //         showDataShadow: false, //是否显示数据阴影 默认auto
    //         // filterMode: "filter",
    //       },
    //       {
    //         // 没有下面这块的话，只能拖动滚动条，
    //         // 鼠标滚轮在区域内不能控制外部滚动条
    //         type: "inside",
    //         yAxisIndex: [0, 1],
    //         // 滚轮是否触发缩放
    //         zoomOnMouseWheel: false,
    //         // 鼠标滚轮触发滚动
    //         moveOnMouseMove: true,
    //         moveOnMouseWheel: true,
    //       },
    //     ],
    //     tooltip: {
    //       enterable: true,
    //       //trigger: "axis",
    //       triggerOn: "mousemove",
    //       formatter: function (params) {
    //         if (params.componentType === "markLine") return;
    //         return `<div class="ratio-tooltip-box" style="pointer-events:auto">
    //           <a onClick="goManagePortrait('${params.name}')">主管单位名称：${
    //           params.name
    //         }</a>
    //           <div>在职人数：${params.data.personNum}人</div>
    //           <div>费用类型：${_that.choosedRange}</div>
    //           <div>费用总额：${Number(
    //             params.data.moneyTotal
    //           ).toLocaleString()}元</div>
    //           <div>人均费用：${Number(params.value).toLocaleString()}元</div>
    //         </div>`;
    //       },
    //     },
    //   };

    //   this.myChart4.setOption(option4, true);
    //   this.graph4SelectedSite =
    //     this.graphData4.yAxis[this.graphData4.yAxis.length - 1];
    //   this.graph4Selected(this.graph4SelectedSite, option4);
    //   this.initEchartsFive();
    //   this.myChart4.on("click", (params) => {
    //     // const _that = this;
    //     this.graph4SelectedSite = params.name;
    //     const clickDataName = params.name;
    //     this.graph4Selected(clickDataName, option4);
    //     //更新子图  主图子图联动
    //     this.initEchartsFive();
    //   });
    // },
    // // graph4选中效果
    // graph4Selected(clickDataName, newOption) {
    //   newOption.yAxis.axisLabel = {
    //     // formatter: "{value}",
    //     formatter: (value) => {
    //       if (value === clickDataName) {
    //         return "{special|" + value + "}";
    //       }
    //       return value;
    //     },
    //     rich: {
    //       special: {
    //         color: "red",
    //         fontWeight: "bold",
    //         fontSize: 16, // 设置字体大小
    //       },
    //     },
    //     color: function (params) {
    //       if (params == clickDataName) {
    //         return "red";
    //       }
    //     }, //点击变色
    //   };
    //   this.myChart4.setOption(newOption, true);
    // },

    // 主管单位人均三公费用年趋势图
    async getPublicChartFive() {
      const json = {
        year: this.blockChoosedYear,
        unitIndustry: this.choosedBlockName,
        deptName: this.graph4SelectedSite,
        sgTypeName: this.choosedRange === "全部" ? "" : this.choosedRange,
      };
      const res = await getPublicChartFive(json);
      if (res.message === "成功") {
        this.graphData5 = res.data;
      } else {
        this.$message(res.message);
      }
    },
    async initEchartsFive() {
      //联动需要先clear
      if (this.myChart5) {
        this.myChart5.dispose();
      }
      this.myChart5 = this.$echarts.init(this.$refs.graph5);
      await this.getPublicChartFive();
      const _that = this;
      this.graphData5.legend.forEach((item, index) => {
        if (item === "板块") {
          if (this.choosedBlockName.length) {
            this.graphData5.legend[index] = this.choosedBlockName.join(",");
          }
        }
      });
      //整体支出均衡性
      const option5 = {
        tooltip: {
          enterable: true,
          //trigger: "axis",
          triggerOn: "mousemove",
          formatter: function (params) {
            if (params.seriesName.length === 0) {
              return ""; // 没有数据时，不显示 tooltip
            }
            if (params.seriesIndex === 0) {
              return `<div class="ratio-tooltip-box" style="pointer-events:auto">
              <div>板块：${_that.choosedBlockName.join(",")}</div>
              <div>年份：${params.name}年</div>
              <div>在职人数：${params.data.personNum}人</div>
              <div>费用类型：${params.data.moneyType}</div>
              <div>费用总额：${Number(
                params.data.moneyTotal
              ).toLocaleString()}元</div>
              <div>人均费用：${Number(
                params.data.value
              ).toLocaleString()}元</div>
            </div>`;
            } else {
              return `<div class="ratio-tooltip-box" style="pointer-events:auto">
              <a onClick="goManagePortrait('${params.seriesName}')">主管单位：${
                params.seriesName
              }</a>
              <div>年份：${params.name}年</div>
              <div>在职人数：${params.data.personNum}人</div>
              <div>费用类型：${params.data.moneyType}</div>
              <div>费用总额：${Number(
                params.data.moneyTotal
              ).toLocaleString()}元</div>
              <div>人均费用：${Number(
                params.data.value
              ).toLocaleString()}元</div>
            </div>`;
            }
            // return `<div class="ratio-tooltip-box" style="pointer-events:auto">
            //   <div>${
            //     params.seriesIndex === 0
            //       ? `板块：${_that.choosedBlockName.join(",")}`
            //       : `主管单位：${params.seriesName}`
            //   }</div>
            //   <div>年份：${params.name}年</div>
            //   <div>在职人数：${params.data.personNum}人</div>
            //   <div>费用类型：${params.data.moneyType}</div>
            //   <div>费用总额：${Number(
            //     params.data.moneyTotal
            //   ).toLocaleString()}元</div>
            //   <div>人均费用：${Number(
            //     params.data.value
            //   ).toLocaleString()}元</div>
            // </div>`;
          },
        },
        legend: {
          type: "scroll",
          // top: 10,
          data: this.graphData5.legend,
          // data: [],
        },
        grid: {
          x: 15,
          y: 70,
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
          name: this.graphData5.yAxis.name,
          minInterval: 1,
          axisLabel: {
            formatter: "{value}",
            margin: 15,
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
      // 年
      for (let i = 0; i < this.graphData5.seriesData.length; i++) {
        if (this.graphData5.seriesData[i].name === "板块") {
          this.graphData5.seriesData[i].name = this.choosedBlockName.join(",");
        }
        option5.series.push({
          type: "line",
          // stack: "Total",
          name: this.graphData5.seriesData[i].name,
          data: this.graphData5.seriesData[i].data,
          color: this.lineColor[i],
          label: {
            show: true,
            position: "top",
            formatter: function (params) {
              return params.value.toLocaleString();
            },
          },
        });
      }
      this.myChart5.setOption(option5, true);
      //图表背景色
      // handleAddEchartsBackground(this.myChart5, option5, this.graphData5.xAxis);
    },

    //选择展示主管单位
    handleChooseBudget(value) {
      this.manageShow = true;
      this.manageTitle = value;
    },
    onCancel() {
      this.manageShow = false;
      if (this.manageTitle === "月趋势图主管单位选择") {
        this.choosedManageUnitMonth = this.choosedManageUnitMonthCopy;
      } else {
        this.choosedManageUnitYear = this.choosedManageUnitYearCopy;
      }
    },
    onConfirm() {
      if (this.manageTitle === "月趋势图主管单位选择") {
        this.initEchartsTwo();
        this.choosedManageUnitMonthCopy = this.choosedManageUnitMonth;
      } else {
        this.initEchartsThree();
        this.choosedManageUnitYearCopy = this.choosedManageUnitYear;
      }
      this.onCancel();
    },

    //三公费用类型选择变换
    handleSubjectChangeOne() {
      this.initEchartsFour();
      changeChoosedRange(this.choosedRange);
    },

    // 主管单位选择限制为至多8个
    changeManageUnitMonth(value) {
      if (value.length > 8) {
        this.$message.warning("主管单位至多选择8个");
        this.choosedManageUnitMonth.splice(
          this.choosedManageUnitMonth.length - 1,
          1
        );
      }
    },
    changeManageUnitYear(value) {
      if (value.length > 8) {
        this.$message.warning("主管单位至多选择8个");
        this.choosedManageUnitYear.splice(
          this.choosedManageUnitYear.length - 1,
          1
        );
      }
    },
  },
};
</script>
<style lang="less">
.three-public {
  width: 100%;
  background: #ffffff;
  padding: 0 20px 20px 20px;

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

      .three-public-unit {
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

  &-income {
    width: 100%;
    height: 400px;
    // height: 740px;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;

    &-item {
      height: 100%;
      width: calc(25% - 10px);
      // width: calc(50% - 10px);
      border: 1px solid #d6dbe3;
      border-radius: 6px;
      padding: 12px 20px 20px 20px;

      .item-top {
        height: 22px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 9px;

        &-title {
          color: #1c222b;
          font-weight: 600;
        }
      }

      .item-split {
        width: 100%;
        height: 1px;
        background: #016eff;
        margin-bottom: 20px;
      }

      .item-content {
        width: 100%;
        height: calc(100% - 43px);
        display: flex;
        justify-content: center;

        &-graph {
          width: 100%;
          height: 100%;
        }
      }
    }

    &-right {
      height: 100%;
      width: calc(75% - 10px);
      // width: calc(50% - 10px);
      display: flex;
      // flex-direction: column;
      justify-content: space-between;

      .income-right-item {
        width: calc(50% - 10px);
        // width: 100%;
        // height: 360px;
        height: 100%;
        border: 1px solid #d6dbe3;
        border-radius: 6px;
        padding: 12px 20px 20px 20px;

        .item-top {
          height: 22px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 9px;

          &-title {
            color: #1c222b;
            font-weight: 600;
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

        .item-split {
          width: 100%;
          height: 1px;
          background: #016eff;
          margin-bottom: 20px;
        }

        .item-content {
          width: 100%;
          height: calc(100% - 43px);
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

  &-trend {
    width: 100%;
    height: 468px;
    margin-top: 20px;
    display: flex;

    &-left {
      width: calc(50% - 10px);
      height: 468px;
      margin-right: 20px;
      border-radius: 6px;
      border: 1px solid #d6dbe3;
      padding: 12px 20px 20px 20px;

      .trend-left-top {
        height: 22px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;

        .top-title {
          color: #1c222b;
          font-weight: 600;
        }
      }

      .trend-left-split {
        width: 100%;
        height: 1px;
        background: #016eff;
        margin-bottom: 20px;
      }

      .trend-left-content {
        width: 100%;
        height: calc(100% - 51px);

        .content-top {
          width: 100%;
          height: 32px;
          display: flex;
          align-items: center;
          margin-bottom: 16px;

          .top-item {
            display: flex;
            align-items: center;
            margin-right: 15px;

            &-select {
              width: 150px;
            }

            .ant-input-number {
              width: 100px;
            }
          }
        }

        // .content-graph {
        //   height: calc(100% - 32px);
        //   width: 100%;
        // }

        // 进度条图的部分
        .wrapper-content {
          width: 100%;
          height: calc(100% - 43px);
          max-height: calc(100% - 43px);
          overflow-y: scroll;
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
              height: 34px;
              display: flex;
              align-items: center;
              margin-bottom: 8px;
              padding-left: 4px;
              cursor: pointer;

              &:first-child {
                margin-top: 14px;
              }

              &-label {
                margin-right: 12px;
                width: 155px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                // text-align: right;
                // display: flex;
                display: inline-block;
              }

              .ant-progress {
                width: calc(100% - 307px);
                flex: 1;

                .ant-progress-outer {
                  .ant-progress-inner {
                    background: #f1f2f5 !important;
                  }
                }
              }

              .progress-red {
                .ant-progress-outer {
                  .ant-progress-inner {
                    .ant-progress-bg,
                    .ant-progress-success-bg {
                      background: red !important;
                    }
                  }
                }
              }

              .progress-green {
                .ant-progress-outer {
                  .ant-progress-inner {
                    .ant-progress-bg,
                    .ant-progress-success-bg {
                      background: #1bb46d !important;
                    }
                  }
                }
              }

              &-text {
                width: 128px;
                margin-left: 12px;

                &.short {
                  width: 54px;
                }
              }
            }

            .progress-choosed {
              background: #e6f4ff;
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

      // .trend-left-top {
      //   width: 100%;
      //   height: 32px;
      //   margin-bottom: 20px;
      //   display: flex;
      //   align-items: center;

      //   .top-item {
      //     display: flex;
      //     align-items: center;
      //     margin-right: 20px;

      //     &-select {
      //       width: 200px;
      //     }
      //   }
      // }

      // .trend-left-content {
      //   width: 100%;
      //   height: calc(100% - 52px);
      //   border-radius: 6px;
      //   border: 1px solid #d6dbe3;

      //   .content-graph {
      //     width: 90%;
      //     height: 100%;
      //   }
      // }
    }

    &-item {
      height: 100%;
      width: calc(50% - 10px);
      border: 1px solid #d6dbe3;
      border-radius: 6px;
      padding: 12px 20px 20px 20px;

      .item-top {
        height: 22px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 9px;

        &-title {
          color: #1c222b;
          font-weight: 600;
        }
      }

      .item-split {
        width: 100%;
        height: 1px;
        background: #016eff;
        margin-bottom: 20px;
      }

      .item-content {
        width: 100%;
        height: calc(100% - 43px);
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

// 弹框
.manage-modal {
  &-content {
    .item-value {
      width: 100%;
    }
  }
}

// 右侧提示图标
.tooltip-icon {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
}
</style>
