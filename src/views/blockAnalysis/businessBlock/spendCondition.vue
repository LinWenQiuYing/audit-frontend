<template>
  <div class="spend-condition">
    <!-- 支出数据概览 -->
    <div class="sub-title">支出概览</div>
    <div class="data-overview">
      <div class="data-overview-item">
        <div class="item-top">
          <div class="item-top-title">支出数据概览</div>
          <a-tooltip placement="topLeft" overlayClassName="item-title-tooltip">
            <template slot="title">
              <span>111111</span>
            </template>
            <div class="tooltip-icon">
              <icon-svg icon-class="icon-warning" color="#1776FF"></icon-svg>
            </div>
          </a-tooltip>
        </div>
        <div class="item-split"></div>
        <div class="item-content-left">
          <div
            v-for="(item, index) in spendData"
            :key="index"
            :class="[
              'left-unit',
              {
                'left-unit-second':
                  item.typeName === '项目数（个）' ||
                  item.typeName === '人员数（人）' ||
                  item.typeName === '人均支出金额（万元）',
              },
            ]"
          >
            <div class="unit-top">{{ item.typeName }}</div>
            <div class="unit-middle">
              {{ Number(item.num).toLocaleString() }}
            </div>
            <div class="unit-bottom">
              <span class="unit-bottom-title">同比 {{ item.percentage }}</span>
              <div class="unit-bottom-icon">
                <icon-svg
                  icon-class="icon-up"
                  color="#E31430"
                  v-if="item.status === 1"
                />
                <icon-svg
                  icon-class="icon-down"
                  color="#1BB46D"
                  v-else-if="item.status === 0"
                />
                <icon-svg icon-class="icon-down" color="#97A3B7" v-else />
              </div>
            </div>
            <div class="unit-icon">
              <icon-svg :icon-class="`${item.icon}`"></icon-svg>
            </div>
          </div>
        </div>
      </div>
      <div class="data-overview-item">
        <div class="item-top">
          <div class="item-top-title">整体支出均衡性</div>
          <div class="flex">
            <div class="right-action-label">均衡性比例：</div>
            <a-input-number
              class="right-action-input"
              placeholder="请选择"
              :formatter="(value) => (value ? `${value}%` : '')"
              :parser="(value) => value.replace('%', '')"
              :min="0"
              :max="100"
              v-model="ratioNumber"
              @change="handleRatioChange"
            />
            <div
              class="action-choose"
              @click="handleChooseManage('整体支出均衡性主管单位选择')"
            >
              请选择展示主管单位
            </div>
            <div
              class="action-reset"
              style="margin-right: 8px"
              @click="initGraph1()"
            >
              重置
            </div>
            <a-tooltip
              placement="topLeft"
              overlayClassName="item-title-tooltip"
            >
              <template slot="title">
                <span>111111</span>
              </template>
              <div class="tooltip-icon">
                <icon-svg icon-class="icon-warning" color="#1776FF"></icon-svg>
              </div>
            </a-tooltip>
          </div>
        </div>
        <div class="item-split"></div>
        <div class="item-content-right">
          <div class="right-graph" ref="graph1"></div>
          <!-- <div class="right-action">
            <div class="right-action-label">均衡性比例：</div>
            <a-input-number
              class="right-action-input"
              placeholder="请选择"
              :min="0"
              v-model="ratioNumber"
              @change="handleRatioChange"
            />
            <div class="right-action-label">选择展示主管单位：</div>
            <a-tree-select
              v-model="choosedUnitOne"
              class="right-action-select"
              :tree-data="unitOptions"
              tree-checkable
              :show-checked-strategy="SHOW_PARENT"
              search-placeholder="选择展示主管单位"
              dropdown-class-name="global-selectOption"
              @change="handleUnitChangeOne"
            />
          </div> -->
        </div>
      </div>
    </div>
    <!-- 资金结构 -->
    <div class="money-structure">
      <div class="sub-title">资金结构</div>

      <div class="money-structure-wrapper">
        <!-- 左边 -->
        <div class="wrapper-box">
          <div class="wrapper-top">
            <div class="wrapper-top-title">当年资金分布（按资金来源）</div>
            <a-tooltip
              placement="topLeft"
              overlayClassName="wrapper-title-tooltip"
            >
              <template slot="title">
                <span>111111</span>
              </template>
              <div class="tooltip-icon">
                <icon-svg icon-class="icon-warning" color="#1776FF"></icon-svg>
              </div>
            </a-tooltip>
          </div>
          <!-- 分割线 -->
          <div class="wrapper-split"></div>
          <div class="wrapper-content">
            <div
              class="wrapper-content-graph"
              ref="graph2"
              style="width: 50%"
            ></div>
            <a-table
              bordered
              :columns="columns3"
              :data-source="tableData3.dataSource"
              :loading="tableLoading3"
              :pagination="false"
              class="wrapper-table-graph"
              :scroll="{ x: 'max-content', y: 350 }"
            >
              <template slot="zb" slot-scope="text">
                <!-- <div style="cursor: pointer">{{ text }}</div> -->
                <div style="display: flex">
                  <a-progress
                    :percent="text"
                    size="small"
                    :show-info="false"
                    style="width: 40px"
                  />
                  <div style="margin-left: 8px">
                    <span
                      >{{
                        text.toString().includes("--") ? "--" : text * 1
                      }}%</span
                    >
                  </div>
                </div>
              </template>
              <template slot="je" slot-scope="text">
                <div style="display: flex; margin-bottom: 8px">
                  <a-progress
                    :percent="(text / tableData3.maxMoney) * 100"
                    size="small"
                    :show-info="false"
                    style="width: 40px"
                  />
                  <div style="margin-left: 8px">
                    <span>{{
                      text.toString().includes("--")
                        ? "--"
                        : Number(text).toLocaleString()
                    }}</span>
                  </div>
                </div>
              </template>
            </a-table>
          </div>
        </div>
        <!-- 右边 -->
        <div class="wrapper-box">
          <div class="wrapper-top">
            <div class="wrapper-top-title">资金年趋势（按资金来源）</div>
            <a-tooltip
              placement="topLeft"
              overlayClassName="wrapper-title-tooltip"
            >
              <template slot="title">
                <span>111111</span>
              </template>
              <div class="tooltip-icon">
                <icon-svg icon-class="icon-warning" color="#1776FF"></icon-svg>
              </div>
            </a-tooltip>
          </div>
          <!-- 分割线 -->
          <div class="wrapper-split"></div>

          <div class="wrapper-content">
            <div class="wrapper-content-graph" ref="graph3"></div>
          </div>
        </div>
      </div>

      <div class="money-structure-wrapper">
        <!-- 左边 -->
        <div class="wrapper-box">
          <div class="wrapper-top">
            <div class="wrapper-top-title">当年资金分布（按功能科目）</div>
            <a-tooltip
              placement="topLeft"
              overlayClassName="wrapper-title-tooltip"
            >
              <template slot="title">
                <span>111111</span>
              </template>
              <div class="tooltip-icon">
                <icon-svg icon-class="icon-warning" color="#1776FF"></icon-svg>
              </div>
            </a-tooltip>
          </div>

          <!-- 分割线 -->
          <div class="wrapper-split"></div>
          <div class="wrapper-content">
            <div class="wrapper-content-graph" ref="graph4"></div>
          </div>
        </div>
        <!-- 右边 -->
        <div class="wrapper-box">
          <div class="wrapper-top">
            <div class="wrapper-top-title">资金年趋势（按功能科目）</div>
            <div class="wrapper-top-action">
              <div
                class="action-choose"
                @click="handleChooseSubject('功能科目选择')"
              >
                请选择展示功能科目
              </div>
              <div class="action-reset" @click="initGraph5()">重置</div>
              <a-tooltip
                placement="topLeft"
                overlayClassName="wrapper-title-tooltip"
              >
                <template slot="title">
                  <span>111111</span>
                </template>
                <div class="tooltip-icon">
                  <icon-svg
                    icon-class="icon-warning"
                    color="#1776FF"
                  ></icon-svg>
                </div>
              </a-tooltip>
            </div>
          </div>
          <!-- 分割线 -->
          <div class="wrapper-split"></div>

          <div class="wrapper-content">
            <div class="wrapper-content-graph" ref="graph5"></div>
          </div>
        </div>
      </div>

      <div class="money-structure-wrapper">
        <!-- 左边 -->
        <div class="wrapper-box">
          <div class="wrapper-top">
            <div class="wrapper-top-title">当年资金分布（按经济科目）</div>
            <a-tooltip
              placement="topLeft"
              overlayClassName="wrapper-title-tooltip"
            >
              <template slot="title">
                <span>111111</span>
              </template>
              <div class="tooltip-icon">
                <icon-svg icon-class="icon-warning" color="#1776FF"></icon-svg>
              </div>
            </a-tooltip>
          </div>
          <!-- 分割线 -->
          <div class="wrapper-split"></div>
          <div class="wrapper-content">
            <div class="wrapper-content-graph" ref="graph6"></div>
          </div>
        </div>
        <!-- 右边 -->
        <div class="wrapper-box">
          <div class="wrapper-top">
            <div class="wrapper-top-title">资金年趋势（按经济科目）</div>
            <div class="wrapper-top-action">
              <div
                class="action-choose"
                @click="handleChooseSubject('经济科目选择')"
              >
                请选择展示经济科目
              </div>
              <div class="action-reset" @click="initGraph7()">重置</div>
              <a-tooltip
                placement="topLeft"
                overlayClassName="wrapper-title-tooltip"
              >
                <template slot="title">
                  <span>111111</span>
                </template>
                <div class="tooltip-icon">
                  <icon-svg
                    icon-class="icon-warning"
                    color="#1776FF"
                  ></icon-svg>
                </div>
              </a-tooltip>
            </div>
          </div>
          <!-- 分割线 -->
          <div class="wrapper-split"></div>

          <div class="wrapper-content">
            <div class="wrapper-content-graph" ref="graph7"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- 主管单位 -->
    <div class="competent-organization">
      <div class="competent-organization-top">
        <div class="sub-title">主管单位</div>
        <div class="top-action">
          <a-button class="top-action-btn" @click="sortOne()">
            <div class="top-action-btn-icon">
              <icon-svg icon-class="排序"></icon-svg>
            </div>
            排序
          </a-button>
          <a-button class="top-action-btn" @click="filterOne()">
            <div class="top-action-btn-icon">
              <icon-svg icon-class="筛选"></icon-svg>
            </div>
            筛选
          </a-button>
        </div>
      </div>
      <div class="competent-organization-wrapper">
        <div class="competent-organization-wrapper-item">
          <div class="item-top">
            <div class="item-top-title">当年支出分布情况（按主管单位）</div>
            <div class="flex">
              <!-- <div class="action-reset" style="margin-right: 8px">重置</div> -->
              <a-tooltip
                placement="topLeft"
                overlayClassName="item-title-tooltip"
              >
                <template slot="title">
                  <span>111111</span>
                </template>
                <div class="tooltip-icon">
                  <icon-svg
                    icon-class="icon-warning"
                    color="#1776FF"
                  ></icon-svg>
                </div>
              </a-tooltip>
            </div>
          </div>
          <div class="item-split"></div>
          <div class="item-content">
            <div class="item-content-des">
              <div class="item-content-des-item">
                <div class="item-content-des-item-label">主管单位总数量：</div>
                <div class="item-content-des-item-value">
                  <span style="color: #1776ff">{{ graphData8.unitTotal }}</span
                  >家；
                </div>
              </div>
              <div class="item-content-des-item">
                <div class="item-content-des-item-label">项目总数量：</div>
                <div class="item-content-des-item-value">
                  <span style="color: #1776ff">{{
                    graphData8.projectTotal
                  }}</span
                  >个；
                </div>
              </div>
              <div class="item-content-des-item">
                <div class="item-content-des-item-label">项目支出总金额：</div>
                <div class="item-content-des-item-value">
                  <span style="color: #1776ff">{{ graphData8.total }}</span
                  >万元；
                </div>
              </div>
            </div>
            <div class="item-content-graph" ref="graph8"></div>
          </div>
        </div>
        <div class="competent-organization-wrapper-table">
          <a-table
            bordered
            :columns="columns1"
            :data-source="tableData1"
            :loading="tableLoading1"
            :pagination="false"
            class="wrapper-table-graph"
            :scroll="{ x: 'max-content', y: 480 }"
          >
            <!-- :scroll="{ x: 'max-content', y: 'calc(100vh - 318px)' }" -->
            <template slot="manageName" slot-scope="text">
              <a style="cursor: pointer" @click="goManagePortrait(text)">{{
                text
              }}</a>
            </template>
            <template slot="data" slot-scope="text, record">
              <div>
                <div
                  @click.stop="tableJumpOne(record.manageName)"
                  style="cursor: pointer"
                >
                  支出金额:
                  <span style="color: #1890ff"
                    >{{ Number(text.split("+")[0]).toLocaleString() }}万元</span
                  >
                </div>
                <div>
                  项目数量:
                  <span>{{ text.split("+")[1] }}个</span>
                </div>
                <div>
                  执行率:
                  <span>{{ text.split("+")[2] }}%</span>
                </div>
              </div>
            </template>
            <template slot="graphTrend" slot-scope="text, record">
              <div
                style="width: 100%; height: 145px"
                :ref="'chart' + record.id"
              ></div>
            </template>
          </a-table>
        </div>
      </div>
    </div>
    <!-- 项目分析 -->
    <div class="project-analysis">
      <div class="project-analysis-top">
        <div class="sub-title">项目分析</div>
        <div class="top-action">
          <a-button class="top-action-btn" @click="sortTwo()">
            <div class="top-action-btn-icon">
              <icon-svg icon-class="排序"></icon-svg>
            </div>
            排序
          </a-button>
          <a-button class="top-action-btn" @click="filterTwo()">
            <div class="top-action-btn-icon">
              <icon-svg icon-class="筛选"></icon-svg>
            </div>
            筛选
          </a-button>
        </div>
      </div>
      <div class="project-analysis-wrapper">
        <div class="project-analysis-wrapper-item">
          <div class="item-top">
            <div class="item-top-title">当年支出分布情况（按项目类型）</div>
            <div class="flex">
              <!-- <div class="action-reset" style="margin-right: 8px">重置</div> -->
              <a-tooltip
                placement="topLeft"
                overlayClassName="item-title-tooltip"
              >
                <template slot="title">
                  <span>111111</span>
                </template>
                <div class="tooltip-icon">
                  <icon-svg
                    icon-class="icon-warning"
                    color="#1776FF"
                  ></icon-svg>
                </div>
              </a-tooltip>
            </div>
          </div>
          <div class="item-split"></div>
          <div class="item-content">
            <div class="item-content-des">
              <div class="item-content-des-item">
                <div class="item-content-des-item-label">项目总数量：</div>
                <div class="item-content-des-item-value">
                  <span style="color: #1776ff">{{
                    graphData9.projectTotal
                  }}</span
                  >个；
                </div>
              </div>
              <div class="item-content-des-item">
                <div class="item-content-des-item-label">支出总金额：</div>
                <div class="item-content-des-item-value">
                  <span style="color: #1776ff">{{ graphData9.total }}</span
                  >万元；
                </div>
              </div>
            </div>
            <div class="item-content-graph" ref="graph9"></div>
          </div>
        </div>
        <div class="project-analysis-wrapper-item">
          <div class="item-top">
            <div class="item-top-title">特定项目类型下单位分布情况</div>
            <a-tooltip
              placement="topLeft"
              overlayClassName="item-title-tooltip"
            >
              <template slot="title">
                <span>111111</span>
              </template>
              <div class="tooltip-icon">
                <icon-svg icon-class="icon-warning" color="#1776FF"></icon-svg>
              </div>
            </a-tooltip>
          </div>
          <div class="item-split"></div>
          <div class="item-content">
            <div
              class="item-content-graph"
              ref="graph10"
              style="height: 100%"
            ></div>
          </div>
        </div>
        <div class="project-analysis-wrapper-right">
          <a-table
            bordered
            :columns="columns2"
            :data-source="tableData2"
            :loading="tableLoading2"
            :pagination="pagination"
            class="right-table"
            :scroll="{ x: 'max-content', y: 365 }"
          >
            <template slot="manageName" slot-scope="text">
              <a @click="goManagePortrait(text)">{{ text }}</a>
            </template>
            <template slot="budgetName" slot-scope="text">
              <a @click="goBudgetPortrait(text)">{{ text }}</a>
            </template>
            <template slot="project" slot-scope="text, record">
              <a
                @click="
                  goProjectDetail(text, record.manageName, record.budgetName)
                "
                >{{ text }}</a
              >
            </template>
            <template slot="money" slot-scope="text, record">
              <a
                @click.stop="tableJumpTwo(record.manageName, record.budgetName)"
                >{{ text.toLocaleString() }}万元</a
              >
            </template>
            <!-- :scroll="{ x: 'max-content', y: 'calc(100vh - 320px)' }" -->
          </a-table>
        </div>
      </div>
    </div>
    <!-- 选择展示的科目 -->
    <a-modal
      class="subject-modal"
      :title="subjectTitle"
      :width="400"
      :visible="subjectShow"
      :closable="false"
      :destroyOnClose="true"
      @cancel="onCancel"
      @ok="onConfirm"
      :mask="false"
      centered
    >
      <div class="subject-modal-content">
        <a-select
          v-if="subjectTitle == '经济科目选择'"
          mode="multiple"
          class="subject-modal-content-select"
          placeholder="选择展示科目"
          v-model="choosedSubjectTwo"
        >
          <!--  @change="handleSubjectChangeOne" -->
          <a-select-option
            v-for="item in echoSubjectOptions"
            :key="item.key"
            :title="item.value"
            :value="item.value"
          >
            {{ item.key }}
          </a-select-option>
        </a-select>
        <a-select
          v-else
          mode="multiple"
          class="subject-modal-content-select"
          placeholder="选择展示科目"
          v-model="choosedSubjectOne"
        >
          <!--  @change="handleSubjectChangeOne" -->
          <a-select-option
            v-for="item in subjectOptions"
            :key="item.key"
            :title="item.value"
            :value="item.value"
          >
            {{ item.key }}
          </a-select-option>
        </a-select>
      </div>
    </a-modal>
    <!-- 选择主管单位弹框 -->
    <a-modal
      class="manage-modal"
      :title="manageTitle"
      :width="400"
      :visible="manageShow"
      :closable="false"
      :destroyOnClose="true"
      @cancel="onCancelManage"
      @ok="onConfirmManage"
      :mask="false"
      centered
    >
      <div class="manage-modal-content">
        <!-- <a-tree-select
          v-model="choosedManageUnit"
          class="item-value"
          :tree-data="manageUnitTree"
          tree-checkable
          :show-checked-strategy="SHOW_PARENT"
          search-placeholder="请选择"
        /> -->
        <a-select
          mode="multiple"
          class="item-value"
          placeholder="请选择"
          v-model="choosedManageUnit"
          @change="changeManageUnitMonth"
        >
          <!--  @change="handleSubjectChangeOne" -->
          <a-select-option
            v-for="item in manageUnitTree"
            :key="item.key"
            :title="item.value"
            :value="item.value"
          >
            {{ item.key }}
          </a-select-option>
        </a-select>
      </div>
    </a-modal>
    <!-- 主管单位排序按钮 -->
    <SortModal
      v-if="sortOneOptions.length"
      sortTitle="主管单位排序配置"
      :sortShow="sortOneShow"
      @onSortCancel="onSortOneCancel"
      @onSortConfirm="onSortOneConfirm"
      :sortOptions="sortOneOptions"
      firstSortName="支出金额"
    ></SortModal>
    <!-- 项目排序按钮 -->
    <SortModal
      v-if="sortTwoOptions.length"
      sortTitle="项目分析排序配置"
      :sortShow="sortTwoShow"
      @onSortCancel="onSortTwoCancel"
      @onSortConfirm="onSortTwoConfirm"
      :sortOptions="sortTwoOptions"
      firstSortName="支出金额"
    ></SortModal>

    <!-- 主管单位筛选 -->
    <FilterModal
      v-if="paramsOneOption.length"
      filterTitle="主管单位列表过滤器配置"
      :filterShow="filterOneShow"
      :paramsOption="paramsOneOption"
      :tableData="filterTableData3"
      @addTable3="addTable3"
      @delTable3="delTable3"
      @onFilterCancel="onFilterOneCancel"
      @onFilterConfirm="onFilterOneConfirm"
    ></FilterModal>

    <!-- 项目分析筛选 -->
    <FilterModal
      filterTitle="项目分析列表过滤器配置"
      :filterShow="filterTwoShow"
      :paramsOption="paramsTwoOption"
      :tableData="filterTableData4"
      @addTable3="addTable4"
      @delTable3="delTable4"
      @onFilterCancel="onFilterTwoCancel"
      @onFilterConfirm="onFilterTwoConfirm"
    ></FilterModal>
  </div>
