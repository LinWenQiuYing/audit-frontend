<template>
  <div class="structure-analysis">
    <MainContent title="组织架构分析">
      <template slot="right">
        <!-- <a-select
          placeholder="请选择"
          v-model="curYear"
          :options="yearOptions"
          @change="handleYearChange"
        /> -->
      </template>
      <template slot="content">
        <div class="structure-analysis-detail">
          <div class="structure-analysis-detail-box">
            <div class="structure-analysis-detail-box-content">
              <div class="structure-analysis-detail-box-content-graph">
                <div class="graph-filter">
                  <div class="graph-filter-item">
                    <div class="item-label">年份：</div>
                    <a-select
                      class="item-value"
                      placeholder="请选择"
                      v-model="choosedYear"
                      @change="handleYearChange"
                    >
                      <a-select-option
                        v-for="item in yearOptions"
                        :key="item.label"
                        :title="item.value"
                        :value="item.value"
                      >
                        {{ item.label }}
                      </a-select-option>
                    </a-select>
                  </div>
                  <a-popover
                    trigger="click"
                    title="筛选配置"
                    overlayClassName="graph-popover"
                    placement="bottomLeft"
                    v-model="filterVisible"
                  >
                    <template slot="content">
                      <div class="graph-popover-content">
                        <div class="popover-content-item">
                          <div class="item-label">主管单位名称：</div>
                          <a-input
                            type="text"
                            allow-clear
                            placeholder="主管单位名称"
                            class="item-input"
                            v-model.trim="manageUnitName"
                          />
                        </div>
                        <div class="popover-content-item">
                          <div class="item-label">预算单位名称：</div>
                          <a-input
                            type="text"
                            allow-clear
                            placeholder="预算单位名称"
                            class="item-input"
                            v-model.trim="budgetUnitName"
                          />
                        </div>
                        <div class="popover-content-two">
                          <div
                            class="popover-content-item"
                            style="width: 160px"
                          >
                            <div class="item-label">主管单位预算规模：</div>
                            <a-select
                              class="item-select"
                              placeholder="请选择"
                              v-model="manageBudgetScale"
                            >
                              <a-select-option
                                v-for="item in budgetScaleOptions"
                                :key="item.label"
                                :title="item.value"
                                :value="item.value"
                              >
                                {{ item.label }}
                              </a-select-option>
                            </a-select>
                          </div>
                          <div
                            class="popover-content-item"
                            style="width: 160px"
                          >
                            <div class="item-label">主管单位支出规模：</div>
                            <a-select
                              class="item-select"
                              placeholder="请选择"
                              v-model="manageSpendScale"
                            >
                              <a-select-option
                                v-for="item in spendScaleOptions"
                                :key="item.label"
                                :title="item.value"
                                :value="item.value"
                              >
                                {{ item.label }}
                              </a-select-option>
                            </a-select>
                          </div>
                        </div>
                        <div class="popover-content-two">
                          <div
                            class="popover-content-item"
                            style="width: 160px"
                          >
                            <div class="item-label">预算单位预算规模：</div>
                            <a-select
                              class="item-select"
                              placeholder="请选择"
                              v-model="budgetBudgetScale"
                            >
                              <a-select-option
                                v-for="item in budgetScaleOptions"
                                :key="item.label"
                                :title="item.value"
                                :value="item.value"
                              >
                                {{ item.label }}
                              </a-select-option>
                            </a-select>
                          </div>
                          <div
                            class="popover-content-item"
                            style="width: 160px"
                          >
                            <div class="item-label">预算单位支出规模：</div>
                            <a-select
                              class="item-select"
                              placeholder="请选择"
                              v-model="budgetSpendScale"
                            >
                              <a-select-option
                                v-for="item in spendScaleOptions"
                                :key="item.label"
                                :title="item.value"
                                :value="item.value"
                              >
                                {{ item.label }}
                              </a-select-option>
                            </a-select>
                          </div>
                        </div>
                        <div class="popover-content-item">
                          <div class="item-label">主管单位执行率范围：</div>
                          <div class="item-range">
                            <a-input-number
                              v-model.trim="manageExecuteRatioStart"
                              :min="0"
                              :precision="0"
                              class="item-range-input"
                            />
                            %
                            <span style="margin: 0 8px">~</span>
                            <a-input-number
                              v-model.trim="manageExecuteRatioEnd"
                              :min="1"
                              :max="100"
                              :precision="0"
                              class="item-range-input"
                            />
                            %
                          </div>
                        </div>
                        <div class="popover-content-item">
                          <div class="item-label">预算单位执行率范围：</div>
                          <div class="item-range">
                            <a-input-number
                              v-model.trim="budgetExecuteRatioStart"
                              :min="0"
                              :max="100"
                              :precision="0"
                              class="item-range-input"
                            />
                            %
                            <span style="margin: 0 8px">~</span>
                            <a-input-number
                              v-model.trim="budgetExecuteRatioEnd"
                              :min="1"
                              :max="100"
                              :precision="0"
                              class="item-range-input"
                            />
                            %
                          </div>
                        </div>
                        <div class="popover-content-item">
                          <div class="item-label">主管单位非税收入规模：</div>
                          <a-select
                            class="item-select"
                            placeholder="请选择"
                            v-model="manageNoTaxScale"
                          >
                            <a-select-option
                              v-for="item in noTaxScaleOptions"
                              :key="item.label"
                              :title="item.value"
                              :value="item.value"
                            >
                              {{ item.label }}
                            </a-select-option>
                          </a-select>
                        </div>
                        <div class="popover-content-item">
                          <div class="item-label">预算单位非税收入规模：</div>
                          <a-select
                            class="item-select"
                            placeholder="请选择"
                            v-model="budgetNoTaxScale"
                          >
                            <a-select-option
                              v-for="item in noTaxScaleOptions"
                              :key="item.label"
                              :title="item.value"
                              :value="item.value"
                            >
                              {{ item.label }}
                            </a-select-option>
                          </a-select>
                        </div>
                      </div>
                      <div class="graph-popover-footer">
                        <a-button @click="cancelFilter">取消</a-button>
                        <a-button type="primary" @click="confirmFilter">
                          确定</a-button
                        >
                      </div>
                    </template>
                    <a-button
                      type="primary"
                      class="graph-filter-btn"
                      icon="filter"
                      >筛选
                    </a-button>
                  </a-popover>
                  <a-popover
                    trigger="click"
                    title="展示配置"
                    overlayClassName="graph-popover"
                    placement="bottomLeft"
                    v-model="showVisible"
                  >
                    <template slot="content">
                      <div class="graph-popover-content">
                        <!-- <div class="popover-content-item">
                          <div class="item-label">显示层级：</div>
                          <a-select
                            class="item-select"
                            placeholder="请选择"
                            v-model="showLevel"
                          >
                            <a-select-option
                              v-for="item in levelOptions"
                              :key="item.label"
                              :title="item.value"
                              :value="item.value"
                            >
                              {{ item.label }}
                            </a-select-option>
                          </a-select>
                        </div> -->
                        <div class="popover-content-item">
                          <div class="item-label">排序字段：</div>
                          <a-select
                            mode="multiple"
                            class="item-select"
                            placeholder="请选择"
                            v-model="sortWay"
                          >
                            <a-select-option
                              v-for="item in sortOptions"
                              :key="item.label"
                              :title="item.value"
                              :value="item.value"
                            >
                              {{ item.label }}
                            </a-select-option>
                          </a-select>
                        </div>
                        <div class="popover-content-item">
                          <div class="item-label">排序方式：</div>
                          <a-select
                            class="item-select"
                            placeholder="请选择"
                            v-model="sortType"
                          >
                            <a-select-option value="asc">
                              升序
                            </a-select-option>
                            <a-select-option value="desc">
                              降序
                            </a-select-option>
                          </a-select>
                        </div>
                      </div>
                      <div class="graph-popover-footer">
                        <a-button @click="cancelShow">取消</a-button>
                        <a-button type="primary" @click="confirmShow">
                          确定</a-button
                        >
                      </div>
                    </template>
                    <a-button type="primary" class="graph-show-btn"
                      >展示
                    </a-button>
                  </a-popover>
                  <div class="graph-filter-tools">
                    <icon-svg icon-class="icon_zoomIn" @click="handleZoomIn" />
                    <icon-svg
                      icon-class="icon_zoomOut"
                      @click="handleZoomOut"
                    />
                  </div>
                </div>
                <div class="graph-detail" ref="graph"></div>
              </div>
              <div class="structure-analysis-detail-box-content-list">
                <div class="sub-title">明细指标数据</div>
                <!-- 操作按钮 -->
                <div class="top-action">
                  <a-button class="top-action-btn" @click="sortShow = true">
                    <div class="top-action-btn-icon">
                      <icon-svg icon-class="排序"></icon-svg>
                    </div>
                    排序
                  </a-button>
                </div>
                <!-- 预算单位表格 -->
                <a-table
                  v-if="this.tableType === 'budget'"
                  class="structure-analysis-table"
                  :columns="columns2"
                  :dataSource="dataSource2"
                  :pagination="pagination"
                  :scroll="{ x: 'max-content', y: 800 }"
                  bordered
                ></a-table>
                <a-table
                  v-if="this.tableType === 'manage'"
                  class="structure-analysis-table"
                  :columns="columns"
                  :dataSource="dataSource"
                  :pagination="pagination"
                  :scroll="{ x: 'max-content', y: 800 }"
                  bordered
                ></a-table>
              </div>
            </div>
          </div>
        </div>
      </template>
    </MainContent>
    <!-- 资产明细查询排序按钮 -->
    <SortModal
      :sortTitle="
        tableType === 'manage'
          ? '主管单位明细指标数据查询排序配置'
          : '预算单位明细指标数据查询排序配置'
      "
      :sortShow="sortShow"
      @onSortCancel="onSortCancel"
      @onSortConfirm="onSortConfirm"
      :sortOptions="
        tableType === 'manage' ? manageTableSortOptions : budgetTableSortOptions
      "
    ></SortModal>
  </div>
