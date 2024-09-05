<!-- 科目年初表 -->
<template>
  <div>
    <CommonList
      isTitle
      listClass="opening-chart"
      :columns="columns"
      :dataSource="dataSource"
      :loading="tableLoading"
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
            @search="getBegYrSubUnitName"
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
            @search="getBegYrSubSubjectName"
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
            @search="getBegYrSubLedgerName"
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
        <div class="bottom-search-item"></div>
        <div class="bottom-search-item"></div>
        <!-- 查询重置排序按钮 -->
        <div class="bottom-search-item actions">
          <a-button
            type="primary"
            class="actions-btn"
            @click="getBegYrSubData()"
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
      v-if="sortOptions.length"
      sortTitle="科目年初表排序配置"
      :sortShow="sortShow"
      @onSortCancel="onSortCancel"
      @onSortConfirm="onSortConfirm"
      :sortOptions="sortOptions"
      firstSortName=""
    ></SortModal>
  </div>
</template>
<script>
import CommonList from "@/components/commonList.vue";
import SortModal from "@/components/sortModal.vue";
import {
  getBegYrSubData,
  getBegYrSubSort,
  getBegYrSubYear,
  getBegYrSubMonth,
  getBegYrSubDivision,
  getBegYrSubUnitName,
  getBegYrSubLedgerName,
  getBegYrSubSystem,
  getBegYrSubSubjectName,
} from "@/shared/newApi/financialAnalysis.js";
import { Button, Input, Select } from "ant-design-vue";
// import { formatDecimalValues } from "../../util";
export default {
  name: "OpeningChart",
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

      //科目编码
      subjectCode: null,
      selectedOption: "all", // 默认选项
      subjectCodeOptions: [],

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
          width: 160,
        },
        {
          title: "本币期初余额",
          dataIndex: "localCurrencyBeginningBalance",
          key: "localCurrencyBeginningBalance",
          width: 150,
        },
        {
          title: "本币期初借方余额",
          dataIndex: "localCurrencyBeginningDebitBalance",
          key: "localCurrencyBeginningDebitBalance",
          width: 160,
        },
        {
          title: "本币期初贷方余额",
          dataIndex: "localCurrencyBeginningCreditBalance",
          key: "localCurrencyBeginningCreditBalance",
          width: 160,
        },
        {
          title: "期初数量",
          dataIndex: "beginningQuantity",
          key: "beginningQuantity",
          width: 150,
        },
        {
          title: "外币期初余额",
          dataIndex: "foreignCurrencyBeginningBalance",
          key: "foreignCurrencyBeginningBalance",
          width: 150,
        },
        {
          title: "余额方向",
          dataIndex: "balanceDirection",
          key: "balanceDirection",
          width: 150,
        },
        {
          title: "币种名称",
          dataIndex: "currencyName",
          key: "currencyName",
          width: 160,
        },
        {
          title: "会计科目级次",
          dataIndex: "accountingSubjectLevel",
          key: "accountingSubjectLevel",
          width: 160,
        },
        {
          title: "是否最底级科目",
          dataIndex: "isLowestLevelSubject",
          key: "isLowestLevelSubject",
          width: 150,
        },
        {
          title: "上级科目编码",
          dataIndex: "parentSubjectCode",
          key: "parentSubjectCode",
          width: 150,
        },
        {
          title: "会计体系",
          dataIndex: "accountingSystem",
          key: "accountingSystem",
          width: 160,
        },
        {
          title: "会计电子账簿编号",
          dataIndex: "accountingElectronicLedgerNumber",
          key: "accountingElectronicLedgerNumber",
          width: 160,
        },
        {
          title: "会计电子账簿名称",
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
        // {
        //   title: "是否现金或现金等价物",
        //   dataIndex: "isCashOrCashEquivalent",
        //   key: "isCashOrCashEquivalent",
        //   width: 190,
        // },
        {
          title: "BDP_AUDIT",
          dataIndex: "bdpAudit",
          key: "bdpAudit",
          width: 150,
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
      //     accountingElectronicLedgerNumber: "示例内容", // 会计电子账簿编号
      //     accountingElectronicLedgerName: "示例内容", // 会计电子账簿名称
      //     fiscalMonth: "示例内容", // 会计月份
      //     accountingSystem: "示例内容", // 会计体系
      //     subjectCode: "示例内容", // 科目编码
      //     subjectName: "示例内容", // 科目名称
      //     fullSubjectName: "示例内容", // 科目全称
      //     accountingSubjectLevel: "示例内容", // 会计科目级次
      //     isLowestLevelSubject: "示例内容", // 是否最底级科目
      //     parentSubjectCode: "示例内容", // 上级科目编码
      //     isCashOrCashEquivalent: "示例内容", // 是否现金或现金等价物
      //     currencyName: "示例内容", // 币种名称
      //     balanceDirection: "示例内容", // 余额方向
      //     localCurrencyBeginningBalance: "示例内容", // 本币期初余额
      //     localCurrencyBeginningDebitBalance: "示例内容", // 本币期初借方余额
      //     localCurrencyBeginningCreditBalance: "示例内容", // 本币期初贷方余额
      //     beginningQuantity: "示例内容", // 期初数量
      //     foreignCurrencyBeginningBalance: "示例内容", // 外币期初余额
      //     bdpAudit: "示例内容", // BDP_AUDIT
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
          this.getBegYrSubData();
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = 1;
          this.pagination.pageSize = size;
          this.getBegYrSubData();
        },
      },
    };
  },
  computed: {
    // ...mapState("auditOptions", ["paramsObj"]),
    isInputDisabled() {
      return this.selectedOption === "all"; // 只有选中“全部”时输入框才禁用
    },
  },
  components: {
    SortModal,
    CommonList,
    ASelect: Select,

    AButton: Button,

    AInput: Input,
  },
  async mounted() {
    this.getBegYrSubYear();
    this.getBegYrSubMonth();
    this.getBegYrSubDivision();
    this.getBegYrSubSort();
    this.getBegYrSubSort();
    this.getBegYrSubSort();
  },
  methods: {
    //会计期间定义表排序数据
    async getBegYrSubSort() {
      this.sortOptions = [];
      const res = await getBegYrSubSort();
      console.log("页面内会计期间定义表排序字段数据res", res);
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

    //年份下拉框
    async getBegYrSubYear() {
      const res = await getBegYrSubYear();
      console.log("页面内 年份下拉框res", res);
      if (res.message === "成功") {
        console.log("message成功 年份下拉框", res.data);
        this.accountingYearOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //月份下拉框
    async getBegYrSubMonth() {
      const res = await getBegYrSubMonth();
      if (res.message === "成功") {
        console.log("message成功 月份下拉框", res.data);
        this.accountingMonthOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //行政区划名称下拉框
    async getBegYrSubDivision() {
      const res = await getBegYrSubDivision();
      if (res.message === "成功") {
        console.log("message成功 行政区划名称下拉框", res.data);
        this.divisionNameOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //单位名称下拉框
    async getBegYrSubUnitName(value) {
      const json = {
        // year: this.choosedFinYear, //会计年份
        unitCode: value, // 单位编码
        // acctEbkNum: this.finBook, //会计电子账簿编码
        // acctSystem: this.finSystem, // 会计体系
        // month: this.choosedFinMonth, //会计月份，可多选
        // acctSubjCode: this.choosedSubject, // 会计科目编码
      };
      const res = await getBegYrSubUnitName(json);
      console.log("页面内 单位名称下拉框res", res);
      if (res.message === "成功") {
        console.log("message成功 单位名称下拉框", res.data);
        this.unitNameOptions = res.data;
        // this.unitName = res.data[0].value;
      } else {
        this.$message.error(res.message);
      }
    },

    //电子账簿名称下拉框
    async getBegYrSubLedgerName(value) {
      const json = {
        // year: this.choosedFinYear, //会计年份
        inputData: value, // 单位编码
        // acctEbkNum: this.finBook, //会计电子账簿编码
        // acctSystem: this.finSystem, // 会计体系
        // month: this.choosedFinMonth, //会计月份，可多选
        // acctSubjCode: this.choosedSubject, // 会计科目编码
      };
      const res = await getBegYrSubLedgerName(json);
      console.log("页面内 电子账簿名称下拉框res", res);
      if (res.message === "成功") {
        console.log("message成功 电子账簿名称下拉框", res.data);
        this.electronicLedgerNameOptions = res.data;
        // this.electronicLedgerName = res.data[0].value;
      } else {
        this.$message.error(res.message);
      }
    },

    //会计体系下拉框
    async getBegYrSubSystem() {
      const res = await getBegYrSubSystem();
      console.log("页面内 会计体系下拉框res", res);
      if (res.message === "成功") {
        console.log("message成功 会计体系下拉框", res.data);
        this.accountingSystemOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //科目名称下拉框
    async getBegYrSubSubjectName() {
      const json = {
        // year: this.choosedFinYear, //会计年份
        inputData: "", // 单位编码
        // acctEbkNum: this.finBook, //会计电子账簿编码
        // acctSystem: this.finSystem, // 会计体系
        // month: this.choosedFinMonth, //会计月份，可多选
        // acctSubjCode: this.choosedSubject, // 会计科目编码
      };
      const res = await getBegYrSubSubjectName(json);
      if (res.message === "成功") {
        console.log("message成功 科目名称下拉框", res.data);
        this.subjectNameOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //科目年初表数据
    async getBegYrSubData() {
      const json = {
        admDivName: this.divisionName, // 行政区划编码
        year: this.accountingYear, // 会计年度
        month: this.accountingMonth, // 会计月份
        acctSystem: this.accountingSystem, // 会计体系
        unitName: this.unitName, // 单位编码
        acctEbkName: this.electronicLedgerName, // 会计电子账簿编码
        acctSubjCode: this.subjectCode, // 会计科目编码
        acctSubjName: this.subjectName, // 会计科目编码
        odName: this.sortString, // 会计科目编码
        pageSize: this.pagination.pageSize, // 页面大小
        pageOffset: this.pagination.pageSize * (this.pagination.current - 1), //偏移量// 页码
      };
      this.tableLoading = true;
      const res = await getBegYrSubData(json);
      this.tableLoading = false;
      console.log("页面内科目年初表数据res", res);
      if (res.message === "成功") {
        console.log("message成功页面科目年初表数据", res.data);
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
      this.selectedOption = "all";
      this.subjectCode = null;
      this.accountingSystem = null;
      this.electronicLedgerName = null;
      this.divisionName = null;
    },

    //科目编码
    handleSelectChange(value) {
      this.selectedOption = value;
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
      this.getBegYrSubData();
      this.onSortCancel();
    },
  },
};
</script>

<style>
.opening-chart {
  width: 100%;
  height: 100%;
  padding-left: 20px;
  background: #fff;
}
</style>
