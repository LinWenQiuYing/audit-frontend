<template>
  <div class="budget-project">
    <div class="budget-right">
      <div class="budget-right-content">
        <div class="header-box">
          <div class="header-box-words">
            <div class="header-box-words-content">项目执行明细</div>
            <!-- <div class="header-box-words-content-small">
              当前单位：{{ curTreeItem.title }}
            </div>
            <div class="header-box-words-content-small">
              主管单位：{{ curTreeItemFather.title }}
            </div> -->
          </div>
          <!-- 右侧按钮 -->
          <div class="top-action">
            <a-button class="top-action-btn" @click="sortBtn()">
              <div class="top-action-btn-icon">
                <icon-svg icon-class="排序"></icon-svg>
              </div>
              排序
            </a-button>
            <a-button class="top-action-btn" @click="filterBtn()">
              <div class="top-action-btn-icon">
                <icon-svg icon-class="筛选"></icon-svg>
              </div>
              筛选
            </a-button>
            <a-button class="top-action-btn" @click="getBack()">
              返回
            </a-button>
            <!-- <a-tooltip
              placement="topLeft"
              overlayClassName="wrapper-title-tooltip"
            >
              <template slot="title">
                <span>111111</span>
              </template>
              <div class="tooltip-icon">
                <icon-svg icon-class="icon-warning" color="#1776FF"></icon-svg>
              </div>
            </a-tooltip> -->
          </div>
        </div>
        <!-- 表格 -->
        <a-table
          :columns="columns"
          :data-source="dataSource"
          :scroll="{ x: 'max-content', y: 'calc(100vh - 380px)' }"
          :bordered="true"
          :pagination="pagination"
          :loading="tableLoading"
        >
          <span
            slot="currentYearBudgetAmount"
            slot-scope="currentYearBudgetAmount"
          >
            <span>{{ Number(currentYearBudgetAmount).toLocaleString() }}</span>
          </span>
          <span
            slot="currentYearExecutedAmount"
            slot-scope="currentYearExecutedAmount"
          >
            <span>{{
              Number(currentYearExecutedAmount).toLocaleString()
            }}</span>
          </span>
          <span
            slot="currentYearExecutionRate"
            slot-scope="currentYearExecutionRate"
            style="display: flex"
          >
            <a-progress
              :percent="currentYearExecutionRate * 100"
              size="big"
              :show-info="false"
              style="width: 135px"
              :strokeColor="
                currentYearExecutionRate > highExecutionRate
                  ? '#e31430'
                  : currentYearExecutionRate < lowExecutionRate
                  ? '#f28518'
                  : ''
              "
            />
            <div style="margin-left: 8px">
              <span>{{ Math.round(currentYearExecutionRate * 100) }}%</span>
            </div>
          </span>
        </a-table>
      </div>
      <div class="params-config">
        <div class="params-config-header">参数设置</div>
        <div class="params-config-item">
          <div class="item-label">年份：</div>
          <a-select
            placeholder="请选择"
            v-model="chosenYear"
            :options="yearOptions"
            class="item-input"
          />
        </div>
        <div class="params-config-item">
          <div class="item-label">项目分类</div>
          <a-select
            placeholder="请选择"
            v-model="chosenProject"
            :options="projectOptions"
            class="item-input"
          />
          <!-- <a-slider
            v-model="ratioNumber"
            :min="0"
            :max="1"
            :step="0.1"
            :tipFormatter="(value) => value * 100 + '%'"
          /> -->
        </div>
        <div class="params-config-item">
          <div class="item-label">执行率偏大值</div>
          <div class="color-box">
            <a-input-number
              class="right-action-input"
              placeholder="请选择"
              :min="0"
              :max="1"
              :step="0.01"
              v-model="highExecutionRate"
            />
            <!-- @change="handleRatioChange" -->
            <div class="color-box-red"></div>
          </div>
        </div>
        <div class="params-config-item">
          <div class="item-label">执行率偏小值</div>
          <div class="color-box">
            <a-input-number
              class="right-action-input"
              placeholder="请选择"
              :min="0"
              :max="1"
              :step="0.01"
              v-model="lowExecutionRate"
            />
            <!-- @change="handleRatioChange" -->
            <div class="color-box-green"></div>
          </div>
          <!-- <a-slider
            v-model="lowExecutionRate"
            :min="0"
            :max="1"
            :step="0.1"
            :tipFormatter="(value) => value * 100 + '%'"
          /> -->
        </div>
        <div class="params-config-btns">
          <a-button style="margin-right: 8px" @click="handleParamsReset"
            >重置</a-button
          >
          <a-button type="primary" @click="getBudgetTableOneAll()"
            >确定</a-button
          >
        </div>
      </div>
    </div>
    <!-- 排序按钮 -->
    <SortModal
      v-if="sortOptions.length"
      sortTitle="项目执行明细排序配置"
      :sortShow="sortShow"
      @onSortCancel="onSortCancel"
      @onSortConfirm="onSortConfirm"
      :sortOptions="sortOptions"
      firstSortName="当年项目分类+当年执行金额"
    ></SortModal>

    <!-- 筛选按钮 -->
    <FilterModal
      filterTitle="项目执行明细筛选配置"
      :filterShow="filterShow"
      :paramsOption="paramsOption"
      :tableData="tableData"
      @addTable3="addTable"
      @delTable3="delTable"
      @onFilterCancel="onFilterCancel"
      @onFilterConfirm="onFilterConfirm"
    ></FilterModal>

    <!-- 页面悬浮框 -->
    <!-- <a-popover
      trigger="click"
      placement="leftTop"
      overlayClassName="budget-project-fixed"
    >
      <template slot="content">
        <div class="content-item">
          <div class="content-item-label">年份</div>
          <a-select
            placeholder="请选择"
            v-model="chosenYear"
            :options="yearOptions"
            class="content-item-value"
          />
        </div>
        <div class="content-item">
          <div class="content-item-label">项目分类</div>
          <a-select
            placeholder="请选择"
            v-model="chosenProject"
            :options="projectOptions"
            class="content-item-value"
          />
        </div>
        <div class="content-item">
          <div class="content-item-label">执行率偏大值</div>
          <div class="color-box">
            <a-input-number
              class="right-action-input"
              placeholder="请选择"
              :min="0"
              :max="1"
              :step="0.01"
              v-model="highExecutionRate"
            />
            <div class="color-box-red"></div>
          </div>
        </div>
        <div class="content-item">
          <div class="content-item-label">执行率偏小值</div>
          <div class="color-box">
            <a-input-number
              class="right-action-input"
              placeholder="请选择"
              :min="0"
              :max="1"
              :step="0.01"
              v-model="lowExecutionRate"
            />
            <div class="color-box-green"></div>
          </div>
        </div>
        <div class="content-btn">
          <a-button style="margin-right: 8px" @click="handleParamsReset"
            >重置</a-button
          >
          <a-button type="primary" @click="getBudgetTableOneAll()"
            >确定</a-button
          >
        </div>
      </template>
      <div class="fixed-icon">
        <icon-svg icon-class="参数" />
      </div>
    </a-popover> -->
  </div>
