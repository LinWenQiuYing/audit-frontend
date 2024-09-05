<template>
  <div class="graph-manage">
    <MainContent title="图谱管理">
      <template slot="content">
        <List
          v-if="!isDetailShow"
          @detailsChanged="detailsChanged"
          @isDetailShowChanged="isDetailShowChanged"
        />
        <History
          :details="details"
          v-else
          @isDetailShowChanged="isDetailShowChanged"
        />
      </template>
    </MainContent>
  </div>
</template>

<script>
import MainContent from "@/components/mainContent";
import List from "./list.vue";
import History from "./history.vue";

export default {
  name: "GraphManage",
  data() {
    return {
      details: {},
      isDetailShow: false,
    };
  },
  components: {
    MainContent,
    List,
    History,
  },
  methods: {
    detailsChanged(value) {
      this.details = value;
    },
    isDetailShowChanged(value) {
      this.isDetailShow = value;
    },
  },
};
</script>

<style scoped lang="less">
.graph-manage {
  width: 100%;
  height: 100%;
}
</style>
