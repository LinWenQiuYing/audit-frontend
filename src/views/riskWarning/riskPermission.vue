<template>
  <div class="risk-permission">
    <MainContent title="线索访问授权配置">
      <template slot="content">
        <div class="permission-table">
          <div class="table-header">
            <span class="table-title">线索权限列表</span>
            <div class="table-btns">
              <a-button @click="onSearch">刷新</a-button>
              <a-button type="primary" @click="handleAdd">新增</a-button>
            </div>
          </div>
          <a-table
            :columns="columns"
            :data-source="dataSource"
            :scroll="{ x: 'max-content', y: 'calc(100vh - 380px)' }"
            :bordered="true"
            :pagination="pagination"
            :loading="tableLoading"
          >
            <div
              slot="range"
              slot-scope="text, record, index"
              class="slot-range"
            >
              <div v-if="record.companyLimit == 0 && record.groupLimit == 0">
                全部
              </div>
              <div v-else>
                <p>
                  线索企业：{{
                    record.companyLimit == 0
                      ? "全部"
                      : record.companyList.length
                      ? record.companyList
                          .map((item) => item.companyName)
                          .join(" | ")
                      : "无"
                  }}
                </p>
                <p>
                  线索企业所属集团：{{
                    record.groupLimit == 0
                      ? "全部"
                      : record.groupList.length
                      ? record.groupList
                          .map((item) => item.groupName)
                          .join(" | ")
                      : "无"
                  }}
                </p>
              </div>
            </div>
            <div slot="actions" slot-scope="text, record">
              <a @click="handleEdit(record)">编辑</a>
              <!-- <a @click="handleDelete(record)">删除</a> -->
            </div>
          </a-table>
        </div>
        <a-modal
          class="dept-modal"
          :width="520"
          v-model="visible"
          :destroyOnClose="true"
          @cancel="onCancel"
          @ok="onConfirm"
          centered
          :title="isAdd ? '添加访问权限' : '编辑访问权限'"
        >
          <div class="dept-modal-content">
            <div class="dept-modal-content-top">
              <div class="top-item" v-show="!isAdd">
                <p class="top-title">部门ID：</p>
                <p class="top-value">{{ details.deptId }}</p>
              </div>
              <div class="top-item">
                <p class="top-title">部门名称：</p>
                <a-tree-select
                  v-if="isAdd"
                  v-model="details.deptId"
                  class="top-value"
                  :dropdown-style="{ maxHeight: '100px', overflow: 'auto' }"
                  :tree-data="treeData"
                  placeholder="请选择"
                  tree-default-expand-all
                  @change="onDeptChange"
                >
                </a-tree-select>
                <!-- <a-input
                  v-if="isAdd"
                  v-model="details.deptName"
                  class="top-value"
                  placeholder="请输入"
                >
                </a-input> -->
                <p v-else class="top-value">{{ details.deptName }}</p>
              </div>
            </div>

            <div class="dept-modal-content-item">
              <div class="item-title">
                <div class="title-left">
                  允许访问线素企业范围:
                  <a-radio-group v-model="details.entRadio">
                    <a-radio :value="0">全部</a-radio>
                    <a-radio :value="1">限定企业</a-radio>
                  </a-radio-group>
                </div>

                <a-button
                  v-if="details.entRadio == 1"
                  @click="handleDeleteAll('ent')"
                  >全部删除</a-button
                >
              </div>
              <a-table
                v-if="details.entRadio == 1"
                :columns="entColumns"
                :data-source="entDataSource"
                :scroll="{ x: 'max-content', y: '200' }"
                :bordered="true"
                :pagination="false"
                :rowKey="(record) => record.id"
                :loading="entTableLoading"
              >
                <div
                  slot="actions"
                  slot-scope="text, record, index"
                  class="slot-actions"
                >
                  <a @click="handleEntDelete('ent', record, index)"> 删除 </a>
                </div>
              </a-table>
              <div class="table-bottom" v-if="details.entRadio == 1">
                <!-- <a-select
                  show-search
                  v-model="entName"
                  placeholder="企业名称"
                  :default-active-first-option="false"
                  :show-arrow="false"
                  :filter-option="false"
                  :not-found-content="null"
                  @search="handleSearch1"
                  :options="entOptions"
                >
                </a-select> -->
                <!-- todo：缺少接口 -->
                <a-input
                  v-model="entName"
                  style="width: 385px"
                  placeholder="企业名称"
                />
                <a-icon type="plus-square" @click="handleAddEnt('ent')" />
              </div>
            </div>
            <div class="dept-modal-content-item">
              <div class="item-title">
                <div class="title-left">
                  允许访问线素企业所属集团范围:
                  <a-radio-group v-model="details.groupRadio">
                    <a-radio :value="0">全部</a-radio>
                    <a-radio :value="1">限定集团</a-radio>
                  </a-radio-group>
                </div>

                <a-button
                  v-if="details.groupRadio == 1"
                  @click="handleDeleteAll('group')"
                  >全部删除</a-button
                >
              </div>
              <a-table
                v-if="details.groupRadio == 1"
                :columns="groupColumns"
                :data-source="groupDataSource"
                :scroll="{ x: 'max-content', y: '200' }"
                :bordered="true"
                :pagination="false"
                :rowKey="(record) => record.id"
                :loading="groupTableLoading"
              >
                <div
                  slot="actions"
                  slot-scope="text, record, index"
                  class="slot-actions"
                >
                  <a @click="handleEntDelete('group', record, index)"> 删除 </a>
                </div>
              </a-table>
              <div class="table-bottom" v-if="details.groupRadio == 1">
                <!-- <a-select
                  show-search
                  v-model="groupName"
                  placeholder="集团名称"
                  :default-active-first-option="false"
                  :show-arrow="false"
                  :filter-option="false"
                  :not-found-content="null"
                  @search="handleSearch2"
                  :options="groupOptions"
                >
                </a-select> -->
                <!-- todo：缺少接口 -->
                <a-input
                  v-model="groupName"
                  style="width: 385px"
                  placeholder="集团名称"
                />
                <a-icon type="plus-square" @click="handleAddEnt('group')" />
              </div>
            </div>
          </div>
        </a-modal>
      </template>
    </MainContent>
  </div>
