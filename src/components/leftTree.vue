<template>
  <div class="left-tree-container">
    <div class="left-tree">
      <a-select
        show-search
        placeholder="请输入单位编码或名称"
        option-filter-prop="children"
        class="left-tree-top"
        :default-active-first-option="false"
        :show-arrow="false"
        :filter-option="false"
        :not-found-content="null"
        v-model="searchValue"
        :autoClearSearchValue="false"
        @search="onSearch"
        @change="onChange"
        allowClear
      >
        <a-select-option
          v-for="item in treeOptions"
          :value="item.value"
          :key="item.value"
          >{{ item.label }}</a-select-option
        >
      </a-select>
      <a-tree
        ref="tree"
        :tree-data="treeData"
        :selectedKeys="selectedKeys"
        :default-selected-keys="defaultKey"
        :auto-expand-parent="autoExpandParent"
        :expanded-keys="expandedKeys"
        @expand="onExpand"
        @select="changeKey"
        show-icon
      >
        <div class="left-tree-icon" slot="city">
          <icon-svg icon-class="市级单位"></icon-svg>
        </div>
        <div class="left-tree-icon" slot="manage">
          <icon-svg icon-class="主管单位"></icon-svg>
        </div>
        <div class="left-tree-icon" slot="budget">
          <icon-svg icon-class="预算单位"></icon-svg>
        </div>
        <div class="left-tree-icon" slot="district">
          <icon-svg icon-class="区级单位"></icon-svg>
        </div>

        <template slot="title" slot-scope="{ title, key }">
          <a-tooltip :title="title">
            <span
              v-if="searchValue && title.indexOf(searchValue) > -1"
              :data-key="key"
            >
              {{ title.substr(0, title.indexOf(searchValue)) }}
              <span style="color: #f50">{{ searchValue }}</span>
              {{
                title.substr(title.indexOf(searchValue) + searchValue.length)
              }}
            </span>
            <span v-else :data-key="key">{{ title }}</span>
          </a-tooltip>
        </template>
      </a-tree>
    </div>
  </div>
</template>
<script>
import {
  getBudgetLeftTree,
  getLeftTreeOptions,
} from "@/shared/newApi/budget/budget.js";
import {
  findItemInTree,
  findNodeByIcon,
  findParentNodeInfo,
} from "@/utils/common.js";
import { Select, Tooltip, Tree } from "ant-design-vue";
import { mapMutations, mapState } from "vuex";
import { debounce } from "lodash";

