<template>
  <div class="schedules-details" id="schedules-details">
    <div class="schedules-details-header">
      <span class="schedules-details-header-title">
        {{
          detailsType === "add"
            ? "新建策略"
            : detailsType === "edit"
            ? `策略编辑（${details.id}）`
            : `策略详情（${details.id}）`
        }}
      </span>
      <div class="schedules-details-header-btns">
        <a-button @click="handleReturn"> 返回 </a-button>
        <a-button
          type="primary"
          @click="handleEdit"
          v-if="detailsType === 'check'"
          :disabled="details.status == 0"
        >
          编辑策略
        </a-button>
      </div>
    </div>
    <div class="schedules-details-content" id="schedules-details-content">
      <div class="sub-title">基本信息</div>
      <div class="content-top">
        <div class="content-top-item">
          <div class="item-box">
            <span class="item-label">策略名称：</span>
            <div class="item-input" v-if="detailsType === 'check'">
              {{ details.name }}
            </div>
            <a-input
              v-else
              allow-clear
              class="item-input"
              placeholder="策略名称"
              :disabled="detailsType === 'edit'"
              v-model.trim="details.name"
            />
          </div>
          <div class="item-box">
            <span class="item-label">图谱选择：</span>
            <div v-if="detailsType === 'check'" class="item-input">
              {{ details.graphName }}
            </div>
            <a-cascader
              v-else
              v-model="details.graphId"
              :options="graphOptions"
              placeholder="图谱选择"
              class="item-input"
              @change="handleGraphChange"
            />
          </div>
          <div class="item-box">
            <span class="item-label">模型选择：</span>
            <div v-if="detailsType === 'check'" class="item-input">
              {{ details.modelName }}
            </div>
            <a-select
              v-else
              class="item-input"
              v-model="details.modelId"
              placeholder="模型选择"
              @change="handleModelChange"
              :options="modelOptions"
            />
          </div>
        </div>
        <div class="content-top-item">
          <div class="item-box">
            <span class="item-label">策略分类：</span>
            <a-select
              v-if="details.categoryId"
              class="item-input"
              placeholder="策略分类"
              :options="categoryOptions"
              v-model="details.categoryId"
              :disabled="detailsType !== 'add'"
            />
            <span class="item-text" v-else>请先选择模型</span>
          </div>
          <div class="item-box">
            <span class="item-label">风险等级：</span>
            <div v-if="detailsType === 'check'" class="item-input">
              {{ details.riskLevelText }}
            </div>
            <a-select
              v-else
              class="item-input"
              v-model="details.riskLevel"
              placeholder="风险等级"
            >
              <a-select-option :value="1">一级</a-select-option>
              <a-select-option :value="2">二级</a-select-option>
              <a-select-option :value="3">三级</a-select-option>
            </a-select>
          </div>
          <div class="item-box">
            <span class="item-label">生效日期：</span>
            <a-range-picker
              v-model="details.startStopTime"
              format="YYYY-MM-DD"
              valueFormat="YYYY-MM-DD"
              class="item-input"
              :disabled="detailsType === 'check'"
              :disabled-date="disabledDate"
            >
              <template slot="suffixIcon">
                <a-icon type="calendar" />
              </template>
            </a-range-picker>
          </div>
        </div>
        <div class="content-top-item">
          <div class="item-box textarea">
            <span class="item-label">策略描述：</span>
            <div class="item-input" v-if="detailsType === 'check'">
              {{ details.desc }}
            </div>
            <a-textArea
              v-else
              allow-clear
              type="text"
              :auto-size="{ minRows: 4, maxRows: 4 }"
              class="item-input"
              placeholder="策略描述"
              v-model.trim="details.desc"
            />
          </div>
        </div>
        <div class="content-top-item">
          <div class="item-box textarea">
            <span class="item-label">检测周期：</span>
            <a-radio-group
              v-model="details.radioValue"
              class="item-input"
              :disabled="detailsType === 'check'"
            >
              <a-radio :value="0"> 指定时间 </a-radio>
              <a-radio :value="1"> 指定周期 </a-radio>
              <a-radio :value="2"> 指定频次 </a-radio>
            </a-radio-group>
          </div>
        </div>
        <div class="content-top-item">
          <div class="item-box" v-if="details.radioValue === 0">
            <span class="item-label">指定时间：</span>
            <a-date-picker
              class="item-input"
              v-model="details.checkDate"
              format="YYYY-MM-DD HH:mm:ss"
              valueFormat="YYYY-MM-DD HH:mm:ss"
              :disabled="detailsType === 'check'"
              :disabled-date="disabledDate"
              :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
            />
          </div>
          <div class="item-box" v-else-if="details.radioValue === 1">
            <span class="item-label">指定周期：</span>
            <a-input-number
              type="text"
              v-model.trim="details.dateNum"
              :min="1"
              :precision="0"
              placeholder="请输入数字"
              :disabled="detailsType === 'check'"
              :style="{ width: '110px', marginRight: '10px' }"
            />
            <a-select
              v-model="details.cycleUnit"
              placeholder="周期"
              style="width: 80px"
              :disabled="detailsType === 'check'"
            >
              <a-select-option :value="0">天</a-select-option>
              <a-select-option :value="1">周</a-select-option>
              <a-select-option :value="2">月</a-select-option>
            </a-select>
          </div>
          <div class="item-box" v-else>
            <span class="item-label">检测方式：</span>
            每
            <a-select
              v-model="details.cycleUnit"
              placeholder="周期"
              :style="{ width: '80px', margin: '0 8px' }"
              :disabled="detailsType === 'check'"
            >
              <!-- <a-select-option :value="0">天</a-select-option> -->
              <a-select-option :value="1">周</a-select-option>
              <a-select-option :value="2">月</a-select-option>
            </a-select>
            第
            <a-input-number
              type="text"
              v-model.trim="details.dateNum"
              :min="1"
              :precision="0"
              placeholder="请输入数字"
              :disabled="detailsType === 'check'"
              :style="{ width: '110px', margin: '0 8px' }"
            />
            天
          </div>
        </div>
      </div>
    </div>
    <div class="schedules-details-views" v-if="details.modelId">
      <div class="views-left">
        <div class="sub-title">模型脚本</div>
        <div class="views-left-script">
          <code>{{ modelDetails.scripts }}</code>
        </div>
      </div>
      <div class="views-right">
        <div class="sub-title">模板结构示例</div>
        <div class="views-right-graph">
          <!-- 配置化：展示配置化的模板结构图 脚本化：展示用户上传的图片 -->
          <img :src="modelDetails.imgString" alt="" />
        </div>
      </div>
    </div>
    <div class="schedules-details-table" v-if="details.graphId.length">
      <div class="sub-title">线索二维表表头配置</div>
      <div class="table-header-btns">
        <a-button
          type="link"
          icon="plus-square"
          @click="handleAddRow"
          :disabled="detailsType === 'check'"
        >
          新增行
        </a-button>
        <a-button
          type="link"
          icon="minus-square"
          @click="handleDeleteRow"
          :disabled="detailsType === 'check' || !selectedRowKeys.length"
        >
          删除行
        </a-button>
      </div>
      <draggable v-model="data" class="table-content">
        <transition-group>
          <!-- 这里放置你的 Table 组件 -->
          <a-table
            :columns="columns"
            :data-source="data"
            bordered
            :pagination="pagination"
            :rowKey="(record) => record.key"
            :row-selection="rowSelection"
            key="table"
          >
            <template slot="index" slot-scope="text, record, index">{{
              pagination.pageSize * (pagination.current - 1) + index + 1
            }}</template>
            <template
              v-for="col in [
                'paramType',
                'paramIdent',
                'paramField',
                'fieldAlias',
              ]"
              :slot="col"
              slot-scope="text, record, index"
            >
              <div :key="col" v-if="col === 'paramType'">
                <a-select
                  :style="{
                    margin: '-5px 10px -5px 0',
                    width: 'calc(50% - 5px)',
                  }"
                  :disabled="
                    detailsType === 'check' ||
                    pagination.pageSize * (pagination.current - 1) + index < 2
                  "
                  :value="record.paramTypeNode"
                  @change="
                    (value) =>
                      handleChange(
                        value,
                        pagination.pageSize * (pagination.current - 1) + index,
                        'paramTypeNode'
                      )
                  "
                  placeholder="变量类型"
                  :options="paramTypeNodeOptions"
                />
                <a-select
                  :style="{ margin: '-5px 0', width: 'calc(50% - 5px)' }"
                  :disabled="
                    detailsType === 'check' ||
                    pagination.pageSize * (pagination.current - 1) + index < 2
                  "
                  :value="record.paramTypeName"
                  @change="
                    (value) =>
                      handleChange(
                        value,
                        pagination.pageSize * (pagination.current - 1) + index,
                        'paramTypeName'
                      )
                  "
                  :options="paramTypeNameOptions[record.paramTypeNode]"
                  placeholder="变量标签"
                />
              </div>
              <div :key="col" v-else-if="col === 'paramIdent'">
                <a-input
                  style="margin: -5px 0"
                  :disabled="detailsType === 'check'"
                  :value="record.paramIdent"
                  @change="
                    (e) =>
                      handleChange(
                        e.target.value,
                        pagination.pageSize * (pagination.current - 1) + index,
                        col
                      )
                  "
                  placeholder="变量标识"
                />
              </div>
              <div :key="col" v-else-if="col === 'paramField'">
                <a-select
                  :style="{ margin: '-5px 0', width: '100%' }"
                  :disabled="detailsType === 'check'"
                  :value="record.paramField"
                  @change="
                    (value) =>
                      handleChange(
                        value,
                        pagination.pageSize * (pagination.current - 1) + index,
                        col
                      )
                  "
                  placeholder="属性字段名称"
                  :options="
                    record.paramTypeName
                      ? (paramTypeNameOptions[record.paramTypeNode].find(
                          (v) => v.value === record.paramTypeName
                        ) &&
                          paramTypeNameOptions[record.paramTypeNode].find(
                            (v) => v.value === record.paramTypeName
                          ).children) ||
                        []
                      : []
                  "
                />
              </div>
              <div :key="col" v-else>
                <a-input
                  style="margin: -5px 0"
                  :disabled="
                    detailsType === 'check' ||
                    pagination.pageSize * (pagination.current - 1) + index < 2
                  "
                  :value="record.fieldAlias"
                  @change="
                    (e) =>
                      handleChange(
                        e.target.value,
                        pagination.pageSize * (pagination.current - 1) + index,
                        col
                      )
                  "
                  placeholder="字段别名"
                />
              </div>
            </template>
            <div
              slot="actions"
              slot-scope="text, record, index"
              @drop="
                (e) =>
                  handleDrop(
                    e,
                    pagination.pageSize * (pagination.current - 1) + index
                  )
              "
            >
              <a-icon
                type="menu"
                :style="{
                  cursor:
                    pagination.pageSize * (pagination.current - 1) + index < 2
                      ? 'not-allowed'
                      : '',
                  color:
                    pagination.pageSize * (pagination.current - 1) + index < 2
                      ? '#ccc'
                      : '',
                }"
                :draggable="detailsType !== 'check'"
                @dragstart.stop="
                  (e) =>
                    handleDragStart(
                      e,
                      pagination.pageSize * (pagination.current - 1) + index
                    )
                "
              />
            </div>
          </a-table>
        </transition-group>
      </draggable>
    </div>
    <div class="content-footer">
      <div class="content-footer-btns">
        <a-button @click="handleReturn">
          {{ detailsType === "check" ? "返回" : "取消" }}
        </a-button>
        <a-button
          type="primary"
          @click="handleConfirm"
          v-if="detailsType !== 'check'"
        >
          {{ detailsType === "edit" ? "提交" : "生成策略" }}
        </a-button>
      </div>
    </div>
  </div>
