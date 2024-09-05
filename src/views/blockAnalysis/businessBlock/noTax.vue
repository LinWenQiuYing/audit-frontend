<template>
  <div class="no-tax">
    <!-- 第一行的四个非税收入方块 -->
    <div class="sub-title">非税收入概览</div>
    <div class="no-tax-data">
      <div class="no-tax-data-item">
        <div
          v-for="(item, index) in noTaxData"
          :key="index"
          class="no-tax-unit"
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
    <!-- 第二行的分布情况 -->
    <div class="sub-title">非税收入分布</div>
    <div class="no-tax-income">
      <!-- 左侧按类型分布 -->
      <div class="no-tax-income-item">
        <!-- 头部文字 -->
        <div class="item-top">
          <div class="item-top-title">非税收入分布（按类型）</div>
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
      <!-- 右侧按主管单位分布 -->
      <div class="no-tax-income-item">
        <!-- 头部文字 -->
        <div class="item-top">
          <div class="item-top-title">非税收入分布情况（按主管单位）</div>
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
          <div class="item-content-graph" ref="graph2"></div>
        </div>
      </div>
    </div>
    <!-- 第三行的历年趋势图 -->
    <div class="trend-chart">
      <div class="wrapper-top">
        <div class="wrapper-top-title">历年趋势图</div>
        <div class="wrapper-top-action">
          <div
            class="action-choose"
            @click="handleChooseBudget('主管单位选择')"
          >
            请选择展示主管单位
          </div>
          <div class="action-reset" @click="initGraph3()">重置</div>
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
      <div class="wrapper-split"></div>
      <div class="trend-chart-buttons">
        非税收入类型:
        <a-tree-select
          v-model="notaxIncomeType"
          class="item-value"
          style="width: 200px"
          :tree-data="typeOptions"
          :tree-checkable="false"
          search-placeholder="选择非税收入类型"
          @change="handleChange"
        />
        <!-- <a-select
          ref="select"
          v-model="notaxIncomeType"
          style="width: 200px"
          @change="handleChange"
        >
          <a-select-option
            v-for="item in typeOptions"
            :key="item.label"
            :title="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </a-select-option>
        </a-select> -->
        排序:
        <a-radio-group
          :options="orderChose"
          v-model="orderType"
          @change="onChangeOrder"
        />
      </div>
      <div class="wrapper-content">
        <div class="wrapper-content-graph" ref="graph3"></div>
      </div>
    </div>
    <!-- 选择主管单位弹框 -->
    <a-modal
      class="budget-modal"
      :title="unitTitle"
      :width="400"
      :visible="unitShow"
      :closable="false"
      :destroyOnClose="true"
      @cancel="onCancel"
      @ok="onConfirm"
      :mask="false"
      centered
    >
      <div class="budget-modal-content">
        <a-select
          mode="multiple"
          class="item-value"
          placeholder="请选择"
          v-model="choosedManageUnit"
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
          v-model="choosedManageUnit"
          class="item-value"
          :tree-data="manageUnitTree"
          :tree-checkable="true"
          search-placeholder="选择展示主管单位"
        /> -->
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
  sunColor,
} from "@/assets/theme/model.js";
import {
  getNoTaxOverviewData,
  getNoTaxChartOne,
  getNoTaxChartTwo,
  getNoTaxChartThree,
  getNoTaxChartThreeType,
  getNoTaxChartThreeUnit,
  getNoTaxChartThreeMoneyTop8,
  getNoTaxChartThreeProjectTop8,
} from "@/shared/newApi/block/noTax.js";
import { getYearStartEnd } from "@/utils/common.js";
//import { handleAddEchartsBackground } from "@/utils/echarts.js";
import { Radio, Tooltip, TreeSelect, Select } from "ant-design-vue";
import { mapState } from "vuex";
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const RadioGroup = Radio.Group;
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
      //旭日图颜色
      sunColor,
      //第一行非税收入方块的暂时写死的数据
      noTaxData: [
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
        //   typeName: "非税收入主管单位数量（个）",
        //   num: 17774,
        //   percentage: "8%",
        //   status: 0, //0:down  1:up
        //   icon: "非税收入主管单位数量",
        // },
        // {
        //   id: 3,
        //   typeName: "非税收入类型数量（个）",
        //   num: 17774,
        //   percentage: "8%",
        //   status: 0, //0:down  1:up
        //   icon: "非税收入类型",
        // },
        // {
        //   id: 4,
        //   typeName: "非税收入项目数量（个）",
        //   num: 17774,
        //   percentage: "8%",
        //   status: 2, //0:down  1:up
        //   icon: "非税收入项目数量",
        // },
      ],
      noTaxMoney: null, //非税收入总金额
      //图1
      //玫瑰图上次点击的层级和name
      lastSelectedLevel: null,
      lastSelectedName: null,
      graphData1: [],

      // graphData1: [
      //   {
      //     name: "行政事业性收费收入",
      //     value: 558.41,
      //     per: 96.69,
      //     children: [
      //       {
      //         name: "事业单位国有资产出租、出借收入",
      //         value: 38.47,
      //         per: 6.66,
      //         children: null,
      //         level: 2,
      //       },
      //       {
      //         name: "事业单位国有资产处置收入",
      //         value: 46.9,
      //         per: 8.12,
      //         children: null,
      //         level: 2,
      //       },
      //       {
      //         name: "其他利息收入",
      //         value: 140.77,
      //         per: 24.37,
      //         children: null,
      //         level: 2,
      //       },
      //       {
      //         name: "其他国有资源（资产）有偿使用收入",
      //         value: 29.67,
      //         per: 5.14,
      //         children: null,
      //         level: 2,
      //       },
      //       {
      //         name: "其他收入",
      //         value: 2.05,
      //         per: 0.35,
      //         children: null,
      //         level: 2,
      //       },
      //       {
      //         name: "外商投资企业土地使用费",
      //         value: 48.91,
      //         per: 8.47,
      //         children: null,
      //         level: 2,
      //       },
      //       {
      //         name: "政府信息公开信息处理费",
      //         value: 0,
      //         per: 0,
      //         children: null,
      //         level: 2,
      //       },
      //       {
      //         name: "教育收费",
      //         value: 1.05,
      //         per: 0.18,
      //         children: null,
      //         level: 2,
      //       },
      //       {
      //         name: "特种作业人员安全技术考试费",
      //         value: 22.09,
      //         per: 3.82,
      //         children: null,
      //         level: 2,
      //       },
      //       {
      //         name: "耕地开垦费",
      //         value: 227.11,
      //         per: 39.33,
      //         children: null,
      //         level: 2,
      //       },
      //       {
      //         name: "行政单位国有资产出租,出借收入",
      //         value: 1.39,
      //         per: 0.24,
      //         children: null,
      //         level: 2,
      //       },
      //       {
      //         name: "行政单位国有资产处置收入",
      //         value: 0,
      //         per: 0,
      //         children: null,
      //         level: 2,
      //       },
      //     ],
      //     level: 1,
      //   },
      //   {
      //     name: "罚没收入",
      //     value: 19.11,
      //     per: 3.31,
      //     children: [
      //       {
      //         name: "其他一般罚没收入",
      //         value: 9.98,
      //         per: 1.73,
      //         children: null,
      //         level: 2,
      //       },
      //       {
      //         name: "应急管理罚没收入",
      //         value: 9.13,
      //         per: 1.58,
      //         children: null,
      //         level: 2,
      //       },
      //     ],
      //     level: 1,
      //   },
      // ],

      myChart1: null, //按类型图
      // //图2
      graphData2: {},

      // graphData2: {
      //   seriesData: [
      //     {
      //       name: "上海市教育委员会",
      //       code: "050",
      //       rate: 812.87,
      //       nontaxJe: 4690.26,
      //     },
      //     {
      //       name: "上海市水务局（上海市海洋局）",
      //       code: "137",
      //       rate: 702.39,
      //       nontaxJe: 4052.77,
      //     },
      //     {
      //       name: "中国（上海）自由贸易试验区临港新片区管理委员会",
      //       code: "191",
      //       rate: 236.41,
      //       nontaxJe: 1364.09,
      //     },
      //     {
      //       name: "上海市体育局",
      //       code: "053",
      //       rate: 225.65,
      //       nontaxJe: 1301.99,
      //     },
      //     {
      //       name: "上海市浦东新区人民法院",
      //       code: "286",
      //       rate: 196.18,
      //       nontaxJe: 1131.97,
      //     },
      //     {
      //       name: "上海市民政局",
      //       code: "094",
      //       rate: 190.5,
      //       nontaxJe: 1099.19,
      //     },
      //     {
      //       name: "上海金融法院",
      //       code: "188",
      //       rate: 175.05,
      //       nontaxJe: 1010.03,
      //     },
      //     {
      //       name: "上海市虹口区人民法院",
      //       code: "281",
      //       rate: 141.21,
      //       nontaxJe: 814.77,
      //     },
      //     {
      //       name: "上海市市场监督管理局",
      //       code: "105",
      //       rate: 87.38,
      //       nontaxJe: 504.17,
      //     },
      //     {
      //       name: "上海市第一中级人民法院",
      //       code: "271",
      //       rate: 87.04,
      //       nontaxJe: 502.22,
      //     },
      //     {
      //       name: "上海市第一中级人民法院",
      //       code: "271",
      //       rate: 84.39,
      //       nontaxJe: 486.94,
      //     },
      //     {
      //       name: "上海市教育委员会",
      //       code: "050",
      //       rate: 79.79,
      //       nontaxJe: 460.39,
      //     },
      //     {
      //       name: "上海市体育局",
      //       code: "053",
      //       rate: 77.26,
      //       nontaxJe: 445.76,
      //     },
      //     {
      //       name: "上海市教育委员会",
      //       code: "050",
      //       rate: 72.97,
      //       nontaxJe: 421.02,
      //     },
      //     {
      //       name: "上海市市场监督管理局",
      //       code: "105",
      //       rate: 65.19,
      //       nontaxJe: 376.14,
      //     },
      //     {
      //       name: "上海市第二中级人民法院",
      //       code: "272",
      //       rate: 63.86,
      //       nontaxJe: 368.46,
      //     },
      //     {
      //       name: "上海市黄浦区人民法院",
      //       code: "276",
      //       rate: 58.63,
      //       nontaxJe: 338.27,
      //     },
      //     {
      //       name: "上海市静安区人民法院",
      //       code: "279",
      //       rate: 51.34,
      //       nontaxJe: 296.2,
      //     },
      //     {
      //       name: "上海市闵行区人民法院",
      //       code: "283",
      //       rate: 48.21,
      //       nontaxJe: 278.17,
      //     },
      //     {
      //       name: "上海市黄浦区人民法院",
      //       code: "276",
      //       rate: 47.03,
      //       nontaxJe: 271.38,
      //     },
      //     {
      //       name: "上海市住房和城乡建设管理委员会",
      //       code: "186",
      //       rate: 45.14,
      //       nontaxJe: 260.44,
      //     },
      //     {
      //       name: "上海市教育委员会",
      //       code: "050",
      //       rate: 42.33,
      //       nontaxJe: 244.26,
      //     },
      //     {
      //       name: "上海市第一中级人民法院",
      //       code: "271",
      //       rate: 39.87,
      //       nontaxJe: 230.06,
      //     },
      //     {
      //       name: "上海市民政局",
      //       code: "094",
      //       rate: 39.84,
      //       nontaxJe: 229.89,
      //     },
      //     {
      //       name: "上海市松江区人民法院",
      //       code: "288",
      //       rate: 39.57,
      //       nontaxJe: 228.29,
      //     },
      //     {
      //       name: "上海市规划和自然资源局",
      //       code: "166",
      //       rate: 39.36,
      //       nontaxJe: 227.11,
      //     },
      //     {
      //       name: "上海市青浦区人民法院",
      //       code: "289",
      //       rate: 36.61,
      //       nontaxJe: 211.26,
      //     },
      //     {
      //       name: "上海市徐汇区人民法院",
      //       code: "277",
      //       rate: 36.42,
      //       nontaxJe: 210.12,
      //     },
      //     {
      //       name: "上海市体育局",
      //       code: "053",
      //       rate: 35.79,
      //       nontaxJe: 206.48,
      //     },
      //     {
      //       name: "上海市交通委员会",
      //       code: "113",
      //       rate: 34.63,
      //       nontaxJe: 199.79,
      //     },
      //     {
      //       name: "上海市宝山区人民法院",
      //       code: "284",
      //       rate: 31.78,
      //       nontaxJe: 183.36,
      //     },
      //     {
      //       name: "上海市静安区人民法院",
      //       code: "279",
      //       rate: 31.41,
      //       nontaxJe: 181.22,
      //     },
      //     {
      //       name: "上海市嘉定区人民法院",
      //       code: "285",
      //       rate: 31.11,
      //       nontaxJe: 179.51,
      //     },
      //     {
      //       name: "上海市教育委员会",
      //       code: "050",
      //       rate: 31.0,
      //       nontaxJe: 178.89,
      //     },
      //     {
      //       name: "上海市浦东新区人民法院",
      //       code: "286",
      //       rate: 30.41,
      //       nontaxJe: 175.48,
      //     },
      //     {
      //       name: "上海市浦东新区人民法院",
      //       code: "286",
      //       rate: 29.19,
      //       nontaxJe: 168.41,
      //     },
      //     {
      //       name: "上海市长宁区人民法院",
      //       code: "278",
      //       rate: 27.96,
      //       nontaxJe: 161.33,
      //     },
      //     {
      //       name: "上海市虹口区人民法院",
      //       code: "281",
      //       rate: 26.26,
      //       nontaxJe: 151.51,
      //     },
      //     {
      //       name: "上海市闵行区人民法院",
      //       code: "283",
      //       rate: 26.17,
      //       nontaxJe: 151.02,
      //     },
      //     {
      //       name: "中国（上海）自由贸易试验区临港新片区管理委员会",
      //       code: "191",
      //       rate: 26.03,
      //       nontaxJe: 150.18,
      //     },
      //     {
      //       name: "上海市奉贤区人民法院",
      //       code: "290",
      //       rate: 24.2,
      //       nontaxJe: 139.66,
      //     },
      //     {
      //       name: "上海市静安区人民法院",
      //       code: "279",
      //       rate: 23.73,
      //       nontaxJe: 136.91,
      //     },
      //     {
      //       name: "上海市普陀区人民法院",
      //       code: "280",
      //       rate: 22.46,
      //       nontaxJe: 129.61,
      //     },
      //     {
      //       name: "上海市规划和自然资源局",
      //       code: "166",
      //       rate: 22.22,
      //       nontaxJe: 128.19,
      //     },
      //     {
      //       name: "上海市普陀区人民法院",
      //       code: "280",
      //       rate: 21.87,
      //       nontaxJe: 126.22,
      //     },
      //     {
      //       name: "上海市教育委员会",
      //       code: "050",
      //       rate: 21.72,
      //       nontaxJe: 125.32,
      //     },
      //     {
      //       name: "上海市教育委员会",
      //       code: "050",
      //       rate: 20.12,
      //       nontaxJe: 116.07,
      //     },
      //     {
      //       name: "上海市徐汇区人民法院",
      //       code: "277",
      //       rate: 19.14,
      //       nontaxJe: 110.43,
      //     },
      //     {
      //       name: "上海市嘉定区人民法院",
      //       code: "285",
      //       rate: 18.62,
      //       nontaxJe: 107.45,
      //     },
      //     {
      //       name: "上海市宝山区人民法院",
      //       code: "284",
      //       rate: 17.07,
      //       nontaxJe: 98.47,
      //     },
      //     {
      //       name: "上海市杨浦区人民法院",
      //       code: "282",
      //       rate: 17.04,
      //       nontaxJe: 98.32,
      //     },
      //     {
      //       name: "上海铁路运输法院",
      //       code: "275",
      //       rate: 16.68,
      //       nontaxJe: 96.26,
      //     },
      //     {
      //       name: "上海市金山区人民法院",
      //       code: "287",
      //       rate: 14.98,
      //       nontaxJe: 86.46,
      //     },
      //     {
      //       name: "上海市青浦区人民法院",
      //       code: "289",
      //       rate: 14.74,
      //       nontaxJe: 85.06,
      //     },
      //     {
      //       name: "上海市黄浦区人民法院",
      //       code: "276",
      //       rate: 14.66,
      //       nontaxJe: 84.57,
      //     },
      //     {
      //       name: "中共上海市纪律检查委员会机关",
      //       code: "142",
      //       rate: 14.49,
      //       nontaxJe: 83.62,
      //     },
      //     {
      //       name: "上海市交通委员会",
      //       code: "113",
      //       rate: 14.2,
      //       nontaxJe: 81.92,
      //     },
      //     {
      //       name: "上海市金山区人民法院",
      //       code: "287",
      //       rate: 14.16,
      //       nontaxJe: 81.69,
      //     },
      //     {
      //       name: "上海市长宁区人民法院",
      //       code: "278",
      //       rate: 13.42,
      //       nontaxJe: 77.46,
      //     },
      //     {
      //       name: "上海市松江区人民法院",
      //       code: "288",
      //       rate: 13.39,
      //       nontaxJe: 77.28,
      //     },
      //     {
      //       name: "上海市教育委员会",
      //       code: "050",
      //       rate: 12.91,
      //       nontaxJe: 74.46,
      //     },
      //     {
      //       name: "上海市第二中级人民法院",
      //       code: "272",
      //       rate: 12.83,
      //       nontaxJe: 74.01,
      //     },
      //     {
      //       name: "上海市教育委员会",
      //       code: "050",
      //       rate: 11.45,
      //       nontaxJe: 66.09,
      //     },
      //     {
      //       name: "上海市闵行区人民法院",
      //       code: "283",
      //       rate: 11.31,
      //       nontaxJe: 65.24,
      //     },
      //     {
      //       name: "上海市药品监督管理局",
      //       code: "107",
      //       rate: 10.78,
      //       nontaxJe: 62.22,
      //     },
      //     {
      //       name: "上海市体育局",
      //       code: "053",
      //       rate: 10.23,
      //       nontaxJe: 59.02,
      //     },
      //     {
      //       name: "上海市崇明区人民法院",
      //       code: "291",
      //       rate: 9.82,
      //       nontaxJe: 56.67,
      //     },
      //     {
      //       name: "上海市交通委员会",
      //       code: "113",
      //       rate: 9.66,
      //       nontaxJe: 55.74,
      //     },
      //     {
      //       name: "上海市徐汇区人民法院",
      //       code: "277",
      //       rate: 9.65,
      //       nontaxJe: 55.7,
      //     },
      //     {
      //       name: "上海市科学技术委员会",
      //       code: "051",
      //       rate: 9.59,
      //       nontaxJe: 55.32,
      //     },
      //     {
      //       name: "上海市崇明区人民法院",
      //       code: "291",
      //       rate: 9.56,
      //       nontaxJe: 55.19,
      //     },
      //     {
      //       name: "上海市金山区人民法院",
      //       code: "287",
      //       rate: 9.51,
      //       nontaxJe: 54.88,
      //     },
      //     {
      //       name: "上海市医疗保障局1",
      //       code: "104",
      //       rate: 9.36,
      //       nontaxJe: 53.99,
      //     },
      //     {
      //       name: "上海市虹口区人民法院",
      //       code: "281",
      //       rate: 8.75,
      //       nontaxJe: 50.47,
      //     },
      //     {
      //       name: "上海市规划和自然资源局",
      //       code: "166",
      //       rate: 8.48,
      //       nontaxJe: 48.91,
      //     },
      //     {
      //       name: "上海市绿化和市容管理局",
      //       code: "180",
      //       rate: 8.08,
      //       nontaxJe: 46.6,
      //     },
      //     {
      //       name: "上海市住房和城乡建设管理委员会",
      //       code: "186",
      //       rate: 7.86,
      //       nontaxJe: 45.33,
      //     },
      //     {
      //       name: "上海市交通委员会",
      //       code: "113",
      //       rate: 7.81,
      //       nontaxJe: 45.05,
      //     },
      //     {
      //       name: "上海市市场监督管理局",
      //       code: "105",
      //       rate: 7.61,
      //       nontaxJe: 43.89,
      //     },
      //     {
      //       name: "上海市住房和城乡建设管理委员会",
      //       code: "186",
      //       rate: 7.57,
      //       nontaxJe: 43.69,
      //     },
      //     {
      //       name: "上海市教育委员会",
      //       code: "050",
      //       rate: 7.24,
      //       nontaxJe: 41.75,
      //     },
      //     {
      //       name: "上海市农业农村委员会",
      //       code: "135",
      //       rate: 7.23,
      //       nontaxJe: 41.73,
      //     },
      //     {
      //       name: "上海市奉贤区人民法院",
      //       code: "290",
      //       rate: 7.13,
      //       nontaxJe: 41.16,
      //     },
      //     {
      //       name: "上海市科学技术委员会",
      //       code: "051",
      //       rate: 6.41,
      //       nontaxJe: 36.99,
      //     },
      //     {
      //       name: "上海市绿化和市容管理局",
      //       code: "180",
      //       rate: 6.37,
      //       nontaxJe: 36.77,
      //     },
      //     {
      //       name: "上海市松江区人民法院",
      //       code: "288",
      //       rate: 6.26,
      //       nontaxJe: 36.14,
      //     },
      //     {
      //       name: "中共上海市委党校",
      //       code: "080",
      //       rate: 6.18,
      //       nontaxJe: 35.67,
      //     },
      //     {
      //       name: "上海市教育委员会",
      //       code: "050",
      //       rate: 6.15,
      //       nontaxJe: 35.49,
      //     },
      //     {
      //       name: "上海市教育委员会",
      //       code: "050",
      //       rate: 6.1,
      //       nontaxJe: 35.22,
      //     },
      //     {
      //       name: "上海申康医院发展中心",
      //       code: "091",
      //       rate: 5.35,
      //       nontaxJe: 30.86,
      //     },
      //     {
      //       name: "上海市财政局",
      //       code: "021",
      //       rate: 5.34,
      //       nontaxJe: 30.84,
      //     },
      //     {
      //       name: "上海市机关事务管理局",
      //       code: "025",
      //       rate: 5.19,
      //       nontaxJe: 29.96,
      //     },
      //     {
      //       name: "上海市经济和信息化委员会",
      //       code: "178",
      //       rate: 5.18,
      //       nontaxJe: 29.87,
      //     },
      //     {
      //       name: "上海市长宁区人民法院",
      //       code: "278",
      //       rate: 5.15,
      //       nontaxJe: 29.73,
      //     },
      //     {
      //       name: "中央预算单位",
      //       code: "900",
      //       rate: 5.06,
      //       nontaxJe: 29.22,
      //     },
      //     {
      //       name: "上海市水务局（上海市海洋局）",
      //       code: "137",
      //       rate: 4.99,
      //       nontaxJe: 28.8,
      //     },
      //     {
      //       name: "上海市规划和自然资源局",
      //       code: "166",
      //       rate: 4.88,
      //       nontaxJe: 28.15,
      //     },
      //     {
      //       name: "上海市公安局",
      //       code: "013",
      //       rate: 4.75,
      //       nontaxJe: 27.39,
      //     },
      //     {
      //       name: "上海市教育委员会",
      //       code: "050",
      //       rate: 4.7,
      //       nontaxJe: 27.12,
      //     },
      //     {
      //       name: "上海市杨浦区人民法院",
      //       code: "282",
      //       rate: 4.56,
      //       nontaxJe: 26.32,
      //     },
      //     {
      //       name: "上海市普陀区人民法院",
      //       code: "280",
      //       rate: 4.54,
      //       nontaxJe: 26.18,
      //     },
      //     {
      //       name: "上海海事法院",
      //       code: "274",
      //       rate: 4.46,
      //       nontaxJe: 25.76,
      //     },
      //     {
      //       name: "上海社会科学院",
      //       code: "060",
      //       rate: 4.3,
      //       nontaxJe: 24.8,
      //     },
      //     {
      //       name: "上海市黄浦区人民法院",
      //       code: "276",
      //       rate: 4.2,
      //       nontaxJe: 24.21,
      //     },
      //     {
      //       name: "上海市水务局（上海市海洋局）",
      //       code: "137",
      //       rate: 4.13,
      //       nontaxJe: 23.83,
      //     },
      //     {
      //       name: "上海市交通委员会",
      //       code: "113",
      //       rate: 4.04,
      //       nontaxJe: 23.32,
      //     },
      //     {
      //       name: "上海市妇女联合会",
      //       code: "032",
      //       rate: 4.01,
      //       nontaxJe: 23.13,
      //     },
      //     {
      //       name: "上海市应急管理局",
      //       code: "102",
      //       rate: 3.83,
      //       nontaxJe: 22.09,
      //     },
      //     {
      //       name: "上海市青浦区人民法院",
      //       code: "289",
      //       rate: 3.62,
      //       nontaxJe: 20.89,
      //     },
      //     {
      //       name: "上海铁路运输法院",
      //       code: "275",
      //       rate: 3.56,
      //       nontaxJe: 20.57,
      //     },
      //     {
      //       name: "上海市经济和信息化委员会",
      //       code: "178",
      //       rate: 3.41,
      //       nontaxJe: 19.68,
      //     },
      //     {
      //       name: "上海市住房和城乡建设管理委员会",
      //       code: "186",
      //       rate: 3.32,
      //       nontaxJe: 19.15,
      //     },
      //     {
      //       name: "上海市奉贤区人民法院",
      //       code: "290",
      //       rate: 3.31,
      //       nontaxJe: 19.07,
      //     },
      //     {
      //       name: "上海市第一中级人民法院",
      //       code: "271",
      //       rate: 3.25,
      //       nontaxJe: 18.76,
      //     },
      //     {
      //       name: "上海化学工业区管理委员会",
      //       code: "047",
      //       rate: 3.2,
      //       nontaxJe: 18.45,
      //     },
      //     {
      //       name: "上海市机关事务管理局",
      //       code: "025",
      //       rate: 3.19,
      //       nontaxJe: 18.43,
      //     },
      //     {
      //       name: "上海市人力资源和社会保障局",
      //       code: "179",
      //       rate: 3.06,
      //       nontaxJe: 17.67,
      //     },
      //     {
      //       name: "上海市教育委员会",
      //       code: "050",
      //       rate: 2.93,
      //       nontaxJe: 16.91,
      //     },
      //     {
      //       name: "上海市静安区人民法院",
      //       code: "279",
      //       rate: 2.79,
      //       nontaxJe: 16.13,
      //     },
      //     {
      //       name: "上海市体育局",
      //       code: "053",
      //       rate: 2.61,
      //       nontaxJe: 15.05,
      //     },
      //     {
      //       name: "上海市文化和旅游局",
      //       code: "106",
      //       rate: 2.51,
      //       nontaxJe: 14.51,
      //     },
      //     {
      //       name: "中国（上海）自由贸易试验区临港新片区管理委员会",
      //       code: "191",
      //       rate: 2.5,
      //       nontaxJe: 14.41,
      //     },
      //     {
      //       name: "上海市长宁区人民法院",
      //       code: "278",
      //       rate: 2.36,
      //       nontaxJe: 13.64,
      //     },
      //     {
      //       name: "上海市农业农村委员会",
      //       code: "135",
      //       rate: 2.34,
      //       nontaxJe: 13.49,
      //     },
      //     {
      //       name: "上海市经济和信息化委员会",
      //       code: "178",
      //       rate: 2.3,
      //       nontaxJe: 13.25,
      //     },
      //     {
      //       name: "上海市交通委员会",
      //       code: "113",
      //       rate: 2.26,
      //       nontaxJe: 13.02,
      //     },
      //     {
      //       name: "上海市第二中级人民法院",
      //       code: "272",
      //       rate: 2.22,
      //       nontaxJe: 12.81,
      //     },
      //     {
      //       name: "上海市徐汇区人民法院",
      //       code: "277",
      //       rate: 2.19,
      //       nontaxJe: 12.64,
      //     },
      //     {
      //       name: "上海市绿化和市容管理局",
      //       code: "180",
      //       rate: 2.18,
      //       nontaxJe: 12.58,
      //     },
      //     {
      //       name: "上海金融法院",
      //       code: "188",
      //       rate: 2.14,
      //       nontaxJe: 12.36,
      //     },
      //     {
      //       name: "上海市卫生健康委员会",
      //       code: "092",
      //       rate: 2.12,
      //       nontaxJe: 12.24,
      //     },
      //     {
      //       name: "上海市奉贤区人民法院",
      //       code: "290",
      //       rate: 2.11,
      //       nontaxJe: 12.15,
      //     },
      //     {
      //       name: "上海市é役军人事务局",
      //       code: "103",
      //       rate: 2.09,
      //       nontaxJe: 12.08,
      //     },
      //     {
      //       name: "上海市监狱管理局",
      //       code: "018",
      //       rate: 2.09,
      //       nontaxJe: 12.08,
      //     },
      //     {
      //       name: "上海市崇明区人民法院",
      //       code: "291",
      //       rate: 2.02,
      //       nontaxJe: 11.65,
      //     },
      //     {
      //       name: "上海市第二中级人民法院",
      //       code: "272",
      //       rate: 1.98,
      //       nontaxJe: 11.41,
      //     },
      //     {
      //       name: "中国共产党上海市委员会宣传部",
      //       code: "005",
      //       rate: 1.91,
      //       nontaxJe: 11.04,
      //     },
      //     {
      //       name: "中国福利会",
      //       code: "098",
      //       rate: 1.89,
      //       nontaxJe: 10.88,
      //     },
      //     {
      //       name: "上海医药（集团）有限公司",
      //       code: "071",
      //       rate: 1.8,
      //       nontaxJe: 10.36,
      //     },
      //     {
      //       name: "上海市市场监督管理局",
      //       code: "105",
      //       rate: 1.73,
      //       nontaxJe: 9.97,
      //     },
      //     {
      //       name: "上海市生态环境局",
      //       code: "120",
      //       rate: 1.68,
      //       nontaxJe: 9.72,
      //     },
      //     {
      //       name: "上海市应急管理局",
      //       code: "102",
      //       rate: 1.58,
      //       nontaxJe: 9.13,
      //     },
      //     {
      //       name: "上海市松江区人民法院",
      //       code: "288",
      //       rate: 1.46,
      //       nontaxJe: 8.44,
      //     },
      //     {
      //       name: "上海市宝山区人民法院",
      //       code: "284",
      //       rate: 1.39,
      //       nontaxJe: 8.01,
      //     },
      //     {
      //       name: "上海申康医院发展中心",
      //       code: "091",
      //       rate: 1.36,
      //       nontaxJe: 7.84,
      //     },
      //     {
      //       name: "中国福利会",
      //       code: "098",
      //       rate: 1.32,
      //       nontaxJe: 7.62,
      //     },
      //     {
      //       name: "上海市人力资源和社会保障局",
      //       code: "179",
      //       rate: 1.3,
      //       nontaxJe: 7.49,
      //     },
      //     {
      //       name: "上海市嘉定区人民法院",
      //       code: "285",
      //       rate: 1.25,
      //       nontaxJe: 7.21,
      //     },
      //     {
      //       name: "上海华谊控股集团有限公司",
      //       code: "066",
      //       rate: 1.22,
      //       nontaxJe: 7.03,
      //     },
      //     {
      //       name: "上海市交通委员会",
      //       code: "113",
      //       rate: 1.19,
      //       nontaxJe: 6.85,
      //     },
      //     {
      //       name: "上海市水务局（上海市海洋局）",
      //       code: "137",
      //       rate: 1.15,
      //       nontaxJe: 6.66,
      //     },
      //     {
      //       name: "上海市科学技术委员会",
      //       code: "051",
      //       rate: 1.15,
      //       nontaxJe: 6.64,
      //     },
      //     {
      //       name: "上海博物馆",
      //       code: "062",
      //       rate: 1.15,
      //       nontaxJe: 6.63,
      //     },
      //     {
      //       name: "上海市机关事务管理局",
      //       code: "025",
      //       rate: 1.13,
      //       nontaxJe: 6.52,
      //     },
      //     {
      //       name: "上海市科学技术协会",
      //       code: "052",
      //       rate: 1.06,
      //       nontaxJe: 6.12,
      //     },
      //     {
      //       name: "上海市普陀区人民法院",
      //       code: "280",
      //       rate: 1.05,
      //       nontaxJe: 6.04,
      //     },
      //     {
      //       name: "上海市杨浦区人民法院",
      //       code: "282",
      //       rate: 1.04,
      //       nontaxJe: 6.02,
      //     },
      //     {
      //       name: "中国共产党上海市委员会宣传部",
      //       code: "005",
      //       rate: 0.97,
      //       nontaxJe: 5.6,
      //     },
      //     {
      //       name: "上海市教育委员会",
      //       code: "050",
      //       rate: 0.93,
      //       nontaxJe: 5.38,
      //     },
      //     {
      //       name: "上海市民政局",
      //       code: "094",
      //       rate: 0.92,
      //       nontaxJe: 5.33,
      //     },
      //     {
      //       name: "上海市卫生健康委员会",
      //       code: "092",
      //       rate: 0.91,
      //       nontaxJe: 5.27,
      //     },
      //     {
      //       name: "上海市工商业联合会",
      //       code: "034",
      //       rate: 0.9,
      //       nontaxJe: 5.18,
      //     },
      //     {
      //       name: "上海良友（集团）有限公司",
      //       code: "068",
      //       rate: 0.89,
      //       nontaxJe: 5.13,
      //     },
      //     {
      //       name: "上海市松江区人民检察院",
      //       code: "267",
      //       rate: 0.87,
      //       nontaxJe: 5.02,
      //     },
      //     {
      //       name: "上海市交通委员会",
      //       code: "113",
      //       rate: 0.83,
      //       nontaxJe: 4.77,
      //     },
      //     {
      //       name: "上海市卫生健康委员会",
      //       code: "092",
      //       rate: 0.81,
      //       nontaxJe: 4.69,
      //     },
      //     {
      //       name: "上海市住房和城乡建设管理委员会",
      //       code: "186",
      //       rate: 0.8,
      //       nontaxJe: 4.6,
      //     },
      //     {
      //       name: "上海市教育委员会",
      //       code: "050",
      //       rate: 0.78,
      //       nontaxJe: 4.53,
      //     },
      //     {
      //       name: "上海市文化和旅游局",
      //       code: "106",
      //       rate: 0.77,
      //       nontaxJe: 4.42,
      //     },
      //     {
      //       name: "上海市国防动员办公室",
      //       code: "123",
      //       rate: 0.77,
      //       nontaxJe: 4.42,
      //     },
      //     {
      //       name: "上海市体育局",
      //       code: "053",
      //       rate: 0.72,
      //       nontaxJe: 4.16,
      //     },
      //     {
      //       name: "上海市药品监督管理局",
      //       code: "107",
      //       rate: 0.71,
      //       nontaxJe: 4.1,
      //     },
      //     {
      //       name: "上海市国防动员办公室",
      //       code: "123",
      //       rate: 0.7,
      //       nontaxJe: 4.07,
      //     },
      //     {
      //       name: "上海市发展和改革委员会",
      //       code: "110",
      //       rate: 0.7,
      //       nontaxJe: 4.03,
      //     },
      //     {
      //       name: "上海市卫生健康委员会",
      //       code: "092",
      //       rate: 0.68,
      //       nontaxJe: 3.9,
      //     },
      //     {
      //       name: "上海市住房和城乡建设管理委员会",
      //       code: "186",
      //       rate: 0.67,
      //       nontaxJe: 3.86,
      //     },
      //     {
      //       name: "上海市虹口区人民法院",
      //       code: "281",
      //       rate: 0.66,
      //       nontaxJe: 3.81,
      //     },
      //     {
      //       name: "上海市发展和改革委员会",
      //       code: "110",
      //       rate: 0.65,
      //       nontaxJe: 3.78,
      //     },
      //     {
      //       name: "上海市体育局",
      //       code: "053",
      //       rate: 0.62,
      //       nontaxJe: 3.58,
      //     },
      //     {
      //       name: "上海市民政局",
      //       code: "094",
      //       rate: 0.62,
      //       nontaxJe: 3.57,
      //     },
      //     {
      //       name: "上海市杨浦区人民法院",
      //       code: "282",
      //       rate: 0.61,
      //       nontaxJe: 3.5,
      //     },
      //     {
      //       name: "上海市人民政府合作交流办公室",
      //       code: "049",
      //       rate: 0.58,
      //       nontaxJe: 3.35,
      //     },
      //     {
      //       name: "上海市妇女联合会",
      //       code: "032",
      //       rate: 0.57,
      //       nontaxJe: 3.31,
      //     },
      //     {
      //       name: "上海海事法院",
      //       code: "274",
      //       rate: 0.57,
      //       nontaxJe: 3.29,
      //     },
      //     {
      //       name: "上海市文化和旅游局",
      //       code: "106",
      //       rate: 0.57,
      //       nontaxJe: 3.28,
      //     },
      //     {
      //       name: "上海市人民政府合作交流办公室",
      //       code: "049",
      //       rate: 0.52,
      //       nontaxJe: 3.0,
      //     },
      //     {
      //       name: "上海市青浦区人民法院",
      //       code: "289",
      //       rate: 0.52,
      //       nontaxJe: 2.97,
      //     },
      //     {
      //       name: "百联集团有限公司",
      //       code: "070",
      //       rate: 0.5,
      //       nontaxJe: 2.88,
      //     },
      //     {
      //       name: "上海市国防动员办公室",
      //       code: "123",
      //       rate: 0.5,
      //       nontaxJe: 2.87,
      //     },
      //     {
      //       name: "上海市闵行区人民法院",
      //       code: "283",
      //       rate: 0.49,
      //       nontaxJe: 2.85,
      //     },
      //     {
      //       name: "上海市宝山区人民法院",
      //       code: "284",
      //       rate: 0.48,
      //       nontaxJe: 2.78,
      //     },
      //     {
      //       name: "上海市社会科学界联合会",
      //       code: "061",
      //       rate: 0.48,
      //       nontaxJe: 2.75,
      //     },
      //     {
      //       name: "上海市浦东新区人民检察院",
      //       code: "265",
      //       rate: 0.47,
      //       nontaxJe: 2.71,
      //     },
      //     {
      //       name: "上海市卫生健康委员会",
      //       code: "092",
      //       rate: 0.46,
      //       nontaxJe: 2.65,
      //     },
      //     {
      //       name: "上海市市场监督管理局",
      //       code: "105",
      //       rate: 0.45,
      //       nontaxJe: 2.59,
      //     },
      //     {
      //       name: "上海市专用通信局",
      //       code: "139",
      //       rate: 0.41,
      //       nontaxJe: 2.37,
      //     },
      //     {
      //       name: "上海市人力资源和社会保障局",
      //       code: "179",
      //       rate: 0.4,
      //       nontaxJe: 2.32,
      //     },
      //     {
      //       name: "上海市卫生健康委员会",
      //       code: "092",
      //       rate: 0.38,
      //       nontaxJe: 2.17,
      //     },
      //     {
      //       name: "上海市教育委员会",
      //       code: "050",
      //       rate: 0.37,
      //       nontaxJe: 2.13,
      //     },
      //     {
      //       name: "上海市妇女联合会",
      //       code: "032",
      //       rate: 0.36,
      //       nontaxJe: 2.09,
      //     },
      //     {
      //       name: "上海市经济和信息化委员会",
      //       code: "178",
      //       rate: 0.36,
      //       nontaxJe: 2.07,
      //     },
      //     {
      //       name: "上海博物馆",
      //       code: "062",
      //       rate: 0.34,
      //       nontaxJe: 1.96,
      //     },
      //     {
      //       name: "中央预算单位",
      //       code: "900",
      //       rate: 0.31,
      //       nontaxJe: 1.81,
      //     },
      //     {
      //       name: "上海市闵行区人民检察院",
      //       code: "262",
      //       rate: 0.31,
      //       nontaxJe: 1.77,
      //     },
      //     {
      //       name: "上海社会科学院",
      //       code: "060",
      //       rate: 0.3,
      //       nontaxJe: 1.75,
      //     },
      //     {
      //       name: "上海市监狱管理局",
      //       code: "018",
      //       rate: 0.28,
      //       nontaxJe: 1.61,
      //     },
      //     {
      //       name: "上海市金山区人民法院",
      //       code: "287",
      //       rate: 0.28,
      //       nontaxJe: 1.61,
      //     },
      //     {
      //       name: "上海市监狱管理局",
      //       code: "018",
      //       rate: 0.28,
      //       nontaxJe: 1.6,
      //     },
      //     {
      //       name: "上海化学工业区管理委员会",
      //       code: "047",
      //       rate: 0.27,
      //       nontaxJe: 1.59,
      //     },
      //     {
      //       name: "上海市规划和自然资源局",
      //       code: "166",
      //       rate: 0.27,
      //       nontaxJe: 1.54,
      //     },
      //     {
      //       name: "上海市经济和信息化委员会",
      //       code: "178",
      //       rate: 0.26,
      //       nontaxJe: 1.51,
      //     },
      //     {
      //       name: "上海市生态环境局",
      //       code: "120",
      //       rate: 0.26,
      //       nontaxJe: 1.51,
      //     },
      //     {
      //       name: "上海市静安区人民检察院",
      //       code: "258",
      //       rate: 0.25,
      //       nontaxJe: 1.44,
      //     },
      //     {
      //       name: "上海市金山区人民检察院",
      //       code: "266",
      //       rate: 0.25,
      //       nontaxJe: 1.42,
      //     },
      //     {
      //       name: "中国福利会",
      //       code: "098",
      //       rate: 0.24,
      //       nontaxJe: 1.37,
      //     },
      //     {
      //       name: "上海铁路运输检察院",
      //       code: "254",
      //       rate: 0.23,
      //       nontaxJe: 1.35,
      //     },
      //     {
      //       name: "上海市文化和旅游局",
      //       code: "106",
      //       rate: 0.23,
      //       nontaxJe: 1.34,
      //     },
      //     {
      //       name: "上海市检测中心",
      //       code: "126",
      //       rate: 0.23,
      //       nontaxJe: 1.31,
      //     },
      //     {
      //       name: "上海市民政局",
      //       code: "094",
      //       rate: 0.23,
      //       nontaxJe: 1.3,
      //     },
      //     {
      //       name: "上海市医疗保障局1",
      //       code: "104",
      //       rate: 0.23,
      //       nontaxJe: 1.3,
      //     },
      //     {
      //       name: "上海市住房和城乡建设管理委员会",
      //       code: "186",
      //       rate: 0.22,
      //       nontaxJe: 1.28,
      //     },
      //     {
      //       name: "上海市住房和城乡建设管理委员会",
      //       code: "186",
      //       rate: 0.22,
      //       nontaxJe: 1.26,
      //     },
      //     {
      //       name: "上海市经济和信息化委员会",
      //       code: "178",
      //       rate: 0.22,
      //       nontaxJe: 1.25,
      //     },
      //     {
      //       name: "上海市绿化和市容管理局",
      //       code: "180",
      //       rate: 0.21,
      //       nontaxJe: 1.19,
      //     },
      //     {
      //       name: "中国共产党上海市委员会宣传部",
      //       code: "005",
      //       rate: 0.2,
      //       nontaxJe: 1.18,
      //     },
      //     {
      //       name: "上海市司法局",
      //       code: "015",
      //       rate: 0.2,
      //       nontaxJe: 1.17,
      //     },
      //     {
      //       name: "上海市工商业联合会",
      //       code: "034",
      //       rate: 0.2,
      //       nontaxJe: 1.13,
      //     },
      //     {
      //       name: "上海市科学技术委员会",
      //       code: "051",
      //       rate: 0.19,
      //       nontaxJe: 1.08,
      //     },
      //     {
      //       name: "上海市人民政府外事办公室",
      //       code: "036",
      //       rate: 0.19,
      //       nontaxJe: 1.08,
      //     },
      //     {
      //       name: "上海市应急管理局",
      //       code: "102",
      //       rate: 0.18,
      //       nontaxJe: 1.06,
      //     },
      //     {
      //       name: "上海市绿化和市容管理局",
      //       code: "180",
      //       rate: 0.18,
      //       nontaxJe: 1.05,
      //     },
      //     {
      //       name: "上海市文化和旅游局",
      //       code: "106",
      //       rate: 0.17,
      //       nontaxJe: 1.0,
      //     },
      //     {
      //       name: "上海市卫生健康委员会",
      //       code: "092",
      //       rate: 0.16,
      //       nontaxJe: 0.94,
      //     },
      //     {
      //       name: "上海市住房和城乡建设管理委员会",
      //       code: "186",
      //       rate: 0.16,
      //       nontaxJe: 0.94,
      //     },
      //     {
      //       name: "上海市残疾人联合会",
      //       code: "097",
      //       rate: 0.16,
      //       nontaxJe: 0.92,
      //     },
      //     {
      //       name: "上海国际问题研究院",
      //       code: "044",
      //       rate: 0.16,
      //       nontaxJe: 0.9,
      //     },
      //     {
      //       name: "上海市住房和城乡建设管理委员会",
      //       code: "186",
      //       rate: 0.16,
      //       nontaxJe: 0.89,
      //     },
      //     {
      //       name: "上海市文化和旅游局",
      //       code: "106",
      //       rate: 0.15,
      //       nontaxJe: 0.89,
      //     },
      //     {
      //       name: "上海市人力资源和社会保障局",
      //       code: "179",
      //       rate: 0.15,
      //       nontaxJe: 0.88,
      //     },
      //     {
      //       name: "上海市徐汇区人民检察院",
      //       code: "256",
      //       rate: 0.14,
      //       nontaxJe: 0.84,
      //     },
      //     {
      //       name: "上海市卫生健康委员会",
      //       code: "092",
      //       rate: 0.14,
      //       nontaxJe: 0.81,
      //     },
      //     {
      //       name: "上海市金山区人民检察院",
      //       code: "266",
      //       rate: 0.14,
      //       nontaxJe: 0.8,
      //     },
      //     {
      //       name: "上海市农业农村委员会",
      //       code: "135",
      //       rate: 0.13,
      //       nontaxJe: 0.78,
      //     },
      //     {
      //       name: "上海市徐汇区人民检察院",
      //       code: "256",
      //       rate: 0.12,
      //       nontaxJe: 0.72,
      //     },
      //     {
      //       name: "上海市水务局（上海市海洋局）",
      //       code: "137",
      //       rate: 0.12,
      //       nontaxJe: 0.71,
      //     },
      //     {
      //       name: "上海市虹口区人民检察院",
      //       code: "260",
      //       rate: 0.12,
      //       nontaxJe: 0.68,
      //     },
      //     {
      //       name: "上海市经济和信息化委员会",
      //       code: "178",
      //       rate: 0.12,
      //       nontaxJe: 0.68,
      //     },
      //     {
      //       name: "上海市档案局（馆）",
      //       code: "082",
      //       rate: 0.12,
      //       nontaxJe: 0.68,
      //     },
      //     {
      //       name: "上海市住房和城乡建设管理委员会",
      //       code: "186",
      //       rate: 0.1,
      //       nontaxJe: 0.6,
      //     },
      //     {
      //       name: "上海市文化和旅游局",
      //       code: "106",
      //       rate: 0.1,
      //       nontaxJe: 0.57,
      //     },
      //     {
      //       name: "上海市崇明区人民检察院",
      //       code: "270",
      //       rate: 0.1,
      //       nontaxJe: 0.57,
      //     },
      //     {
      //       name: "上海市科学技术委员会",
      //       code: "051",
      //       rate: 0.09,
      //       nontaxJe: 0.53,
      //     },
      //     {
      //       name: "中国共产党上海市委员会宣传部",
      //       code: "005",
      //       rate: 0.09,
      //       nontaxJe: 0.52,
      //     },
      //     {
      //       name: "上海博物馆",
      //       code: "062",
      //       rate: 0.09,
      //       nontaxJe: 0.52,
      //     },
      //     {
      //       name: "上海市青浦区人民检察院",
      //       code: "268",
      //       rate: 0.09,
      //       nontaxJe: 0.51,
      //     },
      //     {
      //       name: "上海市农业农村委员会",
      //       code: "135",
      //       rate: 0.08,
      //       nontaxJe: 0.48,
      //     },
      //     {
      //       name: "上海市崇明区人民法院",
      //       code: "291",
      //       rate: 0.08,
      //       nontaxJe: 0.46,
      //     },
      //     {
      //       name: "上海市人民检察院第一分院",
      //       code: "251",
      //       rate: 0.08,
      //       nontaxJe: 0.45,
      //     },
      //     {
      //       name: "上海社会科学院",
      //       code: "060",
      //       rate: 0.08,
      //       nontaxJe: 0.45,
      //     },
      //     {
      //       name: "中国共产主义青年团上海市委员会",
      //       code: "033",
      //       rate: 0.07,
      //       nontaxJe: 0.38,
      //     },
      //     {
      //       name: "上海市档案局（馆）",
      //       code: "082",
      //       rate: 0.07,
      //       nontaxJe: 0.38,
      //     },
      //     {
      //       name: "上海市生态环境局",
      //       code: "120",
      //       rate: 0.07,
      //       nontaxJe: 0.38,
      //     },
      //     {
      //       name: "上海市退役军人事务局",
      //       code: "103",
      //       rate: 0.06,
      //       nontaxJe: 0.37,
      //     },
      //     {
      //       name: "上海市杨浦区人民检察院",
      //       code: "261",
      //       rate: 0.06,
      //       nontaxJe: 0.36,
      //     },
      //     {
      //       name: "上海市药品监督管理局",
      //       code: "107",
      //       rate: 0.06,
      //       nontaxJe: 0.36,
      //     },
      //     {
      //       name: "上海市生态环境局",
      //       code: "120",
      //       rate: 0.06,
      //       nontaxJe: 0.35,
      //     },
      //     {
      //       name: "上海市科学技术委员会",
      //       code: "051",
      //       rate: 0.06,
      //       nontaxJe: 0.34,
      //     },
      //     {
      //       name: "上海金融法院",
      //       code: "188",
      //       rate: 0.06,
      //       nontaxJe: 0.33,
      //     },
      //     {
      //       name: "上海社会科学院",
      //       code: "060",
      //       rate: 0.06,
      //       nontaxJe: 0.32,
      //     },
      //     {
      //       name: "上海市虹口区人民检察院",
      //       code: "260",
      //       rate: 0.05,
      //       nontaxJe: 0.3,
      //     },
      //     {
      //       name: "中国（上海）自由贸易试验区临港新片区管理委员会",
      //       code: "191",
      //       rate: 0.05,
      //       nontaxJe: 0.3,
      //     },
      //     {
      //       name: "上海市工商业联合会",
      //       code: "034",
      //       rate: 0.05,
      //       nontaxJe: 0.28,
      //     },
      //     {
      //       name: "上海市经济和信息化委员会",
      //       code: "178",
      //       rate: 0.05,
      //       nontaxJe: 0.28,
      //     },
      //     {
      //       name: "上海市嘉定区人民检察院",
      //       code: "264",
      //       rate: 0.05,
      //       nontaxJe: 0.28,
      //     },
      //     {
      //       name: "上海市科学技术协会",
      //       code: "052",
      //       rate: 0.05,
      //       nontaxJe: 0.28,
      //     },
      //     {
      //       name: "上海市卫生健康委员会",
      //       code: "092",
      //       rate: 0.05,
      //       nontaxJe: 0.27,
      //     },
      //     {
      //       name: "上海市科学技术协会",
      //       code: "052",
      //       rate: 0.05,
      //       nontaxJe: 0.26,
      //     },
      //     {
      //       name: "上海市规划和自然资源局",
      //       code: "166",
      //       rate: 0.04,
      //       nontaxJe: 0.26,
      //     },
      //     {
      //       name: "上海市人民检察院第一分院",
      //       code: "251",
      //       rate: 0.04,
      //       nontaxJe: 0.25,
      //     },
      //     {
      //       name: "上海市机关事务管理局",
      //       code: "025",
      //       rate: 0.04,
      //       nontaxJe: 0.24,
      //     },
      //     {
      //       name: "上海市农业农村委员会",
      //       code: "135",
      //       rate: 0.04,
      //       nontaxJe: 0.24,
      //     },
      //     {
      //       name: "上海市退役军人事务局",
      //       code: "103",
      //       rate: 0.04,
      //       nontaxJe: 0.24,
      //     },
      //     {
      //       name: "上海市民政局",
      //       code: "094",
      //       rate: 0.04,
      //       nontaxJe: 0.24,
      //     },
      //     {
      //       name: "上海市发展和改革委员会",
      //       code: "110",
      //       rate: 0.04,
      //       nontaxJe: 0.24,
      //     },
      //     {
      //       name: "上海市社会主义学院",
      //       code: "045",
      //       rate: 0.04,
      //       nontaxJe: 0.23,
      //     },
      //     {
      //       name: "上海市监狱管理局",
      //       code: "018",
      //       rate: 0.04,
      //       nontaxJe: 0.23,
      //     },
      //     {
      //       name: "上海市规划和自然资源局",
      //       code: "166",
      //       rate: 0.04,
      //       nontaxJe: 0.2,
      //     },
      //     {
      //       name: "上海市司法局",
      //       code: "015",
      //       rate: 0.04,
      //       nontaxJe: 0.2,
      //     },
      //     {
      //       name: "上海市静安区人民检察院",
      //       code: "258",
      //       rate: 0.04,
      //       nontaxJe: 0.2,
      //     },
      //     {
      //       name: "上海虹桥国际中央商务区管理委员会",
      //       code: "009",
      //       rate: 0.03,
      //       nontaxJe: 0.2,
      //     },
      //     {
      //       name: "中共上海市纪律检查委员会机关",
      //       code: "142",
      //       rate: 0.03,
      //       nontaxJe: 0.19,
      //     },
      //     {
      //       name: "上海市经济和信息化委员会",
      //       code: "178",
      //       rate: 0.03,
      //       nontaxJe: 0.19,
      //     },
      //     {
      //       name: "中共上海市委党校",
      //       code: "080",
      //       rate: 0.03,
      //       nontaxJe: 0.18,
      //     },
      //     {
      //       name: "上海市宝山区人民检察院",
      //       code: "263",
      //       rate: 0.03,
      //       nontaxJe: 0.18,
      //     },
      //     {
      //       name: "上海市交通委员会",
      //       code: "113",
      //       rate: 0.03,
      //       nontaxJe: 0.17,
      //     },
      //     {
      //       name: "上海市规划和自然资源局",
      //       code: "166",
      //       rate: 0.03,
      //       nontaxJe: 0.16,
      //     },
      //     {
      //       name: "上海市规划和自然资源局",
      //       code: "166",
      //       rate: 0.03,
      //       nontaxJe: 0.15,
      //     },
      //     {
      //       name: "上海市审计局",
      //       code: "022",
      //       rate: 0.03,
      //       nontaxJe: 0.15,
      //     },
      //     {
      //       name: "上海市生态环境局",
      //       code: "120",
      //       rate: 0.03,
      //       nontaxJe: 0.15,
      //     },
      //     {
      //       name: "上海铁路运输法院",
      //       code: "275",
      //       rate: 0.02,
      //       nontaxJe: 0.14,
      //     },
      //     {
      //       name: "上海市公安局",
      //       code: "013",
      //       rate: 0.02,
      //       nontaxJe: 0.14,
      //     },
      //     {
      //       name: "上海市市场监督管理局",
      //       code: "105",
      //       rate: 0.02,
      //       nontaxJe: 0.14,
      //     },
      //     {
      //       name: "上海市教育委员会",
      //       code: "050",
      //       rate: 0.02,
      //       nontaxJe: 0.14,
      //     },
      //     {
      //       name: "上海市检测中心",
      //       code: "126",
      //       rate: 0.02,
      //       nontaxJe: 0.13,
      //     },
      //     {
      //       name: "上海市崇明区人民检察院",
      //       code: "270",
      //       rate: 0.02,
      //       nontaxJe: 0.13,
      //     },
      //     {
      //       name: "上海市奉贤区人民检察院",
      //       code: "269",
      //       rate: 0.02,
      //       nontaxJe: 0.13,
      //     },
      //     {
      //       name: "上海市医疗保障局1",
      //       code: "104",
      //       rate: 0.02,
      //       nontaxJe: 0.13,
      //     },
      //     {
      //       name: "上海市人民检察院",
      //       code: "016",
      //       rate: 0.02,
      //       nontaxJe: 0.12,
      //     },
      //     {
      //       name: "上海市药品监督管理局",
      //       code: "107",
      //       rate: 0.02,
      //       nontaxJe: 0.12,
      //     },
      //     {
      //       name: "上海市残疾人联合会",
      //       code: "097",
      //       rate: 0.02,
      //       nontaxJe: 0.11,
      //     },
      //     {
      //       name: "上海市统计局",
      //       code: "023",
      //       rate: 0.02,
      //       nontaxJe: 0.11,
      //     },
      //     {
      //       name: "上海市第一中级人民法院",
      //       code: "271",
      //       rate: 0.02,
      //       nontaxJe: 0.11,
      //     },
      //     {
      //       name: "上海市应急管理局",
      //       code: "102",
      //       rate: 0.02,
      //       nontaxJe: 0.11,
      //     },
      //     {
      //       name: "上海市文化和旅游局",
      //       code: "106",
      //       rate: 0.02,
      //       nontaxJe: 0.1,
      //     },
      //     {
      //       name: "上海市残疾人联合会",
      //       code: "097",
      //       rate: 0.02,
      //       nontaxJe: 0.09,
      //     },
      //     {
      //       name: "上海市浦东新区人民检察院",
      //       code: "265",
      //       rate: 0.02,
      //       nontaxJe: 0.09,
      //     },
      //     {
      //       name: "上海市人民检察院第二分院",
      //       code: "252",
      //       rate: 0.02,
      //       nontaxJe: 0.09,
      //     },
      //     {
      //       name: "上海海事法院",
      //       code: "274",
      //       rate: 0.01,
      //       nontaxJe: 0.08,
      //     },
      //     {
      //       name: "上海市绿化和市容管理局",
      //       code: "180",
      //       rate: 0.01,
      //       nontaxJe: 0.08,
      //     },
      //     {
      //       name: "上海市长宁区人民检察院",
      //       code: "257",
      //       rate: 0.01,
      //       nontaxJe: 0.08,
      //     },
      //     {
      //       name: "中国共产主义青年团上海市委员会",
      //       code: "033",
      //       rate: 0.01,
      //       nontaxJe: 0.08,
      //     },
      //     {
      //       name: "上海市青浦区人民检察院",
      //       code: "268",
      //       rate: 0.01,
      //       nontaxJe: 0.08,
      //     },
      //     {
      //       name: "上海市应急管理局",
      //       code: "102",
      //       rate: 0.01,
      //       nontaxJe: 0.08,
      //     },
      //     {
      //       name: "上海市国防动员办公室",
      //       code: "123",
      //       rate: 0.01,
      //       nontaxJe: 0.07,
      //     },
      //     {
      //       name: "中国共产党上海市委员会宣传部",
      //       code: "005",
      //       rate: 0.01,
      //       nontaxJe: 0.07,
      //     },
      //     {
      //       name: "上海市文学艺术界联合会",
      //       code: "058",
      //       rate: 0.01,
      //       nontaxJe: 0.07,
      //     },
      //     {
      //       name: "上海社会科学院",
      //       code: "060",
      //       rate: 0.01,
      //       nontaxJe: 0.07,
      //     },
      //     {
      //       name: "上海市人民检察院第一分院",
      //       code: "251",
      //       rate: 0.01,
      //       nontaxJe: 0.07,
      //     },
      //     {
      //       name: "上海市政协办公厅",
      //       code: "141",
      //       rate: 0.01,
      //       nontaxJe: 0.07,
      //     },
      //     {
      //       name: "中共上海市委机构编制委员会办公室",
      //       code: "177",
      //       rate: 0.01,
      //       nontaxJe: 0.07,
      //     },
      //     {
      //       name: "中国共产主义青年团上海市委员会",
      //       code: "033",
      //       rate: 0.01,
      //       nontaxJe: 0.07,
      //     },
      //     {
      //       name: "上海市科学技术协会",
      //       code: "052",
      //       rate: 0.01,
      //       nontaxJe: 0.06,
      //     },
      //     {
      //       name: "中国共产主义青年团上海市委员会",
      //       code: "033",
      //       rate: 0.01,
      //       nontaxJe: 0.06,
      //     },
      //     {
      //       name: "上海市长宁区人民检察院",
      //       code: "257",
      //       rate: 0.01,
      //       nontaxJe: 0.06,
      //     },
      //     {
      //       name: "上海市松江区人民法院",
      //       code: "288",
      //       rate: 0.01,
      //       nontaxJe: 0.06,
      //     },
      //     {
      //       name: "上海市公安局",
      //       code: "013",
      //       rate: 0.01,
      //       nontaxJe: 0.06,
      //     },
      //     {
      //       name: "上海市退役军人事务局",
      //       code: "103",
      //       rate: 0.01,
      //       nontaxJe: 0.05,
      //     },
      //     {
      //       name: "上海市司法局",
      //       code: "015",
      //       rate: 0.01,
      //       nontaxJe: 0.05,
      //     },
      //     {
      //       name: "上海市国防动员办公室",
      //       code: "123",
      //       rate: 0.01,
      //       nontaxJe: 0.05,
      //     },
      //     {
      //       name: "上海市静安区人民法院",
      //       code: "279",
      //       rate: 0.01,
      //       nontaxJe: 0.05,
      //     },
      //     {
      //       name: "上海市人民政府合作交流办公室",
      //       code: "049",
      //       rate: 0.01,
      //       nontaxJe: 0.05,
      //     },
      //     {
      //       name: "上海市文化和旅游局执法总队",
      //       code: "075",
      //       rate: 0.01,
      //       nontaxJe: 0.05,
      //     },
      //     {
      //       name: "上海市检测中心",
      //       code: "126",
      //       rate: 0.01,
      //       nontaxJe: 0.05,
      //     },
      //     {
      //       name: "上海市司法局",
      //       code: "015",
      //       rate: 0.01,
      //       nontaxJe: 0.05,
      //     },
      //     {
      //       name: "上海市药品监督管理局",
      //       code: "107",
      //       rate: 0.01,
      //       nontaxJe: 0.05,
      //     },
      //     {
      //       name: "中国（上海）自由贸易试验区临港新片区管理委员会",
      //       code: "191",
      //       rate: 0.01,
      //       nontaxJe: 0.05,
      //     },
      //     {
      //       name: "上海市工商业联合会",
      //       code: "034",
      //       rate: 0.01,
      //       nontaxJe: 0.04,
      //     },
      //     {
      //       name: "上海市人民政府合作交流办公室",
      //       code: "049",
      //       rate: 0.01,
      //       nontaxJe: 0.04,
      //     },
      //     {
      //       name: "上海良友（集团）有限公司",
      //       code: "068",
      //       rate: 0.01,
      //       nontaxJe: 0.04,
      //     },
      //     {
      //       name: "中央预算单位",
      //       code: "900",
      //       rate: 0.01,
      //       nontaxJe: 0.04,
      //     },
      //     {
      //       name: "上海市住房和城乡建设管理委员会",
      //       code: "186",
      //       rate: 0.01,
      //       nontaxJe: 0.04,
      //     },
      //     {
      //       name: "上海市卫生健康委员会",
      //       code: "092",
      //       rate: 0.01,
      //       nontaxJe: 0.04,
      //     },
      //     {
      //       name: "上海市司法局",
      //       code: "015",
      //       rate: 0.01,
      //       nontaxJe: 0.04,
      //     },
      //     {
      //       name: "上海市机关事务管理局",
      //       code: "025",
      //       rate: 0.01,
      //       nontaxJe: 0.04,
      //     },
      //     {
      //       name: "上海市嘉定区人民法院",
      //       code: "285",
      //       rate: 0.01,
      //       nontaxJe: 0.04,
      //     },
      //     {
      //       name: "上海申康医院发展中心",
      //       code: "091",
      //       rate: 0.01,
      //       nontaxJe: 0.04,
      //     },
      //     {
      //       name: "上海市杨浦区人民法院",
      //       code: "282",
      //       rate: 0.01,
      //       nontaxJe: 0.03,
      //     },
      //     {
      //       name: "上海市金山区人民法院",
      //       code: "287",
      //       rate: 0.01,
      //       nontaxJe: 0.03,
      //     },
      //     {
      //       name: "上海市青浦区人民检察院",
      //       code: "268",
      //       rate: 0.01,
      //       nontaxJe: 0.03,
      //     },
      //     {
      //       name: "上海市长宁区人民法院",
      //       code: "278",
      //       rate: 0.01,
      //       nontaxJe: 0.03,
      //     },
      //     {
      //       name: "上海金融法院",
      //       code: "188",
      //       rate: 0.01,
      //       nontaxJe: 0.03,
      //     },
      //     {
      //       name: "上海市黄浦区人民法院",
      //       code: "276",
      //       rate: 0.01,
      //       nontaxJe: 0.03,
      //     },
      //     {
      //       name: "上海市奉贤区人民检察院",
      //       code: "269",
      //       rate: 0.01,
      //       nontaxJe: 0.03,
      //     },
      //     {
      //       name: "上海市黄浦区人民检察院",
      //       code: "255",
      //       rate: 0.01,
      //       nontaxJe: 0.03,
      //     },
      //     {
      //       name: "上海市崇明区人民法院",
      //       code: "291",
      //       rate: 0.01,
      //       nontaxJe: 0.03,
      //     },
      //     {
      //       name: "上海市徐汇区人民检察院",
      //       code: "256",
      //       rate: 0.01,
      //       nontaxJe: 0.03,
      //     },
      //     {
      //       name: "上海市水务局（上海市海洋局）",
      //       code: "137",
      //       rate: 0.01,
      //       nontaxJe: 0.03,
      //     },
      //     {
      //       name: "上海市徐汇区人民法院",
      //       code: "277",
      //       rate: 0.01,
      //       nontaxJe: 0.03,
      //     },
      //     {
      //       name: "上海市人民政府发展研究中心",
      //       code: "010",
      //       rate: 0.0,
      //       nontaxJe: 0.03,
      //     },
      //     {
      //       name: "上海市闵行区人民法院",
      //       code: "283",
      //       rate: 0.0,
      //       nontaxJe: 0.03,
      //     },
      //     {
      //       name: "上海市崇明区人民检察院",
      //       code: "270",
      //       rate: 0.0,
      //       nontaxJe: 0.03,
      //     },
      //     {
      //       name: "上海市文学艺术界联合会",
      //       code: "058",
      //       rate: 0.0,
      //       nontaxJe: 0.03,
      //     },
      //     {
      //       name: "上海市人民政府发展研究中心",
      //       code: "010",
      //       rate: 0.0,
      //       nontaxJe: 0.02,
      //     },
      //     {
      //       name: "上海市嘉定区人民检察院",
      //       code: "264",
      //       rate: 0.0,
      //       nontaxJe: 0.02,
      //     },
      //     {
      //       name: "上海市统计局",
      //       code: "023",
      //       rate: 0.0,
      //       nontaxJe: 0.02,
      //     },
      //     {
      //       name: "上海市青浦区人民法院",
      //       code: "289",
      //       rate: 0.0,
      //       nontaxJe: 0.02,
      //     },
      //     {
      //       name: "上海市发展和改革委员会",
      //       code: "110",
      //       rate: 0.0,
      //       nontaxJe: 0.02,
      //     },
      //     {
      //       name: "上海市知识产权局",
      //       code: "192",
      //       rate: 0.0,
      //       nontaxJe: 0.02,
      //     },
      //     {
      //       name: "上海市市场监督管理局",
      //       code: "105",
      //       rate: 0.0,
      //       nontaxJe: 0.02,
      //     },
      //     {
      //       name: "上海国盛（集团）有限公司",
      //       code: "067",
      //       rate: 0.0,
      //       nontaxJe: 0.02,
      //     },
      //     {
      //       name: "上海市松江区人民检察院",
      //       code: "267",
      //       rate: 0.0,
      //       nontaxJe: 0.02,
      //     },
      //     {
      //       name: "上海市财政局",
      //       code: "021",
      //       rate: 0.0,
      //       nontaxJe: 0.02,
      //     },
      //     {
      //       name: "上海市社会科学界联合会",
      //       code: "061",
      //       rate: 0.0,
      //       nontaxJe: 0.02,
      //     },
      //     {
      //       name: "上海市嘉定区人民法院",
      //       code: "285",
      //       rate: 0.0,
      //       nontaxJe: 0.02,
      //     },
      //     {
      //       name: "上海市交通委员会",
      //       code: "113",
      //       rate: 0.0,
      //       nontaxJe: 0.02,
      //     },
      //     {
      //       name: "上海市人民检察院第二分院",
      //       code: "252",
      //       rate: 0.0,
      //       nontaxJe: 0.02,
      //     },
      //     {
      //       name: "上海市残疾人联合会",
      //       code: "097",
      //       rate: 0.0,
      //       nontaxJe: 0.02,
      //     },
      //     {
      //       name: "上海市文史研究馆",
      //       code: "171",
      //       rate: 0.0,
      //       nontaxJe: 0.02,
      //     },
      //     {
      //       name: "上海金融法院",
      //       code: "188",
      //       rate: 0.0,
      //       nontaxJe: 0.02,
      //     },
      //     {
      //       name: "上海市住房和城乡建设管理委员会",
      //       code: "186",
      //       rate: 0.0,
      //       nontaxJe: 0.02,
      //     },
      //     {
      //       name: "上海市国际贸易促进委员会",
      //       code: "173",
      //       rate: 0.0,
      //       nontaxJe: 0.02,
      //     },
      //     {
      //       name: "上海市长宁区人民检察院",
      //       code: "257",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "上海市残疾人联合会",
      //       code: "097",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "上海市工商业联合会",
      //       code: "034",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "上海市金山区人民检察院",
      //       code: "266",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "上海市嘉定区人民检察院",
      //       code: "264",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "上海市水务局（上海市海洋局）",
      //       code: "137",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "上海市医疗保障局1",
      //       code: "104",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "上海市松江区人民检察院",
      //       code: "267",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "上海市文化和旅游局执法总队",
      //       code: "075",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "上海市红十字会",
      //       code: "099",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "上海市民政局",
      //       code: "094",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "上海良友（集团）有限公司",
      //       code: "068",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "上海市文史研究馆",
      //       code: "171",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "上海市统计局",
      //       code: "023",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "上海市宝山区人民检察院",
      //       code: "263",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "上海市人民检察院第二分院",
      //       code: "252",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "上海市浦东新区人民检察院",
      //       code: "265",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "上海市金山区人民检察院",
      //       code: "266",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "上海市虹口区人民法院",
      //       code: "281",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "上海市奉贤区人民法院",
      //       code: "290",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "上海市专用通信局",
      //       code: "139",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "上海铁路运输检察院",
      //       code: "254",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "上海市残疾人联合会",
      //       code: "097",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "上海市绿化和市容管理局",
      //       code: "180",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "上海华谊控股集团有限公司",
      //       code: "066",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "九三学社上海市委员会",
      //       code: "153",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "上海市社会主义学院",
      //       code: "045",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "中共上海市委机构编制委员会办公室",
      //       code: "177",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "上海市残疾人联合会",
      //       code: "097",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "上海市崇明区人民检察院",
      //       code: "270",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "上海市红十字会",
      //       code: "099",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "上海市民族和宗教事务局",
      //       code: "030",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "上海市宝山区人民法院",
      //       code: "284",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "上海市人力资源和社会保障局",
      //       code: "179",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "上海市宝山区人民检察院",
      //       code: "263",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "上海市对外文化交流协会",
      //       code: "077",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "上海市市场监督管理局",
      //       code: "105",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "上海市黄浦区人民检察院",
      //       code: "255",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "上海市宣传文化人才服务中心",
      //       code: "076",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "中国共产党上海市委员会组织部",
      //       code: "004",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "上海市金山区人民检察院",
      //       code: "266",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "上海铁路运输法院",
      //       code: "275",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "上海市静安区人民检察院",
      //       code: "258",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "上海市徐汇区人民检察院",
      //       code: "256",
      //       rate: 0.0,
      //       nontaxJe: 0.01,
      //     },
      //     {
      //       name: "中共上海市委老干部局",
      //       code: "039",
      //       rate: 0.0,
      //       nontaxJe: 0.0,
      //     },
      //     {
      //       name: "中国（上海）自由贸易试验区临港新片区管理委员会",
      //       code: "191",
      //       rate: 0.0,
      //       nontaxJe: 0.0,
      //     },
      //     {
      //       name: "上海市残疾人联合会",
      //       code: "097",
      //       rate: 0.0,
      //       nontaxJe: 0.0,
      //     },
      //     {
      //       name: "上海市普陀区人民检察院",
      //       code: "259",
      //       rate: 0.0,
      //       nontaxJe: 0.0,
      //     },
      //     {
      //       name: "上海市人民政府外事办公室",
      //       code: "036",
      //       rate: 0.0,
      //       nontaxJe: 0.0,
      //     },
      //     {
      //       name: "中国共产主义青年团上海市委员会",
      //       code: "033",
      //       rate: 0.0,
      //       nontaxJe: 0.0,
      //     },
      //     {
      //       name: "上海铁路运输法院",
      //       code: "275",
      //       rate: 0.0,
      //       nontaxJe: 0.0,
      //     },
      //     {
      //       name: "九三学社上海市委员会",
      //       code: "153",
      //       rate: 0.0,
      //       nontaxJe: 0.0,
      //     },
      //     {
      //       name: "上海市知识产权局",
      //       code: "192",
      //       rate: 0.0,
      //       nontaxJe: 0.0,
      //     },
      //     {
      //       name: "上海市作家协会",
      //       code: "059",
      //       rate: 0.0,
      //       nontaxJe: 0.0,
      //     },
      //     {
      //       name: "上海国际问题研究院",
      //       code: "044",
      //       rate: 0.0,
      //       nontaxJe: 0.0,
      //     },
      //     {
      //       name: "上海仪电（集团）有限公司",
      //       code: "072",
      //       rate: 0.0,
      //       nontaxJe: 0.0,
      //     },
      //     {
      //       name: "上海市经济和信息化委员会",
      //       code: "178",
      //       rate: 0.0,
      //       nontaxJe: 0.0,
      //     },
      //     {
      //       name: "上海市闵行区人民检察院",
      //       code: "262",
      //       rate: 0.0,
      //       nontaxJe: 0.0,
      //     },
      //     {
      //       name: "上海市绿化和市容管理局",
      //       code: "180",
      //       rate: 0.0,
      //       nontaxJe: 0.0,
      //     },
      //     {
      //       name: "中国福利会",
      //       code: "098",
      //       rate: 0.0,
      //       nontaxJe: 0.0,
      //     },
      //     {
      //       name: "上海市机关事务管理局",
      //       code: "025",
      //       rate: 0.0,
      //       nontaxJe: 0.0,
      //     },
      //     {
      //       name: "上海市规划和自然资源局",
      //       code: "166",
      //       rate: 0.0,
      //       nontaxJe: 0.0,
      //     },
      //     {
      //       name: "上海市公安局",
      //       code: "013",
      //       rate: 0.0,
      //       nontaxJe: 0.0,
      //     },
      //     {
      //       name: "上海市知识产权局",
      //       code: "192",
      //       rate: 0.0,
      //       nontaxJe: 0.0,
      //     },
      //     {
      //       name: "上海市水务局（上海市海洋局）",
      //       code: "137",
      //       rate: 0.0,
      //       nontaxJe: 0.0,
      //     },
      //     {
      //       name: "上海市宣传文化人才服务中心",
      //       code: "076",
      //       rate: 0.0,
      //       nontaxJe: 0.0,
      //     },
      //     {
      //       name: "上海市宣传文化人才服务中心",
      //       code: "076",
      //       rate: 0.0,
      //       nontaxJe: 0.0,
      //     },
      //     {
      //       name: "上海市红十字会",
      //       code: "099",
      //       rate: 0.0,
      //       nontaxJe: 0.0,
      //     },
      //     {
      //       name: "上海市松江区人民检察院",
      //       code: "267",
      //       rate: 0.0,
      //       nontaxJe: 0.0,
      //     },
      //     {
      //       name: "上海市徐汇区人民法院",
      //       code: "277",
      //       rate: 0.0,
      //       nontaxJe: 0.0,
      //     },
      //     {
      //       name: "上海市黄浦区人民检察院",
      //       code: "255",
      //       rate: 0.0,
      //       nontaxJe: 0.0,
      //     },
      //     {
      //       name: "中国福利会",
      //       code: "098",
      //       rate: 0.0,
      //       nontaxJe: 0.0,
      //     },
      //     {
      //       name: "上海市普陀区人民法院",
      //       code: "280",
      //       rate: 0.0,
      //       nontaxJe: 0.0,
      //     },
      //     {
      //       name: "上海市奉贤区人民检察院",
      //       code: "269",
      //       rate: 0.0,
      //       nontaxJe: 0.0,
      //     },
      //     {
      //       name: "上海市人力资源和社会保障局",
      //       code: "179",
      //       rate: 0.0,
      //       nontaxJe: 0.0,
      //     },
      //     {
      //       name: "上海市社会科学界联合会",
      //       code: "061",
      //       rate: 0.0,
      //       nontaxJe: 0.0,
      //     },
      //     {
      //       name: "中国（上海）自由贸易试验区临港新片区管理委员会",
      //       code: "191",
      //       rate: 0.0,
      //       nontaxJe: 0.0,
      //     },
      //     {
      //       name: "上海国盛（集团）有限公司",
      //       code: "067",
      //       rate: 0.0,
      //       nontaxJe: 0.0,
      //     },
      //     {
      //       name: "上海市药品监督管理局",
      //       code: "107",
      //       rate: 0.0,
      //       nontaxJe: 0.0,
      //     },
      //     {
      //       name: "中国共产党上海市委员会宣传部",
      //       code: "005",
      //       rate: 0.0,
      //       nontaxJe: 0.0,
      //     },
      //     {
      //       name: "上海市民政局",
      //       code: "094",
      //       rate: 0.0,
      //       nontaxJe: 0.0,
      //     },
      //   ],
      //   data: [
      //     4690.26, 4052.77, 1364.09, 1301.99, 1131.97, 1099.19, 1010.03, 814.77,
      //     504.17, 502.22, 486.94, 460.39, 445.76, 421.02, 376.14, 368.46,
      //     338.27, 296.2, 278.17, 271.38, 260.44, 244.26, 230.06, 229.89, 228.29,
      //     227.11, 211.26, 210.12, 206.48, 199.79, 183.36, 181.22, 179.51,
      //     178.89, 175.48, 168.41, 161.33, 151.51, 151.02, 150.18, 139.66,
      //     136.91, 129.61, 128.19, 126.22, 125.32, 116.07, 110.43, 107.45, 98.47,
      //     98.32, 96.26, 86.46, 85.06, 84.57, 83.62, 81.92, 81.69, 77.46, 77.28,
      //     74.46, 74.01, 66.09, 65.24, 62.22, 59.02, 56.67, 55.74, 55.7, 55.32,
      //     55.19, 54.88, 53.99, 50.47, 48.91, 46.6, 45.33, 45.05, 43.89, 43.69,
      //     41.75, 41.73, 41.16, 36.99, 36.77, 36.14, 35.67, 35.49, 35.22, 30.86,
      //     30.84, 29.96, 29.87, 29.73, 29.22, 28.8, 28.15, 27.39, 27.12, 26.32,
      //     26.18, 25.76, 24.8, 24.21, 23.83, 23.32, 23.13, 22.09, 20.89, 20.57,
      //     19.68, 19.15, 19.07, 18.76, 18.45, 18.43, 17.67, 16.91, 16.13, 15.05,
      //     14.51, 14.41, 13.64, 13.49, 13.25, 13.02, 12.81, 12.64, 12.58, 12.36,
      //     12.24, 12.15, 12.08, 12.08, 11.65, 11.41, 11.04, 10.88, 10.36, 9.97,
      //     9.72, 9.13, 8.44, 8.01, 7.84, 7.62, 7.49, 7.21, 7.03, 6.85, 6.66,
      //     6.64, 6.63, 6.52, 6.12, 6.04, 6.02, 5.6, 5.38, 5.33, 5.27, 5.18, 5.13,
      //     5.02, 4.77, 4.69, 4.6, 4.53, 4.42, 4.42, 4.16, 4.1, 4.07, 4.03, 3.9,
      //     3.86, 3.81, 3.78, 3.58, 3.57, 3.5, 3.35, 3.31, 3.29, 3.28, 3.0, 2.97,
      //     2.88, 2.87, 2.85, 2.78, 2.75, 2.71, 2.65, 2.59, 2.37, 2.32, 2.17,
      //     2.13, 2.09, 2.07, 1.96, 1.81, 1.77, 1.75, 1.61, 1.61, 1.6, 1.59, 1.54,
      //     1.51, 1.51, 1.44, 1.42, 1.37, 1.35, 1.34, 1.31, 1.3, 1.3, 1.28, 1.26,
      //     1.25, 1.19, 1.18, 1.17, 1.13, 1.08, 1.08, 1.06, 1.05, 1.0, 0.94, 0.94,
      //     0.92, 0.9, 0.89, 0.89, 0.88, 0.84, 0.81, 0.8, 0.78, 0.72, 0.71, 0.68,
      //     0.68, 0.68, 0.6, 0.57, 0.57, 0.53, 0.52, 0.52, 0.51, 0.48, 0.46, 0.45,
      //     0.45, 0.38, 0.38, 0.38, 0.37, 0.36, 0.36, 0.35, 0.34, 0.33, 0.32, 0.3,
      //     0.3, 0.28, 0.28, 0.28, 0.28, 0.27, 0.26, 0.26, 0.25, 0.24, 0.24, 0.24,
      //     0.24, 0.24, 0.23, 0.23, 0.2, 0.2, 0.2, 0.2, 0.19, 0.19, 0.18, 0.18,
      //     0.17, 0.16, 0.15, 0.15, 0.15, 0.14, 0.14, 0.14, 0.14, 0.13, 0.13,
      //     0.13, 0.13, 0.12, 0.12, 0.11, 0.11, 0.11, 0.11, 0.1, 0.09, 0.09, 0.09,
      //     0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.07, 0.07, 0.07, 0.07, 0.07,
      //     0.07, 0.07, 0.07, 0.06, 0.06, 0.06, 0.06, 0.06, 0.05, 0.05, 0.05,
      //     0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.04, 0.04, 0.04, 0.04,
      //     0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.03, 0.03, 0.03, 0.03, 0.03,
      //     0.03, 0.03, 0.03, 0.03, 0.03, 0.03, 0.03, 0.03, 0.03, 0.03, 0.03,
      //     0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02,
      //     0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.01, 0.01, 0.01,
      //     0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01,
      //     0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01,
      //     0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01,
      //     0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.0, 0.0, 0.0, 0.0,
      //     0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
      //     0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
      //     0.0, 0.0, 0.0, 0.0, 0.0,
      //   ],
      //   yAxis: [
      //     "上海市教育委员会",
      //     "上海市水务局（上海市海洋局）",
      //     "中国（上海）自由贸易试验区临港新片区管理委员会",
      //     "上海市体育局",
      //     "上海市浦东新区人民法院",
      //     "上海市民政局",
      //     "上海金融法院",
      //     "上海市虹口区人民法院",
      //     "上海市市场监督管理局",
      //     "上海市第一中级人民法院",
      //     "上海市第一中级人民法院",
      //     "上海市教育委员会",
      //     "上海市体育局",
      //     "上海市教育委员会",
      //     "上海市市场监督管理局",
      //     "上海市第二中级人民法院",
      //     "上海市黄浦区人民法院",
      //     "上海市静安区人民法院",
      //     "上海市闵行区人民法院",
      //     "上海市黄浦区人民法院",
      //     "上海市住房和城乡建设管理委员会",
      //     "上海市教育委员会",
      //     "上海市第一中级人民法院",
      //     "上海市民政局",
      //     "上海市松江区人民法院",
      //     "上海市规划和自然资源局",
      //     "上海市青浦区人民法院",
      //     "上海市徐汇区人民法院",
      //     "上海市体育局",
      //     "上海市交通委员会",
      //     "上海市宝山区人民法院",
      //     "上海市静安区人民法院",
      //     "上海市嘉定区人民法院",
      //     "上海市教育委员会",
      //     "上海市浦东新区人民法院",
      //     "上海市浦东新区人民法院",
      //     "上海市长宁区人民法院",
      //     "上海市虹口区人民法院",
      //     "上海市闵行区人民法院",
      //     "中国（上海）自由贸易试验区临港新片区管理委员会",
      //     "上海市奉贤区人民法院",
      //     "上海市静安区人民法院",
      //     "上海市普陀区人民法院",
      //     "上海市规划和自然资源局",
      //     "上海市普陀区人民法院",
      //     "上海市教育委员会",
      //     "上海市教育委员会",
      //     "上海市徐汇区人民法院",
      //     "上海市嘉定区人民法院",
      //     "上海市宝山区人民法院",
      //     "上海市杨浦区人民法院",
      //     "上海铁路运输法院",
      //     "上海市金山区人民法院",
      //     "上海市青浦区人民法院",
      //     "上海市黄浦区人民法院",
      //     "中共上海市纪律检查委员会机关",
      //     "上海市交通委员会",
      //     "上海市金山区人民法院",
      //     "上海市长宁区人民法院",
      //     "上海市松江区人民法院",
      //     "上海市教育委员会",
      //     "上海市第二中级人民法院",
      //     "上海市教育委员会",
      //     "上海市闵行区人民法院",
      //     "上海市药品监督管理局",
      //     "上海市体育局",
      //     "上海市崇明区人民法院",
      //     "上海市交通委员会",
      //     "上海市徐汇区人民法院",
      //     "上海市科学技术委员会",
      //     "上海市崇明区人民法院",
      //     "上海市金山区人民法院",
      //     "上海市医疗保障局1",
      //     "上海市虹口区人民法院",
      //     "上海市规划和自然资源局",
      //     "上海市绿化和市容管理局",
      //     "上海市住房和城乡建设管理委员会",
      //     "上海市交通委员会",
      //     "上海市市场监督管理局",
      //     "上海市住房和城乡建设管理委员会",
      //     "上海市教育委员会",
      //     "上海市农业农村委员会",
      //     "上海市奉贤区人民法院",
      //     "上海市科学技术委员会",
      //     "上海市绿化和市容管理局",
      //     "上海市松江区人民法院",
      //     "中共上海市委党校",
      //     "上海市教育委员会",
      //     "上海市教育委员会",
      //     "上海申康医院发展中心",
      //     "上海市财政局",
      //     "上海市机关事务管理局",
      //     "上海市经济和信息化委员会",
      //     "上海市长宁区人民法院",
      //     "中央预算单位",
      //     "上海市水务局（上海市海洋局）",
      //     "上海市规划和自然资源局",
      //     "上海市公安局",
      //     "上海市教育委员会",
      //     "上海市杨浦区人民法院",
      //     "上海市普陀区人民法院",
      //     "上海海事法院",
      //     "上海社会科学院",
      //     "上海市黄浦区人民法院",
      //     "上海市水务局（上海市海洋局）",
      //     "上海市交通委员会",
      //     "上海市妇女联合会",
      //     "上海市应急管理局",
      //     "上海市青浦区人民法院",
      //     "上海铁路运输法院",
      //     "上海市经济和信息化委员会",
      //     "上海市住房和城乡建设管理委员会",
      //     "上海市奉贤区人民法院",
      //     "上海市第一中级人民法院",
      //     "上海化学工业区管理委员会",
      //     "上海市机关事务管理局",
      //     "上海市人力资源和社会保障局",
      //     "上海市教育委员会",
      //     "上海市静安区人民法院",
      //     "上海市体育局",
      //     "上海市文化和旅游局",
      //     "中国（上海）自由贸易试验区临港新片区管理委员会",
      //     "上海市长宁区人民法院",
      //     "上海市农业农村委员会",
      //     "上海市经济和信息化委员会",
      //     "上海市交通委员会",
      //     "上海市第二中级人民法院",
      //     "上海市徐汇区人民法院",
      //     "上海市绿化和市容管理局",
      //     "上海金融法院",
      //     "上海市卫生健康委员会",
      //     "上海市奉贤区人民法院",
      //     "上海市退役军人事务局",
      //     "上海市监狱管理局",
      //     "上海市崇明区人民法院",
      //     "上海市第二中级人民法院",
      //     "中国共产党上海市委员会宣传部",
      //     "中国福利会",
      //     "上海医药（集团）有限公司",
      //     "上海市市场监督管理局",
      //     "上海市生态环境局",
      //     "上海市应急管理局",
      //     "上海市松江区人民法院",
      //     "上海市宝山区人民法院",
      //     "上海申康医院发展中心",
      //     "中国福利会",
      //     "上海市人力资源和社会保障局",
      //     "上海市嘉定区人民法院",
      //     "上海华谊控股集团有限公司",
      //     "上海市交通委员会",
      //     "上海市水务局（上海市海洋局）",
      //     "上海市科学技术委员会",
      //     "上海博物馆",
      //     "上海市机关事务管理局",
      //     "上海市科学技术协会",
      //     "上海市普陀区人民法院",
      //     "上海市杨浦区人民法院",
      //     "中国共产党上海市委员会宣传部",
      //     "上海市教育委员会",
      //     "上海市民政局",
      //     "上海市卫生健康委员会",
      //     "上海市工商业联合会",
      //     "上海良友（集团）有限公司",
      //     "上海市松江区人民检察院",
      //     "上海市交通委员会",
      //     "上海市卫生健康委员会",
      //     "上海市住房和城乡建设管理委员会",
      //     "上海市教育委员会",
      //     "上海市文化和旅游局",
      //     "上海市国防动员办公室",
      //     "上海市体育局",
      //     "上海市药品监督管理局",
      //     "上海市国防动员办公室",
      //     "上海市发展和改革委员会",
      //     "上海市卫生健康委员会",
      //     "上海市住房和城乡建设管理委员会",
      //     "上海市虹口区人民法院",
      //     "上海市发展和改革委员会",
      //     "上海市体育局",
      //     "上海市民政局",
      //     "上海市杨浦区人民法院",
      //     "上海市人民政府合作交流办公室",
      //     "上海市妇女联合会",
      //     "上海海事法院",
      //     "上海市文化和旅游局",
      //     "上海市人民政府合作交流办公室",
      //     "上海市青浦区人民法院",
      //     "百联集团有限公司",
      //     "上海市国防动员办公室",
      //     "上海市闵行区人民法院",
      //     "上海市宝山区人民法院",
      //     "上海市社会科学界联合会",
      //     "上海市浦东新区人民检察院",
      //     "上海市卫生健康委员会",
      //     "上海市市场监督管理局",
      //     "上海市专用通信局",
      //     "上海市人力资源和社会保障局",
      //     "上海市卫生健康委员会",
      //     "上海市教育委员会",
      //     "上海市妇女联合会",
      //     "上海市经济和信息化委员会",
      //     "上海博物馆",
      //     "中央预算单位",
      //     "上海市闵行区人民检察院",
      //     "上海社会科学院",
      //     "上海市监狱管理局",
      //     "上海市金山区人民法院",
      //     "上海市监狱管理局",
      //     "上海化学工业区管理委员会",
      //     "上海市规划和自然资源局",
      //     "上海市经济和信息化委员会",
      //     "上海市生态环境局",
      //     "上海市静安区人民检察院",
      //     "上海市金山区人民检察院",
      //     "中国福利会",
      //     "上海铁路运输检察院",
      //     "上海市文化和旅游局",
      //     "上海市检测中心",
      //     "上海市民政局",
      //     "上海市医疗保障局1",
      //     "上海市住房和城乡建设管理委员会",
      //     "上海市住房和城乡建设管理委员会",
      //     "上海市经济和信息化委员会",
      //     "上海市绿化和市容管理局",
      //     "中国共产党上海市委员会宣传部",
      //     "上海市司法局",
      //     "上海市工商业联合会",
      //     "上海市科学技术委员会",
      //     "上海市人民政府外事办公室",
      //     "上海市应急管理局",
      //     "上海市绿化和市容管理局",
      //     "上海市文化和旅游局",
      //     "上海市卫生健康委员会",
      //     "上海市住房和城乡建设管理委员会",
      //     "上海市残疾人联合会",
      //     "上海国际问题研究院",
      //     "上海市住房和城乡建设管理委员会",
      //     "上海市文化和旅游局",
      //     "上海市人力资源和社会保障局",
      //     "上海市徐汇区人民检察院",
      //     "上海市卫生健康委员会",
      //     "上海市金山区人民检察院",
      //     "上海市农业农村委员会",
      //     "上海市徐汇区人民检察院",
      //     "上海市水务局（上海市海洋局）",
      //     "上海市虹口区人民检察院",
      //     "上海市经济和信息化委员会",
      //     "上海市档案局（馆）",
      //     "上海市住房和城乡建设管理委员会",
      //     "上海市文化和旅游局",
      //     "上海市崇明区人民检察院",
      //     "上海市科学技术委员会",
      //     "中国共产党上海市委员会宣传部",
      //     "上海博物馆",
      //     "上海市青浦区人民检察院",
      //     "上海市农业农村委员会",
      //     "上海市崇明区人民法院",
      //     "上海市人民检察院第一分院",
      //     "上海社会科学院",
      //     "中国共产主义青年团上海市委员会",
      //     "上海市档案局（馆）",
      //     "上海市生态环境局",
      //     "上海市退役军人事务局",
      //     "上海市杨浦区人民检察院",
      //     "上海市药品监督管理局",
      //     "上海市生态环境局",
      //     "上海市科学技术委员会",
      //     "上海金融法院",
      //     "上海社会科学院",
      //     "上海市虹口区人民检察院",
      //     "中国（上海）自由贸易试验区临港新片区管理委员会",
      //     "上海市工商业联合会",
      //     "上海市经济和信息化委员会",
      //     "上海市嘉定区人民检察院",
      //     "上海市科学技术协会",
      //     "上海市卫生健康委员会",
      //     "上海市科学技术协会",
      //     "上海市规划和自然资源局",
      //     "上海市人民检察院第一分院",
      //     "上海市机关事务管理局",
      //     "上海市农业农村委员会",
      //     "上海市退役军人事务局",
      //     "上海市民政局",
      //     "上海市发展和改革委员会",
      //     "上海市社会主义学院",
      //     "上海市监狱管理局",
      //     "上海市规划和自然资源局",
      //     "上海市司法局",
      //     "上海市静安区人民检察院",
      //     "上海虹桥国际中央商务区管理委员会",
      //     "中共上海市纪律检查委员会机关",
      //     "上海市经济和信息化委员会",
      //     "中共上海市委党校",
      //     "上海市宝山区人民检察院",
      //     "上海市交通委员会",
      //     "上海市规划和自然资源局",
      //     "上海市规划和自然资源局",
      //     "上海市审计局",
      //     "上海市生态环境局",
      //     "上海铁路运输法院",
      //     "上海市公安局",
      //     "上海市市场监督管理局",
      //     "上海市教育委员会",
      //     "上海市检测中心",
      //     "上海市崇明区人民检察院",
      //     "上海市奉贤区人民检察院",
      //     "上海市医疗保障局1",
      //     "上海市人民检察院",
      //     "上海市药品监督管理局",
      //     "上海市残疾人联合会",
      //     "上海市统计局",
      //     "上海市第一中级人民法院",
      //     "上海市应急管理局",
      //     "上海市文化和旅游局",
      //     "上海市残疾人联合会",
      //     "上海市浦东新区人民检察院",
      //     "上海市人民检察院第二分院",
      //     "上海海事法院",
      //     "上海市绿化和市容管理局",
      //     "上海市长宁区人民检察院",
      //     "中国共产主义青年团上海市委员会",
      //     "上海市青浦区人民检察院",
      //     "上海市应急管理局",
      //     "上海市国防动员办公室",
      //     "中国共产党上海市委员会宣传部",
      //     "上海市文学艺术界联合会",
      //     "上海社会科学院",
      //     "上海市人民检察院第一分院",
      //     "上海市政协办公厅",
      //     "中共上海市委机构编制委员会办公室",
      //     "中国共产主义青年团上海市委员会",
      //     "上海市科学技术协会",
      //     "中国共产主义青年团上海市委员会",
      //     "上海市长宁区人民检察院",
      //     "上海市松江区人民法院",
      //     "上海市公安局",
      //     "上海市退役军人事务局",
      //     "上海市司法局",
      //     "上海市国防动员办公室",
      //     "上海市静安区人民法院",
      //     "上海市人民政府合作交流办公室",
      //     "上海市文化和旅游局执法总队",
      //     "上海市检测中心",
      //     "上海市司法局",
      //     "上海市药品监督管理局",
      //     "中国（上海）自由贸易试验区临港新片区管理委员会",
      //     "上海市工商业联合会",
      //     "上海市人民政府合作交流办公室",
      //     "上海良友（集团）有限公司",
      //     "中央预算单位",
      //     "上海市住房和城乡建设管理委员会",
      //     "上海市卫生健康委员会",
      //     "上海市司法局",
      //     "上海市机关事务管理局",
      //     "上海市嘉定区人民法院",
      //     "上海申康医院发展中心",
      //     "上海市杨浦区人民法院",
      //     "上海市金山区人民法院",
      //     "上海市青浦区人民检察院",
      //     "上海市长宁区人民法院",
      //     "上海金融法院",
      //     "上海市黄浦区人民法院",
      //     "上海市奉贤区人民检察院",
      //     "上海市黄浦区人民检察院",
      //     "上海市崇明区人民法院",
      //     "上海市徐汇区人民检察院",
      //     "上海市水务局（上海市海洋局）",
      //     "上海市徐汇区人民法院",
      //     "上海市人民政府发展研究中心",
      //     "上海市闵行区人民法院",
      //     "上海市崇明区人民检察院",
      //     "上海市文学艺术界联合会",
      //     "上海市人民政府发展研究中心",
      //     "上海市嘉定区人民检察院",
      //     "上海市统计局",
      //     "上海市青浦区人民法院",
      //     "上海市发展和改革委员会",
      //     "上海市知识产权局",
      //     "上海市市场监督管理局",
      //     "上海国盛（集团）有限公司",
      //     "上海市松江区人民检察院",
      //     "上海市财政局",
      //     "上海市社会科学界联合会",
      //     "上海市嘉定区人民法院",
      //     "上海市交通委员会",
      //     "上海市人民检察院第二分院",
      //     "上海市残疾人联合会",
      //     "上海市文史研究馆",
      //     "上海金融法院",
      //     "上海市住房和城乡建设管理委员会",
      //     "上海市国际贸易促进委员会",
      //     "上海市长宁区人民检察院",
      //     "上海市残疾人联合会",
      //     "上海市工商业联合会",
      //     "上海市金山区人民检察院",
      //     "上海市嘉定区人民检察院",
      //     "上海市水务局（上海市海洋局）",
      //     "上海市医疗保障局1",
      //     "上海市松江区人民检察院",
      //     "上海市文化和旅游局执法总队",
      //     "上海市红十字会",
      //     "上海市民政局",
      //     "上海良友（集团）有限公司",
      //     "上海市文史研究馆",
      //     "上海市统计局",
      //     "上海市宝山区人民检察院",
      //     "上海市人民检察院第二分院",
      //     "上海市浦东新区人民检察院",
      //     "上海市金山区人民检察院",
      //     "上海市虹口区人民法院",
      //     "上海市奉贤区人民法院",
      //     "上海市专用通信局",
      //     "上海铁路运输检察院",
      //     "上海市残疾人联合会",
      //     "上海市绿化和市容管理局",
      //     "上海华谊控股集团有限公司",
      //     "九三学社上海市委员会",
      //     "上海市社会主义学院",
      //     "中共上海市委机构编制委员会办公室",
      //     "上海市残疾人联合会",
      //     "上海市崇明区人民检察院",
      //     "上海市红十字会",
      //     "上海市民族和宗教事务局",
      //     "上海市宝山区人民法院",
      //     "上海市人力资源和社会保障局",
      //     "上海市宝山区人民检察院",
      //     "上海市对外文化交流å会",
      //     "上海市市场监督管理局",
      //     "上海市黄浦区人民检察院",
      //     "上海市宣传文化人才服务中心",
      //     "中国共产党上海市委员会组织部",
      //     "上海市金山区人民检察院",
      //     "上海铁路运输法院",
      //     "上海市静安区人民检察院",
      //     "上海市徐汇区人民检察院",
      //     "中共上海市委老干部局",
      //     "中国（上海）自由贸易试验区临港新片区管理委员会",
      //     "上海市残疾人联合会",
      //     "上海市普陀区人民检察院",
      //     "上海市人民政府外事办公室",
      //     "中国共产主义青年团上海市委员会",
      //     "上海铁路运输法院",
      //     "九三学社上海市委员会",
      //     "上海市知识产权局",
      //     "上海市作家协会",
      //     "上海国际问题研究院",
      //     "上海仪电（集团）有限公司",
      //     "上海市经济和信息化委员会",
      //     "上海市闵行区人民检察院",
      //     "上海市绿化和市容管理局",
      //     "中国福利会",
      //     "上海市机关事务管理局",
      //     "上海市规划和自然资源局",
      //     "上海市公安局",
      //     "上海市知识产权局",
      //     "上海市水务局（上海市海洋局）",
      //     "上海市宣传文化人才服务中心",
      //     "上海市宣传文化人才服务中心",
      //     "上海市红十字会",
      //     "上海市松江区人民检察院",
      //     "上海市徐汇区人民法院",
      //     "上海市黄浦区人民检察院",
      //     "中国福利会",
      //     "上海市普陀区人民法院",
      //     "上海市奉贤区人民检察院",
      //     "上海市人力资源和社会保障局",
      //     "上海市社会科学界联合会",
      //     "中国（上海）自由贸易试验区临港新片区管理委员会",
      //     "上海国盛（集团）有限公司",
      //     "上海市药品监督管理局",
      //     "中国共产党上海市委员会宣传部",
      //     "上海市民政局",
      //   ],
      // },

      myChart2: null, //按主管单位图

      //图3
      graphData3: {},

      // graphData3: {
      //   legend: [
      //     "上海市应急管理局",
      //     "上海市规划和自然资源局",
      //     "上海市绿化和市容管理局",
      //     "上海市生态环境局",
      //   ],
      //   seriesData: [
      //     {
      //       name: "上海市应急管理局",
      //       code: "102",
      //       data: [0, 0, 0, 0, 32.46],
      //       projectNum: [0, 0, 0, 0, 6],
      //       rate: [0, 0, 0, 0, 6],
      //     },
      //     {
      //       name: "上海市规划和自然资源局",
      //       code: "166",
      //       data: [0, 0, 0, 0, 11434.67],
      //       projectNum: [0, 0, 0, 0, 14],
      //       rate: [0, 0, 0, 0, 76],
      //     },
      //     {
      //       name: "上海市绿化和市容管理局",
      //       code: "180",
      //       data: [0, 0, 0, 0, 98.28],
      //       projectNum: [0, 0, 0, 0, 11],
      //       rate: [0, 0, 0, 0, 18],
      //     },
      //     {
      //       name: "上海市生态环境局",
      //       code: "120",
      //       data: [0, 0, 0, 0, 12.1],
      //       projectNum: [0, 0, 0, 0, 6],
      //       rate: [0, 0, 0, 0, 3],
      //     },
      //   ],
      //   xAxis: ["2019", "2020", "2021", "2022", "2023"],
      //   yAxis: {
      //     // name: "项目数量（个）",
      //     name: "金额（万元）",
      //   },
      // },

      myChart3: null, //历年趋势图
      orderType: "金额",
      orderChose: [
        {
          label: "金额",
          value: "金额",
        },
        {
          label: "项目数量",
          value: "项目数量",
        },
      ],

      //主管单位弹框
      manageUnitTree: [
        //新
        // {
        //   key: "0001——中国",
        //   value: "1",
        // },
        //原来
        // {
        //   title: "市级",
        //   value: "市级",
        //   key: "市级",
        // },
        // {
        //   title: "省级",
        //   value: "省级",
        //   key: "省级",
        // },
      ],
      unitShow: false,
      unitTitle: "",
      //用户选择的主管单位
      choosedManageUnit: [],
      choosedManageUnitCopy: [],
      top8ManageUnit: [],

      //非税收入类型选择框  树结构
      notaxIncomeType: [], //非税收入类型选择框
      typeOptions: [
        // {
        //   title: "市级",
        //   value: "市级_1",
        //   key: "市级_1",
        //   children: [
        //     {
        //       title: "民政局",
        //       value: "民政局_2",
        //       key: "民政局_2",
        //     },
        //   ],
        // },
      ],
      typeLevel: null, //选中类型是子节点还是父节点  1：父 2：子
      typeName: null,
    };
  },
  computed: {
    ...mapState("blockAnalysis", [
      "choosedBlockName",
      "choosedBlockId",
      "blockChoosedYear",
    ]),
    yearRange() {
      return getYearStartEnd(this.blockChoosedYear);
    },
  },
  watch: {
    choosedBlockId: {
      async handler(newVal, oldVal) {
        console.log("5656555", newVal, oldVal);
        this.orderType = "金额";
        //重新获取非税收入类型和主管单位
        this.notaxIncomeType = [];
        this.choosedManageUnit = [];
        this.choosedManageUnitCopy = [];
        await this.getNoTaxOverviewData();
        await this.getNoTaxChartThreeUnit(); //获取所有主管单位
        await this.getNoTaxChartThreeMoneyTop8(); // 金额时Top8主管单位获取
        await this.initAllCharts();

        await this.getNoTaxChartThreeType();
      },
      deep: true,
    },
    blockChoosedYear: {
      async handler(newVal, oldVal) {
        console.log("5656555", newVal, oldVal);
        this.orderType = "金额";
        //重新获取非税收入类型和主管单位
        this.notaxIncomeType = [];
        this.choosedManageUnit = [];
        this.choosedManageUnitCopy = [];
        await this.getNoTaxOverviewData();
        await this.getNoTaxChartThreeUnit();
        await this.getNoTaxChartThreeMoneyTop8(); // 金额时Top8主管单位获取
        await this.initAllCharts();

        await this.getNoTaxChartThreeType();
      },
    },
  },
  components: {
    ATooltip: Tooltip,
    ASelect: Select,
    ARadioGroup: RadioGroup,
    ATreeSelect: TreeSelect,
  },
  async mounted() {
    window.goManagePortrait = this.goManagePortrait;
    window.goNoTaxDeatil = this.goNoTaxDeatil;
    //板块数据
    await this.getNoTaxOverviewData();
    await this.getNoTaxChartThreeUnit(); //主管单位选择框数据
    await this.getNoTaxChartThreeMoneyTop8(); // 金额时Top8主管单位获取
    // 非税收入类型下拉框选项数据
    this.getNoTaxChartThreeType();
    this.initAllCharts();
  },
  beforeDestroy() {
    this.myChart1.dispose();
    this.myChart2.dispose();
    this.myChart3.dispose();

    const f = () => {
      this.myChart1.resize();
      this.myChart2.resize();
      this.myChart3.resize();
    };
    window.removeEventListener("resize", f);
  },
  methods: {
    initAllCharts() {
      this.initEcharts1();
      this.initEcharts2();
      this.initEcharts3(this.typeLevel, this.typeName);
      const f = () => {
        this.myChart1.resize();
        this.myChart2.resize();
        this.myChart3.resize();
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
    async getNoTaxOverviewData() {
      const json = {
        unitIndustry: this.choosedBlockName,
        year: this.blockChoosedYear,
      };
      const res = await getNoTaxOverviewData(json);
      if (res.message === "成功") {
        this.noTaxData = res.data;
        if (res.data.length) {
          //记录下非税收入总额，后续查询玫瑰图需作为入参传给后端
          this.noTaxMoney = res.data[0].num;
        }
      } else {
        this.$message.error(res.message);
      }
    },

    //跳转到非税收入明细
    goNoTaxDeatil(timeStart, timeEnd, manage, type) {
      //开始时间+结束时间+主管单位+收入类别
      const params = {
        time: [timeStart, timeEnd],
        type: type,
        manage: manage,
      };
      this.$router.push({
        path: "/block-analysis/no-tax-detail",
        query: params,
      });
    },

    //获取图三所有主管单位
    async getNoTaxChartThreeUnit() {
      const json = {
        year: this.blockChoosedYear,
        unitIndustry: this.choosedBlockName,
      };
      const res = await getNoTaxChartThreeUnit(json);
      if (res.message === "成功") {
        this.manageUnitTree = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //旭日图颜色递归
    forColor(data, i, k) {
      //k是第几个，i是第几层
      if (!data.children) {
        //如果没children，赋予一个itemStyle，然后return
        data.itemStyle = {
          color: this.sunColor[k][i],
        };
        data.name = data.name + "\n" + data.per.toString() + "%";
        return;
      }
      //有children，赋予itemStyle，往children里遍历
      data.itemStyle = {
        color: this.sunColor[k][i],
      };
      //内层类型、占比写在图上
      data.name = data.name + "\n" + data.per.toString() + "%";
      for (let j = 0; j < data.children.length; j++) {
        this.forColor(data.children[j], i + 1, k);
      }
    },

    // 按类型非税收入分布图展示（图1）
    async getNoTaxChartOne() {
      const json = {
        year: this.blockChoosedYear,
        unitIndustry: this.choosedBlockName,
        jeTotal: this.noTaxMoney,
      };
      const res = await getNoTaxChartOne(json);
      if (res.message === "成功") {
        this.graphData1 = res.data;
      } else {
        this.$message.error(res.message);
      }
      //前端对itemStyle的处理,调用forColor
      for (let k = 0; k < this.graphData1.length; k++) {
        this.forColor(this.graphData1[k], 0, k);
      }
    },

    async initEcharts1() {
      if (this.myChart1) {
        this.myChart1.dispose();
      }
      this.myChart1 = this.$echarts.init(this.$refs.graph1);
      await this.getNoTaxChartOne();
      const _that = this;

      const option1 = {
        //中将添加文字
        title: {
          text: _that.noTaxData[0].num.toLocaleString(),
          subtext: "非税收入总金额（万元）",
          left: "center",
          top: "45%",
          itemGap: 2,
          textStyle: {
            color: "#333",
            fontSize: 30,
            fontWeight: "bold",
          },
        },
        tooltip: {
          enterable: true,
          //trigger: "axis",
          //triggerOn: "mousemove",
          triggerOn: "mousemove", // 设置触发方式为悬停
          // 固定提示框位置
          position: function (point, params, dom, rect, size) {
            // console.log("tooltip参数point", point);
            // console.log("tooltip参数params", params);
            // console.log("tooltip参数dom", dom);
            // console.log("tooltip参数rect", rect);
            // console.log("tooltip参数size", size);
            return [point[0] + 5, point[1] + 5];
          },
          formatter: function (params) {
            if (params.seriesName.length === 0) {
              return ""; // 没有数据时，不显示 tooltip
            }
            const paramsYear = _that.yearRange;
            const name = params.name.split("\n");

            //jump
            //用户点击图形上的某一项分类后，系统跳转进入【非税收入明细表】，并自动附带筛选条件【板块名称】【收入类别】、【时间范围】。
            return `<div class="ratio-tooltip-box" style="pointer-events:auto">
              <div>非税收入类型：${name[0]}</div>
              <a onClick="goNoTaxDeatil('${paramsYear[0]}','${
              paramsYear[1]
            }',null,'${
              name[0]
            }')">非税收入金额：${params.value.toLocaleString()}万元</a>
              <div>占比：${params.data.per}%</div>
            </div>`;
          },
        },
        series: {
          type: "sunburst",
          nodeClick: false, //找了一个多小时的功能：移除旭日图默认点击事件，但是自己的点击事件还在
          emphasis: {
            // focus: "none", //取消鼠标移入高亮
            focus: "self", // 点击扇形自身高亮
          },
          //选中高亮
          selectedMode: "single",
          select: {
            itemStyle: {
              // color: "#000",
              // border: "1px solid #000",
              // borderWidth: 2,
              borderColor: "rgba(0, 255, 0, 0.8)",
              // borderType: "solid",
              color: "rgba(0, 255, 0, 0.8)", // 选中时的颜色
              shadowBlur: 30, // 选中时的阴影模糊程度
              shadowColor: "rgba(0, 0, 0, 0.5)", // 选中时的阴影颜色
              shadowOffsetX: 15, // 选中时的阴影水平偏移
              shadowOffsetY: 15, // 选中时的阴影垂直偏移
            },
          },
          // 设置触发高亮的条件
          triggerOn: "click",
          // silent: true,
          itemStyle: {
            borderWidth: 3,
          },
          data: this.graphData1,
          // radius: ["20%", "100%"],
          //单位名称过长，超出5位省略
          label: {
            rotate: "radial",
            formatter: function (params) {
              // console.log("图1label里的params", params);
              if (params.data.children) {
                //内圈
                if (params.data.per <= 1) {
                  //百分比小于等于1
                  return " ";
                } else {
                  // console.log("params.name", params.name.split("\n"));
                  if (params.name.split("\n")[0].length < 6) {
                    //名字长度控制
                    return params.name;
                  } else {
                    //名字长度控制
                    return (
                      params.name.split("\n")[0].slice(0, 5) +
                      "..." +
                      "\n" +
                      params.name.split("\n")[1]
                    );
                  }
                }
              } else {
                //外圈
                if (params.data.per <= 1) {
                  //百分比小于等于1
                  return " ";
                } else {
                  if (params.name.split("\n")[0].length < 6) {
                    //名字长度控制
                    return (
                      params.name.split("\n")[0] +
                      "\n" +
                      "        " + // 添加空格
                      params.name.split("\n")[1] +
                      "        "
                    );
                  } else {
                    //名字长度控制
                    return (
                      params.name.split("\n")[0].slice(0, 5) +
                      "..." +
                      "\n" +
                      "        " + // 添加空格
                      params.name.split("\n")[1] +
                      "        "
                    );
                  }
                }
              }
            },
          },
          levels: [
            {},
            {
              //控制每一层的宽度
              r0: "23%",
              r: "60%",
              //内圈横过来
              label: {
                rotate: 0,
              },
            },
            {
              r0: "60%",
              r: "72%",
              label: {
                position: "outside",
                padding: 2,
                distance: 10, // 调整文字与图形的距离
              },
            },
          ],
        },
      };

      this.myChart1.setOption(option1, true);

      // 监听鼠标点击事件
      this.myChart1.on("click", (params) => {
        if (params.seriesType === "sunburst") {
          // console.log("点击了旭日图元素:", params);
          //对比两次点击是否相同，如果相同则重置
          //更新子图 从 主图子图联动
          // console.log(
          //   "此次点击传递的参数level和name",
          //   params.data.level === this.lastSelectedLevel &&
          //     params.data.name === this.lastSelectedName
          //     ? 0
          //     : params.data.level,
          //   params.data.name.split("\n")[0]
          // );
          if (
            params.data.level === this.lastSelectedLevel &&
            params.data.name === this.lastSelectedName
          ) {
            //选的同一级，同一块，也就是重置
            this.initEcharts2(0, params.data.name.split("\n")[0]);
            //充值完了之后把层级和name置空，因为下一次不管点击那一块都不会和上一次一样
            this.lastSelectedLevel = null;
            this.lastSelectedName = null;
          } else {
            //选的不是同一块，传递选中的层级level和name
            this.initEcharts2(
              params.data.level,
              params.data.name.split("\n")[0]
            );
            //刷新最近选择的层级和name
            this.lastSelectedLevel = params.data.level;
            this.lastSelectedName = params.data.name;
          }
        }
      });
    },

    // 按主管单位非税收入分布图展示（图2）
    async getNoTaxChartTwo(level, name) {
      let json;
      if (level === 1) {
        json = {
          year: this.blockChoosedYear,
          unitIndustry: this.choosedBlockName,
          jeTotal: this.noTaxMoney,
          nontaxTypeNameOne: name,
        };
      } else if (level === 2) {
        json = {
          year: this.blockChoosedYear,
          unitIndustry: this.choosedBlockName,
          jeTotal: this.noTaxMoney,
          nontaxTypeNameTwo: name,
        };
      } else {
        json = {
          year: this.blockChoosedYear,
          unitIndustry: this.choosedBlockName,
          jeTotal: this.noTaxMoney,
        };
      }
      const res = await getNoTaxChartTwo(json);
      if (res.message === "成功") {
        let obj = {
          yAxis: null,
          seriesData: null,
          data: null,
        };
        obj.yAxis = res.data.yaxis || res.data.yAxis;
        obj.seriesData = res.data.seriesData;
        obj.data = res.data.data;
        this.graphData2 = obj;
      } else {
        this.$message.error(res.message);
      }
    },
    async initEcharts2(level, name) {
      //联动需要先clear
      if (this.myChart2) {
        this.myChart2.dispose();
      }
      this.myChart2 = this.$echarts.init(this.$refs.graph2);
      await this.getNoTaxChartTwo(level, name);
      const _that = this; //解决series中颜色渐变处需要new一个echarts时的this搜不到的问题

      const option2 = {
        tooltip: {
          enterable: true,
          triggerOn: "mousemove", // 设置触发方式为悬停
          // jump
          // 1.提供图表穿透功能：用户点击图形上的某一项分类后，系统跳转进入【非税收入明细表】，并自动附带筛选条件【主管单位名称】、【时间范围】。
          formatter: function (params) {
            // if (params.seriesName.length === 0) {
            //   return ""; // 没有数据时，不显示 tooltip
            // }
            const paramsYear = _that.yearRange;
            return `<div class="ratio-tooltip-box">
              <div>
                主管单位代码：${
                  _that.graphData2.seriesData[params.dataIndex].code
                }
              </div>
              <a onClick="goManagePortrait('${params.name}')">主管单位名称：${
              params.name
            }</a>
              <div>
                <a style="cursor: pointer;" onClick="goNoTaxDeatil('${
                  paramsYear[0]
                }','${paramsYear[1]}','${
              params.name
            }')">非税收入金额：${params.data.toLocaleString()}万元</a>
              </div>
              <div>占比：${
                _that.graphData2.seriesData[params.dataIndex].rate
              }%</div>
            </div>`;
          },
          // 固定提示框位置
          position: function (point) {
            return [point[0] + 5, point[1] + 5];
          },
        },
        grid: {
          left: "42%", // 调整左边距
          right: "5%", // 调整右边距
          top: "10%", // 调整上边距
          bottom: "5%", // 调整下边距
        },
        xAxis: {
          show: true,
          type: "value",
          //xAxis的最大最小值会根据当前展示的数据自适应，设置min、max的话max需要加个逻辑，取data里的最大值，min可以设置成0
          scale: true,
          // min:0,
          // max:100,
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
          data: this.graphData2.yAxis,
          // show:false,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
            alignWithLabel: true,
          },
          splitArea: { show: false },
          axisLabel: {
            formatter: function (params) {
              // console.log("图2label里的params", params);
              if (params.length < 21) {
                return params;
              } else {
                return params.slice(0, 20) + "...";
              }
            },
          },
        },

        dataZoom: [
          {
            // 设置滚动条的隐藏与显示
            show: _that.graphData2.yAxis.length > 9 ? true : false,
            // 设置滚动条类型
            type: "slider",
            // 设置背景颜色
            backgroundColor: "rgba(221, 220, 107, 0.1)",
            // 设置选中范围的填充颜色
            // fillerColor: "rgb(22, 93, 255)",
            // 设置边框颜色
            borderColor: "#F1F2F5",
            // 是否显示detail，即拖拽时候显示详细数值信息
            showDetail: false,
            // 数据窗口范围的起始数值
            startValue: _that.graphData2.yAxis.length - 1,
            // 数据窗口范围的结束数值（一页显示多少条数据，从0开始）
            endValue: _that.graphData2.yAxis.length - 9,
            // empty：当前数据窗口外的数据，被设置为空。
            // 即不会影响其他轴的数据范围
            filterMode: "filter",
            // filterMode: "empty",
            // 设置滚动条宽度，相对于盒子宽度
            width: 10,
            // 设置滚动条高度
            height: "90%",
            // left: 5,
            right: 1,
            // bottom: 4,
            // 设置滚动条显示位置
            // left: 20,
            // right: -20, //右边的距离  todo
            // 是否锁定选择区域（或叫做数据窗口）的大小
            zoomLock: true, //todo
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
        series: [
          {
            data: _that.graphData2.data,
            type: "bar",
            showBackground: true,
            backgroundStyle: {
              color: "rgba(180, 180, 180, 0.2)",
              borderRadius: [10, 10, 10, 10], // 圆角设置
            },
            barWidth: 22, //柱图宽度
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
                    const data = params.data.toLocaleString();
                    return data + "万元";
                  },
                },
                color: _that.lineColor[0],
              },
            },
          },
        ],
        // series: [
        //   {
        //     data: _that.graphData2.data,
        //     type: "bar",
        //     showBackground: true,
        //     backgroundStyle: {
        //       color: "white",
        //       borderRadius: [10, 10, 10, 10], // 圆角设置
        //       // borderColor: "black",
        //       // borderWidth: 1,
        //     },
        //     barWidth: 22, //柱图宽度
        //     itemStyle: {
        //       normal: {
        //         // 第一个值表示顶部的左上角，第二个值表示顶部右上角
        //         // 第三个值表示底部左下角，第四个值表示底部右下角
        //         barBorderRadius: [10, 10, 10, 10],
        //         label: {
        //           show: true, //是否展示
        //           position: "right", //在上方显示
        //           textStyle: {
        //             //数值样式，显示的文字大小和颜色
        //             fontSize: "12",
        //             color: "#0A1F44",
        //           },
        //           formatter: (params) => {
        //             const data = params.data.toLocaleString();
        //             return data + "万元";
        //           },
        //         },
        //         color: _that.lineColor[0],
        //       },
        //     },
        //   },
        // ],
        // backgroundColor: "rgba(0, 0, 0, 0.1)",
        //老版本纵向的

        // xAxis: [
        //   {
        //     type: "category",
        //     // name: "时间",
        //     nameLocation: "end",
        //     data: this.graphData2.xAxis,
        //     axisLabel: {
        //       // rotate: -15,
        //       fontSize: 10, // 设置文字大小为10，再大一点就放不下了
        //       color: "#97A3B7",
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
        // yAxis: [
        //   {
        //     type: "value",
        //     name: "非税收入金额",
        //     nameLocation: "end",
        //     axisLabel: {
        //       color: "#97A3B7",
        //       //去除横纵坐标的起始0
        //       formatter: (value) => (value === 0 ? "" : value),
        //     },
        //   },
        // ],
        // dataZoom: [
        //   {
        //     show: true,
        //     height: 4,
        //     bottom: 2,
        //     startValue: 0, //起始值
        //     endValue: 7, //结束值
        //     brushSelect: false, //碍事的默认滚动条消除
        //     fillerColor: "rgb(22, 93, 255)", // 滚动条颜色
        //     // borderColor: "rgba(17, 100, 210, 0.12)",
        //     backgroundColor: "rgba(221, 220, 107, 0.1)", //两边未选中的滑动条区域的颜色
        //     handleSize: 0, //两边手柄尺寸
        //     showDetail: false, //拖拽时是否展示滚动条两侧的文字
        //     zoomLock: true, //是否只平移不缩放
        //     moveOnMouseMove: false, //鼠标移动能触发数据窗口平移
        //     // minValueSpan: 5,  // 放大到最少几个
        //     // maxValueSpan: 5,  //  缩小到最多几个
        //   },
        //   {
        //     type: "inside", // 支持内部鼠标滚动平移
        //     start: 0,
        //     // end: 20,
        //     startValue: 0, // 从头开始。
        //     endValue: 7, // 最多5个
        //     zoomOnMouseWheel: false, // 关闭滚轮缩放
        //     moveOnMouseWheel: true, // 开启滚轮平移
        //     moveOnMouseMove: true, // 鼠标移动能触发数据窗口平移
        //   },
        // ],
        // series: [
        //   {
        //     type: "bar",
        //     name: "非税收入", //顶部的注释说明
        //     data: this.graphData2.data,
        //     barWidth: 22, //柱子的宽度
        //     barGap: 800,
        //     itemStyle: {
        //       color: this.lineColor[0],
        //       // color: new _that.$echarts.graphic.LinearGradient(1, 0, 0, 0, [
        //       //   { offset: 0, color: "#298DFF" }, // 起始颜色
        //       //   { offset: 0.3542, color: "#9CCAFF" }, // 中间过渡颜色
        //       //   { offset: 1, color: "#298DFF" }, // 结束颜色
        //       // ]),
        //     }, //柱子的颜色
        //     label: {
        //       show: true,
        //       position: "top",
        //     },
        //   },
        // ],
      };

      this.myChart2.setOption(option2, true);
      this.myChart2.on("click", (params) => {
        console.log("点击图事件", params);
      });
      //图表背景色
      // handleAddEchartsBackground(this.myChart2, option2, this.graphData2.xAxis);
    },

    //获取金额时Top8主管单位
    async getNoTaxChartThreeMoneyTop8() {
      const json = {
        year: this.blockChoosedYear,
        unitIndustry: this.choosedBlockName,
        typeNameOne: this.typeLevel ? this.typeLevel : null,
        typeNameTwo: this.typeName ? this.typeName : null,
      };
      const res = await getNoTaxChartThreeMoneyTop8(json);
      console.log("按钮为金额时趋势图获取Top8主管单位res", res);
      if (res.message === "成功") {
        console.log(
          "message成功页面按钮为金额时趋势图获取Top8主管单位",
          res.data
        );
        this.choosedManageUnit = res.data;
        this.choosedManageUnitCopy = this.choosedManageUnit;
        this.top8ManageUnit = res.data; //记录当前top8的主管单位
      } else {
        this.$message.error(res.message);
      }
    },

    //获取项目数量时Top8主管单位
    async getNoTaxChartThreeProjectTop8() {
      const json = {
        year: this.blockChoosedYear,
        unitIndustry: this.choosedBlockName,
        typeNameOne: this.typeLevel ? this.typeLevel : null,
        typeNameTwo: this.typeName ? this.typeName : null,
      };
      const res = await getNoTaxChartThreeProjectTop8(json);
      console.log("页面内按钮为项目时趋势图获取Top8主管单位res", res);
      if (res.message === "成功") {
        console.log(
          "message成功页面按钮为项目时趋势图获取Top8主管单位",
          res.data
        );
        this.choosedManageUnit = res.data;
        this.choosedManageUnitCopy = this.choosedManageUnit;
        this.top8ManageUnit = res.data; //记录当前top8的主管单位
      } else {
        this.$message.error(res.message);
      }
    },

    //历年趋势图折线图点击重置
    initGraph3() {
      this.orderType = "金额";
      this.notaxIncomeType = [];
      this.choosedManageUnit = this.top8ManageUnit;
      this.choosedManageUnitCopy = this.top8ManageUnit;
      this.initEcharts3(); //重置展示板块和top
    },

    //非税收入类型选择框
    async getNoTaxChartThreeType() {
      const json = {
        year: this.blockChoosedYear,
        unitIndustry: this.choosedBlockName,
      };
      const res = await getNoTaxChartThreeType(json);
      if (res.message === "成功") {
        this.typeOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //非税收入类型选择框改变
    handleChange(value) {
      this.typeLevel = value.split("_")[1];
      this.typeName = value.split("_")[0];
      this.initEcharts3(this.typeLevel, this.typeName);
    },

    //排序方式改变
    onChangeOrder() {
      if (this.orderType === "金额") {
        this.getNoTaxChartThreeMoneyTop8();
      } else if (this.orderType === "项目数量") {
        this.getNoTaxChartThreeProjectTop8();
      }
      this.initEcharts3(this.typeLevel, this.typeName);
    },

    // 历年趋势图展示
    async getNoTaxChartThree(level, name) {
      let json;
      if (level == 1) {
        json = {
          year: this.blockChoosedYear,
          unitIndustry: this.choosedBlockName,
          nontaxTypeNameOne: name,
          odName: this.orderType,
          deptNames: this.choosedManageUnit,
        };
      } else if (level == 2) {
        json = {
          year: this.blockChoosedYear,
          unitIndustry: this.choosedBlockName,
          nontaxTypeNameTwo: name,
          odName: this.orderType,
          deptNames: this.choosedManageUnit,
        };
      } else {
        json = {
          year: this.blockChoosedYear,
          unitIndustry: this.choosedBlockName,
          odName: this.orderType,
          deptNames: this.choosedManageUnit,
        };
      }
      const res = await getNoTaxChartThree(json);
      if (res.message === "成功") {
        let obj = {
          legend: null,
          xAxis: null,
          yAxis: null,
          seriesData: null,
        };
        obj.legend = res.data.legend;
        obj.xAxis = res.data.xaxis || res.data.xAxis;
        obj.yAxis = res.data.yaxis || res.data.yAxis;
        obj.seriesData = res.data.seriesData;
        this.graphData3 = obj;
      } else {
        this.$message.error(res.message);
      }
    },
    async initEcharts3(lavel, name) {
      //联动需要先clear
      if (this.myChart3) {
        this.myChart3.dispose();
      }
      this.myChart3 = this.$echarts.init(this.$refs.graph3);
      await this.getNoTaxChartThree(lavel, name);
      const _that = this;

      //整体支出均衡性
      const option3 = {
        tooltip: {
          //trigger: "axis",
          // triggerOn: "click",
          triggerOn: "mousemove", // 设置触发方式为悬停
          // 固定提示框位置
          position: function (point, params, dom, rect, size) {
            // console.log("tooltip参数point", point);
            // console.log("tooltip参数params", params);
            // console.log("tooltip参数dom", dom);
            // console.log("tooltip参数rect", rect);
            // console.log("tooltip参数size", size);
            return [point[0] + 5, point[1] + 5];
          },
          // triggerOn: "mousemove", // 设置触发方式为悬停
          // jump
          // 提供图表穿透功能：用户点击图形上的某一个收入金额后，系统跳转进入【非税收入明细表】，并自动附带筛选条件【主管单位】【非税收入类型】【时间范围】。
          formatter: function (params) {
            if (params.seriesName.length === 0) {
              return ""; // 没有数据时，不显示 tooltip
            }
            const paramsYear = _that.yearRange;
            return `<div class="ratio-tooltip-box" style="pointer-events:auto">
              <a onClick="goManagePortrait('${
                params.seriesName
              }')">主管单位名称：${params.seriesName}</a>
              <div>主管单位代码：${
                _that.graphData3.seriesData[params.seriesIndex].code
              }</div>
              <a onClick="goNoTaxDeatil('${paramsYear[0]}','${
              paramsYear[1]
            }','${
              params.seriesName
            }')" style="cursor: pointer;">非税收入金额：${_that.graphData3.seriesData[
              params.seriesIndex
            ].data[params.dataIndex].toLocaleString()}万元</a>
              <div>
                <a onClick="goNoTaxDeatil('${paramsYear[0]}','${
              paramsYear[1]
            }','${
              params.seriesName
            }')" style="cursor: pointer;">非税收入项目数量：${
              _that.graphData3.seriesData[params.seriesIndex].projectNum[
                params.dataIndex
              ]
            }个</a>
              <div>
              <div>占比：${
                _that.graphData3.seriesData[params.seriesIndex].rate[
                  params.dataIndex
                ]
              }%</div>
            </div>`;
          },
        },
        legend: {
          data: this.graphData3.legend,
        },
        grid: {
          x: 20,
          y: 70,
          x2: 15,
          y2: 10,
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.graphData3.xAxis,
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
          name: this.graphData3.yAxis.name,
          minInterval: 1,
          axisLabel: {
            //去除横纵坐标的起始0
            formatter: function (value) {
              return Math.round(value);
            },
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
      for (let i = 0; i < this.graphData3.seriesData.length; i++) {
        if (this.graphData3.yAxis.name === "金额（万元）") {
          option3.series.push({
            type: "line",
            // stack: "Total",
            label: {
              show: true,
              position: "top",
              // formatter: "{c}万元", // 使用模板字符串添加单位
              formatter: function (params) {
                console.log("paramsparamsparams", params);
                // 获取数据值
                let value = params.data.toLocaleString();
                // 将数字格式化为千分位
                return value + "万元";
              },
            },
            name: this.graphData3.seriesData[i].name,
            data: this.graphData3.seriesData[i].data,
            color: this.lineColor[i],
          });
        } else {
          option3.series.push({
            type: "line",
            // stack: "Total",
            label: {
              show: true,
              position: "top",
              formatter: "{c}个", // 使用模板字符串添加单位
            },
            name: this.graphData3.seriesData[i].name,
            data: this.graphData3.seriesData[i].projectNum,
            color: this.lineColor[i],
          });
        }
      }
      this.myChart3.setOption(option3, true);
      //图表背景色
      // handleAddEchartsBackground(this.myChart3, option3, this.graphData3.xAxis);
      //点击legend实时改变纵坐标
      this.myChart3.on("legendselectchanged", (params) => {
        // console.log("点击legend", params);
        const selectedSeries = params.selected;
        const data = [];

        for (const seriesName in selectedSeries) {
          if (selectedSeries[seriesName]) {
            const series = option3.series.find((s) => s.name === seriesName);
            if (series) {
              data.push(...series.data);
            }
          }
        }
        const _that = this;
        if (data.length > 0) {
          const max = Math.max(...data);
          const min = Math.min(...data);

          _that.myChart3.setOption({
            yAxis: {
              min: function () {
                return Math.max(min - 10, 0); // 确保最小值不会低于0
              },
              max: max + 10, // 可以根据需要调整
              scale: true,
            },
          });
          // handleAddEchartsBackground(
          //   _that.myChart3,
          //   option3,
          //   _that.graphData3.xAxis
          // );
        }
      });
    },

    //控制弹框内部相关文字
    handleChooseBudget(value) {
      this.unitShow = true;
      this.unitTitle = value;
    },

    //主管单位选择弹框
    onCancel() {
      this.unitShow = false;
      this.choosedManageUnit = this.choosedManageUnitCopy;
    },

    onConfirm() {
      this.initEcharts3(this.typeLevel, this.typeName);
      this.choosedManageUnitCopy = this.choosedManageUnit;
      this.onCancel();
    },
  },
};
</script>
<style lang="less">
.no-tax {
  width: 100%;
  background: #ffffff;
  padding: 0 20px 20px 20px;

  //第一行非税收入部分
  .no-tax-data {
    width: 100%;
    height: 126px;
    margin-bottom: 20px;

    &-item {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      grid-template-rows: 126px;
      gap: 20px;

      .no-tax-unit {
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

  // 第二行的非税收入两个图
  &-income {
    margin-top: 20px;
    width: 100%;
    height: 700px;
    display: flex;
    justify-content: space-between;

    &-item {
      //一左一右两个图
      height: 100%;
      width: calc(50% - 10px);
      border: 1px solid #d6dbe3;
      border-radius: 6px;
      padding: 12px 20px 20px 20px;
      background: #fff;

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
        height: 617px;
        display: flex;
        justify-content: center;
        //内部图片
        &-graph {
          width: 95%;
          height: 617px;
        }
      }
    }
  }

  // 第三行的历年趋势图
  .trend-chart {
    margin-top: 20px;
    width: 100%;
    height: 480px;
    border-radius: 6px;
    border: 1px solid #d6dbe3;
    background: #fff;
    padding: 12px 20px 20px 20px;

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

    // 按钮们
    &-buttons {
      margin: 20px 0;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 20px;
      font-size: 14px;
    }

    // 历年趋势图
    .wrapper-content {
      width: 100%;
      height: 343px;
      display: flex;
      justify-content: center;

      &-graph {
        width: 82%;
        height: 343px;
      }
    }
  }
}

// 弹框
.budget-modal {
  &-content {
    &-select {
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
