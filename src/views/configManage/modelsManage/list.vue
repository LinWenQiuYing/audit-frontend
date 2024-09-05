<template>
  <div class="model-manage-list">
    <TreeList
      treeTitle="模型分类"
      @selectedKeyChange="selectedKeyChange"
      @getCategoryAllOptions="getCategoryAllOptions"
    />
    <CommonList
      isTitle
      listClass="model-manage-list-right"
      className="model-table"
      :columns="columns"
      :dataSource="modelList"
      :pagination="pagination"
      :loading="searchLoading"
      :scroll="{ x: 'max-content', y: 'calc(100vh - 514px)' }"
      bordered
      :rowKey="(record) => record.id"
    >
      <!-- 大标题 -->
      <div slot="tableTitle" class="table-header">
        <div class="table-header-title">模型列表</div>
      </div>
      <template slot="searchOptions">
        <!-- <div class="bottom-search-item">
          <span class="item-label">模型编号：</span>
          <a-input
            allow-clear
            class="item-value"
            type="text"
            v-model.trim="modelId"
            placeholder="模型编号"
          />
        </div> -->
        <div class="bottom-search-item">
          <span class="item-label">模型名称：</span>
          <a-input
            allow-clear
            class="item-value"
            type="text"
            v-model.trim="modelName"
            placeholder="模型名称"
          />
        </div>
        <div class="bottom-search-item">
          <span class="item-label">图谱名称：</span>
          <a-input
            allow-clear
            class="item-value"
            type="text"
            v-model.trim="graphName"
            placeholder="图谱名称"
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
        <div class="bottom-search-item">
          <span class="item-label">模型分类：</span>
          <a-select
            class="item-value"
            v-model="modelType"
            placeholder="模型分类"
            :options="categoryAllOptions"
          />
        </div>
        <div class="bottom-search-item">
          <span class="item-label">创建时间：</span>
          <a-range-picker
            class="item-value"
            v-model.trim="createTime"
            :placeholder="['开始日期', '截止日期']"
          />
        </div>
        <div class="bottom-search-item">
          <span class="item-label">创建人：</span>
          <a-select
            class="item-value"
            v-model="createPerson"
            placeholder="创建人"
            :options="createPersonOptions"
          />
        </div>
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

        <!-- <div class="bottom-search-item">
          <span class="item-label">模型状态：</span>
          <a-select
            class="item-value"
            v-model="modelState"
            placeholder="请选择状态"
          >
            <a-select-option value="">全部</a-select-option>
            <a-select-option :value="0">启用</a-select-option>
            <a-select-option :value="1">停用</a-select-option>
          </a-select>
        </div> -->
        <!-- <div class="bottom-search-item">
          <span class="item-label">模型描述：</span>
          <a-input
            class="item-value"
            type="text"
            v-model.trim="modelDesc"
            placeholder="描述关键字"
          />
        </div> -->
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
          <!-- <a-button class="fold-btn" @click="handleFold">
              {{ isFold ? "展开" : "收起" }}
              <a-icon :type="isFold ? 'down' : 'up'" />
            </a-button> -->
        </div>
      </template>
      <template slot="tableBtns">
        <a-button
          class="add-btn"
          type="primary"
          @click="addModelShowChange(true, {}, 'add')"
        >
          新建模型
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
            <span>查看所用模板</span>
          </template>
          <a @click="handleCheckTemplate(record)">
            <icon-svg icon-class="icon-check-template" />
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
          <a @click="handleStop(record)">
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
    <a-drawer
      placement="right"
      :closable="false"
      :visible="drawerVisible"
      @close="onDrawerClose"
      :width="572"
      class="check-drawer"
    >
      <div slot="title" class="check-drawer-header">
        <div class="header-left">
          <a-icon type="close" @click="onDrawerClose" />
          <span class="check-drawer-title">模型详情</span>
        </div>
        <div class="header-right">
          <a-button @click="handleEdit(details)" :disabled="details.status == 0"
            >编辑</a-button
          >
          <a-button @click="handleStop(details)" type="primary">{{
            details.status == 0 ? "停用" : "启用"
          }}</a-button>
        </div>
      </div>
      <div class="check-drawer-item">
        <span class="check-drawer-item-label">模型编号：</span>
        <div class="check-drawer-item-content">{{ details.id }}</div>
      </div>
      <div class="check-drawer-item">
        <span class="check-drawer-item-label">模型名称：</span>
        <div class="check-drawer-item-content">{{ details.name }}</div>
      </div>
      <!-- <div class="check-drawer-item">
        <span class="check-drawer-item-label">模型分类：</span>
        <div class="check-drawer-item-content">
          {{ details.categoryNameStr }}
        </div>
      </div> -->
      <div class="check-drawer-item block-content">
        <span class="check-drawer-item-label">模型结构：</span>
        <div
          class="check-drawer-item-content"
          v-if="details.imagePath && details.createType === 1"
        >
          <img :src="`http://172.18.192.65:8082${details.imagePath}`" alt="" />
        </div>
        <span
          class="check-drawer-item-content"
          v-else-if="!details.imagePath && details.createType === 1"
          >暂无模型图片</span
        >
        <script-results
          v-else
          :list="dataList"
          ref="scriptResults"
          type="check"
        />
      </div>
      <div class="check-drawer-item">
        <span class="check-drawer-item-label">模型描述：</span>
        <div class="check-drawer-item-content">{{ details.desc }}</div>
      </div>
      <div class="check-drawer-item">
        <span class="check-drawer-item-label">应用规则：</span>
        <div class="check-drawer-item-content">
          <p
            :class="item === '暂无应用' ? 'rules-item no-apply' : 'rules-item'"
            v-for="item in details.rules"
            :key="item"
          >
            {{ item }}
          </p>
        </div>
      </div>
      <div class="check-drawer-item">
        <span class="check-drawer-item-label">生成方式：</span>
        <div class="check-drawer-item-content">
          {{ details.createType == 1 ? "配置化" : "脚本化" }}
        </div>
      </div>
      <div class="check-drawer-item block-content">
        <p class="content-sub-title">模型脚本展示</p>
        <div class="check-drawer-item-content script">
          <code v-if="details.scripts">{{ details.scripts }}</code>
          <span v-else class="no-script">暂无脚本</span>
        </div>
      </div>
      <div
        class="check-drawer-item block-content"
        v-show="details.createType === 2"
      >
        <p class="content-sub-title">模板结构示例</p>
        <div class="check-drawer-item-content">
          <!-- 配置化：展示配置化的模板结构图 脚本化：展示用户上传的图片 todo -->
          <img :src="`http://172.18.192.65:8082${details.imagePath}`" alt="" />
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import CommonList from "@/components/commonList";
import { modalConfirm } from "@/utils/common.js";
import {
  Button,
  DatePicker,
  Divider,
  Icon,
  Input,
  Tooltip,
} from "ant-design-vue";
import TreeList from "../components/treeList.vue";
import ScriptResults from "./scriptResults";
import {
  getRuleModelByPage,
  getRuleModelDetail,
  getTemplateDetails,
  delRuleModel,
  editRuleModel,
} from "@/shared/api/configManage.js";

