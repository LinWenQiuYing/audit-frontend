<template>
  <div class="graph-list">
    <CommonList
      isTitle
      className="graph-table"
      :columns="columns"
      :dataSource="tableValue"
      :pagination="pagination"
      :loading="tableLoading"
      :scroll="{ x: 'max-content', y: 'calc(100vh - 409px)' }"
      bordered
    >
      <!-- 大标题 -->
      <div slot="tableTitle" class="table-header">
        <div class="table-header-title">图谱列表</div>
      </div>
      <!-- 顶上的选择框 -->
      <template slot="searchOptions">
        <div class="bottom-search-item">
          <div class="item-label">图谱编号：</div>
          <a-input
            v-model.trim="graphCode"
            class="item-value"
            placeholder="请输入图谱编号"
          />
        </div>
        <div class="bottom-search-item">
          <div class="item-label">图谱名称：</div>
          <a-input
            placeholder="请输入图谱名称"
            v-model.trim="graphName"
            class="item-value"
          />
        </div>
        <div class="bottom-search-item">
          <div class="item-label">图谱状态：</div>
          <a-select
            placeholder="请输入图谱状态"
            v-model.trim="graphStatus"
            class="item-value"
            :options="statusList"
          />
        </div>
        <div class="bottom-search-item actions">
          <a-button type="primary" @click="onSearch('init')" class="actions-btn"
            >查询</a-button
          >
          <a-button @click="onReset" class="actions-btn">重置</a-button>
        </div>
      </template>
      <template slot="blueprintName" slot-scope="record">
        <router-link :to="`/blueprint?name=${record.blueprintName}`">{{
          record.blueprintName
        }}</router-link>
      </template>
      <div class="slot-actions" slot="actions" slot-scope="record">
        <a-tooltip v-if="record.status == 0">
          <template slot="title">
            <span>停用图谱</span>
          </template>
          <a @click="handleStop(record)">
            <icon-svg icon-class="icon-offline" />
          </a>
        </a-tooltip>
        <a-tooltip v-else>
          <template slot="title">
            <span>启用图谱</span>
          </template>
          <a @click="handleStop(record)">
            <icon-svg icon-class="icon-online" />
          </a>
        </a-tooltip>

        <a-divider type="vertical"></a-divider>
        <a-tooltip>
          <template slot="title">
            <span>删除图谱</span>
          </template>
          <a
            @click="deleteGraph(record)"
            :class="record.status == 0 ? 'disabled' : ''"
          >
            <icon-svg icon-class="icon-delete" />
          </a>
        </a-tooltip>
        <a-divider type="vertical"></a-divider>
        <a-tooltip>
          <template slot="title">
            <span>查看历史版本</span>
          </template>
          <a @click="checkVersion(record)">
            <icon-svg icon-class="icon-version" />
          </a>
        </a-tooltip>
        <a-divider type="vertical"></a-divider>
        <a-tooltip>
          <template slot="title">
            <span>更新历史</span>
          </template>
          <a @click="getHistory(record)">
            <icon-svg icon-class="icon-history" />
          </a>
        </a-tooltip>
      </div>
      <div class="slot-status" slot="statusText" slot-scope="record">
        <img
          src="@/assets/images/img/success.svg"
          alt=""
          v-if="record.statusText === '启用'"
        />
        <img src="@/assets/images/img/fail.svg" alt="" v-else />
        {{ record.statusText }}
      </div>
    </CommonList>
    <a-modal
      centered
      :width="630"
      :footer="null"
      title="历史版本"
      @cancel="onCancel"
      class="edition-modal"
      :destroyOnClose="true"
      :visible="editionModalShow"
    >
      <div class="edition-modal-content">
        <a-table
          :columns="columns2"
          :data-source="tableValue2"
          :rowKey="(record) => record.id"
          :pagination="pagination2"
          class="edition-table"
          :loading="tableLoading2"
          border
        >
          <!-- :row-selection="rowSelection" -->
          <div class="edition-slot" slot="edition" slot-scope="text, record">
            <span class="edition-slot-text">
              {{ record.edition.value }}
            </span>
            <span class="edition-slot-label" v-if="record.edition.isCurrent">
              当前版本
            </span>
          </div>
          <span slot="actions" slot-scope="record">
            <a
              @click="handleDeleteEdition(record)"
              :class="pagination2.total === 1 ? 'disabled' : ''"
              >删除</a
            >
          </span>
        </a-table>
        <!-- <div class="edition-modal-content-footer">
          <a-button class="footer-btn" @click="onCancel">取消</a-button>
          <a-button class="footer-btn" type="primary" @click="handleSelected"
            >回溯至该版本</a-button
          >
        </div> -->
      </div>
    </a-modal>
  </div>
