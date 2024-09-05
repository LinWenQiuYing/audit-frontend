<template>
  <div class="template-manage-list">
    <TreeList
      treeTitle="模板分类"
      @selectedKeyChange="selectedKeyChange"
      @getCategoryOptions="getCategoryOptions"
    />
    <CommonList
      isTitle
      listClass="template-manage-list-right"
      className="template-table"
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
        <div class="table-header-title">模板列表</div>
      </div>
      <template slot="searchOptions">
        <div class="bottom-search-item">
          <span class="item-label">模板编号：</span>
          <a-input
            allow-clear
            class="item-value"
            type="text"
            v-model.trim="templateId"
            placeholder="模板编号"
          />
        </div>
        <div class="bottom-search-item">
          <span class="item-label">模板名称：</span>
          <a-input
            allow-clear
            class="item-value"
            type="text"
            v-model.trim="templateName"
            placeholder="模板名称"
          />
        </div>
        <div class="bottom-search-item">
          <span class="item-label">创建方式：</span>
          <a-select
            class="item-value"
            v-model="createType"
            placeholder="创建方式"
          >
            <a-select-option value="">全部</a-select-option>
            <a-select-option
              :value="item.value"
              v-for="item in wayOptions"
              :key="item.value"
              >{{ item.label }}</a-select-option
            >
          </a-select>
        </div>
        <div class="bottom-search-item">
          <span class="item-label">模板状态：</span>
          <a-select
            class="item-value"
            v-model="templateState"
            placeholder="模板状态"
          >
            <a-select-option value="">全部</a-select-option>
            <a-select-option :value="0">启用</a-select-option>
            <a-select-option :value="1">停用</a-select-option>
          </a-select>
        </div>
        <div class="bottom-search-item">
          <span class="item-label">模板描述：</span>
          <a-input
            allow-clear
            class="item-value"
            type="text"
            v-model.trim="templateDesc"
            placeholder="模板描述"
          />
        </div>
        <div class="bottom-search-item">
          <span class="item-label">蓝图名称：</span>
          <a-input
            allow-clear
            class="item-value"
            type="text"
            v-model.trim="blueprintName"
            placeholder="蓝图名称"
          />
        </div>
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
          新建模板
        </a-button>
        <a-button @click="onSearch('repeat')">刷新</a-button>
      </template>
      <template slot="blueprintName" slot-scope="record">
        <router-link :to="`/blueprint?name=${record.blueprintName}`">{{
          record.blueprintName
        }}</router-link>
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
            <span>创建模型</span>
          </template>
          <a @click="handleCreateModel(record)">
            <icon-svg icon-class="icon-model" />
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
          <a @click="startTemplate(record)">
            <icon-svg icon-class="icon-offline" v-if="record.status == 0" />
            <icon-svg icon-class="icon-online" v-else />
          </a>
        </a-tooltip>
        <a-divider type="vertical"></a-divider>
        <a-tooltip>
          <template slot="title">
            <span>删除</span>
          </template>
          <a
            @click="handleDelete(record)"
            :class="record.status == 0 ? 'disabled' : 'del'"
          >
            <icon-svg icon-class="icon-delete" />
          </a>
        </a-tooltip>
      </div>
    </CommonList>
  </div>
</template>
<script>
import {
  queryTemplateByPage,
  getTemplateDetails,
  delTemplate,
  updateTemplateStatus,
} from "@/shared/api/configManage.js";
import CommonList from "@/components/commonList";
import { modalConfirm } from "@/utils/common.js";
import { Button, Divider, Input, Tooltip } from "ant-design-vue";
import TreeList from "../components/treeList.vue";

