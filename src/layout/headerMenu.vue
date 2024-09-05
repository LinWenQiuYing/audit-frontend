<template>
  <div class="center-menu-tree">
    <menuTree
      v-for="(item, index) in menu"
      :key="index"
      :menu="item"
      :index="1"
    >
    </menuTree>
  </div>
</template>

<script>
import menuTree from "./menu.vue";
export default {
  components: {
    menuTree,
  },
  props: {
    menu: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.center-menu-tree {
  height: 100%;
  min-height: 100%;
  background: transparent;
  min-width: 100px;
  display: flex;
  align-items: center;
  padding-bottom: 12px;
}
</style>
