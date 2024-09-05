<!-- 排序弹框 -->
<template>
  <a-modal
    class="sort-modal"
    :title="sortTitle"
    :width="792"
    :visible="isSortShow"
    :closable="false"
    :destroyOnClose="true"
    @cancel="sortCancel"
    @ok="sortConfirm"
    :mask="false"
    centered
  >
    <div class="sort-modal-content">
      <div class="content-select">
        <div class="content-select-left">
          <div class="content-select-left-title">所有字段</div>
          <div class="content-select-left-check">
            <a-checkbox
              :indeterminate="indeterminate"
              :checked="checkAll"
              @change="onCheckAllChangeSort"
            >
              全选
            </a-checkbox>
            <a-checkbox-group
              :options="sortOptions"
              v-model="sortValue"
              @change="onChangeSort"
              class="check-item"
            />
          </div>
        </div>
        <div class="content-select-right">
          <div class="content-select-left-title">选中字段</div>
          <div style="max-height: 370px; overflow-y: auto">
            <div
              class="content-select-right-item"
              v-for="(item, i) in dragList"
              :key="item.value"
              draggable="true"
              @dragstart="dragstart($event, i)"
              @dragenter="dragenter($event, i)"
              @dragend="dragend"
              @dragover="dragover"
            >
              <div class="item-left">
                <div class="item-left-icon">
                  <icon-svg icon-class="drag"></icon-svg>
                </div>
                {{ item.label }}
              </div>

              <div class="item-right" @click="delChoosedParams(item)">
                <icon-svg icon-class="关闭"></icon-svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="sort-modal-content-choose">
        排序方式：
        <a-select
          class="sort-modal-content-choose-btn"
          placeholder="选择排序方式"
          v-model="choosedSort"
        >
          <a-select-option
            v-for="item in sortTypeOptions"
            :key="item.key"
            :title="item.value"
            :value="item.value"
          >
            {{ item.key }}
          </a-select-option>
        </a-select>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { Checkbox, Select } from "ant-design-vue";
