<!-- 异常分析：经济结构分析 -->
<template>
  <div class="economic-structure">
    <!-- <a-progress :percent="100" :success-percent="60" :show-info="false" /> -->
    <div class="economic-structure-content">
      <div class="economic-structure-content-header">
        经济科目结构分析（当前单位：{{ curTreeItem.title }}）
      </div>
      <div style="padding-bottom: 20px">
        <div class="sub-title">总体情况</div>
        <a-table
          class="economic-structure-content-table"
          :rowKey="(record) => record.name"
          :data-source="tableData.data"
          :loading="tableLoading"
          :columns="tableData.columns"
          :indentSize="10"
          :pagination="false"
          :scroll="{ x: 'max-content', y: 270 }"
          size="middle"
          bordered
        >
          <!-- :rowClassName="setRowClassName"
      :customRow="handleRowClick" -->
          <template
            v-for="(item, key) in tableData.columns"
            :slot="item.scopedSlots ? item.scopedSlots.customRender : ''"
            slot-scope="text, record, index"
          >
            <div
              style="display: flex"
              v-if="item.key !== 'name'"
              @click="handleCellClickYear(record, key)"
              :style="{
                display: 'flex',

                height: '100%',
                background:
                  selectedCellYear === `${index}-${key}`
                    ? '#E6F4FF'
                    : 'transparent',
                cursor: 'pointer',
              }"
            >
              <!-- {{ (record[item.key].split("+")[0] * 1).toFixed(2) }} -->
              <a-progress
                :percent="record[item.key].split('+')[0] * 1"
                size="small"
                :show-info="false"
                style="width: 100px"
              />
              <!-- trigger="click" -->
              <a-popover placement="rightBottom">
                <template slot="content">
                  <p>业务年度：{{ tableData.columns[key].title }}</p>
                  <p>经济科目名称：{{ record.name }}</p>
                  <p>占比：{{ (text.split("+")[0] * 1).toFixed(2) }}%</p>
                  <p>
                    执行金额：{{
                      Number(text.split("+")[1]).toLocaleString()
                    }}万元
                  </p>
                </template>
                <div style="margin-left: 8px; line-height: 40px">
                  <span
                    >{{
                      (record[item.key].split("+")[0] * 1).toFixed(2)
                    }}%</span
                  >
                  <!-- &nbsp;&nbsp;
                <span
                  >{{
                    Number(record[item.key].split("+")[1]).toLocaleString()
                  }}万元</span
                > -->
                </div>
              </a-popover>
            </div>
            <span v-else style="padding: 8px 11px">
              {{ text }}
            </span>
            <!-- <div
            v-else
            @click="handleCellClickSubject(record, key)"
            :style="{
              display: 'block',
              padding: '8px 4px',
              height: '100%',
              background:
                selectedCellSubject === `${index}-${key}`
                  ? '#E6F4FF'
                  : 'transparent',
              cursor: 'pointer',
            }"
          >
            {{ text }}
          </div> -->
          </template>
          <!-- :scroll="{ x: tableScrollxValue, y: 600 }" -->
        </a-table>
        <div class="sub-title">下属单位经济科目对比</div>
        <div class="economic-structure-content-graph">
          <div class="real-graph" ref="graph2"></div>
        </div>
      </div>
    </div>
    <div class="economic-structure-right">
      <div class="economic-structure-right-header">参数设置</div>
      <!-- style="max-height: calc(100% - 86px); overflow: auto;" -->
      <div style="max-height: calc(100% - 86px); overflow: auto">
        <div class="economic-structure-right-item">
          <div class="item-label">年份：</div>
          <a-range-picker
            v-model="choosedPeriod"
            class="item-value"
            :placeholder="['开始年', '截止年']"
            :format="'YYYY'"
            :mode="['year', 'year']"
            @panelChange="handlePanelChangePeriod"
          >
            <template slot="suffixIcon">
              <a-icon type="calendar" />
            </template>
          </a-range-picker>
        </div>
        <div class="economic-structure-right-item">
          <div class="item-label">项目大类：</div>
          <!-- <a-select
          placeholder="请选择"
          v-model="projectType"
          :options="projectOptions"
          class="item-value"
        /> -->
          <div>
            <div>
              <a-checkbox
                :indeterminate="indeterminateProject"
                :checked="checkAllProject"
                @change="oncheckAllProjectChange"
              >
                全选
              </a-checkbox>
            </div>

            <a-checkbox-group
              v-model="checkedListProject"
              :options="plainOptionsProject"
              @change="onChangeProject"
              class="item-checkbox"
            />
          </div>
        </div>
        <div class="economic-structure-right-item">
          <div class="item-label">预算资金体系：</div>
          <!-- <a-select
          placeholder="请选择"
          v-model="budgetStructure"
          :options="budgetStructureOptions"
          class="item-value"
        /> -->
          <div>
            <div>
              <a-checkbox
                :indeterminate="indeterminateBudget"
                :checked="checkAllBudget"
                @change="oncheckAllBudgetChange"
              >
                全选
              </a-checkbox>
            </div>
            <a-checkbox-group
              v-model="checkedListBudget"
              :options="plainOptionsBudget"
              @change="onChangeBudget"
              class="item-checkbox"
            />
          </div>
        </div>
        <div class="economic-structure-right-item">
          <div class="item-label">与平均值偏离度：</div>
          <div class="color-box">
            <a-input-number
              class="color-box-input"
              placeholder="请选择"
              :min="0"
              :max="1"
              :step="0.01"
              v-model="ratioValue"
            />
            <div class="color-box-red"></div>
          </div>
        </div>
      </div>

      <div class="economic-structure-right-action">
        <a-button style="margin-right: 8px" @click="handleParamsReset"
          >重置</a-button
        >
        <a-button type="primary" @click="handleParamsConfig">确定</a-button>
      </div>
    </div>
  </div>
