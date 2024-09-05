<template>
  <div class="asserts-card">
    <div class="asserts-card-top">
      <div class="top-search-item">
        <div class="item-label">资产所属单位：</div>
        <a-input
          placeholder="请输入"
          v-model.trim="affiliatedUnit"
          class="item-value"
        />
      </div>
      <div class="top-search-item">
        <div class="item-label">主管单位：</div>
        <a-input
          placeholder="请输入"
          v-model.trim="manageUnit"
          class="item-value"
        />
      </div>
      <div class="top-search-item">
        <div class="item-label">业务板块：</div>
        <a-input
          placeholder="请输入"
          v-model.trim="businessUnit"
          class="item-value"
        />
      </div>
      <div class="top-search-item">
        <div class="item-label">国际大类：</div>
        <a-input
          placeholder="请输入"
          v-model.trim="internationalCategories"
          class="item-value"
        />
      </div>
      <div class="top-search-item">
        <div class="item-label">资产编号：</div>
        <a-input
          placeholder="请输入"
          v-model.trim="assertsCode"
          class="item-value"
        />
      </div>
      <div class="top-search-item">
        <div class="item-label">资产主键：</div>
        <a-input
          placeholder="请输入"
          v-model.trim="assetPrimaryKey"
          class="item-value"
        />
      </div>
      <div class="top-search-item">
        <div class="item-label">资产分类：</div>
        <a-input
          placeholder="请输入"
          v-model.trim="assertsType"
          class="item-value"
        />
      </div>
      <div class="top-search-item">
        <div class="item-label">资产大类：</div>
        <a-input
          placeholder="请输入"
          v-model.trim="assertsCategories"
          class="item-value"
        />
      </div>

      <div class="top-search-item">
        <div class="item-label">取得日期：</div>
        <a-range-picker
          v-model="getTime"
          class="item-value"
          :placeholder="['开始日期', '截止日期']"
        >
          <template slot="suffixIcon">
            <a-icon type="calendar" />
          </template>
        </a-range-picker>
      </div>
      <div class="top-search-item">
        <div class="item-label">记账期间：</div>
        <a-range-picker
          v-model="accountingTime"
          class="item-value"
          :placeholder="['开始日期', '截止日期']"
        >
          <template slot="suffixIcon">
            <a-icon type="calendar" />
          </template>
        </a-range-picker>
      </div>
      <!-- <div class="top-search-item">
        <div class="item-label">取得日期：</div>
        <a-date-picker
          v-model="getDay"
          format="YYYY-MM-DD"
          class="item-value"
        />
      </div>
      <div class="top-search-item">
        <div class="item-label">记账日期：</div>
        <a-date-picker
          v-model="writeDay"
          format="YYYY-MM-DD"
          class="item-value"
        />
      </div> -->

      <div class="top-search-item"></div>
      <div class="top-search-item actions">
        <a-button type="primary" class="actions-btn" @click="handleSearch"
          >查询</a-button
        >
        <a-button type="primary" class="actions-btn" @click="reset"
          >重置</a-button
        >
        <a-button type="primary" class="actions-btn" @click="sortBtnDetail">
          <div class="actions-btn-icon">
            <icon-svg icon-class="排序"></icon-svg>
          </div>
          排序
        </a-button>
      </div>
    </div>
    <div class="asserts-card-content">
      <div class="option-tabs">
        <div
          :class="selected === pane.key ? 'option-tab selected' : 'option-tab'"
          v-for="pane in panes"
          :key="pane.key"
          :value="pane.key"
          @click="changeSelected(pane.key)"
        >
          <span class="option-tab-text">{{ pane.title }}</span>
        </div>
      </div>
      <CardList
        :data="cardData"
        iconClass="house"
        cardClass="asserts-card-content-list"
        @lookAssertDetail="lookAssertDetail"
        v-if="selected === 1"
      ></CardList>
      <CardList
        :data="cardData"
        iconClass="car"
        iconBack="card-list-item-top-left-car"
        cardClass="asserts-card-content-list"
        @lookAssertDetail="lookAssertDetail"
        v-if="selected === 2"
      ></CardList>
      <CardList
        :data="cardData"
        iconClass="land"
        iconBack="card-list-item-top-left-land"
        cardClass="asserts-card-content-list"
        @lookAssertDetail="lookAssertDetail"
        v-if="selected === 3"
      ></CardList>
      <CardList
        :data="cardData"
        iconClass="others"
        iconBack="card-list-item-top-left-others"
        cardClass="asserts-card-content-list"
        @lookAssertDetail="lookAssertDetail"
        v-if="selected === 4"
      ></CardList>
      <div class="asserts-card-content-list-pagination">
        <a-pagination
          v-model="current"
          :page-size="pageSize"
          :total="total"
          :pageSizeOptions="pageSizeOptions"
          class="content-item-list-pagination"
          @change="onChange"
          @showSizeChange="onShowSizeChange"
          :show-total="(total, current) => `共${total}条记录`"
          show-size-changer
          show-quick-jumper
        />
      </div>
    </div>

    <!-- 四个排序 -->
    <SortModal
      v-if="sortOptions3.length"
      sortTitle="资产卡片房屋查询排序配置"
      :sortShow="sortShow3"
      @onSortCancel="onSortCancel3"
      @onSortConfirm="onSortConfirm3"
      :sortOptions="sortOptions3"
      firstSortName="资产净值"
    ></SortModal>
    <!-- firstSortName="字段1" -->
    <SortModal
      v-if="sortOptions4.length"
      sortTitle="资产卡片车辆查询排序配置"
      :sortShow="sortShow4"
      @onSortCancel="onSortCancel4"
      @onSortConfirm="onSortConfirm4"
      :sortOptions="sortOptions4"
      firstSortName="资产净值"
    ></SortModal>
    <SortModal
      v-if="sortOptions5.length"
      sortTitle="资产卡片土地查询排序配置"
      :sortShow="sortShow5"
      @onSortCancel="onSortCancel5"
      @onSortConfirm="onSortConfirm5"
      :sortOptions="sortOptions5"
      firstSortName="资产净值"
    ></SortModal>
    <SortModal
      v-if="sortOptions6.length"
      sortTitle="资产卡片其他查询排序配置"
      :sortShow="sortShow6"
      @onSortCancel="onSortCancel6"
      @onSortConfirm="onSortConfirm6"
      :sortOptions="sortOptions6"
      firstSortName="资产净值"
    ></SortModal>

    <!-- 资产情况的抽屉 -->
    <AssertDrawer
      :showDrawer="assertDetailShow"
      :drawerInfo="drawerInfo"
      @closeAssertDrawer="closeAssertDrawer"
    >
    </AssertDrawer>
  </div>