</template>

<script>
import CommonList from "@/components/commonList";
import {
  queryGraphByPage,
  deleteGraphTable,
  updateStatus,
  selectGraphBranch,
  queryGraphVersion,
  delGraphBranch,
} from "@/shared/api/graphsStructure.js";
import { Button, Divider, Input, Tooltip } from "ant-design-vue";
import { isNumber, modalConfirm } from "@/utils/common.js";

export default {
  name: "BlueprintList",
  data() {
    return {
      tableValue: [
        // {
        //   key: "1",
        //   id: "12345678987654321",
        //   name: "xxxxxxxxx图谱",
        //   desc: "这是一段描述",
        //   createDate: "2024-12-12 12:00:00",
        //   createPerson: "张三",
        //   statusText: "构图成功",
        // },
      ],
      columns: [
        {
          title: "图谱编号",
          dataIndex: "id",
          key: "id",
          width: 226,
        },
        {
          title: "图谱名称",
          dataIndex: "name",
          key: "name",
          width: 240,
        },
        {
          title: "图谱描述",
          dataIndex: "desc",
          key: "desc",
          width: 274,
        },
        {
          title: "蓝图名称",
          dataIndex: "blueprintName",
          key: "blueprintName",
          width: 250,
          scopedSlots: { customRender: "blueprintName" },
        },
        {
          title: "蓝图描述",
          dataIndex: "blueprintDesc",
          key: "blueprintDesc",
          width: 304,
        },
        {
          title: "生成时间",
          dataIndex: "createDate",
          key: "createDate",
          width: 180,
        },
        {
          title: "图谱状态",
          dataIndex: "statusText",
          key: "statusText",
          width: 140,
          scopedSlots: { customRender: "statusText" },
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
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = current;
          this.pagination.pageSize = size;
        },
      },
      tableLoading: false,
      graphCode: undefined,
      graphName: undefined,
      graphStatus: "",
      statusList: [
        {
          label: "全部",
          value: "",
        },
        {
          label: "停用",
          value: 1,
        },
        {
          label: "启用",
          value: 0,
        },
      ],

      tableLoading2: false,
      tableValue2: [],
      columns2: [
        {
          title: "版本号",
          dataIndex: "edition",
          key: "edition",
          width: 258,
          scopedSlots: { customRender: "edition" },
        },
        {
          title: "生成时间",
          dataIndex: "time",
          key: "time",
          width: 180,
          sorter: true,
        },
        // {
        //   title: "操作",
        //   dataIndex: "actions",
        //   key: "actions",
        //   width: 76,
        //   scopedSlots: { customRender: "actions" },
        // },
      ],
      pagination2: {
        size: "small",
        total: 0,
        current: 1,
        pageSize: 5,
        onChange: (page, pageSize) => {
          this.pagination2.current = page;
          this.pagination2.pageSize = pageSize;
          this.getGraphEdition("repeat");
        },
      },
      selectedRowKeys: [],
      editionModalShow: false,
    };
  },
  computed: {
    rowSelection() {
      return {
        type: "radio",
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys) => {
          this.selectedRowKeys = selectedRowKeys;
        },
      };
    },
  },
  components: {
    AButton: Button,
    ADivider: Divider,
    AInput: Input,
    ATooltip: Tooltip,
    CommonList,
  },
  mounted() {
    this.onSearch("init");
  },
  methods: {
    async onSearch(type) {
      if (type === "init") {
        this.$set(this.pagination, "current", 1);
      }
      if (isNumber(this.graphCode)) {
        const reg = /^[0-9]*$/;
        const flag = reg.test(this.graphCode);
        if (!flag) {
          this.$message.error("请输入正确的图谱编号！");
          return false;
        }
      }

      if (this.graphCode && this.graphCode.length > 19) {
        this.$message.error("图谱编号长度不应超过19位！");
        return false;
      }

      const json = {
        id: this.graphCode === "" ? null : this.graphCode,
        graphName: this.graphName === "" ? null : this.graphName,
        status: this.graphStatus,
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
      };
      this.tableLoading = true;
      try {
        const res = await queryGraphByPage(json);
        const tableValue = [];
        if (res.message === "成功" && res.data) {
          this.$set(this.pagination, "total", parseInt(res.data.totalCount));
          res.data.dateList.map((item) => {
            tableValue.push({
              id: item.id,
              name: item.graphChName || "--",
              desc: item.graphDesc || "--",
              status: item.status,
              bluePrintId: item.blueprintId,
              blueprintName: item.blueprintName || item.graphChName || "--", // todo
              blueprintDesc: item.blueprintDesc || item.graphDesc || "--", // todo

              edition: item.graphChName,
              statusText: item.status == "0" ? "启用" : "停用",
              ruleList: item.ruleList.length ? item.ruleList : ["暂无应用"],
              createDate: item.createDate || "--",
              branchId: item.branchId,
            });
          });
          this.tableValue = tableValue;
          console.log("🚀 ~ onSearch ~ tableValue:", tableValue);
        } else {
          this.tableValue = [];
          this.$message.destroy();
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.destroy();
        this.$message.error("获取图谱列表失败");
      } finally {
        this.tableLoading = false;
      }
    },
    onReset() {
      this.graphCode = undefined;
      this.graphName = undefined;
      this.graphStatus = "";
      this.onSearch("init");
    },
    async getGraphEdition(type) {
      if (type === "init") {
        this.$set(this.pagination2, "current", 1);
      }
      const json = {
        id: this.details.id,
        pageNo: this.pagination2.current,
        pageSize: this.pagination2.pageSize,
      };
      this.tableLoading2 = true;
      try {
        const res = await queryGraphVersion(json);
        if (res.message === "成功") {
          const tableValue2 = [];
          res.data.dateList.map((item) => {
            if (item.checkBox) {
              this.selectedRowKeys = [item.id];
            }
            tableValue2.push({
              id: item.id,
              edition: {
                value: item.graphChName,
                isCurrent: item.checkBox,
              },
              graphName: item.graphChName,
              time: item.createDate,
            });
          });
          this.tableValue2 = tableValue2;
          console.log("this.tableValue2", this.tableValue2);
          this.$set(this.pagination2, "total", parseInt(res.data.totalCount));
        } else {
          this.tableValue2 = [];
          this.$message.error(res.message);
        }
      } catch (error) {
        this.tableValue2 = [];
        this.$message.destroy();
        this.$message.error("获取图谱版本列表失败");
      } finally {
        this.tableLoading2 = false;
      }
    },
    async checkVersion(record) {
      this.details = record;
      this.editionModalShow = true;
      this.getGraphEdition("init");
    },
    onCancel() {
      this.editionModalShow = false;
    },
    async handleSelected() {
      if (this.selectedRowKeys[0] === this.details.branchId) {
        // 版本未改变，直接关闭弹窗
        this.onCancel();
      } else {
        const json = {
          id: this.details.id,
          graphChName: this.details.name,
          branchId: this.selectedRowKeys[0],
          graphDesc: this.details.desc,
        };
        const loading = this.$message.loading("正在回溯至该版本", 0);
        try {
          const res = await selectGraphBranch(json);
          if (res.message === "成功") {
            this.$message.success("回溯成功");
            this.onCancel();
          } else {
            this.$message.error(res.message);
          }
        } catch (error) {
          this.$message.destroy();
          this.$message.error("回溯失败");
        } finally {
          loading();
        }
      }
    },
    deleteGraph(record) {
      if (record.status == 0) return false;
      const _that = this;
      const title = `确定要删除 ${record.name} 吗？`;
      const onOk = async () => {
        const json = {
          id: record.id,
        };
        try {
          const res = await deleteGraphTable(json);
          if (res.message === "成功") {
            _that.onSearch("init");
            _that.$message.success("删除成功");
          } else {
            _that.$message.error(res.message);
          }
        } catch (error) {
          _that.$message.destroy();
          _that.$message.error("删除失败");
        }
      };
      modalConfirm(title, _that, onOk);
    },
    handleStop(record) {
      if (record.status != "0" && record.status != "1") return false;
      const _that = this;
      const action = record.status === "0" ? "停用" : "启用";
      const title = `确定要${action} ${record.name} 吗？`;
      const onOk = async () => {
        const json = {
          id: record.id,
          status: record.status == "0" ? "1" : "0",
        };
        try {
          const res = await updateStatus(json);
          if (res.message === "成功") {
            _that.$message.success(`${action}成功`);
            _that.onSearch("init");
          } else {
            _that.$message.error(res.message);
          }
        } catch (error) {
          _that.$message.destroy();
          _that.$message.error(`${action}失败`);
        }
      };
      modalConfirm(title, _that, onOk);
    },
    getHistory(record) {
      this.$emit("detailsChanged", record);
      this.$emit("isDetailShowChanged", true);
    },
    async handleDeleteEdition(record) {
      if (this.pagination2.total === 1) return false;
      const loading = this.$message.loading("正在删除", 0);
      try {
        const _that = this;
        const title = `确定要删除版本 ${record.edition.value} 吗？`;
        const onOk = async () => {
          const json = {
            id: record.id,
          };
          const res = await delGraphBranch(json);
          if (res.message === "成功") {
            _that.getGraphEdition("init");
            _that.$message.success("删除历史版本成功");
          } else {
            _that.$message.error(res.message);
          }
        };
        modalConfirm(title, _that, onOk);
      } catch (error) {
        this.$message.destroy();
        this.$message.error("删除历史版本失败");
      } finally {
        loading();
      }
    },
  },
};
</script>

