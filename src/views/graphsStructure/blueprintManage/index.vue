<template>
  <div class="blueprint-manage">
    <MainContent title="蓝图定义">
      <template slot="content">
        <List
          v-if="!isDetailShow"
          ref="list"
          @detailsChanged="detailsChanged"
          @isDetailsShowChanged="isDetailsShowChanged"
        />
        <Details
          v-if="isDetailShow"
          :details="details"
          :detailsType="detailsType"
          @isDetailsShowChanged="isDetailsShowChanged"
        />
      </template>
    </MainContent>
  </div>
</template>

<script>
import MainContent from "@/components/mainContent";
import Details from "./details.vue";
import List from "./list.vue";

export default {
  name: "BlueprintManage",
  data() {
    return {
      details: {},
      isDetailShow: false,
      detailsType: undefined,
    };
  },
  components: {
    Details,
    List,
    MainContent,
  },
  methods: {
    isDetailsShowChanged(value, type, isSearch) {
      this.detailsType = type;
      this.isDetailShow = value;
      if (isSearch) {
        this.$nextTick(() => {
          this.$refs.list.onReset();
        });
      }
    },
    detailsChanged(value) {
      console.log("🚀 ~ detailsChanged ~ detailsChanged:", value);

      this.details = value;
    },
  },
};
</script>

<style scoped lang="less">
.blueprint-manage {
  width: 100%;
  height: 100%;
}
</style>
