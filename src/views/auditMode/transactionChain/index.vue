<template>
  <div class="transaction-chain">
    <div class="transaction-chain-graph">
      <div class="graph-filter">
        <!-- new do -->
        <div class="graph-filter-btns">
          <a-tooltip placement="top">
            <template slot="title">
              <span
                >打开"中心企业切换开关后，点击下图中的企业名称可完成切换操作"</span
              >
            </template>
            <a-icon
              type="info-circle"
              style="margin-right: 4px; cursor: pointer"
            />
          </a-tooltip>
          <span class="content-label">中心企业切换：</span>
          <a-switch
            class="content-input"
            checked-children="开"
            un-checked-children="关"
            v-model="isCenterChange"
            @change="handleCenterChange"
          />
        </div>
        <div class="graph-filter-btns">
          <span class="content-label">Top值：</span>
          <a-input-number
            placeholder="请选择"
            :min="1"
            :max="50"
            v-model="showNumber"
            style="width: 70px; margin-right: 8px"
          />
        </div>
        <div class="graph-filter-btns">
          <span class="content-label">是否同一集团：</span>
          <a-select
            :options="typeOptions"
            class="content-input"
            placeholder="请选择"
            v-model="typeValue"
            @change="getTransactionData"
          />
        </div>
        <div class="graph-filter-btns">
          <span class="content-label">年份筛选：</span>
          <!-- <a-select
            :options="yearOptions"
            class="content-input"
            placeholder="请选择"
            v-model="yearValue"
            @change="getTransactionData"
          /> -->
          <a-date-picker
            v-model="yearValue"
            mode="year"
            format="YYYY"
            :open="yearShow"
            class="content-input"
            style="width: 115px"
            @openChange="openChangeYear"
            @panelChange="panelChangeYear"
          />
        </div>
        <div class="graph-filter-btns">
          <!-- <a-button
            type="primary"
            class="graph-filter-btn"
            @click="handleFilter"
          >
            <icon-svg icon-class="icon_filter" />筛选
          </a-button> -->

          <!-- <div class="filter-content">
            <div class="filter-content-item">
              <span class="content-label">年份筛选：</span>
              <a-select
                :options="yearOptions"
                class="content-input"
                placeholder="请选择"
                v-model="yearValue"
              />
            </div>
            <div class="filter-content-item">
              <span class="content-label">是否同一集团：</span>
              <a-select
                :options="typeOptions"
                class="content-input"
                placeholder="请选择"
                v-model="typeValue"
              />
            </div>
          </div> -->

          <a-button class="graph-filter-btn" @click="handleTagsShow">
            <icon-svg icon-class="tag" />标签
          </a-button>
        </div>
      </div>
      <div class="graph-content">
        <div class="graph-content-box">
          <div class="box-title">
            <span class="box-title-text">上下游交易链分析</span>
            <a-icon type="info-circle" />
          </div>
          <div class="box-graph-title">
            <span
              :style="{
                left: direction === 'left' ? '35%' : '15%',
                display: leftShow ? 'inline' : 'none',
              }"
              ref="title1"
              >上游TOP{{ showNumber }}销方</span
            >
            <span
              :style="{
                left: leftShow
                  ? rightShow
                    ? direction === 'right'
                      ? '39%'
                      : direction === 'left'
                      ? '59%'
                      : '49%'
                    : '79%'
                  : '15%',
              }"
              ref="title2"
              >当前企业</span
            >
            <span
              :style="{
                right: direction === 'right' ? '37%' : '17%',
                display: rightShow ? 'inline' : 'none',
              }"
              ref="title3"
              >下游TOP{{ showNumber }}购方</span
            >
          </div>
          <div class="box-graph" ref="graph1"></div>
          <div class="box-tips">
            <a-badge color="#47E0C1" text="上游销方" />
            <a-badge color="#30BFE2" text="下游购方" />
            <a-badge color="#4980CB" text="所属同一集团或存在股权关系" />
          </div>
          <div class="box-tips">
            <span class="box-tips-title">交互提示：</span>
            <span class="box-tips-content">
              1.鼠标移入到飘带，展示发票金额和发票数量。2.单击飘带，展示货物分类明细占比
              3.单击柱状色块，向外扩展一层企业 4.双击柱状色块，展示企业标签
              5.双击飘带，展示该企业的发票明细
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="transaction-chain-table">
      <div class="sub-title">数据筛选</div>
      <a-button class="business-table-btn" @click="handleChangebtn(1)">
        <!-- {{ foldValue1 ? "收起" : "展开" }} -->
        <a-icon :type="foldValue1 ? 'up' : 'down'" />
      </a-button>
      <div
        :class="
          foldValue1
            ? 'transaction-chain-table-content'
            : 'transaction-chain-table fold'
        "
      >
        <div class="table-content">
          <div class="table-content-item">
            <label class="item-label">时间维度:</label>
            <div class="item-content">
              <a-radio-group
                default-value="0"
                button-style="solid"
                v-model="timeValue"
                @change="changeTimeValue"
              >
                <a-radio-button :value="0">年度</a-radio-button>
                <a-radio-button :value="1">季度</a-radio-button>
                <a-radio-button :value="2">月度</a-radio-button>
              </a-radio-group>
            </div>
          </div>
        </div>
        <data-graphs ref="dataGraphs" :list="graphList" />
      </div>
    </div>
    <div class="transaction-chain-table">
      <DetailTable
        tableTitle="发票金额和数量统计"
        :foldValue="foldValue2"
        :columns="columns1"
        :infoData="detailDataList"
        :pagination="pagination"
        tableClass="features-table2"
        :loading="tableLoading"
        :infoQuery="infoQuery"
        @handleChangebtn="handleChangebtn(2)"
      >
        <div slot="searchOption">
          <div class="business-options">
            <div class="business-options-item">
              <label class="item-label first-type">购方名称：</label>
              <div class="item-content first-type">
                <a-input
                  type="text"
                  class="item-content-longInput"
                  placeholder="请输入"
                  v-model="buyValue"
                />
              </div>
            </div>
            <div class="business-options-item">
              <label class="item-label second-type">销方名称：</label>
              <div class="item-content second-type">
                <a-input
                  type="text"
                  class="item-content-longInput"
                  placeholder="请输入"
                  v-model="saleValue"
                />
              </div>
            </div>
            <div class="business-options-item">
              <label class="item-label">开票日期：</label>
              <div class="item-content">
                <a-range-picker
                  :placeholder="['开始年份', '截止年份']"
                  class="item-content-input"
                  format="YYYY"
                  valueFormat="YYYY"
                  :value="startStopTime"
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
          </div>
          <div class="business-options">
            <div class="business-options-item">
              <label class="item-label first-type">商品三级分类：</label>
              <div class="item-content first-type">
                <a-select
                  :options="thirdOptions"
                  class="item-content-longInput"
                  placeholder="请选择"
                  v-model="thirdValue"
                />
              </div>
            </div>
            <div class="business-options-item">
              <label class="item-label second-type">货物或应税劳务名称：</label>
              <div class="item-content second-type">
                <a-input
                  placeholder="请输入"
                  class="item-content-longInput"
                  v-model.trim="inputValue"
                />
              </div>
            </div>
            <div class="business-options-item">
              <div class="item-buttons">
                <a-button class="button-left" @click="reset">重置</a-button>
                <a-button
                  type="primary"
                  class="button-right"
                  icon="search"
                  @click="getAllBillDetail('init')"
                  >查询</a-button
                >
              </div>
            </div>
          </div>
        </div>
      </DetailTable>
    </div>
    <!-- <div class="transaction-chain-tag" @click="handleTagsShow">
      <icon-svg icon-class="tag" />
    </div>-->
    <a-drawer
      :width="400"
      title="企业标签"
      placement="right"
      :visible="tagsShow"
      @close="onClose"
      :maskStyle="{
        background: 'transparent',
      }"
      class="enterprise-tags-drawer"
    >
      <p class="enterprise-name">
        <!-- <img
          src="@/assets/images/img/enterprise.svg"
          alt=""
          class="enterprise-name-img"
        />-->
        <icon-svg icon-class="icon_house" class="icon-house" />
        <span class="enterprise-name-text">{{ enterpriseName }}</span>
      </p>
      <div class="enterprise-tags">
        <div
          class="tag-item"
          v-for="(item, index) in enterpriseTags"
          :key="index"
        >
          <div class="tag-item-title">{{ item.title }}</div>
          <div class="tag-item-content">
            <div
              :class="tag.isActive ? 'content-tag active' : 'content-tag'"
              v-for="(tag, num) in item.tags"
              :key="num"
            >
              <a-tooltip
                v-if="tag.text.length > 5"
                placement="topLeft"
                overlayClassName="item-content-tooltip"
              >
                <template slot="title">
                  <span>{{ tag.text }}</span>
                </template>
                {{ tag.text.slice(0, 5) + "..." }}
              </a-tooltip>
              <span v-else>{{ tag.text }}</span>
              <!-- {{ tag.text }} -->
            </div>
          </div>
        </div>
      </div>
    </a-drawer>

    <!-- 单击飘带 -->
    <drag-modal
      class="goods-type-details-modal"
      :visible="visible"
      title="货物分类明细"
      :footer="null"
      :mask="false"
      @cancel="onCancel"
      centered
      :bodyStyle="{
        height: '350px',
        width: '100%',
        overflow: 'auto',
      }"
    >
      <div class="goods-type-details-graph">
        <data-graphs ref="dataGraphs2" :list="graphList2" />
      </div>
    </drag-modal>
    <!-- 双击飘带 -->
    <drag-modal
      class="invoice-details-modal"
      :visible="detailsVisible"
      :footer="null"
      :mask="false"
      :width="800"
      :dialogStyle="modalStyle"
      @cancel="onDetailsCancel"
      title="发票明细"
      :bodyStyle="{
        height: '800px',
        width: '960px',
        overflow: 'auto',
      }"
    >
      <template slot="title">
        <span>发票明细</span>
        <img
          v-if="edgeDirection === 'right'"
          src="@/assets/images/img/downstream_buy.png"
          alt
        />
        <img v-else src="@/assets/images/img/upstream_sale.png" alt />
      </template>
      <div class="modal-content" ref="detailsModalContent">
        <p class="modal-content-title">
          <span
            class="modal-content-title-label"
            v-if="edgeDirection === 'right'"
            >购方名称：</span
          >
          <span class="modal-content-title-label" v-else>销方名称：</span>
          <span class="modal-content-title-value">{{ targetName }}</span>
        </p>
        <div class="modal-content-table">
          <a-table
            :columns="columns"
            :data-source="dataList"
            :rowKey="(record) => record.index"
            :pagination="pagination1"
            class="features-table2"
            border
          />
        </div>
      </div>
    </drag-modal>
    <!-- <a-modal
      class="transaction-filter-modal"
      :width="572"
      :visible="transactionFilterVisible"
      :destroyOnClose="true"
      @cancel="onFilterCancel"
      okText="查询"
      @ok="getTransactionData"
      :mask="false"
      title="筛选条件"
      centered
    >
      <div class="filter-modal-content">
        <div class="filter-modal-content-item">
          <span class="content-label">年份筛选：</span>
          <a-select
            :options="yearOptions"
            class="content-input"
            placeholder="请选择"
            v-model="yearValue"
          />
        </div>
        <div class="filter-modal-content-item">
          <span class="content-label">是否同一集团：</span>
          <a-select
            :options="typeOptions"
            class="content-input"
            placeholder="请选择"
            v-model="typeValue"
          />
        </div>
      </div>
    </a-modal> -->
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
import DragModal from "@/components/dragModal";
import {
  billDetail,
  billTab,
  queryEntLable,
  queryGoodsClassify,
  queryLowerEnt,
  queryStatisticReceipt,
  queryUpperEnt,
} from "@/shared/api/auditMode.js";
import { scrollToBottom } from "@/utils/common.js";
import { handleAddEchartsBackground } from "@/utils/echarts.js";
import {
  Badge,
  Button,
  DatePicker,
  Drawer,
  Icon,
  Input,
  InputNumber,
  Radio,
  Switch,
  Tooltip,
} from "ant-design-vue";
import { cloneDeep, find, unionBy } from "lodash";
import { nanoid } from "nanoid";
import { mapMutations, mapState } from "vuex";
import DataGraphs from "../components/dataGraphs";
import DetailTable from "../components/detailTable";

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { RangePicker } = DatePicker;

