<template>
  <div :class="[{ 'menu-box': true }, { 'current-menu': current }]">
    <!-- 一级组件 -->
    <div
      :class="['menu', className]"
      :style="{ fontSize: fontSize + 'px' }"
      @click="goPath()"
      @mouseover="changeItem"
      @mouseout="leaveItem"
    >
      <!-- 一级图标 -->
      <div class="menu-icon mr-9" :style="{ width: fontSize + 'px' }">
        <!-- <img
          :src="require('@/assets/images/menu/' + menu.img + currentPng)"
          :style="{ width: fontSize + 'px', height: fontSize + 'px' }"
          v-if="menu.img"
          class="img-icon"
        /> -->
        <i
          :class="`iconfont icon-${menu.img}`"
          :style="{ color: defaultColor }"
        />
      </div>
      <!-- 二级+图标 -->
      <div
        class="menu-icon mr-9 sub-icon"
        :style="{ width: fontSize + 'px' }"
        v-if="index > 1 && menu.children && menu.children.length"
      >
        <i
          class="el-icon-caret-right"
          :style="{ color: defaultColor }"
          :class="{ deg90: showSub }"
        ></i>
      </div>
      <!-- 标题内容 -->
      <div
        :class="[{ 'menu-text': true }, { 'menu-text-active': current }]"
        :style="{ color: defaultColor }"
      >
        {{ menu.title }}
      </div>
    </div>
    <!-- 下级 递归 -->
    <div
      class="sub-menu-box"
      @mouseover="changeItemSub"
      @mouseleave="leaveItemSub"
    >
      <div
        class="sub-menu"
        v-if="menu.children && menu.children.length && showSub"
      >
        <centerMenuItem
          v-for="(item, ind) in menu.children"
          :key="ind"
          :index="index + 1"
          :menu="item"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "centerMenuItem",
  props: {
    index: {
      type: [String, Number],
      default: 1,
    },
    fontSize: {
      type: String,
      default: "20",
    },
    color: {
      type: String,
      default: "#ffffff",
    },
    activeColor: {
      type: String,
      default: "#ffffff",
    },
    menu: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      defaultColor: this.color,
      showSub: false,
      current: false,
    };
  },
  mounted() {
    if (this.menu.id === "01") {
      this.current = true;
    }
  },
  computed: {
    className() {
      let str = "menu-only-";
      if (this.menu.children && this.menu.children.length) {
        str = str + "children-" + this.index;
      } else {
        str += this.index;
      }
      return str;
    },
    currentPng() {
      if (this.current) {
        return "-active.png";
      } else {
        return ".png";
      }
    },
  },
  methods: {
    // 进入菜单
    changeItem() {
      this.showSub = true;
      if (!this.current) this.defaultColor = this.activeColor;
    },
    changeItemSub() {
      this.showSub = true;
    },
    // 离开菜单
    leaveItem() {
      this.showSub = false;
      if (!this.current) this.defaultColor = this.color;
    },
    leaveItemSub() {
      this.showSub = false;
    },
    goPath() {
      if (this.menu.children && this.menu.children.length) {
        this.showSub = !this.showSub;
      } else if (this.menu.href) {
        window.location.href = this.menu.href;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.menu-box {
  position: relative;
  height: 100%;
  // margin-right: 8px;
}
.menu {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  user-select: none;
  cursor: pointer;

  .menu-icon {
    position: relative;
    display: flex;
    align-items: center;
    .img-icon {
      position: relative;
      top: 2px;
    }
    .iconfont {
      font-size: 22px;
    }
  }
  .menu-text {
    flex: 1;
    font-size: 18px;
  }
  .menu-sub {
    line-height: 36px;
  }
  .sub-icon {
    line-height: 40px;
  }
  .deg90 {
    transform: rotate(90deg);
    transition: transform 0.2s;
  }

  .menu-text-active {
    // color: #30f2cb !important;
  }
}
.menu:hover {
  background: linear-gradient(180deg, #318af0, #33b7e3);
}
.mr-9 {
  margin-right: 9px;
}
.sub-menu-box {
  width: 145px;
  background: transparent;
  position: absolute;
  left: 10px;
  top: 60px;
  padding-top: 12px;
}
.sub-menu {
  position: relative;
  background: #fff;
  box-shadow: 2px 3px 8px 0px rgba(29, 37, 63, 0.15);
  border-radius: 4px;
  padding: 10px 20px;
  .menu-box {
    background: #fff;
    .menu {
      padding: 0;
    }
    .menu-text {
      color: #666666 !important;
      font-size: 16px;
      padding: 10px 0;
    }
    .menu-icon {
      display: none;
    }
    .menu:hover {
      background: #fff;
    }
  }
  .current-menu {
    .menu-text {
      color: #1678ff !important;
    }
  }
}
.sub-menu::before {
  content: "";
  position: absolute;
  top: -16px;
  border: 8px solid transparent;
  border-bottom: 8px solid #fff;
  z-index: 10;
}
// 当前路由
.current-menu {
  background: linear-gradient(180deg, #318af0, #33b7e3);
}
</style>
