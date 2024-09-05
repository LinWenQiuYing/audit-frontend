<template>
  <div class="audit-results-apply">
    <div class="data-filter">
      <div class="option-tabs">
        <div
          :class="selected === pane.key ? 'option-tab selected' : 'option-tab'"
          v-for="pane in panes"
          :key="pane.key"
          :value="pane.key"
          @click="changeSelected(pane.key)"
        >
          <div class="option-tab-icon">
            <icon-svg
              :color="selected === pane.key ? '#016EFF' : '#8c8c8c'"
              :iconClass="pane.icon"
            />
          </div>
          <span class="option-tab-text">{{ pane.title }}</span>
        </div>
      </div>
      <div class="sub-title">数据筛选</div>
      <a-button class="data-filter-btn" @click="foldValue = !foldValue">
        <!-- {{ foldValue ? "收起" : "展开" }} -->
      </a-button>
      <div :class="['data-filter-options', foldValue ? '' : 'fold']">
        <div class="filter-option">
          <div class="filter-option-label">审计类型:</div>
          <div class="filter-option-content">
            <div
              :class="[
                'filter-option-content-item',
                auditType === item.key ? 'selected' : '',
              ]"
              v-for="item in auditTypeOptions"
              :key="item.key"
              @click="handleChangeAuditType(item.key)"
            >
              {{ item.title }}
            </div>
          </div>
        </div>
        <div class="filter-option">
          <div class="filter-option-label">问题分类:</div>
          <div class="filter-option-content">
            <a-input
              class="filter-option-content-input"
              placeholder="请输入关键词"
              v-model="keyWord"
            />
          </div>
        </div>
        <div class="filter-option">
          <div class="filter-option-label">年度选择:</div>
          <div class="filter-option-content">
            <a-range-picker
              v-model="startStopTime1"
              format="YYYY"
              valueFormat="YYYY"
              :mode="['year', 'year']"
              class="filter-option-content-input"
              @panelChange="onPanelChange1"
              :open="isOpen1"
              @openChange="onOpenChange1"
              :placeholder="['开始年份', '截止年份']"
            >
              <template slot="suffixIcon">
                <a-icon type="calendar" />
              </template>
            </a-range-picker>
          </div>
        </div>
        <div class="filter-option">
          <div class="filter-option-label">整改结果类型:</div>
          <div class="filter-option-content">
            <div
              :class="[
                'filter-option-content-item',
                resultType === item.key ? 'selected' : '',
              ]"
              v-for="item in resultTypeOptions"
              :key="item.key"
              @click="handleChangeResultType(item.key)"
            >
              {{ item.title }}
            </div>
          </div>
        </div>
        <div class="filter-option">
          <div class="filter-option-label">项目类型:</div>
          <div class="filter-option-content">
            <a-select
              class="filter-option-content-input"
              v-model="projectType"
              placeholder="请选择项目类型"
            >
              <a-select-option
                v-for="item in projectTypeOptions"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </div>
        </div>
        <div class="filter-btns">
          <a-button class="filter-btn" @click="resetFilters">
            <a-icon type="redo" :rotate="-90" /> 重置
          </a-button>
          <a-button
            type="primary"
            class="filter-btn"
            @click="searchInput"
            :loading="searchLoading"
            icon="search"
          >
            查询
          </a-button>
        </div>
      </div>
    </div>
    <div class="data-table">
      <div class="sub-title">问题列表</div>
      <table-component
        :columns="columns"
        :data-source="issuesData"
        :pagination="pagination"
        class="issues-table"
        :rowKey="(record) => record.id"
      >
        <div
          slot="isLabeled"
          slot-scope="record"
          :class="['slot-color', record.isLabeled ? 'red' : 'green']"
        >
          {{ record.isLabeled ? "是" : "否" }}
        </div>
        <div
          slot="isMoved"
          slot-scope="record"
          :class="['slot-color', record.isMoved ? 'red' : 'green']"
        >
          {{ record.isMoved ? "是" : "否" }}
        </div>
        <div slot="resultTypeText" slot-scope="record">
          <span
            :class="[
              'dot',
              record.resultType === 1 ? 'dot1' : '',
              record.resultType === 2 ? 'dot2' : '',
              record.resultType === 3 ? 'dot3' : '',
            ]"
          ></span>
          {{ record.resultTypeText }}
        </div>
        <div slot="detail" slot-scope="record">
          <a @click="checkDetail(record)">详情</a>
        </div>
      </table-component>
      <div class="sub-title">审计结果运用概览</div>
      <div class="filter-option single">
        <div class="filter-option-label">时间跨度:</div>
        <div class="filter-option-content">
          <a-range-picker
            v-model="startStopTime2"
            format="YYYY"
            valueFormat="YYYY"
            :mode="['year', 'year']"
            class="filter-option-content-input"
            @panelChange="onPanelChange2"
            :open="isOpen2"
            @openChange="onOpenChange2"
            :placeholder="['开始年份', '截止年份']"
          >
            <template slot="suffixIcon">
              <a-icon type="calendar" />
            </template>
          </a-range-picker>
        </div>
      </div>
      <p class="overview-text">
        时间跨度范围内共发现审计问题
        <span class="text-blue">1024</span> 个，审计项目
        <span class="text-blue">20</span> 个，已完成整改
        <span class="text-blue">16</span> 个
      </p>
      <data-graphs ref="dataGraphs" :list="graphList" />
      <table-component
        :columns="columns"
        :data-source="issuesData"
        :pagination="pagination"
        class="issues-table"
        :rowKey="(record) => record.id"
      >
        <div
          slot="isLabeled"
          slot-scope="record"
          :class="['slot-color', record.isLabeled ? 'red' : 'green']"
        >
          {{ record.isLabeled ? "是" : "否" }}
        </div>
        <div
          slot="isMoved"
          slot-scope="record"
          :class="['slot-color', record.isMoved ? 'red' : 'green']"
        >
          {{ record.isMoved ? "是" : "否" }}
        </div>
        <div slot="resultTypeText" slot-scope="record">
          <span
            :class="[
              'dot',
              record.resultType === 1 ? 'dot1' : '',
              record.resultType === 2 ? 'dot2' : '',
              record.resultType === 3 ? 'dot3' : '',
            ]"
          ></span>
          {{ record.resultTypeText }}
        </div>
        <div slot="detail" slot-scope="record">
          <a @click="checkDetail(record)">详情</a>
        </div>
      </table-component>
    </div>
  </div>
