<template>
  <div class="public-info">
    <div class="business-table-item">
      <div class="sub-title">特征列表</div>
      <a-button class="business-table-btn" @click="handleChangebtn(1)">
        <!-- {{ foldValue1 ? "收起" : "展开" }} -->
        <a-icon :type="foldValue1 ? 'up' : 'down'" />
      </a-button>
      <feature-table :dataList="dataList" :foldValue="foldValue1" :type="8" />
    </div>
    <div class="business-table-item">
      <div class="sub-title">舆情概览</div>
      <a-button class="business-table-btn" @click="handleChangebtn(2)">
        <!-- {{ foldValue2 ? "收起" : "展开" }} -->
        <a-icon :type="foldValue2 ? 'up' : 'down'" />
      </a-button>
      <div
        :class="
          foldValue2 ? 'business-table-content' : 'business-table-content fold'
        "
      >
        <div class="options-content">
          <div class="options-content-item">
            <label class="item-label">对象:</label>
            <div class="item-content">
              <a-radio-group
                default-value="0"
                button-style="solid"
                v-model="objValue"
              >
                <a-radio-button value="0"> 企业 </a-radio-button>
                <a-radio-button value="1"> 集团系 </a-radio-button>
              </a-radio-group>
            </div>
          </div>
          <div class="options-content-item">
            <label class="item-label">时间跨度:</label>
            <div class="item-content">
              <a-range-picker
                v-model="startStopTime"
                format="YYYY-MM-DD"
                valueFormat="YYYY-MM-DD"
                class="filter-right"
              >
                <template slot="suffixIcon">
                  <a-icon type="calendar" />
                </template>
              </a-range-picker>
            </div>
          </div>
        </div>
        <div class="search-btns">
          <a-button
            class="search-btn"
            type="primary"
            @click="handleSearch"
            icon="search"
            >查询</a-button
          >
          <a-button class="search-btn" @click="reset">重置</a-button>
        </div>
        <data-graphs ref="dataGraphs" :list="graphList" />
      </div>
    </div>
    <div class="business-table-item">
      <a-tabs :active-key="activeKey" @change="onKeychange">
        <a-tab-pane :key="1" tab="舆情预警">
          <div class="business-table-item-box">
            <DetailTable
              tableTitle="特征列表"
              :foldValue="foldValue3"
              :columns="columns"
              :infoData="infoData"
              :pagination="pagination"
              tableClass="features-table2"
              :loading="tableLoading"
              @handleChangebtn="handleChangebtn(3)"
            >
              <div slot="searchOption" v-show="activeKey === 1">
                <div class="business-options">
                  <div class="business-options-item">
                    <label class="item-label">舆情搜索：</label>
                    <div class="item-content">
                      <a-input
                        type="text"
                        allow-clear
                        class="item-content-input"
                        placeholder="关键词"
                        v-model="searchInput"
                      />
                    </div>
                  </div>
                  <div class="business-options-item">
                    <label class="item-label">企业性质：</label>
                    <div class="item-content">
                      <a-select
                        allow-clear
                        :options="entNatureOptions"
                        class="item-content-input"
                        placeholder="请选择"
                        v-model="entNature"
                      />
                    </div>
                  </div>
                  <div class="business-options-item">
                    <label class="item-label">舆情类型：</label>
                    <div class="item-content">
                      <a-select
                        allow-clear
                        :options="infoTypeOptions"
                        class="item-content-input"
                        placeholder="请选择"
                        v-model="infoType"
                      />
                    </div>
                  </div>
                </div>
                <div class="business-options">
                  <div class="business-options-item">
                    <label class="item-label">情绪类型：</label>
                    <div class="item-content">
                      <a-select
                        allow-clear
                        :options="emoTypeOptions"
                        class="item-content-input"
                        placeholder="请选择"
                        v-model="emoType"
                      />
                    </div>
                  </div>
                  <div class="business-options-item"></div>
                  <div class="business-options-item">
                    <div class="item-buttons">
                      <a-button class="button-left" @click="reset2"
                        >重置</a-button
                      >
                      <a-button
                        type="primary"
                        class="button-right"
                        icon="search"
                        @click="handleSearch2"
                        >查询</a-button
                      >
                    </div>
                  </div>
                </div>
              </div>
            </DetailTable>
          </div>
        </a-tab-pane>
        <a-tab-pane :key="2" tab="事件预警"> Content of Tab Pane 2 </a-tab-pane>
        <a-tab-pane :key="3" tab="违规处罚"> Content of Tab Pane 3 </a-tab-pane>
        <a-tab-pane :key="4" tab="裁判文书"> Content of Tab Pane 4 </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script>
