<template>
  <div class="entity-search">
    <div class="entity-search-type">
      <div class="entity-search-type-content">
        <label class="content-title">概念类别：</label>
        <a-select
          placeholder="请选择"
          :value="rulesGroup[0].label"
          :options="entityOptions"
          class="type-options"
          @change="onTypeChange"
        />
      </div>
      <a-tooltip placement="left">
        <template slot="title">
          <span>通过概念类别和属性值进行筛选</span>
        </template>
        <a-icon type="question-circle" />
      </a-tooltip>
    </div>
    <div class="entity-search-rules">
      <label class="content-title">请设置条件规则：</label>
      <div class="entity-search-rules-btns">
        <a-button type="primary" @click="addRules('single', [])">
          <a-icon type="plus-square" /> 新建规则
        </a-button>
        <a-button type="primary" @click="addRules('multi', [])">
          <a-icon type="folder-add" /> 新建规则组
        </a-button>
      </div>
    </div>
    <div class="entity-search-content">
      <group-rules
        :list="rulesGroup"
        :originList="rulesGroup"
        :value="[]"
        :floor="0"
        :rulesOptions="rulesOptions"
        :conditionOptions="conditionOptions"
        @onAttributeChange="onAttributeChange"
      />
    </div>
    <div class="entity-search-footer">
      <span class="content-title">
        限制条数：
        <a-input-number
          :min="1"
          :max="100"
          :precision="0"
          class="search-input"
          v-model="searchLimit"
          :parser="(value) => (/^\d+$/.test(value) ? value : 1)"
        />
      </span>
      <div class="footer-btns">
        <a-button class="search-button" @click="resetRules">
          <a-icon type="redo" :rotate="-90" /> 重置
        </a-button>
        <a-button class="search-button" @click="saveInput" type="primary">
          <a-icon type="cloud-download" /> 保存
        </a-button>
        <a-button
          type="primary"
          class="search-button"
          @click="searchInput"
          :loading="searchLoading"
          icon="search"
        >
          查询
        </a-button>
      </div>
    </div>
    <a-modal
      class="search-modal"
      :width="400"
      :visible="saveSearchVisible"
      :closable="false"
      :destroyOnClose="true"
      @cancel="onCancel"
      :footer="null"
      :mask="false"
      centered
      title="保存查询"
    >
      <div class="search-modal-content">
        <label> 名称： </label>
        <a-input
          autoComplete="off"
          v-model.trim="nameValue"
          class="search-modal-input"
        />
        <div class="modal-save-button">
          <a-button @click="onCancel">取消</a-button>
          <a-button
            v-if="userRights.btn_saveEntitySearch"
            html-type="submit"
            type="primary"
            @click="saveSearch"
            >保存</a-button
          >
        </div>
      </div>
    </a-modal>
    <search-result-modal
      v-if="resultModalVisible"
      :data="graphData"
      @showResults="showResults"
      :resultModalVisible="resultModalVisible"
      @resultModalVisibleChanged="resultModalVisibleChanged"
    />
  </div>
</template>
<script>
import GroupRules from "./groupRules";
import SearchResultModal from "./searchResultModal";
import moment from "moment";
import { Button, Icon, Input, InputNumber, Tooltip } from "ant-design-vue";
import { advancedSearch, handleSaveEntity } from "@/shared/api/graph.js";
import { checkThreshold } from "@/utils/graph.js";
import { cloneDeep, find } from "lodash";
import { nanoid } from "nanoid";
import { mapState, mapMutations } from "vuex";

