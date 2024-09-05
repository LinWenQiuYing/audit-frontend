<template>
  <div class="risk-warning-graph-details">
    <CommonList
      isTitle
      listClass="risk-warning-graph-details-right"
      className="risk-table"
      :columns="columns"
      :dataSource="tableValue"
      :pagination="pagination"
      :loading="tableLoading"
      :scroll="{ x: 'max-content', y: 'calc(100vh - 574px)' }"
      bordered
      :rowKey="(record) => record.id"
      :row-selection="rowSelection"
    >
      <!-- 大标题 -->
      <div slot="tableTitle" class="table-header">
        <div class="table-header-title">线索列表</div>
      </div>
      <template slot="searchOptions">
        <div class="bottom-search-item">
          <span class="item-label">企业名称：</span>
          <a-input
            allow-clear
            class="item-value"
            v-model.trim="entName"
            placeholder="企业名称"
          />
        </div>
        <div class="bottom-search-item">
          <span class="item-label">所属集团：</span>
          <a-input
            allow-clear
            class="item-value"
            v-model.trim="groupName"
            placeholder="所属集团"
          />
        </div>
        <div class="bottom-search-item">
          <span class="item-label">模型名称：</span>
          <a-input
            allow-clear
            class="item-value"
            v-model.trim="modelName"
            placeholder="模型名称"
          />
        </div>
        <div class="bottom-search-item">
          <span class="item-label">图谱名称：</span>
          <a-input
            allow-clear
            class="item-value"
            v-model.trim="graphName"
            placeholder="图谱名称"
          />
        </div>
        <div class="bottom-search-item">
          <span class="item-label">策略名称：</span>
          <a-select
            class="item-value"
            v-model="ruleId"
            placeholder="策略名称"
            :options="ruleOptions"
            @change="handleChangeRuleId"
          />
        </div>
        <div class="bottom-search-item">
          <span class="item-label">策略最新触发时间：</span>
          <a-select
            class="item-value"
            v-model.trim="ruleTime"
            placeholder="策略最新触发时间"
            :options="timeOptions"
            @change="handleChangeTime"
          >
          </a-select>
        </div>
        <div class="bottom-search-item">
          <span class="item-label">是否展示已忽略线索：</span>
          <a-select
            class="item-value"
            v-model.trim="showIgnore"
            placeholder="请选择"
            :options="ignoreOptions"
          >
          </a-select>
        </div>
        <div class="bottom-search-item actions">
          <a-button
            type="primary"
            @click="onSearch('init')"
            class="actions-btn"
          >
            查询
          </a-button>
          <a-button @click="onReset" class="actions-btn"> 重置 </a-button>
        </div>
      </template>
      <template slot="tableBtns">
        <a-button class="add-btn" @click="filterOne"> 筛选 </a-button>
        <a-button class="add-btn" @click="sortOne"> 排序 </a-button>
        <a-button class="add-btn" @click="handleExport">二维表导出</a-button>
        <a-button
          class="add-btn"
          :disabled="!selectedRowKeys.length"
          @click="handleSkip"
          >图探索</a-button
        >
      </template>
      <div slot="actions" slot-scope="record" class="slot-actions">
        <a
          href="javascript:void(0);"
          :class="record.riskStatus !== '待处理' ? 'disabled' : ''"
          @click="handle(record)"
          >处理</a
        >
        <a
          href="javascript:void(0);"
          :class="record.riskStatus !== '待处理' ? 'disabled' : ''"
          @click="ignore(record)"
          >忽略</a
        >
      </div>

      <template v-slot:otherPart>
        <a-drawer
          :title="modalTitle"
          placement="right"
          :closable="false"
          :visible="warningDetailsVisible"
          @close="onDetailsModalCancel"
          width="1000"
          class="info-details-modal"
        >
          <div class="info-details-top">
            <div class="info-left">
              <div class="info-left-top">
                <div class="info-name">
                  <div class="info-name-top">
                    <div class="top-item">
                      企业名称：<span class="top-text">{{
                        checkedRow.customerName
                      }}</span>
                    </div>
                    <div class="top-item">
                      集团名称：<span class="top-text">{{
                        checkedRow.groupCustomerName
                      }}</span>
                    </div>
                  </div>
                  <div class="info-name-bottom">
                    <span class="info-name-bottom-title">线索ID：</span>
                    <span class="info-name-bottom-content">{{
                      checkedRow.riskFlowId
                    }}</span>
                  </div>
                </div>
              </div>
              <div class="info-left-bottom">
                <!-- <div class="info-left-bottom-item">
                  <p class="item-title">线索类型：</p>
                  <p class="item-content">{{ checkedRow.categoryName }}</p>
                </div> -->
                <div class="info-left-bottom-item">
                  <p class="item-title">线索状态：</p>
                  <p
                    :class="
                      checkedRow.riskStatus === '待处理'
                        ? 'to-handle item-content'
                        : checkedRow.riskStatus === '已处理'
                        ? 'handled item-content'
                        : 'ignored item-content'
                    "
                  >
                    {{ checkedRow.riskStatus }}
                  </p>
                </div>
                <div class="info-left-bottom-item">
                  <p class="item-title">最新触发时间：</p>
                  <p class="item-content">
                    {{ checkedRow.latestTriggerTime }}
                  </p>
                </div>
              </div>
            </div>
            <div class="info-right" v-if="modalTitle === '线索详情'">
              <a-button
                class="info-right-btn"
                type="dashed"
                :disabled="checkedRow.riskStatus === '已忽略'"
                @click="ignore(checkedRow)"
              >
                <a-icon type="stop" />忽略
              </a-button>
              <a-button
                class="info-right-btn"
                type="primary"
                :disabled="checkedRow.riskStatus === '已忽略'"
                @click="checktoSet"
              >
                <a-icon type="edit" />编辑
              </a-button>
            </div>
            <div class="info-right" v-if="modalTitle === '线索处理'">
              <a-button
                class="info-right-btn"
                type="dashed"
                @click="onDetailsModalCancel"
              >
                取消
              </a-button>
              <a-button
                class="info-right-btn"
                type="primary"
                @click="handleSave"
              >
                <a-icon type="save" />保存
              </a-button>
            </div>
          </div>
          <div class="info-details-bottom">
            <div class="info-details-bottom-left">
              <div class="bottom-header left-header">
                <span class="bottom-header-title">线索处理</span>
              </div>
              <div class="left-content">
                <div class="left-content-item">
                  <span class="left-content-item-label">线索信号描述：</span>
                  <div class="left-content-item-content">
                    <span class="warning-desc">{{
                      checkedRow.descriptions
                    }}</span>
                  </div>
                </div>
                <div class="left-content-item">
                  <span class="left-content-item-label">线索等级：</span>
                  <div class="left-content-item-content">
                    <span v-if="modalTitle === '线索详情'">{{
                      checkedRow.level
                    }}</span>
                    <a-select
                      v-if="modalTitle === '线索处理'"
                      v-model="checkedRow.levelValue"
                      placeholder="线索等级"
                      style="width: 120px"
                    >
                      <a-select-option :value="1">一级</a-select-option>
                      <a-select-option :value="2">二级</a-select-option>
                      <a-select-option :value="3">三级</a-select-option>
                    </a-select>
                  </div>
                </div>
                <div class="left-content-item">
                  <span class="left-content-item-label">备注：</span>
                  <div class="left-content-item-content">
                    <!-- <a-list
                      v-if="checkedRow.remarks && checkedRow.remarks.length"
                      item-layout="horizontal"
                      :data-source="checkedRow.remarks"
                    >
                      <a-list-item slot="renderItem" slot-scope="item">
                        <a-list-item-meta :description="item.content">
                          <a slot="title">{{ item.name }}</a>
                        </a-list-item-meta>
                      </a-list-item>
                    </a-list> -->
                    <a-textArea
                      v-model.trim="checkedRow.remarks"
                      class="item-content-input"
                      :auto-size="{ minRows: 3, maxRows: 4 }"
                      placeholder="请输入备注信息"
                    />
                  </div>
                </div>
                <div class="left-content-item">
                  <span class="left-content-item-label">状态：</span>
                  <div class="left-content-item-content">
                    <span v-if="modalTitle === '线索详情'">{{
                      checkedRow.riskStatus
                    }}</span>
                    <a-select
                      v-if="modalTitle === '线索处理'"
                      v-model="editType"
                      style="width: 120px"
                    >
                      <a-select-option value="0">待处理</a-select-option>
                      <a-select-option value="1">已处理</a-select-option>
                    </a-select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-drawer>
        <a-modal
          class="ignore-modal"
          :width="560"
          :visible="showIgnoreModal"
          :closable="false"
          :destroyOnClose="true"
          @ok="confirmIgnore"
          @cancel="onCancel"
          :mask="true"
          :centered="true"
        >
          <p class="ignore-modal-title">
            <a-icon type="exclamation-circle" />是否忽略当前线索？
          </p>
          <!-- <p class="ignore-modal-tips">
            是否最近一段时间内都不再更新该企业的线索信息？忽略之后，您在接下来的一段时间内将不会再收到该企业的线索信息！
          </p>
          <div class="ignore-modal-config">
            <span>忽略周期：</span>
            最近
            <a-input-number
              class="ignore-config-input"
              v-model.trim="warningConfigNum"
              placeholder="请输入数字"
              :min="1"
              :precision="0"
            />
            <a-select v-model="warningConfigUnit" class="ignore-config-input">
              <a-select-option :value="0">天</a-select-option>
              <a-select-option :value="1">月</a-select-option>
            </a-select>
          </div> -->
        </a-modal>

        <!-- 筛选 -->
        <FilterModal
          filterTitle="风险线索筛选配置"
          :filterShow="filterShow1"
          :paramsOption="paramsOption1"
          :tableData="filterTableData1"
          @addTable3="addTable1"
          @delTable3="delTable1"
          @onFilterCancel="onFilterCancel1"
          @onFilterConfirm="onFilterConfirm1"
        ></FilterModal>

        <!-- 排序 -->
        <SortModal
          v-if="sortOptions1.length"
          sortTitle="风险线索排序配置"
          :sortShow="sortShow1"
          @onSortCancel="onSortCancel1"
          @onSortConfirm="onSortConfirm1"
          :sortOptions="sortOptions1"
          firstSortName=""
        ></SortModal>
      </template>
    </CommonList>
  </div>
