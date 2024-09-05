<template>
  <div class="group-portrait">
    <div class="group-portrait-info">
      <div class="options-content">
        <div class="options-content-item">
          <label class="item-label">时间筛选:</label>
          <div class="item-content">
            <!-- <a-select
              :options="timeOptions"
              class="item-content-input"
              placeholder="请选择"
              v-model="dateValue1"
              @change="onRadioChange"
            /> -->
            <a-date-picker
              v-model="dateValue1"
              mode="year"
              format="YYYY"
              :open="yearShow"
              class="item-content-input"
              @openChange="openChangeYear"
              @panelChange="panelChangeYear"
            />
          </div>

          <!-- <div class="item-content">
            <a-radio-group
              default-value="0"
              button-style="solid"
              v-model="dateValue1"
              @change="onRadioChange"
            >
              <a-radio-button value="2016"> 2016年 </a-radio-button>
              <a-radio-button value="2017"> 2017年 </a-radio-button>
              <a-radio-button value="2018"> 2018年 </a-radio-button>
              <a-radio-button value="2019"> 2019年 </a-radio-button>
              <a-radio-button value="2020"> 2020年 </a-radio-button>
              <a-radio-button value="2021"> 2021年 </a-radio-button>
              <a-radio-button value="2022"> 2022年 </a-radio-button>
            </a-radio-group>
          </div> -->
        </div>
        <div class="options-content-radio">
          <a-radio-group
            v-model="radioValue"
            button-style="solid"
            @change="radioChange"
          >
            <a-radio-button value="1">集团画像</a-radio-button>
            <a-radio-button value="2">子集团画像</a-radio-button>
          </a-radio-group>
        </div>
      </div>
      <div class="group-portrait-info-content">
        <div :class="['info-center', `class${topLevel}`]">
          <div class="info-center-content">
            <div
              v-for="(item, index) in levelData"
              :key="index"
              class="info-center-content-item"
            >
              <span class="item-level">{{ item.level }}级</span>
              <span class="item-num">{{ item.count }}家</span>
            </div>
          </div>
        </div>
        <div class="info-left left-first">
          <div class="info-content">
            <div class="info-content-left">
              <p class="content-title">纳税总金额</p>
              <p class="content-money">
                <span class="content-money-num">{{ taxMoney }}</span
                >&nbsp;
                <span class="content-money-unit">万元</span>
              </p>
              <!-- <p class="content-ratio">
                <span class="content-ratio-num">+1030万元</span>&nbsp;/
                <span class="content-ratio-percentage">22%&nbsp;&nbsp;</span>
                <span class="content-ratio-img">
                  <img src="@/assets/images/img/up-red.svg" alt="" />
                </span>
              </p> -->
            </div>
            <div class="info-content-right">
              <img src="@/assets/images/img/pyramid_left_1.svg" alt="" />
            </div>
          </div>
        </div>
        <div class="info-left left-second">
          <div class="info-content">
            <div class="info-content-left">
              <p class="content-title">社保缴纳人数</p>
              <p class="content-money">
                <span class="content-money-num">{{ personNum }}</span
                >&nbsp;
                <span class="content-money-unit">人</span>
              </p>
              <!-- <p class="content-ratio">
                <span class="content-ratio-num">+1030人</span>&nbsp;/
                <span class="content-ratio-percentage">22%&nbsp;&nbsp;</span>
                <span class="content-ratio-img">
                  <img src="@/assets/images/img/up-red.svg" alt="" />
                </span>
              </p> -->
            </div>
            <div class="info-content-right">
              <img src="@/assets/images/img/pyramid_left_2.svg" alt="" />
            </div>
          </div>
        </div>
        <div class="info-left left-third">
          <div class="info-content">
            <div class="info-content-left">
              <p class="content-title">专利总数</p>
              <p class="content-money">
                <span class="content-money-num">{{ patentNum }}</span
                >&nbsp;
                <span class="content-money-unit">件</span>
              </p>
              <!-- <p class="content-ratio">
                <span class="content-ratio-num">+1030件</span>&nbsp;/
                <span class="content-ratio-percentage">22%&nbsp;&nbsp;</span>
                <span class="content-ratio-img">
                  <img src="@/assets/images/img/up-red.svg" alt="" />
                </span>
              </p> -->
            </div>
            <div class="info-content-right">
              <img src="@/assets/images/img/pyramid_left_3.svg" alt="" />
            </div>
          </div>
        </div>
        <div class="info-left left-fourth">
          <div class="info-content">
            <div class="info-content-left">
              <p class="content-title">负面事件总数</p>
              <p class="content-money">
                <span class="content-money-num">{{ negNum }}</span
                >&nbsp;
                <span class="content-money-unit">件</span>
              </p>
              <!-- <p class="content-ratio">
                <span class="content-ratio-num">-1030件</span>&nbsp;/
                <span class="content-ratio-percentage">22%&nbsp;&nbsp;</span>
                <span class="content-ratio-img">
                  <img src="@/assets/images/img/down-red.svg" alt="" />
                </span>
              </p> -->
            </div>
            <div class="info-content-right">
              <img src="@/assets/images/img/pyramid_left_4.svg" alt="" />
            </div>
          </div>
        </div>
        <div class="info-right right-first">
          <div class="info-content">
            <div class="info-content-left">
              <img src="@/assets/images/img/pyramid_right_1.svg" alt="" />
            </div>
            <div class="info-content-right">
              <p class="content-title">营业收入</p>
              <p class="content-money">
                <span class="content-money-num">{{ income }}</span
                >&nbsp;
                <span class="content-money-unit">万元</span>
              </p>
              <!-- <p class="content-ratio">
                <span class="content-ratio-num">+1030万元</span>&nbsp;/
                <span class="content-ratio-percentage">22%&nbsp;&nbsp;</span>
                <span class="content-ratio-img">
                  <img src="@/assets/images/img/up-red.svg" alt="" />
                </span>
              </p> -->
            </div>
          </div>
        </div>
        <div class="info-right right-second">
          <div class="info-content">
            <div class="info-content-left">
              <img src="@/assets/images/img/pyramid_right_23.svg" alt="" />
            </div>
            <div class="info-content-right">
              <p class="content-title">总资产</p>
              <p class="content-money">
                <span class="content-money-num">{{ assets }}</span>
                <!-- <span class="content-money-num">暂无数据</span> -->
                &nbsp;
                <span class="content-money-unit">万元</span>
              </p>
              <!-- <p class="content-ratio">
                <span class="content-ratio-num">+1030万元</span>&nbsp;/
                <span class="content-ratio-percentage">22%&nbsp;&nbsp;</span>
                <span class="content-ratio-img">
                  <img src="@/assets/images/img/up-red.svg" alt="" />
                </span>
              </p> -->
            </div>
          </div>
        </div>
        <div class="info-right right-third">
          <div class="info-content">
            <div class="info-content-left">
              <img src="@/assets/images/img/pyramid_right_23.svg" alt="" />
            </div>
            <div class="info-content-right">
              <p class="content-title">净资产</p>
              <p class="content-money">
                <span class="content-money-num">{{ realAssets }}</span>
                <!-- <span class="content-money-num">暂无数据</span> -->
                &nbsp;
                <span class="content-money-unit">万元</span>
              </p>
              <!-- <p class="content-ratio">
                <span class="content-ratio-num">+1030万元</span>&nbsp;/
                <span class="content-ratio-percentage">22%&nbsp;&nbsp;</span>
                <span class="content-ratio-img">
                  <img src="@/assets/images/img/up-red.svg" alt="" />
                </span>
              </p> -->
            </div>
          </div>
        </div>
        <div class="info-right right-fourth">
          <div class="info-content">
            <div class="info-content-left">
              <img src="@/assets/images/img/pyramid_right_4.svg" alt="" />
            </div>
            <div class="info-content-right">
              <p class="content-title">营业利润</p>
              <p class="content-money">
                <span class="content-money-num">{{ realIncome }}</span
                >&nbsp;
                <span class="content-money-unit">万元</span>
              </p>
              <!-- <p class="content-ratio">
                <span class="content-ratio-num">+1030万元</span>&nbsp;/
                <span class="content-ratio-percentage">22%&nbsp;&nbsp;</span>
                <span class="content-ratio-img">
                  <img src="@/assets/images/img/up-red.svg" alt="" />
                </span>
              </p> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="group-portrait-child">
      <div class="sub-title">集团分析、核心数据变化趋势</div>
      <a-button class="business-table-btn" @click="handleChangebtn(1)">
        <!-- {{ foldValue1 ? "收起" : "展开" }} -->
        <a-icon :type="foldValue1 ? 'up' : 'down'" />
      </a-button>
      <div
        :class="
          foldValue1
            ? 'group-portrait-child-content'
            : 'group-portrait-child-content fold'
        "
      >
        <data-graphs ref="dataGraphs" :list="graphList" />
      </div>
    </div>
    <div class="group-portrait-change">
      <div class="sub-title">子集团分析，核心数据变化趋势</div>
      <a-button class="business-table-btn" @click="handleChangebtn(2)">
        <!-- {{ foldValue2 ? "收起" : "展开" }} -->
        <a-icon :type="foldValue2 ? 'up' : 'down'" />
      </a-button>
      <div
        :class="
          foldValue2
            ? 'group-portrait-child-content'
            : 'group-portrait-child-content fold'
        "
      >
        <div class="options-content">
          <div class="options-content-item">
            <label class="item-label">指标选择:</label>
            <div class="item-content">
              <div class="check-box">
                <div
                  v-for="(item, index) in targetList"
                  :key="item.value"
                  :class="['check-item', item.isSelected ? 'active' : '']"
                  @click="handleCheckItem(index)"
                >
                  {{ item.label }}
                </div>
              </div>
            </div>
          </div>
          <div class="options-content-item">
            <label class="item-label">时间筛选:</label>
            <div class="item-content">
              <!-- <a-radio-group
                default-value="0"
                button-style="solid"
                v-model="dateValue2"
              >
                <a-radio-button value="0"> 2016年 </a-radio-button>
                <a-radio-button value="1"> 2017年 </a-radio-button>
                <a-radio-button value="2"> 2018年 </a-radio-button>
                <a-radio-button value="3"> 2019年 </a-radio-button>
                <a-radio-button value="4"> 2020年 </a-radio-button>
                <a-radio-button value="5"> 2021年 </a-radio-button>
                <a-radio-button value="6"> 2022年 </a-radio-button>
              </a-radio-group> -->
              <a-range-picker
                :placeholder="['开始年份', '截止年份']"
                class="item-content-input"
                format="YYYY"
                valueFormat="YYYY"
                :value="dateValue2"
                :mode="['year', 'year']"
                @panelChange="onPanelChange"
                @change="onDataChange"
              >
                <template slot="suffixIcon">
                  <a-icon type="calendar" />
                </template>
              </a-range-picker>
            </div>
          </div>
          <!-- <div class="options-content-item">
            <label class="item-label">层级筛选:</label>
            <div class="item-content">
              <a-checkbox
                :indeterminate="indeterminate"
                :checked="checkAll"
                @change="onCheckAllChange"
                >全选</a-checkbox
              >
              <a-checkbox-group
                v-model="checkedList"
                :options="plainOptions"
                @change="onChange"
              />
            </div>
          </div> -->
        </div>
        <data-graphs ref="dataGraphs2" :list="graphList2" />
      </div>
    </div>
  </div>
