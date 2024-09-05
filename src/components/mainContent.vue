<template>
  <div class="main-content">
    <div class="main-content-header">
      <div class="header-content">
        <div class="header-content-left">
          <span class="header-title" v-if="title">{{ title }}</span>
          <slot name="title" v-else />
          <span class="header-sub-title" v-show="subTitle">{{ subTitle }}</span>
          <span class="header-title-child-route">
            <slot name="titleChildRoute" />
          </span>
        </div>
        <div class="header-content-right">
          <span class="header-current-title" v-if="curTreeItem"
            >当前单位：<span class="header-current-title-text">{{
              curTreeItem.title
            }}</span></span
          >
          <span class="header-parent-title" v-if="curTreeItemFather"
            >主管单位：<span class="header-parent-title-text">{{
              curTreeItemFather.title
            }}</span></span
          >
        </div>
      </div>
      <div class="header-right" v-if="$slots.right">
        <slot name="right" />
      </div>
    </div>
    <div class="main-content-box">
      <slot name="content" />
    </div>
  </div>
</template>

<script>
export default {
  name: "MainContent",
  props: ["title", "subTitle", "curTreeItem", "curTreeItemFather"],
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped lang="less">
.main-content {
  width: 100%;
  height: 100%;
  padding-top: 66px;

  &-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 66px;
    padding: 22px 22px 12px 22px;
    background: url("~@/assets/images/img/header_bottom_2.png") no-repeat right;
    background-size: contain;
    -o-background-size: contain;
    -webkit-background-size: contain;
    background-color: #fff;
    z-index: 8;
    box-shadow: 0px 6px 16px -8px rgba(0, 0, 0, 0.08);
    display: flex;
    align-items: center;
    justify-content: space-between;

    .header-content {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      &-right {
        margin-top: 12px;
      }
    }

    .header-title {
      font-weight: 600;
      font-size: 20px;
      line-height: 28px;
      margin-right: 20px;
    }

    .header-sub-title {
      font-size: 14px;
      line-height: 22px;
      color: @secondaryTextColor;
    }

    .header-current-title,
    .header-parent-title {
      font-size: 14px;
      line-height: 22px;
      margin-right: 20px;
      color: #3c485c;

      &-text {
        color: #1776ff;
      }
    }

    .header-right {
      width: 320px;
      display: flex;
      justify-content: flex-end;

      .ant-select {
        width: 120px;
      }
    }
  }

  &-box {
    width: 100%;
    height: 100%;
    overflow: auto;
    position: relative;
  }
}
</style>
