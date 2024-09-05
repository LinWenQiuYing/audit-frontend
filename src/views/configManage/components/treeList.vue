<template>
  <div :class="[listClass, 'tree-list']">
    <div class="tree-list-title">
      <span class="tree-list-title-text" v-show="treeTitle">{{
        treeTitle
      }}</span>
      <!-- <div class="tree-list-title-icon">
        <a-icon type="plus-square" class="plus" @click="addList('0-0')" />
      </div> -->
    </div>
    <div class="tree-list-content">
      <!-- <div class="tree-list-search">
        <a-input
          placeholder="请输入"
          v-model.trim="searchValue"
          allow-clear
          @pressEnter="onSearch"
        >
          <a-icon slot="addonAfter" type="search" @click="onSearch" />
        </a-input>
      </div> -->

      <a-tree
        show-icon
        :defaultExpandedKeys="['0-0']"
        @select="onSelect"
        :tree-data="list"
        :icon="getIcon"
        :selectedKeys="selectedKeys"
        blockNode
        v-show="!loading"
      >
        <template slot="folder" slot-scope="item">
          <div v-if="item.isEdit" class="tree-view-item">
            <a-input
              ref="new"
              type="text"
              class="tree-view-left"
              v-model.trim="newItem"
              @pressEnter="addConfirm(item)"
            />
            <div class="tree-view-right">
              <a-icon type="close-circle" @click.stop="addCancel(item)" />
              <a-icon type="check-circle" @click.stop="addConfirm(item)" />
            </div>
          </div>
          <div v-else class="tree-view-item">
            <span class="tree-view-left" :title="item.title">{{
              item.title
            }}</span>
            <div class="tree-view-right">
              <!-- <a-icon
                type="edit"
                v-if="item.key !== '0-0'"
                class="btn"
                @click.stop="editList(item)"
              /> -->
              <a-icon
                type="plus-square"
                class="btn"
                @click.stop="addList(item.key)"
              />
              <a-icon
                type="delete"
                v-if="item.key !== '0-0'"
                class="btn"
                @click.stop="deleteList(item)"
              />
            </div>
          </div>
        </template>
        <template slot="leaf" slot-scope="item">
          <span v-if="item.isEdit" class="tree-view-item">
            <a-input
              ref="new"
              type="text"
              class="tree-view-left"
              v-model.trim="newItem"
              @pressEnter="addConfirm(item)"
            />
            <div class="tree-view-right">
              <a-icon type="close-circle" @click.stop="addCancel(item)" />
              <a-icon type="check-circle" @click.stop="addConfirm(item)" />
            </div>
          </span>
          <div v-else class="tree-view-item">
            <span class="tree-view-left" :title="item.title">{{
              item.title
            }}</span>
            <div class="tree-view-right">
              <!-- <a-icon type="edit" class="btn" @click.stop="editList(item)" />
              <a-icon
                type="plus-square"
                class="btn"
                @click.stop="addList(item.key)"
              /> -->
              <a-icon
                type="delete"
                class="btn"
                @click.stop="deleteList(item)"
              />
            </div>
          </div>
        </template>
      </a-tree>
      <div class="tree-list-content-loading" v-show="loading">
        <a-spin :spinning="loading" />
      </div>
    </div>
    <a-modal
      title="添加文件夹"
      :visible="showFolder"
      @ok="okFolder"
      @cancel="cancelFolder"
      okText="确定"
      cancelText="取消"
      centered
      :width="450"
    >
      <a-input
        placeholder="请输入需要添加的文件夹名称"
        v-model.trim="folderName"
      />
    </a-modal>
    <a-modal
      title="添加分类"
      :visible="showList"
      @ok="okLeaf"
      @cancel="cancelList"
      okText="确定"
      cancelText="取消"
      centered
      class="add-sub-menu"
      :width="450"
    >
      <div>
        <!-- <a-select
          v-model="defaultKey"
          class="select-file"
          :options="optionFileName"
        >
        </a-select> -->
        <a-input
          placeholder="请输入需要添加的分类名称"
          v-model.trim="listName"
          class="input-file"
        />
      </div>
    </a-modal>
  </div>
</template>
<script>
import {
  deleteWarningCategory,
  addListCategory,
  getCategoryList,
  searchCategory,
  updateListCategory,
} from "@/shared/api/configManage.js";
import { Icon, Input, Spin, Tree } from "ant-design-vue";
import { treeToList, modalConfirm } from "@/utils/common.js";
import { debounce } from "lodash";

