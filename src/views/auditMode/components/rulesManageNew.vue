<template>
  <div class="rules-manage-new">
    <div class="rules-manage-new-left" v-if="!addRuleVisible">
      <div class="warning-title">
        <span>规则目录</span>
      </div>
      <div class="keywords-search">
        <a-input
          allow-clear
          v-model.trim="keywords"
          autoComplete="off"
          class="keywords-input"
          placeholder="请输入规则关键词"
        />
        <a-button class="keywords-btn" icon="search" />
      </div>
      <a-tree
        show-icon
        :tree-data="list"
        :icon="getIcon"
        blockNode
        @select="onSelect"
        @rightClick="show"
      >
        <template slot="leaf" slot-scope="item">
          <div class="tree-view-item">
            <span class="tree-view-left">{{ item.title }}</span>
          </div>
        </template>
        <template #title="{ key: treeKey, title }">
          <a-dropdown :trigger="['contextmenu']">
            <span>{{ title }}</span>
            <template #overlay>
              <a-menu
                @click="
                  ({ key: menuKey }) => onContextMenuClick(treeKey, menuKey)
                "
              >
                <a-menu-item :key="item.key" v-for="item in menuList">
                  {{ item.title }}</a-menu-item
                >
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </a-tree>
    </div>
    <div
      class="rules-manage-new-right"
      v-if="!addRuleVisible"
      ref="contentRight"
    >
      <div class="warning-title">
        <span>{{ rightTitle }}</span>
      </div>
      <table-component
        v-if="tableShow"
        :columns="columns"
        :data-source="tableValue"
        :rowKey="(record) => record.id"
        :pagination="pagination"
        class="rule-table"
        :loading="tableLoading"
        :scroll="{ x: 'max-content', y: `${tableHeight}px` }"
      >
        <div slot="modeValue" slot-scope="record" class="way-slot">
          <span class="way-slot-item item-config" v-if="record.modeValue === 0"
            >配置化</span
          >
          <span class="way-slot-item item-sql" v-else>SQL</span>
        </div>
        <div slot="actions" slot-scope="record">
          <a @click="startRule(record)" v-if="record.status == 0">停用</a>
          <a @click="startRule(record)" v-else>启用</a>
          <a @click="handleEdit(record)" v-if="record.status === 1">编辑</a>
          <a @click="handleDelete(record)" v-if="record.status === 1">删除</a>
          <a @click="handleExecute(record)" v-else>立即检测</a>
          <a @click="handleCopy(record)">复制</a>
        </div>
      </table-component>
      <div class="condition-part" v-else>
        <div class="sub-title">基本信息</div>
        <div class="rules-details-content">
          <div class="detail-item">
            <label class="item-label">规则类型:</label>
            <div class="item-content">
              <a-select
                class="rule-type-select"
                v-model="checkData.ruleType"
                placeholder="请选择规则类型"
              >
                <a-select-option
                  v-for="item in ruleTypeOptions"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </div>
          </div>
          <div class="detail-item">
            <label class="item-label">规则名称:</label>
            <div class="item-content">
              <a-input
                type="text"
                autoComplete="off"
                v-model.trim="checkData.ruleName"
                placeholder="请输入规则名称"
                class="rule-name-input"
                ref="ruleNameRef"
              />
            </div>
          </div>
          <div class="detail-item">
            <label class="item-label">执行时间:</label>
            <div class="item-content">
              <a-range-picker
                v-model="checkData.startStopTime"
                format="YYYY-MM-DD"
                valueFormat="YYYY-MM-DD"
                class="do-time-input"
              >
                <template slot="suffixIcon">
                  <a-icon type="calendar" />
                </template>
              </a-range-picker>
            </div>
          </div>
          <div class="detail-item">
            <label class="item-label">检测周期:</label>
            <div class="item-content">
              <a-input-number
                type="text"
                v-model.trim="checkData.checkDate"
                :min="1"
                :precision="0"
                placeholder="请输入数字"
                class="check-num-input"
              />
              <a-select
                v-model="checkData.cycleUnit"
                class="cycle-unit-select"
                placeholder="请选择时间"
              >
                <a-select-option :value="0">天</a-select-option>
                <a-select-option :value="1">月</a-select-option>
              </a-select>
            </div>
          </div>
          <div class="detail-item" v-if="rightTitle !== '新建规则'">
            <label class="item-label">最后修改人:</label>
            <div class="item-content">{{ checkData.updatePerson }}</div>
          </div>
          <div class="detail-item" v-if="rightTitle !== '新建规则'">
            <label class="item-label">修改时间:</label>
            <div class="item-content">{{ checkData.updateTime }}</div>
          </div>
          <div class="detail-item">
            <label class="item-label">规则描述:</label>
            <div class="item-content">
              <a-textArea
                allow-clear
                type="text"
                placeholder="请输入规则描述"
                :auto-size="{ minRows: 3, maxRows: 5 }"
                v-model.trim="checkData.ruleDesc"
              />
            </div>
          </div>
        </div>
        <div class="sub-title">规则生成信息</div>
        <div class="condition-group" v-if="rightTitle === '新建规则'">
          <span class="condition-group-label" style="line-height: 32px"
            >配置方式:</span
          >
          <div class="condition-group-content">
            <a-select
              :value="checkData.modeValue"
              class="item-select"
              placeholder="请选择配置方式"
              @change="handleChangeWay"
            >
              <a-select-option :value="0">从配置的条件选择</a-select-option>
              <a-select-option :value="1">完整SQL语句</a-select-option>
            </a-select>
            <a-tooltip placement="top">
              <template slot="title">
                <span>
                  当规则配置方式为完整SQL语句时，该规则不可进行其他条件组合，该条件即为一条规则配置方式
                </span>
              </template>
              <a-icon type="info-circle" />
            </a-tooltip>
          </div>
        </div>
        <div class="condition-group" v-if="checkData.modeValue === 0">
          <span class="condition-group-label" style="line-height: 28px"
            >条件组:</span
          >
          <div class="condition-group-content">
            <a-button
              type="primary"
              class="add-condition-btn"
              @click="selectCondition('config', 'single', [])"
            >
              <a-icon type="file-add" />添加条件
            </a-button>
            <a-button
              type="primary"
              class="add-condition-btn"
              @click="selectCondition('config', 'multi', [])"
            >
              <a-icon type="folder-add" />条件组
            </a-button>
            <a-button class="add-condition-btn" @click="resetRulesGroup">
              重置
            </a-button>
          </div>
        </div>
        <div class="condition-group" v-if="checkData.modeValue === 1">
          <span class="condition-group-label">当前条件:</span>
          <div
            class="condition-group-content"
            v-if="checkData.conditionList.length <= 0"
          >
            <span class="condition-text"> 请先选择一个SQL条件语句 </span>
            <span class="change-btn" @click="selectCondition('sql')"
              >选择条件</span
            >
          </div>
          <div class="condition-group-content" v-else>
            <span class="condition-text">{{
              checkData.conditionList[0].conditionName
            }}</span>
            <span class="change-btn" @click="selectCondition('sql')"
              >切换条件</span
            >
          </div>
        </div>
        <div class="condition-group" v-if="checkData.modeValue === 0">
          <condition-group
            :list="rulesGroup"
            :originList="rulesGroup"
            :value="[]"
            :floor="0"
            :isCondition="true"
          />
          <!-- @selectCondition="selectCondition" -->
        </div>
        <div
          class="condition-group"
          v-if="checkData.modeValue === 1 && checkData.conditionList.length > 0"
        >
          <span class="condition-group-label">条件描述:</span>
          <div class="condition-group-content">
            <span class="condition-text">{{
              checkData.conditionList[0].conditionDesc || "无"
            }}</span>
          </div>
        </div>
        <div
          class="condition-group"
          v-if="checkData.modeValue === 1 && checkData.conditionList.length > 0"
        >
          <span class="condition-group-label">SQL语句:</span>
          <div class="condition-group-content">
            <a-textArea
              allow-clear
              type="text"
              :auto-size="{ minRows: 3, maxRows: 5 }"
              :value="checkData.ruleScripts"
              disabled
            />
          </div>
        </div>
        <div class="condition-part-bottom">
          <a-button @click="handleCancel"> 取消 </a-button>
          <a-button @click="resetConditions" v-if="rightTitle === '新建规则'">
            重置
          </a-button>
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
      title="添加同级类型"
    >
      <div class="search-modal-content">
        <a-input
          autoComplete="off"
          v-model.trim="nameValue"
          class="search-modal-input"
          placeholder="请输入类型名称"
        />
      </div>
    </a-modal>
    <a-modal
      :width="400"
      :visible="conditionModalShow"
      :destroyOnClose="true"
      @cancel="onConditionCancel"
      :mask="false"
      class="condition-modal"
      title="条件目录"
    >
      <div class="condition-modal-content">
        <div class="keywords-search">
          <a-input
            allow-clear
            v-model.trim="conditionKeywords"
            autoComplete="off"
            class="keywords-input"
            placeholder="请输入条件关键词"
          />
          <a-button class="keywords-btn" icon="search" />
        </div>
        <a-tree
          v-model="checkedKeys"
          checkable
          :expanded-keys="expandedKeys"
          :tree-data="conditionList"
          @expand="onExpand"
          @check="onCheck"
          :selectable="false"
          :load-data="onLoadData"
        />
      </div>
      <template slot="footer">
        <div class="footer-left">
          共120个条件，已选择{{ checkedKeys.length }}个条件
        </div>
        <div class="footer-right">
          <a-button @click="resetSelect"> 重置 </a-button>
          <a-button @click="selectConfirm" type="primary"> 确定 </a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>
