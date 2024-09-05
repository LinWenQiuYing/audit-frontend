<template>
  <div class="asserts-analysis">
    <MainContent title="资产分析">
      <template slot="right">
        <a-select
          placeholder="请选择"
          v-model="curYear"
          :options="yearOptions"
        />
        <!-- @change="handleYearChange" -->
      </template>
      <template slot="content">
        <router-view></router-view>
      </template>
    </MainContent>
    <!-- <AssertsMain></AssertsMain> -->
  </div>
</template>
<script>
// import AssertsMain from "./components/assertsMain.vue";
import MainContent from "@/components/mainContent";
import { mapMutations, mapState } from "vuex";

export default {
  name: "AssertsAnalysis",
  data() {
    return {
      yearOptions: [
        {
          value: "2021",
          label: "2021",
        },
        {
          value: "2022",
          label: "2022",
        },
        {
          value: "2023",
          label: "2023",
        },
        {
          value: "2024",
          label: "2024",
        },
      ],
    };
  },
  components: {
    // AssertsMain,
    MainContent,
  },
  computed: {
    ...mapState("blockAnalysis", ["blockChoosedYear"]),
    curYear: {
      get() {
        return this.blockChoosedYear;
      },
      set(val) {
        this.setBlockChoosedYear(val);
      },
    },
  },
  methods: {
    ...mapMutations("blockAnalysis", {
      setBlockChoosedYear: "setBlockChoosedYear",
    }),
    handleYearChange() {
      console.log("handleYearChange");
    },
  },
};
</script>
<style lang="less">
.asserts-analysis {
  width: 100%;
  height: 100%;
}
</style>
