<template>
  <div class="rights-manage">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: "RightsManage",
  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang="less" scoped>
.rights-manage {
  background: #fff;
  padding: 16px;
  width: 100%;
  border-radius: 5px;
  height: calc(100% - 4px);
  margin: 2px;
  box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.16);
}
</style>
