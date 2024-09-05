<template>
  <div class="right-menu">
    <a-menu
      v-if="show"
      class="context-menu"
      @click="onMenuClick"
      :style="{
        top: contextMenuData.position.y + 'px',
        left: contextMenuData.position.x + 'px',
      }"
    >
      <a-menu-item v-for="item in contextMenuData.context" :key="item.key">
        {{ item.title }}
      </a-menu-item>
    </a-menu>
  </div>
</template>
<script>
import { Menu } from "ant-design-vue";

const { Item } = Menu;

export default {
  name: "RightMenu",
  props: {
    contextMenuData: Object, // 记录菜单的位置与内容
    show: Boolean, // 记录菜单是否展示
  },
  data() {
    return {};
  },
  components: {
    AMenu: Menu,
    AMenuItem: Item,
  },
  methods: {
    onMenuClick(key) {
      this.$emit("onMenuClick", key);
    },
  },
};
</script>
<style lang="less">
.right-menu {
  .context-menu {
    position: fixed;
    min-width: 170px;
    max-width: 400px;
    box-shadow: 0 2px 8px @borderColor;
    color: #485378;
    background-color: #fff;
    border-radius: 2px;

    .ant-menu-vertical {
      padding: 10px 0;
      color: #485378;

      .ant-menu-item,
      .ant-menu-submenu {
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        margin: 0;

        &-title {
          height: 30px;
          line-height: 30px;
        }

        &:hover,
        &-title:hover {
          background-color: #e5f3ff;
          color: #485378;
        }
      }

      .with-description {
        height: 50px;

        .menu-item-description {
          color: #afb0b3;
        }
      }

      .item-divider {
        display: flex;
        align-items: center;
        padding: 0;
        height: 15px;
        line-height: 15px;

        &:hover {
          cursor: auto;
        }
      }

      .horizontal-separator-line {
        height: 1px;
        margin: 12px 0;
        padding: 0;
        width: 100%;
        background-color: #e8edf9;
      }
    }

    .ant-menu-submenu {
      .ant-menu-sub {
        padding: 10px 7px;
      }

      .ant-menu-item {
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        margin: 0;

        &:hover {
          background-color: #e5f3ff;
          color: #485378;
        }
      }

      .with-description {
        height: 50px;

        .menu-item-description {
          color: #afb0b3;
        }
      }
    }
  }
}
</style>
