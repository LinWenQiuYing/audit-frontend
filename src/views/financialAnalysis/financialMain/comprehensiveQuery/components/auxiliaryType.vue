<!-- 辅助类型表 -->
<template>
  <div>
    <CommonList
      isTitle
      listClass="auxiliary-type"
      :columns="columns"
      :loading="tableLoading"
      :dataSource="dataSource"
      :pagination="pagination"
      bordered
      :scroll="{ x: 'max-content', y: 'calc(100vh - 463px)' }"
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
            @search="getAuxTypeUnitName"
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
            @search="getAccPeriodUnitName"
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
        <!-- 辅助类型编码 -->
        <div class="bottom-search-item">
          <div class="item-label">辅助类型编码：</div>
          <a-input
            placeholder="请输入辅助类型编码"
            v-model.trim="auxiliaryTypeCode"
            class="item-value"
          />
        </div>
        <!-- 辅助类型名称 -->
        <div class="bottom-search-item">
          <div class="item-label">辅助类型名称：</div>
          <a-input
            placeholder="请输入辅助类型名称"
            v-model.trim="auxiliaryTypeName"
            class="item-value"
          />
        </div>
        <!-- 辅助类型结构 -->
        <div class="bottom-search-item">
          <div class="item-label">辅助类型结构：</div>
          <a-input
            placeholder="请输入辅助类型结构"
            v-model.trim="auxiliaryTypeStructure"
            class="item-value"
          />
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
        <!-- 会计月度 -->
        <!-- <div class="bottom-search-item">
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
      </div> -->
        <!-- 查询重置排序按钮 -->
        <div class="bottom-search-item actions">
          <a-button type="primary" class="actions-btn" @click="getAuxTypeData()"
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
      sortTitle="辅助类型表排序配置"
      v-if="sortOptions.length"
      :sortShow="sortShow"
      @onSortCancel="onSortCancel"
      @onSortConfirm="onSortConfirm"
      :sortOptions="sortOptions"
      firstSortName=""
    ></SortModal>
    <!-- firstSortName="单位名称+会计年度+辅助类型编码" -->
  </div>
</template>
<script>
import CommonList from "@/components/commonList.vue";
import SortModal from "@/components/sortModal.vue";
import {
  getAuxTypeData,
  getAuxTypeSort,
  getAuxTypeYear,
  getAuxTypeDivision,
  getAuxTypeUnitName,
  getAuxTypeLedgerName,
} from "@/shared/newApi/financialAnalysis.js";
import { Button, Input, Select } from "ant-design-vue";
// import { formatDecimalValues } from "../../util";
// const { Group } = Radio;
export default {
  name: "AuxiliaryType",
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
      // accountingMonth: "全部",
      // accountingMonthOptions: [
      // ],
      //单位名称
      unitName: null,
      unitNameOptions: [],
      //电子帐簿名称
      electronicLedgerName: null,
      electronicLedgerNameOptions: [],
      //辅助类型编码
      auxiliaryTypeCode: null,
      //辅助类型名称
      auxiliaryTypeName: null,
      //辅助类型结构
      auxiliaryTypeStructure: null,

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
          title: "辅助类型编码",
          dataIndex: "auxiliaryTypeCode",
          key: "auxiliaryTypeCode",
          width: 160,
        },
        {
          title: "辅助类型名称",
          dataIndex: "auxiliaryTypeName",
          key: "auxiliaryTypeName",
          width: 160,
        },
        {
          title: "辅助类型结构",
          dataIndex: "auxiliaryTypeStructure",
          key: "auxiliaryTypeStructure",
          width: 160,
        },
        {
          title: "会计电子账簿编号",
          dataIndex: "accountingNumber",
          key: "accountingNumber",
          width: 160,
        },
        {
          title: "会计电子账簿名称",
          dataIndex: "accountingName",
          key: "accountingName",
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
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     auxiliaryTypeCode: "示例内容", // 辅助类型编码
      //     auxiliaryTypeName: "示例内容", // 辅助类型名称
      //     auxiliaryTypeStructure: "示例内容", // 辅助类型结构
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
          this.getAuxTypeData();
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = 1;
          this.pagination.pageSize = size;
          this.getAuxTypeData();
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
    this.getAuxTypeYear();
    this.getAuxTypeDivision();
    this.getAuxTypeSort();
  },
  methods: {
    //行政区划名称下拉框
    async getAuxTypeDivision() {
      const res = await getAuxTypeDivision();
      if (res.message === "成功") {
        console.log("message成功 行政区划名称下拉框", res.data);
        this.divisionNameOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //单位名称下拉框
    async getAuxTypeUnitName(value) {
      const json = {
        inputData: value, // 单位编码
      };
      const res = await getAuxTypeUnitName(json);
      if (res.message === "成功") {
        console.log("message成功 单位名称下拉框", res.data);
        this.unitNameOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //年份下拉框
    async getAuxTypeYear() {
      const res = await getAuxTypeYear();
      if (res.message === "成功") {
        console.log("message成功 年份下拉框", res.data);
        this.accountingYearOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //电子账簿名称
    async getAuxTypeLedgerName(value) {
      const json = {
        inputData: value, // 单位编码
      };
      const res = await getAuxTypeLedgerName(json);

      if (res.message === "成功") {
        console.log("message成功 电子账簿名称下拉框", res.data);
        this.electronicLedgerNameOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //会计期间定义表排序数据
    async getAuxTypeSort() {
      this.sortOptions = [];
      const res = await getAuxTypeSort();
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

    //辅助类型表数据
    async getAuxTypeData() {
      const json = {
        admDivName: this.divisionName, // 行政区划编码
        year: this.accountingYear, // 会计年度
        unitName: this.unitName, // 单位编码
        acctEbkName: this.electronicLedgerName, // 会计电子账簿编码
        auxCode: this.auxiliaryTypeCode, // 辅助编码
        auxName: this.auxiliaryTypeName, // 辅助名称
        auxTypeStruct: this.auxiliaryTypeStructure, // 辅助类型结构
        odName: this.sortString, // 页面大小
        pageSize: this.pagination.pageSize, // 页面大小
        pageOffset: this.pagination.pageSize * (this.pagination.current - 1), //偏移量// 页码
      };
      this.tableLoading = true;
      const res = await getAuxTypeData(json);
      this.tableLoading = false;

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
      this.unitName = null;
      this.accountingYear = "2023";
      this.electronicLedgerName = null;
      this.auxiliaryTypeCode = null;
      this.auxiliaryTypeName = null;
      this.auxiliaryTypeStructure = null;
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
      this.getAuxTypeData();
      this.onSortCancel();
    },
  },
};
</script>

<style>
.auxiliary-type {
  width: 100%;
  height: 100%;
  padding-left: 20px;
  background: #fff;
}
</style>