</template>
<script>
//import { Select } from "ant-design-vue";
import { lineColor1 } from "@/assets/theme/model.js";
import {
  getEconomicStructureGraph,
  getEconomicStructureMoneyOptions,
  getEconomicStructureProjectOptions,
  getEconomicStructureTable,
} from "@/shared/newApi/manage/exceptionAnalysis/economicStructure.js";
import {
  Button,
  Checkbox,
  DatePicker,
  Icon,
  InputNumber,
  Popover,
  Progress,
  Table,
} from "ant-design-vue";
import dayjs from "dayjs";
import { mapState } from "vuex";
const { Group } = Checkbox;
// import tableData from "../../financialAnalysis/financialMain/tableData";
const { RangePicker } = DatePicker;
export default {
  name: "EconomicStructure",
  data() {
    return {
      //选择年份
      choosedPeriod: ["2019", "2023"],
      //项目大类
      checkedListProject: [],
      indeterminateProject: false,
      checkAllProject: true,
      plainOptionsProject: [
        // {
        //   value: "1",
        //   label: "1",
        // },
        // {
        //   value: "2",
        //   label: "2",
        // },
        // {
        //   value: "3",
        //   label: "3",
        // },
      ],

      //预算资金体系
      checkedListBudget: [
        // "null",
        // "财政专户管理资金",
        // "财政专户资金",
        // "公共财政或预算资金",
        // "一般公共预算资金",
        // "政府性资金",
        // "政府性基金预算资金",
        // "其他",
      ],
      indeterminateBudget: false,
      checkAllBudget: true,
      plainOptionsBudget: [
        // {
        //   value: "null",
        //   label: "null",
        // },
        // {
        //   value: "财政专户管理资金",
        //   label: "财政专户管理资金",
        // },
        // {
        //   value: "财政专户资金",
        //   label: "财政专户资金",
        // },
        // {
        //   value: "公共财政或预算资金",
        //   label: "公共财政或预算资金",
        // },
        // {
        //   value: "一般公共预算资金",
        //   label: "一般公共预算资金",
        // },
        // {
        //   value: "政府性资金",
        //   label: "政府性资金",
        // },
        // {
        //   value: "政府性基金预算资金",
        //   label: "政府性基金预算资金",
        // },
        // {
        //   value: "其他",
        //   label: "其他",
        // },
      ],
      //与平均值偏离度
      ratioValue: 0.05, //v-model绑定的
      ratioValueBar: 0.05, //点击确认后将ratioValue赋值给它，作用于柱状图

      //表格
      choosedRowId: "1", //当前鼠标选中行
      tableLoading: false,
      selectedCellYear: "", // 用于存储选中经济科目单元格的索引
      selectedCellYearCopy: "", // 用于存储选中经济科目单元格的索引
      selectedCellSubject: "", // 用于存储选中经济科目名称单元格的索引  第一列
      selectedCellSubjectCopy: "", // 用于存储选中经济科目名称单元格的索引  第一列
      tableData: {
        // columns: [
        //   {
        //     title: "经济科目名称",
        //     dataIndex: "name",
        //     key: "name",
        //     width: 200,
        //     scopedSlots: { customRender: "name" },
        //   },
        //   {
        //     title: "2017",
        //     dataIndex: "2017",
        //     key: "2017",
        //     width: 350,
        //     scopedSlots: { customRender: "2017" },
        //   },
        //   {
        //     title: "2018",
        //     dataIndex: "2018",
        //     key: "2018",
        //     width: 350,
        //     scopedSlots: { customRender: "2018" },
        //   },
        // ],
        // //这边比较特殊，每一行数据的id请从  0开始累加排序  '0','1','2'……
        // data: [
        //   {
        //     id: "0",
        //     name: "其他支出",
        //     2017: "0.45+88590",
        //     2018: "0.55+88888",
        //   },
        //   {
        //     id: "1",
        //     name: "委托业务费",
        //     2017: "0.45+88590",
        //     2018: "0.55+88888",
        //   },
        //   {
        //     id: "2",
        //     name: "其他支出2",
        //     2017: "0.45+88590",
        //     2018: "0.55+88888",
        //   },
        //   {
        //     id: "3",
        //     name: "委托业务费2",
        //     2017: "0.45+88590",
        //     2018: "0.55+88888",
        //   },
        //   {
        //     id: "4",
        //     name: "其他支出3",
        //     2017: "0.45+88590",
        //     2018: "0.55+88888",
        //   },
        //   {
        //     id: "5",
        //     name: "委托业务费3",
        //     2017: "0.45+88590",
        //     2018: "0.55+88888",
        //   },
        // ],
        // // tableSlots: ["2017"],
        // tableSlots: ["2017", "2018"],
      },

      choosedYear: null, //总体情况表格的选中年份
      choosedSubject: null, //总体情况表格的选中科目名称
      choosedRatio: null, //总体情况表格的选中占比

      //下属单位经济科目对比
      myChart2: null,
      lineColor1,
      graphData2: {
        // average: 10,
        // xAxis: [
        //   "预算单位1",
        //   "预算单位2",
        //   "预算单位3",
        //   "预算单位4",
        //   "预算单位5",
        //   "预算单位6",
        //   "预算单位7",
        //   "预算单位8",
        //   "预算单位9",
        //   "预算单位10",
        //   "预算单位11",
        //   "预算单位12",
        //   "预算单位13",
        //   "预算单位14",
        //   "预算单位15",
        //   "预算单位16",
        // ],
        // seriesData: [
        //   {
        //     name: "预算单位1",
        //     code: "one",
        //     year: "2023",
        //     subjectName: "委托业务费",
        //     money: 9,
        //   },
        //   {
        //     name: "预算单位2",
        //     code: "two",
        //     year: "2023",
        //     subjectName: "委托业务费",
        //     money: 8,
        //   },
        //   {
        //     name: "预算单位3",
        //     code: "three",
        //     year: "2023",
        //     subjectName: "委托业务费",
        //     money: 12,
        //   },
        //   {
        //     name: "预算单位4",
        //     code: "four",
        //     year: "2023",
        //     subjectName: "委托业务费",
        //     money: 6,
        //   },
        //   {
        //     name: "预算单位5",
        //     code: "five",
        //     year: "2023",
        //     subjectName: "委托业务费",
        //     money: 12,
        //   },
        //   {
        //     name: "预算单位6",
        //     code: "six",
        //     year: "2023",
        //     subjectName: "委托业务费",
        //     money: 8,
        //   },
        //   {
        //     name: "预算单位7",
        //     code: "seven",
        //     year: "2023",
        //     subjectName: "委托业务费",
        //     money: 6,
        //   },
        //   {
        //     name: "预算单位8",
        //     code: "eight",
        //     year: "2023",
        //     subjectName: "委托业务费",
        //     money: 2,
        //   },
        //   {
        //     name: "预算单位9",
        //     code: "nine",
        //     year: "2023",
        //     subjectName: "委托业务费",
        //     money: 8,
        //   },
        //   {
        //     name: "预算单位10",
        //     code: "ten",
        //     year: "2023",
        //     subjectName: "委托业务费",
        //     money: 7,
        //   },
        //   {
        //     name: "预算单位11",
        //     code: "eleven",
        //     year: "2023",
        //     subjectName: "委托业务费",
        //     money: 2,
        //   },
        //   {
        //     name: "预算单位12",
        //     code: "twelve",
        //     year: "2023",
        //     subjectName: "委托业务费",
        //     money: 1,
        //   },
        //   {
        //     name: "预算单位13",
        //     code: "thirteen",
        //     year: "2023",
        //     subjectName: "委托业务费",
        //     money: 1,
        //   },
        //   {
        //     name: "预算单位14",
        //     code: "fourteen",
        //     year: "2023",
        //     subjectName: "委托业务费",
        //     money: 2,
        //   },
        //   {
        //     name: "预算单位15",
        //     code: "fifteen",
        //     year: "2023",
        //     subjectName: "委托业务费",
        //     money: 3,
        //   },
        //   {
        //     name: "预算单位16",
        //     code: "sixteen",
        //     year: "2023",
        //     subjectName: "委托业务费",
        //     money: 4,
        //   },
        // ],
        // //占比
        // data: [9, 8, 85, 78, 65, 45, 48, 54, 64, 44, 63, 32, 25, 25, 12],
      },
    };
  },
  computed: {
    ...mapState("blockAnalysis", ["blockChoosedYear"]),
    ...mapState("managePortrait", ["curTreeItem"]),
  },
  components: {
    //ASelect: Select,
    AIcon: Icon,
    ATable: Table,
    ACheckboxGroup: Group,
    ACheckbox: Checkbox,
    AButton: Button,
    ARangePicker: RangePicker,
    AInputNumber: InputNumber,
    AProgress: Progress,
    APopover: Popover,
  },
  watch: {
    curTreeItem: {
      async handler(newVal, oldVal) {
        console.log("5656555", newVal, oldVal);
        this.getAllData();
      },
      deep: true,
    },
  },
  mounted() {
    if (!this.curTreeItem.key) return;
    this.getAllData();
  },
  beforeDestroy() {
    this.myChart2.dispose();

    const f = () => {
      this.myChart2.resize();
    };
    window.removeEventListener("resize", f);
  },
  methods: {
    async getAllData() {
      if (!this.curTreeItem.key) return;
      await this.getEconomicStructureProjectOptions(); //项目大类下拉选项
      await this.getEconomicStructureMoneyOptions(); //预算资金体系下拉选项
      await this.getEconomicStructureTable(); //总体情况表格
      this.initAllCharts();
    },

    initAllCharts() {
      this.initEcharts2();

      const f = () => {
        this.myChart2.resize();
      };
      window.addEventListener("resize", f);
    },

    //项目大类下拉选项
    async getEconomicStructureProjectOptions() {
      const res = await getEconomicStructureProjectOptions();
      if (res.message === "成功") {
        console.log("message成功 项目大类下拉选项", res.data);
        this.plainOptionsProject = res.data;
        let arr = [];
        this.plainOptionsProject.forEach((item) => {
          arr.push(item.value);
        });
        this.checkedListProject = arr;
      } else {
        this.$message.error(res.message);
      }
    },

    //预算资金体系下拉选项
    async getEconomicStructureMoneyOptions() {
      const res = await getEconomicStructureMoneyOptions();
      if (res.message === "成功") {
        console.log("message成功 预算资金体系下拉选项", res.data);
        this.plainOptionsBudget = res.data;
        let arr = [];
        this.plainOptionsBudget.forEach((item) => {
          arr.push(item.value);
        });
        this.checkedListBudget = arr;
      } else {
        this.$message.error(res.message);
      }
    },

    //总体情况表格
    async getEconomicStructureTable() {
      const json = {
        start_year: this.choosedPeriod.length
          ? dayjs(this.choosedPeriod[0]).format("YYYY")
          : null,
        end_year: this.choosedPeriod.length
          ? dayjs(this.choosedPeriod[1]).format("YYYY")
          : null,
        dept_code: this.curTreeItem.key,
        pro_type_name: this.checkedListProject,
        fund_nature_name: this.checkedListBudget,
      };
      this.tableLoading = true;
      const res = await getEconomicStructureTable(json);
      this.tableLoading = false;
      if (res.message === "成功") {
        console.log("message成功 总体情况表格", res.data);
        this.tableData = res.data;
        const length = res.data.columns.length - 1;
        if (res.data.data.length) {
          this.selectedCellYear = `0-${length}`; //用于存储选中经济科目单元格的索引
          this.selectedCellYearCopy = `0-${length}`; //用于存储选中经济科目单元格的索引
          console.log(
            "用于存储选中经济科目单元格的索引",
            this.selectedCellYear,
            this.selectedCellYearCopy
          );
          const realData = res.data.data[0]; //返回的第一条数据
          this.choosedSubject = res.data.data[0].name; //当前选中科目
          const len2 = res.data.columns.length - 1;
          this.choosedYear = res.data.columns[len2].title; //当前选中年份
          this.choosedRatio = realData[this.choosedYear].split("+")[0]; //当前选中占比
          console.log(
            "总体情况表格选中的年份以及占比",
            this.choosedYear,
            this.choosedRatio
          );
        }
      } else {
        this.$message.error(res.message);
      }
    },

    //下属单位经济科目对比
    async getEconomicStructureGraph() {
      const json = {
        year: this.choosedYear,
        dept_code: this.curTreeItem.key,
        avg_line: this.choosedRatio, //占比
        pro_type_name: this.checkedListProject,
        fund_nature_name: this.checkedListBudget,
        gov_exp_subject_name: this.choosedSubject, //科目名称
      };
      const res = await getEconomicStructureGraph(json);
      if (res.message === "成功") {
        console.log("message成功 下属单位经济科目对比", res.data);
        this.graphData2 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //参数配置点击确定
    async handleParamsConfig() {
      if (!this.choosedPeriod.length) {
        return this.$message.warning("请选择查询年份区间");
      }
      this.ratioValueBar = this.ratioValue;
      await this.getEconomicStructureTable(); //总体情况表格
      this.initAllCharts();
    },

    //重置
    async handleParamsReset() {
      this.choosedPeriod = ["2023", "2023"];
      this.ratioValue = 0.05;
      this.handleParamsConfig();
      let arr = [];
      this.plainOptionsProject.forEach((item) => {
        arr.push(item.value);
      });
      this.checkedListProject = arr;
      let arr2 = [];
      this.plainOptionsBudget.forEach((item) => {
        arr2.push(item.value);
      });
      this.checkedListBudget = arr2;
    },

    //表格选中行背景色
    // setRowClassName(record, index) {
    //   // console.log("77777777777777", index);
    //   // 为第一行添加背景色
    //   if (this.choosedRowId === record.id) {
    //     console.log("888");
    //     return "background-color-row";
    //   }
    //   return "";
    // },
    //表格某行选中
    // handleRowClick(record) {
    //   return {
    //     on: {
    //       click: () => {
    //         this.choosedRowId = record.id;
    //         // console.log("点击行的record", record);
    //       },
    //     },
    //   };
    // },

    handlePanelChangePeriod(value) {
      this.choosedPeriod = value;

      // Number(dayjs(this.choosedPeriod[1]).format("YYYY")) -
      //   Number(dayjs(this.choosedPeriod[0]).format("YYYY"))
    },

    //与平均值偏离度
    handleRatioChange() {},

    //横向柱状图
    async initEcharts2() {
      //联动需要先clear
      if (this.myChart2) {
        this.myChart2.dispose();
      }
      this.myChart2 = this.$echarts.init(this.$refs.graph2);
      await this.getEconomicStructureGraph();

      const _that = this; //解决series中颜色渐变处需要new一个echarts时的this搜不到的问题
      const option2 = {
        tooltip: {
          enterable: true,
          triggerOn: "mousemove", // 设置触发方式为悬停
          borderColor: "transparent",
          // jump
          // 1.提供图表穿透功能：用户点击图形上的某一项分类后，系统跳转进入【非税收入明细表】，并自动附带筛选条件【预算单位名称】、【时间范围】。
          formatter: function (params) {
            // if (params.seriesName.length === 0) {
            //   return ""; // 没有数据时，不显示 tooltip
            // }
            // const paramsYear = _that.yearRange;
            if (params.componentType === "markLine") return;
            return `<div class="ratio-tooltip-box">
              <div>业务年度：${
                _that.graphData2.seriesData[params.dataIndex].year
              }年</div>
              <div>
                经济科目名称：${
                  _that.graphData2.seriesData[params.dataIndex].subjectName
                }
              </div>
              <div>单位名称：${params.name}</div>
              <div>占比：${params.data}%</div>
              <div>执行金额：${Number(
                _that.graphData2.seriesData[params.dataIndex].money
              ).toLocaleString()}万元</div>
              <div>平均值：${_that.graphData2.average}%</div>
            </div>`;
          },
        },
        // legend: {
        //   data: ["非税收入"],
        // },
        grid: {
          left: "8%", // 调整左边距
          right: "15%", // 调整右边距
          top: "10%", // 调整上边距
          bottom: "10%", // 调整下边距
        },
        xAxis: [
          {
            type: "category",
            // name: "时间",
            nameLocation: "end",
            data: this.graphData2.xAxis,
            // axisLabel: {
            //   // rotate: -15,
            //   fontSize: 10, // 设置文字大小为10，再大一点就放不下了
            //   color: "#97A3B7",
            // },
            axisLabel: {
              interval: 0,
              fontSize: 10, // 设置文字大小为10，再大一点就放不下了
              color: "#97A3B7",
              formatter: function (value) {
                // 如果标签长度超过4，将剩余的文字替换为省略号
                if (value.length > 5) {
                  return value.slice(0, 5) + "...";
                } else {
                  return value;
                }
              },
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
            name: "占比（%）",
            nameLocation: "end",
            axisLabel: {
              color: "#97A3B7",
            },
          },
        ],
        dataZoom: [
          {
            show: true,
            height: 4,
            bottom: 0,
            startValue: 0, //起始值
            endValue: 7, //结束值
            fillerColor: "rgba(1, 132, 213, 0.4)", // 滚动条颜色
            borderColor: "rgba(17, 100, 210, 0.12)",
            backgroundColor: "rgba(221, 220, 107, .1)", //两边未选中的滑动条区域的颜色
            handleSize: 0, //两边手柄尺寸
            showDetail: false, //拖拽时是否展示滚动条两侧的文字
            zoomLock: true, //是否只平移不缩放
            moveOnMouseMove: false, //鼠标移动能触发数据窗口平移
            // minValueSpan: 5,  // 放大到最少几个
            // maxValueSpan: 5,  //  缩小到最多几个
          },
          {
            type: "inside", // 支持内部鼠标滚动平移
            start: 0,
            // end: 20,
            startValue: 0, // 从头开始。
            endValue: 7, // 最多5个
            zoomOnMouseWheel: false, // 关闭滚轮缩放
            moveOnMouseWheel: true, // 开启滚轮平移
            moveOnMouseMove: true, // 鼠标移动能触发数据窗口平移
          },
        ],
        series: [
          {
            type: "bar",
            name: "非税收入", //顶部的注释说明
            data: this.graphData2.data,
            barWidth: 22, //柱子的宽度
            barGap: 800,
            itemStyle: {
              //柱子的颜色
              // color: this.lineColor1,
              // color: new _that.$echarts.graphic.LinearGradient(1, 0, 0, 0, [
              //   { offset: 0, color: "#298DFF" }, // 起始颜色
              //   { offset: 0.3542, color: "#9CCAFF" }, // 中间过渡颜色
              //   { offset: 1, color: "#298DFF" }, // 结束颜色
              // ]),
              color: function (params) {
                let compare = _that.ratioValueBar * 100;
                let val = Math.abs(params.value - _that.graphData2.average);
                if (val >= compare) {
                  return "red";
                } else {
                  return _that.lineColor1;
                }

                // params 包含当前柱子的信息，如 dataIndex（数据索引）、value（值）等
                // let colorList = [
                //   "#c23531",
                //   "#2f4554",
                //   "#61a0a8",
                //   "#d48265",
                //   "#91c7ae",
                // ];
                // return colorList[params.dataIndex];
              },
            },
            label: {
              position: "top",
              show: true,
              formatter: "{c}%",
            },
            markLine: {
              label: {
                show: true,
                position: "end",
                formatter: (params) => {
                  return (
                    "平均值：" + Number(params.value).toLocaleString() + "%"
                  );
                },
                color: "#FE9E17",
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
              data: [{ yAxis: _that.graphData2.average }],
            },
          },
        ],
      };

      this.myChart2.setOption(option2, true);
      this.myChart2.on("click", (params) => {
        console.log("点击图事件", params);
      });
      //图表背景色
      // handleAddEchartsBackground(this.myChart2, option2, this.graphData2.xAxis);
    },

    //项目大类
    onChangeProject(checkedList) {
      this.indeterminateProject =
        !!checkedList.length &&
        checkedList.length < this.plainOptionsProject.length;
      this.checkAllProject =
        checkedList.length === this.plainOptionsProject.length;
    },
    oncheckAllProjectChange(e) {
      Object.assign(this, {
        checkedListProject: e.target.checked
          ? this.plainOptionsProject.map((item) => item.value)
          : [],
        indeterminateProject: false,
        checkAllProject: e.target.checked,
      });
    },

    //预算资金体系
    onChangeBudget(checkedList) {
      this.indeterminateBudget =
        !!checkedList.length &&
        checkedList.length < this.plainOptionsBudget.length;
      this.checkAllBudget =
        checkedList.length === this.plainOptionsBudget.length;
    },
    oncheckAllBudgetChange(e) {
      Object.assign(this, {
        checkedListBudget: e.target.checked
          ? this.plainOptionsBudget.map((item) => item.value)
          : [],
        indeterminateBudget: false,
        checkAllBudget: e.target.checked,
      });
    },

    handleCellClickSubject(record, key) {
      if (this.selectedCellSubjectCopy === `${record.id}-${key}`) {
        this.selectedCellSubject = ""; // 设置选中的单元格索引
      } else {
        this.selectedCellSubject = `${record.id}-${key}`; // 设置选中的单元格索引
      }
      //选中额科目名称  record.name
      this.selectedCellSubjectCopy = this.selectedCellSubject;
      console.log("索引科目", record.name);
    },

    handleCellClickYear(record, key) {
      // if (this.selectedCellYearCopy === `${record.id}-${key}`) {
      //   this.selectedCellYear = ""; // 设置选中的单元格索引
      // } else {
      this.selectedCellYear = `${record.id}-${key}`; // 设置选中的单元格索引
      // }
      this.selectedCellYearCopy = this.selectedCellYear;
      //选中的年份  this.tableData.columns[key].title
      this.choosedSubject = record.name; //当前选中科目
      this.choosedYear = this.tableData.columns[key].title; //当前选中年份
      this.choosedRatio = record[this.choosedYear].split("+")[0]; //当前选中占比
      console.log(
        "点击表格重新获取横向柱状图",
        this.choosedSubject,
        this.choosedYear,
        this.choosedRatio
      );
      this.initEcharts2();
      // console.log("this.selectedCellYear", this.selectedCellYear);
      // console.log(
      //   "索引年份",
      //   record,
      //   key,
      //   this.tableData.columns[key].title,
      //   record.name
      // );
    },
  },
};
</script>
<style lang="less">
.economic-structure {
  width: calc(100% - 314px);
  margin-left: 314px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  position: relative;

  &-right {
    width: 220px;
    // height: 100%;
    height: calc(100vh - 224px);
    padding: 20px;
    border-radius: 4px;
    border: 1px solid var(----4, #d6dbe3);
    position: fixed;
    right: 40px;

    &-header {
      color: #3c485c;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 20px;
    }

    &-item {
      width: 100%;
      margin-bottom: 10px;

      .item-label {
        margin-bottom: 4px;
      }

      .item-value {
        width: 100%;
      }

      .item-checkbox {
        .ant-checkbox-wrapper {
          margin-bottom: 4px;
        }
      }

      .color-box {
        width: 100%;
        display: flex;
        align-items: center;
        // justify-content: space-between;

        &-red {
          width: 24px;
          height: 24px;
          margin-left: 24px;
          background-color: red;
        }
      }
    }

    &-action {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
      // position: absolute;
      // right: 20px;
      // bottom: 20px;
    }
  }

  &-content {
    width: calc(100% - 240px);

    &-header {
      height: 28px;
      line-height: 28px;
      color: #1c222b;
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 20px;
    }

    &-table {
      width: 100%;
      height: 340px !important;

      //表格padding
      .ant-table-body {
        .ant-table-tbody {
          tr > td {
            padding: 0 !important;
            height: 40px;

            .ant-progress-outer {
              margin-top: 8px;
            }
          }
        }
      }
    }

    &-graph {
      width: 100%;
      height: 360px;
      // margin-bottom: 20px;

      .real-graph {
        width: 100%;
        height: 360px;
      }
    }
  }
}
</style>