</template>
<script>
import FilterModal from "@/components/filterModal.vue";
import SortModal from "@/components/sortModal.vue";
import {
  getBudgetTableOneAll,
  getBudgetTableOneAllFilter,
  getBudgetTableOneAllOptions,
  getBudgetTableOneAllSort,
} from "@/shared/newApi/budget/budget.js";
import {
  Button,
  InputNumber,
  // Tooltip,
  // Popover,
  Progress,
  Select,
  // Input,
  TreeSelect,
} from "ant-design-vue";
import { mapState } from "vuex";

const SHOW_PARENT = TreeSelect.SHOW_PARENT;

export default {
  name: "BudgetProject",
  data() {
    return {
      SHOW_PARENT,

      //传入的所选预算单位
      budgetCode: null,
      //页面悬浮框
      //年份
      chosenYear: "2023",
      yearOptions: [
        {
          value: "2020",
          label: "2020",
        },
        {
          value: "2021",
          label: "2021",
        },
        {
          value: "2022",
          label: "2022",
        },
        {
          value: "2023",
          label: "2023",
        },
      ],
      //项目分类
      chosenProject: null,
      projectOptions: [],

      // projectOptions: [
      //   {
      //     value: "全部",
      //     label: "全部",
      //   },
      //   {
      //     value: "部分",
      //     label: "部分",
      //   },
      //   {
      //     value: "一部分",
      //     label: "一部分",
      //   },
      //   {
      //     value: "大部分",
      //     label: "大部分",
      //   },
      // ],
      //执行率偏大值
      highExecutionRate: 0.75,
      //执行率偏小值
      lowExecutionRate: 0.45,

      //筛选
      filterShow: false,
      filterConfirmArr: "",
      paramsOption: [],

      // paramsOption: [
      //   {
      //     value: "字段一",
      //     label: "字段一",
      //   },
      //   {
      //     value: "字段二",
      //     label: "字段二",
      //   },
      //   {
      //     value: "字段三",
      //     label: "字段三",
      //   },
      // ],
      tableData: [
        // {
        //   id: "1",
        //   name: "字段一",
        //   compare: "等于",
        //   value: "1234",
        // },
        // {
        //   id: "2",
        //   name: "字段二",
        //   compare: "不等于",
        //   value: "1234",
        // },
        // {
        //   id: "3",
        //   name: "字段三",
        //   compare: "包含",
        //   value: "1234",
        // },
        // {
        //   id: "4",
        //   name: "字段四",
        //   compare: "不包含",
        //   value: "1234",
        // },
        // {
        //   id: "1",
        //   name: "字段一",
        //   compare: "等于",
        //   value: "1234",
        // },
        // {
        //   id: "2",
        //   name: "字段二",
        //   compare: "不等于",
        //   value: "1234",
        // },
        // {
        //   id: "3",
        //   name: "字段三",
        //   compare: "包含",
        //   value: "1234",
        // },
        // {
        //   id: "4",
        //   name: "字段四",
        //   compare: "不包含",
        //   value: "1234",
        // },
      ],

      //排序
      sortShow: false,
      sortString: "",
      //排序选项
      sortOptions: [],

      // sortOptions: [
      //   {
      //     label: "字段1",
      //     value: "字段1",
      //   },
      //   {
      //     label: "字段2",
      //     value: "字段2",
      //   },
      //   {
      //     label: "字段3",
      //     value: "字段3",
      //   },
      //   {
      //     label: "字段4",
      //     value: "字段4",
      //   },
      //   {
      //     label: "字段5",
      //     value: "字段5",
      //   },
      //   {
      //     label: "字段6",
      //     value: "字段6",
      //   },
      //   {
      //     label: "字段7",
      //     value: "字段7",
      //   },
      //   {
      //     label: "字段8",
      //     value: "字段8",
      //   },
      // ],

      //表格数据
      columns: [
        {
          title: "当年项目分类",
          dataIndex: "currentYearProjectCategory",
          key: "currentYearProjectCategory",
          width: 180,
        },
        {
          title: "当年项目名称",
          dataIndex: "currentYearProjectName",
          key: "currentYearProjectName",
          width: 220,
        },
        {
          title: "当年项目编号",
          dataIndex: "currentYearProjectCode",
          key: "currentYearProjectCode",
          width: 180,
        },
        {
          title: "当年预算金额（万元）",
          dataIndex: "currentYearBudgetAmount",
          key: "currentYearBudgetAmount",
          width: 165,
          scopedSlots: { customRender: "currentYearBudgetAmount" },
        },
        {
          title: "当年执行金额（万元）",
          dataIndex: "currentYearExecutedAmount",
          key: "currentYearExecutedAmount",
          width: 165,
          scopedSlots: { customRender: "currentYearExecutedAmount" },
        },
        {
          title: "当年执行率",
          dataIndex: "currentYearExecutionRate",
          key: "currentYearExecutionRate",
          width: 220,
          scopedSlots: { customRender: "currentYearExecutionRate" },
        },
      ],
      dataSource: [
        // {
        //   currentYearProjectCategory: "人员支出", // 当年项目分类
        //   currentYearProjectName: "人员经费", // 当年项目名称
        //   currentYearProjectCode: "xxx", // 当年项目编号
        //   currentYearBudgetAmount: "xxx", // 当年预算金额（万元）
        //   currentYearExecutedAmount: "xxx", // 当年执行金额（万元）
        //   currentYearExecutionRate: "0.98", // 当年执行率
        // },
        // {
        //   currentYearProjectCategory: "人员支出", // 当年项目分类
        //   currentYearProjectName: "人员支出", // 当年项目名称
        //   currentYearProjectCode: "xxx", // 当年项目编号
        //   currentYearBudgetAmount: "xxx", // 当年预算金额（万元）
        //   currentYearExecutedAmount: "xxx", // 当年执行金额（万元）
        //   currentYearExecutionRate: "0.25", // 当年执行率
        // },
      ],
      tableLoading: false,

      //分页
      pagination: {
        size: "small",
        total: 0,
        current: 1,
        pageSize: 1000,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ["1000", "1500", "2000"],
        showTotal: (total) => {
          return `共${total}条记录`;
        },
        onChange: (page, pageSize) => {
          this.pagination.current = page;
          this.pagination.pageSize = pageSize;
          this.getBudgetTableOneAll();
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = 1;
          this.pagination.pageSize = size;
          this.getBudgetTableOneAll();
        },
      },
    };
  },
  components: {
    SortModal,
    FilterModal,
    // ATreeSelect: TreeSelect,
    ASelect: Select,
    AInputNumber: InputNumber,
    // ATooltip: Tooltip,
    // APopover: Popover,
    // AInput: Input,
    AButton: Button,
    AProgress: Progress,
  },
  computed: {
    ...mapState("blockAnalysis", ["blockChoosedYear"]),
    ...mapState("budgetPortrait", ["curTreeItem", "curTreeItemFather"]),
  },
  watch: {
    curTreeItem: {
      async handler(newVal, oldVal) {
        console.log("5656555", newVal, oldVal);
        this.budgetCode = newVal.key; //所选单位代码
        //重置页面大小以及页面第1页
        this.pagination.current = 1;
        this.pagination.pageSize = 1000;
        //项目分类
        await this.getBudgetTableOneAllOptions();
        //项目执行明细完整表排序
        await this.getBudgetTableOneAllSort();
        //项目执行明细简完整表筛选
        await this.getBudgetTableOneAllFilter();
        //项目执行明细完整表
        this.getBudgetTableOneAll();
      },
      deep: true,
    },
  },
  async mounted() {
    this.budgetCode = this.$route.query.budgetUnitCode; //所选单位代码
    //项目分类
    await this.getBudgetTableOneAllOptions();
    //项目执行明细完整表排序
    await this.getBudgetTableOneAllSort();
    //项目执行明细简完整表筛选
    await this.getBudgetTableOneAllFilter();
    //项目执行明细完整表
    this.getBudgetTableOneAll();
  },
  methods: {
    async handleParamsReset() {
      //项目分类
      this.chosenProject = null;
      //年份
      this.chosenYear = "2023";
      //执行率偏大值
      this.highExecutionRate = 0.75;
      //执行率偏小值
      this.lowExecutionRate = 0.45;
      //项目分类
      await this.getBudgetTableOneAllOptions();
      //项目执行明细完整表排序
      await this.getBudgetTableOneAllSort();
      //项目执行明细简完整表筛选
      await this.getBudgetTableOneAllFilter();
      //项目执行明细完整表
      this.getBudgetTableOneAll();
    },
    //项目分类
    async getBudgetTableOneAllOptions() {
      const res = await getBudgetTableOneAllOptions();
      if (res.message === "成功") {
        const obj = {
          label: "全部",
          value: null,
        };
        res.data.unshift(obj);
        this.projectOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //项目执行明细简表-排序字段
    async getBudgetTableOneAllSort() {
      this.sortOptions = [];
      const res = await getBudgetTableOneAllSort();
      if (res.message === "成功") {
        this.sortOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //项目执行明细简表-筛选字段
    async getBudgetTableOneAllFilter() {
      const res = await getBudgetTableOneAllFilter();
      if (res.message === "成功") {
        this.paramsOption = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //项目执行明细简表
    async getBudgetTableOneAll() {
      const json = {
        unitCode: this.budgetCode, //单位code
        year: this.chosenYear, //年份
        pageSize: this.pagination.pageSize, //页面大小
        pageOffset: this.pagination.pageSize * (this.pagination.current - 1), //页面页码
        proTypeName: this.chosenProject, //项目类型名称
        filterCondition: this.filterConfirmArr,
        odName: this.sortString,
      };
      this.tableLoading = true;
      const res = await getBudgetTableOneAll(json);
      this.tableLoading = false;
      if (res.message === "成功") {
        this.dataSource = res.data.dateList;
        this.pagination.total = res.data.total;
      } else {
        this.$message.error(res.message);
      }
    },

    //排序
    sortBtn() {
      this.sortShow = true;
    },
    onSortCancel() {
      this.sortShow = false;
    },
    onSortConfirm(sortString) {
      this.sortString = sortString;
      // this.getSpendTable();
      this.getBudgetTableOneAll();
      this.onSortCancel();
    },

    //筛选
    filterBtn() {
      this.filterShow = true;
    },
    addTable(json) {
      this.tableData = [...this.tableData, json];
    },
    //筛选：增加
    delTable(arr) {
      this.tableData = arr;
    },
    onFilterCancel() {
      this.filterShow = false;
    },
    onFilterConfirm(filterConfirmArr) {
      // this.getSpendTable();
      this.filterConfirmArr = filterConfirmArr;
      this.getBudgetTableOneAll();
      this.onFilterCancel();
    },

    //返回跳转
    getBack() {
      this.$router.push({
        path: "/budget-portrait/budget-detail",
      });
    },
  },
};
</script>
<style lang="less">
.budget-project {
  width: calc(100% - 320px);
  height: calc(100% - 35px);
  padding: 20px;
  background: #fff;
  display: flex;

  .budget-right {
    display: flex;
    width: 100%;
    height: 100%;
    position: relative;

    &-content {
      width: calc(100% - 220px);
      margin-right: 220px;

      //顶部标题文字以及按钮
      .header-box {
        display: flex;
        justify-content: space-between;
        height: 32px;
        margin-bottom: 20px;

        &-words {
          display: flex;
          justify-content: center;
          align-items: center;

          //大标题
          &-content {
            height: 28px;
            line-height: 28px;
            color: #1c222b;
            font-size: 20px;
            font-weight: 600;
          }

          //小标题
          .header-box-words-content-small {
            height: 22px;
            line-height: 22px;
            color: #3c485c;
            font-size: 14px;
            font-weight: 400;
            margin-left: 20px;
          }
        }

        //所有排序筛选查看更多按钮
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

          &-btn:last-of-type {
            //返回按钮窄一点
            width: 70px;
            justify-content: center;
            // margin-right: 50px;
            //待修改
          }

          .tooltip-icon {
            margin-top: 7px;
            margin-left: 10px;
          }
        }
      }
    }

    .params-config {
      width: 200px;
      position: fixed;
      right: 40px;
      border: 1px solid #d6dbe3;
      border-radius: 6px;
      padding: 12px 16px;

      &-header {
        color: #3c485c;
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 20px;
      }

      &-item {
        width: 100%;
        margin-bottom: 10px;

        .item-label {
          margin-bottom: 4px;
        }

        .item-input {
          width: 100%;

          .ant-input-number-handler-wrap {
            display: none;
          }
        }

        .right-action-input {
          width: 100%;

          // .ant-input-number-handler-wrap {
          //   display: none;
          // }
        }

        .color-box {
          width: 100%;
          display: flex;
          // justify-content: space-between;

          &-red {
            width: 30px;
            height: 30px;
            margin-left: 30px;
            background-color: red;
          }
        }
      }

      &-btns {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-top: 20px;
      }
    }
  }
}
// 页面弹框
// .budget-project-fixed {
//   .ant-popover-content {
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
//         &-label {
//           margin-bottom: 4px;
//         }

//         .color-box {
//           display: flex;

//           &-red {
//             width: 24px;
//             height: 24px;
//             background-color: #e31430;
//             margin: 6px 0 0 25px;
//           }

//           &-green {
//             width: 24px;
//             height: 24px;
//             background-color: #1bb46d;
//             margin: 6px 0 0 25px;
//           }
//         }

//         &-value {
//           width: 100%;
//         }

//         &:not(:last-child) {
//           margin-bottom: 16px;
//         }
//       }

//       .content-btn {
//         display: flex;
//         justify-content: flex-end;
//       }
//     }
//   }
// }
</style>
