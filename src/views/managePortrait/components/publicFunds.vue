<!-- 异常分析：疑似三公 -->
<template>
  <div class="public-funds">
    <div class="public-funds-content">
      <div class="public-funds-content-header">
        疑似三公分析（当前单位：{{ curTreeItem.title }}）
      </div>
      <div style="padding-bottom: 20px">
        <div class="public-funds-content-subHeader">
          <div class="subHeader-type">
            当前三公类型：{{ publicType === null ? "全部" : publicType }}
          </div>
          <div class="subHeader-item">
            <div
              style="
                width: 14px;
                height: 14px;
                background: red;
                border-radius: 4px;
              "
            ></div>
            <div>：可疑金额</div>
          </div>
          <div class="subHeader-item">
            <div
              style="
                width: 14px;
                height: 14px;
                background: #1776ff;
                border-radius: 4px;
              "
            ></div>
            <div>：正常金额</div>
          </div>
        </div>

        <div class="public-funds-content-table">
          <div class="public-funds-content-table-item">
            <div class="sub-title">单位情况</div>
            <a-table
              :columns="tableData1.columns"
              :data-source="tableData1.data"
              :pagination="false"
              :loading="tableLoading1"
              :scroll="{ x: 'max-content', y: 212 }"
              :bordered="true"
              style="min-height: 256px"
              :rowClassName="setRowClassName1"
              :customRow="handleRowClick1"
            >
              <div slot="unit" slot-scope="text">
                <span style="cursor: pointer"> {{ text }}</span>
              </div>

              <div slot="year" slot-scope="text">
                <div class="table-progress">
                  <a-progress
                    :percent="
                      Number(text.split('+')[0] / maxSum1) * 100 +
                      Number(text.split('+')[1] / maxSum1) * 100
                    "
                    :success-percent="
                      (Number(text.split('+')[0]) / maxSum1) * 100
                    "
                    :show-info="false"
                  />
                  <span class="table-progress-left"
                    >{{ Number(text.split("+")[0]).toLocaleString() }}元</span
                  >
                  <span class="table-progress-right"
                    >{{ Number(text.split("+")[1]).toLocaleString() }}元</span
                  >
                </div>
              </div>
            </a-table>
          </div>
          <div class="public-funds-content-table-item">
            <div class="sub-title">收款人情况</div>
            <a-table
              :columns="tableData2.columns"
              :data-source="tableData2.data"
              :pagination="false"
              :loading="tableLoading2"
              :scroll="{ x: 'max-content', y: 212 }"
              :bordered="true"
              style="min-height: 256px"
              :rowClassName="setRowClassName2"
              :customRow="handleRowClick2"
            >
              <div slot="unit" slot-scope="text">
                <span style="cursor: pointer"> {{ text }}</span>
              </div>
              <div slot="year" slot-scope="text">
                <div class="table-progress">
                  <a-progress
                    :percent="
                      Number(text.split('+')[0] / maxSum2) * 100 +
                      Number(text.split('+')[1] / maxSum2) * 100
                    "
                    :success-percent="
                      (Number(text.split('+')[0]) / maxSum2) * 100
                    "
                    :show-info="false"
                  />
                  <span class="table-progress-left"
                    >{{ Number(text.split("+")[0]).toLocaleString() }}元</span
                  >
                  <span class="table-progress-right"
                    >{{ Number(text.split("+")[1]).toLocaleString() }}元</span
                  >
                </div>
              </div>
            </a-table>
          </div>
        </div>

        <div class="public-funds-content-pay">
          <div class="sub-title">支付明细</div>
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

        <a-table
          :columns="columns3"
          :data-source="dataSource3"
          :pagination="pagination3"
          :loading="tableLoading3"
          :scroll="{ x: 'max-content', y: 220 }"
          :bordered="true"
          class="public-funds-content-table-three"
        >
          <span
            slot="zfje"
            slot-scope="text, record"
            :class="[
              record.isNormal == '1'
                ? 'public-funds-content-table-three-slot-normal'
                : 'public-funds-content-table-three-slot',
            ]"
          >
            {{ Number(record.zfje).toLocaleString() }}
          </span>
        </a-table>
      </div>
    </div>
    <div class="public-funds-right">
      <div class="public-funds-right-header">参数设置</div>
      <div style="max-height: calc(100% - 86px); overflow: auto">
        <div class="public-funds-right-item">
          <div class="item-label">年份：</div>
          <a-select
            placeholder="请选择"
            v-model="year"
            :options="yearOptions"
            class="item-value"
          />
        </div>
        <div class="public-funds-right-item">
          <div class="item-label">三公类型：</div>
          <a-select
            placeholder="请选择"
            v-model="publicType"
            :options="publicTypeOptions"
            class="item-value"
          />
        </div>
        <div class="public-funds-right-item">
          <div class="item-label">预算资金体系：</div>
          <!-- <a-select
          placeholder="请选择"
          v-model="budgetStructure"
          :options="budgetStructureOptions"
          class="item-value"
        /> -->
          <div>
            <div>
              <a-checkbox
                :indeterminate="indeterminate"
                :checked="checkAll"
                @change="onCheckAllChange"
              >
                全选
              </a-checkbox>
            </div>
            <a-checkbox-group
              v-model="checkedList"
              :options="plainOptions"
              @change="onChange"
              class="item-checkbox"
            />
          </div>
        </div>
      </div>

      <div class="public-funds-right-action">
        <!-- @click="handleParamsReset" -->
        <!-- @click="handleParamsConfig" -->
        <a-button style="margin-right: 8px" @click="handleParamsReset"
          >重置</a-button
        >
        <a-button type="primary" @click="handleParamsConfig">确定</a-button>
      </div>
    </div>
    <SortModal
      v-if="sortOptions1.length"
      sortTitle="支付明细排序配置"
      :sortShow="sortShow1"
      @onSortCancel="onSortCancel1"
      @onSortConfirm="onSortConfirm1"
      :sortOptions="sortOptions1"
      firstSortName="支付金额+支付日期"
    ></SortModal>

    <FilterModal
      filterTitle="支付明细筛选配置"
      :filterShow="filterShow1"
      :paramsOption="paramsOption1"
      :tableData="filterTableData1"
      @addTable3="addTable1"
      @delTable3="delTable1"
      @onFilterCancel="onFilterCancel1"
      @onFilterConfirm="onFilterConfirm1"
    ></FilterModal>
  </div>
