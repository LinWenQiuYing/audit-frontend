<template>
  <CommonList
    isTitle
    listClass="blueprint-list"
    className="blueprint-table"
    :columns="columns"
    :dataSource="tableValue"
    :pagination="pagination"
    :loading="tableLoading"
    :scroll="{ x: 'max-content', y: 'calc(100vh - 409px)' }"
    bordered
  >
    <!-- 大标题 -->
    <div slot="tableTitle" class="table-header">
      <div class="table-header-title">蓝图列表</div>
    </div>
    <!-- 顶上的选择框 -->
    <template slot="searchOptions">
      <div class="bottom-search-item">
        <div class="item-label">蓝图编号：</div>
        <a-input
          v-model.trim="blueprintCode"
          class="item-value"
          placeholder="请输入蓝图编号"
          allow-clear
        />
      </div>
      <div class="bottom-search-item">
        <div class="item-label">蓝图名称：</div>
        <a-input
          placeholder="请输入蓝图名称"
          v-model.trim="blueprintName"
          class="item-value"
          allow-clear
        />
      </div>
      <div class="bottom-search-item">
        <!-- <div class="item-label">蓝图状态：</div>
        <a-select
          placeholder="请输入蓝图状态"
          v-model.trim="blueprintStatus"
          class="item-value"
          :options="statusList"
          allow-clear
        /> -->
      </div>
      <div class="bottom-search-item actions">
        <a-button type="primary" @click="onSearch('init')" class="actions-btn"
          >查询</a-button
        >
        <a-button @click="onReset" class="actions-btn">重置</a-button>
      </div>
    </template>

    <div class="slot-actions" slot="actions" slot-scope="record">
      <a-tooltip>
        <template slot="title">
          <span>查看详情</span>
        </template>
        <a @click="checkDetail(record, 'check')">
          <icon-svg icon-class="icon-see" />
        </a>
      </a-tooltip>
      <a-divider type="vertical"></a-divider>
      <a-tooltip overlayClassName="one-line-tooltip">
        <template slot="title">
          <span>查看数据资源</span>
        </template>
        <a @click="checkDataResource(record)">
          <icon-svg icon-class="icon-check-data" />
        </a>
      </a-tooltip>
    </div>
    <div class="slot-status" slot="statusText" slot-scope="record">
      <img
        src="@/assets/images/img/success.svg"
        alt=""
        v-if="record.statusText === '构图成功'"
      />
      <img src="@/assets/images/img/fail.svg" alt="" v-else />
      {{ record.statusText }}
    </div>
    <template slot="otherPart">
      <a-drawer
        placement="right"
        :closable="false"
        :visible="drawerVisible"
        @close="onDrawerClose"
        :width="1000"
        class="blueprint-source-drawer"
      >
        <div class="drawer-header">
          <div class="header-title">
            <span class="header-title-label">蓝图名称：</span>
            {{ details.name || "--" }}
          </div>
          <div class="header-title">
            <span class="header-title-label">蓝图编号：</span
            >{{ details.id || "--" }}
          </div>
          <div class="header-title">
            <span class="header-title-label">原始表数量：</span
            >{{ tableValue2.length || "--" }}
          </div>
        </div>
        <a-table
          :columns="columns2"
          :data-source="tableValue2"
          :pagination="false"
          class="source-table"
          :loading="tableLoading2"
          :rowKey="(record) => record.index"
          :scroll="{ x: 'max-content', y: '450px' }"
          bordered
        >
          <div slot="field" slot-scope="text" class="slot-field">
            <a-popover trigger="click" overlayClassName="slot-field-popover">
              <p slot="content">{{ text.join(",") }}</p>
              <div class="slot-field-value">
                {{ text.slice(0, 5).join(",") }}
              </div>
            </a-popover>
          </div>
        </a-table>
      </a-drawer>
    </template>
  </CommonList>
</template>

