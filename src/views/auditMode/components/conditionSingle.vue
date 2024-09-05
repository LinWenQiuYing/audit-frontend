<template>
  <div class="condition-rule-content-main">
    <!-- 作为条件展示 -->
    <div class="condition-single-rule" v-if="isCondition">
      <div class="condition-single-rule-item" :title="ruleList.condition.title">
        {{ ruleList.condition.title }}
      </div>
      <a-tooltip placement="top">
        <template slot="title">
          <span>删除当前条件</span>
        </template>
        <div class="delete-icon" @click="deleteRule([...value])">
          <icon-svg icon-class="icon-delete" color="#86909C" />
        </div>
      </a-tooltip>
    </div>
    <!-- 作为结果展示：是否命中与命中详情 -->
    <div
      :class="[
        'condition-result-rule',
        ruleList.condition.hitStatus ? 'hit' : '',
      ]"
      v-else
    >
      <p class="condition-name">{{ ruleList.condition.title }}</p>
      <p class="condition-content">{{ ruleList.condition.content }}</p>
      <p class="condition-detail">{{ ruleList.condition.detail }}</p>
    </div>
  </div>
</template>
<script>
import { Tooltip } from "ant-design-vue";

export default {
  name: "ConditionSingle",
  props: ["list", "value", "originList", "isCondition"],
  data() {
    return {
      ruleList: this.list,
    };
  },
  components: {
    ATooltip: Tooltip,
  },
  mounted() {},
  watch: {
    list() {
      this.ruleList = this.list;
    },
  },
  methods: {
    deleteRule(key) {
      this.$emit("deleteRule", key);
    },
  },
};
</script>
<style lang="less">
.condition-rule-content-main {
  position: relative;

  .condition-single-rule {
    height: 32px;
    padding: 4px;
    display: flex;
    align-items: center;
    background: #f2f3f5;

    &-item {
      height: 24px;
      padding: 0 12px;
      min-width: 200px;
      max-width: 300px;
      line-height: 24px;
      position: relative;
      background: #fff;
      border-radius: 2px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .delete-icon {
      width: 18px;
      height: 18px;
      cursor: pointer;
      line-height: 16px;
      margin: 0 2px 0 6px;
    }
  }

  .condition-result-rule {
    height: 108px;
    background-color: @backgroundColor;
    text-align: center;
    padding: 14px 36px;
    line-height: 20px;
    min-width: 180px;
    overflow: auto;

    &.hit {
      background-color: rgba(255, 217, 221, 0.25);
      background-image: url("~@/assets/images/img/hited.svg");
      background-repeat: no-repeat;
      background-position: calc(100% - 10px) 10px;
      background-size: 40px 40px;
      -webkit-background-size: 40px 40px;
      -o-background-size: 40px 40px;

      .condition-name,
      .condition-detail {
        color: @red;
        word-break: break-word;
      }
    }

    .condition-name {
      color: @primaryTextColor;
      font-weight: 600;
    }

    .condition-detail {
      color: @primaryTextColor;
    }

    .condition-content {
      word-break: break-word;
      color: @secondaryTextColor;
    }
  }
}
</style>