<style lang="less">
.edition-modal {
  .ant-modal-body {
    padding: 0;
  }
  &-content {
    .edition-table {
      padding: 24px 24px 8px;

      .edition-slot {
        &-text {
          font-size: 14px;
          margin-right: 10px;
          color: @primaryTextColor;
        }

        &-label {
          color: @blue;
          padding: 0 8px;
          font-size: 12px;
          line-height: 20px;
          background: #e6f7ff;
          border: 1px solid #91d5ff;
        }
      }
    }

    &-footer {
      width: 100%;
      height: 52px;
      display: flex;
      padding: 0 24px;
      align-items: center;
      justify-content: flex-end;
      border-top: 1px solid @dividersColor;

      .footer-btn {
        &:first-child {
          margin-right: 8px;
        }
      }
    }
  }
}

.graph-list {
  width: 100%;
  height: 100%;
  padding: 20px;
  background: #fff;

  &-title {
    font-size: 20px;
    font-weight: 600;
    color: @primaryTextColor;
    margin-bottom: 20px;
  }

  &-search {
    gap: 40px;
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    .search-item {
      width: calc((100% - 120px) / 4);
      display: flex;
      align-items: center;

      &.btns {
        justify-content: flex-end;

        .ant-btn {
          margin-left: 10px;
        }
      }

      &-label {
        margin-right: 4px;
      }

      &-input {
        width: 100%;
        flex: 1;
        border-radius: 6px;
      }
    }
  }

  .graph-table {
    .slot-actions {
      display: flex;
      align-items: center;

      a {
        display: flex;
        width: 16px;
        height: 16px;
        margin: 0 !important;
      }

      .ant-divider {
        top: 2px;
      }
    }

    .slot-status {
      img {
        margin-right: 8px;
      }
    }
  }
}

// tooltip样式
.one-line-tooltip {
  min-width: 100px;
}
</style>
