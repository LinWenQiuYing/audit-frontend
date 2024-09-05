<template>
  <div class="purchase-sales-category" ref="purchaseSalesCategory">
    <div class="purchase-sales-category-graph">
      <div class="sub-title">购销品类</div>
      <div class="graph-content">
        <div class="graph-item">
          <div class="graph-item-top">
            <a-button
              type="primary"
              class="graph-item-top-btn"
              @click="changeShowType"
              >切换购销</a-button
            >
            <div class="graph-item-top-title">
              当前为
              <span class="title-name">{{
                showType === "buy" ? "购货" : "销货"
              }}</span>
            </div>
            <div class="graph-item-top-filter">
              <div class="filter-label">年度选择：</div>
              <!-- <a-select
                :options="yearOptions"
                class="filter-input"
                placeholder="请选择年份"
                v-model="startStopTime1"
                @change="yearChange"
              /> -->
              <a-date-picker
                v-model="startStopTime1"
                mode="year"
                format="YYYY"
                :open="yearShow"
                class="filter-input"
                @openChange="openChangeYear"
                @panelChange="panelChangeYear"
              />
            </div>
            <div class="graph-item-top-filter">
              <div class="filter-label">展示前TOP</div>
              <a-input-number
                :min="1"
                :max="100"
                :precision="0"
                class="filter-input"
                v-model="searchLimit"
                @change="onLimitChange"
                :parser="(value) => (/^\d+$/.test(value) ? value : 1)"
              />
            </div>
            <a-popover
              v-model="purchaseFilterVisible"
              :title="filterModalTitle"
              trigger="click"
              overlayClassName="graph-filter-popover"
            >
              <div slot="content">
                <a-tree
                  :expandedKeys="expandedKeys"
                  v-model="checkedKeys"
                  checkable
                  autoExpandParent
                  :tree-data="treeData"
                  @check="onCheck"
                  @expand="onExpand"
                >
                </a-tree>
              </div>
              <div class="graph-item-top-btn" @click="handleShowFilter">
                货物过滤
              </div>
            </a-popover>
          </div>
          <div class="graph-item-content">
            <div class="graph-item-content-box" v-if="showData1.length">
              <div
                class="box-item"
                v-for="(item, index) in showData1"
                :key="index"
                @click="handleClickBox(item, index)"
              >
                <div class="box-item-top">
                  <div class="box-item-top-text">
                    <span class="text-num">{{ item.ratio }}</span>
                    <span class="text-symbol">%</span>
                  </div>
                </div>
                <div
                  :class="[
                    'box-item-content',
                    highlightIndex === index ? 'active' : '',
                  ]"
                  v-if="item.children.length"
                >
                  <div
                    class="box-item-content-cell"
                    v-for="(cell, index) in item.children"
                    :title="cell.name"
                    :key="index"
                  >
                    <div
                      v-for="i in parseInt(cell.ratio)"
                      :key="i"
                      :style="{ backgroundColor: cell.color }"
                    ></div>
                  </div>
                  <div
                    class="box-item-content-cell"
                    v-if="item.childLength < 100"
                  >
                    <div v-for="i in 100 - item.childLength" :key="i"></div>
                  </div>
                </div>
                <div class="box-item-content" v-else>
                  <div
                    class="box-item-content-cell"
                    v-for="i in 100"
                    :key="i"
                  ></div>
                </div>
                <div class="box-item-bottom">
                  <span class="bottom-line"></span>
                  <span class="bottom-text" :title="item.name">{{
                    item.name
                  }}</span>
                  <span class="bottom-line"></span>
                </div>
              </div>
            </div>
            <div class="graph-item-content-box" v-else>
              <img src="@/assets/images/img/noData.png" alt="" />
            </div>
          </div>
        </div>
        <div class="graph-item">
          <div class="graph-item-top">
            <div class="graph-item-top-title" v-if="sp2jflCn && isClickCheck">
              当前二级货物：
              <span class="title-name">{{ sp2jflCn }}</span>
            </div>
            <div class="graph-item-top-title" v-else>
              当前一级货物：
              <span class="title-name">{{ sp1jflCn }}</span>
            </div>
          </div>
          <div class="graph-item-content">
            <div class="graph-item-content-radio">
              <a-radio-group
                @change="handleRadioChange"
                :value="radioValue"
                buttonStyle="solid"
              >
                <a-radio-button value="TOP10">TOP10</a-radio-button>
                <a-radio-button value="TOP20">TOP20</a-radio-button>
              </a-radio-group>
            </div>
            <div
              class="graph-item-content-graph"
              ref="graph5"
              v-show="showData2.length"
            ></div>
            <div class="graph-item-content-graph" v-show="!showData2.length">
              <img src="@/assets/images/img/noData.png" alt="" />
            </div>
            <div class="graph-item-content-list"></div>
          </div>
        </div>
        <div class="graph-item">
          <div class="graph-item-top">
            <div class="graph-item-top-title">
              当前一级货物：
              <span
                class="title-name"
                v-if="(selectItem && selectItem.name) || sp1jflCn"
                >{{ (selectItem && selectItem.name) || sp1jflCn }}
              </span>
              <span class="title-name disabled" v-else>请先选择一级品类 </span>
            </div>
          </div>
          <div class="graph-item-content">
            <a-table
              :columns="columns2"
              :data-source="dataList2"
              :rowKey="(record) => record.index"
              :pagination="false"
              :scroll="{ x: 'max-content', y: 176 }"
              class="graph-item-content-table"
              bordered
            >
              <span slot="customTitle"
                >数量
                <a-tooltip placement="top">
                  <template slot="title">
                    <span
                      >货物、销售服务等一级分类的度量单位会使用重量、价格等统计度量衡，故会出现小数。</span
                    >
                  </template>
                  <span><a-icon type="question-circle" /></span>
                </a-tooltip>
              </span>
              <div slot="ratio" slot-scope="text" class="ratio-slot">
                <a-progress
                  type="line"
                  :percent="typeof text === 'string' ? 0 : text"
                  :showInfo="false"
                />
                {{ text }}%
              </div>
              <a
                slot="action"
                slot-scope="text, record"
                class="action-slot"
                @click="handleCheck(record)"
                >查看</a
              >
            </a-table>
          </div>
        </div>
      </div>
    </div>
    <div class="purchase-sales-category-table">
      <data-graphs
        ref="dataGraphs"
        :list="graphList"
        @handleSelectChange="handleSelectChange"
      />
      <div class="table-content">
        <DetailTable
          tableTitle="发票金额和数量统计"
          :foldValue="foldValue"
          :columns="columns"
          :infoData="dataList"
          :pagination="pagination"
          tableClass="features-table2"
          :loading="tableLoading"
          @handleChangebtn="handleChangebtn(2)"
          :infoQuery="infoQuery"
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
                    v-model.trim="buyValue"
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
                    v-model.trim="saleValue"
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
                    :value="startStopTime3"
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
                <label class="item-label second-type"
                  >货物或应税劳务名称：</label
                >
                <div class="item-content second-type">
                  <a-input
                    placeholder="请输入"
                    v-model.trim="inputValue"
                    class="item-content-longInput"
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
                    @click="getBillDetail('init')"
                    >查询</a-button
                  >
                </div>
              </div>
            </div>
          </div>
        </DetailTable>
      </div>
    </div>
    <a-modal
      class="top-modal"
      :width="572"
      :visible="topModalVisible"
      :destroyOnClose="true"
      @cancel="onCancel"
      :footer="null"
      :mask="false"
      centered
      :title="`货物交易对手${radioValue}`"
    >
      <div class="top-modal-content">
        <p class="top-modal-content-title">
          当前货物名称：
          <span class="title-text">{{ sp3jflCn || sp2jflCn || sp1jflCn }}</span>
        </p>
        <div class="top-modal-content-list" v-if="listData.length">
          <div
            class="list-item"
            v-for="(item, index) in listData"
            :key="item.name"
          >
            <span :class="['list-item-index', index > 2 ? '' : 'top']">{{
              index + 1
            }}</span>
            <span class="list-item-name">{{ item.name }}</span>
            <span class="list-item-num">{{ item.num }}万元</span>
          </div>
        </div>
        <div class="top-modal-content-list" v-else>
          <span class="no-content">暂无货物交易对手信息</span>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import {
  dotColor1,
  dotColor2,
  dotColor3,
  dotColor4,
  dotColor5,
  dotColor6,
  dotColor7,
  dotColor8,
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
  billDetail,
  billTab,
  buyerGoodsDetail,
  buyerGoodsPirce,
  buyerGoodsTop10,
  sellerGoodsDetail,
  sellerGoodsPirce,
  sellerGoodsTop10,
} from "@/shared/api/auditMode.js";
import { handleAddEchartsBackground } from "@/utils/echarts.js";
import {
  Button,
  DatePicker,
  Icon,
  Input,
  InputNumber,
  Popover,
  Progress,
  Radio,
  Tooltip,
  Tree,
} from "ant-design-vue";
import { find, findIndex, union } from "lodash";
import { nanoid } from "nanoid";
import { mapState } from "vuex";
import DataGraphs from "../components/dataGraphs";
import DetailTable from "../components/detailTable";

