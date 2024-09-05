<!-- 记账凭证表 -->
<template>
  <div>
    <CommonList
      isTitle
      listClass="account-voucher"
      :columns="columns"
      :loading="tableLoading"
      :dataSource="dataSource"
      :pagination="pagination"
      bordered
      :scroll="{ x: 'max-content', y: 'calc(100vh - 511px)' }"
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
            @search="getAccVoucherUnitName"
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
          <div class="item-label">会计月份：</div>
          <a-select
            class="item-value"
            placeholder="请选择会计月度"
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
            @search="getAccVoucherSubjectName"
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
        <!-- <div class="bottom-search-item">
          <div class="item-label">科目编码：</div>
          <a-input
            placeholder="请输入科目编码"
            v-model.trim="subjectCode"
            class="item-value"
          />
        </div> -->
        <div class="bottom-search-item">
          <div class="item-label">科目编码：</div>
          <div class="item-value-special">
            <a-select v-model="selectedOption" @change="handleSelectChange">
              <a-select-option value="all">全部</a-select-option>
              <a-select-option value="equals">等于</a-select-option>
              <a-select-option value="contains">包含</a-select-option>
              <a-select-option value="startsWith">开头为</a-select-option>
              <a-select-option value="endsWith">结尾为</a-select-option>
            </a-select>
            <a-input
              v-model.trim="subjectCode"
              :disabled="isInputDisabled"
              placeholder="请输入匹配条件"
            />
          </div>
          <!-- <a-input
            placeholder="请输入科目编码"
            v-model.trim="subjectCode"
            class="item-value"
          /> -->
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
            @search="getAccVoucherLedgerName"
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
        <div class="bottom-search-item"></div>
        <div class="bottom-search-item"></div>
        <!-- 查询重置排序按钮 -->
        <div class="bottom-search-item actions">
          <a-button
            type="primary"
            class="actions-btn"
            @click="getAccVoucherData()"
            >查询</a-button
          >
          <a-button type="primary" class="actions-btn" @click="reset"
            >重置</a-button
          >
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
      sortTitle="记账凭证表排序配置"
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
  getAccVoucherData,
  getAccVoucherYear,
  getAccVoucherMonth,
  getAccVoucherUnitName,
  getAccVoucherLedgerName,
  getAccVoucherSystem,
  getAccVoucherSubjectName,
  getAccVoucherSort,
} from "@/shared/newApi/financialAnalysis.js";
import { Button, DatePicker, Input, Select } from "ant-design-vue";
// import { formatDecimalValues } from "../../util";

