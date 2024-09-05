<template>
  <div class="affair-graph">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: "AffairGraph",
  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang="less" scoped>
.affair-graph {
  width: 100%;
  min-height: 600px;
  background: #fff;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  height: calc(100% - 4px);
  margin: 2px;
  box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.16);
}
</style>
