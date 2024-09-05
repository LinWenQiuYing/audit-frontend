<template>
  <div style="min-height: 100%; height: 100%">
    <CommonList
      isTitle
      listClass="no-tax-detail"
      className="no-tax-detail-table"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="pagination"
      :scroll="{ x: 'max-content', y: 'calc(100vh - 525px)' }"
      bordered
    >
      <!-- 大标题 -->
      <div slot="tableTitle" class="table-header">
        <div class="table-header-title">非税收入明细</div>
        <div class="table-header-btn" @click="reBack">返回</div>
      </div>
      <!-- 顶上的选择框 -->
      <template slot="searchOptions">
        <!-- 年份 -->
        <div class="bottom-search-item">
          <div class="item-label">年份：</div>
          <a-select
            class="item-value"
            placeholder="请选择"
            v-model="choosedYear"
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
        <div class="bottom-search-item">
          <div class="item-label">业务板块：</div>
          <a-select
            class="item-value"
            placeholder="请选择"
            v-model="choosedBlock"
            mode="multiple"
            @change="handleBlockChange"
          >
            <a-select-option
              v-for="item in blockOptions"
              :key="item.label"
              :title="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </div>
        <!-- 主管单位 -->
        <div class="bottom-search-item">
          <div class="item-label">主管单位：</div>
          <!-- <a-tree-select
            v-model="choosedManageUnit"
            class="item-value"
            :tree-data="manageUnitTree"
            :tree-checkable="false"
            search-placeholder="选择展示主管单位"
            @change="getBudgetUnit"
          /> -->
          <a-select
            mode="multiple"
            class="item-value"
            placeholder="请选择"
            v-model="choosedManageUnit"
            @change="getBudgetUnit"
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
        <!-- 预算单位 -->
        <div class="bottom-search-item">
          <div class="item-label">预算单位：</div>
          <!-- <a-tree-select
            v-model="choosedBudgetUnit"
            class="item-value"
            :tree-data="budgetUnitTree"
            :tree-checkable="false"
            search-placeholder="请选择"
            @change="getManageUnit"
          /> -->
          <a-select
            mode="multiple"
            class="item-value"
            placeholder="请选择"
            v-model="choosedBudgetUnit"
            @change="getManageUnit"
          >
            <!--  @change="handleSubjectChangeOne" -->
            <a-select-option
              v-for="item in budgetUnitTree"
              :key="item.key"
              :title="item.value"
              :value="item.value"
            >
              {{ item.key }}
            </a-select-option>
          </a-select>
        </div>

        <!-- 收入类别 -->
        <div class="bottom-search-item">
          <div class="item-label">收入类别：</div>
          <!-- <a-input
            placeholder="请输入名称关键词"
            v-model.trim="incomeType"
            class="item-value"
          /> -->
          <a-tree-select
            v-model="incomeType"
            class="item-value"
            style="width: 200px"
            :tree-data="incomeTypeOptions"
            :tree-checkable="false"
            search-placeholder="选择收入类别"
          />
        </div>
        <!-- 收入科目名称 -->
        <div class="bottom-search-item">
          <div class="item-label">收入科目名称：</div>
          <a-input
            placeholder="请输入名称关键词"
            v-model.trim="incomeSubName"
            class="item-value"
          />
        </div>
        <!-- 项目名称 -->
        <div class="bottom-search-item">
          <div class="item-label">项目名称：</div>
          <a-input
            placeholder="请输入名称关键词"
            v-model.trim="projectName"
            class="item-value"
          />
        </div>
        <!-- 缴款日期： -->
        <div class="bottom-search-item">
          <div class="item-label">缴款日期：</div>
          <a-range-picker
            v-model="payTime"
            class="item-value"
            :placeholder="['开始日期', '截止日期']"
          >
            <template slot="suffixIcon">
              <a-icon type="calendar" />
            </template>
          </a-range-picker>
        </div>
        <!-- 入账日期： -->
        <div class="bottom-search-item">
          <div class="item-label">入账日期：</div>
          <a-range-picker
            v-model="entryTime"
            class="item-value"
            :placeholder="['开始日期', '截止日期']"
          >
            <template slot="suffixIcon">
              <a-icon type="calendar" />
            </template>
          </a-range-picker>
        </div>
        <div class="bottom-search-item"></div>
        <div class="bottom-search-item"></div>
        <!-- 查询重置排序按钮 -->
        <div class="bottom-search-item actions">
          <a-button type="primary" class="actions-btn" @click="getNoTaxTable()"
            >查询</a-button
          >
          <!-- <a-button type="primary" class="actions-btn" @click="handleReset"
            >重置</a-button
          > -->
          <a-button type="primary" class="actions-btn" @click="sortBtn()">
            <div class="actions-btn-icon">
              <icon-svg icon-class="排序"></icon-svg>
            </div>
            排序
          </a-button>
        </div>
      </template>
      <!-- 最后一列的特殊处理主体 -->
      <div
        slot="money"
        slot-scope="record"
        style="cursor: pointer; color: #1776ff"
      >
        <a-popover
          trigger="click"
          placement="left"
          overlayClassName="no-tax-detail-pop"
        >
          <template slot="content">
            <div class="no-tax-detail-pop-item">
              <div class="item-label">主管单位名称：</div>
              <div class="item-value">{{ record.deptName }}</div>
            </div>
            <div class="no-tax-detail-pop-item">
              <div class="item-label">预算单位名称：</div>
              <div class="item-value">{{ record.unitName }}</div>
            </div>
            <div class="no-tax-detail-pop-item">
              <div class="item-label">项目名称：</div>
              <div class="item-value">{{ record.nontaxProjectName }}</div>
            </div>
            <div class="no-tax-detail-pop-item">
              <div class="item-label">收入类别：</div>
              <div class="item-value">{{ record.nontaxTypeName }}</div>
            </div>
            <div class="no-tax-detail-pop-item">
              <div class="item-label">收入科目：</div>
              <div class="item-value">{{ record.srkmmc }}</div>
            </div>
            <div class="no-tax-detail-pop-item">
              <div class="item-label">缴款人全称：</div>
              <div class="item-value">{{ record.payerName }}</div>
            </div>
            <div class="no-tax-detail-pop-item">
              <div class="item-label">收款人全称：</div>
              <div class="item-value">{{ record.payeeName }}</div>
            </div>
            <div class="no-tax-detail-pop-item">
              <div class="item-label">应缴金额：</div>
              <div class="item-value">{{ record.yjje }}</div>
            </div>
            <div class="no-tax-detail-pop-item">
              <div class="item-label">滞纳金金额：</div>
              <div class="item-value">{{ record.znjje }}</div>
            </div>
            <div class="no-tax-detail-pop-item">
              <div class="item-label">缴款金额：</div>
              <div class="item-value">{{ record.jkje }}</div>
            </div>
            <div class="no-tax-detail-pop-item">
              <div class="item-label">缴款日期：</div>
              <div class="item-value">{{ record.paymentDate }}</div>
            </div>
            <div class="no-tax-detail-pop-item">
              <div class="item-label">入账日期：</div>
              <div class="item-value">{{ record.recordedDate }}</div>
            </div>
            <div class="no-tax-detail-pop-item">
              <div class="item-label">资金性质：</div>
              <div class="item-value">{{ record.fundsNatureName }}</div>
            </div>
          </template>
          {{ record.money }}
        </a-popover>
      </div>
    </CommonList>
    <!-- 非税收入排序按钮 -->
    <SortModalTax
      v-if="sortOptions.length"
      sortTitle="非税收入排序配置"
      :sortShow="sortShow"
      @onSortCancel="onSortCancel"
      @onSortConfirm="onSortConfirm"
      :sortOptions="sortOptions"
      firstSortName="金额"
    ></SortModalTax>
  </div>