// const { Group } = Radio;
export default {
  name: "AccountVoucher",
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
      //会计月度
      accountingMonth: null,
      accountingMonthOptions: [],
      //单位名称
      unitName: null,
      unitNameOptions: [],
      //电子帐簿名称
      electronicLedgerName: null,
      electronicLedgerNameOptions: [],
      //会计体系
      accountingSystem: null,
      accountingSystemOptions: [],
      //科目名称
      subjectName: null,
      subjectNameOptions: [],
      //记账凭证摘要
      accountingAbstract: null,

      //记账凭证日期
      voucherDate: null,

      //科目编码
      //科目编码
      subjectCode: null,
      selectedOption: "all", // 默认选项

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
          title: "分录序号",
          dataIndex: "entrySequenceNumber",
          key: "entrySequenceNumber",
          width: 110,
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
          title: "借方发生额",
          dataIndex: "debitOccurrenceAmount",
          key: "debitOccurrenceAmount",
          width: 150,
        },
        {
          title: "贷方发生额",
          dataIndex: "creditOccurrenceAmount",
          key: "creditOccurrenceAmount",
          width: 150,
        },
        {
          title: "对方科目编码",
          dataIndex: "counterpartySubjectCode",
          key: "counterpartySubjectCode",
          width: 150,
        },
        {
          title: "对方科目名称",
          dataIndex: "counterpartySubjectName",
          key: "counterpartySubjectName",
          width: 150,
        },
        {
          title: "币种",
          dataIndex: "currency",
          key: "currency",
          width: 150,
        },
        {
          title: "借方外币发生额",
          dataIndex: "foreignCurrencyDebitOccurrenceAmount",
          key: "foreignCurrencyDebitOccurrenceAmount",
          width: 150,
        },
        {
          title: "贷方外币发生额",
          dataIndex: "foreignCurrencyCreditOccurrenceAmount",
          key: "foreignCurrencyCreditOccurrenceAmount",
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
          width: 110,
        },
        {
          title: "结算方式",
          dataIndex: "settlementMethod",
          key: "settlementMethod",
          width: 110,
        },
        {
          title: "附件数",
          dataIndex: "attachmentCount",
          key: "attachmentCount",
          width: 110,
        },
        {
          title: "制单人员",
          dataIndex: "preparer",
          key: "preparer",
          width: 110,
        },
        {
          title: "复核人员",
          dataIndex: "reviewer",
          key: "reviewer",
          width: 110,
        },
        {
          title: "记账人员",
          dataIndex: "accountant",
          key: "accountant",
          width: 110,
        },
        {
          title: "出纳人员",
          dataIndex: "cashier",
          key: "cashier",
          width: 110,
        },
        {
          title: "财务主管",
          dataIndex: "financialSupervisor",
          key: "financialSupervisor",
          width: 150,
        },
        {
          title: "源凭证号",
          dataIndex: "sourceVoucherNumber",
          key: "sourceVoucherNumber",
          width: 150,
        },
        {
          title: "记账标志",
          dataIndex: "accountingFlag",
          key: "accountingFlag",
          width: 160,
        },
        {
          title: "作废标志",
          dataIndex: "cancellationFlag",
          key: "cancellationFlag",
          width: 150,
        },
        {
          title: "是否结转",
          dataIndex: "isCarryForward",
          key: "isCarryForward",
          width: 150,
        },
        {
          title: "是否为预算账",
          dataIndex: "isBudgetAccount",
          key: "isBudgetAccount",
          width: 150,
        },
        {
          title: "支付单据编号",
          dataIndex: "paymentDocumentNumber",
          key: "paymentDocumentNumber",
          width: 150,
        },
        {
          title: "功能科目代码",
          dataIndex: "functionalSubjectCode",
          key: "functionalSubjectCode",
          width: 160,
        },
        {
          title: "功能科目名称",
          dataIndex: "functionalSubjectName",
          key: "functionalSubjectName",
          width: 160,
        },
        {
          title: "经济科目代码",
          dataIndex: "economicSubjectCode",
          key: "economicSubjectCode",
          width: 160,
        },
        {
          title: "经济科目名称",
          dataIndex: "economicSubjectName",
          key: "economicSubjectName",
          width: 160,
        },
        {
          title: "资金性质代码",
          dataIndex: "fundNatureCode",
          key: "fundNatureCode",
          width: 160,
        },
        {
          title: "资金性质名称",
          dataIndex: "fundNatureName",
          key: "fundNatureName",
          width: 160,
        },
        {
          title: "指标来源码",
          dataIndex: "sourceOfIndicatorCode",
          key: "sourceOfIndicatorCode",
          width: 160,
        },
        {
          title: "指标来源名称",
          dataIndex: "sourceOfIndicatorName",
          key: "sourceOfIndicatorName",
          width: 160,
        },
        {
          title: "支持类型码",
          dataIndex: "supportTypeCode",
          key: "supportTypeCode",
          width: 160,
        },
        {
          title: "支出类型名称",
          dataIndex: "expenditureTypeName",
          key: "expenditureTypeName",
          width: 160,
        },
        {
          title: "预算管理类型代码",
          dataIndex: "budgetManagementTypeCode",
          key: "budgetManagementTypeCode",
          width: 160,
        },
        {
          title: "预算管理类型名称",
          dataIndex: "budgetManagementTypeName",
          key: "budgetManagementTypeName",
          width: 160,
        },
        {
          title: "支付方式代码",
          dataIndex: "paymentMethodCode",
          key: "paymentMethodCode",
          width: 160,
        },
        {
          title: "支付方式名称",
          dataIndex: "paymentMethodName",
          key: "paymentMethodName",
          width: 150,
        },
        {
          title: "预算项目代码",
          dataIndex: "budgetProjectCode",
          key: "budgetProjectCode",
          width: 150,
        },
        {
          title: "预算项目名称",
          dataIndex: "budgetProjectName",
          key: "budgetProjectName",
          width: 150,
        },
        {
          title: "项目分类代码",
          dataIndex: "projectCategoryCode",
          key: "projectCategoryCode",
          width: 150,
        },
        {
          title: "项目分类名称",
          dataIndex: "projectCategoryName",
          key: "projectCategoryName",
          width: 150,
        },
        {
          title: "指标文号名称",
          dataIndex: "indicatorDocumentName",
          key: "indicatorDocumentName",
          width: 150,
        },
        {
          title: "结算方式代码",
          dataIndex: "settlementMethodCode",
          key: "settlementMethodCode",
          width: 150,
        },
        {
          title: "结算方式名称",
          dataIndex: "settlementMethodName",
          key: "settlementMethodName",
          width: 150,
        },
        {
          title: "记账类型编号",
          dataIndex: "acctingTypeNum",
          key: "acctingTypeNum",
          width: 160,
        },
        {
          title: "记账类型名称",
          dataIndex: "acctingTypeName",
          key: "acctingTypeName",
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
          dataIndex: "acctingVoucherLineNum",
          key: "acctingVoucherLineNum",
          width: 160,
        },
        {
          title: "科目编码",
          dataIndex: "subjectCode",
          key: "subjectCode",
          width: 150,
        },
        {
          title: "科目全称",
          dataIndex: "fullSubjectName",
          key: "fullSubjectName",
          width: 160,
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
        // {
        //   title: "记账类型日期",
        //   dataIndex: "voucherTypeDate",
        //   key: "voucherTypeDate",
        //   width: 160,
        // },
      ],

      //表格数据来源
      dataSource: [],

      // dataSource: [
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     electronicLedgerNumber: "示例内容", // 电子账簿编号
      //     electronicLedgerName: "示例内容", // 电子账簿名称
      //     accountingSystem: "示例内容", // 会计体系
      //     fiscalMonth: "示例内容", // 会计月份
      //     voucherDate: "示例内容", // 记账凭证日期
      //     voucherTypeDate: "示例内容", // 记账类型日期
      //     voucherType: "示例内容", // 记账凭证种类
      //     voucherNumber: "示例内容", // 记账凭证编号
      //     entrySequenceNumber: "示例内容", // 分录序号
      //     accountingSummary: "示例内容", // 记账凭证摘要
      //     subjectCode: "示例内容", // 科目编码
      //     subjectName: "示例内容", // 科目名称
      //     fullSubjectName: "示例内容", // 科目全称
      //     debitOccurrenceAmount: "示例内容", // 借方发生额
      //     creditOccurrenceAmount: "示例内容", // 贷方发生额
      //     counterpartySubjectCode: "示例内容", // 对方科目编码
      //     counterpartySubjectName: "示例内容", // 对方科目名称
      //     currency: "示例内容", // 币种
      //     foreignCurrencyDebitOccurrenceAmount: "示例内容", // 借方外币发生额
      //     foreignCurrencyCreditOccurrenceAmount: "示例内容", // 贷方外币发生额
      //     exchangeRate: "示例内容", // 汇率
      //     quantity: "示例内容", // 数量
      //     unitPrice: "示例内容", // 单价
      //     settlementMethod: "示例内容", // 结算方式
      //     attachmentCount: "示例内容", // 附件数
      //     preparer: "示例内容", // 制单人员
      //     reviewer: "示例内容", // 复核人员
      //     accountant: "示例内容", // 记账人员
      //     cashier: "示例内容", // 出纳人员
      //     financialSupervisor: "示例内容", // 财务主管
      //     sourceVoucherNumber: "示例内容", // 源凭证号
      //     accountingFlag: "示例内容", // 记账标志
      //     cancellationFlag: "示例内容", // 作废标志
      //     isCarryForward: "示例内容", // 是否结转
      //     isBudgetAccount: "示例内容", // 是否为预算账
      //     paymentDocumentNumber: "示例内容", // 支付单据编号
      //     functionalSubjectCode: "示例内容", // 功能科目代码
      //     functionalSubjectName: "示例内容", // 功能科目名称
      //     economicSubjectCode: "示例内容", // 经济科目代码
      //     economicSubjectName: "示例内容", // 经济科目名称
      //     fundNatureCode: "示例内容", // 资金性质代码
      //     fundNatureName: "示例内容", // 资金性质名称
      //     sourceOfIndicatorCode: "示例内容", // 指标来源码
      //     sourceOfIndicatorName: "示例内容", // 指标来源名称
      //     supportTypeCode: "示例内容", // 支持类型码
      //     expenditureTypeName: "示例内容", // 支出类型名称
      //     budgetManagementTypeCode: "示例内容", // 预算管理类型代码
      //     budgetManagementTypeName: "示例内容", // 预算管理类型名称
      //     paymentMethodCode: "示例内容", // 支付方式代码
      //     paymentMethodName: "示例内容", // 支付方式名称
      //     budgetProjectCode: "示例内容", // 预算项目代码
      //     budgetProjectName: "示例内容", // 预算项目名称
      //     projectCategoryCode: "示例内容", // 项目分类代码
      //     projectCategoryName: "示例内容", // 项目分类名称
      //     indicatorDocumentName: "示例内容", // 指标文号名称
      //     settlementMethodCode: "示例内容", // 结算方式代码
      //     settlementMethodName: "示例内容", // 结算方式名称
      //   },
      // ],

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
          this.getAccVoucherData();
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = 1;
          this.pagination.pageSize = size;
          this.getAccVoucherData();
        },
      },
    };
  },
  computed: {
    isInputDisabled() {
      return this.selectedOption === "all"; // 只有选中“全部”时输入框才禁用
    },
    // ...mapState("auditOptions", ["paramsObj"]),
  },
  components: {
    SortModal,
    CommonList,
    ASelect: Select,
    AButton: Button,
    ADatePicker: DatePicker,
    AInput: Input,
  },
  async mounted() {
    this.getAccVoucherYear();
    this.getAccVoucherMonth();
    this.getAccVoucherSystem();
    this.getAccVoucherSort();
  },
  methods: {
    //科目编码
    handleSelectChange(value) {
      this.selectedOption = value;
    },

    //单位名称下拉框
    async getAccVoucherUnitName(value) {
      const json = {
        inputData: value, // 单位编码
      };
      const res = await getAccVoucherUnitName(json);
      if (res.message === "成功") {
        console.log("message成功 单位名称下拉框", res.data);
        this.unitNameOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //年份下拉框
    async getAccVoucherYear() {
      const res = await getAccVoucherYear();
      if (res.message === "成功") {
        console.log("message成功 年份下拉框", res.data);
        this.accountingYearOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //月份下拉框
    async getAccVoucherMonth() {
      const res = await getAccVoucherMonth();
      if (res.message === "成功") {
        console.log("message成功 月份下拉框", res.data);
        this.accountingMonthOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //科目名称下拉框
    async getAccVoucherSubjectName(value) {
      const json = {
        inputData: value, // 单位编码
      };
      const res = await getAccVoucherSubjectName(json);
      if (res.message === "成功") {
        console.log("message成功 科目名称下拉框", res.data);
        this.subjectNameOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //会计体系下拉框
    async getAccVoucherSystem() {
      const res = await getAccVoucherSystem();
      if (res.message === "成功") {
        console.log("message成功 会计体系下拉框", res.data);
        this.accountingSystemOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //电子账簿名称下拉框
    async getAccVoucherLedgerName(value) {
      const json = {
        inputData: value, // 单位编码
      };
      const res = await getAccVoucherLedgerName(json);
      if (res.message === "成功") {
        console.log("message成功 电子账簿名称下拉框", res.data);
        this.electronicLedgerNameOptions = res.data;
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
      this.getAccVoucherData();
      this.onSortCancel();
    },

    async getAccVoucherSort() {
      this.sortOptions = [];
      const res = await getAccVoucherSort();
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

    //记账凭证表格数据
    async getAccVoucherData() {
      const json = {
        year: this.accountingYear, // 会计年度
        month: this.accountingMonth, // 会计月份
        acctSystem: this.accountingSystem, // 会计体系
        unitName: this.unitName, // 单位编码
        acctEbkName: this.electronicLedgerName, // 会计电子账簿编码
        // acctSubjCode: this.subjectCode, // 会计科目编码
        operator: this.selectedOption, //操作符
        rightValue: this.subjectCode, //科目编码的数值
        acctSubjName: this.subjectName, // 科目名称
        acctVoucherSummary: this.accountingAbstract, // 会计凭证摘要
        voucherDate: this.voucherDate, // 凭证日期
        odName: this.sortString,
        pageSize: this.pagination.pageSize, // 页面大小
        pageOffset: this.pagination.pageSize * (this.pagination.current - 1), //偏移量// 页码
      };
      this.tableLoading = true;
      const res = await getAccVoucherData(json);
      this.tableLoading = false;

      if (res.message === "成功") {
        console.log("message成功页面记账凭证表数据", res.data);
        // this.dataSource = formatDecimalValues(res.data.dateList);
        this.dataSource = res.data.dateList;
        this.pagination.total = res.data.total;
      } else {
        this.$message.error(res.message);
      }
    },

    reset() {
      this.unitName = null;
      this.accountingYear = "2023";
      this.accountingMonth = null;
      this.subjectName = null;
      this.subjectCode = null;
      this.accountingSystem = null;
      this.this.accountingAbstract = null;
      this.voucherDate = null;
      this.electronicLedgerName = null;
    },
  },
};
</script>

<style>
.account-voucher {
  width: 100%;
  height: 100%;
  padding-left: 20px;
  background: #fff;
}
</style>
