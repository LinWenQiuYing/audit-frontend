<template>
  <div class="administrative-licensing">
    <div class="business-table-item">
      <div class="sub-title">特征列表</div>
      <a-button class="business-table-btn" @click="handleChangebtn(1)">
        <!-- {{ foldValue1 ? "收起" : "展开" }} -->
        <a-icon :type="foldValue1 ? 'up' : 'down'" />
      </a-button>
      <div></div>
      <feature-table :dataList="dataList" :foldValue="foldValue1" :type="4" />
    </div>
    <div class="business-table-item">
      <div class="sub-title">行政许可分析</div>
      <a-button class="business-table-btn" @click="handleChangebtn(2)">
        <!-- {{ foldValue2 ? "收起" : "展开" }} -->
        <a-icon :type="foldValue2 ? 'up' : 'down'" />
      </a-button>
      <div
        :class="
          foldValue2 ? 'business-table-content' : 'business-table-content fold'
        "
      >
        <div class="business-table-item-content">
          <div class="business-table-item-content-left">
            <a-select
              mode="multiple"
              class="item-content-select"
              placeholder="请选择类型"
              v-model="typeValue"
              @change="handleChange"
            >
              <a-select-option
                v-for="item in typeOptions"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
            <a-button type="primary" class="item-content-btn" @click="handleAdd"
              >添加</a-button
            >
            <p class="item-content-text">
              （最多可添加<span class="item-content-text-blue">10</span
              >个类型在图表中展示）
            </p>
          </div>

          <div class="business-table-item-selected">
            <div
              v-for="(item, index) in typeValueCopy"
              :key="item"
              class="selected-item"
            >
              <span class="selected-item-text">{{ item }}</span>
              <a-icon type="close" @click="handleDelete(index)" />
            </div>
          </div>
        </div>

        <data-graphs ref="dataGraphs" :list="graphList" />
      </div>
    </div>
    <div class="business-table-item">
      <DetailTable
        tableTitle="资质许可明细"
        :foldValue="foldValue3"
        :columns="columns"
        :infoData="infoData"
        :pagination="pagination"
        tableClass="features-table2"
        :loading="tableLoading"
        :infoQuery="infoQuery"
        @handleChangebtn="handleChangebtn(3)"
      >
        <div slot="searchOption">
          <div class="business-options">
            <div class="business-options-item">
              <label class="item-label">资质类型：</label>
              <div class="item-content">
                <a-select
                  allow-clear
                  :options="qualiOptions"
                  class="item-content-input"
                  placeholder="请选择"
                  v-model="qualiValue"
                />
              </div>
            </div>
            <div class="business-options-item">
              <label class="item-label">资质状态：</label>
              <div class="item-content">
                <a-select
                  allow-clear
                  :options="statusOptions"
                  class="item-content-input"
                  placeholder="请选择"
                  v-model="statusValue"
                />
              </div>
            </div>
            <div class="business-options-item">
              <label class="item-label second-type">有效期起始日期：</label>
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
          </div>
          <div class="business-options">
            <div class="business-options-item"></div>
            <div class="business-options-item"></div>
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
      </DetailTable>
    </div>
  </div>
</template>
<script>
import DataGraphs from "../components/dataGraphs";
import DetailTable from "../components/detailTable";
import FeatureTable from "../components/featureTable";
import { Button, DatePicker, Icon } from "ant-design-vue";
import { union, uniqWith, isEqual } from "lodash";
import { scrollToBottom } from "@/utils/common.js";
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
import { mapState } from "vuex";
import {
  queryAgenciesGivenLicence,
  queryLicensingStatics,
  adminLicDetailQuery,
  adminLicTabQuery,
} from "@/shared/api/auditMode.js";
import { handleAddEchartsBackground } from "@/utils/echarts.js";

const { RangePicker } = DatePicker;