export default {
  name: "TemplateList",
  data() {
    return {
      templateId: undefined,
      templateState: "",
      templateName: undefined,
      templateDesc: undefined,
      createType: "",
      blueprintName: undefined,
      selectedKey: undefined,
      wayOptions: [
        {
          label: "配置化",
          value: 1,
        },
        {
          label: "脚本化",
          value: 2,
        },
      ],
      tableLoading: false,
      columns: [
        {
          title: "模板编号",
          dataIndex: "id",
          key: "id",
          width: 200,
        },
        {
          title: "模板名称",
          dataIndex: "name",
          key: "name",
          width: 200,
        },
        {
          title: "模板描述",
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
          title: "模板分类",
          dataIndex: "type",
          key: "type",
          width: 160,
        },
        {
          title: "蓝图名称",
          dataIndex: "blueprintName",
          key: "blueprintName",
          width: 160,
          scopedSlots: { customRender: "blueprintName" },
        },
        {
          title: "创建方式",
          dataIndex: "createType",
          key: "createType",
          width: 160,
          customRender: (text, record, index) => {
            if (text === 1) {
              return <span class="way-slot-item item-config">配置化</span>;
            } else {
              return <span class="way-slot-item item-sql">脚本化</span>;
            }
          },
        },
        {
          title: "创建时间",
          dataIndex: "createDate",
          key: "createDate",
          width: 200,
        },
        {
          title: "创建人",
          dataIndex: "createPerson",
          key: "createPerson",
          width: 120,
        },
        {
          title: "模板状态",
          dataIndex: "stateText",
          key: "stateText",
          width: 100,
          scopedSlots: { customRender: "stateText" },
        },
        {
          title: "操作",
          dataIndex: "actions",
          key: "actions",
          width: 190,
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
        //   blueprintName: "test",
        //   createType: 1,
        //   createDate: "2020-01-01 00:00:00",
        //   createPerson: "test",
        //   stateText: "启用",
        // },
        // {
        //   id: "test2",
        //   name: "test",
        //   desc: "test",
        //   type: "test",
        //   blueprintName: "test",
        //   createType: 2,
        //   createDate: "2020-01-01 00:00:00",
        //   createPerson: "test",
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
    async onSearch(type) {
      this.tableLoading = true;
      if (type === "init") {
        this.$set(this.pagination, "current", 1);
      }
      const json = {
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
        createType: this.createType,
        status: this.templateState,
        id: this.templateId,
        desc: this.templateDesc,
        name: this.templateName,
        blueprintName: this.blueprintName,
        categoryId: this.selectedKey,
      };
      try {
        const res = await queryTemplateByPage(json);
        this.$set(this.pagination, "total", parseInt(res.data.totalCount));
        const tableValue = [];
        res.data.dateList.map((item) => {
          tableValue.push({
            ...item,
            type: item.categoryName,
            blueprintName: item.schemaName,
            stateText: item.status == 0 ? "启用" : "停用",
            createDate: item.createDate || item.updateDate,
            createPerson: item.createUser || "test",
          });
        });
        this.tableValue = tableValue;
      } catch (error) {
        console.log(error);
        this.$message.destroy();
        this.$message.error("获取模板列表失败，请重试");
      } finally {
        this.tableLoading = false;
      }
    },
    async handleCheck(record) {
      const res = await this.getTemplateDetails(record);
      if (res) {
        this.$emit("detailsChanged", res);
        this.$emit("isDetailsShowChanged", true);
        this.$emit("isListShowChanged", false);
        this.$emit("detailsTypeChanged", "check");
      }
    },
    async getTemplateDetails(record) {
      const loading = this.$message.loading("正在查询", 0);
      try {
        const res = await getTemplateDetails(record.id, record.createType);
        if (!res) {
          this.$message.error("模板获取失败，请重试！");
          return false;
        } else {
          res.categoryId = record.categoryId;
          res.categoryName = record.categoryName;
          if (res.createType === 1) {
            // 配置化
            const condition = JSON.parse(res.condition) || undefined;
            const modelInfo = JSON.parse(res.schemaInfo) || undefined;
            if (condition && modelInfo) {
              res.matchList = condition.matchList;
              res.rulesGroup = condition.rulesGroup;
              res.sentenceContent = res.templateScript;
              res.modelInfo = modelInfo;

              // 重置nodeIndex、edgeIndex与pathIndex
              let nodeIndex = 0;
              let edgeIndex = 0;
              modelInfo.vertexMetas.map((node) => {
                const index = parseInt(node.name.slice(1));
                if (index > nodeIndex) {
                  nodeIndex = index;
                }
              });
              modelInfo.edgeMetas.map((edge) => {
                const index = parseInt(edge.name.slice(1));
                if (index > edgeIndex) {
                  edgeIndex = index;
                }
              });
              res.nodeIndex = nodeIndex;
              res.edgeIndex = edgeIndex + 1;
              res.pathIndex = condition.matchList.length - 1;
            } else {
              this.$message.error("获取模型结构失败！");
            }
          } else {
            res.data = res.paramList.map((item, index) => ({
              id: index,
              index: item.paramName,
              type:
                item.paramType < 3
                  ? [item.paramType]
                  : ["Enum", item.paramType],
              content: item.paramDesc,
              example:
                item.paramType < 3
                  ? item.paramEg
                  : item.enums.map((ele, index) => ({
                      index: index + 1,
                      text: ele.paramValue,
                      content: ele.paramDesc,
                    })),
            }));
          }
        }
        return res;
      } catch (error) {
        this.$message.destroy();
        this.$message.error("模板获取失败");
        return;
      } finally {
        loading();
      }
    },
    async handleEdit(record) {
      if (record.status == 0) return false;
      console.log("🚀 ~ handleEdit ~ handleEdit:", record);
      const res = await this.getTemplateDetails(record);
      this.$emit("detailsChanged", res);
      this.$emit("isDetailsShowChanged", true);
      this.$emit("isListShowChanged", false);
      this.$emit("detailsTypeChanged", "edit");
    },
    handleDelete(record) {
      if (record.status == 0) return false;
      const _that = this;
      const title = `确定要删除 ${record.name} 吗？`;
      const onOk = async () => {
        const json = {
          id: record.id,
        };
        try {
          const data = await delTemplate(json);
          if (data.message === "成功") {
            _that.$message.success("删除成功");
            _that.onSearch("init");
          } else {
            _that.$message.error(data.message);
          }
        } catch (error) {
          this.$message.destroy();
          this.$message.error("删除失败");
        }
      };
      modalConfirm(title, _that, onOk);
    },
    async startTemplate(record) {
      const _that = this;
      const action = record.status == 0 ? "停用" : "启用";
      const title = `确定要${action} ${record.name} 吗？`;
      const onOk = async () => {
        const json = {
          id: record.id,
          status: record.status == 0 ? 1 : 0,
        };
        try {
          const data = await updateTemplateStatus(json);
          if (data.message === "成功") {
            _that.$message.success(`${action}成功`);
            _that.onSearch("init");
          } else {
            _that.$message.error(data.message);
          }
        } catch (error) {
          this.$message.destroy();
          this.$message.error(`${action}失败`);
        }
      };
      modalConfirm(title, _that, onOk);
    },
    onReset() {
      this.templateId = undefined;
      this.templateName = undefined;
      this.createType = "";
      this.templateState = "";
      this.templateDesc = undefined;
      this.blueprintName = undefined;
      this.onSearch("init");
    },
    handleAdd() {
      const details = {
        id: undefined,
        name: undefined,
        desc: undefined,
        data: [],
        schemaId: undefined,
        templateScript: undefined,
        createType: 2,
      };
      this.$emit("detailsChanged", details);
      this.$emit("isDetailsShowChanged", true);
      this.$emit("isListShowChanged", false);
      this.$emit("detailsTypeChanged", "add");
    },
    async handleCreateModel(record) {
      console.log("🚀 ~ handleCreateModel ~ handleCreateModel:", record);
      this.$emit("isDetailsShowChanged", false);
      this.$emit("isListShowChanged", false);
      this.$emit("addModelShowChange", true, record);
      this.$emit("handleCreateModel", record);
    },
    selectedKeyChange(key) {
      this.selectedKey = key;
      this.onSearch("init");
    },
    getCategoryOptions(value) {
      this.$emit("getCategoryOptions", value);
    },
  },
};
</script>
<style lang="less" scoped>
.template-manage-list {
  height: 100%;
  display: flex;
  padding: 20px;
  background: #fff;

  &-right {
    flex: 1;
    height: 100%;
    border-radius: 5px;
    width: calc(75% - 20px);

    .template-table {
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
        color: #13c2c2;
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
</style>
