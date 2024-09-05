<template>
  <div style="min-height: 100%; height: 100%">
    <CommonList
      isTitle
      listClass="pay-detail"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="pagination"
      :scroll="{ x: 'max-content', y: 'calc(100vh - 530px)' }"
      bordered
    >
      <div slot="tableTitle" class="table-header">
        <div class="table-header-title">支付明细</div>
        <div class="table-header-btn" @click="reBack">返回</div>
      </div>
      <template slot="searchOptions">
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
        <div class="bottom-search-item">
          <div class="item-label">主管单位：</div>
          <a-select
            mode="multiple"
            class="item-value"
            placeholder="请选择"
            v-model="choosedManageUnit"
            @change="getPayDetailBudgetOptions"
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
          <!-- <a-tree-select
            v-model="choosedManageUnit"
            class="item-value"
            :tree-data="manageUnitTree"
            tree-checkable
            :show-checked-strategy="SHOW_PARENT"
            search-placeholder="请选择"
          /> -->
        </div>
        <div class="bottom-search-item">
          <div class="item-label">预算单位：</div>
          <!-- <a-tree-select
            v-model="choosedBudgetUnit"
            class="item-value"
            :tree-data="budgetUnitTree"
            tree-checkable
            search-placeholder="请选择"
          /> -->
          <a-select
            mode="multiple"
            class="item-value"
            placeholder="请选择"
            v-model="choosedBudgetUnit"
            @change="getPayDetailManageOptions"
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

        <div class="bottom-search-item">
          <div class="item-label">项目名称：</div>
          <a-input
            placeholder="请输入"
            v-model.trim="projectName"
            class="item-value"
          />
        </div>
        <div class="bottom-search-item">
          <div class="item-label">功能科目：</div>
          <a-input
            placeholder="请输入"
            v-model.trim="functionSubject"
            class="item-value"
          />
        </div>
        <div class="bottom-search-item">
          <div class="item-label">经济科目：</div>
          <a-input
            placeholder="请输入"
            v-model.trim="finicialSubject"
            class="item-value"
          />
        </div>
        <div class="bottom-search-item">
          <div class="item-label">支付日期：</div>
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
        <div class="bottom-search-item">
          <div class="item-label">项目类型：</div>
          <a-input
            placeholder="请输入"
            v-model.trim="proTypeName"
            class="item-value"
          />
        </div>
        <div class="bottom-search-item"></div>
        <div class="bottom-search-item"></div>
        <div class="bottom-search-item actions">
          <a-button
            type="primary"
            class="actions-btn"
            @click="getPayDetailTable()"
            >查询</a-button
          >
          <a-button type="primary" class="actions-btn" @click="reset()"
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
      <div
        slot="money"
        slot-scope="record"
        style="cursor: pointer; color: #1776ff"
      >
        <a-popover
          trigger="click"
          placement="left"
          overlayClassName="pay-detail-pop"
        >
          <template slot="content">
            <div class="pay-detail-pop-item">
              <div class="item-label">项目名称：</div>
              <div class="item-value">{{ record.name }}</div>
            </div>
            <div class="pay-detail-pop-item">
              <div class="item-label">收款人名称：</div>
              <div class="item-value">{{ record.getName }}</div>
            </div>
            <div class="pay-detail-pop-item">
              <div class="item-label">摘要：</div>
              <div class="item-value">{{ record.abstract }}</div>
            </div>
            <div class="pay-detail-pop-item">
              <div class="item-label">经济科目名称：</div>
              <div class="item-value">{{ record.finicialName }}</div>
            </div>
            <div class="pay-detail-pop-item">
              <div class="item-label">功能科目名称：</div>
              <div class="item-value">{{ record.functionName }}</div>
            </div>
            <div class="pay-detail-pop-item">
              <div class="item-label">支出方式名称：</div>
              <div class="item-value">{{ record.zcfsmc }}</div>
            </div>
            <div class="pay-detail-pop-item">
              <div class="item-label">政府采购方式：</div>
              <div class="item-value">{{ record.zfcgfs }}</div>
            </div>
            <div class="pay-detail-pop-item">
              <div class="item-label">结算方式：</div>
              <div class="item-value">{{ record.jsfs }}</div>
            </div>
            <div class="pay-detail-pop-item">
              <div class="item-label">支付账户名称：</div>
              <div class="item-value">{{ record.zfzhmc }}</div>
            </div>
            <div class="pay-detail-pop-item">
              <div class="item-label">支付银行名称：</div>
              <div class="item-value">{{ record.zfyhmc }}</div>
            </div>
            <div class="pay-detail-pop-item">
              <div class="item-label">清算银行名称：</div>
              <div class="item-value">{{ record.qsyhmc }}</div>
            </div>
            <div class="pay-detail-pop-item">
              <div class="item-label">收款人账户编号：</div>
              <div class="item-value">{{ record.skrzhbh }}</div>
            </div>
            <div class="pay-detail-pop-item">
              <div class="item-label">收款人账户银行：</div>
              <div class="item-value">{{ record.skrzhyh }}</div>
            </div>
            <div class="pay-detail-pop-item">
              <div class="item-label">行业名称：</div>
              <div class="item-value">{{ record.industryName }}</div>
            </div>
            <div class="pay-detail-pop-item">
              <div class="item-label">支付日期：</div>
              <div class="item-value">{{ record.time }}</div>
            </div>
            <div class="pay-detail-pop-item">
              <div class="item-label">执行金额：</div>
              <div class="item-value">{{ record.money }}</div>
            </div>
            <div class="pay-detail-pop-item">
              <div class="item-label">资金来源：</div>
              <div class="item-value">{{ record.source }}</div>
            </div>
            <div class="pay-detail-pop-item">
              <div class="item-label">资金性质：</div>
              <div class="item-value">{{ record.nature }}</div>
            </div>
          </template>
          {{ record.money }}
        </a-popover>
      </div>
    </CommonList>
    <!-- 支付明细排序按钮 -->
    <SortModal
      v-if="sortOptions.length"
      sortTitle="支付明细排序配置"
      :sortShow="sortShow"
      @onSortCancel="onSortCancel"
      @onSortConfirm="onSortConfirm"
      :sortOptions="sortOptions"
      firstSortName="金额"
    ></SortModal>
  </div>