export default {
  name: "EntitySearch",
  props: [
    "searchNodeAll",
    "entitySearchOption",
    "savedEntityData",
    "graphNodes",
  ],
  data() {
    return {
      graphData: [],
      searchLimit: 10,
      rulesGroup: [
        {
          id: -1,
          types: "relations",
          relations: "且",
          label: undefined,
          key: [],
        },
      ],
      rulesOptions: [],
      conditionOptions: [],
      rulesContent: "",
      searchLoading: false,
      resultModalVisible: false,
      saveSearchVisible: false,
      nameValue: "",
    };
  },
  components: {
    AButton: Button,
    AIcon: Icon,
    AInput: Input,
    AInputNumber: InputNumber,
    ATooltip: Tooltip,
    GroupRules,
    SearchResultModal,
  },
  computed: {
    ...mapState("graphOptions", ["branchId", "graphId"]),
    ...mapState("rightsOptions", ["userRights"]),
    entityOptions() {
      return this.searchNodeAll.map((item) => {
        return {
          label: item,
          value: item,
        };
      });
    },
  },
  methods: {
    ...mapMutations("graphOptions", {
      setSearchVertex: "setSearchVertex",
    }),
    onTypeChange(value) {
      // 切换概念类别
      this.rulesGroup = [
        {
          id: -1,
          types: "relations",
          relations: "且",
          label: value,
        },
      ];
      this.rulesContent = "获取全部";
      this.resultModalVisible = false;
      this.rulesOptionsChange();
      if (
        this.rulesGroup[0].label === "企业" ||
        this.rulesGroup[0].label === "个人" ||
        this.rulesGroup[0].label === "账号"
      ) {
        this.conditionOptions = [
          {
            label: "包含",
            value: "包含",
          },
          {
            label: "不包含",
            value: "不包含",
          },
          {
            label: "=",
            value: "=",
          },
          {
            label: "!=",
            value: "!=",
          },
          {
            label: ">=",
            value: ">=",
          },
          {
            label: "<=",
            value: "<=",
          },
          {
            label: "<",
            value: "<",
          },
          {
            label: ">",
            value: ">",
          },
          {
            label: "like",
            value: "like",
          },
          {
            label: "正序Top",
            value: "正序Top",
          },
          {
            label: "倒序Top",
            value: "倒序Top",
          },
        ];
      } else if (this.rulesGroup[0].label === "贷款下发机构") {
        this.conditionOptions = [
          {
            label: "=",
            value: "=",
          },
          {
            label: "!=",
            value: "!=",
          },
          {
            label: ">=",
            value: ">=",
          },
          {
            label: "<=",
            value: "<=",
          },
          {
            label: "<",
            value: "<",
          },
          {
            label: ">",
            value: ">",
          },
          {
            label: "正序Top",
            value: "正序Top",
          },
          {
            label: "倒序Top",
            value: "倒序Top",
          },
        ];
      }
    },
    resetRules() {
      this.rulesGroup = [
        {
          id: -1,
          types: "relations",
          relations: "且",
          label: this.rulesGroup[0].label,
        },
      ];
      this.rulesContent = "获取全部";
      this.resultModalVisible = false;
    },
    addRules(type, key) {
      if (!this.rulesGroup[0].label) {
        this.$message.warning("请先选择概念类型");
        return false;
      }
      const resultRulesArr = this.updateRulesGroup(key, this.rulesGroup);
      if (type === "single") {
        const singleItem = {
          id: nanoid(),
          attribute: undefined,
          attributeControl: "value",
          attributeType: "string",
          condition: undefined,
          isFunction: false,
          types: "single",
          value: undefined,
        };
        resultRulesArr.push(singleItem);
      } else {
        resultRulesArr.push([
          {
            id: nanoid(),
            types: "relations",
            relations: "且",
            label: this.rulesGroup[0].label,
          },
        ]);
      }
      this.resultModalVisible = false;
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
    saveInput() {
      if (!this.rulesContent) {
        this.$message.error("请输入查询条件");
      } else {
        this.saveSearchVisible = true;
      }
    },
    handleCreateJson() {
      const rulesArr = cloneDeep(this.rulesGroup);
      const targetArr = rulesArr.slice(1);
      const postChildJson = this.handlePostJson(targetArr);
      const conditionsJson = {
        label: rulesArr[0].label,
        orderByCondition: {
          attribute: "",
          attributeType: "",
          orderByType: "ASC",
        },
        rootGroup: {
          childs: postChildJson,
          relations: this.rulesGroup[0].relations === "且" ? "and" : "or",
          types: "group",
        },
      };

      const json = {
        branchId: this.branchId,
        conditions: [conditionsJson],
        desc: this.rulesContent,
        elementType: "vertex",
        filterNote: false,
        id: this.graphId,
        createTimestamp: moment().valueOf(),
        queryType: "AdvancedSearch",
        tags: [],
      };
      if (this.searchLimit) {
        json.limit = this.searchLimit;
      }
      return json;
    },
    handlePostJson(targetArr) {
      const resultArr = [];
      targetArr.map((item) => {
        item.id = 0;
        if (item.length) {
          const childArr = this.handlePostJson(item.slice(1));
          resultArr.push({
            childs: childArr,
            types: "group",
            relations: item[0].relations === "且" ? "and" : "or",
          });
        } else {
          switch (item.condition) {
            case "包含":
              item.condition = "contains";
              break;
            case "不包含":
              item.condition = "not_contain";
              break;
            case "=":
              item.condition = "equals";
              break;
            case "!=":
              item.condition = "not_equal";
              break;
            case ">=":
              item.condition = "greater_or_equal";
              break;
            case "<=":
              item.condition = "lower_or_equal";
              break;
            case ">":
              item.condition = "greater";
              break;
            case "<":
              item.condition = "lower";
              break;
            case "正序Top":
              item.condition = "asc_top";
              break;
            case "倒序Top":
              item.condition = "desc_top";
              break;
            default:
              break;
          }
          if (item.value !== "") {
            resultArr.push(item);
          }
        }
      });
      return resultArr;
    },
    async searchInput() {
      if (!this.rulesContent) {
        this.$message.error("请输入查询条件");
      } else {
        this.searchLoading = true;
        const json = this.handleCreateJson();
        const res = await advancedSearch(json);
        this.searchLoading = false;
        if (res && res.vertices && res.vertices.length > 0) {
          this.$message.success("查询成功");
          this.graphData = res.vertices.map((item) => {
            return {
              ...item,
              key: item.id,
              dataType: item.label,
            };
          });
          this.resultModalVisible = true;
        } else {
          this.$message.info("未找到符合要求的实体");
        }
      }
    },
    handleUpdateRulesContent(targetArr) {
      const pSymbol = targetArr[0].relations === "且" ? "&&" : "||";
      const rulesContentString = this.updateRulesString(
        targetArr,
        "",
        1,
        pSymbol,
        "",
        0
      );
      this.rulesContent = rulesContentString;
    },
    updateRulesString(
      targetArr,
      rulesContentString,
      type,
      pSymbol,
      cSymbol,
      floor
    ) {
      let targetString = rulesContentString;
      if (type === 1) {
        targetArr.map((item, index) => {
          if (item.length >= 0) {
            // 数组
            const cSymbol = item[0].relations === "且" ? "&&" : "||";
            targetString = this.updateRulesString(
              item,
              targetString,
              2,
              pSymbol,
              cSymbol,
              floor + 1
            );
          } else {
            // 对象
            if (index === 1 && item.value) {
              targetString += item.attribute + item.condition + item.value;
            } else if (index > 1 && item.value) {
              targetString +=
                " " +
                pSymbol +
                " " +
                item.attribute +
                " " +
                item.condition +
                " " +
                item.value;
            }
          }
        });
      } else {
        targetArr.map((item, index) => {
          if (item.length >= 0) {
            // 数组
            const ccSymbol = item[0].relations === "且" ? "&&" : "||";
            targetString = this.updateRulesString(
              item,
              targetString,
              2,
              cSymbol,
              ccSymbol,
              floor + 1
            );
          } else {
            // 对象
            if (index === 1 && item.value) {
              targetString +=
                " " +
                pSymbol +
                " " +
                "(" +
                item.attribute +
                " " +
                item.condition +
                " " +
                item.value;
              if (index === targetArr.length - 1) {
                for (let i = 0; i < floor; i++) {
                  targetString += ")";
                }
              }
            } else if (
              index > 1 &&
              index < targetArr.length - 1 &&
              item.value
            ) {
              targetString +=
                " " +
                cSymbol +
                " " +
                item.attribute +
                " " +
                item.condition +
                " " +
                item.value;
            } else if (index === targetArr.length - 1) {
              if (item.value) {
                targetString +=
                  " " +
                  cSymbol +
                  " " +
                  item.attribute +
                  " " +
                  item.condition +
                  " " +
                  item.value;
                for (let i = 0; i < floor; i++) {
                  targetString += ")";
                }
              } else {
                for (let i = 0; i < floor; i++) {
                  targetString += ")";
                }
              }
            }
          }
        });
      }
      if (!targetString) {
        targetString = "获取全部";
      }
      return targetString;
    },
    rulesOptionsChange() {
      if (this.rulesGroup[0].label) {
        const target = find(
          this.entitySearchOption,
          (v) => v.label === this.rulesGroup[0].label
        );
        const arr = target.property.map((item) => {
          return {
            label: item.value,
            value: item.value,
          };
        });
        this.rulesOptions = arr;
      } else {
        this.rulesOptions = [];
      }
    },
    onAttributeChange(type, key, value) {
      const rulesArr = cloneDeep(this.rulesGroup);
      const resultRulesArr = this.updateRulesGroup(key, rulesArr);
      if (type === "attribute") {
        resultRulesArr.attribute = value;
      } else if (type === "condition") {
        resultRulesArr.condition = value;
      } else if (type === "value") {
        resultRulesArr.value = value;
      } else if (type === "relations") {
        resultRulesArr.relations = value;
      }
      this.rulesGroup = rulesArr;
      this.handleUpdateRulesContent(rulesArr);
      this.resultModalVisible = false;
    },
    onCancel() {
      this.saveSearchVisible = false;
      this.nameValue = "";
    },
    async saveSearch() {
      if (this.nameValue === "") {
        this.$message.warning("请输入保存的名称");
        return false;
      }
      const jsonData = this.handleCreateJson();
      let sentenceArr = this.savedEntityData;
      const flag = sentenceArr.filter((item) => {
        if (item.name === this.nameValue) {
          return item;
        }
      });
      if (!flag.length) {
        const nowTime = moment().format("YYYY-MM-DD HH:mm:ss");
        const arrItem = {
          id: nanoid(),
          name: this.nameValue,
          createTime: nowTime,
          cqlContext: this.rulesContent,
        };
        arrItem.conditions = jsonData.conditions;
        arrItem.maxCount = jsonData.limit;
        sentenceArr = [...this.savedEntityData, arrItem];
        const postData = {
          maxCount: jsonData.limit,
          name: this.nameValue,
          conditions: {
            context: this.rulesContent,
            condition: jsonData.conditions,
          },
          graphId: this.graphId,
        };
        const res = await handleSaveEntity(postData);
        if (res.message === "成功") {
          this.$message.success("保存成功");
          this.$emit("savedEntityDataChanged", sentenceArr);
        } else {
          this.$message.error(`${res.message}`);
        }
        this.onCancel();
      } else {
        this.$message.error("保存的名称重复");
      }
    },
    showResults(type, checkedList) {
      this.$emit("canvasLoadingChanged", { loading: true, tip: "正在布局..." });
      let elements = [...checkedList];
      const data = {
        replace: false,
        elements,
        referenceNodes: [],
        anchorNodeIds: [],
        type: "NEIGHBOR",
      };
      if (type === "replace") {
        this.setSearchVertex([elements[0]]);
        sessionStorage.setItem("searchVertex", JSON.stringify([elements[0]]));
        this.$graph.datas.clear();
      }
      const { nodes } = checkThreshold(data, this.$graph, "1");
      if (type === "addition") {
        nodes.forEach((node) => {
          node.selected = true;
          this.$graph.datas.addNode(node);
        });
      } else {
        this.$graph.datas.setNodes(nodes);
      }
      this.resultModalVisible = false;
      this.$emit("isShowSceneSearchChanged", false);
      this.$emit("selectedElesChanged", [], []);
      this.$graph.events.changeLayout("breadthfirst");
      this.$emit("canvasLoadingChanged", { loading: false, tip: "布局完成" });
      const addNodeArr = nodes.map((node) => node.data);
      if (type === "addition") {
        this.$emit("graphNodesChanged", [...this.graphNodes, ...addNodeArr]);
      } else {
        this.$emit("graphNodesChanged", addNodeArr);
      }
    },
    resultModalVisibleChanged(value) {
      this.resultModalVisible = value;
    },
  },
};
</script>
<style lang="less" scoped>
.entity-search {
  height: 100%;

  .content-title {
    color: #949dad;
  }

  &-type {
    display: flex;
    padding: 0 24px;
    align-items: center;
    margin-bottom: 15px;
    justify-content: space-between;

    &-content {
      .type-options {
        width: 200px;
        margin-left: 10px;
      }
    }

    .anticon-question-circle {
      color: #1790fa;
    }
  }

  &-rules {
    display: flex;
    align-items: center;
    padding: 0 24px 15px;
    justify-content: space-between;
    border-bottom: 1px solid #e0e0e0;

    &-btns {
      .ant-btn {
        &:first-child {
          margin-right: 10px;
        }

        .anticon {
          font-size: 15px;
        }
      }
    }
  }

  &-content {
    width: 100%;
    overflow: auto;
    padding: 12px 24px;
    height: calc(100% - 143px);
    border-bottom: 1px solid #e0e0e0;
  }

  &-footer {
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    padding: 0 24px;
    position: absolute;
    align-items: center;
    justify-content: space-between;

    .search-input {
      width: 80px;
    }

    .footer-btns {
      .search-button {
        &:not(:last-child) {
          margin-right: 10px;
        }

        .anticon {
          font-size: 15px;
        }
      }
    }
  }
}
</style>
