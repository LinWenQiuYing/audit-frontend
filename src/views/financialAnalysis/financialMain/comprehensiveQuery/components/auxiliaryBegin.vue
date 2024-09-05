<!-- 辅助年初数表 -->
<template>
  <div>
    <CommonList
      isTitle
      listClass="auxiliary-begin"
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
            @search="getBegYrAuxUnitName"
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
            @search="getBegYrAuxLedgerName"
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
        <div class="bottom-search-item"></div>
        <div class="bottom-search-item"></div>
        <div class="bottom-search-item"></div>
        <div class="bottom-search-item actions">
          <a-button
            type="primary"
            class="actions-btn"
            @click="getBegYrAuxData()"
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
      sortTitle="辅助年初数表排序配置"
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
  getBegYrAuxData,
  getBegYrAuxYear,
  getBegYrAuxMonth,
  getBegYrAuxDivision,
  getBegYrAuxUnitName,
  getBegYrAuxLedgerName,
  getBegYrAuxSort,
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
          title: "本币期初余额",
          dataIndex: "initialLocalCurrencyBalance",
          key: "initialLocalCurrencyBalance",
          width: 150,
        },
        {
          title: "本币期初借方余额",
          dataIndex: "initialLocalCurrencyDebitBalance",
          key: "initialLocalCurrencyDebitBalance",
          width: 180,
        },
        {
          title: "本币期初贷方余额",
          dataIndex: "initialLocalCurrencyCreditBalance",
          key: "initialLocalCurrencyCreditBalance",
          width: 180,
        },
        {
          title: "期初数量",
          dataIndex: "initialQuantity",
          key: "initialQuantity",
          width: 150,
        },
        {
          title: "外币期初余额",
          dataIndex: "initialForeignCurrencyBalance",
          key: "initialForeignCurrencyBalance",
          width: 150,
        },
        {
          title: "科目级次",
          dataIndex: "subjectLevel",
          key: "subjectLevel",
          width: 150,
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
          title: "余额方向",
          dataIndex: "balanceDirection",
          key: "balanceDirection",
          width: 160,
        },
        {
          title: "币种名称",
          dataIndex: "currencyName",
          key: "currencyName",
          width: 160,
        },
        {
          title: "会计体系",
          dataIndex: "accountingSystem",
          key: "accountingSystem",
          width: 150,
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
      //     accountingSystem: "示例内容", // 会计体系
      //     accountingMonth: "示例内容", // 会计月份
      //     subjectCode: "示例内容", // 科目编码
      //     subjectName: "示例内容", // 科目名称
      //     subjectLevel: "示例内容", // 科目级次
      //     isBottomLevelSubject: "示例内容", // 是否最底级科目
      //     parentSubjectCode: "示例内容", // 上级科目编码
      //     auxiliaryType: "示例内容", // 辅助类型
      //     auxiliaryCode: "示例内容", // 辅助编码
      //     auxiliaryName: "示例内容", // 辅助名称
      //     currencyName: "示例内容", // 币种名称
      //     balanceDirection: "示例内容", // 余额方向
      //     initialLocalCurrencyBalance: "示例内容", // 本币期初余额
      //     initialLocalCurrencyDebitBalance: "示例内容", // 本币期初借方余额
      //     initialLocalCurrencyCreditBalance: "示例内容", // 本币期初贷方余额
      //     initialQuantity: "示例内容", // 期初数量
      //     initialForeignCurrencyBalance: "示例内容", // 外币期初余额
      //     bdpAudit: "示例内容", // BDP_AUDIT
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
          this.getBegYrAuxData();
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = 1;
          this.pagination.pageSize = size;
          this.getBegYrAuxData();
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
    this.getBegYrAuxYear();
    this.getBegYrAuxMonth();
    this.getBegYrAuxDivision();
    this.getBegYrAuxSort();
  },
  methods: {
    //单位名称下拉框
    async getBegYrAuxUnitName(value) {
      const json = {
        inputData: value, // 单位编码
      };
      const res = await getBegYrAuxUnitName(json);
      if (res.message === "成功") {
        console.log("message成功 单位名称下拉框", res.data);
        this.unitNameOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //年份下拉框
    async getBegYrAuxYear() {
      const res = await getBegYrAuxYear();
      if (res.message === "成功") {
        console.log("message成功 年份下拉框", res.data);
        this.accountingYearOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //月份下拉框
    async getBegYrAuxMonth() {
      const res = await getBegYrAuxMonth();
      if (res.message === "成功") {
        console.log("message成功 年份下拉框", res.data);
        this.accountingMonthOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //电子账簿名称下拉框
    async getBegYrAuxLedgerName(value) {
      const json = {
        inputData: value, // 单位编码
      };
      const res = await getBegYrAuxLedgerName(json);
      if (res.message === "成功") {
        console.log("message成功 电子账簿名称下拉框", res.data);
        this.electronicLedgerNameOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //行政区划名称下拉框
    async getBegYrAuxDivision() {
      const res = await getBegYrAuxDivision();
      if (res.message === "成功") {
        console.log("message成功 行政区划名称下拉框", res.data);
        this.divisionNameOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //会计期间定义表排序数据
    async getBegYrAuxSort() {
      this.sortOptions = [];
      const res = await getBegYrAuxSort();

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

    //辅助年初数表数据
    async getBegYrAuxData() {
      const json = {
        admDivName: this.divisionName, // 行政区划编码
        year: this.accountingYear, // 会计年度
        month: this.accountingMonth, // 会计年度
        unitName: this.unitName, // 单位编码
        acctEbkName: this.electronicLedgerName, // 会计电子账簿编码
        auxType: this.auxiliaryType, // 辅助类型
        auxCode: this.auxiliaryCode, // 辅助编码
        auxName: this.auxiliaryName, // 辅助名称
        odName: this.sortString, // 辅助名称
        pageSize: this.pagination.pageSize, // 页面大小
        pageOffset: this.pagination.pageSize * (this.pagination.current - 1), //偏移量// 页码
      };
      this.tableLoading = true;
      const res = await getBegYrAuxData(json);
      this.tableLoading = false;

      if (res.message === "成功") {
        console.log("message成功页面辅助年初数表数据", res.data);
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
      this.getBegYrAuxData();
      this.onSortCancel();
    },
  },
};
</script>

<style>
.auxiliary-begin {
  width: 100%;
  height: 100%;
  padding-left: 20px;
  background: #fff;
}
</style>
