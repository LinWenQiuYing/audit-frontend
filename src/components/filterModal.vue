<!-- 筛选弹框 -->
<template>
  <a-modal
    class="filter-modal"
    :title="filterTitle"
    :width="792"
    :visible="filterShow"
    :closable="false"
    :destroyOnClose="true"
    @cancel="filterCancel"
    @ok="filterConfirm"
    :mask="false"
    centered
  >
    <div class="filter-modal-content">
      <!-- <div class="filter-modal-content-action">
        <div class="action-btn action-delete" @click="filterTrashBtn">
          <div class="action-btn-icon">
            <icon-svg icon-class="trash" color="#1776FF"></icon-svg>
          </div>
          删除
        </div>
        <div class="action-add">
          <a-select
            v-model="newParams"
            class="item-select-one"
            @change="handleParamsChange"
          >
            <a-select-option
              v-for="item in paramsOption"
              :value="item.label"
              :key="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>

          <a-select v-model="condition" class="item-select-two">
            <a-select-option
              v-for="item in conditionOption"
              :value="item.value"
              :key="item.value"
              :disabled="item.isDisabled"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
          <a-input
            type="text"
            placeholder="参数"
            class="item-input-long"
            v-model="newParamsVal"
          />
          <div class="action-btn" @click="filterAddBtn">
            <div class="action-btn-icon">
              <icon-svg icon-class="add-square" color="#1776FF"></icon-svg>
            </div>
            新增
          </div>
        </div>
      </div> -->
      <!-- :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }" -->

      <a-button type="primary" icon="delete" @click.prevent="delAll()"
        >全部删除</a-button
      >
      <a-table
        bordered
        :columns="columns"
        :data-source="tableData"
        :pagination="false"
        :rowKey="(record) => record.id"
        :scroll="{ x: 'max-content', y: 250 }"
        class="filter-modal-content-table"
      >
        <!-- :scroll="{ x: 1200, y: 590 }" -->
        <!-- :scroll="{ x: 'max-content', y: 'calc(100vh - 318px)' }" -->
        <div slot="action" class="action" slot-scope="text, record">
          <div
            class="action-btn-icon"
            @click.prevent="filterTrashBtn(record.id)"
          >
            <icon-svg icon-class="trash" color="#1776FF"></icon-svg>
          </div>
        </div>
      </a-table>
      <div class="action-add">
        <a-select
          v-model="newParams"
          class="item-select-one"
          @change="handleParamsChange"
        >
          <a-select-option
            v-for="item in paramsOption"
            :value="item.label"
            :key="item.value"
          >
            {{ item.label }}
          </a-select-option>
        </a-select>

        <a-select v-model="condition" class="item-select-two">
          <a-select-option
            v-for="item in conditionOption"
            :value="item.value"
            :key="item.value"
            :disabled="item.isDisabled"
          >
            {{ item.label }}
          </a-select-option>
        </a-select>
        <a-input
          type="text"
          placeholder="参数"
          class="item-input-long"
          v-model="newParamsVal"
        />
        <div class="action-btn" @click="filterAddBtn">
          <div class="action-btn-icon">
            <icon-svg icon-class="add-square" color="#1776FF"></icon-svg>
          </div>
          <!-- 新增 -->
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { Button, Input, Select } from "ant-design-vue";
import { nanoid } from "nanoid";
const SelectOption = Select.Option;

