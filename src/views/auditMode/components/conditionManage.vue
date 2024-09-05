<template>
  <div class="condition-layout">
    <MainContent title="条件定义">
      <template slot="content">
        <div class="condition-count">
          <div class="condition-count-item">
            <div class="item-left">
              <icon-svg icon-class="icon_count1" class="icon-count1" />
            </div>
            <div class="item-right">
              <div class="count-num">
                {{
                  (list[0].children.length &&
                    list[0].children.length.toLocaleString()) ||
                  0
                }}
              </div>
              <span>累计条件分类</span>
            </div>
          </div>
          <div class="condition-count-item">
            <div class="item-left">
              <icon-svg icon-class="icon_count2" class="icon-count2" />
            </div>
            <div class="item-right">
              <div class="count-num">
                {{ pagination.total.toLocaleString() || 0 }}
              </div>
              <span>累计创建条件</span>
            </div>
          </div>
          <div class="condition-count-item">
            <div class="item-left">
              <icon-svg icon-class="icon_count3" class="icon-count3" />
            </div>
            <div class="item-right">
              <div class="count-num">{{ classifyCounts.condition }}</div>
              <span>当月新增条件</span>
            </div>
          </div>
        </div>
        <div class="condition-manage">
          <div class="condition-manage-left">
            <div class="warning-title">
              <div class="warning-title-content">
                <span>条件资源目录</span>
                <a-tooltip
                  placement="top"
                  overlayClassName="item-title-tooltip"
                >
                  <template slot="title">
                    <span>应用库表字段范围下载</span>
                  </template>
                  <icon-svg
                    icon-class="icon_download_white"
                    class="icon-download"
                    @click="handleDownload"
                  />
                </a-tooltip>
              </div>
              <div class="warning-icon">
                <a-icon
                  type="plus-square"
                  class="plus"
                  @click="
                    (e) => {
                      addList(e, '0-0');
                    }
                  "
                />
              </div>
            </div>
            <div>
              <a-tree
                show-icon
                :default-expanded-keys="['0-0']"
                @select="onSelect"
                :treeData="list"
                :icon="getIcon"
                :selectedKeys="selectedKeys"
                blockNode
                @rightClick="show"
              >
                <template slot="folder" slot-scope="item">
                  <div class="tree-view-item">
                    <span class="tree-view-left">{{ item.title }}</span>
                    <div class="tree-view-right">
                      <a-icon
                        type="plus-square"
                        class="btn"
                        @click="
                          (e) => {
                            addList(e, item.key);
                          }
                        "
                      />
                      <a-icon
                        type="delete"
                        class="btn"
                        @click="
                          (e) => {
                            deleteList(item, e);
                          }
                        "
                      />
                    </div>
                  </div>
                </template>
                <template slot="leaf" slot-scope="item">
                  <div class="tree-view-item">
                    <span class="tree-view-left">{{ item.title }}</span>
                    <div class="tree-view-right">
                      <a-icon
                        type="delete"
                        class="btn"
                        @click="
                          (e) => {
                            deleteList(item, e);
                          }
                        "
                      />
                    </div>
                  </div>
                </template>
              </a-tree>
            </div>
          </div>
          <div class="condition-manage-right">
            <div class="warning-title" v-if="!tableShow">
              <span>{{ rightTitle }}</span>
            </div>
            <div class="condition-content" v-if="tableShow">
              <div class="rule-options">
                <div class="rule-options-item">
                  <span class="item-label">条件名称：</span>
                  <a-input
                    type="text"
                    class="item-input"
                    v-model.trim="conditionName"
                    placeholder="请输入条件名称"
                  />
                </div>
                <div class="rule-options-item">
                  <span class="item-label">条件描述：</span>
                  <a-input
                    type="text"
                    class="item-input"
                    v-model.trim="conditionDesc"
                    placeholder="请输入条件描述"
                  />
                </div>
                <div class="rule-options-item">
                  <span class="item-label">条件生成方式：</span>
                  <a-select v-model="modeValue" class="item-input">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option :value="0">配置化</a-select-option>
                    <a-select-option :value="1">SQL</a-select-option>
                  </a-select>
                </div>
                <div class="rule-options-item">
                  <span class="item-label">最后修改人：</span>
                  <a-input
                    type="text"
                    class="item-input"
                    v-model.trim="updatePerson"
                    placeholder="请输入最后修改人"
                  />
                </div>
                <div class="rule-options-btns">
                  <a-button
                    type="primary"
                    @click="getConditionList('init')"
                    icon="search"
                  >
                    搜索
                  </a-button>
                  <a-button @click="onReset('init')">
                    <a-icon type="redo" :rotate="-90" /> 重置
                  </a-button>
                </div>
              </div>
              <div class="table-btns">
                <a-button
                  type="primary"
                  @click="handleAddCondition"
                  icon="plus-circle"
                >
                  添加
                </a-button>
                <a-button @click="onSearch('init')" icon="sync">刷新</a-button>
              </div>
              <!-- <p class="condition-table-title">
                当前条件子类型为<span class="title-blue">经营异常</span
                >，共有条件<span class="title-blue">72</span>条
              </p> -->
              <table-component
                :columns="columns"
                :data-source="tableValue"
                :rowKey="(record) => record.id"
                :pagination="pagination"
                :loading="tableLoading"
                class="condition-table"
              >
                <div slot="modeValue" slot-scope="record" class="way-slot">
                  <span
                    class="way-slot-item item-config"
                    v-if="record.modeValue === 0"
                    >配置化</span
                  >
                  <span class="way-slot-item item-sql" v-else>SQL</span>
                </div>
                <div slot="actions" slot-scope="record">
                  <a @click="handleEdit(record)">编辑</a>
                  <a @click="handleDelete(record)">删除</a>
                </div>
              </table-component>
            </div>
            <div class="condition-part" v-else>
              <div class="sub-title">基本信息</div>
              <div class="condition-details">
                <div class="condition-details-item">
                  <div class="item-box">
                    <div class="item-box-label">条件名称:</div>
                    <div class="item-box-content">
                      <a-input
                        allow-clear
                        type="text"
                        v-model.trim="checkData.conditionName"
                        placeholder="请输入条件名称"
                      />
                    </div>
                  </div>
                </div>
                <div class="condition-details-item">
                  <div class="item-box">
                    <div class="item-box-label">条件类型:</div>
                    <div class="item-box-content">
                      <a-select
                        allow-clear
                        :options="categoryOptions"
                        v-model="checkData.conditionType"
                        placeholder="请选择条件类型"
                        @change="handleChangeCategory"
                      />
                    </div>
                  </div>
                  <div class="item-box">
                    <div class="item-box-label">条件子类型:</div>
                    <div class="item-box-content">
                      <a-select
                        allow-clear
                        :options="categoryChildOptions"
                        v-model="checkData.conditionChildType"
                        placeholder="请选择条件子类型"
                      />
                    </div>
                  </div>
                </div>
                <div class="condition-details-item">
                  <div class="item-box textarea">
                    <div class="item-box-label">条件描述:</div>
                    <div class="item-box-content">
                      <a-textArea
                        allow-clear
                        type="text"
                        placeholder="请输入条件描述"
                        :auto-size="{ minRows: 3, maxRows: 3 }"
                        v-model.trim="checkData.conditionDesc"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="sub-title">条件模式选择</div>
              <div class="condition-config">
                <div class="condition-config-item">
                  <div class="item-label">模式选择:</div>
                  <div class="item-content">
                    <a-radio-group
                      :options="modeOptions"
                      v-model="checkData.modeValue"
                      @change="onModeChange"
                    />
                  </div>
                </div>
                <div class="condition-config-item">
                  <div class="item-label">条件内容:</div>
                  <div class="item-content">
                    <div
                      class="item-content-config"
                      v-if="checkData.modeValue === 0"
                    >
                      <div class="config-check" v-if="!toEdit">
                        <div class="config-content">
                          {{ checkData.sqlContent }}
                        </div>
                        <a-icon type="edit" @click="handleConfigEdit(true)" />
                      </div>
                      <div class="config-edit" v-else>
                        <div class="config-edit-item">
                          <a-button
                            class="config-edit-item-btn"
                            @click="handleSelectQuota(1)"
                            >{{ quotaName1 || "指标选择" }}</a-button
                          >
                        </div>
                        <div class="config-edit-item">
                          <a-select
                            allow-clear
                            :options="compareOperateOptions"
                            v-model="operator1"
                            placeholder="比较运算符"
                            class="config-edit-item-input"
                          />
                        </div>
                        <div class="config-edit-item" v-if="isShowTotal">
                          <a-button
                            class="config-edit-item-btn"
                            @click="handleSelectQuota(2)"
                            >{{ quotaName2 || "指标选择" }}</a-button
                          >
                        </div>
                        <div class="config-edit-item" v-if="isShowTotal">
                          <a-select
                            allow-clear
                            :options="arithmeticOperatorOptions"
                            v-model="operator2"
                            placeholder="请选择"
                            class="config-edit-item-input"
                          />
                        </div>
                        <div class="config-edit-item">
                          <a-input
                            type="text"
                            placeholder="请输入"
                            v-model="inputValue"
                            class="config-edit-item-input"
                          />
                        </div>
                        <a-icon
                          type="plus-circle"
                          v-if="!isShowTotal"
                          @click="handleShowTotal"
                        />
                        <a-icon
                          v-else
                          type="minus-circle"
                          @click="handleHideTotal"
                        />
                        <a-icon
                          type="rollback"
                          v-if="toEdit && rightTitle === '条件编辑'"
                          @click="handleConfigEdit(false)"
                        />
                      </div>
                    </div>
                    <div class="item-content-input" v-else>
                      <a-textArea
                        allow-clear
                        type="text"
                        placeholder="请输入SQL语句"
                        :auto-size="{ minRows: 3, maxRows: 3 }"
                        v-model.trim="checkData.sqlContent"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="condition-part-bottom">
                <a-button @click="handleCancel"> 取消 </a-button>
                <a-button @click="resetConditions"> 重置 </a-button>
                <a-button @click="saveInput" type="primary"> 保存 </a-button>
              </div>
            </div>
          </div>
          <a-modal
            :width="400"
            :visible="addModelShow"
            :destroyOnClose="true"
            @ok="saveAdd"
            @cancel="onCancel"
            :mask="false"
            centered
            :title="addModelTitle"
          >
            <a-input
              autoComplete="off"
              v-model.trim="nameValue"
              placeholder="请输入类型名称"
            />
          </a-modal>
          <a-modal
            :width="600"
            :visible="quotaModelShow"
            :destroyOnClose="true"
            @cancel="onQuotaCancel"
            :mask="false"
            centered
            title="指标选择"
          >
            <template slot="footer">
              <a-button key="back" @click="handleBack" v-if="current === 1">
                上一步
              </a-button>
              <a-button key="reset" @click="handleReset"> 重置 </a-button>
              <a-button
                key="next"
                type="primary"
                @click="handleNext"
                v-if="current === 0"
              >
                下一步
              </a-button>
              <a-button
                key="submit"
                type="primary"
                @click="handleSubmit"
                v-if="current === 1"
              >
                确定
              </a-button>
            </template>
            <div class="quota-modal-content">
              <a-steps :current="current">
                <a-step
                  v-for="step in stepList"
                  :key="step.title"
                  :title="step.title"
                />
              </a-steps>
              <div class="quota-modal-content-item" v-if="current === 0">
                <p class="item-title">请选择审计专题库表</p>
                <keep-alive>
                  <a-table
                    key="1"
                    :columns="columns1"
                    :data-source="tableValue1"
                    :rowKey="(record) => record.id"
                    :pagination="pagination1"
                    :row-selection="rowSelection1"
                    class="library-table"
                    :loading="tableLoading1"
                    bordered
                  >
                    <div
                      slot="filterDropdown"
                      slot-scope="{
                        setSelectedKeys,
                        selectedKeys,
                        confirm,
                        clearFilters,
                        column,
                      }"
                      style="padding: 8px"
                    >
                      <a-input
                        v-ant-ref="(c) => (searchInput = c)"
                        :placeholder="`搜索${column.title}`"
                        :value="selectedKeys[0]"
                        style="width: 188px; margin-bottom: 8px; display: block"
                        @change="
                          (e) =>
                            setSelectedKeys(
                              e.target.value ? [e.target.value] : []
                            )
                        "
                        @pressEnter="
                          () =>
                            handleSearch(
                              selectedKeys,
                              confirm,
                              column.dataIndex
                            )
                        "
                      />
                      <a-button
                        type="primary"
                        icon="search"
                        size="small"
                        style="width: 90px; margin-right: 8px"
                        @click="
                          () =>
                            handleSearch(
                              selectedKeys,
                              confirm,
                              column.dataIndex
                            )
                        "
                      >
                        查询
                      </a-button>
                      <a-button
                        size="small"
                        style="width: 90px"
                        @click="
                          () => handleInputReset(confirm, setSelectedKeys)
                        "
                      >
                        重置
                      </a-button>
                    </div>
                    <a-icon
                      slot="filterIcon"
                      slot-scope="filtered"
                      type="search"
                      :style="{ color: filtered ? '#108ee9' : undefined }"
                    />
                    <template
                      slot="name"
                      slot-scope="text, record, index, column"
                    >
                      <span
                        v-if="searchText && searchedColumn === column.dataIndex"
                      >
                        <template
                          v-for="(fragment, i) in text
                            .toString()
                            .split(
                              new RegExp(
                                `(?<=${searchText})|(?=${searchText})`,
                                'i'
                              )
                            )"
                        >
                          <mark
                            v-if="
                              fragment.toLowerCase() ===
                              searchText.toLowerCase()
                            "
                            :key="i"
                            class="highlight"
                            >{{ fragment }}</mark
                          >
                          <template v-else>{{ fragment }}</template>
                        </template>
                      </span>
                      <template v-else>
                        {{ text }}
                      </template>
                    </template>
                  </a-table>
                </keep-alive>
              </div>
              <div class="quota-modal-content-item" v-else>
                <p class="item-title">
                  当前审计专题库表名称：{{ selectedRowKeys1[0] }}
                </p>
                <keep-alive>
                  <a-table
                    key="2"
                    :columns="columns2"
                    :data-source="tableValue2"
                    :rowKey="(record) => record.id"
                    :pagination="pagination2"
                    :row-selection="rowSelection2"
                    class="library-table"
                    :loading="tableLoading2"
                    bordered
                  >
                    <div
                      slot="filterDropdown"
                      slot-scope="{
                        setSelectedKeys,
                        selectedKeys,
                        confirm,
                        clearFilters,
                        column,
                      }"
                      style="padding: 8px"
                    >
                      <a-input
                        v-ant-ref="(c) => (searchInput = c)"
                        :placeholder="`搜索${column.title}`"
                        :value="selectedKeys[0]"
                        style="width: 188px; margin-bottom: 8px; display: block"
                        @change="
                          (e) =>
                            setSelectedKeys(
                              e.target.value ? [e.target.value] : []
                            )
                        "
                        @pressEnter="
                          () =>
                            handleSearch(
                              selectedKeys,
                              confirm,
                              column.dataIndex
                            )
                        "
                      />
                      <a-button
                        type="primary"
                        icon="search"
                        size="small"
                        style="width: 90px; margin-right: 8px"
                        @click="
                          () =>
                            handleSearch(
                              selectedKeys,
                              confirm,
                              column.dataIndex
                            )
                        "
                      >
                        Search
                      </a-button>
                      <a-button
                        size="small"
                        style="width: 90px"
                        @click="
                          () => handleInputReset(confirm, setSelectedKeys)
                        "
                      >
                        Reset
                      </a-button>
                    </div>
                    <a-icon
                      slot="filterIcon"
                      slot-scope="filtered"
                      type="search"
                      :style="{ color: filtered ? '#108ee9' : undefined }"
                    />
                    <template
                      slot="name"
                      slot-scope="text, record, index, column"
                    >
                      <span
                        v-if="searchText && searchedColumn === column.dataIndex"
                      >
                        <template
                          v-for="(fragment, i) in text
                            .toString()
                            .split(
                              new RegExp(
                                `(?<=${searchText})|(?=${searchText})`,
                                'i'
                              )
                            )"
                        >
                          <mark
                            v-if="
                              fragment.toLowerCase() ===
                              searchText.toLowerCase()
                            "
                            :key="i"
                            class="highlight"
                            >{{ fragment }}</mark
                          >
                          <template v-else>{{ fragment }}</template>
                        </template>
                      </span>
                      <template v-else>
                        {{ text }}
                      </template>
                    </template>
                  </a-table>
                </keep-alive>
              </div>
            </div>
          </a-modal>
          <right-menu
            :show="rightMenuShow"
            @onMenuClick="onContextMenuClick"
            :contextMenuData="contextMenuData"
          />
        </div>
      </template>
    </MainContent>
  </div>