const { RangePicker } = DatePicker;

export default {
  name: "ModelList",
  data() {
    return {
      searchLoading: false,
      modelId: "",
      graphName: undefined,
      blueprintName: undefined,
      createTime: [],
      createPerson: "",
      createPersonOptions: [
        {
          label: "全部",
          value: "",
        },
      ],
      modelType: "",
      modelState: "",
      templateId: undefined,
      modelName: undefined,
      modelDesc: undefined,
      createType: "",
      columns: [
        // {
        //   title: "模型编号",
        //   dataIndex: "id",
        //   key: "id",
        //   width: 200,
        // },
        {
          title: "模型名称",
          dataIndex: "name",
          key: "name",
          width: 180,
        },
        {
          title: "模型分类",
          dataIndex: "modelType",
          key: "modelType",
          width: 120,
        },
        {
          title: "模型描述",
          dataIndex: "desc",
          key: "desc",
          width: 200,
        },
        // {
        //   title: "生成方式",
        //   dataIndex: "createType",
        //   key: "createType",
        //   width: 120,
        //   customRender: (text) => {
        //     if (text === 2) {
        //       return <span class="way-slot-item item-sql">脚本化</span>;
        //     } else {
        //       return <span class="way-slot-item item-config">配置化</span>;
        //     }
        //   },
        // },
        {
          title: "模型状态",
          dataIndex: "stateText",
          key: "stateText",
          width: 120,
          scopedSlots: { customRender: "stateText" },
        },
        {
          title: "图谱名称",
          dataIndex: "graphName",
          key: "graphName",
          width: 160,
        },
        {
          title: "蓝图名称",
          dataIndex: "blueprintName",
          key: "blueprintName",
          width: 160,
        },
        {
          title: "创建时间",
          dataIndex: "createDate",
          key: "createDate",
          width: 204,
        },
        // {
        //   title: "最新更新日期",
        //   dataIndex: "updateDate",
        //   key: "updateDate",
        //   width: 214,
        // },
        {
          title: "创建人",
          dataIndex: "createUser",
          key: "createUser",
          width: 106,
        },
        // {
        //   title: "模型维护人",
        //   dataIndex: "updateUser",
        //   key: "updateUser",
        //   width: 120,
        // },
        {
          title: "操作",
          dataIndex: "actions",
          key: "actions",
          width: 190,
          scopedSlots: { customRender: "actions" },
          fixed: "right",
        },
      ],
      modelList: [
        // {
        //   id: "test1",
        //   name: "test",
        //   desc: "test",
        //   modelType: "test",
        //   graphName: "test",
        //   blueprintName: "test",
        //   createDate: "2020-12-12 12:12:12",
        //   updateDate: "2020-12-12 12:12:12",
        //   stateText: "test",
        //   createUser: "test",
        //   updateUser: "test",
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
      details: {},
      dataList: [],
      categoryAllOptions: [],
    };
  },
  components: {
    AButton: Button,
    ADivider: Divider,
    AIcon: Icon,
    AInput: Input,
    ARangePicker: RangePicker,
    ATooltip: Tooltip,
    CommonList,
    ScriptResults,
    TreeList,
  },
  mounted() {
    this.onSearch("init");
  },
  methods: {
    async onSearch(type) {
      if (type === "init") {
        this.$set(this.pagination, "current", 1);
      }
      this.searchLoading = true;

      const json = {
        modelName: this.modelName === "" ? null : this.modelName,
        graphName: this.graphName || undefined,
        schemaName: this.blueprintName,
        categoryId: this.modelType ? this.modelType : null,
        createTimeStart: this.createTime.length ? this.createTime[0] : null,
        createTimeEnd: this.createTime.length ? this.createTime[1] : null,
        createPerson: this.createPerson ? this.createPerson : null, // todo
        pageSize: this.pagination.pageSize,
        pageNo: this.pagination.current,

        // id: this.modelId === "" ? null : this.modelId,
        // modelType: this.createType ? this.createType : null,
        // desc: this.modelDesc ? this.modelDesc : null,
        // status: this.modelState,
      };
      try {
        const res = await getRuleModelByPage(json);
        const tableValue = [];
        res.data.dateList.map((item) => {
          tableValue.push({
            ...item,
            code: item.modelCode,
            name: item.modelName, //模型名称
            modelType: item.categoryName,
            stateText: item.status == 0 ? "启用" : "停用", //模型状态
            graphName:
              (item.ruleWithGraph &&
                item.ruleWithGraph
                  .map((item) => item.graphChName)
                  .join("<br />")) ||
              "--",
            blueprintName: item.schemaName, //蓝图名称 = 图谱名称
            templateId: item.tempId,
            createUser: item.createUser || "test",
          });
        });
        this.modelList = tableValue;
        this.$set(this.pagination, "total", parseInt(res.data.totalCount));
      } catch (error) {
        console.log(error);
        this.$message.destroy();
        this.$message.error("获取模型列表失败，请重试");
      } finally {
        this.searchLoading = false;
      }
    },
    onReset() {
      this.modelName = undefined;
      this.graphName = undefined;
      this.blueprintName = undefined;
      this.modelType = "";
      this.createTime = [];
      this.createPerson = undefined;
      this.onSearch("init");
    },
    addModelShowChange(value, record, detailsType) {
      this.$emit("addModelShowChange", value, record, detailsType);
    },
    async handleCheck(record) {
      if (this.process) {
        return false;
      }
      this.process = true;
      const loading = this.$message.loading("正在获取模型详情", 0);
      const json = {
        id: record.id,
      };
      try {
        const res = await getRuleModelDetail(json);
        console.log("🚀 ~ handleCheck ~ res:", res);
        if (!res) {
          this.$message.error("获取模型详情失败");
          return false;
        }
        const data = res[0];
        if (data.createType === 1) {
          // 配置化
          record.imagePath = data.path;
        } else {
          record.imagePath = data.detailsDto.imagePath;
          this.dataList = data.detailsDto.paramList.map((item) => ({
            index: item.paramName,
            type:
              item.paramType < 3 ? [item.paramType] : ["Enum", item.paramType],
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
          const paramValue = JSON.parse(data.paramValue);
          this.dataList.map((item) => {
            if (
              item.type[0] === 2 ||
              (item.type[0] === "Enum" && item.type[1] === 4)
            ) {
              // 字符串
              item.value = paramValue[item.index].slice(
                1,
                paramValue[item.index].length - 1
              );
            } else {
              item.value = paramValue[item.index];
            }
          });
        }
        record.rules =
          data.ruleNameList && data.ruleNameList.length
            ? data.ruleNameList
            : ["暂无应用"];
        record.scripts = data.modelScripts;
        this.details = record;
        this.details.categoryNameStr = []
          .concat(data.categoryNameList)
          .join("；");
        this.drawerVisible = true;
      } catch (error) {
        this.$message.destroy();
        this.$message.error("获取模型详情失败");
      } finally {
        loading();
        this.process = false;
      }
    },
    async handleCheckTemplate(record) {
      console.log("🚀 ~ handleCheckTemplate ~ handleCheckTemplate:", record);
      const res = await this.getTemplateDetails(record);
      this.$emit("templateDetailsChanged", res);
      this.$emit("isListShowChanged", false);
      this.$emit("isTemplateDetailsShowChanged", true);
    },
    async getTemplateDetails(record) {
      console.log("🚀 ~ getTemplateDetails ~ getTemplateDetails:", record);
      const loading = this.$message.loading("正在查询", 0);
      try {
        const res = await getTemplateDetails(
          record.templateId,
          record.createType
        );
        if (!res) {
          this.$message.error("模板获取失败，请重试！");
          return false;
        } else {
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
              this.$message.error("获取模板结构失败！");
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
        console.log("🚀 ~ getTemplateDetails ~ error:", error);
        this.$message.destroy();
        this.$message.error("获取模板详情失败");
        return;
      } finally {
        loading();
      }
    },
    async handleEdit(record) {
      // 只有草稿状态，并且当前用户为模型的创建人或者维护人时，才可编辑模型
      if (record.status == 0) return false;
      if (this.process) {
        return false;
      }
      this.process = true;
      const loading = this.$message.loading("正在获取模型详情", 0);
      if (record.createType === 1) {
        // 配置化
        try {
          const res = await getRuleModelDetail({
            id: record.id,
          });
          const data = res[0];
          if (!data) {
            this.$message.error("获取模型详情信息失败！");
            return false;
          }
          // 配置化
          const condition = JSON.parse(data.detailsDto.condition) || undefined;
          const modelInfo = JSON.parse(data.detailsDto.schemaInfo) || undefined;
          if (condition && modelInfo) {
            const template = {};
            template.matchList = condition.matchList;
            template.rulesGroup = condition.rulesGroup;
            template.sentenceContent = data.modelScripts;
            template.modelInfo = modelInfo;
            template.schemaId = data.detailsDto.schemaId;
            template.sentenceShow = true;

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
            template.nodeIndex = nodeIndex;
            template.edgeIndex = edgeIndex + 1;
            template.pathIndex = condition.matchList.length - 1;
            const details = record;
            details.template = template;
            details.templateId = data.detailsDto.id;
            details.templateName = data.detailsDto.name;
            details.createType = data.detailsDto.createType;
            details.categoryId = data.detailsDto.categoryId;
            details.schemaId = data.detailsDto.schemaId;
            details.schemaName = data.detailsDto.schemaName;
            console.log("🚀 ~ handleEdit ~ details:", details, record);
            this.details = details;
            this.addModelShowChange(true, details, "edit");
            this.$emit("isListShowChanged", false);
          } else {
            this.$message.error("获取模型结构信息失败！");
            return false;
          }
        } catch (error) {
          this.$message.destroy();
          this.$message.error("获取模型详情失败");
        } finally {
          loading();
          this.process = false;
        }
      } else {
        // 脚本化
        const json = {
          id: record.id,
        };
        try {
          const res = await getRuleModelDetail(json);
          if (!res) {
            this.$message.error("获取模型详情失败！");
            return false;
          }
          const data = res[0];
          this.$nextTick(() => {
            record.list = data.detailsDto.paramList.map((item) => ({
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
            const paramValue = JSON.parse(data.paramValue);
            record.list.map((item) => {
              if (
                item.type[0] === 2 ||
                (item.type[0] === "Enum" && item.type[1] === 4)
              ) {
                // 字符串
                item.value = paramValue[item.index].slice(
                  1,
                  paramValue[item.index].length - 1
                );
              } else {
                item.value = paramValue[item.index];
              }
            });
            record.templateName = data.detailsDto.name;
            record.categoryId = data.categoryId;
            record.scripts = data.modelScripts;
            this.details = record;
            console.log("record", record);
            // console.log("data", data);
            this.addModelShowChange(true, record, "edit");
            this.$emit("isListShowChanged", false);
          });
        } catch (error) {
          this.$message.destroy();
          this.$message.error("获取模型详情失败");
        } finally {
          loading();
          this.process = false;
        }
      }
      this.detailsType = "edit";
      this.isSkiped = true;
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
          const data = await delRuleModel(json);
          if (data.message === "成功") {
            _that.onSearch("init");
            _that.$message.success("删除成功");
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
    async handleStop(record) {
      const _that = this;
      const action = record.status == 0 ? "停用" : "启用";
      const title = `确定要${action} ${record.name} 吗？`;
      const onOk = async () => {
        const json = {
          id: record.id,
          status: record.status == 0 ? 1 : 0,
        };
        try {
          const data = await editRuleModel(json);
          if (data.message === "成功") {
            _that.$message.success(`${action}成功`);
            record.status = record.status == 0 ? 1 : 0;
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
    onDrawerClose() {
      this.drawerVisible = false;
    },
    selectedKeyChange(key) {
      this.modelType = key;
      this.onSearch("init");
    },
    getCategoryAllOptions(value) {
      this.categoryAllOptions = value;
    },
  },
};
</script>

<style scoped lang="less">
.model-manage-list {
  height: 100%;
  display: flex;
  padding: 20px;
  background: #fff;

  &-right {
    flex: 1;
    height: 100%;
    border-radius: 5px;
    width: calc(75% - 20px);

    .model-table {
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

.add-sub-menu {
  .select-file {
    width: 100%;
    margin-bottom: 10px;
  }
}

.check-drawer {
  .ant-drawer-wrapper-body {
    .ant-drawer-header {
      .ant-drawer-title {
        font-weight: 600;

        .check-drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .anticon-close {
            cursor: pointer;
            color: #5f7292;
            margin-right: 12px;
          }

          .ant-btn {
            margin-left: 10px;
          }
        }
      }
    }

    .ant-drawer-body {
      .check-drawer-item {
        display: flex;
        line-height: 20px;
        margin-bottom: 10px;

        &-label {
          width: 75px;
          color: #97a3b7;
          display: inline-block;
        }

        &-content {
          width: 100%;
          flex: 1;
          color: #3c485c;

          .rules-item {
            color: @activeFontColor;
            margin-bottom: 10px;

            &.no-apply {
              color: #949dad;
            }
          }
        }

        &.block-content {
          display: block;

          .check-drawer-item-content {
            width: 100%;

            img {
              width: 100%;
              margin-top: 8px;
              border: 1px solid #d9d9d9;
            }

            &.script {
              padding: 8px 16px;
              border: 1px solid #d6dbe3;
              border-radius: 6px;

              .no-script {
                color: #949dad;
              }
            }
          }
        }

        .script-results {
          margin-top: 16px;
        }
      }
    }
  }
}
</style>
