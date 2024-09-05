<template>
  <div class="project-detail">
    <div class="project-detail-des">
      <div class="project-detail-des-item">
        <div class="project-detail-des-item-label">项目名称：</div>
        <div class="project-detail-des-item-value">
          {{ desData.projectName }}
        </div>
      </div>
      <div class="project-detail-des-item">
        <div class="project-detail-des-item-label">预算单位名称：</div>
        <div class="project-detail-des-item-value">
          {{ desData.budgetName }}
        </div>
      </div>
      <div class="project-detail-des-item">
        <div class="project-detail-des-item-label">主管单位名称：</div>
        <div class="project-detail-des-item-value">{{ desData.unitName }}</div>
      </div>
      <div class="project-detail-des-item">
        <div class="project-detail-des-item-label">项目金额：</div>
        <div class="project-detail-des-item-value">
          {{ Number(desData.money).toLocaleString() }}万元
        </div>
      </div>
    </div>
    <div class="project-detail-wrapper">
      <div class="project-detail-wrapper-left">
        <div class="sub-title">支付进度</div>
        <div class="project-detail-wrapper-left-wrapper-box">
          <div class="wrapper-top">
            <div class="wrapper-top-title">指定项目支付进度趋势</div>
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
            <div class="wrapper-content-graph" ref="graph1"></div>
          </div>
        </div>
      </div>
      <div class="project-detail-wrapper-right">
        <div class="sub-title">收款人情况</div>
        <div class="project-detail-wrapper-right-table">
          <a-table
            :columns="columns1"
            :data-source="tableData1.dateList"
            :pagination="false"
            :scroll="{ x: 'max-content', y: 205 }"
            :loading="tableLoading1"
            :rowKey="(record) => record.id"
            :bordered="true"
          >
            <span
              slot="skrmc"
              slot-scope="text, record, index"
              :class="
                table1Index1 === index
                  ? 'custom-cell-a selected'
                  : 'custom-cell-a'
              "
              @click="handleClickUnitName1(text, index)"
            >
              {{ text }}
            </span>
            <span slot="zfje" slot-scope="text, record" style="cursor: default">
              <a-popover placement="rightBottom">
                <template slot="content">
                  <div>项目名称：{{ projectName }}</div>
                  <div>年份：{{ curYear }}年</div>
                  <div>收款人名称：{{ record.skrmc }}</div>
                  <div>
                    支付金额：{{ Number(record.zfje).toLocaleString() }}万元
                  </div>
                </template>
                <a-progress
                  :percent="(Number(text) / Number(tableData1.maxMoney)) * 100"
                  :show-info="false"
                  style="width: 180px"
                />

                {{ Number(record.zfje).toLocaleString() }}万元
              </a-popover>
            </span>
          </a-table>
        </div>
      </div>
    </div>
    <div class="sub-title">支付明细</div>
    <div style="height: calc(100vh - 590px)">
      <a-table
        bordered
        :columns="columns2"
        :data-source="tableData2.dateList"
        :loading="tableLoading2"
        :pagination="pagination"
        :rowKey="(record) => record.id"
        :scroll="{ x: 'max-content', y: 'calc(100vh - 670px)' }"
        class="project-detail-table"
      >
        <!-- :scroll="{ x: 1200, y: 590 }" -->
        <!-- :scroll="{ x: 'max-content', y: 'calc(100vh - 318px)' }" -->
        <div
          slot="action"
          slot-scope="record"
          style="cursor: pointer; color: #1776ff"
        >
          {{ Number(record.zfje).toLocaleString() }}
        </div>
        <div
          slot="action"
          slot-scope="text, record"
          style="cursor: pointer; color: #1776ff"
        >
          <a-popover
            trigger="click"
            placement="left"
            overlayClassName="pay-detail-pop"
          >
            <template slot="content">
              <div class="pay-detail-pop-item">
                <div class="item-label">项目名称：</div>
                <div class="item-value">{{ record.xmmc }}</div>
              </div>
              <div class="pay-detail-pop-item">
                <div class="item-label">收款人名称：</div>
                <div class="item-value">{{ record.skrmc }}</div>
              </div>
              <div class="pay-detail-pop-item">
                <div class="item-label">摘要：</div>
                <div class="item-value">{{ record.zy }}</div>
              </div>
              <div class="pay-detail-pop-item">
                <div class="item-label">经济科目名称：</div>
                <div class="item-value">{{ record.jjkmmc }}</div>
              </div>
              <div class="pay-detail-pop-item">
                <div class="item-label">功能科目名称：</div>
                <div class="item-value">{{ record.gnkmmc }}</div>
              </div>
              <div class="pay-detail-pop-item">
                <div class="item-label">支出方式名称：</div>
                <div class="item-value">{{ record.zcfsmc }}</div>
              </div>
              <div class="pay-detail-pop-item">
                <div class="item-label">政府采购方式：</div>
                <div class="item-value">{{ record.zfcgfs }}</div>
              </div>
              <div class="pay-detail-pop-item">
                <div class="item-label">结算方式：</div>
                <div class="item-value">{{ record.jsfs }}</div>
              </div>
              <div class="pay-detail-pop-item">
                <div class="item-label">支付账户名称：</div>
                <div class="item-value">{{ record.zfzhmc }}</div>
              </div>
              <div class="pay-detail-pop-item">
                <div class="item-label">支付银行名称：</div>
                <div class="item-value">{{ record.zfyhmc }}</div>
              </div>
              <div class="pay-detail-pop-item">
                <div class="item-label">清算银行名称：</div>
                <div class="item-value">{{ record.qsyhmc }}</div>
              </div>
              <div class="pay-detail-pop-item">
                <div class="item-label">收款人账户编号：</div>
                <div class="item-value">{{ record.skrzhbh }}</div>
              </div>
              <div class="pay-detail-pop-item">
                <div class="item-label">收款人账户银行：</div>
                <div class="item-value">{{ record.skrzhyh }}</div>
              </div>
              <div class="pay-detail-pop-item">
                <div class="item-label">行业名称：</div>
                <div class="item-value">{{ record.hymc }}</div>
              </div>
              <div class="pay-detail-pop-item">
                <div class="item-label">支付日期：</div>
                <div class="item-value">{{ record.zfrq }}</div>
              </div>
              <div class="pay-detail-pop-item">
                <div class="item-label">执行金额：</div>
                <div class="item-value">
                  {{ Number(record.zxje).toLocaleString() }}
                </div>
              </div>
            </template>
            <div class="project-detail-table-icon">
              <icon-svg icon-class="查看"></icon-svg>
            </div>
          </a-popover>
        </div>
      </a-table>
    </div>
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
  getPayDetailDes,
  getPayDetailTableOne,
  getPayDetailTableTwo,
  getProjectDetailChartOne,
} from "@/shared/newApi/block/projectDetail.js";
import { Popover, Progress, Tooltip } from "ant-design-vue";
import { mapMutations, mapState } from "vuex";

