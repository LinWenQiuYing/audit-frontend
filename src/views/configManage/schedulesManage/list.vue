<template>
  <div class="schedules-list">
    <TreeList
      treeTitle="策略分类"
      @getCategoryOptions="getCategoryOptions"
      @getCategoryAllOptions="getCategoryAllOptions"
      @selectedKeyChange="selectedKeyChange"
    />
    <CommonList
      isTitle
      listClass="schedules-list-right"
      className="schedules-table"
      :columns="columns"
      :dataSource="tableValue"
      :pagination="pagination"
      :loading="tableLoading"
      :scroll="{ x: 'max-content', y: 'calc(100vh - 514px)' }"
      bordered
      :rowKey="(record) => record.id"
    >
      <!-- 大标题 -->
      <div slot="tableTitle" class="table-header">
        <div class="table-header-title">策略列表</div>
      </div>
      <template slot="searchOptions">
        <div class="bottom-search-item">
          <span class="item-label">策略编号：</span>
          <a-input
            allow-clear
            class="item-value"
            type="text"
            v-model.trim="schedulesId"
            placeholder="策略编号"
          />
        </div>
        <div class="bottom-search-item">
          <span class="item-label">策略名称：</span>
          <a-input
            allow-clear
            class="item-value"
            type="text"
            v-model.trim="schedulesName"
            placeholder="策略名称"
          />
        </div>
        <div class="bottom-search-item">
          <span class="item-label">策略分类：</span>
          <a-select
            class="item-value"
            v-model="schedulesType"
            placeholder="策略分类"
            :options="categoryAllOptions"
          />
        </div>
        <div class="bottom-search-item">
          <span class="item-label">策略状态：</span>
          <a-select
            class="item-value"
            v-model="schedulesState"
            placeholder="策略状态"
          >
            <a-select-option value="">全部</a-select-option>
            <a-select-option :value="0">启用</a-select-option>
            <a-select-option :value="1">停用</a-select-option>
          </a-select>
        </div>
        <div class="bottom-search-item">
          <span class="item-label">风险等级：</span>
          <a-select
            class="item-value"
            v-model="warningLevel"
            placeholder="风险等级"
          >
            <a-select-option value="">全部</a-select-option>
            <a-select-option :value="1">一级</a-select-option>
            <a-select-option :value="2">二级</a-select-option>
            <a-select-option :value="3">三级</a-select-option>
          </a-select>
        </div>
        <!-- <div class="bottom-search-item">
          <span class="item-label">策略描述：</span>
          <a-input
            allow-clear
            class="item-value"
            type="text"
            v-model.trim="schedulesDesc"
            placeholder="策略描述"
          />
        </div> -->
        <!-- <div class="bottom-search-item">
          <span class="item-label">生成方式：</span>
          <a-select
            class="item-value"
            v-model="createType"
            placeholder="生成方式"
          >
            <a-select-option value="">全部</a-select-option>
            <a-select-option :value="1">配置化</a-select-option>
            <a-select-option :value="2">脚本化</a-select-option>
          </a-select>
        </div> -->
        <div class="bottom-search-item"></div>
        <div class="bottom-search-item"></div>
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
        <a-button class="add-btn" type="primary" @click="handleAdd">
          新建策略
        </a-button>
        <a-button @click="onSearch('repeat')">刷新</a-button>
      </template>
      <template slot="stateText" slot-scope="record">
        <a class="status-cell">
          <img
            :src="
              record.stateText === '启用'
                ? require('@/assets/images/img/status-red.svg')
                : require('@/assets/images/img/status-grey.svg')
            "
          />
          <span class="status-text">{{ record.stateText }}</span>
        </a>
      </template>
      <template slot="checkType" slot-scope="record">
        <div class="slot-test" v-if="record.checkType == 0">
          <div class="slot-test-way">指定时间</div>
          <div class="slot-test-value">{{ record.checkDate }}</div>
        </div>
        <div class="slot-test" v-else-if="record.checkType == 1">
          <div class="slot-test-way">指定周期</div>
          <div class="slot-test-value">
            {{ record.dateNum }}
            {{
              record.cycleUnit == 0 ? "天" : record.cycleUnit == 1 ? "周" : "月"
            }}
          </div>
        </div>
        <div class="slot-test" v-else>
          <div class="slot-test-way">指定频次</div>
          <div class="slot-test-value">
            每{{ record.cycleUnit == 1 ? "周" : "月" }}第{{ record.dateNum }}天
          </div>
        </div>
      </template>
      <div slot="actions" slot-scope="record" class="slot-actions">
        <a-tooltip>
          <template slot="title">
            <span>查看</span>
          </template>
          <a @click="handleCheck(record)">
            <icon-svg icon-class="icon-see" />
          </a>
        </a-tooltip>
        <a-divider type="vertical"></a-divider>
        <a-tooltip>
          <template slot="title">
            <span>编辑</span>
          </template>
          <a
            @click="handleEdit(record)"
            :class="record.status == 0 ? 'disabled' : ''"
          >
            <icon-svg icon-class="icon-edit" />
          </a>
        </a-tooltip>
        <a-divider type="vertical"></a-divider>
        <a-tooltip>
          <template slot="title">
            <span>{{ record.status == 0 ? "停用" : "启用" }}</span>
          </template>
          <a @click="startSchedules(record)">
            <icon-svg icon-class="icon-offline" v-if="record.status == 0" />
            <icon-svg icon-class="icon-online" v-else />
          </a>
        </a-tooltip>
        <a-divider type="vertical"></a-divider>
        <a-tooltip>
          <template slot="title">
            <span>运行历史</span>
          </template>
          <a @click="handleCheckHistory(record)">
            <icon-svg icon-class="icon-check-template" />
          </a>
        </a-tooltip>
        <a-divider type="vertical"></a-divider>
        <!-- <a-tooltip>
          <template slot="title">
            <span>删除</span>
          </template>
          <a
            @click="handleDelete(record)"
            :class="record.status == 0 ? 'disabled' : 'del'"
          >
            <icon-svg icon-class="icon-delete" />
          </a>
        </a-tooltip> -->
      </div>
      <template slot="otherPart">
        <a-drawer
          placement="right"
          :closable="false"
          :visible="drawerVisible"
          @close="onDrawerClose"
          :width="572"
          title="运行历史"
          class="history-drawer"
        >
          <div class="history-drawer-num">
            检测次数：<span class="check-num">{{
              checkTableData.length || "--"
            }}</span
            >次
          </div>
          <a-table
            bordered
            :columns="checkColumns"
            :data-source="checkTableData"
            :pagination="checkPagination"
            :rowKey="(record) => record.index"
            :scroll="{ x: 'max-content', y: 'calc(100vh - 245px)' }"
            class="history-table"
          >
          </a-table>
        </a-drawer>
      </template>
    </CommonList>
  </div>
