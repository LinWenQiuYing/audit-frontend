<template>
  <div class="organization-manage">
    <div class="manage-header">
      <div class="manage-header-item">
        <span class="item-label">机构名称：</span>
        <a-input
          placeholder="请输入机构名称"
          v-model.trim="orgName"
          class="manage-header-item-input item-input"
        />
      </div>
      <div class="manage-header-item">
        <span class="item-label">机构编码：</span>
        <a-input
          placeholder="请输入机构编码"
          v-model.trim="orgCode"
          class="manage-header-item-input item-input"
        />
      </div>
      <div class="manage-header-item">
        <span class="item-label">状态：</span>
        <a-select
          placeholder="请选择"
          v-model="searchType"
          class="manage-header-item-input item-select"
        >
          <a-select-option value="0">启用</a-select-option>
          <a-select-option value="1">停用</a-select-option>
        </a-select>
      </div>
      <div class="manage-header-item">
        <a-button type="primary" icon="search" @click="onSearch('init')"
          >查询</a-button
        >
        <a-button style="margin-left: 10px" @click="reset">
          <a-icon type="redo" :rotate="-90" /> 重置
        </a-button>
      </div>
    </div>
    <div class="manage-table">
      <div class="manage-table-button">
        <div class="manage-table-add">
          <a-button
            icon="plus-circle"
            type="primary"
            @click="addUser"
            v-if="userRights.btn_addOrganization"
            >添加</a-button
          >
        </div>
        <div class="manage-table-update">
          <a-button icon="sync" type="dashed" @click="onSearch('repeat')"
            >刷新</a-button
          >
        </div>
      </div>
      <table-component
        :columns="columns"
        :data-source="tableValue"
        :rowKey="(record) => record.id"
        :pagination="pagination"
        :loading="searchLoading"
        class="organization-table"
      >
        <a class="state-cell" slot="status" slot-scope="record">
          <a-badge
            :status="record.status === '停用' ? 'error' : 'success'"
            :text="record.status"
          />
        </a>
        <span slot="action" slot-scope="record">
          <a
            @click="checkDetail(record)"
            v-if="userRights.btn_checkOrganization"
            >查看</a
          >
          <a-divider type="vertical" v-if="userRights.btn_checkOrganization" />
          <a @click="editUser(record)" v-if="userRights.btn_updateOrganization"
            >编辑</a
          >
          <a-divider
            type="vertical"
            v-if="
              userRights.btn_updateOrganization &&
              userRights.btn_startOrStopOrganization
            "
          />
          <a
            @click="enable(record)"
            v-if="
              record.status === '停用' && userRights.btn_startOrStopOrganization
            "
            >启用</a
          >
          <a
            @click="enable(record)"
            v-if="
              record.status === '启用' && userRights.btn_startOrStopOrganization
            "
            >停用</a
          >
          <a-divider
            type="vertical"
            v-if="
              record.status === '停用' &&
              userRights.btn_startOrStopOrganization &&
              userRights.btn_delOrganization
            "
          />
          <a
            v-if="record.status === '停用' && userRights.btn_delOrganization"
            @click="deleteOut(record)"
            style="color: red"
            >删除</a
          >
          <a
            v-if="
              !userRights.btn_checkOrganization &&
              !userRights.btn_updateOrganization &&
              !userRights.btn_startOrStopOrganization &&
              !userRights.btn_delOrganization
            "
            class="no-action"
          >
            暂无操作权限
          </a>
        </span>
      </table-component>
    </div>
    <a-modal
      class="organization-modal"
      :title="modalTitle"
      :visible="showAddUser"
      okText="确定"
      cancelText="取消"
      @ok="addUserConfirm"
      @cancel="addUserCancel"
      centered
    >
      <div class="organization">
        <div class="organization-name">
          <div class="item-label">
            <span style="color: red">*</span> 机构名称：
          </div>
          <a-input
            placeholder="请输入机构名称"
            v-model.trim="organizationName"
            style="width: 320px"
            :disabled="modalTitle !== '新增机构'"
          ></a-input>
        </div>
        <div class="organization-name">
          <div class="item-label">上级机构：</div>
          <a-select
            placeholder="请选择上级机构"
            v-model="SuperiorOrganization"
            style="width: 320px"
            :disabled="checkDe"
          >
            <a-select-option
              v-for="item in allOrganization"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</a-select-option
            >
          </a-select>
        </div>
        <div class="organization-name" style="margin-top: 10px; display: flex">
          <div class="item-label">
            <span style="color: red">*</span> 机构编码：
          </div>
          <a-input
            placeholder="请输入机构编码"
            v-model.trim="OrganizationCode"
            style="width: 320px"
            :disabled="checkDe"
          ></a-input>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import TableComponent from "@/components/tableComponent";