</template>
<script>
import { Button, Icon, Input, Radio, Table, TreeSelect } from "ant-design-vue";
import MainContent from "@/components/mainContent";
import { modalConfirm } from "@/utils/common.js";
import {
  getDeptList,
  addDept,
  editDept,
  getDeptTree,
} from "@/shared/api/riskWarning";

export default {
  name: "RiskPermission",
  data() {
    return {
      columns: [
        {
          title: "部门ID",
          dataIndex: "deptId",
          key: "deptId",
          width: 200,
        },
        {
          title: "部门名称",
          dataIndex: "deptName",
          key: "deptName",
          width: 200,
        },
        {
          title: "授权访问范围",
          dataIndex: "range",
          key: "range",
          width: 500,
          scopedSlots: { customRender: "range" },
        },
        {
          title: "操作",
          dataIndex: "actions",
          key: "actions",
          width: 80,
          scopedSlots: { customRender: "actions" },
        },
      ],
      dataSource: [],
      tableLoading: false,
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
      visible: false,
      isAdd: false,
      treeData: [],
      details: {},
      entColumns: [
        {
          title: "企业名称",
          dataIndex: "entName",
          key: "entName",
          width: 385,
        },
        {
          title: "操作",
          dataIndex: "actions",
          key: "actions",
          width: 80,
          scopedSlots: { customRender: "actions" },
        },
      ],
      groupColumns: [
        {
          title: "集团名称",
          dataIndex: "groupName",
          key: "groupName",
          width: 385,
        },
        {
          title: "操作",
          dataIndex: "actions",
          key: "actions",
          width: 80,
          scopedSlots: { customRender: "actions" },
        },
      ],
      entDataSource: [],
      groupDataSource: [],
      entTableLoading: false,
      groupTableLoading: false,
      entName: undefined,
      entOptions: [],
      groupName: undefined,
      groupOptions: [],
    };
  },
  components: {
    AButton: Button,
    AIcon: Icon,
    AInput: Input,
    ARadio: Radio,
    ARadioGroup: Radio.Group,
    ATable: Table,
    ATreeSelect: TreeSelect,
    MainContent,
  },
  mounted() {
    this.onSearch("init");
    this.getDeptTree();
  },
  methods: {
    async onSearch(type) {
      if (type === "init") {
        this.$set(this.pagination, "current", 1);
      }
      this.tableLoading = true;
      try {
        const res = await getDeptList({});
        if (res.message === "成功") {
          this.dataSource = res.data;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.destroy();
        this.$message.error("获取线索访问授权配置列表失败");
      } finally {
        this.tableLoading = false;
      }
    },
    async getDeptTree() {
      try {
        const res = await getDeptTree();
        if (res.message === "成功") {
          this.treeData = this.getTreeData(res.data);
          console.log("🚀 ~ getDeptTree ~ this.treeData:", this.treeData);
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.destroy();
        this.$message.error("获取部门信息失败");
      }
    },
    getTreeData(data) {
      console.log("🚀 ~ getTreeData ~ data:", data);
      const result = [];
      data.map((item) => {
        result.push({
          title: item.deptName,
          value: item.deptId,
          key: item.deptId,
          children: this.getTreeData(item.children),
        });
      });
      console.log("🚀 ~ getTreeData ~ result:", result);
      return result;
    },
    onDeptChange(value, label, extra) {
      console.log("🚀 ~ onDeptChange ~ value:", value, label, extra);
      this.$set(this.details, "deptName", label[0]);
      this.getDeptList(value);
    },
    async getDeptList(id) {
      try {
        this.entTableLoading = true;
        this.groupTableLoading = true;
        const res = await getDeptList({
          deptId: id,
        });
        if (res.message === "成功") {
          const data = res.data[0];
          if (data) {
            this.entDataSource = data.companyList.map((item) => ({
              entName: item.companyName,
            }));
            this.groupDataSource = data.groupList.map((item) => ({
              groupName: item.groupName,
            }));
            this.$set(this.details, "entRadio", data.companyLimit);
            this.$set(this.details, "groupRadio", data.groupLimit);
          } else {
            this.entDataSource = [];
            this.groupDataSource = [];
            this.$set(this.details, "entRadio", 1);
            this.$set(this.details, "groupRadio", 0);
          }
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.destroy();
        this.$message.error("获取线索访问授权配置列表失败");
      } finally {
        this.entTableLoading = false;
        this.groupTableLoading = false;
      }
    },
    handleAdd() {
      this.visible = true;
      this.isAdd = true;
      this.details = {
        entRadio: 1,
        groupRadio: 0,
      };
    },
    handleEdit(record) {
      console.log("🚀 ~ handleEdit ~ handleEdit:", record);
      this.visible = true;
      this.isAdd = false;
      this.details = {
        deptId: record.deptId,
        deptName: record.deptName,
        entRadio: record.companyLimit,
        groupRadio: record.groupLimit,
      };
      this.getDeptList(record.deptId);
    },
    handleDelete() {},
    onCancel() {
      this.visible = false;
      this.entDataSource = [];
      this.groupDataSource = [];
    },
    async onConfirm() {
      const loading = this.$message.loading("正在操作", 0);
      try {
        const json = {
          deptId: this.details.deptId,
          deptName: this.details.deptName,
          companyLimit: this.details.entRadio,
          groupLimit: this.details.groupRadio,
          companyList: this.entDataSource.map((item) => ({
            companyName: item.entName,
            recordType: 0,
          })),
          groupList: this.groupDataSource.map((item) => ({
            groupName: item.groupName,
            recordType: 1,
          })),
        };
        let res = null;
        if (this.isAdd) {
          res = await addDept(json);
        } else {
          res = await editDept(json);
        }
        if (res.message === "成功") {
          this.$message.success(this.isAdd ? "添加成功" : "修改成功");
          this.onCancel();
          this.onSearch("init");
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.destroy();
        this.$message.error("新增部门线索权限失败");
      } finally {
        loading();
      }
    },
    handleAddEnt(type) {
      if (type === "ent") {
        if (!this.entName) return;
        this.entDataSource.push({
          entName: this.entName,
        });
        this.entName = undefined;
      } else {
        if (!this.groupName) return;
        this.groupDataSource.push({
          groupName: this.groupName,
        });
        this.groupName = undefined;
      }
    },
    handleDeleteAll(type) {
      const _that = this;
      const title =
        type === "ent"
          ? `确定要删除全部允许访问线索企业范围吗？`
          : `确定要删除全部允许访问线索企业所属集团范围吗？`;
      const onOk = () => {
        if (type === "ent") {
          this.entDataSource = [];
        } else {
          this.groupDataSource = [];
        }
      };
      modalConfirm(title, _that, onOk);
    },
    handleEntDelete(type, record, index) {
      const _that = this;
      const title =
        type === "ent"
          ? `确定要删除 ${record.entName} 吗？`
          : `确定要删除 ${record.groupName} 吗？`;
      const onOk = () => {
        if (type === "ent") {
          this.entDataSource.splice(index, 1);
        } else {
          this.groupDataSource.splice(index, 1);
        }
      };
      modalConfirm(title, _that, onOk);
    },
    handleSearch1(value) {
      fetch(value, (data) => (this.data = data));
    },
    handleChange1(value) {
      console.log(value);
      this.value = value;
      fetch(value, (data) => (this.data = data));
    },
    handleSearch2(value) {
      fetch(value, (data) => (this.data = data));
    },
    handleChange2(value) {
      console.log(value);
      this.value = value;
      fetch(value, (data) => (this.data = data));
    },
  },
};
</script>
<style lang="less">
.risk-permission {
  width: 100%;
  height: 100%;
  border-radius: 5px;

  .permission-table {
    padding: 16px;
    background: #fff;
    height: 100%;

    .table-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;

      .table-title {
        font-size: 20px;
        font-weight: 600;
        color: #1c222b;
      }

      .table-btns {
        .ant-btn {
          margin-left: 12px;
        }
      }
    }

    .ant-table-wrapper {
      height: calc(100% - 48px);
    }
  }
}

.dept-modal {
  &-content {
    &-top {
      display: flex;
      margin-bottom: 12px;

      .top-item {
        width: 50%;

        .top-title {
          margin-bottom: 8px;
        }

        .top-value {
          width: 100%;
        }
      }
    }

    &-item {
      margin-bottom: 12px;

      .item-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;

        .title-left {
          display: flex;
          align-items: center;

          .ant-radio-group {
            margin-left: 8px;
          }
        }
      }

      .ant-table-placeholder {
        .ant-empty-normal {
          margin: 10px 0;
        }
      }

      .table-bottom {
        margin-top: 8px;

        .ant-select {
          width: 385px;
        }

        .anticon {
          margin-left: 11px;
          font-size: 17px;
          cursor: pointer;
          color: rgba(0, 0, 0, 0.25);
        }
      }
    }
  }
}
</style>