</template>
<script>
import CommonList from "@/components/commonList.vue";
import SortModalTax from "@/components/sortModalTax.vue";
import {
  getNoTaxChartThreeBudget,
  getNoTaxChartThreeType,
  getNoTaxChartThreeUnit,
  getNoTaxTable,
  getNoTaxTableSortedOptions,
} from "@/shared/newApi/block/noTax.js";
import { getOverviewData } from "@/shared/newApi/block/block.js";
// import { findValueByKey } from "@/utils/common.js";
import {
  Button,
  DatePicker,
  Icon,
  Input,
  Popover,
  // Radio,
  Select,
  TreeSelect,
} from "ant-design-vue";
import dayjs from "dayjs";
import { mapMutations, mapState } from "vuex";
import { findNotaxValueByTitle } from "./util.js";
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
import { findValueByKey } from "./util.js";
const { RangePicker } = DatePicker;
export default {
  name: "NoTaxDetail",
  data() {
    return {
      fromRoute: null, //从哪里的路由跳转过来的
      SHOW_PARENT,
      //年份
      yearOptions: [
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
        {
          label: "2024",
          value: "2024",
        },
      ],
      choosedYear: [],
      //所选板块
      blockOptions: [
        // {
        //   label: "国企",
        //   value: "国企",
        // },
        // {
        //   label: "农业",
        //   value: "农业",
        // },
        // {
        //   label: "自然资源和生态环境",
        //   value: "自然资源和生态环境",
        // },
        // {
        //   label: "债务",
        //   value: "债务",
        // },
        // {
        //   label: "行政政法",
        //   value: "行政政法",
        // },
        // {
        //   label: "社会保障",
        //   value: "社会保障",
        // },
        // {
        //   label: "预算",
        //   value: "预算",
        // },
        // {
        //   label: "政府采购管理",
        //   value: "政府采购管理",
        // },
        // {
        //   label: "教科文",
        //   value: "教科文",
        // },
        // {
        //   label: "经济建设",
        //   value: "经济建设",
        // },
        // {
        //   label: "涉外经济（金融）",
        //   value: "涉外经济（金融）",
        // },
        // {
        //   label: "企业",
        //   value: "企业",
        // },
      ],
      choosedBlock: [],
      //主管单位
      choosedManageUnit: [],
      manageUnitTree: [
        //现在
        // {
        //   key: "0001——中国",
        //   value: "1",
        // },
        //原来
        // {
        //   title: "市级",
        //   value: "市级",
        //   key: "市级",
        // },
      ],

      //预算单位
      choosedBudgetUnit: [],
      budgetUnitTree: [
        //现在
        // {
        //   key: "0001——中国",
        //   value: "1",
        // },
        //原来
        // {
        //   title: "市级",
        //   value: "市级",
        //   key: "市级",
        // },
        // {
        //   title: "省级",
        //   value: "省级",
        //   key: "省级",
        // },
      ],

      //排序弹框显示
      sortShow: false,
      sortString: "",
      //排序选项
      sortOptions: [
        // {
        //   label: "字段1",
        //   value: "字段1",
        // },
      ],

      //收入类别
      incomeType: "",
      incomeTypeOptions: [
        // {
        //   title: "财政收入",
        //   value: "财政收入_1",
        //   key: "财政收入_1",
        //   children: [
        //     {
        //       title: "民政局",
        //       value: "民政局_2",
        //       key: "民政局_2",
        //       children: [],
        //     },
        //   ],
        // },
      ],
      //收入科目名称
      incomeSubName: "",
      //项目名称
      projectName: "",
      //缴款日期
      payTime: [],
      //入账日期
      entryTime: [],
      popoverVisible: false,
      radioStyle: {
        display: "block",
        height: "30px",
        lineHeight: "30px",
      },

      //表格名
      columns: [
        {
          title: "非税收入类别",
          dataIndex: "type",
          key: "type",
          width: 200,
        },
        {
          title: "项目名称",
          dataIndex: "name",
          key: "name",
          width: 400,
        },
        {
          title: "缴款日期",
          dataIndex: "paymentTime",
          width: 200,
          key: "paymentTime",
        },
        {
          title: "入账日期",
          dataIndex: "postingTime",
          width: 200,
          key: "postingTime",
        },
        {
          title: "缴款人全称",
          key: "paymentName",
          dataIndex: "paymentName",
          width: 200,
        },
        {
          title: "收款人名称",
          key: "postingName",
          dataIndex: "postingName",
          width: 200,
        },
        {
          title: "收入科目",
          key: "incomeAccount",
          dataIndex: "incomeAccount",
          width: 200,
        },
        {
          title: "金额（元）",
          key: "money",
          width: 200,
          scopedSlots: { customRender: "money" },
          fixed: "right",
        },
      ],
      //表格数据来源
      dataSource: [
        // {
        //   type: "type",
        //   name: "名称",
        //   paymentTime: "2023.09",
        //   postingTime: "2023.10",
        //   paymentName: "张三",
        //   postingName: "李四",
        //   incomeAccount: "功能科目",
        //   money: "3333",
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
          this.getNoTaxTable();
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = 1;
          this.pagination.pageSize = size;
          this.getNoTaxTable();
        },
      },
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      console.log("noTaxDetail记录路由从哪里过来的", to, from);
      console.log("赋值前", vm.fromRoute);
      // 通过 `vm` 访问组件实例
      if (from) {
        vm.fromRoute = from.name;
      }
      console.log("赋值后", vm.fromRoute);
    });
  },
  components: {
    SortModalTax,
    CommonList,
    ASelect: Select,
    AInput: Input,
    AIcon: Icon,
    AButton: Button,
    ARangePicker: RangePicker,
    APopover: Popover,
    // ARadio: Radio,
    // ARadioGroup: Group,
    ATreeSelect: TreeSelect,
  },
  computed: {
    ...mapState("blockAnalysis", [
      "blockChoosedYear",
      "choosedBlockId",
      "choosedBlockName",
    ]),
    //别删
    // choosedBlock: {
    //   get() {
    //     return this.choosedBlockId;
    //   },
    //   set(val) {
    //     const arr = this.blockOptions.filter((item) =>
    //       val.includes(item.value)
    //     );
    //     const name = arr.map((option) => option.label);
    //     this.setChoosedBlockName(name);
    //     this.setChoosedBlockId(val);
    //   },
    // },
  },
  async mounted() {
    this.choosedYear = this.blockChoosedYear;
    await this.getData(); //获取板块
    this.choosedBlock = this.choosedBlockName;
    this.entryTime = this.$route.query.time; //入账日期
    await this.getNoTaxChartThreeType(); //收入类型选择框,树形的
    //收入类别反显
    // console.log("this.incomeTypeOptions", this.incomeTypeOptions);
    const val0 = findNotaxValueByTitle(
      this.$route.query.type,
      this.incomeTypeOptions
    );
    this.incomeType = val0;
    await this.getManageUnit(); //获取主管单位选项框
    await this.getBudgetUnit(); //获取预算单位选项框
    // console.log("query传参", this.$route.query);
    const res = findValueByKey(this.$route.query.manage, this.manageUnitTree);
    this.choosedManageUnit = res;
    await this.getNoTaxTableSortedOptions(); //排序选项
    this.getNoTaxTable(); //表格数据
  },
  methods: {
    ...mapMutations("blockAnalysis", {
      setChoosedBlockName: "setChoosedBlockName",
      setChoosedBlockId: "setChoosedBlockId",
    }),

    //获取所有板块下拉框
    async getData() {
      const json = {
        year: this.choosedYear,
        // time: this.blockChoosedYear,
      };
      const res = await getOverviewData(json);
      if (res.message === "成功") {
        this.blockOptions = res.data.blocks.map((item) => {
          return {
            ...item,
            label: item.name,
            value: item.name,
          };
        });
      } else {
        this.$message.error(res.message);
      }
    },

    handleBlockChange() {
      console.log("板块更改");
      this.choosedManageUnit = [];
      this.choosedBudgetUnit = [];
      //重新获取主管单位下拉框
      this.getManageUnit();
      //重新获取预算单位下拉框
      this.getBudgetUnit();
    },

    //获取主管单位预算单位选项
    async getManageUnit() {
      const json = {
        year: this.choosedYear,
        unitIndustry: this.choosedBlock,
        unitCodes: this.choosedBudgetUnit,
      };
      const res = await getNoTaxChartThreeUnit(json);
      if (res.message === "成功") {
        this.manageUnitTree = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //获取预算单位预算单位选项
    async getBudgetUnit() {
      this.choosedBudgetUnit = [];
      const json = {
        year: this.choosedYear,
        unitIndustry: this.choosedBlock,
        deptCodes: this.choosedManageUnit,
      };
      const res = await getNoTaxChartThreeBudget(json);
      if (res.message === "成功") {
        this.budgetUnitTree = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //收入类型选择框,树形的
    async getNoTaxChartThreeType() {
      const json = {
        year: this.choosedYear,
        unitIndustry: this.choosedBlock,
      };
      const res = await getNoTaxChartThreeType(json);
      if (res.message === "成功") {
        this.incomeTypeOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //获取列表数据
    async getNoTaxTable() {
      const json = {
        year: this.choosedYear,
        unitIndustry: this.choosedBlock,
        deptCode: this.choosedManageUnit,
        unitCode: this.choosedBudgetUnit,
        nontaxTypeName: this.incomeType.split("_")[0], // incomeType样例为"广告收入_2_103029901"
        srkmmc: this.incomeSubName,
        nontaxProjectName: this.projectName,
        paymentDate: this.payTime.length
          ? [
              dayjs(this.payTime[0]).format("YYYY-MM-DD"),
              dayjs(this.payTime[1]).format("YYYY-MM-DD"),
            ]
          : null,
        recordedDate: this.entryTime.length
          ? [
              dayjs(this.entryTime[0]).format("YYYY-MM-DD"),
              dayjs(this.entryTime[1]).format("YYYY-MM-DD"),
            ]
          : null,
        odName: this.sortString,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.pageSize * (this.pagination.current - 1), //偏移量,
      };

      const res = await getNoTaxTable(json);
      if (res.message === "成功") {
        this.dataSource = res.data.dateList.map((item) => {
          return {
            ...item,
            type: item.nontaxTypeName,
            name: item.nontaxProjectName,
            paymentTime: item.paymentDate,
            postingTime: item.recordedDate,
            paymentName: item.payerName,
            postingName: item.payeeName,
            incomeAccount: item.srkmmc,
            money: item.jkje,
          };
        });
        this.pagination.total = res.data.total;
      } else {
        this.$message.error(res.message);
      }
    },

    //获取排序弹框选项数据
    async getNoTaxTableSortedOptions() {
      this.sortOptions = [];
      const res = await getNoTaxTableSortedOptions();
      if (res.message === "成功") {
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
      this.sortString = sortString;
      this.getNoTaxTable();
      this.onSortCancel();
    },

    //重置
    handleReset() {
      this.choosedYear = null;
      this.choosedManageUnit = [];
      this.choosedBudgetUnit = [];
      this.choosedBlock = [];
      this.incomeType = "";
      this.incomeSubName = "";
      this.projectName = "";
      this.payTime = [];
      this.entryTime = [];
    },

    //返回板块首页
    reBack() {
      if (this.fromRoute) {
        this.$router.push({
          name: this.fromRoute,
        });
      } else {
        this.$router.push({
          name: "businessBlock",
        });
      }
    },
  },
};
</script>
<style lang="less">
.no-tax-detail {
  width: 100%;
  height: 100%;
  padding: 20px;
  background: #fff;

  &-table {
    .bottom-search-item {
      width: calc((100% - 160px) / 5); // 改为一行五个
    }
  }
}

.no-tax-detail-pop {
  width: 400px;
  padding: 16px;
  &-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .item-label {
      width: 112px;
      color: #97a3b7;
      display: flex;
      justify-content: flex-end;
    }

    .item-value {
      flex: 1;
      color: #3c485c;
    }
  }
}
</style>