<script>
import TableComponent from "@/components/tableComponent";
import {
  delAbRule,
  executeRuleScripts,
  gerTreeConditionCategory,
  queryConditionByPage,
  queryRuleByPage,
  saveOrUpdateRule,
  updateAbRuleStatus,
} from "@/shared/api/auditManage.js";
import {
  addListCategory,
  deleteWarningCategory,
  getCategoryList,
} from "@/shared/api/configManage.js";
import { getRulesGroup, modalConfirm } from "@/utils/common.js";
import {
  Button,
  DatePicker,
  Dropdown,
  Icon,
  Input,
  InputNumber,
  Menu,
  Tooltip,
  Tree,
} from "ant-design-vue";
import { cloneDeep, difference } from "lodash";
import moment from "moment";
import { nanoid } from "nanoid";
import ConditionGroup from "./conditionGroup";

const { RangePicker } = DatePicker;
const { Item } = Menu;
const { TextArea } = Input;

export default {
  name: "RulesManageNew",
  data() {
    return {
      keywords: undefined,
      addRuleVisible: false,
      list: [],
      ruleTypeOptions: [],
      menuList: [
        {
          key: "addRule",
          title: "添加规则",
        },
        {
          key: "addBrother",
          title: "添加同级类型",
        },
        {
          key: "delete",
          title: "删除",
        },
      ],
      addModelShow: false,
      nameValue: undefined,
      columns: [
        {
          title: "规则名称",
          dataIndex: "ruleName",
          key: "ruleName",
          width: 90,
        },
        {
          title: "规则类型",
          dataIndex: "ruleTypeName",
          key: "ruleTypeName",
          width: 80,
        },
        {
          title: "规则描述",
          dataIndex: "ruleDesc",
          key: "ruleDesc",
          width: 80,
        },
        {
          title: "规则生成方式",
          dataIndex: "modeValue",
          key: "modeValue",
          width: 105,
          scopedSlots: { customRender: "modeValue" },
        },
        {
          title: "最后修改人",
          dataIndex: "updatePerson",
          key: "updatePerson",
          width: 90,
        },
        {
          title: "最后修改时间",
          dataIndex: "updateTime",
          key: "updateTime",
          width: 150,
        },
        {
          title: "操作",
          dataIndex: "actions",
          key: "actions",
          width: 150,
          fixed: "right",
          scopedSlots: { customRender: "actions" },
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
        showTotal: (total, current) => {
          return `共${total}条记录，当前第${Math.ceil(
            current[0] / this.pagination.pageSize
          )}页`;
        },
        onChange: (page, pageSize) => {
          this.pagination.current = page;
          this.pagination.pageSize = pageSize;
          this.getRuleList("repeat");
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = 1;
          this.pagination.pageSize = size;
          this.getRuleList("repeat");
        },
      },
      tableLoading: false,
      tableValue: [],
      rightTitle: "规则列表",
      tableShow: true,
      checkData: {},
      conditionModalShow: false,
      conditionList: [],
      targetTreeData: undefined,
      checkedKeys: [],
      expandedKeys: [],
      conditionKeywords: undefined,
      selectMode: undefined,
      categoryId: undefined,
      rulesGroup: [
        {
          id: -1,
          types: "relations",
          relations: "且",
        },
      ],
      parentIds: [],
      childOptions: [],
      addKey: [],
      isSingle: undefined,
      tableHeight: 0,
      scrollHeight: 0,
    };
  },
  components: {
    AButton: Button,
    ADropdown: Dropdown,
    AIcon: Icon,
    AInput: Input,
    AInputNumber: InputNumber,
    AMenu: Menu,
    AMenuItem: Item,
    ARangePicker: RangePicker,
    ATooltip: Tooltip,
    ATextArea: TextArea,
    ATree: Tree,
    ConditionGroup,
    TableComponent,
  },
  watch: {
    scrollHeight(newValue) {
      this.scrollHeight = newValue;
      this.tableHeight = this.scrollHeight - 181;
    },
  },
  mounted() {
    setTimeout(() => {
      const that = this;
      that.scrollHeight = that.$refs.contentRight.scrollHeight;
      that.tableHeight = that.scrollHeight - 181;
      window.onresize = () => {
        that.scrollHeight = that.$refs.contentRight.scrollHeight;
      };
    }, 100);
    this.getRuleList("init");
    this.getRuleCategory();
    this.getConditionCategory();
  },
  beforeDestroy() {
    window.onresize = null;
  },
  methods: {
    show(e) {
      e.event.stopPropagation();
      this.targetTreeData = e.node.dataRef;
    },
    getIcon(props) {
      const { isLeaf, expanded } = props;
      if (isLeaf) {
        return <a-icon type="file" />;
      }
      return <a-icon type={expanded ? "folder-open" : "folder"} />;
    },
    async saveAdd() {
      const json = {
        categoryName: this.nameValue,
        parentId: -1,
        status: 0,
        categoryType: 1,
      };
      this.onCancel();
      const loading = this.$message.loading("正在添加", 0);
      const res = await addListCategory(json);
      if (res.message === "成功") {
        await this.getRuleCategory();
        loading();
        this.$message.success("添加成功");
      } else {
        loading();
        this.$message.error(`${res.message}`);
      }
    },
    onCancel() {
      this.addModelShow = false;
    },
    onContextMenuClick(treeKey, menuKey) {
      const _that = this;
      const title = `确定要删除 ${_that.targetTreeData.title} 吗？`;
      const onOk = async () => {
        const loading = _that.$message.loading(`正在删除`, 0);
        const json = {
          id: _that.targetTreeData.key,
        };
        const res = await deleteWarningCategory(json);
        loading();
        if (res.message === "成功") {
          _that.$message.success(`删除成功`);
          _that.getRuleCategory();
        } else {
          _that.$message.error(`${res.message}`);
        }
      };
      switch (menuKey) {
        case "addRule":
          _that.rightTitle = "新建规则";
          _that.handleCancel();
          _that.tableShow = false;
          _that.checkData = {
            ruleType: undefined,
            ruleName: undefined,
            startStopTime: undefined,
            checkDate: undefined,
            cycleUnit: 0,
            modeValue: undefined,
            ruleDesc: undefined,
            conditionList: [],
          };
          break;
        case "addBrother":
          _that.addModelShow = true;
          break;
        case "delete":
          modalConfirm(title, _that, onOk);
          break;

        default:
          break;
      }
    },
    async startRule(record) {
      const _that = this;
      const text = record.status === 1 ? "启用" : "停用";
      const title = `确定要${text} ${record.ruleName} 吗？`;
      const onOk = async () => {
        const loading = _that.$message.loading(`正在${text}`, 0);
        const json = {
          id: record.id,
          status: record.status === 1 ? 0 : 1,
        };
        const res = await updateAbRuleStatus(json);
        loading();
        if (res.message === "成功") {
          _that.$message.success(`${text}成功`);
          _that.getRuleList("init");
        } else {
          _that.$message.error(`${res.message}`);
        }
      };
      modalConfirm(title, _that, onOk);
    },
    handleEdit(record) {
      this.checkData = record;
      if (record.modeValue === 0) {
        this.rulesGroup = getRulesGroup(record.conditionList);
      }
      this.rightTitle = "规则编辑";
      this.tableShow = false;
    },
    handleDelete(record) {
      const _that = this;
      const title = `确定要删除 ${record.ruleName} 吗？`;
      const onOk = async () => {
        const loading = _that.$message.loading("正在删除", 0);
        const res = await delAbRule(record.id);
        loading();
        if (res.message === "成功") {
          _that.$message.success("删除成功");
          _that.getRuleList("init");
        } else {
          _that.$message.error(`${res.message}`);
        }
      };
      modalConfirm(title, _that, onOk);
    },
    async handleExecute(record) {
      if (record.modeValue === 1) {
        const loading = this.$message.loading("正在执行", 0);
        const res = await executeRuleScripts(record.id);
        loading();
        if (res.message === "成功") {
          this.$message.success("执行成功");
        } else {
          this.$message.error(res.message);
        }
      }
    },
    handleCancel() {
      this.tableShow = true;
      this.resetConditions();
    },
    resetConditions() {
      this.checkData = {
        ruleType: undefined,
        ruleName: undefined,
        startStopTime: undefined,
        checkDate: undefined,
        cycleUnit: 0,
        modeValue: this.checkData.modeValue,
        ruleDesc: undefined,
        conditionList: [],
      };
      this.toEdit = true;
      this.isShowTotal = false;
      this.resetSelect();
      this.resetRulesGroup();
    },
    async saveInput() {
      if (!this.checkData.ruleType) {
        this.$message.error("规则类型不可为空！");
        return false;
      }
      if (this.checkData.ruleName === "" || !this.checkData.ruleName) {
        this.$message.error("规则名称不可为空！");
        return false;
      }
      if (!this.checkData.startStopTime.length) {
        this.$message.error("执行时间不可为空！");
        return false;
      }
      if (!this.checkData.checkDate) {
        this.$message.error("检测周期不可为空！");
        return false;
      }
      const json = {
        id: this.rightTitle === "规则编辑" ? this.checkData.id : null,
        ruleName: this.checkData.ruleName,
        categoryId: this.checkData.ruleType,
        ruleDesc: this.checkData.ruleDesc,
        ruleType: this.checkData.modeValue,
        effectStartDate: this.checkData.startStopTime[0],
        effectEndDate: this.checkData.startStopTime[1],
        cycleUnit: this.checkData.cycleUnit,
        checkDate: this.checkData.checkDate,
      };
      let conditions = [];
      if (this.checkData.modeValue === 0) {
        // 配置化
        conditions = this.getPostJson(this.rulesGroup);
      } else {
        // sql
        if (!this.checkData.conditionList[0].content) {
          this.$message.error("sql语句不可为空！");
          return false;
        } else {
          json.ruleScripts = this.checkData.conditionList[0].content;
          conditions.push({
            logic: null,
            conditionId: this.checkData.conditionList[0].conditionId,
            conditionList: [],
          });
        }
      }
      json.conditions = conditions;
      const loading = this.$message.loading("正在保存", 0);
      const res = await saveOrUpdateRule(json);
      loading();
      if (res.message === "成功") {
        const message =
          this.rightTitle === "规则编辑" ? "修改成功" : "添加成功";
        this.$message.success(`${message}`);
        this.handleCancel();
        this.getRuleList("init");
      } else {
        this.$message.error(`${res.message}`);
      }
    },
    handleChangeWay(value) {
      this.$set(this.checkData, "modeValue", value);
    },
    selectCondition(type, isSingle, key) {
      if (type === "config") {
        // const rulesArr = this.rulesGroup;
        // const resultRulesArr = this.updateRulesGroup(key, rulesArr);
        this.selectMode = "multiple";
        this.isSingle = isSingle;
        // if (isSingle === "multi") {
        //   resultRulesArr.push([
        //     {
        //       id: nanoid(),
        //       types: "relations",
        //       relations: "且",
        //     },
        //   ]);
        //   this.addKey = key;
        //   this.conditionModalShow = true;
        // } else {
        //   this.addKey = key;
        //   this.conditionModalShow = true;

        //   const conditionList = cloneDeep(this.conditionList);
        //   this.conditionList = conditionList.map((item) => {
        //     return {
        //       ...item,
        //       disabled: false,
        //     };
        //   });
        // }
        this.addKey = key;
        this.conditionModalShow = true;

        const conditionList = cloneDeep(this.conditionList);
        this.conditionList = conditionList.map((item) => {
          return {
            ...item,
            disabled: false,
          };
        });
      } else {
        this.selectMode = "single";
        this.conditionModalShow = true;

        const conditionList = cloneDeep(this.conditionList);
        this.conditionList = conditionList.map((item) => {
          return {
            ...item,
            disabled: true,
          };
        });
      }
    },
    updateRulesGroup(key, rulesArr) {
      if (key.length) {
        let resultArr = rulesArr[key[0]];
        if (key.length > 1) {
          key.map((num, index) => {
            if (index > 0) {
              resultArr = resultArr[num];
            }
          });
        }
        return resultArr;
      } else {
        return rulesArr;
      }
    },
    onConditionCancel() {
      this.conditionModalShow = false;
      this.resetSelect();
    },
    resetSelect() {
      this.checkedKeys = [];
    },
    selectConfirm() {
      const childIds = difference(this.checkedKeys, this.parentIds);
      const targetArr = childIds.map((id) => {
        const arr = this.childOptions.filter((child) => {
          if (child.key === id) {
            return child;
          }
        });
        return arr[0];
      });

      if (this.selectMode === "single") {
        // sql
        const conditionList = [
          {
            conditionName: targetArr[0].title,
            conditionDesc: targetArr[0].conditionDesc,
            content: targetArr[0].sqlContent,
            conditionId: targetArr[0].key,
          },
        ];
        this.$set(this.checkData, "conditionList", conditionList);
        this.$set(this.checkData, "ruleScripts", targetArr[0].sqlContent);
      } else {
        const rulesArr = this.rulesGroup;
        const resultRulesArr = this.updateRulesGroup(this.addKey, rulesArr);
        if (this.isSingle === "multi") {
          resultRulesArr.push([
            {
              id: nanoid(),
              types: "relations",
              relations: "且",
            },
          ]);
          targetArr.map((item) => {
            resultRulesArr.slice(-1)[0].push({
              id: nanoid(),
              condition: item,
              types: "single",
            });
          });
          this.conditionModalShow = true;
        } else {
          this.conditionModalShow = true;

          targetArr.map((item) => {
            resultRulesArr.push({
              id: nanoid(),
              condition: item,
              types: "single",
            });
          });
        }
      }
      this.onConditionCancel();
    },
    onExpand(expandedKeys) {
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onCheck(checkedKeys) {
      if (this.selectMode === "multiple") {
        this.checkedKeys = checkedKeys;
      } else {
        if (checkedKeys.length > 1) {
          this.checkedKeys = [checkedKeys[0]];
        } else {
          this.checkedKeys = checkedKeys;
        }
      }
    },
    resetRulesGroup() {
      this.rulesGroup = [
        {
          id: -1,
          types: "relations",
          relations: "且",
        },
      ];
    },
    async getRuleList(type) {
      this.tableLoading = true;
      if (type === "init") {
        this.$set(this.pagination, "current", 1);
      }
      const json = {
        ruleName: "",
        ruleCode: "",
        categoryId: this.categoryId,
        ruleType: "",
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
      };
      const res = await queryRuleByPage(json);
      this.tableLoading = false;
      if (res.message === "成功") {
        this.$set(this.pagination, "total", res.data.totalCount);
        const tableValue = res.data.dateList.map((item) => {
          return {
            id: item.id,
            ruleName: item.ruleName,
            ruleType: item.categoryId,
            ruleTypeName: item.categoryName,
            ruleDesc: item.ruleDesc,
            modeValue: item.ruleType,
            updatePerson: item.updateUser,
            updateTime: item.updateDate,
            conditionList: item.conditionList,
            ruleScripts: item.ruleScripts,
            cycleUnit: item.cycleUnit,
            checkDate: item.checkDate,
            startStopTime: [
              moment(item.effectStartDate),
              moment(item.effectEndDate),
            ],
            status: item.status,
          };
        });
        this.tableValue = tableValue;
      }
    },
    async getRuleCategory() {
      const resData = await getCategoryList(1);
      if (!resData) {
        this.$message.error("获取规则分类失败，请重试");
        return false;
      }
      const ruleTypeOptions = [];
      this.list = resData.map((item) => {
        ruleTypeOptions.push({
          value: item.id,
          label: item.categoryName,
        });
        return {
          title: item.categoryName,
          key: item.id,
          isLeaf: true,
        };
      });
      this.ruleTypeOptions = ruleTypeOptions;
    },
    onSelect(selectedKeys, e) {
      if (!e.node.isLeaf) {
        e.node.onExpand();
      } else {
        this.categoryId = selectedKeys[0];
        this.getRuleList("init");
      }
    },
    async getConditionCategory() {
      const res = await gerTreeConditionCategory();
      if (res.message === "成功") {
        this.conditionList = this.getAllchildren(res.data, 1);
      } else {
        this.$message.error("查询条件分类失败，请重试");
      }
    },
    getAllchildren(arr, level) {
      const list = arr.map((item) => {
        let children = [];
        this.parentIds.push(item.id);
        if (item.children.length) {
          this.expandedKeys.push(item.id);
          children = this.getAllchildren(item.children, 2);
        }
        return {
          title: item.categoryName,
          key: item.id,
          children,
          isLeaf: false,
          level,
          hasChildren: true, // 默认有孩子
        };
      });
      return list;
    },
    onLoadData(treeNode) {
      return this.getConditionList(treeNode);
    },
    async getConditionList(treeNode) {
      // return false;
      if (!treeNode.dataRef.children.length && treeNode.dataRef.hasChildren) {
        const json = {
          categoryId: treeNode.dataRef.key,
          conType: this.checkData.modeValue,
          pageNo: 1,
          pageSize: 1000,
        };
        const res = await queryConditionByPage(json);
        if (res.message === "成功") {
          const conditionList = res.data.dateList.map((item) => {
            return {
              title: item.conditionName,
              key: item.id,
              children: item.children,
              isLeaf: true,
              level: 3,
              sqlContent: item.dsList[0].sqlContext,
              conditionDesc: item.conditionDesc,
            };
          });
          if (conditionList.length) {
            const list = this.conditionList;
            const targetArr = this.getTargetArr(list, treeNode.dataRef.key);
            conditionList.map((item) => {
              targetArr.push(item);
              this.childOptions.push(item);
            });
            this.conditionList = list;
            treeNode.dataRef.hasChildren = true;
          } else {
            this.$message.destroy();
            treeNode.dataRef.hasChildren = false;
            this.$message.info("暂无条件，请先添加！");
          }
        } else {
          this.$message.error("获取条件失败");
        }
      }
    },
    getTargetArr(list, key) {
      let targetArr = [];
      for (let i = 0; i < list.length; i++) {
        const ele1 = list[i];
        if (ele1.key === key) {
          targetArr = ele1.children;
          break;
        }
        for (let j = 0; j < ele1.children.length; j++) {
          const ele2 = ele1.children[j];
          if (ele2.key === key) {
            targetArr = ele2.children;
            break;
          }
        }
      }
      return targetArr;
    },
    getPostJson(list) {
      const resultArr = [];
      const logic = list[0].relations === "且" ? 1 : 0;
      list.map((item, index) => {
        if (index > 0 && Array.isArray(item)) {
          // 条件组
          resultArr.push({
            logic: 2,
            groupLogic: logic,
            conditionList: this.getPostJson(item),
          });
        } else if (index > 0 && item.types === "single") {
          // 条件
          resultArr.push({
            logic,
            conditionId: item.condition.key,
          });
        }
      });
      return resultArr;
    },
    handleCopy(record) {
      this.checkData = record;
      this.checkData.ruleName = undefined;
      if (record.modeValue === 0) {
        this.rulesGroup = getRulesGroup(record.conditionList);
      }
      this.rightTitle = "新建规则";
      this.tableShow = false;
      this.$nextTick(() => {
        this.$refs.ruleNameRef.focus();
      });
    },
  },
};
</script>
<style lang="less">
.rules-manage-new {
  height: 100%;
  padding: 5px;
  display: flex;

  .warning-title {
    color: #000;
    font-weight: 600;
    padding-bottom: 16px;
    margin-bottom: 16px;
    border-bottom: 1px solid @borderColor;
  }

  &-left {
    width: 360px;
    padding: 16px 24px;
    overflow-y: auto;
    overflow-x: hidden;
    background: #fff;
    margin-right: 24px;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.16);
    height: 100%;

    .keywords-search {
      display: flex;
      margin: 18px 0 6px;

      .keywords-input {
        width: 280px;
        color: @disabledColor;

        .ant-input {
          border-right: 0;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }
      }

      .keywords-btn {
        width: 32px;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
  }

  &-right {
    position: relative;
    width: calc(100% - 384px);
    height: 100%;
    background: #fff;
    padding: 16px 24px;
    overflow-y: auto;
    overflow-x: hidden;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.16);

    .condition-part {
      overflow: auto;
      padding-bottom: 36px;
      height: calc(100% - 54px);

      &-bottom {
        z-index: 100;
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

    .rules-details {
      margin: 18px 0;
      line-height: 22px;
      color: @secondaryTextColor;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      height: 66px;
    }

    .rules-table-title {
      line-height: 22px;
      padding-bottom: 16px;
      color: #8c8c8c;

      .title-blue {
        color: @activeFontColor;
      }
    }

    .rules-details-content {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      max-width: 860px;
      width: 100%;

      .detail-item {
        width: calc((100% - 80px) / 2);
        display: flex;
        line-height: 32px;
        margin-bottom: 16px;
        color: @primaryTextColor;

        &:last-child {
          width: 100%;
        }

        .item-label {
          color: @secondaryTextColor;
          width: 75px;
          text-align: right;
        }

        .item-content {
          padding-left: 12px;
          width: calc(100% - 75px);
          display: flex;
          align-items: center;

          .rule-type-select,
          .rule-name-input {
            width: 100%;
          }

          .check-num-input,
          .cycle-unit-select {
            width: calc((100% - 16px) / 2);
          }

          .check-num-input {
            margin-right: 16px;
          }
        }
      }
    }

    .condition-group {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 16px;

      &-label {
        width: 75px;
        text-align: right;
        margin-right: 10px;
        color: @secondaryTextColor;
      }

      &-content {
        display: flex;
        width: calc(100% - 85px);

        .condition-item {
          line-height: 24px;
          padding: 2px 8px;
          background: @backgroundColor;
          font-size: 12px;
          color: @secondaryTextColor;
          margin-right: 8px;
        }

        .item-select {
          width: 280px;
        }

        .anticon-info-circle {
          margin-left: 10px;
          font-size: 18px;
          color: @blue;
          cursor: pointer;

          svg {
            margin-top: 7px;
          }
        }

        .condition-text {
          color: @primaryTextColor;
        }

        .change-btn {
          color: @blue;
          cursor: pointer;
          margin-left: 12px;
        }

        .ant-input[disabled] {
          color: @primaryTextColor;
          background-color: #fff;
        }

        .add-condition-btn {
          height: 28px;
          font-size: 12px;
          padding: 0 10px;
          margin-right: 16px;
        }
      }
    }

    .rule-table {
      height: calc(100% - 54px);

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

.condition-modal {
  .ant-modal {
    top: 64px;
    right: 0;
    margin: 0;
    padding: 0;
    bottom: 30px;
    position: absolute;

    .ant-modal-content {
      height: 100%;

      .ant-modal-body {
        overflow: auto;
        height: calc(100% - 108px);

        .condition-modal-content {
          .keywords-search {
            display: flex;
            margin-bottom: 6px;

            .keywords-input {
              width: calc(100% - 32px);
              color: @disabledColor;

              .ant-input {
                border-right: 0;
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
              }
            }

            .keywords-btn {
              width: 32px;
              color: #8c8c8c;
              border-top-left-radius: 0;
              border-bottom-left-radius: 0;
            }
          }
        }
      }

      .ant-modal-footer {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
}
</style>
