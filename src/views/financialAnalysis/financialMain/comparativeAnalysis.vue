<template>
  <div class="comparative-analysis">
    <div class="comparative-analysis-top">
      <div class="analysis-top-grid">
        <div class="analysis-top-grid-item">
          <div class="item-label"><i style="color: red">*</i> 指定单位：</div>
          <!-- mode="multiple" -->
          <!-- mode="multiple"  时候choosedInstitution  为数组 -->
          <!-- 单选时候  时候choosedInstitution  为字符串 -->
          <a-select
            class="item-value"
            v-model="choosedInstitution"
            mode="multiple"
            show-search
            placeholder="请输入"
            option-filter-prop="children"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            allowClear
            @search="getCompareStructure"
            @change="changeInstitution"
          >
            <a-select-option
              v-for="item in institutionOptions"
              :key="item.label"
              :title="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </div>
        <div class="analysis-top-grid-item">
          <div class="item-label"><i style="color: red">*</i> 指定账簿：</div>
          <a-select
            class="item-value"
            placeholder="请选择"
            v-model="choosedBook"
            mode="multiple"
            @change="changeBook"
          >
            <a-select-option
              v-for="item in bookOptions"
              :key="item.label"
              :title="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </div>
        <div class="analysis-top-grid-item">
          <div class="item-label"><i style="color: red">*</i> 会计体系：</div>
          <a-select
            class="item-value"
            placeholder="请选择"
            v-model="choosedSystem"
          >
            <a-select-option
              v-for="item in systemOptions"
              :key="item.label"
              :title="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </div>

        <div class="analysis-top-grid-item">
          <div class="item-label"><i style="color: red">*</i> 指定科目：</div>
          <a-tree-select
            v-model="choosedSubject"
            class="item-value"
            style="width: 200px"
            :tree-data="subjectOptions"
            :tree-checkable="true"
            search-placeholder="请选择"
          />
          <!-- @change="changeSubject" -->
          <!-- <a-select
            class="item-value"
            placeholder="请选择"
            v-model="choosedSubject"
          >
            <a-select-option
              v-for="item in subjectOptions"
              :key="item.label"
              :title="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select> -->
        </div>
        <div class="analysis-top-grid-item">
          <div class="item-label">
            <i style="color: red">*</i> 指定对比期间：
          </div>
          <!-- <a-radio-group
            :options="periodOptions"
            v-model="chooseMode"
            @change="changePeriodRadio"
          /> -->
          <a-range-picker
            v-model="choosedPeriod"
            class="item-value"
            :placeholder="[
              `开始${chooseMode === 'year' ? '年' : '月'}`,
              `截止${chooseMode === 'year' ? '年' : '月'}`,
            ]"
            :format="chooseMode === 'year' ? 'YYYY' : 'YYYY-MM'"
            :mode="
              chooseMode === 'year' ? ['year', 'year'] : ['month', 'month']
            "
            @panelChange="handlePanelChangePeriod"
          >
            <template slot="suffixIcon">
              <a-icon type="calendar" />
            </template>
          </a-range-picker>
        </div>
        <!-- <div class="analysis-top-grid-item"></div> -->
        <!-- <div class="analysis-top-grid-item">
          <div class="item-label"><i style="color: red">*</i> 科目级次：</div>
          <a-select
            class="item-value"
            placeholder="请选择"
            v-model="choosedLevel"
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
        <div class="analysis-top-grid-item">
          <div class="analysis-top-actions">
            <a-button type="primary" @click="getCompareDataByYear()"
              >查询</a-button
            >
            <a-button type="primary" @click="reset()" style="margin-left: 10px"
              >重置</a-button
            >
            <!-- <div>
          <a>收起</a>
          <a-icon type="up" />
          <a-icon type="down" />
        </div> -->
          </div>
        </div>
      </div>

      <!-- <div class="analysis-top-single" style="height: 32px">
        <div class="single-label"><i style="color: red">*</i> 币种：</div>
        <a-radio-group v-model="moneyType">
          <a-radio value="人民币">人民币</a-radio>
          <a-radio value="美元">美元</a-radio>
          <a-radio value="欧元">欧元</a-radio>
          <a-radio value="英镑">英镑</a-radio>
          <a-radio value="新加坡元">新加坡元</a-radio>
          <a-radio value="港元">港元</a-radio>
        </a-radio-group>
      </div> -->
      <div style="display: flex">
        <div class="analysis-top-single">
          <div class="single-label">展示栏目：</div>
          <a-checkbox
            v-model="checkAll"
            :indeterminate="indeterminate"
            @change="onCheckAllChange"
          >
            全选
          </a-checkbox>
          <a-checkbox-group
            v-model="checkedList"
            :options="plainOptions"
            @change="onChange"
          />
        </div>
        <div class="analysis-top-single" style="margin-left: 30px">
          <div class="single-label">千分位：</div>
          <a-radio-group v-model="isMillennials">
            <a-radio :value="1">展示</a-radio>
            <a-radio :value="2">不展示</a-radio>
          </a-radio-group>
        </div>
        <!-- <div class="analysis-top-single" style="margin-left: 30px">
          <div class="single-label">科目级次：</div>
          <a-select
            class="item-value"
            placeholder="请选择"
            v-model="choosedLevel"
            style="width: 200px"
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
      </div>
    </div>
    <div class="comparative-analysis-cont">
      <a-table
        class="analysis-table"
        :data-source="tableData.data"
        :loading="tableLoading"
        :columns="tableData.columns"
        :indentSize="10"
        :pagination="false"
        :scroll="{ x: 'max-content', y: 'calc(100vh - 663px)' }"
        size="middle"
        bordered
      >
        <!-- :scroll="{ x: tableScrollxValue, y: 600 }" -->
      </a-table>
    </div>
  </div>
