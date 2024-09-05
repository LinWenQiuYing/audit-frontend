<!-- 预算单位表 -->
<template>
  <div>
    <CommonList
      isTitle
      listClass="budget-unit"
      :columns="columns"
      :loading="tableLoading"
      :dataSource="dataSource"
      :pagination="pagination"
      bordered
      :scroll="{ x: 'max-content', y: 'calc(100vh - 400px)' }"
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
            @search="getBudgetUnitUnitName"
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
            @click="getBudgetUnitData()"
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
      sortTitle="预算单位表排序配置"
      v-if="sortOptions.length"
      :sortShow="sortShow"
      @onSortCancel="onSortCancel"
      @onSortConfirm="onSortConfirm"
      :sortOptions="sortOptions"
      firstSortName=""
    ></SortModal>
    <!-- firstSortName="单位名称+会计年度" -->
  </div>
</template>
<script>
import CommonList from "@/components/commonList.vue";
import SortModal from "@/components/sortModal.vue";
import {
  getBudgetUnitData,
  getBudgetUnitSort,
  getBudgetUnitYear,
  getBudgetUnitDivision,
  getBudgetUnitUnitName,
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
      divisionNameOptions: [],
      //会计年度
      accountingYear: "2023",
      accountingYearOptions: [],

      //单位名称
      unitName: null,
      unitNameOptions: [],

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
          dataIndex: "budgetUnitName",
          key: "budgetUnitName",
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
          title: "组织机构代码",
          dataIndex: "organizationStructureCode",
          key: "organizationStructureCode",
          width: 160,
        },
        {
          title: "上级代码",
          dataIndex: "superiorUnitCode",
          key: "superiorUnitCode",
          width: 160,
        },
        {
          title: "代码级次",
          dataIndex: "codeLevel",
          key: "codeLevel",
          width: 150,
        },
        {
          title: "单位分类",
          dataIndex: "unitClassification",
          key: "unitClassification",
          width: 150,
        },
        {
          title: "是否末级",
          dataIndex: "isLastLevel",
          key: "isLastLevel",
          width: 160,
        },
        {
          title: "行政级别",
          dataIndex: "administrativeLevel",
          key: "administrativeLevel",
          width: 160,
        },
        {
          title: "单位性质",
          dataIndex: "unitAdministration",
          key: "unitAdministration",
          width: 160,
        },
        {
          title: "预算管理方式",
          dataIndex: "budgetManagementMethod",
          key: "budgetManagementMethod",
          width: 160,
        },
        {
          title: "单位类别",
          dataIndex: "unitType",
          key: "unitType",
          width: 160,
        },
        {
          title: "主管科室代码",
          dataIndex: "competentDepartmentCode",
          key: "competentDepartmentCode",
          width: 160,
        },
        {
          title: "单位代码",
          dataIndex: "budgetUnitCode",
          key: "budgetUnitCode",
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

      //表格数据来
      dataSource: [
        // {
        //   administrativeDivisionCode: "示例内容", // 行政区划代码
        //   administrativeDivisionName: "示例内容", // 行政区划名称
        //   fiscalYear: "示例内容", // 会计年度
        //   budgetUnitCode: "示例内容", // 预算单位代码
        //   budgetUnitName: "示例内容", // 预算单位名称
        //   organizationStructureCode: "示例内容", // 组织机构代码
        //   superiorUnitCode: "示例内容", // 上级代码
        //   codeLevel: "示例内容", // 代码级次
        //   unitClassification: "示例内容", // 单位分类
        //   isLastLevel: "示例内容", // 是否末级
        //   administrativeLevel: "示例内容", // 行政级别
        //   unitAdministration: "示例内容", // 单位行政
        //   budgetManagementMethod: "示例内容", // 预算管理方式
        //   unitType: "示例内容", // 单位类别
        //   competentDepartmentCode: "示例内容", // 主管科室代码
        //   bdpAudit: "示例内容", // BDP_AUDIT
        // },
      ],

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
          this.getBudgetUnitData();
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = 1;
          this.pagination.pageSize = size;
          this.getBudgetUnitData();
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
  },
  async mounted() {
    this.getBudgetUnitYear();
    this.getBudgetUnitDivision();
    this.getBudgetUnitUnitName();
    this.getBudgetUnitSort();
  },
  methods: {
    //单位名称下拉框
    async getBudgetUnitUnitName(value) {
      const json = {
        inputData: value, // 单位编码
      };
      const res = await getBudgetUnitUnitName(json);
      if (res.message === "成功") {
        console.log("message成功 单位名称下拉框", res.data);
        this.unitNameOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //年份下拉框
    async getBudgetUnitYear() {
      const res = await getBudgetUnitYear();
      if (res.message === "成功") {
        console.log("message成功 年份下拉框", res.data);
        this.accountingYearOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //行政区划名称下拉框
    async getBudgetUnitDivision() {
      const res = await getBudgetUnitDivision();
      if (res.message === "成功") {
        console.log("message成功 行政区划名称下拉框", res.data);
        this.divisionNameOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    async getBudgetUnitSort() {
      this.sortOptions = [];
      const res = await getBudgetUnitSort();
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

    //预算单位表数据
    async getBudgetUnitData() {
      const json = {
        admDivName: this.divisionName, //行政区划代码
        budgetUnitName: this.unitName, // 预算单位代码
        year: this.accountingYear, //会计年度
        odName: this.sortString, //排序字段
        pageSize: this.pagination.pageSize, // 页面大小
        pageOffset: this.pagination.pageSize * (this.pagination.current - 1), //偏移量// 页码
      };
      this.tableLoading = true;
      const res = await getBudgetUnitData(json);
      this.tableLoading = false;
      if (res.message === "成功") {
        console.log("message成功页面预算单位表数据", res.data);
        // this.dataSource = formatDecimalValues(res.data.dateList);
        this.dataSource = res.data.dateList;
        this.pagination.total = res.data.total;
      } else {
        this.$message.error(res.message);
      }
    },

    //重置
    reset() {
      this.unitName = null;
      this.accountingYear = "2023";
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
      this.getBudgetUnitData();
      this.onSortCancel();
    },
  },
};
</script>

<style>
.budget-unit {
  width: 100%;
  height: 100%;
  padding-left: 20px;
  background: #fff;
}
</style>