</template>
<script>
import {
  lineColor1,
  lineColor10,
  lineColor11,
  lineColor2,
  lineColor3,
  lineColor4,
  lineColor5,
  lineColor6,
  lineColor7,
  lineColor8,
  lineColor9,
} from "@/assets/theme/model.js";
import FilterModal from "@/components/filterModal.vue";
import SortModal from "@/components/sortModal.vue";
import {
  getFinacialSubjects,
  getFinacialSubjectsTop8,
  getFuncSubjects,
  getFuncSubjectsTop8,
  getManageFilterOptions,
  getManageSortOptions,
  getSpendChartEight,
  getSpendChartFive,
  getSpendChartFour,
  getSpendChartNine,
  getSpendChartOne,
  getSpendChartSeven,
  getSpendChartSix,
  getSpendChartTen,
  getSpendChartThree,
  getSpendChartTwo,
  getSpendChartTwoTable,
  getSpendManageTree,
  getSpendManageTreeTop8,
  getSpendOverview,
  getSpendTable,
  getSpendTableChart,
  getSpendTableFilterOptions,
  getSpendTableSortOptions,
  getSpendTableTotal,
} from "@/shared/newApi/block/spendAnalysis.js";
import { highlight, MONTHS } from "@/utils";
import {
  getMonthStartEnd,
  getYearStartEnd,
  monthNameToNumber,
} from "@/utils/common.js";
import { adjustFontSize } from "@/utils/echarts.js";
// import { adjustFontSize, handleAddEchartsBackground } from "@/utils/echarts.js";
import {
  Button,
  InputNumber,
  Progress,
  Select,
  Tooltip,
  TreeSelect,
} from "ant-design-vue";
import { debounce } from "lodash";
import { mapState } from "vuex";

const SHOW_PARENT = TreeSelect.SHOW_PARENT;