</template>
<script>
import {
  getCompareBook,
  // getCompareDataByMonth,
  getCompareDataByYear,
  getCompareStructure,
  getCompareSubjects,
  getGeneralDetailsSystem,
} from "@/shared/newApi/financialAnalysis.js";
import {
  Button,
  Checkbox,
  DatePicker,
  Icon,
  Radio,
  Select,
  TreeSelect,
} from "ant-design-vue";
import dayjs from "dayjs";
import { generateHierarchy } from "./util.js";
// removeObjectsWithTitle
// import tableDataJson from "./tableData";
import { cloneDeep } from "lodash";
import { filterDataByCheckedList, formatDataWithCommas } from "./util.js";
const { RangePicker } = DatePicker;
const { Group } = Radio;
const CheckboxGroup = Checkbox.Group;

export default {
  name: "ComparativeAnalysis",
  data() {
    return {
      tableLoading: false,
      choosedInstitution: [],
      //指定单位
      institutionOptions: [
        // {
        //   label: "code——指定机构1",
        //   value: "指定机构1的code",
        // },
        // {
        //   label: "code——指定机构2",
        //   value: "指定机构2的code",
        // },
        // {
        //   label: "code——指定机构3",
        //   value: "指定机构3的code",
        // },
      ],
      //指定账簿
      choosedBook: [],
      bookOptions: [
        // {
        //   label: "code——指定账簿1",
        //   value: "指定账簿1的code",
        // },
        // {
        //   label: "code——指定账簿2",
        //   value: "指定账簿2的code",
        // },
        // {
        //   label: "code——指定账簿3",
        //   value: "指定账簿3的code",
        // },
      ],
      //会计体系
      choosedSystem: null,
      systemOptions: [
        // {
        //   label: "code——指定账簿1",
        //   value: "指定账簿1的code",
        // },
        // {
        //   label: "code——指定账簿2",
        //   value: "指定账簿2的code",
        // },
        // {
        //   label: "code——指定账簿3",
        //   value: "指定账簿3的code",
        // },
      ],
      //指定期间
      periodOptions: [
        { label: "逐年", value: "year" },
        // { label: "逐月", value: "month" },
      ],
      choosedPeriod: [],
      chooseMode: "year",
      //指定科目
      choosedSubject: [],
      subjectOptions: [
        // {
        //   title: "code——指定科目1",
        //   value: "指定科目1的code",
        //   key: "指定科目1的code",
        //   children: [
        //     {
        //       title: "code——指定科目1.1",
        //       value: "指定科目1.1的code",
        //       key: "指定科目1.1的code",
        //       children: [
        //         {
        //           title: "code——指定科目1.1.1",
        //           value: "指定科目1.1.1的code",
        //           key: "指定科目1.1.1的code",
        //         },
        //       ],
        //     },
        //   ],
        // },
      ],
      choosedLevel: "3",
      levelOptions: [
        {
          label: "1",
          value: "1",
        },
        {
          label: "2",
          value: "2",
        },
        {
          label: "3",
          value: "3",
        },
      ],

      //币种
      moneyType: "人民币",
      //展示栏目
      checkedList: ["期初余额", "累计发生额", "期末余额"],
      indeterminate: false,
      checkAll: true,
      plainOptions: [
        {
          label: "期初余额",
          value: "期初余额",
        },
        {
          label: "累计发生额",
          value: "累计发生额",
        },
        {
          label: "期末余额",
          value: "期末余额",
        },
      ],
      //千分位
      isMillennials: 1,
      noMillennialsTableData: {}, //原始数据，不包含千分位
      tableData: {},
      tableScrollxValue: 0,
    };
  },
  computed: {
    // ...mapState("auditOptions", ["paramsObj"]),
  },
  components: {
    ASelect: Select,
    ARangePicker: RangePicker,
    ARadio: Radio,
    AButton: Button,
    ARadioGroup: Group,
    AIcon: Icon,
    ACheckbox: Checkbox,
    ACheckboxGroup: CheckboxGroup,
    ATreeSelect: TreeSelect,
  },
  watch: {
    checkedList: {
      handler(oldVal, newVal) {
        console.log("展示栏目", oldVal, newVal);
        //展示千分位
        if (this.isMillennials === 1) {
          let noMillennialsTableDataCopy = cloneDeep(
            this.noMillennialsTableData
          );
          //先处理展示栏目
          const firstData = noMillennialsTableDataCopy.columns[0];
          const secondData = noMillennialsTableDataCopy.columns.slice(1);
          const filteredData = filterDataByCheckedList(
            secondData,
            this.checkedList
          );
          //console.log("firstData", firstData, "filteredData", filteredData);
          // console.log(JSON.stringify([firstData, ...filteredData], null, 2));
          const newColumn = [firstData, ...filteredData];
          noMillennialsTableDataCopy.columns = newColumn;
          //再操作千分位
          const newData = formatDataWithCommas(noMillennialsTableDataCopy.data);
          noMillennialsTableDataCopy.data = newData;
          this.tableData = noMillennialsTableDataCopy;
          console.log("展示千分位+函数修改后  定位展示栏bug", this.tableData);
        } else if (this.isMillennials === 2) {
          let noMillennialsTableDataCopy = cloneDeep(
            this.noMillennialsTableData
          );
          //先处理展示栏目
          const firstData = noMillennialsTableDataCopy.columns[0];
          const secondData = noMillennialsTableDataCopy.columns.slice(1);
          const filteredData = filterDataByCheckedList(
            secondData,
            this.checkedList
          );
          //console.log("firstData", firstData, "filteredData", filteredData);
          // console.log(JSON.stringify([firstData, ...filteredData], null, 2));
          const newColumn = [firstData, ...filteredData];
          noMillennialsTableDataCopy.columns = newColumn;
          this.tableData = noMillennialsTableDataCopy;
          console.log("不展示千分位+函数修改后  定位展示栏bug", this.tableData);
        }
      },
      deep: true,
    },
    isMillennials: {
      handler(oldVal, newVal) {
        console.log("千分位", oldVal, newVal);
        //展示千分位
        if (this.isMillennials === 1) {
          let noMillennialsTableDataCopy = cloneDeep(
            this.noMillennialsTableData
          );
          //先处理展示栏目
          const firstData = noMillennialsTableDataCopy.columns[0];
          const secondData = noMillennialsTableDataCopy.columns.slice(1);
          const filteredData = filterDataByCheckedList(
            secondData,
            this.checkedList
          );
          //console.log("firstData", firstData, "filteredData", filteredData);
          // console.log(JSON.stringify([firstData, ...filteredData], null, 2));
          const newColumn = [firstData, ...filteredData];
          noMillennialsTableDataCopy.columns = newColumn;
          //再操作千分位
          const newData = formatDataWithCommas(noMillennialsTableDataCopy.data);
          noMillennialsTableDataCopy.data = newData;
          this.tableData = noMillennialsTableDataCopy;
          console.log("展示千分位+函数修改后  定位展示栏bug", this.tableData);
        } else if (this.isMillennials === 2) {
          let noMillennialsTableDataCopy = cloneDeep(
            this.noMillennialsTableData
          );
          //先处理展示栏目
          const firstData = noMillennialsTableDataCopy.columns[0];
          const secondData = noMillennialsTableDataCopy.columns.slice(1);
          const filteredData = filterDataByCheckedList(
            secondData,
            this.checkedList
          );
          //console.log("firstData", firstData, "filteredData", filteredData);
          // console.log(JSON.stringify([firstData, ...filteredData], null, 2));
          const newColumn = [firstData, ...filteredData];
          noMillennialsTableDataCopy.columns = newColumn;
          this.tableData = noMillennialsTableDataCopy;
          console.log("不展示千分位+函数修改后  定位展示栏bug", this.tableData);
        }
      },
    },
  },

  async mounted() {
    // await this.getCompareStructure();
    this.getGeneralDetailsSystem();
    // this.getCompareBook();
    // this.getCompareSubjects();
    // this.tableData = tableDataJson;
    // await this.getCompareDataByMonth();
    // setTimeout(() => {
    //   this.tableScrollxValue =
    //     tableDataJson.columns.length * tableDataJson.columns[1].width;
    // }, 200);
  },
  methods: {
    //会计体系下拉框
    async getGeneralDetailsSystem() {
      const json = {
        // year: this.choosedFinYear, //会计年份
        unitCode: "", // 单位编码
        // acctEbkNum: this.finBook, //会计电子账簿编码
        // acctSystem: this.finSystem, // 会计体系
        // month: this.choosedFinMonth, //会计月份，可多选
        // acctSubjCode: this.choosedSubject, // 会计科目编码
      };
      const res = await getGeneralDetailsSystem(json);
      console.log("页面内 会计体系下拉框res", res);
      if (res.message === "成功") {
        console.log("message成功 会计体系下拉框", res.data);
        this.systemOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //重置
    reset() {
      this.choosedInstitution = [];
      this.choosedSystem = null;
      this.choosedBook = [];
      this.choosedPeriod = [];
      this.choosedSubject = [];
      // this.choosedLevel = null;
      // this.getCompareDataByMonth();
    },

    changeInstitution() {
      this.getCompareBook();
      // this.getCompareSubjects();
    },

    changeBook() {
      // this.getCompareStructure();
      this.getCompareSubjects();
    },

    // changeSubject() {
    //   this.getCompareStructure();
    //   this.getCompareBook();
    // },

    //获取指定单位
    async getCompareStructure(value) {
      const json = {
        inputData: value,
      };
      const res = await getCompareStructure(json);
      console.log("页面内 获取指定机构res", res);
      if (res.message === "成功") {
        console.log("message成功 获取指定机构", res.data);
        this.institutionOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //根据指定机构获取指定账簿
    async getCompareBook() {
      const json = {
        unitName: this.choosedInstitution, //单位代码
        acctSubjCode: this.choosedSubject, //科目代码
        acctSubjLevel: this.choosedLevel, //科目级别
        // ？？？？？？？: this.choosedSystem, //会计体系
        acctEbkNum: "", //账簿编号
        acctYearStart:
          this.chooseMode === "year" && this.choosedPeriod.length
            ? dayjs(this.choosedPeriod[0]).format("YYYY")
            : null, //年份开始
        acctYearEnd:
          this.chooseMode === "year" && this.choosedPeriod.length
            ? dayjs(this.choosedPeriod[1]).format("YYYY")
            : null, //结束月份
        acctYearMonthStart:
          this.chooseMode === "month" && this.choosedPeriod.length
            ? dayjs(this.choosedPeriod[0]).format("YYYY-MM")
            : null, //开始月份
        acctYearMonthEnd:
          this.chooseMode === "month" && this.choosedPeriod.length
            ? dayjs(this.choosedPeriod[1]).format("YYYY-MM")
            : null, //结束月份
      };
      const res = await getCompareBook(json);
      console.log("页面内 根据指定机构获取指定账簿res", res);
      if (res.message === "成功") {
        console.log("message成功 根据指定机构获取指定账簿", res.data);
        this.bookOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //根据指定机构获取指定科目
    async getCompareSubjects() {
      const json = {
        unitName: this.choosedInstitution, //单位代码
        acctSubjCode: this.choosedSubject, //科目代码
        acctSubjLevel: this.choosedLevel, //科目级别
        // ？？？？？？？: this.choosedSystem, //会计体系
        acctEbkNum: this.choosedBook, //账簿编号
        acctYearStart:
          this.chooseMode === "year" && this.choosedPeriod.length
            ? dayjs(this.choosedPeriod[0]).format("YYYY")
            : null, //年份开始
        acctYearEnd:
          this.chooseMode === "year" && this.choosedPeriod.length
            ? dayjs(this.choosedPeriod[1]).format("YYYY")
            : null, //结束月份
        acctYearMonthStart:
          this.chooseMode === "month" && this.choosedPeriod.length
            ? dayjs(this.choosedPeriod[0]).format("YYYY-MM")
            : null, //开始月份
        acctYearMonthEnd:
          this.chooseMode === "month" && this.choosedPeriod.length
            ? dayjs(this.choosedPeriod[1]).format("YYYY-MM")
            : null, //结束月份
      };
      const res = await getCompareSubjects(json);
      console.log("页面内 根据指定机构获取指定科目res", res);
      if (res.message === "成功") {
        console.log("message成功 根据指定机构获取指定科目", res.data);
        this.subjectOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //获取表格前检查是否所有必填项已填
    checkParams() {
      if (this.choosedInstitution.length < 1) {
        this.$message.warning("请选择指定单位");
        return false;
      } else if (this.choosedBook.length < 1) {
        this.$message.warning("请选择指定账簿");
        return false;
      } else if (this.choosedPeriod.length < 1) {
        this.$message.warning("请选择指定对比期间");
        return false;
      } else if (this.choosedSubject.length < 1) {
        this.$message.warning("请选择指定科目");
        return false;
      } else if (this.choosedSystem == null) {
        this.$message.warning("请选择指定会计体系");
        return false;
      }
      return true;
    },
    //获取表格数据
    async getCompareDataByYear() {
      if (!this.checkParams()) {
        return; // 如果检查不通过，则停止执行后续代码
      }
      console.log("获取表格数据");
      const arr = generateHierarchy(this.choosedSubject);
      const json = {
        // unitName: null, //单位名称
        unitName: this.choosedInstitution, //单位代码
        acctSubjCode: arr, //科目代码
        acctSubjLevel: this.choosedLevel, //科目级别
        acctSystem: this.choosedSystem, //会计体系
        acctEbkNum: this.choosedBook, //账簿编号
        acctYearStart:
          this.chooseMode === "year" && this.choosedPeriod.length
            ? dayjs(this.choosedPeriod[0]).format("YYYY")
            : null, //年份开始
        acctYearEnd:
          this.chooseMode === "year" && this.choosedPeriod.length
            ? dayjs(this.choosedPeriod[1]).format("YYYY")
            : null, //结束月份
        // acctYearMonthStart:
        //   this.chooseMode === "month" && this.choosedPeriod.length
        //     ? dayjs(this.choosedPeriod[0]).format("YYYY-MM")
        //     : null, //开始月份
        // acctYearMonthEnd:
        //   this.chooseMode === "month" && this.choosedPeriod.length
        //     ? dayjs(this.choosedPeriod[1]).format("YYYY-MM")
        //     : null, //结束月份
      };
      this.tableLoading = true;
      const res = await getCompareDataByYear(json);
      this.tableLoading = false;
      console.log("页面内 对比分析表格数据res", res);
      if (res.message === "成功") {
        console.log("message成功 对比分析表格数据", res.data);
        let noMillennialsTableData = cloneDeep(res.data);
        console.log(
          "message成功 noMillennialsTableData",
          noMillennialsTableData
        );
        this.tableData = cloneDeep(res.data);
        const newData = formatDataWithCommas(this.tableData.data);
        this.tableData.data = newData;

        // setTimeout(() => {
        //   this.tableScrollxValue =
        //     this.tableData.columns.length * this.tableData.columns[1].width;
        // }, 200);
        // console.log(
        //   "对比分析表格的宽度tableScrollxValue",
        //   this.tableScrollxValue
        // );
      } else {
        this.$message.error(res.message);
      }
    },

    //展示栏目的全选联动关系
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

    changePeriodRadio() {
      // this.chooseMode = value;
      this.choosedPeriod = [];
    },

    handlePanelChangePeriod(value) {
      this.choosedPeriod = value;
      if (this.chooseMode === "year") {
        if (
          Number(dayjs(this.choosedPeriod[1]).format("YYYY")) -
            Number(dayjs(this.choosedPeriod[0]).format("YYYY")) >
          3
        ) {
          this.choosedPeriod = [];
          return this.$message.warning("年份跨度请控制在3年以内");
        }
      } else if (this.chooseMode === "month") {
        let date1 = dayjs(this.choosedPeriod[0]);
        let date2 = dayjs(this.choosedPeriod[1]);
        const diffMonths = date2.diff(date1, "month");
        if (diffMonths > 3) {
          this.choosedPeriod = [];
          return this.$message.warning("月份跨度请控制在3个月以内");
        }
      }
    },
  },
};
</script>

<style lang="less">
.comparative-analysis {
  width: 100%;
  height: auto;
  &-top {
    width: 100%;
    position: relative;

    .analysis-top-grid {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      grid-template-rows: 32px;
      gap: 20px;

      &-item {
        display: flex;
        align-items: center;

        .ant-select-selection {
          max-height: 32px;
          overflow: auto;
        }

        .item-value {
          flex: 1;
        }
      }
    }

    .analysis-top-single {
      display: flex;
      align-items: center;
      margin-top: 15px;
    }

    .analysis-top-actions {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      // margin-top: 10px;
      // position: absolute;
      // right: 0;
      // bottom: -10px;
    }
  }
  &-cont {
    margin-top: 20px;
    // .analysis-table {
    //   .ant-table-tbody {
    //     width: 100%;
    //     height: calc(100vh - 600px);
    //     overflow-y: auto
    //   }
    // }
  }
}
</style>