export default {
  name: "AdministrativeLicensing",
  data() {
    return {
      dataList: [],
      typeValue: undefined,
      typeOptions: [],
      typeValueCopy: [],
      isOpen: false,
      graphList: [
        {
          title: "行政许可分析",
          ref: "graph1",
          width: "100%",
          paddingTop: "484px",
        },
      ],
      columns: [
        {
          title: "序号",
          dataIndex: "index",
          key: "index",
          width: 62,
        },
        {
          title: "证照编号",
          dataIndex: "number",
          key: "number",
          width: 200,
        },
        {
          title: "资质类型",
          dataIndex: "type",
          key: "type",
          width: 120,
        },
        {
          title: "资质名称",
          dataIndex: "name",
          key: "name",
          width: 150,
        },
        {
          title: "资质有效期起始日期",
          dataIndex: "startTime",
          key: "startTime",
          width: 180,
        },
        {
          title: "颁布单位",
          dataIndex: "corpName",
          key: "corpName",
          width: 150,
        },
        {
          title: "资质状态",
          dataIndex: "isValid",
          key: "isValid",
          width: 120,
          scopedSlots: { customRender: "isValid" },
        },
        // {
        //   title: "来源单位",
        //   dataIndex: "sourceName",
        //   key: "sourceName",
        //   width: 62,
        // },
        {
          title: "资质有效期截止日期",
          dataIndex: "endTime",
          key: "endTime",
          width: 180,
        },
      ],
      infoData: [],
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
          this.adminLicDetailQuery("repeat");
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = 1;
          this.pagination.pageSize = size;
          this.adminLicDetailQuery("repeat");
        },
      },
      foldValue1: true,
      foldValue2: true,
      foldValue3: true,
      graphData: {
        xAxis: [],
      },
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
      startStopTime: [],
      infoQuery: {},
      qualiOptions: [],
      qualiValue: undefined,
      statusOptions: [
        // { value: "有效", label: "有效" },
        // { value: "过期", label: "过期" },
        // { value: "撤销", label: "撤销" },
        // { value: "注销", label: "注销" },
        // { value: "吊销", label: "吊销" },
        // { value: "其他失效情况", label: "其他失效情况" },
      ],
      statusValue: undefined,
      tableLoading: false,
    };
  },
  components: {
    AButton: Button,
    AIcon: Icon,
    ARangePicker: RangePicker,
    DataGraphs,
    DetailTable,
    FeatureTable,
  },
  computed: {
    ...mapState("auditOptions", ["paramsObj"]),
  },
  async mounted() {
    await this.queryAgenciesGivenLicence();
    this.queryLicensingStatics();
    this.adminLicTabQuery();
    this.adminLicDetailQuery("init");
    const f = () => {
      this.myChart.resize();
    };
    window.addEventListener("resize", f);
  },
  beforeDestroy() {
    this.myChart.clear();
    const f = () => {
      this.myChart.resize();
    };
    window.removeEventListener("resize", f);
  },
  methods: {
    init() {
      this.myChart = this.$echarts.init(this.$refs.dataGraphs.$refs.graph1[0]);
      // 右下左上
      const option = {
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
          // data: union(["资质", "许可", "备案", "奖励"], this.typeValueCopy),
          data: union(["资质", "许可", "备案"], this.typeValueCopy),
        },
        grid: {
          x: 40,
          y: 70,
          x2: 70,
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
            name: "行政许可数量/件",
            minInterval: 1,
            splitLine: {
              lineStyle: {
                type: "dashed",
              },
            },
          },
          // {
          //   type: "value",
          //   name: "委办局来源数量/件",
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
        ],
        // 折线是来源委办，柱子改成许可类型: 资质qualification、许可permit、备案onRecord、奖励reward
        series: union(
          [
            {
              name: "资质",
              type: "bar",
              barWidth: "18%",
              tooltip: {
                valueFormatter: function (value) {
                  return value + " 个";
                },
              },
              data: this.graphData.qualifiData,
              itemStyle: {
                color: this.lineColor[0],
              },
            },
            {
              name: "许可",
              type: "bar",
              barWidth: "18%",
              tooltip: {
                valueFormatter: function (value) {
                  return value + " 个";
                },
              },
              data: this.graphData.permitData,
              itemStyle: {
                color: this.lineColor[1],
              },
            },
            {
              name: "备案",
              type: "bar",
              barWidth: "18%",
              tooltip: {
                valueFormatter: function (value) {
                  return value + " 个";
                },
              },
              data: this.graphData.onRecordData,
              itemStyle: {
                color: this.lineColor[2],
              },
            },
            // {
            //   name: "奖励",
            //   type: "bar",
            //   barWidth: "18%",
            //   tooltip: {
            //     valueFormatter: function (value) {
            //       return value + " 个";
            //     },
            //   },
            //   data: this.graphData.rewardData,
            //   itemStyle: {
            //     color: this.lineColor[3],
            //   },
            // },
          ],
          this.typeValueCopy.map((v, index) => {
            return {
              name: v,
              type: "line",
              tooltip: {
                valueFormatter: function (value) {
                  return value + " 个";
                },
              },
              label: {
                position: "top",
                show: true,
              },
              color: this.lineColor[index + 4],
              data: this.graphData[v],
            };
          })
        ),
      };
      // charts.setOption(option, notMerge, lazyUpdate)，setOption有三个属性，notMerge默认为false，即默认合并数据，设置为true不会合并数据从而实时刷新图表
      this.myChart.setOption(option, true);
      handleAddEchartsBackground(this.myChart, option, this.graphData.xAxis);
    },
    handleChange(value) {
      if (value.length > 10) {
        this.$message.destroy();
        this.$message.warning("最多可添加10个类型！");
        value.splice(10, 1);
      }
      this.typeValue = value;
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
    reset() {
      this.startStopTime = [];
      this.qualiValue = undefined;
      this.handleSearch();
    },
    handleSearch() {
      this.adminLicDetailQuery("init");
    },
    handleAdd() {
      this.typeValueCopy = this.typeValue;
      this.typeValue = [];
      this.queryLicensingStatics();
    },
    handleDelete(index) {
      this.typeValueCopy.splice(index, 1);
      this.queryLicensingStatics();
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
    async queryAgenciesGivenLicence() {
      const json = {
        corpName: this.paramsObj.corpName,
      };
      const res = await queryAgenciesGivenLicence(json);
      const typeOptions = [];
      if (res.message === "成功" && res.data && res.data.length) {
        res.data.map((v) => {
          typeOptions.push({
            value: v,
            label: v,
          });
        });
        this.typeOptions = typeOptions;
        this.typeValueCopy = typeOptions.slice(0, 10).map((item) => item.value);
      } else if (res.data && !res.data.length) {
        this.$message.info("暂无行政许可来源机构");
      } else {
        this.$message.error("获取行政许可来源机构失败！");
      }
    },
    async queryLicensingStatics() {
      const json = {
        corpName: this.paramsObj.corpName,
        agenciesGivenLicence: this.typeValueCopy,
      };
      const loading = this.$message.loading("正在查询", 0);
      const res = await queryLicensingStatics(json);
      loading();
      if (res.message === "成功" && res.data && res.data.length) {
        const graphData = {
          xAxis: [],
          qualifiData: [],
          permitData: [],
          onRecordData: [],
          rewardData: [],
        };
        this.typeValueCopy.map((v) => {
          graphData[v] = [];
        });
        res.data.map((item) => {
          graphData.xAxis.push(item.nf);
          if (item.licenseNumFromAgent) {
            for (let i in item.licenseNumFromAgent) {
              const value = item.licenseNumFromAgent[i] || 0;
              graphData[i].push(value);
            }
          }
          graphData.qualifiData.push(item.licenseNumDiffType.qualification);
          graphData.permitData.push(item.licenseNumDiffType.permit);
          graphData.onRecordData.push(item.licenseNumDiffType.onRecord);
          graphData.rewardData.push(item.licenseNumDiffType.reward);
        });
        this.graphData = graphData;
      } else if (res.data && !res.data.length) {
        this.$message.info("暂无行政许分析信息");
      } else {
        this.$message.error("获取行政许可分析信息失败！");
      }
      this.init();
    },
    async adminLicDetailQuery(type) {
      if (type === "init") {
        this.$set(this.pagination, "current", 1);
      }

      const json = {
        corpName: this.paramsObj.corpName,
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
        startYear: this.startStopTime.length
          ? this.startStopTime[0].format("YYYY")
          : undefined,
        endYear: this.startStopTime.length
          ? this.startStopTime[1].format("YYYY")
          : undefined,
        licenseType: this.qualiValue,
        licenseStatus: this.statusValue,
      };

      this.infoQuery = json;
      this.tableLoading = true;
      const res = await adminLicDetailQuery(json);
      this.tableLoading = false;
      if (res.message === "成功" && res.data.dateList.length) {
        this.infoData = res.data.dateList.map((item, index) => {
          item.startDate = /\d{4}-\d{1,2}-\d{1,2}/g.exec(item.startDate);
          item.endDate = /\d{4}-\d{1,2}-\d{1,2}/g.exec(item.endDate);
          return {
            index: index + 1,
            number: item.licenseCode || "--",
            type: item.licenseType || "--",
            name: item.licenseName || "--",
            startTime: item.startDate || "--",
            corpName: item.issueOrgan || "--",
            isValid: item.licenseStatus || "--",
            sourceName: item.dataSources || "--",
            endTime: item.endDate || "--",
          };
        });

        // uniqWith(this.qualiOptions, isEqual);
        this.$set(this.pagination, "total", res.data.totalCount);
      } else if (!res.data.dateList.length) {
        this.$message.info("暂无资质许可明细数据");
        this.infoData = [];
      } else {
        this.$message.error(res.message);
      }
    },
    async adminLicTabQuery() {
      const json = {
        corpName: this.paramsObj.corpName,
      };
      const res = await adminLicTabQuery(json);
      if (res.message === "成功" && res.data) {
        res.data["licType"].map((v) => {
          const qualiOption = {
            value: v,
            label: v,
          };
          this.qualiOptions.push(qualiOption);
        });
        res.data["licStatus"].map((v) => {
          const statusOption = {
            value: v,
            label: v,
          };
          this.statusOptions.push(statusOption);
        });
      } else {
        this.$message.error(res.message);
      }
    },
  },
};
</script>
<style lang="less">
.administrative-licensing {
  .business-table-save {
    top: 48px;
  }
  .business-options {
    .item-label {
      &.second-type {
        width: 125px;
      }
    }

    .item-content {
      &.second-type {
        width: calc(100% - 125px);
      }
    }
  }
  .business-table {
    &-item {
      &-content {
        display: flex;
        margin-bottom: 16px;
        align-items: center;

        .item-content-select {
          min-width: 400px;
        }

        .item-content-text {
          font-size: 12px;
          color: @secondaryTextColor;

          &-blue {
            color: @blue;
          }
        }
        &-left {
          display: flex;
          align-items: center;
          min-width: 700px;
        }
      }

      &-selected {
        width: 100%;
        padding: 16px;
        display: flex;
        flex-wrap: wrap;
        min-height: 54px;
        align-items: center;
        background: @tableHeaderColor;

        .selected-item {
          display: flex;
          padding: 0 8px;
          margin-right: 8px;
          align-items: center;
          color: @secondaryTextColor;
          background: @backgroundColor;
          border: 1px solid @borderColor;

          &-text {
            font-size: 12px;
            margin-right: 4px;
          }

          .anticon {
            font-size: 8px;
          }
        }
      }
    }
  }
}
</style>