const { Group } = Checkbox;
export default {
  name: "SortModal",
  components: {
    ACheckboxGroup: Group,
    ACheckbox: Checkbox,
    ASelect: Select,
  },
  props: {
    sortTitle: {
      type: String,
      default: "",
    },
    sortShow: {
      type: Boolean,
      default: false,
    },
    sortOptions: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    sortValue(val) {
      console.log("val", val);
      const matchingObjects = this.sortOptions.filter((option) =>
        val.includes(option.value)
      );
      console.log("Matching objects:", matchingObjects);
      this.dragList = matchingObjects.sort((a, b) => a.rank - b.rank);
    },
  },
  data() {
    return {
      indeterminate: true,
      checkAll: false,
      checkAllCopy: false,
      //排序字段
      sortValue: [],
      sortValueCopy: [],
      //排序方式
      choosedSort: 1,
      choosedSortCopy: 1,
      sortTypeOptions: [
        {
          key: "升序",
          value: 1,
        },
        {
          key: "降序",
          value: 0,
        },
      ],

      //拖拽排序
      dragList: [],
      dragListCopy: [],
      dragIndex: 0,
      dragIndexCopy: 0,
    };
  },
  computed: {
    isSortShow: {
      get() {
        return this.sortShow;
      },
      // set(val) {
      //   this.$emit("click",val);
      // },
    },
    // iconName() {
    //   return `#icon-${this.iconClass}`;
    // },
    // svgClass() {
    //   return this.className ? this.className : "svg-icon";
    // },
    // iconColor() {
    //   if (this.color) {
    //     return this.color;
    //   } else {
    //     return "";
    //   }
    // },
  },
  mounted() {
    this.getSelected();
  },
  methods: {
    //拿到已勾选
    getSelected() {
      // console.log("mounted this.sortOptions", this.sortOptions);
      const isSelected = this.sortOptions.filter((item) => item.selected === 1);
      const isSelectedCopy = [...isSelected];
      // console.log("mountedthis.isSelected", isSelected);
      //反选勾选的选项
      this.sortValue = isSelected.map((item) => item.value);
      this.sortValueCopy = this.sortValue;
      //反选右侧选项的顺序
      this.dragList = isSelectedCopy.sort((a, b) => a.rank - b.rank);
      this.dragListCopy = this.dragList;
      // console.log("mounted的this.sortValue", this.sortValue);
      // console.log("mounted的this.dragList", this.dragList);
    },
    sortCancel() {
      this.checkAll = this.checkAllCopy;
      this.sortValue = this.sortValueCopy;
      this.dragList = this.dragListCopy;
      this.dragIndex = this.dragIndexCopy;
      this.choosedSort = this.choosedSortCopy;
      this.$emit("onSortCancel");
    },
    sortConfirm() {
      this.checkAllCopy = this.checkAll;
      this.sortValueCopy = this.sortValue;
      this.dragListCopy = this.dragList;
      // console.log("确认this.dragList", this.dragList);
      this.dragIndexCopy = this.dragIndex;
      this.choosedSortCopy = this.choosedSort;
      //入参要求的排序结构
      const arr = this.dragList.map((item) => {
        return {
          name: item.label,
          field: item.value,
          rank: item.rank,
          selected: item.selected,
        };
      });
      // console.log("入参要求的排序结构", arr);
      this.$emit("onSortConfirm", arr, this.choosedSort);
    },

    onChangeSort(sortValue) {
      this.indeterminate =
        !!sortValue.length && sortValue.length < this.sortOptions.length;
      this.checkAll = sortValue.length === this.sortOptions.length;
    },
    onCheckAllChangeSort(e) {
      Object.assign(this, {
        sortValue: e.target.checked
          ? this.sortOptions.map((item) => item.value)
          : [],
        indeterminate: false,
        checkAll: e.target.checked,
      });
    },

    //拖拽排序
    dragstart(e, index) {
      e.stopPropagation();
      this.dragIndex = index;
      setTimeout(() => {
        e.target.classList.add("moveing");
      }, 0);
    },
    dragenter(e, index) {
      e.preventDefault();
      // 拖拽到原位置时不触发
      if (this.dragIndex !== index) {
        const source = this.dragList[this.dragIndex];
        this.dragList.splice(this.dragIndex, 1);
        this.dragList.splice(index, 0, source);

        // 更新节点位置
        this.dragIndex = index;
      }
    },
    dragover(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    },
    dragend(e) {
      e.target.classList.remove("moveing");
    },
    delChoosedParams(item) {
      // const filteredOptions = this.sortOptions.filter(
      //   (option) => item.value !== option.value
      // );
      // const newDragList = filteredOptions;
      this.sortValue = this.sortValue.filter((option) => option !== item.value);
      // this.sortValueCopy = this.sortValue;
      // setTimeout(() => {
      //   this.dragList = newDragList;
      // }, 1000);
    },
    // handleClick() {
    //   this.$emit("click");
    // },
  },
};
</script>

<style lang="less">
//排序弹框
.sort-modal {
  &-content {
    width: 100%;

    .content-select {
      display: flex;

      &-left {
        flex: 1;

        &-title {
          font-size: 12px;
          color: #97a3b7;
          margin-bottom: 10px;
        }

        &-check {
          height: 370px;
          background: rgba(230, 244, 255, 0.4);
          padding: 16px 16px 8px 16px;

          .ant-checkbox-wrapper {
            margin-bottom: 8px;
          }

          .check-item {
            .ant-checkbox-wrapper {
              margin-bottom: 8px;
            }
          }
        }
      }

      &-right {
        width: 362px;
        margin-left: 20px;

        &-title {
          font-size: 12px;
          color: #97a3b7;
        }

        &-item {
          width: 300px;
          height: 28px;
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid #d6dbe3;
          color: #3c485c;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 10px;
          cursor: pointer;

          &:hover {
            border: 1px solid #1776ff;
            background: #e6f4ff;

            /* 选中阴影 */
            box-shadow: 0px 1px 4px 0px rgba(23, 118, 255, 0.26),
              0px 8px 10px 0px rgba(23, 118, 255, 0.21);
          }

          .item-left {
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #3c485c;

            &-icon {
              width: 10px;

              height: 24px;
              margin-right: 8px;
            }
          }

          .item-right {
            width: 14px;
            height: 14px;
            display: flex;
            align-items: center;
          }
        }
      }
    }

    &-choose {
      width: 300px;
      margin-top: 20px;
      display: flex;
      align-items: center;

      &-btn {
        width: 227px;
      }
    }
  }
}

.container {
  position: relative;
  padding: 0;
}

.moveing {
  opacity: 0;
}
</style>
