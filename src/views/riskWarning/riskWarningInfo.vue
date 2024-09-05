<template>
  <div class="risk-warning-layout">
    <!-- <MainContent title="线索推送" /> -->
    <div class="condition-count">
      <div class="condition-count-item">
        <div class="item-left">
          <icon-svg icon-class="icon_count1" class="icon-count1" />
        </div>
        <div class="item-right">
          <div class="count-num">
            {{ classifyCounts.entCount }}
          </div>
          <span>涉及企业数量</span>
        </div>
      </div>
      <div class="condition-count-item">
        <div class="item-left">
          <icon-svg icon-class="icon_count2" class="icon-count2" />
        </div>
        <div class="item-right">
          <div class="count-num">
            {{ (pagination.total && pagination.total.toLocaleString()) || 0 }}
          </div>
          <span>线索数量统计</span>
        </div>
      </div>
      <div class="condition-count-item">
        <div class="item-left">
          <icon-svg icon-class="icon_count3" class="icon-count3" />
        </div>
        <div class="item-right">
          <div class="count-num">
            {{ classifyCounts.riskInfo }}
          </div>
          <span>当月新增线索</span>
        </div>
      </div>
    </div>
    <div class="risk-warning-rules">
      <div class="rules-left">
        <div class="warning-title">
          <span>线索类型分类</span>
          <!-- <div class="warning-icon">
          <a-icon
            type="plus-square"
            class="plus"
            @click="
              (e) => {
                addList(e, '全部');
              }
            "
          />
          <a-icon
            type="folder-add"
            class="folder"
            @click="
              (e) => {
                addFolder(e);
              }
            "
          />
        </div> -->
          <!-- <div class="change-btn">
          <a-radio-group
            class="result-radio"
            v-model="resultType"
            @change="onResultTypeChange"
          >
            <a-radio-button value="1"> SQL </a-radio-button>
            <a-radio-button value="2"> 图 </a-radio-button>
          </a-radio-group>
        </div> -->
        </div>
        <div>
          <a-tree
            show-icon
            :default-expanded-keys="['全部']"
            :treeData="treeList"
            :icon="getIcon"
            blockNode
            selectable
            @select="onSelect"
          >
            <template slot="folder" slot-scope="item">
              <div class="tree-view-item">
                <span class="tree-view-left">{{ item.label }}</span>
              </div>
            </template>
            <template slot="leaf" slot-scope="item">
              <div class="tree-view-item">
                <span
                  class="tree-view-left"
                  :title="item.label + `(${item.count}条)`"
                  >{{ item.label }}({{ item.count }}条)</span
                >
              </div>
            </template>
          </a-tree>
        </div>
      </div>
      <div class="risk-warning-info rules-right">
        <div class="info-options">
          <div class="info-options-item info-input">
            <span class="item-label"
              >线索企业:
              <a-tooltip placement="top" overlayClassName="item-title-tooltip">
                <template slot="title">
                  <span
                    >支持多个企业的精确查询，输入多个企业名称，以竖线|分割</span
                  >
                </template>
                <a-icon type="info-circle" />
              </a-tooltip>
            </span>

            <a-input
              type="text"
              class="warning-id-input"
              v-model.trim="customerName"
              placeholder="请输入"
              allow-clear
            />
          </div>
          <div class="info-options-item info-input">
            <span class="item-label">线索企业所属集团：</span>
            <a-input
              type="text"
              class="warning-id-input"
              v-model.trim="customerGroup"
              placeholder="请输入"
              allow-clear
            />
          </div>
          <div class="info-options-item info-input">
            <span class="item-label"
              >关联企业:
              <a-tooltip placement="top" overlayClassName="item-title-tooltip">
                <template slot="title">
                  <span
                    >支持多个企业的精确查询，输入多个企业名称，以竖线|分割</span
                  >
                </template>
                <a-icon type="info-circle" />
              </a-tooltip>
            </span>
            <a-input
              type="text"
              class="warning-id-input"
              v-model.trim="relateName"
              placeholder="请输入"
              allow-clear
            />
          </div>
          <div class="info-options-item info-input">
            <span class="item-label">关联企业所属集团：</span>
            <a-input
              type="text"
              class="warning-id-input"
              v-model.trim="relateGroup"
              placeholder="请输入"
              allow-clear
            />
          </div>
          <!-- <div class="info-options-item common-item">
          <span class="item-label">规则类型：</span>
          <a-select v-model="warningClass" placeholder="请选择规则类型">
            <a-select-option
              v-for="item in warningClassList"
              :key="item.value"
              :value="item.value"
              :title="item.label"
              >{{ item.label }}</a-select-option
            >
          </a-select>
        </div> -->
          <!-- <div class="info-options-item common-item" v-if="resultType === '1'">
            <span class="item-label">生成方式：</span>
            <a-select v-model="modeValue" placeholder="请选择生成方式">
              <a-select-option :value="0">配置化</a-select-option>
              <a-select-option :value="1">SQL</a-select-option>
            </a-select>
          </div> -->
          <div class="info-options-item info-btn">
            <a-button type="primary" @click="onSearch('init')" icon="search">
              搜索
            </a-button>
            <a-button @click="onReset" class="reset-btn">
              <a-icon type="redo" :rotate="-90" /> 重置
            </a-button>
          </div>
        </div>
        <div class="batch-action">
          <div class="batch-action-num">
            批量删除 | 已选择<span class="text-blue">{{
              selectedRowKeys.length
            }}</span
            >条数据
          </div>
          <div class="info-options-item info-btn batch-action-btn">
            <a-button @click="deleteBatch" class="reset-btn">
              批量删除
            </a-button>
            <a-button type="primary" @click="onSearchBatch()">
              批量展示
            </a-button>
          </div>
        </div>
        <div class="info-table" :style="{ height: `calc(100% - 101px)` }">
          <!-- <a-radio-group
        class="result-radio"
        v-model="resultType"
        @change="onResultTypeChange"
      >
        <a-radio-button value="1"> SQL结果 </a-radio-button>
        <a-radio-button value="2"> 图谱结果 </a-radio-button>
      </a-radio-group> -->

          <table-component
            :rowKey="(record) => record.id"
            :columns="columns"
            :data-source="tableValue"
            :pagination="pagination"
            :loading="tableLoading"
            class="risk-warning-table"
            :row-selection="rowSelection"
          >
            <div slot="modeValue" slot-scope="record" class="way-slot">
              <span
                class="way-slot-item item-config"
                v-if="record.modeValue === 0"
                >配置化</span
              >
              <span class="way-slot-item item-sql" v-else>SQL</span>
            </div>
            <span slot="actions" slot-scope="record" class="actions">
              <a @click="checkDetail(record)">查看</a>
              <a @click="handleSkip(record)" v-if="resultType === '2'">探索</a>
              <a @click="deleteResult(record)">删除</a>
            </span>
            <a class="state-cell" slot="state" slot-scope="record">
              <a-badge
                :status="
                  record.state === '待处理'
                    ? 'error'
                    : record.state === '已处理'
                    ? 'success'
                    : 'default'
                "
                :text="record.state"
              />
            </a>
          </table-component>
        </div>

        <a-drawer
          title="线索详情"
          placement="right"
          :visible="drawerVisible"
          @close="onDrawerClose"
          :width="checkDatas.length <= 1 ? 400 : 1296"
          class="result-detail-drawer"
          :bodyStyle="{
            // height: '833px',
            padding: '0',
            overflow: 'hidden',
            overflowX: 'scroll',
          }"
        >
          <div class="result-detail-drawer-contents">
            <div v-for="checkData in checkDatas" :key="checkData.id">
              <div class="result-detail-drawer-content">
                <div class="sub-title" v-if="!checkData.modeValue">
                  基本信息
                </div>
                <div class="content-item" v-if="!checkData.modeValue">
                  <p class="item-info">
                    <span class="item-info-label">线索企业</span>
                    <span class="item-info-text"
                      ><a
                        @click="toBusinessPortraits(checkData.customerName)"
                        >{{ checkData.customerName }}</a
                      ></span
                    >
                  </p>
                  <p class="item-info">
                    <span class="item-info-label">线索企业所属集团</span>
                    <span class="item-info-text">{{
                      checkData.customerGroup
                    }}</span>
                  </p>
                  <p class="item-info">
                    <span class="item-info-label">关联企业</span>
                    <span class="item-info-text">{{
                      checkData.relateName
                    }}</span>
                  </p>
                  <p class="item-info">
                    <span class="item-info-label">关联企业所属集团</span>
                    <span class="item-info-text">{{
                      checkData.relateGroup
                    }}</span>
                  </p>
                </div>
                <div class="sub-title" v-if="!checkData.modeValue">
                  命中信息
                </div>
                <div class="content-item">
                  <p class="item-info short">
                    <span class="item-info-label">规则类型</span>
                    <span class="item-info-text">{{ checkData.ruleType }}</span>
                  </p>
                  <p class="item-info short">
                    <span class="item-info-label">规则名称</span>
                    <span class="item-info-text">{{ checkData.ruleName }}</span>
                  </p>
                  <p class="item-info short" v-if="!checkData.modeValue">
                    <span class="item-info-label">命中结果</span>
                    <span
                      class="item-info-text"
                      v-if="checkData.modeValue === 0"
                      >{{
                        checkData.conditionCount + "中" + checkData.hitCount
                      }}</span
                    >
                    <span class="item-info-text" v-else>{{
                      checkData.ruleName + "\n" + checkData.warningDetail
                    }}</span>
                  </p>
                </div>
                <div class="result-content" v-if="checkData.modeValue === 0">
                  <condition-group
                    :list="
                      checkDatas.length <= 1 ? rulesGroup : checkData.rulesGroup
                    "
                    :originList="
                      checkDatas.length <= 1 ? rulesGroup : checkData.rulesGroup
                    "
                    :value="[]"
                    :floor="0"
                    :isCondition="false"
                  />
                </div>
                <div class="result-content" v-if="checkData.modeValue === 1">
                  <table-component
                    :columns="detailColumns"
                    :data-source="resultTableData"
                    :pagination="detailPagination"
                    class="detail-table"
                    :rowKey="(record) => record.id"
                    :loading="tableLoading2"
                    :scroll="{ x: 'max-content', y: 'calc(100% - 59px)' }"
                  >
                  </table-component>
                </div>
              </div>
            </div>
          </div>
          <a-button type="primary" @click="onDrawerClose"> 确定 </a-button>
        </a-drawer>
      </div>
    </div>
  </div>
