<template>
  <div class="budget-tax">
    <div class="budget-right">
      <div class="budget-right-content">
        <div class="header-box">
          <div class="header-box-words">
            <div class="header-box-words-content">非税收入明细</div>
            <!-- <div class="header-box-words-content-small">
              当前单位：{{ curTreeItem.title }}
            </div>
            <div class="header-box-words-content-small">
              主管单位：{{ curTreeItemFather.title }}
            </div> -->
          </div>
          <!-- 右侧按钮 -->
          <div class="top-action">
            <a-button class="top-action-btn" @click="sortBtn()">
              <div class="top-action-btn-icon">
                <icon-svg icon-class="排序"></icon-svg>
              </div>
              排序
            </a-button>
            <a-button class="top-action-btn" @click="filterBtn()">
              <div class="top-action-btn-icon">
                <icon-svg icon-class="筛选"></icon-svg>
              </div>
              筛选
            </a-button>
            <a-button class="top-action-btn" @click="getBack()">
              返回
            </a-button>
            <!-- <a-tooltip
              placement="topLeft"
              overlayClassName="wrapper-title-tooltip"
            >
              <template slot="title">
                <span>111111</span>
              </template>
              <div class="tooltip-icon">
                <icon-svg icon-class="icon-warning" color="#1776FF"></icon-svg>
              </div>
            </a-tooltip> -->
          </div>
        </div>
        <!-- 表格 -->
        <a-table
          :columns="columns"
          :data-source="dataSource"
          :scroll="{ x: 'max-content', y: 'calc(100vh - 380px)' }"
          :bordered="true"
          :pagination="pagination"
          :loading="tableLoading"
        >
          <span
            slot="nonTaxRevenueAmount"
            slot-scope="nonTaxRevenueAmount"
            style="display: flex"
          >
            <a-progress
              :percent="(nonTaxRevenueAmount * 100) / maxNotaxAmount"
              size="small"
              :strokeColor="
                nonTaxRevenueAmount > maximumProjectRevenue ? '#e31430' : ''
              "
              :show-info="false"
              style="width: 140px"
            />
            <div style="width: 80px; margin-left: 8px">
              {{ Number(nonTaxRevenueAmount).toLocaleString() }}
            </div>
          </span>
        </a-table>
      </div>
      <div class="params-config">
        <div class="params-config-header">参数设置</div>
        <div class="params-config-item">
          <div class="item-label">年份：</div>
          <a-select
            placeholder="请选择"
            v-model="chosenYear"
            :options="yearOptions"
            class="item-input"
          />
        </div>
        <div class="params-config-item">
          <div class="item-label">非税收入类型</div>
          <a-select
            placeholder="请选择"
            v-model="chosenTaxType"
            :options="taxTypeOptions"
            class="item-input"
          />
          <!-- <a-slider
            v-model="ratioNumber"
            :min="0"
            :max="1"
            :step="0.1"
            :tipFormatter="(value) => value * 100 + '%'"
          /> -->
        </div>
        <div class="params-config-item">
          <div class="item-label">资金性质</div>
          <a-checkbox
            :indeterminate="indeterminate"
            :checked="checkAll"
            @change="onCheckAllChange"
            >全部</a-checkbox
          >
          <a-checkbox-group
            v-model="fundType"
            :options="fundTypeOptions"
            @change="onChange"
            class="item-input"
          />
        </div>
        <div class="params-config-item">
          <div class="item-label">项目收入较大值</div>
          <div class="color-box">
            <a-input-number
              class="right-action-input"
              placeholder="请选择"
              :min="0"
              :step="1"
              v-model="maximumProjectRevenue"
            />
            <!-- @change="handleRatioChange" -->
            <div class="color-box-red"></div>
          </div>
        </div>
        <div class="params-config-btns">
          <a-button style="margin-right: 8px" @click="handleParamsReset"
            >重置</a-button
          >
          <a-button type="primary" @click="getBudgetTableTwoAll()"
            >确定</a-button
          >
        </div>
      </div>
    </div>
    <!-- 排序按钮 -->
    <SortModal
      v-if="sortOptions.length"
      sortTitle="非税收入明细排序配置"
      :sortShow="sortShow"
      @onSortCancel="onSortCancel"
      @onSortConfirm="onSortConfirm"
      :sortOptions="sortOptions"
      firstSortName="当年项目名称+非税收入金额"
    ></SortModal>

    <!-- 筛选按钮 -->
    <FilterModal
      filterTitle="非税收入明细筛选配置"
      :filterShow="filterShow"
      :paramsOption="paramsOption"
      :tableData="tableData"
      @addTable3="addTable"
      @delTable3="delTable"
      @onFilterCancel="onFilterCancel"
      @onFilterConfirm="onFilterConfirm"
    ></FilterModal>

    <!-- 页面悬浮框 -->
    <!-- <a-popover
      trigger="click"
      placement="leftTop"
      overlayClassName="budget-tax-fixed"
    >
      <template slot="content">
        <div class="content-item">
          <div class="content-item-label">年份</div>
          <a-select
            placeholder="请选择"
            v-model="chosenYear"
            :options="yearOptions"
            class="content-item-value"
          />
        </div>
        <div class="content-item">
          <div class="content-item-label">非税收入类型</div>
          <a-select
            placeholder="请选择"
            v-model="chosenTaxType"
            :options="taxTypeOptions"
            class="content-item-value"
          />
        </div>
        <div class="content-item">
          <div class="content-item-label">资金性质</div>
          <a-select
            placeholder="请选择"
            v-model="chosenFunds"
            :options="fundsOptions"
            class="content-item-value"
          />
        </div>
        <div class="content-item">
          <div class="content-item-label">项目收入较大值</div>
          <div class="color-box">
            <a-input-number
              class="right-action-input"
              placeholder="请选择"
              :min="0"
              :step="1"
              v-model="maximumProjectRevenue"
              @change="handleRatioChange"
            />
            <div class="color-box-red"></div>
          </div>
        </div>
        <div class="content-btn">
          <a-button style="margin-right: 8px" @click="handleParamsReset"
            >重置</a-button
          >
          <a-button type="primary" @click="getBudgetTableTwoAll()"
            >确定</a-button
          >
        </div>
      </template>
      <div class="fixed-icon">
        <icon-svg icon-class="参数" />
      </div>
    </a-popover> -->
  </div>