const { RangePicker } = DatePicker;
const { Group } = Radio;
const RadioButton = Radio.Button;

export default {
  name: "PurchaseSalesCategory",
  data() {
    return {
      startStopTime1: "2020",
      startStopTime3: [],
      myChart1: null,
      myChart2: null,
      myChart3: null,
      myChart4: null,
      myChart5: null,
      columns: [
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
          title: "单价(元)",
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
          title: "金额(元)",
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
      columns2: [
        {
          title: "二级货物名称",
          dataIndex: "name",
          key: "name",
          width: 160,
          align: "left",
        },
        {
          // title: "数量",
          dataIndex: "number",
          key: "number",
          width: 120,
          align: "right",

          slots: { title: "customTitle" },
        },
        {
          title: "金额",
          dataIndex: "money",
          key: "money",
          width: 120,
          align: "right",
        },
        {
          title: "占比",
          dataIndex: "ratio",
          key: "ratio",
          width: 216,
          align: "right",
          scopedSlots: { customRender: "ratio" },
        },
        {
          title: "排名",
          dataIndex: "ranking",
          key: "ranking",
          width: 68,
          align: "left",
        },
        {
          title: "操作",
          dataIndex: "action",
          key: "action",
          width: 68,
          align: "center",
          scopedSlots: { customRender: "action" },
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
          this.getBillDetail();
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = 1;
          this.pagination.pageSize = size;
          this.getBillDetail();
        },
      },
      pagination2: {
        total: 0,
        current: 1,
        pageSize: 5,
        showQuickJumper: true,
        showTotal: (total) => {
          return `共${total}条记录`;
        },
        onChange: (page, pageSize) => {
          this.pagination2.current = page;
          this.pagination2.pageSize = pageSize;
        },
      },
      dataList: [],
      dataList2: [],
      infoQuery: {},
      filterModalTitle: "",
      purchaseFilterVisible: false,
      salesFilterVisible: false,
      expandedKeys: [],
      checkedKeys: [],
      treeData: [],
      listData: [],
      graphList: [
        {
          header: "货物数量变动趋势",
          title: "当前货物品类：",
          sub: "",
          ref: "graph3",
          width: "calc((100% - 24px) / 2)",
          paddingTop: "491px",
          selectValue: 2,
          selectOptions: [
            // {
            //   value: 1,
            //   label: "年度",
            // },
            {
              value: 2,
              label: "季度",
            },
            {
              value: 3,
              label: "月度",
            },
          ],
        },
        {
          header: "货物金额变动趋势",
          title: "当前货物品类：",
          sub: "",
          ref: "graph4",
          width: "calc((100% - 24px) / 2)",
          paddingTop: "491px",
          selectValue: 2,
          selectOptions: [
            // {
            //   value: 1,
            //   label: "年度",
            // },
            {
              value: 2,
              label: "季度",
            },
            {
              value: 3,
              label: "月度",
            },
          ],
        },
      ],
      foldValue: true,
      yearOptions: [
        {
          label: "2017",
          value: "2017",
        },
        {
          label: "2018",
          value: "2018",
        },
        {
          label: "2019",
          value: "2019",
        },
        {
          label: "2020",
          value: "2020",
        },
        {
          label: "2021",
          value: "2021",
        },
      ],
      buyValue: undefined,
      saleValue: undefined,
      firstValue: undefined,
      firstOptions: [],
      secondValue: undefined,
      secondOptions: [],
      inputValue: undefined,
      thirdValue: "",
      thirdOptions: [
        {
          label: "全部",
          value: "",
        },
      ],
      dotData: [], // 点阵图数据
      showData1: [], // 点阵图展示数据
      showData2: [], // 饼图展示数据
      pieData: [], // 饼图数据
      legendData: [], // 饼图legend
      sp1jflCn: undefined,
      sp2jflCn: undefined,
      sp3jflCn: undefined,
      billTab: {}, //商品全部分类
      rank1: 1, // 双击查询货物的级别
      rank2: 2, // 单击查询货物的级别
      tableLoading: false,
      unit1: 2, // 季度
      unit2: 2, // 季度
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
      showType: "buy", // 当前展示的是购货还是销货，buy/sale
      searchLimit: 10,
      dotColor: [
        dotColor1,
        dotColor2,
        dotColor3,
        dotColor4,
        dotColor5,
        dotColor6,
        dotColor7,
        dotColor8,
      ],
      highlightIndex: 0,
      selectItem: undefined,
      radioValue: "TOP10",
      topModalVisible: false,
      isClickCheck: false, // 是否点击了查看按钮
      sp1List: [], // 存放筛选过后的一级、二级、三级品类信息
      sp2List: [],
      sp3List: [],
      yearShow: false,
    };
  },
  components: {
    AButton: Button,
    AIcon: Icon,
    AInput: Input,
    AInputNumber: InputNumber,
    APopover: Popover,
    AProgress: Progress,
    ARadioButton: RadioButton,
    ARadioGroup: Group,
    ARangePicker: RangePicker,
    ATree: Tree,
    ATooltip: Tooltip,
    ADatePicker: DatePicker,
    DataGraphs,
    DetailTable,
  },

  computed: {
    ...mapState("auditOptions", ["paramsObj"]),
  },
  watch: {},
  async mounted() {
    this.buyValue = this.paramsObj.corpName;
    this.onInitPage();
    const f = () => {
      // this.myChart1.resize();
      // this.myChart2.resize();
      this.myChart3.resize();
      this.myChart4.resize();
    };
    window.addEventListener("resize", f);
  },
  beforeDestroy() {
    // this.myChart1.clear();
    // this.myChart2.clear();
    this.myChart3.clear();
    this.myChart4.clear();
    const f = () => {
      // this.myChart1.resize();
      // this.myChart2.resize();
      this.myChart3.resize();
      this.myChart4.resize();
    };
    window.removeEventListener("resize", f);
  },
  methods: {
    reset() {
      this.buyValue = undefined;
      this.saleValue = undefined;
      this.startStopTime3 = [];
      this.thirdValue = "";
      this.inputValue = undefined;
    },
    handleShowFilter() {
      switch (this.showType) {
        case "buy":
          this.filterModalTitle = "购货品类展示筛选";
          this.salesFilterVisible = false;
          this.purchaseFilterVisible = true;
          break;
        case "sale":
          this.filterModalTitle = "销货品类展示筛选";
          this.purchaseFilterVisible = false;
          this.salesFilterVisible = true;
          break;

        default:
          break;
      }
    },
    onCheck(checkedKeys, e) {
      console.log("onCheck", checkedKeys, e);
      this.checkedKeys = checkedKeys;

      // 三个方法的顺序不能换
      this.handleShowData1Filter();
      this.checkSelectValue();
      this.handleShowData2Filter();
    },
    checkSelectValue() {
      console.log(
        "checkSelectValue",
        this.sp1jflCn,
        this.sp2jflCn,
        this.sp3jflCn,
        this.selectItem,
        this.highlightIndex
      );
      console.log(
        "bingo",
        this.sp1List,
        this.sp2List,
        this.sp3List,
        this.showData1
      );
      if (this.sp1List.indexOf(this.sp1jflCn) === -1) {
        // 如果sp1jflCn不在showData1中
        this.sp1jflCn = this.showData1.length
          ? this.showData1[0].name
          : undefined;

        this.getGoodsPirce("value");
        this.getGoodsPirce("number");
      }
      if (
        this.selectItem &&
        this.sp1List.indexOf(this.selectItem.name) === -1
      ) {
        // 如果selectItem不在showData1中，模拟点击第一个
        this.handleClickBox(this.showData1[0], 0);
      } else if (
        this.selectItem &&
        this.sp1List.indexOf(this.selectItem.name) > -1
      ) {
        // 如果selectItem在showData1中，调整highlightIndex的值
        this.highlightIndex = findIndex(
          this.showData1,
          (v) => v.name === this.selectItem.name
        );
      }
    },
    getNewShowData(arr, checkedKeys) {
      // 获取树状图筛选后的showData1
      const data = [];
      arr.map((item) => {
        const index = checkedKeys.indexOf(item.key);
        if (index > -1) {
          // checkedKeys中存在该item，则保留
          data.push(item);
        } else if (item.children && item.children.length) {
          // 或者当该item的children中有元素存在于checkedKeys中，则该item也保留
          const children = this.getNewShowData(item.children, checkedKeys);
          if (children.length) {
            data.push({
              ...item,
              children,
            });
          }
        }
      });
      return data;
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
    },
    createPieGraph() {
      this.myChart5 = this.$echarts.init(this.$refs.graph5);
      const option = {
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove",
          formatter: function (params) {
            const name = params.data.name;
            const money = params.data.money.toLocaleString();
            const ratio = params.data.ratio;
            return (
              name + "<br>价税合计：" + money + "元<br>占比：" + ratio + "%"
            );
          },
        },
        legend: {
          orient: "horizontal",
          bottom: 60,
          data: this.legendData,
        },
        series: [
          {
            type: "pie",
            radius: [0, "70%"],
            center: ["50%", "40%"],
            roseType: "radius",
            // 避免数据过小 不展示
            minAngle: 1,
            data: this.showData2.sort(function (a, b) {
              return b.ratio - a.ratio;
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
            label: {
              position: "outer",
              alignTo: "edge",
              margin: 24,
              formatter: function (params) {
                console.log("params", params);
                const name = params.data.name;
                const money = params.data.money.toLocaleString();
                const ratio = params.data.ratio;
                return name + "：" + ratio + "%\n" + money + "元";
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
      this.myChart5.setOption(option);

      this.myChart5.off("dblclick");
      this.myChart5.on("dblclick", (e) => {
        e.event.event.stopPropagation();
        e.event.event.preventDefault();
        console.log("pie-dblclick", e);
        const parentKey = e.data.parentKey;
        console.log("parentKey", parentKey);
        this.rank1 = parentKey.length;

        // 此处不能使用showData1代替dotData，因为parentKey是跟着dotData生成的
        // showData中没存放的点也是不会被点击到的
        this.sp1jflCn = this.dotData[parentKey[0]].name;
        this.sp2jflCn =
          this.rank1 > 1
            ? this.dotData[parentKey[0]].children[parentKey[1]].name
            : undefined;
        this.sp3jflCn =
          this.rank1 > 2
            ? this.dotData[parentKey[0]].children[parentKey[1]].children[
                parentKey[2]
              ].name
            : undefined;
        if (this.showType === "buy") {
          this.buyerGoodsTop10();
        } else {
          this.sellerGoodsTop10();
        }
      });
    },
    onPanelChange(value) {
      this.startStopTime3 = value;
    },
    onDataChange(date) {
      this.startStopTime3 = date;
    },
    async yearChange(value) {
      this.startStopTime1 = value;
      this.onInitPage();
    },
    async getGoodsDetail() {
      const type = this.showType;
      let graphData = [];
      const json = {
        gfmc: type === "buy" ? this.paramsObj.corpName : undefined,
        xfmc: type === "sale" ? this.paramsObj.corpName : undefined,
        year: this.startStopTime1,
      };
      let res = undefined;
      if (type === "buy") {
        res = await buyerGoodsDetail(json);
      } else {
        res = await sellerGoodsDetail(json);
      }
      if (res.message === "成功" && res.data.length) {
        graphData = this.getDataJson(res.data, type, 1, []);
      } else if (res.message === "成功" && !res.data.length) {
        const text = type === "buy" ? "暂无购货品类数据" : "暂无销货品类数据";
        this.$message.info(text);
      } else {
        this.$message.error(res.message);
      }
      return graphData;
    },
    getDataJson(arr, type, depth, parentKey) {
      const data = [];
      let children = [];
      arr.map((item, index) => {
        let name = item[`sp${depth}jflCn`];
        if (name) {
          name = name.trim();
          if (name === "") {
            name = "null";
          }
        } else {
          name = "null";
        }
        // if (depth === 1) {
        //   // topIndex在第一层定义，+1后对6取余
        //   // topIndex取颜色用 记录此层的顶层对应哪个颜色
        //   topIndex = (index + 1) % 6;
        // }
        // console.log("topIndex", topIndex);
        if (depth < 3) {
          if (
            type === "buy" &&
            item[`gxplGf${depth + 1}Dto`] &&
            item[`gxplGf${depth + 1}Dto`].length
          ) {
            children = this.getDataJson(
              item[`gxplGf${depth + 1}Dto`],
              type,
              depth + 1,
              [...parentKey, index]
            );
          } else if (
            type === "sale" &&
            item[`xf${depth + 1}Dto`] &&
            item[`xf${depth + 1}Dto`].length
          ) {
            children = this.getDataJson(
              item[`xf${depth + 1}Dto`],
              type,
              depth + 1,
              [...parentKey, index]
            );
          }
        }
        data.push({
          name,
          children,
          color: depth === 2 ? this.dotColor[index % 8] : undefined,
          ratio: item.zb ? parseFloat(item.zb.toFixed(1)) : 0,
          // value: depth === 3 ? item.zj || 0 : undefined,
          value: item.jshj || "null",
          money: item.jshj || "null",
          numValue: item.sl || 0,
          parentKey: [...parentKey, index],
          key: nanoid(),
        });
      });
      console.log("getDataJson", data, depth);
      return data;
    },
    getTreeData(arr, depth) {
      const data = [];
      arr.map((item) => {
        let children = [];
        if (depth < 3) {
          children = this.getTreeData(item.children, depth + 1);
        }
        data.push({
          title: item.name,
          children,
          key: item.key,
        });
      });
      return data;
    },
    async getGoodsPirce(value) {
      console.log("getGoodsPirce", value);
      this.graphList[0].sub = this.rank2 === 2 ? this.sp1jflCn : this.sp2jflCn;
      this.graphList[1].sub = this.rank2 === 2 ? this.sp1jflCn : this.sp2jflCn;
      const type = this.showType;
      const json = {
        gfmc: type === "buy" ? this.paramsObj.corpName : undefined,
        xfmc: type === "sale" ? this.paramsObj.corpName : undefined,
        year: this.startStopTime1,
        unit: value === "number" ? this.unit1 : this.unit2,
        rank: this.rank2,
        sp1jflCn: type === "buy" ? this.sp1jflCn : this.sp1jflCn,
        sp2jflCn: type === "buy" ? this.sp2jflCn : this.sp2jflCn,
      };
      let res = null;
      if (type === "buy") {
        res = await buyerGoodsPirce(json);
      } else {
        res = await sellerGoodsPirce(json);
      }
      if (
        res.message === "成功" &&
        res.data &&
        JSON.stringify(res.data) !== "{}"
      ) {
        const xAxis = [];
        const legend = [];
        if (value === "number") {
          if (this.unit1 === 1) {
            for (let i in res.data) {
              const value = res.data[i];
              xAxis.push(`${this.startStopTime1}`);
              value.map((item) => {
                const index = legend.indexOf(item[`sp${this.rank2}jflCn`]);
                if (index === -1) {
                  legend.push(item[`sp${this.rank2}jflCn`]);
                }
              });
            }
          } else if (this.unit1 === 2) {
            for (let i in res.data) {
              const value = res.data[i];
              xAxis.push(`${this.startStopTime1}Q${i}`);
              value.map((item) => {
                const index = legend.indexOf(item[`sp${this.rank2}jflCn`]);
                if (index === -1) {
                  legend.push(item[`sp${this.rank2}jflCn`]);
                }
              });
            }
          } else {
            for (let i in res.data) {
              const value = res.data[i];
              xAxis.push(`${this.startStopTime1}M${i}`);
              value.map((item) => {
                const index = legend.indexOf(item[`sp${this.rank2}jflCn`]);
                if (index === -1) {
                  legend.push(item[`sp${this.rank2}jflCn`]);
                }
              });
            }
          }
        } else {
          if (this.unit2 === 1) {
            for (let i in res.data) {
              const value = res.data[i];
              xAxis.push(`${this.startStopTime1}`);
              value.map((item) => {
                const index = legend.indexOf(item[`sp${this.rank2}jflCn`]);
                if (index === -1) {
                  legend.push(item[`sp${this.rank2}jflCn`]);
                }
              });
            }
          } else if (this.unit2 === 2) {
            for (let i in res.data) {
              const value = res.data[i];
              xAxis.push(`${this.startStopTime1}Q${i}`);
              value.map((item) => {
                const index = legend.indexOf(item[`sp${this.rank2}jflCn`]);
                if (index === -1) {
                  legend.push(item[`sp${this.rank2}jflCn`]);
                }
              });
            }
          } else {
            for (let i in res.data) {
              const value = res.data[i];
              xAxis.push(`${this.startStopTime1}M${i}`);
              value.map((item) => {
                const index = legend.indexOf(item[`sp${this.rank2}jflCn`]);
                if (index === -1) {
                  legend.push(item[`sp${this.rank2}jflCn`]);
                }
              });
            }
          }
        }
        console.log("legend", legend);

        // 动态添加series
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
            type: "scroll",
            top: 10,
            data: legend,
          },
          grid: {
            x: 10,
            y: 70,
            x2: 20,
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
              name: "单位：个",
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
            type: "scroll",
            top: 10,
            data: legend,
          },
          grid: {
            x: 10,
            y: 70,
            x2: 20,
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
              name: "单位：元",
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

        const graphData = {};

        // 动态生成graphData，存放对应legend的数据
        for (let index = 0; index < legend.length; index++) {
          graphData[index + 1] = {
            value: [],
            number: [],
          };
        }

        // 生成结构理应如下
        // graphData = {
        //   1: {
        //     value: [],
        //     number: [],
        //   },
        // }
        console.log("graphData", graphData);

        // 遍历获取每个legend的数据
        for (let i in res.data) {
          const value = res.data[i];
          legend.map((text, index) => {
            const target = find(
              value,
              (v) => v[`sp${this.rank2}jflCn`] === text
            ); // 找到当前图例对应的item
            if (target) {
              graphData[index + 1].number.push(target.sl || 0);
              graphData[index + 1].value.push(target.jshj || 0);
            } else {
              graphData[index + 1].number.push(0);
              graphData[index + 1].value.push(0);
            }
          });
        }

        legend.map((text, index) => {
          option1.series.push({
            name: text,
            type: "line",
            color: this.lineColor[index],
            // areaStyle: {
            //   color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //     { offset: 0, color: "rgba(41, 141, 255, 0.3)" },
            //     { offset: 1, color: "rgba(41, 141, 255, 0.05)" },
            //   ]),
            // },
            emphasis: {
              focus: "series",
            },
            data: graphData[index + 1].number,
          });
          option2.series.push({
            name: text,
            type: "line",
            color: this.lineColor[index],
            // areaStyle: {
            //   color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //     { offset: 0, color: "rgba(41, 141, 255, 0.3)" },
            //     { offset: 1, color: "rgba(41, 141, 255, 0.05)" },
            //   ]),
            // },
            emphasis: {
              focus: "series",
            },
            data: graphData[index + 1].value,
          });
        });
        console.log("options", option1, option2);
        this.myChart3 = this.$echarts.init(
          this.$refs.dataGraphs.$refs.graph3[0]
        );
        if (value === "number") {
          this.myChart3.setOption(option1, true);
          handleAddEchartsBackground(this.myChart3, option1, xAxis);
        }
        this.myChart4 = this.$echarts.init(
          this.$refs.dataGraphs.$refs.graph4[0]
        );
        if (value === "value") {
          this.myChart4.setOption(option2, true);
          handleAddEchartsBackground(this.myChart4, option2, xAxis);
        }
      } else if (
        res.message === "成功" &&
        (JSON.stringify(res.data) === "{}" || !res.data)
      ) {
        const message =
          value === "value"
            ? "暂无购货的货物金额变动趋势信息"
            : "暂无购货的货物数量变动趋势信息";
        this.$message.info(message);
      } else {
        this.$message.error(res.message);
      }
    },
    async buyerGoodsTop10() {
      const json = {
        gfmc: this.paramsObj.corpName,
        year: this.startStopTime1,
        rank: this.rank1,
        sp1jflCn: this.sp1jflCn,
        sp2jflCn: this.sp2jflCn,
        sp3jflCn: this.sp3jflCn,
      };
      const res = await buyerGoodsTop10(json);
      if (res.message === "成功" && res.data) {
        const data = res.data[res.data.resName];
        const listData = [];
        data.slice(0, 10).map((item) => {
          if (item) {
            listData.push({
              name: item.xfmc,
              num: item.jshj,
            });
          }
        });
        this.listData = listData;
      } else if (res.message === "成功" && !res.data) {
        this.$message.info("暂无当前货物品类价格信息");
      } else {
        this.$message.error(res.message);
      }
      this.topModalVisible = true;
    },
    async sellerGoodsTop10() {
      const json = {
        xfmc: this.paramsObj.corpName,
        year: this.startStopTime1,
        rank: this.rank1,
        sp1jflCn: this.sp1jflCn,
        sp2jflCn: this.sp2jflCn,
        sp3jflCn: this.sp3jflCn,
      };
      const res = await sellerGoodsTop10(json);
      if (res.message === "成功" && res.data) {
        const data = res.data[res.data.resName];
        const listData = [];
        data.slice(0, 10).map((item) => {
          if (item) {
            listData.push({
              name: item.gfmc,
              num: item.jshj,
            });
          }
        });
        this.listData = listData;
      } else if (res.message === "成功" && !res.data) {
        this.$message.info("暂无当前货物品类价格信息");
      } else {
        this.$message.error(res.message);
      }
      this.topModalVisible = true;
    },
    handleSelectChange(value, index) {
      if (index === 0) {
        this.unit1 = value;
        this.getGoodsPirce("number");
      } else {
        this.unit2 = value;
        this.getGoodsPirce("value");
      }
    },
    async getBillDetail(type) {
      const way = this.showType;
      if (type === "init") {
        this.$set(this.pagination, "current", 1);
      }
      if (!this.buyValue && !this.saleValue) {
        this.$message.info("购方和销方名称至少填一个！");
        return false;
      }
      let json = {
        sp1jflCn: this.firstValue,
        sp2jflCn: this.secondValue,
        sp3jflCn: this.thirdValue ? this.thirdValue : undefined,
        startYear: this.startStopTime3.length
          ? this.startStopTime3[0].format("YYYY")
          : undefined,
        endYear: this.startStopTime3.length
          ? this.startStopTime3[1].format("YYYY")
          : undefined,
        goodsName: this.inputValue,
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
      };
      this.infoQuery = json;
      if (way === "buy") {
        console.log("bingo2");
        // json.xfmc = undefined;
        json.xfmc = this.saleValue ? this.saleValue : undefined;
        json.gfmc = this.buyValue ? this.buyValue : this.paramsObj.corpName;
        this.buyValue = this.buyValue ? this.buyValue : this.paramsObj.corpName;
        this.saleValue = undefined;
      } else if (way === "sale") {
        console.log("bingo1");
        json.xfmc = this.saleValue ? this.saleValue : this.paramsObj.corpName;
        // json.gfmc = undefined;
        json.gfmc = this.buyValue ? this.buyValue : undefined;
        this.saleValue = this.saleValue
          ? this.saleValue
          : this.paramsObj.corpName;
        this.buyValue = undefined;
      } else {
        console.log("bingo3");
        json.xfmc = this.saleValue ? this.saleValue : undefined;
        json.gfmc = this.buyValue ? this.buyValue : undefined;
      }
      const res = await billDetail(json);
      const dataList = [];
      this.$set(this.pagination, "total", res.data.totalCount);
      if (res.message === "成功" && res.data && res.data.dateList.length) {
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
            price: item.dj ? parseFloat(item.dj).toFixed(2) : "--",
            number: item.sl || "--",
            money: item.je ? parseFloat(item.je).toFixed(2) : "--",
            tax: item.slv || "--",
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
      this.dataList = dataList;
    },
    async getBillTab() {
      if (!this.buyValue && !this.saleValue) {
        this.$message.info("购方和销方名称至少填一个！");
        return false;
      }
      const json = {
        xfmc: this.saleValue ? this.saleValue : undefined,
        gfmc: this.buyValue ? this.buyValue : undefined,
      };
      const res = await billTab(json);
      if (res.message === "成功" && res.data) {
        this.billTab = res.data;
        console.log("billTab", this.billTab);
      } else if (res.message === "成功" && !res.data) {
        this.$message.info("暂无商品分类信息");
        this.billTab = {};
      } else {
        this.billTab = {};
        this.$message.error(res.message);
      }
      this.thirdOptions = union(
        [
          {
            label: "全部",
            value: "",
          },
        ],
        (this.billTab[this.sp1jflCn] &&
          this.billTab[this.sp1jflCn][this.dataList2[0].name].map((item) => {
            return {
              value: item,
              label: item,
            };
          })) ||
          []
      );
    },
    changeShowType() {
      if (this.showType === "buy") {
        this.showType = "sale";
        this.buyValue = undefined;
        this.saleValue = this.paramsObj.corpName;
      } else {
        this.showType = "buy";
        this.saleValue = undefined;
        this.buyValue = this.paramsObj.corpName;
      }
      this.onInitPage();
    },
    handleClickBox(item, index) {
      console.log("handleClickBox", item);
      this.highlightIndex = index;
      this.selectItem = item;
      this.sp1jflCn = item.name;
      this.sp2jflCn = undefined;
      this.sp3jflCn = undefined;
      this.isClickCheck = false;
      this.rank2 = 2;
      this.getGoodsPirce("value");
      this.getGoodsPirce("number");

      const dataList2 = [];
      const pieData = [];
      const legendData = [];

      // 若选项为null,则置空图表
      // if (item.name === "null") {
      //   this.dataList2 = [];
      //   this.pieData = [];
      //   this.legendData = [];
      //   this.handleShowData2Filter();
      //   return;
      // }
      item.children.map((child, index) => {
        if (child) {
          dataList2.push({
            index,
            name: child.name || "--",
            number: child.numValue || "--",
            money: child.money || "--",
            ratio: child.ratio || 0,
            ranking: index + 1 || "--",
            child: child.children,
          });
          pieData.push({
            value: child.ratio || 0,
            name: child.name || "null",
            money: child.money ? parseFloat(child.money.toFixed(2)) : 0,
            parentKey: child.parentKey,
          });
          legendData.push(child.name || "null");
        }
      });
      console.log("dataList2", dataList2, pieData);
      this.dataList2 = dataList2;
      this.pieData = pieData;
      this.legendData = legendData;
      this.handleShowData2Filter();
      console.log("this.billTab", this.billTab);
      this.thirdOptions = union(
        [
          {
            label: "全部",
            value: "",
          },
        ],
        (this.billTab[this.sp1jflCn] &&
          this.billTab[this.sp1jflCn][this.dataList2[0].name].map((item) => {
            return {
              value: item,
              label: item,
            };
          })) ||
          []
      );
      console.log("this.thirdOptions", this.thirdOptions);
    },
    handleCheck(record) {
      console.log("handleCheck", record);
      this.isClickCheck = true;
      this.sp2jflCn = record.name;
      this.sp3jflCn = undefined;
      this.rank2 = 3;
      this.getGoodsPirce("value");
      this.getGoodsPirce("number");
      const pieData = [];
      const legendData = [];
      record.child.map((child) => {
        if (child) {
          pieData.push({
            value: child.ratio || 0,
            name: child.name || "null",
            money: child.money ? parseFloat(child.money.toFixed(2)) : 0,
            parentKey: child.parentKey,
          });
          legendData.push(child.name || "null");
        }
      });
      console.log("pieData", pieData);
      this.pieData = pieData;
      this.legendData = legendData;
      this.handleShowData2Filter();
      console.log("this.billTab", this.billTab);
      this.thirdOptions = union(
        [
          {
            label: "全部",
            value: "",
          },
        ],
        (this.billTab[this.sp1jflCn] &&
          this.billTab[this.sp1jflCn][this.sp2jflCn].map((item) => {
            return {
              value: item,
              label: item,
            };
          })) ||
          []
      );
      console.log("this.thirdOptions", this.thirdOptions);
    },
    handleRadioChange(e) {
      this.radioValue = e.target.value;
      this.handleShowData2Filter();
    },
    handleShowData1Filter() {
      // showData1
      // 先取top，再在结果里筛选
      this.highlightIndex = 0;
      this.selectItem = undefined;
      this.showData1 = this.dotData.slice(0, this.searchLimit);
      this.showData1 = this.getNewShowData(this.showData1, this.checkedKeys);
      this.showData1 = this.showData1.map((item) => {
        return {
          ...item,
          childLength: item.children.map((v) => {
            return parseInt(v.ratio);
          }).length
            ? item.children
                .map((v) => {
                  return parseInt(v.ratio);
                })
                .reduce((pre, current) => {
                  return pre + current;
                })
            : 0,
        };
      });
      // 存放筛选过后的一级、二级、三级品类信息
      this.sp1List = [];
      this.sp2List = [];
      this.sp3List = [];
      this.showData1.map((item1) => {
        this.sp1List.push(item1.name);

        if (item1.children && item1.children.length) {
          item1.children.map((item2) => {
            this.sp2List.push(item2.name);

            if (item2.children && item2.children.length) {
              item2.children.map((item3) => {
                this.sp3List.push(item3.name);
              });
            }
          });
        }
      });
    },
    handleShowData2Filter() {
      // showData2
      console.log(
        "handleShowData2Filter-------",
        this.sp1jflCn,
        this.sp2jflCn,
        this.dotData
      );
      const sliceValue = this.radioValue === "TOP10" ? 10 : 20;
      if (this.sp2jflCn) {
        // 如果二级品类已经选择过了，筛选该二级品类下的三级品类-showData2，展示那些存在于sp3List中的
        const targetData = find(
          find(this.dotData, (v) => v.name === this.sp1jflCn).children,
          (w) => w.name === this.sp2jflCn
        ).children;
        console.log("targetData1", targetData);
        this.showData2 = targetData.slice(0, sliceValue).filter((item) => {
          return this.sp3List.indexOf(item.name) > -1;
        });
      } else if (this.sp1jflCn) {
        // 如果一级品类已经选择过了，筛选该一级品类下的二级品类-showData2，展示那些存在于sp2List中的
        const targetData = find(
          this.dotData,
          (v) => v.name === this.sp1jflCn
        ).children;
        console.log("targetData2", targetData);
        this.showData2 = targetData.slice(0, sliceValue).filter((item) => {
          return this.sp2List.indexOf(item.name) > -1;
        });

        // 修改二级分类表格数据
        this.dataList2 = targetData
          .slice(0, sliceValue)
          .filter((item) => {
            return this.sp2List.indexOf(item.name) > -1;
          })
          .map((child, index) => {
            return {
              index,
              name: child.name || "--",
              number: child.numValue || "--",
              money: child.money || "--",
              ratio: child.ratio || 0,
              ranking: index + 1 || "--",
              child: child.children,
            };
          });
      } else {
        // this.sp1jflCn, this.sp2jflCn都为undefined，一二级品类都没选择，表示没有数据初始化二级品类表格和右边的饼图
        this.dataList2 = [];
        this.showData2 = [];
      }
      console.log(
        "this.showData2",
        this.showData2,
        this.dataList2,
        this.billTab,
        this.billTab[this.sp1jflCn]
      );
      this.thirdOptions = union(
        [
          {
            label: "全部",
            value: "",
          },
        ],
        (this.billTab[this.sp1jflCn] &&
          this.billTab[this.sp1jflCn][this.dataList2[0].name].map((item) => {
            return {
              value: item,
              label: item,
            };
          })) ||
          []
      );
      console.log("this.thirdOptions", this.thirdOptions);
      if (this.showData2.length) {
        setTimeout(() => {
          this.createPieGraph();
        }, 0);
      }
    },
    onCancel() {
      this.topModalVisible = false;
    },
    async onInitPage() {
      this.dotData = await this.getGoodsDetail();
      console.log("dotData", this.dotData);
      this.treeData = this.getTreeData(this.dotData, 1);
      this.expandedKeys = this.treeData.map((item) => {
        return item.key;
      });
      this.checkedKeys = this.expandedKeys;
      console.log("treeData", this.treeData);
      this.handleShowData1Filter();

      // 如果selectItem不在showData1中，模拟点击第一个
      if (this.showData1 > 0) {
        this.handleClickBox(this.showData1[0], 0);
      }

      this.sp1jflCn =
        (this.dotData.length && this.dotData[0].name) || undefined;
      this.sp2jflCn = undefined;
      this.sp3jflCn = undefined;
      this.rank2 = 2;
      this.getGoodsPirce("value");
      this.getGoodsPirce("number");

      const pieData = [];
      const legendData = [];
      if (this.dotData.length > 0 && this.dotData[0].children.length > 0) {
        this.dotData[0].children.map((item) => {
          if (item) {
            pieData.push({
              value: item.ratio || 0,
              name: item.name || "null",
              money: item.money ? parseFloat(item.money.toFixed(2)) : 0,
              parentKey: item.parentKey,
            });
            legendData.push(item.name || "null");
          }
        });
      }
      console.log("pieData-Change", pieData);
      this.pieData = pieData;
      this.legendData = legendData;
      this.handleShowData2Filter();
      this.getBillDetail("init");
      await this.getBillTab();
    },
    onLimitChange(value) {
      this.searchLimit = value;
      if (value === this.highlightIndex) {
        // 高亮选中的item已经被隐藏
        this.onInitPage();
      } else {
        // 否则只对点阵图进行隐藏
        this.handleShowData1Filter();
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
      this.startStopTime1 = value.format("YYYY");
      this.yearShow = false;
      this.onInitPage();
    },
  },
};
</script>
<style lang="less">
.purchase-sales-category {
  &-graph {
    min-height: 600px;
    display: flex;
    padding: 0 24px;
    background: #fff;
    flex-direction: column;

    .graph-content {
      display: grid;
      grid-template-columns: 1.27fr 1fr;
      grid-template-rows: 415px 267px;
      gap: 16px;

      .graph-item {
        overflow: hidden;

        &:first-child {
          grid-column-start: 1;
          grid-column-end: 2;
          grid-row-start: 1;
          grid-row-end: 2;
        }

        &:nth-child(2) {
          grid-column-start: 2;
          grid-column-end: 3;
          grid-row-start: 1;
          grid-row-end: 3;
        }

        &:nth-child(3) {
          grid-column-start: 1;
          grid-column-end: 2;
          grid-row-start: 2;
          grid-row-end: 3;

          .graph-item-content {
            border: 0;
            background: transparent;
          }
        }

        &-top {
          height: 32px;
          display: flex;
          line-height: 32px;
          align-items: center;
          margin-bottom: 16px;

          &-filter {
            display: flex;
            align-items: center;

            &:nth-of-type(2) {
              margin-right: 24px;
            }

            &:nth-of-type(3) {
              margin-right: 40px;
            }

            .filter-label {
              width: 75px;
            }

            .filter-input {
              width: 90px;
            }
          }

          &-btn {
            margin-right: 8px;

            &:last-child {
              color: #fff;
              background-image: linear-gradient(
                to right,
                rgba(1, 110, 255, 0.6),
                rgb(1, 110, 255)
              );
              padding: 0 14px;
              height: 32px;
              line-height: 32px;
              cursor: pointer;
            }
          }

          &-title {
            margin-right: 40px;

            .title-name {
              color: @blue;

              &.disabled {
                color: @secondaryTextColor;
              }
            }
          }
        }

        &-content {
          width: 100%;
          height: calc(100% - 48px);
          border: 1px solid @borderColor;
          background-color: rgba(1, 110, 255, 0.02);

          &-box {
            width: 100%;
            height: 100%;
            padding: 16px;
            overflow: auto;
            display: flex;

            .box-item {
              width: 206px;
              min-width: 208px;
              margin-right: 32px;

              &-top {
                width: 45px;
                height: 60px;
                margin: 0 auto;
                margin-bottom: 16px;
                background: url("~@/assets/images/img/title-tag.png") no-repeat
                  center;

                &-text {
                  width: 40px;
                  height: 40px;
                  background: #fff;
                  border-radius: 20px;
                  position: relative;
                  left: 2.5px;
                  top: 2px;
                  line-height: 38px;
                  font-size: 12px;
                  text-align: center;
                  color: @blue;
                }
              }

              &-content {
                width: 100%;
                height: 218px;
                padding-left: 4px;
                padding-top: 4px;
                border: 2px solid rgba(1, 110, 255, 0.02);

                &.active {
                  border-color: @blue;
                  box-shadow: 0px 0px 6px -4px rgba(1, 110, 255, 0.12),
                    0px 0px 16px rgba(1, 110, 255, 0.08),
                    0px 0px 28px 8px rgba(1, 110, 255, 0.05);
                }

                &-cell {
                  display: inline;

                  & > div {
                    width: 16px;
                    height: 16px;
                    margin-right: 4px;
                    margin-bottom: -1px;
                    display: inline-block;
                    background: @backgroundColor;
                  }
                }
              }

              &-bottom {
                height: 22px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 13.5px 0;

                .bottom-line {
                  width: 40px;
                  border-top: 1px solid @borderColor;
                }

                .bottom-text {
                  width: 90px;
                  height: 22px;
                  line-height: 22px;
                  text-align: center;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
              }
            }

            img {
              height: 70%;
              margin: 0 auto;
              margin-top: 60px;
            }
          }

          &-table {
            height: 100%;

            .ant-spin-nested-loading {
              height: 100%;

              .ant-spin-container {
                height: 100%;

                .ant-table {
                  height: 100%;

                  .ant-table-content {
                    height: 100%;

                    .ant-table-scroll {
                      height: 100%;
                      overflow: hidden;

                      .ant-table-body {
                        overflow-x: hidden !important;
                        overflow-y: scroll;
                      }
                    }
                  }
                }
              }
            }
            .ant-table-row-cell-break-word {
              padding: 10px 20px;
            }

            .ratio-slot {
              display: flex;
              justify-content: space-between;

              .ant-progress {
                min-width: 130px;
                width: calc(100% - 70px);
              }

              .ant-progress-inner {
                display: flex;
                justify-content: flex-end;

                .ant-progress-bg {
                  background: linear-gradient(
                    90deg,
                    #016eff 0%,
                    rgba(1, 110, 255, 0.2) 100%
                  );
                }
              }
            }
          }

          &-graph {
            height: 600px;

            img {
              width: 100%;
              margin-top: 100px;
            }
          }

          &-radio {
            display: flex;
            justify-content: center;
            margin-top: 16px;
          }
        }
      }

      .graph-item-content {
        width: 100%;
        height: calc(100% - 48px);
      }
    }
  }

  &-table {
    width: 100%;
    background: #fff;
    padding: 24px;

    .table-content {
      position: relative;
      margin-bottom: 24px;

      &-box {
        transition: all 0.3s;
      }

      &-item {
        display: flex;
        align-items: center;
        margin-bottom: 16px;

        .item-label {
          width: 75px;
          text-align: right;
          margin-right: 16px;
          color: @primaryTextColor;

          &.disabled {
            color: @disabledColor;
          }
        }

        .item-content {
          width: calc(100% - 91px);

          .ant-radio-group {
            .ant-radio-button-wrapper {
              color: @primaryTextColor;
              border: 1px solid @borderColor;
              border-radius: 16px;
              margin-right: 16px;
              padding: 0 14px;

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
        }
      }
    }
  }

  &-filter-modal {
    .ant-modal {
      top: 425px;
      position: absolute;
      left: 412px;
    }
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

.top-modal {
  &-content {
    &-title {
      height: 22px;
      line-height: 22px;
      margin-bottom: 8px;

      .title-text {
        color: @blue;
      }
    }

    &-list {
      display: flex;
      flex-direction: column;
      text-align: center;
      height: 410px;
      overflow: auto;

      .no-content {
        line-height: 410px;
      }

      .list-item {
        height: 41px;
        display: flex;
        padding: 0 16px;
        min-height: 41px;
        text-align: center;
        align-items: center;
        color: @primaryTextColor;
        justify-content: space-between;

        &:nth-child(2n - 1) {
          background: @tableHeaderColor;
        }

        &-index {
          width: 25px;
          height: 25px;
          line-height: 25px;
          text-align: center;
          border-radius: 12.5px;
          color: @primaryTextColor;
          background: @backgroundColor;

          &.top {
            color: #fff;
            background: @blue;
          }
        }

        &-name {
          width: 367px;
          padding: 0 10px;
          text-align: left;
        }

        &-num {
          width: 100px;
          font-weight: 700;
          text-align: right;
        }
      }
    }
  }
}

.graph-filter-popover {
  width: 360px;

  .ant-popover-inner {
    .ant-popover-title {
      height: 52px;
      padding: 14px 24px;
      font-weight: 600;
      line-height: 24px;
    }

    &-content {
      max-height: 500px;
      overflow: auto;
    }
  }
}
</style>