</template>
<script>
import CommonList from "@/components/commonList.vue";
import SortModal from "@/components/sortModal.vue";
import {
  getPayDetailAllBlocks,
  getPayDetailBudgetOptions,
  getPayDetailManageOptions,
  getPayDetailTable,
  getPayDetailTableTotal,
  getPayDetailSortOptions,
} from "@/shared/newApi/block/spendAnalysis.js";
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
import { mapMutations, mapState } from "vuex";
import { findValueByKey } from "./util.js";
// import { filterMenuList, findValueByKey, findValueByTitle } from "./util.js";
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
// const { Group } = Radio;
import dayjs from "dayjs";
const { RangePicker } = DatePicker;
export default {
  name: "PayDetail",
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
      choosedYear: null,

      //主管单位
      choosedManageUnit: [],
      manageUnitTree: [
        // {
        //   key: "0001——中国",
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
        //   key: "180——上海市绿化和市容管理局",
        //   value: "180",
        // },
        // {
        //   key: "166——上海市规划和自然资源局",
        //   value: "166",
        // },
        // {
        //   key: "120——上海市生态环境局",
        //   value: "120",
        // },
        // {
        //   key: "102——上海市应急管理局",
        //   value: "102",
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
        //   title: "0001——主管单位一",
        //   value: "1",
        //   key: "1",
        //   children: [
        //     {
        //       title: "0001——预算单位一",
        //       value: "1-1",
        //       key: "1-1",
        //       children: [],
        //     },
        //   ],
        // },
      ],

      //所选板块
      blockOptions: [
        // {
        //   label: "公检法",
        //   value: "1",
        // },
        // {
        //   label: "科技",
        //   value: "2",
        // },
        // {
        //   label: "教育",
        //   value: "3",
        // },
        // {
        //   label: "经济",
        //   value: "4",
        // },
        // {
        //   label: "城乡建设",
        //   value: "5",
        // },
        // {
        //   label: "卫生医疗",
        //   value: "6",
        // },
        // {
        //   label: "交通",
        //   value: "7",
        // },
        // {
        //   label: "基础设施",
        //   value: "8",
        // },
      ],
      choosedBlock: [],

      //项目名称
      projectName: "",
      //功能科目
      functionSubject: "",
      //经济科目
      finicialSubject: "",
      //支付时间
      payTime: [],
      // payTime: ["2024-06-01", "2024-06-15"],
      proTypeName: null,

      //排序弹框显示
      sortShow: false,
      sortString: "",
      //排序选项
      sortOptions: [],
      popoverVisible: false,
      radioStyle: {
        display: "block",
        height: "30px",
        lineHeight: "30px",
      },
      columns: [
        {
          title: "项目分类",
          dataIndex: "type",
          key: "type",
          width: 140,
        },
        {
          title: "项目名称",
          dataIndex: "name",
          key: "name",
          width: 180,
        },
        {
          title: "支付日期",
          dataIndex: "time",
          width: 180,
          key: "time",
        },
        {
          title: "摘要",
          key: "abstract",
          dataIndex: "abstract",
          width: 300,
          //ellipsis: true,  不生效  why?
        },
        {
          title: "收款人名称",
          key: "getName",
          dataIndex: "getName",
          width: 120,
        },
        {
          title: "行业名称",
          key: "industryName",
          dataIndex: "industryName",
          width: 160,
        },
        {
          title: "功能科目名称",
          key: "functionName",
          dataIndex: "functionName",
          width: 160,
        },
        {
          title: "经济科目名称",
          key: "finicialName",
          dataIndex: "finicialName",
          width: 140,
        },
        {
          title: "资金来源",
          key: "source",
          dataIndex: "source",
          width: 140,
        },
        {
          title: "资金性质",
          key: "nature",
          dataIndex: "nature",
          width: 140,
        },
        {
          title: "金额（元）",
          key: "money",
          width: 174,
          scopedSlots: { customRender: "money" },
          fixed: "right",
        },
      ],
      dataSource: [
        // {
        //   type: "type",
        //   name: "名称", //项目名称
        //   time: "2023.09", //支付日期
        //   abstract: "22222777", //摘要
        //   getName: "张三", //收款人名称
        //   industryName: "金融", //行业名称
        //   functionName: "功能科目", //功能科目名称
        //   finicialName: "经济科目", //经济科目名称
        //   source: "银行", //资金来源
        //   nature: "借贷", //资金性质
        //   money: "3333",
        //   zcfsmc: "支出方式", //支出方式名称
        //   zfcgfs: "政府采购方式", //政府采购方式
        //   jsfs: "结算方式",
        //   zfzhmc: "支付账户名称",
        //   zfyhmc: "支付银行名称",
        //   qsyhmc: "清算银行名称",
        //   skrzhbh: "收款人账户编号",
        //   skrzhyh: "收款人账户银行",
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
          this.getPayDetailTable();
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = 1;
          this.pagination.pageSize = size;
          this.getPayDetailTable();
        },
      },
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      console.log("payDetail记录路由从哪里过来的", to, from);
      console.log("赋值前", vm.fromRoute);
      // 通过 `vm` 访问组件实例
      if (from) {
        vm.fromRoute = from.name;
      }
      console.log("赋值后", vm.fromRoute);
    });
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
  components: {
    SortModal,
    CommonList,
    ASelect: Select,
    AInput: Input,
    AIcon: Icon,
    AButton: Button,
    ARangePicker: RangePicker,
    APopover: Popover,
    // ARadio: Radio,
    // ARadioGroup: Group,
    // ATreeSelect: TreeSelect,
  },
  async mounted() {
    // console.log("query传参", this.$route.query);
    this.choosedYear = this.blockChoosedYear;
    this.payTime = this.$route.query.time;
    this.functionSubject = this.$route.query.funcSub;
    this.finicialSubject = this.$route.query.finanSub;
    this.proTypeName = this.$route.query.proType;
    await this.getData(); //获取所有板块下拉框
    this.choosedBlock = this.choosedBlockName; //板块反显
    await this.getPayDetailManageOptions(); //获取主管单位选择框
    const arr1 = findValueByKey(this.$route.query.manage, this.manageUnitTree);
    this.choosedManageUnit = arr1;
    await this.getPayDetailBudgetOptions(); //获取预算单位选择框
    //之前采用的树形下拉框
    // this.budgetUnitTree = filterMenuList(this.budgetUnitTree); //判断树形选择框是否是父节点，是父节点加上disabled
    // const arr2 = findValueByTitle(
    //   this.$route.query.budget,
    //   this.budgetUnitTree
    // );
    //现在预算单位采用和主管单位一样的结构
    const arr2 = findValueByKey(this.$route.query.budget, this.budgetUnitTree);
    this.choosedBudgetUnit = arr2;

    //获取表格数据
    await this.getPayDetailSortOptions(); //排序选项
    // this.getPayDetailTable();
  },
  methods: {
    ...mapMutations("blockAnalysis", {
      setChoosedBlockName: "setChoosedBlockName",
      setChoosedBlockId: "setChoosedBlockId",
    }),

    //获取所有板块下拉框
    async getData() {
      const res = await getPayDetailAllBlocks();
      if (res.message === "成功") {
        console.log("message成功  获取所有板块下拉框res", res);
        this.blockOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    handleBlockChange() {
      this.choosedManageUnit = [];
      this.choosedBudgetUnit = [];
      //重新获取主管单位下拉框
      this.getPayDetailManageOptions();
      //重新获取预算单位下拉框
      this.getPayDetailBudgetOptions();
    },

    //获取主管单位选择框
    async getPayDetailManageOptions() {
      const json = {
        year: this.choosedYear,
        unitIndustry: this.choosedBlockName,
        unitCodes: this.choosedBudgetUnit,
      };
      const res = await getPayDetailManageOptions(json);
      if (res.message === "成功") {
        console.log("message成功 获取主管单位选择框", res.data);
        this.manageUnitTree = res.data;
        console.log("打印页面中this.manageUnitTree", this.manageUnitTree);
      } else {
        this.$message.error(res.message);
      }
    },

    //获取预算单位选择框
    async getPayDetailBudgetOptions() {
      this.choosedBudgetUnit = [];
      const json = {
        year: this.choosedYear,
        unitIndustry: this.choosedBlockName,
        deptCodes: this.choosedManageUnit,
      };
      const res = await getPayDetailBudgetOptions(json);
      if (res.message === "成功") {
        console.log("message成功 页面内获取预算单位选择框", res.data);
        this.budgetUnitTree = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //获取列表数据总条数
    async getPayDetailTableTotal() {
      const json = {
        year: this.choosedYear,
        unitIndustry: this.choosedBlockName,
        deptIds: this.choosedManageUnit,
        unitIds: this.choosedBudgetUnit,
        proName: this.projectName,
        functionName: this.functionSubject,
        financialName: this.finicialSubject,
        startDate: this.payTime.length
          ? dayjs(this.payTime[0]).format("YYYY-MM-DD")
          : null,
        endDate: this.payTime.length
          ? dayjs(this.payTime[1]).format("YYYY-MM-DD")
          : null,
        // odName //排序
        proTypeName: this.proTypeName,
      };
      const res = await getPayDetailTableTotal(json);
      console.log("支出明细页获取列表数据总条数res", res);
      if (res.message === "成功") {
        console.log("message成功 支出明细页获取列表数据", res.data);
        this.pagination.total = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //获取列表数据
    async getPayDetailTable() {
      await this.getPayDetailTableTotal();
      const json = {
        year: this.choosedYear,
        unitIndustry: this.choosedBlockName,
        deptIds: this.choosedManageUnit, //主管单位
        unitIds: this.choosedBudgetUnit, //预算单位
        proName: this.projectName,
        functionName: this.functionSubject,
        financialName: this.finicialSubject,
        startDate: this.payTime.length
          ? dayjs(this.payTime[0]).format("YYYY-MM-DD")
          : null,
        endDate: this.payTime.length
          ? dayjs(this.payTime[1]).format("YYYY-MM-DD")
          : null,
        odName: this.sortString,
        proTypeName: this.proTypeName,
        pageSize: this.pagination.pageSize,
        pageOffset: this.pagination.pageSize * (this.pagination.current - 1), //偏移量
      };
      const res = await getPayDetailTable(json);

      if (res.message === "成功") {
        console.log("message成功 支出明细页获取列表数据", res.data);
        this.dataSource = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //修改排序方式
    changeSelected() {},

    //获取排序弹框选项数据
    async getPayDetailSortOptions() {
      this.sortOptions = [];
      const res = await getPayDetailSortOptions();
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
      this.getPayDetailTable();
      this.onSortCancel();
    },

    //重置按钮
    reset() {
      this.choosedYear = null;
      this.choosedManageUnit = [];
      this.choosedBudgetUnit = [];
      this.choosedBlock = [];
      this.projectName = "";
      this.functionSubject = "";
      this.finicialSubject = "";
      this.payTime = [];
      this.proTypeName = null;
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
.pay-detail {
  width: 100%;
  height: 100%;
  padding: 20px;
  background: #fff;
}

.pay-detail-pop {
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
