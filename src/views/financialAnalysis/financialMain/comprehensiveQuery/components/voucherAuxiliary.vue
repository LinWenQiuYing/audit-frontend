<!--凭证辅助明细表 -->
<template>
  <div>
    <CommonList
      isTitle
      listClass="voucher-auxiliary"
      :columns="columns"
      :dataSource="dataSource"
      :loading="tableLoading"
      :pagination="pagination"
      bordered
      :scroll="{ x: 'max-content', y: 'calc(100vh - 559px)' }"
    >
      <!-- 顶上的选择框 -->
      <template slot="searchOptions">
        <!-- 单位名称 -->
        <div class="bottom-search-item">
          <div class="item-label">单位名称：</div>
          <!-- <a-input
            placeholder="请输入单位名称"
            v-model.trim="unitName"
            class="item-value"
          /> -->
          <a-select
            class="item-value"
            v-model="unitName"
            show-search
            placeholder="请输入"
            option-filter-prop="children"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            allowClear
            @search="getVoucherAuxUnitName"
          >
            <a-select-option
              v-for="item in unitNameOptions"
              :key="item.label"
              :title="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </div>
        <!-- 会计年度 -->
        <div class="bottom-search-item">
          <div class="item-label">会计年度：</div>
          <a-select
            class="item-value"
            placeholder="请选择会计年度"
            v-model="accountingYear"
          >
            <a-select-option
              v-for="item in accountingYearOptions"
              :key="item.label"
              :title="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </div>
        <!-- 会计月度 -->
        <div class="bottom-search-item">
          <div class="item-label">会计月度：</div>
          <a-select
            class="item-value"
            placeholder="请选择"
            v-model="accountingMonth"
          >
            <a-select-option
              v-for="item in accountingMonthOptions"
              :key="item.label"
              :title="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </div>
        <!-- 科目名称 -->
        <div class="bottom-search-item">
          <div class="item-label">科目名称：</div>
          <!-- <a-input
            placeholder="请输入科目名称"
            v-model.trim="subjectName"
            class="item-value"
          /> -->
          <a-select
            class="item-value"
            v-model="subjectName"
            show-search
            placeholder="请输入"
            option-filter-prop="children"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            allowClear
            @search="getVoucherAuxSubjectName"
          >
            <a-select-option
              v-for="item in subjectNameOptions"
              :key="item.label"
              :title="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </div>
        <!-- 科目编码 -->
        <div class="bottom-search-item">
          <div class="item-label">科目编码：</div>
          <a-input
            placeholder="请输入科目编码"
            v-model.trim="subjectCode"
            class="item-value"
          />
        </div>
        <!-- 会计体系 -->
        <div class="bottom-search-item">
          <div class="item-label">会计体系：</div>
          <!-- <a-input
            placeholder="请输入会计体系"
            v-model.trim="accountingSystem"
            class="item-value"
          /> -->
          <a-select
            class="item-value"
            placeholder="请选择"
            v-model="accountingSystem"
          >
            <a-select-option
              v-for="item in accountingSystemOptions"
              :key="item.label"
              :title="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </div>
        <!-- 记账凭证摘要 -->
        <div class="bottom-search-item">
          <div class="item-label">记账凭证摘要：</div>
          <a-input
            placeholder="请输入记账凭证摘要"
            v-model.trim="accountingAbstract"
            class="item-value"
          />
        </div>
        <!-- 记账凭证日期 -->
        <div class="bottom-search-item">
          <div class="item-label">记账凭证日期：</div>
          <a-date-picker v-model="voucherDate" class="item-value" />
          <!--  @change="onChangeDate"  -->
        </div>
        <!-- 辅助类型 -->
        <div class="bottom-search-item">
          <div class="item-label">辅助类型：</div>
          <a-input
            placeholder="请输入辅助类型"
            v-model.trim="auxiliaryType"
            class="item-value"
          />
        </div>
        <!-- 辅助编码 -->
        <div class="bottom-search-item">
          <div class="item-label">辅助编码：</div>
          <a-input
            placeholder="请输入辅助编码"
            v-model.trim="auxiliaryCode"
            class="item-value"
          />
        </div>
        <!-- 辅助全称 -->
        <div class="bottom-search-item">
          <div class="item-label">辅助全称：</div>
          <a-input
            placeholder="请输入辅助全称"
            v-model.trim="fullAuxiliaryName"
            class="item-value"
          />
        </div>
        <!-- 辅助名称 -->
        <div class="bottom-search-item">
          <div class="item-label">辅助名称：</div>
          <a-input
            placeholder="请输入辅助名称"
            v-model.trim="auxiliaryName"
            class="item-value"
          />
        </div>
        <!-- 电子帐簿名称 -->
        <div class="bottom-search-item">
          <div class="item-label">电子帐簿名称：</div>
          <!-- <a-input
            placeholder="请输入电子帐簿名称"
            v-model.trim="electronicLedgerName"
            class="item-value"
          /> -->
          <a-select
            class="item-value"
            v-model="electronicLedgerName"
            show-search
            placeholder="请输入"
            option-filter-prop="children"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            allowClear
            @search="getVoucherAuxLedgerName"
          >
            <a-select-option
              v-for="item in electronicLedgerNameOptions"
              :key="item.label"
              :title="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </div>
        <!-- 行政区划名称 -->
        <div class="bottom-search-item">
          <div class="item-label">行政区划名称：</div>
          <!-- <a-input
            placeholder="请输入行政区划名称"
            v-model.trim="divisionName"
            class="item-value"
          /> -->
          <a-select
            class="item-value"
            placeholder="请选择"
            v-model="divisionName"
          >
            <a-select-option
              v-for="item in divisionNameOptions"
              :key="item.label"
              :title="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </div>
        <div class="bottom-search-item"></div>
        <!-- 查询重置排序按钮 -->
        <div class="bottom-search-item actions">
          <a-button
            type="primary"
            class="actions-btn"
            @click="getVoucherAuxData()"
            >查询</a-button
          >
          <a-button type="primary" class="actions-btn">重置</a-button>
          <a-button type="primary" class="actions-btn" @click="sortBtn()">
            <div class="actions-btn-icon">
              <icon-svg icon-class="排序"></icon-svg>
            </div>
            排序
          </a-button>
        </div>
      </template>
    </CommonList>
    <!-- 排序按钮 -->
    <SortModal
      sortTitle="凭证辅助明细表排序配置"
      v-if="sortOptions.length"
      :sortShow="sortShow"
      @onSortCancel="onSortCancel"
      @onSortConfirm="onSortConfirm"
      :sortOptions="sortOptions"
      firstSortName=""
    ></SortModal>
    <!-- firstSortName="单位名称+会计年度+会计月份+记账凭证日期" -->
  </div>
