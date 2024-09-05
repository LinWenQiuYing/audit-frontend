<template>
  <a-layout-sider
    class="pierce-layout-content-left"
    :collapsed="collapsed"
    :trigger="null"
    collapsible
    width="220"
    :collapse="(collapsed) => handleCollapsedChange(collapsed)"
    collapsedWidth="60"
  >
    <a-menu
      theme="dark"
      mode="inline"
      :default-selected-keys="['1']"
      :inline-collapsed="collapsed"
      :selectedKeys="selectedKeys"
      :open-keys="openKeys"
      @openChange="handleOpenChange"
      :inlineIndent="60"
    >
      <a-sub-menu key="7">
        <span slot="title">
          <div class="menu-icon">
            <icon-svg icon-class="房地产" />
          </div>
          <span class="menu-text">企业数据画像</span>
        </span>
        <a-menu-item
          key="7.1"
          @click="handleChangeLink('audit-mode/business-portraits', '7.1')"
        >
          <span class="menu-text">企业画像</span>
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="5">
        <span slot="title">
          <div class="menu-icon">
            <icon-svg icon-class="关联" />
          </div>
          <span class="menu-text">规则管理</span>
        </span>
        <a-menu-item
          key="5.1"
          @click="handleChangeLink('config-manage/rules', '5.1')"
        >
          <span class="menu-text">规则定义</span>
        </a-menu-item>
        <!-- <a-menu-item
          key="5.2"
          @click="handleChangeLink('config-manage/models', '5.2')"
        >
          <span class="menu-text">模型管理</span>
        </a-menu-item> -->
        <a-menu-item
          key="5.5"
          @click="handleChangeLink('config-manage/conditions', '5.5')"
        >
          <span class="menu-text">条件定义</span>
        </a-menu-item>
      </a-sub-menu>
      <a-menu-item key="2" @click="handleChangeLink('block-analysis', '2')">
        <div class="menu-icon">
          <icon-svg icon-class="block-analysis" />
        </div>
        <span class="menu-text">板块分析</span>
      </a-menu-item>
      <a-menu-item key="4" @click="handleChangeLink('asserts-analysis', '4')">
        <div class="menu-icon">
          <icon-svg icon-class="asserts-analysis" />
        </div>
        <span class="menu-text">资产分析</span>
      </a-menu-item>
      <a-menu-item
        key="13"
        @click="handleChangeLink('financial-analysis', '13')"
      >
        <div class="menu-icon">
          <icon-svg icon-class="financial-analysis" />
        </div>
        <span class="menu-text">财务分析</span>
      </a-menu-item>
      <a-menu-item key="6" @click="handleChangeLink('manage-portrait', '6')">
        <div class="menu-icon">
          <icon-svg icon-class="manage-portrait" />
        </div>
        <span class="menu-text">主管单位画像</span>
      </a-menu-item>
      <a-menu-item key="14" @click="handleChangeLink('budget-portrait', '14')">
        <div class="menu-icon">
          <icon-svg icon-class="budget-portrait" />
        </div>
        <span class="menu-text">预算单位画像</span>
      </a-menu-item>
      <a-menu-item key="8" @click="handleChangeLink('structure-analysis', '8')">
        <div class="menu-icon">
          <icon-svg icon-class="structure-analysis" />
        </div>
        <span class="menu-text">组织架构分析</span>
      </a-menu-item>
      <a-menu-item key="9" @click="handleChangeLink('blueprint', '9')">
        <div class="menu-icon">
          <icon-svg icon-class="blueprint-manage" />
        </div>
        <span class="menu-text">蓝图定义</span>
      </a-menu-item>
      <a-menu-item key="10" @click="handleChangeLink('graph', '10')">
        <div class="menu-icon">
          <icon-svg icon-class="graph-manage" />
        </div>
        <span class="menu-text">图谱管理</span>
      </a-menu-item>
      <a-menu-item key="11" @click="handleChangeLink('template', '11')">
        <div class="menu-icon">
          <icon-svg icon-class="template-manage" />
        </div>
        <span class="menu-text">模板管理</span>
      </a-menu-item>
      <a-menu-item key="12" @click="handleChangeLink('model', '12')">
        <div class="menu-icon">
          <icon-svg icon-class="graph-models" />
        </div>
        <span class="menu-text">模型管理</span>
      </a-menu-item>
      <a-menu-item key="15" @click="handleChangeLink('schedule', '15')">
        <div class="menu-icon">
          <icon-svg icon-class="schedule-manage" />
        </div>
        <span class="menu-text">调度管理</span>
      </a-menu-item>
      <a-menu-item key="3" @click="handleChangeLink('risk-warning', '3')">
        <div class="menu-icon">
          <icon-svg icon-class="发送" />
        </div>
        <span class="menu-text">风险线索</span>
      </a-menu-item>
      <a-menu-item key="16" @click="handleChangeLink('risk-permission', '16')">
        <div class="menu-icon">
          <icon-svg icon-class="风险授权" />
        </div>
        <span class="menu-text">风险授权</span>
      </a-menu-item>
    </a-menu>
    <div class="menu-footer">
      <a-icon
        class="footer-trigger"
        :type="collapsed ? 'menu-unfold' : 'menu-fold'"
        @click="() => handleCollapsedChange(!collapsed)"
      />
    </div>
  </a-layout-sider>