</template>
<script>
import MainContent from "@/components/mainContent";
import RightMenu from "@/components/rightMenu";
import TableComponent from "@/components/tableComponent";
import {
  addOrUpdateCategory,
  dataSourceId,
  delCondition,
  delConditionCategory,
  gerTreeConditionCategory,
  getDataSourceTables,
  getDataSourceTablesField,
  queryConditionByPage,
  saveOrUpdateCondition,
} from "@/shared/api/auditManage.js";
import { modalConfirm } from "@/utils/common.js";
import {
  Button,
  Icon,
  Input,
  Radio,
  Steps,
  Table,
  Tooltip,
  Tree,
} from "ant-design-vue";
import { find } from "lodash";
import { mapState } from "vuex";

const { TextArea } = Input;
const { Group } = Radio;
const { Step } = Steps;

export default {
  name: "ConditionManage",
  data() {
    return {
      keywords: "",
      selectedKeys: [],
      list: [
        {
          title: "全部",
          key: "0-0",
          level: 0,
          children: [],
        },
      ],
      columns: [
        {
          title: "条件名称",
          dataIndex: "conditionName",
          key: "conditionName",
          width: 130,
        },
        {
          title: "条件类型",
          dataIndex: "conditionTypeName",
          key: "conditionTypeName",
          width: 130,
        },
        {
          title: "条件子类型",
          dataIndex: "conditionChildTypeName",
          key: "conditionChildTypeName",
          width: 140,
        },
        {
          title: "条件描述",
          dataIndex: "conditionDesc",
          key: "conditionDesc",
          width: 170,
        },
        {
          title: "条件生成方式",
          dataIndex: "modeValue",
          key: "modeValue",
          width: 140,
          scopedSlots: { customRender: "modeValue" },
        },
        {
          title: "最后修改人",
          dataIndex: "updatePerson",
          key: "updatePerson",
          width: 140,
        },
        {
          title: "最后修改时间",
          dataIndex: "updateTime",
          key: "updateTime",
          width: 191,
        },
        {
          title: "操作",
          dataIndex: "actions",
          key: "actions",
          width: 130,
          scopedSlots: { customRender: "actions" },
        },
      ],
      columns1: [
        {
          title: "中文表名",
          dataIndex: "desc",
          key: "desc",
          width: 241,
          scopedSlots: {
            customRender: "desc",
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
          },
          onFilter: (value, record) =>
            record.desc.toString().toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              }, 0);
            }
          },
        },
        {
          title: "英文表名",
          dataIndex: "name",
          key: "name",
          width: 241,
          scopedSlots: {
            customRender: "name",
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
          },
          onFilter: (value, record) =>
            record.name.toString().toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              }, 0);
            }
          },
        },
      ],
      columns2: [
        {
          title: "字段名",
          dataIndex: "name",
          key: "name",
          width: 276,
          scopedSlots: {
            customRender: "name",
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
          },
          onFilter: (value, record) =>
            record.name.toString().toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              }, 0);
            }
          },
        },
        {
          title: "字段描述",
          dataIndex: "desc",
          key: "desc",
          width: 200,
        },
      ],
      searchText: "",
      searchInput: null,
      searchedColumn: "",
      pagination: {
        size: "small",
        total: 0,
        current: 1,
        pageSize: 10,
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
          this.getConditionList("repeat");
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = 1;
          this.pagination.pageSize = size;
          this.getConditionList("repeat");
        },
      },
      pagination1: {
        size: "small",
        total: 0,
        current: 1,
        pageSize: 5,
        onChange: (page, pageSize) => {
          this.pagination1.current = page;
          this.pagination1.pageSize = pageSize;
        },
        onShowSizeChange: (current, size) => {
          this.pagination1.current = 1;
          this.pagination1.pageSize = size;
        },
      },
      pagination2: {
        size: "small",
        total: 0,
        current: 1,
        pageSize: 5,
        onChange: (page, pageSize) => {
          this.pagination2.current = page;
          this.pagination2.pageSize = pageSize;
        },
        onShowSizeChange: (current, size) => {
          this.pagination2.current = 1;
          this.pagination2.pageSize = size;
        },
      },
      tableLoading: false,
      tableLoading1: false,
      tableLoading2: false,
      tableValue: [],
      tableValue1: [],
      tableValue2: [],
      addModelShow: false,
      addModelTitle: "",
      treeData: undefined,
      nameValue: undefined,
      rightTitle: "条件列表",
      tableShow: true,
      compareOperateOptions: [
        {
          label: "=",
          value: "=",
        },
        {
          label: ">",
          value: ">",
        },
        {
          label: ">=",
          value: ">=",
        },
        {
          label: "<",
          value: "<",
        },
        {
          label: "<=",
          value: "<=",
        },
        {
          label: "!=",
          value: "!=",
        },
      ], // 比较运算符
      arithmeticOperatorOptions: [
        {
          label: "*",
          value: "*",
        },
        {
          label: "/",
          value: "/",
        },
        {
          label: "+",
          value: "+",
        },
        {
          label: "-",
          value: "-",
        },
      ], // 算术运算符
      modeOptions: [
        {
          label: "图形化配置",
          value: 0,
        },
        {
          label: "SQL语句输入",
          value: 1,
        },
      ],
      toEdit: false,
      checkData: {},
      quotaName1: undefined,
      quotaName2: undefined,
      operator1: undefined,
      operator2: undefined,
      inputValue: undefined,
      isShowTotal: false,
      quotaModelShow: false,
      current: 0,
      stepList: [
        {
          title: "选择专题库表",
        },
        {
          title: "选择字段",
        },
      ],
      categoryOptions: [],
      categoryChildOptions: [],
      quotaIndex: undefined,
      selectedRowKeys1: [],
      selectedRowKeys2: [],
      tableName1: undefined,
      tableName2: undefined,
      fieldName1: undefined,
      fieldName2: undefined,
      categoryId: undefined,
      rightMenuShow: false,
      contextMenuData: {},
      selectKey: undefined, // 用于按钮操作时表示选择的key
      conditionName: undefined,
      conditionDesc: undefined,
      modeValue: "",
      updatePerson: undefined,
      process: false, // 是否正在调用接口
    };
  },
  components: {
    AButton: Button,
    AIcon: Icon,
    AInput: Input,
    ARadioGroup: Group,
    AStep: Step,
    ASteps: Steps,
    ATable: Table,
    ATextArea: TextArea,
    ATree: Tree,
    ATooltip: Tooltip,
    MainContent,
    RightMenu,
    TableComponent,
  },
  computed: {
    rowSelection1() {
      return {
        key: "1",
        columnTitle: "选择",
        columnWidth: 70,
        selectedRowKeys: this.selectedRowKeys1,
        onChange: (selectedRowKeys) => {
          this.selectedRowKeys1 = selectedRowKeys;
          if (this.quotaIndex === 1) {
            this.tableName1 = selectedRowKeys[0];
          } else {
            this.tableName2 = selectedRowKeys[0];
          }
        },
        type: "radio",
      };
    },
    rowSelection2() {
      return {
        key: "2",
        columnTitle: "选择",
        columnWidth: 70,
        selectedRowKeys: this.selectedRowKeys2,
        onChange: (selectedRowKeys) => {
          this.selectedRowKeys2 = selectedRowKeys;
          if (this.quotaIndex === 1) {
            this.fieldName1 = selectedRowKeys[0];
          } else {
            this.fieldName2 = selectedRowKeys[0];
          }
        },
        type: "radio",
      };
    },
    ...mapState("auditOptions", ["classifyCounts"]),
  },
  mounted() {
    setTimeout(() => {
      window.addEventListener("click", this.clickOther);
    }, 100);
    this.getConditionCategory();
    this.getConditionList("init");
  },
  beforeDestroy() {
    window.onresize = null;
    window.removeEventListener("click", this.clickOther);
  },
  methods: {
    show(e) {
      e.event.stopPropagation();
      let menuList = [];
      if (e.node.dataRef.level === 0) {
        // 全部
        menuList = [
          {
            key: "addChild",
            title: "添加子类型",
          },
        ];
      } else if (e.node.dataRef.level === 1) {
        // 该分类是一级分类
        menuList = [
          {
            key: "addChild",
            title: "添加子类型",
          },
          {
            key: "addBrother",
            title: "添加同级类型",
          },
          {
            key: "delete",
            title: "删除",
          },
        ];
      } else {
        // 该分类已经是二级分类了，不能再添加子分类了
        menuList = [
          {
            key: "addCondition",
            title: "添加条件",
          },
          {
            key: "addBrother",
            title: "添加同级类型",
          },
          {
            key: "delete",
            title: "删除",
          },
        ];
      }
      const menuData = {
        position: {
          x: e.event.pageX,
          y: e.event.pageY,
        },
        context: menuList,
      };
      this.contextMenuData = menuData;
      this.rightMenuShow = true;
      this.treeData = {
        parent: e.node.$parent.dataRef,
        children: e.node.dataRef,
      };
    },
    clickOther() {
      this.rightMenuShow = false;
    },
    getIcon(props) {
      const { isLeaf, expanded } = props;
      if (isLeaf) {
        return <a-icon type="file" />;
      }
      return <a-icon type={expanded ? "folder-open" : "folder"} />;
    },
    async saveAdd() {
      let parentId = -1;
      if (this.selectKey) {
        parentId = this.selectKey === "0-0" ? -1 : this.selectKey;
      } else {
        if (this.addModelTitle === "添加子类型") {
          parentId = this.treeData.children.key;
        } else {
          parentId = (this.treeData.parent && this.treeData.parent.key) || -1;
        }
      }
      const json = {
        parentId,
        categoryName: this.nameValue,
      };
      this.onCancel();
      const loading = this.$message.loading("正在添加", 0);
      const res = await addOrUpdateCategory(json);
      if (res.message === "成功") {
        await this.getConditionCategory();
        loading();
        this.$message.success("添加成功");
      } else {
        loading();
        this.$message.error(`${res.message}`);
      }
    },
    onCancel() {
      this.addModelShow = false;
      this.nameValue = undefined;
    },
    onContextMenuClick(event) {
      event.domEvent.stopPropagation();
      const menuKey = event.key;
      const _that = this;
      const title = `确定要删除 ${_that.treeData.children.title} 吗？`;
      const onOk = async () => {
        const loading = _that.$message.loading("正在删除", 0);
        const res = await delConditionCategory(_that.treeData.children.key);
        if (res.message === "成功") {
          await _that.getConditionCategory();
          loading();
          _that.$message.success("删除成功");
        } else {
          loading();
          _that.$message.error(`${res.message}`);
        }
      };
      this.rightMenuShow = false;
      switch (menuKey) {
        case "addChild":
          _that.addModelTitle = "添加子类型";
          _that.addModelShow = true;
          break;
        case "addBrother":
          _that.addModelTitle = "添加同级类型";
          _that.addModelShow = true;
          break;
        case "addCondition":
          this.handleAddCondition();
          break;
        case "delete":
          modalConfirm(title, _that, onOk);
          break;

        default:
          break;
      }
    },
    addList(e, key) {
      e.stopPropagation();
      this.selectKey = key;
      this.addModelTitle = "添加子类型";
      this.addModelShow = true;
    },
    handleAddCondition() {
      let target = undefined;
      if (this.treeData) {
        target = find(
          this.list[0].children,
          (v) => v.key === this.treeData.parent.key
        );
      }
      this.rightTitle = "新建条件";
      this.tableShow = false;
      this.checkData = {
        conditionName: undefined,
        conditionType: (this.treeData && this.treeData.parent.key) || undefined,
        conditionChildType:
          (this.treeData && this.treeData.children.key) || undefined,
        conditionDesc: undefined,
        modeValue: 0,
        sqlContent: undefined,
      };
      this.toEdit = true;
      this.isShowTotal = false;
      this.categoryChildOptions =
        (target &&
          target.children.map((child) => {
            return {
              label: child.title,
              value: child.key,
            };
          })) ||
        [];
    },
    deleteList(item, e) {
      e.stopPropagation();
      const _that = this;
      const title = `确定要删除 ${item.title} 吗？`;
      const onOk = async () => {
        const loading = _that.$message.loading("正在删除", 0);
        const res = await delConditionCategory(item.key);
        if (res.message === "成功") {
          await _that.getConditionCategory();
          loading();
          _that.$message.success("删除成功");
        } else {
          loading();
          _that.$message.error(`${res.message}`);
        }
      };
      modalConfirm(title, _that, onOk);
    },
    handleEdit(record) {
      this.toEdit = false;
      this.checkData = record;
      this.checkData.sqlContent = record.dsList[0].sqlContext;
      this.rightTitle = "条件编辑";
      this.tableShow = false;
      const target = find(
        this.list[0].children,
        (v) => v.key === record.conditionType
      );
      this.categoryChildOptions = target.children.map((child) => {
        return {
          label: child.title,
          value: child.key,
        };
      });
    },
    handleDelete(record) {
      const _that = this;
      const title = `确定要删除 ${record.conditionName} 吗？`;
      const onOk = async () => {
        const loading = _that.$message.loading("正在删除", 0);
        const res = await delCondition(record.id);
        loading();
        if (res.message === "成功") {
          _that.$message.success("删除成功");
          this.getConditionList("init");
        } else {
          _that.$message.error(`${res.message}`);
        }
      };
      modalConfirm(title, _that, onOk);
    },
    onModeChange(e) {
      this.$set(this.checkData, "modeValue", e.target.value);
    },
    handleConfigEdit(value) {
      this.toEdit = value;
    },
    handleShowTotal() {
      this.isShowTotal = true;
    },
    handleHideTotal() {
      this.isShowTotal = false;
    },
    handleCancel() {
      this.tableShow = true;
      this.resetConditions();
    },
    resetConditions() {
      this.checkData = {
        conditionName: undefined,
        conditionType: undefined,
        conditionChildType: undefined,
        conditionDesc: undefined,
        modeValue: 0,
        sqlContent: undefined,
      };
      this.toEdit = true;
      this.isShowTotal = false;
      this.quotaIndex = undefined;
      this.selectedRowKeys1 = [];
      this.selectedRowKeys2 = [];
      this.operator1 = undefined;
      this.operator2 = undefined;
      this.quotaName1 = undefined;
      this.quotaName2 = undefined;
      this.tableName1 = undefined;
      this.tableName2 = undefined;
      this.fieldName1 = undefined;
      this.fieldName2 = undefined;
      this.inputValue = undefined;
    },
    async saveInput() {
      if (this.process) {
        return false;
      }
      this.process = true;
      if (
        this.checkData.conditionName === "" ||
        !this.checkData.conditionName
      ) {
        this.$message.error("条件名称不可为空！");
        return false;
      }
      if (!this.checkData.conditionType) {
        this.$message.error("条件类型不可为空！");
        return false;
      }
      if (!this.checkData.conditionChildType) {
        this.$message.error("条件子类型不可为空！");
        return false;
      }
      let dsList = [];
      if (this.checkData.modeValue === 0) {
        const reg = /^(-?\d+)(\.\d+)?$/; // 判断是否是纯数字（浮点数）
        // 配置化
        if (this.isShowTotal) {
          if (!this.quotaName1) {
            this.$message.error("请选择第一个指标！");
            return false;
          }
          if (!this.quotaName2) {
            this.$message.error("请选择第二个指标！");
            return false;
          }
          if (!this.operator1) {
            this.$message.error("请选择比较运算符！");
            return false;
          }
          if (this.inputValue && !this.operator2) {
            this.$message.error("请选择算术运算符！");
            return false;
          }
          if (this.operator2 && !this.inputValue) {
            this.$message.error("请输入值！");
            return false;
          }
          dsList.push({
            dsId: dataSourceId,
            conOrder: "1",
            fieldName: this.quotaName1,
            dsDbTable: this.tableName1,
            dsDb: "db_pierce_dev",
          });
          if (this.inputValue || this.operator2) {
            // 如果有第二个操作符或者有输入
            dsList.push({
              dsId: dataSourceId,
              conOrder: "2",
              fieldName: this.quotaName2,
              dsDbTable: this.tableName2,
              dsDb: "db_pierce_dev",
              exOperate: this.operator1,
            });
            let exAdditional = undefined;
            if (reg.test(this.inputValue)) {
              // 纯数字
              exAdditional = this.operator2 + this.inputValue;
            } else {
              exAdditional = this.operator2 + `'${this.inputValue}'`;
            }
            dsList.push({
              conOrder: "3",
              exAdditional,
            });
          } else {
            dsList.push({
              dsId: dataSourceId,
              conOrder: "2",
              fieldName: this.quotaName2,
              dsDbTable: this.tableName2,
              dsDb: "db_pierce_dev",
              exOperate: this.operator1,
            });
          }
        } else {
          if (!this.quotaName1) {
            this.$message.error("请选择指标！");
            return false;
          }
          if (!this.operator1) {
            this.$message.error("请选择比较运算符！");
            return false;
          }
          if (!this.inputValue) {
            this.$message.error("请输入值！");
            return false;
          }
          dsList.push({
            dsId: dataSourceId,
            conOrder: "1",
            fieldName: this.quotaName1,
            dsDbTable: this.tableName1,
            dsDb: "db_pierce_dev",
          });
          let exAdditional = undefined;
          if (reg.test(this.inputValue)) {
            // 纯数字
            exAdditional = this.operator1 + this.inputValue;
          } else {
            exAdditional = this.operator1 + `'${this.inputValue}'`;
          }
          dsList.push({
            conOrder: "2",
            exAdditional,
          });
        }
      } else {
        // sql
        if (!this.checkData.sqlContent || this.checkData.sqlContent === "") {
          this.$message.error("sql语句不可为空！");
          return false;
        } else {
          dsList.push({
            conOrder: 1,
            sqlContext: this.checkData.sqlContent,
          });
        }
      }
      const json = {
        id: this.rightTitle === "条件编辑" ? this.checkData.id : null,
        conditionName: this.checkData.conditionName,
        categoryId: this.checkData.conditionChildType,
        conditionDesc: this.checkData.conditionDesc,
        conType: this.checkData.modeValue,
        dsList,
      };
      const res = await saveOrUpdateCondition(json);
      this.process = false;
      if (res.message === "成功") {
        const message =
          this.rightTitle === "条件编辑" ? "修改成功" : "添加成功";
        this.$message.success(`${message}`);
        this.handleCancel();
        this.getConditionList("init");
      } else {
        this.$message.error(`${res.message}`);
      }
    },
    handleSelectQuota(type) {
      this.quotaIndex = type;
      this.quotaModelShow = true;
      this.searchText = ""; // 重置搜索内容，防止打开第二个弹窗时，表格内容有数据依然高亮
      this.getDataSourceTables();
    },
    onQuotaCancel() {
      this.quotaModelShow = false;
      this.selectedRowKeys1 = [];
      this.selectedRowKeys2 = [];
      this.current = 0;
    },
    handleReset() {
      if (this.current === 1) {
        this.selectedRowKeys2 = [];
        if (this.quotaIndex === 1) {
          this.fieldName1 = undefined;
        } else {
          this.fieldName2 = undefined;
        }
      } else {
        this.selectedRowKeys1 = [];
        if (this.quotaIndex === 1) {
          this.tableName1 = undefined;
        } else {
          this.tableName2 = undefined;
        }
      }
    },
    handleBack() {
      this.current = 0;
    },
    handleNext() {
      if (this.quotaIndex === 1) {
        if (!this.tableName1) {
          this.$message.info("请选择一个专题库表！");
        } else {
          this.current = 1;
          this.getDataSourceTablesField();
        }
      } else {
        if (!this.tableName2) {
          this.$message.info("请选择一个专题库表！");
        } else {
          this.current = 1;
          this.getDataSourceTablesField();
        }
      }
    },
    handleSubmit() {
      if (this.quotaIndex === 1) {
        if (!this.fieldName1) {
          return this.$message.info("请选择字段");
        }
        this.quotaName1 = this.fieldName1;
      } else {
        if (!this.fieldName2) {
          return this.$message.info("请选择字段");
        }
        this.quotaName2 = this.fieldName2;
      }
      this.onQuotaCancel();
    },
    handleSearch(selectedKeys, confirm, dataIndex) {
      console.log("handleSearch", selectedKeys, confirm, dataIndex);
      confirm();
      this.searchText = selectedKeys[0];
      this.searchedColumn = dataIndex;
      this.pagination1.pageSize = 5;
    },
    handleInputReset(confirm, setSelectedKeys) {
      this.searchText = "";
      setSelectedKeys([]);
      this.handleSearch([], confirm, "name");
    },
    async getConditionCategory() {
      const res = await gerTreeConditionCategory();
      if (res.message === "成功") {
        const list = this.getAllchildren(res.data, 1);
        this.$set(this.list[0], "children", list);
        const categoryOptions = list.map((item) => {
          return {
            label: item.title,
            value: item.key,
          };
        });
        this.categoryOptions = categoryOptions;
      } else {
        this.$message.error("查询条件分类失败，请重试");
      }
    },
    getAllchildren(arr, level) {
      const list = arr.map((item) => {
        let children = [];
        let isLeaf = level > 1 ? true : false;
        if (item.children.length) {
          children = this.getAllchildren(item.children, 2);
        }
        return {
          title: item.categoryName,
          key: item.id,
          children,
          isLeaf,
          level,
          scopedSlots: { title: isLeaf ? "leaf" : "folder" },
        };
      });
      return list;
    },
    async getConditionList(type) {
      this.tableLoading = true;
      if (type === "init") {
        this.$set(this.pagination, "current", 1);
      }
      const json = {
        categoryId: this.categoryId,
        conditionName: this.conditionName,
        status: "",
        conType: this.modeValue,
        updatePerson: this.updatePerson,
        conditionDesc: this.conditionDesc,
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
      };
      const res = await queryConditionByPage(json);
      this.tableLoading = false;
      if (res.message === "成功") {
        this.$set(this.pagination, "total", parseInt(res.data.totalCount));
        const tableValue = res.data.dateList.map((item) => {
          return {
            id: item.id,
            conditionName: item.conditionName,
            conditionType: item.parentId,
            conditionTypeName: item.parentCategoryName,
            conditionChildType: item.categoryId,
            conditionChildTypeName: item.categoryName,
            conditionDesc: item.conditionDesc,
            modeValue: item.conType,
            updatePerson: item.updateUser,
            updateTime: item.updateDate,
            dsList: item.dsList,
          };
        });
        this.tableValue = tableValue;
      }
    },
    onReset() {
      console.log("reset");
      this.conditionName = undefined;
      this.modeValue = "";
      this.updatePerson = undefined;
      this.conditionDesc = undefined;
      this.getConditionList("init");
    },
    async getDataSourceTables() {
      this.tableLoading1 = true;
      const res = await getDataSourceTables();
      this.tableLoading1 = false;
      if (res.message === "成功") {
        const tableValue1 = [];
        for (let i in res.data) {
          const value = res.data[i];
          tableValue1.push({
            id: i,
            name: i,
            desc: value,
          });
        }
        this.tableValue1 = tableValue1;
      } else {
        this.$message.error("获取专题库表失败");
        this.tableValue1 = [];
      }
    },
    async getDataSourceTablesField() {
      this.tableLoading2 = true;
      const tableName =
        this.quotaIndex === 1 ? this.tableName1 : this.tableName2;
      const res = await getDataSourceTablesField(tableName);
      this.tableLoading2 = false;
      if (res.message === "成功") {
        const tableValue2 = [];
        for (let i in res.data) {
          const value = res.data[i];
          tableValue2.push({
            id: i,
            name: i,
            desc: value,
          });
        }
        this.tableValue2 = tableValue2;
      } else {
        this.$message.error("获取专题库表失败");
        this.tableValue2 = [];
      }
    },
    handleChangeCategory(value) {
      this.$set(this.checkData, "conditionType", value);
      this.$set(this.checkData, "conditionChildType", undefined);
      const target = find(this.list[0].children, (v) => v.key === value);
      this.categoryChildOptions = target.children.map((child) => {
        return {
          label: child.title,
          value: child.key,
        };
      });
    },
    onSelect(selectedKeys, e) {
      this.treeData = {
        parent: e.node.$parent.dataRef,
        children: e.node.dataRef,
      };
      if (!e.node.isLeaf) {
        e.node.onExpand();
      } else {
        this.selectedKeys = selectedKeys;
        this.categoryId = selectedKeys[0];
        this.getConditionList("init");
      }
    },
    async handleDownload() {
      let aLink = document.createElement("a");
      aLink.href =
        "http://10.83.70.215:19100/pierce/warningRule/batchDownLoad?path=/media/rule-file/应用库表字段范围.pdf";
      let evt = new MouseEvent("click", {
        view: window,
        bubbles: false,
        cancelable: true,
      });
      evt.initEvent("click", false, false);
      aLink.download = "应用库表字段范围.pdf";
      document.body.appendChild(aLink);
      aLink.dispatchEvent(evt);
      window.setTimeout(() => {
        document.body.removeChild(aLink);
        aLink = null;
        evt = null;
      });
    },
  },
};
</script>
<style lang="less">
.condition-layout {
  height: 100%;
  width: 100%;

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

  .condition-manage {
    display: flex;
    min-height: 500px;
    padding-top: 24px;
    height: calc(100% - 104px);

    &-left {
      width: 320px;
      padding: 24px;
      overflow-y: auto;
      overflow-x: hidden;
      background: #fff;
      margin-right: 20px;
      border-radius: 5px;
      // box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);

      .warning-title {
        // height: 60px;
        line-height: 24px;
        font-size: 16px;
        position: relative;
        font-weight: 600;
        padding-left: 5px;
        padding-bottom: 15px;
        margin-bottom: 16px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.15);

        &-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .icon-download {
          width: 16px;
          height: 16px;
        }

        .warning-icon {
          top: 70px;
          right: 10px;
          z-index: 10;
          display: flex;
          position: absolute;

          .folder {
            margin-left: 10px;
            color: @activeFontColor;
            font-size: 18px;
          }
          .plus {
            color: @activeFontColor;
            font-size: 16px;
          }
        }
      }

      .ant-tree {
        position: relative;

        .ant-tree-title,
        .tree-view-left {
          user-select: none;
        }

        .ant-tree-switcher {
          .ant-tree-switcher-icon {
            position: absolute;
            top: 50%;
            transform: translateY(-50%) !important;
          }
        }

        .ant-tree-child-tree {
          li,
          .ant-tree-treenode-switcher-open,
          .ant-tree-treenode-switcher-close {
            .ant-tree-node-content-wrapper {
              width: calc(100% - 24px);

              .ant-tree-title {
                padding-right: 5px;
                width: calc(100% - 24px);
                display: inline-block;

                .tree-view-item {
                  display: flex;

                  .tree-view-left {
                    flex: 1;
                    height: 24px;
                    overflow: hidden;
                    white-space: nowrap;
                    display: inline-block;
                    width: calc(100% - 53px);
                    text-overflow: ellipsis;

                    &.ant-input {
                      width: 100%;
                      padding-left: 8px;
                      padding-right: 30px;
                    }
                  }

                  .tree-view-right {
                    display: none;

                    .btn {
                      color: @activeFontColor;

                      &:not(:first-child) {
                        margin-left: 5px;
                      }
                    }

                    .anticon-close-circle {
                      color: @blue;
                    }
                    .anticon-check-circle {
                      color: @blue;
                      margin-left: 2px;
                    }
                  }
                }
              }

              &:hover {
                .tree-view-right {
                  display: block !important;
                }
              }
            }
          }
        }
      }
    }

    &-right {
      position: relative;
      width: calc(100% - 340px);
      height: 100%;
      background: #fff;
      padding: 16px;
      overflow-y: auto;
      overflow-x: hidden;
      // box-shadow: 0 0 3px rgba(0, 0, 0, 0.16);
      border-radius: 5px;

      .warning-title {
        color: #000;
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 16px;
      }

      .condition-part {
        overflow: auto;
        padding-bottom: 36px;
        height: calc(100% - 54px);

        &-bottom {
          position: absolute;
          bottom: 10px;
          right: 0;
          padding-top: 10px;
          left: 0;
          display: flex;
          justify-content: flex-end;
          border-top: 1px solid #eee;
          padding-right: 24px;
          background: #fff;

          .ant-btn {
            margin-left: 16px;
          }
        }
      }

      .condition-details {
        &-item {
          display: flex;
          margin-bottom: 16px;

          .item-box {
            display: flex;
            line-height: 35px;
            margin-right: 45px;
            width: calc((100% - 45px) / 2);
            max-width: 360px;

            &-label {
              width: 65px;
              margin-right: 10px;
            }

            &-content {
              width: calc(100% - 75px);

              .ant-select {
                width: 100%;
              }
            }

            &:nth-child(2) {
              margin-right: 0;

              .item-box-label {
                width: 80px;
              }

              .item-box-content {
                width: calc(100% - 90px);
              }
            }

            &.textarea {
              width: 100%;
              max-width: 765px;
              margin-right: 0;
            }
          }
        }
      }

      .condition-config {
        &-item {
          display: flex;
          line-height: 32px;
          margin-bottom: 16px;

          .item-label {
            width: 65px;
            margin-right: 10px;
          }

          .item-content {
            width: calc(100% - 75px);

            &-config {
              .config-check {
                display: flex;
                align-items: center;

                .config-content {
                  margin-right: 10px;
                }

                .anticon-edit {
                  color: @blue;
                  cursor: pointer;
                }
              }

              .config-edit {
                display: flex;
                align-items: center;

                &-item {
                  margin-right: 8px;

                  &-btn {
                    color: @blue;
                    border-color: @blue;
                  }

                  &-input {
                    width: 120px;
                  }
                }

                .anticon-plus-circle,
                .anticon-rollback,
                .anticon-minus-circle {
                  color: @blue;
                }

                .anticon-rollback {
                  margin-left: 8px;
                }
              }
            }
          }
        }
      }

      .condition-content {
        height: 100%;
        display: flex;
        flex-direction: column;

        .rule-options {
          display: flex;
          flex-wrap: wrap;
          margin-bottom: 16px;
          border-bottom: 1px dashed #e2e3e6;

          &-item {
            width: 20%;
            min-width: 200px;
            max-width: 300px;
            margin-bottom: 16px;
            margin-right: 16px;
            display: flex;
            align-items: center;

            .item-label {
              width: 95px;
            }

            .item-input {
              width: calc(100% - 75px);
            }

            &:nth-child(3) {
              .item-label {
                width: 110px;
              }

              .item-input {
                width: calc(100% - 110px);
              }
            }

            &:nth-child(4) {
              .item-label {
                width: 100px;
              }

              .item-input {
                width: calc(100% - 100px);
              }
            }
          }

          &-btns {
            margin-bottom: 16px;

            .ant-btn-primary {
              margin-right: 16px;
            }
          }
        }

        .condition-table-title {
          line-height: 22px;
          padding-bottom: 16px;
          color: #8c8c8c;

          .title-blue {
            color: @activeFontColor;
          }
        }

        .table-btns {
          margin-bottom: 16px;

          .ant-btn {
            margin-right: 16px;
          }
        }

        .condition-table {
          flex: 1;
          height: calc(100% - 183px);

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

.quota-modal-content {
  .ant-steps {
    width: 360px;
    margin: 0 auto;
  }

  &-item {
    margin-top: 24px;

    .item-title {
      margin-bottom: 8px;
      color: @secondaryTextColor;
    }

    .library-table {
      .ant-table-thead {
        .ant-table-row-cell-break-word {
          font-weight: 600;
          color: @secondaryTextColor;
          padding: 8px 20px !important;
        }
      }

      .ant-table-row-cell-break-word {
        color: @primaryTextColor;
        padding: 8px 20px !important;
      }

      .ant-pagination {
        float: none;
        text-align: center;
      }
    }
  }
}

.ant-btn-sm {
  height: 32px;
}
</style>