<script>
import CommonList from "@/components/commonList";
import {
  querySchemaList,
  getSchemaDetail,
  getSchemaSourceDetail,
} from "@/shared/api/graphsStructure.js";
import { Button, Divider, Input, Popover, Tooltip } from "ant-design-vue";
import { isNumber } from "@/utils/common.js";

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
          title: "蓝图编号",
          dataIndex: "id",
          key: "id",
          width: 300,
        },
        {
          title: "蓝图名称",
          dataIndex: "name",
          key: "name",
          width: 400,
        },
        {
          title: "蓝图描述",
          dataIndex: "desc",
          key: "desc",
          width: 554,
        },
        {
          title: "创建时间",
          dataIndex: "createDate",
          key: "createDate",
          width: 220,
        },
        {
          title: "创建人",
          dataIndex: "createPerson",
          key: "createPerson",
          width: 180,
        },
        // {
        //   title: "状态",
        //   dataIndex: "statusText",
        //   key: "statusText",
        //   width: 180,
        //   scopedSlots: { customRender: "statusText" },
        // },
        {
          title: "操作",
          dataIndex: "actions",
          key: "actions",
          width: 120,
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
      blueprintCode: undefined,
      blueprintName: undefined,
      blueprintStatus: "",
      statusList: [
        {
          label: "全部",
          value: "",
        },
        {
          label: "构图成功",
          value: 1,
        },
        {
          label: "构图失败",
          value: 0,
        },
      ],
      drawerVisible: false,
      columns2: [
        {
          title: "序号",
          dataIndex: "index",
          key: "index",
          width: 70,
          align: "center",
        },
        {
          title: "源表名称",
          dataIndex: "sourceName",
          key: "sourceName",
          width: 300,
          align: "center",
        },
        {
          title: "字段",
          dataIndex: "field",
          key: "field",
          width: 576,
          align: "center",
          scopedSlots: { customRender: "field" },
        },
      ],
      tableValue2: [],
      tableLoading2: false,
      details: {},
    };
  },
  components: {
    AButton: Button,
    ADivider: Divider,
    AInput: Input,
    APopover: Popover,
    ATooltip: Tooltip,
    CommonList,
  },
  mounted() {
    // 获取路由中的name参数
    this.blueprintName = this.$route.query.name;
    this.onSearch("init");
  },
  methods: {
    onReset() {
      this.blueprintCode = undefined;
      this.blueprintName = undefined;
      this.blueprintStatus = "";
      this.onSearch("init");
    },
    async checkDataResource(record) {
      this.drawerVisible = true;
      this.details = record;
      try {
        const res = await getSchemaSourceDetail(record.id);
        if (res.message === "成功") {
          this.tableValue2 = res.data.map((item, index) => {
            return {
              ...item,
              index: index + 1,
              sourceName: item.sourceTableName,
              field: item.sourceTableField.split(","),
            };
          });
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.tableValue2 = [];
        this.$message.destroy();
        this.$message.error("查看蓝图源表信息失败");
      }
    },
    onDrawerClose() {
      this.drawerVisible = false;
    },
    async onSearch(type) {
      if (type === "init") {
        this.$set(this.pagination, "current", 1);
      }
      if (isNumber(this.blueprintCode)) {
        const reg = /^[0-9]*$/;
        const flag = reg.test(this.blueprintCode);
        if (!flag) {
          this.$message.error("请输入正确的蓝图编号！");
          return false;
        }
      }

      if (this.blueprintCode && this.blueprintCode.length > 19) {
        this.$message.error("蓝图编号长度不应超过19位！");
        return false;
      }

      const json = {
        id: this.blueprintCode === "" ? null : this.blueprintCode,
        graphName: this.blueprintName === "" ? null : this.blueprintName,
        // status: this.blueprintStatus, // todo kg没有对应字段
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
      };
      this.tableLoading = true;
      try {
        const res = await querySchemaList(json);
        this.$set(this.pagination, "total", parseInt(res.data.totalCount));
        const tableValue = [];
        res.data.dateList.map((item) => {
          tableValue.push({
            id: item.id,
            name: item.graphName,
            desc: item.graphDesc,
            state: item.status,
            statusText:
              item.status == 0
                ? "草稿"
                : item.status == 1
                ? "构图失败"
                : "构图成功", // todo
            createDate: item.createDate,
            createPerson: item.createUser,
          });
        });
        this.tableValue = tableValue;
      } catch (error) {
        this.$message.destroy();
        this.$message.error("获取蓝图列表失败");
      } finally {
        this.tableLoading = false;
      }
    },
    async checkDetail(record, type) {
      console.log("🚀 ~ checkDetail ~ checkDetail:", record, type);
      const loading = this.$message.loading("正在查询", 0);
      try {
        const res = await getSchemaDetail(record.id);
        if (res.message === "成功") {
          const graphData = this.getGraphData(res);
          record.graphData = graphData;
          record.databaseValue = res.data.dataSourceId;
          this.$emit("detailsChanged", record);
          this.$emit("isDetailsShowChanged", true, type);
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.destroy();
        this.$message.error("获取蓝图详情失败");
      } finally {
        loading();
      }
    },
    getGraphData(res) {
      const graphData = {
        nodes: res.data.graphVertex.map((node) => {
          let keyValue = undefined;
          const attrValue = [];
          const attrValueAll = [];
          const tableValue = [];
          node.fields.map((item, index) => {
            attrValue.push(item.tableName + "_" + item.fieldName);
            attrValueAll.push({
              key: item.tableName + "_" + item.fieldName,
              label: item.fieldName,
              parent: item.tableName,
              type: item.fieldType,
            });
            tableValue.push({
              // 新增字段类型
              fieldType: item.fieldType,
              id: item.fieldId,
              tableName: item.tableName,
              fieldName: item.fieldName,
              isShow: item.fieldDisplay === "1" ? true : false,
              key: item.fieldId + "_" + index,
              showName: item.fieldAlias,
              type: item.fieldType,
            });
            if (item.isPk) {
              keyValue = item.tableName + "_" + item.fieldName;
            }
          });
          // const iconValue = (node.icon && node.icon.split(",")) || undefined;
          let fill = null;
          let stroke = null;
          let lineWidth = 0;
          let icon = node.icon
            ? {
                show: true,
              }
            : {
                show: false,
              }; // 如果有图标，则赋值true，如果没有图标，则先赋值false，然后在下面判断结束后更改为true ———— 解决编辑或复制时更换不了图标的bug
          if (node.baseStyle === "2") {
            fill = "#fff";
            stroke = node.color;
            lineWidth = 1.5;
            if (icon && icon.show) {
              icon.width = node.size;
              icon.height = node.size;
              // icon.img =
              //   iconValue.length === 4
              //     ? require(`@/assets/theme/${iconValue[0]}/${iconValue[1]}/${iconValue[2]}/${iconValue[3]}.svg`)
              //     : null;
            } else {
              // 解决编辑或复制时更换不了图标的bug
              icon.show = true;
            }
          } else if (node.baseStyle === "3") {
            if (icon && icon.show) {
              icon.width = node.size;
              icon.height = node.size;
              // icon.img =
              //   iconValue.length === 4
              //     ? require(`@/assets/theme/${iconValue[0]}/${iconValue[1]}/${iconValue[2]}/${iconValue[3]}.svg`)
              //     : null;
            } else {
              // 解决编辑或复制时更换不了图标的bug
              icon.show = true;
            }
          } else {
            // 增加了一个默认颜色
            fill = node.color || "#A876E5";
            stroke = node.color;
            lineWidth = 0;
            if (icon && icon.show) {
              icon.width = node.size;
              icon.height = node.size;
              // icon.img =
              //   iconValue.length === 4
              //     ? require(`@/assets/theme/${iconValue[0]}/${iconValue[1]}/${iconValue[2]}/${iconValue[3]}.svg`)
              //     : null;
            } else {
              // 解决编辑或复制时更换不了图标的bug
              icon.show = true;
            }
          }

          return {
            type: "circle",
            // id: node.id,
            id: node.labelId,
            label: node.label,
            size: node.size,
            icon,
            style: {
              fill,
              stroke,
              lineWidth,
            },
            data: {
              attrValue,
              attrValueAll,
              colorValue: node.color,
              // iconValue,
              inputValue: node.label,
              keyValue,
              sizeValue: node.size,
              styleValue: node.baseStyle,
              tableValue,
            },
          };
        }),
        edges: res.data.graphEdge.map((edge) => {
          let keyValue = undefined;
          const attrValue = [];
          const attrValueAll = [];
          const tableValue = [];
          edge.fields.map((item, index) => {
            attrValue.push(item.tableName + "_" + item.fieldName);
            attrValueAll.push({
              key: item.tableName + "_" + item.fieldName,
              label: item.fieldName,
              parent: item.tableName,
              type: item.fieldType,
            });
            tableValue.push({
              // 新增字段类型
              fieldType: item.fieldType,
              id: index,
              tableName: item.tableName,
              fieldName: item.fieldName,
              startOrEnd:
                item.analyzedFrom === "0"
                  ? "start"
                  : item.analyzedFrom === "1"
                  ? "end"
                  : "",
              isShow: item.fieldDisplay === "1" ? true : false,
              key: item.tableName + "_" + item.fieldName,
              showName: item.fieldAlias,
              type: item.fieldType,
            });
            if (item.isPk) {
              keyValue = item.tableName + "_" + item.fieldName;
            }
          });
          // 增加了默认的样式
          edge.size = edge.size ? edge.size : 1;
          edge.baseStyle = edge.baseStyle ? edge.baseStyle : "1";
          edge.color = edge.color ? edge.color : "rgba(0, 0, 0, 0.45)";
          return {
            type: "line",
            id: edge.id,
            label: edge.label,
            source: edge.srcFieldId,
            target: edge.dstFieldId,
            style: {
              stroke: edge.color,
              lineWidth: edge.size,
              lineDash: edge.baseStyle === "2" ? [5, 5] : [],
            },
            data: {
              attrValue,
              attrValueAll,
              colorValue: edge.color,
              inputValue: edge.label,
              keyValue,
              sizeValue: edge.size,
              styleValue: edge.baseStyle,
              tableValue,
            },
          };
        }),
      };
      return graphData;
    },
  },
};
</script>

<style lang="less">
.blueprint-list {
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

  .blueprint-table {
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

.blueprint-source-drawer {
  .drawer-header {
    margin-bottom: 16px;
  }
}

// tooltip样式
.one-line-tooltip {
  min-width: 100px;
}

.slot-field-popover {
  max-width: 576px;
}
</style>