import DataGraphs from "../components/dataGraphs";
import DetailTable from "../components/detailTable";
import FeatureTable from "../components/featureTable";
import { Button, DatePicker, Icon, Input, Radio, Tabs } from "ant-design-vue";
import { scrollToBottom } from "@/utils/common.js";
import {
  color1,
  color2,
  color3,
  color4,
  color5,
  color6,
  color7,
  color8,
  color9,
} from "@/assets/theme/model.js";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

export default {
  name: "publicInfo",
  data() {
    return {
      foldValue1: true,
      foldValue2: true,
      foldValue3: true,
      foldValue4: true,
      columns: [
        {
          title: "序号",
          dataIndex: "index",
          key: "index",
          width: 62,
        },
        {
          title: "发生时间",
          dataIndex: "createTime",
          key: "createTime",
          width: 100,
        },
        {
          title: "舆情标题",
          dataIndex: "infoTitle",
          key: "infoTitle",
          width: 180,
        },
        {
          title: "企业标题",
          dataIndex: "entTitle",
          key: "entTitle",
          width: 160,
        },
        {
          title: "证券名称",
          dataIndex: "negoName",
          key: "negoName",
          width: 160,
        },
        {
          title: "舆情类型",
          dataIndex: "infoType",
          key: "infoType",
          width: 120,
          scopedSlots: { customRender: "infoType" },
        },
        {
          title: "情绪类型",
          dataIndex: "emoType",
          key: "emoType",
          width: 100,
          scopedSlots: { customRender: "emoType" },
        },
        {
          title: "来源",
          dataIndex: "source",
          key: "source",
          width: 120,
          scopedSlots: { customRender: "source" },
        },
        {
          title: "操作",
          dataIndex: "actions",
          key: "actions",
          width: 120,
          scopedSlots: { customRender: "actions" },
        },
      ],
      infoData: [
        {
          index: 1,
          createTime: "12:00:00",
          infoTitle: "习近平同东帝汶总统互致贺电  再生生保系统",
          entTitle: "腾讯控股有限公司",
          negoName: "桃李面包（603866.SH）",
          infoType: {
            level: "中",
            type: "生产产能",
          },
          emoType: "中性",
          source: "百家号",
        },
        {
          index: 2,
          createTime: "12:00:00",
          infoTitle: "习近平同东帝汶总统互致贺电  再生生保系统",
          entTitle: "腾讯控股有限公司",
          negoName: "桃李面包（603866.SH）",
          infoType: {
            level: "高",
            type: "生产产能",
          },
          emoType: "正面",
          source: "百家号",
        },
        {
          index: 3,
          createTime: "12:00:00",
          infoTitle: "习近平同东帝汶总统互致贺电  再生生保系统",
          entTitle: "腾讯控股有限公司",
          negoName: "桃李面包（603866.SH）",
          infoType: {
            level: "低",
            type: "生产产能",
          },
          emoType: "负面",
          source: "百家号",
        },
      ],
      dataList: [],
      pagination: {
        size: "small",
        total: 0,
        current: 1,
        pageSize: 15,
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
      objValue: "0",
      startStopTime: undefined,
      graphList: [
        {
          title: "舆情信息趋势",
          ref: "graph1",
          width: "calc((100% - 24px) / 2)",
          paddingTop: "435px",
        },
        {
          title: "舆情词云图",
          ref: "graph2",
          width: "calc((100% - 24px) / 2)",
          paddingTop: "435px",
        },
        {
          title: "舆情分类占比",
          ref: "graph3",
          width: "calc((100% - 24px) / 2)",
          paddingTop: "435px",
        },
        {
          title: "舆情重要性占比",
          ref: "graph4",
          width: "calc((100% - 24px) / 2)",
          paddingTop: "435px",
        },
      ],
      myChart1: null,
      myChart2: null,
      myChart3: null,
      myChart4: null,
      activeKey: 1,
      searchInput: undefined,
      entNatureOptions: [
        {
          value: "0",
          label: "全部",
        },
      ],
      entNature: "0",
      infoTypeOptions: [
        {
          value: "0",
          label: "全部",
        },
      ],
      infoType: "0",
      emoTypeOptions: [
        {
          value: "0",
          label: "全部",
        },
      ],
      emoType: "0",
      tableLoading: false,
    };
  },
  components: {
    AButton: Button,
    AIcon: Icon,
    AInput: Input,
    ARadioButton: RadioButton,
    ARadioGroup: RadioGroup,
    ARangePicker: RangePicker,
    ATabPane: TabPane,
    ATabs: Tabs,
    DataGraphs,
    DetailTable,
    FeatureTable,
  },
  mounted() {
    setTimeout(() => {
      this.init();
    }, 0);
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
    reset() {
      this.objValue = "0";
      this.startStopTime = undefined;
      this.handleSearch();
    },
    handleSearch() {
      console.log("handleSearch");
    },
    reset2() {
      this.searchInput = undefined;
      this.entNature = undefined;
      this.infoType = undefined;
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
      this.myChart4 = this.$echarts.init(this.$refs.dataGraphs.$refs.graph4[0]);
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
            data: ["2017", "2018", "2019", "2020", "2021"],
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
            name: "条",
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
            name: "类型一",
            type: "bar",
            barWidth: "30%",
            seriesLayoutBy: "row",
            symbol: "none",
            smooth: true,
            tooltip: {
              valueFormatter: function (value) {
                return value + " 人";
              },
            },
            data: [2.6, 5.9, 9.0, 26.4, 28.7],
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: "#30F2CB" },
                { offset: 0.6, color: "#ACFAEA" },
                { offset: 1, color: "#30F2CB" },
              ]),
            },
          },
          {
            name: "类型二",
            type: "line",
            tooltip: {
              valueFormatter: function (value) {
                return value + " %";
              },
            },
            data: [2.0, 2.2, 3.3, 4.5, 6.3],
            lineStyle: {
              color: "#298DFF",
            },
          },
          {
            name: "",
            barGap: "-100%",
            type: "bar",
            z: -1, // 控制层级，类似于z-index
            data: [30, 30, 30, 30, 30],
            yAxisIndex: 0,
            xAxisIndex: 1,
            barWidth: "96%",
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#EBF2F8" },
                { offset: 1, color: "#fff" },
              ]),
            },
          },
        ],
      };
      this.myChart1.setOption(option1);

      const option2 = {
        tooltip: {
          show: true,
          borderColor: "#fe9a8bb3",
          borderWidth: 1,
          padding: [10, 15, 10, 15],
          confine: true,
          backgroundColor: "rgba(255, 255, 255, .9)",
          textStyle: {
            color: "hotpink",
            lineHeight: 22,
          },
          extraCssText:
            "box-shadow: 0 4px 20px -4px rgba(199, 206, 215, .7);border-radius: 4px;",
        },
        series: [
          {
            type: "wordCloud",
            // The shape of the "cloud" to draw. Can be any polar equation represented as a
            // callback function, or a keyword present. Available presents are circle (default),
            // cardioid (apple or heart shape curve, the most known polar equation), diamond (
            // alias of square), triangle-forward, triangle, (alias of triangle-upright, pentagon, and star.

            shape: "pentagon",

            // A silhouette image which the white area will be excluded from drawing texts.
            // The shape option will continue to apply as the shape of the cloud to grow.

            // Folllowing left/top/width/height/right/bottom are used for positioning the word cloud
            // Default to be put in the center and has 75% x 80% size.

            left: "center",
            top: "center",
            width: "100%",
            height: "100%",
            right: null,
            bottom: null,

            // Text size range which the value in data will be mapped to.
            // Default to have minimum 12px and maximum 60px size.

            sizeRange: [14, 50],

            // Text rotation range and step in degree. Text will be rotated randomly in range [-90, 90] by rotationStep 45

            rotationRange: [0, 0],
            rotationStep: 0,

            // size of the grid in pixels for marking the availability of the canvas
            // the larger the grid size, the bigger the gap between words.

            gridSize: 25,

            // set to true to allow word being draw partly outside of the canvas.
            // Allow word bigger than the size of the canvas to be drawn
            drawOutOfBound: false,

            // If perform layout animation.
            // NOTE disable it will lead to UI blocking when there is lots of words.
            layoutAnimation: true,

            // Global text style
            textStyle: {
              fontFamily: "PingFangSC-Semibold",
              fontWeight: 600,
              color: function (params) {
                let colors = [
                  "#fe9a8bb3",
                  "#fe9a8bb3",
                  "#fe9a8b03",
                  "#9E87FFb3",
                  "#9E87FFb3",
                  "#9E87FFb3",
                  "#fe9a8bb3",
                  "#fe9a8bb3",
                  "#fe9a8bb3",
                  "#73DDFF",
                  "#58D5FF",
                ];
                return colors[parseInt(Math.random() * 10)];
              },
            },
            emphasis: {
              focus: "none",
            },

            // Data is an array. Each array item must have name and value property.
            data: [
              { value: "30", name: "VIVO" },
              { value: "29", name: "OPPO" },
              { value: "28", name: "HONOR" },
              { value: "27", name: "红米" },
              { value: "26", name: "小米" },
              { value: "25", name: "美图" },
              { value: "24", name: "ONEPLUS" },
              { value: "23", name: "魅族" },
              { value: "22", name: "红手指" },
              { value: "21", name: "SAMSUNG" },
              { value: "20", name: "金立" },
              { value: "16", name: "BLACKBERRY" },
              { value: "15", name: "诺基亚" },
              { value: "14", name: "锤子" },
              { value: "13", name: "大疆" },
              { value: "12", name: "361" },
              { value: "11", name: "摩托罗拉" },
              { value: "10", name: "联想" },
              { value: "9", name: "玩家国度" },
            ],
          },
        ],
      };
      this.myChart2.setOption(option2);

      const option3 = {
        series: [
          {
            name: "Nightingale Chart",
            type: "pie",
            radius: [0, 100],
            center: ["50%", "50%"],
            roseType: "radius",
            data: [
              { value: 40, name: "rose 1" },
              { value: 38, name: "rose 2" },
              { value: 32, name: "rose 3" },
              { value: 30, name: "rose 4" },
              { value: 28, name: "rose 5" },
              { value: 26, name: "rose 6" },
              { value: 22, name: "rose 7" },
              { value: 18, name: "rose 8" },
            ],
            color: [
              color1,
              color2,
              color3,
              color4,
              color5,
              color6,
              color7,
              color8,
              color9,
            ],
            animationType: "scale",
            animationEasing: "elasticOut",
            animationDelay: function (idx) {
              return Math.random() * 200;
            },
          },
        ],
      };
      this.myChart3.setOption(option3);
      this.myChart4.setOption(option3);
    },
    onKeychange(activeKey) {
      this.activeKey = activeKey;
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
  },
};
</script>
<style lang="less">
.public-info {
  .business-table-save {
    top: 48px;
  }
  .options-content {
    margin-bottom: 16px;

    &-item {
      overflow: hidden;

      .item-label {
        width: 60px;
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
        width: calc(100% - 76px);
        float: left;

        .ant-radio-group {
          .ant-radio-button-wrapper {
            color: @primaryTextColor;
            border: 1px solid @borderColor;
            border-radius: 16px;
            margin-right: 16px;
            padding: 0 14px;
            margin-bottom: 16px;
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

        &-input {
          width: 300px;
          margin-bottom: 16px;
        }
      }
    }
  }

  .business-table {
    &-item {
      .search-btns {
        display: flex;
        margin-bottom: 24px;
        justify-content: flex-end;

        .search-btn {
          &:not(:last-child) {
            margin-right: 12px;
          }
        }
      }

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

      .search-option {
        display: flex;
        flex-wrap: wrap;
        padding-right: 5px;
        justify-content: space-between;

        &-item {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
          width: calc((100% - 32px) / 3);

          &:not(:nth-child(3n)) {
            margin-right: 16px;
          }

          &:nth-child(3n-1) {
            justify-content: center;
          }

          &:nth-child(3n) {
            justify-content: flex-end;
          }

          .item-title {
            width: 75px;
            font-weight: 600;
            margin-right: 5px;
            color: @primaryTextColor;
          }

          .item-box {
            max-width: 200px;
            width: calc(100% - 80px);
            color: @primaryTextColor;

            &-input {
              width: 100%;
            }

            &-btn {
              &:not(:last-child) {
                margin-right: 12px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