</template>
<script>
import {
  queryRiskByPage,
  getRiskHistoryName,
  getRiskHistoryList,
  getRiskDetailTable,
  checkRiskDetailTableStatus,
  exportRiskDetailTable,
  riskStatusEdit,
  getRiskSortFilterOptions,
  getRiskWarningDetail,
} from "@/shared/api/riskWarning.js";
import CommonList from "@/components/commonList";
import FilterModal from "@/components/filterModal.vue";
import SortModal from "@/components/sortModal.vue";
import {
  toAffairGraph,
  rescieveMessage,
  downloadFile,
} from "@/utils/common.js";
import { Button, Input, InputNumber, Icon } from "ant-design-vue";
import dayjs from "dayjs";
import { cloneDeep } from "lodash";

export default {
  name: "RiskGraphDetails",
  props: ["details", "riskInfo"],
  data() {
    return {
      entName: undefined,
      groupName: undefined,
      modelName: undefined,
      graphName: undefined,
      ruleId: undefined,
      ruleTime: undefined,
      ruleOptions: [],
      timeOptions: [],
      tableLoading: false,
      baseColumns: [
        {
          title: "企业名称",
          dataIndex: "entName",
          key: "entName",
          width: 200,
        },
        {
          title: "所属集团",
          dataIndex: "groupName",
          key: "groupName",
          width: 200,
        },
        {
          title: "线索ID",
          dataIndex: "riskId",
          key: "riskId",
          width: 270,
        },
        {
          title: "线索状态",
          dataIndex: "riskStatus",
          key: "riskStatus",
          width: 120,
        },
        {
          title: "策略名称",
          dataIndex: "ruleName",
          key: "ruleName",
          width: 160,
        },
        {
          title: "模型名称",
          dataIndex: "modelName",
          key: "modelName",
          width: 130,
        },
        {
          title: "图谱名称",
          dataIndex: "graphName",
          key: "graphName",
          width: 180,
        },
        {
          title: "最近触发时间",
          dataIndex: "latestTriggerTime",
          key: "latestTriggerTime",
          width: 180,
        },
        {
          title: "线索等级",
          dataIndex: "riskLevel",
          key: "riskLevel",
          width: 120,
        },
        {
          title: "操作",
          dataIndex: "actions",
          key: "actions",
          width: 140,
          scopedSlots: { customRender: "actions" },
          fixed: "right",
        },
      ],
      columns: [
        {
          title: "企业名称",
          dataIndex: "entName",
          key: "entName",
          width: 200,
        },
        {
          title: "所属集团",
          dataIndex: "groupName",
          key: "groupName",
          width: 200,
        },
        {
          title: "线索ID",
          dataIndex: "riskId",
          key: "riskId",
          width: 270,
        },
        {
          title: "线索状态",
          dataIndex: "riskStatus",
          key: "riskStatus",
          width: 120,
        },
        {
          title: "策略名称",
          dataIndex: "ruleName",
          key: "ruleName",
          width: 160,
        },
        {
          title: "模型名称",
          dataIndex: "modelName",
          key: "modelName",
          width: 130,
        },
        {
          title: "图谱名称",
          dataIndex: "graphName",
          key: "graphName",
          width: 180,
        },
        {
          title: "最近触发时间",
          dataIndex: "latestTriggerTime",
          key: "latestTriggerTime",
          width: 180,
        },
        {
          title: "线索等级",
          dataIndex: "riskLevel",
          key: "riskLevel",
          width: 120,
        },
        {
          title: "操作",
          dataIndex: "actions",
          key: "actions",
          width: 140,
          scopedSlots: { customRender: "actions" },
          fixed: "right",
        },
      ],
      tableValue: [],
      pagination: {
        size: "small",
        total: 0,
        current: 1,
        pageSize: 15,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ["5", "10", "15", "20"],
        showTotal: (total, current) => {
          return `共${total}条记录，当前第${Math.ceil(
            current[0] / this.pagination.pageSize
          )}页`;
        },
        onChange: (page, pageSize) => {
          this.pagination.current = page;
          this.pagination.pageSize = pageSize;
          this.onSearch("repeat");
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = 1;
          this.pagination.pageSize = size;
          this.onSearch("repeat");
        },
      },
      selectedRowKeys: [],
      isReady: false,
      targetWindow: null,
      params: {},
      modalTitle: "",
      warningDetailsVisible: false,
      checkedRow: {
        customerName: "",
        groupCustomerName: "",
        riskStatus: null,
        level: null,
        levelValue: null,
        descriptions: "",
        latestTriggerTime: null,
        riskFlowId: null,
        type: null,
        id: null,
      },
      editType: null,
      warningConfig: 0,
      warningConfigNum: 1,
      warningConfigUnit: 0,
      remarkInputShow: false,
      addRemarkContent: "",
      showIgnoreModal: false,

      //排序
      sortShow1: false,
      sortStringOne: "",
      //排序选项
      sortOptions1: [],

      //筛选
      filterShow1: false,
      filterConfirmArrOne: "",
      //筛选选项
      paramsOption1: [],
      filterTableData1: [],

      showIgnore: 0,
      ignoreOptions: [
        {
          value: "",
          label: "全部",
        },
        {
          value: 0,
          label: "否",
        },
        {
          value: 1,
          label: "是",
        },
      ],
    };
  },
  computed: {
    rowSelection() {
      return {
        columnWidth: 70,
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys) => {
          this.selectedRowKeys = selectedRowKeys;
        },
        getCheckboxProps: (record) => ({
          props: {
            disabled: record.key === 0 || record.key === 1,
            name: record.name,
          },
        }),
      };
    },
    tableName() {
      console.log(
        "🚀 ~ tableName ~ tableName:",
        this.ruleTime,
        this.timeOptions
      );
      if (this.ruleTime && this.timeOptions.length) {
        const target = this.timeOptions.find(
          (item) => item.label === this.ruleTime
        );
        if (target) {
          return target.tableName;
        } else {
          return undefined;
        }
      } else {
        return undefined;
      }
    },
  },
  components: {
    AButton: Button,
    AIcon: Icon,
    AInput: Input,
    ATextArea: Input.TextArea,
    AInputNumber: InputNumber,
    CommonList,
    FilterModal,
    SortModal,
  },
  beforeDestroy() {
    window.removeEventListener("message", this.rescieveMessage);
  },
  async mounted() {
    // 监听信息
    window.addEventListener("message", this.rescieveMessage);

    console.log("details", this.details, this.riskInfo);
    this.ruleId = this.details.ruleId;
    this.ruleTime = this.details.createDate;
    if (this.riskInfo.ruleId) {
      // 从全量搜索跳转过来
      this.ruleId = this.riskInfo.ruleId;
      this.ruleTime = this.riskInfo.execDateTime;
      this.modelName = this.riskInfo.modelName;
      this.graphName = this.riskInfo.graphName;
    }
    await this.getRiskHistoryName();
    await this.getRiskHistoryList();
    this.handleChangeTime();
    // this.onSearch("init"); // sortModal会在初始化的时候调用，这里就不需要调用了
  },
  methods: {
    async getTableFilterOptions() {
      try {
        const res = await getRiskSortFilterOptions(this.tableName);
        if (res.message === "成功") {
          this.paramsOption1 = res.data;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.destroy();
        this.$message.error("获取线索筛选选项失败");
      }
    },
    async getTableSortOptions() {
      try {
        const res = await getRiskSortFilterOptions(this.tableName);
        if (res.message === "成功") {
          this.sortOptions1 = res.data;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.destroy();
        this.$message.error("获取线索排序选项失败");
      }
    },
    async getRiskHistoryName() {
      try {
        const res = await getRiskHistoryName();
        if (res.message === "成功") {
          this.ruleOptions = res.data.map((item) => ({
            label: item.ruleName,
            value: item.ruleId,
          }));
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.destroy();
        this.$message.error("获取线索列表失败");
      }
    },
    handleChangeRuleId() {
      this.ruleTime = undefined;
      this.getRiskHistoryList();
    },
    handleChangeTime() {
      console.log("this.tableName", this.tableName);
      this.getTableFilterOptions();
      this.getTableSortOptions();
    },
    async getRiskHistoryList() {
      const json = {
        ruleId: this.ruleId,
      };
      try {
        const res = await getRiskHistoryList(json);
        if (res.message === "成功") {
          this.timeOptions = res.data.map((item) => ({
            value: dayjs(item.execDateTime).format("YYYY-MM-DD HH:mm:ss"),
            tableName: item.detailTableName,
            label: dayjs(item.execDateTime).format("YYYY-MM-DD HH:mm:ss"),
          }));
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.destroy();
        this.$message.error("获取线索列表失败");
      }
    },
    async onSearch(type) {
      this.tableLoading = true;
      if (type === "init") {
        this.$set(this.pagination, "current", 1);
      }
      if (!this.ruleId) {
        this.$message.info("请选择策略名称");
        return false;
      }
      if (!this.ruleTime) {
        this.$message.info("请选择最新触发时间");
        return false;
      }
      const json = {
        company: this.entName,
        companyGroup: this.groupName,
        modelName: this.modelName,
        ruleId: this.ruleId,
        graphName: this.graphName,
        execDateTime: this.ruleTime,
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
        querySubSql: this.filterConfirmArrOne,
        sortSubSql: this.sortStringOne,
        isIgnore: this.showIgnore === "" ? undefined : this.showIgnore,
        // ruleName
        // currentUser
        // id
        // totalNum: 61,
      };
      try {
        const res = await queryRiskByPage(json);
        this.$set(this.pagination, "total", parseInt(res.data.totalCount));
        const tableValue = [];
        this.columns = cloneDeep(this.baseColumns);
        // 先重置columns，再给tableValue赋值
        const extendMap0 = res.data.dateList[0].extendMap;
        const addColumns = [];
        for (let key in extendMap0) {
          if (
            key !== "warning_id" &&
            key !== "企业名称" &&
            key !== "所属集团"
          ) {
            addColumns.push({
              title: key,
              dataIndex: key,
              key: key,
              width: 120,
            });
          }
        }
        this.columns.splice(-1, 0, ...addColumns);
        console.log("🚀 ~ onSearch ~ this.columns:", this.columns, addColumns);
        res.data.dateList.map((item) => {
          const extendMap = item.extendMap;
          const obj = {
            ...item,
            riskId: item.id,
            riskStatus:
              item.isIgnore == 1
                ? "已忽略"
                : item.status == "0"
                ? "待处理"
                : "已处理",
            entName: item.company,
            groupName: item.companyGroup,
            graphName: item.graphBranchChName,
            latestTriggerTime: item.triggerTime,
            riskLevel:
              item.level === 1
                ? "一级"
                : item.level === 2
                ? "二级"
                : item.level === 3
                ? "三级"
                : "--",
            ...extendMap,
          };
          tableValue.push(obj);
        });
        this.tableValue = tableValue;
      } catch (error) {
        this.$message.destroy();
        this.$message.error("获取线索列表失败，请重试");
      } finally {
        this.tableLoading = false;
      }
    },
    onReset() {
      this.entName = undefined;
      this.groupName = undefined;
      this.modelName = undefined;
      this.graphName = undefined;
      this.ruleId = undefined;
      this.ruleTime = undefined;
      this.onSearch("init");
    },
    filterOne() {
      this.filterShow1 = true;
    },
    onFilterCancel1() {
      this.filterShow1 = false;
    },
    onFilterConfirm1(filterConfirmArrOne) {
      this.filterConfirmArrOne = filterConfirmArrOne;
      this.onSearch("init");
      this.onFilterCancel1();
    },
    addTable1(json) {
      this.filterTableData1 = [...this.filterTableData1, json];
    },
    delTable1(arr) {
      this.filterTableData1 = arr;
    },
    sortOne() {
      this.sortShow1 = true;
    },
    onSortCancel1() {
      this.sortShow1 = false;
    },
    onSortConfirm1(sortStringOne) {
      this.sortStringOne = sortStringOne;
      this.onSearch("init");
      this.onSortCancel1();
    },
    handleSkip() {
      console.log("this.selectedRowKeys", this.selectedRowKeys);
      const kgBluePrintId = this.tableValue[0].kgBluePrintId;
      const kgBranchId = this.tableValue[0].kgBranchId;
      const graph_name = this.tableValue[0].graphBranchChName;
      const json = {
        kgBranchId,
        kgBluePrintId,
        graph_name,
        clueIds: this.selectedRowKeys,
      };
      toAffairGraph(this, json);
    },
    rescieveMessage(e) {
      rescieveMessage(e, this);
    },
    async handleExport() {
      try {
        const json = {
          company: this.entName,
          companyGroup: this.groupName,
          // currentUser
          execDateTime: this.ruleTime,
          graphName: this.graphName,
          // id
          modelName: this.modelName,
          pageNo: this.pagination.current,
          pageSize: this.pagination.pageSize,
          // querySubSql,
          ruleId: this.ruleId,
          // ruleName
          // sortSubSql
          // totalNum: 61,
        };
        const res1 = await getRiskDetailTable(json);
        if (res1.message === "成功") {
          const key = res1.data;
          try {
            const timer = setInterval(async () => {
              const res2 = await checkRiskDetailTableStatus(key);
              if (res2.message === "成功") {
                // res2.data："0"下载中"1"已完成下载"-1"失败
                if (res2.data === "1") {
                  clearInterval(timer);
                  try {
                    const res3 = await exportRiskDetailTable(key);
                    downloadFile(
                      res3,
                      "AUDIT企业策略测试1723363680098_1723429556792.xls"
                    );
                  } catch (error) {
                    this.$message.destroy();
                    this.$message.error("导出二维表失败，请重试");
                  }
                } else if (res2.data === "0") {
                  // this.$message.info("二维表文件正在生成中");
                } else if (res2.data === "-1") {
                  this.$message.destroy();
                  this.$message.error("导出二维表失败，请重试");
                }
              } else {
                this.$message.destroy();
                this.$message.error(res2.message);
              }
            }, 1000);
          } catch (error) {
            this.$message.destroy();
            this.$message.error("获取二维表导出状态失败，请重试");
          }
        } else {
          this.$message.destroy();
          this.$message.error(res1.message);
        }
      } catch (error) {
        this.$message.destroy();
        this.$message.error("生成二维表失败，请重试");
      }
    },
    handle(record) {
      if (record.riskStatus !== "待处理") return;
      this.remarkInputShow = false;
      this.modalTitle = "线索处理";
      this.checkDetail(record);
      this.checkedRow = record;
    },
    async checkDetail(record) {
      const loading = this.$message.loading("正在获取线索详情", 0);
      this.editType = record.status;
      const checkedRow = {
        customerName: "",
        groupCustomerName: "",
        riskStatus: null,
        level: null,
        levelValue: null,
        descriptions: "",
        latestTriggerTime: null,
        riskFlowId: null,
        categoryName: null,
        id: null,
      };
      checkedRow.id = record.id;
      checkedRow.branchId = record.branchId;
      checkedRow.ruleId = record.ruleId;
      checkedRow.customerName = record.company;
      checkedRow.groupCustomerName = record.companyGroup;
      checkedRow.riskStatus = record.riskStatus;
      checkedRow.level = record.riskLevel;
      checkedRow.levelValue = record.level;
      checkedRow.latestTriggerTime = record.latestTriggerTime;
      checkedRow.riskFlowId = record.riskId;
      try {
        let res = await getRiskWarningDetail(record.id);
        if (res.message === "成功") {
          checkedRow.categoryName = res.data.category_name;
          checkedRow.warningConfig = res.data.ignore || 0;
          checkedRow.warningConfigNum = res.data.ignoreNum;
          checkedRow.warningConfigUnit = res.data.ignoreTimeUnit;
          checkedRow.ignoreTimeUnitStr = res.data.ignoreTimeUnitStr;
          this.warningConfig = res.data.ignore || 0;
          this.warningConfigNum = res.data.ignoreNum || 1;
          this.warningConfigUnit = res.data.ignoreTimeUnit || 0;
          checkedRow.descriptions = res.data.risk_path;
          // const remarks = [];
          // res.data.dealMemos.map((item) => {
          //   if (item.trim() !== "") {
          //     remarks.push({
          //       name: "",
          //       content: item,
          //       src: "",
          //     });
          //   }
          // });
          checkedRow.remarks = res.data.memo;
          this.checkedRow = checkedRow;
          this.warningDetailsVisible = true;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.destroy();
        this.$message.error("获取线索详情失败，请重试");
      } finally {
        loading();
      }
    },
    ignore(record) {
      if (record.riskStatus !== "待处理") return;
      // todo
      this.showIgnoreModal = true;
      this.checkedRow = record;
    },
    async handleSave(status) {
      console.log("this.checkedRow", this.checkedRow);
      if (this.saving) return false;
      this.saving = true;
      const loading = this.$message.loading("正在操作", 0);
      let info = {
        id: this.checkedRow.id,
        branchId: this.checkedRow.branchId,
        ruleId: this.checkedRow.ruleId,
        status: this.editType,
      };
      if (status == "2") {
        info.isIgnore = 1;
      } else {
        info.memo = this.checkedRow.remarks;
        this.level = this.checkedRow.levelValue;
      }
      try {
        const data = await riskStatusEdit(info);
        if (data.message === "成功") {
          this.$message.success("操作成功");
          this.onDetailsModalCancel();
          this.onSearch("init");
        } else {
          this.$message.error(data.message);
        }
      } catch (error) {
        this.$message.destroy();
        this.$message.error("操作失败");
      } finally {
        this.saving = false;
        loading();
      }
    },
    checktoSet() {
      this.modalTitle = "线索处理";
      this.editType = this.checkedRow.status;
      this.remarkInputShow = false;
      this.warningDetailsVisible = true;
    },
    onDetailsModalCancel() {
      this.warningDetailsVisible = false;
      this.checkedRow = {};
      this.addRemarkContent = "";
      this.warningConfig = 0;
      this.warningConfigNum = 1;
      this.warningConfigUnit = 0;
    },
    async confirmIgnore() {
      this.handleSave("2");
      this.showIgnoreModal = false;
    },
    onCancel() {
      this.showIgnoreModal = false;
    },
    handleAddRemark() {
      this.remarkInputShow = true;
    },
  },
};
</script>
<style lang="less">
.risk-warning-graph-details {
  height: 100%;
  display: flex;
  padding: 20px;
  background: #fff;

  &-right {
    flex: 1;
    height: 100%;
    border-radius: 5px;
    width: calc(75% - 20px);

    .risk-table {
      .status-cell {
        display: flex;
        align-items: center;

        img {
          margin-right: 8px;
        }
      }

      .way-slot {
        &-item {
          font-size: 12px;
          padding: 2px 10px;
        }
      }

      .item-config {
        color: @cyan;
        background: #e6fffb;
        border: 1px solid #87e8de;
      }

      .item-sql {
        color: @blue;
        background: #e6f7ff;
        border: 1px solid #91d5ff;
      }

      .slot-actions {
        display: flex;

        // a {
        //   width: 16px;
        //   height: 16px;
        //   display: flex;
        //   margin: 0 !important;
        // }
      }
    }
  }
}

.info-details-modal {
  .ant-drawer-content-wrapper {
    padding: 0;
    bottom: 0;
    top: 0 !important;
    right: 0 !important;

    .ant-drawer-content {
      height: 100%;

      .ant-drawer-header {
        .ant-drawer-title {
          font-weight: 600;
          font-size: 18px;
        }
      }

      .ant-drawer-body {
        padding: 0;
        overflow: auto;
        background: #f8fbff;
        height: calc(100% - 55px);

        .info-details-top {
          height: 190px;
          position: relative;
          background: #fff;
          margin-bottom: 20px;
          padding: 24px 24px 0 24px;

          .info-left {
            width: 70%;
            height: 100%;
            display: inline-block;

            &-top {
              overflow: hidden;
              margin-bottom: 25px;

              .info-name {
                // width: calc(100% - 80px);
                // float: right;

                &-top {
                  padding: 4px 0;
                  display: flex;
                  align-items: center;
                  font-size: 18px;

                  .top-item {
                    margin-right: 24px;
                    color: #515a6e;
                  }

                  .top-text {
                    font-size: 18px;
                    font-weight: 600;
                    color: #000;
                    margin-right: 10px;
                  }

                  img {
                    width: 15px;
                    height: 15px;
                  }

                  .ant-btn-group {
                    margin-left: 20px;

                    .ant-btn {
                      height: 22px;
                      padding: 0 8px;
                    }
                  }
                }

                &-bottom {
                  font-size: 16px;

                  &-title {
                    color: #515a6e;
                  }

                  &-content {
                    color: #949dad;
                  }
                }
              }
            }

            &-bottom {
              display: flex;

              &-item {
                margin-right: 100px;
                font-size: 16px;

                .item-title {
                  color: #515a6e;
                }

                .item-content {
                  color: #949dad;
                }
                .to-handle {
                  color: #fa8c16;
                }

                .handled {
                  color: #52c41a;
                }

                .ignored {
                  color: @disabledColor;
                }
              }
            }
          }

          .info-right {
            top: 45px;
            right: 24px;
            position: absolute;

            &-btn {
              margin-left: 10px;
              height: 36px;
            }
          }
        }

        .info-details-bottom {
          height: calc(100% - 230px);
          display: flex;
          justify-content: space-between;

          &-left {
            width: 100%;
            height: 100%;
            background: #fff;
          }

          &-right {
            margin-right: 20px;
            background: #fff;
            width: calc(35% - 40px);
          }

          .bottom-header {
            background: #fdfdfd;
            border: 2px solid #e7e7e9;
            border-left: none;
            height: 40px;

            &.left-header {
              padding: 0 16px;
              border-left: 2px solid #e7e7e9;

              .bottom-header-title {
                border-left: 2px solid #e7e7e9;
              }
            }

            &-title {
              line-height: 37px;
              padding: 0 24px;
              font-size: 16px;
              margin-top: -2px;
              font-weight: 600;
              background: #fff;
              display: inline-block;
              border-top: 3px solid @activeFontColor;
              border-right: 2px solid #e7e7e9;
            }
          }

          .left-content {
            padding: 24px;
            height: calc(100% - 40px);
            overflow: auto;

            &-item {
              display: flex;
              line-height: 32px;
              margin-bottom: 10px;

              &-label {
                width: 100px;
                color: #515a6e;
              }

              &-content {
                width: calc(100% - 100px);
                color: #949dad;
                max-height: 180px;
                overflow: auto;

                .ant-radio-group {
                  margin-bottom: 10px;
                }

                .item-content-input.ant-input {
                  // color: #949dad;
                }

                .warning-config-input {
                  width: 120px;
                  margin: 0 10px;
                }

                .ant-list-split {
                  &:not(:last-child) {
                    margin-bottom: 10px;
                  }

                  .ant-list-item {
                    border-bottom: none;
                    padding: 6px 0;

                    .ant-list-item-meta-content {
                      display: flex;
                    }
                  }
                }

                .add-remarks-btn {
                  cursor: pointer;
                  color: @activeFontColor;

                  .anticon-form {
                    margin-right: 5px;
                  }
                }

                .warning-desc {
                  white-space: break-spaces;
                }
              }
            }
          }

          .right-content {
            padding: 24px;
            overflow: auto;
            position: relative;
            height: calc(100% - 40px);

            .no-record {
              top: 50%;
              left: 50%;
              position: absolute;
              transform: translate(-50%, -50%);
            }

            &-item {
              padding-top: 10px;

              &-time {
                width: 190px;
                height: 28px;
                font-size: 13px;
                padding: 0 10px;
                color: #666867;
                line-height: 28px;
                text-align: center;
                border-radius: 14px;
                background: #f1f5fb;

                .time-dot {
                  width: 10px;
                  height: 10px;
                  margin-right: 5px;
                  border-radius: 50%;
                  background: #666867;
                  display: inline-block;
                }
              }

              &-box {
                display: flex;
                padding-top: 16px;
                padding-left: 30px;
                position: relative;

                .user-avatar {
                  width: 24px;
                  height: 24px;
                  margin-right: 24px;
                  border-radius: 12px;
                  border: 1px solid #eee;

                  &::before {
                    top: 0;
                    left: 41px;
                    content: "";
                    width: 1px;
                    height: 16px;
                    position: absolute;
                    background: #e1e7e3;
                  }
                }

                &:not(:last-child) .user-avatar::after {
                  top: 41px;
                  left: 41px;
                  content: "";
                  width: 1px;
                  position: absolute;
                  background: #e1e7e3;
                  height: calc(100% - 40px);
                }

                .box-right {
                  width: calc(100% - 48px);

                  .user-name {
                    color: #000;
                    margin-bottom: 10px;
                  }

                  .user-action {
                    overflow: auto;
                    color: #949dad;
                    max-height: 100px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

.ignore-modal {
  &-title {
    font-weight: 600;
    font-size: 16px;
    display: flex;
    align-items: center;
    margin-bottom: 18px;

    .anticon-exclamation-circle {
      color: #faad14;
      font-size: 20px;
      margin-right: 10px;
    }
  }

  &-tips {
    padding-left: 30px;
    line-height: 22px;
    margin-bottom: 40px;
  }

  &-config {
    padding-left: 30px;

    .ignore-config-input {
      width: 120px;
      margin-right: 10px;
    }
  }

  .ant-modal-footer {
    border: none;
    padding: 24px;
  }
}
</style>