</template>
<script>
//import { Select } from "ant-design-vue";
import FilterModal from "@/components/filterModal.vue";
import SortModal from "@/components/sortModal.vue";
import {
  getPublicFundsMoneyOptions,
  getPublicFundsTableOne,
  getPublicFundsTableThree,
  getPublicFundsTableThreeFilter,
  getPublicFundsTableThreeSort,
  getPublicFundsTableTwo,
} from "@/shared/newApi/manage/exceptionAnalysis/publicFunds.js";
import { Button, Checkbox, Progress } from "ant-design-vue";
import { mapState } from "vuex";
const { Group } = Checkbox;
export default {
  name: "PublicFunds",
  data() {
    return {
      //选择年份
      year: "2023",
      yearOptions: [
        {
          value: "2018",
          label: "2018",
        },
        {
          value: "2019",
          label: "2019",
        },
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
      //三公类型
      publicType: null,
      publicTypeOptions: [
        {
          label: "全部",
          value: null,
        },
        {
          label: "公务用车费用",
          value: "公务用车费用",
        },
        {
          label: "公务接待费用",
          value: "公务接待费用",
        },
        {
          label: "因公出国（境）费用",
          value: "因公出国（境）费用",
        },
      ],
      //预算资金体系下拉选项
      checkedList: [
        // "null",
        // "财政专户管理资金",
        // "财政专户资金",
        // "公共财政或预算资金",
        // "一般公共预算资金",
        // "政府性资金",
        // "政府性基金预算资金",
        // "其他",
      ],
      indeterminate: false,
      checkAll: true,
      plainOptions: [
        // {
        //   value: "null",
        //   label: "null",
        // },
        // {
        //   label: "财政专户管理资金",
        //   value: "财政专户管理资金",
        // },
        // {
        //   label: "财政专户资金",
        //   value: "财政专户资金",
        // },
        // {
        //   label: "公共财政或预算资金",
        //   value: "公共财政或预算资金",
        // },
        // {
        //   label: "一般公共预算资金",
        //   value: "一般公共预算资金",
        // },
        // {
        //   label: "政府性资金",
        //   value: "政府性资金",
        // },
        // {
        //   label: "政府性基金预算资金",
        //   value: "政府性基金预算资金",
        // },
        // {
        //   label: "其他",
        //   value: "其他",
        // },
      ],

      //表格1
      choosedRowId1: null,
      tableLoading1: false,
      tableData1: {
        // columns: [
        //   {
        //     title: "分析单位",
        //     dataIndex: "name",
        //     key: "name",
        //     width: 200,
        //     // scopedSlots: { customRender: "2017" },
        //   },
        //   {
        //     title: "业务年度：2023",
        //     dataIndex: "year",
        //     key: "year",
        //     width: 250,
        //     scopedSlots: { customRender: "year" },
        //   },
        // ],
        // data: [
        //   {
        //     id: "1",
        //     name: "青少年中心", //分析单位
        //     year: "2000+3000", //可疑金额+正常金额
        //   },
        //   {
        //     id: "2",
        //     name: "体育局", //分析单位
        //     year: "3000+4000", //可疑金额+正常金额
        //   },
        //   {
        //     id: "3",
        //     name: "青少年中心", //分析单位
        //     year: "3000+4000", //可疑金额+正常金额
        //   },
        //   {
        //     id: "4",
        //     name: "青少年中心", //分析单位
        //     year: "3000+4000", //可疑金额+正常金额
        //   },
        //   {
        //     id: "5",
        //     name: "青少年中心", //分析单位
        //     year: "3000+4000", //可疑金额+正常金额
        //   },
        //   {
        //     id: "6",
        //     name: "青少年中心", //分析单位
        //     year: "3000+4000", //可疑金额+正常金额
        //   },
        // ],
      },
      analysisUnit: null, //表格1选中的分析单位
      maxSum1: 1,

      //表格2
      choosedRowId2: null,
      tableLoading2: false,
      tableData2: {
        // columns: [
        //   {
        //     title: "分析单位",
        //     dataIndex: "name",
        //     key: "name",
        //     width: 200,
        //     // scopedSlots: { customRender: "2017" },
        //   },
        //   {
        //     title: "收款人",
        //     dataIndex: "payee",
        //     key: "payee",
        //     width: 120,
        //     // scopedSlots: { customRender: "2017" },
        //   },
        //   {
        //     title: "业务年度：2021",
        //     dataIndex: "year",
        //     key: "year",
        //     width: 250,
        //     scopedSlots: { customRender: "year" },
        //   },
        // ],
        // data: [
        //   {
        //     id: "1",
        //     name: "青少年中心", //分析单位
        //     payee: "胡适", //收款人名称
        //     year: "3000+4000", //可疑金额+正常金额
        //   },
        //   {
        //     id: "2",
        //     name: "青少年中心", //分析单位
        //     payee: "胡适", //收款人名称
        //     year: "3000+4000", //可疑金额+正常金额
        //   },
        //   {
        //     id: "3",
        //     name: "青少年中心", //分析单位
        //     payee: "胡适", //收款人名称
        //     year: "3000+4000", //可疑金额+正常金额
        //   },
        //   {
        //     id: "4",
        //     name: "青少年中心", //分析单位
        //     payee: "胡适", //收款人名称
        //     year: "3000+4000", //可疑金额+正常金额
        //   },
        //   {
        //     id: "3",
        //     name: "青少年中心", //分析单位
        //     payee: "胡适", //收款人名称
        //     year: "3000+4000", //可疑金额+正常金额
        //   },
        //   {
        //     id: "4",
        //     name: "青少年中心", //分析单位
        //     payee: "胡适", //收款人名称
        //     year: "3000+4000", //可疑金额+正常金额
        //   },
        //   {
        //     id: "5",
        //     name: "青少年中心", //分析单位
        //     payee: "胡适", //收款人名称
        //     year: "3000+4000", //可疑金额+正常金额
        //   },
        //   {
        //     id: "6",
        //     name: "青少年中心", //分析单位
        //     payee: "胡适", //收款人名称
        //     year: "3000+4000", //可疑金额+正常金额
        //   },
        // ],
      },
      maxSum2: 1,
      payeeName: null, // 表格1选中的收款人

      //表格3
      tableLoading3: false,
      columns3: [
        {
          title: "支付日期",
          dataIndex: "zfrq",
          key: "zfrq",
          width: 120,
          // fixed: "left",
        },
        {
          title: "收款人名称",
          dataIndex: "skrmc",
          key: "skrmc",
          width: 120,
          // fixed: "left",
        },
        {
          title: "项目名称",
          dataIndex: "xmmc",
          key: "xmmc",
          width: 200,
        },
        {
          title: "经济科目名称",
          dataIndex: "jjkmmc",
          key: "jjkmmc",
          width: 200,
        },
        {
          title: "摘要",
          dataIndex: "zy",
          key: "zy",
          width: 200,
        },
        {
          title: "预算资金体系",
          dataIndex: "yszjtx",
          key: "yszjtx",
          width: 180,
        },
        {
          title: "支付金额（元）",
          dataIndex: "zfje",
          key: "zfje",
          width: 220,
          scopedSlots: { customRender: "zfje" },
          fixed: "right",
        },
      ],
      dataSource3: [
        // {
        //   zfrq: "xxx", //支付日期"
        //   skrmc: "xxx", //"收款人名称"
        //   xmmc: "xxx", //"项目名称"
        //   jjkmmc: "xxx", //"经济科目名称"
        //   zy: "xxx", //摘要
        //   yszjtx: "xxx", //"预算资金体系"
        //   zfje: "43434343", //"支付金额（元）"
        //   isNormal: "0", //可疑金额： '0'   正常金额： '1'   必须是字符串，不要数字
        // },
        // {
        //   zfrq: "xxx", //支付日期"
        //   skrmc: "xxx", //"收款人名称"
        //   xmmc: "xxx", //"项目名称"
        //   jjkmmc: "xxx", //"经济科目名称"
        //   zy: "xxx", //摘要
        //   yszjtx: "xxx", //"预算资金体系"
        //   zfje: "43434343", //"支付金额（万元）"
        //   isNormal: "1", //可疑金额： '0'   正常金额： '1'   必须是字符串，不要数字
        // },
      ],
      pagination3: {
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
          this.pagination3.current = page;
          this.pagination3.pageSize = pageSize;
          this.getPublicFundsTableThree();
        },
        onShowSizeChange: (current, size) => {
          this.pagination3.current = 1;
          this.pagination3.pageSize = size;
          this.getPublicFundsTableThree();
        },
      },
      //排序
      //项目执行明细排序
      sortShow1: false,
      sortStringOne: "",
      //排序选项
      sortOptions1: [],

      //筛选
      filterShow1: false,
      //筛选选项
      paramsOption1: [
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
      filterTableData1: [
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
      filterConfirmArrOne: "",
    };
  },

  computed: {
    ...mapState("blockAnalysis", ["blockChoosedYear"]),
    ...mapState("managePortrait", ["curTreeItem"]),
  },
  components: {
    //ASelect: Select,
    ACheckboxGroup: Group,
    ACheckbox: Checkbox,
    AProgress: Progress,
    AButton: Button,
    FilterModal,
    SortModal,
  },
  watch: {
    curTreeItem: {
      async handler(newVal, oldVal) {
        console.log("5656555", newVal, oldVal);
        this.getAllData();
      },
      deep: true,
    },
  },
  mounted() {
    if (!this.curTreeItem.key) return;
    this.getAllData();
  },
  methods: {
    async getAllData() {
      if (!this.curTreeItem.key) return;
      await this.getPublicFundsMoneyOptions(); //预算资金体系下拉选项
      await this.getPublicFundsTableOne(); //获取单位情况表格
      await this.getPublicFundsTableTwo(); //获取收款人情况表格
      this.getPublicFundsTableThreeFilter(); //支付明细表格筛选
      await this.getPublicFundsTableThreeSort(); //支付明细表格排序
      //因为有默认排序值，故放置排序确认函数内
      // await this.getPublicFundsTableThree(); //获取支付明细表格
    },

    //预算资金体系下拉选项
    async getPublicFundsMoneyOptions() {
      const res = await getPublicFundsMoneyOptions();
      if (res.message === "成功") {
        console.log("message成功 预算资金体系下拉选项", res.data);
        this.plainOptions = res.data;
        //资金性质初始值全选
        let arr = [];
        this.plainOptions.forEach((item) => {
          arr.push(item.value);
        });
        this.checkedList = arr;
      } else {
        this.$message.error(res.message);
      }
    },

    //获取单位情况表格
    async getPublicFundsTableOne() {
      const json = {
        year: this.year,
        deptCode: this.curTreeItem.key,
        sgType: this.publicType, //三公类型
        fundNatureName: this.checkedList, //资金性质
      };
      this.tableLoading1 = true;
      const res = await getPublicFundsTableOne(json);
      this.tableLoading1 = false;
      if (res.message === "成功") {
        console.log("message成功 获取单位情况表格", res.data);
        this.tableData1 = res.data;
        console.log("三公该列最大值", res.data.maxSum);
        this.maxSum1 = res.data.maxSum;
        //初始上来选中单位情况的第一行
        if (this.tableData1.data.length) {
          this.choosedRowId1 = this.tableData1.data[0].id;
          this.analysisUnit = this.tableData1.data[0].name; //初始选中的分析单位
        }
        this.choosedRowId2 = null;
      } else {
        this.$message.error(res.message);
      }
    },

    //获取收款人情况表格
    async getPublicFundsTableTwo() {
      const json = {
        year: this.year,
        deptCode: this.curTreeItem.key,
        sgType: this.publicType, //三公类型
        fundNatureName: this.checkedList, //资金性质
        unitName: this.analysisUnit, //表格1选中的分析单位
      };
      this.tableLoading2 = true;
      const res = await getPublicFundsTableTwo(json);
      this.tableLoading2 = false;
      if (res.message === "成功") {
        console.log("message成功 获取收款人情况表格", res.data);
        console.log("三公该列最大值2", res.data.maxSum);
        this.maxSum2 = res.data.maxSum;
        this.tableData2 = res.data;
        this.payeeName = null;
        this.choosedRowId2 = null;
      } else {
        this.$message.error(res.message);
      }
    },

    //获取支付明细表格
    async getPublicFundsTableThree() {
      const json = {
        year: this.year,
        deptCode: this.curTreeItem.key,
        sgType: this.publicType, //三公类型
        fundNatureName: this.checkedList, //资金性质
        unitName: this.analysisUnit, //表格1选中的分析单位
        payeeName: this.payeeName,
        filterCondition: this.filterConfirmArrOne,
        pageSize: this.pagination3.pageSize,
        pageOffset: this.pagination3.pageSize * (this.pagination3.current - 1), //偏移量
        odName: this.sortStringOne, //排序条件
      };
      this.tableLoading3 = true;
      const res = await getPublicFundsTableThree(json);
      this.tableLoading3 = false;
      if (res.message === "成功") {
        console.log("message成功 获取支付明细表格", res.data);
        this.dataSource3 = res.data.dateList;
        this.pagination3.total = res.data.total;
      } else {
        this.$message.error(res.message);
      }
    },

    //支付明细表格筛选
    async getPublicFundsTableThreeFilter() {
      const res = await getPublicFundsTableThreeFilter();
      if (res.message === "成功") {
        console.log("message成功 支付明细表格筛选", res.data);
        this.paramsOption1 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //支付明细表格排序
    async getPublicFundsTableThreeSort() {
      this.sortOptions1 = [];
      const res = await getPublicFundsTableThreeSort();
      if (res.message === "成功") {
        console.log("message成功 支付明细表格排序", res.data);
        this.sortOptions1 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //参数设置确定
    async handleParamsConfig() {
      await this.getPublicFundsTableOne(); //获取单位情况表格
      await this.getPublicFundsTableTwo(); //获取收款人情况表格
      await this.getPublicFundsTableThree(); //获取支付明细表格
      this.getPublicFundsTableThreeFilter(); //支付明细表格筛选
    },

    //参数设置重置
    handleParamsReset() {
      this.year = "2023";
      this.publicType = null;
      let arr = [];
      this.plainOptions.forEach((item) => {
        arr.push(item.value);
      });
      this.checkedList = arr;
      this.handleParamsConfig();
    },

    onChange(checkedList) {
      this.indeterminate =
        !!checkedList.length && checkedList.length < this.plainOptions.length;
      this.checkAll = checkedList.length === this.plainOptions.length;
    },
    onCheckAllChange(e) {
      Object.assign(this, {
        checkedList: e.target.checked
          ? this.plainOptions.map((item) => item.value)
          : [],
        indeterminate: false,
        checkAll: e.target.checked,
      });
    },

    //第一个表格
    //表格选中行背景色
    setRowClassName1(record, index) {
      // console.log("77777777777777", index);
      // 为第一行添加背景色
      if (this.choosedRowId1 === record.id) {
        return "background-color-row";
      }
      return "";
    },
    //表格某行选中
    handleRowClick1(record) {
      return {
        on: {
          click: async () => {
            this.choosedRowId1 = record.id;
            this.choosedRowId2 = null;
            this.analysisUnit = record.name; //点击行的分析单位名称
            await this.getPublicFundsTableTwo();
            this.getPublicFundsTableThree();
            // console.log("点击行的record", record);
          },
        },
      };
    },

    //第二个表格
    //表格选中行背景色
    setRowClassName2(record, index) {
      // console.log("77777777777777", index);
      // 为第一行添加背景色

      if (this.choosedRowId2 === record.id) {
        return "background-color-row";
      }
      return "";
    },
    //表格某行选中
    handleRowClick2(record) {
      return {
        on: {
          click: () => {
            if (this.choosedRowId2 === record.id) {
              this.choosedRowId2 = null;
              this.payeeName = null;
              this.getPublicFundsTableThree();
            } else {
              this.choosedRowId2 = record.id;
              this.payeeName = record.payee;
              this.getPublicFundsTableThree();
            }

            // console.log("点击行的record", record);
          },
        },
      };
    },

    //第三个表格支付明细排序
    sortOne() {
      this.sortShow1 = true;
    },
    onSortCancel1() {
      this.sortShow1 = false;
    },
    onSortConfirm1(sortStringOne) {
      this.sortStringOne = sortStringOne;
      this.getPublicFundsTableThree();
      this.onSortCancel1();
    },

    //第三个表格筛选
    filterOne() {
      this.filterShow1 = true;
    },
    onFilterCancel1() {
      this.filterShow1 = false;
    },

    onFilterConfirm1(filterConfirmArrOne) {
      // this.initTable();
      this.filterConfirmArrOne = filterConfirmArrOne;
      this.getPublicFundsTableThree();
      this.onFilterCancel1();
    },

    addTable1(json) {
      this.filterTableData1 = [...this.filterTableData1, json];
    },
    delTable1(arr) {
      this.filterTableData1 = arr;
    },
  },
};
</script>
<style lang="less">
.background-color-row {
  background-color: #e6f4ff; /* 你可以更换为你想要的颜色 */
}
.public-funds {
  width: calc(100% - 314px);
  margin-left: 314px;
  padding: 20px;
  display: flex;
  justify-content: space-between;

  .table-progress {
    position: relative;

    &-left {
      color: rgba(0, 0, 0, 0.45);
      position: absolute;
      left: 4px;
      top: 1px;
    }

    &-right {
      color: rgba(0, 0, 0, 0.45);
      position: absolute;
      right: 4px;
      top: 1px;
    }

    .ant-progress-success-bg {
      background: red !important;
    }

    .ant-progress-bg {
      background: #1776ff !important;
    }
  }

  &-content {
    width: calc(100% - 240px);

    &-header {
      height: 28px;
      line-height: 28px;
      color: #1c222b;
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 20px;
    }

    &-subHeader {
      height: 22px;
      line-height: 22px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;

      .subHeader-item {
        display: flex;
        align-items: center;
        margin-left: 24px;
      }

      .subHeader-type {
        color: #1776ff;
      }
    }

    &-table {
      display: flex;
      align-items: center;
      height: 300px;
      justify-content: space-between;

      &-item {
        width: calc(50% - 10px);
      }
    }

    &-pay {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-top: 20px;

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
      }
    }

    &-table-three {
      height: 300px !important;

      &-slot {
        color: #e31430;
        &-normal {
          color: #1776ff;
        }
      }
    }
  }

  &-right {
    width: 220px;
    // height: 100%;
    height: calc(100vh - 224px);
    padding: 20px;
    border-radius: 4px;
    border: 1px solid var(----4, #d6dbe3);
    position: absolute;
    right: 40px;

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

      .item-value {
        width: 100%;
      }

      .item-checkbox {
        .ant-checkbox-wrapper {
          margin-bottom: 4px;
        }
      }
    }

    &-action {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
      // position: absolute;
      // right: 20px;
      // bottom: 20px;
    }
  }
}
</style>
