<template>
  <div class="model-manage">
    <div class="model-manage-list" v-if="!addModelShow">
      <div class="model-manage-top">
        <div class="model-manage-top-item">
          <span class="model-manage-top-item-label">模型编号：</span>
          <a-input
            class="model-manage-top-item-input"
            type="text"
            v-model.trim="modelId"
            placeholder="请输入模型编号"
          />
        </div>
        <div class="model-manage-top-item item-select">
          <span class="model-manage-top-item-label item-select-label"
            >状态：</span
          >
          <a-select
            class="model-manage-top-item-input item-select-input"
            v-model="modelState"
            placeholder="请选择状态"
          >
            <a-select-option value="">全部</a-select-option>
            <a-select-option :value="0">发布</a-select-option>
            <a-select-option :value="1">草稿</a-select-option>
          </a-select>
        </div>
        <div class="model-manage-top-item">
          <span class="model-manage-top-item-label">模型名称：</span>
          <a-input
            class="model-manage-top-item-input"
            type="text"
            v-model.trim="modelName"
            placeholder="请输入模型名称"
          />
        </div>
        <div class="model-manage-top-btns">
          <a-button
            type="primary"
            @click="onSearch"
            :loading="searchLoading"
            icon="search"
          >
            查询
          </a-button>
          <a-button @click="onReset">
            <a-icon type="redo" :rotate="-90" /> 重置
          </a-button>
        </div>
      </div>
      <div class="model-manage-bottom">
        <div class="model-manage-bottom-btns">
          <a-button
            type="primary"
            @click="addModelShowChange(true)"
            icon="plus-circle"
            v-if="userRights.btn_createModel"
          >
            新增模型
          </a-button>
          <a-button @click="onSearch" icon="sync"> 刷新 </a-button>
        </div>
        <table-component
          :columns="columns"
          :data-source="modalList"
          :rowKey="(record) => record.id"
          :pagination="pagination"
          :loading="searchLoading"
          class="model-table"
        >
          <a class="state-cell" slot="stateText" slot-scope="record">
            <span
              :class="record.stateText === '发布' ? 'publish dot' : 'draft dot'"
            ></span>
            <span class="state-text">{{ record.stateText }}</span>
          </a>
          <span slot="action" slot-scope="record" class="action">
            <a @click="handleCheck(record)" v-if="userRights.btn_checkModel"
              >查看</a
            >
            <a-divider v-if="userRights.btn_checkModel" type="vertical" />
            <a @click="copyModel(record)" v-if="userRights.btn_duplicateModel"
              >一键复用</a
            >
            <a-divider v-if="userRights.btn_duplicateModel" type="vertical" />
            <a
              :class="record.state === 0 ? 'delete-disabled' : ''"
              @click="handleDelete(record)"
              v-if="userRights.btn_deleteModel"
              >删除</a
            >
            <a-divider
              v-if="
                userRights.btn_deleteModel &&
                userRights.btn_startOrStopUsingModel
              "
              type="vertical"
            />
            <a
              v-if="record.state === 1 && userRights.btn_startOrStopUsingModel"
              @click="handleStop(record)"
              >启用</a
            >
            <a
              v-if="record.state === 0 && userRights.btn_startOrStopUsingModel"
              @click="handleStop(record)"
              >停用</a
            >
            <a
              v-if="
                !userRights.btn_checkModel &&
                !userRights.btn_duplicateModel &&
                !userRights.btn_deleteModel &&
                !userRights.btn_startOrStopUsingModel
              "
              class="no-action"
            >
              暂无操作权限
            </a>
          </span>
        </table-component>
      </div>
      <a-drawer
        title="模型详情"
        placement="right"
        :closable="false"
        :visible="drawerVisible"
        @close="onDrawerClose"
        width="360"
        class="check-drawer"
      >
        <div class="check-drawer-item">
          <span class="check-drawer-item-label">模型编号：</span>
          <div class="check-drawer-item-content">{{ details.code }}</div>
        </div>
        <div class="check-drawer-item">
          <span class="check-drawer-item-label">模型名称：</span>
          <div class="check-drawer-item-content">{{ details.name }}</div>
        </div>
        <div class="check-drawer-item img-content">
          <span class="check-drawer-item-label">模型结构：</span>
          <div class="check-drawer-item-content" v-if="details.imgString">
            <img :src="details.imgString" alt="" />
          </div>
          <span v-else class="check-drawer-item-content">暂无结构图片</span>
        </div>
        <div class="check-drawer-item">
          <span class="check-drawer-item-label">模型描述：</span>
          <div class="check-drawer-item-content">{{ details.desc }}</div>
        </div>
        <div class="check-drawer-item">
          <span class="check-drawer-item-label">应用规则：</span>
          <div class="check-drawer-item-content">
            <p
              :class="
                item === '暂无应用' ? 'rules-item no-apply' : 'rules-item'
              "
              v-for="item in details.rules"
              :key="item"
            >
              {{ item }}
            </p>
          </div>
        </div>
      </a-drawer>
    </div>
    <AddModel
      v-if="addModelShow"
      :schemaId="schemaId"
      :modelInfo="modelInfo"
      :params="params"
      @addModelSuccessed="addModelSuccessed"
      @addModelShowChange="addModelShowChange"
      ref="addModel"
    />
  </div>