</template>
<script>
import FilterModal from "@/components/filterModal.vue";
import SortModal from "@/components/sortModal.vue";
import {
  getBudgetTableTwoAll,
  getBudgetTableTwoAllFilter,
  getBudgetTableTwoAllMoneyOptions,
  getBudgetTableTwoAllNoTaxOptions,
  getBudgetTableTwoAllSort,
} from "@/shared/newApi/budget/budget.js";
import {
  Button,
  InputNumber,
  Checkbox,
  // Tooltip,
  // Popover,
  Progress,
  Select,
  // Input,
  TreeSelect,
} from "ant-design-vue";
import { mapState } from "vuex";

const SHOW_PARENT = TreeSelect.SHOW_PARENT;

export default {
  name: "BudgetTax",
  data() {
    return {
      SHOW_PARENT,

      //传入所选单位代码
      budgetCode: null,
      //页面悬浮框
      //年份
      chosenYear: "2023",
      yearOptions: [
        {
          value: "2020",
          label: "2020",
        },
        {
          value: "2021",
          label: "2021",
        },
        {
          value: "2022",
          label: "2022",
        },
        {
          value: "2023",
          label: "2023",
        },
      ],
      //项目分类
      chosenTaxType: null,
      taxTypeOptions: [],

      // taxTypeOptions: [
      //   {
      //     value: "全部",
      //     label: "全部",
      //   },
      //   {
      //     value: "部分",
      //     label: "部分",
      //   },
      //   {
      //     value: "一部分",
      //     label: "一部分",
      //   },
      //   {
      //     value: "大部分",
      //     label: "大部分",
      //   },
      // ],
      //资金性质
      fundType: [],
      checkAll: true,
      indeterminate: false,
      fundTypeOptions: [],

      // fundsOptions: [
      //   {
      //     value: "全部",
      //     label: "全部",
      //   },
      //   {
      //     value: "部分",
      //     label: "部分",
      //   },
      //   {
      //     value: "一部分",
      //     label: "一部分",
      //   },
      //   {
      //     value: "大部分",
      //     label: "大部分",
      //   },
      // ],
      //项目收入较大值
      maximumProjectRevenue: 330000,

      //筛选
      filterShow: false,
      filterConfirmArr: "",
      paramsOption: [],

      // paramsOption: [
      //   {
      //     value: "字段一",
      //     label: "字段一",
      //   },
      //   {
      //     value: "字段二",
      //     label: "字段二",
      //   },
      //   {
      //     value: "字段三",
      //     label: "字段三",
      //   },
      // ],
      tableData: [
        // {
        //   id: "1",
        //   name: "字段一",
        //   compare: "等于",
        //   value: "1234",
        // },
        // {
        //   id: "2",
        //   name: "字段二",
        //   compare: "不等于",
        //   value: "1234",
        // },
        // {
        //   id: "3",
        //   name: "字段三",
        //   compare: "包含",
        //   value: "1234",
        // },
        // {
        //   id: "4",
        //   name: "字段四",
        //   compare: "不包含",
        //   value: "1234",
        // },
        // {
        //   id: "1",
        //   name: "字段一",
        //   compare: "等于",
        //   value: "1234",
        // },
        // {
        //   id: "2",
        //   name: "字段二",
        //   compare: "不等于",
        //   value: "1234",
        // },
        // {
        //   id: "3",
        //   name: "字段三",
        //   compare: "包含",
        //   value: "1234",
        // },
        // {
        //   id: "4",
        //   name: "字段四",
        //   compare: "不包含",
        //   value: "1234",
        // },
      ],

      //排序
      sortShow: false,
      sortString: "",
      //排序选项
      sortOptions: [],

      // sortOptions: [
      //   {
      //     label: "字段1",
      //     value: "字段1",
      //   },
      //   {
      //     label: "字段2",
      //     value: "字段2",
      //   },
      //   {
      //     label: "字段3",
      //     value: "字段3",
      //   },
      //   {
      //     label: "字段4",
      //     value: "字段4",
      //   },
      //   {
      //     label: "字段5",
      //     value: "字段5",
      //   },
      //   {
      //     label: "字段6",
      //     value: "字段6",
      //   },
      //   {
      //     label: "字段7",
      //     value: "字段7",
      //   },
      //   {
      //     label: "字段8",
      //     value: "字段8",
      //   },
      // ],

      //表格数据
      columns: [
        {
          title: "当年项目名称",
          dataIndex: "currentYearProjectName",
          key: "currentYearProjectName",
          width: 160,
        },
        {
          title: "非税收入类型",
          dataIndex: "nonTaxRevenueType",
          key: "nonTaxRevenueType",
          width: 140,
        },
        {
          title: "资金性质",
          dataIndex: "fundNature",
          key: "fundNature",
          width: 140,
        },
        {
          title: "缴款人全称",
          dataIndex: "payerFullName",
          key: "payerFullName",
          width: 120,
        },
        {
          title: "收款人全称",
          dataIndex: "payeeFullName",
          key: "payeeFullName",
          width: 120,
        },
        {
          title: "缴款日期",
          dataIndex: "paymentDate",
          key: "paymentDate",
          width: 120,
        },
        {
          title: "入账日期",
          dataIndex: "entryDate",
          key: "entryDate",
          width: 120,
        },
        {
          title: "非税收入金额（元）",
          dataIndex: "nonTaxRevenueAmount",
          key: "nonTaxRevenueAmount",
          width: 220,
          scopedSlots: { customRender: "nonTaxRevenueAmount" },
        },
      ],
      dataSource: [],
      tableLoading: false,

      // dataSource: [
      //   {
      //     currentYearProjectName: "体育公益活动", // 当年项目名称
      //     nonTaxRevenueType: "xxx", // 非税收入类型
      //     fundNature: "xxx", // 资金性质
      //     payerFullName: "xxx", // 缴款人全称
      //     payeeFullName: "xxx", // 收款人全称
      //     paymentDate: "2022-11-11", // 缴款日期
      //     entryDate: "2024-11-11", // 入账日期
      //     nonTaxRevenueAmount: "330333", // 非税收入金额（万元）
      //   },
      //   {
      //     currentYearProjectName: "体育公益活动", // 当年项目名称
      //     nonTaxRevenueType: "xxx", // 非税收入类型
      //     fundNature: "xxx", // 资金性质
      //     payerFullName: "xxx", // 缴款人全称
      //     payeeFullName: "xxx", // 收款人全称
      //     paymentDate: "2022-11-11", // 缴款日期
      //     entryDate: "2024-11-11", // 入账日期
      //     nonTaxRevenueAmount: "320333", // 非税收入金额（万元）
      //   },
      //   {
      //     currentYearProjectName: "体育公益活动", // 当年项目名称
      //     nonTaxRevenueType: "xxx", // 非税收入类型
      //     fundNature: "xxx", // 资金性质
      //     payerFullName: "xxx", // 缴款人全称
      //     payeeFullName: "xxx", // 收款人全称
      //     paymentDate: "2022-11-11", // 缴款日期
      //     entryDate: "2024-11-11", // 入账日期
      //     nonTaxRevenueAmount: "430333", // 非税收入金额（万元）
      //   },
      //   {
      //     currentYearProjectName: "体育公益活动", // 当年项目名称
      //     nonTaxRevenueType: "xxx", // 非税收入类型
      //     fundNature: "xxx", // 资金性质
      //     payerFullName: "xxx", // 缴款人全称
      //     payeeFullName: "xxx", // 收款人全称
      //     paymentDate: "2022-11-11", // 缴款日期
      //     entryDate: "2024-11-11", // 入账日期
      //     nonTaxRevenueAmount: "230333", // 非税收入金额（万元）
      //   },
      //   {
      //     currentYearProjectName: "体育公益活动", // 当年项目名称
      //     nonTaxRevenueType: "xxx", // 非税收入类型
      //     fundNature: "xxx", // 资金性质
      //     payerFullName: "xxx", // 缴款人全称
      //     payeeFullName: "xxx", // 收款人全称
      //     paymentDate: "2022-11-11", // 缴款日期
      //     entryDate: "2024-11-11", // 入账日期
      //     nonTaxRevenueAmount: "130333", // 非税收入金额（万元）
      //   },
      //   {
      //     currentYearProjectName: "体育公益活动", // 当年项目名称
      //     nonTaxRevenueType: "xxx", // 非税收入类型
      //     fundNature: "xxx", // 资金性质
      //     payerFullName: "xxx", // 缴款人全称
      //     payeeFullName: "xxx", // 收款人全称
      //     paymentDate: "2022-11-11", // 缴款日期
      //     entryDate: "2024-11-11", // 入账日期
      //     nonTaxRevenueAmount: "354243", // 非税收入金额（万元）
      //   },
      //   {
      //     currentYearProjectName: "体育公益活动", // 当年项目名称
      //     nonTaxRevenueType: "xxx", // 非税收入类型
      //     fundNature: "xxx", // 资金性质
      //     payerFullName: "xxx", // 缴款人全称
      //     payeeFullName: "xxx", // 收款人全称
      //     paymentDate: "2022-11-11", // 缴款日期
      //     entryDate: "2024-11-11", // 入账日期
      //     nonTaxRevenueAmount: "243125", // 非税收入金额（万元）
      //   },
      //   {
      //     currentYearProjectName: "体育公益活动", // 当年项目名称
      //     nonTaxRevenueType: "xxx", // 非税收入类型
      //     fundNature: "xxx", // 资金性质
      //     payerFullName: "xxx", // 缴款人全称
      //     payeeFullName: "xxx", // 收款人全称
      //     paymentDate: "2022-11-11", // 缴款日期
      //     entryDate: "2024-11-11", // 入账日期
      //     nonTaxRevenueAmount: "324533", // 非税收入金额（万元）
      //   },
      //   {
      //     currentYearProjectName: "体育公益活动", // 当年项目名称
      //     nonTaxRevenueType: "xxx", // 非税收入类型
      //     fundNature: "xxx", // 资金性质
      //     payerFullName: "xxx", // 缴款人全称
      //     payeeFullName: "xxx", // 收款人全称
      //     paymentDate: "2022-11-11", // 缴款日期
      //     entryDate: "2024-11-11", // 入账日期
      //     nonTaxRevenueAmount: "123633", // 非税收入金额（万元）
      //   },
      //   {
      //     currentYearProjectName: "体育公益活动", // 当年项目名称
      //     nonTaxRevenueType: "xxx", // 非税收入类型
      //     fundNature: "xxx", // 资金性质
      //     payerFullName: "xxx", // 缴款人全称
      //     payeeFullName: "xxx", // 收款人全称
      //     paymentDate: "2022-11-11", // 缴款日期
      //     entryDate: "2024-11-11", // 入账日期
      //     nonTaxRevenueAmount: "452333", // 非税收入金额（万元）
      //   },
      //   {
      //     currentYearProjectName: "体育公益活动", // 当年项目名称
      //     nonTaxRevenueType: "xxx", // 非税收入类型
      //     fundNature: "xxx", // 资金性质
      //     payerFullName: "xxx", // 缴款人全称
      //     payeeFullName: "xxx", // 收款人全称
      //     paymentDate: "2022-11-11", // 缴款日期
      //     entryDate: "2024-11-11", // 入账日期
      //     nonTaxRevenueAmount: "230333", // 非税收入金额（万元）
      //   },
      //   {
      //     currentYearProjectName: "体育公益活动", // 当年项目名称
      //     nonTaxRevenueType: "xxx", // 非税收入类型
      //     fundNature: "xxx", // 资金性质
      //     payerFullName: "xxx", // 缴款人全称
      //     payeeFullName: "xxx", // 收款人全称
      //     paymentDate: "2022-11-11", // 缴款日期
      //     entryDate: "2024-11-11", // 入账日期
      //     nonTaxRevenueAmount: "130333", // 非税收入金额（万元）
      //   },
      //   {
      //     currentYearProjectName: "体育公益活动", // 当年项目名称
      //     nonTaxRevenueType: "xxx", // 非税收入类型
      //     fundNature: "xxx", // 资金性质
      //     payerFullName: "xxx", // 缴款人全称
      //     payeeFullName: "xxx", // 收款人全称
      //     paymentDate: "2022-11-11", // 缴款日期
      //     entryDate: "2024-11-11", // 入账日期
      //     nonTaxRevenueAmount: "430333", // 非税收入金额（万元）
      //   },
      //   {
      //     currentYearProjectName: "体育公益活动", // 当年项目名称
      //     nonTaxRevenueType: "xxx", // 非税收入类型
      //     fundNature: "xxx", // 资金性质
      //     payerFullName: "xxx", // 缴款人全称
      //     payeeFullName: "xxx", // 收款人全称
      //     paymentDate: "2022-11-11", // 缴款日期
      //     entryDate: "2024-11-11", // 入账日期
      //     nonTaxRevenueAmount: "230333", // 非税收入金额（万元）
      //   },
      // ],

      maxNotaxAmount: null, //非税收入金额最大值

      //分页
      pagination: {
        size: "small",
        total: 0,
        current: 1,
        pageSize: 1000,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ["1000", "1500", "2000"],
        showTotal: (total) => {
          return `共${total}条记录`;
        },
        onChange: (page, pageSize) => {
          this.pagination.current = page;
          this.pagination.pageSize = pageSize;
          this.getBudgetTableTwoAll();
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = 1;
          this.pagination.pageSize = size;
          this.getBudgetTableTwoAll();
        },
      },
    };
  },
  components: {
    SortModal,
    FilterModal,
    // ATreeSelect: TreeSelect,
    ASelect: Select,
    AInputNumber: InputNumber,
    ACheckbox: Checkbox,
    ACheckboxGroup: Checkbox.Group,
    // ATooltip: Tooltip,
    // APopover: Popover,
    // AInput: Input,
    AButton: Button,
    AProgress: Progress,
  },
  computed: {
    ...mapState("blockAnalysis", ["blockChoosedYear"]),
    ...mapState("budgetPortrait", ["curTreeItem", "curTreeItemFather"]),
    // ...mapState("managePortrait", ["fundTypeOptions"]),
  },
  watch: {
    curTreeItem: {
      async handler(newVal, oldVal) {
        console.log("5656555", newVal, oldVal);
        this.budgetCode = newVal.key; //所选单位代码
        //重置页面大小以及页面第1页
        this.pagination.current = 1;
        this.pagination.pageSize = 1000;
        //获取非税收入类型分类下拉框
        await this.getBudgetTableTwoAllNoTaxOptions();
        //获取资金性质分类下拉框
        await this.getBudgetTableTwoAllMoneyOptions();
        // //获取非税收入明细完整表排序下拉框
        await this.getBudgetTableTwoAllSort();
        // //获取非税收入明细完整表筛选下拉框
        await this.getBudgetTableTwoAllFilter();
        //获取表格数据
        this.getBudgetTableTwoAll();
      },
      deep: true,
    },
  },
  async mounted() {
    console.log(
      "fundTypeOptions",
      this.fundTypeOptions.map((item) => item.value)
    );
    this.fundType = this.fundTypeOptions.map((item) => item.value);
    this.budgetCode = this.$route.query.budgetUnitCode; //所选单位代码
    //获取非税收入类型分类下拉框
    await this.getBudgetTableTwoAllNoTaxOptions();
    //获取资金性质分类下拉框
    await this.getBudgetTableTwoAllMoneyOptions();
    // //获取非税收入明细完整表排序下拉框
    await this.getBudgetTableTwoAllSort();
    // //获取非税收入明细完整表筛选下拉框
    await this.getBudgetTableTwoAllFilter();
    //获取表格数据
    this.getBudgetTableTwoAll();
  },
  methods: {
    async handleParamsReset() {
      //非税收入类型
      this.chosenTaxType = null;
      // 资金性质
      // this.chosenFunds = null;
      this.checkAll = true;
      this.indeterminate = false;
      this.fundType = this.fundTypeOptions.map((item) => item.value);
      //年份
      this.chosenYear = "2023";
      //项目收入较大值
      this.maximumProjectRevenue = 330000;
      // //获取三公支出明细完整表排序下拉框
      //获取非税收入类型分类下拉框
      await this.getBudgetTableTwoAllNoTaxOptions();
      //获取资金性质分类下拉框
      await this.getBudgetTableTwoAllMoneyOptions();
      // //获取非税收入明细完整表排序下拉框
      await this.getBudgetTableTwoAllSort();
      // //获取非税收入明细完整表筛选下拉框
      await this.getBudgetTableTwoAllFilter();
      //获取表格数据
      this.getBudgetTableTwoAll();
    },
    //获取非税收入类型分类下拉框
    async getBudgetTableTwoAllNoTaxOptions() {
      const json = {};
      const res = await getBudgetTableTwoAllNoTaxOptions(json);
      console.log("页面内 获取非税收入类型分类下拉框res", res);
      if (res.message === "成功") {
        const obj = {
          label: "全部",
          value: null,
        };
        console.log("message成功 获取非税收入类型分类下拉框", res.data);
        res.data.unshift(obj);
        this.taxTypeOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //获取资金性质分类下拉框
    async getBudgetTableTwoAllMoneyOptions() {
      const json = {};
      const res = await getBudgetTableTwoAllMoneyOptions(json);
      console.log("页面内 获取资金性质分类下拉框res", res);
      if (res.message === "成功") {
        // const obj = {
        //   label: "全部",
        //   value: null,
        // };
        console.log("message成功 获取资金性质分类下拉框", res.data);
        // res.data.unshift(obj);
        this.fundTypeOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    onChange(checkedList) {
      // console.log(545345353453, this.fundType);
      this.indeterminate =
        !!checkedList.length &&
        checkedList.length < this.fundTypeOptions.length;
      this.checkAll = checkedList.length === this.fundTypeOptions.length;
    },
    onCheckAllChange(e) {
      Object.assign(this, {
        fundType: e.target.checked
          ? this.fundTypeOptions.map((item) => item.value)
          : [],
        indeterminate: false,
        checkAll: e.target.checked,
      });
    },

    //获取非税收入明细完整表排序下拉框
    async getBudgetTableTwoAllSort() {
      this.sortOptions = [];
      const json = {};
      const res = await getBudgetTableTwoAllSort(json);
      console.log("页面内 获取非税收入明细完整表排序下拉框res", res);
      if (res.message === "成功") {
        console.log("message成功 获取非税收入明细完整表排序下拉框", res.data);
        this.sortOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //获取非税收入明细完整表筛选下拉框
    async getBudgetTableTwoAllFilter() {
      const json = {};
      const res = await getBudgetTableTwoAllFilter(json);
      console.log("页面内 获取非税收入明细完整表筛选下拉框res", res);
      if (res.message === "成功") {
        console.log("message成功 获取非税收入明细完整表筛选下拉框", res.data);
        this.paramsOption = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //获取表格数据
    async getBudgetTableTwoAll() {
      let json = {};
      if (this.checkAll) {
        json = {
          unitCode: this.budgetCode, //单位code
          year: this.chosenYear, //年份
          nontax_type_name: this.chosenTaxType, // 非税收入类型
          funds_nature_name: [], // 资金性质
          pageSize: this.pagination.pageSize, //页面大小
          pageOffset: this.pagination.pageSize * (this.pagination.current - 1), //页面页码
          filterCondition: this.filterConfirmArr,
          odName: this.sortString,
        };
      } else {
        json = {
          unitCode: this.budgetCode, //单位code
          year: this.chosenYear, //年份
          nontax_type_name: this.chosenTaxType, // 非税收入类型
          funds_nature_name: this.fundType, // 资金性质
          pageSize: this.pagination.pageSize, //页面大小
          pageOffset: this.pagination.pageSize * (this.pagination.current - 1), //页面页码
          filterCondition: this.filterConfirmArr,
          odName: this.sortString,
        };
      }
      // console.log(23412413532, this.fundType);
      this.tableLoading = true;
      const res = await getBudgetTableTwoAll(json);
      this.tableLoading = false;
      console.log("页面内 获取非税收入明细完整表res", res);
      if (res.message === "成功") {
        console.log("message成功 获取非税收入明细完整表", res.data);
        this.dataSource = res.data.dateList;
        //找出数据最大值
        const amountArr = res.data.dateList.map(
          (item) => item.nonTaxRevenueAmount
        );
        const maxNotaxAmount = Math.max(...amountArr);
        this.maxNotaxAmount = maxNotaxAmount;
        this.pagination.total = res.data.total;
      } else {
        this.$message.error(res.message);
      }
    },

    //排序
    sortBtn() {
      this.sortShow = true;
    },
    onSortCancel() {
      this.sortShow = false;
    },
    onSortConfirm(sortString) {
      this.sortString = sortString;
      // this.getSpendTable();

      this.onSortCancel();
      this.getBudgetTableTwoAll();
    },

    //筛选
    filterBtn() {
      this.filterShow = true;
    },
    addTable(json) {
      this.tableData = [...this.tableData, json];
    },
    //筛选：增加
    delTable(arr) {
      this.tableData = arr;
    },
    onFilterCancel() {
      this.filterShow = false;
    },
    onFilterConfirm(filterConfirmArr) {
      // this.getSpendTable();
      this.filterConfirmArr = filterConfirmArr;
      this.onFilterCancel();

      this.getBudgetTableTwoAll();
    },

    //返回跳转
    getBack() {
      this.$router.push({
        path: "/budget-portrait/budget-detail",
      });
    },
  },
};
</script>
<style lang="less">
.budget-tax {
  width: calc(100% - 320px);
  height: calc(100% - 35px);
  padding: 20px;
  background: #fff;
  display: flex;

  .budget-right {
    display: flex;
    width: 100%;
    height: 100%;
    position: relative;

    &-content {
      width: calc(100% - 220px);
      margin-right: 220px;

      //顶部标题文字以及按钮
      .header-box {
        display: flex;
        justify-content: space-between;
        height: 32px;
        margin-bottom: 20px;

        &-words {
          display: flex;
          justify-content: center;
          align-items: center;

          //大标题
          &-content {
            height: 28px;
            line-height: 28px;
            color: #1c222b;
            font-size: 20px;
            font-weight: 600;
          }

          //小标题
          .header-box-words-content-small {
            height: 22px;
            line-height: 22px;
            color: #3c485c;
            font-size: 14px;
            font-weight: 400;
            margin-left: 20px;
          }
        }

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

          &-btn:last-of-type {
            //返回按钮窄一点
            width: 70px;
            justify-content: center;
            // margin-right: 50px;
            //待修改
          }

          .tooltip-icon {
            margin-top: 7px;
            margin-left: 10px;
          }
        }
      }
    }

    .params-config {
      width: 200px;
      position: fixed;
      right: 40px;
      border: 1px solid #d6dbe3;
      border-radius: 6px;
      padding: 12px 16px;

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

        .item-input {
          width: 100%;

          .ant-input-number-handler-wrap {
            display: none;
          }
        }

        .right-action-input {
          width: 100%;

          // .ant-input-number-handler-wrap {
          //   display: none;
          // }
        }

        .color-box {
          width: 100%;
          display: flex;
          // justify-content: space-between;

          &-red {
            width: 30px;
            height: 30px;
            margin-left: 30px;
            background-color: #e31430;
          }

          &-green {
            width: 30px;
            height: 30px;
            margin-left: 30px;
            background-color: #1bb46d;
          }
        }
      }

      &-btns {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-top: 20px;
      }
    }
  }
}
// 页面弹框
// .budget-tax-fixed {
//   .ant-popover-content {
//     border-radius: 4px;
//     border: 1px solid #d6dbe3;
//     background: #fff;
//     box-shadow: 0px 8px 16px 0px rgba(23, 118, 255, 0.05),
//       0px 20px 16px 4px rgba(23, 118, 255, 0.08);

//     .ant-popover-arrow {
//       display: none !important;
//     }

//     .ant-popover-inner-content {
//       width: 210px;

//       .content-item {
//         &-label {
//           margin-bottom: 4px;
//         }

//         .color-box {
//           display: flex;

//           &-red {
//             width: 24px;
//             height: 24px;
//             background-color: #e31430;
//             margin: 6px 0 0 25px;
//           }

//           &-green {
//             width: 24px;
//             height: 24px;
//             background-color: #1bb46d;
//             margin: 6px 0 0 25px;
//           }
//         }

//         &-value {
//           width: 100%;
//         }

//         &:not(:last-child) {
//           margin-bottom: 16px;
//         }
//       }

//       .content-btn {
//         display: flex;
//         justify-content: flex-end;
//       }
//     }
//   }
// }
</style>