export default {
  name: "FilterModal",
  components: {
    AInput: Input,
    ASelect: Select,
    AButton: Button,
    ASelectOption: SelectOption,
  },
  props: {
    filterTitle: {
      type: String,
      default: "",
    },
    filterShow: {
      type: Boolean,
      default: false,
    },

    paramsOption: {
      type: Array,
      default: () => [],
    },

    // tableLoading3: {
    //   type: Boolean,
    //   default: false,
    // },
    tableData: {
      type: Array,
      default: () => [],
    },
  },
  // watch: {

  // },
  data() {
    return {
      newParams: null,
      condition: null,
      conditionOption: [],
      conditionOptionString: [
        {
          value: "等于",
          label: "等于",
        },
        {
          value: "不等于",
          label: "不等于",
        },
        {
          value: "大于",
          label: "大于",
        },
        {
          value: "大于等于",
          label: "大于等于",
        },
        {
          value: "小于",
          label: "小于",
        },
        {
          value: "小于等于",
          label: "小于等于",
        },
        {
          value: "包含",
          label: "包含",
        },
        {
          value: "不包含",
          label: "不包含",
        },
      ],
      conditionOptionNumber: [
        {
          value: "等于",
          label: "等于",
        },
        {
          value: "不等于",
          label: "不等于",
        },
        {
          value: "大于",
          label: "大于",
        },
        {
          value: "大于等于",
          label: "大于等于",
        },
        {
          value: "小于",
          label: "小于",
        },
        {
          value: "小于等于",
          label: "小于等于",
        },
      ],
      newParamsVal: "",
      columns: [
        {
          title: "字段",
          dataIndex: "name",
          key: "name",
          width: 250,
        },
        {
          title: "比较",
          dataIndex: "compare",
          key: "compare",
          width: 190,
        },
        {
          title: "值",
          dataIndex: "value",
          key: "value",
          width: 224,
        },
        {
          title: "操作",
          dataIndex: "action",
          key: "action",
          width: 72,
          scopedSlots: { customRender: "action" },
        },
      ],
      // selectedRowKeys: [],
      // selectedRowKeysCopy: [],
    };
  },
  computed: {
    isfilterShow: {
      get() {
        return this.filterShow;
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
  // created() {
  //   if (this.items.length > 0) {
  //     this.firstValue = this.items[0];
  //   }
  // }
  mounted() {
    if (this.paramsOption.length > 0) {
      this.newParams = this.paramsOption[0].label;
      // console.log(this.newParams, "newParams");
      // console.log(this.paramsOption, "props接受的paramsOption");
      const paramsType = this.paramsOption[0].type;
      if (paramsType === "string") {
        this.conditionOption = this.conditionOptionString;
      } else {
        this.conditionOption = this.conditionOptionNumber;
      }
      // if (paramsType === "string") {
      //   this.conditionOption.map((item) => {
      //     item.isDisabled = false;
      //   });
      // } else {
      //   this.conditionOption.map((item) => {
      //     if (item.value.indexOf("于") !== -1) {
      //       //数字类型，不给选是否包含（字符串操作）
      //       item.isDisabled = false;
      //     } else {
      //       item.isDisabled = true;
      //     }
      //   });
      // }
      this.condition = this.conditionOption[0].value;
    }
  },
  methods: {
    //筛选选项处理函数
    convertConditions(conditions) {
      return conditions
        ? conditions
            .map((condition) => {
              let { leftValue, leftType, op, rightValue } = condition;

              // Special handling for 'like' and 'not like' operators to add parentheses and quotes
              if (
                op.toLowerCase() === "like" ||
                op.toLowerCase() === "not like"
              ) {
                rightValue = `%${rightValue}%`; // add parentheses around the whole string
              }

              if (leftType === "string") {
                // Add quotes around the right value if it's a string type
                rightValue = `'${rightValue}'`;
              }

              return `${leftValue} ${op} ${rightValue}`;
            })
            .join(" and ")
        : "";
    },
    filterCancel() {
      // this.selectedRowKeys = this.selectedRowKeysCopy;
      this.$emit("onFilterCancel");
    },
    filterConfirm() {
      // this.selectedRowKeysCopy = this.selectedRowKeys;
      let filterConfirmArr = [];
      // console.log("主管单位筛选确定之后勾选的ID", this.selectedRowKeys);
      let relation = {
        不等于: "!=",
        等于: "=",
        大于: ">",
        大于等于: ">=",
        小于: "<",
        小于等于: "<=",
        包含: "like",
        不包含: "not like",
      };

      for (let i = 0; i < this.tableData.length; i++) {
        let obj = {};
        console.log("子组件里的this.tableData", this.tableData);
        //映射
        // obj.id = this.tableData3[i].id;
        obj.leftValue = this.paramsOption.find(
          (option) => option.label === this.tableData[i].name
        ).value;
        obj.rightValue = this.tableData[i].value;
        obj.leftType = this.paramsOption.find(
          (option) => option.label === this.tableData[i].name
        ).type;
        obj.op = relation[this.tableData[i].compare];
        filterConfirmArr.push(obj);
      }

      let filterCondition = this.convertConditions(filterConfirmArr);
      // console.log("子组件里的确认勾选数组", this.selectedRowKeys);
      this.$emit("onFilterConfirm", filterCondition);
    },

    //选项1改变，引起中间选项改变
    handleParamsChange(value) {
      console.log("选项1改变时的value", value);
      let paramsType = "";
      this.paramsOption.map((item) => {
        if (item.label === value) {
          paramsType = item.type;
        }
      });
      // for(let i = 0;i<this.paramsOption.length;i++){
      //   if (item.label === value) return item.type;
      // }
      // console.log("选项1改变匹配的paramsType", paramsType);
      if (paramsType === "string") {
        this.conditionOption = this.conditionOptionString;
      } else {
        this.conditionOption = this.conditionOptionNumber;
      }
      // console.log("此时的conditionOption", this.conditionOption);
      //给默认值赋为当前可选选项的第一个
      const foundItem = this.conditionOption.find(
        (item) => item.isDisabled === false
      );
      this.condition = foundItem.value;
    },

    //新增筛选条件
    filterAddBtn() {
      //这里父组件差一个接口，新增表格数据
      // this.$emit("getManageFilterOptions");
      const json = {
        id: nanoid(),
        name: this.newParams,
        compare: this.condition,
        value: this.newParamsVal,
      };
      // console.log("当前表格数据", json);
      this.$emit("addTable3", json);
      // console.log("点击了筛选的新增按钮", json);
    },

    //删除筛选条件
    filterTrashBtn(id) {
      console.log("当前表格数据", this.tableData);
      // console.log("id", id);
      //原始版本，有左侧选择框
      // let arr = this.tableData.filter(
      //   (item) => this.selectedRowKeys.indexOf(item.id) == -1
      // );
      //新版本
      let arr = this.tableData.filter((item) => id !== item.id);
      // console.log("2323232", arr);

      this.$emit("delTable3", arr);
      console.log("点击了筛选的删除按钮");
    },

    //删除所有筛选条件
    delAll() {
      this.$emit("delTable3", []);
    },

    // onSelectChange(selectedRowKeys) {
    //   this.selectedRowKeys = selectedRowKeys;
    // },
  },
};
</script>

<style lang="less">
//筛选弹框
.filter-modal {
  &-content {
    width: 100%;
    // display: flex;

    .action-btn-icon {
      width: 16px;
      height: 16px;
      display: flex;
      margin-right: 4px;
      cursor: pointer;
    }

    .action-add {
      display: flex;
      flex: 1;
      // justify-content: space-between;
      align-items: center;
      margin-top: 10px;

      .item-select-one {
        width: 240px;
        margin-right: 10px;
      }

      .item-select-two {
        width: 180px;
        margin-right: 10px;
      }

      .item-input-long {
        width: 225px;
        margin-right: 10px;
      }

      .action-btn {
        margin-left: 13px;
      }
    }

    &-table {
      margin-top: 16px;
    }

    // &-action {
    //   display: flex;
    //   margin-bottom: 20px;
    //   .action-btn {
    //     display: flex;
    //     align-items: center;
    //     margin-right: 20px;
    //     color: #1776ff;
    //     cursor: pointer;

    //     &-icon {
    //       width: 16px;
    //       height: 16px;
    //       display: flex;
    //       margin-right: 4px;
    //     }
    //   }

    //   .action-delete {
    //     margin-right: 16px;
    //   }

    //   .action-add {
    //     display: flex;
    //     flex: 1;
    //     // justify-content: space-between;
    //     align-items: center;

    //     .item-input-long,
    //     .item-select-one {
    //       width: 250px;
    //     }

    //     .item-select-two {
    //       width: 225px;
    //     }
    //   }
    // }
  }
}
</style>