</template>
<script>
import { Icon, Layout, Menu } from "ant-design-vue";

const { Sider } = Layout;
const { Item, SubMenu } = Menu;

export default {
  name: "LayoutSider",
  props: ["collapsed", "selectedKeys", "openKeys"],
  data() {
    return {};
  },
  components: {
    AIcon: Icon,
    ALayoutSider: Sider,
    AMenu: Menu,
    AMenuItem: Item,
    ASubMenu: SubMenu,
  },
  methods: {
    handleChangeLink(url, key) {
      this.$emit("handleChangeLink", url, key);
    },
    handleCollapsedChange(collapsed) {
      this.$emit("handleCollapsedChange", collapsed);
    },
    handleOpenChange(openKeys) {
      this.$emit("handleOpenChange", openKeys);
    },
  },
};
</script>
<style lang="less">
// 悬浮菜单栏样式
.ant-menu-inline-collapsed-tooltip {
  .ant-tooltip-content {
    .ant-tooltip-inner {
      .menu-icon {
        display: inline-block;
        margin-right: 5px;
        width: 16px;
        height: 16px;
      }
    }
  }
}

.pierce-layout-content-left {
  z-index: 10;
  background: #fff;
  color: @fontColor2;
  box-shadow: 6px 0px 16px -8px rgba(0, 0, 0, 0.08);

  .ant-menu {
    margin: 0 4px;
    overflow-y: auto;
    width: calc(100% - 8px);
    box-shadow: none !important;
    background: #fff !important;
    max-height: calc(100% - 52px);

    .ant-menu-item {
      color: @leftMenuColor;
      font-weight: 600;
      padding-left: 40px !important;
      transition: color 0.1s;

      &:hover {
        background-color: @leftMenuBackgroundColor;
        color: @activeFontColor !important;
      }

      &.ant-menu-item-selected {
        background-color: @leftMenuBackgroundColor;
        color: @activeFontColor !important;
      }

      .menu-icon {
        display: inline-block;
        margin-right: 10px;
        width: 16px;
        height: 16px;
      }
    }
    .ant-menu-submenu {
      color: @leftMenuColor;
      font-weight: 600;
      transition: color 0.1s;

      .ant-menu-submenu-active:hover {
        background-color: @leftMenuBackgroundColor;
      }

      &.ant-menu-submenu-selected {
        color: @activeFontColor !important;

        .ant-menu-submenu-title {
          &:hover {
            color: @activeFontColor;
          }
        }
      }

      .ant-menu-submenu-title {
        padding-left: 40px !important;

        &:hover {
          color: @leftMenuColor;
        }

        .menu-icon {
          display: inline-block;
          margin-right: 10px;
          width: 16px;
          height: 16px;
        }

        .ant-menu-submenu-arrow::before,
        .ant-menu-submenu-arrow::after {
          background: @leftMenuColor;
        }
      }

      .ant-menu-sub {
        .ant-menu-item {
          color: @leftMenuColor;
          padding-left: 73px !important;
        }
      }
    }
  }

  .ant-menu-inline-collapsed {
    width: 56px;

    .ant-menu-item {
      color: @leftMenuColor;
      padding: 0 16px !important;

      .menu-text {
        max-width: 0;
        opacity: 0;
        display: inline-block;
      }
    }
    .ant-menu-submenu {
      color: @leftMenuColor;

      .ant-menu-submenu-title {
        padding: 0 16px !important;

        &:hover {
          color: @leftMenuColor !important;
        }

        .menu-text {
          max-width: 0;
          opacity: 0;
          display: inline-block;
        }
      }
    }
  }

  .menu-footer {
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    position: absolute;
    align-items: center;
    padding: 16px 21px;
    justify-content: flex-end;

    .footer-left {
      height: 20px;
      display: flex;

      &-img {
        width: 20px;
        height: 100%;
      }

      .footer-text {
        color: #1d2129;
        padding-left: 16px;
      }
    }

    .footer-trigger {
      color: #fff;
      font-size: 18px;
      cursor: pointer;
      transition: color 0.3s;

      &.anticon-menu-fold,
      &.anticon-menu-unfold {
        color: #1d2129;
      }

      &:hover {
        color: @activeFontColor;
      }
    }
  }
}
</style>
