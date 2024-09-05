<template>
  <div class="asserts-condition">
    <!-- 顶部的八个方块 -->
    <!-- <div class="asserts-condition-data">
      <div class="asserts-condition-data-item">
        <div
          v-for="(item, index) in assertsOverviewData"
          :key="index"
          :class="[
            'asserts-unit',
            {
              'asserts-unit-second':
                item.typeName === '房产资产总额（万元）' ||
                item.typeName === '房产资产面积（m²）',
            },
            {
              'asserts-unit-third':
                item.typeName === '车辆资产总额（万元）' ||
                item.typeName === '车辆资产数量（辆）',
            },
            {
              'asserts-unit-fourth':
                item.typeName === '其他资产总额（万元）' ||
                item.typeName === '人均资产金额（万元）',
            },
          ]"
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
              <icon-svg icon-class="icon-down" color="#1BB46D" v-else />
            </div>
          </div>
          <div class="unit-icon">
            <icon-svg :icon-class="`${item.icon}`"></icon-svg>
          </div>
        </div>
      </div>
    </div> -->
    <!-- 资产概览 -->
    <div class="sub-title">资产概览</div>
    <div class="asserts-condition-data">
      <div class="asserts-condition-data-left">
        <div class="asserts-condition-data-left-title">资产总额（万元）</div>
        <div class="asserts-condition-data-left-content">
          {{ Number(assertsOverviewData.total).toLocaleString() }}
        </div>
        <img
          src="@/assets/images/img/asserts.png"
          alt=""
          class="asserts-condition-data-left-img"
        />
      </div>
      <div class="asserts-condition-data-right">
        <div
          class="asserts-condition-data-right-item"
          v-for="(item, index) in assertsOverviewData.overView"
          :key="index"
        >
          <div
            :class="[
              'asserts-condition-data-right-item-left',
              item.typeName.includes('房产')
                ? 'asserts-condition-data-right-item-house'
                : item.typeName.includes('车辆')
                ? 'asserts-condition-data-right-item-car'
                : item.typeName.includes('土地')
                ? 'asserts-condition-data-right-item-land'
                : 'asserts-condition-data-right-item-others',
            ]"
          >
            <div class="asserts-condition-data-right-item-left-icon">
              <icon-svg :icon-class="`${item.icon}`"></icon-svg>
            </div>
          </div>
          <div class="asserts-condition-data-right-item-right">
            <div class="asserts-condition-data-right-item-right-title">
              {{ Number(item.num).toLocaleString() }}
            </div>
            <div class="asserts-condition-data-right-item-right-content">
              {{ item.typeName }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 资产分布 -->
    <div class="asserts-distribution">
      <!-- 蓝字标题 -->
      <div class="sub-title">资产分布</div>
      <!-- 第一行内容 -->
      <div class="asserts-distribution-wrapper" style="height: 364px">
        <!-- 左边 -->
        <div class="wrapper-box">
          <div class="wrapper-top">
            <div class="wrapper-top-title">当前资产分布（按资产大类）</div>
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
          <div class="wrapper-content">
            <div
              class="wrapper-content-graph"
              ref="graph1"
              style="width: 70%; height: 100%"
            ></div>
          </div>
        </div>
        <!-- 右边 -->
        <div class="wrapper-box-table">
          <a-table
            bordered
            :columns="columns1"
            :data-source="tableData1.dataSource"
            :loading="tableLoading1"
            :pagination="false"
            class="wrapper-table-graph"
            :scroll="{ x: 'max-content', y: 320 }"
          >
            <template slot="zb" slot-scope="text">
              <!-- <div style="cursor: pointer">{{ text }}</div> -->
              <div style="display: flex">
                <a-progress
                  :percent="text"
                  size="small"
                  :show-info="false"
                  style="width: 150px"
                />
                <div style="margin-left: 8px">
                  <span
                    >{{
                      text.toString().includes("--") ? "--" : text * 1
                    }}%</span
                  >
                </div>
              </div>
            </template>
            <template slot="je" slot-scope="text">
              <div style="display: flex; margin-bottom: 8px">
                <a-progress
                  :percent="(text / tableData1.maxMoney) * 100"
                  size="small"
                  :show-info="false"
                  style="width: 150px"
                />
                <div style="margin-left: 8px">
                  <span>{{
                    text.toString().includes("--")
                      ? "--"
                      : Number(text).toLocaleString()
                  }}</span>
                </div>
              </div>
            </template>
          </a-table>
        </div>
      </div>
      <!-- 第二行内容 -->
      <div class="asserts-distribution-wrapper">
        <!-- 左边 -->
        <div class="wrapper-box">
          <div class="wrapper-top">
            <div class="wrapper-top-title">
              当前资产分布（按资产大类与单位）
            </div>
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
          资产大类：<span style="color: #1776ff">{{
            currentFundsType === null ? "全部" : currentFundsType
          }}</span>
          <div class="wrapper-content">
            <div class="wrapper-content-graph" ref="graph2"></div>
          </div>
        </div>
        <!-- 右边 -->
        <div class="wrapper-box">
          <div class="wrapper-top">
            <div class="wrapper-top-title">单位历年趋势</div>
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
          <div class="">
            单位名称：<span style="color: #1776ff">{{ currentUnitName }}</span>
          </div>

          <div class="wrapper-content">
            <div class="wrapper-content-graph" ref="graph3"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- 专项分析 -->
    <div class="asserts-analysis">
      <div class="sub-title">专项分析</div>
      <div class="asserts-analysis-wrapper">
        <!-- 左边 -->
        <div class="wrapper-box">
          <div class="wrapper-top">
            <div class="wrapper-top-title">当前资产排行榜（按主管单位）</div>
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
          <!-- 选择框 -->
          <div class="content-top">
            <div class="top-item-left">
              <!-- <div class="top-item-label">业务板块：</div>

              <a-select
                size="small"
                class="top-item-select"
                v-model="choosedSegment"
                @change="handleSegmentChange"
              >
                <a-select-option
                  v-for="item in segmentOptions"
                  :key="item.label"
                  :title="item.label"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select> -->
            </div>
            <div class="top-item-right">
              <!-- <div class="top-item-label">专项类型：</div>

              <a-select
                size="small"
                class="top-item-select"
                v-model="choosedSpecializedType"
                @change="handleSpecializedTypeChange"
              >
               
                <a-select-option
                  v-for="item in specializedTypeOptions"
                  :key="item.label"
                  :title="item.label"
                  :value="item.label"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select> -->

              <a-popover
                placement="bottom"
                overlayClassName="asserts-condition-popover"
              >
                <template slot="content">
                  <div>
                    <a-checkbox
                      :indeterminate="indeterminate"
                      :checked="checkAll"
                      @change="onCheckAllChange"
                    >
                      全选
                    </a-checkbox>
                  </div>
                  <a-checkbox-group
                    v-model="choosedSpecializedType"
                    :options="specializedTypeOptions"
                    @change="onChange"
                    class="item-checkbox"
                  />
                </template>
                <div style="color: #1776ff; cursor: pointer">专项类型</div>
              </a-popover>
            </div>
          </div>
          <div class="wrapper-content">
            <div class="wrapper-content-graph" ref="graph4"></div>
          </div>
        </div>
        <!-- 中间 -->
        <div class="wrapper-box">
          <div class="wrapper-top">
            <div class="wrapper-top-title">主管单位特定资产分布情况</div>
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
          <div class="content-top">
            <div>
              主管单位：<span style="color: #1776ff">{{
                graph4SelectedSite
              }}</span>
            </div>
          </div>
          <div class="wrapper-content">
            <div class="wrapper-content-graph" ref="graph5"></div>
          </div>
        </div>
        <!-- 右边 -->
        <div class="wrapper-box">
          <div class="wrapper-top">
            <div class="wrapper-top-title">主管单位历年趋势</div>
            <div class="wrapper-top-action">
              <!-- <div class="action-reset" @click="handleReset()">重置</div> -->
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
          <div class="wrapper-split"></div>
          <div class="content-top">
            <div style="display: flex">
              <div style="margin-right: 16px">
                单位名称：<span style="color: #1776ff">{{
                  graph4SelectedSite
                }}</span>
              </div>
              <div>
                专项类型：<span style="color: #1776ff">{{
                  graph5SelectedType === null ? "全部" : graph5SelectedType
                }}</span>
              </div>
            </div>
          </div>
          <div class="wrapper-content">
            <div class="wrapper-content-graph" ref="graph6"></div>
          </div>
        </div>
      </div>
    </div>
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
import {
  getAssertsChartFive,
  getAssertsChartFour,
  // getAssertsChartFourOptions,
  getAssertsChartOne,
  getAssertsChartSix,
  getAssertsChartThree,
  getAssertsChartTwo,
  getAssertsOveview,
  getAssertsTableOne,
} from "@/shared/newApi/block/assert.js";
import { adjustFontSize } from "@/utils/echarts.js";
import { Checkbox, Popover, Progress, Tooltip } from "ant-design-vue";
import { mapState } from "vuex";
const { Group } = Checkbox;
export default {
  name: "AssertsOverview",
  data() {
    return {
      //通用颜色
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

      //第一行资产总览方块的暂时写死的数据
      //概览数据
      assertsOverviewData: {
        // overView: [
        //   {
        //     id: 1,
        //     typeName: "房产资产总额（万元）",
        //     num: 17774,
        //     icon: "house",
        //   },
        //   {
        //     id: 2,
        //     typeName: "车辆资产总额（万元）",
        //     num: 17774,
        //     icon: "car",
        //   },
        //   {
        //     id: 3,
        //     typeName: "土地资产总额（万元）",
        //     num: 17774,
        //     icon: "land",
        //   },
        //   {
        //     id: 4,
        //     typeName: "人均资产金额（万元）",
        //     num: 17774,
        //     icon: "person",
        //   },
        //   {
        //     id: 5,
        //     typeName: "房产资产面积（m²）",
        //     num: 17774,
        //     icon: "house",
        //   },
        //   {
        //     id: 6,
        //     typeName: "车辆资产数量（辆）",
        //     num: 17774,
        //     icon: "car",
        //   },
        //   {
        //     id: 7,
        //     typeName: "土地资产面积（m²）",
        //     num: 17774,
        //     icon: "land",
        //   },
        //   {
        //     id: 8,
        //     typeName: "其他资产总额（万元）",
        //     num: 17774,
        //     icon: "others",
        //   },
        // ],
        // total: 999, //资产总额
      },
      // assertsOverviewData: [
      //   {
      //     id: 1,
      //     typeName: "资产总额（万元）",
      //     num: 12345, //加逗号用的
      //     percentage: "8%",
      //     status: 0, //0:down  1:up
      //     icon: "资产总额",
      //   },
      //   {
      //     id: 2,
      //     typeName: "资产增长（万元）",
      //     num: 17774,
      //     percentage: "8%",
      //     status: 0, //0:down  1:up
      //     icon: "资产增长",
      //   },
      //   {
      //     id: 3,
      //     typeName: "房产资产总额（万元）",
      //     num: 17774,
      //     percentage: "8%",
      //     status: 0, //0:down  1:up
      //     icon: "房产资产总额",
      //   },
      //   {
      //     id: 4,
      //     typeName: "房产资产面积（m²）",
      //     num: 17774,
      //     percentage: "8%",
      //     status: 0, //0:down  1:up
      //     icon: "房产资产面积",
      //   },
      //   {
      //     id: 5,
      //     typeName: "车辆资产总额（万元）",
      //     num: 17774,
      //     percentage: "8%",
      //     status: 0, //0:down  1:up
      //     icon: "车辆资产总额",
      //   },
      //   {
      //     id: 6,
      //     typeName: "车辆资产数量（辆）",
      //     num: 17774,
      //     percentage: "8%",
      //     status: 0, //0:down  1:up
      //     icon: "车辆资产数量",
      //   },
      //   {
      //     id: 7,
      //     typeName: "其他资产总额（万元）",
      //     num: 17774,
      //     percentage: "8%",
      //     status: 0, //0:down  1:up
      //     icon: "其他资产总额",
      //   },
      //   {
      //     id: 8,
      //     typeName: "人均资产金额（万元）",
      //     num: 17774,
      //     percentage: "8%",
      //     status: 0, //0:down  1:up
      //     icon: "人均资产金额",
      //   },
      // ],

      myChart1: null, //资产分布饼图
      currentFundsType: null, //第1张图选中的资产类型  null代表全部
      graphData1: {
        // total: 24000000,
        // seriesData: [
        //   { value: 1048, name: "车辆", rate: "13" },
        //   { value: 735, name: "房产", rate: "13" },
        //   { value: 580, name: "土地", rate: "13" },
        //   { value: 280, name: "其他", rate: "13" },
        // ],
      },

      //表1
      columns1: [
        {
          title: "资产大类",
          dataIndex: "zcdl",
          key: "zcdl",
          align: "center",
          width: 140,
        },
        {
          title: "占比（%）",
          dataIndex: "zb",
          key: "zb",
          align: "center",
          width: 250,
          scopedSlots: { customRender: "zb" },
        },
        {
          title: "金额（万元）",
          dataIndex: "je",
          key: "je",
          align: "center",
          width: 316,
          scopedSlots: { customRender: "je" },
        },
      ],
      tableLoading1: false,
      tableData1: {
        // dataSource: [
        //   {
        //     zcdl: "类别1", //资产大类
        //     zb: 100, //占比
        //     je: 70000.789, //金额
        //   },
        //   {
        //     zcdl: "类别2", //资产大类
        //     zb: 40, //占比
        //     je: 70, //金额
        //   },
        //   {
        //     zcdl: "类别3", //资产大类
        //     zb: 35, //占比
        //     je: 120, //金额
        //   },
        //   {
        //     zcdl: "类别4", //资产大类
        //     zb: 35, //占比
        //     je: 300, //金额
        //   },
        //   {
        //     zcdl: "类别1", //资产大类
        //     zb: 35, //占比
        //     je: 70, //金额
        //   },
        //   {
        //     zcdl: "类别1", //资产大类
        //     zb: 35, //占比
        //     je: 70, //金额
        //   },
        //   {
        //     zcdl: "类别1", //资产大类
        //     zb: 35, //占比
        //     je: 70, //金额
        //   },
        //   {
        //     zcdl: "类别1", //资产大类
        //     zb: 35, //占比
        //     je: 70, //金额
        //   },
        //   {
        //     zcdl: "类别1", //资产大类
        //     zb: 35, //占比
        //     je: 70, //金额
        //   },
        //   {
        //     zcdl: "类别1", //资产大类
        //     zb: 35, //占比
        //     je: 70, //金额
        //   },
        //   {
        //     zcdl: "类别1", //资产大类
        //     zb: 35, //占比
        //     je: 70, //金额
        //   },
        //   {
        //     zcdl: "类别1", //资产大类
        //     zb: 35, //占比
        //     je: 70, //金额
        //   },
        // ],
        // maxMoney: 300, //dataSource1中金额的最大值
      },

      myChart2: null, //矩形树图
      currentUnitName: "全部",
      currentUnitCode: null, //选中单位code
      graphData2: {
        // seriesData: [
        //   //数据
        //   {
        //     name: "星环", //单位名称
        //     code: "111",
        //     value: 45, //单位资产金额
        //     wholeCity: 50, //板块资产金额
        //     rate: 40, //图上显示的百分比
        //     type: "manage", //主管还是预算
        //     from: "房产", //资产大类
        //     children: [
        //       //数据集
        //       {
        //         name: "星环小组", //单位名称
        //         code: "111",
        //         value: 15, //单位资产金额
        //         wholeCity: 50, //板块资产金额
        //         rate: 15, //图上显示的百分比
        //         type: "budget", //主管还是预算
        //         from: "房产", //资产大类
        //       },
        //       {
        //         name: "星环小组", //单位名称
        //         code: "111",
        //         value: 15, //单位资产金额
        //         wholeCity: 50, //板块资产金额
        //         rate: 15, //图上显示的百分比
        //         type: "budget", //主管还是预算
        //         from: "房产", //资产大类
        //       },
        //       {
        //         name: "星环小组", //单位名称
        //         code: "111",
        //         value: 15, //单位资产金额
        //         wholeCity: 50, //板块资产金额
        //         rate: 15, //图上显示的百分比
        //         type: "budget", //主管还是预算
        //         from: "房产", //资产大类
        //       },
        //     ],
        //   },
        //   {
        //     name: "携程", //单位名称
        //     code: "111",
        //     value: 24, //单位资产金额
        //     wholeCity: 50, //板块资产金额
        //     rate: 40, //图上显示的百分比
        //     type: "manage", //主管还是预算
        //     from: "土地", //资产大类
        //     children: [
        //       //数据集
        //       {
        //         name: "携程小组", //单位名称
        //         code: "111",
        //         value: 8, //单位资产金额
        //         wholeCity: 50, //板块资产金额
        //         rate: 15, //图上显示的百分比
        //         type: "budget", //主管还是预算
        //         from: "土地", //资产大类
        //       },
        //       {
        //         name: "携程小组", //单位名称
        //         code: "111",
        //         value: 8, //单位资产金额
        //         wholeCity: 50, //板块资产金额
        //         rate: 15, //图上显示的百分比
        //         type: "budget", //主管还是预算
        //         from: "土地", //资产大类
        //       },
        //       {
        //         name: "携程小组", //单位名称
        //         code: "111",
        //         value: 8, //单位资产金额
        //         wholeCity: 50, //板块资产金额
        //         rate: 15, //图上显示的百分比
        //         type: "budget", //主管还是预算
        //         from: "土地", //资产大类
        //       },
        //     ],
        //   },
        //   {
        //     name: "阿里巴巴", //单位名称
        //     code: "111",
        //     value: 21, //单位资产金额
        //     wholeCity: 50, //板块资产金额
        //     rate: 40, //图上显示的百分比
        //     type: "manage", //主管还是预算
        //     from: "车辆", //资产大类
        //     children: [
        //       //数据集
        //       {
        //         name: "阿里巴巴小组", //单位名称
        //         code: "111",
        //         value: 15, //单位资产金额
        //         wholeCity: 50, //板块资产金额
        //         rate: 15, //图上显示的百分比
        //         type: "budget", //主管还是预算
        //         from: "车辆", //资产大类
        //       },
        //       {
        //         name: "阿里巴巴小组", //单位名称
        //         code: "111",
        //         value: 15, //单位资产金额
        //         wholeCity: 50, //板块资产金额
        //         rate: 15, //图上显示的百分比
        //         type: "budget", //主管还是预算
        //         from: "车辆", //资产大类
        //       },
        //       {
        //         name: "阿里巴巴小组", //单位名称
        //         code: "111",
        //         value: 15, //单位资产金额
        //         wholeCity: 50, //板块资产金额
        //         rate: 15, //图上显示的百分比
        //         type: "budget", //主管还是预算
        //         from: "车辆", //资产大类
        //       },
        //     ],
        //   },
        //   {
        //     name: "美团", //单位名称
        //     code: "111",
        //     value: 40, //单位资产金额
        //     wholeCity: 50, //板块资产金额
        //     rate: 40, //图上显示的百分比
        //     type: "manage", //主管还是预算
        //     from: "其他", //资产大类
        //     children: [
        //       //数据集
        //       {
        //         name: "美团小组", //单位名称
        //         code: "111",
        //         value: 15, //单位资产金额
        //         wholeCity: 50, //板块资产金额
        //         rate: 15, //图上显示的百分比
        //         type: "budget", //主管还是预算
        //         from: "其他", //资产大类
        //       },
        //       {
        //         name: "美团小组", //单位名称
        //         code: "111",
        //         value: 15, //单位资产金额
        //         wholeCity: 50, //板块资产金额
        //         rate: 15, //图上显示的百分比
        //         type: "budget", //主管还是预算
        //         from: "其他", //资产大类
        //       },
        //       {
        //         name: "美团小组", //单位名称
        //         code: "111",
        //         value: 15, //单位资产金额
        //         wholeCity: 50, //板块资产金额
        //         rate: 15, //图上显示的百分比
        //         type: "budget", //主管还是预算
        //         from: "其他", //资产大类
        //       },
        //     ],
        //   },
        // ],
      },

      myChart3: null, //主管单位年趋势图
      graphData3: {
        // legend: ["资产新增", "资产处置"],
        // xAxis: ["2019", "2020", "2021", "2022", "2023"],
        // yAxis: {
        //   name: "资金金额（万元）",
        // },
        // seriesData: [
        //   {
        //     name: "资产新增",
        //     // data: [132, 101, 134, 23, 347],
        //     data: [
        //       {
        //         name: "星环", //单位名称
        //         moneyType: "房屋", //资产大类
        //         value: 143, //金额
        //       },
        //       {
        //         name: "星环", //单位名称
        //         moneyType: "房屋", //资产大类
        //         value: 154, //金额
        //       },
        //       {
        //         name: "星环", //单位名称
        //         moneyType: "房屋", //资产大类
        //         value: 176, //金额
        //       },
        //       {
        //         name: "星环", //单位名称
        //         moneyType: "房屋", //资产大类
        //         value: 135, //金额
        //       },
        //       {
        //         name: "星环", //单位名称
        //         moneyType: "房屋", //资产大类
        //         value: 112, //金额
        //       },
        //     ],
        //   },
        //   {
        //     name: "资产处置",
        //     // data: [22, 182, 234, 31, 345],
        //     data: [
        //       {
        //         name: "星环", //单位名称
        //         moneyType: "房屋", //资产大类
        //         value: 12, //金额
        //       },
        //       {
        //         name: "星环", //单位名称
        //         moneyType: "房屋", //资产大类
        //         value: 12, //金额
        //       },
        //       {
        //         name: "星环", //单位名称
        //         moneyType: "房屋", //资产大类
        //         value: 12, //金额
        //       },
        //       {
        //         name: "星环", //单位名称
        //         moneyType: "房屋", //资产大类
        //         value: 2, //金额
        //       },
        //       {
        //         name: "星环", //单位名称
        //         moneyType: "房屋", //资产大类
        //         value: 22, //金额
        //       },
        //     ],
        //   },
        // ],
      },

      //图4业务板块下拉框选项
      // choosedSegment: null,
      // segmentOptions: [
      //   // {
      //   //   label: "全部",
      //   //   value: null,
      //   // },
      //   // {
      //   //   label: "xx",
      //   //   value: "xx",
      //   // },
      //   // {
      //   //   label: "xxx",
      //   //   value: "xxx",
      //   // },
      //   // {
      //   //   label: "zzz",
      //   //   value: "zzz",
      //   // },
      // ],
      //图4专项类型下拉框选项
      choosedSpecializedType: ["房产", "车辆", "土地", "其他"],
      indeterminate: false,
      checkAll: true,
      specializedTypeOptions: [
        {
          label: "房产",
          value: "房产",
        },
        {
          label: "车辆",
          value: "车辆",
        },
        {
          label: "土地",
          value: "土地",
        },
        {
          label: "其他",
          value: "其他",
        },
      ],

      //点击选中的柱子
      graph4SelectedSite: null, //单位名称
      graph4SelectedSiteCode: null, //单位代码
      myChart4: null, //横向柱状图
      graphData4: {
        // yAxis: [
        //   "主管单位一",
        //   "主管单位二",
        //   "主管单位三",
        //   "主管单位四",
        //   "主管单位五",
        //   "主管单位六",
        //   "主管单位七",
        //   "主管单位八",
        //   "主管单位九",
        //   "主管单位十",
        //   "主管单位十一",
        //   "主管单位十二",
        //   "主管单位十三",
        //   "主管单位十四",
        //   "主管单位十五",
        // ],
        // seriesData: [
        //   {
        //     per: 10,
        //     value: 9,
        //     code: 1,
        //   },
        //   {
        //     per: 10,
        //     value: 12,
        //     code: 2,
        //   },
        //   {
        //     per: 10,
        //     value: 34,
        //     code: 3,
        //   },
        //   {
        //     per: 10,
        //     value: 56,
        //     code: 4,
        //   },
        //   {
        //     per: 10,
        //     value: 76,
        //     code: 5,
        //   },
        //   {
        //     per: 10,
        //     value: 82,
        //     code: 5,
        //   },
        //   {
        //     per: 10,
        //     value: 89,
        //     code: 5,
        //   },
        //   {
        //     per: 10,
        //     value: 99,
        //     code: 5,
        //   },
        //   {
        //     per: 10,
        //     value: 101,
        //     code: 5,
        //   },
        //   {
        //     per: 10,
        //     value: 110,
        //     code: 5,
        //   },
        //   {
        //     per: 10,
        //     value: 120,
        //     code: 5,
        //   },
        //   {
        //     per: 10,
        //     value: 140,
        //     code: 5,
        //   },
        //   {
        //     per: 10,
        //     value: 150,
        //     code: 5,
        //   },
        //   {
        //     per: 10,
        //     value: 160,
        //     code: 5,
        //   },
        //   {
        //     per: 10,
        //     value: 170,
        //     code: 95,
        //   },
        // ],
        // averageValue: 100,
      },

      myChart5: null, //特定资产分布饼图
      graph5SelectedType: null, //选中的资产类型
      graphData5: {
        // total: 24300,
        // seriesData: [
        //   { value: 1048, type: "房产", rate: 13 },
        //   { value: 735, type: "土地", rate: 12 },
        //   { value: 650, type: "车辆", rate: 13 },
        //   { value: 750, type: "其他", rate: 14 },
        // ],
      },

      myChart6: null, //主管单位历年趋势折线图
      graphData6: {
        // legend: ["资产新增", "资产处置"],
        // xAxis: ["2020", "2021", "2022", "2023", "2024"],
        // yAxis: {
        //   name: "资产金额（万元）",
        // },
        // seriesData: [
        //   {
        //     name: "资产新增",
        //     count: 1,
        //     rate: [1, 2, 3, 4, 5],
        //     data: [13.2, 10.1, 13.4, 23, 34.7],
        //   },
        //   {
        //     name: "资产处置",
        //     count: 2,
        //     rate: [11, 22, 33, 44, 55],
        //     data: [22, 18.2, 23.4, 31, 34.5],
        //   },
        // ],
      },
    };
  },
  computed: {
    // ...mapState("auditOptions", ["paramsObj"]),
    ...mapState("blockAnalysis", [
      "choosedBlockName",
      "choosedBlockId",
      "blockChoosedYear",
    ]),
  },
  watch: {
    choosedBlockId: {
      async handler(newVal, oldVal) {
        console.log("5656555", newVal, oldVal);
        this.currentFundsType = null;
        this.currentUnitName = "全部";
        this.currentUnitCode = null;
        this.graph5SelectedType = null;
        await this.getAllData();
      },
    },
    blockChoosedYear: {
      async handler(newVal, oldVal) {
        console.log("5656555", newVal, oldVal);
        this.currentFundsType = null;
        this.currentUnitName = "全部";
        this.currentUnitCode = null;
        this.graph5SelectedType = null;
        await this.getAllData();
      },
    },
    //图4专项类型变化
    choosedSpecializedType: {
      async handler() {
        this.graph5SelectedType = null;
        this.initEcharts4();
        this.initEcharts5();
        this.initEcharts6();
      },
      deep: true,
    },
  },
  components: {
    ATooltip: Tooltip,
    AProgress: Progress,
    APopover: Popover,
    ACheckboxGroup: Group,
    ACheckbox: Checkbox,
  },
  mounted() {
    this.getAllData();
  },
  beforeDestroy() {
    this.myChart1.dispose();
    this.myChart2.dispose();
    this.myChart3.dispose();
    this.myChart4.dispose();
    this.myChart5.dispose();
    this.myChart6.dispose();
    const f = () => {
      this.myChart1.resize();
      this.myChart2.resize();
      this.myChart3.resize();
      this.myChart4.resize();
      this.myChart5.resize();
      this.myChart6.resize();
    };
    window.removeEventListener("resize", f);
  },
  methods: {
    async getAllData() {
      this.getAssertsOveview(); //查询资产总览概况数据
      // this.getAssertsChartFourOptions(); //当前资产排行榜（按主管单位）  业务板块下拉框
      this.getAssertsTableOne(); //当前资产分布（按资产大类）表格
      this.initAllCharts();
    },

    //统一启动图
    initAllCharts() {
      this.initEcharts1();
      this.initEcharts2();
      this.initEcharts3();
      this.initEcharts4();
      const f = () => {
        this.myChart1.resize();
        this.myChart2.resize();
        this.myChart3.resize();
        this.myChart4.resize();
        this.myChart5.resize();
        this.myChart6.resize();
      };
      window.addEventListener("resize", f);
    },

    //查询资产总览概况数据
    async getAssertsOveview() {
      const json = {
        blockNames: this.choosedBlockName,
      };
      const res = await getAssertsOveview(json);
      if (res.message === "成功") {
        console.log("message成功 查询资产总览概况数据", res.data);
        this.assertsOverviewData = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //当前资产排行榜（按主管单位）  业务板块下拉框
    // async getAssertsChartFourOptions() {
    //   const json = {
    //     year: this.blockChoosedYear, //年份
    //     financeAreaCode: "310000", //行政区划代码,目前写死为'310000'
    //   };
    //   const res = await getAssertsChartFourOptions(json);
    //   if (res.message === "成功") {
    //     console.log(
    //       "message成功 当前资产排行榜（按主管单位）  业务板块下拉框",
    //       res.data
    //     );
    //     this.segmentOptions = res.data;
    //     this.segmentOptions.unshift({
    //       label: "全部",
    //       value: null,
    //     });
    //   } else {
    //     this.$message.error(res.message);
    //   }
    // },

    //当前资产分布（按资产大类）
    async getAssertsTableOne() {
      const json = {
        blockNames: this.choosedBlockName,
      };
      this.tableLoading1 = true;
      const res = await getAssertsTableOne(json);
      this.tableLoading1 = false;
      if (res.message === "成功") {
        console.log("message成功 当前资产分布（按资产大类）表格", res.data);
        this.tableData1 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //图5业务板块变化
    handleSegmentChange() {
      this.graph5SelectedType = null;
      this.initEcharts4();
      this.initEcharts5();
      this.initEcharts6();
    },

    //专项分析
    onChange(checkedList) {
      this.indeterminate =
        !!checkedList.length &&
        checkedList.length < this.specializedTypeOptions.length;
      this.checkAll = checkedList.length === this.specializedTypeOptions.length;
    },
    onCheckAllChange(e) {
      Object.assign(this, {
        choosedSpecializedType: e.target.checked
          ? this.specializedTypeOptions.map((item) => item.value)
          : [],
        indeterminate: false,
        checkAll: e.target.checked,
      });
    },

    //图一，资金大类资产分布饼图
    async getAssertsChartOne() {
      const json = {
        blockNames: this.choosedBlockName,
      };
      const res = await getAssertsChartOne(json);
      if (res.message === "成功") {
        console.log("message成功 图一，资金大类资产分布饼图", res.data);
        this.graphData1 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    async initEcharts1() {
      if (this.myChart1) {
        this.myChart1.dispose();
      }
      this.myChart1 = this.$echarts.init(this.$refs.graph1);
      await this.getAssertsChartOne();
      const _that = this;
      //环形图中心总额文字长度自适应
      let maxWidth = 90; // 设置最大宽度
      let initialFontSize = 24; // 初始字体大小
      let adjustedFontSize = adjustFontSize(
        Number(this.graphData1.total).toLocaleString(),
        maxWidth,
        initialFontSize
      );
      const option1 = {
        // legend: {
        //   type: "scroll",
        //   orient: "horizontal",
        //   //top: -10,
        //   // bottom: 60,
        //   //data: this.legendData,
        // },

        tooltip: {
          enterable: true,
          trigger: "item",
          triggerOn: "mousemove",
          //弹框固定位置
          position: function (point) {
            return [point[0] + 5, point[1] + 5];
          },

          //triggerOn: "click", // 设置触发方式为点击
          //jump
          // 提供图表穿透功能：用户点击图形上的某一分类后，系统跳转进入【资产卡片明细表】，并自动附带筛选条件【主管单位】【资产类型】【时间范围】。
          formatter: (params) => {
            if (params.seriesName.length === 0) {
              return ""; // 没有数据时，不显示 tooltip
            }

            console.log(params, "图1params");
            const year = _that.blockChoosedYear;
            const name = params.data.name;
            const value = Number(params.data.value).toLocaleString();
            const rate = params.data.rate;
            //支出金额带超链接，点击后进入支出明细页面。
            return `<div class="ratio-tooltip-box">
              <div>资产大类：${name}</div>
              <div>年份：${year}年</div>
              <div>
               资产金额：${value}万元
              </div>
              <div>
                占比：${rate}%
              </div>
            </div>`;
          },
        },
        series: [
          {
            type: "pie",
            radius: ["40%", "70%"],
            center: ["50%", "50%"],
            // roseType: "radius", //控制每个圆环粗细是否一致
            // 避免数据过小 不展示
            // minAngle: 1,
            data: this.graphData1.seriesData,
            color: [
              this.lineColor[0],
              this.lineColor[1],
              this.lineColor[2],
              this.lineColor[3],
              this.lineColor[4],
              this.lineColor[5],
              this.lineColor[6],
              this.lineColor[7],
              this.lineColor[8],
              this.lineColor[9],
              this.lineColor[10],
            ],
            // label: {
            //   position: "outer",
            //   alignTo: "edge",
            //   margin: 24,
            //   formatter: (params) => {
            //     const name = params.data.name;
            //     const value = params.data.value;
            //     const rate = params.data.rate;
            //     return name + "\n" + value + "万元\n" + rate + "% ";
            //   },
            // },
            label: {
              position: "outer",
              alignTo: "edge",
              margin: 24,
              formatter: (params) => {
                const name = params.data.name;
                const value = params.data.value;
                const rate = params.data.rate;
                return `{name|${name}}\n{value|${value}万元}\n{rate|${rate}%}`;
              },
              rich: {
                name: {
                  padding: [0, 0, 4, 0], // 上右下左的间距
                },
                value: {
                  padding: [0, 0, 4, 0], // 上右下左的间距
                },
                rate: {
                  padding: [0, 0, 0, 0], // 上右下左的间距
                },
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
            // emphasis: {
            //   // focus: "none", //取消鼠标移入高亮
            //   focus: "self", // 点击扇形自身高亮
            // },
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
          },
        ],
        graphic: [
          {
            //环形图中间添加文字
            type: "text",
            left: "center",
            top: 120, //通过不同top值可以设置上下显示
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

      this.myChart1.setOption(option1);
      this.myChart1.on("click", (params) => {
        console.log("点击图1，图2联动", params);
        //更新子图
        //第一次选中，第二次重新选中的时候，将当前类型置为null
        if (params.name === this.currentFundsType) {
          // 选的同一级，同一块，也就是重置
          this.currentFundsType = null;
          this.currentUnitName = "全部";
          this.currentUnitCode = null;
          //新要求，，点击圆环不跳转，点击label跳转
          // if (params.event.target.style.text) {
          //   const paramsYear = _that.yearRange;
          //   this.goPayDetail(paramsYear[0], paramsYear[1]);
          // } else {
          this.initEcharts2();
          this.initEcharts3();
          // this.getSpendTable("second"); //表格数据变化
          // }
        } else {
          this.currentFundsType = params.name;
          this.currentUnitName = "全部";
          this.currentUnitCode = null;
          //新要求，，点击圆环不跳转，点击label跳转
          // if (params.event.target.style.text) {
          //   const paramsYear = _that.yearRange;
          //   this.goPayDetail(paramsYear[0], paramsYear[1]);
          // } else {
          this.initEcharts2();
          this.initEcharts3();
          // this.getSpendTable("second"); //表格数据变化
          // }
        }
      });
    },

    //图二，矩形树图
    async getAssertsChartTwo() {
      const json = {
        blockNames: this.choosedBlockName,
        assetType: this.currentFundsType, //资产大类
      };
      const res = await getAssertsChartTwo(json);
      if (res.message === "成功") {
        console.log("message成功 图二，矩形树图", res.data);
        this.graphData2 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    async initEcharts2() {
      if (this.myChart2) {
        this.myChart2.dispose();
      }

      this.myChart2 = this.$echarts.init(this.$refs.graph2);
      await this.getAssertsChartTwo();
      const _that = this;
      //整体支出均衡性
      const option2 = {
        tooltip: {
          enterable: true, // 鼠标能追得上tooltip
          //trigger: "axis",
          triggerOn: "mousemove",
          // triggerOn: "click", // 设置触发方式为点击
          formatter: function (params) {
            if (params.seriesName.length === 0) {
              return ""; // 没有数据时，不显示 tooltip
            }
            // if (params.data.type === "manage") {
            //   return `<div class="ratio-tooltip-box" style="pointer-events:auto">
            //   <div>年份：${params.data.year}年</div>
            //   <div>类型：${params.data.from}</div>
            //   <div>金额：${params.data.value}万元</div>
            //   <div>数量：${params.data.count}（㎡或辆）</div>
            //   <div>占比：${params.data.per}</div>
            // </div>`;
            // } else if (params.data.type === "budget") {
            return `<div class="ratio-tooltip-box" style="pointer-events:auto">
              <div>单位名称：${params.data.name}</div>
              <div>年份：${_that.blockChoosedYear}年</div>
              <div>资产大类：${params.data.from}</div>
              <div>单位资产金额：${Number(
                params.data.value
              ).toLocaleString()}万元</div>
              <div>板块资产金额：${Number(
                params.data.wholeCity
              ).toLocaleString()}万元</div>
              <div>占比：${params.data.rate}%</div>
            </div>`;
            // }
          },
        },
        //工具栏
        // toolbox: {
        //   show: true,
        //   x: "center",
        //   feature: {
        //     // dataView: dataMapDataView(fileName),
        //     restore: { show: true },
        //     saveAsImage: { show: true },
        //   },
        // },

        grid: {
          x: 15,
          y: 70,
          x2: 15,
          y2: 10,
          containLabel: true,
        },

        series: [
          {
            name: "全部",
            type: "treemap", //图例样式，矩形树
            width: "100%",
            height: "86%",
            leafDepth: 1, //控制一层最多显示多深
            roam: false, //false是否开启拖拽漫游（移动和缩放）。
            // breadcrumb: {
            //   show: false, //是否展示下方黑色导航栏
            // },

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
              // 第三个层级的配置
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
            // nodeClick: "none", //不移动
            label: {
              // position: "outer",
              // alignTo: "edge",
              // margin: 24,
              formatter: (params) => {
                const name = params.data.name;
                const rate = params.data.rate;
                return `{name|${name}}\n\n{rate|${rate}%}`;
              },
              rich: {
                name: {
                  padding: [0, 0, 4, 0], // 上右下左的间距
                },
                rate: {
                  padding: [0, 0, 0, 0], // 上右下左的间距
                },
              },
            },
            // label: {
            //   formatter: function (params) {
            //     return params.data.name + "\n\n" + params.data.rate + "%";
            //   },
            // },

            data: this.graphData2.seriesData,
          },
        ],
      };

      this.myChart2.setOption(option2, true);
      this.myChart2.on("click", (params) => {
        console.log(params, "图3子图联动");
        if (
          params.treePathInfo[params.treePathInfo.length - 1].name ===
          this.currentUnitName
        ) {
          this.currentUnitName = "全部";
          this.currentUnitCode = null;
          this.initEcharts3();
        } else {
          this.currentUnitName =
            params.treePathInfo[params.treePathInfo.length - 1].name;
          this.currentUnitCode = params.data.code;
          this.initEcharts3();
        }
      });
    },

    // 图三，单位历年趋势
    async getAssertsChartThree() {
      const json = {
        blockNames: this.choosedBlockName,
        year: this.blockChoosedYear, //年份
        code: this.currentUnitCode, // 主管单位编码或预算单位编码,在联动时如果没有选中矩形树图,则置空
        class: this.currentFundsType, //资产大类,在联动时,如果没有选中饼状图,则置空
      };
      const res = await getAssertsChartThree(json);
      if (res.message === "成功") {
        console.log("message成功 图三，单位历年趋势", res.data);
        this.graphData3 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    async initEcharts3() {
      //联动需要先clear
      if (this.myChart3) {
        this.myChart3.dispose();
      }
      this.myChart3 = this.$echarts.init(this.$refs.graph3);
      await this.getAssertsChartThree();
      const _that = this;
      const option3 = {
        tooltip: {
          enterable: true,
          trigger: "item",
          borderWidth: 0,
          // triggerOn: "click",
          triggerOn: "mousemove", // 设置触发方式为悬停

          formatter: function (params) {
            console.log(params);
            if (params.seriesName.length === 0) {
              return ""; // 没有数据时，不显示 tooltip
            }
            return `<div class="ratio-tooltip-box" style="pointer-events:auto">
              <div>单位名称：${params.data.name}</div>
              <div>年份：${_that.blockChoosedYear}年</div>
              <div>类型：${params.seriesName}</div>
              <div>资产大类：${params.data.moneyType}</div>
              <div>金额：${Number(params.data.value).toLocaleString()}万元</div>
            </div>`;
          },
        },
        legend: {
          type: "scroll",
          // top: 10,
          data: this.graphData3.legend,
          // data: [],
        },
        grid: {
          x: 55,
          y: 70,
          x2: 55,
          y2: 50,
          // containLabel: true,
          // x: 15,
          // y: 70,
          // x2: 15,
          // y2: 10,
          // containLabel: true,
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
          // {
          //   type: "category",
          //   axisLine: { show: false },
          //   axisTick: { show: false },
          //   axisLabel: { show: false },
          //   splitArea: { show: false },
          //   splitLine: { show: false },
          //   axisPointer: { show: false },
          // },
        ],
        yAxis: {
          type: "value",
          name: this.graphData3.yAxis.name,
          minInterval: 1,
          axisLabel: {
            formatter: "{value}",
            // margin: 15,
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
          min: 0,
          max: "dataMax",
        },
        series: [],
      };
      // 年
      for (let i = 0; i < this.graphData3.seriesData.length; i++) {
        // if (this.graphData3.seriesData[i].name === "板块") {
        //   this.graphData3.seriesData[i].name = this.choosedBlockName.join(",");
        // }
        option3.series.push({
          label: {
            show: true,
            position: "top",
            // formatter: "{c}万元", // 使用模板字符串添加单位
            formatter: (params) => {
              const data = params.value;
              return Number(data).toLocaleString() + "万元";
            },
          },
          type: "line",
          // stack: "Total",
          name: this.graphData3.seriesData[i].name,
          data: this.graphData3.seriesData[i].data,
          color: this.lineColor[i],
        });
      }
      this.myChart3.setOption(option3, true);
      //图表背景色
      // handleAddEchartsBackground(this.myChart3, option3, this.graphData3.xAxis);
      //点击legend实时改变纵坐标

      // this.myChart3.on("legendselectchanged", (params) => {
      //   const selectedSeries = params.selected;
      //   const data = [];

      //   for (const seriesName in selectedSeries) {
      //     if (selectedSeries[seriesName]) {
      //       const series = option3.series.find((s) => s.name === seriesName);
      //       if (series) {
      //         data.push(...series.data);
      //       }
      //     }
      //   }
      //   const _that = this;
      //   if (data.length > 0) {
      //     const max = Math.max(...data);
      //     const min = Math.min(...data);

      //     _that.myChart3.setOption({
      //       yAxis: {
      //         min: min - 10, // 可以根据需要调整
      //         max: max + 10, // 可以根据需要调整
      //       },
      //     });
      //     // handleAddEchartsBackground(
      //     //   _that.myChart3,
      //     //   option3,
      //     //   _that.graphData3.xAxis
      //     // );
      //   }
      // });
    },

    //图4，横向柱状图
    async getAssertsChartFour() {
      const json = {
        year: this.blockChoosedYear, //年份
        blockNameIn: this.choosedBlockName,
        assetTypeIn: this.choosedSpecializedType, //专项类型
      };
      const res = await getAssertsChartFour(json);
      if (res.message === "成功") {
        console.log("message成功 图4，横向柱状图", res.data);
        this.graphData4 = res.data;
      } else {
        this.$message(res.message);
      }
    },
    async initEcharts4() {
      //联动需要先clear
      if (this.myChart4) {
        this.myChart4.dispose();
      }
      this.myChart4 = this.$echarts.init(this.$refs.graph4);
      await this.getAssertsChartFour();
      const _that = this;
      const option4 = {
        grid: {
          x: 15, //左
          y: 40, //上
          x2: 70, //右
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
          data: this.graphData4.yAxis,
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
            data: this.graphData4.seriesData, //假数据
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
                    const data = params.value;
                    return Number(data).toLocaleString() + "万元";
                  },
                },
                // color: function (params) {
                //   if (_that.highNumber || _that.lowNumber) {
                //     if (_that.highNumber && params.value >= _that.highNumber) {
                //       // return _that.lineColor[1]; //红
                //       return "#fc3f61"; //红
                //     } else if (
                //       _that.lowNumber &&
                //       params.value <= _that.lowNumber
                //     ) {
                //       return _that.lineColor[0]; // 蓝
                //     } else {
                //       return _that.lineColor[1]; // 绿色
                //     }
                //   } else {
                //     return _that.lineColor[1]; // 绿色
                //   }
                // }, //蓝色
              },
            },
            markLine: {
              label: {
                show: true,
                position: "end",
                formatter: (params) => {
                  return (
                    "平均值：" + Number(params.value).toLocaleString() + "万元"
                  );
                },
                color: "#FE9E17",
                silent: true,
              },
              lineStyle: {
                color: "#FE9E17",
                width: 2,
                type: "dashed",
              },
              // data: [
              //   {
              //     type: "average",
              //     name: "平均值",
              //   },
              // ],
              data: [{ xAxis: _that.graphData4.averageValue }],
            },
          },
        ],
        dataZoom: [
          {
            // 设置滚动条的隐藏与显示
            show: _that.graphData4.yAxis.length > 9 ? true : false,
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
            startValue: _that.graphData4.yAxis.length - 1,
            // 数据窗口范围的结束数值（一页显示多少条数据，从0开始）
            endValue: _that.graphData4.yAxis.length - 9,
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
            right: 1, //右边的距离  todo
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
        tooltip: {
          //trigger: "axis",
          //triggerOn: "mousemove",
          formatter: function (params) {
            // console.log(params);
            const segment =
              _that.choosedSegment === null ? "全部" : _that.choosedSegment;
            if (params.componentType === "markLine") return;
            return `<div class="ratio-tooltip-box" style="pointer-events:auto">
              <div>主管单位：${params.name}</div>
              <div>年份：${_that.blockChoosedYear}年</div>
              <div>业务板块：${segment}</div>
              <div>专项类型：${_that.choosedSpecializedType}</div>
              <div>资产金额：${Number(params.value).toLocaleString()}万元</div>
              <div>占比：${params.data.per}%</div>
            </div>`;
          },
        },
      };

      this.myChart4.setOption(option4, true);
      this.graph4SelectedSite =
        this.graphData4.yAxis[this.graphData4.yAxis.length - 1];

      //这边如果不加判断 graphData4数据为空会报错
      this.graph4SelectedSiteCode = "--"; //和sql的约定，如果图4没有数据，则将code置为--,确保图5、图6数据
      if (this.graphData4.seriesData && this.graphData4.seriesData.length) {
        //获取选中的主管单位的code
        const index = this.graphData4.yAxis.indexOf(this.graph4SelectedSite);
        this.graph4SelectedSiteCode = this.graphData4.seriesData[index].code;
      }

      this.graph4Selected(this.graph4SelectedSite, option4);
      this.initEcharts5();
      this.initEcharts6();
      this.myChart4.on("click", (params) => {
        // const _that = this;
        this.graph4SelectedSite = params.name;
        //获取选中的主管单位的code
        const index = this.graphData4.yAxis.indexOf(this.graph4SelectedSite);
        this.graph4SelectedSiteCode = this.graphData4.seriesData[index].code;
        const clickDataName = params.name;
        this.graph4Selected(clickDataName, option4);
        //更新子图  主图子图联动
        this.initEcharts5();
        this.initEcharts6();
      });
    },

    // graph4选中效果
    graph4Selected(clickDataName, newOption) {
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
      this.myChart4.setOption(newOption, true);
    },

    //图五，特定资产处置类型下主管单位分布情况饼图
    async getAssertsChartFive() {
      const json = {
        year: this.blockChoosedYear, //年份
        deptCode: this.graph4SelectedSiteCode, //主管单位code
      };
      const res = await getAssertsChartFive(json);
      if (res.message === "成功") {
        console.log(
          "message成功 图五，特定资产处置类型下主管单位分布情况饼图",
          res.data
        );
        this.graphData5 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },
    async initEcharts5() {
      if (this.myChart5) {
        this.myChart5.dispose();
      }
      this.myChart5 = this.$echarts.init(this.$refs.graph5);
      await this.getAssertsChartFive();
      const _that = this;
      //环形图中心总额文字长度自适应
      let maxWidth = 90; // 设置最大宽度
      let initialFontSize = 24; // 初始字体大小
      let adjustedFontSize = adjustFontSize(
        Number(this.graphData5.total).toLocaleString(),
        maxWidth,
        initialFontSize
      );
      const option5 = {
        tooltip: {
          enterable: true,
          trigger: "item",
          triggerOn: "mousemove",
          //triggerOn: "click", // 设置触发方式为点击
          formatter: (params) => {
            // return name + "：" + value + "万元";
            return `<div class="ratio-tooltip-box" style="pointer-events:auto;cursor:pointer;" onClick="getDownUp()">
              <div>主管单位:${_that.graph4SelectedSite}</div>
              <div>年份:${_that.blockChoosedYear}年</div>
              <div>专项类型:${params.data.type}</div>
              <div>资产金额:${Number(
                params.data.value
              ).toLocaleString()}万元</div>
              <div>占比:${params.data.rate}%</div>
            </div>`;
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
            radius: ["40%", "70%"],
            center: ["50%", "50%"],
            // roseType: "radius", //控制每个圆环粗细是否一致
            // 避免数据过小 不展示
            // minAngle: 1,
            data: this.graphData5.seriesData,
            color: [
              this.lineColor[0],
              this.lineColor[1],
              this.lineColor[2],
              this.lineColor[3],
              this.lineColor[4],
              this.lineColor[5],
              this.lineColor[6],
              this.lineColor[7],
              this.lineColor[8],
              this.lineColor[9],
              this.lineColor[10],
            ],
            label: {
              position: "outer",
              alignTo: "edge",
              margin: 24,
              formatter: (params) => {
                const type = params.data.type;
                const value = Number(params.data.value).toLocaleString();
                const rate = params.data.rate;
                return `{type|${type}}\n{value|${value}万元}\n{rate|${rate}%}`;
              },
              rich: {
                type: {
                  padding: [0, 0, 4, 0], // 上右下左的间距
                },
                value: {
                  padding: [0, 0, 4, 0], // 上右下左的间距
                },
                rate: {
                  padding: [0, 0, 0, 0], // 上右下左的间距
                },
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
            // emphasis: {
            //   // focus: "none", //取消鼠标移入高亮
            //   focus: "self", // 点击扇形自身高亮
            // },
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
          },
        ],
        graphic: [
          {
            //环形图中间添加文字
            type: "text", //通过不同top值可以设置上下显示
            left: "center",
            top: 170,
            style: {
              text: this.graphData5.total.toLocaleString(),
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
            top: 200,
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

      this.myChart5.setOption(option5);
      this.myChart5.on("click", (params) => {
        console.log(
          "点击图5，图6联动",
          params,
          "this.graph5SelectedType",
          this.graph5SelectedType
        );
        //更新子图
        //第一次选中，第二次重新选中的时候，将当前类型置为null
        if (params.data.type === this.graph5SelectedType) {
          // 选的同一级，同一块，也就是重置
          this.graph5SelectedType = null;
          //新要求，，点击圆环不跳转，点击label跳转
          // if (params.event.target.style.text) {
          //   const paramsYear = _that.yearRange;
          //   this.goPayDetail(paramsYear[0], paramsYear[1]);
          // } else {
          this.initEcharts6();
          // this.getSpendTable("second"); //表格数据变化
          // }
        } else {
          this.graph5SelectedType = params.data.type;
          //新要求，，点击圆环不跳转，点击label跳转
          // if (params.event.target.style.text) {
          //   const paramsYear = _that.yearRange;
          //   this.goPayDetail(paramsYear[0], paramsYear[1]);
          // } else {
          this.initEcharts6();
          // this.getSpendTable("second"); //表格数据变化
          // }
        }
        // this.initEcharts2();
        // this.initEcharts3();
      });
    },

    // 图六主管单位趋势折线图
    async getAssertsChartSix() {
      const json = {
        year: this.blockChoosedYear, //年份
        deptCode: this.graph4SelectedSiteCode, //主管单位code
        assetType: this.graph5SelectedType,
      };
      const res = await getAssertsChartSix(json);
      if (res.message === "成功") {
        console.log("message成功 图六主管单位趋势折线图", res.data);
        this.graphData6 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },
    async initEcharts6() {
      if (this.myChart6) {
        this.myChart6.dispose();
      }
      this.myChart6 = this.$echarts.init(this.$refs.graph6);
      await this.getAssertsChartSix();
      const _that = this;

      //主管单位历年趋势
      const option6 = {
        tooltip: {
          //trigger: "axis",
          enterable: true,
          trigger: "item",
          borderWidth: 0,
          // triggerOn: "click",
          triggerOn: "mousemove", // 设置触发方式为悬停
          formatter: function (params) {
            console.log("params", params);
            if (params.seriesName.length === 0) {
              return ""; // 没有数据时，不显示 tooltip
            }
            const type =
              _that.graph5SelectedType === null
                ? "全部"
                : _that.graph5SelectedType;
            return `<div class="ratio-tooltip-box" style="pointer-events:auto">
                <div>单位名称：${_that.graph4SelectedSite}</div>
                <div>年份：${params.name}年</div>
                <div>类型：${params.seriesName}</div>
                <div>专项类型：${type}</div>
                <div>金额：${Number(params.data).toLocaleString()}万元</div>
            </div>`;
          },
        },
        legend: {
          type: "scroll",
          data: this.graphData6.legend,
        },
        // grid: {
        //   x: 0,
        //   y: 50,
        //   x2: 0,
        //   y2: 10,
        //   containLabel: true,
        // },
        grid: {
          x: 55,
          y: 70,
          x2: 55,
          y2: 50,
          // containLabel: true,
          // x: 15,
          // y: 70,
          // x2: 15,
          // y2: 10,
          // containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.graphData6.xAxis,
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
          name: this.graphData6.yAxis.name,
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
          min: 0,
          max: "dataMax",
        },
        series: [],
      };

      // 月度
      for (let i = 0; i < this.graphData6.seriesData.length; i++) {
        option6.series.push({
          label: {
            show: true,
            position: "top",
            // formatter: "{c}万元", // 使用模板字符串添加单位
            formatter: (params) => {
              const data = params.value;
              return Number(data).toLocaleString() + "万元";
            },
          },
          type: "line",
          // stack: "Total",
          name: this.graphData6.seriesData[i].name,
          data: this.graphData6.seriesData[i].data,
          color: this.lineColor[i],
        });
      }
      this.myChart6.setOption(option6, true);
      //图表背景色
      // handleAddEchartsBackground(this.myChart6, option6, this.graphData6.xAxis);
    },
  },
};
</script>
<style lang="less">
.asserts-condition {
  width: 100%;
  background: #ffffff;
  padding: 0 20px 20px 20px;

  //顶部八个小方块
  // 概览板块
  &-data {
    display: flex;

    &-left {
      width: 200px;
      height: 196px;
      padding: 20px;
      border-radius: 6px;
      margin-right: 20px;
      background: #bed7ff;
      position: relative;

      &-title {
        font-size: 16px;
        color: #3c485c;
        margin-bottom: 20px;
      }

      &-content {
        font-size: 28px;
        font-weight: 600;
      }

      &-img {
        width: 90px;
        height: 90px;
        position: absolute;
        right: 20px;
      }
    }

    &-right {
      width: calc(100% - 120px);
      height: 196px;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      grid-template-rows: 88px 88px;
      gap: 20px;

      &-item {
        height: 88px;
        width: 100%;

        padding: 16px 20px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        border: 1px solid #d6dbe3;
        background: #fff;

        &-right {
          width: calc(100% - 56px);
          &-title {
            font-size: 24px;
            font-weight: 600;
            display: flex;
            justify-content: flex-end;
          }
          &-content {
            color: #3c485c;
            display: flex;
            justify-content: flex-end;
          }
        }

        &-left {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          margin-right: 16px;
          display: flex;
          align-items: center;
          justify-content: center;

          &-icon {
            width: 26px;
            height: 26px;
          }
        }

        &-house {
          background: #1776ff;
        }

        &-car {
          background: #2fa9e6;
        }

        &-land {
          background: #1bb46d;
        }

        &-others {
          background: #fe9e17;
        }
      }
    }
  }

  //资产结构
  .asserts-distribution {
    width: 100%;
    margin-top: 20px;

    &-wrapper {
      //大框
      width: 100%;
      height: 480px;
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;

      //各个图
      .wrapper-box {
        width: calc(50% - 10px);
        border-radius: 6px;
        border: 1px solid #d6dbe3;
        background: #fff;
        // height: 444px;
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

        //图片本身
        .wrapper-content {
          width: 100%;
          height: calc(100% - 51px);
          display: flex;
          justify-content: center;

          &-top {
            height: 32px;
          }

          &-graph {
            width: 90%;
            height: calc(100% - 32px);
          }
        }
      }

      .wrapper-box-table {
        width: calc(50% - 10px);
        height: 100%;
      }
    }
  }

  //资产处置概况
  .asserts-analysis {
    width: 100%;
    margin-top: 20px;

    //仨图一起的框
    &-wrapper {
      width: 100%;
      display: flex;
      height: 510px;
      justify-content: space-between;

      //各个图
      .wrapper-box {
        width: 32.5%;
        border-radius: 6px;
        border: 1px solid #d6dbe3;
        background: #fff;
        // height: 444px;
        padding: 12px 20px 20px 20px;

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

        .content-top {
          width: 100%;
          height: 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .top-item-left,
          .top-item-right {
            display: flex;
            align-items: center;
            margin-right: 15px;

            .top-item-select {
              width: 150px;
            }
          }
        }

        //图片本身
        .wrapper-content {
          width: 100%;
          height: calc(100% - 83px);
          display: flex;
          justify-content: center;

          &-graph {
            width: 95%;
            height: 100%;
          }
        }
      }
    }
  }
}

.asserts-condition-popover {
  .ant-popover-inner-content {
    width: 100px;
  }
}
</style>
