<!-- 电子账簿信息 -->
<template>
  <div>
    <CommonList
      listClass="electronic-book"
      :loading="tableLoading"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="pagination"
      bordered
      :scroll="{ x: 'max-content', y: 'calc(100vh - 480px)' }"
    >
      <!-- 'calc(100vh - 590px)' -->
      <!-- 顶上的选择框 -->
      <template slot="searchOptions">
        <!-- <div class="bottom-search-item">
          <div class="item-label">单位代码：</div>
          <a-input
            placeholder="请输入单位代码"
            v-model.trim="unitCode"
            class="item-value"
          />
        </div> -->
        <div class="bottom-search-item">
          <div class="item-label">行政区域名称：</div>
          <a-select
            class="item-value"
            placeholder="请选择"
            v-model="sectionName"
          >
            <!-- @change="changeSection" -->
            <a-select-option
              v-for="item in sectionOptions"
              :key="item.label"
              :title="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </div>
        <div class="bottom-search-item">
          <div class="item-label">单位名称：</div>
          <a-select
            class="item-value"
            v-model="unitName"
            @search="getElectronicUnitOptions"
            show-search
            placeholder="请输入"
            option-filter-prop="children"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            allowClear
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
          <!-- <a-input
            placeholder="请输入单位名称"
            v-model.trim="unitName"
            class="item-value"
          /> -->
        </div>
        <div class="bottom-search-item">
          <div class="item-label">会计年度：</div>
          <a-select
            class="item-value"
            placeholder="请选择"
            v-model="fiscalYear"
          >
            <a-select-option
              v-for="item in fiscalYearOptions"
              :key="item.label"
              :title="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </div>
        <div class="bottom-search-item">
          <div class="item-label">电子帐簿名称：</div>
          <a-select
            class="item-value"
            v-model="accountingElectronicLedgerName"
            show-search
            placeholder="请输入"
            option-filter-prop="children"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            allowClear
            @search="getElectronicBooksOptions"
          >
            <!-- @change="changeAccountingElectronicLedgerName" -->
            <a-select-option
              v-for="item in accountingElectronicLedgerNameOptions"
              :key="item.label"
              :title="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
          <!-- <a-input
            placeholder="请输入会计电子帐簿名称"
            v-model.trim="accountingElectronicLedgerName"
            class="item-value"
          /> -->
        </div>
        <!-- <div class="bottom-search-item">
          <div class="item-label">组织机构代码：</div>
          <a-input
            placeholder="请输入组织机构代码"
            v-model.trim="organizationCode"
            class="item-value"
          />
        </div> -->
        <!-- <div class="bottom-search-item">
          <div class="item-label">会计电子帐簿编号：</div>
          <a-input
            placeholder="请输入会计电子帐簿编号"
            v-model.trim="accountingElectronicLedgerNumber"
            class="item-value"
          />
        </div> -->
        <!-- <div class="bottom-search-item">
          <div class="item-label">会计电子帐簿名称：</div>
          <a-input
            placeholder="请输入会计电子帐簿名称"
            v-model.trim="accountingElectronicLedgerName"
            class="item-value"
          />
        </div> -->
        <!-- <div class="bottom-search-item">
          <div class="item-label">行业分类：</div>
          <a-input
            placeholder="请输入行业分类"
            v-model.trim="choosedIndustryClassification"
            class="item-value"
          />
        </div> -->

        <div class="bottom-search-item"></div>
        <div class="bottom-search-item actions">
          <a-button
            type="primary"
            class="actions-btn"
            @click="getElectronicBookData()"
            >查询</a-button
          >
          <a-button type="primary" class="actions-btn" @click="reset()"
            >重置</a-button
          >
          <a-button type="primary" class="actions-btn" @click="sortShow = true">
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
      sortTitle="电子账簿信息排序配置"
      :sortShow="sortShow"
      @onSortCancel="onSortCancel"
      @onSortConfirm="onSortConfirm"
      :sortOptions="sortOptions"
      firstSortName="单位名称+会计年度"
    ></SortModal>
  </div>
