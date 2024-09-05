<!-- 总账明细 -->
<template>
  <div class="general-details">
    <!-- 第一级表格 -->
    <div class="general-details-content" v-if="showNum === 1">
      <div class="content-header-one">总账</div>
      <div class="bottom-search">
        <div class="bottom-search-item">
          <div class="item-label"><i style="color: red">*</i>预算单位：</div>
          <!-- <a-tree-select
            v-model="choosedStruc"
            class="content-item-value"
            :tree-data="strucTree"
            tree-checkable
            :show-checked-strategy="SHOW_PARENT"
            search-placeholder="请选择"
          /> -->
          <a-select
            show-search
            placeholder="请输入"
            option-filter-prop="children"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            v-model="choosedBudget"
            allowClear
            class="item-value"
            @search="getGeneralDetailsBudget"
            @change="changeBudget"
          >
            <a-select-option
              v-for="item in budgetOptions"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</a-select-option
            >
          </a-select>
        </div>
        <div class="bottom-search-item">
          <div class="item-label"><i style="color: red">*</i>会计年度：</div>
          <a-select
            placeholder="请选择"
            v-model="choosedFinYear"
            :options="yearOptions"
            class="item-value"
            :disabled="isDisabled"
          />
        </div>
        <div class="bottom-search-item">
          <div class="item-label"><i style="color: red">*</i>会计月份：</div>
          <a-select
            placeholder="请选择"
            v-model="choosedFinMonth"
            :options="monthOptions"
            class="item-value"
            mode="multiple"
            :disabled="isDisabled"
          />
        </div>
        <div class="bottom-search-item">
          <div class="item-label">
            <i style="color: red">*</i>会计电子账簿：
          </div>
          <a-select
            placeholder="请选择"
            v-model="finBook"
            :options="finBookOptions"
            class="item-value"
            @change="changeFinBook"
            :disabled="isDisabled"
          />
        </div>
        <div class="bottom-search-item">
          <div class="item-label"><i style="color: red">*</i>会计体系：</div>
          <a-select
            placeholder="请选择"
            v-model="finSystem"
            :options="finSystemOptions"
            class="item-value"
            @change="changeFinSystem"
            :disabled="isDisabled"
          />
          <!-- @change="changeFinSystem" -->
          <!-- <a-input
            placeholder="请输入"
            v-model="finSystem"
            class="content-item-value"
          /> -->
        </div>
        <div class="bottom-search-item">
          <div class="item-label"><i style="color: red">*</i>会计科目：</div>
          <a-select
            mode="multiple"
            :autoClearSearchValue="false"
            v-model="choosedSubject"
            class="item-value"
            show-search
            placeholder="请输入"
            option-filter-prop="children"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="filterOption"
            :not-found-content="null"
            allowClear
            @change="handleSelectChange"
            :disabled="isDisabled"
          >
            <!-- @search="getGeneralDetailsSubjects" -->
            <a-select-option :value="'select-all'" :key="'select-all'">
              {{ allSelected ? "取消全选" : "全选" }}
            </a-select-option>
            <a-select-option
              v-for="item in subjectTree"
              :value="item.value"
              :key="item.value"
              >{{ item.title }}</a-select-option
            >
          </a-select>
          <!-- @change="changeSubject()"          :show-checked-strategy="SHOW_PARENT" -->
        </div>
        <div class="bottom-search-item"></div>
        <div class="bottom-search-item"></div>
        <div class="bottom-search-item actions">
          <a-button type="primary" class="actions-btn" @click="tableSearch()"
            >查询</a-button
          >
          <a-button type="primary" class="actions-btn" @click="reset()"
            >重置</a-button
          >
          <!-- <a-button type="primary" class="actions-btn" @click="sortBtn()">
            <div class="actions-btn-icon">
              <icon-svg icon-class="排序"></icon-svg>
            </div>
            排序
          </a-button> -->
        </div>
      </div>
      <a-table
        :columns="columns1"
        :data-source="dataSource1"
        :loading="tableLoading1"
        :expanded-row-keys.sync="expandedRowKeys"
        :pagination="false"
        bordered
        class="content-header-one-table"
        :customRow="handleRowClick1"
        :scroll="{ x: 'max-content', y: 'calc(100vh - 627px)' }"
      >
        <!-- <span slot="fullSubjectName" slot-scope="text">{{ text }}</span> -->
        <template slot="fullSubjectName" slot-scope="text">
          <a-tooltip :title="text">
            <span class="ellipsis">{{ text }}</span>
          </a-tooltip>
        </template>
      </a-table>
    </div>
    <!-- 第二级表格 -->
    <div class="general-details-content" v-if="showNum === 2">
      <div class="content-header">
        <a-breadcrumb>
          <a-breadcrumb-item
            ><div class="content-header-one">
              <a @click="goPage1()">总账</a>
            </div></a-breadcrumb-item
          >
          <a-breadcrumb-item
            ><div class="content-header-one">明细账</div></a-breadcrumb-item
          >
        </a-breadcrumb>
        <div class="content-header-btn" @click="goPage1()">返回</div>
      </div>
      <div class="bottom-search">
        <div class="bottom-search-item">
          <div class="item-label">预算单位：</div>
          <!-- <a-tree-select
            v-model="choosedStruc"
            class="content-item-value"
            :tree-data="strucTree"
            tree-checkable
            :show-checked-strategy="SHOW_PARENT"
            search-placeholder="请选择"
          /> -->
          <a-select
            disabled
            placeholder="请选择"
            v-model="choosedBudget"
            :options="budgetOptions"
            class="item-value"
            @change="changeBudget"
          />
        </div>
        <div class="bottom-search-item">
          <div class="item-label">会计年度：</div>
          <a-select
            disabled
            placeholder="请选择"
            v-model="choosedFinYear"
            :options="yearOptions"
            class="item-value"
          />
        </div>
        <div class="bottom-search-item">
          <div class="item-label">会计月份：</div>
          <a-select
            disabled
            placeholder="请选择"
            v-model="choosedFinMonth"
            :options="monthOptions"
            class="item-value"
            mode="multiple"
          />
        </div>
        <div class="bottom-search-item">
          <div class="item-label">会计电子账簿：</div>
          <a-select
            disabled
            placeholder="请选择"
            v-model="finBook"
            :options="finBookOptions"
            class="item-value"
            @change="changeFinBook"
          />
        </div>
        <div class="bottom-search-item">
          <div class="item-label">会计体系：</div>
          <a-select
            disabled
            placeholder="请选择"
            v-model="finSystem"
            :options="finSystemOptions"
            class="item-value"
            @change="changeFinSystem"
          />
          <!-- @change="changeFinSystem" -->
          <!-- <a-input
            placeholder="请输入"
            v-model="finSystem"
            class="content-item-value"
          /> -->
        </div>
        <div class="bottom-search-item">
          <div class="item-label">会计科目：</div>
          <a-tree-select
            disabled
            v-model="choosedSubject"
            class="item-value"
            :tree-data="subjectTree"
            tree-checkable
            search-placeholder="请选择"
          />
          <!-- @change="changeSubject()"          :show-checked-strategy="SHOW_PARENT" -->
        </div>
        <!-- <div class="bottom-search-item"></div>
        <div class="bottom-search-item"></div>
        <div class="bottom-search-item actions">
          <a-button type="primary" class="actions-btn" @click="tableSearch()"
            >查询</a-button
          >
          <a-button type="primary" class="actions-btn" @click="reset()"
            >重置</a-button
          >
        </div> -->
      </div>
      <a-table
        :columns="columns2"
        :data-source="dataSource2"
        :loading="tableLoading2"
        :expanded-row-keys.sync="expandedRowKeys2"
        :pagination="pagination"
        bordered
        class="content-header-two-table"
        :customRow="handleRowClick2"
        :scroll="{ x: 'max-content', y: 'calc(100vh - 505px)' }"
      >
        <!-- <a slot="subjectName" slot-scope="text">{{ text }}</a> -->
      </a-table>
    </div>
    <!-- 第三级表格 -->
    <div class="general-details-content" v-if="showNum === 3">
      <div class="content-header">
        <a-breadcrumb>
          <a-breadcrumb-item
            ><div class="content-header-one">
              <a @click="goPage1()">总账</a>
            </div></a-breadcrumb-item
          >
          <a-breadcrumb-item
            ><div class="content-header-one">
              <a @click="goPage2()">明细账</a>
            </div></a-breadcrumb-item
          >
          <a-breadcrumb-item
            ><div class="content-header-one">记账凭证</div></a-breadcrumb-item
          >
        </a-breadcrumb>
        <div class="content-header-btn" @click="goPage2()">返回</div>
      </div>
      <h1 class="big-center-head">记账凭证</h1>
      <div class="content-small-header">
        <div class="small-header-item">凭证日期：</div>
        <div class="small-header-num">{{ dataSource3.voucherDate }}</div>
        <div class="small-header-item">凭证号：</div>
        <div class="small-header-num">{{ dataSource3.voucherNumber }}</div>
      </div>
      <a-table
        :columns="columns3"
        :data-source="dataSource3.dateList"
        :loading="tableLoading3"
        :expanded-row-keys.sync="expandedRowKeys3"
        :pagination="false"
        bordered
        class="content-header-three-table"
        :scroll="{ x: 'max-content', y: 270 }"
      >
        <!-- <a slot="fullSubjectName" slot-scope="text">{{ text }}</a> -->
      </a-table>
      <div class="down">
        <div class="small-down">
          <div class="small-down-num">
            sum:{{ Number(dataSource3.debitAmountSummary).toLocaleString() }}
          </div>
          <div class="small-down-item">借方金额汇总</div>
        </div>
        <div class="small-down">
          <div class="small-down-num">
            sum:{{ Number(dataSource3.creditAmountSummary).toLocaleString() }}
          </div>
          <div class="small-down-item">贷方金额汇总</div>
        </div>
      </div>
    </div>

    <!-- 抽屉 -->
    <!-- <div class="fixed-icon" @click="visible = true">
      <icon-svg icon-class="参数" />
    </div> -->
    <!-- <a-drawer
      placement="right"
      :closable="false"
      :visible="visible"
      :width="520"
      :drawerStyle="customDrawerStyle"
      :after-visible-change="afterVisibleChange"
      @close="onClose"
      overlayClassName="general-details-fixed"
    >
      <div class="content-item">
        <div class="content-item-label">
          <i style="color: red">*</i>
          预算单位
        </div>
        <a-select
          placeholder="请选择"
          v-model="choosedBudget"
          :options="budgetOptions"
          class="content-item-value"
          @change="changeBudget"
        />
      </div>
      <div class="content-item">
        <div class="content-item-label">
          <i style="color: red">*</i> 会计年度
        </div>
        <a-select
          placeholder="请选择"
          v-model="choosedFinYear"
          :options="yearOptions"
          class="content-item-value"
        />
      </div>
      <div class="content-item">
        <div class="content-item-label">
          <i style="color: red">*</i> 会计月份
        </div>
        <a-select
          placeholder="请选择"
          v-model="choosedFinMonth"
          :options="monthOptions"
          class="content-item-value"
          mode="multiple"
        />
      </div>
      <div class="content-item">
        <div class="content-item-label">
          <i style="color: red">*</i> 会计电子账簿
        </div>
        <a-select
          placeholder="请选择"
          v-model="finBook"
          :options="finBookOptions"
          class="content-item-value"
          @change="changeFinBook"
        />
      </div>
      <div class="content-item">
        <div class="content-item-label">
          <i style="color: red">*</i> 会计体系
        </div>
        <a-select
          placeholder="请选择"
          v-model="finSystem"
          :options="finSystemOptions"
          class="content-item-value"
          @change="changeFinSystem"
        />
      </div>
      <div class="content-item">
        <div class="content-item-label">
          <i style="color: red">*</i> 会计科目
        </div>
        <a-tree-select
          v-model="choosedSubject"
          class="content-item-value"
          :tree-data="subjectTree"
          tree-checkable
          search-placeholder="请选择"
        />
      </div>

      <div
        class="content-btn"
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
      >
        <a-button
          type="primary"
          style="margin-right: 8px"
          @click="tableSearch()"
          :class="[showNum === 2 || show === 3 ? 'btn-disabled' : '']"
          >确定</a-button
        >
        <a-button
          style="margin-right: 8px"
          @click="reset()"
          :class="[showNum === 2 || show === 3 ? 'btn-disabled' : '']"
          >重置</a-button
        >
        <a-button @click="visible = false">取消</a-button>
      </div>
    </a-drawer> -->
  </div>
</template>
<script>
import {
  getGeneralDetailsBook,
  getGeneralDetailsBudget,
  getGeneralDetailsDataOne,
  getGeneralDetailsDataThree,
  getGeneralDetailsDataTwo,
  getGeneralDetailsSubjects,
  getGeneralDetailsSystem,
  getGeneralDetailsYear,
} from "@/shared/newApi/financialAnalysis.js";
import {
  Breadcrumb,
  Button,
  // Input,
  // Popover,
  // Drawer,
  Tooltip,
  Select,
  TreeSelect,
} from "ant-design-vue";
import {
  formatArray,
  // formatDecimalValues,
  generateHierarchy,
} from "../util";
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const BreadcrumbItem = Breadcrumb.Item;

