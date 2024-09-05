<template>
  <div class="business-portraits">
    <business-info />
    <!-- <a-tabs class="business-portraits-tabs" default-active-key="1">
      <a-tab-pane key="1" tab="企业画像">
        
      </a-tab-pane>
      <a-tab-pane key="2" tab="企业风险感知">企业风险感知</a-tab-pane>
    </a-tabs> -->
  </div>
</template>
<script>
// import { Tabs } from "ant-design-vue";
import BusinessInfo from "./businessInfo";

// const { TabPane } = Tabs;

export default {
  name: "BusinessPortraits",
  data() {
    return {};
  },
  components: {
    // ATabPane: TabPane,
    // ATabs: Tabs,
    BusinessInfo,
  },
  mounted() {},
  methods: {},
};
</script>
<style lang="less">
.business-portraits {
  width: 100%;
  min-height: 100%;

  &-box {
    padding: 24px;
  }

  &-tabs {
    width: 100%;
    position: absolute;
    top: 38px;
  }
}
</style>