export default {
  name: "LeftTree",
  props: ["parentType"],
  data() {
    return {
      allKeys: [],
      dataList: [], //dataList为树的展开结构
      selectedKeys: [],
      searchValue: undefined,
      autoExpandParent: true,
      expandedKeys: [],
      treeOptions: [],
    };
  },
  components: {
    ASelect: Select,
    ATree: Tree,
    ATooltip: Tooltip,
  },
  computed: {
    ...mapState("blockAnalysis", ["blockChoosedYear"]),
    ...mapState("managePortrait", {
      treeData: (state) => state.treeData,
      defaultKey: (state) => state.defaultKey,
      manageCurTreeItem: (state) => state.curTreeItem,
      manageCurTreeItemFather: (state) => state.curTreeItemFather,
    }),
    ...mapState("budgetPortrait", {
      budgetCurTreeItem: (state) => state.curTreeItem,
      budgetCurTreeItemFather: (state) => state.curTreeItemFather,
    }),
  },
  watch: {},
  async mounted() {
    //获取左侧树
    this.setDefaultKey([]);
    await this.getBudgetLeftTree();
    // 下方在本地调试时解开
    //初始进入页面需要选中的key值，后续从支出情况进入该页面时，需要根据预算单位名称获取该预算单位的key值，再将其key值传递给selectedKeys
    // const tree = findNodeByIcon(this.treeData);
    // this.expandedKeys = [tree.key];
    // this.setCurTreeItem(tree);
    // this.defaultKey = [tree.key];
    // this.selectedKeys = this.defaultKey;
    // this.generateList(this.treeData);
  },
  methods: {
    ...mapMutations("managePortrait", {
      setTreeData: "setTreeData",
      setDefaultKey: "setDefaultKey",
      setManageCurTreeItem: "setCurTreeItem",
      setManageCurTreeItemFather: "setCurTreeItemFather",
    }),
    ...mapMutations("budgetPortrait", {
      setBudgetCurTreeItem: "setCurTreeItem",
      setBudgetCurTreeItemFather: "setCurTreeItemFather",
    }),
    //获取左侧树
    async getBudgetLeftTree() {
      const json = {
        year: this.blockChoosedYear,
      };
      const res = await getBudgetLeftTree(json);
      console.log("页面内 获取左侧树res", res);
      if (res.message === "成功") {
        console.log("message成功 获取左侧树", res.data);
        res.data.map((item) => (item.disabled = true));
        this.setTreeData(res.data);

        // 如果有查询树的key值，根据key值获取树结构
        const queryTreeKey = this.$route.query.key;
        const queryTreeKeyType = this.$route.query.type || "key";
        if (queryTreeKey) {
          const tree = findItemInTree(res.data, queryTreeKey, queryTreeKeyType);
          const fatherNode = findParentNodeInfo(
            queryTreeKey,
            res.data,
            queryTreeKeyType
          );
          if (this.parentType === "manage") {
            this.setManageCurTreeItem(tree || {});
            this.setManageCurTreeItemFather(fatherNode || {});
          } else {
            this.setBudgetCurTreeItem(tree || {});
            this.setBudgetCurTreeItemFather(fatherNode || {});
          }
        }
        console.log(
          "this.manageCurTreeItem",
          this.manageCurTreeItem,
          this.manageCurTreeItemFather
        );
        console.log(
          "this.budgetCurTreeItem",
          this.budgetCurTreeItem,
          this.budgetCurTreeItemFather
        );
        if (this.parentType === "manage") {
          this.setDefaultKey(
            this.manageCurTreeItem.key ? [this.manageCurTreeItem.key] : []
          );
        } else {
          this.setDefaultKey(
            this.budgetCurTreeItem.key ? [this.budgetCurTreeItem.key] : []
          );
        }
        if (!this.defaultKey.length) {
          //找到第一个节点
          const tree = findNodeByIcon(res.data, this.parentType);
          console.log("获取树进行函数转换", tree);
          this.expandedKeys = [tree.key];
          this.setDefaultKey([tree.key]);
          this.selectedKeys = [tree.key];
          const fatherNode = findParentNodeInfo(this.selectedKeys[0], res.data);
          if (this.parentType === "manage") {
            this.setManageCurTreeItem(tree || {});
            this.setManageCurTreeItemFather(fatherNode || {});
          } else {
            this.setBudgetCurTreeItem(tree || {});
            this.setBudgetCurTreeItemFather(fatherNode || {});
          }
        } else {
          this.expandedKeys =
            this.parentType === "manage"
              ? [this.manageCurTreeItemFather.key]
              : [this.budgetCurTreeItemFather.key];
          this.selectedKeys = this.defaultKey;

          this.$nextTick(() => {
            this.scrollToSelectedNode();
          });
        }

        // console.log("2121212121", fatherNode);
        this.generateList(res.data);
      } else {
        this.$message.error(res.message);
      }
    },
    generateList(data) {
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const key = node.key;
        this.dataList.push({ key, title: key });
        if (node.children) {
          this.generateList(node.children);
        }
      }
    },

    //搜索树效果
    getParentKey(key, tree) {
      let parentKey;
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
          if (node.children.some((item) => item.key === key)) {
            parentKey = node.key;
          } else if (this.getParentKey(key, node.children)) {
            parentKey = this.getParentKey(key, node.children);
          }
        }
      }
      return parentKey;
    },

    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onSearch: debounce(async function (value) {
      console.log("🚀 ~ onSearch ~ onSearch:", value);
      if (!value) {
        this.treeOptions = [];
        return;
      }
      const res = await getLeftTreeOptions({
        year: this.blockChoosedYear,
        value,
      });
      if (res.message === "成功") {
        this.treeOptions = res.data;
      } else {
        this.$message.error(res.message);
      }
    }, 1000),
    onChange(value) {
      console.log("🚀 ~ onChange ~ onChange:", value);
      setTimeout(() => {
        const expandedKeys = [this.getParentKey(value, this.treeData)];
        Object.assign(this, {
          expandedKeys,
          searchValue: value,
          autoExpandParent: true,
        });
        const tree = findItemInTree(this.treeData, value);
        const fatherNode = findParentNodeInfo(value, this.treeData);
        const icon = tree.slots.icon;
        console.log("🚀 ~ onChange ~ tree:", tree);
        if (!tree) return;
        this.selectedKeys = [tree.key];
        if (icon === "manage") {
          this.setManageCurTreeItem(tree || {});
          this.setManageCurTreeItemFather(fatherNode || {});

          if (this.parentType === "budget") {
            //跳转到主管单位页面
            this.$router.push({
              name: "managePortrait",
            });
          } else {
            this.$nextTick(() => {
              this.scrollToSelectedNode();
            });
          }
        } else if (icon === "budget") {
          this.setBudgetCurTreeItem(tree || {});
          this.setBudgetCurTreeItemFather(fatherNode || {});

          if (this.parentType === "manage") {
            //跳转到预算单位页面
            this.$router.push({
              name: "budgetPortrait",
            });
          } else {
            this.$nextTick(() => {
              this.scrollToSelectedNode();
            });
          }
        }
      }, 500);
    },
    scrollToSelectedNode() {
      const _that = this;
      setTimeout(() => {
        if (_that.$refs.tree && _that.selectedKeys.length > 0) {
          const selectedNode = _that.$refs.tree.$el.querySelector(
            `[data-key="${_that.selectedKeys[0]}"]`
          );
          console.log(
            "🚀 ~ scrollToSelectedNode ~ selectedNode:",
            selectedNode
          );
          if (selectedNode) {
            selectedNode.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }
      }, 2000); // todo 调整时间
    },

    //切换内容
    changeKey(selectedKeys, e) {
      this.selectedKeys = selectedKeys;
      const selectedNode = e.selectedNodes;
      // console.log("selectedNode", selectedNode);
      const node = selectedNode[0].data.props.dataRef;
      //判断当前节点是主管单位还是预算单位
      const type = node.slots.icon; //manage、budget
      const fatherNode = findParentNodeInfo(selectedKeys[0], this.treeData);
      if (type === "manage") {
        this.setManageCurTreeItem(node || {});
        this.setManageCurTreeItemFather(fatherNode || {});

        if (this.parentType === "budget") {
          //跳转到主管单位页面
          this.$router.push({
            name: "managePortrait",
          });
        }
      } else if (type === "budget") {
        this.setBudgetCurTreeItem(node || {});
        this.setBudgetCurTreeItemFather(fatherNode || {});

        if (this.parentType === "manage") {
          //跳转到预算单位页面
          this.$router.push({
            name: "budgetPortrait",
          });
        }
      }
    },
  },
};
</script>
<style lang="less">
.left-tree-container {
  width: 320px;
  padding: 20px;
  overflow-x: hidden;
  overflow-y: auto;
  height: calc(100vh - 186px);
  position: fixed;

  .left-tree {
    width: 280px;
    height: 100%;
    padding: 20px;
    border-radius: 4px;
    border: 1px solid #d6dbe3;

    &-top {
      margin-bottom: 10px;
      width: 100%;
    }

    &-icon {
      width: 16px;
      height: 16px;
      display: flex;
      margin-top: 4px;
    }

    .ant-tree {
      height: calc(100% - 42px);
      overflow-y: auto;

      .ant-tree-node-content-wrapper {
        .ant-tree-title {
          display: inline-block;
          width: calc(100% - 24px);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }

  .ant-tree-node-content-wrapper {
    width: calc(100% - 24px);
  }
}
</style>