</template>
<script>
import CommonList from "@/components/commonList.vue";
import SortModal from "@/components/sortModal.vue";
import {
  getVoucherAuxData,
  getVoucherAuxSort,
  getVoucherAuxYear,
  getVoucherAuxMonth,
  getVoucherAuxDivision,
  getVoucherAuxUnitName,
  getVoucherAuxLedgerName,
  getVoucherAuxSubjectName,
  getVoucherAuxSystem,
} from "@/shared/newApi/financialAnalysis.js";
import { Button, DatePicker, Input, Select } from "ant-design-vue";
// import { formatDecimalValues } from "../../util";
// const { Group } = Radio;
export default {
  name: "VoucherAuxiliary",
  data() {
    return {
      tableLoading: false,
      //排序按钮
      sortShow: false,
      sortOptions: [],
      sortString: "",

      //行政区划名称
      divisionName: null,
      divisionNameOptions: [],
      //会计年度
      accountingYear: "2023",
      accountingYearOptions: [],
      //会计年度
      accountingMonth: null,
      accountingMonthOptions: [],
      //单位名称
      unitName: null,
      unitNameOptions: [],
      //电子帐簿名称
      electronicLedgerName: null,
      electronicLedgerNameOptions: [],
      //记账摘要
      accountingAbstract: null,
      //记账凭证日期
      voucherDate: null,
      //辅助类型
      auxiliaryType: null,
      //辅助编码
      auxiliaryCode: null,
      //辅助全称
      fullAuxiliaryName: null,
      //辅助名称
      auxiliaryName: null,

      //按钮部分
      popoverVisible: false,
      sortSelected: 0,
      radioStyle: {
        display: "block",
        height: "30px",
        lineHeight: "30px",
      },

      //表头
      columns: [
        {
          title: "单位名称",
          dataIndex: "organizationName",
          key: "organizationName",
          width: 150,
          fixed: "left",
        },
        {
          title: "会计年度",
          dataIndex: "fiscalYear",
          key: "fiscalYear",
          width: 110,
          fixed: "left",
        },
        {
          title: "会计月份",
          dataIndex: "fiscalMonth",
          key: "fiscalMonth",
          width: 110,
          fixed: "left",
        },
        {
          title: "记账凭证日期",
          dataIndex: "voucherDate",
          key: "voucherDate",
          width: 160,
        },
        {
          title: "记账凭证编号",
          dataIndex: "voucherNumber",
          key: "voucherNumber",
          width: 160,
        },
        {
          title: "分类序号",
          dataIndex: "classificationNumber",
          key: "classificationNumber",
          width: 160,
        },
        {
          title: "记账凭证摘要",
          dataIndex: "accountingSummary",
          key: "accountingSummary",
          width: 160,
        },
        {
          title: "科目名称",
          dataIndex: "subjectName",
          key: "subjectName",
          width: 150,
        },
        {
          title: "辅助名称",
          dataIndex: "assistanceName",
          key: "assistanceName",
          width: 160,
        },
        {
          title: "借方发生额",
          dataIndex: "debitOccurrenceAmount",
          key: "debitOccurrenceAmount",
          width: 150,
        },
        {
          title: "贷方发生额",
          dataIndex: "creditOccurrenceAmount",
          key: "creditOccurrenceAmount",
          width: 160,
        },
        {
          title: "外币借方发生额",
          dataIndex: "foreignCurrencyDebitOccurrenceAmount",
          key: "foreignCurrencyDebitOccurrenceAmount",
          width: 160,
        },
        {
          title: "外币贷方发生额",
          dataIndex: "foreignCurrencyCreditOccurrenceAmount",
          key: "foreignCurrencyCreditOccurrenceAmount",
          width: 160,
        },
        {
          title: "辅助类型",
          dataIndex: "assistanceType",
          key: "assistanceType",
          width: 150,
        },
        {
          title: "辅助编码",
          dataIndex: "assistanceCode",
          key: "assistanceCode",
          width: 150,
        },
        {
          title: "辅助全称",
          dataIndex: "fullAssistanceName",
          key: "fullAssistanceName",
          width: 160,
        },
        {
          title: "一级辅助编码",
          dataIndex: "firstLevelAssistanceCode",
          key: "firstLevelAssistanceCode",
          width: 160,
        },
        {
          title: "一级辅助名称",
          dataIndex: "firstLevelAssistanceName",
          key: "firstLevelAssistanceName",
          width: 150,
        },
        {
          title: "二级辅助编码",
          dataIndex: "secondLevelAssistanceCode",
          key: "secondLevelAssistanceCode",
          width: 150,
        },
        {
          title: "二级辅助名称",
          dataIndex: "secondLevelAssistanceName",
          key: "secondLevelAssistanceName",
          width: 160,
        },
        {
          title: "三级辅助编码",
          dataIndex: "thirdLevelAssistanceCode",
          key: "thirdLevelAssistanceCode",
          width: 160,
        },
        {
          title: "三级辅助名称",
          dataIndex: "thirdLevelAssistanceName",
          key: "thirdLevelAssistanceName",
          width: 150,
        },
        {
          title: "四级辅助编码",
          dataIndex: "fourthLevelAssistanceCode",
          key: "fourthLevelAssistanceCode",
          width: 160,
        },
        {
          title: "四级辅助名称",
          dataIndex: "fourthLevelAssistanceName",
          key: "fourthLevelAssistanceName",
          width: 160,
        },
        {
          title: "五级辅助编码",
          dataIndex: "fifthLevelAssistanceCode",
          key: "fifthLevelAssistanceCode",
          width: 160,
        },
        {
          title: "五级辅助名称",
          dataIndex: "fifthLevelAssistanceName",
          key: "fifthLevelAssistanceName",
          width: 160,
        },
        {
          title: "六级辅助编码",
          dataIndex: "sixthLevelAssistanceCode",
          key: "sixthLevelAssistanceCode",
          width: 150,
        },
        {
          title: "六级辅助名称",
          dataIndex: "sixthLevelAssistanceName",
          key: "sixthLevelAssistanceName",
          width: 160,
        },
        {
          title: "七级辅助编码",
          dataIndex: "seventhLevelAssistanceCode",
          key: "seventhLevelAssistanceCode",
          width: 160,
        },
        {
          title: "七级辅助名称",
          dataIndex: "seventhLevelAssistanceName",
          key: "seventhLevelAssistanceName",
          width: 170,
        },
        {
          title: "八级辅助编码",
          dataIndex: "eighthLevelAssistanceCode",
          key: "eighthLevelAssistanceCode",
          width: 150,
        },
        {
          title: "八级辅助名称",
          dataIndex: "eighthLevelAssistanceName",
          key: "eighthLevelAssistanceName",
          width: 160,
        },
        {
          title: "九级辅助编码",
          dataIndex: "ninthLevelAssistanceCode",
          key: "ninthLevelAssistanceCode",
          width: 160,
        },
        {
          title: "九级辅助名称",
          dataIndex: "ninthLevelAssistanceName",
          key: "ninthLevelAssistanceName",
          width: 170,
        },
        {
          title: "币种",
          dataIndex: "currencyType",
          key: "currencyType",
          width: 160,
        },
        {
          title: "汇率",
          dataIndex: "exchangeRate",
          key: "exchangeRate",
          width: 160,
        },
        {
          title: "数量",
          dataIndex: "quantity",
          key: "quantity",
          width: 160,
        },
        {
          title: "单价",
          dataIndex: "unitPrice",
          key: "unitPrice",
          width: 150,
        },
        {
          title: "记账类型编号",
          dataIndex: "accountingTypeNum",
          key: "accountingTypeNum",
          width: 160,
        },
        {
          title: "记账凭证种类",
          dataIndex: "voucherType",
          key: "voucherType",
          width: 160,
        },
        {
          title: "记账凭证行号",
          dataIndex: "voucherLineNumber",
          key: "voucherLineNumber",
          width: 160,
        },
        {
          title: "会计科目编码",
          dataIndex: "subjectCode",
          key: "subjectCode",
          width: 150,
        },
        {
          title: "会计体系",
          dataIndex: "accountingSystem",
          key: "accountingSystem",
          width: 160,
        },
        {
          title: "电子账簿编号",
          dataIndex: "electronicLedgerNumber",
          key: "electronicLedgerNumber",
          width: 160,
        },
        {
          title: "电子账簿名称",
          dataIndex: "electronicLedgerName",
          key: "electronicLedgerName",
          width: 160,
        },
        {
          title: "单位代码",
          dataIndex: "organizationCode",
          key: "organizationCode",
          width: 150,
        },
        {
          title: "行政区划代码",
          dataIndex: "administrativeDivisionCode",
          key: "administrativeDivisionCode",
          width: 150,
        },
        {
          title: "行政区划名称",
          dataIndex: "administrativeDivisionName",
          key: "administrativeDivisionName",
          width: 130,
        },
      ],

      //表格数据来源
      dataSource: [
        // {
        //   administrativeDivisionCode: "示例内容", // 行政区划代码
        //   administrativeDivisionName: "示例内容", // 行政区划名称
        //   fiscalYear: "示例内容", // 会计年度
        //   organizationCode: "示例内容", // 单位代码
        //   organizationName: "示例内容", // 单位名称
        //   electronicLedgerNumber: "示例内容", // 会计电子账簿编号
        //   electronicLedgerName: "示例内容", // 会计电子账簿名称
        //   accountingSystem: "示例内容", // 会计体系
        //   fiscalMonth: "示例内容", // 会计月份
        //   voucherDate: "示例内容", // 记账凭证日期
        //   voucherType: "示例内容", // 记账凭证种类
        //   voucherNumber: "示例内容", // 记账凭证编号
        //   voucherLineNumber: "示例内容", // 记账凭证行号
        //   classificationNumber: "示例内容", // 分类序号
        //   accountingSummary: "示例内容", // 记账凭证摘要
        //   subjectCode: "示例内容", // 科目编码
        //   subjectName: "示例内容", // 科目名称
        //   assistanceType: "示例内容", // 辅助类型
        //   assistanceCode: "示例内容", // 辅助编码
        //   assistanceName: "示例内容", // 辅助名称
        //   fullAssistanceName: "示例内容", // 辅助全称
        //   firstLevelAssistanceCode: "示例内容", // 一级辅助编码
        //   firstLevelAssistanceName: "示例内容", // 一级辅助名称
        //   secondLevelAssistanceCode: "示例内容", // 二级辅助编码
        //   secondLevelAssistanceName: "示例内容", // 二级辅助名称
        //   thirdLevelAssistanceCode: "示例内容", // 三级辅助编码
        //   thirdLevelAssistanceName: "示例内容", // 三级辅助名称
        //   fourthLevelAssistanceCode: "示例内容", // 四级辅助编码
        //   fourthLevelAssistanceName: "示例内容", // 四级辅助名称
        //   fifthLevelAssistanceCode: "示例内容", // 五级辅助编码
        //   fifthLevelAssistanceName: "示例内容", // 五级辅助名称
        //   sixthLevelAssistanceCode: "示例内容", // 六级辅助编码
        //   sixthLevelAssistanceName: "示例内容", // 六级辅助名称
        //   seventhLevelAssistanceCode: "示例内容", // 七级辅助编码
        //   seventhLevelAssistanceName: "示例内容", // 七级辅助名称
        //   eighthLevelAssistanceCode: "示例内容", // 八级辅助编码
        //   eighthLevelAssistanceName: "示例内容", // 八级辅助名称
        //   ninthLevelAssistanceCode: "示例内容", // 九级辅助编码
        //   ninthLevelAssistanceName: "示例内容", // 九级辅助名称
        //   debitOccurrenceAmount: "示例内容", // 借方发生额
        //   creditOccurrenceAmount: "示例内容", // 贷方发生额
        //   currencyType: "示例内容", // 币种
        //   foreignCurrencyDebitOccurrenceAmount: "示例内容", // 外币借方发生额
        //   foreignCurrencyCreditOccurrenceAmount: "示例内容", // 外币贷方发生额
        //   exchangeRate: "示例内容", // 汇率
        //   quantity: "示例内容", // 数量
        //   unitPrice: "示例内容", // 单价
        // },
      ],

      pagination: {
        //表格底部
        size: "small",
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ["10", "20", "50", "100"],
        showTotal: (total) => {
          return `共${total}条记录`;
        },
        onChange: (page, pageSize) => {
          this.pagination.current = page;
          this.pagination.pageSize = pageSize;
          this.getVoucherAuxData();
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = 1;
          this.pagination.pageSize = size;
          this.getVoucherAuxData();
        },
      },
    };
  },
  computed: {
    // ...mapState("auditOptions", ["paramsObj"]),
  },
  components: {
    SortModal,
    CommonList,
    ADatePicker: DatePicker,
    ASelect: Select,
    AButton: Button,
    AInput: Input,
  },
  async mounted() {
    this.getVoucherAuxYear();
    this.getVoucherAuxMonth();
    this.getVoucherAuxDivision();
    this.getVoucherAuxLedgerName();
    this.getVoucherAuxSystem();
    this.getVoucherAuxSort();
  },
  methods: {
    //单位名称下拉框
    async getVoucherAuxUnitName(value) {
      const json = {
        inputData: value, // 单位编码
      };
      const res = await getVoucherAuxUnitName(json);

      if (res.message === "成功") {
        console.log("message成功 单位名称下拉框", res.data);
        this.unitNameOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //年份下拉框
    async getVoucherAuxYear() {
      const res = await getVoucherAuxYear();
      if (res.message === "成功") {
        console.log("message成功 年份下拉框", res.data);
        this.accountingYearOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //月份下拉框
    async getVoucherAuxMonth() {
      const res = await getVoucherAuxMonth();
      if (res.message === "成功") {
        console.log("message成功 年份下拉框", res.data);
        this.accountingMonthOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //科目名称下拉框
    async getVoucherAuxSubjectName(value) {
      const json = {
        inputData: value, // 单位编码
      };
      const res = await getVoucherAuxSubjectName(json);

      if (res.message === "成功") {
        console.log("message成功 科目名称下拉框", res.data);
        this.subjectNameOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //会计体系下拉框
    async getVoucherAuxSystem() {
      const res = await getVoucherAuxSystem();

      if (res.message === "成功") {
        console.log("message成功 会计体系下拉框", res.data);
        this.accountingSystemOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //电子账簿名称下拉框
    async getVoucherAuxLedgerName() {
      const json = {
        unitCode: this.choosedBudget, // 单位编码
      };
      const res = await getVoucherAuxLedgerName(json);

      if (res.message === "成功") {
        console.log("message成功 电子账簿名称下拉框", res.data);
        this.electronicLedgerNameOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //行政区划名称下拉框
    async getVoucherAuxDivision() {
      const res = await getVoucherAuxDivision();
      if (res.message === "成功") {
        console.log("message成功 行政区划名称下拉框", res.data);
        this.divisionNameOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    async getVoucherAuxSort() {
      this.sortOptions = [];
      const res = await getVoucherAuxSort();
      if (res.message === "成功") {
        console.log(
          "message成功页面页面内会计期间定义表排序字段数据",
          res.data
        );
        this.sortOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //凭证辅助明细表数据
    async getVoucherAuxData() {
      const json = {
        admDivName: this.divisionName, // 行政区划编码
        year: this.accountingYear, // 会计年度
        month: this.accountingMonth, // 会计年度
        unitName: this.unitName, // 单位编码
        acctEbkName: this.electronicLedgerName, // 会计电子账簿编码
        voucherSummary: this.accountingAbstract, // 凭证摘要
        acctVoucherDate: this.voucherDate, // 凭证日期
        acctSubjName: this.subjectName, // 凭证日期
        acctSystem: this.accountingSystem, // 凭证日期
        acctSubjCode: this.subjectCode, // 凭证日期
        auxType: this.auxiliaryType, // 辅助类型
        auxCode: this.auxiliaryCode, // 辅助编码
        auxName: this.auxiliaryName, // 辅助名称
        fullAuxName: this.fullAuxiliaryName, // 辅助全称
        pageSize: this.pagination.pageSize, // 页面大小
        pageOffset: this.pagination.pageSize * (this.pagination.current - 1), //偏移量// 页码
      };
      this.tableLoading = true;
      const res = await getVoucherAuxData(json);
      this.tableLoading = false;
      console.log("页面内凭证辅助明细表数据res", res);
      if (res.message === "成功") {
        console.log("message成功页面凭证辅助明细表数据", res.data);
        // this.dataSource = formatDecimalValues(res.data.dateList);
        this.dataSource = res.data.dateList;
        this.pagination.total = res.data.total;
      } else {
        this.$message.error(res.message);
      }
    },

    //排序按钮
    sortBtn() {
      this.sortShow = true;
    },
    onSortCancel() {
      this.sortShow = false;
    },
    onSortConfirm(sortString) {
      this.sortString = sortString;
      this.getVoucherAuxData();
      this.onSortCancel();
    },
  },
};
</script>

<style>
.voucher-auxiliary {
  width: 100%;
  height: 100%;
  padding-left: 20px;
  background: #fff;
}
</style>