</template>
<script>
import CommonList from "@/components/commonList";
import {
  delTemplate,
  searchRuleList,
  editWarningRuleStatus,
  getRuleDetails,
  queryRuleHistory,
} from "@/shared/api/configManage.js";
import { modalConfirm, isNumber } from "@/utils/common.js";
import { Button, Divider, Input, Tooltip } from "ant-design-vue";
import TreeList from "../components/treeList.vue";
import moment from "moment";

export default {
  name: "SchedulesList",
  data() {
    return {
      schedulesId: undefined,
      schedulesName: undefined,
      schedulesType: "",
      schedulesState: "",
      warningLevel: "",
      schedulesDesc: undefined,
      categoryAllOptions: [
        {
          label: "全部",
          value: "",
        },
      ],
      tableLoading: false,
      columns: [
        {
          title: "策略编号",
          dataIndex: "id",
          key: "id",
          width: 200,
        },
        {
          title: "策略名称",
          dataIndex: "name",
          key: "name",
          width: 200,
        },
        {
          title: "策略描述",
          dataIndex: "desc",
          key: "desc",
          width: 294,
          // customRender: (text, record, index) => {
          //   if (text) {
          //     return (
          //       <a-tooltip placement="topLeft" overlayClassName="desc-content">
          //         <template slot="title">{text}</template>
          //         {strReduct(text, 16)}
          //       </a-tooltip>
          //     );
          //   } else {
          //     return text;
          //   }
          // },
        },
        {
          title: "策略分类",
          dataIndex: "type",
          key: "type",
          width: 160,
        },
        {
          title: "模型名称",
          dataIndex: "modelName",
          key: "modelName",
          width: 160,
        },
        {
          title: "图谱名称",
          dataIndex: "graphName",
          key: "graphName",
          width: 160,
        },
        // {
        //   title: "生成方式",
        //   dataIndex: "createType",
        //   key: "createType",
        //   width: 160,
        // },
        {
          title: "策略状态",
          dataIndex: "stateText",
          key: "stateText",
          width: 100,
          scopedSlots: { customRender: "stateText" },
        },
        {
          title: "最新更新日期",
          dataIndex: "updateDate",
          key: "updateDate",
          width: 200,
        },
        {
          title: "检测方式",
          dataIndex: "checkType",
          key: "checkType",
          width: 200,
          scopedSlots: { customRender: "checkType" },
        },
        {
          title: "操作",
          dataIndex: "actions",
          key: "actions",
          width: 160,
          scopedSlots: { customRender: "actions" },
          fixed: "right",
        },
      ],
      tableValue: [
        // {
        //   id: "test1",
        //   name: "test",
        //   desc: "test",
        //   type: "test",
        //   modelName: "test",
        //   graphName: "test",
        //   createType: "脚本化",
        //   updateDate: "2020-01-01 00:00:00",
        //   checkType: "test",
        //   stateText: "启用",
        // },
        // {
        //   id: "test2",
        //   name: "test",
        //   desc: "test",
        //   type: "test",
        //   modelName: "test",
        //   graphName: "test",
        //   createType: "配置化",
        //   updateDate: "2020-01-01 00:00:00",
        //   checkType: "test",
        //   stateText: "停用",
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
      drawerVisible: false,
      checkColumns: [
        {
          title: "序号",
          dataIndex: "index",
          key: "index",
          width: 60,
        },
        {
          title: "检测时间",
          dataIndex: "checkTime",
          key: "checkTime",
          width: 80,
        },
        {
          title: "检测情况",
          dataIndex: "checkDesc",
          key: "checkDesc",
          width: 90,
        },
        {
          title: "结果条数",
          dataIndex: "resNum",
          key: "resNum",
          width: 80,
        },
      ],
      checkTableData: [],
      checkPagination: {
        size: "small",
        total: 0,
        current: 1,
        pageSize: 15,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ["5", "10", "15", "20"],
        showTotal: (total, current) => {
          return `共${total}条记录，当前第${Math.ceil(
            current[0] / this.checkPagination.pageSize
          )}页`;
        },
        onChange: (page, pageSize) => {
          this.checkPagination.current = page;
          this.checkPagination.pageSize = pageSize;
          this.handleCheckHistory(this.details);
        },
        onShowSizeChange: (current, size) => {
          this.checkPagination.current = 1;
          this.checkPagination.pageSize = size;
          this.handleCheckHistory(this.details);
        },
      },
      details: {},
    };
  },
  computed: {},
  components: {
    AButton: Button,
    ADivider: Divider,
    AInput: Input,
    ATooltip: Tooltip,
    CommonList,
    TreeList,
  },
  mounted() {
    this.onSearch("init");
  },
  methods: {
    getCategoryAllOptions(value) {
      this.categoryAllOptions = value;
    },
    getCategoryOptions(value) {
      this.$emit("getCategoryOptions", value);
    },
    onDrawerClose() {
      this.drawerVisible = false;
      this.checkPagination.current = 1;
    },
    async onSearch(type) {
      this.tableLoading = true;
      if (type === "init") {
        this.$set(this.pagination, "current", 1);
      }
      const json = {
        id: this.schedulesId,
        warningRuleName: this.schedulesName,
        ruleStatus: this.schedulesState,
        categoryId: this.schedulesType || undefined,
        warningLevel: this.warningLevel || undefined,
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
      };
      try {
        const data = await searchRuleList(json);
        if (!data) {
          this.$message.error("获取策略列表失败！");
        } else {
          this.$set(this.pagination, "total", parseInt(data.totalCount));
          const tableValue = [];
          data.dateList.map((item) => {
            tableValue.push({
              ...item,
              name: item.ruleName,
              desc: item.ruleDesc,
              status: item.ruleStatus,
              type: item.ruleCategory,
              modelName: item.modelName,
              graphName: item.graphBranchChName,
              stateText: item.ruleStatus == 0 ? "启用" : "停用",
              updateDate: item.updateDate || item.createDate,
            });
          });
          this.tableValue = tableValue;
          console.log("🚀 ~ onSearch ~ tableValue:", tableValue);
        }
      } catch (error) {
        console.error(error);
        this.$message.destroy();
        this.$message.error("获取策略列表失败！");
      } finally {
        this.tableLoading = false;
      }
    },
    async handleCheck(record) {
      this.getRuleDetails("check", record);
    },
    async getRuleDetails(type, record) {
      try {
        const detailData = await getRuleDetails(record.id);
        console.log(
          "getRuleDetails",
          detailData,
          isNumber(detailData.cycleUnit)
        );
        if (!detailData) {
          this.$message.error("查询规则详情失败");
          return false;
        }
        const details = {
          id: detailData.id,
          name: detailData.ruleName,
          graphName: detailData.graphChName,
          graphId: [detailData.graphId, detailData.graphBranchId],
          modelName: detailData.ruleModelName,
          modelId: detailData.ruleModelId,
          categoryName: detailData.categoryName,
          categoryId: detailData.categoryId,
          riskLevelText:
            detailData.level === 1
              ? "一级"
              : detailData.level === 2
              ? "二级"
              : detailData.level === 3
              ? "三级"
              : "--",
          riskLevel: detailData.level,
          startStopTime:
            detailData.effectStartDate && detailData.effectEndDate
              ? [
                  moment(detailData.effectStartDate).format("YYYY-MM-DD"),
                  moment(detailData.effectEndDate).format("YYYY-MM-DD"),
                ]
              : [],
          desc: detailData.ruleDesc,
          radioValue: detailData.checkType,
          checkDate: detailData.checkCustomTime
            ? moment(detailData.checkCustomTime).format("YYYY-MM-DD HH:mm:ss")
            : undefined,
          dateNum: detailData.dateNum,
          cycleUnit: isNumber(detailData.cycleUnit)
            ? detailData.cycleUnit
            : undefined,
          data: detailData.twpWarningHeaderVos
            ? detailData.twpWarningHeaderVos.map((item) => {
                return {
                  key: item.headerOrder,
                  paramTypeNode: item.nodeType,
                  paramTypeName: item.labelName,
                  paramIdent: item.specVar,
                  paramField: item.fieldName,
                  fieldAlias: item.headerName,
                };
              })
            : [],
        };
        console.log("details", details);
        this.$emit("detailsChanged", details);
        this.$emit("isDetailsShowChanged", true);
        this.$emit("detailsTypeChanged", type);
      } catch (error) {
        this.$message.destroy();
        this.$message.error("查询规则详情失败");
      }
    },
    async handleEdit(record) {
      if (record.status == 0) return false;
      this.getRuleDetails("edit", record);
    },
    async handleCheckHistory(record) {
      this.details = record;
      const loading = this.$message.loading("正在获取运行历史", 0);
      try {
        const json = {
          pageNo: this.checkPagination.current,
          pageSize: this.checkPagination.pageSize,
          ruleId: record.id,
        };
        const res = await queryRuleHistory(json);
        const checkTableData = [];
        if (res.message === "成功") {
          res.data.map((item, index) => {
            checkTableData.push({
              ...item,
              index: index + 1,
              checkTime: moment(item.execDateTime).format(
                "YYYY-MM-DD HH:mm:ss"
              ),
              checkDesc:
                item.execStatus == 0
                  ? "成功"
                  : item.execStatus == 1
                  ? "执行中"
                  : "失败",
              resNum: item.riskNum || 0,
            });
          });
        } else {
          this.$message.destroy();
          this.$message.error(res.message);
        }
        this.checkTableData = checkTableData;
        this.drawerVisible = true;
      } catch (error) {
        this.$message.destroy();
        this.$message.error("查询规则详情失败");
      } finally {
        loading();
      }
    },
    handleDelete(record) {
      if (record.status == 0) return false;
      const _that = this;
      const title = `确定要删除 ${record.name} 吗？`;
      const onOk = async () => {
        const json = {
          id: record.id,
        };
        const data = await delTemplate(json);
        if (data.message === "成功") {
          _that.$message.success("删除成功");
          _that.onSearch("init");
        } else {
          _that.$message.error(`删除失败，${data.message}`);
        }
      };
      modalConfirm(title, _that, onOk);
    },
    async startSchedules(record) {
      const _that = this;
      const action = record.state === 0 ? "停用" : "启用";
      const title = `确定要${action} ${record.name} 吗？`;
      const onOk = async () => {
        const json = {
          id: record.id,
          status: record.stateText === "启用" ? "1" : "0",
        };
        try {
          const res = await editWarningRuleStatus(json);
          if (res.message === "成功") {
            const message =
              record.stateText === "启用" ? "停用成功" : "启用成功";
            this.$message.success(message);
            this.onSearch("init");
          } else {
            this.$message.error(res.message);
          }
        } catch (error) {
          this.$message.destroy();
          this.$message.error(
            record.stateText === "启用" ? `停用失败` : `启用失败`
          );
        }
      };
      modalConfirm(title, _that, onOk);
    },
    onReset() {
      this.schedulesId = undefined;
      this.schedulesName = undefined;
      this.schedulesType = "";
      this.schedulesState = "";
      this.warningLevel = "";
      this.onSearch("init");
    },
    handleAdd() {
      const details = {
        id: undefined,
        name: undefined,
        graphName: undefined,
        graphId: [],
        modelName: undefined,
        modelId: undefined,
        categoryName: undefined,
        categoryId: undefined,
        riskLevelText: undefined,
        riskLevel: undefined,
        startStopTime: [],
        desc: undefined,
        radioValue: 0,
        checkDate: undefined,
        dateNum: undefined,
        cycleUnit: undefined,
      };
      this.$emit("detailsChanged", details);
      this.$emit("isDetailsShowChanged", true);
      this.$emit("detailsTypeChanged", "add");
    },
    selectedKeyChange(key) {
      this.schedulesType = key;
      this.onSearch("init");
    },
  },
};
</script>
<style lang="less">
.schedules-list {
  height: 100%;
  display: flex;
  padding: 20px;
  background: #fff;

  &-right {
    flex: 1;
    height: 100%;
    border-radius: 5px;
    width: calc(75% - 20px);

    .schedules-table {
      .status-cell {
        display: flex;
        align-items: center;

        img {
          margin-right: 8px;
        }

        .status-text {
          color: #1d2129;
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

        a {
          width: 16px;
          height: 16px;
          display: flex;
          margin: 0 !important;
        }

        .ant-divider {
          top: 2px;
        }
      }
    }
  }
}

.history-drawer {
  .ant-drawer-title {
    font-weight: 600;
  }
  &-num {
    font-size: 16px;
    margin-bottom: 16px;

    .check-num {
      color: @activeFontColor;
    }
  }
}
</style>