import {
  getAllOrganization,
  getOrganzationdelete,
  organizationManageAdd,
  organizationManageDelete,
  searchOrganization,
} from "@/shared/api/rightsManage";
import { modalConfirm } from "@/utils/common.js";
import { Badge, Button, Divider, Icon, Input } from "ant-design-vue";
import { mapState } from "vuex";

export default {
  name: "OrganizationManage",
  data() {
    return {
      orgName: "",
      orgCode: "",
      searchType: undefined,
      columns: [
        {
          title: "机构编码",
          dataIndex: "orgCode",
          key: "orgCode",
          align: "center",
          width: 120,
        },
        {
          title: "机构名称",
          dataIndex: "orgName",
          key: "orgName",
          align: "center",
          width: 140,
        },
        {
          title: "上级机构",
          dataIndex: "parentOrg",
          key: "parentOrg",
          align: "center",
          width: 140,
        },
        {
          title: "创建人",
          dataIndex: "createName",
          key: "createName",
          align: "center",
          width: 120,
        },
        {
          title: "状态",
          dataIndex: "status",
          key: "status",
          align: "center",
          scopedSlots: { customRender: "status" },
          width: 95,
        },
        {
          title: "操作",
          key: "action",
          dataIndex: "action",
          align: "center",
          width: 200,
          scopedSlots: { customRender: "action" },
        },
      ],
      tableValue: [],
      pagination: {
        size: "small",
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
      showAddUser: false,
      organizationName: "",
      OrganizationCode: "",
      agencyUser: "",
      SuperiorOrganization: undefined,
      detailId: undefined,
      checkDe: false,
      modify: false,
      allOrganization: [],
      modalTitle: "",
      searchLoading: false,
    };
  },
  async mounted() {
    this.onSearch("init");
    this.getAllOrganization();
  },
  components: {
    ABadge: Badge,
    AButton: Button,
    ADivider: Divider,
    AIcon: Icon,
    AInput: Input,
    TableComponent,
  },
  computed: {
    ...mapState("rightsOptions", ["userInfo", "userRights"]),
  },
  methods: {
    async getAllData(value) {
      this.searchLoading = true;
      const tableValue = [];
      let data = await searchOrganization(value);
      if (!data) {
        this.$message.error("获取机构列表失败，请重新尝试");
      } else {
        for (let i = 0; i < data.dateList.length; i++) {
          const element = data.dateList;
          let arr = {
            createName: element[i].createUser,
            parentOrg: element[i].parentName,
            status: element[i].status == 0 ? "启用" : "停用", //0启用 1停用
            orgName: element[i].orgName,
            orgCode: element[i].orgCode,
            id: element[i].id,
            parentOrgId: element[i].parentId,
          };
          tableValue.push(arr);
        }
        this.tableValue = tableValue;
      }
      this.searchLoading = false;
    },
    onSearch(type) {
      if (type === "init") {
        this.$set(this.pagination, "current", 1);
      }
      const json = {
        currentUser: this.userInfo.userId,
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
        orgCode: this.orgCode,
        orgName: this.orgName,
        status: this.searchType ? Number(this.searchType) : null,
      };
      this.getAllData(json);
    },
    async getAllOrganization() {
      const json = {
        currentUser: this.userInfo.userId,
        orgCode: "",
        orgName: "",
        status: null,
      };
      const allOrganization = [];
      let data = await getAllOrganization(json);
      if (!data) {
        this.$message.error("获取全部机构信息失败");
        return false;
      }
      for (let i = 0; i < data.length; i++) {
        let arr = {
          label: data[i].orgName,
          value: data[i].id,
        };
        allOrganization.push(arr);
      }
      this.allOrganization = allOrganization;
    },
    reset() {
      this.orgName = "";
      this.searchType = undefined;
      this.orgCode = "";
      this.onSearch("init");
    },
    addUser() {
      this.modalTitle = "新增机构";
      this.organizationName = "";
      this.OrganizationCode = "";
      this.SuperiorOrganization = undefined;
      this.checkDe = false;
      this.modify = false;
      this.showAddUser = true;
    },
    async addUserConfirm() {
      if (this.checkDe) {
        this.showAddUser = false;
        return false;
      }
      if (!this.modify) {
        if (this.organizationName && this.OrganizationCode) {
          let info = {
            currentUser: this.userInfo.userId,
            orgCode: this.OrganizationCode,
            orgName: this.organizationName,
            parentOrgId: this.SuperiorOrganization,
          };
          let result = await organizationManageAdd(info);
          if (result.message === "成功") {
            this.$message.success("添加成功");
            this.onSearch("init");
          } else {
            this.$message.warning("添加失败");
          }
          this.addUserCancel();
        } else if (this.organizationName === "") {
          this.$message.warning("请填写新增机构名称");
        } else if (this.OrganizationCode === "") {
          this.$message.warning("请填写新增机构编码");
        }
      } else {
        if (this.organizationName && this.OrganizationCode) {
          let info = {
            currentUser: this.userInfo.userId,
            id: this.detailId,
            orgCode: this.OrganizationCode,
            orgName: this.organizationName,
            parentOrgId: this.SuperiorOrganization,
          };
          let res = await organizationManageDelete(info);
          if (res.message === "成功") {
            this.$message.success("修改成功");
            this.onSearch("init");
          } else {
            this.$message.warning("修改失败");
          }
          this.addUserCancel();
        } else if (this.organizationName === "") {
          this.$message.warning("请填写新增机构名称");
        } else if (this.OrganizationCode === "") {
          this.$message.warning("请填写新增机构编码");
        }
      }
    },
    addUserCancel() {
      this.showAddUser = false;
    },
    deleteOut(record) {
      const _that = this;
      const title = `确定要删除 ${record.orgName} 吗？`;
      const content = `${record.orgName}的机构信息将被删除，且操作无法撤销，请确认是否删除该机构信息。`;
      const onOk = async () => {
        let result = await getOrganzationdelete(record.id);
        result.message === "成功"
          ? _that.$message.success("机构删除成功！")
          : _that.$message.error("机构失败！");
        _that.onSearch("init");
      };
      modalConfirm(title, _that, onOk, content);
    },
    enable(record) {
      const _that = this;
      const title =
        record.status === "停用"
          ? `确定要启用 ${record.orgName} 吗？`
          : `确定要停用 ${record.orgName} 吗？`;
      const content =
        record.status === "启用"
          ? `${record.orgName}的机构信息将被停用。`
          : `${record.orgName}的机构信息将被启用。`;
      const onOk = async () => {
        let info = {
          currentUser: _that.userInfo.userId,
          id: record.id,
          orgCode: record.orgCode,
          orgName: record.orgName,
          parentOrgId: record.parentOrgId,
          status: record.status === "停用" ? 0 : 1,
        };
        let res = await organizationManageDelete(info);
        res.message === "成功"
          ? record.status === "停用"
            ? _that.$message.success("机构启用成功！")
            : _that.$message.success("机构停用成功！")
          : _that.$message.error("操作失败");
        _that.onSearch("init");
      };
      modalConfirm(title, _that, onOk, content);
    },
    editUser(record) {
      this.modalTitle = "编辑";
      this.checkDe = false;
      this.modify = true;
      this.organizationName = record.orgName;
      this.OrganizationCode = record.orgCode;
      this.SuperiorOrganization = record.parentOrgId;
      this.detailId = record.id;
      this.showAddUser = true;
    },
    checkDetail(record) {
      this.modalTitle = "查看";
      this.checkDe = true;
      this.modify = false;
      this.organizationName = record.orgName;
      this.OrganizationCode = record.orgCode;
      this.SuperiorOrganization = record.parentOrg;
      this.agencyUser = record.createName;
      this.showAddUser = true;
    },
  },
};
</script>
<style lang="less">
.organization-manage {
  height: 100%;
  width: 100%;
  background: #fff;

  .manage-header {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 16px;
    position: relative;
    border-bottom: 1px dashed #dbdbdb;

    &-item {
      &:not(:last-child) {
        margin-right: 10px;
        max-width: calc((100% - 204px) / 3);
      }

      &-input {
        width: 300px;

        &.item-select {
          max-width: calc(100% - 45px);
        }

        &.item-input {
          max-width: calc(100% - 75px);
        }
      }
    }
  }
  .manage-table {
    padding-top: 16px;
    height: calc(100% - 49px);

    .manage-table-button {
      display: flex;
    }
    .manage-table-update {
      margin-left: 10px;
    }
    .organization-table {
      margin-top: 16px;
      height: calc(100% - 52px);

      .state-cell {
        display: flex;
        justify-content: center;
        align-items: center;

        .ant-badge {
          .ant-badge-status-dot {
            width: 10px;
            height: 10px;
          }

          .ant-badge-status-text {
            color: #949dad;
          }
        }
      }

      .ant-table-row-cell-break-word {
        color: #949dad;
      }
    }
  }
}

.organization-modal {
  .ant-modal {
    &-content {
      .ant-modal-body {
        .organization {
          .organization-name {
            margin-top: 10px;
            display: flex;

            .item-label {
              width: 100px;
              text-align: right;
              margin-right: 10px;
              color: #515a6e;
              line-height: 30px;
            }

            .ant-input-disabled,
            .ant-select-disabled > .ant-select-selection {
              background: #fff;
              color: rgba(0, 0, 0, 0.65);
            }
          }
        }
      }
    }
  }
}
</style>
