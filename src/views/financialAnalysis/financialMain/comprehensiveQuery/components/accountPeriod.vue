<!-- 会计期间定义 -->
<template>
  <div>
    <CommonList
      isTitle
      listClass="account-period"
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
            @search="getAccPeriodUnitName"
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
            @search="getAccPeriodLedgerName"
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
        <!-- 会计月份 -->
        <div class="bottom-search-item">
          <div class="item-label">会计月份：</div>
          <a-select
            class="item-value"
            placeholder="请选择会计月份"
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
        <div class="bottom-search-item"></div>
        <div class="bottom-search-item"></div>
        <!-- 查询重置排序按钮 -->
        <div class="bottom-search-item actions">
          <a-button
            type="primary"
            class="actions-btn"
            @click="getAccPeriodData()"
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
      sortTitle="会计期间定义排序配置"
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
  getAccPeriodData,
  getAccPeriodSort,
  getAccPeriodYear,
  getAccPeriodMonth,
  getAccPeriodDivision,
  getAccPeriodLedgerName,
  getAccPeriodUnitName,
} from "@/shared/newApi/financialAnalysis.js";
import { Button, Select } from "ant-design-vue";
// import { formatDecimalValues } from "../../util";
// const { RangePicker } = DatePicker;
// const { Group } = Radio;
export default {
  name: "AccountPeriod",
  data() {
    return {
      tableLoading: false,
      //排序按钮
      sortShow: false,
      sortOptions: [
        // {
        //   label: "字段1",
        //   value: "字段1",
        // },
      ],
      sortString: "",
      dragList: [], //拖拽之后的顺序
      sortOrder: null, //升序是1，降序是0

      //行政区划名称
      divisionName: null,
      divisionNameOptions: [],
      //会计年度
      accountingYear: "2023",
      accountingYearOptions: [
        // {
        //   label: "2019",
        //   value: "2019",
        // },
      ],
      //会计月份
      accountingMonth: null,
      accountingMonthOptions: [],
      //单位名称
      unitName: null,
      unitNameOptions: [],
      //电子帐簿名称
      electronicLedgerName: null,
      electronicLedgerNameOptions: [],

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
          key: "organizationName",
          dataIndex: "organizationName",
          width: 150,
          fixed: "left",
        },
        {
          title: "会计年度",
          dataIndex: "fiscalYear",
          width: 110,
          key: "fiscalYear",
          fixed: "left",
        },
        {
          title: "会计月份",
          dataIndex: "fiscalMonth",
          width: 110,
          key: "fiscalMonth",
        },
        {
          title: "开始日期",
          key: "startTime",
          dataIndex: "startTime",
          width: 150,
        },
        {
          title: "截止日期",
          key: "endTime",
          dataIndex: "endTime",
          width: 150,
        },
        {
          title: "会计电子账簿编号",
          key: "accountingNumber",
          dataIndex: "accountingNumber",
          width: 160,
        },
        {
          title: "会计电子账簿名称",
          key: "accountingName",
          dataIndex: "accountingName",
          width: 160,
        },
        {
          title: "单位代码",
          key: "organizationCode",
          dataIndex: "organizationCode",
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
          key: "bdpaudit",
          dataIndex: "bdpaudit",
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
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
      //   },
      //   {
      //     administrativeDivisionCode: "示例内容", // 行政区划代码
      //     administrativeDivisionName: "示例内容", // 行政区划名称
      //     fiscalYear: "示例内容", // 会计年度
      //     fiscalMonth: "示例内容", // 会计月份
      //     organizationCode: "示例内容", // 单位代码
      //     organizationName: "示例内容", // 单位名称
      //     accountingNumber: "示例内容", // 会计电子账簿编号
      //     accountingName: "示例内容", // 会计电子账簿名称
      //     startTime: "示例内容", // 开始日期
      //     endTime: "示例内容", // 截止日期
      //     bdpaudit: "示例内容", // BDP_AUDIT
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
          this.getAccPeriodData();
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = 1;
          this.pagination.pageSize = size;
          this.getAccPeriodData();
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
    this.getAccPeriodSort();
    this.getAccPeriodYear();
    this.getAccPeriodMonth();
    this.getAccPeriodDivision();
  },
  methods: {
    //排序按钮
    sortBtn() {
      this.sortShow = true;
    },
    onSortCancel() {
      this.sortShow = false;
    },
    onSortConfirm(sortString) {
      this.sortString = sortString;
      this.getAccPeriodData();
      this.onSortCancel();
    },

    //年份下拉框
    async getAccPeriodYear() {
      const res = await getAccPeriodYear();
      console.log("页面内 年份下拉框res", res);
      if (res.message === "成功") {
        console.log("message成功 年份下拉框", res.data);
        this.accountingYearOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //月份下拉框
    async getAccPeriodMonth() {
      const res = await getAccPeriodMonth();
      console.log("页面内 月份下拉框res", res);
      if (res.message === "成功") {
        console.log("message成功 月份下拉框", res.data);
        this.accountingMonthOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //行政区划名称下拉框
    async getAccPeriodDivision() {
      const res = await getAccPeriodDivision();
      if (res.message === "成功") {
        console.log("message成功 行政区划名称下拉框", res.data);
        this.divisionNameOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //单位名称下拉框
    async getAccPeriodUnitName(value) {
      const json = {
        inputData: value, // 单位编码
      };
      const res = await getAccPeriodUnitName(json);
      if (res.message === "成功") {
        console.log("message成功 单位名称下拉框", res.data);
        this.unitNameOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //电子账簿名称下拉框
    async getAccPeriodLedgerName(value) {
      const json = {
        inputData: value, // 单位编码
      };
      const res = await getAccPeriodLedgerName(json);
      console.log("页面内 电子账簿名称下拉框res", res);
      if (res.message === "成功") {
        this.electronicLedgerNameOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //会计期间定义表数据
    async getAccPeriodData() {
      const json = {
        admDivName: this.divisionName, //行政区划编码
        year: this.accountingYear, //会计年度
        month: this.accountingMonth, //会计月份
        unitName: this.unitName, //单位编码
        acctEbkName: this.electronicLedgerName, //会计电子账簿编号
        pageSize: this.pagination.pageSize, //页面大小
        pageOffset: this.pagination.pageSize * (this.pagination.current - 1), //页码
        // filterCondition: null, //筛选字符串
        odName: this.sortString, //排序字符串
      };
      this.tableLoading = true;
      const res = await getAccPeriodData(json);
      this.tableLoading = false;
      if (res.message === "成功") {
        console.log("message成功页面页面内会计期间定义表数据", res.data);
        // this.dataSource = formatDecimalValues(res.data.dateList);
        this.dataSource = res.data.dateList;
        this.pagination.total = res.data.total;
      } else {
        this.$message.error(res.message);
      }
    },

    //会计期间定义表排序数据
    async getAccPeriodSort() {
      this.sortOptions = [];
      const res = await getAccPeriodSort();
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

    reset() {
      this.divisionName = null;
      this.unitName = null;
      this.accountingYear = "2023";
      this.electronicLedgerName = null;
      this.accountingMonth = null;
    },
  },
};
</script>

<style>
.account-period {
  width: 100%;
  height: 100%;
  padding-left: 20px;
  background: #fff;
}
</style>