</template>
<script>
import DataGraphs from "../components/dataGraphs";
import { Button, Checkbox, DatePicker, Icon, Radio } from "ant-design-vue";
import { scrollToBottom } from "@/utils/common.js";
import {
  queryEntLevelCount,
  queryEntDataByYear,
  queryEntCountDistribute,
  queryEntYysryDistribute,
  queryEntTaxPayment,
  structureAnalyse,
  queryChildEntLevelCount,
  queryChildEntDataByYear,
  queryChildEntDataByYears,
} from "@/shared/api/auditMode.js";
import { mapState } from "vuex";
import { handleAddEchartsBackground } from "@/utils/echarts.js";
import moment from "moment";
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

const { RangePicker } = DatePicker;

const { Group } = Checkbox;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

export default {
  name: "GroupPortrait",
  data() {
    return {
      targetValue: [1, 2, 3, 4, 5, 6, 7, 8],
      yearShow: false,
      timeOptions: [
        { value: 2016, label: 2016 },
        { value: 2017, label: 2017 },
        { value: 2018, label: 2018 },
        { value: 2019, label: 2019 },
        { value: 2020, label: 2020 },
        { value: 2021, label: 2021 },
        { value: 2022, label: 2022 },
      ],
      dateValue1: "2021",
      dateValue2: [moment("2017"), moment("2021")],
      myChart1: null,
      myChart2: null,
      myChart3: null,
      myChart4: null,
      graphList: [
        {
          title: "企业数量分布",
          ref: "graph1",
          width: "calc((100% - 48px) / 3)",
          paddingTop: "381px",
          dataSource: "上海市场监督管理局",
        },
        {
          title: "纳税金额分布",
          ref: "graph3",
          width: "calc((100% - 48px) / 3)",
          paddingTop: "381px",
          dataSource: "上海市税务局",
        },
        {
          title: "企业营收分布",
          ref: "graph2",
          width: "calc((100% - 48px) / 3)",
          paddingTop: "381px",
          dataSource: "上海市税务局",
        },
      ],
      graphList2: [
        {
          title: "数据变化趋势",
          ref: "graph4",
          width: "100%",
          paddingTop: "563px",
        },
      ],
      indeterminate: false,
      checkAll: false,
      plainOptions: [
        "层级一",
        "层级二",
        "层级三",
        "层级四",
        "层级五",
        "层级六",
        "层级七",
        "层级八",
      ],
      checkedList: [],
      radioValue: "1", // "1"集团，"2"子集团
      foldValue1: true,
      foldValue2: true,
      taxMoney: 0,
      personNum: 0,
      patentNum: 0,
      negNum: 0,
      income: 0,
      assets: 0,
      realAssets: 0,
      realIncome: 0,
      graphData: {},
      targetList: [
        {
          value: 1,
          label: "纳税总金额",
          isSelected: true,
        },
        {
          value: 2,
          label: "社保缴纳人数",
          isSelected: true,
        },
        {
          value: 3,
          label: "专利总数",
          isSelected: true,
        },
        {
          value: 4,
          label: "负面事件总数",
          isSelected: true,
        },
        {
          value: 5,
          label: "营业收入",
          isSelected: true,
        },
        {
          value: 6,
          label: "总资产",
          isSelected: false,
        },
        {
          value: 7,
          label: "净资产",
          isSelected: false,
        },
        {
          value: 8,
          label: "营业利润",
          isSelected: true,
        },
      ],
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
      topLevel: 0, // 最大层级
      levelData: [], // 按序存放每层的企业数量
    };
  },
  components: {
    AButton: Button,
    ACheckbox: Checkbox,
    ACheckboxGroup: Group,
    AIcon: Icon,
    ARadioButton: RadioButton,
    ARadioGroup: RadioGroup,
    ARangePicker: RangePicker,
    ADatePicker: DatePicker,
    DataGraphs,
  },
  computed: {
    ...mapState("auditOptions", ["paramsObj"]),
  },
  mounted() {
    this.queryEntLevelCount();
    this.queryEntDataByYear();
    this.queryEntCountDistribute();
    this.queryEntYysryDistribute();
    this.queryEntTaxPayment();
    this.structureAnalyse();
    const f = () => {
      this.myChart1.resize();
      this.myChart2.resize();
      this.myChart3.resize();
      this.myChart4.resize();
    };
    window.addEventListener("resize", f);
  },
  beforeDestroy() {
    this.myChart1.clear();
    this.myChart2.clear();
    this.myChart3.clear();
    this.myChart4.clear();
    const f = () => {
      this.myChart1.resize();
      this.myChart2.resize();
      this.myChart3.resize();
      this.myChart4.resize();
    };
    window.removeEventListener("resize", f);
  },
  methods: {
    init() {
      this.myChart4 = this.$echarts.init(
        this.$refs.dataGraphs2.$refs.graph4[0]
      );
      const option4 = {
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
          y: 50,
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
            name: "单位：万元",
            minInterval: 1,
            splitLine: {
              lineStyle: {
                type: "dashed",
              },
            },
          },
          {
            type: "value",
            name: "单位：件/人",
            minInterval: 1,
            splitLine: {
              lineStyle: {
                type: "dashed",
              },
            },
          },
        ],
        series: [],
      };
      this.targetValue.map((v) => {
        option4.series.push({
          name: this.targetList[v - 1].label,
          type: "line",
          // areaStyle: {
          //   color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
          //     { offset: 0, color: "rgba(41, 141, 255, 0.3)" },
          //     { offset: 1, color: "rgba(41, 141, 255, 0.05)" },
          //   ]),
          // },
          color: this.lineColor[v - 1],
          emphasis: {
            focus: "series",
          },
          data: this.graphData[`data${v}`],
          yAxisIndex: v === 2 || v === 3 || v === 4 ? 1 : 0,
        });
      });
      this.myChart4.setOption(option4, true);
      handleAddEchartsBackground(this.myChart4, option4, this.graphData.xAxis);
    },
    onChange(checkedList) {
      this.indeterminate =
        !!checkedList.length && checkedList.length < this.plainOptions.length;
      this.checkAll = checkedList.length === this.plainOptions.length;
    },
    onCheckAllChange(e) {
      Object.assign(this, {
        checkedList: e.target.checked ? this.plainOptions : [],
        indeterminate: false,
        checkAll: e.target.checked,
      });
    },
    handleChangebtn(num) {
      switch (num) {
        case 1:
          this.foldValue1 = !this.foldValue1;
          if (this.foldValue1 && !this.foldValue2) {
            setTimeout(() => {
              scrollToBottom(this, "audit-mode", 30);
            }, 200);
          }
          break;
        case 2:
          this.foldValue2 = !this.foldValue2;
          if (this.foldValue2) {
            setTimeout(() => {
              scrollToBottom(this, "audit-mode", 20);
            }, 200);
          }
          break;
        default:
          break;
      }
    },
    async queryEntLevelCount() {
      const json = {
        corpName: this.paramsObj.corpName,
        year: this.dateValue1,
      };
      const res = await queryEntLevelCount(json);
      console.log("queryEntLevelCount", res);
      if (res.message === "成功" && res.data) {
        this.getLevelData(res.data);
      } else if (res.message === "成功" && !res.data) {
        this.$message.info("暂无企业架构信息");
      } else {
        this.$message.error(res.message);
      }
    },
    getLevelData(data) {
      // const levels = [];
      // for (let i in data) {
      //   levels.push(i);
      // }
      // const newLevels = levels
      //   .map((v) => {
      //     if (isNaN(parseInt(v)) || typeof parseInt(v) != "number") {
      //       return 0;
      //     } else {
      //       return parseInt(v);
      //     }
      //   })
      //   .sort((a, b) => {
      //     return b - a; // 倒序
      //   });
      // const finalLevels = [...new Set(newLevels)]; // 去重，new Set(newLevels)的结果是对象
      // this.topLevel = finalLevels[0]; // 最大层级

      // const levelData = [];
      // for (let i = 0; i < this.topLevel; i++) {
      //   levelData.push(data[i + 1] || 0);
      // }

      const levelData = [];
      this.topLevel = 0;
      for (let i in data) {
        levelData.push({
          level: i,
          count: data[i],
        });
        this.topLevel++;
      }
      this.levelData = levelData;
    },
    async queryEntDataByYear() {
      const json = {
        corpName: this.paramsObj.corpName,
        year: this.dateValue1,
      };
      const res = await queryEntDataByYear(json);
      if (res.message === "成功" && res.data) {
        this.taxMoney = res.data.ssgm || 0;
        this.personNum = res.data.dwcbrsY || 0;
        this.patentNum = res.data.zlsY || 0;
        this.negNum = res.data.fmsjsY || 0;
        this.income = res.data.yysrY || 0;
        this.realIncome = res.data.yylrY || 0;
        this.taxMoney = Number(
          this.taxMoney.toString().match(/^\d+(?:\.\d{0,2})?/)
        ).toLocaleString();
        this.personNum = Number(
          this.personNum.toString().match(/^\d+(?:\.\d{0,2})?/)
        ).toLocaleString();
        this.patentNum = Number(
          this.patentNum.toString().match(/^\d+(?:\.\d{0,2})?/)
        ).toLocaleString();
        this.negNum = Number(
          this.negNum.toString().match(/^\d+(?:\.\d{0,2})?/)
        ).toLocaleString();
        this.income = Number(
          this.income.toString().match(/^\d+(?:\.\d{0,2})?/)
        ).toLocaleString();
        this.realIncome = Number(
          this.realIncome.toString().match(/^\d+(?:\.\d{0,2})?/)
        ).toLocaleString();
      } else if (res.message === "成功" && !res.data) {
        this.$message.info("暂无企业数据信息");
        this.taxMoney = 0;
        this.personNum = 0;
        this.patentNum = 0;
        this.negNum = 0;
        this.income = 0;
        this.realIncome = 0;
        this.taxMoney = 0;
        this.personNum = 0;
        this.patentNum = 0;
        this.negNum = 0;
        this.income = 0;
        this.realIncome = 0;
      } else {
        this.$message.error(res.message);
      }
    },
    async queryEntCountDistribute() {
      const json = {
        corpName: this.paramsObj.corpName,
        year: this.dateValue1,
      };
      const res = await queryEntCountDistribute(json);
      if (res.message === "成功" && res.data) {
        const pieData = [];
        for (let i in res.data) {
          pieData.push({
            value: res.data[i],
            name: i,
          });
        }
        if (pieData.length === 0) {
          this.$set(this.graphList, 0, {
            title: "企业数量分布",
            ref: "graph1",
            width: "calc((100% - 48px) / 3)",
            paddingTop: "381px",
            dataSource: "上海市场监督管理局",
            noData: true,
          });
          return;
        } else {
          this.$set(this.graphList, 0, {
            title: "企业数量分布",
            ref: "graph1",
            width: "calc((100% - 48px) / 3)",
            paddingTop: "381px",
            dataSource: "上海市场监督管理局",
          });
        }

        this.myChart1 = this.$echarts.init(
          this.$refs.dataGraphs.$refs.graph1[0]
        );
        const option1 = {
          tooltip: {
            trigger: "item",
            triggerOn: "mousemove",
            formatter: "{b}：{d}%",
          },
          series: [
            {
              type: "pie",
              radius: [0, 100],
              center: ["50%", "50%"],
              roseType: "radius",
              data: pieData.sort(function (a, b) {
                return b.value - a.value;
              }),
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
              animationType: "scale",
              animationEasing: "elasticOut",
              animationDelay: function (idx) {
                return Math.random() * 200;
              },
              label: {
                position: "outer",
                alignTo: "edge",
                margin: 24,
                formatter: function (params) {
                  console.log("params", params);
                  const name = params.data.name;
                  const value = params.percent;
                  return name + "：" + value + "%\n";
                },
              },
            },
          ],
        };

        this.myChart1.setOption(option1);
      } else if (res.message === "成功" && Object.keys(res.data) === 0) {
        this.$message.info("暂无企业数量分布信息");
        this.$set(this.graphList, 0, {
          title: "企业数量分布",
          ref: "graph1",
          width: "calc((100% - 48px) / 3)",
          paddingTop: "381px",
          dataSource: "上海市场监督管理局",
          noData: true,
        });
      } else {
        this.$message.error(res.message);
      }
    },
    async queryEntYysryDistribute() {
      const json = {
        corpName: this.paramsObj.corpName,
        year: this.dateValue1,
      };
      const res = await queryEntYysryDistribute(json);
      console.log("test", JSON.stringify(res.data) === "{}");
      if (
        res.message === "成功" &&
        res.data &&
        JSON.stringify(res.data) !== "{}"
      ) {
        const pieData = [];
        for (let i in res.data) {
          if (res.data[i]) {
            pieData.push({
              value: res.data[i],
              name: i,
            });
          }
        }
        if (pieData.length === 0) {
          this.$set(this.graphList, 2, {
            title: "企业营收分布",
            ref: "graph2",
            width: "calc((100% - 48px) / 3)",
            paddingTop: "381px",
            dataSource: "上海市税务局",
            noData: true,
          });
          return;
        } else {
          this.$set(this.graphList, 2, {
            title: "企业营收分布",
            ref: "graph2",
            width: "calc((100% - 48px) / 3)",
            paddingTop: "381px",
            dataSource: "上海市税务局",
          });
        }

        this.myChart2 = this.$echarts.init(
          this.$refs.dataGraphs.$refs.graph2[0]
        );
        const option2 = {
          tooltip: {
            trigger: "item",
            triggerOn: "mousemove",
            formatter: "{b}：{d}%",
          },
          series: [
            {
              type: "pie",
              radius: [0, 100],
              center: ["50%", "50%"],
              roseType: "radius",
              data: pieData.sort(function (a, b) {
                return b.value - a.value;
              }),
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
              animationType: "scale",
              animationEasing: "elasticOut",
              animationDelay: function (idx) {
                return Math.random() * 200;
              },
              label: {
                position: "outer",
                alignTo: "edge",
                margin: 24,
                formatter: function (params) {
                  console.log("params", params);
                  const name = params.data.name;
                  const value = params.percent;
                  return name + "：" + value + "%\n";
                },
              },
            },
          ],
        };
        this.myChart2.setOption(option2);
      } else if (
        res.message === "成功" &&
        (JSON.stringify(res.data) === "{}" || !res.data)
      ) {
        this.$message.info("暂无企业营收分布信息");
        this.$set(this.graphList, 2, {
          title: "企业营收分布",
          ref: "graph2",
          width: "calc((100% - 48px) / 3)",
          paddingTop: "381px",
          dataSource: "上海市税务局",
          noData: true,
        });
      } else {
        this.$message.error(res.message);
      }
    },
    async queryEntTaxPayment() {
      const json = {
        corpName: this.paramsObj.corpName,
        year: this.dateValue1,
      };
      const res = await queryEntTaxPayment(json);
      if (res.message === "成功" && res.data) {
        const xAxis = [];
        const addedTax = [];
        const personIncomeTax = [];
        const entIncomeTax = [];
        const consumeTax = [];

        for (let i in res.data) {
          xAxis.push(i);
          const value = res.data[i];
          if (value) {
            addedTax.push(value.zzsY || 0);
            personIncomeTax.push(value.grsdsY || 0);
            entIncomeTax.push(value.qysdsY || 0);
            consumeTax.push(value.xfsY || 0);
          } else {
            addedTax.push(0);
            personIncomeTax.push(0);
            entIncomeTax.push(0);
            consumeTax.push(0);
          }
        }
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
            x2: 10,
            y2: 10,
            containLabel: true,
          },
          xAxis: [
            {
              type: "category",
              data: xAxis,
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
            },
          ],
          series: [
            {
              name: "增值税",
              type: "bar",
              stack: "tax",
              barWidth: "50%",
              emphasis: {
                focus: "series",
              },
              data: addedTax,
              color: this.lineColor[0],
            },
            {
              name: "个人所得税",
              type: "bar",
              stack: "tax",
              barWidth: "50%",
              emphasis: {
                focus: "series",
              },
              data: personIncomeTax,
              color: this.lineColor[1],
            },
            {
              name: "企业所得税",
              type: "bar",
              stack: "tax",
              barWidth: "50%",
              emphasis: {
                focus: "series",
              },
              data: entIncomeTax,
              color: this.lineColor[2],
            },
            {
              name: "消费税",
              type: "bar",
              stack: "tax",
              barWidth: "50%",
              emphasis: {
                focus: "series",
              },
              data: consumeTax,
              color: this.lineColor[3],
            },
          ],
        };
        this.myChart3 = this.$echarts.init(
          this.$refs.dataGraphs.$refs.graph3[0]
        );
        this.myChart3.setOption(option3);
        handleAddEchartsBackground(this.myChart3, option3, xAxis);
      } else if (res.message === "成功" && !res.data) {
        this.$message.info("暂无纳税金额分布信息");
        this.$set(this.graphList, 1, {
          title: "纳税金额分布",
          ref: "graph3",
          width: "calc((100% - 48px) / 3)",
          paddingTop: "381px",
          dataSource: "上海市税务局",
          noData: true,
        });
      } else {
        this.$message.error(res.message);
      }
    },
    async structureAnalyse() {
      const json = {
        corpName: this.paramsObj.corpName,
        startYear: this.dateValue2.length
          ? this.dateValue2[0].format("YYYY")
          : undefined,
        endYear: this.dateValue2.length
          ? this.dateValue2[1].format("YYYY")
          : undefined,
      };
      const res = await structureAnalyse(json);
      if (res.message === "成功" && res.data) {
        const graphData = {
          xAxis: [],
          data1: [],
          data2: [],
          data3: [],
          data4: [],
          data5: [],
          data6: [],
          data7: [],
          data8: [],
        };
        for (let i in res.data) {
          const value = res.data[i];
          graphData.xAxis.push(i);
          if (value && value.length) {
            value.map((item) => {
              graphData.data1.push(item.ssgm || 0);
              graphData.data2.push(item.dwcbrsY || 0);
              graphData.data3.push(item.zlsY || 0);
              graphData.data4.push(item.fmsjsY || 0);
              graphData.data5.push(item.yysrY || 0);
              graphData.data6.push(0); // 暂无资产数据
              graphData.data7.push(0); // 暂无资产数据
              graphData.data8.push(item.yylrY || 0);
            });
          } else {
            graphData.data1.push(0);
            graphData.data2.push(0);
            graphData.data3.push(0);
            graphData.data4.push(0);
            graphData.data5.push(0);
            graphData.data6.push(0); // 暂无资产数据
            graphData.data7.push(0); // 暂无资产数据
            graphData.data8.push(0);
          }
        }
        this.graphData = graphData;
        this.init();
      } else if (res.message === "成功" && !res.data) {
        this.$message.info("暂无集团数据变化趋势信息");
      } else {
        this.$message.error(res.message);
      }
    },
    onPanelChange(value) {
      this.dateValue2 = value;
    },
    onDataChange(date) {
      this.dateValue2 = date;
    },
    onRadioChange(e) {
      // this.dateValue1 = e.target.value;
      if (this.myChart1) this.myChart1.clear();
      if (this.myChart2) this.myChart2.clear();
      if (this.myChart3) this.myChart3.clear();
      if (this.radioValue === "1") {
        this.queryEntDataByYear();
        this.queryEntCountDistribute();
        this.queryEntYysryDistribute();
        this.queryEntTaxPayment();
        this.structureAnalyse();
      } else {
        this.queryChildEntDataByYear();
        this.queryChildEntDataByYears();
        this.queryEntCountDistribute();
        this.queryEntYysryDistribute();
        this.queryEntTaxPayment();
      }
    },
    handleCheckItem(index) {
      const target = this.targetList[index];
      if (target.value === 6 || target.value === 7) {
        //净资产和总资产不可选
        return;
      }
      target.isSelected = !target.isSelected;
      this.targetValue = this.targetList
        .filter((item) => {
          if (item.isSelected) {
            return item;
          }
        })
        .map((item) => item.value);
      this.init();
    },
    radioChange(e) {
      this.radioValue = e.target.value;
      if (this.myChart1) this.myChart1.clear();
      if (this.myChart2) this.myChart2.clear();
      if (this.myChart3) this.myChart3.clear();
      if (this.radioValue === "1") {
        this.queryEntDataByYear();
        this.queryEntCountDistribute();
        this.queryEntYysryDistribute();
        this.queryEntTaxPayment();
        this.structureAnalyse();
        this.queryEntLevelCount();
      } else {
        this.queryChildEntLevelCount();
        this.queryChildEntDataByYear();
        this.queryChildEntDataByYears();
        this.queryEntCountDistribute();
        this.queryEntYysryDistribute();
        this.queryEntTaxPayment();
      }
    },
    async queryChildEntLevelCount() {
      const json = {
        corpName: this.paramsObj.corpName,
        year: this.dateValue1,
      };

      const res = await queryChildEntLevelCount(json);
      if (res.message === "成功" && res.data) {
        this.getLevelData(res.data);
      } else if (res.message === "成功" && !res.data) {
        this.$message.info("暂无企业架构信息");
      } else {
        this.$message.error(res.message);
      }
    },
    async queryChildEntDataByYear() {
      const json = {
        corpName: this.paramsObj.corpName,
        year: this.dateValue1,
      };

      const res = await queryChildEntDataByYear(json);
      if (res.message === "成功" && res.data) {
        this.taxMoney = res.data.ssgm || 0;
        this.personNum = res.data.dwcbrsY || 0;
        this.patentNum = res.data.zlsY || 0;
        this.negNum = res.data.fmsjsY || 0;
        this.income = res.data.yysrY || 0;
        this.realIncome = res.data.yylrY || 0;
        this.taxMoney = Number(
          this.taxMoney.toString().match(/^\d+(?:\.\d{0,2})?/)
        ).toLocaleString();
        this.personNum = Number(
          this.personNum.toString().match(/^\d+(?:\.\d{0,2})?/)
        ).toLocaleString();
        this.patentNum = Number(
          this.patentNum.toString().match(/^\d+(?:\.\d{0,2})?/)
        ).toLocaleString();
        this.negNum = Number(
          this.negNum.toString().match(/^\d+(?:\.\d{0,2})?/)
        ).toLocaleString();
        this.income = Number(
          this.income.toString().match(/^\d+(?:\.\d{0,2})?/)
        ).toLocaleString();
        this.realIncome = Number(
          this.realIncome.toString().match(/^\d+(?:\.\d{0,2})?/)
        ).toLocaleString();
      } else if (res.message === "成功" && !res.data) {
        this.$message.info("暂无子集团数据信息");
        this.taxMoney = 0;
        this.personNum = 0;
        this.patentNum = 0;
        this.negNum = 0;
        this.income = 0;
        this.realIncome = 0;
        this.taxMoney = 0;
        this.personNum = 0;
        this.patentNum = 0;
        this.negNum = 0;
        this.income = 0;
        this.realIncome = 0;
      } else {
        this.$message.error(res.message);
      }
    },
    async queryChildEntDataByYears() {
      const json = {
        corpName: this.paramsObj.corpName,
        years: ["2017", "2018", "2019", "2020", "2021"],
      };

      const res = await queryChildEntDataByYears(json);
      if (res.message === "成功" && res.data) {
        const graphData = {
          xAxis: [],
          data1: [],
          data2: [],
          data3: [],
          data4: [],
          data5: [],
          data6: [],
          data7: [],
          data8: [],
        };
        for (let i in res.data) {
          const value = res.data[i];
          console.log("value", value);
          graphData.xAxis.push(i);
          if (value) {
            graphData.data1.push(value.ssgm || 0);
            graphData.data2.push(value.dwcbrsY || 0);
            graphData.data3.push(value.zlsY || 0);
            graphData.data4.push(value.fmsjsY || 0);
            graphData.data5.push(value.yysrY || 0);
            graphData.data6.push(0); // 暂无资产数据
            graphData.data7.push(0); // 暂无资产数据
            graphData.data8.push(value.yylrY || 0);
          } else {
            graphData.data1.push(0);
            graphData.data2.push(0);
            graphData.data3.push(0);
            graphData.data4.push(0);
            graphData.data5.push(0);
            graphData.data6.push(0); // 暂无资产数据
            graphData.data7.push(0); // 暂无资产数据
            graphData.data8.push(0);
          }
        }
        this.graphData = graphData;
        console.log("graphData", graphData);
        this.init();
      } else if (res.message === "成功" && !res.data) {
        this.$message.info("暂无子集团数据变化趋势信息");
      } else {
        this.$message.error(res.message);
      }
    },
    // 弹出日历和关闭日历的回调
    openChangeYear(status) {
      if (status) {
        this.yearShow = true;
      }
    },
    // 得到年份选择器的值
    panelChangeYear(value) {
      console.log("value", value.format("YYYY"));
      this.dateValue1 = value.format("YYYY");
      this.yearShow = false;
      this.onRadioChange();
    },
  },
};
</script>
<style lang="less">
.group-portrait {
  width: 100%;
  padding: 0 24px;
  min-height: 100%;
  background: #fff;

  &-info {
    &-content {
      overflow: hidden;
      position: relative;
      height: 548px;
      padding: 24px 0;

      .info-center {
        width: 500px;
        height: 500px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: url("~@/assets/images/img/Ellipse-center.svg") no-repeat
          center;
        background-size: cover, 83%;
        -webkit-background-size: cover, 83%;
        -o-background-size: cover, 83%;

        &.class1 {
          background: url("~@/assets/images/img/Ellipse-center.svg") no-repeat
              center,
            url("~@/assets/images/img/pyramid1.svg") no-repeat center;
          background-size: cover, 83%;
          -webkit-background-size: cover, 83%;
          -o-background-size: cover, 83%;
          .info-center-content-item {
            &:first-child {
              top: 50%;

              span {
                width: 118px;
              }
            }
          }
        }
        &.class2 {
          background: url("~@/assets/images/img/Ellipse-center.svg") no-repeat
              center,
            url("~@/assets/images/img/pyramid2.svg") no-repeat center;
          background-size: cover, 83%;
          -webkit-background-size: cover, 83%;
          -o-background-size: cover, 83%;
          .info-center-content-item {
            &:first-child {
              top: 32%;

              span {
                width: 80px;
              }
            }

            &:nth-child(2) {
              top: 70%;

              span {
                width: 169px;
              }
            }
          }
        }
        &.class3 {
          background: url("~@/assets/images/img/Ellipse-center.svg") no-repeat
              center,
            url("~@/assets/images/img/pyramid3.svg") no-repeat center;
          background-size: cover, 83%;
          -webkit-background-size: cover, 83%;
          -o-background-size: cover, 83%;
          .info-center-content-item {
            &:first-child {
              top: 18%;

              span {
                width: 45px;
              }
            }

            &:nth-child(2) {
              top: 44%;

              span {
                width: 110px;
              }
            }

            &:nth-child(3) {
              top: 75%;

              span {
                width: 182px;
              }
            }
          }
        }
        &.class4 {
          background: url("~@/assets/images/img/Ellipse-center.svg") no-repeat
              center,
            url("~@/assets/images/img/pyramid4.svg") no-repeat center;
          background-size: cover, 83%;
          -webkit-background-size: cover, 83%;
          -o-background-size: cover, 83%;

          .info-center-content-item {
            &:first-child {
              top: 14%;

              span {
                width: 38px;
              }
            }

            &:nth-child(2) {
              top: 33%;

              span {
                width: 85px;
              }
            }

            &:nth-child(3) {
              top: 55%;

              span {
                width: 143px;
              }
            }

            &:nth-child(4) {
              top: 77%;

              span {
                width: 198px;
              }
            }
          }
        }
        &.class5 {
          background: url("~@/assets/images/img/Ellipse-center.svg") no-repeat
              center,
            url("~@/assets/images/img/pyramid5.svg") no-repeat center;
          background-size: cover, 83%;
          -webkit-background-size: cover, 83%;
          -o-background-size: cover, 83%;
          .info-center-content-item {
            &:first-child {
              top: 11%;

              span {
                width: 26px;
              }
            }
            &:nth-child(2) {
              top: 27%;

              span {
                width: 66px;
              }
            }

            &:nth-child(3) {
              top: 44%;

              span {
                width: 108px;
              }
            }

            &:nth-child(4) {
              top: 61%;

              span {
                width: 147px;
              }
            }
            &:nth-child(5) {
              top: 79%;

              span {
                width: 189px;
              }
            }
          }
        }
        &.class6 {
          background: url("~@/assets/images/img/Ellipse-center.svg") no-repeat
              center,
            url("~@/assets/images/img/pyramid6.svg") no-repeat center;
          background-size: cover, 83%;
          -webkit-background-size: cover, 83%;
          -o-background-size: cover, 83%;
          .info-center-content-item {
            &:first-child {
              top: 10%;

              span {
                width: 25px;
              }
            }

            &:nth-child(2) {
              top: 23%;

              span {
                width: 59px;
              }
            }

            &:nth-child(3) {
              top: 37%;

              span {
                width: 94px;
              }
            }

            &:nth-child(4) {
              top: 51%;

              span {
                width: 128px;
              }
            }
            &:nth-child(5) {
              top: 65%;

              span {
                width: 163px;
              }
            }
            &:nth-child(6) {
              top: 80%;

              span {
                width: 203px;
              }
            }
          }
        }
        &.class7 {
          background: url("~@/assets/images/img/Ellipse-center.svg") no-repeat
              center,
            url("~@/assets/images/img/pyramid7.svg") no-repeat center;
          background-size: cover, 83%;
          -webkit-background-size: cover, 83%;
          -o-background-size: cover, 83%;
          .info-center-content-item {
            &:first-child {
              top: 36px;

              span {
                width: 22px;
              }
            }

            &:nth-child(2) {
              top: 82px;

              span {
                width: 50px;
              }
            }

            &:nth-child(3) {
              top: 132px;

              span {
                width: 81px;
              }
            }

            &:nth-child(4) {
              top: 185px;

              span {
                width: 109px;
              }
            }
            &:nth-child(5) {
              top: 234px;

              span {
                width: 140px;
              }
            }
            &:nth-child(6) {
              top: 285px;

              span {
                width: 170px;
              }
            }
            &:nth-child(7) {
              top: 335px;

              span {
                width: 200px;
              }
            }
          }
        }
        &.class8 {
          background: url("~@/assets/images/img/Ellipse-center.svg") no-repeat
              center,
            url("~@/assets/images/img/pyramid8.svg") no-repeat center;
          background-size: cover, 83%;
          -webkit-background-size: cover, 83%;
          -o-background-size: cover, 83%;
          .info-center-content-item {
            &:first-child {
              top: 32px;

              span {
                width: 20px;
              }
            }

            &:nth-child(2) {
              top: 69px;

              span {
                width: 42px;
              }
            }

            &:nth-child(3) {
              top: 115px;

              span {
                width: 71px;
              }
            }

            &:nth-child(4) {
              top: 161px;

              span {
                width: 98px;
              }
            }
            &:nth-child(5) {
              top: 205px;

              span {
                width: 125px;
              }
            }
            &:nth-child(6) {
              top: 249px;

              span {
                width: 154px;
              }
            }
            &:nth-child(7) {
              top: 294px;

              span {
                width: 182px;
              }
            }
            &:nth-child(8) {
              top: 337px;

              span {
                width: 206px;
              }
            }
          }
        }

        &-content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: rgba(255, 255, 255, 0.7);
          width: 83%;
          height: 83%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          &-item {
            position: absolute;
            font-size: 12px;

            span {
              display: inline-block;
              text-align: center;

              &.item-level {
                transform: rotate(21deg);
              }

              &.item-num {
                transform: rotate(-21deg);
              }
            }
          }
        }
      }

      .info-left {
        height: 105.5px;
        position: absolute;
        width: 425px;

        &.left-first {
          top: 24px;
          left: calc(50% - 620px);
          background: url("~@/assets/images/img/Subtract-left-1.svg") no-repeat
            center;
          background-size: cover;
          -webkit-background-size: cover;
          -o-background-size: cover;
        }

        &.left-second {
          top: 155.5px;
          left: calc(50% - 717px);
          background: url("~@/assets/images/img/Subtract-left-2.svg") no-repeat
            center;
          background-size: cover;
          -webkit-background-size: cover;
          -o-background-size: cover;
        }

        &.left-third {
          top: 287px;
          left: calc(50% - 717px);
          background: url("~@/assets/images/img/Subtract-left-3.svg") no-repeat
            center;
          background-size: cover;
          -webkit-background-size: cover;
          -o-background-size: cover;
        }

        &.left-fourth {
          top: 418.5px;
          left: calc(50% - 620px);
          background: url("~@/assets/images/img/Subtract-left-4.svg") no-repeat
            center;
          background-size: cover;
          -webkit-background-size: cover;
          -o-background-size: cover;
        }

        &:nth-child(2),
        &:nth-child(5) {
          .info-content {
            padding-left: calc(50% - 205px);
          }
        }

        &:nth-child(3),
        &:nth-child(4) {
          .info-content {
            padding-left: calc(50% - 155px);
          }
        }

        .info-content {
          &-left {
            height: 100%;
            display: flex;
            width: 200px;
            text-align: right;
            flex-direction: column;
            justify-content: space-around;
          }

          &-right {
            height: 100%;
            padding-left: 8px;

            img {
              height: 100%;
            }
          }
        }
      }

      .info-right {
        height: 105.5px;
        position: absolute;
        width: 425px;
        display: flex;
        justify-content: flex-end;

        &.right-first {
          top: 24px;
          right: calc(50% - 620px);
          background: url("~@/assets/images/img/Subtract-right-1.svg") no-repeat
            center;
          background-size: cover;
          -webkit-background-size: cover;
          -o-background-size: cover;
        }

        &.right-second {
          top: 155.5px;
          right: calc(50% - 717px);
          background: url("~@/assets/images/img/Subtract-right-2.svg") no-repeat
            center;
          background-size: cover;
          -webkit-background-size: cover;
          -o-background-size: cover;
        }

        &.right-third {
          top: 287px;
          right: calc(50% - 717px);
          background: url("~@/assets/images/img/Subtract-right-3.svg") no-repeat
            center;
          background-size: cover;
          -webkit-background-size: cover;
          -o-background-size: cover;
        }

        &.right-fourth {
          top: 418.5px;
          right: calc(50% - 620px);
          background: url("~@/assets/images/img/Subtract-right-4.svg") no-repeat
            center;
          background-size: cover;
          -webkit-background-size: cover;
          -o-background-size: cover;
        }

        &:nth-child(6),
        &:nth-child(9) {
          .info-content {
            padding-right: calc(50% - 155px);
          }
        }

        &:nth-child(7),
        &:nth-child(8) {
          .info-content {
            padding-right: calc(50% - 100px);
          }
        }

        .info-content {
          &-left {
            height: 100%;
            padding-right: 8px;

            img {
              height: 100%;
            }
          }

          &-right {
            height: 100%;
            display: flex;
            width: 145px;
            text-align: left;
            flex-direction: column;
            justify-content: space-around;
          }
        }
      }

      .info-content {
        position: absolute;
        display: flex;
        align-items: center;
        top: 50%;
        transform: translateY(-50%);
        height: 80%;

        .content-title {
          font-size: 20px;
          font-weight: 600;
          line-height: 16px;
          color: @primaryTextColor;
        }

        .content-money {
          height: 22px;
          color: @activeFontColor;

          &-num {
            font-size: 20px;
            font-weight: 600;
          }

          &-unit {
            font-size: 14px;
          }
        }

        .content-ratio {
          font-size: 12px;
          line-height: 16px;
          color: @secondaryTextColor;

          &-img {
            img {
              height: 12px;
            }
          }
        }
      }
    }
  }

  &-child,
  &-change {
    position: relative;
    padding-bottom: 16px;

    &-content {
      transition: all 0.3s;
    }
  }

  .options-content {
    position: relative;

    &-item {
      overflow: hidden;
      display: flex;
      align-items: center;
      margin-bottom: 16px;

      .item-label {
        width: 65px;
        text-align: right;
        margin-right: 16px;
        color: @primaryTextColor;
        float: left;
        line-height: 24px;

        &.disabled {
          color: @disabledColor;
        }
      }

      .item-content {
        width: calc(100% - 81px);
        float: left;

        .ant-radio-group {
          .ant-radio-button-wrapper {
            color: @primaryTextColor;
            border: 1px solid @borderColor;
            border-radius: 16px;
            margin-right: 16px;
            padding: 0 14px;
            height: 24px;
            line-height: 22px;

            &.ant-radio-button-wrapper-checked {
              color: @activeFontColor;
              border-color: @blue;
              background: rgba(1, 110, 255, 0.1);
            }

            &:not(:first-child)::before {
              content: none;
            }

            &.ant-radio-button-wrapper-disabled {
              color: @disabledColor;
              border-color: #d9d9d9;
              background-color: #f5f5f5;
            }
          }
        }

        .ant-checkbox-wrapper {
          margin-top: 2px;
          margin-right: 8px;
          margin-bottom: 16px;
          color: @primaryTextColor;

          .ant-checkbox {
            margin-top: 2px;
          }
        }

        &-input {
          width: 300px;
        }

        .check-box {
          display: flex;
          align-items: center;

          .check-item {
            height: 24px;
            cursor: pointer;
            padding: 0 14px;
            line-height: 24px;
            border-radius: 12px;
            color: @primaryTextColor;
            border: 1px solid @borderColor;

            &.active {
              color: @activeFontColor;
              border-color: @activeFontColor;
              background-color: rgba(1, 110, 255, 0.1);
            }

            &:not(:last-child) {
              margin-right: 16px;
            }
          }
        }
      }
    }

    &-radio {
      right: 0;
      top: -5px;
      position: absolute;

      .ant-radio-group {
        .ant-radio-button-wrapper {
          color: @secondaryTextColor;

          &.ant-radio-button-wrapper-checked {
            color: @blue;
            border-color: @blue;
            background: #cce2ff;
          }
        }
      }
    }
  }
}
</style>
