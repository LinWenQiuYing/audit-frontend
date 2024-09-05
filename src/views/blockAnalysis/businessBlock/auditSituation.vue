<template>
  <div class="audit-situation">
    <!-- 第一行的六个资产情况方块 -->
    <div class="sub-title">资产概览</div>
    <div class="audit-data">
      <div class="audit-data-item">
        <div
          v-for="(item, index) in auditData"
          :key="index"
          :class="[
            'audit-unit',
            {
              'audit-unit-second':
                item.typeName === '当年审计项目数量（个）' ||
                item.typeName === '历史累计审计项目数（个）',
            },
            {
              'audit-unit-third':
                item.typeName === '五年内未审计单位数（家）' ||
                item.typeName === '历史从未审计单位总数（家）',
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
    </div>

    <div class="audit-situation-card">
      <div class="sub-title">资产状况一览表</div>
      <div class="audit-situation-card-right">
        <div class="card-right-item">
          <div class="card-right-item-icon">
            <icon-svg icon-class="已审计"></icon-svg>
          </div>
          <span class="card-right-item-title">已审计</span>
        </div>
        <div class="card-right-item">
          <div class="card-right-item-icon">
            <icon-svg icon-class="待审计"></icon-svg>
          </div>
          <span class="card-right-item-title">待审计</span>
        </div>
      </div>
    </div>
    <div class="audit-situation-card-wrapper">
      <div
        :class="[
          'audit-situation-card-wrapper-item',
          item.isAudit === 1 ? 'audit-situation-card-wrapper-item-audit' : '',
        ]"
        v-for="(item, index) in cardData"
        :key="index"
      >
        <div class="audit-situation-card-wrapper-item-top">
          <div class="audit-situation-card-wrapper-item-top-left">
            {{ item.name }}
          </div>
          <div class="audit-situation-card-wrapper-item-top-right">
            <icon-svg icon-class="audit" v-if="item.isAudit === 1"></icon-svg>
            <icon-svg icon-class="no-audit" v-else></icon-svg>
          </div>
        </div>
        <div class="audit-situation-card-wrapper-item-content">
          <div class="audit-situation-card-wrapper-item-content-label">
            当年：
          </div>
          <div class="audit-situation-card-wrapper-item-content-value">
            {{ item.curNum }}
          </div>
        </div>
        <div class="audit-situation-card-wrapper-item-content">
          <div class="audit-situation-card-wrapper-item-content-label">
            历史累计：
          </div>
          <div class="audit-situation-card-wrapper-item-content-value">
            {{ item.totalNum }}
          </div>
        </div>
      </div>
    </div>

    <!-- 资产分布（按资产类型） -->
    <div class="audit-type">
      <div class="sub-title">审计项目分布</div>
      <div class="audit-type-wrapper">
        <!-- 左边 -->
        <div class="wrapper-box" style="width: calc(35% - 10px)">
          <div class="wrapper-top">
            <div class="wrapper-top-title">
              当年审计项目分布情况（按审计类型）
            </div>
            <div class="wrapper-top-action">
              <!-- <div class="action-reset">重置</div> -->
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
          <!-- 分割线 -->
          <div class="wrapper-split"></div>
          <div class="wrapper-content">
            <div class="wrapper-content-graph" ref="graph1"></div>
          </div>
        </div>
        <!-- 中间 -->
        <div class="wrapper-box" style="width: calc(65% - 10px)">
          <div class="wrapper-top">
            <div class="wrapper-top-title">指定审计类型下单位分布情况</div>
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
            <div class="wrapper-content-title">
              审计类型：<span style="color: #1776ff">{{
                auditType === null ? "全部" : auditType
              }}</span>
            </div>
            <div
              class="wrapper-content-graph"
              ref="graph2"
              style="width: 70%"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 当年审计项目分布 -->
    <div class="audit-situation-distribution">
      <div class="sub-title">当年审计项目分布</div>
      <div class="top-action">
        <a-button class="top-action-btn" @click="sortOne()">
          <div class="top-action-btn-icon">
            <icon-svg icon-class="排序"></icon-svg>
          </div>
          排序
        </a-button>
        <a-button class="top-action-btn" @click="filterOne()">
          <div class="top-action-btn-icon">
            <icon-svg icon-class="筛选"></icon-svg>
          </div>
          筛选
        </a-button>
        <a-popover placement="bottom" overlayClassName="top-action-popover">
          <template slot="content">
            <div
              class="top-action-popover-item"
              v-for="(item, index) in auditTypeLegend"
              :key="index"
            >
              <div
                class="top-action-popover-item-left"
                :style="{ backgroundColor: item.color }"
              ></div>
              <div class="top-action-popover-item-right">{{ item.name }}</div>
            </div>
          </template>
          <a-button class="top-action-btn">
            <div class="top-action-btn-icon">
              <icon-svg icon-class="图例"></icon-svg>
            </div>
            图例
          </a-button>
        </a-popover>

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

    <div class="audit-situation-distribution-content">
      <!-- 左边 -->
      <div class="distribution-content-wrapper-box">
        <div class="wrapper-top">
          <div class="wrapper-top-title">
            当年审计项目分布情况（按主管单位）
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
        <div class="wrapper-split"></div>
        <div class="wrapper-content">
          <div class="wrapper-content-graph" ref="graph3"></div>
        </div>
      </div>
      <a-table
        bordered
        :columns="columns1"
        :data-source="tableData1.dataSource1"
        :loading="tableLoading1"
        :pagination="false"
        class="audit-situation-distribution-content-table"
        :scroll="{ x: 'max-content', y: 360 }"
      >
        <template slot="dnsjxmsl" slot-scope="text, record">
          <div
            style="display: flex; margin-bottom: 8px"
            v-for="(item, index) in text"
            :key="index"
          >
            <a-progress
              :percent="calculatePercent(item.typeNum, record.dnsjxmslMax)"
              size="small"
              :show-info="false"
              style="width: 50px"
              :class="[
                item.typeName == '领导人经济责任'
                  ? 'audit-situation-progress-two'
                  : item.typeName == '审计调查'
                  ? 'audit-situation-progress-three'
                  : item.typeName == '竣工审计'
                  ? 'audit-situation-progress-four'
                  : item.typeName == '其他'
                  ? 'audit-situation-progress-five'
                  : '',
              ]"
            />
            <a-popover placement="rightBottom">
              <template slot="content">
                <div>主管单位：{{ record.zgdw }}</div>
                <div>年份：{{ record.year }}年</div>
                <div>审计类型：{{ item.typeName }}</div>
                <div>
                  审计项目数量：{{
                    item.typeNum.toString().includes("--")
                      ? "--"
                      : Number(item.typeNum).toLocaleString()
                  }}个
                </div>
              </template>

              <div style="margin-left: 8px; cursor: pointer">
                <span>{{ item.typeName }}</span
                >,&nbsp;&nbsp;
                <span
                  >{{
                    item.typeRatio.toString().includes("--")
                      ? "--"
                      : item.typeRatio * 1
                  }}%</span
                >,&nbsp;&nbsp;
                <span
                  >{{
                    item.typeNum.toString().includes("--")
                      ? "--"
                      : Number(item.typeNum).toLocaleString()
                  }}个</span
                >
              </div>
            </a-popover>
          </div>
        </template>
        <template slot="lsljsjxmsl" slot-scope="text, record">
          <div
            style="display: flex; margin-bottom: 8px"
            v-for="(item, index) in text"
            :key="index"
          >
            <a-progress
              :percent="calculatePercent(item.typeNum, record.lsljsjxmslMax)"
              size="small"
              :show-info="false"
              style="width: 50px"
              :class="[
                item.typeName == '领导人经济责任'
                  ? 'audit-situation-progress-two'
                  : item.typeName == '审计调查'
                  ? 'audit-situation-progress-three'
                  : item.typeName == '竣工审计'
                  ? 'audit-situation-progress-four'
                  : item.typeName == '其他'
                  ? 'audit-situation-progress-five'
                  : '',
              ]"
            />
            <a-popover placement="rightBottom">
              <template slot="content">
                <div>主管单位：{{ record.zgdw }}</div>
                <div>年份：{{ record.year }}年</div>
                <div>审计类型：{{ item.typeName }}</div>
                <div>
                  审计项目数量：{{
                    item.typeNum.toString().includes("--")
                      ? "--"
                      : Number(item.typeNum).toLocaleString()
                  }}个
                </div>
              </template>

              <div style="margin-left: 8px; cursor: pointer">
                <span>{{ item.typeName }}</span
                >,&nbsp;&nbsp;
                <span
                  >{{
                    item.typeRatio.toString().includes("--")
                      ? "--"
                      : item.typeRatio * 1
                  }}%</span
                >,&nbsp;&nbsp;
                <span
                  >{{
                    item.typeNum.toString().includes("--")
                      ? "--"
                      : Number(item.typeNum).toLocaleString()
                  }}个</span
                >
              </div>
            </a-popover>
          </div>
        </template>
        <template slot="graphTrend" slot-scope="text, record">
          <div
            style="width: 100%; height: 280px"
            :ref="'chart' + record.id"
          ></div>
        </template>
      </a-table>
    </div>

    <!-- 当年审计项目分布 筛选配 -->
    <FilterModal
      filterTitle="当年审计项目分布筛选配置"
      :filterShow="filterShow1"
      :paramsOption="paramsOption1"
      :tableData="filterTableData1"
      @addTable3="addTable1"
      @delTable3="delTable1"
      @onFilterCancel="onFilterCancel1"
      @onFilterConfirm="onFilterConfirm1"
    ></FilterModal>

    <!-- 当年审计项目分布 排序按钮 -->
    <SortModal
      v-if="sortOptions1.length"
      sortTitle="当年审计项目分布排序配置"
      :sortShow="sortShow1"
      @onSortCancel="onSortCancel1"
      @onSortConfirm="onSortConfirm1"
      :sortOptions="sortOptions1"
      firstSortName=""
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
  getAuditOverviewData,
  getAuditCardData,
  getAuditChartOne,
  getAuditChartTwo,
  getAuditChartThree,
  // getAuditTableChart,
  getAuditSort,
  getAuditFilter,
} from "@/shared/newApi/block/audit.js";
import { getYearStartEnd } from "@/utils/common.js";
// import { handleAddEchartsBackground } from "@/utils/echarts.js";
import { adjustFontSize } from "@/utils/echarts.js";
import { Button, Popover, Progress, Tooltip } from "ant-design-vue";
import { mapState } from "vuex";
export default {
  name: "AuditSituation",
  data() {
    return {
      //引入的颜色
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

      //第一行资产情况方块的暂时写死的数据
      auditData: [
        {
          id: 1,
          typeName: "主管单位数量（家）",
          num: 17774,
          percentage: "8%",
          status: 0, //0:down  1:up
          icon: "主管单位数量",
        },
        {
          id: 2,
          typeName: "当年审计单位数量（家）",
          num: 17774,
          percentage: "8%",
          status: 0, //0:down  1:up
          icon: "当年审计单位数量",
        },
        {
          id: 3,
          typeName: "当年审计项目数量（个）",
          num: 17774,
          percentage: "8%",
          status: 0, //0:down  1:up
          icon: "当年审计项目数量",
        },
        {
          id: 4,
          typeName: "历史累计审计项目数（个）",
          num: 17774,
          percentage: "8%",
          status: 0, //0:down  1:up
          icon: "历史累计审计项目数",
        },
        {
          id: 5,
          typeName: "五年内未审计单位数（家）",
          num: 17774,
          percentage: "8%",
          status: 0, //0:down  1:up
          icon: "五年内未审计单位数",
        },
        {
          id: 6,
          typeName: "历史从未审计单位总数（家）",
          num: 17774,
          percentage: "8%",
          status: 0, //0:down  1:up
          icon: "历史从未审计单位总数",
        },
      ],

      //审计状况一览表
      cardData: [
        {
          name: "xxxxx单位", //名称
          curNum: 123, //当年数量v
          totalNum: 1234, //历史累计
          isAudit: 1, //0：从未审计   1；审计过
        },
        {
          name: "xxxxx单位", //名称
          curNum: 123, //当年数量v
          totalNum: 1234, //历史累计
          isAudit: 0, //0：从未审计   1；审计过
        },
        {
          name: "xxxxx单位", //名称
          curNum: 123, //当年数量v
          totalNum: 1234, //历史累计
          isAudit: 0, //0：从未审计   1；审计过
        },
        {
          name: "xxxxx单位", //名称
          curNum: 123, //当年数量v
          totalNum: 1234, //历史累计
          isAudit: 0, //0：从未审计   1；审计过
        },
        {
          name: "xxxxx单位", //名称
          curNum: 123, //当年数量v
          totalNum: 1234, //历史累计
          isAudit: 1, //0：从未审计   1；审计过
        },
        {
          name: "xxxxx单位", //名称
          curNum: 123, //当年数量v
          totalNum: 1234, //历史累计
          isAudit: 0, //0：从未审计   1；审计过
        },
        {
          name: "xxxxx单位", //名称
          curNum: 123, //当年数量v
          totalNum: 1234, //历史累计
          isAudit: 0, //0：从未审计   1；审计过
        },
        {
          name: "xxxxx单位", //名称
          curNum: 123, //当年数量v
          totalNum: 1234, //历史累计
          isAudit: 0, //0：从未审计   1；审计过
        },
        {
          name: "xxxxx单位", //名称
          curNum: 123, //当年数量v
          totalNum: 1234, //历史累计
          isAudit: 1, //0：从未审计   1；审计过
        },
        {
          name: "xxxxx单位", //名称
          curNum: 123, //当年数量v
          totalNum: 1234, //历史累计
          isAudit: 0, //0：从未审计   1；审计过
        },
        {
          name: "xxxxx单位", //名称
          curNum: 123, //当年数量v
          totalNum: 1234, //历史累计
          isAudit: 0, //0：从未审计   1；审计过
        },
        {
          name: "xxxxx单位", //名称
          curNum: 123, //当年数量v
          totalNum: 1234, //历史累计
          isAudit: 0, //0：从未审计   1；审计过
        },
        {
          name: "xxxxx单位", //名称
          curNum: 123, //当年数量v
          totalNum: 1234, //历史累计
          isAudit: 1, //0：从未审计   1；审计过
        },
        {
          name: "xxxxx单位", //名称
          curNum: 123, //当年数量v
          totalNum: 1234, //历史累计
          isAudit: 0, //0：从未审计   1；审计过
        },
        {
          name: "xxxxx单位", //名称
          curNum: 123, //当年数量v
          totalNum: 1234, //历史累计
          isAudit: 0, //0：从未审计   1；审计过
        },
        {
          name: "xxxxx单位", //名称
          curNum: 123, //当年数量v
          totalNum: 1234, //历史累计
          isAudit: 0, //0：从未审计   1；审计过
        },
        {
          name: "xxxxx单位", //名称
          curNum: 123, //当年数量v
          totalNum: 1234, //历史累计
          isAudit: 0, //0：从未审计   1；审计过
        },
        {
          name: "xxxxx单位", //名称
          curNum: 123, //当年数量v
          totalNum: 1234, //历史累计
          isAudit: 1, //0：从未审计   1；审计过
        },
        {
          name: "xxxxx单位", //名称
          curNum: 123, //当年数量v
          totalNum: 1234, //历史累计
          isAudit: 0, //0：从未审计   1；审计过
        },
        {
          name: "xxxxx单位", //名称
          curNum: 123, //当年数量v
          totalNum: 1234, //历史累计
          isAudit: 0, //0：从未审计   1；审计过
        },
        {
          name: "xxxxx单位", //名称
          curNum: 123, //当年数量v
          totalNum: 1234, //历史累计
          isAudit: 0, //0：从未审计   1；审计过
        },
        {
          name: "xxxxx单位", //名称
          curNum: 123, //当年数量v
          totalNum: 1234, //历史累计
          isAudit: 0, //0：从未审计   1；审计过
        },
      ],

      myChart1: null,
      myChart2: null,
      myChart3: null,

      // 图1 环形图
      graphData1: {
        year: 2023,
        total: 1000,
        seriesData: [
          { value: 300, name: "审计类型1" },
          { value: 450, name: "审计类型2" },
          { value: 250, name: "审计类型3" },
        ],
      },

      //图2矩形树图
      auditType: null,
      graphData2: {
        seriesData: [
          //数据
          {
            name: "主管单位一",
            value: 50,
            year: 2023,
            type: "manage",
            children: [
              //数据集
              {
                name: "预算单位一",
                value: 25,
                year: 2023,
                type: "budget",
              },
              {
                name: "预算单位二",
                value: 15,
                year: 2023,
                type: "budget",
              },
              {
                name: "预算单位三",
                value: 10,
                year: 2023,
                type: "budget",
              },
            ],
          },
          {
            name: "主管单位二",
            value: 30,
            year: 2023,
            type: "manage",
            children: [
              //数据集
              {
                name: "预算单位一",
                value: 25,
                year: 2023,
                type: "budget",
              },
              {
                name: "预算单位二",
                value: 15,
                year: 2023,
                type: "budget",
              },
              {
                name: "预算单位三",
                value: 10,
                year: 2023,
                type: "budget",
              },
            ],
          },
          {
            name: "主管单位三",
            value: 20,
            year: 2023,
            type: "manage",
            children: [
              //数据集
              {
                name: "预算单位一",
                value: 25,
                year: 2023,
                type: "budget",
              },
              {
                name: "预算单位二",
                value: 15,
                year: 2023,
                type: "budget",
              },
              {
                name: "预算单位三",
                value: 10,
                year: 2023,
                type: "budget",
              },
            ],
          },
        ],
      },

      //图3 环形图
      graphData3: {
        year: 2023,
        total: 1000,
        seriesData: [
          { value: 300, name: "单位名称1" },
          { value: 450, name: "单位名称2" },
          { value: 250, name: "单位名称3" },
        ],
      },

      //当前资产分布（按预算单位与专项资产类型）
      //排序
      sortShow1: false,
      sortStringOne: "",
      //排序选项
      sortOptions1: [
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

      //当年审计项目分布（按主管单位）
      auditTypeLegend: [
        {
          color: "#1776FF",
          name: "预算执行审计",
        },
        {
          color: "#2FA9E6",
          name: "领导人经济责任",
        },
        {
          color: "#1BB46D",
          name: "审计调查",
        },
        {
          color: "#2A43C2",
          name: "竣工审计",
        },
        {
          color: "#5CFFD9",
          name: "其他",
        },
      ],
      columns1: [
        {
          title: "主管单位",
          dataIndex: "zgdw",
          key: "zgdw",
          width: 150,
        },
        {
          title: "当年审计项目数量（个）",
          dataIndex: "dnsjxmsl",
          key: "dnsjxmsl",
          width: 300,
          scopedSlots: { customRender: "dnsjxmsl" },
        },
        {
          title: "历史累计审计项目数量（个）",
          dataIndex: "lsljsjxmsl",
          key: "lsljsjxmsl",
          width: 300,
          scopedSlots: { customRender: "lsljsjxmsl" },
        },
        {
          title: "近五年趋势",
          dataIndex: "graphTrend",
          key: "graphTrend",
          width: 500,
          // width: 488,
          scopedSlots: { customRender: "graphTrend" },
        },
      ],
      tableLoading1: false,
      tableData1: {
        // dataSource1: [
        //   {
        //     zgdw: "单位1",
        //     year: "2023",
        //     zgdwzcze: 999, //主管单位资产总额
        //     dnsjxmsl: [
        //       {
        //         id: 1,
        //         typeName: "预算执行审计",
        //         typeRatio: 10,
        //         typeNum: 10,
        //       },
        //       {
        //         id: 2,
        //         typeName: "领导人经济责任",
        //         typeRatio: 20,
        //         typeNum: 20,
        //       },
        //       {
        //         id: 3,
        //         typeName: "审计调查",
        //         typeRatio: 30,
        //         typeNum: 30,
        //       },
        //       {
        //         id: 4,
        //         typeName: "竣工审计",
        //         typeRatio: 40,
        //         typeNum: 40,
        //       },
        //       {
        //         id: 5,
        //         typeName: "其他",
        //         typeRatio: 50,
        //         typeNum: 50,
        //       },
        //     ],
        //     lsljsjxmsl: [
        //       {
        //         id: 1,
        //         typeName: "预算执行审计",
        //         typeRatio: 10,
        //         typeNum: 10,
        //       },
        //       {
        //         id: 2,
        //         typeName: "领导人经济责任",
        //         typeRatio: 20,
        //         typeNum: 20,
        //       },
        //       {
        //         id: 3,
        //         typeName: "审计调查",
        //         typeRatio: 30,
        //         typeNum: 30,
        //       },
        //       {
        //         id: 4,
        //         typeName: "竣工审计",
        //         typeRatio: 40,
        //         typeNum: 40,
        //       },
        //       {
        //         id: 5,
        //         typeName: "其他",
        //         typeRatio: 50,
        //         typeNum: 50,
        //       },
        //     ],
        //     dnsjxmslMax: 100,
        //     lsljsjxmslMax: 100,
        //   },
        //   {
        //     zgdw: "单位1",
        //     year: "2023",
        //     zgdwzcze: 999, //主管单位资产总额
        //     dnsjxmsl: [
        //       {
        //         id: 1,
        //         typeName: "预算执行审计",
        //         typeRatio: 10,
        //         typeNum: 10,
        //       },
        //       {
        //         id: 2,
        //         typeName: "领导人经济责任",
        //         typeRatio: 20,
        //         typeNum: 20,
        //       },
        //       {
        //         id: 3,
        //         typeName: "审计调查",
        //         typeRatio: 30,
        //         typeNum: 30,
        //       },
        //       {
        //         id: 4,
        //         typeName: "竣工审计",
        //         typeRatio: 40,
        //         typeNum: 40,
        //       },
        //       {
        //         id: 5,
        //         typeName: "其他",
        //         typeRatio: 50,
        //         typeNum: 50,
        //       },
        //     ],
        //     lsljsjxmsl: [
        //       {
        //         id: 1,
        //         typeName: "预算执行审计",
        //         typeRatio: 10,
        //         typeNum: 10,
        //       },
        //       {
        //         id: 2,
        //         typeName: "领导人经济责任",
        //         typeRatio: 20,
        //         typeNum: 20,
        //       },
        //       {
        //         id: 3,
        //         typeName: "审计调查",
        //         typeRatio: 30,
        //         typeNum: 30,
        //       },
        //       {
        //         id: 4,
        //         typeName: "竣工审计",
        //         typeRatio: 40,
        //         typeNum: 40,
        //       },
        //       {
        //         id: 5,
        //         typeName: "其他",
        //         typeRatio: 50,
        //         typeNum: 50,
        //       },
        //     ],
        //     dnsjxmslMax: 100,
        //     lsljsjxmslMax: 100,
        //   },
        //   {
        //     zgdw: "单位1",
        //     year: "2023",
        //     zgdwzcze: 999, //主管单位资产总额
        //     dnsjxmsl: [
        //       {
        //         id: 1,
        //         typeName: "预算执行审计",
        //         typeRatio: 10,
        //         typeNum: 10,
        //       },
        //       {
        //         id: 2,
        //         typeName: "领导人经济责任",
        //         typeRatio: 20,
        //         typeNum: 20,
        //       },
        //       {
        //         id: 3,
        //         typeName: "审计调查",
        //         typeRatio: 30,
        //         typeNum: 30,
        //       },
        //       {
        //         id: 4,
        //         typeName: "竣工审计",
        //         typeRatio: 40,
        //         typeNum: 40,
        //       },
        //       {
        //         id: 5,
        //         typeName: "其他",
        //         typeRatio: 50,
        //         typeNum: 50,
        //       },
        //     ],
        //     lsljsjxmsl: [
        //       {
        //         id: 1,
        //         typeName: "预算执行审计",
        //         typeRatio: 10,
        //         typeNum: 10,
        //       },
        //       {
        //         id: 2,
        //         typeName: "领导人经济责任",
        //         typeRatio: 20,
        //         typeNum: 20,
        //       },
        //       {
        //         id: 3,
        //         typeName: "审计调查",
        //         typeRatio: 30,
        //         typeNum: 30,
        //       },
        //       {
        //         id: 4,
        //         typeName: "竣工审计",
        //         typeRatio: 40,
        //         typeNum: 40,
        //       },
        //       {
        //         id: 5,
        //         typeName: "其他",
        //         typeRatio: 50,
        //         typeNum: 50,
        //       },
        //     ],
        //     dnsjxmslMax: 100,
        //     lsljsjxmslMax: 100,
        //   },
        // ],
        // maxMoney: 1, //dataSource1中资产总额的                                                                                                                                                                                          最大值  money
      },
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
      handler(newVal, oldVal) {
        console.log("5656555", newVal, oldVal);
        this.getAllData();
      },
      deep: true,
    },
    blockChoosedYear: {
      handler(newVal, oldVal) {
        console.log("5656555", newVal, oldVal);
        this.getAllData();
      },
    },
  },
  components: {
    ATooltip: Tooltip,
    SortModal,
    FilterModal,
    APopover: Popover,
    AProgress: Progress,
    AButton: Button,
  },
  mounted() {
    this.getAllData();
    this.initTable();
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
    async getAllData() {
      // this.getAuditOverviewData(); //查询总览概况数据
      // this.getAssertsChartFourOptions(); //当前资产排行榜（按主管单位）  业务板块下拉框
      // this.getAssertsTableOne(); //当前资产分布（按资产大类）表格
      this.initAllCharts();
    },

    //所有echarts渲染
    initAllCharts() {
      this.initEcharts1();
      this.initEcharts2();
      this.initEcharts3();

      const f = () => {
        this.myChart1.resize();
        this.myChart2.resize();
        this.myChart3.resize();
      };
      window.addEventListener("resize", f);
    },

    //计算当前资产总额的百分比
    calculatePercent(money, maxNum) {
      if (money.toString().includes("--") || maxNum === 0) {
        return 0;
      }
      let numberPart = money.toString().trim(); // Get the first part and trim any whitespace
      let numberValue = parseFloat(numberPart); // Convert to number

      if (!isNaN(numberValue)) {
        return (numberValue / maxNum) * 100;
      } else {
        return 0;
      }
    },

    //获取总览数据
    async getAuditOverviewData() {
      const json = {
        // supUnitName: this.choosedBlockId,
        // year: this.blockChoosedYear,
      };
      const res = await getAuditOverviewData(json);
      if (res.message === "成功") {
        console.log("message成功 获取总览数据", res.data);
        this.auditData = res.data;
      } else {
        this.$message(res.message);
      }
    },

    //获取资产状况一览表
    async getAuditCardData() {
      const json = {
        // supUnitName: this.choosedBlockId,
        // year: this.blockChoosedYear,
      };
      const res = await getAuditCardData(json);
      if (res.message === "成功") {
        console.log("message成功 获取资产状况一览表", res.data);
        this.cardData = res.data;
      } else {
        this.$message(res.message);
      }
    },

    //表格里有柱状图 排序
    async getAuditSort() {
      this.sortOptions1 = []; //强制排序组件刷新
      const res = await getAuditSort();

      if (res.message === "成功") {
        console.log("message成功 表格里有柱状图-排序字段", res.data);
        this.sortOptions1 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //表格里有柱状图 筛选
    async getAuditFilter() {
      this.sortOptions1 = []; //强制排序组件刷新
      const res = await getAuditFilter();
      if (res.message === "成功") {
        console.log("message成功 表格里有柱状图-筛选字段", res.data);
        this.paramsOption1 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //表格里的折柱图
    initTable() {
      this.getAuditTableChart();
      this.getTrendEcharts();
    },
    //
    async getAuditTableChart() {
      // const json = {};

      // const res = await getAuditTableChart(json);
      // console.log("res", res);
      // if (res.message === "成功") {
      //   console.log("message成功 表格里有柱状图", res.data);
      //   this.paramsOption1 = res.data;
      // } else {
      //   this.$message.error(res.message);
      // }

      let data = {
        dataSource1: [
          {
            id: "1",
            zgdw: "单位1",
            year: "2023",
            zgdwzcze: 999, //主管单位资产总额
            dnsjxmsl: [
              {
                id: 1,
                typeName: "预算执行审计",
                typeRatio: 10,
                typeNum: 10,
              },
              {
                id: 2,
                typeName: "领导人经济责任",
                typeRatio: 20,
                typeNum: 20,
              },
              {
                id: 3,
                typeName: "审计调查",
                typeRatio: 30,
                typeNum: 30,
              },
              {
                id: 4,
                typeName: "竣工审计",
                typeRatio: 40,
                typeNum: 40,
              },
              {
                id: 5,
                typeName: "其他",
                typeRatio: 50,
                typeNum: 50,
              },
            ],
            lsljsjxmsl: [
              {
                id: 1,
                typeName: "预算执行审计",
                typeRatio: 10,
                typeNum: 10,
              },
              {
                id: 2,
                typeName: "领导人经济责任",
                typeRatio: 20,
                typeNum: 20,
              },
              {
                id: 3,
                typeName: "审计调查",
                typeRatio: 30,
                typeNum: 30,
              },
              {
                id: 4,
                typeName: "竣工审计",
                typeRatio: 40,
                typeNum: 40,
              },
              {
                id: 5,
                typeName: "其他",
                typeRatio: 50,
                typeNum: 50,
              },
            ],
            dnsjxmslMax: 100,
            lsljsjxmslMax: 100,
            graphData: {
              legend: [
                "预算执行审计",
                "领导人经济责任",
                "审计调查",
                "竣工审计",
                "其他",
              ],
              xAxis: ["2019", "2020", "2021", "2022", "2023"],

              series: [
                {
                  name: "预算执行审计",
                  // type: "bar",
                  // stack: "Ad",
                  data: [120, 132, 101, 134, 90],
                  color: "#1776FF",
                  // barWidth: 30, // 设置柱子宽度为30像素
                },
                {
                  name: "领导人经济责任",

                  data: [220, 182, 191, 234, 290],
                  color: "#2FA9E6",
                },
                {
                  name: "审计调查",

                  data: [150, 232, 201, 154, 190],
                  color: "#1BB46D",
                },
                {
                  name: "竣工审计",

                  data: [220, 182, 191, 234, 290],
                  color: "#2A43C2",
                },
                {
                  name: "其他",

                  data: [150, 232, 201, 154, 190],
                  color: "#5CFFD9",
                },
              ],
            },
          },
          {
            id: "2",
            zgdw: "单位2",
            year: "2023",
            zgdwzcze: 999, //主管单位资产总额
            dnsjxmsl: [
              {
                id: 1,
                typeName: "预算执行审计",
                typeRatio: 10,
                typeNum: 10,
              },
              {
                id: 2,
                typeName: "领导人经济责任",
                typeRatio: 20,
                typeNum: 20,
              },
              {
                id: 3,
                typeName: "审计调查",
                typeRatio: 30,
                typeNum: 30,
              },
              {
                id: 4,
                typeName: "竣工审计",
                typeRatio: 40,
                typeNum: 40,
              },
              {
                id: 5,
                typeName: "其他",
                typeRatio: 50,
                typeNum: 50,
              },
            ],
            lsljsjxmsl: [
              {
                id: 1,
                typeName: "预算执行审计",
                typeRatio: 10,
                typeNum: 10,
              },
              {
                id: 2,
                typeName: "领导人经济责任",
                typeRatio: 20,
                typeNum: 20,
              },
              {
                id: 3,
                typeName: "审计调查",
                typeRatio: 30,
                typeNum: 30,
              },
              {
                id: 4,
                typeName: "竣工审计",
                typeRatio: 40,
                typeNum: 40,
              },
              {
                id: 5,
                typeName: "其他",
                typeRatio: 50,
                typeNum: 50,
              },
            ],
            dnsjxmslMax: 100,
            lsljsjxmslMax: 100,
            graphData: {
              legend: [
                "预算执行审计",
                "领导人经济责任",
                "审计调查",
                "竣工审计",
                "其他",
              ],
              xAxis: ["2019", "2020", "2021", "2022", "2023"],

              series: [
                {
                  name: "预算执行审计",
                  // type: "bar",
                  // stack: "Ad",
                  data: [120, 132, 101, 134, 90],
                  color: "#1776FF",
                  // barWidth: 30, // 设置柱子宽度为30像素
                },
                {
                  name: "领导人经济责任",

                  data: [220, 182, 191, 234, 290],
                  color: "#2FA9E6",
                },
                {
                  name: "审计调查",

                  data: [150, 232, 201, 154, 190],
                  color: "#1BB46D",
                },
                {
                  name: "竣工审计",

                  data: [220, 182, 191, 234, 290],
                  color: "#2A43C2",
                },
                {
                  name: "其他",

                  data: [150, 232, 201, 154, 190],
                  color: "#5CFFD9",
                },
              ],
            },
          },
        ],
        // maxMoney: 1, //dataSource1中资产总额的                                                                                                                                                                                          最大值  money
      };
      data.dataSource1.forEach((item) => {
        item.graphData.series.forEach((init) => {
          init.type = "bar";
          init.stack = "Ad";
          init.barWidth = 30;
          // init.label = {
          //   show: true, // 显示标签
          //   position: "top", // 标签位置：top, inside, bottom
          //   formatter: function (params) {
          //     return params.value.toLocaleString() + "个";
          //   },
          // };
        });
      });
      this.tableData1 = data;
    },

    getTrendEcharts() {
      // const _that = this;
      setTimeout(() => {
        this.tableData1.dataSource1.forEach((item) => {
          // if (myChart) {
          //   myChart.dispose();
          // }
          let oldChart = this.$echarts.getInstanceByDom(
            this.$refs["chart" + item.id]
          );
          if (oldChart) {
            oldChart.dispose();
          }
          let myChart = this.$echarts.init(this.$refs["chart" + item.id]);
          const unitName = item.zgdw;
          const option = {
            // grid: {
            //   left: "0",
            //   top: "0",
            //   right: "0",
            //   bottom: "0",
            //   containLabel: true,
            // },
            // grid: { right: 100 },
            tooltip: {
              enterable: true,
              trigger: "axis",
              // trigger: "axis",
              axisPointer: {
                type: "cross",
                crossStyle: {
                  color: "#999",
                },
              },
              // formatter: `{b0} <br/> {a0}&nbsp;&nbsp;&nbsp;&nbsp;{c0}万元<br/> {a1}&nbsp;&nbsp;&nbsp;&nbsp;{c1}个<br/> {a2}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{c2}%`,

              formatter: function (params) {
                console.log("params", params);
                // const money = params[0].data.toLocaleString();
                // const year = params[0].axisValue;
                // const projectCount = params[1].data;
                // const executionRate = params[2].data;
                // const paramsYear = _that.yearRange;
                // // 构建tooltip内容，包括交互元素
                let content = `<div>
                    <p>主管单位名称：${unitName}</p>
                    <p>年份：${params[0].axisValue}年</p>
                    <p>预算执行审计：${Number(
                      params[0].data
                    ).toLocaleString()}个</p>
                    <p>领导人经济责任：${Number(
                      params[1].data
                    ).toLocaleString()}个</p>
                    <p>审计调查：${Number(
                      params[2].data
                    ).toLocaleString()}个</p>
                    <p>竣工审计：${Number(
                      params[3].data
                    ).toLocaleString()}个</p>
                    <p>其他：${Number(params[4].data).toLocaleString()}个</p>
                  </div>`;

                return content;
              },
              confine: true,
              // position: function (point) {
              //   return [point[0] - 20, point[1] - 20];
              // },
            },
            legend: { data: item.graphData.legend },
            xAxis: {
              type: "category",
              data: item.graphData.xAxis,

              //不显示x轴线
              // show: false,
            },
            yAxis: [
              {
                type: "value",
                name: "审计项目数量(个)",
              },
            ],
            series: item.graphData.series,
          };
          myChart.setOption(option);
          window.addEventListener("resize", () => {
            myChart.resize();
          });
        });
      }, 1000);
    },

    //当年审计项目分布情况（按审计类型）
    async getAuditChartOne() {
      const json = {
        // year: this.blockChoosedYear,
        // sectName: this.choosedBlockId,
        // supUnitName: this.choosedBlockId,
      };
      const res = await getAuditChartOne(json);
      if (res.message === "成功") {
        console.log(
          "message成功 当年审计项目分布情况（按审计类型）环形图",
          res.data
        );
        this.graphData1 = res.data;
      } else {
        this.$message(res.message);
      }
    },
    async initEcharts1() {
      if (this.myChart1) {
        this.myChart1.dispose();
      }
      this.myChart1 = this.$echarts.init(this.$refs.graph1);
      // await this.getauditChartOne();
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
        tooltip: {
          enterable: true,
          trigger: "item",
          triggerOn: "mousemove",
          //triggerOn: "click", // 设置触发方式为点击
          position: function (point) {
            return [point[0] + 5, point[1] + 5];
          },
          // jump
          // 用户点击图形上的某一分类后，系统跳转进入【资产卡片明细表】，并自动附带筛选条件【板块名称】【资产类型】【时间范围】。
          formatter: (params) => {
            const name = params.data.name;
            const value = Number(params.data.value).toLocaleString();
            // const paramsYear = _that.yearRange;
            return `<div class="ratio-tooltip-box" style="pointer-events:auto;cursor:pointer;" >
              
              <div>审计类型：${name}</div>
              <div>年份：${_that.graphData1.year}年</div>
              <div>审计项目数量：${value}个</div>
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
            label: {
              position: "outer",
              alignTo: "edge",
              margin: 24,
              formatter: (params) => {
                const name = params.data.name;
                const value = Number(params.data.value).toLocaleString();
                // const rate = params.data.rate;
                return name + "\n\n" + value + "个\n\n";
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
            top: 160,
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
            top: 190,
            style: {
              text: "审计项目总数(个)",
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
        //更新子图
        //第一次选中，第二次重新选中的时候，将当前类型置为null
        if (params.data.name === this.auditType) {
          // 选的同一级，同一块，也就是重置
          this.auditType = null;
          this.initEcharts2();
        } else {
          this.auditType = params.data.name;
          this.initEcharts2();
        }
      });
    },

    // 指定审计类型下单位分布情况
    async getAuditChartTwo() {
      const json = {
        // year: this.blockChoosedYear,
        // sectName: this.choosedBlockId,
        // supUnitName: this.choosedBlockId,
      };
      const res = await getAuditChartTwo(json);
      if (res.message === "成功") {
        console.log("message成功 指定审计类型下单位分布情况矩形树图", res.data);
        this.graphData2 = res.data;
      } else {
        this.$message(res.message);
      }
    },
    async initEcharts2() {
      //联动需要先clear
      if (this.myChart2) {
        this.myChart2.dispose();
      }
      this.myChart2 = this.$echarts.init(this.$refs.graph2);
      // await this.getauditChartTwo();

      const _that = this;
      //整体支出均衡性
      const option2 = {
        tooltip: {
          enterable: true,
          //trigger: "axis",
          triggerOn: "mousemove",
          //triggerOn: "click", // 设置触发方式为点击
          //jump
          // 2.提供图表穿透功能：用户点击图形上的某一个金额后，系统跳转进入【资产卡片明细表】，并自动附带筛选条件【单位名称】【资产类型】【时间范围】。
          formatter: function (params) {
            const type = _that.auditType === null ? "全部" : _that.auditType;
            // const paramsYear = _that.yearRange;
            if (params.data.type === "manage") {
              return `<div class="ratio-tooltip-box" style="pointer-events:auto">
              <div>年份：${params.data.year}年</div>
              <a>主管单位名称：${params.data.name}</a>
              <div>审计类型：${type}</div>
               <div>审计项目数量：${Number(
                 params.data.value
               ).toLocaleString()}个</div>
            </div>`;
            } else {
              return `<div class="ratio-tooltip-box" style="pointer-events:auto">
              <div>年份：${params.data.year}年</div>
              <a>预算单位名称：${params.data.name}</a>
              <div>审计类型：${type}</div>
              <div>审计项目数量：${Number(
                params.data.value
              ).toLocaleString()}个</div>
            </div>`;
            }
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
            width: "95%",
            height: "85%",
            leafDepth: 1,
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
            label: {
              formatter: function (params) {
                const value = Number(params.data.value).toLocaleString();
                return (
                  params.data.name + "\n\n" + "被审计项目数量：" + value + "个"
                );
              },
            },

            data: this.graphData2.seriesData,
          },
        ],
      };

      this.myChart2.on("click", (params) => {
        console.log(params);
      });
      this.myChart2.setOption(option2, true);
    },

    // 当年审计项目分布情况（按主管单位）
    async getAuditChartThree() {
      const json = {
        // year: this.blockChoosedYear,
        // sectName: this.choosedBlockId,
        // supUnitName: this.choosedBlockId,
      };
      const res = await getAuditChartThree(json);
      if (res.message === "成功") {
        console.log(
          "message成功 当年审计项目分布情况（按主管单位）环形图",
          res.data
        );
        this.graphData3 = res.data;
      } else {
        this.$message(res.message);
      }
    },
    async initEcharts3() {
      if (this.myChart3) {
        this.myChart3.dispose();
      }
      this.myChart3 = this.$echarts.init(this.$refs.graph3);
      // await this.getauditChartOne();
      const _that = this;
      //环形图中心总额文字长度自适应
      let maxWidth = 90; // 设置最大宽度
      let initialFontSize = 24; // 初始字体大小
      let adjustedFontSize = adjustFontSize(
        Number(this.graphData1.total).toLocaleString(),
        maxWidth,
        initialFontSize
      );

      const option3 = {
        tooltip: {
          enterable: true,
          trigger: "item",
          triggerOn: "mousemove",
          //triggerOn: "click", // 设置触发方式为点击
          // jump
          // 用户点击图形上的某一分类后，系统跳转进入【资产卡片明细表】，并自动附带筛选条件【板块名称】【资产类型】【时间范围】。
          formatter: (params) => {
            const name = params.data.name;
            const value = Number(params.data.value).toLocaleString();
            // const paramsYear = _that.yearRange;
            return `<div class="ratio-tooltip-box" style="pointer-events:auto;cursor:pointer;" >
              
              <div>单位名称：${name}</div>
              <div>年份：${_that.graphData3.year}年</div>
              <div>审计项目数量：${value}个</div>
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
            data: this.graphData3.seriesData,
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
                const name = params.data.name;
                const value = Number(params.data.value).toLocaleString();
                // const rate = params.data.rate;
                return name + "\n\n" + value + "个\n\n";
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
        graphic: [
          {
            //环形图中间添加文字
            type: "text", //通过不同top值可以设置上下显示
            left: "center",
            top: 140,
            style: {
              text: this.graphData3.total.toLocaleString(),
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
              text: "审计项目总数(个)",
              textAlign: "center",
              fill: "##1C222B", //文字的颜色
              fontSize: 12,
              lineHeight: 20,
            },
          },
        ],
      };

      this.myChart3.setOption(option3);
      this.myChart3.on("click", (params) => {
        console.log("点击环形图事件", params);
        // this.initEcharts2();
        //更新子图  主图子图联动
      });
    },

    //第一个表格——当年审计项目分布（按主管单位）筛选
    filterOne() {
      this.filterShow1 = true;
    },
    onFilterCancel1() {
      this.filterShow1 = false;
    },
    onFilterConfirm1(filterConfirmArrOne) {
      this.filterConfirmArrOne = filterConfirmArrOne;
      // this.getManageAssertsTableOne();
      this.onFilterCancel1();
    },
    addTable1(json) {
      this.filterTableData1 = [...this.filterTableData1, json];
    },
    delTable1(arr) {
      this.filterTableData1 = arr;
    },

    //第一个表格——当年审计项目分布（按主管单位）排序
    sortOne() {
      this.sortShow1 = true;
    },
    onSortCancel1() {
      this.sortShow1 = false;
    },
    onSortConfirm1(sortStringOne) {
      this.sortStringOne = sortStringOne;
      // this.getManageAssertsTableOne();
      this.onSortCancel1();
    },
  },
};
</script>
<style lang="less">
.audit-situation {
  width: 100%;
  background: #ffffff;
  padding: 0 20px 20px 20px;

  //第一行非税收入部分
  .audit-data {
    width: 100%;
    height: 126px;
    margin-bottom: 20px;

    &-item {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
      grid-template-rows: 126px;
      gap: 20px;

      .audit-unit {
        //每个小方块
        height: 126px;
        padding: 20px 0 20px 16px;
        color: #3c485c;
        border-radius: 6px;
        background: linear-gradient(104deg, #dfeaff 0%, #f4f6ff 100.1%);
        position: relative;

        .unit-top {
          height: 22px;
          line-height: 22px;
        }

        .unit-middle {
          margin: 10px 0;
          font-weight: 500;
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

      .audit-unit-second {
        background: linear-gradient(104deg, #e1f8ff 0.1%, #eff9ff 99.9%);
      }
      .audit-unit-third {
        background: linear-gradient(104deg, #fff2df 0.1%, #fffaf2 99.9%);
      }
    }
  }

  &-card {
    display: flex;
    width: 100%;
    justify-content: space-between;

    &-right {
      height: 24px;
      display: flex;
      align-items: center;

      .card-right-item {
        height: 24px;
        display: flex;
        align-items: center;
        margin-left: 20px;

        &-icon {
          display: flex;
          align-items: center;
          width: 16px;
          height: 16px;
          margin-right: 8px;
        }
      }
    }
  }

  &-card-wrapper {
    max-height: 340px;
    overflow-y: scroll;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: 100px 100px 100px;
    gap: 20px;

    &-item {
      padding: 10px;
      background: #f1f2f5;

      &-top {
        height: 22px;
        font-weight: 600;
        display: flex;
        margin-bottom: 2px;
        justify-content: space-between;
        align-items: center;

        &-right {
          width: 20px;
          height: 20px;
        }
      }

      &-content {
        width: 100%;
        height: 20px;
        margin-top: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        &-label {
          color: #97a3b7;
        }
      }

      &-audit {
        background: #e6f5eb;
      }
    }
  }

  //第二行以及第三行三个图（样式相同）
  .audit-type {
    width: 100%;
    margin-top: 20px;
    margin-bottom: 20px;

    //仨图一起的框
    &-wrapper {
      width: 100%;
      display: flex;
      // justify-content: space-between;

      //各个图
      .wrapper-box {
        border-radius: 6px;
        border: 1px solid #d6dbe3;
        background: #fff;
        height: 444px;
        padding: 12px 20px 20px 20px;
        margin-right: 20px;

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
          height: 361px;
          display: flex;
          flex-direction: column;
          justify-content: center;

          &-graph {
            width: 90%;
            height: 100%;
            margin: 0 auto;
          }
        }
      }
    }
  }

  //当年审计项目分布
  &-distribution {
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

  &-distribution-content {
    width: 100%;
    height: 404px;
    display: flex;

    .distribution-content-wrapper-box {
      width: calc(35% - 10px);
      border-radius: 6px;
      border: 1px solid #d6dbe3;
      background: #fff;
      height: 404px;
      padding: 12px 20px 20px 20px;
      margin-right: 20px;

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
        height: calc(100% - 43px);
        // height: 361px;
        display: flex;
        flex-direction: column;
        justify-content: center;

        &-graph {
          width: 90%;
          height: 100%;
          margin: 0 auto;
        }
      }
    }

    &-table {
      width: calc(65% - 10px);
    }
  }
}

.top-action-popover {
  &-item {
    display: flex;
    align-items: center;
    margin-bottom: 8px;

    &-left {
      width: 14px;
      height: 14px;
      border-radius: 2px;
    }

    &-right {
      margin-left: 8px;
    }
  }
}

.audit-situation-progress-two {
  .ant-progress-outer {
    .ant-progress-inner {
      .ant-progress-bg,
      .ant-progress-success-bg {
        background: #2fa9e6 !important;
      }
    }
  }
}
.audit-situation-progress-three {
  .ant-progress-outer {
    .ant-progress-inner {
      .ant-progress-bg,
      .ant-progress-success-bg {
        background: #1bb46d !important;
      }
    }
  }
}
.audit-situation-progress-four {
  .ant-progress-outer {
    .ant-progress-inner {
      .ant-progress-bg,
      .ant-progress-success-bg {
        background: #2a43c2 !important;
      }
    }
  }
}
.audit-situation-progress-five {
  .ant-progress-outer {
    .ant-progress-inner {
      .ant-progress-bg,
      .ant-progress-success-bg {
        background: #5cffd9 !important;
      }
    }
  }
}
</style>
