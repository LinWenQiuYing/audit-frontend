<template>
  <div
    ref="main"
    :class="[
      'condition-rules-content-main',
      {
        'no-before': ruleList.length < 3,
        'no-after':
          !Array.isArray(ruleList.slice(-1)[0]) ||
          ruleList.slice(-1)[0].length < 2,
      },
    ]"
    :style="{
      '--mainTop': isCondition ? 21 + 'px' : 59 + 'px',
    }"
  >
    <div v-for="(item, index) in ruleList" :key="item.id" class="rules-content">
      <div
        :class="
          ruleList.length < 3
            ? 'rules-content-header no-before'
            : 'rules-content-header'
        "
        v-if="Array.isArray(item) && isCondition"
      >
        <a-icon type="folder" />
        <span class="header-tips">
          条件组
          <a-icon
            :type="ruleList[index].length > 1 ? 'caret-up' : 'caret-down'"
          />
        </span>
        <!-- <a-tooltip placement="top">
          <template slot="title">
            <span>添加条件</span>
          </template>
          <a-icon
            type="plus-square"
            @click="selectCondition('config', 'single', [...value, index])"
          />
        </a-tooltip> -->
        <!-- <a-tooltip placement="top">
          <template slot="title">
            <span>添加条件组</span>
          </template>
          <a-icon
            type="folder-add"
            @click="selectCondition('config', 'multi', [...value, index])"
          />
        </a-tooltip> -->
        <a-tooltip placement="top">
          <template slot="title">
            <span>删除当前条件组</span>
          </template>
          <div class="delete-icon" @click="deleteRule([...value, index])">
            <icon-svg icon-class="icon-delete" color="#016eff" />
          </div>
        </a-tooltip>
      </div>
      <condition-group
        v-if="Array.isArray(item)"
        :list="ruleList[index]"
        :originList="originList"
        :value="[...value, index]"
        :floor="floor + 1"
        :isCondition="isCondition"
      />
      <!-- @selectCondition="selectCondition" -->
      <div
        v-else-if="item.types === 'single'"
        :class="ruleList.length < 3 ? 'rules-single no-before' : 'rules-single'"
      >
        <condition-single
          :list="ruleList[index]"
          :originList="originList"
          :value="[...value, index]"
          @deleteRule="deleteRule"
          :isCondition="isCondition"
        />
      </div>
      <div
        v-else
        :class="floor === 0 ? 'and-or first' : 'and-or'"
        :style="{
          display: ruleList.length > 2 ? 'block' : 'none',
          cursor: isCondition ? 'pointer' : 'not-allowed',
        }"
        @click="onRelationChange([...value, index])"
      >
        {{ ruleList[index].relations }}
      </div>
    </div>
  </div>
</template>
<script>
import ConditionSingle from "./conditionSingle";
import { Icon, Tooltip } from "ant-design-vue";

export default {
  name: "ConditionGroup",
  props: ["list", "originList", "value", "floor", "isCondition"],
  data() {
    return {
      ruleList: this.list,
    };
  },
  mounted() {
    console.log("mounted-ConditionGroup", this.list);
  },
  watch: {
    list() {
      this.ruleList = this.list;
    },
  },
  components: {
    AIcon: Icon,
    ATooltip: Tooltip,
    ConditionSingle,
  },
  methods: {
    // selectCondition(type, isSingle, key) {
    //   this.$emit("selectCondition", type, isSingle, key);
    // },
    deleteRule(key) {
      let parentArr = this.originList;
      if (key.length > 1) {
        key.map((num, index) => {
          if (index < key.length - 2) {
            parentArr = parentArr[num];
          }
        });
        if (key.slice(-1)[0] === parentArr.slice(-2)[0].length - 1) {
          // 删除条件组
          parentArr.splice(key.slice(-2)[0], 1);
        } else {
          // 删除单个条件
          parentArr[key.slice(-2)[0]].splice(key.slice(-1)[0], 1);
        }
      } else {
        parentArr.splice(key[0], 1);
      }
    },
    onRelationChange(key) {
      if (!this.isCondition) {
        return false;
      }
      let parentArr = this.originList;
      if (key.length > 1) {
        key.map((num, index) => {
          if (index < key.length - 1) {
            parentArr = parentArr[num];
          }
        });
      }
      if (parentArr[0].relations === "且") {
        parentArr[0].relations = "或";
      } else {
        parentArr[0].relations = "且";
      }
      this.ruleList = parentArr;
    },
  },
};
</script>
<style lang="less">
.condition-rules-content-main {
  padding: 0 35px;
  position: relative;

  &::before {
    left: 21px;
    top: var(--mainTop);
    content: "";
    position: absolute;
    height: calc(100% - var(--mainTop) * 2);
    border-left: 1px solid #d9d9d9;
  }

  &::after {
    left: 21px;
    top: calc(100% - var(--mainTop));
    content: "";
    position: absolute;
    width: 35px;
    height: 14px;
    border-top: 1px solid #d9d9d9;
  }

  &.no-before {
    &::before {
      height: 0;
    }
    &::after {
      width: 0;
    }
  }

  &.no-after {
    &::after {
      width: 0;
    }
  }

  .rules-single {
    display: flex;
    align-items: center;
    padding: 5px 0 5px 10px;
    position: relative;

    &::before {
      top: var(--mainTop);
      content: "";
      left: -14px;
      width: 24px;
      height: 14px;
      position: absolute;
      border-top: 1px solid #d9d9d9;
    }

    &.no-before {
      &::before {
        width: 0;
      }
    }
  }

  .rules-content-header {
    display: flex;
    padding: 5px 0 5px 10px;
    align-items: center;
    position: relative;
    height: 42px;

    &::before {
      top: var(--mainTop);
      content: "";
      left: -13px;
      width: 22px;
      height: 14px;
      position: absolute;
      border-top: 1px solid #d9d9d9;
    }

    &.no-before {
      &::before {
        width: 0;
      }
    }

    .anticon-folder {
      font-size: 18px;
      color: #949dad;
    }

    .header-tips {
      color: #949dad;
      padding: 0 10px;
      font-size: 16px;
      user-select: none;
    }

    .anticon-plus-square {
      color: @activeFontColor;
      font-size: 18px;
      padding: 0 5px;
    }

    .delete-icon {
      width: 20px;
      height: 20px;
      cursor: pointer;
      line-height: 18px;
      margin: 0 2px 0 6px;
    }

    .anticon-folder-add {
      color: @activeFontColor;
      font-size: 21px;
      padding: 0 5px;
    }
  }

  .and-or {
    top: 50%;
    width: 20px;
    z-index: 99;
    left: 12px;
    height: 20px;
    cursor: pointer;
    font-size: 10px;
    line-height: 18px;
    border-radius: 50%;
    background: #fff;
    position: absolute;
    text-align: center;
    border: 1px solid #549be7;
    transform: translateY(-50%);
    transition: all 0.1s;
    user-select: none;
  }
}
</style>