export default {
  name: "TreeList",
  props: {
    // 当前组件的类名
    listClass: {
      type: String,
      default: () => "",
    },
    // 树状列表上方标题
    treeTitle: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      newItem: "", // 编辑节点的值
      searchValue: "",
      showList: false,
      showFolder: false,
      folderName: undefined,
      listName: undefined,
      defaultKey: "",
      optionFileName: [{ title: "全部", key: "" }],
      selectedKeys: [],
      list: [
        {
          title: "全部",
          key: "0-0",
          isLeaf: false,
          scopedSlots: { title: "folder" },
          children: [
            // {
            //   title: "模型分类",
            //   key: "0-0-0",
            //   children: [],
            //   isLeaf: true,
            //   scopedSlots: { title: "leaf" },
            // },
          ],
        },
      ],
      expandedKeys: [],
      loading: false,
      categoryAllOptions: [
        {
          value: "",
          label: "全部",
        },
      ],
      categoryOptions: [],
    };
  },
  components: {
    AIcon: Icon,
    ATree: Tree,
    AInput: Input,
    ASpin: Spin,
  },
  mounted() {
    this.getCategoryList();
  },
  methods: {
    onSelect: debounce(function (selectedKeys, e) {
      console.log("🚀 ~ onSelect:", selectedKeys, e);
      if (!e.node.isLeaf) {
        e.node.onExpand();
      } else {
        this.selectedKeys = selectedKeys;
        this.$emit("selectedKeyChange", selectedKeys[0]);
      }
    }, 300),
    deleteList(item) {
      const _that = this;
      const title = `确定要删除 ${item.title} 吗？`;
      const onOk = async () => {
        const json = {
          id: item.key,
        };
        const data = await deleteWarningCategory(json);
        if (data.message === "成功") {
          _that.$message.success("删除成功");
          _that.getCategoryList();
        } else {
          _that.$message.error(`删除失败，${data.message}`);
        }
      };
      modalConfirm(title, _that, onOk);
    },
    async okFolder() {
      if (this.folderName) {
        this.showFolder = false;
        const json = {
          categoryName: this.folderName,
          parentId: -1,
          categoryType: 2,
        };
        const data = await addListCategory(json);
        if (data.message === "成功") {
          this.$message.success("添加成功");
          this.getCategoryList();
        } else {
          this.$message.info(`添加失败 ${data.message}`);
        }
      } else {
        this.$message.warning("文件夹名字不可为空！");
        this.folderName = undefined;
      }
    },
    async okLeaf() {
      if (this.listName !== "") {
        const json = {
          categoryName: this.listName,
          parentId: this.defaultKey === "" ? -1 : this.defaultKey,
          status: 0,
          categoryType: 2,
        };

        const data = await addListCategory(json);
        if (data.message === "成功") {
          this.$message.success("添加成功");
          this.getCategoryList();
        } else {
          this.$message.info(`添加失败 ${data.message}`);
        }
        this.cancelList();
      }
    },
    async getCategoryList() {
      const listData = await getCategoryList(2);
      const categoryOptions = [];
      if (listData && listData.length) {
        const nowList = [
          {
            value: "",
            label: "全部",
          },
        ];
        const list = listData.map((item) => {
          if (item.diff === 0) {
            // diff:区分分类和文件夹，0：文件夹，1：分类
            nowList.push({
              label: item.categoryName,
              value: item.id,
            });
          } else {
            categoryOptions.push({
              value: item.id,
              label: item.categoryName,
            });
          }
          const children = item.children.map((ele) => {
            categoryOptions.push({
              value: ele.id,
              label: ele.categoryName,
            });
            return {
              key: ele.id,
              isLeaf: true,
              title: ele.categoryName,
              scopedSlots: { title: "leaf" },
            };
          });
          return {
            key: item.id,
            isLeaf: item.diff === 0 ? false : true,
            title: item.categoryName,
            children,
            scopedSlots: { title: item.diff === 0 ? "folder" : "leaf" },
          };
        });
        this.categoryAllOptions = [
          {
            value: "",
            label: "全部",
          },
          ...categoryOptions,
        ];
        this.$emit("getCategoryAllOptions", this.categoryAllOptions);
        this.optionFileName = nowList;
        this.list[0].children = list;
        console.log("🚀 ~ getCategoryList ~ list:", list);
        this.categoryOptions = categoryOptions;
        this.$emit("getCategoryOptions", this.categoryOptions);
      } else if (listData && !listData.length) {
        this.list[0].children = [];
        this.$message.info("暂无分类，请先添加！");
      } else {
        this.$message.error("获取分类分类失败");
      }
    },
    cancelFolder() {
      this.showFolder = false;
    },
    cancelList() {
      this.showList = false;
      this.listName = undefined;
    },
    addList(key) {
      console.log("🚀 ~ addList ~ addList:", key);
      this.defaultKey = key === "0-0" ? "" : key;
      this.showList = true;
    },
    editList(item) {
      console.log("🚀 ~ editList ~ editList:", item);
      const children = this.list[0].children.map((child) => {
        if (child.key === item.key) {
          return { ...child, isEdit: true };
        }
        return { ...child, isEdit: false };
      });
      console.log("children", children, item);
      this.list[0].children = children;
      this.$forceUpdate();
      this.newItem = item.title;
      this.$nextTick(() => {
        console.log("this.$refs.new", this.$refs.new);
        this.$refs.new.focus();
      });
    },
    async addConfirm(item) {
      console.log("this.newItem", this.newItem);
      if (this.newItem.length === 0) {
        this.$message.info("命名不能为空！");
        return;
      }
      const json = {
        id: item.key,
        name: this.newItem.trim(),
        parentId: item.parentId,
        status: 0,
      };
      this.graphLoading = true;
      const data = await updateListCategory(json);
      if (data.message === "成功") {
        this.getListCategory();
        this.graphLoading = false;
      } else {
        this.$message.error(data.message);
      }
      this.addCancel(item);
    },
    addCancel(item) {
      // todo 暂时搁置，等需要编辑功能的时候补上
      this.list[0].children = this.list[0].children.map((child) => {
        return { ...child, isEdit: false };
      });
    },
    getIcon(props) {
      const { isLeaf, expanded } = props;
      if (isLeaf) {
        return <a-icon type="file" />;
      }
      return <a-icon type={expanded ? "folder-open" : "folder"} />;
    },
    onSearch: debounce(async function () {
      if (!this.searchValue) return;
      const json = {
        categoryName: this.searchValue,
        status: 0,
      };
      const { data: listData } = await searchCategory(json);
      console.log("data", listData);
      if (listData && listData.length) {
        const list = treeToList(listData);
        this.list[0].children = list;
      } else if (listData && !listData.length) {
        this.list[0].children = [];
        this.$message.info("暂无分类分类，请先添加！");
      } else {
        this.$message.error("搜索分类分类失败");
      }
    }, 800),
  },
};
</script>
<style lang="less">
.tree-list {
  width: 20%;
  margin-right: 20px;
  min-width: 260px;
  max-width: 314px;
  overflow: hidden;
  border-radius: 5px;
  position: relative;
  background: #fff;

  &-title {
    height: 32px;
    line-height: 32px;
    font-size: 20px;
    box-sizing: content-box;
    position: relative;
    font-weight: 600;
    padding-left: 5px;
    padding-bottom: 15px;
    margin-bottom: 16px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);

    &-icon {
      z-index: 10;
      display: flex;
      align-items: center;

      .folder {
        margin-left: 10px;
        color: @activeFontColor;
        font-size: 18px;
      }
      .plus {
        font-size: 16px;
        margin-top: 1px;
        color: @activeFontColor;
      }

      img {
        cursor: pointer;
      }
    }
  }

  &-search {
    margin-bottom: 10px;
  }

  &-btn {
    position: absolute;
    top: 127px;
    right: 24px;
    z-index: 10;
    cursor: pointer;
  }

  &-content {
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
    height: calc(100% - 64px);

    &-icon {
      top: 10px;
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
        font-size: 16px;
        margin-top: 1px;
        color: @activeFontColor;
      }
    }

    &-loading {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .ant-tree {
      z-index: 9;
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

      li,
      .ant-tree-treenode-switcher-open,
      .ant-tree-treenode-switcher-close {
        .ant-tree-node-content-wrapper {
          width: calc(100% - 24px);

          .ant-tree-title {
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
</style>