</template>
<script>
import AssertDrawer from "@/components/assertDrawer.vue";
import CardList from "@/components/cardList.vue";
import SortModal from "@/components/sortModal.vue";
import {
  getAssertsTableCar,
  getAssertsTableCarSort,
  getAssertsTableHouse,
  getAssertsTableHouseSort,
  getAssertsTableLand,
  getAssertsTableLandSort,
  getAssertsTableOther,
  getAssertsTableOtherSort,
} from "@/shared/newApi/assertsAnalysis/assertsCard.js";
import {
  Button,
  DatePicker,
  Icon,
  Input,
  // Radio,
  Pagination,
} from "ant-design-vue";
// const SHOW_PARENT = TreeSelect.SHOW_PARENT;
// const { Group } = Radio;
import dayjs from "dayjs";
const { RangePicker } = DatePicker;
export default {
  name: "AssertsCard",
  data() {
    return {
      affiliatedUnit: "", //所属单位
      manageUnit: "", //主管单位
      businessUnit: "", //业务板块
      internationalCategories: "", //国际大类
      assertsCode: "", //资产编号
      assetPrimaryKey: "", //资产主键
      assertsType: "", //资产分类
      assertsCategories: "", //资产大类
      getTime: [], //取得日期
      accountingTime: [], //记账日期

      selected: null,
      panes: [
        {
          title: "房产",
          key: 1,
          //icon: "solution",
        },
        {
          title: "车辆",
          key: 2,
          // icon: "calendar",
        },
        {
          title: "土地",
          key: 3,
          //icon: "dollar",
        },
        {
          title: "其他",
          key: 4,
          // icon: "calendar",
        },
        // {
        //   title: "审计情况",
        //   key: 5,
        //   //icon: "dollar",
        // },
      ],

      //要求返回的
      // data: {
      //   cardData: [
      //     {
      //       id: "1",
      //       zcmc: "资产名称",
      //       zcbh: "资产编号",
      //       zcfl: "资产分类",
      //       ssdw: "所属单位",
      //       jzrq: "记账日期",
      //       zcjz: "资产净值",
      //       other: "其他信息", //房屋为坐落位置；车辆为车牌号；土地为坐落位置；其他不返回该字段
      //     },
      //     {
      //       id: "2",
      //       zcmc: "资产名称",
      //       zcbh: "资产编号",
      //       zcfl: "资产分类",
      //       ssdw: "所属单位",
      //       jzrq: "记账日期",
      //       zcjz: "资产净值",
      //       other: "其他信息", //房屋为坐落位置；车辆为车牌号；土地为坐落位置；其他不返回该字段
      //     },
      //     {
      //       id: "1",
      //       zcmc: "资产名称",
      //       zcbh: "资产编号",
      //       zcfl: "资产分类",
      //       ssdw: "所属单位",
      //       jzrq: "记账日期",
      //       zcjz: "资产净值",
      //       other: "其他信息", //房屋为坐落位置；车辆为车牌号；土地为坐落位置；其他不返回该字段
      //     },
      //     {
      //       id: "2",
      //       zcmc: "资产名称",
      //       zcbh: "资产编号",
      //       zcfl: "资产分类",
      //       ssdw: "所属单位",
      //       jzrq: "记账日期",
      //       zcjz: "资产净值",
      //       other: "其他信息", //房屋为坐落位置；车辆为车牌号；土地为坐落位置；其他不返回该字段
      //     },
      //     {
      //       id: "1",
      //       zcmc: "资产名称",
      //       zcbh: "资产编号",
      //       zcfl: "资产分类",
      //       ssdw: "所属单位",
      //       jzrq: "记账日期",
      //       zcjz: "资产净值",
      //       other: "其他信息", //房屋为坐落位置；车辆为车牌号；土地为坐落位置；其他不返回该字段
      //     },
      //     {
      //       id: "2",
      //       zcmc: "资产名称",
      //       zcbh: "资产编号",
      //       zcfl: "资产分类",
      //       ssdw: "所属单位",
      //       jzrq: "记账日期",
      //       zcjz: "资产净值",
      //       other: "其他信息", //房屋为坐落位置；车辆为车牌号；土地为坐落位置；其他不返回该字段
      //     },
      //     {
      //       id: "1",
      //       zcmc: "资产名称",
      //       zcbh: "资产编号",
      //       zcfl: "资产分类",
      //       ssdw: "所属单位",
      //       jzrq: "记账日期",
      //       zcjz: "资产净值",
      //       other: "其他信息", //房屋为坐落位置；车辆为车牌号；土地为坐落位置；其他不返回该字段
      //     },
      //     {
      //       id: "2",
      //       zcmc: "资产名称",
      //       zcbh: "资产编号",
      //       zcfl: "资产分类",
      //       ssdw: "所属单位",
      //       jzrq: "记账日期",
      //       zcjz: "资产净值",
      //       other: "其他信息", //房屋为坐落位置；车辆为车牌号；土地为坐落位置；其他不返回该字段
      //     },
      //     {
      //       id: "1",
      //       zcmc: "资产名称",
      //       zcbh: "资产编号",
      //       zcfl: "资产分类",
      //       ssdw: "所属单位",
      //       jzrq: "记账日期",
      //       zcjz: "资产净值",
      //       other: "其他信息", //房屋为坐落位置；车辆为车牌号；土地为坐落位置；其他不返回该字段
      //     },
      //     {
      //       id: "2",
      //       zcmc: "资产名称",
      //       zcbh: "资产编号",
      //       zcfl: "资产分类",
      //       ssdw: "所属单位",
      //       jzrq: "记账日期",
      //       zcjz: "资产净值",
      //       other: "其他信息", //房屋为坐落位置；车辆为车牌号；土地为坐落位置；其他不返回该字段
      //     },
      //     {
      //       id: "1",
      //       zcmc: "资产名称",
      //       zcbh: "资产编号",
      //       zcfl: "资产分类",
      //       ssdw: "所属单位",
      //       jzrq: "记账日期",
      //       zcjz: "资产净值",
      //       other: "其他信息", //房屋为坐落位置；车辆为车牌号；土地为坐落位置；其他不返回该字段
      //     },
      //     {
      //       id: "2",
      //       zcmc: "资产名称",
      //       zcbh: "资产编号",
      //       zcfl: "资产分类",
      //       ssdw: "所属单位",
      //       jzrq: "记账日期",
      //       zcjz: "资产净值",
      //       other: "其他信息", //房屋为坐落位置；车辆为车牌号；土地为坐落位置；其他不返回该字段
      //     },
      //     {
      //       id: "1",
      //       zcmc: "资产名称",
      //       zcbh: "资产编号",
      //       zcfl: "资产分类",
      //       ssdw: "所属单位",
      //       jzrq: "记账日期",
      //       zcjz: "资产净值",
      //       other: "其他信息", //房屋为坐落位置；车辆为车牌号；土地为坐落位置；其他不返回该字段
      //     },
      //     {
      //       id: "2",
      //       zcmc: "资产名称",
      //       zcbh: "资产编号",
      //       zcfl: "资产分类",
      //       ssdw: "所属单位",
      //       jzrq: "记账日期",
      //       zcjz: "资产净值",
      //       other: "其他信息", //房屋为坐落位置；车辆为车牌号；土地为坐落位置；其他不返回该字段
      //     },
      //   ],
      //   total: 345,
      // },

      //卡片信息
      cardData: [],
      //卡片分页
      total: 0,
      current: 1,
      pageSize: 20,
      pageSizeOptions: ["20", "50", "100"],
      //资产卡片排序弹框显示
      sortShow3: false,
      sortStringThree: "",
      sortShow4: false,
      sortStringFour: "",
      sortShow5: false,
      sortStringFive: "",
      sortShow6: false,
      sortStringSix: "",
      //排序选项
      sortOptions3: [
        // {
        //   label: "字段1",
        //   value: "字段1",
        // },
      ],
      sortOptions4: [
        // {
        //   label: "字段1",
        //   value: "字段1",
        // },
      ],
      sortOptions5: [
        // {
        //   label: "字段1",
        //   value: "字段1",
        // },
      ],
      sortOptions6: [
        // {
        //   label: "字段1",
        //   value: "字段1",
        // },
      ],

      //抽屉显示
      assertDetailShow: false,
      drawerInfo: "",
    };
  },

  computed: {
    // ...mapState("auditOptions", ["paramsObj"]),
  },
  async mounted() {
    await this.getAssertsTableHouseSort();
    //这边记得在获取完数据之后，再将selected置为1
    // this.cardData = [
    //   {
    //     id: "1",
    //     zcmc: "资产名称",
    //     zcbh: "资产编号",
    //     zcfl: "资产分类",
    //     ssdw: "所属单位",
    //     jzrq: "记账日期",
    //     zcjz: "资产净值",
    //     other: "其他信息", //房屋为坐落位置；车辆为车牌号；土地为坐落位置；其他不返回该字段
    //   },
    //   {
    //     id: "2",
    //     zcmc: "资产名称",
    //     zcbh: "资产编号",
    //     zcfl: "资产分类",
    //     ssdw: "所属单位",
    //     jzrq: "记账日期",
    //     zcjz: "资产净值",
    //     other: "其他信息", //房屋为坐落位置；车辆为车牌号；土地为坐落位置；其他不返回该字段
    //   },
    //   {
    //     id: "1",
    //     zcmc: "资产名称",
    //     zcbh: "资产编号",
    //     zcfl: "资产分类",
    //     ssdw: "所属单位",
    //     jzrq: "记账日期",
    //     zcjz: "资产净值",
    //     other: "其他信息", //房屋为坐落位置；车辆为车牌号；土地为坐落位置；其他不返回该字段
    //   },
    //   {
    //     id: "2",
    //     zcmc: "资产名称",
    //     zcbh: "资产编号",
    //     zcfl: "资产分类",
    //     ssdw: "所属单位",
    //     jzrq: "记账日期",
    //     zcjz: "资产净值",
    //     other: "其他信息", //房屋为坐落位置；车辆为车牌号；土地为坐落位置；其他不返回该字段
    //   },
    //   {
    //     id: "1",
    //     zcmc: "资产名称",
    //     zcbh: "资产编号",
    //     zcfl: "资产分类",
    //     ssdw: "所属单位",
    //     jzrq: "记账日期",
    //     zcjz: "资产净值",
    //     other: "其他信息", //房屋为坐落位置；车辆为车牌号；土地为坐落位置；其他不返回该字段
    //   },
    //   {
    //     id: "2",
    //     zcmc: "资产名称",
    //     zcbh: "资产编号",
    //     zcfl: "资产分类",
    //     ssdw: "所属单位",
    //     jzrq: "记账日期",
    //     zcjz: "资产净值",
    //     other: "其他信息", //房屋为坐落位置；车辆为车牌号；土地为坐落位置；其他不返回该字段
    //   },
    //   {
    //     id: "1",
    //     zcmc: "资产名称",
    //     zcbh: "资产编号",
    //     zcfl: "资产分类",
    //     ssdw: "所属单位",
    //     jzrq: "记账日期",
    //     zcjz: "资产净值",
    //     other: "其他信息", //房屋为坐落位置；车辆为车牌号；土地为坐落位置；其他不返回该字段
    //   },
    //   {
    //     id: "2",
    //     zcmc: "资产名称",
    //     zcbh: "资产编号",
    //     zcfl: "资产分类",
    //     ssdw: "所属单位",
    //     jzrq: "记账日期",
    //     zcjz: "资产净值",
    //     other: "其他信息", //房屋为坐落位置；车辆为车牌号；土地为坐落位置；其他不返回该字段
    //   },
    //   {
    //     id: "1",
    //     zcmc: "资产名称",
    //     zcbh: "资产编号",
    //     zcfl: "资产分类",
    //     ssdw: "所属单位",
    //     jzrq: "记账日期",
    //     zcjz: "资产净值",
    //     other: "其他信息", //房屋为坐落位置；车辆为车牌号；土地为坐落位置；其他不返回该字段
    //   },
    //   {
    //     id: "2",
    //     zcmc: "资产名称",
    //     zcbh: "资产编号",
    //     zcfl: "资产分类",
    //     ssdw: "所属单位",
    //     jzrq: "记账日期",
    //     zcjz: "资产净值",
    //     other: "其他信息", //房屋为坐落位置；车辆为车牌号；土地为坐落位置；其他不返回该字段
    //   },
    //   {
    //     id: "1",
    //     zcmc: "资产名称",
    //     zcbh: "资产编号",
    //     zcfl: "资产分类",
    //     ssdw: "所属单位",
    //     jzrq: "记账日期",
    //     zcjz: "资产净值",
    //     other: "其他信息", //房屋为坐落位置；车辆为车牌号；土地为坐落位置；其他不返回该字段
    //   },
    //   {
    //     id: "2",
    //     zcmc: "资产名称",
    //     zcbh: "资产编号",
    //     zcfl: "资产分类",
    //     ssdw: "所属单位",
    //     jzrq: "记账日期",
    //     zcjz: "资产净值",
    //     other: "其他信息", //房屋为坐落位置；车辆为车牌号；土地为坐落位置；其他不返回该字段
    //   },
    //   {
    //     id: "1",
    //     zcmc: "资产名称",
    //     zcbh: "资产编号",
    //     zcfl: "资产分类",
    //     ssdw: "所属单位",
    //     jzrq: "记账日期",
    //     zcjz: "资产净值",
    //     other: "其他信息", //房屋为坐落位置；车辆为车牌号；土地为坐落位置；其他不返回该字段
    //   },
    //   {
    //     id: "2",
    //     zcmc: "资产名称",
    //     zcbh: "资产编号",
    //     zcfl: "资产分类",
    //     ssdw: "所属单位",
    //     jzrq: "记账日期",
    //     zcjz: "资产净值",
    //     other: "其他信息", //房屋为坐落位置；车辆为车牌号；土地为坐落位置；其他不返回该字段
    //   },
    // ];
    this.selected = 1;
  },
  components: {
    SortModal,
    CardList,
    AssertDrawer,
    // CommonList,
    // ASelect: Select,
    AInput: Input,
    AIcon: Icon,
    AButton: Button,
    ARangePicker: RangePicker,
    APagination: Pagination,
    // APopover: Popover,
    // ARadio: Radio,
    // ARadioGroup: Group,
    // ADatePicker: DatePicker,
    // ATreeSelect: TreeSelect,
  },
  methods: {
    //房屋卡片
    async getAssertsTableHouse() {
      this.cardData = [];
      const json = {
        unitName: this.affiliatedUnit, //资产所属单位
        deptName: this.manageUnit, //主管单位
        blockName: this.businessUnit, //板块名称
        gblargeClass: this.internationalCategories, //国标大类
        assetId: this.assetPrimaryKey, //资产主键
        assetNo: this.assertsCode, //资产编号
        assetName: this.assertsType, //资产分类
        assetLargeClass: this.assertsCategories, //资产大类
        acStartDate: this.getTime.length
          ? dayjs(this.getTime[0]).format("YYYY-MM-DD")
          : null, //取得日期开始时间

        acEndDate: this.getTime.length
          ? dayjs(this.getTime[1]).format("YYYY-MM-DD")
          : null, //取得日期结束时间
        bookStartDate: this.accountingTime.length
          ? dayjs(this.accountingTime[0]).format("YYYY-MM-DD")
          : null, //记账日期起始时间
        bookEndDate: this.accountingTime.length
          ? dayjs(this.accountingTime[1]).format("YYYY-MM-DD")
          : null, //记账日期结束时间
        odName: this.sortStringThree, //排序字段
        pageSize: this.pageSize,
        pageOffset: this.pageSize * (this.current - 1), //偏移量,
      };
      const res = await getAssertsTableHouse(json);
      if (res.message === "成功") {
        console.log("message成功 房屋卡片", res.data);
        this.cardData = res.data.cardData;
        this.total = res.data.total;
      } else {
        this.$message.error(res.message);
      }
    },
    //房产 排序
    async getAssertsTableHouseSort() {
      this.sortOptions3 = [];
      const res = await getAssertsTableHouseSort();
      if (res.message === "成功") {
        console.log("message成功 房屋排序", res.data);
        this.sortOptions3 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //车辆表格
    async getAssertsTableCar() {
      this.cardData = [];
      const json = {
        unitName: this.affiliatedUnit, //资产所属单位
        deptName: this.manageUnit, //主管单位
        blockName: this.businessUnit, //板块名称
        gblargeClass: this.internationalCategories, //国标大类
        assetId: this.assetPrimaryKey, //资产主键
        assetNo: this.assertsCode, //资产编号
        assetName: this.assertsType, //资产分类
        assetLargeClass: this.assertsCategories, //资产大类
        acStartDate: this.getTime.length
          ? dayjs(this.getTime[0]).format("YYYY-MM-DD")
          : null, //取得日期开始时间

        acEndDate: this.getTime.length
          ? dayjs(this.getTime[1]).format("YYYY-MM-DD")
          : null, //取得日期结束时间
        bookStartDate: this.accountingTime.length
          ? dayjs(this.accountingTime[0]).format("YYYY-MM-DD")
          : null, //记账日期起始时间
        bookEndDate: this.accountingTime.length
          ? dayjs(this.accountingTime[1]).format("YYYY-MM-DD")
          : null, //记账日期结束时间
        odName: this.sortStringFour, //排序字段
        pageSize: this.pageSize,
        pageOffset: this.pageSize * (this.current - 1), //偏移量,
      };
      const res = await getAssertsTableCar(json);
      if (res.message === "成功") {
        console.log("message成功 车辆卡片", res.data);
        this.cardData = res.data.cardData;
        this.total = res.data.total;
      } else {
        this.$message.error(res.message);
      }
    },
    //车辆 排序
    async getAssertsTableCarSort() {
      this.sortOptions4 = [];

      const res = await getAssertsTableCarSort();
      if (res.message === "成功") {
        console.log("message成功 车辆排序", res.data);
        this.sortOptions4 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //土地表格
    async getAssertsTableLand() {
      this.cardData = [];
      const json = {
        unitName: this.affiliatedUnit, //资产所属单位
        deptName: this.manageUnit, //主管单位
        blockName: this.businessUnit, //板块名称
        gblargeClass: this.internationalCategories, //国标大类
        assetId: this.assetPrimaryKey, //资产主键
        assetNo: this.assertsCode, //资产编号
        assetName: this.assertsType, //资产分类
        assetLargeClass: this.assertsCategories, //资产大类
        acStartDate: this.getTime.length
          ? dayjs(this.getTime[0]).format("YYYY-MM-DD")
          : null, //取得日期开始时间

        acEndDate: this.getTime.length
          ? dayjs(this.getTime[1]).format("YYYY-MM-DD")
          : null, //取得日期结束时间
        bookStartDate: this.accountingTime.length
          ? dayjs(this.accountingTime[0]).format("YYYY-MM-DD")
          : null, //记账日期起始时间
        bookEndDate: this.accountingTime.length
          ? dayjs(this.accountingTime[1]).format("YYYY-MM-DD")
          : null, //记账日期结束时间
        odName: this.sortStringFive, //排序字段
        pageSize: this.pageSize,
        pageOffset: this.pageSize * (this.current - 1), //偏移量,
      };
      const res = await getAssertsTableLand(json);
      if (res.message === "成功") {
        console.log("message成功 土地卡片", res.data);
        this.cardData = res.data.cardData;
        this.total = res.data.total;
      } else {
        this.$message.error(res.message);
      }
    },

    //土地 排序
    async getAssertsTableLandSort() {
      this.sortOptions5 = [];
      const res = await getAssertsTableLandSort();
      if (res.message === "成功") {
        console.log("message成功 土地排序", res.data);
        this.sortOptions5 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //其他表格
    async getAssertsTableOther() {
      this.cardData = [];
      const json = {
        unitName: this.affiliatedUnit, //资产所属单位
        deptName: this.manageUnit, //主管单位
        blockName: this.businessUnit, //板块名称
        gblargeClass: this.internationalCategories, //国标大类
        assetId: this.assetPrimaryKey, //资产主键
        assetNo: this.assertsCode, //资产编号
        assetName: this.assertsType, //资产分类
        assetLargeClass: this.assertsCategories, //资产大类
        acStartDate: this.getTime.length
          ? dayjs(this.getTime[0]).format("YYYY-MM-DD")
          : null, //取得日期开始时间

        acEndDate: this.getTime.length
          ? dayjs(this.getTime[1]).format("YYYY-MM-DD")
          : null, //取得日期结束时间
        bookStartDate: this.accountingTime.length
          ? dayjs(this.accountingTime[0]).format("YYYY-MM-DD")
          : null, //记账日期起始时间
        bookEndDate: this.accountingTime.length
          ? dayjs(this.accountingTime[1]).format("YYYY-MM-DD")
          : null, //记账日期结束时间
        odName: this.sortStringSix, //排序字段
        pageSize: this.pageSize,
        pageOffset: this.pageSize * (this.current - 1), //偏移量,
      };
      const res = await getAssertsTableOther(json);
      if (res.message === "成功") {
        console.log("message成功 其他卡片", res.data);
        this.cardData = res.data.cardData;
        this.total = res.data.total;
      } else {
        this.$message.error(res.message);
      }
    },
    //其他 排序
    async getAssertsTableOtherSort() {
      this.sortOptions6 = [];
      const res = await getAssertsTableOtherSort();
      if (res.message === "成功") {
        console.log("message成功 其他 排序", res.data);
        this.sortOptions6 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //查询条件重置
    reset() {
      this.affiliatedUnit = ""; //所属单位
      this.manageUnit = ""; //主管单位
      this.businessUnit = ""; //业务板块
      this.internationalCategories = ""; //国际大类
      this.assertsCode = ""; //资产编号
      this.assetPrimaryKey = ""; //资产主键
      this.assertsType = ""; //资产分类
      this.assertsCategories = ""; //资产大类
      this.getTime = []; //取得日期
      this.accountingTime = []; //记账日期
    },

    //查询
    handleSearch() {
      switch (this.selected) {
        case 1:
          this.getAssertsTableHouse();
          break;
        case 2:
          this.getAssertsTableCar();
          break;
        case 3:
          this.getAssertsTableLand();
          break;
        case 4:
          this.getAssertsTableOther();
          break;
        default:
          break;
      }
    },

    //切换tab页面
    changeSelected(val) {
      this.selected = val;
      //发送请求数据，并将pagination重置
      this.resetPagination();
      switch (this.selected) {
        case 1:
          this.getAssertsTableHouseSort();
          break;
        case 2:
          this.getAssertsTableCarSort();
          break;
        case 3:
          this.getAssertsTableLandSort();
          break;
        case 4:
          this.getAssertsTableOtherSort();
          break;
        default:
          break;
      }
    },
    //重置分页器
    resetPagination() {
      this.total = 0;
      this.current = 1;
      this.pageSize = 20;
    },
    onChange(page, pageSize) {
      console.log("修改页面的current", page, pageSize);
      //切换当前页以及跳转到指定页面调用
      this.current = page;
      this.pageSize = pageSize;
      this.handleSearch();
    },
    onShowSizeChange(current, size) {
      console.log("修改页面的pageSize", current, size);
      //修改当前页面展示条数调用
      this.current = current;
      this.pageSize = size;
      this.handleSearch();
    },

    //------资产明细排序按钮
    sortBtnDetail() {
      switch (this.selected) {
        case 1:
          // this.sortBtn1();
          this.sortShow3 = true;
          break;
        case 2:
          // this.sortBtn2();
          this.sortShow4 = true;
          break;
        case 3:
          // this.sortBtn3();
          this.sortShow5 = true;
          break;
        case 4:
          // this.sortBtn4();
          this.sortShow6 = true;
          break;
        default:
          break;
      }
    },

    onSortCancel3() {
      this.sortShow3 = false;
    },
    onSortConfirm3(sortStringThree) {
      this.sortStringThree = sortStringThree;
      this.getAssertsTableHouse();
      this.onSortCancel3();
    },

    onSortCancel4() {
      this.sortShow4 = false;
    },
    onSortConfirm4(sortStringFour) {
      this.sortStringFour = sortStringFour;
      this.getAssertsTableCar();
      this.onSortCancel4();
    },

    onSortCancel5() {
      this.sortShow5 = false;
    },
    onSortConfirm5(sortStringFive) {
      this.sortStringFive = sortStringFive;
      this.getAssertsTableLand();
      this.onSortCancel5();
    },

    onSortCancel6() {
      this.sortShow6 = false;
    },
    onSortConfirm6(sortStringSix) {
      this.sortStringSix = sortStringSix;
      this.getAssertsTableOther();
      this.onSortCancel6();
    },

    //资产详情弹框
    lookAssertDetail(unitCode, assetNo, assetType) {
      //   "unitCode": "050039002",//预算单位编码
      // "assetNo": "FW20100908000126",//资产编号
      // "assetType": "房产" // 房产、土地、车辆、其他
      console.log("点击了", unitCode, assetNo, assetType);
      this.drawerInfo = `${unitCode}+${assetNo}+${assetType}`;
      //发送请求，拿到相应数据
      this.assertDetailShow = true;
    },
    // lookAssertDetail(value) {
    //   let block = "asserts";
    //   let type = this.selected;
    //   //block 所属页面   type:第几个tab页面  value: 相关信息，查询
    //   console.log("点击了", block, type, value);
    //   this.drawerInfo = `${block}+${type}+${value}`;
    //   //发送请求，拿到相应数据
    //   this.assertDetailShow = true;
    // },
    closeAssertDrawer() {
      console.log("子组件触发关闭");
      // this.showDrawer = true;
      //发送请求，拿到相应数据
      this.assertDetailShow = false;
    },
  },
};
</script>
<style lang="less">
.asserts-card {
  width: 100%;
  min-height: 100%;

  &-top {
    display: flex;
    flex-wrap: wrap;
    gap: 16px 40px;
    margin-bottom: 20px;

    .top-search-item {
      width: calc((100% - 120px) / 4); // 默认一行四个，可添加覆盖样式
      display: flex;
      align-items: center;
      justify-content: flex-start;

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
        justify-content: end;

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

  &-content {
    &-list {
      // height: 600px;
      min-height: 300px;
      // overflow-y: scroll;
    }

    &-list-pagination {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }
  }
}
</style>
