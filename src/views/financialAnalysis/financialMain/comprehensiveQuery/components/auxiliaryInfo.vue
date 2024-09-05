<!-- 辅助信息表 -->
<template>
  <div>
    <CommonList
      isTitle
      listClass="auxiliary-info"
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
            @search="getAuxInfoUnitName"
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
        <!-- 辅助类型 -->
        <div class="bottom-search-item">
          <div class="item-label">辅助类型：</div>
          <a-input
            placeholder="请输入辅助类型"
            v-model.trim="auxiliaryType"
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
        <!-- 辅助全称 -->
        <div class="bottom-search-item">
          <div class="item-label">辅助全称：</div>
          <a-input
            placeholder="请输入辅助名称"
            v-model.trim="auxiliaryFullName"
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
            @search="getAuxInfoLedgerName"
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
          <a-button type="primary" class="actions-btn" @click="getAuxInfoData()"
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
      sortTitle="辅助信息表排序配置"
      v-if="sortOptions.length"
      :sortShow="sortShow"
      @onSortCancel="onSortCancel"
      @onSortConfirm="onSortConfirm"
      :sortOptions="sortOptions"
      firstSortName=""
    ></SortModal>
    <!-- firstSortName="单位名称+会计年度+会计月份+辅助类型+辅助编码" -->
  </div>
</template>
<script>
import CommonList from "@/components/commonList.vue";
import SortModal from "@/components/sortModal.vue";
import {
  getAuxInfoData,
  getAuxInfoYear,
  getAuxInfoDivision,
  getAuxInfoUnitName,
  getAuxInfoLedgerName,
  getAuxInfoSort,
} from "@/shared/newApi/financialAnalysis.js";
import { Button, Input, Select } from "ant-design-vue";
// import { formatDecimalValues } from "../../util";
// const { RangePicker } = DatePicker;
// const { Group } = Radio;
export default {
  name: "AuxiliaryInfo",
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
      //辅助全称
      auxiliaryFullName: null,

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
          title: "辅助名称",
          dataIndex: "assistanceName",
          key: "assistanceName",
          width: 160,
        },
        {
          title: "辅助全称",
          dataIndex: "fullAssistanceName",
          key: "fullAssistanceName",
          width: 160,
        },
        {
          title: "辅助级次",
          dataIndex: "assistanceLevel",
          key: "assistanceLevel",
          width: 160,
        },
        {
          title: "上级辅助编码",
          dataIndex: "parentAssistanceCode",
          key: "parentAssistanceCode",
          width: 160,
        },
        {
          title: "辅助说明",
          dataIndex: "assistanceDescription",
          key: "assistanceDescription",
          width: 160,
        },
        {
          title: "是否为预算辅助",
          dataIndex: "isBudgetAssistance",
          key: "isBudgetAssistance",
          width: 160,
        },
        {
          title: "会计电子账簿编号",
          dataIndex: "electronicLedgerNumber",
          key: "electronicLedgerNumber",
          width: 160,
        },
        {
          title: "会计电子账簿名称",
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
        {
          title: "BDP_AUDIT",
          dataIndex: "bdpAudit",
          key: "bdpAudit",
          width: 160,
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
      //     assistanceType: "示例内容", // 辅助类型
      //     assistanceCode: "示例内容", // 辅助编码
      //     assistanceName: "示例内容", // 辅助名称
      //     fullAssistanceName: "示例内容", // 辅助全称
      //     assistanceLevel: "示例内容", // 辅助级次
      //     parentAssistanceCode: "示例内容", // 上级辅助编码
      //     assistanceDescription: "示例内容", // 辅助说明
      //     isBudgetAssistance: "示例内容", // 是否为预算辅助
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
          this.getAuxInfoData();
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = 1;
          this.pagination.pageSize = size;
          this.getAuxInfoData();
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
    this.getAuxInfoYear();
    this.getAuxInfoDivision();
    this.getAuxInfoSort();
  },
  methods: {
    //单位名称下拉框
    async getAuxInfoUnitName(value) {
      const json = {
        inputData: value, // 单位编码
      };
      const res = await getAuxInfoUnitName(json);

      if (res.message === "成功") {
        console.log("message成功 单位名称下拉框", res.data);
        this.unitNameOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //年份下拉框
    async getAuxInfoYear() {
      const res = await getAuxInfoYear();
      if (res.message === "成功") {
        console.log("message成功 年份下拉框", res.data);
        this.accountingYearOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //行政区划名称下拉框
    async getAuxInfoDivision() {
      const res = await getAuxInfoDivision();
      if (res.message === "成功") {
        console.log("message成功 行政区划名称下拉框", res.data);
        this.divisionNameOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //电子账簿名称下拉框
    async getAuxInfoLedgerName(value) {
      const json = {
        inputData: value, // 单位编码
      };
      const res = await getAuxInfoLedgerName(json);

      if (res.message === "成功") {
        console.log("message成功 电子账簿名称下拉框", res.data);
        this.electronicLedgerNameOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //辅助信息数表数据
    async getAuxInfoData() {
      const json = {
        admDivName: this.divisionName, // 行政区划编码
        year: this.accountingYear, // 会计年度
        unitName: this.unitName, // 单位编码
        acctEbkName: this.electronicLedgerName, // 会计电子账簿编码
        auxType: this.auxiliaryType, // 辅助类型
        auxCode: this.auxiliaryCode, // 辅助编码
        auxName: this.auxiliaryName, // 辅助名称
        odName: this.sortString,
        fullAuxName: this.auxiliaryFullName, // 辅助全称
        pageSize: this.pagination.pageSize, // 页面大小
        pageOffset: this.pagination.pageSize * (this.pagination.current - 1), //偏移量// 页码
      };
      this.tableLoading = true;
      const res = await getAuxInfoData(json);
      this.tableLoading = false;
      console.log("页面内辅助信息数表数据res", res);
      if (res.message === "成功") {
        console.log("message成功页面辅助信息数表数据", res.data);
        // this.dataSource = formatDecimalValues(res.data.dateList);
        this.dataSource = res.data.dateList;
        this.pagination.total = res.data.total;
      } else {
        this.$message.error(res.message);
      }
    },

    async getAuxInfoSort() {
      this.sortOptions = [];
      const res = await getAuxInfoSort();

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

    //排序按钮
    sortBtn() {
      this.sortShow = true;
    },
    onSortCancel() {
      this.sortShow = false;
    },
    onSortConfirm(sortString) {
      // this.initTable();
      this.sortString = sortString;
      this.getAuxInfoData();
      this.onSortCancel();
    },

    reset() {
      this.unitName = null;
      this.accountingYear = "2023";
      this.auxiliaryType = null;
      this.auxiliaryName = null;
      this.auxiliaryFullName = null;
      this.auxiliaryCode = null;
      this.electronicLedgerName = null;
      this.divisionName = null;
    },
  },
};
</script>

<style>
.auxiliary-info {
  width: 100%;
  height: 100%;
  padding-left: 20px;
  background: #fff;
}
</style>