export default {
  name: "GeneralDetails",
  data() {
    return {
      //分页
      pagination: {
        size: "small",
        total: 0,
        current: 1,
        pageSize: 50,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ["50", "100", "200"],
        showTotal: (total) => {
          return `共${total}条记录`;
        },
        onChange: (page, pageSize) => {
          this.pagination.current = page;
          this.pagination.pageSize = pageSize;
          this.getGeneralDetailsDataTwo();
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = 1;
          this.pagination.pageSize = size;
          this.getGeneralDetailsDataTwo();
        },
      },

      //一级跳二级
      acctSubjCodeJump: null,
      monthJump: null,
      //二三级跳转
      voucherNumber: null,
      accountingMonthJump: [],
      SHOW_PARENT,
      tableLoading1: false,
      tableLoading2: false,
      tableLoading3: false,

      //第一级其余五个下拉框是否可选
      isDisabled: true,

      //悬浮弹框
      visible: false,
      customDrawerStyle: {
        // height: "300px", // 自定义高度
        // background: "#f0f2f5", // 自定义背景色
        // width: "900px",
      },

      // //凭证日期
      // voucherDate: "2024-06-28",
      // //凭证号
      // voucherNumber: "546654456",
      // //借方金额汇总
      // debitAmountSummary: "4566515",
      // //贷方金额汇总
      // creditAmountSummary: "289899",
      //预算单位
      choosedBudget: null,
      budgetOptions: [
        // { label: "code——预算单位1", value: "预算单位1的code" },
        // { label: "code——预算单位2", value: "预算单位2的code" },
        // { label: "code——预算单位3", value: "预算单位3的code" },
        // { label: "code——预算单位4", value: "预算单位4的code" },
        // { label: "code——预算单位5", value: "预算单位5的code" },
      ],
      //会计年度
      choosedFinYear: null,
      yearOptions: [
        // {
        //   value: "2018",
        //   label: "2018",
        // },
        // {
        //   value: "2019",
        //   label: "2019",
        // },
        // {
        //   value: "2020",
        //   label: "2020",
        // },
        // {
        //   value: "2021",
        //   label: "2021",
        // },
        // {
        //   value: "2022",
        //   label: "2022",
        // },
        // {
        //   value: "2023",
        //   label: "2023",
        // },
      ],
      //会计月份
      choosedFinMonth: [],
      monthOptions: [
        { label: "1月", value: "1" },
        { label: "2月", value: "2" },
        { label: "3月", value: "3" },
        { label: "4月", value: "4" },
        { label: "5月", value: "5" },
        { label: "6月", value: "6" },
        { label: "7月", value: "7" },
        { label: "8月", value: "8" },
        { label: "9月", value: "9" },
        { label: "10月", value: "10" },
        { label: "11月", value: "11" },
        { label: "12月", value: "12" },
      ],
      //会计电子账簿
      finBook: null,
      finBookOptions: [
        // { label: "电子账簿1", value: "电子账簿1的code" },
        // { label: "电子账簿2", value: "电子账簿2的code" },
        // { label: "电子账簿3", value: "电子账簿3的code" },
        // { label: "电子账簿4", value: "电子账簿4的code" },
        // { label: "电子账簿5", value: "电子账簿5的code" },
      ],
      //会计体系
      finSystem: null,
      finSystemOptions: [
        // { label: "会计体系1", value: "会计体系1的code" },
        // { label: "会计体系2", value: "会计体系2的code" },
        // { label: "会计体系3", value: "会计体系3的code" },
        // { label: "会计体系4", value: "会计体系4的code" },
        // { label: "会计体系5", value: "会计体系5的code" },
      ],
      //会计科目
      choosedSubject: [],
      allSelected: false, // 添加一个状态来跟踪全选的状态
      subjectTree: [
        // {
        //   label: "1001——库存现金",
        //   value: "库存现金的code",
        //   key: "库存现金的code",
        // },
        // {
        //   label: "2211——应付职工薪酬",
        //   value: "应付职工薪酬的code",
        //   key: "应付职工薪酬的code",
        // },
        // {
        //   label: "221101——职工工资",
        //   value: "221101——职工工资的code",
        //   key: "221101——职工工资的code",
        // },
        // {
        //   label: "221102——奖金和补贴",
        //   value: "221102——奖金和补贴的code",
        //   key: "221102——奖金和补贴的code",
        // },
        // {
        //   label: "221103——职工福利费",
        //   value: "221103——职工福利费的code",
        //   key: "221103——职工福利费的code",
        // },
      ],

      //1：第一层表 2；第二层表 3：第三层表
      showNum: 1,
      //第一页表格
      //表头
      columns1: [
        {
          title: "科目编码",
          dataIndex: "subjectCode",
          key: "subjectCode",
          width: 150,
          fixed: "left",
        },
        {
          title: "科目名称",
          dataIndex: "subjectName",
          key: "subjectName",
          width: 160,
          fixed: "left",
          // scopedSlots: { customRender: "subjectName" },
        },
        {
          title: "科目全称",
          dataIndex: "fullSubjectName",
          key: "fullSubjectName",
          width: 180,
          scopedSlots: { customRender: "fullSubjectName" },
        },
        {
          title: "会计月份",
          dataIndex: "accountingMonth",
          key: "accountingMonth",
          width: 50,
        },
        {
          title: "年初借方余额",
          dataIndex: "beginningBalanceAtYearStart",
          key: "beginningBalanceAtYearStart",
          width: 100,
        },
        {
          title: "年初贷方余额",
          dataIndex: "creditBalanceAtYearStart",
          key: "creditBalanceAtYearStart",
          width: 100,
        },
        {
          title: "年初余额方向",
          dataIndex: "balanceDirectionAtYearStart",
          key: "balanceDirectionAtYearStart",
          width: 50,
        },
        {
          title: "借方累计发生额",
          dataIndex: "cumulativeDebitAmount",
          key: "cumulativeDebitAmount",
          width: 110,
        },
        {
          title: "贷方累计发生额",
          dataIndex: "cumulativeCreditAmount",
          key: "cumulativeCreditAmount",
          width: 110,
        },
        {
          title: "期末借方余额",
          dataIndex: "debitBalanceAtPeriodEnd",
          key: "debitBalanceAtPeriodEnd",
          width: 110,
        },
        {
          title: "期末贷方余额",
          dataIndex: "creditBalanceAtPeriodEnd",
          key: "creditBalanceAtPeriodEnd",
          width: 110,
        },
        {
          title: "期末余额方向",
          dataIndex: "balanceDirectionAtPeriodEnd",
          key: "balanceDirectionAtPeriodEnd",
          width: 50,
        },
        {
          title: "期初借方余额",
          dataIndex: "debitBalanceAtPeriodStart",
          key: "debitBalanceAtPeriodStart",
          width: 110,
        },
        {
          title: "期初贷方余额",
          dataIndex: "creditBalanceAtPeriodStart",
          key: "creditBalanceAtPeriodStart",
          width: 110,
        },
        {
          title: "期初余额方向",
          dataIndex: "balanceDirectionAtPeriodStart",
          key: "balanceDirectionAtPeriodStart",
          width: 50,
        },
        {
          title: "借方发生额",
          dataIndex: "debitAmount",
          key: "debitAmount",
          width: 110,
        },
        {
          title: "贷方发生额",
          dataIndex: "creditAmount",
          key: "creditAmount",
          width: 110,
        },
        {
          title: "外币年初借方余额",
          dataIndex: "foreignCurrencyDebitBalanceAtYearStart",
          key: "foreignCurrencyDebitBalanceAtYearStart",
          width: 180,
        },
        {
          title: "外币年初贷方余额",
          dataIndex: "foreignCurrencyCreditBalanceAtYearStart",
          key: "foreignCurrencyCreditBalanceAtYearStart",
          width: 180,
        },
        {
          title: "外币借方累计发生额",
          dataIndex: "foreignCurrencyCumulativeDebitAmount",
          key: "foreignCurrencyCumulativeDebitAmount",
          width: 180,
        },
        {
          title: "外币贷方累计发生额",
          dataIndex: "foreignCurrencyCumulativeCreditAmount",
          key: "foreignCurrencyCumulativeCreditAmount",
          width: 180,
        },
        {
          title: "外币期末借方余额",
          dataIndex: "foreignCurrencyDebitBalanceAtPeriodEnd",
          key: "foreignCurrencyDebitBalanceAtPeriodEnd",
          width: 180,
        },
        {
          title: "外币期末贷方余额",
          dataIndex: "foreignCurrencyCreditBalanceAtPeriodEnd",
          key: "foreignCurrencyCreditBalanceAtPeriodEnd",
          width: 180,
        },
        {
          title: "外币期初借方余额",
          dataIndex: "foreignCurrencyDebitBalanceAtPeriodStart",
          key: "foreignCurrencyDebitBalanceAtPeriodStart",
          width: 180,
        },
        {
          title: "外币期初贷方余额",
          dataIndex: "foreignCurrencyCreditBalanceAtPeriodStart",
          key: "foreignCurrencyCreditBalanceAtPeriodStart",
          width: 180,
        },
        {
          title: "外币借方发生额",
          dataIndex: "foreignCurrencyDebitAmount",
          key: "foreignCurrencyDebitAmount",
          width: 170,
        },
        {
          title: "外币贷方发生额",
          dataIndex: "foreignCurrencyCreditAmount",
          key: "foreignCurrencyCreditAmount",
          width: 180,
        },
        {
          title: "分录数",
          dataIndex: "entryCount",
          key: "entryCount",
          width: 150,
        },
        {
          title: "会计科目级别",
          dataIndex: "accountingSubjectLevel",
          key: "accountingSubjectLevel",
          width: 150,
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
          title: "是否现金或现金等价物",
          dataIndex: "isCashOrCashEquivalent",
          key: "isCashOrCashEquivalent",
          width: 190,
        },
        {
          title: "币种名称",
          dataIndex: "currencyName",
          key: "currencyName",
          width: 150,
        },
        {
          title: "币种代码",
          dataIndex: "currencyCode",
          key: "currencyCode",
          width: 150,
        },
        {
          title: "会计年度",
          dataIndex: "accountingYear",
          key: "accountingYear",
          width: 150,
        },
      ],
      //表格数据来源
      dataSource1: [],

      // dataSource1: [
      //   {
      //     key: 2221,
      //     subjectCode: "2221", // 科目编码
      //     subjectName: "应交税费", // 科目名称
      //     fullSubjectName: "应交税费", // 科目全称
      //     beginningBalanceAtYearStart: "123456789", // 年初期初余额
      //     creditBalanceAtYearStart: "xxx", // 年初贷方余额
      //     balanceDirectionAtYearStart: "123456789", // 年初余额方向
      //     debitBalanceAtPeriodStart: "123456789", // 期初借方余额
      //     creditBalanceAtPeriodStart: "示例内容", // 期初贷方余额
      //     balanceDirectionAtPeriodStart: "示例内容", // 期初余额方向
      //     foreignCurrencyDebitBalanceAtYearStart: "示例内容", // 外币年初借方余额
      //     foreignCurrencyCreditBalanceAtYearStart: "示例内容", // 外币年初贷方余额
      //     foreignCurrencyDebitBalanceAtPeriodStart: "示例内容", // 外币期初借方余额
      //     foreignCurrencyCreditBalanceAtPeriodStart: "示例内容", // 外币期初贷方余额
      //     debitAmount: "示例内容",
      //     cumulativeDebitAmount: "示例内容", // 借方累计发生额
      //     foreignCurrencyDebitAmount: "示例内容",
      //     foreignCurrencyCumulativeDebitAmount: "示例内容", // 外币借方累计发生额
      //     creditAmount: "示例内容", // 贷方发生额
      //     cumulativeCreditAmount: "示例内容", // 贷方累计发生额
      //     foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //     foreignCurrencyCumulativeCreditAmount: "示例内容", // 外币贷方累计发生额
      //     debitBalanceAtPeriodEnd: "示例内容", // 期末借方余额
      //     creditBalanceAtPeriodEnd: "示例内容", // 期末贷方余额
      //     balanceDirectionAtPeriodEnd: "示例内容", // 期末余额方向
      //     foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容", // 外币期末借方余额
      //     foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容", // 外币期末贷方余额
      //     entryCount: "示例内容", // 分录数
      //     accountingSubjectLevel: "示例内容", // 会计科目级别
      //     isLowestLevelSubject: "示例内容", // 是否最底级科目
      //     parentSubjectCode: "示例内容", // 上级科目编码
      //     isCashOrCashEquivalent: "示例内容", // 是否现金或现金等价物
      //     currencyName: "示例内容", // 币种名称
      //     currencyCode: "示例内容", // 币种代码
      //     accountingMonth: "示例内容", // 会计月份
      //     accountingYear: "示例内容", // 会计年度
      //     children: [
      //       //子数组
      //       {
      //         key: 222101,
      //         subjectCode: "222101",
      //         subjectName: "应交增值税",
      //         fullSubjectName: "应交增值税",
      //         beginningBalanceAtYearStart: "123456789",
      //         creditBalanceAtYearStart: "xxx",
      //         balanceDirectionAtYearStart: "123456789",
      //         debitBalanceAtPeriodStart: "123456789",
      //         creditBalanceAtPeriodStart: "示例内容",
      //         balanceDirectionAtPeriodStart: "示例内容",
      //         foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //         foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //         foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //         foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //         debitAmount: "示例内容",
      //         cumulativeDebitAmount: "示例内容",
      //         foreignCurrencyDebitAmount: "示例内容",
      //         foreignCurrencyCumulativeDebitAmount: "示例内容",
      //         creditAmount: "示例内容", // 贷方发生额
      //         cumulativeCreditAmount: "示例内容",
      //         foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //         foreignCurrencyCumulativeCreditAmount: "示例内容",
      //         debitBalanceAtPeriodEnd: "示例内容",
      //         creditBalanceAtPeriodEnd: "示例内容",
      //         balanceDirectionAtPeriodEnd: "示例内容",
      //         foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //         foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //         entryCount: "示例内容",
      //         accountingSubjectLevel: "示例内容",
      //         isLowestLevelSubject: "示例内容",
      //         parentSubjectCode: "示例内容",
      //         isCashOrCashEquivalent: "示例内容",
      //         currencyName: "示例内容",
      //         currencyCode: "示例内容",
      //         accountingMonth: "示例内容",
      //         accountingYear: "示例内容",
      //         children: [
      //           //子数组
      //           {
      //             key: 22210101,
      //             subjectCode: "22210101",
      //             subjectName: "进项税额",
      //             fullSubjectName: "进项税额",
      //             beginningBalanceAtYearStart: "123456789",
      //             creditBalanceAtYearStart: "xxx",
      //             balanceDirectionAtYearStart: "123456789",
      //             debitBalanceAtPeriodStart: "123456789",
      //             creditBalanceAtPeriodStart: "示例内容",
      //             balanceDirectionAtPeriodStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //             debitAmount: "示例内容",
      //             cumulativeDebitAmount: "示例内容",
      //             foreignCurrencyDebitAmount: "示例内容",
      //             foreignCurrencyCumulativeDebitAmount: "示例内容",
      //             creditAmount: "示例内容", // 贷方发生额
      //             cumulativeCreditAmount: "示例内容",
      //             foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //             foreignCurrencyCumulativeCreditAmount: "示例内容",
      //             debitBalanceAtPeriodEnd: "示例内容",
      //             creditBalanceAtPeriodEnd: "示例内容",
      //             balanceDirectionAtPeriodEnd: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //             entryCount: "示例内容",
      //             accountingSubjectLevel: "示例内容",
      //             isLowestLevelSubject: "示例内容",
      //             parentSubjectCode: "示例内容",
      //             isCashOrCashEquivalent: "示例内容",
      //             currencyName: "示例内容",
      //             currencyCode: "示例内容",
      //             accountingMonth: "示例内容",
      //             accountingYear: "示例内容",
      //           },
      //           {
      //             key: 22210102,
      //             subjectCode: "22210102",
      //             subjectName: "销项税额抵减",
      //             fullSubjectName: "销项税额抵减",
      //             beginningBalanceAtYearStart: "123456789",
      //             creditBalanceAtYearStart: "xxx",
      //             balanceDirectionAtYearStart: "123456789",
      //             debitBalanceAtPeriodStart: "123456789",
      //             creditBalanceAtPeriodStart: "示例内容",
      //             balanceDirectionAtPeriodStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //             debitAmount: "示例内容",
      //             cumulativeDebitAmount: "示例内容",
      //             foreignCurrencyDebitAmount: "示例内容",
      //             foreignCurrencyCumulativeDebitAmount: "示例内容",
      //             creditAmount: "示例内容", // 贷方发生额
      //             cumulativeCreditAmount: "示例内容",
      //             foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //             foreignCurrencyCumulativeCreditAmount: "示例内容",
      //             debitBalanceAtPeriodEnd: "示例内容",
      //             creditBalanceAtPeriodEnd: "示例内容",
      //             balanceDirectionAtPeriodEnd: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //             entryCount: "示例内容",
      //             accountingSubjectLevel: "示例内容",
      //             isLowestLevelSubject: "示例内容",
      //             parentSubjectCode: "示例内容",
      //             isCashOrCashEquivalent: "示例内容",
      //             currencyName: "示例内容",
      //             currencyCode: "示例内容",
      //             accountingMonth: "示例内容",
      //             accountingYear: "示例内容",
      //           },
      //         ],
      //       },
      //     ],
      //   },
      //   {
      //     key: 2221,
      //     subjectCode: "2221", // 科目编码
      //     subjectName: "应交税费", // 科目名称
      //     fullSubjectName: "应交税费", // 科目全称
      //     beginningBalanceAtYearStart: "123456789", // 年初期初余额
      //     creditBalanceAtYearStart: "xxx", // 年初贷方余额
      //     balanceDirectionAtYearStart: "123456789", // 年初余额方向
      //     debitBalanceAtPeriodStart: "123456789", // 期初借方余额
      //     creditBalanceAtPeriodStart: "示例内容", // 期初贷方余额
      //     balanceDirectionAtPeriodStart: "示例内容", // 期初余额方向
      //     foreignCurrencyDebitBalanceAtYearStart: "示例内容", // 外币年初借方余额
      //     foreignCurrencyCreditBalanceAtYearStart: "示例内容", // 外币年初贷方余额
      //     foreignCurrencyDebitBalanceAtPeriodStart: "示例内容", // 外币期初借方余额
      //     foreignCurrencyCreditBalanceAtPeriodStart: "示例内容", // 外币期初贷方余额
      //     debitAmount: "示例内容",
      //     cumulativeDebitAmount: "示例内容", // 借方累计发生额
      //     foreignCurrencyDebitAmount: "示例内容",
      //     foreignCurrencyCumulativeDebitAmount: "示例内容", // 外币借方累计发生额
      //     creditAmount: "示例内容", // 贷方发生额
      //     cumulativeCreditAmount: "示例内容", // 贷方累计发生额
      //     foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //     foreignCurrencyCumulativeCreditAmount: "示例内容", // 外币贷方累计发生额
      //     debitBalanceAtPeriodEnd: "示例内容", // 期末借方余额
      //     creditBalanceAtPeriodEnd: "示例内容", // 期末贷方余额
      //     balanceDirectionAtPeriodEnd: "示例内容", // 期末余额方向
      //     foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容", // 外币期末借方余额
      //     foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容", // 外币期末贷方余额
      //     entryCount: "示例内容", // 分录数
      //     accountingSubjectLevel: "示例内容", // 会计科目级别
      //     isLowestLevelSubject: "示例内容", // 是否最底级科目
      //     parentSubjectCode: "示例内容", // 上级科目编码
      //     isCashOrCashEquivalent: "示例内容", // 是否现金或现金等价物
      //     currencyName: "示例内容", // 币种名称
      //     currencyCode: "示例内容", // 币种代码
      //     accountingMonth: "示例内容", // 会计月份
      //     accountingYear: "示例内容", // 会计年度
      //     children: [
      //       //子数组
      //       {
      //         key: 222101,
      //         subjectCode: "222101",
      //         subjectName: "应交增值税",
      //         fullSubjectName: "应交增值税",
      //         beginningBalanceAtYearStart: "123456789",
      //         creditBalanceAtYearStart: "xxx",
      //         balanceDirectionAtYearStart: "123456789",
      //         debitBalanceAtPeriodStart: "123456789",
      //         creditBalanceAtPeriodStart: "示例内容",
      //         balanceDirectionAtPeriodStart: "示例内容",
      //         foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //         foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //         foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //         foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //         debitAmount: "示例内容",
      //         cumulativeDebitAmount: "示例内容",
      //         foreignCurrencyDebitAmount: "示例内容",
      //         foreignCurrencyCumulativeDebitAmount: "示例内容",
      //         creditAmount: "示例内容", // 贷方发生额
      //         cumulativeCreditAmount: "示例内容",
      //         foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //         foreignCurrencyCumulativeCreditAmount: "示例内容",
      //         debitBalanceAtPeriodEnd: "示例内容",
      //         creditBalanceAtPeriodEnd: "示例内容",
      //         balanceDirectionAtPeriodEnd: "示例内容",
      //         foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //         foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //         entryCount: "示例内容",
      //         accountingSubjectLevel: "示例内容",
      //         isLowestLevelSubject: "示例内容",
      //         parentSubjectCode: "示例内容",
      //         isCashOrCashEquivalent: "示例内容",
      //         currencyName: "示例内容",
      //         currencyCode: "示例内容",
      //         accountingMonth: "示例内容",
      //         accountingYear: "示例内容",
      //         children: [
      //           //子数组
      //           {
      //             key: 22210101,
      //             subjectCode: "22210101",
      //             subjectName: "进项税额",
      //             fullSubjectName: "进项税额",
      //             beginningBalanceAtYearStart: "123456789",
      //             creditBalanceAtYearStart: "xxx",
      //             balanceDirectionAtYearStart: "123456789",
      //             debitBalanceAtPeriodStart: "123456789",
      //             creditBalanceAtPeriodStart: "示例内容",
      //             balanceDirectionAtPeriodStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //             debitAmount: "示例内容",
      //             cumulativeDebitAmount: "示例内容",
      //             foreignCurrencyDebitAmount: "示例内容",
      //             foreignCurrencyCumulativeDebitAmount: "示例内容",
      //             creditAmount: "示例内容", // 贷方发生额
      //             cumulativeCreditAmount: "示例内容",
      //             foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //             foreignCurrencyCumulativeCreditAmount: "示例内容",
      //             debitBalanceAtPeriodEnd: "示例内容",
      //             creditBalanceAtPeriodEnd: "示例内容",
      //             balanceDirectionAtPeriodEnd: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //             entryCount: "示例内容",
      //             accountingSubjectLevel: "示例内容",
      //             isLowestLevelSubject: "示例内容",
      //             parentSubjectCode: "示例内容",
      //             isCashOrCashEquivalent: "示例内容",
      //             currencyName: "示例内容",
      //             currencyCode: "示例内容",
      //             accountingMonth: "示例内容",
      //             accountingYear: "示例内容",
      //           },
      //           {
      //             key: 22210102,
      //             subjectCode: "22210102",
      //             subjectName: "销项税额抵减",
      //             fullSubjectName: "销项税额抵减",
      //             beginningBalanceAtYearStart: "123456789",
      //             creditBalanceAtYearStart: "xxx",
      //             balanceDirectionAtYearStart: "123456789",
      //             debitBalanceAtPeriodStart: "123456789",
      //             creditBalanceAtPeriodStart: "示例内容",
      //             balanceDirectionAtPeriodStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //             debitAmount: "示例内容",
      //             cumulativeDebitAmount: "示例内容",
      //             foreignCurrencyDebitAmount: "示例内容",
      //             foreignCurrencyCumulativeDebitAmount: "示例内容",
      //             creditAmount: "示例内容", // 贷方发生额
      //             cumulativeCreditAmount: "示例内容",
      //             foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //             foreignCurrencyCumulativeCreditAmount: "示例内容",
      //             debitBalanceAtPeriodEnd: "示例内容",
      //             creditBalanceAtPeriodEnd: "示例内容",
      //             balanceDirectionAtPeriodEnd: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //             entryCount: "示例内容",
      //             accountingSubjectLevel: "示例内容",
      //             isLowestLevelSubject: "示例内容",
      //             parentSubjectCode: "示例内容",
      //             isCashOrCashEquivalent: "示例内容",
      //             currencyName: "示例内容",
      //             currencyCode: "示例内容",
      //             accountingMonth: "示例内容",
      //             accountingYear: "示例内容",
      //           },
      //         ],
      //       },
      //     ],
      //   },
      //   {
      //     key: 2221,
      //     subjectCode: "2221", // 科目编码
      //     subjectName: "应交税费", // 科目名称
      //     fullSubjectName: "应交税费", // 科目全称
      //     beginningBalanceAtYearStart: "123456789", // 年初期初余额
      //     creditBalanceAtYearStart: "xxx", // 年初贷方余额
      //     balanceDirectionAtYearStart: "123456789", // 年初余额方向
      //     debitBalanceAtPeriodStart: "123456789", // 期初借方余额
      //     creditBalanceAtPeriodStart: "示例内容", // 期初贷方余额
      //     balanceDirectionAtPeriodStart: "示例内容", // 期初余额方向
      //     foreignCurrencyDebitBalanceAtYearStart: "示例内容", // 外币年初借方余额
      //     foreignCurrencyCreditBalanceAtYearStart: "示例内容", // 外币年初贷方余额
      //     foreignCurrencyDebitBalanceAtPeriodStart: "示例内容", // 外币期初借方余额
      //     foreignCurrencyCreditBalanceAtPeriodStart: "示例内容", // 外币期初贷方余额
      //     debitAmount: "示例内容",
      //     cumulativeDebitAmount: "示例内容", // 借方累计发生额
      //     foreignCurrencyDebitAmount: "示例内容",
      //     foreignCurrencyCumulativeDebitAmount: "示例内容", // 外币借方累计发生额
      //     creditAmount: "示例内容", // 贷方发生额
      //     cumulativeCreditAmount: "示例内容", // 贷方累计发生额
      //     foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //     foreignCurrencyCumulativeCreditAmount: "示例内容", // 外币贷方累计发生额
      //     debitBalanceAtPeriodEnd: "示例内容", // 期末借方余额
      //     creditBalanceAtPeriodEnd: "示例内容", // 期末贷方余额
      //     balanceDirectionAtPeriodEnd: "示例内容", // 期末余额方向
      //     foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容", // 外币期末借方余额
      //     foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容", // 外币期末贷方余额
      //     entryCount: "示例内容", // 分录数
      //     accountingSubjectLevel: "示例内容", // 会计科目级别
      //     isLowestLevelSubject: "示例内容", // 是否最底级科目
      //     parentSubjectCode: "示例内容", // 上级科目编码
      //     isCashOrCashEquivalent: "示例内容", // 是否现金或现金等价物
      //     currencyName: "示例内容", // 币种名称
      //     currencyCode: "示例内容", // 币种代码
      //     accountingMonth: "示例内容", // 会计月份
      //     accountingYear: "示例内容", // 会计年度
      //     children: [
      //       //子数组
      //       {
      //         key: 222101,
      //         subjectCode: "222101",
      //         subjectName: "应交增值税",
      //         fullSubjectName: "应交增值税",
      //         beginningBalanceAtYearStart: "123456789",
      //         creditBalanceAtYearStart: "xxx",
      //         balanceDirectionAtYearStart: "123456789",
      //         debitBalanceAtPeriodStart: "123456789",
      //         creditBalanceAtPeriodStart: "示例内容",
      //         balanceDirectionAtPeriodStart: "示例内容",
      //         foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //         foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //         foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //         foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //         debitAmount: "示例内容",
      //         cumulativeDebitAmount: "示例内容",
      //         foreignCurrencyDebitAmount: "示例内容",
      //         foreignCurrencyCumulativeDebitAmount: "示例内容",
      //         creditAmount: "示例内容", // 贷方发生额
      //         cumulativeCreditAmount: "示例内容",
      //         foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //         foreignCurrencyCumulativeCreditAmount: "示例内容",
      //         debitBalanceAtPeriodEnd: "示例内容",
      //         creditBalanceAtPeriodEnd: "示例内容",
      //         balanceDirectionAtPeriodEnd: "示例内容",
      //         foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //         foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //         entryCount: "示例内容",
      //         accountingSubjectLevel: "示例内容",
      //         isLowestLevelSubject: "示例内容",
      //         parentSubjectCode: "示例内容",
      //         isCashOrCashEquivalent: "示例内容",
      //         currencyName: "示例内容",
      //         currencyCode: "示例内容",
      //         accountingMonth: "示例内容",
      //         accountingYear: "示例内容",
      //         children: [
      //           //子数组
      //           {
      //             key: 22210101,
      //             subjectCode: "22210101",
      //             subjectName: "进项税额",
      //             fullSubjectName: "进项税额",
      //             beginningBalanceAtYearStart: "123456789",
      //             creditBalanceAtYearStart: "xxx",
      //             balanceDirectionAtYearStart: "123456789",
      //             debitBalanceAtPeriodStart: "123456789",
      //             creditBalanceAtPeriodStart: "示例内容",
      //             balanceDirectionAtPeriodStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //             debitAmount: "示例内容",
      //             cumulativeDebitAmount: "示例内容",
      //             foreignCurrencyDebitAmount: "示例内容",
      //             foreignCurrencyCumulativeDebitAmount: "示例内容",
      //             creditAmount: "示例内容", // 贷方发生额
      //             cumulativeCreditAmount: "示例内容",
      //             foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //             foreignCurrencyCumulativeCreditAmount: "示例内容",
      //             debitBalanceAtPeriodEnd: "示例内容",
      //             creditBalanceAtPeriodEnd: "示例内容",
      //             balanceDirectionAtPeriodEnd: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //             entryCount: "示例内容",
      //             accountingSubjectLevel: "示例内容",
      //             isLowestLevelSubject: "示例内容",
      //             parentSubjectCode: "示例内容",
      //             isCashOrCashEquivalent: "示例内容",
      //             currencyName: "示例内容",
      //             currencyCode: "示例内容",
      //             accountingMonth: "示例内容",
      //             accountingYear: "示例内容",
      //           },
      //           {
      //             key: 22210102,
      //             subjectCode: "22210102",
      //             subjectName: "销项税额抵减",
      //             fullSubjectName: "销项税额抵减",
      //             beginningBalanceAtYearStart: "123456789",
      //             creditBalanceAtYearStart: "xxx",
      //             balanceDirectionAtYearStart: "123456789",
      //             debitBalanceAtPeriodStart: "123456789",
      //             creditBalanceAtPeriodStart: "示例内容",
      //             balanceDirectionAtPeriodStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //             debitAmount: "示例内容",
      //             cumulativeDebitAmount: "示例内容",
      //             foreignCurrencyDebitAmount: "示例内容",
      //             foreignCurrencyCumulativeDebitAmount: "示例内容",
      //             creditAmount: "示例内容", // 贷方发生额
      //             cumulativeCreditAmount: "示例内容",
      //             foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //             foreignCurrencyCumulativeCreditAmount: "示例内容",
      //             debitBalanceAtPeriodEnd: "示例内容",
      //             creditBalanceAtPeriodEnd: "示例内容",
      //             balanceDirectionAtPeriodEnd: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //             entryCount: "示例内容",
      //             accountingSubjectLevel: "示例内容",
      //             isLowestLevelSubject: "示例内容",
      //             parentSubjectCode: "示例内容",
      //             isCashOrCashEquivalent: "示例内容",
      //             currencyName: "示例内容",
      //             currencyCode: "示例内容",
      //             accountingMonth: "示例内容",
      //             accountingYear: "示例内容",
      //           },
      //         ],
      //       },
      //     ],
      //   },
      //   {
      //     key: 2221,
      //     subjectCode: "2221", // 科目编码
      //     subjectName: "应交税费", // 科目名称
      //     fullSubjectName: "应交税费", // 科目全称
      //     beginningBalanceAtYearStart: "123456789", // 年初期初余额
      //     creditBalanceAtYearStart: "xxx", // 年初贷方余额
      //     balanceDirectionAtYearStart: "123456789", // 年初余额方向
      //     debitBalanceAtPeriodStart: "123456789", // 期初借方余额
      //     creditBalanceAtPeriodStart: "示例内容", // 期初贷方余额
      //     balanceDirectionAtPeriodStart: "示例内容", // 期初余额方向
      //     foreignCurrencyDebitBalanceAtYearStart: "示例内容", // 外币年初借方余额
      //     foreignCurrencyCreditBalanceAtYearStart: "示例内容", // 外币年初贷方余额
      //     foreignCurrencyDebitBalanceAtPeriodStart: "示例内容", // 外币期初借方余额
      //     foreignCurrencyCreditBalanceAtPeriodStart: "示例内容", // 外币期初贷方余额
      //     debitAmount: "示例内容",
      //     cumulativeDebitAmount: "示例内容", // 借方累计发生额
      //     foreignCurrencyDebitAmount: "示例内容",
      //     foreignCurrencyCumulativeDebitAmount: "示例内容", // 外币借方累计发生额
      //     creditAmount: "示例内容", // 贷方发生额
      //     cumulativeCreditAmount: "示例内容", // 贷方累计发生额
      //     foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //     foreignCurrencyCumulativeCreditAmount: "示例内容", // 外币贷方累计发生额
      //     debitBalanceAtPeriodEnd: "示例内容", // 期末借方余额
      //     creditBalanceAtPeriodEnd: "示例内容", // 期末贷方余额
      //     balanceDirectionAtPeriodEnd: "示例内容", // 期末余额方向
      //     foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容", // 外币期末借方余额
      //     foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容", // 外币期末贷方余额
      //     entryCount: "示例内容", // 分录数
      //     accountingSubjectLevel: "示例内容", // 会计科目级别
      //     isLowestLevelSubject: "示例内容", // 是否最底级科目
      //     parentSubjectCode: "示例内容", // 上级科目编码
      //     isCashOrCashEquivalent: "示例内容", // 是否现金或现金等价物
      //     currencyName: "示例内容", // 币种名称
      //     currencyCode: "示例内容", // 币种代码
      //     accountingMonth: "示例内容", // 会计月份
      //     accountingYear: "示例内容", // 会计年度
      //     children: [
      //       //子数组
      //       {
      //         key: 222101,
      //         subjectCode: "222101",
      //         subjectName: "应交增值税",
      //         fullSubjectName: "应交增值税",
      //         beginningBalanceAtYearStart: "123456789",
      //         creditBalanceAtYearStart: "xxx",
      //         balanceDirectionAtYearStart: "123456789",
      //         debitBalanceAtPeriodStart: "123456789",
      //         creditBalanceAtPeriodStart: "示例内容",
      //         balanceDirectionAtPeriodStart: "示例内容",
      //         foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //         foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //         foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //         foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //         debitAmount: "示例内容",
      //         cumulativeDebitAmount: "示例内容",
      //         foreignCurrencyDebitAmount: "示例内容",
      //         foreignCurrencyCumulativeDebitAmount: "示例内容",
      //         creditAmount: "示例内容", // 贷方发生额
      //         cumulativeCreditAmount: "示例内容",
      //         foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //         foreignCurrencyCumulativeCreditAmount: "示例内容",
      //         debitBalanceAtPeriodEnd: "示例内容",
      //         creditBalanceAtPeriodEnd: "示例内容",
      //         balanceDirectionAtPeriodEnd: "示例内容",
      //         foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //         foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //         entryCount: "示例内容",
      //         accountingSubjectLevel: "示例内容",
      //         isLowestLevelSubject: "示例内容",
      //         parentSubjectCode: "示例内容",
      //         isCashOrCashEquivalent: "示例内容",
      //         currencyName: "示例内容",
      //         currencyCode: "示例内容",
      //         accountingMonth: "示例内容",
      //         accountingYear: "示例内容",
      //         children: [
      //           //子数组
      //           {
      //             key: 22210101,
      //             subjectCode: "22210101",
      //             subjectName: "进项税额",
      //             fullSubjectName: "进项税额",
      //             beginningBalanceAtYearStart: "123456789",
      //             creditBalanceAtYearStart: "xxx",
      //             balanceDirectionAtYearStart: "123456789",
      //             debitBalanceAtPeriodStart: "123456789",
      //             creditBalanceAtPeriodStart: "示例内容",
      //             balanceDirectionAtPeriodStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //             debitAmount: "示例内容",
      //             cumulativeDebitAmount: "示例内容",
      //             foreignCurrencyDebitAmount: "示例内容",
      //             foreignCurrencyCumulativeDebitAmount: "示例内容",
      //             creditAmount: "示例内容", // 贷方发生额
      //             cumulativeCreditAmount: "示例内容",
      //             foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //             foreignCurrencyCumulativeCreditAmount: "示例内容",
      //             debitBalanceAtPeriodEnd: "示例内容",
      //             creditBalanceAtPeriodEnd: "示例内容",
      //             balanceDirectionAtPeriodEnd: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //             entryCount: "示例内容",
      //             accountingSubjectLevel: "示例内容",
      //             isLowestLevelSubject: "示例内容",
      //             parentSubjectCode: "示例内容",
      //             isCashOrCashEquivalent: "示例内容",
      //             currencyName: "示例内容",
      //             currencyCode: "示例内容",
      //             accountingMonth: "示例内容",
      //             accountingYear: "示例内容",
      //           },
      //           {
      //             key: 22210102,
      //             subjectCode: "22210102",
      //             subjectName: "销项税额抵减",
      //             fullSubjectName: "销项税额抵减",
      //             beginningBalanceAtYearStart: "123456789",
      //             creditBalanceAtYearStart: "xxx",
      //             balanceDirectionAtYearStart: "123456789",
      //             debitBalanceAtPeriodStart: "123456789",
      //             creditBalanceAtPeriodStart: "示例内容",
      //             balanceDirectionAtPeriodStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //             debitAmount: "示例内容",
      //             cumulativeDebitAmount: "示例内容",
      //             foreignCurrencyDebitAmount: "示例内容",
      //             foreignCurrencyCumulativeDebitAmount: "示例内容",
      //             creditAmount: "示例内容", // 贷方发生额
      //             cumulativeCreditAmount: "示例内容",
      //             foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //             foreignCurrencyCumulativeCreditAmount: "示例内容",
      //             debitBalanceAtPeriodEnd: "示例内容",
      //             creditBalanceAtPeriodEnd: "示例内容",
      //             balanceDirectionAtPeriodEnd: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //             entryCount: "示例内容",
      //             accountingSubjectLevel: "示例内容",
      //             isLowestLevelSubject: "示例内容",
      //             parentSubjectCode: "示例内容",
      //             isCashOrCashEquivalent: "示例内容",
      //             currencyName: "示例内容",
      //             currencyCode: "示例内容",
      //             accountingMonth: "示例内容",
      //             accountingYear: "示例内容",
      //           },
      //         ],
      //       },
      //     ],
      //   },
      //   {
      //     key: 2221,
      //     subjectCode: "2221", // 科目编码
      //     subjectName: "应交税费", // 科目名称
      //     fullSubjectName: "应交税费", // 科目全称
      //     beginningBalanceAtYearStart: "123456789", // 年初期初余额
      //     creditBalanceAtYearStart: "xxx", // 年初贷方余额
      //     balanceDirectionAtYearStart: "123456789", // 年初余额方向
      //     debitBalanceAtPeriodStart: "123456789", // 期初借方余额
      //     creditBalanceAtPeriodStart: "示例内容", // 期初贷方余额
      //     balanceDirectionAtPeriodStart: "示例内容", // 期初余额方向
      //     foreignCurrencyDebitBalanceAtYearStart: "示例内容", // 外币年初借方余额
      //     foreignCurrencyCreditBalanceAtYearStart: "示例内容", // 外币年初贷方余额
      //     foreignCurrencyDebitBalanceAtPeriodStart: "示例内容", // 外币期初借方余额
      //     foreignCurrencyCreditBalanceAtPeriodStart: "示例内容", // 外币期初贷方余额
      //     debitAmount: "示例内容",
      //     cumulativeDebitAmount: "示例内容", // 借方累计发生额
      //     foreignCurrencyDebitAmount: "示例内容",
      //     foreignCurrencyCumulativeDebitAmount: "示例内容", // 外币借方累计发生额
      //     creditAmount: "示例内容", // 贷方发生额
      //     cumulativeCreditAmount: "示例内容", // 贷方累计发生额
      //     foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //     foreignCurrencyCumulativeCreditAmount: "示例内容", // 外币贷方累计发生额
      //     debitBalanceAtPeriodEnd: "示例内容", // 期末借方余额
      //     creditBalanceAtPeriodEnd: "示例内容", // 期末贷方余额
      //     balanceDirectionAtPeriodEnd: "示例内容", // 期末余额方向
      //     foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容", // 外币期末借方余额
      //     foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容", // 外币期末贷方余额
      //     entryCount: "示例内容", // 分录数
      //     accountingSubjectLevel: "示例内容", // 会计科目级别
      //     isLowestLevelSubject: "示例内容", // 是否最底级科目
      //     parentSubjectCode: "示例内容", // 上级科目编码
      //     isCashOrCashEquivalent: "示例内容", // 是否现金或现金等价物
      //     currencyName: "示例内容", // 币种名称
      //     currencyCode: "示例内容", // 币种代码
      //     accountingMonth: "示例内容", // 会计月份
      //     accountingYear: "示例内容", // 会计年度
      //     children: [
      //       //子数组
      //       {
      //         key: 222101,
      //         subjectCode: "222101",
      //         subjectName: "应交增值税",
      //         fullSubjectName: "应交增值税",
      //         beginningBalanceAtYearStart: "123456789",
      //         creditBalanceAtYearStart: "xxx",
      //         balanceDirectionAtYearStart: "123456789",
      //         debitBalanceAtPeriodStart: "123456789",
      //         creditBalanceAtPeriodStart: "示例内容",
      //         balanceDirectionAtPeriodStart: "示例内容",
      //         foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //         foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //         foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //         foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //         debitAmount: "示例内容",
      //         cumulativeDebitAmount: "示例内容",
      //         foreignCurrencyDebitAmount: "示例内容",
      //         foreignCurrencyCumulativeDebitAmount: "示例内容",
      //         creditAmount: "示例内容", // 贷方发生额
      //         cumulativeCreditAmount: "示例内容",
      //         foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //         foreignCurrencyCumulativeCreditAmount: "示例内容",
      //         debitBalanceAtPeriodEnd: "示例内容",
      //         creditBalanceAtPeriodEnd: "示例内容",
      //         balanceDirectionAtPeriodEnd: "示例内容",
      //         foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //         foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //         entryCount: "示例内容",
      //         accountingSubjectLevel: "示例内容",
      //         isLowestLevelSubject: "示例内容",
      //         parentSubjectCode: "示例内容",
      //         isCashOrCashEquivalent: "示例内容",
      //         currencyName: "示例内容",
      //         currencyCode: "示例内容",
      //         accountingMonth: "示例内容",
      //         accountingYear: "示例内容",
      //         children: [
      //           //子数组
      //           {
      //             key: 22210101,
      //             subjectCode: "22210101",
      //             subjectName: "进项税额",
      //             fullSubjectName: "进项税额",
      //             beginningBalanceAtYearStart: "123456789",
      //             creditBalanceAtYearStart: "xxx",
      //             balanceDirectionAtYearStart: "123456789",
      //             debitBalanceAtPeriodStart: "123456789",
      //             creditBalanceAtPeriodStart: "示例内容",
      //             balanceDirectionAtPeriodStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //             debitAmount: "示例内容",
      //             cumulativeDebitAmount: "示例内容",
      //             foreignCurrencyDebitAmount: "示例内容",
      //             foreignCurrencyCumulativeDebitAmount: "示例内容",
      //             creditAmount: "示例内容", // 贷方发生额
      //             cumulativeCreditAmount: "示例内容",
      //             foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //             foreignCurrencyCumulativeCreditAmount: "示例内容",
      //             debitBalanceAtPeriodEnd: "示例内容",
      //             creditBalanceAtPeriodEnd: "示例内容",
      //             balanceDirectionAtPeriodEnd: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //             entryCount: "示例内容",
      //             accountingSubjectLevel: "示例内容",
      //             isLowestLevelSubject: "示例内容",
      //             parentSubjectCode: "示例内容",
      //             isCashOrCashEquivalent: "示例内容",
      //             currencyName: "示例内容",
      //             currencyCode: "示例内容",
      //             accountingMonth: "示例内容",
      //             accountingYear: "示例内容",
      //           },
      //           {
      //             key: 22210102,
      //             subjectCode: "22210102",
      //             subjectName: "销项税额抵减",
      //             fullSubjectName: "销项税额抵减",
      //             beginningBalanceAtYearStart: "123456789",
      //             creditBalanceAtYearStart: "xxx",
      //             balanceDirectionAtYearStart: "123456789",
      //             debitBalanceAtPeriodStart: "123456789",
      //             creditBalanceAtPeriodStart: "示例内容",
      //             balanceDirectionAtPeriodStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //             debitAmount: "示例内容",
      //             cumulativeDebitAmount: "示例内容",
      //             foreignCurrencyDebitAmount: "示例内容",
      //             foreignCurrencyCumulativeDebitAmount: "示例内容",
      //             creditAmount: "示例内容", // 贷方发生额
      //             cumulativeCreditAmount: "示例内容",
      //             foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //             foreignCurrencyCumulativeCreditAmount: "示例内容",
      //             debitBalanceAtPeriodEnd: "示例内容",
      //             creditBalanceAtPeriodEnd: "示例内容",
      //             balanceDirectionAtPeriodEnd: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //             entryCount: "示例内容",
      //             accountingSubjectLevel: "示例内容",
      //             isLowestLevelSubject: "示例内容",
      //             parentSubjectCode: "示例内容",
      //             isCashOrCashEquivalent: "示例内容",
      //             currencyName: "示例内容",
      //             currencyCode: "示例内容",
      //             accountingMonth: "示例内容",
      //             accountingYear: "示例内容",
      //           },
      //         ],
      //       },
      //     ],
      //   },
      //   {
      //     key: 2221,
      //     subjectCode: "2221", // 科目编码
      //     subjectName: "应交税费", // 科目名称
      //     fullSubjectName: "应交税费", // 科目全称
      //     beginningBalanceAtYearStart: "123456789", // 年初期初余额
      //     creditBalanceAtYearStart: "xxx", // 年初贷方余额
      //     balanceDirectionAtYearStart: "123456789", // 年初余额方向
      //     debitBalanceAtPeriodStart: "123456789", // 期初借方余额
      //     creditBalanceAtPeriodStart: "示例内容", // 期初贷方余额
      //     balanceDirectionAtPeriodStart: "示例内容", // 期初余额方向
      //     foreignCurrencyDebitBalanceAtYearStart: "示例内容", // 外币年初借方余额
      //     foreignCurrencyCreditBalanceAtYearStart: "示例内容", // 外币年初贷方余额
      //     foreignCurrencyDebitBalanceAtPeriodStart: "示例内容", // 外币期初借方余额
      //     foreignCurrencyCreditBalanceAtPeriodStart: "示例内容", // 外币期初贷方余额
      //     debitAmount: "示例内容",
      //     cumulativeDebitAmount: "示例内容", // 借方累计发生额
      //     foreignCurrencyDebitAmount: "示例内容",
      //     foreignCurrencyCumulativeDebitAmount: "示例内容", // 外币借方累计发生额
      //     creditAmount: "示例内容", // 贷方发生额
      //     cumulativeCreditAmount: "示例内容", // 贷方累计发生额
      //     foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //     foreignCurrencyCumulativeCreditAmount: "示例内容", // 外币贷方累计发生额
      //     debitBalanceAtPeriodEnd: "示例内容", // 期末借方余额
      //     creditBalanceAtPeriodEnd: "示例内容", // 期末贷方余额
      //     balanceDirectionAtPeriodEnd: "示例内容", // 期末余额方向
      //     foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容", // 外币期末借方余额
      //     foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容", // 外币期末贷方余额
      //     entryCount: "示例内容", // 分录数
      //     accountingSubjectLevel: "示例内容", // 会计科目级别
      //     isLowestLevelSubject: "示例内容", // 是否最底级科目
      //     parentSubjectCode: "示例内容", // 上级科目编码
      //     isCashOrCashEquivalent: "示例内容", // 是否现金或现金等价物
      //     currencyName: "示例内容", // 币种名称
      //     currencyCode: "示例内容", // 币种代码
      //     accountingMonth: "示例内容", // 会计月份
      //     accountingYear: "示例内容", // 会计年度
      //     children: [
      //       //子数组
      //       {
      //         key: 222101,
      //         subjectCode: "222101",
      //         subjectName: "应交增值税",
      //         fullSubjectName: "应交增值税",
      //         beginningBalanceAtYearStart: "123456789",
      //         creditBalanceAtYearStart: "xxx",
      //         balanceDirectionAtYearStart: "123456789",
      //         debitBalanceAtPeriodStart: "123456789",
      //         creditBalanceAtPeriodStart: "示例内容",
      //         balanceDirectionAtPeriodStart: "示例内容",
      //         foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //         foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //         foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //         foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //         debitAmount: "示例内容",
      //         cumulativeDebitAmount: "示例内容",
      //         foreignCurrencyDebitAmount: "示例内容",
      //         foreignCurrencyCumulativeDebitAmount: "示例内容",
      //         creditAmount: "示例内容", // 贷方发生额
      //         cumulativeCreditAmount: "示例内容",
      //         foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //         foreignCurrencyCumulativeCreditAmount: "示例内容",
      //         debitBalanceAtPeriodEnd: "示例内容",
      //         creditBalanceAtPeriodEnd: "示例内容",
      //         balanceDirectionAtPeriodEnd: "示例内容",
      //         foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //         foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //         entryCount: "示例内容",
      //         accountingSubjectLevel: "示例内容",
      //         isLowestLevelSubject: "示例内容",
      //         parentSubjectCode: "示例内容",
      //         isCashOrCashEquivalent: "示例内容",
      //         currencyName: "示例内容",
      //         currencyCode: "示例内容",
      //         accountingMonth: "示例内容",
      //         accountingYear: "示例内容",
      //         children: [
      //           //子数组
      //           {
      //             key: 22210101,
      //             subjectCode: "22210101",
      //             subjectName: "进项税额",
      //             fullSubjectName: "进项税额",
      //             beginningBalanceAtYearStart: "123456789",
      //             creditBalanceAtYearStart: "xxx",
      //             balanceDirectionAtYearStart: "123456789",
      //             debitBalanceAtPeriodStart: "123456789",
      //             creditBalanceAtPeriodStart: "示例内容",
      //             balanceDirectionAtPeriodStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //             debitAmount: "示例内容",
      //             cumulativeDebitAmount: "示例内容",
      //             foreignCurrencyDebitAmount: "示例内容",
      //             foreignCurrencyCumulativeDebitAmount: "示例内容",
      //             creditAmount: "示例内容", // 贷方发生额
      //             cumulativeCreditAmount: "示例内容",
      //             foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //             foreignCurrencyCumulativeCreditAmount: "示例内容",
      //             debitBalanceAtPeriodEnd: "示例内容",
      //             creditBalanceAtPeriodEnd: "示例内容",
      //             balanceDirectionAtPeriodEnd: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //             entryCount: "示例内容",
      //             accountingSubjectLevel: "示例内容",
      //             isLowestLevelSubject: "示例内容",
      //             parentSubjectCode: "示例内容",
      //             isCashOrCashEquivalent: "示例内容",
      //             currencyName: "示例内容",
      //             currencyCode: "示例内容",
      //             accountingMonth: "示例内容",
      //             accountingYear: "示例内容",
      //           },
      //           {
      //             key: 22210102,
      //             subjectCode: "22210102",
      //             subjectName: "销项税额抵减",
      //             fullSubjectName: "销项税额抵减",
      //             beginningBalanceAtYearStart: "123456789",
      //             creditBalanceAtYearStart: "xxx",
      //             balanceDirectionAtYearStart: "123456789",
      //             debitBalanceAtPeriodStart: "123456789",
      //             creditBalanceAtPeriodStart: "示例内容",
      //             balanceDirectionAtPeriodStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //             debitAmount: "示例内容",
      //             cumulativeDebitAmount: "示例内容",
      //             foreignCurrencyDebitAmount: "示例内容",
      //             foreignCurrencyCumulativeDebitAmount: "示例内容",
      //             creditAmount: "示例内容", // 贷方发生额
      //             cumulativeCreditAmount: "示例内容",
      //             foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //             foreignCurrencyCumulativeCreditAmount: "示例内容",
      //             debitBalanceAtPeriodEnd: "示例内容",
      //             creditBalanceAtPeriodEnd: "示例内容",
      //             balanceDirectionAtPeriodEnd: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //             entryCount: "示例内容",
      //             accountingSubjectLevel: "示例内容",
      //             isLowestLevelSubject: "示例内容",
      //             parentSubjectCode: "示例内容",
      //             isCashOrCashEquivalent: "示例内容",
      //             currencyName: "示例内容",
      //             currencyCode: "示例内容",
      //             accountingMonth: "示例内容",
      //             accountingYear: "示例内容",
      //           },
      //         ],
      //       },
      //     ],
      //   },
      //   {
      //     key: 2221,
      //     subjectCode: "2221", // 科目编码
      //     subjectName: "应交税费", // 科目名称
      //     fullSubjectName: "应交税费", // 科目全称
      //     beginningBalanceAtYearStart: "123456789", // 年初期初余额
      //     creditBalanceAtYearStart: "xxx", // 年初贷方余额
      //     balanceDirectionAtYearStart: "123456789", // 年初余额方向
      //     debitBalanceAtPeriodStart: "123456789", // 期初借方余额
      //     creditBalanceAtPeriodStart: "示例内容", // 期初贷方余额
      //     balanceDirectionAtPeriodStart: "示例内容", // 期初余额方向
      //     foreignCurrencyDebitBalanceAtYearStart: "示例内容", // 外币年初借方余额
      //     foreignCurrencyCreditBalanceAtYearStart: "示例内容", // 外币年初贷方余额
      //     foreignCurrencyDebitBalanceAtPeriodStart: "示例内容", // 外币期初借方余额
      //     foreignCurrencyCreditBalanceAtPeriodStart: "示例内容", // 外币期初贷方余额
      //     debitAmount: "示例内容",
      //     cumulativeDebitAmount: "示例内容", // 借方累计发生额
      //     foreignCurrencyDebitAmount: "示例内容",
      //     foreignCurrencyCumulativeDebitAmount: "示例内容", // 外币借方累计发生额
      //     creditAmount: "示例内容", // 贷方发生额
      //     cumulativeCreditAmount: "示例内容", // 贷方累计发生额
      //     foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //     foreignCurrencyCumulativeCreditAmount: "示例内容", // 外币贷方累计发生额
      //     debitBalanceAtPeriodEnd: "示例内容", // 期末借方余额
      //     creditBalanceAtPeriodEnd: "示例内容", // 期末贷方余额
      //     balanceDirectionAtPeriodEnd: "示例内容", // 期末余额方向
      //     foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容", // 外币期末借方余额
      //     foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容", // 外币期末贷方余额
      //     entryCount: "示例内容", // 分录数
      //     accountingSubjectLevel: "示例内容", // 会计科目级别
      //     isLowestLevelSubject: "示例内容", // 是否最底级科目
      //     parentSubjectCode: "示例内容", // 上级科目编码
      //     isCashOrCashEquivalent: "示例内容", // 是否现金或现金等价物
      //     currencyName: "示例内容", // 币种名称
      //     currencyCode: "示例内容", // 币种代码
      //     accountingMonth: "示例内容", // 会计月份
      //     accountingYear: "示例内容", // 会计年度
      //     children: [
      //       //子数组
      //       {
      //         key: 222101,
      //         subjectCode: "222101",
      //         subjectName: "应交增值税",
      //         fullSubjectName: "应交增值税",
      //         beginningBalanceAtYearStart: "123456789",
      //         creditBalanceAtYearStart: "xxx",
      //         balanceDirectionAtYearStart: "123456789",
      //         debitBalanceAtPeriodStart: "123456789",
      //         creditBalanceAtPeriodStart: "示例内容",
      //         balanceDirectionAtPeriodStart: "示例内容",
      //         foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //         foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //         foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //         foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //         debitAmount: "示例内容",
      //         cumulativeDebitAmount: "示例内容",
      //         foreignCurrencyDebitAmount: "示例内容",
      //         foreignCurrencyCumulativeDebitAmount: "示例内容",
      //         creditAmount: "示例内容", // 贷方发生额
      //         cumulativeCreditAmount: "示例内容",
      //         foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //         foreignCurrencyCumulativeCreditAmount: "示例内容",
      //         debitBalanceAtPeriodEnd: "示例内容",
      //         creditBalanceAtPeriodEnd: "示例内容",
      //         balanceDirectionAtPeriodEnd: "示例内容",
      //         foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //         foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //         entryCount: "示例内容",
      //         accountingSubjectLevel: "示例内容",
      //         isLowestLevelSubject: "示例内容",
      //         parentSubjectCode: "示例内容",
      //         isCashOrCashEquivalent: "示例内容",
      //         currencyName: "示例内容",
      //         currencyCode: "示例内容",
      //         accountingMonth: "示例内容",
      //         accountingYear: "示例内容",
      //         children: [
      //           //子数组
      //           {
      //             key: 22210101,
      //             subjectCode: "22210101",
      //             subjectName: "进项税额",
      //             fullSubjectName: "进项税额",
      //             beginningBalanceAtYearStart: "123456789",
      //             creditBalanceAtYearStart: "xxx",
      //             balanceDirectionAtYearStart: "123456789",
      //             debitBalanceAtPeriodStart: "123456789",
      //             creditBalanceAtPeriodStart: "示例内容",
      //             balanceDirectionAtPeriodStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //             debitAmount: "示例内容",
      //             cumulativeDebitAmount: "示例内容",
      //             foreignCurrencyDebitAmount: "示例内容",
      //             foreignCurrencyCumulativeDebitAmount: "示例内容",
      //             creditAmount: "示例内容", // 贷方发生额
      //             cumulativeCreditAmount: "示例内容",
      //             foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //             foreignCurrencyCumulativeCreditAmount: "示例内容",
      //             debitBalanceAtPeriodEnd: "示例内容",
      //             creditBalanceAtPeriodEnd: "示例内容",
      //             balanceDirectionAtPeriodEnd: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //             entryCount: "示例内容",
      //             accountingSubjectLevel: "示例内容",
      //             isLowestLevelSubject: "示例内容",
      //             parentSubjectCode: "示例内容",
      //             isCashOrCashEquivalent: "示例内容",
      //             currencyName: "示例内容",
      //             currencyCode: "示例内容",
      //             accountingMonth: "示例内容",
      //             accountingYear: "示例内容",
      //           },
      //           {
      //             key: 22210102,
      //             subjectCode: "22210102",
      //             subjectName: "销项税额抵减",
      //             fullSubjectName: "销项税额抵减",
      //             beginningBalanceAtYearStart: "123456789",
      //             creditBalanceAtYearStart: "xxx",
      //             balanceDirectionAtYearStart: "123456789",
      //             debitBalanceAtPeriodStart: "123456789",
      //             creditBalanceAtPeriodStart: "示例内容",
      //             balanceDirectionAtPeriodStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //             debitAmount: "示例内容",
      //             cumulativeDebitAmount: "示例内容",
      //             foreignCurrencyDebitAmount: "示例内容",
      //             foreignCurrencyCumulativeDebitAmount: "示例内容",
      //             creditAmount: "示例内容", // 贷方发生额
      //             cumulativeCreditAmount: "示例内容",
      //             foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //             foreignCurrencyCumulativeCreditAmount: "示例内容",
      //             debitBalanceAtPeriodEnd: "示例内容",
      //             creditBalanceAtPeriodEnd: "示例内容",
      //             balanceDirectionAtPeriodEnd: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //             entryCount: "示例内容",
      //             accountingSubjectLevel: "示例内容",
      //             isLowestLevelSubject: "示例内容",
      //             parentSubjectCode: "示例内容",
      //             isCashOrCashEquivalent: "示例内容",
      //             currencyName: "示例内容",
      //             currencyCode: "示例内容",
      //             accountingMonth: "示例内容",
      //             accountingYear: "示例内容",
      //           },
      //         ],
      //       },
      //     ],
      //   },
      //   {
      //     key: 2221,
      //     subjectCode: "2221", // 科目编码
      //     subjectName: "应交税费", // 科目名称
      //     fullSubjectName: "应交税费", // 科目全称
      //     beginningBalanceAtYearStart: "123456789", // 年初期初余额
      //     creditBalanceAtYearStart: "xxx", // 年初贷方余额
      //     balanceDirectionAtYearStart: "123456789", // 年初余额方向
      //     debitBalanceAtPeriodStart: "123456789", // 期初借方余额
      //     creditBalanceAtPeriodStart: "示例内容", // 期初贷方余额
      //     balanceDirectionAtPeriodStart: "示例内容", // 期初余额方向
      //     foreignCurrencyDebitBalanceAtYearStart: "示例内容", // 外币年初借方余额
      //     foreignCurrencyCreditBalanceAtYearStart: "示例内容", // 外币年初贷方余额
      //     foreignCurrencyDebitBalanceAtPeriodStart: "示例内容", // 外币期初借方余额
      //     foreignCurrencyCreditBalanceAtPeriodStart: "示例内容", // 外币期初贷方余额
      //     debitAmount: "示例内容",
      //     cumulativeDebitAmount: "示例内容", // 借方累计发生额
      //     foreignCurrencyDebitAmount: "示例内容",
      //     foreignCurrencyCumulativeDebitAmount: "示例内容", // 外币借方累计发生额
      //     creditAmount: "示例内容", // 贷方发生额
      //     cumulativeCreditAmount: "示例内容", // 贷方累计发生额
      //     foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //     foreignCurrencyCumulativeCreditAmount: "示例内容", // 外币贷方累计发生额
      //     debitBalanceAtPeriodEnd: "示例内容", // 期末借方余额
      //     creditBalanceAtPeriodEnd: "示例内容", // 期末贷方余额
      //     balanceDirectionAtPeriodEnd: "示例内容", // 期末余额方向
      //     foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容", // 外币期末借方余额
      //     foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容", // 外币期末贷方余额
      //     entryCount: "示例内容", // 分录数
      //     accountingSubjectLevel: "示例内容", // 会计科目级别
      //     isLowestLevelSubject: "示例内容", // 是否最底级科目
      //     parentSubjectCode: "示例内容", // 上级科目编码
      //     isCashOrCashEquivalent: "示例内容", // 是否现金或现金等价物
      //     currencyName: "示例内容", // 币种名称
      //     currencyCode: "示例内容", // 币种代码
      //     accountingMonth: "示例内容", // 会计月份
      //     accountingYear: "示例内容", // 会计年度
      //     children: [
      //       //子数组
      //       {
      //         key: 222101,
      //         subjectCode: "222101",
      //         subjectName: "应交增值税",
      //         fullSubjectName: "应交增值税",
      //         beginningBalanceAtYearStart: "123456789",
      //         creditBalanceAtYearStart: "xxx",
      //         balanceDirectionAtYearStart: "123456789",
      //         debitBalanceAtPeriodStart: "123456789",
      //         creditBalanceAtPeriodStart: "示例内容",
      //         balanceDirectionAtPeriodStart: "示例内容",
      //         foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //         foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //         foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //         foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //         debitAmount: "示例内容",
      //         cumulativeDebitAmount: "示例内容",
      //         foreignCurrencyDebitAmount: "示例内容",
      //         foreignCurrencyCumulativeDebitAmount: "示例内容",
      //         creditAmount: "示例内容", // 贷方发生额
      //         cumulativeCreditAmount: "示例内容",
      //         foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //         foreignCurrencyCumulativeCreditAmount: "示例内容",
      //         debitBalanceAtPeriodEnd: "示例内容",
      //         creditBalanceAtPeriodEnd: "示例内容",
      //         balanceDirectionAtPeriodEnd: "示例内容",
      //         foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //         foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //         entryCount: "示例内容",
      //         accountingSubjectLevel: "示例内容",
      //         isLowestLevelSubject: "示例内容",
      //         parentSubjectCode: "示例内容",
      //         isCashOrCashEquivalent: "示例内容",
      //         currencyName: "示例内容",
      //         currencyCode: "示例内容",
      //         accountingMonth: "示例内容",
      //         accountingYear: "示例内容",
      //         children: [
      //           //子数组
      //           {
      //             key: 22210101,
      //             subjectCode: "22210101",
      //             subjectName: "进项税额",
      //             fullSubjectName: "进项税额",
      //             beginningBalanceAtYearStart: "123456789",
      //             creditBalanceAtYearStart: "xxx",
      //             balanceDirectionAtYearStart: "123456789",
      //             debitBalanceAtPeriodStart: "123456789",
      //             creditBalanceAtPeriodStart: "示例内容",
      //             balanceDirectionAtPeriodStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //             debitAmount: "示例内容",
      //             cumulativeDebitAmount: "示例内容",
      //             foreignCurrencyDebitAmount: "示例内容",
      //             foreignCurrencyCumulativeDebitAmount: "示例内容",
      //             creditAmount: "示例内容", // 贷方发生额
      //             cumulativeCreditAmount: "示例内容",
      //             foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //             foreignCurrencyCumulativeCreditAmount: "示例内容",
      //             debitBalanceAtPeriodEnd: "示例内容",
      //             creditBalanceAtPeriodEnd: "示例内容",
      //             balanceDirectionAtPeriodEnd: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //             entryCount: "示例内容",
      //             accountingSubjectLevel: "示例内容",
      //             isLowestLevelSubject: "示例内容",
      //             parentSubjectCode: "示例内容",
      //             isCashOrCashEquivalent: "示例内容",
      //             currencyName: "示例内容",
      //             currencyCode: "示例内容",
      //             accountingMonth: "示例内容",
      //             accountingYear: "示例内容",
      //           },
      //           {
      //             key: 22210102,
      //             subjectCode: "22210102",
      //             subjectName: "销项税额抵减",
      //             fullSubjectName: "销项税额抵减",
      //             beginningBalanceAtYearStart: "123456789",
      //             creditBalanceAtYearStart: "xxx",
      //             balanceDirectionAtYearStart: "123456789",
      //             debitBalanceAtPeriodStart: "123456789",
      //             creditBalanceAtPeriodStart: "示例内容",
      //             balanceDirectionAtPeriodStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //             debitAmount: "示例内容",
      //             cumulativeDebitAmount: "示例内容",
      //             foreignCurrencyDebitAmount: "示例内容",
      //             foreignCurrencyCumulativeDebitAmount: "示例内容",
      //             creditAmount: "示例内容", // 贷方发生额
      //             cumulativeCreditAmount: "示例内容",
      //             foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //             foreignCurrencyCumulativeCreditAmount: "示例内容",
      //             debitBalanceAtPeriodEnd: "示例内容",
      //             creditBalanceAtPeriodEnd: "示例内容",
      //             balanceDirectionAtPeriodEnd: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //             entryCount: "示例内容",
      //             accountingSubjectLevel: "示例内容",
      //             isLowestLevelSubject: "示例内容",
      //             parentSubjectCode: "示例内容",
      //             isCashOrCashEquivalent: "示例内容",
      //             currencyName: "示例内容",
      //             currencyCode: "示例内容",
      //             accountingMonth: "示例内容",
      //             accountingYear: "示例内容",
      //           },
      //         ],
      //       },
      //     ],
      //   },
      //   {
      //     key: 2221,
      //     subjectCode: "2221", // 科目编码
      //     subjectName: "应交税费", // 科目名称
      //     fullSubjectName: "应交税费", // 科目全称
      //     beginningBalanceAtYearStart: "123456789", // 年初期初余额
      //     creditBalanceAtYearStart: "xxx", // 年初贷方余额
      //     balanceDirectionAtYearStart: "123456789", // 年初余额方向
      //     debitBalanceAtPeriodStart: "123456789", // 期初借方余额
      //     creditBalanceAtPeriodStart: "示例内容", // 期初贷方余额
      //     balanceDirectionAtPeriodStart: "示例内容", // 期初余额方向
      //     foreignCurrencyDebitBalanceAtYearStart: "示例内容", // 外币年初借方余额
      //     foreignCurrencyCreditBalanceAtYearStart: "示例内容", // 外币年初贷方余额
      //     foreignCurrencyDebitBalanceAtPeriodStart: "示例内容", // 外币期初借方余额
      //     foreignCurrencyCreditBalanceAtPeriodStart: "示例内容", // 外币期初贷方余额
      //     debitAmount: "示例内容",
      //     cumulativeDebitAmount: "示例内容", // 借方累计发生额
      //     foreignCurrencyDebitAmount: "示例内容",
      //     foreignCurrencyCumulativeDebitAmount: "示例内容", // 外币借方累计发生额
      //     creditAmount: "示例内容", // 贷方发生额
      //     cumulativeCreditAmount: "示例内容", // 贷方累计发生额
      //     foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //     foreignCurrencyCumulativeCreditAmount: "示例内容", // 外币贷方累计发生额
      //     debitBalanceAtPeriodEnd: "示例内容", // 期末借方余额
      //     creditBalanceAtPeriodEnd: "示例内容", // 期末贷方余额
      //     balanceDirectionAtPeriodEnd: "示例内容", // 期末余额方向
      //     foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容", // 外币期末借方余额
      //     foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容", // 外币期末贷方余额
      //     entryCount: "示例内容", // 分录数
      //     accountingSubjectLevel: "示例内容", // 会计科目级别
      //     isLowestLevelSubject: "示例内容", // 是否最底级科目
      //     parentSubjectCode: "示例内容", // 上级科目编码
      //     isCashOrCashEquivalent: "示例内容", // 是否现金或现金等价物
      //     currencyName: "示例内容", // 币种名称
      //     currencyCode: "示例内容", // 币种代码
      //     accountingMonth: "示例内容", // 会计月份
      //     accountingYear: "示例内容", // 会计年度
      //     children: [
      //       //子数组
      //       {
      //         key: 222101,
      //         subjectCode: "222101",
      //         subjectName: "应交增值税",
      //         fullSubjectName: "应交增值税",
      //         beginningBalanceAtYearStart: "123456789",
      //         creditBalanceAtYearStart: "xxx",
      //         balanceDirectionAtYearStart: "123456789",
      //         debitBalanceAtPeriodStart: "123456789",
      //         creditBalanceAtPeriodStart: "示例内容",
      //         balanceDirectionAtPeriodStart: "示例内容",
      //         foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //         foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //         foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //         foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //         debitAmount: "示例内容",
      //         cumulativeDebitAmount: "示例内容",
      //         foreignCurrencyDebitAmount: "示例内容",
      //         foreignCurrencyCumulativeDebitAmount: "示例内容",
      //         creditAmount: "示例内容", // 贷方发生额
      //         cumulativeCreditAmount: "示例内容",
      //         foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //         foreignCurrencyCumulativeCreditAmount: "示例内容",
      //         debitBalanceAtPeriodEnd: "示例内容",
      //         creditBalanceAtPeriodEnd: "示例内容",
      //         balanceDirectionAtPeriodEnd: "示例内容",
      //         foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //         foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //         entryCount: "示例内容",
      //         accountingSubjectLevel: "示例内容",
      //         isLowestLevelSubject: "示例内容",
      //         parentSubjectCode: "示例内容",
      //         isCashOrCashEquivalent: "示例内容",
      //         currencyName: "示例内容",
      //         currencyCode: "示例内容",
      //         accountingMonth: "示例内容",
      //         accountingYear: "示例内容",
      //         children: [
      //           //子数组
      //           {
      //             key: 22210101,
      //             subjectCode: "22210101",
      //             subjectName: "进项税额",
      //             fullSubjectName: "进项税额",
      //             beginningBalanceAtYearStart: "123456789",
      //             creditBalanceAtYearStart: "xxx",
      //             balanceDirectionAtYearStart: "123456789",
      //             debitBalanceAtPeriodStart: "123456789",
      //             creditBalanceAtPeriodStart: "示例内容",
      //             balanceDirectionAtPeriodStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //             debitAmount: "示例内容",
      //             cumulativeDebitAmount: "示例内容",
      //             foreignCurrencyDebitAmount: "示例内容",
      //             foreignCurrencyCumulativeDebitAmount: "示例内容",
      //             creditAmount: "示例内容", // 贷方发生额
      //             cumulativeCreditAmount: "示例内容",
      //             foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //             foreignCurrencyCumulativeCreditAmount: "示例内容",
      //             debitBalanceAtPeriodEnd: "示例内容",
      //             creditBalanceAtPeriodEnd: "示例内容",
      //             balanceDirectionAtPeriodEnd: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //             entryCount: "示例内容",
      //             accountingSubjectLevel: "示例内容",
      //             isLowestLevelSubject: "示例内容",
      //             parentSubjectCode: "示例内容",
      //             isCashOrCashEquivalent: "示例内容",
      //             currencyName: "示例内容",
      //             currencyCode: "示例内容",
      //             accountingMonth: "示例内容",
      //             accountingYear: "示例内容",
      //           },
      //           {
      //             key: 22210102,
      //             subjectCode: "22210102",
      //             subjectName: "销项税额抵减",
      //             fullSubjectName: "销项税额抵减",
      //             beginningBalanceAtYearStart: "123456789",
      //             creditBalanceAtYearStart: "xxx",
      //             balanceDirectionAtYearStart: "123456789",
      //             debitBalanceAtPeriodStart: "123456789",
      //             creditBalanceAtPeriodStart: "示例内容",
      //             balanceDirectionAtPeriodStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //             debitAmount: "示例内容",
      //             cumulativeDebitAmount: "示例内容",
      //             foreignCurrencyDebitAmount: "示例内容",
      //             foreignCurrencyCumulativeDebitAmount: "示例内容",
      //             creditAmount: "示例内容", // 贷方发生额
      //             cumulativeCreditAmount: "示例内容",
      //             foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //             foreignCurrencyCumulativeCreditAmount: "示例内容",
      //             debitBalanceAtPeriodEnd: "示例内容",
      //             creditBalanceAtPeriodEnd: "示例内容",
      //             balanceDirectionAtPeriodEnd: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //             entryCount: "示例内容",
      //             accountingSubjectLevel: "示例内容",
      //             isLowestLevelSubject: "示例内容",
      //             parentSubjectCode: "示例内容",
      //             isCashOrCashEquivalent: "示例内容",
      //             currencyName: "示例内容",
      //             currencyCode: "示例内容",
      //             accountingMonth: "示例内容",
      //             accountingYear: "示例内容",
      //           },
      //         ],
      //       },
      //     ],
      //   },
      //   {
      //     key: 2221,
      //     subjectCode: "2221", // 科目编码
      //     subjectName: "应交税费", // 科目名称
      //     fullSubjectName: "应交税费", // 科目全称
      //     beginningBalanceAtYearStart: "123456789", // 年初期初余额
      //     creditBalanceAtYearStart: "xxx", // 年初贷方余额
      //     balanceDirectionAtYearStart: "123456789", // 年初余额方向
      //     debitBalanceAtPeriodStart: "123456789", // 期初借方余额
      //     creditBalanceAtPeriodStart: "示例内容", // 期初贷方余额
      //     balanceDirectionAtPeriodStart: "示例内容", // 期初余额方向
      //     foreignCurrencyDebitBalanceAtYearStart: "示例内容", // 外币年初借方余额
      //     foreignCurrencyCreditBalanceAtYearStart: "示例内容", // 外币年初贷方余额
      //     foreignCurrencyDebitBalanceAtPeriodStart: "示例内容", // 外币期初借方余额
      //     foreignCurrencyCreditBalanceAtPeriodStart: "示例内容", // 外币期初贷方余额
      //     debitAmount: "示例内容",
      //     cumulativeDebitAmount: "示例内容", // 借方累计发生额
      //     foreignCurrencyDebitAmount: "示例内容",
      //     foreignCurrencyCumulativeDebitAmount: "示例内容", // 外币借方累计发生额
      //     creditAmount: "示例内容", // 贷方发生额
      //     cumulativeCreditAmount: "示例内容", // 贷方累计发生额
      //     foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //     foreignCurrencyCumulativeCreditAmount: "示例内容", // 外币贷方累计发生额
      //     debitBalanceAtPeriodEnd: "示例内容", // 期末借方余额
      //     creditBalanceAtPeriodEnd: "示例内容", // 期末贷方余额
      //     balanceDirectionAtPeriodEnd: "示例内容", // 期末余额方向
      //     foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容", // 外币期末借方余额
      //     foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容", // 外币期末贷方余额
      //     entryCount: "示例内容", // 分录数
      //     accountingSubjectLevel: "示例内容", // 会计科目级别
      //     isLowestLevelSubject: "示例内容", // 是否最底级科目
      //     parentSubjectCode: "示例内容", // 上级科目编码
      //     isCashOrCashEquivalent: "示例内容", // 是否现金或现金等价物
      //     currencyName: "示例内容", // 币种名称
      //     currencyCode: "示例内容", // 币种代码
      //     accountingMonth: "示例内容", // 会计月份
      //     accountingYear: "示例内容", // 会计年度
      //     children: [
      //       //子数组
      //       {
      //         key: 222101,
      //         subjectCode: "222101",
      //         subjectName: "应交增值税",
      //         fullSubjectName: "应交增值税",
      //         beginningBalanceAtYearStart: "123456789",
      //         creditBalanceAtYearStart: "xxx",
      //         balanceDirectionAtYearStart: "123456789",
      //         debitBalanceAtPeriodStart: "123456789",
      //         creditBalanceAtPeriodStart: "示例内容",
      //         balanceDirectionAtPeriodStart: "示例内容",
      //         foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //         foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //         foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //         foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //         debitAmount: "示例内容",
      //         cumulativeDebitAmount: "示例内容",
      //         foreignCurrencyDebitAmount: "示例内容",
      //         foreignCurrencyCumulativeDebitAmount: "示例内容",
      //         creditAmount: "示例内容", // 贷方发生额
      //         cumulativeCreditAmount: "示例内容",
      //         foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //         foreignCurrencyCumulativeCreditAmount: "示例内容",
      //         debitBalanceAtPeriodEnd: "示例内容",
      //         creditBalanceAtPeriodEnd: "示例内容",
      //         balanceDirectionAtPeriodEnd: "示例内容",
      //         foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //         foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //         entryCount: "示例内容",
      //         accountingSubjectLevel: "示例内容",
      //         isLowestLevelSubject: "示例内容",
      //         parentSubjectCode: "示例内容",
      //         isCashOrCashEquivalent: "示例内容",
      //         currencyName: "示例内容",
      //         currencyCode: "示例内容",
      //         accountingMonth: "示例内容",
      //         accountingYear: "示例内容",
      //         children: [
      //           //子数组
      //           {
      //             key: 22210101,
      //             subjectCode: "22210101",
      //             subjectName: "进项税额",
      //             fullSubjectName: "进项税额",
      //             beginningBalanceAtYearStart: "123456789",
      //             creditBalanceAtYearStart: "xxx",
      //             balanceDirectionAtYearStart: "123456789",
      //             debitBalanceAtPeriodStart: "123456789",
      //             creditBalanceAtPeriodStart: "示例内容",
      //             balanceDirectionAtPeriodStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //             debitAmount: "示例内容",
      //             cumulativeDebitAmount: "示例内容",
      //             foreignCurrencyDebitAmount: "示例内容",
      //             foreignCurrencyCumulativeDebitAmount: "示例内容",
      //             creditAmount: "示例内容", // 贷方发生额
      //             cumulativeCreditAmount: "示例内容",
      //             foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //             foreignCurrencyCumulativeCreditAmount: "示例内容",
      //             debitBalanceAtPeriodEnd: "示例内容",
      //             creditBalanceAtPeriodEnd: "示例内容",
      //             balanceDirectionAtPeriodEnd: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //             entryCount: "示例内容",
      //             accountingSubjectLevel: "示例内容",
      //             isLowestLevelSubject: "示例内容",
      //             parentSubjectCode: "示例内容",
      //             isCashOrCashEquivalent: "示例内容",
      //             currencyName: "示例内容",
      //             currencyCode: "示例内容",
      //             accountingMonth: "示例内容",
      //             accountingYear: "示例内容",
      //           },
      //           {
      //             key: 22210102,
      //             subjectCode: "22210102",
      //             subjectName: "销项税额抵减",
      //             fullSubjectName: "销项税额抵减",
      //             beginningBalanceAtYearStart: "123456789",
      //             creditBalanceAtYearStart: "xxx",
      //             balanceDirectionAtYearStart: "123456789",
      //             debitBalanceAtPeriodStart: "123456789",
      //             creditBalanceAtPeriodStart: "示例内容",
      //             balanceDirectionAtPeriodStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //             debitAmount: "示例内容",
      //             cumulativeDebitAmount: "示例内容",
      //             foreignCurrencyDebitAmount: "示例内容",
      //             foreignCurrencyCumulativeDebitAmount: "示例内容",
      //             creditAmount: "示例内容", // 贷方发生额
      //             cumulativeCreditAmount: "示例内容",
      //             foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //             foreignCurrencyCumulativeCreditAmount: "示例内容",
      //             debitBalanceAtPeriodEnd: "示例内容",
      //             creditBalanceAtPeriodEnd: "示例内容",
      //             balanceDirectionAtPeriodEnd: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //             entryCount: "示例内容",
      //             accountingSubjectLevel: "示例内容",
      //             isLowestLevelSubject: "示例内容",
      //             parentSubjectCode: "示例内容",
      //             isCashOrCashEquivalent: "示例内容",
      //             currencyName: "示例内容",
      //             currencyCode: "示例内容",
      //             accountingMonth: "示例内容",
      //             accountingYear: "示例内容",
      //           },
      //         ],
      //       },
      //     ],
      //   },
      //   {
      //     key: 2221,
      //     subjectCode: "2221", // 科目编码
      //     subjectName: "应交税费", // 科目名称
      //     fullSubjectName: "应交税费", // 科目全称
      //     beginningBalanceAtYearStart: "123456789", // 年初期初余额
      //     creditBalanceAtYearStart: "xxx", // 年初贷方余额
      //     balanceDirectionAtYearStart: "123456789", // 年初余额方向
      //     debitBalanceAtPeriodStart: "123456789", // 期初借方余额
      //     creditBalanceAtPeriodStart: "示例内容", // 期初贷方余额
      //     balanceDirectionAtPeriodStart: "示例内容", // 期初余额方向
      //     foreignCurrencyDebitBalanceAtYearStart: "示例内容", // 外币年初借方余额
      //     foreignCurrencyCreditBalanceAtYearStart: "示例内容", // 外币年初贷方余额
      //     foreignCurrencyDebitBalanceAtPeriodStart: "示例内容", // 外币期初借方余额
      //     foreignCurrencyCreditBalanceAtPeriodStart: "示例内容", // 外币期初贷方余额
      //     debitAmount: "示例内容",
      //     cumulativeDebitAmount: "示例内容", // 借方累计发生额
      //     foreignCurrencyDebitAmount: "示例内容",
      //     foreignCurrencyCumulativeDebitAmount: "示例内容", // 外币借方累计发生额
      //     creditAmount: "示例内容", // 贷方发生额
      //     cumulativeCreditAmount: "示例内容", // 贷方累计发生额
      //     foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //     foreignCurrencyCumulativeCreditAmount: "示例内容", // 外币贷方累计发生额
      //     debitBalanceAtPeriodEnd: "示例内容", // 期末借方余额
      //     creditBalanceAtPeriodEnd: "示例内容", // 期末贷方余额
      //     balanceDirectionAtPeriodEnd: "示例内容", // 期末余额方向
      //     foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容", // 外币期末借方余额
      //     foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容", // 外币期末贷方余额
      //     entryCount: "示例内容", // 分录数
      //     accountingSubjectLevel: "示例内容", // 会计科目级别
      //     isLowestLevelSubject: "示例内容", // 是否最底级科目
      //     parentSubjectCode: "示例内容", // 上级科目编码
      //     isCashOrCashEquivalent: "示例内容", // 是否现金或现金等价物
      //     currencyName: "示例内容", // 币种名称
      //     currencyCode: "示例内容", // 币种代码
      //     accountingMonth: "示例内容", // 会计月份
      //     accountingYear: "示例内容", // 会计年度
      //     children: [
      //       //子数组
      //       {
      //         key: 222101,
      //         subjectCode: "222101",
      //         subjectName: "应交增值税",
      //         fullSubjectName: "应交增值税",
      //         beginningBalanceAtYearStart: "123456789",
      //         creditBalanceAtYearStart: "xxx",
      //         balanceDirectionAtYearStart: "123456789",
      //         debitBalanceAtPeriodStart: "123456789",
      //         creditBalanceAtPeriodStart: "示例内容",
      //         balanceDirectionAtPeriodStart: "示例内容",
      //         foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //         foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //         foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //         foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //         debitAmount: "示例内容",
      //         cumulativeDebitAmount: "示例内容",
      //         foreignCurrencyDebitAmount: "示例内容",
      //         foreignCurrencyCumulativeDebitAmount: "示例内容",
      //         creditAmount: "示例内容", // 贷方发生额
      //         cumulativeCreditAmount: "示例内容",
      //         foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //         foreignCurrencyCumulativeCreditAmount: "示例内容",
      //         debitBalanceAtPeriodEnd: "示例内容",
      //         creditBalanceAtPeriodEnd: "示例内容",
      //         balanceDirectionAtPeriodEnd: "示例内容",
      //         foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //         foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //         entryCount: "示例内容",
      //         accountingSubjectLevel: "示例内容",
      //         isLowestLevelSubject: "示例内容",
      //         parentSubjectCode: "示例内容",
      //         isCashOrCashEquivalent: "示例内容",
      //         currencyName: "示例内容",
      //         currencyCode: "示例内容",
      //         accountingMonth: "示例内容",
      //         accountingYear: "示例内容",
      //         children: [
      //           //子数组
      //           {
      //             key: 22210101,
      //             subjectCode: "22210101",
      //             subjectName: "进项税额",
      //             fullSubjectName: "进项税额",
      //             beginningBalanceAtYearStart: "123456789",
      //             creditBalanceAtYearStart: "xxx",
      //             balanceDirectionAtYearStart: "123456789",
      //             debitBalanceAtPeriodStart: "123456789",
      //             creditBalanceAtPeriodStart: "示例内容",
      //             balanceDirectionAtPeriodStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //             debitAmount: "示例内容",
      //             cumulativeDebitAmount: "示例内容",
      //             foreignCurrencyDebitAmount: "示例内容",
      //             foreignCurrencyCumulativeDebitAmount: "示例内容",
      //             creditAmount: "示例内容", // 贷方发生额
      //             cumulativeCreditAmount: "示例内容",
      //             foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //             foreignCurrencyCumulativeCreditAmount: "示例内容",
      //             debitBalanceAtPeriodEnd: "示例内容",
      //             creditBalanceAtPeriodEnd: "示例内容",
      //             balanceDirectionAtPeriodEnd: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //             entryCount: "示例内容",
      //             accountingSubjectLevel: "示例内容",
      //             isLowestLevelSubject: "示例内容",
      //             parentSubjectCode: "示例内容",
      //             isCashOrCashEquivalent: "示例内容",
      //             currencyName: "示例内容",
      //             currencyCode: "示例内容",
      //             accountingMonth: "示例内容",
      //             accountingYear: "示例内容",
      //           },
      //           {
      //             key: 22210102,
      //             subjectCode: "22210102",
      //             subjectName: "销项税额抵减",
      //             fullSubjectName: "销项税额抵减",
      //             beginningBalanceAtYearStart: "123456789",
      //             creditBalanceAtYearStart: "xxx",
      //             balanceDirectionAtYearStart: "123456789",
      //             debitBalanceAtPeriodStart: "123456789",
      //             creditBalanceAtPeriodStart: "示例内容",
      //             balanceDirectionAtPeriodStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //             debitAmount: "示例内容",
      //             cumulativeDebitAmount: "示例内容",
      //             foreignCurrencyDebitAmount: "示例内容",
      //             foreignCurrencyCumulativeDebitAmount: "示例内容",
      //             creditAmount: "示例内容", // 贷方发生额
      //             cumulativeCreditAmount: "示例内容",
      //             foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //             foreignCurrencyCumulativeCreditAmount: "示例内容",
      //             debitBalanceAtPeriodEnd: "示例内容",
      //             creditBalanceAtPeriodEnd: "示例内容",
      //             balanceDirectionAtPeriodEnd: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //             entryCount: "示例内容",
      //             accountingSubjectLevel: "示例内容",
      //             isLowestLevelSubject: "示例内容",
      //             parentSubjectCode: "示例内容",
      //             isCashOrCashEquivalent: "示例内容",
      //             currencyName: "示例内容",
      //             currencyCode: "示例内容",
      //             accountingMonth: "示例内容",
      //             accountingYear: "示例内容",
      //           },
      //         ],
      //       },
      //     ],
      //   },
      //   {
      //     key: 2221,
      //     subjectCode: "2221", // 科目编码
      //     subjectName: "应交税费", // 科目名称
      //     fullSubjectName: "应交税费", // 科目全称
      //     beginningBalanceAtYearStart: "123456789", // 年初期初余额
      //     creditBalanceAtYearStart: "xxx", // 年初贷方余额
      //     balanceDirectionAtYearStart: "123456789", // 年初余额方向
      //     debitBalanceAtPeriodStart: "123456789", // 期初借方余额
      //     creditBalanceAtPeriodStart: "示例内容", // 期初贷方余额
      //     balanceDirectionAtPeriodStart: "示例内容", // 期初余额方向
      //     foreignCurrencyDebitBalanceAtYearStart: "示例内容", // 外币年初借方余额
      //     foreignCurrencyCreditBalanceAtYearStart: "示例内容", // 外币年初贷方余额
      //     foreignCurrencyDebitBalanceAtPeriodStart: "示例内容", // 外币期初借方余额
      //     foreignCurrencyCreditBalanceAtPeriodStart: "示例内容", // 外币期初贷方余额
      //     debitAmount: "示例内容",
      //     cumulativeDebitAmount: "示例内容", // 借方累计发生额
      //     foreignCurrencyDebitAmount: "示例内容",
      //     foreignCurrencyCumulativeDebitAmount: "示例内容", // 外币借方累计发生额
      //     creditAmount: "示例内容", // 贷方发生额
      //     cumulativeCreditAmount: "示例内容", // 贷方累计发生额
      //     foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //     foreignCurrencyCumulativeCreditAmount: "示例内容", // 外币贷方累计发生额
      //     debitBalanceAtPeriodEnd: "示例内容", // 期末借方余额
      //     creditBalanceAtPeriodEnd: "示例内容", // 期末贷方余额
      //     balanceDirectionAtPeriodEnd: "示例内容", // 期末余额方向
      //     foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容", // 外币期末借方余额
      //     foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容", // 外币期末贷方余额
      //     entryCount: "示例内容", // 分录数
      //     accountingSubjectLevel: "示例内容", // 会计科目级别
      //     isLowestLevelSubject: "示例内容", // 是否最底级科目
      //     parentSubjectCode: "示例内容", // 上级科目编码
      //     isCashOrCashEquivalent: "示例内容", // 是否现金或现金等价物
      //     currencyName: "示例内容", // 币种名称
      //     currencyCode: "示例内容", // 币种代码
      //     accountingMonth: "示例内容", // 会计月份
      //     accountingYear: "示例内容", // 会计年度
      //     children: [
      //       //子数组
      //       {
      //         key: 222101,
      //         subjectCode: "222101",
      //         subjectName: "应交增值税",
      //         fullSubjectName: "应交增值税",
      //         beginningBalanceAtYearStart: "123456789",
      //         creditBalanceAtYearStart: "xxx",
      //         balanceDirectionAtYearStart: "123456789",
      //         debitBalanceAtPeriodStart: "123456789",
      //         creditBalanceAtPeriodStart: "示例内容",
      //         balanceDirectionAtPeriodStart: "示例内容",
      //         foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //         foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //         foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //         foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //         debitAmount: "示例内容",
      //         cumulativeDebitAmount: "示例内容",
      //         foreignCurrencyDebitAmount: "示例内容",
      //         foreignCurrencyCumulativeDebitAmount: "示例内容",
      //         creditAmount: "示例内容", // 贷方发生额
      //         cumulativeCreditAmount: "示例内容",
      //         foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //         foreignCurrencyCumulativeCreditAmount: "示例内容",
      //         debitBalanceAtPeriodEnd: "示例内容",
      //         creditBalanceAtPeriodEnd: "示例内容",
      //         balanceDirectionAtPeriodEnd: "示例内容",
      //         foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //         foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //         entryCount: "示例内容",
      //         accountingSubjectLevel: "示例内容",
      //         isLowestLevelSubject: "示例内容",
      //         parentSubjectCode: "示例内容",
      //         isCashOrCashEquivalent: "示例内容",
      //         currencyName: "示例内容",
      //         currencyCode: "示例内容",
      //         accountingMonth: "示例内容",
      //         accountingYear: "示例内容",
      //         children: [
      //           //子数组
      //           {
      //             key: 22210101,
      //             subjectCode: "22210101",
      //             subjectName: "进项税额",
      //             fullSubjectName: "进项税额",
      //             beginningBalanceAtYearStart: "123456789",
      //             creditBalanceAtYearStart: "xxx",
      //             balanceDirectionAtYearStart: "123456789",
      //             debitBalanceAtPeriodStart: "123456789",
      //             creditBalanceAtPeriodStart: "示例内容",
      //             balanceDirectionAtPeriodStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //             debitAmount: "示例内容",
      //             cumulativeDebitAmount: "示例内容",
      //             foreignCurrencyDebitAmount: "示例内容",
      //             foreignCurrencyCumulativeDebitAmount: "示例内容",
      //             creditAmount: "示例内容", // 贷方发生额
      //             cumulativeCreditAmount: "示例内容",
      //             foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //             foreignCurrencyCumulativeCreditAmount: "示例内容",
      //             debitBalanceAtPeriodEnd: "示例内容",
      //             creditBalanceAtPeriodEnd: "示例内容",
      //             balanceDirectionAtPeriodEnd: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //             entryCount: "示例内容",
      //             accountingSubjectLevel: "示例内容",
      //             isLowestLevelSubject: "示例内容",
      //             parentSubjectCode: "示例内容",
      //             isCashOrCashEquivalent: "示例内容",
      //             currencyName: "示例内容",
      //             currencyCode: "示例内容",
      //             accountingMonth: "示例内容",
      //             accountingYear: "示例内容",
      //           },
      //           {
      //             key: 22210102,
      //             subjectCode: "22210102",
      //             subjectName: "销项税额抵减",
      //             fullSubjectName: "销项税额抵减",
      //             beginningBalanceAtYearStart: "123456789",
      //             creditBalanceAtYearStart: "xxx",
      //             balanceDirectionAtYearStart: "123456789",
      //             debitBalanceAtPeriodStart: "123456789",
      //             creditBalanceAtPeriodStart: "示例内容",
      //             balanceDirectionAtPeriodStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //             debitAmount: "示例内容",
      //             cumulativeDebitAmount: "示例内容",
      //             foreignCurrencyDebitAmount: "示例内容",
      //             foreignCurrencyCumulativeDebitAmount: "示例内容",
      //             creditAmount: "示例内容", // 贷方发生额
      //             cumulativeCreditAmount: "示例内容",
      //             foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //             foreignCurrencyCumulativeCreditAmount: "示例内容",
      //             debitBalanceAtPeriodEnd: "示例内容",
      //             creditBalanceAtPeriodEnd: "示例内容",
      //             balanceDirectionAtPeriodEnd: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //             entryCount: "示例内容",
      //             accountingSubjectLevel: "示例内容",
      //             isLowestLevelSubject: "示例内容",
      //             parentSubjectCode: "示例内容",
      //             isCashOrCashEquivalent: "示例内容",
      //             currencyName: "示例内容",
      //             currencyCode: "示例内容",
      //             accountingMonth: "示例内容",
      //             accountingYear: "示例内容",
      //           },
      //         ],
      //       },
      //     ],
      //   },
      //   {
      //     key: 2221,
      //     subjectCode: "2221", // 科目编码
      //     subjectName: "应交税费", // 科目名称
      //     fullSubjectName: "应交税费", // 科目全称
      //     beginningBalanceAtYearStart: "123456789", // 年初期初余额
      //     creditBalanceAtYearStart: "xxx", // 年初贷方余额
      //     balanceDirectionAtYearStart: "123456789", // 年初余额方向
      //     debitBalanceAtPeriodStart: "123456789", // 期初借方余额
      //     creditBalanceAtPeriodStart: "示例内容", // 期初贷方余额
      //     balanceDirectionAtPeriodStart: "示例内容", // 期初余额方向
      //     foreignCurrencyDebitBalanceAtYearStart: "示例内容", // 外币年初借方余额
      //     foreignCurrencyCreditBalanceAtYearStart: "示例内容", // 外币年初贷方余额
      //     foreignCurrencyDebitBalanceAtPeriodStart: "示例内容", // 外币期初借方余额
      //     foreignCurrencyCreditBalanceAtPeriodStart: "示例内容", // 外币期初贷方余额
      //     debitAmount: "示例内容",
      //     cumulativeDebitAmount: "示例内容", // 借方累计发生额
      //     foreignCurrencyDebitAmount: "示例内容",
      //     foreignCurrencyCumulativeDebitAmount: "示例内容", // 外币借方累计发生额
      //     creditAmount: "示例内容", // 贷方发生额
      //     cumulativeCreditAmount: "示例内容", // 贷方累计发生额
      //     foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //     foreignCurrencyCumulativeCreditAmount: "示例内容", // 外币贷方累计发生额
      //     debitBalanceAtPeriodEnd: "示例内容", // 期末借方余额
      //     creditBalanceAtPeriodEnd: "示例内容", // 期末贷方余额
      //     balanceDirectionAtPeriodEnd: "示例内容", // 期末余额方向
      //     foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容", // 外币期末借方余额
      //     foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容", // 外币期末贷方余额
      //     entryCount: "示例内容", // 分录数
      //     accountingSubjectLevel: "示例内容", // 会计科目级别
      //     isLowestLevelSubject: "示例内容", // 是否最底级科目
      //     parentSubjectCode: "示例内容", // 上级科目编码
      //     isCashOrCashEquivalent: "示例内容", // 是否现金或现金等价物
      //     currencyName: "示例内容", // 币种名称
      //     currencyCode: "示例内容", // 币种代码
      //     accountingMonth: "示例内容", // 会计月份
      //     accountingYear: "示例内容", // 会计年度
      //     children: [
      //       //子数组
      //       {
      //         key: 222101,
      //         subjectCode: "222101",
      //         subjectName: "应交增值税",
      //         fullSubjectName: "应交增值税",
      //         beginningBalanceAtYearStart: "123456789",
      //         creditBalanceAtYearStart: "xxx",
      //         balanceDirectionAtYearStart: "123456789",
      //         debitBalanceAtPeriodStart: "123456789",
      //         creditBalanceAtPeriodStart: "示例内容",
      //         balanceDirectionAtPeriodStart: "示例内容",
      //         foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //         foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //         foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //         foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //         debitAmount: "示例内容",
      //         cumulativeDebitAmount: "示例内容",
      //         foreignCurrencyDebitAmount: "示例内容",
      //         foreignCurrencyCumulativeDebitAmount: "示例内容",
      //         creditAmount: "示例内容", // 贷方发生额
      //         cumulativeCreditAmount: "示例内容",
      //         foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //         foreignCurrencyCumulativeCreditAmount: "示例内容",
      //         debitBalanceAtPeriodEnd: "示例内容",
      //         creditBalanceAtPeriodEnd: "示例内容",
      //         balanceDirectionAtPeriodEnd: "示例内容",
      //         foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //         foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //         entryCount: "示例内容",
      //         accountingSubjectLevel: "示例内容",
      //         isLowestLevelSubject: "示例内容",
      //         parentSubjectCode: "示例内容",
      //         isCashOrCashEquivalent: "示例内容",
      //         currencyName: "示例内容",
      //         currencyCode: "示例内容",
      //         accountingMonth: "示例内容",
      //         accountingYear: "示例内容",
      //         children: [
      //           //子数组
      //           {
      //             key: 22210101,
      //             subjectCode: "22210101",
      //             subjectName: "进项税额",
      //             fullSubjectName: "进项税额",
      //             beginningBalanceAtYearStart: "123456789",
      //             creditBalanceAtYearStart: "xxx",
      //             balanceDirectionAtYearStart: "123456789",
      //             debitBalanceAtPeriodStart: "123456789",
      //             creditBalanceAtPeriodStart: "示例内容",
      //             balanceDirectionAtPeriodStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //             debitAmount: "示例内容",
      //             cumulativeDebitAmount: "示例内容",
      //             foreignCurrencyDebitAmount: "示例内容",
      //             foreignCurrencyCumulativeDebitAmount: "示例内容",
      //             creditAmount: "示例内容", // 贷方发生额
      //             cumulativeCreditAmount: "示例内容",
      //             foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //             foreignCurrencyCumulativeCreditAmount: "示例内容",
      //             debitBalanceAtPeriodEnd: "示例内容",
      //             creditBalanceAtPeriodEnd: "示例内容",
      //             balanceDirectionAtPeriodEnd: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //             entryCount: "示例内容",
      //             accountingSubjectLevel: "示例内容",
      //             isLowestLevelSubject: "示例内容",
      //             parentSubjectCode: "示例内容",
      //             isCashOrCashEquivalent: "示例内容",
      //             currencyName: "示例内容",
      //             currencyCode: "示例内容",
      //             accountingMonth: "示例内容",
      //             accountingYear: "示例内容",
      //           },
      //           {
      //             key: 22210102,
      //             subjectCode: "22210102",
      //             subjectName: "销项税额抵减",
      //             fullSubjectName: "销项税额抵减",
      //             beginningBalanceAtYearStart: "123456789",
      //             creditBalanceAtYearStart: "xxx",
      //             balanceDirectionAtYearStart: "123456789",
      //             debitBalanceAtPeriodStart: "123456789",
      //             creditBalanceAtPeriodStart: "示例内容",
      //             balanceDirectionAtPeriodStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //             debitAmount: "示例内容",
      //             cumulativeDebitAmount: "示例内容",
      //             foreignCurrencyDebitAmount: "示例内容",
      //             foreignCurrencyCumulativeDebitAmount: "示例内容",
      //             creditAmount: "示例内容", // 贷方发生额
      //             cumulativeCreditAmount: "示例内容",
      //             foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //             foreignCurrencyCumulativeCreditAmount: "示例内容",
      //             debitBalanceAtPeriodEnd: "示例内容",
      //             creditBalanceAtPeriodEnd: "示例内容",
      //             balanceDirectionAtPeriodEnd: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //             entryCount: "示例内容",
      //             accountingSubjectLevel: "示例内容",
      //             isLowestLevelSubject: "示例内容",
      //             parentSubjectCode: "示例内容",
      //             isCashOrCashEquivalent: "示例内容",
      //             currencyName: "示例内容",
      //             currencyCode: "示例内容",
      //             accountingMonth: "示例内容",
      //             accountingYear: "示例内容",
      //           },
      //         ],
      //       },
      //     ],
      //   },
      //   {
      //     key: 2221,
      //     subjectCode: "2221", // 科目编码
      //     subjectName: "应交税费", // 科目名称
      //     fullSubjectName: "应交税费", // 科目全称
      //     beginningBalanceAtYearStart: "123456789", // 年初期初余额
      //     creditBalanceAtYearStart: "xxx", // 年初贷方余额
      //     balanceDirectionAtYearStart: "123456789", // 年初余额方向
      //     debitBalanceAtPeriodStart: "123456789", // 期初借方余额
      //     creditBalanceAtPeriodStart: "示例内容", // 期初贷方余额
      //     balanceDirectionAtPeriodStart: "示例内容", // 期初余额方向
      //     foreignCurrencyDebitBalanceAtYearStart: "示例内容", // 外币年初借方余额
      //     foreignCurrencyCreditBalanceAtYearStart: "示例内容", // 外币年初贷方余额
      //     foreignCurrencyDebitBalanceAtPeriodStart: "示例内容", // 外币期初借方余额
      //     foreignCurrencyCreditBalanceAtPeriodStart: "示例内容", // 外币期初贷方余额
      //     debitAmount: "示例内容",
      //     cumulativeDebitAmount: "示例内容", // 借方累计发生额
      //     foreignCurrencyDebitAmount: "示例内容",
      //     foreignCurrencyCumulativeDebitAmount: "示例内容", // 外币借方累计发生额
      //     creditAmount: "示例内容", // 贷方发生额
      //     cumulativeCreditAmount: "示例内容", // 贷方累计发生额
      //     foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //     foreignCurrencyCumulativeCreditAmount: "示例内容", // 外币贷方累计发生额
      //     debitBalanceAtPeriodEnd: "示例内容", // 期末借方余额
      //     creditBalanceAtPeriodEnd: "示例内容", // 期末贷方余额
      //     balanceDirectionAtPeriodEnd: "示例内容", // 期末余额方向
      //     foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容", // 外币期末借方余额
      //     foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容", // 外币期末贷方余额
      //     entryCount: "示例内容", // 分录数
      //     accountingSubjectLevel: "示例内容", // 会计科目级别
      //     isLowestLevelSubject: "示例内容", // 是否最底级科目
      //     parentSubjectCode: "示例内容", // 上级科目编码
      //     isCashOrCashEquivalent: "示例内容", // 是否现金或现金等价物
      //     currencyName: "示例内容", // 币种名称
      //     currencyCode: "示例内容", // 币种代码
      //     accountingMonth: "示例内容", // 会计月份
      //     accountingYear: "示例内容", // 会计年度
      //     children: [
      //       //子数组
      //       {
      //         key: 222101,
      //         subjectCode: "222101",
      //         subjectName: "应交增值税",
      //         fullSubjectName: "应交增值税",
      //         beginningBalanceAtYearStart: "123456789",
      //         creditBalanceAtYearStart: "xxx",
      //         balanceDirectionAtYearStart: "123456789",
      //         debitBalanceAtPeriodStart: "123456789",
      //         creditBalanceAtPeriodStart: "示例内容",
      //         balanceDirectionAtPeriodStart: "示例内容",
      //         foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //         foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //         foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //         foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //         debitAmount: "示例内容",
      //         cumulativeDebitAmount: "示例内容",
      //         foreignCurrencyDebitAmount: "示例内容",
      //         foreignCurrencyCumulativeDebitAmount: "示例内容",
      //         creditAmount: "示例内容", // 贷方发生额
      //         cumulativeCreditAmount: "示例内容",
      //         foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //         foreignCurrencyCumulativeCreditAmount: "示例内容",
      //         debitBalanceAtPeriodEnd: "示例内容",
      //         creditBalanceAtPeriodEnd: "示例内容",
      //         balanceDirectionAtPeriodEnd: "示例内容",
      //         foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //         foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //         entryCount: "示例内容",
      //         accountingSubjectLevel: "示例内容",
      //         isLowestLevelSubject: "示例内容",
      //         parentSubjectCode: "示例内容",
      //         isCashOrCashEquivalent: "示例内容",
      //         currencyName: "示例内容",
      //         currencyCode: "示例内容",
      //         accountingMonth: "示例内容",
      //         accountingYear: "示例内容",
      //         children: [
      //           //子数组
      //           {
      //             key: 22210101,
      //             subjectCode: "22210101",
      //             subjectName: "进项税额",
      //             fullSubjectName: "进项税额",
      //             beginningBalanceAtYearStart: "123456789",
      //             creditBalanceAtYearStart: "xxx",
      //             balanceDirectionAtYearStart: "123456789",
      //             debitBalanceAtPeriodStart: "123456789",
      //             creditBalanceAtPeriodStart: "示例内容",
      //             balanceDirectionAtPeriodStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //             debitAmount: "示例内容",
      //             cumulativeDebitAmount: "示例内容",
      //             foreignCurrencyDebitAmount: "示例内容",
      //             foreignCurrencyCumulativeDebitAmount: "示例内容",
      //             creditAmount: "示例内容", // 贷方发生额
      //             cumulativeCreditAmount: "示例内容",
      //             foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //             foreignCurrencyCumulativeCreditAmount: "示例内容",
      //             debitBalanceAtPeriodEnd: "示例内容",
      //             creditBalanceAtPeriodEnd: "示例内容",
      //             balanceDirectionAtPeriodEnd: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //             entryCount: "示例内容",
      //             accountingSubjectLevel: "示例内容",
      //             isLowestLevelSubject: "示例内容",
      //             parentSubjectCode: "示例内容",
      //             isCashOrCashEquivalent: "示例内容",
      //             currencyName: "示例内容",
      //             currencyCode: "示例内容",
      //             accountingMonth: "示例内容",
      //             accountingYear: "示例内容",
      //           },
      //           {
      //             key: 22210102,
      //             subjectCode: "22210102",
      //             subjectName: "销项税额抵减",
      //             fullSubjectName: "销项税额抵减",
      //             beginningBalanceAtYearStart: "123456789",
      //             creditBalanceAtYearStart: "xxx",
      //             balanceDirectionAtYearStart: "123456789",
      //             debitBalanceAtPeriodStart: "123456789",
      //             creditBalanceAtPeriodStart: "示例内容",
      //             balanceDirectionAtPeriodStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //             debitAmount: "示例内容",
      //             cumulativeDebitAmount: "示例内容",
      //             foreignCurrencyDebitAmount: "示例内容",
      //             foreignCurrencyCumulativeDebitAmount: "示例内容",
      //             creditAmount: "示例内容", // 贷方发生额
      //             cumulativeCreditAmount: "示例内容",
      //             foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //             foreignCurrencyCumulativeCreditAmount: "示例内容",
      //             debitBalanceAtPeriodEnd: "示例内容",
      //             creditBalanceAtPeriodEnd: "示例内容",
      //             balanceDirectionAtPeriodEnd: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //             entryCount: "示例内容",
      //             accountingSubjectLevel: "示例内容",
      //             isLowestLevelSubject: "示例内容",
      //             parentSubjectCode: "示例内容",
      //             isCashOrCashEquivalent: "示例内容",
      //             currencyName: "示例内容",
      //             currencyCode: "示例内容",
      //             accountingMonth: "示例内容",
      //             accountingYear: "示例内容",
      //           },
      //         ],
      //       },
      //     ],
      //   },
      //   {
      //     key: 2221,
      //     subjectCode: "2221", // 科目编码
      //     subjectName: "应交税费", // 科目名称
      //     fullSubjectName: "应交税费", // 科目全称
      //     beginningBalanceAtYearStart: "123456789", // 年初期初余额
      //     creditBalanceAtYearStart: "xxx", // 年初贷方余额
      //     balanceDirectionAtYearStart: "123456789", // 年初余额方向
      //     debitBalanceAtPeriodStart: "123456789", // 期初借方余额
      //     creditBalanceAtPeriodStart: "示例内容", // 期初贷方余额
      //     balanceDirectionAtPeriodStart: "示例内容", // 期初余额方向
      //     foreignCurrencyDebitBalanceAtYearStart: "示例内容", // 外币年初借方余额
      //     foreignCurrencyCreditBalanceAtYearStart: "示例内容", // 外币年初贷方余额
      //     foreignCurrencyDebitBalanceAtPeriodStart: "示例内容", // 外币期初借方余额
      //     foreignCurrencyCreditBalanceAtPeriodStart: "示例内容", // 外币期初贷方余额
      //     debitAmount: "示例内容",
      //     cumulativeDebitAmount: "示例内容", // 借方累计发生额
      //     foreignCurrencyDebitAmount: "示例内容",
      //     foreignCurrencyCumulativeDebitAmount: "示例内容", // 外币借方累计发生额
      //     creditAmount: "示例内容", // 贷方发生额
      //     cumulativeCreditAmount: "示例内容", // 贷方累计发生额
      //     foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //     foreignCurrencyCumulativeCreditAmount: "示例内容", // 外币贷方累计发生额
      //     debitBalanceAtPeriodEnd: "示例内容", // 期末借方余额
      //     creditBalanceAtPeriodEnd: "示例内容", // 期末贷方余额
      //     balanceDirectionAtPeriodEnd: "示例内容", // 期末余额方向
      //     foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容", // 外币期末借方余额
      //     foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容", // 外币期末贷方余额
      //     entryCount: "示例内容", // 分录数
      //     accountingSubjectLevel: "示例内容", // 会计科目级别
      //     isLowestLevelSubject: "示例内容", // 是否最底级科目
      //     parentSubjectCode: "示例内容", // 上级科目编码
      //     isCashOrCashEquivalent: "示例内容", // 是否现金或现金等价物
      //     currencyName: "示例内容", // 币种名称
      //     currencyCode: "示例内容", // 币种代码
      //     accountingMonth: "示例内容", // 会计月份
      //     accountingYear: "示例内容", // 会计年度
      //     children: [
      //       //子数组
      //       {
      //         key: 222101,
      //         subjectCode: "222101",
      //         subjectName: "应交增值税",
      //         fullSubjectName: "应交增值税",
      //         beginningBalanceAtYearStart: "123456789",
      //         creditBalanceAtYearStart: "xxx",
      //         balanceDirectionAtYearStart: "123456789",
      //         debitBalanceAtPeriodStart: "123456789",
      //         creditBalanceAtPeriodStart: "示例内容",
      //         balanceDirectionAtPeriodStart: "示例内容",
      //         foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //         foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //         foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //         foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //         debitAmount: "示例内容",
      //         cumulativeDebitAmount: "示例内容",
      //         foreignCurrencyDebitAmount: "示例内容",
      //         foreignCurrencyCumulativeDebitAmount: "示例内容",
      //         creditAmount: "示例内容", // 贷方发生额
      //         cumulativeCreditAmount: "示例内容",
      //         foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //         foreignCurrencyCumulativeCreditAmount: "示例内容",
      //         debitBalanceAtPeriodEnd: "示例内容",
      //         creditBalanceAtPeriodEnd: "示例内容",
      //         balanceDirectionAtPeriodEnd: "示例内容",
      //         foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //         foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //         entryCount: "示例内容",
      //         accountingSubjectLevel: "示例内容",
      //         isLowestLevelSubject: "示例内容",
      //         parentSubjectCode: "示例内容",
      //         isCashOrCashEquivalent: "示例内容",
      //         currencyName: "示例内容",
      //         currencyCode: "示例内容",
      //         accountingMonth: "示例内容",
      //         accountingYear: "示例内容",
      //         children: [
      //           //子数组
      //           {
      //             key: 22210101,
      //             subjectCode: "22210101",
      //             subjectName: "进项税额",
      //             fullSubjectName: "进项税额",
      //             beginningBalanceAtYearStart: "123456789",
      //             creditBalanceAtYearStart: "xxx",
      //             balanceDirectionAtYearStart: "123456789",
      //             debitBalanceAtPeriodStart: "123456789",
      //             creditBalanceAtPeriodStart: "示例内容",
      //             balanceDirectionAtPeriodStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //             debitAmount: "示例内容",
      //             cumulativeDebitAmount: "示例内容",
      //             foreignCurrencyDebitAmount: "示例内容",
      //             foreignCurrencyCumulativeDebitAmount: "示例内容",
      //             creditAmount: "示例内容", // 贷方发生额
      //             cumulativeCreditAmount: "示例内容",
      //             foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //             foreignCurrencyCumulativeCreditAmount: "示例内容",
      //             debitBalanceAtPeriodEnd: "示例内容",
      //             creditBalanceAtPeriodEnd: "示例内容",
      //             balanceDirectionAtPeriodEnd: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //             entryCount: "示例内容",
      //             accountingSubjectLevel: "示例内容",
      //             isLowestLevelSubject: "示例内容",
      //             parentSubjectCode: "示例内容",
      //             isCashOrCashEquivalent: "示例内容",
      //             currencyName: "示例内容",
      //             currencyCode: "示例内容",
      //             accountingMonth: "示例内容",
      //             accountingYear: "示例内容",
      //           },
      //           {
      //             key: 22210102,
      //             subjectCode: "22210102",
      //             subjectName: "销项税额抵减",
      //             fullSubjectName: "销项税额抵减",
      //             beginningBalanceAtYearStart: "123456789",
      //             creditBalanceAtYearStart: "xxx",
      //             balanceDirectionAtYearStart: "123456789",
      //             debitBalanceAtPeriodStart: "123456789",
      //             creditBalanceAtPeriodStart: "示例内容",
      //             balanceDirectionAtPeriodStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //             debitAmount: "示例内容",
      //             cumulativeDebitAmount: "示例内容",
      //             foreignCurrencyDebitAmount: "示例内容",
      //             foreignCurrencyCumulativeDebitAmount: "示例内容",
      //             creditAmount: "示例内容", // 贷方发生额
      //             cumulativeCreditAmount: "示例内容",
      //             foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //             foreignCurrencyCumulativeCreditAmount: "示例内容",
      //             debitBalanceAtPeriodEnd: "示例内容",
      //             creditBalanceAtPeriodEnd: "示例内容",
      //             balanceDirectionAtPeriodEnd: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //             entryCount: "示例内容",
      //             accountingSubjectLevel: "示例内容",
      //             isLowestLevelSubject: "示例内容",
      //             parentSubjectCode: "示例内容",
      //             isCashOrCashEquivalent: "示例内容",
      //             currencyName: "示例内容",
      //             currencyCode: "示例内容",
      //             accountingMonth: "示例内容",
      //             accountingYear: "示例内容",
      //           },
      //         ],
      //       },
      //     ],
      //   },
      //   {
      //     key: 2221,
      //     subjectCode: "2221", // 科目编码
      //     subjectName: "应交税费", // 科目名称
      //     fullSubjectName: "应交税费", // 科目全称
      //     beginningBalanceAtYearStart: "123456789", // 年初期初余额
      //     creditBalanceAtYearStart: "xxx", // 年初贷方余额
      //     balanceDirectionAtYearStart: "123456789", // 年初余额方向
      //     debitBalanceAtPeriodStart: "123456789", // 期初借方余额
      //     creditBalanceAtPeriodStart: "示例内容", // 期初贷方余额
      //     balanceDirectionAtPeriodStart: "示例内容", // 期初余额方向
      //     foreignCurrencyDebitBalanceAtYearStart: "示例内容", // 外币年初借方余额
      //     foreignCurrencyCreditBalanceAtYearStart: "示例内容", // 外币年初贷方余额
      //     foreignCurrencyDebitBalanceAtPeriodStart: "示例内容", // 外币期初借方余额
      //     foreignCurrencyCreditBalanceAtPeriodStart: "示例内容", // 外币期初贷方余额
      //     debitAmount: "示例内容",
      //     cumulativeDebitAmount: "示例内容", // 借方累计发生额
      //     foreignCurrencyDebitAmount: "示例内容",
      //     foreignCurrencyCumulativeDebitAmount: "示例内容", // 外币借方累计发生额
      //     creditAmount: "示例内容", // 贷方发生额
      //     cumulativeCreditAmount: "示例内容", // 贷方累计发生额
      //     foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //     foreignCurrencyCumulativeCreditAmount: "示例内容", // 外币贷方累计发生额
      //     debitBalanceAtPeriodEnd: "示例内容", // 期末借方余额
      //     creditBalanceAtPeriodEnd: "示例内容", // 期末贷方余额
      //     balanceDirectionAtPeriodEnd: "示例内容", // 期末余额方向
      //     foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容", // 外币期末借方余额
      //     foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容", // 外币期末贷方余额
      //     entryCount: "示例内容", // 分录数
      //     accountingSubjectLevel: "示例内容", // 会计科目级别
      //     isLowestLevelSubject: "示例内容", // 是否最底级科目
      //     parentSubjectCode: "示例内容", // 上级科目编码
      //     isCashOrCashEquivalent: "示例内容", // 是否现金或现金等价物
      //     currencyName: "示例内容", // 币种名称
      //     currencyCode: "示例内容", // 币种代码
      //     accountingMonth: "示例内容", // 会计月份
      //     accountingYear: "示例内容", // 会计年度
      //     children: [
      //       //子数组
      //       {
      //         key: 222101,
      //         subjectCode: "222101",
      //         subjectName: "应交增值税",
      //         fullSubjectName: "应交增值税",
      //         beginningBalanceAtYearStart: "123456789",
      //         creditBalanceAtYearStart: "xxx",
      //         balanceDirectionAtYearStart: "123456789",
      //         debitBalanceAtPeriodStart: "123456789",
      //         creditBalanceAtPeriodStart: "示例内容",
      //         balanceDirectionAtPeriodStart: "示例内容",
      //         foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //         foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //         foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //         foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //         debitAmount: "示例内容",
      //         cumulativeDebitAmount: "示例内容",
      //         foreignCurrencyDebitAmount: "示例内容",
      //         foreignCurrencyCumulativeDebitAmount: "示例内容",
      //         creditAmount: "示例内容", // 贷方发生额
      //         cumulativeCreditAmount: "示例内容",
      //         foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //         foreignCurrencyCumulativeCreditAmount: "示例内容",
      //         debitBalanceAtPeriodEnd: "示例内容",
      //         creditBalanceAtPeriodEnd: "示例内容",
      //         balanceDirectionAtPeriodEnd: "示例内容",
      //         foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //         foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //         entryCount: "示例内容",
      //         accountingSubjectLevel: "示例内容",
      //         isLowestLevelSubject: "示例内容",
      //         parentSubjectCode: "示例内容",
      //         isCashOrCashEquivalent: "示例内容",
      //         currencyName: "示例内容",
      //         currencyCode: "示例内容",
      //         accountingMonth: "示例内容",
      //         accountingYear: "示例内容",
      //         children: [
      //           //子数组
      //           {
      //             key: 22210101,
      //             subjectCode: "22210101",
      //             subjectName: "进项税额",
      //             fullSubjectName: "进项税额",
      //             beginningBalanceAtYearStart: "123456789",
      //             creditBalanceAtYearStart: "xxx",
      //             balanceDirectionAtYearStart: "123456789",
      //             debitBalanceAtPeriodStart: "123456789",
      //             creditBalanceAtPeriodStart: "示例内容",
      //             balanceDirectionAtPeriodStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //             debitAmount: "示例内容",
      //             cumulativeDebitAmount: "示例内容",
      //             foreignCurrencyDebitAmount: "示例内容",
      //             foreignCurrencyCumulativeDebitAmount: "示例内容",
      //             creditAmount: "示例内容", // 贷方发生额
      //             cumulativeCreditAmount: "示例内容",
      //             foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //             foreignCurrencyCumulativeCreditAmount: "示例内容",
      //             debitBalanceAtPeriodEnd: "示例内容",
      //             creditBalanceAtPeriodEnd: "示例内容",
      //             balanceDirectionAtPeriodEnd: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //             entryCount: "示例内容",
      //             accountingSubjectLevel: "示例内容",
      //             isLowestLevelSubject: "示例内容",
      //             parentSubjectCode: "示例内容",
      //             isCashOrCashEquivalent: "示例内容",
      //             currencyName: "示例内容",
      //             currencyCode: "示例内容",
      //             accountingMonth: "示例内容",
      //             accountingYear: "示例内容",
      //           },
      //           {
      //             key: 22210102,
      //             subjectCode: "22210102",
      //             subjectName: "销项税额抵减",
      //             fullSubjectName: "销项税额抵减",
      //             beginningBalanceAtYearStart: "123456789",
      //             creditBalanceAtYearStart: "xxx",
      //             balanceDirectionAtYearStart: "123456789",
      //             debitBalanceAtPeriodStart: "123456789",
      //             creditBalanceAtPeriodStart: "示例内容",
      //             balanceDirectionAtPeriodStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //             debitAmount: "示例内容",
      //             cumulativeDebitAmount: "示例内容",
      //             foreignCurrencyDebitAmount: "示例内容",
      //             foreignCurrencyCumulativeDebitAmount: "示例内容",
      //             creditAmount: "示例内容", // 贷方发生额
      //             cumulativeCreditAmount: "示例内容",
      //             foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //             foreignCurrencyCumulativeCreditAmount: "示例内容",
      //             debitBalanceAtPeriodEnd: "示例内容",
      //             creditBalanceAtPeriodEnd: "示例内容",
      //             balanceDirectionAtPeriodEnd: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //             entryCount: "示例内容",
      //             accountingSubjectLevel: "示例内容",
      //             isLowestLevelSubject: "示例内容",
      //             parentSubjectCode: "示例内容",
      //             isCashOrCashEquivalent: "示例内容",
      //             currencyName: "示例内容",
      //             currencyCode: "示例内容",
      //             accountingMonth: "示例内容",
      //             accountingYear: "示例内容",
      //           },
      //         ],
      //       },
      //     ],
      //   },
      //   {
      //     key: 2221,
      //     subjectCode: "2221", // 科目编码
      //     subjectName: "应交税费", // 科目名称
      //     fullSubjectName: "应交税费", // 科目全称
      //     beginningBalanceAtYearStart: "123456789", // 年初期初余额
      //     creditBalanceAtYearStart: "xxx", // 年初贷方余额
      //     balanceDirectionAtYearStart: "123456789", // 年初余额方向
      //     debitBalanceAtPeriodStart: "123456789", // 期初借方余额
      //     creditBalanceAtPeriodStart: "示例内容", // 期初贷方余额
      //     balanceDirectionAtPeriodStart: "示例内容", // 期初余额方向
      //     foreignCurrencyDebitBalanceAtYearStart: "示例内容", // 外币年初借方余额
      //     foreignCurrencyCreditBalanceAtYearStart: "示例内容", // 外币年初贷方余额
      //     foreignCurrencyDebitBalanceAtPeriodStart: "示例内容", // 外币期初借方余额
      //     foreignCurrencyCreditBalanceAtPeriodStart: "示例内容", // 外币期初贷方余额
      //     debitAmount: "示例内容",
      //     cumulativeDebitAmount: "示例内容", // 借方累计发生额
      //     foreignCurrencyDebitAmount: "示例内容",
      //     foreignCurrencyCumulativeDebitAmount: "示例内容", // 外币借方累计发生额
      //     creditAmount: "示例内容", // 贷方发生额
      //     cumulativeCreditAmount: "示例内容", // 贷方累计发生额
      //     foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //     foreignCurrencyCumulativeCreditAmount: "示例内容", // 外币贷方累计发生额
      //     debitBalanceAtPeriodEnd: "示例内容", // 期末借方余额
      //     creditBalanceAtPeriodEnd: "示例内容", // 期末贷方余额
      //     balanceDirectionAtPeriodEnd: "示例内容", // 期末余额方向
      //     foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容", // 外币期末借方余额
      //     foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容", // 外币期末贷方余额
      //     entryCount: "示例内容", // 分录数
      //     accountingSubjectLevel: "示例内容", // 会计科目级别
      //     isLowestLevelSubject: "示例内容", // 是否最底级科目
      //     parentSubjectCode: "示例内容", // 上级科目编码
      //     isCashOrCashEquivalent: "示例内容", // 是否现金或现金等价物
      //     currencyName: "示例内容", // 币种名称
      //     currencyCode: "示例内容", // 币种代码
      //     accountingMonth: "示例内容", // 会计月份
      //     accountingYear: "示例内容", // 会计年度
      //     children: [
      //       //子数组
      //       {
      //         key: 222101,
      //         subjectCode: "222101",
      //         subjectName: "应交增值税",
      //         fullSubjectName: "应交增值税",
      //         beginningBalanceAtYearStart: "123456789",
      //         creditBalanceAtYearStart: "xxx",
      //         balanceDirectionAtYearStart: "123456789",
      //         debitBalanceAtPeriodStart: "123456789",
      //         creditBalanceAtPeriodStart: "示例内容",
      //         balanceDirectionAtPeriodStart: "示例内容",
      //         foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //         foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //         foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //         foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //         debitAmount: "示例内容",
      //         cumulativeDebitAmount: "示例内容",
      //         foreignCurrencyDebitAmount: "示例内容",
      //         foreignCurrencyCumulativeDebitAmount: "示例内容",
      //         creditAmount: "示例内容", // 贷方发生额
      //         cumulativeCreditAmount: "示例内容",
      //         foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //         foreignCurrencyCumulativeCreditAmount: "示例内容",
      //         debitBalanceAtPeriodEnd: "示例内容",
      //         creditBalanceAtPeriodEnd: "示例内容",
      //         balanceDirectionAtPeriodEnd: "示例内容",
      //         foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //         foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //         entryCount: "示例内容",
      //         accountingSubjectLevel: "示例内容",
      //         isLowestLevelSubject: "示例内容",
      //         parentSubjectCode: "示例内容",
      //         isCashOrCashEquivalent: "示例内容",
      //         currencyName: "示例内容",
      //         currencyCode: "示例内容",
      //         accountingMonth: "示例内容",
      //         accountingYear: "示例内容",
      //         children: [
      //           //子数组
      //           {
      //             key: 22210101,
      //             subjectCode: "22210101",
      //             subjectName: "进项税额",
      //             fullSubjectName: "进项税额",
      //             beginningBalanceAtYearStart: "123456789",
      //             creditBalanceAtYearStart: "xxx",
      //             balanceDirectionAtYearStart: "123456789",
      //             debitBalanceAtPeriodStart: "123456789",
      //             creditBalanceAtPeriodStart: "示例内容",
      //             balanceDirectionAtPeriodStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //             debitAmount: "示例内容",
      //             cumulativeDebitAmount: "示例内容",
      //             foreignCurrencyDebitAmount: "示例内容",
      //             foreignCurrencyCumulativeDebitAmount: "示例内容",
      //             creditAmount: "示例内容", // 贷方发生额
      //             cumulativeCreditAmount: "示例内容",
      //             foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //             foreignCurrencyCumulativeCreditAmount: "示例内容",
      //             debitBalanceAtPeriodEnd: "示例内容",
      //             creditBalanceAtPeriodEnd: "示例内容",
      //             balanceDirectionAtPeriodEnd: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //             entryCount: "示例内容",
      //             accountingSubjectLevel: "示例内容",
      //             isLowestLevelSubject: "示例内容",
      //             parentSubjectCode: "示例内容",
      //             isCashOrCashEquivalent: "示例内容",
      //             currencyName: "示例内容",
      //             currencyCode: "示例内容",
      //             accountingMonth: "示例内容",
      //             accountingYear: "示例内容",
      //           },
      //           {
      //             key: 22210102,
      //             subjectCode: "22210102",
      //             subjectName: "销项税额抵减",
      //             fullSubjectName: "销项税额抵减",
      //             beginningBalanceAtYearStart: "123456789",
      //             creditBalanceAtYearStart: "xxx",
      //             balanceDirectionAtYearStart: "123456789",
      //             debitBalanceAtPeriodStart: "123456789",
      //             creditBalanceAtPeriodStart: "示例内容",
      //             balanceDirectionAtPeriodStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtYearStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtYearStart: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodStart: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodStart: "示例内容",
      //             debitAmount: "示例内容",
      //             cumulativeDebitAmount: "示例内容",
      //             foreignCurrencyDebitAmount: "示例内容",
      //             foreignCurrencyCumulativeDebitAmount: "示例内容",
      //             creditAmount: "示例内容", // 贷方发生额
      //             cumulativeCreditAmount: "示例内容",
      //             foreignCurrencyCreditAmount: "示例内容", // 外币贷方发生额
      //             foreignCurrencyCumulativeCreditAmount: "示例内容",
      //             debitBalanceAtPeriodEnd: "示例内容",
      //             creditBalanceAtPeriodEnd: "示例内容",
      //             balanceDirectionAtPeriodEnd: "示例内容",
      //             foreignCurrencyDebitBalanceAtPeriodEnd: "示例内容",
      //             foreignCurrencyCreditBalanceAtPeriodEnd: "示例内容",
      //             entryCount: "示例内容",
      //             accountingSubjectLevel: "示例内容",
      //             isLowestLevelSubject: "示例内容",
      //             parentSubjectCode: "示例内容",
      //             isCashOrCashEquivalent: "示例内容",
      //             currencyName: "示例内容",
      //             currencyCode: "示例内容",
      //             accountingMonth: "示例内容",
      //             accountingYear: "示例内容",
      //           },
      //         ],
      //       },
      //     ],
      //   },
      // ],
      expandedRowKeys: [],
      expandedRowKeys2: [],
      expandedRowKeys3: [],

      //第二页表格
      //表头
      columns2: [
        {
          title: "凭证日期",
          dataIndex: "voucherDate",
          key: "voucherDate",
          width: 180,
        },
        {
          title: "凭证编号",
          dataIndex: "voucherNumber",
          key: "voucherNumber",
          width: 180,
        },
        {
          title: "记账摘要",
          dataIndex: "accountingSummary",
          key: "accountingSummary",
          width: 180,
        },
        {
          title: "借方发生额",
          dataIndex: "debitOccurrenceAmount",
          key: "debitOccurrenceAmount",
          width: 180,
        },
        {
          title: "贷方发生额",
          dataIndex: "creditOccurrenceAmount",
          key: "creditOccurrenceAmount",
          width: 150,
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
          scopedSlots: { customRender: "subjectName" },
        },
        {
          title: "科目全称",
          dataIndex: "fullSubjectName",
          key: "fullSubjectName",
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
          width: 180,
        },
      ],
      //表格数据来源
      dataSource2: [],

      // dataSource2: [
      //   {
      //     subjectCode: "1201", // 科目编码
      //     subjectName: "物资采购", // 科目名称
      //     fullSubjectName: "示例内容", // 科目全称
      //     voucherDate: "示例内容", // 凭证日期
      //     voucherNumber: "示例内容", // 凭证编号
      //     accountingSummary: "示例内容", // 记账摘要
      //     debitOccurrenceAmount: "示例内容", // 借方发生额
      //     creditOccurrenceAmount: "示例内容", // 贷方发生额
      //     counterpartySubjectCode: "示例内容", // 对方科目编码
      //     counterpartySubjectName: "示例内容", // 对方科目名称
      //   },
      // ],

      //第三页表格
      //表头
      columns3: [
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
          scopedSlots: { customRender: "fullSubjectName" },
        },
        {
          title: "凭证编号",
          dataIndex: "voucherNumber",
          key: "voucherNumber",
          width: 180,
        },
        {
          title: "会计月份",
          dataIndex: "accountingMonth",
          key: "accountingMonth",
          width: 180,
        },
        {
          title: "摘要",
          dataIndex: "summary",
          key: "summary",
          width: 180,
        },
        {
          title: "借方金额",
          dataIndex: "debitAmount",
          key: "debitAmount",
          width: 180,
        },
        {
          title: "贷方金额",
          dataIndex: "creditAmount",
          key: "creditAmount",
          width: 180,
        },
      ],
      //表格数据来源
      dataSource3: {},

      // dataSource3: {
      //   dateList: [
      //     {
      //       subjectCode: "1201", // 科目编码
      //       fullSubjectName: "物资采购", // 科目全称
      //       voucherNumber: "xxx", // 凭证编号
      //       accountingMonth: "xxx", // 会计月份
      //       summary: "xxx", // 摘要
      //       debitAmount: "5000", // 借方金额
      //       creditAmount: "", // 贷方金额
      //     },
      //     {
      //       subjectCode: "1001", // 科目编码
      //       fullSubjectName: "现金", // 科目全称
      //       voucherNumber: "xxx", // 凭证编号
      //       accountingMonth: "xxx", // 会计月份
      //       summary: "xxx", // 摘要
      //       debitAmount: "", // 借方金额
      //       creditAmount: "5000", // 贷方金额
      //     },
      //     {
      //       subjectCode: "1001", // 科目编码
      //       fullSubjectName: "现金", // 科目全称
      //       voucherNumber: "xxx", // 凭证编号
      //       accountingMonth: "xxx", // 会计月份
      //       summary: "xxx", // 摘要
      //       debitAmount: "", // 借方金额
      //       creditAmount: "5000", // 贷方金额
      //     },
      //     {
      //       subjectCode: "1001", // 科目编码
      //       fullSubjectName: "现金", // 科目全称
      //       voucherNumber: "xxx", // 凭证编号
      //       accountingMonth: "xxx", // 会计月份
      //       summary: "xxx", // 摘要
      //       debitAmount: "", // 借方金额
      //       creditAmount: "5000", // 贷方金额
      //     },
      //     {
      //       subjectCode: "1001", // 科目编码
      //       fullSubjectName: "现金", // 科目全称
      //       voucherNumber: "xxx", // 凭证编号
      //       accountingMonth: "xxx", // 会计月份
      //       summary: "xxx", // 摘要
      //       debitAmount: "", // 借方金额
      //       creditAmount: "5000", // 贷方金额
      //     },
      //     {
      //       subjectCode: "1001", // 科目编码
      //       fullSubjectName: "现金", // 科目全称
      //       voucherNumber: "xxx", // 凭证编号
      //       accountingMonth: "xxx", // 会计月份
      //       summary: "xxx", // 摘要
      //       debitAmount: "", // 借方金额
      //       creditAmount: "5000", // 贷方金额
      //     },
      //     {
      //       subjectCode: "1001", // 科目编码
      //       fullSubjectName: "现金", // 科目全称
      //       voucherNumber: "xxx", // 凭证编号
      //       accountingMonth: "xxx", // 会计月份
      //       summary: "xxx", // 摘要
      //       debitAmount: "", // 借方金额
      //       creditAmount: "5000", // 贷方金额
      //     },
      //     {
      //       subjectCode: "1001", // 科目编码
      //       fullSubjectName: "现金", // 科目全称
      //       voucherNumber: "xxx", // 凭证编号
      //       accountingMonth: "xxx", // 会计月份
      //       summary: "xxx", // 摘要
      //       debitAmount: "", // 借方金额
      //       creditAmount: "5000", // 贷方金额
      //     },
      //     {
      //       subjectCode: "1001", // 科目编码
      //       fullSubjectName: "现金", // 科目全称
      //       voucherNumber: "xxx", // 凭证编号
      //       accountingMonth: "xxx", // 会计月份
      //       summary: "xxx", // 摘要
      //       debitAmount: "", // 借方金额
      //       creditAmount: "5000", // 贷方金额
      //     },
      //     {
      //       subjectCode: "1001", // 科目编码
      //       fullSubjectName: "现金", // 科目全称
      //       voucherNumber: "xxx", // 凭证编号
      //       accountingMonth: "xxx", // 会计月份
      //       summary: "xxx", // 摘要
      //       debitAmount: "", // 借方金额
      //       creditAmount: "5000", // 贷方金额
      //     },
      //     {
      //       subjectCode: "1001", // 科目编码
      //       fullSubjectName: "现金", // 科目全称
      //       voucherNumber: "xxx", // 凭证编号
      //       accountingMonth: "xxx", // 会计月份
      //       summary: "xxx", // 摘要
      //       debitAmount: "", // 借方金额
      //       creditAmount: "5000", // 贷方金额
      //     },
      //     {
      //       subjectCode: "1001", // 科目编码
      //       fullSubjectName: "现金", // 科目全称
      //       voucherNumber: "xxx", // 凭证编号
      //       accountingMonth: "xxx", // 会计月份
      //       summary: "xxx", // 摘要
      //       debitAmount: "", // 借方金额
      //       creditAmount: "5000", // 贷方金额
      //     },
      //     {
      //       subjectCode: "1001", // 科目编码
      //       fullSubjectName: "现金", // 科目全称
      //       voucherNumber: "xxx", // 凭证编号
      //       accountingMonth: "xxx", // 会计月份
      //       summary: "xxx", // 摘要
      //       debitAmount: "", // 借方金额
      //       creditAmount: "5000", // 贷方金额
      //     },
      //     {
      //       subjectCode: "1001", // 科目编码
      //       fullSubjectName: "现金", // 科目全称
      //       voucherNumber: "xxx", // 凭证编号
      //       accountingMonth: "xxx", // 会计月份
      //       summary: "xxx", // 摘要
      //       debitAmount: "", // 借方金额
      //       creditAmount: "5000", // 贷方金额
      //     },
      //     {
      //       subjectCode: "1001", // 科目编码
      //       fullSubjectName: "现金", // 科目全称
      //       voucherNumber: "xxx", // 凭证编号
      //       accountingMonth: "xxx", // 会计月份
      //       summary: "xxx", // 摘要
      //       debitAmount: "", // 借方金额
      //       creditAmount: "5000", // 贷方金额
      //     },
      //     {
      //       subjectCode: "1001", // 科目编码
      //       fullSubjectName: "现金", // 科目全称
      //       voucherNumber: "xxx", // 凭证编号
      //       accountingMonth: "xxx", // 会计月份
      //       summary: "xxx", // 摘要
      //       debitAmount: "", // 借方金额
      //       creditAmount: "5000", // 贷方金额
      //     },
      //     {
      //       subjectCode: "1001", // 科目编码
      //       fullSubjectName: "现金", // 科目全称
      //       voucherNumber: "xxx", // 凭证编号
      //       accountingMonth: "xxx", // 会计月份
      //       summary: "xxx", // 摘要
      //       debitAmount: "", // 借方金额
      //       creditAmount: "5000", // 贷方金额
      //     },
      //     {
      //       subjectCode: "1001", // 科目编码
      //       fullSubjectName: "现金", // 科目全称
      //       voucherNumber: "xxx", // 凭证编号
      //       accountingMonth: "xxx", // 会计月份
      //       summary: "xxx", // 摘要
      //       debitAmount: "", // 借方金额
      //       creditAmount: "5000", // 贷方金额
      //     },
      //     {
      //       subjectCode: "1001", // 科目编码
      //       fullSubjectName: "现金", // 科目全称
      //       voucherNumber: "xxx", // 凭证编号
      //       accountingMonth: "xxx", // 会计月份
      //       summary: "xxx", // 摘要
      //       debitAmount: "", // 借方金额
      //       creditAmount: "5000", // 贷方金额
      //     },
      //     {
      //       subjectCode: "1001", // 科目编码
      //       fullSubjectName: "现金", // 科目全称
      //       voucherNumber: "xxx", // 凭证编号
      //       accountingMonth: "xxx", // 会计月份
      //       summary: "xxx", // 摘要
      //       debitAmount: "", // 借方金额
      //       creditAmount: "5000", // 贷方金额
      //     },
      //     {
      //       subjectCode: "1001", // 科目编码
      //       fullSubjectName: "现金", // 科目全称
      //       voucherNumber: "xxx", // 凭证编号
      //       accountingMonth: "xxx", // 会计月份
      //       summary: "xxx", // 摘要
      //       debitAmount: "", // 借方金额
      //       creditAmount: "5000", // 贷方金额
      //     },
      //     {
      //       subjectCode: "1001", // 科目编码
      //       fullSubjectName: "现金", // 科目全称
      //       voucherNumber: "xxx", // 凭证编号
      //       accountingMonth: "xxx", // 会计月份
      //       summary: "xxx", // 摘要
      //       debitAmount: "", // 借方金额
      //       creditAmount: "5000", // 贷方金额
      //     },
      //     {
      //       subjectCode: "1001", // 科目编码
      //       fullSubjectName: "现金", // 科目全称
      //       voucherNumber: "xxx", // 凭证编号
      //       accountingMonth: "xxx", // 会计月份
      //       summary: "xxx", // 摘要
      //       debitAmount: "", // 借方金额
      //       creditAmount: "5000", // 贷方金额
      //     },
      //     {
      //       subjectCode: "1001", // 科目编码
      //       fullSubjectName: "现金", // 科目全称
      //       voucherNumber: "xxx", // 凭证编号
      //       accountingMonth: "xxx", // 会计月份
      //       summary: "xxx", // 摘要
      //       debitAmount: "", // 借方金额
      //       creditAmount: "5000", // 贷方金额
      //     },
      //     {
      //       subjectCode: "1001", // 科目编码
      //       fullSubjectName: "现金", // 科目全称
      //       voucherNumber: "xxx", // 凭证编号
      //       accountingMonth: "xxx", // 会计月份
      //       summary: "xxx", // 摘要
      //       debitAmount: "", // 借方金额
      //       creditAmount: "5000", // 贷方金额
      //     },
      //     {
      //       subjectCode: "1001", // 科目编码
      //       fullSubjectName: "现金", // 科目全称
      //       voucherNumber: "xxx", // 凭证编号
      //       accountingMonth: "xxx", // 会计月份
      //       summary: "xxx", // 摘要
      //       debitAmount: "", // 借方金额
      //       creditAmount: "5000", // 贷方金额
      //     },
      //     {
      //       subjectCode: "1001", // 科目编码
      //       fullSubjectName: "现金", // 科目全称
      //       voucherNumber: "xxx", // 凭证编号
      //       accountingMonth: "xxx", // 会计月份
      //       summary: "xxx", // 摘要
      //       debitAmount: "", // 借方金额
      //       creditAmount: "5000", // 贷方金额
      //     },
      //   ],
      //   voucherDate: "2024-07-16", //凭证日期
      //   voucherNumber: 546654456, //凭证号
      //   debitAmountSummary: 5323243242, //借方金额汇总
      //   creditAmountSummary: 124124324, //贷方金额汇总
      // },
    };
  },
  computed: {
    // ...mapState("auditOptions", ["paramsObj"]),
  },
  components: {
    ABreadcrumb: Breadcrumb,
    // ADrawer: Drawer,
    ATooltip: Tooltip,
    // APopover: Popover,
    ATreeSelect: TreeSelect,
    ASelect: Select,
    // AInput: Input,
    AButton: Button,
    ABreadcrumbItem: BreadcrumbItem,
  },
  async mounted() {
    // this.getGeneralDetailsBudget();
    // this.getGeneralDetailsBook();
    // this.getGeneralDetailsSystem();
    // this.getGeneralDetailsSubjects();
    //初始上来不做任何查询
    // await this.getGeneralDetailsDataOne();
  },
  methods: {
    //悬浮框相关
    afterVisibleChange(val) {
      console.log("visible", val);
    },
    onClose() {
      this.visible = false;
    },

    //预算单位选中之后
    changeBudget() {
      this.isDisabled = false;
      this.choosedFinYear = null;
      this.choosedFinMonth = [];
      this.finBook = null;
      this.finSystem = null;
      this.choosedSubject = [];
      this.getGeneralDetailsBook();
      this.getGeneralDetailsYear();
      this.getGeneralDetailsMonth();
      this.getGeneralDetailsSystem();
      this.getGeneralDetailsSubjects();
    },

    changeFinBook() {
      // this.getGeneralDetailsBudget();
      // this.getGeneralDetailsSystem();
      // this.getGeneralDetailsSubjects();
    },

    changeFinSystem() {
      // this.getGeneralDetailsBudget();
      // this.getGeneralDetailsBook();
      // this.getGeneralDetailsSubjects();
    },
    // changeSubject() {
    //   this.getGeneralDetailsBudget();
    //   this.getGeneralDetailsBook();
    //   this.getGeneralDetailsSystem();
    // },

    //预算单位搜索树
    async getGeneralDetailsBudget(value) {
      const json = {
        // unitCode: this.choosedBudget, // 单位编码
        unitName: value, // 用户输入
      };
      const res = await getGeneralDetailsBudget(json);
      console.log("页面内 预算单位下拉框res", res);
      if (res.message === "成功") {
        console.log("message成功 预算单位下拉框", res.data);
        this.budgetOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //会计电子账簿下拉框
    async getGeneralDetailsBook() {
      const json = {
        // year: this.choosedFinYear, //会计年份
        unitName: this.choosedBudget, // 单位编码
        acctEbkName: "", //会计电子账簿编码
        // acctEbkName: this.finBook, //会计电子账簿编码
        // acctSystem: this.finSystem, // 会计体系
        // month: this.choosedFinMonth, //会计月份，可多选
        // acctSubjCode: this.choosedSubject, // 会计科目编码
      };
      const res = await getGeneralDetailsBook(json);
      console.log("页面内 会计电子账簿下拉框res", res);
      if (res.message === "成功") {
        console.log("message成功 会计电子账簿下拉框", res.data);
        this.finBookOptions = res.data;
        this.finBook = res.data[0].value;
      } else {
        this.$message.error(res.message);
      }
    },

    //年份下拉框
    async getGeneralDetailsYear() {
      const json = {
        // year: this.choosedFinYear, //会计年份
        unitName: this.choosedBudget, // 单位编码
        // acctEbkNum: this.finBook, //会计电子账簿编码
        // acctSystem: this.finSystem, // 会计体系
        // month: this.choosedFinMonth, //会计月份，可多选
        // acctSubjCode: this.choosedSubject, // 会计科目编码
      };
      const res = await getGeneralDetailsYear(json);
      console.log("页面内 年份下拉框res", res);
      if (res.message === "成功") {
        console.log("message成功 年份下拉框", res.data);
        this.yearOptions = res.data;
        if (res.data.length !== 0) {
          this.choosedFinYear = res.data[res.data.length - 1].value;
        }
      } else {
        this.$message.error(res.message);
      }
    },
    //月份下拉框
    getGeneralDetailsMonth() {
      // const json = {
      //   // year: this.choosedFinYear, //会计年份
      //   unitCode: this.choosedBudget, // 单位编码
      //   // acctEbkNum: this.finBook, //会计电子账簿编码
      //   // acctSystem: this.finSystem, // 会计体系
      //   // month: this.choosedFinMonth, //会计月份，可多选
      //   // acctSubjCode: this.choosedSubject, // 会计科目编码
      // };
      // const res = await getGeneralDetailsMonth(json);
      // console.log("页面内 月份下拉框res", res);
      // if (res.message === "成功") {
      //   console.log("message成功 月份下拉框", res.data);
      //   this.monthOptions = res.data;
      //   if (res.data.length !== 0) {
      //     this.choosedFinMonth.push(res.data[res.data.length - 1].value);
      //   }
      // } else {
      //   this.$message.error(res.message);
      // }
      this.choosedFinMonth.push(
        this.monthOptions[this.monthOptions.length - 1].value
      );
    },

    //会计体系下拉框
    async getGeneralDetailsSystem() {
      const json = {
        // year: this.choosedFinYear, //会计年份
        unitName: this.choosedBudget, // 单位编码
        // acctEbkNum: this.finBook, //会计电子账簿编码
        acctSystem: "", // 会计体系
        // month: this.choosedFinMonth, //会计月份，可多选
        // acctSubjCode: this.choosedSubject, // 会计科目编码
      };
      const res = await getGeneralDetailsSystem(json);
      console.log("页面内 会计体系下拉框res", res);
      if (res.message === "成功") {
        console.log("message成功 会计体系下拉框", res.data);
        this.finSystemOptions = res.data;
        this.finSystem = res.data[0].value;
      } else {
        this.$message.error(res.message);
      }
    },

    //会计科目树形结构
    async getGeneralDetailsSubjects() {
      const json = {
        unitName: this.choosedBudget, //用户已经选中的单位的编码
        acctSubjCode: [], //会计科目编码
        acctSubjLevel: 1, // 会计科目层级
        inputData: "", //用户输入数据
      };
      // {
      //   year: this.choosedFinYear, //会计年度
      //   unitCode: this.choosedBudget, //预算单位代码
      //   acctEbkNum: this.finBook, //电子账簿代码
      //   acctSystem: this.finSystem, //会计体系
      //   acctSubjCode: this.choosedSubject, //科目代码
      // };
      const res = await getGeneralDetailsSubjects(json);
      console.log("页面内 会计科目树形结构res", res);
      if (res.message === "成功") {
        console.log("message成功 会计科目树形结构", res.data);
        this.subjectTree = res.data;
        // this.subjectTree = [
        //   {
        //     label: "1001——库存现金",
        //     value: "库存现金的code",
        //     key: "库存现金的code",
        //   },
        //   {
        //     label: "2211——应付职工薪酬",
        //     value: "应付职工薪酬的code",
        //     key: "应付职工薪酬的code",
        //   },
        //   {
        //     label: "221101——职工工资",
        //     value: "221101——职工工资的code",
        //     key: "221101——职工工资的code",
        //   },
        //   {
        //     label: "221102——奖金和补贴",
        //     value: "221102——奖金和补贴的code",
        //     key: "221102——奖金和补贴的code",
        //   },
        //   {
        //     label: "221103——职工福利费",
        //     value: "221103——职工福利费的code",
        //     key: "221103——职工福利费的code",
        //   },
        // ];
        this.allSelected = false;
        let selectAllValue = "select-all";
        this.handleSelectChange(selectAllValue);
      } else {
        this.$message.error(res.message);
      }
    },

    //会计科目树形结构输入框
    // async getGeneralDetailsSubjectsInput() {
    //   const json = {
    //     // year: this.choosedFinYear, //用户输入
    //     unitCode: this.choosedBudget, // 单位编码
    //   };
    //   // const res = await getGeneralDetailsSubjects(json);
    //   // console.log("页面内 会计科目树形结构输入框res", res);
    //   // if (res.message === "成功") {
    //   //   console.log("message成功 会计科目树形结构输入框", res.data);
    //   //   this.subjectTree = res.data;
    //   // } else {
    //   //   this.$message.error(res.message);
    //   // }
    // },

    //输入筛选模糊搜索
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    //监听全选
    handleSelectChange(value) {
      // 检查全选选项的状态
      if (value.includes("select-all")) {
        // 如果全选选项被选中
        if (!this.allSelected) {
          // 选中所有项
          this.choosedSubject = this.subjectTree.map((item) => item.value);
        } else {
          // 取消全选
          this.choosedSubject = [];
        }
        // 切换全选状态
        this.allSelected = !this.allSelected;
      } else {
        // 如果用户选择了其他选项，检查是否需要更新全选状态
        this.allSelected =
          this.subjectTree.length ===
          value.length - (this.choosedSubject.includes("select-all") ? 1 : 0);
      }
    },

    //检查筛选框是否已填
    checkParams() {
      if (this.choosedBudget == null) {
        this.$message.warning("请选择预算单位");
        return false;
      } else if (this.choosedFinYear == null) {
        this.$message.warning("请选择会计年度");
        return false;
      } else if (this.choosedFinMonth.length < 1) {
        this.$message.warning("请选择会计月份");
        return false;
      } else if (this.finBook == null) {
        this.$message.warning("请选择会计电子账簿");
        return false;
      } else if (this.finSystem == null) {
        this.$message.warning("请选择会计体系");
        return false;
      } else if (this.choosedSubject.length < 1) {
        this.$message.warning("请选择会计科目");
        return false;
      }
      return true;
    },

    //获取一层表格数据
    async getGeneralDetailsDataOne() {
      if (!this.checkParams()) {
        return; // 如果检查不通过，则停止执行后续代码
      }
      const arr = generateHierarchy(this.choosedSubject);
      const json = {
        unitName: this.choosedBudget, //预算单位代码
        acctYear: this.choosedFinYear, //会计年度
        acctMonth: this.choosedFinMonth, //会计月度
        acctEbkNum: this.finBook, //电子账簿编号
        acctSystem: this.finSystem, //会计体系
        acctSubjCode: arr, //科目代码
      };
      console.log(
        "打印强哥的获取父级函数",
        "generateHierarchy",
        generateHierarchy,
        arr,
        json
      );
      this.tableLoading1 = true;
      const res = await getGeneralDetailsDataOne(json);
      this.tableLoading1 = false;
      console.log("页面内 获取一层表格数据res", res);
      if (res.message === "成功") {
        console.log("message成功 获取一层表格数据", res.data);
        //改为千分位
        this.dataSource1 = formatArray(res.data);
      } else {
        this.$message.error(res.message);
      }
    },

    //获取二层表格数据
    async getGeneralDetailsDataTwo() {
      this.checkParams();
      // const arr = generateHierarchy(this.choosedSubject);
      const json = {
        unitName: this.choosedBudget, //预算单位代码
        acctYear: this.choosedFinYear, //会计年度
        pageSize: this.pagination.pageSize, //页面大小
        pageOffset: this.pagination.pageSize * (this.pagination.current - 1), //页面页码
        acctMonth: this.monthJump, //跳转月度
        acctEbkNum: this.finBook, //电子账簿编号
        acctSystem: this.finSystem, //会计体系
        // acctSubjCode: arr, //科目代码
        acctSubjCode: this.acctSubjCodeJump, //科目代码   第一个表格携带
      };
      this.tableLoading2 = true;
      const res = await getGeneralDetailsDataTwo(json);
      this.tableLoading2 = false;
      console.log("页面内 获取二层表格数据res", res);
      if (res.message === "成功") {
        console.log("message成功 获取二层表格数据", res.data);
        this.dataSource2 = formatArray(res.data.dateList);
        this.pagination.total = res.data.total;
      } else {
        this.$message.error(res.message);
      }
    },

    //获取三层表格数据
    async getGeneralDetailsDataThree() {
      this.checkParams();
      // const arr = generateHierarchy(this.choosedSubject);
      const json = {
        unitName: this.choosedBudget, //单位代码
        acctYear: this.choosedFinYear, //会计年度
        acctEbkNum: this.finBook, //电子账簿编号
        acctSystem: this.finSystem, //会计体系
        acctMonth: this.accountingMonthJump, //会计月度,
        acctTypeNum: this.voucherNumber, //记账凭证号   第二个表格携带
        acctSubjCode: "", //科目代码  //科目代码   第一个表格携带
        // acctSubjCode: this.acctSubjCodeJump, //科目代码  //科目代码   第一个表格携带
      };
      this.tableLoading3 = true;
      const res = await getGeneralDetailsDataThree(json);
      this.tableLoading3 = false;
      console.log("页面内 获取三层表格数据res", res);
      if (res.message === "成功") {
        console.log("message成功 获取三层表格数据", res.data);
        const newData = formatArray(res.data.dateList);
        res.data.dateList = newData;
        this.dataSource3 = res.data;
        console.log(
          "message成功 前端处理完之后的this.dataSource3",
          this.dataSource3
        );
      } else {
        this.$message.error(res.message);
      }
    },

    //行双击事件
    handleRowClick1(record, index) {
      return {
        on: {
          dblclick: () => {
            console.log("点击行的record", record);
            console.log("点击行的index", index);
            this.acctSubjCodeJump = record.subjectCode;
            this.monthJump = record.accountingMonth;
            //获取二层表格数据
            this.getGeneralDetailsDataTwo();
            this.showNum = 2;
          },
        },
      };
    },
    handleRowClick2(record, index) {
      return {
        on: {
          dblclick: () => {
            console.log("点击行的record", record);
            console.log("点击行的index", index);
            this.voucherNumber = record.voucherNumber;
            let arr = [];
            arr.push(record.accountingMonth);
            this.accountingMonthJump = arr;
            //获取三层表格数据
            this.getGeneralDetailsDataThree();
            this.showNum = 3;
          },
        },
      };
    },

    //二级表格面包屑点击
    goPage1() {
      //获取一层表格数据
      //同一个页面内不需要再次获取数据
      // this.getGeneralDetailsDataOne();
      this.showNum = 1;
    },
    goPage2() {
      //获取二层表格数据
      // this.getGeneralDetailsDataTwo();
      //重置页面大小以及页面第1页
      this.pagination.current = 1;
      this.pagination.pageSize = 50;
      this.showNum = 2;
    },

    //重置
    reset() {
      this.choosedBudget = null;
      this.choosedFinYear = null;
      this.choosedFinMonth = [];
      this.finBook = null;
      this.finSystem = null;
      this.choosedSubject = [];
      // if (this.showNum === 1) {
      //   this.getGeneralDetailsDataOne();
      // } else if (this.showNum === 2) {
      //   this.getGeneralDetailsDataTwo();
      // } else {
      //   this.getGeneralDetailsDataThree();
      // }
    },

    //查询
    tableSearch() {
      this.visible = false;
      if (this.showNum === 1) {
        this.getGeneralDetailsDataOne();
      } else if (this.showNum === 2) {
        this.getGeneralDetailsDataTwo();
      } else if (this.showNum === 3) {
        this.getGeneralDetailsDataThree();
      }
    },
  },
};
</script>

<style lang="less">
.general-details {
  width: 100%;
  height: calc(100% - 52px);
  // height: 100%;

  &-content {
    width: 100%;
    height: 100%;

    //大标题
    .big-center-head {
      display: flex;
      justify-content: center;
      margin-bottom: 10px;
      font-size: 34px;
      font-weight: bold;
    }

    //查询条件
    .bottom-search {
      display: flex;
      flex-wrap: wrap;
      gap: 16px 40px;
      margin-bottom: 20px;

      &-item {
        width: calc((100% - 80px) / 3); // 默认一行四个，可添加覆盖样式
        display: flex;
        align-items: center;
        justify-content: flex-start;

        .ant-select {
          overflow: auto;
        }

        &:last-child {
          justify-content: flex-end;
        }

        .item-label {
          color: @primaryTextColor;
        }

        .item-value {
          flex: 1;
          width: 100%;

          .ant-select-selection {
            max-height: 32px;
            overflow-y: auto;
          }

          .ant-input {
            padding-right: 30px;
          }
        }

        &.actions {
          display: flex;
          justify-content: flex-end;

          .actions-btn {
            margin-left: 10px;
            display: flex;
            align-items: center;

            &-icon {
              width: 16px;
              height: 16px;
              display: flex;
              margin-right: 8px;
            }
          }
        }
      }
    }

    //表格底部的汇总金额
    .down {
      display: flex;
      margin-right: 310px;
      justify-content: flex-end;

      .small-down {
        display: inline-block;
        width: 150px;
        height: 50px;
        margin-right: 60px;
        &-item {
          width: 150px;
          text-align: right;
        }
        &-num {
          width: 150px;
          text-align: right;
          margin-bottom: 10px;
        }
      }
    }

    .content-header {
      min-height: 32px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .content-small-header {
      display: flex;
      height: 22px;
      margin-bottom: 20px;
      margin-left: 240px;

      .small-header-item {
        font-size: 14px;
        height: 22px;
        line-height: 22px;
        color: #97a3b7;
      }

      .small-header-num {
        margin-right: 40px;
        font-size: 14px;
        height: 22px;
        line-height: 22px;
      }
    }

    .content-header-one {
      display: inline-block;
      height: 28px;
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 20px;
    }

    .content-header-btn {
      width: 60px;
      height: 32px;
      font-size: 14px;
      color: #3c485c;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border-radius: 6px;
      border: 1px solid #d6dbe3;
      background: #fff;
    }

    .content-header-one-table {
      height: calc(100% - 180px);
    }

    .content-header-two-table {
      height: calc(100% - 130px);

      .ant-spin-nested-loading {
        .ant-pagination {
          margin: 0 0 16px 0;
        }
      }
    }

    .content-header-three-table {
      display: flex;
      justify-content: center;
      width: calc(100% - 100px);
      height: 50% !important;
    }
  }

  .btn-disabled {
    display: none;
  }
}
.fixed-icon {
  width: 30px;
  height: 30px;
  cursor: pointer;
  padding: 5px;
  background: #ffffff;
  // background: #1776ff;
  border-radius: 100px;
  // border: 2px solid #1776ff;
  box-shadow: 0px 4px 16px 0px rgba(31, 48, 78, 0.1),
    0px 10px 16px 4px rgba(31, 48, 78, 0.08);
  position: fixed;
  top: 240px;
  right: 40px;
  z-index: 99;
  display: flex;
  justify-content: center;
  align-items: center;

  icon-svg {
    width: 20px;
    height: 20px;
  }
}
.ant-drawer {
  .content-item {
    margin-bottom: 20px;

    .content-item-value {
      width: 100%;
    }
  }
}

.ellipsis {
  white-space: nowrap; /* 单行显示 */
  overflow: hidden; /* 隐藏溢出部分 */
  text-overflow: ellipsis; /* 显示省略号 */
  max-width: 150px; /* 设置最大宽度，根据需要调整 */
  display: inline-block; /* 让元素支持宽度设置 */
}

// .ant-popover-content {
//     border-radius: 4px;
//     border: 1px solid #d6dbe3;
//     background: #fff;
//     box-shadow: 0px 8px 16px 0px rgba(23, 118, 255, 0.05),
//       0px 20px 16px 4px rgba(23, 118, 255, 0.08);

//     .ant-popover-arrow {
//       display: none !important;
//     }

//     .ant-popover-inner-content {
//       width: 210px;

//       .content-item {
//         .ant-select-selection {
//           max-height: 60px;
//           overflow-y: auto;
//         }

//         &-label {
//           margin-bottom: 4px;
//         }
//         &-value {
//           width: 100%;
//         }

//         &:not(:last-child) {
//           margin-bottom: 12px;
//         }
//       }

//       .content-btn {
//         display: flex;
//         justify-content: flex-end;
//       }
//     }
//   }
</style>
