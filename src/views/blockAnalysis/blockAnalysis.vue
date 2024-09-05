<template>
  <div class="block-analysis" id="block-analysis">
    <MainContent title="行政事业板块分析">
      <template slot="right">
        <div style="display: flex; align-items: center">
          时间：<a-select
            placeholder="请选择"
            v-model="curYear"
            :options="yearOptions"
          />
        </div>
      </template>
      <template slot="content">
        <router-view></router-view>
      </template>
    </MainContent>
  </div>
</template>
<script>
import MainContent from "@/components/mainContent";
import { Select } from "ant-design-vue";
import { mapMutations, mapState } from "vuex";

export default {
  name: "blockAnalysis",
  data() {
    return {
      yearOptions: [
        {
          value: "2020",
          label: "2020",
        },
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
  components: {
    ASelect: Select,
    MainContent,
  },
  methods: {
    ...mapMutations("blockAnalysis", {
      setBlockChoosedYear: "setBlockChoosedYear",
    }),
  },
};
</script>
<style lang="less">
.block-analysis {
  width: 100%;
  height: 100%;
}
</style>