</template>
<script>
import {
  Button,
  Cascader,
  DatePicker,
  Icon,
  Input,
  InputNumber,
  Radio,
  Table,
} from "ant-design-vue";
import {
  queryGraphCascader,
  queryRuleModelList,
  getRuleModelDetail,
  addOrEditWarningRule,
  getGraphMeta,
} from "@/shared/api/configManage.js";
import Draggable from "vuedraggable";
import { nanoid } from "nanoid";
import { cloneDeep } from "lodash";
import moment from "moment";
import { scrollToBottom, isNumber } from "@/utils/common.js";

const RadioGroup = Radio.Group;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

export default {
  name: "SchedulesDetails",
  props: ["detailsType", "details", "categoryOptions"],
  data() {
    return {
      selectItem: [],
      selectBaseItem: [],
      modalTitle: "",
      successModalShow: false,
      graphOptions: [],
      modelOptions: [],
      modelDetails: {}, // details.modelId对应的模型数据
      columns: [
        {
          title: "序号",
          dataIndex: "index",
          key: "index",
          width: 70,
          scopedSlots: { customRender: "index" },
        },
        {
          title: "变量类型",
          dataIndex: "paramType",
          key: "paramType",
          width: 359,
          scopedSlots: { customRender: "paramType" },
        },
        {
          title: "变量标识",
          dataIndex: "paramIdent",
          key: "paramIdent",
          width: 240,
          scopedSlots: { customRender: "paramIdent" },
        },
        {
          title: "属性字段名称",
          dataIndex: "paramField",
          key: "paramField",
          width: 240,
          scopedSlots: { customRender: "paramField" },
        },
        {
          title: "字段别名",
          dataIndex: "fieldAlias",
          key: "fieldAlias",
          width: 240,
          scopedSlots: { customRender: "fieldAlias" },
        },
        {
          title: "排序",
          dataIndex: "actions",
          key: "actions",
          width: 70,
          scopedSlots: { customRender: "actions" },
        },
      ],
      data: [
        // {
        //   paramTypeNode: "1",
        //   paramTypeName: "11",
        //   paramIdent: "1",
        //   paramField: "1",
        //   fieldAlias: "1",
        // },
        // {
        //   paramTypeNode: "2",
        //   paramTypeName: "22",
        //   paramIdent: "2",
        //   paramField: "2",
        //   fieldAlias: "2",
        // },
      ],
      pagination: {
        size: "small",
        total: 0,
        current: 1,
        pageSize: 5,
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
      selectedRowKeys: [],
      paramTypeNodeOptions: [
        {
          value: 0,
          label: "实体",
        },
        {
          value: 1,
          label: "关系",
        },
      ],
      paramTypeNameOptions: {
        0: [], // 实体 节点
        1: [], // 关系 边
      },
    };
  },
  components: {
    AButton: Button,
    ACascader: Cascader,
    ADatePicker: DatePicker,
    AIcon: Icon,
    AInput: Input,
    AInputNumber: InputNumber,
    ARadio: Radio,
    ARadioGroup: RadioGroup,
    ARangePicker: RangePicker,
    ATable: Table,
    ATextArea: TextArea,
    Draggable,
  },
  computed: {
    rowSelection() {
      return {
        columnWidth: 70,
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys) => {
          this.selectedRowKeys = selectedRowKeys;
        },
        getCheckboxProps: (record) => ({
          props: {
            disabled: record.key === 1 || record.key === 2,
            name: record.name,
          },
        }),
      };
    },
  },
  watch: {
    "details.radioValue"() {
      this.details.checkDate = undefined;
      this.details.dateNum = undefined;
      this.details.cycleUnit = undefined;
    },
  },
  async mounted() {
    console.log("props", this.details);
    await this.getGraphOptions();
    if (this.detailsType !== "add" && this.details.graphId) {
      // 查询图谱信息
      const { bluePrintId } = this.graphOptions.find(
        (item) => item.value === this.details.graphId[0]
      );
      this.getModalList(bluePrintId);
      await this.getGraphMeta(bluePrintId);
    }
    if (this.detailsType !== "add" && this.details.modelId) {
      // 查询模型信息
      await this.handleModelChange(this.details.modelId);
      this.data = cloneDeep(this.details.data);
    }
  },
  methods: {
    moment,
    handleReturn() {
      this.$emit("isDetailsShowChanged", false);
    },
    disabledDate(current) {
      return current && current < moment().subtract(1, "days").endOf("day");
    },
    async getGraphOptions() {
      // 可选图谱
      try {
        const graphList = await queryGraphCascader();
        const graphOptions = [];
        if (!graphList) {
          this.$message.error("获取图谱选择下拉数据失败");
        } else {
          graphList.map((graph) => {
            graphOptions.push({
              label: graph.graphChName,
              value: graph.id,
              bluePrintId: graph.bluePrintId,
              children: graph.graphBranchList.map((item) => ({
                label: item.graphCnName,
                value: item.id,
              })),
            });
          });
          this.graphOptions = graphOptions;
        }
      } catch (error) {
        this.$message.destroy();
        this.$message.error("获取图谱选择下拉数据失败");
      }
    },
    async getModalList(bluePrintId) {
      // 查询模型列表
      try {
        const res = await queryRuleModelList(bluePrintId);
        const modelOptions = [];
        if (res.message !== "成功" || !res.data) {
          this.$message.error("获取模型下拉数据失败");
        } else {
          res.data.map((item) => {
            modelOptions.push({
              value: item.id,
              label: item.modelName,
              modelType: item.modelType,
            });
          });
          this.modelOptions = modelOptions;
        }
      } catch (error) {
        this.$message.destroy();
        this.$message.error("获取模型下拉数据失败");
      }
    },
    async getGraphMeta(id) {
      // 获取二维表下拉选项
      try {
        const data = await getGraphMeta(id);
        const paramTypeNameOptions = {
          0: [],
          1: [],
        };
        if (!data) {
          this.$message.error("获取二维表下拉选项失败");
        } else {
          data.vertexMetas.map((item) => {
            paramTypeNameOptions[0].push({
              value: item.label,
              label: item.label,
              children: item.properties.map((v) => ({
                value: v.fieldName,
                label: v.fieldName,
                type: v.fieldType,
              })),
            });
          });
          data.edgeMetas.map((item) => {
            paramTypeNameOptions[1].push({
              value: item.label,
              label: item.label,
              children: item.properties.map((v) => ({
                value: v.fieldName,
                label: v.fieldName,
                type: v.fieldType,
              })),
            });
          });
          this.paramTypeNameOptions = paramTypeNameOptions;
          console.log(
            "🚀 ~ getGraphMeta ~ paramTypeNameOptions:",
            paramTypeNameOptions
          );
        }
      } catch (error) {
        this.$message.destroy();
        this.$message.error("获取二维表下拉选项失败");
      }
    },
    // 图谱选择
    async handleGraphChange(value) {
      this.$set(this.details, "graphId", value);
      this.$set(this.details, "modelId", undefined);
      const { bluePrintId } = this.graphOptions.find(
        (item) => item.value === value[0]
      );
      console.log(
        "🚀 ~ handleGraphChange ~ handleGraphChange:",
        value,
        bluePrintId,
        this.graphOptions
      );
      await this.getGraphMeta(bluePrintId);
      this.data = [
        {
          key: 1,
          paramTypeNode: 0,
          paramTypeName: "企业",
          paramIdent: undefined,
          paramField: undefined,
          fieldAlias: "企业名称",
        },
        {
          key: 2,
          paramTypeNode: 0,
          paramTypeName: "企业",
          paramIdent: undefined,
          paramField: undefined,
          fieldAlias: "所属集团",
        },
      ];
      this.getModalList(bluePrintId);
    },
    async handleEdit() {
      console.log("🚀 ~ handleEdit ~ handleEdit:", this.details);
      if (this.details.status == 0) return false;
      this.$emit("detailsChanged", this.details);
      this.$emit("isDetailsShowChanged", true);
      this.$emit("detailsTypeChanged", "edit");
    },
    async handleConfirm() {
      console.log("🚀 ~ handleConfirm ~ handleConfirm:", this.details);
      if (!this.details.name) {
        this.$message.warning("请输入策略名称！");
        return false;
      }
      if (!this.details.graphId.length) {
        this.$message.warning("请选择图谱");
        return false;
      }
      if (!this.details.modelId) {
        this.$message.warning("请选择模型");
        return false;
      }
      if (!this.details.categoryId) {
        this.$message.warning("请选择策略分类");
        return false;
      }
      if (!this.details.riskLevel) {
        this.$message.warning("请选择风险等级");
        return false;
      }
      if (!this.details.startStopTime.length) {
        this.$message.warning("请选择生效日期");
        return false;
      }
      if (this.details.radioValue == 0 && !this.details.checkDate) {
        this.$message.warning("请指定时间");
        return false;
      } else if (
        this.details.radioValue == 1 &&
        (!isNumber(this.details.cycleUnit) || !this.details.dateNum)
      ) {
        this.$message.warning("请指定周期");
        return false;
      } else if (
        this.details.radioValue == 2 &&
        (!isNumber(this.details.cycleUnit) || !this.details.dateNum)
      ) {
        this.$message.warning("请指定频次");
        return false;
      }
      for (let i = 0; i < this.data.length; i++) {
        const ele = this.data[i];
        console.log("🚀 ~ handleConfirm ~ ele:", ele);
        if (!isNumber(ele.paramTypeNode)) {
          this.$message.warning(`二维表第${i + 1}行，请选择变量类型`);
          return false;
        }
        if (!ele.paramTypeName) {
          this.$message.warning(`二维表第${i + 1}行，请选择变量标签`);
          return false;
        }
        if (!ele.paramIdent) {
          this.$message.warning(`二维表第${i + 1}行，请输入变量标识`);
          return false;
        }
        if (!ele.paramField) {
          this.$message.warning(`二维表第${i + 1}行，请选择属性字段名称`);
          return false;
        }
        if (!ele.fieldAlias) {
          this.$message.warning(`二维表第${i + 1}行，请输入变量别名`);
          return false;
        }
      }
      const json = {
        warningRuleId:
          this.detailsType === "edit" ? this.details.id : undefined,
        ruleName: this.details.name,
        ruleDesc: this.details.desc,
        level: this.details.riskLevel,
        checkStatus: 0,
        ruleModel: this.details.modelId,
        effectEndDate: this.details.startStopTime[1],
        effectStartDate: this.details.startStopTime[0],
        checkType: this.details.radioValue,
        cycleUnit: this.details.cycleUnit,
        dateNum: this.details.dateNum,
        checkDate: this.details.checkDate,
        categoryIds: [this.details.categoryId],
        graphId: this.details.graphId[0],
        graphBranchId: this.details.graphId[1],
        warningHeaderVoList: this.data.map((item, index) => {
          console.log(
            "test",
            item,
            this.paramTypeNameOptions,
            this.paramTypeNameOptions[item.paramTypeNode]
          );
          return {
            nodeType: item.paramTypeNode,
            labelName: item.paramTypeName,
            specVar: item.paramIdent,
            fieldName: item.paramField,
            fieldType: this.paramTypeNameOptions[item.paramTypeNode]
              .find((v) => v.value === item.paramTypeName)
              .children.find((v) => v.value === item.paramField).type,
            headerName: item.fieldAlias,
            headerOrder: index + 1,
          };
        }),
      };
      console.log("json", json);
      try {
        const res = await addOrEditWarningRule(json);
        if (res.message === "成功") {
          this.$message.success(
            this.detailsType === "edit" ? "修改成功" : "添加成功"
          );
          this.handleReturn();
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.destroy();
        this.$message.error("操作失败");
      }
    },
    detailsChanged(value) {
      this.$emit("detailsChanged", value);
    },
    async handleModelChange(value) {
      // 获取选中的模型对应的详情数据——modelDetails
      const json = {
        id: value,
      };
      try {
        const res = await getRuleModelDetail(json);
        console.log("🚀 ~ handleCheck ~ res:", res);
        if (!res || res.length === 0) {
          this.$message.error("获取模型详情失败");
          return false;
        }
        const data = res[0];
        this.$set(this.details, "categoryId", data.detailsDto.categoryId);
        this.$set(this.details, "categoryName", data.detailsDto.categoryName);
        this.modelDetails = data;
        this.modelDetails.scripts = data.modelScripts;
        this.modelDetails.imgString =
          data.createType === 2
            ? `http://172.18.192.65:8082${data.detailsDto.imagePath}`
            : `http://172.18.192.65:8082${data.path}`;
        console.log(
          "🚀 ~ handleModelChange ~ this.modelDetails:",
          this.modelDetails
        );
      } catch (error) {
        this.$message.destroy();
        this.$message.error("获取模型详情失败");
      }
    },
    handleAddRow() {
      if (this.detailsType === "check") return;
      this.data.push({
        key: nanoid(),
        paramTypeNode: undefined,
        paramTypeName: undefined,
        paramIdent: undefined,
        paramField: undefined,
        fieldAlias: undefined,
      });
      scrollToBottom(this, "schedules-details", 5);
    },
    handleDeleteRow() {
      if (this.detailsType === "check" || !this.selectedRowKeys.length) return;
      this.selectedRowKeys.map((key) => {
        const index = this.data.findIndex((item) => item.key === key);
        this.data.splice(index, 1);
      });
      this.selectedRowKeys = [];
    },
    handleChange(value, index, column) {
      const newData = [...this.data];
      console.log(
        "🚀 ~ handleChange ~ handleChange:",
        value,
        index,
        column,
        newData
      );
      const target = newData[index];
      console.log("🚀 ~ handleChange ~ target:", target);
      if (target) {
        target[column] = value;
        this.data = newData;
      }
    },
    handleDragStart(e, index) {
      if (index < 2) return;
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("index", index);
    },
    handleDrop(e, index) {
      // todo 完善拖拽逻辑
      if (index < 2) return;
      e.preventDefault();
      e.stopPropagation();
      const _index = e.dataTransfer.getData("index");
      if (_index) {
        const newData = [...this.data];
        newData.splice(_index, 1);
        newData.splice(index, 0, this.data[_index]);
        this.data = newData;
      }
    },
  },
};
</script>
<style lang="less">
.schedules-details {
  height: calc(100% - 53px);
  display: flex;
  overflow: auto;
  padding: 20px;
  background: #fff;
  flex-direction: column;

  .script-template,
  .config-template-config {
    flex: 1;
  }

  &-header {
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;

    &-title {
      font-size: 20px;
      font-weight: 600;
    }

    &-btns {
      .ant-btn {
        margin-left: 10px;
      }
    }
  }

  &-content {
    display: flex;
    flex-direction: column;

    .content-top {
      margin-bottom: 40px;
      background: #fff;

      &-item {
        display: flex;
        margin-bottom: 16px;

        &:last-child {
          margin-bottom: 0;
        }

        .item-box {
          display: flex;
          max-width: 360px;
          line-height: 32px;
          margin-right: 100px;
          width: calc((100% - 300px) / 3);

          &.textarea {
            width: calc((100% - 300px) / 3 * 2 + 100px);
            margin-right: 0;
            max-width: 820px;
          }
        }

        .item-label {
          width: 75px;

          &.long-label {
            width: 90px;
          }
        }

        .item-btn {
          color: @blue;
          cursor: pointer;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;

          &.long-btn {
            width: calc(100% - 90px);
          }

          &.disabled {
            cursor: not-allowed;
            color: @disabledColor;
          }
        }

        .item-input,
        .item-text {
          width: calc(100% - 75px);
        }

        .item-text {
          color: @secondaryTextColor;
        }
      }
    }

    .content-radio {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      .ant-radio-group {
        display: flex;
        align-items: center;

        .ant-radio-wrapper {
          display: flex;
          align-items: center;
        }
      }
    }
  }

  &-views {
    display: flex;
    margin-bottom: 40px;

    .views-left {
      width: calc(100% - 540px);
      margin-right: 20px;

      &-script {
        height: 400px;
        border: 1px solid #d6dbe3;
        padding: 8px 16px;
        border-radius: 6px;
      }
    }

    .views-right {
      width: 520px;

      &-graph {
        height: 400px;
        border: 1px solid #d6dbe3;
        border-radius: 6px;
        overflow: auto;

        img {
          width: auto;
          height: auto;
          display: flex;
        }
      }
    }
  }

  &-table {
    .table-header-btns {
      .ant-btn {
        border: 0;
      }
    }
  }

  .content-footer {
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9;
    height: 53px;
    display: flex;
    padding: 0 24px;
    line-height: 52px;
    position: absolute;
    background: #fff;
    align-items: center;
    justify-content: flex-end;

    .ant-btn {
      margin-left: 8px;
    }
  }

  .schema-list-modal {
    .ant-modal {
      max-width: 1200px;
    }
  }
}

.success-model-modal-content {
  text-align: center;
  padding: 30px 24px 24px;

  .content-img {
    width: 70px;
    height: 70px;
    margin-bottom: 30px;
  }

  .content-text {
    height: 28px;
    font-size: 20px;
    line-height: 28px;
    padding-left: 16px;
    margin-bottom: 60px;
    color: @primaryTextColor;
  }
}
</style>