</template>
<script>
import CommonList from "@/components/commonList.vue";
import SortModal from "@/components/sortModal.vue";
import {
  getElectronicBooksSort,
  getElectronicBookData,
  getElectronicBooksOptions,
  getElectronicYearOptions,
  getElectronicSectionOptions,
  getElectronicUnitOptions,
} from "@/shared/newApi/financialAnalysis.js";
// import { Button, Input, Popover, Radio, Select } from "ant-design-vue";
import { Button, Select } from "ant-design-vue";
import { mapState } from "vuex";
// const { Group } = Radio;
export default {
  name: "ElectronicBook",
  data() {
    return {
      //项目执行明细排序
      sortShow: false,
      sortString: "",
      //排序选项
      sortOptions: [],

      tableLoading: false,
      //行政区域名称
      sectionName: null,
      sectionOptions: [
        // {
        //   label: "全部",
        //   value: null,
        // },
        // {
        //   label: "行政区域名称1",
        //   value: "行政区域名称1的code",
        // },
        // {
        //   label: "行政区域名称2",
        //   value: "行政区域名称2的code",
        // },
      ],
      //单位名称
      unitName: null,
      unitNameOptions: [
        // {
        //   label: "全部",
        //   value: null,
        // },
        // {
        //   label: "单位名称1",
        //   value: "单位名称1的code",
        // },
        // {
        //   label: "单位名称2",
        //   value: "单位名称2的code",
        // },
      ],
      //会计年度
      fiscalYear: null,
      fiscalYearOptions: [
        // {
        //   label: "全部",
        //   value: null,
        // },
        // {
        //   label: "2024",
        //   value: "2024",
        // },
        // {
        //   label: "2023",
        //   value: "2023",
        // },
        // {
        //   label: "2022",
        //   value: "2022",
        // },
        // {
        //   label: "2021",
        //   value: "2021",
        // },
      ],

      //电子账簿名称
      accountingElectronicLedgerName: null,
      accountingElectronicLedgerNameOptions: [
        // {
        //   label: "全部",
        //   value: "全部",
        // },
        // {
        //   label: "电子账簿名称名称1",
        //   value: "电子账簿名称名称1的code",
        // },
        // {
        //   label: "电子账簿名称名称21313131311313131311313131312",
        //   value: "电子账簿名称名称231313131313的code",
        // },
      ],

      //行业分类
      // industryClassificationOptions: [
      //   {
      //     label: "全部",
      //     value: "全部",
      //   },
      //   {
      //     label: "2024",
      //     value: "2024",
      //   },
      //   {
      //     label: "2023",
      //     value: "2023",
      //   },
      //   {
      //     label: "2022",
      //     value: "2022",
      //   },
      //   {
      //     label: "2021",
      //     value: "2021",
      //   },
      // ],
      // choosedIndustryClassification: null,
      //组织机构代码
      organizationCode: null,

      //单位代码
      // unitCode: null,

      //会计电子帐簿代码
      // accountingElectronicLedgerNumber: null,
      //会计电子帐簿名称
      // accountingElectronicLedgerName: null,

      columns: [
        {
          title: "单位名称",
          dataIndex: "organizationName",
          key: "organizationName",
          width: 180,
          fixed: "left",
        },
        {
          title: "会计年度",
          dataIndex: "fiscalYear",
          width: 160,
          key: "fiscalYear",
          fixed: "left",
        },
        {
          title: "会计电子账簿编号",
          dataIndex: "accountingElectronicLedgerNumber",
          key: "accountingElectronicLedgerNumber",
          width: 180,
        },
        {
          title: "会计电子账簿名称",
          dataIndex: "accountingElectronicLedgerName",
          key: "accountingElectronicLedgerName",
          width: 180,
        },
        {
          title: "本位币",
          dataIndex: "baseCurrency",
          key: "baseCurrency",
          width: 160,
        },
        {
          title: "会计科目结构",
          dataIndex: "accountingSubjectStructure",
          key: "accountingSubjectStructure",
          width: 180,
        },
        {
          title: "是否含有预算账",
          dataIndex: "containsBudgetLedger",
          key: "containsBudgetLedger",
          width: 180,
        },
        {
          title: "单位代码",
          dataIndex: "organizationCode",
          key: "organizationCode",
          width: 180,
        },
        {
          title: "组织机构代码",
          dataIndex: "organizationInstitutionCode",
          key: "organizationInstitutionCode",
          width: 180,
        },
        {
          title: "行政区划代码",
          dataIndex: "administrativeDivisionCode",
          key: "administrativeDivisionCode",
          width: 160,
        },
        {
          title: "行政区划名称",
          dataIndex: "administrativeDivisionName",
          key: "administrativeDivisionName",
          width: 160,
        },
        {
          title: "单位性质",
          dataIndex: "organizationNature",
          key: "organizationNature",
          width: 150,
        },
        {
          title: "行业分类",
          dataIndex: "industryClassification",
          key: "industryClassification",
          width: 160,
        },
        {
          title: "开发单位",
          dataIndex: "developmentUnit",
          key: "developmentUnit",
          width: 160,
        },
        {
          title: "版本号",
          dataIndex: "versionNumber",
          key: "versionNumber",
          width: 180,
        },
        {
          title: "BATCH_UUID",
          dataIndex: "batchuuid",
          key: "batchuuid",
          width: 180,
        },
        {
          title: "BDP_AUDIT",
          dataIndex: "bdpaudit",
          key: "bdpaudit",
          width: 180,
        },
      ],
      dataSource: [
        // {
        //   administrativeDivisionCode: "示例内容", // 行政区划代码
        //   administrativeDivisionName: "示例内容", // 行政区划名称
        //   fiscalYear: "示例内容", // 会计年度
        //   organizationCode: "示例内容", // 单位代码
        //   organizationName: "示例内容", // 单位名称
        //   organizationInstitutionCode: "示例内容", // 组织机构代码
        //   accountingElectronicLedgerNumber: "示例内容", // 会计电子账簿编号
        //   accountingElectronicLedgerName: "示例内容", // 会计电子账簿名称
        //   organizationNature: "示例内容", // 单位性质
        //   industryClassification: "示例内容", // 行业分类
        //   developmentUnit: "示例内容", // 开发单位
        //   versionNumber: "示例内容", // 版本号
        //   baseCurrency: "示例内容", // 本位币
        //   accountingSubjectStructure: "示例内容", // 会计科目结构
        //   containsBudgetLedger: "示例内容", // 是否含有预算账
        //   batchuuid: "示例内容", // BATCH_UUID
        //   bdpaudit: "示例内容", // BDP_AUDIT
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
          this.getElectronicBookData();
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = 1;
          this.pagination.pageSize = size;
          this.getElectronicBookData();
        },
      },
    };
  },
  computed: {
    // ...mapState("auditOptions", ["paramsObj"]),
    ...mapState("blockAnalysis", ["blockChoosedYear"]),
  },
  components: {
    SortModal,
    CommonList,
    ASelect: Select,
    // AInput: Input,
    AButton: Button,
    // APopover: Popover,
    // ARadio: Radio,
    // ARadioGroup: Group,
  },
  async mounted() {
    //排序选项
    await this.getElectronicBooksSort();
    //获取行政区域下拉框
    this.getElectronicYearOptions();
    this.getElectronicSectionOptions();
    //获取单位名称下拉框
    // this.getElectronicUnitOptions();
    // //获取电子账簿名称名称下拉框
    // this.getElectronicBooksOptions();
    //获取表格数据
    // await this.getElectronicBookData();
  },
  methods: {
    //项目执行明细排序
    onSortCancel() {
      this.sortShow = false;
    },
    onSortConfirm(sortString) {
      console.log("页面初始阶段排序字段", sortString);
      this.sortString = sortString;
      this.getElectronicBookData();
      // this.initTable();
      this.onSortCancel();
    },
    //电子账簿信息-排序字段
    async getElectronicBooksSort() {
      this.sortOptions = []; //强制排序组件刷新
      const res = await getElectronicBooksSort();
      console.log("页面内 电子账簿信息-排序字段res", res);
      if (res.message === "成功") {
        console.log("message成功 电子账簿信息-排序字段", res.data);
        this.sortOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    // changeSection() {
    //   this.getElectronicUnitOptions();
    // },
    // changeUnitName() {
    //   //  this.getElectronicSectionOptions();
    //   this.getElectronicBooksOptions();
    // },
    //changeAccountingElectronicLedgerName() {
    //  this.getElectronicSectionOptions();
    //  this.getElectronicUnitOptions();
    //},

    //获取行政区域下拉框
    async getElectronicSectionOptions() {
      const json = {
        admDivName: "", //行政区划
        // unitCode: this.unitName, //单位
        // year: this.fiscalYear, //会计年度
        // acctEbkNum: this.accountingElectronicLedgerName, //电子账簿
      };
      const res = await getElectronicSectionOptions(json);
      console.log("页面内 获取行政区域下拉框res", res);
      if (res.message === "成功") {
        console.log("message成功 获取行政区域下拉框", res.data);
        this.sectionOptions = res.data;
        // this.sectionOptions.unshift({
        //   label: "全部",
        //   value: null,
        // });
      } else {
        this.$message.error(res.message);
      }
    },

    //获取单位名称下拉框
    async getElectronicUnitOptions(value) {
      console.log("value", value);
      const json = {
        // admDivCode: this.sectionName, //行政区划
        unitName: value, //单位
        // year: this.fiscalYear, //会计年度
        // acctEbkNum: this.accountingElectronicLedgerName, //电子账簿
      };
      const res = await getElectronicUnitOptions(json);
      console.log("页面内 获取单位名称下拉框res", res);
      if (res.message === "成功") {
        console.log("message成功 获取单位名称下拉框", res.data);
        this.unitNameOptions = res.data;
        // this.unitNameOptions.unshift({
        //   label: "全部",
        //   value: null,
        // });
      } else {
        this.$message.error(res.message);
      }
    },

    //获取电子账簿名称名称下拉框
    async getElectronicBooksOptions(value) {
      const json = {
        // admDivCode: this.sectionName, //行政区划
        // unitCode: this.unitName, //单位
        // year: this.fiscalYear, //会计年度
        acctEbkName: value, //电子账簿
      };
      const res = await getElectronicBooksOptions(json);
      console.log("页面内 获取电子账簿名称名称下拉框res", res);
      if (res.message === "成功") {
        console.log("message成功 获取电子账簿名称名称下拉框", res.data);
        this.accountingElectronicLedgerNameOptions = res.data;
        // this.accountingElectronicLedgerNameOptions.unshift({
        //   label: "全部",
        //   value: null,
        // });
      } else {
        this.$message.error(res.message);
      }
    },

    //获取电子账簿信息年份下拉框
    async getElectronicYearOptions() {
      // const json = {
      //   admDivCode: this.sectionName, //行政区划
      //   unitCode: this.unitName, //单位
      //   year: this.fiscalYear, //会计年度
      //   acctEbkNum: this.accountingElectronicLedgerName, //电子账簿
      // };
      const res = await getElectronicYearOptions();
      console.log("页面内 获取电子账簿信息年份下拉框res", res);
      if (res.message === "成功") {
        console.log("message成功 获取电子账簿信息年份下拉框", res.data);
        this.fiscalYearOptions = res.data;
        // this.fiscalYearOptions.unshift({
        //   label: "全部",
        //   value: null,
        // });
      } else {
        this.$message.error(res.message);
      }
    },

    //电子账簿信息表格数据
    async getElectronicBookData() {
      const json = {
        admDivCode: this.sectionName, //行政区划代码
        unitName: this.unitName, //单位代码
        year: this.fiscalYear, //会计年份
        acctEbkNum: this.accountingElectronicLedgerName, //会计电子账簿编码
        odName: this.sortString, //排序字段,
        pageSize: this.pagination.pageSize, // 页面大小
        pageOffset: this.pagination.pageSize * (this.pagination.current - 1), //偏移量// 页码
      };
      this.tableLoading = true;
      const res = await getElectronicBookData(json);
      this.tableLoading = false;
      console.log("页面内 电子账簿信息表格数据res", res);
      if (res.message === "成功") {
        console.log("message成功 电子账簿信息表格数据", res.data);
        this.dataSource = res.data.dateList;
        this.pagination.total = res.data.total;
      } else {
        this.$message.error(res.message);
      }
    },

    //重置
    reset() {
      this.sectionName = null;
      this.unitName = null;
      this.fiscalYear = null;
      this.accountingElectronicLedgerName = null;
    },
  },
};
</script>

<style lang="less">
.electronic-book {
  width: 100%;
  // height: calc(100% - 12px);
  height: 100%;

  .bottom-search {
    &-item {
      width: calc((100% - 80px) / 3);
    }
  }
}
</style>