</template>
<script>
import TableComponent from "@/components/tableComponent";
import {
  delRuleModel,
  editRuleModel,
  getRuleModel,
  getRuleModelDetail,
  getRuleModelDetails,
} from "@/shared/api/configManage.js";
import { modalConfirm } from "@/utils/common.js";
import { Button, Divider, Icon, Input } from "ant-design-vue";
import { mapState } from "vuex";
import AddModel from "./components/addModel";

export default {
  name: "ModelsManage",
  data() {
    return {
      modelId: "",
      modelState: "",
      modelName: "",
      searchLoading: false,
      columns: [
        {
          title: "模型编号",
          dataIndex: "code",
          key: "code",
          width: 90,
          align: "center",
        },
        {
          title: "模型名称",
          dataIndex: "name",
          key: "name",
          width: 150,
          align: "center",
        },
        {
          title: "描述",
          dataIndex: "desc",
          key: "desc",
          width: 260,
          align: "center",
        },
        {
          title: "状态",
          dataIndex: "stateText",
          key: "stateText",
          width: 105,
          align: "center",
          scopedSlots: { customRender: "stateText" },
        },
        {
          title: "操作",
          dataIndex: "action",
          key: "action",
          width: 210,
          align: "center",
          scopedSlots: { customRender: "action" },
        },
      ],
      modalList: [],
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
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = 1;
          this.pagination.pageSize = size;
        },
      },
      drawerVisible: false,
      details: {},
      addModelShow: false,
      modelInfo: undefined,
      schemaId: undefined,
      process: false, // 表示是否正在过程中，节流作用
      params: undefined, // 一键复制时给子组件传参集合
    };
  },
  components: {
    AButton: Button,
    AddModel,
    ADivider: Divider,
    AIcon: Icon,
    AInput: Input,
    TableComponent,
  },
  mounted() {
    this.onSearch();
  },
  computed: {
    ...mapState("rightsOptions", ["userRights"]),
  },
  methods: {
    async onSearch() {
      this.searchLoading = true;
      const json = {
        modelCode: this.modelId === "" ? null : this.modelId,
        modelName: this.modelName === "" ? null : this.modelName,
        status: this.modelState,
      };
      const data = await getRuleModel(json);
      if (!data) {
        this.$message.error("获取模型列表失败");
      } else {
        const tableValue = [];
        data.map((item) => {
          tableValue.push({
            id: item.id,
            code: item.modelCode,
            name: item.modelName,
            desc: item.desc,
            state: item.status,
            stateText: item.status == 0 ? "发布" : "草稿",
          });
        });
        this.modalList = tableValue;
      }
      this.searchLoading = false;
    },
    onReset() {
      this.modelId = "";
      this.modelState = "";
      this.modelName = "";
      this.onSearch();
    },
    async handleCheck(record) {
      const loading = this.$message.loading("正在获取模型详情", 0);
      this.details = record;
      const json = {
        id: record.id,
      };
      const data = await getRuleModelDetail(json);
      if (!data) {
        loading();
        this.$message.error("获取模型详情失败");
        return false;
      }
      this.details.imgString = data[0].imgString;
      this.details.rules = data[0].ruleNameList.length
        ? data[0].ruleNameList
        : ["暂无应用"];
      loading();
      this.drawerVisible = true;
    },
    handleDelete(record) {
      if (!record.state) return false;
      const _that = this;
      const title = `确定要删除 ${record.name} 吗？`;
      const onOk = async () => {
        const json = {
          id: record.id,
        };
        const data = await delRuleModel(json);
        if (data.message === "成功") {
          _that.onSearch();
          _that.$message.success("删除成功");
        } else {
          _that.$message.error(`删除失败，${data.message}`);
        }
      };
      modalConfirm(title, _that, onOk);
    },
    async handleStop(record) {
      const _that = this;
      const action = record.state === 0 ? "停用" : "启用";
      const title = `确定要${action} ${record.name} 吗？`;
      const onOk = async () => {
        const json = {
          id: record.id,
          status: record.state === 0 ? 1 : 0,
        };
        const data = await editRuleModel(json);
        if (data.message === "成功") {
          _that.$message.success(`${action}成功`);
          _that.onSearch();
        } else {
          _that.$message.error(`${action}失败 ${data.message}`);
        }
      };
      modalConfirm(title, _that, onOk);
    },
    onDrawerClose() {
      this.drawerVisible = false;
    },
    addModelShowChange(value) {
      this.modelInfo = undefined;
      this.params = undefined;
      this.schemaId = undefined;
      this.addModelShow = value;
    },
    async copyModel(record) {
      if (this.process) {
        return false;
      }
      this.process = true;
      const res = await getRuleModelDetails(record.id);
      const condition = JSON.parse(res.data.condition) || undefined;
      this.modelInfo = JSON.parse(res.data.schemaInfo) || undefined;
      if (res.message === "成功" && condition && this.modelInfo) {
        this.addModelShow = true;
        const params = {};
        params.matchList = condition.matchList;
        params.rulesGroup = condition.rulesGroup;
        params.sentenceContent = res.data.modelScripts;
        params.sentenceShow = true;

        // 重置nodeIndex、edgeIndex与pathIndex
        let nodeIndex = 0;
        let edgeIndex = 0;
        this.modelInfo.vertexMetas.map((node) => {
          const index = parseInt(node.name.slice(1));
          if (index > nodeIndex) {
            nodeIndex = index;
          }
        });
        this.modelInfo.edgeMetas.map((edge) => {
          const index = parseInt(edge.name.slice(1));
          if (index > edgeIndex) {
            edgeIndex = index;
          }
        });
        params.nodeIndex = nodeIndex;
        params.edgeIndex = edgeIndex + 1;
        params.pathIndex = condition.matchList.length - 1;

        this.params = params;
        this.$nextTick(async () => {
          this.$refs.addModel.current = 1;
          this.schemaId = res.data.schemaId;
          const loading = this.$message.loading("正在获取图谱结构信息", 0);
          await this.$refs.addModel.handleSetModel(this.schemaId);
          loading();
          this.$refs.addModel.handleLock();
        });
      } else {
        this.$message.error("一键复用失败");
      }
      this.process = false;
    },
    addModelSuccessed() {
      this.addModelShowChange(false);
      this.onSearch();
    },
  },
};
</script>
<style lang="less">
.model-manage {
  background: #fff;
  border-radius: 5px;
  height: calc(100% - 4px);
  margin: 2px;
  box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.16);

  &-list {
    height: 100%;
    padding: 16px;
  }

  .model-manage-top {
    display: flex;
    padding-bottom: 16px;
    border-bottom: 1px dashed #ebebeb;

    &-item {
      display: flex;
      align-items: center;
      width: 25%;
      max-width: 300px;

      &-label {
        width: 75px;
        text-align: right;
      }

      &-input {
        width: calc(100% - 90px);
      }
    }

    .item-select {
      width: 20%;
      max-width: 240px;

      &-label {
        width: 45px;
        text-align: right;
      }

      &-input {
        width: calc(100% - 60px);
      }
    }

    &-btns {
      .ant-btn:first-child {
        margin-right: 10px;
      }
    }
  }

  .model-manage-bottom {
    padding-top: 16px;
    height: calc(100% - 49px);

    &-btns {
      padding-bottom: 16px;

      .ant-btn {
        margin-right: 16px;
      }
    }

    .model-table {
      height: calc(100% - 48px);

      .state-cell {
        display: flex;
        justify-content: center;
        align-items: center;

        .dot {
          opacity: 1;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          margin-right: 10px;
          display: inline-block;
        }

        .publish {
          background: #19be6b;
        }

        .draft {
          background: #a5aab3;
        }
      }

      .ant-table-row-cell-break-word,
      .state-text {
        color: #949dad;
      }

      .action {
        .delete-disabled {
          color: #c1c1c1;
          cursor: not-allowed;
        }
      }
    }
  }
}

.check-drawer {
  .ant-drawer-wrapper-body {
    .ant-drawer-header {
      .ant-drawer-title {
        font-weight: 600;
      }
    }

    .ant-drawer-body {
      .check-drawer-item {
        display: flex;
        margin-bottom: 16px;
        justify-content: space-between;

        &-label {
          width: 75px;
          display: inline-block;
        }

        &-content {
          color: #949dad;
          width: calc(100% - 75px);

          .rules-item {
            color: @activeFontColor;
            margin-bottom: 10px;

            &.no-apply {
              color: #949dad;
            }
          }
        }

        &.img-content {
          display: block;

          .check-drawer-item-content {
            width: 100%;

            img {
              width: 100%;
              margin-top: 8px;
              border: 1px solid #d9d9d9;
            }
          }
        }
      }
    }
  }
}
</style>