</template>
<script>
import MainContent from "@/components/mainContent";
import TableComponent from "@/components/tableComponent";
import {
  delBulkRiskResult,
  delRiskResult,
  queryAbRiskResultByPage,
  riskResultConditionHit,
  riskResultDetail,
} from "@/shared/api/auditManage.js";
import { getCategoryList } from "@/shared/api/configManage.js";
import { getWarningList, getWarningPath } from "@/shared/api/riskWarning";
import { getRulesGroup, modalConfirm } from "@/utils/common.js";
import ConditionGroup from "@/views/auditMode/components/conditionGroup";
import {
  Badge,
  Button,
  Icon,
  Input,
  Radio,
  Tooltip,
  Tree,
} from "ant-design-vue";
import { find } from "lodash";
import moment from "moment";
import { nanoid } from "nanoid";
import { mapState } from "vuex";

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

export default {
  name: "RiskWarningInfo",
  data() {
    return {
      treeList: [
        {
          title: "全部",
          key: "全部",
          level: 0,
          children: [],
        },
      ],
      warningClass: undefined,
      customerName: undefined,
      customerGroup: undefined,
      relateName: undefined,
      relateGroup: undefined,
      columns: [
        // {
        //   title: "线索/流水号",
        //   dataIndex: "riskFlowId",
        //   key: "riskFlowId",
        //   align: "center",
        //   width: 110,
        // },
        {
          title: "线索企业",
          dataIndex: "customerName",
          key: "customerName",
          align: "center",
          width: 180,
        },
        {
          title: "线索企业所属集团",
          dataIndex: "customerGroup",
          key: "customerGroup",
          align: "center",
          width: 180,
        },
        {
          title: "关联企业",
          dataIndex: "relateName",
          key: "relateName",
          align: "center",
          width: 160,
        },
        {
          title: "关联企业所属集团",
          dataIndex: "relateGroup",
          key: "relateGroup",
          align: "center",
          width: 180,
        },
        {
          title: "最新触发时间",
          dataIndex: "lastTime",
          key: "lastTime",
          align: "center",
          width: 180,
        },
        {
          title: "生成方式",
          dataIndex: "modeValue",
          key: "modeValue",
          width: 100,
          align: "center",
          scopedSlots: { customRender: "modeValue" },
        },
        {
          title: "操作",
          key: "actions",
          dataIndex: "actions",
          align: "center",
          scopedSlots: { customRender: "actions" },
          width: 135,
        },
      ],
      tableValue: [],
      pagination: {
        size: "small",
        total: 0,
        current: parseInt(sessionStorage.getItem("warningInfoCurrent")) || 1,
        pageSize: parseInt(sessionStorage.getItem("warningInfoPageSize")) || 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ["5", "10", "15", "20", "50"],
        showTotal: (total, current) => {
          return `共${total}条记录，当前第${Math.ceil(
            current[0] / this.pagination.pageSize
          )}页`;
        },
        onChange: (page, pageSize) => {
          this.pagination.current = page;
          this.pagination.pageSize = pageSize;
          sessionStorage.setItem("warningInfoCurrent", page);
          sessionStorage.setItem("warningInfoPageSize", pageSize);
          this.onSearch("replace");
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = 1;
          this.pagination.pageSize = size;
          sessionStorage.setItem("warningInfoCurrent", current);
          sessionStorage.setItem("warningInfoPageSize", size);
          this.onSearch("replace");
        },
      },
      warningClassList: [],
      graphRuleClassOptions: [],
      SQLRuleClassOptions: [],
      tableLoading: true,
      warningRule: undefined,
      modeValue: 0,
      resultType: "1",
      drawerVisible: false,
      modalVisible: false,
      checkData: {},
      checkDatas: [],
      detailPagination: {
        size: "small",
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ["5", "10", "15", "20"],
        showTotal: (total, current) => {
          return `共${total}条记录，当前第${Math.ceil(
            current[0] / this.detailPagination.pageSize
          )}页`;
        },
        onChange: (page, pageSize) => {
          this.detailPagination.current = page;
          this.detailPagination.pageSize = pageSize;
          this.checkDetail(this.checkData, "repeat");
        },
        onShowSizeChange: (current, size) => {
          this.detailPagination.current = 1;
          this.detailPagination.pageSize = size;
          this.checkDetail(this.checkData, "repeat");
        },
      },
      rulesGroup: [],
      resultTableData: [],
      detailColumns: [],
      detailData: [],
      tableLoading2: false,
      selectedRowKeys: [],
    };
  },
  components: {
    ABadge: Badge,
    AButton: Button,
    AIcon: Icon,
    AInput: Input,
    ATree: Tree,
    ATooltip: Tooltip,
    ARadioButton: RadioButton,
    ARadioGroup: RadioGroup,
    ConditionGroup,
    MainContent,
    TableComponent,
  },
  watch: {},
  computed: {
    ...mapState("auditOptions", ["classifyCounts", "paramsObj"]),
    ...mapState("rightsOptions", ["userInfo"]),
    rowSelection() {
      return {
        // key: "1",
        // columnTitle: "选择",
        // columnWidth: 70,
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys) => {
          this.selectedRowKeys = selectedRowKeys;
          console.log("this.selectedRowKeys", this.selectedRowKeys);
          console.log("this.tableValue", this.tableValue);
        },
      };
    },
  },
  async mounted() {
    this.getRuleCategory();
    this.onSearch("init");
  },
  beforeDestroy() {
    window.onresize = null;
  },
  methods: {
    async getAllList(value) {
      this.tableLoading = true;
      let resArr = await getWarningList(value);
      if (!resArr) {
        this.$message.error("获取线索信息失败");
        return false;
      }
      this.$set(this.pagination, "total", resArr.totalCount);
      const tableValue = [];
      for (let i = 0; i < resArr.dateList.length; i++) {
        let data = {};
        data.riskFlowId = resArr.dateList[i].riskFlowId;
        data.customerName = resArr.dateList[i].customerName;
        data.ruleType = resArr.dateList[i].warningType;
        data.ruleName = resArr.dateList[i].desc;
        data.lastTime = resArr.dateList[i].triggerTime;
        data.state =
          resArr.dateList[i].status === 1
            ? "已处理"
            : resArr.dateList[i].status === 2
            ? "已忽略"
            : "待处理";
        data.config = [];
        data.actions = [];
        data.warningDetail = resArr.dateList[i].warningDetail;
        data.id = resArr.dateList[i].id;
        data.ecode = resArr.dateList[i].customerId;
        tableValue.push(data);
      }
      this.tableValue = tableValue;
      console.log("tableValue", tableValue);
      this.tableLoading = false;
    },
    async getRuleCategory() {
      // 2022-11-23 关掉一级分类入口，只保留二级分类
      const listData = await getCategoryList(1);
      // const ruleTypeOptions = []; // 统计全部规则分类
      // const ruleOptions = [];
      let warningClassList = []; // 左边侧栏数据
      if (listData && listData.length) {
        warningClassList = listData.map((item) => {
          // if (!item.children.length) {
          //   ruleOptions.push({
          //     value: item.id,
          //     label: item.categoryName,
          //   });
          // }
          const children = item.children.map((ele) => {
            // ruleTypeOptions.push({
            //   value: ele.id,
            //   label: ele.categoryName,
            // });
            return {
              key: ele.id || nanoid(10),
              isLeaf: true,
              level: 2,
              title: ele.categoryName,
              label: ele.categoryName,
              count: ele.count,
              scopedSlots: { title: "leaf" },
            };
          });
          return {
            value: item.id,
            key: item.id,
            label: item.categoryName,
            count: item.count,
            isLeaf: item.children.length ? false : true,
            level: 1,
            children,
            scopedSlots: { title: item.children.length ? "folder" : "leaf" },
          };
        });
        // this.warningClassList = [...list];
        // this.graphRuleClassOptions = [
        //   {
        //     value: "",
        //     label: "全部",
        //   },
        //   ...ruleTypeOptions,
        //   ...ruleOptions,
        // ];
      } else {
        this.$message.error("获取规则分类信息失败");
      }

      // const resData = await getCategoryList(1);
      // if (!resData) {
      //   this.$message.error("获取规则分类失败，请重试");
      //   return false;
      // }
      const SQLRuleClassOptions = [
        {
          label: "全部",
          value: "",
        },
      ];

      // resData.map((item) => {
      //   SQLRuleClassOptions.push({
      //     value: item.id,
      //     label: item.categoryName,
      //   });
      //   this.warningClassList.push({
      //     value: item.id,
      //     key: item.id,
      //     label: item.categoryName,
      //     count: item.count,
      //     isLeaf: true,
      //     level: 1,
      //     scopedSlots: { title: "leaf" },
      //   });
      // });
      this.SQLRuleClassOptions = SQLRuleClassOptions;
      this.$set(this.treeList[0], "children", warningClassList);
      console.log("treeList", this.treeList[0].children);
    },
    async onSearch(type) {
      if (type === "init") {
        this.$set(this.pagination, "current", 1);
      }
      this.tableLoading = true;
      if (this.resultType === "1") {
        const json = {
          customer: this.customerName,
          relEntName: this.relateName,
          entTopName: this.customerGroup,
          relEntTopName: this.relateGroup,
          ruleCategory:
            this.warningClass === "全部" ? undefined : this.warningClass,
          ruleType: this.modeValue,
          ruleName: this.warningRule,
          pageNo: this.pagination.current,
          pageSize: this.pagination.pageSize,
        };
        const res = await queryAbRiskResultByPage(json);
        this.tableLoading = false;
        if (this.modeValue === 0) {
          this.columns = [
            // {
            //   title: "线索/流水号",
            //   dataIndex: "riskFlowId",
            //   key: "riskFlowId",
            //   align: "center",
            //   width: 110,
            // },
            {
              title: "线索企业",
              dataIndex: "customerName",
              key: "customerName",
              align: "center",
              width: 180,
            },
            {
              title: "线索企业所属集团",
              dataIndex: "customerGroup",
              key: "customerGroup",
              align: "center",
              width: 180,
            },
            {
              title: "关联企业",
              dataIndex: "relateName",
              key: "relateName",
              align: "center",
              width: 160,
            },
            {
              title: "关联企业所属集团",
              dataIndex: "relateGroup",
              key: "relateGroup",
              align: "center",
              width: 180,
            },
            {
              title: "最新触发时间",
              dataIndex: "lastTime",
              key: "lastTime",
              align: "center",
              width: 180,
            },
            {
              title: "生成方式",
              dataIndex: "modeValue",
              key: "modeValue",
              width: 100,
              align: "center",
              scopedSlots: { customRender: "modeValue" },
            },
            {
              title: "操作",
              key: "actions",
              dataIndex: "actions",
              align: "center",
              scopedSlots: { customRender: "actions" },
              width: 135,
            },
          ];
        } else {
          this.columns = [
            {
              title: "线索/流水号",
              dataIndex: "riskFlowId",
              key: "riskFlowId",
              align: "center",
              width: 110,
            },
            {
              title: "规则类型",
              dataIndex: "ruleType",
              key: "ruleType",
              width: 120,
            },
            {
              title: "规则名称",
              dataIndex: "ruleName",
              key: "ruleName",
              width: 120,
            },
            {
              title: "生成方式",
              dataIndex: "modeValue",
              key: "modeValue",
              width: 100,
              scopedSlots: { customRender: "modeValue" },
            },
            {
              title: "最新触发时间",
              dataIndex: "lastTime",
              key: "lastTime",
              width: 180,
            },
            {
              title: "操作",
              dataIndex: "actions",
              key: "actions",
              width: 80,
              scopedSlots: { customRender: "actions" },
            },
          ];
        }
        if (res.message === "成功") {
          this.$set(this.pagination, "total", res.data.totalCount);
          this.tableValue = res.data.dateList.map((item) => {
            return {
              id: item.id,
              riskFlowId: item.flowId,
              customerName: item.customer,
              customerGroup: item.entTopName,
              relateName: item.relEntName,
              relateGroup: item.relEntTopName,
              ecode: item.custId,
              ruleType: item.categoryName,
              ruleName: item.ruleName,
              ruleId: item.ruleId,
              modeValue: item.ruleType,
              lastTime: moment(item.triggerDate).format("YYYY-MM-DD HH:mm:ss"),
            };
          });
        }
      } else if (this.resultType === "2") {
        const json = {
          id: null,
          pageNo: this.pagination.current,
          pageSize: this.pagination.pageSize,
          customerName: this.customerName,
          ruleName: this.warningRule,
          warningType: this.warningClass === "全部" ? null : this.warningClass,
        };
        this.tableLoading = false;
        this.columns = [
          {
            title: "线索/流水号",
            dataIndex: "riskFlowId",
            key: "riskFlowId",
            align: "center",
            width: 110,
          },
          {
            title: "企业名称",
            dataIndex: "customerName",
            key: "customerName",
            align: "center",
            width: 100,
          },
          {
            title: "企业ID",
            dataIndex: "ecode",
            key: "ecode",
            align: "center",
            width: 95,
          },
          {
            title: "规则类型",
            dataIndex: "ruleType",
            key: "ruleType",
            align: "center",
            width: 90,
          },
          {
            title: "规则名称",
            dataIndex: "ruleName",
            key: "ruleName",
            align: "center",
            width: 100,
          },
          {
            title: "最新触发时间",
            dataIndex: "lastTime",
            key: "lastTime",
            align: "center",
            width: 105,
          },
          {
            title: "操作",
            key: "actions",
            dataIndex: "actions",
            align: "center",
            scopedSlots: { customRender: "actions" },
            width: 110,
          },
        ];
        this.getAllList(json);
      }
    },
    async checkDetail(record, type) {
      console.log("checkDetail", record);
      this.checkData = record;
      console.log("checkData1", this.checkData);
      if (record.modeValue === 0) {
        // 配置化
        const query = [
          {
            ruleType: 0,
            ruleId: record.ruleId,
            id: record.id,
          },
        ];
        const json = {
          query,
        };
        const loading = this.$message.loading("正在查询", 0);
        const res = await riskResultConditionHit(json);
        loading();
        if (res.message === "成功") {
          this.checkData.hitCount = res.data[0].hitCount;
          this.checkData.conditionList = res.data[0].conditionVos;
          this.checkData.conditionCount = res.data[0].conditionCount;
          this.rulesGroup = getRulesGroup(res.data[0].conditionVos);
          this.checkDatas.push(this.checkData);
          this.drawerVisible = true;
        } else {
          this.$message.error(res.message);
        }
      } else if (record.modeValue === 1) {
        // sql
        if (type !== "repeat") {
          this.$set(this.detailPagination, "current", 1);
        }
        const json = {
          ruleType: 1,
          flowId: record.flowId,
          pageNo: this.detailPagination.current,
          pageSize: this.detailPagination.pageSize,
        };
        const loading = this.$message.loading("正在查询", 0);
        this.tableLoading2 = true;
        const res = await riskResultDetail(json);
        loading();
        this.tableLoading2 = false;
        if (res.message === "成功") {
          this.$set(this.detailPagination, "total", res.data.totalCount);
          const columns = [];
          Object.keys(JSON.parse(res.data.dateList[0].fieldResult)).forEach(
            (key) => {
              columns.push({
                title: key,
                dataIndex: key,
                key: key,
                width: 120,
              });
            }
          );
          this.detailColumns = columns;
          const tableValue = [];
          res.data.dateList.map((item) => {
            tableValue.push(JSON.parse(item.fieldResult));
          });
          this.resultTableData = tableValue;
          this.drawerVisible = true;
        } else {
          this.$message.error(res.message);
        }
      } else {
        // 图谱
        this.checkData = record;
        this.drawerVisible = true;
        // const res = await warningDetailCheck(record.id);
        // console.log("res", res);
      }
    },
    deleteResult(record) {
      const _that = this;
      // const title = `确定要删除 ${record.riskFlowId} 吗？`;
      const title = `确定要删除该线索吗？`;
      const onOk = async () => {
        const loading = _that.$message.loading(`正在删除`, 0);
        const res = await delRiskResult(record.id);
        loading();
        if (res.message === "成功") {
          _that.$message.success(`删除成功`);
          this.onSearch("init");
          // 更新侧栏条数
          const treeList = _that.treeList[0].children;
          treeList.map((item, index) => {
            if (item.children) {
              item.children.map((i, index1) => {
                if (i.label === record.ruleType) {
                  const count = i.count - 1;
                  this.$set(treeList[index].children[index1], "count", count);
                }
              });
            } else {
              if (item.label === record.ruleType) {
                const count = item.count - 1;
                this.$set(treeList[index], "count", count);
              }
            }
          });
          // this.treeList[index].count -= 1;
          // const count = _that.treeList[index].count;
          // this.set(_that.treeList[index], "count", count - 1);
        } else {
          _that.$message.error(`${res.message}`);
        }
      };
      modalConfirm(title, _that, onOk);
    },
    onReset() {
      this.customerName = "";
      this.warningRule = undefined;
      this.warningClass = undefined;
      this.modeValue = 0;
      this.onSearch("init");
    },
    onDrawerClose() {
      this.drawerVisible = false;
      this.checkData = {};
      this.checkDatas = [];
    },
    onModalClose() {
      this.modalVisible = false;
    },
    onResultTypeChange(e) {
      this.resultType = e.target.value;
      this.warningClass = undefined;
      this.warningClassList =
        e.target.value === "1"
          ? this.SQLRuleClassOptions
          : this.graphRuleClassOptions;
      console.log("this.warningClassList", this.warningClassList);
      this.onSearch("init");
    },
    async handleSkip(record) {
      if (this.process) {
        return false;
      }
      this.process = true;
      const loading = this.$message.loading("正在获取路径信息", 0);
      const json = {
        id: record.id,
        customerName: record.customerName,
      };
      const data = await getWarningPath(json);
      loading();
      this.process = false;
      if (!data) {
        this.$message.error("获取线索信息路径失败");
        return false;
      }
      const params = {
        branchId: "16056ae7-4a99-4654-b410-50891d2d306c",
        pathData: data,
        token: "test-token",
      };
      // 接收消息
      // window.addEventListener("message", (e) => {
      //   console.log("接收到了！", e.data);
      // });
      // 发送消息
      const targetWindow = window.open("http://172.16.232.35:9002/");
      setTimeout(() => {
        targetWindow.postMessage(
          JSON.stringify(params),
          "http://172.16.232.35:9002"
        );
      }, 3000);
    },
    getIcon(props) {
      const { isLeaf, expanded } = props;
      if (isLeaf) {
        return <a-icon type="file" />;
      }
      return <a-icon type={expanded ? "folder-open" : "folder"} />;
    },
    async onSelect(selectedKeys, e) {
      console.log("onSelect", selectedKeys, e.node);
      e.node.onExpand();
      // this.treeData = {
      //   parent: e.node.$parent.dataRef,
      //   children: e.node.dataRef,
      // };
      if (selectedKeys[0] !== "全部") {
        if (!e.node.isLeaf) {
          // 点击的是分类
          if (!selectedKeys.length) {
            this.warningClass = "全部";
          } else {
            this.warningClass = selectedKeys[0];
          }
          this.warningRule = undefined;
        } else {
          // 点击的是规则名
          if (!selectedKeys.length) {
            this.warningClass = "全部";
            this.warningRule = undefined;
          } else {
            const target = find(
              e.node.$parent.dataRef.children,
              (v) => v.key === selectedKeys[0]
            );
            console.log("target", target);
            this.warningRule = target.label;
            this.warningClass = e.node.$parent.dataRef.key;
          }
        }
      } else {
        this.warningClass = "全部";
        this.warningRule = undefined;
      }
      this.onSearch("init");
    },
    toBusinessPortraits(customerName) {
      const token = this.userInfo.token;
      this.drawerVisible = false;
      this.checkDatas = [];
      this.$router.push({
        name: "businessPortraits",
        params: {
          token,
          corpName: customerName,
        },
      });

      // window.open(
      //   `http://10.83.70.215:8069/audit-mode/business-portraits?token=${token}&corpName=${this.checkData.customerName}`
      // );
    },
    async deleteBatch() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.info("请勾选批量删除企业");
        return;
      }
      const _that = this;
      const title = `确定要批量删除线索吗？`;
      const onOk = async () => {
        const loading = _that.$message.loading(`正在删除`, 0);
        const res = await delBulkRiskResult(_that.selectedRowKeys);
        loading();
        if (res.message === "成功") {
          _that.$message.success(`删除成功`);
          _that.selectedRowKeys = [];
          this.onSearch("init");
          //更新侧栏条数
          this.getRuleCategory();
        } else {
          _that.$message.error(`${res.message}`);
        }
      };
      modalConfirm(title, _that, onOk);
    },
    async onSearchBatch() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.info("请勾选批量展示企业");
        return;
      }
      const query = [];
      const checkDatas = [];
      this.checkDatas = [];
      this.tableValue.map((item) => {
        if (this.selectedRowKeys.indexOf(item.id) !== -1) {
          query.push({
            ruleType: 0,
            ruleId: item.ruleId,
            id: item.id,
          });
          checkDatas.push(item);
        }
      });
      const json = { query };
      console.log("json", json);
      console.log("checkDatas", checkDatas);
      const loading = this.$message.loading("正在查询", 0);
      const res = await riskResultConditionHit(json);
      loading();
      if (res.message === "成功") {
        console.log("res", res);
        const checkData = res.data.map((item, index) => {
          // const data = this.tableValue.find((v) => v.id === item.id);
          // console.log("data", data);
          return {
            hitCount: item.hitCount,
            conditionList: item.conditionVos,
            conditionCount: item.conditionCount,
            rulesGroup: getRulesGroup(item.conditionVos),
            ...checkDatas[index],
          };
        });
        this.checkDatas = checkData;
        console.log("this.checkDatas", this.checkDatas);
        // this.checkData.hitCount = res.data.hitCount;
        // this.checkData.conditionList = res.data.conditionVos;
        // this.checkData.conditionCount = res.data.conditionCount;
        // this.rulesGroup = getRulesGroup(res.data.conditionVos);
        // this.drawerVisible = true;
        this.drawerVisible = true;
      } else {
        this.$message.error(res.message);
      }

      this.selectedRowKeys = [];
    },
  },
};
</script>
<style lang="less">
.risk-warning-layout {
  width: 100%;
  height: 100%;

  .condition-count {
    height: 104px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    &-item {
      height: 104px;
      width: calc((100% - 48px) / 3);
      background: url("~@/assets/images/img/condition_bottom.png") no-repeat
        right;
      margin: 0px 0px 0px 24px;
      background-color: #ffffff;
      display: flex;
      align-items: center;

      &:first-child {
        margin: 0;
      }
      .item-left {
        width: 72px;
        height: 72px;
        margin: 24px;
      }
      .item-right {
        .count-num {
          font-family: "DIN Alternate";
          font-style: normal;
          font-weight: 700;
          font-size: 36px;
        }
        span {
          font-size: 16px;
          color: @secondaryTextColor;
        }
      }
    }
  }

  .risk-warning-rules {
    height: calc(100% - 104px);
  }

  .risk-warning-info {
    width: 100%;
    background: #fff;
    padding: 16px;
    border-radius: 5px;
    position: relative;
    height: 100%;
    // box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.16);

    .info-options {
      display: flex;
      align-items: center;
      height: auto;
      flex-wrap: wrap;

      &-item {
        margin-bottom: 16px;

        &.common-item {
          max-width: 250px;
          width: 27%;

          .warning-id-input,
          .ant-select {
            width: calc(100% - 130px);
          }
        }

        &.info-btn {
          .ant-btn-primary {
            margin-right: 16px;
          }
        }

        &.date-item {
          width: calc(43% - 64px);
          max-width: 400px;
        }

        &:nth-child(odd) {
          display: flex;
          align-items: center;
          .item-label {
            width: 90px;
          }
          &.info-input {
            width: 18%;
            max-width: 300px;
            min-width: 220px;

            .warning-id-input {
              width: calc(100% - 90px);
            }
          }
        }
        .item-label {
          width: 130px;
          color: #515a6e;
          display: inline-block;
        }

        &:not(:last-child) {
          margin-right: 16px;
        }

        .ant-calendar-picker {
          min-width: 140px;
          width: calc(100% - 80px);
        }

        &.info-input {
          width: 20%;
          max-width: 300px;
          min-width: 220px;

          .warning-id-input {
            width: calc(100% - 130px);
          }
        }

        &.info-search {
          .warning-id-input {
            width: calc(100% - 271px);
          }

          .ant-btn {
            margin-left: 16px;

            &.ant-btn-primary {
              width: 82px;
            }

            &.reset-btn {
              width: 82px;
            }
          }
        }
      }
    }

    .info-table {
      width: 100%;
      margin-top: 5px;
      padding-top: 18px;
      height: calc(100% - 60px);
      border-top: 1px dashed #eee;

      .table-tools {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        justify-content: flex-start;

        .tools-left {
          display: flex;
          align-items: center;

          span {
            color: #949dad;
          }
        }

        .tools-right {
          margin-left: 10px;

          .ant-btn {
            .anticon-download {
              font-size: 16px;
            }
          }
        }
      }

      .result-radio {
        margin-bottom: 18px;
      }

      .risk-warning-table {
        height: 100%;
        // height: calc(100% - 52px);

        .ant-table-body {
          .ant-table-tbody {
            color: #949dad;

            .state-cell {
              display: flex;
              justify-content: center;
              align-items: center;

              .ant-badge {
                .ant-badge-status-dot {
                  width: 10px;
                  height: 10px;
                  top: 0;
                }

                .ant-badge-status-text {
                  color: #949dad;
                }
              }
            }

            .ignored {
              color: #949dad;
              cursor: not-allowed;
            }

            .way-slot {
              &-item {
                font-size: 12px;
                padding: 2px 10px;
              }

              .item-config {
                color: @orange;
                background: #fce7d1;
                border: 1px solid #f7b674;
              }

              .item-sql {
                color: @blue;
                background: #cce2ff;
                border: 1px solid #67a8ff;
              }
            }
          }
        }
      }
    }
  }

  .batch-action {
    display: flex;
    align-items: center;
    &-num {
      color: #8c8c8c;
      margin-bottom: 16px;
      margin-right: 16px;

      .text-blue {
        color: @activeFontColor;
      }
    }
    &-btn {
      display: flex;
      align-items: center;
      .ant-btn-primary {
        margin-left: 8px;
      }
    }
  }
}

.result-detail-drawer {
  .ant-drawer-wrapper-body {
    .ant-drawer-body {
      height: calc(100% - 107px);
      border-bottom: 1px solid #e8e8e8;
      overflow: auto;
      .result-detail-drawer-contents {
        display: flex;

        .result-detail-drawer-content {
          height: 833px;
          width: 400px;
          padding: 16px;
          // margin: 16px 0;
          overflow: auto;

          .content-item {
            // margin-bottom: 24px;

            .item-info {
              display: flex;
              line-height: 21px;
              margin-bottom: 16px;

              &-label {
                width: 120px;
                text-align: left;
                color: @secondaryTextColor;
              }

              &-text {
                margin-left: 16px;
                color: @primaryTextColor;
                width: calc(100% - 136px);
                white-space: break-spaces;
              }

              &.short {
                .item-info-label {
                  // width: 65px;
                  width: 120px;
                }

                .item-info-text {
                  width: calc(100% - 136px);
                }
              }
            }
          }

          .result-content {
            height: calc(100% - 82px);
          }
        }
      }

      .ant-btn {
        position: absolute;
        right: 16px;
        bottom: 10px;
      }
    }
  }
}
</style>