</template>
<script>
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
import TableComponent from "@/components/tableComponent";
import { Button, DatePicker, Icon, Input } from "ant-design-vue";
import DataGraphs from "../components/dataGraphs";

const { RangePicker } = DatePicker;

export default {
  name: "AuditResultsApply",
  data() {
    return {
      selected: 0,
      foldValue: true,
      panes: [
        {
          title: "当前企业",
          key: 0,
          icon: "房地产",
        },
        {
          title: "全量数据",
          key: 1,
          icon: "全量数据",
        },
      ],
      auditType: 0,
      auditTypeOptions: [
        {
          key: 0,
          title: "全部",
        },
        {
          key: 1,
          title: "责任单位",
        },
        {
          key: 2,
          title: "被审计单位",
        },
        {
          key: 3,
          title: "责任&被审计单位",
        },
      ],
      keyWord: undefined,
      startStopTime1: undefined,
      startStopTime2: undefined,
      resultType: 0,
      resultTypeOptions: [
        {
          key: 0,
          title: "全部",
        },
        {
          key: 1,
          title: "未完成",
        },
        {
          key: 2,
          title: "整改中",
        },
        {
          key: 3,
          title: "已完成",
        },
      ],
      projectType: undefined,
      projectTypeOptions: [
        {
          value: 1,
          label: "项目类型一",
        },
        {
          value: 2,
          label: "项目类型二",
        },
        {
          value: 3,
          label: "项目类型三",
        },
      ],
      searchLoading: false,
      isOpen1: false,
      isOpen2: false,
      columns: [
        {
          title: "问题单ID",
          dataIndex: "id",
          key: "id",
          width: 120,
        },
        {
          title: "问题分类",
          dataIndex: "type",
          key: "type",
          width: 200,
        },
        {
          title: "问题定性",
          dataIndex: "nature",
          key: "nature",
          width: 200,
        },
        {
          title: "问题描述",
          dataIndex: "desc",
          key: "desc",
          width: 200,
        },
        {
          title: "责任单位",
          dataIndex: "company",
          key: "company",
          width: 180,
        },
        {
          title: "审计类型",
          dataIndex: "auditType",
          key: "auditType",
          width: 180,
        },
        {
          title: "是否增加成果运用标签",
          dataIndex: "isLabeled",
          key: "isLabeled",
          width: 200,
          scopedSlots: { customRender: "isLabeled" },
        },
        {
          title: "是否移送人大",
          dataIndex: "isMoved",
          key: "isMoved",
          width: 160,
          scopedSlots: { customRender: "isMoved" },
        },
        {
          title: "整改结果类型",
          dataIndex: "resultTypeText",
          key: "resultTypeText",
          width: 160,
          fixed: "right",
          align: "center",
          scopedSlots: { customRender: "resultTypeText" },
        },
        {
          title: "项目信息",
          dataIndex: "detail",
          key: "detail",
          width: 100,
          fixed: "right",
          align: "center",
          scopedSlots: { customRender: "detail" },
        },
      ],
      issuesData: [
        {
          id: "condition1",
          type: "政策落实/其他-政策落实",
          nature: "水利工程项目建设管理不规范",
          desc: "水利工程项目建设管理不规范",
          company: "上海市水务局",
          auditType: "责任单位",
          isLabeled: "是",
          isMoved: "是",
          resultType: 1,
          resultTypeText: "未完成",
        },
        {
          id: "condition2",
          type: "政策落实/其他-政策落实",
          nature: "水利工程项目建设管理不规范",
          desc: "水利工程项目建设管理不规范",
          company: "上海市水务局",
          auditType: "责任单位",
          isLabeled: "是",
          isMoved: "是",
          resultType: 1,
          resultTypeText: "未完成",
        },
        {
          id: "condition3",
          type: "政策落实/其他-政策落实",
          nature: "水利工程项目建设管理不规范",
          desc: "水利工程项目建设管理不规范",
          company: "上海市水务局",
          auditType: "责任单位",
          isLabeled: "是",
          isMoved: "是",
          resultType: 1,
          resultTypeText: "未完成",
        },
        {
          id: "condition4",
          type: "政策落实/其他-政策落实",
          nature: "水利工程项目建设管理不规范",
          desc: "水利工程项目建设管理不规范",
          company: "上海市水务局",
          auditType: "责任单位",
          isLabeled: "是",
          isMoved: "是",
          resultType: 1,
          resultTypeText: "未完成",
        },
        {
          id: "condition5",
          type: "政策落实/其他-政策落实",
          nature: "水利工程项目建设管理不规范",
          desc: "水利工程项目建设管理不规范",
          company: "上海市水务局",
          auditType: "责任单位",
          isLabeled: "是",
          isMoved: "是",
          resultType: 1,
          resultTypeText: "未完成",
        },
        {
          id: "condition6",
          type: "政策落实/其他-政策落实",
          nature: "水利工程项目建设管理不规范",
          desc: "水利工程项目建设管理不规范",
          company: "上海市水务局",
          auditType: "责任单位",
          isLabeled: "是",
          isMoved: "是",
          resultType: 1,
          resultTypeText: "未完成",
        },
        {
          id: "condition7",
          type: "政策落实/其他-政策落实",
          nature: "水利工程项目建设管理不规范",
          desc: "水利工程项目建设管理不规范",
          company: "上海市水务局",
          auditType: "责任单位",
          isLabeled: "是",
          isMoved: "是",
          resultType: 1,
          resultTypeText: "未完成",
        },
        {
          id: "condition8",
          type: "政策落实/其他-政策落实",
          nature: "水利工程项目建设管理不规范",
          desc: "水利工程项目建设管理不规范",
          company: "上海市水务局",
          auditType: "责任单位",
          isLabeled: "是",
          isMoved: "是",
          resultType: 1,
          resultTypeText: "未完成",
        },
        {
          id: "condition9",
          type: "政策落实/其他-政策落实",
          nature: "水利工程项目建设管理不规范",
          desc: "水利工程项目建设管理不规范",
          company: "上海市水务局",
          auditType: "责任单位",
          isLabeled: "是",
          isMoved: "是",
          resultType: 1,
          resultTypeText: "未完成",
        },
        {
          id: "condition10",
          type: "政策落实/其他-政策落实",
          nature: "水利工程项目建设管理不规范",
          desc: "水利工程项目建设管理不规范",
          company: "上海市水务局",
          auditType: "责任单位",
          isLabeled: "是",
          isMoved: "是",
          resultType: 1,
          resultTypeText: "未完成",
        },
        {
          id: "condition11",
          type: "政策落实/其他-政策落实",
          nature: "水利工程项目建设管理不规范",
          desc: "水利工程项目建设管理不规范",
          company: "上海市水务局",
          auditType: "责任单位",
          isLabeled: "是",
          isMoved: "是",
          resultType: 1,
          resultTypeText: "未完成",
        },
        {
          id: "condition12",
          type: "政策落实/其他-政策落实",
          nature: "水利工程项目建设管理不规范",
          desc: "水利工程项目建设管理不规范",
          company: "上海市水务局",
          auditType: "责任单位",
          isLabeled: "是",
          isMoved: "是",
          resultType: 1,
          resultTypeText: "未完成",
        },
        {
          id: "condition13",
          type: "政策落实/其他-政策落实",
          nature: "水利工程项目建设管理不规范",
          desc: "水利工程项目建设管理不规范",
          company: "上海市水务局",
          auditType: "责任单位",
          isLabeled: "是",
          isMoved: "是",
          resultType: 1,
          resultTypeText: "未完成",
        },
        {
          id: "condition14",
          type: "政策落实/其他-政策落实",
          nature: "水利工程项目建设管理不规范",
          desc: "水利工程项目建设管理不规范",
          company: "上海市水务局",
          auditType: "责任单位",
          isLabeled: "是",
          isMoved: "是",
          resultType: 1,
          resultTypeText: "未完成",
        },
      ],
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
      myChart1: null,
      myChart2: null,
      myChart3: null,
      myChart4: null,
      graphList: [
        {
          title: "审计类型占比",
          ref: "graph1",
          width: "calc((100% - 48px) / 3)",
          paddingTop: "calc((100% - 48px) / 3 * 0.92)",
        },
        {
          title: "整改类型占比",
          ref: "graph2",
          width: "calc((100% - 48px) / 3)",
          paddingTop: "calc((100% - 48px) / 3 * 0.92)",
        },
        {
          title: "问题分类占比",
          ref: "graph3",
          width: "calc((100% - 48px) / 3)",
          paddingTop: "calc((100% - 48px) / 3 * 0.92)",
        },
        {
          title: "问题类型趋势图",
          ref: "graph4",
          width: "100%",
          paddingTop: "calc((100% - 48px) / 3 * 0.92)",
        },
      ],
    };
  },
  components: {
    AButton: Button,
    AIcon: Icon,
    AInput: Input,
    ARangePicker: RangePicker,
    DataGraphs,
    TableComponent,
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
    changeSelected(key) {
      this.selected = key;
    },
    resetFilters() {
      this.auditType = 0;
      this.keyWord = undefined;
      this.startStopTime1 = undefined;
      this.resultType = undefined;
      this.projectType = undefined;
      this.searchInput();
    },
    searchInput() {
      console.log("searchInput");
    },
    onPanelChange1(value, mode) {
      this.startStopTime1 = value;
      if (mode[0] === "year") {
        this.isOpen1 = false;
      }
    },
    onPanelChange2(value, mode) {
      this.startStopTime2 = value;
      if (mode[0] === "year") {
        this.isOpen2 = false;
      }
    },
    onOpenChange1(status) {
      this.isOpen1 = status;
    },
    onOpenChange2(status) {
      this.isOpen2 = status;
    },
    handleChangeAuditType(key) {
      this.auditType = key;
    },
    handleChangeResultType(key) {
      this.resultType = key;
    },
    checkDetail(record) {
      console.log("checkDetail", record);
    },
    init() {
      this.myChart1 = this.$echarts.init(this.$refs.dataGraphs.$refs.graph1[0]);
      this.myChart2 = this.$echarts.init(this.$refs.dataGraphs.$refs.graph2[0]);
      this.myChart3 = this.$echarts.init(this.$refs.dataGraphs.$refs.graph3[0]);
      this.myChart4 = this.$echarts.init(this.$refs.dataGraphs.$refs.graph4[0]);
      // 右下左上
      const option1 = {
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
      this.myChart1.setOption(option1);
      this.myChart2.setOption(option1);
      this.myChart3.setOption(option1);

      const option2 = {
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
          data: ["问题子分类1", "问题子分类2", "问题子分类3", "问题子分类4"],
        },
        grid: {
          x: 10,
          y: 70,
          x2: 10,
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
            data: ["2017", "2018", "2019", "2020", "2021", "2022"],
            axisPointer: {
              type: "shadow",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "数量",
            max: 1200,
            interval: 200,
            axisLabel: {
              formatter: "{value} 个",
            },
            splitLine: {
              lineStyle: {
                type: "dashed",
              },
            },
          },
        ],
        series: [
          {
            name: "问题子分类1",
            type: "bar",
            barWidth: "10%",
            tooltip: {
              valueFormatter: function (value) {
                return value + " 个";
              },
            },
            data: [1103, 553, 561, 530, 521, 910],
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: "#18F218" },
                { offset: 0.6, color: "#A3FAA3" },
                { offset: 1, color: "#18F218" },
              ]),
            },
          },
          {
            name: "问题子分类2",
            type: "bar",
            barWidth: "10%",
            tooltip: {
              valueFormatter: function (value) {
                return value + " 个";
              },
            },
            data: [398, 597, 813, 901, 486, 780],
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: "#298DFF" },
                { offset: 0.6, color: "#9CCAFF" },
                { offset: 1, color: "#298DFF" },
              ]),
            },
          },
          {
            name: "问题子分类3",
            type: "bar",
            barWidth: "10%",
            tooltip: {
              valueFormatter: function (value) {
                return value + " 个";
              },
            },
            data: [478, 787, 263, 941, 186, 327],
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: "#18C7F2" },
                { offset: 0.6, color: "#A3E9FA" },
                { offset: 1, color: "#18C7F2" },
              ]),
            },
          },
          {
            name: "问题子分类4",
            type: "bar",
            barWidth: "10%",
            tooltip: {
              valueFormatter: function (value) {
                return value + " 个";
              },
            },
            data: [888, 307, 310, 305, 536, 541],
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: "#30F2CB" },
                { offset: 0.6, color: "#ACFAEA" },
                { offset: 1, color: "#30F2CB" },
              ]),
            },
          },
          {
            name: "问题子分类1",
            type: "line",
            tooltip: {
              valueFormatter: function (value) {
                return value + " 个";
              },
            },
            color: "#18F218",
            data: [1103, 553, 561, 530, 521, 910],
          },
          {
            name: "问题子分类2",
            type: "line",
            tooltip: {
              valueFormatter: function (value) {
                return value + " 个";
              },
            },
            color: "#298DFF",
            data: [398, 597, 813, 901, 486, 780],
          },
          {
            name: "问题子分类3",
            type: "line",
            tooltip: {
              valueFormatter: function (value) {
                return value + " 个";
              },
            },
            color: "#18C7F2",
            data: [478, 787, 263, 941, 186, 327],
          },
          {
            name: "问题子分类4",
            type: "line",
            tooltip: {
              valueFormatter: function (value) {
                return value + " 个";
              },
            },
            color: "#30F2CB",
            data: [888, 307, 310, 305, 536, 541],
          },
        ],
      };
      this.myChart4.setOption(option2);
    },
  },
};
</script>
<style lang="less">
.audit-results-apply {
  height: 100%;
  overflow: auto;

  .data-filter {
    background: #fff;
    border-radius: 5px;
    padding: 0 24px 24px;
    position: relative;
    margin-bottom: 24px;

    &-btn {
      position: absolute;
      right: 24px;
      top: 56px;
      width: 75px;
    }

    &-options {
      height: 256px;
      overflow: hidden;
      transition: all 0.1s;

      .filter-btns {
        float: right;

        .filter-btn {
          margin-left: 16px;
        }
      }
    }
  }

  .filter-option {
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    &-label {
      width: 90px;
      text-align: right;
      color: @primaryTextColor;
      font-weight: 600;
    }

    &-content {
      display: flex;
      margin-left: 16px;
      align-items: center;
      width: calc(100% - 106px);

      &-item {
        border: 1px solid @borderColor;
        padding: 2px 12px;
        font-size: 12px;
        border-radius: 12px;
        color: @primaryTextColor;
        margin-right: 16px;
        cursor: pointer;

        &.selected {
          border-color: @activeFontColor;
          color: @activeFontColor;
          background-color: rgba(1, 110, 255, 0.1);
        }
      }

      &-input {
        width: 300px;
      }
    }

    &.single {
      margin-bottom: 24px;

      .filter-option-label {
        width: 62px;
      }
      .filter-option-content {
        width: calc(100% - 78px);
      }
    }
  }

  .data-table {
    background: #fff;
    border-radius: 5px;
    padding: 24px;
    position: relative;

    .issues-table {
      margin-bottom: 24px;

      .ant-table-tbody {
        .ant-table-row-cell-break-word {
          color: @primaryTextColor;
        }
      }
      .slot-color {
        &.red {
          color: @red;
        }

        &.green {
          color: @green;
        }
      }

      .dot {
        width: 6px;
        height: 6px;
        display: inline-block;
        border-radius: 50%;
        margin-bottom: 2px;

        &.dot1 {
          background: @red;
        }
        &.dot2 {
          background: @green;
        }
        &.dot3 {
          background: @orange;
        }
      }
    }

    .overview-text {
      color: @secondaryTextColor;
      margin-bottom: 24px;

      .text-blue {
        color: @blue;
      }
    }
  }
}
</style>