export default {
  name: "AssertsDetail",
  data() {
    return {
      projectName: null,
      curYear: null,
      curMonth: null,
      manageName: null,
      budgetName: null,
      dataIndex: null,

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

      desData: {
        projectName: null,
        unitName: null,
        budgetName: null,
        money: null,
      },

      //指定项目支付进度趋势折线图
      myChart1: null, //月趋势图
      graphData1: {
        // legend: ["项目名称"],
        // xAxis: [
        //   "1月",
        //   "2月",
        //   "3月",
        //   "4月",
        //   "5月",
        //   "6月",
        //   "7月",
        //   "8月",
        //   "9月",
        //   "10月",
        //   "11月",
        //   "12月",
        // ],
        // yAxis: {
        //   name: "金额",
        // },
        // seriesData: [
        //   {
        //     name: "项目名称",
        //     data: [83, 10, 7, 5, 9, 10, 5, 8, 7, 11, 10, 10],
        //     rate: [8, 10, 7, 5, 9, 10, 5, 8, 7, 11, 10, 10],
        //   },
        // ],
      },
      choosedMonth: null,

      //收款人情况表格
      columns1: [
        {
          title: "收款人名称",
          dataIndex: "skrmc",
          key: "skrmc",
          width: 250,
          scopedSlots: { customRender: "skrmc" },
        },
        {
          title: "支付金额（万元）",
          dataIndex: "zfje",
          key: "zfje",
          width: 392,
          scopedSlots: { customRender: "zfje" },
        },
      ],
      tableLoading1: false,
      tableData1: {
        dateList: [
          // {
          //   id: 0,
          //   skrmc: "收款人1",
          //   zfje: 13000,
          // },
          // {
          //   id: 1,
          //   skrmc: "收款人1",
          //   zfje: 13000,
          // },
          // {
          //   id: 2,
          //   skrmc: "收款人1",
          //   zfje: 13000,
          // },
          // {
          //   id: 3,
          //   skrmc: "收款人1",
          //   zfje: 13000,
          // },
          // {
          //   id: 4,
          //   skrmc: "收款人1",
          //   zfje: 13000,
          // },
          // {
          //   id: 5,
          //   skrmc: "收款人1",
          //   zfje: 13000,
          // },
          // {
          //   id: 6,
          //   skrmc: "收款人1",
          //   zfje: 13000,
          // },
        ],
        maxMoney: 1,
      },
      table1Name1: null,
      table1Index1: null,

      //支付明细表格
      tableLoading2: false,
      columns2: [
        {
          title: "支付日期",
          dataIndex: "zfrq",
          key: "zfrq",
          width: 160,
        },
        {
          title: "摘要",
          dataIndex: "zy",
          key: "zy",
          width: 300,
        },
        {
          title: "收款人名称",
          dataIndex: "skrmc",
          key: "skrmc",
          width: 200,
        },
        {
          title: "行业名称",
          dataIndex: "hymc",
          key: "hymc",
          width: 200,
        },
        {
          title: "经济科目名称",
          dataIndex: "jjkmmc",
          key: "jjkmmc",
          width: 200,
        },
        {
          title: "支付金额",
          dataIndex: "zfje",
          key: "zfje",
          width: 200,
          scopedSlots: { customRender: "zfje" },
        },

        {
          title: "操作",
          dataIndex: "action",
          key: "action",
          width: 80,
          scopedSlots: { customRender: "action" },
          // fixed: "right",
        },
      ],
      tableData2: {
        dateList: [
          // {
          //   id: 0,
          //   zfrq: "111",
          //   zy: "111",
          //   skrmc: "111",
          //   hymc: "111",
          //   jjkmmc: "111",
          //   zfje: 121212,
          //   xmmc: "项目名称",
          //   gnkmmc: "功能科目名称",
          //   zcfsmc: "支出方式名称",
          //   zfcgfs: "政府采购方式",
          //   jsfs: "结算方式",
          //   zfzhmc: "支付账户名称",
          //   zfyhmc: "支付银行名称",
          //   qsyhmc: "清算银行名称",
          //   skrzhbh: "收款人账户编号",
          //   skrzhyh: "收款人账户银行",
          //   zxje: 19999,
          // },
          // {
          //   id: 1,
          //   zfrq: "111",
          //   zy: "111",
          //   skrmc: "111",
          //   hymc: "111",
          //   jjkmmc: "111",
          //   zfje: 121212,
          //   xmmc: "项目名称",
          //   gnkmmc: "功能科目名称",
          //   zcfsmc: "支出方式名称",
          //   zfcgfs: "政府采购方式",
          //   jsfs: "结算方式",
          //   zfzhmc: "支付账户名称",
          //   zfyhmc: "支付银行名称",
          //   qsyhmc: "清算银行名称",
          //   skrzhbh: "收款人账户编号",
          //   skrzhyh: "收款人账户银行",
          //   zxje: 19999,
          // },
          // {
          //   id: 2,
          //   zfrq: "111",
          //   zy: "111",
          //   skrmc: "111",
          //   hymc: "111",
          //   jjkmmc: "111",
          //   zfje: 121212,
          //   xmmc: "项目名称",
          //   gnkmmc: "功能科目名称",
          //   zcfsmc: "支出方式名称",
          //   zfcgfs: "政府采购方式",
          //   jsfs: "结算方式",
          //   zfzhmc: "支付账户名称",
          //   zfyhmc: "支付银行名称",
          //   qsyhmc: "清算银行名称",
          //   skrzhbh: "收款人账户编号",
          //   skrzhyh: "收款人账户银行",
          //   zxje: 19999,
          // },
          // {
          //   id: 3,
          //   zfrq: "111",
          //   zy: "111",
          //   skrmc: "111",
          //   hymc: "111",
          //   jjkmmc: "111",
          //   zfje: 121212,
          //   xmmc: "项目名称",
          //   gnkmmc: "功能科目名称",
          //   zcfsmc: "支出方式名称",
          //   zfcgfs: "政府采购方式",
          //   jsfs: "结算方式",
          //   zfzhmc: "支付账户名称",
          //   zfyhmc: "支付银行名称",
          //   qsyhmc: "清算银行名称",
          //   skrzhbh: "收款人账户编号",
          //   skrzhyh: "收款人账户银行",
          //   zxje: 19999,
          // },
          // {
          //   id: 4,
          //   zfrq: "111",
          //   zy: "111",
          //   skrmc: "111",
          //   hymc: "111",
          //   jjkmmc: "111",
          //   zfje: 121212,
          //   xmmc: "项目名称",
          //   gnkmmc: "功能科目名称",
          //   zcfsmc: "支出方式名称",
          //   zfcgfs: "政府采购方式",
          //   jsfs: "结算方式",
          //   zfzhmc: "支付账户名称",
          //   zfyhmc: "支付银行名称",
          //   qsyhmc: "清算银行名称",
          //   skrzhbh: "收款人账户编号",
          //   skrzhyh: "收款人账户银行",
          //   zxje: 19999,
          // },
          // {
          //   id: 5,
          //   zfrq: "111",
          //   zy: "111",
          //   skrmc: "111",
          //   hymc: "111",
          //   jjkmmc: "111",
          //   zfje: 121212,
          //   xmmc: "项目名称",
          //   gnkmmc: "功能科目名称",
          //   zcfsmc: "支出方式名称",
          //   zfcgfs: "政府采购方式",
          //   jsfs: "结算方式",
          //   zfzhmc: "支付账户名称",
          //   zfyhmc: "支付银行名称",
          //   qsyhmc: "清算银行名称",
          //   skrzhbh: "收款人账户编号",
          //   skrzhyh: "收款人账户银行",
          //   zxje: 19999,
          // },
          // {
          //   id: 6,
          //   zfrq: "111",
          //   zy: "111",
          //   skrmc: "111",
          //   hymc: "111",
          //   jjkmmc: "111",
          //   zfje: 121212,
          //   xmmc: "项目名称",
          //   gnkmmc: "功能科目名称",
          //   zcfsmc: "支出方式名称",
          //   zfcgfs: "政府采购方式",
          //   jsfs: "结算方式",
          //   zfzhmc: "支付账户名称",
          //   zfyhmc: "支付银行名称",
          //   qsyhmc: "清算银行名称",
          //   skrzhbh: "收款人账户编号",
          //   skrzhyh: "收款人账户银行",
          //   zxje: 19999,
          // },
          // {
          //   id: 7,
          //   zfrq: "111",
          //   zy: "111",
          //   skrmc: "111",
          //   hymc: "111",
          //   jjkmmc: "111",
          //   zfje: 121212,
          //   xmmc: "项目名称",
          //   gnkmmc: "功能科目名称",
          //   zcfsmc: "支出方式名称",
          //   zfcgfs: "政府采购方式",
          //   jsfs: "结算方式",
          //   zfzhmc: "支付账户名称",
          //   zfyhmc: "支付银行名称",
          //   qsyhmc: "清算银行名称",
          //   skrzhbh: "收款人账户编号",
          //   skrzhyh: "收款人账户银行",
          //   zxje: 19999,
          // },
          // {
          //   id: 8,
          //   zfrq: "111",
          //   zy: "111",
          //   skrmc: "111",
          //   hymc: "111",
          //   jjkmmc: "111",
          //   zfje: 121212,
          //   xmmc: "项目名称",
          //   gnkmmc: "功能科目名称",
          //   zcfsmc: "支出方式名称",
          //   zfcgfs: "政府采购方式",
          //   jsfs: "结算方式",
          //   zfzhmc: "支付账户名称",
          //   zfyhmc: "支付银行名称",
          //   qsyhmc: "清算银行名称",
          //   skrzhbh: "收款人账户编号",
          //   skrzhyh: "收款人账户银行",
          //   zxje: 19999,
          // },
        ],
        total: 0,
      },
      pagination: {
        size: "small",
        total: 0,
        current: 1,
        pageSize: 20,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ["20", "50", "100"],
        showTotal: (total) => {
          return `共${total}条记录`;
        },
        onChange: (page, pageSize) => {
          this.pagination.current = page;
          this.pagination.pageSize = pageSize;
          this.getPayDetailTableTwo();
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = current;
          this.pagination.pageSize = size;
          this.getPayDetailTableTwo();
        },
      },
    };
  },
  components: {
    // SortModal,
    // CommonList,
    // ASelect: Select,
    // AIcon: Icon,
    // AButton: Button,
    // ARangePicker: RangePicker,
    APopover: Popover,
    ATooltip: Tooltip,
    AProgress: Progress,
    // ATreeSelect: TreeSelect,
  },
  computed: {
    ...mapState("blockAnalysis", ["blockChoosedYear", "choosedBlockId"]),
    // curYear: {
    //   get() {
    //     return this.blockChoosedYear;
    //   },
    // },
    //别删
    // choosedBlock: {
    //   get() {
    //     return this.choosedBlockId;
    //   },
    //   set(val) {
    //     const arr = this.blockOptions.filter((item) =>
    //       val.includes(item.value)
    //     );
    //     const name = arr.map((option) => option.label);
    //     this.setChoosedBlockName(name);
    //     this.setChoosedBlockId(val);
    //   },
    // },
  },
  beforeDestroy() {
    this.myChart1.dispose();
    const f = () => {
      this.myChart1.resize();
    };
    window.removeEventListener("resize", f);
  },
  mounted() {
    console.log("query传参", this.$route.query);
    this.projectName = this.$route.query.projectName;
    this.manageName = this.$route.query.manageName;
    this.budgetName = this.$route.query.budgetName;
    // this.initAllCharts();
    this.getAllData();
  },
  methods: {
    ...mapMutations("blockAnalysis", {
      setChoosedBlockName: "setChoosedBlockName",
      setChoosedBlockId: "setChoosedBlockId",
    }),

    async getAllData() {
      //获取项目支出明细标头内容
      this.getPayDetailDes();
      await this.initAllCharts();
      //获取收款人情况表格
      await this.getPayDetailTableOne();
      //获取支付明细表格
      await this.getPayDetailTableTwo();
    },

    //获取项目支出明细标头内容
    async getPayDetailDes() {
      const json = {
        unitName: this.budgetName, //预算单位名称
        deptName: this.manageName, //主管单位名称
        proName: this.projectName, //项目名称
      };
      const res = await getPayDetailDes(json);
      if (res.message === "成功") {
        this.desData = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //获取收款人情况表格
    async getPayDetailTableOne() {
      const json = {
        year: this.curYear,
        month: this.curMonth,
        unitName: this.budgetName, //预算单位名称
        deptName: this.manageName, //主管单位名称
        proName: this.projectName, //项目名称
      };
      this.tableLoading1 = true;
      const res = await getPayDetailTableOne(json);
      this.tableLoading1 = false;
      if (res.message === "成功") {
        this.tableData1 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //获取支付明细表格
    async getPayDetailTableTwo() {
      const json = {
        year: this.curYear,
        month: this.curMonth,
        unitName: this.budgetName, //预算单位名称
        deptName: this.manageName, //主管单位名称
        proName: this.projectName, //项目名称
        payeeName: this.table1Name1, //收款人名称
        pageSize: this.pagination.pageSize, //页面大小
        pageOffset: this.pagination.pageSize * (this.pagination.current - 1), //偏移量
      };
      this.tableLoading2 = true;
      const res = await getPayDetailTableTwo(json);
      this.tableLoading2 = false;
      if (res.message === "成功") {
        this.tableData2 = res.data;
        this.pagination.total = res.data.total;
      } else {
        this.$message.error(res.message);
      }
    },

    async initAllCharts() {
      await this.initEchartsOne();
      const f = () => {
        this.myChart1.resize();
      };
      window.addEventListener("resize", f);
    },

    // 指定项目支付进度月趋势
    async getProjectDetailChartOne() {
      const json = {
        unitName: this.budgetName, //预算单位名称
        deptName: this.manageName, //主管单位名称
        proName: this.projectName, //项目名称
      };
      const res = await getProjectDetailChartOne(json);
      if (res.message === "成功") {
        this.graphData1 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },
    async initEchartsOne() {
      //联动需要先clear
      if (this.myChart1) {
        this.myChart1.dispose();
      }
      this.myChart1 = this.$echarts.init(this.$refs.graph1);
      await this.getProjectDetailChartOne();
      const _that = this;
      //整体支出均衡性
      const option1 = {
        // tooltip: {
        //   enterable: true,
        //   //trigger: "axis",
        //   // triggerOn: "click",
        //   triggerOn: "mousemove", // 设置触发方式为悬停
        //   formatter: function (params) {
        //     if (params.seriesName.length === 0) {
        //       return ""; // 没有数据时，不显示 tooltip
        //     }
        //     return `<div class="ratio-tooltip-box" style="pointer-events:auto">
        //       <a onClick="goManagePortrait('${
        //         params.seriesName
        //       }')">主管单位名称：${params.seriesName}</a>
        //       <div>年度：${_that.blockChoosedYear}</div>
        //       <div>月份：${params.name}年</div>
        //       <div>三公费用类型：${
        //         _that.lastSelectedName ? _that.lastSelectedName : "全部"
        //       }</div>
        //       <div>月度费用：${Number(params.data).toLocaleString()}元</div>
        //       <div>年度费用：${Number(_that.yearMoney).toLocaleString()}元</div>
        //       <div>占比：${
        //         _that.graphData1.seriesData[params.seriesIndex].rate[
        //           params.dataIndex
        //         ]
        //       }%</div>
        //     </div>`;
        //   },
        // },
        legend: {
          type: "scroll",
          // top: 10,
          data: this.graphData1.legend,
          // data: [],
        },

        grid: {
          x: 35, //左
          y: 40, //上
          x2: 20, //右
          y2: 10,
          containLabel: true,
        },
        emphasis: {
          focus: "series",
        },
        xAxis: [
          {
            type: "category",
            data: this.graphData1.xAxis,
            triggerEvent: true,
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
              color: function (value, index) {
                console.log("axisLabel", value, index, _that.dataIndex);
                return index == _that.dataIndex ? "#035ef7" : "#454545";
              },
              fontWeight: function (index) {
                return index == _that.dataIndex ? "bold" : "normal";
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
        yAxis: {
          type: "value",
          name: this.graphData1.yAxis.name + "（万元）",
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
        //横向滚动条
        dataZoom: [
          {
            show: true,
            height: 6,
            bottom: 0,
            startValue: 0, //起始值
            endValue: 9, //结束值
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
        series: [],
      };

      // 月度
      for (let i = 0; i < this.graphData1.seriesData.length; i++) {
        option1.series.push({
          type: "line",
          // stack: "Total",
          name: this.graphData1.seriesData[i].name,
          data: this.graphData1.seriesData[i].data,
          color: this.lineColor[i],
          label: {
            show: true,
            position: "top",
            formatter: function (params) {
              return params.value.toLocaleString();
            },
          },

          // symbol: function (param) {
          //   if (param > _that.ratioNumber) {
          //     return "diamond";
          //   } else {
          //     return "circle";
          //   }
          // },
          // symbolSize: function (param) {
          //   console.log("212121212", param, param.dataIndex);
          //   if (param.name === _that.choosedMonth) {
          //     return 13;
          //   } else {
          //     return 5;
          //   }
          // },
        });
      }
      this.myChart1.setOption(option1, true);
      //图表背景色
      // handleAddEchartsBackground(this.myChart1, option1, this.graphData1.xAxis);
      this.myChart1.on("click", function (params) {
        console.log("params", params);
        if (_that.dataIndex === params.dataIndex) {
          _that.dataIndex = null;
          _that.curMonth = null;
          _that.curYear = null;
          _that.table1Name1 = null;
         _that.table1Index1 = null;
        } else {
          _that.dataIndex = params.dataIndex;
          _that.curMonth = params.value.split("-")[1];
          _that.curYear = params.value.split("-")[0];
          _that.table1Name1 = null;
          _that.table1Index1 = null;
        }

        console.log("params", _that.dataIndex);
        _that.resetPagination();
        // _that.choosedMonth = params.name;
        // console.log(_that.choosedMonth);
        _that.initEchartsOne();
        _that.getPayDetailTableOne();
        _that.getPayDetailTableTwo();
      });
    },

    //点击表格2的单元格
    handleClickUnitName1(text, index) {
      this.resetPagination();
      if (this.table1Index1 === index) {
        this.table1Index1 = null;
        this.table1Name1 = null;
      } else {
        this.table1Index1 = index;
        this.table1Name1 = text;
      }
      this.getPayDetailTableTwo(); //重新获取支付明细表格
    },

    resetPagination() {
      this.pagination.current = 1;
      this.pagination.pageSize = 20;
      this.pagination.total = 0;
    },
  },
};
</script>
<style lang="less">
.project-detail {
  width: 100%;
  height: 100%;
  padding: 20px;
  background: #fff;

  &-des {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    margin-bottom: 20px;
    grid-template-rows: 20px;

    &-item {
      display: flex;
      align-items: center;

      &-label {
        color: #97a3b7;
      }
    }
  }

  &-wrapper {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;

    &-left {
      width: calc(60% - 10px);
      margin-right: 20px;

      &-wrapper-box {
        // width: calc(35% - 10px);
        border-radius: 6px;
        border: 1px solid #d6dbe3;
        background: #fff;
        height: 244px;
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

        //图片本身
        .wrapper-content {
          width: 100%;
          height: calc(100% - 43px);
          // height: 361px;
          display: flex;
          flex-direction: column;
          justify-content: center;

          &-graph {
            width: 100%;
            height: 100%;
            margin: 0 auto;
          }
        }
      }
    }

    &-right {
      width: calc(40% - 10px);

      &-table {
        .ant-table-row {
          &:hover {
            td {
              background: transparent !important;
            }
          }
        }

        .custom-cell-a {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          display: flex;
          align-items: center;
          padding: 9px 11px;
          cursor: pointer;

          &.selected {
            background: #e6f7ff !important;
          }
        }
      }
    }
  }

  &-table {
    &-icon {
      width: 16px;
      height: 16px;
    }
  }
}
</style>