export default {
  name: "TransactionChain",
  data() {
    return {
      yearShow: false,
      yearOptions: [
        {
          value: "2017",
          label: "2017",
        },
        {
          value: "2018",
          label: "2018",
        },
        {
          value: "2019",
          label: "2019",
        },
        {
          value: "2020",
          label: "2020",
        },
        {
          value: "2021",
          label: "2021",
        },
      ],
      yearValue: "2020",
      typeOptions: [
        {
          label: "全部",
          value: "",
        },
        {
          label: "是",
          value: "是",
        },
        {
          label: "否",
          value: "否",
        },
      ],
      typeValue: "",
      //中心企业切换
      isCenterChange: false,
      //上下游展示数量
      showNumber: 10,
      myChart1: null, //上下游图表
      myChart2: null, //发票金额统计柱状图
      myChart3: null, //发票数量统计柱状图
      myChart4: null, //单击飘带展示的货物明细饼图
      dataValue: "0",
      timeValue: 0,
      dateValue: "1",
      columns: [
        {
          title: "序号",
          dataIndex: "index",
          key: "index",
          width: 62,
        },
        {
          title: "金额",
          dataIndex: "money",
          key: "money",
          width: 190,
        },
        {
          title: "税额",
          dataIndex: "taxMoney",
          key: "taxMoney",
          width: 190,
        },
        {
          title: "税率",
          dataIndex: "tax",
          key: "tax",
          width: 190,
        },
        {
          title: "开票日期",
          dataIndex: "time",
          key: "time",
          width: 184,
          sorter: true,
        },
        {
          title: "发票类型",
          dataIndex: "type",
          key: "type",
          width: 190,
        },
        {
          title: "发票代码",
          dataIndex: "invoiceIndex",
          key: "invoiceIndex",
          width: 190,
        },
        {
          title: "发票号码",
          dataIndex: "invoiceNumber",
          key: "invoiceNumber",
          width: 190,
        },
        // {
        //   title: "商品一级分类",
        //   dataIndex: "firstType",
        //   key: "firstType",
        //   width: 190,
        // },
        // {
        //   title: "商品二级分类",
        //   dataIndex: "secondType",
        //   key: "secondType",
        //   width: 190,
        // },
        // {
        //   title: "商品三级分类",
        //   dataIndex: "thirdType",
        //   key: "thirdType",
        //   width: 190,
        // },
      ],
      columns1: [
        {
          title: "序号",
          dataIndex: "index",
          key: "index",
          width: 62,
        },
        {
          title: "货物或应税劳务名称",
          dataIndex: "name",
          key: "name",
          width: 184,
        },
        {
          title: "开票日期",
          dataIndex: "time",
          key: "time",
          width: 184,
        },
        {
          title: "单价（元）",
          dataIndex: "price",
          key: "price",
          width: 190,
        },
        {
          title: "数量",
          dataIndex: "number",
          key: "number",
          width: 100,
        },
        {
          title: "金额（元）",
          dataIndex: "money",
          key: "money",
          width: 190,
        },
        {
          title: "税率",
          dataIndex: "tax",
          key: "tax",
          width: 100,
        },
        {
          title: "价税合计（元）",
          dataIndex: "total",
          key: "total",
          width: 190,
        },
        {
          title: "购方名称",
          dataIndex: "buyName",
          key: "buyName",
          width: 220,
        },
        {
          title: "销方名称",
          dataIndex: "saleName",
          key: "saleName",
          width: 220,
        },
        {
          title: "发票号码",
          dataIndex: "invoiceNumber",
          key: "invoiceNumber",
          width: 190,
        },
        {
          title: "发票代码",
          dataIndex: "invoiceIndex",
          key: "invoiceIndex",
          width: 190,
        },
        {
          title: "商品一级分类",
          dataIndex: "firstType",
          key: "firstType",
          width: 190,
        },
        {
          title: "商品二级分类",
          dataIndex: "secondType",
          key: "secondType",
          width: 190,
        },
        {
          title: "商品三级分类",
          dataIndex: "thirdType",
          key: "thirdType",
          width: 190,
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
          this.getAllBillDetail();
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = 1;
          this.pagination.pageSize = size;
          this.getAllBillDetail();
        },
      },
      pagination1: {
        size: "small",
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ["5", "10", "15", "20"],
        showTotal: (total, current) => {
          return `共${total}条记录，当前第${Math.ceil(
            current[0] / this.pagination1.pageSize
          )}页`;
        },
        onChange: (page, pageSize) => {
          this.pagination1.current = page;
          this.pagination1.pageSize = pageSize;
          this.getBillDetail();
        },
        onShowSizeChange: (current, size) => {
          this.pagination1.current = 1;
          this.pagination1.pageSize = size;
          this.getBillDetail();
        },
      },
      dataList: [], //双击飘带展示的发票明细表
      detailDataList: [], //底部发票金额和数量统计总表
      infoQuery: {},
      visible: false,
      detailsVisible: false,
      tagsShow: false,
      enterpriseName: "",
      enterpriseTags: [],
      graphList: [],
      graphList2: [
        {
          title: "",
          ref: "graph4",
          width: "100%",
          paddingTop: "344px",
        },
      ],
      foldValue1: true,
      foldValue2: true,
      buyValue: undefined,
      saleValue: undefined,
      inputValue: undefined,
      firstValue: undefined,
      firstOptions: [],
      secondValue: undefined,
      secondOptions: [],
      thirdValue: "",
      thirdOptions: [
        {
          label: "全部",
          value: "",
        },
      ],
      startStopTime: [],
      nodeData: [],
      linkData: [],
      isSpread: false, // 是否展开下一层或上一层
      direction: undefined, // 展开的是左边还是右边
      edgeDirection: undefined, // 点击的边是左边还是右边
      targetName: undefined, // 购方/销方名称
      modalStyle: {},
      transactionFilterVisible: false,
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
      graphData: {
        xAxis: [],
        money: {
          yearData: [],
          quarterData1: [],
          quarterData2: [],
          quarterData3: [],
          quarterData4: [],
          monthData1: [],
          monthData2: [],
          monthData3: [],
          monthData4: [],
          monthData5: [],
          monthData6: [],
          monthData7: [],
          monthData8: [],
          monthData9: [],
          monthData10: [],
          monthData11: [],
          monthData12: [],
        },
        number: {
          yearData: [],
          quarterData1: [],
          quarterData2: [],
          quarterData3: [],
          quarterData4: [],
          monthData1: [],
          monthData2: [],
          monthData3: [],
          monthData4: [],
          monthData5: [],
          monthData6: [],
          monthData7: [],
          monthData8: [],
          monthData9: [],
          monthData10: [],
          monthData11: [],
          monthData12: [],
        },
      },
      tableLoading: false,
      leftShow: true, // 判断初始化时桑基图上下游是否有数据，有的话则true--展示
      rightShow: true,
    };
  },
  components: {
    ABadge: Badge,
    AButton: Button,
    ADrawer: Drawer,
    AIcon: Icon,
    AInput: Input,
    AInputNumber: InputNumber,
    ARadioGroup: RadioGroup,
    ARadioButton: RadioButton,
    ARangePicker: RangePicker,
    ADatePicker: DatePicker,
    DataGraphs,
    DetailTable,
    DragModal,
    ATooltip: Tooltip,
    ASwitch: Switch,
  },
  watch: {
    showNumber(newVal) {
      if (newVal > 50) {
        this.showNumber = 50;
      } else if (newVal < 1) {
        this.showNumber = 1;
      }
      this.getTransactionData();
    },
  },
  computed: {
    ...mapState("auditOptions", ["paramsObj"]),
  },
  async mounted() {
    this.graphList = [
      {
        commonHeader: "发票金额统计",
        title: this.paramsObj.corpName,
        ref: "graph2",
        width: "calc((100% - 24px) / 2)",
        paddingTop: "407px",
      },
      {
        commonHeader: "发票数量统计",
        title: this.paramsObj.corpName,
        ref: "graph3",
        width: "calc((100% - 24px) / 2)",
        paddingTop: "407px",
      },
    ];
    this.queryStatisticReceipt(); // 发票金额统计+发票数量统计柱状图表数据获取
    this.queryEntLable(this.paramsObj.uniScId); //当前企业标签获取
    await this.getTransactionData();
    this.buyValue = this.paramsObj.corpName;

    // this.nodeData
    console.log("this.nodeData", this.nodeData, this.nodeData[1]);
    this.saleValue = this.nodeData[1].value;
    this.getAllBillDetail("init");
    this.getBillTab();
    const f = () => {
      this.myChart1.resize();
      this.myChart2.resize();
      this.myChart3.resize();
    };
    window.addEventListener("resize", f);
  },
  beforeDestroy() {
    this.myChart1.clear();
    this.myChart2.clear();
    this.myChart3.clear();
    const f = () => {
      this.myChart1.resize();
      this.myChart2.resize();
      this.myChart3.resize();
    };
    window.removeEventListener("resize", f);
  },
  methods: {
    //todo
    ...mapMutations("auditOptions", {
      setParamsObj: "setParamsObj",
    }),

    init() {
      console.log("initGraph", this.nodeData, this.linkData);
      this.myChart1 = this.$echarts.init(this.$refs.graph1);
      const _that = this;
      const option1 = {
        title: {},
        tooltip: {
          className: "sankey-tooltip",
          trigger: "item",
          triggerOn: "mousemove",
          formatter: function (params) {
            console.log("鼠标移入", params);
            //鼠标移入弹框展示内容   todo   新增需求
            if (params.dataType === "edge") {
              return `<div class="tooltip-box" style="pointer-events:auto">
              <div class="tooltip-box-item">销方：${params.data.xfmc}</div>
              <div class="tooltip-box-item">发票开具总数量：${params.data.fpkjsl}张</div>
              <div class="tooltip-box-item">发票开具总金额：${params.data.fpkjje}元</div>
              <div class="tooltip-box-item">发票开具价税合计总额：${params.data.fpkjjshjze}万元</div>
              <div class="tooltip-box-item">购方：${params.data.gfmc}</div>
              <div class="tooltip-box-item">收受发票数量：${params.data.ssfpsl}张</div>
              <div class="tooltip-box-item">收受发票金额：${params.data.ssfpje}元</div>
              <div class="tooltip-box-item">收受发票价税合计金额：${params.data.ssfpjshjje}万元</div>
            </div>`;
            }

            // if (params.dataType === "edge") {
            //   return (
            //     "发票金额：" +
            //     params.value.toLocaleString() +
            //     "元" +
            //     "<br/>(" +
            //     params.data.numValue +
            //     "张)"
            //   );
            // }
          },
        },
        series: {
          type: "sankey",
          layout: "none",
          left: "18%",
          emphasis: {
            focus: "none",
          },
          draggable: false,
          layoutIterations: 0,
          nodeGap: 15,
          label: {
            fontSize: 14,
            formatter: (params) => {
              console.log("params-------", params);
              if (params.data.value === _that.paramsObj.corpName) {
                return params.value;
              } else {
                // 添加空格，以填补色块宽度
                if (params.data.position === "right") {
                  return (
                    "价税合计：" +
                    params.data.priceData.toLocaleString() +
                    "元（" +
                    params.data.numData +
                    "张）" +
                    "      " +
                    params.data.value
                  );
                } else {
                  return (
                    params.data.value +
                    "      " +
                    "价税合计：" +
                    params.data.priceData.toLocaleString() +
                    "元(" +
                    params.data.numData +
                    "张)"
                  );
                }
              }
            },
          },
          labelLayout(params) {
            console.log("params", params);
            const index = params.dataIndex;
            const option =
              (_that.myChart1 && _that.myChart1.getOption()) || option1;
            console.log("option", option);
            const reg = /[a-zA-Z]/g; // 英文字符
            const data = option.series[0].data[index];
            console.log("data----------", data);
            const len = (data.value && data.value.length) || 0;
            const num = _that.check(reg, data.value); // 检测英文字符数量
            if (data.position) {
              if (data.position === "left") {
                return {
                  x: params.rect.x - 14 * (len - num) - 9 * num - 3,
                  y: params.rect.y + params.rect.height / 2,
                  verticalAlign: "middle",
                  align: "left",
                };
              } else {
                return {
                  x:
                    params.rect.x -
                    params.labelRect.width +
                    14 * (len - num) +
                    9 * num +
                    params.rect.width +
                    4,
                  y: params.rect.y + params.rect.height / 2,
                  verticalAlign: "middle",
                  align: "left",
                };
              }
            } else {
              return {
                x: params.rect.x + params.rect.width + 4,
                y: params.rect.y + params.rect.height / 2,
                verticalAlign: "middle",
                align: "left",
              };
            }
          },
          data: this.nodeData,
          links: this.linkData,
          lineStyle: {
            color: "#4980CB",
          },
        },
      };
      this.myChart1.clear();
      setTimeout(this.myChart1.setOption(option1), 500);
      // this.myChart1.setOption(option1);
      const option = this.myChart1.getOption();
      let clickType = false; // 是否是双击事件，解决双击事件会触发单击事件的bug

      this.myChart1.off("dblclick");
      this.myChart1.on("dblclick", (e) => {
        clickType = true;
        if (e.dataType === "edge") {
          // 双击边
          this.startStopTime = [];
          this.thirdValue = "";
          this.inputValue = undefined;

          this.buyValue = e.data.target.split("_")[0];
          this.saleValue = e.data.source.split("_")[0];
          this.getBillDetail("init");
          this.getAllBillDetail("init");
          this.getBillTab();

          this.detailsVisible = true;
          this.edgeDirection = e.data.position;
          this.targetName =
            e.data.position === "right"
              ? e.data.target.split("_")[0]
              : e.data.source.split("_")[0];
          let left = "";
          if (e.data.position === "right") {
            if (e.data.isNew) {
              left =
                this.$refs.title3.getBoundingClientRect().left -
                800 +
                57 +
                "px";
            } else {
              left =
                this.$refs.title2.getBoundingClientRect().left -
                800 +
                25 +
                "px";
            }
          } else {
            if (e.data.isNew) {
              left = this.$refs.title1.getBoundingClientRect().left + 73 + "px";
            } else {
              left = this.$refs.title2.getBoundingClientRect().left + 47 + "px";
            }
          }
          this.modalStyle = {
            left,
          };
        } else {
          // 双击点 展示企业标签
          const node = this.nodeData.filter((item) => item.value === e.value);
          this.queryEntLable(node[0].uniScId);
          this.enterpriseName = e.value;
          this.tagsShow = true;
        }
      });

      this.myChart1.off("click");
      this.myChart1.on("click", (e) => {
        e.event.event.stopPropagation();
        e.event.event.preventDefault();
        clickType = false;
        setTimeout(async () => {
          if (clickType) return;
          if (e.dataType === "node") {
            // 点击点
            console.log("click1", e);
            //todo  需求3：根据isCenterChange的值判断，为true时将paramsObj设置为当前企业
            //我理解是将auditOptions仓库中的paramsObj替换为当前点击项即可，然后执行mounted中的方法
            if (this.isCenterChange) {
              console.log("替换中心企业");
              this.setParamsObj({
                corpName: e.value,
                uniScId: e.data.uniScId,
              });
              this.direction = undefined;
              this.graphList = [
                {
                  commonHeader: "发票金额统计",
                  title: this.paramsObj.corpName,
                  ref: "graph2",
                  width: "calc((100% - 24px) / 2)",
                  paddingTop: "407px",
                },
                {
                  commonHeader: "发票数量统计",
                  title: this.paramsObj.corpName,
                  ref: "graph3",
                  width: "calc((100% - 24px) / 2)",
                  paddingTop: "407px",
                },
              ];
              this.queryStatisticReceipt(); // 发票金额统计+发票数量统计柱状图表数据获取
              this.queryEntLable(this.paramsObj.uniScId); //当前企业标签获取
              await this.getTransactionData();
              this.buyValue = this.paramsObj.corpName;
              // this.nodeData
              // console.log("this.nodeData", this.nodeData, this.nodeData[1]);
              this.saleValue = this.nodeData[1].value;
              this.getAllBillDetail("init");
              this.getBillTab();
              const f = () => {
                this.myChart1.resize();
                this.myChart2.resize();
                this.myChart3.resize();
              };
              window.addEventListener("resize", f);
            } else {
              if (e.value === this.paramsObj.corpName || e.data.isNew) {
                // 点击当前企业或者是新加入的企业--展示企业标签
                this.enterpriseName = e.value;
                this.tagsShow = true;
                this.queryEntLable(this.paramsObj.uniScId);
              } else {
                if (this.enterpriseName === e.value && this.isSpread) {
                  // 点击有孩子的企业--收起孩子
                  option.series[0].data = this.nodeData;
                  option.series[0].links = this.linkData;
                  this.myChart1.setOption(option);
                  this.isSpread = false;
                  this.direction = undefined;
                } else {
                  // 展开孩子
                  this.enterpriseName = e.value;
                  const targetLink = find(
                    this.linkData,
                    (v) => v.source === e.name || v.target === e.name
                  );
                  const flag = targetLink.source === e.name ? true : false; // 判断是上游还是下游，上游true，下游false
                  let option = this.myChart1.getOption();
                  let data = cloneDeep(this.nodeData);
                  let links = cloneDeep(this.linkData);
                  let graphData = {
                    nodeData: [],
                    linkData: [],
                  };
                  if (flag) {
                    option.series[0].nodeAlign = "right";
                    // 获取交易数据  todo
                    graphData = await this.queryTransactionData(
                      this.showNumber,
                      "sale",
                      this.enterpriseName,
                      e.name,
                      true
                    );
                  } else {
                    option.series[0].nodeAlign = "left";
                    // 获取交易数据
                    graphData = await this.queryTransactionData(
                      this.showNumber,
                      "buy",
                      this.enterpriseName,
                      e.name,
                      true
                    );
                  }
                  console.log("graphData----second", graphData);
                  data = [...data, ...graphData.nodeData];
                  links = [...links, ...graphData.linkData];
                  option.series[0].data = data;
                  option.series[0].links = links;
                  this.myChart1.setOption(option);
                  if (graphData.nodeData.length && graphData.linkData.length) {
                    console.log("bingo");
                    this.direction =
                      targetLink.source === e.name ? "left" : "right";
                  } else {
                    this.direction = undefined;
                  }
                  this.isSpread = true;
                }
              }
            }
          } else {
            // 单击边
            const data = await this.queryGoodsClassify(
              e.data.source,
              e.data.target
            );
            console.log("data", data);
            if (data.length) {
              this.visible = true;
              const entName =
                e.data.position === "left" ? e.data.source : e.data.target;
              this.graphList2[0].title =
                entName.indexOf("_") === -1
                  ? entName
                  : entName.substring(0, entName.indexOf("_"));
              console.log("data", data);
              setTimeout(() => {
                this.myChart4 = this.$echarts.init(
                  this.$refs.dataGraphs2.$refs.graph4[0]
                );
                const option3 = {
                  tooltip: {
                    trigger: "item",
                    triggerOn: "mousemove",
                    formatter: (params) => {
                      console.log("params", params);
                      const name = params.data.name;
                      const value = params.data.value;
                      return (
                        name +
                        "：" +
                        value +
                        "% (" +
                        this.nodeData[params.dataIndex + 1].priceData +
                        "元)"
                      );
                    },
                  },
                  series: [
                    {
                      type: "pie",
                      radius: [0, 100],
                      center: ["50%", "50%"],
                      roseType: "radius",
                      // 避免数据过小 不展示
                      minAngle: 1,
                      data,
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
                          console.log("params-label", params);
                          const name = params.data.name;
                          const value = params.data.value;
                          return name + "：" + value + "% ";
                        },
                      },
                      animationType: "scale",
                      animationEasing: "elasticOut",
                      animationDelay: function (idx) {
                        return Math.random() * 200;
                      },
                    },
                  ],
                };
                this.myChart4.setOption(option3);
              }, 0);
            }
          }
        }, 300);
      });
    },

    // 发票金额统计+发票数量统计柱状图表展示
    initEcharts() {
      this.myChart2 = this.$echarts.init(this.$refs.dataGraphs.$refs.graph2[0]);
      this.myChart3 = this.$echarts.init(this.$refs.dataGraphs.$refs.graph3[0]);
      const _that = this;
      const quarterObj = {
        1: "一季度",
        2: "二季度",
        3: "三季度",
        4: "四季度",
      };
      const monthObj = {
        1: "一月",
        2: "二月",
        3: "三月",
        4: "四月",
        5: "五月",
        6: "六月",
        7: "七月",
        8: "八月",
        9: "九月",
        10: "十月",
        11: "十一月",
        12: "十二月",
      };
      //发票金额统计
      const option2 = {
        tooltip: {
          trigger: "axis",
          triggerOn: "mousemove",
          formatter: function (params) {
            let string = "";
            if (_that.timeValue === 0) {
              // 年度
              string =
                "年份：" +
                params[0].name +
                "<br/>发票金额：" +
                params[0].data.toLocaleString() +
                "万元";
            } else if (_that.timeValue === 1) {
              string = "年份：" + params[0].name + "<br/>";
              params.map((item, index) => {
                string +=
                  item.marker +
                  `${quarterObj[index + 1]}：` +
                  item.data.toLocaleString() +
                  "万元<br/>";
              });
            } else {
              // 月度
              string = "年份：" + params[0].name + "<br/>";
              params.map((item, index) => {
                string +=
                  item.marker +
                  `${monthObj[index + 1]}：` +
                  item.data.toLocaleString() +
                  "万元<br/>";
              });
            }
            return string;
          },
        },
        legend: {
          type: "scroll",
          top: 10,
          data: [],
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
        yAxis: {
          type: "value",
          name: "单位：万元",
          minInterval: 1,
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
        },
        series: [],
      };
      //发票数量统计
      const option3 = {
        tooltip: {
          trigger: "axis",
          triggerOn: "mousemove",
          formatter: function (params) {
            let string = "";
            if (_that.timeValue === 0) {
              // 年度
              string =
                "年份：" +
                params[0].name +
                "<br/>发票数量：" +
                params[0].data +
                "张";
            } else if (_that.timeValue === 1) {
              string = "年份：" + params[0].name + "<br/>";
              params.map((item, index) => {
                string +=
                  item.marker +
                  `${quarterObj[index + 1]}：` +
                  item.data +
                  "张<br/>";
              });
            } else {
              // 月度
              string = "年份：" + params[0].name + "<br/>";
              params.map((item, index) => {
                string +=
                  item.marker +
                  `${monthObj[index + 1]}：` +
                  item.data +
                  "张<br/>";
              });
            }
            return string;
          },
        },
        legend: {
          type: "scroll",
          top: 10,
          data: [],
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
        yAxis: {
          type: "value",
          name: "单位：张",
          minInterval: 1,
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
        },
        series: [],
      };
      if (this.timeValue === 0) {
        // 年度
        option2.series.push({
          data: this.graphData.money.yearData,
          type: "bar",
          stack: "tax",
          barWidth: "30%",
          emphasis: {
            focus: "series",
          },
          color: this.lineColor[0],
        });
        option3.series.push({
          data: this.graphData.number.yearData,
          type: "bar",
          stack: "tax",
          barWidth: "30%",
          emphasis: {
            focus: "series",
          },
          itemStyle: {
            color: this.lineColor[0],
          },
        });
      } else if (this.timeValue === 1) {
        // 季度
        for (let i = 0; i < 4; i++) {
          option2.series.push({
            data: this.graphData.money[`quarterData${i + 1}`],
            name: quarterObj[i + 1],
            type: "bar",
            stack: "tax",
            barWidth: "30%",
            emphasis: {
              focus: "series",
            },
            color: this.lineColor[i],
          });
          option2.legend.data.push(quarterObj[i + 1]);
          option3.series.push({
            data: this.graphData.number[`quarterData${i + 1}`],
            name: quarterObj[i + 1],
            type: "bar",
            stack: "tax",
            barWidth: "30%",
            emphasis: {
              focus: "series",
            },
            color: this.lineColor[i],
          });
          option3.legend.data.push(quarterObj[i + 1]);
        }
      } else {
        // 月度
        for (let i = 0; i < 12; i++) {
          option2.series.push({
            data: this.graphData.money[`monthData${i + 1}`],
            name: monthObj[i + 1],
            type: "line",
            // type: "bar",
            // stack: "tax",
            // barWidth: "30%",
            // emphasis: {
            //   focus: "series",
            // },
            color: this.lineColor[i],
          });
          option2.legend.data.push(monthObj[i + 1]);
          option3.series.push({
            data: this.graphData.number[`monthData${i + 1}`],
            name: monthObj[i + 1],
            type: "line",
            // type: "bar",
            // stack: "tax",
            // barWidth: "30%",
            // emphasis: {
            //   focus: "series",
            // },
            color: this.lineColor[i],
          });
          option3.legend.data.push(monthObj[i + 1]);
        }
        console.log("option2", option2);
        console.log("option3", option3);
      }

      this.myChart2.setOption(option2, true);
      //图表背景色
      handleAddEchartsBackground(this.myChart2, option2, this.graphData.xAxis);
      this.myChart3.setOption(option3, true);
      handleAddEchartsBackground(this.myChart3, option3, this.graphData.xAxis);
    },

    reset() {
      this.buyValue = undefined;
      this.saleValue = undefined;
      this.startStopTime = [];
      this.thirdValue = "";
      this.inputValue = undefined;
    },
    changeTimeValue(e) {
      this.timeValue = e.target.value;
      this.queryStatisticReceipt();
    },
    onCancel() {
      this.visible = false;
    },
    onDetailsCancel() {
      this.detailsVisible = false;
    },
    handleTagsShow() {
      this.enterpriseName = this.paramsObj.corpName;
      this.tagsShow = true;
    },
    onClose() {
      this.tagsShow = false;
    },
    check(reg, str) {
      // 检测英文字符数量
      let x = [];
      let z = 0;
      do {
        x = reg.exec(str);
        console.log("x", x);
        if (x != null) {
          z++;
        }
      } while (x != null);
      return z;
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
    handleFilter() {
      this.transactionFilterVisible = true;
    },
    onFilterCancel() {
      this.transactionFilterVisible = false;
    },

    //获得企业上下游
    async getTransactionData() {
      this.leftShow = true;
      this.rightShow = true;
      const graphData1 = await this.queryTransactionData(
        this.showNumber, //todo  新增该字段
        "sale",
        this.paramsObj.corpName,
        this.paramsObj.corpName
      );
      console.log("graphData1", graphData1);
      const graphData2 = await this.queryTransactionData(
        this.showNumber, //todo  新增该字段
        "buy",
        this.paramsObj.corpName,
        this.paramsObj.corpName
      );
      console.log("graphData2", graphData2);
      //unionBy合并多个数组,并去除重复的元素
      this.nodeData = unionBy(
        [
          {
            name: this.paramsObj.corpName,
            value: this.paramsObj.corpName,
            label: {
              show: true,
              position: "right",
              width: 16,
              lineHeight: 20,
              overflow: "break",
              writingMode: "tb-lr",
            },
            itemStyle: {
              color: "#497FC9",
            },
          },
        ],
        graphData1.nodeData,
        graphData2.nodeData,
        "name"
      );
      this.linkData = unionBy(graphData1.linkData, graphData2.linkData, "id");
      console.log("data", this.nodeData, this.linkData);
      this.init();
    },

    //上下游购、销方获取  返回nodeData和linkData
    async queryTransactionData(
      topValue,
      type,
      corpName,
      aliasName,
      isNew = false
    ) {
      const nodeData = [];
      const linkData = [];
      //todo  上下游展示数量在这里添加
      const json = {
        topValue: topValue, //新增该字段
        gfmc: type === "sale" ? corpName : undefined,
        xfmc: type === "buy" ? corpName : undefined,
        year: this.yearValue,
        isSomeGroup: this.typeValue ? this.typeValue : undefined,
      };
      let res = undefined;
      if (type === "sale") {
        res = await queryUpperEnt(json);
      } else {
        res = await queryLowerEnt(json);
      }
      if (res.message === "成功" && res.data && res.data.length) {
        res.data.map((item) => {
          nodeData.push({
            name:
              type === "sale"
                ? item.xfmc + (isNew ? "_sale1" : "_sale0")
                : item.gfmc + (isNew ? "_buy1" : "_buy0"),
            value: type === "sale" ? item.xfmc : item.gfmc,
            itemStyle: {
              color:
                item.sftyjt === "是"
                  ? "#4980CB"
                  : type === "sale"
                  ? "#47E0C1"
                  : "#30BFE2",
            },
            label: {
              show: true,
              position: type === "sale" ? "left" : "right",
              lineHeight: 20,
              overflow: "break",
            },
            isNew,
            // 社会信用代码，双击点时查询企业标签
            uniScId: type === "sale" ? item.gfTyshxym : item.xfTyshxym,
          });
          linkData.push({
            //新增需求  弹框展示字段添加  todo
            source:
              type === "sale"
                ? item.xfmc + (isNew ? "_sale1" : "_sale0")
                : aliasName,
            target:
              type === "sale"
                ? aliasName
                : item.gfmc + (isNew ? "_buy1" : "_buy0"),
            value: item.jshjY || 0,
            numValue: item.fpsl || 0,
            position: type === "sale" ? "left" : "right",
            isNew,
            id: nanoid(),
            //todo 新增
            xfmc: item.xfmc,
            fpkjsl: item.fpkjsl,
            fpkjje: item.fpkjje,
            fpkjjshjze: item.fpkjjshjje,
            gfmc: item.gfmc,
            ssfpsl: item.ssfpsl,
            ssfpje: item.ssfpje,
            ssfpjshjje: item.ssfpjshjje,
          });
        });
        console.log("node", nodeData);
        console.log("link", linkData);

        // 根据linkData的发票金额和数量数据，给nodeData赋值上相应的数据
        linkData.map((link) => {
          let node = undefined;
          if (link.position === "right") {
            // 下游销方 取target
            node = find(nodeData, (v) => v.name === link.target);
          } else {
            // 上游购方 取source
            node = find(nodeData, (v) => v.name === link.source);
          }
          console.log("node----", node);
          node.priceData = link.value;
          node.numData = link.numValue;
          node.position = link.position;
        });
      } else if (res.message === "成功" && res.data && !res.data.length) {
        if (type === "sale") {
          this.leftShow = false;
        } else {
          this.rightShow = false;
        }
        const text =
          type === "sale"
            ? "暂无该企业的上游交易信息"
            : "暂无该企业的下游交易信息";
        this.$message.info(text);
      } else {
        this.$message.error(res.message);
      }
      console.log("queryTransactionData", nodeData, linkData);
      return {
        nodeData,
        linkData,
      };
    },

    // 发票金额统计+发票数量统计柱状图表数据获取
    async queryStatisticReceipt() {
      const json = {
        corpName: this.paramsObj.corpName,
        unit: this.timeValue,
      };
      const loading = this.$message.loading("正在查询", 0);
      const res = await queryStatisticReceipt(json);
      loading();
      const graphData = {
        xAxis: [],
        money: {
          yearData: [],
          quarterData1: [],
          quarterData2: [],
          quarterData3: [],
          quarterData4: [],
          monthData1: [],
          monthData2: [],
          monthData3: [],
          monthData4: [],
          monthData5: [],
          monthData6: [],
          monthData7: [],
          monthData8: [],
          monthData9: [],
          monthData10: [],
          monthData11: [],
          monthData12: [],
        },
        number: {
          yearData: [],
          quarterData1: [],
          quarterData2: [],
          quarterData3: [],
          quarterData4: [],
          monthData1: [],
          monthData2: [],
          monthData3: [],
          monthData4: [],
          monthData5: [],
          monthData6: [],
          monthData7: [],
          monthData8: [],
          monthData9: [],
          monthData10: [],
          monthData11: [],
          monthData12: [],
        },
      };
      if (res.message === "成功" && res.data) {
        for (let i in res.data) {
          const value = res.data[i];
          graphData.xAxis.push(i);
          switch (this.timeValue) {
            case 1:
              // 季度
              for (let j in value) {
                // j为季度，arr为对应数据
                const arr = value[j];
                if (arr[0]) {
                  // 如果有数据，不为null，则取值
                  graphData.money[`quarterData${j}`].push(
                    arr[0].jey ? arr[0].jey.toFixed(2) : 0
                  );
                  graphData.number[`quarterData${j}`].push(arr[0].fpsl || 0);
                } else {
                  // 否则赋值为空
                  graphData.money[`quarterData${j}`].push(0);
                  graphData.number[`quarterData${j}`].push(0);
                }
              }
              break;
            case 2:
              // 月度
              for (let j in value) {
                // j为月份，arr为对应数据
                const arr = value[j];
                if (arr[0]) {
                  // 如果有数据，不为null，则取值
                  graphData.money[`monthData${j}`].push(
                    arr[0].jey ? arr[0].jey.toFixed(2) : 0
                  );
                  graphData.number[`monthData${j}`].push(arr[0].fpsl || 0);
                } else {
                  // 否则赋值为空
                  graphData.money[`monthData${j}`].push(0);
                  graphData.number[`monthData${j}`].push(0);
                }
              }
              break;

            default:
              // 年度
              if (value[i] && value[i].length) {
                // 如果有数据，不为null，则取值
                graphData.money.yearData.push(
                  value[i][0].jey ? value[i][0].jey.toFixed(2) : 0
                );
                graphData.number.yearData.push(value[i][0].fpsl || 0);
              } else {
                // 否则赋值为空
                graphData.money.yearData.push(0);
                graphData.number.yearData.push(0);
              }
              break;
          }
        }
        this.graphData = graphData;
        console.log("this.graphData", this.graphData);

        this.initEcharts();
      } else if (res.message === "成功" && !res.data) {
        this.$message.info("暂无当前企业的发票统计信息");
      } else {
        this.$message.error(res.message);
      }
    },

    async queryGoodsClassify(source, target) {
      const data = [];
      const json = {
        // xfmc: source,
        // gfmc: target,
        xfmc:
          source.indexOf("_") === -1
            ? source
            : source.substring(0, source.indexOf("_")),
        gfmc:
          target.indexOf("_") === -1
            ? target
            : target.substring(0, target.indexOf("_")),
        year: this.yearValue,
      };
      const res = await queryGoodsClassify(json);
      if (res.message === "成功" && res.data.length) {
        res.data.map((item) => {
          data.push({
            value: item.zb || 0,
            name: item.sp3jflCn || "null",
          });
        });
      } else if (res.message === "成功" && !res.data.length) {
        this.$message.info("暂无货物分类明细数据");
      } else {
        this.$message.error(res.message);
      }
      return data;
    },

    //选中的企业标签获取
    async queryEntLable(uniScId) {
      const json = {
        uniScId,
      };
      const res = await queryEntLable(json);
      console.log("queryEntLable", res);
      if (res.message === "成功" && res.data) {
        let tags = [];
        // 基本信息
        res.data.basicSituationLabels.map((item) => {
          tags.push({
            id: item.labelId,
            text: item.labelName,
            isActive: item.isOrNoHit === "1" ? true : false,
          });
        });
        // 命中的标签放前面
        tags.sort((a, b) => b.isActive - a.isActive);
        this.enterpriseTags.splice(0, 1, {
          title: "基本情况",
          src: require("@/assets/images/img/基本情况-未选中.svg"),
          activeSrc: require("@/assets/images/img/基本情况-选中.svg"),
          tags,
          isHover: false,
        });
        // 经营情况
        tags = [];
        res.data.businessConditionsLabels.map((item) => {
          tags.push({
            id: item.labelId,
            text: item.labelName,
            isActive: item.isOrNoHit === "1" ? true : false,
          });
        });
        tags.sort((a, b) => b.isActive - a.isActive);
        this.enterpriseTags.splice(5, 1, {
          title: "经营情况",
          src: require("@/assets/images/img/经营情况-未选中.svg"),
          activeSrc: require("@/assets/images/img/经营情况-选中.svg"),
          tags,
          isHover: false,
        });
        // 财务情况
        tags = [];
        res.data.financialSituationLabels.map((item) => {
          tags.push({
            id: item.labelId,
            text: item.labelName,
            isActive: item.isOrNoHit === "1" ? true : false,
          });
        });
        tags.sort((a, b) => b.isActive - a.isActive);
        this.enterpriseTags.splice(6, 1, {
          title: "财务状况",
          src: require("@/assets/images/img/财务状况-未选中.svg"),
          activeSrc: require("@/assets/images/img/财务状况-选中.svg"),
          tags,
          isHover: false,
        });
        // 历史沿革
        tags = [];
        res.data.historyLabels.map((item) => {
          tags.push({
            id: item.labelId,
            text: item.labelName,
            isActive: item.isOrNoHit === "1" ? true : false,
          });
        });
        tags.sort((a, b) => b.isActive - a.isActive);
        this.enterpriseTags.splice(7, 1, {
          title: "历史沿革",
          src: require("@/assets/images/img/历史沿革-未选中.svg"),
          activeSrc: require("@/assets/images/img/历史沿革-选中.svg"),
          tags,
          isHover: false,
        });
        // 行政许可
        tags = [];
        res.data.licenseLabels.map((item) => {
          tags.push({
            id: item.labelId,
            text: item.labelName,
            isActive: item.isOrNoHit === "1" ? true : false,
          });
        });
        tags.sort((a, b) => b.isActive - a.isActive);
        this.enterpriseTags.splice(2, 1, {
          title: "行政许可",
          src: require("@/assets/images/img/行政许可-未选中.svg"),
          activeSrc: require("@/assets/images/img/行政许可-选中.svg"),
          tags,
          isHover: false,
        });
        // 负面事件
        tags = [];
        res.data.negativeEventLabels.map((item) => {
          tags.push({
            id: item.labelId,
            text: item.labelName,
            isActive: item.isOrNoHit === "1" ? true : false,
          });
        });
        tags.sort((a, b) => b.isActive - a.isActive);
        this.enterpriseTags.splice(4, 1, {
          title: "负面事件",
          src: require("@/assets/images/img/负面事件-未选中.svg"),
          activeSrc: require("@/assets/images/img/负面事件-选中.svg"),
          tags,
          isHover: false,
        });
        // 科技创新
        tags = [];
        res.data.sciAndInnonegativeEventLabels.map((item) => {
          tags.push({
            id: item.labelId,
            text: item.labelName,
            isActive: item.isOrNoHit === "1" ? true : false,
          });
        });
        tags.sort((a, b) => b.isActive - a.isActive);
        this.enterpriseTags.splice(3, 1, {
          title: "科技创新",
          src: require("@/assets/images/img/科技创新-未选中.svg"),
          activeSrc: require("@/assets/images/img/科技创新-选中.svg"),
          tags,
          isHover: false,
        });
        // 舆情信息
        tags = [];
        res.data.consensusLabels.map((item) => {
          tags.push({
            id: item.labelId,
            text: item.labelName,
            isActive: item.isOrNoHit === "1" ? true : false,
          });
        });
        tags.sort((a, b) => b.isActive - a.isActive);
        this.enterpriseTags.splice(1, 1, {
          title: "舆情信息",
          src: require("@/assets/images/img/舆情信息-未选中.svg"),
          activeSrc: require("@/assets/images/img/舆情信息-选中.svg"),
          tags,
          isHover: false,
        });
      } else if (res.message === "查询当前企业命中标签失败" && !res.data) {
        this.$message.info("暂无标签数据");
        this.enterpriseTags = [];
      } else {
        this.$message.error(res.message);
      }
    },

    async getBillDetail(type) {
      if (type === "init") {
        this.$set(this.pagination1, "current", 1);
      }
      if (!this.buyValue && !this.saleValue) {
        this.$message.info("购方和销方名称至少填一个！");
        return false;
      }
      const json = {
        xfmc: this.saleValue ? this.saleValue : undefined,
        gfmc: this.buyValue ? this.buyValue : undefined,
        startYear: this.startStopTime.length
          ? this.startStopTime[0].format("YYYY")
          : undefined,
        endYear: this.startStopTime.length
          ? this.startStopTime[1].format("YYYY")
          : undefined,
        sp3jflCn: this.thirdValue ? this.thirdValue : undefined,
        goodsName: this.inputValue,
        pageNo: this.pagination1.current,
        pageSize: this.pagination1.pageSize,
      };
      this.tableLoading = true;
      const res = await billDetail(json);
      this.tableLoading = false;
      const dataList = [];
      if (res.message === "成功" && res.data && res.data.dateList.length) {
        this.pagination1.total = res.data.totalCount;
        res.data.dateList.map((item, index) => {
          let date = new Date(parseInt(item.kprq));
          dataList.push({
            index:
              (this.pagination1.current - 1) * this.pagination1.pageSize +
              index +
              1,
            name: item.hwmc || "--",
            time: item.kprq
              ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
              : "--",
            type: item.fplxmc_bs || "--",
            price: item.dj ? Number(item.dj).toFixed(2) : "--",
            number: item.sl || "--",
            money: item.je ? Number(item.je).toFixed(2) : "--",
            tax: item.slv || "--",
            taxMoney: item.se || "--",
            total: item.jshj || "--",
            buyName: item.gfmc || "--",
            saleName: item.xfmc || "--",
            invoiceNumber: item.fphm || "--",
            invoiceIndex: item.fpdm || "--",
            firstType: item.sp1jflCn || "--",
            secondType: item.sp2jflCn || "--",
            thirdType: item.sp3jflCn || "--",
          });
        });
      } else if (
        res.message === "成功" &&
        ((res.data && !res.data.dateList.length) || !res.data)
      ) {
        this.$message.info("暂无发票金额和数量统计信息");
      } else {
        this.$message.error(res.message);
      }
      console.log("dataList", dataList);
      this.dataList = dataList;
    },

    async getAllBillDetail(type) {
      if (type === "init") {
        this.$set(this.pagination, "current", 1);
      }
      if (!this.buyValue && !this.saleValue) {
        this.$message.info("购方和销方名称至少填一个！");
        return false;
      }
      const json = {
        xfmc: this.saleValue,
        gfmc: this.buyValue,
        startYear: this.startStopTime.length
          ? this.startStopTime[0].format("YYYY")
          : undefined,
        endYear: this.startStopTime.length
          ? this.startStopTime[1].format("YYYY")
          : undefined,
        sp3jflCn: this.thirdValue ? this.thirdValue : undefined,
        goodsName: this.inputValue,
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
      };
      this.infoQuery = json;
      const res = await billDetail(json);
      const dataList = [];
      if (res.message === "成功" && res.data && res.data.dateList.length) {
        this.pagination.total = res.data.totalCount;
        res.data.dateList.map((item, index) => {
          let date = new Date(parseInt(item.kprq));
          dataList.push({
            index:
              (this.pagination.current - 1) * this.pagination.pageSize +
              index +
              1,
            name: item.hwmc || "--",
            time: item.kprq
              ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
              : "--",
            type: item.fplxmc_bs || "--",
            price: item.dj ? Number(item.dj).toFixed(2) : "--",
            number: item.sl || "--",
            money: item.je ? Number(item.je).toFixed(2) : "--",
            tax: item.slv || "--",
            taxMoney: item.se || "--",
            total: item.jshj || "--",
            buyName: item.gfmc || "--",
            saleName: item.xfmc || "--",
            invoiceNumber: item.fphm || "--",
            invoiceIndex: item.fpdm || "--",
            firstType: item.sp1jflCn || "--",
            secondType: item.sp2jflCn || "--",
            thirdType: item.sp3jflCn || "--",
          });
        });
      } else if (
        res.message === "成功" &&
        ((res.data && !res.data.dateList.length) || !res.data)
      ) {
        this.$message.info("暂无发票金额和数量统计信息");
      } else {
        this.$message.error(res.message);
      }
      console.log("detailDataList", dataList);
      this.detailDataList = dataList;
    },

    async getBillTab() {
      const json = {
        xfmc: this.saleValue,
        gfmc: this.buyValue,
      };
      const res = await billTab(json);
      const thirdOptions = [
        {
          label: "全部",
          value: "",
        },
      ];
      if (res.message === "成功" && res.data) {
        // res.data["三级分类"].map((v) => {
        //   if (v) {
        //     v = JSON.parse(v);
        //     thirdOptions.push({
        //       label: v.sp3jflCn,
        //       value: v.sp3jflCn,
        //     });
        //   }
        // });
        for (let i in res.data) {
          for (let j in res.data[i]) {
            res.data[i][j].map((item) => {
              thirdOptions.push({
                label: item,
                value: item,
              });
            });
          }
        }
      } else if (res.message === "成功" && !res.data) {
        this.$message.info("暂无商品分类信息");
      } else {
        this.$message.error(res.message);
      }
      this.thirdOptions = thirdOptions;
    },

    onPanelChange(value) {
      this.startStopTime = value;
    },
    onDataChange(date) {
      this.startStopTime = date;
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
      this.yearValue = value.format("YYYY");
      this.yearShow = false;
      this.getTransactionData();
    },

    //中心企业切换按钮  todo
    handleCenterChange(value) {
      this.isCenterChange = value;
    },
  },
};
</script>
<style lang="less">
.transaction-chain {
  display: flex;
  flex-wrap: wrap;
  position: relative;

  &-graph {
    width: 100%;
    padding: 0 24px 16px;
    background: #fff;
    margin-bottom: 24px;

    .graph-filter {
      //new do
      width: 780px;
      // width: 600px;
      top: -56px;
      right: 24px;
      display: flex;
      flex-wrap: wrap;
      position: absolute;
      align-items: center;
      justify-content: flex-end;

      &-btns {
        display: flex;
        align-items: center;
        margin-bottom: 16px;

        .ant-select {
          width: 70px;
          margin-right: 8px;
        }

        .ant-switch {
          margin-right: 8px;
        }

        .graph-filter-btn {
          width: 88px;
          margin-left: 8px;
          display: flex;
          align-items: center;

          .svg-icon {
            width: 16px;
            height: 16px;
            margin-right: 10px;
          }

          span {
            font-size: 16px;
          }

          &:not(.ant-btn-primary) {
            &:hover {
              color: @activeFontColor;

              span {
                color: @activeFontColor;
              }
            }
            span {
              color: @primaryTextColor;
            }
          }

          &:not(:last-child) {
            margin-right: 10px;
          }
        }

        .filter-content {
          display: flex;
          align-items: flex-start;
          justify-content: center;

          &-item {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 8px;

            .content-label {
              width: 100px;
              text-align: right;
            }

            .content-input {
              width: 122px;
            }
          }

          .ant-radio-group {
            display: flex;
            flex-wrap: wrap;
            padding: 0 55px;

            .ant-radio-wrapper {
              width: 100%;
              margin-right: 0;
              margin-bottom: 16px;

              &:last-child {
                margin-bottom: 0;
              }

              .content-input {
                width: calc(100% - 94px);
              }
            }
          }
        }
      }

      .content-label {
        line-height: 32px;
      }
    }
  }

  .graph-content {
    &-box {
      text-align: center;
      font-size: 20px;

      .box-title {
        display: flex;
        align-items: center;
        justify-content: center;

        &-text {
          color: #333;
          font-weight: 600;
        }

        .anticon {
          font-size: 14px;
          color: #999;
          padding-left: 4px;
        }
      }

      .box-graph {
        .sankey-tooltip {
          text-align: left;
        }
      }

      .box-graph-title {
        position: relative;
        height: 27px;
        margin-top: 12px;
        font-size: 18px;
        font-weight: 600;
        color: #333;

        span {
          position: absolute;

          &:first-child {
            left: 15%;
          }
          &:nth-child(2) {
            left: 49%;
            transform: translateX(-50%);
          }
          &:nth-child(3) {
            right: 17%;
          }
        }
      }

      .box-graph {
        height: 540px;
      }

      .box-tips {
        display: flex;
        padding-left: 8px;
        font-size: 14px;
        margin-bottom: 16px;

        &:last-child {
          margin-bottom: 0;
        }

        &-title {
          width: 80px;
          color: @blue;
        }

        &-content {
          text-align: left;
          width: calc(100% - 80px);
          color: @secondaryTextColor;
        }

        .ant-badge {
          margin-right: 16px;

          .ant-badge-status-dot {
            width: 12px;
            height: 12px;
          }
        }
      }
    }
  }

  &-table {
    width: 100%;
    background: #fff;
    padding: 24px;
    position: relative;

    .business-table-btn {
      top: 24px;
      right: 24px;
    }

    &-content {
      transition: all 0.3s;
    }

    .table-content {
      margin-bottom: 24px;

      &-item {
        overflow: hidden;

        .item-label {
          width: 75px;
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
          width: calc(100% - 91px);
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
  }

  &-tag {
    background: @blue;
    width: 44px;
    height: 24px;
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
    text-align: center;
    position: absolute;
    right: 0;
    top: 100px;
    padding: 2px;
  }

  .business-options {
    &-item {
      .item-label {
        &.first-type {
          width: 115px;
        }

        &.second-type {
          width: 160px;
        }
      }

      .item-content {
        &.first-type {
          width: calc(100% - 115px);
        }

        &.second-type {
          width: calc(100% - 160px);
        }

        &-middle {
          width: 38px;
          padding: 0 12px;
          text-align: center;
        }

        &-longInput {
          width: 100%;
        }
      }
    }
  }

  .business-table-save {
    top: 96px;
  }
}

.enterprise-tags-drawer {
  .ant-drawer-body {
    height: calc(100% - 55px);
    overflow: auto;

    .enterprise-name {
      padding-bottom: 24px;

      .icon-house {
        width: 22px;
        height: 22px;
      }
      &-text {
        padding-left: 12px;
        font-weight: 600;
      }
    }

    .enterprise-tags {
      .tag-item {
        &-title {
          font-weight: 600;
          padding-bottom: 12px;
        }

        &-content {
          display: flex;
          flex-wrap: wrap;
          margin-bottom: 16px;
          padding-bottom: 13px;
          border-bottom: 1px dashed rgba(0, 0, 0, 0.06);

          .content-tag {
            // border: 1px solid @borderColor;
            padding: 2px 8px;
            font-size: 14px;
            background: @tableHeaderColor;
            color: @secondaryTextColor;
            width: calc((100%-24px) / 3);
            height: 24px;
            line-height: 20px;
            margin-right: 8px;
            margin-bottom: 8px;

            &.active {
              color: @activeFontColor;
              background-color: #f2f8ff;
            }
          }
        }
      }
    }
  }
}

.goods-type-details-modal {
  .ant-modal {
    .ant-modal-content {
      .ant-modal-body {
        padding: 0;

        .goods-type-details-graph {
          height: 350px;
          width: 100%;
        }
      }
    }
  }
}

.invoice-details-modal {
  .ant-modal-wrap {
    display: flex;
    align-items: center;
  }

  .ant-modal {
    top: 0;
    margin: 0;

    .ant-modal-content {
      width: 960px;

      .ant-modal-body {
        .modal-content {
          &-title {
            font-size: 14px;
            margin-bottom: 8px;

            &-label {
              color: @secondaryTextColor;
            }

            &-value {
              color: @primaryTextColor;
              font-weight: 600;
            }
          }
        }
      }
    }

    .features-table2 {
      .ant-spin-nested-loading {
        .ant-spin-container {
          .ant-table {
            overflow: auto;
          }
        }
      }
    }
  }
}

.transaction-filter-modal {
  .ant-modal {
    padding: 0;
    right: 53px;
    top: 278px;
    position: absolute;
  }

  .filter-modal-content {
    &-item {
      display: flex;
      align-items: center;
      justify-content: center;

      &:first-child {
        margin-bottom: 16px;
      }

      .content-label {
        width: 100px;
        text-align: right;
      }

      .content-input {
        width: 320px;
      }
    }

    .ant-radio-group {
      display: flex;
      flex-wrap: wrap;
      padding: 0 55px;

      .ant-radio-wrapper {
        width: 100%;
        margin-right: 0;
        margin-bottom: 16px;

        &:last-child {
          margin-bottom: 0;
        }

        .content-input {
          width: calc(100% - 94px);
        }
      }
    }
  }
}
</style>