</template>
<script>
import MainContent from "@/components/mainContent";
import SortModal from "@/components/sortModal.vue";
import {
  queryOrgStruct,
  queryBudgOrgDtlIndData,
  querySupOrgDtlIndData,
  querySubOrg,
  getManageSortOptions,
  getBudgetSortOptions,
} from "@/shared/newApi/structureAnalysis.js";
import G6 from "@antv/g6";
import { Button, Icon, Input, InputNumber, Popover } from "ant-design-vue";
import { mapState, mapMutations } from "vuex";
import { isNumber } from "@/utils/common.js";

export default {
  name: "structureAnalysis",
  components: {
    AIcon: Icon,
    AButton: Button,
    APopover: Popover,
    AInputNumber: InputNumber,
    AInput: Input,
    MainContent,
    SortModal,
  },
  data() {
    return {
      choosedYear: null,
      yearOptions: [
        {
          label: "2019",
          value: "2019",
        },
        {
          label: "2020",
          value: "2020",
        },
        {
          label: "2021",
          value: "2021",
        },
        {
          label: "2022",
          value: "2022",
        },
        {
          label: "2023",
          value: "2023",
        },
      ],
      //筛选
      filterVisible: false,
      showVisible: false,
      manageUnitName: undefined,
      budgetUnitName: undefined,
      manageBudgetScale: "0",
      budgetBudgetScale: "0",
      budgetScaleOptions: [
        {
          label: "全部",
          value: "0",
        },
        {
          label: "0-1000万元",
          value: "1",
        },
        {
          label: "1000-5000万元",
          value: "2",
        },
        {
          label: "5000-10000万元",
          value: "3",
        },
        {
          label: "10000万元以上",
          value: "4",
        },
      ],
      manageSpendScale: "0",
      budgetSpendScale: "0",
      spendScaleOptions: [
        {
          label: "全部",
          value: "0",
        },
        {
          label: "0-1000万元",
          value: "1",
        },
        {
          label: "1000-5000万元",
          value: "2",
        },
        {
          label: "5000-10000万元",
          value: "3",
        },
        {
          label: "10000万元以上",
          value: "4",
        },
      ],
      manageNoTaxScale: "0",
      budgetNoTaxScale: "0",
      noTaxScaleOptions: [
        {
          label: "全部",
          value: "0",
        },
        {
          label: "0-1000万元",
          value: "1",
        },
        {
          label: "1000-5000万元",
          value: "2",
        },
        {
          label: "5000-10000万元",
          value: "3",
        },
        {
          label: "10000万元以上",
          value: "4",
        },
      ],
      manageExecuteRatioStart: undefined,
      budgetExecuteRatioStart: undefined,
      manageExecuteRatioEnd: undefined,
      budgetExecuteRatioEnd: undefined,

      //展示
      showLevel: "1",
      levelOptions: [
        {
          label: "一级：行政事业板块",
          value: "1",
        },
        {
          label: "二级：主管单位",
          value: "2",
        },
        {
          label: "三级：预算单位",
          value: "3",
        },
        {
          label: "四级：预算单位内设机构",
          value: "4",
        },
      ],
      sortWay: ["executeRatio2,unit_execute_rate"],
      sortType: "desc",
      sortShow: false,
      sortOptions: [
        {
          label: "预算金额",
          value: "budgetMoney2,unit_budget_amount",
        },
        {
          label: "执行金额",
          value: "executeMoney2,unit_payout_amount",
        },
        {
          label: "执行率",
          value: "executeRatio2,unit_execute_rate",
        },
        {
          label: "非税收入金额",
          value: "noTaxMoney2,jkje_total",
        },
      ],
      manageTableSortOptions: [],
      budgetTableSortOptions: [],
      tableType: "manage",
      selectedNode: null,
      // 主管单位表头
      columns: [
        {
          title: "板块名称",
          dataIndex: "name",
          key: "name",
          width: 200,
        },
        {
          title: "主管单位",
          dataIndex: "unit",
          key: "unit",
          width: 200,
        },
        {
          title: "支出金额(万元)",
          dataIndex: "spendMoney",
          key: "spendMoney",
          width: 150,
        },
        {
          title: "支出占比(本级所有)",
          dataIndex: "spendPer",
          key: "spendPer",
          width: 200,
        },
        {
          title: "支出占比(同板块)",
          dataIndex: "blockSpendPer",
          key: "blockSpendPer",
          width: 190,
        },
        {
          title: "支出占比排名(同板块)",
          dataIndex: "spendPerSort",
          key: "spendPerSort",
          width: 190,
        },
        {
          title: "执行率",
          dataIndex: "executeRatio",
          key: "executeRatio",
          width: 115,
        },
        {
          title: "执行率排名(同板块)",
          dataIndex: "executeSort",
          key: "executeSort",
          width: 180,
        },
        {
          title: "非税收入金额(万元)",
          dataIndex: "noTaxMoney",
          key: "noTaxMoney",
          width: 170,
        },
        {
          title: "非税收入占比(同板块)",
          dataIndex: "noTaxMoneyBlockRatio",
          key: "noTaxMoneyBlockRatio",
          width: 200,
        },
        {
          title: "非税收入占比(全市)",
          dataIndex: "noTaxMoneyCityRatio",
          key: "noTaxMoneyCityRatio",
          width: 200,
        },
        {
          title: "非税收入排名(同板块)",
          dataIndex: "noTaxMoneyBlockSort",
          key: "noTaxMoneyBlockSort",
          width: 200,
        },
        {
          title: "非税收入排名(全市)",
          dataIndex: "noTaxMoneyCitySort",
          key: "noTaxMoneyCitySort",
          width: 200,
        },
      ],
      // 表格数据来源
      dataSource: [
        // {
        //   name: "资产名称",
        //   unit: "主管单位名称",
        //   spendMoney: 12345,
        //   spendPer: "14%",
        //   blockSpendPer: "30%",
        //   spendPerSort: 12,
        //   executeRatio: "32%",
        //   executeSort: 17,
        //   noTaxMoney: 8766,
        //   noTaxMoneyCityRatio: "15%",
        //   noTaxMoneyBlockRatio: "56%",
        //   noTaxMoneyBlockSort: 13,
        //   noTaxMoneyCitySort: 56,
        // },
      ],
      // 预算单位表头
      columns2: [
        {
          title: "主管单位名称",
          dataIndex: "name",
          key: "name",
          width: 200,
        },
        {
          title: "预算单位",
          dataIndex: "budget",
          key: "budget",
          width: 200,
        },
        {
          title: "支出金额(万元)",
          dataIndex: "spendMoney",
          key: "spendMoney",
          width: 140,
        },
        {
          title: "支出占比(本级所有)",
          dataIndex: "spendPer",
          key: "spendPer",
          width: 200,
        },
        {
          title: "支出占比(同主管单位)",
          dataIndex: "unitSpendPer",
          key: "unitSpendPer",
          width: 200,
        },
        {
          title: "支出占比排名(同主管单位)",
          dataIndex: "spendPerSort",
          key: "spendPerSort",
          width: 250,
        },
        {
          title: "执行率",
          dataIndex: "executeRatio",
          key: "executeRatio",
          width: 110,
        },
        {
          title: "执行率排名(同主管单位)",
          dataIndex: "executeSort",
          key: "executeSort",
          width: 250,
        },
        {
          title: "非税收入金额(万元)",
          dataIndex: "noTaxMoney",
          key: "noTaxMoney",
          width: 170,
        },
        {
          title: "非税收入占比(同级)",
          dataIndex: "noTaxMoneyBudgetRatio",
          key: "noTaxMoneyBudgetRatio",
          width: 200,
        },
        {
          title: "非税收入占比(同主管单位)",
          dataIndex: "noTaxMoneyUnitRatio",
          key: "noTaxMoneyUnitRatio",
          width: 250,
        },
        {
          title: "非税收入排名(同主管单位)",
          dataIndex: "noTaxMoneyUnitSort",
          key: "noTaxMoneyUnitSort",
          width: 250,
        },
      ],
      // 预算单位表格数据来源
      dataSource2: [
        // {
        //   name: "主管单位名称",
        //   budget: "预算单位名称",
        //   spendMoney: 12345,
        //   spendPer: "14%",
        //   unitSpendPer: "30%",
        //   spendPerSort: 12,
        //   executeRatio: "32%",
        //   executeSort: 17,
        //   noTaxMoney: 8766,
        //   noTaxMoneyBudgetRatio: "15%",
        //   noTaxMoneyUnitRatio: "56%",
        //   noTaxMoneyUnitSort: 56,
        // },
        // {
        //   name: "主管单位名称",
        //   budget: "预算单位名称",
        //   spendMoney: 12345,
        //   spendPer: "14%",
        //   unitSpendPer: "30%",
        //   spendPerSort: 12,
        //   executeRatio: "32%",
        //   executeSort: 17,
        //   noTaxMoney: 8766,
        //   noTaxMoneyBudgetRatio: "15%",
        //   noTaxMoneyUnitRatio: "56%",
        //   noTaxMoneyUnitSort: 56,
        // },
        // {
        //   name: "主管单位名称",
        //   budget: "预算单位名称",
        //   spendMoney: 12345,
        //   spendPer: "14%",
        //   unitSpendPer: "30%",
        //   spendPerSort: 12,
        //   executeRatio: "32%",
        //   executeSort: 17,
        //   noTaxMoney: 8766,
        //   noTaxMoneyBudgetRatio: "15%",
        //   noTaxMoneyUnitRatio: "56%",
        //   noTaxMoneyUnitSort: 56,
        // },
      ],
      pagination: {
        size: "small",
        total: 0,
        current: 1,
        pageSize: 15,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ["5", "10", "15", "20"],
        showTotal: (total) => {
          return `共${total}条记录`;
        },
        onChange: (page, pageSize) => {
          this.pagination.current = page;
          this.pagination.pageSize = pageSize;
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = 1;
          this.pagination.pageSize = size;
        },
      },
      // data: {},
      data: {
        name: "上海市",
        id: "1",
        hasChildren: true,
        collapsed: false,
        children: [
          {
            name: "交通",
            id: "1-1",
            hasChildren: true,
            collapsed: false,
            children: [
              {
                name: "交管局1",
                id: "1-1-1",
                budgetMoney: 1233,
                executeMoney: 2223,
                executeRatio: "15",
                noTaxMoney: 1233,
                hasChildren: true,
                collapsed: true,
                parentId: "交通",
                children: [
                  {
                    name: "事故处理中心",
                    id: "1-1-1-1",
                    budgetMoney: 1233,
                    executeMoney: 2223,
                    executeRatio: "15",
                    noTaxMoney: 1233,
                    hasChildren: true,
                    collapsed: false,
                    parentId: "交管局1",
                    children: [
                      {
                        name: "事故处理一处",
                        id: "1-1-1-1-1",
                        budgetMoney: 1233,
                        executeMoney: 2223,
                        executeRatio: "15",
                        noTaxMoney: 1233,
                        hasChildren: false,
                      },
                      {
                        name: "事故处理二处",
                        id: "1-1-1-1-2",
                        budgetMoney: 1233,
                        executeMoney: 2223,
                        executeRatio: "15",
                        noTaxMoney: 1233,
                        hasChildren: false,
                      },
                      {
                        name: "事故处理三处",
                        id: "1-1-1-1-3",
                        budgetMoney: 1233,
                        executeMoney: 2223,
                        executeRatio: "15",
                        noTaxMoney: 1233,
                        hasChildren: false,
                      },
                      {
                        name: "事故处理四处",
                        id: "1-1-1-1-4",
                        budgetMoney: 1233,
                        executeMoney: 2223,
                        executeRatio: "15",
                        noTaxMoney: 1233,
                        hasChildren: false,
                      },
                    ],
                  },
                  {
                    name: "业务中心",
                    id: "1-1-1-2",
                    budgetMoney: 1233,
                    executeMoney: 2223,
                    executeRatio: "15",
                    noTaxMoney: 1233,
                    hasChildren: false,
                    collapsed: false,
                  },
                ],
              },
            ],
          },
          {
            name: "公检法",
            id: "1-2",
            hasChildren: true,
            collapsed: false,
            children: [
              {
                name: "公检法11",
                id: "1-2-3",
                budgetMoney: 1233,
                executeMoney: 2223,
                executeRatio: "15",
                noTaxMoney: 1233,
                hasChildren: true,
                children: [],
              },
            ],
          },
          {
            name: "科技",
            id: "1-3",
            hasChildren: false,
          },
          {
            name: "医疗卫生",
            id: "1-4",
            hasChildren: false,
          },
          {
            name: "教育",
            id: "1-5",
            hasChildren: false,
          },
          {
            name: "城乡建设",
            id: "1-6",
            hasChildren: false,
          },
          {
            name: "基础设施",
            id: "1-7",
            hasChildren: false,
          },
          {
            name: "经济",
            id: "1-8",
            hasChildren: false,
          },
        ],
      },
      myChart: null,
      canvasWidth: 0,
      canvasHeight: 800,
      canvasRatio: 1,
      odName: "executeRatio desc",
    };
  },
  computed: {
    ...mapState("blockAnalysis", ["blockChoosedYear"]),
    curYear: {
      get() {
        return this.blockChoosedYear;
      },
      set(val) {
        this.setBlockChoosedYear(val);
      },
    },
  },
  async mounted() {
    this.choosedYear = this.curYear;
    //！！！这边默认上海市的id为1
    this.getTableSortOptions();
    //初始展示层级数
    // this.init();
    await this.getTreeDataByLevel();
    // this.getTableData("manage", "1");

    setTimeout(() => {
      window.onresize = () => {
        if (!this.myChart || this.myChart.get("destroyed")) return;
        if (
          !this.container ||
          !this.container.offsetWidth ||
          !this.container.offsetHeight
        )
          return;
        this.myChart.changeSize(
          this.container.offsetWidth,
          this.container.offsetHeight
        );
      };
    }, 100);
  },

  methods: {
    ...mapMutations("blockAnalysis", {
      setBlockChoosedYear: "setBlockChoosedYear",
    }),
    async getTableSortOptions() {
      const res1 = await getManageSortOptions();
      this.manageTableSortOptions = res1.data;
      const res2 = await getBudgetSortOptions();
      this.budgetTableSortOptions = res2.data;
    },
    // 表格排序
    onSortCancel() {
      this.sortShow = false;
    },
    onSortConfirm(sortString) {
      this.odName = sortString;
      this.onSortCancel();
      if (!this.selectedNode) return;
      this.getTableData(this.tableType, this.selectedNode.parentId);
    },
    //筛选
    cancelFilter() {
      this.manageUnitName = undefined;
      this.budgetUnitName = undefined;
      this.manageBudgetScale = "0";
      this.budgetBudgetScale = "0";
      this.manageSpendScale = "0";
      this.budgetSpendScale = "0";
      this.manageNoTaxScale = "0";
      this.budgetNoTaxScale = "0";
      this.manageExecuteRatioStart = undefined;
      this.budgetExecuteRatioStart = undefined;
      this.manageExecuteRatioEnd = undefined;
      this.budgetExecuteRatioEnd = undefined;
      this.filterVisible = false;
      this.myChart.getNodes().map((item) => {
        item.clearStates(["highLight"]);
      });
    },
    async confirmFilter() {
      this.myChart.getNodes().map((item) => {
        const {
          budgetMoney,
          depth,
          executeMoney,
          executeRatio,
          name,
          noTaxMoney,
        } = item._cfg.model;
        const manageExecuteRatioStart = isNumber(this.manageExecuteRatioStart)
          ? this.manageExecuteRatioStart
          : -Infinity;
        const budgetExecuteRatioStart = isNumber(this.budgetExecuteRatioStart)
          ? this.budgetExecuteRatioStart
          : -Infinity;
        const manageExecuteRatioEnd = isNumber(this.manageExecuteRatioEnd)
          ? this.manageExecuteRatioEnd
          : Infinity;
        const budgetExecuteRatioEnd = isNumber(this.budgetExecuteRatioEnd)
          ? this.budgetExecuteRatioEnd
          : Infinity;
        // console.log(
        //   "test------------",
        //   depth,
        //   this.manageUnitName,
        //   this.budgetUnitName,
        //   name,
        //   this.manageBudgetScale,
        //   this.budgetBudgetScale,
        //   budgetMoney,
        //   this.manageSpendScale,
        //   this.budgetSpendScale,
        //   executeMoney,
        //   this.manageNoTaxScale,
        //   this.budgetNoTaxScale,
        //   noTaxMoney,
        //   manageExecuteRatioStart,
        //   budgetExecuteRatioStart,
        //   executeRatio,
        //   manageExecuteRatioEnd,
        //   budgetExecuteRatioEnd,
        //   manageExecuteRatioStart <= executeRatio,
        //   executeRatio <= manageExecuteRatioEnd
        // );
        if (
          (depth == 2 &&
            this.manageUnitName &&
            name.indexOf(this.manageUnitName) != -1 &&
            (this.manageBudgetScale == "0" ||
              (this.manageBudgetScale == "1" && budgetMoney < 1000) ||
              (this.manageBudgetScale == "2" &&
                budgetMoney >= 1000 &&
                budgetMoney < 5000) ||
              (this.manageBudgetScale == "3" &&
                budgetMoney >= 5000 &&
                budgetMoney < 10000) ||
              (this.manageBudgetScale == "4" && budgetMoney >= 10000)) &&
            (this.manageSpendScale == "0" ||
              (this.manageSpendScale == "1" && executeMoney < 1000) ||
              (this.manageSpendScale == "2" &&
                executeMoney >= 1000 &&
                executeMoney < 5000) ||
              (this.manageSpendScale == "3" &&
                executeMoney >= 5000 &&
                executeMoney < 10000) ||
              (this.manageSpendScale == "4" && executeMoney >= 10000)) &&
            (this.manageNoTaxScale == "0" ||
              (this.manageNoTaxScale == "1" && noTaxMoney < 1000) ||
              (this.manageNoTaxScale == "2" &&
                noTaxMoney >= 1000 &&
                noTaxMoney < 5000) ||
              (this.manageNoTaxScale == "3" &&
                noTaxMoney >= 5000 &&
                noTaxMoney < 10000) ||
              (this.manageNoTaxScale == "4" && noTaxMoney >= 10000)) &&
            manageExecuteRatioStart <= executeRatio &&
            executeRatio <= manageExecuteRatioEnd) ||
          (depth == 3 &&
            this.budgetUnitName &&
            name.indexOf(this.budgetUnitName) != -1 &&
            (this.budgetBudgetScale == "0" ||
              (this.budgetBudgetScale == "1" && budgetMoney < 1000) ||
              (this.budgetBudgetScale == "2" &&
                budgetMoney >= 1000 &&
                budgetMoney < 5000) ||
              (this.budgetBudgetScale == "3" &&
                budgetMoney >= 5000 &&
                budgetMoney < 10000) ||
              (this.budgetBudgetScale == "4" && budgetMoney >= 10000)) &&
            (this.budgetSpendScale == "0" ||
              (this.budgetSpendScale == "1" && executeMoney < 1000) ||
              (this.budgetSpendScale == "2" &&
                executeMoney >= 1000 &&
                executeMoney < 5000) ||
              (this.budgetSpendScale == "3" &&
                executeMoney >= 5000 &&
                executeMoney < 10000) ||
              (this.budgetSpendScale == "4" && executeMoney >= 10000)) &&
            (this.budgetNoTaxScale == "0" ||
              (this.budgetNoTaxScale == "1" && noTaxMoney < 1000) ||
              (this.budgetNoTaxScale == "2" &&
                noTaxMoney >= 1000 &&
                noTaxMoney < 5000) ||
              (this.budgetNoTaxScale == "3" &&
                noTaxMoney >= 5000 &&
                noTaxMoney < 10000) ||
              (this.budgetNoTaxScale == "4" && noTaxMoney >= 10000)) &&
            budgetExecuteRatioStart <= executeRatio &&
            executeRatio <= budgetExecuteRatioEnd)
        ) {
          console.log("bingo------", item);
          this.myChart.setItemState(item, "highLight", true);
        } else {
          this.myChart.setItemState(item, "highLight", false);
        }
      });
      this.filterVisible = false;
    },

    //展示
    cancelShow() {
      this.sortType = "desc";
      this.sortWay = ["executeRatio2,unit_execute_rate"];
      this.showVisible = false;
    },
    async confirmShow() {
      await this.getTreeDataByLevel();
    },

    //年份修改
    async handleYearChange() {
      await this.getTreeDataByLevel();
    },
    handleMoveTree(graph) {
      // 默认将根节点移动到屏幕中间左边
      const item = graph.findById(this.data.id);
      const model = item.getModel();
      const point = graph.getCanvasByPoint(model.x, model.y);

      graph.translate(-point.x, -point.y + this.canvasHeight / 2);
    },
    //获取整体树层级树  筛选和排序时候调用
    async getTreeDataByLevel() {
      // todo
      const json = {
        choosedYear: this.choosedYear,
        sortWay: this.sortWay.map((item) => item.split(",")[0]).join(","),
        sortType: this.sortType,
      };
      const res = await queryOrgStruct(json);
      console.log("🚀 ~ getTreeDataByLevel ~ res:", res);
      if (res.message === "成功") {
        this.data.children = res.data;
      } else {
        this.$message(res.message);
      }
      this.init();
    },

    //获取下一层级树  点击节点伸缩图标调用
    async getNextLevel(model) {
      const json = {
        id: model.depth == 1 ? model.name : model.id,
        level: 1,
        choosedYear: this.choosedYear,
        sortWay:
          model.depth == 1
            ? this.sortWay.map((item) => item.split(",")[0]).join(",")
            : this.sortWay.map((item) => item.split(",")[1]).join(","),
        sortType: this.sortType,
      };
      const loading = this.$message.loading("正在查询", 0);
      const res = await querySubOrg(json);
      loading();
      if (res.message === "成功") {
        return res.data;
      } else {
        this.$message(res.message);
        return [];
      }
    },

    //点击主管单位或者预算单位，获取表格数据
    async getTableData(type, id) {
      // isGetAll: 是否展示上海市所有主管单位 1:是 0:否
      const json = {
        id,
        year: this.choosedYear,
        odName: this.odName,
        pageSize: this.pagination.pageSize,
        pageOffset: this.pagination.pageSize * (this.pagination.current - 1),
      };
      const res =
        type === "manage"
          ? await querySupOrgDtlIndData(json)
          : await queryBudgOrgDtlIndData(json);

      if (res.message === "成功") {
        type === "manage"
          ? (this.dataSource = res.data)
          : (this.dataSource2 = res.data);
      } else {
        this.$message(res.message);
      }
    },

    COLLAPSE_ICON(x, y, r) {
      return [
        ["M", x - r, y - r],
        ["a", r, r, 0, 1, 0, r * 2, 0],
        ["a", r, r, 0, 1, 0, -r * 2, 0],
        ["M", x + 3 - r, y - r],
        ["L", x + r - 3, y - r],
      ];
    },

    EXPAND_ICON(x, y, r) {
      return [
        ["M", x - r, y - r],
        ["a", r, r, 0, 1, 0, r * 2, 0],
        ["a", r, r, 0, 1, 0, -r * 2, 0],
        ["M", x + 3 - r, y - r],
        ["L", x + r - 3, y - r],
        ["M", x, y - 2 * r + 3],
        ["L", x, y - 3],
      ];
    },

    getIcon(cfg) {
      if (cfg.hasChildren && cfg.collapsed === undefined) {
        return this.EXPAND_ICON;
      } else {
        return cfg.collapsed ? this.EXPAND_ICON : this.COLLAPSE_ICON;
      }
    },

    init() {
      const _that = this;
      this.container = this.$refs.graph;
      this.canvasWidth = this.container.offsetWidth;
      this.canvasHeight = this.container.offsetHeight || 800;

      if (this.myChart) {
        this.myChart.destroy();
      }

      const defaultNodeStyle = {
        fill: "#fff",
        stroke: "#1776FF",
        radius: 4,
        lineWidth: 1,
      };

      const defaultEdgeStyle = {
        stroke: "#E3E6EB",
        endArrow: {
          path: "M 0,0 L 0, -3 L -9,0 L 0, 3 Z",
          fill: "#1776FF",
          stroke: "#1776FF",
          d: 0,
        },
        reverseArrow: {
          path: "M 0,0 L 0, -3 L 9,0 L 0, 3 Z",
          fill: "#1776FF",
          stroke: "#1776FF",
          d: -50,
        },
      };

      const defaultLayout = {
        type: "compactBox",
        direction: "H", //V 垂直分布  H 水平分布
        getId: function getId(d) {
          return d.id;
        },
        getVGap: function getVGap() {
          return 7;
        },
        getHGap: function getHGap() {
          return 90;
        },
        getSide: () => {
          /**上下布局，此处判断在节点上还是下**/
          return "right";
        },
      };

      const defaultLabelCfg = {
        style: {
          fill: "#3C485C",
          fontSize: 14,
          fontFamily: "PingFang SC",
        },
      };

      // 中间节点
      G6.registerNode(
        "label-node",
        {
          draw(cfg, group) {
            const styles = this.getShapeStyle(cfg);
            const { labelCfg = {} } = cfg;

            const keyShape = group.addShape("rect", {
              attrs: {
                ...styles,
                fill: "#CCE2FF",
                stroke: "#016EFF",
                x: 0,
                y: 0,
                width: 120,
                height: 40,
                radius: 6,
              },
            });

            if (cfg.name) {
              /** 判断文字位置，折行等 **/
              const wrapNum = 7;
              let content = cfg.name;
              if (cfg.name.length > wrapNum) {
                content = content.slice(0, wrapNum - 1) + "...";
              }
              /**添加节点名称**/
              group.addShape("text", {
                attrs: {
                  ...labelCfg.style,
                  fill: "#016EFF",
                  fontSize: 14,
                  text: content,
                  lineHeight: 40,
                  textAlign: "center",
                  x: 60, // 调试出来的距离
                  y: 28, // 调试出来的距离
                  width: 120,
                  height: 40,
                },
                name: "label-text",
              });
            }
            if (cfg.hasChildren) {
              const bbox = keyShape.getBBox();
              group.addShape("marker", {
                attrs: {
                  x: bbox.width + 8,
                  y: bbox.height / 2 + 5,
                  r: 6,
                  lineWidth: 1,
                  stroke: "l(90) 0:#0A84FF 1:#64D2FF",
                  fill: "transparent",
                  cursor: "pointer",
                  symbol: _that.getIcon(cfg),
                },
                name: "collapse-icon",
              });
            }

            return keyShape;
          },
          update: (cfg, item) => {
            const group = item.getContainer();
            const icon = group.find((e) => e.get("name") === "collapse-icon");
            icon.attr("symbol", _that.getIcon(cfg));
          },
        },
        "rect"
      );

      // 普通节点
      G6.registerNode(
        "default-node",
        {
          draw(cfg, group) {
            const styles = this.getShapeStyle(cfg);
            const { labelCfg = {} } = cfg;

            const keyShape = group.addShape("rect", {
              attrs: {
                ...styles,
                fill: "#fff",
                stroke: "#016EFF",
                x: 0,
                y: 0,
                width: 120,
                height: 40,
                radius: 6,
              },
            });

            if (cfg.name) {
              /** 判断文字位置，折行等 **/
              const wrapNum = 7;
              let content = cfg.name;
              if (cfg.name.length > wrapNum) {
                content = content.slice(0, wrapNum - 1) + "...";
              }
              /**添加节点名称**/
              group.addShape("text", {
                attrs: {
                  ...labelCfg.style,
                  fill: "#3C485C",
                  fontSize: 14,
                  text: content,
                  lineHeight: 40,
                  textAlign: "center",
                  x: 60, // 调试出来的距离
                  y: 28, // 调试出来的距离
                  width: 120,
                  height: 40,
                },
                name: "node-label",
              });
            }
            if (cfg.hasChildren) {
              const bbox = keyShape.getBBox();
              group.addShape("marker", {
                attrs: {
                  x: bbox.width + 8,
                  y: bbox.height / 2 + 5,
                  r: 6,
                  lineWidth: 1,
                  stroke: "l(90) 0:#0A84FF 1:#64D2FF",
                  fill: "transparent",
                  cursor: "pointer",
                  symbol: _that.getIcon(cfg),
                },
                name: "collapse-icon",
              });
            }

            return keyShape;
          },
          update: (cfg, item) => {
            const group = item.getContainer();
            const icon = group.find((e) => e.get("name") === "collapse-icon");
            icon.attr("symbol", _that.getIcon(cfg));
          },
        },
        "rect"
      );

      // 注册首节点
      G6.registerNode(
        "first-node",
        {
          draw(cfg, group) {
            const styles = this.getShapeStyle(cfg);
            const { labelCfg = {} } = cfg;

            const keyShape = group.addShape("rect", {
              attrs: {
                ...styles,
                fill: "l(0) 0:rgba(1, 110, 255, 0.6) 1:rgba(1, 110, 255, 1)",
                stroke: "l(0) 0:rgba(1, 110, 255, 0.6) 1:rgba(1, 110, 255, 1)",
                x: 0,
                y: 0,
                width: 120,
                height: 40,
              },
            });

            if (cfg.name) {
              /** 判断文字位置，折行等 **/
              const wrapNum = 7;
              let content = cfg.name;
              if (cfg.name.length > wrapNum) {
                content = content.slice(0, wrapNum - 1) + "...";
              }
              /**添加节点名称**/
              group.addShape("text", {
                attrs: {
                  ...labelCfg.style,
                  fill: "#fff",
                  fontSize: 14,
                  text: content,
                  lineHeight: 40,
                  textAlign: "center",
                  x: 60, // 调试出来的距离
                  y: 28, // 调试出来的距离
                  width: 120,
                  height: 40,
                },
                name: "top-label",
              });
            }
            // if (cfg.hasChildren) {
            //   const bbox = keyShape.getBBox();
            //   group.addShape("marker", {
            //     attrs: {
            //       x: bbox.width + 8,
            //       y: bbox.height / 2 + 5,
            //       r: 6,
            //       lineWidth: 1,
            //       stroke: "l(90) 0:#0A84FF 1:#64D2FF",
            //       fill: "transparent",
            //       cursor: "pointer",
            //       symbol: _that.getIcon(cfg),
            //     },
            //     name: "collapse-icon",
            //   });
            // }

            return keyShape;
          },
          update: (cfg, item) => {
            const group = item.getContainer();
            const icon = group.find((e) => e.get("name") === "collapse-icon");
            icon.attr("symbol", _that.getIcon(cfg));
          },
        },
        "rect"
      );

      // 注册折线边
      G6.registerEdge("flow-line", {
        draw(cfg, group) {
          const startPoint = cfg.startPoint;
          const endPoint = cfg.endPoint;
          const { style } = cfg;
          const isTop = cfg.source === "1";
          //out代表对外投资
          let shape = group.addShape("path", {
            attrs: {
              stroke: "#0A84FF",
              endArrow: style.endArrow,
              path: [
                [
                  "M",
                  isTop
                    ? cfg.sourceNode.getBBox().maxX
                    : cfg.sourceNode.getBBox().maxX + 16,
                  startPoint.y,
                ],
                [
                  "L",
                  (cfg.sourceNode.getBBox().maxX + cfg.targetNode.getBBox().x) /
                    2,
                  startPoint.y,
                ],
                [
                  "L",
                  (cfg.sourceNode.getBBox().maxX + cfg.targetNode.getBBox().x) /
                    2,
                  endPoint.y,
                ],
                ["L", cfg.targetNode.getBBox().minX - 10, endPoint.y],
              ],
            },
          });
          return shape;
        },
      });

      const tooltip = new G6.Tooltip({
        offsetX: 10,
        offsetY: 10,
        // the types of items that allow the tooltip show up
        // 允许出现 tooltip 的 item 类型
        // itemTypes: ["node", "edge"],
        itemTypes: ["node"],
        // custom the tooltip's content
        // 自定义 tooltip 内容
        getContent: (e) => {
          const model = e.item.getModel();
          const outDiv = document.createElement("div");
          outDiv.style.width = "fit-content";
          outDiv.style.padding = "0px 2px 8px";
          outDiv.innerHTML =
            model.depth > 1
              ? `
            <div>
              <p style="font-size: 16px; font-weight: 600; margin-bottom: 8px">${
                model.name
              }</p>
              <p style="font-size: 14px; margin-bottom: 8px; color:#97A3B7">年份：<span style="color:#3C485C">${
                _that.choosedYear
              }</span></p>
              <p style="font-size: 14px; margin-bottom: 8px; color:#97A3B7">预算金额: <span style="color:#3C485C">${
                (model.budgetMoney &&
                  parseFloat(model.budgetMoney).toLocaleString()) ||
                0
              }万元</span></p>
              <p style="font-size: 14px; margin-bottom: 8px; color:#97A3B7">执行金额：: <span style="color:#3C485C">${
                (model.executeMoney &&
                  parseFloat(model.executeMoney).toLocaleString()) ||
                0
              }万元</span></p>
              <p style="font-size: 14px; margin-bottom: 8px; color:#97A3B7">执行率：<span style="color:#3C485C">${
                model.executeRatio
              }%</span></p>
              <p style="font-size: 14px; margin-bottom: 8px; color:#97A3B7">非税收入：<span style="color:#3C485C">${
                (model.noTaxMoney &&
                  parseFloat(model.noTaxMoney).toLocaleString()) ||
                0
              }万元</span></p>
            </div>`
              : `<div>
              <p style="font-size: 16px; font-weight: 600">${model.name}</p>
            </div>`;
          return outDiv;
        },
      });

      const graph = new G6.TreeGraph({
        container: this.container,
        width: this.canvasWidth,
        height: this.canvasHeight,
        linkCenter: true,
        plugins: [tooltip],
        minZoom: 1,
        maxZoom: 2.4,
        modes: {
          default: ["drag-canvas"],
        },
        defaultNode: {
          type: "default-node",
          size: [120, 40],
          style: defaultNodeStyle,
          labelCfg: defaultLabelCfg,
        },
        defaultEdge: {
          type: "flow-line",
          style: defaultEdgeStyle,
        },
        // 节点不同状态下的样式集合
        nodeStateStyles: {
          // 鼠标点击节点，即 click 状态为 true 时的样式
          click: {
            fill: "#1776FF",
            stroke: "#1776FF",
            "node-label": {
              fill: "#fff",
            },
          },
          // highLight 状态为 true 时的样式
          highLight: {
            stroke: "#FE9E17",
            fill: "#FFF9E6",
            "node-label": {
              fill: "#FE9E17",
            },
          },
        },
        layout: defaultLayout,
      });
      graph.get("canvas").set("localRefresh", false);

      graph.node((node) => {
        if (node.depth == 0) {
          return {
            id: node.id,
            type: "first-node",
          };
        } else if (node.depth == 1) {
          return {
            id: node.id,
            type: "label-node",
          };
        } else {
          return { ...node };
        }
      });

      // 监听事件
      graph.on("mousemove", () => {
        graph.get("canvas").set("localRefresh", false); // gitee上查到的避免拖动出现重影的方法
      });

      // 点击展开节点
      const handleClickNode = async (evt) => {
        const _that = this;
        const { item, target, currentTarget } = evt;
        const targetType = target.get("type");
        const model = item.getModel();
        console.log(
          "🚀 ~ handleClickNode ~ handleClickNode:",
          evt,
          model,
          item,
          targetType
        );
        if (targetType === "marker") {
          if (target.attr("symbol") === _that.EXPAND_ICON) {
            //判断点击为'+'号--展开
            let result = [];
            const icon = item
              .get("group")
              .find((element) => element.get("name") === "collapse-icon");
            if (model.copyChildren && model.copyChildren.length) {
              result = model.copyChildren;
            } else if (model.children && model.children.length) {
              result = model.children;
            } else if (model.depth >= 2) {
              //获取预算单位数据
              result = await _that.getNextLevel(model);
            } else {
              // 点击了板块的加号并且没有children数据，则置hasChildren为false并且隐藏图标
              model.children = [];
              model.hasChildren = false;
              icon.cfg.visible = false;
              this.graph.updateChild(model, model.id);
              this.$message.info("未查询到相关数据");
              return false;
            }
            if (!result.length) {
              // 实际没有children数据，则置hasChildren为false并且隐藏图标
              model.children = [];
              model.hasChildren = false;
              icon.cfg.visible = false;
              this.graph.updateChild(model, model.id);
              this.$message.info("未查询到相关数据");
              return false;
            }
            model.children = result;
            icon.attr("symbol", _that.COLLAPSE_ICON);
            model.collapsed = false;
            graph.updateChild(model, model.id);
            graph.focusItem(model.id);
          } else if (target.attr("symbol") === _that.COLLAPSE_ICON) {
            //如果是上海市不支持收缩了
            if (model.id == 1) {
              return;
            } else {
              model.copyChildren = model.children;
              model.children = [];
              const icon = item
                .get("group")
                .find((element) => element.get("name") === "collapse-icon");
              icon.attr("symbol", _that.EXPAND_ICON);
              model.collapsed = true;
              graph.updateChild(model, model.id);
              if (!model.hasChildren) {
                return false;
              }
              graph.focusItem(model.id);
            }
          }
        } else if (targetType === "rect" || targetType === "text") {
          // 点击节点样式更改+表格数据更新
          if (model.id === _that.data.id) return; // 不给根节点添加样式
          // 先重置所有节点的点击样式
          const itemMap = currentTarget.cfg.itemMap;
          for (let i in itemMap) {
            const _item = itemMap[i];
            graph.setItemState(_item, "click", false);
          }
          // const isClicked = item.hasState("click"); // 获取节点的点击状态
          // 当点击节点为主管单位或者预算单位时表格数据展示
          if (model.depth == 2) {
            _that.tableType = "manage";
            _that.selectedNode = model;
            _that.$set(_that.pagination, "current", 1);
            _that.$set(_that.pagination, "pageSize", 15);
            _that.$set(_that.pagination, "total", 0);
            _that.getTableData("manage", model.parentId);
            // 选中当前节点
            graph.setItemState(item, "click", true);
          } else if (model.depth == 3) {
            _that.tableType = "budget";
            _that.selectedNode = model;
            _that.$set(_that.pagination, "current", 1);
            _that.$set(_that.pagination, "pageSize", 15);
            _that.$set(_that.pagination, "total", 0);
            _that.getTableData("budget", model.parentId);
            // 选中当前节点
            graph.setItemState(item, "click", true);
          }
        }
      };

      graph.on("node:click", handleClickNode);
      graph.on("node:touchend", handleClickNode);

      graph.data(this.data);
      graph.render();
      // graph.fitCenter();
      this.handleMoveTree(graph);
      this.myChart = graph;
    },
    handleZoomIn() {
      const center = {
        x: this.canvasWidth / 2,
        y: this.canvasHeight / 2,
      };
      this.myChart.zoom(1.25, center);
    },
    handleZoomOut() {
      const center = {
        x: this.canvasWidth / 2,
        y: this.canvasHeight / 2,
      };
      this.myChart.zoom(0.8, center);
    },
  },
};
</script>
<style lang="less">
.structure-analysis {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  &-detail {
    width: 100%;
    min-height: 100%;

    &-box {
      padding: 20px;

      &-content {
        padding: 20px;
        background: #ffffff;
        // display: flex;

        &-graph {
          width: 100%;
          height: 852px;
          background: #f7faff;
          margin-bottom: 20px;
          position: relative;

          .graph-filter {
            height: 32px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            position: absolute;
            right: 20px;
            top: 20px;

            &-item {
              display: flex;
              align-items: center;
              margin-right: 16px;

              .item-value {
                width: 120px;
              }
            }

            .graph-filter-btn,
            .graph-show-btn {
              margin-left: 8px;
              border-radius: 6px;
            }
            .graph-show-btn {
              margin-left: 8px;
              border-radius: 6px;
            }

            .graph-filter-icon {
              width: 14px;
              height: 14px;
              margin-right: 16px;
              color: #016eff;
              cursor: pointer;
            }

            &-tools {
              .svg-icon {
                width: 16px;
                height: 16px;
                color: @blue;
                cursor: pointer;
                margin-left: 24px;
              }
            }
          }
        }

        &-list {
          position: relative;

          // 图标操作按钮
          .top-action {
            display: flex;
            position: absolute;
            right: 0;
            top: 0;

            &-btn {
              width: 84px;
              height: 32px;
              margin-left: 10px;
              border-radius: 6px;
              padding: 6px 16px;
              display: flex;
              align-items: center;
              font-size: 14px;
              color: #3c485c;

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
    }
  }
}

.graph-popover {
  width: 400px;
  .ant-popover-title {
    font-weight: 600;
    padding: 16px 20px;
    font-size: 16px;
  }
  &-content {
    .popover-content-item {
      margin-bottom: 8px;

      .item-label {
        height: 20px;
        margin-bottom: 8px;
      }

      .item-range-input {
        width: 134px;
      }
    }

    .popover-content-two {
      display: flex;
      justify-content: space-between;
    }

    .item-select {
      width: 100%;
    }
  }

  &-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;

    .ant-btn {
      border-radius: 6px;
      margin-left: 10px;
    }
  }
}
</style>