export default {
  name: "SpendCondition",
  data() {
    return {
      SHOW_PARENT,
      lineColor: [
        lineColor1,
        lineColor2,
        lineColor3,
        lineColor4,
        lineColor5,
        lineColor6,
        lineColor7,
        lineColor8,
        lineColor9,
        lineColor10,
        lineColor11,
      ],
      //支出数据概览
      spendData: [
        // {
        //   id: 1,
        //   typeName: "预算金额（万元）",
        //   num: 17774,
        //   percentage: "7%",
        //   status: 2, //0:down  1:up
        //   icon: "预算金额",
        // },
        // {
        //   id: 2,
        //   typeName: "执行金额（万元）",
        //   num: 17774,
        //   percentage: "7%",
        //   status: 1, //0:down  1:up
        //   icon: "执行金额",
        // },
        // {
        //   id: 3,
        //   typeName: "执行率（%）",
        //   num: 17774,
        //   percentage: "7%",
        //   status: 0, //0:down  1:up
        //   icon: "执行率",
        // },
        // {
        //   id: 4,
        //   typeName: "项目数（个）",
        //   num: 17774,
        //   percentage: "7%",
        //   status: 1, //0:down  1:up
        //   icon: "项目数",
        // },
        // {
        //   id: 5,
        //   typeName: "人员数（人）",
        //   num: 17774,
        //   percentage: "7%",
        //   status: 0, //0:down  1:up
        //   icon: "人员数",
        // },
        // {
        //   id: 6,
        //   typeName: "人均支出金额（万元）",
        //   num: 17774,
        //   percentage: "7%",
        //   status: 0, //0:down  1:up
        //   icon: "人均支出金额",
        // },
      ],
      //主管单位弹框相关
      manageShow: false,
      manageTitle: "",
      choosedManageUnit: [],
      choosedManageUnitCopy: [],
      top8ManageUnit: [],
      manageUnitTree: [
        // {
        //   key: "0001——主管单位一",
        //   value: "1",
        // },
        // {
        //   key: "0002——主管单位二",
        //   value: "2",
        // },
        // {
        //   key: "0003——主管单位三",
        //   value: "3",
        // },
        // {
        //   key: "0004——主管单位4",
        //   value: "4",
        // },
        // {
        //   key: "0005——主管单位5",
        //   value: "5",
        // },
        // {
        //   key: "0006——主管单位6",
        //   value: "6",
        // },
        // {
        //   key: "0007——主管单位7",
        //   value: "7",
        // },
        // {
        //   key: "0008——主管单位8",
        //   value: "8",
        // },
        // {
        //   key: "0009——主管单位9",
        //   value: "9",
        // },
      ],
      ratioNumber: 10,

      //功能科目
      subjectTitle: "",
      subjectShow: false,
      subjectOptions: [
        // {
        //   key: "功能科目一",
        //   value: "1",
        // },
        // {
        //   key: "功能科目二",
        //   value: "2",
        // },
        // {
        //   key: "功能科目三",
        //   value: "3",
        // },
      ],
      //经济科目
      echoSubjectOptions: [
        // {
        //   key: "经济科目一",
        //   value: "1",
        // },
        // {
        //   key: "经济科目二",
        //   value: "2",
        // },
        // {
        //   key: "经济科目三",
        //   value: "3",
        // },
      ],
      choosedSubjectOne: [], //功能科目选择的科目
      choosedSubjectOneCopy: [],
      top8SubjectOne: [],
      choosedSubjectTwo: [], //经济科目选择的科目
      choosedSubjectTwoCopy: [],
      top8SubjectTwo: [],

      //主管单位排序
      sortOneShow: false,
      sortStringOne: "",
      //排序选项
      sortOneOptions: [
        // {
        //   label: "字段1",
        //   value: "字段1",
        // },
        // {
        //   label: "字段2",
        //   value: "字段2",
        // },
        // {
        //   label: "字段3",
        //   value: "字段3",
        // },
        // {
        //   label: "字段4",
        //   value: "字段4",
        // },
        // {
        //   label: "字段5",
        //   value: "字段5",
        // },
        // {
        //   label: "字段6",
        //   value: "字段6",
        // },
        // {
        //   label: "字段7",
        //   value: "字段7",
        // },
        // {
        //   label: "字段8",
        //   value: "字段8",
        // },
      ],
      //项目排序
      sortTwoShow: false,
      sortStringTwo: "",
      //排序选项
      sortTwoOptions: [
        // {
        //   label: "字段1",
        //   value: "字段1",
        // },
      ],

      //主管单位筛选弹框
      filterOneShow: false,
      paramsOneOption: [
        // {
        //   value: "字段一",
        //   label: "字段一",
        // },
      ],
      filterConfirmArrThree: "",
      filterTableData3: [
        // {
        //   id: "1",
        //   name: "字段一",
        //   compare: "等于",
        //   value: "1234",
        // },
      ],
      //项目分析筛选弹框
      filterTwoShow: false,
      paramsTwoOption: [
        // {
        //   value: "字段一",
        //   label: "字段一",
        // },
        // {
        //   value: "字段二",
        //   label: "字段二",
        // },
        // {
        //   value: "字段三",
        //   label: "字段三",
        // },
      ],
      filterConfirmArrFour: "",
      filterTableData4: [
        // {
        //   id: "1",
        //   name: "字段一",
        //   compare: "等于",
        //   value: "1234",
        // },
      ],

      myChart1: null, //整体支出均衡性
      graphData1: {
        // legend: [
        //   "卫生医疗，交通板块",
        //   "主管单位单位单位单位单位单位一",
        //   "主管单位二",
        //   "主管单位三",
        //   "主管单位四",
        //   "主管单位五",
        //   "主管单位六",
        //   "主管单位七",
        //   "主管单位八",
        // ],
        // xAxis: [
        //   "一月",
        //   "二月",
        //   "三月",
        //   "四月",
        //   "五月",
        //   "六月",
        //   "七月",
        //   "八月",
        //   "九月",
        //   "十月",
        //   "十一月",
        //   "十二月",
        // ],
        // seriesData: [
        //   {
        //     name: "卫生医疗，交通板块",
        //     type: "block",
        //     data: {
        //       totalMoney: 100,
        //       money: [0.02, 10, 7, 5, 9, 10, 5, 8, 7, 11, 10, 10],
        //       rate: [0.02, 10, 7, 5, 9, 10, 5, 8, 7, 11, 10, 10],
        //     },
        //   },
        //   {
        //     name: "主管单位单位单位单位单位单位一",
        //     type: "unit",
        //     data: {
        //       totalMoney: 100,
        //       money: [9, 8, 5, 10, 11, 7, 9, 6, 10, 10, 6, 9],
        //       rate: [9, 8, 5, 10, 11, 7, 9, 6, 10, 10, 6, 9],
        //     },
        //   },
        //   {
        //     name: "主管单位二",
        //     type: "unit",
        //     data: {
        //       totalMoney: 100,
        //       money: [10, 9, 8, 7, 8, 10, 9, 5, 8, 7, 9, 10],
        //       rate: [10, 9, 8, 7, 8, 10, 9, 5, 8, 7, 9, 10],
        //     },
        //   },
        //   {
        //     name: "主管单位三",
        //     type: "unit",
        //     data: {
        //       totalMoney: 100,
        //       money: [11, 6, 9, 8, 10, 7, 7, 12, 8, 9, 7, 69],
        //       rate: [11, 6, 9, 8, 10, 7, 7, 12, 8, 9, 7, 6],
        //     },
        //   },
        //   {
        //     name: "主管单位四",
        //     type: "unit",
        //     data: {
        //       totalMoney: 100,
        //       money: [8, 9, 10, 7, 6, 8, 10, 9, 10, 7, 9, 7],
        //       rate: [8, 9, 10, 7, 6, 8, 10, 9, 10, 7, 9, 7],
        //     },
        //   },
        //   {
        //     name: "主管单位五",
        //     type: "unit",
        //     data: {
        //       totalMoney: 100,
        //       money: [9, 8, 7, 10, 6, 11, 8, 7, 9, 9, 8, 8],
        //       rate: [9, 8, 7, 10, 6, 11, 8, 7, 9, 9, 8, 8],
        //     },
        //   },
        //   {
        //     name: "主管单位六",
        //     type: "unit",
        //     data: {
        //       totalMoney: 100,
        //       money: [7, 9, 10, 6, 12, 8, 7, 9, 10, 8, 6, 8],
        //       rate: [7, 9, 10, 6, 12, 8, 7, 9, 10, 8, 6, 8],
        //     },
        //   },
        //   {
        //     name: "主管单位七",
        //     type: "unit",
        //     data: {
        //       totalMoney: 100,
        //       money: [8, 10, 7, 9, 11, 6, 8, 10, 6, 7, 9, 9],
        //       rate: [8, 10, 7, 9, 11, 6, 8, 10, 6, 7, 9, 9],
        //     },
        //   },
        //   {
        //     name: "主管单位八",
        //     type: "unit",
        //     data: {
        //       totalMoney: 100,
        //       money: [1, 8, 9, 10, 6, 17, 7, 9, 8, 7, 8, 10],
        //       rate: [1, 8, 9, 10, 6, 17, 7, 9, 8, 7, 8, 10],
        //     },
        //   },
        // ],
      },
      myChart2: null, //按资金来源环形图
      graphData2: {
        // seriesData: [
        //   { value: 100, name: "一般公共预算", rate: 10 },
        //   { value: 600, name: "社保基金预算", rate: 60 },
        //   { value: 300, name: "政府性预算基金", rate: 30 },
        // ],
        // total: 1000,
      },
      myChart3: null, //按资金来源归一化图
      graphData3: {
        // legend: ["一般公共预算", "社保基金预算", "政府性预算基金"],
        // xAxis: ["2020", "2021", "2022", "2023", "2024"],
        // seriesData: [
        //   {
        //     name: "一般公共预算",
        //     rate: [0.4, 0.2, 0.5, 0.1, 0.3],
        //     money: [400, 200, 500, 100, 300],
        //   },
        //   {
        //     name: "社保基金预算",
        //     rate: [0.4, 0.3, 0.4, 0.6, 0.2],
        //     money: [400, 300, 400, 600, 200],
        //   },
        //   {
        //     name: "政府性预算基金",
        //     rate: [0.2, 0.5, 0.1, 0.3, 0.5],
        //     money: [200, 500, 100, 300, 500],
        //   },
        // ],
      },

      myChart4: null, //按功能科目矩形树图
      graphData4: {
        // seriesData: [
        //   //数据
        //   {
        //     name: "功能科目一",
        //     value: 50,
        //     year: 2023,
        //     per: "50%",
        //     children: [
        //       //数据集
        //       { name: "Hello", value: 7, year: 2023, per: "7%" },
        //       { name: "World", value: 8, year: 2023, per: "8%" },
        //       { name: "This", value: 15, year: 2023, per: "15%" },
        //       { name: "is", value: 20, year: 2023, per: "20%" },
        //     ],
        //   },
        //   {
        //     name: "功能科目二",
        //     value: 30,
        //     year: 2023,
        //     per: "30%",
        //     children: [
        //       //数据集
        //       {
        //         name: "Hello",
        //         value: 18,
        //         year: 2023,
        //         per: "18%",
        //         children: [
        //           //数据集
        //           { name: "Hello", value: 8, year: 2023, per: "8%" },
        //           { name: "World", value: 10, year: 2023, per: "10%" },
        //         ],
        //       },
        //       { name: "World", value: 5, year: 2023, per: "5%" },
        //       { name: "This", value: 3, year: 2023, per: "3%" },
        //       { name: "is", value: 4, year: 2023, per: "4%" },
        //     ],
        //   },
        //   {
        //     name: "功能科目三",
        //     value: 20,
        //     year: 2023,
        //     per: "20%",
        //     children: [
        //       //数据集
        //       { name: "Hello", value: 7, year: 2023, per: "7%" },
        //       { name: "World", value: 13, year: 2023, per: "13%" },
        //     ],
        //   },
        // ],
      },

      myChart5: null, //资金结构（按功能科目）
      graphData5: {
        // legend: ["功能科目一", "功能科目二", "功能科目三"],
        // xAxis: ["2020", "2021", "2022", "2023", "2024"],
        // yAxis: {
        //   name: "金额（万元）",
        // },
        // seriesData: [
        //   {
        //     name: "功能科目一",
        //     data: {
        //       money: [30, 40, 20, 50, 70],
        //       rate: [30, 40, 20, 50, 70],
        //     },
        //   },
        //   {
        //     name: "功能科目二",
        //     data: {
        //       money: [20, 25, 25, 30, 15],
        //       rate: [20, 25, 25, 30, 15],
        //     },
        //   },
        //   {
        //     name: "功能科目三",
        //     data: {
        //       money: [50, 35, 55, 20, 15],
        //       rate: [50, 35, 55, 20, 15],
        //     },
        //   },
        // ],
      },

      myChart6: null, //按经济科目矩形树图
      graphData6: {
        // seriesData: [
        //   //数据
        //   {
        //     name: "经济科目一",
        //     value: 50,
        //     year: 2023,
        //     per: "50%",
        //     children: [
        //       //数据集
        //       { name: "ok", value: 7, year: 2023, per: "7%" },
        //       { name: "echo", value: 8, year: 2023, per: "8%" },
        //       {
        //         name: "强起",
        //         value: 15,
        //         year: 2023,
        //         per: "15%",
        //       },
        //       { name: "half", value: 20, year: 2023, per: "20%" },
        //     ],
        //   },
        //   {
        //     name: "经济科目二",
        //     value: 30,
        //     year: 2023,
        //     per: "30%",
        //     children: [
        //       //数据集
        //       {
        //         name: "Hello",
        //         value: 18,
        //         year: 2023,
        //         per: "18%",
        //         children: [
        //           //数据集
        //           { name: "Hello", value: 8, year: 2023, per: "8%" },
        //           { name: "World", value: 10, year: 2023, per: "10%" },
        //         ],
        //       },
        //       { name: "World", value: 5, year: 2023, per: "5%" },
        //       { name: "This", value: 3, year: 2023, per: "3%" },
        //       { name: "is", value: 4, year: 2023, per: "4%" },
        //     ],
        //   },
        //   {
        //     name: "经济科目三",
        //     value: 20,
        //     year: 2023,
        //     per: "20%",
        //     children: [
        //       //数据集
        //       { name: "Hello", value: 7, year: 2023, per: "7%" },
        //       { name: "World", value: 13, year: 2023, per: "13%" },
        //     ],
        //   },
        // ],
      },

      myChart7: null, //资金结构（按经济科目）
      graphData7: {
        // legend: ["经济科目一", "经济科目二", "经济科目三"],
        // xAxis: ["2020", "2021", "2022", "2023", "2024"],
        // yAxis: {
        //   name: "金额（万元）",
        // },
        // seriesData: [
        //   {
        //     name: "经济科目一",
        //     data: {
        //       money: [30, 40, 20, 50, 70],
        //       rate: [30, 40, 20, 50, 70],
        //     },
        //   },
        //   {
        //     name: "经济科目二",
        //     data: {
        //       money: [20, 25, 25, 30, 15],
        //       rate: [20, 25, 25, 30, 15],
        //     },
        //   },
        //   {
        //     name: "经济科目三",
        //     data: {
        //       money: [50, 35, 55, 20, 15],
        //       rate: [50, 35, 55, 20, 15],
        //     },
        //   },
        // ],
      },

      myChart8: null, //主管单位——当年分布情况（按主管单位分类)
      graphData8: {
        // seriesData: [
        //   { value: 200, name: "主管单位一", rate: 20 },
        //   { value: 300, name: "主管单位二", rate: 30 },
        //   { value: 400, name: "主管单位三", rate: 40 },
        //   { value: 100, name: "主管单位四", rate: 10 },
        // ],
        // total: 100000000,
        // unitTotal: 123,  //主管单位总数量
        // projectTotal: 123,  //项目总数量
      },

      currentProjectType: null, //第九张图选中的项目类型
      choosedName: null, //第十张图选中的单位
      myChart9: null, //项目分析——当年分布情况（按主管单位分类)
      graphData9: {
        // seriesData: [
        //   { value: 200, name: "项目类型一", rate: 20 },
        //   { value: 300, name: "项目类型二", rate: 30 },
        //   { value: 500, name: "项目类型三", rate: 50 },
        // ],
        // total: 10000000000,
        // projectTotal: 123,  //项目总数量
      },

      myChart10: null, //按经济科目矩形树图
      graphData10: {
        // seriesData: [
        //   //数据
        //   {
        //     name: "主管单位一",
        //     value: 50,
        //     year: 2023,
        //     per: "50%",
        //     type: "manage",
        //     projectType: "项目类型一",
        //     children: [
        //       //数据集
        //       {
        //         name: "预算单位一",
        //         value: 25,
        //         year: 2023,
        //         per: "50%",
        //         type: "budget",
        //         projectType: "项目类型一",
        //       },
        //       {
        //         name: "预算单位二",
        //         value: 15,
        //         year: 2023,
        //         per: "30%",
        //         type: "budget",
        //         projectType: "项目类型一",
        //       },
        //       {
        //         name: "预算单位三",
        //         value: 10,
        //         year: 2023,
        //         per: "20%",
        //         type: "budget",
        //         projectType: "项目类型一",
        //       },
        //     ],
        //   },
        //   {
        //     name: "主管单位二",
        //     value: 30,
        //     year: 2023,
        //     per: "30%",
        //     type: "manage",
        //     projectType: "项目类型一",
        //     children: [
        //       //数据集
        //       {
        //         name: "预算单位一",
        //         value: 25,
        //         year: 2023,
        //         per: "50%",
        //         type: "budget",
        //         projectType: "项目类型一",
        //       },
        //       {
        //         name: "预算单位二",
        //         value: 15,
        //         year: 2023,
        //         per: "30%",
        //         type: "budget",
        //         projectType: "项目类型一",
        //       },
        //       {
        //         name: "预算单位三",
        //         value: 10,
        //         year: 2023,
        //         per: "20%",
        //         type: "budget",
        //         projectType: "项目类型一",
        //       },
        //     ],
        //   },
        //   {
        //     name: "主管单位三",
        //     value: 20,
        //     year: 2023,
        //     type: "manage",
        //     projectType: "项目类型一",
        //     per: "20%",
        //     children: [
        //       //数据集
        //       {
        //         name: "预算单位一",
        //         value: 25,
        //         year: 2023,
        //         per: "50%",
        //         type: "budget",
        //         projectType: "项目类型一",
        //       },
        //       {
        //         name: "预算单位二",
        //         value: 15,
        //         year: 2023,
        //         per: "30%",
        //         type: "budget",
        //         projectType: "项目类型一",
        //       },
        //       {
        //         name: "预算单位三",
        //         value: 10,
        //         year: 2023,
        //         per: "20%",
        //         type: "budget",
        //         projectType: "项目类型一",
        //       },
        //     ],
        //   },
        // ],
      },

      //表格内部图:主管单位近五年趋势
      columns1: [
        {
          title: "主管单位",
          dataIndex: "manageName",
          key: "manageName",
          width: 240,
          scopedSlots: { customRender: "manageName" },
        },
        {
          title: "当年数据",
          dataIndex: "data",
          key: "data",
          scopedSlots: { customRender: "data" },
          width: 240,
        },
        {
          title: "近五年趋势",
          dataIndex: "graphTrend",
          key: "graphTrend",
          width: 648.75,
          // width: 488,
          scopedSlots: { customRender: "graphTrend" },
        },
      ],
      trendGraphData: {
        legend: ["支出金额", "项目数量", "执行率"],
        yAxis: [
          {
            type: "value",
            name: "金额(万)",
            axisLabel: {
              formatter: "{value}",
            },
            alignTicks: true,
            // splitNumber: 4, // 将纵坐标分为五等分
            position: "left", // 确保位置正确
          },
          {
            type: "value",
            name: "数量(个)",
            offset: 50,
            axisLabel: {
              formatter: "{value}",
            },
            alignTicks: true,
            // splitNumber: 4, // 将纵坐标分为五等分
            position: "right", // 确保位置正确
          },
          {
            type: "value",
            name: "比率(%)",
            min: 0,
            max: 100,
            interval: 25,
            axisLabel: {
              formatter: "{value}",
            },
            alignTicks: true,
            position: "right", // 确保位置正确
          },
        ],
      },
      tableData1: [],
      tableLoading1: false,
      //项目分析
      columns2: [
        {
          title: "主管单位名称",
          dataIndex: "manageName",
          key: "manageName",
          width: 170,
          scopedSlots: { customRender: "manageName" },
        },
        {
          title: "预算单位名称",
          dataIndex: "budgetName",
          key: "budgetName",
          width: 200,
          scopedSlots: { customRender: "budgetName" },
        },
        {
          title: "项目",
          dataIndex: "project",
          key: "project",
          width: 250,
          scopedSlots: { customRender: "project" },
        },
        {
          title: "支出金额",
          dataIndex: "money",
          key: "money",
          width: 150.5,
          scopedSlots: { customRender: "money" },
          fixed: "right",
        },
      ],
      tableData2: [
        // {
        //   manageName: "主管单位一",
        //   budgetName: "预算单位一",
        //   project: "希望工程项目",
        //   money: 12345,
        //   projectType: "项目类型一",
        // },
        // {
        //   manageName: "主管单位二",
        //   budgetName: "预算单位二",
        //   project: "希望工程项目",
        //   money: 12345,
        //   projectType: "项目类型一",
        // },
        // {
        //   manageName: "主管单位三",
        //   budgetName: "预算单位三",
        //   project: "希望工程项目",
        //   money: 12345,
        //   projectType: "项目类型一",
        // },
        // {
        //   manageName: "主管单位四",
        //   budgetName: "预算单位四",
        //   project: "希望工程项目",
        //   money: 12345,
        //   projectType: "项目类型一",
        // },
        // {
        //   manageName: "主管单位五",
        //   budgetName: "预算单位五",
        //   project: "希望工程项目",
        //   money: 12345,
        //   projectType: "项目类型一",
        // },
        // {
        //   manageName: "主管单位六",
        //   budgetName: "预算单位六",
        //   project: "希望工程项目",
        //   money: 12345,
        //   projectType: "项目类型一",
        // },
        // {
        //   manageName: "主管单位七",
        //   budgetName: "预算单位七",
        //   project: "希望工程项目",
        //   money: 12345,
        //   projectType: "项目类型一",
        // },
        // {
        //   manageName: "主管单位八",
        //   budgetName: "预算单位八",
        //   project: "希望工程项目",
        //   money: 12345,
        //   projectType: "项目类型一",
        // },
        // {
        //   manageName: "主管单位一",
        //   budgetName: "预算单位一",
        //   project: "希望工程项目",
        //   money: 12345,
        //   projectType: "项目类型一",
        // },
        // {
        //   manageName: "主管单位二",
        //   budgetName: "预算单位二",
        //   project: "希望工程项目",
        //   money: 12345,
        //   projectType: "项目类型一",
        // },
        // {
        //   manageName: "主管单位三",
        //   budgetName: "预算单位三",
        //   project: "希望工程项目",
        //   money: 12345,
        //   projectType: "项目类型一",
        // },
        // {
        //   manageName: "主管单位四",
        //   budgetName: "预算单位四",
        //   project: "希望工程项目",
        //   money: 12345,
        //   projectType: "项目类型一",
        // },
        // {
        //   manageName: "主管单位五",
        //   budgetName: "预算单位五",
        //   project: "希望工程项目",
        //   money: 12345,
        //   projectType: "项目类型一",
        // },
        // {
        //   manageName: "主管单位六",
        //   budgetName: "预算单位六",
        //   project: "希望工程项目",
        //   money: 12345,
        //   projectType: "项目类型一",
        // },
        // {
        //   manageName: "主管单位七",
        //   budgetName: "预算单位七",
        //   project: "希望工程项目",
        //   money: 12345,
        //   projectType: "项目类型一",
        // },
        // {
        //   manageName: "主管单位八",
        //   budgetName: "预算单位八",
        //   project: "希望工程项目",
        //   money: 12345,
        //   projectType: "项目类型一",
        // },
      ],
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
          this.getSpendTable(); //表格数据变化
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = 1;
          this.pagination.pageSize = size;
          this.getSpendTable(); //表格数据变化
        },
      },
      tableLoading2: false,

      //表3
      columns3: [
        {
          title: "资金来源",
          dataIndex: "zjly",
          key: "zjly",
          align: "center",
          width: 120,
        },
        {
          title: "占比（%）",
          dataIndex: "zb",
          key: "zb",
          align: "center",
          width: 130,
          scopedSlots: { customRender: "zb" },
        },
        {
          title: "金额（万元）",
          dataIndex: "je",
          key: "je",
          align: "center",
          width: 150,
          scopedSlots: { customRender: "je" },
        },
      ],
      tableLoading3: false,
      tableData3: {
        dataSource: [
          // {
          //   zjly: "类别1", //资产大类
          //   zb: 100, //占比
          //   je: 7000.789, //金额
          // },
          // {
          //   zjly: "类别2", //资产大类
          //   zb: 40, //占比
          //   je: 70, //金额
          // },
          // {
          //   zjly: "类别3", //资产大类
          //   zb: 35, //占比
          //   je: 120, //金额
          // },
          // {
          //   zjly: "类别4", //资产大类
          //   zb: 35, //占比
          //   je: 300, //金额
          // },
          // {
          //   zjly: "类别1", //资产大类
          //   zb: 35, //占比
          //   je: 70, //金额
          // },
          // {
          //   zjly: "类别1", //资产大类
          //   zb: 35, //占比
          //   je: 70, //金额
          // },
          // {
          //   zjly: "类别1", //资产大类
          //   zb: 35, //占比
          //   je: 70, //金额
          // },
          // {
          //   zjly: "类别1", //资产大类
          //   zb: 35, //占比
          //   je: 70, //金额
          // },
          // {
          //   zjly: "类别1", //资产大类
          //   zb: 35, //占比
          //   je: 70, //金额
          // },
          // {
          //   zjly: "类别1", //资产大类
          //   zb: 35, //占比
          //   je: 70, //金额
          // },
          // {
          //   zjly: "类别1", //资产大类
          //   zb: 35, //占比
          //   je: 70, //金额
          // },
          // {
          //   zjly: "类别1", //资产大类
          //   zb: 35, //占比
          //   je: 70, //金额
          // },
        ],
        maxMoney: 300, //dataSource1中金额的最大值
      },
    };
  },
  computed: {
    ...mapState("blockAnalysis", [
      "choosedBlockName",
      "choosedBlockId",
      "blockChoosedYear",
    ]),
    yearRange() {
      return getYearStartEnd(this.blockChoosedYear);
    },
  },
  components: {
    SortModal,
    FilterModal,
    ATooltip: Tooltip,
    ASelect: Select,
    AInputNumber: InputNumber,
    AButton: Button,
    AProgress: Progress,
    // ATreeSelect: TreeSelect,
  },
  watch: {
    choosedBlockId: {
      handler: debounce(async function (newVal, oldVal) {
        console.log("5656555", newVal, oldVal);
        this.currentProjectType = null;
        this.choosedName = null;
        await this.getAllData();
      }),
      deep: true,
    },
    blockChoosedYear: {
      async handler(newVal, oldVal) {
        console.log("5656555", newVal, oldVal);
        this.currentProjectType = null;
        this.choosedName = null;
        await this.getAllData();
      },
    },
  },
  async created() {
    //子组件接受props
    // await this.getSpendTableFilterOptions(); //主管单位筛选选项获取
  },
  async mounted() {
    window.goManagePortrait = this.goManagePortrait;
    window.goBudgetPortrait = this.goBudgetPortrait;
    window.goPayDetail = this.goPayDetail;
    window.goProjectDetail = this.goProjectDetail;
    await this.getAllData();
  },
  beforeDestroy() {
    this.myChart1.dispose();
    this.myChart2.dispose();
    this.myChart3.dispose();
    this.myChart4.dispose();
    this.myChart5.dispose();
    this.myChart6.dispose();
    this.myChart7.dispose();
    this.myChart8.dispose();
    this.myChart9.dispose();
    this.myChart10.dispose();
    const f = () => {
      this.myChart1.resize();
      this.myChart2.resize();
      this.myChart3.resize();
      this.myChart4.resize();
      this.myChart5.resize();
      this.myChart6.resize();
      this.myChart7.resize();
      this.myChart8.resize();
      this.myChart9.resize();
      this.myChart10.resize();
    };
    window.removeEventListener("resize", f);
  },
  methods: {
    async getAllData() {
      this.getSpendOverview(); //获取支出情况概览
      await this.getSpendManageTree(); // 所有主管单位树形下拉框    //后续加上await
      await this.getSpendManageTreeTop8(); // Top8主管单位获取
      await this.getFuncSubjects(); // 功能科目折线图选择框
      await this.getFuncSubjectsTop8(); //获取功能科目top8
      await this.getFinacialSubjects(); // 经济科目折线图选择框
      await this.getFinacialSubjectsTop8(); //获取经济科目top8
      await this.getSpendTableSortOptions(); //主管单位排序选项获取
      // await this.initTable(); //主管单位包含图表的列表
      await this.getSpendTableFilterOptions(); //主管单位筛选选项获取
      await this.getManageSortOptions(); //项目分析 主管单位排序
      // await this.getSpendTable(); //项目分析表格数据
      this.getManageFilterOptions(); //项目分析主管单位筛选
      await this.initAllCharts();
    },
    async initAllCharts() {
      await this.initEchartsOne();
      await this.initEchartsTwo();
      await this.initEchartsThree();
      await this.initEchartsFour();
      await this.initEchartsFive();
      await this.initEchartsSix();
      await this.initEchartsSeven();
      await this.initEchartsEight();
      await this.initEchartsNine();
      await this.initEchartsTen();
      const f = () => {
        this.myChart1.resize();
        this.myChart2.resize();
        this.myChart3.resize();
        this.myChart4.resize();
        this.myChart5.resize();
        this.myChart6.resize();
        this.myChart7.resize();
        this.myChart8.resize();
        this.myChart9.resize();
        this.myChart10.resize();
      };
      window.addEventListener("resize", f);
    },

    //跳转到主管画像页面
    goManagePortrait(name) {
      this.$router.push({
        name: "managePortrait",
        query: { key: name, type: "title" },
      });
    },

    //跳转到预算画像页面
    goBudgetPortrait(name) {
      this.$router.push({
        name: "budgetPortrait",
        query: { key: name, type: "title" },
      });
    },

    //跳转到支出明细
    goPayDetail(
      timeStart,
      timeEnd,
      manage,
      source,
      funcSub,
      finanSub,
      budget,
      proType
    ) {
      //开始时间+结束时间+主管单位+资金来源+功能科目+经济科目+预算单位+ "项目类型"
      // const queryParams = this.queryParams;
      const params = {
        time: [timeStart, timeEnd],
        manage: manage,
        budget: budget,
        source: source,
        funcSub: funcSub,
        finanSub: finanSub,
        proType: proType,
      };
      // this.$router.push({
      //   name: "payDetail",
      //   params: { id: 1 },
      // });
      this.$router.push({
        path: "/block-analysis/pay-detail",
        query: params,
      });
    },

    goProjectDetail(projectName, manageName, budgetName) {
      this.$router.push({
        path: "/block-analysis/project-detail",
        query: {
          projectName: projectName,
          manageName: manageName,
          budgetName: budgetName,
        },
      });
    },

    // 主管单位选择限制为至多8个
    changeManageUnitMonth(value) {
      if (value.length > 8) {
        this.$message.warning("主管单位至多选择8个");
        this.choosedManageUnit.splice(this.choosedManageUnit.length - 1, 1);
      }

      this.choosedManageUnit.sort();
    },

    //获取支出数据概览六个方块数据
    async getSpendOverview() {
      const json = {
        year: this.blockChoosedYear,
        unitIndustry: this.choosedBlockName,
      };
      const res = await getSpendOverview(json);

      console.log("前端页面获取到的", res);
      if (res.message === "成功") {
        this.spendData = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //获取所有主管单位
    async getSpendManageTree() {
      const json = {
        year: this.blockChoosedYear,
        unitIndustry: this.choosedBlockName,
      };
      const res = await getSpendManageTree(json);
      console.log("页面内 整体支出均衡性获取所有主管单位 res", res);
      if (res.message === "成功") {
        console.log("message成功 页面整体支出均衡性获取所有主管单位", res.data);
        this.manageUnitTree = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //获取Top8主管单位
    async getSpendManageTreeTop8() {
      const json = {
        year: this.blockChoosedYear,
        unitIndustry: this.choosedBlockName,
      };
      const res = await getSpendManageTreeTop8(json);
      console.log("页面内整体支出均衡性获取Top8主管单位res", res);
      if (res.message === "成功") {
        console.log("message成功页面整体支出均衡性获取Top8主管单位", res.data);
        //这边要将前8个主管单位的id都移入  todo
        this.choosedManageUnit = res.data;
        this.choosedManageUnitCopy = this.choosedManageUnit;
        this.top8ManageUnit = res.data; //记录当前top8的主管单位

        //演示要求，有要求展示前2
        //this.choosedManageUnit = res.data.slice(0, 2);
        //this.choosedManageUnitCopy = this.choosedManageUnit;
        //this.top8ManageUnit = res.data.slice(0, 2);
      } else {
        this.$message.error(res.message);
      }
    },

    //按功能科目折线图选择框
    async getFuncSubjects() {
      const json = {
        year: this.blockChoosedYear,
        unitIndustry: this.choosedBlockName,
        expCode: this.choosedSubjectOne,
      };
      const res = await getFuncSubjects(json);
      console.log("页面内按功能科目折线图选择框res", res);

      if (res.message === "成功") {
        console.log("message成功按功能科目折线图选择框", res.data);
        this.subjectOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    // 获取功能科目top8
    async getFuncSubjectsTop8() {
      const json = {
        year: this.blockChoosedYear,
        unitIndustry: this.choosedBlockName,
      };
      const res = await getFuncSubjectsTop8(json);
      console.log("页面内获取功能科目top8res", res);

      if (res.message === "成功") {
        console.log("message成功获取功能科目top8", res.data);
        this.choosedSubjectOne = res.data;
        this.choosedSubjectOneCopy = this.choosedSubjectOne;
        this.top8SubjectOne = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //功能科目折线图点击重置
    initGraph5() {
      this.choosedSubjectOne = this.top8SubjectOne;
      this.choosedSubjectOneCopy = this.top8SubjectOne;
      this.initEchartsFive(); //重置展示板块和top
    },

    //按经济科目折线图选择框
    async getFinacialSubjects() {
      const json = {
        year: this.blockChoosedYear,
        unitIndustry: this.choosedBlockName,
      };
      const res = await getFinacialSubjects(json);
      console.log("页面内按功能科目折线图选择框res", res);
      if (res.message === "成功") {
        console.log("message成功按功能科目折线图选择框", res.data);
        this.echoSubjectOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },
    //按经济科目top8的code
    async getFinacialSubjectsTop8() {
      const json = {
        year: this.blockChoosedYear,
        unitIndustry: this.choosedBlockName,
      };
      const res = await getFinacialSubjectsTop8(json);
      console.log("页面内按功能科目top8的coderes", res);
      if (res.message === "成功") {
        console.log("message成功按功能科目top8的code", res.data);
        this.choosedSubjectTwo = res.data; //经济科目选择的科目
        this.choosedSubjectTwoCopy = res.data; //经济科目选择的科目
        this.top8SubjectTwo = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //经济科目折线图点击重置
    initGraph7() {
      this.choosedSubjectTwo = this.top8SubjectTwo;
      this.choosedSubjectTwoCopy = this.top8SubjectTwo;
      this.initEchartsSeven(); //重置展示板块和top
    },

    //主管单位-主管单位排序按钮选项获取
    async getSpendTableSortOptions() {
      this.sortOneOptions = [];
      const res = await getSpendTableSortOptions();
      if (res.message === "成功") {
        console.log("message成功 主管单位-右侧表格排序按钮选项", res.data);
        this.sortOneOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //主管单位-主管单位筛选按钮选项获取
    async getSpendTableFilterOptions() {
      const res = await getSpendTableFilterOptions();

      if (res.message === "成功") {
        console.log("message成功 主管单位-右侧表格筛选按钮选项", res.data);
        this.paramsOneOption = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //形目分析表格数据获取总条数
    async getSpendTableTotal() {
      // when:调用时机    type: 当年支出分布情况（按项目类型）
      const json = {
        year: this.blockChoosedYear,
        unitIndustry: this.choosedBlockName,
        protype: this.currentProjectType, //左侧点击的项目类型
        choosedName: this.choosedName,
        filterCondition: this.filterConfirmArrFour,
        odName: this.sortStringTwo,
      };
      // let json;
      // if (when == "first") {
      //   json = {
      //     year: this.blockChoosedYear,
      //     unitIndustry: this.choosedBlockName,
      //     filterCondition: this.filterConfirmArrFour,
      //     odName: this.sortStringTwo,
      //   };
      // } else {
      //   json = {
      //     year: this.blockChoosedYear,
      //     unitIndustry: this.choosedBlockName,
      //     protype: this.currentProjectType, //左侧点击的项目类型
      //     filterCondition: this.filterConfirmArrFour,
      //     odName: this.sortStringTwo,
      //   };
      // }
      const res = await getSpendTableTotal(json);
      console.log("页面内形目分析表格数据获取总条数res", res);
      if (res.message === "成功") {
        console.log("message成功 形目分析表格数据获取总条数", res.data);
        this.pagination.total = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //项目分析表格数据获取
    async getSpendTable() {
      await this.getSpendTableTotal();
      const json = {
        year: this.blockChoosedYear,
        unitIndustry: this.choosedBlockName,
        protype: this.currentProjectType, //左侧点击的项目类型
        choosedName: this.choosedName, //图十选中的单位名称
        filterCondition: this.filterConfirmArrFour,
        odName: this.sortStringTwo,
        pageSize: this.pagination.pageSize,
        pageOffset: this.pagination.pageSize * (this.pagination.current - 1), //偏移量
      };
      // let json;
      // if (when == "first") {
      //   json = {
      //     year: this.blockChoosedYear,
      //     unitIndustry: this.choosedBlockName,
      //     filterCondition: this.filterConfirmArrFour,
      //     odName: this.sortStringTwo,
      //     pageSize: this.pagination.pageSize,
      //     pageOffset: this.pagination.pageSize * (this.pagination.current - 1), //偏移量
      //   };
      // } else {
      //   json = {
      //     year: this.blockChoosedYear,
      //     unitIndustry: this.choosedBlockName,
      //     protype: this.currentProjectType, //左侧点击的项目类型
      //     filterCondition: this.filterConfirmArrFour,
      //     odName: this.sortStringTwo,
      //     pageSize: this.pagination.pageSize,
      //     pageOffset: this.pagination.pageSize * (this.pagination.current - 1), //偏移量
      //   };
      // }
      const res = await getSpendTable(json);
      console.log("页面内 项目分析表格数据获取res", res);
      if (res.message === "成功") {
        console.log("message成功 项目分析表格数据获取res", res);
        this.tableData2 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //项目分析 排序：主管单位排序选项
    async getManageSortOptions() {
      this.sortTwoOptions = [];
      const res = await getManageSortOptions();
      if (res.message === "成功") {
        console.log("message成功 项目分析 排序：主管单位排序选项", res.data);
        this.sortTwoOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //项目分析：主管单位筛选选项
    async getManageFilterOptions() {
      const res = await getManageFilterOptions();
      if (res.message === "成功") {
        console.log("message成功 项目分析：主管单位筛选选项", res.data);
        this.paramsTwoOption = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //表格数据获取+初始化表格内部图表
    async getSpendTableChart() {
      const json = {
        year: this.blockChoosedYear,
        unitIndustry: this.choosedBlockName,
        filterCondition: this.filterConfirmArrThree,
        odName: this.sortStringOne,
      };
      console.log("获取表格数据的json", json);
      const res = await getSpendTableChart(json);
      if (res.message === "成功") {
        let data = res.data;
        data.forEach((item) => {
          item.graphTrend.money.color = this.lineColor[0];
          item.graphTrend.money.label = {
            show: true, // 显示标签
            position: "top", // 标签位置：top, inside, bottom
            formatter: function (params) {
              return params.value.toLocaleString() + "万元";
            },
          };
          item.graphTrend.project.color = this.lineColor[1];
          item.graphTrend.project.label = {
            show: true, // 显示标签
            position: "top", // 标签位置：top, inside, bottom
            formatter: "{c}个", // 标签内容格式
          };
          item.graphTrend.project.yAxisIndex = 1; //多y轴
          item.graphTrend.trend.color = this.lineColor[2];
          item.graphTrend.trend.label = {
            show: true, // 显示标签
            position: "top", // 标签位置：top, inside, bottom
            formatter: "{c}%", // 标签内容格式
          };
          item.graphTrend.trend.yAxisIndex = 1; //多y轴
        });
        this.tableData1 = data;
      } else {
        this.$message.error(res.message);
      }
    },
    //表格里的折柱图
    getTrendEcharts() {
      const _that = this;
      setTimeout(() => {
        this.tableData1.forEach((item) => {
          // if (myChart) {
          //   myChart.dispose();
          // }
          let oldChart = this.$echarts.getInstanceByDom(
            this.$refs["chart" + item.id]
          );
          if (oldChart) {
            oldChart.dispose();
          }
          let myChart = this.$echarts.init(this.$refs["chart" + item.id]);
          const option = {
            grid: {
              left: 10,
              top: 30,
              right: 60,
              bottom: 10,
              containLabel: true,
            },
            // grid: { right: 100 },
            tooltip: {
              enterable: true,
              trigger: "axis",
              // trigger: "axis",
              axisPointer: {
                type: "cross",
                crossStyle: {
                  color: "#999",
                },
              },
              // formatter: `{b0} <br/> {a0}&nbsp;&nbsp;&nbsp;&nbsp;{c0}万元<br/> {a1}&nbsp;&nbsp;&nbsp;&nbsp;{c1}个<br/> {a2}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{c2}%`,

              formatter: function (params) {
                const money = params[0].data.toLocaleString();
                const year = params[0].axisValue;
                const projectCount = params[1].data;
                const executionRate = params[2].data;
                const paramsYear = _that.yearRange;
                // 构建tooltip内容，包括交互元素
                let content = `<div>
                    <p>年份：${year}</p>
                     <a onClick="goPayDetail('${paramsYear[0]}','${paramsYear[1]}')" style="cursor: pointer;">支出金额：${money}万元</a>
                    <p>项目数量：${projectCount}个</p>
                    <p>执行率：${executionRate}%</p>
                  </div>`;

                return content;
              },
              position: function (point) {
                return [point[0] - 20, point[1] - 20];
              },
            },
            legend: { data: this.trendGraphData.legend },
            xAxis: {
              type: "category",
              data: [
                Number(this.blockChoosedYear) - 4,
                Number(this.blockChoosedYear) - 3,
                Number(this.blockChoosedYear) - 2,
                Number(this.blockChoosedYear) - 1,
                Number(this.blockChoosedYear),
              ],

              //不显示x轴线
              // show: false,
            },
            yAxis: this.trendGraphData.yAxis,
            // yAxis: {
            //   type: "value",
            //   name: this.trendGraphData.yAxis,
            //   minInterval: 1,
            //   axisLabel: {
            //     //去除横纵坐标的起始0
            //     formatter: (value) => (value === 0 ? "" : value),
            //   },
            //   splitLine: {
            //     lineStyle: {
            //       type: "dashed",
            //     },
            //   },
            // },
            series: [
              item.graphTrend.money,
              item.graphTrend.project,
              item.graphTrend.trend,
            ],
          };
          myChart.setOption(option);
          window.addEventListener("resize", () => {
            myChart.resize();
          });
        });
      }, 1000);
    },
    async initTable() {
      await this.getSpendTableChart();
      // this.tableData1 = [
      //   {
      //     id: "1",
      //     manageName: "主管单位一",
      //     data: "200+356+95",
      //     graphTrend: {
      //       money: {
      //         name: "支出金额",
      //         type: "bar",
      //         data: [13.2, 10.1, 13.4, 23, 34.7],
      //         color: this.lineColor[0],
      //       },
      //       project: {
      //         name: "项目数量",
      //         type: "bar",
      //         data: [13, 10, 13, 23, 34],
      //         color: this.lineColor[1],
      //       },
      //       trend: {
      //         name: "执行率",
      //         type: "line",
      //         // yAxisIndex: 1,
      //         data: [43, 14, 13, 21, 74],
      //         color: this.lineColor[3],
      //       },
      //     },
      //   },
      //   {
      //     id: "2",
      //     manageName: "主管单位二",
      //     data: "300+356+95",
      //     graphTrend: {
      //       money: {
      //         name: "支出金额",
      //         type: "bar",
      //         data: [13.2, 10.1, 13.4, 23, 34.7],
      //         color: this.lineColor[0],
      //       },
      //       project: {
      //         name: "项目数量",
      //         type: "bar",
      //         data: [13, 10, 13, 23, 34],
      //         color: this.lineColor[1],
      //       },
      //       trend: {
      //         name: "执行率",
      //         type: "line",
      //         // yAxisIndex: 1,
      //         data: [43, 14, 13, 21, 74],
      //         color: this.lineColor[3],
      //       },
      //     },
      //   },
      //   {
      //     id: "3",
      //     manageName: "主管单位三",
      //     data: "400+356+95",
      //     graphTrend: {
      //       money: {
      //         name: "支出金额",
      //         type: "bar",
      //         data: [13.2, 10.1, 13.4, 23, 34.7],
      //         color: this.lineColor[0],
      //       },
      //       project: {
      //         name: "项目数量",
      //         type: "bar",
      //         data: [13, 10, 13, 23, 34],
      //         color: this.lineColor[1],
      //       },
      //       trend: {
      //         name: "执行率",
      //         type: "line",
      //         // yAxisIndex: 1,
      //         data: [43, 14, 13, 21, 74],
      //         color: this.lineColor[3],
      //       },
      //     },
      //   },
      //   {
      //     id: "4",
      //     manageName: "主管单位四",
      //     data: "100+356+95",
      //     graphTrend: {
      //       money: {
      //         name: "支出金额",
      //         type: "bar",
      //         data: [13.2, 10.1, 13.4, 23, 34.7],
      //         color: this.lineColor[0],
      //       },
      //       project: {
      //         name: "项目数量",
      //         type: "bar",
      //         data: [13, 10, 13, 23, 34],
      //         color: this.lineColor[1],
      //       },
      //       trend: {
      //         name: "执行率",
      //         type: "line",
      //         // yAxisIndex: 1,
      //         data: [43, 14, 13, 21, 74],
      //         color: this.lineColor[3],
      //       },
      //     },
      //   },
      // ];
      this.getTrendEcharts();
    },
    //点击表格数据跳转到支出明细表
    tableJumpOne(manage) {
      const paramsYear = this.yearRange;
      this.goPayDetail(paramsYear[0], paramsYear[1], manage);
    },

    //均衡性比例修改
    handleRatioChange() {
      const options = {};
      this.handleBalanceChange(options);
    },

    //指出均衡性  选择主管单位修改
    handleUnitChangeOne() {
      this.initEchartsOne();
    },

    //均衡性折线图点击重置
    initGraph1() {
      this.choosedManageUnit = this.top8ManageUnit;
      this.choosedManageUnitCopy = this.top8ManageUnit;
      this.initEchartsOne(); //重置展示板块和top
    },

    // 整体支出均衡性堆叠折线图表展示  图1
    async getSpendChartOne() {
      const json = {
        exep_year: this.blockChoosedYear,
        unit_industry_name: this.choosedBlockName,
        code: this.choosedManageUnit,
      };
      const res = await getSpendChartOne(json);
      console.log("页面内 整体支出均衡性堆叠折线图表展示res", res);
      if (res.message === "成功") {
        console.log("message成功 整体支出均衡性堆叠折线图表", res.data);
        this.graphData1 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    handleBalanceChange(options) {
      if (!options) return;
      const balance = this.ratioNumber || 100;
      this.graphData1.seriesData.map((item1, index1) => {
        item1.data.rate.map((item2, index2) => {
          if (item2 !== null && item2 !== undefined && item2 >= balance) {
            this.myChart1.dispatchAction({
              type: "highlight",
              seriesIndex: index1,
              dataIndex: index2,
            });
          } else {
            this.myChart1.dispatchAction({
              type: "downplay",
              seriesIndex: index1,
              dataIndex: index2,
            });
          }
        });
      });
    },

    async initEchartsOne() {
      if (this.myChart1) {
        this.myChart1.dispose();
      }
      await this.getSpendChartOne();
      this.myChart1 = this.$echarts.init(this.$refs.graph1);

      this.graphData1.xAxis = MONTHS;

      const _that = this;
      //整体支出均衡性
      const option1 = {
        tooltip: {
          //trigger: "axis",
          enterable: true,
          trigger: "item",
          borderWidth: 0,
          triggerOn: "mousemove",
          // triggerOn: "click", // 设置触发方式为点击
          formatter: function (params) {
            if (params.seriesName.length === 0) {
              return ""; // 没有数据时，不显示 tooltip
            }
            //跳转携带时间
            let month = monthNameToNumber(params.name);
            const paramsYear = _that.yearRange;
            const paramsMonth = getMonthStartEnd(_that.blockChoosedYear, month);
            if (
              _that.graphData1.seriesData[params.seriesIndex].type === "block"
            ) {
              // console.log("参数携带", paramsMonth, paramsYear);
              //jump
              // 1.主管单位名称带超链接，点击后进入主管单位画像
              // 2.年支出金额、月金额带超链接，点击后进入支付明细表，自动带入当前的板块、主管单位、时间周期等筛选条件
              return `<div class="ratio-tooltip-box" style="pointer-events:auto">
              <div >
                <span class="label">所选板块：</span>
                <a>${params.seriesName}</a>
              </div>
              <div>
                <span class="label">年支出金额：</span>
              <a onClick="goPayDetail('${paramsYear[0]}','${
                paramsYear[1]
              }')" style="cursor: pointer;">${Number(
                _that.graphData1.seriesData[params.seriesIndex].data.totalMoney
              ).toLocaleString()}万元</a>
                </div>
              <div>
                <span class="label">月支出金额：</span>
                 <a onClick="goPayDetail('${paramsMonth[0]}','${
                paramsMonth[1]
              }')" style="cursor: pointer;">
              ${Number(
                _that.graphData1.seriesData[params.seriesIndex].data.money[
                  params.dataIndex
                ]
              ).toLocaleString()}万元</a>
              </div>
              <div>
                <span class="label">占比：</span>
                ${params.data}%</div>
            </div>`;
            } else {
              return `<div class="ratio-tooltip-box" style="pointer-events:auto">
              <div>
                <span class="label">主管单位：</span>
                <a>${params.seriesName}</a>
              </div>
              <div>
                <span class="label">年支出金额：</span>
                <a onClick="goPayDetail('${paramsYear[0]}','${
                paramsYear[1]
              }','${params.seriesName}')" style="cursor: pointer;">${Number(
                _that.graphData1.seriesData[params.seriesIndex].data.totalMoney
              ).toLocaleString()}万元</a>
                </div>
              <div>
                <span class="label">月支出金额：</span>
                <a onClick="goPayDetail('${paramsMonth[0]}','${
                paramsMonth[1]
              }','${params.seriesName}')" style="cursor: pointer;">${Number(
                _that.graphData1.seriesData[params.seriesIndex].data.money[
                  params.dataIndex
                ]
              ).toLocaleString()}万元</a>
              </div>
              <div><span class="label">占比：</span>${params.data}%</div>
            </div>`;
            }
          },
          //弹框固定位置
          position: function (point, params) {
            // 固定提示框位置
            // console.log("tooltip参数point", point);
            // console.log("tooltip参数params", params);
            // console.log("tooltip参数dom", dom);
            // console.log("tooltip参数rect", rect);
            // console.log("tooltip参数size", size);
            if (params.dataIndex == 10) {
              console.log("params.dataIndex == 10");
              return [point[0] - 80, point[1] - 80];
            } else if (params.dataIndex == 11) {
              return [point[0] - 130, point[1] - 130];
            } else {
              return [point[0] + 5, point[1] + 5];
            }
          },
          confine: true,
        },
        legend: {
          type: "plain",
          data: this.graphData1.legend,
          selected: {},
          padding: [5, 20, 5, 20],
          selector: [
            {
              type: "all",
              title: "全选",
            },
            {
              type: "inverse",
              title: "全不选",
            },
          ],
          selectorLabel: {
            color: "#fff",
            backgroundColor: "#1890ff",
            borderWidth: 0,
            fontSize: 10,
            padding: [4, 6],
          },
          emphasis: {
            selectorLabel: {
              backgroundColor: "#40a9ff",
            },
          },
          textStyle: {
            width: 100,
            overflow: "truncate",
          },
        },

        grid: {
          left: 45,
          top: 80,
          right: 30,
          bottom: 30,
          // containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.graphData1.xAxis,
            axisPointer: {
              type: "shadow",
            },
            axisLine: {
              //坐标轴轴线相关设置。数学上的x轴
              show: false,
            },
            axisTick: {
              // 不展示刻度
              show: false,
            },
          },
          {
            type: "category",
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { show: false },
            splitArea: { show: false },
            splitLine: { show: false },
            axisPointer: { show: false },
          },
        ],
        yAxis: {
          type: "value",
          name: "比率（%）",
          minInterval: 1,
          // axisLabel: {
          //   formatter: "{value}%",
          // },
          axisLabel: {
            show: true,
            //去除横纵坐标的起始0
            formatter: (value) => (value === 0 ? "" : value),
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
          min: "dataMin",
          max: "dataMax",
        },
        series: [],
      };

      // 月度
      for (let i = 0; i < this.graphData1.seriesData.length; i++) {
        option1.series.push({
          type: "line",
          // stack: "total",
          label: {
            show: true,
            position: "top",
            formatter: "{c}%", // 使用模板字符串添加单位
          },
          name: this.graphData1.seriesData[i].name,
          data: this.graphData1.seriesData[i].data.rate,
          lineStyle: {
            width: 1.5, // 设置线条的粗细，表示1.5个像素
          },
          color:
            this.graphData1.seriesData[i].type == "block"
              ? "#BCC4D0"
              : this.lineColor[i],
          emphasis: {
            disabled: true,
            itemStyle: {
              color: "red",
              borderColor: "yellow",
              borderWidth: 2,
              borderType: "solid",
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
          symbolSize: 10,
          legendHoverLink: false, // emphasis.disabled不生效， 手动处理图表移入、移出的高亮事件
        });
      }

      // //默认只有板块和top1初始展示
      // for (let i = 2; i < this.graphData1.legend.length; i++) {
      //   option1.legend.selected[this.graphData1.legend[i]] = false;
      // }
      this.myChart1.setOption(option1, true);
      this.handleBalanceChange(option1);
      // emphasis.disabled不生效， 手动处理图表移入、移出的高亮事件
      this.myChart1.on("mouseover", () => {
        this.handleBalanceChange(option1);
      });
      this.myChart1.on("mouseout", () => {
        this.handleBalanceChange(option1);
      });
      this.myChart1.on("legendselectchanged", () => {
        this.handleBalanceChange(option1);
      });
      this.myChart1.on("legendSelectAll", () => {
        this.handleBalanceChange(option1);
      });
      this.myChart1.on("legendInverseSelect", (params) => {
        const { selected } = params;
        for (const key in selected) {
          selected[key] = false;
        }
        option1.legend.selected = selected;
        this.myChart1.setOption(option1, true);
      });
      highlight(this.myChart1);

      //图表背景色
      // handleAddEchartsBackground(this.myChart1, option1, this.graphData1.xAxis);
      //点击legend实时改变纵坐标
      // this.myChart1.on("legendselectchanged", (params) => {
      //   const selectedSeries = params.selected;
      //   const data = [];

      //   for (const seriesName in selectedSeries) {
      //     if (selectedSeries[seriesName]) {
      //       const series = option1.series.find((s) => s.name === seriesName);
      //       if (series) {
      //         data.push(...series.data);
      //       }
      //     }
      //   }
      //   const _that = this;
      //   if (data.length > 0) {
      //     const max = Math.max(...data);
      //     const min = Math.min(...data);

      //     _that.myChart1.setOption({
      //       yAxis: {
      //         min: min - 10, // 可以根据需要调整
      //         max: max + 10, // 可以根据需要调整
      //       },
      //     });
      //     handleAddEchartsBackground(
      //       _that.myChart1,
      //       option1,
      //       _that.graphData1.xAxis
      //     );
      //   }
      // });
    },

    // 按资金来源环形图  图2
    async getSpendChartTwo() {
      const json = {
        year: this.blockChoosedYear,
        unitIndustry: this.choosedBlockName,
      };
      const res = await getSpendChartTwo(json);
      if (res.message === "成功") {
        console.log("message成功页面内资金来源环形图", res.data);
        this.graphData2 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },
    //获取图2的表格
    async getSpendChartTwoTable() {
      const json = {
        year: this.blockChoosedYear,
        unitIndustry: this.choosedBlockName,
      };
      this.tableLoading3 = true;
      const res = await getSpendChartTwoTable(json);
      this.tableLoading3 = false;
      if (res.message === "成功") {
        console.log("message成功页面内 获取图2的表格", res.data);
        this.tableData3 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },
    async initEchartsTwo() {
      if (this.myChart2) {
        this.myChart2.dispose();
      }
      this.myChart2 = this.$echarts.init(this.$refs.graph2);
      await this.getSpendChartTwo();
      const _that = this;
      //环形图中心总额文字长度自适应
      let maxWidth = 120; // 设置最大宽度
      let initialFontSize = 24; // 初始字体大小
      let adjustedFontSize = adjustFontSize(
        Number(this.graphData2.total).toLocaleString(),
        maxWidth,
        initialFontSize
      );
      const option2 = {
        // tooltip: {
        //   enterable: true,
        //   trigger: "item",
        //   triggerOn: "mousemove",
        //   //triggerOn: "click", // 设置触发方式为点击
        //   formatter: (params) => {
        //     const name = params.data.name;
        //     const value = params.data.value;
        //     const paramsYear = _that.yearRange;
        //     //用户点击总额数字或图形上的某一个分类后，系统跳转进入【支出明细表】，并自动附带筛选条件【板块名称】【资金来源】【时间范围】。
        //     return `<div class="ratio-tooltip-box" style="pointer-events:auto">
        //       <div>
        //         <a onClick="goPayDetail('${paramsYear[0]}','${paramsYear[1]}',null,'${params.name}')" style="cursor: pointer;">${name}：${value}万元</a>
        //       </div>
        //      `;
        //   },
        //   //弹框固定位置
        //   position: function (point) {
        //     return [point[0] + 5, point[1] + 5];
        //   },
        // },
        // legend: {
        //   type: "scroll",
        //   orient: "horizontal",
        //   //top: -10,
        //   // bottom: 60,
        //   //data: this.legendData,
        // },
        series: [
          {
            type: "pie",
            radius: ["40%", "60%"],
            center: ["50%", "50%"],
            // roseType: "radius",   //圆环大小不一
            // 避免数据过小 不展示
            minAngle: 1,
            data: this.graphData2.seriesData,
            color: [
              this.lineColor[0],
              this.lineColor[1],
              this.lineColor[2],
              this.lineColor[3],
              this.lineColor[4],
              this.lineColor[5],
              this.lineColor[6],
              this.lineColor[7],
              this.lineColor[8],
              this.lineColor[9],
              this.lineColor[10],
            ],
            label: {
              position: "outer",
              alignTo: "edge",
              margin: 24,
              formatter: (params) => {
                const name = params.data.name;
                const value = Number(params.data.value).toLocaleString();
                const rate = params.data.rate;
                return `{a|${name}}\n{b|${value}万元}\n{c|${rate}%}`;
              },
              rich: {
                b: {
                  fontSize: 12,
                  // lineHeight: 30,
                  // align: "center",
                  color: "#0161ff", // 设置数值的样式
                },
              },
            },
            //伸出的箭头
            labelLine: {
              //以下代码注释为实现：指示线颜色与扇形块颜色一致
              lineStyle: {
                color: "#97A3B7",
              },
              smooth: 0.2,
              // length: 30,
              // length2: 20,
            },
            animationType: "scale",
            animationEasing: "elasticOut",
            animationDelay: function () {
              return Math.random() * 200;
            },
          },
        ],
        graphic: [
          {
            //环形图中间添加文字
            type: "text", //通过不同top值可以设置上下显示
            left: "center",
            top: 160,
            style: {
              text: Number(this.graphData2.total).toLocaleString(),
              textAlign: "center",
              fill: "#1C222B", //文字的颜色
              // fontSize: 24,
              // lineHeight: 24,
              fontWeight: 600,
              fontSize: adjustedFontSize,
              lineHeight: adjustedFontSize,
            },
          },
          {
            //环形图中间添加文字
            type: "text", //通过不同top值可以设置上下显示
            left: "center",
            top: 190,
            style: {
              text: "支出总额  (万元)",
              textAlign: "center",
              fill: "##1C222B", //文字的颜色
              fontSize: 12,
              lineHeight: 20,
            },
          },
        ],
      };

      this.myChart2.setOption(option2);
      this.getSpendChartTwoTable(); //获取图2右侧的表格
      // 用户点击总额数字或图形上的某一个分类后，系统跳转进入【支出明细表】，并自动附带筛选条件【板块名称】【资金来源】【时间范围】。
      //2024-6-28最新要求，点击图联动，点tooltip跳转
      this.myChart2.on("click", (params) => {
        //新要求，，点击圆环不跳转，点击label跳转
        if (params.event.target.style.text) {
          const paramsYear = _that.yearRange;
          this.goPayDetail(paramsYear[0], paramsYear[1], null, params.name);
        }
      });
    },

    // 按资金来源归一化图
    async getSpendChartThree() {
      const json = {
        year: this.blockChoosedYear,
        unitIndustry: this.choosedBlockName,
      };
      const res = await getSpendChartThree(json);
      console.log("页面内按资金来源归一化图res", res);
      if (res.message === "成功") {
        console.log("message成功页面按资金来源归一化图", res.data);
        this.graphData3 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },
    async initEchartsThree() {
      if (this.myChart3) {
        this.myChart3.dispose();
      }
      this.myChart3 = this.$echarts.init(this.$refs.graph3);
      await this.getSpendChartThree();
      const _that = this;

      //飘带处理
      const needGrid = {
        left: 25, //left
        right: 30, //right
        top: 40, //top
        bottom: 20, //bottom
        // containLabel: true,
      };

      //处理rawData
      const rawData = [];
      for (let i = 0; i < this.graphData3.seriesData.length; i++) {
        let arr = [];
        for (let j = 0; j < this.graphData3.xAxis.length; j++) {
          arr.push(this.graphData3.seriesData[i].money[j]);
        }
        rawData.push(arr);
      }
      // console.log("rawData", rawData);
      //处理totalData
      const totalData = [];
      // const color = ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de"];
      for (let i = 0; i < rawData[0].length; ++i) {
        let sum = 0;
        for (let j = 0; j < rawData.length; ++j) {
          sum += rawData[j][i];
        }
        totalData.push(sum);
      }
      // console.log("totalData", totalData);
      //定义变量
      const gridWidth =
        this.myChart3.getWidth() - needGrid.left - needGrid.right;
      const gridHeight =
        this.myChart3.getHeight() - needGrid.top - needGrid.bottom;
      const categoryWidth = gridWidth / rawData[0].length;
      const barWidth = categoryWidth * 0.4;
      const barPadding = (categoryWidth - barWidth) / 2;
      //处理elements
      const elements = [];
      for (let j = 1, jlen = rawData[0].length; j < jlen; ++j) {
        const leftX = needGrid.left + categoryWidth * j - barPadding;
        const rightX = leftX + barPadding * 2;
        let leftY = needGrid.top + gridHeight;
        let rightY = leftY;
        for (let i = 0, len = this.graphData3.legend.length; i < len; ++i) {
          const points = [];
          const leftBarHeight =
            (rawData[i][j - 1] / totalData[j - 1]) * gridHeight;
          points.push([leftX, leftY]);
          points.push([leftX, leftY - leftBarHeight]);
          const rightBarHeight = (rawData[i][j] / totalData[j]) * gridHeight;
          points.push([rightX, rightY - rightBarHeight]);
          points.push([rightX, rightY]);
          points.push([leftX, leftY]);
          leftY -= leftBarHeight;
          rightY -= rightBarHeight;
          elements.push({
            type: "polygon",
            shape: {
              points,
            },
            style: {
              fill: this.lineColor[i],
              // fill: "#",
              opacity: 0.25,
            },
          });
        }
      }

      //整体支出均衡性
      const option3 = {
        tooltip: {
          enterable: true,
          //trigger: "axis",
          triggerOn: "mousemove",
          // triggerOn: "click", // 设置触发方式为点击
          formatter: function (params) {
            const paramsYear = getYearStartEnd(params.name);
            //jump
            // 用户点击图形上的某一个分类后，系统跳转进入【支出明细表】，并自动附带筛选条件【板块名称】【资金来源】【时间范围】。
            if (params.seriesName.length === 0) {
              return ""; // 没有数据时，不显示 tooltip
            }
            return `<div class="ratio-tooltip-box">
              <div>
                年份：${params.name}
              </div>
                资金来源：${params.seriesName}
              <div>
                <a  style="cursor: pointer;" onClick="goPayDetail('${
                  paramsYear[0]
                }','${paramsYear[1]}',null,'${
              params.seriesName
            }')">支出金额：${Number(
              _that.graphData3.seriesData[params.seriesIndex].money[
                params.dataIndex
              ]
            ).toLocaleString()}万元</a>
              </div>
              <div>占比：${(params.value * 100).toFixed(2) + "%"}</div>
            </div>`;
          },
          confine: true,
          //弹框固定位置
          position: function (point) {
            return [point[0], point[1]];
          },
        },
        legend: {
          type: "scroll",
          // top: 10,
          data: this.graphData3.legend,
          selectedMode: false, // 禁用图例的点击功能
          // data: [],
        },
        grid: needGrid,
        xAxis: [
          {
            type: "category",
            data: this.graphData3.xAxis,
            axisPointer: {
              type: "shadow",
            },
            axisLine: {
              //坐标轴轴线相关设置。数学上的x轴
              show: false,
            },
            axisTick: {
              // 不展示刻度
              show: false,
            },
          },
          {
            type: "category",
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { show: false },
            splitArea: { show: false },
            splitLine: { show: false },
            axisPointer: { show: false },
          },
        ],
        yAxis: {
          type: "value",
          name: "归一化值",
          // minInterval: 1,
          // axisLabel: {
          //   formatter: "{value}%",
          // },
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
          axisLabel: {
            show: true,
            //去除横纵坐标的起始0
            formatter: (value) => (value === 0 ? "" : value),
          },
        },
        series: [],
        graphic: {
          elements,
        },
      };

      // 年度数据
      for (let i = 0; i < this.graphData3.seriesData.length; i++) {
        option3.series.push({
          type: "bar",
          stack: "total",
          barWidth: "40%",
          label: {
            show: true,
            formatter: (params) => (params.value * 100).toFixed(2) + "%",
          },
          name: this.graphData3.seriesData[i].name,
          data: this.graphData3.seriesData[i].rate,
          color: this.lineColor[i],
        });
      }

      this.myChart3.setOption(option3, true);
      // this.myChart3.on("click", () => {
      //   // console.log("点击环形图事件", params);
      //   this.$router.push({
      //     name: "payDetail",
      //     params: {
      //       /* optional params */
      //     },
      //   });
      // });
    },

    // 按功能科目矩形树图
    async getSpendChartFour() {
      const json = {
        year: this.blockChoosedYear,
        unitIndustry: this.choosedBlockName,
      };
      const res = await getSpendChartFour(json);
      console.log("页面内按功能科目矩形树图res", res);
      if (res.message === "成功") {
        console.log("message成功 按功能科目矩形树图", res.data);
        this.graphData4 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },
    async initEchartsFour() {
      if (this.myChart4) {
        this.myChart4.dispose();
      }
      this.myChart4 = this.$echarts.init(this.$refs.graph4);
      await this.getSpendChartFour();
      const _that = this;
      //整体支出均衡性
      const option4 = {
        tooltip: {
          enterable: true, // 鼠标能追得上tooltip
          //trigger: "axis",
          triggerOn: "mousemove",
          // triggerOn: "click", // 设置触发方式为点击
          //jump
          // 用户点击图形上的某一分类后，系统跳转进入【支出明细表】，并自动附带筛选条件【板块名称】【功能科目】【时间范围】。
          formatter: function (params) {
            const paramsYear = _that.yearRange;
            return `<div class="ratio-tooltip-box" style="pointer-events:auto">
              <div>年份：${params.data.year}</div>
              <div>功能科目：${params.data.name}</div>
              <a onClick="goPayDetail('${paramsYear[0]}','${
              paramsYear[1]
            }',null,null,'${
              params.name
            }')" style="cursor: pointer;">支出金额：${Number(
              params.data.value
            ).toLocaleString()}万元</a>
              <div >占比：${params.data.per}%</div>
            </div>`;
          },
          //弹框固定位置
          position: function (point) {
            return [point[0] + 5, point[1] + 5];
          },
        },
        //工具栏
        // toolbox: {
        //   show: true,
        //   x: "center",
        //   feature: {
        //     // dataView: dataMapDataView(fileName),
        //     restore: { show: true },
        //     saveAsImage: { show: true },
        //   },
        // },

        grid: {
          x: 15,
          y: 70,
          x2: 15,
          y2: 10,
          containLabel: true,
        },

        series: [
          {
            name: "全部",
            type: "treemap", //图例样式，矩形树
            width: "100%",
            height: "86%",
            leafDepth: 1, //控制一层最多显示多深
            roam: false, //false是否开启拖拽漫游（移动和缩放）。
            // breadcrumb: {
            //   show: false, //是否展示下方黑色导航栏
            // },

            levels: [
              // 第一个层级的配置
              {
                // 设置每个矩形的边框样式
                itemStyle: {
                  borderColor: "#fff", // 边框颜色
                  borderWidth: 1, // 边框宽度
                  //todo 这边打开，会导致鼠标移入时出现undefined的情况
                  // gapWidth: 1, // 矩形之间的间隔宽度
                },
                // 设置上方标签的显示方式
                upperLabel: {
                  show: false, // 是否显示上方标签
                },
              },
              // 第二个层级的配置
              {
                // 设置每个矩形的边框样式
                itemStyle: {
                  borderColor: "#fff", // 边框颜色
                  borderWidth: 1, // 边框宽度
                  // gapWidth: 1, // 矩形之间的间隔宽度
                },
                // 设置上方标签的显示方式
                upperLabel: {
                  show: false, // 是否显示上方标签
                },
              },
              // 第三个层级的配置
              {
                // 设置每个矩形的边框样式
                itemStyle: {
                  borderColor: "#fff", // 边框颜色
                  borderWidth: 1, // 边框宽度
                  //todo 这边打开，会导致鼠标移入时出现undefined的情况
                  // gapWidth: 1, // 矩形之间的间隔宽度
                },
                // 设置上方标签的显示方式
                upperLabel: {
                  show: false, // 是否显示上方标签
                },
              },
            ],
            // nodeClick: "none", //不移动
            //下面一定要注释，不然页面展示不出来
            label: {
              formatter: function (params) {
                return params.data.name + "\n\n" + params.data.per + "%";
              },
            },
            // label: {
            //   formatter: function (params) {
            //     if (params.data.name.length < 6) {
            //       return (
            //         params.data.name +
            //         "\n\n" +
            //         "支出金额：" +
            //         params.data.value +
            //         "万元"
            //       );
            //     } else {
            //       return (
            //         params.data.name.slice(0, 5) +
            //         "..." +
            //         "\n\n" +
            //         "支出金额：" +
            //         params.data.value +
            //         "万元"
            //       );
            //     }
            //   },
            // },

            data: this.graphData4.seriesData,
          },
        ],
        //todo 矩形树图颜色设置
        // visualMap: {
        //   show: false,
        //   // max: 10,
        //   // calculable: true,
        //   // orient: "vertical",
        //   // top: "center",
        //   // right: "0%",
        //   inRange: {
        //     color: ["#E8F3FF", "#4080FF", "#000D4D"],
        //   },
        // },
      };

      this.myChart4.on("click", (params) => {
        console.log(params);
      });
      this.myChart4.setOption(option4, true);
    },

    // 资金结构（按功能科目）折线图
    async getSpendChartFive() {
      const json = {
        year: this.blockChoosedYear,
        unitIndustry: this.choosedBlockName,
        expFuncCodes: this.choosedSubjectOne, //功能科目
      };
      const res = await getSpendChartFive(json);
      console.log("页面内 资金结构（按功能科目）折线图res", res);
      if (res.message === "成功") {
        console.log("message成功 资金结构（按功能科目）折线图", res.data);
        this.graphData5 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },
    async initEchartsFive() {
      if (this.myChart5) {
        this.myChart5.dispose();
      }
      this.myChart5 = this.$echarts.init(this.$refs.graph5);
      await this.getSpendChartFive();
      const _that = this;
      //整体支出均衡性
      const option5 = {
        tooltip: {
          //trigger: "axis",
          // triggerOn: "click",
          triggerOn: "mousemove",
          enterable: true,
          // triggerOn: "mousemove", // 设置触发方式为悬停
          //jump
          // 用户点击图形上的某一个支出金额后，系统跳转进入【支出明细表】，并自动附带筛选条件【板块名称】【功能科目】【时间范围】。
          formatter: function (params) {
            if (params.seriesName.length === 0) {
              return ""; // 没有数据时，不显示 tooltip
            }

            const paramsYear = getYearStartEnd(params.name);
            return `<div class="ratio-tooltip-box" style="pointer-events:auto">
              <div>年份：${params.name}</div>
              <div>功能科目：${params.seriesName}</div>
              <a onClick="goPayDetail('${paramsYear[0]}','${
              paramsYear[1]
            }',null,null,'${
              params.seriesName
            }')" style="cursor: pointer;">支出金额：${Number(
              params.data
            ).toLocaleString()}万元</a>
              <div>占比：${
                _that.graphData5.seriesData[params.seriesIndex].data.rate[
                  params.dataIndex
                ]
              }%</div>
            </div>`;
          },
          //弹框固定位置
          position: function (point) {
            return [point[0] + 5, point[1] + 5];
          },
        },
        legend: {
          type: "scroll",
          // top: 10,
          data: this.graphData5.legend,
          // data: [],
        },
        grid: {
          x: 15,
          y: 70,
          x2: 15,
          y2: 10,
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.graphData5.xAxis,
            axisPointer: {
              type: "shadow",
            },
            axisLine: {
              //坐标轴轴线相关设置。数学上的x轴
              show: false,
            },
            axisTick: {
              // 不展示刻度
              show: false,
            },
          },
          {
            type: "category",
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { show: false },
            splitArea: { show: false },
            splitLine: { show: false },
            axisPointer: { show: false },
          },
        ],
        yAxis: {
          type: "value",
          name: this.graphData5.yAxis.name + "（万元）",
          minInterval: 1,
          axisLabel: {
            //去除横纵坐标的起始0
            formatter: (value) => (value === 0 ? "" : value),
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
          min: "dataMin",
          max: "dataMax",
        },
        series: [],
      };

      // 月度
      for (let i = 0; i < this.graphData5.seriesData.length; i++) {
        option5.series.push({
          type: "line",
          // stack: "Total",
          name: this.graphData5.seriesData[i].name,
          data: this.graphData5.seriesData[i].data.money,
          color: this.lineColor[i],
          label: {
            show: true,
            position: "top",
            formatter: function (params) {
              return params.value.toLocaleString();
            },
          },
        });
      }
      this.myChart5.setOption(option5, true);
      //图表背景色
      // handleAddEchartsBackground(this.myChart5, option5, this.graphData5.xAxis);
      //点击legend实时改变纵坐标
      this.myChart5.on("legendselectchanged", (params) => {
        const selectedSeries = params.selected;
        const data = [];

        for (const seriesName in selectedSeries) {
          if (selectedSeries[seriesName]) {
            const series = option5.series.find((s) => s.name === seriesName);
            if (series) {
              data.push(...series.data);
            }
          }
        }
        const _that = this;
        if (data.length > 0) {
          const max = Math.max(...data);
          const min = Math.min(...data);

          _that.myChart5.setOption({
            yAxis: {
              min: min - 10, // 可以根据需要调整
              max: max + 10, // 可以根据需要调整
            },
          });
          // handleAddEchartsBackground(
          //   _that.myChart5,
          //   option5,
          //   _that.graphData5.xAxis
          // );
        }
      });
    },

    // 按经济科目矩形树图
    async getSpendChartSix() {
      const json = {
        year: this.blockChoosedYear,
        unitIndustry: this.choosedBlockName,
      };
      const res = await getSpendChartSix(json);
      console.log("页面内按经济科目矩形树图res", res);
      if (res.message === "成功") {
        console.log("message成功按经济科目矩形树图", res.data);
        this.graphData6 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },
    async initEchartsSix() {
      if (this.myChart6) {
        this.myChart6.dispose();
      }
      this.myChart6 = this.$echarts.init(this.$refs.graph6);
      await this.getSpendChartSix();
      const _that = this;
      //整体支出均衡性
      const option6 = {
        tooltip: {
          enterable: true, // 鼠标能追得上tooltip
          //trigger: "axis",
          triggerOn: "mousemove",
          //triggerOn: "click", // 设置触发方式为点击
          //jump
          // 用户点击图形上的某一分类后，系统跳转进入【支出明细表】，并自动附带筛选条件【板块名称】【经济科目】【时间范围】。
          formatter: function (params) {
            const paramsYear = _that.yearRange;
            return `<div class="ratio-tooltip-box" style="pointer-events:auto">
              <div>年份：${params.data.year}</div>
              <div>经济科目：${params.data.name}</div>
              <a onClick="goPayDetail('${paramsYear[0]}','${
              paramsYear[1]
            }',null,null,null,'${
              params.name
            }')" style="cursor: pointer;">支出金额：${Number(
              params.data.value
            ).toLocaleString()}万元</a>
              <div >占比：${params.data.per}%</div>
            </div>`;
          },
          //弹框固定位置
          position: function (point) {
            return [point[0] + 5, point[1] + 5];
          },
        },
        //工具栏
        // toolbox: {
        //   show: true,
        //   x: "center",
        //   feature: {
        //     // dataView: dataMapDataView(fileName),
        //     restore: { show: true },
        //     saveAsImage: { show: true },
        //   },
        // },

        grid: {
          x: 15,
          y: 70,
          x2: 15,
          y2: 10,
          containLabel: true,
        },

        series: [
          {
            name: "全部",
            type: "treemap", //图例样式，矩形树
            width: "100%",
            height: "86%",
            leafDepth: 1, //控制一层最多显示多深
            roam: false, //false是否开启拖拽漫游（移动和缩放）。
            // breadcrumb: {
            //   show: false, //是否展示下方黑色导航栏
            // },

            levels: [
              // 第一个层级的配置
              {
                // 设置每个矩形的边框样式
                itemStyle: {
                  borderColor: "#fff", // 边框颜色
                  borderWidth: 1, // 边框宽度
                  // gapWidth: 1, // 矩形之间的间隔宽度
                },
                // 设置上方标签的显示方式
                upperLabel: {
                  show: false, // 是否显示上方标签
                },
              },
              // 第二个层级的配置
              {
                // 设置每个矩形的边框样式
                itemStyle: {
                  borderColor: "#fff", // 边框颜色
                  borderWidth: 1, // 边框宽度
                  // gapWidth: 1, // 矩形之间的间隔宽度
                },
                // 设置上方标签的显示方式
                upperLabel: {
                  show: false, // 是否显示上方标签
                },
              },
              // 第三个层级的配置
              {
                // 设置每个矩形的边框样式
                itemStyle: {
                  borderColor: "#fff", // 边框颜色
                  borderWidth: 1, // 边框宽度
                  // gapWidth: 1, // 矩形之间的间隔宽度
                },
                // 设置上方标签的显示方式
                upperLabel: {
                  show: false, // 是否显示上方标签
                },
              },
            ],
            // nodeClick: "none", //不移动
            //下面一定要注释，不然页面展示不出来
            // label: {
            //   formatter: function (params) {
            //     if (params.data.name.length < 6) {
            //       return (
            //         params.data.name +
            //         "\n\n" +
            //         "支出金额：" +
            //         params.data.value +
            //         "万元"
            //       );
            //     } else {
            //       return (
            //         params.data.name.slice(0, 5) +
            //         "..." +
            //         "\n\n" +
            //         "支出金额：" +
            //         params.data.value +
            //         "万元"
            //       );
            //     }
            //   },
            // },
            label: {
              formatter: function (params) {
                return params.data.name + "\n\n" + params.data.per + "%";
              },
            },

            data: this.graphData6.seriesData,
          },
        ],
      };

      this.myChart6.on("click", (params) => {
        console.log(params);
      });
      this.myChart6.setOption(option6, true);
    },

    // 资金结构（按经济科目）
    async getSpendChartSeven() {
      const json = {
        year: this.blockChoosedYear,
        unitIndustry: this.choosedBlockName,
        expCode: this.choosedSubjectTwo,
      };
      const res = await getSpendChartSeven(json);
      console.log("页面内 资金结构（按经济科目）res", res);
      if (res.message === "成功") {
        console.log("message成功 资金结构（按经济科目）", res.data);
        this.graphData7 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },
    async initEchartsSeven() {
      if (this.myChart7) {
        this.myChart7.dispose();
      }
      this.myChart7 = this.$echarts.init(this.$refs.graph7);
      await this.getSpendChartSeven();
      const _that = this;
      //整体支出均衡性
      const option7 = {
        tooltip: {
          //trigger: "axis",
          // triggerOn: "click",
          triggerOn: "mousemove",
          confine: true,
          // triggerOn: "mousemove", // 设置触发方式为悬停
          //jump
          // 用户点击图形上的某一个支出金额后，系统跳转进入【支出明细表】，并自动附带筛选条件【板块名称】【经济科目】【时间范围】。
          formatter: function (params) {
            if (params.seriesName.length === 0) {
              return ""; // 没有数据时，不显示 tooltip
            }
            const paramsYear = getYearStartEnd(params.name);
            return `<div class="ratio-tooltip-box" style="pointer-events:auto">
              <div>年份：${params.name}</div>
              <div>经济科目：${params.seriesName}</div>
              <a onClick="goPayDetail('${paramsYear[0]}','${
              paramsYear[1]
            }',null,null,null,'${
              params.seriesName
            }')" style="cursor: pointer;">支出金额：${Number(
              params.data
            ).toLocaleString()}万元</a>
              <div>占比：${
                _that.graphData7.seriesData[params.seriesIndex].data.rate[
                  params.dataIndex
                ]
              }%</div>
            </div>`;
          },
          //弹框固定位置
          position: function (point) {
            return [point[0] + 5, point[1] + 5];
          },
        },
        legend: {
          type: "scroll",
          // top: 10,
          data: this.graphData7.legend,
          // data: [],
        },
        grid: {
          x: 15,
          y: 70,
          x2: 15,
          y2: 10,
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.graphData7.xAxis,
            axisPointer: {
              type: "shadow",
            },
            axisLine: {
              //坐标轴轴线相关设置。数学上的x轴
              show: false,
            },
            axisTick: {
              // 不展示刻度
              show: false,
            },
          },
          {
            type: "category",
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { show: false },
            splitArea: { show: false },
            splitLine: { show: false },
            axisPointer: { show: false },
          },
        ],
        yAxis: {
          type: "value",
          name: this.graphData7.yAxis.name + "（万元）",
          minInterval: 1,
          axisLabel: {
            //去除横纵坐标的起始0
            formatter: (value) => (value === 0 ? "" : value),
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
          min: "dataMin",
          max: "dataMax",
        },
        series: [],
      };

      // 月度
      for (let i = 0; i < this.graphData7.seriesData.length; i++) {
        option7.series.push({
          type: "line",
          // stack: "Total",
          name: this.graphData7.seriesData[i].name,
          data: this.graphData7.seriesData[i].data.money,
          color: this.lineColor[i],
          label: {
            show: true,
            position: "top",
            formatter: function (params) {
              return params.value.toLocaleString();
            },
          },
        });
      }
      this.myChart7.setOption(option7, true);
      //图表背景色
      // handleAddEchartsBackground(this.myChart7, option7, this.graphData7.xAxis);
      //点击legend实时改变纵坐标
      this.myChart7.on("legendselectchanged", (params) => {
        const selectedSeries = params.selected;
        const data = [];

        for (const seriesName in selectedSeries) {
          if (selectedSeries[seriesName]) {
            const series = option7.series.find((s) => s.name === seriesName);
            if (series) {
              data.push(...series.data);
            }
          }
        }
        const _that = this;
        if (data.length > 0) {
          const max = Math.max(...data);
          const min = Math.min(...data);

          _that.myChart7.setOption({
            yAxis: {
              min: min - 10, // 可以根据需要调整
              max: max + 10, // 可以根据需要调整
            },
          });
          // handleAddEchartsBackground(
          //   _that.myChart7,
          //   option7,
          //   _that.graphData7.xAxis
          // );
        }
      });
    },

    //当年分布情况（按主管单位分类)
    async getSpendChartEight() {
      const json = {
        year: this.blockChoosedYear,
        unitIndustry: this.choosedBlockName,
      };
      const res = await getSpendChartEight(json);
      console.log("页面内当年分布情况（按主管单位分类)res", res);
      if (res.message === "成功") {
        console.log(
          "message成功 页面内当年分布情况（按主管单位分类)",
          res.data
        );
        this.graphData8 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },
    async initEchartsEight() {
      if (this.myChart8) {
        this.myChart8.dispose();
      }
      this.myChart8 = this.$echarts.init(this.$refs.graph8);
      await this.getSpendChartEight();
      const _that = this;
      //环形图中心文字长度自适应
      let maxWidth = 90; // 设置最大宽度
      let initialFontSize = 24; // 初始字体大小
      let adjustedFontSize = adjustFontSize(
        Number(this.graphData8.total).toLocaleString(),
        maxWidth,
        initialFontSize
      );
      const option8 = {
        tooltip: {
          enterable: true,
          trigger: "item",
          triggerOn: "mousemove",
          //triggerOn: "click", // 设置触发方式为点击
          formatter: (params) => {
            //jump
            // 1.用户点击数字或图形上的某一个分类后，系统跳转进入【支出明细表】，并自动附带当前的筛选条件。
            // 2.主管单位带超链接，用户点击后进入主管单位画像。
            const name = params.data.name;
            const value = Number(params.data.value).toLocaleString();
            const paramsYear = _that.yearRange;
            const year = _that.blockChoosedYear;
            return `<div class="ratio-tooltip-box" style="pointer-events:auto">
              <div>年份：${year}</div>
              <div>主管单位：${name}</div>
              <a onClick="goPayDetail('${paramsYear[0]}','${paramsYear[1]}','${params.name}')" style="cursor: pointer;">支出金额：${value}万元</a>
              <div >占比：${params.data.rate}%</div>
            </div>`;
            //以防万一：0714
            // <a onClick="goPayDetail('${paramsYear[0]}','${paramsYear[1]}','${params.name}')" style="cursor: pointer;">支出金额：${value}万元</a>

            // return `<div class="ratio-tooltip-box" style="pointer-events:auto">
            //   <div>
            //     <a onClick="goPayDetail('${paramsYear[0]}','${
            //   paramsYear[1]
            // }','${params.name}')" style="cursor: pointer;">${name}：${Number(
            //   value
            // ).toLocaleString()}万元</a>
            //   </div>
            //  `;
          },
          //弹框固定位置
          position: function (point) {
            return [point[0] + 5, point[1] + 5];
          },
        },
        // legend: {
        //   type: "scroll",
        //   orient: "horizontal",
        //   //top: -10,
        //   // bottom: 60,
        //   //data: this.legendData,
        // },
        series: [
          {
            type: "pie",
            radius: ["45%", "65%"],
            center: ["50%", "50%"],
            // roseType: "radius", //控制每个圆环粗细是否一致
            // 避免数据过小 不展示
            // minAngle: 1,
            data: this.graphData8.seriesData,
            color: [
              this.lineColor[0],
              this.lineColor[1],
              this.lineColor[2],
              this.lineColor[3],
              this.lineColor[4],
              this.lineColor[5],
              this.lineColor[6],
              this.lineColor[7],
              this.lineColor[8],
              this.lineColor[9],
              this.lineColor[10],
            ],
            label: {
              position: "outer",
              alignTo: "edge",
              margin: 24,
              formatter: (params) => {
                const name = params.data.name;
                const value = Number(params.data.value).toLocaleString();
                const rate = params.data.rate;
                return name + "\n\n" + value + "万元\n\n" + rate + "% ";
              },
            },
            //伸出的箭头
            labelLine: {
              //以下代码注释为实现：指示线颜色与扇形块颜色一致
              lineStyle: {
                color: "#97A3B7",
              },
              smooth: 0.2,
              // length: 30,
              // length2: 20,
            },
            animationType: "scale",
            animationEasing: "elasticOut",
            animationDelay: function () {
              return Math.random() * 200;
            },
          },
        ],
        graphic: [
          {
            //环形图中间添加文字
            type: "text", //通过不同top值可以设置上下显示
            left: "center",
            top: 180,
            style: {
              text: Number(this.graphData8.total).toLocaleString(),
              textAlign: "center",
              fill: "#1C222B", //文字的颜色
              // fontSize: 24,
              // lineHeight: 24,
              fontSize: adjustedFontSize,
              lineHeight: adjustedFontSize,
              fontWeight: 600,
            },
          },
          {
            //环形图中间添加文字
            type: "text", //通过不同top值可以设置上下显示
            left: "center",
            top: 210,
            style: {
              text: "支出总额  (万元)",
              textAlign: "center",
              fill: "##1C222B", //文字的颜色
              fontSize: 12,
              lineHeight: 20,
            },
          },
        ],
      };

      this.myChart8.setOption(option8);
      //jump
      // 1.用户点击数字或图形上的某一个分类后，系统跳转进入【支出明细表】，并自动附带当前的筛选条件。
      // 2.主管单位带超链接，用户点击后进入主管单位画像。
      // this.myChart8.on("click", () => {
      //   // console.log("点击环形图事件", params);
      //   this.$router.push({
      //     name: "payDetail",
      //     params: {
      //       /* optional params */
      //     },
      //   });
      // });
    },

    // 项目分析 按主管单位分类
    async getSpendChartNine() {
      const json = {
        year: this.blockChoosedYear,
        unitIndustry: this.choosedBlockName,
      };
      const res = await getSpendChartNine(json);
      console.log("页面内项目分析 按主管单位分类res", res);
      if (res.message === "成功") {
        console.log("message成功 项目分析 按主管单位分类", res.data);
        this.graphData9 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },
    async initEchartsNine() {
      if (this.myChart9) {
        this.myChart9.dispose();
      }
      this.myChart9 = this.$echarts.init(this.$refs.graph9);
      await this.getSpendChartNine();
      // const _that = this;
      //环形图中心文字长度自适应
      let maxWidth = 85; // 设置最大宽度
      let initialFontSize = 24; // 初始字体大小
      let adjustedFontSize = adjustFontSize(
        Number(this.graphData9.total).toLocaleString(),
        maxWidth,
        initialFontSize
      );
      const _that = this;
      const option9 = {
        tooltip: {
          enterable: true,
          trigger: "item",
          triggerOn: "mousemove",
          //triggerOn: "click", // 设置触发方式为点击
          formatter: (params) => {
            const name = params.data.name;
            const value = Number(params.data.value).toLocaleString();
            const year = _that.blockChoosedYear;
            const paramsYear = _that.yearRange;

            // return name + "：" + value + "万元";
            return `<div class="ratio-tooltip-box" style="pointer-events:auto">
              <div>年份：${year}</div>
              <div>项目类型：${name}</div>
              <a onClick="goPayDetail('${paramsYear[0]}','${paramsYear[1]}', null,null,null,null,null,'${name}')" style="cursor: pointer;">支出金额：${value}万元</a>
              <div >占比：${params.data.rate}%</div>
            </div>`;
          },
          //弹框固定位置
          position: function (point) {
            return [point[0] + 5, point[1] + 5];
          },
        },
        // legend: {
        //   type: "scroll",
        //   orient: "horizontal",
        //   //top: -10,
        //   // bottom: 60,
        //   //data: this.legendData,
        // },
        series: [
          {
            type: "pie",
            radius: ["45%", "65%"],
            center: ["50%", "50%"],
            // roseType: "radius", //控制每个圆环粗细是否一致
            // 避免数据过小 不展示
            // minAngle: 1,
            data: this.graphData9.seriesData,
            color: [
              this.lineColor[0],
              this.lineColor[1],
              this.lineColor[2],
              this.lineColor[3],
              this.lineColor[4],
              this.lineColor[5],
              this.lineColor[6],
              this.lineColor[7],
              this.lineColor[8],
              this.lineColor[9],
              this.lineColor[10],
            ],
            label: {
              position: "outer",
              alignTo: "edge",
              margin: 24,
              formatter: (params) => {
                const name = params.data.name;
                const value = Number(params.data.value).toLocaleString();
                const rate = params.data.rate;
                return `{a|${name}}\n{b|${value}万元}\n{c|${rate}%}`;
              },
              rich: {
                b: {
                  fontSize: 12,
                  // lineHeight: 30,
                  // align: "center",
                  color: "#0161ff", // 设置数值的样式
                },
              },
            },
            //伸出的箭头
            labelLine: {
              //以下代码注释为实现：指示线颜色与扇形块颜色一致
              lineStyle: {
                color: "#97A3B7",
              },
              smooth: 0.2,
              // length: 30,
              // length2: 20,
            },
            animationType: "scale",
            animationEasing: "elasticOut",
            animationDelay: function () {
              return Math.random() * 200;
            },
            emphasis: {
              // focus: "none", //取消鼠标移入高亮
              focus: "self", // 点击扇形自身高亮
            },
            //选中高亮
            selectedMode: "single",
            select: {
              itemStyle: {
                // color: "#000",
                // border: "1px solid #000",
                // borderWidth: 2,
                // borderColor: "rgba(0, 255, 0, 0.8)",
                // borderType: "solid",
                // color: "rgba(0, 255, 0, 0.8)", // 选中时的颜色
                shadowBlur: 50, // 选中时的阴影模糊程度
                shadowColor: "rgba(0, 0, 0, 0.5)", // 选中时的阴影颜色
                shadowOffsetX: 25, // 选中时的阴影水平偏移
                shadowOffsetY: 25, // 选中时的阴影垂直偏移
              },
            },
          },
        ],
        graphic: [
          {
            //环形图中间添加文字
            type: "text", //通过不同top值可以设置上下显示
            left: "center",
            top: 150,
            style: {
              text: Number(this.graphData9.total).toLocaleString(),
              textAlign: "center",
              fill: "#1C222B", //文字的颜色
              // fontSize: 24,
              // lineHeight: 24,
              fontSize: adjustedFontSize,
              lineHeight: adjustedFontSize,
              fontWeight: 600,
            },
          },
          {
            //环形图中间添加文字
            type: "text", //通过不同top值可以设置上下显示
            left: "center",
            top: 170,
            style: {
              text: "支出总额(万元)",
              textAlign: "center",
              fill: "##1C222B", //文字的颜色
              fontSize: 12,
              lineHeight: 20,
            },
          },
        ],
      };

      this.myChart9.setOption(option9);
      this.myChart9.on("click", (params) => {
        this.choosedName = null; //图10的选中特定类型置为全部
        //第一次选中，第二次重新选中的时候，将当前类型置为null
        if (params.name === this.currentProjectType) {
          // 选的同一级，同一块，也就是重置
          this.currentProjectType = null;
          //新要求，，点击圆环不跳转，点击label跳转
          if (params.event.target.style.text) {
            const paramsYear = _that.yearRange;
            this.goPayDetail(
              paramsYear[0],
              paramsYear[1],
              null,
              null,
              null,
              null,
              null,
              params.name
            );
          } else {
            this.initEchartsTen();
            this.getSpendTable(); //表格数据变化
          }
        } else {
          this.currentProjectType = params.name;
          //新要求，，点击圆环不跳转，点击label跳转
          if (params.event.target.style.text) {
            const paramsYear = _that.yearRange;
            this.goPayDetail(
              paramsYear[0],
              paramsYear[1],
              null,
              null,
              null,
              null,
              null,
              params.name
            );
          } else {
            this.initEchartsTen();
            this.getSpendTable(); //表格数据变化
          }
        }
      });
    },

    // 项目分析 按项目类型分类矩形图
    async getSpendChartTen() {
      const json = {
        year: this.blockChoosedYear,
        unitIndustry: this.choosedBlockName,
        projectName: this.currentProjectType,
      };
      const res = await getSpendChartTen(json);
      console.log("页面内项目分析 按项目类型分类矩形图res", res);
      if (res.message === "成功") {
        console.log("message成功页面内项目分析 按项目类型分类矩形图", res);
        this.graphData10 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },
    async initEchartsTen() {
      if (this.myChart10) {
        this.myChart10.dispose();
      }
      this.myChart10 = this.$echarts.init(this.$refs.graph10);
      await this.getSpendChartTen();
      const _that = this;
      //整体支出均衡性
      const option10 = {
        tooltip: {
          enterable: true, // 鼠标能追得上tooltip
          //trigger: "axis",
          triggerOn: "mousemove",
          //triggerOn: "click", // 设置触发方式为点击
          //jump
          // 3.提供图表穿透功能：用户点击数字或图形上的某一个分类后，系统跳转进入【支出明细表】，并自动附带当前的筛选条件。
          // 4.主管单位名称带超链接，用户点击后进入主管单位画像页面。
          // 5.预算单位名称带超链接，用户点击后进入预算单位画像页面。
          formatter: function (params) {
            const paramsYear = _that.yearRange;
            if (params.data.type === "manage") {
              return `<div class="ratio-tooltip-box" style="pointer-events:auto">
              <div>年份：${params.data.year}</div>
              <a>主管单位名称：${params.data.name}</a>
              <div>
                <a onClick="goPayDetail('${paramsYear[0]}','${
                paramsYear[1]
              }','${params.name}')" style="cursor: pointer;">支出金额：${Number(
                params.data.value
              ).toLocaleString()}万</a>
              </div>
              <div >占比：${params.data.per}%</div>
            </div>`;
            } else {
              return `<div class="ratio-tooltip-box" style="pointer-events:auto">
              <div>年份：${params.data.year}</div>
              <a>预算单位名称：${params.data.name}</a>
              <div>
              <a onClick="goPayDetail('${paramsYear[0]}','${
                paramsYear[1]
              }',null,null,null,null,'${
                params.name
              }')" style="cursor: pointer;">支出金额：${Number(
                params.data.value
              ).toLocaleString()}万</a>
              </div>
              <div >占比：${params.data.per}%</div>
            </div>`;
            }
          },
          //弹框固定位置
          position: function (point) {
            return [point[0] + 5, point[1] + 5];
          },
        },
        //工具栏
        // toolbox: {
        //   show: true,
        //   x: "center",
        //   feature: {
        //     // dataView: dataMapDataView(fileName),
        //     restore: { show: true },
        //     saveAsImage: { show: true },
        //   },
        // },

        grid: {
          x: 15,
          y: 70,
          x2: 15,
          y2: 10,
          containLabel: true,
        },

        series: [
          {
            name: "全部",
            type: "treemap", //图例样式，矩形树
            width: "95%",
            height: "90%",
            leafDepth: 1,
            roam: false, //false是否开启拖拽漫游（移动和缩放）。
            // breadcrumb: {
            //   show: false, //是否展示下方黑色导航栏
            // },

            levels: [
              // 第一个层级的配置
              {
                // 设置每个矩形的边框样式
                itemStyle: {
                  borderColor: "#fff", // 边框颜色
                  borderWidth: 1, // 边框宽度
                  // gapWidth: 1, // 矩形之间的间隔宽度
                },
                // 设置上方标签的显示方式
                upperLabel: {
                  show: false, // 是否显示上方标签
                },
              },
              // 第二个层级的配置
              {
                // 设置每个矩形的边框样式
                itemStyle: {
                  borderColor: "#fff", // 边框颜色
                  borderWidth: 1, // 边框宽度
                  // gapWidth: 1, // 矩形之间的间隔宽度
                },
                // 设置上方标签的显示方式
                upperLabel: {
                  show: false, // 是否显示上方标签
                },
              },
              // 第二个层级的配置
              {
                // 设置每个矩形的边框样式
                itemStyle: {
                  borderColor: "#fff", // 边框颜色
                  borderWidth: 1, // 边框宽度
                  // gapWidth: 1, // 矩形之间的间隔宽度
                },
                // 设置上方标签的显示方式
                upperLabel: {
                  show: false, // 是否显示上方标签
                },
              },
              // 第二个层级的配置
              {
                // 设置每个矩形的边框样式
                itemStyle: {
                  borderColor: "#fff", // 边框颜色
                  borderWidth: 1, // 边框宽度
                  // gapWidth: 1, // 矩形之间的间隔宽度
                },
                // 设置上方标签的显示方式
                upperLabel: {
                  show: false, // 是否显示上方标签
                },
              },
            ],
            nodeClick: "none", //不移动
            //下面一定要注释，不然页面展示不出来
            // label: {
            //   formatter: function (params) {
            //     if (params.data.name.length < 6) {
            //       return (
            //         params.data.name +
            //         "\n\n" +
            //         "支出金额：" +
            //         params.data.value +
            //         "万元"
            //       );
            //     } else {
            //       return (
            //         params.data.name.slice(0, 5) +
            //         "..." +
            //         "\n\n" +
            //         "支出金额：" +
            //         params.data.value +
            //         "万元"
            //       );
            //     }
            //   },
            // },
            label: {
              formatter: function (params) {
                return params.data.name + "\n\n" + params.data.per + "%";
              },
            },

            data: this.graphData10.seriesData,
          },
        ],
      };

      this.myChart10.on("click", (params) => {
        console.log(params, "图10子图联动");
        // ||
        //   params.treePathInfo[params.treePathInfo.length - 1].name ===
        //     this.choosedName
        if (
          params.treePathInfo[params.treePathInfo.length - 1].name == "全部"
        ) {
          this.choosedName = null;
          this.getSpendTable();
        } else {
          this.choosedName =
            params.treePathInfo[params.treePathInfo.length - 1].name;
          this.getSpendTable();
        }
      });
      this.myChart10.setOption(option10, true);
    },
    //点击表格支出金额跳转
    tableJumpTwo(manage, budget) {
      console.log("manage", manage);
      const paramsYear = this.yearRange;
      this.goPayDetail(
        paramsYear[0],
        paramsYear[1],
        manage,
        null,
        null,
        null,
        budget
      );
    },

    //功能科目变化
    handleChooseSubject(value) {
      this.subjectShow = true;
      this.subjectTitle = value;
    },

    //主管单位变化
    handleChooseManage(value) {
      this.manageShow = true;
      this.manageTitle = value;
    },

    //主管单位弹框确定取消
    onCancelManage() {
      this.manageShow = false;
      this.choosedManageUnit = this.choosedManageUnitCopy;
    },
    onConfirmManage() {
      //修改主管单位top
      this.initEchartsOne();
      this.choosedManageUnitCopy = this.choosedManageUnit;
      this.onCancelManage();
    },

    //功能科目+经济科目选择弹框
    onCancel() {
      this.subjectShow = false;
      if (this.subjectTitle === "功能科目选择") {
        this.choosedSubjectOne = this.choosedSubjectOneCopy;
      } else {
        this.choosedSubjectTwo = this.choosedSubjectTwoCopy;
      }
    },
    onConfirm() {
      if (this.subjectTitle === "功能科目选择") {
        this.initEchartsFive();
        this.choosedSubjectOneCopy = this.choosedSubjectOne;
      } else {
        this.initEchartsSeven();
        this.choosedSubjectTwoCopy = this.choosedSubjectTwo;
      }
      this.onCancel();
    },

    //主管单位排序按钮
    sortOne() {
      this.sortOneShow = true;
    },
    onSortOneCancel() {
      this.sortOneShow = false;
    },
    onSortOneConfirm(sortStringOne) {
      this.sortStringOne = sortStringOne;
      this.initTable();
      this.onSortOneCancel();
    },

    //项目分析排序按钮
    sortTwo() {
      this.sortTwoShow = true;
    },
    onSortTwoCancel() {
      this.sortTwoShow = false;
    },
    onSortTwoConfirm(sortStringTwo) {
      this.sortStringTwo = sortStringTwo;
      this.getSpendTable();
      this.onSortTwoCancel();
    },

    //主管单位筛选
    filterOne() {
      this.filterOneShow = true;
    },
    onFilterOneCancel() {
      this.filterOneShow = false;
    },
    onFilterOneConfirm(filterConfirmArrThree) {
      this.filterConfirmArrThree = filterConfirmArrThree;
      this.initTable();
      this.onFilterOneCancel();
    },

    //筛选：主管单位筛选选项 增加
    addTable3(json) {
      this.filterTableData3 = [...this.filterTableData3, json];
    },
    //筛选：主管单位筛选选项 删除
    delTable3(arr) {
      this.filterTableData3 = arr;
    },

    //项目分析筛选按钮
    filterTwo() {
      this.filterTwoShow = true;
    },
    onFilterTwoCancel() {
      this.filterTwoShow = false;
    },
    onFilterTwoConfirm(filterConfirmArrFour) {
      this.filterConfirmArrFour = filterConfirmArrFour;
      this.getSpendTable();
      this.onFilterTwoCancel();
    },

    //筛选：项目分析筛选选项 增加
    addTable4(json) {
      this.filterTableData4 = [...this.filterTableData4, json];
    },
    //筛选：主管单位筛选选项 增加
    delTable4(arr) {
      this.filterTableData4 = arr;
    },
  },
};
</script>
<style lang="less">
.spend-condition {
  width: 100%;
  background: #ffffff;
  padding: 0 20px 20px 20px;

  .data-overview {
    width: 100%;
    height: 375px;
    display: flex;
    justify-content: space-between;

    &-item {
      height: 100%;
      width: calc(50% - 10px);
      padding: 11px 20px 20px 20px;
      border-radius: 6px;
      border: 1px solid #d6dbe3;
      background: #fff;

      .item-top {
        height: 22px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;

        &-title {
          color: #1c222b;
          font-weight: 600;
        }

        .action-choose {
          margin-right: 8px;
        }

        .right-action-input {
          margin-right: 10px;
          width: 70px;
        }
      }

      .item-split {
        width: 100%;
        height: 1px;
        background: #016eff;
        margin-bottom: 20px;
        // background: url("~@/assets/images/img/rectangle_line.svg") no-repeat
        //   bottom;
        // background-size: 100%;
      }

      .item-content {
        &-left {
          width: 100%;
          height: 292px;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-template-rows: 136px;
          gap: 20px;

          .left-unit {
            height: 136px;
            padding: 25px 0 25px 16px;
            color: #3c485c;
            border-radius: 6px;
            background: linear-gradient(104deg, #dfeaff 0%, #f4f6ff 100.1%);
            position: relative;

            .unit-top {
              height: 22px;
              line-height: 22px;
            }

            .unit-middle {
              margin: 10px 0;
              font-weight: 500;
              //font-family: "DIN Alternate";
              font-size: 24px;
              height: 24px;
              line-height: 24px;
            }

            .unit-bottom {
              display: flex;

              &-icon {
                width: 12px;
                height: 12px;
                margin-left: 4px;
              }
            }

            .unit-icon {
              width: 64px;
              height: 64px;
              position: absolute;
              right: 20px;
              bottom: 16px;
            }
          }

          .left-unit-second {
            background: linear-gradient(104deg, #e1f8ff 0.1%, #eff9ff 99.9%);
          }
        }

        &-right {
          width: 100%;
          height: 292px;
          display: flex;

          // .right-action {
          //   flex: 1;
          //   // width: 150px;
          //   height: 100%;
          //   margin-left: 20px;

          //   &-label {
          //     color: #3c485c;
          //   }

          //   &-input {
          //     width: 60px;
          //     margin: 15px 0;
          //   }

          //   &-select {
          //     width: 100%;
          //     display: block;
          //     margin: 15px 0;

          //     .ant-select-selection {
          //       max-height: 90px;
          //       overflow-y: scroll;
          //     }
          //   }
          // }

          .right-graph {
            width: 100%;
            //width: calc(100% - 170px);
            height: 100%;
          }
        }
      }
    }
  }

  .money-structure {
    width: 100%;
    margin-top: 20px;

    &-wrapper {
      //大框
      width: 100%;
      height: 480px;
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;

      //各个图
      .wrapper-box {
        width: calc(50% - 10px);
        border-radius: 6px;
        border: 1px solid #d6dbe3;
        background: #fff;
        // height: 444px;
        padding: 12px 20px 20px 20px;

        .wrapper-top {
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;

          &-title {
            color: #1c222b;
            font-weight: 600;
          }

          &-action {
            display: flex;
            align-items: center;
            width: 200px;
            justify-content: space-between;

            .action-choose,
            .action-reset {
              color: #1776ff;
              cursor: pointer;
            }
          }
        }

        .wrapper-split {
          width: 100%;
          height: 1px;
          background: #016eff;
          margin-bottom: 20px;
        }

        //图片本身
        .wrapper-content {
          width: 100%;
          height: calc(100% - 51px);
          display: flex;
          justify-content: center;

          &-top {
            height: 32px;
          }

          &-graph {
            width: 100%;
            height: calc(100% - 32px);
          }
        }
      }

      .wrapper-box-table {
        width: calc(50% - 10px);
        height: 100%;
      }
    }
  }

  .competent-organization {
    width: 100%;
    margin-top: 20px;
    margin-bottom: 20px;

    &-top {
      width: 100%;
      display: flex;
      justify-content: space-between;

      //排序筛选按钮
      .top-action {
        display: flex;

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

    &-wrapper {
      width: 100%;
      height: 524px;
      display: flex;

      &-item {
        width: 35%;
        height: 100%;
        margin-right: 20px;
        border-radius: 6px;
        border: 1px solid #d6dbe3;
        background: #fff;
        padding: 12px 20px 20px 20px;

        .item-top {
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;

          &-title {
            color: #1c222b;
            font-weight: 600;
          }
        }

        .item-split {
          width: 100%;
          height: 1px;
          background: #016eff;
          margin-bottom: 20px;
        }

        .item-content {
          width: 100%;
          height: calc(100% - 51px);
          // display: flex;
          // justify-content: center;

          &-des {
            display: flex;
            align-items: center;
            height: 21px;
            margin-bottom: 20px;

            &-item {
              display: flex;
              align-items: center;
            }
          }

          &-graph {
            width: 100%;
            height: calc(100% - 41px);
          }
        }
      }

      &-table {
        width: calc(65% - 20px);
        height: 100%;
      }
    }
  }

  .project-analysis {
    width: 100%;
    margin-top: 20px;
    margin-bottom: 20px;

    &-top {
      display: flex;
      justify-content: space-between;

      //排序筛选按钮
      .top-action {
        display: flex;

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

    &-wrapper {
      width: 100%;
      height: 444px;
      display: flex;

      &-item {
        width: 27%;
        height: 100%;
        margin-right: 20px;
        border-radius: 6px;
        border: 1px solid #d6dbe3;
        background: #fff;
        padding: 12px 20px 20px 20px;

        .item-top {
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;

          &-title {
            color: #1c222b;
            font-weight: 600;
          }
        }

        .item-split {
          width: 100%;
          height: 1px;
          background: #016eff;
          margin-bottom: 20px;
        }

        .item-content {
          width: 100%;
          height: calc(100% - 51px);
          // display: flex;
          // justify-content: center;

          &-des {
            display: flex;
            align-items: center;
            height: 21px;
            margin-bottom: 20px;

            &-item {
              display: flex;
              align-items: center;
            }
          }

          &-graph {
            width: 100%;
            height: calc(100% - 41px);
          }
        }
      }

      &-right {
        width: calc(46% - 40px);
        height: 100%;
      }
    }
  }
}

.subject-modal {
  &-content {
    &-select {
      width: 100%;
    }
  }
}

.tooltip-icon {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
}

.flex {
  display: flex;
  align-items: center;
}

.action-choose,
.action-reset {
  color: #1776ff;
  cursor: pointer;
}

.ratio-tooltip-box {
  .label {
    display: inline-block;
    width: 90px;
    text-align: right;
  }
}
</style>
