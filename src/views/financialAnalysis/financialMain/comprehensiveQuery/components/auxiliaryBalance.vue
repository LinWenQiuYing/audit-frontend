<!-- 辅助余额表 -->
<template>
  <div>
    <CommonList
      isTitle
      listClass="auxiliary-balance"
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
            @search="getAuxiliaryBalanceUnitName"
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
            @search="getAuxiliaryBalanceSubjectName"
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
            @search="getAuxiliaryBalanceLedgerName"
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

        <!-- 查询重置排序按钮 -->
        <div class="bottom-search-item actions">
          <a-button
            type="primary"
            class="actions-btn"
            @click="getAuxiliaryBalance()"
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
      sortTitle="辅助余额表排序配置"
      v-if="sortOptions.length"
      :sortShow="sortShow"
      @onSortCancel="onSortCancel"
      @onSortConfirm="onSortConfirm"
      :sortOptions="sortOptions"
      firstSortName=""
    ></SortModal>
    <!-- firstSortName="单位名称+会计年度+会计月份+科目编码" -->
  </div>
</template>
<script>
import CommonList from "@/components/commonList.vue";
import SortModal from "@/components/sortModal.vue";
import {
  getAuxiliaryBalance,
  getAuxiliaryBalanceSort,
  getAuxiliaryBalanceYear,
  getAuxiliaryBalanceMonth,
  getAuxiliaryBalanceDivision,
  getAuxiliaryBalanceUnitName,
  getAuxiliaryBalanceLedgerName,
  getAuxiliaryBalanceSubjectName,
  getAuxiliaryBalanceSystem,
} from "@/shared/newApi/financialAnalysis.js";
import { Button, Input, Select } from "ant-design-vue";
// import { formatDecimalValues } from "../../util";
// const { Group } = Radio;
export default {
  name: "AuxiliaryBegin",
  data() {
    return {
      tableLoading: false,
      //排序按钮
      sortShow: false,
      sortOptions: [],
      sortString: "",

      //行政区划名称
      divisionName: null,
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
      //辅助类型
      auxiliaryType: null,
      //辅助编码
      auxiliaryCode: null,
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
          dataIndex: "accountingMonth",
          key: "accountingMonth",
          width: 150,
          fixed: "left",
        },
        {
          title: "科目编码",
          dataIndex: "subjectCode",
          key: "subjectCode",
          width: 150,
        },
        {
          title: "科目名称",
          dataIndex: "subjectName",
          key: "subjectName",
          width: 150,
        },
        {
          title: "科目全称",
          dataIndex: "fullSubjectName",
          key: "fullSubjectName",
          width: 150,
        },
        {
          title: "年初借方余额",
          dataIndex: "beginningDebitBalanceAtYearStart",
          key: "beginningDebitBalanceAtYearStart",
          width: 160,
        },
        {
          title: "年初贷方余额",
          dataIndex: "creditBalanceAtYearStart",
          key: "creditBalanceAtYearStart",
          width: 150,
        },
        {
          title: "年初余额方向",
          dataIndex: "balanceDirectionAtYearStart",
          key: "balanceDirectionAtYearStart",
          width: 150,
        },
        {
          title: "期初借方余额",
          dataIndex: "debitBalanceAtBeginning",
          key: "debitBalanceAtBeginning",
          width: 160,
        },
        {
          title: "期初贷方余额",
          dataIndex: "creditBalanceAtBeginning",
          key: "creditBalanceAtBeginning",
          width: 160,
        },
        {
          title: "期初余额方向",
          dataIndex: "balanceDirectionAtBeginning",
          key: "balanceDirectionAtBeginning",
          width: 150,
        },
        {
          title: "借方发生额",
          dataIndex: "debitOccurrenceAmount",
          key: "debitOccurrenceAmount",
          width: 150,
        },
        {
          title: "借方累计发生额",
          dataIndex: "cumulativeDebitOccurrenceAmount",
          key: "cumulativeDebitOccurrenceAmount",
          width: 160,
        },
        {
          title: "贷方发生额",
          dataIndex: "creditOccurrenceAmount",
          key: "creditOccurrenceAmount",
          width: 150,
        },
        {
          title: "贷方累计发生额",
          dataIndex: "cumulativeCreditOccurrenceAmount",
          key: "cumulativeCreditOccurrenceAmount",
          width: 160,
        },
        {
          title: "期末借方余额",
          dataIndex: "debitBalanceAtEnd",
          key: "debitBalanceAtEnd",
          width: 150,
        },
        {
          title: "期末贷方余额",
          dataIndex: "creditBalanceAtEnd",
          key: "creditBalanceAtEnd",
          width: 160,
        },
        {
          title: "期末余额方向",
          dataIndex: "balanceDirectionAtEnd",
          key: "balanceDirectionAtEnd",
          width: 160,
        },
        {
          title: "期初外币借方余额",
          dataIndex: "foreignDebitBalanceAtBeginning",
          key: "foreignDebitBalanceAtBeginning",
          width: 160,
        },
        {
          title: "期初外币贷方余额",
          dataIndex: "foreignCreditBalanceAtBeginning",
          key: "foreignCreditBalanceAtBeginning",
          width: 160,
        },
        {
          title: "借方外币发生额",
          dataIndex: "foreignCurrencyDebitOccurrenceAmount",
          key: "foreignCurrencyDebitOccurrenceAmount",
          width: 160,
        },
        {
          title: "贷方外币发生额",
          dataIndex: "foreignCurrencyCreditOccurrenceAmount",
          key: "foreignCurrencyCreditOccurrenceAmount",
          width: 160,
        },
        {
          title: "期末外币借方余额",
          dataIndex: "foreignDebitBalanceAtEnd",
          key: "foreignDebitBalanceAtEnd",
          width: 160,
        },
        {
          title: "期末外币贷方余额",
          dataIndex: "foreignCreditBalanceAtEnd",
          key: "foreignCreditBalanceAtEnd",
          width: 160,
        },
        {
          title: "会计科目级别",
          dataIndex: "accountingSubjectLevel",
          key: "accountingSubjectLevel",
          width: 160,
        },
        {
          title: "是否最底级科目",
          dataIndex: "isBottomLevelSubject",
          key: "isBottomLevelSubject",
          width: 150,
        },
        {
          title: "上级科目编码",
          dataIndex: "parentSubjectCode",
          key: "parentSubjectCode",
          width: 150,
        },
        {
          title: "分录数",
          dataIndex: "entryCount",
          key: "entryCount",
          width: 150,
        },
        {
          title: "辅助类型",
          dataIndex: "auxiliaryType",
          key: "auxiliaryType",
          width: 150,
        },
        {
          title: "辅助编码",
          dataIndex: "auxiliaryCode",
          key: "auxiliaryCode",
          width: 150,
        },
        {
          title: "辅助名称",
          dataIndex: "auxiliaryName",
          key: "auxiliaryName",
          width: 160,
        },
        {
          title: "辅助级别",
          dataIndex: "auxiliaryLevel",
          key: "auxiliaryLevel",
          width: 160,
        },
        {
          title: "上级辅助编码",
          dataIndex: "parentAuxiliaryCode",
          key: "parentAuxiliaryCode",
          width: 150,
        },
        {
          title: "币种名称",
          dataIndex: "currencyName",
          key: "currencyName",
          width: 160,
        },
        {
          title: "币种代码",
          dataIndex: "currencyCode",
          key: "currencyCode",
          width: 150,
        },
        {
          title: "会计体系",
          dataIndex: "accountingSystem",
          key: "accountingSystem",
          width: 150,
        },
        {
          title: "电子账簿编号",
          dataIndex: "accountingElectronicLedgerNumber",
          key: "accountingElectronicLedgerNumber",
          width: 160,
        },
        {
          title: "电子账簿名称",
          dataIndex: "accountingElectronicLedgerName",
          key: "accountingElectronicLedgerName",
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
      dataSource: [],

      // dataSource: [
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingElectronicLedgerNumber: "示例内容", // 电子账簿编号
      //     accountingElectronicLedgerName: "示例内容", // 电子账簿名称
      //     accountingSystem: "示例内容", // 会计体系
      //     accountingMonth: "示例内容", // 会计月份
      //     subjectCode: "示例内容", // 科目编码
      //     subjectName: "示例内容", // 科目名称
      //     fullSubjectName: "示例内容", // 科目全称
      //     beginningDebitBalanceAtYearStart: "示例内容", // 年初借方余额
      //     creditBalanceAtYearStart: "示例内容", // 年初贷方余额
      //     balanceDirectionAtYearStart: "示例内容", // 年初余额方向
      //     debitBalanceAtBeginning: "示例内容", // 期初借方余额
      //     creditBalanceAtBeginning: "示例内容", // 期初贷方余额
      //     balanceDirectionAtBeginning: "示例内容", // 期初余额方向
      //     debitOccurrenceAmount: "示例内容", // 借方发生额
      //     cumulativeDebitOccurrenceAmount: "示例内容", // 借方累计发生额
      //     creditOccurrenceAmount: "示例内容", // 贷方发生额
      //     cumulativeCreditOccurrenceAmount: "示例内容", // 贷方累计发生额
      //     debitBalanceAtEnd: "示例内容", // 期末借方余额
      //     creditBalanceAtEnd: "示例内容", // 期末贷方余额
      //     balanceDirectionAtEnd: "示例内容", // 期末余额方向
      //     foreignDebitBalanceAtBeginning: "示例内容", // 期初外币借方余额
      //     foreignCreditBalanceAtBeginning: "示例内容", // 期初外币贷方余额
      //     foreignCurrencyDebitOccurrenceAmount: "示例内容", // 借方外币发生额
      //     foreignCurrencyCreditOccurrenceAmount: "示例内容", // 贷方外币发生额
      //     foreignDebitBalanceAtEnd: "示例内容", // 期末外币借方余额
      //     foreignCreditBalanceAtEnd: "示例内容", // 期末外币贷方余额
      //     accountingSubjectLevel: "示例内容", // 会计科目级别
      //     isBottomLevelSubject: "示例内容", // 是否最底级科目
      //     currencyName: "示例内容", // 币种名称
      //     parentSubjectCode: "示例内容", // 上级科目编码
      //     entryCount: "示例内容", // 分录数
      //     auxiliaryType: "示例内容", // 辅助类型
      //     auxiliaryCode: "示例内容", // 辅助编码
      //     auxiliaryName: "示例内容", // 辅助名称
      //     auxiliaryLevel: "示例内容", // 辅助级别
      //     parentAuxiliaryCode: "示例内容", // 上级辅助编码
      //     currencyCode: "示例内容", // 币种代码
      //   },
      // ],

      //表格底部
      pagination: {
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
          this.getAuxiliaryBalance();
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = 1;
          this.pagination.pageSize = size;
          this.getAuxiliaryBalance();
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
    ASelect: Select,
    AButton: Button,
    AInput: Input,
  },
  async mounted() {
    this.getAuxiliaryBalanceYear();
    this.getAuxiliaryBalanceMonth();
    this.getAuxiliaryBalanceDivision();
    this.getAuxiliaryBalanceSystem();
    this.getAuxiliaryBalanceSort();
  },
  methods: {
    //单位名称下拉框
    async getAuxiliaryBalanceUnitName(value) {
      const json = {
        inputData: value, // 单位编码
      };
      const res = await getAuxiliaryBalanceUnitName(json);
      if (res.message === "成功") {
        console.log("message成功 单位名称下拉框", res.data);
        this.unitNameOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //年份下拉框
    async getAuxiliaryBalanceYear() {
      const res = await getAuxiliaryBalanceYear();
      if (res.message === "成功") {
        console.log("message成功 年份下拉框", res.data);
        this.accountingYearOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //月份下拉框
    async getAuxiliaryBalanceMonth() {
      const res = await getAuxiliaryBalanceMonth();
      if (res.message === "成功") {
        console.log("message成功 月份下拉框", res.data);
        this.accountingMonthOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //科目名称下拉框
    async getAuxiliaryBalanceSubjectName(value) {
      const json = {
        inputData: value, // 单位编码
      };
      const res = await getAuxiliaryBalanceSubjectName(json);

      if (res.message === "成功") {
        console.log("message成功 科目名称下拉框", res.data);
        this.subjectNameOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //行政区划名称下拉框
    async getAuxiliaryBalanceDivision() {
      const res = await getAuxiliaryBalanceDivision();
      if (res.message === "成功") {
        console.log("message成功 行政区划名称下拉框", res.data);
        this.divisionNameOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //会计体系下拉框
    async getAuxiliaryBalanceSystem() {
      const res = await getAuxiliaryBalanceSystem();
      console.log("页面内 会计体系下拉框res", res);
      if (res.message === "成功") {
        console.log("message成功 会计体系下拉框", res.data);
        this.accountingSystemOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //电子账簿名称下拉框
    async getAuxiliaryBalanceLedgerName(value) {
      const json = {
        inputData: value, // 单位编码
      };
      const res = await getAuxiliaryBalanceLedgerName(json);

      if (res.message === "成功") {
        console.log("message成功 电子账簿名称下拉框", res.data);
        this.electronicLedgerNameOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    async getAuxiliaryBalanceSort() {
      this.sortOptions = [];
      const res = await getAuxiliaryBalanceSort();
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

    //辅助余额表数据
    async getAuxiliaryBalance() {
      const json = {
        admDivName: this.divisionName, // 行政区划编码
        year: this.accountingYear, // 会计年度
        month: this.accountingMonth, // 会计月份
        acctSystem: this.accountingSystem, // 会计体系
        unitName: this.unitName, // 单位编码
        acctEbkName: this.electronicLedgerName, // 电子账簿编码
        acctSubjName: this.subjectName, // 科目编码
        acctSubjCode: this.subjectCode, // 科目编码
        auxType: this.auxiliaryType, // 辅助类型
        auxCode: this.auxiliaryCode, // 辅助编码
        auxName: this.auxiliaryName, // 辅助名称
        odName: this.sortString,
        pageSize: this.pagination.pageSize, // 页面大小
        pageOffset: this.pagination.pageSize * (this.pagination.current - 1), //偏移量// 页码
      };
      this.tableLoading = true;
      const res = await getAuxiliaryBalance(json);
      this.tableLoading = false;
      console.log("页面内辅助余额表数据res", res);
      if (res.message === "成功") {
        console.log("message成功页面辅助余额表数据", res.data);
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
      this.auxiliaryType = null;
      this.auxiliaryCode = null;
      this.auxiliaryName = null;
      this.electronicLedgerName = null;
      this.divisionName = null;
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
      this.getAuxiliaryBalance();
      this.onSortCancel();
    },
  },
};
</script>

<style>
.auxiliary-balance {
  width: 100%;
  height: 100%;
  padding-left: 20px;
  background: #fff;
}
</style>
