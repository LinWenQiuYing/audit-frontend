<!-- 会计科目表 -->
<template>
  <div>
    <CommonList
      isTitle
      listClass="chart-accounts"
      :columns="columns"
      :loading="tableLoading"
      :dataSource="dataSource"
      :pagination="pagination"
      bordered
      :scroll="{ x: 'max-content', y: 'calc(100vh - 463px)' }"
    >
      <!-- 顶上的选择框 -->
      <template slot="searchOptions">
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
            @search="getChartAccountUnitName"
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
            @search="getChartAccountLedgerName"
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
          <!-- <a-input
            placeholder="请输入科目编码"
            v-model.trim="subjectCode"
            class="item-value"
          /> -->
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
            @search="getChartAccountSubjectName"
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
        <!-- 查询重置排序按钮 -->
        <div class="bottom-search-item actions">
          <a-button type="primary" class="actions-btn" @click="getAccSubData()"
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
      sortTitle="会计科目表排序配置"
      :sortShow="sortShow"
      @onSortCancel="onSortCancel"
      @onSortConfirm="onSortConfirm"
      :sortOptions="sortOptions"
      firstSortName=""
    ></SortModal>
    <!-- firstSortName="单位名称+会计年度+科目编码" -->
  </div>
</template>
<script>
import CommonList from "@/components/commonList.vue";
import SortModal from "@/components/sortModal.vue";
import {
  getAccSubData,
  getChartAccountYear,
  getChartAccountDivision,
  getAccSubSort,
  getChartAccountSystem,
  getChartAccountSubjectName,
  getChartAccountUnitName,
  getChartAccountLedgerName,
} from "@/shared/newApi/financialAnalysis.js";
import { Button, Input, Select } from "ant-design-vue";
// import { formatDecimalValues } from "../../util";
// const { RangePicker } = DatePicker;
// const { Group } = Radio;
export default {
  name: "ChartAccounts",
  data() {
    return {
      tableLoading: false,
      //排序按钮
      sortShow: false,
      sortOptions: [],

      //行政区划名称
      divisionName: null,
      divisionNameOptions: [],

      //会计年度
      accountingYear: "2023",
      accountingYearOptions: [],
      //单位名称
      unitName: null,
      unitNameOptions: [],
      //电子帐簿名称
      electronicLedgerName: null,
      electronicLedgerNameOptions: [],
      //会计体系
      accountingSystem: null,
      accountingSystemOptions: [],
      //科目编码
      subjectCode: null,
      selectedOption: "all", // 默认选项
      //科目名称
      subjectName: null,
      subjectNameOptions: [],

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
          title: "会计科目级次",
          dataIndex: "accountingSubjectLevel",
          key: "accountingSubjectLevel",
          width: 160,
        },
        {
          title: "余额方向",
          dataIndex: "balanceDirection",
          key: "balanceDirection",
          width: 160,
        },
        {
          title: "上级科目编码",
          dataIndex: "parentSubjectCode",
          key: "parentSubjectCode",
          width: 160,
        },
        {
          title: "是否最底级科目",
          dataIndex: "isLowestLevelSubject",
          key: "isLowestLevelSubject",
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
          title: "辅助核算标志",
          dataIndex: "auxiliaryAccountingFlag",
          key: "auxiliaryAccountingFlag",
          width: 160,
        },
        {
          title: "辅助核算项",
          dataIndex: "auxiliaryAccountingItem",
          key: "auxiliaryAccountingItem",
          width: 160,
        },
        {
          title: "科目类别编号",
          dataIndex: "subjectCategoryNumber",
          key: "subjectCategoryNumber",
          width: 160,
        },
        {
          title: "科目类别名称",
          dataIndex: "subjectCategoryName",
          key: "subjectCategoryName",
          width: 160,
        },
        {
          title: "计量单位代码",
          dataIndex: "measurementUnitCode",
          key: "measurementUnitCode",
          width: 160,
        },
        {
          title: "是否现金或现金等价物",
          dataIndex: "isCashOrCashEquivalent",
          key: "isCashOrCashEquivalent",
          width: 200,
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
      //     electronicLedgerNumber: "示例内容", // 电子账簿编号
      //     electronicLedgerName: "示例内容", // 电子账簿名称
      //     accountingSystem: "示例内容", // 会计体系
      //     subjectCode: "示例内容", // 科目编码
      //     subjectName: "示例内容", // 科目名称
      //     fullSubjectName: "示例内容", // 科目全称
      //     accountingSubjectLevel: "示例内容", // 会计科目级次
      //     auxiliaryAccountingFlag: "示例内容", // 辅助核算标志
      //     auxiliaryAccountingItem: "示例内容", // 辅助核算项
      //     subjectCategoryNumber: "示例内容", // 科目类别编号
      //     subjectCategoryName: "示例内容", // 科目类别名称
      //     measurementUnitCode: "示例内容", // 计量单位代码
      //     balanceDirection: "示例内容", // 余额方向
      //     parentSubjectCode: "示例内容", // 上级科目编码
      //     isLowestLevelSubject: "示例内容", // 是否最底级科目
      //     isCashOrCashEquivalent: "示例内容", // 是否现金或现金等价物
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
          this.getAccSubData();
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = 1;
          this.pagination.pageSize = size;
          this.getAccSubData();
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
    this.getChartAccountYear();
    this.getChartAccountDivision();
    this.getChartAccountSystem();
    this.getAccSubSort();
    // this.getAccSubData();
  },
  methods: {
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
      this.getAccSubData();
      this.onSortCancel();
    },

    //会计科目表排序数据
    async getAccSubSort() {
      this.sortOptions = [];
      const res = await getAccSubSort();
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
    async getChartAccountYear() {
      const res = await getChartAccountYear();
      if (res.message === "成功") {
        console.log("message成功 年份下拉框", res.data);
        this.accountingYearOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //行政区划名称下拉框
    async getChartAccountDivision() {
      const res = await getChartAccountDivision();
      if (res.message === "成功") {
        console.log("message成功 行政区划名称下拉框", res.data);
        this.divisionNameOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //单位名称下拉框
    async getChartAccountUnitName(value) {
      const json = {
        inputData: value, // 单位编码
      };
      const res = await getChartAccountUnitName(json);

      if (res.message === "成功") {
        console.log("message成功 单位名称下拉框", res.data);
        this.unitNameOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //电子账簿名称下拉框
    async getChartAccountLedgerName(value) {
      const json = {
        inputData: value, // 单位编码
      };
      const res = await getChartAccountLedgerName(json);

      if (res.message === "成功") {
        console.log("message成功 电子账簿名称下拉框", res.data);
        this.electronicLedgerNameOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //会计体系下拉框
    async getChartAccountSystem() {
      const res = await getChartAccountSystem();
      if (res.message === "成功") {
        console.log("message成功 会计体系下拉框", res.data);
        this.accountingSystemOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //科目名称下拉框
    async getChartAccountSubjectName(value) {
      const json = {
        unitCode: value, // 单位编码
      };
      const res = await getChartAccountSubjectName(json);

      if (res.message === "成功") {
        console.log("message成功 科目名称下拉框", res.data);
        this.subjectNameOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //会计科目表数据
    async getAccSubData() {
      const json = {
        admDivName: this.divisionName, // 行政区划编码
        year: this.accountingYear, // 会计年度
        unitName: this.unitName, // 单位编码
        acctEbkName: this.electronicLedgerName, // 会计电子账簿编码
        acctSystem: this.accountingSystem, // 会计体系
        acctSubjCode: null, // 会计科目代码
        acctSubjName: this.subjectName, // 会计科目名称
        odName: this.sortString, // 排序字符串
        pageSize: this.pagination.pageSize, // 页面大小
        pageOffset: this.pagination.pageSize * (this.pagination.current - 1), //偏移量// 页码
      };
      this.tableLoading = true;
      const res = await getAccSubData(json);
      this.tableLoading = false;
      console.log("页面内会计科目表数据res", res);
      if (res.message === "成功") {
        console.log("message成功页面会计科目表数据", res.data);
        // this.dataSource = formatDecimalValues(res.data.dateList);
        this.dataSource = res.data.dateList;
        this.pagination.total = res.data.total;
      } else {
        this.$message.error(res.message);
      }
    },

    reset() {
      this.divisionName = null;
      this.accountingYear = "2023";
      this.unitName = null;
      this.electronicLedgerName = null;
      this.accountingSystem = null;
      this.selectedOption = "all";
      this.selectedOption = null;
      this.subjectName = null;
    },
  },
};
</script>

<style>
.chart-accounts {
  width: 100%;
  height: 100%;
  padding-left: 20px;
  background: #fff;
}
</style>
